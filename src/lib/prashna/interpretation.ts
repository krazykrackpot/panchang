/**
 * Ashtamangala Prashna — Interpretation Engine
 * Synthesizes object analysis, yoga results, and chart conditions
 * into a final PrashnaInterpretation verdict.
 */

import { GRAHAS } from '@/lib/constants/grahas';
import type { PlanetPosition } from '@/types/kundali';
import type {
  AshtamangalaObject,
  PrashnaYoga,
  QuestionCategory,
  PrashnaInterpretation,
} from '@/types/prashna';
import type { Trilingual } from '@/types/panchang';
import { QUESTION_CATEGORIES } from './question-categories';

/** Sign lord planet ID lookup: sign (1-12) -> planet id (0-8) */
const SIGN_LORD_IDS: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

/** Exaltation signs by planet id */
const EXALTATION: Record<number, number> = { 0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7 };

/** Own signs by planet id */
const OWN_SIGNS: Record<number, number[]> = {
  0: [5], 1: [4], 2: [1, 8], 3: [3, 6], 4: [9, 12], 5: [2, 7], 6: [10, 11],
};

/** Kendra houses */
const KENDRA = [1, 4, 7, 10];

/** Trikona houses */
const TRIKONA = [1, 5, 9];

/** Trik (dusthana) houses */
const TRIK = [6, 8, 12];

/** Calculate house from ascendant */
function houseFromAsc(planetSign: number, ascSign: number): number {
  return ((planetSign - ascSign + 12) % 12) + 1;
}

/**
 * Check if a planet ruler is strong in the prashna chart.
 * Strong = exalted, own sign, in kendra/trikona, not in trik houses.
 */
function isRulerStrong(
  rulerId: number,
  planets: PlanetPosition[],
  ascSign: number
): boolean {
  const planet = planets.find(p => p.planet.id === rulerId);
  if (!planet) return false;

  const house = houseFromAsc(planet.sign, ascSign);
  const inKendraTrikona = KENDRA.includes(house) || TRIKONA.includes(house);
  const inTrik = TRIK.includes(house);
  const exalted = EXALTATION[rulerId] === planet.sign;
  const ownSign = (OWN_SIGNS[rulerId] || []).includes(planet.sign);

  // Strong if: exalted, or own sign, or in kendra/trikona and not in trik
  if (exalted || ownSign) return true;
  if (inKendraTrikona && !inTrik) return true;
  return false;
}

/**
 * Derive fructification timing from the third number.
 * Small number (1-3) = days, medium (4-6) = weeks, large (7+) = months.
 */
function deriveTiming(thirdNumber: number): Trilingual {
  const reduced = ((thirdNumber - 1) % 12) + 1;

  if (reduced <= 3) {
    return {
      en: `Result likely within ${reduced * 3} to ${reduced * 7} days. The matter will resolve quickly.`,
      hi: `परिणाम सम्भवतः ${reduced * 3} से ${reduced * 7} दिनों में मिलेगा। मामला शीघ्र हल होगा।`,
      sa: `फलं सम्भवतः ${reduced * 3} तः ${reduced * 7} दिनेषु प्राप्स्यते। कार्यं शीघ्रं समाप्स्यते।`,
    };
  }
  if (reduced <= 6) {
    const weeks = reduced - 2;
    return {
      en: `Result likely within ${weeks} to ${weeks + 2} weeks. Patience is needed but the outcome will manifest within a month.`,
      hi: `परिणाम सम्भवतः ${weeks} से ${weeks + 2} सप्ताह में मिलेगा। धैर्य आवश्यक है परन्तु एक महीने में परिणाम मिलेगा।`,
      sa: `फलं सम्भवतः ${weeks} तः ${weeks + 2} सप्ताहेषु प्राप्स्यते। धैर्यम् आवश्यकम्, मासान्तरे फलं प्रकटिष्यते।`,
    };
  }
  if (reduced <= 9) {
    const months = reduced - 5;
    return {
      en: `Result likely within ${months} to ${months + 2} months. The matter requires sustained effort and time.`,
      hi: `परिणाम सम्भवतः ${months} से ${months + 2} महीनों में मिलेगा। कार्य में निरन्तर प्रयास और समय की आवश्यकता है।`,
      sa: `फलं सम्भवतः ${months} तः ${months + 2} मासेषु प्राप्स्यते। कार्ये सतत-प्रयत्नः कालश्च आवश्यकः।`,
    };
  }
  // 10-12: long term
  const months = reduced - 6;
  return {
    en: `Result likely within ${months} to ${months + 3} months or longer. The matter will take considerable time to materialize.`,
    hi: `परिणाम सम्भवतः ${months} से ${months + 3} महीनों या उससे अधिक में मिलेगा। कार्य में काफी समय लगेगा।`,
    sa: `फलं सम्भवतः ${months} तः ${months + 3} मासेषु अथवा अधिककाले प्राप्स्यते। कार्यं दीर्घकालं यावत् स्थास्यति।`,
  };
}

/**
 * Generate remedies based on verdict and category.
 */
function generateRemedies(
  verdict: 'favorable' | 'unfavorable' | 'mixed',
  category: QuestionCategory,
  objects: AshtamangalaObject[]
): Trilingual[] {
  const remedies: Trilingual[] = [];
  const primaryRuler = objects[0].planetRuler;
  const rulerName = GRAHAS[primaryRuler]?.name || { en: 'the ruling planet', hi: 'शासक ग्रह', sa: 'अधिपतिग्रहः' };

  // Universal remedy: propitiate the primary object's ruling planet
  remedies.push({
    en: `Worship and propitiate ${rulerName.en} through the appropriate mantra, gemstone, or charity on the ruling day.`,
    hi: `${rulerName.hi} की उपासना करें, उचित मन्त्र, रत्न या दान के माध्यम से शासक दिवस पर।`,
    sa: `${rulerName.sa} उपासनां कुर्यात् उचितमन्त्रेण रत्नेन दानेन वा अधिपतिदिवसे।`,
  });

  if (verdict === 'unfavorable' || verdict === 'mixed') {
    // Additional remedies for unfavorable
    remedies.push({
      en: 'Perform Ganesha puja to remove obstacles before undertaking the matter.',
      hi: 'कार्य आरम्भ करने से पहले गणेश पूजा करें बाधाओं को दूर करने के लिए।',
      sa: 'विघ्ननिवारणार्थं गणेशपूजां कुर्यात् कार्यारम्भात् पूर्वम्।',
    });

    remedies.push({
      en: 'Donate food and clothing to the needy on a Saturday to mitigate negative influences.',
      hi: 'शनिवार को जरूरतमन्दों को भोजन और वस्त्र दान करें नकारात्मक प्रभावों को कम करने के लिए।',
      sa: 'शनिवासरे दरिद्रेभ्यः अन्नं वस्त्रं च दद्यात् अशुभप्रभावशमनार्थम्।',
    });
  }

  if (verdict === 'favorable') {
    remedies.push({
      en: 'Begin the undertaking during an auspicious muhurta for best results. Offer gratitude at a temple.',
      hi: 'सर्वोत्तम परिणामों के लिए शुभ मुहूर्त में कार्य आरम्भ करें। मन्दिर में कृतज्ञता अर्पित करें।',
      sa: 'शुभमुहूर्ते कार्यम् आरभेत् उत्तमफलार्थम्। मन्दिरे कृतज्ञतां निवेदयेत्।',
    });
  }

  // Category-specific remedy
  const categoryRemedies: Partial<Record<QuestionCategory, Trilingual>> = {
    health: {
      en: 'Recite the Maha Mrityunjaya Mantra 108 times daily for health and protection.',
      hi: 'स्वास्थ्य और सुरक्षा के लिए प्रतिदिन महामृत्युंजय मन्त्र का 108 बार जाप करें।',
      sa: 'आरोग्यरक्षार्थं प्रतिदिनं महामृत्युञ्जयमन्त्रस्य अष्टोत्तरशतवारं जपं कुर्यात्।',
    },
    wealth: {
      en: 'Chant Sri Sukta or Lakshmi mantras on Fridays for prosperity.',
      hi: 'समृद्धि के लिए शुक्रवार को श्री सूक्त या लक्ष्मी मन्त्र का जाप करें।',
      sa: 'समृद्ध्यर्थं शुक्रवासरे श्रीसूक्तस्य लक्ष्मीमन्त्रस्य वा जपं कुर्यात्।',
    },
    marriage: {
      en: 'Observe a Gauri-Shankar vrat and worship Parvati-Parameshwara for marital harmony.',
      hi: 'वैवाहिक सामंजस्य के लिए गौरी-शंकर व्रत रखें और पार्वती-परमेश्वर की पूजा करें।',
      sa: 'दाम्पत्यसौहार्दार्थं गौरीशङ्करव्रतं कुर्यात् पार्वतीपरमेश्वरयोः पूजां च कुर्यात्।',
    },
    career: {
      en: 'Worship Sun on Sundays with Aditya Hridaya Stotram for career advancement.',
      hi: 'व्यवसाय उन्नति के लिए रविवार को आदित्य हृदय स्तोत्रम् के साथ सूर्य की पूजा करें।',
      sa: 'वृत्त्युन्नत्यर्थं रविवासरे आदित्यहृदयस्तोत्रेण सूर्यपूजां कुर्यात्।',
    },
    children: {
      en: 'Perform Santan Gopal puja and recite Santan Gopal mantra for blessings related to children.',
      hi: 'सन्तान सम्बन्धी आशीर्वाद के लिए सन्तान गोपाल पूजा और मन्त्र जाप करें।',
      sa: 'सन्तानसम्बन्धि-आशीर्वादार्थं सन्तानगोपालपूजां मन्त्रजपं च कुर्यात्।',
    },
    fortune: {
      en: 'Visit a Vishnu temple on Thursdays and recite Vishnu Sahasranama for fortune.',
      hi: 'भाग्य के लिए गुरुवार को विष्णु मन्दिर जाएँ और विष्णु सहस्रनाम का पाठ करें।',
      sa: 'भाग्यार्थं गुरुवासरे विष्णुमन्दिरं गच्छेत् विष्णुसहस्रनामपाठं च कुर्यात्।',
    },
  };

  const catRemedy = categoryRemedies[category];
  if (catRemedy) {
    remedies.push(catRemedy);
  }

  return remedies;
}

/**
 * Generate a comprehensive interpretation of the Ashtamangala Prashna.
 *
 * Weighing:
 * - Primary object (1st number): 50%
 * - Supporting object (2nd number): 30%
 * - Timing object (3rd number): 20%
 *
 * @param objects - The three Ashtamangala objects selected
 * @param yogas - Detected prashna yogas
 * @param category - The question category
 * @param arudaHouses - The three aruda house numbers
 * @param planets - Prashna chart planetary positions
 * @param ascSign - Ascendant sign (1-12) of the prashna chart
 * @returns PrashnaInterpretation with verdict, summary, timing, and remedies
 */
export function generateInterpretation(
  objects: [AshtamangalaObject, AshtamangalaObject, AshtamangalaObject],
  yogas: PrashnaYoga[],
  category: QuestionCategory,
  arudaHouses: [number, number, number],
  planets: PlanetPosition[],
  ascSign: number
): PrashnaInterpretation {
  const categoryData = QUESTION_CATEGORIES[category];

  // --- Score calculation ---
  // Each factor contributes a score: positive = favorable, negative = unfavorable
  let score = 0;

  // 1. Primary object ruler strength (weight: 50%)
  const primaryStrong = isRulerStrong(objects[0].planetRuler, planets, ascSign);
  score += primaryStrong ? 2.5 : -2.5;

  // 2. Supporting object ruler strength (weight: 30%)
  const supportingStrong = isRulerStrong(objects[1].planetRuler, planets, ascSign);
  score += supportingStrong ? 1.5 : -1.5;

  // 3. Timing object ruler strength (weight: 20%)
  const timingStrong = isRulerStrong(objects[2].planetRuler, planets, ascSign);
  score += timingStrong ? 1.0 : -1.0;

  // 4. Aruda house analysis: check if aruda houses fall in relevant houses for the category
  for (const aruda of arudaHouses) {
    if (categoryData.relevantHouses.includes(aruda)) {
      score += 0.5;
    }
    if (TRIK.includes(aruda)) {
      score -= 0.5;
    }
  }

  // 5. Yoga contribution
  for (const yoga of yogas) {
    if (yoga.favorable) {
      score += 1.5;
    } else {
      score -= 1.5;
    }
  }

  // 6. Category house lord strength
  const categoryLordId = SIGN_LORD_IDS[((ascSign - 1 + categoryData.house - 1) % 12) + 1];
  if (categoryLordId !== undefined) {
    const catLordStrong = isRulerStrong(categoryLordId, planets, ascSign);
    score += catLordStrong ? 1.0 : -1.0;
  }

  // --- Determine verdict ---
  let verdict: 'favorable' | 'unfavorable' | 'mixed';
  if (score >= 2) {
    verdict = 'favorable';
  } else if (score <= -2) {
    verdict = 'unfavorable';
  } else {
    verdict = 'mixed';
  }

  // --- Build summary ---
  const primaryName = objects[0].name;
  const supportingName = objects[1].name;
  const timingName = objects[2].name;

  let summary: Trilingual;

  if (verdict === 'favorable') {
    summary = {
      en: `The Ashtamangala Prashna indicates a favorable outcome for your question about ${categoryData.label.en.toLowerCase()}. The primary object ${primaryName.en} (ruled by ${GRAHAS[objects[0].planetRuler].name.en}) is strong in the prashna chart. ${supportingStrong ? `The supporting object ${supportingName.en} also reinforces positive indications.` : `Though the supporting object ${supportingName.en} is moderately placed, the overall chart supports success.`} ${yogas.filter(y => y.favorable).length > 0 ? 'Auspicious yogas further strengthen the reading.' : ''}`,
      hi: `अष्टमंगल प्रश्न आपके ${categoryData.label.hi} सम्बन्धी प्रश्न के लिए अनुकूल परिणाम दर्शाता है। प्राथमिक वस्तु ${primaryName.hi} (${GRAHAS[objects[0].planetRuler].name.hi} शासित) प्रश्न कुण्डली में बलवान है। ${supportingStrong ? `सहायक वस्तु ${supportingName.hi} भी सकारात्मक संकेतों को पुष्ट करती है।` : `यद्यपि सहायक वस्तु ${supportingName.hi} मध्यम स्थिति में है, समग्र कुण्डली सफलता का समर्थन करती है।`} ${yogas.filter(y => y.favorable).length > 0 ? 'शुभ योग इस विश्लेषण को और मजबूत करते हैं।' : ''}`,
      sa: `अष्टमङ्गलप्रश्नः भवतः ${categoryData.label.sa} सम्बन्धि-प्रश्नस्य अनुकूलफलं सूचयति। प्रधानवस्तु ${primaryName.sa} (${GRAHAS[objects[0].planetRuler].name.sa} अधिपतिना शासितम्) प्रश्नकुण्डल्यां बलवत् अस्ति। ${supportingStrong ? `सहायकवस्तु ${supportingName.sa} अपि शुभसूचनाः पुष्णाति।` : `यद्यपि सहायकवस्तु ${supportingName.sa} मध्यमस्थाने स्थितम्, समग्रकुण्डली सिद्धिं समर्थयति।`} ${yogas.filter(y => y.favorable).length > 0 ? 'शुभयोगाः अस्य विश्लेषणस्य बलं वर्धयन्ति।' : ''}`,
    };
  } else if (verdict === 'unfavorable') {
    summary = {
      en: `The Ashtamangala Prashna indicates challenges for your question about ${categoryData.label.en.toLowerCase()}. The primary object ${primaryName.en} (ruled by ${GRAHAS[objects[0].planetRuler].name.en}) is weakly placed in the prashna chart. ${yogas.filter(y => !y.favorable).length > 0 ? 'Inauspicious yogas further indicate obstacles.' : ''} Remedial measures are strongly recommended before proceeding.`,
      hi: `अष्टमंगल प्रश्न आपके ${categoryData.label.hi} सम्बन्धी प्रश्न के लिए चुनौतियाँ दर्शाता है। प्राथमिक वस्तु ${primaryName.hi} (${GRAHAS[objects[0].planetRuler].name.hi} शासित) प्रश्न कुण्डली में दुर्बल है। ${yogas.filter(y => !y.favorable).length > 0 ? 'अशुभ योग और बाधाओं का संकेत देते हैं।' : ''} आगे बढ़ने से पहले उपचारात्मक उपायों की दृढ़ता से अनुशंसा की जाती है।`,
      sa: `अष्टमङ्गलप्रश्नः भवतः ${categoryData.label.sa} सम्बन्धि-प्रश्ने विघ्नान् सूचयति। प्रधानवस्तु ${primaryName.sa} (${GRAHAS[objects[0].planetRuler].name.sa} अधिपतिना शासितम्) प्रश्नकुण्डल्यां दुर्बलम् अस्ति। ${yogas.filter(y => !y.favorable).length > 0 ? 'अशुभयोगाः विघ्नान् अधिकं सूचयन्ति।' : ''} प्रवर्तनात् पूर्वं उपचारोपायाः दृढतया अनुशंसन्ते।`,
    };
  } else {
    summary = {
      en: `The Ashtamangala Prashna shows mixed indications for your question about ${categoryData.label.en.toLowerCase()}. The primary object ${primaryName.en} (ruled by ${GRAHAS[objects[0].planetRuler].name.en}) has moderate strength. Both favorable and unfavorable factors are present. Success is possible with effort and appropriate remedial measures.`,
      hi: `अष्टमंगल प्रश्न आपके ${categoryData.label.hi} सम्बन्धी प्रश्न के लिए मिश्रित संकेत दर्शाता है। प्राथमिक वस्तु ${primaryName.hi} (${GRAHAS[objects[0].planetRuler].name.hi} शासित) की मध्यम शक्ति है। अनुकूल और प्रतिकूल दोनों कारक उपस्थित हैं। प्रयास और उचित उपचार से सफलता सम्भव है।`,
      sa: `अष्टमङ्गलप्रश्नः भवतः ${categoryData.label.sa} सम्बन्धि-प्रश्ने मिश्रितसूचनाः दर्शयति। प्रधानवस्तु ${primaryName.sa} (${GRAHAS[objects[0].planetRuler].name.sa} अधिपतिना शासितम्) मध्यमबलम् अस्ति। अनुकूलप्रतिकूलकारकौ उभौ विद्येते। प्रयत्नेन उपचारेण च सिद्धिः सम्भवा।`,
    };
  }

  // --- Timing ---
  const timing = deriveTiming(arudaHouses[2]);

  // --- Remedies ---
  const remedies = generateRemedies(verdict, category, objects);

  return {
    verdict,
    summary,
    timing,
    remedies,
  };
}
