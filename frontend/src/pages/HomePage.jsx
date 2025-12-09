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
import { ArticleListSkeleton } from '../components/LoadingSkeleton';
import { getUserRole } from '../utils/auth';
import { FiExternalLink } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axiosConfig';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getUserRole();
  const [notification, setNotification] = useState({ show: false, type: 'success', title: '', message: '' });


  const [newsArticles, setNewsArticles] = useState([]);
  const [literaryArticles, setLiteraryArticles] = useState([]);
  const [specialsArticles, setSpecialsArticles] = useState([]);
  const [opinionArticles, setOpinionArticles] = useState([]);
  const [artArticles, setArtArticles] = useState([]);
  const [featuresArticles, setFeaturesArticles] = useState([]);
  const [sportsArticles, setSportsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hashtags, setHashtags] = useState([]);

  const handleOpenAdminDashboard = () => {
    navigate('/admin/statistics');
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
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageArticles();
  }, []);

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const response = await axios.get('/api/tags');
        if (response.data && response.data.length > 0) {
          setHashtags(response.data.map(t => `#${t.name}`));
        }
      } catch (error) {
        setHashtags([]);
      }
    };
    fetchAllTags();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 gap-4 ">
      <Notification {...notification} />
      <Header />
      <Navigation />

      <main className="container mx-auto px-4 md:px-8 lg:px-12 py-8 grow">
        
        {(userRole === 'admin' || userRole === 'moderator') && (
          <header className="bg-cyan-700 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-center shadow-md mb-6 gap-3">
            <h1 className="text-xl md:text-2xl font-serif">Welcome, Admin</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleOpenAdminDashboard}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 text-sm md:text-base font-medium text-white hover:text-blue-300"
              >
                <span className="hidden sm:inline">OPEN ADMIN DASHBOARD</span>
                <span className="sm:hidden">DASHBOARD</span>
                <FiExternalLink />
              </button>
            </div>
          </header>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <LatestSection />
          </div>
          <div className="lg:w-1/3">
            <h3 className="text-2xl font-serif text-gray-800 mb-6 pb-2 border-b border-gray-300">Explore</h3>
            <div className="flex flex-wrap gap-2">
              {hashtags.length > 0 ? (
                hashtags.map((hashtag) => (
                  <div 
                    key={hashtag}
                    className="text-sm text-gray-800 bg-white px-3 py-2 rounded border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => navigate(`/tag/${hashtag.replace('#', '')}`)}
                  >
                    {hashtag}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tags available yet.</p>
              )}
            </div>
          </div>
        </div>
        
        <ContentSection title="NEWS" bgColor="bg-blue-600" viewAllUrl="/category/news">
          {loading ? (
            <ArticleListSkeleton count={3} />
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : newsArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No news articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {newsArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={(article.featured_image && !article.featured_image.includes('/storage/')) ? article.featured_image : PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name}
                  category={article.categories?.[0]?.name || 'News'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="LITERARY" bgColor="bg-green-600" viewAllUrl="/category/literary">
          {loading ? (
            <ArticleListSkeleton count={3} />
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : literaryArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No literary articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {literaryArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={(article.featured_image && !article.featured_image.includes('/storage/')) ? article.featured_image : PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name}
                  category={article.categories?.[0]?.name || 'Literary'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="SPECIALS" bgColor="bg-purple-600" viewAllUrl="/category/specials">
          {loading ? (
            <ArticleListSkeleton count={3} />
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : specialsArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No specials articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {specialsArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={(article.featured_image && !article.featured_image.includes('/storage/')) ? article.featured_image : PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name}
                  category={article.categories?.[0]?.name || 'Specials'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="OPINION" bgColor="bg-gray-700" viewAllUrl="/category/opinion">
          {loading ? (
            <ArticleListSkeleton count={3} />
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : opinionArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No opinion articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {opinionArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={(article.featured_image && !article.featured_image.includes('/storage/')) ? article.featured_image : PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name}
                  category={article.categories?.[0]?.name || 'Opinion'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="ART" bgColor="bg-indigo-500" viewAllUrl="/category/art">
          {loading ? (
            <ArticleListSkeleton count={3} />
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : artArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No art articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {artArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={(article.featured_image && !article.featured_image.includes('/storage/')) ? article.featured_image : PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name}
                  category={article.categories?.[0]?.name || 'Art'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="FEATURES" bgColor="bg-yellow-500" viewAllUrl="/category/features">
          {loading ? (
            <ArticleListSkeleton count={3} />
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : featuresArticles.length === 0 ? (
            <EmptyState categoryName="Features" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {featuresArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={(article.featured_image && !article.featured_image.includes('/storage/')) ? article.featured_image : PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name}
                  category={article.categories?.[0]?.name || 'Features'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>
          )}
        </ContentSection>
        
        <ContentSection title="SPORTS" bgColor="bg-red-600" viewAllUrl="/category/sports">
          {loading ? (
            <ArticleListSkeleton count={3} />
          ) : error ? (
            <div className="text-center text-red-600 mt-4">{error}</div>
          ) : sportsArticles.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">No sports articles available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {sportsArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  articleId={article.id}
                  imageUrl={(article.featured_image && !article.featured_image.includes('/storage/')) ? article.featured_image : PLACEHOLDER_IMAGE}
                  title={article.title}
                  excerpt={article.excerpt}
                  author={article.author_name}
                  category={article.categories?.[0]?.name || 'Sports'}
                  slug={article.slug}
                  onClick={() => navigate(`/article/${article.slug}`)}
                />
              ))}
            </div>
          )}
        </ContentSection>
      </main>
      <Footer />
    </div>
  );
}
