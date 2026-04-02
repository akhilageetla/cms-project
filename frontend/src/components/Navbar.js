import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/dashboard">
        <div className="brand-dot" />
        CMS Portal
      </a>
      {user && (
        <div className="navbar-right">
          <div className="avatar" title={user.name}>{initials(user.name)}</div>
          <span style={{ fontSize: 13, color: '#475569' }}>{user.name}</span>
          <button className="btn btn-sm" onClick={handleLogout}>Sign Out</button>
        </div>
      )}
    </nav>
  );
}
