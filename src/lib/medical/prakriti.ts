/**
 * Prakriti Calculator — derives Ayurvedic constitution (Vata/Pitta/Kapha)
 * from the birth chart using 5 weighted factors.
 *
 * Sources: Charaka Samhita, Ashtanga Hridayam, BPHS Ch.3
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import {
  PLANET_DOSHA,
  SIGN_ELEMENT,
  ELEMENT_DOSHA_SCORES,
  SIGN_LORD,
  type Dosha,
} from './constants';

export interface PrakritiResult {
  vata: number;
  pitta: number;
  kapha: number;
  /** Dosha with highest score */
  primaryDosha: string;
  /** Dosha with second-highest score */
  secondaryDosha: string;
  /** Combined prakriti type e.g. "Pitta-Kapha" */
  prakritiType: string;
  /** Scores as percentages (0-100) */
  percentages: { vata: number; pitta: number; kapha: number };
}

interface RawScores {
  vata: number;
  pitta: number;
  kapha: number;
}

function addElementScores(
  scores: RawScores,
  sign: number,
  weight: number,
): void {
  const element = SIGN_ELEMENT[sign];
  if (!element) return;
  const doshaMap = ELEMENT_DOSHA_SCORES[element];
  for (const [dosha, pct] of Object.entries(doshaMap) as [Dosha, number][]) {
    scores[dosha] += (pct / 100) * weight;
  }
}

/**
 * Resolve Mercury's dosha: it takes the dosha of the strongest planet
 * in the same sign, falling back to vata if alone.
 */
function resolveMercuryDosha(
  mercury: PlanetPosition,
  planets: PlanetPosition[],
  shadbalaMap: Map<string, number>,
): Dosha {
  const sameSIgnPlanets = planets.filter(
    (p) =>
      p.planet.id !== 3 && // not Mercury itself
      p.sign === mercury.sign,
  );

  if (sameSIgnPlanets.length === 0) return 'vata';

  let bestDosha: Dosha = 'vata';
  let bestStrength = -1;

  for (const p of sameSIgnPlanets) {
    const dosha = PLANET_DOSHA[p.planet.id];
    if (dosha === 'tridosha') continue;
    const strength = shadbalaMap.get(p.planet.name?.en ?? '') ?? 0;
    if (strength > bestStrength) {
      bestStrength = strength;
      bestDosha = dosha;
    }
  }

  return bestDosha;
}

export function computePrakriti(kundali: KundaliData): PrakritiResult {
  const scores: RawScores = { vata: 0, pitta: 0, kapha: 0 };

  // Build shadbala map: planet name → total strength
  const shadbalaMap = new Map<string, number>();
  for (const sb of kundali.shadbala ?? []) {
    shadbalaMap.set(
      typeof sb.planetName === 'object'
        ? (sb.planetName as { en?: string }).en ?? sb.planet
        : sb.planet,
      sb.totalStrength,
    );
  }

  const lagnaSign = kundali.ascendant.sign; // 1-12

  // ── Factor 1: Lagna sign element (weight 30) ─────────────────────────────
  addElementScores(scores, lagnaSign, 30);

  // ── Factor 2: Moon sign element (weight 25) ──────────────────────────────
  const moon = kundali.planets.find((p) => p.planet.id === 1);
  if (moon) {
    addElementScores(scores, moon.sign, 25);
  }

  // ── Factor 3: Strongest planet by Shadbala (weight 20) ───────────────────
  let strongestPlanet: PlanetPosition | null = null;
  let highestStrength = -1;
  for (const p of kundali.planets) {
    const name =
      typeof p.planet.name === 'object'
        ? (p.planet.name as { en?: string }).en ?? ''
        : '';
    const strength = shadbalaMap.get(name) ?? 0;
    if (strength > highestStrength) {
      highestStrength = strength;
      strongestPlanet = p;
    }
  }
  if (strongestPlanet) {
    const rawDosha = PLANET_DOSHA[strongestPlanet.planet.id];
    if (rawDosha !== 'tridosha') {
      scores[rawDosha] += 20;
    } else {
      // Mercury is strongest — resolve its dosha
      const mercDosha = resolveMercuryDosha(
        strongestPlanet,
        kundali.planets,
        shadbalaMap,
      );
      scores[mercDosha] += 20;
    }
  }

  // ── Factor 4: Planets in 1st house (weight 15, split among planets) ──────
  const firstHousePlanets = kundali.planets.filter((p) => p.house === 1);
  if (firstHousePlanets.length > 0) {
    const perPlanet = 15 / firstHousePlanets.length;
    for (const p of firstHousePlanets) {
      const rawDosha = PLANET_DOSHA[p.planet.id];
      if (rawDosha !== 'tridosha') {
        scores[rawDosha] += perPlanet;
      } else {
        const mercDosha = resolveMercuryDosha(p, kundali.planets, shadbalaMap);
        scores[mercDosha] += perPlanet;
      }
    }
  }

  // ── Factor 5: Lagna lord's sign element (weight 10) ──────────────────────
  const lagnaLordId = SIGN_LORD[lagnaSign];
  if (lagnaLordId !== undefined) {
    const lagnaLord = kundali.planets.find(
      (p) => p.planet.id === lagnaLordId,
    );
    if (lagnaLord) {
      addElementScores(scores, lagnaLord.sign, 10);
    }
  }

  // ── Normalize to percentages ──────────────────────────────────────────────
  const total = scores.vata + scores.pitta + scores.kapha || 1;
  const percentages = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  // ── Determine primary / secondary dosha ──────────────────────────────────
  const sorted = (Object.entries(percentages) as [Dosha, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const primaryDosha = capitalize(sorted[0][0]);
  const secondaryDosha = capitalize(sorted[1][0]);
  const prakritiType = `${primaryDosha}-${secondaryDosha}`;

  return {
    ...scores,
    primaryDosha,
    secondaryDosha,
    prakritiType,
    percentages,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
