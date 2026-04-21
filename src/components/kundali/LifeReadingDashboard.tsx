'use client';

import { useRef, useCallback, useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';
import DomainCard from '@/components/kundali/DomainCard';
import CurrentPeriodCard from '@/components/kundali/CurrentPeriodCard';
import { DOMAIN_ICON_MAP } from '@/components/icons/DomainIcons';
import type {
  PersonalReading,
  DomainReading,
  DomainType,
  CrossDomainLink,
} from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const LABELS = {
  lifeAtAGlance: { en: 'Your Life at a Glance', hi: 'आपके जीवन पर एक नज़र', sa: 'जीवनावलोकनम्', ta: 'உங்கள் வாழ்க்கையின் சுருக்கம்' },
  todayFocus: { en: 'Today\'s Focus', hi: 'आज का ध्यान', sa: 'अद्य ध्यानम्', ta: 'இன்றைய கவனம்' },
  spotlightTitle: { en: 'Most Active Now', hi: 'अभी सबसे सक्रिय', sa: 'अधुना सर्वाधिकसक्रियम्', ta: 'இப்போது மிகவும் செயலில்' },
  otherDomains: { en: 'Other Life Areas', hi: 'अन्य जीवन क्षेत्र', sa: 'अन्यजीवनक्षेत्राणि', ta: 'பிற வாழ்க்கை பகுதிகள்' },
  connections: { en: 'Connections Across Your Life', hi: 'आपके जीवन में संबंध', sa: 'जीवनसम्बन्धाः', ta: 'உங்கள் வாழ்வின் தொடர்புகள்' },
  technicalToggle: { en: 'Advanced: Technical Chart Data', hi: 'उन्नत: तकनीकी कुंडली डेटा', sa: 'उन्नतम्: तान्त्रिककुण्डलीसूचनाः', ta: 'மேம்பட்ட: தொழில்நுட்ப வரைபட தரவு' },
  changeFocus: { en: 'Change focus', hi: 'ध्यान बदलें', sa: 'ध्यानं परिवर्तयतु', ta: 'கவனத்தை மாற்று' },
};

const LINK_TYPE_LABELS: Record<string, Record<string, string>> = {
  supports: { en: 'supports', hi: 'सहायता', sa: 'सहायकम्', ta: 'ஆதரவு' },
  conflicts: { en: 'conflicts with', hi: 'संघर्ष', sa: 'विरोधः', ta: 'முரண்பாடு' },
  depends_on: { en: 'depends on', hi: 'निर्भर', sa: 'निर्भरम्', ta: 'சார்ந்துள்ளது' },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LifeReadingDashboardProps {
  reading: PersonalReading;
  locale: string;
  onDomainClick: (domain: DomainType) => void;
  onToggleTechnical: () => void;
  /** Ref map so parent can return focus to a specific card after deep dive closes */
  cardRefs?: React.MutableRefObject<Map<DomainType, HTMLDivElement | null>>;
  /** When set, show a "Change focus" button that calls this callback */
  onChangeFocus?: () => void;
  /** If a specific domain was chosen via QuestionEntry, highlight it */
  focusedDomain?: DomainType | 'all';
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Collect unique cross-domain links from all domains, capped at 5. */
function collectCrossDomainLinks(
  reading: PersonalReading,
): { fromDomain: DomainType; link: CrossDomainLink }[] {
  const seen = new Set<string>();
  const results: { fromDomain: DomainType; link: CrossDomainLink }[] = [];

  for (const domain of reading.domains) {
    for (const link of domain.crossDomainLinks) {
      // De-duplicate bidirectional links (A->B and B->A)
      const key = [domain.domain, link.linkedDomain].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ fromDomain: domain.domain, link });
      if (results.length >= 5) return results;
    }
  }

  return results;
}

function domainDisplayName(domain: DomainType, locale: string): string {
  const config = getDomainConfig(domain);
  return config ? tl(config.name, locale) : domain;
}

/**
 * Compute activation pressure for a domain reading.
 * Higher values mean the domain is more urgently active right now.
 *
 * Formula:
 *   overallActivationScore * 0.5
 * + (isDashaActive ? 3 : 0)
 * + transitInfluences.length * 1.5
 * + (upcoming triggers within 3 months) * 1.0
 */
function computeActivationPressure(dr: DomainReading): number {
  const activation = dr.currentActivation;
  let pressure = 0;

  // Factor 1: overall activation score (0-10) weighted at 0.5
  pressure += (activation?.overallActivationScore ?? 0) * 0.5;

  // Factor 2: dasha active bonus
  if (activation?.isDashaActive) {
    pressure += 3;
  }

  // Factor 3: transit influence count
  pressure += (activation?.transitInfluences?.length ?? 0) * 1.5;

  // Factor 4: upcoming triggers within 3 months
  const now = new Date();
  const threeMonthsLater = new Date(now);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  const upcomingCount = (dr.timelineTriggers ?? []).filter((trigger) => {
    try {
      const start = new Date(trigger.startDate);
      return start >= now && start <= threeMonthsLater;
    } catch {
      return false;
    }
  }).length;
  pressure += upcomingCount * 1.0;

  return pressure;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LifeReadingDashboard({
  reading,
  locale,
  onDomainClick,
  onToggleTechnical,
  cardRefs,
  onChangeFocus,
  focusedDomain,
}: LifeReadingDashboardProps) {
  const crossLinks = collectCrossDomainLinks(reading);
  const internalCardRefs = useRef<Map<DomainType, HTMLDivElement | null>>(new Map());
  const refs = cardRefs ?? internalCardRefs;

  const setCardRef = useCallback(
    (domain: DomainType) => (el: HTMLDivElement | null) => {
      refs.current.set(domain, el);
    },
    [refs],
  );

  // Sort domains by activation pressure and split into spotlight vs compact
  const { spotlightDomains, compactDomains } = useMemo(() => {
    const sorted = [...reading.domains]
      .map((dr) => ({ dr, pressure: computeActivationPressure(dr) }))
      .sort((a, b) => b.pressure - a.pressure);

    // If a specific domain is focused, put it first in spotlight
    if (focusedDomain && focusedDomain !== 'all') {
      const focusedIdx = sorted.findIndex((s) => s.dr.domain === focusedDomain);
      if (focusedIdx > 0) {
        const [item] = sorted.splice(focusedIdx, 1);
        sorted.unshift(item);
      }
    }

    return {
      spotlightDomains: sorted.slice(0, 2).map((s) => s.dr),
      compactDomains: sorted.slice(2).map((s) => s.dr),
    };
  }, [reading.domains, focusedDomain]);

  // Check if there are daily insights (active domains in current period)
  const hasDailyInsights =
    reading.currentPeriod.activeDomainsNow.length > 0 ||
    reading.currentPeriod.challengedDomainsNow.length > 0;

  return (
    <div className="w-full space-y-0" aria-label="Life Reading Dashboard" role="region">
      {/* ----------------------------------------------------------------- */}
      {/* Header with optional Change Focus button */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-start justify-between gap-4">
        <section className="flex-1 bg-gradient-to-br from-[#2d1b69]/20 to-transparent border border-gold-primary/10 rounded-2xl p-6">
          <p className="text-gold-dark text-xs uppercase tracking-widest mb-2">
            {tl(LABELS.lifeAtAGlance, locale)}
          </p>
          <p className="text-text-secondary text-base leading-relaxed italic font-heading">
            {tl(reading.topInsight, locale)}
          </p>
        </section>
        {onChangeFocus && (
          <button
            type="button"
            onClick={onChangeFocus}
            className="flex-shrink-0 mt-2 rounded-lg border border-gold-primary/20 bg-gold-primary/5 px-3 py-1.5 text-xs text-gold-primary hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-colors cursor-pointer"
          >
            {tl(LABELS.changeFocus, locale)}
          </button>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Today section — shown if daily insights are available */}
      {/* ----------------------------------------------------------------- */}
      {hasDailyInsights && (
        <div className="mt-6">
          <p className="text-gold-dark text-xs uppercase tracking-widest mb-3">
            {tl(LABELS.todayFocus, locale)}
          </p>
          <div className="flex flex-wrap gap-2">
            {reading.currentPeriod.activeDomainsNow.map((domain) => {
              const IconComp = DOMAIN_ICON_MAP[domain];
              return (
                <button
                  key={`today-active-${domain}`}
                  type="button"
                  onClick={() => onDomainClick(domain)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm border bg-emerald-500/8 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/35 transition-colors cursor-pointer"
                >
                  {IconComp && <IconComp className="w-6 h-4 opacity-80" />}
                  <span>{domainDisplayName(domain, locale)}</span>
                  <span className="text-emerald-500/60 text-xs ml-1">active</span>
                </button>
              );
            })}
            {reading.currentPeriod.challengedDomainsNow.map((domain) => {
              const IconComp = DOMAIN_ICON_MAP[domain];
              return (
                <button
                  key={`today-challenged-${domain}`}
                  type="button"
                  onClick={() => onDomainClick(domain)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm border bg-amber-500/8 border-amber-500/20 text-amber-400 hover:bg-amber-500/15 hover:border-amber-500/35 transition-colors cursor-pointer"
                >
                  {IconComp && <IconComp className="w-6 h-4 opacity-80" />}
                  <span>{domainDisplayName(domain, locale)}</span>
                  <span className="text-amber-500/60 text-xs ml-1">attention</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Current Period Card */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-6">
        <CurrentPeriodCard period={reading.currentPeriod} locale={locale} />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Spotlight Cards — top 2 by activation pressure */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-6">
        <p className="text-gold-dark text-xs uppercase tracking-widest mb-3">
          {tl(LABELS.spotlightTitle, locale)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 stagger-children" role="grid" aria-label="Spotlight domains">
          {spotlightDomains.map((domainReading) => {
            const config = getDomainConfig(domainReading.domain);
            const IconComp = DOMAIN_ICON_MAP[domainReading.domain];
            const pressure = computeActivationPressure(domainReading);
            return (
              <div
                key={domainReading.domain}
                role="gridcell"
                ref={setCardRef(domainReading.domain)}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onDomainClick(domainReading.domain)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onDomainClick(domainReading.domain);
                    }
                  }}
                  aria-label={`${domainDisplayName(domainReading.domain, locale)} — spotlight domain, click to view details`}
                  className="relative rounded-2xl bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] border border-gold-primary/20 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-primary/5 hover:border-gold-primary/35 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                >
                  {/* Glow accent top */}
                  <div
                    className="absolute top-0 left-8 right-8 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${domainReading.overallRating.color}50, transparent)` }}
                  />

                  <div className="flex items-start gap-4">
                    {/* Large icon */}
                    <div className="flex-shrink-0">
                      {IconComp
                        ? <IconComp className="w-[80px] h-[56px] opacity-80" />
                        : <div className="w-16 h-12 rounded bg-gold-primary/8" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Domain name */}
                      <h3 className="font-heading text-gold-light text-xl font-semibold leading-tight">
                        {config ? tl(config.name, locale) : domainReading.domain}
                      </h3>
                      {config && (
                        <p className="font-devanagari text-gold-primary/60 text-xs mt-0.5 leading-tight">
                          {tl(config.vedicName, locale)}
                        </p>
                      )}

                      {/* Expanded headline */}
                      <p className="text-text-secondary text-sm leading-relaxed mt-2">
                        {tl(domainReading.headline, locale)}
                      </p>

                      {/* Pressure indicator */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (pressure / 15) * 100)}%`,
                              backgroundColor: domainReading.overallRating.color,
                            }}
                          />
                        </div>
                        <span className="text-text-secondary text-xs flex-shrink-0">
                          {tl(domainReading.overallRating.label, locale)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Compact Grid — remaining domains */}
      {/* ----------------------------------------------------------------- */}
      {compactDomains.length > 0 && (
        <div className="mt-6">
          <p className="text-gold-dark text-xs uppercase tracking-widest mb-3">
            {tl(LABELS.otherDomains, locale)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 stagger-children" role="grid" aria-label="Other life domains">
            {compactDomains.map((domainReading) => (
              <div key={domainReading.domain} role="gridcell" ref={setCardRef(domainReading.domain)}>
                <DomainCard
                  reading={domainReading}
                  locale={locale}
                  onClick={() => onDomainClick(domainReading.domain)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Cross-Domain Links */}
      {/* ----------------------------------------------------------------- */}
      {crossLinks.length > 0 && (
        <section className="mt-8">
          <h3 className="text-gold-gradient text-lg font-bold mb-4">
            {tl(LABELS.connections, locale)}
          </h3>
          <div className="flex flex-wrap gap-3">
            {crossLinks.map(({ fromDomain, link }, i) => (
              <div
                key={`${fromDomain}-${link.linkedDomain}-${i}`}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 max-w-xs flex-1 min-w-[200px]"
              >
                <p className="text-gold-light text-sm font-semibold mb-1">
                  {domainDisplayName(fromDomain, locale)}
                  {' '}
                  <span className="text-text-secondary">&#8596;</span>
                  {' '}
                  {domainDisplayName(link.linkedDomain, locale)}
                </p>
                <p className="text-text-secondary text-xs mb-1.5 italic">
                  {tl(LINK_TYPE_LABELS[link.linkType] ?? LINK_TYPE_LABELS.supports, locale)}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {tl(link.explanation, locale)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Technical Details Toggle */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-10 border-t border-gold-primary/10 pt-4 text-center">
        <button
          type="button"
          onClick={onToggleTechnical}
          className="text-text-secondary text-sm hover:text-gold-primary transition-colors cursor-pointer"
        >
          {tl(LABELS.technicalToggle, locale)} &#9662;
        </button>
      </div>
    </div>
  );
}
