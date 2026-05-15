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
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

function t(locale: Locale, en: string, hi: string, _sa?: string): string {
  // Devanagari-script locales (hi, sa, mr, mai) use Hindi text; all others use English
  return isDevanagariLocale(locale) ? hi : en;
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
    if (sat && sat.house === 10) detailParts.push('Saturn in 10th  –  slow rise to lasting power through discipline.');
    if (jup && jup.house === 10) detailParts.push('Jupiter in 10th  –  ethical leadership and respected position.');
    if (jupAspects10 && !(jup && jup.house === 10)) detailParts.push('Jupiter aspects the 10th  –  wisdom blesses your career with ethical success.');
    if (satAspects10 && !(sat && sat.house === 10)) detailParts.push('Saturn aspects the 10th  –  career demands discipline but delivers lasting results.');
    if (tenthLord?.isExalted) detailParts.push('10th lord exalted  –  career potential is at its peak.');
    if (tenthLord?.isDebilitated) detailParts.push('10th lord debilitated  –  career requires extra effort, check for cancellation yogas.');
  } else {
    if (tenthLord) detailParts.push(`10वें भाव का स्वामी ${tenthHouse?.lordName.hi || ''} ${tenthLord.house}वें भाव में कैरियर की दिशा निर्धारित करता है।`);
    if (sun && sun.house === 10) detailParts.push('सूर्य 10वें भाव में  –  अधिकार और सरकारी मान्यता।');
    if (jupAspects10) detailParts.push('बृहस्पति की 10वें भाव पर दृष्टि  –  नैतिक सफलता का आशीर्वाद।');
    if (tenthLord?.isExalted) detailParts.push('10वें भाव का स्वामी उच्च  –  कैरियर क्षमता चरम पर।');
  }

  const lordName = tenthHouse?.lordName.en || '';
  const lordNameHi = tenthHouse?.lordName.hi || '';
  const signEn = tenthHouse?.signName.en || '';
  const signHi = tenthHouse?.signName.hi || '';
  const lordHouse = tenthLord ? tenthLord.house : 0;

  // Factual summary — describes chart configuration without quality judgement.
  // Domain synthesis provides the authoritative quality assessment (Lesson M).
  const lordPlacementEn = tenthLord ? `${lordName} (10th lord) is placed in house ${lordHouse}${tenthLord.isExalted ? ' (exalted)' : tenthLord.isDebilitated ? ' (debilitated)' : tenthLord.isOwnSign ? ' (own sign)' : ''}.` : '';
  const lordPlacementHi = tenthLord ? `${lordNameHi} (10वें भाव स्वामी) ${lordHouse}वें भाव में${tenthLord.isExalted ? ' (उच्च)' : tenthLord.isDebilitated ? ' (नीच)' : tenthLord.isOwnSign ? ' (स्वराशि)' : ''}।` : '';

  const careerSummaryEn = `10th house in ${signEn}. ${lordPlacementEn}${jupAspects10 ? ' Jupiter aspects the 10th house.' : ''}${satAspects10 ? ' Saturn aspects the 10th house.' : ''} Career direction is shaped by the 10th lord's dasha periods and transit activations.`;
  const careerSummaryHi = `10वाँ भाव ${signHi} में। ${lordPlacementHi}${jupAspects10 ? ' बृहस्पति की 10वें भाव पर दृष्टि।' : ''}${satAspects10 ? ' शनि की 10वें भाव पर दृष्टि।' : ''} कैरियर की दिशा 10वें स्वामी की दशा और गोचर पर निर्भर।`;

  return {
    label: t(locale, 'Career & Profession', 'कैरियर और पेशा', 'जीविका'),
    icon: 'briefcase',
    rating,
    summary: t(locale, careerSummaryEn, careerSummaryHi),
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
    if (lord2?.isExalted || lord11?.isExalted) detailParts.push('Wealth lord exalted  –  strong financial potential.');
    if (lord2 && isKendra(lord2.house)) detailParts.push('2nd lord in Kendra  –  stable, visible income sources.');
    // Dhana yoga check
    if (lord2 && lord11 && lord2.house === lord11.house) detailParts.push('2nd and 11th lords conjunct  –  powerful Dhana Yoga for wealth.');
  } else {
    if (jup && [2, 5, 9, 11].includes(jup.house)) detailParts.push('बृहस्पति ज्ञान और नैतिकता से धन का समर्थन करता है।');
    if (lord2?.isExalted || lord11?.isExalted) detailParts.push('धन स्वामी उच्च  –  मजबूत आर्थिक क्षमता।');
  }

  // Factual summary (Lesson M — domain synthesis provides quality assessment)
  const lord2Name = houses.find(h => h.house === 2)?.lordName.en ?? '';
  const lord11Name = houses.find(h => h.house === 11)?.lordName.en ?? '';
  const lord2NameHi = houses.find(h => h.house === 2)?.lordName.hi ?? '';
  const lord11NameHi = houses.find(h => h.house === 11)?.lordName.hi ?? '';
  const lord2House = lord2 ? lord2.house : 0;
  const lord11House = lord11 ? lord11.house : 0;

  const wealthSummaryEn = `2nd house lord ${lord2Name} in house ${lord2House}${lord2?.isExalted ? ' (exalted)' : lord2?.isDebilitated ? ' (debilitated)' : ''}. 11th house lord ${lord11Name} in house ${lord11House}${lord11?.isExalted ? ' (exalted)' : lord11?.isDebilitated ? ' (debilitated)' : ''}. Wealth outcomes are shaped by the dasha periods of these two lords.`;
  const wealthSummaryHi = `2वें भाव स्वामी ${lord2NameHi} ${lord2House}वें भाव में${lord2?.isExalted ? ' (उच्च)' : lord2?.isDebilitated ? ' (नीच)' : ''}। 11वें भाव स्वामी ${lord11NameHi} ${lord11House}वें भाव में${lord11?.isExalted ? ' (उच्च)' : lord11?.isDebilitated ? ' (नीच)' : ''}। इन दोनों स्वामियों की दशा काल में धन लाभ।`;

  return {
    label: t(locale, 'Wealth & Finance', 'धन और वित्त', 'धनम्'),
    icon: 'coins',
    rating,
    summary: t(locale, wealthSummaryEn, wealthSummaryHi),
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
    if (ven?.isExalted) detailParts.push('Venus exalted  –  exceptionally favorable for a beautiful marriage.');
    if (ven && ven.house === 7) detailParts.push('Venus in 7th  –  charming spouse and harmonious partnerships.');
    if (isManglik) detailParts.push('Manglik placement affects timing  –  marriage after 28 recommended.');
    if (sat && sat.house === 7) detailParts.push('Saturn in 7th  –  marriage may be delayed but lasting with a mature partner.');
    if (lord7 && isKendra(lord7.house)) detailParts.push('7th lord in Kendra  –  stable, prominent partnerships.');
    // Jupiter aspects 7th
    const jupAspects7 = getPlanetsAspectingHouse(planets, 7).some(p => p.planet.id === 4);
    if (jupAspects7) detailParts.push('Jupiter aspects 7th  –  divine blessing on marriage.');
  } else {
    detailParts.push(`7वें भाव का स्वामी ${seventhHouse?.lordName.hi || ''} साझेदारी का स्वरूप निर्धारित करता है।`);
    if (ven?.isExalted) detailParts.push('शुक्र उच्च  –  सुन्दर विवाह के लिए अत्यन्त अनुकूल।');
    if (isManglik) detailParts.push('मांगलिक स्थिति  –  28 के बाद विवाह अनुशंसित।');
  }

  const sign7En = seventhHouse?.signName.en || '';
  const sign7Hi = seventhHouse?.signName.hi || '';
  const lord7Name = seventhHouse?.lordName.en || '';
  const lord7NameHi = seventhHouse?.lordName.hi || '';

  // Factual summary (Lesson M)
  const lord7House = lord7 ? lord7.house : 0;
  const marriageSummaryEn = `7th house in ${sign7En}. ${lord7Name} (7th lord) in house ${lord7House}${lord7?.isExalted ? ' (exalted)' : lord7?.isDebilitated ? ' (debilitated)' : ''}.${isManglik ? ' Manglik placement present.' : ''}${ven && ven.house === 7 ? ' Venus in 7th house.' : ''} Marriage timing and quality are shaped by the 7th lord's dasha and transits.`;
  const marriageSummaryHi = `7वाँ भाव ${sign7Hi} में। ${lord7NameHi} (7वें स्वामी) ${lord7House}वें भाव में${lord7?.isExalted ? ' (उच्च)' : lord7?.isDebilitated ? ' (नीच)' : ''}।${isManglik ? ' मांगलिक स्थिति।' : ''} विवाह समय और गुणवत्ता 7वें स्वामी की दशा पर निर्भर।`;

  return {
    label: t(locale, 'Marriage & Relationships', 'विवाह और सम्बन्ध', 'विवाहः'),
    icon: 'heart',
    rating,
    summary: t(locale, marriageSummaryEn, marriageSummaryHi),
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
    if (lagnaLord?.isExalted) detailParts.push('Lagna lord exalted  –  strong constitution and natural resilience.');
    if (lagnaLord?.isDebilitated) detailParts.push('Lagna lord debilitated  –  health requires extra attention and preventive care.');
    detailParts.push(`Focus: ${element?.en === 'Fire' ? 'inflammation, fever, head' : element?.en === 'Earth' ? 'metabolism, bones, skin' : element?.en === 'Air' ? 'nervous system, lungs' : 'digestion, immunity'}.`);
  } else {
    if (lagnaLord?.isExalted) detailParts.push('लग्न स्वामी उच्च  –  सुदृढ़ संरचना और प्राकृतिक लचीलापन।');
    detailParts.push(`ध्यान: ${element?.hi} तत्व स्वास्थ्य क्षेत्र।`);
  }

  // Factual summary (Lesson M)
  const elemEn = element?.en || 'Water';
  const elemHi = element?.hi || 'जल';
  const lagnaLordName = houses.find(h => h.house === 1)?.lordName.en ?? '';
  const lagnaLordNameHi = houses.find(h => h.house === 1)?.lordName.hi ?? '';
  const lagnaLordHouse = lagnaLord ? lagnaLord.house : 0;

  const healthSummaryEn = `Lagna lord ${lagnaLordName} in house ${lagnaLordHouse}${lagnaLord?.isExalted ? ' (exalted)' : lagnaLord?.isDebilitated ? ' (debilitated)' : ''}. ${elemEn} element constitution. Health focus areas are determined by the 6th house condition and malefic transits over the 1st house.`;
  const healthSummaryHi = `लग्न स्वामी ${lagnaLordNameHi} ${lagnaLordHouse}वें भाव में${lagnaLord?.isExalted ? ' (उच्च)' : lagnaLord?.isDebilitated ? ' (नीच)' : ''}। ${elemHi} तत्व संरचना। स्वास्थ्य 6वें भाव और प्रथम भाव पर पाप गोचर से प्रभावित।`;

  return {
    label: t(locale, 'Health & Wellbeing', 'स्वास्थ्य और कल्याण', 'स्वास्थ्यम्'),
    icon: 'heart-pulse',
    rating,
    summary: t(locale, healthSummaryEn, healthSummaryHi),
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
    if (merc && [1, 4, 5, 10].includes(merc.house)) detailParts.push('Mercury well-placed  –  strong analytical and communication abilities.');
    if (jup && [4, 5, 9].includes(jup.house)) detailParts.push('Jupiter supports higher education and scholarly pursuits.');
    if (merc?.isExalted) detailParts.push('Mercury exalted  –  exceptional intellectual capacity.');
    if (jup?.isExalted) detailParts.push('Jupiter exalted  –  blessed with profound wisdom.');
    detailParts.push(`Learning style: ${element?.en === 'Fire' ? 'hands-on experiential' : element?.en === 'Earth' ? 'structured practical' : element?.en === 'Air' ? 'conceptual theoretical' : 'intuitive experiential'}.`);
  } else {
    if (merc && [1, 4, 5, 10].includes(merc.house)) detailParts.push('बुध शुभ स्थिति में  –  मजबूत विश्लेषणात्मक क्षमता।');
    if (jup && [4, 5, 9].includes(jup.house)) detailParts.push('बृहस्पति उच्च शिक्षा और विद्वत्ता का समर्थन।');
    detailParts.push(`सीखने की शैली: ${element?.hi} तत्व।`);
  }

  // Factual summary (Lesson M)
  const learnStyle = element?.en === 'Fire' ? 'experiential, hands-on' : element?.en === 'Earth' ? 'structured, practical' : element?.en === 'Air' ? 'conceptual, theoretical' : 'intuitive, absorptive';
  const learnStyleHi = element?.en === 'Fire' ? 'अनुभवात्मक' : element?.en === 'Earth' ? 'व्यवस्थित, व्यावहारिक' : element?.en === 'Air' ? 'वैचारिक, सैद्धान्तिक' : 'सहज, अनुभवात्मक';
  const lord4Name = houses.find(h => h.house === 4)?.lordName.en ?? '';
  const lord5Name = houses.find(h => h.house === 5)?.lordName.en ?? '';
  const lord4NameHi = houses.find(h => h.house === 4)?.lordName.hi ?? '';
  const lord5NameHi = houses.find(h => h.house === 5)?.lordName.hi ?? '';

  const eduSummaryEn = `4th lord ${lord4Name} and 5th lord ${lord5Name} govern education. Mercury${merc ? ` in house ${merc.house}${merc.isExalted ? ' (exalted)' : merc.isDebilitated ? ' (debilitated)' : ''}` : ' not prominently placed'}. Jupiter${jup ? ` in house ${jup.house}${jup.isExalted ? ' (exalted)' : jup.isDebilitated ? ' (debilitated)' : ''}` : ' not prominently placed'}. Learning style: ${learnStyle}. Academic milestones align with Mercury and 5th lord dasha periods.`;
  const eduSummaryHi = `4वें स्वामी ${lord4NameHi} और 5वें स्वामी ${lord5NameHi} शिक्षा का शासन करते हैं। बुध${merc ? ` ${merc.house}वें भाव में${merc.isExalted ? ' (उच्च)' : merc.isDebilitated ? ' (नीच)' : ''}` : ''}। बृहस्पति${jup ? ` ${jup.house}वें भाव में${jup.isExalted ? ' (उच्च)' : jup.isDebilitated ? ' (नीच)' : ''}` : ''}। सीखने की शैली: ${learnStyleHi}। शैक्षिक मील के पत्थर बुध और 5वें स्वामी की दशा में।`;

  return {
    label: t(locale, 'Education & Learning', 'शिक्षा और ज्ञान', 'शिक्षा'),
    icon: 'graduation-cap',
    rating,
    summary: t(locale, eduSummaryEn, eduSummaryHi),
    details: detailParts.join(' '),
  };
}
