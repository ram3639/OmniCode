import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Sun, Moon, LogOut, User, Settings, LayoutDashboard, Code2, Network, Languages, TrendingUp, Pencil } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/challenges', label: 'Challenges', icon: <Code2 size={16} /> },
    { to: '/visualize', label: 'Visualize', icon: <Network size={16} /> },
    { to: '/playground', label: 'Playground', icon: <Pencil size={16} /> },
    { to: '/translate', label: 'Translate', icon: <Languages size={16} /> },
    { to: '/progress', label: 'Progress', icon: <TrendingUp size={16} /> },
  ];

  const linkStyle = {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.15s',
  };

  return (
    <nav style={{
      height: '48px',
      borderBottom: '1px solid var(--border-primary)',
      backgroundColor: 'var(--bg-primary)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <Link to="/dashboard" style={{
        fontSize: '16px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        textDecoration: 'none',
        letterSpacing: '1px',
      }}>
        OMNICODE
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              ...linkStyle,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              backgroundColor: 'transparent',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: 0,
              height: '48px',
              boxSizing: 'border-box'
            })}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              ...linkStyle,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              backgroundColor: 'transparent',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: 0,
              height: '48px',
              boxSizing: 'border-box'
            })}
          >
            <Settings size={16} />
            Admin
          </NavLink>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            {getInitials(user?.username)}
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '36px',
              width: '200px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '4px',
              zIndex: 100,
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)', marginBottom: '4px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{user?.username}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{user?.email}</p>
              </div>
              <Link
                to="/profile"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', fontSize: '12px', color: 'var(--text-primary)',
                  textDecoration: 'none', borderRadius: '2px',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <User size={14} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  width: '100%', padding: '8px 12px', fontSize: '12px', color: 'var(--text-primary)',
                  background: 'none', border: 'none', cursor: 'pointer', borderRadius: '2px', textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
