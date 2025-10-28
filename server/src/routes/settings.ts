import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get user settings
router.get('/', authenticate, async (req, res) => {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { userId: req.user!.id }
    });

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: req.user!.id,
          maxRiskPerTrade: 2,
          maxDailyLoss: 5,
          maxOpenTrades: 5,
          emailNotifications: true,
          tradeAlerts: true,
          errorAlerts: true,
          dailyReport: false,
          autoTrading: true,
          trailingStop: true,
          breakeven: true
        }
      });
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
router.patch('/', authenticate, async (req, res) => {
  try {
    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user!.id },
      update: req.body,
      create: {
        userId: req.user!.id,
        ...req.body
      }
    });

    res.json({ settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
