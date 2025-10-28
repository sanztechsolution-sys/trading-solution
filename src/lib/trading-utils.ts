// Utility functions for trading calculations

/**
 * Calculate position size based on risk parameters
 * @param accountBalance - Current account balance
 * @param riskPercentage - Risk percentage (e.g., 2 for 2%)
 * @param entryPrice - Entry price
 * @param stopLoss - Stop loss price
 * @param contractSize - Contract size (e.g., 100000 for forex)
 * @param tickValue - Tick value for the symbol
 * @returns Lot size
 */
export function calculatePositionSize(
  accountBalance: number,
  riskPercentage: number,
  entryPrice: number,
  stopLoss: number,
  contractSize: number = 100000,
  tickValue: number = 10
): number {
  const riskAmount = accountBalance * (riskPercentage / 100);
  const stopLossDistance = Math.abs(entryPrice - stopLoss);
  const lotSize = riskAmount / (stopLossDistance * contractSize * tickValue);
  
  // Round to 2 decimal places
  return Math.round(lotSize * 100) / 100;
}

/**
 * Calculate P&L for a trade
 * @param action - Trade action (buy/sell)
 * @param entryPrice - Entry price
 * @param currentPrice - Current price
 * @param lotSize - Lot size
 * @param contractSize - Contract size
 * @returns P&L amount
 */
export function calculatePnL(
  action: 'buy' | 'sell',
  entryPrice: number,
  currentPrice: number,
  lotSize: number,
  contractSize: number = 100000
): number {
  const priceDifference = action === 'buy' 
    ? currentPrice - entryPrice 
    : entryPrice - currentPrice;
  
  return priceDifference * lotSize * contractSize;
}

/**
 * Calculate win rate
 * @param wins - Number of winning trades
 * @param losses - Number of losing trades
 * @returns Win rate percentage
 */
export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return (wins / total) * 100;
}

/**
 * Calculate profit factor
 * @param grossProfit - Total profit from winning trades
 * @param grossLoss - Total loss from losing trades
 * @returns Profit factor
 */
export function calculateProfitFactor(grossProfit: number, grossLoss: number): number {
  if (grossLoss === 0) return grossProfit > 0 ? Infinity : 0;
  return grossProfit / Math.abs(grossLoss);
}

/**
 * Format currency
 * @param amount - Amount to format
 * @param currency - Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage
 * @param value - Value to format
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Check if trailing stop should be activated
 * @param action - Trade action
 * @param entryPrice - Entry price
 * @param currentPrice - Current price
 * @param activationPips - Activation distance in pips
 * @param pipValue - Pip value (e.g., 0.0001 for forex)
 * @returns Boolean indicating if trailing should activate
 */
export function shouldActivateTrailing(
  action: 'buy' | 'sell',
  entryPrice: number,
  currentPrice: number,
  activationPips: number,
  pipValue: number = 0.0001
): boolean {
  const priceDifference = action === 'buy' 
    ? currentPrice - entryPrice 
    : entryPrice - currentPrice;
  
  const pipsInProfit = priceDifference / pipValue;
  return pipsInProfit >= activationPips;
}

/**
 * Calculate new trailing stop loss
 * @param action - Trade action
 * @param currentPrice - Current price
 * @param trailingDistance - Trailing distance in pips
 * @param pipValue - Pip value
 * @returns New stop loss price
 */
export function calculateTrailingStopLoss(
  action: 'buy' | 'sell',
  currentPrice: number,
  trailingDistance: number,
  pipValue: number = 0.0001
): number {
  const distance = trailingDistance * pipValue;
  return action === 'buy' 
    ? currentPrice - distance 
    : currentPrice + distance;
}

/**
 * Validate TradingView signal payload
 * @param payload - Signal payload
 * @returns Validation result
 */
export function validateSignal(payload: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!payload.action || !['buy', 'sell', 'close'].includes(payload.action)) {
    errors.push('Invalid action. Must be buy, sell, or close');
  }

  if (!payload.symbol || typeof payload.symbol !== 'string') {
    errors.push('Symbol is required and must be a string');
  }

  if (payload.action !== 'close') {
    if (typeof payload.price !== 'number' || payload.price <= 0) {
      errors.push('Price must be a positive number');
    }

    if (typeof payload.sl !== 'number' || payload.sl <= 0) {
      errors.push('Stop loss must be a positive number');
    }

    if (!Array.isArray(payload.tp) || payload.tp.length === 0) {
      errors.push('Take profit must be a non-empty array');
    }

    if (typeof payload.risk !== 'number' || payload.risk <= 0 || payload.risk > 100) {
      errors.push('Risk must be between 0 and 100');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
