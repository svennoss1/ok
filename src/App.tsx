import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import BalancePage from './pages/BalancePage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';
import WelcomePage from './pages/WelcomePage';
import AgeVerificationModal from './components/modals/AgeVerificationModal';

function App() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Check if the user has already verified their age
    const hasVerifiedAge = localStorage.getItem('age-verified');
    
    if (!hasVerifiedAge) {
      setShowAgeVerification(true);
    }
  }, []);

  // Show loading spinner only during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/') {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and trying to access auth pages, redirect to chat
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/')) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <>
      {showAgeVerification && (
        <AgeVerificationModal 
          onVerify={() => {
            localStorage.setItem('age-verified', 'true');
            setShowAgeVerification(false);
          }}
        />
      )}
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="/chat/*" element={<ChatPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/abonnementen" element={<SubscriptionsPage />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        
        {/* Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;