'use client';

/**
 * Unified Tippanni / Life Summary — the pandit's complete consultation.
 *
 * Orchestrates 8 sections that weave Tippanni (classical analysis) and
 * Domain Synthesis (life reading) into one coherent scrollable reading.
 *
 * This component is PURE UI COMPOSITION — it reads from existing computed
 * data (tip + personalReading + keyDates) and renders them in a unified flow.
 * No new computations. No API calls. No engine changes.
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import SummaryDomainCard from './SummaryDomainCard';
import SummaryCurrentPeriod from './SummaryCurrentPeriod';
import SummaryRemedies from './SummaryRemedies';
import type { TippanniContent, YogaInsight, DoshaInsight } from '@/lib/kundali/tippanni-types';
import type { PersonalReading } from '@/lib/kundali/domain-synthesis/types';
import type { KeyDate } from '@/lib/kundali/domain-synthesis/key-dates';
import type { FullTrajectory } from '@/lib/kundali/domain-synthesis/trajectory';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

const KeyDatesTimeline = dynamic(() => import('./KeyDatesTimeline'), { ssr: false });
const TrajectoryCard = dynamic(() => import('./TrajectoryCard'), { ssr: false });

// ── Domain key to Tippanni life area key mapping ──
const DOMAIN_TO_TIPPANNI: Record<string, 'career' | 'wealth' | 'marriage' | 'health' | 'education'> = {
  career: 'career',
  wealth: 'wealth',
  marriage: 'marriage',
  health: 'health',
  education: 'education',
  // children, family, spiritual have no tippanni equivalent
};

interface SummaryViewProps {
  tip: TippanniContent;
  personalReading: PersonalReading | null;
  keyDates?: KeyDate[];
  trajectory?: FullTrajectory | null;
  isLoggedIn?: boolean;
  locale: string;
  onDeepDive?: (domain: string) => void;
  onTechnical?: () => void;
}

export default function SummaryView({ tip, personalReading, keyDates, trajectory, isLoggedIn, locale, onDeepDive, onTechnical }: SummaryViewProps) {
  const isHi = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale) || {};

  const [showAllYogas, setShowAllYogas] = useState(false);
  const [showAllDoshas, setShowAllDoshas] = useState(false);
  const [showPlanetDetails, setShowPlanetDetails] = useState(false);

  const presentYogas = tip.yogas.filter(y => y.present);
  const topYogas = presentYogas.slice(0, 5);
  const presentDoshas = tip.doshas.filter(d => d.present);

  // Life stage priority ordering for domains
  const priorityOrder = tip.lifeStage?.priorityOrder || ['career', 'wealth', 'marriage', 'health', 'education'];

  // Sort domains by life stage priority
  const sortedDomains = personalReading?.domains
    ? [...personalReading.domains].sort((a, b) => {
        const aIdx = priorityOrder.indexOf(a.domain);
        const bIdx = priorityOrder.indexOf(b.domain);
        const aOrder = aIdx >= 0 ? aIdx : 100;
        const bOrder = bIdx >= 0 ? bIdx : 100;
        return aOrder - bOrder;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* ═══ SECTION 1: Chart Narrative — the pandit's opening statement ═══ */}
      {tip.chartNarrative && (
        <section className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] border border-gold-primary/20 p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl text-gold-light font-bold leading-tight" style={headingFont}>
            {isHi ? tip.chartNarrative.headline.hi : tip.chartNarrative.headline.en}
          </h2>
          <div className="space-y-4">
            {tip.chartNarrative.threads.map((thread, i) => (
              <div key={i} className="border-l-2 border-gold-primary/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gold-dark uppercase tracking-widest font-semibold">{thread.theme}</span>
                </div>
                <p className="text-text-primary text-sm leading-relaxed" style={isHi ? bodyFont : undefined}>
                  {isHi ? thread.narrative.hi : thread.narrative.en}
                </p>
                <p className="text-gold-primary/80 text-xs mt-1 font-medium">
                  {isHi ? thread.action.hi : thread.action.en}
                </p>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-gold-primary/10">
            <p className="text-text-secondary text-sm leading-relaxed italic" style={isHi ? bodyFont : undefined}>
              {isHi ? tip.chartNarrative.synthesis.hi : tip.chartNarrative.synthesis.en}
            </p>
          </div>
        </section>
      )}

      {/* Life Stage Banner */}
      {tip.lifeStage && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 px-5 py-3 flex items-center gap-3">
          <Sparkles size={16} className="text-gold-primary flex-shrink-0" />
          <p className="text-text-secondary text-xs leading-relaxed" style={isHi ? bodyFont : undefined}>
            <span className="text-gold-light font-semibold">
              {tip.lifeStage.stage.charAt(0).toUpperCase() + tip.lifeStage.stage.slice(1).replace('_', ' ')} {isHi ? 'अवस्था' : 'Phase'} &bull; {isHi ? `आयु ${tip.lifeStage.age}` : `Age ${tip.lifeStage.age}`}
            </span>
            {' — '}{tip.lifeStage.headline}
          </p>
        </div>
      )}

      <GoldDivider />

      {/* ═══ SECTION 2: Who You Are — Personality ═══ */}
      <section>
        <h2 className="text-lg sm:text-xl text-gold-light font-bold mb-4" style={headingFont}>
          {isHi ? 'आप कौन हैं' : 'Who You Are'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[tip.personality.lagna, tip.personality.moonSign, tip.personality.sunSign].map((block, i) => (
            <div key={i} className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-4">
              <h3 className="text-gold-primary text-xs font-bold uppercase tracking-widest mb-2">{block.title}</h3>
              <p className="text-text-primary text-sm leading-relaxed" style={isHi ? bodyFont : undefined}>{block.content}</p>
            </div>
          ))}
        </div>
        {tip.personality.currentRelevance && (
          <div className="mt-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border-l-2 border-gold-dark/40 px-4 py-3">
            <span className="text-xs text-gold-dark font-semibold uppercase tracking-widest">
              {isHi ? 'आपके लिए अभी' : 'What This Means for You Now'}
            </span>
            <p className="text-text-primary text-sm leading-relaxed mt-1" style={isHi ? bodyFont : undefined}>
              {tip.personality.currentRelevance}
            </p>
          </div>
        )}
      </section>

      <GoldDivider />

      {/* ═══ SECTION 3: Planetary Strengths ═══ */}
      <section>
        <h2 className="text-lg sm:text-xl text-gold-light font-bold mb-4" style={headingFont}>
          {isHi ? 'आपकी ग्रहीय शक्ति' : 'Your Planetary Strengths'}
        </h2>
        <div className="space-y-2">
          {tip.strengthOverview.map((planet) => (
            <div key={planet.planetName} className="flex items-center gap-3">
              <span className="text-text-secondary text-xs w-16 flex-shrink-0 text-right" style={isHi ? bodyFont : undefined}>{planet.planetName}</span>
              <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    planet.strength >= 70 ? 'bg-emerald-400/70' : planet.strength >= 50 ? 'bg-gold-primary/60' : 'bg-amber-500/50'
                  }`}
                  style={{ width: `${Math.min(100, planet.strength)}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary w-10">{planet.strength}%</span>
            </div>
          ))}
        </div>

        {/* Expandable planet-by-planet details */}
        <button
          onClick={() => setShowPlanetDetails(!showPlanetDetails)}
          className="mt-3 flex items-center gap-2 text-xs text-gold-dark hover:text-gold-light transition-colors"
        >
          {showPlanetDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <BookOpen size={14} />
          {isHi ? 'विस्तृत ग्रह विश्लेषण देखें' : 'See detailed planet-by-planet analysis'}
        </button>
        {showPlanetDetails && (
          <div className="mt-3 space-y-3">
            {tip.planetInsights.map((planet, i) => (
              <div key={i} className="rounded-xl bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/8 p-4">
                <h4 className="text-gold-light text-sm font-bold mb-1">{planet.planetName}</h4>
                <p className="text-text-primary text-xs leading-relaxed" style={isHi ? bodyFont : undefined}>{planet.description}</p>
                {planet.implications && (
                  <p className="text-text-secondary text-xs mt-1 italic">{planet.implications}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <GoldDivider />

      {/* ═══ SECTION 4: Yogas & Doshas ═══ */}
      <section>
        <h2 className="text-lg sm:text-xl text-gold-light font-bold mb-4" style={headingFont}>
          {isHi ? 'आपकी कुण्डली क्या वहन करती है' : 'What Your Chart Carries'}
        </h2>

        {/* Yogas */}
        {presentYogas.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm text-gold-dark font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
              <TrendingUp size={14} />
              {isHi ? `योग (${presentYogas.length} सक्रिय)` : `Yogas (${presentYogas.length} active)`}
            </h3>
            <div className="space-y-2">
              {(showAllYogas ? presentYogas : topYogas).map((yoga, i) => (
                <YogaCard key={i} yoga={yoga} locale={locale} isHi={isHi} bodyFont={bodyFont} />
              ))}
            </div>
            {presentYogas.length > 5 && (
              <button
                onClick={() => setShowAllYogas(!showAllYogas)}
                className="mt-2 flex items-center gap-1 text-xs text-gold-dark hover:text-gold-light transition-colors"
              >
                {showAllYogas ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showAllYogas
                  ? (isHi ? 'कम दिखाएँ' : 'Show less')
                  : (isHi ? `सभी ${presentYogas.length} योग देखें` : `See all ${presentYogas.length} yogas`)}
              </button>
            )}
          </div>
        )}

        {/* Doshas */}
        {presentDoshas.length > 0 && (
          <div>
            <h3 className="text-sm text-gold-dark font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertTriangle size={14} />
              {isHi ? 'दोष' : 'Doshas'}
            </h3>
            <div className="space-y-2">
              {(showAllDoshas ? presentDoshas : presentDoshas.slice(0, 3)).map((dosha, i) => (
                <DoshaCard key={i} dosha={dosha} locale={locale} isHi={isHi} bodyFont={bodyFont} />
              ))}
            </div>
            {presentDoshas.length > 3 && (
              <button
                onClick={() => setShowAllDoshas(!showAllDoshas)}
                className="mt-2 flex items-center gap-1 text-xs text-gold-dark hover:text-gold-light transition-colors"
              >
                {showAllDoshas ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showAllDoshas ? (isHi ? 'कम दिखाएँ' : 'Show less') : (isHi ? 'सभी दोष देखें' : 'See all doshas')}
              </button>
            )}
          </div>
        )}
      </section>

      <GoldDivider />

      {/* ═══ SECTION 5: Life Domains — the core reading ═══ */}
      <section>
        <h2 className="text-lg sm:text-xl text-gold-light font-bold mb-4" style={headingFont}>
          {isHi ? 'आपके जीवन क्षेत्र' : 'Your Life Domains'}
        </h2>
        <div className="space-y-4">
          {sortedDomains.map((domain, i) => {
            const tippanniKey = DOMAIN_TO_TIPPANNI[domain.domain];
            const tippanniArea = tippanniKey ? tip.lifeAreas[tippanniKey] : undefined;
            return (
              <SummaryDomainCard
                key={domain.domain}
                domain={domain}
                tippanniArea={tippanniArea}
                isTopPriority={i === 0 && !!tip.lifeStage}
                locale={locale}
                onDeepDive={onDeepDive ? () => onDeepDive(domain.domain) : undefined}
              />
            );
          })}
        </div>
      </section>

      {/* ═══ KEY DATES TIMELINE ═══ */}
      {keyDates && keyDates.length > 0 && (
        <section className="p-5 rounded-2xl bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10">
          <KeyDatesTimeline dates={keyDates} locale={locale} />
        </section>
      )}

      {/* ═══ READING TRAJECTORY (logged-in users with history) ═══ */}
      {trajectory && isLoggedIn && trajectory.domains.some(d => d.sparkline.length >= 2) && (
        <section>
          <TrajectoryCard trajectory={trajectory} locale={locale} />
        </section>
      )}

      <GoldDivider />

      {/* ═══ SECTION 6: Where You Are Now ═══ */}
      <section>
        <h2 className="text-lg sm:text-xl text-gold-light font-bold mb-4" style={headingFont}>
          {isHi ? 'आप अभी कहाँ हैं' : 'Where You Are Now'}
        </h2>
        <SummaryCurrentPeriod
          dashaInsight={tip.dashaInsight}
          yearPredictions={tip.yearPredictions}
          currentPeriod={personalReading?.currentPeriod}
          keyDates={keyDates}
          dashaSynthesis={tip.dashaSynthesis}
          locale={locale}
        />
      </section>

      <GoldDivider />

      {/* ═══ SECTION 7: What You Can Do — Remedies ═══ */}
      <section>
        <h2 className="text-lg sm:text-xl text-gold-light font-bold mb-4" style={headingFont}>
          {isHi ? 'आप क्या कर सकते हैं' : 'What You Can Do'}
        </h2>
        <SummaryRemedies
          remedies={tip.remedies}
          domains={personalReading?.domains || []}
          remedyNote={tip.lifeStage?.remedyNote}
          locale={locale}
        />
      </section>

      <GoldDivider />

      {/* ═══ SECTION 8: Technical Analysis link ═══ */}
      {onTechnical && (
        <div className="text-center py-4">
          <button
            onClick={onTechnical}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all text-sm"
          >
            <Shield size={16} />
            {isHi ? 'तकनीकी विश्लेषण देखें — चार्ट, ग्रह, भाव, अष्टकवर्ग' : 'View Technical Analysis — Charts, Planets, Houses, Ashtakavarga'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Internal sub-components ──

function YogaCard({ yoga, locale, isHi, bodyFont }: { yoga: YogaInsight; locale: string; isHi: boolean; bodyFont: React.CSSProperties }) {
  const [expanded, setExpanded] = useState(false);
  const strengthColor = yoga.strength === 'Strong' ? 'text-emerald-400' : yoga.strength === 'Moderate' ? 'text-gold-primary' : 'text-amber-500';

  return (
    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/25 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/8 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gold-light text-sm font-bold">{yoga.name}</span>
          <span className={`text-xs font-semibold ${strengthColor}`}>{yoga.strength}</span>
          {yoga.ageRelevance && yoga.ageRelevance > 1.2 && (
            <span className="text-[10px] bg-gold-primary/15 text-gold-light px-1.5 py-0.5 rounded-full">
              {isHi ? 'अभी प्रासंगिक' : 'Relevant now'}
            </span>
          )}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-text-secondary hover:text-gold-light">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      <p className="text-text-secondary text-xs mt-1" style={isHi ? bodyFont : undefined}>{yoga.description}</p>
      {yoga.stageContext && (
        <p className="text-gold-dark text-xs mt-1 italic">{yoga.stageContext}</p>
      )}
      {expanded && yoga.implications && (
        <p className="text-text-primary text-xs mt-2 border-t border-white/5 pt-2" style={isHi ? bodyFont : undefined}>{yoga.implications}</p>
      )}
    </div>
  );
}

function DoshaCard({ dosha, locale, isHi, bodyFont }: { dosha: DoshaInsight; locale: string; isHi: boolean; bodyFont: React.CSSProperties }) {
  const [expanded, setExpanded] = useState(false);
  const severityColor = dosha.severity === 'severe' ? 'border-red-500/30 bg-red-500/5' : dosha.severity === 'moderate' ? 'border-amber-500/30 bg-amber-500/5' : 'border-yellow-500/20 bg-yellow-500/5';

  return (
    <div className={`rounded-xl border ${severityColor} p-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className={dosha.severity === 'severe' ? 'text-red-400' : 'text-amber-400'} />
          <span className="text-text-primary text-sm font-bold">{dosha.name}</span>
          <span className="text-xs text-text-secondary capitalize">{dosha.severity}</span>
          {dosha.effectiveSeverity && dosha.effectiveSeverity !== 'full' && (
            <span className="text-xs text-emerald-400">→ {dosha.effectiveSeverity} (after cancellation)</span>
          )}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-text-secondary hover:text-gold-light">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      <p className="text-text-secondary text-xs mt-1" style={isHi ? bodyFont : undefined}>{dosha.description}</p>
      {expanded && dosha.cancellationConditions && dosha.cancellationConditions.length > 0 && (
        <div className="mt-2 border-t border-white/5 pt-2 space-y-1">
          <span className="text-xs text-gold-dark font-semibold">{isHi ? 'रद्दीकरण शर्तें:' : 'Cancellation conditions:'}</span>
          {dosha.cancellationConditions.map((cc, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={cc.met ? 'text-emerald-400' : 'text-text-secondary'}>{cc.met ? '✓' : '✗'}</span>
              <span className="text-text-secondary">{cc.condition}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
