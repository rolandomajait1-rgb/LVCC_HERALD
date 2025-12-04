import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/HeaderLink';
import Footer from '../components/Footer';
import axios from '../utils/axiosConfig';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [likedArticles, setLikedArticles] = useState([]);
  const [sharedArticles, setSharedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('/api/user');
        setUser(userResponse.data);

        const likedResponse = await axios.get('/api/user/liked-articles');
        setLikedArticles(likedResponse.data || []);

        const sharedResponse = await axios.get('/api/user/shared-articles');
        setSharedArticles(sharedResponse.data || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navigation />
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          {user && (
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {user.name}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Role:</span> {user.role}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Liked Articles ({likedArticles.length})</h2>
            {likedArticles.length > 0 ? (
              <div className="space-y-4">
                {likedArticles.map((article) => (
                  <div key={article.id} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-semibold hover:text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/article/${article.slug}`)}>
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500">{article.author_name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No liked articles yet</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Shared Articles ({sharedArticles.length})</h2>
            {sharedArticles.length > 0 ? (
              <div className="space-y-4">
                {sharedArticles.map((article) => (
                  <div key={article.id} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-semibold hover:text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/article/${article.slug}`)}>
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500">{article.author_name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No shared articles yet</p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
