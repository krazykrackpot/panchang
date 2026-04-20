/**
 * Domain Narrator — Composable Narrative Blocks
 *
 * 9 composable narrative functions that produce bilingual (en + hi)
 * sentences from structured domain-synthesis data.  Each function
 * accepts pre-resolved data (not raw KundaliData) and returns a
 * LocaleText with 1-3 sentences.
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
  young:  { en: ['building', 'developing', 'establishing'],       hi: ['निर्माण', 'विकास', 'स्थापना'] },
  mid:    { en: ['consolidating', 'strengthening', 'deepening'],  hi: ['सुदृढ़ीकरण', 'मजबूती', 'गहनता'] },
  mature: { en: ['harvesting', 'enjoying', 'leveraging'],         hi: ['कटाई', 'आनंद', 'उपयोग'] },
  senior: { en: ['legacy', 'mentoring', 'transcending'],          hi: ['विरासत', 'मार्गदर्शन', 'उत्कर्ष'] },
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
// Dignity labels
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

// ---------------------------------------------------------------------------
// 1. narrateHouseLord
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
}

export function narrateHouseLord(p: HouseLordParams): LocaleText {
  const digEn = DIGNITY_EN[p.dignity] ?? p.dignity;
  const digHi = DIGNITY_HI[p.dignity] ?? p.dignity;
  const v = ageVerb(p.nativeAge, 0);

  let en = `Your ${ordinalEn(p.primaryHouse)} lord ${p.lordPlanetName.en} is placed in the ${ordinalEn(p.lordHouse)} house in ${p.lordSignName.en} (${digEn}).`;
  let hi = `आपका ${houseHi(p.primaryHouse)} भाव का स्वामी ${p.lordPlanetName.hi} ${houseHi(p.lordHouse)} भाव में ${p.lordSignName.hi} (${digHi}) में स्थित है।`;

  en += ` This indicates a phase of ${v.en} for matters of the ${ordinalEn(p.primaryHouse)} house.`;
  hi += ` यह ${houseHi(p.primaryHouse)} भाव के विषयों में ${v.hi} का चरण दर्शाता है।`;

  if (p.isRetrograde) {
    en += ` Retrograde ${p.lordPlanetName.en} adds introspective intensity to these matters.`;
    hi += ` वक्री ${p.lordPlanetName.hi} इन विषयों में आंतरिक तीव्रता जोड़ता है।`;
  }

  return { en, hi };
}

// ---------------------------------------------------------------------------
// 2. narrateOccupants
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
}

export function narrateOccupants(p: OccupantsParams): LocaleText {
  if (p.occupants.length === 0) {
    return {
      en: `No planets occupy your ${ordinalEn(p.house)} house — results depend primarily on the house lord's placement.`,
      hi: `आपके ${houseHi(p.house)} भाव में कोई ग्रह नहीं है — परिणाम मुख्य रूप से भावेश की स्थिति पर निर्भर करते हैं।`,
    };
  }

  const benefics = p.occupants.filter((o) => o.isBenefic);
  const malefics = p.occupants.filter((o) => !o.isBenefic);

  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  if (benefics.length > 0) {
    const names_en = benefics.map((b) => b.name.en).join(' and ');
    const names_hi = benefics.map((b) => b.name.hi ?? b.name.en).join(' और ');
    parts_en.push(`Benefic ${names_en} ${benefics.length === 1 ? 'occupies' : 'occupy'} your ${ordinalEn(p.house)} house, bringing positive energy to its significations.`);
    parts_hi.push(`शुभ ${names_hi} आपके ${houseHi(p.house)} भाव में ${benefics.length === 1 ? 'स्थित है' : 'स्थित हैं'}, जो इसके फलों में सकारात्मक ऊर्जा लाता है।`);
  }

  if (malefics.length > 0) {
    const names_en = malefics.map((m) => m.name.en).join(' and ');
    const names_hi = malefics.map((m) => m.name.hi ?? m.name.en).join(' और ');
    parts_en.push(`${names_en} ${malefics.length === 1 ? 'brings' : 'bring'} challenging energy to the ${ordinalEn(p.house)} house, requiring effort to manage.`);
    parts_hi.push(`${names_hi} ${houseHi(p.house)} भाव में चुनौतीपूर्ण ऊर्जा ${malefics.length === 1 ? 'लाता है' : 'लाते हैं'}, जिसमें प्रयास की आवश्यकता है।`);
  }

  return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// 3. narrateAspects
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
}

export function narrateAspects(p: AspectsParams): LocaleText {
  if (p.aspects.length === 0) {
    return {
      en: `No significant planetary aspects influence your ${ordinalEn(p.house)} house directly.`,
      hi: `कोई महत्वपूर्ण ग्रह दृष्टि आपके ${houseHi(p.house)} भाव को सीधे प्रभावित नहीं करती।`,
    };
  }

  const sentences_en: string[] = [];
  const sentences_hi: string[] = [];

  for (const a of p.aspects) {
    const nature_en = a.isBenefic ? 'protective and supportive' : 'karmic and demanding';
    const nature_hi = a.isBenefic ? 'सुरक्षात्मक और सहायक' : 'कार्मिक और कठोर';
    sentences_en.push(`${a.name.en}'s ${a.aspectType} aspect on the ${ordinalEn(p.house)} house is ${nature_en}.`);
    sentences_hi.push(`${a.name.hi ?? a.name.en} की ${a.aspectType} दृष्टि ${houseHi(p.house)} भाव पर ${nature_hi} है।`);
  }

  return { en: sentences_en.join(' '), hi: sentences_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// 4. narrateYogas
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
}

export function narrateYogas(p: YogasParams): LocaleText {
  if (p.yogas.length === 0) {
    return {
      en: 'No significant yogas directly influence this domain.',
      hi: 'कोई महत्वपूर्ण योग इस क्षेत्र को सीधे प्रभावित नहीं करता।',
    };
  }

  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  for (const y of p.yogas) {
    const qualifier_en = y.isAuspicious ? 'strengthens' : 'challenges';
    const qualifier_hi = y.isAuspicious ? 'मजबूत करता है' : 'चुनौती देता है';
    parts_en.push(`${y.name} (${y.strength}) ${qualifier_en} this domain — ${y.impact.en}`);
    parts_hi.push(`${y.name} (${y.strength}) इस क्षेत्र को ${qualifier_hi} — ${y.impact.hi ?? y.impact.en}`);
  }

  return { en: parts_en.join('. ') + '.', hi: parts_hi.join('। ') + '।' };
}

// ---------------------------------------------------------------------------
// 5. narrateDoshas
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
}

export function narrateDoshas(p: DoshasParams): LocaleText {
  if (p.doshas.length === 0) {
    return {
      en: 'No significant doshas affect this domain — the chart is relatively clear here.',
      hi: 'कोई महत्वपूर्ण दोष इस क्षेत्र को प्रभावित नहीं करता — कुण्डली यहां अपेक्षाकृत स्पष्ट है।',
    };
  }

  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  for (const d of p.doshas) {
    if (d.cancelled) {
      parts_en.push(`${d.name} is present but cancelled — effective impact is negligible.`);
      parts_hi.push(`${d.name} उपस्थित है लेकिन निरस्त — प्रभावी प्रभाव नगण्य है।`);
    } else {
      parts_en.push(`${d.name} (${d.severity}) is active — ${d.impact.en}`);
      parts_hi.push(`${d.name} (${d.severity}) सक्रिय है — ${d.impact.hi ?? d.impact.en}`);
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

export function narrateVargaConfirmation(p: VargaConfirmationParams): LocaleText {
  const chartEn = VARGA_LABELS_EN[p.chartId] ?? p.chartId;
  const chartHi = VARGA_LABELS_HI[p.chartId] ?? p.chartId;
  const strong = p.deliveryScore >= 60;

  let en = `In your ${chartEn}, the delivery score of ${p.deliveryScore}/100 ${strong ? 'confirms a strong manifestation' : 'suggests a weaker manifestation'}.`;
  let hi = `आपके ${chartHi} में, वितरण स्कोर ${p.deliveryScore}/100 ${strong ? 'एक मजबूत अभिव्यक्ति की पुष्टि करता है' : 'एक कमजोर अभिव्यक्ति का सुझाव देता है'}।`;

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
}

export function narrateDashaActivation(p: DashaActivationParams): LocaleText {
  const v = ageVerb(p.nativeAge, 1);

  let en = `You are in ${p.mahaLordName.en} Mahadasha / ${p.antarLordName.en} Antardasha.`;
  let hi = `आप ${p.mahaLordName.hi ?? p.mahaLordName.en} महादशा / ${p.antarLordName.hi ?? p.antarLordName.en} अंतर्दशा में हैं।`;

  if (p.activatesDomain) {
    en += ` This period directly activates this domain — themes are ${v.en} now. ${p.relationship}`;
    hi += ` यह अवधि इस क्षेत्र को सीधे सक्रिय करती है — विषय अभी ${v.hi} के चरण में हैं। ${p.relationship}`;
  } else {
    en += ` This dasha does not directly activate this domain, so effects remain background-level.`;
    hi += ` यह दशा इस क्षेत्र को सीधे सक्रिय नहीं करती, इसलिए प्रभाव पृष्ठभूमि स्तर पर रहते हैं।`;
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
}

export function narrateTransitOverlay(p: TransitOverlayParams): LocaleText {
  if (p.transits.length === 0) {
    return {
      en: 'No major transits currently influence this domain significantly.',
      hi: 'वर्तमान में कोई प्रमुख गोचर इस क्षेत्र को महत्वपूर्ण रूप से प्रभावित नहीं कर रहा।',
    };
  }

  const sentences_en: string[] = [];
  const sentences_hi: string[] = [];

  for (const t of p.transits) {
    const quality_en = t.bindus >= 5 ? 'excellent' : t.bindus >= 4 ? 'supportive' : 'challenging';
    const quality_hi = t.bindus >= 5 ? 'उत्कृष्ट' : t.bindus >= 4 ? 'सहायक' : 'चुनौतीपूर्ण';

    sentences_en.push(
      `${t.planetName.en} transiting your ${ordinalEn(t.house)} house with ${t.bindus} ashtakavarga bindus — ${quality_en} for this domain.`
    );
    sentences_hi.push(
      `${t.planetName.hi ?? t.planetName.en} आपके ${houseHi(t.house)} भाव में ${t.bindus} अष्टकवर्ग बिंदुओं के साथ गोचर कर रहा है — इस क्षेत्र के लिए ${quality_hi}।`
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
}

const IMPACT_LABEL_EN: Record<string, string> = {
  positive: 'a positive window',
  negative: 'a period demanding caution',
  neutral:  'a transitional period',
};

const IMPACT_LABEL_HI: Record<string, string> = {
  positive: 'एक सकारात्मक अवधि',
  negative: 'सावधानी की अवधि',
  neutral:  'एक संक्रमणकालीन अवधि',
};

export function narrateForwardTriggers(p: ForwardTriggersParams): LocaleText {
  const limit = p.count ?? 3;
  const triggers = p.triggers.slice(0, limit);

  if (triggers.length === 0) {
    return {
      en: 'No significant upcoming triggers are detected for this domain in the near future.',
      hi: 'निकट भविष्य में इस क्षेत्र के लिए कोई महत्वपूर्ण आगामी संकेत नहीं मिले।',
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
