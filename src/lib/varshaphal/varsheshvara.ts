/**
 * Varsheshvara (Year Lord) determination
 * The ruler of the year in Tajika annual horoscopy
 */

import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { PlanetPosition } from '@/types/kundali';
import type { VarsheshvaraInfo } from '@/types/varshaphal';
import type { Trilingual } from '@/types/panchang';

// Weekday to planet mapping for Varsheshvara candidates
// Sunday=0(Sun), Monday=1(Moon), Tue=2(Mars), Wed=3(Mercury), Thu=4(Jupiter), Fri=5(Venus), Sat=6(Saturn)
const WEEKDAY_LORDS: number[] = [0, 1, 2, 3, 4, 5, 6];

// 5 candidates for Varsheshvara (Panchaadhisvara)
// These are the 5 non-luminary weekday lords that qualify
const VARSHESHVARA_CANDIDATES: Record<number, number[]> = {
  0: [0, 4, 2, 6, 5], // Sunday: Sun, Jupiter, Mars, Saturn, Venus
  1: [1, 5, 6, 4, 2], // Monday: Moon, Venus, Saturn, Jupiter, Mars
  2: [2, 6, 4, 5, 0], // Tuesday: Mars, Saturn, Jupiter, Venus, Sun
  3: [3, 4, 5, 6, 2], // Wednesday: Mercury, Jupiter, Venus, Saturn, Mars
  4: [4, 0, 2, 5, 6], // Thursday: Jupiter, Sun, Mars, Venus, Saturn
  5: [5, 6, 3, 4, 1], // Friday: Venus, Saturn, Mercury, Jupiter, Moon
  6: [6, 2, 4, 0, 3], // Saturday: Saturn, Mars, Jupiter, Sun, Mercury
};

const VARSHESHVARA_DESCRIPTIONS: Record<number, Trilingual> = {
  0: {
    en: 'Sun as Year Lord brings authority, government favor, father\'s influence, and health focus.',
    hi: 'वर्षेश्वर सूर्य: अधिकार, सरकारी कृपा, पिता का प्रभाव और स्वास्थ्य पर ध्यान।',
    sa: 'वर्षेश्वरः सूर्यः: अधिकारः शासनकृपा पितृप्रभावश्च।',
  },
  1: {
    en: 'Moon as Year Lord brings emotional fulfillment, mother\'s blessings, and public recognition.',
    hi: 'वर्षेश्वर चन्द्र: भावनात्मक पूर्णता, माता का आशीर्वाद और जन मान्यता।',
    sa: 'वर्षेश्वरः चन्द्रः: भावनापूर्तिः मातृकृपा जनमान्यता च।',
  },
  2: {
    en: 'Mars as Year Lord brings courage, property matters, sibling relations, and energetic pursuits.',
    hi: 'वर्षेश्वर मंगल: साहस, संपत्ति विषय, भाई-बहन संबंध और ऊर्जावान कार्य।',
    sa: 'वर्षेश्वरः मङ्गलः: शौर्यं सम्पत्तिविषयाः भ्रातृसम्बन्धाश्च।',
  },
  3: {
    en: 'Mercury as Year Lord brings intellectual growth, business success, communication skills, and learning.',
    hi: 'वर्षेश्वर बुध: बौद्धिक विकास, व्यापार सफलता, संवाद कौशल और शिक्षा।',
    sa: 'वर्षेश्वरः बुधः: बौद्धिकविकासः व्यापारसफलता संवादकौशलं च।',
  },
  4: {
    en: 'Jupiter as Year Lord brings wisdom, spiritual growth, children\'s prosperity, and overall expansion.',
    hi: 'वर्षेश्वर बृहस्पति: ज्ञान, आध्यात्मिक विकास, संतान समृद्धि और समग्र विस्तार।',
    sa: 'वर्षेश्वरः बृहस्पतिः: ज्ञानम् आध्यात्मिकविकासः सन्तानसमृद्धिश्च।',
  },
  5: {
    en: 'Venus as Year Lord brings luxury, romance, artistic success, and financial gains.',
    hi: 'वर्षेश्वर शुक्र: विलासिता, प्रेम, कलात्मक सफलता और आर्थिक लाभ।',
    sa: 'वर्षेश्वरः शुक्रः: विलासिता प्रेम कलासफलता धनलाभश्च।',
  },
  6: {
    en: 'Saturn as Year Lord brings discipline, hard work yielding results, karmic lessons, and structure.',
    hi: 'वर्षेश्वर शनि: अनुशासन, कठिन परिश्रम से फल, कर्म पाठ और व्यवस्था।',
    sa: 'वर्षेश्वरः शनिः: अनुशासनम् कठिनपरिश्रमफलं कर्मपाठाश्च।',
  },
};

// Sign ownership map: planet id → signs owned (1-based, 1-12)
// Used for Parivartana tiebreaker only.
const OWN_SIGNS: Record<number, number[]> = {
  0: [5],          // Sun owns Leo (5)
  1: [4],          // Moon owns Cancer (4)
  2: [1, 8],       // Mars owns Aries (1) & Scorpio (8)
  3: [3, 6],       // Mercury owns Gemini (3) & Virgo (6)
  4: [9, 12],      // Jupiter owns Sagittarius (9) & Pisces (12)
  5: [2, 7],       // Venus owns Taurus (2) & Libra (7)
  6: [10, 11],     // Saturn owns Capricorn (10) & Aquarius (11)
};

/**
 * Returns true if planetA is in a sign owned by planetB AND
 * planetB is in a sign owned by planetA (mutual sign exchange).
 * Rahu/Ketu (ids 7/8) own no signs and cannot form Parivartana.
 */
function areInParivartana(a: PlanetPosition, b: PlanetPosition): boolean {
  const aInBSign = OWN_SIGNS[b.planet.id]?.includes(a.sign) ?? false;
  const bInASign = OWN_SIGNS[a.planet.id]?.includes(b.sign) ?? false;
  return aInBSign && bInASign;
}

export function determineVarsheshvara(
  solarReturnWeekday: number,
  planets: PlanetPosition[],
): VarsheshvaraInfo {
  const candidates = VARSHESHVARA_CANDIDATES[solarReturnWeekday] || [0, 4, 2, 6, 5];

  // Score each candidate based on dignity and house placement
  const scores: Record<number, number> = {};
  let bestScore = -1;

  for (const pid of candidates) {
    const planet = planets.find(p => p.planet.id === pid);
    if (!planet) continue;

    let score = 0;
    if (planet.isExalted) score += 30;
    if (planet.isOwnSign) score += 20;
    if (!planet.isDebilitated) score += 10;
    if (!planet.isRetrograde) score += 5;
    // Kendra (1,4,7,10) placement bonus
    if ([1, 4, 7, 10].includes(planet.house)) score += 15;
    // Trikona (1,5,9) placement bonus
    if ([1, 5, 9].includes(planet.house)) score += 10;

    scores[pid] = score;
    if (score > bestScore) bestScore = score;
  }

  // Collect all candidates that share the top score.
  const tied = candidates.filter(pid => scores[pid] === bestScore);

  // Tiebreaker per Tajika Shastra: among tied candidates, prefer the one that
  // is in Parivartana (mutual sign exchange) with any other tied candidate.
  //
  // HISTORICAL BUG (now fixed): on a tie the function silently picked the
  // first candidate in the weekday-ordered list, ignoring Parivartana.
  // Tajika texts (Neelakantha's commentary) give Parivartana as the explicit
  // tiebreaker before falling back to list order.
  let bestId = tied[0]; // default: first in list (original behaviour)
  if (tied.length > 1) {
    for (const pid of tied) {
      const pPlanet = planets.find(p => p.planet.id === pid);
      if (!pPlanet) continue;
      const inPariv = tied.some(otherId => {
        if (otherId === pid) return false;
        const other = planets.find(p => p.planet.id === otherId);
        return other ? areInParivartana(pPlanet, other) : false;
      });
      if (inPariv) {
        bestId = pid;
        break; // first tied candidate in Parivartana wins
      }
    }
  }

  const graha = GRAHAS[bestId];
  return {
    planet: graha.name.en,
    planetName: graha.name,
    planetId: bestId,
    strength: bestScore,
    description: VARSHESHVARA_DESCRIPTIONS[bestId] || VARSHESHVARA_DESCRIPTIONS[0],
  };
}
