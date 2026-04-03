/**
 * Year Predictions Engine
 * Generates dynamic current-year predictions by computing transits
 * of Saturn, Jupiter, Rahu/Ketu against the natal chart, plus
 * scanning dasha data for transitions within the year.
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import type { YearPredictionSection, YearEvent, QuarterForecast } from '@/lib/kundali/tippanni-types';
import { getPlanetaryPositions, dateToJD, toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';

function t(locale: Locale, en: string, hi: string, sa?: string): string {
  if (locale === 'sa') return sa || hi;
  return locale === 'hi' ? hi : en;
}

/** Get rashi name in given locale */
function rashiName(signNum: number, locale: Locale): string {
  const r = RASHIS[signNum - 1];
  return r ? r.name[locale] : '';
}

/** Get graha name in given locale */
function grahaName(id: number, locale: Locale): string {
  const g = GRAHAS[id];
  return g ? g.name[locale] : '';
}

/** Compute house number from transit sign relative to a reference sign (1-based) */
function houseFromSign(transitSign: number, refSign: number): number {
  return ((transitSign - refSign + 12) % 12) + 1;
}

/** Get current transit sidereal signs for Saturn, Jupiter, Rahu, Ketu */
function getCurrentTransits(): { saturnSign: number; jupiterSign: number; rahuSign: number; ketuSign: number; jd: number } {
  const now = new Date();
  const jd = dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
  const positions = getPlanetaryPositions(jd);

  const saturnLong = toSidereal(positions[6].longitude, jd);
  const jupiterLong = toSidereal(positions[4].longitude, jd);
  const rahuLong = toSidereal(positions[7].longitude, jd);
  const ketuLong = toSidereal(positions[8].longitude, jd);

  return {
    saturnSign: getRashiNumber(saturnLong),
    jupiterSign: getRashiNumber(jupiterLong),
    rahuSign: getRashiNumber(rahuLong),
    ketuSign: getRashiNumber(ketuLong),
    jd,
  };
}

/** Detect Sade Sati (Saturn 12th, 1st, or 2nd from natal Moon) */
function detectSadeSati(saturnSign: number, natalMoonSign: number, locale: Locale): YearEvent | null {
  const house = houseFromSign(saturnSign, natalMoonSign);

  if (house !== 12 && house !== 1 && house !== 2) return null;

  const phase = house === 12 ? 'rising' : house === 1 ? 'peak' : 'setting';

  const phaseLabels = {
    rising: {
      en: 'Rising Phase (Saturn in 12th from Moon)',
      hi: 'आरोहण चरण (चन्द्र से 12वें भाव में शनि)',
      sa: 'आरोहणचरणः (चन्द्रात् द्वादशभावे शनिः)',
    },
    peak: {
      en: 'Peak Phase (Saturn conjunct natal Moon)',
      hi: 'शिखर चरण (शनि जन्म चन्द्रमा पर)',
      sa: 'शिखरचरणः (शनिः जन्मचन्द्रे)',
    },
    setting: {
      en: 'Setting Phase (Saturn in 2nd from Moon)',
      hi: 'अवरोहण चरण (चन्द्र से 2रे भाव में शनि)',
      sa: 'अवरोहणचरणः (चन्द्रात् द्वितीयभावे शनिः)',
    },
  };

  const descriptions = {
    rising: {
      en: `Sade Sati's rising phase brings mental restlessness and emotional turbulence. Saturn transiting ${rashiName(saturnSign, 'en')} in the 12th from your natal Moon initiates a 7.5-year cycle of transformation. Focus on inner strength, spiritual practices, and detachment from material worries. This phase tests emotional resilience but builds deep character.`,
      hi: `साढ़े साती का आरोहण चरण मानसिक अशान्ति और भावनात्मक उथल-पुथल लाता है। ${rashiName(saturnSign, 'hi')} में शनि का गोचर आपके जन्म चन्द्रमा से 12वें भाव में 7.5 वर्ष के परिवर्तन चक्र का आरम्भ करता है। आन्तरिक शक्ति, आध्यात्मिक अभ्यास और वैराग्य पर ध्यान दें।`,
    },
    peak: {
      en: `Sade Sati's peak phase is the most intense period. Saturn directly transiting your natal Moon sign ${rashiName(natalMoonSign, 'en')} brings significant life changes — career shifts, relationship tests, and health awareness. This is a time of deep karmic reckoning and maturation. Challenges faced now build lasting resilience and wisdom.`,
      hi: `साढ़े साती का शिखर चरण सबसे तीव्र काल है। शनि सीधे आपकी जन्म चन्द्र राशि ${rashiName(natalMoonSign, 'hi')} पर गोचर कर रहा है — कैरियर में बदलाव, सम्बन्धों की परीक्षा और स्वास्थ्य जागरूकता। यह गहन कार्मिक परिपक्वता का समय है।`,
    },
    setting: {
      en: `Sade Sati's setting phase brings financial pressures and family adjustments. Saturn in ${rashiName(saturnSign, 'en')} (2nd from Moon) affects speech, savings, and family dynamics. While challenges are easing, maintain discipline in finances and communication. This final phase consolidates the lessons of the entire cycle.`,
      hi: `साढ़े साती का अवरोहण चरण आर्थिक दबाव और पारिवारिक समायोजन लाता है। ${rashiName(saturnSign, 'hi')} में शनि (चन्द्र से 2रे) वाणी, बचत और पारिवारिक गतिशीलता को प्रभावित करता है। चुनौतियाँ कम हो रही हैं, किन्तु वित्तीय अनुशासन बनाए रखें।`,
    },
  };

  const remedyText = t(locale,
    'Remedies: Recite Shani Chalisa on Saturdays. Donate black sesame and mustard oil. Visit Shani temple. Wear blue sapphire only after consultation. Practice patience and service to the elderly.',
    'उपाय: शनिवार को शनि चालीसा पाठ करें। काले तिल और सरसों तेल दान करें। शनि मन्दिर दर्शन। नीलम केवल परामर्श के बाद धारण करें। धैर्य और वृद्धजन सेवा का अभ्यास करें।',
    'उपायाः: शनिवासरे शनिचालीसापाठः। कृष्णतिलसर्षपतैलदानम्। शनिमन्दिरदर्शनम्। धैर्यं वृद्धजनसेवा च।'
  );

  return {
    type: 'sade_sati',
    title: t(locale,
      `Sade Sati — ${phaseLabels[phase].en}`,
      `साढ़े साती — ${phaseLabels[phase].hi}`,
      `साढेसाती — ${phaseLabels[phase].sa}`
    ),
    description: t(locale,
      descriptions[phase].en,
      descriptions[phase].hi,
    ),
    period: t(locale, 'Ongoing this year', 'इस वर्ष जारी', 'अस्मिन् वर्षे प्रचलितम्'),
    impact: phase === 'peak' ? 'challenging' : 'mixed',
    remedies: remedyText,
  };
}

/** Analyze Jupiter transit effects */
function analyzeJupiterTransit(jupiterSign: number, natalMoonSign: number, ascSign: number, locale: Locale): YearEvent {
  const houseFromMoon = houseFromSign(jupiterSign, natalMoonSign);
  const houseFromAsc = houseFromSign(jupiterSign, ascSign);

  // Favorable houses from Moon: 2, 5, 7, 9, 11 (Kendra/Trikona from Moon)
  const favorable = [2, 5, 7, 9, 11];
  // Challenging: 3, 6, 8, 12
  const challenging = [3, 6, 8, 12];

  const impact: YearEvent['impact'] = favorable.includes(houseFromMoon)
    ? 'favorable'
    : challenging.includes(houseFromMoon)
      ? 'challenging'
      : 'mixed';

  const houseEffects: Record<number, { en: string; hi: string }> = {
    1: { en: 'Jupiter transiting your Moon sign brings renewed optimism, health improvement, and fresh opportunities. A year of personal growth and self-confidence.', hi: 'बृहस्पति आपकी चन्द्र राशि पर गोचर करते हुए नवीन आशावाद, स्वास्थ्य सुधार और नए अवसर लाते हैं।' },
    2: { en: 'Jupiter in 2nd from Moon enhances wealth, family harmony, and eloquent speech. Financial gains through wisdom and righteous means.', hi: 'चन्द्र से 2रे भाव में बृहस्पति धन, पारिवारिक सामंजस्य और वाक्पटुता बढ़ाते हैं।' },
    3: { en: 'Jupiter in 3rd from Moon may bring some stagnation in initiatives. Extra effort needed for communication success. Sibling relations need attention.', hi: 'चन्द्र से 3रे भाव में बृहस्पति पहल में कुछ ठहराव ला सकते हैं। संवाद में अतिरिक्त प्रयास आवश्यक।' },
    4: { en: 'Jupiter in 4th from Moon brings mixed results — domestic changes, vehicle purchase possibility, but emotional fluctuations. Mother\'s health needs attention.', hi: 'चन्द्र से 4थे भाव में बृहस्पति मिश्रित फल — घरेलू परिवर्तन, वाहन योग, किन्तु भावनात्मक उतार-चढ़ाव।' },
    5: { en: 'Jupiter in 5th from Moon is excellent — intelligence sharpens, children prosper, creative projects succeed, and romantic life flourishes. A blessed year for education.', hi: 'चन्द्र से 5वें भाव में बृहस्पति उत्कृष्ट — बुद्धि तीक्ष्ण, सन्तान प्रगति, रचनात्मक सफलता और शिक्षा में आशीर्वाद।' },
    6: { en: 'Jupiter in 6th from Moon presents challenges through opponents and health concerns. However, debts may be cleared and legal matters can resolve. Stay vigilant about health.', hi: 'चन्द्र से 6ठे भाव में बृहस्पति शत्रुओं और स्वास्थ्य चिन्ताओं से चुनौतियाँ। किन्तु ऋण मुक्ति और कानूनी मामले सुलझ सकते हैं।' },
    7: { en: 'Jupiter in 7th from Moon is highly favorable for marriage, partnerships, and public dealings. Business partnerships thrive. Spouse\'s fortune improves.', hi: 'चन्द्र से 7वें भाव में बृहस्पति विवाह, साझेदारी और सार्वजनिक व्यवहार के लिए अत्यन्त शुभ। व्यापार साझेदारी फलती-फूलती।' },
    8: { en: 'Jupiter in 8th from Moon brings obstacles, delays, and possible health issues. Travel difficulties and mental stress. Focus on spiritual practices for relief.', hi: 'चन्द्र से 8वें भाव में बृहस्पति बाधाएँ, विलम्ब और सम्भावित स्वास्थ्य समस्याएँ। आध्यात्मिक अभ्यास पर ध्यान दें।' },
    9: { en: 'Jupiter in 9th from Moon is the most auspicious transit — fortune smiles, pilgrimages bear fruit, father\'s blessings flow, and higher education excels. A year of dharmic growth.', hi: 'चन्द्र से 9वें भाव में बृहस्पति सबसे शुभ गोचर — भाग्योदय, तीर्थयात्रा फलदायी, पिता का आशीर्वाद और उच्च शिक्षा में उत्कृष्टता।' },
    10: { en: 'Jupiter in 10th from Moon brings career challenges but also potential for repositioning. Avoid impulsive job changes. Authority figures may be difficult to deal with.', hi: 'चन्द्र से 10वें भाव में बृहस्पति कैरियर चुनौतियाँ किन्तु पुनर्स्थापन की सम्भावना। आवेगपूर्ण नौकरी परिवर्तन से बचें।' },
    11: { en: 'Jupiter in 11th from Moon is excellent for gains — income increases, ambitions are fulfilled, elder siblings support, and social network expands. One of the best transits.', hi: 'चन्द्र से 11वें भाव में बृहस्पति लाभ के लिए उत्कृष्ट — आय वृद्धि, महत्वाकांक्षा पूर्ति, बड़े भाई-बहन का सहयोग।' },
    12: { en: 'Jupiter in 12th from Moon indicates expenses, foreign travel, and spiritual awakening. Material losses possible but spiritual gains are significant. Avoid risky investments.', hi: 'चन्द्र से 12वें भाव में बृहस्पति व्यय, विदेश यात्रा और आध्यात्मिक जागृति। भौतिक हानि सम्भव किन्तु आध्यात्मिक लाभ महत्वपूर्ण।' },
  };

  const effect = houseEffects[houseFromMoon] || houseEffects[1];

  return {
    type: 'jupiter_transit',
    title: t(locale,
      `Jupiter Transit in ${rashiName(jupiterSign, 'en')} (${houseFromMoon}th from Moon, ${houseFromAsc}th from Ascendant)`,
      `बृहस्पति गोचर ${rashiName(jupiterSign, 'hi')} में (चन्द्र से ${houseFromMoon}वाँ, लग्न से ${houseFromAsc}वाँ)`,
      `गुरुगोचरः ${rashiName(jupiterSign, 'sa')} राश्याम् (चन्द्रात् ${houseFromMoon}, लग्नात् ${houseFromAsc})`
    ),
    description: t(locale, effect.en, effect.hi),
    period: t(locale, 'Ongoing this year', 'इस वर्ष जारी', 'अस्मिन् वर्षे प्रचलितम्'),
    impact,
  };
}

/** Analyze Rahu-Ketu transit axis */
function analyzeRahuKetuTransit(rahuSign: number, ketuSign: number, ascSign: number, natalMoonSign: number, locale: Locale): YearEvent {
  const rahuHouseFromAsc = houseFromSign(rahuSign, ascSign);
  const ketuHouseFromAsc = houseFromSign(ketuSign, ascSign);

  // Rahu in upachaya (3,6,10,11) = favorable; dusthana = challenging
  const favorable = [3, 6, 10, 11];
  const impact: YearEvent['impact'] = favorable.includes(rahuHouseFromAsc) ? 'favorable'
    : [1, 5, 7, 9].includes(rahuHouseFromAsc) ? 'mixed' : 'challenging';

  const axisEffects: Record<string, { en: string; hi: string }> = {
    '1-7': { en: 'Rahu-Ketu across the 1st-7th axis activates themes of self vs. partnerships. Identity transformation and relationship karmic lessons dominate.', hi: '1-7 अक्ष पर राहु-केतु आत्म बनाम साझेदारी के विषय सक्रिय करते हैं। पहचान परिवर्तन और सम्बन्ध कार्मिक पाठ प्रमुख।' },
    '2-8': { en: 'Rahu-Ketu across the 2nd-8th axis stirs financial transformations and hidden matters. Inheritance, investments, and family wealth undergo karmic adjustments.', hi: '2-8 अक्ष पर राहु-केतु वित्तीय परिवर्तन और गुप्त मामले। विरासत, निवेश और पारिवारिक धन में कार्मिक समायोजन।' },
    '3-9': { en: 'Rahu-Ketu across the 3rd-9th axis brings unconventional communication, foreign connections, and shifts in belief systems. Short and long journeys are highlighted.', hi: '3-9 अक्ष पर राहु-केतु अपरम्परागत संवाद, विदेशी सम्पर्क और विश्वास प्रणाली में बदलाव। छोटी-बड़ी यात्राएँ प्रमुख।' },
    '4-10': { en: 'Rahu-Ketu across the 4th-10th axis creates tension between home and career. Major professional or domestic changes are likely. Mother or home situation transforms.', hi: '4-10 अक्ष पर राहु-केतु घर और कैरियर के बीच तनाव। प्रमुख पेशेवर या घरेलू परिवर्तन सम्भव।' },
    '5-11': { en: 'Rahu-Ketu across the 5th-11th axis activates creativity vs. gains. Children, romance, and speculative ventures interact with social networks and ambitions.', hi: '5-11 अक्ष पर राहु-केतु रचनात्मकता बनाम लाभ। सन्तान, प्रेम और सट्टा उद्यम सामाजिक जालों और महत्वाकांक्षाओं से परस्पर क्रिया।' },
    '6-12': { en: 'Rahu-Ketu across the 6th-12th axis highlights health, service, and spiritual growth. Enemies and obstacles are karmic. Foreign connections or foreign residence possible.', hi: '6-12 अक्ष पर राहु-केतु स्वास्थ्य, सेवा और आध्यात्मिक विकास। शत्रु और बाधाएँ कार्मिक। विदेशी सम्बन्ध या निवास सम्भव।' },
  };

  // Determine axis key
  const low = Math.min(rahuHouseFromAsc, ketuHouseFromAsc);
  const high = Math.max(rahuHouseFromAsc, ketuHouseFromAsc);
  const axisKey = `${low}-${high}`;
  const effect = axisEffects[axisKey] || {
    en: `Rahu in the ${rahuHouseFromAsc}th house and Ketu in the ${ketuHouseFromAsc}th house activate a karmic axis in your chart. The ${rahuHouseFromAsc}th house themes amplify worldly desires while the ${ketuHouseFromAsc}th house themes facilitate spiritual release.`,
    hi: `${rahuHouseFromAsc}वें भाव में राहु और ${ketuHouseFromAsc}वें भाव में केतु आपकी कुण्डली में कार्मिक अक्ष सक्रिय करते हैं।`,
  };

  return {
    type: 'rahu_ketu',
    title: t(locale,
      `Rahu in ${rashiName(rahuSign, 'en')} (H${rahuHouseFromAsc}) — Ketu in ${rashiName(ketuSign, 'en')} (H${ketuHouseFromAsc})`,
      `राहु ${rashiName(rahuSign, 'hi')} (भाव ${rahuHouseFromAsc}) — केतु ${rashiName(ketuSign, 'hi')} (भाव ${ketuHouseFromAsc})`,
      `राहुः ${rashiName(rahuSign, 'sa')} (भावः ${rahuHouseFromAsc}) — केतुः ${rashiName(ketuSign, 'sa')} (भावः ${ketuHouseFromAsc})`
    ),
    description: t(locale, effect.en, effect.hi),
    period: t(locale, 'Ongoing this year', 'इस वर्ष जारी', 'अस्मिन् वर्षे प्रचलितम्'),
    impact,
  };
}

/** Scan dashas for transitions within the current year */
function findDashaTransitions(dashas: DashaEntry[], locale: Locale): YearEvent[] {
  const events: YearEvent[] = [];
  const year = new Date().getFullYear();
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // Planet effect summaries for dasha transitions
  const planetEffects: Record<string, { en: string; hi: string }> = {
    Sun: { en: 'authority, career prominence, government relations, father', hi: 'अधिकार, कैरियर प्रमुखता, सरकारी सम्बन्ध, पिता' },
    Moon: { en: 'emotions, mother, mental peace, public dealings', hi: 'भावनाएँ, माता, मानसिक शान्ति, सार्वजनिक व्यवहार' },
    Mars: { en: 'courage, property, siblings, energy, competition', hi: 'साहस, सम्पत्ति, भाई-बहन, ऊर्जा, प्रतिस्पर्धा' },
    Mercury: { en: 'intellect, communication, business, education', hi: 'बुद्धि, संवाद, व्यापार, शिक्षा' },
    Jupiter: { en: 'wisdom, fortune, children, dharma, expansion', hi: 'ज्ञान, भाग्य, सन्तान, धर्म, विस्तार' },
    Venus: { en: 'love, luxury, arts, marriage, comfort', hi: 'प्रेम, विलासिता, कला, विवाह, सुख' },
    Saturn: { en: 'discipline, karma, longevity, service, hard work', hi: 'अनुशासन, कर्म, दीर्घायु, सेवा, कठिन परिश्रम' },
    Rahu: { en: 'worldly ambitions, unconventional paths, foreign connections', hi: 'सांसारिक महत्वाकांक्षा, अपरम्परागत मार्ग, विदेशी सम्पर्क' },
    Ketu: { en: 'spiritual growth, detachment, past-life karma, liberation', hi: 'आध्यात्मिक विकास, वैराग्य, पूर्वजन्म कर्म, मोक्ष' },
  };

  for (const maha of dashas) {
    const mahaStart = new Date(maha.startDate);
    const mahaEnd = new Date(maha.endDate);

    // Check if Mahadasha transition happens this year
    if (mahaStart >= yearStart && mahaStart <= yearEnd) {
      const effects = planetEffects[maha.planet] || { en: 'new phase of life', hi: 'जीवन का नया चरण' };
      events.push({
        type: 'dasha_transition',
        title: t(locale,
          `Mahadasha Change: ${maha.planet} period begins`,
          `महादशा परिवर्तन: ${maha.planetName[locale]} दशा आरम्भ`,
          `महादशापरिवर्तनम्: ${maha.planetName.sa} दशा आरभते`
        ),
        description: t(locale,
          `A major Mahadasha transition begins on ${maha.startDate}. The ${maha.planet} Mahadasha activates themes of ${effects.en}. This is a rare and significant shift that will define the next several years. Prepare for a fundamentally new chapter in life.`,
          `${maha.startDate} को एक प्रमुख महादशा परिवर्तन आरम्भ होता है। ${maha.planetName[locale]} महादशा ${effects.hi} के विषय सक्रिय करती है। यह दुर्लभ और महत्वपूर्ण परिवर्तन जीवन के अगले कई वर्ष निर्धारित करेगा।`
        ),
        period: maha.startDate,
        impact: 'mixed',
      });
    }

    // Only scan subperiods of the Mahadasha covering current year
    if (mahaEnd < yearStart || mahaStart > yearEnd) continue;
    if (!maha.subPeriods) continue;

    for (const sub of maha.subPeriods) {
      const subStart = new Date(sub.startDate);
      if (subStart >= yearStart && subStart <= yearEnd) {
        const effects = planetEffects[sub.planet] || { en: 'shifting energies', hi: 'ऊर्जा परिवर्तन' };
        events.push({
          type: 'dasha_transition',
          title: t(locale,
            `Antardasha: ${maha.planet}-${sub.planet} begins`,
            `अन्तर्दशा: ${maha.planetName[locale]}-${sub.planetName[locale]} आरम्भ`,
            `अन्तर्दशा: ${maha.planetName.sa}-${sub.planetName.sa} आरभते`
          ),
          description: t(locale,
            `On ${sub.startDate}, the ${sub.planet} Antardasha within ${maha.planet} Mahadasha begins, bringing focus to ${effects.en}. This sub-period modulates the main dasha themes with ${sub.planet}'s influence.`,
            `${sub.startDate} को ${maha.planetName[locale]} महादशा में ${sub.planetName[locale]} अन्तर्दशा आरम्भ होती है, ${effects.hi} पर ध्यान केन्द्रित। यह उपकाल मुख्य दशा विषयों को ${sub.planetName[locale]} के प्रभाव से संशोधित करता है।`
          ),
          period: sub.startDate,
          impact: 'mixed',
        });
      }
    }
  }

  return events;
}

/** Build quarterly forecasts combining transit and dasha data */
function buildQuarterlyForecasts(
  events: YearEvent[],
  saturnSign: number,
  jupiterSign: number,
  natalMoonSign: number,
  locale: Locale
): QuarterForecast[] {
  const year = new Date().getFullYear();
  const quarterLabels = [
    { en: `Q1 (Jan–Mar ${year})`, hi: `Q1 (जन–मार्च ${year})`, sa: `Q1 (जनवरी–मार्चः ${year})` },
    { en: `Q2 (Apr–Jun ${year})`, hi: `Q2 (अप्रैल–जून ${year})`, sa: `Q2 (अप्रैलः–जूनः ${year})` },
    { en: `Q3 (Jul–Sep ${year})`, hi: `Q3 (जुला–सित ${year})`, sa: `Q3 (जुलाई–सितम्बरः ${year})` },
    { en: `Q4 (Oct–Dec ${year})`, hi: `Q4 (अक्तू–दिस ${year})`, sa: `Q4 (अक्तूबरः–दिसम्बरः ${year})` },
  ];

  const jupHouse = houseFromSign(jupiterSign, natalMoonSign);
  const satHouse = houseFromSign(saturnSign, natalMoonSign);
  const isSadeSati = satHouse === 12 || satHouse === 1 || satHouse === 2;
  const jupFavorable = [2, 5, 7, 9, 11].includes(jupHouse);

  return quarterLabels.map((label, qi) => {
    // Count events in this quarter
    const qEvents = events.filter(e => {
      if (e.period.includes('/') || e.period.includes('-')) {
        const d = new Date(e.period);
        const m = d.getMonth();
        return Math.floor(m / 3) === qi;
      }
      return true; // "Ongoing" events count for all
    });

    const challengeCount = qEvents.filter(e => e.impact === 'challenging').length;
    const favorableCount = qEvents.filter(e => e.impact === 'favorable').length;

    // Base outlook from transits
    let outlook: QuarterForecast['outlook'];
    if (isSadeSati && !jupFavorable) {
      outlook = qi < 2 ? 'challenging' : 'mixed';
    } else if (jupFavorable && !isSadeSati) {
      outlook = 'favorable';
    } else if (favorableCount > challengeCount) {
      outlook = 'favorable';
    } else if (challengeCount > favorableCount) {
      outlook = 'challenging';
    } else {
      outlook = 'mixed';
    }

    // Vary by quarter for more natural variation
    if (qi === 1 && outlook === 'challenging') outlook = 'mixed'; // Q2 typically mellows
    if (qi === 3 && jupFavorable) outlook = 'favorable'; // Q4 year-end gains

    const summaries: Record<QuarterForecast['outlook'], { en: string; hi: string }[]> = {
      favorable: [
        { en: 'A promising period with Jupiter\'s blessings. Career and financial prospects look bright. Leverage opportunities that come your way.', hi: 'बृहस्पति के आशीर्वाद से आशाजनक काल। कैरियर और वित्तीय सम्भावनाएँ उज्ज्वल।' },
        { en: 'Growth and expansion define this quarter. Relationships improve, health stabilizes, and creative ventures succeed.', hi: 'विकास और विस्तार इस तिमाही को परिभाषित करते हैं। सम्बन्ध सुधरते हैं, स्वास्थ्य स्थिर।' },
        { en: 'Positive planetary alignments support your goals. A good time for new initiatives, education, and social connections.', hi: 'अनुकूल ग्रह योग आपके लक्ष्यों का समर्थन करते हैं। नई पहल, शिक्षा और सामाजिक सम्पर्क के लिए उत्तम।' },
        { en: 'Fortune favors the bold this quarter. Take calculated risks, invest in self-improvement, and embrace change.', hi: 'इस तिमाही में भाग्य साहसी का साथ देता है। सोच-समझकर जोखिम लें और आत्म-सुधार में निवेश करें।' },
      ],
      mixed: [
        { en: 'A balanced period with both opportunities and challenges. Stay adaptable, maintain discipline, and focus on priorities.', hi: 'अवसरों और चुनौतियों दोनों का सन्तुलित काल। अनुकूलनशील रहें, अनुशासन बनाएं।' },
        { en: 'Some areas progress while others need patience. Professional life may demand extra effort. Health and relationships need conscious attention.', hi: 'कुछ क्षेत्र प्रगति करते हैं जबकि अन्य में धैर्य की आवश्यकता। पेशेवर जीवन में अतिरिक्त प्रयास।' },
        { en: 'Transit energies pull in different directions. Prioritize what matters most and postpone non-essential decisions.', hi: 'गोचर ऊर्जाएँ विभिन्न दिशाओं में खींचती हैं। सबसे महत्वपूर्ण को प्राथमिकता दें।' },
        { en: 'A period of recalibration. Review goals, adjust strategies, and consolidate gains from previous quarters.', hi: 'पुनर्अंशांकन का काल। लक्ष्यों की समीक्षा करें, रणनीतियाँ समायोजित करें।' },
      ],
      challenging: [
        { en: 'Saturn\'s influence demands patience and perseverance. Avoid impulsive decisions. Focus on responsibilities and long-term goals.', hi: 'शनि का प्रभाव धैर्य और दृढ़ता की माँग करता है। आवेगपूर्ण निर्णयों से बचें।' },
        { en: 'A testing period that builds character. Health needs attention, finances require caution. Spiritual practices provide relief.', hi: 'चरित्र निर्माण का परीक्षण काल। स्वास्थ्य पर ध्यान, वित्त में सावधानी। आध्यात्मिक अभ्यास राहत देते हैं।' },
        { en: 'Obstacles may arise in career and relationships. Stay grounded, seek wise counsel, and avoid confrontations.', hi: 'कैरियर और सम्बन्धों में बाधाएँ आ सकती हैं। स्थिर रहें, बुद्धिमान परामर्श लें।' },
        { en: 'Difficult but transformative. Every challenge carries a hidden lesson. Embrace austerity and emerge stronger.', hi: 'कठिन किन्तु परिवर्तनकारी। प्रत्येक चुनौती में छिपा सबक। तपस्या अपनाएँ और मजबूत बनें।' },
      ],
    };

    const pool = summaries[outlook];
    const summary = pool[qi % pool.length];

    return {
      quarter: t(locale, label.en, label.hi, label.sa),
      outlook,
      summary: t(locale, summary.en, summary.hi),
    };
  });
}

/** Generate overall year summary */
function generateOverview(events: YearEvent[], quarters: QuarterForecast[], locale: Locale): string {
  const favorableQ = quarters.filter(q => q.outlook === 'favorable').length;
  const challengingQ = quarters.filter(q => q.outlook === 'challenging').length;
  const hasSadeSati = events.some(e => e.type === 'sade_sati');
  const hasJupiterFavorable = events.some(e => e.type === 'jupiter_transit' && e.impact === 'favorable');

  if (hasSadeSati && !hasJupiterFavorable) {
    return t(locale,
      `This year carries the weight of Sade Sati, demanding patience, discipline, and inner strength. While challenges in career, health, or relationships may test your resolve, this is fundamentally a period of karmic maturation. Saturn teaches through restriction — embrace the lessons. ${favorableQ > 0 ? 'Some quarters show relief and progress, so pace yourself wisely.' : 'Consistent spiritual practice and service will provide the greatest relief.'}`,
      `इस वर्ष साढ़े साती का भार है, जो धैर्य, अनुशासन और आन्तरिक शक्ति की माँग करता है। कैरियर, स्वास्थ्य या सम्बन्धों में चुनौतियाँ आपके संकल्प की परीक्षा ले सकती हैं, किन्तु यह मूलतः कार्मिक परिपक्वता का काल है। शनि प्रतिबन्ध के माध्यम से सिखाता है — पाठ स्वीकार करें।`
    );
  }

  if (hasJupiterFavorable && !hasSadeSati) {
    return t(locale,
      `Jupiter's favorable transit blesses this year with growth, wisdom, and expanding opportunities. ${favorableQ >= 3 ? 'Most quarters look promising — this is an excellent year for career advancement, education, relationships, and spiritual growth.' : 'Several quarters show strong potential for progress.'} Leverage Jupiter's benevolence by acting with dharma and generosity. Knowledge-based pursuits and ethical endeavors will yield the greatest returns.`,
      `बृहस्पति का अनुकूल गोचर इस वर्ष को विकास, ज्ञान और बढ़ते अवसरों से आशीर्वादित करता है। ${favorableQ >= 3 ? 'अधिकांश तिमाहियाँ आशाजनक — कैरियर उन्नति, शिक्षा, सम्बन्ध और आध्यात्मिक विकास के लिए उत्कृष्ट वर्ष।' : 'कई तिमाहियाँ प्रगति की प्रबल सम्भावना दर्शाती हैं।'} धर्म और उदारता से कार्य करके बृहस्पति की कृपा का लाभ उठाएँ।`
    );
  }

  // Mixed year
  const mixedQ = 4 - favorableQ - challengingQ;
  const enParts: string[] = [];
  if (favorableQ > 0) enParts.push(`${favorableQ} quarter${favorableQ > 1 ? 's' : ''} look${favorableQ === 1 ? 's' : ''} favorable`);
  if (challengingQ > 0) enParts.push(`${challengingQ} may require extra effort`);
  if (mixedQ > 0 && favorableQ === 0 && challengingQ === 0) enParts.push('all quarters show a blend of opportunities and challenges');
  else if (mixedQ > 0) enParts.push(`${mixedQ} show${mixedQ === 1 ? 's' : ''} a mix of both`);
  const enSummary = enParts.join(', while ');

  const hiParts: string[] = [];
  if (favorableQ > 0) hiParts.push(`${favorableQ} तिमाही अनुकूल`);
  if (challengingQ > 0) hiParts.push(`${challengingQ} में अतिरिक्त प्रयास आवश्यक`);
  if (mixedQ > 0 && favorableQ === 0 && challengingQ === 0) hiParts.push('सभी तिमाहियों में अवसरों और चुनौतियों का मिश्रण');
  else if (mixedQ > 0) hiParts.push(`${mixedQ} में दोनों का मिश्रण`);
  const hiSummary = hiParts.join(', जबकि ');

  return t(locale,
    `This year presents a blend of planetary influences requiring both initiative and caution. ${enSummary}. Transit dynamics between major planets create a year of transformation and growth through diverse experiences. Balance ambition with wisdom, and action with patience.`,
    `इस वर्ष ग्रहीय प्रभावों का मिश्रण है जिसमें पहल और सावधानी दोनों आवश्यक हैं। ${hiSummary}। प्रमुख ग्रहों के गोचर विविध अनुभवों से परिवर्तन और विकास का वर्ष बनाते हैं। महत्वाकांक्षा और ज्ञान में, क्रिया और धैर्य में सन्तुलन बनाएं।`
  );
}

/** Generate key advice for the year */
function generateKeyAdvice(events: YearEvent[], locale: Locale): string {
  const hasSadeSati = events.some(e => e.type === 'sade_sati');
  const jupiterEvent = events.find(e => e.type === 'jupiter_transit');
  const hasDashaChange = events.some(e => e.type === 'dasha_transition' && e.title.includes('Mahadasha'));

  if (hasSadeSati) {
    return t(locale,
      'Key guidance: Prioritize health, maintain financial discipline, and deepen spiritual practice. Avoid major speculative risks. Serve the elderly and practice gratitude. Saturn rewards those who embrace responsibility with humility. This challenging period will forge lasting strength.',
      'मुख्य मार्गदर्शन: स्वास्थ्य को प्राथमिकता दें, वित्तीय अनुशासन बनाएं, और आध्यात्मिक अभ्यास गहन करें। प्रमुख सट्टा जोखिमों से बचें। वृद्धजनों की सेवा करें और कृतज्ञता का अभ्यास करें।',
      'मुख्यमार्गदर्शनम्: स्वास्थ्यं प्राथमिकतया रक्षतु, वित्तीयानुशासनं पालयतु, आध्यात्मिकाभ्यासं गाढं करोतु।'
    );
  }

  if (jupiterEvent?.impact === 'favorable') {
    return t(locale,
      'Key guidance: This is a year to expand — pursue higher education, travel, invest in growth, and strengthen relationships. Jupiter\'s blessings favor dharmic action, teaching, and mentoring. Share your knowledge generously. Financial planning now yields long-term wealth.',
      'मुख्य मार्गदर्शन: यह विस्तार का वर्ष है — उच्च शिक्षा, यात्रा, विकास में निवेश और सम्बन्ध मजबूत करें। बृहस्पति का आशीर्वाद धार्मिक कार्य, शिक्षण और मार्गदर्शन को अनुकूल। ज्ञान उदारता से बाँटें।',
      'मुख्यमार्गदर्शनम्: विस्तारस्य वर्षम् एतत् — उच्चशिक्षा, यात्रा, विकासे निवेशः सम्बन्धानां सुदृढीकरणं च।'
    );
  }

  if (hasDashaChange) {
    return t(locale,
      'Key guidance: A major dasha transition this year signals a turning point. Embrace change gracefully, update your goals to align with the new planetary period, and maintain flexibility. The transition period (2-3 months around the change) requires extra awareness.',
      'मुख्य मार्गदर्शन: इस वर्ष एक प्रमुख दशा परिवर्तन एक मोड़ का संकेत है। परिवर्तन को सहजता से स्वीकारें, नए ग्रह काल के अनुसार अपने लक्ष्य अद्यतन करें, और लचीलापन बनाएं।',
      'मुख्यमार्गदर्शनम्: अस्मिन् वर्षे प्रमुखदशापरिवर्तनं परिवर्तनबिन्दुं सूचयति।'
    );
  }

  return t(locale,
    'Key guidance: Maintain a balanced approach throughout the year. Invest in self-improvement, strengthen family bonds, and pursue your career goals with steady determination. Regular spiritual practice and healthy routines will be your greatest assets.',
    'मुख्य मार्गदर्शन: वर्ष भर सन्तुलित दृष्टिकोण बनाएं। आत्म-सुधार में निवेश करें, पारिवारिक बन्धन मजबूत करें, और स्थिर दृढ़ संकल्प से कैरियर लक्ष्यों का अनुसरण करें।',
    'मुख्यमार्गदर्शनम्: वर्षपर्यन्तं सन्तुलितदृष्टिकोणं पालयतु। आत्मसुधारे निवेशयतु, पारिवारिकबन्धनानि सुदृढीकरोतु।'
  );
}

// ===== MAIN EXPORT =====

export function generateYearPredictions(
  kundali: KundaliData,
  locale: Locale
): YearPredictionSection {
  const year = new Date().getFullYear();

  // Get natal Moon sign
  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const natalMoonSign = moonPlanet?.sign || 1;
  const ascSign = kundali.ascendant.sign;

  // Get current transit positions
  const transits = getCurrentTransits();

  // Collect all events
  const events: YearEvent[] = [];

  // A. Sade Sati detection
  const sadeSatiEvent = detectSadeSati(transits.saturnSign, natalMoonSign, locale);
  if (sadeSatiEvent) events.push(sadeSatiEvent);

  // B. Jupiter transit
  const jupiterEvent = analyzeJupiterTransit(transits.jupiterSign, natalMoonSign, ascSign, locale);
  events.push(jupiterEvent);

  // C. Rahu-Ketu transit
  const rahuKetuEvent = analyzeRahuKetuTransit(transits.rahuSign, transits.ketuSign, ascSign, natalMoonSign, locale);
  events.push(rahuKetuEvent);

  // D. Dasha transitions
  const dashaEvents = findDashaTransitions(kundali.dashas, locale);
  events.push(...dashaEvents);

  // E. Quarterly forecasts
  const quarters = buildQuarterlyForecasts(events, transits.saturnSign, transits.jupiterSign, natalMoonSign, locale);

  // F. Overview & advice
  const overview = generateOverview(events, quarters, locale);
  const keyAdvice = generateKeyAdvice(events, locale);

  return {
    year,
    overview,
    events,
    quarters,
    keyAdvice,
  };
}
