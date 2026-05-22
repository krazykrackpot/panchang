'use client';

import { forwardRef, useMemo } from 'react';
import TithiMonthGrid from './TithiMonthGrid';
import { tl } from '@/lib/utils/trilingual';
import MSG from '@/messages/pages/tithi.json';
import { splitFestivalsForExport, type FestivalRow } from '@/lib/calendar/export-overflow';
import { festivalIconFor } from '@/components/icons/FestivalIcons';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { TithiDayData, MonthlyContext, NatalContext } from '@/types/tithi-calendar';

export interface TithiCalendarExportProps {
  year: number;
  /** 1-indexed (1..12). */
  month: number;
  days: TithiDayData[];
  meta: MonthlyContext | null;
  locale: string;
  locationName: string;
  masaConvention: 'amanta' | 'purnimanta';
  /** Localised month-year heading e.g. "May 2026" / "मई 2026". */
  monthHeading: string;
  /** ISO date string for the footer. */
  generatedAt: string;
  /** Pre-computed festival rows for the rail. */
  festivals: FestivalRow[];
  /** Dictates the export node's intrinsic pixel dimensions. */
  format: 'pdf' | 'jpeg' | 'png';
}

const NO_NATAL: NatalContext = { kind: 'none' };

// Intrinsic capture dimensions. html-to-image multiplies by pixelRatio
// downstream — these are the *layout* sizes the components are designed for.
const DIMENSIONS = {
  pdf:  { width: 1400, height: 990 },   // A4 landscape ratio (1.414:1)
  png:  { width: 1400, height: 990 },   // same — hi-res via pixelRatio
  jpeg: { width: 1080, height: 1350 },  // Instagram portrait card
} as const;

const TithiCalendarExport = forwardRef<HTMLDivElement, TithiCalendarExportProps>(
function TithiCalendarExport({
  year, month, days, meta, locale, locationName, masaConvention,
  monthHeading, generatedAt, festivals, format,
}, ref) {
  const isDeva = isDevanagariLocale(locale);
  const headingFont = isDeva
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  // Wall calendar must not highlight "today" — by tomorrow it would be stale.
  const sanitisedDays = useMemo<TithiDayData[]>(
    () => days.map((d) => ({ ...d, isToday: false })),
    [days],
  );

  // Pick a representative lunar masa from mid-month so the subtitle matches
  // the bulk of the visible cells regardless of where the month boundary falls.
  const midMasa = days[14]?.masa?.[masaConvention] ?? days[0]?.masa?.[masaConvention] ?? '';

  const split = splitFestivalsForExport(festivals);
  const isPortrait = format === 'jpeg';
  const dims = DIMENSIONS[format];

  return (
    <div
      ref={ref}
      style={{
        width: dims.width,
        // Use min-height so the layout grows if a 6-row month + festival
        // strip pushes past the A4 ratio — clipping the bottom of the grid
        // was the original bug. Height-locking + overflow-hidden hid rows
        // 5-6 in May/Mar/etc. The captured PNG is scaled into the A4 page
        // by jsPDF anyway, so a slightly taller canvas is fine.
        minHeight: dims.height,
        background: 'linear-gradient(135deg, #0a0e27 0%, #111633 100%)',
        color: '#e6e2d8',
        fontFamily: 'var(--font-body)',
      }}
      className="relative flex flex-col"
    >
      {/* Brand bar */}
      <div className="flex items-center justify-between px-10 pt-7 pb-4 border-b border-gold-primary/25">
        <div className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <defs>
              <radialGradient id="exp-sun" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#fff8e1" />
                <stop offset="60%" stopColor="#f0d48a" />
                <stop offset="100%" stopColor="#d4a853" />
              </radialGradient>
            </defs>
            <circle cx="18" cy="18" r="13" fill="url(#exp-sun)" />
            {Array.from({ length: 12 }, (_, i) => {
              const a = (Math.PI * 2 * i) / 12;
              const x1 = 18 + 14 * Math.cos(a);
              const y1 = 18 + 14 * Math.sin(a);
              const x2 = 18 + 17 * Math.cos(a);
              const y2 = 18 + 17 * Math.sin(a);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4a853" strokeWidth="1.4" />;
            })}
          </svg>
          <div>
            <div className="text-gold-light text-lg font-bold tracking-[0.18em]" style={headingFont}>
              DEKHO PANCHANG
            </div>
            <div className="text-text-secondary text-[11px] tracking-wider">
              Tithi Calendar · dekhopanchang.com
            </div>
          </div>
        </div>
        <div className="text-right text-text-secondary text-xs">
          📍 {locationName}
        </div>
      </div>

      {/* Title row */}
      <div className="px-10 pt-5 pb-3">
        <h1
          className="text-gold-light font-bold tracking-wide"
          style={{ ...headingFont, fontSize: isPortrait ? '52px' : '58px', lineHeight: 1.05 }}
        >
          {monthHeading}
        </h1>
        <div className="mt-2 text-text-secondary text-sm flex flex-wrap items-center gap-x-2">
          {midMasa && <span className="text-gold-light/90">{midMasa}</span>}
          {midMasa && meta && <span className="text-gold-primary/40">·</span>}
          {meta && <span>{tl(meta.ritu, locale)}</span>}
          {meta && <span className="text-gold-primary/40">·</span>}
          {meta && <span className="font-mono text-xs">{meta.ayanamshaDeg.toFixed(2)}° Lahiri</span>}
        </div>
      </div>

      {/* Grid — full width on every format. The side "This Month" rail was
          removed: it squeezed the grid into a narrow column, made cells tall
          enough to overflow A4 landscape (210mm), and the bottom rows got
          clipped. Festivals now sit below the grid as a single horizontal
          chip strip so the calendar uses the entire page width. */}
      {/* Scoped style overrides — TithiMonthGrid's cells are designed for a
          large interactive desktop view (min-h 170-210px). For paper/export
          we shrink to ~108px so 6 rows fit inside the A4-landscape capture
          (990px intrinsic height) without overflow-hidden clipping content. */}
      <style>{`
        .tithi-export-grid [class*="min-h-["] { min-height: 108px !important; }
        .tithi-export-grid [class*="h-[96px]"],
        .tithi-export-grid [class*="h-[104px]"],
        .tithi-export-grid [class*="h-[112px]"] { height: 52px !important; }
        .tithi-export-grid .sticky { position: static !important; }
      `}</style>
      <div className={`tithi-export-grid ${isPortrait ? 'px-6' : 'px-8'} pb-2`}>
        <TithiMonthGrid
          year={year}
          month={month}
          days={sanitisedDays}
          locale={locale}
          natal={NO_NATAL}
          masaConvention={masaConvention}
        />
      </div>

      {/* Festival strip — compact horizontal flow below the grid. Wraps
          naturally when the month has many festivals; capped at 16 entries
          + overflow indicator via splitFestivalsForExport. */}
      {festivals.length > 0 && (
        <div className={`${isPortrait ? 'px-6' : 'px-8'} pb-2`}>
          <div
            className="text-gold-light text-[10px] uppercase tracking-[0.22em] mb-1.5"
            style={headingFont}
          >
            {tl(MSG.exportThisMonth, locale)}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {split.columns.flat().map((f, i) => {
              const dayNum = parseInt(f.date.slice(-2), 10);
              const Icon = festivalIconFor('festival');
              return (
                <div key={i} className="inline-flex items-center gap-1.5 text-[10.5px] leading-tight">
                  <span className="text-gold-primary font-bold tabular-nums">{dayNum}</span>
                  <Icon className="w-3 h-3 shrink-0 text-gold-primary" />
                  <span className="text-text-primary">{f.name}</span>
                </div>
              );
            })}
            {split.overflow > 0 && (
              <span className="text-text-secondary text-[10px] italic">
                {tl(MSG.exportMoreFestivals, locale).replace('{count}', String(split.overflow))}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-10 pb-2 text-[10.5px] text-text-secondary">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400/80" /><span>{tl(MSG.legendPurnima, locale)}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#1a1040] border-2 border-violet-400/40" /><span>{tl(MSG.legendAmavasya, locale)}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/30" /><span>{tl(MSG.legendEkadashi, locale)}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2.5 rounded bg-gold-primary/20 border border-gold-primary/30" /><span>{tl(MSG.legendFestival, locale)}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2.5 rounded bg-violet-500/15 border border-violet-500/25" /><span>{tl(MSG.legendVrat, locale)}</span></div>
      </div>

      {/* Footer — in flow (was absolute, which collided with the festival
          strip when content grew past minHeight). */}
      <div className="mt-auto border-t border-gold-primary/20 px-10 py-2.5 text-text-secondary text-[10px] flex items-center justify-between">
        <span>
          {tl(MSG.exportFooter, locale)
            .replace('{date}', generatedAt)
            .replace('{location}', locationName)}
        </span>
        <span className="tracking-wider">dekhopanchang.com</span>
      </div>
    </div>
  );
});

export default TithiCalendarExport;
