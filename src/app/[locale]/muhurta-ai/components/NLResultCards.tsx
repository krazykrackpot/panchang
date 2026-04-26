'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Sparkles, Loader2 } from 'lucide-react';
import type { MuhurtaWindow } from '@/lib/muhurta/smart-search';

// ── Score bar color based on value (out of 25) ──────────────────
function barColor(value: number, max: number): string {
  const pct = value / max;
  if (pct >= 0.8) return 'bg-emerald-500';
  if (pct >= 0.6) return 'bg-gold-primary';
  if (pct >= 0.4) return 'bg-amber-500';
  return 'bg-red-400';
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-gold-light';
  if (score >= 40) return 'text-amber-400';
  return 'text-red-400';
}

function qualityBadge(quality: string): { text: string; cls: string } {
  switch (quality) {
    case 'excellent':
    case 'auspicious':
      return { text: quality, cls: 'text-emerald-400' };
    case 'moderate':
    case 'neutral':
      return { text: quality, cls: 'text-text-secondary' };
    case 'inauspicious':
      return { text: quality, cls: 'text-red-400' };
    default:
      return { text: quality, cls: 'text-text-secondary' };
  }
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ── Sub-score bar ───────────────────────────────────────────────
function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-20 text-text-secondary shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor(value, max)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-text-secondary tabular-nums">{value}/{max}</span>
    </div>
  );
}

// ── Single proof card ───────────────────────────────────────────
function ProofCard({ window: w, locale }: { window: MuhurtaWindow; locale: string }) {
  const [expanded, setExpanded] = useState(false);
  const isHi = locale === 'hi';

  return (
    <div className="rounded-xl bg-gradient-to-br from-bg-secondary/80 to-bg-secondary/40 border border-gold-primary/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-gold-light text-sm font-medium">
              {formatDate(w.date)}
            </p>
            <p className="text-text-secondary text-xs mt-0.5">
              {w.startTime} to {w.endTime}
            </p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold tabular-nums ${scoreColor(w.score)}`}>
              {w.score}
            </span>
            <span className="text-text-secondary text-xs">/100</span>
          </div>
        </div>

        {/* Score breakdown bars */}
        <div className="space-y-1.5">
          <ScoreBar label={isHi ? 'पंचांग' : 'Panchang'} value={w.breakdown.panchang} max={25} />
          <ScoreBar label={isHi ? 'लग्न' : 'Lagna'} value={w.breakdown.lagna} max={25} />
          <ScoreBar label={isHi ? 'होरा' : 'Hora'} value={w.breakdown.hora} max={25} />
          <ScoreBar label={isHi ? 'व्यक्तिगत' : 'Personal'} value={w.breakdown.personal} max={25} />
        </div>
      </div>

      {/* Special yogas banner */}
      {w.proof.specialYogas.length > 0 && (
        <div className="mx-4 mb-3 flex items-center gap-1.5 text-xs text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          {w.proof.specialYogas.join(', ')}
        </div>
      )}

      {/* Expandable proof section */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 border-t border-gold-primary/5 text-xs text-text-secondary hover:text-gold-light transition-colors"
      >
        <span>{isHi ? 'गणना प्रमाण' : 'Calculation Proof'}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 text-xs border-t border-gold-primary/5 pt-3">
          {/* Tithi */}
          <ProofRow
            label={isHi ? 'तिथि' : 'Tithi'}
            value={w.proof.tithi.name}
            quality={w.proof.tithi.quality}
          />
          {/* Nakshatra */}
          <ProofRow
            label={isHi ? 'नक्षत्र' : 'Nakshatra'}
            value={w.proof.nakshatra.name}
            quality={w.proof.nakshatra.quality}
          />
          {/* Yoga */}
          <ProofRow
            label={isHi ? 'योग' : 'Yoga'}
            value={w.proof.yoga.name}
            quality={w.proof.yoga.quality}
          />
          {/* Lagna */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">{isHi ? 'लग्न' : 'Lagna'}</span>
            <span className="text-gold-light">{w.proof.lagna.sign} &mdash; {w.proof.lagna.quality}</span>
          </div>
          {/* Hora */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">{isHi ? 'होरा' : 'Hora'}</span>
            <span className="flex items-center gap-1.5">
              <span className="text-gold-light">{w.proof.hora.planet}</span>
              {w.proof.hora.match ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-400/60" />
              )}
            </span>
          </div>
          {/* Dasha harmony */}
          {w.proof.dashaHarmony && (
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">{isHi ? 'दशा सामंजस्य' : 'Dasha Harmony'}</span>
              <span className="text-emerald-400">{w.proof.dashaHarmony}</span>
            </div>
          )}
          {/* Special yogas detail */}
          {w.proof.specialYogas.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">{isHi ? 'विशेष योग' : 'Special'}</span>
              <span className="text-amber-400">{w.proof.specialYogas.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProofRow({ label, value, quality }: { label: string; value: string; quality: string }) {
  const badge = qualityBadge(quality);
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-gold-light">{value}</span>
        <span className={`text-[10px] uppercase tracking-wider ${badge.cls}`}>({badge.text})</span>
      </span>
    </div>
  );
}

// ── Extracted params display ────────────────────────────────────
interface ExtractedParams {
  activity: string;
  activityLabel: string;
  startDate: string;
  endDate: string;
  lat: number;
  lng: number;
}

// ── Main component ──────────────────────────────────────────────
interface NLResultCardsProps {
  results: MuhurtaWindow[] | null;
  searching: boolean;
  error: string;
  extractedParams: ExtractedParams | null;
  locale: string;
  headingFont: React.CSSProperties;
}

export default function NLResultCards({
  results,
  searching,
  error,
  extractedParams,
  locale,
  headingFont,
}: NLResultCardsProps) {
  const isHi = locale === 'hi';

  // Loading state
  if (searching) {
    return (
      <div className="mb-8 flex items-center justify-center gap-3 py-12 text-text-secondary text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-gold-primary" />
        {isHi ? 'शुभ मुहूर्त खोज रहे हैं...' : 'Scanning time windows...'}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  // No results yet (haven't searched)
  if (results === null) return null;

  // Searched but empty
  if (results.length === 0) {
    return (
      <div className="mb-8 bg-bg-secondary/50 border border-gold-primary/10 rounded-xl px-4 py-6 text-center text-text-secondary text-sm">
        {isHi
          ? 'इस अवधि में कोई शुभ मुहूर्त नहीं मिला। कृपया व्यापक तिथि सीमा आज़माएं।'
          : 'No auspicious windows found in this range. Try a wider date range or different activity.'}
      </div>
    );
  }

  return (
    <div className="mb-10">
      {/* Extracted params summary */}
      {extractedParams && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <span className="bg-gold-primary/10 text-gold-light px-2 py-1 rounded">
            {extractedParams.activityLabel}
          </span>
          <span>
            {formatDate(extractedParams.startDate)} &ndash; {formatDate(extractedParams.endDate)}
          </span>
        </div>
      )}

      <h3
        className="text-gold-light text-base font-semibold mb-4"
        style={headingFont}
      >
        {isHi
          ? `${results.length} शुभ मुहूर्त मिले`
          : `${results.length} auspicious window${results.length !== 1 ? 's' : ''} found`}
      </h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((w, i) => (
          <ProofCard key={`${w.date}-${w.startTime}-${i}`} window={w} locale={locale} />
        ))}
      </div>
    </div>
  );
}
