'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Shield, Gem, HandHeart, Calendar } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { computePersonalRemedies } from '@/lib/personalization/remedies';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale } from '@/types/panchang';
import type { UserSnapshot } from '@/lib/personalization/types';
import type { PersonalRemedy } from '@/lib/personalization/remedies';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: 'Your Personalized Remedies',
    subtitle: 'Vedic remedies tailored to your birth chart',
    loading: 'Computing your remedies...',
    notSignedIn: 'Sign in to see your personalized remedies',
    signIn: 'Sign In',
    noBirthData: 'Set up your birth details to unlock personalized remedies',
    setupProfile: 'Set Up Profile',
    back: 'Dashboard',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    mantra: 'Mantra',
    gemstone: 'Gemstone',
    donation: 'Donation',
    bestDay: 'Best Day',
    noRemedies: 'No specific remedies needed at this time. Your chart is well-balanced.',
  },
  hi: {
    title: 'आपके व्यक्तिगत उपाय',
    subtitle: 'आपकी जन्म कुण्डली के अनुसार वैदिक उपाय',
    loading: 'आपके उपाय गणना हो रही है...',
    notSignedIn: 'अपने व्यक्तिगत उपाय देखने के लिए साइन इन करें',
    signIn: 'साइन इन',
    noBirthData: 'व्यक्तिगत उपायों के लिए अपना जन्म विवरण सेट करें',
    setupProfile: 'प्रोफ़ाइल सेट करें',
    back: 'डैशबोर्ड',
    highPriority: 'उच्च प्राथमिकता',
    mediumPriority: 'मध्यम प्राथमिकता',
    lowPriority: 'निम्न प्राथमिकता',
    mantra: 'मन्त्र',
    gemstone: 'रत्न',
    donation: 'दान',
    bestDay: 'शुभ दिन',
    noRemedies: 'इस समय कोई विशेष उपाय आवश्यक नहीं। आपकी कुण्डली सन्तुलित है।',
  },
  sa: {
    title: 'भवतः व्यक्तिगताः उपायाः',
    subtitle: 'भवतः जन्मकुण्डल्यनुसारं वैदिकोपायाः',
    loading: 'भवतः उपायाः गण्यन्ते...',
    notSignedIn: 'स्वव्यक्तिगतान् उपायान् द्रष्टुं साइन इन कुर्वन्तु',
    signIn: 'साइन इन',
    noBirthData: 'व्यक्तिगतोपायार्थं जन्मविवरणं स्थापयतु',
    setupProfile: 'प्रोफ़ाइलं स्थापयतु',
    back: 'पटलम्',
    highPriority: 'उच्चप्राथमिकता',
    mediumPriority: 'मध्यमप्राथमिकता',
    lowPriority: 'न्यूनप्राथमिकता',
    mantra: 'मन्त्रः',
    gemstone: 'रत्नम्',
    donation: 'दानम्',
    bestDay: 'शुभदिनम्',
    noRemedies: 'अस्मिन् समये विशेषोपायाः नावश्यकाः। भवतः कुण्डली सन्तुलिता।',
  },
};

// ---------------------------------------------------------------------------
// Priority config
// ---------------------------------------------------------------------------
const PRIORITY_CONFIG = {
  high: {
    accent: 'border-red-500/40 bg-red-500/5',
    badge: 'bg-red-500/20 text-red-400',
    glow: 'shadow-red-500/10',
  },
  medium: {
    accent: 'border-gold-primary/40 bg-gold-primary/5',
    badge: 'bg-gold-primary/20 text-gold-light',
    glow: 'shadow-gold-primary/10',
  },
  low: {
    accent: 'border-blue-500/40 bg-blue-500/5',
    badge: 'bg-blue-500/20 text-blue-400',
    glow: 'shadow-blue-500/10',
  },
};

// ---------------------------------------------------------------------------
// Remedy Card
// ---------------------------------------------------------------------------
function RemedyCard({ remedy, locale, labels }: { remedy: PersonalRemedy; locale: Locale; labels: typeof LABELS.en }) {
  const cfg = PRIORITY_CONFIG[remedy.priority];
  const priorityLabel = remedy.priority === 'high' ? labels.highPriority :
    remedy.priority === 'medium' ? labels.mediumPriority : labels.lowPriority;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${cfg.accent} backdrop-blur-sm shadow-lg ${cfg.glow}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {remedy.planetId != null && (
          <div className="shrink-0 mt-1">
            <GrahaIconById id={remedy.planetId} size={40} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              {remedy.title[locale] || remedy.title.en}
            </h3>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
              {priorityLabel}
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {remedy.description[locale] || remedy.description.en}
          </p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {remedy.mantra && (
          <div className="p-3 rounded-xl bg-bg-primary/40 border border-gold-primary/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5 text-gold-primary" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{labels.mantra}</span>
            </div>
            <p className="text-gold-light text-base leading-relaxed" style={{ fontFamily: 'var(--font-devanagari-body, serif)' }}>
              {remedy.mantra}
            </p>
          </div>
        )}

        {remedy.gemstone && (
          <div className="p-3 rounded-xl bg-bg-primary/40 border border-gold-primary/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Gem className="w-3.5 h-3.5 text-gold-primary" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{labels.gemstone}</span>
            </div>
            <p className="text-text-primary text-sm">
              {remedy.gemstone[locale] || remedy.gemstone.en}
            </p>
          </div>
        )}

        {remedy.donation && (
          <div className="p-3 rounded-xl bg-bg-primary/40 border border-gold-primary/10">
            <div className="flex items-center gap-1.5 mb-1">
              <HandHeart className="w-3.5 h-3.5 text-gold-primary" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{labels.donation}</span>
            </div>
            <p className="text-text-primary text-sm">
              {remedy.donation[locale] || remedy.donation.en}
            </p>
          </div>
        )}

        {remedy.day && (
          <div className="p-3 rounded-xl bg-bg-primary/40 border border-gold-primary/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-gold-primary" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{labels.bestDay}</span>
            </div>
            <p className="text-text-primary text-sm">
              {remedy.day[locale] || remedy.day.en}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function RemediesPage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const L = LABELS[locale] || LABELS.en;
  const { user, initialized } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [remedies, setRemedies] = useState<PersonalRemedy[]>([]);
  const [hasBirthData, setHasBirthData] = useState(false);

  const loadRemedies = useCallback(async () => {
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

      // Fetch full snapshot with JSONB fields
      const { data: fullSnap } = await supabase
        .from('kundali_snapshots')
        .select('planet_positions, dasha_timeline, sade_sati')
        .eq('user_id', user.id)
        .single();

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

      const result = computePersonalRemedies(userSnapshot);
      setRemedies(result);
    } catch (err) {
      console.error('Remedies load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialized && user) {
      loadRemedies();
    } else if (initialized && !user) {
      setLoading(false);
    }
  }, [initialized, user, loadRemedies]);

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
            <Shield className="w-12 h-12 text-gold-primary mx-auto mb-4" />
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
            <Shield className="w-12 h-12 text-gold-primary mx-auto mb-4" />
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

  // Group remedies by priority
  const highRemedies = remedies.filter((r) => r.priority === 'high');
  const mediumRemedies = remedies.filter((r) => r.priority === 'medium');
  const lowRemedies = remedies.filter((r) => r.priority === 'low');

  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
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

        {remedies.length === 0 ? (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center"
          >
            <p className="text-emerald-400 text-lg">{L.noRemedies}</p>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* High Priority */}
            {highRemedies.length > 0 && (
              <motion.section {...fadeUp} transition={{ delay: 0.1 }}>
                <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  {L.highPriority}
                </h2>
                <div className="space-y-4">
                  {highRemedies.map((r, i) => (
                    <RemedyCard key={`high-${i}`} remedy={r} locale={locale} labels={L} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Medium Priority */}
            {mediumRemedies.length > 0 && (
              <motion.section {...fadeUp} transition={{ delay: 0.2 }}>
                <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-primary" />
                  {L.mediumPriority}
                </h2>
                <div className="space-y-4">
                  {mediumRemedies.map((r, i) => (
                    <RemedyCard key={`med-${i}`} remedy={r} locale={locale} labels={L} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Low Priority */}
            {lowRemedies.length > 0 && (
              <motion.section {...fadeUp} transition={{ delay: 0.3 }}>
                <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  {L.lowPriority}
                </h2>
                <div className="space-y-4">
                  {lowRemedies.map((r, i) => (
                    <RemedyCard key={`low-${i}`} remedy={r} locale={locale} labels={L} />
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
