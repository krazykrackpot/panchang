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

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, Shield, TrendingUp, AlertTriangle, Printer, Link2, Check } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import SummaryDomainCard from './SummaryDomainCard';
import SummaryCurrentPeriod from './SummaryCurrentPeriod';
import SummaryRemedies from './SummaryRemedies';
import type { TippanniContent, YogaInsight, DoshaInsight } from '@/lib/kundali/tippanni-types';
import type { PersonalReading } from '@/lib/kundali/domain-synthesis/types';
import type { KeyDate } from '@/lib/kundali/domain-synthesis/key-dates';
import type { FullTrajectory } from '@/lib/kundali/domain-synthesis/trajectory';
import type { KundaliData } from '@/types/kundali';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

const KeyDatesTimeline = dynamic(() => import('./KeyDatesTimeline'), { ssr: false });
const PersonalMonthCalendar = dynamic(() => import('./PersonalMonthCalendar'), { ssr: false });
const QuestionAnswerPanel = dynamic(() => import('./QuestionAnswerPanel'), { ssr: false });
const TrajectoryCard = dynamic(() => import('./TrajectoryCard'), { ssr: false });
const ChartNorth = dynamic(() => import('./ChartNorth'), { ssr: false });

// ── Thread theme → human-friendly labels ──
const THREAD_LABELS: Record<string, { en: string; hi: string }> = {
  identity: { en: 'Your Core Nature', hi: 'आपका मूल स्वभाव' },
  timing: { en: 'Your Current Chapter', hi: 'आपका वर्तमान अध्याय' },
  challenge: { en: 'Your Growth Edge', hi: 'आपका विकास क्षेत्र' },
  hidden: { en: 'Hidden Strength', hi: 'छिपी शक्ति' },
  nakshatra: { en: 'Your Birth Star', hi: 'आपका जन्म नक्षत्र' },
  lifephase: { en: 'Your Life Phase', hi: 'आपका जीवन चरण' },
};

// ── Planet → life area mapping for weakness notes ──
const PLANET_AREA: Record<string, { en: string; hi: string }> = {
  Sun: { en: 'authority & father', hi: 'अधिकार और पिता' },
  Moon: { en: 'emotions & mother', hi: 'भावनाएँ और माता' },
  Mars: { en: 'energy & courage', hi: 'ऊर्जा और साहस' },
  Mercury: { en: 'communication', hi: 'संवाद' },
  Jupiter: { en: 'wisdom & children', hi: 'ज्ञान और संतान' },
  Venus: { en: 'relationships', hi: 'रिश्ते' },
  Saturn: { en: 'discipline & longevity', hi: 'अनुशासन और दीर्घायु' },
  Rahu: { en: 'ambition', hi: 'महत्वाकांक्षा' },
  Ketu: { en: 'spirituality', hi: 'आध्यात्मिकता' },
};

// ── Domain key to Tippanni life area key mapping ──
const DOMAIN_TO_TIPPANNI: Record<string, 'career' | 'wealth' | 'marriage' | 'health' | 'education'> = {
  career: 'career',
  wealth: 'wealth',
  marriage: 'marriage',
  health: 'health',
  education: 'education',
  // children, family, spiritual have no tippanni equivalent
};

// ── Cross-domain link type styling ──
const LINK_TYPE_STYLE: Record<string, string> = {
  supports: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  conflicts: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  depends_on: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
};
const LINK_TYPE_LABEL: Record<string, { en: string; hi: string }> = {
  supports: { en: 'supports', hi: 'सहायक' },
  conflicts: { en: 'conflicts with', hi: 'विरोध' },
  depends_on: { en: 'depends on', hi: 'निर्भर' },
};

interface SummaryViewProps {
  tip: TippanniContent;
  personalReading: PersonalReading | null;
  keyDates?: KeyDate[];
  trajectory?: FullTrajectory | null;
  isLoggedIn?: boolean;
  locale: string;
  kundali?: KundaliData;
  onDeepDive?: (domain: string) => void;
  onTechnical?: () => void;
}

export default function SummaryView({ tip, personalReading, keyDates, trajectory, isLoggedIn, locale, kundali, onDeepDive, onTechnical }: SummaryViewProps) {
  const isHi = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale) || {};

  const [showAllYogas, setShowAllYogas] = useState(false);
  const [showAllDoshas, setShowAllDoshas] = useState(false);
  const [showPlanetDetails, setShowPlanetDetails] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // ── Improvement #5: Chart Vitality Score ──
  const vitalityScore = useMemo(() => {
    const strengths = tip.strengthOverview.map(s => s.strength);
    if (strengths.length === 0) return 5;
    // Top-5 average (or all if fewer)
    const sorted = [...strengths].sort((a, b) => b - a);
    const top5 = sorted.slice(0, 5);
    const avg = top5.reduce((s, v) => s + v, 0) / top5.length;
    // Yoga bonus: +0.3 per present yoga, max +1.5
    const yogaBonus = Math.min(1.5, presentYogas.length * 0.3);
    // Dosha penalty: -0.3 per present dosha, max -1.0
    const doshaPenalty = Math.min(1.0, presentDoshas.length * 0.3);
    // Scale avg (0-100) to 0-10, then adjust
    const base = (avg / 100) * 10;
    return Math.max(1, Math.min(10, +(base + yogaBonus - doshaPenalty).toFixed(1)));
  }, [tip.strengthOverview, presentYogas.length, presentDoshas.length]);

  const vitalityColor = vitalityScore >= 7 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : vitalityScore >= 5 ? 'text-gold-light border-gold-primary/30 bg-gold-primary/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  const vitalityLabel = vitalityScore >= 7 ? (isHi ? 'सशक्त' : 'Strong') : vitalityScore >= 5 ? (isHi ? 'संतुलित' : 'Balanced') : (isHi ? 'चुनौतीपूर्ण' : 'Challenging');

  // ── Improvement #2: Quick Stats ──
  const strongestPlanet = useMemo(() => {
    if (tip.strengthOverview.length === 0) return '';
    return [...tip.strengthOverview].sort((a, b) => b.strength - a.strength)[0].planetName;
  }, [tip.strengthOverview]);

  // ── Improvement #3: Weakest planet note ──
  const weakestPlanet = useMemo(() => {
    if (tip.strengthOverview.length === 0) return null;
    const weakest = [...tip.strengthOverview].sort((a, b) => a.strength - b.strength)[0];
    const area = PLANET_AREA[weakest.planetName];
    if (!area) return null;
    return { name: weakest.planetName, strength: weakest.strength, area };
  }, [tip.strengthOverview]);

  // ── Improvement #6: Cross-domain connections ──
  const crossDomainConnections = useMemo(() => {
    if (!personalReading?.domains) return [];
    const seen = new Set<string>();
    const connections: { from: string; to: string; type: string; explanation: string }[] = [];
    for (const domain of personalReading.domains) {
      for (const link of domain.crossDomainLinks || []) {
        const key = [domain.domain, link.linkedDomain].sort().join('|') + '|' + link.linkType;
        if (!seen.has(key)) {
          seen.add(key);
          connections.push({
            from: domain.domain,
            to: link.linkedDomain,
            type: link.linkType,
            explanation: isHi ? (tl(link.explanation, locale) || '') : (link.explanation.en || ''),
          });
        }
      }
    }
    return connections.slice(0, 5);
  }, [personalReading?.domains, isHi, locale]);

  // ── Improvement #8: Share handler ──
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error('[SummaryView] clipboard write failed:', err);
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="space-y-6">
      {/* ═══ SECTION 1: Chart Narrative — the pandit's opening statement ═══ */}
      {tip.chartNarrative && (
        <section className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] border border-gold-primary/20 p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl text-gold-light font-bold leading-tight" style={headingFont}>
            {isHi ? tip.chartNarrative.headline.hi : tip.chartNarrative.headline.en}
          </h2>

          {/* Improvement #5: Chart Vitality Badge */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${vitalityColor}`}>
              <Sparkles size={14} />
              {isHi ? 'कुण्डली जीवनशक्ति' : 'Chart Vitality'}: {vitalityScore} / 10 — {vitalityLabel}
            </span>
          </div>

          <div className="space-y-4">
            {tip.chartNarrative.threads.map((thread, i) => {
              // Improvement #9: human-friendly thread labels
              const label = THREAD_LABELS[thread.theme];
              const displayTheme = label ? (isHi ? label.hi : label.en) : thread.theme;

              return (
                <div key={i} className="border-l-2 border-gold-primary/30 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gold-dark uppercase tracking-widest font-semibold">{displayTheme}</span>
                  </div>
                  <p className="text-text-primary text-sm leading-relaxed" style={isHi ? bodyFont : undefined}>
                    {isHi ? thread.narrative.hi : thread.narrative.en}
                  </p>
                  <p className="text-gold-primary/80 text-xs mt-1 font-medium">
                    {isHi ? thread.action.hi : thread.action.en}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="pt-3 border-t border-gold-primary/10">
            <p className="text-text-secondary text-sm leading-relaxed italic" style={isHi ? bodyFont : undefined}>
              {isHi ? tip.chartNarrative.synthesis.hi : tip.chartNarrative.synthesis.en}
            </p>
          </div>
        </section>
      )}

      {/* ═══ Birth Chart Visual (Improvement #1) ═══ */}
      {kundali?.chart && (
        <div className="max-w-md mx-auto">
          <ChartNorth data={kundali.chart} title={isHi ? 'जन्म कुण्डली' : 'Birth Chart'} size={380} />
        </div>
      )}

      {/* ═══ Quick Stats Bar (Improvement #2) ═══ */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/8">
        {tip.personality.lagna.title && (
          <>
            <span className="text-gold-dark">{isHi ? 'लग्न' : 'Lagna'}:</span>
            <span className="text-gold-light font-semibold">{tip.personality.lagna.title}</span>
            <span className="text-text-secondary/40">·</span>
          </>
        )}
        {tip.personality.moonSign.title && (
          <>
            <span className="text-gold-dark">{isHi ? 'चन्द्र' : 'Moon'}:</span>
            <span className="text-gold-light font-semibold">{tip.personality.moonSign.title}</span>
            <span className="text-text-secondary/40">·</span>
          </>
        )}
        {tip.dashaInsight.currentMaha && (
          <>
            <span className="text-gold-dark">{isHi ? 'दशा' : 'Dasha'}:</span>
            <span className="text-gold-light font-semibold">{tip.dashaInsight.currentMaha}</span>
            <span className="text-text-secondary/40">·</span>
          </>
        )}
        {tip.lifeStage?.age && (
          <>
            <span className="text-gold-dark">{isHi ? 'आयु' : 'Age'}:</span>
            <span className="text-gold-light font-semibold">{tip.lifeStage.age}</span>
            <span className="text-text-secondary/40">·</span>
          </>
        )}
        {strongestPlanet && (
          <>
            <span className="text-gold-dark">{isHi ? 'सबसे बलवान' : 'Strongest'}:</span>
            <span className="text-gold-light font-semibold">{strongestPlanet}</span>
          </>
        )}
      </div>

      {/* ═══ ASK YOUR CHART — Question Answering ═══ */}
      {kundali && (
        <section className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] border border-gold-primary/12 p-5 sm:p-6">
          <QuestionAnswerPanel
            kundali={kundali}
            tippanni={tip}
            personalReading={personalReading}
            locale={locale}
          />
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
              {/* Improvement #7: Show implications */}
              {block.implications && (
                <p className="text-text-secondary text-xs italic mt-2 leading-relaxed" style={isHi ? bodyFont : undefined}>{block.implications}</p>
              )}
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

      {/* ═══ SECTION 3: Planetary Strengths (lighter/subtle — Improvement #10) ═══ */}
      <section className="rounded-2xl bg-gradient-to-br from-[#1a1040]/20 via-[#0a0e27]/40 to-[#0a0e27] border border-white/5 p-5 sm:p-6">
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

        {/* Improvement #3: Weakest planet note */}
        {weakestPlanet && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-400/90 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <p style={isHi ? bodyFont : undefined}>
              {isHi
                ? `${weakestPlanet.name} आपका सबसे कमज़ोर ग्रह है (${weakestPlanet.strength}%) — यह ${weakestPlanet.area.hi} को प्रभावित करता है। उपाय नीचे देखें।`
                : `${weakestPlanet.name} is your weakest planet (${weakestPlanet.strength}%) — this affects ${weakestPlanet.area.en}. See remedies below.`}
            </p>
          </div>
        )}

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

      {/* ═══ SECTION 4: Yogas & Doshas (lighter/subtle — Improvement #10) ═══ */}
      <section className="rounded-2xl bg-gradient-to-br from-[#1a1040]/20 via-[#0a0e27]/40 to-[#0a0e27] border border-white/5 p-5 sm:p-6">
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

      {/* ═══ SECTION 5: Life Domains — the core reading (stronger bg — Improvement #10) ═══ */}
      <section className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 sm:p-6">
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

        {/* Improvement #6: Cross-domain connections */}
        {crossDomainConnections.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gold-primary/10">
            <h3 className="text-sm text-gold-dark font-semibold uppercase tracking-widest mb-3">
              {isHi ? 'आपके क्षेत्र कैसे जुड़ते हैं' : 'How Your Domains Connect'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {crossDomainConnections.map((conn, i) => {
                const typeLabel = LINK_TYPE_LABEL[conn.type] || { en: conn.type, hi: conn.type };
                const style = LINK_TYPE_STYLE[conn.type] || 'bg-white/5 text-text-secondary border-white/10';
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${style}`}
                    title={conn.explanation}
                  >
                    <span className="capitalize">{conn.from}</span>
                    <span className="opacity-60">{isHi ? typeLabel.hi : typeLabel.en}</span>
                    <span className="capitalize">{conn.to}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ═══ YOUR PERSONAL MONTH — color-coded daily quality ═══ */}
      {kundali && (
        <section className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] border border-gold-primary/12 p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl text-gold-light font-bold mb-4" style={headingFont}>
            {isHi ? 'आपका व्यक्तिगत मास' : 'Your Personal Month'}
          </h2>
          <PersonalMonthCalendar
            snapshot={{
              moonSign: kundali.planets.find(p => p.planet.id === 1)?.sign || 1,
              moonNakshatra: (() => {
                const moon = kundali.planets.find(p => p.planet.id === 1);
                if (!moon) return 1;
                const sidLng = ((moon.longitude - (kundali.ayanamshaValue || 24.18)) % 360 + 360) % 360;
                return Math.floor(sidLng / (360 / 27)) + 1;
              })(),
              moonNakshatraPada: (() => {
                const moon = kundali.planets.find(p => p.planet.id === 1);
                if (!moon) return 1;
                const sidLng = ((moon.longitude - (kundali.ayanamshaValue || 24.18)) % 360 + 360) % 360;
                const nakDeg = sidLng % (360 / 27);
                return Math.floor(nakDeg / (360 / 27 / 4)) + 1;
              })(),
              sunSign: kundali.planets.find(p => p.planet.id === 0)?.sign || 1,
              ascendantSign: kundali.ascendant.sign,
              planetPositions: kundali.planets,
              dashaTimeline: kundali.dashas,
              sadeSati: (kundali as unknown as Record<string, unknown>).sadeSati ?? null,
            }}
            lat={kundali.birthData.lat}
            lng={kundali.birthData.lng}
            timezone={kundali.birthData.timezone}
            locale={locale}
          />
        </section>
      )}

      {/* ═══ READING TRAJECTORY (logged-in users with history) ═══ */}
      {trajectory && isLoggedIn && trajectory.domains.some(d => d.sparkline.length >= 2) && (
        <section>
          <TrajectoryCard trajectory={trajectory} locale={locale} />
        </section>
      )}

      <GoldDivider />

      {/* ═══ SECTION 6: Where You Are Now (stronger bg — Improvement #10) ═══ */}
      {/* Key dates are rendered INSIDE SummaryCurrentPeriod via its keyDates prop (Improvement #4) */}
      <section className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 sm:p-6">
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

      {/* ═══ Improvement #8: Print / Share buttons ═══ */}
      <div className="flex items-center justify-center gap-3 py-2">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all text-sm"
        >
          <Printer size={16} />
          {isHi ? 'प्रिंट करें' : 'Print'}
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all text-sm"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Link2 size={16} />}
          {copied ? (isHi ? 'कॉपी हुआ!' : 'Copied!') : (isHi ? 'लिंक साझा करें' : 'Share Link')}
        </button>
      </div>

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
