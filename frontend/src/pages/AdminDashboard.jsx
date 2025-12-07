import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentSection from '../components/ContentSection';
import ArticleCard from '../components/ArticleCard';
import LatestSection from '../components/LatestSection';
import EmptyState from '../components/EmptyState';
import Navigation from '../components/HeaderLink';
import Feedback from '../components/Feedback';
import Notification from '../components/Notification';
import { PLACEHOLDER_IMAGE } from '../utils/placeholder';
import axios from '../utils/axiosConfig';
import { FiExternalLink } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [newsArticles, setNewsArticles] = useState([]);
  const [literaryArticles, setLiteraryArticles] = useState([]);
  const [specialsArticles, setSpecialsArticles] = useState([]);
  const [opinionArticles, setOpinionArticles] = useState([]);
  const [artArticles, setArtArticles] = useState([]);
  const [featuresArticles, setFeaturesArticles] = useState([]);
  const [sportsArticles, setSportsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: 'success', title: '', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  const handleOpenAdminDashboard = () => {
    const role = getUserRole();
    if (role === 'moderator') {
      navigate('/admin/statistics');
    } else {
      navigate('/admin/statistics');
    }
  };

  const handleEditArticle = (articleId) => {
    navigate(`/admin/edit-article/${articleId}`);
  };

  const handleDeleteArticle = getUserRole() === 'admin' ? async () => {
    try {
      await axios.delete(`/api/articles/${deleteId}`);
      setShowDeleteModal(false);
      setDeleteId(null);
      alert('Article deleted successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Error deleting article:', err);
      setShowDeleteModal(false);
      setDeleteId(null);
      alert('Failed to delete article');
    }
  } : null;

  const openDeleteModal = (articleId) => {
    setDeleteId(articleId);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    const fetchHomePageArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const categories = ['news', 'literary', 'specials', 'opinion', 'art', 'features', 'sports'];
        const promises = categories.map(category =>
          axios.get(`/api/categories/${category}/articles`)
        );

        const responses = await Promise.all(promises);

        setNewsArticles(responses[0].data.data || []);
        setLiteraryArticles(responses[1].data.data || []);
        setSpecialsArticles(responses[2].data.data || []);
        setOpinionArticles(responses[3].data.data || []);
        setArtArticles(responses[4].data.data || []);
        setFeaturesArticles(responses[5].data.data || []);
        setSportsArticles(responses[6].data.data || []);
        
      } catch (err) {
        console.error('Error fetching home page articles:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(`Failed to load articles: ${err.response?.status || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageArticles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Are you sure?</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Are you sure you want to delete this article? This action will permanently delete this article.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteArticle}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Notification {...notification} />
      <Header />
      <Navigation />

      <main className="container mx-auto px-4 md:px-8 lg:px-12 py-4 grow">
        <div className="border-l-2 border-r-2 border-gray-300 px-4 pt-4 pb-4">

        <header className="bg-cyan-700 text-white px-5 py-4 flex flex-col md:flex-row justify-between items-center shadow-md mb-4 gap-2">
          <h1 className="text-xl md:text-2xl font-serif">Welcome, {getUserRole() === 'admin' ? 'Admin' : 'Moderator'}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenAdminDashboard}
              className="flex items-center space-x-2 px-2 md:px-5 py-1 text-s md:text-base font-medium text-white hover:text-blue-300"
            >
              <span className="hidden sm:inline">{getUserRole() === 'admin' ? 'OPEN ADMIN DASHBOARD' : 'OPEN MODERATOR DASHBOARD'}</span>
              <span className="sm:hidden">DASHBOARD</span>
              <FiExternalLink />
            </button>
          </div>
        </header>

        <LatestSection onEdit={handleEditArticle} onDelete={getUserRole() === 'admin' ? openDeleteModal : null} />
      <hr />
        <ContentSection title="NEWS" bgColor="bg-blue-600" viewAllUrl="/category/news">
          {loading ? (
            <div className="text-center text-gray-500 mt-4">Loading news articles...</div>
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : newsArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No news articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {newsArticles.slice(0, 3).map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={article.featured_image || PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name || article.author?.user?.name || 'Unknown Author'}
                  published_at={article.published_at}
                  category={article.categories && article.categories.length > 0 ? article.categories[0].name : 'News'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="LITERARY" bgColor="bg-green-600" viewAllUrl="/category/literary">
          {loading ? (
            <div className="text-center text-gray-500 mt-4">Loading literary articles...</div>
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : literaryArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No literary articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {literaryArticles.slice(0, 3).map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={article.featured_image || PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name || article.author?.user?.name || 'Unknown Author'}
                  published_at={article.published_at}
                  category={article.categories && article.categories.length > 0 ? article.categories[0].name : 'Literary'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="SPECIALS" bgColor="bg-purple-600" viewAllUrl="/category/specials">
          {loading ? (
            <div className="text-center text-gray-500 mt-4">Loading specials articles...</div>
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : specialsArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No specials articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {specialsArticles.slice(0, 3).map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={article.featured_image || PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name || article.author?.user?.name || 'Unknown Author'}
                  published_at={article.published_at}
                  category={article.categories && article.categories.length > 0 ? article.categories[0].name : 'Specials'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="OPINION" bgColor="bg-gray-700" viewAllUrl="/category/opinion">
          {loading ? (
            <div className="text-center text-gray-500 mt-4">Loading opinion articles...</div>
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : opinionArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No opinion articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {opinionArticles.slice(0, 3).map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={article.featured_image || PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name || article.author?.user?.name || 'Unknown Author'}
                  published_at={article.published_at}
                  category={article.categories && article.categories.length > 0 ? article.categories[0].name : 'Opinion'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="ART" bgColor="bg-indigo-500" viewAllUrl="/category/art">
          {loading ? (
            <div className="text-center text-gray-500 mt-4">Loading art articles...</div>
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : artArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No art articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {artArticles.slice(0, 3).map(article => (
                <ArticleCard
                  key={article.id}                  articleId={article.id}
                  imageUrl={article.featured_image || PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name || article.author?.user?.name || 'Unknown Author'}
                  published_at={article.published_at}
                  category={article.categories && article.categories.length > 0 ? article.categories[0].name : 'Art'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="FEATURES" bgColor="bg-yellow-500" viewAllUrl="/category/features">
          {loading ? (
            <div className="text-center text-gray-500 mt-4">Loading features articles...</div>
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : featuresArticles.length === 0 ? (
            <EmptyState categoryName="Features" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {featuresArticles.slice(0, 3).map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={article.featured_image || PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name || article.author?.user?.name || 'Unknown Author'}
                  published_at={article.published_at}
                  category={article.categories && article.categories.length > 0 ? article.categories[0].name : 'Features'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="SPORTS" bgColor="bg-red-600" viewAllUrl="/category/sports">
          {loading ? (
            <div className="text-center text-gray-500 mt-4">Loading sports articles...</div>
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : sportsArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No sports articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {sportsArticles.slice(0, 3).map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={article.featured_image || PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name || article.author?.user?.name || 'Unknown Author'}
                  published_at={article.published_at}
                  category={article.categories && article.categories.length > 0 ? article.categories[0].name : 'Sports'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </div>
          )}
        </ContentSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}


