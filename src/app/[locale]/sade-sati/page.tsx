'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale, LocaleText } from '@/types/panchang';
import type { BirthData } from '@/types/kundali';
import { tl } from '@/lib/utils/trilingual';
import { RASHIS } from '@/lib/constants/rashis';
import {
  analyzeSadeSati,
  getCurrentSaturnSign,
  type SadeSatiAnalysis,
  type SadeSatiInput,
  type NakshatraTransitEntry,
} from '@/lib/kundali/sade-sati-analysis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import LocationSearch from '@/components/ui/LocationSearch';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import InfoBlock from '@/components/ui/InfoBlock';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { User } from 'lucide-react';

// ---------------------------------------------------------------------------
// Trilingual labels
// ---------------------------------------------------------------------------

const L = (en: string, hi: string, sa?: string, ta?: string, te?: string, bn?: string, kn?: string, mr?: string, gu?: string, mai?: string) => ({ en, hi, sa: sa ?? hi, ...(ta ? { ta } : {}), ...(te ? { te } : {}), ...(bn ? { bn } : {}), ...(kn ? { kn } : {}), ...(mr ? { mr } : {}), ...(gu ? { gu } : {}), ...(mai ? { mai } : {}) });

const LABELS = {
  title: L('Sade Sati', 'साढ़े साती', 'साढेसाती', 'ஏழரை சனி', 'సాడే సాతి', 'সাড়ে সাতি', 'ಸಾಡೆ ಸಾತಿ'),
  subtitle: L(
    "Saturn's 7.5-year transit over your Moon sign — the most transformative period in Vedic astrology",
    'शनि का आपकी चन्द्र राशि पर 7.5 वर्ष का गोचर — वैदिक ज्योतिष का सर्वाधिक परिवर्तनकारी काल',
    'शनेः चन्द्रराशौ सार्धसप्तवर्षीयं गोचरम् — वैदिकज्योतिषस्य परमपरिवर्तनकालः',
    'உங்கள் சந்திர ராசியின் மீது சனியின் 7.5 வருட கோசாரம் — வேத ஜோதிடத்தின் மிக முக்கிய காலம்',
    'మీ చంద్ర రాశిపై శని 7.5 సంవత్సరాల గోచారం — వేద జ్యోతిషంలో అత్యంత పరివర్తనాత్మక కాలం',
    'আপনার চন্দ্র রাশির উপর শনির ৭.৫ বছরের গোচর — বৈদিক জ্যোতিষের সবচেয়ে রূপান্তরকারী কাল',
    'ನಿಮ್ಮ ಚಂದ್ರ ರಾಶಿಯ ಮೇಲೆ ಶನಿಯ 7.5 ವರ್ಷಗಳ ಗೋಚಾರ — ವೈದಿಕ ಜ್ಯೋತಿಷದಲ್ಲಿ ಅತ್ಯಂತ ಪರಿವರ್ತನಾತ್ಮಕ ಅವಧಿ',
  ),
  saturnIn: L('Saturn is currently in', 'शनि वर्तमान में', 'शनिः सम्प्रति', 'சனி தற்போது', 'శని ప్రస్తుతం', 'শনি বর্তমানে', 'ಶನಿ ಪ್ರಸ್ತುತ'),
  quickTab: L('Quick Check', 'त्वरित जाँच', 'शीघ्रपरीक्षा', 'விரைவு சோதனை', 'త్వరిత తనిఖీ', 'দ্রুত পরীক্ষা', 'ತ್ವರಿತ ಪರಿಶೀಲನೆ'),
  fullTab: L('Full Analysis', 'विस्तृत विश्लेषण', 'सम्पूर्णविश्लेषणम्', 'முழு பகுப்பாய்வு', 'పూర్తి విశ్లేషణ', 'সম্পূর্ণ বিশ্লেষণ', 'ಪೂರ್ಣ ವಿಶ್ಲೇಷಣೆ'),
  selectMoon: L('Select Your Moon Sign', 'अपनी चन्द्र राशि चुनें', 'स्वचन्द्रराशिं चिनुत', 'உங்கள் சந்திர ராசியைத் தேர்ந்தெடுக்கவும்', 'మీ చంద్ర రాశిని ఎంచుకోండి', 'আপনার চন্দ্র রাশি নির্বাচন করুন', 'ನಿಮ್ಮ ಚಂದ್ರ ರಾಶಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ'),
  date: L('Date of Birth', 'जन्म तिथि', 'जन्मतिथिः', 'பிறந்த தேதி', 'పుట్టిన తేదీ', 'জন্ম তারিখ', 'ಹುಟ್ಟಿದ ದಿನಾಂಕ'),
  time: L('Time of Birth', 'जन्म समय', 'जन्मसमयः', 'பிறந்த நேரம்', 'పుట్టిన సమయం', 'জন্ম সময়', 'ಹುಟ್ಟಿದ ಸಮಯ'),
  place: L('Birth Place', 'जन्म स्थान', 'जन्मस्थानम्', 'பிறந்த இடம்', 'పుట్టిన ప్రదేశం', 'জন্মস্থান', 'ಹುಟ್ಟಿದ ಸ್ಥಳ'),
  lat: L('Latitude', 'अक्षांश', 'अक्षांशः'),
  lng: L('Longitude', 'देशान्तर', 'देशान्तरः'),
  tz: L('Timezone (hrs)', 'समयक्षेत्र (घंटे)', 'समयक्षेत्रम्'),
  analyze: L('Analyze', 'विश्लेषण करें', 'विश्लेषयतु', 'பகுப்பாய்வு', 'విశ్లేషించు', 'বিশ্লেষণ করুন', 'ವಿಶ್ಲೇಷಿಸಿ'),
  loading: L('Generating kundali...', 'कुण्डली बना रहे हैं...', 'कुण्डलीं रचयति...', 'ஜாதகம் உருவாக்கப்படுகிறது...', 'జాతకం రూపొందించబడుతోంది...', 'জাতক তৈরি হচ্ছে...', 'ಜಾತಕ ರಚಿಸಲಾಗುತ್ತಿದೆ...'),
  active: L('SADE SATI ACTIVE', 'साढ़े साती सक्रिय', 'साढेसाती सक्रिया', 'ஏழரை சனி செயலில்', 'సాడే సాతి యాక్టివ్', 'সাড়ে সাতি সক্রিয়', 'ಸಾಡೆ ಸಾತಿ ಸಕ್ರಿಯ'),
  notActive: L('NOT IN SADE SATI', 'साढ़े साती नहीं', 'साढेसाती नास्ति', 'ஏழரை சனி இல்லை', 'సాడే సాతి లేదు', 'সাড়ে সাতি নেই', 'ಸಾಡೆ ಸಾತಿ ಇಲ್ಲ'),
  nextCycle: L('Next cycle begins around', 'अगला चक्र लगभग', 'अग्रिमचक्रं प्रायः', 'அடுத்த சுழற்சி தொடங்கும் காலம்', 'తదుపరి చక్రం సుమారుగా', 'পরবর্তী চক্র শুরু হবে প্রায়', 'ಮುಂದಿನ ಚಕ್ರ ಸುಮಾರು'),
  intensity: L('Intensity', 'तीव्रता', 'तीव्रता', 'தீவிரம்', 'తీవ్రత', 'তীব্রতা', 'ತೀವ್ರತೆ'),
  timeline: L('Timeline', 'समयरेखा', 'समयरेखा', 'காலவரிசை', 'కాలరేఖ', 'সময়রেখা', 'ಕಾಲಾನುಕ್ರಮ'),
  remedies: L('Remedies', 'उपाय', 'उपायाः', 'பரிகாரங்கள்', 'పరిహారాలు', 'প্রতিকার', 'ಪರಿಹಾರಗಳು'),
  phase: {
    rising: L('Rising Phase (12th from Moon)', 'आरम्भ चरण (चन्द्र से 12वाँ)', 'उत्थानचरणः', 'உதய கட்டம் (சந்திரனிலிருந்து 12வது)'),
    peak: L('Peak Phase (Over Moon Sign)', 'चरम चरण (चन्द्र राशि पर)', 'चरमचरणः', 'உச்ச கட்டம் (சந்திர ராசி மீது)'),
    setting: L('Setting Phase (2nd from Moon)', 'अवसान चरण (चन्द्र से 2रा)', 'अवसानचरणः', 'இறங்கு கட்டம் (சந்திரனிலிருந்து 2வது)'),
  },
  sections: {
    summary: L('Summary', 'सारांश', 'सारांशः'),
    phaseEffect: L('Phase Effect', 'चरण प्रभाव', 'चरणप्रभावः'),
    saturnNature: L("Saturn's Nature for Your Ascendant", 'आपके लग्न के लिए शनि का स्वभाव', 'लग्नार्थं शनिस्वभावः'),
    moonStrength: L('Moon Strength Analysis', 'चन्द्र बल विश्लेषण', 'चन्द्रबलविश्लेषणम्'),
    dashaInterplay: L('Dasha Interplay', 'दशा अन्तर्क्रिया', 'दशान्तर्क्रिया'),
    ashtakavargaInsight: L('Ashtakavarga Insight', 'अष्टकवर्ग विश्लेषण', 'अष्टकवर्गविश्लेषणम्'),
    nakshatraTransit: L('Nakshatra Transit Detail', 'नक्षत्र गोचर विवरण', 'नक्षत्रगोचरविवरणम्'),
    houseEffect: L('House Effects', 'भाव प्रभाव', 'भावप्रभावः'),
  },
  essential: L('Essential', 'अनिवार्य', 'अनिवार्यम्'),
  recommended: L('Recommended', 'अनुशंसित', 'अनुशंसितम्'),
  optional: L('Optional', 'वैकल्पिक', 'वैकल्पिकम्'),
  years: L('years', 'वर्ष', 'वर्षाणि'),
  current: L('CURRENT', 'वर्तमान', 'वर्तमानम्'),
  mild: L('Mild', 'सौम्य', 'सौम्यम्'),
  moderate: L('Moderate', 'मध्यम', 'मध्यमम्'),
  challenging: L('Challenging', 'चुनौतीपूर्ण', 'दुष्करम्'),
  intense: L('Intense', 'तीव्र', 'तीव्रम्'),
};

const t = (label: LocaleText, locale: Locale): string => tl(label, locale);

// ---------------------------------------------------------------------------
// Generic remedies for quick mode
// ---------------------------------------------------------------------------

const GENERIC_REMEDIES: { title: LocaleText; description: LocaleText; priority: 'essential' | 'recommended' | 'optional' }[] = [
  { title: L('Hanuman Chalisa', 'हनुमान चालीसा'), description: L('Recite Hanuman Chalisa daily, especially on Saturdays', 'प्रतिदिन हनुमान चालीसा पढ़ें, विशेषकर शनिवार को'), priority: 'essential' },
  { title: L('Saturday Donations', 'शनिवार दान'), description: L('Donate black items — sesame, iron, mustard oil — on Saturdays', 'शनिवार को काली वस्तुएं — तिल, लोहा, सरसों का तेल — दान करें'), priority: 'essential' },
  { title: L('Peepal Tree Lamp', 'पीपल दीपक'), description: L('Light mustard oil lamp under a Peepal tree every Saturday evening', 'प्रत्येक शनिवार संध्या को पीपल वृक्ष के नीचे सरसों के तेल का दीपक जलाएं'), priority: 'recommended' },
  { title: L('Shani Mantra', 'शनि मंत्र'), description: L('Chant "Om Sham Shanaishcharaya Namah" 108 times daily', '"ॐ शं शनैश्चराय नमः" 108 बार प्रतिदिन जाप करें'), priority: 'recommended' },
];

// ---------------------------------------------------------------------------
// Intensity helpers
// ---------------------------------------------------------------------------

function intensityColor(score: number): string {
  if (score <= 3) return 'text-emerald-400';
  if (score <= 5) return 'text-gold-light';
  if (score <= 7) return 'text-orange-400';
  return 'text-red-400';
}

function intensityBg(score: number): string {
  if (score <= 3) return 'bg-emerald-400';
  if (score <= 5) return 'bg-gold-primary';
  if (score <= 7) return 'bg-orange-400';
  return 'bg-red-400';
}

function intensityLabel(score: number, locale: Locale): string {
  if (score <= 3) return t(LABELS.mild, locale);
  if (score <= 5) return t(LABELS.moderate, locale);
  if (score <= 7) return t(LABELS.challenging, locale);
  return t(LABELS.intense, locale);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SadeSatiPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const lk = (isDevanagariLocale(locale)) ? 'hi' as const : 'en' as const;

  const [tab, setTab] = useState<'quick' | 'full'>('quick');
  const [moonRashi, setMoonRashi] = useState(0);
  const [analysis, setAnalysis] = useState<SadeSatiAnalysis | null>(null);
  const [isFullMode, setIsFullMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>('summary');

  // Full mode form state
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthLat, setBirthLat] = useState<number | null>(null);
  const [birthLng, setBirthLng] = useState<number | null>(null);
  const [birthTimezone, setBirthTimezone] = useState<string | null>(null);

  // ── Saved charts integration ──────────────────────────────────
  const authUser = useAuthStore(s => s.user);
  interface SavedChart { id: string; label: string; birth_data: BirthData }
  interface ChartWithSadeSati extends SavedChart { analysis: SadeSatiAnalysis | null; moonSign: number; loading: boolean }
  const [savedCharts, setSavedCharts] = useState<ChartWithSadeSati[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const [chartsLoading, setChartsLoading] = useState(false);

  /** Compute full sade sati for a birth_data — same logic as handleFullAnalysis */
  const computeSadeSatiForBirthData = useCallback(async (bd: BirthData): Promise<{ analysis: SadeSatiAnalysis; moonSign: number } | null> => {
    try {
      const [y, m, d] = bd.date.split('-').map(Number);
      const tz = bd.timezone || '5.5';
      const tzOffset = typeof tz === 'string' && tz.includes('/') ? getUTCOffsetForDate(y, m, d, tz) : parseFloat(tz);
      const res = await authedFetch('/api/kundali', {
        method: 'POST',
        body: JSON.stringify({ ...bd, timezone: String(tzOffset), ayanamsha: bd.ayanamsha || 'lahiri' }),
      });
      if (!res.ok) return null;
      const kundali = await res.json();
      const moon = kundali.planets?.[1];
      const saturn = kundali.planets?.[6];
      const ascSign = kundali.ascendant?.sign;
      const bavRow = kundali.ashtakavarga?.bpiTable?.[6];
      const now = new Date().toISOString();
      const currentMaha = kundali.dashas?.find((dd: { startDate: string; endDate: string }) => dd.startDate <= now && dd.endDate >= now);
      const currentAntar = currentMaha?.subPeriods?.find((dd: { startDate: string; endDate: string }) => dd.startDate <= now && dd.endDate >= now);
      const input: SadeSatiInput = {
        moonSign: moon?.sign ?? 1,
        moonNakshatra: moon?.nakshatra?.id,
        moonDegree: moon?.longitude != null ? (moon.longitude % 30) : undefined,
        ascendantSign: ascSign,
        saturnSign: saturn?.sign,
        saturnHouse: saturn?.house,
        saturnRetrograde: saturn?.isRetrograde,
        ashtakavargaSaturnBindus: bavRow,
        currentDasha: currentMaha ? { planet: currentMaha.planet, startDate: currentMaha.startDate, endDate: currentMaha.endDate } : undefined,
        currentAntar: currentAntar ? { planet: currentAntar.planet, startDate: currentAntar.startDate, endDate: currentAntar.endDate } : undefined,
      };
      return { analysis: analyzeSadeSati(input), moonSign: moon?.sign ?? 1 };
    } catch {
      return null;
    }
  }, []);

  // Fetch saved charts and compute sade sati for each
  useEffect(() => {
    if (!authUser) { setSavedCharts([]); return; }
    const supabase = getSupabase();
    if (!supabase) return;
    setChartsLoading(true);
    supabase
      .from('saved_charts')
      .select('id, label, birth_data')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })
      .then(async ({ data: charts, error }) => {
        if (error || !charts?.length) { setChartsLoading(false); return; }
        // Initialize with loading state
        const initial: ChartWithSadeSati[] = charts.map(c => ({
          ...c as SavedChart, analysis: null, moonSign: 0, loading: true,
        }));
        setSavedCharts(initial);
        setChartsLoading(false);

        // Compute sade sati for each in parallel
        const results = await Promise.all(
          charts.map(c => computeSadeSatiForBirthData((c as SavedChart).birth_data))
        );
        setSavedCharts(prev => prev.map((c, i) => ({
          ...c,
          analysis: results[i]?.analysis ?? null,
          moonSign: results[i]?.moonSign ?? 0,
          loading: false,
        })));
      });
  }, [authUser, computeSadeSatiForBirthData]);

  // When a saved chart is selected, set the analysis
  const handleChartSelect = (chart: ChartWithSadeSati) => {
    if (!chart.analysis) return;
    setSelectedChartId(chart.id);
    setMoonRashi(chart.moonSign);
    setAnalysis(chart.analysis);
    setIsFullMode(true);
  };

  const saturnNow = useMemo(() => getCurrentSaturnSign(), []);
  const saturnSignName = RASHIS.find(r => r.id === saturnNow.sign)?.name;

  // Quick mode analysis
  const handleQuickSelect = (rashiId: number) => {
    setMoonRashi(rashiId);
    const result = analyzeSadeSati({ moonSign: rashiId });
    setAnalysis(result);
    setIsFullMode(false);
  };

  // Full mode analysis
  const handleFullAnalysis = async () => {
    if (!birthDate || !birthTime || !birthLat || !birthLng) return;
    setLoading(true);
    try {
      const [y, m, d] = birthDate.split('-').map(Number);
      if (!birthTimezone) { setLoading(false); return; }
      const tzOffset = getUTCOffsetForDate(y, m, d, birthTimezone);
      const res = await authedFetch('/api/kundali', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          date: birthDate,
          time: birthTime,
          place: birthPlace,
          lat: birthLat,
          lng: birthLng,
          timezone: String(tzOffset),
          ayanamsha: 'lahiri',
        }),
      });
      if (!res.ok) throw new Error('API error');
      const kundali = await res.json();

      const moon = kundali.planets?.[1];
      const saturn = kundali.planets?.[6];
      const ascSign = kundali.ascendant?.sign;
      const bavRow = kundali.ashtakavarga?.bpiTable?.[6];

      // Find current maha dasha
      const now = new Date().toISOString();
      const currentMaha = kundali.dashas?.find((d: { startDate: string; endDate: string }) => d.startDate <= now && d.endDate >= now);
      const currentAntar = currentMaha?.subPeriods?.find((d: { startDate: string; endDate: string }) => d.startDate <= now && d.endDate >= now);

      const input: SadeSatiInput = {
        moonSign: moon?.sign ?? 1,
        moonNakshatra: moon?.nakshatra?.id,
        moonDegree: moon?.longitude != null ? (moon.longitude % 30) : undefined,
        ascendantSign: ascSign,
        saturnSign: saturn?.sign,
        saturnHouse: saturn?.house,
        saturnRetrograde: saturn?.isRetrograde,
        ashtakavargaSaturnBindus: bavRow,
        currentDasha: currentMaha ? { planet: currentMaha.planet, startDate: currentMaha.startDate, endDate: currentMaha.endDate } : undefined,
        currentAntar: currentAntar ? { planet: currentAntar.planet, startDate: currentAntar.startDate, endDate: currentAntar.endDate } : undefined,
      };

      setMoonRashi(moon?.sign ?? 1);
      const result = analyzeSadeSati(input);
      setAnalysis(result);
      setIsFullMode(true);
    } catch {
      // Silently handle — could add error state
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const interpretationKeys = ['summary', 'phaseEffect', 'saturnNature', 'moonStrength', 'dashaInterplay', 'ashtakavargaInsight', 'nakshatraTransit', 'houseEffect'] as const;

  const priorityBadge = (p: 'essential' | 'recommended' | 'optional') => {
    const cls = p === 'essential' ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : p === 'recommended' ? 'bg-gold-primary/20 text-gold-light border-gold-primary/30'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    const label = p === 'essential' ? LABELS.essential : p === 'recommended' ? LABELS.recommended : LABELS.optional;
    return <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${cls}`} style={bodyFont}>{t(label, locale)}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div {...fadeUp} className="text-center mb-12">
        <div className="flex justify-center mb-6"><GrahaIconById id={6} size={80} /></div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t(LABELS.title, locale)}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>{t(LABELS.subtitle, locale)}</p>
        {saturnSignName && (
          <p className="text-gold-dark text-sm mt-4 font-semibold" style={bodyFont}>
            {t(LABELS.saturnIn, locale)}{' '}
            <span className="text-gold-light">{saturnSignName[lk as keyof typeof saturnSignName]} ({saturnNow.degree.toFixed(1)}°)</span>
          </p>
        )}
      </motion.div>

      <InfoBlock id="sade-sati-intro" title={isTamil ? 'ஏழரை சனி என்றால் என்ன? ஏன் 7.5 வருடங்கள்?' : locale === 'en' ? 'What is Sade Sati and why 7.5 years?' : 'साढ़े साती क्या है और 7.5 वर्ष क्यों?'} defaultOpen>
        {!isDevanagariLocale(locale) ? (
          <div className="space-y-3">
            <p><strong>Sade Sati</strong> (literally &quot;seven and a half&quot;) is the ~7.5-year period when Saturn transits through three consecutive signs — the sign before your Moon sign, your Moon sign itself, and the sign after. Since Saturn takes ~2.5 years per sign, the total is ~7.5 years.</p>
            <p><strong>Why the Moon?</strong> In Vedic astrology, your Moon sign (not Sun sign) represents your mind, emotions, and inner world. When Saturn — the planet of discipline, karma, and hard lessons — passes over your Moon, it puts pressure on your emotional foundation. This isn&apos;t punishment — it&apos;s a period of deep maturation.</p>
            <p><strong>The three phases:</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong>Rising (12th from Moon)</strong> — Financial pressures, sleep disturbance, hidden anxieties. Saturn approaches your Moon like gathering clouds.</li>
              <li><strong>Peak (over Moon sign)</strong> — The most intense phase. Mental pressure, relationship tests, career challenges. But also the deepest growth and self-discovery.</li>
              <li><strong>Setting (2nd from Moon)</strong> — Financial strain eases but family/speech-related issues may surface. Saturn recedes, leaving wisdom behind.</li>
            </ul>
            <p><strong>Important:</strong> Sade Sati is NOT always bad. Its effects depend on Saturn&apos;s natal position, the Moon&apos;s strength, and your current dasha. For some, it brings career breakthroughs, spiritual awakening, or overdue life corrections. Many successful people achieved their greatest milestones during Sade Sati.</p>
            <p><strong>It occurs 2-3 times</strong> in an average lifetime (every ~30 years when Saturn completes its orbit). The first Sade Sati (childhood) is felt by parents. The second (age 28-37 roughly) is the most impactful. The third (late 50s-60s) brings spiritual depth.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>साढ़े साती</strong> (शाब्दिक अर्थ &quot;साढ़े सात&quot;) वह ~7.5 वर्ष की अवधि है जब शनि तीन क्रमिक राशियों से गुजरता है — आपकी चन्द्र राशि से पहली, स्वयं चन्द्र राशि, और उसके बाद की। शनि ~2.5 वर्ष प्रति राशि लेता है, कुल ~7.5 वर्ष।</p>
            <p><strong>चन्द्रमा क्यों?</strong> वैदिक ज्योतिष में चन्द्र राशि (सूर्य राशि नहीं) आपके मन, भावनाओं और आन्तरिक संसार का प्रतिनिधित्व करती है। जब शनि — अनुशासन, कर्म और कठिन पाठ का ग्रह — चन्द्रमा पर से गुजरता है, वह भावनात्मक नींव पर दबाव डालता है। यह दण्ड नहीं — गहन परिपक्वता का काल है।</p>
            <p><strong>तीन चरण:</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong>आरम्भ (चन्द्र से 12वाँ)</strong> — आर्थिक दबाव, नींद में बाधा, छिपी चिन्ताएँ।</li>
              <li><strong>चरम (चन्द्र राशि पर)</strong> — सबसे तीव्र। मानसिक दबाव, सम्बन्ध परीक्षा, कैरियर चुनौतियाँ। किन्तु सबसे गहन विकास भी।</li>
              <li><strong>अवसान (चन्द्र से 2रा)</strong> — आर्थिक दबाव कम, पारिवारिक/वाणी विषय। शनि ज्ञान छोड़कर जाता है।</li>
            </ul>
            <p><strong>महत्वपूर्ण:</strong> साढ़े साती सदैव बुरी नहीं होती। प्रभाव शनि की जन्म स्थिति, चन्द्रमा की शक्ति और वर्तमान दशा पर निर्भर करते हैं। कई सफल लोगों ने साढ़े साती में सबसे बड़ी उपलब्धियाँ प्राप्त कीं।</p>
            <p><strong>जीवनकाल में 2-3 बार</strong> आती है (~30 वर्ष में एक बार)। पहली (बचपन) माता-पिता पर प्रभावी। दूसरी (28-37 वर्ष) सर्वाधिक प्रभावशाली। तीसरी (50-60 वर्ष) आध्यात्मिक गहनता।</p>
          </div>
        )}
      </InfoBlock>

      {/* ── Saved Charts — auto sade sati for logged-in users ── */}
      {authUser && savedCharts.length > 0 && (
        <motion.div {...fadeUp} className="mb-10">
          <h2 className="text-lg font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <User size={18} className="text-gold-primary" />
            {locale === 'hi' ? 'आपकी कुण्डलियाँ' : 'Your Charts'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedCharts.map(chart => {
              const isSelected = selectedChartId === chart.id;
              const isActive = chart.analysis?.isActive ?? false;
              const phase = chart.analysis?.currentPhase;
              const moonName = chart.moonSign > 0 ? RASHIS.find(r => r.id === chart.moonSign)?.name : null;
              return (
                <button
                  key={chart.id}
                  onClick={() => handleChartSelect(chart)}
                  disabled={chart.loading}
                  className={`text-left px-4 py-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-gold-primary/50 bg-gold-primary/10'
                      : 'border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-text-primary text-sm font-semibold truncate" style={bodyFont}>{chart.label || chart.birth_data?.name || 'Chart'}</span>
                    {chart.loading ? (
                      <span className="text-text-secondary text-xs animate-pulse">...</span>
                    ) : isActive ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/25 font-bold">
                        {locale === 'hi' ? 'सक्रिय' : 'ACTIVE'}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold">
                        {locale === 'hi' ? 'नहीं' : 'NOT ACTIVE'}
                      </span>
                    )}
                  </div>
                  {moonName && (
                    <div className="flex items-center gap-1.5">
                      <RashiIconById id={chart.moonSign} size={14} className="text-gold-primary/60" />
                      <span className="text-text-secondary text-xs" style={bodyFont}>
                        {locale === 'hi' ? 'चन्द्र' : 'Moon'}: {tl(moonName, locale)}
                      </span>
                      {phase && (
                        <span className="text-text-secondary/50 text-xs ml-auto">
                          {phase === 'rising' ? '↗' : phase === 'peak' ? '●' : '↘'} {t(LABELS.phase[phase], locale)}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {chartsLoading && (
            <p className="text-text-secondary text-sm text-center mt-3 animate-pulse" style={bodyFont}>
              {locale === 'hi' ? 'कुण्डलियाँ लोड हो रही हैं...' : 'Loading your charts...'}
            </p>
          )}
          <GoldDivider />
        </motion.div>
      )}

      {/* Tabs — for new/quick checks */}
      <div className="flex justify-center gap-2 mb-10">
        {(['quick', 'full'] as const).map(tb => (
          <button
            key={tb}
            onClick={() => { setTab(tb); setAnalysis(null); setMoonRashi(0); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              tab === tb
                ? 'bg-gold-primary/20 border-gold-primary/40 text-gold-light'
                : 'bg-bg-tertiary/30 border-gold-primary/10 text-text-secondary hover:border-gold-primary/30'
            }`}
            style={bodyFont}
          >
            {t(tb === 'quick' ? LABELS.quickTab : LABELS.fullTab, locale)}
          </button>
        ))}
      </div>

      {/* Quick Mode — Moon Sign Grid */}
      {tab === 'quick' && (
        <motion.div {...fadeUp} className="max-w-lg mx-auto mb-12">
          <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center" style={bodyFont}>
            {t(LABELS.selectMoon, locale)}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {RASHIS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleQuickSelect(r.id)}
                className={`rounded-xl p-3 text-center border transition-all ${
                  moonRashi === r.id
                    ? 'bg-gold-primary/20 border-gold-primary/40'
                    : 'bg-bg-tertiary/30 border-gold-primary/10 hover:border-gold-primary/30'
                }`}
              >
                <div className="flex justify-center mb-1"><RashiIconById id={r.id} size={28} /></div>
                <div className="text-gold-light text-xs font-bold" style={bodyFont}>{r.name[lk as keyof typeof r.name]}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Full Mode — Birth Details Form */}
      {tab === 'full' && (
        <motion.div {...fadeUp} className="max-w-lg mx-auto mb-12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1" style={bodyFont}>{t(LABELS.date, locale)}</label>
              <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                className="w-full bg-bg-tertiary/40 border border-gold-primary/10 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/40 outline-none transition" />
            </div>
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1" style={bodyFont}>{t(LABELS.time, locale)}</label>
              <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)}
                className="w-full bg-bg-tertiary/40 border border-gold-primary/10 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/40 outline-none transition" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1" style={bodyFont}>{t(LABELS.place, locale)}</label>
            <LocationSearch
              value={birthPlace}
              onSelect={(loc) => {
                setBirthPlace(loc.name);
                setBirthLat(loc.lat);
                setBirthLng(loc.lng);
                setBirthTimezone(loc.timezone);
              }}
              placeholder={isTamil ? 'பிறந்த நகரத்தைத் தேடுங்கள்...' : locale === 'en' ? 'Search birth city...' : 'जन्म शहर खोजें...'}
            />
          </div>
          <button
            onClick={handleFullAnalysis}
            disabled={loading || !birthDate || !birthTime || !birthLat || !birthLng}
            className="mt-6 w-full py-3 rounded-xl font-bold text-sm bg-gold-primary/20 border border-gold-primary/40 text-gold-light hover:bg-gold-primary/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={bodyFont}
          >
            {loading ? t(LABELS.loading, locale) : t(LABELS.analyze, locale)}
          </button>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div {...fadeUp} exit={{ opacity: 0 }}>
            <GoldDivider />

            {/* Ashtama Shani Warning — Saturn in 8th from natal Moon */}
            {(() => {
              if (!moonRashi || !saturnNow.sign) return null;
              const eighthFromMoon = ((moonRashi - 1 + 7) % 12) + 1;
              const isAshtamaShani = saturnNow.sign === eighthFromMoon;
              if (!isAshtamaShani) return null;
              const saturnSignNm = RASHIS.find(r => r.id === saturnNow.sign)?.name;
              return (
                <div className="my-6 rounded-2xl border-2 border-red-700/50 bg-gradient-to-br from-red-900/20 via-red-950/10 to-transparent p-5 text-center">
                  <div className="text-red-400 text-xs uppercase tracking-[0.3em] font-bold mb-2">
                    {isTamil ? '⚠ அஷ்டம சனி செயலில்' : locale === 'en' ? '⚠ Ashtama Shani Active' : '⚠ अष्टम शनि सक्रिय'}
                  </div>
                  <div className="text-red-300 text-xl font-bold mb-2" style={headingFont}>
                    {locale === 'en'
                      ? `Saturn in your 8th sign (${saturnSignNm?.[lk as keyof typeof saturnSignNm] || ''})`
                      : `शनि आपकी ${saturnSignNm?.[lk as keyof typeof saturnSignNm] || ''} राशि में — अष्टम स्थान`}
                  </div>
                  <p className="text-text-secondary text-sm max-w-xl mx-auto">
                    {locale === 'en'
                      ? 'Ashtama Shani — Saturn transiting the 8th sign from your natal Moon — is considered more severe than individual Sade Sati phases. This 2.5-year period brings deep transformation, unexpected challenges, and intensified karmic lessons in health, longevity, and hidden matters. Focus on discipline, avoid impulsive decisions, and prioritise spiritual practice.'
                      : 'अष्टम शनि — शनि का जन्म चन्द्र राशि से 8वीं राशि में गोचर — साढ़े साती के व्यक्तिगत चरणों से भी अधिक कष्टप्रद माना जाता है। यह 2.5 वर्ष की अवधि स्वास्थ्य, आयु और छिपे विषयों में गहन परिवर्तन, अप्रत्याशित चुनौतियाँ लाती है। अनुशासन पर ध्यान दें, आवेगी निर्णयों से बचें, आध्यात्मिक साधना बढ़ाएँ।'}
                  </p>
                </div>
              );
            })()}

            {/* 1. Status Banner */}
            {analysis.isActive ? (
              <div className="my-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-5 md:p-8 border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent text-center">
                <div className="text-red-400 text-xs uppercase tracking-[0.3em] font-bold mb-2">{t(LABELS.active, locale)}</div>
                <div className="text-red-300 text-2xl font-bold mb-1" style={headingFont}>{analysis.cycleStart} — {analysis.cycleEnd}</div>
                {analysis.currentPhase && (
                  <div className="text-text-secondary text-sm mb-4" style={bodyFont}>{t(LABELS.phase[analysis.currentPhase], locale)}</div>
                )}
                {/* Phase progress bar */}
                <div className="max-w-xs mx-auto">
                  <div className="h-2 rounded-full bg-bg-tertiary/40 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round(analysis.phaseProgress * 100))}%` }}
                      transition={{ duration: 1, ease: 'easeOut' as const }}
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                    />
                  </div>
                  <div className="text-text-secondary text-xs mt-1">{Math.min(100, Math.round(analysis.phaseProgress * 100))}%</div>
                </div>
              </div>
            ) : (
              <div className="my-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-5 md:p-8 border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent text-center">
                <div className="text-emerald-400 text-xs uppercase tracking-[0.3em] font-bold mb-2">{t(LABELS.notActive, locale)}</div>
                {analysis.allCycles.length > 0 && (() => {
                  const currentYear = new Date().getFullYear();
                  const next = analysis.allCycles.find(c => c.startYear > currentYear);
                  return next ? (
                    <div className="text-emerald-300 text-lg font-bold" style={headingFont}>
                      {t(LABELS.nextCycle, locale)} {next.startYear}
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* 2. Intensity Meter (full mode + active only) */}
            {isFullMode && analysis.isActive && analysis.overallIntensity > 0 && (
              <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="my-10">
                <h2 className="text-3xl font-bold text-gold-gradient mb-6 text-center" style={headingFont}>{t(LABELS.intensity, locale)}</h2>
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-4 md:p-6">
                  {/* Circular-style gauge */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-bg-tertiary/40" />
                        <circle
                          cx="60" cy="60" r="52" fill="none" strokeWidth="8"
                          stroke="currentColor"
                          className={intensityColor(analysis.overallIntensity)}
                          strokeDasharray={`${(analysis.overallIntensity / 10) * 327} 327`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold font-mono ${intensityColor(analysis.overallIntensity)}`}>
                          {analysis.overallIntensity.toFixed(1)}
                        </span>
                        <span className="text-text-secondary text-xs">/10</span>
                      </div>
                    </div>
                    <span className={`mt-2 text-sm font-bold ${intensityColor(analysis.overallIntensity)}`} style={bodyFont}>
                      {intensityLabel(analysis.overallIntensity, locale)}
                    </span>
                  </div>

                  {/* Factor bars */}
                  <div className="space-y-3">
                    {analysis.intensityFactors.map((f, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary" style={bodyFont}>{f.description[lk as keyof typeof f.description] ?? f.description.en}</span>
                          <span className={`font-mono font-bold ${intensityColor(f.score)}`}>{f.score.toFixed(1)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-bg-tertiary/40 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(f.score / 10) * 100}%` }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: 'easeOut' as const }}
                            className={`h-full rounded-full ${intensityBg(f.score)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. Personalized Interpretation (full mode only) */}
            {isFullMode && (
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="my-10">
                <div className="space-y-3">
                  {interpretationKeys.map((key) => {
                    const content = analysis.interpretation[key];
                    const text = content[lk as keyof typeof content] ?? content.en;
                    if (!text) return null;
                    const isOpen = expandedSection === key || key === 'summary';
                    return (
                      <div key={key} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedSection(isOpen && key !== 'summary' ? '' : key)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <span className="text-gold-dark text-sm font-bold uppercase tracking-wider" style={bodyFont}>
                            {t(LABELS.sections[key], locale)}
                          </span>
                          {key !== 'summary' && (
                            <span className={`text-gold-primary/40 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>&#9660;</span>
                          )}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>{text}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 4. Timeline */}
            <GoldDivider />
            <h2 className="text-3xl font-bold text-gold-gradient my-8 text-center" style={headingFont}>{t(LABELS.timeline, locale)}</h2>
            <div className="relative mb-10">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gold-primary/20" />
              <div className="space-y-4 ml-14">
                {analysis.allCycles.map((cycle, i) => (
                  <motion.div
                    key={cycle.startYear}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border relative ${
                      cycle.isActive ? 'border-red-500/30 bg-red-500/5' : 'border-gold-primary/10'
                    }`}
                  >
                    <div className={`absolute -left-[2.4rem] top-6 w-3 h-3 rounded-full ${
                      cycle.isActive ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gold-primary/40'
                    }`} />
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className={`font-mono text-lg font-bold ${cycle.isActive ? 'text-red-300' : 'text-gold-light'}`}>
                          {cycle.startYear} — {cycle.endYear}
                        </span>
                        {cycle.isActive && (
                          <span className="ml-3 text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full font-bold animate-pulse">
                            {t(LABELS.current, locale)}
                          </span>
                        )}
                      </div>
                      <span className="text-text-secondary text-xs">~7.5 {t(LABELS.years, locale)}</span>
                    </div>
                    {/* Phase sub-sections for active or detailed view */}
                    {cycle.phases && cycle.phases.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {cycle.phases.map((ph) => (
                          <div key={ph.phase} className={`text-xs flex justify-between ${
                            cycle.isActive && analysis.currentPhase === ph.phase ? 'text-red-300 font-bold' : 'text-text-secondary/75'
                          }`} style={bodyFont}>
                            <span>{t(LABELS.phase[ph.phase], locale)}</span>
                            <span className="font-mono">{ph.startYear}–{ph.endYear}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Nakshatra transit sub-items for active cycle */}
                    {cycle.isActive && analysis.nakshatraTimeline.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gold-primary/10 space-y-1">
                        <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1.5">
                          {isTamil ? 'நட்சத்திர கோசாரம்' : locale === 'en' ? 'Nakshatra Transits' : 'नक्षत्र गोचर'}
                        </div>
                        {analysis.nakshatraTimeline.map((nt, k) => {
                          const nak = NAKSHATRAS[nt.nakshatra - 1];
                          const nakName = nak?.name?.[locale as 'en' | 'hi' | 'sa'] || nak?.name?.en || '';
                          const yearLabel = nt.firstYear === nt.lastYear ? String(nt.firstYear) : `${nt.firstYear}–${nt.lastYear}`;
                          return (
                            <div
                              key={k}
                              className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border ${
                                nt.isBirthNakshatra
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                                  : nt.isCurrent
                                    ? 'bg-gold-primary/10 border-gold-primary/25 text-gold-light'
                                    : 'border-transparent text-text-secondary'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                nt.isCurrent ? 'bg-gold-primary animate-pulse' : nt.isBirthNakshatra ? 'bg-amber-400' : 'bg-text-tertiary/40'
                              }`} />
                              <span className="flex-1">{nakName}</span>
                              <span className="font-mono text-xs opacity-70">{yearLabel}</span>
                              {nt.isBirthNakshatra && (
                                <span className="text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-300">
                                  {isTamil ? 'ஜன்மம்' : locale === 'en' ? 'Birth' : 'जन्म'}
                                </span>
                              )}
                              {nt.isCurrent && !nt.isBirthNakshatra && (
                                <span className="text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold-primary/15 border border-gold-primary/25 text-gold-light">
                                  {isTamil ? 'இப்போது' : locale === 'en' ? 'Now' : 'अभी'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 5. Remedies — only when Sade Sati is active */}
            {analysis.isActive && (<>
            <GoldDivider />
            <h2 className="text-3xl font-bold text-gold-gradient my-8 text-center" style={headingFont}>{t(LABELS.remedies, locale)}</h2>

            {isFullMode && analysis.remedies.length > 0 ? (
              <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-10">
                {(['essential', 'recommended', 'optional'] as const).map(priority => {
                  const items = analysis.remedies.filter(r => r.priority === priority);
                  if (items.length === 0) return null;
                  return (
                    <div key={priority}>
                      <div className="flex items-center gap-2 mb-3">{priorityBadge(priority)}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((r, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4"
                          >
                            <div className="text-gold-light text-sm font-bold mb-1" style={bodyFont}>{r.title[lk as keyof typeof r.title] ?? r.title.en}</div>
                            <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{r.description[lk as keyof typeof r.description] ?? r.description.en}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {GENERIC_REMEDIES.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-gold-primary text-lg font-bold">{i + 1}</span>
                      <div>
                        <div className="text-gold-light text-sm font-bold mb-0.5" style={bodyFont}>{t(r.title, locale)}</div>
                        <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{t(r.description, locale)}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            </>)}
          </motion.div>
        )}
      </AnimatePresence>

      <RelatedLinks type="learn" links={getLearnLinksForTool('/sade-sati')} locale={locale} className="mt-8" />
    </div>
  );
}
