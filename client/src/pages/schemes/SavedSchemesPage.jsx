import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { savedService } from '../../services/localData';
import { getCategoryConfig, getStatusConfig } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { BookMarked, Trash2, ChevronRight, ExternalLink } from 'lucide-react';

const STATUSES = [
  '',
  'saved',
  'interested',
  'documents_pending',
  'application_started',
  'applied',
  'approved',
  'rejected',
];

export default function SavedSchemesPage() {
  const { t } = useTranslation();
  const [entries,      setEntries]      = useState([]);
  const [filterStatus, setFilterStatus] = useState('');

  const statusLabel = (value) => value ? t(`saved.status.${value}`) : t('saved.status.all');

  const load = () => {
    setEntries(savedService.getAll(filterStatus || undefined));
  };

  useEffect(() => { load(); }, [filterStatus]);

  const handleUnsave = (schemeId, schemeName) => {
    if (!confirm(t('saved.removeConfirm', { name: schemeName }))) return;
    savedService.unsave(schemeId);
    setEntries(prev => prev.filter(e => e.schemeId !== schemeId));
    toast.success(t('saved.removeToast'));
  };

  const handleStatusChange = (schemeId, newStatus) => {
    savedService.updateStatus(schemeId, newStatus);
    setEntries(prev => prev.map(e => e.schemeId === schemeId ? { ...e, applicationStatus: newStatus } : e));
    toast.success(t('saved.statusToast'));
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t('saved.title')}</h1>
          <p style={{ color: 'var(--gray-500)' }}>{entries.length === 1 ? t('saved.count', { count: entries.length }) : t('saved.countPlural', { count: entries.length })}</p>
        </div>
        <Link to="/my-schemes" className="btn btn-primary btn-sm">{t('saved.viewNew')}</Link>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {STATUSES.map(st => (
          <button key={st || 'all'} onClick={() => setFilterStatus(st)} style={{
            padding: '0.35rem 0.875rem', borderRadius: '9999px', border: '1.5px solid',
            borderColor: filterStatus === st ? 'var(--primary-400)' : 'var(--gray-200)',
            background: filterStatus === st ? 'var(--primary-50)' : '#fff',
            color: filterStatus === st ? 'var(--primary-700)' : 'var(--gray-600)',
            fontSize: '0.8125rem', fontWeight: filterStatus === st ? 700 : 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {statusLabel(st)}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><BookMarked size={24} /></div>
          <h3>{filterStatus ? t('saved.emptyFiltered') : t('saved.empty')}</h3>
          <p>{t('saved.emptyHint')}</p>
          <Link to="/my-schemes" className="btn btn-primary btn-sm">{t('saved.findSchemes')}</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.map(entry => {
            const scheme = entry.scheme;
            if (!scheme) return null;
            const catCfg    = getCategoryConfig(scheme.category);
            const statusCfg = getStatusConfig(entry.applicationStatus);
            return (
              <div key={entry.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Scheme info */}
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                      <span style={{ background: catCfg.bg, color: catCfg.color, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {catCfg.icon} {t('categories.' + scheme.category)}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem', color: 'var(--gray-900)' }}>
                      {scheme.name}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                      {scheme.mainBenefit || scheme.shortDescription}
                    </p>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                      <Link to={`/schemes/${scheme.slug || scheme.id}`} className="btn btn-secondary btn-sm">
                        {t('saved.viewDetails')} <ChevronRight size={12} />
                      </Link>
                      {scheme.officialUrl && (
                        <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                          {t('saved.officialSite')} <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Status controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 200 }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>
                        {t('saved.applicationStatus')}
                      </label>
                      <select
                        className="form-select"
                        value={entry.applicationStatus}
                        onChange={e => handleStatusChange(entry.schemeId, e.target.value)}
                        style={{ background: statusCfg.bg, color: statusCfg.color, fontWeight: 600, fontSize: '0.8125rem', border: `1.5px solid ${statusCfg.color}30` }}
                      >
                        {STATUSES.filter(st => st).map(st => (
                          <option key={st} value={st}>{statusLabel(st)}</option>
                        ))}
                      </select>
                    </div>

                    {entry.matchLevel && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {t('saved.match')}: <strong style={{ color: entry.matchLevel === 'highly_relevant' ? 'var(--success-600)' : 'var(--primary-600)' }}>
                          {entry.matchLevel.replace(/_/g, ' ')}
                        </strong>
                        {entry.matchScore && ` (${entry.matchScore}%)`}
                      </div>
                    )}

                    <button
                      onClick={() => handleUnsave(entry.schemeId, scheme.name)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--error-500)', gap: '0.375rem', justifyContent: 'flex-start' }}
                    >
                      <Trash2 size={13} /> {t('saved.remove')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
