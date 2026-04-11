'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Star, Moon, TrendingUp, AlertTriangle,
  ArrowRight, Loader2, Calendar, Settings, Eye, Compass, Globe, Shield, Clock, Flame,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { computePersonalizedDay } from '@/lib/personalization/personal-panchang';
import { computeGochar } from '@/lib/personalization/gochar';
import { computeTransitAlerts } from '@/lib/personalization/transit-alerts';
import { scoreFestivalRelevance } from '@/lib/personalization/festival-relevance';
import type { GocharResult } from '@/lib/personalization/gochar';
import type { PersonalFestival } from '@/lib/personalization/festival-relevance';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import EclipseAlert from '@/components/dashboard/EclipseAlert';
import FestivalCountdown from '@/components/dashboard/FestivalCountdown';
import MorningBriefing from '@/components/dashboard/MorningBriefing';
import WeekAhead from '@/components/dashboard/WeekAhead';
import DashaTransitionAlert from '@/components/dashboard/DashaTransitionAlert';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { checkBadges } from '@/lib/learn/badges';
import LevelBadge from '@/components/learn/LevelBadge';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import ChartNorth from '@/components/kundali/ChartNorth';
import type { Locale, PanchangData } from '@/types/panchang';
import type { PersonalizedDay, UserSnapshot, TransitAlert } from '@/lib/personalization/types';
import type { ChartData, DashaEntry } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: 'My Dashboard',
    subtitle: 'Your personalized Vedic astrology overview',
    loading: 'Loading your cosmic profile...',
    notSignedIn: 'Sign in to see your personalized dashboard',
    signIn: 'Sign In',
    noBirthData: 'Set up your birth details to unlock personalized insights',
    setupProfile: 'Set Up Profile',
    welcome: 'Welcome back',
    mahadasha: 'You are in',
    mahadashaOf: 'Mahadasha',
    todayQuality: "Today's Quality",
    taraBala: 'Tara Bala',
    chandraBala: 'Chandra Bala',
    tara: 'Tara',
    houseFromMoon: 'House from Moon',
    favorable: 'Favorable',
    unfavorable: 'Unfavorable',
    currentDasha: 'Current Dasha',
    mahadashaLabel: 'Mahadasha',
    antardashaLabel: 'Antardasha',
    progress: 'Progress',
    birthChart: 'Your Birth Chart (D1)',
    transitAlerts: 'Transit Alerts',
    noAlerts: 'No significant transit alerts at this time',
    quickLinks: 'Quick Links',
    fullChart: 'Full Birth Chart',
    sadeSati: 'Sade Sati Check',
    settings: 'Edit Profile',
    transitAnalysis: 'Transit Analysis',
    yourRemedies: 'Your Remedies',
    from: 'From',
    to: 'To',
    gocharTitle: 'Gochar (Planetary Transits)',
    gocharSubtitle: 'Current planetary positions relative to your birth chart',
    planet: 'Planet',
    transitSignCol: 'Transit Sign',
    yourHouse: 'Your House',
    effectCol: 'Effect',
    retrograde: 'R',
    enhancedAlerts: 'Transit Alerts',
    recommendedFestivals: 'Recommended Festivals',
    recommendedFestivalsSubtitle: 'Festivals most relevant to your chart',
    relevance: 'Relevance',
    positive: 'Positive',
    mixed: 'Mixed',
    streakTitle: 'Learning Streak',
    dayStreak: 'Day Streak',
    longestStreak: 'Longest',
    days: 'days',
    todayActive: 'Today: Active',
    todayVisitLearn: 'Visit Learn to keep your streak!',
    goToLearn: 'Go to Learn',
    startStreak: 'Start a learning streak today!',
  },
  hi: {
    title: 'मेरा डैशबोर्ड',
    subtitle: 'आपका व्यक्तिगत वैदिक ज्योतिष अवलोकन',
    loading: 'आपकी ब्रह्माण्डीय प्रोफ़ाइल लोड हो रही है...',
    notSignedIn: 'अपना व्यक्तिगत डैशबोर्ड देखने के लिए साइन इन करें',
    signIn: 'साइन इन',
    noBirthData: 'व्यक्तिगत अंतर्दृष्टि के लिए अपना जन्म विवरण सेट करें',
    setupProfile: 'प्रोफ़ाइल सेट करें',
    welcome: 'पुनः स्वागत है',
    mahadasha: 'आप',
    mahadashaOf: 'महादशा में हैं',
    todayQuality: 'आज की गुणवत्ता',
    taraBala: 'तारा बल',
    chandraBala: 'चन्द्र बल',
    tara: 'तारा',
    houseFromMoon: 'चन्द्र से भाव',
    favorable: 'शुभ',
    unfavorable: 'अशुभ',
    currentDasha: 'वर्तमान दशा',
    mahadashaLabel: 'महादशा',
    antardashaLabel: 'अन्तर्दशा',
    progress: 'प्रगति',
    birthChart: 'आपकी जन्म कुण्डली (D1)',
    transitAlerts: 'गोचर सूचनाएँ',
    noAlerts: 'इस समय कोई महत्वपूर्ण गोचर सूचना नहीं',
    quickLinks: 'त्वरित लिंक',
    fullChart: 'पूर्ण जन्म कुण्डली',
    sadeSati: 'साढ़े साती जाँच',
    settings: 'प्रोफ़ाइल संपादित करें',
    transitAnalysis: 'गोचर विश्लेषण',
    yourRemedies: 'आपके उपाय',
    from: 'से',
    to: 'तक',
    gocharTitle: 'गोचर (ग्रह गोचर)',
    gocharSubtitle: 'आपकी जन्म कुण्डली के सापेक्ष वर्तमान ग्रह स्थितियाँ',
    planet: 'ग्रह',
    transitSignCol: 'गोचर राशि',
    yourHouse: 'आपका भाव',
    effectCol: 'प्रभाव',
    retrograde: 'व',
    enhancedAlerts: 'गोचर सूचनाएँ',
    recommendedFestivals: 'अनुशंसित त्योहार',
    recommendedFestivalsSubtitle: 'आपकी कुण्डली के अनुसार सर्वाधिक प्रासंगिक त्योहार',
    relevance: 'प्रासंगिकता',
    positive: 'शुभ',
    mixed: 'मिश्र',
    streakTitle: 'शिक्षा लय',
    dayStreak: 'दिन की लय',
    longestStreak: 'सर्वोच्च',
    days: 'दिन',
    todayActive: 'आज: सक्रिय',
    todayVisitLearn: 'अपनी लय बनाए रखने के लिए शिक्षा पर जाएँ!',
    goToLearn: 'शिक्षा पर जाएँ',
    startStreak: 'आज शिक्षा लय शुरू करें!',
  },
  sa: {
    title: 'मम पटलम्',
    subtitle: 'भवतः व्यक्तिगतं वैदिकज्योतिषावलोकनम्',
    loading: 'भवतः ब्रह्माण्डीयं प्रोफ़ाइलं लोड् भवति...',
    notSignedIn: 'स्वव्यक्तिगतं पटलं द्रष्टुं साइन इन कुर्वन्तु',
    signIn: 'साइन इन',
    noBirthData: 'व्यक्तिगतान्तर्दृष्ट्यर्थं जन्मविवरणं स्थापयतु',
    setupProfile: 'प्रोफ़ाइलं स्थापयतु',
    welcome: 'पुनः स्वागतम्',
    mahadasha: 'भवान्',
    mahadashaOf: 'महादशायां वर्तते',
    todayQuality: 'अद्य गुणः',
    taraBala: 'तारा बलम्',
    chandraBala: 'चन्द्र बलम्',
    tara: 'तारा',
    houseFromMoon: 'चन्द्रात् भावः',
    favorable: 'शुभम्',
    unfavorable: 'अशुभम्',
    currentDasha: 'वर्तमानदशा',
    mahadashaLabel: 'महादशा',
    antardashaLabel: 'अन्तर्दशा',
    progress: 'प्रगतिः',
    birthChart: 'भवतः जन्मकुण्डली (D1)',
    transitAlerts: 'गोचरसूचनाः',
    noAlerts: 'अस्मिन् समये महत्त्वपूर्णा गोचरसूचना नास्ति',
    quickLinks: 'त्वरितसम्पर्काः',
    fullChart: 'पूर्णा जन्मकुण्डली',
    sadeSati: 'साढ़ेसाती परीक्षा',
    settings: 'प्रोफ़ाइलसम्पादनम्',
    transitAnalysis: 'गोचरविश्लेषणम्',
    yourRemedies: 'भवतः उपायाः',
    from: 'आरभ्य',
    to: 'पर्यन्तम्',
    gocharTitle: 'गोचरः (ग्रहगोचरः)',
    gocharSubtitle: 'भवतः जन्मकुण्डल्याः सापेक्षं वर्तमानग्रहस्थितयः',
    planet: 'ग्रहः',
    transitSignCol: 'गोचरराशिः',
    yourHouse: 'भवतः भावः',
    effectCol: 'प्रभावः',
    retrograde: 'व',
    enhancedAlerts: 'गोचरसूचनाः',
    recommendedFestivals: 'अनुशंसिताः उत्सवाः',
    recommendedFestivalsSubtitle: 'भवतः कुण्डल्यनुसारं सर्वाधिकप्रासंगिकाः उत्सवाः',
    relevance: 'प्रासंगिकता',
    positive: 'शुभम्',
    mixed: 'मिश्रम्',
    streakTitle: 'शिक्षालयः',
    dayStreak: 'दिनलयः',
    longestStreak: 'सर्वोच्चम्',
    days: 'दिनानि',
    todayActive: 'अद्य: सक्रियम्',
    todayVisitLearn: 'स्वलयं रक्षितुं शिक्षां गच्छतु!',
    goToLearn: 'शिक्षां गच्छतु',
    startStreak: 'अद्य शिक्षालयं आरभतु!',
  },
};

// ---------------------------------------------------------------------------
// Quality color mapping
// ---------------------------------------------------------------------------
const QUALITY_COLORS: Record<PersonalizedDay['dayQuality'], { bg: string; border: string; text: string; glow: string }> = {
  excellent: { bg: 'from-emerald-500/20 to-emerald-700/10', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  good: { bg: 'from-gold-primary/20 to-gold-primary/10', border: 'border-gold-primary/40', text: 'text-gold-light', glow: 'shadow-gold-primary/20' },
  neutral: { bg: 'from-slate-400/15 to-slate-500/10', border: 'border-slate-400/30', text: 'text-text-secondary', glow: 'shadow-slate-400/10' },
  caution: { bg: 'from-amber-500/20 to-amber-700/10', border: 'border-amber-500/40', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  challenging: { bg: 'from-red-500/20 to-red-700/10', border: 'border-red-500/40', text: 'text-red-400', glow: 'shadow-red-500/20' },
};

const QUALITY_LABEL: Record<PersonalizedDay['dayQuality'], { en: string; hi: string; sa: string }> = {
  excellent: { en: 'Excellent', hi: 'उत्कृष्ट', sa: 'उत्कृष्टम्' },
  good: { en: 'Good', hi: 'शुभ', sa: 'शुभम्' },
  neutral: { en: 'Neutral', hi: 'सामान्य', sa: 'सामान्यम्' },
  caution: { en: 'Caution', hi: 'सावधान', sa: 'सावधानम्' },
  challenging: { en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'आह्वानपूर्णम्' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const L = LABELS[locale] || LABELS.en;
  const { user, initialized } = useAuthStore();

  // Learning streak & badges
  const { streak, isActiveToday, hydrateFromStorage: hydrateLearn, hydrated: learnHydrated, progress: learnProgress, getOverallProgress: getLearnOverall } = useLearningProgressStore();

  useEffect(() => { hydrateLearn(); }, [hydrateLearn]);

  const [loading, setLoading] = useState(true);
  const [personalizedDay, setPersonalizedDay] = useState<PersonalizedDay | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [gocharResults, setGocharResults] = useState<GocharResult[]>([]);
  const [enhancedAlerts, setEnhancedAlerts] = useState<TransitAlert[]>([]);
  const [recommendedFestivals, setRecommendedFestivals] = useState<PersonalFestival[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [hasBirthData, setHasBirthData] = useState(false);
  const [ascendantSign, setAscendantSign] = useState<number>(0);
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [dashaTimeline, setDashaTimeline] = useState<DashaEntry[]>([]);

  const loadDashboard = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch profile + snapshot
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;

      const { profile, snapshot } = await res.json();
      setDisplayName(profile?.display_name || user.user_metadata?.name || '');

      if (!snapshot || !snapshot.moon_sign) {
        setHasBirthData(false);
        setLoading(false);
        return;
      }
      setHasBirthData(true);
      setAscendantSign(snapshot.ascendant_sign || 0);

      // Fetch full snapshot (with JSONB fields) for dasha + chart
      const { data: fullSnap } = await supabase
        .from('kundali_snapshots')
        .select('planet_positions, dasha_timeline, sade_sati, chart_data')
        .eq('user_id', user.id)
        .single();

      // Fetch today's panchang
      const lat = profile?.birth_lat || 28.6139;
      const lng = profile?.birth_lng || 77.209;
      const panchangRes = await fetch(`/api/panchang?lat=${lat}&lng=${lng}`);
      const fetchedPanchang = panchangRes.ok ? await panchangRes.json() : null;
      if (fetchedPanchang) setPanchangData(fetchedPanchang as PanchangData);

      // Extract today's nakshatra and moon sign from panchang
      const todayNakshatra = fetchedPanchang?.nakshatra?.id || 1;
      const todayMoonSign = fetchedPanchang?.moonSign?.rashi || fetchedPanchang?.moonSign || 1;

      // Build UserSnapshot
      const userSnapshot: UserSnapshot = {
        moonSign: snapshot.moon_sign,
        moonNakshatra: snapshot.moon_nakshatra,
        moonNakshatraPada: snapshot.moon_nakshatra_pada,
        sunSign: snapshot.sun_sign,
        ascendantSign: snapshot.ascendant_sign,
        planetPositions: fullSnap?.planet_positions || [],
        dashaTimeline: fullSnap?.dasha_timeline || [],
        sadeSati: fullSnap?.sade_sati || {},
      };

      // Compute personalized day
      const result = computePersonalizedDay(userSnapshot, todayNakshatra, todayMoonSign);
      setPersonalizedDay(result);

      // Set chart data
      if (fullSnap?.chart_data) {
        setChartData(fullSnap.chart_data as ChartData);
      }

      // Set dasha timeline for transition alerts
      if (fullSnap?.dasha_timeline) {
        setDashaTimeline(fullSnap.dasha_timeline as DashaEntry[]);
      }

      // Compute Gochar (transit overlay)
      try {
        const gochar = computeGochar(userSnapshot.ascendantSign, userSnapshot.moonSign);
        setGocharResults(gochar);
      } catch { /* gochar computation is non-critical */ }

      // Compute enhanced transit alerts
      try {
        const alerts = computeTransitAlerts(userSnapshot);
        setEnhancedAlerts(alerts);
      } catch { /* transit alerts are non-critical */ }

      // Score festival relevance
      try {
        const festivalSlugs = [
          { slug: 'maha-shivaratri', category: 'shiva' },
          { slug: 'hanuman-jayanti', category: 'mars' },
          { slug: 'guru-purnima', category: 'jupiter' },
          { slug: 'vasant-panchami', category: 'venus' },
          { slug: 'makar-sankranti', category: 'sun' },
          { slug: 'karva-chauth', category: 'moon' },
          { slug: 'ganesh-chaturthi', category: 'ketu' },
          { slug: 'pradosham', category: 'shiva' },
          { slug: 'chhath-puja', category: 'sun' },
          { slug: 'nag-panchami', category: 'rahu' },
        ];
        const scored = festivalSlugs
          .map(f => scoreFestivalRelevance(f.slug, f.category, userSnapshot))
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 5);
        setRecommendedFestivals(scored);
      } catch { /* festival scoring is non-critical */ }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialized && user) {
      loadDashboard();
    } else if (initialized && !user) {
      setLoading(false);
    }
  }, [initialized, user, loadDashboard]);

  // Not signed in
  if (initialized && !user) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <LayoutDashboard className="w-12 h-12 text-gold-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {L.notSignedIn}
            </h1>
            <button
              onClick={() => router.push(`/${locale}/settings`)}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              {L.signIn}
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold-primary animate-spin mx-auto mb-3" />
          <p className="text-text-secondary">{L.loading}</p>
        </div>
      </main>
    );
  }

  // No birth data
  if (!hasBirthData) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <Calendar className="w-12 h-12 text-gold-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {L.noBirthData}
            </h1>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              {L.setupProfile}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const pd = personalizedDay;
  if (!pd) return null;

  const qc = QUALITY_COLORS[pd.dayQuality];
  const ql = QUALITY_LABEL[pd.dayQuality];
  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  // Compute dasha progress percentage
  let mahaProgress = 0;
  let antarProgress = 0;
  if (pd.currentDasha) {
    const now = Date.now();
    const mahaStart = new Date(pd.currentDasha.maha.startDate).getTime();
    const mahaEnd = new Date(pd.currentDasha.maha.endDate).getTime();
    mahaProgress = Math.min(100, Math.max(0, ((now - mahaStart) / (mahaEnd - mahaStart)) * 100));
    if (pd.currentDasha.antar) {
      const aStart = new Date(pd.currentDasha.antar.startDate).getTime();
      const aEnd = new Date(pd.currentDasha.antar.endDate).getTime();
      antarProgress = Math.min(100, Math.max(0, ((now - aStart) / (aEnd - aStart)) * 100));
    }
  }

  // Helper to find planet name by key
  const getPlanetName = (key: string) => {
    const g = GRAHAS.find((g) => g.name.en.toLowerCase() === key.toLowerCase());
    return g?.name?.[locale] || key;
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div {...fadeUp} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {L.title}
          </h1>
          <p className="text-text-secondary">{L.subtitle}</p>
        </motion.div>

        {/* Welcome Banner */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="mb-6 px-6 py-4 rounded-2xl border border-gold-primary/15 bg-gradient-to-r from-gold-primary/[0.04] via-transparent to-gold-primary/[0.04] backdrop-blur-sm"
        >
          <p className="text-xs uppercase tracking-widest text-text-secondary/70 mb-1">{L.welcome}</p>
          <h2 className="text-xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
            {displayName || user?.email?.split('@')[0] || ''}
          </h2>
          {pd.currentDasha && (
            <p className="text-text-secondary/70 text-sm mt-1">
              {L.mahadasha}{' '}
              <span className="text-gold-primary font-semibold">
                {pd.currentDasha.maha.planetName[locale] || pd.currentDasha.maha.planetName.en}
              </span>{' '}
              {L.mahadashaOf}
            </p>
          )}
        </motion.div>

        {/* Morning Briefing — today's cosmic weather at a glance */}
        {panchangData && (
          <MorningBriefing
            panchangData={panchangData}
            personalizedDay={pd}
            locale={locale}
          />
        )}

        {/* Your Week Ahead — 7-day Moon transit forecast */}
        <WeekAhead
          ascendantSign={ascendantSign}
          locale={locale}
          hasBirthData={hasBirthData}
        />

        {/* Learning Streak Card */}
        {learnHydrated && (streak.streakDays > 0 || streak.longestStreak > 0) && (() => {
          const learnOverall = getLearnOverall();
          const { earned: earnedBadges } = checkBadges(learnProgress, streak);
          return (
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.12 }}
              className="mb-6 p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.06] via-transparent to-amber-500/[0.06] backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: Math.min(3, streak.streakDays >= 14 ? 3 : streak.streakDays >= 7 ? 2 : 1) }, (_, i) => (
                      <Flame key={i} className={`w-5 h-5 ${streak.streakDays > 0 ? 'text-amber-400 fill-amber-400/60' : 'text-text-secondary/30'}`} />
                    ))}
                  </div>
                  <div>
                    <span className="text-xl font-bold text-amber-400">
                      {streak.streakDays}
                    </span>
                    <span className="text-sm text-text-secondary ml-1.5">{L.dayStreak}</span>
                    {streak.longestStreak > streak.streakDays && (
                      <span className="text-xs text-text-secondary/60 ml-3">
                        {L.longestStreak}: {streak.longestStreak} {L.days}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isActiveToday() ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400">
                      {L.todayActive}
                    </span>
                  ) : (
                    <Link
                      href="/learn"
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
                    >
                      {L.todayVisitLearn}
                    </Link>
                  )}
                </div>
              </div>

              {/* Level badge */}
              {learnOverall.mastered > 0 && (
                <div className="mt-4 pt-3 border-t border-amber-500/10">
                  <LevelBadge masteredCount={learnOverall.mastered} locale={locale} variant="full" />
                </div>
              )}

              {/* Recently earned badges */}
              {earnedBadges.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-500/10">
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-2">
                    {locale === 'en' ? 'Badges Earned' : locale === 'hi' ? 'अर्जित बैज' : 'अर्जिताः बैजाः'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {earnedBadges.map(badge => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold-primary/8 border border-gold-primary/15"
                        title={locale !== 'en' ? badge.description.hi : badge.description.en}
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-[11px] text-text-primary font-medium">
                          {locale !== 'en' ? badge.label.hi : badge.label.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })()}

        {/* Day Quality Card */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.15 }}
          className={`mb-8 p-6 md:p-8 rounded-2xl border ${qc.border} bg-gradient-to-br ${qc.bg} backdrop-blur-sm shadow-lg ${qc.glow}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Star className={`w-6 h-6 ${qc.text}`} />
            <h3 className="text-lg font-semibold text-text-secondary">{L.todayQuality}</h3>
          </div>
          <p className={`text-3xl md:text-4xl font-bold ${qc.text} mb-2`} style={{ fontFamily: 'var(--font-heading)' }}>
            {ql[locale] || ql.en}
          </p>
          <p className="text-text-secondary text-sm md:text-base">
            {pd.dayQualityDescription[locale] || pd.dayQualityDescription.en}
          </p>
        </motion.div>

        {/* Tara Bala + Chandra Bala — side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tara Bala */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.taraBala}</h3>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl bg-bg-secondary/60 border border-gold-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-gold-light">{pd.taraBala.taraNumber}</span>
              </div>
              <div>
                <p className="text-gold-light font-semibold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                  {pd.taraBala.taraName[locale] || pd.taraBala.taraName.en}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${pd.taraBala.isFavorable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {pd.taraBala.isFavorable ? L.favorable : L.unfavorable}
                </span>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {pd.taraBala.description[locale] || pd.taraBala.description.en}
            </p>
          </motion.div>

          {/* Chandra Bala */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.25 }}
            className="p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.chandraBala}</h3>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl bg-bg-secondary/60 border border-gold-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-gold-light">{pd.chandraBala.houseFromMoon || '—'}</span>
              </div>
              <div>
                <p className="text-text-secondary/75 text-xs">{L.houseFromMoon}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${pd.chandraBala.isFavorable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {pd.chandraBala.isFavorable ? L.favorable : L.unfavorable}
                </span>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {pd.chandraBala.description[locale] || pd.chandraBala.description.en}
            </p>
          </motion.div>
        </div>

        {/* Current Dasha Card */}
        {pd.currentDasha && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.currentDasha}</h3>
            </div>

            {/* Mahadasha */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{L.mahadashaLabel}</span>
                  <span className="text-lg font-bold text-gold-light">
                    {getPlanetName(pd.currentDasha.maha.planet)}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">
                  {new Date(pd.currentDasha.maha.startDate).toLocaleDateString()} - {new Date(pd.currentDasha.maha.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="w-full h-2 bg-bg-primary/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mahaProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' as const }}
                  className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">{L.progress}: {mahaProgress.toFixed(1)}%</p>
            </div>

            {/* Antardasha */}
            {pd.currentDasha.antar && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{L.antardashaLabel}</span>
                    <span className="text-lg font-bold text-gold-light">
                      {getPlanetName(pd.currentDasha.antar.planet)}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {new Date(pd.currentDasha.antar.startDate).toLocaleDateString()} - {new Date(pd.currentDasha.antar.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-bg-primary/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${antarProgress}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' as const }}
                    className="h-full bg-gradient-to-r from-gold-primary/70 to-gold-light/70 rounded-full"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">{L.progress}: {antarProgress.toFixed(1)}%</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Gochar (Transit Overlay) */}
        {gocharResults.length > 0 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.33 }}
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.gocharTitle}</h3>
            </div>
            <p className="text-text-secondary text-xs mb-4">{L.gocharSubtitle}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-primary/15">
                    <th className="text-left text-gold-dark text-xs uppercase tracking-wider py-2 pr-3">{L.planet}</th>
                    <th className="text-left text-gold-dark text-xs uppercase tracking-wider py-2 pr-3">{L.transitSignCol}</th>
                    <th className="text-center text-gold-dark text-xs uppercase tracking-wider py-2 pr-3">{L.yourHouse}</th>
                    <th className="text-left text-gold-dark text-xs uppercase tracking-wider py-2">{L.effectCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {gocharResults.map((g) => (
                    <tr key={g.planetId} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                      <td className="py-2.5 pr-3">
                        <span className="text-text-primary font-medium">{g.planetName[locale] || g.planetName.en}</span>
                        {g.isRetrograde && <span className="ml-1 text-red-400 text-xs font-bold">({L.retrograde})</span>}
                      </td>
                      <td className="py-2.5 pr-3 text-gold-light">{g.transitSignName[locale] || g.transitSignName.en}</td>
                      <td className="py-2.5 pr-3 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${g.isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                          {g.natalHouse}
                        </span>
                      </td>
                      <td className="py-2.5 text-text-secondary text-xs">{g.effect[locale] || g.effect.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Dasha Transition Alert — upcoming maha/antar dasha changes */}
        {dashaTimeline.length > 0 && (
          <DashaTransitionAlert
            dashaTimeline={dashaTimeline}
            locale={locale}
          />
        )}

        {/* Upcoming Eclipse Alert */}
        <EclipseAlert />

        {/* Upcoming Festival Countdown */}
        <FestivalCountdown />

        {/* Enhanced Transit Alerts */}
        {(enhancedAlerts.length > 0 || pd.transitAlerts.length > 0) && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.35 }}
            className="mb-8 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-text-primary">{L.enhancedAlerts}</h3>
            </div>
            <div className="space-y-3">
              {/* Show enhanced alerts first, then fall back to basic ones */}
              {(enhancedAlerts.length > 0 ? enhancedAlerts : pd.transitAlerts).map((alert, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border ${
                    alert.severity === 'significant' ? 'border-red-500/30 bg-red-500/10' :
                    alert.severity === 'notable' ? 'border-amber-500/30 bg-amber-500/10' :
                    'border-blue-500/20 bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                      alert.severity === 'significant' ? 'bg-red-400' :
                      alert.severity === 'notable' ? 'bg-amber-400' :
                      'bg-blue-400'
                    }`} />
                    <p className="text-sm text-text-primary">
                      {alert.description[locale] || alert.description.en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommended Festivals */}
        {recommendedFestivals.length > 0 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.37 }}
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.recommendedFestivals}</h3>
            </div>
            <p className="text-text-secondary text-xs mb-4">{L.recommendedFestivalsSubtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendedFestivals.map((f) => (
                <div
                  key={f.festivalSlug}
                  className={`p-4 rounded-xl border ${f.isRecommended ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-gold-primary/10 bg-bg-primary/30'} transition-colors`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary font-semibold text-sm capitalize">
                      {f.festivalSlug.replace(/-/g, ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      f.relevanceScore >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                      f.relevanceScore >= 50 ? 'bg-gold-primary/20 text-gold-light' :
                      'bg-slate-500/15 text-text-secondary'
                    }`}>
                      {f.relevanceScore}%
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {f.relevanceReason[locale] || f.relevanceReason.en}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Birth Chart */}
        {chartData && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.4 }}
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.birthChart}</h3>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <ChartNorth data={chartData} title={L.birthChart} size={400} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Links */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">{L.quickLinks}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: '/dashboard/chart' as const, label: locale === 'en' ? 'Birth Chart' : 'जन्म कुण्डली', icon: Eye },
              { href: '/dashboard/dashas' as const, label: locale === 'en' ? 'Dasha Timeline' : 'दशा समयरेखा', icon: TrendingUp },
              { href: '/dashboard/muhurta' as const, label: locale === 'en' ? 'Personal Muhurta' : 'व्यक्तिगत मुहूर्त', icon: Clock },
              { href: '/dashboard/transits' as const, label: L.transitAnalysis, icon: Globe },
              { href: '/dashboard/remedies' as const, label: L.yourRemedies, icon: Shield },
              { href: '/dashboard/saved-charts' as const, label: locale === 'en' ? 'Saved Charts' : 'सहेजे गए चार्ट', icon: Star },
              { href: '/sade-sati' as const, label: L.sadeSati, icon: TrendingUp },
              { href: '/settings' as const, label: L.settings, icon: Settings },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
              >
                <link.icon className="w-5 h-5 text-gold-primary" />
                <span className="text-text-secondary group-hover:text-gold-light transition-colors text-sm font-medium">
                  {link.label}
                </span>
                <ArrowRight className="w-4 h-4 text-text-secondary/65 group-hover:text-gold-light ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
