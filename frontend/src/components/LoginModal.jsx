import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/login', { email: formData.email, password: formData.password });
      const token = response.data.token;
      const userRole = response.data.role;
      const userData = response.data.user;
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
      
      if (formData.remember) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_email', formData.email);
        localStorage.setItem('user_name', userData.name);
        localStorage.setItem('user_role', userRole);
        localStorage.setItem('token_expires_at', expiresAt);
        localStorage.setItem('remember_me', 'true');
      } else {
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('user_email', formData.email);
        sessionStorage.setItem('user_name', userData.name);
        sessionStorage.setItem('user_role', userRole);
        sessionStorage.setItem('token_expires_at', expiresAt);
      }
      
      window.dispatchEvent(new Event('authChange'));
      
      setSuccessMessage('Welcome back to La Verdad Herald!');
      sessionStorage.setItem('login_notification', 'Login Successfully!');
      sessionStorage.setItem('login_notification_message', 'Welcome back to La Verdad Herald');
      setTimeout(() => {
        onClose();
        if (userRole === 'admin') navigate('/admin', { state: { fromLogin: true } });
        else if (userRole === 'moderator') navigate('/moderator', { state: { fromLogin: true } });
        else navigate('/home', { state: { fromLogin: true } });
      }, 1500);
    } catch (error) {
      if (error.response?.status === 401) setErrors({ general: 'Invalid email or password.' });
      else if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else if (error.response?.data?.message) setErrors({ general: error.response.data.message });
      else setErrors({ general: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 md:p-8 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800">Login</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 text-left">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" placeholder='Enter your email' className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 text-left">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required placeholder='Enter your Password' autoComplete="current-password" className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
          </div>

          <div className="mb-6 flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" name="remember" checked={formData.remember} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </button>
          </div>

          {errors.general && <p className="mt-1 text-xs text-red-500">{errors.general}</p>}
          {successMessage && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md"><p className="text-sm text-green-800 text-center">{successMessage}</p></div>}

          <button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-cyan-700 px-4 py-2 text-white font-bold hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Signing In...' : 'Log in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Don't have an account? <button onClick={onSwitchToRegister} className="text-blue-600 hover:text-blue-500">Sign up</button></p>
        </div>
      </div>

      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </div>
  );
}
