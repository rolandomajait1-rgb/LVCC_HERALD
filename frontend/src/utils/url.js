import axios from './axiosConfig';

export const getFullUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) {
    return path;
  }
  const baseUrl = axios.defaults.baseURL.replace('/api', '');
  if (path.startsWith('/storage/')) {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/storage/${path}`;
};
