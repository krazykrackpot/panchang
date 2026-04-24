/**
 * Enhanced Dasha Lord Analysis
 * Based on BPHS Ch.46-52, Phaladeepika Ch.20
 *
 * Key principle: A dasha period's results depend on the natal position
 * and dignity of the dasha lord. Well-placed -> positive; afflicted -> challenges.
 */

import type { PlanetPosition, HouseCusp } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { getPlanetDignity } from './dignity';
import { isKendra, isTrikona, isDusthana, getHouseLord, triLocale, PLANET_NAMES } from './utils';

function t(locale: Locale, en: string, hi: string, sa?: string): string {
  if (locale === 'sa') return sa || hi;
  return locale === 'hi' ? hi : en;
}

interface DashaLordResult {
  overall: string;
  dignityEffect: string;
  houseEffect: string;
  advice: string;
}

/**
 * Get enhanced dasha lord analysis based on natal placement and dignity
 */
export function getDashaLordAnalysis(
  dashaLordName: string,
  planets: PlanetPosition[],
  houses: HouseCusp[],
  ascSign: number,
  locale: Locale
): DashaLordResult {
  const nameMap: Record<string, number> = {
    Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
    Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
  };
  const planetId = nameMap[dashaLordName];
  if (planetId === undefined) {
    return { overall: '', dignityEffect: '', houseEffect: '', advice: '' };
  }

  const planet = planets.find(p => p.planet.id === planetId);
  if (!planet) {
    return { overall: '', dignityEffect: '', houseEffect: '', advice: '' };
  }

  const pName = triLocale(PLANET_NAMES[planetId] || PLANET_NAMES[0], locale);
  const dignity = getPlanetDignity(planetId, planet.sign, parseFloat(planet.degree) || 15);
  const house = planet.house;

  // Dignity effect on dasha results
  let dignityEffect = '';
  switch (dignity) {
    case 'exalted':
      dignityEffect = t(locale,
        `${pName} is exalted — this dasha period delivers exceptional results. Its significations flourish with minimal effort. Peak period for ${pName}'s themes.`,
        `${pName} उच्च राशि में — यह दशा काल असाधारण परिणाम देता है। न्यूनतम प्रयास से कारकत्व फलते-फूलते हैं।`);
      break;
    case 'own':
    case 'moolatrikona':
      dignityEffect = t(locale,
        `${pName} is in its own sign — dasha results come naturally and reliably. Comfortable period with steady progress in ${pName}'s domains.`,
        `${pName} स्वगृह में — दशा परिणाम स्वाभाविक और विश्वसनीय। स्थिर प्रगति का आरामदायक काल।`);
      break;
    case 'friendly':
      dignityEffect = t(locale,
        `${pName} is in a friendly sign — dasha results are generally positive with support from the sign lord. Good cooperation and favorable circumstances.`,
        `${pName} मित्र राशि में — दशा परिणाम सामान्यतः सकारात्मक। अनुकूल परिस्थितियाँ।`);
      break;
    case 'neutral':
      dignityEffect = t(locale,
        `${pName} is in a neutral sign — dasha results depend on other factors. Mixed period requiring conscious effort for positive outcomes.`,
        `${pName} सम राशि में — दशा परिणाम अन्य कारकों पर निर्भर। सकारात्मक परिणामों के लिए सचेत प्रयास।`);
      break;
    case 'enemy':
      dignityEffect = t(locale,
        `${pName} is in an enemy sign — dasha period brings challenges in its domains. Extra effort required. Conflicts with authority figures possible.`,
        `${pName} शत्रु राशि में — दशा काल में इसके क्षेत्रों में चुनौतियाँ। अतिरिक्त प्रयास आवश्यक।`);
      break;
    case 'debilitated':
      dignityEffect = t(locale,
        `${pName} is debilitated — dasha period requires significant effort to overcome obstacles. Its significations face maximum challenge. Check for Neechabhanga cancellation.`,
        `${pName} नीच राशि में — दशा काल में बाधाओं पर विजय के लिए महत्वपूर्ण प्रयास आवश्यक। नीचभङ्ग जाँचें।`);
      break;
  }

  // House effect on dasha results
  let houseEffect = '';
  if (isKendra(house)) {
    houseEffect = t(locale,
      `Placed in Kendra (house ${house}) — strong foundation for this dasha. ${house === 1 ? 'Personal growth and health' : house === 4 ? 'Domestic happiness and property' : house === 7 ? 'Partnerships and marriage' : 'Career and public recognition'} are activated.`,
      `केन्द्र (${house}वाँ भाव) में — इस दशा के लिए मजबूत आधार। ${house === 1 ? 'व्यक्तिगत विकास' : house === 4 ? 'घरेलू सुख और सम्पत्ति' : house === 7 ? 'साझेदारी और विवाह' : 'कैरियर और जनमान्यता'} सक्रिय।`);
  } else if (isTrikona(house)) {
    houseEffect = t(locale,
      `Placed in Trikona (house ${house}) — fortunate placement for this dasha. ${house === 5 ? 'Intelligence, children, and creative expression' : house === 9 ? 'Fortune, higher education, and spiritual growth' : 'Self-expression and identity'} flourish.`,
      `त्रिकोण (${house}वाँ भाव) में — इस दशा के लिए भाग्यशाली स्थिति। ${house === 5 ? 'बुद्धि, सन्तान और रचनात्मक अभिव्यक्ति' : house === 9 ? 'भाग्य, उच्च शिक्षा और आध्यात्मिक विकास' : 'आत्म-अभिव्यक्ति'} फलता-फूलता है।`);
  } else if (isDusthana(house)) {
    houseEffect = t(locale,
      `Placed in Dusthana (house ${house}) — this dasha brings ${house === 6 ? 'competition, service, and health challenges' : house === 8 ? 'transformation, occult interests, and sudden changes' : 'expenses, foreign connections, and spiritual growth'}. Challenges become growth opportunities.`,
      `दुःस्थान (${house}वाँ भाव) में — यह दशा ${house === 6 ? 'प्रतिस्पर्धा, सेवा और स्वास्थ्य' : house === 8 ? 'परिवर्तन, गूढ़ रुचि और अचानक बदलाव' : 'खर्च, विदेशी सम्बन्ध और आध्यात्मिक विकास'} लाती है।`);
  } else {
    houseEffect = t(locale,
      `Placed in house ${house} — ${house === 2 ? 'wealth, family, and speech' : house === 3 ? 'courage, communication, and siblings' : 'gains and social connections'} are activated during this dasha.`,
      `${house}वें भाव में — ${house === 2 ? 'धन, परिवार और वाणी' : house === 3 ? 'साहस, संवाद और भाई-बहन' : 'लाभ और सामाजिक सम्बन्ध'} इस दशा में सक्रिय।`);
  }

  // Retrograde effect
  let retroEffect = '';
  if (planet.isRetrograde && planetId <= 6) {
    retroEffect = t(locale,
      ` ${pName} is retrograde — results may come in unconventional ways or with delays. Past-life karma is processed. Inner transformation is emphasized.`,
      ` ${pName} वक्री — परिणाम अपरम्परागत तरीकों से या विलम्ब से आ सकते हैं। पूर्वजन्म कर्म संसाधित।`);
  }

  // Overall assessment
  const overallPositive = ['exalted', 'own', 'moolatrikona', 'friendly'].includes(dignity) &&
    (isKendra(house) || isTrikona(house));
  const overall = t(locale,
    overallPositive
      ? `${pName} Dasha is a favorable period with ${dignity === 'exalted' ? 'exceptional' : 'good'} potential. ${pName}'s significations are well-supported.${retroEffect}`
      : `${pName} Dasha requires conscious effort for best results. ${pName}'s significations need nurturing.${retroEffect}`,
    overallPositive
      ? `${pName} दशा ${dignity === 'exalted' ? 'असाधारण' : 'अच्छी'} सम्भावना के साथ अनुकूल काल।${retroEffect}`
      : `${pName} दशा में सर्वोत्तम परिणामों के लिए सचेत प्रयास आवश्यक।${retroEffect}`);

  // Advice
  const advice = t(locale,
    overallPositive
      ? `Maximize this period by pursuing ${pName}'s significations confidently. Initiate important projects during this dasha.`
      : `Strengthen ${pName} through its remedies (gemstone, mantra, charity). Avoid impulsive decisions in ${pName}'s domains.`,
    overallPositive
      ? `इस काल का अधिकतम लाभ उठाने के लिए ${pName} के कारकत्वों को आत्मविश्वास से अपनाएँ।`
      : `${pName} को उपायों (रत्न, मन्त्र, दान) से मजबूत करें। ${pName} के क्षेत्रों में आवेगपूर्ण निर्णय से बचें।`);

  return { overall, dignityEffect, houseEffect, advice };
}

/**
 * Get interaction analysis between Mahadasha lord and Antardasha lord
 */
export function getAntardashaInteraction(
  mahaLord: string,
  antarLord: string,
  locale: Locale
): string {
  // BPHS Ch.3 Naisargika Maitri — directional lookup, combined assessment
  // 2=friend, 1=neutral, 0=enemy
  const MAITRI: Record<string, Record<string, number>> = {
    Sun:     { Sun:2, Moon:2, Mars:2, Mercury:1, Jupiter:2, Venus:0, Saturn:0, Rahu:0, Ketu:1 },
    Moon:    { Sun:2, Moon:2, Mars:1, Mercury:2, Jupiter:1, Venus:1, Saturn:1, Rahu:1, Ketu:1 },
    Mars:    { Sun:2, Moon:2, Mars:2, Mercury:0, Jupiter:2, Venus:1, Saturn:1, Rahu:1, Ketu:1 },
    Mercury: { Sun:2, Moon:0, Mars:1, Mercury:2, Jupiter:1, Venus:2, Saturn:1, Rahu:1, Ketu:1 },
    Jupiter: { Sun:2, Moon:2, Mars:2, Mercury:0, Jupiter:2, Venus:0, Saturn:1, Rahu:0, Ketu:1 },
    Venus:   { Sun:0, Moon:0, Mars:1, Mercury:2, Jupiter:1, Venus:2, Saturn:2, Rahu:1, Ketu:1 },
    Saturn:  { Sun:0, Moon:0, Mars:0, Mercury:2, Jupiter:1, Venus:2, Saturn:2, Rahu:2, Ketu:1 },
    Rahu:    { Sun:0, Moon:0, Mars:0, Mercury:1, Jupiter:0, Venus:1, Saturn:2, Rahu:2, Ketu:0 },
    Ketu:    { Sun:1, Moon:1, Mars:2, Mercury:1, Jupiter:2, Venus:0, Saturn:0, Rahu:0, Ketu:2 },
  };
  const mahaView = MAITRI[mahaLord]?.[antarLord] ?? 1;
  const antarView = MAITRI[antarLord]?.[mahaLord] ?? 1;
  const combined = mahaView + antarView;
  const areFriends = combined >= 3; // 2+2 or 2+1
  const areEnemies = combined <= 1; // 0+0 or 0+1

  if (areFriends) {
    return t(locale,
      `${mahaLord}-${antarLord} sub-period is harmonious — both planets cooperate naturally. This is a supportive combination that enhances the dasha's positive potential.`,
      `${mahaLord}-${antarLord} उपकाल सामंजस्यपूर्ण — दोनों ग्रह स्वाभाविक रूप से सहयोग करते हैं। यह सहायक संयोजन दशा की सकारात्मक क्षमता बढ़ाता है।`);
  }
  if (areEnemies) {
    return t(locale,
      `${mahaLord}-${antarLord} sub-period may bring conflicting energies. The two planets have natural enmity, creating tension between their significations. Navigate carefully.`,
      `${mahaLord}-${antarLord} उपकाल में परस्पर विरोधी ऊर्जाएँ हो सकती हैं। दोनों ग्रहों में प्राकृतिक शत्रुता, कारकत्वों में तनाव। सावधानी से नेविगेट करें।`);
  }
  return t(locale,
    `${mahaLord}-${antarLord} sub-period has neutral energy dynamics. Results depend on their natal placement and house lordship more than mutual relationship.`,
    `${mahaLord}-${antarLord} उपकाल में तटस्थ ऊर्जा गतिशीलता। परिणाम परस्पर सम्बन्ध से अधिक जन्मस्थिति और भावस्वामित्व पर निर्भर।`);
}
