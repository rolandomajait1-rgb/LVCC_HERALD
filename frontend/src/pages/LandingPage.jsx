import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import SignUpButton from '../components/SignUpButton';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import bgImage from '../assets/images/bg.jpg';
import logo from '../assets/images/logo.svg';
import laVerdadHerald from '../assets/images/la verdad herald.svg';
import Welcome from '../components/Welcome';
import Footer from '../components/Footer';

import '../App.css';

import LatestArticleCard from '../components/LatestArticleCard';

// The main landing page component
function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const userRole = localStorage.getItem('user_role') || sessionStorage.getItem('user_role');
    
    // Redirect if already logged in
    if (token && !searchParams.get('verified') && !searchParams.get('already_verified')) {
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'moderator') navigate('/moderator');
      else navigate('/home');
      return;
    }
    
    if (searchParams.get('openLogin') === 'true') {
      setIsLoginOpen(true);
      setSearchParams({});
    } else if (searchParams.get('verified') === 'true') {
      if (token) {
        navigate('/home');
      } else {
        setShowVerified(true);
        setIsAlreadyVerified(false);
        setIsLoginOpen(true);
        setSearchParams({});
        const timer = setTimeout(() => setShowVerified(false), 5000);
        return () => clearTimeout(timer);
      }
    } else if (searchParams.get('already_verified') === 'true') {
      if (token) {
        navigate('/home');
      } else {
        setShowVerified(true);
        setIsAlreadyVerified(true);
        setIsLoginOpen(true);
        setSearchParams({});
        const timer = setTimeout(() => setShowVerified(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, setSearchParams, navigate]);

  // Define the hero background style object
  const heroStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(18, 94, 124, 0.5), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <>
      {showVerified && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg">
          <p className="font-semibold">{isAlreadyVerified ? 'Email already verified!' : 'Thank you for confirming your email!'}</p>
          <p className="text-sm">You can now log in to your account.</p>
        </div>
      )}

      <section
        className="flex min-h-screen flex-col items-center justify-center text-white"
        style={heroStyle}
      >
        <div className="container mx-auto max-w-8xl px-4 py-10 text-center">
          <div className="mb-6 flex flex-col items-center space-y-4 py-4">
            <img
              src={logo}
              alt="La Verdad Christian College Logo"
              className="h-auto w-80"
            />
            <img
              src={laVerdadHerald}
              alt="La Verdad Herald"
              className="h-auto w-130"
            />
            <p className="text-xl font-medium text-gray-300">
              The Official Higher Education Student Publication of La Verdad
              Christian College, Inc.
            </p>
          </div>
          <div className="flex justify-center space-x-2 scroll-px-40">
            <LoginButton onClick={() => setIsLoginOpen(true)} />
            <SignUpButton onClick={() => setIsRegisterOpen(true)} />
          </div>
        </div>
      </section>

      <Welcome />

      <LatestArticleCard onArticleClick={() => setIsLoginOpen(true)} />

      <Footer onOpenLogin={() => setIsLoginOpen(true)} />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSwitchToRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} 
      />
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSwitchToLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} 
      />
    </>
  );
}

export default LandingPage;
