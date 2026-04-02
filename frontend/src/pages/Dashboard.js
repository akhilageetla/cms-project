import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function statusBadge(status) {
  if (status === 'PENDING')     return <span className="badge badge-pending">Pending</span>;
  if (status === 'AI_RESOLVED') return <span className="badge badge-resolved">AI Resolved</span>;
  if (status === 'CLOSED')      return <span className="badge badge-closed">Closed</span>;
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  const load = async () => {
    try {
      const res = await complaintAPI.list();
      setComplaints(res.data);
    } catch {
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const total    = complaints.length;
  const pending  = complaints.filter(c => c.status === 'PENDING').length;
  const resolved = complaints.filter(c => c.status === 'AI_RESOLVED').length;
  const closed   = complaints.filter(c => c.status === 'CLOSED').length;

  return (
    <div className="app-shell">
      <Navbar />
      <div className="container fade-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>My Complaints</h1>
            <p className="text-muted">Hello, {user?.name} — here are all your tickets</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/new')}>
            + New Complaint
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#d97706' }}>{pending}</div>
            <div className="stat-label">Pending AI Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#7c3aed' }}>{resolved}</div>
            <div className="stat-label">AI Resolved</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#16a34a' }}>{closed}</div>
            <div className="stat-label">Closed</div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : complaints.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>No complaints yet</p>
            <p className="text-muted" style={{ marginBottom: 20 }}>Submit your first complaint and get an AI-powered resolution in 3 minutes.</p>
            <button className="btn btn-primary" onClick={() => navigate('/new')}>Submit a Complaint</button>
          </div>
        ) : (
          <div className="ticket-list">
            {complaints.map(c => (
              <div className="ticket-row" key={c.id} onClick={() => navigate(`/complaint/${c.id}`)}>
                <span className="ticket-id">{c.ticketNumber}</span>
                <div className="ticket-info">
                  <div className="ticket-title">{c.subject}</div>
                  <div className="ticket-meta">
                    {c.category} · {new Date(c.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                    {c.priority && <> · <strong>{c.priority}</strong></>}
                  </div>
                </div>
                {statusBadge(c.status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
