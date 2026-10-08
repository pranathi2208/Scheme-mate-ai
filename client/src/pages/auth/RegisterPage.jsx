import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form,         setForm]         = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      register(form.name.trim(), form.email, form.password, form.phone || undefined);
      toast.success("Account created! Let's set up your profile.");
      navigate('/onboarding', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'var(--error-500)', width: '25%' };
    if (p.length < 8) return { label: 'Fair',      color: 'var(--warning-500)', width: '50%' };
    if (/[A-Z]/.test(p) && /\d/.test(p)) return { label: 'Strong', color: 'var(--success-500)', width: '100%' };
    return { label: 'Good', color: 'var(--primary-500)', width: '75%' };
  };

  const strength = passwordStrength();

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        {/* Left */}
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
          <h1 style={s.leftTitle}>Your government benefits are waiting</h1>
          <p style={s.leftSubtitle}>Create a free account to discover schemes you may be eligible for in just 2 minutes.</p>
          <div style={s.steps}>
            {[{ step: '1', text: 'Create account' }, { step: '2', text: 'Fill short profile (2 min)' }, { step: '3', text: 'See your matched schemes' }].map((item, i) => (
              <div key={i} style={s.stepItem}>
                <div style={s.stepCircle}>{item.step}</div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={s.rightPanel}>
          <div style={s.formContainer}>
            <h2 style={s.formTitle}>Create your account</h2>
            <p style={s.formSubtitle}>Free forever. No spam. No selling your data.</p>

            <form onSubmit={handleSubmit} style={s.form} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name <span className="required">*</span></label>
                <input id="name" type="text" className={`form-input${errors.name ? ' error' : ''}`}
                  placeholder="Your full name" value={form.name} autoComplete="name"
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address <span className="required">*</span></label>
                <input id="reg-email" type="email" className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="you@example.com" value={form.email} autoComplete="email"
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Mobile Number <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span>
                </label>
                <input id="phone" type="tel" className={`form-input${errors.phone ? ' error' : ''}`}
                  placeholder="10-digit mobile number" value={form.phone} autoComplete="tel"
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input id="reg-password" type={showPassword ? 'text' : 'password'}
                    className={`form-input${errors.password ? ' error' : ''}`}
                    placeholder="At least 6 characters" value={form.password} autoComplete="new-password"
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    style={{ paddingRight: '2.75rem' }} />
                  <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {strength && (
                  <div style={{ marginTop: '0.375rem' }}>
                    <div style={{ height: 4, background: 'var(--gray-200)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'width 0.3s', borderRadius: '9999px' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 500 }}>{strength.label}</span>
                  </div>
                )}
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirm-password">Confirm Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input id="confirm-password" type={showPassword ? 'text' : 'password'}
                    className={`form-input${errors.confirmPassword ? ' error' : ''}`}
                    placeholder="Re-enter your password" value={form.confirmPassword} autoComplete="new-password"
                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    style={{ paddingRight: '2.75rem' }} />
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <CheckCircle size={16} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--success-500)' }} />
                  )}
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ height: 48, fontSize: '1rem', marginTop: '0.25rem' }}>
                {loading
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={spinStyle} /> Creating account...</span>
                  : <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserPlus size={18} /> Create Free Account</span>
                }
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Log in</Link>
            </p>
            <p style={s.privacyNote}>🔒 Your data is stored locally in your browser only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const spinStyle = { width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' };

const s = {
  wrapper:       { minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' },
  card:          { background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', display: 'grid', gridTemplateColumns: '1fr 1.1fr', width: '100%', maxWidth: 900, border: '1px solid var(--gray-100)' },
  leftPanel:     { background: 'linear-gradient(145deg, var(--primary-700), var(--primary-900))', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' },
  brandMark:     { display: 'flex', alignItems: 'center', gap: '0.625rem' },
  brandIcon:     { width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName:     { color: '#fff', fontWeight: 800, fontSize: '1rem' },
  leftTitle:     { color: '#fff', fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.35 },
  leftSubtitle:  { color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7 },
  steps:         { display: 'flex', flexDirection: 'column', gap: '0.875rem', marginTop: '0.5rem' },
  stepItem:      { display: 'flex', alignItems: 'center', gap: '0.875rem' },
  stepCircle:    { width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0 },
  rightPanel:    { padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' },
  formContainer: { width: '100%', maxWidth: 380 },
  formTitle:     { fontSize: '1.375rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.25rem' },
  formSubtitle:  { color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem' },
  form:          { display: 'flex', flexDirection: 'column', gap: '1rem' },
  eyeBtn:        { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '0.25rem', display: 'flex', alignItems: 'center' },
  privacyNote:   { textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.75rem', marginTop: '1rem', lineHeight: 1.5 },
};
