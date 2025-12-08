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
    setErrors({});
    try {
      const response = await axios.post('/api/login', { email: formData.email, password: formData.password });
      const token = response.data.token;
      const userRole = response.data.role;
      const userData = response.data.user;
      const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      
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
      
      sessionStorage.setItem('login_notification', 'Login Successfully!');
      sessionStorage.setItem('login_notification_message', 'Welcome back to La Verdad Herald');
      onClose();
      if (userRole === 'admin') navigate('/admin', { state: { fromLogin: true } });
      else if (userRole === 'moderator') navigate('/moderator', { state: { fromLogin: true } });
      else navigate('/home', { state: { fromLogin: true } });
    } catch (error) {
      if (error.response?.status === 401) setErrors({ password: 'Wrong password. Please try again.' });
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
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 text-center">Login</h2>
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
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required placeholder='Enter your Password' autoComplete="current-password" onPaste={(e) => e.preventDefault()} className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
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

          {errors.general && <p className="mb-4 text-sm text-red-500 text-center">{errors.general}</p>}

          <button type="submit" disabled={isLoading} className="w-full rounded-2xl bg-cyan-700 px-4 py-2 text-white font-bold hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Signing In...' : 'Log in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Don't have an account? <button onClick={onSwitchToRegister} className="text-blue-600 hover:text-blue-500">Sign up</button></p>
        </div>
      </div>




Amazon Q
Did you know?
Pinned context is always included in future chat messages
Select code & ask me to explain, debug or optimize it, or type / for quick actions

may
Kapag wrong password ang nilagay ko, sinasabi invaid email or password tapos nagpapakita lang yung loading screen and bumabalik sa landing page, instead of saying lang sa input na “Wrong password” or kung ano mang error message
Nakakapag paste ako sa login password field (am not sure if oks lang ba to or not)

Yung signup, wala sya nung loading na “signing in…” or something like that to indicate na nagsesend na sa backend.

Di pa nas-seed yung mga published articles ng herald

Hindi ako makapag delete ng article although admin yung account ko (modal)

Sa article page, meron paring border, tas hindi napipindot yung category nya (Hindi nagreredirect to that category kapag pindot)

>Sa tags part

Hindi pumapasok yung articles na under this tag, i think problem sa database? Or sa controller ng Article, dpaat may ma create din na record sa article_tag table…

Tas naka stack sana vertically yung other tags

Article Page

Kapag ni-copy ko yung link ng article, tas pinaste ko sa anotehr tab, napupunta lang ako sa landing page.
Di gumagana yung like
Kapag nag share ako sa fb, link lang ng mismong site yung kita, not yung mismong article
Sa routing din siguro ng article, as oks siguro kung yung article id ang basis, hindi title kasi baka magkagulo dun

Contact
Sa request coverage, ayaw

Na log out ako magisa after kong makapagsend ng application email

Kahit nakalogin nako sa same window sa chrome, hindi ako makapasok sa dashboard route. Dapat kapag nakalogin na, iredirect na sya agad sa /dashboard route.

Sa change password, wala ding indicator na nagch-change na yung password like sa button (like kahit ma disable lang sya or like changing password…)

Search
Di gumagana yung search (sinearch ko yung inedit ko na article titled “edited title”, walang lumalabas sa search)

Yung timestamps sa audit trail hindi ata match
(12/08/2025 around 12am dapat mga i2)

-Yung mga flash messages like “draft saved successfully, nakapatong sila sa header instead of under ng header)

Edit
Sa edit page, yung tags, di nafollow yung format na kagaya nung sa create article page

Kapag edited successfully yung draft, dapat dito sya nagpapakita

Kaso, nagpapakita sya dun sa mismong edit page, tapos mawawala rin kaagad kaya di makikita ni user yung success message

Nagsuccessfull delete tapos biglang Failed to delete, kahit admin naman ako

Di ako makapag alis ng moderator

Gumagana yung audit trail sa statistics, pero sa mismong audit trail page hindi
Statistics:

Audit trail:

Tapos hindi dapat red kapag updated, deleted lang ang red
And hindi naman me nakapag delete talaga kasi failed sya pero sabi dito deletd daw
Gayahin nalnag nasa statistics page ig

Di nagana yung sa views
I thin sa part to ng controller ng article or baka kulang din ng view sa schema ng article?

Kapag pinindot yung facebook logo sa footer, napupunta ako kay Julio gaming HAHAHA

After neto na-logout na naman ako magisa…

Possible reasons sabi ni gpt:
https://chatgpt.com/s/t_6935b31bc4908191bd78d3fbe21fe3e3 (click nalnag ng linkkk)


Context
Maraming issues na kailangan ayusin! Let me help you fix these one by one. I'll start by reading the relevant files to understand the current implementation.

6 files read
RegisterModal.jsx
ArticlePage.jsx
ArticleController.php
AuthController.php
SearchBar.jsx
api.php
Let me read more files to understand the complete structure:

4 files read
ArticleDetail.jsx
App.jsx
DatabaseSeeder.php
AdminDashboard.jsx
Maraming issues! Let me create a comprehensive plan to fix all of them. I'll start with the most critical ones:

Plan:
Login error handling - Show error message properly instead of redirecting

Register loading indicator - Add loading state

Password paste prevention - Remove paste ability (optional)

Article routing - Fix slug-based routing

Like functionality - Connect to backend

Search functionality - Fix search

Change password loading - Add loading indicator

Logout issue - Fix token expiration

Dashboard redirect - Auto-redirect when logged in

Flash messages positioning - Fix z-index

Delete article - Fix authorization

Audit trail - Fix colors and data

Let me start fixing these issues:

LoginModal.jsx
+5
-4

Undo
RegisterModal.jsx
+5
-1

Undo

Undo all changes
Now let me fix the ArticleDetail component to properly handle likes and routing:

ArticleDetail.jsx
+19
-6

Undo
Now let me read and fix the ChangePassword component:

2 files read
ChangePassword.jsx
ProtectedRoute.jsx
Good! The ChangePassword already has loading indicator. Now let me fix the backend API to match the frontend expectations:

AuthController.php
+3
-2

Undo
Now let me read more files to fix the remaining issues:

3 files read
Footer.jsx
AuditTrail.jsx
LogController.php
Good! Now let me fix the Facebook link and audit trail colors:

Footer.jsx
+1
-1

Undo
AuditTrail.jsx
+1
-1

Undo

Undo all changes
Now let me fix the audit trail to show proper action names and fix the LogController:

LogController.php
+12
-2

Undo
Now let me check and fix the article routing to use slug properly. Let me read the App.jsx routing:

App.jsx
+1
-1

Undo
AmazonQUsageLimitError: Monthly limit reached.

Request ID: d455d022-ff1c-4bba-b556-6f833fa2785e


Monthly request limit reached
To increase your limit, subscribe to Q Developer Pro. During the upgrade, you'll be asked to link your Builder ID to the AWS account that will be billed the monthly subscription fee. Learn more about pricing >


Subscribe to Q Developer Pro

@Pin Context
Active file

Rules

Claude Sonnet 4.5

Claude Sonnet 4.5



      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </div>
  );
}
