/**
 * Context Builder — KundaliData → StructuredAstrologicalContext (SAC)
 *
 * Translates the engine's output into a flattened, LLM-readable format
 * that serves as the single source of truth for both prompt construction
 * and the validation wall.
 *
 * This file addresses Review Issues 1-8 from ai-pandit-design.md §11:
 *  - Issue 1: computeCurrentTransits() correct signature (natalAscSign, not KundaliData)
 *  - Issue 2: TransitEntry.currentSign (not .transitSign)
 *  - Issue 3: YogaComplete.present (not .detected), strength capitalised
 *  - Issue 4: SadeSatiAnalysis.currentPhase (not .phase)
 *  - Issue 5: SHADBALA_REQUIRED defined inline
 *  - Issue 6: planetNameToId() defined locally
 *  - Issue 7: scoreDomain() returns RatingInfo → mapped to Verdict
 *  - Issue 8: DashaEntry.planet is string → mapped via planetNameToId()
 */

import type { KundaliData, PlanetPosition, DashaEntry } from '@/types/kundali';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import {
  EXALTATION_SIGNS,
  DEBILITATION_SIGNS,
  SIGN_LORDS,
  MOOLATRIKONA,
} from '@/lib/constants/dignities';
import { getNakshatraNumber, getNakshatraPada } from '@/lib/ephem/astronomical';
import { computeCurrentTransits } from '@/lib/kundali/domain-synthesis/transit-activation';
import type {
  StructuredAstrologicalContext,
  SACPlanet,
  SACDasha,
  SACYoga,
  SACDosha,
  SACTransit,
  Verdict,
  VerdictFactor,
  QueryCategory,
} from '../types';

// Module-local shared constants (CLAUDE.md Lesson Q: single source)
import { PLANET_NAME_TO_ID, SHADBALA_MIN_REQUIRED, FRIENDS, ENEMIES } from '../constants';

// ─────────────────────────────────────────────────────────────────────────────
// Dignity computation
// ─────────────────────────────────────────────────────────────────────────────

function computeDignity(planetId: number, sign: number): string {
  if (EXALTATION_SIGNS[planetId] === sign) return 'exalted';
  if (DEBILITATION_SIGNS[planetId] === sign) return 'debilitated';

  // Check moolatrikona — MOOLATRIKONA maps planetId → { sign, startDeg, endDeg }
  // For sign-level check, just matching the sign is sufficient
  const mt = MOOLATRIKONA[planetId];
  if (mt && mt.sign === sign) return 'moolatrikona';

  const signLord = SIGN_LORDS[sign];
  if (signLord === planetId) return 'own';
  if (FRIENDS[planetId]?.has(signLord)) return 'friend';
  if (ENEMIES[planetId]?.has(signLord)) return 'enemy';
  return 'neutral';
}

// ─────────────────────────────────────────────────────────────────────────────
// Dasha helpers (Issue 8: DashaEntry.planet is string)
// ─────────────────────────────────────────────────────────────────────────────

function findActiveDasha(
  dashas: DashaEntry[],
  today: string,
  level: 'maha' | 'antar' | 'pratyantar',
): DashaEntry | undefined {
  return dashas.find(d =>
    d.level === level && d.startDate <= today && d.endDate > today
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rating → Verdict mapping (Issue 7)
// ─────────────────────────────────────────────────────────────────────────────

type Rating = 'uttama' | 'madhyama' | 'adhama' | 'atyadhama';

function ratingToVerdict(rating: Rating): Verdict {
  switch (rating) {
    case 'uttama': return 'FAVOURABLE';
    case 'madhyama': return 'MIXED';
    case 'adhama': return 'CAUTION';
    case 'atyadhama': return 'CHALLENGING';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a StructuredAstrologicalContext from a KundaliData object.
 *
 * @param kundali - The engine's complete chart output.
 * @param category - The query category (used for primary verdict selection).
 * @param today - ISO date string for "today" (injectable for testing). Defaults to current date.
 */
export function buildContext(
  kundali: KundaliData,
  category: QueryCategory = 'general',
  today?: string,
): StructuredAstrologicalContext {
  // .toISOString() returns UTC — correct for dasha date string comparison (Lesson L)
  const todayStr = today ?? new Date().toISOString().slice(0, 10);

  // ── Birth ──
  const birth = {
    date: kundali.birthData.date,
    time: kundali.birthData.time,
    place: kundali.birthData.place,
    coordinates: [kundali.birthData.lat, kundali.birthData.lng] as [number, number],
    timezone: kundali.birthData.timezone,
  };

  // ── Ascendant ──
  const ascSign = kundali.ascendant.sign;
  const ascDeg = kundali.ascendant.degree;
  // Convert absolute degree (within sign) to sidereal longitude for nakshatra lookup
  const ascSiderealLong = (ascSign - 1) * 30 + ascDeg;
  const ascNakNum = getNakshatraNumber(ascSiderealLong);
  const ascNak = NAKSHATRAS[ascNakNum - 1];
  const ascPada = getNakshatraPada(ascSiderealLong);

  const ascendant = {
    sign: ascSign,
    signName: RASHIS[ascSign - 1]?.name.en ?? 'Unknown',
    degree: formatDegree(ascDeg),
    nakshatra: ascNak?.name.en ?? 'Unknown',
    pada: ascPada,
  };

  // ── Planets ──
  const planets: SACPlanet[] = kundali.planets.map(p => ({
    id: p.planet.id,
    name: GRAHAS[p.planet.id]?.name.en ?? p.planet.name.en ?? 'Unknown',
    sign: p.sign,
    signName: RASHIS[p.sign - 1]?.name.en ?? 'Unknown',
    house: p.house,
    degree: p.degree,
    nakshatra: p.nakshatra?.name.en ?? 'Unknown',
    pada: p.pada,
    dignity: computeDignity(p.planet.id, p.sign),
    isRetrograde: p.isRetrograde,
    isCombust: p.isCombust,
    speed: p.speed ?? 0,
  }));

  // ── Dasha (Issue 8: planet is a string, map to ID) ──
  const activeMaha = findActiveDasha(kundali.dashas, todayStr, 'maha')
    ?? kundali.dashas[0]; // Fallback to first if none matches (edge case)
  const activeAntar = activeMaha?.subPeriods
    ? findActiveDasha(activeMaha.subPeriods, todayStr, 'antar')
      ?? activeMaha.subPeriods[0]
    : undefined;
  const activePratyantar = activeAntar?.subPeriods
    ? findActiveDasha(activeAntar.subPeriods, todayStr, 'pratyantar')
    : undefined;

  const dasha: SACDasha = {
    mahadasha: {
      lordId: PLANET_NAME_TO_ID[activeMaha.planet] ?? -1,
      lordName: activeMaha.planet,
      start: activeMaha.startDate,
      end: activeMaha.endDate,
    },
    antardasha: activeAntar ? {
      lordId: PLANET_NAME_TO_ID[activeAntar.planet] ?? -1,
      lordName: activeAntar.planet,
      start: activeAntar.startDate,
      end: activeAntar.endDate,
    } : { lordId: -1, lordName: 'Unknown', start: '', end: '' },
    pratyantardasha: activePratyantar ? {
      lordId: PLANET_NAME_TO_ID[activePratyantar.planet] ?? -1,
      lordName: activePratyantar.planet,
      start: activePratyantar.startDate,
      end: activePratyantar.endDate,
    } : undefined,
  };

  // ── Yogas (Issue 3: .present not .detected, strength capitalised) ──
  const yogasRaw = kundali.yogasComplete ?? [];
  const yogas: SACYoga[] = yogasRaw
    .filter((y: YogaComplete) => y.present && y.category !== 'dosha')
    .map((y: YogaComplete) => ({
      name: y.name.en,
      planets: [], // YogaComplete doesn't carry planet IDs
      strength: y.strength.toLowerCase() as SACYoga['strength'],
      category: y.category,
      isAuspicious: y.isAuspicious,
      classicalRef: '',
    }));

  // If evaluatedYogas available (richer), prefer them for planet IDs + classicalRef
  if (kundali.evaluatedYogas) {
    for (const ey of kundali.evaluatedYogas) {
      if (!ey.present || ey.cancellationStatus?.anyCancelled) continue;
      // Check if already in yogas from yogasComplete (avoid duplicates)
      const exists = yogas.some(y => y.name.toLowerCase() === ey.name.en.toLowerCase());
      if (!exists) {
        yogas.push({
          name: ey.name.en,
          planets: ey.involvedPlanets ?? [],
          strength: ey.strength.toLowerCase() as SACYoga['strength'],
          category: ey.group,
          isAuspicious: ey.isAuspicious,
          classicalRef: ey.classicalRef ?? '',
        });
      } else {
        // Enrich existing entry with planet IDs and classicalRef
        const existing = yogas.find(y => y.name.toLowerCase() === ey.name.en.toLowerCase());
        if (existing) {
          if (ey.involvedPlanets?.length) existing.planets = ey.involvedPlanets;
          if (ey.classicalRef) existing.classicalRef = ey.classicalRef;
        }
      }
    }
  }

  // ── Doshas (Issue 3: .present not .detected) ──
  const doshas: SACDosha[] = yogasRaw
    .filter((y: YogaComplete) => y.category === 'dosha' && y.present)
    .map((y: YogaComplete) => ({
      name: y.name.en,
      severity: 'moderate' as const, // YogaComplete has no severity — default
    }));

  // ── Transits (Issue 1: correct signature, Issue 2: .currentSign) ──
  // computeCurrentTransits takes natalAscSign (number), not KundaliData
  const moonSign = kundali.planets.find(p => p.planet.id === 1)?.sign ?? 1;
  const savTable = kundali.ashtakavarga?.savTable ?? [];

  const transitEntries = computeCurrentTransits(ascSign);
  const transits: SACTransit[] = transitEntries.map(t => {
    // transitHouse is already computed from lagna by the function
    const houseFromLagna = t.transitHouse;
    // Compute house from Moon separately
    const houseFromMoon = ((t.currentSign - moonSign + 12) % 12) + 1;
    return {
      planetId: t.planetId,
      planetName: GRAHAS[t.planetId]?.name.en ?? 'Unknown',
      sign: t.currentSign,                      // Issue 2: .currentSign not .transitSign
      houseFromMoon,
      houseFromLagna,
      isRetrograde: t.isRetrograde,
      savBindus: savTable[houseFromLagna - 1] ?? 0, // Issue 1: join SAV separately
    };
  });

  // ── Sade Sati (Issue 4: .currentPhase not .phase) ──
  const sadeSati = kundali.sadeSati
    ? { active: kundali.sadeSati.isActive, phase: kundali.sadeSati.currentPhase }
    : { active: false, phase: null as 'rising' | 'peak' | 'setting' | null };

  // ── Kaal Sarpa ──
  const kaalSarpaYoga = yogasRaw.find(
    (y: YogaComplete) => y.id?.toLowerCase().includes('kaal_sarpa') && y.present
  );
  const kaalSarpa = {
    active: !!kaalSarpaYoga,
    type: kaalSarpaYoga?.name.en ?? null,
  };

  // ── Shadbala (Issue 5: SHADBALA_REQUIRED defined inline) ──
  const shadbala: Record<number, { total: number; required: number; ratio: number }> = {};
  for (const sb of kundali.shadbala) {
    const pid = PLANET_NAME_TO_ID[sb.planet];
    if (pid === undefined) continue;
    const required = SHADBALA_MIN_REQUIRED[pid] ?? 300;
    shadbala[pid] = {
      total: sb.totalStrength,
      required,
      ratio: sb.totalStrength / required,
    };
  }

  // ── Ashtakavarga ──
  const ashtakavarga = kundali.ashtakavarga
    ? { houseScores: kundali.ashtakavarga.savTable }
    : null;

  // ── Domain verdicts (Issue 7: map Rating → Verdict) ──
  // For v1, we derive verdicts from the existing domain synthesis if available.
  // If no PersonalReading is pre-computed, we produce a basic verdict from
  // planet dignities and dasha activation for the queried category.
  const domainVerdicts = buildDomainVerdicts(kundali, yogas, doshas, dasha);

  // ── Primary verdict ──
  const primaryDomain = domainVerdicts[category];
  const primaryVerdict = primaryDomain?.verdict ?? 'MIXED';
  const primaryFactors = primaryDomain?.factors ?? [];

  return {
    birth, ascendant, planets, dasha, yogas, doshas, transits,
    sadeSati, kaalSarpa, shadbala, ashtakavarga,
    domainVerdicts, primaryVerdict, primaryFactors,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain verdict builder (lightweight — no scorer dependency for v1)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds simple domain verdicts from chart data without importing the full
 * domain-synthesis scorer (which requires constructing ScorerInput — non-trivial).
 *
 * For v1, verdicts are derived from:
 * 1. Count of strong vs weak planets
 * 2. Yoga/dosha balance
 * 3. Sade Sati status
 *
 * This is intentionally simpler than the full scorer — the LLM narrative
 * compensates for nuance. The validation wall only needs directional alignment.
 */
function buildDomainVerdicts(
  kundali: KundaliData,
  yogas: SACYoga[],
  doshas: SACDosha[],
  _dasha: SACDasha,
): Partial<Record<QueryCategory, { verdict: Verdict; score: number; factors: VerdictFactor[] }>> {
  const factors: VerdictFactor[] = [];
  let score = 5.0; // Start neutral

  // Strong dignities boost
  const strongPlanets = kundali.planets.filter(
    p => p.isExalted || p.isOwnSign
  );
  if (strongPlanets.length >= 3) {
    score += 1.5;
    factors.push({
      type: 'dignity',
      detail: `${strongPlanets.length} planets in strong dignity (exalted/own sign)`,
      sentiment: 'positive',
      weight: 0.7,
    });
  } else if (strongPlanets.length >= 1) {
    score += 0.5;
    factors.push({
      type: 'dignity',
      detail: `${strongPlanets.length} planet(s) in strong dignity`,
      sentiment: 'positive',
      weight: 0.5,
    });
  }

  // Debilitated planets drag down
  const weakPlanets = kundali.planets.filter(p => p.isDebilitated);
  if (weakPlanets.length > 0) {
    score -= weakPlanets.length * 0.8;
    factors.push({
      type: 'dignity',
      detail: `${weakPlanets.length} debilitated planet(s)`,
      sentiment: 'negative',
      weight: 0.6,
    });
  }

  // Yoga boost
  const auspiciousYogas = yogas.filter(y => y.isAuspicious);
  if (auspiciousYogas.length > 0) {
    score += Math.min(auspiciousYogas.length * 0.5, 2);
    factors.push({
      type: 'yoga',
      detail: `${auspiciousYogas.length} auspicious yoga(s): ${auspiciousYogas.map(y => y.name).join(', ')}`,
      sentiment: 'positive',
      weight: 0.6,
    });
  }

  // Dosha penalty
  if (doshas.length > 0) {
    score -= doshas.length * 0.7;
    factors.push({
      type: 'dosha',
      detail: `${doshas.length} active dosha(s): ${doshas.map(d => d.name).join(', ')}`,
      sentiment: 'negative',
      weight: 0.7,
    });
  }

  // Sade Sati penalty
  if (kundali.sadeSati?.isActive) {
    const phase = kundali.sadeSati.currentPhase;
    const penalty = phase === 'peak' ? 1.5 : 0.8;
    score -= penalty;
    factors.push({
      type: 'special',
      detail: `Sade Sati active (${phase ?? 'unknown'} phase)`,
      sentiment: 'negative',
      weight: phase === 'peak' ? 0.9 : 0.6,
    });
  }

  // Clamp score
  score = Math.max(0, Math.min(10, score));

  // Score → verdict
  let verdict: Verdict;
  if (score >= 7) verdict = 'FAVOURABLE';
  else if (score >= 5) verdict = 'MIXED';
  else if (score >= 3) verdict = 'CAUTION';
  else verdict = 'CHALLENGING';

  // Apply same verdict to all categories for v1
  // (full domain-specific scoring is a v2 enhancement using scoreDomain)
  const result: Partial<Record<QueryCategory, { verdict: Verdict; score: number; factors: VerdictFactor[] }>> = {};
  const categories: QueryCategory[] = ['career', 'relationship', 'health', 'wealth', 'children', 'education', 'spiritual', 'general'];
  // Spread factors to avoid shared reference mutation (code review warning 4)
  for (const cat of categories) {
    result[cat] = { verdict, score, factors: [...factors] };
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Format a decimal degree (within sign, 0-30) as DD°MM'SS". */
function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const mFrac = (deg - d) * 60;
  const m = Math.floor(mFrac);
  const s = Math.floor((mFrac - m) * 60);
  return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}
