# MetaTrader 5 Expert Advisor - Installation Guide

## 📋 TradeSync EA Setup

### Prerequisites
- MetaTrader 5 terminal installed
- Active trading account (demo or live)
- Backend API running

---

## 🚀 Installation Steps

### 1. Copy EA File

Copy `TradeSync_EA.mq5` to your MT5 data folder:

**Windows:**
```
C:\Users\[YourUsername]\AppData\Roaming\MetaQuotes\Terminal\[TerminalID]\MQL5\Experts\
```

**Mac:**
```
~/Library/Application Support/MetaQuotes/Terminal/[TerminalID]/MQL5/Experts/
```

**Or use MT5:**
1. Open MetaEditor (F4 in MT5)
2. File → Open Data Folder
3. Navigate to `MQL5/Experts/`
4. Paste the file

---

### 2. Compile the EA

1. Open MetaEditor (F4)
2. Open `TradeSync_EA.mq5`
3. Click Compile (F7)
4. Check for errors in the Toolbox

---

### 3. Enable WebRequest URLs

**CRITICAL:** MT5 blocks external URLs by default.

1. Tools → Options → Expert Advisors
2. Check "Allow WebRequest for listed URL"
3. Add your backend URL:
   ```
   http://localhost:3001
   https://your-backend-domain.com
   ```
4. Click OK

---

### 4. Configure EA Parameters

Drag the EA onto a chart and configure:

#### Required Settings:
- **API_URL**: Your backend API endpoint
  - Example: `http://localhost:3001/api/mt5/signals`
  
- **API_KEY**: Your unique API key from TradeSync dashboard
  - Example: `sk_live_abc123xyz456`

#### Optional Settings:
- **POLL_INTERVAL**: How often to check for signals (default: 1000ms)
- **MAGIC_NUMBER**: Unique identifier for EA trades (default: 123456)
- **MAX_SLIPPAGE**: Maximum allowed slippage in points (default: 10)
- **ENABLE_TRAILING**: Enable trailing stop (default: true)
- **ENABLE_BREAKEVEN**: Enable breakeven (default: true)
- **LOG_LEVEL**: Logging verbosity (0=None, 1=Error, 2=Info, 3=Debug)

---

### 5. Enable Auto Trading

1. Click "AutoTrading" button in MT5 toolbar (or press Ctrl+E)
2. Button should turn green
3. Check "Experts" tab for EA logs

---

## 🔧 EA Features

### Signal Processing
- ✅ Polls backend API for new signals
- ✅ Executes BUY/SELL orders
- ✅ Closes positions on command
- ✅ Validates lot sizes
- ✅ Normalizes prices

### Risk Management
- ✅ Position size validation
- ✅ Stop loss enforcement
- ✅ Take profit levels
- ✅ Slippage control

### Advanced Features
- ✅ **Trailing Stop**: Automatically moves SL as price moves in profit
- ✅ **Breakeven**: Moves SL to entry price after X points profit
- ✅ **Multiple TP Levels**: Supports partial profit taking
- ✅ **Error Handling**: Retry logic and error logging

---

## 📊 Monitoring

### Check EA Status

**Experts Tab:**
```
[INFO] TradeSync EA initialized successfully
[INFO] API URL: http://localhost:3001/api/mt5/signals
[INFO] Magic Number: 123456
[INFO] Polling Interval: 1000ms
```

### Common Log Messages

**Success:**
```
[INFO] Processing signal: buy XAUUSD
[INFO] Opening BUY: XAUUSD Lot: 0.10 SL: 2045.00 TP: 2055.00
[INFO] BUY order executed successfully. Ticket: 123456789
```

**Errors:**
```
[ERROR] WebRequest error: 4060
[ERROR] Failed to execute BUY order: 10015
```

---

## 🐛 Troubleshooting

### Error 4060: Function not allowed
**Solution:** Enable WebRequest URLs (see Step 3)

### Error 10015: Invalid stops
**Solution:** Check your SL/TP levels are valid for the symbol

### Error 10019: Not enough money
**Solution:** Reduce lot size or increase account balance

### No signals received
**Checklist:**
- ✅ Backend API is running
- ✅ API_KEY is correct
- ✅ WebRequest URLs are enabled
- ✅ AutoTrading is enabled
- ✅ Check backend logs for errors

### EA not executing trades
**Checklist:**
- ✅ AutoTrading button is green
- ✅ EA is attached to chart
- ✅ Check Experts tab for errors
- ✅ Verify API connection

---

## 🔐 Security Notes

1. **Never share your API_KEY**
2. **Use demo account for testing**
3. **Monitor EA activity regularly**
4. **Set appropriate risk limits**
5. **Keep backend API secure**

---

## 📈 Performance Tips

1. **Optimize Polling Interval**
   - Lower = faster response, more CPU
   - Higher = slower response, less CPU
   - Recommended: 1000-5000ms

2. **Use Appropriate Magic Number**
   - Unique per EA instance
   - Prevents conflicts with other EAs

3. **Monitor Logs**
   - Set LOG_LEVEL=2 for production
   - Set LOG_LEVEL=3 for debugging

4. **Test on Demo First**
   - Verify all features work
   - Check signal processing
   - Validate risk management

---

## 🔄 Updating the EA

1. Close all positions managed by EA
2. Remove EA from chart
3. Replace file in Experts folder
4. Recompile in MetaEditor
5. Reattach to chart with same settings

---

## 📞 Support

If you encounter issues:

1. Check Experts tab for error messages
2. Verify backend API logs
3. Test with demo account
4. Review this guide
5. Contact support with:
   - Error messages
   - EA settings
   - MT5 version
   - Account type (demo/live)

---

## ⚠️ Disclaimer

- Trading involves risk
- Past performance ≠ future results
- Test thoroughly on demo account
- Use appropriate risk management
- Monitor EA activity regularly
