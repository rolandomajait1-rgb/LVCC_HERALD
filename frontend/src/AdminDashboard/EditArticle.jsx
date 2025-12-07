import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, ChevronDown } from 'lucide-react';
import Header from "../components/Header";
import Navigation from '../components/HeaderLink';
import Notification from '../components/Notification';
import axios from '../utils/axiosConfig';
import { getFullUrl } from '../utils/url';
import useStickyState from "../hooks/useStickyState";

export default function EditArticle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useStickyState("", `edit-article-${id}-title`);
  const [category, setCategory] = useStickyState("", `edit-article-${id}-category`);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useStickyState("", `edit-article-${id}-tags`);
  const [content, setContent] = useStickyState("", `edit-article-${id}-content`);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [author, setAuthor] = useStickyState("", `edit-article-${id}-author`);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: 'success', title: '', message: '' });

  const showNotification = (type, title, message = '') => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => setNotification({ show: false, type: 'success', title: '', message: '' }), 5000);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        console.log('Fetching article with ID:', id);
        
        const response = await axios.get(`/api/articles/${id}`);
        
        console.log('Response status:', response.status);
        console.log('Article data:', response.data);
        
        const article = response.data;
        setTitle(article.title || "");
        setAuthor(article.author_name || article.author?.user?.name || article.author?.name || "");
        setCategory(article.categories?.[0]?.id || "");
        const tagsString = Array.isArray(article.tags) 
          ? article.tags.map(tag => tag.name || tag).join(', ')
          : (article.tags || '');
        setTags(tagsString);
        setContent(article.content || "");
        setCurrentImage(article.featured_image || null);
      } catch (error) {
        console.error('Error fetching article:', error);
        console.error('Error details:', error.response?.data);
        showNotification('error', 'Failed to load article', error.response?.data?.message || error.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchArticle();
    }
  }, [id, setTitle, setAuthor, setCategory, setTags, setContent]);

  useEffect(() => {
    const valid = title.trim() && category && content.trim() && tags.trim() && String(author).trim();
    setIsFormValid(valid);
  }, [title, category, content, tags, author]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories?for_dropdown=true');
        setCategories(res.data);
      } catch (e) {
        console.error('Failed to fetch categories:', e);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload only JPEG or PNG images');
        e.target.value = '';
        return;
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Image size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      console.log('Image selected:', {
        name: file.name,
        type: file.type,
        size: (file.size / 1024 / 1024).toFixed(2) + 'MB'
      });
      
      setImage(file);
    }
  };

  const validateForm = () => {
    if (!title.trim() || !category || !content.trim() || !tags.trim() || !String(author).trim()) {
      alert("Please fill in all required fields before updating.");
      return false;
    }
    return true;
  };

  const clearFormState = () => {
    window.localStorage.removeItem(`edit-article-${id}-title`);
    window.localStorage.removeItem(`edit-article-${id}-category`);
    window.localStorage.removeItem(`edit-article-${id}-tags`);
    window.localStorage.removeItem(`edit-article-${id}-content`);
    window.localStorage.removeItem(`edit-article-${id}-author`);
  }

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('title', title.trim());
      formData.append('category_id', category);
      formData.append('content', content.trim());
      formData.append('tags', tags.trim());
      formData.append('author_name', author.trim());
      
      if (image) {
        console.log('📸 Uploading new image:', image.name);
        formData.append('featured_image', image, image.name);
      }

      console.log('💾 Updating article ID:', id);
      
      const response = await axios.post(`/api/articles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 60000 // 60 seconds for mobile uploads
      });
      
      if (response.status === 200) {
        showNotification('success', 'Article updated successfully!');
        clearFormState();
        navigate(-1);
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      
      let errorMessage = 'Failed to update article';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout. Please check your internet connection and try again.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        
        if (error.response.status === 413) {
          errorMessage = 'Image file is too large. Please use an image smaller than 5MB.';
        } else if (error.response.status === 422) {
          const errors = error.response.data?.errors;
          if (errors) {
            errorMessage = Object.values(errors).flat().join('\n');
          }
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      }
      
      showNotification('error', 'Error', errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading article...</div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white">
      <Notification {...notification} />
      <Header />
      <Navigation />
      <div className="p-4 md:p-8 font-sans text-gray-900 flex justify-center">
        <div className="w-full max-w-2xl px-4 md:px-0">
          <h1 className="text-2xl font-serif  text-left font-bold mb-6 text-black tracking-tight">
            Edit Article
          </h1>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-md font-normal text-left  text-gray-800">Title</label>
              <input 
                id="title"
                type="text" 
                value={title}
                placeholder="Enter article title"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded-md text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="author" className="block text-md font-normal text-left text-gray-800">Author</label>
              <input 
                id="author"
                type="text" 
                value={author}
                placeholder="Enter author name"
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded-md text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="text-gray-700 font-medium text-sm">
                <h1>Cover image</h1>
              </div>
              <label
                htmlFor="cover-image"
                className="border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 text-center p-5 cursor-pointer flex flex-col items-center justify-center min-h-40"
              >
                {(image || currentImage) ? (
                  <img
                    src={image ? URL.createObjectURL(image) : 
                      (currentImage ? 
                        getFullUrl(currentImage)
                        : 'https://placehold.co/300x200/e2e8f0/64748b?text=No+Image')}
                    alt="Cover Preview"
                    className="max-w-full max-h-64 rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-500 mt-2">Click or drag image to upload</p>
                  </>
                )}
                <input
                  id="cover-image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2">
               <label htmlFor="category" className="block text-md font-normal text-left text-gray-800">Category</label>
               <div className="relative">
                 <select 
                    id="category"
                    value={category}
                    placeholder="Select Category"
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded-md text-gray-800 appearance-none bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all cursor-pointer"
                 >
                   <option value="">Select Category</option>
                   {categories.map((cat) => (
                     <option key={cat.id} value={cat.id}>{cat.name}</option>
                   ))}
                 </select>
                 <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="text-gray-500" size={24} strokeWidth={1.5} />
                 </div>
               </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="block text-md font-normal text-left text-gray-800">Tags</label>
              <input 
                id="tags"
                type="text" 
                value={tags}
                placeholder="Add tags"
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded-md text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-md font-normal text-left text-gray-800">Article Content</label>
              <textarea 
                id="content"
                rows={8}
                value={content}
                placeholder="Write your article content here..."
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded-md text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all leading-relaxed resize-y"
              />
            </div>

            <div className="pt-4 flex flex-col md:flex-row justify-end gap-2">
              <button 
                onClick={handleUpdate}
                disabled={!isFormValid || isUpdating}
                className="px-6 py-2 bg-[#5195ea] text-white font-bold rounded-md hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-[#8d9896] text-white font-bold rounded-md hover:bg-gray-600 transition-colors shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
