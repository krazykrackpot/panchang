/**
 * Gemstone Recommendation Engine
 *
 * Analyzes a kundali to score each planet's need for gemstone remediation.
 * Scoring based on BPHS Ch.83-84 principles:
 *   - Debilitation (+35)
 *   - Combustion (+20)
 *   - Dusthana placement (6/8/12) (+15)
 *   - Low Shadbala (< 40% of required minimum) (+25)
 *   - Retrograde in dusthana (+10)
 *   - Exalted / own sign (negative score — no remedy needed)
 *
 * Planets are classified into need levels:
 *   critical  (score >= 60)
 *   recommended (score 30-59)
 *   optional    (score 10-29)
 *   not_needed  (score < 10)
 */

import type { KundaliData, PlanetPosition, ShadBala } from '@/types/kundali';
import { PLANET_REMEDIES_FULL, type PlanetRemedyFull } from '@/lib/tippanni/remedies-enhanced';
import { GRAHAS } from '@/lib/constants/grahas';
import type { LocaleText } from '@/types/panchang';

// ─── Types ──────────────────────────────────────────────────────────────────

export type NeedLevel = 'critical' | 'recommended' | 'optional' | 'not_needed';

export interface GemstoneRecommendation {
  planetId: number;
  planetName: LocaleText;
  needScore: number;        // 0-100 (clamped)
  needLevel: NeedLevel;
  reasons: string[];        // English descriptions of why
  cautions: string[];       // Warnings about wearing
  remedy: PlanetRemedyFull;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DUSTHANA_HOUSES = new Set([6, 8, 12]);

/** Map: sign number (1-12) -> ruling planet id (0-8) */
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

/** Gemstone color hex for visual swatch — keyed by planet id */
export const GEMSTONE_COLORS: Record<number, string> = {
  0: '#e0115f', // Ruby red
  1: '#fafaf0', // Pearl white
  2: '#ff4500', // Red Coral
  3: '#50c878', // Emerald green
  4: '#ffe135', // Yellow Sapphire
  5: '#b9f2ff', // Diamond/clear
  6: '#0f52ba', // Blue Sapphire
  7: '#c27a2c', // Hessonite brown-orange
  8: '#c5b358', // Cat's Eye golden-green
};

// Natural benefics: Jupiter (4), Venus (5), Mercury (3 when alone), Moon (waxing).
// Malefics: Sun (0), Mars (2), Saturn (6), Rahu (7), Ketu (8).
const NATURAL_MALEFICS = new Set([0, 2, 6, 7, 8]);

// ─── Engine ─────────────────────────────────────────────────────────────────

export function generateGemstoneRecommendations(
  kundali: KundaliData,
): GemstoneRecommendation[] {
  const results: GemstoneRecommendation[] = [];
  const ascSign = kundali.ascendant.sign; // 1-12
  const lagnaLordId = SIGN_LORD[ascSign];

  for (let pid = 0; pid <= 8; pid++) {
    const planet = kundali.planets.find(p => p.planet.id === pid);
    if (!planet) continue;

    const remedy = PLANET_REMEDIES_FULL[pid];
    if (!remedy) continue;

    let score = 0;
    const reasons: string[] = [];
    const cautions: string[] = [];

    // --- Positive indicators (need remedy) ---

    // 1. Debilitated
    if (planet.isDebilitated) {
      score += 35;
      reasons.push('Debilitated (neecha) — planet at weakest dignity');
    }

    // 2. Combust (too close to Sun)
    if (planet.isCombust) {
      score += 20;
      reasons.push('Combust by Sun — significations weakened');
    }

    // 3. Dusthana placement
    if (DUSTHANA_HOUSES.has(planet.house)) {
      score += 15;
      reasons.push(`Placed in ${ordinal(planet.house)} house (dusthana)`);
    }

    // 4. Low Shadbala
    const sb = kundali.shadbala.find(s => s.planet === planet.planet.name.en);
    if (sb && sb.totalStrength < 40) {
      score += 25;
      reasons.push(`Low Shadbala strength (${sb.totalStrength.toFixed(0)}%)`);
    }

    // 5. Retrograde in dusthana — extra affliction
    if (planet.isRetrograde && DUSTHANA_HOUSES.has(planet.house)) {
      score += 10;
      reasons.push('Retrograde in dusthana — compounded weakness');
    }

    // 6. Mrityu Bhaga — critical degree
    if (planet.isMrityuBhaga) {
      score += 10;
      reasons.push('At Mrityu Bhaga (critical degree)');
    }

    // --- Negative indicators (reduce need) ---

    // Exalted
    if (planet.isExalted) {
      score -= 30;
      reasons.push('Exalted — naturally strong');
    }

    // Own sign
    if (planet.isOwnSign) {
      score -= 20;
      reasons.push('In own sign — comfortable and strong');
    }

    // Vargottama
    if (planet.isVargottama) {
      score -= 10;
      reasons.push('Vargottama — dignified across vargas');
    }

    // --- Cautions ---

    // Wearing a malefic planet's gemstone for lagna lord is generally fine,
    // but wearing it for a non-functional benefic in dusthana can be risky.
    if (NATURAL_MALEFICS.has(pid) && pid !== lagnaLordId) {
      cautions.push(
        'Natural malefic — consult a jyotishi before wearing. Gemstone amplifies the planet, including negative effects.'
      );
    }

    // Saturn gemstone caution — Blue Sapphire is notoriously sensitive
    if (pid === 6) {
      cautions.push(
        'Blue Sapphire (Neelam) is extremely potent. Wear for 3-day trial period first. Remove immediately if adverse effects.'
      );
    }

    // Rahu/Ketu — shadow planets, amplification is unpredictable
    if (pid === 7 || pid === 8) {
      cautions.push(
        'Shadow planet gemstone — effects can be unpredictable. Prefer mantra remedies unless specifically advised by a jyotishi.'
      );
    }

    // Clamp score
    const clamped = Math.max(0, Math.min(100, score));

    results.push({
      planetId: pid,
      planetName: GRAHAS[pid].name,
      needScore: clamped,
      needLevel: classifyNeed(clamped),
      reasons,
      cautions,
      remedy,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.needScore - a.needScore);
  return results;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function classifyNeed(score: number): NeedLevel {
  if (score >= 60) return 'critical';
  if (score >= 30) return 'recommended';
  if (score >= 10) return 'optional';
  return 'not_needed';
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
