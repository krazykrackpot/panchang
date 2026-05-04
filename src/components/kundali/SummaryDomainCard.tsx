'use client';

import { useState } from 'react';
import {
  Briefcase,
  Heart,
  GraduationCap,
  HeartPulse,
  Coins,
  Baby,
  Users,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  Clock,
  Gem,
  BookOpen,
} from 'lucide-react';
import type { DomainReading, DomainType, Rating, TimelineTrigger, DomainRemedy } from '@/lib/kundali/domain-synthesis/types';
import type { LifeArea } from '@/lib/kundali/tippanni-types';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SummaryDomainCardProps {
  domain: DomainReading;
  tippanniArea?: LifeArea;
  isTopPriority?: boolean;
  locale: string;
  onDeepDive?: () => void;
}

// ---------------------------------------------------------------------------
// Domain icon map (Lucide)
// ---------------------------------------------------------------------------

const DOMAIN_ICONS: Record<DomainType, React.ComponentType<{ className?: string; size?: number }>> = {
  career: Briefcase,
  wealth: Coins,
  marriage: Heart,
  health: HeartPulse,
  education: GraduationCap,
  children: Baby,
  family: Users,
  spiritual: Sparkles,
  currentPeriod: Clock,
};

// ---------------------------------------------------------------------------
// Rating display helpers
// ---------------------------------------------------------------------------

const RATING_LABELS: Record<Rating, { en: string; sa: string }> = {
  uttama: { en: 'Excellent', sa: 'Uttama' },
  madhyama: { en: 'Moderate', sa: 'Madhyama' },
  adhama: { en: 'Weak', sa: 'Adhama' },
  atyadhama: { en: 'Very Weak', sa: 'Atyadhama' },
};

const RATING_COLORS: Record<Rating, string> = {
  uttama: 'text-emerald-400',
  madhyama: 'text-gold-light',
  adhama: 'text-orange-400',
  atyadhama: 'text-red-400',
};

const RATING_BG: Record<Rating, string> = {
  uttama: 'bg-emerald-500/15 border-emerald-500/30',
  madhyama: 'bg-gold-primary/15 border-gold-primary/30',
  adhama: 'bg-orange-500/15 border-orange-500/30',
  atyadhama: 'bg-red-500/15 border-red-500/30',
};

const REMEDY_ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  mantra: BookOpen,
  gemstone: Gem,
  charity: Heart,
  ritual: Sparkles,
  lifestyle: HeartPulse,
};

// ---------------------------------------------------------------------------
// Star rating (filled gold stars out of 5)
// ---------------------------------------------------------------------------

function StarRating({ score }: { score: number }) {
  // Convert 0-10 score to 0-5 stars
  const stars = Math.round((score / 10) * 5 * 2) / 2; // half-star precision
  const fullStars = Math.floor(stars);
  const hasHalf = stars - fullStars >= 0.5;

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${score.toFixed(1)} out of 10`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < fullStars
              ? 'fill-gold-primary text-gold-primary'
              : i === fullStars && hasHalf
                ? 'fill-gold-primary/50 text-gold-primary'
                : 'text-gold-dark/40'
          }
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Truncate narrative to first N sentences
// ---------------------------------------------------------------------------

function truncateToSentences(text: string, maxSentences: number): { truncated: string; wasTruncated: boolean } {
  // Split on sentence-ending punctuation followed by a space or end-of-string
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!sentences || sentences.length <= maxSentences) {
    return { truncated: text, wasTruncated: false };
  }
  return {
    truncated: sentences.slice(0, maxSentences).join('').trim(),
    wasTruncated: true,
  };
}

// ---------------------------------------------------------------------------
// Timeline trigger compact row
// ---------------------------------------------------------------------------

function TriggerRow({ trigger, locale }: { trigger: TimelineTrigger; locale: string }) {
  const natureColor =
    trigger.nature === 'opportunity'
      ? 'text-emerald-400'
      : trigger.nature === 'challenge'
        ? 'text-red-400'
        : 'text-gold-light';

  const natureDot =
    trigger.nature === 'opportunity'
      ? 'bg-emerald-400'
      : trigger.nature === 'challenge'
        ? 'bg-red-400'
        : 'bg-gold-primary';

  const startLabel = trigger.startDate.slice(0, 7); // YYYY-MM
  const endLabel = trigger.endDate.slice(0, 7);
  const dateRange = startLabel === endLabel ? startLabel : `${startLabel} to ${endLabel}`;

  return (
    <div className="flex items-start gap-2 text-sm">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${natureDot}`} />
      <div className="min-w-0 flex-1">
        <span className={`font-medium ${natureColor}`}>{dateRange}</span>
        <span className="mx-1.5 text-text-secondary">-</span>
        <span className="text-text-primary">{tl(trigger.description, locale)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Remedy pill
// ---------------------------------------------------------------------------

function RemedyPill({ remedy, locale }: { remedy: DomainRemedy; locale: string }) {
  const Icon = REMEDY_ICONS[remedy.type] || Sparkles;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-dark/30 bg-gold-primary/10 px-3 py-1 text-xs text-gold-light">
      <Icon size={12} className="shrink-0" />
      {tl(remedy.name, locale)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SummaryDomainCard({
  domain,
  tippanniArea,
  isTopPriority,
  locale,
  onDeepDive,
}: SummaryDomainCardProps) {
  const [narrativeExpanded, setNarrativeExpanded] = useState(false);
  const [triggersExpanded, setTriggersExpanded] = useState(false);
  const [classicalExpanded, setClassicalExpanded] = useState(false);

  const Icon = DOMAIN_ICONS[domain.domain] || Sparkles;
  const { rating, score } = domain.overallRating;
  const headlineText = tl(domain.headline, locale);
  const domainConfig = getDomainConfig(domain.domain);
  const domainName = domainConfig ? tl(domainConfig.name, locale) : domain.domain;

  // Narrative truncation
  const narrativeRaw = tl(domain.natalPromise.summary, locale);
  const { truncated: narrativeShort, wasTruncated: canExpandNarrative } =
    truncateToSentences(narrativeRaw, 3);

  // Timeline triggers
  const allTriggers = domain.timelineTriggers;
  const visibleTriggers = triggersExpanded ? allTriggers : allTriggers.slice(0, 3);
  const hasMoreTriggers = allTriggers.length > 3;

  // Remedies
  const visibleRemedies = domain.remedies.slice(0, 3);

  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] transition-colors hover:border-gold-primary/40"
    >
      {/* ---- Top priority badge ---- */}
      {isTopPriority && (
        <div className="flex items-center gap-1.5 border-b border-gold-primary/20 bg-gold-primary/10 px-4 py-1.5">
          <Star size={14} className="fill-gold-primary text-gold-primary" />
          <span className="text-xs font-semibold tracking-wide text-gold-light">
            Most relevant for you now
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* ---- Header: icon + domain name + rating ---- */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-primary/15">
              <Icon size={20} className="text-gold-light" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gold-light" style={headingStyle}>
                {domainName}
              </h3>
              <p className="text-xs text-text-secondary">
                {tl(domain.overallRating.label, locale)} · {RATING_LABELS[rating]?.sa}
              </p>
            </div>
          </div>

          {/* Rating badge */}
          <div
            className={`flex flex-col items-center rounded-xl border px-3 py-1.5 ${RATING_BG[rating]}`}
          >
            <span className={`text-lg font-bold leading-tight ${RATING_COLORS[rating]}`}>
              {score.toFixed(1)}
            </span>
            <span className="text-[10px] text-text-secondary">/10</span>
            <StarRating score={score} />
          </div>
        </div>

        {/* ---- Headline ---- */}
        {headlineText && (
          <p
            className="mb-4 text-sm font-medium leading-relaxed text-text-primary"
            style={bodyStyle}
          >
            {headlineText}
          </p>
        )}

        {/* ---- Natal promise narrative ---- */}
        {narrativeRaw && (
          <div className="mb-4">
            <p className="text-sm leading-relaxed text-text-secondary" style={bodyStyle}>
              {narrativeExpanded ? narrativeRaw : narrativeShort}
            </p>
            {canExpandNarrative && (
              <button
                type="button"
                onClick={() => setNarrativeExpanded(!narrativeExpanded)}
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gold-primary hover:text-gold-light"
              >
                {narrativeExpanded ? 'Show less' : 'Read more'}
                {narrativeExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        )}

        {/* ---- Timeline triggers ---- */}
        {allTriggers.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Upcoming Windows
            </h4>
            <div className="space-y-1.5">
              {visibleTriggers.map((t, i) => (
                <TriggerRow key={`${t.startDate}-${i}`} trigger={t} locale={locale} />
              ))}
            </div>
            {hasMoreTriggers && (
              <button
                type="button"
                onClick={() => setTriggersExpanded(!triggersExpanded)}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-gold-primary hover:text-gold-light"
              >
                {triggersExpanded
                  ? 'Show fewer'
                  : `+${allTriggers.length - 3} more`}
                {triggersExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        )}

        {/* ---- Remedies (compact pills) ---- */}
        {visibleRemedies.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Remedies
            </h4>
            <div className="flex flex-wrap gap-2">
              {visibleRemedies.map((r, i) => (
                <RemedyPill key={`${tl(r.name, 'en')}-${i}`} remedy={r} locale={locale} />
              ))}
              {domain.remedies.length > 3 && (
                <span className="inline-flex items-center rounded-full border border-gold-dark/20 bg-gold-primary/5 px-3 py-1 text-xs text-text-secondary">
                  +{domain.remedies.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* ---- Classical evidence (expandable Tippanni) ---- */}
        {tippanniArea && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setClassicalExpanded(!classicalExpanded)}
              className="flex w-full items-center justify-between rounded-lg border border-gold-dark/20 bg-gold-primary/5 px-3 py-2 text-left transition-colors hover:bg-gold-primary/10"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Classical Evidence
              </span>
              {classicalExpanded ? (
                <ChevronUp size={14} className="text-text-secondary" />
              ) : (
                <ChevronDown size={14} className="text-text-secondary" />
              )}
            </button>

            {classicalExpanded && (
              <div className="mt-2 border-l-2 border-gold-dark/40 pl-4">
                {/* Tippanni rating */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs text-text-secondary">{tippanniArea.label}</span>
                  <span className="text-xs font-medium text-gold-light">
                    {tippanniArea.rating}/10
                  </span>
                </div>

                {/* Tippanni summary */}
                {tippanniArea.summary && (
                  <p className="mb-2 text-sm leading-relaxed text-text-secondary" style={bodyStyle}>
                    {tippanniArea.summary}
                  </p>
                )}

                {/* Tippanni details */}
                {tippanniArea.details && (
                  <p className="text-xs leading-relaxed text-text-secondary/80" style={bodyStyle}>
                    {tippanniArea.details}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---- Deep dive button ---- */}
        {onDeepDive && (
          <button
            type="button"
            onClick={onDeepDive}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold-primary/20 bg-gold-primary/10 px-4 py-2.5 text-sm font-semibold text-gold-light transition-colors hover:border-gold-primary/40 hover:bg-gold-primary/20"
          >
            Deep Dive
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </article>
  );
}
