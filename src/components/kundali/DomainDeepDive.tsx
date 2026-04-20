'use client';

import { tl } from '@/lib/utils/trilingual';
import ForwardTimeline from '@/components/kundali/ForwardTimeline';
import type {
  DomainReading,
  DomainRemedy,
  Rating,
} from '@/lib/kundali/domain-synthesis/types';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DomainDeepDiveProps {
  reading: DomainReading;
  locale: string;
  nativeAge?: number;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Domain display config (name + vedic name per domain)
// ---------------------------------------------------------------------------

const DOMAIN_META: Record<string, { name: LocaleText; vedicName: LocaleText }> = {
  health:    { name: { en: 'Health' },     vedicName: { en: 'Arogya' } },
  wealth:    { name: { en: 'Wealth' },     vedicName: { en: 'Dhana' } },
  career:    { name: { en: 'Career' },     vedicName: { en: 'Karma' } },
  marriage:  { name: { en: 'Marriage' },   vedicName: { en: 'Vivaha' } },
  children:  { name: { en: 'Children' },   vedicName: { en: 'Santana' } },
  family:    { name: { en: 'Family' },     vedicName: { en: 'Kutumba' } },
  spiritual: { name: { en: 'Spiritual' },  vedicName: { en: 'Moksha' } },
  education: { name: { en: 'Education' },  vedicName: { en: 'Vidya' } },
};

// ---------------------------------------------------------------------------
// Rating helpers
// ---------------------------------------------------------------------------

const RATING_STYLES: Record<Rating, { bg: string; border: string; text: string; label: string }> = {
  uttama:     { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', label: 'Strong' },
  madhyama:   { bg: 'bg-amber-500/15',   border: 'border-amber-500/40',   text: 'text-amber-400',   label: 'Moderate' },
  adhama:     { bg: 'bg-orange-500/15',  border: 'border-orange-500/40',  text: 'text-orange-400',  label: 'Weak' },
  atyadhama:  { bg: 'bg-red-500/15',     border: 'border-red-500/40',     text: 'text-red-400',     label: 'Very Weak' },
};

const RATING_SANSKRIT: Record<Rating, string> = {
  uttama: 'Uttama',
  madhyama: 'Madhyama',
  adhama: 'Adhama',
  atyadhama: 'Atyadhama',
};

function RatingBadge({ rating }: { rating: Rating }) {
  const s = RATING_STYLES[rating];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.border} ${s.text} border`}>
      {s.label} ({RATING_SANSKRIT[rating]})
    </span>
  );
}

// ---------------------------------------------------------------------------
// Severity badge for doshas
// ---------------------------------------------------------------------------

const SEVERITY_STYLES: Record<string, string> = {
  severe:   'bg-red-500/15 text-red-400 border-red-500/30',
  moderate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  mild:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
};

// ---------------------------------------------------------------------------
// Remedy type icons (inline SVG snippets)
// ---------------------------------------------------------------------------

function RemedyIcon({ type }: { type: DomainRemedy['type'] }) {
  const className = 'w-8 h-8 flex-shrink-0';
  switch (type) {
    case 'gemstone':
      return (
        <div className={`${className} rounded-full bg-gradient-to-br from-purple-400 to-blue-500`} aria-hidden="true" />
      );
    case 'mantra':
      return (
        <div className={`${className} flex items-center justify-center text-gold-light font-devanagari-heading text-lg`} aria-hidden="true">
          &#x0950;
        </div>
      );
    case 'charity':
      return (
        <div className={`${className} flex items-center justify-center text-gold-light`} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path d="M12 21C12 21 3 13.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 13.5 12 21 12 21Z" />
          </svg>
        </div>
      );
    case 'ritual':
      return (
        <div className={`${className} flex items-center justify-center text-gold-light`} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
          </svg>
        </div>
      );
    case 'lifestyle':
    default:
      return (
        <div className={`${className} flex items-center justify-center text-gold-light`} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <path d="M12 14v3" />
            <rect x="3" y="11" width="18" height="11" rx="2" />
          </svg>
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// Planet name lookup (0-based IDs)
// ---------------------------------------------------------------------------

const PLANET_NAMES: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="border-t border-gold-primary/10 my-8" />
      <h2 className="text-xl font-bold text-gold-light mb-4">{children}</h2>
    </>
  );
}

// ---------------------------------------------------------------------------
// Strength bar
// ---------------------------------------------------------------------------

function StrengthBar({ label, score, max = 10 }: { label: string; score: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <span className="text-text-secondary text-sm w-20 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-text-secondary text-xs w-8 text-right">{score.toFixed(1)}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DomainDeepDive({ reading, locale, onBack }: DomainDeepDiveProps) {
  const meta = DOMAIN_META[reading.domain];
  const domainName = meta ? tl(meta.name, locale) : reading.domain;
  const vedicName = meta ? tl(meta.vedicName, locale) : '';

  const np = reading.natalPromise;
  const ca = reading.currentActivation;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* ----------------------------------------------------------------- */}
      {/* Back button                                                       */}
      {/* ----------------------------------------------------------------- */}
      <button
        onClick={onBack}
        className="text-gold-primary text-sm hover:text-gold-light cursor-pointer mb-6 flex items-center gap-1"
        type="button"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Life Reading
      </button>

      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <header className="mb-6">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h1 className="text-3xl font-bold text-gold-light">
            {domainName}
            {vedicName && (
              <span className="text-text-secondary text-lg font-normal ml-2">({vedicName})</span>
            )}
          </h1>
          <RatingBadge rating={reading.overallRating.rating} />
        </div>
        <p className="text-text-primary text-base leading-relaxed">
          {tl(reading.headline, locale)}
        </p>
      </header>

      {/* ----------------------------------------------------------------- */}
      {/* Section A: Natal Promise                                          */}
      {/* ----------------------------------------------------------------- */}
      <SectionHeading>Birth Chart Foundation</SectionHeading>
      <div className="space-y-4">
        {/* Narrative */}
        <div className="space-y-3">
          {tl(np.summary, locale)
            .split('\n')
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="text-text-primary text-sm leading-relaxed">{para}</p>
            ))}
        </div>

        {/* Yoga pills */}
        {np.supportingYogas.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Yogas</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {np.supportingYogas.map((y, i) => (
                <span
                  key={i}
                  className="shrink-0 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                >
                  {tl(y.name, locale)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dosha pills */}
        {np.activeAfflictions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Doshas</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {np.activeAfflictions.map((d, i) => (
                <span
                  key={i}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${SEVERITY_STYLES[d.severity] || SEVERITY_STYLES.moderate}`}
                >
                  {tl(d.name, locale)}
                  <span className="opacity-60 capitalize">({d.severity})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strength bars — lord qualities */}
        {np.lordQualities.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Planetary Strengths</h3>
            <div className="space-y-2">
              {np.lordQualities.map((lq, i) => (
                <StrengthBar
                  key={i}
                  label={PLANET_NAMES[lq.lordId] || `P${lq.lordId}`}
                  score={lq.score}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Section B: Current Activation                                     */}
      {/* ----------------------------------------------------------------- */}
      <SectionHeading>What&apos;s Active Now</SectionHeading>
      <div className="space-y-4">
        {/* Dasha + transit narrative */}
        <div className="space-y-3">
          {tl(ca.summary, locale)
            .split('\n')
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="text-text-primary text-sm leading-relaxed">{para}</p>
            ))}
        </div>

        {/* Current activation score */}
        <div className="flex items-center gap-3">
          <span className="text-text-secondary text-sm">Activation level:</span>
          <StrengthBar label="" score={ca.overallActivationScore} />
        </div>

        {/* Transit influence pills */}
        {ca.transitInfluences.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Active Transits</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {ca.transitInfluences.map((t, i) => {
                const borderColor =
                  t.nature === 'benefic' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                  : t.nature === 'malefic' ? 'border-red-500/40 text-red-400 bg-red-500/10'
                  : 'border-gold-primary/40 text-gold-light bg-gold-primary/10';
                return (
                  <span
                    key={i}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${borderColor}`}
                  >
                    {PLANET_NAMES[t.planetId] || `P${t.planetId}`} in H{t.transitHouse}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Section C: Forward Timeline                                       */}
      {/* ----------------------------------------------------------------- */}
      <SectionHeading>Your Roadmap — Next 3-5 Years</SectionHeading>
      {reading.timelineTriggers.length > 0 ? (
        <ForwardTimeline triggers={reading.timelineTriggers} locale={locale} />
      ) : (
        <p className="text-text-secondary text-sm italic">No major triggers identified in the coming period.</p>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Section D: Remedies                                               */}
      {/* ----------------------------------------------------------------- */}
      {reading.remedies.length > 0 && (
        <>
          <SectionHeading>Remedies &amp; Guidance</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reading.remedies.map((r, i) => (
              <div
                key={i}
                className="rounded-xl border border-gold-primary/15 bg-bg-secondary p-4 space-y-2"
              >
                <div className="flex items-start gap-3">
                  <RemedyIcon type={r.type} />
                  <div className="min-w-0">
                    <p className="text-gold-light font-semibold text-sm">{tl(r.name, locale)}</p>
                    <span className="text-text-secondary text-xs capitalize">{r.type} &middot; {r.difficulty}</span>
                  </div>
                </div>
                <p className="text-text-primary text-sm leading-relaxed">
                  {tl(r.instructions, locale)}
                </p>
                {/* Mantra: render in Devanagari if hindi text available */}
                {r.type === 'mantra' && r.name.hi && (
                  <p className="text-gold-light text-lg font-devanagari-heading mt-1">
                    {r.name.hi}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Section E: Consult CTA                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-12 mb-4">
        <button
          type="button"
          onClick={() => { console.log('LLM call would go here'); }}
          className="w-full bg-gradient-to-r from-gold-primary/20 to-gold-dark/20 border border-gold-primary/30 rounded-xl p-4 text-center hover:from-gold-primary/30 hover:to-gold-dark/30 transition-colors cursor-pointer"
        >
          <p className="text-gold-light font-bold text-base">Consult Your Personal Pandit</p>
          <p className="text-text-secondary text-xs mt-1">AI-powered personalized reading</p>
        </button>
      </div>
    </div>
  );
}
