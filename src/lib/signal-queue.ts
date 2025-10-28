// Signal queue management

import { TradingViewSignal } from '@/types';

export interface QueuedSignal {
  id: string;
  webhookId: string;
  signal: TradingViewSignal;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  processedAt?: Date;
  error?: string;
}

class SignalQueue {
  private queue: QueuedSignal[] = [];
  private processing: boolean = false;
  private maxConcurrent: number = 5;
  private currentProcessing: number = 0;

  /**
   * Add signal to queue
   */
  enqueue(webhookId: string, signal: TradingViewSignal): string {
    const queuedSignal: QueuedSignal = {
      id: this.generateId(),
      webhookId,
      signal,
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date(),
    };

    this.queue.push(queuedSignal);
    this.processQueue();

    return queuedSignal.id;
  }

  /**
   * Process queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.currentProcessing >= this.maxConcurrent) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && this.currentProcessing < this.maxConcurrent) {
      const signal = this.queue.find(s => s.status === 'pending');
      
      if (!signal) break;

      signal.status = 'processing';
      this.currentProcessing++;

      // Process signal asynchronously
      this.processSignal(signal)
        .then(() => {
          signal.status = 'completed';
          signal.processedAt = new Date();
          this.currentProcessing--;
          this.removeFromQueue(signal.id);
          this.processQueue(); // Continue processing
        })
        .catch((error) => {
          signal.attempts++;
          
          if (signal.attempts >= signal.maxAttempts) {
            signal.status = 'failed';
            signal.error = error.message;
            this.removeFromQueue(signal.id);
          } else {
            signal.status = 'pending';
          }
          
          this.currentProcessing--;
          this.processQueue(); // Continue processing
        });
    }

    this.processing = false;
  }

  /**
   * Process individual signal
   */
  private async processSignal(queuedSignal: QueuedSignal): Promise<void> {
    // This will be implemented in the next phase
    // For now, simulate processing
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Processing signal:', queuedSignal.signal);
        resolve();
      }, 1000);
    });
  }

  /**
   * Remove signal from queue
   */
  private removeFromQueue(id: string): void {
    const index = this.queue.findIndex(s => s.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      total: this.queue.length,
      pending: this.queue.filter(s => s.status === 'pending').length,
      processing: this.queue.filter(s => s.status === 'processing').length,
      completed: this.queue.filter(s => s.status === 'completed').length,
      failed: this.queue.filter(s => s.status === 'failed').length,
    };
  }

  /**
   * Get signal by ID
   */
  getSignal(id: string): QueuedSignal | undefined {
    return this.queue.find(s => s.id === id);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const signalQueue = new SignalQueue();
export default signalQueue;
