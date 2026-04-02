import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { complaintAPI } from '../services/api';

function StatusBadge({ status }) {
  if (status === 'PENDING')     return <span className="badge badge-pending">Pending AI Review</span>;
  if (status === 'AI_RESOLVED') return <span className="badge badge-resolved">AI Resolved</span>;
  if (status === 'CLOSED')      return <span className="badge badge-closed">Closed</span>;
  return null;
}

function PriorityChip({ priority }) {
  const colors = { Low: '#16a34a', Medium: '#d97706', High: '#dc2626', Critical: '#7c2d12' };
  return (
    <span style={{ fontSize: 12, fontWeight: 600, color: colors[priority] || '#64748b',
      background: '#f1f5f9', padding: '3px 10px', borderRadius: 20 }}>
      {priority} Priority
    </span>
  );
}

function Countdown({ createdAt }) {
  const calcRemaining = () => {
    const elapsed = (Date.now() - new Date(createdAt).getTime()) / 1000;
    return Math.max(0, 180 - Math.floor(elapsed));
  };

  const [secs, setSecs] = useState(calcRemaining);

  useEffect(() => {
    const t = setInterval(() => setSecs(calcRemaining()), 1000);
    return () => clearInterval(t);
  }, [createdAt]);

  const m = Math.floor(secs / 60);
  const s = String(secs % 60).padStart(2, '0');

  return (
    <div className="countdown-box">
      <div className="spinner" />
      <div>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>AI is reviewing your complaint…</div>
        <div style={{ fontSize: 13 }}>Response in: <span className="countdown-time">{m}:{s}</span></div>
      </div>
    </div>
  );
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className={`star ${n <= (hover || value) ? 'lit' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >★</span>
      ))}
    </div>
  );
}

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const [fbRating,  setFbRating]  = useState(0);
  const [fbComment, setFbComment] = useState('');
  const [fbLoading, setFbLoading] = useState(false);
  const [fbError,   setFbError]   = useState('');
  const [fbSuccess, setFbSuccess] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await complaintAPI.get(id);
      setComplaint(res.data);
    } catch {
      setError('Complaint not found.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Poll every 10s while still PENDING
  useEffect(() => {
    if (!complaint || complaint.status !== 'PENDING') return;
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [complaint, load]);

  const submitFeedback = async () => {
    if (!fbRating) return setFbError('Please select a star rating.');
    setFbError('');
    setFbLoading(true);
    try {
      const res = await complaintAPI.feedback(id, { rating: fbRating, comment: fbComment });
      setComplaint(res.data);
      setFbSuccess(true);
    } catch (err) {
      setFbError(err.response?.data?.error || 'Failed to submit feedback.');
    } finally {
      setFbLoading(false);
    }
  };

  if (loading) return (
    <div className="app-shell"><Navbar />
      <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
    </div>
  );

  if (error) return (
    <div className="app-shell"><Navbar />
      <div className="container"><div className="alert alert-error">{error}</div></div>
    </div>
  );

  const c = complaint;

  return (
    <div className="app-shell">
      <Navbar />
      <div className="container fade-up" style={{ maxWidth: 680 }}>
        <button className="back-link" onClick={() => navigate('/dashboard')}>
          ← Back to dashboard
        </button>

        <div className="card">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="ticket-id" style={{ fontSize: 12 }}>{c.ticketNumber}</span>
                <StatusBadge status={c.status} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{c.subject}</h2>
            </div>
            <PriorityChip priority={c.priority} />
          </div>

          {/* Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <div className="text-muted" style={{ marginBottom: 2 }}>Category</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{c.category}</div>
            </div>
            <div>
              <div className="text-muted" style={{ marginBottom: 2 }}>Submitted</div>
              <div style={{ fontSize: 14 }}>
                {new Date(c.createdAt).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Description */}
          <div className="text-muted" style={{ marginBottom: 6 }}>Description</div>
          <p style={{ fontSize: 14, lineHeight: 1.75 }}>{c.description}</p>

          {/* AI section */}
          {c.status === 'PENDING' && (
            <Countdown createdAt={c.createdAt} />
          )}

          {(c.status === 'AI_RESOLVED' || c.status === 'CLOSED') && c.aiResponse && (
            <div className="ai-box">
              <div className="ai-box-header">
                <span>🤖</span> AI Resolution
                {c.aiRespondedAt && (
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#a78bfa', fontWeight: 400 }}>
                    {new Date(c.aiRespondedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <div className="ai-box-body">{c.aiResponse}</div>
            </div>
          )}

          {/* Feedback */}
          {(c.status === 'AI_RESOLVED' || c.status === 'CLOSED') && (
            <>
              <hr className="divider" />
              {c.feedback || fbSuccess ? (
                <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  ✓ &nbsp;Thank you for your feedback! This ticket is now <strong>closed</strong>.
                  {c.feedback && (
                    <span style={{ marginLeft: 8 }}>
                      {'★'.repeat(c.feedback.rating)}{'☆'.repeat(5 - c.feedback.rating)}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Was this helpful?</h3>
                  <p className="text-muted" style={{ marginBottom: 4 }}>
                    Rate the AI resolution and help us improve.
                  </p>
                  <StarRating value={fbRating} onChange={setFbRating} />
                  <div className="form-group">
                    <label className="form-label">Additional comments (optional)</label>
                    <textarea className="form-textarea" value={fbComment}
                      onChange={e => setFbComment(e.target.value)}
                      placeholder="Tell us more about your experience…" style={{ minHeight: 70 }} />
                  </div>
                  {fbError && <div className="alert alert-error">{fbError}</div>}
                  <button className="btn btn-primary" onClick={submitFeedback} disabled={fbLoading}>
                    {fbLoading ? <><div className="spinner" />&nbsp;Submitting…</> : 'Submit Feedback'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
