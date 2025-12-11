import axios from './axiosConfig';

export const getFullUrl = (path) => {
  if (!path) return 'https://placehold.co/300x200/e2e8f0/64748b?text=No+Image';
  if (path.startsWith('http')) {
    return path;
  }
  const baseUrl = axios.defaults.baseURL || 'https://lvcc-herald.onrender.com';
  const cleanBase = baseUrl.replace(/\/api$/, '').replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  
  if (cleanPath.startsWith('storage/')) {
    return `${cleanBase}/${cleanPath}`;
  }
  return `${cleanBase}/storage/${cleanPath}`;
};
