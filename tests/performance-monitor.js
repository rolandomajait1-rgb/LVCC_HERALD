// Performance Monitor
const axios = require('axios');

const config = {
  baseURL: process.env.API_URL || 'https://your-backend-url.com/api',
  frontendURL: process.env.FRONTEND_URL || 'https://your-frontend-url.com'
};

class PerformanceMonitor {
  async measureEndpoint(name, url) {
    const start = Date.now();
    try {
      const response = await axios.get(url, { timeout: 5000 });
      const duration = Date.now() - start;
      
      console.log(`📊 ${name}: ${duration}ms (${response.status})`);
      
      if (duration > 500) {
        console.log(`⚠️  ${name} is slow (>${duration}ms)`);
      }
      
      return { name, duration, status: response.status, success: true };
    } catch (error) {
      const duration = Date.now() - start;
      console.log(`❌ ${name}: Failed after ${duration}ms`);
      return { name, duration, status: 'ERROR', success: false };
    }
  }

  async run() {
    console.log('📈 Performance Monitoring\n');
    
    const tests = [
      { name: 'Articles List', url: `${config.baseURL}/articles` },
      { name: 'Categories', url: `${config.baseURL}/categories` },
      { name: 'Tags', url: `${config.baseURL}/tags` },
      { name: 'Search', url: `${config.baseURL}/articles/search?query=test` }
    ];

    const results = [];
    for (const test of tests) {
      const result = await this.measureEndpoint(test.name, test.url);
      results.push(result);
    }

    const avgTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    console.log(`\n⏱️  Average Response Time: ${avgTime.toFixed(0)}ms`);
    
    const slowEndpoints = results.filter(r => r.duration > 500);
    if (slowEndpoints.length > 0) {
      console.log(`🐌 Slow Endpoints: ${slowEndpoints.map(e => e.name).join(', ')}`);
    }
  }
}

new PerformanceMonitor().run().catch(console.error);