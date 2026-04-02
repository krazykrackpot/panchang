import type { Trilingual } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PersonalMuhurta {
  activity: Trilingual;
  activityKey: string;
  recommendation: 'excellent' | 'good' | 'neutral' | 'avoid';
  reason: Trilingual;
  taraBala: { favorable: boolean; taraName: string };
  chandraBala: { favorable: boolean; houseFromMoon: number };
}

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

interface ActivityDef {
  key: string;
  name: Trilingual;
}

const ACTIVITIES: ActivityDef[] = [
  { key: 'marriage', name: { en: 'Marriage', hi: 'विवाह', sa: 'विवाहः' } },
  { key: 'business', name: { en: 'Business', hi: 'व्यापार', sa: 'वाणिज्यम्' } },
  { key: 'travel', name: { en: 'Travel', hi: 'यात्रा', sa: 'यात्रा' } },
  { key: 'education', name: { en: 'Education', hi: 'शिक्षा', sa: 'शिक्षा' } },
  { key: 'property', name: { en: 'Property', hi: 'सम्पत्ति', sa: 'सम्पत्तिः' } },
  { key: 'medical', name: { en: 'Medical', hi: 'चिकित्सा', sa: 'चिकित्सा' } },
  { key: 'vehicle', name: { en: 'Vehicle Purchase', hi: 'वाहन खरीद', sa: 'वाहनक्रयः' } },
  { key: 'spiritual', name: { en: 'Spiritual Practice', hi: 'आध्यात्मिक साधना', sa: 'आध्यात्मिकसाधना' } },
  { key: 'financial', name: { en: 'Financial Investment', hi: 'वित्तीय निवेश', sa: 'वित्तनिवेशः' } },
  { key: 'court_case', name: { en: 'Court / Legal', hi: 'न्यायालय / कानूनी', sa: 'न्यायालयम् / विधिः' } },
];

// ---------------------------------------------------------------------------
// Tara Bala — same logic as personal-panchang, but kept self-contained
// ---------------------------------------------------------------------------

const TARA_NAMES = [
  '', 'Janma', 'Sampat', 'Vipat', 'Kshema', 'Pratyari',
  'Sadhaka', 'Vadha', 'Mitra', 'Atimitra',
];

const TARA_FAVORABLE = [false, false, true, false, true, false, true, false, true, true];

function getTaraBala(birthNak: number, todayNak: number) {
  let diff = todayNak - birthNak;
  if (diff < 0) diff += 27;
  const taraNum = (diff % 9) + 1;
  return { favorable: TARA_FAVORABLE[taraNum], taraName: TARA_NAMES[taraNum] };
}

// ---------------------------------------------------------------------------
// Chandra Bala
// ---------------------------------------------------------------------------

// Houses favorable for general muhurta: 1, 3, 6, 7, 10, 11
const CHANDRA_FAVORABLE_HOUSES = new Set([1, 3, 6, 7, 10, 11]);

function getChandraBala(birthSign: number, todaySign: number) {
  let house = todaySign - birthSign + 1;
  if (house <= 0) house += 12;
  return { favorable: CHANDRA_FAVORABLE_HOUSES.has(house), houseFromMoon: house };
}

// ---------------------------------------------------------------------------
// Recommendation logic
// ---------------------------------------------------------------------------

function deriveRecommendation(
  taraFav: boolean,
  chandraFav: boolean,
): 'excellent' | 'good' | 'neutral' | 'avoid' {
  if (taraFav && chandraFav) return 'excellent';
  if (taraFav || chandraFav) return 'good';
  // Both not favorable — check neutrality
  // Both neutral/unfavorable → avoid for important things
  return 'avoid';
}

// ---------------------------------------------------------------------------
// Reason text generation
// ---------------------------------------------------------------------------

function buildReason(
  rec: 'excellent' | 'good' | 'neutral' | 'avoid',
  taraName: string,
  taraFav: boolean,
  house: number,
  chandraFav: boolean,
): Trilingual {
  const taraStatus = taraFav ? 'favorable' : 'unfavorable';
  const chandraStatus = chandraFav ? 'favorable' : 'unfavorable';

  if (rec === 'excellent') {
    return {
      en: `Both Tara Bala (${taraName} — ${taraStatus}) and Chandra Bala (House ${house} — ${chandraStatus}) are favorable. Excellent time for this activity.`,
      hi: `तारा बल (${taraName} — शुभ) और चन्द्र बल (भाव ${house} — शुभ) दोनों अनुकूल हैं। इस कार्य के लिए उत्कृष्ट समय।`,
      sa: `तारा बलम् (${taraName} — शुभम्) चन्द्र बलं च (भावः ${house} — शुभम्) उभयम् अनुकूलम्। अस्मै कार्याय उत्कृष्टः कालः।`,
    };
  }

  if (rec === 'good') {
    const goodPart = taraFav ? 'Tara Bala' : 'Chandra Bala';
    const weakPart = taraFav ? 'Chandra Bala' : 'Tara Bala';
    return {
      en: `${goodPart} is favorable, but ${weakPart} is not ideal. Proceed with awareness.`,
      hi: `${goodPart === 'Tara Bala' ? 'तारा बल' : 'चन्द्र बल'} अनुकूल है, किन्तु ${weakPart === 'Tara Bala' ? 'तारा बल' : 'चन्द्र बल'} आदर्श नहीं। सजगता से आगे बढ़ें।`,
      sa: `${goodPart === 'Tara Bala' ? 'तारा बलम्' : 'चन्द्र बलम्'} अनुकूलम्, किन्तु ${weakPart === 'Tara Bala' ? 'तारा बलम्' : 'चन्द्र बलम्'} आदर्शं न। सजगतया अग्रे गच्छतु।`,
    };
  }

  // avoid
  return {
    en: `Both Tara Bala (${taraName} — ${taraStatus}) and Chandra Bala (House ${house} — ${chandraStatus}) are unfavorable. Best to postpone this activity.`,
    hi: `तारा बल (${taraName} — अशुभ) और चन्द्र बल (भाव ${house} — अशुभ) दोनों प्रतिकूल हैं। इस कार्य को स्थगित करना उचित।`,
    sa: `तारा बलम् (${taraName} — अशुभम्) चन्द्र बलं च (भावः ${house} — अशुभम्) उभयम् प्रतिकूलम्। अस्य कार्यस्य स्थगनम् उचितम्।`,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function computePersonalMuhurta(
  birthMoonNakshatra: number,
  birthMoonSign: number,
  todayNakshatra: number,
  todayMoonSign: number,
): PersonalMuhurta[] {
  const tara = getTaraBala(birthMoonNakshatra, todayNakshatra);
  const chandra = getChandraBala(birthMoonSign, todayMoonSign);
  const rec = deriveRecommendation(tara.favorable, chandra.favorable);

  return ACTIVITIES.map((act) => {
    // Spiritual activities get a boost even when Tara is Janma (self-reflection)
    let activityRec = rec;
    if (act.key === 'spiritual' && tara.taraName === 'Janma' && chandra.favorable) {
      activityRec = 'good';
    }
    // Court cases need extra caution — downgrade from good to neutral
    if (act.key === 'court_case' && rec === 'good') {
      activityRec = 'neutral';
    }

    return {
      activity: act.name,
      activityKey: act.key,
      recommendation: activityRec,
      reason: buildReason(activityRec, tara.taraName, tara.favorable, chandra.houseFromMoon, chandra.favorable),
      taraBala: tara,
      chandraBala: chandra,
    };
  });
}
