'use client';

import { useEffect, useRef } from 'react';
import { tl } from '@/lib/utils/trilingual';
import MSG from '@/messages/pages/tithi.json';
import type { TithiDayData } from './TithiMonthGrid';
import { computeBalam } from '@/lib/panchang/balam';
import { isVratDay } from '@/lib/calendar/vrat-detection';
import { parseLocalDate } from '@/lib/calendar/parse-local-date';
import type { NatalContext } from '@/types/tithi-calendar';
import { festivalIconFor } from '@/components/icons/FestivalIcons';

const NO_NATAL: NatalContext = { kind: 'none' };

/**
 * Mobile list view — renders one row per day, vertically. Replaces the
 * horizontal-scroll grid below the sm breakpoint.
 *
 * Per the redesign plan (docs/tithi-calendar-redesign-plan.md §5):
 *   - One row per day, 76px regular / ~110-130px special
 *   - Sticky paksha header at top of each paksha section
 *   - Auto-scroll to today on load
 *   - Tap any row → DayDetailPanel bottom sheet (delegated via onDayClick)
 *   - Personalisation ★ chip visible on rows
 *
 * This is a SEPARATE component from TithiMonthGrid (not a CSS-only
 * adaptation) because the information hierarchy is fundamentally
 * different in a vertical list.
 */

interface Props {
  year: number;
  month: number;
  days: TithiDayData[];
  locale: string;
  natal?: NatalContext;
  onDayClick?: (date: string) => void;
}

export default function TithiMonthList({
  days, locale, natal = NO_NATAL, onDayClick,
}: Props) {
  const todayRef = useRef<HTMLButtonElement | null>(null);
  // Auto-scroll to today on first render if it's in this month.
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }, [days]);

  // Walk the days and inject section headers when paksha changes.
  const segments: Array<{ kind: 'header'; key: string; paksha: 'shukla' | 'krishna'; masa?: string } | { kind: 'row'; key: string; day: TithiDayData }> = [];
  let prevPaksha: 'shukla' | 'krishna' | null = null;
  for (const day of days) {
    if (day.paksha !== prevPaksha) {
      segments.push({
        kind: 'header',
        key: `h-${day.day}`,
        paksha: day.paksha,
        masa: day.masa?.amanta,
      });
      prevPaksha = day.paksha;
    }
    segments.push({ kind: 'row', key: `d-${day.day}`, day });
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gold-primary/25 bg-gradient-to-br from-[#171036] via-[#120c2a] to-[#0c0a22] shadow-2xl shadow-black/40">
      {segments.map((seg) => {
        if (seg.kind === 'header') {
          const isShukla = seg.paksha === 'shukla';
          return (
            <div
              key={seg.key}
              className={`sticky top-0 z-10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-bold flex items-baseline gap-2 backdrop-blur-sm ${
                isShukla
                  ? 'bg-amber-500/15 text-amber-100 border-y border-amber-400/30'
                  : 'bg-indigo-500/15 text-indigo-100 border-y border-indigo-400/30'
              }`}
            >
              <span>{isShukla ? tl(MSG.pakshaShukla, locale) : tl(MSG.pakshaKrishna, locale)}</span>
              {seg.masa && <span className="text-text-secondary/70 normal-case tracking-wider">· {seg.masa}</span>}
            </div>
          );
        }
        return (
          <ListRow
            key={seg.key}
            day={seg.day}
            locale={locale}
            natal={natal}
            onClick={() => onDayClick?.(seg.day.date)}
            rowRef={seg.day.isToday ? todayRef : undefined}
          />
        );
      })}
    </div>
  );
}

function ListRow({
  day, locale, natal, onClick, rowRef,
}: {
  day: TithiDayData;
  locale: string;
  natal: NatalContext;
  onClick: () => void;
  rowRef?: React.Ref<HTMLButtonElement>;
}) {
  const isPurnima = day.tithiNumber === 15;
  const isAmavasya = day.tithiNumber === 30;
  const isEkadashi = day.tithiNumber === 11 || day.tithiNumber === 26;
  const isSpecial = isPurnima || isAmavasya || isEkadashi;
  const isMajor = day.festivals.some((f) => f.type === 'major');
  const isEclipse = day.festivals.some((f) => f.type === 'eclipse');
  const isVrat = isVratDay(day.festivals);

  // Personalised auspicious — canonical engine, see TithiMonthGrid for rationale.
  let personalisedAuspicious = false;
  if (natal.kind === 'present' && day.nakshatraNum && day.moonRashiNum) {
    const balam = computeBalam(natal.nakshatra, natal.moonSign, day.nakshatraNum, day.moonRashiNum);
    personalisedAuspicious = balam.tarabalam.favorable && balam.chandrabalam.favorable;
  }

  const headlineFestival = day.festivals.find((f) => f.type === 'major');
  const HeadlineIcon = headlineFestival ? festivalIconFor(headlineFestival.slug) : null;

  // Row chrome
  const rowBg = day.isToday
    ? 'bg-gradient-to-r from-gold-primary/25 via-gold-primary/10 to-transparent ring-2 ring-inset ring-gold-primary/50'
    : isPurnima
      ? 'bg-gradient-to-r from-amber-500/18 to-transparent'
      : isAmavasya
        ? 'bg-gradient-to-r from-violet-700/20 to-transparent'
        : isEkadashi
          ? 'bg-gradient-to-r from-emerald-700/18 to-transparent'
          : isEclipse
            ? 'bg-gradient-to-r from-red-700/18 to-transparent'
            : isMajor
              ? 'bg-gradient-to-r from-gold-primary/12 to-transparent'
              : 'hover:bg-gold-primary/[0.04]';

  const dayCircle = day.isToday
    ? 'bg-gold-primary text-bg-primary border-2 border-gold-light shadow-[0_0_12px_rgba(212,168,83,0.5)]'
    : isPurnima
      ? 'bg-amber-400/40 text-amber-50 border border-amber-300/70'
      : isAmavasya
        ? 'bg-violet-500/40 text-violet-50 border border-violet-300/70'
        : isEkadashi
          ? 'bg-emerald-500/40 text-emerald-50 border border-emerald-300/70'
          : day.paksha === 'shukla'
            ? 'bg-amber-500/15 text-amber-100 border border-amber-400/30'
            : 'bg-indigo-500/15 text-indigo-100 border border-indigo-400/30';

  return (
    <button
      ref={rowRef}
      onClick={onClick}
      className={`w-full text-left flex items-stretch border-b border-gold-primary/[0.06] transition-colors ${rowBg} ${isVrat ? 'border-l-[3px] border-l-violet-400/70' : ''}`}
    >
      {/* Date column */}
      <div className="shrink-0 w-14 flex flex-col items-center justify-center py-3 px-1">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm ${dayCircle}`}>
          {day.day}
        </div>
        {/* parseLocalDate prevents Friday-becomes-Thursday west of UTC (Lesson L).
            suppressHydrationWarning: same Intl-CLDR asymmetry as the grid header. */}
        <div className="text-[9px] uppercase tracking-wider text-text-secondary/70 mt-1" suppressHydrationWarning>
          {new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(parseLocalDate(day.date) ?? new Date())}
        </div>
      </div>

      {/* Main content column */}
      <div className="flex-1 min-w-0 py-3 pr-3">
        {/* Tithi name + special badge */}
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className={`font-bold text-sm ${
            isPurnima ? 'text-amber-200' :
            isAmavasya ? 'text-violet-200' :
            isEkadashi ? 'text-emerald-200' :
            day.paksha === 'shukla' ? 'text-amber-100/90' : 'text-indigo-100/90'
          }`}>
            {tl(day.tithiName, locale)}
          </span>
          {isSpecial && (
            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
              isPurnima ? 'bg-amber-500/30 text-amber-100' :
              isAmavasya ? 'bg-violet-500/30 text-violet-100' :
              'bg-emerald-500/30 text-emerald-100'
            }`}>
              {isPurnima ? tl(MSG.fullMoon, locale) : isAmavasya ? tl(MSG.newMoon, locale) : tl(MSG.ekadashi, locale)}
            </span>
          )}
          {personalisedAuspicious && (
            <span className="ml-auto text-gold-light font-black text-base" title={tl(MSG.detailAuspiciousForYou, locale)}>★</span>
          )}
        </div>

        {/* Nakshatra + transition */}
        {day.nakshatra && (
          <div className="text-[11px] text-cyan-200/85 truncate">
            {tl(day.nakshatra, locale)}
            {day.nakshatraEnd && (
              <span className="ml-1 font-mono text-cyan-300/65 text-[10px]">
                → {day.nakshatraEnd.hhmm}{day.nakshatraEnd.nextDay ? '⁺' : ''}
              </span>
            )}
          </div>
        )}

        {/* Headline festival ribbon */}
        {headlineFestival && HeadlineIcon && (
          <div className="mt-1.5 flex items-center gap-1.5 px-2 py-1 rounded bg-gradient-to-r from-gold-primary/40 to-gold-primary/15 border border-gold-primary/55">
            <HeadlineIcon size={16} className="shrink-0" />
            <span className="text-[10.5px] font-black text-gold-light uppercase tracking-wider truncate">
              {tl(headlineFestival.name, locale)}
            </span>
          </div>
        )}

        {/* Other festivals (vrat / eclipse / etc.) */}
        {day.festivals
          .filter((f) => f !== headlineFestival)
          .slice(0, 2)
          .map((f, i) => {
            const Icon = festivalIconFor(f.slug);
            return (
              <div
                key={i}
                className={`mt-1 flex items-center gap-1.5 text-[10px] truncate ${
                  f.type === 'eclipse' ? 'text-red-200' : 'text-violet-200'
                }`}
              >
                <Icon size={12} className="shrink-0" />
                <span className="truncate">{tl(f.name, locale)}</span>
              </div>
            );
          })}
      </div>

      {/* Right column — sunrise/sunset */}
      <div className="shrink-0 w-16 flex flex-col items-end justify-center py-3 pr-3 gap-1">
        {day.sunrise && (
          <div className="text-[10px] font-mono text-amber-200/85">↑ {day.sunrise}</div>
        )}
        {day.sunset && (
          <div className="text-[10px] font-mono text-amber-300/65">↓ {day.sunset}</div>
        )}
        {day.rahuKaal && (
          <div className="text-[9px] font-mono text-red-300/75 flex items-center gap-0.5">
            <span className="w-1 h-1 rounded-full bg-red-400" />
            {day.rahuKaal.start}
          </div>
        )}
      </div>
    </button>
  );
}
