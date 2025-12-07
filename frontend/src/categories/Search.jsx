import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { FaSearch } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeaderLink from '../components/HeaderLink';
import ArticleCard from '../components/ArticleCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const response = await axios.get('/api/latest-articles');
        setLatestArticles(response.data.data || []);
      } catch (err) {
        console.error('Error fetching latest articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestArticles();
  }, []);

  useEffect(() => {
    const performSearch = async (searchQuery) => {
      if (searchQuery.trim().length > 2) {
        if (searchQuery.startsWith('#')) {
          const tag = searchQuery.replace('#', '');
          navigate(`/tag/${tag}`);
          return;
        }
        
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get('/api/articles/search', {
            params: { q: searchQuery }
          });
          setResults(response.data.data || []);
        } catch (err) {
          console.error('Error searching articles:', err);
          setError('Failed to search articles. Please try again.');
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setLoading(false);
        setError(null);
      }
    };

    const debounceTimer = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(debounceTimer);
  }, [query, navigate]);

  const handleSearchClick = () => {
    if (query.trim().length > 2) {
      if (query.startsWith('#')) {
        const tag = query.replace('#', '');
        navigate(`/tag/${tag}`);
        return;
      }
      
      setLoading(true);
      setError(null);
      axios.get('/api/articles/search', {
        params: { q: query }
      }).then(response => {
        setResults(response.data.data || []);
      }).catch(err => {
        console.error('Error searching articles:', err);
        setError('Failed to search articles. Please try again.');
        setResults([]);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeaderLink />

      <main className="grow">
        <div className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                autoFocus
              />
              <FaSearch
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={handleSearchClick}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <div className="bg-gray-200 h-48 rounded-lg"></div>
                <div className="mt-4 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-full"></div>
                  <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map((article) => (
                <ArticleCard
                key={article.id}
                articleId={article.id}
                imageUrl={article.featured_image || 'https://placehold.co/300x200/e2e8f0/64748b?text=No+Image'}
                title={article.title}
                excerpt={article.excerpt}
                snippet={article.excerpt}
                category={article.categories && article.categories.length > 0 ? article.categories[0].name : 'Uncategorized'}
                author={article.author_name || article.author?.user?.name || 'Unknown Author'}
                date={new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) + ' at ' + new Date(article.published_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>
          </div>
        ) : query.trim().length > 2 ? (
          <section className="text-center text-gray-500 justify-center py-5 mt-20">
            <div className="flex justify-center mb-4">
              <img src="/logo.svg" alt="La Verdad Herald Logo" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              No articles found for "{query}"</h1>
            Try adjusting your search terms.
          </section>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {latestArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={article.featured_image || 'https://placehold.co/300x200/e2e8f0/64748b?text=No+Image'}
                  title={article.title}
                  excerpt={article.excerpt}
                  snippet={article.excerpt}
                  category={article.categories && article.categories.length > 0 ? article.categories[0].name : 'Uncategorized'}
                  author={article.author_name || article.author?.user?.name || 'Unknown Author'}
                  date={new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) + ' at ' + new Date(article.published_at).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
