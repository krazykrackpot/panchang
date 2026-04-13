import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Music } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-fibonacci.json';


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
    event: { en: 'FIRST: Sequence emerges from tala (rhythmic cycle) analysis — musical discovery, 22 shrutis', hi: 'पहला: ताल विश्लेषण से अनुक्रम उभरता है — संगीत खोज, 22 श्रुतियाँ', sa: 'पहला: ताल विश्लेषण से अनुक्रम उभरता है — संगीत खोज, 22 श्रुतियाँ', mai: 'पहला: ताल विश्लेषण से अनुक्रम उभरता है — संगीत खोज, 22 श्रुतियाँ', mr: 'पहला: ताल विश्लेषण से अनुक्रम उभरता है — संगीत खोज, 22 श्रुतियाँ', ta: 'FIRST: Sequence emerges from tala (rhythmic cycle) analysis — musical discovery, 22 shrutis', te: 'FIRST: Sequence emerges from tala (rhythmic cycle) analysis — musical discovery, 22 shrutis', bn: 'FIRST: Sequence emerges from tala (rhythmic cycle) analysis — musical discovery, 22 shrutis', kn: 'FIRST: Sequence emerges from tala (rhythmic cycle) analysis — musical discovery, 22 shrutis', gu: 'FIRST: Sequence emerges from tala (rhythmic cycle) analysis — musical discovery, 22 shrutis' },
    color: 'border-gold-primary/70',
    badge: { en: 'MUSIC', hi: 'संगीत', sa: 'संगीत', mai: 'संगीत', mr: 'संगीत', ta: 'MUSIC', te: 'MUSIC', bn: 'MUSIC', kn: 'MUSIC', gu: 'MUSIC' },
    badgeColor: 'bg-gold-primary/20 text-gold-primary',
  },
  {
    year: '~200 BCE',
    who: 'Pingala',
    text: 'Chandahshastra',
    event: { en: "Sequence in Sanskrit prosody (laghu/guru syllables); discovers Meruprastara (Pascal's Triangle) — diagonals give Fibonacci numbers", hi: 'संस्कृत छंद-विज्ञान में अनुक्रम (लघु/गुरु अक्षर); मेरुप्रस्तार की खोज — विकर्ण फिबोनाची संख्याएँ देते हैं', sa: 'संस्कृत छंद-विज्ञान में अनुक्रम (लघु/गुरु अक्षर); मेरुप्रस्तार की खोज — विकर्ण फिबोनाची संख्याएँ देते हैं', mai: 'संस्कृत छंद-विज्ञान में अनुक्रम (लघु/गुरु अक्षर); मेरुप्रस्तार की खोज — विकर्ण फिबोनाची संख्याएँ देते हैं', mr: 'संस्कृत छंद-विज्ञान में अनुक्रम (लघु/गुरु अक्षर); मेरुप्रस्तार की खोज — विकर्ण फिबोनाची संख्याएँ देते हैं', ta: "Sequence in Sanskrit prosody (laghu/guru syllables); discovers Meruprastara (Pascal's Triangle) — diagonals give Fibonacci numbers", te: "Sequence in Sanskrit prosody (laghu/guru syllables); discovers Meruprastara (Pascal's Triangle) — diagonals give Fibonacci numbers", bn: "Sequence in Sanskrit prosody (laghu/guru syllables); discovers Meruprastara (Pascal's Triangle) — diagonals give Fibonacci numbers", kn: "Sequence in Sanskrit prosody (laghu/guru syllables); discovers Meruprastara (Pascal's Triangle) — diagonals give Fibonacci numbers", gu: "Sequence in Sanskrit prosody (laghu/guru syllables); discovers Meruprastara (Pascal's Triangle) — diagonals give Fibonacci numbers" },
    color: 'border-amber-400/60',
    badge: { en: 'POETRY', hi: 'कविता', sa: 'कविता', mai: 'कविता', mr: 'कविता', ta: 'POETRY', te: 'POETRY', bn: 'POETRY', kn: 'POETRY', gu: 'POETRY' },
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    year: '~600 CE',
    who: 'Virahanka',
    text: 'Vrittajatisamuccaya',
    event: { en: 'First EXPLICIT recurrence relation: F(n) = F(n−1) + F(n−2) — the defining rule, stated clearly for the first time', hi: 'पहला स्पष्ट पुनरावृत्ति संबंध: F(n) = F(n−1) + F(n−2) — पहली बार स्पष्ट रूप से कहा गया', sa: 'पहला स्पष्ट पुनरावृत्ति संबंध: F(n) = F(n−1) + F(n−2) — पहली बार स्पष्ट रूप से कहा गया', mai: 'पहला स्पष्ट पुनरावृत्ति संबंध: F(n) = F(n−1) + F(n−2) — पहली बार स्पष्ट रूप से कहा गया', mr: 'पहला स्पष्ट पुनरावृत्ति संबंध: F(n) = F(n−1) + F(n−2) — पहली बार स्पष्ट रूप से कहा गया', ta: 'First EXPLICIT recurrence relation: F(n) = F(n−1) + F(n−2) — the defining rule, stated clearly for the first time', te: 'First EXPLICIT recurrence relation: F(n) = F(n−1) + F(n−2) — the defining rule, stated clearly for the first time', bn: 'First EXPLICIT recurrence relation: F(n) = F(n−1) + F(n−2) — the defining rule, stated clearly for the first time', kn: 'First EXPLICIT recurrence relation: F(n) = F(n−1) + F(n−2) — the defining rule, stated clearly for the first time', gu: 'First EXPLICIT recurrence relation: F(n) = F(n−1) + F(n−2) — the defining rule, stated clearly for the first time' },
    color: 'border-emerald-400/60',
    badge: { en: 'RECURRENCE', hi: 'पुनरावृत्ति', sa: 'पुनरावृत्ति', mai: 'पुनरावृत्ति', mr: 'पुनरावृत्ति', ta: 'RECURRENCE', te: 'RECURRENCE', bn: 'RECURRENCE', kn: 'RECURRENCE', gu: 'RECURRENCE' },
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
  },
  {
    year: '~1135 CE',
    who: 'Gopala',
    text: 'Commentary on Chandahshastra',
    event: { en: 'Further systematization of the sequence in prosody, extending to longer meters', hi: 'छंद-विज्ञान में अनुक्रम का आगे व्यवस्थितकरण', sa: 'छंद-विज्ञान में अनुक्रम का आगे व्यवस्थितकरण', mai: 'छंद-विज्ञान में अनुक्रम का आगे व्यवस्थितकरण', mr: 'छंद-विज्ञान में अनुक्रम का आगे व्यवस्थितकरण', ta: 'Further systematization of the sequence in prosody, extending to longer meters', te: 'Further systematization of the sequence in prosody, extending to longer meters', bn: 'Further systematization of the sequence in prosody, extending to longer meters', kn: 'Further systematization of the sequence in prosody, extending to longer meters', gu: 'Further systematization of the sequence in prosody, extending to longer meters' },
    color: 'border-blue-400/50',
    badge: { en: 'PROSODY', hi: 'छंद', sa: 'छंद', mai: 'छंद', mr: 'छंद', ta: 'PROSODY', te: 'PROSODY', bn: 'PROSODY', kn: 'PROSODY', gu: 'PROSODY' },
    badgeColor: 'bg-blue-500/20 text-blue-400',
  },
  {
    year: '1150 CE',
    who: 'Hemachandra',
    text: 'Chandonushasana',
    event: { en: 'Independent derivation — 52 years before Fibonacci. Full explicit statement of the recurrence. Sometimes called the Hemachandra-Fibonacci sequence.', hi: 'स्वतंत्र व्युत्पत्ति — फिबोनाची से 52 साल पहले। कभी-कभी हेमचंद्र-फिबोनाची अनुक्रम कहा जाता है।', sa: 'स्वतंत्र व्युत्पत्ति — फिबोनाची से 52 साल पहले। कभी-कभी हेमचंद्र-फिबोनाची अनुक्रम कहा जाता है।', mai: 'स्वतंत्र व्युत्पत्ति — फिबोनाची से 52 साल पहले। कभी-कभी हेमचंद्र-फिबोनाची अनुक्रम कहा जाता है।', mr: 'स्वतंत्र व्युत्पत्ति — फिबोनाची से 52 साल पहले। कभी-कभी हेमचंद्र-फिबोनाची अनुक्रम कहा जाता है।', ta: 'Independent derivation — 52 years before Fibonacci. Full explicit statement of the recurrence. Sometimes called the Hemachandra-Fibonacci sequence.', te: 'Independent derivation — 52 years before Fibonacci. Full explicit statement of the recurrence. Sometimes called the Hemachandra-Fibonacci sequence.', bn: 'Independent derivation — 52 years before Fibonacci. Full explicit statement of the recurrence. Sometimes called the Hemachandra-Fibonacci sequence.', kn: 'Independent derivation — 52 years before Fibonacci. Full explicit statement of the recurrence. Sometimes called the Hemachandra-Fibonacci sequence.', gu: 'Independent derivation — 52 years before Fibonacci. Full explicit statement of the recurrence. Sometimes called the Hemachandra-Fibonacci sequence.' },
    color: 'border-violet-400/60',
    badge: { en: '52 YRS EARLIER', hi: '52 साल पहले', sa: '52 साल पहले', mai: '52 साल पहले', mr: '52 साल पहले', ta: '52 ஆண்டுகள் முன்னதாக', te: '52 సంవత్సరాల ముందు', bn: '52 বছর আগে', kn: '52 ವರ್ಷಗಳ ಮುಂಚೆ', gu: '52 વર્ષ અગાઉ' },
    badgeColor: 'bg-violet-500/20 text-violet-400',
  },
  {
    year: '1202 CE',
    who: 'Leonardo Fibonacci',
    text: 'Liber Abaci',
    event: { en: "Introduces sequence to Europe via rabbit-breeding problem — 1,400 years after Bharata Muni. Gets naming credit in the West.", hi: 'खरगोश-प्रजनन समस्या के माध्यम से यूरोप में अनुक्रम पेश करता है — भरत मुनि के 1,400 साल बाद।', sa: 'खरगोश-प्रजनन समस्या के माध्यम से यूरोप में अनुक्रम पेश करता है — भरत मुनि के 1,400 साल बाद।', mai: 'खरगोश-प्रजनन समस्या के माध्यम से यूरोप में अनुक्रम पेश करता है — भरत मुनि के 1,400 साल बाद।', mr: 'खरगोश-प्रजनन समस्या के माध्यम से यूरोप में अनुक्रम पेश करता है — भरत मुनि के 1,400 साल बाद।', ta: "Introduces sequence to Europe via rabbit-breeding problem — 1,400 years after Bharata Muni. Gets naming credit in the West.", te: "Introduces sequence to Europe via rabbit-breeding problem — 1,400 years after Bharata Muni. Gets naming credit in the West.", bn: "Introduces sequence to Europe via rabbit-breeding problem — 1,400 years after Bharata Muni. Gets naming credit in the West.", kn: "Introduces sequence to Europe via rabbit-breeding problem — 1,400 years after Bharata Muni. Gets naming credit in the West.", gu: "Introduces sequence to Europe via rabbit-breeding problem — 1,400 years after Bharata Muni. Gets naming credit in the West." },
    color: 'border-red-400/40',
    badge: { en: 'EUROPE', hi: 'यूरोप', sa: 'यूरोप', mai: 'यूरोप', mr: 'यूरोप', ta: 'EUROPE', te: 'EUROPE', bn: 'EUROPE', kn: 'EUROPE', gu: 'EUROPE' },
    badgeColor: 'bg-red-500/20 text-red-400',
  },
];

const NATURE_EXAMPLES = [
  { item: { en: 'Sunflower spirals', hi: 'सूरजमुखी सर्पिल', sa: 'सूरजमुखी सर्पिल', mai: 'सूरजमुखी सर्पिल', mr: 'सूरजमुखी सर्पिल', ta: 'Sunflower spirals', te: 'Sunflower spirals', bn: 'Sunflower spirals', kn: 'Sunflower spirals', gu: 'Sunflower spirals' }, detail: { en: '34 clockwise, 55 counterclockwise', hi: '34 दक्षिणावर्त, 55 वामावर्त', sa: '34 दक्षिणावर्त, 55 वामावर्त', mai: '34 दक्षिणावर्त, 55 वामावर्त', mr: '34 दक्षिणावर्त, 55 वामावर्त', ta: '34 கடிகார திசை, 55 எதிர் கடிகார திசை', te: '34 సవ్యదిశ, 55 అపసవ్యదిశ', bn: '34 ঘড়ির কাঁটার দিকে, 55 বিপরীত দিকে', kn: '34 ಪ್ರದಕ್ಷಿಣ, 55 ಅಪ್ರದಕ್ಷಿಣ', gu: '34 ઘડિયાળની દિશામાં, 55 વિરુદ્ધ દિશામાં' } },
  { item: { en: 'Lily petals', hi: 'लिली की पंखुड़ियाँ', sa: 'लिली की पंखुड़ियाँ', mai: 'लिली की पंखुड़ियाँ', mr: 'लिली की पंखुड़ियाँ', ta: 'Lily petals', te: 'Lily petals', bn: 'Lily petals', kn: 'Lily petals', gu: 'Lily petals' }, detail: { en: '3 petals', hi: '3 पंखुड़ियाँ', sa: '3 पंखुड़ियाँ', mai: '3 पंखुड़ियाँ', mr: '3 पंखुड़ियाँ', ta: '3 இதழ்கள்', te: '3 రేకులు', bn: '3টি পাপড়ি', kn: '3 ದಳಗಳು', gu: '3 પાંખડીઓ' } },
  { item: { en: 'Buttercup petals', hi: 'बटरकप की पंखुड़ियाँ', sa: 'बटरकप की पंखुड़ियाँ', mai: 'बटरकप की पंखुड़ियाँ', mr: 'बटरकप की पंखुड़ियाँ', ta: 'Buttercup petals', te: 'Buttercup petals', bn: 'Buttercup petals', kn: 'Buttercup petals', gu: 'Buttercup petals' }, detail: { en: '5 petals', hi: '5 पंखुड़ियाँ', sa: '5 पंखुड़ियाँ', mai: '5 पंखुड़ियाँ', mr: '5 पंखुड़ियाँ', ta: '5 இதழ்கள்', te: '5 రేకులు', bn: '5টি পাপড়ি', kn: '5 ದಳಗಳು', gu: '5 પાંખડીઓ' } },
  { item: { en: 'Delphinium petals', hi: 'डेल्फीनियम पंखुड़ियाँ', sa: 'डेल्फीनियम पंखुड़ियाँ', mai: 'डेल्फीनियम पंखुड़ियाँ', mr: 'डेल्फीनियम पंखुड़ियाँ', ta: 'Delphinium petals', te: 'Delphinium petals', bn: 'Delphinium petals', kn: 'Delphinium petals', gu: 'Delphinium petals' }, detail: { en: '8 petals', hi: '8 पंखुड़ियाँ', sa: '8 पंखुड़ियाँ', mai: '8 पंखुड़ियाँ', mr: '8 पंखुड़ियाँ', ta: '8 இதழ்கள்', te: '8 రేకులు', bn: '8টি পাপড়ি', kn: '8 ದಳಗಳು', gu: '8 પાંખડીઓ' } },
  { item: { en: 'Nautilus shell', hi: 'नॉटिलस शेल', sa: 'नॉटिलस शेल', mai: 'नॉटिलस शेल', mr: 'नॉटिलस शेल', ta: 'Nautilus shell', te: 'Nautilus shell', bn: 'Nautilus shell', kn: 'Nautilus shell', gu: 'Nautilus shell' }, detail: { en: 'phi = 1.618... golden ratio spiral', hi: 'phi = 1.618... स्वर्णिम अनुपात सर्पिल', sa: 'phi = 1.618... स्वर्णिम अनुपात सर्पिल', mai: 'phi = 1.618... स्वर्णिम अनुपात सर्पिल', mr: 'phi = 1.618... स्वर्णिम अनुपात सर्पिल', ta: 'phi = 1.618... golden ratio spiral', te: 'phi = 1.618... golden ratio spiral', bn: 'phi = 1.618... golden ratio spiral', kn: 'phi = 1.618... golden ratio spiral', gu: 'phi = 1.618... golden ratio spiral' } },
  { item: { en: 'Pine cone spirals', hi: 'पाइन शंकु सर्पिल', sa: 'पाइन शंकु सर्पिल', mai: 'पाइन शंकु सर्पिल', mr: 'पाइन शंकु सर्पिल', ta: 'Pine cone spirals', te: 'Pine cone spirals', bn: 'Pine cone spirals', kn: 'Pine cone spirals', gu: 'Pine cone spirals' }, detail: { en: '8 and 13 spiral rows', hi: '8 और 13 सर्पिल पंक्तियाँ', sa: '8 और 13 सर्पिल पंक्तियाँ', mai: '8 और 13 सर्पिल पंक्तियाँ', mr: '8 और 13 सर्पिल पंक्तियाँ', ta: '8 மற்றும் 13 சுருள் வரிசைகள்', te: '8 మరియు 13 సర్పిలాకార వరుసలు', bn: '8 এবং 13 সর্পিল সারি', kn: '8 ಮತ್ತು 13 ಸುರುಳಿ ಸಾಲುಗಳು', gu: '8 અને 13 સર્પાકાર હરોળ' } },
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
  const hi = isDevanagariLocale(locale);
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

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
              {t('title')}
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
            <div className="flex justify-center mt-4">
              <ShareRow pageTitle={t('title')} locale={locale} />
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
        <LessonSection number={1} title={t('s1Title')} variant="highlight">
          <div className="mb-4 inline-flex items-center gap-2 bg-gold-primary/15 border border-gold-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-gold-light uppercase tracking-wider">
            {hi ? 'सबसे पुरानी खोज — संगीत से' : 'Earliest Discovery — From Music'}
          </div>
          <p>{t('s1Body')}</p>

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
        <LessonSection number={2} title={t('s2Title')}>
          <p>{t('s2Body')}</p>
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
        <LessonSection number={3} title={t('s3Title')} variant="highlight">
          <p>{t('s3Body')}</p>
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
        <LessonSection number={4} title={t('s4Title')}>
          <p>{t('s4Body')}</p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: { en: 'Hemachandra wrote', hi: 'हेमचंद्र ने लिखा', sa: 'हेमचंद्र ने लिखा', mai: 'हेमचंद्र ने लिखा', mr: 'हेमचंद्र ने लिखा', ta: 'Hemachandra wrote', te: 'Hemachandra wrote', bn: 'Hemachandra wrote', kn: 'Hemachandra wrote', gu: 'Hemachandra wrote' }, val: '1150 CE', color: 'border-violet-400/30' },
              { label: { en: 'Fibonacci published', hi: 'फिबोनाची ने प्रकाशित किया', sa: 'फिबोनाची ने प्रकाशित किया', mai: 'फिबोनाची ने प्रकाशित किया', mr: 'फिबोनाची ने प्रकाशित किया', ta: 'Fibonacci published', te: 'Fibonacci published', bn: 'Fibonacci published', kn: 'Fibonacci published', gu: 'Fibonacci published' }, val: '1202 CE', color: 'border-red-400/30' },
              { label: { en: 'Gap', hi: 'अंतर', sa: 'अंतर', mai: 'अंतर', mr: 'अंतर', ta: 'Gap', te: 'Gap', bn: 'Gap', kn: 'Gap', gu: 'Gap' }, val: '52 years', color: 'border-gold-primary/30' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl bg-white/[0.02] border ${item.color} p-4 text-center`}>
                <div className="text-gold-primary font-bold text-2xl">{item.val}</div>
                <div className="text-text-secondary text-sm mt-1">{lt(item.label as LocaleText, locale)}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 5 — HOW FIBONACCI GOT CREDIT ═══ */}
        <LessonSection number={5} title={t('s5Title')} variant="highlight">
          <p>{t('s5Body')}</p>
          <div className="mt-5 bg-white/[0.02] border border-amber-500/20 rounded-xl p-5">
            <div className="text-amber-400 font-semibold text-sm mb-2">
              {hi ? 'अनुवाद श्रृंखला' : 'The translation chain'}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
              {([
                { en: 'India', hi: 'भारत', sa: 'भारत', mai: 'भारत', mr: 'भारत', ta: 'இந்தியா', te: 'భారతదేశం', bn: 'ভারত', kn: 'ಭಾರತ', gu: 'ભારત' },
                '→',
                { en: 'Baghdad (Arabic translations)', hi: 'बगदाद (अरबी अनुवाद)', sa: 'बगदाद (अरबी अनुवाद)', mai: 'बगदाद (अरबी अनुवाद)', mr: 'बगदाद (अरबी अनुवाद)', ta: 'Baghdad (Arabic translations)', te: 'Baghdad (Arabic translations)', bn: 'Baghdad (Arabic translations)', kn: 'Baghdad (Arabic translations)', gu: 'Baghdad (Arabic translations)' },
                '→',
                { en: 'North Africa (merchants)', hi: 'उत्तरी अफ्रीका (व्यापारी)', sa: 'उत्तरी अफ्रीका (व्यापारी)', mai: 'उत्तरी अफ्रीका (व्यापारी)', mr: 'उत्तरी अफ्रीका (व्यापारी)', ta: 'North Africa (merchants)', te: 'North Africa (merchants)', bn: 'North Africa (merchants)', kn: 'North Africa (merchants)', gu: 'North Africa (merchants)' },
                '→',
                { en: 'Fibonacci in Pisa', hi: 'पीसा में फिबोनाची', sa: 'पीसा में फिबोनाची', mai: 'पीसा में फिबोनाची', mr: 'पीसा में फिबोनाची', ta: 'Fibonacci in Pisa', te: 'Fibonacci in Pisa', bn: 'Fibonacci in Pisa', kn: 'Fibonacci in Pisa', gu: 'Fibonacci in Pisa' },
                '→',
                { en: 'Europe (Liber Abaci, 1202 CE)', hi: 'यूरोप (लिबर अबासी, 1202 ईस्वी)', sa: 'यूरोप (लिबर अबासी, 1202 ईस्वी)', mai: 'यूरोप (लिबर अबासी, 1202 ईस्वी)', mr: 'यूरोप (लिबर अबासी, 1202 ईस्वी)', ta: 'Europe (Liber Abaci, 1202 CE)', te: 'Europe (Liber Abaci, 1202 CE)', bn: 'Europe (Liber Abaci, 1202 CE)', kn: 'Europe (Liber Abaci, 1202 CE)', gu: 'Europe (Liber Abaci, 1202 CE)' },
              ] as Array<string | Record<string, string>>).map((item, i) =>
                typeof item === 'string' ? (
                  <span key={i} className="text-gold-primary/50">{item}</span>
                ) : (
                  <span key={i} className="bg-white/[0.03] border border-white/[0.06] rounded px-2 py-0.5">{lt(item as LocaleText, locale)}</span>
                )
              )}
            </div>
          </div>
        </LessonSection>

        {/* ═══ SECTION 6 — NATURE ═══ */}
        <LessonSection number={6} title={t('s6Title')}>
          <p>{t('s6Body')}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {NATURE_EXAMPLES.map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.02] border border-gold-primary/15 p-4 text-center"
              >
                <div className="text-gold-light font-semibold text-sm">{lt(item.item as LocaleText, locale)}</div>
                <div className="text-text-secondary text-xs mt-1 font-mono">{lt(item.detail as LocaleText, locale)}</div>
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
        <LessonSection number={7} title={t('s7Title')} variant="highlight">
          <p>{t('s7Body')}</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { domain: { en: 'Music', hi: 'संगीत', sa: 'संगीत', mai: 'संगीत', mr: 'संगीत', ta: 'Music', te: 'Music', bn: 'Music', kn: 'Music', gu: 'Music' }, who: { en: 'Bharata Muni', hi: 'भरत मुनि', sa: 'भरत मुनि', mai: 'भरत मुनि', mr: 'भरत मुनि', ta: 'Bharata Muni', te: 'Bharata Muni', bn: 'Bharata Muni', kn: 'Bharata Muni', gu: 'Bharata Muni' }, year: '~200 BCE' },
              { domain: { en: 'Poetry', hi: 'कविता', sa: 'कविता', mai: 'कविता', mr: 'कविता', ta: 'Poetry', te: 'Poetry', bn: 'Poetry', kn: 'Poetry', gu: 'Poetry' }, who: { en: 'Pingala', hi: 'पिंगल', sa: 'पिंगल', mai: 'पिंगल', mr: 'पिंगल', ta: 'Pingala', te: 'Pingala', bn: 'Pingala', kn: 'Pingala', gu: 'Pingala' }, year: '~200 BCE' },
              { domain: { en: 'Nature', hi: 'प्रकृति', sa: 'प्रकृति', mai: 'प्रकृति', mr: 'प्रकृति', ta: 'Nature', te: 'Nature', bn: 'Nature', kn: 'Nature', gu: 'Nature' }, who: { en: 'Spirals & Petals', hi: 'सर्पिल और पंखुड़ियाँ', sa: 'सर्पिल और पंखुड़ियाँ', mai: 'सर्पिल और पंखुड़ियाँ', mr: 'सर्पिल और पंखुड़ियाँ', ta: 'Spirals & Petals', te: 'Spirals & Petals', bn: 'Spirals & Petals', kn: 'Spirals & Petals', gu: 'Spirals & Petals' }, year: 'Always' },
              { domain: { en: 'Finance', hi: 'वित्त', sa: 'वित्त', mai: 'वित्त', mr: 'वित्त', ta: 'Finance', te: 'Finance', bn: 'Finance', kn: 'Finance', gu: 'Finance' }, who: { en: 'Elliott Waves', hi: 'इलियट वेव्स', sa: 'इलियट वेव्स', mai: 'इलियट वेव्स', mr: 'इलियट वेव्स', ta: 'Elliott Waves', te: 'Elliott Waves', bn: 'Elliott Waves', kn: 'Elliott Waves', gu: 'Elliott Waves' }, year: '1938 CE' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.02] border border-gold-primary/15 p-4 text-center"
              >
                <div className="text-gold-light font-bold text-base mb-1">{lt(item.domain as LocaleText, locale)}</div>
                <div className="text-text-secondary text-xs">{lt(item.who as LocaleText, locale)}</div>
                <div className="text-text-secondary/50 text-xs mt-0.5 font-mono">{item.year}</div>
              </div>
            ))}
          </div>
        </LessonSection>

        {/* ═══ SECTION 8 — TIMELINE ═══ */}
        <LessonSection number={8} title={t('s8Title')}>
          <p className="mb-6">{t('s8Body')}</p>
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
                  <div className="text-text-secondary text-sm leading-relaxed">{lt(item.event as LocaleText, locale)}</div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.badgeColor}`}>
                    {lt(item.badge as LocaleText, locale)}
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
            ← {t('backToContributions')}
          </Link>
          <Link
            href="/learn/contributions/binary"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-all text-sm font-medium"
          >
            {t('nextPage')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
