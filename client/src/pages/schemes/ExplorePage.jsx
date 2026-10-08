import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { filterSchemes } from '../../services/localData';
import { getCategoryConfig } from '../../utils/helpers';
import { Search, X, ChevronRight, Star } from 'lucide-react';

const CATEGORIES = [
  'agriculture','education','healthcare','women_child','housing',
  'employment','financial_assistance','social_security','skill_development',
  'entrepreneurship','disability','senior_citizen',
];

const PAGE_SIZE = 12;

export default function ExplorePage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes,      setSchemes]      = useState([]);
  const [total,        setTotal]        = useState(0);
  const [pages,        setPages]        = useState(1);
  const [page,         setPage]         = useState(1);
  const [searchInput,  setSearchInput]  = useState(searchParams.get('q') || '');

  const activeCategory = searchParams.get('category') || '';
  const activeSearch   = searchParams.get('q') || '';

  const load = useCallback((p = 1) => {
    const result = filterSchemes({ category: activeCategory, search: activeSearch, page: p, limit: PAGE_SIZE });
    setSchemes(result.schemes);
    setTotal(result.total);
    setPages(result.pages);
    setPage(p);
  }, [activeCategory, activeSearch]);

  useEffect(() => { load(1); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (searchInput.trim()) p.set('q', searchInput.trim()); else p.delete('q');
    p.delete('category');
    setSearchParams(p);
  };

  const setCategory = (cat) => {
    const p = new URLSearchParams();
    if (cat) p.set('category', cat);
    setSearchParams(p);
    setSearchInput('');
  };

  const clearFilters = () => { setSearchParams({}); setSearchInput(''); };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('explore.title')}</h1>
        <p style={{ color: 'var(--gray-500)' }}>{t('explore.browseCount', { count: total })}</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input
            type="text" className="form-input"
            placeholder={t('explore.searchPlaceholder')}
            value={searchInput} onChange={e => setSearchInput(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ gap: '0.375rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
          <Search size={16} /> {t('explore.searchBtn')}
        </button>
        {(activeSearch || activeCategory) && (
          <button type="button" className="btn btn-ghost" onClick={clearFilters}><X size={16} /> {t('explore.clearBtn')}</button>
        )}
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <div style={{ background: '#fff', border: '1px solid var(--gray-100)', borderRadius: '1rem', padding: '1.25rem', position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('explore.category')}</h3>
            {activeCategory && (
              <button onClick={() => setCategory('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: '0.75rem' }}>{t('common.clear')}</button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button onClick={() => setCategory('')} style={{ ...catBtn, background: !activeCategory ? 'var(--primary-50)' : 'transparent', color: !activeCategory ? 'var(--primary-700)' : 'var(--gray-600)', fontWeight: !activeCategory ? 700 : 500 }}>
              {t('explore.allSchemes')}
            </button>
            {CATEGORIES.map(cat => {
              const cfg      = getCategoryConfig(cat);
              const isActive = activeCategory === cat;
              return (
                <button key={cat} onClick={() => setCategory(cat)} style={{ ...catBtn, background: isActive ? cfg.bg : 'transparent', color: isActive ? cfg.color : 'var(--gray-600)', fontWeight: isActive ? 700 : 500 }}>
                  <span>{cfg.icon}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{t('categories.' + cat)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div>
          {/* Active filters */}
          {(activeCategory || activeSearch) && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {activeCategory && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: getCategoryConfig(activeCategory).bg, color: getCategoryConfig(activeCategory).color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600 }}>
                  {getCategoryConfig(activeCategory).icon} {t('categories.' + activeCategory)}
                  <button onClick={() => setCategory('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'inherit' }}><X size={12} /></button>
                </span>
              )}
              {activeSearch && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem' }}>
                  🔍 "{activeSearch}"
                  <button onClick={clearFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'inherit' }}><X size={12} /></button>
                </span>
              )}
              <span style={{ color: 'var(--gray-400)', fontSize: '0.8125rem' }}>{total === 1 ? t('explore.result', { count: total }) : t('explore.results', { count: total })}</span>
            </div>
          )}

          {schemes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Search size={24} /></div>
              <h3>{t('explore.noResults')}</h3>
              <p>{t('explore.noResultsHint')}</p>
              <button className="btn btn-primary btn-sm" onClick={clearFilters}>{t('explore.clearFilters')}</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
                {schemes.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} />)}
              </div>
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => load(p)} style={{
                      width: 36, height: 36, borderRadius: '0.5rem', border: '1.5px solid',
                      borderColor: p === page ? 'var(--primary-500)' : 'var(--gray-200)',
                      background: p === page ? 'var(--primary-600)' : '#fff',
                      color: p === page ? '#fff' : 'var(--gray-600)',
                      cursor: 'pointer', fontWeight: p === page ? 700 : 400, fontSize: '0.875rem',
                    }}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SchemeCard({ scheme }) {
  const { t } = useTranslation();
  const cfg = getCategoryConfig(scheme.category);
  return (
    <Link
      to={`/schemes/${scheme.slug || scheme.id}`}
      style={{ display: 'block', textDecoration: 'none', background: '#fff', border: '1.5px solid var(--gray-100)', borderRadius: '1.125rem', padding: '1.25rem', transition: 'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ background: cfg.bg, color: cfg.color, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
          {cfg.icon} {t('categories.' + scheme.category)}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
          {scheme.fundingType === 'central' ? t('explore.fundingCentral') : scheme.fundingType === 'state' ? t('explore.fundingState') : t('explore.fundingBoth')}
        </span>
      </div>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.4, marginBottom: '0.5rem' }}>{scheme.name}</h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
        {scheme.shortDescription?.substring(0, 100)}...
      </p>
      {scheme.mainBenefit && (
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--success-700)', background: 'var(--success-50)', padding: '0.375rem 0.625rem', borderRadius: '0.5rem', marginBottom: '0.75rem' }}>
          <Star size={11} style={{ color: 'var(--success-600)', flexShrink: 0 }} />
          {scheme.mainBenefit?.substring(0, 55)}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-600)', fontSize: '0.8125rem', fontWeight: 600 }}>
        {t('explore.viewDetails')} <ChevronRight size={14} />
      </div>
    </Link>
  );
}

const catBtn = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.5rem 0.75rem', borderRadius: '0.625rem',
  border: 'none', cursor: 'pointer', width: '100%',
  fontSize: '0.8125rem', transition: 'all 0.1s',
};
