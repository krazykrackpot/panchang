/**
 * Body Vulnerability Map — scores each of the 12 body regions (0-100)
 * based on house affliction analysis.
 *
 * Sources: BPHS Ch.24-25 (Roga Sthana), Sarvartha Chintamani
 */

import type { KundaliData } from '@/types/kundali';
import {
  HOUSE_BODY_REGION,
  SIGN_LORD,
  NATURAL_MALEFICS,
  NATURAL_BENEFICS,
  type BodyRegion,
} from './constants';

export interface BodyRegionResult {
  house: number;
  bodyRegion: BodyRegion;
  vulnerability: number; // 0-100
  factors: string[];
}

export function computeBodyMap(kundali: KundaliData): BodyRegionResult[] {
  const lagnaSign = kundali.ascendant.sign; // 1-12

  // Build helper maps
  const planetByHouse = new Map<number, number[]>(); // house → [planetIds]
  for (const p of kundali.planets) {
    const list = planetByHouse.get(p.house) ?? [];
    list.push(p.planet.id);
    planetByHouse.set(p.house, list);
  }

  const planetSignMap = new Map<number, number>(); // planetId → sign
  const planetCombustMap = new Map<number, boolean>();
  const planetDebilMap = new Map<number, boolean>();
  for (const p of kundali.planets) {
    planetSignMap.set(p.planet.id, p.sign);
    planetCombustMap.set(p.planet.id, p.isCombust);
    planetDebilMap.set(p.planet.id, p.isDebilitated);
  }

  // Rahu/Ketu axis — Rahu house and Ketu house (always opposite)
  const rahuPlanet = kundali.planets.find((p) => p.planet.id === 7);
  const rahuHouse = rahuPlanet?.house ?? null;
  const ketuHouse = rahuHouse != null
    ? ((rahuHouse - 1 + 6) % 12) + 1 // opposite house
    : null;

  const results: BodyRegionResult[] = [];

  for (let houseNum = 1; houseNum <= 12; houseNum++) {
    let score = 0;
    const factors: string[] = [];

    // ── Determine house lord ─────────────────────────────────────────────────
    // House 1 sign = lagna sign; house N sign = (lagnaSign + N - 2) mod 12 + 1
    const houseSign = ((lagnaSign - 1 + houseNum - 1) % 12) + 1;
    const houseLordId = SIGN_LORD[houseSign];

    if (houseLordId !== undefined) {
      const lordSign = planetSignMap.get(houseLordId);
      const lordCombust = planetCombustMap.get(houseLordId) ?? false;
      const lordDebil = planetDebilMap.get(houseLordId) ?? false;
      const lordHouse = kundali.planets.find((p) => p.planet.id === houseLordId)?.house;

      // House lord debilitated
      if (lordDebil) {
        score += 25;
        factors.push('House lord debilitated');
      }

      // House lord combust
      if (lordCombust) {
        score += 20;
        factors.push('House lord combust (too close to Sun)');
      }

      // House lord in 6th, 8th, or 12th (dusthana)
      if (lordHouse && [6, 8, 12].includes(lordHouse)) {
        score += 15;
        factors.push(`House lord in ${lordHouse}th (dusthana)`);
      }

      // House lord in Rahu-Ketu axis
      if (
        lordSign !== undefined &&
        rahuPlanet !== undefined &&
        (planetSignMap.get(7) === lordSign || planetSignMap.get(8) === lordSign)
      ) {
        score += 10;
        factors.push('House lord in Rahu-Ketu axis');
      }
    }

    // ── Planets occupying this house ─────────────────────────────────────────
    const occupants = planetByHouse.get(houseNum) ?? [];
    for (const pid of occupants) {
      if (NATURAL_MALEFICS.has(pid)) {
        score += 15;
        const pName = getPlanetName(pid);
        factors.push(`${pName} (malefic) in house`);
      }
      if (NATURAL_BENEFICS.has(pid)) {
        score -= 10;
        const pName = getPlanetName(pid);
        factors.push(`${pName} (benefic) protecting house`);
      }
    }

    // Clamp 0-100
    score = Math.max(0, Math.min(100, score));

    results.push({
      house: houseNum,
      bodyRegion: HOUSE_BODY_REGION[houseNum - 1],
      vulnerability: score,
      factors,
    });
  }

  return results;
}

function getPlanetName(id: number): string {
  const names: Record<number, string> = {
    0: 'Sun',
    1: 'Moon',
    2: 'Mars',
    3: 'Mercury',
    4: 'Jupiter',
    5: 'Venus',
    6: 'Saturn',
    7: 'Rahu',
    8: 'Ketu',
  };
  return names[id] ?? `Planet ${id}`;
}
