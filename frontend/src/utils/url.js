import axios from './axiosConfig';

export const getFullUrl = (path) => {
  if (path.startsWith('http')) {
    return path;
  }
  const baseUrl = axios.defaults.baseURL.replace('/api', '');
  return `${baseUrl}/storage/${path}`;
};
