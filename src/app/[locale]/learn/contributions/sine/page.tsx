'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: 'Did You Know "Sine" Is a Sanskrit Word?',
    hi: 'क्या आप जानते हैं "Sine" एक संस्कृत शब्द है?',
  },
  subtitle: {
    en: 'Every GPS satellite, every computer animation, every bridge ever built uses the sine function. But almost nobody knows that "sine" comes from Sanskrit "Jya" (ज्या, meaning bowstring) — a 1,500-year journey of mistranslation that spans three languages and three continents.',
    hi: 'प्रत्येक GPS उपग्रह, प्रत्येक कंप्यूटर एनिमेशन, कभी बना प्रत्येक पुल — सभी ज्या फ़ंक्शन का उपयोग करते हैं। परंतु लगभग कोई नहीं जानता कि "sine" संस्कृत "ज्या" से आया है — एक 1,500 वर्ष की भ्रांत अनुवाद यात्रा जो तीन भाषाओं और तीन महाद्वीपों में फैली है।',
  },

  s1Title: { en: 'What Is Jya — The Sanskrit Bowstring', hi: 'ज्या क्या है — संस्कृत धनुष की प्रत्यंचा' },
  s1Body: {
    en: 'The Sanskrit word "Jya" (ज्या) or "Jiva" (जीवा) literally means the bowstring of a bow. Imagine a circle as a bow. Draw a chord across it — that chord is the "jya." Now, half that chord is the "Ardha-jya" (अर्धज्या) — half the bowstring. This half-chord is precisely what we call sine today. The ancient Indians defined the function using geometry they could see and touch: an archer\'s bow.',
    hi: '"ज्या" या "जीवा" शब्द का शाब्दिक अर्थ है धनुष की प्रत्यंचा। एक वृत्त को धनुष की तरह कल्पना करें। उस पर एक जीवा (chord) खींचें — यही "ज्या" है। अब उस जीवा का आधा "अर्धज्या" है — आधी प्रत्यंचा। यही अर्धज्या आज हम sine कहते हैं। प्राचीन भारतीयों ने इस फ़ंक्शन को ऐसी ज्यामिति से परिभाषित किया जिसे वे देख और छू सकते थे: एक धनुर्धर का धनुष।',
  },

  s2Title: {
    en: 'Aryabhata\'s Jya Table — The World\'s First Sine Table (499 CE)',
    hi: 'आर्यभट की ज्या तालिका — विश्व की प्रथम ज्या तालिका (499 ई.)',
  },
  s2Body: {
    en: 'In the Aryabhatiya (499 CE), the 23-year-old genius Aryabhata gave 24 values of Jya at 3.75° intervals, from 3.75° to 90°. He encoded them as a compact mnemonic verse in a base-225 system — an ingenious compression that let astronomers memorize the entire table. The accuracy is astonishing: correct to 3–4 decimal places, sufficient for celestial navigation.',
    hi: 'आर्यभटीय (499 ई.) में 23 वर्षीय प्रतिभाशाली आर्यभट ने 3.75° अंतराल पर 24 ज्या मान दिए, 3.75° से 90° तक। उन्होंने इन्हें 225 के आधार पर एक संक्षिप्त स्मृतिसहायक श्लोक में एन्कोड किया — एक चतुर संपीड़न जिससे ज्योतिषी पूरी तालिका याद कर सकते थे। सटीकता आश्चर्यजनक है: 3-4 दशमलव स्थानों तक सही, खगोलीय नेविगेशन के लिए पर्याप्त।',
  },
  s2Source: {
    en: 'Classical source: Aryabhatiya, Ganitapada (Mathematics Section), verse 12 — "makhi bhakhi phakhi dhakhi nakhi nakhi..." — a phonetic encoding of all 24 sine differences.',
    hi: 'मूल स्रोत: आर्यभटीय, गणितपाद, श्लोक 12 — "मखि भखि फखि धखि नखि नखि..." — सभी 24 ज्या अंतरों का ध्वन्यात्मक कूट।',
  },

  s3Title: {
    en: 'The Great Mistranslation: Jya → Sine',
    hi: 'महान भ्रांत अनुवाद: ज्या → Sine',
  },
  s3Body: {
    en: 'When Arab mathematicians translated Indian texts (~800 CE), they transliterated "Jiva" (जीवा) phonetically as "Jiba" in Arabic. Since Arabic is written without vowels, "Jiba" was later misread as "Jaib" (جيب) — an Arabic word meaning "fold, pocket, or bosom." When the 12th-century European translator Gerard of Cremona translated the Arabic text into Latin, he rendered "Jaib" as "Sinus" — the Latin word for fold or bay. "Sinus" then became the English "Sine." A pure naming accident. The mathematics was always Indian.',
    hi: 'जब अरब गणितज्ञों ने भारतीय ग्रंथों का अनुवाद किया (~800 ई.), उन्होंने "जीवा" को "जिबा" के रूप में ध्वन्यात्मक रूप से लिप्यंतरित किया। चूँकि अरबी बिना स्वरों के लिखी जाती है, "जिबा" को बाद में "जैब" (جيب) पढ़ा गया — एक अरबी शब्द जिसका अर्थ है "मोड़, जेब, या वक्ष।" जब 12वीं सदी के यूरोपीय अनुवादक जेरार्ड ऑफ क्रेमोना ने इसे लैटिन में अनुवाद किया, उन्होंने "जैब" को "Sinus" — मोड़ या खाड़ी के लिए लैटिन शब्द — के रूप में प्रस्तुत किया। "Sinus" फिर अंग्रेजी "Sine" बन गया। एक शुद्ध नामकरण दुर्घटना। गणित हमेशा भारतीय था।',
  },

  s4Title: { en: 'Accuracy Comparison: Aryabhata vs Modern Values', hi: 'सटीकता तुलना: आर्यभट बनाम आधुनिक मान' },
  s4Body: {
    en: 'Aryabhata\'s values, computed in 499 CE, hold up remarkably well against IEEE 754 double-precision floating point. The worst-case deviation is under 0.2%. For most values, the error is under 0.05% — achieved with no calculators, no computers, and no earlier mathematical tradition to build on.',
    hi: 'आर्यभट के मान, 499 ई. में गणित किए गए, IEEE 754 डबल-प्रिसिजन फ्लोटिंग पॉइंट के मुकाबले उल्लेखनीय रूप से सही हैं। सबसे खराब विचलन 0.2% से कम है। अधिकांश मानों के लिए त्रुटि 0.05% से कम — बिना कैलकुलेटर, बिना कंप्यूटर, और बिना किसी पूर्ववर्ती गणितीय परंपरा के हासिल।',
  },

  s5Title: {
    en: 'Beyond Sine — Cosine, Versine, and the Full Indian Trigonometry',
    hi: 'Sine से आगे — Cosine, Versine और पूर्ण भारतीय त्रिकोणमिति',
  },
  s5Body: {
    en: 'Aryabhata did not stop at sine. He defined a full system: Kojya (कोज्या) — the complement-jya, our cosine. Utkrama-jya (उत्क्रमज्या) — the "reverse jya," our versine (1 − cosine). Brahmagupta (628 CE) later added interpolation formulas for computing sine at intermediate angles — a method equivalent to Newton\'s forward-difference formula, rediscovered 1,000 years later.',
    hi: 'आर्यभट ने ज्या पर ही नहीं रुके। उन्होंने एक पूर्ण प्रणाली परिभाषित की: कोज्या — पूरक-ज्या, हमारा cosine। उत्क्रमज्या — "उलटी ज्या," हमारा versine (1 − cosine)। ब्रह्मगुप्त (628 ई.) ने बाद में मध्यवर्ती कोणों पर ज्या की गणना के लिए प्रक्षेप सूत्र जोड़े — एक विधि जो न्यूटन के फॉरवर्ड-डिफरेंस फॉर्मूला के समकक्ष है, जो 1,000 वर्ष बाद पुनः खोजी गई।',
  },

  s6Title: {
    en: 'How This App Uses Indian Trigonometry Every Day',
    hi: 'यह ऐप प्रतिदिन भारतीय त्रिकोणमिति का उपयोग कैसे करता है',
  },
  s6Body: {
    en: 'Every calculation in this app traces back to Aryabhata\'s trigonometry. Planet longitudes use sine and cosine to convert between spherical and ecliptic coordinates. Sunrise and sunset times use the sine rule to solve the spherical triangle of the observer\'s horizon. Eclipse magnitude calculations use the versine formula — Aryabhata\'s own contribution. The moon\'s latitude uses the same Jya table values, just at higher precision. When you view today\'s Panchang, you are seeing Aryabhata\'s mathematics, running in real time.',
    hi: 'इस ऐप में प्रत्येक गणना आर्यभट की त्रिकोणमिति से जुड़ती है। ग्रह देशान्तर गोलाकार और क्रांतिवृत्त निर्देशांकों के बीच रूपांतरण के लिए sine और cosine का उपयोग करते हैं। सूर्योदय और सूर्यास्त के समय की गणना के लिए sine नियम का उपयोग होता है। ग्रहण परिमाण गणना उत्क्रमज्या सूत्र का उपयोग करती है — आर्यभट का अपना योगदान। जब आप आज का पंचांग देखते हैं, तो आप आर्यभट का गणित वास्तविक समय में चलते देखते हैं।',
  },

  s7Title: {
    en: 'The Chain Summarized — 1,500 Years in One Flow',
    hi: 'श्रृंखला सारांश — एक प्रवाह में 1,500 वर्ष',
  },

  backLink: { en: '← Back to Learn', hi: '← सीखने पर वापस' },
  exploreMore: { en: 'Continue Exploring', hi: 'और जानें' },
  calculus: { en: 'Calculus in Kerala', hi: 'केरल में कलनशास्त्र' },
  earthRotation: { en: 'Earth Rotation (499 CE)', hi: 'पृथ्वी का घूर्णन (499 ई.)' },
};

const JYA_TABLE = [
  { deg: '3.75°', aryabhata: '225', modern: '224.86', error: '0.06%' },
  { deg: '7.50°', aryabhata: '449', modern: '448.75', error: '0.05%' },
  { deg: '11.25°', aryabhata: '671', modern: '670.72', error: '0.04%' },
  { deg: '15.00°', aryabhata: '890', modern: '889.82', error: '0.02%' },
  { deg: '18.75°', aryabhata: '1105', modern: '1105.1', error: '0.01%' },
  { deg: '22.50°', aryabhata: '1315', modern: '1315.6', error: '0.05%' },
  { deg: '30.00°', aryabhata: '1719', modern: '1719.0', error: '0.00%' },
  { deg: '45.00°', aryabhata: '2431', modern: '2431.1', error: '0.00%' },
  { deg: '60.00°', aryabhata: '3438', modern: '3437.7', error: '0.01%' },
  { deg: '90.00°', aryabhata: '3438', modern: '3437.7', error: '0.01%' },
];

const TRANSLATION_CHAIN = [
  { lang: 'Sanskrit', word: 'Jya / Jiva (ज्या / जीवा)', meaning: { en: 'Bowstring', hi: 'धनुष की प्रत्यंचा' }, year: '499 CE', color: '#f0d48a' },
  { lang: 'Arabic', word: 'Jiba (جيب)', meaning: { en: 'Transliteration of Jiva', hi: 'जीवा का ध्वन्यात्मक लिप्यंतरण' }, year: '~800 CE', color: '#60a5fa' },
  { lang: 'Arabic (misread)', word: 'Jaib (جيب)', meaning: { en: 'Fold / Pocket / Bosom', hi: 'मोड़ / जेब / वक्ष' }, year: '~900 CE', color: '#f87171' },
  { lang: 'Latin', word: 'Sinus', meaning: { en: 'Bay / Fold / Curve', hi: 'खाड़ी / मोड़ / वक्र' }, year: '~1150 CE', color: '#a78bfa' },
  { lang: 'English', word: 'Sine', meaning: { en: 'Mathematical function', hi: 'गणितीय फ़ंक्शन' }, year: '~1600 CE', color: '#34d399' },
];

const FUNCTIONS = [
  { sanskrit: 'Jya (ज्या)', english: 'Sine', formula: 'sin(θ)', desc: { en: 'Half the chord — the original definition', hi: 'आधी जीवा — मूल परिभाषा' } },
  { sanskrit: 'Kojya (कोज्या)', english: 'Cosine', formula: 'cos(θ)', desc: { en: 'Complement-jya — defined by Aryabhata', hi: 'पूरक-ज्या — आर्यभट द्वारा परिभाषित' } },
  { sanskrit: 'Utkrama-jya (उत्क्रमज्या)', english: 'Versine', formula: '1 − cos(θ)', desc: { en: 'Reverse jya — used in eclipse geometry', hi: 'उलटी ज्या — ग्रहण ज्यामिति में उपयोग' } },
  { sanskrit: 'Trijya (त्रिज्या)', english: 'Radius / R = 3438', formula: 'R = 3438\'', desc: { en: 'The base radius in arc-minutes', hi: 'चाप-मिनट में आधार त्रिज्या' } },
];

export default function SinePage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{l(L.title)}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{l(L.subtitle)}</p>
      </motion.div>

      {/* ── Section 1: What Is Jya ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s1Title)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s1Body)}</p>
            <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/15">
              <p className="text-gold-light text-xs font-semibold mb-1">{isHi ? 'मूल संस्कृत श्लोक' : 'Original Sanskrit Verse'}</p>
              <p className="text-text-primary text-sm font-mono">ज्या = अर्धज्या = sin(θ)</p>
              <p className="text-text-secondary text-xs mt-1">{isHi ? '"ज्या" = धनुष की प्रत्यंचा | "अर्ध" = आधा' : '"Jya" = bowstring of bow | "Ardha" = half'}</p>
            </div>
          </div>
          {/* TWO diagrams side by side: Greek chord vs Indian half-chord */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Greek approach: full chord */}
            <div className="text-center">
              <div className="text-red-400 text-xs font-bold mb-2 uppercase tracking-wider">{isHi ? 'यूनानी विधि — पूर्ण जीवा' : 'Greek Method — Full Chord'}</div>
              <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.3" />
                <circle cx="100" cy="100" r="2.5" fill="#f87171" opacity="0.5" />
                {/* Full chord */}
                <line x1="36" y1="60" x2="180" y2="60" stroke="#f87171" strokeWidth="2.5" />
                {/* Radii to endpoints */}
                <line x1="100" y1="100" x2="36" y2="60" stroke="#f87171" strokeWidth="1" opacity="0.4" />
                <line x1="100" y1="100" x2="180" y2="60" stroke="#f87171" strokeWidth="1" opacity="0.4" />
                {/* Arc */}
                <path d="M 36 60 A 80 80 0 0 1 180 60" fill="none" stroke="#f87171" strokeWidth="2" opacity="0.6" />
                <text x="100" y="50" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="bold">crd(2θ)</text>
                <text x="100" y="180" textAnchor="middle" fill="#8a8478" fontSize="7">{isHi ? 'टॉलेमी का जीवा → पूरी जीवा' : "Ptolemy's chord → full chord"}</text>
                <text x="100" y="192" textAnchor="middle" fill="#8a8478" fontSize="7">{isHi ? 'अजीब, दो कोणों की आवश्यकता' : 'Awkward — needs double angle'}</text>
              </svg>
            </div>

            {/* Indian approach: half-chord = Jya = sine */}
            <div className="text-center">
              <div className="text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">{isHi ? 'भारतीय विधि — अर्धज्या (= Sine!)' : 'Indian Method — Ardha-jya (= Sine!)'}</div>
              <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#34d399" strokeWidth="1.5" opacity="0.3" />
                <circle cx="100" cy="100" r="2.5" fill="#34d399" opacity="0.5" />
                {/* Half chord = sine */}
                <line x1="100" y1="40" x2="170" y2="40" stroke="#34d399" strokeWidth="3" />
                {/* Perpendicular to center */}
                <line x1="100" y1="100" x2="100" y2="40" stroke="#f0d48a" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
                {/* Radius to point */}
                <line x1="100" y1="100" x2="170" y2="40" stroke="#f0d48a" strokeWidth="1" opacity="0.5" />
                {/* Arc from top */}
                <path d="M 100 20 A 80 80 0 0 1 170 40" fill="none" stroke="#34d399" strokeWidth="2" opacity="0.6" />
                {/* Angle */}
                <path d="M 100 80 A 20 20 0 0 1 112 76" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="116" y="82" fill="#fbbf24" fontSize="10">θ</text>
                <text x="140" y="35" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">sin(θ)</text>
                <text x="88" y="72" textAnchor="end" fill="#f0d48a" fontSize="7" opacity="0.7">cos(θ)</text>
                <text x="100" y="180" textAnchor="middle" fill="#8a8478" fontSize="7">{isHi ? 'आर्यभट की ज्या → SINE का जन्म' : "Aryabhata's Jya → SINE is born"}</text>
                <text x="100" y="192" textAnchor="middle" fill="#34d399" fontSize="7">{isHi ? 'सुंदर, प्रत्यक्ष, एक कोण पर्याप्त' : 'Elegant — one angle, directly useful'}</text>
              </svg>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-xs text-text-secondary leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {isHi
              ? '💡 यूनानियों ने पूर्ण जीवा (chord) के साथ काम किया — जिसमें दो बिन्दुओं की आवश्यकता थी। भारतीयों ने विचार को सरल किया: आधी जीवा लें (अर्धज्या) — यह सीधे एक कोण से सम्बन्धित है। यह छोटा सा नवाचार ही sine फ़ंक्शन है, और इसने सम्पूर्ण त्रिकोणमिति को सम्भव बनाया।'
              : '💡 Greeks worked with full chords — needing two points on the circle. Indians simplified the idea: take HALF the chord (Ardha-jya) — it directly relates to a single angle. This small innovation IS the sine function, and it made all of trigonometry possible.'}
          </div>

          {/* Original detailed bowstring diagram */}
          <div className="flex justify-center mt-4">
            <svg viewBox="0 0 260 220" className="w-full max-w-[250px]">
              <defs>
                <linearGradient id="sineGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#8a6d2b" />
                </linearGradient>
              </defs>
              {/* Circle (the "bow") */}
              <circle cx="130" cy="110" r="85" fill="none" stroke="#4a9eff" strokeWidth="1.5" opacity="0.4" />
              {/* Center point */}
              <circle cx="130" cy="110" r="3" fill="#f0d48a" />
              {/* Chord (full Jya) */}
              <line x1="55" y1="65" x2="205" y2="65" stroke="url(#sineGold)" strokeWidth="2.5" />
              <text x="130" y="55" textAnchor="middle" fill="#f0d48a" fontSize="9" fontWeight="bold">{isHi ? 'ज्या (पूर्ण जीवा)' : 'Jya (full chord)'}</text>
              {/* Half chord = Ardha-jya = sine */}
              <line x1="130" y1="65" x2="205" y2="65" stroke="#34d399" strokeWidth="3" />
              <text x="170" y="80" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">{isHi ? 'अर्धज्या = sin' : 'Ardha-jya = sin'}</text>
              {/* Perpendicular from center to chord */}
              <line x1="130" y1="110" x2="130" y2="65" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Radius line */}
              <line x1="130" y1="110" x2="205" y2="65" stroke="#f0d48a" strokeWidth="1.2" opacity="0.5" />
              <text x="175" y="100" textAnchor="middle" fill="#f0d48a" fontSize="7" opacity="0.7">{isHi ? 'त्रिज्या R' : 'Radius R'}</text>
              {/* Angle arc */}
              <path d="M 155 110 A 25 25 0 0 0 144 88" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
              <text x="162" y="100" fill="#fbbf24" fontSize="8">θ</text>
              {/* Labels */}
              <text x="130" y="200" textAnchor="middle" fill="#8a8478" fontSize="7">{isHi ? 'वृत्त = धनुष | ज्या = प्रत्यंचा' : 'Circle = Bow | Jya = Bowstring'}</text>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ── Section 2: Aryabhata's Jya Table ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-2" style={hf}>{l(L.s2Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s2Body)}</p>

        {/* Source quote */}
        <div className="p-4 rounded-xl bg-gold-primary/8 border-l-4 border-gold-primary/50 mb-6">
          <p className="text-gold-light text-xs font-semibold mb-1">{isHi ? 'मूल स्रोत' : 'Classical Source'}</p>
          <p className="text-text-primary text-sm italic font-mono">आर्यभटीय, गणितपाद, श्लोक १२</p>
          <p className="text-text-secondary text-xs mt-1 font-mono">मखि भखि फखि धखि नखि नखि मखि फखि...</p>
          <p className="text-text-secondary text-xs mt-1">{l(L.s2Source)}</p>
        </div>

        {/* Accuracy table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-4">{isHi ? 'कोण' : 'Angle'}</th>
                <th className="text-right text-gold-light py-2 pr-4">{isHi ? 'आर्यभट (499 ई.)' : 'Aryabhata (499 CE)'}</th>
                <th className="text-right text-gold-light py-2 pr-4">{isHi ? 'आधुनिक मान' : 'Modern Value'}</th>
                <th className="text-right text-gold-light py-2">{isHi ? 'त्रुटि' : 'Error'}</th>
              </tr>
            </thead>
            <tbody>
              {JYA_TABLE.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="text-text-primary py-1.5 pr-4 font-mono">{row.deg}</td>
                  <td className="text-right text-text-primary py-1.5 pr-4 font-mono">{row.aryabhata}</td>
                  <td className="text-right text-text-secondary py-1.5 pr-4 font-mono">{row.modern}</td>
                  <td className={`text-right py-1.5 font-mono ${parseFloat(row.error) < 0.05 ? 'text-emerald-400' : 'text-amber-400'}`}>{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-xs mt-2 italic">{isHi ? '* मान R=3438 (चाप-मिनट त्रिज्या) के पैमाने पर' : '* Values on scale of R=3438 (radius in arc-minutes)'}</p>
      </motion.div>

      {/* ── Section 3: The Mistranslation Chain ──────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s3Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{l(L.s3Body)}</p>

        {/* Translation chain flow */}
        <div className="flex flex-col gap-3">
          {TRANSLATION_CHAIN.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0e27]" style={{ background: step.color }}>
                {i + 1}
              </div>
              <div className="flex-1 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: step.color }}>{step.lang}</span>
                  <span className="text-text-secondary text-xs">·</span>
                  <span className="text-text-primary text-sm font-mono font-semibold">{step.word}</span>
                  <span className="text-text-secondary text-xs">·</span>
                  <span className="text-text-secondary text-xs">{l(step.meaning)}</span>
                  <span className="ml-auto text-text-secondary text-xs">{step.year}</span>
                </div>
              </div>
              {i < TRANSLATION_CHAIN.length - 1 && (
                <div className="flex-shrink-0 text-text-secondary text-xs">↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-amber-200 text-xs">
            {isHi
              ? '⚡ वह क्षण जब "जिबा" को गलती से "जैब" (जेब) पढ़ा गया — यह एक अनुचित स्वर जोड़ने की त्रुटि थी, जो अरबी लिपि की एक सीमा है। इस एक पढ़ने की गलती ने "sine" का नाम बदल दिया, लेकिन गणित वही रहा।'
              : '⚡ The moment "Jiba" was misread as "Jaib" (pocket) — a vowel mis-insertion error, a limitation of written Arabic. This single misreading changed the name of "sine" forever. The mathematics was unchanged.'}
          </p>
        </div>
      </motion.div>

      {/* ── Section 4: Accuracy Comparison ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s4Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{l(L.s4Body)}</p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Year computed', hi: 'गणना वर्ष' }, value: '499 CE' },
            { label: { en: 'Values given', hi: 'दिए गए मान' }, value: '24' },
            { label: { en: 'Interval', hi: 'अंतराल' }, value: '3.75°' },
            { label: { en: 'Worst error', hi: 'सर्वाधिक त्रुटि' }, value: '< 0.2%' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-xl font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{l(stat.label)}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 5: Full Trigonometry System ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s5Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s5Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FUNCTIONS.map((fn, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/12">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-gold-light font-semibold text-sm">{fn.sanskrit}</span>
                <span className="text-emerald-400 font-mono text-sm">{fn.formula}</span>
              </div>
              <div className="text-text-secondary text-xs">{isHi ? fn.english + ' — ' : ''}{l(fn.desc)}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 6: App Connection ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s6Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s6Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '🪐', label: { en: 'Planet Longitudes', hi: 'ग्रह देशान्तर' }, detail: { en: 'Ecliptic ↔ Equatorial conversion uses sin/cos', hi: 'क्रांतिवृत्त ↔ भूमध्यरेखीय रूपांतरण sin/cos उपयोग' } },
            { icon: '🌅', label: { en: 'Sunrise / Sunset', hi: 'सूर्योदय / सूर्यास्त' }, detail: { en: 'Spherical triangle solved via sine rule', hi: 'गोलाकार त्रिकोण ज्या नियम से हल' } },
            { icon: '🌑', label: { en: 'Eclipse Geometry', hi: 'ग्रहण ज्यामिति' }, detail: { en: 'Magnitude computed with versine formula', hi: 'परिमाण उत्क्रमज्या सूत्र से गणित' } },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-text-primary text-sm font-semibold mb-1">{l(item.label)}</div>
                <div className="text-text-secondary text-xs">{l(item.detail)}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 7: Chain Summary ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s7Title)}</h3>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          {[
            { text: 'ज्या (Jya)', sub: 'Sanskrit, 499 CE', color: '#f0d48a' },
            { text: '→', color: '#8a8478' },
            { text: 'Jiba جيب', sub: 'Arabic, ~800 CE', color: '#60a5fa' },
            { text: '→', color: '#8a8478' },
            { text: 'Jaib جيب', sub: 'Misread, ~900 CE', color: '#f87171' },
            { text: '→', color: '#8a8478' },
            { text: 'Sinus', sub: 'Latin, ~1150 CE', color: '#a78bfa' },
            { text: '→', color: '#8a8478' },
            { text: 'Sine', sub: 'English, ~1600 CE', color: '#34d399' },
          ].map((item, i) => (
            item.text === '→'
              ? <span key={i} className="text-xl" style={{ color: item.color }}>→</span>
              : (
                <div key={i} className="flex flex-col items-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="font-bold font-mono" style={{ color: item.color }}>{item.text}</span>
                  {item.sub && <span className="text-text-secondary text-xs mt-0.5">{item.sub}</span>}
                </div>
              )
          ))}
        </div>
        <p className="text-text-secondary text-xs mt-4 italic">
          {isHi
            ? 'गणित हमेशा भारतीय था। केवल नाम खो गया।'
            : 'The mathematics was always Indian. Only the name got lost.'}
        </p>
      </motion.div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {l(L.backLink)}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/earth-rotation" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.earthRotation)} →
          </Link>
          <Link href="/learn/contributions/calculus" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.calculus)} →
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
