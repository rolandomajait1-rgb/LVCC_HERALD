import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();
  const location = useLocation();
  const userRole = localStorage.getItem('user_role') || sessionStorage.getItem('user_role');
  
  if (!token) {
    return <Navigate to="/landing" replace />;
  }
  
  // Redirect admin to admin dashboard if trying to access home
  if (userRole === 'admin' && (location.pathname === '/' || location.pathname === '/home')) {
    return <Navigate to="/admin" replace />;
  }
  
  // Redirect moderator to moderator dashboard if trying to access home
  if (userRole === 'moderator' && (location.pathname === '/' || location.pathname === '/home')) {
    return <Navigate to="/moderator" replace />;
  }
  
  return children;
};

export default ProtectedRoute;