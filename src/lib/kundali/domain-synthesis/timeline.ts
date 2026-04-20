/**
 * Domain Timeline Engine
 *
 * Computes forward-looking timeline triggers for a given life domain,
 * sourced from dasha transitions, slow-planet transit ingresses, and
 * eclipse proximity windows. Dates for transits are APPROXIMATE
 * (current position + average speed); dasha dates are EXACT.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { DashaEntry, KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import type { DomainConfig, DomainType, TimelineTrigger } from './types';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';

// ---------------------------------------------------------------------------
// Public interface
// ---------------------------------------------------------------------------

export interface TimelineInput {
  domainConfig: DomainConfig;
  kundali: KundaliData;
  currentDate: Date;
  yearsAhead?: number; // default 5
}

/**
 * Compute all timeline triggers for a domain over the next N years.
 * Returns triggers sorted by startDate ascending.
 */
export function computeDomainTimeline(params: TimelineInput): TimelineTrigger[] {
  const { domainConfig, kundali, currentDate, yearsAhead = 5 } = params;
  const windowEnd = new Date(currentDate);
  windowEnd.setFullYear(windowEnd.getFullYear() + yearsAhead);

  const triggers: TimelineTrigger[] = [];

  // 1. Dasha change triggers
  triggers.push(
    ...computeDashaTriggers(domainConfig, kundali, currentDate, windowEnd),
  );

  // 2. Major transit ingresses (Saturn, Jupiter, Rahu/Ketu)
  triggers.push(
    ...computeTransitTriggers(domainConfig, kundali, currentDate, windowEnd),
  );

  // 3. Eclipse proximity windows
  triggers.push(
    ...computeEclipseTriggers(domainConfig, kundali, currentDate, windowEnd),
  );

  // Sort by startDate ascending
  triggers.sort((a, b) => a.startDate.localeCompare(b.startDate));

  return triggers;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map planet name string (from DashaEntry.planet) to planet ID. */
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
  // Hindi variants that might appear
  'सूर्य': 0, 'चन्द्र': 1, 'मंगल': 2, 'बुध': 3,
  'बृहस्पति': 4, 'शुक्र': 5, 'शनि': 6, 'राहु': 7, 'केतु': 8,
};

function planetId(name: string): number {
  return PLANET_NAME_TO_ID[name] ?? -1;
}

function grahaNameLocale(id: number): LocaleText {
  const g = GRAHAS[id];
  return g ? g.name : { en: `Planet ${id}` };
}

function rashiNameLocale(signNum: number): LocaleText {
  const r = RASHIS[signNum - 1];
  return r ? r.name : { en: `Sign ${signNum}` };
}

/** Compute house number (1-12) from transit sign relative to ascendant sign. */
function houseFromSign(transitSign: number, ascSign: number): number {
  return ((transitSign - ascSign + 12) % 12) + 1;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isInWindow(dateStr: string, start: Date, end: Date): boolean {
  const d = new Date(dateStr);
  return d >= start && d <= end;
}

/** Natural benefics: Jupiter (4), Venus (5), Mercury (3), Moon (1). */
const NATURAL_BENEFICS = new Set([1, 3, 4, 5]);

/** Natural malefics: Sun (0), Mars (2), Saturn (6), Rahu (7), Ketu (8). */
const NATURAL_MALEFICS = new Set([0, 2, 6, 7, 8]);

/**
 * Determine whether a planet is benefic or malefic for a domain.
 * A planet that is both a domain primary planet AND a natural benefic is positive.
 * A natural malefic that is NOT a domain primary planet is negative.
 */
function planetNatureForDomain(
  pid: number,
  domainConfig: DomainConfig,
): 'opportunity' | 'challenge' | 'mixed' {
  const isPrimary = domainConfig.primaryPlanets.includes(pid);
  const isBenefic = NATURAL_BENEFICS.has(pid);
  const isMalefic = NATURAL_MALEFICS.has(pid);

  if (isPrimary && isBenefic) return 'opportunity';
  if (isPrimary && isMalefic) return 'mixed'; // domain karaka but naturally malefic
  if (isBenefic) return 'opportunity';
  if (isMalefic) return 'challenge';
  return 'mixed';
}

// ---------------------------------------------------------------------------
// 1. Dasha change triggers
// ---------------------------------------------------------------------------

/**
 * Flatten maha + antar dashas and find transitions within the window.
 * For each transition, check if the new lord activates domain houses.
 */
function computeDashaTriggers(
  domainConfig: DomainConfig,
  kundali: KundaliData,
  windowStart: Date,
  windowEnd: Date,
): TimelineTrigger[] {
  const triggers: TimelineTrigger[] = [];
  const dashas = kundali.dashas;
  if (!dashas || dashas.length === 0) return triggers;

  const ascSign = kundali.ascendant.sign;
  const domainHouses = new Set([
    ...domainConfig.primaryHouses,
    ...domainConfig.secondaryHouses,
  ]);

  // Collect all maha and antar dasha entries in a flat list
  const entries: { entry: DashaEntry; level: 'maha' | 'antar' }[] = [];

  for (const maha of dashas) {
    entries.push({ entry: maha, level: 'maha' });
    if (maha.subPeriods) {
      for (const antar of maha.subPeriods) {
        entries.push({ entry: antar, level: 'antar' });
      }
    }
  }

  for (const { entry, level } of entries) {
    const startDate = entry.startDate;
    if (!isInWindow(startDate, windowStart, windowEnd)) continue;

    const pid = planetId(entry.planet);
    if (pid < 0) continue;

    // Check if this planet occupies or lords over a domain-relevant house
    const planetPos = kundali.planets.find(p => p.planet.id === pid);
    const planetHouse = planetPos ? planetPos.house : -1;
    const planetSign = planetPos ? planetPos.sign : -1;

    // Check lordship: which house(s) does this planet rule from the ascendant?
    const lordedHouses: number[] = [];
    for (const cusp of kundali.houses) {
      // House lord name matches planet name
      if (cusp.lord === entry.planet || cusp.lord === (GRAHAS[pid]?.name.en ?? '')) {
        lordedHouses.push(cusp.house);
      }
    }

    const activatesDomain =
      domainHouses.has(planetHouse) ||
      lordedHouses.some(h => domainHouses.has(h));

    if (!activatesDomain) continue;

    const nature = planetNatureForDomain(pid, domainConfig);
    const pName = grahaNameLocale(pid);
    const levelLabel = level === 'maha' ? 'Mahadasha' : 'Antardasha';
    const levelLabelHi = level === 'maha' ? 'महादशा' : 'अन्तर्दशा';

    // End date for the window — use entry endDate or 1 month for display
    const endDateStr = entry.endDate;

    triggers.push({
      startDate,
      endDate: endDateStr,
      triggerType: 'dasha_change',
      planets: [pid],
      nature,
      description: {
        en: `${pName.en} ${levelLabel} begins — activates your ${domainConfig.name.en} domain`,
        hi: `${pName.hi ?? pName.en} ${levelLabelHi} आरम्भ — आपके ${domainConfig.name.hi ?? domainConfig.name.en} क्षेत्र को सक्रिय करता है`,
      },
    });
  }

  return triggers;
}

// ---------------------------------------------------------------------------
// 2. Transit ingress triggers
// ---------------------------------------------------------------------------

/** Average time each slow planet spends per sign (in days). */
const SIGN_DURATION_DAYS: Record<number, number> = {
  4: 365.25,      // Jupiter ~1 year per sign
  6: 365.25 * 2.5, // Saturn ~2.5 years per sign
  7: 365.25 * 1.5, // Rahu ~1.5 years per sign
  8: 365.25 * 1.5, // Ketu ~1.5 years per sign (always opposite Rahu)
};

const SLOW_PLANETS = [4, 6, 7, 8]; // Jupiter, Saturn, Rahu, Ketu

/**
 * For each slow planet, estimate when it will ingress into signs
 * that correspond to domain-relevant houses, based on current natal
 * position and average transit speed.
 */
function computeTransitTriggers(
  domainConfig: DomainConfig,
  kundali: KundaliData,
  windowStart: Date,
  windowEnd: Date,
): TimelineTrigger[] {
  const triggers: TimelineTrigger[] = [];
  const ascSign = kundali.ascendant.sign;

  // Domain-relevant signs: map domain houses to absolute signs
  const domainSigns = new Set(
    domainConfig.primaryHouses.map(h => ((ascSign + h - 2) % 12) + 1),
  );

  for (const pid of SLOW_PLANETS) {
    const planetPos = kundali.planets.find(p => p.planet.id === pid);
    if (!planetPos) continue;

    const currentSign = planetPos.sign; // 1-12
    const longitude = planetPos.longitude; // sidereal degrees 0-360
    const signDurationDays = SIGN_DURATION_DAYS[pid];

    // Degrees remaining in current sign
    const degInSign = longitude % 30;
    const degRemaining = 30 - degInSign;
    const daysPerDeg = signDurationDays / 30;
    const daysToNextSign = degRemaining * daysPerDeg;

    // Rahu/Ketu move in reverse — next sign is currentSign - 1
    const isRetro = pid === 7 || pid === 8;

    // Project forward through signs until we exceed the window
    let daysFromNow = daysToNextSign;
    let sign = currentSign;

    // Also check if current sign is domain-relevant (planet is already there)
    if (domainSigns.has(sign)) {
      const house = houseFromSign(sign, ascSign);
      const nature = planetNatureForDomain(pid, domainConfig);
      const pName = grahaNameLocale(pid);
      const rName = rashiNameLocale(sign);

      // Already transiting — mark from now
      const startD = new Date(windowStart);
      const endD = new Date(windowStart);
      endD.setDate(endD.getDate() + Math.round(daysToNextSign));
      if (endD > windowStart) {
        triggers.push({
          startDate: toISODate(startD),
          endDate: toISODate(endD > windowEnd ? windowEnd : endD),
          triggerType: 'transit',
          planets: [pid],
          nature,
          description: {
            en: `${pName.en} transiting ${rName.en} (${ordinal(house)} house) — impacts ${domainConfig.name.en}`,
            hi: `${pName.hi ?? pName.en} ${rName.hi ?? rName.en} में गोचर (${house}वाँ भाव) — ${domainConfig.name.hi ?? domainConfig.name.en} पर प्रभाव`,
          },
        });
      }
    }

    // Project future ingresses
    const maxDays = (windowEnd.getTime() - windowStart.getTime()) / (1000 * 60 * 60 * 24);

    for (let i = 0; i < 24 && daysFromNow <= maxDays; i++) {
      // Next sign
      if (isRetro) {
        sign = sign === 1 ? 12 : sign - 1;
      } else {
        sign = sign === 12 ? 1 : sign + 1;
      }

      if (domainSigns.has(sign)) {
        const ingressDate = new Date(windowStart);
        ingressDate.setDate(ingressDate.getDate() + Math.round(daysFromNow));

        if (ingressDate >= windowStart && ingressDate <= windowEnd) {
          const house = houseFromSign(sign, ascSign);
          const nature = planetNatureForDomain(pid, domainConfig);
          const pName = grahaNameLocale(pid);
          const rName = rashiNameLocale(sign);

          const endD = new Date(ingressDate);
          endD.setDate(endD.getDate() + Math.round(signDurationDays));

          triggers.push({
            startDate: toISODate(ingressDate),
            endDate: toISODate(endD > windowEnd ? windowEnd : endD),
            triggerType: 'transit',
            planets: [pid],
            nature,
            description: {
              en: `${pName.en} enters ${rName.en} (${ordinal(house)} house) — impacts ${domainConfig.name.en}`,
              hi: `${pName.hi ?? pName.en} ${rName.hi ?? rName.en} में प्रवेश (${house}वाँ भाव) — ${domainConfig.name.hi ?? domainConfig.name.en} पर प्रभाव`,
            },
          });
        }
      }

      daysFromNow += signDurationDays;
    }
  }

  return triggers;
}

// ---------------------------------------------------------------------------
// 3. Eclipse proximity triggers
// ---------------------------------------------------------------------------

/**
 * Simplified eclipse detection: eclipses happen near the Rahu/Ketu axis
 * approximately every 6 months. If the domain involves houses near the
 * nodal axis (houses containing Rahu or Ketu), flag eclipse windows.
 */
function computeEclipseTriggers(
  domainConfig: DomainConfig,
  kundali: KundaliData,
  windowStart: Date,
  windowEnd: Date,
): TimelineTrigger[] {
  const triggers: TimelineTrigger[] = [];

  const rahuPos = kundali.planets.find(p => p.planet.id === 7);
  const ketuPos = kundali.planets.find(p => p.planet.id === 8);
  if (!rahuPos || !ketuPos) return triggers;

  const ascSign = kundali.ascendant.sign;
  const rahuHouse = rahuPos.house;
  const ketuHouse = ketuPos.house;

  // Check if domain involves houses near the nodal axis
  const domainHouses = new Set([
    ...domainConfig.primaryHouses,
  ]);

  const nodalHouses = new Set([rahuHouse, ketuHouse]);
  const domainNearNodes = [...domainHouses].some(h => nodalHouses.has(h));

  if (!domainNearNodes) return triggers;

  // Generate eclipse windows every ~173 days (eclipse half-year)
  const ECLIPSE_INTERVAL_DAYS = 173;
  const ECLIPSE_WINDOW_DAYS = 14; // ±1 week around eclipse

  const maxDays = (windowEnd.getTime() - windowStart.getTime()) / (1000 * 60 * 60 * 24);

  // Start from approximate next eclipse (simplified: every 173 days from a reference)
  // Use a reference solar eclipse epoch: Jan 2026 ~= 2460676 JD
  const refDate = new Date('2026-01-01');
  const daysSinceRef = (windowStart.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
  const offsetToNext = ECLIPSE_INTERVAL_DAYS - (((daysSinceRef % ECLIPSE_INTERVAL_DAYS) + ECLIPSE_INTERVAL_DAYS) % ECLIPSE_INTERVAL_DAYS);

  for (let daysOut = offsetToNext; daysOut <= maxDays; daysOut += ECLIPSE_INTERVAL_DAYS) {
    const eclipseDate = new Date(windowStart);
    eclipseDate.setDate(eclipseDate.getDate() + Math.round(daysOut));

    if (eclipseDate > windowEnd) break;

    const startD = new Date(eclipseDate);
    startD.setDate(startD.getDate() - Math.floor(ECLIPSE_WINDOW_DAYS / 2));
    const endD = new Date(eclipseDate);
    endD.setDate(endD.getDate() + Math.floor(ECLIPSE_WINDOW_DAYS / 2));

    triggers.push({
      startDate: toISODate(startD < windowStart ? windowStart : startD),
      endDate: toISODate(endD > windowEnd ? windowEnd : endD),
      triggerType: 'dasha_transit_confluence', // eclipse is a special confluence
      planets: [7, 8], // Rahu + Ketu
      nature: 'challenge',
      description: {
        en: `Eclipse window near Rahu-Ketu axis — heightened sensitivity for ${domainConfig.name.en}`,
        hi: `राहु-केतु अक्ष पर ग्रहण काल — ${domainConfig.name.hi ?? domainConfig.name.en} के लिए संवेदनशील अवधि`,
      },
    });
  }

  return triggers;
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function ordinal(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}
