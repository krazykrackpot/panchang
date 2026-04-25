/**
 * Disease Susceptibility Profile — aggregates body map scores and matches
 * classical disease signature patterns from the chart.
 *
 * Sources: BPHS Ch.24, Sarvartha Chintamani, Phala Deepika
 */

import type { KundaliData } from '@/types/kundali';
import {
  DISEASE_PATTERNS,
  SIGN_LORD,
  type DiseasePatternCtx,
} from './constants';
import type { BodyRegionResult } from './body-map';

export interface TopVulnerability {
  system: string;
  score: number;
  factors: string[];
}

export interface SignaturePattern {
  id: string;
  name: string;
  description: string;
  present: boolean;
}

export interface DiseaseProfileResult {
  topVulnerabilities: TopVulnerability[];
  signaturePatterns: SignaturePattern[];
}

export function computeDiseaseProfile(
  kundali: KundaliData,
  bodyMap: BodyRegionResult[],
): DiseaseProfileResult {
  // ── Top vulnerabilities from body map ────────────────────────────────────
  const sorted = [...bodyMap].sort((a, b) => b.vulnerability - a.vulnerability);
  const topVulnerabilities: TopVulnerability[] = sorted
    .filter((r) => r.vulnerability > 0)
    .slice(0, 5)
    .map((r) => ({
      system: r.bodyRegion.en,
      score: r.vulnerability,
      factors: r.factors,
    }));

  // ── Build disease pattern context ────────────────────────────────────────
  const planetHouse = new Map<number, number>();
  const planetSign = new Map<number, number>();
  const planetCombust = new Map<number, boolean>();
  const planetDebilitated = new Map<number, boolean>();
  const planetRetrograde = new Map<number, boolean>();

  for (const p of kundali.planets) {
    planetHouse.set(p.planet.id, p.house);
    planetSign.set(p.planet.id, p.sign);
    planetCombust.set(p.planet.id, p.isCombust);
    planetDebilitated.set(p.planet.id, p.isDebilitated);
    planetRetrograde.set(p.planet.id, p.isRetrograde);
  }

  const houseVulnerability = bodyMap.map((r) => r.vulnerability);

  const ctx: DiseasePatternCtx = {
    houseVulnerability,
    planetHouse,
    planetSign,
    planetCombust,
    planetDebilitated,
    planetRetrograde,
    lagnaSign: kundali.ascendant.sign,
  };

  // ── Evaluate each disease pattern ────────────────────────────────────────
  const signaturePatterns: SignaturePattern[] = DISEASE_PATTERNS.map((def) => {
    let present = false;
    try {
      present = def.detect(ctx);
    } catch (err) {
      console.error('[medical/disease-profile] pattern detection failed:', err);
    }
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      present,
    };
  });

  return { topVulnerabilities, signaturePatterns };
}
