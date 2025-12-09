import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Calendar, Pencil, Trash2 } from 'lucide-react';
import axios from '../utils/axiosConfig';
import Header from '../components/Header';
import Navigation from '../components/HeaderLink';
import Footer from '../components/Footer';
import { isAdmin, editArticle, deleteArticle } from '../utils/auth';
import { SearchResultListSkeleton } from '../components/LoadingSkeleton';

const SearchResultCard = ({ imageUrl, title, excerpt, category, date, author, articleId, slug, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group flex mb-6">
    <div className="w-80 h-48 relative overflow-hidden flex-shrink-0">
      <img 
        src={imageUrl} 
        alt={`Featured image for ${title}`} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      {isAdmin() && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); editArticle(articleId); }}
            className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm"
          >
            <Pencil size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); deleteArticle(articleId); }}
            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 shadow-sm"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
    <div className="p-6 flex flex-col justify-between flex-grow">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded uppercase">
            {category}
          </span>
          <div className="flex items-center text-gray-400 text-xs">
            <Calendar size={12} className="mr-1" />
            {date}
          </div>
        </div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {excerpt}
        </p>
      </div>
      <div className="text-right text-xs text-gray-500 font-medium">
        {author}
      </div>
    </div>
  </div>
);

SearchResultCard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  articleId: PropTypes.number.isRequired,
  slug: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default function TagSearchResults() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    const fetchArticlesByTag = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/tags/${tag}/articles`);
        setArticles(response.data.articles || []);
      } catch (error) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllTags = async () => {
      try {
        const response = await axios.get('/api/tags');
        if (response.data && response.data.length > 0) {
          setHashtags(response.data.map(t => `#${t.name}`));
        } else {
          setHashtags([]);
        }
      } catch (error) {
        setHashtags([]);
      }
    };

    if (tag) {
      fetchArticlesByTag();
    }
    fetchAllTags();
  }, [tag]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation />

      <main className="grow">
        <div className="text-white py-8 px-4 md:px-12 mb-8 shadow-inner bg-gradient-to-r from-blue-500/50 to-cyan-200/50 bg-cover bg-center" style={{backgroundImage: 'url(/bg.jpg)'}}>
          <div className="container mx-auto flex justify-between items-center">
            <h2 className="text-4xl font-bold font-sans">#{tag || 'EarthquakePH'}</h2>
            <span className="font-medium bg-white/20 px-4 py-1 rounded-full text-sm backdrop-blur-sm">
              Articles Found: {articles.length}
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-12 pb-12 flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <h3 className="text-2xl font-serif text-gray-800 mb-6 pb-2 border-b border-gray-300 text-left">
              Latest Articles
            </h3>

            {loading ? (
              <SearchResultListSkeleton count={3} />
            ) : articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map((article) => (
                  <SearchResultCard 
                    key={article.id}
                    articleId={article.id}
                    imageUrl={article.image_url}
                    title={article.title}
                    category={article.category}
                    date={article.published_at}
                    excerpt={article.excerpt}
                    author={article.author_name}
                    slug={article.slug}
                    onClick={() => navigate(`/article/${article.slug || article.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No articles found for this tag.
              </div>
            )}
          </div>

          <div className="lg:w-1/3">
            <h3 className="text-2xl font-serif text-gray-800 mb-6 pb-2 border-b border-gray-300">
              Explore
            </h3>
            {hashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((hashtag) => (
                  <div 
                    key={hashtag}
                    className="text-sm text-gray-800 bg-white px-3 py-2 rounded border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => navigate(`/tag/${hashtag.replace('#', '')}`)}
                  >
                    {hashtag}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No tags available</div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}