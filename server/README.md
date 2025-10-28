# Trading Automation Backend

Express.js backend API for Trading Automation Platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Random secret key for JWT
- `API_KEY_SECRET` - Secret for API key generation
- `FRONTEND_URL` - Your frontend URL

### 3. Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:3001`

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Webhooks
- `GET /api/webhooks` - Get all webhooks
- `POST /api/webhooks` - Create webhook
- `PATCH /api/webhooks/:id` - Update webhook
- `DELETE /api/webhooks/:id` - Delete webhook
- `POST /api/webhooks/:id/regenerate-key` - Regenerate API key

### Signals
- `POST /api/signals/receive` - Receive TradingView signal
- `GET /api/signals/pending` - Get pending signals (for MT5)
- `PATCH /api/signals/:id/status` - Update signal status
- `GET /api/signals/history` - Get signal history

### Trades
- `GET /api/trades` - Get all trades
- `GET /api/trades/stats` - Get trade statistics
- `POST /api/trades` - Create trade
- `PATCH /api/trades/:id` - Update trade

### Settings
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update settings

---

## 🔐 Authentication

### JWT Token
Include in headers:
```
Authorization: Bearer <token>
```

### API Key (for webhooks)
Include in headers:
```
X-API-Key: <webhook-api-key>
```

---

## 📡 WebSocket

Connect to: `ws://localhost:3001`

### Events:
- `connected` - Connection established
- `signal_received` - New signal received
- `signal_updated` - Signal status updated
- `trade_opened` - New trade opened
- `trade_closed` - Trade closed
- `heartbeat` - Keep-alive ping

---

## 🚀 Deployment

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

### Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Add environment variables
5. Deploy

### DigitalOcean
```bash
# SSH to droplet
ssh root@your-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Clone repo
git clone <your-repo>
cd server

# Install dependencies
npm install

# Build
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name trading-api
pm2 save
pm2 startup
```

---

## 🔧 Environment Variables

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
API_KEY_SECRET=your-secret
FRONTEND_URL=https://your-frontend.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📊 Database Schema

See `prisma/schema.prisma` for complete schema.

Tables:
- `User` - User accounts
- `Webhook` - Webhook configurations
- `Signal` - Trading signals
- `Trade` - Executed trades
- `UserSettings` - User preferences

---

## 🧪 Testing

Test webhook endpoint:
```bash
curl -X POST http://localhost:3001/api/signals/receive \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-webhook-key" \
  -d '{
    "action": "buy",
    "symbol": "XAUUSD",
    "price": 2050.50,
    "sl": 2045.00,
    "tp": [2055.00],
    "timestamp": "2025-01-28T12:00:00Z"
  }'
```

---

## 📝 Notes

- Use PostgreSQL for production
- Enable HTTPS in production
- Configure CORS properly
- Set strong JWT secret
- Monitor rate limits
- Backup database regularly

---

## 🎯 Production Checklist

- [ ] Configure DATABASE_URL
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Load testing
- [ ] Security audit
