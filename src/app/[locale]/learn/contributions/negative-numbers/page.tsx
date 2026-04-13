import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Minus, TrendingDown } from 'lucide-react';
import type { Locale, LocaleText } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ═══════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ═══════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: "Negative Numbers — When India Said 'Less Than Nothing' and Europe Said 'Impossible'",
    hi: 'ऋणात्मक संख्याएँ — जब भारत ने कहा "शून्य से कम" और यूरोप ने कहा "असंभव"',
  },
  subtitle: {
    en: "Try explaining '-5 apples' to a 5-year-old. Now imagine being a European mathematician in 1700 and calling negative numbers 'absurd' and 'fictitious'. Meanwhile, in India, Brahmagupta had been doing arithmetic with negative numbers since 628 CE...",
    hi: 'एक 5 वर्षीय बच्चे को "-5 सेब" समझाने की कोशिश करें। अब कल्पना करें कि आप 1700 में एक यूरोपीय गणितज्ञ हैं जो ऋणात्मक संख्याओं को "बेतुका" और "काल्पनिक" कह रहे हैं। इस बीच, भारत में ब्रह्मगुप्त 628 ईस्वी से ऋणात्मक संख्याओं के साथ अंकगणित कर रहे थे...',
  },

  s1Title: { en: 'Brahmagupta — Formal Rules for Negative Numbers (628 CE)', hi: 'ब्रह्मगुप्त — ऋणात्मक संख्याओं के औपचारिक नियम (628 ईस्वी)', sa: 'ब्रह्मगुप्त — ऋणात्मक संख्याओं के औपचारिक नियम (628 ईस्वी)', mai: 'ब्रह्मगुप्त — ऋणात्मक संख्याओं के औपचारिक नियम (628 ईस्वी)', mr: 'ब्रह्मगुप्त — ऋणात्मक संख्याओं के औपचारिक नियम (628 ईस्वी)', ta: 'Brahmagupta — Formal Rules for Negative Numbers (628 CE)', te: 'Brahmagupta — Formal Rules for Negative Numbers (628 CE)', bn: 'Brahmagupta — Formal Rules for Negative Numbers (628 CE)', kn: 'Brahmagupta — Formal Rules for Negative Numbers (628 CE)', gu: 'Brahmagupta — Formal Rules for Negative Numbers (628 CE)' },
  s1Body: {
    en: "In 628 CE, Brahmagupta wrote the Brahmasphutasiddhanta — the same text that gave us zero. Chapter 18 contains the first formal arithmetic rules for negative numbers ever written. He framed them in economic terms every merchant could understand: धन (dhana = fortune = positive) and ऋण (rina = debt = negative). Debt was a physical, everyday reality for Indian traders and bankers. Negative numbers weren't philosophical puzzles — they were accounting tools.",
    hi: '628 ईस्वी में, ब्रह्मगुप्त ने ब्रह्मस्फुटसिद्धान्त लिखा — वही ग्रंथ जिसने हमें शून्य दिया। अध्याय 18 में ऋणात्मक संख्याओं के लिए पहले औपचारिक अंकगणितीय नियम हैं। उन्होंने इन्हें आर्थिक शब्दों में तैयार किया जो हर व्यापारी समझ सकता था: धन (= सम्पदा = धनात्मक) और ऋण (= कर्ज़ = ऋणात्मक)। ऋण भारतीय व्यापारियों और बैंकरों के लिए एक भौतिक, दैनिक वास्तविकता था। ऋणात्मक संख्याएँ दार्शनिक पहेलियाँ नहीं थीं — वे लेखा-जोखा के उपकरण थे।',
  },

  s2Title: { en: "Brahmagupta's Rules — The World's First Negative Number Arithmetic", hi: 'ब्रह्मगुप्त के नियम — विश्व का पहला ऋणात्मक संख्या अंकगणित', sa: 'ब्रह्मगुप्त के नियम — विश्व का पहला ऋणात्मक संख्या अंकगणित', mai: 'ब्रह्मगुप्त के नियम — विश्व का पहला ऋणात्मक संख्या अंकगणित', mr: 'ब्रह्मगुप्त के नियम — विश्व का पहला ऋणात्मक संख्या अंकगणित', ta: "Brahmagupta's Rules — The World's First Negative Number Arithmetic", te: "Brahmagupta's Rules — The World's First Negative Number Arithmetic", bn: "Brahmagupta's Rules — The World's First Negative Number Arithmetic", kn: "Brahmagupta's Rules — The World's First Negative Number Arithmetic", gu: "Brahmagupta's Rules — The World's First Negative Number Arithmetic" },
  s2Intro: {
    en: 'Brahmagupta gave complete, correct rules for all four operations with negative numbers — more than a thousand years before Europe accepted them. His one error: he also declared 0 ÷ 0 = 0 (same error as in his zero chapter).',
    hi: 'ब्रह्मगुप्त ने ऋणात्मक संख्याओं के साथ सभी चार संक्रियाओं के लिए पूर्ण, सही नियम दिए — यूरोप के उन्हें स्वीकार करने से एक हजार साल से भी अधिक पहले। उनकी एकमात्र त्रुटि: उन्होंने 0 ÷ 0 = 0 भी घोषित किया।',
  },

  s3Title: { en: 'Mahavira — Extending the System (9th Century)', hi: 'महावीर — प्रणाली का विस्तार (9वीं शताब्दी)', sa: 'महावीर — प्रणाली का विस्तार (9वीं शताब्दी)', mai: 'महावीर — प्रणाली का विस्तार (9वीं शताब्दी)', mr: 'महावीर — प्रणाली का विस्तार (9वीं शताब्दी)', ta: 'Mahavira — Extending the System (9th Century)', te: 'Mahavira — Extending the System (9th Century)', bn: 'Mahavira — Extending the System (9th Century)', kn: 'Mahavira — Extending the System (9th Century)', gu: 'Mahavira — Extending the System (9th Century)' },
  s3Body: {
    en: "The Jain mathematician Mahavira (around 850 CE) wrote the Ganitasarasangraha — 'Compendium of the Essence of Mathematics.' He extended Brahmagupta's negative number rules and worked extensively with negative quantities in the context of debt, losses, and subtraction sequences. He also — incorrectly — declared that the square root of a negative number does not exist. This was reasonable given the knowledge of his time, and it would take another 700 years (and the work of Cardano in 1545 CE) before imaginary numbers were introduced. But his systematic treatment of negative arithmetic was centuries ahead of the West.",
    hi: 'जैन गणितज्ञ महावीर (लगभग 850 ईस्वी) ने गणितसारसंग्रह लिखा — "गणित के सार का संग्रह।" उन्होंने ब्रह्मगुप्त के ऋणात्मक संख्या नियमों का विस्तार किया और ऋण, हानि और घटाव अनुक्रमों के संदर्भ में ऋणात्मक मात्राओं के साथ व्यापक रूप से काम किया। उन्होंने — गलत तरीके से — घोषित किया कि ऋणात्मक संख्या का वर्गमूल मौजूद नहीं है। यह उनके समय के ज्ञान को देखते हुए उचित था। उनका व्यवस्थित उपचार पश्चिम से सदियों आगे था।',
  },

  s4Title: { en: "European Resistance — 'Absurd' and 'Fictitious' Numbers", hi: 'यूरोपीय प्रतिरोध — "बेतुकी" और "काल्पनिक" संख्याएँ', sa: 'यूरोपीय प्रतिरोध — "बेतुकी" और "काल्पनिक" संख्याएँ', mai: 'यूरोपीय प्रतिरोध — "बेतुकी" और "काल्पनिक" संख्याएँ', mr: 'यूरोपीय प्रतिरोध — "बेतुकी" और "काल्पनिक" संख्याएँ', ta: "European Resistance — 'Absurd' and 'Fictitious' Numbers", te: "European Resistance — 'Absurd' and 'Fictitious' Numbers", bn: "European Resistance — 'Absurd' and 'Fictitious' Numbers", kn: "European Resistance — 'Absurd' and 'Fictitious' Numbers", gu: "European Resistance — 'Absurd' and 'Fictitious' Numbers" },
  s4Body: {
    en: "Europe's greatest mathematicians resisted negative numbers for over a thousand years after Brahmagupta. René Descartes (1637 CE) called negative roots of equations 'false roots' — he literally refused to accept them as real solutions. Blaise Pascal (1650 CE) insisted that subtracting a number from zero was 'pure nonsense.' Even Leonhard Euler — arguably the greatest mathematician of the 18th century — struggled with negative numbers, initially unsure whether a negative number was greater or less than infinity. The philosopher Francis Maseres (1758 CE) wrote entire books arguing that negative numbers should be abolished from mathematics. These were not fringe views — they were mainstream European mathematics.",
    hi: 'यूरोप के सबसे बड़े गणितज्ञों ने ब्रह्मगुप्त के बाद एक हजार से अधिक वर्षों तक ऋणात्मक संख्याओं का विरोध किया। रेने डेकार्ट (1637 ईस्वी) ने समीकरणों की ऋणात्मक जड़ों को "झूठी जड़ें" कहा। ब्लेज़ पास्कल (1650 ईस्वी) ने जोर देकर कहा कि शून्य में से एक संख्या घटाना "शुद्ध बकवास" है। यहाँ तक कि लियोनार्ड यूलर भी शुरू में ऋणात्मक संख्याओं से जूझते थे। फ्रांसिस मासेरेस (1758 ईस्वी) ने पूरी किताबें लिखीं यह तर्क देते हुए कि ऋणात्मक संख्याओं को गणित से समाप्त किया जाना चाहिए।',
  },

  s5Title: { en: 'The Practical Origin — Indian Merchants and Bankers', hi: 'व्यावहारिक उत्पत्ति — भारतीय व्यापारी और बैंकर', sa: 'व्यावहारिक उत्पत्ति — भारतीय व्यापारी और बैंकर', mai: 'व्यावहारिक उत्पत्ति — भारतीय व्यापारी और बैंकर', mr: 'व्यावहारिक उत्पत्ति — भारतीय व्यापारी और बैंकर', ta: 'The Practical Origin — Indian Merchants and Bankers', te: 'The Practical Origin — Indian Merchants and Bankers', bn: 'The Practical Origin — Indian Merchants and Bankers', kn: 'The Practical Origin — Indian Merchants and Bankers', gu: 'The Practical Origin — Indian Merchants and Bankers' },
  s5Body: {
    en: "Why did India accept negative numbers so readily when Europe struggled for over a millennium? The answer is practical: the Indian economy needed them. India had a sophisticated banking and credit system centuries before Europe. The concept of rina (debt) was legally and commercially codified in texts like Manusmriti and Arthashastra. A merchant who owed 50 coins but had only 30 needed a way to represent '-20 coins.' Indian mathematicians had a concrete, economically grounded reason to formalize negative arithmetic. European mathematicians, working primarily in the abstract tradition of Greek geometry, had no such grounding. Geometry cannot have a negative length — but debt absolutely can.",
    hi: 'भारत ने ऋणात्मक संख्याओं को इतनी आसानी से क्यों स्वीकार किया जबकि यूरोप एक सहस्राब्दी से अधिक समय तक संघर्ष करता रहा? उत्तर व्यावहारिक है: भारतीय अर्थव्यवस्था को उनकी आवश्यकता थी। भारत में यूरोप से सदियों पहले एक परिष्कृत बैंकिंग और ऋण प्रणाली थी। ऋण की अवधारणा मनुस्मृति और अर्थशास्त्र जैसे ग्रंथों में कानूनी और व्यावसायिक रूप से संहिताबद्ध थी। एक व्यापारी जो 50 सिक्के का ऋणी था लेकिन उसके पास केवल 30 थे, उसे "-20 सिक्के" दर्शाने का एक तरीका चाहिए था।',
  },

  s6Title: { en: 'Negative Numbers in Jyotish — Retrograde Motion and Longitudes', hi: 'ज्योतिष में ऋणात्मक संख्याएँ — वक्री गति और देशांतर', sa: 'ज्योतिष में ऋणात्मक संख्याएँ — वक्री गति और देशांतर', mai: 'ज्योतिष में ऋणात्मक संख्याएँ — वक्री गति और देशांतर', mr: 'ज्योतिष में ऋणात्मक संख्याएँ — वक्री गति और देशांतर', ta: 'Negative Numbers in Jyotish — Retrograde Motion and Longitudes', te: 'Negative Numbers in Jyotish — Retrograde Motion and Longitudes', bn: 'Negative Numbers in Jyotish — Retrograde Motion and Longitudes', kn: 'Negative Numbers in Jyotish — Retrograde Motion and Longitudes', gu: 'Negative Numbers in Jyotish — Retrograde Motion and Longitudes' },
  s6Body: {
    en: "The connection between Indian astronomy (Jyotish) and negative numbers is direct and elegant. Planetary longitudes are measured from 0° to 360°. A planet's apparent retrograde motion — when it appears to move backward against the stars — requires tracking negative velocity (degrees per day). Without signed arithmetic, you cannot compute retrogression. The difference in longitude between two planets (the bhava sandhi calculation) can be negative if measured in one direction. The correction terms in planetary equations (the manda and shighra samskara) are signed quantities — they are added or subtracted depending on which half of the orbit the planet occupies. Every panchang calculation in this app uses signed arithmetic that Brahmagupta formalized in 628 CE.",
    hi: 'भारतीय खगोलशास्त्र (ज्योतिष) और ऋणात्मक संख्याओं के बीच संबंध प्रत्यक्ष और सुंदर है। ग्रहों के देशांतर 0° से 360° तक मापे जाते हैं। ग्रह की वक्री गति — जब वह तारों के विपरीत पीछे चलता प्रतीत होता है — के लिए ऋणात्मक वेग (डिग्री प्रति दिन) को ट्रैक करना आवश्यक है। ऋणात्मक अंकगणित के बिना, आप वक्र-गति की गणना नहीं कर सकते। इस ऐप में प्रत्येक पंचांग गणना उस चिह्नित अंकगणित का उपयोग करती है जिसे ब्रह्मगुप्त ने 628 ईस्वी में औपचारिक रूप दिया था।',
  },

  backToContributions: { en: 'Back to Contributions', hi: 'योगदान पर वापस', sa: 'योगदान पर वापस', mai: 'योगदान पर वापस', mr: 'योगदान पर वापस', ta: 'Back to Contributions', te: 'Back to Contributions', bn: 'Back to Contributions', kn: 'Back to Contributions', gu: 'Back to Contributions' },
  nextPage: { en: 'Next: Fibonacci & Indian Music', hi: 'अगला: फिबोनाची और भारतीय संगीत', sa: 'अगला: फिबोनाची और भारतीय संगीत', mai: 'अगला: फिबोनाची और भारतीय संगीत', mr: 'अगला: फिबोनाची और भारतीय संगीत', ta: 'Next: Fibonacci & Indian Music', te: 'Next: Fibonacci & Indian Music', bn: 'Next: Fibonacci & Indian Music', kn: 'Next: Fibonacci & Indian Music', gu: 'Next: Fibonacci & Indian Music' },
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const BRAHMAGUPTA_RULES = [
  { rule: { en: '(+) × (−) = (−)  [fortune × debt = debt]', hi: '(+) × (−) = (−)  [धन × ऋण = ऋण]', sa: '(+) × (−) = (−)  [धन × ऋण = ऋण]', mai: '(+) × (−) = (−)  [धन × ऋण = ऋण]', mr: '(+) × (−) = (−)  [धन × ऋण = ऋण]', ta: '(+) × (−) = (−)  [fortune × debt = debt]', te: '(+) × (−) = (−)  [fortune × debt = debt]', bn: '(+) × (−) = (−)  [fortune × debt = debt]', kn: '(+) × (−) = (−)  [fortune × debt = debt]', gu: '(+) × (−) = (−)  [fortune × debt = debt]' }, sign: 'bg-red-500/10 border-red-500/20 text-red-400' },
  { rule: { en: '(−) × (−) = (+)  [debt × debt = fortune]', hi: '(−) × (−) = (+)  [ऋण × ऋण = धन]', sa: '(−) × (−) = (+)  [ऋण × ऋण = धन]', mai: '(−) × (−) = (+)  [ऋण × ऋण = धन]', mr: '(−) × (−) = (+)  [ऋण × ऋण = धन]', ta: '(−) × (−) = (+)  [debt × debt = fortune]', te: '(−) × (−) = (+)  [debt × debt = fortune]', bn: '(−) × (−) = (+)  [debt × debt = fortune]', kn: '(−) × (−) = (+)  [debt × debt = fortune]', gu: '(−) × (−) = (+)  [debt × debt = fortune]' }, sign: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  { rule: { en: '(+) × (+) = (+)  [fortune × fortune = fortune]', hi: '(+) × (+) = (+)  [धन × धन = धन]', sa: '(+) × (+) = (+)  [धन × धन = धन]', mai: '(+) × (+) = (+)  [धन × धन = धन]', mr: '(+) × (+) = (+)  [धन × धन = धन]', ta: '(+) × (+) = (+)  [fortune × fortune = fortune]', te: '(+) × (+) = (+)  [fortune × fortune = fortune]', bn: '(+) × (+) = (+)  [fortune × fortune = fortune]', kn: '(+) × (+) = (+)  [fortune × fortune = fortune]', gu: '(+) × (+) = (+)  [fortune × fortune = fortune]' }, sign: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  { rule: { en: '0 − (+) = (−)  [zero minus fortune = debt]', hi: '0 − (+) = (−)  [शून्य − धन = ऋण]', sa: '0 − (+) = (−)  [शून्य − धन = ऋण]', mai: '0 − (+) = (−)  [शून्य − धन = ऋण]', mr: '0 − (+) = (−)  [शून्य − धन = ऋण]', ta: '0 − (+) = (−)  [zero minus fortune = debt]', te: '0 − (+) = (−)  [zero minus fortune = debt]', bn: '0 − (+) = (−)  [zero minus fortune = debt]', kn: '0 − (+) = (−)  [zero minus fortune = debt]', gu: '0 − (+) = (−)  [zero minus fortune = debt]' }, sign: 'bg-red-500/10 border-red-500/20 text-red-400' },
  { rule: { en: '(+) + (−) = difference of the two', hi: '(+) + (−) = दोनों का अंतर', sa: '(+) + (−) = दोनों का अंतर', mai: '(+) + (−) = दोनों का अंतर', mr: '(+) + (−) = दोनों का अंतर', ta: '(+) + (−) = difference of the two', te: '(+) + (−) = difference of the two', bn: '(+) + (−) = difference of the two', kn: '(+) + (−) = difference of the two', gu: '(+) + (−) = difference of the two' }, sign: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  { rule: { en: '0 ÷ 0 = 0  (his one error — undefined!)', hi: '0 ÷ 0 = 0  (उनकी एकमात्र त्रुटि — अपरिभाषित!)', sa: '0 ÷ 0 = 0  (उनकी एकमात्र त्रुटि — अपरिभाषित!)', mai: '0 ÷ 0 = 0  (उनकी एकमात्र त्रुटि — अपरिभाषित!)', mr: '0 ÷ 0 = 0  (उनकी एकमात्र त्रुटि — अपरिभाषित!)', ta: '0 ÷ 0 = 0  (his one error — undefined!)', te: '0 ÷ 0 = 0  (his one error — undefined!)', bn: '0 ÷ 0 = 0  (his one error — undefined!)', kn: '0 ÷ 0 = 0  (his one error — undefined!)', gu: '0 ÷ 0 = 0  (his one error — undefined!)' }, sign: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
];

const EUROPEAN_RESISTANCE = [
  { who: 'René Descartes', year: '1637 CE', stance: { en: 'Called negative roots "false" (fausses) — refused to accept them as real solutions', hi: 'ऋणात्मक जड़ों को "झूठी" कहा — उन्हें वास्तविक समाधान के रूप में स्वीकार करने से इनकार कर दिया', sa: 'ऋणात्मक जड़ों को "झूठी" कहा — उन्हें वास्तविक समाधान के रूप में स्वीकार करने से इनकार कर दिया', mai: 'ऋणात्मक जड़ों को "झूठी" कहा — उन्हें वास्तविक समाधान के रूप में स्वीकार करने से इनकार कर दिया', mr: 'ऋणात्मक जड़ों को "झूठी" कहा — उन्हें वास्तविक समाधान के रूप में स्वीकार करने से इनकार कर दिया', ta: 'Called negative roots "false" (fausses) — refused to accept them as real solutions', te: 'Called negative roots "false" (fausses) — refused to accept them as real solutions', bn: 'Called negative roots "false" (fausses) — refused to accept them as real solutions', kn: 'Called negative roots "false" (fausses) — refused to accept them as real solutions', gu: 'Called negative roots "false" (fausses) — refused to accept them as real solutions' }, color: 'border-red-400/50' },
  { who: 'Blaise Pascal', year: '1650 CE', stance: { en: '"Nothing can be less than zero" — subtraction from zero was meaningless to him', hi: '"शून्य से कम कुछ भी नहीं हो सकता" — उनके लिए शून्य से घटाव निरर्थक था', sa: '"शून्य से कम कुछ भी नहीं हो सकता" — उनके लिए शून्य से घटाव निरर्थक था', mai: '"शून्य से कम कुछ भी नहीं हो सकता" — उनके लिए शून्य से घटाव निरर्थक था', mr: '"शून्य से कम कुछ भी नहीं हो सकता" — उनके लिए शून्य से घटाव निरर्थक था', ta: '"Nothing can be less than zero" — subtraction from zero was meaningless to him', te: '"Nothing can be less than zero" — subtraction from zero was meaningless to him', bn: '"Nothing can be less than zero" — subtraction from zero was meaningless to him', kn: '"Nothing can be less than zero" — subtraction from zero was meaningless to him', gu: '"Nothing can be less than zero" — subtraction from zero was meaningless to him' }, color: 'border-red-400/40' },
  { who: 'Antoine Arnauld', year: '1667 CE', stance: { en: 'Argued -1/1 = 1/-1 was paradoxical — how can a smaller number divide a larger?', hi: 'तर्क दिया कि -1/1 = 1/-1 विरोधाभासी था — एक छोटी संख्या बड़े को कैसे विभाजित कर सकती है?', sa: 'तर्क दिया कि -1/1 = 1/-1 विरोधाभासी था — एक छोटी संख्या बड़े को कैसे विभाजित कर सकती है?', mai: 'तर्क दिया कि -1/1 = 1/-1 विरोधाभासी था — एक छोटी संख्या बड़े को कैसे विभाजित कर सकती है?', mr: 'तर्क दिया कि -1/1 = 1/-1 विरोधाभासी था — एक छोटी संख्या बड़े को कैसे विभाजित कर सकती है?', ta: 'Argued -1/1 = 1/-1 was paradoxical — how can a smaller number divide a larger?', te: 'Argued -1/1 = 1/-1 was paradoxical — how can a smaller number divide a larger?', bn: 'Argued -1/1 = 1/-1 was paradoxical — how can a smaller number divide a larger?', kn: 'Argued -1/1 = 1/-1 was paradoxical — how can a smaller number divide a larger?', gu: 'Argued -1/1 = 1/-1 was paradoxical — how can a smaller number divide a larger?' }, color: 'border-orange-400/40' },
  { who: 'Francis Maseres', year: '1758 CE', stance: { en: 'Wrote books arguing negatives should be abolished from mathematics entirely', hi: 'किताबें लिखीं यह तर्क देते हुए कि ऋणात्मक संख्याओं को गणित से पूरी तरह समाप्त किया जाना चाहिए', sa: 'किताबें लिखीं यह तर्क देते हुए कि ऋणात्मक संख्याओं को गणित से पूरी तरह समाप्त किया जाना चाहिए', mai: 'किताबें लिखीं यह तर्क देते हुए कि ऋणात्मक संख्याओं को गणित से पूरी तरह समाप्त किया जाना चाहिए', mr: 'किताबें लिखीं यह तर्क देते हुए कि ऋणात्मक संख्याओं को गणित से पूरी तरह समाप्त किया जाना चाहिए', ta: 'Wrote books arguing negatives should be abolished from mathematics entirely', te: 'Wrote books arguing negatives should be abolished from mathematics entirely', bn: 'Wrote books arguing negatives should be abolished from mathematics entirely', kn: 'Wrote books arguing negatives should be abolished from mathematics entirely', gu: 'Wrote books arguing negatives should be abolished from mathematics entirely' }, color: 'border-amber-400/40' },
  { who: 'William Frend', year: '1796 CE', stance: { en: 'Refused to use negative numbers in his algebra textbook — called them "absurd"', hi: 'अपनी बीजगणित पाठ्यपुस्तक में ऋणात्मक संख्याओं का उपयोग करने से इनकार किया — उन्हें "बेतुका" कहा', sa: 'अपनी बीजगणित पाठ्यपुस्तक में ऋणात्मक संख्याओं का उपयोग करने से इनकार किया — उन्हें "बेतुका" कहा', mai: 'अपनी बीजगणित पाठ्यपुस्तक में ऋणात्मक संख्याओं का उपयोग करने से इनकार किया — उन्हें "बेतुका" कहा', mr: 'अपनी बीजगणित पाठ्यपुस्तक में ऋणात्मक संख्याओं का उपयोग करने से इनकार किया — उन्हें "बेतुका" कहा', ta: 'Refused to use negative numbers in his algebra textbook — called them "absurd"', te: 'Refused to use negative numbers in his algebra textbook — called them "absurd"', bn: 'Refused to use negative numbers in his algebra textbook — called them "absurd"', kn: 'Refused to use negative numbers in his algebra textbook — called them "absurd"', gu: 'Refused to use negative numbers in his algebra textbook — called them "absurd"' }, color: 'border-amber-400/30' },
];

const JYOTISH_USES = [
  { use: { en: 'Retrograde velocity (−°/day when planet moves backward)', hi: 'वक्री वेग (जब ग्रह पीछे चलता है तो −°/दिन)', sa: 'वक्री वेग (जब ग्रह पीछे चलता है तो −°/दिन)', mai: 'वक्री वेग (जब ग्रह पीछे चलता है तो −°/दिन)', mr: 'वक्री वेग (जब ग्रह पीछे चलता है तो −°/दिन)', ta: 'Retrograde velocity (−°/day when planet moves backward)', te: 'Retrograde velocity (−°/day when planet moves backward)', bn: 'Retrograde velocity (−°/day when planet moves backward)', kn: 'Retrograde velocity (−°/day when planet moves backward)', gu: 'Retrograde velocity (−°/day when planet moves backward)' } },
  { use: { en: 'Longitude difference between planets (can be negative going east)', hi: 'ग्रहों के बीच देशांतर अंतर (पूर्व की ओर जाने पर ऋणात्मक हो सकता है)', sa: 'ग्रहों के बीच देशांतर अंतर (पूर्व की ओर जाने पर ऋणात्मक हो सकता है)', mai: 'ग्रहों के बीच देशांतर अंतर (पूर्व की ओर जाने पर ऋणात्मक हो सकता है)', mr: 'ग्रहों के बीच देशांतर अंतर (पूर्व की ओर जाने पर ऋणात्मक हो सकता है)', ta: 'Longitude difference between planets (can be negative going east)', te: 'Longitude difference between planets (can be negative going east)', bn: 'Longitude difference between planets (can be negative going east)', kn: 'Longitude difference between planets (can be negative going east)', gu: 'Longitude difference between planets (can be negative going east)' } },
  { use: { en: 'Manda/shighra samskara corrections (signed ±)', hi: 'मंद/शीघ्र संस्कार सुधार (±चिह्नित)', sa: 'मंद/शीघ्र संस्कार सुधार (±चिह्नित)', mai: 'मंद/शीघ्र संस्कार सुधार (±चिह्नित)', mr: 'मंद/शीघ्र संस्कार सुधार (±चिह्नित)', ta: 'Manda/shighra samskara corrections (signed ±)', te: 'Manda/shighra samskara corrections (signed ±)', bn: 'Manda/shighra samskara corrections (signed ±)', kn: 'Manda/shighra samskara corrections (signed ±)', gu: 'Manda/shighra samskara corrections (signed ±)' } },
  { use: { en: 'Latitude of planets (north = +, south = −)', hi: 'ग्रहों का अक्षांश (उत्तर = +, दक्षिण = −)', sa: 'ग्रहों का अक्षांश (उत्तर = +, दक्षिण = −)', mai: 'ग्रहों का अक्षांश (उत्तर = +, दक्षिण = −)', mr: 'ग्रहों का अक्षांश (उत्तर = +, दक्षिण = −)', ta: 'Latitude of planets (north = +, south = −)', te: 'Latitude of planets (north = +, south = −)', bn: 'Latitude of planets (north = +, south = −)', kn: 'Latitude of planets (north = +, south = −)', gu: 'Latitude of planets (north = +, south = −)' } },
  { use: { en: 'Equation of time corrections (can be positive or negative)', hi: 'समय के समीकरण सुधार (धनात्मक या ऋणात्मक हो सकते हैं)', sa: 'समय के समीकरण सुधार (धनात्मक या ऋणात्मक हो सकते हैं)', mai: 'समय के समीकरण सुधार (धनात्मक या ऋणात्मक हो सकते हैं)', mr: 'समय के समीकरण सुधार (धनात्मक या ऋणात्मक हो सकते हैं)', ta: 'Equation of time corrections (can be positive or negative)', te: 'Equation of time corrections (can be positive or negative)', bn: 'Equation of time corrections (can be positive or negative)', kn: 'Equation of time corrections (can be positive or negative)', gu: 'Equation of time corrections (can be positive or negative)' } },
];

const SANSKRIT_TERMS = [
  { term: 'Dhana', transliteration: 'dhana', meaning: 'fortune, wealth — the positive number', devanagari: 'धन' },
  { term: 'Rina', transliteration: 'ṛṇa', meaning: 'debt — the negative number', devanagari: 'ऋण' },
  { term: 'Brahmasphutasiddhanta', transliteration: 'Brahma-sphuṭa-siddhānta', meaning: 'Correctly Established Doctrine of Brahma (628 CE)', devanagari: 'ब्रह्मस्फुटसिद्धान्त' },
  { term: 'Ganitasarasangraha', transliteration: 'Gaṇita-sāra-saṅgraha', meaning: 'Compendium of the Essence of Mathematics — Mahavira, ~850 CE', devanagari: 'गणितसारसंग्रह' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default async function NegativeNumbersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const hi = isDevanagariLocale(locale);
  const t = (obj: LocaleText | Record<string, string>) => tl(obj, locale);

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gold-primary/10"
              style={{
                width: `${(i % 4 + 1) * 2}px`,
                height: `${(i % 4 + 1) * 2}px`,
                left: `${(i * 19 + 3) % 100}%`,
                top: `${(i * 29 + 7) % 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-amber-500/10 border border-red-500/30 flex items-center justify-center">
                <Minus className="w-10 h-10 text-red-400" />
              </div>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-gold-gradient mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t(L.title)}
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {t(L.subtitle)}
            </p>
            <div className="flex justify-center mt-4">
              <ShareRow pageTitle={t(L.title)} locale={locale} />
            </div>
          </div>

          <div
            className="mt-10"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl px-10 py-7">
              <div className="text-center">
                <div
                  className="text-6xl sm:text-7xl font-black text-gold-primary"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  धन
                </div>
                <div className="text-text-secondary mt-1 text-sm">dhana = positive</div>
              </div>
              <div className="text-4xl text-gold-primary/40 font-thin">/</div>
              <div className="text-center">
                <div
                  className="text-6xl sm:text-7xl font-black text-red-400"
                  style={{ fontFamily: 'var(--font-devanagari-heading)' }}
                >
                  ऋण
                </div>
                <div className="text-text-secondary mt-1 text-sm">rina = negative/debt</div>
              </div>
              <div className="text-text-secondary/50 text-xs mt-1 sm:mt-0 sm:ml-2 text-center">
                {hi ? 'ब्रह्मगुप्त, 628 ईस्वी' : 'Brahmagupta, 628 CE'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1 ═══ */}
        <LessonSection number={1} title={t(L.s1Title)} variant="highlight">
          <p>{t(L.s1Body)}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-gold-primary/10 to-transparent border border-gold-primary/20 p-5">
              <div
                className="text-2xl font-bold text-gold-primary mb-1"
                style={{ fontFamily: 'var(--font-devanagari-heading)' }}
              >
                धन
              </div>
              <div className="text-gold-light font-semibold text-sm mb-1">dhana (fortune)</div>
              <div className="text-text-secondary text-sm">
                {hi ? 'सम्पदा, लाभ, धनात्मक संख्या — हमारे पास जो है वह' : 'Wealth, profit, positive number — what we have'}
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 p-5">
              <div
                className="text-2xl font-bold text-red-400 mb-1"
                style={{ fontFamily: 'var(--font-devanagari-heading)' }}
              >
                ऋण
              </div>
              <div className="text-red-400/80 font-semibold text-sm mb-1">rina (debt)</div>
              <div className="text-text-secondary text-sm">
                {hi ? 'कर्ज़, हानि, ऋणात्मक संख्या — हम पर जो बकाया है वह' : 'Debt, loss, negative number — what we owe'}
              </div>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 ═══ */}
        <LessonSection number={2} title={t(L.s2Title)}>
          <p>{t(L.s2Intro)}</p>
          <div className="mt-6 space-y-3">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider">
              {hi ? 'ब्रह्मगुप्त के ऋण-धन नियम (628 ईस्वी)' : "Brahmagupta's rina-dhana rules (628 CE)"}
            </h4>
            {BRAHMAGUPTA_RULES.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${item.sign}`}
              >
                <span className="text-xs font-mono w-4 flex-shrink-0 opacity-60">{i + 1}.</span>
                <span className="font-mono text-sm flex-1">{t(item.rule)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="text-amber-400 font-semibold text-sm mb-1">
              {hi ? 'उनकी एकमात्र त्रुटि:' : 'His one error:'}
            </div>
            <div className="font-mono text-text-primary text-sm">
              0 ÷ 0 = 0 <span className="text-red-400 ml-2">✗ (undefined)</span>
            </div>
            <div className="text-text-secondary text-xs mt-2">
              {hi
                ? 'भास्कर II (1150 ईस्वी) ने इसे परिष्कृत किया: n÷0 = अनन्त (∞), जहाँ n≠0 — फिर भी पूरी तरह सही नहीं, लेकिन करीब।'
                : 'Bhaskara II (1150 CE) refined this: n÷0 = ananta (∞) where n≠0 — still not fully correct, but closer.'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 3 ═══ */}
        <LessonSection number={3} title={t(L.s3Title)} variant="highlight">
          <p>{t(L.s3Body)}</p>
          <div className="mt-5 bg-white/[0.02] border border-gold-primary/15 rounded-xl p-5">
            <div className="text-gold-light font-semibold text-sm mb-3">
              {hi ? 'महावीर का योगदान (गणितसारसंग्रह, ~850 ईस्वी)' : "Mahavira's contributions (Ganitasarasangraha, ~850 CE)"}
            </div>
            <ul className="space-y-2">
              {[
                { en: 'Extended Brahmagupta\'s rules to more complex expressions', hi: 'ब्रह्मगुप्त के नियमों को अधिक जटिल व्यंजकों तक बढ़ाया' },
                { en: 'Systematic treatment of losses and debts in commercial arithmetic', hi: 'वाणिज्यिक अंकगणित में हानि और ऋण का व्यवस्थित उपचार', sa: 'वाणिज्यिक अंकगणित में हानि और ऋण का व्यवस्थित उपचार', mai: 'वाणिज्यिक अंकगणित में हानि और ऋण का व्यवस्थित उपचार', mr: 'वाणिज्यिक अंकगणित में हानि और ऋण का व्यवस्थित उपचार', ta: 'Systematic treatment of losses and debts in commercial arithmetic', te: 'Systematic treatment of losses and debts in commercial arithmetic', bn: 'Systematic treatment of losses and debts in commercial arithmetic', kn: 'Systematic treatment of losses and debts in commercial arithmetic', gu: 'Systematic treatment of losses and debts in commercial arithmetic' },
                { en: 'Worked with negative results in subtraction sequences', hi: 'घटाव अनुक्रमों में ऋणात्मक परिणामों के साथ काम किया', sa: 'घटाव अनुक्रमों में ऋणात्मक परिणामों के साथ काम किया', mai: 'घटाव अनुक्रमों में ऋणात्मक परिणामों के साथ काम किया', mr: 'घटाव अनुक्रमों में ऋणात्मक परिणामों के साथ काम किया', ta: 'Worked with negative results in subtraction sequences', te: 'Worked with negative results in subtraction sequences', bn: 'Worked with negative results in subtraction sequences', kn: 'Worked with negative results in subtraction sequences', gu: 'Worked with negative results in subtraction sequences' },
                { en: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', hi: '(गलत तरीके से) नोट किया कि ऋणात्मक संख्याओं के वर्गमूल मौजूद नहीं हैं — काल्पनिक संख्याओं की 700 साल पहले भविष्यवाणी', sa: '(गलत तरीके से) नोट किया कि ऋणात्मक संख्याओं के वर्गमूल मौजूद नहीं हैं — काल्पनिक संख्याओं की 700 साल पहले भविष्यवाणी', mai: '(गलत तरीके से) नोट किया कि ऋणात्मक संख्याओं के वर्गमूल मौजूद नहीं हैं — काल्पनिक संख्याओं की 700 साल पहले भविष्यवाणी', mr: '(गलत तरीके से) नोट किया कि ऋणात्मक संख्याओं के वर्गमूल मौजूद नहीं हैं — काल्पनिक संख्याओं की 700 साल पहले भविष्यवाणी', ta: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', te: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', bn: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', kn: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years', gu: 'Noted (incorrectly) that square roots of negatives do not exist — foreshadowing imaginary numbers by 700 years' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                  <span className="text-gold-primary/60 mt-0.5">•</span>
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4 ═══ */}
        <LessonSection number={4} title={t(L.s4Title)}>
          <p>{t(L.s4Body)}</p>
          <div className="mt-6 space-y-3">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider">
              {hi ? 'यूरोपीय विरोध की समयरेखा' : 'Timeline of European resistance'}
            </h4>
            {EUROPEAN_RESISTANCE.map((item, i) => (
              <div
                key={i}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${item.color} px-4 py-4`}
              >
                <div className="flex-shrink-0">
                  <div className="text-gold-primary font-bold text-sm font-mono">{item.year}</div>
                  <div className="text-text-secondary/70 text-xs">{item.who}</div>
                </div>
                <div className="text-text-secondary text-sm leading-relaxed italic">&ldquo;{t(item.stance)}&rdquo;</div>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-gold-primary/5 border border-gold-primary/15 rounded-lg p-4 text-sm text-text-secondary">
            <span className="text-gold-light font-semibold">{hi ? 'तुलना: ' : 'Comparison: '}</span>
            {hi
              ? 'भारत में 628 ईस्वी में स्वीकृत। यूरोप में ~1800 ईस्वी तक पूर्ण स्वीकृति। अंतर: 1,200 वर्ष।'
              : 'Accepted in India by 628 CE. Fully accepted in Europe by ~1800 CE. Gap: 1,200 years.'}
          </div>
        </LessonSection>

        {/* ═══ SECTION 5 ═══ */}
        <LessonSection number={5} title={t(L.s5Title)} variant="highlight">
          <p>{t(L.s5Body)}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-semibold text-sm">
                  {hi ? 'भारत — क्यों जल्दी स्वीकार किया' : 'India — why early acceptance'}
                </span>
              </div>
              <ul className="space-y-2 text-text-secondary text-sm">
                {[
                  { en: 'Active banking & credit economy needed debt arithmetic', hi: 'सक्रिय बैंकिंग और ऋण अर्थव्यवस्था को ऋण अंकगणित की जरूरत थी', sa: 'सक्रिय बैंकिंग और ऋण अर्थव्यवस्था को ऋण अंकगणित की जरूरत थी', mai: 'सक्रिय बैंकिंग और ऋण अर्थव्यवस्था को ऋण अंकगणित की जरूरत थी', mr: 'सक्रिय बैंकिंग और ऋण अर्थव्यवस्था को ऋण अंकगणित की जरूरत थी', ta: 'Active banking & credit economy needed debt arithmetic', te: 'Active banking & credit economy needed debt arithmetic', bn: 'Active banking & credit economy needed debt arithmetic', kn: 'Active banking & credit economy needed debt arithmetic', gu: 'Active banking & credit economy needed debt arithmetic' },
                  { en: 'Rina (debt) legally codified in Arthashastra & Manusmriti', hi: 'ऋण अर्थशास्त्र और मनुस्मृति में कानूनी रूप से संहिताबद्ध', sa: 'ऋण अर्थशास्त्र और मनुस्मृति में कानूनी रूप से संहिताबद्ध', mai: 'ऋण अर्थशास्त्र और मनुस्मृति में कानूनी रूप से संहिताबद्ध', mr: 'ऋण अर्थशास्त्र और मनुस्मृति में कानूनी रूप से संहिताबद्ध', ta: 'Rina (debt) legally codified in Arthashastra & Manusmriti', te: 'Rina (debt) legally codified in Arthashastra & Manusmriti', bn: 'Rina (debt) legally codified in Arthashastra & Manusmriti', kn: 'Rina (debt) legally codified in Arthashastra & Manusmriti', gu: 'Rina (debt) legally codified in Arthashastra & Manusmriti' },
                  { en: 'Astronomical calculations require signed numbers', hi: 'खगोलीय गणनाओं के लिए चिह्नित संख्याओं की आवश्यकता है', sa: 'खगोलीय गणनाओं के लिए चिह्नित संख्याओं की आवश्यकता है', mai: 'खगोलीय गणनाओं के लिए चिह्नित संख्याओं की आवश्यकता है', mr: 'खगोलीय गणनाओं के लिए चिह्नित संख्याओं की आवश्यकता है', ta: 'Astronomical calculations require signed numbers', te: 'Astronomical calculations require signed numbers', bn: 'Astronomical calculations require signed numbers', kn: 'Astronomical calculations require signed numbers', gu: 'Astronomical calculations require signed numbers' },
                  { en: 'Philosophical tradition comfortable with "void" (shunya)', hi: 'दार्शनिक परंपरा "शून्यता" के साथ सहज', sa: 'दार्शनिक परंपरा "शून्यता" के साथ सहज', mai: 'दार्शनिक परंपरा "शून्यता" के साथ सहज', mr: 'दार्शनिक परंपरा "शून्यता" के साथ सहज', ta: 'Philosophical tradition comfortable with "void" (shunya)', te: 'Philosophical tradition comfortable with "void" (shunya)', bn: 'Philosophical tradition comfortable with "void" (shunya)', kn: 'Philosophical tradition comfortable with "void" (shunya)', gu: 'Philosophical tradition comfortable with "void" (shunya)' },
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-emerald-400/60 mt-0.5">+</span>
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-400 font-semibold text-sm">
                  {hi ? 'यूरोप — क्यों 1,200 साल लगे' : 'Europe — why 1,200 years'}
                </span>
              </div>
              <ul className="space-y-2 text-text-secondary text-sm">
                {[
                  { en: 'Greek geometry dominated — no negative lengths possible', hi: 'यूनानी ज्यामिति का प्रभुत्व — ऋणात्मक लंबाई संभव नहीं', sa: 'यूनानी ज्यामिति का प्रभुत्व — ऋणात्मक लंबाई संभव नहीं', mai: 'यूनानी ज्यामिति का प्रभुत्व — ऋणात्मक लंबाई संभव नहीं', mr: 'यूनानी ज्यामिति का प्रभुत्व — ऋणात्मक लंबाई संभव नहीं', ta: 'Greek geometry dominated — no negative lengths possible', te: 'Greek geometry dominated — no negative lengths possible', bn: 'Greek geometry dominated — no negative lengths possible', kn: 'Greek geometry dominated — no negative lengths possible', gu: 'Greek geometry dominated — no negative lengths possible' },
                  { en: 'Barter economies needed less abstract arithmetic', hi: 'वस्तु-विनिमय अर्थव्यवस्थाओं को कम अमूर्त अंकगणित चाहिए', sa: 'वस्तु-विनिमय अर्थव्यवस्थाओं को कम अमूर्त अंकगणित चाहिए', mai: 'वस्तु-विनिमय अर्थव्यवस्थाओं को कम अमूर्त अंकगणित चाहिए', mr: 'वस्तु-विनिमय अर्थव्यवस्थाओं को कम अमूर्त अंकगणित चाहिए', ta: 'Barter economies needed less abstract arithmetic', te: 'Barter economies needed less abstract arithmetic', bn: 'Barter economies needed less abstract arithmetic', kn: 'Barter economies needed less abstract arithmetic', gu: 'Barter economies needed less abstract arithmetic' },
                  { en: 'Philosophical block: "Nothing can be less than nothing"', hi: 'दार्शनिक बाधा: "शून्य से कम कुछ भी नहीं हो सकता"', sa: 'दार्शनिक बाधा: "शून्य से कम कुछ भी नहीं हो सकता"', mai: 'दार्शनिक बाधा: "शून्य से कम कुछ भी नहीं हो सकता"', mr: 'दार्शनिक बाधा: "शून्य से कम कुछ भी नहीं हो सकता"', ta: 'Philosophical block: "Nothing can be less than nothing"', te: 'Philosophical block: "Nothing can be less than nothing"', bn: 'Philosophical block: "Nothing can be less than nothing"', kn: 'Philosophical block: "Nothing can be less than nothing"', gu: 'Philosophical block: "Nothing can be less than nothing"' },
                  { en: 'Church viewed zero and negatives with theological suspicion', hi: 'चर्च ने शून्य और ऋणात्मक को धार्मिक संदेह से देखा', sa: 'चर्च ने शून्य और ऋणात्मक को धार्मिक संदेह से देखा', mai: 'चर्च ने शून्य और ऋणात्मक को धार्मिक संदेह से देखा', mr: 'चर्च ने शून्य और ऋणात्मक को धार्मिक संदेह से देखा', ta: 'Church viewed zero and negatives with theological suspicion', te: 'Church viewed zero and negatives with theological suspicion', bn: 'Church viewed zero and negatives with theological suspicion', kn: 'Church viewed zero and negatives with theological suspicion', gu: 'Church viewed zero and negatives with theological suspicion' },
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-red-400/60 mt-0.5">−</span>
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 ═══ */}
        <LessonSection number={6} title={t(L.s6Title)}>
          <p>{t(L.s6Body)}</p>
          <div className="mt-6 space-y-2">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider mb-3">
              {hi ? 'इस ऐप में ऋणात्मक संख्याओं के उपयोग' : 'Uses of negative numbers in this app'}
            </h4>
            {JYOTISH_USES.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg bg-white/[0.02] border border-white/[0.05] px-4 py-3"
              >
                <TrendingDown className="w-4 h-4 text-gold-primary/60 flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary text-sm">{t(item.use)}</span>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SANSKRIT TERMS ═══ */}
        <LessonSection title={hi ? 'मुख्य संस्कृत शब्द' : 'Key Sanskrit Terms'}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SANSKRIT_TERMS.map((term, i) => (
              <SanskritTermCard key={i} {...term} />
            ))}
          </div>
        </LessonSection>

        {/* ═══ NAVIGATION ═══ */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/learn/contributions"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gold-primary/20 text-gold-primary hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-sm font-medium"
          >
            ← {t(L.backToContributions)}
          </Link>
          <Link
            href="/learn/contributions/fibonacci"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {t(L.nextPage)} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
