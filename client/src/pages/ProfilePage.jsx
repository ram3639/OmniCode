import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { 
  Lock, Mail, Calendar, Eye, EyeOff, 
  Shield, Key, Fingerprint
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    setMsg(null);
    
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setMsg('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMsg(null), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, type, value, onChange, showPassword, setShowPassword, icon: Icon }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <Icon size={16} />
        </div>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          required
          value={value}
          onChange={onChange}
          style={{ 
            width: '100%', padding: '10px 40px 10px 42px', backgroundColor: 'var(--bg-primary)', 
            border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', 
            boxSizing: 'border-box', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s' 
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-primary)'}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ height: 'calc(100vh - 64px)', overflowY: 'auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', backgroundColor: 'transparent' }}>
      
      {/* Top Block: Identity Badge */}
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--accent) 0%, #121115 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(196,149,106,0.15)', transform: 'rotate(-5deg)', border: '1px solid rgba(196,149,106,0.3)' }}>
            <div style={{ transform: 'rotate(5deg)', fontSize: '36px', fontWeight: 800, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {getInitials(user?.username)}
            </div>
          </div>
          {user?.role === 'admin' && (
            <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', backgroundColor: '#ef4444', color: '#fff', padding: '4px', borderRadius: '50%', boxShadow: '0 0 12px rgba(239,68,68,0.5)' }}>
              <Shield size={16} />
            </div>
          )}
        </div>
        
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.5px', textAlign: 'center' }}>{user?.username}</h2>
        <div style={{ padding: '4px 12px', backgroundColor: 'rgba(196,149,106,0.1)', color: 'var(--accent)', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(196,149,106,0.2)', marginBottom: '32px' }}>
          {user?.role === 'admin' ? 'Administrator' : 'Student'}
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid var(--border-primary)', paddingTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)' }}>
              <Mail size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--text-muted)' }}>Email Address</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{user?.email}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)' }}>
              <Calendar size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--text-muted)' }}>Member Since</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{new Date(user?.createdAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)' }}>
              <Fingerprint size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: 'var(--text-muted)' }}>Account Type</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{user?.provider || 'Local Account'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Block: Account Security */}
      {!user?.googleId ? (
        <div style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Lock size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Account Security
            </h3>
          </div>
          
          {msg && (
            <div style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} /> {msg}
            </div>
          )}
          {error && (
            <div style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <InputField label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} showPassword={showCurrent} setShowPassword={setShowCurrent} icon={Key} />
            <InputField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} showPassword={showNew} setShowPassword={setShowNew} icon={Lock} />
            <InputField label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} showPassword={showConfirm} setShowPassword={setShowConfirm} icon={Lock} />

            <div style={{ paddingTop: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', backgroundColor: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(196,149,106,0.2)' }}
              >
                <Shield size={16} />
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>
           <Shield size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
           <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Managed by Google</h3>
           <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px' }}>Your account security and password are managed through your Google Account.</p>
        </div>
      )}

    </div>
  );
}
