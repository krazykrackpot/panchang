'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Bell, BellRing, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useVratTrackingStore } from '@/stores/vrat-tracking-store';
import { useLocationStore } from '@/stores/location-store';
import { TRACKABLE_VRATS, getWeeklyVratDay, getNextWeeklyDates, type TrackableVrat } from '@/lib/vrat/trackable-vrats';
import { tl } from '@/lib/utils/trilingual';
import { generateVratAlerts } from '@/lib/notifications/vrat-alerts';
import { scheduleAlerts, requestNotificationPermission } from '@/lib/notifications/panchang-alerts';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { LocaleText } from '@/types/panchang';
import GoldDivider from '@/components/ui/GoldDivider';

// ─── Labels ───

const LABELS: Record<string, LocaleText> = {
  title: { en: 'My Vrat Calendar', hi: 'मेरा व्रत कैलेंडर', sa: 'मम व्रतपञ्चाङ्गम्' },
  subtitle: { en: 'Follow vrats to get reminders before they occur', hi: 'व्रतों का अनुसरण करें और समय से पहले स्मरण प्राप्त करें', sa: 'व्रतानि अनुसृत्य स्मारणं प्राप्नुत' },
  followable: { en: 'Available Vrats', hi: 'उपलब्ध व्रत', sa: 'उपलब्धव्रतानि' },
  upcoming: { en: 'Upcoming Vrats (Next 30 Days)', hi: 'आगामी व्रत (अगले 30 दिन)', sa: 'आगामिव्रतानि (३० दिनम्)' },
  noFollowed: { en: 'You are not following any vrats yet. Follow vrats above to see your personal calendar.', hi: 'आपने अभी कोई व्रत अनुसरण नहीं किया है।', sa: 'भवता किमपि व्रतं न अनुसृतम्।' },
  remindMe: { en: 'Remind me', hi: 'मुझे याद दिलाएं', sa: 'स्मारय माम्' },
  hoursBefore: { en: 'hours before', hi: 'घंटे पहले', sa: 'होरापूर्वम्' },
  loading: { en: 'Loading vrat dates...', hi: 'व्रत तिथियां लोड हो रही हैं...', sa: 'व्रततिथयः आगच्छन्ति...' },
  next: { en: 'Next:', hi: 'अगला:', sa: 'अग्रिमम्:' },
  deity: { en: 'Deity:', hi: 'देवता:', sa: 'देवता:' },
  ekadashiGroup: { en: 'Ekadashi', hi: 'एकादशी', sa: 'एकादशी' },
  monthlyGroup: { en: 'Monthly Recurring', hi: 'मासिक व्रत', sa: 'मासिकव्रतानि' },
  weeklyGroup: { en: 'Weekly Vrats', hi: 'साप्ताहिक व्रत', sa: 'साप्ताहिकव्रतानि' },
  followAll: { en: 'Follow All', hi: 'सब अनुसरण करें', sa: 'सर्वाणि अनुसृत' },
  notifPrompt: { en: 'Enable browser notifications to get timely vrat reminders.', hi: 'समय पर व्रत स्मरण के लिए ब्राउज़र नोटिफिकेशन चालू करें।', sa: 'सूचनाप्रणालीं सक्रियं कुरुत।' },
  enableNotif: { en: 'Enable Notifications', hi: 'नोटिफिकेशन चालू करें', sa: 'सूचनाः सक्रियाः' },
};

const REMINDER_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 6, label: '6' },
  { value: 12, label: '12' },
  { value: 24, label: '24' },
];

// ─── Types ───

interface CalendarEntry {
  name: { en: string; hi?: string; sa?: string };
  date: string;
  slug?: string;
  category?: string;
}

// ─── Helpers ───

function formatDate(dateStr: string, locale: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString(locale === 'sa' ? 'hi-IN' : locale === 'hi' ? 'hi-IN' : 'en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

function daysFromNow(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

// ─── Component ───

export default function VratCalendarPage() {
  const locale = useLocale();
  const devFont = isDevanagariLocale(locale);
  const { lat, lng, timezone } = useLocationStore();
  const { followedVrats, followVrat, unfollowVrat, reminderHours, setReminderHours } = useVratTrackingStore();

  const [calendarData, setCalendarData] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifPermission, setNotifPermission] = useState<string>('default');

  // Check notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Fetch calendar data
  useEffect(() => {
    async function fetchCalendar() {
      if (lat === null || lng === null || !timezone) {
        setLoading(false);
        return;
      }

      try {
        const year = new Date().getFullYear();
        const res = await fetch(`/api/calendar?year=${year}&lat=${lat}&lon=${lng}&timezone=${timezone}`);
        if (!res.ok) {
          console.error('[VratCalendar] API error:', res.status);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setCalendarData(data.festivals || []);
      } catch (err) {
        console.error('[VratCalendar] Failed to fetch calendar:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, [lat, lng, timezone]);

  // Schedule vrat alerts when data/preferences change
  useEffect(() => {
    if (calendarData.length === 0 || followedVrats.length === 0) return;
    const alerts = generateVratAlerts(followedVrats, reminderHours, calendarData, locale);
    scheduleAlerts(alerts);
  }, [calendarData, followedVrats, reminderHours, locale]);

  // Find next occurrence for each trackable vrat
  const nextDates = useMemo(() => {
    const map: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);

    for (const vrat of TRACKABLE_VRATS) {
      const weekDay = getWeeklyVratDay(vrat.slug);
      if (weekDay !== null) {
        const dates = getNextWeeklyDates(weekDay, 1);
        if (dates.length > 0) map[vrat.slug] = dates[0];
        continue;
      }

      // Find from calendar data
      const matches = calendarData
        .filter((e) => e.slug === vrat.calendarSlug && e.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date));
      if (matches.length > 0) {
        map[vrat.slug] = matches[0].date;
      }
    }
    return map;
  }, [calendarData]);

  // Upcoming followed vrats for the next 30 days
  const upcomingVrats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);
    const thirtyDays = new Date(today);
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    const cutoff = thirtyDays.toISOString().slice(0, 10);

    const items: { date: string; vrat: TrackableVrat; name: string }[] = [];

    for (const slug of followedVrats) {
      const vrat = TRACKABLE_VRATS.find((v) => v.slug === slug);
      if (!vrat) continue;

      const weekDay = getWeeklyVratDay(slug);
      if (weekDay !== null) {
        const dates = getNextWeeklyDates(weekDay, 5);
        for (const d of dates) {
          if (d >= todayStr && d <= cutoff) {
            items.push({ date: d, vrat, name: tl(vrat.name, locale) });
          }
        }
        continue;
      }

      // Tithi-based vrats from calendar
      const matches = calendarData.filter(
        (e) => e.slug === vrat.calendarSlug && e.date >= todayStr && e.date <= cutoff,
      );
      for (const m of matches) {
        items.push({ date: m.date, vrat, name: tl(m.name, locale) || tl(vrat.name, locale) });
      }
    }

    items.sort((a, b) => a.date.localeCompare(b.date));
    return items;
  }, [followedVrats, calendarData, locale]);

  const handleFollow = useCallback((slug: string) => {
    if (followedVrats.includes(slug)) {
      unfollowVrat(slug);
    } else {
      // If first follow, ask for notification permission
      if (followedVrats.length === 0) {
        requestNotificationPermission().then((granted) => {
          if (granted) setNotifPermission('granted');
        }).catch((err) => {
          console.warn('[VratCalendar] Notification permission failed:', err);
        });
      }
      followVrat(slug);
    }
  }, [followedVrats, followVrat, unfollowVrat]);

  const groupedVrats = useMemo(() => ({
    ekadashi: TRACKABLE_VRATS.filter((v) => v.category === 'ekadashi'),
    monthly: TRACKABLE_VRATS.filter((v) => v.category === 'monthly'),
    weekly: TRACKABLE_VRATS.filter((v) => v.category === 'weekly'),
  }), []);

  const l = (key: string) => tl(LABELS[key], locale);

  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3"
            style={devFont ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
          >
            {l('title')}
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">{l('subtitle')}</p>
        </div>

        {/* Notification Permission Banner */}
        {notifPermission !== 'granted' && followedVrats.length > 0 && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-text-primary flex-1">{l('notifPrompt')}</p>
            <button
              onClick={async () => {
                const granted = await requestNotificationPermission();
                if (granted) setNotifPermission('granted');
              }}
              className="px-4 py-1.5 text-sm font-medium bg-gold-primary/20 text-gold-light rounded-lg hover:bg-gold-primary/30 transition-colors border border-gold-primary/30"
            >
              {l('enableNotif')}
            </button>
          </div>
        )}

        {/* Reminder Preference */}
        <div className="mb-8 flex items-center gap-3 flex-wrap">
          <Clock className="w-4 h-4 text-text-secondary" />
          <span className="text-sm text-text-secondary">{l('remindMe')}</span>
          <select
            value={reminderHours}
            onChange={(e) => setReminderHours(Number(e.target.value))}
            className="bg-bg-secondary border border-gold-primary/20 text-text-primary text-sm rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-gold-primary/40 focus:outline-none"
          >
            {REMINDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="text-sm text-text-secondary">{l('hoursBefore')}</span>
        </div>

        {/* Available Vrats — Grouped */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gold-light mb-6">{l('followable')}</h2>

          {(['ekadashi', 'monthly', 'weekly'] as const).map((group) => {
            const groupLabel = group === 'ekadashi' ? l('ekadashiGroup') : group === 'monthly' ? l('monthlyGroup') : l('weeklyGroup');
            const vrats = groupedVrats[group];

            return (
              <div key={group} className="mb-8">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">{groupLabel}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {vrats.map((vrat) => {
                    const isFollowing = followedVrats.includes(vrat.slug);
                    const nextDate = nextDates[vrat.slug];

                    return (
                      <div
                        key={vrat.slug}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          isFollowing
                            ? 'bg-gold-primary/5 border-gold-primary/30'
                            : 'bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border-gold-primary/10 hover:border-gold-primary/25'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <h4
                              className="font-semibold text-text-primary text-sm leading-tight"
                              style={devFont ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
                            >
                              {tl(vrat.name, locale)}
                            </h4>
                            <p className="text-xs text-text-secondary mt-0.5">{tl(vrat.frequency, locale)}</p>
                          </div>
                          <button
                            onClick={() => handleFollow(vrat.slug)}
                            aria-label={isFollowing ? `Unfollow ${tl(vrat.name, 'en')}` : `Follow ${tl(vrat.name, 'en')}`}
                            aria-pressed={isFollowing}
                            className={`shrink-0 p-2 rounded-lg transition-all duration-200 ${
                              isFollowing
                                ? 'bg-gold-primary/20 text-gold-primary hover:bg-gold-primary/10'
                                : 'bg-[#1a1040]/40 text-text-secondary hover:text-gold-light hover:bg-gold-primary/10'
                            }`}
                          >
                            {isFollowing ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                          </button>
                        </div>

                        <p className="text-xs text-text-secondary mb-2 line-clamp-2">{tl(vrat.description, locale)}</p>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">
                            {l('deity')} <span className="text-text-primary">{tl(vrat.deity, locale)}</span>
                          </span>
                          {nextDate && !loading && (
                            <span className="text-gold-primary/80">
                              {l('next')} {formatDate(nextDate, locale)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        <GoldDivider />

        {/* Upcoming Followed Vrats Timeline */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gold-light mb-6">{l('upcoming')}</h2>

          {loading ? (
            <p className="text-text-secondary text-sm">{l('loading')}</p>
          ) : followedVrats.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{l('noFollowed')}</p>
            </div>
          ) : upcomingVrats.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-8">
              {locale === 'hi' ? 'अगले 30 दिनों में कोई अनुसरित व्रत नहीं है।' : 'No followed vrats in the next 30 days.'}
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingVrats.map((item, i) => {
                const days = daysFromNow(item.date);
                const isToday = days === 0;
                const isTomorrow = days === 1;

                return (
                  <div
                    key={`${item.vrat.slug}-${item.date}-${i}`}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                      isToday
                        ? 'bg-gold-primary/10 border border-gold-primary/30'
                        : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/20'
                    }`}
                  >
                    {/* Date badge */}
                    <div className="shrink-0 w-14 text-center">
                      <div className={`text-lg font-bold ${isToday ? 'text-gold-primary' : 'text-text-primary'}`}>
                        {new Date(item.date + 'T12:00:00').getDate()}
                      </div>
                      <div className="text-xs text-text-secondary uppercase">
                        {new Date(item.date + 'T12:00:00').toLocaleDateString('en', { month: 'short' })}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm ${isToday ? 'text-gold-light' : 'text-text-primary'}`}
                        style={devFont ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDate(item.date, locale)}
                        {isToday && (locale === 'hi' ? ' — आज' : ' — Today')}
                        {isTomorrow && (locale === 'hi' ? ' — कल' : ' — Tomorrow')}
                        {!isToday && !isTomorrow && days <= 7 && (locale === 'hi' ? ` — ${days} दिन बाद` : ` — in ${days} days`)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-text-secondary/40 shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
