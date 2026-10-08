// Category display helpers
export const CATEGORY_CONFIG = {
  agriculture:          { label: 'Agriculture',         color: '#16a34a', bg: '#dcfce7', icon: '🌾' },
  education:            { label: 'Education',           color: '#2563eb', bg: '#dbeafe', icon: '📚' },
  healthcare:           { label: 'Healthcare',          color: '#dc2626', bg: '#fee2e2', icon: '🏥' },
  women_child:          { label: 'Women & Child',       color: '#db2777', bg: '#fce7f3', icon: '👩‍👧' },
  housing:              { label: 'Housing',             color: '#d97706', bg: '#fef3c7', icon: '🏠' },
  employment:           { label: 'Employment',          color: '#7c3aed', bg: '#ede9fe', icon: '💼' },
  financial_assistance: { label: 'Financial Assistance',color: '#0891b2', bg: '#cffafe', icon: '💰' },
  social_security:      { label: 'Social Security',    color: '#0f766e', bg: '#ccfbf1', icon: '🛡️' },
  skill_development:    { label: 'Skill Development',  color: '#6d28d9', bg: '#ede9fe', icon: '🎓' },
  entrepreneurship:     { label: 'Entrepreneurship',   color: '#0369a1', bg: '#e0f2fe', icon: '🚀' },
  disability:           { label: 'Disability',         color: '#b45309', bg: '#fef3c7', icon: '♿' },
  senior_citizen:       { label: 'Senior Citizen',     color: '#4f46e5', bg: '#e0e7ff', icon: '👴' },
  minority:             { label: 'Minority',           color: '#7c3aed', bg: '#ede9fe', icon: '🤝' },
  other:                { label: 'Other',              color: '#6b7280', bg: '#f3f4f6', icon: '📋' },
};

export const getCategoryConfig = (cat) =>
  CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.other;

// Application status helpers
export const STATUS_CONFIG = {
  saved:                { label: 'Saved',               color: '#6b7280', bg: '#f3f4f6' },
  interested:           { label: 'Interested',          color: '#2563eb', bg: '#dbeafe' },
  documents_pending:    { label: 'Documents Pending',   color: '#d97706', bg: '#fef3c7' },
  application_started:  { label: 'Application Started', color: '#7c3aed', bg: '#ede9fe' },
  applied:              { label: 'Applied',             color: '#0891b2', bg: '#cffafe' },
  approved:             { label: 'Approved',            color: '#16a34a', bg: '#dcfce7' },
  rejected:             { label: 'Rejected',            color: '#dc2626', bg: '#fee2e2' },
  not_applicable:       { label: 'Not Applicable',      color: '#9ca3af', bg: '#f3f4f6' },
};

export const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || STATUS_CONFIG.saved;

// Match level helpers
export const MATCH_CONFIG = {
  highly_relevant: { label: 'Highly Relevant', color: '#16a34a', bg: '#dcfce7', score: '75-100' },
  relevant:        { label: 'Relevant',         color: '#2563eb', bg: '#dbeafe', score: '50-74' },
  possibly_relevant:{ label: 'Possibly Relevant',color: '#d97706', bg: '#fef3c7', score: '25-49' },
};

export const getMatchConfig = (level) =>
  MATCH_CONFIG[level] || { label: 'Unknown', color: '#6b7280', bg: '#f3f4f6' };

// Format currency
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return 'Not specified';
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Truncate text
export const truncate = (text, length = 120) =>
  text && text.length > length ? `${text.substring(0, length)}...` : text;

// Indian states list
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];
