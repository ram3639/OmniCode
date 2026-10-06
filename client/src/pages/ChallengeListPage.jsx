import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChallengeStore } from '../store/challengeStore';
import { Search, Check, Circle } from 'lucide-react';

export default function ChallengeListPage() {
  const { challenges, fetchChallenges, filters, setFilter, loading, error } = useChallengeStore();

  useEffect(() => {
    fetchChallenges(filters);
  }, [filters]);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const categories = ['All', 'Array', 'String', 'Stack', 'Queue', 'Mixed'];

  const getDifficultyStyle = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return { color: '#5fb3a1' };
      case 'medium': return { color: '#d6a35c' };
      case 'hard': return { color: '#c75050' };
      default: return { color: 'var(--text-muted)' };
    }
  };

  const selectStyle = {
    padding: '12px 36px 12px 16px', 
    backgroundColor: 'var(--bg-secondary)', 
    border: '1px solid var(--border-primary)',
    borderRadius: '10px', 
    color: 'var(--text-primary)', 
    fontSize: '14px', 
    outline: 'none', 
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23cdcecf' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  return (
    <div style={{ flex: 1, padding: '40px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0',
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px',
        }}>Challenges</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>Master algorithms and data structures</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search challenges..." value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 44px',
              backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '10px',
              color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
            }}
          />
        </div>
        <select value={filters.difficulty} onChange={(e) => setFilter('difficulty', e.target.value)}
          style={selectStyle}>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)}
          style={selectStyle}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px' }}>Loading challenges...</div>
        ) : error ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#c75050', fontSize: '15px' }}>{error}</div>
        ) : challenges.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px' }}>No challenges found.</div>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <th style={{ padding: '14px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: '13px', width: '48px' }}></th>
                <th style={{ padding: '14px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: '13px' }}>Title</th>
                <th style={{ padding: '14px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: '13px' }}>Category</th>
                <th style={{ padding: '14px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: '13px' }}>Difficulty</th>
                <th style={{ padding: '14px 20px', fontWeight: 500, color: 'var(--text-muted)', fontSize: '13px', textAlign: 'right' }}>Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((c) => {
                const diffStyle = getDifficultyStyle(c.difficulty);
                return (
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(42,39,48,0.5)', transition: 'background-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      {c.solved ? <Check size={16} style={{ color: '#5fb3a1' }} /> : <Circle size={16} style={{ color: 'var(--border-secondary)' }} />}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <Link to={`/challenge/${c.slug}`} style={{
                        fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none', fontSize: '15px',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      >{c.title}</Link>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{c.category}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ color: diffStyle.color, fontSize: '14px', fontWeight: 500 }}>{c.difficulty}</span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '14px', fontFamily: "'JetBrains Mono', monospace" }}>
                      {c.submissions > 0 ? Math.round((c.successfulSubmissions / c.submissions) * 100) : 0}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
