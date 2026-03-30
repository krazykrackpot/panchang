'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Clock, Loader2, ArrowRight } from 'lucide-react';
import { MasaIcon, SamvatsaraIcon, MuhurtaIcon, TithiIcon, NakshatraIcon, YogaIcon, KaranaIcon, VaraIcon } from '@/components/icons/PanchangIcons';
import type { Locale } from '@/types/panchang';

// ─── Inline trilingual helpers ─────────────────────────────────────────────
const L = {
  title: { en: 'Kaal Nirnaya', hi: 'काल निर्णय', sa: 'काल निर्णय' },
  subtitle: { en: 'The Science of Sacred Time — from Paramanu to Kalpa', hi: 'पवित्र काल का विज्ञान — परमाणु से कल्प तक', sa: 'पवित्र काल विज्ञानम् — परमाणु तः कल्प पर्यन्तम्' },
  kaalMaan: { en: 'Hindu Time Units (Kaal Maan)', hi: 'हिन्दू काल मान (समय इकाइयाँ)', sa: 'हिन्दू काल मान' },
  kaalMaanDesc: { en: 'The Hindu system of time measurement spans from the tiniest perceptible unit to cosmic eons, with precise mathematical ratios between each level.', hi: 'हिन्दू काल मापन प्रणाली सूक्ष्मतम बोधगम्य इकाई से ब्रह्मांडीय युगों तक फैली है, प्रत्येक स्तर के बीच सटीक गणितीय अनुपात के साथ।', sa: 'हिन्दू काल मापन प्रणाली सूक्ष्मतमात् बोधगम्य इकाइत् ब्रह्मांडीय युगान् यावत् विस्तृता अस्ति।' },
  fourYugas: { en: 'The Four Yugas (Chatur Yuga)', hi: 'चार युग (चतुर्युग)', sa: 'चत्वारि युगानि (चतुर्युग)' },
  fourYugasDesc: { en: 'A Mahayuga consists of four Yugas in descending quality. Together they span 4,320,000 years, after which the cycle repeats.', hi: 'एक महायुग में अवरोही गुणवत्ता के चार युग होते हैं। मिलकर वे 4,320,000 वर्ष तक फैले हैं, जिसके बाद चक्र दोहराता है।', sa: 'एक महायुगे अवरोहि गुणस्य चत्वारि युगानि सन्ति। सम्मिलितानि तानि 4,320,000 वर्षाणि विस्तृतानि।' },
  ayanamsha: { en: 'Ayanamsha — The Precession of Equinoxes', hi: 'अयनांश — विषुव अग्रगमन', sa: 'अयनांश — विषुव अग्रगमनम्' },
  ayanamshaDesc: { en: 'The tropical zodiac drifts relative to the fixed stars due to Earth\'s axial precession. Ayanamsha is the correction applied to convert tropical longitudes to sidereal.', hi: 'पृथ्वी के अक्षीय अग्रगमन के कारण उष्णकटिबंधीय राशिचक्र स्थिर तारों के सापेक्ष विचलित होता है। अयनांश उष्णकटिबंधीय देशांतरों को सायन राशिचक्र में परिवर्तित करने के लिए लागू किया जाने वाला सुधार है।', sa: 'पृथ्व्याः अक्षीय अग्रगमनेन उष्णकटिबंधीय राशिचक्र स्थिर ताराभिः सापेक्षम् विचलते। अयनांशः उष्णकटिबंधीय देशान्तरान् सायन राशिचक्रे परिवर्तयितुं प्रयुज्यते।' },
  panchangaSystem: { en: 'The Panchanga System — Five Limbs of Time', hi: 'पंचांग प्रणाली — काल के पाँच अंग', sa: 'पञ्चाङ्ग प्रणाली — कालस्य पञ्च अङ्गानि' },
  panchangaDesc: { en: 'Panchanga (पञ्च + अङ्ग = five + limbs) describes the day through five astronomical measurements, giving a complete picture of the day\'s cosmic energy.', hi: 'पंचांग (पञ्च + अङ्ग = पाँच + अंग) पाँच खगोलशास्त्रीय मापों के माध्यम से दिन का वर्णन करता है, जो दिन की ब्रह्मांडीय ऊर्जा की पूर्ण तस्वीर देता है।', sa: 'पञ्चाङ्ग (पञ्च + अङ्ग = पञ्च + अङ्गानि) पञ्चखगोलशास्त्रीय मापनैः दिनस्य वर्णनं करोति।' },
  muhurtaTitle: { en: 'Muhurta — Electional Astrology', hi: 'मुहूर्त — शुभ काल का निर्धारण', sa: 'मुहूर्त — शुभ काल निर्धारणम्' },
  muhurtaDesc: { en: 'Muhurta is the art of selecting auspicious moments for undertaking activities. A day has 30 Muhurtas (~48 min each), each ruled by a deity with specific qualities.', hi: 'मुहूर्त कार्यों के लिए शुभ क्षणों के चयन की कला है। एक दिन में 30 मुहूर्त (~48 मिनट प्रत्येक) होते हैं, प्रत्येक एक विशिष्ट गुणों वाले देवता द्वारा शासित होता है।', sa: 'मुहूर्तः कार्याणां शुभ क्षणानां चयनस्य कला अस्ति। एकस्मिन् दिने 30 मुहूर्ताः (~48 मिनटाः प्रत्येकम्) सन्ति।' },
  todayData: { en: "Today's Kaal Data", hi: 'आज का काल डेटा', sa: 'अद्यतनः काल डेटा' },
  todayDataDesc: { en: 'Live astronomical data for today — fetched from our calculation engine.', hi: 'आज के लिए लाइव खगोलशास्त्रीय डेटा — हमारे गणना इंजन से प्राप्त।', sa: 'अद्यतनः खगोलशास्त्रीय डेटा — अस्माकं गणना यन्त्रात् प्राप्तः।' },
};

const TIME_UNITS = [
  { unit: 'Paramanu', hi: 'परमाणु', value: '1 base unit', modern: '~16.8 microseconds' },
  { unit: 'Truti', hi: 'त्रुटि', value: '2 Paramanu', modern: '~33.7 microseconds' },
  { unit: 'Tatpara', hi: 'तत्पर', value: '100 Truti', modern: '~3.37 milliseconds' },
  { unit: 'Nimesha', hi: 'निमेष', value: '5 Tatpara', modern: '~0.2 seconds (1 blink)' },
  { unit: 'Kashtha', hi: 'काष्ठा', value: '15 Nimesha', modern: '~3.2 seconds' },
  { unit: 'Laghu', hi: 'लघु', value: '15 Kashtha', modern: '~48 seconds' },
  { unit: 'Ghati / Nadika', hi: 'घटी / नाडिका', value: '15 Laghu', modern: '~24 minutes' },
  { unit: 'Muhurta', hi: 'मुहूर्त', value: '2 Ghati', modern: '~48 minutes', highlight: true },
  { unit: 'Prahara', hi: 'प्रहर', value: '7.5 Muhurta', modern: '~6 hours' },
  { unit: 'Dina (Day)', hi: 'दिन', value: '4 Prahara', modern: '24 hours', highlight: true },
  { unit: 'Paksha', hi: 'पक्ष', value: '15 Dina', modern: '15 days (fortnight)', highlight: true },
  { unit: 'Masa (Month)', hi: 'मास', value: '2 Paksha', modern: '~29.5 days', highlight: true },
  { unit: 'Ritu (Season)', hi: 'ऋतु', value: '2 Masa', modern: '~2 months' },
  { unit: 'Ayana', hi: 'अयन', value: '3 Ritu', modern: '6 months' },
  { unit: 'Samvatsara (Year)', hi: 'संवत्सर', value: '2 Ayana', modern: '~365.25 days', highlight: true },
  { unit: 'Mahayuga', hi: 'महायुग', value: '4 Yugas', modern: '4,320,000 years' },
  { unit: 'Kalpa', hi: 'कल्प', value: '1,000 Mahayuga', modern: '4.32 billion years (one day of Brahma)' },
];

const YUGAS = [
  {
    name: { en: 'Satya Yuga', hi: 'सत्य युग', sa: 'सत्य युग' },
    altName: { en: 'Krita Yuga', hi: 'कृत युग', sa: 'कृत युग' },
    years: 1728000,
    dharma: 100,
    color: 'emerald',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/5',
    text: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300',
    desc: {
      en: 'The Golden Age. Full dharma, no disease, direct perception of truth. Lifespans of thousands of years. Pure consciousness.',
      hi: 'स्वर्ण युग। पूर्ण धर्म, कोई रोग नहीं, सत्य की प्रत्यक्ष अनुभूति। हजारों वर्षों का जीवनकाल।',
      sa: 'स्वर्णयुगम्। पूर्ण धर्मः, रोगाभावः, सत्यस्य प्रत्यक्षानुभूतिः।'
    },
  },
  {
    name: { en: 'Treta Yuga', hi: 'त्रेता युग', sa: 'त्रेता युग' },
    altName: { en: 'Age of Rama', hi: 'राम का युग', sa: 'रामस्य युगम्' },
    years: 1296000,
    dharma: 75,
    color: 'gold',
    border: 'border-gold-primary/40',
    bg: 'bg-gold-primary/5',
    text: 'text-gold-light',
    badge: 'bg-gold-primary/20 text-gold-light',
    desc: {
      en: 'Three-quarters dharma. Rituals and sacrifice emerge as paths to truth. Age of Lord Rama. Lifespans of hundreds of years.',
      hi: 'तीन-चौथाई धर्म। सत्य के मार्ग के रूप में अनुष्ठान और यज्ञ उभरते हैं। भगवान राम का युग।',
      sa: 'त्रिपाद धर्मः। अनुष्ठान यज्ञाः सत्यमार्गरूपेण उद्भवन्ति। भगवतः रामस्य युगम्।'
    },
  },
  {
    name: { en: 'Dvapara Yuga', hi: 'द्वापर युग', sa: 'द्वापर युग' },
    altName: { en: 'Age of Krishna', hi: 'कृष्ण का युग', sa: 'कृष्णस्य युगम्' },
    years: 864000,
    dharma: 50,
    color: 'blue',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/5',
    text: 'text-blue-300',
    badge: 'bg-blue-500/20 text-blue-300',
    desc: {
      en: 'Half dharma. Knowledge declines, Vedas are divided. Age of Lord Krishna. War and conflict become common. ~100 year lifespans.',
      hi: 'आधा धर्म। ज्ञान में गिरावट, वेदों का विभाजन। भगवान कृष्ण का युग। युद्ध और संघर्ष सामान्य हो जाते हैं।',
      sa: 'अर्धधर्मः। ज्ञानं ह्रसते, वेदाः विभज्यन्ते। भगवतः कृष्णस्य युगम्।'
    },
  },
  {
    name: { en: 'Kali Yuga', hi: 'कलि युग', sa: 'कलि युग' },
    altName: { en: 'Current Age — began 3102 BCE', hi: 'वर्तमान युग — 3102 ईसापूर्व प्रारम्भ', sa: 'वर्तमान युगम् — 3102 ईसापूर्व आरब्धम्' },
    years: 432000,
    dharma: 25,
    color: 'red',
    border: 'border-red-500/40',
    bg: 'bg-red-500/5',
    text: 'text-red-300',
    badge: 'bg-red-500/20 text-red-300',
    current: true,
    desc: {
      en: 'One-quarter dharma. The age of strife and discord. Spiritual knowledge must be actively sought. Began Feb 18, 3102 BCE at the end of the Mahabharata War.',
      hi: 'एक-चौथाई धर्म। कलह और द्वेष का युग। आध्यात्मिक ज्ञान को सक्रिय रूप से खोजना होगा। महाभारत युद्ध की समाप्ति पर 18 फरवरी 3102 ईसापूर्व प्रारम्भ।',
      sa: 'पादधर्मः। कलह-द्वेष-युगम्। अध्यात्म-ज्ञानम् सक्रियतया अन्वेष्टव्यम्। 18 फरवरी 3102 ईसापूर्व महाभारत-युद्धान्ते आरब्धम्।'
    },
  },
];

const PANCHANGA_LIMBS = [
  {
    icon: TithiIcon,
    name: { en: 'Tithi', hi: 'तिथि', sa: 'तिथि' },
    number: '01',
    color: 'text-indigo-400',
    border: 'border-indigo-500/20',
    bg: 'bg-indigo-500/5',
    desc: {
      en: 'The lunar day — defined by the angular separation between Sun and Moon (every 12° = 1 Tithi). There are 30 Tithis in a lunar month.',
      hi: 'चन्द्र दिन — सूर्य और चन्द्र के बीच कोणीय अंतर द्वारा परिभाषित (प्रत्येक 12° = 1 तिथि)। एक चंद्र मास में 30 तिथियाँ होती हैं।',
      sa: 'चन्द्र दिनम् — सूर्य-चन्द्रयोः कोणीय-अन्तरेण परिभाषितम् (प्रतिथि 12° = 1 तिथि)।'
    },
    formula: { en: 'Moon − Sun elongation ÷ 12° = Tithi number', hi: 'चन्द्र − सूर्य कोण ÷ 12° = तिथि संख्या', sa: 'चन्द्र − सूर्य कोणः ÷ 12° = तिथि संख्या' },
  },
  {
    icon: VaraIcon,
    name: { en: 'Vara', hi: 'वार', sa: 'वार' },
    number: '02',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    desc: {
      en: 'The weekday — each day is ruled by a planet whose Hora (planetary hour) begins at sunrise. The seven days map to the seven visible celestial bodies.',
      hi: 'सप्ताह का दिन — प्रत्येक दिन एक ग्रह द्वारा शासित होता है जिसकी होरा (ग्रह घंटा) सूर्योदय पर शुरू होती है। सात दिन सात दृश्य खगोलीय पिंडों से मेल खाते हैं।',
      sa: 'सप्तवारः — प्रत्येकं दिनम् एकेन ग्रहेण शासितम् यस्य होरा सूर्योदये आरभते।'
    },
    formula: { en: 'Planet ruling first Hora of the day = Vara ruler', hi: 'दिन की पहली होरा पर शासन करने वाला ग्रह = वार स्वामी', sa: 'दिनस्य प्रथम होरायाः स्वामी = वार स्वामी' },
  },
  {
    icon: NakshatraIcon,
    name: { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्र' },
    number: '03',
    color: 'text-gold-primary',
    border: 'border-gold-primary/20',
    bg: 'bg-gold-primary/5',
    desc: {
      en: 'The lunar mansion — the zodiac is divided into 27 equal sections of 13°20\' each. The Nakshatra is determined by the Moon\'s sidereal longitude at sunrise.',
      hi: 'चन्द्र भवन — राशिचक्र को 27 समान भागों में विभाजित किया गया है, प्रत्येक 13°20\' का। नक्षत्र सूर्योदय पर चंद्र की सायन देशान्तर द्वारा निर्धारित होता है।',
      sa: 'चन्द्र भवनम् — राशिचक्रः 27 समान भागेषु विभक्तः, प्रतिभागः 13°20\' स्यात्।'
    },
    formula: { en: 'Moon\'s sidereal longitude ÷ 13.33° = Nakshatra number', hi: 'चंद्र का सायन देशांतर ÷ 13.33° = नक्षत्र संख्या', sa: 'चन्द्रस्य सायन देशान्तरः ÷ 13.33° = नक्षत्र संख्या' },
  },
  {
    icon: YogaIcon,
    name: { en: 'Yoga', hi: 'योग', sa: 'योग' },
    number: '04',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    desc: {
      en: 'The Sun-Moon combined longitude — the sum of Sun\'s and Moon\'s sidereal longitudes divided by 13.33° gives the Yoga number (1-27).',
      hi: 'सूर्य-चंद्र संयुक्त देशांतर — सूर्य और चंद्र के सायन देशांतरों का योग 13.33° से विभाजित करने पर योग संख्या (1-27) मिलती है।',
      sa: 'सूर्य-चन्द्र संयुक्त देशान्तरः — सूर्य-चन्द्रयोः सायन देशान्तरयोः योगः 13.33° भक्तः = योग संख्या।'
    },
    formula: { en: '(Sun + Moon sidereal longitudes) ÷ 13.33° = Yoga number', hi: '(सूर्य + चंद्र सायन देशांतर) ÷ 13.33° = योग संख्या', sa: '(सूर्य + चन्द्र) ÷ 13.33° = योग संख्या' },
  },
  {
    icon: KaranaIcon,
    name: { en: 'Karana', hi: 'करण', sa: 'करण' },
    number: '05',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/5',
    desc: {
      en: 'The half-Tithi — each Tithi is divided into two Karanas of 6° each (Moon-Sun elongation). There are 11 Karanas: 4 fixed (Sthira) and 7 movable (Chara).',
      hi: 'आधी तिथि — प्रत्येक तिथि को 6°-6° के दो करणों में विभाजित किया गया है। 11 करण होते हैं: 4 स्थिर और 7 चर।',
      sa: 'अर्ध-तिथि — प्रत्येका तिथिः द्वाभ्यां करणाभ्यां 6° प्रतिकरणम् विभक्ता। 11 करणाः: 4 स्थिराः, 7 चराः।'
    },
    formula: { en: '(Moon − Sun elongation) ÷ 6° = Karana number', hi: '(चंद्र − सूर्य कोण) ÷ 6° = करण संख्या', sa: '(चन्द्र − सूर्य) ÷ 6° = करण संख्या' },
  },
];

interface KaalData {
  kaliAhargana?: number;
  kaliyugaYear?: number;
  julianDay?: number;
  samvatsara?: { en: string; hi: string; sa: string };
  masa?: { en: string; hi: string; sa: string };
  ayanamsha?: number;
}

export default function KaalNirnayaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [kaalData, setKaalData] = useState<KaalData | null>(null);
  const [loadingKaal, setLoadingKaal] = useState(true);

  // Fetch today's kaal data from /api/panchang
  useEffect(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    fetch(`/api/panchang?year=${year}&month=${month}&day=${day}&lat=28.6139&lng=77.209&tz=5.5&location=New+Delhi`)
      .then(r => r.json())
      .then(data => {
        setKaalData({
          kaliAhargana: data.kaliAhargana,
          kaliyugaYear: data.kaliyugaYear,
          julianDay: data.julianDay,
          samvatsara: data.samvatsara,
          masa: data.purnimantMasa || data.masa,
          ayanamsha: data.ayanamsha,
        });
        setLoadingKaal(false);
      })
      .catch(() => setLoadingKaal(false));
  }, []);

  // Current Kali Yuga progress
  const KALI_YUGA_TOTAL = 432000;
  const KALI_ELAPSED = 5126;
  const kaliPct = ((KALI_ELAPSED / KALI_YUGA_TOTAL) * 100).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ═══ HERO ═══ */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="flex justify-center gap-4 mb-6">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' as const }}>
            <MasaIcon size={64} />
          </motion.div>
          <motion.div animate={{ rotate: [360, 0] }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' as const }}>
            <SamvatsaraIcon size={64} />
          </motion.div>
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold mb-3" style={headingFont}>
          <span className="text-gold-gradient">{L.title[locale]}</span>
        </h1>
        <p className="text-2xl text-gold-dark mb-4" style={headingFont}>
          {locale !== 'en' && L.title.en}
        </p>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          {L.subtitle[locale]}
        </p>
      </motion.div>

      {/* ═══ SECTION 1: HINDU TIME UNITS ═══ */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><Clock className="w-14 h-14 text-gold-primary" /></div>
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{L.kaalMaan[locale]}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{L.kaalMaanDesc[locale]}</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20 bg-gold-primary/5">
                  <th className="text-left px-5 py-4 text-gold-primary text-xs uppercase tracking-wider font-bold">
                    {locale === 'en' ? 'Unit' : 'इकाई'}
                  </th>
                  <th className="text-left px-5 py-4 text-gold-primary text-xs uppercase tracking-wider font-bold">
                    {locale === 'en' ? 'Sanskrit' : 'संस्कृत'}
                  </th>
                  <th className="text-left px-5 py-4 text-gold-primary text-xs uppercase tracking-wider font-bold">
                    {locale === 'en' ? 'Composition' : 'संरचना'}
                  </th>
                  <th className="text-left px-5 py-4 text-gold-primary text-xs uppercase tracking-wider font-bold">
                    {locale === 'en' ? 'Modern Equivalent' : 'आधुनिक समतुल्य'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIME_UNITS.map((row, i) => (
                  <tr key={row.unit} className={`border-b border-gold-primary/5 hover:bg-bg-tertiary/30 transition-colors ${row.highlight ? 'bg-gold-primary/3' : ''}`}>
                    <td className="px-5 py-3">
                      <span className={`font-bold text-sm ${row.highlight ? 'text-gold-light' : 'text-text-primary'}`}>
                        {row.unit}
                      </span>
                      {row.highlight && <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-gold-primary/20 text-gold-primary rounded font-bold uppercase">Key</span>}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-gold-dark text-sm" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{row.hi}</span>
                    </td>
                    <td className="px-5 py-3 text-text-secondary text-sm font-mono">{row.value}</td>
                    <td className="px-5 py-3 text-text-secondary text-sm">{row.modern}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* ═══ SECTION 2: FOUR YUGAS ═══ */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <svg width={56} height={56} viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="yuga-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#d4a853" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="28" stroke="url(#yuga-grad)" strokeWidth="2" fill="none" opacity="0.4" />
              <path d="M32 10 L32 54 M10 32 L54 32" stroke="url(#yuga-grad)" strokeWidth="1.5" opacity="0.3" />
              <circle cx="32" cy="32" r="18" stroke="url(#yuga-grad)" strokeWidth="2" fill="none" />
              <circle cx="32" cy="32" r="8" fill="url(#yuga-grad)" opacity="0.6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{L.fourYugas[locale]}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{L.fourYugasDesc[locale]}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {YUGAS.map((yuga, i) => (
            <motion.div
              key={yuga.name.en}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`glass-card rounded-2xl p-6 border-2 ${yuga.border} ${yuga.bg} relative overflow-hidden`}
            >
              {yuga.current && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/40 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-red-300 text-[10px] font-bold uppercase">{locale === 'en' ? 'NOW' : 'अभी'}</span>
                </div>
              )}
              <div className="mb-4">
                <div className={`font-bold text-xl mb-1 ${yuga.text}`} style={headingFont}>{yuga.name[locale]}</div>
                <div className="text-text-secondary/60 text-xs">{yuga.altName[locale]}</div>
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary mb-3">
                {yuga.years.toLocaleString()}
                <span className="text-text-secondary text-xs ml-1 font-sans">yrs</span>
              </div>
              {/* Dharma meter */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] text-text-secondary mb-1">
                  <span>{locale === 'en' ? 'Dharma' : 'धर्म'}</span>
                  <span className={yuga.text}>{yuga.dharma}%</span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    yuga.color === 'emerald' ? 'bg-emerald-400/60' :
                    yuga.color === 'gold' ? 'bg-gold-primary/60' :
                    yuga.color === 'blue' ? 'bg-blue-400/60' : 'bg-red-400/60'
                  }`} style={{ width: `${yuga.dharma}%` }} />
                </div>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{yuga.desc[locale]}</p>

              {/* Current Yuga progress */}
              {yuga.current && (
                <div className="mt-4 pt-4 border-t border-red-500/20">
                  <div className="text-[10px] text-text-secondary mb-1.5 font-bold uppercase tracking-wider">
                    {locale === 'en' ? 'Current Progress' : 'वर्तमान प्रगति'}
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-red-400/50 rounded-full" style={{ width: `${kaliPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-text-secondary/60 font-mono">
                    <span>3102 BCE</span>
                    <span className="text-red-300">{kaliPct}%</span>
                    <span>+{(KALI_YUGA_TOTAL - KALI_ELAPSED).toLocaleString()}y</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mahayuga & Kalpa info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6 border border-gold-primary/15 bg-gradient-to-r from-gold-primary/5 to-transparent">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-1">{locale === 'en' ? 'Mahayuga' : 'महायुग'}</div>
              <div className="text-gold-light text-2xl font-bold font-mono">4,320,000</div>
              <div className="text-text-secondary text-xs">{locale === 'en' ? 'years (all 4 Yugas)' : 'वर्ष (चारों युग)'}</div>
            </div>
            <div>
              <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-1">{locale === 'en' ? 'Manvantara' : 'मन्वन्तर'}</div>
              <div className="text-gold-light text-2xl font-bold font-mono">71</div>
              <div className="text-text-secondary text-xs">{locale === 'en' ? 'Mahayugas (306.72M years)' : 'महायुग (30.672 करोड़ वर्ष)'}</div>
            </div>
            <div>
              <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-1">{locale === 'en' ? 'Kalpa (Day of Brahma)' : 'कल्प (ब्रह्मा का एक दिन)'}</div>
              <div className="text-gold-light text-2xl font-bold font-mono">4.32B</div>
              <div className="text-text-secondary text-xs">{locale === 'en' ? 'years = 1,000 Mahayugas' : 'वर्ष = 1,000 महायुग'}</div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ═══ SECTION 3: AYANAMSHA ═══ */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <svg width={56} height={56} viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="ayan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#d4a853" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="26" stroke="url(#ayan-grad)" strokeWidth="1.5" fill="none" opacity="0.4" />
              <ellipse cx="32" cy="32" rx="26" ry="8" stroke="url(#ayan-grad)" strokeWidth="2" fill="none" opacity="0.5" />
              <circle cx="32" cy="32" r="6" fill="url(#ayan-grad)" opacity="0.7" />
              <path d="M32 6 A26 26 0 0 1 56 28" stroke="url(#ayan-grad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="56" cy="28" r="3" fill="#f0d48a" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{L.ayanamsha[locale]}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{L.ayanamshaDesc[locale]}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card rounded-xl p-6 border border-gold-primary/15">
            <h3 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {locale === 'en' ? 'What is Precession?' : 'अग्रगमन क्या है?'}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {locale === 'en'
                ? 'Earth\'s rotational axis slowly wobbles like a spinning top, completing one full circle in ~25,772 years. This causes the vernal equinox to slowly "drift" through the constellations at ~50.3 arcseconds per year.'
                : 'पृथ्वी की घूर्णन धुरी एक कताई की तरह धीरे-धीरे डोलती है, ~25,772 वर्षों में एक पूर्ण चक्र पूरा करती है। इससे विषुव बिंदु प्रति वर्ष ~50.3 चाप-सेकंड की गति से नक्षत्रों में "विचलित" होता है।'}
            </p>
            <div className="glass-card rounded-lg p-4 bg-gold-primary/5 border border-gold-primary/10">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">{locale === 'en' ? 'Rate' : 'दर'}</div>
                  <div className="text-gold-light font-bold text-lg font-mono">50.3″/yr</div>
                </div>
                <div>
                  <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">{locale === 'en' ? 'Full Cycle' : 'पूर्ण चक्र'}</div>
                  <div className="text-gold-light font-bold text-lg font-mono">~25,772 yrs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 border border-gold-primary/15">
            <h3 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {locale === 'en' ? 'Ayanamsha Systems' : 'अयनांश प्रणालियाँ'}
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Lahiri (Chitrapaksha)', value: '~24.12°', official: true, desc: locale === 'en' ? 'Official Govt of India. Most widely used in India.' : 'भारत सरकार की आधिकारिक। भारत में सर्वाधिक प्रयुक्त।' },
                { name: 'Raman', value: '~23.04°', official: false, desc: locale === 'en' ? 'Used by B.V. Raman school.' : 'बी.वी. रमण परंपरा में प्रयुक्त।' },
                { name: 'Krishnamurti (KP)', value: '~23.86°', official: false, desc: locale === 'en' ? 'Used in KP System (Placidus houses).' : 'KP प्रणाली में प्रयुक्त।' },
                { name: 'Fagan-Bradley', value: '~24.74°', official: false, desc: locale === 'en' ? 'Western sidereal astrology.' : 'पश्चिमी सायन ज्योतिष।' },
              ].map((a) => (
                <div key={a.name} className={`rounded-lg p-3 border ${a.official ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary font-semibold text-sm">{a.name}</span>
                      {a.official && <span className="px-1.5 py-0.5 text-[10px] bg-gold-primary/20 text-gold-primary rounded font-bold uppercase">{locale === 'en' ? 'Official' : 'आधिकारिक'}</span>}
                    </div>
                    <span className="font-mono text-gold-light text-sm font-bold">{a.value}</span>
                  </div>
                  <p className="text-text-secondary text-xs">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Lahiri Ayanamsha */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6 border-2 border-gold-primary/30 bg-gradient-to-r from-gold-primary/5 to-transparent text-center">
          <div className="text-gold-dark text-xs uppercase tracking-[0.3em] font-bold mb-2">
            {locale === 'en' ? 'Current Lahiri Ayanamsha (2026 CE)' : 'वर्तमान लाहिरी अयनांश (2026 CE)'}
          </div>
          <div className="text-gold-light text-5xl font-bold font-mono">
            {loadingKaal ? <Loader2 className="w-10 h-10 animate-spin inline text-gold-primary" /> : (kaalData?.ayanamsha ? `${kaalData.ayanamsha.toFixed(4)}°` : '24.1213°')}
          </div>
          <p className="text-text-secondary text-sm mt-3">
            {locale === 'en'
              ? 'This means sidereal positions are 24.12° behind tropical positions. The gap increases by ~50.3″ every year.'
              : 'इसका अर्थ है सायन स्थितियाँ उष्णकटिबंधीय स्थितियों से 24.12° पीछे हैं। यह अंतर प्रतिवर्ष ~50.3″ बढ़ता है।'}
          </p>
        </motion.div>
      </motion.section>

      {/* ═══ SECTION 4: PANCHANGA SYSTEM ═══ */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><MuhurtaIcon size={56} /></div>
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{L.panchangaSystem[locale]}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{L.panchangaDesc[locale]}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PANCHANGA_LIMBS.map((limb, i) => (
            <motion.div
              key={limb.name.en}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className={`glass-card rounded-2xl p-6 border ${limb.border} ${limb.bg}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0"><limb.icon size={48} /></div>
                <div>
                  <div className={`text-xs uppercase tracking-[0.2em] font-bold mb-0.5 ${limb.color}`}>
                    {locale === 'en' ? `Anga ${limb.number}` : `अंग ${limb.number}`}
                  </div>
                  <div className="text-gold-light font-bold text-xl" style={headingFont}>{limb.name[locale]}</div>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{limb.desc[locale]}</p>
              <div className="rounded-lg p-3 bg-bg-tertiary/50 border border-gold-primary/10">
                <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-1">
                  {locale === 'en' ? 'Formula' : 'सूत्र'}
                </div>
                <div className="text-text-primary text-xs font-mono">{limb.formula[locale]}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ SECTION 5: MUHURTA ═══ */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <svg width={56} height={56} viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="muh-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#d4a853" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="26" stroke="url(#muh-grad)" strokeWidth="2" fill="none" opacity="0.3" />
              {Array.from({ length: 30 }, (_, i) => {
                const angle = (Math.PI * 2 * i) / 30 - Math.PI / 2;
                const r1 = 20, r2 = i % 5 === 0 ? 26 : 23;
                return (
                  <line key={i}
                    x1={32 + r1 * Math.cos(angle)} y1={32 + r1 * Math.sin(angle)}
                    x2={32 + r2 * Math.cos(angle)} y2={32 + r2 * Math.sin(angle)}
                    stroke="url(#muh-grad)" strokeWidth={i % 5 === 0 ? 2 : 1} opacity={0.5}
                  />
                );
              })}
              <circle cx="32" cy="32" r="10" fill="url(#muh-grad)" opacity="0.3" />
              <circle cx="32" cy="32" r="3" fill="#f0d48a" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{L.muhurtaTitle[locale]}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{L.muhurtaDesc[locale]}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card rounded-xl p-6 border border-gold-primary/15">
            <h3 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {locale === 'en' ? '30 Muhurtas in a Day' : 'दिन में 30 मुहूर्त'}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {locale === 'en'
                ? 'A solar day (sunrise to next sunrise) is divided into 30 equal Muhurtas — 15 day muhurtas (sunrise to sunset) and 15 night muhurtas (sunset to next sunrise). Each spans ~48 minutes.'
                : 'एक सौर दिन (एक सूर्योदय से अगले सूर्योदय तक) को 30 समान मुहूर्तों में विभाजित किया जाता है — 15 दिन के मुहूर्त और 15 रात के मुहूर्त। प्रत्येक ~48 मिनट का होता है।'}
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: locale === 'en' ? 'Total Muhurtas' : 'कुल मुहूर्त', value: '30' },
                { label: locale === 'en' ? 'Day Muhurtas' : 'दिवा मुहूर्त', value: '15' },
                { label: locale === 'en' ? 'Duration each' : 'प्रत्येक की अवधि', value: '~48m' },
              ].map(item => (
                <div key={item.label} className="glass-card rounded-lg p-3">
                  <div className="text-gold-light font-bold text-2xl font-mono">{item.value}</div>
                  <div className="text-text-secondary text-[10px] mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 border border-gold-primary/15">
            <h3 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {locale === 'en' ? 'Key Auspicious Muhurtas' : 'प्रमुख शुभ मुहूर्त'}
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: locale === 'en' ? 'Brahma Muhurta' : 'ब्राह्म मुहूर्त',
                  time: locale === 'en' ? '~1h 36m before sunrise' : 'सूर्योदय से ~1:36 पहले',
                  color: 'text-indigo-400',
                  desc: locale === 'en' ? 'Best for spiritual practice, study, meditation' : 'अध्यात्म, अध्ययन, ध्यान के लिए श्रेष्ठ',
                },
                {
                  name: locale === 'en' ? 'Abhijit Muhurta' : 'अभिजित् मुहूर्त',
                  time: locale === 'en' ? '~12 min either side of local noon' : 'स्थानीय दोपहर के ~12 मिनट पूर्व/बाद',
                  color: 'text-gold-primary',
                  desc: locale === 'en' ? 'Most auspicious of the day — all activities' : 'दिन का सर्वश्रेष्ठ — सभी कार्यों के लिए',
                },
                {
                  name: locale === 'en' ? 'Vijaya Muhurta' : 'विजय मुहूर्त',
                  time: locale === 'en' ? '10th day muhurta' : '10वाँ दिवा मुहूर्त',
                  color: 'text-amber-400',
                  desc: locale === 'en' ? 'Victory in competitions, military, legal' : 'प्रतियोगिता, सैन्य, कानूनी मामलों में विजय',
                },
                {
                  name: locale === 'en' ? 'Amrit Kalam' : 'अमृत काल',
                  time: locale === 'en' ? 'Moon\'s most auspicious window' : 'चंद्र का सर्वोत्तम काल',
                  color: 'text-emerald-400',
                  desc: locale === 'en' ? 'Lunar nectar period — excellent for all' : 'चंद्र अमृत काल — सभी कार्यों के लिए उत्तम',
                },
              ].map(m => (
                <div key={m.name} className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${m.color.replace('text-', 'bg-')}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${m.color}`}>{m.name}</span>
                      <span className="text-text-secondary/60 text-xs font-mono">{m.time}</span>
                    </div>
                    <p className="text-text-secondary text-xs">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/panchang"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-primary/20 border border-gold-primary/40 rounded-xl text-gold-light font-bold hover:bg-gold-primary/30 transition-all">
            <MuhurtaIcon size={20} />
            {locale === 'en' ? 'See Today\'s Muhurtas' : 'आज के मुहूर्त देखें'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      {/* ═══ SECTION 6: TODAY'S KAAL DATA (live widget) ═══ */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Clock className="w-14 h-14 text-gold-primary" />
              {!loadingKaal && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{L.todayData[locale]}</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">{L.todayDataDesc[locale]}</p>
        </div>

        {loadingKaal ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-gold-primary mx-auto mb-3" />
            <div className="text-text-secondary text-sm">{locale === 'en' ? 'Calculating astronomical data...' : 'खगोलशास्त्रीय डेटा की गणना हो रही है...'}</div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden border border-gold-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-gold-primary/10">
              {([
                {
                  label: { en: 'Kali Ahargana', hi: 'कलि अहर्गण', sa: 'कलि अहर्गणः' },
                  value: kaalData?.kaliAhargana?.toLocaleString() || '—',
                  desc: { en: 'Days since Kali Yuga start', hi: 'कलियुग आरंभ से दिन', sa: 'कलियुग आरंभात् दिनानि' },
                  color: 'text-gold-light',
                },
                {
                  label: { en: 'Kaliyuga Year', hi: 'कलियुग वर्ष', sa: 'कलियुग वर्षम्' },
                  value: kaalData?.kaliyugaYear?.toLocaleString() || '—',
                  desc: { en: 'Year in current Kali Yuga', hi: 'वर्तमान कलियुग में वर्ष', sa: 'वर्तमान कलियुगे वर्षः' },
                  color: 'text-amber-300',
                },
                {
                  label: { en: 'Julian Day', hi: 'जूलियन दिन', sa: 'जूलियन दिनम्' },
                  value: kaalData?.julianDay?.toLocaleString() || '—',
                  desc: { en: 'Astronomical day count', hi: 'खगोलशास्त्रीय दिन संख्या', sa: 'खगोलशास्त्रीय दिन संख्या' },
                  color: 'text-indigo-300',
                },
                {
                  label: { en: 'Samvatsara', hi: 'संवत्सर', sa: 'संवत्सरः' },
                  value: kaalData?.samvatsara?.[locale] || '—',
                  desc: { en: 'Current year name (60-year cycle)', hi: 'वर्तमान वर्ष नाम (60 वर्षीय चक्र)', sa: 'वर्तमान वर्षनाम (60 वर्षचक्रः)' },
                  color: 'text-gold-light',
                },
                {
                  label: { en: 'Current Masa', hi: 'वर्तमान मास', sa: 'वर्तमान मासः' },
                  value: kaalData?.masa?.[locale] || '—',
                  desc: { en: 'Lunar month (Purnimant)', hi: 'चंद्र मास (पूर्णिमान्त)', sa: 'चन्द्र मासः (पूर्णिमान्त)' },
                  color: 'text-gold-light',
                },
                {
                  label: { en: 'Lahiri Ayanamsha', hi: 'लाहिरी अयनांश', sa: 'लाहिरी अयनांशः' },
                  value: kaalData?.ayanamsha ? `${kaalData.ayanamsha.toFixed(4)}°` : '—',
                  desc: { en: 'Current sidereal correction', hi: 'वर्तमान सायन सुधार', sa: 'वर्तमान सायन सुधारः' },
                  color: 'text-emerald-300',
                },
              ] as { label: { en: string; hi: string; sa: string }; value: string; desc: { en: string; hi: string; sa: string }; color: string }[]).map((item, i) => (
                <motion.div key={item.label.en} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}
                  className="p-6 text-center">
                  <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-2">{item.label[locale]}</div>
                  <div className={`font-bold text-2xl font-mono ${item.color}`} style={headingFont}>{item.value}</div>
                  <div className="text-text-secondary text-[10px] mt-2">{item.desc[locale]}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/panchang"
            className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors text-sm font-medium">
            {locale === 'en' ? 'View Full Panchang' : 'पूर्ण पंचांग देखें'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

    </div>
  );
}
