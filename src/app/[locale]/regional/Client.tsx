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

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LocaleText, Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import MSG from '@/messages/pages/regional.json';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
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

function fmtMonthDate(iso: string): string {
  if (!iso) return '';
  const [, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}`;
}

export default function RegionalCalendarsClient({ cards, year, locale }: ClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const typeColors = {
    solar: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', badge: 'bg-amber-500/20 text-amber-300' },
    lunisolar: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/5', badge: 'bg-indigo-500/20 text-indigo-300' },
  };

  // ── Year picker — navigate via router.push to ?year=N so the server
  // component re-fetches with the new year. The server does the heavy
  // engine compute; client just renders the streamed data. No client-
  // side state needed for `year` itself — it's a prop. ──────────────
  function navigateToYear(nextYear: number): void {
    const params = new URLSearchParams(searchParams.toString());
    const today = new Date();
    if (nextYear === today.getFullYear()) {
      params.delete('year');
    } else {
      params.set('year', String(nextYear));
    }
    const qs = params.toString();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const path = `${window.location.pathname}${qs ? '?' + qs : ''}${hash}`;
    router.push(path, { scroll: false });
  }

  // ── Scroll-spy: highlight the chip whose card is in the top portion
  // of the viewport. SSR-safe initial state ('bengali'), then sync from
  // URL hash on mount (per Gemini PR #355 round-1 MEDIUM — prevents
  // hydration mismatch from window.location.hash). ───────────────────
  const [activeChipId, setActiveChipId] = useState<string>('bengali');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Sync initial activeChipId from URL hash if present
    const hash = window.location.hash.replace('#', '');
    if (hash) setActiveChipId(hash);

    const ids = cards.map(c => c.id);
    const observer = new IntersectionObserver(
      (entries) => {
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
    return () => observer.disconnect();
  }, [cards]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">
            {isTamil ? 'பிராந்திய நாட்காட்டிகள்' : locale === 'en' ? 'Regional Calendars' : isDevanagari ? 'क्षेत्रीय पंचांग' : 'प्रादेशिकपञ्चाङ्गानि'}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto">
          {locale === 'en'
            ? 'India\'s diverse calendar traditions  –  Bengali, Tamil, Telugu, Kannada, Gujarati, Marathi, Malayalam, Odia, and Mithila  –  each with unique month names, new year dates, and regional festivals'
            : 'भारत की विविध पंचांग परम्पराएँ  –  बंगाली, तमिल, तेलुगु, कन्नड़, गुजराती, मराठी, मलयालम, ओड़िया और मैथिली  –  प्रत्येक की अपनी मास नाम, नववर्ष तिथि और क्षेत्रीय उत्सव'}
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

      {/* Calendar-tradition chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl mx-auto">
        {CALENDAR_CHIPS.map((chip) => {
          const isActive = chip.id === activeChipId;
          const cls = `px-3 py-1.5 rounded-full text-sm transition-colors border ${
            isActive
              ? 'bg-gold-primary/15 border-gold-primary text-gold-light font-semibold'
              : 'border-gold-primary/20 text-text-secondary hover:bg-gold-primary/10 hover:text-gold-light'
          }`;
          if (chip.externalHref) {
            return (
              <Link key={chip.id} href={{ pathname: chip.externalHref as '/panchang' }} className={cls}>
                {chip.label}
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
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  history.replaceState(null, '', `#${chip.id}`);
                  setActiveChipId(chip.id);
                }
              }}
              className={cls}
            >
              {chip.label}
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
                    {cal.newYearInfo.date ? fmtMonthDate(cal.newYearInfo.date) : '—'}, {year}
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
                            Adhika
                          </div>
                        )}
                        <div className={`text-sm font-bold ${isCurrent ? 'text-gold-light' : 'text-text-secondary'}`}>
                          {month.name}
                        </div>
                        <div className="text-text-secondary/65 text-xs mt-0.5">
                          {fmtMonthDate(month.startDate)} – {fmtMonthDate(month.endDate)}
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

                {/* Link to full detail page */}
                <Link
                  href={{ pathname: `/calendar/regional/${cal.id}` as never }}
                  className="mt-4 inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors text-sm font-semibold group"
                >
                  {isDevanagari ? 'पूर्ण कैलेंडर देखें' : `View Full ${tl(cal.name, 'en')} Calendar`}
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
              {[
                { name: 'Bengali', type: 'Solar', era: 'Bangabda', start: 'Boishakh (Apr 14)', first: 'Boishakh' },
                { name: 'Tamil', type: 'Solar', era: 'Thiruvalluvar', start: 'Chithirai (Apr 14)', first: 'Chithirai' },
                { name: 'Telugu', type: 'Lunisolar', era: 'Shalivahana Shaka', start: 'Chaitra Sh. Pratipada', first: 'Chaitra' },
                { name: 'Kannada', type: 'Lunisolar', era: 'Shalivahana Shaka', start: 'Chaitra Sh. Pratipada', first: 'Chaitra' },
                { name: 'Gujarati', type: 'Lunisolar', era: 'Vikram Samvat', start: 'Day after Diwali', first: 'Kartik' },
                { name: 'Marathi', type: 'Lunisolar', era: 'Shalivahana Shaka', start: 'Chaitra Sh. Pratipada', first: 'Chaitra' },
                { name: 'Malayalam', type: 'Solar', era: 'Kollam Era', start: 'Chingam (Aug 17)', first: 'Chingam' },
                { name: 'Odia', type: 'Solar', era: 'Amli / Odia Era', start: 'Pana Sankranti (Apr 14)', first: 'Baisakha' },
                { name: 'Mithila', type: 'Lunisolar (Purnimant)', era: 'Vikram Samvat', start: 'Chaitra Sh. Pratipada', first: 'Chaitra' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="px-4 py-3 text-gold-light font-bold">{row.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.type}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.era}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.start}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.first}</td>
                </tr>
              ))}
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
                {locale === 'hi' ? 'इस्कॉन वैष्णव पंचांग' : 'ISKCON Vaishnava Calendar'}
              </h3>
              <p className="text-text-secondary text-sm max-w-2xl">
                {locale === 'hi'
                  ? 'गौड़ीय वैष्णव पर्व, एकादशी (महा द्वादशी नियमों सहित), और आचार्यों के प्रकट/तिरोभाव दिवस'
                  : 'Gaudiya Vaishnava festivals, Ekadashi with Maha Dvadashi rules, and acharya appearance/disappearance days'}
              </p>
            </div>
            <ArrowRight className="w-6 h-6 text-gold-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>
        </Link>
      </div>
    </div>
  );
}
