import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Target, Zap, Trophy, Code2, ChevronRight, Activity } from 'lucide-react';

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

  const totalSolved = stats?.completedChallenges?.length || 0;
  const totalSubmissions = stats?.totalSubmissions || 0;
  const accuracy = totalSubmissions > 0 
    ? Math.round((totalSolved / totalSubmissions) * 100) 
    : 0;

  return (
    <div style={{ flex: 1, padding: '32px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          Welcome back, {user?.username}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
          Overview of your current progress
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'Problems Solved', value: totalSolved, icon: <Target size={20} /> },
          { label: 'Current Streak', value: `${stats?.streakDays || 0} days`, icon: <Zap size={20} /> },
          { label: 'Accuracy', value: `${accuracy}%`, icon: <Activity size={20} /> },
          { label: 'Total XP', value: stats?.totalXp || 0, icon: <Trophy size={20} /> }
        ].map((stat, i) => (
          <div key={i} style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '4px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</span>
              <span style={{ color: 'var(--text-primary)' }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {loading ? '—' : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '4px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code2 size={18} />
            Quick Navigation
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { to: '/challenges', title: 'Practice Challenges', desc: 'Solve coding problems to earn XP' },
              { to: '/visualize', title: 'AST Visualizer', desc: 'Understand how code is parsed' },
              { to: '/translate', title: 'Code Translator', desc: 'Convert code between languages' },
            ].map((item) => (
              <Link key={item.to} to={item.to} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-primary)'}
              >
                <div>
                  <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', margin: '0 0 4px 0' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>{item.desc}</p>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-primary)' }} />
              </Link>
            ))}
          </div>
        </div>

        {/* Topic Progress */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '4px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} />
            Topic Progress
          </h2>
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
              Loading progress...
            </div>
          ) : stats?.topicProgress && Object.keys(stats.topicProgress).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(stats.topicProgress).map(([topic, data]) => {
                const pct = data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0;
                return (
                  <div key={topic}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{topic}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{data.solved}/{data.total}</span>
                    </div>
                    <div style={{ height: '4px', width: '100%', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: 'var(--accent)',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0' }}>No progress yet</p>
              <p style={{ margin: 0 }}>Start solving challenges to track your progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
