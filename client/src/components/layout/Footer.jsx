import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.logoRow}>
              <div style={styles.logoIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={styles.brandName}>SchemeMate <span style={{ color: 'var(--primary-400)' }}>AI</span></span>
            </div>
            <p style={styles.brandDesc}>
              Helping citizens discover government schemes they're eligible for — clearly and simply.
            </p>
            <p style={styles.disclaimer}>
              ⚠️ SchemeMate AI provides scheme information for awareness purposes only. Always verify eligibility and details on official government portals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={styles.colTitle}>Quick Links</h4>
            <div style={styles.linkList}>
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/explore" style={styles.link}>Explore Schemes</Link>
              <Link to="/register" style={styles.link}>Get Started</Link>
              <Link to="/assistant" style={styles.link}>Ask Assistant</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={styles.colTitle}>Scheme Categories</h4>
            <div style={styles.linkList}>
              <Link to="/explore?category=agriculture" style={styles.link}>Agriculture</Link>
              <Link to="/explore?category=education" style={styles.link}>Education</Link>
              <Link to="/explore?category=healthcare" style={styles.link}>Healthcare</Link>
              <Link to="/explore?category=women_child" style={styles.link}>Women & Child</Link>
              <Link to="/explore?category=housing" style={styles.link}>Housing</Link>
              <Link to="/explore?category=employment" style={styles.link}>Employment</Link>
            </div>
          </div>

          {/* Help */}
          <div>
            <h4 style={styles.colTitle}>Helplines</h4>
            <div style={styles.linkList}>
              <span style={styles.helpLine}>📞 PM-KISAN: 155261</span>
              <span style={styles.helpLine}>📞 Ayushman Bharat: 14555</span>
              <span style={styles.helpLine}>📞 MGNREGA: 1800-111-555</span>
              <span style={styles.helpLine}>📞 PMAY: 1800-11-6446</span>
              <span style={styles.helpLine}>📞 PM MUDRA: 1800-180-1111</span>
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={styles.bottomText}>
            © {new Date().getFullYear()} SchemeMate AI. Built to serve citizens of India. 🇮🇳
          </p>
          <p style={styles.bottomText}>
            Data sourced from official Government of India portals. Scheme details are for reference only.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'var(--gray-900)', color: '#fff',
    paddingTop: '3rem', paddingBottom: '1.5rem',
    marginTop: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  brand: { gridColumn: 'span 1' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' },
  logoIcon: {
    width: 34, height: 34, borderRadius: '0.5rem',
    background: 'var(--primary-600)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  brandName: { fontSize: '1rem', fontWeight: 800, color: '#fff' },
  brandDesc: { fontSize: '0.8125rem', color: 'var(--gray-400)', lineHeight: 1.6, marginBottom: '0.75rem' },
  disclaimer: {
    fontSize: '0.75rem', color: 'var(--gray-500)',
    lineHeight: 1.5, padding: '0.5rem 0.75rem',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '0.5rem', borderLeft: '2px solid var(--warning-500)',
  },
  colTitle: { fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-300)', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  linkList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  link: { fontSize: '0.8125rem', color: 'var(--gray-400)', textDecoration: 'none', transition: 'color 150ms', ':hover': { color: '#fff' } },
  helpLine: { fontSize: '0.75rem', color: 'var(--gray-400)' },
  bottom: { paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  bottomText: { fontSize: '0.75rem', color: 'var(--gray-600)' },
};
