import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChallengeStore } from '../store/challengeStore';
import { Search } from 'lucide-react';

export default function ChallengeListPage() {
  const { challenges, fetchChallenges, filters, setFilter, loading, error } = useChallengeStore();

  useEffect(() => {
    fetchChallenges(filters);
  }, [filters]);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const categories = ['All', 'Arrays', 'Strings', 'Math', 'Dynamic Programming', 'Trees', 'Graphs'];

  const getDifficultyColor = (diff) => {
    switch(diff?.toLowerCase()) {
      case 'easy': return '#22c55e';
      case 'medium': return '#eab308';
      case 'hard': return '#ef4444';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{ flex: 1, padding: '32px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Practice Challenges</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Master algorithms and data structures.</p>
      </div>

      <div style={{ 
        backgroundColor: 'var(--bg-primary)', 
        border: '1px solid var(--border-primary)', 
        borderRadius: '4px', 
        marginBottom: '24px', 
        padding: '16px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search challenges..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '2px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <select
          value={filters.difficulty}
          onChange={(e) => setFilter('difficulty', e.target.value)}
          style={{
            padding: '8px 12px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '2px',
            color: 'var(--text-primary)',
            fontSize: '13px',
            minWidth: '120px'
          }}
        >
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          style={{
            padding: '8px 12px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '2px',
            color: 'var(--text-primary)',
            fontSize: '13px',
            minWidth: '150px'
          }}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ 
        backgroundColor: 'var(--bg-primary)', 
        border: '1px solid var(--border-primary)', 
        borderRadius: '4px', 
        overflow: 'hidden' 
      }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>Loading challenges...</div>
        ) : error ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#ef4444', fontSize: '14px' }}>{error}</div>
        ) : challenges.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>No challenges found matching your criteria.</div>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', width: '48px' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Difficulty</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ width: '16px', height: '16px', border: '1px solid var(--border-primary)', borderRadius: '2px' }}></div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link to={`/challenge/${c.slug}`} style={{ fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px' }}>
                      {c.title}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {c.category}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      color: getDifficultyColor(c.difficulty), 
                      fontSize: '12px', 
                      fontWeight: 600 
                    }}>
                      {c.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {c.submissions > 0 ? Math.round((c.successfulSubmissions / c.submissions) * 100) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
