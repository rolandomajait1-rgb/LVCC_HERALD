import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeaderLink from '../components/HeaderLink';
import ArticleCard from '../components/ArticleCard';

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/categories/${category}/articles?page=${currentPage}`);
        setArticles(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
      } catch (err) {
        console.error('Error fetching category articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [category, currentPage]);

  const categoryColors = {
    news: 'bg-blue-600',
    literary: 'bg-green-600',
    specials: 'bg-purple-600',
    opinion: 'bg-gray-700',
    art: 'bg-indigo-500',
    features: 'bg-yellow-500',
    sports: 'bg-red-600'
  };

  const bgColor = categoryColors[category?.toLowerCase()] || 'bg-gray-600';

  if (loading && currentPage === 1) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <HeaderLink />
        <main className="container mx-auto px-4 py-8 grow">
          <div className="text-center">Loading {category} articles...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeaderLink />

      <main className="container mx-auto px-4 py-8 grow">
        <div className={`${bgColor} text-white p-6 rounded-lg mb-8`}>
          <h1 className="text-4xl font-bold capitalize">{category}</h1>
          <p className="mt-2 text-lg opacity-90">
            Latest articles in {category}
          </p>
        </div>

        {error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No articles found in {category} category.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={{
                    imageUrl: article.featured_image || 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27200%27%3E%3Crect width=%27300%27 height=%27200%27 fill=%27%23e2e8f0%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%27%2364748b%27%3ENo Image%3C/text%3E%3C/svg%3E',
                    title: article.title,
                    snippet: article.excerpt,
                    category: article.categories?.[0]?.name || category,
                    author: article.author?.user?.name || 'Unknown Author',
                    date: new Date(article.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  }}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
