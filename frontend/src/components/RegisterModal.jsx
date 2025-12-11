import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from '../utils/axiosConfig';
import { REGISTRATION_SUCCESS_TIMEOUT } from '../utils/constants';
import rateLimiter from '../utils/rateLimiter';
import { sanitizeEmail, sanitizeName } from '../utils/inputSanitizer';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '', password: '', password_confirmation: '' });
      setErrors({});
      setSuccess(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = sanitizeEmail(formData.email);
    const name = sanitizeName(formData.name);
    const rateLimitKey = `register_${email}`;
    
    if (!rateLimiter.canAttempt(rateLimitKey)) {
      const blockedTime = rateLimiter.getBlockedTime(rateLimitKey);
      setErrors({ general: `Too many attempts. Please wait ${blockedTime} seconds.` });
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    try {
      await axios.post('/api/register', { name, email, password: formData.password, password_confirmation: formData.password_confirmation });
      rateLimiter.recordAttempt(rateLimitKey, true);
      setSuccess(true);
      setTimeout(() => { onClose(); onSwitchToLogin(); }, REGISTRATION_SUCCESS_TIMEOUT);
    } catch (error) {
      rateLimiter.recordAttempt(rateLimitKey, false);
      
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(apiErrors).forEach(key => {
          formattedErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setErrors(formattedErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 md:p-8 shadow-lg my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 w-full text-center">Register</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close registration modal">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded"><p className="font-semibold">Registration successful!</p><p className="text-sm mt-1">Please check your email for a verification link. You must verify your email before logging in.</p></div>}
        {errors.general && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-left text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder='Enter your full name' autoComplete="name" className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-left text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder='Enter your email' autoComplete="email" className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block text-left text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,}" title="Password must contain at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*#?&)" placeholder='Enter your Password' autoComplete="new-password" className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" onCopy={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()} onCut={(e) => e.preventDefault()} onDrag={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="mb-6 text-left">
            <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} id="password_confirmation" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required placeholder='Confirm Password' autoComplete="new-password" className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" onCopy={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()} onCut={(e) => e.preventDefault()} onDrag={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={isLoading} className="w-60 rounded-2xl bg-cyan-700 px-4 py-2 text-white font-bold hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Submit registration form">{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Already have an account? <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-500" aria-label="Switch to login form">Sign in</button></p>
        </div>
      </div>
    </div>
  );
}

RegisterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
};
