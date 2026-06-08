'use client';

/**
 * Client-side wrapper for /regional. Receives fully-computed calendar
 * cards (with engine-computed boundaries + new-year info + current-month
 * index) as props from the server component at page.tsx. This split
 * keeps the heavy astronomical engine work (computeRegionalMonthBoundaries,
 * buildYearlyTithiTable) on the server where it has filesystem access to
 * precomputed tithi tables, and the browser only renders the data —
 * eliminating the multi-second main-thread freeze that Gemini PR #355
 * round-1 HIGH flagged for the previous all-client implementation.
 *
 * What still lives client-side (and why):
 *  - Year-picker buttons (use next/navigation router.push to navigate
 *    to ?year=N — that triggers a fresh server render of page.tsx with
 *    the new year's data streamed back as an RSC payload).
 *  - Chip-picker scroll-spy (IntersectionObserver needs browser APIs).
 *  - framer-motion animations (motion.div requires client).
 *
 * Server passes both today (IST) AND currentIdx pre-computed — client
 * never re-computes "today" so users in non-IST timezones still see
 * the correct current-month highlight per the cultural anchor.
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LocaleText, Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import MSG from '@/messages/pages/regional.json';
import { isDevanagariLocale, pickByScript } from '@/lib/utils/locale-fonts';
import type { MonthBoundary, RegionalNewYear, RegionalCalendarId } from '@/lib/calendar/regional-calendar-boundaries';

// Year range matches `/calendars/masa` (HINDU_YEAR_RANGE) so users get
// the same back/forward navigation behaviour across both pages.
export const YEAR_RANGE = { min: 2024, max: 2030 };

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

// ── Calendar tradition picker chips (NOT language chips) ─────────────
// Each chip jumps to the matching calendar CARD on this same page.
// Hindi is the exception: it links OUT to /panchang because no
// Hindi-specific regional calendar card exists here.
interface ChipDef {
  id: string;
  label: string;
  externalHref?: string;
}
const CALENDAR_CHIPS: ChipDef[] = [
  { id: 'bengali',   label: 'Bengali' },
  { id: 'tamil',     label: 'Tamil' },
  { id: 'telugu',    label: 'Telugu' },
  { id: 'kannada',   label: 'Kannada' },
  { id: 'gujarati',  label: 'Gujarati' },
  { id: 'marathi',   label: 'Marathi' },
  { id: 'malayalam', label: 'Malayalam' },
  { id: 'odia',      label: 'Odia' },
  { id: 'mithila',   label: 'Mithila' },
  { id: 'hindi',     label: 'Hindi (Vikram Samvat)', externalHref: '/panchang' },
];

// ── Card props (engine-computed, passed from server) ─────────────────
export interface CalendarCard {
  id: RegionalCalendarId;
  name: LocaleText;
  type: 'solar' | 'lunisolar';
  script: string;
  description: LocaleText;
  festivals: { name: string; month: number; description: LocaleText }[];
  boundaries: MonthBoundary[];
  newYearInfo: RegionalNewYear;
  /** index of current month in boundaries[], or null if today is outside the year */
  currentIdx: number | null;
}

interface ClientProps {
  cards: CalendarCard[];
  year: number;
  locale: Locale;
}

// Locale → BCP-47 tag for Intl.DateTimeFormat. We use generic
// language tags rather than regional variants because month-name
// rendering doesn't vary meaningfully by region (e.g. ta-IN vs ta-LK
// both give the same Tamil month abbreviations).
const LOCALE_TO_BCP47: Record<Locale, string> = {
  en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN',
  kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN',
};

function fmtMonthDate(iso: string, locale: Locale): string {
  if (!iso) return '';
  // Defensive parse: engine returns YYYY-MM-DD but guard against
  // malformed input so we never render "undefined undefined" if an
  // upstream change emits a different shape. Gemini PR #355 round-3.
  const parts = iso.split('-');
  if (parts.length < 3) return '';
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!Number.isFinite(m) || !Number.isFinite(d) || m < 1 || m > 12) return '';
  // Locale-aware month abbreviation via Intl.DateTimeFormat (Gemini PR
  // #355 round-4 MEDIUM — was English-only, broke localised experience
  // on Tamil/Telugu/Bengali/Kannada/Gujarati/Marathi). Maithili falls
  // back to Hindi for date formatting since its script + month names
  // overlap with Hindi.
  const bcp47 = LOCALE_TO_BCP47[locale] ?? 'en-IN';
  // Use noon UTC so the date doesn't shift due to timezone (we only
  // care about the month name + numeric day, both timezone-stable).
  const dt = new Date(Date.UTC(2000, m - 1, d, 12));
  const monthName = new Intl.DateTimeFormat(bcp47, { month: 'short' }).format(dt);
  return `${monthName} ${d}`;
}

/**
 * Current Gregorian year in Asia/Kolkata — matches the server's
 * todayISTYear() so client and server agree on what "current year"
 * means for the clean-URL navigation (don't emit ?year= when on
 * the current year). Gemini PR #355 round-3.
 */
function currentISTYear(): number {
  const y = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
  }).format(new Date());
  return parseInt(y, 10);
}

export default function RegionalCalendarsClient({ cards, year, locale }: ClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const typeColors = {
    solar: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', badge: 'bg-amber-500/20 text-amber-300' },
    lunisolar: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/5', badge: 'bg-indigo-500/20 text-indigo-300' },
  };

  // ── Year picker — navigate via router.replace to ?year=N so the
  // server component re-fetches with the new year. `replace` (not
  // `push`) avoids cluttering browser history — year selection is a
  // filter, not a navigation event the user would want to "go back"
  // through (Gemini PR #355 round-4 MEDIUM). The server does the
  // heavy engine compute; client just renders the streamed data. ─
  function navigateToYear(nextYear: number): void {
    const params = new URLSearchParams(searchParams.toString());
    // Use IST year (matches server's todayISTYear) so clean-URL
    // suppression of ?year= agrees with server-side rendering.
    // Gemini PR #355 round-3.
    if (nextYear === currentISTYear()) {
      params.delete('year');
    } else {
      params.set('year', String(nextYear));
    }
    const qs = params.toString();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const path = `${window.location.pathname}${qs ? '?' + qs : ''}${hash}`;
    router.replace(path, { scroll: false });
  }

  // ── Scroll-spy: highlight the chip whose card is in the top portion
  // of the viewport. SSR-safe initial state ('bengali'), then sync from
  // URL hash on mount (per Gemini PR #355 round-1 MEDIUM — prevents
  // hydration mismatch from window.location.hash).
  //
  // `isManualScroll` ref suppresses the observer during a chip-click
  // smooth-scroll, so the chip highlight doesn't flicker through every
  // intermediate card the scroll passes (Gemini PR #355 round-3). The
  // ref is set on click and cleared 1000ms later via scrollTimeout
  // (smooth scroll usually completes well within that window). ────
  const [activeChipId, setActiveChipId] = useState<string>('bengali');
  const isManualScroll = useRef<boolean>(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Sync initial activeChipId from URL hash if present
    const hash = window.location.hash.replace('#', '');
    if (hash) setActiveChipId(hash);

    const ids = cards.map(c => c.id);
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return;  // suppress during chip-click animation
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveChipId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => {
      observer.disconnect();
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [cards]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">
            {msg('pageTitle', locale)}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto">
          {msg('pageSubtitle', locale)}
        </p>
      </motion.div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500/60" />
          <span className="text-text-secondary text-sm">{msg('solarCalendar', locale)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500/60" />
          <span className="text-text-secondary text-sm">{msg('lunisolarCalendar', locale)}</span>
        </div>
      </div>

      {/* Year picker — buttons navigate via router.push (server re-fetches) */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => navigateToYear(Math.max(YEAR_RANGE.min, year - 1))}
          disabled={year <= YEAR_RANGE.min}
          aria-label="Previous year"
          className="p-2.5 rounded-xl border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-gold-light text-xl font-bold min-w-[120px] text-center" style={headingFont}>
          {year}
        </h2>
        <button
          onClick={() => navigateToYear(Math.min(YEAR_RANGE.max, year + 1))}
          disabled={year >= YEAR_RANGE.max}
          aria-label="Next year"
          className="p-2.5 rounded-xl border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar-tradition chips. Labels derived from the matching
          card's localised `name` (LocaleText) so chips read in the
          active locale's script. The Hindi chip has no in-page card —
          it links OUT to /panchang — so it uses a dedicated
          `hindiVikramSamvat` translation key. Gemini PR #355 round-6
          MEDIUM. */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl mx-auto">
        {CALENDAR_CHIPS.map((chip) => {
          const isActive = chip.id === activeChipId;
          const card = cards.find((c) => c.id === chip.id);
          const label = card
            ? tl(card.name, locale)
            : chip.id === 'hindi'
              ? msg('hindiVikramSamvat', locale)
              : chip.label;
          const cls = `px-3 py-1.5 rounded-full text-sm transition-colors border ${
            isActive
              ? 'bg-gold-primary/15 border-gold-primary text-gold-light font-semibold'
              : 'border-gold-primary/20 text-text-secondary hover:bg-gold-primary/10 hover:text-gold-light'
          }`;
          if (chip.externalHref) {
            return (
              <Link key={chip.id} href={{ pathname: chip.externalHref as '/panchang' }} className={cls}>
                {label}
              </Link>
            );
          }
          return (
            <a
              key={chip.id}
              href={`#${chip.id}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(chip.id);
                if (target) {
                  // Suppress scroll-spy during the smooth-scroll
                  // animation so the chip highlight doesn't flicker
                  // through intermediate cards. Re-enabled after 1s
                  // (smooth scroll usually finishes in <600ms).
                  isManualScroll.current = true;
                  setActiveChipId(chip.id);
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  // Use window.history for explicit global resolution
                  // (Gemini PR #355 round-6 — safer in case any
                  // wrapper shadows the bare `history` global).
                  window.history.replaceState(null, '', `#${chip.id}`);
                  if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
                  scrollTimeout.current = setTimeout(() => {
                    isManualScroll.current = false;
                  }, 1000);
                }
              }}
              className={cls}
            >
              {label}
            </a>
          );
        })}
      </div>

      {/* Calendar Cards */}
      <div className="space-y-10">
        {cards.map((cal, i) => {
          const colors = typeColors[cal.type];
          const currentMonth = cal.currentIdx !== null ? cal.boundaries[cal.currentIdx] : null;
          return (
            <motion.div
              key={cal.id}
              id={cal.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`scroll-mt-24 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden border-2 ${colors.border}`}
            >
              {/* Header */}
              <div className={`p-6 sm:p-8 ${colors.bg}`}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-gold-light text-2xl sm:text-3xl font-bold" style={headingFont}>
                        {tl(cal.name, locale)}
                      </h2>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${colors.badge}`}>
                        {cal.type}
                      </span>
                    </div>
                    <div className="text-text-secondary/75 text-lg font-mono">{cal.script}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gold-dark text-xs uppercase tracking-wider mb-1">
                      {msg('currentMonth', locale)}
                    </div>
                    <div className="text-gold-light text-lg font-bold">
                      {currentMonth?.name ?? '—'}
                    </div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mt-4 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(cal.description, locale)}
                </p>
              </div>

              {/* New Year */}
              <div className="px-6 sm:px-8 py-4 border-t border-b border-gold-primary/10 bg-gold-primary/5">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-gold-primary font-bold">{msg('newYear', locale)}</span>
                  <span className="text-gold-light font-bold">{cal.newYearInfo.name}</span>
                  <span className="text-text-secondary/70"> – </span>
                  <span className="text-text-secondary text-xs">
                    {cal.newYearInfo.date ? `${fmtMonthDate(cal.newYearInfo.date, locale)}, ${year}` : '—'}
                  </span>
                </div>
              </div>

              {/* Month Grid */}
              <div className="p-6 sm:p-8">
                <h3 className="text-gold-dark text-xs uppercase tracking-[0.2em] font-bold mb-4">
                  {msg('months', locale)}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {cal.boundaries.map((month, j) => {
                    const isCurrent = j === cal.currentIdx;
                    return (
                      <div
                        key={j}
                        className={`rounded-lg p-3 text-center transition-all ${
                          isCurrent
                            ? 'bg-gold-primary/15 border border-gold-primary/40 ring-1 ring-gold-primary/20'
                            : 'bg-bg-tertiary/20 border border-gold-primary/5'
                        }`}
                      >
                        {month.isAdhika && (
                          <div className="inline-block px-1.5 py-0.5 mb-1 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200">
                            {msg('adhika', locale)}
                          </div>
                        )}
                        <div className={`text-sm font-bold ${isCurrent ? 'text-gold-light' : 'text-text-secondary'}`}>
                          {month.name}
                        </div>
                        <div className="text-text-secondary/65 text-xs mt-0.5">
                          {fmtMonthDate(month.startDate, locale)} – {fmtMonthDate(month.endDate, locale)}
                        </div>
                        {isCurrent && (
                          <div className="text-gold-primary text-xs font-bold mt-1 animate-pulse">
                            {msg('now', locale)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Festivals */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                <GoldDivider />
                <h3 className="text-gold-dark text-xs uppercase tracking-[0.2em] font-bold mb-4 mt-4">
                  {msg('keyFestivals', locale)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cal.festivals.map((fest, k) => (
                    <div key={k} className="rounded-lg p-4 bg-bg-primary/40 border border-gold-primary/10">
                      <div className="text-gold-light text-sm font-bold mb-1">{fest.name}</div>
                      <p className="text-text-secondary/70 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {tl(fest.description, locale)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Link to full detail page. Label localised via
                    regional.json `viewFullCalendar` (Gemini PR #355
                    round-4 MEDIUM — was English-only for non-Devanagari
                    locales). */}
                <Link
                  href={{ pathname: `/calendar/regional/${cal.id}` as never }}
                  className="mt-4 inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors text-sm font-semibold group"
                >
                  {msg('viewFullCalendar', locale)}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="mt-12">
        <h2 className="text-gold-gradient text-2xl font-bold text-center mb-6" style={headingFont}>
          {msg('calendarComparison', locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{msg('tradition', locale)}</th>
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{msg('type', locale)}</th>
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{msg('era', locale)}</th>
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{msg('yearStarts', locale)}</th>
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{msg('firstMonth', locale)}</th>
              </tr>
            </thead>
            <tbody>
              {/* Comparison table rows derived from the localised `cards`
                  prop + per-calendar translation keys in regional.json.
                  Replaces a hardcoded English row array (Gemini PR #355
                  round-6 MEDIUM). Row order is fixed and intentional —
                  Bengali first per the page's primary audience, Mithila
                  last as the newest addition. */}
              {(['bengali', 'tamil', 'telugu', 'kannada', 'gujarati', 'marathi', 'malayalam', 'odia', 'mithila'] as const).map((id) => {
                const card = cards.find((c) => c.id === id);
                if (!card) return null;
                const typeKey =
                  id === 'mithila' ? 'typeLunisolarPurnimant'
                  : card.type === 'solar' ? 'typeSolar'
                  : 'typeLunisolar';
                // `boundaries[0].name` is the first month rendered in the
                // card (already localised by the engine). Falls back to
                // empty if boundaries is empty (defensive — should not
                // happen for any valid year).
                const firstMonthName = card.boundaries[0]?.name ?? '';
                return (
                  <tr key={id} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                    <td className="px-4 py-3 text-gold-light font-bold">{tl(card.name, locale)}</td>
                    <td className="px-4 py-3 text-text-secondary">{msg(typeKey, locale)}</td>
                    <td className="px-4 py-3 text-text-secondary">{msg(`era_${id}`, locale)}</td>
                    <td className="px-4 py-3 text-text-secondary">{msg(`start_${id}`, locale)}</td>
                    <td className="px-4 py-3 text-text-secondary">{firstMonthName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ISKCON Vaishnava Calendar cross-link */}
      <div className="mt-12">
        <Link
          href={{ pathname: '/calendar/regional/iskcon' as never }}
          className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 hover:border-gold-primary/40 rounded-2xl p-6 sm:p-8 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gold-light text-xl sm:text-2xl font-bold mb-2" style={headingFont}>
                {pickByScript('ISKCON Vaishnava Calendar', 'इस्कॉन वैष्णव पंचांग', locale)}
              </h3>
              <p className="text-text-secondary text-sm max-w-2xl">
                {pickByScript('Gaudiya Vaishnava festivals, Ekadashi with Maha Dvadashi rules, and acharya appearance/disappearance days', 'गौड़ीय वैष्णव पर्व, एकादशी (महा द्वादशी नियमों सहित), और आचार्यों के प्रकट/तिरोभाव दिवस', locale)}
              </p>
            </div>
            <ArrowRight className="w-6 h-6 text-gold-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>
        </Link>
      </div>
    </div>
  );
}
