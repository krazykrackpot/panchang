'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, Zap, AlertTriangle, Clock } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import type { DashaInsightSection, YearPredictionSection } from '@/lib/kundali/tippanni-types';
import type { CurrentPeriodReading, DomainType } from '@/lib/kundali/domain-synthesis/types';
import type { KeyDate, KeyDateImpact } from '@/lib/kundali/domain-synthesis/key-dates';
import type { DashaSynthesis } from '@/lib/tippanni/dasha-synthesis-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const OUTLOOK_CLASSES: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  favorable: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  mixed: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  challenging: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
};

const IMPACT_CLASSES: Record<KeyDateImpact, { bg: string; border: string; text: string; dot: string }> = {
  positive: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  challenging: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
  transformative: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/25',
    text: 'text-purple-400',
    dot: 'bg-purple-400',
  },
  neutral: {
    bg: 'bg-gold-primary/10',
    border: 'border-gold-primary/25',
    text: 'text-gold-primary',
    dot: 'bg-gold-primary',
  },
};

const DOMAIN_LABELS: Record<string, { en: string; hi: string }> = {
  currentPeriod: { en: 'Current Period', hi: 'वर्तमान काल' },
  health: { en: 'Health', hi: 'स्वास्थ्य' },
  wealth: { en: 'Wealth', hi: 'धन' },
  career: { en: 'Career', hi: 'करियर' },
  marriage: { en: 'Marriage', hi: 'विवाह' },
  children: { en: 'Children', hi: 'संतान' },
  family: { en: 'Family', hi: 'परिवार' },
  spiritual: { en: 'Spiritual', hi: 'आध्यात्मिक' },
  education: { en: 'Education', hi: 'शिक्षा' },
};

const IMPACT_LABELS: Record<KeyDateImpact, { en: string; hi: string }> = {
  positive: { en: 'Favorable', hi: 'अनुकूल' },
  challenging: { en: 'Challenging', hi: 'चुनौतीपूर्ण' },
  transformative: { en: 'Transformative', hi: 'परिवर्तनकारी' },
  neutral: { en: 'Neutral', hi: 'सामान्य' },
};

const ASSESSMENT_CLASSES: Record<string, string> = {
  very_favorable: 'text-emerald-400',
  favorable: 'text-emerald-400/80',
  mixed: 'text-amber-400',
  challenging: 'text-red-400/80',
  difficult: 'text-red-400',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} — ${formatDate(end)}`;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SummaryCurrentPeriodProps {
  dashaInsight: DashaInsightSection;
  yearPredictions: YearPredictionSection;
  currentPeriod?: CurrentPeriodReading;
  keyDates?: KeyDate[];
  dashaSynthesis?: DashaSynthesis;
  locale: string;
}

// ---------------------------------------------------------------------------
// Sub-section A: Current Dasha
// ---------------------------------------------------------------------------

function CurrentDashaSection({
  dashaInsight,
  currentPeriod,
  locale,
}: {
  dashaInsight: DashaInsightSection;
  currentPeriod?: CurrentPeriodReading;
  locale: string;
}) {
  const activeNow = currentPeriod?.activeDomainsNow ?? [];
  const challengedNow = currentPeriod?.challengedDomainsNow ?? [];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-primary/15">
          <Zap className="w-4 h-4 text-gold-light" />
        </div>
        <h3 className="text-lg font-semibold text-gold-light">
          {locale === 'hi' ? 'वर्तमान दशा' : 'Current Dasha'}
        </h3>
      </div>

      {/* Mahadasha */}
      <div className="space-y-3 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xs uppercase tracking-wider text-text-secondary">
            {locale === 'hi' ? 'महादशा' : 'Mahadasha'}
          </span>
          <span className="text-sm font-medium text-gold-primary">{dashaInsight.currentMaha}</span>
        </div>
        <p className="text-sm text-text-primary leading-relaxed">
          {dashaInsight.currentMahaAnalysis}
        </p>
      </div>

      {/* Antardasha */}
      <div className="space-y-3 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xs uppercase tracking-wider text-text-secondary">
            {locale === 'hi' ? 'अन्तर्दशा' : 'Antardasha'}
          </span>
          <span className="text-sm font-medium text-gold-primary">{dashaInsight.currentAntar}</span>
        </div>
        <p className="text-sm text-text-primary leading-relaxed">
          {dashaInsight.currentAntarAnalysis}
        </p>
      </div>

      {/* Upcoming */}
      {dashaInsight.upcoming && (
        <div className="rounded-xl bg-gold-primary/5 border border-gold-primary/10 p-3 mb-4">
          <p className="text-xs text-text-secondary mb-1">
            {locale === 'hi' ? 'आगामी' : 'Coming Up'}
          </p>
          <p className="text-sm text-text-primary">{dashaInsight.upcoming}</p>
        </div>
      )}

      {/* Domain pills */}
      {(activeNow.length > 0 || challengedNow.length > 0) && (
        <div className="space-y-3 pt-3 border-t border-white/5">
          {activeNow.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">
                {locale === 'hi' ? 'सक्रिय क्षेत्र' : 'Domains Active Now'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeNow.map((d) => (
                  <DomainPill key={d} domain={d} variant="active" locale={locale} />
                ))}
              </div>
            </div>
          )}
          {challengedNow.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">
                {locale === 'hi' ? 'चुनौतीपूर्ण क्षेत्र' : 'Domains Challenged'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {challengedNow.map((d) => (
                  <DomainPill key={d} domain={d} variant="challenged" locale={locale} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DomainPill({
  domain,
  variant,
  locale,
}: {
  domain: DomainType;
  variant: 'active' | 'challenged';
  locale: string;
}) {
  const label = DOMAIN_LABELS[domain];
  const text = label ? tl(label, locale) : domain;
  const cls =
    variant === 'active'
      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
      : 'bg-amber-500/10 border-amber-500/25 text-amber-400';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      {text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Sub-section B: Year Ahead
// ---------------------------------------------------------------------------

function YearAheadSection({
  yearPredictions,
  locale,
}: {
  yearPredictions: YearPredictionSection;
  locale: string;
}) {
  const quarters = yearPredictions.quarters;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-primary/15">
          <Calendar className="w-4 h-4 text-gold-light" />
        </div>
        <h3 className="text-lg font-semibold text-gold-light">
          {locale === 'hi' ? `${yearPredictions.year} — वर्ष का पूर्वानुमान` : `${yearPredictions.year} — Year Ahead`}
        </h3>
      </div>

      {/* Overview */}
      {yearPredictions.overview && (
        <p className="text-sm text-text-primary leading-relaxed mb-4">
          {yearPredictions.overview}
        </p>
      )}

      {/* Quarter cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quarters.map((q) => {
          const style = OUTLOOK_CLASSES[q.outlook] ?? OUTLOOK_CLASSES.mixed;
          return (
            <div
              key={q.quarter}
              className={`rounded-xl ${style.bg} border ${style.border} p-3 flex flex-col gap-2`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                <span className="text-xs font-semibold text-text-primary">{q.quarter}</span>
              </div>
              <span className={`text-xs font-medium capitalize ${style.text}`}>{q.outlook}</span>
              <p className="text-xs text-text-secondary leading-snug">{q.summary}</p>
            </div>
          );
        })}
      </div>

      {/* Key advice */}
      {yearPredictions.keyAdvice && (
        <div className="mt-4 rounded-xl bg-gold-primary/5 border border-gold-primary/10 p-3">
          <p className="text-xs text-text-secondary mb-1">
            {locale === 'hi' ? 'मुख्य सलाह' : 'Key Advice'}
          </p>
          <p className="text-sm text-text-primary">{yearPredictions.keyAdvice}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-section C: Key Dates
// ---------------------------------------------------------------------------

function KeyDatesSection({ keyDates, locale }: { keyDates: KeyDate[]; locale: string }) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = 5;
  const visible = expanded ? keyDates : keyDates.slice(0, visibleCount);
  const hasMore = keyDates.length > visibleCount;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-primary/15">
          <Clock className="w-4 h-4 text-gold-light" />
        </div>
        <h3 className="text-lg font-semibold text-gold-light">
          {locale === 'hi' ? 'मुख्य तिथियाँ' : 'Key Dates'}
        </h3>
      </div>

      {/* Vertical timeline */}
      <div className="relative pl-6">
        {/* Timeline line */}
        <div className="absolute left-2 top-1 bottom-1 w-px bg-gold-primary/20" />

        <div className="space-y-4">
          {visible.map((kd, i) => {
            const impact = IMPACT_CLASSES[kd.impact];
            const impactLabel = IMPACT_LABELS[kd.impact];
            return (
              <div key={`${kd.date}-${i}`} className="relative">
                {/* Timeline dot */}
                <div className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full border-2 border-[#0a0e27] ${impact.dot}`} />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-text-secondary">
                      {formatDate(kd.date)}
                      {kd.endDate ? ` — ${formatDate(kd.endDate)}` : ''}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${impact.bg} ${impact.border} ${impact.text}`}>
                      {tl(impactLabel, locale)}
                    </span>
                    {kd.domain && (
                      <span className="text-[10px] text-text-secondary capitalize">
                        {tl(DOMAIN_LABELS[kd.domain] ?? { en: kd.domain, hi: kd.domain }, locale)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-text-primary">{tl(kd.title, locale)}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{tl(kd.description, locale)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show more */}
      {hasMore && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 flex items-center gap-1 text-xs text-gold-primary hover:text-gold-light transition-colors"
        >
          {expanded
            ? (locale === 'hi' ? 'कम दिखाएँ' : 'Show less')
            : (locale === 'hi' ? `और ${keyDates.length - visibleCount} तिथियाँ दिखाएँ` : `Show ${keyDates.length - visibleCount} more dates`)}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expandable: Full Dasha Timeline
// ---------------------------------------------------------------------------

function DashaTimelineExpandable({
  dashaSynthesis,
  locale,
}: {
  dashaSynthesis: DashaSynthesis;
  locale: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-primary/15">
            <AlertTriangle className="w-4 h-4 text-gold-light" />
          </div>
          <h3 className="text-lg font-semibold text-gold-light">
            {locale === 'hi' ? 'सम्पूर्ण दशा समयरेखा (प्रत्यन्तर स्तर)' : 'Full Dasha Timeline (Pratyantar level)'}
          </h3>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        ) : (
          <ChevronRight className="w-5 h-5 text-text-secondary" />
        )}
      </button>

      {/* Expanded content */}
      {isOpen && dashaSynthesis.currentMaha && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 border-t border-white/5">
          {/* Mahadasha overview */}
          <div className="pt-4">
            <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
              {locale === 'hi' ? 'महादशा' : 'Mahadasha'}
            </p>
            <p className="text-sm font-medium text-gold-primary">
              {tl(dashaSynthesis.currentMaha.planetName, locale)} ({formatDateRange(dashaSynthesis.currentMaha.startDate, dashaSynthesis.currentMaha.endDate)})
            </p>
            <p className="text-sm text-text-primary mt-1 leading-relaxed">
              {dashaSynthesis.currentMaha.overview}
            </p>
          </div>

          {/* Lifetime mahadasha sequence */}
          {dashaSynthesis.lifetimeSummary.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">
                {locale === 'hi' ? 'जीवनकालीन दशा क्रम' : 'Lifetime Dasha Sequence'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {dashaSynthesis.lifetimeSummary.map((m) => (
                  <span
                    key={m.planet}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      m.isCurrent
                        ? 'bg-gold-primary/15 border-gold-primary/30 text-gold-light'
                        : m.isPast
                          ? 'bg-white/5 border-white/10 text-text-secondary'
                          : 'bg-white/5 border-white/10 text-text-primary'
                    }`}
                  >
                    {m.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />}
                    {tl(m.planetName, locale)}
                    <span className="text-[10px] opacity-60">{m.years}y</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Antardasha details */}
          {dashaSynthesis.currentMaha.antardashas.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-text-secondary">
                {locale === 'hi' ? 'अन्तर्दशा विवरण' : 'Antardasha Periods'}
              </p>
              {dashaSynthesis.currentMaha.antardashas.map((ad) => (
                <AntardashaCard key={ad.planet + ad.startDate} antar={ad} locale={locale} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AntardashaCard({
  antar,
  locale,
}: {
  antar: DashaSynthesis['currentMaha'] extends infer T
    ? T extends { antardashas: (infer A)[] }
      ? A
      : never
    : never;
  locale: string;
}) {
  const [showPratyantar, setShowPratyantar] = useState(false);
  const assessmentCls = ASSESSMENT_CLASSES[antar.netAssessment] ?? 'text-text-secondary';

  return (
    <div
      className={`rounded-xl border p-4 ${
        antar.isCurrent
          ? 'bg-gold-primary/5 border-gold-primary/20'
          : 'bg-white/[0.02] border-white/5'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-sm font-medium text-text-primary">
          {tl(antar.planetName, locale)}
        </span>
        <span className="text-xs text-text-secondary">
          {formatDateRange(antar.startDate, antar.endDate)}
        </span>
        <span className={`text-xs font-medium capitalize ${assessmentCls}`}>
          {antar.netAssessment.replace('_', ' ')}
        </span>
        {antar.isCurrent && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-primary/15 border border-gold-primary/25 text-gold-light">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />
            {locale === 'hi' ? 'वर्तमान' : 'Current'}
          </span>
        )}
      </div>

      <p className="text-xs text-text-secondary leading-relaxed mb-2">{antar.summary}</p>

      {antar.advice && (
        <p className="text-xs text-gold-primary/80 italic">{antar.advice}</p>
      )}

      {/* Pratyantar toggle */}
      {antar.pratyantardashas?.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowPratyantar((prev) => !prev)}
            className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-gold-primary transition-colors"
          >
            {showPratyantar ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            {locale === 'hi'
              ? `${antar.pratyantardashas.length} प्रत्यन्तर्दशा`
              : `${antar.pratyantardashas.length} Pratyantar periods`}
          </button>

          {showPratyantar && (
            <div className="mt-2 space-y-1.5 pl-3 border-l border-white/5">
              {antar.pratyantardashas.map((pd) => {
                const pdCls = ASSESSMENT_CLASSES[pd.netAssessment] ?? 'text-text-secondary';
                return (
                  <div key={pd.planet + pd.startDate} className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-text-primary font-medium">
                      {tl(pd.planetName, locale)}
                    </span>
                    <span className="text-text-secondary font-mono text-[10px]">
                      {formatDateRange(pd.startDate, pd.endDate)}
                    </span>
                    <span className={`capitalize text-[10px] font-medium ${pdCls}`}>
                      {pd.netAssessment.replace('_', ' ')}
                    </span>
                    {pd.isCritical && (
                      <span className="text-[10px] text-red-400 font-medium">⚑</span>
                    )}
                    <span className="text-text-secondary text-[10px]">{pd.keyTheme}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SummaryCurrentPeriod({
  dashaInsight,
  yearPredictions,
  currentPeriod,
  keyDates,
  dashaSynthesis,
  locale,
}: SummaryCurrentPeriodProps) {
  return (
    <section className="space-y-5">
      {/* Section header */}
      <h2 className="text-xl font-bold text-gold-light">
        {locale === 'hi' ? 'आप अभी कहाँ हैं' : 'Where You Are Now'}
      </h2>

      {/* A: Current Dasha */}
      <CurrentDashaSection
        dashaInsight={dashaInsight}
        currentPeriod={currentPeriod}
        locale={locale}
      />

      {/* B: Year Ahead */}
      <YearAheadSection yearPredictions={yearPredictions} locale={locale} />

      {/* C: Key Dates */}
      {keyDates && keyDates.length > 0 && (
        <KeyDatesSection keyDates={keyDates} locale={locale} />
      )}

      {/* Expandable: Full Dasha Timeline */}
      {dashaSynthesis && (
        <DashaTimelineExpandable dashaSynthesis={dashaSynthesis} locale={locale} />
      )}
    </section>
  );
}
