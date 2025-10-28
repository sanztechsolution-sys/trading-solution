import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// Get all webhooks
router.get('/', authenticate, async (req, res) => {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ webhooks });
  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({ error: 'Failed to fetch webhooks' });
  }
});

// Create webhook
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, symbol, description } = req.body;

    // Generate API key
    const apiKey = `wh_${crypto.randomBytes(32).toString('hex')}`;

    const webhook = await prisma.webhook.create({
      data: {
        userId: req.user!.id,
        name,
        symbol,
        description,
        apiKey,
        isActive: true
      }
    });

    res.json({ webhook });
  } catch (error) {
    console.error('Create webhook error:', error);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
});

// Update webhook
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, symbol, description, isActive } = req.body;

    const webhook = await prisma.webhook.update({
      where: {
        id,
        userId: req.user!.id
      },
      data: {
        name,
        symbol,
        description,
        isActive
      }
    });

    res.json({ webhook });
  } catch (error) {
    console.error('Update webhook error:', error);
    res.status(500).json({ error: 'Failed to update webhook' });
  }
});

// Delete webhook
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.webhook.delete({
      where: {
        id,
        userId: req.user!.id
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete webhook error:', error);
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
});

// Regenerate API key
router.post('/:id/regenerate-key', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const apiKey = `wh_${crypto.randomBytes(32).toString('hex')}`;

    const webhook = await prisma.webhook.update({
      where: {
        id,
        userId: req.user!.id
      },
      data: { apiKey }
    });

    res.json({ webhook });
  } catch (error) {
    console.error('Regenerate key error:', error);
    res.status(500).json({ error: 'Failed to regenerate API key' });
  }
});

export default router;
