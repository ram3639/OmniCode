import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DashboardPage from './pages/DashboardPage';
import ChallengeListPage from './pages/ChallengeListPage';
import ChallengeWorkspacePage from './pages/ChallengeWorkspacePage';
import TranslationPage from './pages/TranslationPage';
import VisualizePage from './pages/VisualizePage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PlaygroundPage from './pages/PlaygroundPage';
import Grainient from './components/effects/Grainient';

function App() {
  const { checkAuth, isAuthenticated, initialLoading } = useAuthStore();
  const { initTheme } = useThemeStore();
  
  useEffect(() => {
    initTheme();
    checkAuth();
  }, []);

  // Only block on INITIAL auth check, not on login/register
  if (initialLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--border-primary)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p>Loading OmniCode...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
        {isAuthenticated && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
            <Grainient
              color1="#000000"
              color2="#030305"
              color3="#0a0a0f"
              timeSpeed={0.3}
              grainAmount={0.015}
              contrast={1.0}
              zoom={1.2}
            />
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {isAuthenticated && <Navbar />}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/challenges" element={<ProtectedRoute><ChallengeListPage /></ProtectedRoute>} />
            <Route path="/challenge/:slug" element={<ProtectedRoute><ChallengeWorkspacePage /></ProtectedRoute>} />
            <Route path="/translate" element={<ProtectedRoute><TranslationPage /></ProtectedRoute>} />
            <Route path="/visualize" element={<ProtectedRoute><VisualizePage /></ProtectedRoute>} />
            <Route path="/playground" element={<ProtectedRoute><PlaygroundPage /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
