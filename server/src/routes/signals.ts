import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { validateApiKey } from '../middleware/auth';
import { broadcastToClients } from '../websocket';

const router = Router();
const prisma = new PrismaClient();

// Validation schema
const signalSchema = z.object({
  action: z.enum(['buy', 'sell', 'close']),
  symbol: z.string().min(1),
  price: z.number().positive(),
  sl: z.number().positive().optional(),
  tp: z.array(z.number().positive()).optional(),
  tp_percentages: z.array(z.number().positive()).optional(),
  risk: z.number().positive().optional(),
  trailing_activation: z.number().positive().optional(),
  trailing_distance: z.number().positive().optional(),
  order_type: z.enum(['market', 'limit', 'stop']).optional(),
  timestamp: z.string()
});

// Receive webhook signal
router.post('/receive', validateApiKey, async (req, res) => {
  try {
    // Validate payload
    const validatedData = signalSchema.parse(req.body);
    
    // Check timestamp (within 5 minutes)
    const signalTime = new Date(validatedData.timestamp);
    const now = new Date();
    const diffMinutes = Math.abs(now.getTime() - signalTime.getTime()) / 60000;
    
    if (diffMinutes > 5) {
      return res.status(400).json({ error: 'Signal timestamp too old' });
    }

    // Get webhook from API key
    const webhook = await prisma.webhook.findFirst({
      where: { apiKey: req.headers['x-api-key'] as string }
    });

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    // Create signal
    const signal = await prisma.signal.create({
      data: {
        webhookId: webhook.id,
        action: validatedData.action,
        symbol: validatedData.symbol,
        price: validatedData.price,
        stopLoss: validatedData.sl,
        takeProfits: validatedData.tp || [],
        tpPercentages: validatedData.tp_percentages || [],
        riskPercentage: validatedData.risk || 2,
        trailingActivation: validatedData.trailing_activation,
        trailingDistance: validatedData.trailing_distance,
        orderType: validatedData.order_type || 'market',
        status: 'pending',
        receivedAt: new Date(validatedData.timestamp)
      }
    });

    // Update webhook stats
    await prisma.webhook.update({
      where: { id: webhook.id },
      data: {
        signalsReceived: { increment: 1 },
        lastSignalAt: new Date()
      }
    });

    // Broadcast to WebSocket clients
    broadcastToClients({
      type: 'signal_received',
      data: signal
    });

    res.json({
      success: true,
      signalId: signal.id,
      message: 'Signal received and queued for processing'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid signal format', details: error.errors });
    }
    console.error('Signal receive error:', error);
    res.status(500).json({ error: 'Failed to process signal' });
  }
});

// Get pending signals for MT5 EA
router.get('/pending', validateApiKey, async (req, res) => {
  try {
    const signals = await prisma.signal.findMany({
      where: {
        status: 'pending',
        webhook: {
          isActive: true
        }
      },
      include: {
        webhook: {
          select: {
            name: true,
            symbol: true
          }
        }
      },
      orderBy: {
        receivedAt: 'asc'
      },
      take: 10
    });

    res.json({ signals });
  } catch (error) {
    console.error('Get pending signals error:', error);
    res.status(500).json({ error: 'Failed to fetch signals' });
  }
});

// Update signal status
router.patch('/:id/status', validateApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ticket, error } = req.body;

    const signal = await prisma.signal.update({
      where: { id },
      data: {
        status,
        mt5Ticket: ticket,
        error,
        processedAt: status !== 'pending' ? new Date() : undefined
      }
    });

    // Broadcast update
    broadcastToClients({
      type: 'signal_updated',
      data: signal
    });

    res.json({ success: true, signal });
  } catch (error) {
    console.error('Update signal error:', error);
    res.status(500).json({ error: 'Failed to update signal' });
  }
});

// Get signal history
router.get('/history', validateApiKey, async (req, res) => {
  try {
    const { limit = 50, offset = 0, status, symbol } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (symbol) where.symbol = symbol;

    const signals = await prisma.signal.findMany({
      where,
      include: {
        webhook: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        receivedAt: 'desc'
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    const total = await prisma.signal.count({ where });

    res.json({ signals, total });
  } catch (error) {
    console.error('Get signal history error:', error);
    res.status(500).json({ error: 'Failed to fetch signal history' });
  }
});

export default router;
