import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from '../utils/axiosConfig';
import ArticleCard from './ArticleCard';
import { PLACEHOLDER_IMAGE } from '../utils/placeholder';

const formatArticleDate = (publishedAt) => {
  const date = new Date(publishedAt);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + 
    ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export default function LatestSection({ onEdit, onDelete }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    onEdit,
    onDelete,
    articleId: latestArticles[0].id,
  } : null;

  const sideArticles = latestArticles.slice(1, 3).map(article => ({
    featured_image: article.featured_image || PLACEHOLDER_IMAGE,
    categories: article.categories,
    published_at: article.published_at,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author_name || article.author?.user?.name || article.author?.name || 'Unknown Author',
    isMedium: true,
    slug: article.slug,
    onClick: () => article.slug && navigate(`/article/${article.slug}`),
    onEdit,
    onDelete,
    articleId: article.id
  }));

  return (
    <section className="mb-12" aria-label="Latest articles section">
      <h2 className="text-3xl font-bold text-gray-800 text-left mb-5">Latest</h2>
      <hr className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <div className="w-full lg:w-2/3">
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

        <div className="w-full lg:w-1/3 flex flex-col gap-4 md:gap-6">
          {sideArticles.map((article, index) => (
            <ArticleCard key={latestArticles[index + 1]?.id || index} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}
