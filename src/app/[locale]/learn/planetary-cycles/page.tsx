'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronRight, Orbit, Clock, Target, Star, Eye, Telescope } from 'lucide-react';
import type { Locale } from '@/types/panchang';

// ── Labels ──────────────────────────────────────────────────────
const L = {
  en: {
    badge: 'Reference',
    title: 'Planetary Orbital Periods in Jyotish',
    sub: 'How ancient Indians measured the cosmos without telescopes -- and embedded that knowledge into every astrological prediction you use today.',
    hook: 'When your grandmother says "Sade Sati lasts 7.5 years," she is implicitly stating that Saturn takes 30 years to orbit the Sun. When an astrologer says "Jupiter changes sign every year," he is saying Jupiter\'s orbital period is ~12 years. Every Jyotish timing prediction is built on orbital mechanics -- and the ancient Indians got the numbers RIGHT.',
    sec1: 'They Knew the Orbits',
    sec1sub: 'Surya Siddhanta vs NASA JPL -- the grand comparison',
    sec1note: 'The Surya Siddhanta\'s solar year is accurate to 3.5 MINUTES over an entire year. Saturn\'s period error is 6.5 days over 29.5 YEARS -- that is 99.94% accurate, WITHOUT TELESCOPES.',
    sec2: 'Sade Sati -- Orbital Mechanics in Action',
    sec2sub: 'Saturn\'s 30-year orbit, divided into 12 signs',
    sec2text1: 'Saturn takes ~29.5 years to orbit the Sun, spending ~2.5 years in each sign. Sade Sati is Saturn transiting the 12th, 1st, and 2nd houses from your Moon sign -- three signs, three windows of 2.5 years each.',
    sec2text2: 'This is not mysticism. It is an observable transit window built on a precisely measured orbital period. The ancient Indians measured Saturn\'s period as 29.471 years (modern: 29.457). The error is 5 DAYS over nearly 30 years.',
    sec2calc: 'Saturn period = 29.5 years\nSigns in zodiac = 12\nTime per sign = 29.5 / 12 = 2.458 years = 2.5 years\nSade Sati = 3 signs x 2.5 = 7.5 years',
    sec3: 'Jupiter Transit -- The 12-Year Wealth Cycle',
    sec3sub: 'Jupiter\'s orbit as a cosmic clock',
    sec3text1: 'Jupiter takes ~11.86 years to orbit -- roughly 1 year per sign. Jyotish teaches that Jupiter in the 2nd, 5th, 7th, 9th, and 11th from your Moon brings prosperity. That means ~5 out of 12 years are "Jupiter-favorable" -- about 42% of the time.',
    sec3text2: 'The 60-year Samvatsara cycle = 5 Jupiter orbits = 2 Saturn orbits (the LCM of 12 and 30). Jupiter and Saturn conjoin every ~19.86 years. Three conjunctions = ~60 years = one complete Samvatsara. This is orbital resonance, not coincidence.',
    sec4: 'Vimshottari Dasha -- 120 Years from Orbital Harmonics',
    sec4sub: 'How dasha periods encode planetary cycles',
    sec4text: 'The total 120-year Dasha cycle = 2 x 60 (Samvatsara) = 4 Saturn semi-orbits = 10 Jupiter orbits. The system is designed to cover the complete interplay of the two slowest visible planets.',
    sec4formula: 'Antardasha of planet X in Mahadasha of Y = (X_period / 120) x Y_period',
    sec4formulaLabel: 'This formula creates 81 unique timing windows (9 x 9) from just 9 orbital parameters.',
    sec5: 'Nakshatras -- The Moon\'s Daily Stations',
    sec5sub: '27 divisions calibrated to the Moon',
    sec5text: 'The Moon\'s sidereal period is 27.32 days. The 27 Nakshatras are 27 "stations" the Moon visits -- each spanning 13 degrees 20 arcminutes, approximately one day of lunar motion. The Moon moves ~13.2 degrees per day -- almost exactly one nakshatra. The ancient Indians did not just know the Moon\'s period; they built a 27-division coordinate system CALIBRATED to it. This is equivalent to constructing a ruler where each mark represents one day of lunar travel.',
    sec6: 'Eclipse Prediction -- The Saros Cycle',
    sec6sub: 'Rahu-Ketu and the nodal period',
    sec6text: 'Rahu and Ketu are the lunar nodes -- where the Moon\'s orbit crosses the ecliptic. Eclipses happen when the Sun and Moon are near these points. The Saros cycle (eclipses repeating every 18 years, 11 days, 8 hours) is nearly identical to the Rahu-Ketu orbital period of 18.613 years. The ancient Indians used this nodal period for eclipse prediction, and the Surya Siddhanta\'s eclipse calculations matched observed eclipses to within minutes.',
    sec7: 'How Did They Measure This?',
    sec7sub: 'Centuries of patient observation',
    sec7methods: [
      { name: 'Gnomon (Shanku)', desc: 'A vertical stick casting shadows -- measures the Sun\'s declination daily, yielding the solar year to high precision.' },
      { name: 'Star Transits', desc: 'Observing when specific stars cross the meridian at the same time as a planet -- gives planetary positions relative to the fixed stars.' },
      { name: 'Occultations', desc: 'When the Moon covers a star -- precise timing gives the Moon\'s exact position.' },
      { name: 'Synodic Periods', desc: 'Counting days between successive conjunctions or oppositions -- averages over many cycles reduce error.' },
      { name: 'Long Baselines', desc: 'Observations accumulated over CENTURIES by temple astronomers (Jyotirvid), passed down through the Guru-Shishya parampara.' },
    ],
    sec7closing: 'The Jantar Mantar observatories (1730s) achieved 2-arcsecond accuracy -- but the orbital periods were already known 1000+ years earlier from patient naked-eye observation.',
    closing: 'Every time you read a Panchang entry, check your Sade Sati status, or look at your Dasha timeline -- you are using orbital mechanics measured by Indian astronomers who watched the sky for centuries with nothing but their eyes, a gnomon, and extraordinary patience. The numbers are real. The science is sound. The tradition preserves it.',
    relatedLinks: 'Continue Exploring',
    backToLearn: 'Back to Learn',
    tblPlanet: 'Planet',
    tblSanskrit: 'Sanskrit',
    tblVedic: 'Vedic Period (Surya Siddhanta)',
    tblModern: 'Modern (NASA JPL)',
    tblError: 'Error',
    tblJyotish: 'How Jyotish Uses It',
    tblDashaPlanet: 'Dasha Planet',
    tblYears: 'Years',
    tblConnection: 'Orbital Connection',
  },
  hi: {
    badge: 'सन्दर्भ',
    title: 'ज्योतिष में ग्रह कक्षीय काल',
    sub: 'प्राचीन भारतीयों ने बिना दूरबीन के ब्रह्माण्ड को कैसे मापा -- और उस ज्ञान को हर ज्योतिषीय भविष्यवाणी में कैसे समाहित किया।',
    hook: 'जब आपकी दादी कहती हैं "साढ़े साती 7.5 वर्ष चलती है," तो वे परोक्ष रूप से कह रही हैं कि शनि को सूर्य की परिक्रमा में 30 वर्ष लगते हैं। जब कोई ज्योतिषी कहता है "बृहस्पति हर वर्ष राशि बदलता है," तो वह कह रहा है कि बृहस्पति का कक्षीय काल ~12 वर्ष है। हर ज्योतिषीय समय-गणना कक्षीय यांत्रिकी पर आधारित है -- और प्राचीन भारतीयों ने ये संख्याएँ सही पाईं।',
    sec1: 'वे कक्षाएँ जानते थे',
    sec1sub: 'सूर्य सिद्धान्त बनाम नासा JPL -- महान तुलना',
    sec1note: 'सूर्य सिद्धान्त का सौर वर्ष पूरे वर्ष में केवल 3.5 मिनट की त्रुटि रखता है। शनि के काल में 29.5 वर्षों में केवल 6.5 दिन की त्रुटि -- यह 99.94% सटीक है, बिना दूरबीन के।',
    sec2: 'साढ़े साती -- कक्षीय यांत्रिकी क्रियाशील',
    sec2sub: 'शनि की 30-वर्षीय कक्षा, 12 राशियों में विभक्त',
    sec2text1: 'शनि को सूर्य की परिक्रमा में ~29.5 वर्ष लगते हैं, प्रत्येक राशि में ~2.5 वर्ष बिताता है। साढ़े साती = शनि का चन्द्र राशि से 12वें, 1ले और 2रे भाव में गोचर -- तीन राशियाँ, प्रत्येक 2.5 वर्ष।',
    sec2text2: 'यह रहस्यवाद नहीं है। यह एक सटीक रूप से मापे गए कक्षीय काल पर निर्मित प्रेक्षणीय गोचर खिड़की है। प्राचीन भारतीयों ने शनि का काल 29.471 वर्ष मापा (आधुनिक: 29.457)। त्रुटि लगभग 30 वर्षों में केवल 5 दिन है।',
    sec2calc: 'शनि काल = 29.5 वर्ष\nराशि चक्र = 12\nप्रति राशि = 29.5 / 12 = 2.458 वर्ष = 2.5 वर्ष\nसाढ़े साती = 3 राशि x 2.5 = 7.5 वर्ष',
    sec3: 'बृहस्पति गोचर -- 12-वर्षीय समृद्धि चक्र',
    sec3sub: 'बृहस्पति की कक्षा एक ब्रह्माण्डीय घड़ी के रूप में',
    sec3text1: 'बृहस्पति को ~11.86 वर्ष लगते हैं -- लगभग 1 वर्ष प्रति राशि। ज्योतिष कहता है कि चन्द्र से 2, 5, 7, 9, 11वें भाव में बृहस्पति समृद्धि लाता है। अर्थात 12 में से ~5 वर्ष "बृहस्पति-अनुकूल" हैं -- लगभग 42%।',
    sec3text2: '60-वर्षीय संवत्सर = 5 बृहस्पति कक्षाएँ = 2 शनि कक्षाएँ। बृहस्पति-शनि युति हर ~19.86 वर्ष। तीन युतियाँ = ~60 वर्ष = एक संवत्सर। यह कक्षीय अनुनाद है, संयोग नहीं।',
    sec4: 'विंशोत्तरी दशा -- कक्षीय सामंजस्य से 120 वर्ष',
    sec4sub: 'दशा काल कैसे ग्रह चक्रों को कूटबद्ध करते हैं',
    sec4text: 'कुल 120-वर्षीय दशा चक्र = 2 x 60 (संवत्सर) = 4 शनि अर्ध-कक्षाएँ = 10 बृहस्पति कक्षाएँ। यह प्रणाली दो सबसे धीमे दृश्य ग्रहों की पूर्ण अन्तर्क्रिया को समेटने के लिए बनाई गई है।',
    sec4formula: 'X की अन्तर्दशा Y की महादशा में = (X_काल / 120) x Y_काल',
    sec4formulaLabel: 'यह सूत्र केवल 9 कक्षीय मापदंडों से 81 अद्वितीय समय-खिड़कियाँ (9 x 9) बनाता है।',
    sec5: 'नक्षत्र -- चन्द्रमा के दैनिक स्थान',
    sec5sub: 'चन्द्रमा के लिए अंशांकित 27 विभाजन',
    sec5text: 'चन्द्रमा का नाक्षत्र काल 27.32 दिन है। 27 नक्षत्र 27 "पड़ाव" हैं जिन पर चन्द्रमा रुकता है -- प्रत्येक 13 अंश 20 कला का, लगभग एक दिन की चन्द्र गति। चन्द्रमा ~13.2 अंश/दिन चलता है -- लगभग ठीक एक नक्षत्र। प्राचीन भारतीयों ने केवल चन्द्रमा का काल नहीं जाना; उन्होंने उससे अंशांकित 27-विभाजन निर्देशांक प्रणाली बनाई।',
    sec6: 'ग्रहण भविष्यवाणी -- सारोस चक्र',
    sec6sub: 'राहु-केतु और पातीय काल',
    sec6text: 'राहु-केतु चन्द्र पात हैं -- जहाँ चन्द्रमा की कक्षा क्रान्तिवृत्त को काटती है। ग्रहण तब होते हैं जब सूर्य-चन्द्र इन बिन्दुओं के निकट हों। सारोस चक्र (18 वर्ष, 11 दिन, 8 घंटे) राहु-केतु के 18.613 वर्षीय काल के लगभग समान है। सूर्य सिद्धान्त की ग्रहण गणनाएँ प्रेक्षित ग्रहणों से मिनटों के भीतर मिलती थीं।',
    sec7: 'उन्होंने यह कैसे मापा?',
    sec7sub: 'शताब्दियों का धैर्यपूर्ण प्रेक्षण',
    sec7methods: [
      { name: 'शंकु (Gnomon)', desc: 'छाया डालने वाली ऊर्ध्वाधर छड़ी -- सूर्य का दैनिक क्रान्ति मापन, उच्च सटीकता से सौर वर्ष देती है।' },
      { name: 'तारा गोचर', desc: 'विशिष्ट तारों को ग्रह के साथ याम्योत्तर पार करते देखना -- स्थिर तारों के सापेक्ष ग्रह स्थिति देता है।' },
      { name: 'प्रच्छादन', desc: 'जब चन्द्रमा किसी तारे को ढकता है -- सटीक समय चन्द्रमा की सटीक स्थिति देता है।' },
      { name: 'सिनोडिक काल', desc: 'क्रमिक युतियों या प्रतियुतियों के बीच दिन गिनना -- अनेक चक्रों का औसत त्रुटि कम करता है।' },
      { name: 'दीर्घ आधार रेखा', desc: 'शताब्दियों में मन्दिर खगोलविदों (ज्योतिर्विद) द्वारा संचित प्रेक्षण, गुरु-शिष्य परम्परा से हस्तान्तरित।' },
    ],
    sec7closing: 'जन्तर मन्तर वेधशालाओं (1730 के दशक) ने 2-arc-second सटीकता प्राप्त की -- परन्तु कक्षीय काल 1000+ वर्ष पहले से धैर्यपूर्ण नग्न-नेत्र प्रेक्षण से ज्ञात थे।',
    closing: 'जब भी आप पञ्चाङ्ग पढ़ते हैं, साढ़े साती जाँचते हैं, या दशा समयरेखा देखते हैं -- आप उन भारतीय खगोलविदों द्वारा मापी गई कक्षीय यांत्रिकी का उपयोग कर रहे हैं जिन्होंने शताब्दियों तक केवल अपनी आँखों, एक शंकु, और असाधारण धैर्य से आकाश का प्रेक्षण किया। संख्याएँ वास्तविक हैं। विज्ञान सुदृढ़ है। परम्परा इसे सुरक्षित रखती है।',
    relatedLinks: 'आगे अन्वेषण करें',
    backToLearn: 'वापस सीखें',
    tblPlanet: 'ग्रह',
    tblSanskrit: 'संस्कृत',
    tblVedic: 'वैदिक काल (सूर्य सिद्धान्त)',
    tblModern: 'आधुनिक (NASA JPL)',
    tblError: 'त्रुटि',
    tblJyotish: 'ज्योतिष में उपयोग',
    tblDashaPlanet: 'दशा ग्रह',
    tblYears: 'वर्ष',
    tblConnection: 'कक्षीय सम्बन्ध',
  },
};

// ── Data ────────────────────────────────────────────────────────
interface OrbitalRow {
  planet: { en: string; hi: string };
  sanskrit: string;
  vedic: string;
  modern: string;
  error: string;
  jyotish: { en: string; hi: string };
}

const ORBITAL_DATA: OrbitalRow[] = [
  { planet: { en: 'Moon (sidereal)', hi: 'चन्द्र (नाक्षत्र)' }, sanskrit: 'Chandra', vedic: '27.321674 d', modern: '27.321661 d', error: '1.1 sec', jyotish: { en: '27 Nakshatras (one per day)', hi: '27 नक्षत्र (एक प्रतिदिन)' } },
  { planet: { en: 'Moon (synodic)', hi: 'चन्द्र (सिनोडिक)' }, sanskrit: '--', vedic: '29.530589 d', modern: '29.530589 d', error: '~0', jyotish: { en: '30 Tithis per lunar month', hi: '30 तिथि प्रति मास' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, sanskrit: 'Budha', vedic: '87.969 d', modern: '87.969 d', error: '~0', jyotish: { en: 'Fastest graha, 3-4 retrogrades/yr', hi: 'सबसे तीव्र ग्रह, 3-4 वक्री/वर्ष' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, sanskrit: 'Shukra', vedic: '224.698 d', modern: '224.701 d', error: '4 min', jyotish: { en: '20-yr Dasha (longest = most human impact)', hi: '20 वर्ष दशा (सबसे लम्बी)' } },
  { planet: { en: 'Sun (Earth)', hi: 'सूर्य (पृथ्वी)' }, sanskrit: 'Surya', vedic: '365.258756 d', modern: '365.256363 d', error: '3.5 min', jyotish: { en: 'Solar year, Sankranti, Ayana', hi: 'सौर वर्ष, संक्रान्ति, अयन' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, sanskrit: 'Mangala', vedic: '686.997 d', modern: '686.971 d', error: '37 min', jyotish: { en: '~2-yr cycle, retrograde every 26 mo', hi: '~2 वर्ष चक्र, 26 माह में वक्री' } },
  { planet: { en: 'Jupiter', hi: 'बृहस्पति' }, sanskrit: 'Guru', vedic: '4,332.32 d', modern: '4,332.59 d', error: '0.27 d', jyotish: { en: '12 yrs = 12 signs. 60-yr Samvatsara = 5 orbits', hi: '12 वर्ष = 12 राशि। 60 वर्ष संवत्सर = 5 कक्षाएँ' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, sanskrit: 'Shani', vedic: '10,765.77 d', modern: '10,759.22 d', error: '6.55 d / 29.5 yr', jyotish: { en: 'Sade Sati = 7.5 yrs = quarter orbit', hi: 'साढ़े साती = 7.5 वर्ष = चौथाई कक्षा' } },
  { planet: { en: 'Rahu/Ketu', hi: 'राहु/केतु' }, sanskrit: '--', vedic: '~6,793 d', modern: '6,798.38 d', error: '5.4 d / 18.6 yr', jyotish: { en: '18-yr Rahu Dasha. Saros eclipse cycle', hi: '18 वर्ष राहु दशा। सारोस ग्रहण चक्र' } },
];

interface DashaRow {
  planet: { en: string; hi: string };
  years: number;
  connection: { en: string; hi: string };
}

const DASHA_DATA: DashaRow[] = [
  { planet: { en: 'Ketu', hi: 'केतु' }, years: 7, connection: { en: 'Half of Rahu-Ketu nodal period (~18.6/2 = 9.3, rounded)', hi: 'राहु-केतु पातीय काल का आधा (~18.6/2 = 9.3)' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, years: 20, connection: { en: 'Venus synodic cycle = 584 d. 20 x 365 / 584 = 12.5 synodic returns', hi: 'शुक्र सिनोडिक = 584 दिन। 20 x 365 / 584 = 12.5 चक्र' } },
  { planet: { en: 'Sun', hi: 'सूर्य' }, years: 6, connection: { en: '~6 solar returns', hi: '~6 सौर वापसी' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, years: 10, connection: { en: '~130 lunar sidereal months (10 x 12.37)', hi: '~130 चन्द्र नाक्षत्र मास' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, years: 7, connection: { en: '~3.5 Mars synodic cycles (7 x 365 / 780 = 3.27)', hi: '~3.5 मंगल सिनोडिक चक्र' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, years: 18, connection: { en: 'ONE complete Rahu-Ketu orbital cycle (18.6 yrs)', hi: 'एक पूर्ण राहु-केतु कक्षीय चक्र (18.6 वर्ष)' } },
  { planet: { en: 'Jupiter', hi: 'बृहस्पति' }, years: 16, connection: { en: '~1.35 Jupiter orbits. Close to synodic period count', hi: '~1.35 बृहस्पति कक्षाएँ' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, years: 19, connection: { en: '~Jupiter-Saturn synodic period (19.86 yrs)', hi: '~बृहस्पति-शनि सिनोडिक काल (19.86 वर्ष)' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, years: 17, connection: { en: '~70.7 Mercury sidereal periods (17 x 365 / 87.97)', hi: '~70.7 बुध नाक्षत्र काल' } },
];

// ── Saturn orbit visual data ────────────────────────────────────
const SIGNS_EN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
const SIGNS_HI = ['मेष', 'वृष', 'मिथु', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चि', 'धनु', 'मकर', 'कुम्भ', 'मीन'];

// ── Helpers ─────────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const SectionIcon = ({ icon: Icon, className = '' }: { icon: typeof Orbit; className?: string }) => (
  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gold-primary/15 border border-gold-primary/20 shrink-0 ${className}`}>
    <Icon className="w-5 h-5 text-gold-light" />
  </div>
);

// ── Page ────────────────────────────────────────────────────────
export default function PlanetaryCyclesPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const l = (L as Record<string, typeof L.en>)[locale] || L.en;

  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-8 sm:p-10"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="relative z-10">
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-gold-light/70 hover:text-indigo-200 text-xs uppercase tracking-wider mb-6 transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" />
            {l.backToLearn}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Orbit className="w-6 h-6 text-gold-light" />
            <span className="text-gold-light text-xs uppercase tracking-widest font-bold">{l.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight" style={hf}>
            {l.title}
          </h1>
          <p className="text-indigo-200/60 text-base sm:text-lg max-w-3xl mb-8" style={bf}>{l.sub}</p>

          {/* Hook quote */}
          <div className="border-l-2 border-gold-primary/40 pl-5 py-2">
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed italic max-w-3xl" style={bf}>
              {l.hook}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ══════════════ SECTION 1: Grand Comparison Table ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Target} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec1}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec1sub}</p>
          </div>
        </div>

        {/* Table container */}
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{l.tblPlanet}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider hidden sm:table-cell" style={hf}>{l.tblSanskrit}</th>
                  <th className="text-right px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{l.tblVedic}</th>
                  <th className="text-right px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{l.tblModern}</th>
                  <th className="text-right px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{l.tblError}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider hidden lg:table-cell" style={hf}>{l.tblJyotish}</th>
                </tr>
              </thead>
              <tbody>
                {ORBITAL_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-indigo-500/8 hover:bg-indigo-500/5 transition-colors">
                    <td className="px-4 py-3 text-text-primary font-medium" style={bf}>{isHi ? row.planet.hi : row.planet.en}</td>
                    <td className="px-4 py-3 text-violet-300/70 hidden sm:table-cell" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{row.sanskrit}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-300/80 text-xs">{row.vedic}</td>
                    <td className="px-4 py-3 text-right font-mono text-blue-300/80 text-xs">{row.modern}</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-300/90 text-xs font-bold">{row.error}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs hidden lg:table-cell" style={bf}>{isHi ? row.jyotish.hi : row.jyotish.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Highlight callout */}
          <div className="px-5 py-4 bg-gold-primary/5 border-t border-gold-primary/12">
            <p className="text-gold-light text-sm font-medium leading-relaxed" style={bf}>{l.sec1note}</p>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 2: Sade Sati ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Clock} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec2}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec2sub}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Explanation */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 space-y-4">
            <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec2text1}</p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec2text2}</p>
            <pre className="bg-black/30 rounded-xl border border-indigo-500/15 px-4 py-3 text-xs text-emerald-300/80 font-mono whitespace-pre-wrap leading-relaxed">
              {l.sec2calc}
            </pre>
          </div>

          {/* Saturn orbit SVG */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 flex items-center justify-center">
            <svg viewBox="0 0 320 320" className="w-full max-w-[300px]">
              <defs>
                <linearGradient id="satGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#8a6d2b" />
                </linearGradient>
                <linearGradient id="sadeSatiArc" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Orbit circle */}
              <circle cx="160" cy="160" r="130" fill="none" stroke="#f0d48a" strokeWidth="1" opacity="0.2" />
              {/* Sign markers */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 160 + 130 * Math.cos(angle);
                const y = 160 + 130 * Math.sin(angle);
                const lx = 160 + 112 * Math.cos(angle);
                const ly = 160 + 112 * Math.sin(angle);
                const isSadeSati = i >= 11 || i <= 1; // 12th, 1st, 2nd from sign 0
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={isSadeSati ? 14 : 10} fill={isSadeSati ? 'rgba(239,68,68,0.15)' : 'rgba(240,212,138,0.08)'} stroke={isSadeSati ? '#ef4444' : '#f0d48a'} strokeWidth={isSadeSati ? 1.5 : 0.5} strokeOpacity={isSadeSati ? 0.6 : 0.3} />
                    <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={isSadeSati ? '#fca5a5' : '#f0d48a'} fontSize="7" fontWeight={isSadeSati ? 'bold' : 'normal'} opacity={isSadeSati ? 1 : 0.6}>
                      {isHi ? SIGNS_HI[i] : SIGNS_EN[i]}
                    </text>
                    {/* 2.5yr label */}
                    <text x={lx} y={ly + 1} textAnchor="middle" dominantBaseline="middle" fill="#f0d48a" fontSize="5" opacity="0.3">
                      2.5y
                    </text>
                  </g>
                );
              })}
              {/* Center */}
              <circle cx="160" cy="160" r="24" fill="rgba(240,212,138,0.05)" stroke="#f0d48a" strokeWidth="0.5" opacity="0.4" />
              <text x="160" y="155" textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold" opacity="0.8">{isHi ? 'चन्द्र' : 'Moon'}</text>
              <text x="160" y="165" textAnchor="middle" fill="#f0d48a" fontSize="6" opacity="0.5">{isHi ? 'राशि' : 'Sign'}</text>
              {/* Sade Sati arc label */}
              <text x="160" y="22" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                {isHi ? 'साढ़े साती = 7.5 वर्ष' : 'Sade Sati = 7.5 yrs'}
              </text>
              {/* Saturn icon */}
              <circle cx={160 + 130 * Math.cos((-90 + 330) * Math.PI / 180)} cy={160 + 130 * Math.sin((-90 + 330) * Math.PI / 180)} r="5" fill="#f0d48a" opacity="0.9" />
              <text x={160 + 130 * Math.cos((-90 + 330) * Math.PI / 180)} y={160 + 130 * Math.sin((-90 + 330) * Math.PI / 180) - 10} textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold">{isHi ? 'शनि' : 'Saturn'}</text>
            </svg>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 3: Jupiter Transit ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Star} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec3}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec3sub}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jupiter orbit clock */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 flex items-center justify-center">
            <svg viewBox="0 0 320 320" className="w-full max-w-[300px]">
              <circle cx="160" cy="160" r="130" fill="none" stroke="#f0d48a" strokeWidth="1" opacity="0.2" />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 160 + 130 * Math.cos(angle);
                const y = 160 + 130 * Math.sin(angle);
                // Favorable: 2nd(1), 5th(4), 7th(6), 9th(8), 11th(10) from sign 0
                const favorable = [1, 4, 6, 8, 10].includes(i);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={favorable ? 14 : 10} fill={favorable ? 'rgba(34,197,94,0.15)' : 'rgba(240,212,138,0.08)'} stroke={favorable ? '#22c55e' : '#f0d48a'} strokeWidth={favorable ? 1.5 : 0.5} strokeOpacity={favorable ? 0.6 : 0.3} />
                    <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={favorable ? '#86efac' : '#f0d48a'} fontSize="7" fontWeight={favorable ? 'bold' : 'normal'} opacity={favorable ? 1 : 0.6}>
                      {isHi ? SIGNS_HI[i] : SIGNS_EN[i]}
                    </text>
                  </g>
                );
              })}
              <circle cx="160" cy="160" r="24" fill="rgba(240,212,138,0.05)" stroke="#f0d48a" strokeWidth="0.5" opacity="0.4" />
              <text x="160" y="155" textAnchor="middle" fill="#f0d48a" fontSize="7" fontWeight="bold" opacity="0.8">{isHi ? 'चन्द्र' : 'Moon'}</text>
              <text x="160" y="165" textAnchor="middle" fill="#f0d48a" fontSize="6" opacity="0.5">{isHi ? 'राशि' : 'Sign'}</text>
              {/* Label */}
              <text x="160" y="22" textAnchor="middle" fill="#86efac" fontSize="8" fontWeight="bold">
                {isHi ? '5/12 वर्ष अनुकूल = 42%' : '5/12 years favorable = 42%'}
              </text>
            </svg>
          </div>

          {/* Explanation */}
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 space-y-4">
            <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec3text1}</p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{l.sec3text2}</p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { num: '60', label: isHi ? 'संवत्सर चक्र' : 'Samvatsara cycle', unit: isHi ? 'वर्ष' : 'yrs' },
                { num: '5', label: isHi ? 'बृहस्पति कक्षाएँ' : 'Jupiter orbits', unit: 'x 12' },
                { num: '2', label: isHi ? 'शनि कक्षाएँ' : 'Saturn orbits', unit: 'x 30' },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-black/20 border border-indigo-500/10">
                  <div className="text-2xl font-bold text-gold-light font-mono">{item.num}</div>
                  <div className="text-[10px] text-gold-light/50 mt-0.5">{item.unit}</div>
                  <div className="text-[10px] text-text-tertiary mt-1" style={bf}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 4: Vimshottari Dasha ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Orbit} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec4}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec4sub}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] overflow-hidden">
          <div className="p-6">
            <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bf}>{l.sec4text}</p>
          </div>

          {/* Dasha table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-gold-primary/12">
                  <th className="text-left px-5 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{l.tblDashaPlanet}</th>
                  <th className="text-center px-4 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{l.tblYears}</th>
                  <th className="text-left px-5 py-3 text-gold-light font-bold text-xs uppercase tracking-wider" style={hf}>{l.tblConnection}</th>
                </tr>
              </thead>
              <tbody>
                {DASHA_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-indigo-500/8 hover:bg-indigo-500/5 transition-colors">
                    <td className="px-5 py-3 text-text-primary font-medium" style={bf}>{isHi ? row.planet.hi : row.planet.en}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light font-mono font-bold text-sm">
                        {row.years}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-secondary text-xs" style={bf}>{isHi ? row.connection.hi : row.connection.en}</td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-gold-primary/5 border-t border-gold-primary/15">
                  <td className="px-5 py-3 text-gold-light font-bold" style={hf}>{isHi ? 'कुल' : 'Total'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-8 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light font-mono font-bold text-sm">
                      120
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gold-light text-xs font-medium" style={bf}>
                    = 2 x 60 (Samvatsara) = 10 Jupiter orbits = 4 Saturn semi-orbits
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Formula */}
          <div className="px-5 py-4 bg-black/20 border-t border-indigo-500/10">
            <pre className="text-emerald-300/80 font-mono text-xs mb-2">{l.sec4formula}</pre>
            <p className="text-text-tertiary text-xs" style={bf}>{l.sec4formulaLabel}</p>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 5: Nakshatras ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Star} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec5}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec5sub}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6">
          <p className="text-text-secondary text-sm leading-relaxed mb-6" style={bf}>{l.sec5text}</p>

          {/* Key numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { num: '27.32', label: isHi ? 'दिन (नाक्षत्र काल)' : 'days (sidereal period)', sub: isHi ? 'चन्द्रमा' : 'Moon' },
              { num: '27', label: isHi ? 'नक्षत्र' : 'Nakshatras', sub: isHi ? 'चन्द्र स्थान' : 'lunar stations' },
              { num: '13.33', label: isHi ? 'अंश प्रत्येक' : 'degrees each', sub: '360 / 27' },
              { num: '13.2', label: isHi ? 'अंश/दिन' : 'deg/day', sub: isHi ? 'चन्द्र गति' : 'lunar motion' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-black/20 border border-indigo-500/10">
                <div className="text-xl sm:text-2xl font-bold text-gold-light font-mono">{item.num}</div>
                <div className="text-[10px] text-text-secondary mt-1" style={bf}>{item.label}</div>
                <div className="text-[9px] text-text-tertiary mt-0.5 font-mono">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 6: Eclipse / Saros ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Eye} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec6}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec6sub}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6">
          <p className="text-text-secondary text-sm leading-relaxed mb-5" style={bf}>{l.sec6text}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-black/20 border border-indigo-500/10">
              <div className="text-2xl font-bold text-amber-300 font-mono">18.03</div>
              <div className="text-[10px] text-text-secondary mt-1" style={bf}>{isHi ? 'सारोस चक्र (वर्ष)' : 'Saros Cycle (yrs)'}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-black/20 border border-indigo-500/10">
              <div className="text-2xl font-bold text-amber-300 font-mono">18.61</div>
              <div className="text-[10px] text-text-secondary mt-1" style={bf}>{isHi ? 'राहु-केतु काल (वर्ष)' : 'Rahu-Ketu Period (yrs)'}</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ══════════════ SECTION 7: How They Measured ══════════════ */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="flex items-start gap-4">
          <SectionIcon icon={Telescope} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={hf}>{l.sec7}</h2>
            <p className="text-gold-light/50 text-sm mt-1" style={bf}>{l.sec7sub}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 space-y-3">
          {l.sec7methods.map((method, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-black/15 border border-indigo-500/8">
              <div className="w-7 h-7 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gold-light font-mono text-xs font-bold">{i + 1}</span>
              </div>
              <div>
                <h4 className="text-gold-light text-sm font-bold mb-1" style={hf}>{method.name}</h4>
                <p className="text-text-secondary text-xs leading-relaxed" style={bf}>{method.desc}</p>
              </div>
            </div>
          ))}

          <p className="text-text-tertiary text-xs leading-relaxed pt-3 border-t border-indigo-500/10" style={bf}>
            {l.sec7closing}
          </p>
        </div>
      </motion.section>

      {/* ══════════════ CLOSING ══════════════ */}
      <motion.section {...fadeUp}>
        <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] p-8">
          <p className="text-indigo-100/80 text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto" style={bf}>
            {l.closing}
          </p>
        </div>
      </motion.section>

      {/* ══════════════ RELATED LINKS ══════════════ */}
      <motion.section {...fadeUp} className="space-y-4">
        <h3 className="text-gold-light text-sm uppercase tracking-widest font-bold" style={hf}>{l.relatedLinks}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/learn/cosmology', label: { en: 'Cosmic Time Scales -- Yugas & Kalpas', hi: 'ब्रह्माण्डीय कालमान -- युग एवं कल्प' } },
            { href: '/learn/vedanga', label: { en: 'Vedanga Jyotisha & Indian Astronomy', hi: 'वेदांग ज्योतिष एवं भारतीय खगोल' } },
            { href: '/learn/track/cosmology', label: { en: 'Cosmology Track', hi: 'ब्रह्माण्डविद्या ट्रैक' } },
            { href: '/learn/dashas', label: { en: 'Dashas -- Planetary Periods', hi: 'दशा -- ग्रह काल' } },
            { href: '/sade-sati', label: { en: 'Check Your Sade Sati', hi: 'अपनी साढ़े साती जाँचें' } },
          ].map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500/8 to-transparent border border-indigo-500/12 hover:border-gold-primary/25 hover:bg-indigo-500/12 transition-all group"
            >
              <span className="text-text-primary text-sm group-hover:text-indigo-200 transition-colors" style={bf}>
                {isHi ? link.label.hi : link.label.en}
              </span>
              <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-gold-light transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
