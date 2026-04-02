import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OtpVerify() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();
  const email = location.state?.email || '';
  const name  = location.state?.name  || '';

  const [digits, setDigits]   = useState(Array(6).fill(''));
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  const handleChange = (i, val) => {
    val = val.replace(/\D/, '');
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0)
      refs.current[i - 1]?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return setError('Enter all 6 digits.');
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.verifyOtp({ email, code });
      login(res.data.token, { name: res.data.name, email: res.data.email });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired code.');
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
          <h2 className="auth-title">Verify your email</h2>
          <p className="auth-subtitle">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="otp-row">
              {digits.map((d, i) => (
                <input
                  key={i}
                  className="otp-box"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  ref={el => refs.current[i] = el}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                />
              ))}
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? <><div className="spinner" />&nbsp;Verifying…</> : 'Verify & Continue →'}
            </button>
          </form>

          <p className="auth-switch" style={{ marginTop: 16 }}>
            <a onClick={() => navigate('/signup')} style={{ color: '#64748b' }}>← Back to sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
