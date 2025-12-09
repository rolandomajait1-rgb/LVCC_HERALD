// Test Data Generator
const axios = require('axios');

const config = {
  baseURL: process.env.API_URL || 'https://your-backend-url.com/api'
};

class TestDataGenerator {
  constructor() {
    this.token = null;
  }

  async authenticate() {
    const response = await axios.post(`${config.baseURL}/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    this.token = response.data.token;
  }

  async createTestUsers() {
    const users = [
      { name: 'Test Admin', email: 'testadmin@test.com', role: 'admin' },
      { name: 'Test Moderator', email: 'testmod@test.com', role: 'moderator' },
      { name: 'Test User', email: 'testuser@test.com', role: 'user' }
    ];

    for (const user of users) {
      try {
        await axios.post(`${config.baseURL}/register`, {
          ...user,
          password: 'testpass123',
          password_confirmation: 'testpass123'
        });
        console.log(`✅ Created user: ${user.email}`);
      } catch (error) {
        console.log(`⚠️  User ${user.email} might already exist`);
      }
    }
  }

  async createTestCategories() {
    const categories = [
      'Breaking News', 'Politics', 'Sports', 'Technology', 'Health'
    ];

    for (const name of categories) {
      try {
        await axios.post(`${config.baseURL}/categories`, 
          { name, description: `Test category for ${name}` },
          { headers: { Authorization: `Bearer ${this.token}` }}
        );
        console.log(`✅ Created category: ${name}`);
      } catch (error) {
        console.log(`⚠️  Category ${name} might already exist`);
      }
    }
  }

  async createTestArticles() {
    const articles = [
      {
        title: 'Test Article 1',
        content: 'This is test content for article 1. It contains enough text to test search functionality.',
        category_id: 1,
        tags: ['test', 'sample'],
        status: 'published'
      },
      {
        title: 'Sample News Story',
        content: 'Another test article with different content to verify search and filtering works properly.',
        category_id: 2,
        tags: ['news', 'sample'],
        status: 'published'
      },
      {
        title: 'Draft Article',
        content: 'This is a draft article for testing unpublished content.',
        category_id: 1,
        tags: ['draft'],
        status: 'draft'
      }
    ];

    for (const article of articles) {
      try {
        await axios.post(`${config.baseURL}/articles`, article, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        console.log(`✅ Created article: ${article.title}`);
      } catch (error) {
        console.log(`❌ Failed to create article: ${article.title}`);
      }
    }
  }

  async run() {
    console.log('🏗️  Generating Test Data\n');
    
    try {
      await this.authenticate();
      console.log('✅ Authenticated\n');
      
      await this.createTestUsers();
      console.log('');
      
      await this.createTestCategories();
      console.log('');
      
      await this.createTestArticles();
      
      console.log('\n🎉 Test data generation complete!');
    } catch (error) {
      console.error('❌ Error generating test data:', error.message);
    }
  }
}

new TestDataGenerator().run().catch(console.error);