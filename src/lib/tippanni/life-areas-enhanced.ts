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

  const lordName = tenthHouse?.lordName.en || '';
  const lordNameHi = tenthHouse?.lordName.hi || '';
  const signEn = tenthHouse?.signName.en || '';
  const signHi = tenthHouse?.signName.hi || '';
  const lordHouse = tenthLord ? tenthLord.house : 0;

  const careerSummaryEn =
    rating >= 9 ? `10th house in ${signEn} ruled by ${lordName} — a rare and powerful career signature. Multiple benefics fortify professional destiny. Authority, recognition, and lasting impact are written into this chart. Leadership positions and public influence come naturally.`
    : rating >= 7 ? `10th house in ${signEn} with ${lordName} as career lord placed in house ${lordHouse}. Strong planetary support — career rises steadily with clear direction. Professional recognition and authority are well-supported.`
    : rating >= 5 ? `10th house in ${signEn}. ${lordName} as career lord indicates steady professional growth when effort is applied consistently. Timing matters — dasha periods of the 10th lord bring breakthroughs.`
    : rating >= 3 ? `10th house in ${signEn}. Career path faces headwinds from planetary affliction. Success comes through persistence, strategic pivots, and leveraging strong dasha periods.`
    : `10th house in ${signEn}. Career area is significantly challenged. Remedial measures for ${lordName} and patience through difficult dasha periods are essential for professional stability.`;

  const careerSummaryHi =
    rating >= 9 ? `10वाँ भाव ${signHi} में, स्वामी ${lordNameHi} — दुर्लभ और शक्तिशाली कैरियर योग। अनेक शुभ ग्रह व्यावसायिक भाग्य को सुदृढ़ करते हैं। अधिकार, मान्यता और स्थायी प्रभाव इस कुण्डली में अंकित है।`
    : rating >= 7 ? `10वाँ भाव ${signHi} में, कैरियर स्वामी ${lordNameHi} ${lordHouse}वें भाव में। मजबूत ग्रहीय समर्थन — स्पष्ट दिशा के साथ कैरियर में स्थिर उन्नति।`
    : rating >= 5 ? `10वाँ भाव ${signHi} में। ${lordNameHi} कैरियर स्वामी — निरन्तर प्रयास से स्थिर व्यावसायिक विकास। 10वें स्वामी की दशा में सफलता आती है।`
    : rating >= 3 ? `10वाँ भाव ${signHi} में। कैरियर पथ में ग्रहीय बाधाएँ। दृढ़ता और रणनीतिक बदलाव से सफलता।`
    : `10वाँ भाव ${signHi} में। कैरियर क्षेत्र में चुनौतियाँ। ${lordNameHi} के उपचार और कठिन दशा में धैर्य आवश्यक।`;

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
    if (lord2?.isExalted || lord11?.isExalted) detailParts.push('Wealth lord exalted — strong financial potential.');
    if (lord2 && isKendra(lord2.house)) detailParts.push('2nd lord in Kendra — stable, visible income sources.');
    // Dhana yoga check
    if (lord2 && lord11 && lord2.house === lord11.house) detailParts.push('2nd and 11th lords conjunct — powerful Dhana Yoga for wealth.');
  } else {
    if (jup && [2, 5, 9, 11].includes(jup.house)) detailParts.push('बृहस्पति ज्ञान और नैतिकता से धन का समर्थन करता है।');
    if (lord2?.isExalted || lord11?.isExalted) detailParts.push('धन स्वामी उच्च — मजबूत आर्थिक क्षमता।');
  }

  const wealthSummaryEn =
    rating >= 9 ? 'Exceptional wealth configuration. Multiple Dhana Yogas and strong 2nd/11th lord dignities indicate substantial and sustained prosperity. Wealth accumulation through multiple channels — this is one of the strongest financial signatures.'
    : rating >= 7 ? 'Strong wealth indicators. Benefic aspects on the 2nd and 11th houses support steady income growth, assets, and financial security. Investments and savings grow reliably.'
    : rating >= 5 ? 'Moderate financial potential. Wealth builds through disciplined effort and strategic decisions. Income is stable but major wealth requires leveraging favorable dasha periods.'
    : rating >= 3 ? 'Financial sector faces challenges from planetary affliction. Careful budgeting, avoiding speculation, and remedial measures for wealth lords help stabilize income.'
    : 'Wealth accumulation is significantly challenged. Focus on debt avoidance, conservative financial planning, and strengthening the 2nd lord through remedies.';

  const wealthSummaryHi =
    rating >= 9 ? 'असाधारण धन योग। अनेक धन योग और मजबूत 2/11वें स्वामी — पर्याप्त और निरन्तर समृद्धि। अनेक स्रोतों से धन संचय।'
    : rating >= 7 ? 'मजबूत धन संकेत। 2/11वें भाव पर शुभ दृष्टि — स्थिर आय वृद्धि और वित्तीय सुरक्षा।'
    : rating >= 5 ? 'मध्यम वित्तीय क्षमता। अनुशासित प्रयास से धन वृद्धि। शुभ दशा काल में बड़ी सफलता।'
    : rating >= 3 ? 'वित्तीय क्षेत्र में चुनौतियाँ। सावधान बजट और धन स्वामी के उपचार से स्थिरता।'
    : 'धन संचय में महत्वपूर्ण बाधाएँ। रूढ़िवादी वित्तीय नियोजन और उपचार आवश्यक।';

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

  const sign7En = seventhHouse?.signName.en || '';
  const sign7Hi = seventhHouse?.signName.hi || '';
  const lord7Name = seventhHouse?.lordName.en || '';
  const lord7NameHi = seventhHouse?.lordName.hi || '';

  const marriageSummaryEn =
    rating >= 9 ? `7th house in ${sign7En} ruled by ${lord7Name} — an exceptionally blessed partnership signature. Venus and Jupiter support creates deep harmony, loyalty, and mutual growth. Marriage brings both emotional fulfillment and worldly prosperity.`
    : rating >= 7 ? `7th house in ${sign7En}. ${lord7Name} as 7th lord is well-placed. Favorable marriage prospects — the spouse is supportive and partnerships are fruitful. Emotional and practical compatibility run strong.`
    : rating >= 5 ? `7th house in ${sign7En}. Marriage brings growth alongside lessons. Mutual effort and communication are the keys to lasting harmony. The 7th lord's dasha activates partnership milestones.`
    : rating >= 3 ? `7th house in ${sign7En}. Relationships face periodic turbulence from afflicted planets. Patience, maturity, and conscious effort transform challenges into deeper bonds.`
    : `7th house in ${sign7En}. Partnership area is significantly challenged. Delayed marriage may work better. Remedies for ${lord7Name} and the 7th house are strongly recommended.`;

  const marriageSummaryHi =
    rating >= 9 ? `7वाँ भाव ${sign7Hi} में, स्वामी ${lord7NameHi} — असाधारण रूप से शुभ साझेदारी योग। शुक्र और बृहस्पति का समर्थन गहन सामंजस्य और परस्पर विकास लाता है।`
    : rating >= 7 ? `7वाँ भाव ${sign7Hi} में। ${lord7NameHi} शुभ स्थिति में। अनुकूल विवाह — जीवनसाथी सहायक और साझेदारी फलदायी।`
    : rating >= 5 ? `7वाँ भाव ${sign7Hi} में। विवाह विकास और पाठ दोनों लाता है। परस्पर प्रयास और संवाद सामंजस्य की कुंजी।`
    : rating >= 3 ? `7वाँ भाव ${sign7Hi} में। सम्बन्धों में ग्रहीय बाधाओं से अशान्ति। धैर्य और प्रयास से गहरे बन्धन।`
    : `7वाँ भाव ${sign7Hi} में। साझेदारी में चुनौतियाँ। विलम्बित विवाह लाभदायक। ${lord7NameHi} के उपचार अनुशंसित।`;

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
    if (lagnaLord?.isExalted) detailParts.push('Lagna lord exalted — strong constitution and natural resilience.');
    if (lagnaLord?.isDebilitated) detailParts.push('Lagna lord debilitated — health requires extra attention and preventive care.');
    detailParts.push(`Focus: ${element?.en === 'Fire' ? 'inflammation, fever, head' : element?.en === 'Earth' ? 'metabolism, bones, skin' : element?.en === 'Air' ? 'nervous system, lungs' : 'digestion, immunity'}.`);
  } else {
    if (lagnaLord?.isExalted) detailParts.push('लग्न स्वामी उच्च — सुदृढ़ संरचना और प्राकृतिक लचीलापन।');
    detailParts.push(`ध्यान: ${element?.hi} तत्व स्वास्थ्य क्षेत्र।`);
  }

  const elemEn = element?.en || 'Water';
  const healthSummaryEn =
    rating >= 9 ? `Exceptional vitality. Lagna lord and 1st house are powerfully fortified — natural constitution is robust with strong recovery and immunity. ${elemEn} element dominates, giving inherent physical resilience. One of the strongest health signatures in Vedic astrology.`
    : rating >= 7 ? `Strong vitality with benefic support to the ascendant. Natural resilience, good immunity, and steady energy levels. ${elemEn} element influences physical constitution — awareness of element-specific vulnerabilities prevents issues.`
    : rating >= 5 ? `Generally good health with specific areas needing attention. ${elemEn} element constitution — monitor its associated vulnerabilities. Preventive care during malefic dasha transits is important.`
    : rating >= 3 ? `Health requires conscious effort and regular monitoring. Affliction to the ascendant or 6th house creates vulnerabilities. Strengthen the lagna lord through remedies and lifestyle discipline.`
    : `Health area is significantly challenged by planetary affliction. Regular medical checkups, strong preventive routine, and remedial measures for the lagna lord are essential.`;

  const healthSummaryHi =
    rating >= 9 ? `असाधारण जीवनशक्ति। लग्न स्वामी और प्रथम भाव शक्तिशाली — सुदृढ़ संरचना, मजबूत प्रतिरक्षा। ${element?.hi || 'जल'} तत्व प्रबल।`
    : rating >= 7 ? `शुभ ग्रहीय समर्थन से सुदृढ़ जीवनशक्ति। अच्छी प्रतिरक्षा और स्थिर ऊर्जा। ${element?.hi || 'जल'} तत्व संरचना।`
    : rating >= 5 ? `सामान्यतः अच्छा स्वास्थ्य, विशेष ध्यान आवश्यक। ${element?.hi || 'जल'} तत्व — सम्बन्धित कमजोरियों पर ध्यान दें।`
    : rating >= 3 ? `स्वास्थ्य में सचेत प्रयास आवश्यक। लग्न स्वामी के उपचार और जीवनशैली अनुशासन से सुधार।`
    : `स्वास्थ्य में ग्रहीय बाधाएँ। नियमित चिकित्सा जाँच और लग्न स्वामी के उपचार अनिवार्य।`;

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

  const learnStyle = element?.en === 'Fire' ? 'experiential, hands-on' : element?.en === 'Earth' ? 'structured, practical' : element?.en === 'Air' ? 'conceptual, theoretical' : 'intuitive, absorptive';
  const eduSummaryEn =
    rating >= 9 ? `Exceptional intellectual configuration. Mercury and Jupiter are powerfully placed — scholarly brilliance, research aptitude, and mastery of complex subjects come naturally. ${learnStyle} learning style. One of the strongest education signatures — advanced degrees and intellectual recognition are strongly indicated.`
    : rating >= 7 ? `Strong academic potential. Intellectual planets are well-supported — consistent academic success and depth of understanding. ${learnStyle} learning style. Higher education and specialized knowledge acquisition are favored.`
    : rating >= 5 ? `Good learning ability with ${learnStyle} orientation. Academic success comes through sustained focus. Mercury's dasha periods bring intellectual breakthroughs and study milestones.`
    : rating >= 3 ? `Education faces obstacles from planetary affliction. Academic success requires extra dedication, good teachers, and strategic timing of major study commitments.`
    : `Education area is significantly challenged. Remedial measures for Mercury and the 4th/5th lords, along with strong mentorship, help overcome intellectual obstacles.`;

  const eduSummaryHi =
    rating >= 9 ? `असाधारण बौद्धिक योग। बुध और बृहस्पति शक्तिशाली — विद्वत्ता, शोध क्षमता और जटिल विषयों में प्रवीणता स्वाभाविक। उन्नत उपाधियाँ और बौद्धिक मान्यता प्रबल।`
    : rating >= 7 ? `मजबूत शैक्षिक क्षमता। बौद्धिक ग्रहों का शुभ समर्थन — निरन्तर शैक्षिक सफलता। उच्च शिक्षा अनुकूल।`
    : rating >= 5 ? `अच्छी सीखने की क्षमता। निरन्तर ध्यान से शैक्षिक सफलता। बुध की दशा में बौद्धिक उपलब्धियाँ।`
    : rating >= 3 ? `शिक्षा में बाधाएँ। अतिरिक्त समर्पण, अच्छे गुरु और सही समय से सफलता।`
    : `शिक्षा क्षेत्र में चुनौतियाँ। बुध और 4/5वें स्वामी के उपचार तथा मार्गदर्शन आवश्यक।`;

  return {
    label: t(locale, 'Education & Learning', 'शिक्षा और ज्ञान', 'शिक्षा'),
    icon: 'graduation-cap',
    rating,
    summary: t(locale, eduSummaryEn, eduSummaryHi),
    details: detailParts.join(' '),
  };
}
