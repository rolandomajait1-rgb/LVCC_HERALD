import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  if (!getAuthToken()) {
    return <Navigate to="/landing" replace />;
  }
  return children;
};

export default ProtectedRoute;
