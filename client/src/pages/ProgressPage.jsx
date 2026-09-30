import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trophy, Zap, Target, BookOpen, Clock, Activity, Check } from 'lucide-react';

export default function ProgressPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress/me');
        setStats(res.data.progress);
      } catch (err) {
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading progress...</div>;
  if (error) return <div style={{ padding: '32px', textAlign: 'center', color: '#ff6b6b' }}>{error}</div>;
  if (!stats) return null;

  const totalSolved = stats.completedChallenges?.length || 0;
  const accuracy = stats.totalSubmissions > 0 
    ? Math.round((totalSolved / stats.totalSubmissions) * 100) 
    : 0;

  return (
    <div style={{ flex: 1, padding: '32px', maxWidth: '1024px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.3s ease' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '32px' }}>Learning Progress</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Trophy style={{ color: 'var(--accent)', marginBottom: '12px' }} size={32} />
          <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>{stats.totalXp || 0}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Total XP Earned</div>
        </div>
        
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Zap style={{ color: 'var(--accent)', marginBottom: '12px' }} size={32} />
          <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>{stats.streakDays || 0}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Day Streak</div>
        </div>
        
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Target style={{ color: 'var(--accent)', marginBottom: '12px' }} size={32} />
          <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>{totalSolved}</div>
          <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Challenges Solved</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} />
            Submission Stats
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Accuracy Rate</span>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{accuracy}%</span>
              </div>
              <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-primary)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: 'var(--accent)', borderRadius: '999px', width: `${accuracy}%` }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-primary)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Submissions</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.totalSubmissions || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-primary)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Successful Submissions</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalSolved}</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} />
            Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.completedChallenges?.slice(0, 5).map((ch, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Challenge ID: {ch.challengeId}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Clock size={12} />
                    {new Date(ch.completedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {(!stats.completedChallenges || stats.completedChallenges.length === 0) && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px 0' }}>
                No recent activity. Start solving challenges!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
