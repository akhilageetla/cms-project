import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { complaintAPI } from '../services/api';

const CATEGORIES = [
  'Technical / IT Support',
  'Academic Issues',
  'Infrastructure',
  'Hostel Complaints',
  'Library Issues',
  'Canteen Complaints',
  'Other',
];

export default function NewComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: '', subject: '', description: '', priority: 'Medium',
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.category || !form.subject || !form.description)
      return setError('Please fill in all required fields.');
    setLoading(true);
    try {
      const res = await complaintAPI.create(form);
      navigate(`/complaint/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="container fade-up" style={{ maxWidth: 680 }}>
        <button className="back-link" onClick={() => navigate('/dashboard')}>
          ← Back to dashboard
        </button>

        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Register New Complaint</h2>
          <p className="text-muted" style={{ marginBottom: 22 }}>
            Our AI will review your issue and provide a resolution within <strong>3 minutes</strong>.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" name="category" value={form.category} onChange={handle}>
                <option value="">Select a category…</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input className="form-input" name="subject" value={form.subject}
                onChange={handle} placeholder="Brief summary of your issue" />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" name="description" value={form.description}
                onChange={handle}
                placeholder="Describe your complaint in detail. The more information you provide, the better the AI can help you." />
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority" value={form.priority} onChange={handle}>
                {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? <><div className="spinner" />&nbsp;Submitting…</> : '🎫 Submit Complaint'}
              </button>
              <button className="btn" type="button" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
