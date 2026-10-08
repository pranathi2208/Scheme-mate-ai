import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  Menu, X, ChevronDown, Globe, User, BookMarked,
  LogOut, Settings, MessageSquare, Search,
} from 'lucide-react';
import i18n from '../../i18n/i18n';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi',   native: 'हिंदी'   },
  { code: 'te', label: 'Telugu',  native: 'తెలుగు'  },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated, updateLanguage } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleLangChange = async (code) => {
    i18n.changeLanguage(code);
    if (isAuthenticated) await updateLanguage(code);
    setLangMenuOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'color: var(--primary-600); font-weight: 700;'
      : '';

  const navLinks = isAuthenticated
    ? [
        { to: '/explore',    label: t('nav.explore')   },
        { to: '/my-schemes', label: t('nav.mySchemes') },
        { to: '/assistant',  label: t('nav.assistant') },
      ]
    : [
        { to: '/explore', label: t('nav.explore') },
      ];

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={styles.logoText}>SchemeMate <span style={styles.logoAi}>AI</span></span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.desktopLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.navLink,
                ...(location.pathname === link.to ? styles.navLinkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={styles.actions}>
          {/* Language Picker */}
          <div style={styles.dropdown} ref={langMenuRef}>
            <button
              style={styles.iconBtn}
              onClick={() => setLangMenuOpen((p) => !p)}
              aria-label="Change language"
            >
              <Globe size={18} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{currentLang.code.toUpperCase()}</span>
            </button>
            {langMenuOpen && (
              <div style={{ ...styles.dropdownMenu, minWidth: 140 }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    style={{
                      ...styles.dropdownItem,
                      ...(i18n.language === lang.code ? styles.dropdownItemActive : {}),
                    }}
                    onClick={() => handleLangChange(lang.code)}
                  >
                    <span>{lang.native}</span>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {isAuthenticated ? (
            <div style={styles.dropdown} ref={userMenuRef}>
              <button
                style={styles.userBtn}
                onClick={() => setUserMenuOpen((p) => !p)}
              >
                <div style={styles.avatar}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div style={{ ...styles.dropdownMenu, right: 0, minWidth: 200 }}>
                  <div style={styles.dropdownHeader}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>{user?.email}</div>
                  </div>
                  <div style={styles.dropdownDivider} />
                  <Link to="/profile" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    <User size={14} /> Profile
                  </Link>
                  <Link to="/my-schemes" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    <BookMarked size={14} /> My Schemes
                  </Link>
                  <Link to="/assistant" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    <MessageSquare size={14} /> Assistant
                  </Link>
                  <div style={styles.dropdownDivider} />
                  <button style={{ ...styles.dropdownItem, color: 'var(--error-600)' }} onClick={handleLogout}>
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" className="btn btn-ghost btn-sm">{t('nav.login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            style={{ ...styles.iconBtn, display: 'none' }}
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.mobileLink,
                ...(location.pathname === link.to ? styles.mobileLinkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={styles.mobileDivider} />
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              style={{
                ...styles.mobileLink,
                ...(i18n.language === lang.code ? styles.mobileLinkActive : {}),
              }}
              onClick={() => handleLangChange(lang.code)}
            >
              {lang.native} ({lang.label})
            </button>
          ))}
          <div style={styles.mobileDivider} />
          {isAuthenticated ? (
            <button style={{ ...styles.mobileLink, color: 'var(--error-600)' }} onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink}>{t('nav.login')}</Link>
              <Link to="/register" style={{ ...styles.mobileLink, color: 'var(--primary-600)', fontWeight: 700 }}>
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .auth-btns { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--gray-200)',
    height: 'var(--nav-height)',
  },
  inner: {
    maxWidth: 'var(--max-width)', margin: '0 auto',
    padding: '0 var(--space-lg)',
    height: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: 'var(--space-lg)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    textDecoration: 'none', flexShrink: 0,
  },
  logoIcon: {
    width: 36, height: 36, borderRadius: '0.5rem',
    background: 'var(--primary-600)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--gray-900)' },
  logoAi: { color: 'var(--primary-600)' },
  desktopLinks: {
    display: 'flex', alignItems: 'center', gap: 'var(--space-xs)',
    className: 'desktop-links',
  },
  navLink: {
    padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem', fontWeight: 500,
    color: 'var(--gray-600)', textDecoration: 'none',
    transition: 'all var(--transition)',
  },
  navLinkActive: { color: 'var(--primary-600)', background: 'var(--primary-50)', fontWeight: 600 },
  actions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  iconBtn: {
    display: 'flex', alignItems: 'center', gap: '0.25rem',
    padding: '0.4rem 0.6rem', border: '1.5px solid var(--gray-200)',
    borderRadius: 'var(--radius-md)', background: '#fff',
    color: 'var(--gray-600)', cursor: 'pointer',
    fontSize: '0.75rem', transition: 'all var(--transition)',
  },
  userBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem',
    padding: '0.25rem 0.5rem', border: '1.5px solid var(--gray-200)',
    borderRadius: 'var(--radius-full)', background: '#fff',
    cursor: 'pointer', transition: 'all var(--transition)',
  },
  avatar: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'var(--primary-600)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: 700,
  },
  authBtns: { display: 'flex', alignItems: 'center', gap: '0.5rem', className: 'auth-btns' },
  dropdown: { position: 'relative' },
  dropdownMenu: {
    position: 'absolute', top: 'calc(100% + 8px)',
    background: '#fff', borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)', border: '1px solid var(--gray-200)',
    padding: '0.375rem', minWidth: 180, zIndex: 200,
    animation: 'fadeInUp 0.15s ease-out',
  },
  dropdownHeader: { padding: '0.5rem 0.75rem 0.25rem' },
  dropdownItem: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    width: '100%', padding: '0.5rem 0.75rem',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '0.875rem', color: 'var(--gray-700)',
    borderRadius: 'var(--radius-md)', textDecoration: 'none',
    transition: 'background var(--transition)',
    justifyContent: 'space-between',
  },
  dropdownItemActive: { background: 'var(--primary-50)', color: 'var(--primary-700)' },
  dropdownDivider: { height: 1, background: 'var(--gray-100)', margin: '0.25rem 0' },
  mobileMenu: {
    background: '#fff', borderTop: '1px solid var(--gray-100)',
    padding: '0.75rem 1rem',
    display: 'flex', flexDirection: 'column', gap: '0.125rem',
  },
  mobileLink: {
    display: 'block', padding: '0.75rem 1rem',
    fontSize: '0.9375rem', fontWeight: 500, color: 'var(--gray-700)',
    borderRadius: 'var(--radius-md)', textDecoration: 'none',
    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
  },
  mobileLinkActive: { color: 'var(--primary-600)', background: 'var(--primary-50)', fontWeight: 700 },
  mobileDivider: { height: 1, background: 'var(--gray-100)', margin: '0.5rem 0' },
};
