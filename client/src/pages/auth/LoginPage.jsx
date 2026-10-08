import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/my-schemes';

  const [form,         setForm]         = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      navigate(data.profileComplete ? from : '/onboarding', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        {/* Left panel */}
        <div style={s.leftPanel}>
          <div style={s.brandMark}>
            <div style={s.brandIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={s.brandName}>SchemeMate AI</span>
          </div>
          <h1 style={s.leftTitle}>Find schemes you deserve</h1>
          <p style={s.leftSubtitle}>Log in to see personalised government scheme recommendations based on your profile.</p>
          <div style={s.leftFeatures}>
            {['25+ government schemes', 'Personalised matching', 'Track your applications', 'Free — always'].map((f, i) => (
              <div key={i} style={s.feature}>
                <div style={s.featureDot} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={s.rightPanel}>
          <div style={s.formContainer}>
            <h2 style={s.formTitle}>Welcome back</h2>
            <p style={s.formSubtitle}>Log in to your SchemeMate account</p>

            <form onSubmit={handleSubmit} style={s.form} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address <span className="required">*</span></label>
                <input id="email" type="email" className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="you@example.com" value={form.email} autoComplete="email"
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input id="password" type={showPassword ? 'text' : 'password'}
                    className={`form-input${errors.password ? ' error' : ''}`}
                    placeholder="Enter your password" value={form.password} autoComplete="current-password"
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    style={{ paddingRight: '2.75rem' }} />
                  <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ height: 48, fontSize: '1rem', marginTop: '0.5rem' }}>
                {loading
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={spinStyle} /> Logging in...</span>
                  : <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LogIn size={18} /> Log In</span>
                }
              </button>
            </form>

            <div style={s.dividerRow}>
              <div style={s.dividerLine} />
              <span style={s.dividerText}>New to SchemeMate?</span>
              <div style={s.dividerLine} />
            </div>

            <Link to="/register" className="btn btn-secondary btn-full" style={{ height: 46, fontSize: '0.9375rem' }}>
              Create a free account
            </Link>
            <p style={s.privacyNote}>🔒 Your information is stored locally in your browser only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const spinStyle = { width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' };

const s = {
  wrapper:       { minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' },
  card:          { background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', maxWidth: 860, border: '1px solid var(--gray-100)' },
  leftPanel:     { background: 'linear-gradient(145deg, var(--primary-700), var(--primary-900))', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  brandMark:     { display: 'flex', alignItems: 'center', gap: '0.625rem' },
  brandIcon:     { width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName:     { color: '#fff', fontWeight: 800, fontSize: '1rem' },
  leftTitle:     { color: '#fff', fontSize: '1.625rem', fontWeight: 800, lineHeight: 1.3 },
  leftSubtitle:  { color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7 },
  leftFeatures:  { display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' },
  feature:       { display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' },
  featureDot:    { width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-300)', flexShrink: 0 },
  rightPanel:    { padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  formContainer: { width: '100%', maxWidth: 360 },
  formTitle:     { fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.25rem' },
  formSubtitle:  { color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.75rem' },
  form:          { display: 'flex', flexDirection: 'column', gap: '1.125rem' },
  eyeBtn:        { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '0.25rem', display: 'flex', alignItems: 'center' },
  dividerRow:    { display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0 0.875rem' },
  dividerLine:   { flex: 1, height: 1, background: 'var(--gray-200)' },
  dividerText:   { color: 'var(--gray-400)', fontSize: '0.8125rem', whiteSpace: 'nowrap' },
  privacyNote:   { textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.75rem', marginTop: '1rem', lineHeight: 1.5 },
};
