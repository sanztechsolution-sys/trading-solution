// Risk management and position size calculator

export interface RiskCalculationParams {
  accountBalance: number;
  riskPercentage: number;
  entryPrice: number;
  stopLoss: number;
  symbol: string;
}

export interface RiskCalculationResult {
  lotSize: number;
  riskAmount: number;
  stopLossDistance: number;
  stopLossPoints: number;
  positionValue: number;
  requiredMargin: number;
}

export interface SymbolSpecification {
  contractSize: number;
  tickSize: number;
  tickValue: number;
  minLot: number;
  maxLot: number;
  lotStep: number;
  digits: number;
  point: number;
}

// Symbol specifications database
const SYMBOL_SPECS: Record<string, SymbolSpecification> = {
  EURUSD: {
    contractSize: 100000,
    tickSize: 0.00001,
    tickValue: 1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    digits: 5,
    point: 0.00001,
  },
  GBPUSD: {
    contractSize: 100000,
    tickSize: 0.00001,
    tickValue: 1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    digits: 5,
    point: 0.00001,
  },
  USDJPY: {
    contractSize: 100000,
    tickSize: 0.001,
    tickValue: 0.91,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    digits: 3,
    point: 0.001,
  },
  XAUUSD: {
    contractSize: 100,
    tickSize: 0.01,
    tickValue: 1,
    minLot: 0.01,
    maxLot: 100,
    lotStep: 0.01,
    digits: 2,
    point: 0.01,
  },
  BTCUSD: {
    contractSize: 1,
    tickSize: 0.01,
    tickValue: 0.01,
    minLot: 0.01,
    maxLot: 10,
    lotStep: 0.01,
    digits: 2,
    point: 0.01,
  },
};

/**
 * Get symbol specifications
 */
export function getSymbolSpec(symbol: string): SymbolSpecification {
  const spec = SYMBOL_SPECS[symbol.toUpperCase()];
  
  if (!spec) {
    // Default forex specs
    return {
      contractSize: 100000,
      tickSize: 0.00001,
      tickValue: 1,
      minLot: 0.01,
      maxLot: 100,
      lotStep: 0.01,
      digits: 5,
      point: 0.00001,
    };
  }
  
  return spec;
}

/**
 * Calculate position size based on risk parameters
 */
export function calculatePositionSize(params: RiskCalculationParams): RiskCalculationResult {
  const { accountBalance, riskPercentage, entryPrice, stopLoss, symbol } = params;
  
  // Get symbol specifications
  const spec = getSymbolSpec(symbol);
  
  // Calculate risk amount
  const riskAmount = accountBalance * (riskPercentage / 100);
  
  // Calculate stop loss distance
  const stopLossDistance = Math.abs(entryPrice - stopLoss);
  
  // Calculate stop loss in points
  const stopLossPoints = stopLossDistance / spec.point;
  
  // Calculate lot size
  // Formula: Risk Amount / (Stop Loss Distance * Contract Size * Tick Value)
  let lotSize = riskAmount / (stopLossDistance * spec.contractSize);
  
  // Round to lot step
  lotSize = Math.floor(lotSize / spec.lotStep) * spec.lotStep;
  
  // Enforce min/max lot size
  lotSize = Math.max(spec.minLot, Math.min(spec.maxLot, lotSize));
  
  // Round to 2 decimal places
  lotSize = Math.round(lotSize * 100) / 100;
  
  // Calculate position value
  const positionValue = lotSize * spec.contractSize * entryPrice;
  
  // Calculate required margin (simplified - assumes 1:100 leverage)
  const requiredMargin = positionValue / 100;
  
  return {
    lotSize,
    riskAmount,
    stopLossDistance,
    stopLossPoints,
    positionValue,
    requiredMargin,
  };
}

/**
 * Validate risk parameters
 */
export function validateRiskParameters(params: RiskCalculationParams): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (params.accountBalance <= 0) {
    errors.push('Account balance must be positive');
  }
  
  if (params.riskPercentage <= 0 || params.riskPercentage > 100) {
    errors.push('Risk percentage must be between 0 and 100');
  }
  
  if (params.entryPrice <= 0) {
    errors.push('Entry price must be positive');
  }
  
  if (params.stopLoss <= 0) {
    errors.push('Stop loss must be positive');
  }
  
  if (params.entryPrice === params.stopLoss) {
    errors.push('Entry price and stop loss cannot be the same');
  }
  
  if (!params.symbol || params.symbol.length === 0) {
    errors.push('Symbol is required');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate take profit distribution
 */
export function calculateTPDistribution(
  tpLevels: number[],
  tpPercentages?: number[]
): { level: number; price: number; percentage: number }[] {
  // If no percentages provided, distribute evenly
  if (!tpPercentages || tpPercentages.length !== tpLevels.length) {
    const evenPercentage = 100 / tpLevels.length;
    tpPercentages = Array(tpLevels.length).fill(evenPercentage);
  }
  
  return tpLevels.map((price, index) => ({
    level: index + 1,
    price,
    percentage: tpPercentages![index],
  }));
}

/**
 * Calculate potential profit/loss
 */
export function calculatePotentialPnL(
  action: 'buy' | 'sell',
  entryPrice: number,
  exitPrice: number,
  lotSize: number,
  symbol: string
): number {
  const spec = getSymbolSpec(symbol);
  
  const priceDifference = action === 'buy' 
    ? exitPrice - entryPrice 
    : entryPrice - exitPrice;
  
  return priceDifference * lotSize * spec.contractSize;
}

/**
 * Calculate risk-reward ratio
 */
export function calculateRiskRewardRatio(
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): number {
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  
  if (risk === 0) return 0;
  
  return reward / risk;
}

/**
 * Validate daily loss limit
 */
export function checkDailyLossLimit(
  todayPnL: number,
  accountBalance: number,
  dailyLossLimitPercentage: number
): { exceeded: boolean; remaining: number } {
  const maxLoss = accountBalance * (dailyLossLimitPercentage / 100);
  const remaining = maxLoss + todayPnL; // todayPnL is negative if losing
  
  return {
    exceeded: todayPnL <= -maxLoss,
    remaining: Math.max(0, remaining),
  };
}

/**
 * Check if max open trades exceeded
 */
export function checkMaxOpenTrades(
  currentOpenTrades: number,
  maxOpenTrades: number
): boolean {
  return currentOpenTrades >= maxOpenTrades;
}
