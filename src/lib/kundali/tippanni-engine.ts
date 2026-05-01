/**
 * Tippanni Interpretation Engine
 * Generates comprehensive interpretive commentary from KundaliData
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { LAGNA_DEEP } from './tippanni-lagna';
import { getLifeStageContext } from './life-stage';
import { generateDashaSynthesis } from '@/lib/tippanni/dasha-synthesis';
import { PLANET_HOUSE_DEPTH, DIGNITY_EFFECTS, DASHA_EFFECTS } from './tippanni-planets';
import { BPHS_PLANET_IN_HOUSE } from '@/lib/constants/bphs-planet-in-house';
import { YOGA_CITATIONS } from '@/lib/constants/bphs-yogas';
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
import { findDoshaCitations } from '@/lib/constants/bphs-doshas';
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

function t(locale: Locale, en: string, hi: string, _sa?: string): string {
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
    ? `${lagna.personality[locale]}\n\n${t(locale, 'Career:', 'कैरियर:', 'जीविका:')}\n${lagna.career[locale]}\n\n${t(locale, 'Health:', 'स्वास्थ्य:', 'स्वास्थ्यम्:')}\n${lagna.health[locale]}`
    : t(locale, `${rashi.name.en} Ascendant shapes your personality.`, `${rashi.name.hi} लग्न आपके व्यक्तित्व को आकार देता है।`);

  const lagnaImplications = lagna
    ? `${t(locale, 'Relationships:', 'सम्बन्ध:', 'सम्बन्धाः:')}\n${lagna.relationships[locale]}\n\n${t(locale, 'Finances:', 'वित्त:', 'वित्तम्:')}\n${lagna.finances[locale]}\n\n${t(locale, 'Spiritual Path:', 'आध्यात्मिक मार्ग:', 'आध्यात्मिकमार्गः:')}\n${lagna.spiritual[locale]}`
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

  let summary = t(locale,
    `With ${rashi.name.en} rising${moonSign ? `, Moon in ${moonSign.name.en}` : ''}${sunSign ? `, and Sun in ${sunSign.name.en}` : ''}, you blend ${rashi.element.en.toLowerCase()} ascendant energy with ${moonSign?.element.en.toLowerCase() || ''} emotional nature${sunSign ? ` and ${sunSign.element.en.toLowerCase()} soul purpose` : ''}. This combination shapes a personality that is ${rashi.element.en === 'Fire' ? 'dynamic and action-oriented' : rashi.element.en === 'Earth' ? 'grounded and practical' : rashi.element.en === 'Air' ? 'intellectual and communicative' : 'intuitive and emotionally deep'}.`,
    `${rashi.name.hi} लग्न${moonSign ? `, ${moonSign.name.hi} में चन्द्रमा` : ''}${sunSign ? `, और ${sunSign.name.hi} में सूर्य` : ''} के साथ, आपका व्यक्तित्व ${rashi.element.hi} लग्न ऊर्जा${moonSign ? ` और ${moonSign.element.hi} भावनात्मक प्रकृति` : ''} का मिश्रण है।`
  );

  // Enrich with lagna lord's condition from real data
  const signLords: Record<number, number> = { 1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4 };
  const lagnaLordId = signLords[ascSign];
  if (lagnaLordId !== undefined) {
    const lagnaLordGraha = GRAHAS[lagnaLordId];
    const enrichParts: string[] = [];

    // Lagna lord shadbala
    if (kundali.fullShadbala) {
      const sb = kundali.fullShadbala.find(s => s.planetId === lagnaLordId);
      if (sb) {
        const strong = sb.strengthRatio >= 1.0;
        enrichParts.push(t(locale,
          `Your lagna lord ${lagnaLordGraha.name.en} has ${sb.rupas.toFixed(1)} rupas (${strong ? 'strong — personality traits manifest fully' : 'weak — personality may feel suppressed or delayed in expression'}).`,
          `आपका लग्नेश ${lagnaLordGraha.name.hi} ${sb.rupas.toFixed(1)} रूप (${strong ? 'बलवान — व्यक्तित्व पूर्ण रूप से प्रकट' : 'दुर्बल — व्यक्तित्व अभिव्यक्ति में विलम्ब'})।`));
      }
    }

    // Lagna lord avastha
    if (kundali.avasthas) {
      const av = kundali.avasthas.find((a: { planetId: number }) => a.planetId === lagnaLordId);
      if (av?.baladi) {
        enrichParts.push(t(locale,
          `Lagna lord in ${av.baladi.name.en} avastha — ${av.baladi.state === 'bala' ? 'youthful energy, still developing' : av.baladi.state === 'kumara' ? 'adolescent energy, growing confidence' : av.baladi.state === 'yuva' ? 'peak expression, full vitality' : av.baladi.state === 'vriddha' ? 'mature wisdom, measured expression' : 'diminished vitality, inner focus'}.`,
          `लग्नेश ${av.baladi.name.hi} अवस्था में।`));
      }
    }

    if (enrichParts.length > 0) {
      summary += '\n\n' + enrichParts.join(' ');
    }
  }

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

    // Enrich with avasthas (planetary state) from real computed data
    if (kundali.avasthas) {
      const av = kundali.avasthas.find((a: { planetId: number }) => a.planetId === p.planet.id);
      if (av) {
        const parts: string[] = [];
        if (av.baladi) parts.push(t(locale, `Age state: ${av.baladi.name.en}`, `आयु अवस्था: ${av.baladi.name.hi}`));
        if (av.deeptadi) parts.push(t(locale, `Luminosity: ${av.deeptadi.name.en}`, `दीप्ति: ${av.deeptadi.name.hi}`));
        if (parts.length > 0) {
          description += '\n\n' + parts.join('. ') + '.';
        }
      }
    }

    // Enrich with functional nature (yogaKaraka, maraka, etc.)
    if (kundali.functionalNature) {
      const fn = kundali.functionalNature.planets?.find((f: { planetId: number }) => f.planetId === p.planet.id);
      if (fn) {
        const roleText = fn.nature === 'yogaKaraka'
          ? t(locale, `${graha.name.en} is your YogaKaraka — the single most beneficial planet for your lagna.`, `${graha.name.hi} आपका योगकारक है — आपके लग्न के लिए सबसे शुभ ग्रह।`)
          : fn.nature === 'maraka'
          ? t(locale, `${graha.name.en} is a Maraka (death-inflicting) planet for your lagna — handle its periods with care.`, `${graha.name.hi} आपके लग्न के लिए मारक ग्रह है।`)
          : fn.nature === 'badhak'
          ? t(locale, `${graha.name.en} is the Badhaka (obstructing) planet for your lagna.`, `${graha.name.hi} आपके लग्न के लिए बाधक ग्रह है।`)
          : fn.nature === 'funcBenefic'
          ? t(locale, `${graha.name.en} is a functional benefic for your lagna.`, `${graha.name.hi} आपके लग्न के लिए कार्यात्मक शुभ ग्रह है।`)
          : fn.nature === 'funcMalefic'
          ? t(locale, `${graha.name.en} is a functional malefic for your lagna.`, `${graha.name.hi} आपके लग्न के लिए कार्यात्मक पापी ग्रह है।`)
          : '';
        if (roleText) description += '\n\n' + roleText;
      }
    }

    // Enrich with Vimshopaka Bala (multi-varga dignity score)
    if (kundali.vimshopakaBala) {
      const vb = kundali.vimshopakaBala.find((v: { planetId: number }) => v.planetId === p.planet.id);
      if (vb) {
        const vbScore = vb.total || 0;
        if (vbScore > 0) {
          const vbLabel = vbScore >= 15 ? t(locale, 'excellent', 'उत्कृष्ट')
            : vbScore >= 10 ? t(locale, 'good', 'अच्छा')
            : vbScore >= 5 ? t(locale, 'moderate', 'मध्यम')
            : t(locale, 'weak', 'दुर्बल');
          description += '\n\n' + t(locale,
            `Vimshopaka dignity: ${vbScore.toFixed(1)}/20 (${vbLabel}) — dignity across 16 divisional charts (separate from Shadbala strength).`,
            `विंशोपक बल: ${vbScore.toFixed(1)}/20 (${vbLabel}) — 16 वर्ग कुण्डलियों में गरिमा (षड्बल से पृथक)।`);
        }
      }
    }

    // Enrich with real Shadbala strength
    if (kundali.fullShadbala) {
      const sb = kundali.fullShadbala.find(s => s.planetId === p.planet.id);
      if (sb) {
        const ratio = sb.strengthRatio;
        const sbLabel = ratio >= 1.5 ? t(locale, 'strong', 'बलवान')
          : ratio >= 1.0 ? t(locale, 'adequate', 'पर्याप्त')
          : t(locale, 'weak', 'दुर्बल');
        description += '\n\n' + t(locale,
          `Shadbala: ${sb.rupas.toFixed(1)} rupas (${sbLabel}, ${(ratio * 100).toFixed(0)}% of required minimum).`,
          `षड्बल: ${sb.rupas.toFixed(1)} रूप (${sbLabel}, आवश्यक न्यूनतम का ${(ratio * 100).toFixed(0)}%)।`);
      }
    }

    // Static BPHS classical citations as fallback (always available without RAG/LLM)
    const staticCitations = BPHS_PLANET_IN_HOUSE[p.planet.id]?.[p.house];
    const classicalReferences = staticCitations ? {
      summary: `Classical interpretation from BPHS ${staticCitations[0].chapter === 47 ? 'Chapter 47' : 'Chapter 24'} for ${graha.name.en} in the ${p.house}${p.house === 1 ? 'st' : p.house === 2 ? 'nd' : p.house === 3 ? 'rd' : 'th'} house.`,
      citations: staticCitations,
      confidence: 'high' as const,
    } : undefined;

    return {
      planetId: p.planet.id,
      planetName: graha.name[locale] || "",
      planetColor: graha.color,
      house: p.house,
      signName: p.signName[locale] || "",
      description,
      implications: enhanced?.implications || depth?.implications || '',
      prognosis: enhanced?.prognosis || depth?.prognosis || '',
      dignity,
      retrogradeEffect,
      classicalReferences,
    };
  });
}

function generateYogas(kundali: KundaliData, locale: Locale): YogaInsight[] {
  let yogaInsights: YogaInsight[];

  // Use yogasComplete (150+ properly computed yogas) when available
  if (kundali.yogasComplete && kundali.yogasComplete.length > 0) {
    yogaInsights = kundali.yogasComplete
      .filter(y => y.present)
      .map(y => ({
        name: y.name[locale] || y.name.en,
        present: true,
        type: y.category === 'raja' ? 'Raja' : (y.category as string) === 'dhana' ? 'Dhana' :
              (y.category as string) === 'pancha_mahapurusha' ? 'Pancha Mahapurusha' : 'Other',
        description: y.description[locale] || y.description.en,
        implications: y.formationRule[locale] || y.formationRule.en,
        strength: y.strength,
      }));
  } else {
    // Fallback: manual detection (only if yogasComplete is unavailable)
    yogaInsights = [];
    const planets = kundali.planets;
    const extendedYogas = detectExtendedYogas(planets, kundali.houses, kundali.ascendant.sign, locale);
    for (const ey of extendedYogas) yogaInsights.push(ey);
  }

  // Attach classical BPHS/Phaladeepika citations where available
  // Lookup uses the English yoga name (lowercase) since YOGA_CITATIONS is keyed that way.
  // For non-English locales, we also try the English name from yogasComplete.
  for (const yoga of yogaInsights) {
    if (!yoga.classicalReferences) {
      // Try the resolved (possibly localized) name first, then fall back to English
      const key = yoga.name.toLowerCase().trim();
      const citations = YOGA_CITATIONS[key];
      if (citations) {
        yoga.classicalReferences = {
          summary: `Classical references for ${yoga.name}`,
          citations,
          confidence: 'high',
        };
      }
    }
  }

  // For non-English locales, the name won't match — try matching via yogasComplete English names
  if (locale !== 'en' && kundali.yogasComplete) {
    const enNameMap = new Map<string, string>();
    for (const y of kundali.yogasComplete) {
      const localeName = y.name[locale] || y.name.en;
      enNameMap.set(localeName, y.name.en);
    }
    for (const yoga of yogaInsights) {
      if (!yoga.classicalReferences) {
        const enName = enNameMap.get(yoga.name);
        if (enName) {
          const citations = YOGA_CITATIONS[enName.toLowerCase().trim()];
          if (citations) {
            yoga.classicalReferences = {
              summary: `Classical references for ${enName}`,
              citations,
              confidence: 'high',
            };
          }
        }
      }
    }
  }

  return yogaInsights;
}

function generateDoshas(kundali: KundaliData, locale: Locale): DoshaInsight[] {
  // Use yogasComplete dosha category when available
  if (kundali.yogasComplete && kundali.yogasComplete.length > 0) {
    const doshaYogas = kundali.yogasComplete.filter(y => y.category === 'dosha' && y.present);
    if (doshaYogas.length > 0) {
      return doshaYogas.map(y => ({
        name: y.name[locale] || y.name.en,
        present: true,
        severity: y.strength === 'Strong' ? 'severe' as const : y.strength === 'Moderate' ? 'moderate' as const : 'mild' as const,
        description: (y.description[locale] || y.description.en)
          + '\n\n' + t(locale, 'Formation: ', 'निर्माण: ') + (y.formationRule[locale] || y.formationRule.en),
        remedies: '',
      }));
    }
    return []; // No doshas present
  }

  // Fallback: manual detection
  const doshas: DoshaInsight[] = [];
  const planets = kundali.planets;
  const getP = (id: number) => planets.find(p => p.planet.id === id);

  // Manglik Dosha with cancellation conditions
  const mars = getP(2);
  const jupiter = getP(4);
  const venus = getP(5);
  const saturn = getP(6);
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const manglikPresent = !!(mars && manglikHouses.includes(mars.house));
  const manglikSeverity = !manglikPresent ? 'none' as const
    : [1, 7, 8].includes(mars!.house) ? 'severe' as const
    : [4, 12].includes(mars!.house) ? 'moderate' as const : 'mild' as const;

  // Manglik cancellation conditions (BPHS)
  const manglikCancellations: import('./tippanni-types').CancellationCondition[] = manglikPresent ? [
    { condition: t(locale, 'Mars in own sign (Aries/Scorpio) or exalted (Capricorn)', 'मंगल स्वराशि या उच्च'), met: !!(mars && (mars.isOwnSign || mars.isExalted)), source: 'BPHS Ch.77' },
    { condition: t(locale, 'Jupiter aspects Mars or 7th house', 'गुरु मंगल या 7वें भाव को देखे'), met: !!(jupiter && mars && (jupiter.house === mars.house || Math.abs(jupiter.house - 7) % 12 === 0 || [1,5,7,9].includes(((7 - jupiter.house + 12) % 12) + 1))), source: 'BPHS Ch.77' },
    { condition: t(locale, 'Venus in kendra (1,4,7,10)', 'शुक्र केन्द्र में'), met: !!(venus && [1,4,7,10].includes(venus.house)), source: 'Phala Deepika' },
    { condition: t(locale, 'Mars in Cancer or Leo sign', 'मंगल कर्क या सिंह राशि में'), met: !!(mars && [4,5].includes(mars.sign)), source: 'BPHS' },
    { condition: t(locale, 'Saturn aspects Mars', 'शनि मंगल को देखे'), met: !!(saturn && mars && [1,3,7,10].includes(((mars.house - saturn.house + 12) % 12) + 1)), source: 'Lal Kitab' },
    { condition: t(locale, 'Both partners are Manglik (mutual cancellation)', 'दोनों साथी मांगलिक (पारस्परिक निरसन)'), met: false, source: 'Traditional' },
  ] : [];

  const manglikMetCount = manglikCancellations.filter(c => c.met).length;
  const manglikEffective = !manglikPresent ? undefined : manglikMetCount >= 2 ? 'cancelled' as const : manglikMetCount === 1 ? 'partial' as const : 'full' as const;

  doshas.push({
    name: t(locale, 'Manglik Dosha (Kuja Dosha)', 'मांगलिक दोष (कुज दोष)', 'माङ्गलिकदोषः'),
    present: manglikPresent, severity: manglikSeverity,
    effectiveSeverity: manglikEffective,
    cancellationConditions: manglikCancellations.length > 0 ? manglikCancellations : undefined,
    activeDasha: manglikPresent ? t(locale, 'Activates strongly during Mars Mahadasha/Antardasha', 'मंगल महादशा/अंतर्दशा में तीव्र') : undefined,
    description: manglikPresent
      ? t(locale,
          `Mars in house ${mars!.house} creates Manglik Dosha. ${manglikEffective === 'cancelled' ? 'However, multiple cancellation conditions are met — dosha is effectively neutralized.' : manglikEffective === 'partial' ? 'One cancellation condition is met — dosha is partially mitigated.' : ''} Severity: ${manglikSeverity}. ${mars!.house === 1 ? 'Mars in 1st house creates high ego and aggression in relationships.' : mars!.house === 7 ? 'Mars in 7th house directly affects marriage — spouse may be dominating or conflicts arise.' : mars!.house === 8 ? 'Mars in 8th house creates obstacles in marital happiness and possible separation.' : mars!.house === 4 ? 'Mars in 4th house affects domestic peace and may cause property disputes.' : mars!.house === 12 ? 'Mars in 12th house increases expenses and may affect conjugal happiness.' : 'Mars in 2nd house can create harsh speech affecting family harmony.'}`,
          `मंगल ${mars!.house}वें भाव में मांगलिक दोष बनाता है। ${manglikEffective === 'cancelled' ? 'परन्तु, अनेक निरसन शर्तें पूर्ण — दोष प्रभावी रूप से निष्प्रभावित।' : manglikEffective === 'partial' ? 'एक निरसन शर्त पूर्ण — दोष आंशिक रूप से कम।' : ''} तीव्रता: ${manglikSeverity === 'severe' ? 'गम्भीर' : manglikSeverity === 'moderate' ? 'मध्यम' : 'हल्का'}।`)
      : t(locale, 'No Manglik Dosha present. Mars is well-placed for harmonious marriage prospects.', 'मांगलिक दोष नहीं है। विवाह के लिए मंगल अनुकूल स्थिति में है।'),
    remedies: manglikPresent
      ? t(locale,
          'Remedies: 1) Kumbh Vivah ceremony before marriage. 2) Mangal Shanti Puja. 3) Recite Hanuman Chalisa on Tuesdays. 4) Wear red coral (Moonga) on right ring finger. 5) Marry after 28 for natural mitigation. 6) Matching with another Manglik recommended.',
          'उपाय: 1) विवाह से पहले कुम्भ विवाह। 2) मंगल शान्ति पूजा। 3) मंगलवार हनुमान चालीसा। 4) दाहिने हाथ की अनामिका में मूँगा धारण। 5) 28 के बाद विवाह। 6) दूसरे मांगलिक से मिलान।')
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

  // Identify the specific Kaal Sarp sub-type from Rahu's house position
  const KS_SUBTYPES: Record<number, { en: string; hi: string; theme: string; themeHi: string }> = {
    1:  { en: 'Anant', hi: 'अनन्त', theme: 'Self-identity and health challenged by karmic debt', themeHi: 'स्वास्थ्य और पहचान में कर्मऋण से बाधा' },
    2:  { en: 'Kulika', hi: 'कुलिक', theme: 'Wealth and family lineage carry karmic burdens', themeHi: 'धन और परिवार पर कर्म का बोझ' },
    3:  { en: 'Vasuki', hi: 'वासुकी', theme: 'Courage and communication face karmic obstacles', themeHi: 'साहस और संचार में बाधा' },
    4:  { en: 'Shankhapala', hi: 'शंखपाल', theme: 'Home and emotional security are karmically tested', themeHi: 'घर और भावनात्मक सुरक्षा में चुनौती' },
    5:  { en: 'Padma', hi: 'पद्म', theme: 'Children and creativity bear karmic restrictions', themeHi: 'संतान और रचनात्मकता में बाधा' },
    6:  { en: 'Mahapadma', hi: 'महापद्म', theme: 'Enemies, debts, and diseases carry deep karmic patterns', themeHi: 'शत्रु, ऋण और रोग में गहरा कर्म' },
    7:  { en: 'Takshaka', hi: 'तक्षक', theme: 'Marriage and partnerships are karmically tested', themeHi: 'विवाह और साझेदारी में कर्म की परीक्षा' },
    8:  { en: 'Karkotak', hi: 'कर्कोटक', theme: 'Longevity and transformation carry karmic intensity', themeHi: 'आयु और परिवर्तन में तीव्रता' },
    9:  { en: 'Shankhachud', hi: 'शंखचूड', theme: 'Luck and dharma challenged by past-life karma', themeHi: 'भाग्य और धर्म में पूर्वजन्म का कर्म' },
    10: { en: 'Ghatak', hi: 'घातक', theme: 'Career and reputation face karmic tests', themeHi: 'करियर में कर्मिक परीक्षा' },
    11: { en: 'Vishdhar', hi: 'विषधर', theme: 'Gains and ambitions delayed by karmic poison', themeHi: 'लाभ और महत्वाकांक्षा में विलंब' },
    12: { en: 'Sheshnag', hi: 'शेषनाग', theme: 'Foreign lands and liberation carry intense karma', themeHi: 'विदेश और मोक्ष में गहरा कर्म' },
  };
  const ksSubType = kaalSarpPresent && rahu ? KS_SUBTYPES[rahu.house] : null;

  // Kaal Sarp cancellation conditions
  const ksCancellations: import('./tippanni-types').CancellationCondition[] = kaalSarpPresent ? [
    { condition: t(locale, 'Any planet conjunct Rahu or Ketu (breaks the axis)', 'कोई ग्रह राहु या केतु के साथ (अक्ष तोड़ता है)'), met: planets.some(p => p.planet.id >= 0 && p.planet.id <= 6 && (p.house === rahu!.house || p.house === ketu!.house)), source: 'BPHS' },
    { condition: t(locale, 'Jupiter aspects Rahu or Ketu', 'गुरु राहु या केतु को देखे'), met: !!(jupiter && rahu && ketu && ([1,5,7,9].includes(((rahu.house - jupiter.house + 12) % 12) + 1) || [1,5,7,9].includes(((ketu.house - jupiter.house + 12) % 12) + 1))), source: 'BPHS' },
    { condition: t(locale, 'Rahu/Ketu in 3rd/6th/11th houses (upachaya)', 'राहु/केतु 3/6/11 में (उपचय)'), met: !!(rahu && ketu && ([3,6,11].includes(rahu.house) || [3,6,11].includes(ketu.house))), source: 'Phala Deepika' },
  ] : [];

  const ksMetCount = ksCancellations.filter(c => c.met).length;
  const ksEffective = !kaalSarpPresent ? undefined : ksMetCount >= 2 ? 'cancelled' as const : ksMetCount === 1 ? 'partial' as const : 'full' as const;

  doshas.push({
    name: kaalSarpPresent && ksSubType
      ? t(locale, `Kaal Sarp Dosha — ${ksSubType.en}`, `काल सर्प दोष — ${ksSubType.hi}`)
      : t(locale, 'Kaal Sarp Dosha', 'काल सर्प दोष', 'कालसर्पदोषः'),
    present: kaalSarpPresent,
    severity: kaalSarpPresent ? 'moderate' : 'none',
    effectiveSeverity: ksEffective,
    cancellationConditions: ksCancellations.length > 0 ? ksCancellations : undefined,
    activeDasha: kaalSarpPresent ? t(locale, 'Intensifies during Rahu or Ketu Mahadasha/Antardasha', 'राहु या केतु महादशा/अंतर्दशा में तीव्र') : undefined,
    description: kaalSarpPresent
      ? t(locale,
          `${ksSubType ? ksSubType.en + ' type: ' + ksSubType.theme + '. ' : ''}All planets hemmed between Rahu (house ${rahu!.house}) and Ketu (house ${ketu!.house}). ${ksEffective === 'cancelled' ? 'Multiple cancellation conditions met — dosha is effectively neutralized.' : ksEffective === 'partial' ? 'One cancellation condition met — dosha is partially mitigated.' : ''} This karmic pattern causes periodic obstacles and delays but also grants resilience and depth of character.`,
          `${ksSubType ? ksSubType.hi + ' प्रकार: ' + ksSubType.themeHi + '। ' : ''}सभी ग्रह राहु (भाव ${rahu!.house}) और केतु (भाव ${ketu!.house}) के बीच। ${ksEffective === 'cancelled' ? 'अनेक निरसन शर्तें पूर्ण — दोष निष्प्रभावित।' : ksEffective === 'partial' ? 'एक निरसन शर्त पूर्ण — दोष आंशिक कम।' : ''} यह कार्मिक पैटर्न बाधाएँ लाता है पर लचीलापन भी देता है।`)
      : t(locale, 'No Kaal Sarp Dosha. Planets are not hemmed between Rahu-Ketu axis.', 'काल सर्प दोष नहीं। ग्रह राहु-केतु अक्ष के बीच नहीं।'),
    remedies: kaalSarpPresent
      ? t(locale, 'Remedies: 1) Kaal Sarp Nivaran Puja at Trimbakeshwar. 2) Nag Panchami worship. 3) Donate to snake conservation. 4) Maha Mrityunjaya Mantra daily. 5) Visit Rahu-Ketu temples.', 'उपाय: 1) त्र्यम्बकेश्वर में काल सर्प निवारण पूजा। 2) नाग पंचमी पूजा। 3) सर्प संरक्षण दान। 4) महामृत्युंजय मन्त्र। 5) राहु-केतु मन्दिर।')
      : '',
  });

  // Pitra Dosha (Sun with Rahu or Saturn afflicting Sun) with cancellation
  const sun = getP(0);
  const pitraPresent = !!(sun && rahu && sun.house === rahu.house) || !!(sun && saturn && sun.house === saturn.house && sun.isDebilitated);

  const pitraCancellations: import('./tippanni-types').CancellationCondition[] = pitraPresent ? [
    { condition: t(locale, 'Jupiter aspects the Sun', 'गुरु सूर्य को देखे'), met: !!(jupiter && sun && [1,5,7,9].includes(((sun.house - jupiter.house + 12) % 12) + 1)), source: 'BPHS Ch.76' },
    { condition: t(locale, 'Sun in own sign (Leo) or exalted (Aries)', 'सूर्य स्वराशि (सिंह) या उच्च (मेष) में'), met: !!(sun && (sun.isOwnSign || sun.isExalted)), source: 'BPHS' },
    { condition: t(locale, '9th house lord is strong (exalted/own sign)', '9वें भाव का स्वामी बलवान'), met: (() => { const ascSign = kundali.ascendant.sign; const sign9 = ((ascSign - 1 + 8) % 12) + 1; const lordId = [2,5,3,1,0,3,5,2,4,6,6,4][sign9-1]; const lordP = getP(lordId); return !!(lordP && (lordP.isExalted || lordP.isOwnSign)); })(), source: 'Phala Deepika' },
  ] : [];

  const pitraMetCount = pitraCancellations.filter(c => c.met).length;
  const pitraEffective = !pitraPresent ? undefined : pitraMetCount >= 2 ? 'cancelled' as const : pitraMetCount === 1 ? 'partial' as const : 'full' as const;

  doshas.push({
    name: t(locale, 'Pitra Dosha', 'पितृ दोष', 'पितृदोषः'),
    present: pitraPresent,
    severity: pitraPresent ? 'moderate' : 'none',
    effectiveSeverity: pitraEffective,
    cancellationConditions: pitraCancellations.length > 0 ? pitraCancellations : undefined,
    activeDasha: pitraPresent ? t(locale, 'Activates during Sun Mahadasha or Rahu Antardasha', 'सूर्य महादशा या राहु अंतर्दशा में सक्रिय') : undefined,
    description: pitraPresent
      ? t(locale, `Sun afflicted by Rahu or Saturn — Pitra Dosha. ${pitraEffective === 'cancelled' ? 'Multiple cancellation conditions met — dosha neutralized.' : pitraEffective === 'partial' ? 'One cancellation condition met — partially mitigated.' : ''} Ancestral karmic debts may manifest as career obstacles or strained father relationship.`, `सूर्य पर राहु/शनि दुष्प्रभाव — पितृ दोष। ${pitraEffective === 'cancelled' ? 'अनेक निरसन शर्तें पूर्ण — दोष निष्प्रभावित।' : pitraEffective === 'partial' ? 'एक निरसन शर्त पूर्ण — आंशिक कम।' : ''} पैतृक कार्मिक ऋण।`)
      : t(locale, 'No significant Pitra Dosha. Sun well-placed — good paternal lineage relationship.', 'पितृ दोष नहीं। पैतृक वंश से अच्छा सम्बन्ध।'),
    remedies: pitraPresent
      ? t(locale, 'Remedies: 1) Pitra Tarpan on Amavasya. 2) Shraddha ceremonies. 3) Donate food to Brahmins. 4) Plant a Peepal tree. 5) Surya mantra daily. 6) Wear Ruby (Manikya) if Sun is weak.', 'उपाय: 1) अमावस्या पर पितृ तर्पण। 2) श्राद्ध संस्कार। 3) ब्राह्मणों को भोजन दान। 4) पीपल लगाएँ। 5) सूर्य मन्त्र। 6) माणिक्य धारण।')
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

  // Also get English names from extended doshas for citation lookup
  const extendedDoshasEn = detectExtendedDoshas(kundali.planets, kundali.houses, kundali.ascendant.sign, 'en');

  // Attach classical citations to all doshas
  // Manual doshas (first 3) have known English names regardless of locale
  const manualEnglishNames = [
    'Manglik Dosha (Kuja Dosha)',
    'Kaal Sarp Dosha',
    'Pitra Dosha',
  ];

  for (let i = 0; i < doshas.length; i++) {
    if (doshas[i].classicalReferences) continue; // Already has citations (e.g. from yogasComplete path)

    // Determine the English name for citation lookup
    let englishName: string;
    if (i < manualEnglishNames.length) {
      englishName = manualEnglishNames[i];
    } else {
      // Extended doshas: find matching English name by index offset
      const extIdx = i - manualEnglishNames.length;
      englishName = extIdx < extendedDoshasEn.length ? extendedDoshasEn[extIdx].name : doshas[i].name;
    }

    const citations = findDoshaCitations(englishName);
    if (citations && citations.length > 0) {
      doshas[i].classicalReferences = {
        summary: `Classical references for ${englishName}`,
        citations,
        confidence: 'high',
      };
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

  // Enrich ratings with bhavabala when available (proper 4-component house strength)
  if (kundali.bhavabala && kundali.bhavabala.length > 0) {
    const bbMax = Math.max(...kundali.bhavabala.map(b => b.total));
    const bbRating = (houseNum: number) => {
      const bb = kundali.bhavabala!.find(b => b.bhava === houseNum);
      if (!bb || bbMax <= 0) return 5;
      return Math.max(1, Math.min(10, Math.round((bb.total / bbMax) * 10)));
    };
    // Override crude rateHouse with real bhavabala-derived ratings + regenerate summary quality text
    const fixRating = (area: LifeArea, r: number) => {
      area.rating = r;
      // Prepend bhavabala-derived quality label with score
      const qualEn = r >= 9 ? 'Exceptional' : r >= 7 ? 'Strong' : r >= 5 ? 'Moderate' : r >= 3 ? 'Challenging' : 'Difficult';
      const qualHi = r >= 9 ? 'असाधारण' : r >= 7 ? 'मजबूत' : r >= 5 ? 'मध्यम' : r >= 3 ? 'चुनौतीपूर्ण' : 'कठिन';
      const qualLabel = locale === 'en' ? qualEn : qualHi;
      // Strip any existing quality prefix (old or new format)
      area.summary = area.summary
        .replace(/^(?:Exceptional|Strong|Moderate|Excellent|Challenging|Difficult|Good|Favorable|मजबूत|मध्यम|उत्कृष्ट|चुनौतीपूर्ण|कठिन|असाधारण|अच्छी|अनुकूल)\s*(?:\(\d+\/\d+\)\.?\s*)?/i, '')
        .replace(/^\[.*?\]\s*/, '');
      area.summary = `${qualLabel} (${r}/10). ${area.summary}`;
    };
    fixRating(enhancedCareer, bbRating(10));
    fixRating(enhancedWealth, Math.round((bbRating(2) + bbRating(11)) / 2));
    fixRating(enhancedMarriage, bbRating(7));
    fixRating(enhancedHealth, Math.round((bbRating(1) + bbRating(6)) / 2));
    fixRating(enhancedEducation, Math.round((bbRating(4) + bbRating(5)) / 2));
  }

  // Enrich details with ashtakavarga SAV scores for relevant houses
  if (kundali.ashtakavarga) {
    const sav = kundali.ashtakavarga.savTable;
    const savNote = (houseNums: number[], label: string) => {
      const scores = houseNums.map(h => {
        const signIdx = ((ascSign - 1 + h - 1) % 12); // house to sign index
        return { house: h, bindu: sav[signIdx] || 0 };
      });
      const parts = scores.map(s => `H${s.house}: ${s.bindu} bindu`).join(', ');
      const avg = scores.reduce((a, s) => a + s.bindu, 0) / scores.length;
      const quality = avg >= 28 ? t(locale, 'strong support', 'मजबूत समर्थन') : avg < 22 ? t(locale, 'needs attention', 'ध्यान आवश्यक') : t(locale, 'moderate', 'मध्यम');
      return `\n\n${t(locale, 'Ashtakavarga', 'अष्टकवर्ग')} (${label}): ${parts} — ${quality}.`;
    };
    enhancedCareer.details += savNote([10], t(locale, 'career house', 'कैरियर भाव'));
    enhancedWealth.details += savNote([2, 11], t(locale, 'wealth houses', 'धन भाव'));
    enhancedMarriage.details += savNote([7], t(locale, 'marriage house', 'विवाह भाव'));
    enhancedHealth.details += savNote([1, 6], t(locale, 'health houses', 'स्वास्थ्य भाव'));
    enhancedEducation.details += savNote([4, 5], t(locale, 'education houses', 'शिक्षा भाव'));
  }

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

  // Enrich maha dasha analysis with real computed data for the dasha lord
  if (currentMahaAnalysis) {
    const dashaLordName = kundali.dashas.find(d => {
      const start = new Date(d.startDate); const end = new Date(d.endDate);
      return now >= start && now <= end;
    })?.planet;
    const PLANET_NAME_TO_ID: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8 };
    const dlId = dashaLordName ? PLANET_NAME_TO_ID[dashaLordName] : undefined;
    if (dlId !== undefined) {
      const enrichParts: string[] = [];

      // Shadbala of dasha lord
      if (kundali.fullShadbala) {
        const sb = kundali.fullShadbala.find(s => s.planetId === dlId);
        if (sb) {
          const label = sb.strengthRatio >= 1.5 ? t(locale, 'strong', 'बलवान') : sb.strengthRatio >= 1.0 ? t(locale, 'adequate', 'पर्याप्त') : t(locale, 'weak', 'दुर्बल');
          enrichParts.push(t(locale,
            `Shadbala of dasha lord: ${sb.rupas.toFixed(1)} rupas (${label}). ${sb.strengthRatio >= 1.0 ? 'Capable of delivering good results.' : 'May underperform — remedies recommended.'}`,
            `दशा स्वामी का षड्बल: ${sb.rupas.toFixed(1)} रूप (${label})। ${sb.strengthRatio >= 1.0 ? 'अच्छे परिणाम देने में सक्षम।' : 'कम प्रदर्शन सम्भव — उपाय अनुशंसित।'}`));
        }
      }

      // Avastha of dasha lord
      if (kundali.avasthas) {
        const av = kundali.avasthas.find((a: { planetId: number }) => a.planetId === dlId);
        if (av?.baladi) {
          enrichParts.push(t(locale,
            `Dasha lord is in ${av.baladi.name.en} avastha${av.deeptadi ? ` (${av.deeptadi.name.en} luminosity)` : ''}.`,
            `दशा स्वामी ${av.baladi.name.hi} अवस्था में${av.deeptadi ? ` (${av.deeptadi.name.hi} दीप्ति)` : ''}।`));
        }
      }

      // Functional nature of dasha lord
      if (kundali.functionalNature) {
        const fn = kundali.functionalNature.planets?.find((f: { planetId: number }) => f.planetId === dlId);
        if (fn) {
          const natureLabel = fn.nature === 'yogaKaraka' ? t(locale, 'YogaKaraka — most beneficial', 'योगकारक — सर्वाधिक शुभ')
            : fn.nature === 'funcBenefic' ? t(locale, 'functional benefic', 'कार्यात्मक शुभ')
            : fn.nature === 'funcMalefic' ? t(locale, 'functional malefic', 'कार्यात्मक पापी')
            : fn.nature === 'maraka' ? t(locale, 'Maraka — handle with care', 'मारक — सावधानी से')
            : t(locale, 'neutral', 'तटस्थ');
          enrichParts.push(t(locale,
            `For your lagna, this dasha lord is: ${natureLabel}.`,
            `आपके लग्न के लिए यह दशा स्वामी: ${natureLabel}।`));
        }
      }

      if (enrichParts.length > 0) {
        currentMahaAnalysis += '\n\n' + enrichParts.join('\n');
      }
    }
  }

  return { currentMaha, currentMahaAnalysis, currentAntar, currentAntarAnalysis, upcoming };
}

function generateRemedies(kundali: KundaliData, locale: Locale): RemedySection {
  // Build a synthetic ShadBala[] from fullShadbala so the remedies function gets real data.
  // The remedies function checks totalStrength < 40 to identify weak planets.
  // With fullShadbala, we map strengthRatio to that scale: ratio < 1.0 → weak (totalStrength ~30).
  const shadbalaForRemedies = kundali.fullShadbala && kundali.fullShadbala.length > 0
    ? kundali.fullShadbala.map(s => ({
        planet: s.planet,
        planetName: GRAHAS[s.planetId]?.name || { en: s.planet, hi: s.planet, sa: s.planet },
        totalStrength: Math.floor(s.strengthRatio * 40), // ratio < 1.0 → < 40 (flagged weak), ratio >= 1.0 → >= 40 (safe)
        sthanaBala: 0, digBala: 0, kalaBala: 0, cheshtaBala: 0, naisargikaBala: 0, drikBala: 0,
      }))
    : kundali.shadbala;
  return getRemediesForWeakPlanets(kundali.planets, shadbalaForRemedies, kundali.ascendant.sign, locale);
}

function generateStrengthOverview(kundali: KundaliData, locale: Locale): StrengthEntry[] {
  // Use fullShadbala (proper 6-fold calculation) when available; fall back to simplified
  if (kundali.fullShadbala && kundali.fullShadbala.length > 0) {
    return kundali.fullShadbala.map(s => {
      const graha = GRAHAS.find(g => g.id === s.planetId);
      // strengthRatio = rupas / minRequired (BPHS Ch.27). 1.0 = meets minimum.
      // Thresholds consistent with Shadbala tab: ≥1.5 Strong, ≥1.0 Adequate, <1.0 Weak
      const pct = Math.min(100, Math.round(30 + s.strengthRatio * 35));
      const status = s.strengthRatio >= 1.5 ? t(locale, 'Strong', 'बलवान')
        : s.strengthRatio >= 1.0 ? t(locale, 'Adequate', 'पर्याप्त')
        : t(locale, 'Weak', 'दुर्बल');
      return {
        planetName: graha?.name[locale] || s.planet,
        planetColor: graha?.color || '#888',
        strength: pct,
        ratio: s.strengthRatio,
        rupas: s.rupas,
        status,
      };
    });
  }
  // Fallback to simplified shadbala
  return kundali.shadbala.map(s => {
    const graha = GRAHAS.find(g => g.name.en === s.planet);
    return {
      planetName: s.planetName[locale] || "",
      planetColor: graha?.color || '#888',
      strength: s.totalStrength,
      status: t(locale,
        s.totalStrength >= 60 ? 'Strong' : s.totalStrength >= 40 ? 'Adequate' : 'Weak',
        s.totalStrength >= 60 ? 'बलवान' : s.totalStrength >= 40 ? 'पर्याप्त' : 'दुर्बल'),
    };
  });
}

// ===== MAIN EXPORT =====

export function generateTippanni(kundali: KundaliData, locale: Locale): TippanniContent {
  const lifeAreas = generateLifeAreas(kundali, locale);

  // ── Life stage: reorder and reframe life areas based on user's age ──
  let lifeStageInfo: TippanniContent['lifeStage'];
  if (kundali.birthData?.date) {
    const birthDate = new Date(kundali.birthData.date + 'T00:00:00');
    if (!isNaN(birthDate.getTime())) {
      const ctx = getLifeStageContext(birthDate);
      lifeStageInfo = {
        age: ctx.age,
        stage: ctx.stage,
        headline: locale === 'hi' ? ctx.headline.hi : ctx.headline.en,
        priorityOrder: ctx.priorityOrder,
        remedyNote: locale === 'hi' ? ctx.remedyPreference.note.hi : ctx.remedyPreference.note.en,
      };

      // Prepend stage-specific framing to each life area summary
      for (const key of ctx.priorityOrder) {
        const area = lifeAreas[key as keyof typeof lifeAreas];
        if (area && ctx.framing[key as keyof typeof ctx.framing]) {
          const framing = locale === 'hi'
            ? ctx.framing[key as keyof typeof ctx.framing].hi
            : ctx.framing[key as keyof typeof ctx.framing].en;
          area.summary = `${framing} ${area.summary}`;
        }
      }
    }
  }

  return {
    yearPredictions: generateYearPredictions(kundali, locale),
    personality: generatePersonality(kundali, locale),
    planetInsights: generatePlanetInsights(kundali, locale),
    yogas: generateYogas(kundali, locale),
    doshas: generateDoshas(kundali, locale),
    lifeAreas,
    dashaInsight: generateDashaInsight(kundali, locale),
    remedies: generateRemedies(kundali, locale),
    strengthOverview: generateStrengthOverview(kundali, locale),
    dashaSynthesis: generateDashaSynthesis(kundali, locale),
    lifeStage: lifeStageInfo,
  };
}
