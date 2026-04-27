'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import EventCountdownCard from '@/components/shareable/EventCountdownCard';
import { ShareCardButton } from '@/components/shareable/ShareCardButton';
import { getUpcomingEvents, type CelestialEvent } from '@/lib/calendar/upcoming-events';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const LABELS = {
  title: { en: 'Celestial Events', hi: 'खगोलीय घटनाएँ' },
  subtitle: { en: 'Upcoming retrogrades, eclipses, and their survival guides', hi: 'आगामी वक्री, ग्रहण और उनके उपाय' },
  noEvents: { en: 'No major celestial events in the next 60 days', hi: 'अगले 60 दिनों में कोई बड़ी खगोलीय घटना नहीं' },
  loading: { en: 'Scanning the skies...', hi: 'आकाश की खोज हो रही है...' },
  activeEvents: { en: 'Active Now', hi: 'अभी सक्रिय' },
  upcomingEvents: { en: 'Coming Up', hi: 'आगामी' },
  viewTransits: { en: 'Full Transit Calendar', hi: 'पूर्ण गोचर कैलेंडर' },
  share: { en: 'Share', hi: 'शेयर करें' },
  personalNote: { en: 'Log in with a saved birth chart to see personalized impact on your houses', hi: 'अपने भावों पर व्यक्तिगत प्रभाव देखने के लिए जन्म कुंडली के साथ लॉग इन करें' },
  transitsThrough: { en: 'transits through your', hi: 'आपके' },
  house: { en: 'house', hi: 'भाव से गोचर' },
};

// House domain descriptions for personal impact
const HOUSE_DOMAINS: Record<number, { en: string; hi: string }> = {
  1:  { en: 'self, health & personality', hi: 'स्वयं, स्वास्थ्य व व्यक्तित्व' },
  2:  { en: 'wealth, family & speech', hi: 'धन, परिवार व वाणी' },
  3:  { en: 'courage, siblings & efforts', hi: 'साहस, भाई-बहन व प्रयास' },
  4:  { en: 'home, mother & comforts', hi: 'गृह, माता व सुख' },
  5:  { en: 'children, intellect & creativity', hi: 'संतान, बुद्धि व रचनात्मकता' },
  6:  { en: 'health challenges & enemies', hi: 'रोग, शत्रु व कठिनाई' },
  7:  { en: 'marriage & partnerships', hi: 'विवाह व साझेदारी' },
  8:  { en: 'transformation & hidden matters', hi: 'परिवर्तन व गुप्त विषय' },
  9:  { en: 'fortune, dharma & higher learning', hi: 'भाग्य, धर्म व उच्च शिक्षा' },
  10: { en: 'career, status & karma', hi: 'कर्म, यश व कैरियर' },
  11: { en: 'gains, aspirations & networks', hi: 'लाभ, इच्छाएं व नेटवर्क' },
  12: { en: 'liberation, loss & spiritual growth', hi: 'मोक्ष, व्यय व आध्यात्मिक विकास' },
};

// Planet → approximate sidereal sign for rough transit-through-house computation
// (We don't import the full ephemeris here; we use the retrograde sign data from the event)

function getOrdinalSuffix(n: number): string {
  if (n >= 11 && n <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function EventsPage() {
  const locale = useLocale() as Locale;
  const isDeva = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);

  const { birthRashi, isSet: hasBirthData, loadFromStorage } = useBirthDataStore();
  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  const [events, setEvents] = useState<CelestialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Compute events on mount
  useEffect(() => {
    try {
      const now = new Date();
      const result = getUpcomingEvents(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        60,
      );
      setEvents(result);
    } catch (err) {
      console.error('[EventsPage] Failed to compute upcoming events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Split into active and upcoming
  const { activeEvents, upcomingEvents } = useMemo(() => {
    const active: CelestialEvent[] = [];
    const upcoming: CelestialEvent[] = [];
    for (const e of events) {
      if (e.isActive) active.push(e);
      else upcoming.push(e);
    }
    return { activeEvents: active, upcomingEvents: upcoming };
  }, [events]);

  // Compute personal impact string for an event
  const getPersonalImpact = useCallback((event: CelestialEvent): string | undefined => {
    if (!hasBirthData || !birthRashi || event.planet == null) return undefined;

    // For retrogrades, the planet is transiting through a sign.
    // We approximate which house by: house = (transitSign - ascendantSign + 12) % 12 + 1
    // We don't have the exact transit sign here, but for retrogrades the startSign
    // is embedded in the description. For a simpler approach: use the planet's
    // rough current sign from the retrograde data.
    // Since we don't have startSign in CelestialEvent, provide a generic impact message.
    const planetNames: Record<number, { en: string; hi: string }> = {
      0: { en: 'Sun', hi: 'सूर्य' },
      1: { en: 'Moon', hi: 'चन्द्र' },
      2: { en: 'Mars', hi: 'मंगल' },
      3: { en: 'Mercury', hi: 'बुध' },
      4: { en: 'Jupiter', hi: 'बृहस्पति' },
      5: { en: 'Venus', hi: 'शुक्र' },
      6: { en: 'Saturn', hi: 'शनि' },
    };

    const pName = planetNames[event.planet];
    if (!pName) return undefined;

    // Generic personal impact — we could enhance this later with actual transit sign lookup
    if (locale === 'hi') {
      return `${pName.hi} गोचर आपकी कुंडली को प्रभावित करेगा। विस्तृत विश्लेषण के लिए गोचर पृष्ठ देखें।`;
    }
    return `${pName.en} transit will impact your chart. See the transit page for detailed house-level analysis.`;
  }, [hasBirthData, birthRashi, locale]);

  const handleToggle = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20">
          <Sparkles className="w-4 h-4 text-gold-primary" />
          <span className="text-xs text-gold-light font-medium">
            {tl({ en: 'Next 60 Days', hi: 'अगले 60 दिन' }, locale)}
          </span>
        </div>
        <h1 className={`text-3xl sm:text-4xl font-bold text-gold-light mb-3 ${isDeva ? 'font-devanagari-heading' : ''}`} style={headingFont}>
          {tl(LABELS.title, locale)}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto" style={bodyFont}>
          {tl(LABELS.subtitle, locale)}
        </p>
      </motion.div>

      <GoldDivider className="mb-8" />

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-2 border-gold-primary/30 border-t-gold-primary rounded-full animate-spin mb-4" />
          <p className="text-text-secondary text-sm" style={bodyFont}>
            {tl(LABELS.loading, locale)}
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && events.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="w-12 h-12 text-text-secondary/30 mx-auto mb-4" />
          <p className="text-text-secondary" style={bodyFont}>
            {tl(LABELS.noEvents, locale)}
          </p>
        </div>
      )}

      {/* Active Events */}
      {!loading && activeEvents.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className={`text-lg font-bold text-emerald-400 ${isDeva ? 'font-devanagari-heading' : ''}`} style={headingFont}>
              {tl(LABELS.activeEvents, locale)}
            </h2>
          </div>
          <div className="space-y-4">
            {activeEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' as const }}
              >
                <EventCountdownCard
                  event={event}
                  locale={locale}
                  personalImpact={getPersonalImpact(event)}
                  expanded={expandedId === event.id}
                  onToggleExpand={() => handleToggle(event.id)}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {!loading && upcomingEvents.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-gold-primary" />
            <h2 className={`text-lg font-bold text-gold-light ${isDeva ? 'font-devanagari-heading' : ''}`} style={headingFont}>
              {tl(LABELS.upcomingEvents, locale)}
            </h2>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' as const }}
              >
                <EventCountdownCard
                  event={event}
                  locale={locale}
                  personalImpact={getPersonalImpact(event)}
                  expanded={expandedId === event.id}
                  onToggleExpand={() => handleToggle(event.id)}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Personal note for non-logged-in users */}
      {!loading && events.length > 0 && !hasBirthData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15 text-center"
        >
          <AlertTriangle className="w-4 h-4 text-gold-primary/60 mx-auto mb-2" />
          <p className="text-xs text-text-secondary" style={bodyFont}>
            {tl(LABELS.personalNote, locale)}
          </p>
        </motion.div>
      )}

      {/* Link to full transit calendar */}
      {!loading && (
        <div className="text-center mt-8">
          <Link
            href={'/transits' as const}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gold-primary/30 bg-gold-primary/5 text-gold-light text-sm font-medium hover:bg-gold-primary/10 transition-colors"
          >
            {tl(LABELS.viewTransits, locale)}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </main>
  );
}
