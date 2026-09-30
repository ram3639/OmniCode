import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      handleGoogleCallback(token).then(() => {
        navigate('/dashboard');
      }).catch(() => {
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [location, navigate, handleGoogleCallback]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-secondary)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border-primary)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          margin: '0 auto 16px auto'
        }} className="animate-spin"></div>
        <p>Authenticating...</p>
      </div>
    </div>
  );
}
