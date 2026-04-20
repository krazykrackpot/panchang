'use client';

import { useMemo, useRef, useState } from 'react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type {
  DashaComparisonResult,
  DashaComparisonEntry,
  AlignmentWindow,
} from '@/lib/matching/dasha-comparison';
import { getPlanetColor, getPlanetId } from '@/lib/matching/dasha-comparison';
import { tl } from '@/lib/utils/trilingual';

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface DashaComparisonTimelineProps {
  result: DashaComparisonResult;
  locale: string;
}

/* ─── Constants ─────────────────────────────────────────────────────────── */

const PX_PER_YEAR = 80;
const BAR_HEIGHT = 32;
const ALIGNMENT_HEIGHT = 20;
const YEAR_LABEL_HEIGHT = 24;
const PADDING_TOP = 8;
const CHART_LABEL_WIDTH = 80;
const GAP_BETWEEN_ROWS = 4;

/* Alignment colors — static Tailwind-safe */
const ALIGNMENT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  aligned: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  tension: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' },
  mixed: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
};

/* Quality badge colors — static */
const QUALITY_COLORS: Record<string, string> = {
  favorable: 'text-emerald-400',
  neutral: 'text-amber-400',
  challenging: 'text-red-400',
};

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function dateToYear(iso: string): number {
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    console.error('[DashaTimeline] Invalid date:', iso);
    return 0;
  }
  return d.getFullYear() + d.getMonth() / 12 + d.getDate() / 365;
}

/** Merge consecutive entries with same planet into single bars for rendering */
interface BarSegment {
  planet: string;
  planetName: { en: string; [key: string]: string | undefined };
  startYear: number;
  endYear: number;
  quality: string;
  color: string;
  planetId: number;
}

function mergeSegments(entries: DashaComparisonEntry[], chartKey: 'chart1Period' | 'chart2Period'): BarSegment[] {
  if (!entries.length) return [];

  const bars: BarSegment[] = [];
  let current: BarSegment | null = null;

  for (const entry of entries) {
    const period = entry[chartKey];
    const startY = dateToYear(entry.startDate);
    const endY = dateToYear(entry.endDate);

    if (current && current.planet === period.planet) {
      // Extend the current bar
      current.endYear = endY;
    } else {
      if (current) bars.push(current);
      current = {
        planet: period.planet,
        planetName: period.planetName,
        startYear: startY,
        endYear: endY,
        quality: period.quality,
        color: getPlanetColor(period.planet),
        planetId: getPlanetId(period.planet),
      };
    }
  }
  if (current) bars.push(current);
  return bars;
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function DashaComparisonTimeline({ result, locale }: DashaComparisonTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredEntry, setHoveredEntry] = useState<DashaComparisonEntry | null>(null);

  // Compute year range from entries
  const { minYear, maxYear, totalWidth, bars1, bars2 } = useMemo(() => {
    if (!result.entries.length) {
      return { minYear: 2026, maxYear: 2036, totalWidth: 800, bars1: [], bars2: [] };
    }

    const allDates = result.entries.flatMap(e => [e.startDate, e.endDate]);
    const years = allDates.map(d => new Date(d).getFullYear());
    const mn = Math.min(...years);
    const mx = Math.max(...years) + 1;
    const width = (mx - mn) * PX_PER_YEAR;

    return {
      minYear: mn,
      maxYear: mx,
      totalWidth: Math.max(width, 400),
      bars1: mergeSegments(result.entries, 'chart1Period'),
      bars2: mergeSegments(result.entries, 'chart2Period'),
    };
  }, [result.entries]);

  // Alignment windows mapped to pixel positions
  const alignmentBars = useMemo(() => {
    return result.alignmentWindows.map(w => ({
      ...w,
      left: (dateToYear(w.start) - minYear) * PX_PER_YEAR,
      width: (dateToYear(w.end) - dateToYear(w.start)) * PX_PER_YEAR,
    }));
  }, [result.alignmentWindows, minYear]);

  // Year tick marks
  const yearTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let y = minYear; y <= maxYear; y++) {
      ticks.push(y);
    }
    return ticks;
  }, [minYear, maxYear]);

  if (!result.entries.length) {
    return (
      <div className="text-center text-text-tertiary text-sm py-8">
        {locale === 'en'
          ? 'No dasha data available for timeline comparison.'
          : 'समयरेखा तुलना के लिए दशा डेटा उपलब्ध नहीं।'}
      </div>
    );
  }

  const totalHeight = PADDING_TOP + YEAR_LABEL_HEIGHT + BAR_HEIGHT + GAP_BETWEEN_ROWS + BAR_HEIGHT + GAP_BETWEEN_ROWS + ALIGNMENT_HEIGHT + 12;

  const chart1Label = locale === 'en' ? 'Chart A' : 'कुण्डली अ';
  const chart2Label = locale === 'en' ? 'Chart B' : 'कुण्डली ब';
  const alignLabel = locale === 'en' ? 'Align' : 'सामंजस्य';

  return (
    <div className="space-y-4">
      {/* Summary */}
      {result.summary && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <p className="text-text-secondary text-sm">{result.summary}</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500/40" />
          {locale === 'en' ? 'Aligned' : 'सामंजस्य'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/40" />
          {locale === 'en' ? 'Tension' : 'तनाव'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500/40" />
          {locale === 'en' ? 'Mixed' : 'मिश्रित'}
        </span>
      </div>

      {/* Timeline container */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
        <div className="flex">
          {/* Left labels column */}
          <div
            className="flex-shrink-0 border-r border-gold-primary/10"
            style={{ width: CHART_LABEL_WIDTH }}
          >
            {/* Year row spacer */}
            <div
              className="border-b border-gold-primary/10"
              style={{ height: PADDING_TOP + YEAR_LABEL_HEIGHT }}
            />
            {/* Chart A label */}
            <div
              className="flex items-center px-3 text-xs text-gold-light font-semibold border-b border-gold-primary/5"
              style={{ height: BAR_HEIGHT + GAP_BETWEEN_ROWS }}
            >
              {chart1Label}
            </div>
            {/* Chart B label */}
            <div
              className="flex items-center px-3 text-xs text-gold-light font-semibold border-b border-gold-primary/5"
              style={{ height: BAR_HEIGHT + GAP_BETWEEN_ROWS }}
            >
              {chart2Label}
            </div>
            {/* Alignment label */}
            <div
              className="flex items-center px-3 text-xs text-text-tertiary"
              style={{ height: ALIGNMENT_HEIGHT + 12 }}
            >
              {alignLabel}
            </div>
          </div>

          {/* Scrollable timeline */}
          <div ref={scrollRef} className="overflow-x-auto flex-1">
            <div className="relative" style={{ width: totalWidth, height: totalHeight }}>
              {/* Year tick lines + labels */}
              {yearTicks.map(year => {
                const x = (year - minYear) * PX_PER_YEAR;
                return (
                  <div key={year}>
                    {/* Vertical gridline */}
                    <div
                      className="absolute top-0 border-l border-gold-primary/8"
                      style={{ left: x, height: totalHeight }}
                    />
                    {/* Year label */}
                    <div
                      className="absolute text-xs text-text-tertiary font-mono"
                      style={{ left: x + 4, top: PADDING_TOP }}
                    >
                      {year}
                    </div>
                  </div>
                );
              })}

              {/* Chart 1 bars */}
              {bars1.map((bar, i) => {
                const left = (bar.startYear - minYear) * PX_PER_YEAR;
                const width = Math.max((bar.endYear - bar.startYear) * PX_PER_YEAR, 2);
                const top = PADDING_TOP + YEAR_LABEL_HEIGHT;

                return (
                  <div
                    key={`c1-${i}`}
                    className="absolute rounded-md flex items-center gap-1 px-1.5 overflow-hidden cursor-default transition-opacity hover:opacity-90"
                    style={{
                      left,
                      width,
                      top,
                      height: BAR_HEIGHT,
                      backgroundColor: `${bar.color}33`,
                      borderLeft: `3px solid ${bar.color}`,
                    }}
                    title={`${bar.planet}: ${bar.quality}`}
                  >
                    {width > 40 && (
                      <>
                        {bar.planetId >= 0 && <GrahaIconById id={bar.planetId} size={14} className="opacity-70 flex-shrink-0" />}
                        <span className="text-xs text-text-primary truncate font-medium">
                          {tl(bar.planetName, locale)}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Chart 2 bars */}
              {bars2.map((bar, i) => {
                const left = (bar.startYear - minYear) * PX_PER_YEAR;
                const width = Math.max((bar.endYear - bar.startYear) * PX_PER_YEAR, 2);
                const top = PADDING_TOP + YEAR_LABEL_HEIGHT + BAR_HEIGHT + GAP_BETWEEN_ROWS;

                return (
                  <div
                    key={`c2-${i}`}
                    className="absolute rounded-md flex items-center gap-1 px-1.5 overflow-hidden cursor-default transition-opacity hover:opacity-90"
                    style={{
                      left,
                      width,
                      top,
                      height: BAR_HEIGHT,
                      backgroundColor: `${bar.color}33`,
                      borderLeft: `3px solid ${bar.color}`,
                    }}
                    title={`${bar.planet}: ${bar.quality}`}
                  >
                    {width > 40 && (
                      <>
                        {bar.planetId >= 0 && <GrahaIconById id={bar.planetId} size={14} className="opacity-70 flex-shrink-0" />}
                        <span className="text-xs text-text-primary truncate font-medium">
                          {tl(bar.planetName, locale)}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Alignment strip */}
              {result.entries.map((entry, i) => {
                const startY = dateToYear(entry.startDate);
                const endY = dateToYear(entry.endDate);
                const left = (startY - minYear) * PX_PER_YEAR;
                const width = Math.max((endY - startY) * PX_PER_YEAR, 1);
                const top = PADDING_TOP + YEAR_LABEL_HEIGHT + BAR_HEIGHT + GAP_BETWEEN_ROWS + BAR_HEIGHT + GAP_BETWEEN_ROWS;

                const colors = ALIGNMENT_COLORS[entry.alignment] ?? ALIGNMENT_COLORS.mixed;

                return (
                  <div
                    key={`align-${i}`}
                    className={`absolute rounded-sm ${colors.bg} border-t ${colors.border} cursor-pointer`}
                    style={{ left, width, top, height: ALIGNMENT_HEIGHT }}
                    onMouseEnter={() => setHoveredEntry(entry)}
                    onMouseLeave={() => setHoveredEntry(null)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hover tooltip — rendered below the timeline */}
      {hoveredEntry && (
        <div className="bg-bg-secondary/90 border border-gold-primary/15 rounded-xl p-4 text-sm transition-all">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              {getPlanetId(hoveredEntry.chart1Period.planet) >= 0 && (
                <GrahaIconById id={getPlanetId(hoveredEntry.chart1Period.planet)} size={16} className="opacity-80" />
              )}
              <span className="text-gold-light font-medium">
                {tl(hoveredEntry.chart1Period.planetName, locale)}
              </span>
              <span className={`text-xs ${QUALITY_COLORS[hoveredEntry.chart1Period.quality]}`}>
                ({hoveredEntry.chart1Period.quality})
              </span>
            </div>
            <span className="text-text-tertiary">+</span>
            <div className="flex items-center gap-1.5">
              {getPlanetId(hoveredEntry.chart2Period.planet) >= 0 && (
                <GrahaIconById id={getPlanetId(hoveredEntry.chart2Period.planet)} size={16} className="opacity-80" />
              )}
              <span className="text-gold-light font-medium">
                {tl(hoveredEntry.chart2Period.planetName, locale)}
              </span>
              <span className={`text-xs ${QUALITY_COLORS[hoveredEntry.chart2Period.quality]}`}>
                ({hoveredEntry.chart2Period.quality})
              </span>
            </div>
          </div>
          <p className="text-text-secondary text-xs">{hoveredEntry.interpretation}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs font-semibold ${ALIGNMENT_COLORS[hoveredEntry.alignment]?.text ?? 'text-amber-400'}`}>
              {hoveredEntry.alignment.charAt(0).toUpperCase() + hoveredEntry.alignment.slice(1)}
            </span>
            <span className="text-text-tertiary text-xs">
              {new Date(hoveredEntry.startDate).toLocaleDateString()} — {new Date(hoveredEntry.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
