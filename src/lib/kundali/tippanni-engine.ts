/**
 * Tippanni Interpretation Engine
 * Generates comprehensive interpretive commentary from KundaliData
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { LAGNA_DEEP } from './tippanni-lagna';
import { PLANET_HOUSE_DEPTH, DIGNITY_EFFECTS, DASHA_EFFECTS } from './tippanni-planets';
import type {
  TippanniContent, PersonalitySection, PlanetInsight, YogaInsight,
  DoshaInsight, LifeAreaSection, LifeArea, DashaInsightSection,
  RemedySection, RemedyItem, StrengthEntry,
} from './tippanni-types';

// Enhanced tippanni modules
import { getPlanetInSignText } from '@/lib/tippanni/planet-in-sign';
import { getPlanetInHouseEnhanced } from '@/lib/tippanni/planet-in-house-enhanced';
import { calculateAllAspects } from '@/lib/tippanni/aspects';
import { detectExtendedYogas } from '@/lib/tippanni/yogas-extended';
import { detectExtendedDoshas } from '@/lib/tippanni/doshas-extended';
import { getDashaLordAnalysis, getAntardashaInteraction } from '@/lib/tippanni/dasha-effects-enhanced';
import { getRemediesForWeakPlanets } from '@/lib/tippanni/remedies-enhanced';
import {
  analyzeCareerEnhanced, analyzeWealthEnhanced, analyzeMarriageEnhanced,
  analyzeHealthEnhanced, analyzeEducationEnhanced,
} from '@/lib/tippanni/life-areas-enhanced';
import { generateYearPredictions } from '@/lib/tippanni/year-predictions';

export type { TippanniContent } from './tippanni-types';

// Planet-in-house base descriptions (English)
const PLANET_HOUSE_BASE: Record<number, Record<number, string>> = {
  0: {
    1: 'Sun in the 1st house gives a strong sense of self, leadership ability, and vitality. You are confident and have a commanding presence.',
    2: 'Sun in the 2nd house indicates wealth through authority. Your speech carries weight. Family values and financial security are tied to your identity.',
    3: 'Sun in the 3rd house gives courage, strong willpower, and good relationships with siblings.',
    4: 'Sun in the 4th house indicates a strong connection to home and mother. Property through authority connections.',
    5: 'Sun in the 5th house is excellent for intelligence, creativity, and connection with children.',
    6: 'Sun in the 6th house gives ability to overcome enemies and competition. Service-oriented career suits you.',
    7: 'Sun in the 7th house brings a powerful spouse but requires balancing ego in partnerships.',
    8: 'Sun in the 8th house indicates transformation through challenges. Interest in occult and research.',
    9: 'Sun in the 9th house is fortunate for higher education, long journeys, and spiritual pursuits.',
    10: 'Sun in the 10th house is powerful for career success, fame, and public recognition.',
    11: 'Sun in the 11th house brings gains through powerful connections and fulfilled ambitions.',
    12: 'Sun in the 12th house indicates spiritual growth through ego dissolution and possible foreign residence.',
  },
  1: {
    1: 'Moon in the 1st house gives an emotional, intuitive, and receptive personality with strong nurturing instincts.',
    2: 'Moon in the 2nd house indicates fluctuating finances but rich family life and emotionally persuasive speech.',
    3: 'Moon in the 3rd house gives emotional courage and strong bonds with siblings.',
    4: 'Moon in the 4th house is very strong — emotional contentment, comfortable home, and loving relationship with mother.',
    5: 'Moon in the 5th house gives emotional intelligence, creative talent, and strong bonding with children.',
    6: 'Moon in the 6th house indicates emotional challenges from health issues. Service to others provides healing.',
    7: 'Moon in the 7th house brings an emotionally nurturing partner and empathetic public dealings.',
    8: 'Moon in the 8th house brings emotional depth, psychic sensitivity, and transformative experiences.',
    9: 'Moon in the 9th house gives religious and philosophical inclinations. Mother is a spiritual guide.',
    10: 'Moon in the 10th house brings public popularity and a career involving emotional connection with people.',
    11: 'Moon in the 11th house fulfills desires and brings gains through social connections.',
    12: 'Moon in the 12th house indicates a rich inner life, possible foreign settlement, and vivid dream experiences.',
  },
  2: {
    1: 'Mars in the 1st house gives courage, energy, and a competitive spirit with exceptional physical vitality.',
    2: 'Mars in the 2nd house indicates aggressive earning and fierce family protectiveness.',
    3: 'Mars in the 3rd house is excellent — valor, adventurous spirit, and strong supportive siblings.',
    4: 'Mars in the 4th house brings energy to domestic life but possible property disputes.',
    5: 'Mars in the 5th house gives competitive intelligence and risk-taking ability in education and speculation.',
    6: 'Mars in the 6th house is powerful for defeating enemies and overcoming obstacles.',
    7: 'Mars in the 7th house (Manglik) brings an energetic spouse but requires patience in marriage.',
    8: 'Mars in the 8th house indicates risk of accidents or surgery. Strong research and martial arts interest.',
    9: 'Mars in the 9th house gives fighting spirit for beliefs and courage in long journeys.',
    10: 'Mars in the 10th house is powerful for career achievement through courage and decisive action.',
    11: 'Mars in the 11th house brings gains through courage, competition, and bold action.',
    12: 'Mars in the 12th house indicates expenses through conflict and hidden enemies. Energy directed toward spiritual practices.',
  },
  3: {
    1: 'Mercury in the 1st house gives a youthful, communicative personality. Witty, adaptable, and multi-talented.',
    2: 'Mercury in the 2nd house is excellent for wealth through intellect. Clever, persuasive speech.',
    3: 'Mercury in the 3rd house is very strong — excellent communication, writing talent, and harmonious siblings.',
    4: 'Mercury in the 4th house gives an educated home environment and favorable property transactions.',
    5: 'Mercury in the 5th house gives sharp intelligence, skill in speculation, and intellectually gifted children.',
    6: 'Mercury in the 6th house helps solve problems analytically. Good for medical, legal professions.',
    7: 'Mercury in the 7th house brings an intelligent spouse and successful communication-based partnerships.',
    8: 'Mercury in the 8th house gives research ability and analytical approach to mysteries and hidden knowledge.',
    9: 'Mercury in the 9th house gives interest in philosophy, teaching, and foreign cultures.',
    10: 'Mercury in the 10th house brings career success through intellect and communication.',
    11: 'Mercury in the 11th house brings gains through intellectual pursuits and networking.',
    12: 'Mercury in the 12th house gives a rich inner mental life and possible foreign communication work.',
  },
  4: {
    1: 'Jupiter in the 1st house blesses with wisdom, optimism, and good fortune. A philosophical nature that attracts opportunities.',
    2: 'Jupiter in the 2nd house is excellent for wealth, family happiness, and noble speech.',
    3: 'Jupiter in the 3rd house gives wise communication and good sibling relationships.',
    4: 'Jupiter in the 4th house brings domestic happiness, property, and comfortable living.',
    5: 'Jupiter in the 5th house is one of the best placements — intelligence, good children, and spiritual merit.',
    6: 'Jupiter in the 6th house helps overcome obstacles through wisdom and righteousness.',
    7: 'Jupiter in the 7th house brings a wise, noble spouse. Partnerships are fortunate and ethical.',
    8: 'Jupiter in the 8th house protects from sudden harm. Interest in occult wisdom. Longevity favored.',
    9: 'Jupiter in the 9th house is extremely fortunate — great wisdom, prosperity, and spiritual blessings.',
    10: 'Jupiter in the 10th house brings career success through ethical leadership and social respect.',
    11: 'Jupiter in the 11th house fulfills ambitions through knowledge and wise connections.',
    12: 'Jupiter in the 12th house favors spiritual growth, foreign travel, and moksha.',
  },
  5: {
    1: 'Venus in the 1st house gives charm, beauty, artistic sensibility, and a refined aesthetic sense.',
    2: 'Venus in the 2nd house is excellent for wealth, sweet speech, and family harmony.',
    3: 'Venus in the 3rd house gives artistic talents and harmonious creative communication.',
    4: 'Venus in the 4th house brings luxury at home, beautiful vehicles, and domestic happiness.',
    5: 'Venus in the 5th house gives romantic fulfillment, creative talent, and artistic expression.',
    6: 'Venus in the 6th house indicates relationship challenges but success in service-related creative fields.',
    7: 'Venus in the 7th house is strong for marriage — attractive spouse and prosperous partnerships.',
    8: 'Venus in the 8th house gives sensual depth, possible inheritance, and transformative love.',
    9: 'Venus in the 9th house brings fortune through arts, beauty, and pleasant foreign connections.',
    10: 'Venus in the 10th house brings career success in arts, beauty, fashion, or entertainment.',
    11: 'Venus in the 11th house fulfills desires for luxury and pleasure through social connections.',
    12: 'Venus in the 12th house indicates pleasures abroad, rich fantasy life, and spiritual love.',
  },
  6: {
    1: 'Saturn in the 1st house gives a serious, disciplined personality. Early restrictions but long-term success.',
    2: 'Saturn in the 2nd house delays wealth but ensures lasting prosperity through hard work.',
    3: 'Saturn in the 3rd house gives determination and persistence despite early challenges.',
    4: 'Saturn in the 4th house delays domestic happiness but brings eventual stable property ownership.',
    5: 'Saturn in the 5th house delays children or gives serious-minded offspring. Education requires persistence.',
    6: 'Saturn in the 6th house overcomes long-term obstacles. Service career brings gradual recognition.',
    7: 'Saturn in the 7th house delays marriage or brings a mature, responsible spouse.',
    8: 'Saturn in the 8th house gives longevity and deep research interests. Chronic conditions need management.',
    9: 'Saturn in the 9th house gives disciplined spiritual practice and thorough higher education.',
    10: 'Saturn in the 10th house is powerful — career success through steady effort in structured institutions.',
    11: 'Saturn in the 11th house brings gains through persistent effort, achieving goals long-term.',
    12: 'Saturn in the 12th house indicates foreign residence, spiritual discipline, and long-term service.',
  },
  7: {
    1: 'Rahu in the 1st house gives an unconventional personality with worldly ambitions and unique identity.',
    2: 'Rahu in the 2nd house creates unusual wealth patterns — sudden gains and losses.',
    3: 'Rahu in the 3rd house gives courage through unconventional means and modern communication.',
    4: 'Rahu in the 4th house creates unique domestic situations. Foreign property possible.',
    5: 'Rahu in the 5th house gives unusual intelligence and unconventional creative approach.',
    6: 'Rahu in the 6th house is powerful for overcoming obstacles through unconventional methods.',
    7: 'Rahu in the 7th house may bring a spouse from a different background. Foreign partnerships favored.',
    8: 'Rahu in the 8th house gives fascination with occult, sudden transformations, and unconventional research.',
    9: 'Rahu in the 9th house creates interest in foreign philosophies and unconventional spiritual paths.',
    10: 'Rahu in the 10th house is powerful for career success through innovation and public recognition.',
    11: 'Rahu in the 11th house is excellent for fulfilling worldly desires through technology and networking.',
    12: 'Rahu in the 12th house indicates foreign residence and spiritual awakening through unconventional means.',
  },
  8: {
    1: 'Ketu in the 1st house gives a spiritual, detached personality with past-life wisdom and strong intuition.',
    2: 'Ketu in the 2nd house creates detachment from material wealth. Mystical speech quality.',
    3: 'Ketu in the 3rd house gives spiritual courage and intuitive communication from past-life skills.',
    4: 'Ketu in the 4th house creates detachment from conventional domestic life. Spiritual home practices.',
    5: 'Ketu in the 5th house gives mystical intelligence and spiritual merit from past lives.',
    6: 'Ketu in the 6th house overcomes enemies through spiritual means. Natural healing abilities.',
    7: 'Ketu in the 7th house creates detachment in partnerships. Karmic relationship dimension.',
    8: 'Ketu in the 8th house is powerful for occult knowledge, meditation, and spiritual transformation.',
    9: 'Ketu in the 9th house gives natural spiritual wisdom. Religion experienced internally.',
    10: 'Ketu in the 10th house creates career in healing, spirituality, or meaningful research.',
    11: 'Ketu in the 11th house gives spiritual gains. True fulfillment through service and liberation.',
    12: 'Ketu in the 12th house is excellent for moksha. Strong meditation abilities. Past-life merit manifests.',
  },
};

function t(locale: Locale, en: string, hi: string, sa?: string): string {
  if (locale === 'sa') return sa || hi;
  return locale === 'hi' ? hi : en;
}

function generatePersonality(kundali: KundaliData, locale: Locale): PersonalitySection {
  const ascSign = kundali.ascendant.sign;
  const lagna = LAGNA_DEEP[ascSign];
  const rashi = RASHIS[ascSign - 1];

  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const sunPlanet = kundali.planets.find(p => p.planet.id === 0);
  const moonSign = moonPlanet ? RASHIS[moonPlanet.sign - 1] : null;
  const sunSign = sunPlanet ? RASHIS[sunPlanet.sign - 1] : null;

  const lagnaContent = lagna
    ? `${lagna.personality[locale === 'sa' ? 'sa' : locale]}\n\n${t(locale, 'Career:', 'कैरियर:', 'जीविका:')}\n${lagna.career[locale === 'sa' ? 'sa' : locale]}\n\n${t(locale, 'Health:', 'स्वास्थ्य:', 'स्वास्थ्यम्:')}\n${lagna.health[locale === 'sa' ? 'sa' : locale]}`
    : t(locale, `${rashi.name.en} Ascendant shapes your personality.`, `${rashi.name.hi} लग्न आपके व्यक्तित्व को आकार देता है।`);

  const lagnaImplications = lagna
    ? `${t(locale, 'Relationships:', 'सम्बन्ध:', 'सम्बन्धाः:')}\n${lagna.relationships[locale === 'sa' ? 'sa' : locale]}\n\n${t(locale, 'Finances:', 'वित्त:', 'वित्तम्:')}\n${lagna.finances[locale === 'sa' ? 'sa' : locale]}\n\n${t(locale, 'Spiritual Path:', 'आध्यात्मिक मार्ग:', 'आध्यात्मिकमार्गः:')}\n${lagna.spiritual[locale === 'sa' ? 'sa' : locale]}`
    : '';

  const moonContent = moonSign
    ? t(locale,
        `Moon in ${moonSign.name.en} shapes your emotional nature, instincts, and inner world. As a ${moonSign.element.en} sign ruled by ${moonSign.rulerName.en}, your emotional responses are colored by ${moonSign.quality.en.toLowerCase()} energy. Your mind processes feelings through the lens of ${moonSign.name.en} — ${moonSign.element.en === 'Fire' ? 'with passion and immediacy' : moonSign.element.en === 'Earth' ? 'with groundedness and practicality' : moonSign.element.en === 'Air' ? 'with intellectual detachment and analysis' : 'with deep sensitivity and intuition'}. This placement reveals how you nurture others and what you need to feel emotionally secure.`,
        `${moonSign.name.hi} राशि में चन्द्रमा आपकी भावनात्मक प्रकृति, सहज वृत्तियों और आन्तरिक संसार को आकार देता है। ${moonSign.rulerName.hi} द्वारा शासित ${moonSign.element.hi} तत्व राशि के रूप में, आपकी भावनात्मक प्रतिक्रियाएँ ${moonSign.quality.hi} ऊर्जा से रंगी हैं। यह स्थिति बताती है कि आप दूसरों का पोषण कैसे करते हैं और भावनात्मक सुरक्षा के लिए आपको क्या चाहिए।`,
        `${moonSign.name.sa} राशौ चन्द्रः भवतः भावनात्मिकप्रकृतिम् आकारयति।`)
    : '';

  const moonImplications = moonSign
    ? t(locale,
        `Your Moon in ${moonSign.name.en} suggests ${moonSign.element.en === 'Fire' ? 'quick emotional reactions, enthusiasm, and need for excitement' : moonSign.element.en === 'Earth' ? 'stable emotions, material needs for security, and sensory pleasure' : moonSign.element.en === 'Air' ? 'intellectualized emotions, need for mental stimulation, and social connection' : 'deep emotional sensitivity, psychic receptivity, and need for emotional depth'}. In relationships, you seek ${moonSign.element.en === 'Fire' ? 'passion and adventure' : moonSign.element.en === 'Earth' ? 'stability and reliability' : moonSign.element.en === 'Air' ? 'communication and intellectual connection' : 'emotional intimacy and soul connection'}.`,
        `${moonSign.name.hi} में चन्द्रमा ${moonSign.element.hi} तत्व के प्रभाव से भावनात्मक प्रतिक्रियाओं को निर्धारित करता है। सम्बन्धों में आप ${moonSign.element.en === 'Fire' ? 'उत्साह और साहस' : moonSign.element.en === 'Earth' ? 'स्थिरता और विश्वसनीयता' : moonSign.element.en === 'Air' ? 'संवाद और बौद्धिक सम्बन्ध' : 'भावनात्मक गहराई और आत्मिक सम्बन्ध'} चाहते हैं।`)
    : '';

  const sunContent = sunSign
    ? t(locale,
        `Sun in ${sunSign.name.en} defines your core identity, ego expression, and life purpose. Ruled by ${sunSign.rulerName.en}, your soul seeks to express through ${sunSign.element.en.toLowerCase()} qualities — ${sunSign.element.en === 'Fire' ? 'action, leadership, and self-assertion' : sunSign.element.en === 'Earth' ? 'building, stabilizing, and materializing' : sunSign.element.en === 'Air' ? 'communicating, connecting, and ideating' : 'feeling, intuiting, and healing'}. Your father\'s influence reflects this sign\'s qualities.`,
        `${sunSign.name.hi} राशि में सूर्य आपकी मूल पहचान, अहं अभिव्यक्ति और जीवन उद्देश्य को परिभाषित करता है। ${sunSign.rulerName.hi} द्वारा शासित, आपकी आत्मा ${sunSign.element.hi} गुणों के माध्यम से अभिव्यक्त होना चाहती है। पिता का प्रभाव इस राशि के गुणों को दर्शाता है।`,
        `${sunSign.name.sa} राशौ सूर्यः भवतः मूलपहचानम् अहम्अभिव्यक्तिं जीवनोद्देश्यं च परिभाषयति।`)
    : '';

  const summary = t(locale,
    `With ${rashi.name.en} rising${moonSign ? `, Moon in ${moonSign.name.en}` : ''}${sunSign ? `, and Sun in ${sunSign.name.en}` : ''}, you blend ${rashi.element.en.toLowerCase()} ascendant energy with ${moonSign?.element.en.toLowerCase() || ''} emotional nature${sunSign ? ` and ${sunSign.element.en.toLowerCase()} soul purpose` : ''}. This combination shapes a personality that is ${rashi.element.en === 'Fire' ? 'dynamic and action-oriented' : rashi.element.en === 'Earth' ? 'grounded and practical' : rashi.element.en === 'Air' ? 'intellectual and communicative' : 'intuitive and emotionally deep'}.`,
    `${rashi.name.hi} लग्न${moonSign ? `, ${moonSign.name.hi} में चन्द्रमा` : ''}${sunSign ? `, और ${sunSign.name.hi} में सूर्य` : ''} के साथ, आपका व्यक्तित्व ${rashi.element.hi} लग्न ऊर्जा${moonSign ? ` और ${moonSign.element.hi} भावनात्मक प्रकृति` : ''} का मिश्रण है।`
  );

  return {
    lagna: {
      title: t(locale, `${rashi.name.en} Ascendant (${rashi.name.hi} Lagna)`, `${rashi.name.hi} लग्न`, `${rashi.name.sa} लग्नम्`),
      content: lagnaContent,
      implications: lagnaImplications,
    },
    moonSign: {
      title: t(locale, `Moon Sign: ${moonSign?.name.en || ''}`, `चन्द्र राशि: ${moonSign?.name.hi || ''}`, `चन्द्रराशिः: ${moonSign?.name.sa || ''}`),
      content: moonContent,
      implications: moonImplications,
    },
    sunSign: {
      title: t(locale, `Sun Sign: ${sunSign?.name.en || ''}`, `सूर्य राशि: ${sunSign?.name.hi || ''}`, `सूर्यराशिः: ${sunSign?.name.sa || ''}`),
      content: sunContent,
      implications: '',
    },
    summary,
  };
}

function generatePlanetInsights(kundali: KundaliData, locale: Locale): PlanetInsight[] {
  return kundali.planets.map((p) => {
    const graha = GRAHAS[p.planet.id];
    const base = PLANET_HOUSE_BASE[p.planet.id]?.[p.house] || '';
    const depth = PLANET_HOUSE_DEPTH[p.planet.id]?.[p.house];

    // Try enhanced trilingual house data first
    const enhanced = getPlanetInHouseEnhanced(p.planet.id, p.house, locale);

    // Get planet-in-sign interpretation for richer personality context
    const signText = getPlanetInSignText(p.planet.id, p.sign, locale);

    let dignity: string | null = null;
    if (p.isExalted) dignity = t(locale, `${graha.name.en} ${DIGNITY_EFFECTS.exalted.en}`, `${graha.name.hi} ${DIGNITY_EFFECTS.exalted.hi}`);
    else if (p.isDebilitated) dignity = t(locale, `${graha.name.en} ${DIGNITY_EFFECTS.debilitated.en}`, `${graha.name.hi} ${DIGNITY_EFFECTS.debilitated.hi}`);
    else if (p.isOwnSign) dignity = t(locale, `${graha.name.en} ${DIGNITY_EFFECTS.ownSign.en}`, `${graha.name.hi} ${DIGNITY_EFFECTS.ownSign.hi}`);

    let retrogradeEffect: string | null = null;
    if (p.isRetrograde && p.planet.id <= 6) {
      retrogradeEffect = t(locale, `${graha.name.en} ${DIGNITY_EFFECTS.retrograde.en}`, `${graha.name.hi} ${DIGNITY_EFFECTS.retrograde.hi}`);
    }

    // Build description: house base + sign text for comprehensive insight
    let description = '';
    if (enhanced) {
      description = enhanced.general;
    } else if (locale === 'en') {
      description = base;
    } else {
      description = t(locale,
        base,
        `${graha.name.hi} ${p.house}वें भाव में ${p.signName[locale]} राशि में विराजमान है। ${base}`,
        `${graha.name.sa} ${p.house} भावे ${p.signName.sa} राशौ स्थितः।`
      );
    }
    // Append sign-based interpretation
    if (signText) {
      description = description + '\n\n' + signText;
    }

    return {
      planetId: p.planet.id,
      planetName: graha.name[locale],
      planetColor: graha.color,
      house: p.house,
      signName: p.signName[locale],
      description,
      implications: enhanced?.implications || depth?.implications || '',
      prognosis: enhanced?.prognosis || depth?.prognosis || '',
      dignity,
      retrogradeEffect,
    };
  });
}

function generateYogas(kundali: KundaliData, locale: Locale): YogaInsight[] {
  const yogas: YogaInsight[] = [];
  const planets = kundali.planets;
  const getP = (id: number) => planets.find(p => p.planet.id === id);
  const KENDRA = [1, 4, 7, 10];
  const TRIKONA = [1, 5, 9];

  const jup = getP(4); const moon = getP(1); const sun = getP(0);
  const merc = getP(3); const ven = getP(5); const mars = getP(2);
  const sat = getP(6); const rahu = getP(7); const ketu = getP(8);

  // Gajakesari
  const gkPresent = !!(jup && moon && KENDRA.includes(((jup.house - moon.house + 12) % 12) + 1));
  yogas.push({
    name: t(locale, 'Gajakesari Yoga', 'गजकेसरी योग', 'गजकेसरीयोगः'),
    present: gkPresent, type: 'Raja',
    description: t(locale, 'Jupiter in a Kendra from Moon. Bestows wisdom, fame, wealth, and a respected position in society.', 'बृहस्पति चन्द्रमा से केन्द्र में। ज्ञान, यश, धन और समाज में सम्मानित स्थान प्रदान करता है।'),
    implications: gkPresent ? t(locale, 'You will gain recognition through wisdom and good counsel. Financial stability comes through knowledge-based careers. Children and students benefit from your guidance. Social status rises naturally.', 'ज्ञान और अच्छे परामर्श से मान्यता मिलेगी। ज्ञान-आधारित कैरियर से आर्थिक स्थिरता।') : '',
    strength: gkPresent ? (jup?.isRetrograde ? 'Moderate' : 'Strong') : 'Weak',
  });

  // Budhaditya
  const baPresent = !!(sun && merc && sun.house === merc.house);
  yogas.push({
    name: t(locale, 'Budhaditya Yoga', 'बुधादित्य योग', 'बुधादित्ययोगः'),
    present: baPresent, type: 'Other',
    description: t(locale, 'Sun and Mercury conjunct. Grants sharp intellect, analytical mind, and success in education and communication.', 'सूर्य और बुध युति। तीक्ष्ण बुद्धि, विश्लेषणात्मक मन, शिक्षा और संवाद में सफलता।'),
    implications: baPresent ? t(locale, 'Your intelligence combined with communication ability makes you effective in writing, teaching, business, and administration. Intellectual authority develops naturally.', 'बुद्धि और संवाद क्षमता का संयोग लेखन, शिक्षण, व्यापार में प्रभावी बनाता है।') : '',
    strength: baPresent ? (sun && merc && Math.abs(sun.longitude - merc.longitude) < 10 ? 'Strong' : 'Moderate') : 'Weak',
  });

  // Pancha Mahapurusha: Ruchaka, Bhadra, Hamsa, Malavya, Shasha
  const mahapurusha: Array<{ id: number; name: Record<Locale, string>; own: number[]; exalt: number; desc: Record<Locale, string>; impl: Record<Locale, string> }> = [
    { id: 2, name: { en: 'Ruchaka Yoga', hi: 'रुचक योग', sa: 'रुचकयोगः' }, own: [1, 8], exalt: 10, desc: { en: 'Mars exalted/own sign in Kendra. Grants courage, military leadership, physical strength.', hi: 'मंगल केन्द्र में उच्च/स्वगृह। साहस, सैनिक नेतृत्व, शारीरिक बल।', sa: 'मङ्गलः केन्द्रे उच्चे स्वगृहे वा।' }, impl: { en: 'Commanding presence and leadership in competitive fields. Property gains through courage. Physical prowess sustains throughout life.', hi: 'प्रतिस्पर्धी क्षेत्रों में नेतृत्व। साहस से सम्पत्ति लाभ।', sa: '' } },
    { id: 3, name: { en: 'Bhadra Yoga', hi: 'भद्र योग', sa: 'भद्रयोगः' }, own: [3, 6], exalt: 6, desc: { en: 'Mercury exalted/own sign in Kendra. Grants eloquence, intelligence, business acumen.', hi: 'बुध केन्द्र में उच्च/स्वगृह। वाक्पटुता, बुद्धिमत्ता, व्यापार कौशल।', sa: 'बुधः केन्द्रे उच्चे स्वगृहे वा।' }, impl: { en: 'Exceptional communication creates business and academic success. Multiple income sources through intellectual ability.', hi: 'असाधारण संवाद से व्यापार और शैक्षिक सफलता।', sa: '' } },
    { id: 4, name: { en: 'Hamsa Yoga', hi: 'हंस योग', sa: 'हंसयोगः' }, own: [9, 12], exalt: 4, desc: { en: 'Jupiter exalted/own sign in Kendra. Grants wisdom, spirituality, good fortune.', hi: 'बृहस्पति केन्द्र में उच्च/स्वगृह। ज्ञान, आध्यात्मिकता, सौभाग्य।', sa: 'बृहस्पतिः केन्द्रे उच्चे स्वगृहे वा।' }, impl: { en: 'Profound wisdom attracts respect and prosperity. Natural spiritual authority. Children and education are blessed.', hi: 'गहन ज्ञान सम्मान और समृद्धि आकर्षित करता है।', sa: '' } },
    { id: 5, name: { en: 'Malavya Yoga', hi: 'मालव्य योग', sa: 'मालव्ययोगः' }, own: [2, 7], exalt: 12, desc: { en: 'Venus exalted/own sign in Kendra. Grants beauty, luxury, artistic talent.', hi: 'शुक्र केन्द्र में उच्च/स्वगृह। सौन्दर्य, विलासिता, कलात्मक प्रतिभा।', sa: 'शुक्रः केन्द्रे उच्चे स्वगृहे वा।' }, impl: { en: 'Artistic talent brings fame and wealth. Attractive personality opens doors. Comfortable, luxurious lifestyle.', hi: 'कलात्मक प्रतिभा से यश और धन। आकर्षक व्यक्तित्व।', sa: '' } },
    { id: 6, name: { en: 'Shasha Yoga', hi: 'शश योग', sa: 'शशयोगः' }, own: [10, 11], exalt: 7, desc: { en: 'Saturn exalted/own sign in Kendra. Grants authority, discipline, longevity.', hi: 'शनि केन्द्र में उच्च/स्वगृह। अधिकार, अनुशासन, दीर्घायु।', sa: 'शनिः केन्द्रे उच्चे स्वगृहे वा।' }, impl: { en: 'Authority through discipline and persistence. Organizational leadership. Long, productive career that improves with age.', hi: 'अनुशासन और दृढ़ता से अधिकार। संगठनात्मक नेतृत्व।', sa: '' } },
  ];

  for (const mp of mahapurusha) {
    const planet = getP(mp.id);
    const present = !!(planet && KENDRA.includes(planet.house) && (mp.own.includes(planet.sign) || mp.exalt === planet.sign));
    yogas.push({
      name: mp.name[locale], present, type: 'Pancha Mahapurusha',
      description: mp.desc[locale], implications: present ? mp.impl[locale] : '',
      strength: present ? (mp.exalt === planet?.sign ? 'Strong' : 'Moderate') : 'Weak',
    });
  }

  // Raja Yoga
  const beneficsK = planets.filter(p => [3, 4, 5].includes(p.planet.id) && KENDRA.includes(p.house));
  const beneficsT = planets.filter(p => [3, 4, 5].includes(p.planet.id) && TRIKONA.includes(p.house));
  const rajaPresent = beneficsK.length > 0 && beneficsT.length > 0;
  yogas.push({
    name: t(locale, 'Raja Yoga', 'राजयोग', 'राजयोगः'),
    present: rajaPresent, type: 'Raja',
    description: t(locale, 'Benefics in both Kendra and Trikona. Indicates power, authority, and social elevation.', 'शुभ ग्रह केन्द्र और त्रिकोण दोनों में। शक्ति, अधिकार और सामाजिक उन्नति।'),
    implications: rajaPresent ? t(locale, 'Rise to positions of power through merit. Social influence and authority grow over time. May hold office or advisory positions.', 'योग्यता से शक्ति पदों तक पहुँच। सामाजिक प्रभाव और अधिकार समय के साथ बढ़ते हैं।') : '',
    strength: rajaPresent ? 'Moderate' : 'Weak',
  });

  // Dhana Yoga
  const h2 = planets.filter(p => p.house === 2 && [4, 5].includes(p.planet.id));
  const h11 = planets.filter(p => p.house === 11 && [4, 5].includes(p.planet.id));
  const dhanaPresent = h2.length > 0 || h11.length > 0;
  yogas.push({
    name: t(locale, 'Dhana Yoga', 'धनयोग', 'धनयोगः'),
    present: dhanaPresent, type: 'Dhana',
    description: t(locale, 'Benefics in wealth houses (2nd/11th). Indicates financial prosperity and abundance.', 'शुभ ग्रह धन भावों (2/11) में। आर्थिक समृद्धि और प्रचुरता।'),
    implications: dhanaPresent ? t(locale, 'Financial prosperity flows through ethical means. Multiple income streams develop. Wealth accumulates especially after 35.', 'नैतिक साधनों से आर्थिक समृद्धि। विशेषकर 35 के बाद धन संचय।') : '',
    strength: dhanaPresent ? 'Moderate' : 'Weak',
  });

  // Chandra-Mangala Yoga
  const cmPresent = !!(moon && mars && moon.house === mars.house);
  yogas.push({
    name: t(locale, 'Chandra-Mangala Yoga', 'चन्द्र-मंगल योग', 'चन्द्रमङ्गलयोगः'),
    present: cmPresent, type: 'Dhana',
    description: t(locale, 'Moon-Mars conjunction. Wealth through self-effort, enterprise, and courage.', 'चन्द्र-मंगल युति। स्वप्रयास, उद्यम और साहस से धन।'),
    implications: cmPresent ? t(locale, 'Entrepreneurial spirit and earning through personal effort. Emotional courage drives financial success. Real estate and property dealings favorable.', 'उद्यमशीलता और व्यक्तिगत प्रयास से कमाई। भावनात्मक साहस आर्थिक सफलता प्रेरित करता है।') : '',
    strength: cmPresent ? 'Moderate' : 'Weak',
  });

  // Adhi Yoga
  if (moon) {
    const adhiH = [((moon.house + 4) % 12) + 1, ((moon.house + 5) % 12) + 1, ((moon.house + 6) % 12) + 1];
    const adhiP = planets.filter(p => [3, 4, 5].includes(p.planet.id) && adhiH.includes(p.house));
    const adhiPresent = adhiP.length >= 2;
    yogas.push({
      name: t(locale, 'Adhi Yoga', 'अधियोग', 'अधियोगः'),
      present: adhiPresent, type: 'Raja',
      description: t(locale, 'Benefics in 6th/7th/8th from Moon. Indicates prosperity, fame, and virtue.', 'चन्द्र से 6/7/8 में शुभ ग्रह। समृद्धि, यश और सद्गुण।'),
      implications: adhiPresent ? t(locale, 'Trustworthy reputation leads to positions of responsibility. Victory over adversaries through virtue. Polite demeanor attracts support.', 'विश्वसनीय प्रतिष्ठा से उत्तरदायित्व के पद। सद्गुण से शत्रुओं पर विजय।') : '',
      strength: adhiPresent ? (adhiP.length >= 3 ? 'Strong' : 'Moderate') : 'Weak',
    });
  }

  // Merge extended yogas from new module
  const extendedYogas = detectExtendedYogas(planets, kundali.houses, kundali.ascendant.sign, locale);
  // Avoid duplicates by checking names
  const existingNames = new Set(yogas.map(y => y.name));
  for (const ey of extendedYogas) {
    if (!existingNames.has(ey.name)) {
      yogas.push(ey);
    }
  }

  return yogas;
}

function generateDoshas(kundali: KundaliData, locale: Locale): DoshaInsight[] {
  const doshas: DoshaInsight[] = [];
  const planets = kundali.planets;
  const getP = (id: number) => planets.find(p => p.planet.id === id);

  // Manglik Dosha
  const mars = getP(2);
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const manglikPresent = !!(mars && manglikHouses.includes(mars.house));
  const manglikSeverity = !manglikPresent ? 'none' as const
    : [1, 7, 8].includes(mars!.house) ? 'severe' as const
    : [4, 12].includes(mars!.house) ? 'moderate' as const : 'mild' as const;

  doshas.push({
    name: t(locale, 'Manglik Dosha (Kuja Dosha)', 'मांगलिक दोष (कुज दोष)', 'माङ्गलिकदोषः'),
    present: manglikPresent, severity: manglikSeverity,
    description: manglikPresent
      ? t(locale,
          `Mars in house ${mars!.house} creates Manglik Dosha. This affects marriage timing and compatibility. Severity: ${manglikSeverity}. ${mars!.house === 1 ? 'Mars in 1st house creates high ego and aggression in relationships.' : mars!.house === 7 ? 'Mars in 7th house directly affects marriage — spouse may be dominating or conflicts arise.' : mars!.house === 8 ? 'Mars in 8th house creates obstacles in marital happiness and possible separation.' : mars!.house === 4 ? 'Mars in 4th house affects domestic peace and may cause property disputes.' : mars!.house === 12 ? 'Mars in 12th house increases expenses and may affect conjugal happiness.' : 'Mars in 2nd house can create harsh speech affecting family harmony.'}`,
          `मंगल ${mars!.house}वें भाव में मांगलिक दोष बनाता है। तीव्रता: ${manglikSeverity === 'severe' ? 'गम्भीर' : manglikSeverity === 'moderate' ? 'मध्यम' : 'हल्का'}। विवाह समय और अनुकूलता प्रभावित।`)
      : t(locale, 'No Manglik Dosha present. Mars is well-placed for harmonious marriage prospects.', 'मांगलिक दोष नहीं है। विवाह के लिए मंगल अनुकूल स्थिति में है।'),
    remedies: manglikPresent
      ? t(locale,
          'Remedies: 1) Kumbh Vivah ceremony before marriage. 2) Mangal Shanti Puja. 3) Recite Hanuman Chalisa on Tuesdays. 4) Marry after 28 for natural mitigation. 5) Matching with another Manglik is recommended.',
          'उपाय: 1) विवाह से पहले कुम्भ विवाह संस्कार। 2) मंगल शान्ति पूजा। 3) मंगलवार को हनुमान चालीसा पाठ। 4) 28 के बाद विवाह से स्वाभाविक शमन। 5) दूसरे मांगलिक से विवाह अनुशंसित।')
      : '',
  });

  // Kaal Sarp Dosha - proper detection
  const rahu = getP(7); const ketu = getP(8);
  let kaalSarpPresent = false;
  if (rahu && ketu) {
    const rahuH = rahu.house; const ketuH = ketu.house;
    const otherPlanets = planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
    // Check if all planets are between Rahu and Ketu (one direction)
    const between1 = otherPlanets.every(p => {
      const h = p.house;
      if (rahuH < ketuH) return h >= rahuH && h <= ketuH;
      return h >= rahuH || h <= ketuH;
    });
    const between2 = otherPlanets.every(p => {
      const h = p.house;
      if (ketuH < rahuH) return h >= ketuH && h <= rahuH;
      return h >= ketuH || h <= rahuH;
    });
    kaalSarpPresent = between1 || between2;
  }

  doshas.push({
    name: t(locale, 'Kaal Sarp Dosha', 'काल सर्प दोष', 'कालसर्पदोषः'),
    present: kaalSarpPresent,
    severity: kaalSarpPresent ? 'moderate' : 'none',
    description: kaalSarpPresent
      ? t(locale,
          `All planets are hemmed between Rahu (house ${rahu!.house}) and Ketu (house ${ketu!.house}). This creates Kaal Sarp Dosha — a karmic pattern from past lives causing periodic obstacles, delays, and unexpected challenges. It intensifies during Rahu-Ketu transits. However, it also grants resilience, depth of character, and eventual triumph through perseverance.`,
          `सभी ग्रह राहु (भाव ${rahu!.house}) और केतु (भाव ${ketu!.house}) के बीच घिरे हैं। यह काल सर्प दोष बनाता है — पूर्वजन्मों का कार्मिक पैटर्न जो आवधिक बाधाएँ, विलम्ब और अप्रत्याशित चुनौतियाँ लाता है। परन्तु यह लचीलापन और अन्ततः दृढ़ता से विजय भी प्रदान करता है।`)
      : t(locale, 'No Kaal Sarp Dosha. Planets are not hemmed between Rahu-Ketu axis, allowing freer expression of planetary energies.', 'काल सर्प दोष नहीं। ग्रह राहु-केतु अक्ष के बीच नहीं घिरे, ग्रहीय ऊर्जाओं की स्वतन्त्र अभिव्यक्ति।'),
    remedies: kaalSarpPresent
      ? t(locale, 'Remedies: 1) Kaal Sarp Dosha Nivaran Puja at Trimbakeshwar. 2) Nag Panchami worship. 3) Donate to snake conservation. 4) Recite Maha Mrityunjaya Mantra daily. 5) Visit Rahu-Ketu temples.', 'उपाय: 1) त्र्यम्बकेश्वर में काल सर्प दोष निवारण पूजा। 2) नाग पंचमी पूजा। 3) सर्प संरक्षण में दान। 4) महामृत्युंजय मन्त्र का दैनिक जप। 5) राहु-केतु मन्दिर दर्शन।')
      : '',
  });

  // Pitra Dosha (Sun with Rahu or Saturn afflicting Sun)
  const sun = getP(0);
  const pitraPresent = !!(sun && rahu && sun.house === rahu.house) || !!(sun && getP(6) && sun.house === getP(6)!.house && sun.isDebilitated);
  doshas.push({
    name: t(locale, 'Pitra Dosha', 'पितृ दोष', 'पितृदोषः'),
    present: pitraPresent,
    severity: pitraPresent ? 'moderate' : 'none',
    description: pitraPresent
      ? t(locale, 'Sun afflicted by Rahu or Saturn indicates Pitra Dosha — ancestral karmic debts affecting current life. This may manifest as obstacles in career, strained relationship with father, or delayed recognition.', 'सूर्य पर राहु या शनि का दुष्प्रभाव पितृ दोष इंगित करता है — पैतृक कार्मिक ऋण जो वर्तमान जीवन को प्रभावित करते हैं। कैरियर में बाधाएँ, पिता से तनावपूर्ण सम्बन्ध।')
      : t(locale, 'No significant Pitra Dosha. Sun is reasonably well-placed, suggesting good relationship with paternal lineage.', 'महत्वपूर्ण पितृ दोष नहीं। पैतृक वंश से अच्छा सम्बन्ध।'),
    remedies: pitraPresent
      ? t(locale, 'Remedies: 1) Perform Pitra Tarpan on Amavasya. 2) Shraddha ceremonies for ancestors. 3) Donate food to Brahmins. 4) Plant a Peepal tree. 5) Recite Surya mantra daily.', 'उपाय: 1) अमावस्या पर पितृ तर्पण। 2) पूर्वजों के लिए श्राद्ध संस्कार। 3) ब्राह्मणों को भोजन दान। 4) पीपल वृक्ष लगाएँ। 5) सूर्य मन्त्र का दैनिक जप।')
      : '',
  });

  // Merge extended doshas from new module
  const extendedDoshas = detectExtendedDoshas(kundali.planets, kundali.houses, kundali.ascendant.sign, locale);
  const existingDoshaNames = new Set(doshas.map(d => d.name));
  for (const ed of extendedDoshas) {
    if (!existingDoshaNames.has(ed.name)) {
      doshas.push(ed);
    }
  }

  return doshas;
}

function generateLifeAreas(kundali: KundaliData, locale: Locale): LifeAreaSection {
  const planets = kundali.planets;
  const houses = kundali.houses;
  const getP = (id: number) => planets.find(p => p.planet.id === id);

  function rateHouse(houseNum: number, beneficIds: number[]): number {
    const planetsIn = planets.filter(p => p.house === houseNum);
    let score = 5;
    for (const p of planetsIn) {
      if (beneficIds.includes(p.planet.id)) score += 1.5;
      if ([2, 6, 7, 8].includes(p.planet.id)) score -= 0.5;
      if (p.isExalted) score += 1;
      if (p.isDebilitated) score -= 1;
      if (p.isOwnSign) score += 0.5;
    }
    return Math.max(1, Math.min(10, Math.round(score)));
  }

  const sun = getP(0); const moon = getP(1); const mars = getP(2);
  const merc = getP(3); const jup = getP(4); const ven = getP(5); const sat = getP(6);

  // Career (10th house + Sun)
  const careerRating = rateHouse(10, [0, 4, 6]);
  const tenthHouse = houses.find(h => h.house === 10);
  const career: LifeArea = {
    label: t(locale, 'Career & Profession', 'कैरियर और पेशा', 'जीविका'),
    icon: 'briefcase',
    rating: careerRating,
    summary: t(locale,
      `10th house in ${tenthHouse?.signName.en || ''}. ${careerRating >= 7 ? 'Strong career potential with good planetary support.' : careerRating >= 5 ? 'Moderate career prospects — effort brings results.' : 'Career requires extra effort and patience to develop fully.'}`,
      `10वाँ भाव ${tenthHouse?.signName.hi || ''} में। ${careerRating >= 7 ? 'अच्छे ग्रहीय समर्थन से मजबूत कैरियर क्षमता।' : careerRating >= 5 ? 'मध्यम कैरियर सम्भावनाएँ — प्रयास से परिणाम।' : 'कैरियर के लिए अतिरिक्त प्रयास और धैर्य आवश्यक।'}`),
    details: t(locale,
      `Your 10th lord ${tenthHouse?.lordName.en || ''} guides your professional direction. ${sun && sun.house === 10 ? 'Sun in 10th is one of the best placements for career — expect authority and recognition.' : ''} ${sat && sat.house === 10 ? 'Saturn in 10th brings success through sustained, disciplined effort over time.' : ''} ${jup && jup.house === 10 ? 'Jupiter in 10th brings ethical leadership and respected professional standing.' : ''} Career development is strongest when aligned with your ascendant element.`,
      `10वें भाव का स्वामी ${tenthHouse?.lordName.hi || ''} आपकी पेशेवर दिशा निर्धारित करता है। ${sun && sun.house === 10 ? 'सूर्य 10वें भाव में कैरियर के लिए सर्वोत्तम स्थिति।' : ''}`),
  };

  // Wealth (2nd + 11th house + Jupiter)
  const wealthRating = Math.round((rateHouse(2, [4, 5]) + rateHouse(11, [4, 5])) / 2);
  const wealth: LifeArea = {
    label: t(locale, 'Wealth & Finance', 'धन और वित्त', 'धनम्'),
    icon: 'coins',
    rating: wealthRating,
    summary: t(locale,
      `${wealthRating >= 7 ? 'Strong wealth indicators. Financial prosperity through multiple channels.' : wealthRating >= 5 ? 'Moderate financial prospects. Steady income with disciplined saving.' : 'Financial growth requires patience and careful planning.'}`,
      `${wealthRating >= 7 ? 'मजबूत धन संकेतक। विभिन्न माध्यमों से आर्थिक समृद्धि।' : wealthRating >= 5 ? 'मध्यम वित्तीय सम्भावनाएँ। अनुशासित बचत से स्थिर आय।' : 'आर्थिक विकास के लिए धैर्य और सावधानीपूर्ण योजना आवश्यक।'}`),
    details: t(locale,
      `${jup && [2, 5, 9, 11].includes(jup.house) ? 'Jupiter\'s placement supports wealth accumulation through wisdom and ethical means.' : ''} ${ven && [2, 4, 11].includes(ven.house) ? 'Venus supports earning through beauty, art, or luxury industries.' : ''} Primary wealth-building period begins after the 2nd lord\'s dasha activates.`,
      `${jup && [2, 5, 9, 11].includes(jup.house) ? 'बृहस्पति की स्थिति ज्ञान और नैतिक साधनों से धन संचय का समर्थन करती है।' : ''}`),
  };

  // Marriage (7th house + Venus)
  const marriageRating = rateHouse(7, [4, 5, 1]);
  const seventhHouse = houses.find(h => h.house === 7);
  const marriage: LifeArea = {
    label: t(locale, 'Marriage & Relationships', 'विवाह और सम्बन्ध', 'विवाहः'),
    icon: 'heart',
    rating: marriageRating,
    summary: t(locale,
      `7th house in ${seventhHouse?.signName.en || ''}. ${marriageRating >= 7 ? 'Favorable marriage prospects with supportive planetary influences.' : marriageRating >= 5 ? 'Marriage brings both growth and challenges — mutual effort required.' : 'Relationship area requires patience and conscious effort.'}`,
      `7वाँ भाव ${seventhHouse?.signName.hi || ''} में। ${marriageRating >= 7 ? 'अनुकूल विवाह सम्भावनाएँ।' : marriageRating >= 5 ? 'विवाह विकास और चुनौतियाँ दोनों लाता है।' : 'सम्बन्ध क्षेत्र में धैर्य और सचेत प्रयास आवश्यक।'}`),
    details: t(locale,
      `7th lord ${seventhHouse?.lordName.en || ''} determines the nature of partnerships. ${ven && ven.isExalted ? 'Exalted Venus strongly favors a beautiful, harmonious marriage.' : ''} ${mars && mars.house === 7 ? 'Mars in 7th (Manglik) indicates a strong-willed spouse — passion and patience both needed.' : ''} ${sat && sat.house === 7 ? 'Saturn in 7th delays marriage but brings a mature, lasting partnership.' : ''}`,
      `7वें भाव का स्वामी ${seventhHouse?.lordName.hi || ''} साझेदारी का स्वरूप निर्धारित करता है।`),
  };

  // Health (1st + 6th house)
  const healthRating = Math.round((rateHouse(1, [4, 5]) + rateHouse(6, [0, 2])) / 2);
  const health: LifeArea = {
    label: t(locale, 'Health & Wellbeing', 'स्वास्थ्य और कल्याण', 'स्वास्थ्यम्'),
    icon: 'heart-pulse',
    rating: healthRating,
    summary: t(locale,
      `${healthRating >= 7 ? 'Strong vitality and good health constitution. Natural resilience.' : healthRating >= 5 ? 'Generally good health with specific areas needing attention.' : 'Health requires regular attention and preventive care.'}`,
      `${healthRating >= 7 ? 'मजबूत जीवन शक्ति और अच्छी स्वास्थ्य संरचना।' : healthRating >= 5 ? 'सामान्यतः अच्छा स्वास्थ्य, विशेष क्षेत्रों पर ध्यान आवश्यक।' : 'स्वास्थ्य को नियमित ध्यान और निवारक देखभाल की आवश्यकता।'}`),
    details: t(locale,
      `${sun && sun.isExalted ? 'Exalted Sun gives excellent vitality and recovery power.' : ''} ${mars && [1, 6].includes(mars.house) ? 'Mars in angular/6th house gives physical strength and ability to fight disease.' : ''} Focus areas based on your ascendant element: ${RASHIS[kundali.ascendant.sign - 1]?.element.en === 'Fire' ? 'inflammation, fever, head' : RASHIS[kundali.ascendant.sign - 1]?.element.en === 'Earth' ? 'metabolism, bones, skin' : RASHIS[kundali.ascendant.sign - 1]?.element.en === 'Air' ? 'nervous system, lungs, circulation' : 'digestion, immunity, water balance'}.`,
      `लग्न तत्व के आधार पर स्वास्थ्य ध्यान क्षेत्र: ${RASHIS[kundali.ascendant.sign - 1]?.element.hi}।`),
  };

  // Education (4th + 5th + Mercury)
  const eduRating = Math.round((rateHouse(4, [3, 4]) + rateHouse(5, [3, 4])) / 2);
  const education: LifeArea = {
    label: t(locale, 'Education & Learning', 'शिक्षा और ज्ञान', 'शिक्षा'),
    icon: 'graduation-cap',
    rating: eduRating,
    summary: t(locale,
      `${eduRating >= 7 ? 'Excellent academic potential with strong intellectual planets.' : eduRating >= 5 ? 'Good learning ability — focused effort yields academic success.' : 'Education may require extra dedication but perseverance pays off.'}`,
      `${eduRating >= 7 ? 'मजबूत बौद्धिक ग्रहों के साथ उत्कृष्ट शैक्षिक क्षमता।' : eduRating >= 5 ? 'अच्छी सीखने की क्षमता — केन्द्रित प्रयास से शैक्षिक सफलता।' : 'शिक्षा में अतिरिक्त समर्पण आवश्यक।'}`),
    details: t(locale,
      `${merc && [1, 4, 5, 10].includes(merc.house) ? 'Mercury well-placed for strong analytical and communication abilities.' : ''} ${jup && [4, 5, 9].includes(jup.house) ? 'Jupiter supports higher education, wisdom, and scholarly pursuits.' : ''} Your learning style aligns with ${RASHIS[kundali.ascendant.sign - 1]?.element.en === 'Fire' ? 'hands-on, experiential learning' : RASHIS[kundali.ascendant.sign - 1]?.element.en === 'Earth' ? 'structured, practical learning' : RASHIS[kundali.ascendant.sign - 1]?.element.en === 'Air' ? 'conceptual, theoretical learning' : 'intuitive, experiential learning'}.`,
      `आपकी सीखने की शैली ${RASHIS[kundali.ascendant.sign - 1]?.element.hi} तत्व से मेल खाती है।`),
  };

  // Use enhanced life area analysis
  const ascSign = kundali.ascendant.sign;
  const enhancedCareer = analyzeCareerEnhanced(planets, houses, ascSign, locale);
  const enhancedWealth = analyzeWealthEnhanced(planets, houses, ascSign, locale);
  const enhancedMarriage = analyzeMarriageEnhanced(planets, houses, ascSign, locale);
  const enhancedHealth = analyzeHealthEnhanced(planets, houses, ascSign, locale);
  const enhancedEducation = analyzeEducationEnhanced(planets, houses, ascSign, locale);

  return {
    career: enhancedCareer,
    wealth: enhancedWealth,
    marriage: enhancedMarriage,
    health: enhancedHealth,
    education: enhancedEducation,
  };
}

function generateDashaInsight(kundali: KundaliData, locale: Locale): DashaInsightSection {
  const now = new Date();
  let currentMaha = '';
  let currentMahaAnalysis = '';
  let currentAntar = '';
  let currentAntarAnalysis = '';
  let upcoming = '';

  for (const d of kundali.dashas) {
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    if (now >= start && now <= end) {
      currentMaha = t(locale, `${d.planet} Mahadasha`, `${d.planetName[locale]} महादशा`);

      // Enhanced dasha lord analysis (dignity-conditioned)
      const enhancedAnalysis = getDashaLordAnalysis(d.planet, kundali.planets, kundali.houses, kundali.ascendant.sign, locale);
      const baseEffect = DASHA_EFFECTS[d.planet];
      currentMahaAnalysis = enhancedAnalysis.overall
        ? `${enhancedAnalysis.overall}\n\n${enhancedAnalysis.dignityEffect}\n\n${enhancedAnalysis.houseEffect}\n\n${enhancedAnalysis.advice}`
        : baseEffect ? (locale === 'en' ? `${d.planet} Mahadasha ${baseEffect.en}` : `${d.planetName[locale]} महादशा ${baseEffect.hi}`) : '';

      if (d.subPeriods) {
        for (const sub of d.subPeriods) {
          const ss = new Date(sub.startDate);
          const se = new Date(sub.endDate);
          if (now >= ss && now <= se) {
            currentAntar = t(locale, `${sub.planet} Antardasha`, `${sub.planetName[locale]} अन्तर्दशा`);

            // Enhanced antardasha interaction
            const interaction = getAntardashaInteraction(d.planet, sub.planet, locale);
            const subEffect = DASHA_EFFECTS[sub.planet];
            currentAntarAnalysis = interaction || (subEffect ? (locale === 'en' ? `Within the ${d.planet} period, ${sub.planet} sub-period ${subEffect.en}` : `${d.planetName[locale]} काल में, ${sub.planetName[locale]} उपकाल ${subEffect.hi}`) : '');

            // Next sub-period
            const subIdx = d.subPeriods.indexOf(sub);
            if (subIdx < d.subPeriods.length - 1) {
              const next = d.subPeriods[subIdx + 1];
              const nextEffect = DASHA_EFFECTS[next.planet];
              upcoming = t(locale,
                `Next: ${next.planet} Antardasha (from ${next.startDate}). ${nextEffect ? nextEffect.en : ''}`,
                `अगला: ${next.planetName[locale]} अन्तर्दशा (${next.startDate} से)। ${nextEffect ? nextEffect.hi : ''}`);
            }
            break;
          }
        }
      }
      break;
    }
  }

  return { currentMaha, currentMahaAnalysis, currentAntar, currentAntarAnalysis, upcoming };
}

function generateRemedies(kundali: KundaliData, locale: Locale): RemedySection {
  return getRemediesForWeakPlanets(kundali.planets, kundali.shadbala, kundali.ascendant.sign, locale);
}

function generateStrengthOverview(kundali: KundaliData, locale: Locale): StrengthEntry[] {
  return kundali.shadbala.map(s => {
    const graha = GRAHAS.find(g => g.name.en === s.planet);
    return {
      planetName: s.planetName[locale],
      planetColor: graha?.color || '#888',
      strength: s.totalStrength,
      status: t(locale,
        s.totalStrength >= 60 ? 'Strong' : s.totalStrength >= 40 ? 'Average' : 'Weak',
        s.totalStrength >= 60 ? 'बलवान' : s.totalStrength >= 40 ? 'सामान्य' : 'दुर्बल'),
    };
  });
}

// ===== MAIN EXPORT =====

export function generateTippanni(kundali: KundaliData, locale: Locale): TippanniContent {
  return {
    yearPredictions: generateYearPredictions(kundali, locale),
    personality: generatePersonality(kundali, locale),
    planetInsights: generatePlanetInsights(kundali, locale),
    yogas: generateYogas(kundali, locale),
    doshas: generateDoshas(kundali, locale),
    lifeAreas: generateLifeAreas(kundali, locale),
    dashaInsight: generateDashaInsight(kundali, locale),
    remedies: generateRemedies(kundali, locale),
    strengthOverview: generateStrengthOverview(kundali, locale),
  };
}
