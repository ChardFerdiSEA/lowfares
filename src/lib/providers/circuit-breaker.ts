export interface CircuitBreakerOptions {
  failureThreshold?: number; // consecutive failures before opening circuit
  resetTimeoutMs?: number;   // time before attempting half-open state
}

export class CircuitBreaker {
  private failureCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private nextAttempt = Date.now();
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly providerName: string;

  constructor(providerName: string, options?: CircuitBreakerOptions) {
    this.providerName = providerName;
    this.failureThreshold = options?.failureThreshold ?? 3;
    this.resetTimeoutMs = options?.resetTimeoutMs ?? 60000; // 60s
  }

  isOpen(): boolean {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  recordFailure(): void {
    this.failureCount += 1;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeoutMs;
    }
  }

  getState() {
    return {
      provider: this.providerName,
      state: this.state,
      failureCount: this.failureCount,
      nextAttempt: this.nextAttempt > Date.now() ? new Date(this.nextAttempt).toISOString() : null,
    };
  }
}
