import React, { useRef, useEffect, useMemo, useCallback } from 'react';

/**
 * PixelSnow — Animated pixel-style falling particles.
 * Pure canvas implementation, no dependencies.
 * Respects prefers-reduced-motion and pauses when tab is hidden.
 */
export default function PixelSnow({
  density = 60,
  speed = 0.5,
  pixelSize = 3,
  colors = ['#1f7fbf', '#a5a9b3', '#f5f5e9'],
  wind = 0.3,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const isVisibleRef = useRef(true);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  }, []);

  const initParticles = useCallback((width, height) => {
    const particles = [];
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: pixelSize + Math.random() * 2,
        speed: speed * (0.5 + Math.random() * 1),
        drift: (Math.random() - 0.5) * wind,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.2 + Math.random() * 0.5,
      });
    }
    return particles;
  }, [density, speed, pixelSize, colors, wind]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      particlesRef.current = initParticles(canvas.offsetWidth, canvas.offsetHeight);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const animate = () => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        p.y += p.speed;
        p.x += p.drift;

        if (p.y > h) {
          p.y = -p.size;
          p.x = Math.random() * w;
        }
        if (p.x > w) p.x = 0;
        if (p.x < 0) p.x = w;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(
          Math.round(p.x),
          Math.round(p.y),
          Math.round(p.size),
          Math.round(p.size)
        );
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [reducedMotion, initParticles]);

  if (reducedMotion) {
    return (
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(31,127,191,0.08) 0%, transparent 70%)',
      }} />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
