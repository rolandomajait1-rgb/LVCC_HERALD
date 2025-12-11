import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import ErrorBoundary from './components/ErrorBoundary';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AccountPage from './UserProfile/AccountPage';
import AdminDashboard from './pages/AdminDashboard';
import OpenAdminDashboard from './pages/OpenAdminDashboard';
import Statistics from './AdminDashboard/Statistics';
import CreateArticle from './AdminDashboard/CreateArticle';
import DraftArticles from './AdminDashboard/DraftArticles';
import ManageModerators from './AdminDashboard/ManageModerators';
import AuditTrail from './AdminDashboard/AuditTrail';
import ArticlePage from './AdminDashboard/ArticlePage';
import EditArticle from './AdminDashboard/EditArticle';

import ForgotPasswordPage from './authentication/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangePassword from './pages/ChangePassword';
import About from './pages/About';
import News from './categories/News';
import Literary from './categories/Literary';
import Opinion from './categories/Opinion';
import Art from './categories/Art';
import Features from './categories/Features';
import Sports from './categories/Sports';
import Specials from './categories/Specials';
import ContactUs from './categories/ContactUs';
import MembershipForm from './categories/MembershipForm';
import Search from './categories/Search';
import ArticleDetail from './pages/ArticleDetail';
import AuthorProfile from './pages/AuthorProfile';

import TagSearchResults from './pages/TagSearchResults';
import ProtectedRoute from './components/ProtectedRoute';

import Preloader from './components/Preloader';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = { duration: 0.5 };

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <HomePage />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/landing"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <LandingPage />
            </motion.div>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <HomePage />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AccountPage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminDashboard />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderator"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminDashboard />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/open-admin-dashboard"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <OpenAdminDashboard />
            </motion.div>
          }
        />
        <Route
          path="/admin/statistics"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Statistics />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-article"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <CreateArticle />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/draft-articles"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <DraftArticles />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-moderators"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ManageModerators />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-trail"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AuditTrail />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-article/:id"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <EditArticle />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderator/statistics"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Statistics />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderator/create-article"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <CreateArticle />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderator/draft-articles"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <DraftArticles />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderator/audit-trail"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AuditTrail />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderator/edit-article/:id"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <EditArticle />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <About />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ForgotPasswordPage />
            </motion.div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ResetPasswordPage />
            </motion.div>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ChangePassword />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/news"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <News />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/literary"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Literary />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/opinion"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Opinion />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/art"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Art />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/features"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Features />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/sports"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Sports />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/specials"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Specials />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ContactUs />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/membership-form"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <MembershipForm />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Search />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/:slug"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ArticleDetail />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tag/:tag"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <TagSearchResults />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/:authorName"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AuthorProfile />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-article/:id"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <EditArticle />
              </motion.div>
            </ProtectedRoute>
          }
        />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only clear sessionStorage, keep localStorage for "remember me"
      if (!localStorage.getItem('remember_me')) {
        sessionStorage.clear();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return loading ? (
    <Preloader />
  ) : (
    <ErrorBoundary>
      <GlobalErrorBoundary>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AnimatedRoutes />
        </Router>
      </GlobalErrorBoundary>
    </ErrorBoundary>
  );
}
