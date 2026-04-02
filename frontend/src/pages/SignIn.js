import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields.');
    setLoading(true);
    try {
      const res = await authAPI.signin(form);
      login(res.data.token, { name: res.data.name, email: res.data.email });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
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
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" name="email" type="email"
                value={form.email} onChange={handle} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" name="password" type="password"
                value={form.password} onChange={handle} placeholder="••••••••" />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? <><div className="spinner" />&nbsp;Signing in…</> : 'Sign In →'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <a onClick={() => navigate('/signup')}>Sign up</a>
          </p>
          <p className="auth-switch" style={{ marginTop: 6 }}>
            <a onClick={() => navigate('/')} style={{ color: '#64748b' }}>← Back to home</a>
          </p>
        </div>
      </div>
    </div>
  );
}
