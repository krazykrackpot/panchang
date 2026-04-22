'use client';

/**
 * TrajectoryCard — full-width card showing all 8 domain trends at a glance.
 *
 * Renders sparkline charts, delta badges, and callout boxes for the
 * biggest gain / biggest drop domains.
 */

import { useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import SparklineChart from './SparklineChart';
import type { FullTrajectory, DomainTrajectory } from '@/lib/kundali/domain-synthesis/trajectory';
import type { DomainType } from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Domain name mapping (bilingual)
// ---------------------------------------------------------------------------

const DOMAIN_NAMES: Record<string, { en: string; hi: string }> = {
  health:    { en: 'Health',    hi: 'स्वास्थ्य' },
  wealth:    { en: 'Wealth',    hi: 'धन' },
  career:    { en: 'Career',    hi: 'करियर' },
  marriage:  { en: 'Marriage',  hi: 'विवाह' },
  children:  { en: 'Children',  hi: 'संतान' },
  family:    { en: 'Family',    hi: 'परिवार' },
  spiritual: { en: 'Spiritual', hi: 'आध्यात्म' },
  education: { en: 'Education', hi: 'शिक्षा' },
};

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const LABELS = {
  title:       { en: 'Your Trends',      hi: 'आपकी प्रवृत्तियाँ', sa: 'भवत्प्रवृत्तयः' },
  snapshot:    { en: 'Your Scores',       hi: 'आपके अंक',          sa: 'भवदंकाः' },
  biggestGain: { en: 'Biggest gain',      hi: 'सबसे बड़ी वृद्धि',   sa: 'अधिकतमवृद्धिः' },
  watch:       { en: 'Watch',             hi: 'ध्यान दें',          sa: 'अवधानम्' },
  improving:   { en: 'Improving',         hi: 'सुधार',             sa: 'सुधारः' },
  declining:   { en: 'Declining',         hi: 'गिरावट',            sa: 'ह्रासः' },
  mixed:       { en: 'Mixed',             hi: 'मिश्रित',           sa: 'मिश्रम्' },
  stable:      { en: 'Stable',            hi: 'स्थिर',             sa: 'स्थिरम्' },
  firstReading:{ en: 'First Reading',     hi: 'प्रथम पठन',         sa: 'प्रथमपठनम्' },
};

// ---------------------------------------------------------------------------
// Overall trend badge colour
// ---------------------------------------------------------------------------

const TREND_BADGE_CLASS: Record<FullTrajectory['overallTrend'], string> = {
  improving: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  declining: 'bg-red-500/15 text-red-400 border-red-500/20',
  mixed:     'bg-amber-500/15 text-amber-400 border-amber-500/20',
  stable:    'bg-gold-primary/15 text-gold-light border-gold-primary/20',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Locale-aware domain name. */
function domainName(domain: DomainType, locale: string): string {
  const names = DOMAIN_NAMES[domain];
  if (!names) return domain;
  if (locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai') return names.hi;
  return names.en;
}

/** Locale-aware label from LABELS. */
function label(key: keyof typeof LABELS, locale: string): string {
  const obj = LABELS[key];
  if (locale === 'hi' || locale === 'sa') return obj.hi;
  return obj.en;
}

/** Format delta for display: "+2.1" or "-0.8" or "---". */
function formatDelta(delta: number): string {
  if (delta === 0) return '\u2014'; // em dash
  const sign = delta > 0 ? '+' : '';
  return `${sign}${Math.round(delta * 10) / 10}`;
}

/** Arrow character for trend. */
function trendArrow(trend: DomainTrajectory['trend']): string {
  if (trend === 'rising') return '\u2191';  // up arrow
  if (trend === 'falling') return '\u2193'; // down arrow
  return '';
}

/** Colour class for delta badge. */
function deltaClass(delta: number): string {
  if (delta > 0) return 'text-emerald-400';
  if (delta < 0) return 'text-red-400';
  return 'text-text-secondary';
}

/** Score colour: green for high, amber for mid, red for low. */
function scoreColor(score: number): string {
  if (score >= 7) return 'text-emerald-400';
  if (score >= 4) return 'text-amber-400';
  return 'text-red-400';
}

/** Score bar fill colour. */
function scoreBarColor(score: number): string {
  if (score >= 7) return 'bg-emerald-400';
  if (score >= 4) return 'bg-amber-400';
  return 'bg-red-400';
}

/** Qualitative score label. */
function scoreLabel(score: number, locale: string): string {
  if (locale === 'hi' || locale === 'sa') {
    if (score >= 8) return 'उत्तम';
    if (score >= 6) return 'अच्छा';
    if (score >= 4) return 'मध्यम';
    return 'कमज़ोर';
  }
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Good';
  if (score >= 4) return 'Moderate';
  return 'Weak';
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TrajectoryCardProps {
  trajectory: FullTrajectory;
  locale: string;
  /** Dashboard compact mode: only top 3, smaller sparklines, no callouts. */
  compact?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TrajectoryCard({ trajectory, locale, compact = false }: TrajectoryCardProps) {
  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  const isSnapshot = !trajectory.hasHistory;

  // In compact mode, show only the top 3 most-changed domains (by absolute delta)
  // In snapshot mode (no history), sort by score descending for visual interest
  const visibleDomains = useMemo(() => {
    if (isSnapshot) {
      const sorted = [...trajectory.domains].sort((a, b) => b.current - a.current);
      return compact ? sorted.slice(0, 3) : sorted;
    }
    if (!compact) return trajectory.domains;
    const sorted = [...trajectory.domains].sort(
      (a, b) => Math.abs(b.delta) - Math.abs(a.delta),
    );
    return sorted.slice(0, 3);
  }, [compact, isSnapshot, trajectory.domains]);

  const sparkW = compact ? 80 : 120;
  const sparkH = compact ? 24 : 32;

  // ---- Snapshot mode: show current scores as a score card ----
  if (isSnapshot) {
    // Find strongest & weakest for callout boxes
    const sorted = [...trajectory.domains].sort((a, b) => b.current - a.current);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];

    return (
      <div className="w-full rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-gold-light text-base font-semibold tracking-wide"
            style={headingStyle}
          >
            {label('snapshot', locale)}
          </h3>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border bg-gold-primary/15 text-gold-light border-gold-primary/20">
            {label('firstReading', locale)}
          </span>
        </div>

        {/* Domain score rows */}
        <div className="space-y-3">
          {visibleDomains.map((dt) => (
            <div
              key={dt.domain}
              className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              {/* Domain name */}
              <span
                className="text-text-primary text-sm w-20 shrink-0 truncate"
                style={bodyStyle}
              >
                {domainName(dt.domain, locale)}
              </span>

              {/* Score bar */}
              <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full ${scoreBarColor(dt.current)} transition-all`}
                  style={{ width: `${(dt.current / 10) * 100}%` }}
                />
              </div>

              {/* Score + label */}
              <span className={`text-xs font-mono font-medium w-20 text-right shrink-0 ${scoreColor(dt.current)}`}>
                {dt.current.toFixed(1)}{' '}
                <span className="text-text-secondary font-sans text-[10px]">
                  {scoreLabel(dt.current, locale)}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Strongest & weakest callouts */}
        {!compact && strongest && weakest && strongest.current !== weakest.current && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/8 border border-emerald-500/15 px-3 py-2">
              <span className="text-emerald-400 text-lg leading-none">{'\u2605'}</span>
              <div>
                <span className="text-emerald-400 text-xs font-medium block">
                  {locale === 'hi' || locale === 'sa' ? 'सबसे मज़बूत' : 'Strongest'}
                </span>
                <span className="text-text-primary text-sm" style={bodyStyle}>
                  {domainName(strongest.domain, locale)}{' '}
                  <span className="text-emerald-400 font-mono text-xs">
                    {strongest.current.toFixed(1)}/10
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/8 border border-amber-500/15 px-3 py-2">
              <span className="text-amber-400 text-lg leading-none">{'\u26A0'}</span>
              <div>
                <span className="text-amber-400 text-xs font-medium block">
                  {locale === 'hi' || locale === 'sa' ? 'ध्यान दें' : 'Needs Attention'}
                </span>
                <span className="text-text-primary text-sm" style={bodyStyle}>
                  {domainName(weakest.domain, locale)}{' '}
                  <span className="text-amber-400 font-mono text-xs">
                    {weakest.current.toFixed(1)}/10
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer hint */}
        {trajectory.summary && (
          <p
            className="mt-4 text-text-secondary text-xs leading-relaxed"
            style={bodyStyle}
          >
            {tl(trajectory.summary, locale)}
          </p>
        )}
      </div>
    );
  }

  // ---- Trend mode: show sparklines + deltas (existing behavior) ----
  const overallTrendLabel = label(trajectory.overallTrend as keyof typeof LABELS, locale);
  const overallBadgeClass = TREND_BADGE_CLASS[trajectory.overallTrend];

  return (
    <div className="w-full rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-gold-light text-base font-semibold tracking-wide"
          style={headingStyle}
        >
          {label('title', locale)}
        </h3>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${overallBadgeClass}`}
        >
          {overallTrendLabel}
        </span>
      </div>

      {/* ---- Domain rows ---- */}
      <div className="space-y-2.5">
        {visibleDomains.map((dt) => (
          <div
            key={dt.domain}
            className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors"
          >
            {/* Domain name */}
            <span
              className="text-text-primary text-sm w-20 shrink-0 truncate"
              style={bodyStyle}
            >
              {domainName(dt.domain, locale)}
            </span>

            {/* Sparkline */}
            <SparklineChart
              data={dt.sparkline}
              trend={dt.trend}
              width={sparkW}
              height={sparkH}
            />

            {/* Delta badge */}
            <span
              className={`text-xs font-mono font-medium w-14 text-right shrink-0 ${deltaClass(dt.delta)}`}
            >
              {formatDelta(dt.delta)}
              {dt.delta !== 0 && (
                <span className="ml-0.5">{trendArrow(dt.trend)}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* ---- Footer: summary text ---- */}
      {trajectory.summary && (
        <p
          className="mt-4 text-text-secondary text-xs leading-relaxed"
          style={bodyStyle}
        >
          {tl(trajectory.summary, locale)}
        </p>
      )}

      {/* ---- Callout boxes (not shown in compact mode) ---- */}
      {!compact && (trajectory.biggestGain || trajectory.biggestDrop) && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Biggest gain */}
          {trajectory.biggestGain && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/8 border border-emerald-500/15 px-3 py-2">
              <span className="text-emerald-400 text-lg leading-none">{'\u2191'}</span>
              <div>
                <span className="text-emerald-400 text-xs font-medium block">
                  {label('biggestGain', locale)}
                </span>
                <span className="text-text-primary text-sm" style={bodyStyle}>
                  {domainName(trajectory.biggestGain.domain, locale)}{' '}
                  <span className="text-emerald-400 font-mono text-xs">
                    (+{Math.round(trajectory.biggestGain.delta * 10) / 10})
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Biggest drop */}
          {trajectory.biggestDrop && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/8 border border-red-500/15 px-3 py-2">
              <span className="text-red-400 text-lg leading-none">{'\u2193'}</span>
              <div>
                <span className="text-red-400 text-xs font-medium block">
                  {label('watch', locale)}
                </span>
                <span className="text-text-primary text-sm" style={bodyStyle}>
                  {domainName(trajectory.biggestDrop.domain, locale)}{' '}
                  <span className="text-red-400 font-mono text-xs">
                    ({Math.round(trajectory.biggestDrop.delta * 10) / 10})
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
