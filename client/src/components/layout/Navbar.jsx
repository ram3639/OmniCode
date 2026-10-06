import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, LayoutDashboard, Code2, Network, Languages, TrendingUp, Pencil, Settings } from 'lucide-react';
import ShinyText from '../effects/ShinyText';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { to: '/challenges', label: 'Challenges', icon: <Code2 size={15} /> },
    { to: '/visualize', label: 'Visualize', icon: <Network size={15} /> },
    { to: '/playground', label: 'Playground', icon: <Pencil size={15} /> },
    { to: '/translate', label: 'Translate', icon: <Languages size={15} /> },
    { to: '/progress', label: 'Progress', icon: <TrendingUp size={15} /> },
  ];

  return (
    <nav style={{
      height: '64px',
      backgroundColor: 'transparent',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Brand */}
      <Link to="/dashboard" style={{
        fontSize: '18px',
        fontWeight: 700,
        textDecoration: 'none',
        letterSpacing: '1.5px',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <ShinyText text="OMNICODE" speed={5} />
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isActive ? '#000' : 'var(--text-secondary)',
                backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.03)',
                border: isActive ? '1px solid #fff' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '100px',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                }
              }}
            >
              {link.icon}
              {link.label}
            </NavLink>
          );
        })}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: location.pathname === '/admin' ? 600 : 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: location.pathname === '/admin' ? '#000' : 'var(--text-secondary)',
              backgroundColor: location.pathname === '/admin' ? '#fff' : 'rgba(255,255,255,0.02)',
              border: location.pathname === '/admin' ? '1px solid #fff' : '1px solid rgba(255,255,255,0.05)',
              borderRadius: '100px',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={e => {
              if (location.pathname !== '/admin') {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={e => {
              if (location.pathname !== '/admin') {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }
            }}
          >
            <Settings size={15} />
            Admin
          </NavLink>
        )}
      </div>

      {/* User */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
          }}
        >
          {getInitials(user?.username)}
        </button>

        {showDropdown && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 12px)',
            width: '220px',
            backgroundColor: '#121215',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            padding: '6px',
            zIndex: 100,
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '4px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{user?.username}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{user?.email}</p>
            </div>
            <Link to="/profile" style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', fontSize: '13px', color: 'var(--text-secondary)',
              textDecoration: 'none', borderRadius: '8px', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <User size={15} /> Profile
            </Link>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '10px 14px', fontSize: '13px', color: 'var(--text-secondary)',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(116, 17, 47, 0.15)'; e.currentTarget.style.color = '#c75050'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
