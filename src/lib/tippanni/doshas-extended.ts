/**
 * Extended Dosha Detection System
 * Based on BPHS, Jataka Parijata, Phaladeepika
 *
 * 7 additional doshas beyond existing Manglik/Kaal Sarp/Pitra
 * Each dosha: detection, severity, cancellation rules, remedies (trilingual)
 */

import type { PlanetPosition, HouseCusp } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import type { DoshaInsight } from '@/lib/kundali/tippanni-types';
import { getHouseLord, isKendra, isDusthana, isBenefic, houseDistance } from './utils';

function t(locale: Locale, en: string, hi: string, sa?: string): string {
  if (locale === 'sa') return sa || hi;
  return locale === 'hi' ? hi : en;
}

function getP(planets: PlanetPosition[], id: number): PlanetPosition | undefined {
  return planets.find(p => p.planet.id === id);
}

export function detectExtendedDoshas(
  planets: PlanetPosition[],
  houses: HouseCusp[],
  ascSign: number,
  locale: Locale
): DoshaInsight[] {
  const doshas: DoshaInsight[] = [];

  const sun = getP(planets, 0);
  const moon = getP(planets, 1);
  const mars = getP(planets, 2);
  const jup = getP(planets, 4);
  const sat = getP(planets, 6);
  const rahu = getP(planets, 7);
  const ketu = getP(planets, 8);

  // --- Grahan Dosha ---
  // Sun/Moon conjunct Rahu/Ketu
  const sunGrahan = !!(sun && ((rahu && sun.house === rahu.house) || (ketu && sun.house === ketu.house)));
  const moonGrahan = !!(moon && ((rahu && moon.house === rahu.house) || (ketu && moon.house === ketu.house)));
  const grahanPresent = sunGrahan || moonGrahan;
  const grahanSeverity = sunGrahan && moonGrahan ? 'severe' as const
    : grahanPresent ? 'moderate' as const : 'none' as const;

  doshas.push({
    name: t(locale, 'Grahan Dosha (Eclipse)', 'ग्रहण दोष', 'ग्रहणदोषः'),
    present: grahanPresent,
    severity: grahanSeverity,
    description: grahanPresent
      ? t(locale,
          `${sunGrahan ? 'Sun' : ''}${sunGrahan && moonGrahan ? ' and ' : ''}${moonGrahan ? 'Moon' : ''} conjunct with shadow planet creates Grahan Dosha. The luminary's significations are eclipsed — ${sunGrahan ? 'father, authority, and ego suffer periodic challenges' : ''}${sunGrahan && moonGrahan ? '; ' : ''}${moonGrahan ? 'mother, emotions, and mental peace face disturbance' : ''}. Effects intensify during actual eclipses.`,
          `${sunGrahan ? 'सूर्य' : ''}${sunGrahan && moonGrahan ? ' और ' : ''}${moonGrahan ? 'चन्द्रमा' : ''} छाया ग्रह के साथ ग्रहण दोष बनाता है। ${sunGrahan ? 'पिता, अधिकार और अहम् में आवधिक चुनौतियाँ' : ''}${moonGrahan ? 'माता, भावनाएँ और मानसिक शान्ति में अशान्ति' : ''}।`)
      : t(locale, 'No Grahan Dosha. Luminaries are free from Rahu-Ketu conjunction.', 'ग्रहण दोष नहीं। ज्योतियाँ राहु-केतु युति से मुक्त।'),
    remedies: grahanPresent
      ? t(locale,
          'Remedies: 1) Perform Grahan Dosha Puja. 2) Donate food during solar/lunar eclipses. 3) Chant Maha Mrityunjaya Mantra. 4) Wear Rudraksha mala. 5) Feed cows and Brahmins on eclipse days.',
          'उपाय: 1) ग्रहण दोष पूजा। 2) सूर्य/चन्द्र ग्रहण में भोजन दान। 3) महामृत्युंजय मन्त्र। 4) रुद्राक्ष माला धारण। 5) ग्रहण दिवस पर गौ और ब्राह्मण भोजन।')
      : '',
  });

  // --- Guru Chandal Dosha ---
  // Jupiter conjunct Rahu
  const gcPresent = !!(jup && rahu && jup.house === rahu.house);
  doshas.push({
    name: t(locale, 'Guru Chandal Dosha', 'गुरु चाण्डाल दोष', 'गुरुचाण्डालदोषः'),
    present: gcPresent,
    severity: gcPresent ? 'moderate' : 'none',
    description: gcPresent
      ? t(locale,
          'Jupiter conjunct Rahu contaminates wisdom with worldly desire. May lead to wrong guru, misguided beliefs, or exploiting spiritual knowledge. Children and education may face obstacles. However, this can also grant mastery of unconventional knowledge.',
          'बृहस्पति राहु युति ज्ञान को सांसारिक इच्छा से प्रदूषित करती है। गलत गुरु, भ्रामक विश्वास, या आध्यात्मिक ज्ञान का शोषण। सन्तान और शिक्षा में बाधाएँ। परन्तु अपरम्परागत ज्ञान की प्राप्ति भी सम्भव।')
      : t(locale, 'No Guru Chandal Dosha. Jupiter is free from Rahu\'s shadow — wisdom flows purely.', 'गुरु चाण्डाल दोष नहीं। बृहस्पति राहु की छाया से मुक्त — ज्ञान शुद्ध रूप से प्रवाहित।'),
    remedies: gcPresent
      ? t(locale,
          'Remedies: 1) Respect and serve genuine teachers. 2) Chant Jupiter Beej Mantra (Om Graam Greem Graum Sah Gurave Namah). 3) Wear Yellow Sapphire after consultation. 4) Feed Brahmins on Thursdays. 5) Read Vishnu Sahasranama.',
          'उपाय: 1) सच्चे गुरुओं का सम्मान और सेवा। 2) बृहस्पति बीज मन्त्र जप। 3) परामर्श के बाद पुखराज धारण। 4) गुरुवार को ब्राह्मण भोजन। 5) विष्णु सहस्रनाम पाठ।')
      : '',
  });

  // --- Shakata Dosha ---
  // Jupiter in 6/8/12 from Moon
  let shakataPresent = false;
  let shakataCancel = false;
  if (jup && moon) {
    const dist = houseDistance(moon.house, jup.house);
    shakataPresent = [6, 8, 12].includes(dist);
    // Cancellation: Jupiter in kendra from lagna
    shakataCancel = shakataPresent && isKendra(jup.house);
  }
  doshas.push({
    name: t(locale, 'Shakata Dosha', 'शकट दोष', 'शकटदोषः'),
    present: shakataPresent && !shakataCancel,
    severity: shakataPresent && !shakataCancel ? 'mild' : 'none',
    description: shakataPresent
      ? shakataCancel
        ? t(locale,
            'Shakata Dosha is present but cancelled — Jupiter is in Kendra from Lagna. The wheel of fortune stabilizes. Fluctuations are mild.',
            'शकट दोष उपस्थित पर रद्द — बृहस्पति लग्न से केन्द्र में। भाग्य का पहिया स्थिर।')
        : t(locale,
            'Jupiter in 6th/8th/12th from Moon creates Shakata Dosha. Fortune fluctuates like a cart wheel — alternating prosperity and setbacks. Wisdom and emotional life may conflict.',
            'चन्द्रमा से 6/8/12वें भाव में बृहस्पति शकट दोष बनाता है। भाग्य गाड़ी के पहिये की तरह उतार-चढ़ाव — समृद्धि और बाधाएँ बारी-बारी से।')
      : t(locale, 'No Shakata Dosha. Jupiter and Moon are well-placed — fortune is steady.', 'शकट दोष नहीं। बृहस्पति और चन्द्रमा शुभ स्थिति में — भाग्य स्थिर।'),
    remedies: shakataPresent && !shakataCancel
      ? t(locale,
          'Remedies: 1) Chant Guru Beej Mantra on Thursdays. 2) Wear Yellow Sapphire. 3) Donate yellow items on Purnima. 4) Read Sundarkand on Saturdays. 5) Fast on Purnima.',
          'उपाय: 1) गुरुवार को गुरु बीज मन्त्र जप। 2) पुखराज धारण। 3) पूर्णिमा पर पीले पदार्थ दान। 4) शनिवार को सुन्दरकाण्ड पाठ। 5) पूर्णिमा व्रत।')
      : '',
  });

  // --- Kendradhipati Dosha ---
  // Natural benefic owning kendra (becomes functional malefic)
  const kendraLords: { planetId: number; house: number }[] = [];
  for (const h of [1, 4, 7, 10]) {
    const lordId = getHouseLord(h, ascSign);
    if (isBenefic(lordId)) {
      kendraLords.push({ planetId: lordId, house: h });
    }
  }
  const kendradhipatiPresent = kendraLords.length >= 2;
  doshas.push({
    name: t(locale, 'Kendradhipati Dosha', 'केन्द्राधिपति दोष', 'केन्द्राधिपतिदोषः'),
    present: kendradhipatiPresent,
    severity: kendradhipatiPresent ? 'mild' : 'none',
    description: kendradhipatiPresent
      ? t(locale,
          `Natural benefics (${kendraLords.map(k => planets.find(p => p.planet.id === k.planetId)?.planet.name.en || '').join(', ')}) own Kendra houses, becoming functional malefics for this ascendant. Their benefic nature is weakened when they govern angular houses. (Phaladeepika)`,
          `प्राकृतिक शुभ ग्रह (${kendraLords.map(k => planets.find(p => p.planet.id === k.planetId)?.planet.name.hi || '').join(', ')}) केन्द्र भावों के स्वामी हैं, इस लग्न के लिए कार्यात्मक पापी बनते हैं। (फलदीपिका)`)
      : t(locale, 'Kendradhipati Dosha is minimal — benefics maintain their positive nature for this ascendant.', 'केन्द्राधिपति दोष न्यूनतम — शुभ ग्रह इस लग्न के लिए सकारात्मक प्रकृति बनाए रखते हैं।'),
    remedies: kendradhipatiPresent
      ? t(locale,
          'Remedies: 1) Strengthen the benefic planet with its gemstone. 2) Perform Graha Shanti Puja for the affected planet. 3) Mantra chanting of the affected benefic. This dosha is generally mild.',
          'उपाय: 1) शुभ ग्रह को उसके रत्न से मजबूत करें। 2) प्रभावित ग्रह की ग्रह शान्ति पूजा। 3) प्रभावित शुभ ग्रह का मन्त्र जप। यह दोष सामान्यतः हल्का है।')
      : '',
  });

  // --- Daridra Dosha ---
  // 11th lord in dusthana (6, 8, 12)
  const lord11Id = getHouseLord(11, ascSign);
  const lord11 = getP(planets, lord11Id);
  const daridraPresent = !!(lord11 && isDusthana(lord11.house));
  doshas.push({
    name: t(locale, 'Daridra Dosha', 'दरिद्र दोष', 'दरिद्रदोषः'),
    present: daridraPresent,
    severity: daridraPresent ? (lord11?.house === 8 ? 'moderate' : 'mild') : 'none',
    description: daridraPresent
      ? t(locale,
          `Lord of 11th house (gains) placed in house ${lord11!.house} (dusthana). Income faces obstacles, delays, or comes through unconventional means. Financial growth requires extra effort. May gain through service, healing, or foreign sources.`,
          `11वें भाव (लाभ) का स्वामी ${lord11!.house}वें भाव (दुःस्थान) में। आय में बाधाएँ, विलम्ब या अपरम्परागत साधन। आर्थिक विकास में अतिरिक्त प्रयास। सेवा, उपचार या विदेशी स्रोतों से लाभ सम्भव।`)
      : t(locale, 'No Daridra Dosha. The 11th lord is well-placed for gains and fulfillment of desires.', 'दरिद्र दोष नहीं। 11वें भाव का स्वामी लाभ और इच्छापूर्ति के लिए शुभ स्थिति में।'),
    remedies: daridraPresent
      ? t(locale,
          'Remedies: 1) Strengthen the 11th lord with its gemstone. 2) Donate on the day ruled by the 11th lord. 3) Chant Lakshmi Mantra on Fridays. 4) Feed the poor regularly. 5) Plant fruit trees.',
          'उपाय: 1) 11वें भाव के स्वामी को रत्न से मजबूत करें। 2) 11वें स्वामी के दिन दान। 3) शुक्रवार को लक्ष्मी मन्त्र जप। 4) नियमित रूप से गरीबों को भोजन। 5) फलदार वृक्ष लगाएँ।')
      : '',
  });

  // --- Kemdrum Dosha ---
  // No planets in 2nd or 12th from Moon
  if (moon) {
    const adj2 = (moon.house % 12) + 1;
    const adj12 = ((moon.house - 2 + 12) % 12) + 1;
    const nearMoon = planets.filter(p =>
      p.planet.id !== 1 && ![7, 8].includes(p.planet.id) &&
      (p.house === adj2 || p.house === adj12)
    );
    const kemdrumPresent = nearMoon.length === 0;
    // Cancellation checks
    const kemdrumCancelled = kemdrumPresent && (
      isKendra(moon.house) || // Moon in kendra cancels
      (jup && isKendra(houseDistance(moon.house, jup.house))) // Jupiter aspects Moon
    );
    doshas.push({
      name: t(locale, 'Kemdrum Dosha', 'केमद्रुम दोष', 'केमद्रुमदोषः'),
      present: kemdrumPresent && !kemdrumCancelled,
      severity: kemdrumPresent && !kemdrumCancelled ? 'mild' : 'none',
      description: kemdrumPresent
        ? kemdrumCancelled
          ? t(locale,
              'Kemdrum Dosha is present but cancelled — Moon is in Kendra or aspected by Jupiter. Emotional isolation is mitigated.',
              'केमद्रुम दोष उपस्थित पर रद्द — चन्द्रमा केन्द्र में या बृहस्पति की दृष्टि में। भावनात्मक एकांत कम।')
          : t(locale,
              'No planets adjacent to Moon. May experience periods of emotional isolation, financial difficulty, and feeling unsupported. Self-reliance develops through necessity. (BPHS)',
              'चन्द्रमा के निकट कोई ग्रह नहीं। भावनात्मक एकांत, आर्थिक कठिनाई और असमर्थित महसूस करने के काल। आवश्यकता से आत्मनिर्भरता विकसित। (BPHS)')
        : t(locale, 'No Kemdrum Dosha. Moon is well-supported by adjacent planets.', 'केमद्रुम दोष नहीं। चन्द्रमा निकटवर्ती ग्रहों से सुसमर्थित।'),
      remedies: kemdrumPresent && !kemdrumCancelled
        ? t(locale,
            'Remedies: 1) Wear Pearl on Monday. 2) Chant Moon Beej Mantra (Om Shraam Shreem Shraum Sah Chandraya Namah). 3) Offer milk to Shivalinga on Mondays. 4) Keep fast on Mondays. 5) Donate white items.',
            'उपाय: 1) सोमवार को मोती धारण। 2) चन्द्र बीज मन्त्र जप। 3) सोमवार को शिवलिंग पर दूध अर्पण। 4) सोमवार व्रत। 5) सफेद वस्तुएँ दान।')
        : '',
    });
  }

  // --- Shani Dosha (Sade Sati indicator) ---
  // Saturn's position relative to Moon sign — transit effect but natal indicator
  if (sat && moon) {
    const satFromMoon = houseDistance(moon.house, sat.house);
    const sadeSatiNatal = [12, 1, 2].includes(satFromMoon);
    doshas.push({
      name: t(locale, 'Shani Dosha (Natal Sade Sati)', 'शनि दोष (जन्म साढ़ेसाती)', 'शनिदोषः'),
      present: sadeSatiNatal,
      severity: sadeSatiNatal ? 'mild' : 'none',
      description: sadeSatiNatal
        ? t(locale,
            `Saturn is in ${satFromMoon === 12 ? '12th' : satFromMoon === 1 ? '1st' : '2nd'} house from Moon natally. This natal position mirrors Sade Sati themes — emotional discipline, karmic lessons through challenges, and slow but profound transformation. The native learns patience early in life.`,
            `शनि जन्म से चन्द्रमा से ${satFromMoon === 12 ? '12वें' : satFromMoon === 1 ? 'प्रथम' : '2वें'} भाव में। यह जन्मस्थिति साढ़ेसाती विषयों को दर्शाती है — भावनात्मक अनुशासन, चुनौतियों से कार्मिक पाठ।`)
        : t(locale, 'Saturn is well-placed from Moon — Sade Sati themes are not prominent natally.', 'शनि चन्द्रमा से शुभ स्थिति में — साढ़ेसाती विषय जन्म से प्रमुख नहीं।'),
      remedies: sadeSatiNatal
        ? t(locale,
            'Remedies: 1) Chant Hanuman Chalisa on Saturdays. 2) Donate black sesame and mustard oil. 3) Light mustard oil lamp under Peepal tree on Saturdays. 4) Serve elderly. 5) Wear Blue Sapphire after careful trial.',
            'उपाय: 1) शनिवार को हनुमान चालीसा पाठ। 2) काले तिल और सरसों तेल दान। 3) शनिवार को पीपल वृक्ष के नीचे सरसों तेल का दीपक। 4) बुजुर्गों की सेवा। 5) सावधानीपूर्ण परीक्षण के बाद नीलम धारण।')
        : '',
    });
  }

  return doshas;
}
