import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeaderLink from '../components/HeaderLink';

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeaderLink />
      <main className="container mx-auto px-4 py-8 grow">
        <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
        
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
          <div>
            <h2 className="text-xl font-semibold mb-4">Articles ({results.length})</h2>
            <div className="space-y-6">
              {results.map(article => (
                <div 
                  key={article.id} 
                  onClick={() => navigate(`/article/${article.slug}`)}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white"
                >
                  <div className="flex gap-2 mb-3">
                    {article.categories?.map(cat => (
                      <span key={cat.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold uppercase">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">{article.title}</h2>
                  <p className="text-gray-600 mb-3">{article.excerpt}</p>
                  <div className="text-sm text-gray-500">
                    {new Date(article.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} • {article.author_name || article.author?.user?.name || 'Unknown Author'}
                  </div>
                </div>
              ))}
            </div>
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
