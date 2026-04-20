/**
 * Domain Narrator — Deep Personalized Jyotish Interpretation
 *
 * 9 composable narrative functions that produce bilingual (en + hi)
 * sentences from structured domain-synthesis data.  Each function
 * interprets the RELATIONAL MEANING of placements — not just stating
 * astrological facts but explaining what they mean for the native's life.
 *
 * A `composeDomainNarrative` helper joins multiple blocks into a
 * coherent paragraph with contextual connectors.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs:  1-based (1=Aries ... 12=Pisces)
 */

import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Age-awareness vocabulary (Spec Addendum A4)
// ---------------------------------------------------------------------------

interface AgeVocab {
  en: string[];
  hi: string[];
}

const AGE_VOCAB: Record<string, AgeVocab> = {
  young:  { en: ['building', 'developing', 'laying foundations for'],   hi: ['निर्माण', 'विकास', 'नींव रख रहे हैं'] },
  mid:    { en: ['consolidating', 'strengthening', 'deepening'],        hi: ['सुदृढ़ीकरण', 'मजबूती', 'गहनता'] },
  mature: { en: ['harvesting', 'enjoying the fruits of', 'leveraging'], hi: ['कटाई', 'फलों का आनंद', 'उपयोग'] },
  senior: { en: ['legacy', 'passing wisdom about', 'finding peace in'], hi: ['विरासत', 'ज्ञान साझा', 'शांति प्राप्ति'] },
};

function getAgeBracket(age?: number): string {
  if (age == null) return 'mid';
  if (age < 35) return 'young';
  if (age < 50) return 'mid';
  if (age < 65) return 'mature';
  return 'senior';
}

function ageVerb(age?: number, idx = 0): { en: string; hi: string } {
  const bracket = getAgeBracket(age);
  const vocab = AGE_VOCAB[bracket];
  const i = Math.min(idx, vocab.en.length - 1);
  return { en: vocab.en[i], hi: vocab.hi[i] };
}

function agePhrase(age?: number): { en: string; hi: string } {
  const bracket = getAgeBracket(age);
  switch (bracket) {
    case 'young':  return { en: 'At your age, this is about building and experimenting', hi: 'इस उम्र में, यह निर्माण और प्रयोग का समय है' };
    case 'mid':    return { en: 'At this stage of life, focus on consolidating what works', hi: 'जीवन के इस चरण में, जो काम करता है उसे मजबूत करें' };
    case 'mature': return { en: 'This is a period for harvesting the seeds you planted earlier', hi: 'यह पहले बोए गए बीजों की फसल काटने का समय है' };
    case 'senior': return { en: 'At this stage, the focus shifts to legacy and inner fulfillment', hi: 'इस चरण में, ध्यान विरासत और आंतरिक संतुष्टि पर जाता है' };
    default:       return { en: 'This is a meaningful period', hi: 'यह एक सार्थक अवधि है' };
  }
}

// ---------------------------------------------------------------------------
// Ordinal helpers
// ---------------------------------------------------------------------------

function ordinalEn(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function houseHi(n: number): string {
  return `${n}वें`;
}

// ---------------------------------------------------------------------------
// House meanings — the relational core
// ---------------------------------------------------------------------------

const HOUSE_MEANINGS_EN: Record<number, string> = {
  1:  'self, body, and personality',
  2:  'wealth, family, and speech',
  3:  'courage, siblings, and communication',
  4:  'mother, home, and emotional comfort',
  5:  'children, intelligence, and creativity',
  6:  'enemies, health struggles, and service',
  7:  'marriage, partnerships, and public dealings',
  8:  'transformation, longevity, and the occult',
  9:  'fortune, dharma, and higher learning',
  10: 'career, status, and public reputation',
  11: 'gains, aspirations, and social networks',
  12: 'foreign lands, spiritual retreat, and expenses',
};

const HOUSE_MEANINGS_HI: Record<number, string> = {
  1:  'स्वयं, शरीर और व्यक्तित्व',
  2:  'धन, परिवार और वाणी',
  3:  'साहस, भाई-बहन और संवाद',
  4:  'माता, गृह और भावनात्मक सुख',
  5:  'संतान, बुद्धि और रचनात्मकता',
  6:  'शत्रु, रोग और सेवा',
  7:  'विवाह, साझेदारी और सार्वजनिक व्यवहार',
  8:  'परिवर्तन, आयु और गूढ़ विद्या',
  9:  'भाग्य, धर्म और उच्च शिक्षा',
  10: 'करियर, प्रतिष्ठा और सार्वजनिक छवि',
  11: 'लाभ, आकांक्षाएं और सामाजिक संबंध',
  12: 'विदेश, आध्यात्मिक साधना और व्यय',
};

/** Short house label for compact references */
const HOUSE_LABEL_EN: Record<number, string> = {
  1: 'self', 2: 'wealth', 3: 'courage', 4: 'home',
  5: 'creativity', 6: 'service', 7: 'marriage',
  8: 'transformation', 9: 'fortune', 10: 'career',
  11: 'gains', 12: 'liberation',
};

const HOUSE_LABEL_HI: Record<number, string> = {
  1: 'स्वयं', 2: 'धन', 3: 'साहस', 4: 'गृह',
  5: 'रचनात्मकता', 6: 'सेवा', 7: 'विवाह',
  8: 'परिवर्तन', 9: 'भाग्य', 10: 'करियर',
  11: 'लाभ', 12: 'मोक्ष',
};

// ---------------------------------------------------------------------------
// Dignity labels — impact language
// ---------------------------------------------------------------------------

const DIGNITY_EN: Record<string, string> = {
  exalted:      'exalted',
  own:          'in own sign',
  moolatrikona: 'in moolatrikona',
  friendly:     'in a friendly sign',
  neutral:      'in a neutral sign',
  enemy:        'in an enemy sign',
  debilitated:  'debilitated',
};

const DIGNITY_HI: Record<string, string> = {
  exalted:      'उच्च',
  own:          'स्वगृही',
  moolatrikona: 'मूलत्रिकोण में',
  friendly:     'मित्र राशि में',
  neutral:      'सम राशि में',
  enemy:        'शत्रु राशि में',
  debilitated:  'नीच',
};

/** Rich dignity impact phrases for narrative depth */
const DIGNITY_IMPACT_EN: Record<string, string> = {
  exalted:      'at peak strength — results flow effortlessly and abundantly',
  own:          'comfortable and authentic — delivering steady, reliable results',
  moolatrikona: 'in its zone of power — strong and purposeful in its expression',
  friendly:     'reasonably well-placed — outcomes are positive with some effort',
  neutral:      'neither helped nor hindered — results depend on other chart factors',
  enemy:        'uncomfortable and strained — the planet struggles to deliver its promise, requiring patience and remedial support',
  debilitated:  'at its weakest expression — this area faces significant challenges, but Neecha Bhanga (cancellation) and conscious effort can transform weakness into unexpected strength',
};

const DIGNITY_IMPACT_HI: Record<string, string> = {
  exalted:      'चरम शक्ति पर — फल सहज और प्रचुर मात्रा में आते हैं',
  own:          'स्वस्थ और प्रामाणिक — स्थिर, विश्वसनीय परिणाम देता है',
  moolatrikona: 'अपनी शक्ति के क्षेत्र में — मजबूत और उद्देश्यपूर्ण अभिव्यक्ति',
  friendly:     'उचित स्थिति में — कुछ प्रयास से सकारात्मक परिणाम',
  neutral:      'न लाभ न हानि — परिणाम अन्य कुंडली कारकों पर निर्भर',
  enemy:        'असहज और तनावग्रस्त — ग्रह अपना वादा पूरा करने में संघर्ष करता है, धैर्य और उपाय आवश्यक',
  debilitated:  'सबसे कमजोर अभिव्यक्ति — यह क्षेत्र महत्वपूर्ण चुनौतियों का सामना करता है, लेकिन नीच भंग और सचेत प्रयास कमजोरी को अप्रत्याशित शक्ति में बदल सकते हैं',
};

// ---------------------------------------------------------------------------
// Planet personality map — what each planet BRINGS to a domain
// ---------------------------------------------------------------------------

const PLANET_NATURE_EN: Record<number, string> = {
  0: 'authority, vitality, and self-confidence',
  1: 'emotional depth, nurturing, and intuitive wisdom',
  2: 'energy, courage, and decisive action',
  3: 'intelligence, communication, and analytical skill',
  4: 'wisdom, expansion, and divine grace',
  5: 'beauty, harmony, and relational fulfillment',
  6: 'discipline, perseverance, and karmic lessons',
  7: 'ambition, unconventional desires, and worldly obsession',
  8: 'spiritual detachment, past-life wisdom, and liberation',
};

const PLANET_NATURE_HI: Record<number, string> = {
  0: 'अधिकार, जीवन शक्ति और आत्मविश्वास',
  1: 'भावनात्मक गहराई, पोषण और सहज ज्ञान',
  2: 'ऊर्जा, साहस और निर्णायक कार्य',
  3: 'बुद्धि, संवाद और विश्लेषणात्मक कौशल',
  4: 'ज्ञान, विस्तार और दैवीय कृपा',
  5: 'सौंदर्य, सामंजस्य और संबंध पूर्ति',
  6: 'अनुशासन, दृढ़ता और कार्मिक शिक्षा',
  7: 'महत्वाकांक्षा, अपरंपरागत इच्छाएं और सांसारिक आसक्ति',
  8: 'आध्यात्मिक वैराग्य, पूर्वजन्म ज्ञान और मुक्ति',
};

/** Planet short names for compact references */
const PLANET_ROLE_EN: Record<number, string> = {
  0: 'the king',
  1: 'the mind',
  2: 'the warrior',
  3: 'the communicator',
  4: 'the great teacher',
  5: 'the lover',
  6: 'the taskmaster',
  7: 'the shadow of desire',
  8: 'the moksha-karaka',
};

const PLANET_ROLE_HI: Record<number, string> = {
  0: 'राजा',
  1: 'मन',
  2: 'योद्धा',
  3: 'संवादक',
  4: 'महान गुरु',
  5: 'प्रेम का ग्रह',
  6: 'कर्मपति',
  7: 'इच्छा की छाया',
  8: 'मोक्षकारक',
};

// ---------------------------------------------------------------------------
// Aspect verbs — what each planet's gaze DOES
// ---------------------------------------------------------------------------

const ASPECT_VERB_EN: Record<number, string> = {
  0: 'illuminating',
  1: 'nurturing',
  2: 'energizing and agitating',
  3: 'intellectualizing',
  4: 'blessing and expanding',
  5: 'harmonizing and beautifying',
  6: 'disciplining and restricting',
  7: 'amplifying desires and creating obsession around',
  8: 'spiritualizing and detaching from',
};

const ASPECT_VERB_HI: Record<number, string> = {
  0: 'प्रकाशित करता है',
  1: 'पोषण करता है',
  2: 'ऊर्जित और उत्तेजित करता है',
  3: 'बौद्धिक बनाता है',
  4: 'आशीर्वाद और विस्तार देता है',
  5: 'सामंजस्य और सौंदर्य लाता है',
  6: 'अनुशासित और प्रतिबंधित करता है',
  7: 'इच्छाओं को बढ़ाता है और आसक्ति पैदा करता है',
  8: 'आध्यात्मिक बनाता है और अनासक्ति लाता है',
};

// ---------------------------------------------------------------------------
// Relational interpretation — lord-of-X-in-Y meaning
// ---------------------------------------------------------------------------

/**
 * Generate a relational interpretation for a house lord placed in another house.
 * This is the heart of Jyotish interpretation: what does it MEAN when the lord
 * of one life area sits in another life area?
 */
function getRelationalMeaning(
  sourceHouse: number,
  targetHouse: number,
  planetId: number,
  domainName?: string,
): { en: string; hi: string } {
  const srcEn = HOUSE_LABEL_EN[sourceHouse] ?? `${sourceHouse}th`;
  const tgtEn = HOUSE_LABEL_EN[targetHouse] ?? `${targetHouse}th`;
  const srcHi = HOUSE_LABEL_HI[sourceHouse] ?? `${sourceHouse}वां`;
  const tgtHi = HOUSE_LABEL_HI[targetHouse] ?? `${targetHouse}वां`;
  const tgtMeaningEn = HOUSE_MEANINGS_EN[targetHouse] ?? '';
  const tgtMeaningHi = HOUSE_MEANINGS_HI[targetHouse] ?? '';
  const planetNatureEn = PLANET_NATURE_EN[planetId] ?? 'mixed influences';
  const planetNatureHi = PLANET_NATURE_HI[planetId] ?? 'मिश्रित प्रभाव';
  const domain = domainName ?? srcEn;

  // Same house — lord in own house
  if (sourceHouse === targetHouse) {
    return {
      en: `Your ${domain} lord sits in its own house — a strong, self-sufficient placement. The themes of ${tgtMeaningEn} are directly under control, and this planet channels ${planetNatureEn} into the very area it governs.`,
      hi: `आपका ${domain} स्वामी अपने ही भाव में बैठा है — एक मजबूत, आत्मनिर्भर स्थिति। ${tgtMeaningHi} के विषय सीधे नियंत्रण में हैं, और यह ग्रह ${planetNatureHi} को उसी क्षेत्र में प्रवाहित करता है।`,
    };
  }

  // Kendra placement (1, 4, 7, 10) — strong, visible results
  const kendras = [1, 4, 7, 10];
  // Trikona placement (1, 5, 9) — fortunate, dharmic
  const trikonas = [1, 5, 9];
  // Dusthana placement (6, 8, 12) — challenges, transformation
  const dusthanas = [6, 8, 12];

  let contextEn = '';
  let contextHi = '';

  if (kendras.includes(targetHouse)) {
    contextEn = `This is a strong angular placement — your ${domain} matters gain visibility, public impact, and tangible results through the arena of ${tgtMeaningEn}.`;
    contextHi = `यह एक मजबूत केंद्र स्थिति है — आपके ${domain} विषय ${tgtMeaningHi} के माध्यम से दृश्यता और ठोस परिणाम प्राप्त करते हैं।`;
  } else if (trikonas.includes(targetHouse)) {
    contextEn = `This fortunate trinal placement connects your ${domain} to the house of ${tgtMeaningEn} — a dharmic flow that brings grace, merit, and organic growth.`;
    contextHi = `यह शुभ त्रिकोण स्थिति आपके ${domain} को ${tgtMeaningHi} के भाव से जोड़ती है — एक धार्मिक प्रवाह जो कृपा और स्वाभाविक वृद्धि लाता है।`;
  } else if (dusthanas.includes(targetHouse)) {
    contextEn = `Placed in the challenging ${ordinalEn(targetHouse)} house of ${tgtMeaningEn}, your ${domain} lord faces obstacles — but dusthana placements also create resilience, and the struggle itself becomes a source of growth.`;
    contextHi = `चुनौतीपूर्ण ${houseHi(targetHouse)} भाव (${tgtMeaningHi}) में स्थित, आपके ${domain} स्वामी को बाधाओं का सामना करना पड़ता है — लेकिन दुस्थान स्थिति लचीलापन भी देती है।`;
  } else {
    contextEn = `Your ${domain} energy flows into the ${ordinalEn(targetHouse)} house of ${tgtMeaningEn} — the planet channels ${planetNatureEn} into this life area, creating a bridge between ${srcEn} and ${tgtEn} themes.`;
    contextHi = `आपकी ${domain} ऊर्जा ${houseHi(targetHouse)} भाव (${tgtMeaningHi}) में प्रवाहित होती है — ग्रह ${planetNatureHi} को इस जीवन क्षेत्र में प्रवाहित करता है।`;
  }

  return { en: contextEn, hi: contextHi };
}

// ---------------------------------------------------------------------------
// 1. narrateHouseLord — the biggest change
// ---------------------------------------------------------------------------

export interface HouseLordParams {
  lordPlanetId: number;
  lordPlanetName: LocaleText;
  lordHouse: number;
  lordSign: number;
  lordSignName: LocaleText;
  dignity: string;
  isRetrograde: boolean;
  primaryHouse: number;
  nativeAge?: number;
  domainName?: string;
  sourceHouseMeaning?: string;
  targetHouseMeaning?: string;
}

export function narrateHouseLord(p: HouseLordParams): LocaleText {
  const digEn = DIGNITY_EN[p.dignity] ?? p.dignity;
  const digHi = DIGNITY_HI[p.dignity] ?? p.dignity;
  const digImpactEn = DIGNITY_IMPACT_EN[p.dignity] ?? '';
  const digImpactHi = DIGNITY_IMPACT_HI[p.dignity] ?? '';
  const v = ageVerb(p.nativeAge, 0);
  const roleEn = PLANET_ROLE_EN[p.lordPlanetId] ?? '';
  const roleHi = PLANET_ROLE_HI[p.lordPlanetId] ?? '';
  const tgtMeaningEn = p.targetHouseMeaning ?? HOUSE_MEANINGS_EN[p.lordHouse] ?? '';
  const tgtMeaningHi = HOUSE_MEANINGS_HI[p.lordHouse] ?? '';
  const domain = p.domainName ?? HOUSE_LABEL_EN[p.primaryHouse] ?? `${ordinalEn(p.primaryHouse)} house`;
  const domainHi = HOUSE_LABEL_HI[p.primaryHouse] ?? `${houseHi(p.primaryHouse)} भाव`;

  // Opening — planet placement with relational context
  let en = `Your ${ordinalEn(p.primaryHouse)} lord ${p.lordPlanetName.en}${roleEn ? ` — ${roleEn} —` : ''} sits in the ${ordinalEn(p.lordHouse)} house of ${tgtMeaningEn} in ${p.lordSignName.en} (${digEn}).`;
  let hi = `आपका ${houseHi(p.primaryHouse)} भाव का स्वामी ${p.lordPlanetName.hi}${roleHi ? ` — ${roleHi} —` : ''} ${houseHi(p.lordHouse)} भाव (${tgtMeaningHi}) में ${p.lordSignName.hi} (${digHi}) में विराजमान है।`;

  // Relational meaning — WHY this placement matters for the domain
  const relational = getRelationalMeaning(p.primaryHouse, p.lordHouse, p.lordPlanetId, domain);
  en += ` ${relational.en}`;
  hi += ` ${relational.hi}`;

  // Dignity impact — what the sign placement does to the planet's ability
  if (digImpactEn) {
    en += ` ${p.lordPlanetName.en} here is ${digImpactEn}.`;
    hi += ` ${p.lordPlanetName.hi} यहां ${digImpactHi}।`;
  }

  // Age-aware phase
  en += ` You are currently ${v.en} the themes of your ${ordinalEn(p.primaryHouse)} house.`;
  hi += ` आप वर्तमान में ${houseHi(p.primaryHouse)} भाव के विषयों में ${v.hi} के चरण में हैं।`;

  // Retrograde — introspective intensity with meaning
  if (p.isRetrograde) {
    en += ` Retrograde ${p.lordPlanetName.en} turns this energy inward — expect delayed but deeply internalized results. What the world sees later, you feel and process first. Past-life karmic patterns related to ${domain} are being reworked.`;
    hi += ` वक्री ${p.lordPlanetName.hi} इस ऊर्जा को अंतर्मुखी करता है — विलंबित किंतु गहराई से आत्मसात किए गए परिणामों की अपेक्षा करें। ${domainHi} से संबंधित पूर्वजन्म के कार्मिक पैटर्न पुनर्निर्मित हो रहे हैं।`;
  }

  return { en, hi };
}

// ---------------------------------------------------------------------------
// 2. narrateOccupants — benefic/malefic impact with planet-specific meaning
// ---------------------------------------------------------------------------

export interface OccupantInfo {
  planetId: number;
  name: LocaleText;
  isBenefic: boolean;
}

export interface OccupantsParams {
  house: number;
  occupants: OccupantInfo[];
  nativeAge?: number;
  domainName?: string;
}

export function narrateOccupants(p: OccupantsParams): LocaleText {
  const houseMeaningEn = HOUSE_MEANINGS_EN[p.house] ?? '';
  const houseMeaningHi = HOUSE_MEANINGS_HI[p.house] ?? '';
  const domain = p.domainName ?? HOUSE_LABEL_EN[p.house] ?? `${ordinalEn(p.house)} house`;

  if (p.occupants.length === 0) {
    return {
      en: `No planets occupy your ${ordinalEn(p.house)} house — results depend primarily on the house lord's placement and any aspects received. An empty house is not a weak house; its lord tells the full story.`,
      hi: `आपके ${houseHi(p.house)} भाव में कोई ग्रह नहीं है — परिणाम मुख्य रूप से भावेश की स्थिति और प्राप्त दृष्टियों पर निर्भर करते हैं। खाली भाव कमजोर भाव नहीं है; इसका स्वामी पूरी कहानी बताता है।`,
    };
  }

  const benefics = p.occupants.filter((o) => o.isBenefic);
  const malefics = p.occupants.filter((o) => !o.isBenefic);

  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  if (benefics.length > 0) {
    for (const b of benefics) {
      const natureEn = PLANET_NATURE_EN[b.planetId] ?? 'positive energy';
      const natureHi = PLANET_NATURE_HI[b.planetId] ?? 'सकारात्मक ऊर्जा';
      const roleEn = PLANET_ROLE_EN[b.planetId] ?? 'a benefic';
      const roleHi = PLANET_ROLE_HI[b.planetId] ?? 'शुभ ग्रह';
      parts_en.push(`Benefic ${b.name.en} — ${roleEn} — graces your ${ordinalEn(p.house)} house of ${houseMeaningEn}, bringing ${natureEn} to your ${domain}. This is a protective and enriching presence.`);
      parts_hi.push(`शुभ ${b.name.hi ?? b.name.en} — ${roleHi} — आपके ${houseHi(p.house)} भाव (${houseMeaningHi}) को सुशोभित करता है, ${domain} में ${natureHi} लाता है। यह एक सुरक्षात्मक और समृद्ध करने वाली उपस्थिति है।`);
    }
  }

  if (malefics.length > 0) {
    for (const m of malefics) {
      const natureEn = PLANET_NATURE_EN[m.planetId] ?? 'challenging energy';
      const natureHi = PLANET_NATURE_HI[m.planetId] ?? 'चुनौतीपूर्ण ऊर्जा';
      parts_en.push(`${m.name.en} brings challenging energy to your ${ordinalEn(p.house)} house — ${natureEn} creates friction in ${domain} matters, but also builds resilience. The struggle this placement creates ultimately forges strength.`);
      parts_hi.push(`${m.name.hi ?? m.name.en} आपके ${houseHi(p.house)} भाव में चुनौतीपूर्ण ऊर्जा लाता है — ${natureHi} ${domain} विषयों में घर्षण पैदा करता है, लेकिन लचीलापन भी देता है।`);
    }
  }

  return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// 3. narrateAspects — what the aspect DOES
// ---------------------------------------------------------------------------

export interface AspectInfo {
  planetId: number;
  name: LocaleText;
  isBenefic: boolean;
  aspectType: string;
}

export interface AspectsParams {
  house: number;
  aspects: AspectInfo[];
  nativeAge?: number;
  domainName?: string;
}

export function narrateAspects(p: AspectsParams): LocaleText {
  const houseMeaningEn = HOUSE_MEANINGS_EN[p.house] ?? '';
  const houseMeaningHi = HOUSE_MEANINGS_HI[p.house] ?? '';
  const domain = p.domainName ?? HOUSE_LABEL_EN[p.house] ?? `${ordinalEn(p.house)} house`;

  if (p.aspects.length === 0) {
    return {
      en: `No significant planetary aspects influence your ${ordinalEn(p.house)} house directly — the house operates on the strength of its lord and occupants alone.`,
      hi: `कोई महत्वपूर्ण ग्रह दृष्टि आपके ${houseHi(p.house)} भाव को सीधे प्रभावित नहीं करती — भाव केवल अपने स्वामी और निवासी ग्रहों की शक्ति पर कार्य करता है।`,
    };
  }

  const sentences_en: string[] = [];
  const sentences_hi: string[] = [];

  for (const a of p.aspects) {
    const verbEn = ASPECT_VERB_EN[a.planetId] ?? (a.isBenefic ? 'supporting' : 'pressuring');
    const verbHi = ASPECT_VERB_HI[a.planetId] ?? (a.isBenefic ? 'सहायता करता है' : 'दबाव डालता है');

    if (a.isBenefic) {
      sentences_en.push(
        `${a.name.en} casts its ${a.aspectType} aspect onto your ${ordinalEn(p.house)} house of ${houseMeaningEn} — ${verbEn} your ${domain}. This protective gaze brings grace and support to these life matters.`
      );
      sentences_hi.push(
        `${a.name.hi ?? a.name.en} की ${a.aspectType} दृष्टि आपके ${houseHi(p.house)} भाव (${houseMeaningHi}) पर पड़ती है — आपके ${domain} को ${verbHi}। यह सुरक्षात्मक दृष्टि इन जीवन विषयों में कृपा लाती है।`
      );
    } else {
      sentences_en.push(
        `${a.name.en} casts its ${a.aspectType} aspect onto your ${ordinalEn(p.house)} house — ${verbEn} your ${domain}. This karmic gaze demands maturity, patience, and conscious effort in these matters. What survives this scrutiny becomes unshakeable.`
      );
      sentences_hi.push(
        `${a.name.hi ?? a.name.en} की ${a.aspectType} दृष्टि ${houseHi(p.house)} भाव पर पड़ती है — आपके ${domain} को ${verbHi}। यह कार्मिक दृष्टि इन विषयों में परिपक्वता और सचेत प्रयास की मांग करती है।`
      );
    }
  }

  return { en: sentences_en.join(' '), hi: sentences_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// 4. narrateYogas — connected to the domain
// ---------------------------------------------------------------------------

export interface YogaInfo {
  name: string;
  isAuspicious: boolean;
  strength: string;
  impact: LocaleText;
}

export interface YogasParams {
  yogas: YogaInfo[];
  nativeAge?: number;
  domainName?: string;
}

export function narrateYogas(p: YogasParams): LocaleText {
  if (p.yogas.length === 0) {
    return {
      en: 'No significant yogas directly influence this domain — the reading relies on house lords, occupants, and aspects for its assessment.',
      hi: 'कोई महत्वपूर्ण योग इस क्षेत्र को सीधे प्रभावित नहीं करता — मूल्यांकन भावेश, निवासी ग्रह और दृष्टियों पर आधारित है।',
    };
  }

  const domain = p.domainName ?? 'this domain';
  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  for (const y of p.yogas) {
    if (y.isAuspicious) {
      parts_en.push(
        `${y.name} (${y.strength}) strengthens ${domain} — ${y.impact.en}. This yoga acts as a multiplier, amplifying the positive potential in your chart for this life area.`
      );
      parts_hi.push(
        `${y.name} (${y.strength}) ${domain} को मजबूत करता है — ${y.impact.hi ?? y.impact.en}। यह योग आपकी कुंडली की सकारात्मक क्षमता को बढ़ाता है।`
      );
    } else {
      parts_en.push(
        `${y.name} (${y.strength}) challenges ${domain} — ${y.impact.en}. Awareness of this pattern is the first step to working with it. Targeted remedies and conscious effort can soften its impact significantly.`
      );
      parts_hi.push(
        `${y.name} (${y.strength}) ${domain} को चुनौती देता है — ${y.impact.hi ?? y.impact.en}। इस पैटर्न की जागरूकता इसके साथ काम करने का पहला कदम है। लक्षित उपाय इसके प्रभाव को काफी कम कर सकते हैं।`
      );
    }
  }

  return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// 5. narrateDoshas — severity in human terms
// ---------------------------------------------------------------------------

export interface DoshaInfo {
  name: string;
  severity: string;
  cancelled: boolean;
  impact: LocaleText;
}

export interface DoshasParams {
  doshas: DoshaInfo[];
  nativeAge?: number;
  domainName?: string;
}

export function narrateDoshas(p: DoshasParams): LocaleText {
  if (p.doshas.length === 0) {
    return {
      en: 'No significant doshas affect this domain — the chart is relatively clear here, allowing the positive placements to express themselves without obstruction.',
      hi: 'कोई महत्वपूर्ण दोष इस क्षेत्र को प्रभावित नहीं करता — कुंडली यहां अपेक्षाकृत स्पष्ट है, सकारात्मक स्थितियां बिना बाधा के अपना प्रभाव दिखा सकती हैं।',
    };
  }

  const domain = p.domainName ?? 'this area';
  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  for (const d of p.doshas) {
    if (d.cancelled) {
      parts_en.push(
        `${d.name} is present in your chart but effectively cancelled — the cancellation conditions are met, reducing its impact to a faint background influence. You may notice occasional echoes of its theme, but it lacks the power to cause real difficulty in ${domain}.`
      );
      parts_hi.push(
        `${d.name} आपकी कुंडली में उपस्थित है लेकिन प्रभावी रूप से निरस्त — रद्दीकरण की शर्तें पूरी हैं, इसका प्रभाव केवल हल्की पृष्ठभूमि तक सीमित है। ${domain} में वास्तविक कठिनाई की शक्ति इसमें नहीं रही।`
      );
    } else {
      const severityEn = d.severity === 'severe'
        ? 'This is a strong affliction that requires active attention'
        : d.severity === 'moderate'
          ? 'This is a moderate affliction — manageable with awareness and remedies'
          : 'This is a mild affliction — its impact is noticeable but not overwhelming';
      const severityHi = d.severity === 'severe'
        ? 'यह एक गंभीर पीड़ा है जिसे सक्रिय ध्यान देने की आवश्यकता है'
        : d.severity === 'moderate'
          ? 'यह एक मध्यम पीड़ा है — जागरूकता और उपायों से प्रबंधनीय'
          : 'यह एक हल्की पीड़ा है — इसका प्रभाव ध्यान देने योग्य लेकिन भारी नहीं';

      parts_en.push(
        `${d.name} (${d.severity}) is active in ${domain} — ${d.impact.en}. ${severityEn}. Every dosha also carries a hidden teaching; understanding its pattern is often the remedy itself.`
      );
      parts_hi.push(
        `${d.name} (${d.severity}) ${domain} में सक्रिय है — ${d.impact.hi ?? d.impact.en}। ${severityHi}। हर दोष एक छिपी शिक्षा भी रखता है; इसके पैटर्न को समझना अक्सर उपाय ही होता है।`
      );
    }
  }

  return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// 6. narrateVargaConfirmation
// ---------------------------------------------------------------------------

export interface VargaConfirmationParams {
  chartId: string;
  promiseScore: number;
  deliveryScore: number;
  verdict: LocaleText;
  keyFindings: string[];
  nativeAge?: number;
  domainName?: string;
}

/** Readable chart labels */
const VARGA_LABELS_EN: Record<string, string> = {
  D2: 'Hora (D2)', D4: 'Chaturthamsha (D4)', D7: 'Saptamsha (D7)',
  D9: 'Navamsha (D9)', D10: 'Dashamsha (D10)', D12: 'Dwadashamsha (D12)',
  D20: 'Vimshamsha (D20)', D24: 'Chaturvimshamsha (D24)',
  D30: 'Trimshamsha (D30)', D60: 'Shashtiamsha (D60)',
};

const VARGA_LABELS_HI: Record<string, string> = {
  D2: 'होरा (D2)', D4: 'चतुर्थांश (D4)', D7: 'सप्तमांश (D7)',
  D9: 'नवमांश (D9)', D10: 'दशमांश (D10)', D12: 'द्वादशांश (D12)',
  D20: 'विंशांश (D20)', D24: 'चतुर्विंशांश (D24)',
  D30: 'त्रिंशांश (D30)', D60: 'षष्ट्यंश (D60)',
};

/** Varga purpose descriptions */
const VARGA_PURPOSE_EN: Record<string, string> = {
  D2: 'wealth and resources',
  D4: 'property and fixed assets',
  D7: 'children and progeny',
  D9: 'marriage, dharma, and the soul\'s deeper journey',
  D10: 'career, profession, and public life',
  D12: 'parents and ancestral legacy',
  D20: 'spiritual progress and worship',
  D24: 'education, learning, and knowledge',
  D30: 'misfortunes and hidden weaknesses',
  D60: 'past-life karma and the finest destinies',
};

export function narrateVargaConfirmation(p: VargaConfirmationParams): LocaleText {
  const chartEn = VARGA_LABELS_EN[p.chartId] ?? p.chartId;
  const chartHi = VARGA_LABELS_HI[p.chartId] ?? p.chartId;
  const purposeEn = VARGA_PURPOSE_EN[p.chartId] ?? '';
  const strong = p.deliveryScore >= 60;
  const domain = p.domainName ?? 'this domain';

  let en = `In your ${chartEn}${purposeEn ? ` — the divisional chart for ${purposeEn}` : ''}, the delivery score of ${p.deliveryScore}/100 ${strong ? 'confirms a strong manifestation' : 'suggests a weaker manifestation'} for ${domain}.`;
  let hi = `आपके ${chartHi} में, वितरण स्कोर ${p.deliveryScore}/100 ${strong ? `${domain} के लिए मजबूत अभिव्यक्ति की पुष्टि करता है` : `${domain} के लिए कमजोर अभिव्यक्ति का सुझाव देता है`}।`;

  if (strong) {
    en += ` The birth chart promise is backed by divisional confirmation — what the D1 promises, the ${p.chartId} delivers.`;
    hi += ` जन्म कुंडली का वादा वर्ग कुंडली द्वारा समर्थित है — D1 जो वादा करता है, ${p.chartId} पूरा करता है।`;
  } else {
    en += ` The birth chart promise faces resistance at the divisional level — expect partial results or delayed manifestation. Remedies targeting the ${p.chartId} lord can improve outcomes.`;
    hi += ` जन्म कुंडली का वादा वर्ग स्तर पर प्रतिरोध का सामना करता है — आंशिक या विलंबित परिणामों की अपेक्षा करें।`;
  }

  if (p.verdict.en) {
    en += ` ${p.verdict.en}`;
    hi += ` ${p.verdict.hi ?? p.verdict.en}`;
  }

  if (p.keyFindings.length > 0) {
    en += ` Key findings: ${p.keyFindings.slice(0, 2).join('; ')}.`;
    hi += ` मुख्य निष्कर्ष: ${p.keyFindings.slice(0, 2).join('; ')}।`;
  }

  return { en, hi };
}

// ---------------------------------------------------------------------------
// 7. narrateDashaActivation
// ---------------------------------------------------------------------------

export interface DashaActivationParams {
  mahaLordId: number;
  mahaLordName: LocaleText;
  antarLordId: number;
  antarLordName: LocaleText;
  activatesDomain: boolean;
  relationship: string;
  nativeAge?: number;
  domainName?: string;
}

export function narrateDashaActivation(p: DashaActivationParams): LocaleText {
  const v = ageVerb(p.nativeAge, 1);
  const domain = p.domainName ?? 'this domain';
  const mahaRoleEn = PLANET_ROLE_EN[p.mahaLordId] ?? '';
  const mahaRoleHi = PLANET_ROLE_HI[p.mahaLordId] ?? '';
  const mahaNatureEn = PLANET_NATURE_EN[p.mahaLordId] ?? '';
  const antarNatureEn = PLANET_NATURE_EN[p.antarLordId] ?? '';

  let en = `You are in ${p.mahaLordName.en} Mahadasha / ${p.antarLordName.en} Antardasha.`;
  let hi = `आप ${p.mahaLordName.hi ?? p.mahaLordName.en} महादशा / ${p.antarLordName.hi ?? p.antarLordName.en} अंतर्दशा में हैं।`;

  if (p.activatesDomain) {
    en += ` This period directly activates ${domain}${mahaRoleEn ? ` — ${p.mahaLordName.en} (${mahaRoleEn}) brings ${mahaNatureEn}` : ''}, and ${p.antarLordName.en} adds ${antarNatureEn || 'its own signature'} to the mix.`;
    en += ` Themes are ${v.en} now — this is a live period for ${domain}. ${p.relationship}`;
    hi += ` यह अवधि ${domain} को सीधे सक्रिय करती है${mahaRoleHi ? ` — ${p.mahaLordName.hi ?? p.mahaLordName.en} (${mahaRoleHi})` : ''}।`;
    hi += ` विषय अभी ${v.hi} के चरण में हैं — यह ${domain} के लिए सक्रिय अवधि है। ${p.relationship}`;
  } else {
    en += ` This dasha does not directly activate ${domain}, so its effects remain background-level. The current planetary period is focused elsewhere — ${domain} operates on autopilot from natal promise until a future dasha brings it to the foreground.`;
    hi += ` यह दशा ${domain} को सीधे सक्रिय नहीं करती, इसलिए प्रभाव पृष्ठभूमि स्तर पर रहते हैं। वर्तमान ग्रह अवधि का ध्यान अन्यत्र है — ${domain} जन्म कुंडली के वादे पर स्वचालित रूप से चलता रहता है।`;
  }

  return { en: en.trim(), hi: hi.trim() };
}

// ---------------------------------------------------------------------------
// 8. narrateTransitOverlay
// ---------------------------------------------------------------------------

export interface TransitInfo {
  planetId: number;
  planetName: LocaleText;
  house: number;
  bindus: number;
}

export interface TransitOverlayParams {
  transits: TransitInfo[];
  nativeAge?: number;
  domainName?: string;
}

export function narrateTransitOverlay(p: TransitOverlayParams): LocaleText {
  const domain = p.domainName ?? 'this domain';

  if (p.transits.length === 0) {
    return {
      en: `No major transits currently influence ${domain} significantly — the natal promise operates without external activation or pressure from slow-moving planets.`,
      hi: `वर्तमान में कोई प्रमुख गोचर ${domain} को महत्वपूर्ण रूप से प्रभावित नहीं कर रहा — जन्म कुंडली का वादा धीमे ग्रहों के बाहरी सक्रियण के बिना काम करता है।`,
    };
  }

  const sentences_en: string[] = [];
  const sentences_hi: string[] = [];

  for (const t of p.transits) {
    const quality_en = t.bindus >= 5 ? 'excellent' : t.bindus >= 4 ? 'supportive' : 'challenging';
    const quality_hi = t.bindus >= 5 ? 'उत्कृष्ट' : t.bindus >= 4 ? 'सहायक' : 'चुनौतीपूर्ण';
    const houseMeaningEn = HOUSE_MEANINGS_EN[t.house] ?? '';
    const houseMeaningHi = HOUSE_MEANINGS_HI[t.house] ?? '';
    const planetNatureEn = PLANET_NATURE_EN[t.planetId] ?? '';
    const roleEn = PLANET_ROLE_EN[t.planetId] ?? '';

    if (t.bindus >= 5) {
      sentences_en.push(
        `${t.planetName.en}${roleEn ? ` (${roleEn})` : ''} transiting your ${ordinalEn(t.house)} house of ${houseMeaningEn} with ${t.bindus} ashtakavarga bindus — excellent for ${domain}. This transit opens doors and amplifies opportunities. ${planetNatureEn ? `Expect ${planetNatureEn} to flow freely during this period.` : ''}`
      );
    } else if (t.bindus >= 4) {
      sentences_en.push(
        `${t.planetName.en} transiting your ${ordinalEn(t.house)} house with ${t.bindus} ashtakavarga bindus — supportive for ${domain}. A steady, constructive influence that works best when you actively engage with its energy.`
      );
    } else {
      sentences_en.push(
        `${t.planetName.en} transiting your ${ordinalEn(t.house)} house of ${houseMeaningEn} with only ${t.bindus} ashtakavarga bindus — challenging for ${domain}. This transit creates friction but also forces growth. Stay patient and avoid major decisions until it passes.`
      );
    }

    sentences_hi.push(
      `${t.planetName.hi ?? t.planetName.en} आपके ${houseHi(t.house)} भाव (${houseMeaningHi}) में ${t.bindus} अष्टकवर्ग बिंदुओं के साथ गोचर कर रहा है — ${domain} के लिए ${quality_hi}।`
    );
  }

  return { en: sentences_en.join(' '), hi: sentences_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// 9. narrateForwardTriggers
// ---------------------------------------------------------------------------

export interface TriggerInfo {
  date: string;
  event: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface ForwardTriggersParams {
  triggers: TriggerInfo[];
  count?: number;
  nativeAge?: number;
  domainName?: string;
}

const IMPACT_LABEL_EN: Record<string, string> = {
  positive: 'a positive window — act with confidence',
  negative: 'a period demanding caution — avoid major commitments',
  neutral:  'a transitional period — observe and prepare',
};

const IMPACT_LABEL_HI: Record<string, string> = {
  positive: 'एक सकारात्मक अवधि — विश्वास के साथ कार्य करें',
  negative: 'सावधानी की अवधि — बड़ी प्रतिबद्धताओं से बचें',
  neutral:  'एक संक्रमणकालीन अवधि — निरीक्षण करें और तैयारी करें',
};

export function narrateForwardTriggers(p: ForwardTriggersParams): LocaleText {
  const limit = p.count ?? 3;
  const triggers = p.triggers.slice(0, limit);
  const domain = p.domainName ?? 'this domain';

  if (triggers.length === 0) {
    return {
      en: `No significant upcoming triggers are detected for ${domain} in the near future — the current pattern continues without major disruption or opportunity.`,
      hi: `निकट भविष्य में ${domain} के लिए कोई महत्वपूर्ण आगामी संकेत नहीं मिले — वर्तमान पैटर्न बिना बड़ी बाधा या अवसर के जारी रहता है।`,
    };
  }

  const items_en: string[] = [];
  const items_hi: string[] = [];

  for (const t of triggers) {
    items_en.push(`${t.event} around ${t.date} — ${IMPACT_LABEL_EN[t.impact] ?? 'a notable period'}`);
    items_hi.push(`${t.event} ${t.date} के आसपास — ${IMPACT_LABEL_HI[t.impact] ?? 'एक उल्लेखनीय अवधि'}`);
  }

  return {
    en: `Watch for: ${items_en.join('. ')}.`,
    hi: `ध्यान दें: ${items_hi.join('। ')}।`,
  };
}

// ---------------------------------------------------------------------------
// Composition helper — joins narrative blocks with contextual connectors
// ---------------------------------------------------------------------------

/**
 * Joins an array of LocaleText narrative blocks into a single coherent
 * paragraph, inserting contextual connectors between blocks.
 *
 * Connectors are chosen to provide variety; no semantic NLP is attempted —
 * the caller is responsible for ordering blocks logically (strengths first,
 * then challenges, then outlook).
 */
export function composeDomainNarrative(blocks: LocaleText[]): LocaleText {
  const nonEmpty = blocks.filter((b) => b.en.trim().length > 0);
  if (nonEmpty.length === 0) return { en: '', hi: '' };
  if (nonEmpty.length === 1) return nonEmpty[0];

  const CONNECTORS_EN = [
    '',            // first block — no connector
    'Additionally, ',
    'Furthermore, ',
    'On a related note, ',
    'Moreover, ',
    'Looking ahead, ',
    'In summary, ',
  ];

  const CONNECTORS_HI = [
    '',
    'इसके अतिरिक्त, ',
    'इसके अलावा, ',
    'संबंधित रूप से, ',
    'इसके साथ ही, ',
    'आगे देखते हुए, ',
    'सारांश में, ',
  ];

  const en_parts: string[] = [];
  const hi_parts: string[] = [];

  for (let i = 0; i < nonEmpty.length; i++) {
    const cIdx = Math.min(i, CONNECTORS_EN.length - 1);
    const connEn = CONNECTORS_EN[cIdx];
    const connHi = CONNECTORS_HI[cIdx];

    // Lowercase the first char when prepending a connector (except first block)
    let enText = nonEmpty[i].en.trim();
    let hiText = (nonEmpty[i].hi ?? nonEmpty[i].en).trim();

    if (i > 0 && connEn) {
      // Lowercase only ASCII first letter for English
      enText = enText.charAt(0).toLowerCase() + enText.slice(1);
    }

    en_parts.push(connEn + enText);
    hi_parts.push(connHi + hiText);
  }

  return {
    en: en_parts.join(' '),
    hi: hi_parts.join(' '),
  };
}
