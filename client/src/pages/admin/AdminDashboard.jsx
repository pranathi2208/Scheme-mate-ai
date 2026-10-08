import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { getAllSchemes, createScheme, updateScheme, deleteScheme, resetSchemes, savedService } from '../../services/localData';
import { getCategoryConfig } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, BookOpen, LogOut, Shield, Search,
  Plus, Edit, Trash2, RefreshCw,
} from 'lucide-react';

function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!isAdmin) { navigate('/admin/login', { replace: true }); return null; }
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
            const Icon = item.icon;
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

        <main style={{ background: 'var(--gray-50)', overflowY: 'auto' }}>
          <Routes>
            <Route path="dashboard"          element={<DashboardHome />} />
            <Route path="schemes"            element={<SchemesManager />} />
            <Route path="schemes/new"        element={<SchemeForm />} />
            <Route path="schemes/edit/:id"   element={<SchemeForm />} />
            <Route path="*"                  element={<DashboardHome />} />
          </Routes>
        </main>
      </div>
    </RequireAdmin>
  );
}

function DashboardHome() {
  const [schemes, setSchemes] = useState([]);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSchemes(getAllSchemes());
    setSavedCount(savedService.getAll().length);
  }, []);

  const totalSchemes    = schemes.length;
  const activeSchemes   = schemes.filter(s => s.status === 'active').length;
  const totalCategories  = [...new Set(schemes.map(s => s.category))].length;

  const categoryCounts = {};
  schemes.forEach(s => { categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1; });

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: '1.75rem' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Schemes',  value: totalSchemes,    color: 'var(--primary-600)', bg: 'var(--primary-50)' },
          { label: 'Active Schemes', value: activeSchemes,   color: 'var(--success-600)', bg: '#dcfce7' },
          { label: 'Categories',     value: totalCategories, color: '#7c3aed',             bg: '#ede9fe' },
          { label: 'Schemes Saved', value: savedCount,        color: 'var(--accent-500)',   bg: '#fef3c7' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: '1rem', padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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

        <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--gray-100)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem' }}>Most Viewed Schemes</h3>
          {[...schemes].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 8).map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>{s.name.substring(0, 35)}...</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600 }}>{s.viewCount || 0} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SchemesManager() {
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => setSchemes(getAllSchemes());

  useEffect(() => { load(); }, []);

  const handleDelete = (id, name) => {
    if (!confirm(`Delete "${name}"? This will permanently remove it from the schemes list.`)) return;
    const updated = deleteScheme(id);
    setSchemes(updated);
    toast.success('Scheme deleted');
  };

  const handleReset = () => {
    if (!confirm('Reset all schemes to default? This will undo all admin changes.')) return;
    const reset = resetSchemes();
    setSchemes(reset);
    toast.success('Schemes reset to default');
  };

  const filtered = schemes.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800 }}>Schemes ({schemes.length})</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset to default schemes">
            <RefreshCw size={15} /> Reset
          </button>
          <Link to="/admin/schemes/new" className="btn btn-primary btn-sm">
            <Plus size={15} /> Add Scheme
          </Link>
        </div>
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
              {['Scheme Name', 'Category', 'Funding', 'Status', 'Views', 'Actions'].map(h => (
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
                    {scheme.viewCount || 0}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/admin/schemes/edit/${scheme.id}`} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                        <Edit size={14} />
                      </Link>
                      <button onClick={() => handleDelete(scheme.id, scheme.name)} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem 0.6rem', color: 'var(--error-500)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SchemeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.pathname.split('/').pop();
  const isEdit = editId && editId !== 'new';

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', department: '', ministry: '', category: 'agriculture',
    shortDescription: '', description: '', mainBenefit: '',
    applicationMode: 'both', officialUrl: '', helplineNumber: '',
    fundingType: 'central', status: 'active',
  });

  useEffect(() => {
    if (isEdit) {
      const all = getAllSchemes();
      const existing = all.find(s => s.id === editId);
      if (existing) {
        setForm({
          name: existing.name || '',
          department: existing.department || '',
          ministry: existing.ministry || '',
          category: existing.category || 'agriculture',
          shortDescription: existing.shortDescription || '',
          description: existing.description || '',
          mainBenefit: existing.mainBenefit || '',
          applicationMode: existing.applicationMode || 'both',
          officialUrl: existing.officialUrl || '',
          helplineNumber: existing.helplineNumber || '',
          fundingType: existing.fundingType || 'central',
          status: existing.status || 'active',
        });
      }
    }
  }, [editId, isEdit]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.department.trim() || !form.description.trim()) {
      toast.error('Name, Department and Description are required');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        updateScheme(editId, form);
        toast.success('Scheme updated!');
      } else {
        createScheme(form);
        toast.success('Scheme created!');
      }
      navigate('/admin/schemes');
    } catch {
      toast.error('Failed to save scheme');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <button onClick={() => navigate('/admin/schemes')} className="btn btn-ghost btn-sm">← Back</button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{isEdit ? 'Edit Scheme' : 'Add New Scheme'}</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '1rem', padding: '1.75rem', border: '1px solid var(--gray-100)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Scheme Name <span className="required">*</span></label>
            <input type="text" className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category <span className="required">*</span></label>
            <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
              {['agriculture','education','healthcare','women_child','housing','employment','financial_assistance','social_security','skill_development','entrepreneurship','disability','senior_citizen','minority','other'].map(c => (
                <option key={c} value={c}>{getCategoryConfig(c).label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Department <span className="required">*</span></label>
            <input type="text" className="form-input" value={form.department} onChange={e => set('department', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Ministry</label>
            <input type="text" className="form-input" value={form.ministry} onChange={e => set('ministry', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Short Description (max 300 chars)</label>
          <input type="text" className="form-input" value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} maxLength={300} />
        </div>
        <div className="form-group">
          <label className="form-label">Full Description <span className="required">*</span></label>
          <textarea className="form-input form-textarea" rows={4} value={form.description} onChange={e => set('description', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Main Benefit</label>
          <input type="text" className="form-input" value={form.mainBenefit} onChange={e => set('mainBenefit', e.target.value)} placeholder="e.g. ₹6,000 per year direct cash transfer" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Official URL</label>
            <input type="url" className="form-input" value={form.officialUrl} onChange={e => set('officialUrl', e.target.value)} placeholder="https://" />
          </div>
          <div className="form-group">
            <label className="form-label">Helpline Number</label>
            <input type="text" className="form-input" value={form.helplineNumber} onChange={e => set('helplineNumber', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Funding Type</label>
            <select className="form-select" value={form.fundingType} onChange={e => set('fundingType', e.target.value)}>
              <option value="central">Central</option>
              <option value="state">State</option>
              <option value="central_state">Central + State</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Application Mode</label>
            <select className="form-select" value={form.applicationMode} onChange={e => set('applicationMode', e.target.value)}>
              <option value="both">Online & Offline</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Scheme' : 'Create Scheme'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/schemes')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
