import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getFeaturedSchemes } from '../services/localData';
import { getCategoryConfig } from '../utils/helpers';
import {
  ArrowRight, CheckCircle, Shield, Users, Search,
  Star, ChevronRight, Wheat, BookOpen, HeartPulse,
  Home, Briefcase, Banknote, TrendingUp, BadgeCheck,
} from 'lucide-react';

const CATEGORY_ICONS = {
  agriculture: Wheat, education: BookOpen, healthcare: HeartPulse,
  housing: Home, employment: Briefcase,
  financial_assistance: Banknote, social_security: Shield,
  skill_development: TrendingUp,
};

const BROWSE_CATEGORIES = [
  'agriculture','education','healthcare','women_child','housing',
  'employment','financial_assistance','social_security',
  'skill_development','entrepreneurship','disability','senior_citizen',
];

export default function LandingPage() {
  const { t } = useTranslation();
  const { isAuthenticated, profileComplete } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    setFeatured(getFeaturedSchemes());
  }, []);

  const handleCTA = () => {
    if (!isAuthenticated) return navigate('/register');
    if (!profileComplete)  return navigate('/onboarding');
    navigate('/my-schemes');
  };

  return (
    <div style={{ background: '#fff' }}>
      {/* ── HERO ── */}
      <section style={s.hero}>
        <div className="container">
          <div style={s.heroInner}>
            <div style={s.heroContent}>
              <div style={s.heroBadge}>
                <BadgeCheck size={14} />
                <span>{t('landing.badge')}</span>
              </div>
              <h1 style={s.heroTitle}>
                {t('landing.title')}<br />
                <span style={s.heroAccent}>{t('landing.titleAccent')}</span>
              </h1>
              <p style={s.heroSubtitle}>
                {t('landing.subtitle')}
              </p>
              <div style={s.heroCtas}>
                <button onClick={handleCTA} className="btn btn-primary btn-xl" style={{ gap: '0.5rem' }}>
                  {t('landing.cta')} <ArrowRight size={18} />
                </button>
                <Link to="/explore" className="btn btn-secondary btn-xl">{t('landing.exploreBtn')}</Link>
              </div>
              <div style={s.heroStats}>
                {[
                  { value: '25+', label: t('landing.stats.schemes') },
                  { value: '12+', label: t('landing.stats.categories') },
                  { value: 'Free', label: t('landing.stats.free') },
                ].map(stat => (
                  <div key={stat.label} style={s.stat}>
                    <div style={s.statValue}>{stat.value}</div>
                    <div style={s.statLabel}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.heroIllustration}><HeroIllustration /></div>
          </div>
        </div>
        <div style={s.disclaimerStrip}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Shield size={14} style={{ color: 'var(--warning-500)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>
              {t('landing.disclaimer')}
            </span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={s.section}>
        <div className="container">
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>{t('landing.howItWorks.title')}</h2>
            <p style={s.sectionSubtitle}>{t('landing.howItWorks.subtitle')}</p>
          </div>
          <div style={s.stepsGrid}>
            {[
              { num: '01', icon: <Users size={22} />, title: t('landing.howItWorks.step1Title'), desc: t('landing.howItWorks.step1Desc') },
              { num: '02', icon: <Search size={22} />, title: t('landing.howItWorks.step2Title'), desc: t('landing.howItWorks.step2Desc') },
              { num: '03', icon: <CheckCircle size={22} />, title: t('landing.howItWorks.step3Title'), desc: t('landing.howItWorks.step3Desc') },
            ].map((step, i) => (
              <div key={i} style={s.stepCard}>
                <div style={s.stepNum}>{step.num}</div>
                <div style={s.stepIcon}>{step.icon}</div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ ...s.section, background: 'var(--primary-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 style={s.sectionTitle}>
                {t('landing.problem.title1')}<br />
                <span style={{ color: 'var(--primary-600)' }}>{t('landing.problem.title2')}</span>
              </h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginTop: '1rem', fontSize: '1rem' }}>
                {t('landing.problem.desc')}
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  t('landing.problem.point1'),
                  t('landing.problem.point2'),
                  t('landing.problem.point3'),
                  t('landing.problem.point4'),
                ].map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={16} style={{ color: 'var(--success-600)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--gray-700)', fontSize: '0.9375rem' }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}><ProblemIllustration /></div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={s.section}>
        <div className="container">
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>{t('landing.categories.title')}</h2>
            <p style={s.sectionSubtitle}>{t('landing.categories.subtitle')}</p>
          </div>
          <div style={s.categoriesGrid}>
            {BROWSE_CATEGORIES.map(key => {
              const cfg  = getCategoryConfig(key);
              const Icon = CATEGORY_ICONS[key] || Star;
              return (
                <Link key={key} to={`/explore?category=${key}`}
                  style={{ ...s.categoryCard, borderColor: cfg.color + '30' }}
                  onMouseEnter={e => { e.currentTarget.style.background = cfg.bg; e.currentTarget.style.borderColor = cfg.color + '60'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = cfg.color + '30'; }}
                >
                  <div style={{ ...s.categoryIcon, background: cfg.bg, color: cfg.color }}><Icon size={20} /></div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)' }}>{t('categories.' + key)}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED SCHEMES ── */}
      {featured.length > 0 && (
        <section style={{ ...s.section, background: 'var(--gray-50)' }}>
          <div className="container">
            <div style={{ ...s.sectionHeader, marginBottom: '2rem' }}>
              <h2 style={s.sectionTitle}>{t('landing.featured.title')}</h2>
              <p style={s.sectionSubtitle}>{t('landing.featured.subtitle')}</p>
            </div>
            <div style={s.schemesGrid}>
              {featured.slice(0, 6).map(scheme => {
                const cfg = getCategoryConfig(scheme.category);
                return (
                  <Link key={scheme.id} to={`/schemes/${scheme.slug || scheme.id}`} style={s.schemeCard}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{ ...s.catBadge, background: cfg.bg, color: cfg.color }}>{cfg.icon} {t('categories.' + scheme.category)}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                        {scheme.fundingType === 'central' ? t('explore.fundingCentral') : t('explore.fundingState')}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.375rem', lineHeight: 1.4 }}>{scheme.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>
                      {scheme.shortDescription?.substring(0, 100)}...
                    </p>
                    {scheme.mainBenefit && (
                      <div style={s.benefitTag}>
                        <Star size={11} style={{ color: 'var(--accent-500)' }} />
                        <span>{scheme.mainBenefit?.substring(0, 60)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-600)', fontSize: '0.8125rem', fontWeight: 600, marginTop: '0.75rem' }}>
                      {t('explore.viewDetails')} <ChevronRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/explore" className="btn btn-secondary btn-lg">{t('landing.featured.viewAll')} <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST ── */}
      <section style={{ ...s.section, background: 'var(--gray-900)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ ...s.sectionTitle, color: '#fff' }}>{t('landing.trust.title')}</h2>
            <p style={{ ...s.sectionSubtitle, color: 'var(--gray-400)' }}>{t('landing.trust.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Shield size={22} />, title: t('landing.trust.privacyTitle'), desc: t('landing.trust.privacyDesc') },
              { icon: <CheckCircle size={22} />, title: t('landing.trust.officialTitle'), desc: t('landing.trust.officialDesc') },
              { icon: <BadgeCheck size={22} />, title: t('landing.trust.noFakeTitle'), desc: t('landing.trust.noFakeDesc') },
              { icon: <Users size={22} />, title: t('landing.trust.citizensTitle'), desc: t('landing.trust.citizensDesc') },
            ].map((item, i) => (
              <div key={i} style={s.trustCard}>
                <div style={s.trustIcon}>{item.icon}</div>
                <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.375rem' }}>{item.title}</h4>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.8125rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ ...s.section, background: 'var(--primary-600)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>{t('landing.finalCta.title')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            {t('landing.finalCta.subtitle')}
          </p>
          <button onClick={handleCTA} className="btn" style={{ background: '#fff', color: 'var(--primary-700)', padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 700, borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>
            {t('landing.finalCta.btn')} <ArrowRight size={18} style={{ display: 'inline', marginLeft: 4 }} />
          </button>
        </div>
      </section>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
      <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
        <rect x="20" y="20" width="360" height="300" rx="20" fill="#EFF6FF" />
        <rect x="20" y="20" width="360" height="60" rx="20" fill="#2563EB" />
        <rect x="20" y="60" width="360" height="20" fill="#2563EB" />
        <circle cx="50" cy="50" r="16" fill="white" fillOpacity="0.2" />
        <rect x="74" y="38" width="120" height="10" rx="5" fill="white" fillOpacity="0.9" />
        <rect x="74" y="54" width="80" height="8" rx="4" fill="white" fillOpacity="0.5" />
        {[0, 1, 2].map(i => (
          <g key={i} transform={`translate(40, ${105 + i * 68})`}>
            <rect width="320" height="56" rx="12" fill="white" stroke="#E5E7EB" />
            <rect x="12" y="14" width="28" height="28" rx="8" fill={['#DCFCE7','#DBEAFE','#FEF3C7'][i]} />
            <text x="26" y="33" textAnchor="middle" fontSize="14">{['🌾','🏥','📚'][i]}</text>
            <rect x="52" y="14" width="120" height="9" rx="4" fill="#1F2937" />
            <rect x="52" y="30" width="180" height="7" rx="3" fill="#9CA3AF" />
            <rect x="52" y="43" width="80" height="6" rx="3" fill={['#16A34A','#2563EB','#D97706'][i]} fillOpacity="0.6" />
            <rect x="264" y="18" width="48" height="20" rx="10" fill={['#DCFCE7','#DBEAFE','#FEF3C7'][i]} />
            <text x="288" y="32" textAnchor="middle" fontSize="9" fill={['#16A34A','#2563EB','#D97706'][i]} fontWeight="600">Match</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ProblemIllustration() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 300 }}>
      <circle cx="150" cy="130" r="100" fill="#EFF6FF" />
      <circle cx="150" cy="90" r="28" fill="#2563EB" fillOpacity="0.15" />
      <circle cx="150" cy="85" r="18" fill="#2563EB" fillOpacity="0.5" />
      <path d="M110 150 Q150 120 190 150" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" fill="none" />
      <text x="60" y="100" fontSize="28" fill="#F59E0B" opacity="0.7">?</text>
      <text x="220" y="100" fontSize="22" fill="#F59E0B" opacity="0.5">?</text>
      <text x="80" y="180" fontSize="18" fill="#F59E0B" opacity="0.4">?</text>
      <text x="200" y="185" fontSize="24" fill="#F59E0B" opacity="0.6">?</text>
      <rect x="50" y="130" width="50" height="65" rx="6" fill="#fff" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="58" y="143" width="34" height="5" rx="2" fill="#CBD5E1" />
      <rect x="58" y="154" width="28" height="5" rx="2" fill="#CBD5E1" />
      <rect x="58" y="165" width="32" height="5" rx="2" fill="#CBD5E1" />
      <rect x="200" y="135" width="50" height="65" rx="6" fill="#fff" stroke="#E5E7EB" strokeWidth="1.5" />
      <rect x="208" y="148" width="34" height="5" rx="2" fill="#CBD5E1" />
      <rect x="208" y="159" width="28" height="5" rx="2" fill="#CBD5E1" />
      <rect x="208" y="170" width="32" height="5" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

const s = {
  hero:         { background: 'linear-gradient(160deg, #f0f7ff 0%, #fff 60%)', paddingTop: '5rem', paddingBottom: 0 },
  heroInner:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', paddingBottom: '4rem' },
  heroContent:  { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  heroBadge:    { display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.875rem', background: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, width: 'fit-content' },
  heroTitle:    { fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.2, color: 'var(--gray-900)' },
  heroAccent:   { color: 'var(--primary-600)' },
  heroSubtitle: { fontSize: '1.0625rem', color: 'var(--gray-600)', lineHeight: 1.7, maxWidth: 480 },
  heroCtas:     { display: 'flex', gap: '0.875rem', flexWrap: 'wrap' },
  heroStats:    { display: 'flex', gap: '2rem', marginTop: '0.5rem' },
  stat:         { display: 'flex', flexDirection: 'column' },
  statValue:    { fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-600)' },
  statLabel:    { fontSize: '0.8125rem', color: 'var(--gray-500)' },
  heroIllustration: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  disclaimerStrip: { background: 'var(--warning-50)', borderTop: '1px solid var(--warning-100)', padding: '0.625rem 0' },
  section:      { padding: '4rem 0' },
  sectionHeader:{ textAlign: 'center', marginBottom: '3rem' },
  sectionTitle: { fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--gray-900)' },
  sectionSubtitle: { color: 'var(--gray-500)', marginTop: '0.5rem', fontSize: '1rem' },
  stepsGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' },
  stepCard:     { background: '#fff', border: '1.5px solid var(--gray-100)', borderRadius: '1.25rem', padding: '2rem', position: 'relative' },
  stepNum:      { fontSize: '3rem', fontWeight: 900, color: 'var(--primary-100)', lineHeight: 1, position: 'absolute', top: '1.25rem', right: '1.5rem' },
  stepIcon:     { width: 48, height: 48, borderRadius: '0.875rem', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  stepTitle:    { fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--gray-900)' },
  stepDesc:     { fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.7 },
  categoriesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' },
  categoryCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem', padding: '1.25rem 1rem', background: '#fff', border: '1.5px solid var(--gray-100)', borderRadius: '1rem', textDecoration: 'none', transition: 'all 0.15s', cursor: 'pointer' },
  categoryIcon: { width: 44, height: 44, borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  schemesGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' },
  schemeCard:   { background: '#fff', border: '1.5px solid var(--gray-100)', borderRadius: '1.125rem', padding: '1.25rem', textDecoration: 'none', display: 'block', transition: 'all 0.15s', boxShadow: 'var(--shadow-sm)' },
  catBadge:     { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 },
  benefitTag:   { display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', padding: '0.25rem 0', fontSize: '0.8rem', color: 'var(--gray-600)', borderTop: '1px solid var(--gray-100)', paddingTop: '0.625rem' },
  trustCard:    { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.5rem' },
  trustIcon:    { width: 44, height: 44, borderRadius: '0.75rem', background: 'var(--primary-800)', color: 'var(--primary-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' },
};
