'use client';

/**
 * Daily "Today for Your Career" card.
 *
 * Surfaces the single best window across all 8 career activities for the
 * given panchang day, names which activity that window favours most, and
 * warns about the closest inauspicious overlay the user should avoid.
 * Falls back to a useful empty-state when no good window exists.
 *
 * Lives on:
 *   - /panchang (PanchangClient — inline, after the Choghadiya block)
 *   - /dashboard (planned — same component)
 *
 * The card is intentionally a client component: PanchangData is already
 * on the client by the time PanchangClient renders, so reusing the
 * existing panchang object lets us avoid a duplicate computePanchang call.
 *
 * Per CLAUDE.md "loading state must always terminate" + "no dead clicks":
 * if computeDayVerdict throws for every activity, the card renders a
 * static "career muhurta unavailable for this location" with a link to
 * the full /career-muhurta page rather than disappearing silently.
 */
import { useMemo, useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Briefcase, AlertTriangle, ArrowRight } from 'lucide-react';
import { computeDayVerdict } from '@/lib/muhurta/verdict-engine';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { CAREER_ACTIVITY_IDS, type CareerActivityId } from '@/types/muhurta-ai';
import type { VerdictRating } from '@/lib/muhurta/verdict-types';
import type { PanchangData, Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { todayInTimezone } from '@/lib/utils/now-in-timezone';
import { useLocationStore } from '@/stores/location-store';

/** Strict order from worst to best — used to pick the highest verdict. */
const RATING_ORDER: Record<VerdictRating, number> = {
  avoid: 0,
  caution: 1,
  good: 2,
  very_good: 3,
  excellent: 4,
  exceptional: 5,
};

const POSITIVE_RATINGS: ReadonlySet<VerdictRating> = new Set(['good', 'very_good', 'excellent', 'exceptional']);

interface BestPick {
  activityId: CareerActivityId;
  startTime: string;
  endTime: string;
  rating: VerdictRating;
}

/**
 * Result of scanning all 8 career activities for today's best window.
 *
 *   { best: BestPick, allFailed: false } — a positive window was found.
 *   { best: null,     allFailed: false } — no positive window, but at
 *      least one activity computed cleanly (today is just not auspicious
 *      for any of the 8 career acts). Render the friendly "routine day"
 *      copy.
 *   { best: null,     allFailed: true  } — every computeDayVerdict
 *      threw. Probably a location / panchang-engine problem. Render
 *      the L.unavailable error fallback instead of pretending the day
 *      is just "routine" — distinguishing these prevents a silent
 *      degraded state.
 */
function pickBestCareerWindow(panchang: PanchangData): { best: BestPick | null; allFailed: boolean } {
  let best: BestPick | null = null;
  let successCount = 0;
  for (const id of CAREER_ACTIVITY_IDS) {
    try {
      const verdict = computeDayVerdict(panchang, id);
      successCount++;
      const w = verdict.bestWindow;
      if (!w || !POSITIVE_RATINGS.has(w.verdict)) continue;
      // Tie-break: higher rating wins; on tie, earlier start time wins.
      if (
        best === null ||
        RATING_ORDER[w.verdict] > RATING_ORDER[best.rating] ||
        (RATING_ORDER[w.verdict] === RATING_ORDER[best.rating] && w.start < best.startTime)
      ) {
        best = { activityId: id, startTime: w.start, endTime: w.end, rating: w.verdict };
      }
    } catch (err) {
      // One activity failing shouldn't take down the whole card.
      // Log + continue. Lesson A — no silent swallow.
      console.error(`[career-card] computeDayVerdict failed for ${id}:`, err);
    }
  }
  return { best, allFailed: successCount === 0 };
}

interface CardCopy {
  title: string;
  bestWindow: string;
  favouredFor: string;
  avoid: string;
  rahuKaal: string;
  noWindow: string;
  seeAll: string;
  unavailable: string;
}

// Date-aware copy: pass dateLabel='' when isToday, otherwise the
// formatted date (e.g. "Fri, May 30"). Lets a non-today panchang
// view render an honest title instead of lying with "Today".
function buildCopy(lang: 'en' | 'hi' | 'ta', dateLabel: string): CardCopy {
  const isToday = dateLabel === '';
  if (lang === 'ta') {
    return {
      title: isToday ? 'இன்று உங்கள் தொழிலுக்கு' : `${dateLabel} உங்கள் தொழிலுக்கு`,
      bestWindow: isToday ? 'இன்றைய சிறந்த நேரம்' : `${dateLabel} சிறந்த நேரம்`,
      favouredFor: 'பொருத்தம்',
      avoid: 'தவிர்க்கவும்',
      rahuKaal: 'ராகு காலம்',
      noWindow: isToday
        ? 'இன்று வழக்கமான வேலைகளுக்கு உகந்தது, புதிய தொழில் முடிவுகளுக்கு அல்ல.'
        : `${dateLabel} வழக்கமான வேலைகளுக்கு உகந்தது, புதிய தொழில் முடிவுகளுக்கு அல்ல.`,
      seeAll: 'அனைத்து தொழில் முகூர்த்தங்கள்',
      unavailable: 'இந்த இடத்திற்கு தொழில் முகூர்த்தம் கிடைக்கவில்லை.',
    };
  }
  if (lang === 'hi') {
    return {
      title: isToday ? 'आज आपके करियर के लिए' : `${dateLabel} को आपके करियर के लिए`,
      bestWindow: isToday ? 'आज की सर्वश्रेष्ठ अवधि' : `${dateLabel} की सर्वश्रेष्ठ अवधि`,
      favouredFor: 'अनुकूल',
      avoid: 'टालें',
      rahuKaal: 'राहु काल',
      noWindow: isToday
        ? 'आज दिनचर्या के कार्यों के लिए उपयुक्त है, नए करियर निर्णयों के लिए नहीं।'
        : `${dateLabel} दिनचर्या के कार्यों के लिए उपयुक्त है, नए करियर निर्णयों के लिए नहीं।`,
      seeAll: 'सभी करियर मुहूर्त देखें',
      unavailable: 'इस स्थान के लिए करियर मुहूर्त उपलब्ध नहीं।',
    };
  }
  return {
    title: isToday ? 'Today for Your Career' : `${dateLabel} for Your Career`,
    bestWindow: isToday ? 'Best window today' : `Best window on ${dateLabel}`,
    favouredFor: 'Favours',
    avoid: 'Avoid',
    rahuKaal: 'Rahu Kaal',
    noWindow: isToday
      ? 'Today is best used for routine work, not new career moves.'
      : `${dateLabel} is best used for routine work, not new career moves.`,
    seeAll: 'See all career muhurtas',
    unavailable: 'Career muhurta unavailable for this location.',
  };
}

function pickLang(locale: string): 'en' | 'hi' | 'ta' {
  if (locale === 'ta') return 'ta';
  if (locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr') return 'hi';
  return 'en';
}

// Same locale → BCP-47 map used elsewhere on the panchang page.
const LOCALE_TO_BCP47: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN',
  kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN', sa: 'hi-IN',
};

function formatDateLabel(iso: string, locale: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '';
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  const bcp47 = LOCALE_TO_BCP47[locale] ?? 'en-IN';
  return new Intl.DateTimeFormat(bcp47, { weekday: 'short', month: 'short', day: 'numeric' }).format(dt);
}

export function TodayCareerCard({ panchang, timezone }: { panchang: PanchangData; timezone?: string }) {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  // Honest copy: when user picks a non-today date on /panchang, the
  // card title and copy must say "<date> for Your Career", not "Today
  // for Your Career". Compare panchang.date against today in the
  // panchang location's TZ.
  //
  // When parent passes `timezone` as a prop, server and client both see
  // the same value → lazy state initialiser is hydration-safe and
  // produces the correct "today/<date>" copy on first paint (no flash).
  // Without the prop, fall back to `panchang.date` for the initial
  // value to avoid a server-vs-client `todayInTimezone()` mismatch when
  // the location store hasn't hydrated yet (Gemini PR #357 round-3 HIGH).
  const storeTz = useLocationStore((s) => s.timezone);
  const tz = timezone || storeTz || 'Asia/Kolkata';
  const [todayIso, setTodayIso] = useState<string>(() =>
    timezone ? todayInTimezone(timezone) : panchang.date
  );
  useEffect(() => {
    setTodayIso(todayInTimezone(tz));
  }, [tz]);
  const isToday = panchang.date === todayIso;
  const dateLabel = isToday ? '' : formatDateLabel(panchang.date, locale);
  const L = buildCopy(pickLang(locale), dateLabel);

  const { best, allFailed } = useMemo(() => pickBestCareerWindow(panchang), [panchang]);

  // Rahu Kaal is canonically typed on PanchangData (src/types/panchang.ts:111)
  // as a required `{ start; end }` object — no cast needed. Earlier version
  // invented a `rahu_kaal` snake_case fallback that doesn't exist anywhere;
  // deep-audit caught the dead branch.
  const rahuKaal = panchang.rahuKaal;

  return (
    <div
      className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mt-6"
      role="region"
      aria-label={L.title}
    >
      <div className="flex items-center gap-2 mb-3">
        <Briefcase size={18} className="text-gold-primary" />
        <h3 className="text-gold-light font-semibold text-base uppercase tracking-wider" style={headingFont}>
          {L.title}
        </h3>
      </div>

      {allFailed ? (
        // Every activity threw — probably a panchang/location problem.
        // Surface the dedicated unavailable copy rather than the
        // "routine day" empty-state, which would silently disguise the
        // degraded state.
        <p className="text-text-secondary text-sm leading-relaxed">{L.unavailable}</p>
      ) : best ? (
        <>
          <div className="space-y-1.5">
            <p className="text-text-secondary text-xs">{L.bestWindow}</p>
            <p className="text-emerald-400 text-xl font-mono font-bold">
              {best.startTime} – {best.endTime}
            </p>
            <p className="text-text-primary text-sm">
              <span className="text-text-secondary">{L.favouredFor}:</span>{' '}
              <span className="font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {tl(getExtendedActivity(best.activityId).label, locale)}
              </span>
            </p>
          </div>

          {rahuKaal && (
            <div className="mt-3 flex items-start gap-2 text-xs text-red-300/85">
              <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
              <span>
                {L.avoid}: <span className="font-mono">{rahuKaal.start} – {rahuKaal.end}</span> ({L.rahuKaal})
              </span>
            </div>
          )}
        </>
      ) : (
        <p className="text-text-secondary text-sm leading-relaxed">{L.noWindow}</p>
      )}

      <Link
        href="/career-muhurta"
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold-primary hover:text-gold-light transition-colors"
      >
        {L.seeAll}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
