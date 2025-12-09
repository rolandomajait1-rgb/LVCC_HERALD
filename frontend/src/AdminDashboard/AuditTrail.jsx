import React, { useState, useEffect } from "react";
import { FiBarChart, FiPlus, FiFileText, FiUsers, FiActivity } from 'react-icons/fi';
import Header from "../components/Header";
import Navigation from "../components/HeaderLink";
import { AdminSidebar } from "../components/AdminSidebar";
import { getUserRole } from '../utils/auth';
import axios from '../utils/axiosConfig';

export default function AuditTrail() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const rolePrefix = getUserRole() === 'moderator' ? '/moderator' : '/admin';
  const sidebarLinks = [
    { label: "Statistics", icon: <FiBarChart size={16} />, to: `${rolePrefix}/statistics` },
    { label: "Create Article", icon: <FiPlus size={16} />, to: `${rolePrefix}/create-article` },
    { label: "Draft Articles", icon: <FiFileText size={16} />, to: `${rolePrefix}/draft-articles` },
    { label: "Manage Moderators", icon: <FiUsers size={16} />, to: "/admin/manage-moderators" },
    { label: "Audit Trail", icon: <FiActivity size={16} />, to: `${rolePrefix}/audit-trail`, active: true },
  ];

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    document.title = getUserRole() === 'moderator' ? 'MODERATOR | Dashboard' : 'ADMIN | Dashboard';
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get('/api/admin/audit-logs');
      setAuditLogs(response.data || []);
    } catch (error) {
      setAuditLogs([]);
    } finally {
      setLoading(false);
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

        <div className="flex-1 flex items-center justify-center p-4 md:p-8 h-[calc(100vh-180px)] overflow-y-auto">
          <div className="max-w-6xl w-full">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-6 md:hidden">Audit Trail</h2>
            <div className="w-full border border-gray-400 shadow-sm bg-white overflow-x-auto">
            <div className="hidden md:grid grid-cols-12 bg-[#9FB6C3] border-b border-gray-400">
              <div className="col-span-2 px-4 py-3 font-bold text-black text-center border-r border-gray-400 flex items-center justify-center">Action</div>
              <div className="col-span-4 px-4 py-3 font-bold text-black text-center border-r border-gray-400 flex items-center justify-center">Title of the article</div>
              <div className="col-span-3 px-4 py-3 font-bold text-black text-center border-r border-gray-400 flex items-center justify-center">User</div>
              <div className="col-span-3 px-4 py-3 font-bold text-black text-center flex items-center justify-center">Timestamp</div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-gray-400 bg-white min-h-12">
                <div className="col-span-12 px-4 py-3 flex items-center justify-center text-black text-sm">
                  Loading audit logs...
                </div>
              </div>
            ) : auditLogs.length > 0 ? (
              auditLogs.map((log, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 border-b border-gray-400 last:border-b-0 bg-white">
                  <div className={`md:col-span-2 px-4 py-3 flex flex-col md:flex-row items-start md:items-center md:justify-center border-b md:border-b-0 md:border-r border-gray-400 text-sm font-medium ${
                    log.action === 'deleted' ? 'text-[#EB5757]' : 'text-[#2D9CDB]'
                  }`}>
                    <span className="md:hidden font-bold text-black mr-2">Action:</span>
                    {log.action}
                  </div>
                  <div className="md:col-span-4 px-4 py-3 flex flex-col md:flex-row items-start md:items-center md:justify-center border-b md:border-b-0 md:border-r border-gray-400 text-black text-sm">
                    <span className="md:hidden font-bold mr-2">Article:</span>
                    <span className="break-words">{log.article_title || 'N/A'}</span>
                  </div>
                  <div className="md:col-span-3 px-4 py-3 flex flex-col md:flex-row items-start md:items-center md:justify-center border-b md:border-b-0 md:border-r border-gray-400 text-black text-sm">
                    <span className="md:hidden font-bold mr-2">User:</span>
                    <span className="break-all">{log.user_email || 'Unknown'}</span>
                  </div>
                  <div className="md:col-span-3 px-4 py-3 flex flex-col md:flex-row items-start md:items-center md:justify-center text-black text-sm">
                    <span className="md:hidden font-bold mr-2">Timestamp:</span>
                    {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-gray-400 bg-white min-h-12">
                <div className="col-span-12 px-4 py-3 flex items-center justify-center text-gray-500 text-sm">
                  No audit logs found
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
