'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { BookOpen, ChevronDown, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { Locale } from '@/types/panchang';

// ─── Text Data ──────────────────────────────────────────────────────────────

interface ClassicalText {
  id: string;
  name: { en: string; hi: string; sa: string };
  author: { en: string; hi: string };
  date: string;
  chapters: number;
  verses: string;
  category: 'siddhanta' | 'hora';
  color: string;
  border: string;
  summary: { en: string; hi: string };
  keyContributions: { topic: string; detail: { en: string; hi: string }; status: 'still_used' | 'superseded' | 'partially_valid' }[];
  accuracyHighlights?: { value: string; given: string; modern: string; error: string }[];
  uniqueConcepts: { en: string; hi: string }[];
}

const TEXTS: ClassicalText[] = [
  {
    id: 'surya_siddhanta', category: 'siddhanta', chapters: 14, verses: '~500',
    name: { en: 'Surya Siddhanta', hi: 'सूर्य सिद्धान्त', sa: 'सूर्यसिद्धान्तः' },
    author: { en: 'Attributed to Surya (Sun God) via Maya Asura', hi: 'सूर्य देव द्वारा मय असुर को प्रकट' },
    date: '~400 CE (current recension)',
    color: 'text-amber-400', border: 'border-amber-500/20',
    summary: { en: 'The foundational astronomical treatise of India. Defines the computational framework for planetary positions, eclipses, and time divisions that all Hindu calendars still follow. Its synodic month value (29.530588 days) is accurate to 0.08 seconds.', hi: 'भारत का आधारभूत खगोलशास्त्रीय ग्रंथ। ग्रह स्थिति, ग्रहण और काल विभाग की गणना प्रणाली परिभाषित करता है। इसका संयुग्मी मास मान 0.08 सेकंड तक सटीक।' },
    keyContributions: [
      { topic: 'Synodic Month', detail: { en: '29.530588 days — accurate to 0.08 seconds vs modern value. The basis of Tithi calculation in all panchangs.', hi: '29.530588 दिन — आधुनिक मान से 0.08 सेकंड तक सटीक। सभी पंचांगों में तिथि गणना का आधार।' }, status: 'still_used' },
      { topic: 'Sidereal Year', detail: { en: '365.258756 days — off by ~3.4 minutes from modern value. Still used in traditional panchang compilation.', hi: '365.258756 दिन — आधुनिक मान से ~3.4 मिनट का अंतर। पारंपरिक पंचांग में अभी भी प्रयुक्त।' }, status: 'partially_valid' },
      { topic: 'Sine Table (Jya)', detail: { en: '24 sine values at 3.75° intervals with radius 3438. The word "sine" itself derives from Sanskrit "jya" via Arabic "jiba" → Latin "sinus."', hi: '3.75° अंतराल पर 24 ज्या मान। "sine" शब्द संस्कृत "ज्या" से आया: ज्या → अरबी जीब → लैटिन sinus।' }, status: 'still_used' },
      { topic: 'Rahu-Ketu as Mathematical Points', detail: { en: 'Treated lunar nodes as computed shadow bodies rather than physical planets — mathematically correct. Mean node computation still used.', hi: 'चंद्र नोड्स को गणितीय छाया पिंडों के रूप में माना — गणितीय रूप से सही। मध्य नोड गणना अभी भी प्रयुक्त।' }, status: 'still_used' },
      { topic: 'Precession (Ayanamsha)', detail: { en: 'Described precession but used a TREPIDATION model (oscillating back and forth) rather than steady precession. This is incorrect — precession increases monotonically at ~50.3"/year.', hi: 'प्रिसेशन का वर्णन किया लेकिन त्रेपिडेशन मॉडल (दोलनी) प्रयोग किया जो गलत है। प्रिसेशन एकदिशीय ~50.3" प्रति वर्ष है।' }, status: 'superseded' },
      { topic: 'Geocentric Model', detail: { en: 'Placed Earth at center with epicyclic planetary orbits. Superseded by heliocentric model (Copernicus, Kepler).', hi: 'पृथ्वी को केंद्र में रखा। सूर्यकेंद्रित मॉडल द्वारा प्रतिस्थापित।' }, status: 'superseded' },
    ],
    accuracyHighlights: [
      { value: 'Synodic month', given: '29.530588 d', modern: '29.530589 d', error: '0.08 sec' },
      { value: 'Sidereal month', given: '27.32167 d', modern: '27.32166 d', error: '0.09 sec' },
      { value: 'Sidereal year', given: '365.258756 d', modern: '365.256363 d', error: '3.4 min' },
    ],
    uniqueConcepts: [
      { en: 'Mean-to-true longitude computation framework for traditional panchangs', hi: 'पारंपरिक पंचांगों के लिए मध्य-से-स्पष्ट देशांतर गणना' },
      { en: 'Tithi, Nakshatra, Yoga, Karana definitions', hi: 'तिथि, नक्षत्र, योग, करण की परिभाषाएं' },
      { en: 'Eclipse magnitude and duration computation methods', hi: 'ग्रहण परिमाण और अवधि गणना विधियाँ' },
    ],
  },
  {
    id: 'aryabhatiya', category: 'siddhanta', chapters: 4, verses: '121',
    name: { en: 'Aryabhatiya', hi: 'आर्यभटीय', sa: 'आर्यभटीयम्' },
    author: { en: 'Aryabhata I (born 476 CE, Kusumapura/Patna)', hi: 'आर्यभट (जन्म 476 ई., कुसुमपुर/पटना)' },
    date: '499 CE (written at age 23)',
    color: 'text-emerald-400', border: 'border-emerald-500/20',
    summary: { en: 'A revolutionary 121-verse masterwork covering mathematics and astronomy. Aryabhata stated that Earth rotates on its axis — 1,000 years before Copernicus. His pi approximation (3.1416) was the most accurate in the ancient world. The word "sine" itself comes from his work.', hi: '121 श्लोकों की क्रांतिकारी कृति। आर्यभट ने कहा कि पृथ्वी अपनी धुरी पर घूमती है — कॉपरनिकस से 1,000 वर्ष पहले। उनका पाई मान (3.1416) प्राचीन विश्व में सबसे सटीक था।' },
    keyContributions: [
      { topic: "Earth's Rotation", detail: { en: '"As a man in a boat sees stationary objects moving backward, so the stationary stars are seen as moving westward." — Aryabhata correctly stated Earth rotates daily, 1,000 years before Copernicus. This was REVOLUTIONARY.', hi: '"जैसे नाव में बैठा व्यक्ति स्थिर वस्तुओं को पीछे जाते देखता है, वैसे ही स्थिर तारे पश्चिम की ओर गतिमान दिखते हैं।" — कॉपरनिकस से 1,000 वर्ष पहले।' }, status: 'still_used' },
      { topic: 'Pi = 3.1416', detail: { en: '"A circle of diameter 20,000 has circumference 62,832" → pi = 3.1416, accurate to 4 decimal places. Best approximation in the ancient world.', hi: '"20,000 व्यास के वृत्त की परिधि 62,832" → π = 3.1416, 4 दशमलव स्थान तक सटीक।' }, status: 'still_used' },
      { topic: 'Sine Function Origin', detail: { en: 'Created the first systematic sine difference table (ardha-jya = half-chord). Term journey: ardha-jya → jya → Arabic "jiba" → Latin "sinus" → English "sine." India invented the sine function.', hi: 'प्रथम व्यवस्थित ज्या-अंतर सारणी (अर्ध-ज्या)। शब्द यात्रा: अर्ध-ज्या → ज्या → अरबी जीब → लैटिन sinus → English sine।' }, status: 'still_used' },
      { topic: "Earth's Circumference", detail: { en: '~39,736 km (using his yojana ≈ 8 km). Modern: 40,075 km. Error: only 0.8%.', hi: '~39,736 किमी। आधुनिक: 40,075 किमी। त्रुटि: केवल 0.8%।' }, status: 'still_used' },
      { topic: 'Kuttaka Algorithm', detail: { en: '"Pulverizer" method for solving Diophantine equations — essential for calendar computation, still used in number theory and cryptography.', hi: 'कुट्टक विधि — अनिर्धार्य समीकरणों के लिए, कैलेंडर गणना में आवश्यक, आज भी संख्या सिद्धांत में प्रयुक्त।' }, status: 'still_used' },
      { topic: 'Epicyclic Planetary Model', detail: { en: 'Used epicycles for planetary motion prediction. Superseded by Kepler\'s elliptical orbits (1609).', hi: 'ग्रह गति के लिए अधिचक्र। केपलर की दीर्घवृत्ताकार कक्षाओं (1609) द्वारा प्रतिस्थापित।' }, status: 'superseded' },
    ],
    accuracyHighlights: [
      { value: 'Pi', given: '3.1416', modern: '3.14159...', error: '0.0003%' },
      { value: 'Earth circumference', given: '39,736 km', modern: '40,075 km', error: '0.8%' },
      { value: 'Sidereal year', given: '365.25694 d', modern: '365.25636 d', error: '~50 sec' },
    ],
    uniqueConcepts: [
      { en: 'Earth rotates on its axis (1,000 years before Copernicus)', hi: 'पृथ्वी अपनी धुरी पर घूमती है (कॉपरनिकस से 1,000 वर्ष पूर्व)' },
      { en: 'Sine function — India\'s gift to world mathematics', hi: 'ज्या (Sine) — विश्व गणित को भारत का उपहार' },
      { en: 'Place-value number system with zero (implicit)', hi: 'शून्य सहित स्थानमान संख्या पद्धति' },
    ],
  },
  {
    id: 'bphs', category: 'hora', chapters: 97, verses: '~4,000',
    name: { en: 'Brihat Parashara Hora Shastra', hi: 'बृहत् पाराशर होरा शास्त्र', sa: 'बृहत्पाराशरहोराशास्त्रम्' },
    author: { en: 'Maharshi Parashara (compiled over centuries)', hi: 'महर्षि पराशर (शताब्दियों में संकलित)' },
    date: '7th-12th CE (as known today)',
    color: 'text-gold-light', border: 'border-gold-primary/20',
    summary: { en: 'The "Bible" of Vedic astrology. 97 chapters covering every aspect of Parashari Jyotish — from sign descriptions to 40+ dasha systems to remedies. The Vimshottari Dasha system, 16 divisional charts, Shadbala, and Ashtakavarga all originate here. Virtually every technique used in modern Jyotish traces back to BPHS.', hi: 'वैदिक ज्योतिष का "बाइबल"। 97 अध्याय — राशि वर्णन से 40+ दशा पद्धतियों से उपाय तक। विंशोत्तरी दशा, 16 वर्ग चार्ट, षड्बल, अष्टकवर्ग सब यहीं से हैं।' },
    keyContributions: [
      { topic: 'Vimshottari Dasha (120-year cycle)', detail: { en: 'The most widely used predictive timing system in Jyotish. Divides life into planetary periods based on Moon\'s birth nakshatra. BPHS is the PRIMARY source.', hi: 'ज्योतिष में सर्वाधिक प्रयुक्त भविष्यवाणी प्रणाली। चंद्र नक्षत्र पर आधारित। BPHS प्राथमिक स्रोत।' }, status: 'still_used' },
      { topic: '16 Divisional Charts (Shodashavarga)', detail: { en: 'D1 through D60 — the full system of 16 varga charts for analyzing different life areas. No other text has this complete. Our app computes all 19.', hi: 'D1 से D60 — जीवन के विभिन्न क्षेत्रों के 16 वर्ग चार्ट। कोई अन्य ग्रंथ इतने पूर्ण नहीं।' }, status: 'still_used' },
      { topic: 'Shadbala (6-fold strength)', detail: { en: 'Systematic computation of planetary strength through 6 components: Sthana, Dig, Kaala, Cheshta, Naisargika, Drik Bala. Still computed exactly as described.', hi: 'ग्रह बल की 6 घटकों द्वारा व्यवस्थित गणना। आज भी वर्णित विधि से गणना।' }, status: 'still_used' },
      { topic: 'Ashtakavarga System', detail: { en: '8-source strength analysis for each planet in each sign. Used for transit predictions. BPHS provides the full bindu allocation rules.', hi: 'प्रत्येक ग्रह-राशि के लिए 8 स्रोतीय बल विश्लेषण। गोचर भविष्यवाणी में प्रयुक्त।' }, status: 'still_used' },
      { topic: '40+ Dasha Systems', detail: { en: 'The most comprehensive collection of dasha systems anywhere. Most astrologers use only Vimshottari, but advanced practitioners use Narayana, Kalachakra, Yogini, Ashtottari, and others — all from BPHS.', hi: '40+ दशा पद्धतियों का सबसे व्यापक संग्रह। अधिकांश विंशोत्तरी प्रयोग करते हैं, उन्नत साधक नारायण, कालचक्र, योगिनी आदि भी।' }, status: 'still_used' },
      { topic: 'Planetary Remedies', detail: { en: 'Gemstones, mantras, charities, and rituals for each planet. The first comprehensive remedial system in Jyotish literature.', hi: 'प्रत्येक ग्रह के लिए रत्न, मंत्र, दान और अनुष्ठान। ज्योतिष साहित्य की प्रथम व्यापक उपचार प्रणाली।' }, status: 'still_used' },
    ],
    uniqueConcepts: [
      { en: 'The entire predictive framework of Parashari Jyotish', hi: 'पाराशरी ज्योतिष का संपूर्ण भविष्यवाणी ढांचा' },
      { en: 'Argala (planetary intervention) theory', hi: 'अर्गला (ग्रह हस्तक्षेप) सिद्धांत' },
      { en: 'Vimshopaka Bala (20-point varga strength)', hi: 'विंशोपक बल (20 अंकीय वर्ग शक्ति)' },
    ],
  },
  {
    id: 'phaladeepika', category: 'hora', chapters: 28, verses: '~600',
    name: { en: 'Phaladeepika', hi: 'फलदीपिका', sa: 'फलदीपिका' },
    author: { en: 'Mantreshwara (South India)', hi: 'मंत्रेश्वर (दक्षिण भारत)' },
    date: '~13th century CE',
    color: 'text-blue-300', border: 'border-blue-500/20',
    summary: { en: 'Called the "best textbook" for learning Jyotish. Mantreshwara condensed the essence of BPHS into 600 elegant verses organized in 28 clear chapters. Known for its systematic Nabhasa Yoga classification and the most detailed Ayurdaya (longevity) computation methods.', hi: 'ज्योतिष सीखने की "सर्वोत्तम पाठ्यपुस्तक"। BPHS के सार को 600 सुंदर श्लोकों में 28 अध्यायों में व्यवस्थित। नभस योग वर्गीकरण और आयुर्दय गणना के लिए प्रसिद्ध।' },
    keyContributions: [
      { topic: '32 Nabhasa Yogas', detail: { en: 'Systematic classification into 4 categories: Aashraya (3), Dala (2), Akriti (20), Sankhya (7). Clearer organization than BPHS. Still the standard reference.', hi: '4 श्रेणियों में व्यवस्थित वर्गीकरण: आश्रय (3), दल (2), आकृति (20), संख्या (7)। BPHS से स्पष्ट।' }, status: 'still_used' },
      { topic: 'Ayurdaya (Longevity)', detail: { en: 'Most systematic treatment of longevity computation using multiple methods. Reconciles different approaches to arrive at accurate lifespan estimates.', hi: 'अनेक विधियों द्वारा दीर्घायु गणना का सबसे व्यवस्थित उपचार।' }, status: 'still_used' },
      { topic: 'Nastha Jataka (Rectification)', detail: { en: 'Practical methods for rectifying unknown birth times using life events — the predecessor of modern birth time rectification techniques.', hi: 'जीवन घटनाओं से अज्ञात जन्म समय सुधारने की व्यावहारिक विधियाँ।' }, status: 'still_used' },
    ],
    uniqueConcepts: [
      { en: 'The clearest single-author textbook for learning Jyotish', hi: 'ज्योतिष सीखने की सबसे स्पष्ट एकल-लेखक पाठ्यपुस्तक' },
      { en: 'Female horoscopy with different emphasis points', hi: 'विभिन्न बिंदुओं के साथ स्त्री ज्योतिष' },
    ],
  },
  {
    id: 'brihat_jataka', category: 'hora', chapters: 28, verses: '~400',
    name: { en: 'Brihat Jataka', hi: 'बृहत् जातक', sa: 'बृहज्जातकम्' },
    author: { en: 'Varahamihira (Ujjain, ~505-587 CE)', hi: 'वराहमिहिर (उज्जैन, ~505-587 ई.)' },
    date: '~550 CE',
    color: 'text-violet-400', border: 'border-violet-500/20',
    summary: { en: 'Varahamihira — one of the "Nine Jewels" of King Vikramaditya\'s court — brought systematic rigor to Indian astrology. He organized Jyotish into three branches (Siddhanta, Hora, Samhita), defined the Pancha Maha Purusha Yogas, and in his separate work Pancha Siddhantika, compared 5 astronomical traditions including Greco-Roman ones.', hi: 'वराहमिहिर — राजा विक्रमादित्य के "नवरत्नों" में से एक — ने ज्योतिष में व्यवस्थित कठोरता लाई। ज्योतिष को तीन शाखाओं (सिद्धांत, होरा, संहिता) में विभाजित किया।' },
    keyContributions: [
      { topic: 'Pancha Maha Purusha Yogas', detail: { en: 'Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter), Malavya (Venus), Shasha (Saturn) — planet in own/exalted sign in kendra. These 5 yogas are still THE most commonly checked yogas today.', hi: 'रुचक, भद्र, हंस, मालव्य, शश — स्व/उच्च राशि में केंद्र में। आज भी सबसे अधिक जांचे जाने वाले 5 योग।' }, status: 'still_used' },
      { topic: 'Three-Branch Division of Jyotish', detail: { en: 'Siddhanta (mathematical astronomy) + Hora (natal/predictive) + Samhita (mundane/omens). This tripartite division is STILL the standard framework for categorizing Jyotish.', hi: 'सिद्धांत + होरा + संहिता। यह त्रिभागीय विभाजन आज भी ज्योतिष वर्गीकरण का मानक।' }, status: 'still_used' },
      { topic: 'Pancha Siddhantika (separate work)', detail: { en: 'Compared 5 astronomical traditions including Romaka (Roman) and Paulisha (Greek). Proves Indian astronomers critically engaged with Hellenistic astronomy. The ONLY surviving record of 4 lost siddhantas.', hi: '5 खगोलीय परंपराओं की तुलना — रोमक (रोमन) और पौलिश (ग्रीक) सहित। 4 खोए सिद्धांतों का एकमात्र उत्तरजीवी अभिलेख।' }, status: 'still_used' },
    ],
    uniqueConcepts: [
      { en: 'The tripartite division of Jyotish (Siddhanta, Hora, Samhita)', hi: 'ज्योतिष का त्रिभागीय विभाजन' },
      { en: 'First systematic cross-cultural comparison of astronomical traditions', hi: 'खगोलीय परंपराओं की प्रथम व्यवस्थित अंतर-सांस्कृतिक तुलना' },
    ],
  },
  {
    id: 'saravali', category: 'hora', chapters: 54, verses: '~2,400',
    name: { en: 'Saravali', hi: 'सारावली', sa: 'सारावली' },
    author: { en: 'Kalyana Varma (King, Central India)', hi: 'कल्याण वर्मा (राजा, मध्य भारत)' },
    date: '~800-900 CE',
    color: 'text-pink-300', border: 'border-pink-500/20',
    summary: { en: 'The "practitioner\'s handbook" — explicitly synthesizes Parashara and Varahamihira. Known for exhaustive planet-in-sign combinations (all 108), three-planet conjunction effects, and blunt, specific predictions. Emphasizes Moon sign (Chandra Lagna) analysis more than any other text.', hi: '"अभ्यासकर्ता की पुस्तिका" — पराशर और वराहमिहिर का स्पष्ट संश्लेषण। 108 ग्रह-राशि संयोगों और त्रि-ग्रह युति प्रभावों के लिए जाना जाता है।' },
    keyContributions: [
      { topic: '108 Planet-in-Sign Combinations', detail: { en: 'All 9 planets × 12 signs described in individual verses — the most exhaustive treatment anywhere. Essential reference for interpreting planetary placements.', hi: '9 ग्रह × 12 राशि = 108 संयोग, प्रत्येक अलग श्लोक में — सबसे विस्तृत।' }, status: 'still_used' },
      { topic: 'Three-Planet Conjunctions', detail: { en: 'Goes beyond two-planet yogas to describe effects when 3+ planets are conjunct — a combinatorial depth rare in other texts.', hi: 'दो-ग्रह योगों से आगे — 3+ ग्रह युति के प्रभावों का वर्णन।' }, status: 'still_used' },
      { topic: 'Moon Sign Emphasis', detail: { en: 'Most developed treatment of Chandra Lagna (Moon as Ascendant) results. Crucial for understanding emotional patterns and public perception.', hi: 'चंद्र लग्न परिणामों का सबसे विकसित उपचार। भावनात्मक पैटर्न और सार्वजनिक छवि समझने में महत्वपूर्ण।' }, status: 'still_used' },
    ],
    uniqueConcepts: [
      { en: 'Physical appearance prediction from planetary positions', hi: 'ग्रह स्थिति से शारीरिक बनावट की भविष्यवाणी' },
      { en: 'Detailed planetary war (Graha Yuddha) effects', hi: 'विस्तृत ग्रह युद्ध प्रभाव' },
    ],
  },
];

const STATUS_CONFIG = {
  still_used: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: { en: 'Still Valid & Used', hi: 'अभी भी प्रयुक्त' } },
  superseded: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: { en: 'Superseded', hi: 'प्रतिस्थापित' } },
  partially_valid: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', label: { en: 'Partially Valid', hi: 'आंशिक रूप से मान्य' } },
};

export default function ClassicalTextsPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedText, setExpandedText] = useState<string | null>('aryabhatiya');

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {isHi ? 'शास्त्रीय ग्रंथ — प्राचीन ज्ञान का मूल्यांकन' : 'Classical Texts — Evaluating Ancient Knowledge'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {isHi
            ? 'वैदिक ज्योतिष 6 प्रमुख शास्त्रीय ग्रंथों पर आधारित है। यहाँ हम प्रत्येक ग्रंथ का मूल्यांकन करते हैं — क्या अभी भी सटीक है, क्या आधुनिक विज्ञान द्वारा प्रतिस्थापित हुआ है, और क्या विशिष्ट योगदान आज भी प्रयुक्त हैं।'
            : 'Vedic Jyotish rests on 6 major classical texts spanning astronomy and predictive astrology. Here we evaluate each — what\'s still accurate, what\'s been superseded by modern science, and what unique contributions are still used today. Every claim includes its source chapter.'}
        </p>
      </div>

      {/* Two traditions visual */}
      <div className="glass-card rounded-2xl p-5 border border-gold-primary/15">
        <h3 className="text-gold-light font-bold text-sm mb-3" style={hf}>{isHi ? 'दो परंपराएं' : 'Two Traditions'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <div className="text-amber-400 font-bold text-sm mb-1">{isHi ? 'सिद्धांत (Astronomical)' : 'Siddhanta (Astronomical)'}</div>
            <p className="text-text-secondary text-xs mb-2">{isHi ? 'गणितीय खगोल विज्ञान — ग्रह कहाँ हैं की गणना' : 'Mathematical astronomy — computing WHERE planets are'}</p>
            <div className="text-text-tertiary text-[10px]">Surya Siddhanta, Aryabhatiya</div>
          </div>
          <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
            <div className="text-gold-light font-bold text-sm mb-1">{isHi ? 'होरा (Predictive)' : 'Hora (Predictive)'}</div>
            <p className="text-text-secondary text-xs mb-2">{isHi ? 'फलित ज्योतिष — ग्रहों का क्या अर्थ है' : 'Interpretive astrology — what planet positions MEAN'}</p>
            <div className="text-text-tertiary text-[10px]">BPHS, Brihat Jataka, Phaladeepika, Saravali</div>
          </div>
        </div>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="flex items-center gap-1.5"><Icon className={`w-3.5 h-3.5 ${cfg.color}`} /><span className="text-text-secondary">{isHi ? cfg.label.hi : cfg.label.en}</span></div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="glass-card rounded-2xl p-5 border border-gold-primary/10">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कालक्रम' : 'Timeline'}</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {TEXTS.sort((a, b) => {
            const getYear = (d: string) => parseInt(d.replace(/[^0-9]/g, '')) || 500;
            return getYear(a.date) - getYear(b.date);
          }).map((t, i) => (
            <div key={i} className={`px-3 py-2 rounded-lg border ${t.border} text-center min-w-[100px]`}>
              <div className={`font-bold text-xs ${t.color}`}>{t.date}</div>
              <div className="text-text-secondary text-[9px]">{isHi ? t.name.hi : t.name.en}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Text cards */}
      <div className="space-y-4">
        {TEXTS.map((text) => {
          const isExpanded = expandedText === text.id;
          return (
            <div key={text.id} className={`glass-card rounded-2xl border ${text.border} overflow-hidden`}>
              {/* Header */}
              <button onClick={() => setExpandedText(isExpanded ? null : text.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gold-primary/3 transition-colors">
                <div className="flex items-center gap-4">
                  <BookOpen className={`w-6 h-6 ${text.color} shrink-0`} />
                  <div className="text-left">
                    <div className={`font-bold text-lg ${text.color}`} style={hf}>{isHi ? text.name.hi : text.name.en}</div>
                    <div className="text-text-secondary text-xs">{isHi ? text.author.hi : text.author.en} · {text.date} · {text.chapters} {isHi ? 'अध्याय' : 'chapters'} · {text.verses} {isHi ? 'श्लोक' : 'verses'}</div>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-6 space-y-5 border-t border-gold-primary/10 pt-4">
                      {/* Summary */}
                      <p className="text-text-secondary text-sm leading-relaxed">{isHi ? text.summary.hi : text.summary.en}</p>

                      {/* Accuracy table (if available) */}
                      {text.accuracyHighlights && (
                        <div>
                          <div className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'सटीकता' : 'Accuracy Highlights'}</div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead><tr className="border-b border-gold-primary/10"><th className="text-left py-1.5 px-2 text-gold-dark">Value</th><th className="text-left py-1.5 px-2 text-gold-dark">Given</th><th className="text-left py-1.5 px-2 text-gold-dark">Modern</th><th className="text-left py-1.5 px-2 text-gold-dark">Error</th></tr></thead>
                              <tbody className="divide-y divide-gold-primary/5">
                                {text.accuracyHighlights.map((a, i) => (
                                  <tr key={i}><td className="py-1.5 px-2 text-text-primary">{a.value}</td><td className="py-1.5 px-2 text-gold-light font-mono">{a.given}</td><td className="py-1.5 px-2 text-text-secondary font-mono">{a.modern}</td><td className="py-1.5 px-2 text-emerald-300 font-mono">{a.error}</td></tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Key contributions with relevance status */}
                      <div>
                        <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'प्रमुख योगदान एवं आज की प्रासंगिकता' : 'Key Contributions & Modern Relevance'}</div>
                        <div className="space-y-2">
                          {text.keyContributions.map((kc, i) => {
                            const status = STATUS_CONFIG[kc.status];
                            const Icon = status.icon;
                            return (
                              <div key={i} className={`p-3 rounded-xl ${status.bg} border ${text.border}`}>
                                <div className="flex items-start gap-2">
                                  <Icon className={`w-4 h-4 ${status.color} shrink-0 mt-0.5`} />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-text-primary font-bold text-xs">{kc.topic}</span>
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${status.bg} ${status.color} border ${text.border}`}>{isHi ? status.label.hi : status.label.en}</span>
                                    </div>
                                    <p className="text-text-secondary text-xs leading-relaxed">{isHi ? kc.detail.hi : kc.detail.en}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Unique concepts still used */}
                      <div>
                        <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'विशिष्ट अवधारणाएं (आज भी प्रयुक्त)' : 'Unique Concepts (Still Used Today)'}</div>
                        <div className="space-y-1">
                          {text.uniqueConcepts.map((uc, i) => (
                            <div key={i} className="text-text-secondary text-xs flex gap-2"><span className="text-gold-dark shrink-0">•</span><span>{isHi ? uc.hi : uc.en}</span></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Modern synthesis */}
      <div className="glass-card rounded-2xl p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h3 className="text-gold-gradient font-bold text-xl mb-4" style={hf}>
          {isHi ? 'आधुनिक संश्लेषण — हमारा दृष्टिकोण' : 'Modern Synthesis — Our Approach'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <div className="text-emerald-400 font-bold text-sm mb-2">{isHi ? 'हम क्या उपयोग करते हैं' : 'What We Use'}</div>
            <ul className="text-text-secondary space-y-1.5 leading-relaxed">
              <li>• {isHi ? 'Swiss Ephemeris (NASA JPL DE431) — उप-कोणीय-सेकंड सटीकता' : 'Swiss Ephemeris (NASA JPL DE431) — sub-arcsecond accuracy'}</li>
              <li>• {isHi ? 'Meeus एल्गोरिदम — सूर्य ~0.01°, चंद्र ~0.5° सटीक' : 'Meeus algorithms — Sun ~0.01°, Moon ~0.5° precision'}</li>
              <li>• {isHi ? 'BPHS संपूर्ण भविष्यवाणी प्रणाली — दशा, वर्ग, अष्टकवर्ग' : 'BPHS complete predictive framework — Dashas, Vargas, Ashtakavarga'}</li>
              <li>• {isHi ? 'लाहिरी अयनांश (भारत सरकार आधिकारिक)' : 'Lahiri Ayanamsha (Indian Govt official)'}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
            <div className="text-red-400 font-bold text-sm mb-2">{isHi ? 'हमने क्या बदला' : 'What We\'ve Updated'}</div>
            <ul className="text-text-secondary space-y-1.5 leading-relaxed">
              <li>• {isHi ? 'भूकेंद्रित → सूर्यकेंद्रित + केप्लर कक्षाएं (गणना में)' : 'Geocentric → Heliocentric + Keplerian orbits (for computation)'}</li>
              <li>• {isHi ? 'त्रेपिडेशन → एकदिशीय प्रिसेशन (~50.3"/वर्ष)' : 'Trepidation → Monotonic precession (~50.3"/year)'}</li>
              <li>• {isHi ? 'पौराणिक ब्रह्मांड विज्ञान → आधुनिक खगोल विज्ञान' : 'Mythological cosmography → Modern astronomy'}</li>
              <li>• {isHi ? 'अधिचक्र → NASA/JPL दीर्घवृत्ताकार कक्षा डेटा' : 'Epicycles → NASA/JPL elliptical orbit data'}</li>
            </ul>
          </div>
        </div>
        <p className="text-text-tertiary text-[10px] text-center mt-4">
          {isHi
            ? '💡 सूत्र: आधुनिक गणना (कहाँ) + शास्त्रीय व्याख्या (क्या अर्थ) = सर्वोत्तम ज्योतिष'
            : '💡 Formula: Modern computation (WHERE) + Classical interpretation (WHAT IT MEANS) = Best Jyotish'}
        </p>
      </div>
    </div>
  );
}
