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
      {...attributes}
      {...listeners}
      className="flex flex-col lg:flex-row gap-4 mb-6"
    >
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 relative bg-gray-200 h-48 md:h-auto">
          <img
            src={featuredImage || "https://placehold.co/600x350/333/FFF?text=NO+IMAGE"}
            alt="Article Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-4 md:p-6 flex flex-col justify-between">
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
        <button onClick={() => onEdit(id)} className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 text-gray-800 hover:text-black transition-colors font-medium group">
          <div className="bg-transparent group-hover:bg-gray-200 p-1 rounded">
            <Pencil size={20} md:size={24} strokeWidth={2} />
          </div>
          <span className="text-sm lg:text-lg">Edit</span>
        </button>
        <button onClick={() => onDelete(id)} className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 text-red-500 hover:text-red-700 transition-colors font-medium group">
          <div className="bg-transparent group-hover:bg-red-100 p-1 rounded">
            <Trash2 size={20} md:size={24} strokeWidth={2} />
          </div>
          <span className="text-sm lg:text-lg">Delete</span>
        </button>
        <button onClick={() => onPublish(id)} className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3 text-sky-500 hover:text-sky-700 transition-colors font-medium group">
          <div className="bg-transparent group-hover:bg-sky-100 p-1 rounded">
            <Upload size={20} md:size={24} strokeWidth={2} />
          </div>
          <span className="text-sm lg:text-lg">Publish</span>
        </button>
      </div>
    </div>
  );
};

export default function DraftArticles() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  useEffect(() => {
    document.title = getUserRole() === 'moderator' ? 'MODERATOR | Dashboard' : 'ADMIN | Dashboard';
  }, []);

  const fetchDrafts = async () => {
    try {
      console.log('🔍 Fetching drafts from API...');
      const response = await axios.get('/api/articles?status=draft');
      
      console.log('📦 API Response:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: Object.keys(response.data || {}),
        totalItems: response.data.total || 0
      });
      
      // Backend returns paginated response: { data: [...], current_page, last_page, etc }
      const articles = response.data.data || [];
      console.log(`📄 Articles array length: ${articles.length}`);
      
      // Log actual statuses
      if (articles.length > 0) {
        console.log('📋 Article statuses:', articles.map(a => ({ id: a.id, title: a.title?.substring(0, 30), status: a.status })));
      }
      
      // Filter to ensure only drafts (double check)
      const onlyDrafts = articles.filter(article => article.status === 'draft');
      console.log(`✅ Found ${onlyDrafts.length} draft(s)`);
      
      if (onlyDrafts.length > 0) {
        console.log('📝 First draft:', {
          id: onlyDrafts[0].id,
          title: onlyDrafts[0].title,
          status: onlyDrafts[0].status,
          author: onlyDrafts[0].author_name
        });
      }
      
      setDrafts(onlyDrafts);
    } catch (error) {
      console.error('❌ Error fetching drafts:', error);
      console.error('Error details:', error.response?.data || error.message);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const rolePrefix = getUserRole() === 'moderator' ? '/moderator' : '/admin';
    navigate(`${rolePrefix}/edit-article/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await axios.delete(`/api/articles/${id}`);
        alert('Draft deleted successfully!');
        fetchDrafts();
      } catch (error) {
        console.error('Error deleting draft:', error);
        alert('Failed to delete draft: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handlePublish = async (id) => {
    if (window.confirm('Are you sure you want to publish this article?')) {
      try {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('status', 'published');

        await axios.post(`/api/articles/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert('Article published successfully!');
        fetchDrafts();
      } catch (error) {
        console.error('Error publishing article:', error);
        alert('Failed to publish article: ' + (error.response?.data?.message || error.message));
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
                          onDelete={handleDelete}
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
