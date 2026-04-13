import type { LocaleText } from '@/types/panchang';
/**
 * Chakra Systems — Sudarsana, Sarvatobhadra, Kota
 * Reference: BPHS Ch.22, Tajika Neelakanthi
 */

import { RASHIS } from '@/lib/constants/rashis';
import type { PlanetPosition } from '@/types/kundali';

type Tri = LocaleText;

// ─── SUDARSANA CHAKRA ───────────────────────────────────────────────────────
// Three concentric rings: Lagna, Moon, Sun — each showing 12 houses
// Each year of life activates the next house in all three rings simultaneously

export interface SudarsanaRing {
  reference: 'lagna' | 'moon' | 'sun';
  referenceSign: number;
  houses: { house: number; sign: number; signName: Tri; planets: number[] }[];
}

export interface SudarsanaChakra {
  rings: SudarsanaRing[];
  currentAge: number;
  activeHouse: number; // 1-12 (current year's house)
}

export function buildSudarsanaChakra(
  ascSign: number,
  moonSign: number,
  sunSign: number,
  planets: PlanetPosition[],
  birthYear: number,
): SudarsanaChakra {
  const currentAge = new Date().getFullYear() - birthYear;
  const activeHouse = (currentAge % 12) + 1;

  const buildRing = (refSign: number, reference: 'lagna' | 'moon' | 'sun'): SudarsanaRing => {
    const houses = Array.from({ length: 12 }, (_, i) => {
      const sign = ((refSign - 1 + i) % 12) + 1;
      const planetsInHouse = planets.filter(p => {
        const pSign = Math.floor(p.longitude / 30) + 1;
        return pSign === sign;
      }).map(p => p.planet.id);
      return {
        house: i + 1,
        sign,
        signName: RASHIS[sign - 1]?.name || { en: '', hi: '', sa: '' },
        planets: planetsInHouse,
      };
    });
    return { reference, referenceSign: refSign, houses };
  };

  return {
    rings: [
      buildRing(ascSign, 'lagna'),
      buildRing(moonSign, 'moon'),
      buildRing(sunSign, 'sun'),
    ],
    currentAge,
    activeHouse,
  };
}

// ─── SARVATOBHADRA CHAKRA ───────────────────────────────────────────────────
// 9×9 grid with nakshatras, vowels, weekdays mapped to cells
// Used for transit analysis — check which nakshatras are aspected

export interface SarvatobhadraCell {
  row: number;
  col: number;
  content: string;
  type: 'nakshatra' | 'vowel' | 'weekday' | 'sign' | 'empty';
  nakshatra?: number; // 1-27
}

// Standard Sarvatobhadra layout (simplified)
const SB_NAKSHATRAS_ORDER = [
  // Outer ring (clockwise from top-left)
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
];

export function buildSarvatobhadraChakra(): SarvatobhadraCell[] {
  const grid: SarvatobhadraCell[] = [];

  // Build a simplified 9x9 grid
  // Center = "OM", corners = weekdays, edges = nakshatras
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (r === 4 && c === 4) {
        grid.push({ row: r, col: c, content: 'OM', type: 'empty' });
      } else if (r === 0 || r === 8 || c === 0 || c === 8) {
        // Border cells — nakshatras
        const idx = (r === 0 ? c : r === 8 ? (16 - c) : c === 8 ? (8 + r) : (24 - r)) % 27;
        const nakNum = SB_NAKSHATRAS_ORDER[idx] || 1;
        grid.push({ row: r, col: c, content: `N${nakNum}`, type: 'nakshatra', nakshatra: nakNum });
      } else if (r === 1 || r === 7 || c === 1 || c === 7) {
        // Second ring — signs
        grid.push({ row: r, col: c, content: '', type: 'sign' });
      } else {
        // Inner ring — vowels/weekdays
        grid.push({ row: r, col: c, content: '', type: 'vowel' });
      }
    }
  }
  return grid;
}

// ─── KOTA CHAKRA ────────────────────────────────────────────────────────────
// Fortress diagram — classifies planets as residing in different zones of a fort
// Used for transit strength analysis
// Zones: Stambha (pillar), Praakara (outer wall), Durgaantara (space between walls), Durga (inner fort)

export interface KotaChakraResult {
  zones: { zone: string; zoneName: Tri; planets: number[]; strength: 'protective' | 'neutral' | 'vulnerable' }[];
  birthNakshatra: number;
  entryGate: number; // nakshatra of entry
}

export function buildKotaChakra(birthNakshatra: number, planets: PlanetPosition[]): KotaChakraResult {
  // Divide 28 nakshatras (including Abhijit) into 4 concentric zones of 7 each
  // Starting from birth nakshatra
  const zones: KotaChakraResult['zones'] = [];
  const zoneNames: { zone: string; name: Tri; strength: 'protective' | 'neutral' | 'vulnerable' }[] = [
    { zone: 'stambha', name: { en: 'Stambha (Central Pillar)', hi: 'स्तम्भ (केंद्रीय स्तम्भ)', sa: 'स्तम्भः' }, strength: 'protective' },
    { zone: 'durga', name: { en: 'Durga (Inner Fort)', hi: 'दुर्ग (आंतरिक किला)', sa: 'दुर्गम्' }, strength: 'protective' },
    { zone: 'praakara', name: { en: 'Praakara (Outer Wall)', hi: 'प्राकार (बाहरी दीवार)', sa: 'प्राकारः' }, strength: 'neutral' },
    { zone: 'durgaantara', name: { en: 'Bahya (Outside)', hi: 'बाह्य (बाहर)', sa: 'बाह्यम्' }, strength: 'vulnerable' },
  ];

  for (let z = 0; z < 4; z++) {
    const zoneNakshatras = new Set<number>();
    for (let n = 0; n < 7; n++) {
      zoneNakshatras.add(((birthNakshatra - 1 + z * 7 + n) % 27) + 1);
    }

    const planetsInZone = planets.filter(p => {
      const nak = Math.floor((p.longitude % 360) / (360 / 27)) + 1;
      return zoneNakshatras.has(nak);
    }).map(p => p.planet.id);

    zones.push({
      zone: zoneNames[z].zone,
      zoneName: zoneNames[z].name,
      planets: planetsInZone,
      strength: zoneNames[z].strength,
    });
  }

  return {
    zones,
    birthNakshatra,
    entryGate: ((birthNakshatra - 1 + 14) % 27) + 1, // Midpoint opposite
  };
}
