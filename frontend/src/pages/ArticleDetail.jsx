import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import DOMPurify from 'dompurify';
import { Pencil, Trash2, ThumbsUp, Share2, Link } from 'lucide-react';
import { REDIRECT_DELAY, COPY_FEEDBACK_TIMEOUT, RELATED_ARTICLES_LIMIT } from '../utils/constants';
import Notification from '../components/Notification';
import { handleApiError } from '../utils/errorHandler';
import { formatDateTime } from '../utils/dateFormatter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeaderLink from '../components/HeaderLink';
import { isAdmin, isModerator, getUserRole } from '../utils/auth';
import getCategoryColor from '../utils/getCategoryColor';

const RelatedCard = ({ article, onClick, navigate, articleId }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/admin/edit-article/${articleId}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`/api/articles/${articleId}`);
        window.location.reload();
      } catch (error) {
        alert('Failed to delete article');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden flex flex-col hover:shadow-lg transition-all relative">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={onClick}>
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        {(isAdmin() || isModerator()) && (
          <div className="absolute top-2 right-2 flex gap-1">
            <button onClick={handleEdit} className="bg-blue-500 text-white p-2 rounded shadow-lg hover:bg-blue-600">
              <Pencil size={16} />
            </button>
            {isAdmin() && (
              <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded shadow-lg hover:bg-red-600">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${getCategoryColor(article.category)}`}>{article.category}</span>
          <span className="text-gray-500 text-[9px]">{article.date}</span>
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer" onClick={onClick}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <p className="text-xs text-gray-700 font-medium mt-auto">
          {article.author}
        </p>
      </div>
    </div>
  );
};

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const showNotification = (title, message = '', type = 'success') => {
    setNotification({ title, message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/articles/${article.id}`);
      setShowDeleteModal(false);
      showNotification('Success', 'Article deleted successfully!');
      const rolePrefix = getUserRole() === 'moderator' ? '/moderator' : '/admin';
      setTimeout(() => navigate(rolePrefix), REDIRECT_DELAY);
    } catch (error) {
      setShowDeleteModal(false);
      handleApiError(error, showNotification);
    }
  };

  useEffect(() => {
    const notifTitle = sessionStorage.getItem('notification_title');
    const notifMsg = sessionStorage.getItem('notification_message');
    const notifType = sessionStorage.getItem('notification_type');
    if (notifTitle || notifMsg) {
      setNotification({ 
        title: notifTitle || 'Notification', 
        message: notifMsg || '', 
        type: notifType || 'success' 
      });
      sessionStorage.removeItem('notification_title');
      sessionStorage.removeItem('notification_message');
      sessionStorage.removeItem('notification_type');
    }
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        let response;
        let articleData;

        // Fetch by slug
        response = await axios.get(`/api/articles/by-slug/${slug}`);
        articleData = response.data;

        setArticle(articleData);
        
        // Update meta tags for social sharing
        document.title = `${articleData.title} - La Verdad Herald`;
        
        // Update or create meta tags
        const updateMetaTag = (property, content) => {
          let meta = document.querySelector(`meta[property="${property}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        };
        
        updateMetaTag('og:title', articleData.title);
        updateMetaTag('og:description', articleData.excerpt || 'Read this article on La Verdad Herald');
        updateMetaTag('og:image', articleData.featured_image || '/logo.svg');
        updateMetaTag('og:url', window.location.href);
        updateMetaTag('og:type', 'article');
        
        updateMetaTag('twitter:title', articleData.title);
        updateMetaTag('twitter:description', articleData.excerpt || 'Read this article on La Verdad Herald');
        updateMetaTag('twitter:image', articleData.featured_image || '/logo.svg');
        
        // Load likes and views from backend response
        console.log('Article data:', articleData);
        console.log('Likes count:', articleData.likes_count);
        console.log('Views count:', articleData.views_count);
        console.log('Is liked:', articleData.is_liked);
        
        setLikeCount(articleData.likes_count || 0);
        setLiked(articleData.is_liked || false);
        setViewCount(articleData.views_count || 0);

        // Author article count is intentionally not fetched for public display

        // Fetch related articles from the same category
        if (articleData.categories && articleData.categories.length > 0) {
          const categoryName = articleData.categories[0].name;
          const relatedResponse = await axios.get(`/api/categories/${categoryName.toLowerCase()}/articles`);
          const filtered = (relatedResponse.data.data || relatedResponse.data || []).filter(a => a.id !== articleData.id).slice(0, RELATED_ARTICLES_LIMIT);
          setRelatedArticles(filtered);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        const errorInfo = handleApiError(err, showNotification);
        setError(errorInfo.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/articles/${article.id}/like`);
      console.log('Like response:', response.data);
      setLiked(response.data.liked);
      setLikeCount(response.data.likes_count);
    } catch (error) {
      console.error('Like error:', error);
      if (error.response?.status === 401) {
        showNotification('Login Required', 'Please login to like articles', 'error');
      } else {
        showNotification('Error', 'Failed to like article', 'error');
      }
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), COPY_FEEDBACK_TIMEOUT);
        });
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <HeaderLink />
        <main className="container mx-auto px-4 py-8 grow">
          <div className="text-center">Loading article...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <HeaderLink />
        <Notification
          show={!!notification}
          type={notification?.type}
          title={notification?.title}
          message={notification?.message}
          onClose={closeNotification}
        />
        <main className="container mx-auto px-4 py-8 grow">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-50 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-6">
                The article you are looking for does not exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back to Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeaderLink />
      
      <Notification
        show={!!notification}
        type={notification?.type}
        title={notification?.title}
        message={notification?.message}
        onClose={closeNotification}
      />

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Are you sure?</h3>
            <p className="text-gray-600 text-sm text-center mb-8">
              Are you sure you want to delete this article? This action will permanently delete this article.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleDelete}
                className="w-full bg-red-600 text-black py-4 rounded-full font-semibold hover:bg-red-700 transition-colors text-base"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-white text-black py-4 rounded-full font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white font-sans">
        <article className="max-w-4xl mx-auto">
          
          {/* Header Section: Title, Meta, Buttons */}
          <header className="p-6 md:p-10">
            
            {/* Top row: Category and Buttons */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span 
                  onClick={() => {
                    if (article.categories?.length > 0) {
                      navigate(`/category/${article.categories[0].name.toLowerCase()}`);
                    }
                  }}
                  className={`text-sm font-bold uppercase px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                  article.categories?.length > 0 
                    ? getCategoryColor(article.categories[0].name)
                    : 'text-gray-700 bg-gray-100'
                }`}>
                  {article.categories?.length > 0 ? article.categories[0].name : 'UNCATEGORIZED'}
                </span>
              </div>
              {(isAdmin() || isModerator()) && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      navigate(`/admin/edit-article/${article.id}`);
                    }}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                  >
                    <Pencil size={16} className="mr-1.5" />
                    Edit
                  </button>
                  {isAdmin() && (
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} className="mr-1.5" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-left">
              {article.title}
            </h1>
            
            {/* Author/Date and Tags on same line */}
            <div className="flex justify-between items-start mb-6">
              {/* Author and Date - Left side */}
              <div className="text-sm text-gray-600 text-left">
                <div>
                  <span>Written by </span>
                  <span 
                    className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                    onClick={() => navigate(`/author/${encodeURIComponent(article.author_name || article.author?.user?.name || 'Unknown Author')}`)}
                  >
                    {article.author_name || article.author?.user?.name || 'Unknown Author'}
                  </span>
                </div>
                <div className="mt-1">
                  {formatDateTime(article.published_at)}
                </div>
              </div>
              
              {/* Tags - Right side */}
              {article.tags?.length > 0 && (
                <div className="flex flex-col gap-2">
                  {article.tags.map(tag => (
                    <span 
                      key={tag.id} 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tag/${tag.name}`);
                      }}
                      className="text-sm text-gray-800 bg-white px-3 py-2 rounded border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors text-left"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
          </header>

          {/* Image Section */}
          {article.featured_image && (
            <div className="w-full bg-gray-100 p-4 md:p-10 border-t-2 border-gray-200">
              <div className="w-full rounded-lg overflow-hidden shadow-inner">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full object-contain"
                  style={{ height: '500px' }}
                />
              </div>
              <p className="text-xs text-gray-500 italic text-center mt-3">Cartoon: Marianne Toazo</p>
            </div>
          )}

          {/* Article Body Content */}
          <div className="p-6 md:p-10">
            <div className="prose prose-lg max-w-none text-gray-800">
              <div className="whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
            </div>
            
            {/* Like and Share Section */}
            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200 flex gap-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-colors ${
                  liked 
                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ThumbsUp size={16} className={liked ? 'fill-current' : ''} /> {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Share2 size={16} /> Share on Facebook
              </button>
              <button 
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Link size={16} /> {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

        </article>
        
        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 mb-16 px-4">
            <div className="border-t-2 border-gray-200 pt-8 pb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-left">More from this Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <RelatedCard 
                    key={relatedArticle.id}
                    articleId={relatedArticle.id}
                    article={{
                      title: relatedArticle.title,
                      category: relatedArticle.categories && relatedArticle.categories.length > 0 ? relatedArticle.categories[0].name : 'Uncategorized',
                      date: formatDateTime(relatedArticle.published_at),
                      author: relatedArticle.author_name,
                      imageUrl: relatedArticle.featured_image || 'https://placehold.co/400x250/e2e8f0/64748b?text=No+Image',
                      excerpt: relatedArticle.excerpt
                    }}
                    onClick={() => navigate('/article/' + relatedArticle.slug)}
                    navigate={navigate}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
