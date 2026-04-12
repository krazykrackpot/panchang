import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Music } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';

/* ═══════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ═══════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: "The 'Fibonacci' Sequence Was Indian — And It Started With Music",
    hi: '"फिबोनाची" अनुक्रम भारतीय था — और यह संगीत से शुरू हुआ',
  },
  subtitle: {
    en: "1, 1, 2, 3, 5, 8, 13, 21... Every textbook calls this \"Fibonacci's sequence.\" But the earliest known description comes from Bharata Muni's Natyashastra (~200 BCE) — in the context of musical rhythm patterns. Later, Virahanka (~600 CE) and Hemachandra (1150 CE) formalized it for Sanskrit poetic meters — all centuries before Fibonacci (1202 CE).",
    hi: '1, 1, 2, 3, 5, 8, 13, 21... हर पाठ्यपुस्तक इसे "फिबोनाची का अनुक्रम" कहती है। लेकिन सबसे पुराना ज्ञात विवरण भरत मुनि की नाट्यशास्त्र (~200 ईसा पूर्व) से आता है — संगीत लय पैटर्न के संदर्भ में। बाद में, विरहांका (~600 ईस्वी) और हेमचंद्र (1150 ईस्वी) ने इसे संस्कृत काव्य छंदों के लिए औपचारिक रूप दिया — फिबोनाची (1202 ईस्वी) से सदियों पहले।',
  },

  s1Title: {
    en: 'Bharata Muni & the Natyashastra (~200 BCE) — The World\'s Earliest Discovery',
    hi: 'भरत मुनि और नाट्यशास्त्र (~200 ईसा पूर्व) — विश्व की सबसे पुरानी खोज',
  },
  s1Body: {
    en: "The Natyashastra is the world's first and most comprehensive treatise on performing arts — theatre, dance, music, and poetics. Written by Bharata Muni around 200 BCE, it covers 6,000 verses across 36 chapters. In describing tala (rhythmic cycles), Bharata Muni enumerated all possible combinations of short (druta/laghu) and long (vilambit/guru) beats that can fill a rhythmic cycle of N matras (time units). The number of such combinations follows the exact Fibonacci pattern: for 1 matra = 1 way, 2 matras = 2 ways, 3 matras = 3 ways, 4 matras = 5 ways, 5 matras = 8 ways... This is the EARLIEST known occurrence of the sequence on Earth — and it arose from MUSIC, not mathematics. The same text contains the 22 shrutis (microtonal intervals) that form the mathematical foundation of Indian classical music — a system of musical mathematics that remains unparalleled.",
    hi: 'नाट्यशास्त्र प्रदर्शन कलाओं पर विश्व का पहला और सबसे व्यापक ग्रंथ है — रंगमंच, नृत्य, संगीत और काव्यशास्त्र। भरत मुनि द्वारा लगभग 200 ईसा पूर्व लिखित, इसमें 36 अध्यायों में 6,000 श्लोक हैं। ताल (लयबद्ध चक्र) का वर्णन करते हुए, भरत मुनि ने N मात्राओं (समय इकाइयों) के लयबद्ध चक्र को भरने वाले लघु और गुरु बीट्स के सभी संभावित संयोजनों की गणना की। ऐसे संयोजनों की संख्या फिबोनाची पैटर्न का अनुसरण करती है। यह पृथ्वी पर अनुक्रम की सबसे पुरानी ज्ञात घटना है — और यह गणित से नहीं, संगीत से उत्पन्न हुई।',
  },

  s2Title: {
    en: 'Pingala & Chandahshastra (~200 BCE) — From Music to Prosody',
    hi: 'पिंगल और छन्दशास्त्र (~200 ईसा पूर्व) — संगीत से काव्यशास्त्र तक',
  },
  s2Body: {
    en: "Around the same period (~200 BCE), the scholar Pingala wrote the Chandahshastra — the foundational text of Sanskrit prosody (the science of poetic meter). He developed a binary encoding of syllables: laghu (light, short = 0) and guru (heavy, long = 1). Any sequence of L laghu and G guru syllables gives 2^(L+G) possible meters. In examining how many ways you can arrange syllables to produce a meter of N beats, the count again follows the Fibonacci sequence. Pingala also discovered the Meruprastara — Mount Meru's Triangle — which is what the West calls Pascal's Triangle, predating Pascal by 1,800 years. The diagonal sums of the Meruprastara are exactly the Fibonacci numbers.",
    hi: 'लगभग उसी काल (~200 ईसा पूर्व) में, विद्वान पिंगल ने छन्दशास्त्र लिखा — संस्कृत छंद-विज्ञान का मूल ग्रंथ। उन्होंने अक्षरों का द्विआधारी एन्कोडिंग विकसित किया: लघु (छोटा = 0) और गुरु (लंबा = 1)। पिंगल ने मेरुप्रस्तार भी खोजा — मेरु पर्वत का त्रिभुज — जिसे पश्चिम पास्कल त्रिभुज कहता है, पास्कल से 1,800 साल पहले। मेरुप्रस्तार के विकर्ण योग ठीक फिबोनाची संख्याएँ हैं।',
  },

  s3Title: {
    en: 'Virahanka (~600 CE) — The First Explicit Recurrence Relation',
    hi: 'विरहांका (~600 ईस्वी) — पहला स्पष्ट पुनरावृत्ति संबंध',
  },
  s3Body: {
    en: "The Sanskrit scholar Virahanka (around 600 CE) wrote the Vrittajatisamuccaya — a text on poetic forms. He was the first to state the Fibonacci recurrence relation EXPLICITLY, in Sanskrit: the count for N matras equals the sum of the counts for (N−1) and (N−2) matras. This is F(n) = F(n−1) + F(n−2) — the defining recurrence relation. Pingala observed the pattern; Virahanka named the mechanism. His original Sanskrit reads: the next count in the sequence is obtained by adding the two preceding counts. He listed the first terms of the sequence and verified the rule holds throughout. This is 600 years before Fibonacci and contains everything modern mathematicians associate with Fibonacci's contribution.",
    hi: 'संस्कृत विद्वान विरहांका (लगभग 600 ईस्वी) ने वृत्तजातिसमुच्चय लिखा — काव्य रूपों पर एक ग्रंथ। वे फिबोनाची पुनरावृत्ति संबंध को स्पष्ट रूप से कहने वाले पहले थे: N मात्राओं की गिनती (N−1) और (N−2) मात्राओं की गिनती के योग के बराबर है। यह F(n) = F(n−1) + F(n−2) है। पिंगल ने पैटर्न देखा; विरहांका ने तंत्र को नाम दिया। यह फिबोनाची से 600 साल पहले है।',
  },

  s4Title: {
    en: 'Hemachandra (1150 CE) — Independent Derivation, 52 Years Before Fibonacci',
    hi: 'हेमचंद्र (1150 ईस्वी) — स्वतंत्र व्युत्पत्ति, फिबोनाची से 52 साल पहले',
  },
  s4Body: {
    en: "The Jain mathematician and polymath Hemachandra (1089–1172 CE) independently derived the same sequence in his Chandonushasana (a treatise on prosody), writing that the number of meters of length N equals the sum of meters of lengths (N−1) and (N−2). He gave the same explicit recurrence. He wrote this around 1150 CE — just 52 years before Fibonacci's Liber Abaci (1202 CE). Hemachandra was working in the same Indian tradition that had known this sequence for 1,300 years. Fibonacci encountered it in North Africa through Arabic sources. The sequence is known as the Hemachandra-Fibonacci sequence in some modern mathematical histories — a fairer attribution.",
    hi: 'जैन गणितज्ञ और विद्वान हेमचंद्र (1089–1172 ईस्वी) ने स्वतंत्र रूप से अपने छन्दोनुशासन में उसी अनुक्रम को व्युत्पन्न किया। उन्होंने यह लगभग 1150 ईस्वी में लिखा — फिबोनाची की लिबर अबासी (1202 ईस्वी) से मात्र 52 साल पहले। कुछ आधुनिक गणितीय इतिहासों में इस अनुक्रम को हेमचंद्र-फिबोनाची अनुक्रम के रूप में जाना जाता है — एक अधिक उचित श्रेय।',
  },

  s5Title: {
    en: 'How Fibonacci Got Credit — The Translation Chain',
    hi: 'फिबोनाची को श्रेय कैसे मिला — अनुवाद श्रृंखला',
  },
  s5Body: {
    en: "Leonardo of Pisa (Fibonacci) was not a plagiarist — he simply encountered Indian mathematics through the Arabic translation chain and introduced it to an audience that had never seen it. His father was a customs official in North Africa; Leonardo studied mathematics with Arab merchants who had access to translated Indian texts. His 1202 CE book Liber Abaci (Book of Calculation) presented the famous rabbit-breeding problem whose answer follows the Fibonacci sequence. He gets credit in the West because he was the first to publish it there, in a language Europeans read. But the sequence was already 1,400 years old by then — born in Indian music, refined in Indian poetry, and transmitted through Baghdad.",
    hi: 'पीसा के लियोनार्डो (फिबोनाची) साहित्यिक चोर नहीं थे — उन्होंने बस अरबी अनुवाद श्रृंखला के माध्यम से भारतीय गणित का सामना किया। उनके पिता उत्तरी अफ्रीका में एक सीमा शुल्क अधिकारी थे; लियोनार्डो ने उन अरब व्यापारियों के साथ गणित का अध्ययन किया जिनके पास अनुवादित भारतीय ग्रंथों तक पहुँच थी। उनकी 1202 ईस्वी की पुस्तक लिबर अबासी ने प्रसिद्ध खरगोश-प्रजनन समस्या प्रस्तुत की। वे पश्चिम में श्रेय पाते हैं क्योंकि वे वहाँ इसे प्रकाशित करने वाले पहले थे।',
  },

  s6Title: {
    en: 'The Sequence in Nature — Why It Appears Everywhere',
    hi: 'प्रकृति में अनुक्रम — यह हर जगह क्यों दिखता है',
  },
  s6Body: {
    en: "The reason the Fibonacci sequence appears throughout nature is deeply mathematical: it is the most efficient packing solution for organic growth. A sunflower arranges its seeds in 34 clockwise and 55 counterclockwise spirals — both Fibonacci numbers. Flower petals: 3 (lily), 5 (buttercup), 8 (delphinium), 13 (corn marigold), 21 (aster), 34 (plantain), 55 (daisy). The nautilus shell grows in a logarithmic spiral with ratio φ (phi = 1.618...) — the golden ratio, approached by successive Fibonacci fractions: 1/1, 2/1, 3/2, 5/3, 8/5, 13/8... converging to φ. The Fibonacci sequence is nature's algorithm for optimal growth — and India found it first, in the rhythms of music.",
    hi: 'फिबोनाची अनुक्रम प्रकृति में इसलिए दिखता है क्योंकि यह जैविक विकास के लिए सबसे कुशल पैकिंग समाधान है। एक सूरजमुखी अपने बीजों को 34 दक्षिणावर्त और 55 वामावर्त सर्पिलों में व्यवस्थित करता है — दोनों फिबोनाची संख्याएँ। फूलों की पंखुड़ियाँ: 3 (लिली), 5 (बटरकप), 8, 13, 21, 34, 55... नॉटिलस शेल अनुपात φ (फाई = 1.618...) के साथ एक लघुगणकीय सर्पिल में बढ़ता है। फिबोनाची अनुक्रम प्रकृति का एल्गोरिदम है — और भारत ने इसे पहले खोजा, संगीत की लय में।',
  },

  s7Title: {
    en: 'From Music to Mathematics — The Universal Pattern',
    hi: 'संगीत से गणित तक — सार्वभौमिक पैटर्न',
  },
  s7Body: {
    en: "The remarkable fact about the Fibonacci sequence is how the same mathematical pattern arises independently across radically different domains — and India discovered it in the most unexpected place: music. Bharata Muni found it in the rhythmic beats of tala. Pingala found it in the syllables of Sanskrit verse. Virahanka gave it its rule. Hemachandra calculated it further. Then nature expressed it in spirals and flowers. Modern finance sees it in Elliott wave theory. Computer science uses Fibonacci heaps and search algorithms. The sequence is not an artifact of how we count — it is a fundamental property of combinatorial growth, and it took a musical genius in ancient India to first notice it in the dance of rhythm.",
    hi: 'फिबोनाची अनुक्रम के बारे में उल्लेखनीय तथ्य यह है कि एक ही गणितीय पैटर्न बिल्कुल अलग क्षेत्रों में स्वतंत्र रूप से उत्पन्न होता है — और भारत ने इसे सबसे अप्रत्याशित स्थान पर खोजा: संगीत। भरत मुनि ने इसे ताल की लयबद्ध धड़कनों में पाया। पिंगल ने इसे संस्कृत कविता के अक्षरों में पाया। यह अनुक्रम गणनात्मक विकास का एक मूलभूत गुण है, और प्राचीन भारत में एक संगीत प्रतिभाशाली व्यक्ति ने पहले इसे लय के नृत्य में देखा।',
  },

  s8Title: { en: 'Classical Sources Timeline', hi: 'शास्त्रीय स्रोत समयरेखा' },
  s8Body: {
    en: "The full chain of Indian priority — from Bharata Muni's musical discovery to the final European encounter via Fibonacci:",
    hi: 'भारतीय प्राथमिकता की पूरी श्रृंखला — भरत मुनि की संगीत खोज से फिबोनाची के माध्यम से अंतिम यूरोपीय मुठभेड़ तक:',
  },

  backToContributions: { en: 'Back to Contributions', hi: 'योगदान पर वापस' },
  nextPage: { en: 'Next: Binary Numbers', hi: 'अगला: बाइनरी संख्याएँ' },
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const SEQUENCE_DEMO = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

const TALA_COMBOS = [
  { matras: 1, ways: 1, combos: ['S'] },
  { matras: 2, ways: 2, combos: ['SS', 'L'] },
  { matras: 3, ways: 3, combos: ['SSS', 'SL', 'LS'] },
  { matras: 4, ways: 5, combos: ['SSSS', 'SSL', 'SLS', 'LSS', 'LL'] },
  { matras: 5, ways: 8, combos: [] },
];

const TIMELINE = [
  {
    year: '~200 BCE',
    who: 'Bharata Muni',
    text: 'Natyashastra',
    event: { en: 'FIRST: Sequence emerges from tala (rhythmic cycle) analysis — musical discovery, 22 shrutis', hi: 'पहला: ताल विश्लेषण से अनुक्रम उभरता है — संगीत खोज, 22 श्रुतियाँ' },
    color: 'border-gold-primary/70',
    badge: { en: 'MUSIC', hi: 'संगीत' },
    badgeColor: 'bg-gold-primary/20 text-gold-primary',
  },
  {
    year: '~200 BCE',
    who: 'Pingala',
    text: 'Chandahshastra',
    event: { en: "Sequence in Sanskrit prosody (laghu/guru syllables); discovers Meruprastara (Pascal's Triangle) — diagonals give Fibonacci numbers", hi: 'संस्कृत छंद-विज्ञान में अनुक्रम (लघु/गुरु अक्षर); मेरुप्रस्तार की खोज — विकर्ण फिबोनाची संख्याएँ देते हैं' },
    color: 'border-amber-400/60',
    badge: { en: 'POETRY', hi: 'कविता' },
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    year: '~600 CE',
    who: 'Virahanka',
    text: 'Vrittajatisamuccaya',
    event: { en: 'First EXPLICIT recurrence relation: F(n) = F(n−1) + F(n−2) — the defining rule, stated clearly for the first time', hi: 'पहला स्पष्ट पुनरावृत्ति संबंध: F(n) = F(n−1) + F(n−2) — पहली बार स्पष्ट रूप से कहा गया' },
    color: 'border-emerald-400/60',
    badge: { en: 'RECURRENCE', hi: 'पुनरावृत्ति' },
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    year: '~1135 CE',
    who: 'Gopala',
    text: 'Commentary on Chandahshastra',
    event: { en: 'Further systematization of the sequence in prosody, extending to longer meters', hi: 'छंद-विज्ञान में अनुक्रम का आगे व्यवस्थितकरण' },
    color: 'border-blue-400/50',
    badge: { en: 'PROSODY', hi: 'छंद' },
    badgeColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    year: '1150 CE',
    who: 'Hemachandra',
    text: 'Chandonushasana',
    event: { en: 'Independent derivation — 52 years before Fibonacci. Full explicit statement of the recurrence. Sometimes called the Hemachandra-Fibonacci sequence.', hi: 'स्वतंत्र व्युत्पत्ति — फिबोनाची से 52 साल पहले। कभी-कभी हेमचंद्र-फिबोनाची अनुक्रम कहा जाता है।' },
    color: 'border-violet-400/60',
    badge: { en: '52 YRS EARLIER', hi: '52 साल पहले' },
    badgeColor: 'bg-violet-500/20 text-violet-400',
  },
  {
    year: '1202 CE',
    who: 'Leonardo Fibonacci',
    text: 'Liber Abaci',
    event: { en: "Introduces sequence to Europe via rabbit-breeding problem — 1,400 years after Bharata Muni. Gets naming credit in the West.", hi: 'खरगोश-प्रजनन समस्या के माध्यम से यूरोप में अनुक्रम पेश करता है — भरत मुनि के 1,400 साल बाद।' },
    color: 'border-red-400/40',
    badge: { en: 'EUROPE', hi: 'यूरोप' },
    badgeColor: 'bg-red-500/20 text-red-400',
  },
];

const NATURE_EXAMPLES = [
  { item: { en: 'Sunflower spirals', hi: 'सूरजमुखी सर्पिल' }, detail: { en: '34 clockwise, 55 counterclockwise', hi: '34 दक्षिणावर्त, 55 वामावर्त' } },
  { item: { en: 'Lily petals', hi: 'लिली की पंखुड़ियाँ' }, detail: { en: '3 petals', hi: '3 पंखुड़ियाँ' } },
  { item: { en: 'Buttercup petals', hi: 'बटरकप की पंखुड़ियाँ' }, detail: { en: '5 petals', hi: '5 पंखुड़ियाँ' } },
  { item: { en: 'Delphinium petals', hi: 'डेल्फीनियम पंखुड़ियाँ' }, detail: { en: '8 petals', hi: '8 पंखुड़ियाँ' } },
  { item: { en: 'Nautilus shell', hi: 'नॉटिलस शेल' }, detail: { en: 'phi = 1.618... golden ratio spiral', hi: 'phi = 1.618... स्वर्णिम अनुपात सर्पिल' } },
  { item: { en: 'Pine cone spirals', hi: 'पाइन शंकु सर्पिल' }, detail: { en: '8 and 13 spiral rows', hi: '8 और 13 सर्पिल पंक्तियाँ' } },
];

const SANSKRIT_TERMS = [
  { term: 'Tala', transliteration: 'tāla', meaning: 'rhythmic cycle — where Bharata Muni found the sequence', devanagari: 'ताल' },
  { term: 'Matra', transliteration: 'mātrā', meaning: 'time unit / beat in tala — the counting unit', devanagari: 'मात्रा' },
  { term: 'Laghu', transliteration: 'laghu', meaning: "light / short — short syllable or beat (= 0 in Pingala's binary)", devanagari: 'लघु' },
  { term: 'Guru', transliteration: 'guru', meaning: "heavy / long — long syllable or beat (= 1 in Pingala's binary)", devanagari: 'गुरु' },
  { term: 'Meruprastara', transliteration: 'Meru-prastāra', meaning: "Mount Meru's Triangle — Pascal's triangle, 1,800 years before Pascal", devanagari: 'मेरुप्रस्तार' },
  { term: 'Natyashastra', transliteration: 'Nāṭya-śāstra', meaning: 'Treatise on Performing Arts by Bharata Muni (~200 BCE)', devanagari: 'नाट्यशास्त्र' },
  { term: 'Chandahshastra', transliteration: 'Chandaḥ-śāstra', meaning: 'Treatise on Prosody by Pingala (~200 BCE)', devanagari: 'छन्दशास्त्र' },
  { term: 'Shruti', transliteration: 'śruti', meaning: '22 microtonal intervals — the mathematical foundation of Indian music in Natyashastra', devanagari: 'श्रुति' },
];

/* ═══════════════════════════════════════════════════════════════
   MERUPRASTARA SVG
   ═══════════════════════════════════════════════════════════════ */
function MeruprastaraSVG({ hi }: { hi: boolean }) {
  const rows = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1],
  ];

  // Highlight the shallow diagonals that sum to Fibonacci numbers
  const fibHighlight: Set<string> = new Set([
    '0-0',
    '1-0',
    '0-1', '2-0',
    '1-1', '0-2', '3-0',
    '2-1', '1-2', '0-3', '4-0',
    '3-1', '2-2', '1-3', '0-4', '5-0',
  ]);

  const cellW = 44;
  const cellH = 38;
  const totalCols = 6;
  const svgW = totalCols * cellW + 20;
  const svgH = rows.length * cellH + 20;

  return (
    <div className="overflow-x-auto">
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="mx-auto"
      >
        {rows.map((row, r) => {
          const offsetX = ((totalCols - row.length) * cellW) / 2 + 10;
          return row.map((val, c) => {
            const x = offsetX + c * cellW;
            const y = r * cellH + 10;
            const isHighlighted = fibHighlight.has(`${r}-${c}`);
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={cellW - 4}
                  height={cellH - 4}
                  rx={5}
                  fill={isHighlighted ? 'rgba(212,168,83,0.18)' : 'rgba(255,255,255,0.03)'}
                  stroke={isHighlighted ? 'rgba(212,168,83,0.5)' : 'rgba(255,255,255,0.08)'}
                  strokeWidth={1}
                />
                <text
                  x={x + cellW / 2}
                  y={y + cellH / 2 + 4}
                  textAnchor="middle"
                  fontSize={isHighlighted ? 13 : 11}
                  fontWeight={isHighlighted ? 'bold' : 'normal'}
                  fill={isHighlighted ? '#f0d48a' : '#8a8478'}
                >
                  {val}
                </text>
              </g>
            );
          });
        })}
      </svg>
      <div className="text-center mt-2 text-xs text-text-secondary/60">
        {hi
          ? 'मेरुप्रस्तार — सोने में हाइलाइट किए गए विकर्ण: 1, 1, 2, 3, 5, 8... (फिबोनाची)'
          : 'Meruprastara — diagonals highlighted in gold: 1, 1, 2, 3, 5, 8... (Fibonacci)'}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default async function FibonacciPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const hi = locale === 'hi';
  const t = (obj: { en: string; hi: string }) => hi ? obj.hi : obj.en;

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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-primary/30 to-amber-500/10 border border-gold-primary/30 flex items-center justify-center">
                <Music className="w-10 h-10 text-gold-primary" />
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

          {/* sequence display */}
          <div
            className="mt-10"
          >
            <div className="inline-flex flex-wrap justify-center gap-1 sm:gap-2 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl px-6 py-5">
              {SEQUENCE_DEMO.map((n, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center"
                >
                  <span
                    className="text-2xl sm:text-3xl font-black text-gold-primary"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {n}
                  </span>
                </div>
              ))}
              <div
                className="flex items-center text-gold-primary/50 text-2xl font-bold pl-1"
              >
                ...
              </div>
            </div>
            <div className="text-text-secondary/60 text-xs mt-3">
              {hi
                ? 'भरत मुनि (~200 ईसा पूर्व) → पिंगल (~200 ईसा पूर्व) → विरहांका (~600 ईस्वी) → हेमचंद्र (1150 ईस्वी) → फिबोनाची (1202 ईस्वी)'
                : 'Bharata Muni (~200 BCE) → Pingala (~200 BCE) → Virahanka (~600 CE) → Hemachandra (1150 CE) → Fibonacci (1202 CE)'}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1 — BHARATA MUNI ═══ */}
        <LessonSection number={1} title={t(L.s1Title)} variant="highlight">
          <div className="mb-4 inline-flex items-center gap-2 bg-gold-primary/15 border border-gold-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-gold-light uppercase tracking-wider">
            {hi ? 'सबसे पुरानी खोज — संगीत से' : 'Earliest Discovery — From Music'}
          </div>
          <p>{t(L.s1Body)}</p>

          {/* tala combinations demo */}
          <div className="mt-6 space-y-3">
            <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider">
              {hi ? 'N मात्राओं को भरने के तरीके (S = लघु/छोटा, L = गुरु/लंबा)' : 'Ways to fill N matras (S = short/laghu, L = long/guru)'}
            </h4>
            {TALA_COMBOS.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.05] px-4 py-3"
              >
                <span className="text-gold-primary font-bold text-sm w-20 flex-shrink-0 font-mono">
                  {row.matras} {hi ? 'मात्रा' : 'matra'}
                </span>
                <span className="text-gold-light font-bold text-xl w-8 flex-shrink-0">{row.ways}</span>
                <span className="text-text-secondary/60 text-xs font-mono flex-1 hidden sm:block">
                  {row.combos.length > 0 ? row.combos.join(', ') : `(${row.ways} combinations)`}
                </span>
                <span className="text-gold-primary/40 text-xs flex-shrink-0 font-mono">
                  F({row.matras})
                </span>
              </div>
            ))}
            <div className="text-text-secondary/60 text-xs italic pl-2">
              {hi
                ? 'यह फिबोनाची अनुक्रम है: 1, 2, 3, 5, 8... — भरत मुनि ने संगीत में खोजा।'
                : 'This is the Fibonacci sequence: 1, 2, 3, 5, 8... — discovered by Bharata Muni in music.'}
            </div>
          </div>

          <div className="mt-5 bg-white/[0.02] border border-gold-primary/15 rounded-xl p-5">
            <div className="text-gold-light font-semibold text-sm mb-2">
              {hi ? 'नाट्यशास्त्र में 22 श्रुतियाँ' : '22 Shrutis in the Natyashastra'}
            </div>
            <div className="text-text-secondary text-sm">
              {hi
                ? 'नाट्यशास्त्र में 22 श्रुतियों (सूक्ष्म स्वरांतर अंतरालों) का भी वर्णन है जो भारतीय शास्त्रीय संगीत की गणितीय नींव बनाती हैं। ये अंतराल एक अद्वितीय ट्यूनिंग प्रणाली बनाते हैं जो आधुनिक पश्चिमी 12-टोन समान स्वभाव से पहले की है।'
                : 'The Natyashastra also describes 22 shrutis (microtonal intervals) that form the mathematical foundation of Indian classical music. These intervals create a unique tuning system that predates the modern Western 12-tone equal temperament.'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 2 — PINGALA ═══ */}
        <LessonSection number={2} title={t(L.s2Title)}>
          <p>{t(L.s2Body)}</p>
          <div className="mt-6">
            <div className="text-gold-light font-semibold text-sm mb-4 uppercase tracking-wider">
              {hi ? 'मेरुप्रस्तार — पास्कल से 1,800 साल पहले' : 'Meruprastara — 1,800 years before Pascal'}
            </div>
            <div className="bg-white/[0.02] border border-gold-primary/10 rounded-xl p-4">
              <MeruprastaraSVG hi={hi} />
            </div>
            <div className="mt-4 text-sm text-text-secondary">
              {hi
                ? 'विकर्ण योग: 1, 1, 2, 3, 5, 8, 13... प्रत्येक विकर्ण को तिरछे जोड़ें और आपको फिबोनाची अनुक्रम मिलता है। पिंगल ने यह खोज ~200 ईसा पूर्व की।'
                : 'Diagonal sums: 1, 1, 2, 3, 5, 8, 13... Sum each shallow diagonal and you get the Fibonacci sequence. Pingala discovered this ~200 BCE.'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 3 — VIRAHANKA ═══ */}
        <LessonSection number={3} title={t(L.s3Title)} variant="highlight">
          <p>{t(L.s3Body)}</p>
          <div
            className="my-5 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center"
          >
            <div
              className="text-xl sm:text-2xl text-gold-primary font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              द्वयोर्लघ्वोर्गुरुवद्वृत्तेन मिश्रौ च
            </div>
            <div className="text-gold-light/70 text-sm italic mb-3">
              {hi
                ? '"दो पूर्ववर्ती गणनाओं को मिलाने से अगली मिलती है"'
                : '"Combining the two preceding [counts] gives the next"'}
            </div>
            <div className="font-mono text-gold-primary text-lg">F(n) = F(n−1) + F(n−2)</div>
            <div className="text-text-secondary/60 text-xs mt-1">
              {hi ? 'विरहांका, ~600 ईस्वी — फिबोनाची से 600 साल पहले' : 'Virahanka, ~600 CE — 600 years before Fibonacci'}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4 — HEMACHANDRA ═══ */}
        <LessonSection number={4} title={t(L.s4Title)}>
          <p>{t(L.s4Body)}</p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: { en: 'Hemachandra wrote', hi: 'हेमचंद्र ने लिखा' }, val: '1150 CE', color: 'border-violet-400/30' },
              { label: { en: 'Fibonacci published', hi: 'फिबोनाची ने प्रकाशित किया' }, val: '1202 CE', color: 'border-red-400/30' },
              { label: { en: 'Gap', hi: 'अंतर' }, val: '52 years', color: 'border-gold-primary/30' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl bg-white/[0.02] border ${item.color} p-4 text-center`}>
                <div className="text-gold-primary font-bold text-2xl">{item.val}</div>
                <div className="text-text-secondary text-sm mt-1">{t(item.label)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 5 — HOW FIBONACCI GOT CREDIT ═══ */}
        <LessonSection number={5} title={t(L.s5Title)} variant="highlight">
          <p>{t(L.s5Body)}</p>
          <div className="mt-5 bg-white/[0.02] border border-amber-500/20 rounded-xl p-5">
            <div className="text-amber-400 font-semibold text-sm mb-2">
              {hi ? 'अनुवाद श्रृंखला' : 'The translation chain'}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
              {([
                { en: 'India', hi: 'भारत' },
                '→',
                { en: 'Baghdad (Arabic translations)', hi: 'बगदाद (अरबी अनुवाद)' },
                '→',
                { en: 'North Africa (merchants)', hi: 'उत्तरी अफ्रीका (व्यापारी)' },
                '→',
                { en: 'Fibonacci in Pisa', hi: 'पीसा में फिबोनाची' },
                '→',
                { en: 'Europe (Liber Abaci, 1202 CE)', hi: 'यूरोप (लिबर अबासी, 1202 ईस्वी)' },
              ] as Array<string | { en: string; hi: string }>).map((item, i) =>
                typeof item === 'string' ? (
                  <span key={i} className="text-gold-primary/50">{item}</span>
                ) : (
                  <span key={i} className="bg-white/[0.03] border border-white/[0.06] rounded px-2 py-0.5">{t(item)}</span>
                )
              )}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 — NATURE ═══ */}
        <LessonSection number={6} title={t(L.s6Title)}>
          <p>{t(L.s6Body)}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {NATURE_EXAMPLES.map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.02] border border-gold-primary/15 p-4 text-center"
              >
                <div className="text-gold-light font-semibold text-sm">{t(item.item)}</div>
                <div className="text-text-secondary text-xs mt-1 font-mono">{t(item.detail)}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-gold-primary/5 border border-gold-primary/15 rounded-lg p-4 text-sm text-text-secondary">
            <span className="text-gold-light font-semibold">{hi ? 'स्वर्णिम अनुपात: ' : 'Golden Ratio: '}</span>
            {hi
              ? 'phi = 1.6180339... — उत्तराधिकारी फिबोनाची भिन्नों 1/1, 2/1, 3/2, 5/3, 8/5, 13/8... का सीमा मान।'
              : 'phi = 1.6180339... — the limit of successive Fibonacci fractions 1/1, 2/1, 3/2, 5/3, 8/5, 13/8...'}
          </div>
        </LessonSection>

        {/* ═══ SECTION 7 — UNIVERSALITY ═══ */}
        <LessonSection number={7} title={t(L.s7Title)} variant="highlight">
          <p>{t(L.s7Body)}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { domain: { en: 'Music', hi: 'संगीत' }, who: { en: 'Bharata Muni', hi: 'भरत मुनि' }, year: '~200 BCE' },
              { domain: { en: 'Poetry', hi: 'कविता' }, who: { en: 'Pingala', hi: 'पिंगल' }, year: '~200 BCE' },
              { domain: { en: 'Nature', hi: 'प्रकृति' }, who: { en: 'Spirals & Petals', hi: 'सर्पिल और पंखुड़ियाँ' }, year: 'Always' },
              { domain: { en: 'Finance', hi: 'वित्त' }, who: { en: 'Elliott Waves', hi: 'इलियट वेव्स' }, year: '1938 CE' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.02] border border-gold-primary/15 p-4 text-center"
              >
                <div className="text-gold-light font-bold text-base mb-1">{t(item.domain)}</div>
                <div className="text-text-secondary text-xs">{t(item.who)}</div>
                <div className="text-text-secondary/50 text-xs mt-0.5 font-mono">{item.year}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 8 — TIMELINE ═══ */}
        <LessonSection number={8} title={t(L.s8Title)}>
          <p className="mb-6">{t(L.s8Body)}</p>
          <div className="space-y-3">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${item.color} px-4 py-4`}
              >
                <div className="flex-shrink-0 min-w-[90px]">
                  <div className="text-gold-primary font-bold text-sm font-mono">{item.year}</div>
                  <div className="text-text-secondary/70 text-xs">{item.who}</div>
                  <div className="text-text-secondary/50 text-xs italic">{item.text}</div>
                </div>
                <div className="flex-1">
                  <div className="text-text-secondary text-sm leading-relaxed">{t(item.event)}</div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.badgeColor}`}>
                    {t(item.badge)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-red-500/5 border border-red-500/20 rounded-lg p-4 text-sm text-text-secondary">
            <span className="text-red-400 font-semibold">{hi ? 'प्राथमिकता: ' : 'Priority: '}</span>
            {hi
              ? 'भरत मुनि से फिबोनाची तक: 1,400 वर्ष। भारत को श्रेय मिलना चाहिए। अनुक्रम को कुछ इतिहासकारों द्वारा सही ढंग से "हेमचंद्र-फिबोनाची अनुक्रम" कहा जाता है।'
              : 'From Bharata Muni to Fibonacci: 1,400 years. India deserves the credit. The sequence is correctly called the "Hemachandra-Fibonacci sequence" by some historians.'}
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
            href="/learn/contributions/binary"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {t(L.nextPage)} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
