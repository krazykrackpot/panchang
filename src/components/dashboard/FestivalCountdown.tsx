'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useLocationStore } from '@/stores/location-store';
import type { Locale } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FestivalRaw {
  name: { en: string; hi: string; sa: string };
  date: string;        // YYYY-MM-DD
  type: 'major' | 'vrat' | 'regional' | 'eclipse';
  category: string;
  slug?: string;
}

interface UpcomingFestival {
  name: { en: string; hi: string; sa: string };
  date: string;
  daysUntil: number;
  type: 'major' | 'vrat' | 'regional' | 'eclipse';
  category: string;
  slug?: string;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const LABELS = {
  en: {
    title: 'Upcoming Festivals',
    subtitle: 'Your next celestial celebrations',
    today: 'Today!',
    tomorrow: 'Tomorrow!',
    inDays: (n: number) => `In ${n} days`,
    inWeeks: (n: number) => n === 1 ? 'In 1 week' : `In ${n} weeks`,
    viewAll: 'View full calendar',
    major: 'Major',
    ekadashi: 'Ekadashi',
    purnima: 'Purnima',
    amavasya: 'Amavasya',
    chaturthi: 'Chaturthi',
    pradosham: 'Pradosham',
    sankranti: 'Sankranti',
    vrat: 'Vrat',
    regional: 'Regional',
    eclipse: 'Eclipse',
    festival: 'Festival',
  },
  hi: {
    title: 'आगामी त्योहार',
    subtitle: 'आपके अगले दिव्य उत्सव',
    today: 'आज!',
    tomorrow: 'कल!',
    inDays: (n: number) => `${n} दिन में`,
    inWeeks: (n: number) => n === 1 ? '1 सप्ताह में' : `${n} सप्ताह में`,
    viewAll: 'पूरा कैलेंडर देखें',
    major: 'प्रमुख',
    ekadashi: 'एकादशी',
    purnima: 'पूर्णिमा',
    amavasya: 'अमावस्या',
    chaturthi: 'चतुर्थी',
    pradosham: 'प्रदोषम्',
    sankranti: 'सङ्क्रान्ति',
    vrat: 'व्रत',
    regional: 'क्षेत्रीय',
    eclipse: 'ग्रहण',
    festival: 'उत्सव',
  },
  sa: {
    title: 'आगामिनः उत्सवाः',
    subtitle: 'भवतः अग्रिमाः दिव्योत्सवाः',
    today: 'अद्य!',
    tomorrow: 'श्वः!',
    inDays: (n: number) => `${n} दिनेषु`,
    inWeeks: (n: number) => n === 1 ? '1 सप्ताहे' : `${n} सप्ताहेषु`,
    viewAll: 'पूर्णं पञ्चाङ्गं पश्यतु',
    major: 'प्रमुखम्',
    ekadashi: 'एकादशी',
    purnima: 'पूर्णिमा',
    amavasya: 'अमावस्या',
    chaturthi: 'चतुर्थी',
    pradosham: 'प्रदोषम्',
    sankranti: 'सङ्क्रान्तिः',
    vrat: 'व्रतम्',
    regional: 'प्रादेशिकम्',
    eclipse: 'ग्रहणम्',
    festival: 'उत्सवः',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCategoryLabel(category: string, type: string, L: (typeof LABELS)['en']): string {
  const key = category as keyof typeof L;
  if (key in L && typeof L[key] === 'string') return L[key] as string;
  if (type === 'major') return L.major;
  if (type === 'vrat') return L.vrat;
  if (type === 'regional') return L.regional;
  return L.festival;
}

function getCategoryColor(category: string, type: string): { bg: string; text: string; border: string } {
  if (type === 'major' || category === 'festival') return { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/25' };
  if (category === 'ekadashi') return { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/25' };
  if (category === 'purnima') return { bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/25' };
  if (category === 'amavasya') return { bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/25' };
  if (category === 'chaturthi') return { bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/25' };
  if (category === 'pradosham') return { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/25' };
  if (category === 'sankranti') return { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/25' };
  if (type === 'vrat') return { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/25' };
  return { bg: 'bg-gold-primary/15', text: 'text-gold-light', border: 'border-gold-primary/25' };
}

function getCountdownColor(days: number): { bg: string; text: string; border: string; glow: string } {
  if (days <= 1) return { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', glow: 'shadow-red-500/20 shadow-lg' };
  if (days <= 7) return { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/25', glow: '' };
  return { bg: 'bg-gold-primary/10', text: 'text-gold-light', border: 'border-gold-primary/20', glow: '' };
}

function formatCountdown(days: number, L: (typeof LABELS)['en']): string {
  if (days === 0) return L.today;
  if (days === 1) return L.tomorrow;
  if (days <= 13) return L.inDays(days);
  const weeks = Math.round(days / 7);
  return L.inWeeks(weeks);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FestivalCountdown() {
  const locale = useLocale() as Locale;
  const L = LABELS[locale] || LABELS.en;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const locationStore = useLocationStore();
  const [festivals, setFestivals] = useState<UpcomingFestival[]>([]);

  useEffect(() => {
    if (locationStore.lat == null || locationStore.lng == null || !locationStore.timezone) return;

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const currentYear = now.getFullYear();

    const fetchFestivals = async (year: number): Promise<FestivalRaw[]> => {
      try {
        const params = new URLSearchParams({
          year: String(year),
          lat: String(locationStore.lat),
          lon: String(locationStore.lng),
          timezone: locationStore.timezone!,
        });
        const res = await fetch(`/api/calendar?${params}`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.festivals || []) as FestivalRaw[];
      } catch {
        return [];
      }
    };

    (async () => {
      // Fetch current year; if not enough upcoming, also fetch next year
      let all = await fetchFestivals(currentYear);

      // Filter to only future (including today)
      let upcoming = all
        .filter(f => f.date >= todayStr)
        .map(f => {
          const fDate = new Date(f.date + 'T00:00:00');
          const diffMs = fDate.getTime() - new Date(todayStr + 'T00:00:00').getTime();
          const daysUntil = Math.round(diffMs / 86400000);
          return { ...f, daysUntil } as UpcomingFestival;
        })
        .sort((a, b) => a.daysUntil - b.daysUntil);

      // If fewer than 3 upcoming, fetch next year too
      if (upcoming.length < 3) {
        const nextAll = await fetchFestivals(currentYear + 1);
        const nextUpcoming = nextAll
          .map(f => {
            const fDate = new Date(f.date + 'T00:00:00');
            const diffMs = fDate.getTime() - new Date(todayStr + 'T00:00:00').getTime();
            const daysUntil = Math.round(diffMs / 86400000);
            return { ...f, daysUntil } as UpcomingFestival;
          })
          .filter(f => f.daysUntil > 0)
          .sort((a, b) => a.daysUntil - b.daysUntil);
        upcoming = [...upcoming, ...nextUpcoming];
      }

      // Take first 3
      setFestivals(upcoming.slice(0, 3));
    })();
  }, [locationStore.lat, locationStore.lng, locationStore.timezone]);

  if (festivals.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-8"
    >
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-text-primary" style={headingFont}>
            {L.title}
          </h3>
        </div>
        <p className="text-text-secondary text-xs mb-4" style={bodyFont}>{L.subtitle}</p>

        {/* Festival rows */}
        <div className="space-y-3">
          {festivals.map((f, i) => {
            const countdown = getCountdownColor(f.daysUntil);
            const catColor = getCategoryColor(f.category, f.type);
            const catLabel = getCategoryLabel(f.category, f.type, L);
            const linkHref = f.slug
              ? `/calendar/${f.slug}?date=${f.date}` as const
              : `/calendar?date=${f.date}` as const;

            return (
              <motion.div
                key={`${f.date}-${f.slug || i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Link href={linkHref} className="block group">
                  <div className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-purple-500/10 bg-bg-primary/30 hover:border-purple-500/25 hover:bg-purple-500/5 transition-all ${f.daysUntil <= 1 ? 'ring-1 ring-red-500/20' : ''}`}>
                    {/* Festival icon */}
                    <div className="shrink-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${f.daysUntil <= 1 ? 'bg-red-500/15' : 'bg-purple-500/10'}`}>
                        <Calendar className={`w-5 h-5 ${f.daysUntil <= 1 ? 'text-red-400' : 'text-purple-400'}`} />
                      </div>
                    </div>

                    {/* Name + date + category */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-text-primary font-semibold text-sm truncate" style={bodyFont}>
                          {f.name[locale] || f.name.en}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                          {catLabel}
                        </span>
                      </div>
                      <span className="text-text-secondary text-xs font-mono">{formatDate(f.date)}</span>
                    </div>

                    {/* Countdown pill */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${countdown.bg} ${countdown.text} ${countdown.border} ${countdown.glow}`}>
                        {formatCountdown(f.daysUntil, L)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-secondary/30 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all hidden sm:block" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View all link */}
        <div className="mt-4 text-center">
          <Link
            href="/calendar"
            className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
            style={bodyFont}
          >
            {L.viewAll}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
