import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';

export default function LatestArticles({ onArticleClick }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/articles/public', {
          params: { latest: true, limit: 6 },
        });
        const articlesData = response.data.data || response.data || [];
        setArticles(Array.isArray(articlesData) ? articlesData : []);
      } catch (err) {
        console.error('Error fetching latest articles:', err);
        setError('Failed to load latest articles. Please try again later.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  return (
    <section id="articles" aria-labelledby="articles-heading" className="py-16 bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <h2 id="articles-heading" className="text-5xl text-gray-800 text-center font-serif mb-4">
          Latest Articles
        </h2>
        <p className="text-gray-700 text-center mb-12 text-lg">
          Sign in to read the full articles.
        </p>

        {loading ? (
          <div className="text-center text-gray-500">Loading latest articles...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-500">No articles available.</div>
        ) : (
          <>
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => {
                const category = article.categories && article.categories.length > 0 ? article.categories[0].name : 'Uncategorized';
                const author = article.author ? article.author.name : 'Unknown Author';
                const date = new Date(article.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const time = new Date(article.published_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                
                return (
                  <div 
                    key={article.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={onArticleClick}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={article.featured_image_url || 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase px-3 py-1 rounded bg-cyan-100 text-cyan-700">
                          {category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {date} {time}
                        </span>
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-700 font-medium ml-3 whitespace-nowrap">
                          {author}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 text-left">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* "Sign In" Button */}
            <div className="text-center mt-16">
              <Link
                to="/landing?openLogin=true"
                className="inline-block bg-cyan-700 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-800 transition-colors shadow-md"
              >
                Sign in to Read More
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
