import axios from '../utils/axiosConfig';

const API_URL = '/api/articles';

// Fetch all articles
const getArticles = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Fetch a single article by ID or slug
const getArticle = async (identifier) => {
  const response = await axios.get(`${API_URL}/${identifier}`);
  return response.data;
};

// Create a new article
const createArticle = async (articleData) => {
  const response = await axios.post(API_URL, articleData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update an article
const updateArticle = async (id, articleData) => {
  const response = await axios.post(`${API_URL}/${id}`, articleData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete an article
const deleteArticle = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

// Like an article
const likeArticle = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/like`);
  return response.data;
};

const articleService = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
};

export default articleService;
