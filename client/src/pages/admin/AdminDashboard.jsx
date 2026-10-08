import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { SCHEMES, savedService } from '../../services/localData';
import { getCategoryConfig } from '../../utils/helpers';
import {
  LayoutDashboard, BookOpen, LogOut, Shield, Search,
} from 'lucide-react';

function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  // Check on mount and redirect if not admin
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!isAdmin) {
    navigate('/admin/login', { replace: true });
    return null;
  }
  return children;
}

export default function AdminDashboard() {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { adminLogout(); navigate('/admin/login'); };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/schemes',   label: 'Schemes',   icon: BookOpen },
  ];

  return (
    <RequireAdmin>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{ background: 'var(--gray-900)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '0.5rem', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} style={{ color: '#fff' }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>Admin Panel</div>
              <div style={{ color: 'var(--gray-500)', fontSize: '0.7rem' }}>{admin?.name}</div>
            </div>
          </div>
          {navItems.map(item => {
            const Icon  = item.icon;
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            return (
              <Link key={item.to} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, color: active ? '#fff' : 'var(--gray-400)', background: active ? 'rgba(255,255,255,0.1)' : 'transparent', transition: 'all 0.15s' }}>
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
          <div style={{ marginTop: 'auto' }}>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: '0.875rem', width: '100%' }}>
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ background: 'var(--gray-50)', overflowY: 'auto' }}>
          <Routes>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="schemes"   element={<SchemesManager />} />
            <Route path="*"         element={<DashboardHome />} />
          </Routes>
        </main>
      </div>
    </RequireAdmin>
  );
}

function DashboardHome() {
  // Compute stats from hardcoded data
  const totalSchemes    = SCHEMES.length;
  const activeSchemes   = SCHEMES.filter(s => s.status === 'active').length;
  const totalSaved      = savedService.getAll().length;
  const totalCategories = [...new Set(SCHEMES.map(s => s.category))].length;

  // Count schemes per category
  const categoryCounts = {};
  SCHEMES.forEach(s => { categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1; });

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: '1.75rem' }}>Dashboard</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Schemes',  value: totalSchemes,    color: 'var(--primary-600)', bg: 'var(--primary-50)' },
          { label: 'Active Schemes', value: activeSchemes,   color: 'var(--success-600)', bg: '#dcfce7' },
          { label: 'Categories',     value: totalCategories, color: '#7c3aed',             bg: '#ede9fe' },
          { label: 'Schemes Saved',  value: totalSaved,      color: 'var(--accent-500)',   bg: '#fef3c7' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: '1rem', padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Category breakdown */}
        <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--gray-100)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem' }}>Schemes by Category</h3>
          {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
            const cfg = getCategoryConfig(cat);
            return (
              <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>{cfg.icon} {cfg.label}</span>
                <span style={{ background: cfg.bg, color: cfg.color, padding: '0.1rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* Recent schemes */}
        <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--gray-100)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem' }}>All Schemes (by Views)</h3>
          {[...SCHEMES].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8).map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>{s.name.substring(0, 35)}...</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600 }}>{s.viewCount} views</span>
            </div>
          ))}
        </div>
      </div>

      <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
        <span>ℹ️</span>
        <span style={{ fontSize: '0.8125rem' }}>
          <strong>Prototype mode:</strong> Schemes are hardcoded in <code>src/data/schemes.js</code>.
          Add or edit schemes by modifying that file directly.
        </span>
      </div>
    </div>
  );
}

function SchemesManager() {
  const [search, setSearch] = useState('');

  const filtered = SCHEMES.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800 }}>Schemes ({SCHEMES.length})</h1>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
        <input type="text" className="form-input" placeholder="Search schemes..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '2.5rem', maxWidth: 400 }} />
      </div>

      <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-50)' }}>
              {['Scheme Name', 'Category', 'Funding', 'Status', 'Views'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(scheme => {
              const cfg = getCategoryConfig(scheme.category);
              return (
                <tr key={scheme.id} style={{ borderTop: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-800)', maxWidth: 280 }}>
                    <div style={{ fontWeight: 600 }}>{scheme.name.substring(0, 50)}{scheme.name.length > 50 ? '...' : ''}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{scheme.department?.substring(0, 40)}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ background: cfg.bg, color: cfg.color, padding: '0.175rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--gray-600)', textTransform: 'capitalize' }}>
                    {scheme.fundingType.replace(/_/g, ' ')}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ background: scheme.status === 'active' ? '#dcfce7' : '#fee2e2', color: scheme.status === 'active' ? 'var(--success-700)' : 'var(--error-600)', padding: '0.175rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {scheme.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                    {scheme.viewCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
        <span>ℹ️</span>
        <span style={{ fontSize: '0.8125rem' }}>
          <strong>Read-only:</strong> Schemes are hardcoded for prototyping. Edit <code>src/data/schemes.js</code> to add or modify schemes.
        </span>
      </div>
    </div>
  );
}
