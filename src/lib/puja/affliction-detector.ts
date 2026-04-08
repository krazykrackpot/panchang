/**
 * Affliction Detector — analyzes kundali planets and identifies
 * afflicted grahas that need remedial (graha shanti) pujas.
 */

export interface AfflictedPlanet {
  planetId: number;
  planetName: string;
  severity: 'mild' | 'moderate' | 'severe';
  reasons: string[];
  remedySlug: string;
}

interface PlanetInput {
  id: number;
  name: string;
  house: number; // 1-12
  isDebilitated?: boolean;
  isCombust?: boolean;
  isRetrograde?: boolean;
  shadbalaPercent?: number; // 0-100
}

const PLANET_SLUGS: Record<number, string> = {
  0: 'graha-shanti-surya',
  1: 'graha-shanti-chandra',
  2: 'graha-shanti-mangal',
  3: 'graha-shanti-budha',
  4: 'graha-shanti-guru',
  5: 'graha-shanti-shukra',
  6: 'graha-shanti-shani',
  7: 'graha-shanti-rahu',
  8: 'graha-shanti-ketu',
};

const DUSTHANA_HOUSES = new Set([6, 8, 12]);
const MANGAL_DOSHA_HOUSES = new Set([1, 4, 7, 8, 12]);

const SEVERITY_ORDER: Record<string, number> = {
  severe: 0,
  moderate: 1,
  mild: 2,
};

function escalate(
  current: 'mild' | 'moderate' | 'severe',
  target: 'mild' | 'moderate' | 'severe'
): 'mild' | 'moderate' | 'severe' {
  return SEVERITY_ORDER[target] < SEVERITY_ORDER[current] ? target : current;
}

export function detectAfflictedPlanets(planets: PlanetInput[]): AfflictedPlanet[] {
  const results: AfflictedPlanet[] = [];

  for (const p of planets) {
    const reasons: string[] = [];
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';
    const inDusthana = DUSTHANA_HOUSES.has(p.house);

    // 1. Dusthana placement
    if (inDusthana) {
      severity = escalate(severity, 'moderate');
      reasons.push(`In ${ordinal(p.house)} house (dusthana)`);
    }

    // 2. Debilitated
    if (p.isDebilitated) {
      severity = escalate(severity, 'severe');
      reasons.push('Debilitated');
    }

    // 3. Combust
    if (p.isCombust) {
      severity = escalate(severity, severity === 'severe' ? 'severe' : 'moderate');
      reasons.push('Combust');
    }

    // 4. Retrograde in dusthana
    if (p.isRetrograde && inDusthana) {
      severity = escalate(severity, 'severe');
      reasons.push('Retrograde in dusthana');
    }

    // 5. Low Shadbala
    if (p.shadbalaPercent !== undefined && p.shadbalaPercent < 50) {
      if (severity === 'mild') {
        severity = 'moderate';
      }
      reasons.push(`Low Shadbala (${Math.round(p.shadbalaPercent)}%)`);
    }

    // 6. Mangal Dosha
    if (p.id === 2 && MANGAL_DOSHA_HOUSES.has(p.house)) {
      severity = escalate(severity, 'moderate');
      reasons.push('Mangal Dosha position');
    }

    if (reasons.length > 0) {
      results.push({
        planetId: p.id,
        planetName: p.name,
        severity,
        reasons,
        remedySlug: PLANET_SLUGS[p.id] ?? `graha-shanti-${p.name.toLowerCase()}`,
      });
    }
  }

  // Sort by severity: severe → moderate → mild
  results.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  return results;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
