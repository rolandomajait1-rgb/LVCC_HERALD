// Smoke Test - Critical Functionality
const axios = require('axios');

const config = {
  baseURL: process.env.API_URL || 'https://your-backend-url.com/api',
  timeout: 10000
};

class SmokeTest {
  constructor() {
    this.results = [];
    this.token = null;
  }

  async test(name, testFn) {
    try {
      console.log(`🧪 Testing: ${name}`);
      await testFn();
      this.results.push({ name, status: '✅ PASS' });
    } catch (error) {
      this.results.push({ name, status: '❌ FAIL', error: error.message });
    }
  }

  async testAuth() {
    const response = await axios.post(`${config.baseURL}/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    if (response.status !== 200) throw new Error('Login failed');
    this.token = response.data.token;
  }

  async testArticles() {
    const response = await axios.get(`${config.baseURL}/articles`);
    if (response.status !== 200) throw new Error('Articles fetch failed');
  }

  async testSearch() {
    const response = await axios.get(`${config.baseURL}/articles/search?query=test`);
    if (response.status !== 200) throw new Error('Search failed');
  }

  async run() {
    console.log('🚀 Starting Smoke Tests\n');
    
    await this.test('Authentication', () => this.testAuth());
    await this.test('Articles API', () => this.testArticles());
    await this.test('Search API', () => this.testSearch());

    const passed = this.results.filter(r => r.status.includes('PASS')).length;
    console.log(`\n🎯 Summary: ${passed}/${this.results.length} tests passed`);
  }
}

new SmokeTest().run().catch(console.error);