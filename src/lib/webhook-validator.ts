// Webhook validation and security utilities

import { TradingViewSignal } from '@/types';

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') return false;
  
  // Check format: sk_live_[alphanumeric]
  const apiKeyRegex = /^sk_live_[a-zA-Z0-9]{20,}$/;
  return apiKeyRegex.test(apiKey);
}

/**
 * Validate webhook signature (HMAC)
 */
export function validateSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // In production, implement HMAC-SHA256 signature verification
  // For now, basic validation
  return signature && signature.length > 0;
}

/**
 * Validate TradingView signal payload
 */
export function validateSignalPayload(payload: any): {
  valid: boolean;
  errors: string[];
  sanitized?: TradingViewSignal;
} {
  const errors: string[] = [];

  // Required fields
  if (!payload.action || !['buy', 'sell', 'close'].includes(payload.action)) {
    errors.push('Invalid action. Must be: buy, sell, or close');
  }

  if (!payload.symbol || typeof payload.symbol !== 'string') {
    errors.push('Symbol is required');
  }

  // For buy/sell actions
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

    if (payload.tp && !payload.tp.every((tp: any) => typeof tp === 'number' && tp > 0)) {
      errors.push('All take profit levels must be positive numbers');
    }

    if (typeof payload.risk !== 'number' || payload.risk <= 0 || payload.risk > 100) {
      errors.push('Risk must be between 0 and 100');
    }

    // Validate TP percentages if provided
    if (payload.tp_percentages) {
      if (!Array.isArray(payload.tp_percentages)) {
        errors.push('TP percentages must be an array');
      } else if (payload.tp_percentages.length !== payload.tp.length) {
        errors.push('TP percentages length must match TP levels');
      } else {
        const sum = payload.tp_percentages.reduce((a: number, b: number) => a + b, 0);
        if (Math.abs(sum - 100) > 0.01) {
          errors.push('TP percentages must sum to 100');
        }
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize and return
  const sanitized: TradingViewSignal = {
    action: payload.action,
    symbol: payload.symbol.toUpperCase(),
    price: payload.price || 0,
    sl: payload.sl || 0,
    tp: payload.tp || [],
    tp_percentages: payload.tp_percentages || distributeTPPercentages(payload.tp?.length || 0),
    risk: payload.risk || 2,
    trailing_activation: payload.trailing_activation,
    trailing_distance: payload.trailing_distance,
    order_type: payload.order_type || 'market',
    timestamp: payload.timestamp || new Date().toISOString(),
  };

  return { valid: true, errors: [], sanitized };
}

/**
 * Distribute TP percentages evenly if not provided
 */
function distributeTPPercentages(count: number): number[] {
  if (count === 0) return [];
  const percentage = 100 / count;
  return Array(count).fill(percentage);
}

/**
 * Rate limiting check
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  check(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false; // Rate limit exceeded
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Prevent replay attacks
 */
export function validateTimestamp(timestamp: string, maxAgeMs: number = 300000): boolean {
  try {
    const signalTime = new Date(timestamp).getTime();
    const now = Date.now();
    const age = now - signalTime;

    // Signal must not be older than maxAgeMs (default 5 minutes)
    // and not in the future
    return age >= 0 && age <= maxAgeMs;
  } catch {
    return false;
  }
}

/**
 * Sanitize symbol name
 */
export function sanitizeSymbol(symbol: string): string {
  return symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
}
