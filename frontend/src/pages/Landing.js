import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) { navigate('/dashboard'); return null; }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-dot" />
          CMS Portal
        </div>
        <div className="navbar-right">
          <button className="btn btn-sm" onClick={() => navigate('/signin')}>Sign In</button>
          <button className="btn btn-sm btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
        </div>
      </nav>

      <div className="page-center" style={{ flexDirection: 'column', gap: 0 }}>
        <div className="landing-hero fade-up">
          <div style={{ display: 'inline-block', background: '#dbeafe', color: '#1e40af',
            fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, marginBottom: 16 }}>
            AI-Powered Support System
          </div>
          <h1 className="landing-title">
            Submit, Track &amp;<br />Resolve Complaints
          </h1>
          <p className="landing-sub">
            Our intelligent complaint management system reviews your issue
            and delivers a personalised AI resolution within 3 minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>
              Create Free Account
            </button>
            <button className="btn" onClick={() => navigate('/signin')}>
              Sign In
            </button>
          </div>

          <div className="feature-grid" style={{ margin: '40px auto 0' }}>
            {[
              { icon: '🎫', title: 'Unique Ticket ID', desc: 'Every complaint gets a CMS-YYYY-XXXXX tracking number' },
              { icon: '🤖', title: 'AI Resolution', desc: 'Claude AI reviews and answers your complaint in 3 minutes' },
              { icon: '⭐', title: 'Feedback Loop', desc: 'Rate the resolution and help us improve continuously' },
            ].map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
