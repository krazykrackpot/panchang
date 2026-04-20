'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { tl } from '@/lib/utils/trilingual';
import ForwardTimeline from '@/components/kundali/ForwardTimeline';
import { buildDomainPrompt } from '@/lib/kundali/domain-synthesis/llm-prompt';
import { useAuthStore } from '@/stores/auth-store';
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
// House brief descriptions (1-based)
// ---------------------------------------------------------------------------

const HOUSE_BRIEF: Record<number, string> = {
  1: 'the 1st house (self & identity)',
  2: 'the 2nd house (wealth & speech)',
  3: 'the 3rd house (courage & siblings)',
  4: 'the 4th house (home & mother)',
  5: 'the 5th house (children & intellect)',
  6: 'the 6th house (health & enemies)',
  7: 'the 7th house (marriage & partnerships)',
  8: 'the 8th house (transformation & longevity)',
  9: 'the 9th house (fortune & dharma)',
  10: 'the 10th house (career & status)',
  11: 'the 11th house (gains & aspirations)',
  12: 'the 12th house (loss & liberation)',
};

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <>
      <div className="border-t border-gold-primary/10 my-8" />
      <h2 id={id} className="text-xl font-bold text-gold-light mb-4">{children}</h2>
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
// Spinner for loading state
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DomainDeepDive({ reading, locale, nativeAge, onBack }: DomainDeepDiveProps) {
  const meta = DOMAIN_META[reading.domain];
  const domainName = meta ? tl(meta.name, locale) : reading.domain;
  const vedicName = meta ? tl(meta.vedicName, locale) : '';

  const np = reading.natalPromise;
  const ca = reading.currentActivation;

  // Focus management: move focus to back button when deep dive opens
  const backRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    backRef.current?.focus();
  }, []);

  // Escape key handler to close deep dive
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onBack();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // ─── LLM "Ask Your Pandit" state ──────────────────────────────────────────
  const session = useAuthStore((s) => s.session);
  const [llmResponse, setLlmResponse] = useState<string | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);
  // Cache per domain so re-opening the same domain shows the cached response
  const cacheRef = useRef<Record<string, string>>({});

  const handleConsultPandit = useCallback(async () => {
    // Serve from cache if available for this domain and no response displayed yet
    const cached = cacheRef.current[reading.domain];
    if (cached && !llmResponse) {
      setLlmResponse(cached);
      return;
    }

    setLlmLoading(true);
    setLlmError(null);

    try {
      const { systemPrompt, userPayload } = buildDomainPrompt(reading, nativeAge);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/domain-pandit', {
        method: 'POST',
        headers,
        body: JSON.stringify({ systemPrompt, userPayload }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 || data.rateLimited) {
          setLlmError(
            "You've used your AI consultation quota for today. Upgrade for unlimited readings.",
          );
        } else {
          setLlmError(data.error || 'Unable to generate reading. Please try again.');
        }
        return;
      }

      setLlmResponse(data.content);
      cacheRef.current[reading.domain] = data.content;
    } catch {
      setLlmError('Unable to generate reading. Please try again.');
    } finally {
      setLlmLoading(false);
    }
  }, [reading, nativeAge, session, llmResponse]);

  return (
    <div className="w-full px-4 py-6" role="region" aria-label={`${domainName} detailed reading`}>
      {/* ----------------------------------------------------------------- */}
      {/* Back button                                                       */}
      {/* ----------------------------------------------------------------- */}
      <button
        ref={backRef}
        onClick={onBack}
        aria-label="Back to life reading dashboard"
        className="text-gold-primary text-sm hover:text-gold-light cursor-pointer mb-6 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60"
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
      <section aria-labelledby="section-natal-promise">
      <SectionHeading id="section-natal-promise">Birth Chart Foundation</SectionHeading>
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

        {/* Strength bars -- lord qualities */}
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
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section B: Current Activation                                     */}
      {/* ----------------------------------------------------------------- */}
      <section aria-labelledby="section-current-activation">
      <SectionHeading id="section-current-activation">What&apos;s Active Now</SectionHeading>
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

        {/* Current activation -- human-readable instead of raw score */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              ca.overallActivationScore >= 7 ? 'bg-emerald-400' :
              ca.overallActivationScore >= 4 ? 'bg-gold-primary' :
              ca.overallActivationScore >= 2 ? 'bg-amber-400' : 'bg-text-secondary/30'
            }`} />
            <span className="text-gold-light text-sm font-semibold">
              {ca.overallActivationScore >= 7 ? (locale === 'hi' ? 'इस समय अत्यधिक सक्रिय' : 'Highly active right now')
                : ca.overallActivationScore >= 4 ? (locale === 'hi' ? 'इस समय सक्रिय' : 'Moderately active right now')
                : ca.overallActivationScore >= 2 ? (locale === 'hi' ? 'हल्की सक्रियता' : 'Mildly active')
                : (locale === 'hi' ? 'पृष्ठभूमि में — वर्तमान में प्रमुख फोकस नहीं' : 'Background level — not a primary focus currently')}
            </span>
          </div>
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                ca.overallActivationScore >= 7 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                ca.overallActivationScore >= 4 ? 'bg-gradient-to-r from-gold-dark to-gold-primary' :
                ca.overallActivationScore >= 2 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                'bg-text-secondary/20'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, (ca.overallActivationScore / 10) * 100))}%` }}
            />
          </div>
        </div>

        {/* Transit influences -- human-readable descriptions */}
        {ca.transitInfluences.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gold-light mb-2">
              {locale === 'hi' ? 'वर्तमान गोचर प्रभाव' : 'Current Transit Influences'}
            </h3>
            <div className="space-y-2">
              {ca.transitInfluences.map((t, i) => {
                const planetName = PLANET_NAMES[t.planetId] || `Planet ${t.planetId}`;
                const houseDesc = HOUSE_BRIEF[t.transitHouse] ?? `house ${t.transitHouse}`;
                const borderColor =
                  t.nature === 'benefic' ? 'border-emerald-500/20 bg-emerald-500/5'
                  : t.nature === 'malefic' ? 'border-red-500/20 bg-red-500/5'
                  : 'border-gold-primary/15 bg-gold-primary/5';
                const dotColor =
                  t.nature === 'benefic' ? 'bg-emerald-400'
                  : t.nature === 'malefic' ? 'bg-red-400'
                  : 'bg-gold-primary';
                return (
                  <div key={i} className={`rounded-lg border p-3 ${borderColor}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span className="text-text-primary text-sm font-medium">{planetName}</span>
                      <span className="text-text-secondary text-xs">
                        {locale === 'hi' ? 'गोचर' : 'transiting'} {locale === 'hi' ? `भाव ${t.transitHouse}` : houseDesc}
                      </span>
                    </div>
                    <p className="text-text-secondary/70 text-xs mt-1 ml-4">
                      {t.nature === 'benefic'
                        ? (locale === 'hi' ? 'शुभ प्रभाव — इस क्षेत्र को सहायता और विकास मिल रहा है।' : 'Benefic influence — this area of life is receiving support and growth energy.')
                        : t.nature === 'malefic'
                        ? (locale === 'hi' ? 'चुनौतीपूर्ण प्रभाव — धैर्य और अनुशासन आवश्यक।' : 'Challenging influence — patience and discipline are needed in this area.')
                        : (locale === 'hi' ? 'मिश्रित प्रभाव — परिणाम प्रयास पर निर्भर।' : 'Mixed influence — outcomes depend on effort and awareness.')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </section>

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
      {/* Section E: AI Pandit Response                                     */}
      {/* ----------------------------------------------------------------- */}
      {llmResponse && (
        <div className="mt-10">
          <div className="border-t border-gold-primary/10 my-8" />
          <div className="rounded-xl border border-gold-primary/30 bg-gradient-to-br from-gold-primary/5 via-bg-secondary to-bg-secondary p-6 space-y-4">
            <h2 className="text-lg font-bold text-gold-light">Your Personal Pandit Says</h2>
            <div className="space-y-3">
              {llmResponse.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-text-primary text-sm leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gold-primary/10">
              <p className="text-text-secondary/50 text-xs italic">
                AI-generated reading based on your birth chart data. For guidance only.
              </p>
              <button
                type="button"
                disabled={llmLoading}
                onClick={() => {
                  delete cacheRef.current[reading.domain];
                  setLlmResponse(null);
                  handleConsultPandit();
                }}
                className="text-gold-primary text-xs hover:text-gold-light transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {llmLoading ? <><Spinner />Regenerating...</> : 'Regenerate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Section F: Consult CTA / Error                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-12 mb-4">
        <button
          type="button"
          disabled={llmLoading}
          onClick={handleConsultPandit}
          className="w-full bg-gradient-to-r from-gold-primary/20 to-gold-dark/20 border border-gold-primary/30 rounded-xl p-4 text-center hover:from-gold-primary/30 hover:to-gold-dark/30 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <p className="text-gold-light font-bold text-base">
            {llmLoading
              ? <><Spinner />Consulting...</>
              : llmResponse
                ? 'Consult Again'
                : 'Consult Your Personal Pandit'}
          </p>
          {!llmLoading && !llmResponse && (
            <p className="text-text-secondary text-xs mt-1">AI-powered personalized reading</p>
          )}
        </button>

        {/* Error display */}
        {llmError && (
          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2">
            <p className="text-red-400 text-sm flex-1">{llmError}</p>
            <button
              type="button"
              onClick={() => setLlmError(null)}
              className="text-red-400/60 hover:text-red-400 text-xs cursor-pointer shrink-0"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
