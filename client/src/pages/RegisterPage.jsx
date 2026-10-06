import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Particles from '../components/effects/Particles';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Interactive Particles Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Particles
          particleColors={['#ffffff', '#cdcecf']}
          particleCount={250}
          particleSpread={12}
          speed={0.15}
          particleBaseSize={200}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
        />
      </div>

      <div style={{
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1,
        animation: shakeError ? 'shake 0.4s ease' : 'none',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', flexShrink: 0 }}>
          <h1 style={{
            fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)',
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px', marginBottom: '4px',
          }}>
            Create an account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Join OmniCode and start coding</p>
        </div>

        {error && (
          <div style={{
            marginBottom: '16px', padding: '12px 16px', borderRadius: '10px',
            backgroundColor: 'rgba(116, 17, 47, 0.12)', color: '#c75050', fontSize: '14px',
            flexShrink: 0
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              style={{
                width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)', borderRadius: '10px',
                color: 'var(--text-primary)', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--text-muted)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-primary)'}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)', borderRadius: '10px',
                color: 'var(--text-primary)', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--text-muted)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-primary)'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} required value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
                style={{
                  width: '100%', padding: '12px 48px 12px 16px', backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)', borderRadius: '10px',
                  color: 'var(--text-primary)', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--text-muted)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-primary)'}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px',
              }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '100px', border: 'none',
            backgroundColor: '#fff', color: '#18151c', fontWeight: 600, fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => e.currentTarget.style.opacity = loading ? '0.7' : '1'}
          >
            {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : 'Sign up'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', flexShrink: 0 }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-primary)' }} />
          <span style={{ padding: '0 16px', color: 'var(--text-muted)', fontSize: '12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-primary)' }} />
        </div>

        <button onClick={handleGoogleLogin} style={{
          width: '100%', padding: '12px', borderRadius: '100px',
          border: '1px solid var(--border-primary)', backgroundColor: 'transparent',
          color: 'var(--text-primary)', fontWeight: 500, fontSize: '15px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          transition: 'background-color 0.2s', flexShrink: 0
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', flexShrink: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
