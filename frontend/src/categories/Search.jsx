import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeaderLink from '../components/HeaderLink';
import ArticleCard from '../components/ArticleCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

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
        
        setSuggestionsLoading(true);
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get('/api/articles/search', {
            params: { q: searchQuery }
          });
          const articles = response.data.data || [];
          setResults(articles);
          setSuggestions(articles.slice(0, 5));
          setShowSuggestions(true);
        } catch (err) {
          console.error('Error searching articles:', err);
          setError('Failed to search articles. Please try again.');
          setResults([]);
          setSuggestions([]);
        } finally {
          setLoading(false);
          setSuggestionsLoading(false);
        }
      } else {
        setResults([]);
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        setError(null);
      }
    };

    const debounceTimer = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(debounceTimer);
  }, [query, navigate]);

  const saveToHistory = (searchTerm) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const updated = [searchTerm, ...history.filter(h => h !== searchTerm)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
    setSearchHistory(updated);
  };

  const handleSearchClick = () => {
    if (query.trim().length > 2) {
      if (query.startsWith('#')) {
        const tag = query.replace('#', '');
        navigate(`/tag/${tag}`);
        return;
      }
      saveToHistory(query);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[selectedIndex];
      navigate(`/article/${selected.slug}`);
      setShowSuggestions(false);
      saveToHistory(query);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
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
                ref={inputRef}
                type="text"
                placeholder="Search articles, authors, tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                  else if (query.length === 0 && searchHistory.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                autoFocus
              />
              {query && (
                <FaTimes
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={clearSearch}
                />
              )}
              <FaSearch
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={handleSearchClick}
              />
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-80 overflow-y-auto">
                  {suggestionsLoading ? (
                    <div className="px-4 py-3 text-center text-gray-500 text-sm">Loading...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((article, index) => (
                      <div
                        key={article.id}
                        onClick={() => {
                          navigate(`/article/${article.slug}`);
                          setShowSuggestions(false);
                          saveToHistory(query);
                        }}
                        className={`px-4 py-3 cursor-pointer border-b border-gray-200 last:border-b-0 ${
                          index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium text-gray-900 text-sm">{article.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {article.author_name || article.author?.user?.name} • {article.categories?.[0]?.name}
                        </div>
                      </div>
                    ))
                  ) : query.length === 0 && searchHistory.length > 0 ? (
                    <div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">Recent Searches</div>
                      {searchHistory.map((term, index) => (
                        <div
                          key={index}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                        >
                          {term}
                        </div>
                      ))}
                    </div>
                  ) : query.length > 2 ? (
                    <div className="px-4 py-3 text-center text-gray-500 text-sm">No results found</div>
                  ) : null}
                </div>
              )}
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
