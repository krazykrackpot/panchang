/**
 * Annual Forecast Engine — Orchestrator
 * Combines Varshaphal, monthly transits, dasha narrative, and year rating
 * into a single structured forecast.
 */

import type { KundaliData } from '@/types/kundali';
import type { VarshaphalData } from '@/types/varshaphal';
import type { LocaleText} from '@/types/panchang';
import { computeMonthlyTransits, type MonthlyTransitSnapshot } from './monthly-transit';
import { computeYearRating, type YearRating } from './year-rating';
import { generateDashaNarrative, type DashaNarrative } from './dasha-narrative';

export interface KeyDate {
  date: string;
  quarter: 1 | 2 | 3 | 4;
  type: 'dasha_transition' | 'sign_change' | 'retrograde' | 'eclipse';
  description: LocaleText;
}

export interface AnnualForecast {
  year: number;
  natal: KundaliData;
  varshaphal: VarshaphalData;
  monthlyTransits: MonthlyTransitSnapshot[];
  yearRating: YearRating;
  dashaNarrative: DashaNarrative;
  keyDates: KeyDate[];
  remedies: RemedyRecommendation[];
}

export interface RemedyRecommendation {
  type: 'gemstone' | 'mantra' | 'practice';
  planetId: number;
  planetName: LocaleText;
  recommendation: LocaleText;
}

// Gemstone map
const GEMSTONE_MAP: Record<number, LocaleText> = {
  0: { en: 'Ruby (Manikya)', hi: 'माणिक्य', sa: 'माणिक्यम्' },
  1: { en: 'Pearl (Moti)', hi: 'मोती', sa: 'मुक्ता' },
  2: { en: 'Red Coral (Moonga)', hi: 'मूंगा', sa: 'प्रवालम्' },
  3: { en: 'Emerald (Panna)', hi: 'पन्ना', sa: 'मरकतम्' },
  4: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज', sa: 'पुष्परागम्' },
  5: { en: 'Diamond (Heera)', hi: 'हीरा', sa: 'वज्रम्' },
  6: { en: 'Blue Sapphire (Neelam)', hi: 'नीलम', sa: 'नीलम्' },
  7: { en: 'Hessonite (Gomed)', hi: 'गोमेद', sa: 'गोमेदम्' },
  8: { en: 'Cat\'s Eye (Lehsunia)', hi: 'लहसुनिया', sa: 'वैदूर्यम्' },
};

const MANTRA_MAP: Record<number, LocaleText> = {
  0: { en: 'Om Hraam Hreem Hraum Sah Suryaya Namah', hi: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', sa: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः' },
  1: { en: 'Om Shraam Shreem Shraum Sah Chandraya Namah', hi: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः', sa: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः' },
  2: { en: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah', hi: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', sa: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः' },
  3: { en: 'Om Braam Breem Braum Sah Budhaya Namah', hi: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', sa: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः' },
  4: { en: 'Om Graam Greem Graum Sah Gurave Namah', hi: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', sa: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' },
  5: { en: 'Om Draam Dreem Draum Sah Shukraya Namah', hi: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', sa: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः' },
  6: { en: 'Om Praam Preem Praum Sah Shanaischaraya Namah', hi: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', sa: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः' },
  7: { en: 'Om Bhraam Bhreem Bhraum Sah Rahave Namah', hi: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', sa: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः' },
  8: { en: 'Om Shraam Shreem Shraum Sah Ketave Namah', hi: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः', sa: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः' },
};

function generateRemedies(natal: KundaliData, dashaNarrative: DashaNarrative): RemedyRecommendation[] {
  const remedies: RemedyRecommendation[] = [];

  // Recommend gemstone + mantra for current dasha lord
  const mahaId = dashaNarrative.currentMaha.planetId;
  if (mahaId >= 0 && mahaId <= 8) {
    remedies.push({
      type: 'gemstone',
      planetId: mahaId,
      planetName: dashaNarrative.currentMaha.planetName,
      recommendation: {
        en: `Wear ${GEMSTONE_MAP[mahaId]?.en || 'gemstone'} for ${dashaNarrative.currentMaha.planet} dasha support`,
        hi: `${dashaNarrative.currentMaha.planetName.hi} दशा सहायता के लिए ${GEMSTONE_MAP[mahaId]?.hi || 'रत्न'} धारण करें`,
        sa: `${GEMSTONE_MAP[mahaId]?.sa || 'रत्नम्'} धारयतु`,
      },
    });

    remedies.push({
      type: 'mantra',
      planetId: mahaId,
      planetName: dashaNarrative.currentMaha.planetName,
      recommendation: MANTRA_MAP[mahaId] || { en: 'Chant planet mantra', hi: 'ग्रह मंत्र जपें', sa: 'ग्रहमन्त्रं जपेत्' },
    });
  }

  // Find weakest planet (debilitated or combust) for additional remedy
  for (const p of natal.planets) {
    if ((p.isDebilitated || p.isCombust) && p.planet.id !== mahaId && p.planet.id <= 8) {
      remedies.push({
        type: 'gemstone',
        planetId: p.planet.id,
        planetName: p.planet.name,
        recommendation: {
          en: `Consider ${GEMSTONE_MAP[p.planet.id]?.en || 'gemstone'} to strengthen ${p.isDebilitated ? 'debilitated' : 'combust'} ${p.planet.name.en}`,
          hi: `${p.isDebilitated ? 'नीच' : 'अस्त'} ${p.planet.name.hi} को बलवान बनाने के लिए ${GEMSTONE_MAP[p.planet.id]?.hi || 'रत्न'} विचार करें`,
          sa: `${GEMSTONE_MAP[p.planet.id]?.sa || 'रत्नम्'}`,
        },
      });
      break; // Only 1 additional
    }
  }

  return remedies;
}

function extractKeyDates(monthlyTransits: MonthlyTransitSnapshot[], dashaNarrative: DashaNarrative, year: number): KeyDate[] {
  const dates: KeyDate[] = [];

  // Sign changes from monthly transits
  for (const m of monthlyTransits) {
    const quarter = (Math.ceil(m.month / 3) as 1 | 2 | 3 | 4);
    for (const evt of m.significantEvents) {
      if (evt.includes('enters')) {
        dates.push({
          date: `${year}-${String(m.month).padStart(2, '0')}-15`,
          quarter,
          type: 'sign_change',
          description: { en: evt, hi: evt, sa: evt },
        });
      } else if (evt.includes('retrograde')) {
        dates.push({
          date: `${year}-${String(m.month).padStart(2, '0')}-15`,
          quarter,
          type: 'retrograde',
          description: { en: evt, hi: evt, sa: evt },
        });
      }
    }
  }

  // Dasha transitions
  for (const t of dashaNarrative.upcomingTransitions) {
    const d = new Date(t.startDate);
    const quarter = (Math.ceil((d.getMonth() + 1) / 3) as 1 | 2 | 3 | 4);
    dates.push({
      date: t.startDate.slice(0, 10),
      quarter,
      type: 'dasha_transition',
      description: {
        en: `${t.level === 'maha' ? 'Maha' : 'Antar'} Dasha of ${t.planet} begins`,
        hi: `${t.planetName.hi} ${t.level === 'maha' ? 'महा' : 'अन्तर'} दशा प्रारंभ`,
        sa: `${t.planetName.sa || t.planet} दशा आरम्भः`,
      },
    });
  }

  return dates.sort((a, b) => a.date.localeCompare(b.date));
}

export function generateAnnualForecast(
  natal: KundaliData,
  varshaphal: VarshaphalData,
  year: number,
): AnnualForecast {
  const ascendantSign = natal.ascendant.sign;
  const savTable = natal.ashtakavarga?.savTable || new Array(12).fill(25);

  const monthlyTransits = computeMonthlyTransits(ascendantSign, savTable, year);
  const dashaNarrative = generateDashaNarrative(natal, year);
  const yearRating = computeYearRating(natal, varshaphal, monthlyTransits);
  const keyDates = extractKeyDates(monthlyTransits, dashaNarrative, year);
  const remedies = generateRemedies(natal, dashaNarrative);

  return {
    year,
    natal,
    varshaphal,
    monthlyTransits,
    yearRating,
    dashaNarrative,
    keyDates,
    remedies,
  };
}
