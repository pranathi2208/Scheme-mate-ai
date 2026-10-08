import React from 'react';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 20, md: 32, lg: 48 };
  const px = sizes[size] || sizes.md;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '2rem' }}>
      <div
        style={{
          width: px, height: px,
          border: `3px solid var(--gray-200)`,
          borderTopColor: 'var(--primary-600)',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite',
        }}
      />
      {text && <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
