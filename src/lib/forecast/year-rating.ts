/**
 * Year Rating Engine
 * Computes an overall year quality breakdown from multiple Jyotish factors.
 */

import type { KundaliData } from '@/types/kundali';
import type { VarshaphalData } from '@/types/varshaphal';
import type { MonthlyTransitSnapshot } from './monthly-transit';
import type { LocaleText,} from '@/types/panchang';

export interface YearRatingFactor {
  name: LocaleText;
  score: number;      // 1-5
  description: LocaleText;
}

export interface YearRating {
  overall: number;     // 1-5 (weighted average)
  factors: YearRatingFactor[];
}

// Rashi lords
const RASHI_LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];

// Benefic houses for Muntha: 1, 2, 3, 4, 5, 9, 10, 11
const MUNTHA_GOOD_HOUSES = new Set([1, 2, 3, 4, 5, 9, 10, 11]);

export function computeYearRating(
  natal: KundaliData,
  varshaphal: VarshaphalData,
  monthlyTransits: MonthlyTransitSnapshot[],
): YearRating {
  const factors: YearRatingFactor[] = [];

  // 1. Muntha placement (house from varshaphal lagna)
  const munthaHouse = varshaphal.muntha?.house || 1;
  const munthaScore = MUNTHA_GOOD_HOUSES.has(munthaHouse) ? 4 : munthaHouse === 6 || munthaHouse === 8 || munthaHouse === 12 ? 2 : 3;
  factors.push({
    name: { en: 'Muntha Placement', hi: 'मुंथा स्थिति', sa: 'मुन्था स्थितिः' },
    score: munthaScore,
    description: {
      en: `Muntha in house ${munthaHouse} — ${MUNTHA_GOOD_HOUSES.has(munthaHouse) ? 'favorable placement' : 'requires caution'}`,
      hi: `मुंथा ${munthaHouse}वें भाव में — ${MUNTHA_GOOD_HOUSES.has(munthaHouse) ? 'अनुकूल स्थिति' : 'सावधानी आवश्यक'}`,
      sa: `मुन्था ${munthaHouse}-भावे`,
    },
  });

  // 2. Varsheshvara (year lord) strength
  const yearLordId = varshaphal.varsheshvara?.planetId;
  let yearLordScore = 3;
  if (yearLordId !== undefined) {
    const ylPos = varshaphal.chart?.planets?.find(p => p.planet.id === yearLordId);
    if (ylPos) {
      if (ylPos.isExalted || ylPos.isOwnSign) yearLordScore = 5;
      else if (ylPos.isDebilitated) yearLordScore = 1;
      else yearLordScore = 3;
    }
  }
  factors.push({
    name: { en: 'Year Lord Strength', hi: 'वर्षेश्वर बल', sa: 'वर्षेश्वरबलम्' },
    score: yearLordScore,
    description: {
      en: `Year lord ${yearLordScore >= 4 ? 'is strong — auspicious year ahead' : yearLordScore <= 2 ? 'is weak — challenges expected' : 'is moderate — mixed results'}`,
      hi: `वर्षेश्वर ${yearLordScore >= 4 ? 'बलवान — शुभ वर्ष' : yearLordScore <= 2 ? 'दुर्बल — चुनौतियां' : 'मध्यम — मिश्रित फल'}`,
      sa: `वर्षेश्वरः ${yearLordScore >= 4 ? 'बलवान्' : 'दुर्बलः'}`,
    },
  });

  // 3. Transit SAV average across the year
  const yearAvgSav = monthlyTransits.length > 0
    ? Math.round(monthlyTransits.reduce((sum, m) => sum + m.avgSav, 0) / monthlyTransits.length)
    : 25;
  const transitScore = yearAvgSav >= 28 ? 5 : yearAvgSav >= 26 ? 4 : yearAvgSav >= 24 ? 3 : yearAvgSav >= 22 ? 2 : 1;
  factors.push({
    name: { en: 'Transit Strength (SAV)', hi: 'गोचर बल (SAV)', sa: 'गोचरबलम्' },
    score: transitScore,
    description: {
      en: `Average SAV across slow transits: ${yearAvgSav} bindus — ${transitScore >= 4 ? 'strong support' : transitScore <= 2 ? 'limited support' : 'moderate support'}`,
      hi: `गोचर औसत SAV: ${yearAvgSav} बिन्दु — ${transitScore >= 4 ? 'बलवान सहयोग' : transitScore <= 2 ? 'सीमित सहयोग' : 'मध्यम सहयोग'}`,
      sa: `गोचर SAV: ${yearAvgSav}`,
    },
  });

  // 4. Dasha lord dignity in natal chart
  const currentDasha = natal.dashas?.find(d => {
    const now = new Date().toISOString();
    return d.level === 'maha' && d.startDate <= now && d.endDate >= now;
  });
  let dashaScore = 3;
  if (currentDasha) {
    const dashaLordName = currentDasha.planet;
    // Find planet in natal chart
    const PLANET_NAME_TO_ID: Record<string, number> = {
      Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
    };
    const dashaLordId = PLANET_NAME_TO_ID[dashaLordName];
    if (dashaLordId !== undefined) {
      const dashaLordPos = natal.planets.find(p => p.planet.id === dashaLordId);
      if (dashaLordPos) {
        if (dashaLordPos.isExalted || dashaLordPos.isOwnSign) dashaScore = 5;
        else if (dashaLordPos.isDebilitated) dashaScore = 1;
        else if (dashaLordPos.isCombust) dashaScore = 2;
        else dashaScore = 3;
      }
    }
  }
  factors.push({
    name: { en: 'Dasha Lord Dignity', hi: 'दशा स्वामी गरिमा', sa: 'दशास्वामी गौरवम्' },
    score: dashaScore,
    description: {
      en: `Current dasha lord ${currentDasha?.planet || '?'} — ${dashaScore >= 4 ? 'well-placed in natal chart' : dashaScore <= 2 ? 'weak in natal chart' : 'adequately placed'}`,
      hi: `वर्तमान दशा स्वामी ${currentDasha?.planetName?.hi || '?'} — ${dashaScore >= 4 ? 'जन्म कुण्डली में बलवान' : dashaScore <= 2 ? 'दुर्बल' : 'पर्याप्त'}`,
      sa: `दशास्वामी: ${currentDasha?.planet || '?'}`,
    },
  });

  // 5. Tajika yogas
  const tajikaYogas = varshaphal.tajikaYogas || [];
  const favorableYogas = tajikaYogas.filter(y => y.favorable).length;
  const totalYogas = tajikaYogas.length;
  const yogaRatio = totalYogas > 0 ? favorableYogas / totalYogas : 0.5;
  const yogaScore = yogaRatio >= 0.7 ? 5 : yogaRatio >= 0.5 ? 4 : yogaRatio >= 0.3 ? 3 : yogaRatio >= 0.15 ? 2 : 1;
  factors.push({
    name: { en: 'Tajika Yogas', hi: 'ताजिक योग', sa: 'ताजिकयोगाः' },
    score: yogaScore,
    description: {
      en: `${favorableYogas} favorable out of ${totalYogas} Tajika yogas formed`,
      hi: `${totalYogas} ताजिक योगों में से ${favorableYogas} शुभ`,
      sa: `${favorableYogas}/${totalYogas} शुभयोगाः`,
    },
  });

  // Weighted average (Muntha 15%, Year Lord 25%, Transit 25%, Dasha 20%, Yogas 15%)
  const weights = [0.15, 0.25, 0.25, 0.20, 0.15];
  const overall = Math.round(
    factors.reduce((sum, f, i) => sum + f.score * weights[i], 0) * 10
  ) / 10;

  return { overall, factors };
}
