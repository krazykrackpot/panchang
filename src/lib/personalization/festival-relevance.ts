/**
 * Festival Relevance Scoring Engine
 * Scores festivals by personal relevance based on the user's natal snapshot.
 */

import type { LocaleText,} from '@/types/panchang';
import type { UserSnapshot } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PersonalFestival {
  festivalSlug: string;
  relevanceScore: number;      // 0-100
  relevanceReason: LocaleText;
  isRecommended: boolean;      // score > 60
}

// ---------------------------------------------------------------------------
// Planet-to-festival mapping
// ---------------------------------------------------------------------------

const PLANET_FESTIVAL_MAP: Record<number, string[]> = {
  0: ['makar-sankranti', 'chhath-puja', 'ratha-saptami'],       // Sun
  1: ['karva-chauth', 'purnima', 'sharad-purnima'],             // Moon
  2: ['hanuman-jayanti', 'mangalvar-vrat'],                     // Mars
  3: ['budh-purnima', 'buddha-jayanti'],                        // Mercury
  4: ['guru-purnima', 'brihaspativar-vrat'],                    // Jupiter
  5: ['vasant-panchami', 'shukravar-vrat'],                     // Venus
  6: ['maha-shivaratri', 'pradosham', 'shanivar-vrat'],         // Saturn
  7: ['nag-panchami'],                                           // Rahu
  8: ['ganesh-chaturthi'],                                       // Ketu
};

// Shiva-related festivals (helpful during Sade Sati)
const SHIVA_FESTIVALS = new Set([
  'maha-shivaratri', 'masik-shivaratri', 'pradosham',
  'shravan-somvar', 'somvar-vrat',
]);

// Dasha lord remedial festivals
const DASHA_LORD_FESTIVALS: Record<string, string[]> = {
  sun: ['makar-sankranti', 'chhath-puja', 'ratha-saptami'],
  moon: ['karva-chauth', 'purnima', 'sharad-purnima'],
  mars: ['hanuman-jayanti', 'mangalvar-vrat'],
  mercury: ['budh-purnima'],
  jupiter: ['guru-purnima'],
  venus: ['vasant-panchami'],
  saturn: ['maha-shivaratri', 'pradosham', 'shanivar-vrat'],
  rahu: ['nag-panchami'],
  ketu: ['ganesh-chaturthi'],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findWeakPlanets(snapshot: UserSnapshot): number[] {
  // Planets in dusthana (6, 8, 12) from ascendant are considered weak
  // If planet positions aren't available, return empty
  if (!snapshot.planetPositions || !Array.isArray(snapshot.planetPositions)) return [];

  const weak: number[] = [];
  for (const pp of snapshot.planetPositions) {
    const pos = pp as { id?: number; rashi?: number };
    if (pos.id === undefined || pos.rashi === undefined) continue;
    const houseFromAsc = ((pos.rashi - snapshot.ascendantSign + 12) % 12) + 1;
    if ([6, 8, 12].includes(houseFromAsc)) {
      weak.push(pos.id);
    }
  }
  return weak;
}

function getCurrentDashaLord(snapshot: UserSnapshot): string | null {
  if (!snapshot.dashaTimeline || !Array.isArray(snapshot.dashaTimeline) || snapshot.dashaTimeline.length === 0) return null;
  const now = new Date();
  for (const d of snapshot.dashaTimeline) {
    const entry = d as { planet?: string; startDate?: string; endDate?: string };
    if (!entry.planet || !entry.startDate || !entry.endDate) continue;
    const start = new Date(entry.startDate);
    const end = new Date(entry.endDate);
    if (now >= start && now <= end) {
      return entry.planet.toLowerCase();
    }
  }
  return null;
}

function isSadeSatiActive(snapshot: UserSnapshot): boolean {
  if (!snapshot.sadeSati || typeof snapshot.sadeSati !== 'object') return false;
  return !!(snapshot.sadeSati as { isActive?: boolean }).isActive;
}

// ---------------------------------------------------------------------------
// Main scoring function
// ---------------------------------------------------------------------------

export function scoreFestivalRelevance(
  festivalSlug: string,
  festivalCategory: string,
  snapshot: UserSnapshot,
): PersonalFestival {
  let score = 30; // base score
  const reasons: { en: string[]; hi: string[]; sa: string[] } = { en: [], hi: [], sa: [] };

  // 1. Festival deity matches weak planet's deity: +30
  const weakPlanets = findWeakPlanets(snapshot);
  for (const wPid of weakPlanets) {
    const planetFestivals = PLANET_FESTIVAL_MAP[wPid];
    if (planetFestivals && planetFestivals.includes(festivalSlug)) {
      score += 30;
      reasons.en.push('Remedy for weak planet in your chart');
      reasons.hi.push('आपकी कुण्डली में कमजोर ग्रह का उपाय');
      reasons.sa.push('भवतः कुण्डल्यां दुर्बलग्रहस्य उपचारः');
      break;
    }
  }

  // 2. Shiva festival during Sade Sati: +25
  if (isSadeSatiActive(snapshot) && SHIVA_FESTIVALS.has(festivalSlug)) {
    score += 25;
    reasons.en.push('Shiva worship recommended during Sade Sati');
    reasons.hi.push('साढ़े साती में शिव पूजा अनुशंसित');
    reasons.sa.push('साढ़ेसात्यां शिवपूजा अनुशंसिता');
  }

  // 3. Birth tithi match: +15
  // We check if the festival category hints at a tithi match
  // (In a full implementation, this would compare festival tithi with birth tithi)
  if (festivalCategory === 'tithi-based' || festivalCategory === 'ekadashi' || festivalCategory === 'purnima') {
    // Approximate: festivals on purnima if birth nakshatra is in purnima range
    if (snapshot.moonNakshatraPada && (snapshot.moonNakshatra % 9 === 0)) {
      score += 15;
      reasons.en.push('Festival tithi resonates with your birth tithi');
      reasons.hi.push('त्योहार तिथि आपकी जन्म तिथि से मेल खाती है');
      reasons.sa.push('उत्सवतिथिः भवतः जन्मतिथ्या सह अनुरणति');
    }
  }

  // 4. Birth nakshatra match: +20
  // Festival associated with specific nakshatra deity
  if (festivalSlug === 'janmashtami' && snapshot.moonNakshatra === 23) { // Rohini=4 is Krishna's, Dhanishtha=23
    score += 20;
  }
  // Generic nakshatra-based festivals
  if (festivalCategory === 'nakshatra-based') {
    score += 20;
    reasons.en.push('Festival aligns with your birth nakshatra energy');
    reasons.hi.push('त्योहार आपकी जन्म नक्षत्र ऊर्जा से मेल खाता है');
    reasons.sa.push('उत्सवः भवतः जन्मनक्षत्रशक्त्या सह मिलति');
  }

  // 5. Current dasha lord's remedial festival: +25
  const dashaLord = getCurrentDashaLord(snapshot);
  if (dashaLord) {
    const dashaFestivals = DASHA_LORD_FESTIVALS[dashaLord];
    if (dashaFestivals && dashaFestivals.includes(festivalSlug)) {
      score += 25;
      reasons.en.push(`Beneficial during your current ${dashaLord.charAt(0).toUpperCase() + dashaLord.slice(1)} dasha`);
      reasons.hi.push(`आपकी वर्तमान ${dashaLord} दशा में लाभकारी`);
      reasons.sa.push(`भवतः वर्तमान${dashaLord}दशायां लाभकरम्`);
    }
  }

  // Cap at 100
  score = Math.min(100, score);

  // Build combined reason
  const reason: LocaleText = {
    en: reasons.en.length > 0 ? reasons.en.join('. ') : 'General spiritual observance',
    hi: reasons.hi.length > 0 ? reasons.hi.join('। ') : 'सामान्य आध्यात्मिक अनुष्ठान',
    sa: reasons.sa.length > 0 ? reasons.sa.join('। ') : 'सामान्यम् आध्यात्मिकम् अनुष्ठानम्',
  };

  return {
    festivalSlug,
    relevanceScore: score,
    relevanceReason: reason,
    isRecommended: score > 60,
  };
}
