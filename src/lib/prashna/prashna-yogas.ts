/**
 * Ashtamangala Prashna — Yoga Detection
 * Detects classical prashna yogas from the prashna chart's planetary positions.
 */

import { GRAHAS } from '@/lib/constants/grahas';
import type { PlanetPosition } from '@/types/kundali';
import type { PrashnaYoga } from '@/types/prashna';
import type { Trilingual } from '@/types/panchang';

/** Sign lord planet ID lookup: sign (1-12) -> planet id (0-8) */
const SIGN_LORD_IDS: Record<number, number> = {
  1: 2,  // Aries -> Mars
  2: 5,  // Taurus -> Venus
  3: 3,  // Gemini -> Mercury
  4: 1,  // Cancer -> Moon
  5: 0,  // Leo -> Sun
  6: 3,  // Virgo -> Mercury
  7: 5,  // Libra -> Venus
  8: 2,  // Scorpio -> Mars
  9: 4,  // Sagittarius -> Jupiter
  10: 6, // Capricorn -> Saturn
  11: 6, // Aquarius -> Saturn
  12: 4, // Pisces -> Jupiter
};

/** Calculate the house position of a planet relative to ascendant sign */
function houseFromAsc(planetSign: number, ascSign: number): number {
  return ((planetSign - ascSign + 12) % 12) + 1;
}

/**
 * Detect prashna yogas from the prashna chart.
 *
 * @param planets - Array of planet positions in the prashna chart
 * @param ascSign - Ascendant sign number (1-12) of the prashna chart
 * @returns Array of detected PrashnaYoga
 */
export function detectPrashnaYogas(
  planets: PlanetPosition[],
  ascSign: number
): PrashnaYoga[] {
  const yogas: PrashnaYoga[] = [];

  // Build quick lookup: planet id -> PlanetPosition
  const planetMap = new Map<number, PlanetPosition>();
  for (const p of planets) {
    planetMap.set(p.planet.id, p);
  }

  const moon = planetMap.get(1);
  const lagnaLordId = SIGN_LORD_IDS[ascSign];
  const lagnaLord = lagnaLordId !== undefined ? planetMap.get(lagnaLordId) : undefined;

  // Kendra houses (1, 4, 7, 10)
  const kendraHouses = [1, 4, 7, 10];

  // Benefic planet IDs
  const beneficIds = [4, 5, 3]; // Jupiter, Venus, Mercury
  // Malefic planet IDs
  const maleficIds = [6, 2, 7]; // Saturn, Mars, Rahu

  // --- 1. Mrityu Yoga: Moon in 8th house from ascendant ---
  if (moon) {
    const moonHouse = houseFromAsc(moon.sign, ascSign);
    if (moonHouse === 8) {
      yogas.push({
        name: {
          en: 'Mrityu Yoga',
          hi: 'मृत्यु योग',
          sa: 'मृत्युयोगः',
        },
        type: 'mrityu',
        planets: [GRAHAS[1].name],
        favorable: false,
        description: {
          en: 'Moon is placed in the 8th house from the ascendant, indicating danger, obstruction, and unfavorable outcomes. The querent should exercise extreme caution.',
          hi: 'चन्द्रमा लग्न से अष्टम भाव में स्थित है, जो खतरे, बाधा और प्रतिकूल परिणामों का संकेत देता है। प्रश्नकर्ता को अत्यधिक सावधानी बरतनी चाहिए।',
          sa: 'चन्द्रः लग्नात् अष्टमभावे स्थितः, भयं विघ्नं प्रतिकूलफलं च सूचयति। प्रष्टा अत्यन्तं सावधानः भवेत्।',
        },
      });
    }
  }

  // --- 2. Bandha Yoga: Lagna lord in 12th house ---
  if (lagnaLord) {
    const lagnaLordHouse = houseFromAsc(lagnaLord.sign, ascSign);
    if (lagnaLordHouse === 12) {
      const lordGraha = GRAHAS[lagnaLordId];
      yogas.push({
        name: {
          en: 'Bandha Yoga',
          hi: 'बन्ध योग',
          sa: 'बन्धयोगः',
        },
        type: 'bandha',
        planets: [lordGraha.name],
        favorable: false,
        description: {
          en: `The lagna lord ${lordGraha.name.en} is in the 12th house, indicating confinement, loss, and obstruction. The desired outcome faces significant barriers.`,
          hi: `लग्नेश ${lordGraha.name.hi} द्वादश भाव में है, जो बंधन, हानि और बाधा का संकेत देता है। वांछित परिणाम में महत्वपूर्ण बाधाएँ हैं।`,
          sa: `लग्नाधिपतिः ${lordGraha.name.sa} द्वादशभावे स्थितः, बन्धनं हानिं विघ्नं च सूचयति। इष्टफले महान्तः विघ्नाः सन्ति।`,
        },
      });
    }
  }

  // --- 3. Subha Yoga: Benefics in kendra houses ---
  const beneficsInKendra: Trilingual[] = [];
  for (const bId of beneficIds) {
    const planet = planetMap.get(bId);
    if (planet) {
      const house = houseFromAsc(planet.sign, ascSign);
      if (kendraHouses.includes(house)) {
        beneficsInKendra.push(GRAHAS[bId].name);
      }
    }
  }
  if (beneficsInKendra.length > 0) {
    yogas.push({
      name: {
        en: 'Subha Yoga',
        hi: 'शुभ योग',
        sa: 'शुभयोगः',
      },
      type: 'subha',
      planets: beneficsInKendra,
      favorable: true,
      description: {
        en: `Benefic planet(s) ${beneficsInKendra.map(p => p.en).join(', ')} in kendra houses strengthen the chart. The query will have a favorable outcome with divine support.`,
        hi: `शुभ ग्रह ${beneficsInKendra.map(p => p.hi).join(', ')} केन्द्र भावों में स्थित हैं, कुण्डली को बल देते हैं। प्रश्न का परिणाम अनुकूल रहेगा।`,
        sa: `शुभग्रहाः ${beneficsInKendra.map(p => p.sa).join(', ')} केन्द्रभावेषु स्थिताः कुण्डलीं बलयन्ति। प्रश्नस्य फलम् अनुकूलं भविष्यति।`,
      },
    });
  }

  // --- 4. Asubha Yoga: Malefics in kendra houses ---
  const maleficsInKendra: Trilingual[] = [];
  for (const mId of maleficIds) {
    const planet = planetMap.get(mId);
    if (planet) {
      const house = houseFromAsc(planet.sign, ascSign);
      if (kendraHouses.includes(house)) {
        maleficsInKendra.push(GRAHAS[mId].name);
      }
    }
  }
  if (maleficsInKendra.length > 0) {
    yogas.push({
      name: {
        en: 'Asubha Yoga',
        hi: 'अशुभ योग',
        sa: 'अशुभयोगः',
      },
      type: 'asubha',
      planets: maleficsInKendra,
      favorable: false,
      description: {
        en: `Malefic planet(s) ${maleficsInKendra.map(p => p.en).join(', ')} in kendra houses weaken the chart. Obstacles and delays are indicated.`,
        hi: `पाप ग्रह ${maleficsInKendra.map(p => p.hi).join(', ')} केन्द्र भावों में स्थित हैं, कुण्डली को दुर्बल करते हैं। बाधाएँ और विलम्ब संकेतित हैं।`,
        sa: `पापग्रहाः ${maleficsInKendra.map(p => p.sa).join(', ')} केन्द्रभावेषु स्थिताः कुण्डलीं दुर्बलयन्ति। विघ्नाः विलम्बाश्च सूचिताः।`,
      },
    });
  }

  // --- 5. Chandra Yoga: Moon in good house and not afflicted ---
  if (moon) {
    const moonHouse = houseFromAsc(moon.sign, ascSign);
    const goodHouses = [1, 4, 5, 7, 9, 10, 11];

    if (goodHouses.includes(moonHouse)) {
      // Check if Moon is afflicted: conjunct or in sign of malefic
      const moonAffected = maleficIds.some((mId) => {
        const malefic = planetMap.get(mId);
        return malefic && malefic.sign === moon.sign;
      });

      if (!moonAffected) {
        yogas.push({
          name: {
            en: 'Chandra Yoga',
            hi: 'चन्द्र योग',
            sa: 'चन्द्रयोगः',
          },
          type: 'chandra',
          planets: [GRAHAS[1].name],
          favorable: true,
          description: {
            en: `Moon is well-placed in house ${moonHouse} and free from malefic affliction. The mind of the querent is clear and the matter will progress smoothly.`,
            hi: `चन्द्रमा भाव ${moonHouse} में शुभ स्थिति में है और पाप पीड़ा से मुक्त है। प्रश्नकर्ता का मन स्पष्ट है और कार्य सुचारू रूप से आगे बढ़ेगा।`,
            sa: `चन्द्रः भावे ${moonHouse} शुभस्थाने स्थितः पापपीडारहितश्च। प्रष्टुः मनः प्रसन्नं कार्यं सुगमं प्रगमिष्यति।`,
          },
        });
      }
    }
  }

  return yogas;
}
