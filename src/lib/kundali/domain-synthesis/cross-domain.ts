/**
 * Cross-Domain Link Detector
 *
 * Finds 3-5 connections between life domains that are unique to this chart.
 * Two domains are "linked" when they share a house lord, or when a primary
 * planet of one domain occupies a primary house of the other.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs:  1-based (1=Aries … 12=Pisces)
 */

import type { CrossDomainLink, DomainType } from './types';
import { DOMAIN_CONFIGS } from './config';

// ---------------------------------------------------------------------------
// Input type
// ---------------------------------------------------------------------------

export interface CrossDomainInput {
  /** House lord mapping — one entry per house (12 entries). */
  houseLords: { house: number; lordId: number }[];
  /** Planet house placement — one entry per planet (up to 9 entries). */
  planetHouses: { planetId: number; house: number }[];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Build a fast lookup: house → lordId */
function buildHouseLordMap(
  houseLords: { house: number; lordId: number }[],
): Map<number, number> {
  const map = new Map<number, number>();
  for (const { house, lordId } of houseLords) {
    map.set(house, lordId);
  }
  return map;
}

/** Build a fast lookup: planetId → house */
function buildPlanetHouseMap(
  planetHouses: { planetId: number; house: number }[],
): Map<number, number> {
  const map = new Map<number, number>();
  for (const { planetId, house } of planetHouses) {
    map.set(planetId, house);
  }
  return map;
}

/** Planet name strings (English) for narrative generation */
const PLANET_NAME_EN: Record<number, string> = {
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

/** Planet name strings (Hindi) for narrative generation */
const PLANET_NAME_HI: Record<number, string> = {
  0: 'सूर्य',
  1: 'चंद्र',
  2: 'मंगल',
  3: 'बुध',
  4: 'बृहस्पति',
  5: 'शुक्र',
  6: 'शनि',
  7: 'राहु',
  8: 'केतु',
};

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/**
 * Detects cross-domain links for this chart and returns up to 5 connections.
 *
 * Two detection rules are applied for each ordered pair of domains (A, B):
 *  1. **Shared lord**: a planet lords a primary house of A AND a primary house of B.
 *  2. **Planet overlap**: a primary planet of A occupies a primary house of B.
 *
 * Each domain pair is deduplicated (first match wins) and the result is
 * capped at 5 links.
 */
export function detectCrossDomainLinks(input: CrossDomainInput): CrossDomainLink[] {
  const { houseLords, planetHouses } = input;

  // Graceful empty-input handling
  if (!houseLords.length && !planetHouses.length) {
    return [];
  }

  const houseLordMap   = buildHouseLordMap(houseLords);
  const planetHouseMap = buildPlanetHouseMap(planetHouses);

  const links: CrossDomainLink[] = [];
  // Track domain-pair keys already added to avoid duplicates, e.g. "health-career"
  const seenPairs = new Set<string>();

  const configs = DOMAIN_CONFIGS;

  for (let i = 0; i < configs.length && links.length < 5; i++) {
    for (let j = 0; j < configs.length && links.length < 5; j++) {
      if (i === j) continue;

      const domainA = configs[i];
      const domainB = configs[j];

      // Deduplicate: treat (A,B) and (B,A) as the same pair
      const pairKey = [domainA.id, domainB.id].sort().join('-');
      if (seenPairs.has(pairKey)) continue;

      // ---- Rule 1: Shared lord -------------------------------------------
      // Find any planet that lords a primary house in BOTH domains
      let sharedLordId: number | null = null;

      outer:
      for (const hA of domainA.primaryHouses) {
        const lord = houseLordMap.get(hA);
        if (lord === undefined) continue;
        for (const hB of domainB.primaryHouses) {
          if (houseLordMap.get(hB) === lord) {
            sharedLordId = lord;
            break outer;
          }
        }
      }

      if (sharedLordId !== null) {
        seenPairs.add(pairKey);
        const pName  = PLANET_NAME_EN[sharedLordId] ?? `Planet-${sharedLordId}`;
        const pNameH = PLANET_NAME_HI[sharedLordId] ?? `ग्रह-${sharedLordId}`;
        links.push({
          linkedDomain: domainB.id as DomainType,
          linkType: 'depends_on',
          explanation: {
            en: `${domainA.name.en} and ${domainB.name.en} are deeply intertwined — ${pName} rules key houses in both domains, meaning shifts in one area directly ripple into the other.`,
            hi: `${domainA.name.hi} और ${domainB.name.hi} गहराई से जुड़े हैं — ${pNameH} दोनों क्षेत्रों में महत्वपूर्ण भावों का स्वामी है, जिसका अर्थ है कि एक क्षेत्र में बदलाव सीधे दूसरे को प्रभावित करता है।`,
          },
        });
        continue;
      }

      // ---- Rule 2: Planet overlap ----------------------------------------
      // A primary planet of domain A sits in a primary house of domain B
      let overlapPlanetId: number | null = null;
      let overlapHouse: number | null    = null;

      outerOverlap:
      for (const pid of domainA.primaryPlanets) {
        const houseOfPlanet = planetHouseMap.get(pid);
        if (houseOfPlanet === undefined) continue;
        for (const hB of domainB.primaryHouses) {
          if (houseOfPlanet === hB) {
            overlapPlanetId = pid;
            overlapHouse    = hB;
            break outerOverlap;
          }
        }
      }

      if (overlapPlanetId !== null && overlapHouse !== null) {
        seenPairs.add(pairKey);
        const pName  = PLANET_NAME_EN[overlapPlanetId] ?? `Planet-${overlapPlanetId}`;
        const pNameH = PLANET_NAME_HI[overlapPlanetId] ?? `ग्रह-${overlapPlanetId}`;
        links.push({
          linkedDomain: domainB.id as DomainType,
          linkType: 'supports',
          explanation: {
            en: `${pName}, a key indicator of ${domainA.name.en}, sits in house ${overlapHouse} — a primary house for ${domainB.name.en}. This placement bridges both life areas, making them mutually reinforcing.`,
            hi: `${pNameH}, जो ${domainA.name.hi} का प्रमुख कारक है, भाव ${overlapHouse} में स्थित है — जो ${domainB.name.hi} का प्राथमिक भाव है। यह स्थिति दोनों जीवन क्षेत्रों को जोड़ती है और उन्हें परस्पर सुदृढ़ बनाती है।`,
          },
        });
        continue;
      }

      // ---- Rule 3: Conflict -----------------------------------------------
      // A natural malefic (Sun=0, Mars=2, Saturn=6, Rahu=7, Ketu=8) that is a
      // primary planet of domain A occupies a dusthana (6/8/12) from a primary
      // house of domain B — creating tension between the domains.
      const MALEFIC_IDS = new Set([0, 2, 6, 7, 8]);
      let conflictPlanetId: number | null = null;

      outerConflict:
      for (const pid of domainA.primaryPlanets) {
        if (!MALEFIC_IDS.has(pid)) continue;
        const houseOfPlanet = planetHouseMap.get(pid);
        if (houseOfPlanet === undefined) continue;
        for (const hB of domainB.primaryHouses) {
          const offset = ((houseOfPlanet - hB + 12) % 12) + 1;
          if (offset === 6 || offset === 8 || offset === 12) {
            conflictPlanetId = pid;
            break outerConflict;
          }
        }
      }

      if (conflictPlanetId !== null) {
        seenPairs.add(pairKey);
        const pName  = PLANET_NAME_EN[conflictPlanetId] ?? `Planet-${conflictPlanetId}`;
        const pNameH = PLANET_NAME_HI[conflictPlanetId] ?? `ग्रह-${conflictPlanetId}`;
        links.push({
          linkedDomain: domainB.id as DomainType,
          linkType: 'conflicts',
          explanation: {
            en: `${pName}, important for ${domainA.name.en}, creates tension in ${domainB.name.en} — occupying a challenging position from key ${domainB.name.en} houses. Progress in one area may require sacrifice in the other.`,
            hi: `${pNameH}, जो ${domainA.name.hi} के लिए महत्वपूर्ण है, ${domainB.name.hi} में तनाव पैदा करता है — प्रमुख ${domainB.name.hi} भावों से चुनौतीपूर्ण स्थिति में स्थित है। एक क्षेत्र में प्रगति के लिए दूसरे में त्याग आवश्यक हो सकता है।`,
          },
        });
      }
    }
  }

  return links;
}
