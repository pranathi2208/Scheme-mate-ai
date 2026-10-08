import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { matchService, savedService, profileService } from '../../services/localData';
import { getCategoryConfig, getMatchConfig } from '../../utils/helpers';
import toast from 'react-hot-toast';
import {
  BookMarked, ChevronRight, Info, Star, AlertCircle,
  Sparkles, RefreshCw,
} from 'lucide-react';

const TABS = [
  { id: 'all',               labelKey: 'mySchemes.tabs.all' },
  { id: 'highly_relevant',   labelKey: 'mySchemes.tabs.highlyRelevant' },
  { id: 'relevant',          labelKey: 'mySchemes.tabs.relevant' },
  { id: 'possibly_relevant', labelKey: 'mySchemes.tabs.possiblyRelevant' },
];

export default function MySchemes() {
  const { t } = useTranslation();
  const { profileComplete } = useAuth();
  const [data,      setData]      = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [savedIds,  setSavedIds]  = useState(new Set());
  const [savingId,  setSavingId]  = useState(null);

  useEffect(() => {
    if (!profileComplete) return;
    const profile = profileService.get();
    const result  = matchService.getMatches(profile);
    setData(result);
    const saved = savedService.getAll();
    setSavedIds(new Set(saved.map(e => e.schemeId)));
  }, [profileComplete]);

  const handleSave = (scheme) => {
    if (savedIds.has(scheme.id || scheme.slug)) {
      toast(t('mySchemes.alreadySaved'), { icon: '📌' });
      return;
    }
    setSavingId(scheme.id);
    savedService.save(scheme.id || scheme.slug, {
      matchScore:   scheme.matchScore,
      matchLevel:   scheme.matchLevel,
      matchReasons: scheme.matchReasons,
    });
    setSavedIds(prev => new Set([...prev, scheme.id || scheme.slug]));
    toast.success(t('mySchemes.savedToast'));
    setSavingId(null);
  };

  if (!profileComplete) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>🎯</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>{t('mySchemes.completeProfile.title')}</h2>
        <p style={{ color: 'var(--gray-500)', maxWidth: 440, margin: '0 auto 1.5rem' }}>
          {t('mySchemes.completeProfile.desc')}
        </p>
        <Link to="/onboarding" className="btn btn-primary btn-lg">{t('mySchemes.completeProfile.btn')} <ChevronRight size={18} /></Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <AlertCircle size={40} style={{ color: 'var(--error-500)', margin: '0 auto 1rem' }} />
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('mySchemes.errorTitle')}</h3>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          <RefreshCw size={16} /> {t('mySchemes.tryAgain')}
        </button>
      </div>
    );
  }

  const { results, total, disclaimer } = data;
  const schemes =
    activeTab === 'all'              ? results.all :
    activeTab === 'highly_relevant'  ? results.highlyRelevant :
    activeTab === 'relevant'         ? results.relevant :
    results.possiblyRelevant;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t('mySchemes.title')}</h1>
            <p style={{ color: 'var(--gray-500)' }}>{t('mySchemes.subtitle', { count: total })}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/saved-schemes" className="btn btn-secondary btn-sm"><BookMarked size={14} /> {t('mySchemes.savedSchemes')}</Link>
            <Link to="/onboarding"    className="btn btn-ghost btn-sm">{t('mySchemes.editProfile')}</Link>
          </div>
        </div>
        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.8125rem' }}>
            <strong>{t('mySchemes.important')}:</strong> {disclaimer}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: t('mySchemes.stats.highlyRelevant'),   count: results.highlyRelevant.length,   color: 'var(--success-600)', bg: '#dcfce7', icon: '⭐' },
          { label: t('mySchemes.stats.relevant'),          count: results.relevant.length,          color: 'var(--primary-600)', bg: 'var(--primary-50)', icon: '✅' },
          { label: t('mySchemes.stats.possiblyRelevant'), count: results.possiblyRelevant.length,  color: 'var(--accent-500)', bg: 'var(--warning-50)', icon: '🔍' },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: '1rem', padding: '1rem 1.25rem', border: `1px solid ${stat.color}20` }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.count}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', fontWeight: 500 }}>{stat.icon} {stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--gray-200)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {TABS.map(tab => {
          const count =
            tab.id === 'all'              ? total :
            tab.id === 'highly_relevant'  ? results.highlyRelevant.length :
            tab.id === 'relevant'         ? results.relevant.length :
            results.possiblyRelevant.length;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '0.625rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap',
              color: activeTab === tab.id ? 'var(--primary-600)' : 'var(--gray-500)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary-600)' : '2px solid transparent',
              marginBottom: -2, transition: 'all 0.15s',
            }}>
              {t(tab.labelKey)}{' '}
              <span style={{ background: 'var(--gray-100)', borderRadius: '9999px', padding: '0 0.4rem', fontSize: '0.75rem' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {!schemes?.length ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Sparkles size={24} /></div>
          <h3>{t('mySchemes.noSchemes')}</h3>
          <p>{t('mySchemes.noSchemesHint')}</p>
          <Link to="/explore" className="btn btn-primary btn-sm">{t('mySchemes.exploreAll')}</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {schemes.map(scheme => (
            <SchemeCard
              key={scheme.id || scheme.slug}
              scheme={scheme}
              isSaved={savedIds.has(scheme.id || scheme.slug)}
              isSaving={savingId === scheme.id}
              onSave={() => handleSave(scheme)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SchemeCard({ scheme, isSaved, isSaving, onSave }) {
  const { t } = useTranslation();
  const catCfg   = getCategoryConfig(scheme.category);
  const matchCfg = getMatchConfig(scheme.matchLevel);
  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ background: catCfg.bg, color: catCfg.color, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
          {catCfg.icon} {t(`categories.${scheme.category}`)}
        </span>
        <span style={{ background: matchCfg.bg, color: matchCfg.color, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
          {t(`matchLevels.${scheme.matchLevel}`)}
        </span>
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.4 }}>{scheme.name}</h3>
      <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>{scheme.department}</div>
      <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
        {scheme.shortDescription?.substring(0, 110)}...
      </p>
      {scheme.mainBenefit && (
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--success-50)', padding: '0.5rem 0.75rem', borderRadius: '0.625rem', alignItems: 'center' }}>
          <Star size={13} style={{ color: 'var(--success-600)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.8125rem', color: 'var(--success-700)', fontWeight: 500 }}>{scheme.mainBenefit?.substring(0, 70)}</span>
        </div>
      )}
      {scheme.matchReasons?.length > 0 && (
        <div style={{ background: 'var(--primary-50)', borderRadius: '0.625rem', padding: '0.625rem 0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 700, marginBottom: '0.375rem' }}>
            <Info size={12} style={{ display: 'inline', marginRight: 4 }} />
            {t('mySchemes.whyRecommended')}
          </div>
          {scheme.matchReasons.slice(0, 2).map((r, i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: 'var(--primary-700)', lineHeight: 1.5 }}>• {r}</div>
          ))}
        </div>
      )}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{t('mySchemes.matchScore')}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: matchCfg.color }}>{scheme.matchScore}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${scheme.matchScore}%`, background: matchCfg.color }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.625rem', marginTop: 'auto', paddingTop: '0.25rem' }}>
        <Link to={`/schemes/${scheme.slug || scheme.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
          {t('mySchemes.viewDetails')} <ChevronRight size={14} />
        </Link>
        <button
          className={`btn btn-sm ${isSaved ? 'btn-ghost' : 'btn-secondary'}`}
          onClick={onSave} disabled={isSaving || isSaved} style={{ gap: '0.3rem' }}
        >
          <BookMarked size={14} />
          {isSaved ? t('mySchemes.saved') : isSaving ? '...' : t('mySchemes.save')}
        </button>
      </div>
    </div>
  );
}
