import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: 'admin@schememate.ai', password: 'Admin@12345' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      adminLogin(form.email, form.password);
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '2rem' }}>
      <div style={{ background: '#fff', borderRadius: '1.25rem', boxShadow: 'var(--shadow-xl)', padding: '2.5rem', width: '100%', maxWidth: 400, border: '1px solid var(--gray-100)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: '0.875rem', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock size={24} style={{ color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Admin Login</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>SchemeMate AI Administration</p>
        </div>

        {/* Hint */}
        <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
          <span>ℹ️</span>
          <div style={{ fontSize: '0.8rem' }}>
            <strong>Demo credentials:</strong><br />
            Email: admin@schememate.ai<br />
            Password: Admin@12345
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          {error && <div className="form-error" style={{ fontSize: '0.875rem' }}>{error}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ height: 46 }}>
            {loading ? 'Logging in...' : 'Log In as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
