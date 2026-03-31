/**
 * Varga (Divisional Chart) Tippanni — per-chart commentary
 * Generates interpretation for each divisional chart based on planet placements.
 * Reference: BPHS Ch.6-7, Jataka Parijata, Saravali
 */

import type { Locale } from '@/types/panchang';
import type { KundaliData, DivisionalChart, PlanetPosition } from '@/types/kundali';
import { RASHIS } from '@/lib/constants/rashis';

interface VargaInsight {
  chart: string;
  label: { en: string; hi: string };
  meaning: { en: string; hi: string };
  strength: 'strong' | 'moderate' | 'weak';
  insights: { en: string; hi: string }[];
}

interface VargaSynthesis {
  overall: { en: string; hi: string };
  strongAreas: { en: string; hi: string }[];
  weakAreas: { en: string; hi: string }[];
  vargaInsights: VargaInsight[];
}

const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' }, 1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' }, 3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' }, 5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' }, 7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

// Benefic planets: Jupiter, Venus, Moon (waxing), Mercury (unafflicted)
const BENEFICS = new Set([1, 3, 4, 5]);
const MALEFICS = new Set([0, 2, 6, 7, 8]);

// Houses that are good (kendras & trikonas) vs dusthanas
const GOOD_HOUSES = new Set([1, 4, 5, 7, 9, 10]);
const DUSTHANAS = new Set([6, 8, 12]);

function assessChartStrength(chart: DivisionalChart, natalPlanets: PlanetPosition[]): {
  strength: 'strong' | 'moderate' | 'weak';
  beneficCount: number;
  maleficInKendra: number;
  ascLordHouse: number;
} {
  let beneficInGood = 0;
  let maleficInKendra = 0;
  const ascLord = getSignLord(chart.ascendantSign);
  let ascLordHouse = 1;

  for (let h = 0; h < 12; h++) {
    const houseNum = h + 1;
    for (const pid of chart.houses[h]) {
      if (pid === ascLord) ascLordHouse = houseNum;
      if (BENEFICS.has(pid) && GOOD_HOUSES.has(houseNum)) beneficInGood++;
      if (MALEFICS.has(pid) && (houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10)) maleficInKendra++;
    }
  }

  const strength = beneficInGood >= 3 ? 'strong' : beneficInGood >= 1 ? 'moderate' : 'weak';
  return { strength, beneficCount: beneficInGood, maleficInKendra, ascLordHouse };
}

function getSignLord(sign: number): number {
  const lords: Record<number, number> = {
    1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
    7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
  };
  return lords[sign] ?? 0;
}

function getPlanetsInHouse(chart: DivisionalChart, house: number): number[] {
  return chart.houses[(house - 1) % 12] || [];
}

function generateChartInsights(
  chartKey: string,
  chart: DivisionalChart,
  natalPlanets: PlanetPosition[],
  locale: string,
): { en: string; hi: string }[] {
  const insights: { en: string; hi: string }[] = [];
  const assess = assessChartStrength(chart, natalPlanets);
  const ascName = RASHIS[chart.ascendantSign - 1]?.name;

  // Lagna lord placement
  const lordName = PLANET_NAMES[getSignLord(chart.ascendantSign)];
  if (GOOD_HOUSES.has(assess.ascLordHouse)) {
    insights.push({
      en: `${chartKey} Lagna lord (${lordName.en}) in ${assess.ascLordHouse}${ordinal(assess.ascLordHouse)} house — favorable placement supporting this life area.`,
      hi: `${chartKey} लग्नेश (${lordName.hi}) ${assess.ascLordHouse}वें भाव में — इस जीवन क्षेत्र का समर्थन।`,
    });
  } else if (DUSTHANAS.has(assess.ascLordHouse)) {
    insights.push({
      en: `${chartKey} Lagna lord (${lordName.en}) in ${assess.ascLordHouse}${ordinal(assess.ascLordHouse)} house (dusthana) — challenges and obstacles in this area.`,
      hi: `${chartKey} लग्नेश (${lordName.hi}) ${assess.ascLordHouse}वें भाव (दुःस्थान) में — इस क्षेत्र में चुनौतियाँ।`,
    });
  }

  // Benefics in kendras/trikonas
  const h1Planets = getPlanetsInHouse(chart, 1);
  if (h1Planets.some(p => BENEFICS.has(p))) {
    const names = h1Planets.filter(p => BENEFICS.has(p)).map(p => PLANET_NAMES[p]?.en).join(', ');
    insights.push({
      en: `Benefic(s) ${names} in ${chartKey} lagna — natural strength and positive outcomes.`,
      hi: `शुभ ग्रह ${chartKey} लग्न में — स्वाभाविक बल और अनुकूल परिणाम।`,
    });
  }

  // Jupiter in kendras
  for (const kendra of [1, 4, 7, 10]) {
    if (getPlanetsInHouse(chart, kendra).includes(4)) {
      insights.push({
        en: `Jupiter in ${kendra}${ordinal(kendra)} house of ${chartKey} — strong protection and growth in this domain.`,
        hi: `${chartKey} के ${kendra}वें भाव में गुरु — इस क्षेत्र में सुरक्षा और विकास।`,
      });
      break;
    }
  }

  // Saturn in dusthanas
  for (const dust of [6, 8, 12]) {
    if (getPlanetsInHouse(chart, dust).includes(6)) {
      insights.push({
        en: `Saturn in ${dust}${ordinal(dust)} house of ${chartKey} — delays and karmic lessons in this area. Patience advised.`,
        hi: `${chartKey} के ${dust}वें भाव में शनि — इस क्षेत्र में विलंब और कार्मिक शिक्षा। धैर्य आवश्यक।`,
      });
      break;
    }
  }

  // Malefics in 1st/7th
  if (h1Planets.some(p => MALEFICS.has(p))) {
    insights.push({
      en: `Malefic influence on ${chartKey} ascendant — challenges need to be overcome through effort.`,
      hi: `${chartKey} लग्न पर पाप प्रभाव — प्रयास से चुनौतियों पर विजय संभव।`,
    });
  }

  return insights;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Generate full Varga Tippanni — per-chart insights + synthesis
 */
export function generateVargaTippanni(kundali: KundaliData, locale: Locale): VargaSynthesis {
  const vargaInsights: VargaInsight[] = [];
  const strongAreas: { en: string; hi: string }[] = [];
  const weakAreas: { en: string; hi: string }[] = [];

  // D1 (Rashi)
  const d1Assess = assessChartStrength(
    { ...kundali.chart, division: 'D1', label: { en: 'D1', hi: 'D1', sa: 'D1' } },
    kundali.planets
  );
  vargaInsights.push({
    chart: 'D1',
    label: { en: 'Rashi (D1)', hi: 'राशि (D1)' },
    meaning: { en: 'Overall life, personality & general wellbeing', hi: 'समग्र जीवन, व्यक्तित्व एवं सामान्य कल्याण' },
    strength: d1Assess.strength,
    insights: generateChartInsights('D1', { ...kundali.chart, division: 'D1', label: { en: '', hi: '', sa: '' } }, kundali.planets, locale),
  });

  // D9 (Navamsha)
  const d9Assess = assessChartStrength(
    { ...kundali.navamshaChart, division: 'D9', label: { en: 'D9', hi: 'D9', sa: 'D9' } },
    kundali.planets
  );
  vargaInsights.push({
    chart: 'D9',
    label: { en: 'Navamsha (D9)', hi: 'नवांश (D9)' },
    meaning: { en: 'Marriage, dharma, inner self & the soul\'s purpose', hi: 'विवाह, धर्म, आंतरिक स्वरूप एवं आत्मा का उद्देश्य' },
    strength: d9Assess.strength,
    insights: generateChartInsights('D9', { ...kundali.navamshaChart, division: 'D9', label: { en: '', hi: '', sa: '' } }, kundali.planets, locale),
  });

  // All divisional charts
  if (kundali.divisionalCharts) {
    for (const [key, dc] of Object.entries(kundali.divisionalCharts)) {
      const assess = assessChartStrength(dc, kundali.planets);
      const insights = generateChartInsights(key, dc, kundali.planets, locale);
      const meaning = (dc as DivisionalChart & { meaning?: { en: string; hi: string } }).meaning || { en: '', hi: '' };

      vargaInsights.push({
        chart: key,
        label: { en: dc.label.en, hi: dc.label.hi },
        meaning,
        strength: assess.strength,
        insights,
      });

      if (assess.strength === 'strong') {
        strongAreas.push({ en: `${key}: ${meaning.en}`, hi: `${key}: ${meaning.hi}` });
      } else if (assess.strength === 'weak') {
        weakAreas.push({ en: `${key}: ${meaning.en}`, hi: `${key}: ${meaning.hi}` });
      }
    }
  }

  // Synthesis
  const strongCount = vargaInsights.filter(v => v.strength === 'strong').length;
  const weakCount = vargaInsights.filter(v => v.strength === 'weak').length;
  const totalCharts = vargaInsights.length;

  let overallEn = '';
  let overallHi = '';
  if (strongCount > totalCharts * 0.6) {
    overallEn = 'The native has exceptional Varga strength. Multiple divisional charts show benefic dominance in kendras and trikonas, indicating a life blessed with positive karma across many domains. The D9 (marriage/dharma) and D10 (career) charts are particularly important to check for specific life outcomes.';
    overallHi = 'जातक की वर्ग शक्ति उत्कृष्ट है। कई विभागीय चार्ट केंद्र और त्रिकोण में शुभ ग्रहों का प्रभुत्व दिखाते हैं, जो अनेक क्षेत्रों में सकारात्मक कर्म फल का संकेत है।';
  } else if (weakCount > totalCharts * 0.4) {
    overallEn = 'Several Varga charts show challenging placements. The native may face obstacles in multiple life areas but can overcome them through remedial measures, spiritual practice, and conscious effort. Focus on strengthening the weak chart areas through appropriate remedies.';
    overallHi = 'कई वर्ग चार्ट चुनौतीपूर्ण स्थिति दिखाते हैं। जातक को कई जीवन क्षेत्रों में बाधाओं का सामना करना पड़ सकता है लेकिन उपचार, आध्यात्मिक साधना और सचेत प्रयास से उन्हें पार किया जा सकता है।';
  } else {
    overallEn = 'The Varga analysis shows a balanced chart with both strengths and areas for growth. Some divisional charts show strong benefic influence while others indicate moderate challenges. This is a typical and workable chart — focus your attention on the specific areas highlighted below.';
    overallHi = 'वर्ग विश्लेषण एक संतुलित कुंडली दर्शाता है जिसमें शक्तियां और विकास के क्षेत्र दोनों हैं। कुछ विभागीय चार्ट शुभ प्रभाव दिखाते हैं जबकि अन्य मध्यम चुनौतियां दर्शाते हैं।';
  }

  return {
    overall: { en: overallEn, hi: overallHi },
    strongAreas,
    weakAreas,
    vargaInsights,
  };
}
