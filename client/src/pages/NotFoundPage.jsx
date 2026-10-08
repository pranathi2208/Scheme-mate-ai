import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.25rem', padding: '3rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', lineHeight: 1 }}>🔍</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>Page not found</h1>
      <p style={{ color: 'var(--gray-500)', maxWidth: 400, lineHeight: 1.7 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/explore" className="btn btn-secondary">Explore Schemes</Link>
      </div>
    </div>
  );
}
