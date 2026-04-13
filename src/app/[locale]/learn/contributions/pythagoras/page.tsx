import { tl } from '@/lib/utils/trilingual';
import { Link } from '@/lib/i18n/navigation';
import type { LocaleText, Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: "The 'Pythagorean' Theorem Was Indian — Baudhayana Had It 300 Years Earlier",
    hi: "'पाइथागोरस प्रमेय' भारतीय था — बौधायन के पास यह 300 वर्ष पहले था",
  },
  subtitle: {
    en: "a² + b² = c². The most famous equation in mathematics, drilled into every school student's head as 'Pythagoras's theorem.' But the earliest known statement of this result appears not in Greece, but in India — in the Baudhayana Sulba Sutra, a text on Vedic fire altar construction written around 800 BCE. Pythagoras was born around 570 BCE — nearly 300 years later.",
    hi: "a² + b² = c². गणित का सबसे प्रसिद्ध समीकरण, जिसे हर विद्यार्थी 'पाइथागोरस प्रमेय' के रूप में जानता है। लेकिन इस परिणाम का सबसे पुराना ज्ञात कथन ग्रीस में नहीं, बल्कि भारत में मिलता है — बौधायन शुल्ब सूत्र में, जो वैदिक अग्निकुण्ड निर्माण पर ~800 ईपू में लिखा गया ग्रन्थ है। पाइथागोरस का जन्म ~570 ईपू में हुआ — लगभग 300 वर्ष बाद।",
  },

  s1Title: { en: 'The Sulba Sutras — Mathematics Born From Ritual', hi: 'शुल्ब सूत्र — कर्मकाण्ड से जन्मा गणित', sa: 'शुल्ब सूत्र — कर्मकाण्ड से जन्मा गणित', mai: 'शुल्ब सूत्र — कर्मकाण्ड से जन्मा गणित', mr: 'शुल्ब सूत्र — कर्मकाण्ड से जन्मा गणित', ta: 'The Sulba Sutras — Mathematics Born From Ritual', te: 'The Sulba Sutras — Mathematics Born From Ritual', bn: 'The Sulba Sutras — Mathematics Born From Ritual', kn: 'The Sulba Sutras — Mathematics Born From Ritual', gu: 'The Sulba Sutras — Mathematics Born From Ritual' },
  s1Body: {
    en: "The Sulba Sutras are appendices to the Vedas, specifically dealing with the geometry required to construct fire altars (Agni) of precise shapes and areas. The word 'Sulba' literally means cord or rope — these were rope-and-peg geometry manuals, used to measure and lay out sacred altar spaces with mathematical exactness. The requirement was strict: altars had to be specific shapes (falcon, tortoise, wheel) with exact areas, because Vedic ritual demanded mathematical precision. Any deviation was considered ritually invalid.",
    hi: "शुल्ब सूत्र वेदों के परिशिष्ट हैं, विशेष रूप से अग्निकुण्ड निर्माण के लिए आवश्यक ज्यामिति से सम्बन्धित। 'शुल्ब' का शाब्दिक अर्थ है रस्सी या डोरी — ये रस्सी-और-खूँटी ज्यामिति की पुस्तिकाएँ थीं, जो पवित्र वेदी स्थान को गणितीय परिशुद्धता के साथ मापने के लिए उपयोग की जाती थीं। आवश्यकता कठोर थी: वेदियाँ विशेष आकारों (बाज, कछुआ, चक्र) की होनी चाहिए थीं, क्योंकि वैदिक अनुष्ठान गणितीय परिशुद्धता की माँग करता था।",
  },
  s1Texts: {
    en: 'Four principal Sulba Sutras survive: Baudhayana (~800 BCE), Apastamba (~600 BCE), Katyayana (~300 BCE), and Manava (~750 BCE). Of these, Baudhayana is the oldest — and the one that contains the explicit general theorem. Beyond the Pythagorean theorem, the Sulba Sutras also contain area-preserving transformations (converting a rectangle to a square of equal area, and vice versa), methods for circling the square (approximating a circle with the same area as a given square), and constructing altars of complex shapes while preserving exact areas — problems that anticipate integral geometry by two millennia.',
    hi: 'चार प्रमुख शुल्ब सूत्र उपलब्ध हैं: बौधायन (~800 ईपू), आपस्तम्ब (~600 ईपू), कात्यायन (~300 ईपू), और मानव (~750 ईपू)। इनमें बौधायन सबसे पुराना है — और इसी में स्पष्ट सामान्य प्रमेय मिलती है। पाइथागोरस प्रमेय के अतिरिक्त, शुल्ब सूत्रों में क्षेत्रफल-संरक्षक रूपांतरण भी हैं (आयत को समान क्षेत्रफल के वर्ग में बदलना), वर्ग को वृत्त में बदलने की विधियाँ (समान क्षेत्रफल वाले वृत्त का सन्निकटन), और सटीक क्षेत्रफल बनाए रखते हुए जटिल आकार की वेदियों का निर्माण — ये समस्याएँ समाकलन ज्यामिति से दो सहस्राब्दी पहले की हैं।',
  },

  s2Title: { en: "Baudhayana's Statement — The Exact Quote", hi: 'बौधायन का कथन — मूल उद्धरण', sa: 'बौधायन का कथन — मूल उद्धरण', mai: 'बौधायन का कथन — मूल उद्धरण', mr: 'बौधायन का कथन — मूल उद्धरण', ta: "Baudhayana's Statement — The Exact Quote", te: "Baudhayana's Statement — The Exact Quote", bn: "Baudhayana's Statement — The Exact Quote", kn: "Baudhayana's Statement — The Exact Quote", gu: "Baudhayana's Statement — The Exact Quote" },
  s2Body: {
    en: "Baudhayana Sulba Sutra 1.48 states the theorem in Sanskrit. The verse reads: 'दीर्घचतुरश्रस्याक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत्पृथग्भूते कुरुतस्तदुभयं करोति' — which translates as: 'The diagonal of a rectangle produces both [areas] which its length and breadth produce separately.' This IS the Pythagorean theorem: diagonal² = length² + breadth². Note that it is stated as a GENERAL rule, applicable to all rectangles — not just specific cases.",
    hi: "बौधायन शुल्ब सूत्र 1.48 में प्रमेय संस्कृत में कही गई है: 'दीर्घचतुरश्रस्याक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत्पृथग्भूते कुरुतस्तदुभयं करोति' — जिसका अनुवाद है: 'आयत का विकर्ण वह दोनों [क्षेत्रफल] उत्पन्न करता है जो उसकी लम्बाई और चौड़ाई अलग-अलग उत्पन्न करती हैं।' यह पाइथागोरस प्रमेय है: विकर्ण² = लम्बाई² + चौड़ाई²। यह सभी आयतों के लिए एक सामान्य नियम के रूप में कही गई है।",
  },
  s2Quote: {
    en: 'दीर्घचतुरश्रस्याक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत्पृथग्भूते कुरुतस्तदुभयं करोति',
    hi: 'दीर्घचतुरश्रस्याक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत्पृथग्भूते कुरुतस्तदुभयं करोति',
  },
  s2QuoteTrans: {
    en: "The diagonal of a rectangle produces both [areas] which its length and breadth produce separately.",
    hi: "आयत का विकर्ण वह दोनों [क्षेत्रफल] उत्पन्न करता है जो इसकी लम्बाई और चौड़ाई अलग-अलग उत्पन्न करती हैं।",
  },
  s2Source: {
    en: '— Baudhayana Sulba Sutra 1.48, ~800 BCE',
    hi: '— बौधायन शुल्ब सूत्र 1.48, ~800 ईपू',
  },

  s3Title: { en: '√2 = 1.41421356 — Five Decimal Accuracy in 800 BCE', hi: '√2 = 1.41421356 — 800 ईपू में पाँच दशमलव की सटीकता', sa: '√2 = 1.41421356 — 800 ईपू में पाँच दशमलव की सटीकता', mai: '√2 = 1.41421356 — 800 ईपू में पाँच दशमलव की सटीकता', mr: '√2 = 1.41421356 — 800 ईपू में पाँच दशमलव की सटीकता', ta: '√2 = 1.41421356 — Five Decimal Accuracy in 800 BCE', te: '√2 = 1.41421356 — Five Decimal Accuracy in 800 BCE', bn: '√2 = 1.41421356 — Five Decimal Accuracy in 800 BCE', kn: '√2 = 1.41421356 — Five Decimal Accuracy in 800 BCE', gu: '√2 = 1.41421356 — Five Decimal Accuracy in 800 BCE' },
  s3Body: {
    en: "Baudhayana did not stop at the theorem. He also gave an extraordinarily accurate approximation of √2, needed to compute the diagonal of a unit square. His formula: √2 ≈ 1 + 1/3 + 1/(3×4) − 1/(3×4×34) = 1.4142156... The modern value is 1.4142135... That is correct to 5 decimal places — achieved with no calculators, no decimal notation, no computer algebra. No other civilization came close to this accuracy for centuries.",
    hi: "बौधायन प्रमेय पर ही नहीं रुके। उन्होंने √2 का अत्यंत सटीक सन्निकटन भी दिया, जो एकांक वर्ग का विकर्ण गणित करने के लिए आवश्यक था। उनका सूत्र: √2 ≈ 1 + 1/3 + 1/(3×4) − 1/(3×4×34) = 1.4142156... आधुनिक मान है 1.4142135... यह 5 दशमलव स्थानों तक सही है — बिना कैलकुलेटर, बिना दशमलव संकेतन के। किसी अन्य सभ्यता ने सदियों तक इतनी सटीकता नहीं छुई।",
  },
  s3Formula: {
    en: '√2 ≈ 1 + 1/3 + 1/(3×4) − 1/(3×4×34)',
    hi: '√2 ≈ 1 + 1/3 + 1/(3×4) − 1/(3×4×34)',
  },

  s4Title: { en: 'Pythagorean Triples — Known Centuries Before Pythagoras', hi: 'पाइथागोरीय त्रिक — पाइथागोरस से सदियों पहले ज्ञात', sa: 'पाइथागोरीय त्रिक — पाइथागोरस से सदियों पहले ज्ञात', mai: 'पाइथागोरीय त्रिक — पाइथागोरस से सदियों पहले ज्ञात', mr: 'पाइथागोरीय त्रिक — पाइथागोरस से सदियों पहले ज्ञात', ta: 'Pythagorean Triples — Known Centuries Before Pythagoras', te: 'Pythagorean Triples — Known Centuries Before Pythagoras', bn: 'Pythagorean Triples — Known Centuries Before Pythagoras', kn: 'Pythagorean Triples — Known Centuries Before Pythagoras', gu: 'Pythagorean Triples — Known Centuries Before Pythagoras' },
  s4Body: {
    en: "Baudhayana lists specific right triangles that satisfy a² + b² = c²: the triples (3, 4, 5), (5, 12, 13), (8, 15, 17), and (7, 24, 25). These are what we call 'Pythagorean triples' — though they might more accurately be called 'Baudhayana triples.' The Sulba Sutras use them for altar construction requiring precise right angles: if you stretch a rope of length 13 between pegs at 5 and 12, you get a perfect right angle. For comparison, the Babylonian Plimpton 322 tablet (~1800 BCE) lists some triples, but gives no general theorem. Baudhayana gives both the triples AND the theorem.",
    hi: "बौधायन ने उन विशिष्ट समकोण त्रिभुजों की सूची दी जो a² + b² = c² को सन्तुष्ट करते हैं: त्रिक (3, 4, 5), (5, 12, 13), (8, 15, 17), और (7, 24, 25)। इन्हें हम 'पाइथागोरीय त्रिक' कहते हैं — हालाँकि अधिक सटीक रूप से ये 'बौधायन त्रिक' होने चाहिए। शुल्ब सूत्र इनका उपयोग वेदी निर्माण में सटीक समकोण के लिए करते थे। तुलना के लिए: बेबीलोनियाई प्लिम्पटन 322 तख्ती (~1800 ईपू) में कुछ त्रिक हैं, लेकिन कोई सामान्य प्रमेय नहीं। बौधायन के पास त्रिक भी हैं और प्रमेय भी।",
  },

  s5Title: { en: "The Altar That Required a² + b² = c²", hi: 'वह वेदी जिसके लिए a² + b² = c² आवश्यक था', sa: 'वह वेदी जिसके लिए a² + b² = c² आवश्यक था', mai: 'वह वेदी जिसके लिए a² + b² = c² आवश्यक था', mr: 'वह वेदी जिसके लिए a² + b² = c² आवश्यक था', ta: "The Altar That Required a² + b² = c²", te: "The Altar That Required a² + b² = c²", bn: "The Altar That Required a² + b² = c²", kn: "The Altar That Required a² + b² = c²", gu: "The Altar That Required a² + b² = c²" },
  s5Body: {
    en: "Here is a concrete example of the theorem in ritual use: the problem of doubling a square altar. If the original altar has side s, the new (double-area) altar must have side s√2 — which is precisely the diagonal of the original square. So to construct a square with double the area, you take the diagonal of the original. This is a direct application of the theorem: diagonal² = s² + s² = 2s², so diagonal = s√2. The famous falcon-shaped altar (Syena-chiti) required even more complex geometric transformations — all dependent on this theorem.",
    hi: "यहाँ अनुष्ठान में प्रमेय के उपयोग का एक ठोस उदाहरण है: वर्गाकार वेदी को दोगुना करने की समस्या। यदि मूल वेदी की भुजा s है, तो नई (दोगुने क्षेत्रफल वाली) वेदी की भुजा s√2 होनी चाहिए — जो कि मूल वर्ग का विकर्ण है। अतः दोगुने क्षेत्रफल वाला वर्ग बनाने के लिए मूल का विकर्ण लिया जाता है। यह प्रमेय का प्रत्यक्ष अनुप्रयोग है: विकर्ण² = s² + s² = 2s²। प्रसिद्ध बाज-आकार की वेदी (श्येन-चिति) के लिए और भी जटिल ज्यामितीय परिवर्तन आवश्यक थे।",
  },

  s6Title: { en: 'Pythagoras — What Did He Actually Do?', hi: 'पाइथागोरस — उन्होंने वास्तव में क्या किया?', sa: 'पाइथागोरस — उन्होंने वास्तव में क्या किया?', mai: 'पाइथागोरस — उन्होंने वास्तव में क्या किया?', mr: 'पाइथागोरस — उन्होंने वास्तव में क्या किया?', ta: 'Pythagoras — What Did He Actually Do?', te: 'Pythagoras — What Did He Actually Do?', bn: 'Pythagoras — What Did He Actually Do?', kn: 'Pythagoras — What Did He Actually Do?', gu: 'Pythagoras — What Did He Actually Do?' },
  s6Body: {
    en: "Pythagoras (~570–495 BCE) almost certainly learned geometry during his extensive travels — to Egypt, Babylon, and possibly further east. The Greek tradition credits him with the first formal proof of the theorem, not merely its discovery. But here is the problem: no written work by Pythagoras himself survives. Everything attributed to him comes from his followers (the Pythagoreans) or from later ancient writers. The earliest surviving Greek proof appears in Euclid's Elements (~300 BCE), Book I, Proposition 47 — written over two centuries after Pythagoras lived. The fair assessment: Indians discovered and systematically applied the theorem 300 years before Pythagoras. Greeks may have provided the first formal deductive proof — though this too is debated, since it relies entirely on later accounts.",
    hi: "पाइथागोरस (~570–495 ईपू) ने लगभग निश्चित रूप से अपनी व्यापक यात्राओं के दौरान — मिस्र, बेबीलोनिया और सम्भवतः पूर्व में — ज्यामिति सीखी। ग्रीक परम्परा उन्हें प्रमेय के प्रथम औपचारिक प्रमाण का श्रेय देती है। लेकिन समस्या यह है: पाइथागोरस का कोई लिखित कार्य नहीं बचा। उनसे सम्बन्धित सब कुछ उनके अनुयायियों या बाद के लेखकों से आता है। यूक्लिड के Elements (~300 ईपू) में सबसे पुराना जीवित ग्रीक प्रमाण है। निष्पक्ष मूल्यांकन: भारतीयों ने पाइथागोरस से 300 वर्ष पहले प्रमेय की खोज की और व्यावहारिक उपयोग किया।",
  },

  s7Title: { en: 'Classical Sources', hi: 'मूल स्रोत', sa: 'मूल स्रोत', mai: 'मूल स्रोत', mr: 'मूल स्रोत', ta: 'Classical Sources', te: 'Classical Sources', bn: 'Classical Sources', kn: 'Classical Sources', gu: 'Classical Sources' },
  s7Body: {
    en: 'The chronology of the theorem across civilisations, from the earliest known statement to modern mathematics.',
    hi: 'सभ्यताओं में प्रमेय का कालक्रम, सबसे पुराने ज्ञात कथन से आधुनिक गणित तक।',
  },

  backLink: { en: '← Back to Learn', hi: '← सीखने पर वापस', sa: '← सीखने पर वापस', mai: '← सीखने पर वापस', mr: '← सीखने पर वापस', ta: '← Back to Learn', te: '← Back to Learn', bn: '← Back to Learn', kn: '← Back to Learn', gu: '← Back to Learn' },
  exploreMore: { en: 'Continue Exploring', hi: 'और जानें', sa: 'और जानें', mai: 'और जानें', mr: 'और जानें', ta: 'Continue Exploring', te: 'Continue Exploring', bn: 'Continue Exploring', kn: 'Continue Exploring', gu: 'Continue Exploring' },
  crossSine: { en: 'Sine Was Indian Too', hi: 'Sine भी भारतीय था', sa: 'Sine भी भारतीय था', mai: 'Sine भी भारतीय था', mr: 'Sine भी भारतीय था', ta: 'Sine Was Indian Too', te: 'Sine Was Indian Too', bn: 'Sine Was Indian Too', kn: 'Sine Was Indian Too', gu: 'Sine Was Indian Too' },
  crossZero: { en: 'Zero — Brahmagupta', hi: 'शून्य — ब्रह्मगुप्त', sa: 'शून्य — ब्रह्मगुप्त', mai: 'शून्य — ब्रह्मगुप्त', mr: 'शून्य — ब्रह्मगुप्त', ta: 'Zero — Brahmagupta', te: 'Zero — Brahmagupta', bn: 'Zero — Brahmagupta', kn: 'Zero — Brahmagupta', gu: 'Zero — Brahmagupta' },
  crossPi: { en: 'π — Aryabhata', hi: 'π — आर्यभट', sa: 'π — आर्यभट', mai: 'π — आर्यभट', mr: 'π — आर्यभट', ta: 'π — Aryabhata', te: 'π — Aryabhata', bn: 'π — Aryabhata', kn: 'π — Aryabhata', gu: 'π — Aryabhata' },
  crossTimeline: { en: 'Full Timeline', hi: 'पूर्ण कालक्रम', sa: 'पूर्ण कालक्रम', mai: 'पूर्ण कालक्रम', mr: 'पूर्ण कालक्रम', ta: 'Full Timeline', te: 'Full Timeline', bn: 'Full Timeline', kn: 'Full Timeline', gu: 'Full Timeline' },
};

/* ════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════ */

const PYTHAGOREAN_TRIPLES = [
  { a: 3, b: 4, c: 5, check: '9 + 16 = 25' },
  { a: 5, b: 12, c: 13, check: '25 + 144 = 169' },
  { a: 8, b: 15, c: 17, check: '64 + 225 = 289' },
  { a: 7, b: 24, c: 25, check: '49 + 576 = 625' },
];

const TIMELINE = [
  { year: '~1800 BCE', source: 'Plimpton 322 (Babylon)', content: { en: 'Lists Pythagorean triples — no general theorem', hi: 'पाइथागोरीय त्रिक की सूची — कोई सामान्य प्रमेय नहीं', sa: 'पाइथागोरीय त्रिक की सूची — कोई सामान्य प्रमेय नहीं', mai: 'पाइथागोरीय त्रिक की सूची — कोई सामान्य प्रमेय नहीं', mr: 'पाइथागोरीय त्रिक की सूची — कोई सामान्य प्रमेय नहीं', ta: 'Lists Pythagorean triples — no general theorem', te: 'Lists Pythagorean triples — no general theorem', bn: 'Lists Pythagorean triples — no general theorem', kn: 'Lists Pythagorean triples — no general theorem', gu: 'Lists Pythagorean triples — no general theorem' }, color: '#60a5fa' },
  { year: '~800 BCE', source: 'Baudhayana Sulba Sutra', content: { en: 'General theorem stated + √2 to 5 decimal places + triples (3,4,5), (5,12,13), (8,15,17), (7,24,25)', hi: 'सामान्य प्रमेय + √2 पाँच दशमलव तक + त्रिक', sa: 'सामान्य प्रमेय + √2 पाँच दशमलव तक + त्रिक', mai: 'सामान्य प्रमेय + √2 पाँच दशमलव तक + त्रिक', mr: 'सामान्य प्रमेय + √2 पाँच दशमलव तक + त्रिक', ta: 'General theorem stated + √2 to 5 decimal places + triples (3,4,5), (5,12,13), (8,15,17), (7,24,25)', te: 'General theorem stated + √2 to 5 decimal places + triples (3,4,5), (5,12,13), (8,15,17), (7,24,25)', bn: 'General theorem stated + √2 to 5 decimal places + triples (3,4,5), (5,12,13), (8,15,17), (7,24,25)', kn: 'General theorem stated + √2 to 5 decimal places + triples (3,4,5), (5,12,13), (8,15,17), (7,24,25)', gu: 'General theorem stated + √2 to 5 decimal places + triples (3,4,5), (5,12,13), (8,15,17), (7,24,25)' }, color: '#f0d48a' },
  { year: '~600 BCE', source: 'Apastamba Sulba Sutra', content: { en: 'Refined √2, additional geometric constructions', hi: 'परिष्कृत √2, अतिरिक्त ज्यामितीय निर्माण', sa: 'परिष्कृत √2, अतिरिक्त ज्यामितीय निर्माण', mai: 'परिष्कृत √2, अतिरिक्त ज्यामितीय निर्माण', mr: 'परिष्कृत √2, अतिरिक्त ज्यामितीय निर्माण', ta: 'Refined √2, additional geometric constructions', te: 'Refined √2, additional geometric constructions', bn: 'Refined √2, additional geometric constructions', kn: 'Refined √2, additional geometric constructions', gu: 'Refined √2, additional geometric constructions' }, color: '#d4a853' },
  { year: '~570 BCE', source: 'Pythagoras born', content: { en: 'Born in Samos, Greece — 230 years after Baudhayana', hi: 'ग्रीस के सामोस में जन्म — बौधायन के 230 वर्ष बाद', sa: 'ग्रीस के सामोस में जन्म — बौधायन के 230 वर्ष बाद', mai: 'ग्रीस के सामोस में जन्म — बौधायन के 230 वर्ष बाद', mr: 'ग्रीस के सामोस में जन्म — बौधायन के 230 वर्ष बाद', ta: 'Born in Samos, Greece — 230 years after Baudhayana', te: 'Born in Samos, Greece — 230 years after Baudhayana', bn: 'Born in Samos, Greece — 230 years after Baudhayana', kn: 'Born in Samos, Greece — 230 years after Baudhayana', gu: 'Born in Samos, Greece — 230 years after Baudhayana' }, color: '#a78bfa' },
  { year: '~300 BCE', source: "Euclid's Elements, Book I, Prop. 47", content: { en: "Earliest surviving formal Greek proof", hi: 'सबसे पुराना जीवित औपचारिक ग्रीक प्रमाण', sa: 'सबसे पुराना जीवित औपचारिक ग्रीक प्रमाण', mai: 'सबसे पुराना जीवित औपचारिक ग्रीक प्रमाण', mr: 'सबसे पुराना जीवित औपचारिक ग्रीक प्रमाण', ta: "Earliest surviving formal Greek proof", te: "Earliest surviving formal Greek proof", bn: "Earliest surviving formal Greek proof", kn: "Earliest surviving formal Greek proof", gu: "Earliest surviving formal Greek proof" }, color: '#34d399' },
  { year: '499 CE', source: 'Aryabhatiya', content: { en: "Uses the theorem for astronomical calculations — planetary distances, eclipse geometry", hi: 'खगोलीय गणनाओं के लिए प्रमेय का उपयोग', sa: 'खगोलीय गणनाओं के लिए प्रमेय का उपयोग', mai: 'खगोलीय गणनाओं के लिए प्रमेय का उपयोग', mr: 'खगोलीय गणनाओं के लिए प्रमेय का उपयोग', ta: "Uses the theorem for astronomical calculations — planetary distances, eclipse geometry", te: "Uses the theorem for astronomical calculations — planetary distances, eclipse geometry", bn: "Uses the theorem for astronomical calculations — planetary distances, eclipse geometry", kn: "Uses the theorem for astronomical calculations — planetary distances, eclipse geometry", gu: "Uses the theorem for astronomical calculations — planetary distances, eclipse geometry" }, color: '#fbbf24' },
];

const SQRT2_COMPARISON = [
  { label: 'Baudhayana (~800 BCE)', value: '1.4142156', delta: '+0.0000021', color: '#f0d48a' },
  { label: 'Apastamba (~600 BCE)', value: '1.4142135', delta: '~0.0000000', color: '#d4a853' },
  { label: 'Modern (IEEE 754)', value: '1.4142136', delta: 'reference', color: '#34d399' },
];

/* ════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════════════════ */

export default async function PythagorasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (obj: LocaleText | Record<string, string>) => tl(obj, locale);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{l(L.title)}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{l(L.subtitle)}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={l(L.title)} locale={locale} />
        </div>
      </div>

      {/* ── Section 1: The Sulba Sutras ──────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s1Title)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s1Body)}</p>
            <p className="text-text-secondary text-sm leading-relaxed">{l(L.s1Texts)}</p>
          </div>
          {/* Sulba Sutra lineage */}
          <div className="space-y-2">
            <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
              {isHi ? 'प्रमुख शुल्ब सूत्र' : 'Principal Sulba Sutras'}
            </p>
            {[
              { name: 'Baudhayana', date: '~800 BCE', note: { en: 'Oldest — contains the general theorem', hi: 'सबसे पुराना — सामान्य प्रमेय', sa: 'सबसे पुराना — सामान्य प्रमेय', mai: 'सबसे पुराना — सामान्य प्रमेय', mr: 'सबसे पुराना — सामान्य प्रमेय', ta: 'Oldest — contains the general theorem', te: 'Oldest — contains the general theorem', bn: 'Oldest — contains the general theorem', kn: 'Oldest — contains the general theorem', gu: 'Oldest — contains the general theorem' }, accent: '#f0d48a' },
              { name: 'Manava', date: '~750 BCE', note: { en: 'Geometric transformations', hi: 'ज्यामितीय परिवर्तन', sa: 'ज्यामितीय परिवर्तन', mai: 'ज्यामितीय परिवर्तन', mr: 'ज्यामितीय परिवर्तन', ta: 'Geometric transformations', te: 'Geometric transformations', bn: 'Geometric transformations', kn: 'Geometric transformations', gu: 'Geometric transformations' }, accent: '#d4a853' },
              { name: 'Apastamba', date: '~600 BCE', note: { en: 'Refined √2, additional constructions', hi: 'परिष्कृत √2', sa: 'परिष्कृत √2', mai: 'परिष्कृत √2', mr: 'परिष्कृत √2', ta: 'Refined √2, additional constructions', te: 'Refined √2, additional constructions', bn: 'Refined √2, additional constructions', kn: 'Refined √2, additional constructions', gu: 'Refined √2, additional constructions' }, accent: '#fbbf24' },
              { name: 'Katyayana', date: '~300 BCE', note: { en: 'Generalised geometric transformations', hi: 'सामान्यीकृत ज्यामितीय परिवर्तन', sa: 'सामान्यीकृत ज्यामितीय परिवर्तन', mai: 'सामान्यीकृत ज्यामितीय परिवर्तन', mr: 'सामान्यीकृत ज्यामितीय परिवर्तन', ta: 'Generalised geometric transformations', te: 'Generalised geometric transformations', bn: 'Generalised geometric transformations', kn: 'Generalised geometric transformations', gu: 'Generalised geometric transformations' }, accent: '#a78bfa' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-xs font-mono mt-0.5" style={{ color: s.accent }}>{s.date}</span>
                <div>
                  <p className="text-text-primary text-sm font-semibold">{s.name} Sulba Sutra</p>
                  <p className="text-text-secondary text-xs">{l(s.note)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 2: Baudhayana's Exact Quote ─────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s2Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{l(L.s2Body)}</p>

        {/* Sanskrit quote block */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 text-center mb-6">
          <p
            className="text-gold-primary text-lg font-bold mb-2 leading-relaxed"
            style={{ fontFamily: 'var(--font-devanagari-heading)' }}
          >
            {l(L.s2Quote)}
          </p>
          <p className="text-gold-light/80 text-sm italic mb-1">{l(L.s2QuoteTrans)}</p>
          <p className="text-text-secondary/60 text-xs">{l(L.s2Source)}</p>
        </div>

        {/* SVG Diagram: rectangle with diagonal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto">
            <defs>
              <linearGradient id="pyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0d48a" />
                <stop offset="100%" stopColor="#d4a853" />
              </linearGradient>
              <filter id="pyGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Rectangle */}
            <rect x="40" y="30" width="160" height="110" fill="none" stroke="#d4a853" strokeWidth="1.5" opacity="0.3" />
            {/* Right angle marker */}
            <path d="M 40 140 L 40 120 L 60 120" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.7" />
            {/* Length label (b) */}
            <line x1="40" y1="160" x2="200" y2="160" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <text x="120" y="175" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">b</text>
            {/* Height label (a) */}
            <line x1="215" y1="30" x2="215" y2="140" stroke="#f87171" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <text x="228" y="90" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">a</text>
            {/* Diagonal */}
            <line x1="40" y1="30" x2="200" y2="140" stroke="url(#pyGold)" strokeWidth="2.5" filter="url(#pyGlow)" />
            <text x="108" y="78" textAnchor="middle" fill="#f0d48a" fontSize="11" fontWeight="bold" transform="rotate(-34, 108, 78)">c (diagonal)</text>
            {/* Formula */}
            <text x="140" y="192" textAnchor="middle" fill="#f0d48a" fontSize="12" fontWeight="bold">a² + b² = c²</text>
          </svg>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">{isHi ? 'बौधायन की व्याख्या' : "Baudhayana's meaning"}</p>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? '"आयत का विकर्ण" वह दोनों क्षेत्रफल उत्पन्न करता है जो "लम्बाई और चौड़ाई अलग-अलग" उत्पन्न करती हैं। अर्थात: c² = a² + b²। सभी आयतों के लिए सामान्य नियम।'
                  : '"The diagonal of a rectangle produces" the area that "its length and breadth produce separately." In modern notation: c² = a² + b². A general rule for ALL rectangles.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <p className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-1">{isHi ? 'महत्त्व' : 'Significance'}</p>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? 'यह एक विशेष मामला नहीं है — यह एक सामान्य प्रमेय है। बौधायन ने इसे सभी आयतों पर लागू होने वाले सार्वभौमिक नियम के रूप में कहा।'
                  : 'This is not a special case — it is a general theorem. Baudhayana states it as a universal rule applying to all rectangles.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: √2 Accuracy ───────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s3Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s3Body)}</p>

        {/* Formula display */}
        <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20 text-center mb-5">
          <p className="text-gold-primary font-mono text-base font-bold mb-1">{l(L.s3Formula)}</p>
          <p className="text-text-secondary text-xs">
            {isHi ? '= 1.4142156... (आधुनिक: 1.4142135...)' : '= 1.4142156... (modern: 1.4142135...)'}
          </p>
        </div>

        {/* Accuracy comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 pr-4 text-gold-dark text-xs uppercase tracking-wider font-bold">{isHi ? 'स्रोत' : 'Source'}</th>
                <th className="text-right py-2 pr-4 text-gold-dark text-xs uppercase tracking-wider font-bold">{isHi ? 'मान' : 'Value'}</th>
                <th className="text-right py-2 text-gold-dark text-xs uppercase tracking-wider font-bold">{isHi ? 'अंतर' : 'Delta'}</th>
              </tr>
            </thead>
            <tbody>
              {SQRT2_COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 text-text-secondary text-xs" style={{ color: row.color }}>{row.label}</td>
                  <td className="py-2 pr-4 text-right text-text-primary font-mono text-xs">{row.value}</td>
                  <td className="py-2 text-right text-text-secondary text-xs">{row.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary/60 text-xs mt-3 italic">
          {isHi
            ? 'बौधायन का मान आधुनिक मान से केवल 0.0000021 अलग है — 5 दशमलव स्थानों तक सही।'
            : "Baudhayana's value differs from the modern value by only 0.0000021 — correct to 5 decimal places."}
        </p>
      </div>

      {/* ── Section 4: Pythagorean Triples ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s4Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s4Body)}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PYTHAGOREAN_TRIPLES.map((t, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/15 text-center"
            >
              <p className="text-gold-light font-bold text-base mb-1">({t.a}, {t.b}, {t.c})</p>
              <p className="text-text-secondary text-xs font-mono">{t.check}</p>
              <p className="text-gold-dark text-xs mt-1">✓</p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary text-xs mt-4 italic">
          {isHi
            ? 'इन सभी का उपयोग वेदी निर्माण में सटीक समकोण बनाने के लिए किया गया था।'
            : 'All used in altar construction to create precise right angles using rope-and-peg geometry.'}
        </p>
      </div>

      {/* ── Section 5: The Altar ─────────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s5Title)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s5Body)}</p>
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <p className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-1">{isHi ? 'सूत्र' : 'The formula'}</p>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? 'यदि मूल वर्ग की भुजा s है, तो दोगुने क्षेत्रफल वाले वर्ग की भुजा = मूल का विकर्ण = s√2। विकर्ण² = s² + s² = 2s²।'
                  : 'If original square has side s, the doubled-area square has side = diagonal of original = s√2. Because: diagonal² = s² + s² = 2s².'}
              </p>
            </div>
          </div>
          {/* SVG: square doubled via diagonal */}
          <svg viewBox="0 0 260 220" className="w-full max-w-xs mx-auto">
            <defs>
              <linearGradient id="altarGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0d48a" />
                <stop offset="100%" stopColor="#d4a853" />
              </linearGradient>
            </defs>
            {/* Original small square */}
            <rect x="20" y="60" width="80" height="80" fill="#f0d48a" fillOpacity="0.07" stroke="#d4a853" strokeWidth="1.5" />
            <text x="60" y="105" textAnchor="middle" fill="#d4a853" fontSize="10" fontWeight="bold">s</text>
            <text x="60" y="155" textAnchor="middle" fill="#8a6d2b" fontSize="9">{isHi ? 'मूल वेदी' : 'original altar'}</text>
            {/* Arrow */}
            <text x="115" y="100" fill="#8a8478" fontSize="18">→</text>
            {/* Diagonal of original */}
            <line x1="20" y1="140" x2="100" y2="60" stroke="url(#altarGold)" strokeWidth="2" strokeDasharray="5 3" />
            <text x="48" y="90" fill="#f0d48a" fontSize="8">s√2</text>
            {/* New larger square (rotated 45°, side = s√2) */}
            <g transform="translate(170, 100)">
              <rect x="-56" y="-56" width="80" height="80" fill="#f0d48a" fillOpacity="0.10" stroke="#f0d48a" strokeWidth="1.5" transform="rotate(45)" />
              <text x="0" y="5" textAnchor="middle" fill="#f0d48a" fontSize="10" fontWeight="bold">s√2</text>
              <text x="0" y="82" textAnchor="middle" fill="#8a8478" fontSize="9">{isHi ? 'दोगुनी वेदी' : 'doubled altar'}</text>
            </g>
          </svg>
        </div>
      </div>

      {/* ── Section 6: Pythagoras ────────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s6Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s6Body)}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: { en: 'Baudhayana stated it', hi: 'बौधायन ने कहा', sa: 'बौधायन ने कहा', mai: 'बौधायन ने कहा', mr: 'बौधायन ने कहा', ta: 'Baudhayana stated it', te: 'Baudhayana stated it', bn: 'Baudhayana stated it', kn: 'Baudhayana stated it', gu: 'Baudhayana stated it' }, date: '~800 BCE', color: '#f0d48a', note: { en: 'General theorem + triples + √2', hi: 'सामान्य प्रमेय + त्रिक + √2', sa: 'सामान्य प्रमेय + त्रिक + √2', mai: 'सामान्य प्रमेय + त्रिक + √2', mr: 'सामान्य प्रमेय + त्रिक + √2', ta: 'General theorem + triples + √2', te: 'General theorem + triples + √2', bn: 'General theorem + triples + √2', kn: 'General theorem + triples + √2', gu: 'General theorem + triples + √2' } },
            { label: { en: 'Pythagoras born', hi: 'पाइथागोरस का जन्म', sa: 'पाइथागोरस का जन्म', mai: 'पाइथागोरस का जन्म', mr: 'पाइथागोरस का जन्म', ta: 'Pythagoras born', te: 'Pythagoras born', bn: 'Pythagoras born', kn: 'Pythagoras born', gu: 'Pythagoras born' }, date: '~570 BCE', color: '#a78bfa', note: { en: '230 years after Baudhayana', hi: 'बौधायन के 230 वर्ष बाद', sa: 'बौधायन के 230 वर्ष बाद', mai: 'बौधायन के 230 वर्ष बाद', mr: 'बौधायन के 230 वर्ष बाद', ta: '230 years after Baudhayana', te: '230 years after Baudhayana', bn: '230 years after Baudhayana', kn: '230 years after Baudhayana', gu: '230 years after Baudhayana' } },
            { label: { en: "Euclid's formal proof", hi: 'यूक्लिड का औपचारिक प्रमाण', sa: 'यूक्लिड का औपचारिक प्रमाण', mai: 'यूक्लिड का औपचारिक प्रमाण', mr: 'यूक्लिड का औपचारिक प्रमाण', ta: "Euclid's formal proof", te: "Euclid's formal proof", bn: "Euclid's formal proof", kn: "Euclid's formal proof", gu: "Euclid's formal proof" }, date: '~300 BCE', color: '#34d399', note: { en: 'Earliest surviving Greek proof', hi: 'सबसे पुराना जीवित ग्रीक प्रमाण', sa: 'सबसे पुराना जीवित ग्रीक प्रमाण', mai: 'सबसे पुराना जीवित ग्रीक प्रमाण', mr: 'सबसे पुराना जीवित ग्रीक प्रमाण', ta: 'Earliest surviving Greek proof', te: 'Earliest surviving Greek proof', bn: 'Earliest surviving Greek proof', kn: 'Earliest surviving Greek proof', gu: 'Earliest surviving Greek proof' } },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
              <p className="text-xs font-mono font-bold mb-1" style={{ color: item.color }}>{item.date}</p>
              <p className="text-text-primary text-sm font-semibold mb-1">{l(item.label)}</p>
              <p className="text-text-secondary text-xs">{l(item.note)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs text-text-secondary leading-relaxed">
          {isHi
            ? 'निष्पक्ष मूल्यांकन: भारतीयों ने इसे खोजा और व्यावहारिक रूप से उपयोग किया। ग्रीक परम्परा ने सम्भवतः पहला औपचारिक निगमनात्मक प्रमाण दिया — हालाँकि पाइथागोरस का कोई लिखित कार्य स्वयं नहीं बचा, इसलिए यह भी पूरी तरह अनिश्चित है।'
            : "Fair assessment: Indians discovered and systematically applied the theorem. The Greek tradition likely provided the first formal deductive proof — though no written work by Pythagoras himself survives, making even this attribution uncertain."}
        </div>
      </div>

      {/* ── Section 7: Timeline / Sources ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s7Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s7Body)}</p>

        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gold-primary/20" />
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start"
              >
                <span className="text-xs font-mono w-16 flex-shrink-0 text-right mt-1" style={{ color: item.color }}>
                  {item.year}
                </span>
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 border-2" style={{ borderColor: item.color, backgroundColor: `${item.color}33` }} />
                <div className="flex-1">
                  <p className="text-text-primary text-sm font-semibold">{item.source}</p>
                  <p className="text-text-secondary text-xs leading-relaxed">{l(item.content)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cross-references ─────────────────────────────────────────── */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { href: '/learn/contributions/sine', label: l(L.crossSine) },
          { href: '/learn/contributions/zero', label: l(L.crossZero) },
          { href: '/learn/contributions/pi', label: l(L.crossPi) },
          { href: '/learn/contributions/timeline', label: l(L.crossTimeline) },
        ].map((ref, i) => (
          <Link
            key={i}
            href={ref.href}
            className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-gold-light text-sm text-center hover:bg-gold-primary/15 transition-colors"
          >
            {ref.label} →
          </Link>
        ))}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {l(L.backLink)}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/zero" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.crossZero)} →
          </Link>
          <Link href="/learn/contributions/sine" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.crossSine)} →
          </Link>
        </div>
      </div>

    </div>
  );
}
