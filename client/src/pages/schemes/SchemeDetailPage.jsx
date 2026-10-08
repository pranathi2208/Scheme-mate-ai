import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getSchemeById, savedService } from '../../services/localData';
import { getCategoryConfig } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
  ArrowLeft, ExternalLink, BookMarked, CheckCircle,
  FileText, Phone, AlertTriangle, Building, Globe, ChevronRight,
} from 'lucide-react';

export default function SchemeDetailPage() {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scheme,  setScheme]  = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    const s = getSchemeById(idOrSlug);
    if (!s) { navigate('/explore', { replace: true }); return; }
    setScheme(s);
    setIsSaved(savedService.isSaved(s.id || s.slug));
  }, [idOrSlug, navigate]);

  const handleSave = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (isSaved) return;
    setSaving(true);
    savedService.save(scheme.id || scheme.slug, {});
    setIsSaved(true);
    toast.success(t('schemeDetail.savedToast'));
    setSaving(false);
  };

  if (!scheme) return null;

  const catCfg = getCategoryConfig(scheme.category);

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: 900 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '1.25rem', gap: '0.375rem' }}>
        <ArrowLeft size={16} /> {t('schemeDetail.back')}
      </button>

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <span style={{ background: catCfg.bg, color: catCfg.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600 }}>
              {catCfg.icon} {t('categories.' + scheme.category)}
            </span>
            <span style={{ background: scheme.fundingType === 'central' ? 'var(--primary-50)' : 'var(--warning-50)', color: scheme.fundingType === 'central' ? 'var(--primary-700)' : 'var(--accent-600)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600 }}>
              {scheme.fundingType === 'central' ? '🇮🇳 ' + t('schemeDetail.fundingGovIndia') : scheme.fundingType === 'state' ? '📍 ' + t('schemeDetail.fundingStateGov') : '🤝 ' + t('schemeDetail.fundingCentralState')}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: '0.5rem' }}>
            {scheme.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            <Building size={14} />
            <span>{scheme.department}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            className={`btn ${isSaved ? 'btn-ghost' : 'btn-secondary'}`}
            onClick={handleSave} disabled={saving || isSaved}
          >
            <BookMarked size={16} />
            {isSaved ? t('schemeDetail.saved') : saving ? t('schemeDetail.saving') : t('schemeDetail.saveScheme')}
          </button>
          {scheme.officialUrl && (
            <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {t('schemeDetail.officialSite')} <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem' }}>
          {t('schemeDetail.disclaimer', { department: scheme.department })}
        </div>
      </div>

      <div style={s.twoCol}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Section title={t('schemeDetail.whatIs')} icon={<Globe size={16} />}>
            <p style={s.bodyText}>{scheme.description}</p>
          </Section>

          {scheme.benefits?.length > 0 && (
            <Section title={t('schemeDetail.benefits')} icon={<CheckCircle size={16} />} accent>
              <ul style={s.list}>
                {scheme.benefits.map((b, i) => (
                  <li key={i} style={s.listItem}>
                    <CheckCircle size={14} style={{ color: 'var(--success-600)', flexShrink: 0, marginTop: 2 }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {scheme.eligibilityCriteria?.length > 0 && (
            <Section title={t('schemeDetail.eligibility')} icon={<CheckCircle size={16} />}>
              <div className="alert alert-info" style={{ marginBottom: '0.875rem' }}>
                <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem' }}>{t('schemeDetail.eligibilityNote')}</span>
              </div>
              <ul style={s.list}>
                {scheme.eligibilityCriteria.map((e, i) => (
                  <li key={i} style={s.listItem}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-500)', flexShrink: 0, marginTop: 7 }} />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {scheme.requiredDocuments?.length > 0 && (
            <Section title={t('schemeDetail.documents')} icon={<FileText size={16} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {scheme.requiredDocuments.map((doc, i) => (
                  <div key={i} style={s.docItem}>
                    <FileText size={14} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{doc.name}</span>
                      {!doc.isMandatory && <span style={{ color: 'var(--gray-400)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{t('schemeDetail.documents.optional')}</span>}
                      {doc.description && <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{doc.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {scheme.applicationProcess && (
            <Section title={t('schemeDetail.howToApply')} icon={<ChevronRight size={16} />}>
              <p style={s.bodyText}>{scheme.applicationProcess}</p>
              {scheme.whereToApply && (
                <div style={{ marginTop: '0.75rem', background: 'var(--primary-50)', padding: '0.75rem 1rem', borderRadius: '0.625rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', marginBottom: '0.25rem' }}>{t('schemeDetail.whereToApply')}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--primary-800)' }}>{scheme.whereToApply}</div>
                </div>
              )}
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('schemeDetail.quickInfo')}
            </h3>
            {[
              { label: t('schemeDetail.ministry'),         value: scheme.ministry },
              { label: t('schemeDetail.applicationMode'),  value: scheme.applicationMode === 'both' ? t('schemeDetail.modeBoth') : scheme.applicationMode === 'online' ? t('schemeDetail.modeOnline') : scheme.applicationMode === 'offline' ? t('schemeDetail.modeOffline') : scheme.applicationMode },
              { label: t('schemeDetail.funding'),          value: scheme.fundingType === 'central' ? t('schemeDetail.fundingGovIndia') : scheme.fundingType === 'state' ? t('schemeDetail.fundingStateGov') : t('schemeDetail.fundingCentralState') },
              { label: t('schemeDetail.status'),           value: scheme.status === 'active' ? t('schemeDetail.active') : '⚠️ ' + scheme.status },
            ].filter(r => r.value).map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--gray-500)' }}>{row.label}</span>
                <span style={{ color: 'var(--gray-800)', fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {scheme.helplineNumber && (
            <div className="card" style={{ padding: '1.125rem', background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Phone size={15} style={{ color: 'var(--primary-600)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase' }}>{t('schemeDetail.helpline')}</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-700)' }}>{scheme.helplineNumber}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-500)', marginTop: '0.25rem' }}>{t('schemeDetail.freeHelpline')}</div>
            </div>
          )}

          {scheme.officialUrl && (
            <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1.5px solid var(--gray-200)', borderRadius: '0.875rem', padding: '1rem 1.125rem', textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-300)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
            >
              <ExternalLink size={16} style={{ color: 'var(--primary-600)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-700)' }}>{t('schemeDetail.checkOfficial')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{scheme.officialUrl.replace('https://', '')}</div>
              </div>
            </a>
          )}

          {!isAuthenticated && (
            <div className="card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, var(--primary-700), var(--primary-800))' }}>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>{t('schemeDetail.notSignedIn.title')}</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                {t('schemeDetail.notSignedIn.desc')}
              </p>
              <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--primary-700)', width: '100%', justifyContent: 'center', fontWeight: 700 }}>
                {t('schemeDetail.notSignedIn.btn')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, icon, accent }) {
  return (
    <div style={{ background: accent ? 'var(--success-50)' : '#fff', border: `1px solid ${accent ? 'var(--success-100)' : 'var(--gray-100)'}`, borderRadius: '1rem', padding: '1.25rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: accent ? 'var(--success-600)' : 'var(--primary-600)' }}>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' },
  bodyText: { color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '0.9375rem' },
  list:     { display: 'flex', flexDirection: 'column', gap: '0.625rem' },
  listItem: { display: 'flex', gap: '0.625rem', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.6 },
  docItem:  { display: 'flex', gap: '0.625rem', alignItems: 'flex-start', padding: '0.625rem 0.75rem', background: 'var(--gray-50)', borderRadius: '0.5rem' },
};
