/**
 * Tajika Sahams (Arabic Parts) Calculator
 * 16 sahams used in Varshaphal annual chart analysis
 */

import { normalizeDeg, getRashiNumber } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import type { PlanetPosition, HouseCusp } from '@/types/kundali';
import type { SahamData } from '@/types/varshaphal';
import type { LocaleText,} from '@/types/panchang';

interface SahamFormula {
  name: LocaleText;
  a: number; // planet id or -1 for Asc
  b: number; // planet id or -1 for Asc
  reverse: boolean; // swap A/B for night birth
}

// 16 Tajika Sahams
// Formula: Saham = A - B + Asc (day) or B - A + Asc (night)
const SAHAM_FORMULAS: SahamFormula[] = [
  // Punya Saham: Day = Moon − Sun + Asc; Night = Sun − Moon + Asc
  // a=Moon(1), b=Sun(0), reverse=false → day uses (a−b) = Moon−Sun. Correct.
  //
  // HISTORICAL BUG (now fixed): reverse: true was set, which caused the day
  // formula to use the else-branch (b−a = Sun−Moon) and the night formula to
  // use the if-branch (a−b = Moon−Sun) — i.e., day and night formulas were
  // completely swapped.  Day-born natives received the night formula and vice
  // versa, making Punya Saham wrong for 100% of charts.
  { name: { en: 'Punya Saham', hi: 'पुण्य सहम', sa: 'पुण्यसहमः' }, a: 1, b: 0, reverse: false },     // Moon - Sun + Asc (day); Sun - Moon + Asc (night)

  // Vidya Saham: Day = Sun − Moon + Asc; Night = Moon − Sun + Asc
  // a=Sun(0), b=Moon(1), reverse=false → day uses (a−b) = Sun−Moon. Correct.
  //
  // HISTORICAL BUG (now fixed): same swap as Punya Saham — reverse: true gave
  // day births Moon−Sun and night births Sun−Moon (both wrong).
  { name: { en: 'Vidya Saham', hi: 'विद्या सहम', sa: 'विद्यासहमः' }, a: 0, b: 1, reverse: false },    // Sun - Moon + Asc (day); Moon - Sun + Asc (night)
  { name: { en: 'Yashas Saham', hi: 'यशः सहम', sa: 'यशःसहमः' }, a: 4, b: 0, reverse: false },         // Jupiter - Sun + Asc
  { name: { en: 'Mitra Saham', hi: 'मित्र सहम', sa: 'मित्रसहमः' }, a: 4, b: 5, reverse: false },       // Jupiter - Venus + Asc
  { name: { en: 'Mahatmya Saham', hi: 'महात्म्य सहम', sa: 'महात्म्यसहमः' }, a: 0, b: 6, reverse: false },  // Sun - Saturn + Asc
  { name: { en: 'Asha Saham', hi: 'आशा सहम', sa: 'आशासहमः' }, a: 6, b: 5, reverse: false },           // Saturn - Venus + Asc
  { name: { en: 'Samartha Saham', hi: 'सामर्थ्य सहम', sa: 'सामर्थ्यसहमः' }, a: 2, b: 6, reverse: false }, // Mars - Saturn + Asc
  { name: { en: 'Bhratri Saham', hi: 'भ्रातृ सहम', sa: 'भ्रातृसहमः' }, a: 4, b: 6, reverse: false },    // Jupiter - Saturn + Asc
  { name: { en: 'Pitri Saham', hi: 'पितृ सहम', sa: 'पितृसहमः' }, a: 6, b: 0, reverse: false },          // Saturn - Sun + Asc
  { name: { en: 'Matri Saham', hi: 'मातृ सहम', sa: 'मातृसहमः' }, a: 1, b: 5, reverse: false },          // Moon - Venus + Asc
  { name: { en: 'Putra Saham', hi: 'पुत्र सहम', sa: 'पुत्रसहमः' }, a: 4, b: 1, reverse: false },       // Jupiter - Moon + Asc
  { name: { en: 'Jeeva Saham', hi: 'जीव सहम', sa: 'जीवसहमः' }, a: 6, b: 4, reverse: false },           // Saturn - Jupiter + Asc
  { name: { en: 'Karma Saham', hi: 'कर्म सहम', sa: 'कर्मसहमः' }, a: 2, b: 1, reverse: false },         // Mars - Moon + Asc
  { name: { en: 'Roga Saham', hi: 'रोग सहम', sa: 'रोगसहमः' }, a: 6, b: 2, reverse: false },            // Saturn - Mars + Asc
  { name: { en: 'Kali Saham', hi: 'कलि सहम', sa: 'कलिसहमः' }, a: 4, b: 2, reverse: false },            // Jupiter - Mars + Asc
  { name: { en: 'Bandhu Saham', hi: 'बन्धु सहम', sa: 'बन्धुसहमः' }, a: 3, b: 1, reverse: false },      // Mercury - Moon + Asc
];

function getHouse(degree: number, cusps: HouseCusp[]): number {
  for (let i = 0; i < 12; i++) {
    const nextI = (i + 1) % 12;
    let start = cusps[i].degree;
    let end = cusps[nextI].degree;
    if (end < start) end += 360;
    let deg = degree;
    if (deg < start) deg += 360;
    if (deg >= start && deg < end) return i + 1;
  }
  return 1;
}

export function calculateSahams(
  ascendant: number,
  planets: PlanetPosition[],
  cusps: HouseCusp[],
  isDayBirth: boolean = true,
): SahamData[] {
  const getLong = (id: number): number => {
    if (id === -1) return ascendant;
    const planet = planets.find(p => p.planet.id === id);
    return planet?.longitude ?? 0;
  };

  return SAHAM_FORMULAS.map((formula) => {
    const a = getLong(formula.a);
    const b = getLong(formula.b);

    let degree: number;
    if (isDayBirth && !formula.reverse || !isDayBirth && formula.reverse) {
      degree = normalizeDeg(a - b + ascendant);
    } else {
      degree = normalizeDeg(b - a + ascendant);
    }

    const sign = getRashiNumber(degree);
    const rashi = RASHIS[sign - 1];
    const house = getHouse(degree, cusps);

    return {
      name: formula.name,
      degree,
      sign,
      signName: rashi.name,
      house,
    };
  });
}
