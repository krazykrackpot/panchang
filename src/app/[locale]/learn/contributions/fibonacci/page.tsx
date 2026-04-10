'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/types/panchang';

/* ═══════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ═══════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: 'The "Fibonacci" Sequence Was Indian — 600 Years Before Fibonacci',
    hi: '"फिबोनाची" अनुक्रम भारतीय था — फिबोनाची से 600 साल पहले',
  },
  subtitle: {
    en: '1, 1, 2, 3, 5, 8, 13, 21, 34... This sequence appears in flower petals, seashells, galaxies, and stock markets. Every textbook calls it the "Fibonacci sequence" after the Italian mathematician Leonardo of Pisa (1202 CE). But the sequence was discovered by Indian mathematicians at least 600 years earlier — and for a completely different reason: Sanskrit poetry.',
    hi: '1, 1, 2, 3, 5, 8, 13, 21, 34... यह अनुक्रम फूलों की पंखुड़ियों, शंखों, आकाशगंगाओं और शेयर बाजारों में दिखता है। हर पाठ्यपुस्तक इसे इतालवी गणितज्ञ लियोनार्डो ऑफ पीसा (1202 ईस्वी) के नाम पर "फिबोनाची अनुक्रम" कहती है। लेकिन यह अनुक्रम भारतीय गणितज्ञों ने कम से कम 600 साल पहले खोजा था — और एक बिल्कुल अलग कारण से: संस्कृत काव्य।',
  },

  s1Title: { en: 'The Prosody Problem — Counting Poetic Meters', hi: 'छंद-शास्त्र की समस्या — काव्य मात्राओं की गणना' },
  s1Body: {
    en: 'In Sanskrit poetry, syllables are either laghu (short, 1 beat) or guru (long, 2 beats). Poets and scholars posed a precise combinatorial question: how many ways can you fill a line of N beats using short and long syllables? For 1 beat: 1 way (L). For 2 beats: 2 ways (LL, G). For 3 beats: 3 ways (LLL, LG, GL). For 4 beats: 5 ways (LLLL, LLG, LGL, GLL, GG). The answer IS the Fibonacci sequence — and each term equals the sum of the two before it.',
    hi: 'संस्कृत कविता में, अक्षर या तो लघु (छोटे, 1 मात्रा) या गुरु (लंबे, 2 मात्रा) होते हैं। विद्वानों ने एक सटीक संयोजनी प्रश्न पूछा: N मात्राओं की एक पंक्ति को लघु और गुरु अक्षरों से भरने के कितने तरीके हैं? 1 मात्रा के लिए: 1 तरीका (ल)। 2 के लिए: 2 तरीके (लल, गु)। 3 के लिए: 3 तरीके। 4 के लिए: 5 तरीके। उत्तर ही फिबोनाची अनुक्रम है — और प्रत्येक पद पिछले दो का योग है।',
  },

  s2Title: { en: 'Virahanka (~600 CE) — The First Discovery', hi: 'विरहांक (~600 ईस्वी) — पहली खोज' },
  s2Body: {
    en: "Virahanka's Vrittajatisamuccaya explicitly derives the recurrence relation for counting syllabic patterns. He writes: combining the two preceding counts gives the next. This is the Fibonacci recurrence in full generality — 600 years before Fibonacci's Liber Abaci (1202 CE). Virahanka also recognized the sequence as a pure mathematical structure beyond the prosody context, making his discovery doubly significant.",
    hi: 'विरहांक की वृत्तजातिसमुच्चय में अक्षर पैटर्न की गणना के लिए पुनरावृत्ति संबंध स्पष्ट रूप से व्युत्पन्न किया गया है। वे लिखते हैं: दो पूर्ववर्ती गणनाओं को मिलाने से अगली मिलती है। यह पूर्ण सामान्यता में फिबोनाची पुनरावृत्ति है — फिबोनाची की लिबर अबासी (1202 ईस्वी) से 600 साल पहले।',
  },
  s2Sanskrit: { en: 'द्वयोर्लघ्वोर्गुरुवद्वृत्तेन मिश्रौ च', hi: 'द्वयोर्लघ्वोर्गुरुवद्वृत्तेन मिश्रौ च' },
  s2SanskritTrans: {
    en: '"Combining the two preceding [counts] gives the next"',
    hi: '"दो पूर्ववर्ती [गणनाओं] को मिलाने से अगली मिलती है"',
  },

  s3Title: { en: 'Hemachandra (1150 CE) — 52 Years Before Fibonacci', hi: 'हेमचंद्र (1150 ईस्वी) — फिबोनाची से 52 साल पहले' },
  s3Body: {
    en: 'Jain scholar Acharya Hemachandra, in his Chandonushasana (1150 CE), states the rule with perfect clarity: the number of meter patterns for N beats equals patterns(N-1) + patterns(N-2). This is identical to the modern definition F(n) = F(n-1) + F(n-2). Hemachandra published this in 1150 CE. Fibonacci published in 1202 CE — just 52 years later. The sequence is sometimes called the "Virahanka-Hemachandra sequence" by historians who are aware of the Indian precedent.',
    hi: 'जैन विद्वान आचार्य हेमचंद्र ने अपनी छंदानुशासन (1150 ईस्वी) में नियम को पूर्ण स्पष्टता से बताया: N मात्राओं के लिए मात्रा पैटर्न की संख्या = पैटर्न(N-1) + पैटर्न(N-2)। यह आधुनिक परिभाषा F(n) = F(n-1) + F(n-2) के समान है। हेमचंद्र ने 1150 ईस्वी में प्रकाशित किया, फिबोनाची ने 1202 में — केवल 52 साल बाद।',
  },

  s4Title: { en: 'Pingala (~200 BCE) — The Seed: Mount Meru', hi: 'पिंगल (~200 ईसा पूर्व) — बीज: मेरु प्रस्तार' },
  s4Body: {
    en: "Even earlier: Pingala's Chandahshastra (~200 BCE) introduces the Meruprastara — the \"Mount Meru arrangement\" of syllabic combinations. This is Pascal's triangle, 1800 years before Pascal! The diagonals of Meruprastara sum precisely to the Fibonacci numbers: 1, 1, 2, 3, 5, 8, 13... Pingala did not explicitly state the Fibonacci recurrence, but the mathematical structure was fully present — waiting for Virahanka to draw the connecting line.",
    hi: 'और भी पहले: पिंगल की छंदःशास्त्र (~200 ईसा पूर्व) में मेरु प्रस्तार की शुरुआत है — अक्षर संयोजनों की "माउंट मेरु व्यवस्था"। यह पास्कल के त्रिभुज है, पास्कल से 1800 साल पहले! मेरु प्रस्तार के विकर्णों का योग फिबोनाची संख्याएँ देता है: 1, 1, 2, 3, 5, 8, 13... पिंगल ने फिबोनाची पुनरावृत्ति स्पष्ट रूप से नहीं बताई, लेकिन गणितीय संरचना पूरी तरह मौजूद थी।',
  },

  s5Title: { en: 'How Fibonacci Got Credit', hi: 'फिबोनाची को श्रेय कैसे मिला' },
  s5Body: {
    en: 'Leonardo of Pisa (nicknamed "Fibonacci") traveled to North Africa and studied with Arab mathematicians who had inherited Indian mathematical knowledge — translated in Baghdad during the 8th–9th centuries under the Abbasid Caliph Al-Mansur. Fibonacci introduced the sequence to Europe in Liber Abaci (1202 CE) — framed around rabbit breeding, not poetry. Western historians named it after him because they were simply unaware of the Indian precedent. The sequence should more accurately be called the Virahanka-Hemachandra sequence.',
    hi: 'लियोनार्डो ऑफ पीसा (उपनाम "फिबोनाची") उत्तरी अफ्रीका गए और अरब गणितज्ञों से अध्ययन किया जिन्होंने भारतीय गणितीय ज्ञान विरासत में पाया था — 8वीं-9वीं शताब्दी में बगदाद में अनुवादित। फिबोनाची ने 1202 ईस्वी में लिबर अबासी में यूरोप को अनुक्रम से परिचित कराया — खरगोश प्रजनन के संदर्भ में। पश्चिमी इतिहासकारों ने उनके नाम पर इसका नाम रखा क्योंकि वे भारतीय पूर्ववृत्त से अनजान थे।',
  },

  s6Title: { en: 'The Sequence in Nature', hi: 'प्रकृति में यह अनुक्रम' },
  s6Body: {
    en: "The Fibonacci sequence appears throughout nature with uncanny precision. Flower petals: lilies have 3, buttercups have 5, daisies have 13, 21, or 34. Sunflower seed spirals always form two sets — 34 clockwise and 55 counterclockwise (consecutive Fibonacci numbers). The nautilus shell grows in a golden spiral derived from Fibonacci ratios. Many galaxy arms follow Fibonacci spiral patterns. The reason: as n grows, the ratio F(n)/F(n-1) converges to the Golden Ratio φ = 1.618... — the most efficient packing ratio in nature. Indian prosodists had found this universal constant through counting poetry.",
    hi: 'फिबोनाची अनुक्रम प्रकृति में अद्भुत सटीकता के साथ प्रकट होता है। फूलों की पंखुड़ियाँ: कमल में 3, बटरकप में 5, डेजी में 13, 21 या 34। सूरजमुखी के बीज सर्पिल हमेशा दो समूह बनाते हैं — 34 दक्षिणावर्त और 55 वामावर्त। नॉटिलस शंख सुनहरे सर्पिल में बढ़ता है। अनुक्रम का कारण: जैसे-जैसे n बढ़ता है, F(n)/F(n-1) का अनुपात स्वर्णिम अनुपात φ = 1.618 की ओर अभिसरित होता है — प्रकृति में सबसे कुशल पैकिंग अनुपात।',
  },

  s7Title: { en: 'Connection to Vedic Astronomy', hi: 'वैदिक ज्योतिष से संबंध' },
  s7Body: {
    en: "The meta-pattern here is profound: Indian mathematicians consistently discovered abstract mathematical truths while solving practical problems — poetry (Fibonacci), commerce (zero, decimal place value), astronomy (trigonometry, sine tables). The Fibonacci-like recurrences appear in Vedic astronomy as well: the Dasha period lengths in Vimshottari Dasha (7, 10, 18, 16, 19, 17, 20, 6, 7 years) don't follow Fibonacci directly, but the underlying principle — that complex patterns emerge from simple addition rules — is the same spirit. Pingala's Meruprastara also underpins the combinatorial structures in nakshatra analysis and the binary encoding of laghu-guru syllables that influenced Boolean logic.",
    hi: 'यहाँ मेटा-पैटर्न गहरा है: भारतीय गणितज्ञों ने लगातार व्यावहारिक समस्याओं को हल करते हुए अमूर्त गणितीय सत्यों की खोज की — काव्य (फिबोनाची), वाणिज्य (शून्य), खगोल (त्रिकोणमिति)। पिंगल का मेरु प्रस्तार नक्षत्र विश्लेषण में संयोजनात्मक संरचनाओं और लघु-गुरु अक्षरों के द्विआधारी एन्कोडिंग को भी रेखांकित करता है जिसने बूलियन तर्क को प्रभावित किया।',
  },

  s8Title: { en: 'Classical Sources — The True Timeline', hi: 'शास्त्रीय स्रोत — वास्तविक समयरेखा' },
  s8Body: {
    en: 'The historical record is unambiguous. Five independent sources document the sequence in India before Fibonacci — spanning 1,400 years of continuous mathematical tradition from prosody to pure number theory.',
    hi: 'ऐतिहासिक रिकॉर्ड स्पष्ट है। पाँच स्वतंत्र स्रोत फिबोनाची से पहले भारत में अनुक्रम का दस्तावेजीकरण करते हैं — छंद-शास्त्र से शुद्ध संख्या सिद्धांत तक 1,400 वर्षों की निरंतर गणितीय परंपरा।',
  },

  backToContributions: { en: 'Back to Contributions', hi: 'योगदान पर वापस' },
  exploreMore: { en: 'Continue Exploring', hi: 'और जानें' },
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const SEQUENCE_TABLE = [
  { n: 1, beats: 'L', count: 1 },
  { n: 2, beats: 'LL, G', count: 2 },
  { n: 3, beats: 'LLL, LG, GL', count: 3 },
  { n: 4, beats: 'LLLL, LLG, LGL, GLL, GG', count: 5 },
  { n: 5, beats: 'LLLLL, LLLG, LLGL, LGLL, GGL, GLG, LGG, GLL... ', count: 8 },
  { n: 6, beats: '...', count: 13 },
];

const TIMELINE = [
  {
    year: '~200 BCE',
    name: { en: 'Pingala', hi: 'पिंगल' },
    work: { en: 'Chandahshastra', hi: 'छंदःशास्त्र' },
    contribution: { en: 'Meruprastara (= Pascal\'s Triangle). Diagonals sum to Fibonacci numbers.', hi: 'मेरु प्रस्तार (= पास्कल का त्रिभुज)। विकर्णों का योग = फिबोनाची संख्याएँ।' },
    place: { en: 'India', hi: 'भारत' },
    color: 'border-gold-primary/60',
  },
  {
    year: '~600 CE',
    name: { en: 'Virahanka', hi: 'विरहांक' },
    work: { en: 'Vrittajatisamuccaya', hi: 'वृत्तजातिसमुच्चय' },
    contribution: { en: 'Explicit recurrence: F(n) = F(n-1) + F(n-2). 600 years before Fibonacci.', hi: 'स्पष्ट पुनरावृत्ति: F(n) = F(n-1) + F(n-2)। फिबोनाची से 600 साल पहले।' },
    place: { en: 'India', hi: 'भारत' },
    color: 'border-amber-400/60',
  },
  {
    year: '~1135 CE',
    name: { en: 'Gopala', hi: 'गोपाल' },
    work: { en: 'Commentary on Virahanka', hi: 'विरहांक पर टीका' },
    contribution: { en: 'Independently restates the recurrence relation in full generality.', hi: 'पुनरावृत्ति संबंध को पूर्ण सामान्यता में स्वतंत्र रूप से पुनः बताया।' },
    place: { en: 'India', hi: 'भारत' },
    color: 'border-emerald-400/60',
  },
  {
    year: '1150 CE',
    name: { en: 'Hemachandra', hi: 'हेमचंद्र' },
    work: { en: 'Chandonushasana', hi: 'छंदानुशासन' },
    contribution: { en: 'Independent derivation — identical to modern F(n) = F(n-1) + F(n-2). 52 years before Fibonacci.', hi: 'स्वतंत्र व्युत्पत्ति — आधुनिक F(n) = F(n-1) + F(n-2) के समान। फिबोनाची से 52 साल पहले।' },
    place: { en: 'Gujarat, India', hi: 'गुजरात, भारत' },
    color: 'border-violet-400/60',
  },
  {
    year: '1202 CE',
    name: { en: 'Fibonacci (Leonardo of Pisa)', hi: 'फिबोनाची (लियोनार्डो ऑफ पीसा)' },
    work: { en: 'Liber Abaci', hi: 'लिबर अबासी' },
    contribution: { en: 'Introduces sequence to Europe via rabbit breeding problem. Gets named after him.', hi: 'खरगोश प्रजनन समस्या के माध्यम से यूरोप को अनुक्रम से परिचित कराया। उनके नाम पर नाम पड़ा।' },
    place: { en: 'Pisa, Italy', hi: 'पीसा, इटली' },
    color: 'border-blue-400/60',
  },
];

const NATURE_EXAMPLES = [
  { subject: { en: 'Lily petals', hi: 'कमल की पंखुड़ियाँ' }, value: '3', color: 'bg-pink-500/20 border-pink-500/30' },
  { subject: { en: 'Buttercup petals', hi: 'बटरकप पंखुड़ियाँ' }, value: '5', color: 'bg-yellow-500/20 border-yellow-500/30' },
  { subject: { en: 'Chicory petals', hi: 'चिकोरी पंखुड़ियाँ' }, value: '21', color: 'bg-blue-500/20 border-blue-500/30' },
  { subject: { en: 'Daisy petals', hi: 'डेजी पंखुड़ियाँ' }, value: '34', color: 'bg-purple-500/20 border-purple-500/30' },
  { subject: { en: 'Sunflower CW spirals', hi: 'सूरजमुखी दक्षिणावर्त' }, value: '34', color: 'bg-amber-500/20 border-amber-500/30' },
  { subject: { en: 'Sunflower CCW spirals', hi: 'सूरजमुखी वामावर्त' }, value: '55', color: 'bg-orange-500/20 border-orange-500/30' },
];

const SANSKRIT_TERMS = [
  { term: 'Laghu', transliteration: 'laghu', meaning: 'short syllable — 1 beat in Sanskrit prosody', devanagari: 'लघु' },
  { term: 'Guru', transliteration: 'guru', meaning: 'long syllable — 2 beats in Sanskrit prosody', devanagari: 'गुरु' },
  { term: 'Meruprastara', transliteration: 'meru-prastāra', meaning: "Mount Meru arrangement — Pingala's Pascal's triangle (~200 BCE)", devanagari: 'मेरु प्रस्तार' },
  { term: 'Chandahshastra', transliteration: 'chandaḥ-śāstra', meaning: 'Science of Meters — Pingala\'s foundational text on prosody', devanagari: 'छंदःशास्त्र' },
];

/* ═══════════════════════════════════════════════════════════════
   SVG: Meruprastara (Pascal's Triangle) with Fibonacci diagonals
   ═══════════════════════════════════════════════════════════════ */
function MeruprastaraSVG({ hi }: { hi: boolean }) {
  const rows = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1],
    [1, 6, 15, 20, 15, 6, 1],
  ];

  // Diagonal indices (0-based row, col) that sum to Fibonacci numbers
  // Diagonal sums: row0col0=1, (row1col0)=1, (row1col1+row2col0)=2, (row2col1+row3col0)=3,...
  const diagonalCells: Set<string> = new Set([
    '0,0',     // 1
    '1,0',     // 1
    '2,0','1,1',  // 2
    '3,0','2,1',  // 3
    '4,0','3,1','2,2',  // 5
    '5,0','4,1','3,2',  // 8
    '6,0','5,1','4,2','3,3',  // 13
  ]);

  const W = 320;
  const H = 240;
  const cellW = 38;
  const cellH = 30;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="max-w-xs mx-auto">
      <defs>
        <filter id="glow-fib">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {rows.map((row, ri) => {
        const rowWidth = row.length * cellW;
        const startX = (W - rowWidth) / 2;
        const y = ri * cellH + 20;
        return row.map((val, ci) => {
          const x = startX + ci * cellW + cellW / 2;
          const key = `${ri},${ci}`;
          const isHighlighted = diagonalCells.has(key);
          return (
            <g key={key}>
              <circle
                cx={x}
                cy={y}
                r={14}
                fill={isHighlighted ? 'rgba(212,168,83,0.25)' : 'rgba(255,255,255,0.03)'}
                stroke={isHighlighted ? 'rgba(212,168,83,0.8)' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isHighlighted ? 1.5 : 1}
                filter={isHighlighted ? 'url(#glow-fib)' : undefined}
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize={val > 9 ? 9 : 11}
                fill={isHighlighted ? '#f0d48a' : 'rgba(230,226,216,0.5)'}
                fontWeight={isHighlighted ? 'bold' : 'normal'}
              >
                {val}
              </text>
            </g>
          );
        });
      })}

      {/* Legend */}
      <circle cx={10} cy={H - 16} r={6} fill="rgba(212,168,83,0.25)" stroke="rgba(212,168,83,0.8)" strokeWidth={1.5} />
      <text x={22} y={H - 11} fontSize={9} fill="rgba(212,168,83,0.8)">
        {hi ? 'विकर्ण योग = फिबोनाची' : 'Diagonal sums = Fibonacci'}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SVG: Fibonacci spiral approximation
   ═══════════════════════════════════════════════════════════════ */
function FibonacciSpiralSVG() {
  // Boxes: 1,1,2,3,5,8 — approximate spiral from squares
  const W = 280;
  const H = 200;
  // We'll draw the classic nested squares arrangement
  const unit = 18;
  // Positions (x,y,size) for squares 1,1,2,3,5,8,13 scaled by unit
  const squares = [
    { x: 8 * unit, y: 5 * unit, s: 1 * unit, color: 'rgba(212,168,83,0.6)' },
    { x: 8 * unit, y: 4 * unit, s: 1 * unit, color: 'rgba(212,168,83,0.55)' },
    { x: 6 * unit, y: 4 * unit, s: 2 * unit, color: 'rgba(212,168,83,0.45)' },
    { x: 3 * unit, y: 4 * unit, s: 3 * unit, color: 'rgba(212,168,83,0.35)' },
    { x: 3 * unit, y: -1 * unit, s: 5 * unit, color: 'rgba(212,168,83,0.25)' },
    { x: -5 * unit, y: -1 * unit, s: 8 * unit, color: 'rgba(212,168,83,0.15)' },
  ];
  const labels = ['1', '1', '2', '3', '5', '8'];

  return (
    <svg viewBox={`-10 -10 ${W} ${H}`} width="100%" className="max-w-xs mx-auto">
      {squares.map((sq, i) => (
        <g key={i}>
          <rect
            x={sq.x} y={sq.y} width={sq.s} height={sq.s}
            fill={sq.color}
            stroke="rgba(212,168,83,0.5)"
            strokeWidth={1}
            rx={2}
          />
          <text
            x={sq.x + sq.s / 2} y={sq.y + sq.s / 2 + 4}
            textAnchor="middle"
            fontSize={Math.max(8, sq.s * 0.35)}
            fill="rgba(240,212,138,0.9)"
            fontWeight="bold"
          >
            {labels[i]}
          </text>
        </g>
      ))}
      {/* Spiral arc approximation */}
      <path
        d={`M ${8 * unit + unit} ${5 * unit} Q ${9 * unit} ${3 * unit} ${8 * unit} ${4 * unit}`}
        fill="none" stroke="rgba(240,212,138,0.7)" strokeWidth={1.5}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function FibonacciPage() {
  const locale = useLocale() as Locale;
  const hi = locale === 'hi';
  const t = (obj: { en: string; hi: string }) => (hi ? obj.hi : obj.en);

  const fibSeq = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(35)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gold-primary/10"
              style={{
                width: `${(i % 5 + 1) * 2}px`,
                height: `${(i % 5 + 1) * 2}px`,
                left: `${(i * 23 + 5) % 100}%`,
                top: `${(i * 31 + 9) % 100}%`,
              }}
              animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.8, 1.4, 0.8] }}
              transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-primary/30 to-amber-500/10 border border-gold-primary/30 flex items-center justify-center">
                {/* Fibonacci spiral icon */}
                <svg viewBox="0 0 40 40" width="40" height="40">
                  <path d="M20 20 Q20 8 32 8 Q32 20 20 20 Q8 20 8 32 Q20 32 20 20" fill="none" stroke="#d4a853" strokeWidth="2" />
                  <circle cx="20" cy="20" r="2" fill="#d4a853" />
                </svg>
              </div>
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-gold-gradient mb-4 leading-tight"
              style={{ fontFamily: hi ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
            >
              {t(L.title)}
            </h1>
            <p className="text-base sm:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {t(L.subtitle)}
            </p>
          </motion.div>

          {/* Animated sequence display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-10"
          >
            <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl px-6 sm:px-10 py-6">
              {fibSeq.map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.08, type: 'spring' as const }}
                  className="flex flex-col items-center"
                >
                  <span
                    className="text-xl sm:text-2xl font-black bg-gradient-to-b from-gold-light to-gold-primary bg-clip-text text-transparent"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {n}
                  </span>
                  {i < fibSeq.length - 1 && (
                    <span className="text-gold-primary/40 text-xs mt-1">,</span>
                  )}
                </motion.div>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-gold-primary/50 text-xl self-center ml-1"
              >
                ...
              </motion.span>
            </div>
            <p className="text-text-secondary/60 text-xs mt-3">
              {hi
                ? 'विरहांक द्वारा ~600 ईस्वी में, हेमचंद्र द्वारा 1150 ईस्वी में — फिबोनाची से 600 और 52 साल पहले'
                : 'By Virahanka ~600 CE, Hemachandra 1150 CE — 600 and 52 years before Fibonacci'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-2">

        {/* ═══ SECTION 1: Prosody Problem ═══ */}
        <LessonSection number={1} title={t(L.s1Title)} variant="highlight">
          <p>{t(L.s1Body)}</p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-3 px-3 text-gold-light font-semibold text-xs uppercase tracking-wider">
                    {hi ? 'मात्राएँ (N)' : 'Beats (N)'}
                  </th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold text-xs uppercase tracking-wider">
                    {hi ? 'पैटर्न' : 'Patterns'}
                  </th>
                  <th className="text-left py-3 px-3 text-gold-light font-semibold text-xs uppercase tracking-wider">
                    {hi ? 'कुल = F(N)' : 'Count = F(N)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {SEQUENCE_TABLE.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="border-b border-white/[0.04]"
                  >
                    <td className="py-3 px-3">
                      <span className="font-bold text-gold-primary">{row.n}</span>
                    </td>
                    <td className="py-3 px-3 text-text-secondary text-xs font-mono">
                      {row.beats}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-gold-light font-bold text-base">{row.count}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-gold-primary/5 border border-gold-primary/20 rounded-lg px-4 py-3 text-sm text-text-primary">
            <span className="text-gold-light font-semibold">
              {hi ? 'नियम: ' : 'The rule: '}
            </span>
            {hi
              ? 'F(N) = F(N−1) + F(N−2) — अगले की कुल संख्या = पिछले दो की संख्याओं का योग। यही फिबोनाची अनुक्रम है।'
              : 'F(N) = F(N−1) + F(N−2) — the count for N beats = sum of the two preceding counts. This IS the Fibonacci sequence.'}
          </div>
        </LessonSection>

        {/* ═══ SECTION 2: Virahanka ═══ */}
        <LessonSection number={2} title={t(L.s2Title)}>
          <p>{t(L.s2Body)}</p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="my-6 bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-6 text-center"
          >
            <div
              className="text-xl sm:text-2xl text-gold-primary font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari-heading)' }}
            >
              {t(L.s2Sanskrit)}
            </div>
            <div className="text-gold-light/70 text-sm italic">{t(L.s2SanskritTrans)}</div>
            <div className="text-text-secondary/60 text-xs mt-1">— Virahanka, Vrittajatisamuccaya, ~600 CE</div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1 bg-white/[0.02] border border-gold-primary/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-gold-primary mb-1" style={{ fontFamily: 'var(--font-heading)' }}>600</div>
              <div className="text-gold-light text-sm font-semibold">{hi ? 'साल पहले' : 'years before'}</div>
              <div className="text-text-secondary text-xs mt-1">{hi ? 'फिबोनाची (1202 ईस्वी) से' : "Fibonacci's 1202 CE"}</div>
            </div>
            <div className="flex-1 bg-white/[0.02] border border-amber-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-amber-400 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>~600</div>
              <div className="text-amber-300/80 text-sm font-semibold">{hi ? 'ईस्वी' : 'CE'}</div>
              <div className="text-text-secondary text-xs mt-1">{hi ? 'विरहांक की खोज' : "Virahanka's discovery"}</div>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 3: Hemachandra ═══ */}
        <LessonSection number={3} title={t(L.s3Title)} variant="highlight">
          <p>{t(L.s3Body)}</p>

          <div className="mt-6 bg-white/[0.02] border border-violet-500/20 rounded-xl p-5">
            <div className="text-violet-300/80 text-xs uppercase tracking-wider font-semibold mb-3">
              {hi ? 'हेमचंद्र का नियम (1150 ईस्वी) — आधुनिक परिभाषा के समान:' : "Hemachandra's rule (1150 CE) — identical to the modern definition:"}
            </div>
            <div className="font-mono text-gold-light text-lg text-center py-2">
              F(n) = F(n−1) + F(n−2)
            </div>
            <div className="text-center mt-2">
              <span className="text-xs bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full">
                {hi ? 'प्रकाशित: 1150 ईस्वी — फिबोनाची से 52 साल पहले' : 'Published: 1150 CE — 52 years before Fibonacci (1202 CE)'}
              </span>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 4: Pingala + Meruprastara SVG ═══ */}
        <LessonSection number={4} title={t(L.s4Title)}>
          <p>{t(L.s4Body)}</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="text-gold-light font-semibold text-sm mb-3 text-center uppercase tracking-wider">
                {hi ? 'मेरु प्रस्तार (पास्कल का त्रिभुज)' : 'Meruprastara (Pascal\'s Triangle)'}
              </h4>
              <MeruprastaraSVG hi={hi} />
              <p className="text-text-secondary/70 text-xs text-center mt-2">
                {hi ? 'सुनहरी कोशिकाएँ = विकर्ण जिनका योग फिबोनाची देता है' : 'Gold cells = diagonals that sum to Fibonacci numbers'}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-gold-light font-semibold text-sm uppercase tracking-wider">
                {hi ? 'विकर्ण योग:' : 'Diagonal sums:'}
              </h4>
              {[1, 1, 2, 3, 5, 8, 13].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-text-secondary/50 text-xs w-12">
                    {hi ? `विकर्ण ${i + 1}` : `Diag. ${i + 1}`}
                  </span>
                  <div className="flex-1 bg-white/[0.02] rounded h-7 flex items-center px-3">
                    <div
                      className="h-4 rounded bg-gold-primary/30"
                      style={{ width: `${(val / 13) * 100}%`, minWidth: '8px' }}
                    />
                  </div>
                  <span className="text-gold-light font-bold w-8 text-right">{val}</span>
                </motion.div>
              ))}
              <div className="text-text-secondary/60 text-xs pt-1">
                {hi ? 'पिंगल (~200 ईसा पूर्व) — पास्कल से 1800 साल पहले' : 'Pingala (~200 BCE) — 1800 years before Pascal'}
              </div>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 5: How Fibonacci Got Credit ═══ */}
        <LessonSection number={5} title={t(L.s5Title)} variant="highlight">
          <p>{t(L.s5Body)}</p>

          <div className="mt-6 space-y-4">
            {[
              {
                step: { en: 'India (~200 BCE – 1150 CE)', hi: 'भारत (~200 ईसा पूर्व – 1150 ईस्वी)' },
                desc: { en: 'Sequence discovered through Sanskrit prosody. Pingala → Virahanka → Gopala → Hemachandra.', hi: 'संस्कृत छंद-शास्त्र के माध्यम से अनुक्रम की खोज। पिंगल → विरहांक → गोपाल → हेमचंद्र।' },
                color: 'border-gold-primary/40',
              },
              {
                step: { en: 'Baghdad (8th–9th century)', hi: 'बगदाद (8वीं–9वीं शताब्दी)' },
                desc: { en: 'Indian mathematical texts translated under Abbasid patronage. Arab scholars inherit the sequence.', hi: 'अब्बासी संरक्षण में भारतीय गणितीय ग्रंथों का अनुवाद। अरब विद्वान अनुक्रम विरासत में पाते हैं।' },
                color: 'border-blue-400/40',
              },
              {
                step: { en: 'North Africa (1175–1200 CE)', hi: 'उत्तरी अफ्रीका (1175–1200 ईस्वी)' },
                desc: { en: "Fibonacci studies with Arab mathematicians in Béjaïa (Algeria). Learns Indian-Arabic numeral system.", hi: 'फिबोनाची बेजाया (अल्जीरिया) में अरब गणितज्ञों के साथ अध्ययन करते हैं।' },
                color: 'border-amber-400/40',
              },
              {
                step: { en: 'Pisa, Italy (1202 CE)', hi: 'पीसा, इटली (1202 ईस्वी)' },
                desc: { en: 'Liber Abaci published. Rabbit breeding problem introduces the sequence to Europe. His name sticks.', hi: 'लिबर अबासी प्रकाशित। खरगोश प्रजनन समस्या यूरोप को अनुक्रम से परिचित कराती है।' },
                color: 'border-red-400/40',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${item.color} px-4 py-4`}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-primary text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <div className="text-gold-light font-semibold text-sm">{t(item.step)}</div>
                  <div className="text-text-secondary text-sm mt-1">{t(item.desc)}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-sm">
            <span className="text-amber-400 font-semibold">
              {hi ? 'सटीक नाम: ' : 'The accurate name: '}
            </span>
            <span className="text-text-primary">
              {hi
                ? '"विरहांक-हेमचंद्र अनुक्रम" — इतिहास की जानकारी रखने वाले इतिहासकार इसे इसी नाम से पुकारते हैं।'
                : '"Virahanka-Hemachandra sequence" — the name used by historians who are aware of the Indian precedent.'}
            </span>
          </div>
        </LessonSection>

        {/* ═══ SECTION 6: Sequence in Nature ═══ */}
        <LessonSection number={6} title={t(L.s6Title)}>
          <p>{t(L.s6Body)}</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {NATURE_EXAMPLES.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-xl border p-4 text-center ${ex.color}`}
              >
                <div className="text-2xl font-black text-gold-light mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {ex.value}
                </div>
                <div className="text-text-secondary text-xs leading-tight">{t(ex.subject)}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <h4 className="text-gold-light font-semibold text-sm mb-3 text-center uppercase tracking-wider">
                {hi ? 'फिबोनाची वर्ग (सर्पिल का आधार)' : 'Fibonacci Squares (basis of the spiral)'}
              </h4>
              <FibonacciSpiralSVG />
            </div>
            <div className="bg-white/[0.02] border border-gold-primary/20 rounded-xl p-5">
              <h4 className="text-gold-light font-semibold text-sm mb-3">
                {hi ? 'स्वर्णिम अनुपात की ओर अभिसरण' : 'Convergence to the Golden Ratio'}
              </h4>
              {[[1, 1], [2, 1], [3, 2], [5, 3], [8, 5], [13, 8], [21, 13]].map(([a, b], i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0"
                >
                  <span className="text-text-secondary text-xs font-mono">{a}/{b}</span>
                  <span className="text-gold-primary text-sm font-mono">= {(a / b).toFixed(4)}</span>
                </motion.div>
              ))}
              <div className="text-gold-light font-bold text-sm mt-2 text-right">
                φ = 1.6180...
              </div>
              <div className="text-text-secondary/60 text-xs mt-1 text-right">
                {hi ? 'स्वर्णिम अनुपात' : 'The Golden Ratio'}
              </div>
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 7: Vedic Astronomy Connection ═══ */}
        <LessonSection number={7} title={t(L.s7Title)} variant="highlight">
          <p>{t(L.s7Body)}</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: '📜',
                title: { en: 'Poetry → Fibonacci', hi: 'काव्य → फिबोनाची' },
                desc: { en: 'Counting laghu-guru syllable patterns → Fibonacci sequence (Pingala, Virahanka, Hemachandra)', hi: 'लघु-गुरु अक्षर पैटर्न गणना → फिबोनाची अनुक्रम' },
              },
              {
                icon: '🔢',
                title: { en: 'Commerce → Zero', hi: 'वाणिज्य → शून्य' },
                desc: { en: 'Tracking debts and credits → zero as a number (Brahmagupta, 628 CE)', hi: 'ऋण-साख ट्रैकिंग → संख्या के रूप में शून्य (ब्रह्मगुप्त, 628 ईस्वी)' },
              },
              {
                icon: '🌙',
                title: { en: 'Astronomy → Trigonometry', hi: 'खगोल → त्रिकोणमिति' },
                desc: { en: 'Predicting planetary positions → sine tables (Aryabhata, Madhava infinite series)', hi: 'ग्रह स्थितियों की भविष्यवाणी → ज्या सारणी (आर्यभट, माधव अनंत श्रृंखला)' },
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-gold-light font-semibold text-sm mb-1">{t(item.title)}</div>
                <div className="text-text-secondary text-xs leading-relaxed">{t(item.desc)}</div>
              </motion.div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 8: Timeline ═══ */}
        <LessonSection number={8} title={t(L.s8Title)}>
          <p>{t(L.s8Body)}</p>

          <div className="mt-6 space-y-4">
            {TIMELINE.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex gap-4 rounded-lg bg-white/[0.02] border-l-4 ${entry.color} px-4 py-4`}
              >
                <div className="flex-shrink-0">
                  <div className="text-gold-primary font-bold text-sm font-mono">{entry.year}</div>
                  <div className="text-text-secondary/70 text-xs">{t(entry.place)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gold-light font-semibold text-sm">
                    {t(entry.name)} —{' '}
                    <span className="italic text-text-secondary/80 font-normal">{t(entry.work)}</span>
                  </div>
                  <div className="text-text-secondary text-sm mt-1">{t(entry.contribution)}</div>
                </div>
                {i < 4 && (
                  <span className="flex-shrink-0 self-start mt-1">
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      {hi ? 'भारत' : 'India'}
                    </span>
                  </span>
                )}
                {i === 4 && (
                  <span className="flex-shrink-0 self-start mt-1">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                      {hi ? 'यूरोप' : 'Europe'}
                    </span>
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 bg-gradient-to-r from-gold-primary/10 to-amber-500/5 border border-gold-primary/20 rounded-xl px-5 py-4"
          >
            <div className="text-gold-light font-bold text-sm mb-1">
              {hi ? 'निष्कर्ष:' : 'The verdict:'}
            </div>
            <div className="text-text-primary text-sm leading-relaxed">
              {hi
                ? '1,400 साल की भारतीय गणितीय परंपरा — पिंगल से हेमचंद्र तक — ने वह खोजा जो यूरोप "फिबोनाची अनुक्रम" कहता है। सटीक नाम है: विरहांक-हेमचंद्र अनुक्रम।'
                : "1,400 years of Indian mathematical tradition — from Pingala to Hemachandra — discovered what Europe calls the 'Fibonacci sequence.' The accurate name: the Virahanka-Hemachandra sequence."}
            </div>
          </motion.div>
        </LessonSection>

        {/* ═══ SANSKRIT TERMS ═══ */}
        <LessonSection title={hi ? 'मुख्य संस्कृत शब्द' : 'Key Sanskrit Terms'}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SANSKRIT_TERMS.map((term, i) => (
              <SanskritTermCard key={i} {...term} />
            ))}
          </div>
        </LessonSection>

        {/* ═══ CROSS-REFERENCES ═══ */}
        <LessonSection title={hi ? 'इन्हें भी देखें' : 'Continue Exploring'}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: '/learn/contributions/binary', label: { en: 'Binary & Pingala', hi: 'बाइनरी और पिंगल' }, desc: { en: 'Laghu-guru encoding predates Leibniz by 1,800 years', hi: 'लघु-गुरु एन्कोडिंग लीबनिज़ से 1,800 साल पहले' } },
              { href: '/learn/contributions/zero', label: { en: 'Zero & Brahmagupta', hi: 'शून्य और ब्रह्मगुप्त' }, desc: { en: 'The most dangerous idea in mathematical history', hi: 'गणितीय इतिहास का सबसे खतरनाक विचार' } },
              { href: '/learn/hora', label: { en: 'Vedic Hora System', hi: 'वैदिक होरा प्रणाली' }, desc: { en: 'Mathematical patterns in planetary hour cycles', hi: 'ग्रहीय घड़ी चक्रों में गणितीय पैटर्न' } },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="block rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-all p-4 group"
              >
                <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">
                  {t(link.label)} <ArrowRight className="inline w-3 h-3 ml-1" />
                </div>
                <div className="text-text-secondary text-xs mt-1 leading-relaxed">{t(link.desc)}</div>
              </Link>
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
            {hi ? 'अगला: बाइनरी और पिंगल' : 'Next: Binary & Pingala'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
