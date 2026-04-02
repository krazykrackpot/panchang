/**
 * Gochar (Transit) Overlay Engine
 * Computes how current planetary transits affect the user's natal chart.
 */

import type { Trilingual } from '@/types/panchang';
import { dateToJD, getPlanetaryPositions, toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GocharResult {
  planet: string;
  planetId: number;
  planetName: Trilingual;
  transitSign: number;       // Current sidereal sign (1-12)
  transitSignName: Trilingual;
  natalHouse: number;        // Which natal house this transit falls in
  isRetrograde: boolean;
  effect: Trilingual;        // Effect of this planet transiting this house
  isPositive: boolean;
}

// ---------------------------------------------------------------------------
// House effect texts (trilingual)
// ---------------------------------------------------------------------------

const HOUSE_EFFECTS: Record<number, { en: string; hi: string; sa: string }> = {
  1: {
    en: 'Transiting your ascendant — personal vitality and appearance affected',
    hi: 'आपके लग्न में गोचर — व्यक्तिगत ऊर्जा और रूप प्रभावित',
    sa: 'भवतः लग्ने गोचरः — व्यक्तिगतोर्जा रूपं च प्रभावितम्',
  },
  2: {
    en: 'Transiting your wealth house — financial matters in focus',
    hi: 'आपके धन भाव में गोचर — आर्थिक विषय केन्द्र में',
    sa: 'भवतः धनभावे गोचरः — आर्थिकविषयाः केन्द्रे',
  },
  3: {
    en: 'Transiting your courage house — communication and short travels active',
    hi: 'आपके पराक्रम भाव में गोचर — संवाद और लघु यात्राएँ सक्रिय',
    sa: 'भवतः पराक्रमभावे गोचरः — सम्वादः लघुयात्राश्च सक्रियाः',
  },
  4: {
    en: 'Transiting your home house — domestic matters and inner peace',
    hi: 'आपके सुख भाव में गोचर — गृह विषय और आन्तरिक शान्ति',
    sa: 'भवतः सुखभावे गोचरः — गृहविषयाः आन्तरिकशान्तिश्च',
  },
  5: {
    en: 'Transiting your creativity house — romance, children, speculation',
    hi: 'आपके सन्तान भाव में गोचर — प्रेम, सन्तान, अटकलें',
    sa: 'भवतः सन्तानभावे गोचरः — प्रेम, सन्तानाः, अटकलाश्च',
  },
  6: {
    en: 'Transiting your health house — health awareness, competition',
    hi: 'आपके रोग भाव में गोचर — स्वास्थ्य सजगता, प्रतिस्पर्धा',
    sa: 'भवतः रोगभावे गोचरः — आरोग्यसजगता, प्रतिस्पर्धा च',
  },
  7: {
    en: 'Transiting your partnership house — relationships, business partnerships',
    hi: 'आपके सप्तम भाव में गोचर — सम्बन्ध, व्यापार साझेदारी',
    sa: 'भवतः सप्तमभावे गोचरः — सम्बन्धाः, व्यापारसाझेदारी च',
  },
  8: {
    en: 'Transiting your transformation house — deep changes, research',
    hi: 'आपके अष्टम भाव में गोचर — गहन परिवर्तन, शोध',
    sa: 'भवतः अष्टमभावे गोचरः — गहनपरिवर्तनम्, शोधश्च',
  },
  9: {
    en: 'Transiting your fortune house — luck, travel, higher learning',
    hi: 'आपके भाग्य भाव में गोचर — भाग्य, यात्रा, उच्च शिक्षा',
    sa: 'भवतः भाग्यभावे गोचरः — भाग्यम्, यात्रा, उच्चशिक्षा च',
  },
  10: {
    en: 'Transiting your career house — professional achievements, status',
    hi: 'आपके कर्म भाव में गोचर — व्यावसायिक उपलब्धियाँ, प्रतिष्ठा',
    sa: 'भवतः कर्मभावे गोचरः — व्यावसायिकोपलब्धयः, प्रतिष्ठा च',
  },
  11: {
    en: 'Transiting your gains house — income, networking, fulfillment',
    hi: 'आपके लाभ भाव में गोचर — आय, जालतन्त्र, तृप्ति',
    sa: 'भवतः लाभभावे गोचरः — आयः, सम्पर्कजालम्, तृप्तिश्च',
  },
  12: {
    en: 'Transiting your loss house — expenses, foreign lands, spirituality',
    hi: 'आपके व्यय भाव में गोचर — खर्च, विदेश, आध्यात्मिकता',
    sa: 'भवतः व्ययभावे गोचरः — व्ययः, विदेशः, आध्यात्मिकता च',
  },
};

// Positive houses: 1,2,3,5,9,10,11
// Mixed/negative: 6,8,12
// Planet-dependent: 4,7
const POSITIVE_HOUSES = new Set([1, 2, 3, 5, 9, 10, 11]);
const NEGATIVE_HOUSES = new Set([6, 8, 12]);
// Houses 4, 7 depend on the planet — benefics (Jupiter, Venus, Moon, Mercury) positive, malefics mixed
const BENEFIC_PLANETS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus

function isHousePositive(house: number, planetId: number): boolean {
  if (POSITIVE_HOUSES.has(house)) return true;
  if (NEGATIVE_HOUSES.has(house)) return false;
  // Houses 4, 7 — depends on planet
  return BENEFIC_PLANETS.has(planetId);
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

export function computeGochar(natalAscSign: number, _natalMoonSign: number): GocharResult[] {
  const now = new Date();
  const jd = dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours() + now.getMinutes() / 60);
  const planets = getPlanetaryPositions(jd);

  const results: GocharResult[] = [];

  for (const planet of planets) {
    const graha = GRAHAS.find(g => g.id === planet.id);
    if (!graha) continue;

    const sidLong = toSidereal(planet.longitude, jd);
    const transitSign = getRashiNumber(sidLong);
    const rashi = RASHIS.find(r => r.id === transitSign);

    // Compute natal house: which house from the ascendant
    const natalHouse = ((transitSign - natalAscSign + 12) % 12) + 1;

    const effect = HOUSE_EFFECTS[natalHouse] || HOUSE_EFFECTS[1];
    const positive = isHousePositive(natalHouse, planet.id);

    results.push({
      planet: graha.name.en.toLowerCase(),
      planetId: planet.id,
      planetName: graha.name,
      transitSign,
      transitSignName: rashi?.name || { en: '', hi: '', sa: '' },
      natalHouse,
      isRetrograde: planet.isRetrograde,
      effect,
      isPositive: positive,
    });
  }

  return results;
}
