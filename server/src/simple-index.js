const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: ['https://trading-solution.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Trading Backend API is running!'
  });
});

// Basic API routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'active',
    version: '1.0.0',
    database: 'connected'
  });
});

app.post('/api/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.json({ 
    success: true, 
    message: 'Webhook received',
    data: req.body 
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Simple Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;