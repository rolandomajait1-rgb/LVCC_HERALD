// Test utility to verify article flow is working
import axios from './axiosConfig';

export const testArticleFlow = async () => {
  try {
    console.log('Testing article flow...');
    
    // Test 1: Fetch articles list
    console.log('1. Testing articles list...');
    const articlesResponse = await axios.get('/api/articles/public');
    console.log('✅ Articles list loaded:', articlesResponse.data.data?.length || 0, 'articles');
    
    // Test 2: Try to fetch a specific article by slug (if any exist)
    if (articlesResponse.data.data && articlesResponse.data.data.length > 0) {
      const firstArticle = articlesResponse.data.data[0];
      console.log('2. Testing article detail for slug:', firstArticle.slug);
      
      try {
        const articleResponse = await axios.get(`/api/articles/by-slug/${firstArticle.slug}`);
        console.log('✅ Article detail loaded:', articleResponse.data.title);
      } catch (error) {
        console.log('❌ Article detail failed:', error.response?.status, error.response?.data?.message);
      }
    } else {
      console.log('⚠️ No articles found to test detail view');
    }
    
    // Test 3: Test invalid article slug
    console.log('3. Testing invalid article slug...');
    try {
      await axios.get('/api/articles/by-slug/non-existent-article');
      console.log('❌ Should have failed for non-existent article');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Correctly returned 404 for non-existent article');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }
    
    console.log('Article flow test completed!');
    return true;
  } catch (error) {
    console.error('❌ Article flow test failed:', error);
    return false;
  }
};