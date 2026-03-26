/**
 * Enhanced Life Area Analysis
 * Based on Uttara Kalamrita Ch.4-5, BPHS, Phaladeepika
 *
 * Factors in aspects, house lordship placement, and dignity scoring
 * for more nuanced life area ratings.
 */

import type { PlanetPosition, HouseCusp } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import type { LifeArea } from '@/lib/kundali/tippanni-types';
import { RASHIS } from '@/lib/constants/rashis';
import { getHouseLord, isKendra, isTrikona, isDusthana, isBenefic, isMalefic } from './utils';
import { getPlanetsAspectingHouse } from './aspects';
import { getPlanetDignity } from './dignity';

function t(locale: Locale, en: string, hi: string, sa?: string): string {
  if (locale === 'sa') return sa || hi;
  return locale === 'hi' ? hi : en;
}

function getP(planets: PlanetPosition[], id: number): PlanetPosition | undefined {
  return planets.find(p => p.planet.id === id);
}

/**
 * Enhanced house rating considering:
 * 1. Planets in the house (benefic/malefic, dignity)
 * 2. House lord's placement and dignity
 * 3. Aspects on the house
 */
function enhancedRateHouse(
  houseNum: number,
  planets: PlanetPosition[],
  ascSign: number,
  favorablePlanetIds: number[]
): number {
  let score = 5;

  // Planets in house
  const planetsInHouse = planets.filter(p => p.house === houseNum);
  for (const p of planetsInHouse) {
    if (favorablePlanetIds.includes(p.planet.id)) score += 1.5;
    else if (isMalefic(p.planet.id)) score -= 0.5;
    if (p.isExalted) score += 1.5;
    if (p.isDebilitated) score -= 1;
    if (p.isOwnSign) score += 1;
    if (p.isRetrograde && p.planet.id <= 6) score -= 0.3;
  }

  // House lord placement
  const lordId = getHouseLord(houseNum, ascSign);
  const lord = planets.find(p => p.planet.id === lordId);
  if (lord) {
    if (isKendra(lord.house) || isTrikona(lord.house)) score += 1;
    if (isDusthana(lord.house)) score -= 0.5;
    if (lord.isExalted) score += 0.5;
    if (lord.isDebilitated) score -= 0.5;
    if (lord.isOwnSign) score += 0.3;
  }

  // Aspects on house
  const aspecters = getPlanetsAspectingHouse(planets, houseNum);
  for (const asp of aspecters) {
    if (isBenefic(asp.planet.id)) score += 0.5;
    if (isMalefic(asp.planet.id) && asp.planet.id !== 0) score -= 0.3;
    // Jupiter aspect is always beneficial
    if (asp.planet.id === 4) score += 0.5;
  }

  return Math.max(1, Math.min(10, Math.round(score)));
}

export function analyzeCareerEnhanced(
  planets: PlanetPosition[],
  houses: HouseCusp[],
  ascSign: number,
  locale: Locale
): LifeArea {
  const rating = enhancedRateHouse(10, planets, ascSign, [0, 4, 6]);

  const sun = getP(planets, 0);
  const sat = getP(planets, 6);
  const jup = getP(planets, 4);
  const mars = getP(planets, 2);
  const tenthHouse = houses.find(h => h.house === 10);
  const tenthLord = planets.find(p => p.planet.id === getHouseLord(10, ascSign));

  // Aspects on 10th house
  const tenthAspecters = getPlanetsAspectingHouse(planets, 10);
  const jupAspects10 = tenthAspecters.some(p => p.planet.id === 4);
  const satAspects10 = tenthAspecters.some(p => p.planet.id === 6);

  let detailParts: string[] = [];
  if (locale === 'en') {
    if (tenthLord) detailParts.push(`10th lord ${tenthHouse?.lordName.en || ''} in house ${tenthLord.house} guides your career direction.`);
    if (sun && sun.house === 10) detailParts.push('Sun in 10th gives authority and government recognition.');
    if (sat && sat.house === 10) detailParts.push('Saturn in 10th — slow rise to lasting power through discipline.');
    if (jup && jup.house === 10) detailParts.push('Jupiter in 10th — ethical leadership and respected position.');
    if (jupAspects10 && !(jup && jup.house === 10)) detailParts.push('Jupiter aspects the 10th — wisdom blesses your career with ethical success.');
    if (satAspects10 && !(sat && sat.house === 10)) detailParts.push('Saturn aspects the 10th — career demands discipline but delivers lasting results.');
    if (tenthLord?.isExalted) detailParts.push('10th lord exalted — career potential is at its peak.');
    if (tenthLord?.isDebilitated) detailParts.push('10th lord debilitated — career requires extra effort, check for cancellation yogas.');
  } else {
    if (tenthLord) detailParts.push(`10वें भाव का स्वामी ${tenthHouse?.lordName.hi || ''} ${tenthLord.house}वें भाव में कैरियर की दिशा निर्धारित करता है।`);
    if (sun && sun.house === 10) detailParts.push('सूर्य 10वें भाव में — अधिकार और सरकारी मान्यता।');
    if (jupAspects10) detailParts.push('बृहस्पति की 10वें भाव पर दृष्टि — नैतिक सफलता का आशीर्वाद।');
    if (tenthLord?.isExalted) detailParts.push('10वें भाव का स्वामी उच्च — कैरियर क्षमता चरम पर।');
  }

  return {
    label: t(locale, 'Career & Profession', 'कैरियर और पेशा', 'जीविका'),
    icon: 'briefcase',
    rating,
    summary: t(locale,
      `10th house in ${tenthHouse?.signName.en || ''}. ${rating >= 7 ? 'Strong career potential with excellent planetary support and aspects.' : rating >= 5 ? 'Moderate career prospects — focused effort activates dormant potential.' : 'Career requires patience and strategic approach.'}`,
      `10वाँ भाव ${tenthHouse?.signName.hi || ''} में। ${rating >= 7 ? 'उत्कृष्ट ग्रहीय समर्थन से मजबूत कैरियर।' : rating >= 5 ? 'मध्यम कैरियर — केन्द्रित प्रयास से सुप्त क्षमता सक्रिय।' : 'कैरियर में धैर्य और रणनीतिक दृष्टिकोण आवश्यक।'}`),
    details: detailParts.join(' '),
  };
}

export function analyzeWealthEnhanced(
  planets: PlanetPosition[],
  houses: HouseCusp[],
  ascSign: number,
  locale: Locale
): LifeArea {
  const r2 = enhancedRateHouse(2, planets, ascSign, [4, 5]);
  const r11 = enhancedRateHouse(11, planets, ascSign, [4, 5]);
  const rating = Math.round((r2 + r11) / 2);

  const jup = getP(planets, 4);
  const ven = getP(planets, 5);
  const lord2 = planets.find(p => p.planet.id === getHouseLord(2, ascSign));
  const lord11 = planets.find(p => p.planet.id === getHouseLord(11, ascSign));

  let detailParts: string[] = [];
  if (locale === 'en') {
    if (jup && [2, 5, 9, 11].includes(jup.house)) detailParts.push('Jupiter supports wealth through wisdom and ethics.');
    if (ven && [2, 4, 11].includes(ven.house)) detailParts.push('Venus supports earning through beauty, art, or luxury.');
    if (lord2?.isExalted || lord11?.isExalted) detailParts.push('Wealth lord exalted — strong financial potential.');
    if (lord2 && isKendra(lord2.house)) detailParts.push('2nd lord in Kendra — stable, visible income sources.');
    // Dhana yoga check
    if (lord2 && lord11 && lord2.house === lord11.house) detailParts.push('2nd and 11th lords conjunct — powerful Dhana Yoga for wealth.');
  } else {
    if (jup && [2, 5, 9, 11].includes(jup.house)) detailParts.push('बृहस्पति ज्ञान और नैतिकता से धन का समर्थन करता है।');
    if (lord2?.isExalted || lord11?.isExalted) detailParts.push('धन स्वामी उच्च — मजबूत आर्थिक क्षमता।');
  }

  return {
    label: t(locale, 'Wealth & Finance', 'धन और वित्त', 'धनम्'),
    icon: 'coins',
    rating,
    summary: t(locale,
      `${rating >= 7 ? 'Strong wealth indicators with beneficial planetary aspects supporting multiple income channels.' : rating >= 5 ? 'Moderate financial prospects. Disciplined saving and strategic investments yield results.' : 'Financial growth requires patience, planning, and remedial measures.'}`,
      `${rating >= 7 ? 'शुभ ग्रहीय दृष्टि से अनेक आय स्रोतों को समर्थन।' : rating >= 5 ? 'मध्यम वित्तीय सम्भावनाएँ। अनुशासित बचत से परिणाम।' : 'आर्थिक विकास में धैर्य, योजना और उपचार आवश्यक।'}`),
    details: detailParts.join(' '),
  };
}

export function analyzeMarriageEnhanced(
  planets: PlanetPosition[],
  houses: HouseCusp[],
  ascSign: number,
  locale: Locale
): LifeArea {
  const rating = enhancedRateHouse(7, planets, ascSign, [4, 5, 1]);

  const ven = getP(planets, 5);
  const mars = getP(planets, 2);
  const sat = getP(planets, 6);
  const seventhHouse = houses.find(h => h.house === 7);
  const lord7 = planets.find(p => p.planet.id === getHouseLord(7, ascSign));

  // Manglik check
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const isManglik = mars && manglikHouses.includes(mars.house);

  let detailParts: string[] = [];
  if (locale === 'en') {
    detailParts.push(`7th lord ${seventhHouse?.lordName.en || ''} determines partnership nature.`);
    if (ven?.isExalted) detailParts.push('Venus exalted — exceptionally favorable for a beautiful marriage.');
    if (ven && ven.house === 7) detailParts.push('Venus in 7th — charming spouse and harmonious partnerships.');
    if (isManglik) detailParts.push('Manglik placement affects timing — marriage after 28 recommended.');
    if (sat && sat.house === 7) detailParts.push('Saturn in 7th — marriage may be delayed but lasting with a mature partner.');
    if (lord7 && isKendra(lord7.house)) detailParts.push('7th lord in Kendra — stable, prominent partnerships.');
    // Jupiter aspects 7th
    const jupAspects7 = getPlanetsAspectingHouse(planets, 7).some(p => p.planet.id === 4);
    if (jupAspects7) detailParts.push('Jupiter aspects 7th — divine blessing on marriage.');
  } else {
    detailParts.push(`7वें भाव का स्वामी ${seventhHouse?.lordName.hi || ''} साझेदारी का स्वरूप निर्धारित करता है।`);
    if (ven?.isExalted) detailParts.push('शुक्र उच्च — सुन्दर विवाह के लिए अत्यन्त अनुकूल।');
    if (isManglik) detailParts.push('मांगलिक स्थिति — 28 के बाद विवाह अनुशंसित।');
  }

  return {
    label: t(locale, 'Marriage & Relationships', 'विवाह और सम्बन्ध', 'विवाहः'),
    icon: 'heart',
    rating,
    summary: t(locale,
      `7th house in ${seventhHouse?.signName.en || ''}. ${rating >= 7 ? 'Favorable marriage prospects with strong planetary support.' : rating >= 5 ? 'Marriage brings both growth and lessons — mutual effort creates harmony.' : 'Relationship area benefits from patience, remedies, and conscious effort.'}`,
      `7वाँ भाव ${seventhHouse?.signName.hi || ''} में। ${rating >= 7 ? 'शुभ ग्रहीय समर्थन से अनुकूल विवाह।' : rating >= 5 ? 'विवाह विकास और पाठ दोनों — परस्पर प्रयास से सामंजस्य।' : 'सम्बन्ध में धैर्य, उपचार और सचेत प्रयास से लाभ।'}`),
    details: detailParts.join(' '),
  };
}

export function analyzeHealthEnhanced(
  planets: PlanetPosition[],
  houses: HouseCusp[],
  ascSign: number,
  locale: Locale
): LifeArea {
  const r1 = enhancedRateHouse(1, planets, ascSign, [4, 5]);
  const r6 = enhancedRateHouse(6, planets, ascSign, [0, 2]);
  const rating = Math.round((r1 + r6) / 2);

  const sun = getP(planets, 0);
  const mars = getP(planets, 2);
  const lagnaLord = planets.find(p => p.planet.id === getHouseLord(1, ascSign));
  const element = RASHIS[ascSign - 1]?.element;

  let detailParts: string[] = [];
  if (locale === 'en') {
    if (sun?.isExalted) detailParts.push('Exalted Sun gives excellent vitality and recovery power.');
    if (mars && [1, 6].includes(mars.house)) detailParts.push('Mars in angular/6th house gives physical strength.');
    if (lagnaLord?.isExalted) detailParts.push('Lagna lord exalted — strong constitution and natural resilience.');
    if (lagnaLord?.isDebilitated) detailParts.push('Lagna lord debilitated — health requires extra attention and preventive care.');
    detailParts.push(`Focus: ${element?.en === 'Fire' ? 'inflammation, fever, head' : element?.en === 'Earth' ? 'metabolism, bones, skin' : element?.en === 'Air' ? 'nervous system, lungs' : 'digestion, immunity'}.`);
  } else {
    if (lagnaLord?.isExalted) detailParts.push('लग्न स्वामी उच्च — सुदृढ़ संरचना और प्राकृतिक लचीलापन।');
    detailParts.push(`ध्यान: ${element?.hi} तत्व स्वास्थ्य क्षेत्र।`);
  }

  return {
    label: t(locale, 'Health & Wellbeing', 'स्वास्थ्य और कल्याण', 'स्वास्थ्यम्'),
    icon: 'heart-pulse',
    rating,
    summary: t(locale,
      `${rating >= 7 ? 'Strong vitality with beneficial planetary support. Natural resilience and recovery.' : rating >= 5 ? 'Generally good health with specific areas needing conscious attention.' : 'Health requires regular monitoring, preventive care, and remedial support.'}`,
      `${rating >= 7 ? 'शुभ ग्रहीय समर्थन से सुदृढ़ जीवन शक्ति।' : rating >= 5 ? 'सामान्यतः अच्छा स्वास्थ्य, विशेष ध्यान आवश्यक।' : 'स्वास्थ्य में नियमित निगरानी और उपचार आवश्यक।'}`),
    details: detailParts.join(' '),
  };
}

export function analyzeEducationEnhanced(
  planets: PlanetPosition[],
  houses: HouseCusp[],
  ascSign: number,
  locale: Locale
): LifeArea {
  const r4 = enhancedRateHouse(4, planets, ascSign, [3, 4]);
  const r5 = enhancedRateHouse(5, planets, ascSign, [3, 4]);
  const rating = Math.round((r4 + r5) / 2);

  const merc = getP(planets, 3);
  const jup = getP(planets, 4);
  const element = RASHIS[ascSign - 1]?.element;

  let detailParts: string[] = [];
  if (locale === 'en') {
    if (merc && [1, 4, 5, 10].includes(merc.house)) detailParts.push('Mercury well-placed — strong analytical and communication abilities.');
    if (jup && [4, 5, 9].includes(jup.house)) detailParts.push('Jupiter supports higher education and scholarly pursuits.');
    if (merc?.isExalted) detailParts.push('Mercury exalted — exceptional intellectual capacity.');
    if (jup?.isExalted) detailParts.push('Jupiter exalted — blessed with profound wisdom.');
    detailParts.push(`Learning style: ${element?.en === 'Fire' ? 'hands-on experiential' : element?.en === 'Earth' ? 'structured practical' : element?.en === 'Air' ? 'conceptual theoretical' : 'intuitive experiential'}.`);
  } else {
    if (merc && [1, 4, 5, 10].includes(merc.house)) detailParts.push('बुध शुभ स्थिति में — मजबूत विश्लेषणात्मक क्षमता।');
    if (jup && [4, 5, 9].includes(jup.house)) detailParts.push('बृहस्पति उच्च शिक्षा और विद्वत्ता का समर्थन।');
    detailParts.push(`सीखने की शैली: ${element?.hi} तत्व।`);
  }

  return {
    label: t(locale, 'Education & Learning', 'शिक्षा और ज्ञान', 'शिक्षा'),
    icon: 'graduation-cap',
    rating,
    summary: t(locale,
      `${rating >= 7 ? 'Excellent academic potential with strong intellectual planets and beneficial aspects.' : rating >= 5 ? 'Good learning ability — focused effort yields academic success and knowledge.' : 'Education requires extra dedication but perseverance leads to mastery.'}`,
      `${rating >= 7 ? 'मजबूत बौद्धिक ग्रहों से उत्कृष्ट शैक्षिक क्षमता।' : rating >= 5 ? 'अच्छी सीखने की क्षमता — केन्द्रित प्रयास से सफलता।' : 'शिक्षा में अतिरिक्त समर्पण — दृढ़ता से प्रवीणता।'}`),
    details: detailParts.join(' '),
  };
}
