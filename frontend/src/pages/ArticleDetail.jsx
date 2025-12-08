import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Pencil, Trash2, Heart, Share2, Link } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeaderLink from '../components/HeaderLink';
import { isAdmin, isModerator, getUserRole } from '../utils/auth';
import getCategoryColor from '../utils/getCategoryColor';

const RelatedCard = ({ article, onClick, navigate }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all" onClick={onClick}>
    <div className="relative h-44 overflow-hidden">
      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-4 flex flex-col grow">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${getCategoryColor(article.category)}`}>{article.category}</span>
        <span className="text-gray-500 text-[10px] font-medium">{article.date}</span>
      </div>
      <h3 className="text-base font-serif font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-800 transition-colors line-clamp-3 text-left">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed text-left">
          {article.excerpt}
        </p>
      )}
      <p className="text-xs text-gray-500 font-medium mt-auto text-right">
        {article.author}
      </p>
    </div>
  </div>
);

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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/articles/${article.id}`);
      setShowDeleteModal(false);
      showNotification('Article Deleted Successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error deleting article:', error);
      setShowDeleteModal(false);
      showNotification('Failed to delete article: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  useEffect(() => {
    const notifMsg = sessionStorage.getItem('notification_message');
    const notifType = sessionStorage.getItem('notification_type');
    if (notifMsg) {
      setNotification({ message: notifMsg, type: notifType || 'success' });
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
        
        // Load likes from localStorage or backend
        const localLikes = localStorage.getItem(`article_${articleData.id}_likes`);
        const localLiked = localStorage.getItem(`article_${articleData.id}_liked`) === 'true';
        
        if (localLikes) {
          setLikeCount(parseInt(localLikes));
          setLiked(localLiked);
        } else {
          setLikeCount(articleData.interactions_count || 0);
          setLiked(articleData.is_liked || false);
        }
        
        // Track views
        const viewKey = `article_${articleData.id}_viewed`;
        if (!sessionStorage.getItem(viewKey)) {
          sessionStorage.setItem(viewKey, 'true');
        }

        // Author article count is intentionally not fetched for public display

        // Fetch related articles from the same category
        if (articleData.categories && articleData.categories.length > 0) {
          const categoryName = articleData.categories[0].name;
          const relatedResponse = await axios.get('/api/articles', {
            params: { category: categoryName.toLowerCase(), limit: 6 }
          });
          const filtered = relatedResponse.data.data.filter(a => a.id !== articleData.id).slice(0, 6);
          setRelatedArticles(filtered);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Article not found');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

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
        <main className="container mx-auto px-4 py-8 grow">
          <div className="text-center text-red-600">{error || 'Article not found'}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleLike = async () => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (!token) {
      // Guest user - use localStorage
      const newLiked = !liked;
      const newCount = newLiked ? likeCount + 1 : likeCount - 1;
      setLiked(newLiked);
      setLikeCount(newCount);
      localStorage.setItem(`article_${article.id}_likes`, newCount);
      localStorage.setItem(`article_${article.id}_liked`, newLiked);
      return;
    }
    
    // Authenticated user - call backend
    try {
      const response = await axios.post(`/api/articles/${article.id}/like`);
      setLiked(response.data.liked);
      setLikeCount(response.data.likes_count);
      localStorage.setItem(`article_${article.id}_likes`, response.data.likes_count);
      localStorage.setItem(`article_${article.id}_liked`, response.data.liked);
    } catch (error) {
      console.error('Error liking article:', error);
      if (error.response?.status === 401) {
        alert('Please login to like articles');
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
          setTimeout(() => setCopied(false), 2000);
        });
        break;
    }
  };



  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HeaderLink />
      
      {notification && (
        <div className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 text-center font-medium ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Are you sure?</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              Are you sure you want to delete this article? This action will permanently delete this article.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-200 p-4 md:p-12 font-sans">
        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          
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
                      const rolePrefix = getUserRole() === 'moderator' ? '/moderator' : '/admin';
                      navigate(`${rolePrefix}/edit-article/${article.id}`);
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
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {new Date(article.published_at).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
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
                      className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-colors text-center"
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
            <div className="w-full bg-gray-100 p-4 md:p-10">
              <div className="w-full rounded-lg overflow-hidden shadow-inner">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full object-contain"
                  style={{ height: '500px' }}
                />
              </div>
            </div>
          )}

          {/* Article Body Content */}
          <div className="p-6 md:p-10">
            <div className="prose prose-lg max-w-none text-gray-800">
              <div className="whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
            
            {/* Like and Share Section */}
            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200 flex gap-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  liked 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {likeCount} {liked ? 'Liked' : 'Like'}
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Share on Facebook <Share2 size={16} />
              </button>
              <button 
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Link'} <Link size={16} />
              </button>
            </div>
          </div>

        </article>
        
        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 px-4">
            <div className="border-t-2 border-gray-200 pt-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-left">More from this Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <RelatedCard 
                    key={relatedArticle.id} 
                    article={{
                      title: relatedArticle.title,
                      category: relatedArticle.categories && relatedArticle.categories.length > 0 ? relatedArticle.categories[0].name : 'Uncategorized',
                      date: new Date(relatedArticle.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) + ' at ' + new Date(relatedArticle.published_at).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }),
                      author: relatedArticle.author_name || relatedArticle.author?.user?.name || 'Unknown Author',
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
