'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Clock, Loader2, ArrowRight } from 'lucide-react';
import { MasaIcon, SamvatsaraIcon, MuhurtaIcon, TithiIcon, NakshatraIcon, YogaIcon, KaranaIcon, VaraIcon } from '@/components/icons/PanchangIcons';
import { useLocationStore } from '@/stores/location-store';
import type { Locale , LocaleText} from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

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
  samvatsara?: LocaleText;
  masa?: LocaleText;
  ayanamsha?: number;
}

export default function KaalNirnayaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  // Helper for bilingual objects (en/hi) — falls back to hi for sa, then en
  const t2 = (obj: LocaleText): string => {
    if (locale === 'en') return obj.en;
    return obj.hi || ""; // hi serves as fallback for sa
  };

  const [kaalData, setKaalData] = useState<KaalData | null>(null);
  const [loadingKaal, setLoadingKaal] = useState(true);

  // Detect user location
  useEffect(() => { useLocationStore.getState().detect(); }, []);

  // Fetch today's kaal data from /api/panchang
  useEffect(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const { lat: uLat, lng: uLng, name: uName } = useLocationStore.getState();
    const lat = uLat ?? 0;
    const lng = uLng ?? 0;
    const locName = uName || 'Current Location';
    fetch(`/api/panchang?year=${year}&month=${month}&day=${day}&lat=${lat}&lng=${lng}&timezone=${encodeURIComponent(ianaTimezone)}&location=${encodeURIComponent(locName)}`)
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
          <span className="text-gold-gradient">{tl(L.title, locale)}</span>
        </h1>
        <p className="text-2xl text-gold-dark mb-4" style={headingFont}>
          {locale !== 'en' && L.title.en}
        </p>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          {tl(L.subtitle, locale)}
        </p>
      </motion.div>

      {/* ═══ SECTION 1: FOUR YUGAS ═══ */}
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
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{tl(L.fourYugas, locale)}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{tl(L.fourYugasDesc, locale)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {YUGAS.map((yuga, i) => (
            <motion.div
              key={yuga.name.en}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-4 md:p-6 border-2 ${yuga.border} ${yuga.bg} relative overflow-hidden`}
            >
              {yuga.current && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/40 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-red-300 text-xs font-bold uppercase">{!isDevanagariLocale(locale) ? 'NOW' : 'अभी'}</span>
                </div>
              )}
              <div className="mb-4">
                <div className={`font-bold text-xl mb-1 ${yuga.text}`} style={headingFont}>{tl(yuga.name, locale)}</div>
                <div className="text-text-secondary/75 text-xs">{tl(yuga.altName, locale)}</div>
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary mb-3">
                {yuga.years.toLocaleString()}
                <span className="text-text-secondary text-xs ml-1 font-sans">yrs</span>
              </div>
              {/* Dharma meter */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>{!isDevanagariLocale(locale) ? 'Dharma' : 'धर्म'}</span>
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
              <p className="text-text-secondary text-xs leading-relaxed">{tl(yuga.desc, locale)}</p>

              {/* Current Yuga progress */}
              {yuga.current && (
                <div className="mt-4 pt-4 border-t border-red-500/20">
                  <div className="text-xs text-text-secondary mb-1.5 font-bold uppercase tracking-wider">
                    {!isDevanagariLocale(locale) ? 'Current Progress' : 'वर्तमान प्रगति'}
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-red-400/50 rounded-full" style={{ width: `${kaliPct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary/75 font-mono">
                    <span>3102 BCE</span>
                    <span className="text-red-300">{kaliPct}%</span>
                    <span>+{(KALI_YUGA_TOTAL - KALI_ELAPSED).toLocaleString()}y</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </motion.section>

      {/* ═══ SECTION 2: WHERE ARE WE NOW? ═══ */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }} className="mb-20">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-5 md:p-8 border-2 border-gold-primary/30 bg-gradient-to-br from-gold-primary/5 via-transparent to-purple-500/5">
          <h2 className="text-3xl font-bold text-gold-gradient mb-5 text-center" style={headingFont}>
            {!isDevanagariLocale(locale) ? 'Where Are We Now?' : 'हम अभी कहाँ हैं?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { label: { en: 'Current Brahma', hi: 'वर्तमान ब्रह्मा', sa: 'वर्तमान ब्रह्मा', mai: 'वर्तमान ब्रह्मा', mr: 'वर्तमान ब्रह्मा', ta: 'தற்போதைய பிரம்மா', te: 'ప్రస్తుత బ్రహ్మ', bn: 'বর্তমান ব্রহ্মা', kn: 'ಪ್ರಸ್ತುತ ಬ್ರಹ್ಮ', gu: 'વર્તમાન બ્રહ્મા' }, value: { en: '51st year (Dvitiya Parardha)', hi: '51वाँ वर्ष (द्वितीय परार्ध)', sa: '51वाँ वर्ष (द्वितीय परार्ध)', mai: '51वाँ वर्ष (द्वितीय परार्ध)', mr: '51वाँ वर्ष (द्वितीय परार्ध)', ta: '51st year (Dvitiya Parardha)', te: '51st year (Dvitiya Parardha)', bn: '51st year (Dvitiya Parardha)', kn: '51st year (Dvitiya Parardha)', gu: '51st year (Dvitiya Parardha)' }, color: 'text-rose-300' },
              { label: { en: 'Current Kalpa', hi: 'वर्तमान कल्प', sa: 'वर्तमान कल्प', mai: 'वर्तमान कल्प', mr: 'वर्तमान कल्प', ta: 'தற்போதைய கல்பம்', te: 'ప్రస్తుత కల్పం', bn: 'বর্তমান কল্প', kn: 'ಪ್ರಸ್ತುತ ಕಲ್ಪ', gu: 'વર્તમાન કલ્પ' }, value: { en: 'Shveta-Varaha Kalpa', hi: 'श्वेत-वराह कल्प', sa: 'श्वेत-वराह कल्प', mai: 'श्वेत-वराह कल्प', mr: 'श्वेत-वराह कल्प', ta: 'Shveta-Varaha Kalpa', te: 'Shveta-Varaha Kalpa', bn: 'Shveta-Varaha Kalpa', kn: 'Shveta-Varaha Kalpa', gu: 'Shveta-Varaha Kalpa' }, color: 'text-gold-light' },
              { label: { en: 'Current Manu', hi: 'वर्तमान मनु', sa: 'वर्तमान मनु', mai: 'वर्तमान मनु', mr: 'वर्तमान मनु', ta: 'தற்போதைய மனு', te: 'ప్రస్తుత మను', bn: 'বর্তমান মনু', kn: 'ಪ್ರಸ್ತುತ ಮನು', gu: 'વર્તમાન મનુ' }, value: { en: '7th — Vaivasvata', hi: '7वें — वैवस्वत', sa: '7वें — वैवस्वत', mai: '7वें — वैवस्वत', mr: '7वें — वैवस्वत', ta: '7th — Vaivasvata', te: '7th — Vaivasvata', bn: '7th — Vaivasvata', kn: '7th — Vaivasvata', gu: '7th — Vaivasvata' }, color: 'text-blue-300' },
              { label: { en: 'Current Mahayuga', hi: 'वर्तमान महायुग', sa: 'वर्तमान महायुग', mai: 'वर्तमान महायुग', mr: 'वर्तमान महायुग', ta: 'தற்போதைய மகாயுகம்', te: 'ప్రస్తుత మహాయుగం', bn: 'বর্তমান মহাযুগ', kn: 'ಪ್ರಸ್ತುತ ಮಹಾಯುಗ', gu: 'વર્તમાન મહાયુગ' }, value: { en: '28th of 71', hi: '71 में से 28वाँ', sa: '71 में से 28वाँ', mai: '71 में से 28वाँ', mr: '71 में से 28वाँ', ta: '28th of 71', te: '28th of 71', bn: '28th of 71', kn: '28th of 71', gu: '28th of 71' }, color: 'text-emerald-300' },
              { label: { en: 'Current Yuga', hi: 'वर्तमान युग', sa: 'वर्तमान युग', mai: 'वर्तमान युग', mr: 'वर्तमान युग', ta: 'தற்போதைய யுகம்', te: 'ప్రస్తుత యుగం', bn: 'বর্তমান যুগ', kn: 'ಪ್ರಸ್ತುತ ಯುಗ', gu: 'વર્તમાન યુગ' }, value: { en: 'Kali Yuga (4th)', hi: 'कलियुग (4था)', sa: 'कलियुग (4था)', mai: 'कलियुग (4था)', mr: 'कलियुग (4था)', ta: 'Kali Yuga (4th)', te: 'Kali Yuga (4th)', bn: 'Kali Yuga (4th)', kn: 'Kali Yuga (4th)', gu: 'Kali Yuga (4th)' }, color: 'text-red-300' },
              { label: { en: 'Kali Yuga elapsed', hi: 'कलियुग बीत चुका', sa: 'कलियुग बीत चुका', mai: 'कलियुग बीत चुका', mr: 'कलियुग बीत चुका', ta: 'கலியுகம் கழிந்தது', te: 'కలియుగం గడిచింది', bn: 'কলিযুগ অতিক্রান্ত', kn: 'ಕಲಿಯುಗ ಕಳೆದಿದೆ', gu: 'કલિયુગ વીત્યું' }, value: { en: '~5,128 of 432,000 years', hi: '4,32,000 में से ~5,128 वर्ष', sa: '4,32,000 में से ~5,128 वर्ष', mai: '4,32,000 में से ~5,128 वर्ष', mr: '4,32,000 में से ~5,128 वर्ष', ta: '~5,128 of 432,000 years', te: '~5,128 of 432,000 years', bn: '~5,128 of 432,000 years', kn: '~5,128 of 432,000 years', gu: '~5,128 of 432,000 years' }, color: 'text-amber-300' },
            ].map((item) => (
              <div key={item.label.en} className="rounded-xl p-4 bg-bg-primary/40 border border-gold-primary/10 text-center">
                <div className="text-gold-dark/60 text-xs uppercase tracking-wider font-bold mb-1.5">{t2(item.label)}</div>
                <div className={`font-bold text-sm ${item.color}`}>{t2(item.value)}</div>
              </div>
            ))}
          </div>

          {/* Visual: Brahma's life progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-text-secondary mb-1.5 font-bold uppercase tracking-wider">
              <span>{!isDevanagariLocale(locale) ? "Brahma's Life Progress" : 'ब्रह्मा के जीवन की प्रगति'}</span>
              <span className="text-gold-primary">~50%</span>
            </div>
            <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden relative">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/50 via-gold-primary/50 to-rose-500/50" style={{ width: '50.5%' }} />
              <div className="absolute top-0 left-[50.5%] w-0.5 h-full bg-gold-light animate-pulse" />
            </div>
            <div className="flex justify-between text-xs text-text-secondary/70 mt-1 font-mono">
              <span>{!isDevanagariLocale(locale) ? 'Brahma born' : 'ब्रह्मा जन्म'}</span>
              <span className="text-gold-light/60">{!isDevanagariLocale(locale) ? 'WE ARE HERE' : 'हम यहाँ हैं'}</span>
              <span>{!isDevanagariLocale(locale) ? 'Mahapralaya' : 'महाप्रलय'}</span>
            </div>
          </div>

          {/* Parardha explanation */}
          <div className="mt-6 pt-6 border-t border-gold-primary/15 mb-6">
            <h4 className="text-gold-light font-bold text-sm mb-3" style={headingFont}>
              {!isDevanagariLocale(locale) ? 'What is a Parardha?' : 'परार्ध क्या है?'}
            </h4>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {locale === 'en'
                ? 'Brahma\'s 100-year lifespan is divided into two halves called Parardhas (परार्ध, literally "half of the ultimate"). Each Parardha spans 50 Brahma-years, or ~155.52 trillion human years.'
                : 'ब्रह्मा के 100 वर्ष के जीवनकाल को दो भागों में विभाजित किया गया है जिन्हें परार्ध कहते हैं (परार्ध, शाब्दिक अर्थ "परम का अर्ध")। प्रत्येक परार्ध 50 ब्रह्म-वर्ष या ~155.52 खरब मानव वर्ष का है।'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-4 bg-bg-primary/40 border border-gold-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400 font-bold text-sm">{!isDevanagariLocale(locale) ? 'Prathama Parardha' : 'प्रथम परार्ध'}</span>
                  <span className="text-text-secondary/65 text-xs">{!isDevanagariLocale(locale) ? '(First Half)' : '(पहला भाग)'}</span>
                </div>
                <div className="text-text-secondary text-xs leading-relaxed mb-2">
                  {locale === 'en'
                    ? 'Brahma\'s years 1-50. This entire half has already elapsed. The Padma Kalpa was the last Kalpa of this Parardha.'
                    : 'ब्रह्मा के वर्ष 1-50। यह पूरा भाग बीत चुका है। पद्म कल्प इस परार्ध का अंतिम कल्प था।'}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-emerald-500/30 rounded-full" />
                  <span className="text-emerald-400/60 text-xs font-mono">{!isDevanagariLocale(locale) ? 'COMPLETE' : 'पूर्ण'}</span>
                </div>
              </div>
              <div className="rounded-xl p-4 bg-bg-primary/40 border border-rose-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-rose-300 font-bold text-sm">{!isDevanagariLocale(locale) ? 'Dvitiya Parardha' : 'द्वितीय परार्ध'}</span>
                  <span className="px-1.5 py-0.5 text-xs bg-rose-500/20 text-rose-300 rounded font-bold uppercase border border-rose-500/30">{!isDevanagariLocale(locale) ? 'NOW' : 'अभी'}</span>
                </div>
                <div className="text-text-secondary text-xs leading-relaxed mb-2">
                  {locale === 'en'
                    ? 'Brahma\'s years 51-100. We are in the very first year (51st overall) of this half. The current Kalpa — Shveta-Varaha — is the first day of year 51.'
                    : 'ब्रह्मा के वर्ष 51-100। हम इस भाग के पहले ही वर्ष (कुल 51वें) में हैं। वर्तमान कल्प — श्वेत-वराह — वर्ष 51 का पहला दिन है।'}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400/40 rounded-full" style={{ width: '2%' }} />
                  </div>
                  <span className="text-rose-300/60 text-xs font-mono">~1%</span>
                </div>
              </div>
            </div>
          </div>

          {/* The 30 Kalpas */}
          <div className="mt-6 pt-6 border-t border-gold-primary/15 mb-6">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
              {!isDevanagariLocale(locale) ? 'The 30 Kalpas — Days of Brahma' : '30 कल्प — ब्रह्मा के दिन'}
            </h4>
            <p className="text-text-secondary text-xs mb-4 leading-relaxed">
              {locale === 'en'
                ? 'Each day of Brahma (4.32 billion years) is a Kalpa, named after the form or activity of creation that characterizes it. The Matsya Purana and Vayu Purana list 30 Kalpas. We are currently in the Shveta-Varaha Kalpa — the first Kalpa of Brahma\'s 51st year.'
                : 'ब्रह्मा का प्रत्येक दिन (4.32 अरब वर्ष) एक कल्प है, जिसका नाम उस सृष्टि के स्वरूप या गतिविधि पर रखा गया है। मत्स्य पुराण और वायु पुराण में 30 कल्पों की सूची है। हम वर्तमान में श्वेत-वराह कल्प में हैं — ब्रह्मा के 51वें वर्ष का पहला कल्प।'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {([
                { n: 1, en: 'Shveta-Varaha', hi: 'श्वेत-वराह', meaning: { en: 'White Boar — Vishnu as Varaha lifts Earth', hi: 'श्वेत वराह — विष्णु वराह रूप में पृथ्वी उठाते हैं', sa: 'श्वेत वराह — विष्णु वराह रूप में पृथ्वी उठाते हैं', mai: 'श्वेत वराह — विष्णु वराह रूप में पृथ्वी उठाते हैं', mr: 'श्वेत वराह — विष्णु वराह रूप में पृथ्वी उठाते हैं', ta: 'White Boar — Vishnu as Varaha lifts Earth', te: 'White Boar — Vishnu as Varaha lifts Earth', bn: 'White Boar — Vishnu as Varaha lifts Earth', kn: 'White Boar — Vishnu as Varaha lifts Earth', gu: 'White Boar — Vishnu as Varaha lifts Earth' }, current: true },
                { n: 2, en: 'Nilalohita', hi: 'नीललोहित', meaning: { en: 'Blue-Red — Shiva as Nilalohita', hi: 'नील-लोहित — शिव नीललोहित रूप', sa: 'नील-लोहित — शिव नीललोहित रूप', mai: 'नील-लोहित — शिव नीललोहित रूप', mr: 'नील-लोहित — शिव नीललोहित रूप', ta: 'Blue-Red — Shiva as Nilalohita', te: 'Blue-Red — Shiva as Nilalohita', bn: 'Blue-Red — Shiva as Nilalohita', kn: 'Blue-Red — Shiva as Nilalohita', gu: 'Blue-Red — Shiva as Nilalohita' } },
                { n: 3, en: 'Vamadeva', hi: 'वामदेव', meaning: { en: 'Gracious Lord — Shiva as Vamadeva', hi: 'वामदेव — शिव का सौम्य रूप', sa: 'वामदेव — शिव का सौम्य रूप', mai: 'वामदेव — शिव का सौम्य रूप', mr: 'वामदेव — शिव का सौम्य रूप', ta: 'Gracious Lord — Shiva as Vamadeva', te: 'Gracious Lord — Shiva as Vamadeva', bn: 'Gracious Lord — Shiva as Vamadeva', kn: 'Gracious Lord — Shiva as Vamadeva', gu: 'Gracious Lord — Shiva as Vamadeva' } },
                { n: 4, en: 'Gathantara', hi: 'गठान्तर', meaning: { en: 'Between the knots of time', hi: 'काल की गाँठों के बीच', sa: 'काल की गाँठों के बीच', mai: 'काल की गाँठों के बीच', mr: 'काल की गाँठों के बीच', ta: 'Between the knots of time', te: 'Between the knots of time', bn: 'Between the knots of time', kn: 'Between the knots of time', gu: 'Between the knots of time' } },
                { n: 5, en: 'Raurava', hi: 'रौरव', meaning: { en: 'Named after Ruru deer form', hi: 'रुरु मृग रूप के नाम पर', sa: 'रुरु मृग रूप के नाम पर', mai: 'रुरु मृग रूप के नाम पर', mr: 'रुरु मृग रूप के नाम पर', ta: 'Named after Ruru deer form', te: 'Named after Ruru deer form', bn: 'Named after Ruru deer form', kn: 'Named after Ruru deer form', gu: 'Named after Ruru deer form' } },
                { n: 6, en: 'Prana', hi: 'प्राण', meaning: { en: 'The Cosmic Breath', hi: 'ब्रह्मांडीय प्राण', sa: 'ब्रह्मांडीय प्राण', mai: 'ब्रह्मांडीय प्राण', mr: 'ब्रह्मांडीय प्राण', ta: 'The Cosmic Breath', te: 'The Cosmic Breath', bn: 'The Cosmic Breath', kn: 'The Cosmic Breath', gu: 'The Cosmic Breath' } },
                { n: 7, en: 'Brihad', hi: 'बृहत्', meaning: { en: 'The Great Expansion', hi: 'महान विस्तार', sa: 'महान विस्तार', mai: 'महान विस्तार', mr: 'महान विस्तार', ta: 'The Great Expansion', te: 'The Great Expansion', bn: 'The Great Expansion', kn: 'The Great Expansion', gu: 'The Great Expansion' } },
                { n: 8, en: 'Kandarpa', hi: 'कन्दर्प', meaning: { en: 'Desire — creative impulse', hi: 'काम — सृजन की प्रेरणा', sa: 'काम — सृजन की प्रेरणा', mai: 'काम — सृजन की प्रेरणा', mr: 'काम — सृजन की प्रेरणा', ta: 'Desire — creative impulse', te: 'Desire — creative impulse', bn: 'Desire — creative impulse', kn: 'Desire — creative impulse', gu: 'Desire — creative impulse' } },
                { n: 9, en: 'Sadya', hi: 'सद्य', meaning: { en: 'The Immediate', hi: 'तत्काल', sa: 'तत्काल', mai: 'तत्काल', mr: 'तत्काल', ta: 'The Immediate', te: 'The Immediate', bn: 'The Immediate', kn: 'The Immediate', gu: 'The Immediate' } },
                { n: 10, en: 'Ishana', hi: 'ईशान', meaning: { en: 'The Ruler — Shiva as Ishana', hi: 'ईशान — शिव का शासक रूप', sa: 'ईशान — शिव का शासक रूप', mai: 'ईशान — शिव का शासक रूप', mr: 'ईशान — शिव का शासक रूप', ta: 'The Ruler — Shiva as Ishana', te: 'The Ruler — Shiva as Ishana', bn: 'The Ruler — Shiva as Ishana', kn: 'The Ruler — Shiva as Ishana', gu: 'The Ruler — Shiva as Ishana' } },
                { n: 11, en: 'Dhyana', hi: 'ध्यान', meaning: { en: 'Meditation', hi: 'ध्यान', sa: 'ध्यान', mai: 'ध्यान', mr: 'ध्यान', ta: 'Meditation', te: 'Meditation', bn: 'Meditation', kn: 'Meditation', gu: 'Meditation' } },
                { n: 12, en: 'Sarasvata', hi: 'सारस्वत', meaning: { en: 'Of Sarasvati — knowledge', hi: 'सरस्वती — ज्ञान का कल्प', sa: 'सरस्वती — ज्ञान का कल्प', mai: 'सरस्वती — ज्ञान का कल्प', mr: 'सरस्वती — ज्ञान का कल्प', ta: 'Of Sarasvati — knowledge', te: 'Of Sarasvati — knowledge', bn: 'Of Sarasvati — knowledge', kn: 'Of Sarasvati — knowledge', gu: 'Of Sarasvati — knowledge' } },
                { n: 13, en: 'Udana', hi: 'उदान', meaning: { en: 'Upward breath', hi: 'ऊर्ध्व प्राण', sa: 'ऊर्ध्व प्राण', mai: 'ऊर्ध्व प्राण', mr: 'ऊर्ध्व प्राण', ta: 'Upward breath', te: 'Upward breath', bn: 'Upward breath', kn: 'Upward breath', gu: 'Upward breath' } },
                { n: 14, en: 'Garuda', hi: 'गरुड', meaning: { en: 'The divine eagle of Vishnu', hi: 'विष्णु का दिव्य वाहन गरुड', sa: 'विष्णु का दिव्य वाहन गरुड', mai: 'विष्णु का दिव्य वाहन गरुड', mr: 'विष्णु का दिव्य वाहन गरुड', ta: 'The divine eagle of Vishnu', te: 'The divine eagle of Vishnu', bn: 'The divine eagle of Vishnu', kn: 'The divine eagle of Vishnu', gu: 'The divine eagle of Vishnu' } },
                { n: 15, en: 'Kaurma', hi: 'कौर्म', meaning: { en: 'Tortoise — Vishnu as Kurma', hi: 'कूर्म — विष्णु का कच्छप रूप', sa: 'कूर्म — विष्णु का कच्छप रूप', mai: 'कूर्म — विष्णु का कच्छप रूप', mr: 'कूर्म — विष्णु का कच्छप रूप', ta: 'Tortoise — Vishnu as Kurma', te: 'Tortoise — Vishnu as Kurma', bn: 'Tortoise — Vishnu as Kurma', kn: 'Tortoise — Vishnu as Kurma', gu: 'Tortoise — Vishnu as Kurma' } },
                { n: 16, en: 'Narasimha', hi: 'नारसिंह', meaning: { en: 'Man-Lion avatar of Vishnu', hi: 'विष्णु का नरसिंह अवतार', sa: 'विष्णु का नरसिंह अवतार', mai: 'विष्णु का नरसिंह अवतार', mr: 'विष्णु का नरसिंह अवतार', ta: 'Man-Lion avatar of Vishnu', te: 'Man-Lion avatar of Vishnu', bn: 'Man-Lion avatar of Vishnu', kn: 'Man-Lion avatar of Vishnu', gu: 'Man-Lion avatar of Vishnu' } },
                { n: 17, en: 'Samana', hi: 'समान', meaning: { en: 'The Equalizing breath', hi: 'समान प्राण', sa: 'समान प्राण', mai: 'समान प्राण', mr: 'समान प्राण', ta: 'The Equalizing breath', te: 'The Equalizing breath', bn: 'The Equalizing breath', kn: 'The Equalizing breath', gu: 'The Equalizing breath' } },
                { n: 18, en: 'Agneya', hi: 'आग्नेय', meaning: { en: 'Of Agni — fire creation', hi: 'अग्नि — अग्नि सृष्टि', sa: 'अग्नि — अग्नि सृष्टि', mai: 'अग्नि — अग्नि सृष्टि', mr: 'अग्नि — अग्नि सृष्टि', ta: 'Of Agni — fire creation', te: 'Of Agni — fire creation', bn: 'Of Agni — fire creation', kn: 'Of Agni — fire creation', gu: 'Of Agni — fire creation' } },
                { n: 19, en: 'Soma', hi: 'सोम', meaning: { en: 'Moon — the nectar of immortality', hi: 'चन्द्र — अमृत का कल्प', sa: 'चन्द्र — अमृत का कल्प', mai: 'चन्द्र — अमृत का कल्प', mr: 'चन्द्र — अमृत का कल्प', ta: 'Moon — the nectar of immortality', te: 'Moon — the nectar of immortality', bn: 'Moon — the nectar of immortality', kn: 'Moon — the nectar of immortality', gu: 'Moon — the nectar of immortality' } },
                { n: 20, en: 'Manava', hi: 'मानव', meaning: { en: 'Of Manu — human creation', hi: 'मनु — मानव सृष्टि', sa: 'मनु — मानव सृष्टि', mai: 'मनु — मानव सृष्टि', mr: 'मनु — मानव सृष्टि', ta: 'Of Manu — human creation', te: 'Of Manu — human creation', bn: 'Of Manu — human creation', kn: 'Of Manu — human creation', gu: 'Of Manu — human creation' } },
                { n: 21, en: 'Tatpurusha', hi: 'तत्पुरुष', meaning: { en: 'Supreme Person — Shiva as Tatpurusha', hi: 'तत्पुरुष — शिव का परम पुरुष रूप', sa: 'तत्पुरुष — शिव का परम पुरुष रूप', mai: 'तत्पुरुष — शिव का परम पुरुष रूप', mr: 'तत्पुरुष — शिव का परम पुरुष रूप', ta: 'Supreme Person — Shiva as Tatpurusha', te: 'Supreme Person — Shiva as Tatpurusha', bn: 'Supreme Person — Shiva as Tatpurusha', kn: 'Supreme Person — Shiva as Tatpurusha', gu: 'Supreme Person — Shiva as Tatpurusha' } },
                { n: 22, en: 'Vaikunta', hi: 'वैकुण्ठ', meaning: { en: 'Vishnu\'s supreme abode', hi: 'विष्णु का परम धाम' } },
                { n: 23, en: 'Lakshmi', hi: 'लक्ष्मी', meaning: { en: 'Goddess of prosperity', hi: 'समृद्धि की देवी', sa: 'समृद्धि की देवी', mai: 'समृद्धि की देवी', mr: 'समृद्धि की देवी', ta: 'Goddess of prosperity', te: 'Goddess of prosperity', bn: 'Goddess of prosperity', kn: 'Goddess of prosperity', gu: 'Goddess of prosperity' } },
                { n: 24, en: 'Savitri', hi: 'सावित्री', meaning: { en: 'Solar creative power', hi: 'सौर सृजन शक्ति', sa: 'सौर सृजन शक्ति', mai: 'सौर सृजन शक्ति', mr: 'सौर सृजन शक्ति', ta: 'Solar creative power', te: 'Solar creative power', bn: 'Solar creative power', kn: 'Solar creative power', gu: 'Solar creative power' } },
                { n: 25, en: 'Aghora', hi: 'अघोर', meaning: { en: 'Non-terrifying — Shiva as Aghora', hi: 'अघोर — शिव का अभय रूप', sa: 'अघोर — शिव का अभय रूप', mai: 'अघोर — शिव का अभय रूप', mr: 'अघोर — शिव का अभय रूप', ta: 'Non-terrifying — Shiva as Aghora', te: 'Non-terrifying — Shiva as Aghora', bn: 'Non-terrifying — Shiva as Aghora', kn: 'Non-terrifying — Shiva as Aghora', gu: 'Non-terrifying — Shiva as Aghora' } },
                { n: 26, en: 'Varaha', hi: 'वराह', meaning: { en: 'Boar incarnation', hi: 'वराह अवतार', sa: 'वराह अवतार', mai: 'वराह अवतार', mr: 'वराह अवतार', ta: 'Boar incarnation', te: 'Boar incarnation', bn: 'Boar incarnation', kn: 'Boar incarnation', gu: 'Boar incarnation' } },
                { n: 27, en: 'Vairaja', hi: 'वैराज', meaning: { en: 'Of Viraj — the cosmic body', hi: 'विराज — विराट पुरुष का कल्प', sa: 'विराज — विराट पुरुष का कल्प', mai: 'विराज — विराट पुरुष का कल्प', mr: 'विराज — विराट पुरुष का कल्प', ta: 'Of Viraj — the cosmic body', te: 'Of Viraj — the cosmic body', bn: 'Of Viraj — the cosmic body', kn: 'Of Viraj — the cosmic body', gu: 'Of Viraj — the cosmic body' } },
                { n: 28, en: 'Gauri', hi: 'गौरी', meaning: { en: 'The radiant — Parvati\'s form', hi: 'गौरी — पार्वती का उज्ज्वल रूप' } },
                { n: 29, en: 'Mahesvara', hi: 'माहेश्वर', meaning: { en: 'The Great Lord — Shiva', hi: 'महेश्वर — शिव', sa: 'महेश्वर — शिव', mai: 'महेश्वर — शिव', mr: 'महेश्वर — शिव', ta: 'The Great Lord — Shiva', te: 'The Great Lord — Shiva', bn: 'The Great Lord — Shiva', kn: 'The Great Lord — Shiva', gu: 'The Great Lord — Shiva' } },
                { n: 30, en: 'Pitri', hi: 'पितृ', meaning: { en: 'Of the ancestors', hi: 'पितरों का कल्प', sa: 'पितरों का कल्प', mai: 'पितरों का कल्प', mr: 'पितरों का कल्प', ta: 'Of the ancestors', te: 'Of the ancestors', bn: 'Of the ancestors', kn: 'Of the ancestors', gu: 'Of the ancestors' } },
              ] as { n: number; en: string; hi: string; meaning: LocaleText; current?: boolean }[]).map((k) => (
                <div key={k.n} className={`rounded-lg px-3 py-2.5 flex items-start gap-2.5 ${k.current ? 'bg-gold-primary/8 border border-gold-primary/25' : 'bg-bg-primary/30 border border-gold-primary/5'}`}>
                  <span className={`text-xs font-mono font-bold mt-0.5 flex-shrink-0 ${k.current ? 'text-gold-primary' : 'text-text-secondary/65'}`}>{String(k.n).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-bold text-xs ${k.current ? 'text-gold-light' : 'text-text-primary'}`}>{!isDevanagariLocale(locale) ? k.en : k.hi}</span>
                      {locale === 'en' && <span className="text-gold-dark/40 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{k.hi}</span>}
                      {k.current && <span className="px-1 py-0 text-xs bg-gold-primary/20 text-gold-primary rounded font-bold uppercase leading-tight">{!isDevanagariLocale(locale) ? 'CURRENT' : 'वर्तमान'}</span>}
                    </div>
                    <p className="text-text-secondary/75 text-xs leading-snug mt-0.5">{t2(k.meaning)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pralaya types */}
          <div className="pt-6 border-t border-gold-primary/15">
            <h4 className="text-gold-light font-bold text-sm mb-4" style={headingFont}>
              {!isDevanagariLocale(locale) ? 'The Four Types of Pralaya (Dissolution)' : 'प्रलय के चार प्रकार'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: { en: 'Nitya Pralaya', hi: 'नित्य प्रलय', sa: 'नित्य प्रलय', mai: 'नित्य प्रलय', mr: 'नित्य प्रलय', ta: 'நித்ய பிரளயம்', te: 'నిత్య ప్రళయం', bn: 'নিত্য প্রলয়', kn: 'ನಿತ್ಯ ಪ್ರಳಯ', gu: 'નિત્ય પ્રલય' },
                  desc: { en: 'Daily dissolution — the sleep and death of individual beings. Occurs continuously.', hi: 'दैनिक विलय — व्यक्तिगत प्राणियों की नींद और मृत्यु। निरन्तर होता है।', sa: 'दैनिक विलय — व्यक्तिगत प्राणियों की नींद च मृत्यु। निरन्तर होता अस्ति।', mai: 'दैनिक विलय — व्यक्तिगत प्राणियों की नींद आ मृत्यु। निरन्तर होता अछि।', mr: 'दैनिक विलय — व्यक्तिगत प्राणियों की नींद आणि मृत्यु। निरन्तर होता आहे.', ta: 'தினசரி கலைப்பு — தனிப்பட்ட உயிரினங்களின் தூக்கமும் மரணமும். தொடர்ச்சியாக நிகழ்கிறது.', te: 'దైనిక ప్రళయం — వ్యక్తిగత జీవుల నిద్ర మరియు మరణం. నిరంతరం జరుగుతుంది.', bn: 'দৈনিক প্রলয় — প্রাণীদের নিদ্রা ও মৃত্যু। নিরন্তর ঘটে।', kn: 'ದೈನಿಕ ಪ್ರಳಯ — ಜೀವಿಗಳ ನಿದ್ರೆ ಮತ್ತು ಮರಣ. ನಿರಂತರವಾಗಿ ಸಂಭವಿಸುತ್ತದೆ.', gu: 'દૈનિક પ્રલય — જીવોની નિદ્રા અને મૃત્યુ. સતત થાય છે.' },
                  color: 'text-emerald-400', border: 'border-emerald-500/20',
                },
                {
                  name: { en: 'Naimittika Pralaya', hi: 'नैमित्तिक प्रलय', sa: 'नैमित्तिक प्रलय', mai: 'नैमित्तिक प्रलय', mr: 'नैमित्तिक प्रलय', ta: 'நைமித்திக பிரளயம்', te: 'నైమిత్తిక ప్రళయం', bn: 'নৈমিত্তিক প্রলয়', kn: 'ನೈಮಿತ್ತಿಕ ಪ್ರಳಯ', gu: 'નૈમિત્તિક પ્રલય' },
                  desc: { en: 'Brahma\'s nightly sleep — the three lower worlds dissolve, higher lokas survive. Occurs every Kalpa (4.32B years).', hi: 'ब्रह्मा की रात्रि निद्रा — तीन निचले लोक विलीन, उच्चतर लोक बचते हैं। प्रत्येक कल्प (4.32 अरब वर्ष) में होता है।' },
                  color: 'text-blue-400', border: 'border-blue-500/20',
                },
                {
                  name: { en: 'Prakritika Pralaya (Mahapralaya)', hi: 'प्राकृतिक प्रलय (महाप्रलय)', sa: 'प्राकृतिक प्रलय (महाप्रलय)', mai: 'प्राकृतिक प्रलय (महाप्रलय)', mr: 'प्राकृतिक प्रलय (महाप्रलय)', ta: 'பிராகிருதிக பிரளயம் (மகாபிரளயம்)', te: 'ప్రాకృతిక ప్రళయం (మహాప్రళయం)', bn: 'প্রাকৃতিক প্রলয় (মহাপ্রলয়)', kn: 'ಪ್ರಾಕೃತಿಕ ಪ್ರಳಯ (ಮಹಾಪ್ರಳಯ)', gu: 'પ્રાકૃતિક પ્રલય (મહાપ્રલય)' },
                  desc: { en: 'Brahma\'s death — everything dissolves into Prakriti (primordial nature). Even Brahma ceases. Occurs after 100 Brahma years (311 trillion years).', hi: 'ब्रह्मा की मृत्यु — ब्रह्मा सहित सब कुछ प्रकृति में विलीन। 100 ब्रह्मवर्ष (311 खरब वर्ष) बाद होता है।' },
                  color: 'text-rose-400', border: 'border-rose-500/20',
                },
                {
                  name: { en: 'Atyantika Pralaya', hi: 'आत्यन्तिक प्रलय', sa: 'आत्यन्तिक प्रलय', mai: 'आत्यन्तिक प्रलय', mr: 'आत्यन्तिक प्रलय', ta: 'ஆத்யந்திக பிரளயம்', te: 'ఆత్యంతిక ప్రళయం', bn: 'আত্যন্তিক প্রলয়', kn: 'ಆತ್ಯಂತಿಕ ಪ್ರಳಯ', gu: 'આત્યંતિક પ્રલય' },
                  desc: { en: 'Individual liberation (Moksha) — the soul\'s personal dissolution from the cycle of rebirth. Not cosmic, but the ultimate goal of Jyotish and Vedanta.', hi: 'व्यक्तिगत मुक्ति (मोक्ष) — आत्मा का पुनर्जन्म चक्र से मुक्ति। ब्रह्मांडीय नहीं, लेकिन ज्योतिष और वेदान्त का अन्तिम लक्ष्य।' },
                  color: 'text-gold-primary', border: 'border-gold-primary/20',
                },
              ].map((p) => (
                <div key={p.name.en} className={`rounded-lg p-4 border ${p.border} bg-bg-primary/30`}>
                  <div className={`font-bold text-sm mb-1 ${p.color}`}>{t2(p.name)}</div>
                  <p className="text-text-secondary text-xs leading-relaxed">{t2(p.desc)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* After Mahapralaya */}
          <div className="mt-6 p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10 text-center">
            <p className="text-text-secondary text-sm leading-relaxed italic">
              {locale === 'en'
                ? '"After Mahapralaya, for a period equal to Brahma\'s entire lifespan, nothing exists but Maha-Vishnu resting on the cosmic serpent Shesha upon the causal ocean. Then, from His navel springs a lotus, from which a new Brahma is born, and 311 trillion years of creation begin again." — Bhagavata Purana'
                : '"महाप्रलय के बाद, ब्रह्मा के सम्पूर्ण जीवनकाल के बराबर अवधि तक, कारण सागर पर शेषनाग पर विश्राम करते महा-विष्णु के अतिरिक्त कुछ भी विद्यमान नहीं रहता। फिर, उनकी नाभि से एक कमल प्रकट होता है, जिससे नए ब्रह्मा का जन्म होता है, और 311 खरब वर्षों की सृष्टि पुनः आरंभ होती है।" — भागवत पुराण'}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ═══ SECTION 3: COSMIC TIME HIERARCHY — Mahayuga to Brahma's Life ═══ */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mb-20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <svg width={56} height={56} viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="cosmic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#d4a853" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="28" stroke="url(#cosmic-grad)" strokeWidth="1" fill="none" opacity="0.2" />
              <circle cx="32" cy="32" r="22" stroke="url(#cosmic-grad)" strokeWidth="1.5" fill="none" opacity="0.3" />
              <circle cx="32" cy="32" r="16" stroke="url(#cosmic-grad)" strokeWidth="2" fill="none" opacity="0.4" />
              <circle cx="32" cy="32" r="10" stroke="url(#cosmic-grad)" strokeWidth="2.5" fill="none" opacity="0.5" />
              <circle cx="32" cy="32" r="4" fill="url(#cosmic-grad)" opacity="0.8" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
            {!isDevanagariLocale(locale) ? 'The Cosmic Time Hierarchy' : isDevanagari ? 'ब्रह्मांडीय काल पदानुक्रम' : 'ब्रह्माण्डीय काल पदानुक्रमः'}
          </h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Hindu cosmology describes time as a nested hierarchy of cycles within cycles — from a single Mahayuga all the way to the lifespan of Brahma, the Creator. Each level of the hierarchy has precise mathematical relationships defined in the Surya Siddhanta and Vishnu Purana.'
              : 'हिन्दू ब्रह्मांड विज्ञान समय को चक्रों के भीतर चक्रों के एक नेस्टेड पदानुक्रम के रूप में वर्णित करता है — एक महायुग से लेकर सृष्टिकर्ता ब्रह्मा के जीवनकाल तक। पदानुक्रम का प्रत्येक स्तर सूर्य सिद्धांत और विष्णु पुराण में परिभाषित सटीक गणितीय संबंध रखता है।'}
          </p>
        </div>

        {/* Hierarchy ladder */}
        <div className="space-y-4 mb-10">
          {[
            {
              level: 1,
              name: { en: 'Mahayuga', hi: 'महायुग', sa: 'महायुग', mai: 'महायुग', mr: 'महायुग', ta: 'மகாயுகம்', te: 'మహాయుగం', bn: 'মহাযুগ', kn: 'ಮಹಾಯುಗ', gu: 'મહાયુગ' },
              sanskrit: 'महायुगम्',
              value: '4,320,000',
              unit: { en: 'years', hi: 'वर्ष', sa: 'वर्ष', mai: 'वर्ष', mr: 'वर्ष', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષ' },
              formula: { en: 'Satya (1.728M) + Treta (1.296M) + Dvapara (0.864M) + Kali (0.432M)', hi: 'सत्य (17.28 लाख) + त्रेता (12.96 लाख) + द्वापर (8.64 लाख) + कलि (4.32 लाख)', sa: 'सत्य (17.28 लाख) + त्रेता (12.96 लाख) + द्वापर (8.64 लाख) + कलि (4.32 लाख)', mai: 'सत्य (17.28 लाख) + त्रेता (12.96 लाख) + द्वापर (8.64 लाख) + कलि (4.32 लाख)', mr: 'सत्य (17.28 लाख) + त्रेता (12.96 लाख) + द्वापर (8.64 लाख) + कलि (4.32 लाख)', ta: 'சத்யம் (1.728M) + திரேதா (1.296M) + துவாபரம் (0.864M) + கலி (0.432M)', te: 'సత్య (1.728M) + త్రేతా (1.296M) + ద్వాపర (0.864M) + కలి (0.432M)', bn: 'সত্য (1.728M) + ত্রেতা (1.296M) + দ্বাপর (0.864M) + কলি (0.432M)', kn: 'ಸತ್ಯ (1.728M) + ತ್ರೇತಾ (1.296M) + ದ್ವಾಪರ (0.864M) + ಕಲಿ (0.432M)', gu: 'સત્ય (1.728M) + ત્રેતા (1.296M) + દ્વાપર (0.864M) + કલિ (0.432M)' },
              desc: {
                en: 'One complete cycle of the four Yugas. The ratio between them is 4:3:2:1, reflecting the progressive decline of Dharma. Each Yuga also has a transitional dawn (Sandhya) and dusk (Sandhyamsha) period, which are included in the counts above.',
                hi: 'चारों युगों का एक पूर्ण चक्र। उनके बीच का अनुपात 4:3:2:1 है, जो धर्म की क्रमिक गिरावट को दर्शाता है। प्रत्येक युग की एक संक्रमणकालीन प्रभात (संध्या) और सन्ध्यांश अवधि भी है।',
              },
              color: 'border-emerald-500/30',
              dotColor: 'bg-emerald-400',
            },
            {
              level: 2,
              name: { en: 'Manvantara', hi: 'मन्वन्तर', sa: 'मन्वन्तर', mai: 'मन्वन्तर', mr: 'मन्वन्तर', ta: 'மன்வந்தரம்', te: 'మన్వంతరం', bn: 'মন্বন্তর', kn: 'ಮನ್ವಂತರ', gu: 'મન્વંતર' },
              sanskrit: 'मन्वन्तरम्',
              value: '306,720,000',
              unit: { en: 'years', hi: 'वर्ष', sa: 'वर्ष', mai: 'वर्ष', mr: 'वर्ष', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષ' },
              formula: { en: '71 Mahayugas = 71 × 4,320,000', hi: '71 महायुग = 71 × 43,20,000', sa: '71 महायुग = 71 × 43,20,000', mai: '71 महायुग = 71 × 43,20,000', mr: '71 महायुग = 71 × 43,20,000', ta: '71 மகாயுகங்கள் = 71 × 4,320,000', te: '71 మహాయుగాలు = 71 × 4,320,000', bn: '71 মহাযুগ = 71 × 4,320,000', kn: '71 ಮಹಾಯುಗಗಳು = 71 × 4,320,000', gu: '71 મહાયુગ = 71 × 4,320,000' },
              desc: {
                en: 'The reign of one Manu — the progenitor of humanity for that age. Each Manu establishes Dharma, law, and social order. There are 14 Manus in a Kalpa. We are in the 7th Manvantara under Vaivasvata Manu (also called Shraddhadeva), the 28th Mahayuga of this Manvantara.',
                hi: 'एक मनु का शासनकाल — उस युग में मानवता के प्रजापिता। प्रत्येक मनु धर्म, विधि और सामाजिक व्यवस्था स्थापित करता है। एक कल्प में 14 मनु होते हैं। हम 7वें मन्वन्तर में वैवस्वत मनु (श्राद्धदेव) के अधीन हैं, इस मन्वन्तर के 28वें महायुग में।',
              },
              color: 'border-blue-500/30',
              dotColor: 'bg-blue-400',
            },
            {
              level: 3,
              name: { en: 'Kalpa (Day of Brahma)', hi: 'कल्प (ब्रह्मा का दिन)', sa: 'कल्प (ब्रह्मा का दिन)', mai: 'कल्प (ब्रह्मा का दिन)', mr: 'कल्प (ब्रह्मा का दिन)', ta: 'கல்பம் (பிரம்மாவின் பகல்)', te: 'కల్పం (బ్రహ్మ దినం)', bn: 'কল্প (ব্রহ্মার দিন)', kn: 'ಕಲ್ಪ (ಬ್ರಹ್ಮನ ದಿನ)', gu: 'કલ્પ (બ્રહ્માનો દિવસ)' },
              sanskrit: 'कल्पः',
              value: '4,320,000,000',
              unit: { en: 'years (4.32 billion)', hi: 'वर्ष (4.32 अरब)', sa: 'वर्ष (4.32 अरब)', mai: 'वर्ष (4.32 अरब)', mr: 'वर्ष (4.32 अरब)', ta: 'ஆண்டுகள் (4.32 பில்லியன்)', te: 'సంవత్సరాలు (4.32 బిలియన్)', bn: 'বছর (4.32 বিলিয়ন)', kn: 'ವರ್ಷಗಳು (4.32 ಬಿಲಿಯನ್)', gu: 'વર્ષ (4.32 અબજ)' },
              formula: { en: '14 Manvantaras + 15 Sandhya gaps = 1,000 Mahayugas', hi: '14 मन्वन्तर + 15 संध्या अन्तराल = 1,000 महायुग', sa: '14 मन्वन्तर + 15 संध्या अन्तराल = 1,000 महायुग', mai: '14 मन्वन्तर + 15 संध्या अन्तराल = 1,000 महायुग', mr: '14 मन्वन्तर + 15 संध्या अन्तराल = 1,000 महायुग', ta: '14 மன்வந்தரங்கள் + 15 சந்தியா இடைவெளிகள் = 1,000 மகாயுகங்கள்', te: '14 మన్వంతరాలు + 15 సంధ్య అంతరాలు = 1,000 మహాయుగాలు', bn: '14 মন্বন্তর + 15 সন্ধ্যা অন্তর = 1,000 মহাযুগ', kn: '14 ಮನ್ವಂತರಗಳು + 15 ಸಂಧ್ಯಾ ಅಂತರಗಳು = 1,000 ಮಹಾಯುಗಗಳು', gu: '14 મન્વંતર + 15 સંધ્યા અંતરાલ = 1,000 મહાયુગ' },
              desc: {
                en: 'One day of Brahma — the waking period when the universe exists. During a Kalpa, 14 Manus reign in succession, with a Sandhya (twilight dissolution) between each. At the end of the Kalpa, a partial dissolution (Naimittika Pralaya) occurs. The current Kalpa is called Shveta-Varaha Kalpa ("White Boar"), named after Vishnu\'s Varaha avatar.',
                hi: 'ब्रह्मा का एक दिन — जागरण काल जब सृष्टि विद्यमान रहती है। एक कल्प में 14 मनु क्रमशः शासन करते हैं। कल्प के अंत में नैमित्तिक प्रलय होता है। वर्तमान कल्प को श्वेत-वराह कल्प कहते हैं — विष्णु के वराह अवतार के नाम पर।',
              },
              color: 'border-gold-primary/40',
              dotColor: 'bg-gold-primary',
              highlight: true,
            },
            {
              level: 4,
              name: { en: 'Night of Brahma (Pralaya)', hi: 'ब्रह्मा की रात्रि (प्रलय)', sa: 'ब्रह्मा की रात्रि (प्रलय)', mai: 'ब्रह्मा की रात्रि (प्रलय)', mr: 'ब्रह्मा की रात्रि (प्रलय)', ta: 'பிரம்மாவின் இரவு (பிரளயம்)', te: 'బ్రహ్మ రాత్రి (ప్రళయం)', bn: 'ব্রহ্মার রাত্রি (প্রলয়)', kn: 'ಬ್ರಹ್ಮನ ರಾತ್ರಿ (ಪ್ರಳಯ)', gu: 'બ્રહ્માની રાત (પ્રલય)' },
              sanskrit: 'ब्रह्मरात्रिः (प्रलयः)',
              value: '4,320,000,000',
              unit: { en: 'years (equal to one Kalpa)', hi: 'वर्ष (एक कल्प के बराबर)', sa: 'वर्ष (एक कल्प के बराबर)', mai: 'वर्ष (एक कल्प के बराबर)', mr: 'वर्ष (एक कल्प के बराबर)', ta: 'ஆண்டுகள் (ஒரு கல்பத்திற்கு சமம்)', te: 'సంవత్సరాలు (ఒక కల్పానికి సమానం)', bn: 'বছর (এক কল্পের সমান)', kn: 'ವರ್ಷಗಳು (ಒಂದು ಕಲ್ಪಕ್ಕೆ ಸಮಾನ)', gu: 'વર્ષ (એક કલ્પ જેટલા)' },
              formula: { en: '1 Night = 1 Day = 4.32 billion years', hi: '1 रात्रि = 1 दिन = 4.32 अरब वर्ष', sa: '1 रात्रि = 1 दिन = 4.32 अरब वर्ष', mai: '1 रात्रि = 1 दिन = 4.32 अरब वर्ष', mr: '1 रात्रि = 1 दिन = 4.32 अरब वर्ष', ta: '1 இரவு = 1 பகல் = 4.32 பில்லியன் ஆண்டுகள்', te: '1 రాత్రి = 1 దినం = 4.32 బిలియన్ సంవత్సరాలు', bn: '1 রাত্রি = 1 দিন = 4.32 বিলিয়ন বছর', kn: '1 ರಾತ್ರಿ = 1 ದಿನ = 4.32 ಬಿಲಿಯನ್ ವರ್ಷ', gu: '1 રાત = 1 દિવસ = 4.32 અબજ વર્ષ' },
              desc: {
                en: 'When Brahma sleeps, the three worlds (Bhuloka, Bhuvarloka, Svargaloka) are submerged in the cosmic ocean. All living beings enter a state of suspended existence (Avyakta) within Brahma. The higher worlds (Maharloka and above) survive. When Brahma wakes, creation resumes from where it paused — this is Naimittika Pralaya (incidental dissolution), not total annihilation.',
                hi: 'जब ब्रह्मा सोते हैं, तीनों लोक (भूलोक, भुवर्लोक, स्वर्गलोक) ब्रह्मांडीय जलप्रलय में डूब जाते हैं। सभी जीव ब्रह्मा के भीतर अव्यक्त अवस्था में प्रवेश करते हैं। उच्चतर लोक (महर्लोक और ऊपर) बचे रहते हैं। जब ब्रह्मा जागते हैं, सृष्टि वहीं से पुनः आरंभ होती है — यह नैमित्तिक प्रलय है, पूर्ण विनाश नहीं।',
              },
              color: 'border-purple-500/30',
              dotColor: 'bg-purple-400',
            },
            {
              level: 5,
              name: { en: 'Day + Night of Brahma', hi: 'ब्रह्मा का एक अहोरात्र', sa: 'ब्रह्मा का एक अहोरात्र', mai: 'ब्रह्मा का एक अहोरात्र', mr: 'ब्रह्मा का एक अहोरात्र', ta: 'பிரம்மாவின் பகல் + இரவு', te: 'బ్రహ్మ దినం + రాత్రి', bn: 'ব্রহ্মার দিন + রাত্রি', kn: 'ಬ್ರಹ್ಮನ ದಿನ + ರಾತ್ರಿ', gu: 'બ્રહ્માનો દિવસ + રાત' },
              sanskrit: 'ब्रह्माहोरात्रम्',
              value: '8,640,000,000',
              unit: { en: 'years (8.64 billion)', hi: 'वर्ष (8.64 अरब)', sa: 'वर्ष (8.64 अरब)', mai: 'वर्ष (8.64 अरब)', mr: 'वर्ष (8.64 अरब)', ta: 'ஆண்டுகள் (8.64 பில்லியன்)', te: 'సంవత్సరాలు (8.64 బిలియన్)', bn: 'বছর (8.64 বিলিয়ন)', kn: 'ವರ್ಷಗಳು (8.64 ಬಿಲಿಯನ್)', gu: 'વર્ષ (8.64 અબજ)' },
              formula: { en: '1 Day (4.32B) + 1 Night (4.32B)', hi: '1 दिन (4.32 अ) + 1 रात्रि (4.32 अ)', sa: '1 दिन (4.32 अ) + 1 रात्रि (4.32 अ)', mai: '1 दिन (4.32 अ) + 1 रात्रि (4.32 अ)', mr: '1 दिन (4.32 अ) + 1 रात्रि (4.32 अ)', ta: '1 பகல் (4.32B) + 1 இரவு (4.32B)', te: '1 దినం (4.32B) + 1 రాత్రి (4.32B)', bn: '1 দিন (4.32B) + 1 রাত্রি (4.32B)', kn: '1 ದಿನ (4.32B) + 1 ರಾತ್ರಿ (4.32B)', gu: '1 દિવસ (4.32B) + 1 રાત (4.32B)' },
              desc: {
                en: 'One complete day-night cycle of Brahma. The universe manifests during the day and dissolves during the night. This is remarkably close to modern estimates of the age of our observable universe (~13.8 billion years for half its projected lifespan).',
                hi: 'ब्रह्मा का एक पूर्ण दिन-रात्रि चक्र। दिन में सृष्टि प्रकट होती है और रात्रि में विलीन। यह हमारे दृश्य ब्रह्मांड की आयु (~13.8 अरब वर्ष) के आधुनिक अनुमानों के उल्लेखनीय रूप से करीब है।',
              },
              color: 'border-indigo-500/30',
              dotColor: 'bg-indigo-400',
            },
            {
              level: 6,
              name: { en: 'Year of Brahma', hi: 'ब्रह्मा का एक वर्ष', sa: 'ब्रह्मा का एक वर्ष', mai: 'ब्रह्मा का एक वर्ष', mr: 'ब्रह्मा का एक वर्ष', ta: 'பிரம்மாவின் வருடம்', te: 'బ్రహ్మ సంవత్సరం', bn: 'ব্রহ্মার বছর', kn: 'ಬ್ರಹ್ಮನ ವರ್ಷ', gu: 'બ્રહ્માનું વર્ષ' },
              sanskrit: 'ब्रह्मवर्षम्',
              value: '3,110,400,000,000',
              unit: { en: 'years (3.11 trillion)', hi: 'वर्ष (3.11 खरब)', sa: 'वर्ष (3.11 खरब)', mai: 'वर्ष (3.11 खरब)', mr: 'वर्ष (3.11 खरब)', ta: 'ஆண்டுகள் (3.11 டிரில்லியன்)', te: 'సంవత్సరాలు (3.11 ట్రిలియన్)', bn: 'বছর (3.11 ট্রিলিয়ন)', kn: 'ವರ್ಷಗಳು (3.11 ಟ್ರಿಲಿಯನ್)', gu: 'વર્ષ (3.11 ટ્રિલિયન)' },
              formula: { en: '360 Day-Night cycles × 8.64B', hi: '360 अहोरात्र चक्र × 8.64 अरब', sa: '360 अहोरात्र चक्र × 8.64 अरब', mai: '360 अहोरात्र चक्र × 8.64 अरब', mr: '360 अहोरात्र चक्र × 8.64 अरब', ta: '360 பகல்-இரவு சுழற்சிகள் × 8.64B', te: '360 దిన-రాత్రి చక్రాలు × 8.64B', bn: '360 দিন-রাত্রি চক্র × 8.64B', kn: '360 ದಿನ-ರಾತ್ರಿ ಚಕ್ರಗಳು × 8.64B', gu: '360 દિવસ-રાત ચક્ર × 8.64B' },
              desc: {
                en: 'Brahma\'s year consists of 360 of his day-night cycles (using the divine calendar where there are no extra days). Each of these 360 days sees one complete creation and dissolution of the three worlds.',
                hi: 'ब्रह्मा के वर्ष में उनके 360 अहोरात्र चक्र होते हैं। इन 360 दिनों में से प्रत्येक में तीनों लोकों की एक पूर्ण सृष्टि और विलय होती है।',
              },
              color: 'border-amber-500/30',
              dotColor: 'bg-amber-400',
            },
            {
              level: 7,
              name: { en: 'Life of Brahma (Mahakalpa)', hi: 'ब्रह्मा का जीवनकाल (महाकल्प)', sa: 'ब्रह्मा का जीवनम्काल (महाकल्प)', mai: 'ब्रह्मा का जीवनकाल (महाकल्प)', mr: 'ब्रह्मा का जीवनकाल (महाकल्प)', ta: 'பிரம்மாவின் ஆயுள் (மகாகல்பம்)', te: 'బ్రహ్మ ఆయుష్షు (మహాకల్పం)', bn: 'ব্রহ্মার আয়ু (মহাকল্প)', kn: 'ಬ್ರಹ್ಮನ ಆಯುಷ್ಯ (ಮಹಾಕಲ್ಪ)', gu: 'બ્રહ્માનું આયુષ્ય (મહાકલ્પ)' },
              sanskrit: 'ब्रह्मायुः (महाकल्पः)',
              value: '311,040,000,000,000',
              unit: { en: 'years (311.04 trillion)', hi: 'वर्ष (311.04 खरब)', sa: 'वर्ष (311.04 खरब)', mai: 'वर्ष (311.04 खरब)', mr: 'वर्ष (311.04 खरब)', ta: 'ஆண்டுகள் (311.04 டிரில்லியன்)', te: 'సంవత్సరాలు (311.04 ట్రిలియన్)', bn: 'বছর (311.04 ট্রিলিয়ন)', kn: 'ವರ್ಷಗಳು (311.04 ಟ್ರಿಲಿಯನ್)', gu: 'વર્ષ (311.04 ટ્રિલિયન)' },
              formula: { en: '100 Brahma Years × 3.11 trillion', hi: '100 ब्रह्मवर्ष × 3.11 खरब', sa: '100 ब्रह्मवर्ष × 3.11 खरब', mai: '100 ब्रह्मवर्ष × 3.11 खरब', mr: '100 ब्रह्मवर्ष × 3.11 खरब', ta: '100 பிரம்ம வருடங்கள் × 3.11 டிரில்லியன்', te: '100 బ్రహ్మ సంవత్సరాలు × 3.11 ట్రిలియన్', bn: '100 ব্রহ্মা বছর × 3.11 ট্রিলিয়ন', kn: '100 ಬ್ರಹ್ಮ ವರ್ಷಗಳು × 3.11 ಟ್ರಿಲಿಯನ್', gu: '100 બ્રહ્મ વર્ષ × 3.11 ટ્રિલિયન' },
              desc: {
                en: 'Brahma lives for 100 of his years. At the end of Brahma\'s life, Mahapralaya (the great dissolution) occurs — everything, including Brahma himself and all the Lokas, dissolves into the primordial Prakriti. Then, after an equal period of cosmic void, a new Brahma is born from Vishnu\'s navel, and the entire cycle begins again. According to the Puranas, the current Brahma is in his 51st year — meaning approximately half of total existence has elapsed.',
                hi: 'ब्रह्मा 100 ब्रह्म-वर्ष जीते हैं। ब्रह्मा के जीवन के अंत में महाप्रलय होता है — ब्रह्मा स्वयं और सभी लोक सहित सब कुछ मूल प्रकृति में विलीन हो जाता है। फिर, समान अवधि के ब्रह्मांडीय शून्य के बाद, विष्णु की नाभि से नए ब्रह्मा का जन्म होता है, और सम्पूर्ण चक्र पुनः आरंभ होता है। पुराणों के अनुसार, वर्तमान ब्रह्मा अपने 51वें वर्ष में हैं — अर्थात कुल अस्तित्व का लगभग आधा बीत चुका है।',
              },
              color: 'border-rose-500/30',
              dotColor: 'bg-rose-400',
              highlight: true,
            },
          ].map((tier, i) => (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, ease: 'easeOut' as const }}
            >
              <div className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6 border-l-4 ${tier.color} ${tier.highlight ? 'bg-gold-primary/3' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Level badge + vertical dot */}
                  <div className="flex items-center sm:flex-col sm:items-center gap-3 sm:gap-1 flex-shrink-0 sm:w-16">
                    <div className={`w-3 h-3 rounded-full ${tier.dotColor}`} />
                    <span className="text-text-secondary/65 text-xs font-mono uppercase">{!isDevanagariLocale(locale) ? `Level ${tier.level}` : `स्तर ${tier.level}`}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <h4 className="text-gold-light font-bold text-lg" style={headingFont}>{t2(tier.name)}</h4>
                      <span className="text-gold-dark/50 text-sm" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{tier.sanskrit}</span>
                    </div>

                    {/* Value */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-gold-light text-2xl sm:text-3xl font-black font-mono">{tier.value}</span>
                      <span className="text-text-secondary text-sm">{t2(tier.unit)}</span>
                    </div>

                    {/* Formula */}
                    <div className="mb-3 p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
                      <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{!isDevanagariLocale(locale) ? 'Formula' : 'सूत्र'}: </span>
                      <span className="text-gold-light/70 font-mono text-xs">{t2(tier.formula)}</span>
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed">{t2(tier.desc)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ SECTION 4: AYANAMSHA ═══ */}
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
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{tl(L.ayanamsha, locale)}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{tl(L.ayanamshaDesc, locale)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {!isDevanagariLocale(locale) ? 'What is Precession?' : 'अग्रगमन क्या है?'}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {locale === 'en'
                ? 'Earth\'s rotational axis slowly wobbles like a spinning top, completing one full circle in ~25,772 years. This causes the vernal equinox to slowly "drift" through the constellations at ~50.3 arcseconds per year.'
                : 'पृथ्वी की घूर्णन धुरी एक कताई की तरह धीरे-धीरे डोलती है, ~25,772 वर्षों में एक पूर्ण चक्र पूरा करती है। इससे विषुव बिंदु प्रति वर्ष ~50.3 चाप-सेकंड की गति से नक्षत्रों में "विचलित" होता है।'}
            </p>
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{!isDevanagariLocale(locale) ? 'Rate' : 'दर'}</div>
                  <div className="text-gold-light font-bold text-lg font-mono">50.3″/yr</div>
                </div>
                <div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{!isDevanagariLocale(locale) ? 'Full Cycle' : 'पूर्ण चक्र'}</div>
                  <div className="text-gold-light font-bold text-lg font-mono">~25,772 yrs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {!isDevanagariLocale(locale) ? 'Ayanamsha Systems' : 'अयनांश प्रणालियाँ'}
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Lahiri (Chitrapaksha)', value: '~24.12°', official: true, desc: !isDevanagariLocale(locale) ? 'Official Govt of India. Most widely used in India.' : 'भारत सरकार की आधिकारिक। भारत में सर्वाधिक प्रयुक्त।' },
                { name: 'Raman', value: '~23.04°', official: false, desc: !isDevanagariLocale(locale) ? 'Used by B.V. Raman school.' : 'बी.वी. रमण परंपरा में प्रयुक्त।' },
                { name: 'Krishnamurti (KP)', value: '~23.86°', official: false, desc: !isDevanagariLocale(locale) ? 'Used in KP System (Placidus houses).' : 'KP प्रणाली में प्रयुक्त।' },
                { name: 'Fagan-Bradley', value: '~24.74°', official: false, desc: !isDevanagariLocale(locale) ? 'Western sidereal astrology.' : 'पश्चिमी सायन ज्योतिष।' },
              ].map((a) => (
                <div key={a.name} className={`rounded-lg p-3 border ${a.official ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary font-semibold text-sm">{a.name}</span>
                      {a.official && <span className="px-1.5 py-0.5 text-xs bg-gold-primary/20 text-gold-primary rounded font-bold uppercase">{!isDevanagariLocale(locale) ? 'Official' : 'आधिकारिक'}</span>}
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
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-gold-primary/30 bg-gradient-to-r from-gold-primary/5 to-transparent text-center">
          <div className="text-gold-dark text-xs uppercase tracking-[0.3em] font-bold mb-2">
            {!isDevanagariLocale(locale) ? 'Current Lahiri Ayanamsha (2026 CE)' : 'वर्तमान लाहिरी अयनांश (2026 CE)'}
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
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{tl(L.panchangaSystem, locale)}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{tl(L.panchangaDesc, locale)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PANCHANGA_LIMBS.map((limb, i) => (
            <motion.div
              key={limb.name.en}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-4 md:p-6 border ${limb.border} ${limb.bg}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0"><limb.icon size={48} /></div>
                <div>
                  <div className={`text-xs uppercase tracking-[0.2em] font-bold mb-0.5 ${limb.color}`}>
                    {!isDevanagariLocale(locale) ? `Anga ${limb.number}` : `अंग ${limb.number}`}
                  </div>
                  <div className="text-gold-light font-bold text-xl" style={headingFont}>{tl(limb.name, locale)}</div>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{tl(limb.desc, locale)}</p>
              <div className="rounded-lg p-3 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/12">
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">
                  {!isDevanagariLocale(locale) ? 'Formula' : 'सूत्र'}
                </div>
                <div className="text-text-primary text-xs font-mono">{tl(limb.formula, locale)}</div>
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
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{tl(L.muhurtaTitle, locale)}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{tl(L.muhurtaDesc, locale)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {!isDevanagariLocale(locale) ? '30 Muhurtas in a Day' : 'दिन में 30 मुहूर्त'}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {locale === 'en'
                ? 'A solar day (sunrise to next sunrise) is divided into 30 equal Muhurtas — 15 day muhurtas (sunrise to sunset) and 15 night muhurtas (sunset to next sunrise). Each spans ~48 minutes.'
                : 'एक सौर दिन (एक सूर्योदय से अगले सूर्योदय तक) को 30 समान मुहूर्तों में विभाजित किया जाता है — 15 दिन के मुहूर्त और 15 रात के मुहूर्त। प्रत्येक ~48 मिनट का होता है।'}
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: !isDevanagariLocale(locale) ? 'Total Muhurtas' : 'कुल मुहूर्त', value: '30' },
                { label: !isDevanagariLocale(locale) ? 'Day Muhurtas' : 'दिवा मुहूर्त', value: '15' },
                { label: !isDevanagariLocale(locale) ? 'Duration each' : 'प्रत्येक की अवधि', value: '~48m' },
              ].map(item => (
                <div key={item.label} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
                  <div className="text-gold-light font-bold text-2xl font-mono">{item.value}</div>
                  <div className="text-text-secondary text-xs mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {!isDevanagariLocale(locale) ? 'Key Auspicious Muhurtas' : 'प्रमुख शुभ मुहूर्त'}
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: !isDevanagariLocale(locale) ? 'Brahma Muhurta' : 'ब्राह्म मुहूर्त',
                  time: !isDevanagariLocale(locale) ? '~1h 36m before sunrise' : 'सूर्योदय से ~1:36 पहले',
                  color: 'text-indigo-400',
                  desc: !isDevanagariLocale(locale) ? 'Best for spiritual practice, study, meditation' : 'अध्यात्म, अध्ययन, ध्यान के लिए श्रेष्ठ',
                },
                {
                  name: !isDevanagariLocale(locale) ? 'Abhijit Muhurta' : 'अभिजित् मुहूर्त',
                  time: !isDevanagariLocale(locale) ? '~12 min either side of local noon' : 'स्थानीय दोपहर के ~12 मिनट पूर्व/बाद',
                  color: 'text-gold-primary',
                  desc: !isDevanagariLocale(locale) ? 'Most auspicious of the day — all activities' : 'दिन का सर्वश्रेष्ठ — सभी कार्यों के लिए',
                },
                {
                  name: !isDevanagariLocale(locale) ? 'Vijaya Muhurta' : 'विजय मुहूर्त',
                  time: !isDevanagariLocale(locale) ? '10th day muhurta' : '10वाँ दिवा मुहूर्त',
                  color: 'text-amber-400',
                  desc: !isDevanagariLocale(locale) ? 'Victory in competitions, military, legal' : 'प्रतियोगिता, सैन्य, कानूनी मामलों में विजय',
                },
                {
                  name: !isDevanagariLocale(locale) ? 'Amrit Kalam' : 'अमृत काल',
                  time: !isDevanagariLocale(locale) ? 'Moon\'s most auspicious window' : 'चंद्र का सर्वोत्तम काल',
                  color: 'text-emerald-400',
                  desc: !isDevanagariLocale(locale) ? 'Lunar nectar period — excellent for all' : 'चंद्र अमृत काल — सभी कार्यों के लिए उत्तम',
                },
              ].map(m => (
                <div key={m.name} className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${m.color.replace('text-', 'bg-')}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${m.color}`}>{m.name}</span>
                      <span className="text-text-secondary/75 text-xs font-mono">{m.time}</span>
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
            {!isDevanagariLocale(locale) ? 'See Today\'s Muhurtas' : 'आज के मुहूर्त देखें'}
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
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{tl(L.todayData, locale)}</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">{tl(L.todayDataDesc, locale)}</p>
        </div>

        {loadingKaal ? (
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-gold-primary mx-auto mb-3" />
            <div className="text-text-secondary text-sm">{!isDevanagariLocale(locale) ? 'Calculating astronomical data...' : 'खगोलशास्त्रीय डेटा की गणना हो रही है...'}</div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
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
              ] as { label: LocaleText; value: string; desc: LocaleText; color: string }[]).map((item, i) => (
                <motion.div key={item.label.en} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}
                  className="p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">{item.label[locale]}</div>
                  <div className={`font-bold text-2xl font-mono ${item.color}`} style={headingFont}>{item.value}</div>
                  <div className="text-text-secondary text-xs mt-2">{item.desc[locale]}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/panchang"
            className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors text-sm font-medium">
            {!isDevanagariLocale(locale) ? 'View Full Panchang' : 'पूर्ण पंचांग देखें'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.section>

      {/* ═══ SECTION 8: HINDU TIME UNITS (Kaal Maan) ═══ */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><Clock className="w-14 h-14 text-gold-primary" /></div>
          <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>{tl(L.kaalMaan, locale)}</h2>
          <p className="text-text-secondary text-sm max-w-2xl mx-auto">{tl(L.kaalMaanDesc, locale)}</p>
        </div>

        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20 bg-gold-primary/5">
                  <th className="text-left px-5 py-4 text-gold-primary text-xs uppercase tracking-wider font-bold">
                    {!isDevanagariLocale(locale) ? 'Unit' : 'इकाई'}
                  </th>
                  <th className="text-left px-5 py-4 text-gold-primary text-xs uppercase tracking-wider font-bold">
                    {!isDevanagariLocale(locale) ? 'Sanskrit' : 'संस्कृत'}
                  </th>
                  <th className="text-left px-5 py-4 text-gold-primary text-xs uppercase tracking-wider font-bold">
                    {!isDevanagariLocale(locale) ? 'Composition' : 'संरचना'}
                  </th>
                  <th className="text-left px-5 py-4 text-gold-primary text-xs uppercase tracking-wider font-bold">
                    {!isDevanagariLocale(locale) ? 'Modern Equivalent' : 'आधुनिक समतुल्य'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIME_UNITS.map((row) => (
                  <tr key={row.unit} className={`border-b border-gold-primary/5 hover:bg-bg-tertiary/30 transition-colors ${row.highlight ? 'bg-gold-primary/3' : ''}`}>
                    <td className="px-5 py-3">
                      <span className={`font-bold text-sm ${row.highlight ? 'text-gold-light' : 'text-text-primary'}`}>
                        {row.unit}
                      </span>
                      {row.highlight && <span className="ml-2 px-1.5 py-0.5 text-xs bg-gold-primary/20 text-gold-primary rounded font-bold uppercase">Key</span>}
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

    </div>
  );
}
