import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.25rem', padding: '3rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', lineHeight: 1 }}>🔍</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>{t('notFound.title')}</h1>
      <p style={{ color: 'var(--gray-500)', maxWidth: 400, lineHeight: 1.7 }}>
        {t('notFound.desc')}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to="/" className="btn btn-primary">{t('notFound.home')}</Link>
        <Link to="/explore" className="btn btn-secondary">{t('notFound.explore')}</Link>
      </div>
    </div>
  );
}
