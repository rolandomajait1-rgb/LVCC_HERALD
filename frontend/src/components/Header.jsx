import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem('auth_token');
      const role = localStorage.getItem('user_role');
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    updateAuthState();
    window.addEventListener('storage', updateAuthState);
    window.addEventListener('authChange', updateAuthState);

    return () => {
      window.removeEventListener('storage', updateAuthState);
      window.removeEventListener('authChange', updateAuthState);
    };
  }, []);



  const handleAdminAccess = () => {
    navigate('/admin/statistics');
  };

  return (
    <header
      className="flex w-full items-center px-4 md:px-8 py-4 md:py-6 bg-cover"
      style={{
        backgroundImage: `linear-gradient(to left, rgba(42,90,130,0.2), #2a5a82 80%), url('/header.png')`,
        backgroundPosition: 'right center'
      }}
    >

      {/* Invisible spacer to push content to center */}
      <div className="flex-1 hidden md:block"></div>

      {/* === CENTERED CONTENT === */}
      <div className="flex flex-col items-center gap-2 flex-1 md:flex-initial">
        {/* Images */}
        <div className="flex items-center gap-3 md:gap-6">
          <img
            src="/logo.svg"
            alt="La Verdad Logo"
            className="h-[40px] sm:h-[50px] md:h-[70px] w-auto object-contain cursor-pointer"
            onClick={() => {
              if (isLoggedIn && (userRole === 'admin' || userRole === 'moderator')) {
                navigate('/admin');
              } else {
                navigate('/home');
              }
            }}
          />

          <img
            src="/la verdad herald.svg"
            alt="La Verdad Herald"
            className="h-[30px] sm:h-[35px] md:h-[50px] w-auto object-contain cursor-pointer"
            onClick={() => {
              if (isLoggedIn && (userRole === 'admin' || userRole === 'moderator')) {
                navigate('/admin');
              } else {
                navigate('/home');
              }
            }}
          />
        </div>
      </div>

      {/* Invisible spacer to balance the layout */}
      <div className="flex-1 hidden md:block"></div>

      {/* === RIGHT SIDE === */}
      <div className="flex items-center gap-2 md:gap-4 relative">
        {/* Admin icon - only show if admin or moderator is logged in */}
        {isLoggedIn && (userRole === 'admin' || userRole === 'moderator') && (
          <button
            onClick={handleAdminAccess}
            className="flex h-[40px] w-[40px] md:h-[50px] md:w-[50px] items-center justify-center rounded-full shadow-md hover:bg-yellow-500 transition-colors cursor-pointer"
            title="Admin Dashboard"
          >
            <img
              src="/dashboard.svg"
              alt="Admin Dashboard"
              className="h-[20px] md:h-[30px] w-auto brightness-0 invert pointer-events-none"
            />
          </button>
        )}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex h-[40px] w-[40px] md:h-[50px] md:w-[50px] items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
            >
              <FaUser className="text-xl md:text-2xl text-[#2a5a82]" />
            </button>


          </div>
        ) : (
          <Link to="/login">
            <div className="flex h-[40px] w-[40px] md:h-[50px] md:w-[50px] items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors">
              <FaUser className="text-xl md:text-2xl text-[#2a5a82]" />
            </div>
          </Link>
        )}
      </div>


    </header>
  );
}

export default Header;
