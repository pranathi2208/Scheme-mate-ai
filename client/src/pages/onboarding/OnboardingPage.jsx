import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/localData';
import { INDIAN_STATES } from '../../utils/helpers';
import { getDistricts } from '../../data/districts';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft, Check, User, MapPin, Briefcase, Star, Eye } from 'lucide-react';

const TOTAL_STEPS = 5;
const STEPS = [
  { id: 1, titleKey: 'steps.personal',    descKey: 'steps.personalDesc',    icon: User      },
  { id: 2, titleKey: 'steps.location',    descKey: 'steps.locationDesc',     icon: MapPin    },
  { id: 3, titleKey: 'steps.occupation', descKey: 'steps.occupationDesc', icon: Briefcase },
  { id: 4, titleKey: 'steps.special',    descKey: 'steps.specialDesc',      icon: Star      },
  { id: 5, titleKey: 'steps.review',     descKey: 'steps.reviewDesc',       icon: Eye       },
];

const EMPTY_PROFILE = {
  age: '', gender: '', state: '', district: '', areaType: '',
  occupation: '', annualIncome: '', familySize: '',
  category: '', isFarmer: false, isStudent: false,
  isSeniorCitizen: false, hasDisability: false, disabilityType: '',
  isWidow: false, isBPL: false, educationLevel: '', landOwnership: '',
};

export default function OnboardingPage() {
  const { t } = useTranslation();
  const { updateProfileComplete } = useAuth();
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [saving, setSaving]   = useState(false);
  const [profile, setProfile] = useState(EMPTY_PROFILE);

  useEffect(() => {
    const existing = profileService.get();
    if (existing) {
      setProfile(prev => ({
        ...prev,
        age: existing.age || '', gender: existing.gender || '',
        state: existing.state || '', district: existing.district || '',
        areaType: existing.areaType || '', occupation: existing.occupation || '',
        annualIncome: existing.annualIncome || '', familySize: existing.familySize || '',
        category: existing.category || '', isFarmer: existing.isFarmer || false,
        isStudent: existing.isStudent || false, isSeniorCitizen: existing.isSeniorCitizen || false,
        hasDisability: existing.hasDisability || false, disabilityType: existing.disabilityType || '',
        isWidow: existing.isWidow || false, isBPL: existing.isBPL || false,
        educationLevel: existing.educationLevel || '', landOwnership: existing.landOwnership || '',
      }));
    }
  }, []);

  const set = (field, value) => setProfile(p => ({ ...p, [field]: value }));

  // When state changes, clear district if it's not in the new state's list
  const handleStateChange = (newState) => {
    const districts = getDistricts(newState);
    if (profile.district && !districts.includes(profile.district)) {
      setProfile(p => ({ ...p, state: newState, district: '' }));
    } else {
      set('state', newState);
    }
  };

  const next = () => {
    profileService.save({ ...profile, completionStep: step + 1 });
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  };
  const back = () => { if (step > 1) setStep(s => s - 1); };

  const submit = () => {
    setSaving(true);
    try {
      profileService.save({ ...profile, completionStep: TOTAL_STEPS });
      updateProfileComplete(true);
      toast.success(t('onboarding.savingToast'));
      navigate('/my-schemes');
    } catch {
      toast.error(t('onboarding.saveError'));
    } finally { setSaving(false); }
  };

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div style={s.wrapper}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarBrand}>
          <div style={s.sidebarLogo}>SM</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#fff' }}>{t('onboarding.brandTitle')}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{t('onboarding.stepLabel', { current: step, total: TOTAL_STEPS, title: t(`onboarding.${STEPS[step - 1].titleKey}`) }).split(':')[0]}</div>
          </div>
        </div>
        <div style={s.stepsList}>
          {STEPS.map(st => {
            const Icon = st.icon;
            const done = step > st.id;
            const active = step === st.id;
            return (
              <div key={st.id} style={{ ...s.stepItem, ...(active ? s.stepItemActive : {}), ...(done ? s.stepItemDone : {}) }}>
                <div style={{ ...s.stepIconWrap, ...(active ? s.stepIconActive : {}), ...(done ? s.stepIconDone : {}) }}>
                  {done ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: active || done ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                    {t(`onboarding.${st.titleKey}`)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{t(`onboarding.${st.descKey}`)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        <div style={{ padding: '1.5rem 2rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500 }}>
              {t('onboarding.stepLabel', { current: step, total: TOTAL_STEPS, title: t(`onboarding.${STEPS[step - 1].titleKey}`) })}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: 600 }}>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
        </div>

        <div style={s.formArea}>
          {step === 1 && <StepPersonal  t={t} profile={profile} set={set} />}
          {step === 2 && <StepLocation  t={t} profile={profile} set={set} onStateChange={handleStateChange} />}
          {step === 3 && <StepOccupation t={t} profile={profile} set={set} />}
          {step === 4 && <StepSpecial   t={t} profile={profile} set={set} />}
          {step === 5 && <StepReview    t={t} profile={profile} />}
        </div>

        <div style={s.navRow}>
          {step > 1
            ? <button className="btn btn-secondary" onClick={back} disabled={saving}><ChevronLeft size={16} /> {t('onboarding.back')}</button>
            : <div />}
          {step < TOTAL_STEPS
            ? <button className="btn btn-primary" onClick={next} disabled={saving}>{t('onboarding.next')} <ChevronRight size={16} /></button>
            : <button className="btn btn-primary" onClick={submit} disabled={saving} style={{ minWidth: 160 }}>
                {saving ? t('onboarding.saving') : t('onboarding.submit')}
              </button>}
        </div>
      </div>
    </div>
  );
}

/* ── Step components ─────────────────────────────────────────── */

function StepPersonal({ t, profile, set }) {
  return (
    <div style={fs.container}>
      <h2 style={fs.title}>{t('onboarding.personal.title')}</h2>
      <p style={fs.subtitle}>{t('onboarding.personal.subtitle')}</p>
      <div style={fs.grid}>
        <div className="form-group">
          <label className="form-label">{t('onboarding.personal.age')} <span className="required">*</span></label>
          <input type="number" className="form-input" placeholder="e.g. 35" min="1" max="120"
            value={profile.age} onChange={e => set('age', parseInt(e.target.value) || '')} />
          <span className="form-hint">{t('onboarding.personal.ageHint')}</span>
        </div>
        <div className="form-group">
          <label className="form-label">{t('onboarding.personal.gender')} <span className="required">*</span></label>
          <select className="form-select" value={profile.gender} onChange={e => set('gender', e.target.value)}>
            <option value="">{t('common.selectGender')}</option>
            <option value="male">{t('onboarding.gender.male')}</option>
            <option value="female">{t('onboarding.gender.female')}</option>
            <option value="other">{t('onboarding.gender.other')}</option>
            <option value="prefer_not_to_say">{t('onboarding.gender.preferNotToSay')}</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t('onboarding.personal.education')}</label>
          <select className="form-select" value={profile.educationLevel} onChange={e => set('educationLevel', e.target.value)}>
            <option value="">{t('common.selectLevel')}</option>
            <option value="no_formal_education">{t('onboarding.education.no_formal_education')}</option>
            <option value="primary">{t('onboarding.education.primary')}</option>
            <option value="middle">{t('onboarding.education.middle')}</option>
            <option value="secondary">{t('onboarding.education.secondary')}</option>
            <option value="higher_secondary">{t('onboarding.education.higher_secondary')}</option>
            <option value="graduate">{t('onboarding.education.graduate')}</option>
            <option value="post_graduate">{t('onboarding.education.post_graduate')}</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t('onboarding.personal.category')}</label>
          <select className="form-select" value={profile.category} onChange={e => set('category', e.target.value)}>
            <option value="">{t('common.selectCategory')}</option>
            <option value="general">{t('onboarding.category.general')}</option>
            <option value="obc">{t('onboarding.category.obc')}</option>
            <option value="sc">{t('onboarding.category.sc')}</option>
            <option value="st">{t('onboarding.category.st')}</option>
            <option value="ews">{t('onboarding.category.ews')}</option>
            <option value="prefer_not_to_say">{t('onboarding.category.prefer_not_to_say')}</option>
          </select>
          <span className="form-hint">{t('onboarding.personal.categoryHint')}</span>
        </div>
      </div>
    </div>
  );
}

function StepLocation({ t, profile, set, onStateChange }) {
  // Memoize districts for the selected state
  const districts = useMemo(() => getDistricts(profile.state), [profile.state]);

  return (
    <div style={fs.container}>
      <h2 style={fs.title}>{t('onboarding.location.title')}</h2>
      <p style={fs.subtitle}>{t('onboarding.location.subtitle')}</p>
      <div style={fs.grid}>
        <div className="form-group">
          <label className="form-label">{t('onboarding.location.state')} <span className="required">*</span></label>
          <select className="form-select" value={profile.state} onChange={e => onStateChange(e.target.value)}>
            <option value="">{t('common.selectState')}</option>
            {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t('onboarding.location.district')}</label>
          {profile.state ? (
            <select className="form-select" value={profile.district} onChange={e => set('district', e.target.value)}>
              <option value="">{t('onboarding.location.districtSelect')}</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          ) : (
            <select className="form-select" disabled>
              <option value="">{t('onboarding.location.districtHint')}</option>
            </select>
          )}
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">{t('onboarding.location.areaType')} <span className="required">*</span></label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.25rem' }}>
            {[
              { val: 'rural',      labelKey: 'area.rural',      descKey: 'area.ruralDesc'      },
              { val: 'semi_urban', labelKey: 'area.semi_urban', descKey: 'area.semi_urbanDesc' },
              { val: 'urban',      labelKey: 'area.urban',      descKey: 'area.urbanDesc'      },
            ].map(opt => (
              <button key={opt.val} type="button"
                onClick={() => set('areaType', opt.val)}
                style={{
                  padding: '1rem', borderRadius: '0.875rem',
                  border: `1.5px solid ${profile.areaType === opt.val ? 'var(--primary-500)' : 'var(--gray-200)'}`,
                  background: profile.areaType === opt.val ? 'var(--primary-50)' : '#fff',
                  cursor: 'pointer', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                  transition: 'all 0.15s',
                }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t(`onboarding.${opt.labelKey}`)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>{t(`onboarding.${opt.descKey}`)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepOccupation({ t, profile, set }) {
  const OCC_KEYS = ['farmer','agricultural_laborer','self_employed','salaried','daily_wage_worker','student','homemaker','unemployed','retired','business_owner','other'];
  return (
    <div style={fs.container}>
      <h2 style={fs.title}>{t('onboarding.occupation.title')}</h2>
      <p style={fs.subtitle}>{t('onboarding.occupation.subtitle')}</p>
      <div style={fs.grid}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">{t('onboarding.occupation.label')} <span className="required">*</span></label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.625rem', marginTop: '0.25rem' }}>
            {OCC_KEYS.map(key => (
              <button key={key} type="button"
                onClick={() => set('occupation', key)}
                style={{
                  padding: '0.625rem 0.875rem', borderRadius: '0.625rem',
                  border: `1.5px solid ${profile.occupation === key ? 'var(--primary-500)' : 'var(--gray-200)'}`,
                  background: profile.occupation === key ? 'var(--primary-50)' : '#fff',
                  color: profile.occupation === key ? 'var(--primary-700)' : 'var(--gray-700)',
                  fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.15s',
                }}>
                {t(`onboarding.occupationOptions.${key}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('onboarding.occupation.income')} <span className="required">*</span></label>
          <input type="number" className="form-input" placeholder="e.g. 120000" min="0"
            value={profile.annualIncome} onChange={e => set('annualIncome', parseInt(e.target.value) || '')} />
          <span className="form-hint">{t('onboarding.occupation.incomeHint')}</span>
        </div>
        <div className="form-group">
          <label className="form-label">{t('onboarding.occupation.familySize')}</label>
          <select className="form-select" value={profile.familySize} onChange={e => set('familySize', parseInt(e.target.value) || '')}>
            <option value="">{t('onboarding.occupation.selectFamily')}</option>
            {[1,2,3,4,5,6,7,8].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? t('onboarding.occupation.familyPerson') : t('onboarding.occupation.familyPeople')}</option>
            ))}
            <option value="9">{t('onboarding.occupation.family9plus')}</option>
          </select>
        </div>
        {(profile.occupation === 'farmer' || profile.occupation === 'agricultural_laborer') && (
          <div className="form-group">
            <label className="form-label">{t('onboarding.occupation.land')}</label>
            <select className="form-select" value={profile.landOwnership} onChange={e => set('landOwnership', e.target.value)}>
              <option value="">{t('onboarding.occupation.select')}</option>
              <option value="no_land">{t('onboarding.land.no_land')}</option>
              <option value="less_than_2_acres">{t('onboarding.land.less_than_2_acres')}</option>
              <option value="2_to_5_acres">{t('onboarding.land.2_to_5_acres')}</option>
              <option value="more_than_5_acres">{t('onboarding.land.more_than_5_acres')}</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

function StepSpecial({ t, profile, set }) {
  const FLAGS = [
    { key: 'isFarmer',        labelKey: 'special.farmer',     descKey: 'special.farmerDesc'     },
    { key: 'isStudent',       labelKey: 'special.student',    descKey: 'special.studentDesc'    },
    { key: 'isSeniorCitizen', labelKey: 'special.senior',     descKey: 'special.seniorDesc'     },
    { key: 'hasDisability',   labelKey: 'special.disability', descKey: 'special.disabilityDesc' },
    { key: 'isWidow',         labelKey: 'special.widow',      descKey: 'special.widowDesc'      },
    { key: 'isBPL',           labelKey: 'special.bpl',        descKey: 'special.bplDesc'        },
  ];
  return (
    <div style={fs.container}>
      <h2 style={fs.title}>{t('onboarding.special.title')}</h2>
      <p style={fs.subtitle}>{t('onboarding.special.subtitle')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {FLAGS.map(flag => (
          <label key={flag.key} style={{
            display: 'flex', alignItems: 'flex-start', gap: '1rem',
            padding: '1rem', borderRadius: '0.875rem', cursor: 'pointer',
            border: `1.5px solid ${profile[flag.key] ? 'var(--primary-300)' : 'var(--gray-200)'}`,
            background: profile[flag.key] ? 'var(--primary-50)' : '#fff', transition: 'all 0.15s',
          }}>
            <div style={{ marginTop: '0.1rem' }}>
              <input type="checkbox" className="form-checkbox"
                checked={profile[flag.key] || false} onChange={e => set(flag.key, e.target.checked)} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--gray-800)' }}>{t(`onboarding.${flag.labelKey}`)}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.125rem' }}>{t(`onboarding.${flag.descKey}`)}</div>
            </div>
          </label>
        ))}
        {profile.hasDisability && (
          <div className="form-group" style={{ marginLeft: '0.5rem' }}>
            <label className="form-label">{t('onboarding.special.disabilityType')}</label>
            <input type="text" className="form-input" placeholder={t('onboarding.special.disabilityPlaceholder')}
              value={profile.disabilityType} onChange={e => set('disabilityType', e.target.value)} />
          </div>
        )}
      </div>
    </div>
  );
}

function StepReview({ t, profile }) {
  const rows = [
    [t('onboarding.review.age'),        profile.age ? `${profile.age} ${t('profile.yearsOld')}` : t('onboarding.review.notProvided')],
    [t('onboarding.review.gender'),     profile.gender === 'prefer_not_to_say' ? t('onboarding.gender.preferNotToSay') : (profile.gender ? t(`onboarding.gender.${profile.gender}`) : t('onboarding.review.notProvided'))],
    [t('onboarding.review.state'),      profile.state || t('onboarding.review.notProvided')],
    [t('onboarding.review.district'),   profile.district || t('onboarding.review.notProvided')],
    [t('onboarding.review.areaType'),   profile.areaType ? t(`onboarding.area.${profile.areaType}`) : t('onboarding.review.notProvided')],
    [t('onboarding.review.occupation'), profile.occupation ? t(`onboarding.occupationOptions.${profile.occupation}`) : t('onboarding.review.notProvided')],
    [t('onboarding.review.income'),     profile.annualIncome ? `₹${parseInt(profile.annualIncome).toLocaleString('en-IN')} ${t('onboarding.review.perYear')}` : t('onboarding.review.notProvided')],
    [t('onboarding.review.familySize'), profile.familySize ? `${profile.familySize} ${t('onboarding.occupation.familyPeople')}` : t('onboarding.review.notProvided')],
    [t('onboarding.review.category'),   profile.category ? t(`onboarding.category.${profile.category}`) : t('onboarding.review.notProvided')],
  ];
  const activeFlags = [
    profile.isFarmer        && `🌾 ${t('onboarding.special.farmer')}`,
    profile.isStudent       && `📚 ${t('onboarding.special.student')}`,
    profile.isSeniorCitizen && `👴 ${t('onboarding.special.senior')}`,
    profile.hasDisability   && `♿ ${t('onboarding.special.disability')}`,
    profile.isWidow         && `🕊️ ${t('onboarding.special.widow')}`,
    profile.isBPL           && `📄 ${t('onboarding.special.bpl')}`,
  ].filter(Boolean);

  return (
    <div style={fs.container}>
      <h2 style={fs.title}>{t('onboarding.review.title')}</h2>
      <p style={fs.subtitle}>{t('onboarding.review.subtitle')}</p>
      <div style={{ background: 'var(--gray-50)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--gray-200)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {rows.map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
              <div style={{ fontSize: '0.9375rem', color: value === t('onboarding.review.notProvided') ? 'var(--gray-400)' : 'var(--gray-800)', fontWeight: 500, marginTop: '0.125rem' }}>{value}</div>
            </div>
          ))}
        </div>
        {activeFlags.length > 0 && (
          <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>{t('onboarding.review.specialStatus')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {activeFlags.map(f => <span key={f} style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600 }}>{f}</span>)}
            </div>
          </div>
        )}
      </div>
      <div className="alert alert-info" style={{ marginTop: '1.25rem' }}>
        <span>ℹ️</span><span>{t('onboarding.review.info')}</span>
      </div>
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */
const s = {
  wrapper: { minHeight: 'calc(100vh - var(--nav-height))', display: 'grid', gridTemplateColumns: '260px 1fr', background: '#fff' },
  sidebar: { background: 'linear-gradient(180deg, var(--primary-800), var(--primary-900))', padding: '1.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '2rem' },
  sidebarBrand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  sidebarLogo: { width: 38, height: 38, borderRadius: '0.625rem', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem' },
  stepsList: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '0.75rem' },
  stepItemActive: { background: 'rgba(255,255,255,0.1)' },
  stepIconWrap: { width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', flexShrink: 0 },
  stepIconActive: { background: 'var(--primary-400)', color: '#fff' },
  stepIconDone: { background: 'var(--success-600)', color: '#fff' },
  main: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  formArea: { flex: 1, overflowY: 'auto', padding: '1.75rem 2rem 1.5rem', maxWidth: 680, width: '100%' },
  navRow: { padding: '1.25rem 2rem', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' },
};
const fs = {
  container: { padding: '0.5rem' },
  title: { fontSize: '1.375rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.375rem' },
  subtitle: { color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.75rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
};
