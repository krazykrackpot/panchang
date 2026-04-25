/**
 * BNN (Bhrigu Nandi Nadi) Engine
 *
 * For each of the 9 planets:
 *  1. Look up base prediction from BNN_BASE[planetId][signId]
 *  2. Check classical aspects from other planets → layer modifier text
 *  3. Check conjunctions → layer modifier
 *  4. Check retrograde → layer modifier
 *  5. Combine into a reading paragraph
 *
 * Aspect rules (Parashari — used in BNN for aspect analysis):
 *  All planets aspect 7th from their position.
 *  Mars also aspects 4th and 8th.
 *  Jupiter also aspects 5th and 9th.
 *  Saturn also aspects 3rd and 10th.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import { BNN_BASE } from './bnn-predictions';
import { ASPECT_MODIFIERS, CONJUNCTION_MODIFIERS, RETROGRADE_MODIFIERS } from './bnn-modifiers';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';

export interface BNNPlanetReading {
  planetId: number;
  planetName: string;
  sign: number;
  signName: string;
  house: number;
  basePrediction: string;
  modifiers: Array<{ type: 'aspect' | 'conjunction' | 'retrograde'; source: string; text: string }>;
  combinedReading: string;
  isRetrograde: boolean;
}

export interface BNNReading {
  planets: BNNPlanetReading[];
  lifeThemes: string[];
  karmicProfile: {
    ketuReading: string;
    pastLifeTheme: string;
    dharmaPath: string;
  };
}

// Planet display names
const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' },
  1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' },
  3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'बृहस्पति' },
  5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' },
  7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

// House names for narrative
const HOUSE_NAMES: Record<number, { en: string; hi: string }> = {
  1: { en: '1st (Self)', hi: 'प्रथम (स्व)' },
  2: { en: '2nd (Wealth)', hi: 'द्वितीय (धन)' },
  3: { en: '3rd (Siblings)', hi: 'तृतीय (भाई-बहन)' },
  4: { en: '4th (Home)', hi: 'चतुर्थ (गृह)' },
  5: { en: '5th (Children)', hi: 'पंचम (संतान)' },
  6: { en: '6th (Service)', hi: 'षष्ठ (सेवा)' },
  7: { en: '7th (Partnership)', hi: 'सप्तम (साझेदारी)' },
  8: { en: '8th (Transformation)', hi: 'अष्टम (परिवर्तन)' },
  9: { en: '9th (Dharma)', hi: 'नवम (धर्म)' },
  10: { en: '10th (Career)', hi: 'दशम (करियर)' },
  11: { en: '11th (Gains)', hi: 'एकादश (लाभ)' },
  12: { en: '12th (Liberation)', hi: 'द्वादश (मोक्ष)' },
};

/**
 * Compute which house is N houses away from a given house (1-indexed, wraps 1-12).
 * houseOffset(4, 7) = house 10 (4th + 6 = 10).
 */
function houseOffset(fromHouse: number, offset: number): number {
  return ((fromHouse - 1 + offset) % 12) + 1;
}

/**
 * Get houses a planet aspects (Parashari standard + special aspects).
 * Returns set of house numbers (1-12) that the planet in `house` aspects.
 */
function getAspectedHouses(planetId: number, fromHouse: number): Set<number> {
  const aspectedHouses = new Set<number>();
  // All planets aspect 7th from position
  aspectedHouses.add(houseOffset(fromHouse, 6)); // +6 = 7th from

  // Mars special aspects: 4th and 8th from position
  if (planetId === 2) {
    aspectedHouses.add(houseOffset(fromHouse, 3)); // 4th
    aspectedHouses.add(houseOffset(fromHouse, 7)); // 8th
  }
  // Jupiter special aspects: 5th and 9th from position
  if (planetId === 4) {
    aspectedHouses.add(houseOffset(fromHouse, 4)); // 5th
    aspectedHouses.add(houseOffset(fromHouse, 8)); // 9th
  }
  // Saturn special aspects: 3rd and 10th from position
  if (planetId === 6) {
    aspectedHouses.add(houseOffset(fromHouse, 2)); // 3rd
    aspectedHouses.add(houseOffset(fromHouse, 9)); // 10th
  }
  // Rahu & Ketu (shadow planets): 5th and 9th aspects like Jupiter in some traditions
  if (planetId === 7 || planetId === 8) {
    aspectedHouses.add(houseOffset(fromHouse, 4));
    aspectedHouses.add(houseOffset(fromHouse, 8));
  }

  return aspectedHouses;
}

/**
 * Check if planetA aspects the house of planetB.
 */
function doesAspect(aspecter: PlanetPosition, target: PlanetPosition): boolean {
  const aspectedHouses = getAspectedHouses(aspecter.planet.id, aspecter.house);
  return aspectedHouses.has(target.house);
}

/**
 * Check if two planets are in the same house (conjunction).
 */
function areConjunct(p1: PlanetPosition, p2: PlanetPosition): boolean {
  return p1.house === p2.house && p1.planet.id !== p2.planet.id;
}

/** Safe lookup of BNN base text. Falls back to a generic note if missing. */
function getBase(planetId: number, signId: number, locale: string): string {
  const entry = BNN_BASE[planetId]?.[signId];
  if (!entry) return locale === 'hi'
    ? `ग्रह ${PLANET_NAMES[planetId]?.hi ?? planetId} के लिए आधार भविष्यवाणी अनुपलब्ध है।`
    : `Base prediction for planet ${PLANET_NAMES[planetId]?.en ?? planetId} unavailable.`;
  return locale === 'hi' ? entry.hi : entry.en;
}

/** Extract locale-appropriate text from a modifier record. */
function getModifierText(modifier: { en: string; hi: string }, locale: string): string {
  return locale === 'hi' ? modifier.hi : modifier.en;
}

/**
 * Generate life themes by analysing convergent patterns across all planet readings.
 */
function generateLifeThemes(planets: PlanetPosition[], locale: string): string[] {
  const themes: string[] = [];

  // Count Jupiter aspects/conjunctions → spiritual wisdom theme
  const jupiterPlanet = planets.find(p => p.planet.id === 4);
  if (jupiterPlanet) {
    const jupAspectCount = planets.filter(p => p.planet.id !== 4 && doesAspect(jupiterPlanet, p)).length;
    if (jupAspectCount >= 3) {
      themes.push(locale === 'hi'
        ? 'बृहस्पति की व्यापक दृष्टि एकाधिक जीवन क्षेत्रों को आशीर्वाद देती है — ज्ञान और आध्यात्मिक विकास एक केंद्रीय जीवन विषय है।'
        : 'Jupiter\'s broad aspect blesses multiple life areas — wisdom and spiritual growth is a central life theme.');
    }
  }

  // Saturn aspecting key planets → theme of hard-earned mastery
  const saturnPlanet = planets.find(p => p.planet.id === 6);
  if (saturnPlanet) {
    const satAspectCount = planets.filter(p => p.planet.id !== 6 && doesAspect(saturnPlanet, p)).length;
    if (satAspectCount >= 2) {
      themes.push(locale === 'hi'
        ? 'शनि की कठोर दृष्टि अनेक क्षेत्रों में परीक्षा करती है — कठिन परिश्रम से अर्जित सफलता और दीर्घकालिक उपलब्धि जीवन का स्वर है।'
        : 'Saturn\'s stern aspect tests multiple domains — hard-earned success and late-blooming achievement is the life keynote.');
    }
  }

  // Multiple retrogrades → theme of internalisation and past-life processing
  const retrogradeCount = planets.filter(p => p.isRetrograde && p.planet.id !== 7 && p.planet.id !== 8).length;
  if (retrogradeCount >= 3) {
    themes.push(locale === 'hi'
      ? 'अनेक वक्री ग्रह गहन आत्म-विश्लेषण और पूर्व जन्म के विषयों को इस जीवन में जागरूक रूप से संसाधित करने की प्रवृत्ति दर्शाते हैं।'
      : 'Multiple retrograde planets indicate a deeply introspective nature and a life oriented toward consciously processing past-life themes.');
  }

  // Rahu-Ketu axis analysis
  const rahu = planets.find(p => p.planet.id === 7);
  const ketu = planets.find(p => p.planet.id === 8);
  if (rahu && ketu) {
    themes.push(locale === 'hi'
      ? `राहु-केतु अक्ष (${tl(RASHIS.find(r => r.id === rahu.sign)?.name ?? { en: 'unknown' }, locale)} ↔ ${tl(RASHIS.find(r => r.id === ketu.sign)?.name ?? { en: 'unknown' }, locale)}) इस जीवन की मूल कार्मिक ध्रुवता को दर्शाता है।`
      : `The Rahu-Ketu axis (${tl(RASHIS.find(r => r.id === rahu.sign)?.name ?? { en: 'unknown' }, locale)} ↔ ${tl(RASHIS.find(r => r.id === ketu.sign)?.name ?? { en: 'unknown' }, locale)}) defines the fundamental karmic polarity of this incarnation.`);
  }

  // Sun-Moon relationship → theme about integration of self and mind
  const sun = planets.find(p => p.planet.id === 0);
  const moon = planets.find(p => p.planet.id === 1);
  if (sun && moon) {
    if (sun.house === moon.house) {
      themes.push(locale === 'hi'
        ? 'सूर्य-चन्द्र युति आत्मा और मन का मिलन दर्शाती है — व्यक्तित्व और भावनाएँ एकीकृत शक्ति के साथ काम करती हैं।'
        : 'Sun-Moon conjunction indicates unity of self and mind — personality and emotions work with integrated power.');
    }
  }

  if (themes.length === 0) {
    themes.push(locale === 'hi'
      ? 'ग्रहों की विशिष्ट स्थितियाँ एक अद्वितीय जीवन पथ का संकेत देती हैं जिसे व्यक्तिगत ग्रह पठन में विस्तार से देखा जाना चाहिए।'
      : 'The specific planetary positions indicate a unique life path best understood through the detailed individual planet readings below.');
  }

  return themes;
}

/**
 * Main BNN reading generator.
 */
export function generateBNNReading(kundali: KundaliData, locale: string): BNNReading {
  const planets = kundali.planets;
  const planetReadings: BNNPlanetReading[] = [];

  for (const planet of planets) {
    const planetId = planet.planet.id;
    const signId = planet.sign;
    const rashi = RASHIS.find(r => r.id === signId);
    const signName = tl(rashi?.name ?? { en: 'Unknown' }, locale);

    // 1. Base prediction
    const basePrediction = getBase(planetId, signId, locale);

    const modifiers: BNNPlanetReading['modifiers'] = [];

    // 2. Aspects from other planets
    for (const aspecter of planets) {
      if (aspecter.planet.id === planetId) continue;
      if (doesAspect(aspecter, planet)) {
        const aspectModifier = ASPECT_MODIFIERS[aspecter.planet.id];
        if (aspectModifier) {
          modifiers.push({
            type: 'aspect',
            source: locale === 'hi'
              ? `${PLANET_NAMES[aspecter.planet.id]?.hi ?? String(aspecter.planet.id)} की दृष्टि`
              : `${PLANET_NAMES[aspecter.planet.id]?.en ?? String(aspecter.planet.id)} aspect`,
            text: getModifierText(aspectModifier, locale),
          });
        }
      }
    }

    // 3. Conjunctions
    for (const other of planets) {
      if (other.planet.id === planetId) continue;
      if (areConjunct(planet, other)) {
        const conjModifier = CONJUNCTION_MODIFIERS[other.planet.id];
        if (conjModifier) {
          modifiers.push({
            type: 'conjunction',
            source: locale === 'hi'
              ? `${PLANET_NAMES[other.planet.id]?.hi ?? String(other.planet.id)} के साथ युति`
              : `Conjunction with ${PLANET_NAMES[other.planet.id]?.en ?? String(other.planet.id)}`,
            text: getModifierText(conjModifier, locale),
          });
        }
      }
    }

    // 4. Retrograde
    if (planet.isRetrograde && RETROGRADE_MODIFIERS[planetId]) {
      const retModifier = RETROGRADE_MODIFIERS[planetId];
      modifiers.push({
        type: 'retrograde',
        source: locale === 'hi' ? 'वक्री' : 'Retrograde',
        text: getModifierText(retModifier, locale),
      });
    }

    // 5. Combine into paragraph
    const modifierTexts = modifiers.map(m => m.text);
    const combinedReading = modifierTexts.length > 0
      ? `${basePrediction} ${modifierTexts.join(' ')}`
      : basePrediction;

    const houseName = tl(HOUSE_NAMES[planet.house] ?? { en: `${planet.house}th` }, locale);
    planetReadings.push({
      planetId,
      planetName: locale === 'hi' ? (PLANET_NAMES[planetId]?.hi ?? String(planetId)) : (PLANET_NAMES[planetId]?.en ?? String(planetId)),
      sign: signId,
      signName,
      house: planet.house,
      basePrediction,
      modifiers,
      combinedReading,
      isRetrograde: planet.isRetrograde,
    });
  }

  // Life themes
  const lifeThemes = generateLifeThemes(planets, locale);

  // Karmic profile (from separate module but computed inline here for efficiency)
  const ketuPlanet = planets.find(p => p.planet.id === 8);
  const ketuSign = ketuPlanet?.sign ?? 1;
  const ketuHouse = ketuPlanet?.house ?? 1;
  const ketuRashi = RASHIS.find(r => r.id === ketuSign);
  const ketuSignName = tl(ketuRashi?.name ?? { en: 'Unknown' }, locale);
  const ketuHouseName = tl(HOUSE_NAMES[ketuHouse] ?? { en: `${ketuHouse}th` }, locale);

  const ketuBase = BNN_BASE[8]?.[ketuSign];
  const ketuReading = ketuBase
    ? (locale === 'hi' ? ketuBase.hi : ketuBase.en)
    : (locale === 'hi' ? 'केतु की राशि के लिए पठन अनुपलब्ध है।' : 'Ketu sign reading unavailable.');

  const pastLifeTheme = locale === 'hi'
    ? `आपका केतु ${ketuSignName} राशि में ${ketuHouseName} भाव में है, जो ${ketuSignName} की ऊर्जाओं में पूर्व जीवन की गहरी महारत दर्शाता है — एक ऐसा क्षेत्र जो इस जीवन में अनायास आता है लेकिन अकेले पूर्णता नहीं देता।`
    : `Your Ketu in ${ketuSignName} in the ${ketuHouseName} house indicates deep past-life mastery in the energies of ${ketuSignName} — a domain that comes naturally in this life but no longer provides fulfilment on its own.`;

  const rahuPlanet = planets.find(p => p.planet.id === 7);
  const rahuSign = rahuPlanet?.sign ?? 1;
  const rahuRashi = RASHIS.find(r => r.id === rahuSign);
  const rahuSignName = tl(rahuRashi?.name ?? { en: 'Unknown' }, locale);
  const rahuHouse = rahuPlanet?.house ?? 7;
  const rahuHouseName = tl(HOUSE_NAMES[rahuHouse] ?? { en: `${rahuHouse}th` }, locale);

  const dharmaPath = locale === 'hi'
    ? `आपका राहु ${rahuSignName} राशि में ${rahuHouseName} भाव में है — ${rahuSignName} के क्षेत्र में और ${rahuHouseName} भाव के विषयों में कदम रखना ही इस जन्म का धर्म मार्ग है। इस क्षेत्र में असुविधा और विकास आत्मा के विकास का संकेत है।`
    : `Your Rahu in ${rahuSignName} in the ${rahuHouseName} house indicates that stepping into the domain of ${rahuSignName} and the themes of the ${rahuHouseName} house is this incarnation\'s dharma path. Discomfort and growth in this area signals the soul\'s forward movement.`;

  return {
    planets: planetReadings,
    lifeThemes,
    karmicProfile: {
      ketuReading,
      pastLifeTheme,
      dharmaPath,
    },
  };
}
