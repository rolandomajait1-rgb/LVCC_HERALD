import axios from '../utils/axiosConfig';

// Auth utility functions
export const isAdmin = () => {
    const token = getAuthToken();
    const userRole = getUserRole();
    return token && userRole === 'admin';
};

export const isModerator = () => {
    const token = getAuthToken();
    const userRole = getUserRole();
    return token && userRole === 'moderator';
};

export const getAuthToken = () => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const expiresAt = localStorage.getItem('token_expires_at') || sessionStorage.getItem('token_expires_at');
    
    if (token && expiresAt && Date.now() >= parseInt(expiresAt)) {
        clearAuthData();
        return null;
    }
    
    return token;
};

const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('token_expires_at');
};

export const getUserRole = () => {
    return localStorage.getItem('user_role') || sessionStorage.getItem('user_role');
};

// Article management functions
export const editArticle = (articleId) => {
    window.location.href = `/admin/edit-article/${articleId}`;
};

export const deleteArticle = async(articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
        return false;
    }

    try {
        await axios.delete(`/api/articles/${articleId}`);
        alert('Article deleted successfully');
        window.location.reload();
        return true;
    } catch (error) {
        console.error('Error deleting article:', error);
        alert('Error deleting article');
        return false;
    }
};
