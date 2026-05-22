/**
 * Per-category scaffolds — a short paragraph that primes the LLM on which
 * Jyotish lens to use for this question's category, without being so
 * prescriptive that it forces a structure.
 *
 * Composed AFTER voice + rules, BEFORE the user's actual question + JSON.
 *
 * Scaffolds intentionally stay short (≤ 60 words EN) to preserve the
 * prompt-caching benefit of the upstream voice/rules block — the
 * scaffold varies per question, so anything heavy here defeats the cache.
 */

import type { BrihaspatiCategory, BrihaspatiLocale } from '../../../types';

type ScaffoldMap = Record<BrihaspatiCategory, string>;

const EN: ScaffoldMap = {
  career: 'Lens: 10th house (karma sthāna) and its lord, the strength of Saturn and the Sun, the active dasha lord\'s relation to the 10th, and any active transit aspecting the 10th or its lord.',
  marriage: 'Lens: 7th house (jaaya sthāna) and its lord, Venus for both genders and Jupiter for women, the active dasha lord\'s relation to marriage karakas, and the activation timing in dasha + transit.',
  health: 'Lens: 6th house (roga sthāna), 8th house (āyu / chronic), lagna lord\'s strength, and any malefic transits to lagna or 6th/8th. Frame health insights as complementary to medical care, never a substitute.',
  finance: 'Lens: 2nd house (dhana), 11th house (labha), Jupiter as wealth karaka, the active dasha lord\'s relation to those houses, and any Jupiter or Venus transits that activate them.',
  children: 'Lens: 5th house (putra sthāna), its lord, Jupiter as putra-kāraka for women and the Sun for men, the active dasha lord\'s relation to the 5th, and Jupiter\'s transit through the 5th or its trines.',
  education: 'Lens: 4th house (foundational), 5th house (intellect), Mercury and Jupiter as natural karakas, and the active dasha lord\'s harmony with these signifiers. For exam timing, also look at Mercury transit.',
  dasha: 'Lens: the current mahadasha lord — its placement, dignity, aspects, and the houses it activates — together with the antardasha lord. Describe what this period is asking of the seeker, not "good" or "bad".',
  remedies: 'Lens: the weakest planet by Shadbala if available, plus any flagged dosha. Match remedy to the specific planet\'s nature. Avoid generic remedies — match the chart.',
  compatibility: 'Lens: Ashta Kuta points if both charts are present, the relationship of the 7th lords, and the harmony of both Moons. Reframe "compatible / not compatible" into "what this combination asks of each partner".',
  timing: 'Lens: classical muhurta principles (Panchanga Shuddhi, weekday lord, choghadiya, hora) plus the seeker\'s personal Chandra Bala / Tara Bala if available.',
  transit: 'Lens: the named transit (Saturn, Jupiter, Rahu/Ketu) relative to the seeker\'s natal lagna and moon, the houses being activated, and the dasha that this transit is colouring.',
  general: 'Lens: the chart\'s centre of gravity — the planet most strongly placed and aspected — together with the current dasha and any major transit. Describe a life that is asking the seeker to grow in a specific direction.',
};

const HI: ScaffoldMap = {
  career: 'दृष्टि: दशम भाव (कर्म स्थान) और उसका स्वामी, शनि और सूर्य की शक्ति, सक्रिय दशा स्वामी का दशम से सम्बन्ध, और दशम या उसके स्वामी पर सक्रिय गोचर।',
  marriage: 'दृष्टि: सप्तम भाव (जाया स्थान) और उसका स्वामी, दोनों लिंगों के लिए शुक्र तथा स्त्रियों के लिए गुरु, सक्रिय दशा स्वामी का विवाह कारकों से सम्बन्ध, तथा दशा और गोचर में सक्रियता का समय।',
  health: 'दृष्टि: षष्ठ भाव (रोग स्थान), अष्टम भाव (आयु/जीर्ण), लग्नेश की शक्ति, तथा लग्न या 6/8 पर पापग्रह गोचर। स्वास्थ्य सम्बन्धी अन्तर्दृष्टि चिकित्सकीय देखभाल का पूरक है, विकल्प नहीं।',
  finance: 'दृष्टि: द्वितीय भाव (धन), एकादश भाव (लाभ), धन कारक गुरु, इन भावों से सक्रिय दशा स्वामी का सम्बन्ध, और इन्हें सक्रिय करने वाले गुरु या शुक्र के गोचर।',
  children: 'दृष्टि: पंचम भाव (पुत्र स्थान), उसका स्वामी, स्त्रियों के लिए पुत्र-कारक गुरु तथा पुरुषों के लिए सूर्य, पंचम से सक्रिय दशा स्वामी का सम्बन्ध, और गुरु का पंचम या त्रिकोणीय भावों से गोचर।',
  education: 'दृष्टि: चतुर्थ भाव (नींव), पंचम भाव (बुद्धि), प्राकृतिक कारक बुध और गुरु, तथा सक्रिय दशा स्वामी की इन कारकों से अनुकूलता।',
  dasha: 'दृष्टि: वर्तमान महादशा स्वामी — उसकी स्थिति, दिग्बल, दृष्टि, और जिन भावों को वह सक्रिय करता है — साथ ही अन्तर्दशा स्वामी। यह काल जातक से क्या माँग रहा है, इसका वर्णन करें — "अच्छा" या "बुरा" नहीं।',
  remedies: 'दृष्टि: यदि उपलब्ध हो तो षड्बल से सबसे कमज़ोर ग्रह, तथा कोई भी चिह्नित दोष। उपाय को विशिष्ट ग्रह के स्वभाव से मिलाएँ। सामान्य उपायों से बचें — कुण्डली से मिलाएँ।',
  compatibility: 'दृष्टि: यदि दोनों कुण्डलियाँ उपलब्ध हों तो अष्ट कूट बिन्दु, सप्तमेशों का सम्बन्ध, और दोनों चन्द्र की अनुकूलता।',
  timing: 'दृष्टि: शास्त्रीय मुहूर्त सिद्धान्त (पंचांग शुद्धि, वार स्वामी, चौघड़िया, होरा) तथा यदि उपलब्ध हो तो जातक का व्यक्तिगत चन्द्र बल/तारा बल।',
  transit: 'दृष्टि: नामित गोचर (शनि, गुरु, राहु/केतु) का जातक के नैसर्गिक लग्न और चन्द्र से सम्बन्ध, सक्रिय हो रहे भाव, और जिस दशा को यह गोचर रंग दे रहा है।',
  general: 'दृष्टि: कुण्डली का गुरुत्व-केन्द्र — सबसे प्रबल और दृष्ट ग्रह — साथ ही वर्तमान दशा और कोई प्रमुख गोचर। एक ऐसे जीवन का वर्णन करें जो जातक से एक विशिष्ट दिशा में बढ़ने को कह रहा है।',
};

// TA / BN scaffolds use English fallback for now — short technical phrasing,
// not loss-bearing. Native authoring follows in the same review pass as
// the rules. Flagged in REVIEW_TRACKER cross-cutting follow-up #1.
const TA: ScaffoldMap = EN;
const BN: ScaffoldMap = EN;

const SCAFFOLDS_BY_LOCALE: Record<BrihaspatiLocale, ScaffoldMap> = {
  en: EN,
  hi: HI,
  ta: TA,
  bn: BN,
  sa: EN, te: EN, kn: EN, mr: EN, gu: EN, mai: EN,
};

export function categoryScaffold(category: BrihaspatiCategory, locale: BrihaspatiLocale): string {
  return SCAFFOLDS_BY_LOCALE[locale][category];
}
