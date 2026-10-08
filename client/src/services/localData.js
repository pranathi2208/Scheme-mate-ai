/**
 * localStorage-based data service — replaces all backend API calls.
 * Keys used:
 *   sm_profile       — user's onboarding profile object
 *   sm_saved         — array of saved scheme entries
 */

import {
  getAllSchemes,
  getSchemeById,
  getFeaturedSchemes,
  filterSchemes,
  createScheme,
  updateScheme,
  deleteScheme,
  resetSchemes,
} from '../data/schemes';

// ── Storage keys ─────────────────────────────────────────────
const PROFILE_KEY = 'sm_profile';
const SAVED_KEY   = 'sm_saved';

// ── Profile ──────────────────────────────────────────────────
export const profileService = {
  get() {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null; }
    catch { return null; }
  },

  save(profileData) {
    const existing = this.get() || {};
    const merged = { ...existing, ...profileData };
    // compute isComplete
    merged.isComplete = !!(
      merged.age && merged.gender && merged.state &&
      merged.occupation && merged.annualIncome
    );
    localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
    return merged;
  },

  reset() {
    localStorage.removeItem(PROFILE_KEY);
  },

  isComplete() {
    const p = this.get();
    if (!p) return false;
    return !!(p.age && p.gender && p.state && p.occupation && p.annualIncome);
  },
};

// ── Matching engine (ported from server) ─────────────────────
const matchScheme = (profile, scheme) => {
  const reasons = [];
  const missed  = [];
  let score     = 0;
  let hardFail  = false;

  const e = scheme.eligibility || {};

  // 1. Age
  if (profile.age !== undefined && profile.age !== null) {
    if (e.minAge && profile.age < e.minAge) { missed.push(`Min age is ${e.minAge} yrs`); hardFail = true; }
    else if (e.maxAge && profile.age > e.maxAge) { missed.push(`Max age is ${e.maxAge} yrs`); hardFail = true; }
    else if (e.minAge || e.maxAge) { score += 15; reasons.push(`Your age (${profile.age}) meets the age requirement`); }
  } else if (e.minAge || e.maxAge) { score += 5; }

  // 2. Gender
  if (e.gender && e.gender !== 'all') {
    if (profile.gender && profile.gender !== e.gender) { missed.push(`Scheme is for ${e.gender} applicants only`); hardFail = true; }
    else if (profile.gender === e.gender) { score += 15; reasons.push(`Your gender matches the scheme requirement`); }
  } else { score += 5; }

  // 3. State
  if (e.states && e.states.length > 0) {
    const norm = s => (s || '').toLowerCase().trim();
    if (profile.state && e.states.map(norm).includes(norm(profile.state))) { score += 20; reasons.push(`Available in your state (${profile.state})`); }
    else if (profile.state) { missed.push(`Only available in: ${e.states.join(', ')}`); hardFail = true; }
    else { score += 5; }
  } else { score += 10; reasons.push('National scheme available across all states'); }

  // 4. Income
  if (e.maxAnnualIncome) {
    if (profile.annualIncome !== undefined && profile.annualIncome !== null) {
      if (profile.annualIncome <= e.maxAnnualIncome) { score += 15; reasons.push(`Income within scheme limit (₹${e.maxAnnualIncome.toLocaleString('en-IN')})`); }
      else { missed.push(`Income exceeds limit of ₹${e.maxAnnualIncome.toLocaleString('en-IN')}`); hardFail = true; }
    } else { score += 5; }
  } else { score += 5; }

  // 5. Occupation
  if (e.occupations && e.occupations.length > 0) {
    if (profile.occupation && e.occupations.includes(profile.occupation)) {
      score += 15; reasons.push(`Your occupation (${profile.occupation.replace(/_/g, ' ')}) is eligible`);
    }
  } else { score += 5; }

  // 6. Category
  if (e.categories && e.categories.length > 0) {
    const normCats = e.categories.map(c => c.toLowerCase());
    if (profile.category && normCats.includes(profile.category.toLowerCase())) { score += 10; reasons.push(`Your category (${profile.category.toUpperCase()}) is eligible`); }
  } else { score += 5; }

  // 7. Special flags
  if (e.isFarmerRequired) {
    if (profile.isFarmer) { score += 15; reasons.push('You are a farmer — core requirement met'); }
    else { missed.push('Requires farmer status'); hardFail = true; }
  } else if (profile.isFarmer && scheme.targetGroups?.includes('farmers')) { score += 8; reasons.push('Farmers are a target group'); }

  if (e.isStudentRequired) {
    if (profile.isStudent) { score += 15; reasons.push('You are a student — requirement met'); }
    else { missed.push('Requires student status'); hardFail = true; }
  } else if (profile.isStudent && scheme.targetGroups?.includes('students')) { score += 8; reasons.push('Students are a target group'); }

  if (e.isSeniorCitizenRequired) {
    if (profile.isSeniorCitizen) { score += 15; reasons.push('Senior citizen status required — you qualify'); }
    else { missed.push('Requires senior citizen status (60+)'); hardFail = true; }
  } else if (profile.isSeniorCitizen && scheme.targetGroups?.includes('senior_citizens')) { score += 8; reasons.push('Senior citizens are a target group'); }

  if (e.hasDisabilityRequired) {
    if (profile.hasDisability) { score += 15; reasons.push('Your disability status qualifies'); }
    else { missed.push('Requires disability status'); hardFail = true; }
  }

  if (e.isBPLRequired) {
    if (profile.isBPL) { score += 10; reasons.push('BPL status matches requirement'); }
    else { missed.push('Requires BPL card'); hardFail = true; }
  }

  if (e.isWidowRequired) {
    if (profile.isWidow) { score += 15; reasons.push('Widow status qualifies'); }
    else { missed.push('Scheme is for widows'); hardFail = true; }
  }

  // 8. Area type
  if (e.areaTypes && e.areaTypes.length > 0) {
    if (profile.areaType && e.areaTypes.includes(profile.areaType)) { score += 5; reasons.push(`Available for ${profile.areaType.replace(/_/g, ' ')} areas`); }
    else if (profile.areaType) { missed.push(`Only for: ${e.areaTypes.join(', ')}`); /* soft miss */ }
  }

  // 9. Women bonus
  if (scheme.targetGroups?.includes('women') && profile.gender === 'female') { score += 8; reasons.push('Scheme specifically supports women'); }

  const cappedScore = Math.min(score, 100);
  let matchLevel = null;
  let isMatch = false;
  if (!hardFail) {
    if (cappedScore >= 75) { matchLevel = 'highly_relevant'; isMatch = true; }
    else if (cappedScore >= 50) { matchLevel = 'relevant'; isMatch = true; }
    else if (cappedScore >= 25) { matchLevel = 'possibly_relevant'; isMatch = true; }
  }

  return { matchScore: cappedScore, matchLevel, matchReasons: reasons, missedReasons: missed, isMatch, hardFail };
};

export const matchService = {
  getMatches(profile) {
    if (!profile) return { total: 0, results: { all: [], highlyRelevant: [], relevant: [], possiblyRelevant: [] } };

    const matched = [];
    for (const scheme of getAllSchemes()) {
      if (scheme.status !== 'active') continue;
      const m = matchScheme(profile, scheme);
      if (m.isMatch) {
        matched.push({
          id: scheme.id,
          slug: scheme.slug,
          name: scheme.name,
          department: scheme.department,
          category: scheme.category,
          shortDescription: scheme.shortDescription,
          mainBenefit: scheme.mainBenefit,
          benefits: scheme.benefits,
          targetGroups: scheme.targetGroups,
          applicationMode: scheme.applicationMode,
          fundingType: scheme.fundingType,
          matchScore: m.matchScore,
          matchLevel: m.matchLevel,
          matchReasons: m.matchReasons,
        });
      }
    }

    matched.sort((a, b) => b.matchScore - a.matchScore);

    const highlyRelevant   = matched.filter(m => m.matchLevel === 'highly_relevant');
    const relevant         = matched.filter(m => m.matchLevel === 'relevant');
    const possiblyRelevant = matched.filter(m => m.matchLevel === 'possibly_relevant');

    return {
      total: matched.length,
      disclaimer: 'These schemes are recommended based on the information you provided. Official eligibility must be confirmed with the relevant government department.',
      results: { all: matched, highlyRelevant, relevant, possiblyRelevant },
    };
  },

  checkScheme(idOrSlug, profile) {
    const scheme = getSchemeById(idOrSlug);
    if (!scheme || !profile) return null;
    return matchScheme(profile, scheme);
  },
};

// ── Saved Schemes ─────────────────────────────────────────────
const getSaved = () => {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY)) || []; }
  catch { return []; }
};
const putSaved = (arr) => localStorage.setItem(SAVED_KEY, JSON.stringify(arr));

export const savedService = {
  getAll(statusFilter) {
    let entries = getSaved();
    if (statusFilter) entries = entries.filter(e => e.applicationStatus === statusFilter);
    // Hydrate each entry with full scheme data
    return entries.map(entry => ({
      ...entry,
      scheme: getSchemeById(entry.schemeId),
    })).filter(e => e.scheme); // drop any stale ids
  },

  save(schemeId, meta = {}) {
    const saved = getSaved();
    if (saved.find(e => e.schemeId === schemeId)) return; // already saved
    const scheme = getSchemeById(schemeId);
    if (!scheme) return;
    const entry = {
      id: `saved_${Date.now()}`,
      schemeId,
      applicationStatus: 'saved',
      matchScore: meta.matchScore || null,
      matchLevel: meta.matchLevel || null,
      matchReasons: meta.matchReasons || [],
      notes: '',
      savedAt: new Date().toISOString(),
    };
    putSaved([...saved, entry]);
    return entry;
  },

  unsave(schemeId) {
    putSaved(getSaved().filter(e => e.schemeId !== schemeId));
  },

  updateStatus(schemeId, status) {
    putSaved(getSaved().map(e => e.schemeId === schemeId ? { ...e, applicationStatus: status } : e));
  },

  updateNotes(schemeId, notes) {
    putSaved(getSaved().map(e => e.schemeId === schemeId ? { ...e, notes } : e));
  },

  isSaved(schemeId) {
    return getSaved().some(e => e.schemeId === schemeId);
  },
};

// ── Schemes (re-export helpers for page use) ──────────────────
export { getAllSchemes, getSchemeById, getFeaturedSchemes, filterSchemes, createScheme, updateScheme, deleteScheme, resetSchemes };

// ── Assistant (rule-based, no backend) ───────────────────────
const detectIntent = (msg) => {
  const m = msg.toLowerCase();
  if (/hello|hi|namaste|namaskar|help|start/i.test(m)) return 'greeting';
  if (/farmer|kisan|rythu|agriculture|krishi/i.test(m)) return 'farmer';
  if (/student|scholarship|padhai|chaduvulu|education/i.test(m)) return 'student';
  if (/women|mahila|stree|lady|female/i.test(m)) return 'women';
  if (/health|hospital|treatment|medical|arogya/i.test(m)) return 'health';
  if (/house|housing|home|awas|illu|ghar/i.test(m)) return 'housing';
  if (/disable|disability|divyang/i.test(m)) return 'disability';
  if (/old|senior|elderly|aged|pension|60/i.test(m)) return 'senior';
  if (/skill|training|course|certificate|vocational/i.test(m)) return 'skill';
  if (/loan|business|mudra|enterprise|entrepreneur/i.test(m)) return 'business';
  if (/document|papers|certificate|proof|what.*need/i.test(m)) return 'documents';
  if (/how.*apply|apply.*kaise|application/i.test(m)) return 'how_to_apply';
  if (/eligible|eligib|qualify|am i/i.test(m)) return 'eligibility';
  if (/what scheme|which scheme|find scheme|recommend|my scheme/i.test(m)) return 'find';
  if (/bpl|below poverty|ration card/i.test(m)) return 'bpl';
  return 'general';
};

const schemeList = (schemes) =>
  schemes.map(s => `• **${s.name}**: ${s.mainBenefit || s.shortDescription}`).join('\n');

export const assistantService = {
  respond(message, profile) {
    const intent = detectIntent(message);

    switch (intent) {
      case 'greeting':
        return {
          message: `Namaste! 🙏 I'm SchemeMate Assistant.\n\nI can help you:\n\n• Find government schemes you may be eligible for\n• Explain what documents you need\n• Guide you through the application process\n• Answer questions about specific schemes\n\nWhat would you like to know?`,
          suggestions: ['What schemes am I eligible for?', 'Show me farmer schemes', 'How do I apply for PM-KISAN?', 'What documents do I need?'],
        };

      case 'farmer': {
        const s = getAllSchemes().filter(sc => sc.eligibility?.isFarmerRequired || sc.targetGroups?.includes('farmers')).slice(0, 5);
        return {
          message: `Here are key schemes for **farmers**:\n\n${schemeList(s)}\n\nClick any scheme to see full details, documents, and how to apply.\n\n⚠️ *Confirm official eligibility with the relevant department.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['Documents needed for PM-KISAN?', 'What is Fasal Bima?', 'Show Kisan Credit Card'],
        };
      }

      case 'student': {
        const s = getAllSchemes().filter(sc => sc.eligibility?.isStudentRequired || sc.targetGroups?.includes('students')).slice(0, 5);
        return {
          message: `Here are schemes for **students**:\n\n${schemeList(s)}\n\nThese scholarships cover tuition, hostel, and living expenses for eligible students.\n\n⚠️ *Verify eligibility on official portals.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['How to apply for NSP scholarship?', 'Income limit for scholarship?', 'Documents for NSP'],
        };
      }

      case 'women': {
        const s = getAllSchemes().filter(sc => sc.targetGroups?.includes('women') || sc.eligibility?.gender === 'female').slice(0, 5);
        return {
          message: `Here are schemes specially for **women**:\n\n${schemeList(s)}\n\nThese include maternity benefits, LPG connections, savings schemes, and business loans.\n\n⚠️ *Always confirm eligibility with the relevant authority.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['PM Ujjwala Yojana documents?', 'Sukanya Samriddhi interest rate?', 'Stand Up India for women'],
        };
      }

      case 'health': {
        const s = getAllSchemes().filter(sc => sc.category === 'healthcare').slice(0, 4);
        return {
          message: `Here are **healthcare schemes**:\n\n${schemeList(s)}\n\nAyushman Bharat (PM-JAY) is the most comprehensive — it covers hospitalisation up to ₹5 lakh/year.\n\n⚠️ *Eligibility depends on SECC 2011 data or state-level criteria.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['Am I eligible for Ayushman Bharat?', 'Ayushman Bharat documents?', 'How many hospitals?'],
        };
      }

      case 'housing': {
        const s = getAllSchemes().filter(sc => sc.category === 'housing').slice(0, 4);
        return {
          message: `Here are **housing schemes**:\n\n${schemeList(s)}\n\nPMAY-Gramin offers ₹1.2 lakh for rural families. PMAY-Urban offers interest subsidy on home loans.\n\n⚠️ *Check official portals for current status.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['PMAY Gramin eligibility?', 'PMAY Urban interest subsidy?', 'How to apply for PMAY?'],
        };
      }

      case 'disability': {
        const s = getAllSchemes().filter(sc => sc.eligibility?.hasDisabilityRequired || sc.targetGroups?.includes('disabled')).slice(0, 4);
        return {
          message: `Here are schemes for **persons with disabilities**:\n\n${schemeList(s)}\n\n**IGNDPS** provides ₹300/month pension for severe disabilities. A disability certificate (80%+) is needed.\n\n⚠️ *Confirm with District Social Welfare Officer.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['How to get disability certificate?', 'Disability pension eligibility?', 'Documents needed'],
        };
      }

      case 'senior': {
        const s = getAllSchemes().filter(sc => sc.eligibility?.isSeniorCitizenRequired || sc.targetGroups?.includes('senior_citizens')).slice(0, 4);
        return {
          message: `Here are schemes for **senior citizens (60+)**:\n\n${schemeList(s)}\n\n**IGNOAPS** gives ₹200-500/month pension. Many states add their own top-up on top.\n\n⚠️ *Apply at Gram Panchayat or Urban Local Body.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['Old age pension eligibility?', 'Documents for pension?', 'How much will I get?'],
        };
      }

      case 'skill': {
        const s = getAllSchemes().filter(sc => sc.category === 'skill_development').slice(0, 3);
        return {
          message: `Here are **skill development schemes**:\n\n${schemeList(s)}\n\n**PMKVY** is the flagship scheme — free 3-12 month training with government certificate and monetary reward.\n\n⚠️ *Find nearest centre at skillindia.gov.in.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['How to enrol in PMKVY?', 'PMKVY age limit?', 'Digital literacy training'],
        };
      }

      case 'business': {
        const s = getAllSchemes().filter(sc => sc.category === 'entrepreneurship').slice(0, 3);
        return {
          message: `Here are **business & loan schemes**:\n\n${schemeList(s)}\n\n**PM MUDRA Yojana** gives loans up to ₹10 lakh without collateral. **Stand Up India** gives ₹10 lakh–₹1 crore for SC/ST and women.\n\n⚠️ *Apply at any scheduled commercial bank.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['MUDRA loan eligibility?', 'Stand Up India for women?', 'Documents for MUDRA loan'],
        };
      }

      case 'bpl': {
        const s = getAllSchemes().filter(sc => sc.eligibility?.isBPLRequired || sc.targetGroups?.includes('bpl_families')).slice(0, 5);
        return {
          message: `Here are schemes for **BPL (Below Poverty Line) families**:\n\n${schemeList(s)}\n\nHaving a BPL card or being in SECC 2011 data unlocks many central government schemes.\n\n⚠️ *Confirm with your local Gram Panchayat or Urban Local Body.*`,
          schemes: s.map(sc => ({ id: sc.id, slug: sc.slug, name: sc.name })),
          suggestions: ['How to get BPL card?', 'Ayushman Bharat for BPL?', 'PMAY for BPL families'],
        };
      }

      case 'documents':
        return {
          message: `For most government schemes, you typically need:\n\n• **Aadhaar Card** — mandatory for almost all schemes\n• **Bank Account** (linked with Aadhaar) — for direct benefit transfers\n• **Income Certificate** — from Tehsildar/SDM for income-based schemes\n• **Caste Certificate** — for SC/ST/OBC-specific schemes\n• **Land Records** — for farmer schemes like PM-KISAN\n• **BPL Card / Ration Card** — for BPL-specific schemes\n\n📌 Exact documents vary by scheme. Click on any scheme to see its specific document requirements.`,
          suggestions: ['Farmer scheme documents?', 'Student scholarship documents?', 'Ayushman Bharat documents?'],
        };

      case 'how_to_apply':
        return {
          message: `**How to apply** depends on the scheme. General steps:\n\n1. **Check eligibility** — review criteria on the scheme page\n2. **Gather documents** — Aadhaar, bank details, income proof etc.\n3. **Visit official portal or CSC** — most schemes have online portals\n4. **Common Service Centre (CSC)** — for offline applications in rural areas\n\n💡 Find your nearest CSC at locator.csccloud.in\n\n⚠️ Never pay anyone to apply — all government scheme applications are **FREE**.`,
          suggestions: ['CSC centre nearby?', 'Documents needed generally?', 'Show me PM-KISAN application'],
        };

      case 'eligibility':
        if (profile?.isComplete) {
          return {
            message: `Based on your saved profile, I can show you personalised recommendations in **My Schemes** section.\n\nYour profile shows:\n• State: ${profile.state || 'Not set'}\n• Occupation: ${(profile.occupation || '').replace(/_/g, ' ')}\n• Age: ${profile.age || 'Not set'}\n\nVisit **My Schemes** to see all matched schemes with match scores and reasons.`,
            suggestions: ['Show my matched schemes', 'Update my profile', 'Show all schemes'],
            action: { type: 'navigate', path: '/my-schemes' },
          };
        }
        return {
          message: `To check your specific eligibility, please complete your profile first. It only takes about 2 minutes!\n\nI'll ask about your age, occupation, income, and location — then match you with the right government schemes.`,
          suggestions: ['Complete my profile', 'Show all schemes', 'What schemes exist?'],
          action: { type: 'navigate', path: '/onboarding' },
        };

      case 'find':
        if (profile?.isComplete) {
          return {
            message: `Great! Based on your profile, I've already matched you with relevant schemes. Go to **My Schemes** to see them.\n\nYou can filter by match level (Highly Relevant, Relevant, Possibly Relevant) and save schemes you want to track.`,
            suggestions: ['Go to My Schemes', 'Show farmer schemes', 'Show healthcare schemes'],
            action: { type: 'navigate', path: '/my-schemes' },
          };
        }
        return {
          message: `To find schemes relevant to you, I need to know a bit about you first.\n\nPlease complete your profile — it only takes 2-3 minutes. I'll ask about your age, occupation, income, and location.`,
          suggestions: ['Complete my profile now', 'Show all available schemes', 'Explore by category'],
          action: { type: 'navigate', path: '/onboarding' },
        };

      default:
        return {
          message: `I can help you find government schemes! Here are some things you can ask me:\n\n• "Show me farmer schemes"\n• "What healthcare schemes are available?"\n• "What documents do I need?"\n• "How do I apply for Ayushman Bharat?"\n• "Show housing schemes"\n\nOr explore all ${getAllSchemes().length} schemes in the Explore section.`,
          suggestions: ['Show farmer schemes', 'Healthcare schemes', 'Student scholarships', 'Business loans'],
        };
    }
  },
};
