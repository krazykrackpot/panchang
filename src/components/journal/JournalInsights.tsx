'use client';

/**
 * JournalInsights — Displays astrological pattern analysis from journal entries.
 *
 * Shows best/worst conditions, all detected patterns with mood/energy bars,
 * delta badges, strength indicators, and sample sizes.
 *
 * Designed for lazy loading via next/dynamic.
 */

import { useMemo, useState } from 'react';
import {
  Moon, Star, Calendar, Sparkles, TrendingUp, TrendingDown,
  ChevronDown, ChevronUp, Activity, Eye,
} from 'lucide-react';
import type { JournalEntry } from '@/types/journal';
import { analyzeJournalPatterns, type JournalPattern, type JournalInsights as JournalInsightsType } from '@/lib/journal/pattern-engine';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: 'Your Astrological Patterns',
    subtitle: 'Mood & energy correlations with planetary conditions',
    notEnoughTitle: 'Patterns Emerging...',
    notEnoughDesc: (have: number, need: number) =>
      `You have ${have} entries. Keep journaling — patterns emerge after ${need} entries.`,
    bestTitle: 'Best Conditions',
    worstTitle: 'Watch Out',
    allPatternsTitle: 'All Patterns',
    showAll: 'Show all patterns',
    hideAll: 'Hide patterns',
    mood: 'Mood',
    energy: 'Energy',
    entries: 'entries',
    avgMood: 'Avg mood',
    avgEnergy: 'Avg energy',
    overall: 'Overall',
    noPatterns: 'No significant patterns detected yet.',
    strong: 'Strong',
    moderate: 'Moderate',
    emerging: 'Emerging',
  },
  hi: {
    title: 'आपके ज्योतिषीय प्रतिमान',
    subtitle: 'ग्रहीय स्थितियों के साथ मनोदशा और ऊर्जा सम्बन्ध',
    notEnoughTitle: 'प्रतिमान उभर रहे हैं...',
    notEnoughDesc: (have: number, need: number) =>
      `आपके पास ${have} प्रविष्टियाँ हैं। जर्नल लिखते रहें — ${need} प्रविष्टियों के बाद प्रतिमान दिखेंगे।`,
    bestTitle: 'सर्वोत्तम स्थितियाँ',
    worstTitle: 'सावधान रहें',
    allPatternsTitle: 'सभी प्रतिमान',
    showAll: 'सभी प्रतिमान दिखाएँ',
    hideAll: 'प्रतिमान छिपाएँ',
    mood: 'मनोदशा',
    energy: 'ऊर्जा',
    entries: 'प्रविष्टियाँ',
    avgMood: 'औसत मनोदशा',
    avgEnergy: 'औसत ऊर्जा',
    overall: 'समग्र',
    noPatterns: 'अभी तक कोई महत्वपूर्ण प्रतिमान नहीं मिला।',
    strong: 'दृढ़',
    moderate: 'मध्यम',
    emerging: 'उभरता',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getLabels(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPatternIcon(type: JournalPattern['type']) {
  switch (type) {
    case 'moon_sign': return Moon;
    case 'nakshatra': return Star;
    case 'weekday': return Calendar;
    case 'tithi_type': return Moon;
    case 'dasha': return Activity;
    case 'yoga': return Sparkles;
    case 'sade_sati': return Eye;
    default: return Star;
  }
}

/** Mood 1-5 mapped to color class */
function moodColor(val: number): string {
  if (val >= 4.5) return 'bg-emerald-500';
  if (val >= 3.5) return 'bg-green-500';
  if (val >= 2.5) return 'bg-yellow-500';
  if (val >= 1.5) return 'bg-orange-500';
  return 'bg-red-500';
}

function deltaColor(delta: number): string {
  if (delta > 0.2) return 'text-emerald-400';
  if (delta < -0.2) return 'text-red-400';
  return 'text-text-secondary';
}

function deltaBgColor(delta: number): string {
  if (delta > 0.2) return 'bg-emerald-500/15 border-emerald-500/30';
  if (delta < -0.2) return 'bg-red-500/15 border-red-500/30';
  return 'bg-white/5 border-white/10';
}

function strengthStyle(strength: JournalPattern['strength']): string {
  switch (strength) {
    case 'strong': return 'bg-gold-primary/20 border-gold-primary/40 text-gold-light';
    case 'moderate': return 'bg-white/5 border-gold-primary/20 text-gold-primary/80';
    case 'emerging': return 'bg-white/5 border-dashed border-white/15 text-text-secondary';
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MoodBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${moodColor(value)}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function DeltaBadge({ delta, label }: { delta: number; label: string }) {
  const sign = delta > 0 ? '+' : '';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${deltaBgColor(delta)}`}>
      <span className={deltaColor(delta)}>{sign}{delta.toFixed(2)}</span>
      <span className="text-text-secondary/70">{label}</span>
    </span>
  );
}

function StrengthBadge({ strength, locale }: { strength: JournalPattern['strength']; locale: string }) {
  const L = getLabels(locale);
  const text = L[strength];
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${strengthStyle(strength)}`}>
      {text}
    </span>
  );
}

function PatternCard({
  pattern,
  locale,
  compact = false,
}: {
  pattern: JournalPattern;
  locale: string;
  compact?: boolean;
}) {
  const L = getLabels(locale);
  const lang = (locale === 'hi' || locale === 'sa') ? 'hi' : 'en';
  const Icon = getPatternIcon(pattern.type);

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-3.5 h-3.5 text-gold-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-text-primary truncate">
              {pattern.label[lang]}
            </span>
            <StrengthBadge strength={pattern.strength} locale={locale} />
          </div>

          {!compact && (
            <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
              {pattern.description[lang]}
            </p>
          )}

          {/* Mood + Energy bars */}
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-secondary w-12 flex-shrink-0">{L.mood}</span>
              <MoodBar value={pattern.avgMood} />
              <span className="text-[10px] text-text-primary font-medium w-6 text-right">
                {pattern.avgMood.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-secondary w-12 flex-shrink-0">{L.energy}</span>
              <MoodBar value={pattern.avgEnergy} />
              <span className="text-[10px] text-text-primary font-medium w-6 text-right">
                {pattern.avgEnergy.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Delta badges + sample size */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <DeltaBadge delta={pattern.moodDelta} label={L.mood.toLowerCase()} />
            <DeltaBadge delta={pattern.energyDelta} label={L.energy.toLowerCase()} />
            <span className="text-[10px] text-text-secondary">
              {pattern.sampleSize} {L.entries}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConditionSection({
  title,
  patterns,
  locale,
  icon: SectionIcon,
  borderColor,
}: {
  title: string;
  patterns: JournalPattern[];
  locale: string;
  icon: typeof TrendingUp;
  borderColor: string;
}) {
  if (patterns.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <SectionIcon className={`w-4 h-4 ${borderColor}`} />
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="grid gap-2">
        {patterns.map((p, i) => (
          <PatternCard key={`${p.type}-${p.label.en}-${i}`} pattern={p} locale={locale} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Not enough data state
// ---------------------------------------------------------------------------

function NotEnoughData({ insights, locale }: { insights: JournalInsightsType; locale: string }) {
  const L = getLabels(locale);
  const hf = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const pct = Math.min((insights.totalEntries / insights.minEntriesForPatterns) * 100, 100);

  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gold-primary/[0.03] p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-gold-primary" />
        </div>
        <h2 className="text-lg font-bold text-gold-light" style={hf}>
          {L.notEnoughTitle}
        </h2>
      </div>

      <p className="text-sm text-text-secondary mb-4">
        {L.notEnoughDesc(insights.totalEntries, insights.minEntriesForPatterns)}
      </p>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-text-secondary mt-1.5">
        {insights.totalEntries} / {insights.minEntriesForPatterns}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface JournalInsightsProps {
  entries: JournalEntry[];
  locale: string;
}

export default function JournalInsights({ entries, locale }: JournalInsightsProps) {
  const [showAll, setShowAll] = useState(false);

  const insights = useMemo(() => analyzeJournalPatterns(entries), [entries]);

  const L = getLabels(locale);
  const hf = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  // Don't render at all if zero entries
  if (entries.length === 0) return null;

  // Not enough data — show progress
  if (!insights.hasEnoughData) {
    return <NotEnoughData insights={insights} locale={locale} />;
  }

  const hasPatterns = insights.patterns.length > 0;

  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gold-primary/[0.02] p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-gold-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gold-light" style={hf}>
            {L.title}
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">{L.subtitle}</p>
        </div>
      </div>

      {/* Overall averages */}
      <div className="flex items-center gap-4 text-xs text-text-secondary px-1">
        <span>{L.overall}:</span>
        <span>{L.avgMood} <span className="text-text-primary font-medium">{insights.overallAvgMood.toFixed(1)}</span></span>
        <span>{L.avgEnergy} <span className="text-text-primary font-medium">{insights.overallAvgEnergy.toFixed(1)}</span></span>
        <span className="text-text-secondary/50">({insights.totalEntries} {L.entries})</span>
      </div>

      {!hasPatterns && (
        <p className="text-sm text-text-secondary text-center py-4">{L.noPatterns}</p>
      )}

      {hasPatterns && (
        <>
          {/* Best conditions */}
          <ConditionSection
            title={L.bestTitle}
            patterns={insights.bestConditions}
            locale={locale}
            icon={TrendingUp}
            borderColor="text-emerald-400"
          />

          {/* Worst conditions */}
          <ConditionSection
            title={L.worstTitle}
            patterns={insights.worstConditions}
            locale={locale}
            icon={TrendingDown}
            borderColor="text-red-400"
          />

          {/* All patterns (expandable) */}
          {insights.patterns.length > 6 && (
            <div>
              <button
                onClick={() => setShowAll((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-gold-primary hover:text-gold-light transition-colors font-medium"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    {L.hideAll}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    {L.showAll} ({insights.patterns.length})
                  </>
                )}
              </button>

              {showAll && (
                <div className="mt-3 grid gap-2">
                  {insights.patterns.map((p, i) => (
                    <PatternCard
                      key={`all-${p.type}-${p.label.en}-${i}`}
                      pattern={p}
                      locale={locale}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
