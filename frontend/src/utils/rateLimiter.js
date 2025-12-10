class RateLimiter {
  constructor() {
    this.attempts = new Map();
    this.maxAttempts = 5;
    this.blockDuration = 300000; // 5 minutes
  }

  canAttempt(key) {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record) return true;
    
    if (now - record.lastAttempt > this.blockDuration) {
      this.attempts.delete(key);
      return true;
    }
    
    return record.count < this.maxAttempts;
  }

  recordAttempt(key, success) {
    const now = Date.now();
    const record = this.attempts.get(key) || { count: 0, lastAttempt: now };
    
    if (success) {
      this.attempts.delete(key);
    } else {
      record.count++;
      record.lastAttempt = now;
      this.attempts.set(key, record);
    }
  }

  getBlockedTime(key) {
    const record = this.attempts.get(key);
    if (!record) return 0;
    
    const remaining = this.blockDuration - (Date.now() - record.lastAttempt);
    return Math.ceil(remaining / 1000);
  }
}

export default new RateLimiter();