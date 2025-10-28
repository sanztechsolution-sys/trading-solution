// WebSocket client for real-time updates

import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export interface TradeUpdate {
  tradeId: string;
  currentPrice: number;
  pnl: number;
  status: string;
}

export interface SignalReceived {
  webhookId: string;
  signal: any;
  timestamp: string;
}

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Set<Function>> = new Map();

  /**
   * Connect to WebSocket server
   */
  connect(apiKey: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      auth: {
        apiKey,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected', true);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.emit('connected', false);
    });

    this.socket.on('trade:update', (data: TradeUpdate) => {
      this.emit('trade:update', data);
    });

    this.socket.on('signal:received', (data: SignalReceived) => {
      this.emit('signal:received', data);
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });
  }

  /**
   * Subscribe to events
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Send message to server
   */
  send(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export const wsClient = new WebSocketClient();
export default wsClient;
