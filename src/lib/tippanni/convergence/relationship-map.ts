// src/lib/tippanni/convergence/relationship-map.ts
//
// Bridges KundaliData (rich chart data) into the flat ConvergenceInput
// that the pattern engine consumes. This is the ONLY place where existing
// kundali types meet the new convergence types.

import type { KundaliData } from '@/types/kundali';
import type { ConvergenceInput, RelationshipMap } from './types';
import { getSignLord } from '@/lib/tippanni/utils';
import { getHouseFromMoon } from './utils';
import {
  dateToJD,
  getPlanetaryPositions,
  toSidereal,
  getRashiNumber,
} from '@/lib/ephem/astronomical';

// ─── Planet name → ID map ───────────────────────────────────────────────────

const PLANET_NAME_TO_ID: Record<string, number> = {
  // English
  sun: 0, moon: 1, mars: 2, mercury: 3, jupiter: 4,
  venus: 5, saturn: 6, rahu: 7, ketu: 8,
  // Hindi
  'सूर्य': 0, 'चन्द्रमा': 1, 'मंगल': 2, 'बुध': 3,
  'बृहस्पति': 4, 'शुक्र': 5, 'शनि': 6, 'राहु': 7, 'केतु': 8,
  // Sanskrit
  'सूर्यः': 0, 'चन्द्रः': 1, 'मङ्गलः': 2, 'बुधः': 3,
  'बृहस्पतिः': 4, 'शुक्रः': 5, 'शनिः': 6, 'राहुः': 7, 'केतुः': 8,
};

function planetNameToId(name: string): number {
  const lower = name.toLowerCase().trim();
  return PLANET_NAME_TO_ID[lower] ?? PLANET_NAME_TO_ID[name.trim()] ?? -1;
}

// ─── Current date JD ────────────────────────────────────────────────────────

function getCurrentJD(): number {
  const now = new Date();
  return dateToJD(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate() + now.getUTCHours() / 24,
  );
}

// ─── ShadBala lookup ────────────────────────────────────────────────────────

function getShadBalaValue(
  planetId: number,
  shadbalaList: KundaliData['shadbala'],
): number {
  if (!shadbalaList || shadbalaList.length === 0) return 1.0;
  const entry = shadbalaList.find((s) => planetNameToId(s.planet) === planetId);
  return entry ? entry.totalStrength : 1.0;
}

// ─── Dasha helpers ──────────────────────────────────────────────────────────

function isDateInRange(dateStr: string, now: Date): boolean {
  const start = new Date(dateStr);
  return !isNaN(start.getTime());
}

function findCurrentMahaDasha(dashas: KundaliData['dashas'], now: Date) {
  return dashas.find((d) => {
    if (d.level !== 'maha') return false;
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    return now >= start && now <= end;
  });
}

function findCurrentAntarDasha(subPeriods: KundaliData['dashas'][0]['subPeriods'], now: Date) {
  if (!subPeriods || subPeriods.length === 0) return undefined;
  return subPeriods.find((d) => {
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    return now >= start && now <= end;
  });
}

function isDashaTransitionWithin6Months(dashas: KundaliData['dashas'], now: Date): boolean {
  const sixMonthsMs = 6 * 30 * 24 * 60 * 60 * 1000;
  const futureDate = new Date(now.getTime() + sixMonthsMs);

  // Check if current maha dasha ends within 6 months
  const currentMaha = findCurrentMahaDasha(dashas, now);
  if (currentMaha) {
    const end = new Date(currentMaha.endDate);
    if (end <= futureDate) return true;
  }

  // Check if current antar dasha ends within 6 months
  if (currentMaha?.subPeriods) {
    const currentAntar = findCurrentAntarDasha(currentMaha.subPeriods, now);
    if (currentAntar) {
      const end = new Date(currentAntar.endDate);
      if (end <= futureDate) return true;
    }
  }

  return false;
}

// ─── Main builder ───────────────────────────────────────────────────────────

export function buildConvergenceInput(kundali: KundaliData): ConvergenceInput {
  const now = new Date();
  const ascendant = kundali.ascendant.sign;

  // 1. Find Moon sign
  const moonPlanet = kundali.planets.find((p) => p.planet.id === 1);
  const moonSign = moonPlanet?.sign ?? 1;

  // 2. Map planets to simpler structure
  const planets = kundali.planets.map((p) => ({
    id: p.planet.id,
    house: p.house,
    sign: p.sign,
    isRetrograde: p.isRetrograde,
    isCombust: p.isCombust,
    isExalted: p.isExalted,
    isDebilitated: p.isDebilitated,
    isOwnSign: p.isOwnSign,
    shadbala: getShadBalaValue(p.planet.id, kundali.shadbala),
  }));

  // 3. Build 12 houses
  const houses: { house: number; sign: number; lordId: number }[] = [];
  for (let h = 1; h <= 12; h++) {
    const hc = kundali.houses.find((hh) => hh.house === h);
    if (hc) {
      const lordId = planetNameToId(hc.lord);
      houses.push({
        house: h,
        sign: hc.sign,
        lordId: lordId >= 0 ? lordId : getSignLord(hc.sign),
      });
    } else {
      // Fill gap using ascendant-based calculation
      const sign = ((ascendant - 1 + h - 1) % 12) + 1;
      houses.push({ house: h, sign, lordId: getSignLord(sign) });
    }
  }

  // 4. Dasha: current maha and antar
  const currentMaha = findCurrentMahaDasha(kundali.dashas, now);
  const dashaLord = currentMaha ? planetNameToId(currentMaha.planet) : 0;

  const currentAntar = currentMaha?.subPeriods
    ? findCurrentAntarDasha(currentMaha.subPeriods, now)
    : undefined;
  const antarLord = currentAntar ? planetNameToId(currentAntar.planet) : dashaLord;

  // 5. Dasha transition within 6 months
  const dashaTransitionWithin6Months = isDashaTransitionWithin6Months(kundali.dashas, now);

  // 6. Compute current transits
  const currentJD = getCurrentJD();
  const rawPositions = getPlanetaryPositions(currentJD);
  const transits = rawPositions.map((pos) => {
    const sidLong = toSidereal(pos.longitude, currentJD);
    const sign = getRashiNumber(sidLong);
    return {
      planetId: pos.id,
      sign,
      isRetrograde: pos.isRetrograde,
    };
  });

  // 7. Build RelationshipMap
  const houseRulers: Record<number, number> = {};
  for (const h of houses) {
    houseRulers[h.house] = h.lordId;
  }

  const planetHouses: Record<number, number> = {};
  const planetSigns: Record<number, number> = {};
  for (const p of planets) {
    planetHouses[p.id] = p.house;
    planetSigns[p.id] = p.sign;
  }

  const transitHouses: Record<number, number> = {};
  for (const t of transits) {
    transitHouses[t.planetId] = getHouseFromMoon(moonSign, t.sign);
  }

  const relationships: RelationshipMap = {
    houseRulers,
    planetHouses,
    planetSigns,
    transitHouses,
    dashaLord: dashaLord >= 0 ? dashaLord : 0,
    antarLord: antarLord >= 0 ? antarLord : 0,
  };

  // 8. Extract yoga IDs
  const yogaIds: string[] = [];
  if (kundali.yogasComplete) {
    for (const y of kundali.yogasComplete) {
      if (y.present) {
        yogaIds.push(y.id);
      }
    }
  }

  // 9. Extract dosha IDs (doshas are yogas with category === 'dosha')
  const doshaIds: string[] = [];
  if (kundali.yogasComplete) {
    for (const y of kundali.yogasComplete) {
      if (y.present && y.category === 'dosha') {
        doshaIds.push(y.id);
      }
    }
  }

  // 10. Ashtakavarga data
  const ashtakavargaSAV = kundali.ashtakavarga?.savTable ?? new Array(12).fill(0);
  const ashtakavargaBPI = kundali.ashtakavarga?.bpiTable ?? [];

  // 11. Navamsha confirmations — check if key planets for each theme are strong in D9
  // Keyed by theme name (career, relationship, wealth, health, spiritual, family)
  // so the meta-interaction rule `navamsha-confirmation` can look them up by theme.
  const navamshaConfirmations: Record<string, boolean> = {};

  if (kundali.navamshaChart) {
    // First, determine which planet IDs are "confirmed" (own/exalted sign) in D9
    const confirmedPlanetIds = new Set<number>();
    const navHouses = kundali.navamshaChart.houses;
    const navAsc = kundali.navamshaChart.ascendantSign;

    // EXALTED signs per planet: Sun→1(Aries), Moon→2(Taurus), Mars→10(Capricorn),
    // Mercury→6(Virgo), Jupiter→4(Cancer), Venus→12(Pisces), Saturn→7(Libra)
    const EXALT_SIGN: Record<number, number> = { 0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7 };
    // OWN signs per planet (simplified — first own sign)
    const OWN_SIGN: Record<number, number[]> = {
      0: [5], 1: [4], 2: [1, 8], 3: [3, 6], 4: [9, 12], 5: [2, 7], 6: [10, 11],
    };

    for (const p of planets) {
      if (p.id > 6) continue; // Skip Rahu/Ketu — no exaltation/own sign
      for (let hIdx = 0; hIdx < navHouses.length; hIdx++) {
        if (navHouses[hIdx]?.includes(p.id)) {
          const navSign = ((navAsc - 1 + hIdx) % 12) + 1;
          const isExalted = EXALT_SIGN[p.id] === navSign;
          const isOwnSign = (OWN_SIGN[p.id] ?? []).includes(navSign);
          if (isExalted || isOwnSign) confirmedPlanetIds.add(p.id);
          break;
        }
      }
    }

    // Map confirmed planet IDs to themes
    // A theme is "confirmed" if at least one key planet for it is strong in D9
    const THEME_PLANETS: Record<string, number[]> = {
      career:       [0, 2, 3, 4, 6], // Sun, Mars, Mercury, Jupiter, Saturn
      relationship: [1, 4, 5],        // Moon, Jupiter, Venus
      wealth:       [3, 4, 5, 6],     // Mercury, Jupiter, Venus, Saturn
      health:       [0, 2, 4],        // Sun, Mars, Jupiter (vitality)
      spiritual:    [4, 8, 6],        // Jupiter, Ketu, Saturn
      family:       [1, 4, 5],        // Moon, Jupiter, Venus
    };

    for (const [theme, pids] of Object.entries(THEME_PLANETS)) {
      navamshaConfirmations[theme] = pids.some((id) => confirmedPlanetIds.has(id));
    }
  }

  return {
    ascendant,
    moonSign,
    planets,
    houses,
    dashaLord: dashaLord >= 0 ? dashaLord : 0,
    antarLord: antarLord >= 0 ? antarLord : 0,
    yogaIds,
    doshaIds,
    transits,
    ashtakavargaSAV,
    ashtakavargaBPI,
    relationships,
    dashaTransitionWithin6Months,
    navamshaConfirmations,
  };
}
