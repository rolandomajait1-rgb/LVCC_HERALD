import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash, FaCalendar } from 'react-icons/fa';
import { ThumbsUp, Share2 } from 'lucide-react';
import { isAdmin, isModerator, deleteArticle, getAuthToken } from '../utils/auth';
import { getFullUrl } from '../utils/url';
import axios from '../utils/axiosConfig';
import getCategoryColor from '../utils/getCategoryColor';

const getUserRole = () => {
  return localStorage.getItem('user_role') || sessionStorage.getItem('user_role');
};

const ArticleCard = ({ featured_image, categories, published_at, title, excerpt, author, imageUrl, category, date, snippet, isPublished = true, isLarge = false, isMedium = false, isSmall = false, horizontal = false, className = '', onClick, onEdit, onDelete, articleId, slug, showRelated = false, tags = [] }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [showAdminButtons, setShowAdminButtons] = useState(false);
  
  // Check admin/moderator status on mount and when localStorage changes
  useEffect(() => {
    const checkRole = () => {
      const hasAccess = getAuthToken() && (isAdmin() || isModerator());
      setShowAdminButtons(hasAccess);
    };
    checkRole();
    const interval = setInterval(checkRole, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch likes data from backend or localStorage
  useEffect(() => {
    const fetchLikes = async () => {
      if (!articleId) return;
      
      // Check localStorage first for guest users
      const localLikes = localStorage.getItem(`article_${articleId}_likes`);
      const localLiked = localStorage.getItem(`article_${articleId}_liked`) === 'true';
      
      if (localLikes) {
        setLikeCount(parseInt(localLikes));
        setLiked(localLiked);
      }
      
      // Fetch from backend if authenticated
      if (getAuthToken()) {
        try {
          const response = await axios.get(`/api/articles/${articleId}`);
          const count = response.data.interactions_count || 0;
          const isLiked = response.data.is_liked || false;
          setLikeCount(count);
          setLiked(isLiked);
          // Update localStorage
          localStorage.setItem(`article_${articleId}_likes`, count);
          localStorage.setItem(`article_${articleId}_liked`, isLiked);
        } catch (error) {
          // Silent fail for likes fetch
        }
      }
    };
    fetchLikes();
  }, [articleId]);

  // Handle both prop formats for backward compatibility
  const finalImageUrl = (() => {
    const img = imageUrl || featured_image;
    if (!img) return "https://placehold.co/300x200/e2e8f0/64748b?text=No+Image";
    return getFullUrl(img);
  })();
  const finalCategory = category || (categories && categories.length > 0 ? categories[0].name : 'Uncategorized');
  const finalDate = date || (published_at ? new Date(published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : '');
  const finalTime = published_at ? new Date(published_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }) : '';
  const finalSnippet = snippet || excerpt || '';
  const finalAuthor = author?.author_name || author?.name || (typeof author === 'string' ? author : 'Unknown Author');

  useEffect(() => {
    if (expanded && showRelated && finalCategory) {
      const fetchRelated = async () => {
        try {
          const response = await axios.get('/api/articles', {
            params: { category: finalCategory.toLowerCase(), limit: 3 }
          });
          const filtered = response.data.data.filter(a => a.slug !== slug).slice(0, 3);
          setRelatedArticles(filtered);
        } catch (error) {
          setRelatedArticles([]);
        }
      };
      fetchRelated();
    }
  }, [expanded, showRelated, finalCategory, slug]);

  

  const getImageHeight = () => {
    if (isLarge) return 'h-110';
    if (isMedium) return 'h-42';
    return 'h-50';
  };

  if (!isPublished) return null;

  const handleCardClick = async (e) => {
    if (showRelated) {
      e.preventDefault();
      setExpanded(!expanded);
      return;
    }

    if (onClick) {
      e.preventDefault();
      try {
        onClick();
      } catch (err) {
        // Silent fail for onClick handler
      }
      return;
    }

    if (slug) {
      e.preventDefault();
      navigate(`/article/${slug}`);
      return;
    }

    if (articleId) {
      e.preventDefault();
      // Navigate to the identifier route using the numeric id; ArticleDetail will fetch by id
      navigate(`/article/${articleId}`);
      return;
    }

    // No slug and no articleId — nothing to do
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(articleId);
    } else {
      navigate(`/admin/edit-article/${articleId}`);
    }
  };

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(articleId);
    } else {
      if (window.confirm('Are you sure you want to delete this article?')) {
        try {
          await axios.delete(`/api/articles/${articleId}`);
          window.location.reload();
        } catch (error) {
          alert('Failed to delete article: ' + (error.response?.data?.error || error.message));
        }
      }
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!getAuthToken()) {
      // Guest user - use localStorage
      const newLiked = !liked;
      const newCount = newLiked ? likeCount + 1 : likeCount - 1;
      setLiked(newLiked);
      setLikeCount(newCount);
      localStorage.setItem(`article_${articleId}_likes`, newCount);
      localStorage.setItem(`article_${articleId}_liked`, newLiked);
      return;
    }
    
    // Authenticated user - call backend
    try {
      const response = await axios.post(`/api/articles/${articleId}/like`);
      setLiked(response.data.liked);
      setLikeCount(response.data.likes_count);
      // Update localStorage
      localStorage.setItem(`article_${articleId}_likes`, response.data.likes_count);
      localStorage.setItem(`article_${articleId}_liked`, response.data.liked);
    } catch (error) {
      // Silent fail for like action
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/article/${slug}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <>
    <div 
      className={`relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex flex-col ${isLarge ? 'h-full' : 'h-full'} ${className}`} 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* overlay to ensure large cards are fully clickable; admin buttons have higher z-index */}
      {(showRelated || onClick || slug) && (
        <div
          role="presentation"
          onClick={handleCardClick}
          className="absolute inset-0 z-10 bg-transparent"
        />
      )}
      {/* Horizontal layout for medium cards (image left, text right) */}
      {(horizontal) ? (
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/3 relative h-48 sm:h-64 overflow-hidden">
            <img src={finalImageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.src = "https://placehold.co/300x200/e2e8f0/64748b?text=No+Image"; }} />
            {(isAdmin() || isModerator()) && onEdit !== false && onDelete !== false && (
              <div className="absolute top-3 right-3 flex space-x-2 z-20">
                <button 
                  onClick={handleEditClick} 
                  className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                  title="Edit Article"
                >
                  <FaPencilAlt />
                </button>
                {isAdmin() && (
                  <button 
                    onClick={handleDeleteClick} 
                    className="p-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
                    title="Delete Article"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={`p-3 sm:w-2/3 flex flex-col justify-between`}> 
            <div>
              <div className="flex justify-between items-start mb-2">
                <span 
                  className={`text-xs font-semibold uppercase px-2 py-1 rounded cursor-pointer hover:opacity-80 ${getCategoryColor(finalCategory)}`}
                  onClick={(e) => { e.stopPropagation(); navigate(`/category/${finalCategory.toLowerCase()}`); }}
                >
                  {finalCategory}
                </span>
                <span className="text-xs text-gray-500 text-right flex items-center">
                  <FaCalendar className="mr-1" />
                  {finalDate} {finalTime}
                </span>
              </div>

              <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 text-left break-words ${isLarge ? 'text-2xl md:text-4xl' : 'text-sm md:text-base'}`}>
                {title}
              </h3>
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                      #{tag.name || tag}
                    </span>
                  ))}
                </div>
              )}
              <p className={`text-gray-600 mb-3 line-clamp-3 text-left break-words ${isLarge ? 'text-base md:text-xl' : 'text-xs'}`}>
                {finalSnippet}
              </p>
            </div>

            <p 
              className={`text-gray-700 font-medium text-right cursor-pointer hover:text-blue-600 hover:underline z-20 relative ${isLarge ? 'text-base md:text-lg' : 'text-xs'}`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/author/${encodeURIComponent(finalAuthor)}`);
              }}
            >
              {finalAuthor}
            </p>
          </div>
        </div>
      ) : (
        // Default vertical layout (image on top)
        <>
          <div className={`relative overflow-hidden ${isSmall ? 'h-40' : isMedium ? 'h-48' : isLarge ? 'h-96' : 'h-60'}`}>
            <img
              src={finalImageUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.target.src = "https://placehold.co/300x200/e2e8f0/64748b?text=No+Image"; }}
            />
            {(isAdmin() || isModerator()) && onEdit !== false && onDelete !== false && (
              <div className="absolute top-3 right-3 flex space-x-2 z-20">
                <button 
                  onClick={handleEditClick} 
                  className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                  title="Edit Article"
                >
                  <FaPencilAlt />
                </button>
                {isAdmin() && (
                  <button 
                    onClick={handleDeleteClick} 
                    className="p-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
                    title="Delete Article"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={`flex flex-col grow ${isLarge ? 'p-4 md:p-6' : 'p-3'}`}>
            <div className="flex justify-between items-start mb-2">
              <span 
                className={`text-xs font-semibold uppercase px-2 py-1 rounded cursor-pointer hover:opacity-80 ${getCategoryColor(finalCategory)}`}
                onClick={(e) => { e.stopPropagation(); navigate(`/category/${finalCategory.toLowerCase()}`); }}
              >
                {finalCategory}
              </span>
              <span className="text-xs text-gray-500 text-right flex items-center">
                <FaCalendar className="mr-1" />
                {finalDate} {finalTime}
              </span>
            </div>

            <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 text-left break-words ${isLarge ? 'text-2xl md:text-4xl' : 'text-sm md:text-base'}`}>
              {title}
            </h3>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    #{tag.name || tag}
                  </span>
                ))}
              </div>
            )}
            <p className={`text-gray-600 mb-3 line-clamp-3 text-left break-words ${isLarge ? 'text-base md:text-xl' : 'text-xs'}`}>
              {finalSnippet}
            </p>
            <p 
              className={`text-gray-700 font-medium text-right cursor-pointer hover:text-blue-600 hover:underline z-20 relative ${isLarge ? 'text-base md:text-lg' : 'text-xs'}`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/author/${encodeURIComponent(finalAuthor)}`);
              }}
            >
              {finalAuthor}
            </p>
          </div>
        </>
      )}
    </div>
    
    {expanded && showRelated && relatedArticles.length > 0 && (
      <div className="mt-6 border-t-2 border-gray-200 pt-6">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">More from {finalCategory}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all" onClick={() => navigate(`/article/${article.slug}`)}>
              <div className="h-32 overflow-hidden">
                <img src={article.featured_image_url || 'https://placehold.co/400x200/e2e8f0/64748b?text=No+Image'} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">
                  {article.categories && article.categories.length > 0 ? article.categories[0].name : 'Uncategorized'}
                </span>
                <h4 className="text-sm font-serif font-bold text-gray-900 mt-2 line-clamp-2">{article.title}</h4>
                <p 
                  className="text-xs text-gray-500 mt-1 cursor-pointer hover:text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/author/${encodeURIComponent(article.author_name || article.author?.name || 'Unknown Author')}`);
                  }}
                >
                  {article.author_name || article.author?.name || 'Unknown Author'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    </>
  );
};

ArticleCard.propTypes = {
  articleId: PropTypes.number,
  slug: PropTypes.string,
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  author: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  imageUrl: PropTypes.string,
  featured_image: PropTypes.string,
  category: PropTypes.string,
  categories: PropTypes.array,
  date: PropTypes.string,
  published_at: PropTypes.string,
  snippet: PropTypes.string,
  isPublished: PropTypes.bool,
  isLarge: PropTypes.bool,
  isMedium: PropTypes.bool,
  isSmall: PropTypes.bool,
  horizontal: PropTypes.bool,
  showRelated: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onEdit: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onDelete: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  tags: PropTypes.array
};

export default ArticleCard;
