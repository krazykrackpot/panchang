'use client';

import { useState, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Heart, Shield, Activity, Home, Star, BookOpen, ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import PrintButton from '@/components/ui/PrintButton';
import LocationSearch from '@/components/ui/LocationSearch';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/types/panchang';
import type { KundaliData } from '@/types/kundali';
import type { DetailedMatchReport } from '@/lib/matching/detailed-report';
import type { MatchResult } from '@/lib/matching/ashta-kuta';
import { getKutaInsight, getOverallVerdict } from '@/lib/constants/kuta-insights';

// ── Inline labels (en + hi) ──────────────────────────────────

const L = {
  en: {
    title: 'Detailed Compatibility Report',
    subtitle: 'Deep cross-chart analysis beyond Ashta Kuta — Manglik, Nadi, aspects, 7th house, Venus, and narrative summary',
    partner1: 'Partner 1',
    partner2: 'Partner 2',
    name: 'Name',
    dateOfBirth: 'Date of Birth',
    timeOfBirth: 'Time of Birth',
    placeOfBirth: 'Place of Birth',
    generate: 'Generate Detailed Report',
    generating: 'Analyzing Charts...',
    fillBoth: 'Fill complete birth details for both partners',
    backToMatching: 'Back to Matching',
    tabOverview: 'Overview',
    tabManglik: 'Manglik',
    tabNadi: 'Nadi',
    tabRajju: 'Rajju',
    tabAspects: 'Cross-Chart',
    tab7th: '7th House',
    tabVenus: 'Venus',
    tabSummary: 'Summary',
    manglikTitle: 'Manglik (Kuja Dosha) Analysis',
    nadiTitle: 'Nadi Dosha Analysis',
    rajjuTitle: 'Rajju Dosha Analysis (South Indian)',
    rajjuGroup: 'Rajju Group',
    rajjuDosha: 'Rajju Dosha',
    rajjuDescription: 'Interpretation',
    aspectsTitle: 'Cross-Chart Planetary Aspects',
    seventhTitle: '7th House (Marriage) Analysis',
    venusTitle: 'Venus (Love & Romance) Analysis',
    summaryTitle: 'Narrative Summary',
    strengths: 'Strengths',
    challenges: 'Challenges',
    advice: 'Advice & Remedies',
    overallNarrative: 'Overall Assessment',
    cancellations: 'Cancellation Factors',
    noCancellations: 'No cancellation factors identified',
    noAspects: 'No major tight aspects detected between the two charts.',
    severity: 'Severity',
    status: 'Status',
    present: 'Present',
    absent: 'Absent',
    healthImplications: 'Health Implications',
    compatibility: 'Compatibility',
    sign: 'Sign',
    house: 'House',
    lord: 'Lord',
    lordPlacement: 'Lord Placement',
    planetsIn7th: 'Planets in 7th',
    venusSign: 'Venus Sign',
    venusHouse: 'Venus House',
    none: 'None',
    errorOccurred: 'An error occurred. Please try again.',
    connectionError: 'Connection error. Please check your internet.',
    manglikLabel: 'Manglik',
    manglikCancelled: 'Cancelled',
    notManglik: 'Not Manglik',
    nadiLabel: 'Nadi',
    nadiDoshaLabel: 'Nadi Dosha',
    rajjuLabel: 'Rajju',
    aspectsLabel: 'Aspects',
    ashtaKutaBreakdown: 'Ashta Kuta Breakdown',
    housePrefix: 'House',
    printTitle: 'Detailed Compatibility Report',
    printLabel: 'Print / PDF',
    newAnalysis: 'New Analysis',
  },
  hi: {
    title: 'विस्तृत अनुकूलता रिपोर्ट',
    subtitle: 'अष्ट कूट से आगे गहन विश्लेषण — मांगलिक, नाड़ी, ग्रह दृष्टि, सप्तम भाव, शुक्र, और सारांश',
    partner1: 'साथी 1',
    partner2: 'साथी 2',
    name: 'नाम',
    dateOfBirth: 'जन्म तिथि',
    timeOfBirth: 'जन्म समय',
    placeOfBirth: 'जन्म स्थान',
    generate: 'विस्तृत रिपोर्ट बनाएँ',
    generating: 'चार्ट विश्लेषण हो रहा है...',
    fillBoth: 'दोनों साथियों का पूर्ण जन्म विवरण भरें',
    backToMatching: 'मिलान पर वापस जाएँ',
    tabOverview: 'सारांश',
    tabManglik: 'मांगलिक',
    tabNadi: 'नाड़ी',
    tabRajju: 'राजु',
    tabAspects: 'ग्रह दृष्टि',
    tab7th: 'सप्तम भाव',
    tabVenus: 'शुक्र',
    tabSummary: 'विवरण',
    manglikTitle: 'मांगलिक (कुज दोष) विश्लेषण',
    nadiTitle: 'नाड़ी दोष विश्लेषण',
    rajjuTitle: 'राजु दोष विश्लेषण (दक्षिण भारतीय)',
    rajjuGroup: 'राजु समूह',
    rajjuDosha: 'राजु दोष',
    rajjuDescription: 'व्याख्या',
    aspectsTitle: 'क्रॉस-चार्ट ग्रह दृष्टि',
    seventhTitle: 'सप्तम भाव (विवाह) विश्लेषण',
    venusTitle: 'शुक्र (प्रेम एवं रोमांस) विश्लेषण',
    summaryTitle: 'कथात्मक सारांश',
    strengths: 'शक्तियाँ',
    challenges: 'चुनौतियाँ',
    advice: 'सलाह एवं उपाय',
    overallNarrative: 'समग्र मूल्यांकन',
    cancellations: 'निवारण कारक',
    noCancellations: 'कोई निवारण कारक नहीं मिला',
    noAspects: 'दोनों कुण्डलियों में कोई प्रमुख दृष्टि नहीं पाई गई।',
    severity: 'तीव्रता',
    status: 'स्थिति',
    present: 'उपस्थित',
    absent: 'अनुपस्थित',
    healthImplications: 'स्वास्थ्य प्रभाव',
    compatibility: 'अनुकूलता',
    sign: 'राशि',
    house: 'भाव',
    lord: 'स्वामी',
    lordPlacement: 'स्वामी स्थान',
    planetsIn7th: 'सप्तम भाव के ग्रह',
    venusSign: 'शुक्र राशि',
    venusHouse: 'शुक्र भाव',
    none: 'कोई नहीं',
    errorOccurred: 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
    connectionError: 'कनेक्शन त्रुटि। कृपया इंटरनेट जाँचें।',
    manglikLabel: 'मांगलिक',
    manglikCancelled: 'निवारित',
    notManglik: 'मांगलिक नहीं',
    nadiLabel: 'नाड़ी',
    nadiDoshaLabel: 'नाड़ी दोष',
    rajjuLabel: 'राजु',
    aspectsLabel: 'दृष्टि',
    ashtaKutaBreakdown: 'अष्ट कूट विवरण',
    housePrefix: 'भाव',
    printTitle: 'विस्तृत अनुकूलता रिपोर्ट',
    printLabel: 'प्रिंट / PDF',
    newAnalysis: 'नया विश्लेषण',
  },
  ta: {
    title: 'விரிவான பொருத்த அறிக்கை',
    subtitle: 'அஷ்ட கூடத்திற்கு அப்பால் ஆழமான பகுப்பாய்வு — மாங்கலிக, நாடி, கிரக பார்வை, 7ஆம் வீடு, சுக்கிரன், மற்றும் சுருக்கம்',
    partner1: 'துணை 1',
    partner2: 'துணை 2',
    name: 'பெயர்',
    dateOfBirth: 'பிறந்த தேதி',
    timeOfBirth: 'பிறந்த நேரம்',
    placeOfBirth: 'பிறந்த இடம்',
    generate: 'விரிவான அறிக்கை உருவாக்கு',
    generating: 'ஜாதகம் பகுப்பாய்வு செய்யப்படுகிறது...',
    fillBoth: 'இரு துணைகளின் முழுமையான பிறப்பு விவரங்களை நிரப்புங்கள்',
    backToMatching: 'பொருத்தத்திற்குத் திரும்பு',
    tabOverview: 'சுருக்கம்',
    tabManglik: 'மாங்கலிக',
    tabNadi: 'நாடி',
    tabRajju: 'ராஜ்ஜு',
    tabAspects: 'கிரக பார்வை',
    tab7th: '7ஆம் வீடு',
    tabVenus: 'சுக்கிரன்',
    tabSummary: 'விவரம்',
    manglikTitle: 'மாங்கலிக (குஜ தோஷம்) பகுப்பாய்வு',
    nadiTitle: 'நாடி தோஷம் பகுப்பாய்வு',
    rajjuTitle: 'ராஜ்ஜு தோஷம் பகுப்பாய்வு (தென் இந்திய)',
    rajjuGroup: 'ராஜ்ஜு குழு',
    rajjuDosha: 'ராஜ்ஜு தோஷம்',
    rajjuDescription: 'விளக்கம்',
    aspectsTitle: 'குறுக்கு-ஜாதக கிரக பார்வை',
    seventhTitle: '7ஆம் வீடு (திருமணம்) பகுப்பாய்வு',
    venusTitle: 'சுக்கிரன் (காதல் & காமம்) பகுப்பாய்வு',
    summaryTitle: 'விவரணச் சுருக்கம்',
    strengths: 'பலங்கள்',
    challenges: 'சவால்கள்',
    advice: 'ஆலோசனை & பரிகாரங்கள்',
    overallNarrative: 'ஒட்டுமொத்த மதிப்பீடு',
    cancellations: 'நிவாரண காரணிகள்',
    noCancellations: 'நிவாரண காரணிகள் எதுவும் கிடைக்கவில்லை',
    noAspects: 'இரு ஜாதகங்களிலும் முக்கிய பார்வைகள் எதுவும் காணப்படவில்லை.',
    severity: 'தீவிரம்',
    status: 'நிலை',
    present: 'உள்ளது',
    absent: 'இல்லை',
    healthImplications: 'சுகாதாரத் தாக்கங்கள்',
    compatibility: 'பொருத்தம்',
    sign: 'ராசி',
    house: 'வீடு',
    lord: 'அதிபதி',
    lordPlacement: 'அதிபதி இடம்',
    planetsIn7th: '7ஆம் வீட்டின் கிரகங்கள்',
    venusSign: 'சுக்கிர ராசி',
    venusHouse: 'சுக்கிர வீடு',
    none: 'எதுவுமில்லை',
    errorOccurred: 'பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    connectionError: 'இணைப்பு பிழை. உங்கள் இணையத்தைச் சரிபாருங்கள்.',
    manglikLabel: 'மாங்கலிக',
    manglikCancelled: 'நிவாரணம்',
    notManglik: 'மாங்கலிக இல்லை',
    nadiLabel: 'நாடி',
    nadiDoshaLabel: 'நாடி தோஷம்',
    rajjuLabel: 'ராஜ்ஜு',
    aspectsLabel: 'பார்வை',
    ashtaKutaBreakdown: 'அஷ்ட கூட விவரம்',
    housePrefix: 'வீடு',
    printTitle: 'விரிவான பொருத்த அறிக்கை',
    printLabel: 'அச்சு / PDF',
    newAnalysis: 'புதிய பகுப்பாய்வு',
  },
  bn: {
    title: 'বিস্তারিত সামঞ্জস্য প্রতিবেদন',
    subtitle: 'অষ্ট কূটের বাইরে গভীর বিশ্লেষণ — মাঙ্গলিক, নাড়ী, গ্রহ দৃষ্টি, সপ্তম ভাব, শুক্র, এবং সারাংশ',
    partner1: 'সঙ্গী ১',
    partner2: 'সঙ্গী ২',
    name: 'নাম',
    dateOfBirth: 'জন্ম তারিখ',
    timeOfBirth: 'জন্ম সময়',
    placeOfBirth: 'জন্মস্থান',
    generate: 'বিস্তারিত প্রতিবেদন তৈরি করুন',
    generating: 'চার্ট বিশ্লেষণ হচ্ছে...',
    fillBoth: 'উভয় সঙ্গীর সম্পূর্ণ জন্ম বিবরণ পূরণ করুন',
    backToMatching: 'মিলনে ফিরে যান',
    tabOverview: 'সারসংক্ষেপ',
    tabManglik: 'মাঙ্গলিক',
    tabNadi: 'নাড়ী',
    tabRajju: 'রাজ্জু',
    tabAspects: 'গ্রহ দৃষ্টি',
    tab7th: 'সপ্তম ভাব',
    tabVenus: 'শুক্র',
    tabSummary: 'বিবরণ',
    manglikTitle: 'মাঙ্গলিক (কুজ দোষ) বিশ্লেষণ',
    nadiTitle: 'নাড়ী দোষ বিশ্লেষণ',
    rajjuTitle: 'রাজ্জু দোষ বিশ্লেষণ (দক্ষিণ ভারতীয়)',
    rajjuGroup: 'রাজ্জু গোষ্ঠী',
    rajjuDosha: 'রাজ্জু দোষ',
    rajjuDescription: 'ব্যাখ্যা',
    aspectsTitle: 'ক্রস-চার্ট গ্রহ দৃষ্টি',
    seventhTitle: 'সপ্তম ভাব (বিবাহ) বিশ্লেষণ',
    venusTitle: 'শুক্র (প্রেম ও রোমান্স) বিশ্লেষণ',
    summaryTitle: 'বর্ণনামূলক সারাংশ',
    strengths: 'শক্তিসমূহ',
    challenges: 'চ্যালেঞ্জসমূহ',
    advice: 'পরামর্শ ও প্রতিকার',
    overallNarrative: 'সামগ্রিক মূল্যায়ন',
    cancellations: 'নিবারণ কারক',
    noCancellations: 'কোনো নিবারণ কারক পাওয়া যায়নি',
    noAspects: 'দুটি কুণ্ডলীতে কোনো প্রধান দৃষ্টি পাওয়া যায়নি।',
    severity: 'তীব্রতা',
    status: 'অবস্থা',
    present: 'উপস্থিত',
    absent: 'অনুপস্থিত',
    healthImplications: 'স্বাস্থ্য প্রভাব',
    compatibility: 'সামঞ্জস্য',
    sign: 'রাশি',
    house: 'ভাব',
    lord: 'অধিপতি',
    lordPlacement: 'অধিপতি স্থান',
    planetsIn7th: 'সপ্তম ভাবের গ্রহ',
    venusSign: 'শুক্র রাশি',
    venusHouse: 'শুক্র ভাব',
    none: 'কোনটি নয়',
    errorOccurred: 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    connectionError: 'সংযোগ ত্রুটি। অনুগ্রহ করে ইন্টারনেট পরীক্ষা করুন।',
    manglikLabel: 'মাঙ্গলিক',
    manglikCancelled: 'নিবারিত',
    notManglik: 'মাঙ্গলিক নয়',
    nadiLabel: 'নাড়ী',
    nadiDoshaLabel: 'নাড়ী দোষ',
    rajjuLabel: 'রাজ্জু',
    aspectsLabel: 'দৃষ্টি',
    ashtaKutaBreakdown: 'অষ্ট কূট বিবরণ',
    housePrefix: 'ভাব',
    printTitle: 'বিস্তারিত সামঞ্জস্য প্রতিবেদন',
    printLabel: 'প্রিন্ট / PDF',
    newAnalysis: 'নতুন বিশ্লেষণ',
  },
};

// ── Sign names for display ───────────────────────────────────

const SIGN_NAMES: Record<string, string[]> = {
  en: ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  hi: ['', 'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'],
  ta: ['', 'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'],
  bn: ['', 'মেষ', 'বৃষ', 'মিথুন', 'কর্কট', 'সিংহ', 'কন্যা', 'তুলা', 'বৃশ্চিক', 'ধনু', 'মকর', 'কুম্ভ', 'মীন'],
};
const PLANET_NAMES: Record<string, Record<number, string>> = {
  en: { 0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu' },
  hi: { 0: 'सूर्य', 1: 'चन्द्र', 2: 'मंगल', 3: 'बुध', 4: 'बृहस्पति', 5: 'शुक्र', 6: 'शनि', 7: 'राहु', 8: 'केतु' },
  ta: { 0: 'சூரியன்', 1: 'சந்திரன்', 2: 'செவ்வாய்', 3: 'புதன்', 4: 'குரு', 5: 'சுக்கிரன்', 6: 'சனி', 7: 'ராகு', 8: 'கேது' },
  bn: { 0: 'সূর্য', 1: 'চন্দ্র', 2: 'মঙ্গল', 3: 'বুধ', 4: 'বৃহস্পতি', 5: 'শুক্র', 6: 'শনি', 7: 'রাহু', 8: 'কেতু' },
};

// ── Types ────────────────────────────────────────────────────

interface PersonBirth {
  name: string;
  date: string;
  time: string;
  placeName: string;
  placeLat: number | null;
  placeLng: number | null;
  placeTimezone: string | null;
}

type TabKey = 'overview' | 'manglik' | 'nadi' | 'rajju' | 'aspects' | '7th' | 'venus' | 'summary';

const TABS: { key: TabKey; icon: typeof Heart }[] = [
  { key: 'overview', icon: Star },
  { key: 'manglik', icon: Shield },
  { key: 'nadi', icon: Activity },
  { key: 'rajju', icon: Activity },
  { key: 'aspects', icon: Heart },
  { key: '7th', icon: Home },
  { key: 'venus', icon: Heart },
  { key: 'summary', icon: BookOpen },
];

// ── Page ─────────────────────────────────────────────────────

export default function DetailedReportPage() {
  const locale = useLocale() as Locale;
  const isHindi = isDevanagariLocale(locale);
  const lbl = (L as Record<string, typeof L.en>)[String(locale)] || L.en;
  const headingFont = isHindi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const signName = (s: number) => (SIGN_NAMES[String(locale)] ?? SIGN_NAMES.en)[s] || '';
  const planetName = (id: number) => (PLANET_NAMES[String(locale)] ?? PLANET_NAMES.en)[id] || '';

  const emptyBirth: PersonBirth = { name: '', date: '', time: '06:00', placeName: '', placeLat: null, placeLng: null, placeTimezone: null };
  const [p1, setP1] = useState<PersonBirth>(emptyBirth);
  const [p2, setP2] = useState<PersonBirth>(emptyBirth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DetailedMatchReport | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const reportRef = useRef<HTMLDivElement>(null);

  const p1Ready = !!p1.date && !!p1.time && p1.placeLat !== null;
  const p2Ready = !!p2.date && !!p2.time && p2.placeLat !== null;

  const handleGenerate = useCallback(async () => {
    if (!p1Ready || !p2Ready) return;
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      // Generate kundalis for both in parallel
      const genKundali = async (b: PersonBirth): Promise<KundaliData | null> => {
        const r = await fetch('/api/kundali', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: b.date, time: b.time, lat: b.placeLat, lng: b.placeLng, timezone: b.placeTimezone, name: b.name }),
        });
        if (!r.ok) return null;
        return (await r.json()) as KundaliData;
      };

      const [k1, k2] = await Promise.all([genKundali(p1), genKundali(p2)]);
      if (!k1 || !k2) {
        setError(lbl.errorOccurred);
        setLoading(false);
        return;
      }

      // Get Ashta Kuta score via matching API
      const moon1 = k1.planets.find(p => p.planet.id === 1);
      const moon2 = k2.planets.find(p => p.planet.id === 1);
      if (!moon1 || !moon2) {
        setError(lbl.errorOccurred);
        setLoading(false);
        return;
      }

      const matchRes = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boy: { moonNakshatra: moon1.nakshatra.id, moonRashi: moon1.sign },
          girl: { moonNakshatra: moon2.nakshatra.id, moonRashi: moon2.sign },
        }),
      });
      if (!matchRes.ok) {
        setError(lbl.errorOccurred);
        setLoading(false);
        return;
      }
      const matchResult: MatchResult = await matchRes.json();

      // Import and run detailed report engine (dynamic to keep initial bundle small)
      const { generateDetailedReport } = await import('@/lib/matching/detailed-report');
      const detailedReport = generateDetailedReport(k1, k2, matchResult);
      setReport(detailedReport);
      setActiveTab('overview');
    } catch (err) {
      console.error('[detailed-report] generation failed:', err);
      setError(lbl.connectionError);
    }
    setLoading(false);
  }, [p1, p2, p1Ready, p2Ready, lbl]);

  const tabLabel = (key: TabKey): string => {
    const map: Record<TabKey, string> = {
      overview: lbl.tabOverview,
      manglik: lbl.tabManglik,
      nadi: lbl.tabNadi,
      rajju: lbl.tabRajju,
      aspects: lbl.tabAspects,
      '7th': lbl.tab7th,
      venus: lbl.tabVenus,
      summary: lbl.tabSummary,
    };
    return map[key];
  };

  const verdictColors: Record<string, string> = {
    excellent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    good: 'text-green-400 border-green-500/30 bg-green-500/10',
    average: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    below_average: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    not_recommended: 'text-red-400 border-red-500/30 bg-red-500/10',
  };

  const severityColor = (s: string) => {
    if (s === 'severe') return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (s === 'moderate') return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    if (s === 'mild') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  // ── Birth input card ───────────────────────────────────────
  const BirthCard = ({ person, setPerson, label, borderColor }: {
    person: PersonBirth; setPerson: (p: PersonBirth) => void; label: string; borderColor: string;
  }) => (
    <div className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border ${borderColor} rounded-2xl p-4 sm:p-5`}>
      <h2 className="text-lg font-bold text-gold-light mb-4 text-center" style={headingFont}>{label}</h2>
      <div className="space-y-3">
        <div>
          <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1.5">{lbl.name}</label>
          <input type="text" value={person.name} onChange={e => setPerson({ ...person, name: e.target.value })}
            className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1.5">{lbl.dateOfBirth}</label>
            <input type="date" value={person.date} onChange={e => setPerson({ ...person, date: e.target.value })}
              className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50" />
          </div>
          <div>
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1.5">{lbl.timeOfBirth}</label>
            <input type="time" value={person.time} onChange={e => setPerson({ ...person, time: e.target.value })}
              className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50" />
          </div>
        </div>
        <div>
          <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1.5">{lbl.placeOfBirth}</label>
          <LocationSearch value={person.placeName} onSelect={loc => setPerson({ ...person, placeName: loc.name, placeLat: loc.lat, placeLng: loc.lng, placeTimezone: loc.timezone })} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/matching" className="inline-flex items-center gap-1.5 text-gold-primary hover:text-gold-light text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {lbl.backToMatching}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={headingFont}>
          <span className="text-gold-gradient">{lbl.title}</span>
        </h1>
        <p className="text-text-secondary text-base max-w-2xl mx-auto">{lbl.subtitle}</p>
      </div>

      {/* Form */}
      {!report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <BirthCard person={p1} setPerson={setP1} label={lbl.partner1} borderColor="border-blue-500/20" />
            <BirthCard person={p2} setPerson={setP2} label={lbl.partner2} borderColor="border-pink-500/20" />
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={loading || !p1Ready || !p2Ready}
              className="px-10 py-4 bg-gradient-to-r from-gold-primary/30 to-gold-primary/20 border-2 border-gold-primary/40 rounded-xl text-gold-light font-bold text-lg hover:from-gold-primary/40 hover:to-gold-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={headingFont}
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin inline mr-2" />{lbl.generating}</> : lbl.generate}
            </button>
            {!loading && (!p1Ready || !p2Ready) && (
              <p className="text-text-secondary text-xs mt-3">{lbl.fillBoth}</p>
            )}
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 border border-red-500/20 bg-red-500/5 text-center mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {report && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} ref={reportRef}>
            <GoldDivider />

            {/* Overall Score Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-8">
              <div className="relative">
                <svg className="w-32 h-32" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-bg-tertiary" />
                  <circle cx="60" cy="60" r="52" fill="none" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - report.ashtaKuta.percentage / 100)}`}
                    className={report.ashtaKuta.verdict === 'excellent' || report.ashtaKuta.verdict === 'good' ? 'stroke-emerald-500' : report.ashtaKuta.verdict === 'average' ? 'stroke-amber-500' : 'stroke-red-500'}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dashoffset 1s ease-out' }}
                  />
                  <text x="60" y="55" textAnchor="middle" className="fill-gold-light text-2xl font-bold" style={{ fontSize: '26px' }}>{report.ashtaKuta.totalScore}</text>
                  <text x="60" y="73" textAnchor="middle" className="fill-text-secondary" style={{ fontSize: '11px' }}>/ 36</text>
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <div className={`inline-block px-5 py-2 rounded-lg border text-base font-bold ${verdictColors[report.ashtaKuta.verdict]}`} style={headingFont}>
                  {report.ashtaKuta.verdictText.en}
                </div>
                <div className="text-text-secondary text-sm mt-2">{report.ashtaKuta.percentage}% {lbl.compatibility}</div>
                {/* Overall score interpretation */}
                {(() => {
                  const ov = getOverallVerdict(report.ashtaKuta.totalScore);
                  const ovBorder: Record<string, string> = {
                    excellent: 'border-emerald-500/25 bg-emerald-500/5',
                    good: 'border-green-500/25 bg-green-500/5',
                    average: 'border-amber-500/25 bg-amber-500/5',
                    caution: 'border-red-500/25 bg-red-500/5',
                  };
                  const ovText: Record<string, string> = {
                    excellent: 'text-emerald-400',
                    good: 'text-green-400',
                    average: 'text-amber-400',
                    caution: 'text-red-400',
                  };
                  return (
                    <div className={`mt-4 rounded-xl border p-3 max-w-sm mx-auto sm:mx-0 text-left ${ovBorder[ov.tier]}`}>
                      <div className={`font-bold text-sm mb-1 ${ovText[ov.tier]}`}>{ov.headline}</div>
                      <p className="text-text-secondary text-xs leading-relaxed">{ov.body}</p>
                    </div>
                  );
                })()}
                {/* Quick status badges */}
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${report.manglikAnalysis.chart1HasManglik || report.manglikAnalysis.chart2HasManglik ? 'text-orange-300 border-orange-500/30 bg-orange-500/10' : 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'}`}>
                    {lbl.manglikLabel}: {report.manglikAnalysis.chart1HasManglik || report.manglikAnalysis.chart2HasManglik ? (report.manglikAnalysis.cancellations.length > 0 ? lbl.manglikCancelled : lbl.present) : lbl.absent}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${report.nadiAnalysis.doshaPresent ? 'text-red-300 border-red-500/30 bg-red-500/10' : 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'}`}>
                    {lbl.nadiLabel}: {report.nadiAnalysis.doshaPresent ? (report.nadiAnalysis.cancellations.length > 0 ? lbl.manglikCancelled : lbl.present) : lbl.absent}
                  </span>
                  {report.rajjuDosha && (
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${report.rajjuDosha.doshaPresent ? (report.rajjuDosha.severity === 'severe' ? 'text-red-300 border-red-500/30 bg-red-500/10' : report.rajjuDosha.severity === 'moderate' ? 'text-orange-300 border-orange-500/30 bg-orange-500/10' : 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10') : 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'}`}>
                      {lbl.rajjuLabel}: {report.rajjuDosha.doshaPresent ? lbl.present : lbl.absent}
                    </span>
                  )}
                  <span className="text-xs px-2.5 py-1 rounded-full border text-purple-300 border-purple-500/30 bg-purple-500/10">
                    {lbl.aspectsLabel}: {report.crossChartAspects.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 mb-8 pb-2 border-b border-gold-primary/10">
              {TABS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === key
                      ? 'bg-gold-primary/15 text-gold-light border-b-2 border-gold-primary'
                      : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tabLabel(key)}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {/* Overview */}
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Kuta breakdown */}
                  <h3 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>
                    {lbl.ashtaKutaBreakdown}
                  </h3>
                  {report.ashtaKuta.kutas.map((kuta, i) => {
                    const pct = kuta.maxPoints > 0 ? kuta.scored / kuta.maxPoints : 0;
                    const insight = getKutaInsight(kuta.name.en, kuta.scored, kuta.maxPoints);
                    return (
                      <div key={kuta.name.en} className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gold-light font-bold" style={isDevanagariLocale(locale) ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                            {(kuta.name as Record<string, string>)[String(locale)] || kuta.name.en}
                          </span>
                          <span className="font-mono text-sm font-bold text-gold-primary">{kuta.scored}/{kuta.maxPoints}</span>
                        </div>
                        <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct * 100}%` }}
                            transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                            className={`h-full rounded-full ${
                              pct >= 0.75 ? 'bg-emerald-500' :
                              pct >= 0.5 ? 'bg-amber-500' :
                              pct >= 0.25 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                        {/* Relationship interpretation for this kuta */}
                        <p className={`text-xs leading-relaxed ${pct >= 0.75 ? 'text-emerald-300/80' : pct >= 0.5 ? 'text-amber-300/80' : pct >= 0.25 ? 'text-orange-300/80' : 'text-red-300/80'}`}>
                          {insight}
                        </p>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* Manglik */}
              {activeTab === 'manglik' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{lbl.manglikTitle}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: p1.name || lbl.partner1, has: report.manglikAnalysis.chart1HasManglik, sev: report.manglikAnalysis.chart1Severity },
                      { label: p2.name || lbl.partner2, has: report.manglikAnalysis.chart2HasManglik, sev: report.manglikAnalysis.chart2Severity },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                        <div className="text-gold-light font-bold mb-3" style={headingFont}>{item.label}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-text-secondary text-sm">{lbl.status}:</span>
                          <span className={`text-sm px-2.5 py-0.5 rounded-full border ${item.has ? 'text-red-300 border-red-500/30 bg-red-500/10' : 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'}`}>
                            {item.has ? lbl.manglikLabel : lbl.notManglik}
                          </span>
                        </div>
                        {item.has && (
                          <div className="flex items-center gap-2">
                            <span className="text-text-secondary text-sm">{lbl.severity}:</span>
                            <span className={`text-sm px-2.5 py-0.5 rounded-full border ${severityColor(item.sev)}`}>{item.sev}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                    <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">{lbl.cancellations}</div>
                    {report.manglikAnalysis.cancellations.length > 0 ? (
                      <ul className="space-y-1.5">
                        {report.manglikAnalysis.cancellations.map((c, i) => (
                          <li key={i} className="text-text-primary text-sm flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">&#10003;</span> {c}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-text-secondary text-sm">{lbl.noCancellations}</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                    <p className="text-text-primary text-sm leading-relaxed">{report.manglikAnalysis.summary}</p>
                  </div>
                </motion.div>
              )}

              {/* Nadi */}
              {activeTab === 'nadi' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{lbl.nadiTitle}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: p1.name || lbl.partner1, nadi: report.nadiAnalysis.chart1Nadi },
                      { label: p2.name || lbl.partner2, nadi: report.nadiAnalysis.chart2Nadi },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                        <div className="text-gold-light font-bold mb-2" style={headingFont}>{item.label}</div>
                        <div className="text-text-primary text-sm">
                          {lbl.nadiLabel}: <span className="text-gold-primary font-bold capitalize">{item.nadi}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`rounded-xl border p-4 ${report.nadiAnalysis.doshaPresent ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                    <div className="text-sm font-bold mb-1" style={headingFont}>
                      <span className={report.nadiAnalysis.doshaPresent ? 'text-red-400' : 'text-emerald-400'}>
                        {lbl.nadiDoshaLabel}: {report.nadiAnalysis.doshaPresent ? lbl.present : lbl.absent}
                      </span>
                    </div>
                  </div>

                  {report.nadiAnalysis.cancellations.length > 0 && (
                    <div className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                      <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">{lbl.cancellations}</div>
                      <ul className="space-y-1.5">
                        {report.nadiAnalysis.cancellations.map((c, i) => (
                          <li key={i} className="text-text-primary text-sm flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">&#10003;</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                    <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">{lbl.healthImplications}</div>
                    <p className="text-text-primary text-sm leading-relaxed">{report.nadiAnalysis.healthImplications}</p>
                  </div>
                </motion.div>
              )}

              {/* Rajju Dosha */}
              {activeTab === 'rajju' && report.rajjuDosha && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{lbl.rajjuTitle}</h3>

                  {/* Both partners' Rajju groups */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: p1.name || lbl.partner1, group: report.rajjuDosha.boyRajju },
                      { label: p2.name || lbl.partner2, group: report.rajjuDosha.girlRajju },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                        <div className="text-gold-light font-bold mb-2" style={headingFont}>{item.label}</div>
                        <div className="text-text-primary text-sm">
                          {lbl.rajjuGroup}: <span className="text-gold-primary font-bold capitalize">{item.group}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dosha status */}
                  <div className={`rounded-xl border p-4 ${report.rajjuDosha.doshaPresent ? (report.rajjuDosha.severity === 'severe' ? 'border-red-500/20 bg-red-500/5' : report.rajjuDosha.severity === 'moderate' ? 'border-orange-500/20 bg-orange-500/5' : 'border-yellow-500/20 bg-yellow-500/5') : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-bold" style={headingFont}>
                        <span className={report.rajjuDosha.doshaPresent ? (report.rajjuDosha.severity === 'severe' ? 'text-red-400' : report.rajjuDosha.severity === 'moderate' ? 'text-orange-400' : 'text-yellow-400') : 'text-emerald-400'}>
                          {lbl.rajjuDosha}: {report.rajjuDosha.doshaPresent ? lbl.present : lbl.absent}
                        </span>
                      </span>
                      {report.rajjuDosha.doshaPresent && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${report.rajjuDosha.severity === 'severe' ? 'bg-red-500/20 text-red-300' : report.rajjuDosha.severity === 'moderate' ? 'bg-orange-500/20 text-orange-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          {lbl.severity}: {report.rajjuDosha.severity}
                        </span>
                      )}
                    </div>
                    <div className="text-text-secondary text-xs capitalize">{report.rajjuDosha.groupName.en}</div>
                  </div>

                  {/* Description */}
                  <div className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                    <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">{lbl.rajjuDescription}</div>
                    <p className="text-text-primary text-sm leading-relaxed">
                      {(report.rajjuDosha.description as Record<string, string>)[String(locale)] ?? report.rajjuDosha.description.en}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Cross-Chart Aspects */}
              {activeTab === 'aspects' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{lbl.aspectsTitle}</h3>

                  {report.crossChartAspects.length === 0 ? (
                    <div className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 text-center">
                      <p className="text-text-secondary text-sm">{lbl.noAspects}</p>
                    </div>
                  ) : (
                    report.crossChartAspects.map((asp, i) => {
                      const aspectColor = asp.aspectType === 'trine' ? 'border-emerald-500/20 bg-emerald-500/5' :
                        asp.aspectType === 'conjunction' ? 'border-blue-500/20 bg-blue-500/5' :
                        asp.aspectType === 'square' ? 'border-red-500/20 bg-red-500/5' :
                        'border-orange-500/20 bg-orange-500/5';
                      return (
                        <div key={i} className={`rounded-xl border p-4 ${aspectColor}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-gold-light font-bold text-sm">
                              {planetName(asp.planet1.id)} ({asp.planet1.chart === 'chart1' ? (p1.name || lbl.partner1) : (p2.name || lbl.partner2)})
                            </span>
                            <span className="text-text-secondary text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-gold-primary/10 border border-gold-primary/20">
                              {asp.aspectType}
                            </span>
                            <span className="text-gold-light font-bold text-sm">
                              {planetName(asp.planet2.id)} ({asp.planet2.chart === 'chart1' ? (p1.name || lbl.partner1) : (p2.name || lbl.partner2)})
                            </span>
                          </div>
                          <p className="text-text-primary text-sm leading-relaxed">{asp.interpretation}</p>
                        </div>
                      );
                    })
                  )}
                </motion.div>
              )}

              {/* 7th House */}
              {activeTab === '7th' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{lbl.seventhTitle}</h3>

                  {[
                    { label: p1.name || lbl.partner1, info: report.seventhHouseAnalysis.chart1, color: 'border-blue-500/20' },
                    { label: p2.name || lbl.partner2, info: report.seventhHouseAnalysis.chart2, color: 'border-pink-500/20' },
                  ].map(({ label, info, color }) => (
                    <div key={label} className={`rounded-xl border ${color} bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4`}>
                      <div className="text-gold-light font-bold mb-3" style={headingFont}>{label}</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        <div>
                          <span className="text-gold-dark text-xs uppercase block">{lbl.sign}</span>
                          <span className="text-text-primary text-sm font-bold">{signName(info.sign)}</span>
                        </div>
                        <div>
                          <span className="text-gold-dark text-xs uppercase block">{lbl.lord}</span>
                          <span className="text-text-primary text-sm font-bold">{planetName(info.lord)}</span>
                        </div>
                        <div>
                          <span className="text-gold-dark text-xs uppercase block">{lbl.lordPlacement}</span>
                          <span className="text-text-primary text-sm font-bold">{`${lbl.housePrefix} ${info.lordHouse}`}</span>
                        </div>
                        <div>
                          <span className="text-gold-dark text-xs uppercase block">{lbl.planetsIn7th}</span>
                          <span className="text-text-primary text-sm font-bold">
                            {info.planetsIn7th.length > 0 ? info.planetsIn7th.map(id => planetName(id)).join(', ') : lbl.none}
                          </span>
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{info.interpretation}</p>
                    </div>
                  ))}

                  <div className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                    <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">{lbl.compatibility}</div>
                    <p className="text-text-primary text-sm leading-relaxed">{report.seventhHouseAnalysis.compatibility}</p>
                  </div>
                </motion.div>
              )}

              {/* Venus */}
              {activeTab === 'venus' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{lbl.venusTitle}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: p1.name || lbl.partner1, sign: report.venusAnalysis.chart1VenusSign, house: report.venusAnalysis.chart1VenusHouse },
                      { label: p2.name || lbl.partner2, sign: report.venusAnalysis.chart2VenusSign, house: report.venusAnalysis.chart2VenusHouse },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                        <div className="text-gold-light font-bold mb-3" style={headingFont}>{item.label}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-gold-dark text-xs uppercase block">{lbl.venusSign}</span>
                            <span className="text-text-primary text-sm font-bold">{signName(item.sign)}</span>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs uppercase block">{lbl.venusHouse}</span>
                            <span className="text-text-primary text-sm font-bold">{`${lbl.housePrefix} ${item.house}`}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4">
                    <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">{lbl.compatibility}</div>
                    <p className="text-text-primary text-sm leading-relaxed">{report.venusAnalysis.compatibility}</p>
                  </div>
                </motion.div>
              )}

              {/* Summary */}
              {activeTab === 'summary' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>{lbl.summaryTitle}</h3>

                  {/* Strengths */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-3">{lbl.strengths}</div>
                    <ul className="space-y-2">
                      {report.narrativeSummary.strengths.map((s, i) => (
                        <li key={i} className="text-text-primary text-sm flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5 flex-shrink-0">&#10003;</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Challenges */}
                  {report.narrativeSummary.challenges.length > 0 && (
                    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                      <div className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-3">{lbl.challenges}</div>
                      <ul className="space-y-2">
                        {report.narrativeSummary.challenges.map((c, i) => (
                          <li key={i} className="text-text-primary text-sm flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5 flex-shrink-0">!</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Advice */}
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <div className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-3">{lbl.advice}</div>
                    <ul className="space-y-2">
                      {report.narrativeSummary.advice.map((a, i) => (
                        <li key={i} className="text-text-primary text-sm flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5 flex-shrink-0">&#8594;</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Overall Narrative */}
                  <div className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5">
                    <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">{lbl.overallNarrative}</div>
                    {report.narrativeSummary.overallNarrative.split('\n\n').map((para, i) => (
                      <p key={i} className="text-text-primary text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <PrintButton
                contentRef={reportRef}
                title={lbl.printTitle}
                label={lbl.printLabel}
              />
              <button
                onClick={() => { setReport(null); setError(null); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-primary/20 bg-gold-primary/10 text-gold-light text-sm font-medium hover:bg-gold-primary/20 transition-colors"
              >
                {lbl.newAnalysis}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
