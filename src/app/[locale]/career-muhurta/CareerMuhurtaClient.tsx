'use client';

/**
 * Interactive Career Muhurta tool.
 *
 * Renders an activity selector (8 career activities) + the user's current
 * location + a 30-day forward window of best slots for the selected
 * activity. Reused on both the index page (defaultActivity prop)
 * and per-activity landing pages (activityLocked prop).
 *
 * Compute strategy: the client computes panchang + verdict for each of
 * the 30 dates on demand. With single-digit-ms compute per day, the
 * whole 30-day scan runs in ~50ms — no caching needed at the function
 * level. The expensive part is panchang itself, which we run once per
 * date+location combination via a `useMemo`.
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { computeDayVerdict } from '@/lib/muhurta/verdict-engine';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { todayInTimezone } from '@/lib/utils/now-in-timezone';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { useLocationStore } from '@/stores/location-store';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { CAREER_ACTIVITY_IDS, type CareerActivityId } from '@/types/muhurta-ai';
import { CAREER_CONTENT } from '@/lib/career/career-content';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import type { VerdictRating } from '@/lib/muhurta/verdict-types';
import type { Locale } from '@/types/panchang';

const DEFAULT_CITY: CityData = CITIES.find((c) => c.slug === 'mumbai') ?? CITIES[0];

const VERDICT_STYLE: Record<VerdictRating, { dot: string; label: { en: string; hi: string; ta: string } }> = {
  exceptional: { dot: 'bg-emerald-400', label: { en: 'Exceptional', hi: 'असाधारण', ta: 'அதி உயர்' } },
  excellent:   { dot: 'bg-emerald-400', label: { en: 'Excellent',   hi: 'उत्तम',     ta: 'சிறந்தது' } },
  very_good:   { dot: 'bg-emerald-300', label: { en: 'Very Good',   hi: 'अति शुभ',  ta: 'மிகச் சிறந்தது' } },
  good:        { dot: 'bg-amber-300',   label: { en: 'Good',        hi: 'शुभ',      ta: 'நல்லது' } },
  caution:     { dot: 'bg-amber-500',   label: { en: 'Caution',     hi: 'सावधान',   ta: 'எச்சரிக்கை' } },
  avoid:       { dot: 'bg-red-500',     label: { en: 'Avoid',       hi: 'टालें',    ta: 'தவிர்' } },
};

interface CareerMuhurtaClientProps {
  /** Initially selected activity. */
  defaultActivity?: CareerActivityId;
  /** If set, the activity picker is hidden — used on per-activity landing pages. */
  activityLocked?: CareerActivityId;
}

export default function CareerMuhurtaClient({ defaultActivity = 'job_interview', activityLocked }: CareerMuhurtaClientProps) {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const [activity, setActivity] = useState<CareerActivityId>(activityLocked ?? defaultActivity);
  const [city, setCity] = useState<CityData>(DEFAULT_CITY);

  // Pull stored location after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    const store = useLocationStore.getState();
    if (store.lat !== null && store.lng !== null) {
      setCity({
        slug: 'current',
        name: {
          en: store.name || 'Current Location',
          hi: store.name || 'वर्तमान स्थान',
          sa: store.name || 'वर्तमानस्थानम्',
        },
        lat: store.lat,
        lng: store.lng,
        timezone: store.timezone || 'UTC',
      });
    }
  }, []);

  // Build a list of 30 dates in YYYY-MM-DD form, starting today in the
  // selected city's timezone. Wrapped in useMemo on city.timezone so it
  // doesn't recompute on every render — and resolves "today" locally so
  // a user in IST doesn't see yesterday during the midnight-to-5:30 window.
  const dates = useMemo(() => {
    const todayStr = todayInTimezone(city.timezone);
    const [y, m, d] = todayStr.split('-').map(Number);
    const out: { dateStr: string; y: number; m: number; d: number; weekdayName: string }[] = [];
    for (let i = 0; i < 30; i++) {
      const dt = new Date(Date.UTC(y, m - 1, d + i));
      const ys = dt.getUTCFullYear();
      const ms = dt.getUTCMonth() + 1;
      const ds = dt.getUTCDate();
      out.push({
        dateStr: `${ys}-${String(ms).padStart(2, '0')}-${String(ds).padStart(2, '0')}`,
        y: ys,
        m: ms,
        d: ds,
        weekdayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dt.getUTCDay()],
      });
    }
    return out;
  }, [city.timezone]);

  // Compute the per-date verdict for the selected activity. Keyed on
  // city + activity so changing either re-runs. Single-digit-ms per day
  // means the whole 30-day scan is fast enough to run client-side.
  const verdicts = useMemo(() => {
    return dates.map((dt) => {
      try {
        const tzOffset = getUTCOffsetForDate(dt.y, dt.m, dt.d, city.timezone);
        const p = computePanchang({
          year: dt.y, month: dt.m, day: dt.d,
          lat: city.lat, lng: city.lng, tzOffset,
          timezone: city.timezone,
          locationName: city.name.en,
        });
        const v = computeDayVerdict(p, activity);
        return { date: dt, best: v.bestWindow, rating: v.bestWindow?.verdict ?? null };
      } catch (err) {
        console.error(`[career-muhurta] verdict failed for ${dt.dateStr}:`, err);
        return { date: dt, best: null, rating: null };
      }
    });
  }, [dates, city, activity]);

  const labelFor = (rating: VerdictRating | null): string => {
    if (!rating) return locale === 'ta' ? 'கிடைக்கவில்லை' : locale === 'hi' ? 'उपलब्ध नहीं' : 'No window';
    const ls = VERDICT_STYLE[rating].label;
    return locale === 'ta' ? ls.ta : isDevanagari ? ls.hi : ls.en;
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {!activityLocked && (
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-wider text-text-secondary block mb-1">
              {locale === 'ta' ? 'செயல்பாடு' : isDevanagari ? 'गतिविधि' : 'Activity'}
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as CareerActivityId)}
              className="w-full bg-[#161b42] border border-gold-primary/20 text-text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/15"
            >
              {CAREER_ACTIVITY_IDS.map((id) => (
                <option key={id} value={id}>{tl(getExtendedActivity(id).label, locale)}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex-1">
          <label className="text-[10px] uppercase tracking-wider text-text-secondary block mb-1 flex items-center gap-1">
            <MapPin size={11} />
            {locale === 'ta' ? 'நகரம்' : isDevanagari ? 'शहर' : 'City'}
          </label>
          <select
            value={city.slug}
            onChange={(e) => {
              const c = CITIES.find((x) => x.slug === e.target.value);
              if (c) setCity(c);
            }}
            className="w-full bg-[#161b42] border border-gold-primary/20 text-text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/15"
          >
            {['mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'kolkata', 'pune', 'ahmedabad'].map((slug) => {
              const c = CITIES.find((x) => x.slug === slug);
              return c ? <option key={slug} value={slug}>{tl(c.name, locale)}</option> : null;
            })}
          </select>
        </div>
      </div>

      {/* Section heading */}
      <h2 className="text-gold-light text-xl font-bold mb-4 flex items-center gap-2" style={headingFont}>
        <Calendar size={18} className="text-gold-primary" />
        {locale === 'ta'
          ? `${tl(getExtendedActivity(activity).label, locale)}க்கான அடுத்த 30 நாட்களின் முகூர்த்தம்`
          : isDevanagari
            ? `${tl(getExtendedActivity(activity).label, locale)} के लिए अगले 30 दिन के मुहूर्त`
            : `Next 30 days for ${tl(getExtendedActivity(activity).label, locale)}`}
      </h2>

      {/* 30-day grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {verdicts.map((v) => {
          const dimmed = v.rating === 'avoid' || v.rating === null;
          const style = v.rating ? VERDICT_STYLE[v.rating] : null;
          return (
            <div
              key={v.date.dateStr}
              className={`rounded-lg border p-3 flex items-center justify-between gap-2 ${dimmed ? 'border-white/5 bg-white/[0.01]' : 'border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27]'}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-text-primary text-sm font-medium">
                  {v.date.weekdayName} · {v.date.dateStr}
                </div>
                <div className="text-text-secondary text-xs mt-0.5">
                  {v.best
                    ? `${v.best.start} – ${v.best.end}`
                    : (locale === 'ta' ? 'நல்ல சாளரம் இல்லை' : isDevanagari ? 'कोई शुभ अवधि नहीं' : 'No good window')}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${style?.dot ?? 'bg-white/20'}`} />
                <span className="text-xs text-text-secondary whitespace-nowrap">{labelFor(v.rating)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-text-secondary/65 text-xs mt-6 max-w-3xl leading-relaxed">
        {locale === 'ta'
          ? 'குறிப்பு: முகூர்த்தம் வெற்றியின் வாய்ப்பை அதிகரிக்கிறது; அது தயாரிப்பை மாற்றாது. ராகு காலம், யமகண்டம், விஷ்டி கரணம் ஆகியவை எல்லா சாதகக் காரணிகளையும் கடந்து செயலை "தவிர்" என அறிக்கையிடுகின்றன.'
          : isDevanagari
            ? 'टिप्पणी: मुहूर्त सफलता की संभावना बढ़ाता है; तैयारी का स्थान नहीं लेता। राहु काल, यमगण्ड, और विष्टि करण सभी सकारात्मक कारकों को रद्द करते हुए अवधि को "टालें" चिह्नित करते हैं।'
            : 'Note: Muhurta raises the probability of a favourable outcome; it does not replace preparation. Rahu Kaal, Yamaganda, and Vishti karana override all positive factors and force a window to "Avoid".'}
      </p>

      {/* Cross-link to per-activity landing if currently on index */}
      {!activityLocked && (
        <Link
          href={`/career-muhurta/${CAREER_CONTENT[activity].slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold-primary hover:text-gold-light transition-colors"
        >
          {locale === 'ta'
            ? `${tl(getExtendedActivity(activity).label, locale)} பற்றி மேலும்`
            : isDevanagari
              ? `${tl(getExtendedActivity(activity).label, locale)} पर अधिक`
              : `More on ${tl(getExtendedActivity(activity).label, locale)}`}
          <ArrowRight size={14} />
        </Link>
      )}
    </section>
  );
}
