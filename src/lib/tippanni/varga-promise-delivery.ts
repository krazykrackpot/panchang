/**
 * Varga Promise/Delivery Scoring Engine
 *
 * In Jyotish the D1 (Rasi) chart shows the "promise" — what life has in store.
 * Divisional charts (D9, D10, etc.) show "delivery" — how well the promise
 * manifests in specific life domains.  A 4×4 matrix of promise vs delivery
 * tiers yields 16 distinct verdicts.
 */

import type { DignityLevel, PromiseDeliveryScore } from './varga-tippanni-types-v2';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export interface PromiseInput {
  beneficOccupants: number;   // +15 each
  maleficOccupants: number;   // -10 each
  lordInKendra: boolean;      // +20
  lordInTrikona?: boolean;    // +15
  lordInDusthana?: boolean;   // -15
  lordDignity: DignityLevel;  // variable
  beneficAspects: number;     // +10 each
  maleficAspects: number;     // -10 each
  karakaShadbala: number;     // >=1.0 → +15
  savScore: number;           // >=30 → +10, <=22 → -10
}

export interface DeliveryInput extends PromiseInput {
  yogaCount: number;          // +15 each
  vargottamaCount: number;    // +10 each
  pushkaraCount: number;      // +10 each
  gandantaCount: number;      // -15 each
}

// ---------------------------------------------------------------------------
// Dignity score map
// ---------------------------------------------------------------------------

const DIGNITY_POINTS: Record<DignityLevel, number> = {
  exalted: 20,
  own: 15,
  friend: 5,
  neutral: 0,
  enemy: -10,
  debilitated: -15,
};

// ---------------------------------------------------------------------------
// Scoring helpers
// ---------------------------------------------------------------------------

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function computeBaseScore(input: PromiseInput): number {
  let score = 50; // baseline

  score += input.beneficOccupants * 15;
  score -= input.maleficOccupants * 10;

  if (input.lordInKendra) score += 20;
  if (input.lordInTrikona) score += 15;
  if (input.lordInDusthana) score -= 15;

  score += DIGNITY_POINTS[input.lordDignity];

  score += input.beneficAspects * 10;
  score -= input.maleficAspects * 10;

  if (input.karakaShadbala >= 1.0) score += 15;

  if (input.savScore >= 30) score += 10;
  else if (input.savScore <= 22) score -= 10;

  return score;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Score natal D1 promise for a domain house.  Returns 0–100. */
export function scorePromise(input: PromiseInput): number {
  return clamp(computeBaseScore(input), 0, 100);
}

/** Score divisional chart delivery.  Same factors as promise, plus varga-specific bonuses/penalties.  Returns 0–100. */
export function scoreDelivery(input: DeliveryInput): number {
  let score = computeBaseScore(input);

  score += input.yogaCount * 15;
  score += input.vargottamaCount * 10;
  score += input.pushkaraCount * 10;
  score -= input.gandantaCount * 15;

  return clamp(score, 0, 100);
}

// ---------------------------------------------------------------------------
// Tier helpers
// ---------------------------------------------------------------------------

type Tier = 'strong' | 'good' | 'modest' | 'weak';

function toTier(score: number): Tier {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'good';
  if (score >= 25) return 'modest';
  return 'weak';
}

// Map tier pair → verdictKey naming: d1Tier + '_' + dxxTierLabel
// dxx tiers use different labels to avoid confusion:
//   strong→excellent, good→favourable, modest→modest, weak→weak
function dxxTierLabel(t: Tier): string {
  switch (t) {
    case 'strong': return 'excellent';
    case 'good': return 'favourable';
    case 'modest': return 'modest';
    case 'weak': return 'weak';
  }
}

// ---------------------------------------------------------------------------
// 4×4 Verdict matrix (16 entries)
// ---------------------------------------------------------------------------

interface VerdictText { en: string; hi: string }

const VERDICT_MATRIX: Record<string, VerdictText> = {
  // strong promise ×
  strong_excellent: {
    en: 'Supreme manifestation. Both the natal promise and divisional delivery are powerful — this domain is a pillar of strength in the native\'s life, blessed by planetary grace.',
    hi: 'सर्वोच्च अभिव्यक्ति। जन्मकुण्डली का वचन और वर्ग-फल दोनों अत्यन्त प्रबल हैं — यह क्षेत्र जातक के जीवन का स्तम्भ है, ग्रह-कृपा से सम्पन्न।',
  },
  strong_favourable: {
    en: 'Strong foundation with solid delivery. The natal chart promises much and the divisional chart largely fulfils it — expect consistent, above-average results in this domain.',
    hi: 'दृढ़ आधार और अच्छा फलन। जन्मकुण्डली बहुत वचन देती है और वर्ग-चार्ट उसे काफ़ी हद तक पूरा करता है — इस क्षेत्र में निरन्तर श्रेष्ठ परिणाम अपेक्षित हैं।',
  },
  strong_modest: {
    en: 'Unfulfilled potential. The natal chart carries a strong promise, but the divisional chart delivers only modestly — conscious effort and remedial measures can bridge the gap.',
    hi: 'अपूर्ण सम्भावना। जन्मकुण्डली में प्रबल वचन है, किन्तु वर्ग-फल मध्यम है — सचेत प्रयास और उपाय इस अन्तर को पाट सकते हैं।',
  },
  strong_weak: {
    en: 'Blocked promise. The birth chart signals great potential, yet the divisional chart severely restricts its expression — karmic obstructions demand patience and targeted remedies.',
    hi: 'अवरुद्ध वचन। जन्मकुण्डली महान सम्भावना दर्शाती है, परन्तु वर्ग-चार्ट उसकी अभिव्यक्ति रोकता है — कार्मिक बाधाओं के लिए धैर्य और लक्षित उपाय आवश्यक हैं।',
  },

  // good promise ×
  good_excellent: {
    en: 'Amplified outcome. A solid natal promise is powerfully boosted by the divisional chart — this domain will likely exceed expectations and bring gratifying results.',
    hi: 'प्रवर्धित फल। अच्छे जन्म-वचन को वर्ग-चार्ट शक्तिशाली रूप से बढ़ाता है — यह क्षेत्र अपेक्षा से अधिक सन्तोषजनक परिणाम देगा।',
  },
  good_favourable: {
    en: 'Balanced and reliable. Both promise and delivery are comfortably above average — a dependable domain where steady progress can be expected throughout life.',
    hi: 'सन्तुलित और विश्वसनीय। वचन और फलन दोनों औसत से ऊपर हैं — एक भरोसेमन्द क्षेत्र जहाँ जीवनभर स्थिर प्रगति अपेक्षित है।',
  },
  good_modest: {
    en: 'Partial fulfilment. The natal potential is decent but the divisional chart returns only average results — periodic effort and favourable dashas can unlock more.',
    hi: 'आंशिक पूर्ति। जन्म-सम्भावना ठीक है पर वर्ग-फल केवल सामान्य है — समय-समय पर प्रयास और अनुकूल दशा अधिक फल दे सकते हैं।',
  },
  good_weak: {
    en: 'Diminished returns. A reasonable promise is undermined by divisional weakness — this domain may feel frustrating despite outward indicators; inner-chart remedies recommended.',
    hi: 'न्यून प्रतिफल। उचित वचन को वर्ग-दुर्बलता क्षीण करती है — बाह्य संकेतों के बावजूद यह क्षेत्र निराशाजनक लग सकता है; आन्तरिक-चार्ट उपाय सुझाए जाते हैं।',
  },

  // modest promise ×
  modest_excellent: {
    en: 'Hidden treasure. The natal chart is modest but the divisional chart dramatically elevates this domain — a sleeper area that can surprise with late-blooming success.',
    hi: 'छिपा हुआ खज़ाना। जन्मकुण्डली मध्यम है पर वर्ग-चार्ट इस क्षेत्र को नाटकीय रूप से ऊँचा उठाता है — विलम्ब से पुष्पित होने वाली सफलता का क्षेत्र।',
  },
  modest_favourable: {
    en: 'Quiet growth. A modest natal setup finds favourable support in the divisional chart — progress is real but gradual, rewarding perseverance over haste.',
    hi: 'शान्त वृद्धि। मध्यम जन्म-स्थिति को वर्ग-चार्ट में अनुकूल सहारा मिलता है — प्रगति वास्तविक पर क्रमिक है, जल्दबाज़ी से नहीं धैर्य से फल मिलता है।',
  },
  modest_modest: {
    en: 'Underwhelming — consider redirecting energy to stronger domains. Neither the natal promise nor divisional delivery provide much traction here; practical acceptance frees resources for better areas.',
    hi: 'निराशाजनक — ऊर्जा को सशक्त क्षेत्रों की ओर मोड़ने पर विचार करें। न जन्म-वचन न वर्ग-फल यहाँ अधिक सहायक है; व्यावहारिक स्वीकृति बेहतर क्षेत्रों के लिए संसाधन मुक्त करती है।',
  },
  modest_weak: {
    en: 'Struggling area. With modest promise and weak delivery, this domain needs careful management — lower expectations and focus remedies on the divisional lord.',
    hi: 'संघर्षशील क्षेत्र। मध्यम वचन और दुर्बल फलन के साथ, इस क्षेत्र में सावधान प्रबन्धन चाहिए — अपेक्षाएँ कम रखें और वर्ग-स्वामी पर उपाय केन्द्रित करें।',
  },

  // weak promise ×
  weak_excellent: {
    en: 'Unexpected gift — the divisional chart dramatically overrides natal weakness. Despite a frail birth-chart promise, the varga delivers powerfully; embrace this domain as a karmic bonus.',
    hi: 'अप्रत्याशित वरदान — वर्ग-चार्ट जन्म-दुर्बलता को नाटकीय रूप से पलट देता है। क्षीण जन्म-वचन के बावजूद वर्ग शक्तिशाली फल देता है; इसे कार्मिक बोनस मानें।',
  },
  weak_favourable: {
    en: 'Salvaged by divisional strength. The natal chart offers little, but the varga provides a favourable cushion — results are better than the birth chart would suggest.',
    hi: 'वर्ग-शक्ति द्वारा बचाव। जन्मकुण्डली कम देती है, पर वर्ग अनुकूल सहारा प्रदान करता है — परिणाम जन्मकुण्डली के संकेत से बेहतर हैं।',
  },
  weak_modest: {
    en: 'Limited scope. Both natal and divisional indicators are below average — this is not a domain of natural strength; acceptance and compensatory strategies serve better than force.',
    hi: 'सीमित दायरा। जन्म और वर्ग दोनों संकेतक औसत से नीचे हैं — यह प्राकृतिक शक्ति का क्षेत्र नहीं है; स्वीकृति और प्रतिपूरक रणनीतियाँ बल-प्रयोग से बेहतर हैं।',
  },
  weak_weak: {
    en: 'Karmic void. Both promise and delivery are minimal — this domain is not activated in this lifetime. Spiritual detachment may be the wisest response; focus energy on stronger areas.',
    hi: 'कार्मिक शून्य। वचन और फलन दोनों न्यूनतम हैं — यह क्षेत्र इस जन्म में सक्रिय नहीं है। आध्यात्मिक वैराग्य सर्वोत्तम प्रतिक्रिया हो सकती है; ऊर्जा सशक्त क्षेत्रों पर लगाएँ।',
  },
};

// ---------------------------------------------------------------------------
// getVerdict
// ---------------------------------------------------------------------------

/**
 * Given a D1 promise score and a divisional delivery score (both 0–100),
 * return the full PromiseDeliveryScore with tier-based verdict.
 */
export function getVerdict(d1Score: number, dxxScore: number): PromiseDeliveryScore {
  const d1Tier = toTier(d1Score);
  const dxxLabel = dxxTierLabel(toTier(dxxScore));
  const key = `${d1Tier}_${dxxLabel}`;

  const text = VERDICT_MATRIX[key];
  const verdict: LocaleText = {
    en: text.en,
    hi: text.hi,
  };

  return {
    d1Promise: d1Score,
    dxxDelivery: dxxScore,
    verdictKey: key,
    verdict,
  };
}
