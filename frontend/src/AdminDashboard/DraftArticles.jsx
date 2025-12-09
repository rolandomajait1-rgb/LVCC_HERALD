import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiBarChart, FiPlus, FiFileText as FiFile, FiUsers, FiActivity } from 'react-icons/fi';
import { Plus, Pencil, Trash2, Upload, Calendar } from 'lucide-react';
import Header from "../components/Header";
import { AdminSidebar } from "../components/AdminSidebar";
import { getUserRole } from '../utils/auth';
import Navigation from "../components/HeaderLink";
import Notification from '../components/Notification';
import axios from '../utils/axiosConfig';

const SortableDraftItem = ({ id, title, category, date, summary, author, featuredImage, onEdit, onDelete, onPublish }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col lg:flex-row gap-4 mb-6"
    >
      <div 
        {...attributes}
        {...listeners}
        className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row h-full md:h-64 cursor-move"
      >
        <div className="md:w-1/3 relative bg-gray-200 h-48 md:h-full">
          <img
            src={featuredImage || "https://placehold.co/600x350/333/FFF?text=NO+IMAGE"}
            alt="Article Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-4 md:p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 uppercase rounded-sm">
                {category}
              </span>
              <div className="flex items-center text-gray-400 text-xs">
                <Calendar size={12} className="mr-1" />
                {date}
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-black mb-2 md:mb-3">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {summary}
            </p>
          </div>
          <div className="text-right text-xs text-gray-500 font-medium">
            {author}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-48 bg-gray-100 rounded-lg border border-gray-200 flex flex-row lg:flex-col items-center justify-center gap-4 lg:gap-6 p-4 shadow-sm">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(id); }} 
          className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 text-gray-800 hover:text-black transition-colors font-medium group cursor-pointer"
        >
          <div className="bg-transparent group-hover:bg-gray-200 p-1 rounded">
            <Pencil size={20} strokeWidth={2} />
          </div>
          <span className="text-sm lg:text-lg">Edit</span>
        </button>
        {getUserRole() === 'admin' && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(id); }} 
              className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 text-red-500 hover:text-red-700 transition-colors font-medium group cursor-pointer"
            >
              <div className="bg-transparent group-hover:bg-red-100 p-1 rounded">
                <Trash2 size={20} strokeWidth={2} />
              </div>
              <span className="text-sm lg:text-lg">Delete</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onPublish(id); }} 
              className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 text-sky-500 hover:text-sky-700 transition-colors font-medium group cursor-pointer"
            >
              <div className="bg-transparent group-hover:bg-sky-100 p-1 rounded">
                <Upload size={20} strokeWidth={2} />
              </div>
              <span className="text-sm lg:text-lg">Publish</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function DraftArticles() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: 'success', title: '', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showNotification = (type, title, message = '') => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => setNotification({ show: false, type: 'success', title: '', message: '' }), 5000);
  };

  const rolePrefix = getUserRole() === 'moderator' ? '/moderator' : '/admin';
  const sidebarLinks = [
    { label: "Statistics", icon: <FiBarChart size={16} />, to: `${rolePrefix}/statistics` },
    { label: "Create Article", icon: <FiPlus size={16} />, to: `${rolePrefix}/create-article` },
    { label: "Draft Articles", icon: <FiFile size={16} />, to: `${rolePrefix}/draft-articles`, active: true },
    { label: "Manage Moderators", icon: <FiUsers size={16} />, to: "/admin/manage-moderators" },
    { label: "Audit Trail", icon: <FiActivity size={16} />, to: `${rolePrefix}/audit-trail` },
  ];

  useEffect(() => {
    fetchDrafts();
    
    const message = sessionStorage.getItem('notification_message');
    const type = sessionStorage.getItem('notification_type');
    if (message) {
      showNotification(type || 'success', message);
      sessionStorage.removeItem('notification_message');
      sessionStorage.removeItem('notification_type');
    }
  }, []);

  useEffect(() => {
    document.title = getUserRole() === 'moderator' ? 'MODERATOR | Dashboard' : 'ADMIN | Dashboard';
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await axios.get('/api/articles?status=draft');
      const articles = response.data.data || [];
      const onlyDrafts = articles.filter(article => article.status === 'draft');
      setDrafts(onlyDrafts);
    } catch (error) {
      setDrafts([]);
      showNotification('error', 'Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const rolePrefix = getUserRole() === 'moderator' ? '/moderator' : '/admin';
    navigate(`${rolePrefix}/edit-article/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/articles/${deleteId}`);
      setShowDeleteModal(false);
      setDeleteId(null);
      showNotification('success', 'Draft Deleted Successfully!');
      fetchDrafts();
    } catch (error) {
      setShowDeleteModal(false);
      setDeleteId(null);
      showNotification('error', 'Failed to delete draft', error.response?.data?.message || error.message);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handlePublish = async (id) => {
    if (window.confirm('Are you sure you want to publish this article?')) {
      try {
        // Fetch article data first
        const articleResponse = await axios.get(`/api/articles/${id}`);
        const article = articleResponse.data;
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', article.title);
        formData.append('content', article.content);
        formData.append('category_id', article.categories?.[0]?.id || '');
        formData.append('tags', article.tags?.map(t => t.name).join(', ') || '');
        formData.append('author_name', article.author_name || article.author?.user?.name || '');
        formData.append('status', 'published');

        await axios.post(`/api/articles/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        showNotification('success', 'Article Published Successfully!');
        fetchDrafts();
      } catch (error) {
        showNotification('error', 'Failed to publish article', error.response?.data?.message || error.message);
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setDrafts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Notification {...notification} />
      
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
                onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Header />
      <Navigation />
      <div className={`relative h-20 flex items-center justify-center ${getUserRole() === 'moderator' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gradient-to-b from-blue-600 to-blue-800'}`}>
        <h1 className="text-white font-serif font-bold tracking-widest leading-none text-2xl drop-shadow-lg">
          {getUserRole() === 'moderator' ? 'MODERATOR | Dashboard' : 'ADMIN | Dashboard'}
        </h1>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        {(() => {
          const filtered = getUserRole() === 'moderator' ? sidebarLinks.filter(l => l.label !== 'Manage Moderators') : sidebarLinks;
          return <AdminSidebar links={filtered} />;
        })()}

        <div className="flex flex-col flex-1 h-[calc(100vh-180px)] overflow-y-auto bg-gray-50">
          <div className="p-4 md:p-8 flex flex-col flex-1">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-black">Drafts</h1>
              <button onClick={() => navigate(`${rolePrefix}/create-article`)} className="hover:bg-gray-200 p-2 rounded-full transition-colors">
                <Plus size={24} className="md:hidden text-black stroke-[2.5]" />
                <Plus size={32} className="hidden md:block text-black stroke-[2.5]" />
              </button>
            </div>
            <div className={`flex-1 ${loading ? 'flex justify-center items-center' : ''}`}>
              {loading ? (
                <div className="text-center">Loading drafts...</div>
              ) : drafts.length > 0 ? (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={drafts}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {drafts.map((draft) => (
                        <SortableDraftItem
                          key={draft.id}
                          id={draft.id}
                          title={draft.title}
                          category={draft.categories?.[0]?.name || 'Uncategorized'}
                          date={new Date(draft.created_at).toLocaleDateString()}
                          summary={draft.content ? (draft.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...') : 'No content available'}
                          author={draft.author_name || draft.author?.user?.name || 'Unknown Author'}
                          featuredImage={draft.featured_image}
                          onEdit={handleEdit}
                          onDelete={openDeleteModal}
                          onPublish={handlePublish}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">No drafts found</p>
                  <p className="text-gray-500 text-sm">Create a new article and save it as draft to see it here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
