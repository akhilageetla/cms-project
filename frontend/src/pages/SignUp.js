import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password)
      return setError('All fields are required.');
    if (form.password.length < 8)
      return setError('Password must be at least 8 characters.');
    setLoading(true);
    try {
      await authAPI.signup(form);
      navigate('/verify', { state: { email: form.email, name: form.name } });
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="navbar-brand"><div className="brand-dot" />CMS Portal</div>
      </nav>
      <div className="page-center">
        <div className="auth-card card fade-up">
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Join CMS Portal — free forever</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" name="name" value={form.name}
                onChange={handle} placeholder="Ravi Kumar" />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" name="email" type="email" value={form.email}
                onChange={handle} placeholder="ravi@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" name="password" type="password" value={form.password}
                onChange={handle} placeholder="Min. 8 characters" />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? <><div className="spinner" />&nbsp;Sending code…</> : 'Send Verification Code →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <a onClick={() => navigate('/signin')}>Sign in</a>
          </p>
          <p className="auth-switch" style={{ marginTop: 6 }}>
            <a onClick={() => navigate('/')} style={{ color: '#64748b' }}>← Back to home</a>
          </p>
        </div>
      </div>
    </div>
  );
}
