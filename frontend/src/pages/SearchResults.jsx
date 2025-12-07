import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeaderLink from '../components/HeaderLink';
import { Search } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 3) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/articles/search', {
          params: { q: query }
        });
        setResults(response.data.data || []);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to search articles');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);

  const getCategoryColor = (categoryName) => {
    const colors = {
      'literary': 'bg-green-100 text-green-700',
      'news': 'bg-blue-100 text-blue-700',
      'opinion': 'bg-purple-100 text-purple-700',
      'art': 'bg-pink-100 text-pink-700',
      'features': 'bg-yellow-100 text-yellow-700',
      'sports': 'bg-red-100 text-red-700',
      'specials': 'bg-indigo-100 text-indigo-700'
    };
    return colors[categoryName?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const [searchQuery, setSearchQuery] = useState(query);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Auto-search after typing
    if (value.trim().length >= 3) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <HeaderLink />
      <main className="container mx-auto px-4 py-8 grow">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search"
              className="w-full px-6 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 pr-12"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              <Search size={24} />
            </button>
          </div>
        </form>

        <h1 className="text-3xl font-serif font-bold mb-8 text-left">Latest Articles</h1>
        
        {query.length < 3 && query.length > 0 && (
          <p className="text-gray-600">Please enter at least 3 characters to search.</p>
        )}
        
        {loading && (
          <div className="text-center py-8">Searching...</div>
        )}
        
        {error && (
          <div className="text-center text-red-600 py-8">{error}</div>
        )}
        
        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(article => (
              <div 
                key={article.id} 
                onClick={() => navigate(`/article/${article.slug}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={article.featured_image || 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${getCategoryColor(article.categories?.[0]?.name)}`}>
                      {article.categories?.[0]?.name || 'Uncategorized'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(article.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">{article.title}</h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{article.excerpt}</p>
                  <p className="text-xs text-gray-500 font-medium">
                    {article.author_name || article.author?.user?.name || 'Unknown Author'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && !error && results.length === 0 && query.length >= 3 && (
          <p className="text-gray-600 text-center py-8">No articles found matching your search.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
