'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Loader2, Flame } from 'lucide-react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { useLocationStore } from '@/stores/location-store';
import {
  TRACKABLE_VRATS,
  type TrackableVrat,
  type VratFrequency,
} from '@/lib/vrat/trackable-vrats';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/types/panchang';

interface VratTrackerProps {
  locale: string;
}

const LABELS = {
  en: {
    title: 'Vrat Tracker',
    subtitle: 'Select the vrats you observe — see upcoming dates and get reminders',
    upcoming: 'Upcoming',
    save: 'Save Preferences',
    saving: 'Saving...',
    saved: 'Saved',
    noUpcoming: 'No upcoming dates found',
    tomorrow: 'Tomorrow',
    today: 'Today',
    weekly: 'Weekly',
    monthly: 'Monthly',
    twiceMonthly: '2x Monthly',
    annual: 'Annual',
  },
  hi: {
    title: 'व्रत ट्रैकर',
    subtitle: 'अपने व्रत चुनें — आगामी तिथियाँ देखें और अनुस्मारक प्राप्त करें',
    upcoming: 'आगामी',
    save: 'प्राथमिकताएँ सहेजें',
    saving: 'सहेजा जा रहा है...',
    saved: 'सहेजा गया',
    noUpcoming: 'कोई आगामी तिथि नहीं मिली',
    tomorrow: 'कल',
    today: 'आज',
    weekly: 'साप्ताहिक',
    monthly: 'मासिक',
    twiceMonthly: 'मास में दो बार',
    annual: 'वार्षिक',
  },
};

type LabelKey = keyof (typeof LABELS)['en'];

/** Compute the next 3 occurrences of a given weekday from today */
function getNextWeekdayDates(weekday: number, count: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  // Start from today (UTC)
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  // Advance to the next occurrence of the target weekday
  while (d.getUTCDay() !== weekday) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  for (let i = 0; i < count; i++) {
    dates.push(
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
    );
    d.setUTCDate(d.getUTCDate() + 7);
  }
  return dates;
}

/** Format a date string (YYYY-MM-DD) for display */
function formatDateShort(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  // Use Date.UTC to avoid timezone shifts (Lesson L)
  const date = new Date(Date.UTC(y, m - 1, d));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsHi = ['जन', 'फर', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस'];
  const isHi = locale === 'hi' || locale === 'sa';
  const monthArr = isHi ? monthsHi : months;
  return `${monthArr[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

/** Check if a date is today or tomorrow */
function getDateLabel(dateStr: string, L: Record<LabelKey, string>): string | null {
  const now = new Date();
  const todayStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const tomorrowStr = `${tomorrow.getUTCFullYear()}-${String(tomorrow.getUTCMonth() + 1).padStart(2, '0')}-${String(tomorrow.getUTCDate()).padStart(2, '0')}`;
  if (dateStr === todayStr) return L.today;
  if (dateStr === tomorrowStr) return L.tomorrow;
  return null;
}

/**
 * Find upcoming occurrences of a vrat.
 *
 * Weekly vrats are pure date arithmetic. Everything else (ekadashi,
 * chaturthi, pradosham, shivaratri, shashthi, lunar, festival) is
 * resolved by matching `vrat.calendarSlug` against the festival
 * generator output, which is the single source of truth for tithi-based
 * dates.
 */
function findUpcomingVratDates(
  vrat: TrackableVrat,
  festivals: FestivalEntry[],
  count: number,
): string[] {
  const now = new Date();
  const todayStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

  if (vrat.category === 'weekday' && vrat.weekday !== undefined) {
    return getNextWeekdayDates(vrat.weekday, count);
  }

  // Match the vrat's calendarSlug against generated entries. The
  // festival generator emits slug-tagged rows; Ekadashi is the special
  // case — the generator emits named slugs (kamada-ekadashi,
  // varuthini-ekadashi, etc.) instead of a generic `ekadashi`, so the
  // catalogue's `calendarSlug: 'ekadashi'` is a wildcard sentinel that
  // matches any `*-ekadashi` slug.
  const matches = (f: FestivalEntry): boolean => {
    if (f.date < todayStr) return false;
    if (vrat.calendarSlug === 'ekadashi') {
      return Boolean(f.slug?.endsWith('-ekadashi'));
    }
    return f.slug === vrat.calendarSlug;
  };

  return festivals
    .filter(matches)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count)
    .map(f => f.date);
}

export default function VratTracker({ locale }: VratTrackerProps) {
  const { user } = useAuthStore();
  const { lat, lng, timezone } = useLocationStore();
  const [enabledVrats, setEnabledVrats] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [festivals, setFestivals] = useState<FestivalEntry[]>([]);
  const [dirty, setDirty] = useState(false);

  const L = (LABELS[locale as keyof typeof LABELS] || LABELS.en) as Record<LabelKey, string>;
  const freqLabel = (freq: VratFrequency): string => {
    switch (freq) {
      case 'weekly': return L.weekly;
      case 'monthly': return L.monthly;
      case 'twice-monthly': return L.twiceMonthly;
      case 'annual': return L.annual;
    }
  };

  // Load user's vrat preferences from Supabase
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data, error } = await supabase
          .from('user_vrat_preferences')
          .select('vrat_type, enabled')
          .eq('user_id', user.id);

        if (error) {
          console.error('[VratTracker] fetch prefs failed:', error);
          setLoading(false);
          return;
        }

        const enabled = new Set<string>();
        if (data) {
          for (const row of data) {
            if (row.enabled) enabled.add(row.vrat_type);
          }
        }
        setEnabledVrats(enabled);
      } catch (err) {
        console.error('[VratTracker] fetch prefs error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  // Generate festival calendar for upcoming date lookup
  useEffect(() => {
    if (!lat || !lng || !timezone) return;
    try {
      const now = new Date();
      const year = now.getUTCFullYear();
      const cal = generateFestivalCalendarV2(year, lat, lng, timezone);
      // Also generate next year's first few months for year-end
      const calNext = generateFestivalCalendarV2(year + 1, lat, lng, timezone);
      setFestivals([...cal, ...calNext]);
    } catch (err) {
      console.error('[VratTracker] festival calendar generation failed:', err);
    }
  }, [lat, lng, timezone]);

  const toggleVrat = useCallback((vratId: string) => {
    setEnabledVrats(prev => {
      const next = new Set(prev);
      if (next.has(vratId)) next.delete(vratId);
      else next.add(vratId);
      return next;
    });
    setDirty(true);
    setSaveSuccess(false);
  }, []);

  const savePreferences = useCallback(async () => {
    if (!user?.id) return;
    const supabase = getSupabase();
    if (!supabase) return;

    setSaving(true);
    try {
      // Upsert all vrat types — enabled or disabled
      const rows = TRACKABLE_VRATS.map(v => ({
        user_id: user.id,
        vrat_type: v.slug,
        enabled: enabledVrats.has(v.slug),
      }));

      const { error } = await supabase
        .from('user_vrat_preferences')
        .upsert(rows, { onConflict: 'user_id,vrat_type' });

      if (error) {
        console.error('[VratTracker] save failed:', error);
        // TODO: show user-visible error toast when toast system is available
        return;
      }

      setDirty(false);
      setSaveSuccess(true);
      // Clear success message after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('[VratTracker] save error:', err);
    } finally {
      setSaving(false);
    }
  }, [user?.id, enabledVrats]);

  if (loading) {
    return (
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
        <div className="flex items-center justify-center gap-2 py-8 text-text-secondary">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Flame className="w-5 h-5 text-gold-primary" />
        <h3 className="text-lg font-semibold text-text-primary">{L.title}</h3>
      </div>
      <p className="text-text-secondary text-xs mb-5">{L.subtitle}</p>

      {/* Vrat toggle grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {TRACKABLE_VRATS.map((vrat) => {
          const isEnabled = enabledVrats.has(vrat.slug);
          const upcomingDates = isEnabled ? findUpcomingVratDates(vrat, festivals, 3) : [];

          return (
            <div
              key={vrat.slug}
              className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                isEnabled
                  ? 'border-gold-primary/30 bg-gold-primary/5'
                  : 'border-white/[0.06] bg-bg-primary/30 hover:border-gold-primary/15'
              }`}
              onClick={() => toggleVrat(vrat.slug)}
            >
              {/* Toggle indicator */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-primary">
                      {tl(vrat.name, locale as Locale)}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      isEnabled ? 'bg-gold-primary/20 text-gold-light' : 'bg-white/5 text-text-secondary'
                    }`}>
                      {freqLabel(vrat.frequency)}
                    </span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    {tl(vrat.description, locale as Locale)}
                  </p>
                </div>
                {/* Checkbox */}
                <div className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
                  isEnabled
                    ? 'bg-gold-primary border-gold-primary'
                    : 'border-text-secondary/40 bg-transparent'
                }`}>
                  {isEnabled && <Check className="w-3 h-3 text-bg-primary" />}
                </div>
              </div>

              {/* Upcoming dates (only for enabled vrats) */}
              {isEnabled && upcomingDates.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gold-primary/10">
                  <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1.5 font-medium">
                    {L.upcoming}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {upcomingDates.map((date) => {
                      const label = getDateLabel(date, L);
                      return (
                        <span
                          key={date}
                          className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                            label
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                              : 'bg-gold-primary/10 text-gold-light border border-gold-primary/10'
                          }`}
                        >
                          {label || formatDateShort(date, locale)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save button */}
      {dirty && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              savePreferences();
            }}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-gold-primary/20 border border-gold-primary/40 text-gold-light font-semibold text-sm hover:bg-gold-primary/30 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {L.saving}
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                {L.saved}
              </>
            ) : (
              L.save
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
