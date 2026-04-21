/**
 * Daily Insights Engine
 *
 * Synthesises today's panchang with the user's PersonalReading to produce
 * per-domain daily guidance. Scores each domain 0-10 based on:
 *   - Moon house activation (40%)
 *   - Tithi auspiciousness (20%)
 *   - Nakshatra quality (20%)
 *   - Yoga quality (10%)
 *   - Hora relevance (10%)
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs: 1-based (1-12)
 */

import type { LocaleText, PanchangData } from '@/types/panchang';
import type { PersonalReading, DomainType } from './types';
import { DOMAIN_CONFIGS } from './config';

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export interface DailyDomainInsight {
  domain: DomainType;
  todayScore: number; // 0-10
  headline: LocaleText;
  bestWindow?: { start: string; end: string; reason: LocaleText };
  caution?: { start: string; end: string; reason: LocaleText };
  tip: LocaleText;
}

export interface DailyInsights {
  date: string; // ISO date
  overallDay: 'excellent' | 'good' | 'mixed' | 'challenging';
  moonNakshatraQuality: LocaleText;
  insights: DailyDomainInsight[];
  topTip: LocaleText;
}

export interface DailyInsightsInput {
  personalReading: PersonalReading;
  todayPanchang: PanchangData;
  locale: string;
}

// ---------------------------------------------------------------------------
// Nakshatra classification (4 types)
// ---------------------------------------------------------------------------

type NakshatraType = 'kshipra' | 'ugra' | 'sthira' | 'mridu';

/** Nakshatra ID (1-27) → type classification. */
const NAKSHATRA_TYPE_MAP: Record<number, NakshatraType> = {
  // Kshipra (swift): Ashwini(1), Pushya(8), Hasta(13)
  1: 'kshipra', 8: 'kshipra', 13: 'kshipra',
  // Ugra (fierce): Bharani(2), Magha(10), P.Phalguni(11), P.Ashadha(20), P.Bhadra(25)
  2: 'ugra', 10: 'ugra', 11: 'ugra', 20: 'ugra', 25: 'ugra',
  // Sthira (fixed): Rohini(4), U.Phalguni(12), U.Ashadha(21), U.Bhadra(26)
  4: 'sthira', 12: 'sthira', 21: 'sthira', 26: 'sthira',
  // Mridu (soft): Chitta(14), Anuradha(17), Mrigashira(5), Revati(27)
  14: 'mridu', 17: 'mridu', 5: 'mridu', 27: 'mridu',
};

/** Which nakshatra types benefit which domains. */
const NAKSHATRA_DOMAIN_AFFINITY: Record<NakshatraType, DomainType[]> = {
  kshipra:  ['career', 'wealth', 'education'],
  ugra:     ['health', 'career'],           // competition, surgery
  sthira:   ['family', 'wealth', 'marriage'], // long-term, property
  mridu:    ['marriage', 'children', 'spiritual', 'education'],
};

const NAKSHATRA_TYPE_LABELS: Record<NakshatraType, LocaleText> = {
  kshipra: { en: 'Swift (Kshipra) — favours quick actions and career moves', hi: 'क्षिप्र — शीघ्र कार्य और करियर के लिए अनुकूल', sa: 'क्षिप्रम् — शीघ्रकार्याय कर्मणे च अनुकूलम्' },
  ugra:    { en: 'Fierce (Ugra) — favours competition and bold action', hi: 'उग्र — प्रतिस्पर्धा और साहसिक कार्य के लिए अनुकूल', sa: 'उग्रम् — प्रतिस्पर्धायै साहसकर्मणे च अनुकूलम्' },
  sthira:  { en: 'Fixed (Sthira) — favours long-term plans and stability', hi: 'स्थिर — दीर्घकालिक योजना और स्थिरता के लिए अनुकूल', sa: 'स्थिरम् — दीर्घकालयोजनायै स्थैर्याय च अनुकूलम्' },
  mridu:   { en: 'Soft (Mridu) — favours relationships and creativity', hi: 'मृदु — संबंध और रचनात्मकता के लिए अनुकूल', sa: 'मृदु — सम्बन्धाय सृजनशीलतायै च अनुकूलम्' },
};

// ---------------------------------------------------------------------------
// Tithi–domain affinity
// ---------------------------------------------------------------------------

/**
 * Tithi number (1-15) + paksha → domain affinity.
 * Key: `${paksha}_${tithiNumber}`. Domains listed get a bonus.
 */
const TITHI_DOMAIN_MAP: Record<string, DomainType[]> = {
  // Shukla Panchami, Saptami → relationships
  'shukla_5':  ['marriage', 'children', 'family'],
  'shukla_7':  ['marriage', 'children', 'family'],
  // Shukla Dashami, Ekadashi → business/career
  'shukla_10': ['career', 'wealth'],
  'shukla_11': ['career', 'wealth', 'spiritual'],
  // Tritiya, Chaturthi → health treatments
  'shukla_3':  ['health', 'education'],
  'shukla_4':  ['health', 'education'],
  'krishna_3': ['health'],
  'krishna_4': ['health'],
  // Amavasya (krishna 15) and Purnima (shukla 15) → spiritual
  'krishna_15': ['spiritual'],
  'shukla_15':  ['spiritual', 'family'],
  // Ekadashi both pakshas → spiritual
  'krishna_11': ['spiritual', 'career'],
  // Navami → education, spiritual
  'shukla_9':  ['education', 'spiritual'],
  'krishna_9': ['education'],
};

// ---------------------------------------------------------------------------
// Yoga quality classification
// ---------------------------------------------------------------------------

type YogaQuality = 'very_auspicious' | 'auspicious' | 'neutral' | 'inauspicious';

function classifyYoga(yogaNumber: number): YogaQuality {
  const veryAuspicious = [21, 25, 27]; // Siddhi, Shiva, Siddha
  const auspicious = [2, 3, 4, 7];     // Priti, Ayushman, Shobhana, Sukarma
  const inauspicious = [1, 6, 13, 15, 19]; // Vishkambha, Atiganda, Vyaghata, Vajra, Parigha

  if (veryAuspicious.includes(yogaNumber)) return 'very_auspicious';
  if (auspicious.includes(yogaNumber)) return 'auspicious';
  if (inauspicious.includes(yogaNumber)) return 'inauspicious';
  return 'neutral';
}

const YOGA_QUALITY_SCORE: Record<YogaQuality, number> = {
  very_auspicious: 10,
  auspicious: 8,
  neutral: 5,
  inauspicious: 2,
};

// ---------------------------------------------------------------------------
// Hora planet → domain significator mapping
// ---------------------------------------------------------------------------

/**
 * Planet ID → domains it naturally signifies.
 * When the current hora is ruled by a planet that signifies a domain, that domain gets a boost.
 */
const HORA_PLANET_DOMAINS: Record<number, DomainType[]> = {
  0: ['career', 'health'],          // Sun → career, health
  1: ['family', 'marriage'],        // Moon → family, marriage
  2: ['health', 'career'],          // Mars → health, career (competition)
  3: ['education', 'career', 'wealth'], // Mercury → education, career, wealth
  4: ['wealth', 'spiritual', 'children', 'education'], // Jupiter → wealth, spiritual, children
  5: ['marriage', 'wealth', 'children'], // Venus → marriage, wealth
  6: ['career', 'spiritual'],       // Saturn → career, spiritual
  7: ['career', 'wealth'],          // Rahu → career, wealth (unconventional)
  8: ['spiritual'],                 // Ketu → spiritual
};

// ---------------------------------------------------------------------------
// House → domain mapping (which domain "owns" which house)
// ---------------------------------------------------------------------------

/**
 * Maps house number (1-12) to domains it primarily activates.
 * When the transiting Moon lands in a house, these domains get boosted.
 */
const HOUSE_DOMAIN_MAP: Record<number, DomainType[]> = {
  1:  ['health'],
  2:  ['wealth', 'family', 'education'],
  3:  ['education'],
  4:  ['family', 'education'],
  5:  ['children', 'education'],
  6:  ['health', 'career'],
  7:  ['marriage'],
  8:  ['health', 'spiritual'],
  9:  ['spiritual', 'education', 'family'],
  10: ['career'],
  11: ['wealth', 'career'],
  12: ['spiritual'],
};

// ---------------------------------------------------------------------------
// Core scoring functions
// ---------------------------------------------------------------------------

/**
 * Compute the house number where the transiting Moon (from today's panchang) sits
 * relative to the natal ascendant.
 *
 * Both moonRashi and ascendantSign are 1-based (1-12).
 * House 1 = Moon in same rashi as ascendant.
 */
export function getMoonTransitHouse(moonRashi: number, ascendantSign: number): number {
  const house = ((moonRashi - ascendantSign + 12) % 12) + 1;
  return house;
}

/**
 * Score a domain based on Moon's transit house (0-10).
 * If Moon is in a house that activates this domain, score = 8-10.
 * If Moon is in a neutral house, score = 5.
 * If Moon is in a challenging house for this domain, score = 2-4.
 */
function scoreMoonHouseActivation(
  moonHouse: number,
  domainId: DomainType,
  domainConfig: (typeof DOMAIN_CONFIGS)[number],
): number {
  // Check if Moon's house is a primary house for this domain
  const domainsForHouse = HOUSE_DOMAIN_MAP[moonHouse] || [];
  if (domainsForHouse.includes(domainId)) {
    return 9; // strong activation
  }

  // Check secondary houses from domain config
  if (domainConfig.secondaryHouses.includes(moonHouse)) {
    return 7;
  }

  // 6, 8, 12 from domain's primary houses are generally challenging
  const primaryHouseNums = domainConfig.primaryHouses;
  for (const ph of primaryHouseNums) {
    const distFromPrimary = ((moonHouse - ph + 12) % 12);
    // 6th, 8th, 12th from a primary house → slight challenge
    if (distFromPrimary === 5 || distFromPrimary === 7 || distFromPrimary === 11) {
      return 3;
    }
  }

  return 5; // neutral
}

/**
 * Score tithi auspiciousness for a domain (0-10).
 */
function scoreTithiForDomain(
  tithiNumber: number,
  paksha: 'shukla' | 'krishna',
  domainId: DomainType,
): number {
  const key = `${paksha}_${tithiNumber}`;
  const favoured = TITHI_DOMAIN_MAP[key] || [];
  if (favoured.includes(domainId)) return 9;
  // General tithis: Dwitiya (2), Shashthi (6), Dashami (10) are generally good
  if ([2, 6, 10].includes(tithiNumber) && paksha === 'shukla') return 6;
  return 5; // neutral
}

/**
 * Score nakshatra quality for a domain (0-10).
 */
function scoreNakshatraForDomain(
  nakshatraId: number,
  domainId: DomainType,
): number {
  const nType = NAKSHATRA_TYPE_MAP[nakshatraId];
  if (!nType) return 5; // unclassified nakshatras are neutral

  const affineDomains = NAKSHATRA_DOMAIN_AFFINITY[nType];
  if (affineDomains.includes(domainId)) return 9;
  return 5;
}

/**
 * Score yoga quality (same for all domains) (0-10).
 */
function scoreYogaQuality(yogaNumber: number): number {
  return YOGA_QUALITY_SCORE[classifyYoga(yogaNumber)];
}

/**
 * Score hora relevance for a domain (0-10).
 * Uses the first hora slot if available, otherwise returns neutral.
 */
function scoreHoraForDomain(
  panchang: PanchangData,
  domainId: DomainType,
): number {
  if (!panchang.hora || panchang.hora.length === 0) return 5;

  // Use the current hora (approximate: first daytime hora)
  const firstHora = panchang.hora[0];
  if (!firstHora) return 5;

  const domains = HORA_PLANET_DOMAINS[firstHora.planetId] || [];
  if (domains.includes(domainId)) return 8;
  return 5;
}

// ---------------------------------------------------------------------------
// Headline and tip generation
// ---------------------------------------------------------------------------

function generateDomainHeadline(
  domainId: DomainType,
  score: number,
  moonHouse: number,
  nakshatraType: NakshatraType | undefined,
  domainConfig: (typeof DOMAIN_CONFIGS)[number],
): LocaleText {
  const domainNameEn = domainConfig.name.en;
  const domainNameHi = domainConfig.name.hi;

  if (score >= 8) {
    return {
      en: `Excellent day for ${domainNameEn.toLowerCase()} — Moon in your ${ordinal(moonHouse)} house amplifies this area`,
      hi: `${domainNameHi} के लिए उत्तम दिन — चंद्रमा आपके ${moonHouse}वें भाव में इस क्षेत्र को प्रबल करता है`,
      sa: `${domainConfig.name.sa || domainNameEn} कृते उत्तमं दिनम्`,
    };
  }
  if (score >= 6) {
    return {
      en: `Favourable conditions for ${domainNameEn.toLowerCase()} today`,
      hi: `आज ${domainNameHi} के लिए अनुकूल स्थिति`,
      sa: `अद्य ${domainConfig.name.sa || domainNameEn} कृते अनुकूलम्`,
    };
  }
  if (score >= 4) {
    return {
      en: `Mixed energies around ${domainNameEn.toLowerCase()} — proceed with awareness`,
      hi: `${domainNameHi} में मिश्रित ऊर्जा — सावधानी से आगे बढ़ें`,
      sa: `${domainConfig.name.sa || domainNameEn} विषये मिश्रम्`,
    };
  }
  return {
    en: `Challenging day for ${domainNameEn.toLowerCase()} — patience recommended`,
    hi: `${domainNameHi} के लिए चुनौतीपूर्ण दिन — धैर्य रखें`,
    sa: `${domainConfig.name.sa || domainNameEn} कृते कठिनं दिनम्`,
  };
}

function generateDomainTip(
  domainId: DomainType,
  score: number,
  nakshatraType: NakshatraType | undefined,
): LocaleText {
  const tips: Record<DomainType, { high: LocaleText; low: LocaleText }> = {
    health: {
      high: { en: 'Good day for exercise and health check-ups', hi: 'व्यायाम और स्वास्थ्य जांच के लिए अच्छा दिन', sa: 'व्यायामाय स्वास्थ्यपरीक्षायै च उत्तमं दिनम्' },
      low: { en: 'Rest and avoid overexertion today', hi: 'आज आराम करें और अधिक परिश्रम से बचें', sa: 'अद्य विश्रामं कुरु अतिश्रमं च त्यज' },
    },
    wealth: {
      high: { en: 'Favourable for financial decisions and investments', hi: 'वित्तीय निर्णय और निवेश के लिए अनुकूल', sa: 'वित्तनिर्णयाय निवेशाय च अनुकूलम्' },
      low: { en: 'Avoid major financial commitments today', hi: 'आज बड़ी वित्तीय प्रतिबद्धताओं से बचें', sa: 'अद्य वृहत्वित्तप्रतिज्ञां त्यज' },
    },
    career: {
      high: { en: 'Ideal for important meetings and career initiatives', hi: 'महत्वपूर्ण बैठकों और करियर पहल के लिए आदर्श', sa: 'महत्त्वपूर्णसभानां कर्मप्रारम्भाणां च कृते आदर्शम्' },
      low: { en: 'Focus on routine tasks; postpone critical decisions', hi: 'नियमित कार्यों पर ध्यान दें; महत्वपूर्ण निर्णय टालें', sa: 'नित्यकर्मसु ध्यानं देहि निर्णयान् विलम्बय' },
    },
    marriage: {
      high: { en: 'Express love and plan quality time with partner', hi: 'प्रेम व्यक्त करें और साथी के साथ समय बिताएं', sa: 'प्रेमं प्रकटय सहचरेण सह समयं यापय' },
      low: { en: 'Be patient in relationships; avoid confrontations', hi: 'संबंधों में धैर्य रखें; टकराव से बचें', sa: 'सम्बन्धेषु धैर्यं धर विवादं त्यज' },
    },
    children: {
      high: { en: 'Good time for bonding with children and creative activities', hi: 'बच्चों के साथ समय बिताने और रचनात्मक गतिविधियों के लिए अच्छा', sa: 'बालैः सह कालयापनाय सृजनकर्मणे च उत्तमम्' },
      low: { en: 'Give children extra patience and space today', hi: 'आज बच्चों को अतिरिक्त धैर्य और स्थान दें', sa: 'अद्य बालेभ्यः अधिकं धैर्यं स्थानं च देहि' },
    },
    family: {
      high: { en: 'Harmonious day for family gatherings and decisions', hi: 'पारिवारिक सभा और निर्णयों के लिए सामंजस्यपूर्ण दिन', sa: 'परिवारसभायै निर्णयेभ्यश्च सामञ्जस्यपूर्णं दिनम्' },
      low: { en: 'Family tensions possible; practice understanding', hi: 'पारिवारिक तनाव संभव; समझदारी बनाए रखें', sa: 'परिवारे तनावः सम्भवति बोधं धर' },
    },
    spiritual: {
      high: { en: 'Powerful day for meditation, prayer, and inner work', hi: 'ध्यान, प्रार्थना और आंतरिक कार्य के लिए शक्तिशाली दिन', sa: 'ध्यानाय प्रार्थनायै अन्तःकर्मणे च शक्तिपूर्णं दिनम्' },
      low: { en: 'Even brief mindfulness will help centre you today', hi: 'आज थोड़ी सी माइंडफुलनेस भी आपको केंद्रित करने में मदद करेगी', sa: 'अद्य अल्पमपि सावधानत्वं त्वां केन्द्रयिष्यति' },
    },
    education: {
      high: { en: 'Excellent for learning, studying, and intellectual pursuits', hi: 'सीखने, अध्ययन और बौद्धिक प्रयासों के लिए उत्कृष्ट', sa: 'अध्ययनाय बौद्धिकप्रयासेभ्यश्च उत्कृष्टम्' },
      low: { en: 'Review rather than absorb new material today', hi: 'आज नई सामग्री के बजाय पुनरावलोकन करें', sa: 'अद्य नूतनविषयान् न पठ पुनरावलोकनं कुरु' },
    },
    currentPeriod: {
      high: { en: 'Overall positive energy today', hi: 'आज समग्र सकारात्मक ऊर्जा', sa: 'अद्य समग्रसकारात्मकऊर्जा' },
      low: { en: 'Take it easy today', hi: 'आज आराम से लें', sa: 'अद्य शान्तिं धर' },
    },
  };

  const domainTips = tips[domainId] || tips.health;
  return score >= 6 ? domainTips.high : domainTips.low;
}

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ---------------------------------------------------------------------------
// Main engine
// ---------------------------------------------------------------------------

/**
 * Generate daily domain insights by synthesising today's panchang with the user's
 * PersonalReading (natal chart + domain readings).
 */
export function generateDailyInsights(input: DailyInsightsInput): DailyInsights {
  const { personalReading, todayPanchang, locale } = input;

  // --- Extract panchang signals ---
  const moonRashi = todayPanchang.moonSign?.rashi ?? 1;
  const moonNakshatraId = todayPanchang.moonSign?.nakshatra
    ?? todayPanchang.nakshatra?.id
    ?? 1;
  const tithiNumber = todayPanchang.tithi?.number ?? 1;
  const tithiPaksha = todayPanchang.tithi?.paksha ?? 'shukla';
  const yogaNumber = todayPanchang.yoga?.number ?? 14; // default to neutral Siddha-area

  // Natal ascendant sign (1-based)
  const natalAscendantSign = personalReading.domains[0]
    ? getAscendantFromReading(personalReading)
    : 1;

  // Moon transit house relative to natal ascendant
  const moonHouse = getMoonTransitHouse(moonRashi, natalAscendantSign);

  // Nakshatra type
  const nakshatraType = NAKSHATRA_TYPE_MAP[moonNakshatraId];

  // Yoga quality
  const yogaScore = scoreYogaQuality(yogaNumber);

  // --- Score each domain ---
  const insights: DailyDomainInsight[] = [];
  const domainConfigs = DOMAIN_CONFIGS.filter(c => c.id !== 'currentPeriod');

  for (const config of domainConfigs) {
    const domainId = config.id;

    // 1. Moon house activation (40%)
    const moonScore = scoreMoonHouseActivation(moonHouse, domainId, config);

    // 2. Tithi auspiciousness (20%)
    const tithiScore = scoreTithiForDomain(tithiNumber, tithiPaksha, domainId);

    // 3. Nakshatra quality (20%)
    const nakshatraScore = scoreNakshatraForDomain(moonNakshatraId, domainId);

    // 4. Yoga quality (10%) — same for all domains
    const yogaScoreForDomain = yogaScore;

    // 5. Hora relevance (10%)
    const horaScore = scoreHoraForDomain(todayPanchang, domainId);

    // Weighted composite
    const rawScore =
      moonScore * 0.40 +
      tithiScore * 0.20 +
      nakshatraScore * 0.20 +
      yogaScoreForDomain * 0.10 +
      horaScore * 0.10;

    // Blend with natal domain strength (up to +/- 1 point)
    const natalDomainReading = personalReading.domains.find(d => d.domain === domainId);
    const natalBonus = natalDomainReading
      ? (natalDomainReading.overallRating.score - 5) * 0.2 // ±1 max
      : 0;

    const todayScore = clamp(Math.round((rawScore + natalBonus) * 10) / 10, 0, 10);

    // Generate text
    const headline = generateDomainHeadline(domainId, todayScore, moonHouse, nakshatraType, config);
    const tip = generateDomainTip(domainId, todayScore, nakshatraType);

    // Best window: Amrit Kalam if available
    const bestWindow = todayPanchang.amritKalam
      ? {
          start: todayPanchang.amritKalam.start,
          end: todayPanchang.amritKalam.end,
          reason: {
            en: 'Amrit Kalam — most auspicious window of the day',
            hi: 'अमृत काल — दिन की सबसे शुभ अवधि',
            sa: 'अमृतकालः — दिनस्य सर्वोत्तमा शुभावधिः',
          } as LocaleText,
        }
      : undefined;

    // Caution: Rahu Kaal if it exists
    const caution = todayPanchang.rahuKaal
      ? {
          start: todayPanchang.rahuKaal.start,
          end: todayPanchang.rahuKaal.end,
          reason: {
            en: 'Rahu Kaal — avoid starting new ventures',
            hi: 'राहु काल — नए कार्य शुरू करने से बचें',
            sa: 'राहुकालः — नूतनकार्यारम्भं त्यज',
          } as LocaleText,
        }
      : undefined;

    insights.push({
      domain: domainId,
      todayScore,
      headline,
      bestWindow,
      caution,
      tip,
    });
  }

  // --- Overall day quality ---
  const avgScore = insights.reduce((sum, i) => sum + i.todayScore, 0) / insights.length;
  const overallDay = resolveOverallDay(avgScore);

  // --- Moon nakshatra quality text ---
  const moonNakshatraQuality: LocaleText = nakshatraType
    ? NAKSHATRA_TYPE_LABELS[nakshatraType]
    : {
        en: 'Neutral nakshatra energy today',
        hi: 'आज तटस्थ नक्षत्र ऊर्जा',
        sa: 'अद्य तटस्थनक्षत्रशक्तिः',
      };

  // --- Top tip: pick the domain with the highest score ---
  const sorted = [...insights].sort((a, b) => b.todayScore - a.todayScore);
  const topDomain = sorted[0];
  const topTip: LocaleText = topDomain
    ? topDomain.tip
    : { en: 'Stay mindful and balanced today', hi: 'आज सावधान और संतुलित रहें', sa: 'अद्य सावधानः सन्तुलितश्च तिष्ठ' };

  return {
    date: todayPanchang.date,
    overallDay,
    moonNakshatraQuality,
    insights,
    topTip,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveOverallDay(avgScore: number): DailyInsights['overallDay'] {
  if (avgScore >= 7.5) return 'excellent';
  if (avgScore >= 5.5) return 'good';
  if (avgScore >= 4.0) return 'mixed';
  return 'challenging';
}

/**
 * Extract the natal ascendant sign from the PersonalReading.
 * We derive it from the health domain (house 1) lord placement,
 * or fall back to 1 (Aries).
 */
function getAscendantFromReading(reading: PersonalReading): number {
  // The health domain's natal promise tells us about house 1.
  // The houseScores record may contain house 1.
  // However, we need the actual ascendant sign, not just the score.
  // Since PersonalReading doesn't directly expose the ascendant sign,
  // we infer from the current period's transit data.
  const currentPeriod = reading.currentPeriod;
  if (currentPeriod.keyTransits.length > 0) {
    // transitHouse is relative to ascendant — we can use transitSign - transitHouse + 1
    const t = currentPeriod.keyTransits[0];
    const asc = ((t.transitSign - t.transitHouse + 1 + 12) % 12) || 12;
    return asc;
  }
  // Fallback: use the first domain reading's natal promise lord placement
  const healthDomain = reading.domains.find(d => d.domain === 'health');
  if (healthDomain && healthDomain.natalPromise.lordQualities.length > 0) {
    // Lord of 1st house: its sign gives us a clue but not the ascendant itself.
    // Without direct access to the KundaliData, we accept the limitation.
    // Return 1 as safe fallback.
    return 1;
  }
  return 1;
}
