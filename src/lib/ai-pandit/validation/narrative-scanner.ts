/**
 * Layer 2b — Narrative Scanner
 *
 * Extracts verifiable claims from natural language prose (EN + HI)
 * and cross-checks against the SAC. Safety net for claims the LLM
 * made in narrative but omitted from the structured claims array.
 */

import type {
  LLMClaim,
  StructuredAstrologicalContext,
  ValidationResult,
  ValidationFailure,
  ExtractedClaim,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Planet name mappings
// ─────────────────────────────────────────────────────────────────────────────

const PLANET_NAME_TO_ID: Record<string, number> = {
  sun: 0, moon: 1, mars: 2, mercury: 3, jupiter: 4,
  venus: 5, saturn: 6, rahu: 7, ketu: 8,
  'सूर्य': 0, 'चन्द्र': 1, 'चंद्र': 1, 'मंगल': 2, 'बुध': 3,
  'बृहस्पति': 4, 'गुरु': 4, 'शुक्र': 5, 'शनि': 6,
  'राहु': 7, 'केतु': 8,
};

// Hindi ordinals for houses (भाव)
const HI_ORDINAL_TO_NUM: Record<string, number> = {
  'प्रथम': 1, 'पहले': 1, 'पहला': 1,
  'द्वितीय': 2, 'दूसरे': 2, 'दूसरा': 2,
  'तृतीय': 3, 'तीसरे': 3,
  'चतुर्थ': 4, 'चौथे': 4,
  'पंचम': 5, 'पाँचवें': 5,
  'षष्ठ': 6, 'छठे': 6,
  'सप्तम': 7, 'सातवें': 7,
  'अष्टम': 8, 'आठवें': 8,
  'नवम': 9, 'नौवें': 9,
  'दशम': 10, 'दसवें': 10,
  'एकादश': 11, 'ग्यारहवें': 11,
  'द्वादश': 12, 'बारहवें': 12,
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─────────────────────────────────────────────────────────────────────────────
// Extraction
// ─────────────────────────────────────────────────────────────────────────────

export function scanNarrative(narrative: string): ExtractedClaim[] {
  const claims: ExtractedClaim[] = [];

  // ── English planet-house: "Saturn in the 7th house" ──
  const enPlanetHouse = /\b(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\b[^.]{0,30}?\b(\d{1,2})(st|nd|rd|th)\s+house/gi;
  for (const match of narrative.matchAll(enPlanetHouse)) {
    const pid = PLANET_NAME_TO_ID[match[1].toLowerCase()];
    const house = parseInt(match[2]);
    if (pid !== undefined && house >= 1 && house <= 12) {
      claims.push({ type: 'planet_house', planet: pid, house, source: match[0] });
    }
  }

  // ── Hindi planet-house: "शनि सप्तम भाव में" / "सप्तम भाव में शनि" ──
  const hiPlanetNames = Object.entries(PLANET_NAME_TO_ID)
    .filter(([k]) => /[\u0900-\u097F]/.test(k));
  const hiOrdinals = Object.entries(HI_ORDINAL_TO_NUM);

  for (const [planetName, pid] of hiPlanetNames) {
    for (const [ordinal, houseNum] of hiOrdinals) {
      // Forward: planet ... ordinal ... भाव
      const fwd = new RegExp(
        `${escapeRegex(planetName)}[^।]{0,40}?${escapeRegex(ordinal)}\\s*(भाव|घर|स्थान)`, 'g'
      );
      for (const m of narrative.matchAll(fwd)) {
        claims.push({ type: 'planet_house', planet: pid, house: houseNum, source: m[0] });
      }
      // Reverse: ordinal भाव ... planet
      const rev = new RegExp(
        `${escapeRegex(ordinal)}\\s*(भाव|घर|स्थान)[^।]{0,40}?${escapeRegex(planetName)}`, 'g'
      );
      for (const m of narrative.matchAll(rev)) {
        claims.push({ type: 'planet_house', planet: pid, house: houseNum, source: m[0] });
      }
    }

    // Hindi numeric: "शनि 7वें भाव में"
    const numericPattern = new RegExp(
      `${escapeRegex(planetName)}[^।]{0,30}?(\\d{1,2})\\s*(वें|वीं|वाँ)?\\s*(भाव|घर|स्थान)`, 'g'
    );
    for (const m of narrative.matchAll(numericPattern)) {
      const house = parseInt(m[1]);
      if (house >= 1 && house <= 12) {
        claims.push({ type: 'planet_house', planet: pid, house, source: m[0] });
      }
    }
  }

  // ── English dignity: "exalted Sun" / "Sun is exalted" ──
  const dignityWords = 'exalted|debilitated|own sign|moolatrikona';
  const planetWords = 'Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu';

  const enDig1 = new RegExp(`\\b(${dignityWords})\\b[^.]{0,20}?\\b(${planetWords})\\b`, 'gi');
  for (const m of narrative.matchAll(enDig1)) {
    const pid = PLANET_NAME_TO_ID[m[2].toLowerCase()];
    if (pid !== undefined) {
      claims.push({ type: 'planet_dignity', planet: pid, dignity: m[1].toLowerCase(), source: m[0] });
    }
  }

  const enDig2 = new RegExp(`\\b(${planetWords})\\b[^.]{0,20}?\\b(${dignityWords})\\b`, 'gi');
  for (const m of narrative.matchAll(enDig2)) {
    const pid = PLANET_NAME_TO_ID[m[1].toLowerCase()];
    if (pid !== undefined) {
      claims.push({ type: 'planet_dignity', planet: pid, dignity: m[2].toLowerCase(), source: m[0] });
    }
  }

  // ── Hindi dignity: "उच्च सूर्य" / "सूर्य उच्च" ──
  const hiDignityMap: Record<string, string> = {
    'उच्च': 'exalted', 'नीच': 'debilitated',
    'स्वराशि': 'own', 'स्वगृही': 'own', 'मूलत्रिकोण': 'moolatrikona',
  };
  for (const [hiTerm, enDignity] of Object.entries(hiDignityMap)) {
    for (const [planetName, pid] of hiPlanetNames) {
      const pattern = new RegExp(
        `(${escapeRegex(hiTerm)}\\s*${escapeRegex(planetName)}|${escapeRegex(planetName)}\\s*${escapeRegex(hiTerm)})`, 'g'
      );
      for (const m of narrative.matchAll(pattern)) {
        claims.push({ type: 'planet_dignity', planet: pid, dignity: enDignity, source: m[0] });
      }
    }
  }

  // ── Yoga name extraction (bilingual) ──
  const KNOWN_YOGAS = [
    'gajakesari', 'chandra mangala', 'budhaditya', 'raja yoga',
    'viparita raja', 'neechabhanga', 'mahapurusha',
    'hamsa', 'malavya', 'shasha', 'ruchaka', 'bhadra',
    'गजकेसरी', 'चन्द्र मंगल', 'बुधादित्य', 'राज योग',
    'विपरीत राज', 'नीचभंग', 'महापुरुष',
    'हंस', 'मालव्य', 'शश', 'रुचक', 'भद्र',
  ];

  for (const yoga of KNOWN_YOGAS) {
    if (narrative.toLowerCase().includes(yoga.toLowerCase()) || narrative.includes(yoga)) {
      claims.push({ type: 'yoga_mentioned', yogaName: yoga, source: yoga });
    }
  }

  return deduplicateClaims(claims);
}

// ─────────────────────────────────────────────────────────────────────────────
// Deduplication
// ─────────────────────────────────────────────────────────────────────────────

function deduplicateClaims(claims: ExtractedClaim[]): ExtractedClaim[] {
  const seen = new Set<string>();
  return claims.filter(c => {
    const key = `${c.type}:${c.planet ?? ''}:${c.house ?? ''}:${c.dignity ?? ''}:${c.yogaName ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Verification
// ─────────────────────────────────────────────────────────────────────────────

/** Check if a scanned claim was already verified by Layer 2 structured claims. */
function isAlreadyVerified(sc: ExtractedClaim, structuredClaims: LLMClaim[]): boolean {
  return structuredClaims.some(c => {
    if (sc.type === 'planet_house' && c.type === 'planet_house') {
      return (c.data as Record<string, number>).planet === sc.planet
        && (c.data as Record<string, number>).house === sc.house;
    }
    if (sc.type === 'planet_dignity' && c.type === 'planet_dignity') {
      return (c.data as Record<string, number>).planet === sc.planet;
    }
    if (sc.type === 'yoga_mentioned' && c.type === 'yoga_mentioned') {
      const cName = (c.data as Record<string, string>).name?.toLowerCase() ?? '';
      return sc.yogaName?.toLowerCase().includes(cName) || cName.includes(sc.yogaName?.toLowerCase() ?? '');
    }
    return false;
  });
}

export function verifyScannedClaims(
  narrative: string,
  sac: StructuredAstrologicalContext,
  structuredClaims: LLMClaim[],
): ValidationResult {
  const start = Date.now();
  const scanned = scanNarrative(narrative);
  const failures: ValidationFailure[] = [];

  for (const sc of scanned) {
    if (isAlreadyVerified(sc, structuredClaims)) continue;

    if (sc.type === 'planet_house' && sc.planet !== undefined && sc.house !== undefined) {
      const p = sac.planets.find(pp => pp.id === sc.planet);
      if (p && p.house !== sc.house) {
        failures.push({
          layer: 'narrative_scan',
          message: `Narrative says "${sc.source}" but ${p.name} is in house ${p.house}`,
          evidence: sc.source,
          fixable: false,
        });
      }
    }

    if (sc.type === 'planet_dignity' && sc.planet !== undefined && sc.dignity) {
      const p = sac.planets.find(pp => pp.id === sc.planet);
      if (p && p.dignity !== sc.dignity) {
        failures.push({
          layer: 'narrative_scan',
          message: `Narrative says "${sc.source}" but ${p.name} is ${p.dignity}`,
          evidence: sc.source,
          fixable: false,
        });
      }
    }

    if (sc.type === 'yoga_mentioned' && sc.yogaName) {
      const normalised = sc.yogaName.toLowerCase();
      const found = sac.yogas.find(y => y.name.toLowerCase().includes(normalised));
      if (!found) {
        failures.push({
          layer: 'narrative_scan',
          message: `Narrative mentions "${sc.yogaName}" yoga but not in detected yogas`,
          evidence: sc.source,
          fixable: false,
        });
      }
    }
  }

  return { passed: failures.length === 0, failures, warnings: [], durationMs: Date.now() - start };
}
