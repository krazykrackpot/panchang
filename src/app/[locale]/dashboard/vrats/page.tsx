'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Flame, Loader2, Check, Calendar, Copy, RefreshCw, MapPin } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import {
  TRACKABLE_VRATS,
  getTrackableVrat,
  type TrackableVrat,
} from '@/lib/vrat/trackable-vrats';
import {
  generateUpcomingOccurrences,
  type VratOccurrence,
  type VratTradition,
} from '@/lib/vrat/generator';
import { TraditionPickerModal } from '@/components/vrats/TraditionPickerModal';
import { LocationPicker, type SelectedLocation } from '@/components/vrats/LocationPicker';

interface VratPrefRow {
  vrat_type: string;
  enabled: boolean;
  remind_day_before?: boolean;
  remind_parana?: boolean;
}

interface VratProfile {
  vrat_tradition: VratTradition | null;
  vrat_location_city: string | null;
  vrat_location_lat: number | null;
  vrat_location_lng: number | null;
  vrat_location_tz: string | null;
  parana_reminder_offset_minutes: number;
  vrat_calendar_token: string | null;
}

const COPY = {
  en: {
    title: 'Vrat Tracker',
    subtitle: 'Pick the vrats you observe — see upcoming dates and parana windows.',
    needAuth: 'Sign in to track your vrats.',
    needLocation: 'Set your vrat location below to see upcoming dates.',
    needTradition: 'Pick your tradition first (Smarta / Vaishnava).',
    setLocation: 'Set vrat location',
    setTradition: 'Set tradition',
    settings: 'Settings',
    browse: 'Available vrats',
    upcoming: 'Upcoming',
    noUpcoming: 'Subscribe to vrats below to see upcoming dates.',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed',
    tradition: 'Tradition',
    location: 'Location',
    paranaOffset: 'Parana reminder offset',
    minutesBefore: 'minutes before',
    calendarFeed: 'Calendar subscription',
    feedHint:
      'Subscribe this URL in Apple Calendar, Google Calendar, or any iCal-aware app. Updates every hour.',
    copy: 'Copy URL',
    copied: 'Copied!',
    regenerate: 'Regenerate URL',
    regenWarn: 'Regenerating breaks the old URL — you will need to re-subscribe in your calendar app.',
    generateFeed: 'Generate calendar URL',
    deity: 'Deity',
    frequency: 'Frequency',
    paranaRule: 'Parana',
    upcomingDates: 'Upcoming dates',
    saving: 'Saving…',
    saved: 'Saved',
  },
  hi: {
    title: 'व्रत ट्रैकर',
    subtitle: 'अपने व्रत चुनें — आगामी तिथियाँ और पारण समय देखें।',
    needAuth: 'अपने व्रत ट्रैक करने के लिए साइन इन करें।',
    needLocation: 'आगामी तिथियाँ देखने के लिए नीचे अपना व्रत स्थान सेट करें।',
    needTradition: 'पहले अपनी परम्परा चुनें (स्मार्त / वैष्णव)।',
    setLocation: 'व्रत स्थान सेट करें',
    setTradition: 'परम्परा सेट करें',
    settings: 'सेटिंग्स',
    browse: 'उपलब्ध व्रत',
    upcoming: 'आगामी',
    noUpcoming: 'आगामी तिथियाँ देखने के लिए नीचे व्रत चुनें।',
    subscribe: 'चुनें',
    subscribed: 'चुना गया',
    tradition: 'परम्परा',
    location: 'स्थान',
    paranaOffset: 'पारण अनुस्मारक समय',
    minutesBefore: 'मिनट पहले',
    calendarFeed: 'कैलेंडर सदस्यता',
    feedHint:
      'यह URL Apple Calendar, Google Calendar या किसी भी iCal ऐप में सब्सक्राइब करें। हर घंटे अपडेट होता है।',
    copy: 'URL कॉपी करें',
    copied: 'कॉपी हो गया!',
    regenerate: 'URL पुनः बनाएँ',
    regenWarn: 'पुनः बनाने पर पुराना URL टूट जाएगा — आपको कैलेंडर ऐप में फिर से सब्सक्राइब करना होगा।',
    generateFeed: 'कैलेंडर URL बनाएँ',
    deity: 'देवता',
    frequency: 'आवृत्ति',
    paranaRule: 'पारण',
    upcomingDates: 'आगामी तिथियाँ',
    saving: 'सहेजा जा रहा है…',
    saved: 'सहेजा गया',
  },
};

function formatDate(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsHi = ['जन', 'फर', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस'];
  const weekdaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdaysHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const isHi = isDevanagariLocale(locale);
  const monthArr = isHi ? monthsHi : months;
  const weekdayArr = isHi ? weekdaysHi : weekdaysEn;
  return `${weekdayArr[date.getUTCDay()]}, ${date.getUTCDate()} ${monthArr[date.getUTCMonth()]}`;
}

/** Generate a 32-byte URL-safe random token in the browser. */
function generateCalendarToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function VratsDashboardPage() {
  const locale = useLocale();
  const { user, initialized } = useAuthStore();
  const isHi = isDevanagariLocale(locale);
  const t = isHi ? COPY.hi : COPY.en;

  const [profile, setProfile] = useState<VratProfile | null>(null);
  const [prefs, setPrefs] = useState<Record<string, VratPrefRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTraditionModal, setShowTraditionModal] = useState(false);
  const [pendingSubscribeSlug, setPendingSubscribeSlug] = useState<string | null>(null);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);

  // Load profile + preferences
  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    (async () => {
      const [{ data: prof }, { data: prefRows }] = await Promise.all([
        supabase
          .from('user_profiles')
          .select(
            'vrat_tradition, vrat_location_city, vrat_location_lat, vrat_location_lng, vrat_location_tz, parana_reminder_offset_minutes, vrat_calendar_token',
          )
          .eq('id', user.id)
          .single(),
        supabase
          .from('user_vrat_preferences')
          .select('vrat_type, enabled, remind_day_before, remind_parana')
          .eq('user_id', user.id),
      ]);
      if (prof) setProfile(prof as VratProfile);
      const map: Record<string, VratPrefRow> = {};
      for (const row of (prefRows ?? []) as VratPrefRow[]) {
        map[row.vrat_type] = row;
      }
      setPrefs(map);
      setLoading(false);
    })();
  }, [initialized, user]);

  const occurrences = useMemo<VratOccurrence[]>(() => {
    if (
      !profile?.vrat_location_lat ||
      !profile.vrat_location_lng ||
      !profile.vrat_location_tz
    ) {
      return [];
    }
    const tradition: VratTradition = profile.vrat_tradition ?? 'smarta';
    const location = {
      lat: profile.vrat_location_lat,
      lng: profile.vrat_location_lng,
      tz: profile.vrat_location_tz,
    };
    const subscribed = Object.values(prefs).filter((p) => p.enabled);
    const all: VratOccurrence[] = [];
    for (const pref of subscribed) {
      all.push(
        ...generateUpcomingOccurrences({
          vratSlug: pref.vrat_type,
          windowDays: 90,
          location,
          tradition,
          locale,
        }),
      );
    }
    return all.sort((a, b) => a.fastDate.localeCompare(b.fastDate)).slice(0, 30);
  }, [profile, prefs, locale]);

  const updateProfile = useCallback(
    async (patch: Partial<VratProfile>): Promise<boolean> => {
      if (!user) return false;
      const supabase = getSupabase();
      if (!supabase) return false;
      setSaving(true);
      const { error } = await supabase.from('user_profiles').update(patch).eq('id', user.id);
      setSaving(false);
      if (error) {
        console.error('[vrats] profile update failed:', error.message);
        return false;
      }
      setProfile((prev) => (prev ? { ...prev, ...patch } : (patch as VratProfile)));
      return true;
    },
    [user],
  );

  const subscribeToVrat = useCallback(
    async (vrat: TrackableVrat, enable: boolean) => {
      if (!user) return;
      // Tradition-dependent vrats need a tradition first.
      if (enable && vrat.traditionDependent && !profile?.vrat_tradition) {
        setPendingSubscribeSlug(vrat.slug);
        setShowTraditionModal(true);
        return;
      }
      const supabase = getSupabase();
      if (!supabase) return;
      setSaving(true);
      const { error } = await supabase
        .from('user_vrat_preferences')
        .upsert(
          {
            user_id: user.id,
            vrat_type: vrat.slug,
            enabled: enable,
            email_reminders: true,
            remind_day_before: true,
            remind_parana: false,
          },
          { onConflict: 'user_id,vrat_type' },
        );
      setSaving(false);
      if (error) {
        console.error('[vrats] subscribe failed:', error.message);
        return;
      }
      setPrefs((prev) => ({
        ...prev,
        [vrat.slug]: {
          vrat_type: vrat.slug,
          enabled: enable,
          remind_day_before: true,
          remind_parana: false,
        },
      }));
    },
    [user, profile],
  );

  const onTraditionPicked = useCallback(
    async (tradition: VratTradition) => {
      const ok = await updateProfile({ vrat_tradition: tradition });
      setShowTraditionModal(false);
      if (ok && pendingSubscribeSlug) {
        const vrat = getTrackableVrat(pendingSubscribeSlug);
        if (vrat) await subscribeToVrat(vrat, true);
      }
      setPendingSubscribeSlug(null);
    },
    [pendingSubscribeSlug, subscribeToVrat, updateProfile],
  );

  const onLocationPicked = useCallback(
    async (loc: SelectedLocation) => {
      await updateProfile({
        vrat_location_city: loc.city,
        vrat_location_lat: loc.lat,
        vrat_location_lng: loc.lng,
        vrat_location_tz: loc.tz,
      });
    },
    [updateProfile],
  );

  const onParanaOffsetChange = useCallback(
    async (mins: number) => {
      await updateProfile({ parana_reminder_offset_minutes: mins });
    },
    [updateProfile],
  );

  const generateOrRotateToken = useCallback(async () => {
    if (profile?.vrat_calendar_token) {
      const msg = t.regenWarn;
      if (!window.confirm(msg)) return;
    }
    const newToken = generateCalendarToken();
    await updateProfile({ vrat_calendar_token: newToken });
  }, [profile, t.regenWarn, updateProfile]);

  const feedUrl = profile?.vrat_calendar_token
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://dekhopanchang.com'}/api/calendar/feed/${profile.vrat_calendar_token}`
    : null;

  const copyFeedUrl = useCallback(async () => {
    if (!feedUrl) return;
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopyMsg(t.copied);
      setTimeout(() => setCopyMsg(null), 1500);
    } catch (err) {
      console.error('[vrats] clipboard write failed:', err);
    }
  }, [feedUrl, t.copied]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gold-light mb-2">{t.title}</h1>
        <p className="text-text-secondary">{t.needAuth}</p>
      </div>
    );
  }

  const titleFontStyle = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined;
  const enabledSlugs = new Set(
    Object.values(prefs).filter((p) => p.enabled).map((p) => p.vrat_type),
  );

  const grouped = {
    ekadashi: TRACKABLE_VRATS.filter((v) => v.category === 'ekadashi'),
    monthly: TRACKABLE_VRATS.filter(
      (v) => v.category !== 'ekadashi' && v.category !== 'weekday',
    ),
    weekly: TRACKABLE_VRATS.filter((v) => v.category === 'weekday'),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-6 h-6 text-gold-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gold-light" style={titleFontStyle}>
            {t.title}
          </h1>
        </div>
        <p className="text-text-secondary text-sm">{t.subtitle}</p>
        {saving && (
          <p className="text-xs text-text-secondary mt-2 flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t.saving}
          </p>
        )}
      </motion.div>

      {/* Settings card */}
      <section className="mb-8 p-5 sm:p-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl">
        <h2 className="text-lg font-semibold text-text-primary mb-5" style={titleFontStyle}>
          {t.settings}
        </h2>

        {/* Location */}
        <div className="mb-6">
          <LocationPicker
            locale={locale}
            current={
              profile?.vrat_location_city && profile.vrat_location_lat != null && profile.vrat_location_lng != null && profile.vrat_location_tz
                ? {
                    city: profile.vrat_location_city,
                    lat: profile.vrat_location_lat,
                    lng: profile.vrat_location_lng,
                    tz: profile.vrat_location_tz,
                  }
                : null
            }
            onSelect={onLocationPicked}
          />
        </div>

        {/* Tradition */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-primary" style={titleFontStyle}>
              {t.tradition}
            </span>
            <button
              type="button"
              onClick={() => setShowTraditionModal(true)}
              className="text-xs px-3 py-1.5 rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10"
            >
              {profile?.vrat_tradition ? (isHi ? (profile.vrat_tradition === 'smarta' ? 'स्मार्त' : 'वैष्णव') : profile.vrat_tradition) : t.setTradition}
            </button>
          </div>
        </div>

        {/* Parana offset */}
        <div className="mb-6">
          <span className="text-sm font-semibold text-text-primary block mb-2" style={titleFontStyle}>
            {t.paranaOffset}
          </span>
          <div className="flex gap-2">
            {[15, 30, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => onParanaOffsetChange(mins)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                  profile?.parana_reminder_offset_minutes === mins
                    ? 'border-gold-primary bg-gold-primary/10 text-gold-light'
                    : 'border-white/10 text-text-secondary hover:border-gold-primary/30'
                }`}
                aria-pressed={profile?.parana_reminder_offset_minutes === mins}
              >
                {mins} {t.minutesBefore}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar feed */}
        <div>
          <span className="text-sm font-semibold text-text-primary block mb-1" style={titleFontStyle}>
            {t.calendarFeed}
          </span>
          <p className="text-xs text-text-secondary mb-3">{t.feedHint}</p>
          {feedUrl ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={feedUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 px-3 py-2 bg-[#1a1040]/40 border border-white/10 rounded-lg text-text-secondary text-xs font-mono"
              />
              <button
                type="button"
                onClick={copyFeedUrl}
                className="flex items-center gap-1.5 px-3 py-2 bg-gold-primary/10 border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/20 text-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                {copyMsg ?? t.copy}
              </button>
              <button
                type="button"
                onClick={generateOrRotateToken}
                className="flex items-center gap-1.5 px-3 py-2 border border-white/15 text-text-secondary rounded-lg hover:bg-white/5 text-sm"
                title={t.regenWarn}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t.regenerate}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={generateOrRotateToken}
              className="flex items-center gap-2 px-4 py-2 bg-gold-primary/10 border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/20 text-sm"
            >
              <Calendar className="w-4 h-4" />
              {t.generateFeed}
            </button>
          )}
        </div>
      </section>

      {/* Browse */}
      <section className="mb-8 p-5 sm:p-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl">
        <h2 className="text-lg font-semibold text-text-primary mb-5" style={titleFontStyle}>
          {t.browse}
        </h2>
        {(['ekadashi', 'monthly', 'weekly'] as const).map((group) => {
          const vrats = grouped[group];
          if (vrats.length === 0) return null;
          return (
            <div key={group} className="mb-6 last:mb-0">
              <h3 className="text-xs uppercase tracking-widest text-gold-dark font-semibold mb-3">
                {group === 'ekadashi' ? 'Ekadashi' : group === 'weekly' ? (isHi ? 'साप्ताहिक' : 'Weekly') : (isHi ? 'मासिक / वार्षिक' : 'Tithi + Festival')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vrats.map((vrat) => {
                  const isOn = enabledSlugs.has(vrat.slug);
                  return (
                    <button
                      key={vrat.slug}
                      type="button"
                      onClick={() => subscribeToVrat(vrat, !isOn)}
                      aria-pressed={isOn}
                      className={`relative p-4 rounded-xl border text-left transition ${
                        isOn
                          ? 'border-gold-primary/40 bg-gold-primary/10'
                          : 'border-white/8 hover:border-gold-primary/25 bg-bg-primary/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-semibold text-text-primary text-sm" style={titleFontStyle}>
                          {tl(vrat.name, locale)}
                        </span>
                        <div
                          className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                            isOn ? 'bg-gold-primary border-gold-primary' : 'border-text-secondary/40'
                          }`}
                        >
                          {isOn && <Check className="w-3 h-3 text-bg-primary" />}
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mb-2">
                        {tl(vrat.description, locale)}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap text-[10px] uppercase tracking-wider">
                        <span className="text-gold-dark">{tl(vrat.frequencyLabel, locale)}</span>
                        <span className="text-text-secondary">·</span>
                        <span className="text-text-secondary">
                          {t.deity}: <span className="text-text-primary">{tl(vrat.deity, locale)}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Upcoming */}
      <section className="p-5 sm:p-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl">
        <h2 className="text-lg font-semibold text-text-primary mb-1" style={titleFontStyle}>
          {t.upcoming}
        </h2>
        {!profile?.vrat_location_lat ? (
          <p className="text-sm text-amber-400 mt-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {t.needLocation}
          </p>
        ) : occurrences.length === 0 ? (
          <p className="text-sm text-text-secondary mt-3">{t.noUpcoming}</p>
        ) : (
          <ul className="mt-3 divide-y divide-white/5">
            {occurrences.map((occ) => (
              <li key={`${occ.vrat.slug}-${occ.fastDate}`} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-text-primary" style={titleFontStyle}>
                      {tl(occ.vrat.name, locale)}
                    </span>
                    <span className="text-xs text-gold-dark uppercase tracking-wider">
                      {tl(occ.vrat.frequencyLabel, locale)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatDate(occ.fastDate, locale)}
                    {occ.paranaDate && occ.paranaStartLocal && occ.paranaEndLocal && (
                      <>
                        {' · '}
                        {t.paranaRule}: {formatDate(occ.paranaDate, locale)} {occ.paranaStartLocal}-{occ.paranaEndLocal}
                      </>
                    )}
                    {occ.paranaRule === 'moonrise' && (
                      <>
                        {' · '}
                        {isHi ? 'चन्द्रोदय पर पारण' : 'Parana at moonrise'}
                      </>
                    )}
                  </p>
                  {occ.vrat.pujaSlug && (
                    <Link
                      href={`/puja/${occ.vrat.pujaSlug}`}
                      className="text-xs text-gold-light hover:underline mt-1 inline-block"
                    >
                      {isHi ? 'पूजा विधि' : 'Puja vidhi'} →
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showTraditionModal && (
        <TraditionPickerModal
          locale={locale}
          onPick={onTraditionPicked}
          onCancel={() => {
            setShowTraditionModal(false);
            setPendingSubscribeSlug(null);
          }}
        />
      )}
    </div>
  );
}
