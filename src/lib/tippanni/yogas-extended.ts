/**
 * Extended Yoga Detection System
 * Based on BPHS Ch.41+75, Phaladeepika, Saravali, Jataka Parijata
 *
 * 20+ additional yogas beyond the existing 10 in tippanni-engine.ts
 * Each yoga has: name (trilingual), detection, strength, implications, classical reference
 */

import type { PlanetPosition, HouseCusp } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import type { YogaInsight } from '@/lib/kundali/tippanni-types';
import { getSignLord, getHouseLord, isKendra, isTrikona, isDusthana, isUpachaya, isBenefic, houseDistance, tri, triLocale } from './utils';
import { getPlanetaryAspects, doesPlanetAspectHouse } from './aspects';

function t(locale: Locale, en: string, hi: string, _sa?: string): string {
  return locale === 'hi' ? hi : en;
}

function getP(planets: PlanetPosition[], id: number): PlanetPosition | undefined {
  return planets.find(p => p.planet.id === id);
}

export function detectExtendedYogas(
  planets: PlanetPosition[],
  houses: HouseCusp[],
  ascSign: number,
  locale: Locale
): YogaInsight[] {
  const yogas: YogaInsight[] = [];

  const sun = getP(planets, 0);
  const moon = getP(planets, 1);
  const mars = getP(planets, 2);
  const merc = getP(planets, 3);
  const jup = getP(planets, 4);
  const ven = getP(planets, 5);
  const sat = getP(planets, 6);
  const rahu = getP(planets, 7);
  const ketu = getP(planets, 8);

  // Helper: get house lord planet placement
  function lordOf(houseNum: number): PlanetPosition | undefined {
    const lordId = getHouseLord(houseNum, ascSign);
    return getP(planets, lordId);
  }

  // --- Dharma-Karmadhipati Yoga ---
  // 9th and 10th lords conjunct or in mutual kendra
  const lord9 = lordOf(9);
  const lord10 = lordOf(10);
  const dkPresent = !!(lord9 && lord10 && (
    lord9.house === lord10.house ||
    isKendra(houseDistance(lord9.house, lord10.house))
  ));
  yogas.push({
    name: t(locale, 'Dharma-Karmadhipati Yoga', 'धर्म-कर्माधिपति योग', 'धर्मकर्माधिपतियोगः'),
    present: dkPresent, type: 'Raja',
    description: t(locale,
      'Lords of 9th (fortune) and 10th (career) are conjunct or in mutual kendra. One of the most powerful Raja Yogas — combines fortune with action for exceptional success. (BPHS Ch.41)',
      '9वें (भाग्य) और 10वें (कैरियर) भाव के स्वामी युति में या परस्पर केन्द्र में। सबसे शक्तिशाली राजयोगों में से एक। (BPHS अ.41)'),
    implications: dkPresent ? t(locale,
      'Exceptional career success aligned with dharma. Authority earned through righteous action. Government favor and public recognition. Success increases after 35.',
      'धर्म से जुड़ी असाधारण कैरियर सफलता। धार्मिक कार्रवाई से अर्जित अधिकार। 35 के बाद सफलता बढ़ती है।') : '',
    strength: dkPresent ? (lord9?.house === lord10?.house ? 'Strong' : 'Moderate') : 'Weak',
  });

  // --- Amala Yoga ---
  // Only natural benefics in 10th from Lagna or Moon (no malefic)
  const tenthFromLagna = 10;
  const tenthPlanets = planets.filter(p => p.house === tenthFromLagna);
  const amalaPresent = tenthPlanets.length > 0 && tenthPlanets.every(p => isBenefic(p.planet.id));
  yogas.push({
    name: t(locale, 'Amala Yoga', 'अमल योग', 'अमलयोगः'),
    present: amalaPresent, type: 'Raja',
    description: t(locale,
      'Only benefics occupy the 10th house. Indicates a person of spotless reputation, virtuous conduct, and fame through ethical career. (Phaladeepika)',
      '10वें भाव में केवल शुभ ग्रह। निष्कलंक प्रतिष्ठा, सदाचार और नैतिक कैरियर से यश। (फलदीपिका)'),
    implications: amalaPresent ? t(locale,
      'Career built on unshakeable ethical foundation. Recognition through virtuous deeds. Lasting fame that outlives the native. Public trust comes naturally.',
      'अटूट नैतिक आधार पर कैरियर। सद्गुणों से मान्यता। स्थायी यश। जनविश्वास स्वाभाविक।') : '',
    strength: amalaPresent ? (tenthPlanets.some(p => p.planet.id === 4) ? 'Strong' : 'Moderate') : 'Weak',
  });

  // --- Lakshmi Yoga ---
  // Venus in own/exalted sign + in kendra, AND 9th lord is strong
  const lakshmiPresent = !!(ven &&
    isKendra(ven.house) &&
    (ven.isExalted || ven.isOwnSign) &&
    lord9 && (isKendra(lord9.house) || isTrikona(lord9.house))
  );
  yogas.push({
    name: t(locale, 'Lakshmi Yoga', 'लक्ष्मी योग', 'लक्ष्मीयोगः'),
    present: lakshmiPresent, type: 'Dhana',
    description: t(locale,
      'Venus in own/exalted sign in Kendra with strong 9th lord. Grants immense wealth, luxury, beauty, and prosperity blessed by Goddess Lakshmi. (Phaladeepika)',
      'शुक्र स्वगृह/उच्च में केन्द्र में, 9वें भाव का स्वामी बलवान। देवी लक्ष्मी की कृपा से अपार धन, विलासिता, सौन्दर्य।'),
    implications: lakshmiPresent ? t(locale,
      'Wealth flows abundantly through beauty, art, and relationships. Luxurious lifestyle sustained throughout. Fortune and prosperity are divinely ordained.',
      'सौन्दर्य, कला और सम्बन्धों से प्रचुर धन। विलासितापूर्ण जीवनशैली। भाग्य और समृद्धि दैवीय रूप से निर्धारित।') : '',
    strength: lakshmiPresent ? 'Strong' : 'Weak',
  });

  // --- Saraswati Yoga ---
  // Jupiter, Venus, Mercury in kendra/trikona/2nd house
  const saraswatiPlanets = [jup, ven, merc].filter(p =>
    p && (isKendra(p.house) || isTrikona(p.house) || p.house === 2)
  );
  const saraswatiPresent = saraswatiPlanets.length === 3;
  yogas.push({
    name: t(locale, 'Saraswati Yoga', 'सरस्वती योग', 'सरस्वतीयोगः'),
    present: saraswatiPresent, type: 'Other',
    description: t(locale,
      'Jupiter, Venus, and Mercury all in Kendra, Trikona, or 2nd house. Grants exceptional learning, eloquence, artistic talent, and scholarly renown. (Saravali)',
      'बृहस्पति, शुक्र और बुध सभी केन्द्र, त्रिकोण या 2वें भाव में। असाधारण विद्या, वाक्पटुता, कलात्मक प्रतिभा। (सारावली)'),
    implications: saraswatiPresent ? t(locale,
      'Mastery of knowledge, arts, and communication. Academic excellence and literary fame. Music, poetry, and scholarship reach heights. Blessed by Goddess Saraswati.',
      'ज्ञान, कला और संवाद में प्रवीणता। शैक्षिक उत्कृष्टता और साहित्यिक यश। देवी सरस्वती की कृपा।') : '',
    strength: saraswatiPresent ? 'Strong' : 'Weak',
  });

  // --- Sunapha Yoga ---
  // Planets (not Sun, Rahu, Ketu) in 2nd from Moon
  if (moon) {
    const secondFromMoon = (moon.house % 12) + 1;
    const sunaphaPlanets = planets.filter(p =>
      p.house === secondFromMoon && ![0, 7, 8].includes(p.planet.id) && p.planet.id !== 1
    );
    const sunaphaPresent = sunaphaPlanets.length > 0;
    yogas.push({
      name: t(locale, 'Sunapha Yoga', 'सुनफा योग', 'सुनफायोगः'),
      present: sunaphaPresent, type: 'Other',
      description: t(locale,
        'Planets (except Sun) in the 2nd house from Moon. Grants self-earned wealth, intelligence, and good reputation through personal merit. (BPHS)',
        'चन्द्रमा से 2वें भाव में ग्रह (सूर्य को छोड़कर)। स्व-अर्जित धन, बुद्धि, और व्यक्तिगत योग्यता से प्रतिष्ठा। (BPHS)'),
      implications: sunaphaPresent ? t(locale,
        'Wealth earned through personal effort and intelligence. Good reputation built through merit. Independent and self-made success.',
        'व्यक्तिगत प्रयास और बुद्धि से धन अर्जन। योग्यता से निर्मित प्रतिष्ठा। स्वतन्त्र और स्व-निर्मित सफलता।') : '',
      strength: sunaphaPresent ? 'Moderate' : 'Weak',
    });
  }

  // --- Anapha Yoga ---
  // Planets (not Sun, Rahu, Ketu) in 12th from Moon
  if (moon) {
    const twelfthFromMoon = ((moon.house - 2 + 12) % 12) + 1;
    const anaphaPlanets = planets.filter(p =>
      p.house === twelfthFromMoon && ![0, 7, 8].includes(p.planet.id) && p.planet.id !== 1
    );
    const anaphaPresent = anaphaPlanets.length > 0;
    yogas.push({
      name: t(locale, 'Anapha Yoga', 'अनफा योग', 'अनफायोगः'),
      present: anaphaPresent, type: 'Other',
      description: t(locale,
        'Planets (except Sun) in the 12th house from Moon. Grants spiritual inclination, fame through renunciation, and noble character. (BPHS)',
        'चन्द्रमा से 12वें भाव में ग्रह (सूर्य को छोड़कर)। आध्यात्मिक प्रवृत्ति, त्याग से यश, उत्तम चरित्र। (BPHS)'),
      implications: anaphaPresent ? t(locale,
        'Spiritual fame and recognition. Noble character attracts respect. Power through renunciation rather than acquisition.',
        'आध्यात्मिक यश और मान्यता। उत्तम चरित्र सम्मान आकर्षित करता है।') : '',
      strength: anaphaPresent ? 'Moderate' : 'Weak',
    });
  }

  // --- Durudhura Yoga ---
  // Planets in both 2nd and 12th from Moon
  if (moon) {
    const secondFromMoon = (moon.house % 12) + 1;
    const twelfthFromMoon = ((moon.house - 2 + 12) % 12) + 1;
    const inSecond = planets.some(p => p.house === secondFromMoon && ![0, 7, 8].includes(p.planet.id) && p.planet.id !== 1);
    const inTwelfth = planets.some(p => p.house === twelfthFromMoon && ![0, 7, 8].includes(p.planet.id) && p.planet.id !== 1);
    const durudhuraPresent = inSecond && inTwelfth;
    yogas.push({
      name: t(locale, 'Durudhura Yoga', 'दुरुधुरा योग', 'दुरुधुरायोगः'),
      present: durudhuraPresent, type: 'Other',
      description: t(locale,
        'Planets in both 2nd and 12th from Moon. Grants wealth, fame, and enjoyment. The Moon is supported from both sides. (BPHS)',
        '2वें और 12वें दोनों भावों में चन्द्रमा से ग्रह। धन, यश और भोग। चन्द्रमा दोनों ओर से सहारा प्राप्त। (BPHS)'),
      implications: durudhuraPresent ? t(locale,
        'Well-supported emotional life leading to material and social success. Generous disposition. Vehicles, property, and comforts come easily.',
        'भावनात्मक जीवन को भौतिक और सामाजिक सफलता की ओर सहारा। उदार स्वभाव। वाहन, सम्पत्ति सुलभ।') : '',
      strength: durudhuraPresent ? 'Moderate' : 'Weak',
    });
  }

  // --- Vasumati Yoga ---
  // Benefics in upachaya houses (3, 6, 10, 11)
  const beneficsInUpachaya = planets.filter(p => isBenefic(p.planet.id) && isUpachaya(p.house));
  const vasumatiPresent = beneficsInUpachaya.length >= 3;
  yogas.push({
    name: t(locale, 'Vasumati Yoga', 'वसुमती योग', 'वसुमतीयोगः'),
    present: vasumatiPresent, type: 'Dhana',
    description: t(locale,
      'Benefic planets in Upachaya houses (3, 6, 10, 11). Grants ever-increasing wealth and prosperity throughout life. (Phaladeepika)',
      'शुभ ग्रह उपचय भावों (3, 6, 10, 11) में। जीवनभर निरन्तर बढ़ता धन और समृद्धि। (फलदीपिका)'),
    implications: vasumatiPresent ? t(locale,
      'Wealth steadily increases through life. Each decade brings greater prosperity. Financial growth through effort, competition, and career advancement.',
      'जीवनभर धन में स्थिर वृद्धि। प्रत्येक दशक अधिक समृद्धि लाता है।') : '',
    strength: vasumatiPresent ? (beneficsInUpachaya.length >= 4 ? 'Strong' : 'Moderate') : 'Weak',
  });

  // --- Neechabhanga Raja Yoga ---
  // Debilitation cancelled -> becomes raja yoga
  const debilitatedPlanets = planets.filter(p => p.isDebilitated && p.planet.id <= 6);
  for (const debP of debilitatedPlanets) {
    const debSign = debP.sign;
    const signLord = getSignLord(debSign);
    const signLordPlanet = getP(planets, signLord);
    // Cancellation: lord of debilitation sign is in kendra from lagna or moon
    const cancelled = signLordPlanet && (
      isKendra(signLordPlanet.house) ||
      (moon && isKendra(houseDistance(moon.house, signLordPlanet.house)))
    );
    if (cancelled) {
      const graha = debP.planet;
      yogas.push({
        name: t(locale, 'Neechabhanga Raja Yoga', 'नीचभङ्ग राजयोग', 'नीचभङ्गराजयोगः'),
        present: true, type: 'Raja',
        description: t(locale,
          `${graha.name.en}'s debilitation is cancelled — the lord of the debilitation sign is in Kendra. Debilitation converted to great strength. Rise through overcoming adversity. (Jataka Parijata)`,
          `${graha.name.hi} की नीचता रद्द — नीच राशि का स्वामी केन्द्र में। नीचता महान शक्ति में परिवर्तित। प्रतिकूलता पर विजय से उत्थान। (जातक पारिजात)`),
        implications: t(locale,
          'What appeared as weakness becomes your greatest strength. Rise from humble beginnings to positions of power. Overcoming obstacles creates extraordinary resilience.',
          'जो कमजोरी प्रतीत होती थी वही आपकी सबसे बड़ी शक्ति बनती है। विनम्र शुरुआत से शक्ति पदों तक उत्थान।'),
        strength: 'Strong',
      });
    }
  }

  // --- Parivartana Yoga (Mutual Exchange) ---
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      if (p1.planet.id > 6 || p2.planet.id > 6) continue; // Skip nodes

      const lord1 = getSignLord(p1.sign);
      const lord2 = getSignLord(p2.sign);

      if (lord1 === p2.planet.id && lord2 === p1.planet.id) {
        const name1 = p1.planet.name[locale];
        const name2 = p2.planet.name[locale];
        yogas.push({
          name: t(locale, 'Parivartana Yoga', 'परिवर्तन योग', 'परिवर्तनयोगः'),
          present: true, type: 'Raja',
          description: t(locale,
            `${p1.planet.name.en} and ${p2.planet.name.en} are in each other's signs (mutual exchange). Both planets gain strength as if in their own signs. Results of both houses combine powerfully. (BPHS Ch.41)`,
            `${name1} और ${name2} परस्पर राशि-विनिमय में हैं। दोनों ग्रह स्वगृह जैसी शक्ति प्राप्त करते हैं। दोनों भावों के फल शक्तिशाली संयोग। (BPHS अ.41)`),
          implications: t(locale,
            `The affairs of houses ${p1.house} and ${p2.house} become deeply interlinked and mutually supportive. Both areas of life strengthen each other.`,
            `भाव ${p1.house} और ${p2.house} के मामले गहराई से जुड़े और परस्पर सहायक। दोनों क्षेत्र एक-दूसरे को मजबूत करते हैं।`),
          strength: 'Strong',
        });
        break; // One parivartana per pair
      }
    }
  }

  // --- Pravrajya Yoga ---
  // 4+ planets in one house
  for (let h = 1; h <= 12; h++) {
    const planetsInHouse = planets.filter(p => p.house === h);
    if (planetsInHouse.length >= 4) {
      yogas.push({
        name: t(locale, 'Pravrajya Yoga', 'प्रव्रज्या योग', 'प्रव्रज्यायोगः'),
        present: true, type: 'Other',
        description: t(locale,
          `${planetsInHouse.length} planets concentrated in house ${h}. Indicates intense focus on that house's significations. May lead to renunciation or single-minded pursuit. (Saravali)`,
          `${planetsInHouse.length} ग्रह ${h}वें भाव में केन्द्रित। उस भाव के कारकत्वों पर तीव्र ध्यान। त्याग या एकाग्र अनुसरण सम्भव। (सारावली)`),
        implications: t(locale,
          `Massive planetary energy concentrated in house ${h}. Life becomes intensely focused on these themes. Other areas may be relatively neglected.`,
          `${h}वें भाव में विशाल ग्रहीय ऊर्जा केन्द्रित। जीवन इन विषयों पर तीव्र ध्यान केन्द्रित।`),
        strength: planetsInHouse.length >= 5 ? 'Strong' : 'Moderate',
      });
    }
  }

  // --- Shakata Yoga (Arishta) ---
  // Jupiter in 6/8/12 from Moon
  if (jup && moon) {
    const jupFromMoonDist = houseDistance(moon.house, jup.house);
    const shakataPresent = [6, 8, 12].includes(jupFromMoonDist);
    if (shakataPresent) {
      yogas.push({
        name: t(locale, 'Shakata Yoga', 'शकट योग', 'शकटयोगः'),
        present: true, type: 'Arishta',
        description: t(locale,
          'Jupiter in 6th, 8th, or 12th from Moon. May cause fluctuating fortunes and periodic setbacks. Wisdom and emotional life may conflict. (Phaladeepika)',
          'बृहस्पति चन्द्रमा से 6, 8 या 12वें भाव में। उतार-चढ़ाव वाला भाग्य और आवधिक बाधाएँ। ज्ञान और भावनात्मक जीवन में संघर्ष। (फलदीपिका)'),
        implications: t(locale,
          'Fortune fluctuates like a wheel (shakata). Periods of prosperity alternate with setbacks. Emotional stability requires conscious effort.',
          'भाग्य पहिये (शकट) की तरह उतार-चढ़ाव करता है। समृद्धि और बाधाओं के काल बदलते रहते हैं।'),
        strength: jup.isRetrograde ? 'Weak' : 'Moderate',
      });
    }
  }

  // --- Daridra Yoga (Arishta) ---
  // 11th lord in dusthana
  const lord11 = lordOf(11);
  const daridraPresent = !!(lord11 && isDusthana(lord11.house));
  if (daridraPresent) {
    yogas.push({
      name: t(locale, 'Daridra Yoga', 'दरिद्र योग', 'दरिद्रयोगः'),
      present: true, type: 'Arishta',
      description: t(locale,
        `${lord11.planet.name.en} (lord of 11th house — gains) placed in a dusthana (house ${lord11.house}). Gains come with obstacles, delays, or through unconventional means. Effort required for income.`,
        `${lord11.planet.name.hi} (11वें भाव का स्वामी — लाभ) दुःस्थान (${lord11.house}वें भाव) में। लाभ बाधाओं, विलम्ब या अपरम्परागत साधनों से। आय के लिए प्रयास आवश्यक।`),
      implications: t(locale,
        'Income requires extra effort and may come through service or healing. Financial setbacks teach valuable lessons. Wealth improves after overcoming initial obstacles.',
        'आय में अतिरिक्त प्रयास आवश्यक। आर्थिक बाधाएँ मूल्यवान पाठ सिखाती हैं। प्रारम्भिक बाधाओं पर विजय के बाद धन सुधरता है।'),
      strength: 'Moderate',
    });
  }

  // --- Grahan Yoga ---
  // Sun or Moon conjunct Rahu or Ketu (in same house)
  const grahanSun = !!(sun && ((rahu && sun.house === rahu.house) || (ketu && sun.house === ketu.house)));
  const grahanMoon = !!(moon && ((rahu && moon.house === rahu.house) || (ketu && moon.house === ketu.house)));
  if (grahanSun || grahanMoon) {
    const luminary = grahanSun ? 'Sun' : 'Moon';
    const node = grahanSun
      ? (rahu && sun!.house === rahu.house ? 'Rahu' : 'Ketu')
      : (rahu && moon!.house === rahu.house ? 'Rahu' : 'Ketu');
    yogas.push({
      name: t(locale, 'Grahan Yoga', 'ग्रहण योग', 'ग्रहणयोगः'),
      present: true, type: 'Arishta',
      description: t(locale,
        `${luminary} conjunct ${node} creates Grahan (eclipse) Yoga. The luminary's significations are partially obscured. Karmic patterns from past lives need resolution. (BPHS)`,
        `${luminary === 'Sun' ? 'सूर्य' : 'चन्द्रमा'} ${node === 'Rahu' ? 'राहु' : 'केतु'} के साथ ग्रहण योग बनाता है। ज्योति के कारकत्व आंशिक रूप से ढके। पूर्वजन्म कार्मिक समाधान आवश्यक। (BPHS)`),
      implications: t(locale,
        `${luminary === 'Sun' ? 'Father relationship, ego expression, and career' : 'Mother, emotions, and mental peace'} face periodic challenges requiring conscious resolution. Eclipse periods intensify effects.`,
        `${luminary === 'Sun' ? 'पिता सम्बन्ध, अहम् अभिव्यक्ति और कैरियर' : 'माता, भावनाएँ और मानसिक शान्ति'} में सचेत समाधान की आवश्यकता।`),
      strength: 'Moderate',
    });
  }

  // --- Kahala Yoga ---
  // 4th and 9th lords in mutual kendra
  const lord4 = lordOf(4);
  const lord9r = lordOf(9);
  const kahalaPresent = !!(lord4 && lord9r && isKendra(houseDistance(lord4.house, lord9r.house)));
  if (kahalaPresent) {
    yogas.push({
      name: t(locale, 'Kahala Yoga', 'कहल योग', 'कहलयोगः'),
      present: true, type: 'Raja',
      description: t(locale,
        'Lords of 4th (domestic) and 9th (fortune) in mutual Kendra. Grants courage, conveyances, property, and a bold temperament. (Jataka Parijata)',
        '4वें और 9वें भावों के स्वामी परस्पर केन्द्र में। साहस, वाहन, सम्पत्ति और साहसी स्वभाव। (जातक पारिजात)'),
      implications: t(locale,
        'Property and fortune connected. Domestic comfort supports career success. Courage in pursuing higher goals. Multiple vehicles and properties likely.',
        'सम्पत्ति और भाग्य जुड़े। घरेलू सुख कैरियर सफलता का सहारा। उच्चतर लक्ष्यों में साहस।'),
      strength: 'Moderate',
    });
  }

  // --- Pushkala Yoga ---
  // Lagna lord in friend's sign, Moon in kendra, ascendant aspected by benefic
  const lagnaLordId = getHouseLord(1, ascSign);
  const lagnaLord = getP(planets, lagnaLordId);
  const pushkalaPresent = !!(lagnaLord && moon && isKendra(moon.house) && !lagnaLord.isDebilitated);
  if (pushkalaPresent) {
    yogas.push({
      name: t(locale, 'Pushkala Yoga', 'पुष्कल योग', 'पुष्कलयोगः'),
      present: true, type: 'Other',
      description: t(locale,
        'Lagna lord well-placed and Moon in Kendra. Grants sweet speech, wealth, fame, and respect from king/government. (Phaladeepika)',
        'लग्न स्वामी शुभ स्थिति में और चन्द्रमा केन्द्र में। मधुर वाणी, धन, यश और राजसम्मान। (फलदीपिका)'),
      implications: t(locale,
        'Sweet, persuasive speech opens doors. Wealth through communication and public dealings. Government recognition and social fame.',
        'मधुर, प्रेरक वाणी द्वार खोलती है। संवाद और जनसम्पर्क से धन। सरकारी मान्यता और सामाजिक यश।'),
      strength: 'Moderate',
    });
  }

  // --- Guru Chandal Yoga (Arishta, but can also be transformative) ---
  const gcPresent = !!(jup && rahu && jup.house === rahu.house);
  if (gcPresent) {
    yogas.push({
      name: t(locale, 'Guru Chandal Yoga', 'गुरु चाण्डाल योग', 'गुरुचाण्डालयोगः'),
      present: true, type: 'Arishta',
      description: t(locale,
        'Jupiter conjunct Rahu. Wisdom contaminated by worldly desire and unconventional thinking. May break religious norms but gain unconventional knowledge. (BPHS)',
        'बृहस्पति और राहु युति। ज्ञान सांसारिक इच्छा और अपरम्परागत सोच से प्रदूषित। धार्मिक मानदण्ड तोड़ सकते हैं पर अपरम्परागत ज्ञान प्राप्त। (BPHS)'),
      implications: t(locale,
        'Traditional wisdom challenged by modern or foreign influences. May become a guru of unconventional path. Teacher-student relationships carry karmic weight.',
        'पारम्परिक ज्ञान आधुनिक या विदेशी प्रभावों से चुनौतीपूर्ण। अपरम्परागत मार्ग के गुरु बन सकते हैं।'),
      strength: 'Moderate',
    });
  }

  // --- Kemdrum Yoga (Arishta) ---
  // No planets in 2nd or 12th from Moon (already in yogas.ts but adding enhanced version)
  if (moon) {
    const adj2 = (moon.house % 12) + 1;
    const adj12 = ((moon.house - 2 + 12) % 12) + 1;
    const nearMoon = planets.filter(p =>
      p.planet.id !== 1 && ![7, 8].includes(p.planet.id) &&
      (p.house === adj2 || p.house === adj12)
    );
    const kemdrumPresent = nearMoon.length === 0 && !isKendra(moon.house);
    if (kemdrumPresent) {
      yogas.push({
        name: t(locale, 'Kemdrum Yoga', 'केमद्रुम योग', 'केमद्रुमयोगः'),
        present: true, type: 'Arishta',
        description: t(locale,
          'No planets adjacent to Moon and Moon not in Kendra. Indicates periods of loneliness, financial difficulty, or emotional isolation. Often cancelled by other chart factors. (BPHS)',
          'चन्द्रमा के निकट कोई ग्रह नहीं और चन्द्रमा केन्द्र में नहीं। एकाकीपन, आर्थिक कठिनाई के काल। अन्य कुण्डली कारकों से प्रायः रद्द। (BPHS)'),
        implications: t(locale,
          'Periodic emotional isolation and financial challenges. Self-reliance develops through necessity. Cancellation: Moon aspected by Jupiter, or Moon in Kendra from Venus.',
          'आवधिक भावनात्मक एकांत और आर्थिक चुनौतियाँ। आवश्यकता से आत्मनिर्भरता विकसित।'),
        strength: 'Weak',
      });
    }
  }

  return yogas;
}
