'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: '2,000 Years of Indian Science — A Visual Timeline',
    hi: '2,000 वर्षों का भारतीय विज्ञान — एक दृश्य कालरेखा',
  },
  subtitle: {
    en: 'From Vedic mathematics to the Kerala School of Calculus, India\'s contributions to science span two millennia. Most are still attributed to European discoverers who came centuries later.',
    hi: 'वैदिक गणित से लेकर केरल कलनशास्त्र विद्यालय तक, विज्ञान में भारत के योगदान दो सहस्राब्दियों में फैले हैं। अधिकांश का श्रेय अब भी उन यूरोपीय खोजकर्ताओं को दिया जाता है जो सदियों बाद आए।',
  },
  europeLabel: {
    en: 'Europe:',
    hi: 'यूरोप:',
  },
  learnMore: {
    en: 'Learn more',
    hi: 'और जानें',
  },
  summaryTitle: {
    en: 'The Attribution Gap',
    hi: 'श्रेय का अंतर',
  },
  summaryBody: {
    en: 'Of these 16 discoveries, 14 are attributed to European scientists who came centuries later. Indian mathematicians and astronomers were solving differential equations, computing calculus, and describing gravity — while Europe was still centuries away from these ideas.',
    hi: 'इन 16 खोजों में से 14 का श्रेय उन यूरोपीय वैज्ञानिकों को दिया जाता है जो सदियों बाद आए। भारतीय गणितज्ञ और खगोलशास्त्री अवकल समीकरण हल कर रहे थे, कलनशास्त्र की गणना कर रहे थे और गुरुत्वाकर्षण का वर्णन कर रहे थे — जबकि यूरोप इन विचारों से अभी भी सदियों दूर था।',
  },
  crossRefTitle: {
    en: 'Explore the Full Stories',
    hi: 'पूरी कहानियाँ देखें',
  },
};

/* ════════════════════════════════════════════════════════════════
   TIMELINE DATA
   ════════════════════════════════════════════════════════════════ */
interface TimelineEntry {
  id: string;
  date: { en: string; hi: string };
  person: { en: string; hi: string };
  contribution: { en: string; hi: string };
  europe: { en: string; hi: string } | null;
  link: string | null;
}

const TIMELINE: TimelineEntry[] = [
  {
    id: 'sulba',
    date: { en: '~1500 BCE', hi: '~1500 ईसा पूर्व' },
    person: { en: 'Sulba Sutras — Baudhayana', hi: 'शुल्बसूत्र — बौधायन' },
    contribution: {
      en: 'Pythagorean theorem stated and proved. √2 computed to 1.41421356 — accurate to 5 decimal places.',
      hi: 'पाइथागोरस प्रमेय का कथन और प्रमाण। √2 = 1.41421356 — 5 दशमलव स्थानों तक सटीक।',
    },
    europe: {
      en: 'Pythagoras ~500 BCE — 1,000 years later',
      hi: 'पाइथागोरस ~500 ईसा पूर्व — 1,000 वर्ष बाद',
    },
    link: null,
  },
  {
    id: 'panini',
    date: { en: '~500 BCE', hi: '~500 ईसा पूर्व' },
    person: { en: 'Panini', hi: 'पाणिनि' },
    contribution: {
      en: 'Ashtadhyayi — the world\'s first formal grammar system, equivalent to a programming language. 3,959 rules describing Sanskrit with zero ambiguity.',
      hi: 'अष्टाध्यायी — विश्व की पहली औपचारिक व्याकरण प्रणाली, एक प्रोग्रामिंग भाषा के समतुल्य। संस्कृत का बिना किसी अस्पष्टता के 3,959 नियमों में वर्णन।',
    },
    europe: {
      en: 'Backus-Naur Form (formal grammars in CS) — 1959 CE, ~2,500 years later',
      hi: 'बैकस-नौर फॉर्म (CS में औपचारिक व्याकरण) — 1959 ई., ~2,500 वर्ष बाद',
    },
    link: null,
  },
  {
    id: 'pingala-binary',
    date: { en: '~200 BCE', hi: '~200 ईसा पूर्व' },
    person: { en: 'Pingala', hi: 'पिंगल' },
    contribution: {
      en: 'Binary number system described in Chandahshastra. Meruprastara (Pascal\'s triangle) and Fibonacci-like sequences in prosody — 1,800 years before Pascal and Fibonacci.',
      hi: 'छंदशास्त्र में द्विआधारी संख्या प्रणाली का वर्णन। मेरुप्रस्तार (पास्कल त्रिभुज) और फिबोनाची जैसी अनुक्रमणियाँ — पास्कल और फिबोनाची से 1,800 वर्ष पूर्व।',
    },
    europe: {
      en: 'Leibniz binary (1703), Pascal\'s triangle (1653) — 1,800–1,900 years later',
      hi: 'लाइबनिज द्विआधारी (1703), पास्कल त्रिभुज (1653) — 1,800–1,900 वर्ष बाद',
    },
    link: '/learn/contributions/binary',
  },
  {
    id: 'pingala-fibonacci',
    date: { en: '~200 BCE', hi: '~200 ईसा पूर्व' },
    person: { en: 'Bharata Muni', hi: 'भरत मुनि' },
    contribution: {
      en: 'Natyashastra — 22 shrutis (microtonal intervals), Fibonacci-like sequences embedded in tala (rhythmic cycles). First systematic musicology.',
      hi: 'नाट्यशास्त्र — 22 श्रुतियाँ (सूक्ष्म स्वर अंतराल), ताल चक्रों में फिबोनाची जैसी अनुक्रमणियाँ। पहला व्यवस्थित संगीतशास्त्र।',
    },
    europe: null,
    link: '/learn/contributions/fibonacci',
  },
  {
    id: 'bakhshali',
    date: { en: '~150 CE', hi: '~150 ई.' },
    person: { en: 'Bakhshali Manuscript', hi: 'बख्शाली पांडुलिपि' },
    contribution: {
      en: 'Earliest known use of the zero symbol (a dot, ṣūnya) as a placeholder in positional notation. Predates Brahmagupta\'s formal zero by ~500 years.',
      hi: 'स्थानीय मान में शून्य प्रतीक (बिंदु, शून्य) के रूप में प्रयोग का सबसे पुराना ज्ञात उदाहरण। ब्रह्मगुप्त के औपचारिक शून्य से ~500 वर्ष पूर्व।',
    },
    europe: {
      en: 'Zero concept reached Europe via Arabs ~12th–13th century CE',
      hi: 'शून्य की अवधारणा अरबों के माध्यम से यूरोप पहुँची ~12वीं–13वीं शताब्दी ई.',
    },
    link: '/learn/contributions/zero',
  },
  {
    id: 'surya-siddhanta',
    date: { en: '~400 CE', hi: '~400 ई.' },
    person: { en: 'Surya Siddhanta', hi: 'सूर्य सिद्धान्त' },
    contribution: {
      en: 'Precise planetary orbital periods accurate to seconds. Codified the 24-hora system (our "hour" derives from hora). Ahoratra — the concept of a sidereal day.',
      hi: 'ग्रहों की कक्षीय अवधि सेकंड तक सटीक। 24-होरा प्रणाली का संहिताकरण (हमारा "hour" होरा से आया है)। अहोरात्र — नाक्षत्र दिवस की अवधारणा।',
    },
    europe: null,
    link: '/learn/hora',
  },
  {
    id: 'aryabhata',
    date: { en: '499 CE', hi: '499 ई.' },
    person: { en: 'Aryabhata', hi: 'आर्यभट' },
    contribution: {
      en: 'Earth rotates on its axis (not the sky). π = 3.1416 (correct to 4 decimal places). Complete sine tables. Earth\'s circumference within 0.3% of actual value.',
      hi: 'पृथ्वी अपनी धुरी पर घूमती है (आकाश नहीं)। π = 3.1416 (4 दशमलव स्थानों तक सही)। पूर्ण ज्या सारणी। पृथ्वी की परिधि वास्तविक मान के 0.3% के भीतर।',
    },
    europe: {
      en: 'Copernicus: heliocentric model 1543 CE (~1,044 years later)',
      hi: 'कोपर्निकस: सूर्यकेंद्रीय मॉडल 1543 ई. (~1,044 वर्ष बाद)',
    },
    link: '/learn/contributions/earth-rotation',
  },
  {
    id: 'varahamihira',
    date: { en: '~505 CE', hi: '~505 ई.' },
    person: { en: 'Varahamihira', hi: 'वराहमिहिर' },
    contribution: {
      en: 'Brihat Samhita — hora system proof establishing weekday names. Early description of gravitational force. Comprehensive treatise covering astronomy, astrology, and natural phenomena.',
      hi: 'बृहत्संहिता — वार नामों की स्थापना करने वाली होरा प्रणाली का प्रमाण। गुरुत्वाकर्षण बल का प्रारंभिक वर्णन। खगोल, ज्योतिष और प्राकृतिक घटनाओं को समेटने वाला व्यापक ग्रंथ।',
    },
    europe: null,
    link: null,
  },
  {
    id: 'brahmagupta',
    date: { en: '628 CE', hi: '628 ई.' },
    person: { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
    contribution: {
      en: 'Zero as a number with defined arithmetic rules. Rules for negative numbers (debts and fortunes). First description of gravity as attraction. Quadratic formula.',
      hi: 'शून्य एक संख्या के रूप में परिभाषित अंकगणितीय नियमों के साथ। ऋण संख्याओं के नियम (ऋण और धन)। गुरुत्वाकर्षण का पहला वर्णन आकर्षण के रूप में। द्विघात सूत्र।',
    },
    europe: {
      en: 'Negative numbers accepted in Europe ~17th century; Newton\'s gravity 1687 CE',
      hi: 'ऋण संख्याएँ यूरोप में ~17वीं शताब्दी में स्वीकृत; न्यूटन का गुरुत्वाकर्षण 1687 ई.',
    },
    link: '/learn/contributions/zero',
  },
  {
    id: 'mahavira',
    date: { en: '~850 CE', hi: '~850 ई.' },
    person: { en: 'Mahavira', hi: 'महावीर' },
    contribution: {
      en: 'Ganitasarasangraha — extended negative number arithmetic, combinatorics, permutations and combinations with full proofs, LCM and GCD algorithms.',
      hi: 'गणितसारसंग्रह — ऋण संख्या अंकगणित का विस्तार, क्रमचय-संचय के पूर्ण प्रमाण, LCM और GCD एल्गोरिदम।',
    },
    europe: {
      en: 'Combinatorics formalized by Pascal/Fermat ~1650s CE — 800 years later',
      hi: 'क्रमचय-संचय पास्कल/फर्मा द्वारा ~1650 ई. में औपचारिक — 800 वर्ष बाद',
    },
    link: '/learn/contributions/negative-numbers',
  },
  {
    id: 'bhaskara',
    date: { en: '1150 CE', hi: '1150 ई.' },
    person: { en: 'Bhaskaracharya II', hi: 'भास्कराचार्य II' },
    contribution: {
      en: 'Siddhanta Shiromani — explicit statement that "Earth attracts all objects by its own force." Differential calculus concepts (instantaneous velocity). Lilavati — first algebra textbook with solved examples.',
      hi: 'सिद्धान्तशिरोमणि — स्पष्ट कथन कि "पृथ्वी अपनी शक्ति से सभी वस्तुओं को आकर्षित करती है।" अवकल कलनशास्त्र की अवधारणाएँ (तात्कालिक वेग)। लीलावती — हल उदाहरणों सहित पहली बीजगणित पाठ्यपुस्तक।',
    },
    europe: {
      en: 'Newton\'s gravity 1687 CE — 537 years later; Newton/Leibniz calculus ~1670s',
      hi: 'न्यूटन का गुरुत्वाकर्षण 1687 ई. — 537 वर्ष बाद; न्यूटन/लाइबनिज का कलनशास्त्र ~1670 ई.',
    },
    link: '/learn/contributions/gravity',
  },
  {
    id: 'hemachandra',
    date: { en: '1150 CE', hi: '1150 ई.' },
    person: { en: 'Hemachandra', hi: 'हेमचंद्र' },
    contribution: {
      en: 'Fibonacci sequence derived from Sanskrit prosody — 52 years before Leonardo Fibonacci published it in Europe. The sequence 1, 1, 2, 3, 5, 8... used to count rhythmic patterns.',
      hi: 'संस्कृत छंदशास्त्र से फिबोनाची अनुक्रम — यूरोप में लियोनार्डो फिबोनाची के प्रकाशन से 52 वर्ष पूर्व। 1, 1, 2, 3, 5, 8... अनुक्रम का प्रयोग लयबद्ध पैटर्न गिनने के लिए।',
    },
    europe: {
      en: 'Leonardo Fibonacci 1202 CE — 52 years later',
      hi: 'लियोनार्डो फिबोनाची 1202 ई. — 52 वर्ष बाद',
    },
    link: '/learn/contributions/fibonacci',
  },
  {
    id: 'sayana',
    date: { en: '~1350 CE', hi: '~1350 ई.' },
    person: { en: 'Sayana', hi: 'सायण' },
    contribution: {
      en: 'Commentary on Rigveda yields a speed-of-light calculation: 2,202 yojanas per half-nimesa. Modern conversion: ~299,000 km/s — within 0.14% of the actual value (299,792 km/s).',
      hi: 'ऋग्वेद की टीका से प्रकाश गति की गणना: आधे निमेष में 2,202 योजन। आधुनिक परिवर्तन: ~299,000 किमी/से — वास्तविक मान (299,792 किमी/से) के 0.14% के भीतर।',
    },
    europe: {
      en: 'Rømer measures speed of light 1676 CE — 326 years later',
      hi: 'रोमर ने प्रकाश गति मापी 1676 ई. — 326 वर्ष बाद',
    },
    link: '/learn/contributions/speed-of-light',
  },
  {
    id: 'madhava',
    date: { en: '~1350 CE', hi: '~1350 ई.' },
    person: { en: 'Madhava of Sangamagrama', hi: 'संगमग्राम के माधव' },
    contribution: {
      en: 'Infinite series for π (Leibniz-Gregory series), sine, cosine, and arctangent — with rigorous proofs. This is calculus, 250 years before Newton and Leibniz.',
      hi: 'π के लिए अनंत श्रेणी (लाइबनिज-ग्रेगरी श्रेणी), ज्या, कोज्या और चापस्पर्शज्या — कठोर प्रमाणों के साथ। यह कलनशास्त्र है, न्यूटन और लाइबनिज से 250 वर्ष पूर्व।',
    },
    europe: {
      en: 'Newton & Leibniz calculus ~1665–1684 CE — 250+ years later',
      hi: 'न्यूटन और लाइबनिज का कलनशास्त्र ~1665–1684 ई. — 250+ वर्ष बाद',
    },
    link: '/learn/contributions/calculus',
  },
  {
    id: 'nilakantha',
    date: { en: '~1500 CE', hi: '~1500 ई.' },
    person: { en: 'Nilakantha Somayaji', hi: 'नीलकण्ठ सोमयाजि' },
    contribution: {
      en: 'Tantrasangraha — refined planetary models placing the Sun at the centre of inner planetary orbits. A near-heliocentric system, decades before Copernicus published in Europe.',
      hi: 'तन्त्रसंग्रह — परिष्कृत ग्रह मॉडल जो आंतरिक ग्रहों की कक्षाओं के केंद्र में सूर्य को रखते हैं। एक निकट-सूर्यकेंद्रीय प्रणाली, कोपर्निकस के यूरोप में प्रकाशन से दशकों पूर्व।',
    },
    europe: {
      en: 'Copernicus: De Revolutionibus 1543 CE',
      hi: 'कोपर्निकस: डी रेवोल्यूशनिबस 1543 ई.',
    },
    link: null,
  },
  {
    id: 'jyeshthadeva',
    date: { en: '~1530 CE', hi: '~1530 ई.' },
    person: { en: 'Jyeshthadeva', hi: 'ज्येष्ठदेव' },
    contribution: {
      en: 'Yuktibhasha — the world\'s first calculus textbook, written in Malayalam. Full proofs for Madhava\'s series, tangent series, and product rule. Predates any European calculus text by 150 years.',
      hi: 'युक्तिभाषा — विश्व की पहली कलनशास्त्र पाठ्यपुस्तक, मलयालम में लिखी। माधव की श्रेणी, स्पर्शज्या श्रेणी और गुणन नियम के पूर्ण प्रमाण। किसी भी यूरोपीय कलनशास्त्र पाठ्यपुस्तक से 150 वर्ष पूर्व।',
    },
    europe: {
      en: 'Newton\'s Principia 1687 CE — 157 years later',
      hi: 'न्यूटन की प्रिंसिपिया 1687 ई. — 157 वर्ष बाद',
    },
    link: '/learn/contributions/calculus',
  },
];

/* ════════════════════════════════════════════════════════════════
   CROSS-REFERENCE LINKS
   ════════════════════════════════════════════════════════════════ */
const CROSS_REFS: { label: { en: string; hi: string }; href: string }[] = [
  { label: { en: 'Calculus', hi: 'कलनशास्त्र' }, href: '/learn/contributions/calculus' },
  { label: { en: 'Zero', hi: 'शून्य' }, href: '/learn/contributions/zero' },
  { label: { en: 'Gravity', hi: 'गुरुत्वाकर्षण' }, href: '/learn/contributions/gravity' },
  { label: { en: 'Pi (π)', hi: 'पाई (π)' }, href: '/learn/contributions/pi' },
  { label: { en: 'Sine Tables', hi: 'ज्या सारणी' }, href: '/learn/contributions/sine' },
  { label: { en: 'Binary Numbers', hi: 'द्विआधारी संख्याएँ' }, href: '/learn/contributions/binary' },
  { label: { en: 'Fibonacci Sequence', hi: 'फिबोनाची अनुक्रम' }, href: '/learn/contributions/fibonacci' },
  { label: { en: 'Negative Numbers', hi: 'ऋण संख्याएँ' }, href: '/learn/contributions/negative-numbers' },
  { label: { en: 'Earth\'s Rotation', hi: 'पृथ्वी का घूर्णन' }, href: '/learn/contributions/earth-rotation' },
  { label: { en: 'Speed of Light', hi: 'प्रकाश की गति' }, href: '/learn/contributions/speed-of-light' },
  { label: { en: 'Cosmic Time', hi: 'ब्रह्मांडीय समय' }, href: '/learn/contributions/cosmic-time' },
  { label: { en: 'Hora System', hi: 'होरा प्रणाली' }, href: '/learn/hora' },
  { label: { en: 'Eclipses', hi: 'ग्रहण' }, href: '/learn/eclipses' },
];

/* ════════════════════════════════════════════════════════════════
   ANIMATIONS
   ════════════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

/* ════════════════════════════════════════════════════════════════
   CARD COMPONENT
   ════════════════════════════════════════════════════════════════ */
function TimelineCard({
  entry,
  side,
  locale,
  index,
}: {
  entry: TimelineEntry;
  side: 'left' | 'right';
  locale: string;
  index: number;
}) {
  const loc = locale as Locale;
  const t = (obj: { en: string; hi: string }) => (loc === 'hi' ? obj.hi : obj.en);
  const variant = side === 'left' ? fadeInLeft : fadeInRight;

  return (
    <motion.div
      className={`flex items-start gap-0 w-full ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variant}
    >
      {/* Card */}
      <div
        className={`w-[calc(50%-24px)] ${side === 'left' ? 'mr-6 text-right' : 'ml-6 text-left'}`}
      >
        <div
          className="relative rounded-2xl border border-purple-500/30 p-5 overflow-hidden group hover:border-purple-400/60 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(88,28,135,0.18) 0%, rgba(59,7,100,0.28) 50%, rgba(15,10,40,0.55) 100%)',
          }}
        >
          {/* Subtle glow on hover */}
          <div className="absolute inset-0 rounded-2xl bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-300 pointer-events-none" />

          {/* Date badge */}
          <div
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-gold-primary/40`}
            style={{ background: 'rgba(212,168,83,0.12)', color: '#f0d48a' }}
          >
            {t(entry.date)}
          </div>

          {/* Person / source */}
          <h3
            className="text-base font-bold mb-2 leading-snug"
            style={{ color: '#e6e2d8' }}
          >
            {t(entry.person)}
          </h3>

          {/* Contribution */}
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#a09890' }}>
            {t(entry.contribution)}
          </p>

          {/* Europe comparison */}
          {entry.europe && (
            <div
              className="rounded-lg px-3 py-2 mb-3 border border-amber-500/20"
              style={{ background: 'rgba(245,158,11,0.07)' }}
            >
              <span className="text-xs font-semibold" style={{ color: '#fbbf24' }}>
                {loc === 'hi' ? L.europeLabel.hi : L.europeLabel.en}{' '}
              </span>
              <span className="text-xs" style={{ color: '#d97706' }}>
                {t(entry.europe)}
              </span>
            </div>
          )}

          {/* Link */}
          {entry.link && (
            <Link
              href={entry.link as '/'}
              className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${side === 'left' ? 'justify-end' : 'justify-start'}`}
              style={{ color: '#d4a853' }}
            >
              {loc === 'hi' ? L.learnMore.hi : L.learnMore.en}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Centre dot (sits on the gold line) */}
      <div className="relative flex flex-col items-center" style={{ width: '48px', flexShrink: 0 }}>
        <div
          className="w-4 h-4 rounded-full border-2 border-gold-primary z-10 mt-6"
          style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a853)', boxShadow: '0 0 10px rgba(212,168,83,0.6)' }}
        />
      </div>

      {/* Empty space on the other side */}
      <div className="w-[calc(50%-24px)]" />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MOBILE CARD (single column)
   ════════════════════════════════════════════════════════════════ */
function TimelineCardMobile({
  entry,
  locale,
}: {
  entry: TimelineEntry;
  locale: string;
}) {
  const loc = locale as Locale;
  const t = (obj: { en: string; hi: string }) => (loc === 'hi' ? obj.hi : obj.en);

  return (
    <motion.div
      className="flex items-start gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeInUp}
    >
      {/* Left: dot on line */}
      <div className="flex flex-col items-center" style={{ minWidth: '28px' }}>
        <div
          className="w-4 h-4 rounded-full border-2 border-gold-primary mt-5 z-10"
          style={{ background: 'linear-gradient(135deg, #f0d48a, #d4a853)', boxShadow: '0 0 8px rgba(212,168,83,0.5)', flexShrink: 0 }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-2xl border border-purple-500/30 p-4 mb-2"
        style={{
          background: 'linear-gradient(135deg, rgba(88,28,135,0.18) 0%, rgba(59,7,100,0.28) 50%, rgba(15,10,40,0.55) 100%)',
        }}
      >
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-gold-primary/40"
          style={{ background: 'rgba(212,168,83,0.12)', color: '#f0d48a' }}
        >
          {t(entry.date)}
        </div>
        <h3 className="text-sm font-bold mb-1" style={{ color: '#e6e2d8' }}>
          {t(entry.person)}
        </h3>
        <p className="text-xs leading-relaxed mb-2" style={{ color: '#a09890' }}>
          {t(entry.contribution)}
        </p>
        {entry.europe && (
          <div
            className="rounded-lg px-3 py-2 mb-2 border border-amber-500/20"
            style={{ background: 'rgba(245,158,11,0.07)' }}
          >
            <span className="text-xs font-semibold" style={{ color: '#fbbf24' }}>
              {loc === 'hi' ? L.europeLabel.hi : L.europeLabel.en}{' '}
            </span>
            <span className="text-xs" style={{ color: '#d97706' }}>
              {t(entry.europe)}
            </span>
          </div>
        )}
        {entry.link && (
          <Link
            href={entry.link as '/'}
            className="inline-flex items-center gap-1 text-xs font-medium"
            style={{ color: '#d4a853' }}
          >
            {loc === 'hi' ? L.learnMore.hi : L.learnMore.en}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function TimelinePage() {
  const locale = useLocale();
  const loc = locale as Locale;
  const t = (obj: { en: string; hi: string }) => (loc === 'hi' ? obj.hi : obj.en);

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {/* ── Hero ── */}
      <motion.div
        className="mb-16 text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
      >
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-purple-500/40"
          style={{ background: 'rgba(139,92,246,0.12)', color: '#c4b5fd' }}
        >
          1500 BCE → 1530 CE
        </div>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          style={{ color: '#f0d48a' }}
        >
          {t(L.title)}
        </h1>

        <p className="text-base sm:text-lg leading-relaxed" style={{ color: '#8a8478' }}>
          {t(L.subtitle)}
        </p>
      </motion.div>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={t(L.title)} locale={locale as Locale} />
        </div>

      {/* ══════════════════════════════════════════
          DESKTOP TIMELINE (lg+)
          Alternating left/right with gold centre line
      ══════════════════════════════════════════ */}
      <div className="hidden lg:block relative mb-20">
        {/* Gold vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, #d4a853 5%, #d4a853 95%, transparent 100%)',
            boxShadow: '0 0 8px rgba(212,168,83,0.35)',
          }}
        />

        <div className="flex flex-col gap-8">
          {TIMELINE.map((entry, i) => (
            <TimelineCard
              key={entry.id}
              entry={entry}
              side={i % 2 === 0 ? 'left' : 'right'}
              locale={locale}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE TIMELINE (< lg)
          Single column with left-side line
      ══════════════════════════════════════════ */}
      <div className="lg:hidden relative mb-20 pl-2">
        {/* Left vertical line */}
        <div
          className="absolute left-[13px] top-0 bottom-0 w-0.5"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, #d4a853 3%, #d4a853 97%, transparent 100%)',
            boxShadow: '0 0 6px rgba(212,168,83,0.3)',
          }}
        />

        <div className="flex flex-col gap-4">
          {TIMELINE.map((entry) => (
            <TimelineCardMobile key={entry.id} entry={entry} locale={locale} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SUMMARY — ATTRIBUTION GAP
      ══════════════════════════════════════════ */}
      <motion.div
        className="mb-16 max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeInUp}
      >
        <div
          className="rounded-2xl border border-red-500/30 p-8 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(127,29,29,0.2) 0%, rgba(69,10,10,0.3) 50%, rgba(15,10,40,0.6) 100%)',
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full pointer-events-none"
            style={{ background: 'rgba(239,68,68,0.08)', filter: 'blur(32px)' }}
          />

          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border border-red-500/40"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5' }}
          >
            {t({ en: 'The Attribution Gap', hi: 'श्रेय का अंतर' })}
          </div>

          <p className="text-base sm:text-lg font-medium leading-relaxed relative z-10" style={{ color: '#e6e2d8' }}>
            {t(L.summaryBody)}
          </p>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          CROSS-REFERENCE LINKS
      ══════════════════════════════════════════ */}
      <motion.div
        className="mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={fadeInUp}
      >
        <h2
          className="text-xl font-bold mb-6 text-center"
          style={{ color: '#f0d48a' }}
        >
          {t(L.crossRefTitle)}
        </h2>

        <div className="flex flex-wrap gap-3 justify-center">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href as '/'}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:border-gold-primary/60 hover:bg-gold-primary/10"
              style={{
                borderColor: 'rgba(212,168,83,0.25)',
                color: '#d4a853',
                background: 'rgba(212,168,83,0.06)',
              }}
            >
              {t(ref.label)}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
