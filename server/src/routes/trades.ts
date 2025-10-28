import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all trades
router.get('/', authenticate, async (req, res) => {
  try {
    const { limit = 50, offset = 0, symbol, status } = req.query;

    const where: any = { userId: req.user!.id };
    if (symbol) where.symbol = symbol;
    if (status) where.status = status;

    const trades = await prisma.trade.findMany({
      where,
      orderBy: { openTime: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    const total = await prisma.trade.count({ where });

    res.json({ trades, total });
  } catch (error) {
    console.error('Get trades error:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

// Get trade statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: req.user!.id }
    });

    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.pnl > 0).length;
    const losingTrades = trades.filter(t => t.pnl < 0).length;
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    const avgWin = winningTrades > 0
      ? trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / winningTrades
      : 0;

    const avgLoss = losingTrades > 0
      ? Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / losingTrades)
      : 0;

    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

    res.json({
      totalTrades,
      winningTrades,
      losingTrades,
      totalPnL,
      winRate,
      avgWin,
      avgLoss,
      profitFactor
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Create trade
router.post('/', authenticate, async (req, res) => {
  try {
    const trade = await prisma.trade.create({
      data: {
        ...req.body,
        userId: req.user!.id
      }
    });

    res.json({ trade });
  } catch (error) {
    console.error('Create trade error:', error);
    res.status(500).json({ error: 'Failed to create trade' });
  }
});

// Update trade
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const trade = await prisma.trade.update({
      where: {
        id,
        userId: req.user!.id
      },
      data: req.body
    });

    res.json({ trade });
  } catch (error) {
    console.error('Update trade error:', error);
    res.status(500).json({ error: 'Failed to update trade' });
  }
});

export default router;
