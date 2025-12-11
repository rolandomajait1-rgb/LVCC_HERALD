import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from '../utils/axiosConfig';
import ArticleCard from './ArticleCard';
import { PLACEHOLDER_IMAGE } from '../utils/placeholder';

const formatArticleDate = (publishedAt) => {
  const date = new Date(publishedAt);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) + ' at ' + date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
};

export default function LatestSection({ onEdit, onDelete }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`/api/articles/${id}`);
        alert('Article deleted successfully!');
        setLatestArticles(prev => prev.filter(article => article.id !== id));
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await axios.get('/api/latest-articles');
        setLatestArticles(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching latest articles:', err);
        setError('Failed to load latest articles');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  useEffect(() => {
    if (location.state?.published) {
      console.log('Article published successfully!');
    }
  }, [location.state]);

  if (loading) {
    return (
      <section className="mb-12" aria-busy="true" aria-label="Loading latest articles">
        <h2 className="text-3xl font-bold text-gray-800 text-left mb-5">Latest</h2>
        <hr className="mb-6" />
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className="w-full lg:w-2/3 h-96 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="w-full lg:w-1/3 flex flex-col gap-4 md:gap-6">
            <div className="h-44 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="h-44 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || latestArticles.length === 0) {
    return (
      <section className="mb-12" aria-label="Latest articles section">
        <h2 className="text-3xl font-bold text-gray-800 text-left mb-5">Latest</h2>
        <hr className="mb-6" />
        <div className="text-center text-gray-500 py-8">
          {error || 'No latest articles available'}
        </div>
      </section>
    );
  }

  const featuredArticle = latestArticles[0] ? {
    featured_image: latestArticles[0].featured_image || PLACEHOLDER_IMAGE,
    categories: latestArticles[0].categories,
    published_at: latestArticles[0].published_at,
    title: latestArticles[0].title,
    excerpt: latestArticles[0].excerpt,
    author: latestArticles[0].author_name || latestArticles[0].author?.user?.name || latestArticles[0].author?.name || 'Unknown Author',
    isLarge: true,
    slug: latestArticles[0].slug,
    onEdit: onEdit,
    onDelete: onDelete,
    articleId: latestArticles[0].id,
  } : null;

  const sideArticles = latestArticles.slice(1, 3).map(article => ({
    featured_image: article.featured_image || PLACEHOLDER_IMAGE,
    categories: article.categories,
    published_at: article.published_at,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author_name || article.author?.user?.name || article.author?.name || 'Unknown Author',
    slug: article.slug,
    onClick: () => article.slug && navigate(`/article/${article.slug}`),
    onEdit: onEdit,
    onDelete: onDelete,
    articleId: article.id,
    isSmall: true
  }));

  const secondaryArticle = latestArticles[1] || null;

  return (
    <section className="mb-12" aria-label="Latest articles section">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-bold text-gray-800">Latest</h2>
       
      </div>
      <hr className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          {featuredArticle && (
            <div
              className="cursor-pointer"
              onClick={() => featuredArticle.slug && navigate(`/article/${featuredArticle.slug}`)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && featuredArticle.slug && navigate(`/article/${featuredArticle.slug}`)}
              aria-label={`Read article: ${featuredArticle.title}`}
            >
              <ArticleCard {...featuredArticle} />
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/3">
          {secondaryArticle && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={secondaryArticle.featured_image || PLACEHOLDER_IMAGE} 
                alt={secondaryArticle.title}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => navigate(`/article/${secondaryArticle.slug}`)}
              />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {secondaryArticle.categories?.[0] && (
                    <span className="text-xs font-semibold text-blue-600 uppercase">
                      {secondaryArticle.categories[0].name}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatArticleDate(secondaryArticle.published_at)}
                  </span>
                </div>
                <h3 
                  className="text-lg font-bold text-gray-800 mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/article/${secondaryArticle.slug}`)}
                >
                  {secondaryArticle.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{secondaryArticle.excerpt}</p>
                <div className="grid grid-cols-3 gap-2">
                  {latestArticles.slice(2, 5).map((article) => (
                    <img
                      key={article.id}
                      src={article.featured_image || PLACEHOLDER_IMAGE}
                      alt={article.title}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() => navigate(`/article/${article.slug}`)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
