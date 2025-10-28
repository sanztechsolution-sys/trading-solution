// TypeScript Types for Trading Automation Platform

export interface User {
  id: string;
  email: string;
  apiKey: string;
  mt5Account?: string;
  mt5Server?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Webhook {
  id: string;
  userId: string;
  name: string;
  urlPath: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trade {
  id: string;
  webhookId: string;
  symbol: string;
  action: 'buy' | 'sell' | 'close';
  orderType: 'market' | 'limit';
  entryPrice: number;
  currentPrice?: number;
  stopLoss: number;
  status: 'pending' | 'active' | 'closed' | 'failed';
  lotSize: number;
  pnl: number;
  commission: number;
  swap: number;
  openTime: Date;
  closeTime?: Date;
  mt5Ticket?: string;
  trailingActivation?: number;
  trailingDistance?: number;
  trailingActive: boolean;
  breakEvenMoved: boolean;
}

export interface TakeProfit {
  id: string;
  tradeId: string;
  level: number;
  price: number;
  percentage: number;
  executed: boolean;
  executedAt?: Date;
}

export interface Log {
  id: string;
  webhookId?: string;
  tradeId?: string;
  action: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: any;
  timestamp: Date;
}

export interface Settings {
  id: string;
  userId: string;
  maxRiskPerTrade: number;
  dailyLossLimit: number;
  trailingEnabled: boolean;
  autoTrading: boolean;
  partialTpEnabled: boolean;
  breakEvenEnabled: boolean;
  maxOpenTrades: number;
  createdAt: Date;
  updatedAt: Date;
}

// TradingView Webhook Payload
export interface TradingViewSignal {
  action: 'buy' | 'sell' | 'close';
  symbol: string;
  price: number;
  sl: number;
  tp: number[];
  tp_percentages?: number[];
  risk: number;
  trailing_activation?: number;
  trailing_distance?: number;
  order_type?: 'market' | 'limit';
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalTrades: number;
  activeTrades: number;
  closedTrades: number;
  winRate: number;
  totalPnL: number;
  todayPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
}

// Trade with relations
export interface TradeWithDetails extends Trade {
  takeProfits: TakeProfit[];
  webhook: Webhook;
}
