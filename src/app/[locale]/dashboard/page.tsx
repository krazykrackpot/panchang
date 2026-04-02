'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Star, Moon, TrendingUp, AlertTriangle,
  ArrowRight, Loader2, Calendar, Settings, Eye,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { computePersonalizedDay } from '@/lib/personalization/personal-panchang';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import ChartNorth from '@/components/kundali/ChartNorth';
import type { Locale } from '@/types/panchang';
import type { PersonalizedDay, UserSnapshot } from '@/lib/personalization/types';
import type { ChartData } from '@/types/kundali';

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
    from: 'From',
    to: 'To',
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
    from: 'से',
    to: 'तक',
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
    from: 'आरभ्य',
    to: 'पर्यन्तम्',
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

  const [loading, setLoading] = useState(true);
  const [personalizedDay, setPersonalizedDay] = useState<PersonalizedDay | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [hasBirthData, setHasBirthData] = useState(false);

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
      const panchangData = panchangRes.ok ? await panchangRes.json() : null;

      // Extract today's nakshatra and moon sign from panchang
      const todayNakshatra = panchangData?.nakshatra?.id || 1;
      const todayMoonSign = panchangData?.moonSign || 1;

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
            className="p-8 rounded-2xl border border-gold-primary/20 bg-bg-secondary/50 backdrop-blur-sm"
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
            className="p-8 rounded-2xl border border-gold-primary/20 bg-bg-secondary/50 backdrop-blur-sm"
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
          className="mb-8 p-6 rounded-2xl border border-gold-primary/20 bg-gradient-to-r from-gold-primary/10 to-transparent backdrop-blur-sm"
        >
          <h2 className="text-xl md:text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            {L.welcome}, {displayName || user?.email?.split('@')[0] || ''}
          </h2>
          {pd.currentDasha && (
            <p className="text-text-secondary mt-1">
              {L.mahadasha}{' '}
              <span className="text-gold-light font-semibold">
                {pd.currentDasha.maha.planetName[locale] || pd.currentDasha.maha.planetName.en}
              </span>{' '}
              {L.mahadashaOf}
            </p>
          )}
        </motion.div>

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
            className="p-6 rounded-2xl border border-gold-primary/15 bg-bg-secondary/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.taraBala}</h3>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
                {pd.taraBala.taraName[locale] || pd.taraBala.taraName.en}
              </span>
              <span className="text-text-secondary text-sm">
                ({L.tara} #{pd.taraBala.taraNumber})
              </span>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pd.taraBala.isFavorable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {pd.taraBala.isFavorable ? L.favorable : L.unfavorable}
            </span>
            <p className="text-text-secondary text-sm mt-3">
              {pd.taraBala.description[locale] || pd.taraBala.description.en}
            </p>
          </motion.div>

          {/* Chandra Bala */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.25 }}
            className="p-6 rounded-2xl border border-gold-primary/15 bg-bg-secondary/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.chandraBala}</h3>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
                {L.houseFromMoon}: {pd.chandraBala.houseFromMoon}
              </span>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pd.chandraBala.isFavorable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {pd.chandraBala.isFavorable ? L.favorable : L.unfavorable}
            </span>
            <p className="text-text-secondary text-sm mt-3">
              {pd.chandraBala.description[locale] || pd.chandraBala.description.en}
            </p>
          </motion.div>
        </div>

        {/* Current Dasha Card */}
        {pd.currentDasha && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-bg-secondary/50 backdrop-blur-sm"
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

        {/* Transit Alerts */}
        {pd.transitAlerts.length > 0 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.35 }}
            className="mb-8 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-text-primary">{L.transitAlerts}</h3>
            </div>
            <div className="space-y-3">
              {pd.transitAlerts.map((alert, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border ${
                    alert.severity === 'significant' ? 'border-red-500/30 bg-red-500/10' :
                    alert.severity === 'notable' ? 'border-amber-500/30 bg-amber-500/10' :
                    'border-slate-400/20 bg-slate-400/5'
                  }`}
                >
                  <p className="text-sm text-text-primary">
                    {alert.description[locale] || alert.description.en}
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
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-bg-secondary/50 backdrop-blur-sm"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/kundali' as const, label: L.fullChart, icon: Eye },
              { href: '/sade-sati' as const, label: L.sadeSati, icon: TrendingUp },
              { href: '/settings' as const, label: L.settings, icon: Settings },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-gold-primary/15 bg-bg-secondary/50 hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
              >
                <link.icon className="w-5 h-5 text-gold-primary" />
                <span className="text-text-secondary group-hover:text-gold-light transition-colors text-sm font-medium">
                  {link.label}
                </span>
                <ArrowRight className="w-4 h-4 text-text-secondary/40 group-hover:text-gold-light ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
