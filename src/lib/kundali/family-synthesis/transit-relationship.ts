/**
 * Transit Relationship Impact -- how current transits affect relationship houses.
 *
 * For marriage: checks transits to 7th house (partnership), 1st (self in relationship),
 * 2nd house (family/shared resources) in both charts.
 *
 * For children: checks transits to 5th house (children), 1st (child's identity),
 * 4th house (home/nurture) in both charts.
 *
 * Only considers slow planets: Jupiter(4), Venus(5), Saturn(6), Rahu(7), Ketu(8).
 * Whole sign house system: house sign = ((ascSign - 1 + house - 1) % 12) + 1.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { TransitRelationshipImpact, TransitHit } from './types';

const RASHI_NAMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'Aries', hi: 'मेष' }, 2: { en: 'Taurus', hi: 'वृषभ' },
  3: { en: 'Gemini', hi: 'मिथुन' }, 4: { en: 'Cancer', hi: 'कर्क' },
  5: { en: 'Leo', hi: 'सिंह' }, 6: { en: 'Virgo', hi: 'कन्या' },
  7: { en: 'Libra', hi: 'तुला' }, 8: { en: 'Scorpio', hi: 'वृश्चिक' },
  9: { en: 'Sagittarius', hi: 'धनु' }, 10: { en: 'Capricorn', hi: 'मकर' },
  11: { en: 'Aquarius', hi: 'कुम्भ' }, 12: { en: 'Pisces', hi: 'मीन' },
};

const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' }, 1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' }, 3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' }, 5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' }, 7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

// Slow planets that matter for transit analysis
const SLOW_PLANET_IDS = [4, 5, 6, 7, 8]; // Jupiter, Venus, Saturn, Rahu, Ketu

// Benefic vs malefic for tone assessment
const BENEFIC_IDS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
const MALEFIC_IDS = new Set([0, 2, 6, 7, 8]); // Sun, Mars, Saturn, Rahu, Ketu

type Context = 'marriage' | 'children';

/** Helper: extract planet id from a PlanetPosition-like object. */
function getPid(p: PlanetPosition | Record<string, unknown>): number {
  // Real PlanetPosition has p.planet.id; test fixtures may have p.id directly
  const raw = p as Record<string, unknown>;
  if (typeof raw.id === 'number') return raw.id;
  if (raw.planet && typeof (raw.planet as Record<string, unknown>).id === 'number') {
    return (raw.planet as Record<string, unknown>).id as number;
  }
  return -1;
}

/** Get the houses relevant to a relationship context. */
function getRelationshipHouses(context: Context): number[] {
  return context === 'marriage' ? [7, 1, 2] : [5, 1, 4];
}

/** Get the sign occupying a house (whole sign from ascendant). */
function houseToSign(ascSign: number, house: number): number {
  return ((ascSign - 1 + house - 1) % 12) + 1;
}

/** Check which slow transit planets are hitting relationship houses in a chart. */
function findTransitHits(
  chart: KundaliData,
  transitPlanets: PlanetPosition[],
  context: Context,
): TransitHit[] {
  const houses = getRelationshipHouses(context);
  const hits: TransitHit[] = [];

  for (const tp of transitPlanets) {
    const pid = getPid(tp);
    if (!SLOW_PLANET_IDS.includes(pid)) continue;

    for (const house of houses) {
      const houseSign = houseToSign(chart.ascendant.sign, house);
      if (tp.sign === houseSign) {
        const pName = PLANET_NAMES[pid] ?? { en: `Planet ${pid}`, hi: `ग्रह ${pid}` };
        const rName = RASHI_NAMES[houseSign] ?? { en: `Sign ${houseSign}`, hi: `राशि ${houseSign}` };

        const isBenefic = BENEFIC_IDS.has(pid);
        const houseLabel = context === 'marriage'
          ? (house === 7 ? 'partnership' : house === 1 ? 'self' : 'family resources')
          : (house === 5 ? 'children' : house === 1 ? 'identity' : 'home & nurture');

        const effectEn = isBenefic
          ? `${pName.en} transiting ${rName.en} (${house}th house) supports ${houseLabel}.`
          : `${pName.en} transiting ${rName.en} (${house}th house) brings pressure to ${houseLabel}.`;
        const effectHi = isBenefic
          ? `${pName.hi} ${rName.hi} में (${house}वें भाव) ${houseLabel} को सहायता दे रहा है।`
          : `${pName.hi} ${rName.hi} में (${house}वें भाव) ${houseLabel} पर दबाव ला रहा है।`;

        hits.push({
          planet: pName.en,
          house,
          sign: rName.en,
          effect: { en: effectEn, hi: effectHi },
        });
      }
    }
  }

  return hits;
}

/** Determine overall tone from benefic/malefic ratio. */
function assessTone(
  yourHits: TransitHit[],
  theirHits: TransitHit[],
  transitPlanets: PlanetPosition[],
): TransitRelationshipImpact['overallTone'] {
  const allHits = [...yourHits, ...theirHits];
  if (allHits.length === 0) return 'neutral';

  let beneficCount = 0;
  let maleficCount = 0;
  for (const hit of allHits) {
    const tp = transitPlanets.find(p => PLANET_NAMES[getPid(p)]?.en === hit.planet);
    if (tp && BENEFIC_IDS.has(getPid(tp))) beneficCount++;
    if (tp && MALEFIC_IDS.has(getPid(tp))) maleficCount++;
  }

  if (beneficCount > maleficCount + 1) return 'supportive';
  if (maleficCount > beneficCount + 1) return 'challenging';
  if (beneficCount > 0 && maleficCount > 0) return 'mixed';
  if (beneficCount > 0) return 'supportive';
  if (maleficCount > 0) return 'challenging';
  return 'neutral';
}

/**
 * Compute how current transits impact the relationship between two charts.
 */
export function computeTransitRelationshipImpact(
  chartA: KundaliData,
  chartB: KundaliData,
  transitPlanets: PlanetPosition[],
  context: Context,
): TransitRelationshipImpact {
  const yourTransits = findTransitHits(chartA, transitPlanets, context);
  const theirTransits = findTransitHits(chartB, transitPlanets, context);
  const overallTone = assessTone(yourTransits, theirTransits, transitPlanets);

  // Generate narrative
  const totalHits = yourTransits.length + theirTransits.length;
  const contextLabel = context === 'marriage' ? 'relationship' : 'parent-child bond';
  const contextLabelHi = context === 'marriage' ? 'संबंध' : 'माता-पिता-संतान बंधन';

  let en: string;
  let hi: string;

  if (totalHits === 0) {
    en = `No major slow-planet transits are currently activating ${contextLabel} houses in either chart. A calm, neutral period.`;
    hi = `इस समय किसी भी चार्ट में ${contextLabelHi} भावों पर कोई प्रमुख धीमे ग्रह गोचर सक्रिय नहीं है। शांत, तटस्थ अवधि।`;
  } else {
    const toneEn = overallTone === 'supportive' ? 'favourable' : overallTone === 'challenging' ? 'demanding' : overallTone === 'mixed' ? 'mixed' : 'stable';
    const toneHi = overallTone === 'supportive' ? 'अनुकूल' : overallTone === 'challenging' ? 'चुनौतीपूर्ण' : overallTone === 'mixed' ? 'मिश्रित' : 'स्थिर';
    en = `Current transits create a ${toneEn} environment for your ${contextLabel}. `;
    hi = `वर्तमान गोचर आपके ${contextLabelHi} के लिए ${toneHi} वातावरण बना रहे हैं। `;

    // Add top hit summaries
    const topHits = [...yourTransits, ...theirTransits].slice(0, 3);
    for (const hit of topHits) {
      en += hit.effect.en + ' ';
      hi += (hit.effect.hi ?? hit.effect.en) + ' ';
    }
  }

  return {
    overallTone,
    yourTransits,
    theirTransits,
    narrative: { en: en.trim(), hi: hi.trim() },
  };
}
