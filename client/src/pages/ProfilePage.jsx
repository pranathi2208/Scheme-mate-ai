import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/localData';
import { Edit, CheckCircle, User, MapPin, Briefcase } from 'lucide-react';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(profileService.get());
  }, []);

  const flags = [
    profile?.isFarmer        && '🌾 Farmer',
    profile?.isStudent       && '📚 Student',
    profile?.isSeniorCitizen && '👴 Senior Citizen',
    profile?.hasDisability   && '♿ Person with Disability',
    profile?.isWidow         && '🕊️ Widow',
    profile?.isBPL           && '📄 BPL Card Holder',
  ].filter(Boolean);

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('profile.title')}</h1>
          <p style={{ color: 'var(--gray-500)' }}>{t('profile.subtitle')}</p>
        </div>
        <Link to="/onboarding" className="btn btn-primary btn-sm">
          <Edit size={14} /> {t('profile.updateProfile')}
        </Link>
      </div>

      {/* Account */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={16} style={{ color: 'var(--primary-600)' }} /> {t('profile.accountDetails')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            [t('profile.name'),     user?.name],
            [t('profile.email'),    user?.email],
            [t('profile.phone'),    user?.phone || t('profile.notProvided')],
            [t('profile.language'), user?.preferredLanguage?.toUpperCase() || 'EN'],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
              <div style={{ fontSize: '0.9375rem', color: 'var(--gray-800)', fontWeight: 500, marginTop: '0.125rem' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {profile && (
        <>
          {/* Location & Personal */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary-600)' }} /> {t('profile.locationPersonal')}
              </h2>
              {profile.isComplete && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--success-600)', fontSize: '0.8125rem', fontWeight: 600 }}>
                  <CheckCircle size={14} /> {t('profile.complete')}
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {[
                [t('profile.age'),        profile.age ? `${profile.age} ${t('profile.yearsOld')}` : t('profile.notProvided')],
                [t('profile.gender'),     profile.gender ? t('onboarding.gender.' + profile.gender) : t('profile.notProvided')],
                [t('profile.state'),      profile.state  || t('profile.notProvided')],
                [t('profile.district'),   profile.district || t('profile.notProvided')],
                [t('profile.areaType'),   profile.areaType ? t('onboarding.area.' + profile.areaType) : t('profile.notProvided')],
                [t('profile.category'),   profile.category ? t('onboarding.category.' + profile.category) : t('profile.notProvided')],
                [t('profile.education'),  profile.educationLevel ? t('onboarding.education.' + profile.educationLevel) : t('profile.notProvided')],
                [t('profile.familySize'), profile.familySize ? `${profile.familySize} ${t('profile.people')}` : t('profile.notProvided')],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                  <div style={{ fontSize: '0.875rem', color: value === t('profile.notProvided') ? 'var(--gray-300)' : 'var(--gray-800)', fontWeight: 500, marginTop: '0.125rem' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Occupation & Income */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={16} style={{ color: 'var(--primary-600)' }} /> {t('profile.occupationIncome')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {[
                [t('profile.occupation'),     profile.occupation ? t('onboarding.occupationOptions.' + profile.occupation) : t('profile.notProvided')],
                [t('profile.annualIncome'),  profile.annualIncome ? `₹${parseInt(profile.annualIncome).toLocaleString('en-IN')}` : t('profile.notProvided')],
                [t('profile.landOwnership'), profile.landOwnership ? t('onboarding.land.' + profile.landOwnership) : t('profile.notProvided')],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                  <div style={{ fontSize: '0.875rem', color: value === t('profile.notProvided') ? 'var(--gray-300)' : 'var(--gray-800)', fontWeight: 500, marginTop: '0.125rem' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {flags.length > 0 && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>{t('profile.specialStatus')}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {flags.map(f => (
                  <span key={f} style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '0.35rem 0.875rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600 }}>{f}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!profile && (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
          <span>ℹ️</span>
          <span>{t('profile.notSetUp')}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to="/my-schemes"  className="btn btn-primary">{t('profile.viewMatches')}</Link>
        <Link to="/onboarding"  className="btn btn-secondary">{t('profile.updateProfile')}</Link>
      </div>
    </div>
  );
}
