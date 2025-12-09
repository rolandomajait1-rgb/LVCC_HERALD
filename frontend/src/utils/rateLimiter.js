// Rate limiter for authentication attempts
class RateLimiter {
  constructor() {
    this.attempts = new Map();
  }

  canAttempt(key) {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) return true;

    if (now > record.blockedUntil) {
      this.attempts.delete(key);
      return true;
    }

    return false;
  }

  recordAttempt(key, success) {
    const now = Date.now();
    const record = this.attempts.get(key) || { count: 0, blockedUntil: 0 };

    if (success) {
      this.attempts.delete(key);
      return;
    }

    record.count++;
    
    // Exponential backoff: 3 attempts = 30s, 5 attempts = 2min, 7+ attempts = 5min
    if (record.count >= 7) {
      record.blockedUntil = now + 5 * 60 * 1000;
    } else if (record.count >= 5) {
      record.blockedUntil = now + 2 * 60 * 1000;
    } else if (record.count >= 3) {
      record.blockedUntil = now + 30 * 1000;
    }

    this.attempts.set(key, record);
  }

  getBlockedTime(key) {
    const record = this.attempts.get(key);
    if (!record || Date.now() > record.blockedUntil) return 0;
    return Math.ceil((record.blockedUntil - Date.now()) / 1000);
  }
}

export default new RateLimiter();
