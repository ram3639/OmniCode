import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Code2, Activity, Server, RefreshCw, Trash2, Database, Shield, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await api.get('/admin/health');
      setHealth(res.data);
    } catch (err) {
      console.error('Health error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Users error:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleReseed = async () => {
    if (!confirm('Re-seed the database? This will reset all challenges.')) return;
    setActionLoading('reseed');
    try {
      const res = await api.post('/admin/reseed');
      setActionMessage({ type: 'success', text: res.data.message });
      fetchStats();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.error || 'Reseed failed' });
    } finally {
      setActionLoading('');
    }
  };

  const handleClearSubmissions = async () => {
    if (!confirm('Clear ALL submissions? This cannot be undone.')) return;
    setActionLoading('clear');
    try {
      const res = await api.delete('/admin/submissions');
      setActionMessage({ type: 'success', text: res.data.message });
      fetchStats();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.error || 'Clear failed' });
    } finally {
      setActionLoading('');
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/role`);
      fetchUsers();
    } catch (err) {
      console.error('Toggle role error:', err);
    }
  };

  const handleManageUsers = () => {
    if (!showUsers) fetchUsers();
    setShowUsers(!showUsers);
  };

  const StatusDot = ({ status }) => {
    const color = status === 'healthy' ? '#4CAF50' : status === 'unhealthy' ? '#f44336' : '#FFEB3B';
    return (
      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
    );
  };

  const HealthRow = ({ label, data }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '6px' }}>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '13px' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {data?.latency > 0 && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{data.latency}ms</span>}
        <span style={{ fontSize: '12px', color: data?.status === 'healthy' ? '#4CAF50' : '#f44336', fontWeight: 500 }}>
          {data?.status || 'checking...'}
        </span>
        <StatusDot status={data?.status} />
      </div>
    </div>
  );

  const StatCard = ({ label, value, icon: Icon }) => (
    <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px' }}>{label}</span>
        <Icon style={{ color: 'var(--text-muted)' }} size={20} />
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );

  const ActionButton = ({ label, onClick, icon: Icon, loadingKey, variant = 'default' }) => {
    const isLoading = actionLoading === loadingKey;
    const bgColor = variant === 'danger' ? 'rgba(244,67,54,0.1)' : 'var(--bg-primary)';
    const borderColor = variant === 'danger' ? 'rgba(244,67,54,0.3)' : 'var(--border-primary)';
    const textColor = variant === 'danger' ? '#f44336' : 'var(--text-primary)';
    return (
      <button onClick={onClick} disabled={isLoading}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '6px', color: textColor, cursor: isLoading ? 'wait' : 'pointer', fontWeight: 500, fontSize: '13px', opacity: isLoading ? 0.6 : 1 }}>
        <Icon size={14} />
        {isLoading ? 'Processing...' : label}
      </button>
    );
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>Admin Dashboard</h1>

      {/* Stats Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px' }}>Loading analytics...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <StatCard label="Total Users" value={stats?.totalUsers || 0} icon={Users} />
          <StatCard label="Challenges" value={stats?.totalChallenges || 0} icon={Code2} />
          <StatCard label="Submissions Today" value={stats?.submissionsToday || 0} icon={Activity} />
          <StatCard label="Total Submissions" value={stats?.totalSubmissions || 0} icon={Server} />
          <StatCard label="Acceptance Rate" value={`${stats?.acceptanceRate || 0}%`} icon={Activity} />
          <StatCard label="Active This Week" value={stats?.activeUsersThisWeek || 0} icon={Users} />
        </div>
      )}

      {/* Action Message */}
      {actionMessage && (
        <div style={{ padding: '10px 16px', marginBottom: '16px', borderRadius: '6px', fontSize: '13px', backgroundColor: actionMessage.type === 'success' ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)', color: actionMessage.type === 'success' ? '#4CAF50' : '#f44336', border: `1px solid ${actionMessage.type === 'success' ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* System Health */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>System Health</h2>
            <button onClick={fetchHealth} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <HealthRow label="Backend API" data={health?.backend} />
            <HealthRow label="MongoDB" data={health?.database} />
            <HealthRow label="Judge0 (Docker)" data={health?.judge0} />
            <HealthRow label="Microservice" data={health?.microservice} />
            <HealthRow label="Ollama (AI)" data={health?.ollama} />
            {health?.ollama?.models && (
              <div style={{ padding: '6px 14px', fontSize: '11px', color: 'var(--text-muted)' }}>
                Models: {health.ollama.models.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* System Actions */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>System Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <ActionButton label="Re-seed Challenges" onClick={handleReseed} icon={Database} loadingKey="reseed" />
            <ActionButton label="Clear All Submissions" onClick={handleClearSubmissions} icon={Trash2} loadingKey="clear" variant="danger" />
            <ActionButton label={showUsers ? 'Hide Users' : 'Manage Users'} onClick={handleManageUsers} icon={Shield} loadingKey="" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {showUsers && (
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Users ({users.length})</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Username</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Provider</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{user.username}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: user.role === 'admin' ? 'rgba(196,149,106,0.15)' : 'rgba(255,255,255,0.05)', color: user.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '12px' }}>{user.provider || 'local'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <button onClick={() => handleToggleRole(user._id)}
                        style={{ padding: '4px 10px', fontSize: '11px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
