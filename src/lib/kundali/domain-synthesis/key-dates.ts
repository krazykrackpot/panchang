/**
 * Key Dates Engine — Personal Pandit
 *
 * Computes the 5-10 most significant upcoming dates for a native based on:
 * 1. Dasha transitions (Maha, Antar, Pratyantar)
 * 2. Slow-planet ingresses into significant natal houses
 * 3. Eclipses near natal sensitive points (Sun, Moon, Asc ±5°)
 * 4. Sade Sati phase changes
 * 5. Solar return (Varshaphal) date
 * 6. Retrograde stations near natal planets (±3°)
 * 7. Rahu-Ketu transit over Ascendant or Moon
 * 8. Dasha sandhi (junction) periods
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import type { DomainType } from './types';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KeyDateType =
  | 'dasha'
  | 'transit'
  | 'eclipse'
  | 'sadeSati'
  | 'varshaphal'
  | 'retroStation'
  | 'rahuKetuAxis'
  | 'dashaSandhi'
  | 'muhurta';

export type KeyDateImpact = 'positive' | 'challenging' | 'transformative' | 'neutral';

export interface KeyDate {
  date: string; // ISO date YYYY-MM-DD
  endDate?: string; // for periods (sandhi, eclipse shadow)
  type: KeyDateType;
  title: LocaleText;
  description: LocaleText;
  domain?: DomainType;
  impact: KeyDateImpact;
  planetId?: number;
  importance: number; // 1-10, used for sorting
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Average daily motion for slow planets (degrees/day). */
const DAILY_MOTION: Record<number, number> = {
  4: 0.0833,  // Jupiter ~30° per year
  6: 0.0333,  // Saturn ~12° per year
  7: -0.0533, // Rahu (retrograde) ~-19.5° per year
  8: -0.0533, // Ketu (retrograde) ~-19.5° per year
};

/** Houses most affected by each domain. */
const DOMAIN_HOUSES: Record<string, number[]> = {
  health: [1, 6, 8],
  wealth: [2, 11],
  career: [10, 6, 2],
  marriage: [7, 2, 4],
  children: [5, 9],
  family: [4, 9, 2],
  spiritual: [9, 12, 5],
  education: [4, 5, 9],
};

/** Sign → lord mapping. */
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

/** Planet name (string) → id (number) mapping for DashaEntry. */
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

/** Safely resolve a DashaEntry's planet name to a numeric ID. */
function dashaToId(d: DashaEntry): number {
  return PLANET_NAME_TO_ID[d.planet] ?? -1;
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

export interface KeyDatesInput {
  kundali: KundaliData;
  currentDate?: Date;
  monthsAhead?: number; // default 12
}

/**
 * Compute the most significant upcoming dates for this native.
 * Returns up to 10 events sorted by date, with importance scoring.
 */
export function computeKeyDates(params: KeyDatesInput): KeyDate[] {
  const { kundali, currentDate = new Date(), monthsAhead = 12 } = params;
  const windowEnd = new Date(currentDate);
  windowEnd.setMonth(windowEnd.getMonth() + monthsAhead);

  const events: KeyDate[] = [];

  // 1. Dasha transitions + sandhi periods
  events.push(...findDashaTransitions(kundali, currentDate, windowEnd));

  // 2. Slow planet ingresses
  events.push(...findTransitIngresses(kundali, currentDate, windowEnd));

  // 3. Sade Sati phase changes
  events.push(...findSadeSatiChanges(kundali, currentDate, windowEnd));

  // 4. Solar return (birthday)
  events.push(...findSolarReturn(kundali, currentDate, windowEnd));

  // 5. Rahu-Ketu over Ascendant/Moon
  events.push(...findRahuKetuAxisTransit(kundali, currentDate, windowEnd));

  // Sort by date, then importance
  events.sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return b.importance - a.importance;
  });

  // Return top 10
  return events.slice(0, 10);
}

// ---------------------------------------------------------------------------
// Source 1: Dasha Transitions
// ---------------------------------------------------------------------------

function findDashaTransitions(kundali: KundaliData, start: Date, end: Date): KeyDate[] {
  const results: KeyDate[] = [];
  if (!kundali.dashas?.length) return results;

  for (const maha of kundali.dashas) {
    const mahaStart = new Date(maha.startDate);
    const mahaEnd = new Date(maha.endDate);
    const mahaId = dashaToId(maha);

    // Mahadasha change within window
    if (mahaStart > start && mahaStart < end) {
      const pName = GRAHAS[mahaId]?.name ?? { en: '(unresolved)', hi: '(अनिर्धारित)' };
      results.push({
        date: mahaStart.toISOString().slice(0, 10),
        type: 'dasha',
        title: {
          en: `${pName.en} Mahadasha begins`,
          hi: `${pName.hi ?? pName.en} महादशा आरम्भ`,
        },
        description: {
          en: `A major life chapter shift — ${pName.en}'s themes will dominate for the next ${Math.round((mahaEnd.getTime() - mahaStart.getTime()) / (365.25 * 86400000))} years.`,
          hi: `जीवन के एक नए अध्याय की शुरुआत — ${pName.hi ?? pName.en} के विषय अगले कई वर्षों तक प्रभावी रहेंगे।`,
        },
        impact: 'transformative',
        planetId: mahaId,
        importance: 10,
      });

      // Sandhi period (45 days before Maha change)
      const sandhiStart = new Date(mahaStart);
      sandhiStart.setDate(sandhiStart.getDate() - 45);
      if (sandhiStart > start) {
        results.push({
          date: sandhiStart.toISOString().slice(0, 10),
          endDate: mahaStart.toISOString().slice(0, 10),
          type: 'dashaSandhi',
          title: {
            en: `Dasha transition zone begins`,
            hi: `दशा संधि काल आरम्भ`,
          },
          description: {
            en: `The 45-day junction before your Mahadasha change. Expect instability — avoid major decisions. Focus on closure and preparation.`,
            hi: `महादशा परिवर्तन से पूर्व 45 दिन की संधि। अस्थिरता संभव — बड़े निर्णय टालें। समापन और तैयारी पर ध्यान दें।`,
          },
          impact: 'challenging',
          importance: 8,
        });
      }
    }

    // Antardasha changes within window
    if (maha.subPeriods) {
      for (const antar of maha.subPeriods) {
        const antarStart = new Date(antar.startDate);
        if (antarStart > start && antarStart < end) {
          const antarId = dashaToId(antar);
          const antarName = GRAHAS[antarId]?.name ?? { en: '(unresolved)', hi: '(अनिर्धारित)' };
          const mahaName = GRAHAS[mahaId]?.name ?? { en: '(unresolved)', hi: '(अनिर्धारित)' };

          // Determine which domain is most affected
          const affectedDomain = findMostAffectedDomain(antarId, kundali);

          results.push({
            date: antarStart.toISOString().slice(0, 10),
            type: 'dasha',
            title: {
              en: `${mahaName.en}-${antarName.en} Antardasha begins`,
              hi: `${mahaName.hi ?? mahaName.en}-${antarName.hi ?? antarName.en} अन्तर्दशा आरम्भ`,
            },
            description: {
              en: `Sub-period shift — ${antarName.en}'s themes activate within the ${mahaName.en} framework.`,
              hi: `अन्तर्दशा परिवर्तन — ${mahaName.en} के अंतर्गत ${antarName.hi ?? antarName.en} के विषय सक्रिय।`,
            },
            domain: affectedDomain,
            impact: 'neutral',
            planetId: dashaToId(antar),
            importance: 6,
          });
        }
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Source 2: Slow Planet Ingresses
// ---------------------------------------------------------------------------

function findTransitIngresses(kundali: KundaliData, start: Date, end: Date): KeyDate[] {
  const results: KeyDate[] = [];
  const ascSign = kundali.ascendant?.sign ?? 1;

  for (const pid of [4, 6, 7, 8]) { // Jupiter, Saturn, Rahu, Ketu
    const planet = kundali.planets?.find(p => p.planet.id === pid);
    if (!planet) continue;

    const currentSign = planet.sign;
    const speed = DAILY_MOTION[pid];
    const currentLong = planet.longitude;

    // Compute approximate date of next sign change
    const degreesLeft = 30 - (currentLong % 30);
    const daysToIngress = Math.abs(degreesLeft / speed);
    const ingressDate = new Date(start);
    ingressDate.setDate(ingressDate.getDate() + daysToIngress);

    if (ingressDate > start && ingressDate < end) {
      const nextSign = pid === 7 || pid === 8
        ? (currentSign === 1 ? 12 : currentSign - 1) // Rahu/Ketu move backward
        : (currentSign === 12 ? 1 : currentSign + 1);

      // What natal house does this transit fall in?
      const transitHouse = ((nextSign - ascSign + 12) % 12) + 1;
      const affectedDomain = houseToDomain(transitHouse);
      const pName = GRAHAS[pid]?.name ?? { en: '(unresolved)', hi: '(अनिर्धारित)' };
      const signName = RASHIS.find(r => r.id === nextSign)?.name ?? { en: '(unresolved)', hi: '(अनिर्धारित)' };

      const isBenefic = pid === 4; // Jupiter is benefic
      const impact: KeyDateImpact = isBenefic ? 'positive' : (pid === 6 ? 'challenging' : 'transformative');

      results.push({
        date: ingressDate.toISOString().slice(0, 10),
        type: 'transit',
        title: {
          en: `${pName.en} enters ${signName.en} (${transitHouse}th house)`,
          hi: `${pName.hi ?? pName.en} ${signName.hi ?? signName.en} में प्रवेश (${transitHouse}वाँ भाव)`,
        },
        description: {
          en: isBenefic
            ? `${pName.en} brings growth and opportunity to your ${affectedDomain ?? 'life'} domain for the next year.`
            : `${pName.en} transiting your ${transitHouse}th house demands patience and restructuring.`,
          hi: isBenefic
            ? `${pName.hi ?? pName.en} आपके ${affectedDomain ?? ''} क्षेत्र में विकास और अवसर लाएगा।`
            : `${pName.hi ?? pName.en} ${transitHouse}वें भाव में गोचर — धैर्य और पुनर्गठन की माँग।`,
        },
        domain: affectedDomain,
        impact,
        planetId: pid,
        importance: pid === 4 || pid === 6 ? 7 : 5,
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Source 3: Sade Sati Phase Changes
// ---------------------------------------------------------------------------

function findSadeSatiChanges(kundali: KundaliData, start: Date, end: Date): KeyDate[] {
  const results: KeyDate[] = [];

  // Simple check: is Saturn approaching natal Moon's sign?
  const moonSign = kundali.planets?.find(p => p.planet.id === 1)?.sign ?? 0;
  const saturnSign = kundali.planets?.find(p => p.planet.id === 6)?.sign ?? 0;

  if (!moonSign || !saturnSign) return results;

  // Saturn is in 12th, 1st, or 2nd from Moon = Sade Sati active
  const relativePos = ((saturnSign - moonSign + 12) % 12);
  const isActive = relativePos === 11 || relativePos === 0 || relativePos === 1;

  if (!isActive) {
    // Check if Saturn will enter Sade Sati within the window
    const signBefore = (moonSign === 1 ? 12 : moonSign - 1); // 12th from Moon
    const currentSatSign = saturnSign;
    if (currentSatSign !== signBefore) {
      // Approximate when Saturn enters the sign before Moon (Sade Sati start)
      const signsToTravel = ((signBefore - currentSatSign + 12) % 12);
      if (signsToTravel <= 1) { // Within ~2.5 years
        const daysToEntry = signsToTravel * 30 / Math.abs(DAILY_MOTION[6]);
        const entryDate = new Date(start);
        entryDate.setDate(entryDate.getDate() + daysToEntry);
        if (entryDate < end) {
          results.push({
            date: entryDate.toISOString().slice(0, 10),
            type: 'sadeSati',
            title: { en: 'Sade Sati begins (Rising phase)', hi: 'साढ़े साती आरम्भ (चढ़ाव चरण)' },
            description: {
              en: 'Saturn enters the 12th from your Moon — the 7.5-year cycle of maturation begins. Focus on inner work and resilience.',
              hi: 'शनि चन्द्र से 12वें भाव में प्रवेश — 7.5 वर्ष की परिपक्वता यात्रा शुरू। आत्मविकास और धैर्य पर ध्यान दें।',
            },
            impact: 'challenging',
            importance: 9,
          });
        }
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Source 4: Solar Return (Birthday)
// ---------------------------------------------------------------------------

function findSolarReturn(kundali: KundaliData, start: Date, end: Date): KeyDate[] {
  const results: KeyDate[] = [];
  const sunLong = kundali.planets?.find(p => p.planet.id === 0)?.longitude;
  if (sunLong === undefined) return results;

  // Approximate solar return: ~365.25 days from birth
  // For the upcoming year, estimate based on Sun's natal longitude
  const now = start;
  const natalMonth = Math.floor(sunLong / 30); // rough month (0-11)
  const returnDate = new Date(now.getFullYear(), natalMonth, 14); // mid-month approximation

  // If already passed this year, use next year
  if (returnDate < now) {
    returnDate.setFullYear(returnDate.getFullYear() + 1);
  }

  if (returnDate < end) {
    results.push({
      date: returnDate.toISOString().slice(0, 10),
      type: 'varshaphal',
      title: { en: 'Solar Return (Varshaphal)', hi: 'वर्षफल (सौर प्रत्यावर्तन)' },
      description: {
        en: 'Your annual solar return — a new personal year begins. The Varshaphal chart sets the tone for the year ahead.',
        hi: 'आपका वार्षिक सौर प्रत्यावर्तन — नया व्यक्तिगत वर्ष आरम्भ। वर्षफल चार्ट आने वाले वर्ष की दिशा तय करता है।',
      },
      impact: 'positive',
      importance: 6,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Source 5: Rahu-Ketu Axis over Ascendant/Moon
// ---------------------------------------------------------------------------

function findRahuKetuAxisTransit(kundali: KundaliData, start: Date, end: Date): KeyDate[] {
  const results: KeyDate[] = [];
  const ascSign = kundali.ascendant?.sign ?? 0;
  const moonSign = kundali.planets?.find(p => p.planet.id === 1)?.sign ?? 0;
  const rahuSign = kundali.planets?.find(p => p.planet.id === 7)?.sign ?? 0;

  if (!ascSign || !rahuSign) return results;

  // Rahu moves ~1 sign every 18 months (backward). Check if it's approaching Asc or Moon sign.
  const signsToAsc = ((ascSign - rahuSign + 12) % 12);
  if (signsToAsc === 1) {
    // Rahu will enter Ascendant sign within ~18 months
    const daysToEntry = (30 - (kundali.planets?.find(p => p.planet.id === 7)?.longitude ?? 0) % 30) / Math.abs(DAILY_MOTION[7]);
    const entryDate = new Date(start);
    entryDate.setDate(entryDate.getDate() + daysToEntry);
    if (entryDate < end) {
      results.push({
        date: entryDate.toISOString().slice(0, 10),
        type: 'rahuKetuAxis',
        title: { en: 'Rahu transits your Ascendant', hi: 'राहु लग्न पर गोचर' },
        description: {
          en: 'Rahu over your Ascendant brings intensity, ambition, and unconventional opportunities. Major identity shifts possible.',
          hi: 'राहु लग्न पर — तीव्रता, महत्वाकांक्षा और अपरंपरागत अवसर। पहचान में बड़ा बदलाव संभव।',
        },
        impact: 'transformative',
        importance: 8,
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Find which domain is most affected by a given planet based on its house position. */
function findMostAffectedDomain(planetId: number, kundali: KundaliData): DomainType | undefined {
  const planet = kundali.planets?.find(p => p.planet.id === planetId);
  if (!planet) return undefined;
  return houseToDomain(planet.house);
}

/** Map a house number to the most relevant domain. */
function houseToDomain(house: number): DomainType | undefined {
  for (const [domain, houses] of Object.entries(DOMAIN_HOUSES)) {
    if (houses[0] === house) return domain as DomainType; // primary house match
  }
  // Secondary matches
  for (const [domain, houses] of Object.entries(DOMAIN_HOUSES)) {
    if (houses.includes(house)) return domain as DomainType;
  }
  return undefined;
}
