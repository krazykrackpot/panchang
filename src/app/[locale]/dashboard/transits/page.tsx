'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Globe, AlertTriangle } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { computeGochar } from '@/lib/personalization/gochar';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale } from '@/types/panchang';
import type { UserSnapshot } from '@/lib/personalization/types';
import type { GocharResult } from '@/lib/personalization/gochar';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: 'Your Transit Analysis',
    subtitle: 'How current planetary transits affect your birth chart',
    loading: 'Computing transit analysis...',
    notSignedIn: 'Sign in to see your transit analysis',
    signIn: 'Sign In',
    noBirthData: 'Set up your birth details to unlock transit analysis',
    setupProfile: 'Set Up Profile',
    back: 'Dashboard',
    planet: 'Planet',
    transitSign: 'Transit Sign',
    house: 'House',
    effect: 'Effect',
    positive: 'Favorable',
    negative: 'Challenging',
    mixed: 'Mixed',
    transitAlerts: 'Transit Alerts',
    noAlerts: 'No significant transit alerts at this time',
    gocharTable: 'Gochar Overview',
    sadeSatiTitle: 'Sade Sati Status',
    sadeSatiActive: 'Sade Sati is currently active',
    sadeSatiInactive: 'Sade Sati is not active',
    phase: 'Phase',
    retro: 'R',
  },
  hi: {
    title: 'आपका गोचर विश्लेषण',
    subtitle: 'वर्तमान ग्रह गोचर आपकी जन्म कुण्डली को कैसे प्रभावित कर रहे हैं',
    loading: 'गोचर विश्लेषण गणना हो रही है...',
    notSignedIn: 'अपना गोचर विश्लेषण देखने के लिए साइन इन करें',
    signIn: 'साइन इन',
    noBirthData: 'गोचर विश्लेषण के लिए अपना जन्म विवरण सेट करें',
    setupProfile: 'प्रोफ़ाइल सेट करें',
    back: 'डैशबोर्ड',
    planet: 'ग्रह',
    transitSign: 'गोचर राशि',
    house: 'भाव',
    effect: 'प्रभाव',
    positive: 'शुभ',
    negative: 'चुनौतीपूर्ण',
    mixed: 'मिश्रित',
    transitAlerts: 'गोचर सूचनाएँ',
    noAlerts: 'इस समय कोई महत्वपूर्ण गोचर सूचना नहीं',
    gocharTable: 'गोचर अवलोकन',
    sadeSatiTitle: 'साढ़े साती स्थिति',
    sadeSatiActive: 'साढ़े साती वर्तमान में सक्रिय है',
    sadeSatiInactive: 'साढ़े साती सक्रिय नहीं है',
    phase: 'चरण',
    retro: 'वक्री',
  },
  sa: {
    title: 'भवतः गोचरविश्लेषणम्',
    subtitle: 'वर्तमानग्रहगोचराः भवतः जन्मकुण्डलीं कथं प्रभावयन्ति',
    loading: 'गोचरविश्लेषणं गण्यते...',
    notSignedIn: 'स्वगोचरविश्लेषणं द्रष्टुं साइन इन कुर्वन्तु',
    signIn: 'साइन इन',
    noBirthData: 'गोचरविश्लेषणार्थं जन्मविवरणं स्थापयतु',
    setupProfile: 'प्रोफ़ाइलं स्थापयतु',
    back: 'पटலம्',
    planet: 'ग्रहः',
    transitSign: 'गोचरराशिः',
    house: 'भावः',
    effect: 'प्रभावः',
    positive: 'शुभम्',
    negative: 'आह्वानपूर्णम्',
    mixed: 'मिश्रितम्',
    transitAlerts: 'गोचरसूचनाः',
    noAlerts: 'अस्मिन् समये महत्त्वपूर्णा गोचरसूचना नास्ति',
    gocharTable: 'गोचरावलोकनम्',
    sadeSatiTitle: 'साढ़ेसातिस्थितिः',
    sadeSatiActive: 'साढ़ेसातिः वर्तमानं सक्रिया अस्ति',
    sadeSatiInactive: 'साढ़ेसातिः सक्रिया नास्ति',
    phase: 'चरणम्',
    retro: 'वक्री',
  },
  ta: {
    title: 'உங்கள் பெயர்ச்சி பகுப்பாய்வு',
    subtitle: 'தற்போதைய கிரக பெயர்ச்சிகள் உங்கள் ஜாதகத்தை எவ்வாறு பாதிக்கின்றன',
    loading: 'பெயர்ச்சி பகுப்பாய்வு கணக்கிடப்படுகிறது...',
    notSignedIn: 'உங்கள் பெயர்ச்சி பகுப்பாய்வைக் காண உள்நுழையவும்',
    signIn: 'உள்நுழை',
    noBirthData: 'பெயர்ச்சி பகுப்பாய்வுக்கு உங்கள் பிறப்பு விவரங்களை அமைக்கவும்',
    setupProfile: 'சுயவிவரத்தை அமை',
    back: 'டாஷ்போர்டு',
    planet: 'கிரகம்',
    transitSign: 'பெயர்ச்சி ராசி',
    house: 'பாவம்',
    effect: 'விளைவு',
    positive: 'சாதகமான',
    negative: 'சவாலான',
    mixed: 'கலப்பு',
    transitAlerts: 'பெயர்ச்சி எச்சரிக்கைகள்',
    noAlerts: 'இப்போது குறிப்பிடத்தக்க பெயர்ச்சி எச்சரிக்கைகள் இல்லை',
    gocharTable: 'கோசார கண்ணோட்டம்',
    sadeSatiTitle: 'சாடே சாதி நிலை',
    sadeSatiActive: 'சாடே சாதி தற்போது செயலில் உள்ளது',
    sadeSatiInactive: 'சாடே சாதி செயலில் இல்லை',
    phase: 'நிலை',
    retro: 'வக்ரம்',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TransitsPage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const L = LABELS[locale] || LABELS.en;
  const { user, initialized } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [gocharResults, setGocharResults] = useState<GocharResult[]>([]);
  const [sadeSati, setSadeSati] = useState<{ isActive?: boolean; phase?: string } | null>(null);
  const [hasBirthData, setHasBirthData] = useState(false);

  const loadTransits = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;

      const { snapshot } = await res.json();
      if (!snapshot || !snapshot.moon_sign) {
        setHasBirthData(false);
        setLoading(false);
        return;
      }
      setHasBirthData(true);

      // Fetch full snapshot
      const { data: fullSnap } = await supabase
        .from('kundali_snapshots')
        .select('sade_sati')
        .eq('user_id', user.id)
        .single();

      // Compute gochar using existing engine
      const results = computeGochar(snapshot.ascendant_sign, snapshot.moon_sign);
      setGocharResults(results);

      // Sade Sati
      if (fullSnap?.sade_sati && typeof fullSnap.sade_sati === 'object') {
        setSadeSati(fullSnap.sade_sati as { isActive?: boolean; phase?: string });
      }
    } catch (err) {
      console.error('Transit load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialized && user) {
      loadTransits();
    } else if (initialized && !user) {
      setLoading(false);
    }
  }, [initialized, user, loadTransits]);

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
            <Globe className="w-12 h-12 text-gold-primary mx-auto mb-4" />
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
            <Globe className="w-12 h-12 text-gold-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {L.noBirthData}
            </h1>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              {L.setupProfile}
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          {L.back}
        </Link>

        {/* Header */}
        <motion.div {...fadeUp} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {L.title}
          </h1>
          <p className="text-text-secondary">{L.subtitle}</p>
        </motion.div>

        {/* Sade Sati Status */}
        {sadeSati && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className={`mb-8 p-6 rounded-2xl border backdrop-blur-sm ${
              sadeSati.isActive
                ? 'border-red-500/30 bg-red-500/5 shadow-lg shadow-red-500/10'
                : 'border-emerald-500/20 bg-emerald-500/5'
            }`}
          >
            <h2 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <AlertTriangle className={`w-5 h-5 ${sadeSati.isActive ? 'text-red-400' : 'text-emerald-400'}`} />
              {L.sadeSatiTitle}
            </h2>
            <p className={`text-sm ${sadeSati.isActive ? 'text-red-300' : 'text-emerald-400'}`}>
              {sadeSati.isActive ? L.sadeSatiActive : L.sadeSatiInactive}
            </p>
            {sadeSati.isActive && sadeSati.phase && (
              <p className="text-text-secondary text-sm mt-1">
                {L.phase}: <span className="text-gold-light font-semibold">{sadeSati.phase}</span>
              </p>
            )}
          </motion.div>
        )}

        {/* Gochar Table */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gold-primary/10">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <Globe className="w-5 h-5 text-gold-primary" />
              {L.gocharTable}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/10 bg-bg-primary/30">
                  <th className="text-left p-4 text-text-secondary font-medium">{L.planet}</th>
                  <th className="text-left p-4 text-text-secondary font-medium">{L.transitSign}</th>
                  <th className="text-center p-4 text-text-secondary font-medium">{L.house}</th>
                  <th className="text-left p-4 text-text-secondary font-medium">{L.effect}</th>
                </tr>
              </thead>
              <tbody>
                {gocharResults.map((entry) => {
                  const effectColor = entry.isPositive ? 'text-emerald-400' : 'text-red-400';
                  const effectLabel = entry.isPositive ? L.positive : L.negative;
                  const effectBg = entry.isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';

                  return (
                    <tr
                      key={entry.planetId}
                      className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <GrahaIconById id={entry.planetId} size={28} />
                          <div>
                            <span className="text-text-primary font-medium">
                              {entry.planetName[locale] || entry.planetName.en}
                            </span>
                            {entry.isRetrograde && (
                              <span className="ml-1.5 text-xs text-amber-400 font-semibold">({L.retro})</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-text-primary">
                        {entry.transitSignName[locale] || entry.transitSignName.en}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-primary/10 text-gold-light font-bold text-sm">
                          {entry.natalHouse}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${effectBg} ${effectColor}`}>
                          {effectLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Transit Alerts */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            {L.transitAlerts}
          </h2>

          {gocharResults.filter((e) => !e.isPositive && [4, 6, 7, 8].includes(e.planetId)).length === 0 ? (
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <p className="text-emerald-400 text-sm">{L.noAlerts}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gocharResults
                .filter((e) => !e.isPositive && [4, 6, 7, 8].includes(e.planetId))
                .map((entry) => {
                  const isSaturn = entry.planetId === 6;
                  return (
                    <div
                      key={`alert-${entry.planetId}`}
                      className={`p-4 rounded-xl border ${
                        isSaturn ? 'border-red-500/30 bg-red-500/10' : 'border-amber-500/30 bg-amber-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <GrahaIconById id={entry.planetId} size={24} />
                        <p className="text-sm text-text-primary">
                          {entry.effect[locale] || entry.effect.en}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
