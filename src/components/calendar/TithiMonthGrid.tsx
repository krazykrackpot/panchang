'use client';

import { useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import type { TithiDayData, NatalContext } from '@/types/tithi-calendar';
export type { TithiDayData } from '@/types/tithi-calendar'; // re-export for existing imports
import MSG from '@/messages/pages/tithi.json';
import { festivalIconFor } from '@/components/icons/FestivalIcons';
import Image from 'next/image';
import { computeBalam } from '@/lib/panchang/balam';
import { isVratDay } from '@/lib/calendar/vrat-detection';

// Localised short weekday header (Sun/Mon/Tue... or transliteration into
// the locale's script) via Intl. Falls back to English silently.
function localDayNames(locale: string): string[] {
  try {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    // 2024-01-07 is a Sunday — generate 7 successive days from there.
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + i)));
  } catch {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
// TithiDayData moved to src/types/tithi-calendar.ts (review M9).

interface TithiMonthGridProps {
  year: number;
  month: number;
  days: TithiDayData[];
  locale: string;
  /** Natal personalisation state — defaults to `{ kind: 'none' }` so callers
   *  that don't need personalisation don't have to construct it. */
  natal?: NatalContext;
  /** Which masa convention to display in the per-cell chip. Amanta
   *  (new-moon-to-new-moon) is the default; Purnimanta (full-moon-to
   *  -full-moon) is one month ahead during Krishna Paksha. */
  masaConvention?: 'amanta' | 'purnimanta';
  onDayClick?: (date: string) => void;
}

const NO_NATAL: NatalContext = { kind: 'none' };

// ---------------------------------------------------------------------------
// Moon phase SVG  –  large, detailed, dramatic
// ---------------------------------------------------------------------------

function MoonIcon({ tithiNumber, paksha, size = 32 }: { tithiNumber: number; paksha: 'shukla' | 'krishna'; size?: number }) {
  const uid = `m${tithiNumber}${paksha[0]}`;

  // Purnima  –  radiant golden full moon with glow
  if (tithiNumber === 15) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <radialGradient id={`${uid}-g`} cx="35%" cy="35%">
            <stop offset="0%" stopColor="#fff8e1" /><stop offset="40%" stopColor="#f0d48a" /><stop offset="100%" stopColor="#d4a853" />
          </radialGradient>
          <filter id={`${uid}-glow`}><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {/* Outer glow */}
        <circle cx="16" cy="16" r="15" fill="#f0d48a" opacity="0.08" />
        <circle cx="16" cy="16" r="12" fill={`url(#${uid}-g)`} filter={`url(#${uid}-glow)`} />
        {/* Surface detail */}
        <circle cx="13" cy="13" r="2" fill="#d4a853" opacity="0.15" />
        <circle cx="18" cy="14" r="1.2" fill="#d4a853" opacity="0.1" />
        <circle cx="14" cy="19" r="1.5" fill="#d4a853" opacity="0.08" />
      </svg>
    );
  }

  // Amavasya  –  dark void with faint purple ring and tiny stars
  if (tithiNumber === 30 || tithiNumber === 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="12" fill="#0d0820" />
        <circle cx="16" cy="16" r="12" fill="none" stroke="#6b5b8d" strokeWidth="1.2" opacity="0.35" />
        <circle cx="16" cy="16" r="10" fill="none" stroke="#4a3f6b" strokeWidth="0.4" strokeDasharray="1.5 2.5" opacity="0.25" />
        {/* Tiny stars around */}
        <circle cx="5" cy="6" r="0.6" fill="#8b8bba" opacity="0.4" />
        <circle cx="27" cy="8" r="0.5" fill="#8b8bba" opacity="0.3" />
        <circle cx="28" cy="24" r="0.7" fill="#8b8bba" opacity="0.35" />
        <circle cx="4" cy="26" r="0.5" fill="#8b8bba" opacity="0.25" />
      </svg>
    );
  }

  // Crescent → gibbous with gradient fill
  const tithiInPaksha = paksha === 'shukla' ? tithiNumber : tithiNumber - 15;
  const fraction = tithiInPaksha / 15;
  const isWaxing = paksha === 'shukla';
  const terminatorX = 16 + (fraction * 2 - 1) * 12;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <clipPath id={`${uid}-c`}><circle cx="16" cy="16" r="12" /></clipPath>
        <linearGradient id={`${uid}-lit`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5e6b8" /><stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="12" fill="#0d0820" />
      <g clipPath={`url(#${uid}-c)`}>
        {isWaxing ? (
          <ellipse cx={terminatorX} cy="16" rx={Math.max(Math.abs(fraction * 2 - 1) * 12, 0.5)} ry="12" fill={`url(#${uid}-lit)`} />
        ) : (
          <ellipse cx={32 - terminatorX} cy="16" rx={Math.max(Math.abs(fraction * 2 - 1) * 12, 0.5)} ry="12" fill={`url(#${uid}-lit)`} />
        )}
      </g>
      <circle cx="16" cy="16" r="12" fill="none" stroke="#8a6d2b" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG micro-icons
// ---------------------------------------------------------------------------

function SunriseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" className="inline-block shrink-0">
      <circle cx="8" cy="10" r="3" fill="none" stroke="#d4a853" strokeWidth="1.2" />
      <line x1="8" y1="4" x2="8" y2="6" stroke="#d4a853" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="4" y1="6.5" x2="5.2" y2="7.7" stroke="#d4a853" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="12" y1="6.5" x2="10.8" y2="7.7" stroke="#d4a853" strokeWidth="0.7" strokeLinecap="round" />
      <line x1="2" y1="13" x2="14" y2="13" stroke="#d4a853" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function SunsetIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" className="inline-block shrink-0">
      <circle cx="8" cy="10" r="3" fill="none" stroke="#8a6d2b" strokeWidth="1.2" />
      <line x1="8" y1="6" x2="8" y2="4" stroke="#8a6d2b" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="2" y1="13" x2="14" y2="13" stroke="#8a6d2b" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Day names & helpers
// ---------------------------------------------------------------------------

function isEkadashi(n: number) { return n === 11 || n === 26; }
function isPurnima(n: number) { return n === 15; }
function isAmavasya(n: number) { return n === 30 || n === 0; }

// Festival slugs that promote a cell to a full-width deity banner.
// Each set maps to a portrait under public/festivals/ + a frame theme.
const SHIVA_SLUGS = new Set(['maha-shivaratri', 'masik-shivaratri']);
const DEVI_SLUGS = new Set([
  'navaratri', 'chaitra-navratri', 'magha-gupta-navratri',
  'sharad-navratri', 'ashadha-gupta-navratri',
  'durga-ashtami', 'maha-navami', 'durga-puja',
]);
const LAKSHMI_SLUGS = new Set([
  'diwali', 'dhanteras', 'sharad-purnima', 'kojagiri-purnima',
  'lakshmi-puja-bengali', 'varalakshmi-vratam', 'akshaya-tritiya', 'annakut',
]);
const GANESHA_SLUGS = new Set([
  'ganesh-chaturthi', 'ganesha-chaturthi', 'vinayaka-chaturthi',
  'sankashti-chaturthi', 'anant-chaturdashi',
]);
const RAM_SLUGS = new Set([
  'ram-navami', 'dussehra', 'vijaya-dashami', 'sita-navami', 'vivah-panchami',
]);
const SARASWATI_SLUGS = new Set(['vasant-panchami']);
const HANUMAN_SLUGS = new Set(['hanuman-jayanti']);
const KRISHNA_SLUGS = new Set([
  'janmashtami', 'krishna-janmashtami', 'govardhan-puja',
]);

interface DeityBanner {
  src: string;
  alt: string;
  /** Label text to render on the bottom gradient. */
  label: string;
  /** objectPosition for the photo crop (face/crown area). */
  objectPosition: string;
  /** Tailwind border colour for the day-number circle overlay. */
  dayRing: string;
  /** Border / glow colour for the banner frame + caption text. */
  frame: 'amber' | 'blue' | 'rose' | 'pink' | 'saffron' | 'royal' | 'white' | 'orange' | 'teal';
}

/**
 * Decide whether a cell renders a deity banner (full-width photo) in
 * place of the procedural moon icon. Falls back to null for ordinary
 * panchang cells. Ekadashi is detected by tithi number; Shivaratri /
 * Navratri / Durga are detected by festival slug.
 */
function getDeityBanner(cell: TithiDayData, msg: { ekadashi: { en: string } }): DeityBanner | null {
  // `slug` is optional on the cell-festival shape, so guard before each
  // Set.has() — otherwise TS narrows the predicate arg to `string | undefined`.
  const hasSlug = (set: Set<string>) =>
    cell.festivals.find((f) => f.slug !== undefined && set.has(f.slug));
  const shivaFest = hasSlug(SHIVA_SLUGS);
  if (shivaFest) {
    return {
      src: '/festivals/shiva.png',
      alt: 'Shiva — Shivaratri',
      label: shivaFest.name?.en ?? 'Shivaratri',
      objectPosition: '50% 25%',
      dayRing: 'border-sky-300/70',
      frame: 'blue',
    };
  }
  const deviFest = hasSlug(DEVI_SLUGS);
  if (deviFest) {
    return {
      src: '/festivals/devi.png',
      alt: 'Devi — Navratri',
      label: deviFest.name?.en ?? 'Navratri',
      objectPosition: '50% 28%',
      dayRing: 'border-rose-300/70',
      frame: 'rose',
    };
  }
  const lakshmiFest = hasSlug(LAKSHMI_SLUGS);
  if (lakshmiFest) {
    return {
      src: '/festivals/lakshmi.png',
      alt: 'Lakshmi — Diwali / Dhanteras / Sharad Purnima',
      label: lakshmiFest.name?.en ?? 'Lakshmi Puja',
      objectPosition: '50% 30%',
      dayRing: 'border-pink-300/70',
      frame: 'pink',
    };
  }
  const ganeshaFest = hasSlug(GANESHA_SLUGS);
  if (ganeshaFest) {
    return {
      src: '/festivals/ganesha.png',
      alt: 'Ganesha — Ganesh Chaturthi',
      label: ganeshaFest.name?.en ?? 'Ganesh Chaturthi',
      objectPosition: '50% 32%',
      dayRing: 'border-orange-300/70',
      frame: 'saffron',
    };
  }
  const ramFest = hasSlug(RAM_SLUGS);
  if (ramFest) {
    return {
      src: '/festivals/ram.png',
      alt: 'Sita-Ram — Ram Navami / Dussehra',
      label: ramFest.name?.en ?? 'Ram',
      objectPosition: '50% 25%',
      dayRing: 'border-indigo-300/70',
      frame: 'royal',
    };
  }
  const saraswatiFest = hasSlug(SARASWATI_SLUGS);
  if (saraswatiFest) {
    return {
      src: '/festivals/saraswati.png',
      alt: 'Saraswati — Vasant Panchami',
      label: saraswatiFest.name?.en ?? 'Vasant Panchami',
      objectPosition: '50% 30%',
      dayRing: 'border-slate-200/80',
      frame: 'white',
    };
  }
  const hanumanFest = hasSlug(HANUMAN_SLUGS);
  if (hanumanFest) {
    return {
      src: '/festivals/hanuman.png',
      alt: 'Hanuman — Hanuman Jayanti',
      label: hanumanFest.name?.en ?? 'Hanuman Jayanti',
      objectPosition: '50% 22%',
      dayRing: 'border-red-300/70',
      frame: 'orange',
    };
  }
  const krishnaFest = hasSlug(KRISHNA_SLUGS);
  if (krishnaFest) {
    return {
      src: '/festivals/krishna.png',
      alt: 'Krishna — Janmashtami / Govardhan Puja',
      label: krishnaFest.name?.en ?? 'Krishna',
      objectPosition: '50% 28%',
      dayRing: 'border-teal-300/70',
      frame: 'teal',
    };
  }
  if (isEkadashi(cell.tithiNumber)) {
    return {
      src: '/festivals/vishnu.png',
      alt: 'Vishnu — Ekadashi',
      label: msg.ekadashi.en,
      objectPosition: '40% 50%',
      dayRing: 'border-amber-300/70',
      frame: 'amber',
    };
  }
  return null;
}

// Frame-colour theming for the deity banner — separate map keeps the
// JSX tidy and avoids dynamic class names that Tailwind v4 can't parse.
const BANNER_FRAME_CLS: Record<DeityBanner['frame'], { border: string; glow: string; caption: string }> = {
  amber: {
    border: 'border-amber-300/60',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    caption: 'text-amber-200',
  },
  blue: {
    border: 'border-sky-300/60',
    glow: 'shadow-[0_0_20px_rgba(56,189,248,0.35)]',
    caption: 'text-sky-200',
  },
  rose: {
    border: 'border-rose-300/60',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.35)]',
    caption: 'text-rose-200',
  },
  pink: {
    border: 'border-pink-300/60',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]',
    caption: 'text-pink-200',
  },
  saffron: {
    border: 'border-orange-300/60',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.4)]',
    caption: 'text-orange-200',
  },
  royal: {
    border: 'border-indigo-300/60',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.4)]',
    caption: 'text-indigo-200',
  },
  white: {
    border: 'border-slate-200/70',
    glow: 'shadow-[0_0_20px_rgba(226,232,240,0.45)]',
    caption: 'text-slate-100',
  },
  orange: {
    border: 'border-red-300/60',
    glow: 'shadow-[0_0_20px_rgba(248,113,113,0.4)]',
    caption: 'text-red-200',
  },
  teal: {
    border: 'border-teal-300/60',
    glow: 'shadow-[0_0_20px_rgba(45,212,191,0.4)]',
    caption: 'text-teal-200',
  },
};

// Vrat-detection moved to @/lib/calendar/vrat-detection so the grid and list
// surfaces share one rule. See CLAUDE.md Lesson ZA + "NEVER Duplicate Logic".

// ---------------------------------------------------------------------------
// Cell styling  –  dramatically different per tithi type
// ---------------------------------------------------------------------------

// "Vibrant dark" identity: special days glow from within like a deepa against
// night; regular days are clearly readable charcoal cards with gold accents.
// Baseline is the project's purple mega-card gradient (used across 30+ cards
// in the app — see CLAUDE.md). Special-day variants layer brighter gradients
// on top so glow has a chance to read.
function getCellClasses(cell: TithiDayData): { outer: string; dayCircle: string; tithiText: string; accent: string } {
  const n = cell.tithiNumber;
  const hasMajor = cell.festivals.some(f => f.type === 'major');
  const hasEclipse = cell.festivals.some(f => f.type === 'eclipse');

  if (isPurnima(n)) return {
    outer: 'bg-gradient-to-br from-amber-500/35 via-amber-600/22 to-[#1a1040]/60 border-2 border-amber-400/70 animate-purnima-glow',
    dayCircle: 'bg-amber-400/40 text-amber-50 border-2 border-amber-300/80',
    tithiText: 'text-amber-200 font-black',
    accent: 'border-t-[3px] border-t-amber-300/85',
  };
  if (isAmavasya(n)) return {
    outer: 'bg-gradient-to-br from-violet-700/40 via-indigo-800/30 to-[#0a0e27] border-2 border-violet-400/55 shadow-[0_0_24px_rgba(139,92,246,0.25),inset_0_0_22px_rgba(139,92,246,0.18)]',
    dayCircle: 'bg-violet-500/45 text-violet-50 border-2 border-violet-300/80',
    tithiText: 'text-violet-200 font-black',
    accent: 'border-t-[3px] border-t-violet-400/75',
  };
  if (isEkadashi(n)) return {
    outer: 'bg-gradient-to-br from-emerald-700/32 via-emerald-900/18 to-[#0a0e27] border-2 border-emerald-400/55 shadow-[0_0_18px_rgba(16,185,129,0.18)]',
    dayCircle: 'bg-emerald-500/45 text-emerald-50 border-2 border-emerald-300/75',
    tithiText: 'text-emerald-200 font-bold',
    accent: 'border-l-[4px] border-l-emerald-300/85',
  };
  if (hasEclipse) return {
    outer: 'bg-gradient-to-br from-red-700/38 via-red-900/22 to-[#0a0e27] border-2 border-red-400/60 shadow-[0_0_24px_rgba(239,68,68,0.28)] animate-eclipse-pulse',
    dayCircle: 'bg-red-500/45 text-red-50 border-2 border-red-300/80',
    tithiText: 'text-red-200 font-bold',
    accent: 'border-t-[3px] border-t-red-400/80',
  };
  if (hasMajor) return {
    outer: 'bg-gradient-to-br from-gold-primary/35 via-[#2d1b69]/55 to-[#0a0e27] border-2 border-gold-primary/55 shadow-[0_0_18px_rgba(212,168,83,0.22)]',
    dayCircle: 'bg-gold-primary/40 text-gold-light border-2 border-gold-primary/70',
    tithiText: 'text-gold-light font-semibold',
    accent: 'border-t-[3px] border-t-gold-primary/75',
  };
  // Baseline shukla — bright, warm amber-orange wash with a thick amber
  // top-accent bar so the bright (waxing-moon) half of the month reads
  // unmistakably hot/golden at a glance. The user has repeatedly asked
  // for the paksha distinction to be "even more obvious".
  if (cell.paksha === 'shukla') return {
    outer: 'bg-gradient-to-br from-amber-500/35 via-orange-700/25 via-50% to-[#1a0e27] border-2 border-amber-500/40',
    dayCircle: 'bg-amber-500/45 text-amber-50 border-2 border-amber-300/75 shadow-[0_0_8px_rgba(245,158,11,0.35)]',
    tithiText: 'text-amber-100 font-semibold',
    accent: 'border-t-4 border-t-amber-400/70',
  };
  // Baseline krishna — deep indigo/violet wash with a thick indigo
  // top-accent bar so the dark (waning-moon) half feels cold/lunar
  // and reads instantly different from the shukla half.
  return {
    outer: 'bg-gradient-to-br from-indigo-700/45 via-violet-900/35 via-50% to-[#08081a] border-2 border-indigo-500/40',
    dayCircle: 'bg-indigo-500/45 text-indigo-50 border-2 border-indigo-300/75 shadow-[0_0_8px_rgba(99,102,241,0.35)]',
    tithiText: 'text-indigo-100 font-semibold',
    accent: 'border-t-4 border-t-indigo-400/70',
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TithiMonthGrid({ year, month, days, locale, natal = NO_NATAL, masaConvention = 'amanta', onDayClick }: TithiMonthGridProps) {
  // Day-name labels via Intl — covers all 10 locales with native scripts.
  const dayNames = useMemo(() => localDayNames(locale), [locale]);
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const dayMap = useMemo(() => {
    const m = new Map<number, TithiDayData>();
    for (const d of days) m.set(d.day, d);
    return m;
  }, [days]);

  const rows: (TithiDayData | null)[][] = [];
  let currentRow: (TithiDayData | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) currentRow.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    currentRow.push(dayMap.get(d) || null);
    if (currentRow.length === 7) { rows.push(currentRow); currentRow = []; }
  }
  if (currentRow.length > 0) {
    while (currentRow.length < 7) currentRow.push(null);
    rows.push(currentRow);
  }

  return (
    // No outer `overflow-x-auto` wrapper here on purpose — the grid is
    // hidden below the sm breakpoint (mobile uses TithiMonthList), so the
    // min-width-700 horizontal-scroll scaffold isn't needed. Removing it
    // also un-traps `position: sticky` on the day-name header.
    <div>
    {/*
     * Grid surface is LIGHTER than the page background (#0a0e27), so the
     * calendar feels like a surface rather than a void. The page background
     * remains the standard navy; the grid sits on a slightly lifted purple
     * gradient consistent with the project's mega-card pattern.
     *
     * `overflow-hidden` was removed from this wrapper because it creates
     * a containing block that traps the sticky day-name header inside
     * it — sticky would only stick to the wrapper's scroll context (which
     * doesn't exist), not to the page scroll. The wrapper still gets its
     * rounded border from `rounded-2xl border`; child cells don't have
     * decorations that poke out of the rounded shape.
     */}
    <div className="rounded-2xl border border-gold-primary/25 bg-gradient-to-br from-[#171036] via-[#120c2a] to-[#0c0a22] shadow-2xl shadow-black/40">
      {/* Day name headers — sticky to the page scroll. top-16 = 64px =
          navbar height, so the header pins flush against the bottom edge
          of the fixed navbar instead of disappearing behind it. */}
      <div className="sticky top-16 z-20 grid grid-cols-7 bg-gradient-to-r from-[#2d1b69]/97 via-[#221451]/97 to-[#2d1b69]/97 backdrop-blur-md border-b border-gold-primary/25 rounded-t-2xl shadow-[0_4px_12px_rgba(10,14,39,0.4)]">
        {dayNames.map((name, i) => (
          // suppressHydrationWarning: Intl.DateTimeFormat day-name output
          // can differ between server (Node ICU) and client (browser ICU) for
          // locales like 'mai' where CLDR support is asymmetric. React's
          // hydration mismatch warning is purely cosmetic here — the client
          // wins after hydration anyway.
          <div
            key={i}
            suppressHydrationWarning
            className={`text-center py-3 text-xs sm:text-sm font-bold tracking-[0.18em] ${i === 0 ? 'text-red-300' : 'text-gold-light'}`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {rows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map((cell, ci) => {
            if (!cell) {
              return <div key={ci} className="min-h-[170px] sm:min-h-[190px] lg:min-h-[210px] bg-gradient-to-br from-[#0e0a22] to-[#0a0820] border-r border-b border-gold-primary/[0.04]" />;
            }

            const s = getCellClasses(cell);
            const n = cell.tithiNumber;
            const banner = getDeityBanner(cell, MSG);
            const isSpecial = isPurnima(n) || isAmavasya(n) || isEkadashi(n) || banner !== null;
            // Short masa abbreviation for top-right chip
            // Pick the masa name from the convention the caller asked for.
            // Falls back to amanta if purnimanta is empty (older cached
            // entries from before the fallback was wired).
            const masaFull = masaConvention === 'purnimanta'
              ? (cell.masa?.purnimanta || cell.masa?.amanta)
              : cell.masa?.amanta;
            const masaShort = masaFull
              ? masaFull.charAt(0).toUpperCase() + masaFull.slice(1, 4)
              : null;
            const isAdhika = cell.masa?.isAdhika === true;
            const cellHasVrat = isVratDay(cell.festivals);
            // Personalised auspicious badge — both Tara and Chandrabalam
            // favourable for the user, computed from natal kundali via the
            // canonical engine (CLAUDE.md "NEVER Duplicate Logic" — Lesson Q).
            let personalisedAuspicious = false;
            if (natal.kind === 'present' && cell.nakshatraNum && cell.moonRashiNum) {
              const balam = computeBalam(natal.nakshatra, natal.moonSign, cell.nakshatraNum, cell.moonRashiNum);
              personalisedAuspicious = balam.tarabalam.favorable && balam.chandrabalam.favorable;
            }

            // Compose an aria-label so screen readers announce the cell's
            // primary content. Without this, tabbing through the grid says
            // just "button" with no context.
            const cellAriaLabel = [
              `${cell.day}`,
              tl(cell.tithiName, locale),
              cell.festivals.map((f) => tl(f.name, locale)).join(', '),
            ].filter(Boolean).join(' — ');

            return (
              <button
                key={ci}
                type="button"
                onClick={() => onDayClick?.(cell.date)}
                aria-label={cellAriaLabel}
                className={`text-left min-h-[170px] sm:min-h-[190px] lg:min-h-[210px] p-1 sm:p-2 cursor-pointer transition-all duration-200 hover:brightness-110 hover:z-10 relative border-r border-b border-gold-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:z-30 ${s.outer} ${s.accent} ${
                  cell.isToday ? 'ring-2 ring-inset ring-gold-primary shadow-[0_0_28px_rgba(212,168,83,0.4)] z-20' : ''
                }`}
              >
                {/* Vrat marker — purple left-edge bar, hidden when the cell
                    already has a Purnima/Amavasya/Ekadashi/eclipse/major-festival
                    treatment (avoids visual collision). */}
                {cellHasVrat && !isPurnima(n) && !isAmavasya(n) && !banner && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-violet-400/70 via-violet-500/60 to-violet-700/40 pointer-events-none" aria-hidden="true" />
                )}
                {/* Personalised auspicious ★ — bottom-right, only when the
                    user has a kundali and both Tara + Chandrabalam are
                    favourable. Subtle so it doesn't compete with the
                    cell's primary visual hierarchy. */}
                {personalisedAuspicious && (
                  <div
                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-gradient-to-br from-gold-light to-gold-primary border border-gold-primary/80 shadow-[0_0_6px_rgba(212,168,83,0.5)] flex items-center justify-center text-[8px] text-bg-primary font-black pointer-events-none z-[5]"
                    title={tl(MSG.detailAuspiciousForYou, locale)}
                  >
                    ★
                  </div>
                )}
                {/* ── Header: Day number + masa chip ──
                    Day number is overlaid absolutely at the top-left of
                    the cell, and masa chip at the top-right. For cells
                    that render a deity banner (Ekadashi/Shivaratri/
                    Navratri) these overlays live ON the banner instead,
                    so we skip this block. */}
                {!banner && (
                  <>
                    <div
                      className={`absolute top-1 left-1 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black shrink-0 ${
                        cell.isToday
                          ? 'bg-gold-primary/85 text-bg-primary border-2 border-gold-light shadow-[0_0_12px_rgba(212,168,83,0.7)]'
                          : `${s.dayCircle} shadow-[0_2px_6px_rgba(0,0,0,0.5)]`
                      }`}
                    >
                      {cell.day}
                    </div>
                    {masaShort && (
                      <div
                        className={`absolute top-1 right-1 z-10 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded leading-tight bg-[#0a0e27]/80 shadow-[0_2px_6px_rgba(0,0,0,0.6)] ${
                          isAdhika
                            ? 'text-emerald-200 border border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                            : cell.paksha === 'shukla'
                              ? 'text-amber-200 border border-amber-400/50'
                              : 'text-indigo-200 border border-indigo-400/50'
                        }`}
                        title={(isAdhika ? 'Adhik ' : '') + (masaFull ?? '')}
                      >
                        {isAdhika && (
                          <div className="text-[7px] leading-none mb-0.5">ADHIK</div>
                        )}
                        <div className="truncate max-w-[60px]">
                          {masaShort}{cell.paksha === 'shukla' ? '·S' : '·K'}
                        </div>
                      </div>
                    )}
                    {cell.isToday && !masaShort && (
                      <span className="absolute top-1 right-1 z-10 text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-full bg-gold-primary/40 text-bg-primary font-black uppercase tracking-widest animate-pulse">
                        {tl(MSG.today, locale)}
                      </span>
                    )}
                  </>
                )}
                {cell.isToday && masaShort && (
                  // Hangs from inside the cell's top edge (rounded-b-full) so
                  // first-row cells don't get the pill clipped by the grid
                  // wrapper's overflow-hidden, and so it never collides with
                  // the day-name header strip.
                  <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
                    <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-b-full bg-gold-primary text-bg-primary font-black uppercase tracking-widest animate-pulse shadow-[0_2px_8px_rgba(212,168,83,0.5)]">
                      {tl(MSG.today, locale)}
                    </span>
                  </div>
                )}

                {/* ── Centerpiece icon ──
                    Ekadashi cells show a Vishnu portrait at full cell
                    width (user: "make it larger — not visible at all").
                    The image sits in a 90px-tall banner that crosses
                    the whole cell so the deity is the first thing the
                    eye lands on. The procedural moon-phase remains the
                    centerpiece for every non-Ekadashi cell. */}
                {banner ? (
                  // Deity banner hugs the top edge of the cell. Day number
                  // and masa chip overlay the artwork top-left/right with
                  // dark scrims so they read on any part of the painting.
                  // The festival caption sits on a gradient at the bottom.
                  // Theming (frame border, glow, caption colour) comes from
                  // BANNER_FRAME_CLS keyed off the banner's `frame` field.
                  <div className={`-mx-1 sm:-mx-2 -mt-1 sm:-mt-2 mb-1 relative h-[96px] sm:h-[104px] lg:h-[112px] overflow-hidden border-b-2 bg-[#0a0e27] ${BANNER_FRAME_CLS[banner.frame].border} ${BANNER_FRAME_CLS[banner.frame].glow}`}>
                    <Image
                      src={banner.src}
                      alt={banner.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 28vw, 200px"
                      className="object-cover"
                      style={{ objectPosition: banner.objectPosition }}
                      priority={false}
                    />
                    {/* Day number — overlaid top-left with a dark scrim. */}
                    <div
                      className={`absolute top-1 left-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black shrink-0 z-10 ${
                        cell.isToday
                          ? 'bg-gold-primary/85 text-bg-primary border-2 border-gold-light shadow-[0_0_12px_rgba(212,168,83,0.7)]'
                          : `bg-[#0a0e27]/80 text-amber-100 border-2 ${banner.dayRing} shadow-[0_2px_6px_rgba(0,0,0,0.6)]`
                      }`}
                    >
                      {cell.day}
                    </div>
                    {/* Masa chip — overlaid top-right with a dark scrim.
                        When Adhika, stack an "ADHIK" line so users see
                        the intercalary month even on deity-banner cells. */}
                    {masaShort && (
                      <div
                        className={`absolute top-1 right-1 z-10 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded leading-tight bg-[#0a0e27]/80 shadow-[0_2px_6px_rgba(0,0,0,0.6)] ${
                          isAdhika
                            ? 'text-emerald-200 border border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                            : cell.paksha === 'shukla'
                              ? 'text-amber-200 border border-amber-400/50'
                              : 'text-indigo-200 border border-indigo-400/50'
                        }`}
                        title={(isAdhika ? 'Adhik ' : '') + (masaFull ?? '')}
                      >
                        {isAdhika && (
                          <div className="text-[7px] leading-none mb-0.5">ADHIK</div>
                        )}
                        <div className="truncate max-w-[60px]">
                          {masaShort}{cell.paksha === 'shukla' ? '·S' : '·K'}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0e27]/90 to-transparent text-center py-0.5 z-10">
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${BANNER_FRAME_CLS[banner.frame].caption}`}>
                        {banner.label}
                      </span>
                    </div>
                  </div>
                ) : (
                  // pt-9/pt-10 = clears the absolute-positioned day-number
                  // overlay (28-32px tall + top-1 = 32-36px) so the moon
                  // doesn't get pinned against the day badge.
                  <div className="flex justify-center pt-8 sm:pt-9 mb-1">
                    <MoonIcon tithiNumber={n} paksha={cell.paksha} size={isSpecial ? 42 : 34} />
                  </div>
                )}

                {/* ── Tithi name ── */}
                <div className={`text-xs sm:text-sm leading-tight text-center truncate ${s.tithiText}`}>
                  {tl(cell.tithiName, locale)}
                </div>

                {/* ── Special badge ── */}
                {isPurnima(n) && (
                  <div className="text-[8px] sm:text-[9px] font-black text-amber-200 bg-amber-500/20 border border-amber-400/30 rounded-full px-2 py-0.5 mx-auto mt-0.5 w-fit uppercase tracking-widest">
                    {tl(MSG.fullMoon, locale)}
                  </div>
                )}
                {isAmavasya(n) && (
                  <div className="text-[8px] sm:text-[9px] font-black text-violet-200 bg-violet-500/15 border border-violet-400/25 rounded-full px-2 py-0.5 mx-auto mt-0.5 w-fit uppercase tracking-widest">
                    {tl(MSG.newMoon, locale)}
                  </div>
                )}
                {/* Ekadashi caption is rendered on the Vishnu banner above —
                    no duplicate pill here. */}

                {/* ── Panchang details ── */}
                <div className="mt-1 space-y-0.5 text-[9px] sm:text-[10px]">
                  {/* Sunrise / Sunset + Rahu Kaal — one tight line */}
                  {cell.sunrise && (
                    <div className="flex items-center gap-0.5 text-amber-200/90 flex-wrap">
                      <SunriseIcon /><span className="font-mono">{cell.sunrise}</span>
                      {cell.sunset && (
                        <><span className="text-text-secondary/40 mx-0.5">·</span><SunsetIcon /><span className="font-mono text-amber-300/85">{cell.sunset}</span></>
                      )}
                      {cell.rahuKaal && (
                        <span className="flex items-center gap-0.5 ml-1 text-red-300/85" title={tl(MSG.rahuKaal, locale)}>
                          <span className="inline-block w-1 h-1 rounded-full bg-red-400/90 shadow-[0_0_3px_rgba(239,68,68,0.6)]" />
                          <span className="font-mono text-[8px] sm:text-[9px]">{cell.rahuKaal.start}–{cell.rahuKaal.end}</span>
                        </span>
                      )}
                    </div>
                  )}
                  {/* Nakshatra + end time */}
                  {cell.nakshatra && (
                    <div className="flex items-center gap-1 text-cyan-200/90 truncate">
                      <svg width="12" height="12" viewBox="0 0 16 16" className="shrink-0"><polygon points="8,1 10,6 15,6.5 11,10 12.5,15 8,12 3.5,15 5,10 1,6.5 6,6" fill="#67e8f9" opacity="0.9" /></svg>
                      <span className="truncate">{tl(cell.nakshatra, locale)}</span>
                      {cell.nakshatraEnd && (
                        <span className="font-mono text-cyan-300/60 text-[8px] sm:text-[9px] shrink-0">
                          → {cell.nakshatraEnd.hhmm}{cell.nakshatraEnd.nextDay ? '⁺' : ''}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Moon Rashi + transit time */}
                  {cell.moonRashi && (
                    <div className="flex items-center gap-1 text-slate-200/85 truncate">
                      <svg width="11" height="11" viewBox="0 0 16 16" className="shrink-0"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#cbd5e1" strokeWidth="1" /><path d="M9.5 4 A4.5 4.5 0 0 0 9.5 12 A5.5 5.5 0 0 1 9.5 4Z" fill="#cbd5e1" opacity="0.75" /></svg>
                      <span className="truncate">{tl(cell.moonRashi, locale)}</span>
                      {cell.moonRashiEnd && (
                        <span className="font-mono text-slate-300/55 text-[8px] sm:text-[9px] shrink-0">
                          → {cell.moonRashiEnd.hhmm}{cell.moonRashiEnd.nextDay ? '⁺' : ''}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Yoga + Karana — one combined line; the joining-knot SVG
                      lifts the yoga half visually, and Karana appears in
                      muted gold after a divot. */}
                  {(cell.yoga || cell.karana) && (
                    <div className="flex items-center gap-1 text-fuchsia-200/85 truncate">
                      {cell.yoga && (
                        <svg width="11" height="11" viewBox="0 0 16 16" className="shrink-0">
                          <path d="M5 4 Q8 7 11 4 Q14 8 11 12 Q8 9 5 12 Q2 8 5 4Z" fill="none" stroke="#e879f9" strokeWidth="1.1" opacity="0.85" />
                        </svg>
                      )}
                      {cell.yoga && <span className="truncate">{tl(cell.yoga, locale)}</span>}
                      {cell.karana && (
                        <>
                          <span className="text-text-secondary/40 mx-0.5">·</span>
                          <span className="text-gold-light/70 truncate" title={tl(MSG.cellKarana, locale)}>{tl(cell.karana, locale)}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Festivals — major day-headline becomes a bottom
                    ribbon (Drik-style); secondary festivals stay as chips
                    above. Eclipse keeps its red chip treatment regardless
                    so the dedicated eclipse glow + chip both read. ── */}
                {(() => {
                  const headline = cell.festivals.find((f) => f.type === 'major');
                  const others = cell.festivals.filter((f) => f !== headline);
                  return (
                    <>
                      {others.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {others.slice(0, 2).map((f, fi) => {
                            const Icon = festivalIconFor(f.slug);
                            const chipClass =
                              f.type === 'eclipse'
                                ? 'bg-red-500/35 text-red-100 border border-red-400/60'
                                : 'bg-violet-500/25 text-violet-100 border border-violet-400/40';
                            return (
                              <div
                                key={fi}
                                className={`flex items-center gap-1 text-[9px] sm:text-[10px] leading-tight px-1.5 py-0.5 rounded font-semibold ${chipClass}`}
                              >
                                <Icon size={13} className="shrink-0" />
                                <span className="truncate">{tl(f.name, locale)}</span>
                              </div>
                            );
                          })}
                          {others.length > 2 && (
                            <div className="text-[8px] sm:text-[9px] text-gold-light/80 text-center font-bold tracking-wider">
                              +{others.length - 2} {tl(MSG.more, locale)}
                            </div>
                          )}
                        </div>
                      )}
                      {headline && (() => {
                        const Icon = festivalIconFor(headline.slug);
                        return (
                          <div
                            className="mt-1 -mx-1 sm:-mx-2 -mb-1 sm:-mb-2 px-1.5 py-1 sm:py-1.5 bg-gradient-to-r from-gold-primary/55 via-gold-primary/40 to-gold-primary/55 border-t-2 border-gold-primary/80 shadow-[0_0_12px_rgba(212,168,83,0.25)] flex items-center gap-1.5"
                          >
                            <Icon size={16} className="shrink-0" />
                            <span className="text-[10px] sm:text-[11px] font-black text-gold-light truncate tracking-wide uppercase">
                              {tl(headline.name, locale)}
                            </span>
                          </div>
                        );
                      })()}
                    </>
                  );
                })()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
    </div>
  );
}
