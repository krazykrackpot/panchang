/**
 * Remedy Prescription Engine
 *
 * Generates personalized, timed remedy prescriptions by combining
 * chart weakness analysis with today's hora windows.
 *
 * Uses:
 * - generateGemstoneRecommendations() for planet weakness scoring (BPHS Ch.83-84)
 * - PLANET_REMEDIES_FULL for mantra/charity/gemstone data
 * - getHoraWindowsForPlanet() for timing prescriptions to planetary hours
 *
 * Returns max 3 prescriptions per day, sorted by urgency.
 */

import type { KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import { generateGemstoneRecommendations } from './gemstone-engine';
import { PLANET_REMEDIES_FULL } from '@/lib/tippanni/remedies-enhanced';
import { getHoraWindowsForPlanet, type HoraSlot } from '@/lib/panchang/hora-engine';
import { GRAHAS, VARA_DATA } from '@/lib/constants/grahas';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RemedyPrescription {
  planetId: number;
  planetName: { en: string; hi: string };
  urgency: 'critical' | 'recommended' | 'supportive';
  reason: { en: string; hi: string };

  // Timing
  optimalWindows: {
    horaStart: string;    // "HH:MM"
    horaEnd: string;      // "HH:MM"
    isToday: boolean;
    nextBestDay: string;  // "Saturday" if today isn't optimal
  }[];

  // Full prescription
  gemstone: {
    name: { en: string; hi: string };
    carat: string;
    metal: string;
    finger: string;
    startDay: string;
  } | null;
  mantra: {
    beej: string;
    vedic: string;
    count: number;
  };
  charity: {
    item: { en: string; hi: string };
    recipient: { en: string; hi: string };
    direction: { en: string; hi: string };
  };
  color: { en: string; hi: string };
  foodToAvoid: { en: string; hi: string };

  // Chart context
  chartContext: {
    house: number;
    dignity: string;
    shadbalaPercent: number;
    dashaRelevance: string;
  };
}

export interface VaraRemedy {
  planet: { id: number; name: { en: string; hi: string } };
  message: { en: string; hi: string };
  horaWindows: { start: string; end: string }[];
  mantra: { beej: string; count: number };
  charity: { item: { en: string; hi: string }; direction: { en: string; hi: string } };
  color: { en: string; hi: string };
  gemstone: { en: string; hi: string };
}

// ─── Constants ──────────────────────────────────────────────────────────────

/** Map: vara day (0=Sunday) → ruling planet id */
const VARA_PLANET: Record<number, number> = {
  0: 0, // Sunday → Sun
  1: 1, // Monday → Moon
  2: 2, // Tuesday → Mars
  3: 3, // Wednesday → Mercury
  4: 4, // Thursday → Jupiter
  5: 5, // Friday → Venus
  6: 6, // Saturday → Saturn
};

/** Map: planet id → best weekday name (en) */
const PLANET_BEST_DAY: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
  7: 'Saturday', // Rahu — Saturday
  8: 'Tuesday',  // Ketu — Tuesday
};

/** Food avoidance per planet — classical recommendations */
const FOOD_AVOID: Record<number, { en: string; hi: string }> = {
  0: { en: 'Avoid non-veg on Sundays', hi: 'रविवार को माँसाहार त्यागें' },
  1: { en: 'Avoid stale food, excess salt', hi: 'बासी भोजन और अधिक नमक से बचें' },
  2: { en: 'Avoid non-veg, alcohol on Tuesdays', hi: 'मंगलवार को माँसाहार और शराब त्यागें' },
  3: { en: 'Avoid excess sweets on Wednesdays', hi: 'बुधवार को अधिक मिठाई से बचें' },
  4: { en: 'Avoid non-veg on Thursdays', hi: 'गुरुवार को माँसाहार त्यागें' },
  5: { en: 'Avoid sour food on Fridays', hi: 'शुक्रवार को खट्टा भोजन त्यागें' },
  6: { en: 'Avoid non-veg, alcohol on Saturdays', hi: 'शनिवार को माँसाहार और शराब त्यागें' },
  7: { en: 'Avoid meat and intoxicants', hi: 'माँस और नशीले पदार्थ से बचें' },
  8: { en: 'Avoid non-veg on Tuesdays', hi: 'मंगलवार को माँसाहार त्यागें' },
};

/** Dosha-linked planet IDs — when these are weak AND dosha is present, urgency = critical */
const DOSHA_PLANET_MAP: Record<string, number> = {
  'mangal': 2,    // Mars → Mangal Dosha
  'sade_sati': 6, // Saturn → Sade Sati
  'kaal_sarp': 7, // Rahu → Kaal Sarp
};

const MAX_PRESCRIPTIONS = 3;
const MIN_NEED_SCORE = 20;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDignity(planet: KundaliData['planets'][0]): string {
  if (planet.isExalted) return 'Exalted';
  if (planet.isDebilitated) return 'Debilitated';
  if (planet.isOwnSign) return 'Own Sign';
  if (planet.isVargottama) return 'Vargottama';
  return 'Neutral';
}

function getShadbalaPercent(kundali: KundaliData, planetId: number): number {
  const planetName = GRAHAS[planetId]?.name?.en;
  if (!planetName) return 50;
  const sb = kundali.shadbala.find(s => s.planet === planetName);
  return sb ? sb.totalStrength : 50;
}

function getDashaRelevance(kundali: KundaliData, planetId: number): string {
  const planetName = GRAHAS[planetId]?.name?.en;
  if (!planetName || !kundali.dashas?.length) return '';

  const now = new Date().toISOString().split('T')[0];

  for (const maha of kundali.dashas) {
    if (maha.startDate <= now && maha.endDate >= now) {
      if (maha.planet === planetName) return 'Current Mahadasha lord';
      if (maha.subPeriods) {
        for (const antar of maha.subPeriods) {
          if (antar.startDate <= now && antar.endDate >= now) {
            if (antar.planet === planetName) return 'Current Antardasha lord';
          }
        }
      }
    }
  }
  return '';
}

function getActiveDoshaIds(kundali: KundaliData): Set<number> {
  const ids = new Set<number>();

  // Check for Sade Sati
  if (kundali.sadeSati) {
    // sadeSati is present — Saturn is dosha-linked
    ids.add(6);
  }

  // Mangal Dosha: Mars in 1, 2, 4, 7, 8, 12 from lagna
  const mars = kundali.planets.find(p => p.planet.id === 2);
  if (mars) {
    const mangalHouses = new Set([1, 2, 4, 7, 8, 12]);
    if (mangalHouses.has(mars.house)) {
      ids.add(2);
    }
  }

  return ids;
}

function buildReason(
  planet: KundaliData['planets'][0],
  dashaRelevance: string,
  doshaLinked: boolean,
): { en: string; hi: string } {
  const pName = planet.planet.name;
  const parts: { en: string[]; hi: string[] } = { en: [], hi: [] };

  if (planet.isDebilitated) {
    parts.en.push(`${pName.en} is debilitated in ${planet.signName.en}`);
    parts.hi.push(`${pName.hi || pName.en} ${planet.signName.hi || planet.signName.en} में नीच`);
  } else if (planet.isCombust) {
    parts.en.push(`${pName.en} is combust`);
    parts.hi.push(`${pName.hi || pName.en} अस्त`);
  }

  const houseNum = planet.house;
  const dusthanas = new Set([6, 8, 12]);
  if (dusthanas.has(houseNum)) {
    parts.en.push(`placed in ${houseNum}th house (dusthana)`);
    parts.hi.push(`${houseNum}वें भाव (दुष्टस्थान) में स्थित`);
  }

  if (dashaRelevance) {
    parts.en.push(dashaRelevance.toLowerCase());
    parts.hi.push(dashaRelevance === 'Current Mahadasha lord' ? 'वर्तमान महादशा नाथ' : 'वर्तमान अन्तर्दशा नाथ');
  }

  if (doshaLinked) {
    parts.en.push('dosha-linked planet');
    parts.hi.push('दोष-संबंधित ग्रह');
  }

  // Fallback if nothing was added
  if (parts.en.length === 0) {
    parts.en.push(`${pName.en} needs strengthening`);
    parts.hi.push(`${pName.hi || pName.en} को बल चाहिए`);
  }

  return {
    en: parts.en.join(' — '),
    hi: parts.hi.join(' — '),
  };
}

function resolveLocaleText(obj: LocaleText): { en: string; hi: string } {
  return { en: obj.en, hi: (obj.hi as string) || obj.en };
}

// ─── Core Engine ────────────────────────────────────────────────────────────

/**
 * Generate up to 3 personalized, timed remedy prescriptions for a kundali.
 *
 * @param kundali - The birth chart data
 * @param horaTable - Today's 24 hora slots from computeHoraTable()
 * @param _panchang - Today's panchang data (reserved for future vara-based boosting)
 * @param _locale - Display locale (reserved for future localized output)
 * @returns Array of RemedyPrescription, max 3, sorted by urgency
 */
export function generateDailyPrescription(
  kundali: KundaliData,
  horaTable: HoraSlot[],
  _panchang?: { vara?: { day?: number } } | null,
  _locale?: string,
): RemedyPrescription[] {
  // 1. Get planet weakness scores
  const gemRecs = generateGemstoneRecommendations(kundali);

  // 2. Get active dosha-linked planet IDs
  const doshaIds = getActiveDoshaIds(kundali);

  // 3. Get dasha relevance for priority boosting
  const prescriptions: RemedyPrescription[] = [];

  for (const rec of gemRecs) {
    if (rec.needScore < MIN_NEED_SCORE) continue;

    const pid = rec.planetId;
    const planet = kundali.planets.find(p => p.planet.id === pid);
    if (!planet) continue;

    const remedy = PLANET_REMEDIES_FULL[pid];
    if (!remedy) continue;

    const dashaRelevance = getDashaRelevance(kundali, pid);
    const isDoshaLinked = doshaIds.has(pid);

    // Determine urgency
    let urgency: RemedyPrescription['urgency'] = 'supportive';
    if (isDoshaLinked || dashaRelevance === 'Current Mahadasha lord' || rec.needLevel === 'critical') {
      urgency = 'critical';
    } else if (dashaRelevance === 'Current Antardasha lord' || rec.needLevel === 'recommended' || planet.isDebilitated) {
      urgency = 'recommended';
    }

    // Get hora windows for this planet (only planets 0-6 have horas; Rahu/Ketu use Saturn/Mars)
    const horaId = pid <= 6 ? pid : (pid === 7 ? 6 : 2);
    const horaWindows = getHoraWindowsForPlanet(horaTable, horaId);
    const bestDay = PLANET_BEST_DAY[pid] || 'Saturday';

    const optimalWindows = horaWindows.map(hw => ({
      horaStart: hw.startTime,
      horaEnd: hw.endTime,
      isToday: true,
      nextBestDay: bestDay,
    }));

    // If no hora windows today (shouldn't happen with 24 slots, but guard)
    if (optimalWindows.length === 0) {
      optimalWindows.push({
        horaStart: '',
        horaEnd: '',
        isToday: false,
        nextBestDay: bestDay,
      });
    }

    const reason = buildReason(planet, dashaRelevance, isDoshaLinked);

    const pName = resolveLocaleText(GRAHAS[pid].name);

    // Build gemstone recommendation (null for Rahu/Ketu shadow planets if cautioned)
    const gemstone = {
      name: resolveLocaleText(remedy.gemstone.name),
      carat: remedy.gemstone.weight,
      metal: remedy.gemstone.metal.en,
      finger: remedy.gemstone.finger.en,
      startDay: bestDay,
    };

    prescriptions.push({
      planetId: pid,
      planetName: pName,
      urgency,
      reason,
      optimalWindows,
      gemstone,
      mantra: {
        beej: remedy.beejMantra.en,
        vedic: remedy.vedicMantra.en,
        count: remedy.count,
      },
      charity: {
        item: resolveLocaleText(remedy.charity.items),
        recipient: resolveLocaleText(remedy.charity.deity),
        direction: resolveLocaleText(remedy.direction),
      },
      color: resolveLocaleText(remedy.color),
      foodToAvoid: FOOD_AVOID[pid] || { en: '', hi: '' },
      chartContext: {
        house: planet.house,
        dignity: getDignity(planet),
        shadbalaPercent: getShadbalaPercent(kundali, pid),
        dashaRelevance,
      },
    });
  }

  // Sort by urgency priority: critical > recommended > supportive
  const urgencyOrder: Record<string, number> = { critical: 0, recommended: 1, supportive: 2 };
  prescriptions.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  // Cap at MAX_PRESCRIPTIONS
  return prescriptions.slice(0, MAX_PRESCRIPTIONS);
}

// ─── Vara-Based Remedies (Logged-Out Fallback) ─────────────────────────────

/**
 * Generic vara-based remedy for logged-out users.
 * Returns the vara lord's remedy data with hora windows.
 *
 * @param varaDay - 0=Sunday, 1=Monday, ..., 6=Saturday
 * @param horaTable - Today's 24 hora slots
 * @param _locale - Display locale (reserved for future use)
 */
export function getVaraRemedies(
  varaDay: number,
  horaTable: HoraSlot[],
  _locale?: string,
): VaraRemedy {
  const planetId = VARA_PLANET[varaDay % 7];
  const remedy = PLANET_REMEDIES_FULL[planetId];
  const graha = GRAHAS[planetId];
  const vara = VARA_DATA[varaDay % 7];

  const horaWindows = getHoraWindowsForPlanet(horaTable, planetId);

  return {
    planet: {
      id: planetId,
      name: resolveLocaleText(graha.name),
    },
    message: {
      en: `${vara.name.en}: ${graha.name.en} remedies are most effective today`,
      hi: `${vara.name.hi || vara.name.en}: आज ${graha.name.hi || graha.name.en} के उपचार सबसे प्रभावी हैं`,
    },
    horaWindows: horaWindows.map(hw => ({
      start: hw.startTime,
      end: hw.endTime,
    })),
    mantra: {
      beej: remedy.beejMantra.en,
      count: remedy.count,
    },
    charity: {
      item: resolveLocaleText(remedy.charity.items),
      direction: resolveLocaleText(remedy.direction),
    },
    color: resolveLocaleText(remedy.color),
    gemstone: resolveLocaleText(remedy.gemstone.name),
  };
}
