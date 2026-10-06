import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { 
  Users, Code2, Activity, Server, RefreshCw, Trash2, 
  Database, ShieldAlert, Terminal, Zap, Cpu, HardDrive, Target
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user: currentUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  const fetchData = async () => {
    try {
      const [statsRes, healthRes, usersRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: {} })),
        api.get('/admin/health').catch(() => ({ data: {} })),
        api.get('/admin/users').catch(() => ({ data: { users: [] } }))
      ]);
      setStats(statsRes.data);
      setHealth(healthRes.data);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      console.error('Admin fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await api.get('/admin/health');
      setHealth(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleReseed = async () => {
    if (!window.confirm('WARNING: Re-seed the database? This will reset all challenges to defaults.')) return;
    setActionLoading('reseed');
    try {
      const res = await api.post('/admin/reseed');
      setActionMessage({ type: 'success', text: res.data.message });
      fetchData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.error || 'Reseed failed' });
    } finally {
      setActionLoading('');
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const handleClearSubmissions = async () => {
    if (!window.confirm('CRITICAL WARNING: Clear ALL submissions? This cannot be undone.')) return;
    setActionLoading('clear');
    try {
      const res = await api.delete('/admin/submissions');
      setActionMessage({ type: 'success', text: res.data.message });
      fetchData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.error || 'Clear failed' });
    } finally {
      setActionLoading('');
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`);
      setActionMessage({ type: 'success', text: res.data.message || 'Role updated' });
      fetchData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.error || 'Toggle role error' });
    } finally {
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      setActionMessage({ type: 'success', text: res.data.message || 'User deleted' });
      fetchData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.error || 'Failed to delete user' });
    } finally {
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  if (loading) {
    return <div style={{ height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Initializing Command Center...</div>;
  }

  // Helper Components
  const StatusDot = ({ status }) => {
    const color = status === 'healthy' ? '#10b981' : status === 'unhealthy' ? '#ef4444' : '#f59e0b';
    return (
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
    );
  };

  const HealthRow = ({ label, data, icon: Icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon size={16} color="var(--text-muted)" />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {data?.latency > 0 && <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{data.latency}ms</span>}
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: data?.status === 'healthy' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
          {data?.status || 'OFFLINE'}
        </span>
        <StatusDot status={data?.status} />
      </div>
    </div>
  );

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: `rgba(${color}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${color}, 0.2)` }}>
        <Icon size={28} style={{ color: `rgb(${color})` }} />
      </div>
      <div>
        <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-1px' }}>{value}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div style={{ height: 'calc(100vh - 64px)', overflow: 'hidden', padding: '24px 32px', display: 'flex', gap: '24px', backgroundColor: 'transparent' }}>
      
      {/* Left Column: Command & Control */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '24px', flexShrink: 0 }}>
        
        {/* System Health Panel */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> System Nodes
            </h2>
            <button onClick={fetchHealth} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
              <RefreshCw size={12} /> Ping
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <HealthRow label="Core API" data={health?.backend} icon={Server} />
            <HealthRow label="Database Cluster" data={health?.database} icon={Database} />
            <HealthRow label="Execution Engine" data={health?.judge0} icon={Terminal} />
            <HealthRow label="AI Subsystem" data={health?.ollama} icon={Cpu} />
          </div>
          {health?.ollama?.models && (
             <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
               <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', fontWeight: 600 }}>Active AI Models</div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                 {health.ollama.models.map(m => (
                   <span key={m} style={{ padding: '4px 10px', backgroundColor: 'rgba(196,149,106,0.1)', color: 'var(--accent)', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', border: '1px solid rgba(196,149,106,0.2)' }}>{m}</span>
                 ))}
               </div>
             </div>
          )}
        </div>

        {/* Danger Zone Actions */}
        <div style={{ backgroundColor: '#161111', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} /> Danger Zone
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={handleReseed} disabled={actionLoading === 'reseed'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><HardDrive size={16} /> {actionLoading === 'reseed' ? 'Re-seeding...' : 'Factory Reset Challenges'}</div>
            </button>
            <button onClick={handleClearSubmissions} disabled={actionLoading === 'clear'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Trash2 size={16} /> {actionLoading === 'clear' ? 'Purging...' : 'Purge All Submissions'}</div>
            </button>
          </div>
          
          {actionMessage && (
            <div style={{ marginTop: '16px', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, backgroundColor: actionMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: actionMessage.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${actionMessage.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
              {actionMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Stats & Users */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
        
        {/* Top Stats Row */}
        <div style={{ display: 'flex', gap: '24px', height: '110px', flexShrink: 0 }}>
          <StatCard label="Registered Users" value={stats?.totalUsers || 0} icon={Users} color="59, 130, 246" />
          <StatCard label="Active Users (7d)" value={stats?.activeUsersThisWeek || 0} icon={Activity} color="16, 185, 129" />
          <StatCard label="Active Challenges" value={stats?.totalChallenges || 0} icon={Code2} color="196, 149, 106" />
          <StatCard label="Submissions (24h)" value={stats?.submissionsToday || 0} icon={Zap} color="168, 85, 247" />
        </div>

        {/* Users Database Pane */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              <Users size={16} /> User Registry
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Showing {users.length} records
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 1 }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0 12px 16px 12px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, borderBottom: '1px solid var(--border-primary)' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '0 12px 16px 12px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, borderBottom: '1px solid var(--border-primary)' }}>Contact</th>
                  <th style={{ textAlign: 'left', padding: '0 12px 16px 12px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, borderBottom: '1px solid var(--border-primary)' }}>Auth</th>
                  <th style={{ textAlign: 'left', padding: '0 12px 16px 12px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, borderBottom: '1px solid var(--border-primary)' }}>Clearance</th>
                  <th style={{ textAlign: 'right', padding: '0 12px 16px 12px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, borderBottom: '1px solid var(--border-primary)' }}>Access Control</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const isAdmin = user.role === 'admin';
                  const isSelf = currentUser?._id === user._id;
                  return (
                    <tr key={user._id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '16px 12px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px' }}>{user.username} {isSelf && <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 400 }}>(You)</span>}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '13px' }}>{user.email}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border-primary)' }}>
                          {user.provider || 'Local'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: isAdmin ? 'rgba(196,149,106,0.1)' : 'rgba(255,255,255,0.03)', color: isAdmin ? 'var(--accent)' : 'var(--text-muted)', border: `1px solid ${isAdmin ? 'rgba(196,149,106,0.2)' : 'transparent'}` }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => handleToggleRole(user._id)} disabled={isSelf} title={isSelf ? "Cannot modify your own role" : ""}
                            style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 600, backgroundColor: isAdmin ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${isAdmin ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`, borderRadius: '6px', color: isAdmin ? '#ef4444' : '#10b981', cursor: isSelf ? 'not-allowed' : 'pointer', opacity: isSelf ? 0.3 : 1, transition: 'all 0.2s' }}>
                            {isAdmin ? 'Revoke Admin' : 'Grant Admin'}
                          </button>
                          <button onClick={() => handleDeleteUser(user._id)} disabled={isSelf || isAdmin} title={isSelf ? "Cannot delete yourself" : isAdmin ? "Revoke admin access first" : "Delete user"}
                            style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 600, backgroundColor: 'var(--bg-primary)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#ef4444', cursor: (isSelf || isAdmin) ? 'not-allowed' : 'pointer', opacity: (isSelf || isAdmin) ? 0.3 : 1, transition: 'all 0.2s' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
