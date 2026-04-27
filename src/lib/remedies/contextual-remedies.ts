/**
 * Contextual Remedy Engine
 *
 * Maps specific chart afflictions to specific remedy combinations.
 * Unlike the gemstone engine (per-planet scoring), this detects
 * composite conditions (doshas, house afflictions, dasha difficulties)
 * and prescribes targeted multi-remedy protocols.
 *
 * References: BPHS Ch.83-84, Phaladeepika, Uttara Kalamrita
 */

import type { LocaleText } from '@/types/panchang';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RemedyAction {
  type: 'mantra' | 'gemstone' | 'charity' | 'fasting' | 'puja' | 'lifestyle' | 'yantra';
  title: LocaleText;
  description: LocaleText;
  frequency?: string;   // "daily", "weekly on Saturday", "once"
  planetId?: number;    // Which planet this remedy strengthens/pacifies
}

export interface ContextualRemedy {
  affliction: string;           // Machine-readable key
  afflictionName: LocaleText;   // Human-readable name
  severity: 'mild' | 'moderate' | 'severe';
  explanation: LocaleText;      // Why this is present in the chart
  remedies: RemedyAction[];     // 3-5 specific remedies ranked by effectiveness
}

export interface RemedyReport {
  afflictions: ContextualRemedy[];
  priorityOrder: string[];      // Affliction keys sorted by severity
  summary: LocaleText;          // 2-3 sentence overview
}

// ─── Input types ────────────────────────────────────────────────────────────

interface PlanetInput {
  id: number;
  longitude: number;
  sign: number;       // 1-12
  house: number;      // 1-12
  isRetrograde: boolean;
  isDebilitated: boolean;
  isCombust: boolean;
}

interface YogaInput {
  name: string;
  present: boolean;
  type?: string;
}

interface DashaInput {
  planet: string;
  startDate: string;
  endDate: string;
}

interface RemedyParams {
  planets: PlanetInput[];
  ascendantSign: number;  // 1-12
  yogas?: YogaInput[];
  dashas?: DashaInput[];
  sadeSatiPhase?: string | null;
}

// ─── Constants ──────────────────────────────────────────────────────────────

/** Sign lord mapping: sign (1-12) -> planet id (0-8) */
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

const DUSTHANA = new Set([6, 8, 12]);
const MANGAL_DOSHA_HOUSES = new Set([1, 2, 4, 7, 8, 12]);

/** Planet names in en/hi for remedy text */
const PLANET_NAMES: Record<number, LocaleText> = {
  0: { en: 'Sun', hi: 'सूर्य' },
  1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' },
  3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'बृहस्पति' },
  5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' },
  7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

/** Day of the week associated with each planet */
const PLANET_DAY: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Saturday', 8: 'Tuesday',
};

/** Charity items per planet (classical prescriptions) */
const PLANET_CHARITY: Record<number, LocaleText> = {
  0: { en: 'Wheat, jaggery, or copper', hi: 'गेहूं, गुड़ या तांबा' },
  1: { en: 'Rice, white cloth, or silver', hi: 'चावल, सफ़ेद कपड़ा या चांदी' },
  2: { en: 'Red lentils (masoor), red cloth, or copper', hi: 'मसूर दाल, लाल कपड़ा या तांबा' },
  3: { en: 'Green moong dal, green cloth, or bangles', hi: 'मूंग दाल, हरा कपड़ा या चूड़ियां' },
  4: { en: 'Chana dal, turmeric, yellow cloth, or books', hi: 'चना दाल, हल्दी, पीला कपड़ा या पुस्तकें' },
  5: { en: 'White rice, ghee, white silk, or perfume', hi: 'सफ़ेद चावल, घी, सफ़ेद रेशम या इत्र' },
  6: { en: 'Black sesame, mustard oil, iron, or dark blankets', hi: 'काले तिल, सरसों का तेल, लोहा या काले कम्बल' },
  7: { en: 'Black sesame, coconut, or dark blue cloth', hi: 'काले तिल, नारियल या गहरा नीला कपड़ा' },
  8: { en: 'Sesame seeds, brown blanket, or dog food', hi: 'तिल, भूरा कम्बल या कुत्ते का भोजन' },
};

/** Navagraha Stotra beej mantras per planet */
const PLANET_MANTRA: Record<number, LocaleText> = {
  0: { en: 'Om Hraam Hreem Hraum Sah Suryaya Namah — recite 7000 times', hi: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः — 7000 बार जप करें' },
  1: { en: 'Om Shraam Shreem Shraum Sah Chandraya Namah — recite 11000 times', hi: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः — 11000 बार जप करें' },
  2: { en: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah — recite 10000 times', hi: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः — 10000 बार जप करें' },
  3: { en: 'Om Braam Breem Braum Sah Budhaya Namah — recite 9000 times', hi: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः — 9000 बार जप करें' },
  4: { en: 'Om Graam Greem Graum Sah Gurave Namah — recite 19000 times', hi: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः — 19000 बार जप करें' },
  5: { en: 'Om Draam Dreem Draum Sah Shukraya Namah — recite 16000 times', hi: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः — 16000 बार जप करें' },
  6: { en: 'Om Praam Preem Praum Sah Shanaischaraya Namah — recite 23000 times', hi: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः — 23000 बार जप करें' },
  7: { en: 'Om Bhraam Bhreem Bhraum Sah Rahave Namah — recite 18000 times', hi: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः — 18000 बार जप करें' },
  8: { en: 'Om Sraam Sreem Sraum Sah Ketave Namah — recite 17000 times', hi: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः — 17000 बार जप करें' },
};

/** Gemstone names per planet */
const PLANET_GEMSTONE: Record<number, LocaleText> = {
  0: { en: 'Ruby (Manik)', hi: 'माणिक्य (माणिक)' },
  1: { en: 'Pearl (Moti)', hi: 'मोती' },
  2: { en: 'Red Coral (Moonga)', hi: 'मूंगा' },
  3: { en: 'Emerald (Panna)', hi: 'पन्ना' },
  4: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज' },
  5: { en: 'Diamond or White Sapphire (Heera)', hi: 'हीरा या सफ़ेद नीलम' },
  6: { en: 'Blue Sapphire (Neelam)', hi: 'नीलम' },
  7: { en: 'Hessonite Garnet (Gomed)', hi: 'गोमेद' },
  8: { en: 'Cat\'s Eye (Lehsunia)', hi: 'लहसुनिया' },
};

/** Deity associated with lagna sign — for lagna lord remedies */
const SIGN_DEITY: Record<number, LocaleText> = {
  1:  { en: 'Lord Hanuman or Kartikeya', hi: 'हनुमान जी या कार्तिकेय' },
  2:  { en: 'Goddess Lakshmi', hi: 'देवी लक्ष्मी' },
  3:  { en: 'Lord Vishnu', hi: 'भगवान विष्णु' },
  4:  { en: 'Goddess Durga or Chandi', hi: 'देवी दुर्गा या चण्डी' },
  5:  { en: 'Lord Surya (Sun God)', hi: 'भगवान सूर्य' },
  6:  { en: 'Lord Vishnu or Saraswati', hi: 'भगवान विष्णु या सरस्वती' },
  7:  { en: 'Goddess Lakshmi or Mahalakshmi', hi: 'देवी लक्ष्मी या महालक्ष्मी' },
  8:  { en: 'Lord Shiva or Bhairava', hi: 'भगवान शिव या भैरव' },
  9:  { en: 'Lord Dakshinamurthy or Brihaspati', hi: 'दक्षिणामूर्ति या बृहस्पति देव' },
  10: { en: 'Lord Shani Dev or Hanuman', hi: 'शनि देव या हनुमान जी' },
  11: { en: 'Lord Shani Dev', hi: 'शनि देव' },
  12: { en: 'Lord Vishnu or Matsya Avatar', hi: 'भगवान विष्णु या मत्स्य अवतार' },
};

/** Yoga karaka planets per ascendant (simplified — Saturn is yogakaraka for Taurus & Libra) */
const YOGA_KARAKA_SATURN: Set<number> = new Set([2, 7]); // Taurus (2) and Libra (7)

// ─── Severity scoring ───────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<string, number> = { severe: 3, moderate: 2, mild: 1 };

// ─── Main engine ────────────────────────────────────────────────────────────

export function generateRemedyReport(params: RemedyParams): RemedyReport {
  const afflictions: ContextualRemedy[] = [];
  const { planets, ascendantSign } = params;

  const findPlanet = (id: number) => planets.find(p => p.id === id);
  const lagnaLordId = SIGN_LORD[ascendantSign];

  // --- 1. Mangal Dosha ---
  const mars = findPlanet(2);
  if (mars && MANGAL_DOSHA_HOUSES.has(mars.house)) {
    afflictions.push(buildMangalDosha(mars));
  }

  // --- 2. Sade Sati ---
  if (params.sadeSatiPhase) {
    afflictions.push(buildSadeSati(params.sadeSatiPhase, ascendantSign));
  }

  // --- 3. Kala Sarpa ---
  const kalaSarpa = detectKalaSarpa(planets);
  if (kalaSarpa) {
    afflictions.push(buildKalaSarpa());
  }

  // --- 4. Debilitated planets ---
  for (const p of planets) {
    if (p.isDebilitated) {
      afflictions.push(buildDebilitatedPlanet(p, ascendantSign));
    }
  }

  // --- 5. Combust planets ---
  for (const p of planets) {
    // Sun cannot be combust. Rahu/Ketu have no combustion.
    if (p.isCombust && p.id !== 0 && p.id !== 7 && p.id !== 8) {
      afflictions.push(buildCombustPlanet(p));
    }
  }

  // --- 6. Weak lagna lord ---
  const lagnaLord = findPlanet(lagnaLordId);
  if (lagnaLord && isLagnaLordWeak(lagnaLord)) {
    afflictions.push(buildWeakLagnaLord(lagnaLord, ascendantSign));
  }

  // --- 7. 7th house affliction (marriage delay) ---
  const seventhAffliction = detect7thHouseAffliction(planets, ascendantSign);
  if (seventhAffliction) {
    afflictions.push(seventhAffliction);
  }

  // --- 8. 10th house affliction (career) ---
  const tenthAffliction = detect10thHouseAffliction(planets, ascendantSign);
  if (tenthAffliction) {
    afflictions.push(tenthAffliction);
  }

  // --- 9. Current dasha difficulty ---
  if (params.dashas && params.dashas.length > 0) {
    const dashaAffliction = detectDashaDifficulty(params.dashas, planets, ascendantSign);
    if (dashaAffliction) {
      afflictions.push(dashaAffliction);
    }
  }

  // --- 10. Pitru Dosha ---
  const pitruDosha = detectPitruDosha(planets);
  if (pitruDosha) {
    afflictions.push(pitruDosha);
  }

  // Sort by severity: severe first
  afflictions.sort((a, b) => (SEVERITY_ORDER[b.severity] ?? 0) - (SEVERITY_ORDER[a.severity] ?? 0));

  const priorityOrder = afflictions.map(a => a.affliction);

  return {
    afflictions,
    priorityOrder,
    summary: buildSummary(afflictions),
  };
}

// ─── Affliction builders ────────────────────────────────────────────────────

function buildMangalDosha(mars: PlanetInput): ContextualRemedy {
  const houseLabel = ordinal(mars.house);
  // Severity: 7th/8th are severe, 1st/4th moderate, 2nd/12th mild
  const severe78 = mars.house === 7 || mars.house === 8;
  const moderate14 = mars.house === 1 || mars.house === 4;
  const severity: ContextualRemedy['severity'] = severe78 ? 'severe' : moderate14 ? 'moderate' : 'mild';

  return {
    affliction: 'mangal_dosha',
    afflictionName: { en: 'Mangal Dosha (Kuja Dosha)', hi: 'मंगल दोष (कुज दोष)' },
    severity,
    explanation: {
      en: `Mars is placed in the ${houseLabel} house from the ascendant. This creates Mangal Dosha, which can cause friction in marital relationships, delay in marriage, or temperamental conflicts with the spouse.`,
      hi: `मंगल लग्न से ${houseLabel} भाव में स्थित है। इससे मंगल दोष बनता है, जो वैवाहिक संबंधों में तनाव, विवाह में देरी, या जीवनसाथी के साथ स्वभाव संघर्ष का कारण बन सकता है।`,
    },
    remedies: [
      {
        type: 'mantra',
        title: { en: 'Hanuman Chalisa', hi: 'हनुमान चालीसा' },
        description: {
          en: 'Recite Hanuman Chalisa daily, preferably on Tuesdays. Hanuman is the presiding deity for Mars pacification.',
          hi: 'प्रतिदिन हनुमान चालीसा का पाठ करें, विशेषकर मंगलवार को। हनुमान जी मंगल शान्ति के अधिष्ठाता देवता हैं।',
        },
        frequency: 'daily',
        planetId: 2,
      },
      {
        type: 'gemstone',
        title: { en: 'Red Coral (Moonga)', hi: 'मूंगा' },
        description: {
          en: 'Wear a natural red coral (5-7 carats) in a gold or copper ring on the ring finger of the right hand. Activate on Tuesday during Mars hora.',
          hi: 'दाहिने हाथ की अनामिका में सोने या तांबे की अंगूठी में प्राकृतिक मूंगा (5-7 रत्ती) धारण करें। मंगलवार को मंगल होरा में अभिमंत्रित करें।',
        },
        frequency: 'once',
        planetId: 2,
      },
      {
        type: 'fasting',
        title: { en: 'Tuesday Fasting', hi: 'मंगलवार व्रत' },
        description: {
          en: 'Observe a fast on Tuesdays for at least 21 consecutive weeks. Consume only fruits and milk. Visit a Hanuman temple.',
          hi: 'कम से कम 21 लगातार मंगलवार व्रत रखें। केवल फल और दूध लें। हनुमान मंदिर जाएं।',
        },
        frequency: 'weekly on Tuesday',
        planetId: 2,
      },
      {
        type: 'puja',
        title: { en: 'Mangal Shanti Puja', hi: 'मंगल शान्ति पूजा' },
        description: {
          en: 'Perform Mangal Shanti Puja (Navagraha Homa with emphasis on Mars) at a temple. This is especially recommended before marriage.',
          hi: 'मंदिर में मंगल शान्ति पूजा (मंगल ग्रह पर विशेष ज़ोर के साथ नवग्रह हवन) करवाएं। विवाह से पहले विशेष रूप से अनुशंसित।',
        },
        frequency: 'once',
        planetId: 2,
      },
      {
        type: 'lifestyle',
        title: { en: 'Marriage Compatibility', hi: 'विवाह अनुकूलता' },
        description: {
          en: 'Classical texts recommend marriage after age 28 or matching with another Manglik person. Both conditions cancel the dosha\'s negative effects on marriage.',
          hi: 'शास्त्रों में 28 वर्ष की आयु के बाद विवाह या किसी अन्य मांगलिक व्यक्ति से विवाह का सुझाव दिया गया है। दोनों स्थितियां दोष के नकारात्मक प्रभाव को निष्प्रभावी करती हैं।',
        },
        planetId: 2,
      },
    ],
  };
}

function buildSadeSati(phase: string, ascendantSign: number): ContextualRemedy {
  const isPeak = phase === 'peak';
  const severity: ContextualRemedy['severity'] = isPeak ? 'severe' : 'moderate';
  const phaseLabel = phase === 'rising' ? 'rising (pre-peak)' : phase === 'peak' ? 'peak' : 'setting (post-peak)';
  const phaseHi = phase === 'rising' ? 'उदय (पूर्व-चरम)' : phase === 'peak' ? 'चरम' : 'अस्त (उत्तर-चरम)';

  // Saturn is yoga karaka for Taurus and Libra ascendants — effects are mixed, not purely negative
  const isYogaKaraka = YOGA_KARAKA_SATURN.has(ascendantSign);

  return {
    affliction: 'sade_sati',
    afflictionName: { en: 'Sade Sati (Saturn\'s 7.5-year transit)', hi: 'साढ़ेसाती (शनि की साढ़ेसाती)' },
    severity,
    explanation: {
      en: `You are in the ${phaseLabel} phase of Sade Sati. Saturn is transiting over your natal Moon, creating a period of karmic lessons, delays, and restructuring in life.${isYogaKaraka ? ' However, Saturn is a yoga karaka for your ascendant — effects may be mixed with career gains.' : ''}`,
      hi: `आप साढ़ेसाती के ${phaseHi} चरण में हैं। शनि आपके जन्म चन्द्रमा पर गोचर कर रहा है, जो जीवन में कर्मिक सबक, देरी और पुनर्गठन का समय लाता है।${isYogaKaraka ? ' हालांकि, शनि आपके लग्न के लिए योगकारक है — करियर लाभ के साथ मिश्रित प्रभाव हो सकते हैं।' : ''}`,
    },
    remedies: [
      {
        type: 'mantra',
        title: { en: 'Shani Stotra / Dashrath Krit Shani Stotra', hi: 'शनि स्तोत्र / दशरथ कृत शनि स्तोत्र' },
        description: {
          en: 'Recite the Shani Stotra or Dashrath Krit Shani Stotra every Saturday. The latter is considered especially powerful for Sade Sati relief.',
          hi: 'प्रत्येक शनिवार शनि स्तोत्र या दशरथ कृत शनि स्तोत्र का पाठ करें। दशरथ कृत स्तोत्र साढ़ेसाती शान्ति के लिए विशेष प्रभावी माना जाता है।',
        },
        frequency: 'weekly on Saturday',
        planetId: 6,
      },
      ...(isYogaKaraka ? [{
        type: 'gemstone' as const,
        title: { en: 'Blue Sapphire (Neelam) — with trial', hi: 'नीलम — परीक्षण सहित' },
        description: {
          en: 'Since Saturn is yoga karaka for your ascendant, Blue Sapphire may be beneficial. Wear for a 3-day trial period first. Remove immediately if adverse effects occur. Consult a jyotishi.',
          hi: 'चूंकि शनि आपके लग्न के लिए योगकारक है, नीलम लाभकारी हो सकता है। पहले 3 दिन परीक्षण करें। प्रतिकूल प्रभाव होने पर तुरन्त हटा दें। किसी ज्योतिषी से परामर्श लें।',
        },
        frequency: 'once',
        planetId: 6,
      }] : []),
      {
        type: 'charity',
        title: { en: 'Saturday Oil Donation', hi: 'शनिवार तेल दान' },
        description: {
          en: 'Donate mustard oil, black sesame seeds, dark blankets, or iron items on Saturdays. Pour mustard oil over a Shani idol at a temple.',
          hi: 'शनिवार को सरसों का तेल, काले तिल, काले कम्बल या लोहे की वस्तुएं दान करें। मंदिर में शनि मूर्ति पर सरसों का तेल अर्पित करें।',
        },
        frequency: 'weekly on Saturday',
        planetId: 6,
      },
      {
        type: 'lifestyle',
        title: { en: 'Iron Ring (Shani Ring)', hi: 'लोहे की अंगूठी (शनि अंगूठी)' },
        description: {
          en: 'Wear a ring made from a horseshoe nail or black iron on the middle finger of the right hand. This is a traditional low-risk Saturn remedy.',
          hi: 'दाहिने हाथ की मध्यमा अंगुली में घोड़े की नाल की कील या काले लोहे की अंगूठी धारण करें। यह एक पारम्परिक कम-जोखिम शनि उपाय है।',
        },
        frequency: 'once',
        planetId: 6,
      },
      ...(isPeak ? [{
        type: 'lifestyle' as const,
        title: { en: 'Avoid New Ventures During Peak', hi: 'चरम चरण में नए कार्य न करें' },
        description: {
          en: 'During the peak phase of Sade Sati, avoid starting new business ventures, major investments, or risky decisions. Focus on consolidation and patience. This phase will pass.',
          hi: 'साढ़ेसाती के चरम चरण में नया व्यापार, बड़ा निवेश या जोखिम भरे निर्णय न लें। धैर्य और स्थिरता पर ध्यान दें। यह चरण गुज़र जाएगा।',
        },
        planetId: 6,
      }] : []),
    ],
  };
}

function buildKalaSarpa(): ContextualRemedy {
  return {
    affliction: 'kala_sarpa',
    afflictionName: { en: 'Kala Sarpa Dosha', hi: 'कालसर्प दोष' },
    severity: 'severe',
    explanation: {
      en: 'All seven planets (Sun through Saturn) are hemmed between Rahu and Ketu. This creates Kala Sarpa Dosha, which can cause sudden reversals, hidden obstacles, and a sense of being trapped by circumstances beyond one\'s control.',
      hi: 'सातों ग्रह (सूर्य से शनि तक) राहु और केतु के बीच स्थित हैं। इससे कालसर्प दोष बनता है, जो अचानक उलटफेर, छिपी बाधाएं, और नियंत्रण से परे परिस्थितियों में फंसे होने की भावना उत्पन्न कर सकता है।',
    },
    remedies: [
      {
        type: 'puja',
        title: { en: 'Kala Sarpa Shanti Puja', hi: 'कालसर्प शान्ति पूजा' },
        description: {
          en: 'Perform the Kala Sarpa Shanti Puja at Trimbakeshwar (Nashik) or any Naga temple. This is the primary remedy and is traditionally performed once in a lifetime.',
          hi: 'त्र्यम्बकेश्वर (नासिक) या किसी भी नाग मंदिर में कालसर्प शान्ति पूजा करवाएं। यह प्रमुख उपाय है और परम्परागत रूप से जीवन में एक बार किया जाता है।',
        },
        frequency: 'once',
        planetId: 7,
      },
      {
        type: 'mantra',
        title: { en: 'Rahu Beej Mantra', hi: 'राहु बीज मंत्र' },
        description: {
          en: 'Recite "Om Bhraam Bhreem Bhraum Sah Rahave Namah" 18,000 times over 40 days (450/day). Begin on a Saturday during Rahu Kaal for maximum effect.',
          hi: '"ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः" 40 दिनों में 18,000 बार (450/दिन) जप करें। अधिकतम प्रभाव के लिए शनिवार राहुकाल में आरम्भ करें।',
        },
        frequency: 'daily',
        planetId: 7,
      },
      {
        type: 'charity',
        title: { en: 'Black Sesame Donation', hi: 'काले तिल दान' },
        description: {
          en: 'Donate black sesame seeds (til) on Saturdays. Also donate coconut and dark blue or black cloth to the needy.',
          hi: 'शनिवार को काले तिल दान करें। इसके साथ नारियल और गहरा नीला या काला कपड़ा भी ज़रूरतमंदों को दान करें।',
        },
        frequency: 'weekly on Saturday',
        planetId: 7,
      },
      {
        type: 'puja',
        title: { en: 'Naag Panchami Observance', hi: 'नाग पंचमी व्रत' },
        description: {
          en: 'Observe Naag Panchami (Shravan Shukla Panchami) with special devotion. Worship the Naga deity, offer milk to a snake idol, and perform abhishekam.',
          hi: 'नाग पंचमी (श्रावण शुक्ल पंचमी) विशेष भक्ति से मनाएं। नाग देवता की पूजा करें, सर्प मूर्ति पर दूध अर्पित करें और अभिषेक करें।',
        },
        frequency: 'yearly',
        planetId: 7,
      },
      {
        type: 'yantra',
        title: { en: 'Kala Sarpa Yantra', hi: 'कालसर्प यंत्र' },
        description: {
          en: 'Install a Kala Sarpa Yantra in your puja room after proper energization (pranpratishtha). Worship it regularly with incense and lamp.',
          hi: 'उचित प्राणप्रतिष्ठा के बाद अपने पूजा कक्ष में कालसर्प यंत्र स्थापित करें। नियमित रूप से धूप और दीप से पूजा करें।',
        },
        frequency: 'once',
        planetId: 7,
      },
    ],
  };
}

function buildDebilitatedPlanet(planet: PlanetInput, ascendantSign: number): ContextualRemedy {
  const pid = planet.id;
  const name = PLANET_NAMES[pid] ?? { en: `Planet ${pid}`, hi: `ग्रह ${pid}` };
  const lagnaLordId = SIGN_LORD[ascendantSign];

  // Check for Neechabhanga (cancellation of debilitation)
  // Simplified: lord of the sign where the planet is debilitated is in a kendra from lagna or Moon
  const neechabhangaNote = {
    en: ' Check if Neechabhanga Raja Yoga applies — if so, the debilitation is partially cancelled and remedies may be less urgent.',
    hi: ' जांचें कि क्या नीचभंग राजयोग लागू है — यदि हां, तो नीच अंशतः निष्प्रभावी है और उपायों की तत्काल आवश्यकता कम हो सकती है।',
  };

  // Only recommend gemstone if the planet is a functional benefic (lagna lord, trikona lord, etc.)
  // Simplified check: is it the lagna lord?
  const isFunctionalBenefic = pid === lagnaLordId;

  const remedies: RemedyAction[] = [
    {
      type: 'mantra',
      title: {
        en: `${name.en} Navagraha Mantra`,
        hi: `${name.hi} नवग्रह मंत्र`,
      },
      description: PLANET_MANTRA[pid] ?? { en: 'Recite the Navagraha Stotra daily', hi: 'प्रतिदिन नवग्रह स्तोत्र का पाठ करें' },
      frequency: 'daily',
      planetId: pid,
    },
    {
      type: 'charity',
      title: {
        en: `${name.en} Charity (${PLANET_DAY[pid]})`,
        hi: `${name.hi} दान (${PLANET_DAY[pid]})`,
      },
      description: {
        en: `Donate ${(PLANET_CHARITY[pid] ?? { en: 'items associated with this planet' }).en} on ${PLANET_DAY[pid]}s.`,
        hi: `${PLANET_DAY[pid]} को ${(PLANET_CHARITY[pid] ?? { hi: 'इस ग्रह से सम्बंधित वस्तुएं' }).hi} दान करें।`,
      },
      frequency: `weekly on ${PLANET_DAY[pid]}`,
      planetId: pid,
    },
    {
      type: 'fasting',
      title: {
        en: `${PLANET_DAY[pid]} Fasting`,
        hi: `${PLANET_DAY[pid]} व्रत`,
      },
      description: {
        en: `Observe a fast on ${PLANET_DAY[pid]}s for strengthening ${name.en}. Continue for at least 21 weeks.`,
        hi: `${name.hi} को सुदृढ़ करने के लिए ${PLANET_DAY[pid]} को व्रत रखें। कम से कम 21 सप्ताह तक जारी रखें।`,
      },
      frequency: `weekly on ${PLANET_DAY[pid]}`,
      planetId: pid,
    },
  ];

  if (isFunctionalBenefic) {
    remedies.push({
      type: 'gemstone',
      title: {
        en: `${(PLANET_GEMSTONE[pid] ?? { en: 'Gemstone' }).en} — Cautiously`,
        hi: `${(PLANET_GEMSTONE[pid] ?? { hi: 'रत्न' }).hi} — सावधानी से`,
      },
      description: {
        en: `${name.en} is your lagna lord and debilitated — wearing ${(PLANET_GEMSTONE[pid] ?? { en: 'its gemstone' }).en} can strengthen it. Consult a jyotishi for carat weight and activation.`,
        hi: `${name.hi} आपका लग्नेश है और नीच है — ${(PLANET_GEMSTONE[pid] ?? { hi: 'इसका रत्न' }).hi} धारण करने से यह सुदृढ़ हो सकता है। रत्ती और अभिमंत्रण के लिए किसी ज्योतिषी से परामर्श लें।`,
      },
      frequency: 'once',
      planetId: pid,
    });
  }

  return {
    affliction: `debilitated_${pid}`,
    afflictionName: {
      en: `Debilitated ${name.en} (Neecha)`,
      hi: `नीच ${name.hi}`,
    },
    severity: pid === lagnaLordId ? 'severe' : 'moderate',
    explanation: {
      en: `${name.en} is debilitated (in its weakest sign), reducing its ability to deliver positive results for the houses it rules and occupies.${neechabhangaNote.en}`,
      hi: `${name.hi} नीच राशि में है (सबसे कमज़ोर स्थिति), जिससे यह अपने अधिकार वाले और स्थित भावों के शुभ फल देने में कमज़ोर हो जाता है।${neechabhangaNote.hi}`,
    },
    remedies,
  };
}

function buildCombustPlanet(planet: PlanetInput): ContextualRemedy {
  const pid = planet.id;
  const name = PLANET_NAMES[pid] ?? { en: `Planet ${pid}`, hi: `ग्रह ${pid}` };

  return {
    affliction: `combust_${pid}`,
    afflictionName: {
      en: `Combust ${name.en} (Asta)`,
      hi: `अस्त ${name.hi}`,
    },
    severity: 'mild',
    explanation: {
      en: `${name.en} is too close to the Sun and has become combust (asta). Its significations — the areas of life it governs — become weakened as the Sun's brilliance overpowers it.`,
      hi: `${name.hi} सूर्य के अत्यंत निकट है और अस्त हो गया है। इसके कारकत्व — जीवन के वे क्षेत्र जिन पर इसका अधिकार है — कमज़ोर हो जाते हैं क्योंकि सूर्य का तेज इसे ढक लेता है।`,
    },
    remedies: [
      {
        type: 'charity',
        title: {
          en: `${name.en} Charity on ${PLANET_DAY[pid]}`,
          hi: `${PLANET_DAY[pid]} को ${name.hi} दान`,
        },
        description: {
          en: `Donate ${(PLANET_CHARITY[pid] ?? { en: 'items associated with this planet' }).en} on ${PLANET_DAY[pid]}s to strengthen the combust planet.`,
          hi: `अस्त ग्रह को सुदृढ़ करने के लिए ${PLANET_DAY[pid]} को ${(PLANET_CHARITY[pid] ?? { hi: 'इस ग्रह से सम्बंधित वस्तुएं' }).hi} दान करें।`,
        },
        frequency: `weekly on ${PLANET_DAY[pid]}`,
        planetId: pid,
      },
      {
        type: 'lifestyle',
        title: { en: 'Surya Namaskar', hi: 'सूर्य नमस्कार' },
        description: {
          en: 'Practice 12 rounds of Surya Namaskar at sunrise. This harmonizes the relationship between the combust planet and the Sun, reducing friction.',
          hi: 'सूर्योदय के समय सूर्य नमस्कार के 12 चक्र करें। इससे अस्त ग्रह और सूर्य के बीच सामंजस्य बनता है और घर्षण कम होता है।',
        },
        frequency: 'daily',
        planetId: 0,
      },
      {
        type: 'gemstone',
        title: {
          en: `${(PLANET_GEMSTONE[pid] ?? { en: 'Gemstone' }).en} (not Ruby)`,
          hi: `${(PLANET_GEMSTONE[pid] ?? { hi: 'रत्न' }).hi} (माणिक्य नहीं)`,
        },
        description: {
          en: `Wear the gemstone of the combust planet (${(PLANET_GEMSTONE[pid] ?? { en: 'its gemstone' }).en}), NOT the Sun's ruby. Strengthening the Sun would further overpower the combust planet.`,
          hi: `अस्त ग्रह का रत्न (${(PLANET_GEMSTONE[pid] ?? { hi: 'इसका रत्न' }).hi}) धारण करें, सूर्य का माणिक्य नहीं। सूर्य को सुदृढ़ करने से अस्त ग्रह और भी दब जाएगा।`,
        },
        frequency: 'once',
        planetId: pid,
      },
    ],
  };
}

function buildWeakLagnaLord(lagnaLord: PlanetInput, ascendantSign: number): ContextualRemedy {
  const pid = lagnaLord.id;
  const name = PLANET_NAMES[pid] ?? { en: `Planet ${pid}`, hi: `ग्रह ${pid}` };
  const deity = SIGN_DEITY[ascendantSign] ?? { en: 'the ruling deity', hi: 'अधिष्ठाता देवता' };

  const weakReasons: string[] = [];
  if (lagnaLord.isDebilitated) weakReasons.push('debilitated');
  if (lagnaLord.isCombust) weakReasons.push('combust');
  if (DUSTHANA.has(lagnaLord.house)) weakReasons.push(`in ${ordinal(lagnaLord.house)} house (dusthana)`);
  const reasonStr = weakReasons.join(', ');

  return {
    affliction: 'weak_lagna_lord',
    afflictionName: {
      en: 'Weak Lagna Lord',
      hi: 'कमज़ोर लग्नेश',
    },
    severity: 'severe',
    explanation: {
      en: `Your lagna lord ${name.en} is ${reasonStr}. The lagna lord represents your vitality, health, and overall life direction. A weak lagna lord diminishes self-confidence and creates persistent obstacles.`,
      hi: `आपका लग्नेश ${name.hi} ${reasonStr} है। लग्नेश आपकी जीवनशक्ति, स्वास्थ्य और समग्र जीवन दिशा का प्रतिनिधित्व करता है। कमज़ोर लग्नेश आत्मविश्वास में कमी और लगातार बाधाएं उत्पन्न करता है।`,
    },
    remedies: [
      {
        type: 'gemstone',
        title: {
          en: `${(PLANET_GEMSTONE[pid] ?? { en: 'Lagna Lord Gemstone' }).en}`,
          hi: `${(PLANET_GEMSTONE[pid] ?? { hi: 'लग्नेश का रत्न' }).hi}`,
        },
        description: {
          en: `Wearing the gemstone of your lagna lord (${(PLANET_GEMSTONE[pid] ?? { en: 'gemstone' }).en}) is the most direct remedy for a weak lagna lord. This is almost always safe since the lagna lord is always beneficial.`,
          hi: `अपने लग्नेश का रत्न (${(PLANET_GEMSTONE[pid] ?? { hi: 'रत्न' }).hi}) धारण करना कमज़ोर लग्नेश का सबसे सीधा उपाय है। यह लगभग हमेशा सुरक्षित है क्योंकि लग्नेश सदा लाभकारी होता है।`,
        },
        frequency: 'once',
        planetId: pid,
      },
      {
        type: 'fasting',
        title: {
          en: `${PLANET_DAY[pid]} Fasting`,
          hi: `${PLANET_DAY[pid]} व्रत`,
        },
        description: {
          en: `Fast on ${PLANET_DAY[pid]}s for at least 11 consecutive weeks to strengthen your lagna lord ${name.en}.`,
          hi: `अपने लग्नेश ${name.hi} को सुदृढ़ करने के लिए कम से कम 11 लगातार ${PLANET_DAY[pid]} व्रत रखें।`,
        },
        frequency: `weekly on ${PLANET_DAY[pid]}`,
        planetId: pid,
      },
      {
        type: 'puja',
        title: {
          en: `Worship ${deity.en}`,
          hi: `${deity.hi} पूजा`,
        },
        description: {
          en: `Worship ${deity.en}, the presiding deity for your lagna sign. Regular worship strengthens the lagna and its lord.`,
          hi: `${deity.hi}, आपकी लग्न राशि के अधिष्ठाता देवता, की पूजा करें। नियमित पूजा लग्न और लग्नेश को सुदृढ़ करती है।`,
        },
        frequency: 'daily',
        planetId: pid,
      },
      {
        type: 'mantra',
        title: {
          en: `${name.en} Beej Mantra`,
          hi: `${name.hi} बीज मंत्र`,
        },
        description: PLANET_MANTRA[pid] ?? { en: 'Recite the planet\'s beej mantra daily', hi: 'प्रतिदिन ग्रह का बीज मंत्र जपें' },
        frequency: 'daily',
        planetId: pid,
      },
    ],
  };
}

function detect7thHouseAffliction(planets: PlanetInput[], ascendantSign: number): ContextualRemedy | null {
  const MALEFICS = new Set([0, 2, 6, 7, 8]); // Sun, Mars, Saturn, Rahu, Ketu
  const seventhLordId = SIGN_LORD[((ascendantSign - 1 + 6) % 12) + 1]; // sign opposite to lagna
  const seventhLord = planets.find(p => p.id === seventhLordId);
  const venus = planets.find(p => p.id === 5);

  // Malefics in 7th house
  const maleficsIn7 = planets.filter(p => p.house === 7 && MALEFICS.has(p.id));
  // 7th lord in dusthana
  const seventhLordInDusthana = seventhLord && DUSTHANA.has(seventhLord.house);
  // Venus weak (debilitated or combust) — Venus is karaka for marriage
  const venusWeak = venus && (venus.isDebilitated || venus.isCombust);

  if (maleficsIn7.length === 0 && !seventhLordInDusthana && !venusWeak) {
    return null;
  }

  const remedies: RemedyAction[] = [];

  // Add specific remedies based on which malefic is in 7th
  for (const malefic of maleficsIn7) {
    const mName = PLANET_NAMES[malefic.id] ?? { en: 'Malefic', hi: 'पापग्रह' };
    remedies.push({
      type: 'mantra',
      title: {
        en: `${mName.en} Pacification Mantra`,
        hi: `${mName.hi} शान्ति मंत्र`,
      },
      description: {
        en: `Recite ${mName.en}'s beej mantra to pacify its negative influence on the 7th house of marriage and partnerships.`,
        hi: `विवाह और साझेदारी के 7वें भाव पर ${mName.hi} के नकारात्मक प्रभाव को शान्त करने के लिए इसका बीज मंत्र जपें।`,
      },
      frequency: 'daily',
      planetId: malefic.id,
    });
  }

  if (venusWeak) {
    remedies.push(
      {
        type: 'mantra',
        title: { en: 'Shukra Stotra', hi: 'शुक्र स्तोत्र' },
        description: {
          en: 'Recite the Shukra Stotra or Shukra Beej Mantra on Fridays. Venus is the karaka (significator) for marriage — strengthening Venus improves relationship prospects.',
          hi: 'शुक्रवार को शुक्र स्तोत्र या शुक्र बीज मंत्र का पाठ करें। शुक्र विवाह का कारक है — शुक्र को सुदृढ़ करने से सम्बंधों की संभावनाएं बेहतर होती हैं।',
        },
        frequency: 'weekly on Friday',
        planetId: 5,
      },
      {
        type: 'gemstone',
        title: { en: 'Diamond or White Sapphire', hi: 'हीरा या सफ़ेद नीलम' },
        description: {
          en: 'Wear a diamond or white sapphire on the ring finger of the right hand in a platinum or silver setting. Activate on Friday during Shukra hora.',
          hi: 'दाहिने हाथ की अनामिका में प्लैटिनम या चांदी में हीरा या सफ़ेद नीलम धारण करें। शुक्रवार शुक्र होरा में अभिमंत्रित करें।',
        },
        frequency: 'once',
        planetId: 5,
      },
      {
        type: 'fasting',
        title: { en: 'Friday Fasting', hi: 'शुक्रवार व्रत' },
        description: {
          en: 'Observe a Friday fast for 16 consecutive weeks. Wear white clothes and worship Goddess Lakshmi.',
          hi: '16 लगातार शुक्रवार व्रत रखें। सफ़ेद वस्त्र धारण करें और देवी लक्ष्मी की पूजा करें।',
        },
        frequency: 'weekly on Friday',
        planetId: 5,
      },
    );
  }

  if (seventhLordInDusthana && seventhLord) {
    const slName = PLANET_NAMES[seventhLord.id] ?? { en: '7th Lord', hi: '7वां अधिपति' };
    remedies.push({
      type: 'puja',
      title: {
        en: `Strengthen ${slName.en} (7th Lord)`,
        hi: `${slName.hi} (7वें अधिपति) को सुदृढ़ करें`,
      },
      description: {
        en: `Your 7th lord ${slName.en} is placed in the ${ordinal(seventhLord.house)} house (dusthana). Strengthen it through its specific mantra and charity on ${PLANET_DAY[seventhLord.id]}s.`,
        hi: `आपका 7वां अधिपति ${slName.hi} ${ordinal(seventhLord.house)} भाव (दुःस्थान) में है। ${PLANET_DAY[seventhLord.id]} को इसके विशिष्ट मंत्र और दान से इसे सुदृढ़ करें।`,
      },
      frequency: `weekly on ${PLANET_DAY[seventhLord.id]}`,
      planetId: seventhLord.id,
    });
  }

  // Ensure at least 3 remedies
  if (remedies.length < 3) {
    remedies.push({
      type: 'puja',
      title: { en: 'Gauri-Shankar Puja', hi: 'गौरी-शंकर पूजा' },
      description: {
        en: 'Worship Lord Shiva and Parvati together (Gauri-Shankar) for marital harmony and removing obstacles in marriage. Offer bilva leaves and white flowers.',
        hi: 'वैवाहिक सौहार्द और विवाह की बाधाओं को दूर करने के लिए भगवान शिव और पार्वती (गौरी-शंकर) की पूजा करें। बिल्व पत्र और सफ़ेद फूल अर्पित करें।',
      },
      frequency: 'weekly on Monday',
    });
  }

  const severity: ContextualRemedy['severity'] =
    maleficsIn7.length >= 2 || (maleficsIn7.length > 0 && venusWeak) ? 'severe' :
    maleficsIn7.length === 1 || venusWeak ? 'moderate' : 'mild';

  return {
    affliction: '7th_house_affliction',
    afflictionName: {
      en: '7th House Affliction (Marriage & Partnerships)',
      hi: '7वें भाव का दोष (विवाह और साझेदारी)',
    },
    severity,
    explanation: {
      en: `The 7th house of marriage and partnerships is afflicted.${maleficsIn7.length > 0 ? ` Malefic planet(s) (${maleficsIn7.map(m => (PLANET_NAMES[m.id] ?? { en: '' }).en).join(', ')}) occupy the 7th house.` : ''}${venusWeak ? ' Venus (karaka of marriage) is weakened.' : ''}${seventhLordInDusthana ? ` The 7th lord is placed in a dusthana (${ordinal(seventhLord!.house)} house).` : ''} This can cause delays in marriage, misunderstandings with partners, or instability in relationships.`,
      hi: `विवाह और साझेदारी का 7वां भाव पीड़ित है।${maleficsIn7.length > 0 ? ` पापग्रह (${maleficsIn7.map(m => (PLANET_NAMES[m.id] ?? { hi: '' }).hi).join(', ')}) 7वें भाव में हैं।` : ''}${venusWeak ? ' शुक्र (विवाह का कारक) कमज़ोर है।' : ''}${seventhLordInDusthana ? ` 7वां अधिपति दुःस्थान (${ordinal(seventhLord!.house)} भाव) में है।` : ''} इससे विवाह में देरी, साथी से गलतफ़हमी, या सम्बंधों में अस्थिरता हो सकती है।`,
    },
    remedies,
  };
}

function detect10thHouseAffliction(planets: PlanetInput[], ascendantSign: number): ContextualRemedy | null {
  const tenthLordId = SIGN_LORD[((ascendantSign - 1 + 9) % 12) + 1]; // 10th sign from lagna
  const tenthLord = planets.find(p => p.id === tenthLordId);

  const saturn = planets.find(p => p.id === 6);
  const rahu = planets.find(p => p.id === 7);

  const saturnIn10 = saturn && saturn.house === 10;
  const rahuIn10 = rahu && rahu.house === 10;
  const tenthLordWeak = tenthLord && (tenthLord.isDebilitated || tenthLord.isCombust || DUSTHANA.has(tenthLord.house));

  if (!saturnIn10 && !rahuIn10 && !tenthLordWeak) {
    return null;
  }

  const remedies: RemedyAction[] = [];

  if (saturnIn10) {
    remedies.push(
      {
        type: 'puja',
        title: { en: 'Shani Shanti Puja', hi: 'शनि शान्ति पूजा' },
        description: {
          en: 'Saturn in the 10th house creates delays and obstacles in career but ultimately rewards hard work. Perform Shani Shanti Puja to ease the initial difficulties.',
          hi: 'दसवें भाव में शनि करियर में देरी और बाधाएं उत्पन्न करता है लेकिन अंततः कठिन परिश्रम का फल देता है। प्रारम्भिक कठिनाइयों को कम करने के लिए शनि शान्ति पूजा करवाएं।',
        },
        frequency: 'once',
        planetId: 6,
      },
      {
        type: 'lifestyle',
        title: { en: 'Structured Career Approach', hi: 'व्यवस्थित करियर दृष्टिकोण' },
        description: {
          en: 'Saturn in 10th favors disciplined, structured career paths — government, law, management, engineering. Avoid shortcuts. Build expertise methodically. Success comes after sustained effort.',
          hi: 'दसवें भाव में शनि अनुशासित, व्यवस्थित करियर पथ — सरकारी नौकरी, कानून, प्रबंधन, इंजीनियरिंग — का पक्ष लेता है। शॉर्टकट से बचें। विशेषज्ञता व्यवस्थित रूप से बनाएं। सफलता निरंतर प्रयास के बाद आती है।',
        },
        planetId: 6,
      },
    );
  }

  if (rahuIn10) {
    remedies.push(
      {
        type: 'mantra',
        title: { en: 'Rahu Mantra', hi: 'राहु मंत्र' },
        description: {
          en: 'Recite Rahu Beej Mantra on Saturdays. Rahu in 10th can bring sudden rise and fall — the mantra stabilizes its energy.',
          hi: 'शनिवार को राहु बीज मंत्र का जप करें। दसवें भाव में राहु अचानक उत्थान और पतन ला सकता है — मंत्र इसकी ऊर्जा को स्थिर करता है।',
        },
        frequency: 'weekly on Saturday',
        planetId: 7,
      },
      {
        type: 'lifestyle',
        title: { en: 'Ethical Career Conduct', hi: 'नैतिक व्यावसायिक आचरण' },
        description: {
          en: 'Rahu in 10th tempts with shortcuts and unconventional methods. Strictly avoid unethical practices, plagiarism, or cutting corners. Build reputation through genuine merit.',
          hi: 'दसवें भाव में राहु शॉर्टकट और अपरम्परागत तरीकों का प्रलोभन देता है। अनैतिक प्रथाओं, नकल या कामचलाऊ उपायों से सख़्ती से बचें। वास्तविक योग्यता से प्रतिष्ठा बनाएं।',
        },
        planetId: 7,
      },
    );
  }

  if (tenthLordWeak && tenthLord) {
    const tlName = PLANET_NAMES[tenthLord.id] ?? { en: '10th Lord', hi: '10वां अधिपति' };
    remedies.push(
      {
        type: 'gemstone',
        title: {
          en: `${(PLANET_GEMSTONE[tenthLord.id] ?? { en: 'Gemstone' }).en} for Career`,
          hi: `करियर के लिए ${(PLANET_GEMSTONE[tenthLord.id] ?? { hi: 'रत्न' }).hi}`,
        },
        description: {
          en: `Strengthen your 10th lord ${tlName.en} by wearing ${(PLANET_GEMSTONE[tenthLord.id] ?? { en: 'its gemstone' }).en}. Activate on ${PLANET_DAY[tenthLord.id]} during the planet's hora.`,
          hi: `${(PLANET_GEMSTONE[tenthLord.id] ?? { hi: 'इसका रत्न' }).hi} धारण करके अपने 10वें अधिपति ${tlName.hi} को सुदृढ़ करें। ${PLANET_DAY[tenthLord.id]} को ग्रह की होरा में अभिमंत्रित करें।`,
        },
        frequency: 'once',
        planetId: tenthLord.id,
      },
      {
        type: 'puja',
        title: {
          en: `${tlName.en} Puja for Professional Growth`,
          hi: `व्यावसायिक विकास के लिए ${tlName.hi} पूजा`,
        },
        description: {
          en: `Perform a puja for ${tlName.en} and donate ${(PLANET_CHARITY[tenthLord.id] ?? { en: 'relevant items' }).en} on ${PLANET_DAY[tenthLord.id]}s.`,
          hi: `${tlName.hi} की पूजा करें और ${PLANET_DAY[tenthLord.id]} को ${(PLANET_CHARITY[tenthLord.id] ?? { hi: 'सम्बंधित वस्तुएं' }).hi} दान करें।`,
        },
        frequency: `weekly on ${PLANET_DAY[tenthLord.id]}`,
        planetId: tenthLord.id,
      },
    );
  }

  const severity: ContextualRemedy['severity'] =
    (saturnIn10 && rahuIn10) || (tenthLordWeak && (saturnIn10 || rahuIn10)) ? 'severe' :
    saturnIn10 || rahuIn10 ? 'moderate' : 'mild';

  return {
    affliction: '10th_house_affliction',
    afflictionName: {
      en: '10th House Affliction (Career & Status)',
      hi: '10वें भाव का दोष (करियर और प्रतिष्ठा)',
    },
    severity,
    explanation: {
      en: `The 10th house of career and social status is challenged.${saturnIn10 ? ' Saturn in 10th causes delays but rewards discipline.' : ''}${rahuIn10 ? ' Rahu in 10th brings sudden changes and unconventional career paths.' : ''}${tenthLordWeak ? ` The 10th lord is weakened (${tenthLord!.isDebilitated ? 'debilitated' : tenthLord!.isCombust ? 'combust' : 'in dusthana'}).` : ''}`,
      hi: `करियर और सामाजिक प्रतिष्ठा का 10वां भाव चुनौतीपूर्ण है।${saturnIn10 ? ' दसवें में शनि देरी करता है लेकिन अनुशासन को पुरस्कृत करता है।' : ''}${rahuIn10 ? ' दसवें में राहु अचानक परिवर्तन और अपरम्परागत करियर पथ लाता है।' : ''}${tenthLordWeak ? ` 10वां अधिपति कमज़ोर है (${tenthLord!.isDebilitated ? 'नीच' : tenthLord!.isCombust ? 'अस्त' : 'दुःस्थान में'})।` : ''}`,
    },
    remedies,
  };
}

function detectDashaDifficulty(
  dashas: DashaInput[],
  planets: PlanetInput[],
  ascendantSign: number,
): ContextualRemedy | null {
  // Look at the first (current) dasha
  const current = dashas[0];
  if (!current) return null;

  // Map planet name to ID
  const nameToId: Record<string, number> = {
    Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
    Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
  };
  const pid = nameToId[current.planet];
  if (pid === undefined) return null;

  const planet = planets.find(p => p.id === pid);
  if (!planet) return null;

  // Check if the dasha lord is weak in the chart
  const MALEFICS = new Set([0, 2, 6, 7, 8]);
  const isWeak = planet.isDebilitated || planet.isCombust || DUSTHANA.has(planet.house);
  const isMalefic = MALEFICS.has(pid);
  const lagnaLordId = SIGN_LORD[ascendantSign];

  // Only flag if the dasha lord is both malefic and weak, or debilitated
  if (!isWeak && !isMalefic) return null;
  // If it's a natural benefic and only mildly placed, skip
  if (!isWeak && isMalefic && pid === lagnaLordId) return null;

  const name = PLANET_NAMES[pid] ?? { en: current.planet, hi: current.planet };

  return {
    affliction: `dasha_difficulty_${pid}`,
    afflictionName: {
      en: `Challenging ${name.en} Dasha Period`,
      hi: `चुनौतीपूर्ण ${name.hi} दशा अवधि`,
    },
    severity: planet.isDebilitated ? 'severe' : isWeak ? 'moderate' : 'mild',
    explanation: {
      en: `You are currently running ${name.en} Mahadasha (until ${current.endDate}). ${name.en} is ${planet.isDebilitated ? 'debilitated' : planet.isCombust ? 'combust' : DUSTHANA.has(planet.house) ? `in the ${ordinal(planet.house)} house (dusthana)` : 'a natural malefic'} in your chart, making this period more challenging. Focus remedies specifically on ${name.en} during this time.`,
      hi: `आप वर्तमान में ${name.hi} महादशा (${current.endDate} तक) में हैं। ${name.hi} आपकी कुंडली में ${planet.isDebilitated ? 'नीच' : planet.isCombust ? 'अस्त' : DUSTHANA.has(planet.house) ? `${ordinal(planet.house)} भाव (दुःस्थान) में` : 'प्राकृतिक पापग्रह'} है, जो इस अवधि को अधिक चुनौतीपूर्ण बनाता है। इस समय विशेष रूप से ${name.hi} के उपायों पर ध्यान दें।`,
    },
    remedies: [
      {
        type: 'mantra',
        title: {
          en: `${name.en} Mantra (Priority)`,
          hi: `${name.hi} मंत्र (प्राथमिकता)`,
        },
        description: PLANET_MANTRA[pid] ?? { en: 'Recite the planet\'s beej mantra daily', hi: 'प्रतिदिन ग्रह का बीज मंत्र जपें' },
        frequency: 'daily',
        planetId: pid,
      },
      {
        type: 'charity',
        title: {
          en: `${name.en} Charity`,
          hi: `${name.hi} दान`,
        },
        description: {
          en: `During this dasha, regularly donate ${(PLANET_CHARITY[pid] ?? { en: 'items for this planet' }).en} on ${PLANET_DAY[pid]}s.`,
          hi: `इस दशा के दौरान, ${PLANET_DAY[pid]} को नियमित रूप से ${(PLANET_CHARITY[pid] ?? { hi: 'इस ग्रह से सम्बंधित वस्तुएं' }).hi} दान करें।`,
        },
        frequency: `weekly on ${PLANET_DAY[pid]}`,
        planetId: pid,
      },
      {
        type: 'puja',
        title: {
          en: `Navagraha Puja (${name.en} emphasis)`,
          hi: `नवग्रह पूजा (${name.hi} पर विशेष ज़ोर)`,
        },
        description: {
          en: `Perform a Navagraha Puja with special emphasis on ${name.en}. This is recommended at the beginning of a difficult dasha period.`,
          hi: `${name.hi} पर विशेष ज़ोर के साथ नवग्रह पूजा करवाएं। कठिन दशा अवधि के आरम्भ में यह अनुशंसित है।`,
        },
        frequency: 'once',
        planetId: pid,
      },
    ],
  };
}

function detectPitruDosha(planets: PlanetInput[]): ContextualRemedy | null {
  const sun = planets.find(p => p.id === 0);
  const saturn = planets.find(p => p.id === 6);
  const rahu = planets.find(p => p.id === 7);

  // Pitru Dosha conditions:
  // 1. Sun in 9th house with Saturn
  // 2. Saturn in 9th house
  // 3. Rahu conjunct Sun (same sign)
  // 4. 9th lord in 6/8/12

  const saturnIn9 = saturn && saturn.house === 9;
  const sunIn9 = sun && sun.house === 9;
  const rahuConjunctSun = rahu && sun && rahu.sign === sun.sign;
  const sunSaturnIn9 = sunIn9 && saturnIn9;

  if (!saturnIn9 && !rahuConjunctSun && !sunSaturnIn9) {
    return null;
  }

  const severity: ContextualRemedy['severity'] = sunSaturnIn9 ? 'severe' : saturnIn9 ? 'moderate' : 'mild';

  return {
    affliction: 'pitru_dosha',
    afflictionName: {
      en: 'Pitru Dosha (Ancestral Karma)',
      hi: 'पितृ दोष (पूर्वज कर्म)',
    },
    severity,
    explanation: {
      en: `Pitru Dosha is indicated in your chart.${sunSaturnIn9 ? ' Sun and Saturn together in the 9th house (father\'s house) create strong ancestral karmic patterns.' : saturnIn9 ? ' Saturn in the 9th house indicates unresolved ancestral debts.' : ''} ${rahuConjunctSun ? ' Rahu conjunct Sun creates Grahan Dosha, compounding ancestral affliction.' : ''} This can manifest as unexplained obstacles, lineage-related issues, or feeling blocked despite efforts.`,
      hi: `आपकी कुंडली में पितृ दोष संकेत है।${sunSaturnIn9 ? ' 9वें भाव (पिता का भाव) में सूर्य और शनि एक साथ मजबूत पूर्वज कर्म पैटर्न बनाते हैं।' : saturnIn9 ? ' 9वें भाव में शनि अनसुलझे पूर्वज ऋणों का संकेत है।' : ''} ${rahuConjunctSun ? ' राहु और सूर्य का योग ग्रहण दोष बनाता है, जो पूर्वज पीड़ा को और बढ़ाता है।' : ''} यह अस्पष्ट बाधाओं, वंश सम्बंधी समस्याओं, या प्रयासों के बावजूद अवरुद्ध महसूस करने के रूप में प्रकट हो सकता है।`,
    },
    remedies: [
      {
        type: 'puja',
        title: { en: 'Pitru Tarpan on Amavasya', hi: 'अमावस्या पर पितृ तर्पण' },
        description: {
          en: 'Perform Pitru Tarpan (water offering to ancestors) on every Amavasya (new moon). Use black sesame seeds, kusha grass, and water while facing south.',
          hi: 'प्रत्येक अमावस्या (नई चन्द्र) पर पितृ तर्पण (पूर्वजों को जल अर्पण) करें। दक्षिण दिशा की ओर मुख करके काले तिल, कुशा घास और जल से तर्पण करें।',
        },
        frequency: 'monthly on Amavasya',
        planetId: 0,
      },
      {
        type: 'puja',
        title: { en: 'Shraddha Ceremony', hi: 'श्राद्ध कर्म' },
        description: {
          en: 'Perform annual Shraddha ceremony for departed ancestors during Pitru Paksha (Ashwin Krishna). If possible, perform Pind Daan at Gaya or Varanasi at least once.',
          hi: 'पितृ पक्ष (आश्विन कृष्ण) में दिवंगत पूर्वजों का वार्षिक श्राद्ध कर्म करें। यदि संभव हो, कम से कम एक बार गया या वाराणसी में पिण्ड दान करें।',
        },
        frequency: 'yearly',
        planetId: 0,
      },
      {
        type: 'charity',
        title: { en: 'Feed Crows and Offer Water to Sun', hi: 'कौओं को भोजन और सूर्य को जल अर्पित करें' },
        description: {
          en: 'Feed crows daily (they represent Saturn/ancestors in tradition). Offer water (arghya) to the rising Sun every morning. These are simple but powerful daily Pitru Dosha remedies.',
          hi: 'प्रतिदिन कौओं को भोजन दें (परम्परा में ये शनि/पूर्वजों का प्रतिनिधित्व करते हैं)। प्रत्येक प्रातः उगते सूर्य को जल (अर्घ्य) अर्पित करें। ये सरल लेकिन शक्तिशाली दैनिक पितृ दोष उपाय हैं।',
        },
        frequency: 'daily',
        planetId: 6,
      },
      {
        type: 'mantra',
        title: { en: 'Pitru Gayatri Mantra', hi: 'पितृ गायत्री मंत्र' },
        description: {
          en: 'Recite "Om Pitrubhyah Devatabhyah Mahayogibhyashcha Eva Cha, Namah Swadhaayai Swaahayai Nityam Eva Namo Namah" — 108 times on Amavasya or Saturdays.',
          hi: '"ॐ पितृभ्यः देवताभ्यः महायोगिभ्यश्च एव च, नमः स्वधायै स्वाहायै नित्यम् एव नमो नमः" — अमावस्या या शनिवार को 108 बार जप करें।',
        },
        frequency: 'weekly on Saturday',
        planetId: 0,
      },
    ],
  };
}

// ─── Detection helpers ──────────────────────────────────────────────────────

/**
 * Kala Sarpa: all 7 visible planets (Sun=0 through Saturn=6) are between Rahu and Ketu.
 * "Between" means within the shorter arc from Rahu to Ketu.
 */
function detectKalaSarpa(planets: PlanetInput[]): boolean {
  const rahu = planets.find(p => p.id === 7);
  const ketu = planets.find(p => p.id === 8);
  if (!rahu || !ketu) return false;

  const rahuLng = rahu.longitude;
  const ketuLng = ketu.longitude;

  // Check if all planets (0-6) are on one side of the Rahu-Ketu axis
  const visiblePlanets = planets.filter(p => p.id >= 0 && p.id <= 6);
  if (visiblePlanets.length === 0) return false;

  // Normalize: count planets between Rahu->Ketu (clockwise, increasing longitude)
  const allOnOneSide = visiblePlanets.every(p => {
    return isLongitudeBetween(p.longitude, rahuLng, ketuLng);
  });

  const allOnOtherSide = visiblePlanets.every(p => {
    return isLongitudeBetween(p.longitude, ketuLng, rahuLng);
  });

  return allOnOneSide || allOnOtherSide;
}

/** Check if lng is between start and end going clockwise (increasing longitude) */
function isLongitudeBetween(lng: number, start: number, end: number): boolean {
  if (start < end) {
    return lng >= start && lng <= end;
  }
  // Wraps around 360
  return lng >= start || lng <= end;
}

function isLagnaLordWeak(lagnaLord: PlanetInput): boolean {
  return lagnaLord.isDebilitated || lagnaLord.isCombust || DUSTHANA.has(lagnaLord.house);
}

// ─── Summary builder ────────────────────────────────────────────────────────

function buildSummary(afflictions: ContextualRemedy[]): LocaleText {
  if (afflictions.length === 0) {
    return {
      en: 'No significant afflictions detected in the chart. The planetary positions are relatively well-placed. Routine Navagraha prayers and general good conduct are sufficient.',
      hi: 'कुंडली में कोई महत्वपूर्ण दोष नहीं पाया गया। ग्रह स्थितियां अपेक्षाकृत अच्छी हैं। नियमित नवग्रह प्रार्थना और सामान्य सदाचार पर्याप्त है।',
    };
  }

  const severe = afflictions.filter(a => a.severity === 'severe');
  const moderate = afflictions.filter(a => a.severity === 'moderate');
  const total = afflictions.length;

  if (severe.length > 0) {
    const severeNames = severe.map(a => a.afflictionName.en).join(', ');
    return {
      en: `${total} affliction${total > 1 ? 's' : ''} detected. ${severe.length} severe: ${severeNames}. Focus remedies on the severe afflictions first — they have the highest impact on life outcomes. Start with mantras and charity, which have no side effects, before considering gemstones.`,
      hi: `${total} दोष पाए गए। ${severe.length} गंभीर: ${severe.map(a => a.afflictionName.hi).join(', ')}। पहले गंभीर दोषों के उपायों पर ध्यान दें — इनका जीवन पर सर्वाधिक प्रभाव है। रत्नों से पहले मंत्र और दान से शुरू करें, जिनका कोई दुष्प्रभाव नहीं है।`,
    };
  }

  return {
    en: `${total} affliction${total > 1 ? 's' : ''} detected, all ${moderate.length > 0 ? 'moderate' : 'mild'} severity. These can be addressed through regular worship, mantra recitation, and charity. Gemstones may be considered for additional support.`,
    hi: `${total} दोष पाए गए, सभी ${moderate.length > 0 ? 'मध्यम' : 'हल्के'} गंभीरता के। इन्हें नियमित पूजा, मंत्र जप और दान से संबोधित किया जा सकता है। अतिरिक्त सहायता के लिए रत्नों पर विचार किया जा सकता है।`,
  };
}

// ─── Utility ────────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
