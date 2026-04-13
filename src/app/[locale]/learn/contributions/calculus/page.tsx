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
    en: 'Calculus Was Invented in Kerala, Not Cambridge',
    hi: 'कलनशास्त्र की खोज केरल में हुई, कैम्ब्रिज में नहीं',
  },
  subtitle: {
    en: 'Newton and Leibniz are credited with inventing calculus in the 1660s–1680s. But 250 years earlier, in a small village in Kerala called Sangamagrama, a mathematician named Madhava had already discovered infinite series for π, sine, cosine, and arctangent — with rigorous proofs.',
    hi: 'न्यूटन और लाइबनिज को 1660-1680 के दशक में कलनशास्त्र के आविष्कार का श्रेय दिया जाता है। लेकिन 250 वर्ष पहले, केरल के संगमग्राम नामक एक छोटे गाँव में, माधव नामक गणितज्ञ ने π, sine, cosine और arctangent के लिए अनंत श्रेणियाँ — कठोर प्रमाणों के साथ — पहले ही खोज ली थीं।',
  },

  s1Title: { en: 'Who Was Madhava of Sangamagrama?', hi: 'संगमग्राम के माधव कौन थे?', sa: 'संगमग्राम के माधव कौन थे?', mai: 'संगमग्राम के माधव कौन थे?', mr: 'संगमग्राम के माधव कौन थे?', ta: 'Who Was Madhava of Sangamagrama?', te: 'Who Was Madhava of Sangamagrama?', bn: 'Who Was Madhava of Sangamagrama?', kn: 'Who Was Madhava of Sangamagrama?', gu: 'Who Was Madhava of Sangamagrama?' },
  s1Body: {
    en: 'Madhava (c. 1340–1425 CE) was a mathematician and astronomer from the village of Sangamagrama in Kerala (modern-day Irinjalakuda, near Thrissur). He founded what historians now call the "Kerala School of Astronomy and Mathematics," a tradition that produced a chain of brilliant mathematicians over 200 years. His direct works have not all survived, but his results are cited and proved in later texts by his students.',
    hi: 'माधव (c. 1340-1425 CE) केरल के संगमग्राम गाँव (आधुनिक इरिंजलकुड़ा, त्रिशूर के निकट) के एक गणितज्ञ और खगोलशास्त्री थे। उन्होंने वह परंपरा स्थापित की जिसे इतिहासकार अब "केरल गणित और खगोल विज्ञान का स्कूल" कहते हैं — एक परंपरा जिसने 200 वर्षों में प्रतिभाशाली गणितज्ञों की एक श्रृंखला उत्पन्न की। उनके प्रत्यक्ष कार्य पूरी तरह नहीं बचे हैं, लेकिन उनके परिणाम उनके छात्रों के बाद के ग्रंथों में उद्धृत और सिद्ध हैं।',
  },

  s2Title: {
    en: 'Madhava\'s π Series — 250 Years Before Leibniz',
    hi: 'माधव की π श्रेणी — लाइबनिज से 250 वर्ष पहले',
  },
  s2Body: {
    en: 'The series π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ... is universally taught as the "Leibniz formula for π" (1676). But Madhava derived it around 1375 CE — 300 years earlier. More remarkably, Madhava went further: he computed correction terms that make the series converge far faster, reducing the error from O(1/n) to O(1/n³). The European version of this acceleration technique was not published until 1995.',
    hi: 'श्रेणी π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ... सार्वभौमिक रूप से "लाइबनिज फॉर्मूला फॉर π" (1676) के रूप में पढ़ाई जाती है। लेकिन माधव ने इसे लगभग 1375 CE में व्युत्पन्न किया — 300 वर्ष पहले। इससे भी उल्लेखनीय, माधव आगे गए: उन्होंने सुधार पद (correction terms) की गणना की जो श्रेणी को बहुत तेज़ी से अभिसरण (converge) करते हैं, त्रुटि को O(1/n) से O(1/n³) तक कम करते हैं। इस त्वरण तकनीक का यूरोपीय संस्करण 1995 तक प्रकाशित नहीं हुआ था।',
  },
  s2Source: {
    en: 'Source: Yuktibhasha (Jyeshthadeva, ~1530 CE), Chapter 6 — contains full proof of the π series using geometric limit arguments.',
    hi: 'स्रोत: युक्तिभाषा (ज्येष्ठदेव, ~1530 CE), अध्याय 6 — ज्यामितीय सीमा तर्कों का उपयोग करके π श्रेणी का पूर्ण प्रमाण।',
  },

  s3Title: {
    en: 'Madhava\'s Sine Series — Taylor Series, 300 Years Early',
    hi: 'माधव की sine श्रेणी — टेलर श्रेणी, 300 वर्ष पहले',
  },
  s3Body: {
    en: 'The Maclaurin series sin(x) = x − x³/3! + x⁵/5! − x⁷/7! + ... is credited to Brook Taylor (1715) and Colin Maclaurin (1742). Madhava derived this series around 1400 CE, including the cosine series and the arctangent series. The Kerala texts contain not just the results but full proofs — using geometric limits that are logically equivalent to modern epsilon-delta proofs of convergence.',
    hi: 'Maclaurin श्रेणी sin(x) = x − x³/3! + x⁵/5! − x⁷/7! + ... का श्रेय ब्रुक टेलर (1715) और कॉलिन Maclaurin (1742) को दिया जाता है। माधव ने इस श्रेणी को लगभग 1400 CE में व्युत्पन्न किया — cosine श्रेणी और arctangent श्रेणी सहित। केरल ग्रंथों में न केवल परिणाम हैं बल्कि पूर्ण प्रमाण हैं — ज्यामितीय सीमाओं का उपयोग करके जो तार्किक रूप से अभिसरण के आधुनिक एप्सिलॉन-डेल्टा प्रमाणों के समकक्ष हैं।',
  },

  s4Title: {
    en: 'The Kerala School — A 200-Year Mathematical Dynasty',
    hi: 'केरल स्कूल — 200 वर्षीय गणितीय राजवंश',
  },
  s4Body: {
    en: 'Madhava\'s tradition was carried forward by a remarkable chain of scholars. Each built on the previous, extending the mathematics further. The last major figure, Sankara Variyar (~1556), produced commentaries showing a deep understanding of infinite series convergence and what we now call calculus of variations.',
    hi: 'माधव की परंपरा विद्वानों की एक उल्लेखनीय श्रृंखला द्वारा आगे बढ़ाई गई। प्रत्येक ने पिछले पर निर्माण किया, गणित को और आगे बढ़ाया। अंतिम प्रमुख व्यक्ति, शंकर वारियर (~1556), ने टिप्पणियाँ उत्पन्न कीं जो अनंत श्रेणी अभिसरण और जिसे हम अब कलन विविधताओं का कलन कहते हैं, की गहरी समझ दर्शाती हैं।',
  },

  s5Title: {
    en: 'The Kerala–Europe Transmission Question',
    hi: 'केरल-यूरोप संचरण प्रश्न',
  },
  s5Body: {
    en: 'Did Madhava\'s results reach Europe before Newton? Historians have found intriguing circumstantial evidence: Jesuit missionaries were extensively active in Kerala from the 1500s, the same period when the Kerala texts were being written. The Jesuit college in Cochin had a library of Indian manuscripts. Mathematicians like Marin Mersenne corresponded with Jesuits from India. However, no direct smoking gun exists. The question remains genuinely open. What is not debatable: the priority of discovery is Indian.',
    hi: 'क्या माधव के परिणाम न्यूटन से पहले यूरोप पहुँचे? इतिहासकारों ने आकर्षक परिस्थितिजन्य साक्ष्य पाए हैं: जेसुइट मिशनरी 1500 के दशक से केरल में व्यापक रूप से सक्रिय थे, उसी अवधि में जब केरल ग्रंथ लिखे जा रहे थे। कोचीन में जेसुइट कॉलेज में भारतीय पांडुलिपियों का पुस्तकालय था। मरीन मेर्सेन जैसे गणितज्ञों ने भारत के जेसुइट से पत्राचार किया। हालाँकि, कोई प्रत्यक्ष ठोस सबूत नहीं है। प्रश्न वास्तव में खुला रहता है। जो बहस योग्य नहीं है: खोज की प्राथमिकता भारतीय है।',
  },

  s6Title: {
    en: 'How Kerala Mathematics Benefits Our Panchang',
    hi: 'केरल गणित हमारे पंचांग को कैसे लाभान्वित करता है',
  },
  s6Body: {
    en: 'Every time you request today\'s Panchang, the server computes sine and cosine of planetary longitudes using series approximations. These approximations — Taylor series for trigonometric functions — trace directly back to Madhava\'s work. The Nilakantha-Somayaji planetary model (1501 CE) was also the first accurate model of Mercury and Venus\'s motion as heliocentric orbits viewed from Earth — a correct geometric insight that preceded Kepler\'s ellipses by 100 years.',
    hi: 'जब भी आप आज का पंचांग मांगते हैं, सर्वर श्रेणी सन्निकटन (series approximations) का उपयोग करके ग्रहीय देशान्तरों की sine और cosine की गणना करता है। ये सन्निकटन — त्रिकोणमितीय कार्यों के लिए टेलर श्रेणी — सीधे माधव के कार्य से पता लगाते हैं। नीलकंठ-सोमयाजी ग्रहीय मॉडल (1501 CE) भी पृथ्वी से देखे गए बुध और शुक्र की गति का पहला सटीक मॉडल था जो सूर्य-केंद्रित कक्षाओं के रूप में — एक सही ज्यामितीय अंतर्दृष्टि जो केप्लर की दीर्घवृत्तों से 100 वर्ष पहले थी।',
  },

  s7Title: { en: 'The Three Key Texts', hi: 'तीन प्रमुख ग्रंथ', sa: 'तीन प्रमुख ग्रंथ', mai: 'तीन प्रमुख ग्रंथ', mr: 'तीन प्रमुख ग्रंथ', ta: 'The Three Key Texts', te: 'The Three Key Texts', bn: 'The Three Key Texts', kn: 'The Three Key Texts', gu: 'The Three Key Texts' },

  backLink: { en: '← Back to Learn', hi: '← सीखने पर वापस', sa: '← सीखने पर वापस', mai: '← सीखने पर वापस', mr: '← सीखने पर वापस', ta: '← Back to Learn', te: '← Back to Learn', bn: '← Back to Learn', kn: '← Back to Learn', gu: '← Back to Learn' },
  prevPage: { en: 'Earth Rotation (499 CE)', hi: 'पृथ्वी का घूर्णन (499 CE)', sa: 'पृथ्वी का घूर्णन (499 CE)', mai: 'पृथ्वी का घूर्णन (499 CE)', mr: 'पृथ्वी का घूर्णन (499 CE)', ta: 'Earth Rotation (499 CE)', te: 'Earth Rotation (499 CE)', bn: 'Earth Rotation (499 CE)', kn: 'Earth Rotation (499 CE)', gu: 'Earth Rotation (499 CE)' },
  nextPage: { en: 'Speed of Light', hi: 'प्रकाश की गति', sa: 'प्रकाश की गति', mai: 'प्रकाश की गति', mr: 'प्रकाश की गति', ta: 'Speed of Light', te: 'Speed of Light', bn: 'Speed of Light', kn: 'Speed of Light', gu: 'Speed of Light' },
};

const SCHOOL_CHAIN = [
  { name: 'Madhava', years: 'c. 1340–1425 CE', contrib: { en: 'π series, sin/cos/arctan series, correction terms', hi: 'π श्रेणी, sin/cos/arctan श्रेणी, सुधार पद', sa: 'π श्रेणी, sin/cos/arctan श्रेणी, सुधार पद', mai: 'π श्रेणी, sin/cos/arctan श्रेणी, सुधार पद', mr: 'π श्रेणी, sin/cos/arctan श्रेणी, सुधार पद', ta: 'π series, sin/cos/arctan series, correction terms', te: 'π series, sin/cos/arctan series, correction terms', bn: 'π series, sin/cos/arctan series, correction terms', kn: 'π series, sin/cos/arctan series, correction terms', gu: 'π series, sin/cos/arctan series, correction terms' } },
  { name: 'Parameshvara', years: 'c. 1380–1460 CE', contrib: { en: 'Drigganita system, eclipse observations, mean motion corrections', hi: 'दृग्गणित प्रणाली, ग्रहण अवलोकन, मध्यम गति सुधार', sa: 'दृग्गणित प्रणाली, ग्रहण अवलोकन, मध्यम गति सुधार', mai: 'दृग्गणित प्रणाली, ग्रहण अवलोकन, मध्यम गति सुधार', mr: 'दृग्गणित प्रणाली, ग्रहण अवलोकन, मध्यम गति सुधार', ta: 'Drigganita system, eclipse observations, mean motion corrections', te: 'Drigganita system, eclipse observations, mean motion corrections', bn: 'Drigganita system, eclipse observations, mean motion corrections', kn: 'Drigganita system, eclipse observations, mean motion corrections', gu: 'Drigganita system, eclipse observations, mean motion corrections' } },
  { name: 'Nilakantha Somayaji', years: 'c. 1444–1544 CE', contrib: { en: 'Tantrasangraha (1501) — revised planetary model, partial heliocentrism', hi: 'तंत्रसंग्रह (1501) — संशोधित ग्रहीय मॉडल, आंशिक सौर-केंद्रवाद', sa: 'तंत्रसंग्रह (1501) — संशोधित ग्रहीय मॉडल, आंशिक सौर-केंद्रवाद', mai: 'तंत्रसंग्रह (1501) — संशोधित ग्रहीय मॉडल, आंशिक सौर-केंद्रवाद', mr: 'तंत्रसंग्रह (1501) — संशोधित ग्रहीय मॉडल, आंशिक सौर-केंद्रवाद', ta: 'Tantrasangraha (1501) — revised planetary model, partial heliocentrism', te: 'Tantrasangraha (1501) — revised planetary model, partial heliocentrism', bn: 'Tantrasangraha (1501) — revised planetary model, partial heliocentrism', kn: 'Tantrasangraha (1501) — revised planetary model, partial heliocentrism', gu: 'Tantrasangraha (1501) — revised planetary model, partial heliocentrism' } },
  { name: 'Jyeshthadeva', years: 'c. 1500–1575 CE', contrib: { en: 'Yuktibhasha — full proofs of all Kerala results in Malayalam', hi: 'युक्तिभाषा — मलयालम में सभी केरल परिणामों के पूर्ण प्रमाण', sa: 'युक्तिभाषा — मलयालम में सभी केरल परिणामों के पूर्ण प्रमाण', mai: 'युक्तिभाषा — मलयालम में सभी केरल परिणामों के पूर्ण प्रमाण', mr: 'युक्तिभाषा — मलयालम में सभी केरल परिणामों के पूर्ण प्रमाण', ta: 'Yuktibhasha — full proofs of all Kerala results in Malayalam', te: 'Yuktibhasha — full proofs of all Kerala results in Malayalam', bn: 'Yuktibhasha — full proofs of all Kerala results in Malayalam', kn: 'Yuktibhasha — full proofs of all Kerala results in Malayalam', gu: 'Yuktibhasha — full proofs of all Kerala results in Malayalam' } },
  { name: 'Citrabhanu', years: 'c. 1475–1550 CE', contrib: { en: 'Algebraic solutions to pairs of equations', hi: 'समीकरणों के युग्मों के बीजगणितीय हल', sa: 'समीकरणों के युग्मों के बीजगणितीय हल', mai: 'समीकरणों के युग्मों के बीजगणितीय हल', mr: 'समीकरणों के युग्मों के बीजगणितीय हल', ta: 'Algebraic solutions to pairs of equations', te: 'Algebraic solutions to pairs of equations', bn: 'Algebraic solutions to pairs of equations', kn: 'Algebraic solutions to pairs of equations', gu: 'Algebraic solutions to pairs of equations' } },
  { name: 'Sankara Variyar', years: 'c. 1500–1556 CE', contrib: { en: 'Commentaries synthesizing the full Kerala tradition', hi: 'पूर्ण केरल परंपरा को संश्लेषित करने वाली टिप्पणियाँ', sa: 'पूर्ण केरल परंपरा को संश्लेषित करने वाली टिप्पणियाँ', mai: 'पूर्ण केरल परंपरा को संश्लेषित करने वाली टिप्पणियाँ', mr: 'पूर्ण केरल परंपरा को संश्लेषित करने वाली टिप्पणियाँ', ta: 'Commentaries synthesizing the full Kerala tradition', te: 'Commentaries synthesizing the full Kerala tradition', bn: 'Commentaries synthesizing the full Kerala tradition', kn: 'Commentaries synthesizing the full Kerala tradition', gu: 'Commentaries synthesizing the full Kerala tradition' } },
];

const SERIES_COMPARISON = [
  {
    name: 'π series',
    formula: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + ...',
    india: { who: 'Madhava', when: 'c. 1375 CE' },
    europe: { who: 'Leibniz', when: '1676 CE' },
    gap: '~300 years',
  },
  {
    name: 'Sine series',
    formula: 'sin x = x − x³/3! + x⁵/5! − ...',
    india: { who: 'Madhava', when: 'c. 1400 CE' },
    europe: { who: 'Taylor / Maclaurin', when: '1715–1742 CE' },
    gap: '~315–342 years',
  },
  {
    name: 'Cosine series',
    formula: 'cos x = 1 − x²/2! + x⁴/4! − ...',
    india: { who: 'Madhava', when: 'c. 1400 CE' },
    europe: { who: 'Taylor / Maclaurin', when: '1715–1742 CE' },
    gap: '~315–342 years',
  },
  {
    name: 'Arctangent series',
    formula: 'arctan x = x − x³/3 + x⁵/5 − ...',
    india: { who: 'Madhava', when: 'c. 1400 CE' },
    europe: { who: 'James Gregory', when: '1671 CE' },
    gap: '~271 years',
  },
];

const KEY_TEXTS = [
  {
    title: 'Tantrasangraha (तंत्रसंग्रह)',
    author: 'Nilakantha Somayaji',
    year: '1501 CE',
    lang: 'Sanskrit',
    desc: { en: 'Revised planetary model with partial heliocentric framework. First accurate model of Mercury and Venus orbits.', hi: 'आंशिक सौर-केंद्रित ढाँचे के साथ संशोधित ग्रहीय मॉडल। बुध और शुक्र कक्षाओं का पहला सटीक मॉडल।', sa: 'आंशिक सौर-केंद्रित ढाँचे के साथ संशोधित ग्रहीय मॉडल। बुध और शुक्र कक्षाओं का पहला सटीक मॉडल।', mai: 'आंशिक सौर-केंद्रित ढाँचे के साथ संशोधित ग्रहीय मॉडल। बुध और शुक्र कक्षाओं का पहला सटीक मॉडल।', mr: 'आंशिक सौर-केंद्रित ढाँचे के साथ संशोधित ग्रहीय मॉडल। बुध और शुक्र कक्षाओं का पहला सटीक मॉडल।', ta: 'Revised planetary model with partial heliocentric framework. First accurate model of Mercury and Venus orbits.', te: 'Revised planetary model with partial heliocentric framework. First accurate model of Mercury and Venus orbits.', bn: 'Revised planetary model with partial heliocentric framework. First accurate model of Mercury and Venus orbits.', kn: 'Revised planetary model with partial heliocentric framework. First accurate model of Mercury and Venus orbits.', gu: 'Revised planetary model with partial heliocentric framework. First accurate model of Mercury and Venus orbits.' },
  },
  {
    title: 'Yuktibhasha (युक्तिभाषा)',
    author: 'Jyeshthadeva',
    year: '~1530 CE',
    lang: 'Malayalam',
    desc: { en: 'Contains full proofs of the infinite series for π and trig functions. First mathematics text to provide proofs in a vernacular language.', hi: 'π और त्रिकोणमितीय कार्यों के लिए अनंत श्रेणी के पूर्ण प्रमाण। एक स्थानीय भाषा में प्रमाण प्रदान करने वाला पहला गणित ग्रंथ।', sa: 'π और त्रिकोणमितीय कार्यों के लिए अनंत श्रेणी के पूर्ण प्रमाण। एक स्थानीय भाषा में प्रमाण प्रदान करने वाला पहला गणित ग्रंथ।', mai: 'π और त्रिकोणमितीय कार्यों के लिए अनंत श्रेणी के पूर्ण प्रमाण। एक स्थानीय भाषा में प्रमाण प्रदान करने वाला पहला गणित ग्रंथ।', mr: 'π और त्रिकोणमितीय कार्यों के लिए अनंत श्रेणी के पूर्ण प्रमाण। एक स्थानीय भाषा में प्रमाण प्रदान करने वाला पहला गणित ग्रंथ।', ta: 'Contains full proofs of the infinite series for π and trig functions. First mathematics text to provide proofs in a vernacular language.', te: 'Contains full proofs of the infinite series for π and trig functions. First mathematics text to provide proofs in a vernacular language.', bn: 'Contains full proofs of the infinite series for π and trig functions. First mathematics text to provide proofs in a vernacular language.', kn: 'Contains full proofs of the infinite series for π and trig functions. First mathematics text to provide proofs in a vernacular language.', gu: 'Contains full proofs of the infinite series for π and trig functions. First mathematics text to provide proofs in a vernacular language.' },
  },
  {
    title: 'Sadratnamala (सद्रत्नमाला)',
    author: 'Sankara Varman',
    year: '1819 CE',
    lang: 'Sanskrit',
    desc: { en: 'Last major Kerala text. Contains series for π accurate to 17 decimal places — computed before modern computers.', hi: 'अंतिम प्रमुख केरल ग्रंथ। 17 दशमलव स्थानों तक सटीक π की श्रेणी — आधुनिक कंप्यूटर से पहले गणित।', sa: 'अंतिम प्रमुख केरल ग्रंथ। 17 दशमलव स्थानों तक सटीक π की श्रेणी — आधुनिक कंप्यूटर से पहले गणित।', mai: 'अंतिम प्रमुख केरल ग्रंथ। 17 दशमलव स्थानों तक सटीक π की श्रेणी — आधुनिक कंप्यूटर से पहले गणित।', mr: 'अंतिम प्रमुख केरल ग्रंथ। 17 दशमलव स्थानों तक सटीक π की श्रेणी — आधुनिक कंप्यूटर से पहले गणित।', ta: 'Last major Kerala text. Contains series for π accurate to 17 decimal places — computed before modern computers.', te: 'Last major Kerala text. Contains series for π accurate to 17 decimal places — computed before modern computers.', bn: 'Last major Kerala text. Contains series for π accurate to 17 decimal places — computed before modern computers.', kn: 'Last major Kerala text. Contains series for π accurate to 17 decimal places — computed before modern computers.', gu: 'Last major Kerala text. Contains series for π accurate to 17 decimal places — computed before modern computers.' },
  },
];

export default async function CalculusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (obj: LocaleText | Record<string, string>) => tl(obj, locale);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{l(L.title)}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{l(L.subtitle)}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={l(L.title)} locale={locale} />
        </div>
      </div>

      {/* ── Section 1: Who Was Madhava ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s1Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s1Body)}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Born', hi: 'जन्म', sa: 'जन्म', mai: 'जन्म', mr: 'जन्म', ta: 'Born', te: 'Born', bn: 'Born', kn: 'Born', gu: 'Born' }, value: 'c. 1340 CE' },
            { label: { en: 'Died', hi: 'निधन', sa: 'निधन', mai: 'निधन', mr: 'निधन', ta: 'Died', te: 'Died', bn: 'Died', kn: 'Died', gu: 'Died' }, value: 'c. 1425 CE' },
            { label: { en: 'Location', hi: 'स्थान', sa: 'स्थान', mai: 'स्थान', mr: 'स्थान', ta: 'Location', te: 'Location', bn: 'Location', kn: 'Location', gu: 'Location' }, value: 'Sangamagrama, Kerala' },
            { label: { en: 'School founded', hi: 'स्कूल स्थापित', sa: 'स्कूल स्थापित', mai: 'स्कूल स्थापित', mr: 'स्कूल स्थापित', ta: 'School founded', te: 'School founded', bn: 'School founded', kn: 'School founded', gu: 'School founded' }, value: '~1375 CE' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{l(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: π Series ──────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s2Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s2Body)}</p>

        {/* Formula display */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4 text-center">
          <p className="text-xs text-text-secondary mb-2">{isHi ? 'माधव की π श्रेणी (~1375 CE)' : "Madhava's π Series (~1375 CE)"}</p>
          <p className="text-gold-light text-lg font-mono">π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...</p>
          <p className="text-text-secondary text-xs mt-2">{isHi ? 'पश्चिम में "लाइबनिज फॉर्मूला" कहा जाता है, 1676 CE' : 'Called "Leibniz formula" in the West, 1676 CE'}</p>
        </div>

        <div className="p-4 rounded-xl bg-gold-primary/6 border-l-4 border-gold-primary/50">
          <p className="text-text-secondary text-xs font-semibold mb-1">{isHi ? 'युक्तिभाषा (Yuktibhasha), ~1530 CE' : 'Yuktibhasha (~1530 CE)'}</p>
          <p className="text-text-secondary text-xs">{l(L.s2Source)}</p>
        </div>
      </div>

      {/* ── Priority Comparison Table ────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s3Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s3Body)}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'श्रेणी' : 'Series'}</th>
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'भारत में' : 'India'}</th>
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'यूरोप में' : 'Europe'}</th>
                <th className="text-right text-gold-light py-2">{isHi ? 'अंतर' : 'Gap'}</th>
              </tr>
            </thead>
            <tbody>
              {SERIES_COMPARISON.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="py-2 pr-3">
                    <div className="text-text-primary font-semibold">{row.name}</div>
                    <div className="text-text-secondary font-mono text-xs mt-0.5">{row.formula}</div>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="text-emerald-400 font-semibold">{row.india.who}</div>
                    <div className="text-text-secondary">{row.india.when}</div>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="text-text-secondary">{row.europe.who}</div>
                    <div className="text-text-secondary">{row.europe.when}</div>
                  </td>
                  <td className="text-right py-2 text-amber-400 font-bold">{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 4: The School Chain ─────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{l(L.s4Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s4Body)}</p>

        <div className="space-y-3">
          {SCHOOL_CHAIN.map((person, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-white/[0.02] border border-gold-primary/8">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-light font-bold text-sm">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-primary font-semibold text-sm">{person.name}</span>
                  <span className="text-text-secondary text-xs">{person.years}</span>
                </div>
                <div className="text-text-secondary text-xs mt-1">{l(person.contrib)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: Transmission ─────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s5Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s5Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <p className="text-amber-300 font-semibold text-xs mb-2">{isHi ? 'संभावित संचरण साक्ष्य' : 'Possible Transmission Evidence'}</p>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {isHi ? '1500 CE से केरल में जेसुइट उपस्थिति' : 'Jesuit presence in Kerala from ~1500 CE'}</li>
              <li>• {isHi ? 'कोचीन जेसुइट कॉलेज — भारतीय पांडुलिपियाँ' : 'Jesuit College at Cochin — Indian manuscripts'}</li>
              <li>• {isHi ? 'मेर्सेन ↔ भारत जेसुइट पत्राचार' : 'Mersenne ↔ India Jesuit correspondence'}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <p className="text-emerald-300 font-semibold text-xs mb-2">{isHi ? 'जो निर्विवाद है' : 'What Is Undisputed'}</p>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {isHi ? 'माधव के परिणाम — 250-350 वर्ष पहले' : "Madhava's results are 250–350 years earlier"}</li>
              <li>• {isHi ? 'केरल ग्रंथों में पूर्ण प्रमाण हैं' : 'Kerala texts contain full proofs'}</li>
              <li>• {isHi ? 'खोज की प्राथमिकता भारतीय है' : 'Priority of discovery is Indian'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Section 6: App Connection ──────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s6Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{l(L.s6Body)}</p>
      </div>

      {/* ── Section 7: Key Texts ─────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{l(L.s7Title)}</h3>
        <div className="space-y-4">
          {KEY_TEXTS.map((text, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/12">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                <div>
                  <span className="text-gold-light font-semibold text-sm">{text.title}</span>
                  <span className="text-text-secondary text-xs ml-2">— {text.author}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-light">{text.year}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-secondary">{text.lang}</span>
                </div>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{l(text.desc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {l(L.backLink)}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/earth-rotation" className="px-4 py-2 rounded-xl bg-gold-primary/10 border border-gold-primary/15 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
            ← {l(L.prevPage)}
          </Link>
          <Link href="/learn/contributions/speed-of-light" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.nextPage)} →
          </Link>
        </div>
      </div>

    </div>
  );
}
