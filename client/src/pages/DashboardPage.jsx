import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Target, Zap, Trophy, Code2, ChevronRight, Activity, Network, Languages, Pencil } from 'lucide-react';

function useCountUp(end, duration = 1200, startWhen = true) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!startWhen || startedRef.current || typeof end !== 'number') return;
    startedRef.current = true;
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, startWhen]);
  return value;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress/me');
        setStats(res.data.progress);
      } catch (err) {
        console.error('Failed to load progress', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const totalSolved = stats?.totalSolved || 0;
  const totalSubmissions = stats?.totalAttempted || 0;
  const accuracy = totalSubmissions > 0 ? Math.round((totalSolved / totalSubmissions) * 100) : 0;

  const animSolved = useCountUp(totalSolved, 1200, !loading);
  const animStreak = useCountUp(stats?.currentStreak || 0, 1200, !loading);
  const animAccuracy = useCountUp(accuracy, 1200, !loading);
  const animXp = useCountUp(totalSolved * 50, 1500, !loading); // 50 XP per solved problem

  const statCards = [
    { label: 'Problems Solved', value: animSolved, icon: <Target size={20} /> },
    { label: 'Current Streak', value: `${animStreak} days`, icon: <Zap size={20} /> },
    { label: 'Accuracy', value: `${animAccuracy}%`, icon: <Activity size={20} /> },
    { label: 'Total XP', value: animXp, icon: <Trophy size={20} /> },
  ];

  const navItems = [
    { to: '/challenges', title: 'Practice Challenges', desc: 'Solve coding problems to earn XP', icon: <Code2 size={20} /> },
    { to: '/visualize', title: 'Algorithm Visualizer', desc: '15+ interactive visualizers', icon: <Network size={20} /> },
    { to: '/translate', title: 'Code Translator', desc: 'Convert code between languages', icon: <Languages size={20} /> },
    { to: '/playground', title: 'Code Playground', desc: 'Write and test in multiple languages', icon: <Pencil size={20} /> },
  ];

  return (
    <div style={{ height: 'calc(100vh - 64px)', backgroundColor: 'transparent', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', height: '100%', padding: '24px 40px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header (fixed height) */}
        <div style={{ marginBottom: '24px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px' }}>
            Welcome back, {user?.username}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>
            Here's your coding journey so far
          </p>
        </div>

        {/* Stats (fixed height) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px', flexShrink: 0 }}>
          {statCards.map((stat, i) => (
            <div key={i} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', padding: '16px 20px', transition: 'background-color 0.2s', border: '1px solid rgba(255,255,255,0.02)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', fontFamily: "'Space Grotesk', sans-serif" }}>
                {loading ? '—' : stat.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Split Content (takes remaining height and enforces scrolling inside) */}
        <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 0 }}>
          
          {/* Left: Quick Navigation */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
              Quick Navigation
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '8px' }}>
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.02)', textDecoration: 'none', transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  const a = e.currentTarget.querySelector('[data-arrow]');
                  if (a) a.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.02)';
                  const a = e.currentTarget.querySelector('[data-arrow]');
                  if (a) a.style.transform = 'translateX(0)';
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '14px', marginBottom: '2px' }}>{item.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight data-arrow size={16} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Topic Progress */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
              Topic Progress
            </h2>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.02)', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>Loading...</div>
              ) : stats?.topicStats && stats.topicStats.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {stats.topicStats.map((data) => {
                    const pct = data.attempted > 0 ? Math.round((data.solved / data.attempted) * 100) : 0;
                    return (
                      <div key={data.topic}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>{data.topic}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>{data.solved}/{data.attempted}</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#84848c', borderRadius: '3px', transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>No progress yet</p>
                  <Link to="/challenges" style={{ padding: '10px 24px', borderRadius: '100px', backgroundColor: '#fff', color: '#18151c', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Start Coding</Link>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
