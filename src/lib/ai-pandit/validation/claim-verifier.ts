/**
 * Layer 2 — Claim Verification
 *
 * Every structured claim in the LLM's claims array must be factually
 * correct against the SAC. Pure function, zero I/O.
 */

import type {
  LLMClaim,
  StructuredAstrologicalContext,
  ValidationResult,
  ValidationFailure,
} from '../types';

interface ClaimCheck {
  passed: boolean;
  message: string;
}

const VERIFIERS: Record<string, (claim: LLMClaim, sac: StructuredAstrologicalContext) => ClaimCheck> = {

  planet_house: (claim, sac) => {
    const { planet, house } = claim.data as { planet: number; house: number };
    const p = sac.planets.find(pp => pp.id === planet);
    if (!p) return { passed: false, message: `Planet ID ${planet} not found in SAC` };
    if (p.house !== house) {
      return { passed: false, message: `Claimed ${p.name} in house ${house}, actually house ${p.house}` };
    }
    return { passed: true, message: '' };
  },

  planet_sign: (claim, sac) => {
    const { planet, sign } = claim.data as { planet: number; sign: number };
    const p = sac.planets.find(pp => pp.id === planet);
    if (!p) return { passed: false, message: `Planet ID ${planet} not found in SAC` };
    if (p.sign !== sign) {
      return { passed: false, message: `Claimed ${p.name} in sign ${sign}, actually sign ${p.sign}` };
    }
    return { passed: true, message: '' };
  },

  planet_dignity: (claim, sac) => {
    const { planet, dignity } = claim.data as { planet: number; dignity: string };
    const p = sac.planets.find(pp => pp.id === planet);
    if (!p) return { passed: false, message: `Planet ID ${planet} not found in SAC` };
    if (p.dignity !== dignity) {
      return { passed: false, message: `Claimed ${p.name} is ${dignity}, actually ${p.dignity}` };
    }
    return { passed: true, message: '' };
  },

  planet_retrograde: (claim, sac) => {
    const { planet, isRetrograde } = claim.data as { planet: number; isRetrograde: boolean };
    const p = sac.planets.find(pp => pp.id === planet);
    if (!p) return { passed: false, message: `Planet ID ${planet} not found in SAC` };
    if (p.isRetrograde !== isRetrograde) {
      return { passed: false, message: `Claimed ${p.name} retrograde=${isRetrograde}, actually ${p.isRetrograde}` };
    }
    return { passed: true, message: '' };
  },

  dasha_reference: (claim, sac) => {
    const { major, sub } = claim.data as { major: number; sub: number };
    if (sac.dasha.mahadasha.lordId !== major) {
      return { passed: false, message: `Claimed Mahadasha lord ${major}, actually ${sac.dasha.mahadasha.lordId}` };
    }
    if (sac.dasha.antardasha.lordId !== sub) {
      return { passed: false, message: `Claimed Antardasha lord ${sub}, actually ${sac.dasha.antardasha.lordId}` };
    }
    return { passed: true, message: '' };
  },

  yoga_mentioned: (claim, sac) => {
    const { name } = claim.data as { name: string };
    const found = sac.yogas.find(
      y => y.name.toLowerCase().includes(name.toLowerCase())
    );
    if (!found) {
      return { passed: false, message: `Claimed yoga "${name}" not in detected yogas` };
    }
    return { passed: true, message: '' };
  },

  dosha_mentioned: (claim, sac) => {
    const { name } = claim.data as { name: string };
    const found = sac.doshas.find(
      d => d.name.toLowerCase().includes(name.toLowerCase())
    );
    if (!found) {
      return { passed: false, message: `Claimed dosha "${name}" not in detected doshas` };
    }
    return { passed: true, message: '' };
  },

  transit_position: (claim, sac) => {
    const { planet, houseFromMoon } = claim.data as { planet: number; houseFromMoon: number };
    const t = sac.transits.find(tr => tr.planetId === planet);
    if (!t) return { passed: false, message: `Planet ${planet} not in transit data` };
    if (t.houseFromMoon !== houseFromMoon) {
      return { passed: false, message: `Claimed ${t.planetName} transits ${houseFromMoon}th from Moon, actually ${t.houseFromMoon}th` };
    }
    return { passed: true, message: '' };
  },

  sade_sati: (claim, sac) => {
    const { active } = claim.data as { active: boolean };
    if (sac.sadeSati.active !== active) {
      return { passed: false, message: `Claimed Sade Sati active=${active}, actually ${sac.sadeSati.active}` };
    }
    return { passed: true, message: '' };
  },

  // verdict_tone is redundant with Layer 1 — always pass
  verdict_tone: () => ({ passed: true, message: '' }),
};

export function verifyClaims(
  claims: LLMClaim[],
  sac: StructuredAstrologicalContext,
): ValidationResult {
  const start = Date.now();
  const failures: ValidationFailure[] = [];

  for (const claim of claims) {
    const verifier = VERIFIERS[claim.type];
    if (!verifier) continue; // Unknown claim type — skip, don't block

    const result = verifier(claim, sac);
    if (!result.passed) {
      failures.push({
        layer: 'claim_verification',
        message: result.message,
        evidence: JSON.stringify(claim),
        fixable: false,
      });
    }
  }

  return { passed: failures.length === 0, failures, warnings: [], durationMs: Date.now() - start };
}
