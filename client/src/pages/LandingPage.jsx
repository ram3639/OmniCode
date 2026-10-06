import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LightRays from '../components/effects/LightRays';
import StrokeText from '../components/effects/StrokeText';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#0a0a0c',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* REAL ReactBits LightRays with mouse tracking */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <LightRays
          raysColor="#cdcecf"
          raysOrigin="top-center"
          raysSpeed={0.6}
          lightSpread={1.2}
          rayLength={2.5}
          followMouse={true}
          mouseInfluence={0.15}
          fadeDistance={0.9}
          saturation={0.3}
        />
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(to top, #0a0a0c 0%, transparent 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        maxWidth: '800px',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <StrokeText
            text="OMNICODE"
            fontSize={72}
            strokeWidth={1.5}
            strokeColor="#84848c"
            fillColor="#ffffff"
            drawDuration={1.2}
            fillDelay={0.2}
            letterSpacing={4}
            fontWeight={700}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          />
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 64px)',
          fontWeight: 600,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}>
          Master the art of code
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: '48px',
          maxWidth: '480px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Practice challenges, visualize algorithms, and translate code across languages.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/register" style={{
            padding: '14px 32px',
            borderRadius: '100px',
            backgroundColor: '#fff',
            color: '#0a0a0c',
            fontWeight: 600,
            fontSize: '15px',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Get started
          </Link>
          <Link to="/login" style={{
            padding: '14px 32px',
            borderRadius: '100px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            fontSize: '15px',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
