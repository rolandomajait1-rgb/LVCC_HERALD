import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();
  const expiresAt = localStorage.getItem('token_expires_at') || sessionStorage.getItem('token_expires_at');
  const isExpired = expiresAt ? Date.now() >= parseInt(expiresAt) : false;
  if (!token || isExpired) {
    return <Navigate to="/landing" replace />;
  }
  return children;
};

export default ProtectedRoute;
