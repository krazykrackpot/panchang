'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authedFetch } from '@/lib/api/authed-fetch';
import { tl } from '@/lib/utils/trilingual';
import { Link } from '@/lib/i18n/navigation';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { GRAHAS, GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import ConvergenceSummary from '@/components/kundali/ConvergenceSummary';
import GoldDivider from '@/components/ui/GoldDivider';
import dynamic from 'next/dynamic';
import { detectAfflictedPlanets, type AfflictedPlanet } from '@/lib/puja/affliction-detector';
import type { TippanniContent, PlanetInsight } from '@/lib/kundali/tippanni-types';
import type { MahadashaOverview, AntardashaSynthesis, PratyantardashaSynthesis, PeriodAssessment } from '@/lib/tippanni/dasha-synthesis-types';
import type { KundaliData } from '@/types/kundali';
import type { Locale, LocaleText } from '@/types/panchang';

const AIReadingButton = dynamic(() => import('@/components/kundali/AIReadingButton'), { ssr: false });

function YearPredictionsSection({ tip, locale, isDevanagari, headingFont, tTip }: {
  tip: TippanniContent; locale: Locale; isDevanagari: boolean;
  headingFont: React.CSSProperties; tTip: (key: string) => string;
}) {
  const isTamil = String(locale) === 'ta';
  const [expandedRemedyIdx, setExpandedRemedyIdx] = useState<number | null>(null);
  const yp = tip.yearPredictions;

  const impactColors: Record<string, string> = {
    favorable: 'bg-emerald-500',
    mixed: 'bg-amber-500',
    challenging: 'bg-red-500',
  };
  const impactBadge: Record<string, string> = {
    favorable: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    mixed: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    challenging: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  const impactLabel = (impact: string) => tTip(impact);

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="text-center">
        <h3 className="text-2xl text-gold-gradient font-bold" style={headingFont}>
          {yp.year} {tTip('yearPredictions')}
        </h3>
      </div>

      {/* Overview card */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 border-2 border-gold-primary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-primary/0 via-gold-primary to-gold-primary/0" />
        <h4 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-semibold">{tTip('yearOverview')}</h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {yp.overview}
        </p>
      </div>

      {/* Events timeline */}
      {yp.events.length > 0 && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <h4 className="text-gold-light text-lg font-semibold mb-6" style={headingFont}>{tTip('majorEvents')}</h4>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-gold-primary/40 via-gold-primary/20 to-gold-primary/5" />

            <div className="space-y-6">
              {yp.events.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pl-9"
                >
                  {/* Impact dot */}
                  <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full ${impactColors[event.impact]} flex items-center justify-center`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3 flex-wrap">
                      <h5 className="text-gold-light font-semibold text-sm flex-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                        {event.title}
                      </h5>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-text-secondary/75 text-xs font-mono">{event.period}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${impactBadge[event.impact]}`}>
                          {impactLabel(event.impact)}
                        </span>
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {event.description}
                    </p>

                    {event.remedies && (
                      <div>
                        <button
                          onClick={() => setExpandedRemedyIdx(expandedRemedyIdx === i ? null : i)}
                          className="text-amber-400 text-xs hover:text-amber-300 transition-colors"
                        >
                          {expandedRemedyIdx === i ? tTip('hideRemedies') : tTip('showRemedies')}
                        </button>
                        <AnimatePresence>
                          {expandedRemedyIdx === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                                <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                  {event.remedies}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quarterly forecast grid */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h4 className="text-gold-light text-lg font-semibold mb-6" style={headingFont}>{tTip('quarterlyOutlook')}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {yp.quarters.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border ${
                q.outlook === 'favorable' ? 'border-emerald-500/20 bg-emerald-500/5'
                : q.outlook === 'challenging' ? 'border-red-500/20 bg-red-500/5'
                : 'border-amber-500/20 bg-amber-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold-light text-sm font-semibold">{q.quarter}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${impactBadge[q.outlook]}`}>
                  {impactLabel(q.outlook)}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {q.summary}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key advice */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 border border-gold-primary/25 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h4 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-semibold">{tTip('keyAdvice')}</h4>
        <p className="text-gold-light text-sm leading-relaxed font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {yp.keyAdvice}
        </p>
      </div>
    </section>
  );
}

function ClassicalReferencesBlock({ refs, locale, isDevanagari }: {
  refs: TippanniContent['planetInsights'][0]['classicalReferences'];
  locale: Locale;
  isDevanagari: boolean;
}) {
  const isTamil = String(locale) === 'ta';
  const [expanded, setExpanded] = useState(false);
  if (!refs) return null;

  const confidenceColors: Record<string, string> = {
    high: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    low: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };

  return (
    <div className="mt-3 p-3 rounded-lg border-2 border-amber-600/20 bg-gradient-to-br from-amber-900/10 to-amber-800/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-amber-400 text-xs uppercase tracking-wider font-semibold">
            {locale === 'en' || isTamil ? 'Classical References' : isDevanagari ? 'शास्त्रीय सन्दर्भ' : 'शास्त्रीयसन्दर्भाः'}
          </span>
        </div>
        <span className={`text-xs px-1.5 py-0.5 rounded-full border ${confidenceColors[refs.confidence]}`}>
          {refs.confidence}
        </span>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {refs.summary}
      </p>
      {refs.citations.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-amber-400/70 text-xs hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {expanded
              ? (locale === 'en' || isTamil ? 'Hide citations' : 'सन्दर्भ छुपाएँ')
              : (locale === 'en' || isTamil ? `View ${refs.citations.length} citation${refs.citations.length > 1 ? 's' : ''}` : `${refs.citations.length} सन्दर्भ देखें`)
            }
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-2">
                  {refs.citations.map((cite, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-bg-primary/40 border border-amber-600/10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-amber-400 text-xs font-bold">{cite.textName}</span>
                        {cite.verseRange && <span className="text-text-secondary/70 text-xs font-mono">{cite.verseRange}</span>}
                      </div>
                      {cite.sanskritExcerpt && (
                        <p className="text-amber-200/60 text-xs italic mb-1" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                          {cite.sanskritExcerpt}
                        </p>
                      )}
                      <p className="text-text-secondary text-xs leading-relaxed">{cite.translationExcerpt}</p>
                      {cite.relevanceNote && (
                        <p className="text-amber-500/50 text-xs mt-1 italic">{cite.relevanceNote}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
export default function TippanniTab({ kundali, locale, isDevanagari, headingFont, tTip }: {
  kundali: KundaliData; locale: Locale; isDevanagari: boolean;
  headingFont: React.CSSProperties; tTip: (key: string) => string;
}) {
  const isTamil = String(locale) === 'ta';
  const isEn = locale === 'en' || isTamil;
  const [expandedPlanet, setExpandedPlanet] = useState<number | null>(null);
  const [expandedYoga, setExpandedYoga] = useState<number | null>(null);
  const [expandedAntar, setExpandedAntar] = useState<number | null>(null);
  const [expandedPratyantar, setExpandedPratyantar] = useState<string | null>(null);
  const [selectedMahaTimeline, setSelectedMahaTimeline] = useState<number | null>(null);

  // Client-side base tippanni (renders immediately, memoized)
  const baseTip = useMemo(() => generateTippanni(kundali, locale), [kundali, locale]);

  // Server-side RAG-enhanced tippanni (loads async)
  const [ragTip, setRagTip] = useState<TippanniContent | null>(null);
  const [ragLoading, setRagLoading] = useState(false);

  // Stable key for useCallback dependency (avoid object reference issues)
  const kundaliKey = useMemo(
    () => `${kundali.ascendant.sign}-${kundali.planets.map(p => `${p.planet.id}:${p.house}:${p.sign}`).join(',')}`,
    [kundali]
  );

  const fetchRagTippanni = useCallback(async () => {
    setRagLoading(true);
    try {
      const res = await authedFetch('/api/tippanni', {
        method: 'POST',
        body: JSON.stringify({ kundali, locale, ragEnabled: true }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ragEnabled) {
          setRagTip(data);
        }
      }
    } catch (err) {
      console.error('RAG tippanni fetch failed:', err);
    }
    setRagLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kundaliKey, locale]);

  useEffect(() => {
    fetchRagTippanni();
  }, [fetchRagTippanni]);

  // Use RAG-enhanced data if available, otherwise fall back to base
  const tip = ragTip || baseTip;

  // Detect afflicted planets for graha shanti recommendations
  const afflictedPlanets = useMemo<AfflictedPlanet[]>(() => {
    if (!kundali.planets) return [];
    const strengthMap = new Map<number, number>();
    tip.strengthOverview.forEach(s => {
      const planet = kundali.planets.find(p => p.planet.name[locale] === s.planetName || p.planet.name.en === s.planetName);
      if (planet) strengthMap.set(planet.planet.id, s.strength);
    });
    const planetInputs = kundali.planets.map(p => ({
      id: p.planet.id,
      name: p.planet.name.en,
      house: p.house,
      isDebilitated: p.isDebilitated,
      isCombust: p.isCombust,
      isRetrograde: p.isRetrograde,
      shadbalaPercent: strengthMap.get(p.planet.id),
    }));
    return detectAfflictedPlanets(planetInputs);
  }, [kundali.planets, tip.strengthOverview, locale]);

  const severityColors: Record<string, string> = {
    severe: 'bg-red-500/20 text-red-400',
    moderate: 'bg-orange-500/20 text-orange-400',
    mild: 'bg-yellow-500/20 text-yellow-400',
    none: 'bg-green-500/20 text-green-400',
  };

  // Convergence synthesis — only available from server-side API response
  const convergence = (ragTip || tip)?.convergence || null;

  // ── Derived data for hero card ──
  const yogasActive = tip.yogas.filter(y => y.present).length;
  const strongPlanets = tip.strengthOverview.filter(s => s.strength >= 100);
  const weakPlanets = tip.strengthOverview.filter(s => s.strength < 80);
  const strongestPlanet = tip.strengthOverview.reduce((a, b) => a.strength > b.strength ? a : b, tip.strengthOverview[0]);
  const presentDoshas = tip.doshas.filter(d => d.present);

  // Element distribution from kundali
  const elementCounts = [0, 0, 0, 0]; // fire, earth, air, water
  const SIGN_ELEMENTS = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]; // Aries=fire, Taurus=earth...
  kundali.planets.forEach(p => { if (p.sign >= 1 && p.sign <= 12) elementCounts[SIGN_ELEMENTS[p.sign - 1]]++; });
  const totalPlanets = kundali.planets.length || 1;
  const dominantElIdx = elementCounts.indexOf(Math.max(...elementCounts));
  const ELEMENT_NAMES_EN = ['Fire', 'Earth', 'Air', 'Water'];
  const ELEMENT_NAMES_HI = ['अग्नि', 'पृथ्वी', 'वायु', 'जल'];
  const dominantElName = isEn ? ELEMENT_NAMES_EN[dominantElIdx] : ELEMENT_NAMES_HI[dominantElIdx];
  const dominantElPct = Math.round((elementCounts[dominantElIdx] / totalPlanets) * 100);
  const ELEMENT_COLORS_HERO = ['#f59e0b', '#10b981', '#38bdf8', '#818cf8'];

  // "Right Now" insight
  const rightNowInsight = tip.yearPredictions?.keyAdvice
    || (tip.dashaInsight?.currentMahaAnalysis?.slice(0, 200))
    || '';

  // Action items aggregation
  const actionItems: string[] = [];
  if (presentDoshas.length > 0) {
    const topDosha = presentDoshas.sort((a, b) => (b.severity === 'severe' ? 3 : b.severity === 'moderate' ? 2 : 1) - (a.severity === 'severe' ? 3 : a.severity === 'moderate' ? 2 : 1))[0];
    actionItems.push(isEn ? `Address ${topDosha.name} (${topDosha.severity}) — ${topDosha.remedies.split('.')[0]}.` : `${topDosha.name} (${topDosha.severity}) का उपचार करें — ${topDosha.remedies.split('.')[0]}।`);
  }
  if (tip.remedies.gemstones.length > 0) {
    const gem = tip.remedies.gemstones[0];
    actionItems.push(isEn ? `Consider ${gem.name} for ${gem.planet} — ${gem.description.split('.')[0]}.` : `${gem.planet} के लिए ${gem.name} विचार करें — ${gem.description.split('.')[0]}।`);
  }
  if (tip.remedies.mantras.length > 0) {
    const mantra = tip.remedies.mantras[0];
    actionItems.push(isEn ? `Daily mantra: ${mantra.name} for ${mantra.planet}.` : `दैनिक मन्त्र: ${mantra.planet} के लिए ${mantra.name}।`);
  }
  if (tip.yearPredictions?.events?.length > 0) {
    const nextEvent = tip.yearPredictions.events.find(e => e.impact === 'favorable') || tip.yearPredictions.events[0];
    actionItems.push(isEn ? `Watch for: ${nextEvent.title} (${nextEvent.period}).` : `ध्यान दें: ${nextEvent.title} (${nextEvent.period})।`);
  }
  if (weakPlanets.length > 0) {
    actionItems.push(isEn ? `Strengthen ${weakPlanets[0].planetName} — currently your weakest planet.` : `${weakPlanets[0].planetName} को शक्तिशाली करें — वर्तमान में सबसे कमजोर ग्रह।`);
  }

  let sectionNum = 0;
  const SectionDivider = () => { sectionNum++; return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />
      <span className="text-gold-primary/30 text-[10px] font-bold tracking-widest">{String(sectionNum).padStart(2, '0')}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />
    </div>
  ); };

  return (
    <div className="space-y-6">
      {/* ═══ HERO SUMMARY CARD ═══ */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] border border-gold-primary/20 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl" />

        {/* Top strip — key metrics */}
        <div className="relative z-10 grid grid-cols-4 border-b border-gold-primary/10">
          <div className="text-center py-4 px-2 border-r border-gold-primary/10">
            <div className="text-xl font-bold font-mono" style={{ color: ELEMENT_COLORS_HERO[dominantElIdx] }}>{dominantElPct}%</div>
            <div className="text-[9px] text-text-secondary/60 uppercase tracking-wider mt-0.5">{dominantElName}</div>
          </div>
          <div className="text-center py-4 px-2 border-r border-gold-primary/10">
            <div className="text-sm font-bold text-gold-light truncate">{strongestPlanet?.planetName || '—'}</div>
            <div className="text-[9px] text-text-secondary/60 uppercase tracking-wider mt-0.5">{isEn ? 'Strongest' : 'शक्तिशाली'}</div>
          </div>
          <div className="text-center py-4 px-2 border-r border-gold-primary/10">
            <div className="text-xl font-bold text-emerald-400 font-mono">{yogasActive}</div>
            <div className="text-[9px] text-text-secondary/60 uppercase tracking-wider mt-0.5">{isEn ? 'Yogas' : 'योग'}</div>
          </div>
          <div className="text-center py-4 px-2">
            <div className="text-sm font-bold text-gold-light truncate">{tip.dashaInsight.currentMaha || '—'}</div>
            <div className="text-[9px] text-text-secondary/60 uppercase tracking-wider mt-0.5">{isEn ? 'Dasha' : 'दशा'}</div>
          </div>
        </div>

        {/* Life areas mini-bar — visual snapshot */}
        <div className="relative z-10 px-5 py-4">
          <div className="flex items-end gap-1.5 justify-center h-12">
            {(['career', 'wealth', 'marriage', 'health', 'education'] as const).map((key) => {
              const area = tip.lifeAreas[key];
              const h = Math.max(12, Math.round((area.rating / 10) * 48));
              const color = area.rating >= 7 ? '#34d399' : area.rating >= 5 ? '#d4a853' : '#ef4444';
              return (
                <div key={key} className="flex flex-col items-center gap-1" title={`${area.label}: ${area.rating}/10`}>
                  <div className="w-8 sm:w-10 rounded-t" style={{ height: h, backgroundColor: color, opacity: 0.7 }} />
                  <span className="text-[8px] text-text-secondary/50 truncate w-10 text-center">{area.label.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom strip — present doshas + planet strength summary */}
        <div className="relative z-10 flex items-center justify-between px-5 py-3 border-t border-gold-primary/10 text-[10px]">
          <div className="flex items-center gap-3">
            <span className="text-text-secondary/50">{isEn ? 'Planets:' : 'ग्रह:'}</span>
            <span className="text-emerald-400">{strongPlanets.length} {isEn ? 'strong' : 'शक्तिशाली'}</span>
            {weakPlanets.length > 0 && <span className="text-red-400">{weakPlanets.length} {isEn ? 'weak' : 'कमजोर'}</span>}
          </div>
          <div className="flex items-center gap-2">
            {presentDoshas.length === 0 && <span className="text-emerald-400/70">{isEn ? 'No doshas' : 'कोई दोष नहीं'}</span>}
            {presentDoshas.map(d => (
              <span key={d.name} className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400/80 border border-red-500/15">{d.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FOR YOU RIGHT NOW ═══ */}
      {rightNowInsight && (
        <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-gold-primary/8 to-amber-500/10 border border-gold-primary/25 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-xs uppercase tracking-wider font-bold">
              {isEn ? 'For You Right Now' : 'अभी आपके लिए'}
            </span>
          </div>
          <p className="text-text-primary text-sm leading-relaxed">{rightNowInsight}</p>
        </div>
      )}

      {/* ===== CONVERGENCE SYNTHESIS ===== */}
      {convergence && (
        <ConvergenceSummary convergence={convergence} locale={locale} headingFont={headingFont} />
      )}

      {/* ===== AI READING ===== */}
      <AIReadingButton kundali={kundali} locale={locale} headingFont={headingFont} />

      {/* RAG status indicator */}
      {tip.ragEnabled && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-amber-400/60 text-xs">
            {locale === 'en' || isTamil ? 'Enhanced with classical Jyotish text references' : 'शास्त्रीय ज्योतिष ग्रन्थ सन्दर्भों से समृद्ध'}
          </span>
        </div>
      )}
      {ragLoading && !tip.ragEnabled && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
          <span className="text-amber-400/40 text-xs">
            {locale === 'en' || isTamil ? 'Loading classical references...' : 'शास्त्रीय सन्दर्भ लोड हो रहे हैं...'}
          </span>
        </div>
      )}

      <SectionDivider />
      {/* ===== YEAR PREDICTIONS (at top — most immediately relevant) ===== */}
      <YearPredictionsSection tip={tip} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} tTip={tTip} />

      <GoldDivider />

      {/* ===== PERSONALITY PROFILE ===== */}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('personality')}</h3>
        <div className="space-y-6">
          {[tip.personality.lagna, tip.personality.moonSign, tip.personality.sunSign].map((block, i) => (
            block.content && (
              <div key={i} className="border-l-2 border-gold-primary/20 pl-4">
                <h4 className="text-gold-primary font-semibold mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{block.title}</h4>
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{block.content}</div>
                {block.implications && (
                  <div className="mt-3 p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/10">
                    <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Implications & Prognosis' : 'प्रभाव और पूर्वानुमान'}</p>
                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{block.implications}</div>
                  </div>
                )}
              </div>
            )
          ))}
          {tip.personality.summary && (
            <div className="p-4 bg-gold-primary/10 rounded-lg border border-gold-primary/20">
              <p className="text-gold-light text-sm font-medium leading-relaxed">{tip.personality.summary}</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== PLANET PLACEMENT ANALYSIS ===== */}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
          {locale === 'en' || isTamil ? 'Planet Placement Analysis' : isDevanagari ? 'ग्रह स्थिति विश्लेषण' : 'ग्रहस्थितिविश्लेषणम्'}
        </h3>
        <div className="space-y-3">
          {tip.planetInsights.map((pi) => (
            <div key={pi.planetId}>
              <motion.div
                onClick={() => setExpandedPlanet(expandedPlanet === pi.planetId ? null : pi.planetId)}
                className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10 hover:border-gold-primary/25 cursor-pointer transition-all"
                whileHover={{ scale: 1.005 }}
              >
                <GrahaIconById id={pi.planetId} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: pi.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>{pi.planetName}</span>
                    <span className="text-text-secondary/70 text-xs">
                      {locale === 'en' || isTamil ? `House ${pi.house}` : `भाव ${pi.house}`} &middot; {pi.signName}
                    </span>
                    {pi.dignity && <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{pi.dignity.split(' ')[2] === '—' ? '' : pi.dignity.includes('exalted') || pi.dignity.includes('उच्च') ? (locale === 'en' || isTamil ? 'Exalted' : 'उच्च') : pi.dignity.includes('debilitated') || pi.dignity.includes('नीच') ? (locale === 'en' || isTamil ? 'Debilitated' : 'नीच') : (locale === 'en' || isTamil ? 'Own Sign' : 'स्वगृह')}</span>}
                    {pi.retrogradeEffect && <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">R</span>}
                  </div>
                </div>
                <svg className={`w-4 h-4 text-gold-dark/50 transition-transform ${expandedPlanet === pi.planetId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </motion.div>
              <AnimatePresence>
                {expandedPlanet === pi.planetId && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-4 ml-11 space-y-3 border-l border-gold-primary/10">
                      <p className="text-text-secondary text-sm leading-relaxed">{pi.description}</p>
                      {pi.dignity && (
                        <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                          <p className="text-emerald-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Dignity Status' : 'गरिमा स्थिति'}</p>
                          <p className="text-text-secondary text-sm">{pi.dignity}</p>
                        </div>
                      )}
                      {pi.retrogradeEffect && (
                        <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                          <p className="text-red-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Retrograde Effect' : 'वक्री प्रभाव'}</p>
                          <p className="text-text-secondary text-sm">{pi.retrogradeEffect}</p>
                        </div>
                      )}
                      {pi.implications && (
                        <div className="p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/10">
                          <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Practical Implications' : 'व्यावहारिक प्रभाव'}</p>
                          <p className="text-text-secondary text-sm">{pi.implications}</p>
                        </div>
                      )}
                      {pi.prognosis && (
                        <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                          <p className="text-indigo-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Life Prognosis' : 'जीवन पूर्वानुमान'}</p>
                          <p className="text-text-secondary text-sm">{pi.prognosis}</p>
                        </div>
                      )}
                      {pi.classicalReferences ? (
                        <ClassicalReferencesBlock refs={pi.classicalReferences} locale={locale} isDevanagari={isDevanagari} />
                      ) : ragLoading ? (
                        <div className="mt-3 p-3 rounded-lg border border-amber-600/10 bg-amber-900/5 flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
                          <span className="text-amber-400/50 text-xs">{locale === 'en' || isTamil ? 'Loading classical references...' : 'शास्त्रीय सन्दर्भ लोड हो रहे हैं...'}</span>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ===== YOGAS ===== */}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('yogas')}</h3>
        <div className="space-y-3">
          {tip.yogas.filter(y => y.present).map((yoga, i) => {
            const isInauspicious = yoga.type === 'Arishta' || yoga.type === 'Dosha';
            const borderColor = isInauspicious ? 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/30' : 'border-green-500/20 bg-green-500/5 hover:border-green-500/30';
            const badgeColor = isInauspicious ? 'bg-rose-500/20 text-rose-400' : 'bg-green-500/20 text-green-400';
            const strengthColor = yoga.strength === 'Strong' ? 'bg-green-500/20 text-green-400' : yoga.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-orange-500/20 text-orange-400';
            return (
            <div key={i}>
              <motion.div
                onClick={() => setExpandedYoga(expandedYoga === i ? null : i)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${borderColor}`}
                whileHover={{ scale: 1.005 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gold-light font-semibold">{yoga.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${strengthColor}`}>{yoga.strength}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {isInauspicious ? (locale === 'en' || isTamil ? 'Inauspicious' : 'अशुभ') : (locale === 'en' || isTamil ? 'Auspicious' : 'शुभ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-primary/70`}>{yoga.type}</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm">{yoga.description}</p>
              </motion.div>
              <AnimatePresence>
                {expandedYoga === i && yoga.implications && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="ml-4 mt-1 space-y-2">
                      <div className={`p-3 rounded-lg border ${isInauspicious ? 'bg-rose-500/5 border-rose-500/10' : 'bg-green-500/5 border-green-500/10'}`}>
                        <p className={`text-xs uppercase tracking-wider mb-1 ${isInauspicious ? 'text-rose-400' : 'text-green-400'}`}>{locale === 'en' || isTamil ? 'What This Means For You' : 'आपके लिए इसका अर्थ'}</p>
                        <p className="text-text-secondary text-sm">{yoga.implications}</p>
                      </div>
                      {yoga.classicalReferences && (
                        <ClassicalReferencesBlock refs={yoga.classicalReferences} locale={locale} isDevanagari={isDevanagari} />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );})}
        </div>
      </section>

      {/* ===== DOSHAS ===== */}
      {/* Ganda Mula Banner — prominent alert if detected */}
      {tip.doshas.some(d => d.name.includes('Ganda Mula') && d.present) && (
        <div className="rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-red-500/5 to-amber-500/10 p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-amber-400 text-lg font-bold">!</span>
            </div>
            <div>
              <h4 className="text-amber-300 font-bold text-base mb-1">
                {locale === 'en' || isTamil ? 'Ganda Mula Nakshatra Detected' : 'गण्ड मूल नक्षत्र पाया गया'}
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                {locale === 'en' || isTamil
                  ? 'The Moon at birth is in a Ganda Mula nakshatra — one of 6 nakshatras at the water-fire sign junctions. This requires a Ganda Mula Shanti Puja. See the dosha details below for specific remedies.'
                  : 'जन्म के समय चन्द्रमा गण्ड मूल नक्षत्र में है — जल-अग्नि राशि सन्धि के 6 नक्षत्रों में से एक। गण्ड मूल शान्ति पूजा आवश्यक है। विशिष्ट उपायों के लिए नीचे दोष विवरण देखें।'}
              </p>
              <Link href="/learn/modules/24-1" className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2" tabIndex={-1}>
                {locale === 'en' || isTamil ? 'Learn about Ganda Mula Nakshatras →' : 'गण्ड मूल नक्षत्रों के बारे में जानें →'}
              </Link>
            </div>
          </div>
        </div>
      )}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('doshas')}</h3>
        <div className="space-y-4">
          {tip.doshas.filter(d => d.present).map((dosha, i) => {
            const effectiveColor = dosha.effectiveSeverity === 'cancelled' ? 'border-green-500/20 bg-green-500/5' : dosha.effectiveSeverity === 'partial' ? 'border-yellow-500/20 bg-yellow-500/5' : dosha.present ? 'border-red-500/20 bg-red-500/5' : 'border-green-500/10 bg-bg-primary/30';
            return (
            <div key={i} className={`p-4 rounded-lg border ${effectiveColor}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold-light font-semibold">{dosha.name}</span>
                <div className="flex items-center gap-2">
                  {dosha.present && <span className={`text-xs px-2 py-0.5 rounded-full ${severityColors[dosha.severity]}`}>{dosha.severity}</span>}
                  {dosha.effectiveSeverity && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${dosha.effectiveSeverity === 'cancelled' ? 'bg-green-500/20 text-green-400' : dosha.effectiveSeverity === 'partial' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {dosha.effectiveSeverity === 'cancelled' ? (locale === 'en' || isTamil ? 'Cancelled' : 'निरस्त') : dosha.effectiveSeverity === 'partial' ? (locale === 'en' || isTamil ? 'Partial' : 'आंशिक') : (locale === 'en' || isTamil ? 'Full' : 'पूर्ण')}
                    </span>
                  )}
                  {!dosha.effectiveSeverity && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${dosha.present ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {dosha.present ? tTip('present') : tTip('absent')}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{dosha.description}</p>
              {dosha.activeDasha && (
                <p className="text-purple-400 text-xs mt-2">{dosha.activeDasha}</p>
              )}
              {dosha.present && dosha.cancellationConditions && dosha.cancellationConditions.length > 0 && (
                <div className="mt-3 p-3 bg-bg-primary/40 rounded-lg border border-gold-primary/10">
                  <p className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Cancellation Conditions (BPHS)' : 'निरसन शर्तें (बृहत्पाराशरहोराशास्त्र)'}</p>
                  <div className="space-y-1.5">
                    {dosha.cancellationConditions.map((cc, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <span className={`mt-0.5 w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full text-xs ${cc.met ? 'bg-green-500/20 text-green-400' : 'bg-red-500/10 text-red-400/60'}`}>
                          {cc.met ? '✓' : '✗'}
                        </span>
                        <span className={`${cc.met ? 'text-green-400' : 'text-text-tertiary'}`}>{cc.condition}</span>
                        {cc.source && <span className="text-text-tertiary/50 text-xs ml-auto flex-shrink-0">{cc.source}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dosha.present && dosha.remedies && (
                <div className="mt-3 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                  <p className="text-amber-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Remedial Measures' : 'उपचारात्मक उपाय'}</p>
                  <p className="text-text-secondary text-sm">{dosha.remedies}</p>
                </div>
              )}
              {dosha.classicalReferences && (
                <ClassicalReferencesBlock refs={dosha.classicalReferences} locale={locale} isDevanagari={isDevanagari} />
              )}
            </div>
            );
          })}
        </div>
      </section>

      {/* ===== LIFE AREA PROGNOSIS ===== */}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
          {locale === 'en' || isTamil ? 'Life Area Prognosis' : isDevanagari ? 'जीवन क्षेत्र पूर्वानुमान' : 'जीवनक्षेत्रपूर्वानुमानम्'}
        </h3>
        <div className="space-y-4">
          {(['career', 'wealth', 'marriage', 'health', 'education'] as const).map((key) => {
            const area = tip.lifeAreas[key];
            return (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/30 border border-gold-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-gold-primary font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{area.label}</h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < area.rating ? 'bg-gold-primary' : 'bg-gold-primary/10'}`} />
                    ))}
                    <span className="text-gold-light text-xs ml-1 font-mono">{area.rating}/10</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-2">{area.summary}</p>
                {area.details && <p className="text-text-secondary/70 text-xs leading-relaxed">{area.details}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== DASHA SYNTHESIS (new) ===== */}
      {tip.dashaSynthesis?.currentMaha && (() => {
        const ds = tip.dashaSynthesis!;
        const cm = ds.currentMaha!;
        const NAME_TO_ID: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8 };
        const ASSESSMENT_COLORS: Record<PeriodAssessment, { bg: string; border: string; text: string; bar: string }> = {
          very_favorable: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', text: 'text-emerald-400', bar: 'bg-emerald-500' },
          favorable: { bg: 'bg-green-500/15', border: 'border-green-500/25', text: 'text-green-400', bar: 'bg-green-500' },
          mixed: { bg: 'bg-amber-500/15', border: 'border-amber-500/25', text: 'text-amber-400', bar: 'bg-amber-500' },
          challenging: { bg: 'bg-orange-500/15', border: 'border-orange-500/25', text: 'text-orange-400', bar: 'bg-orange-500' },
          difficult: { bg: 'bg-rose-500/15', border: 'border-rose-500/25', text: 'text-rose-400', bar: 'bg-rose-500' },
        };
        const ASSESSMENT_LABELS: Record<PeriodAssessment, LocaleText> = {
          very_favorable: { en: 'Very Favorable', hi: 'अत्यन्त शुभ', sa: 'अत्यन्त शुभ', mai: 'अत्यन्त शुभ', mr: 'अत्यन्त शुभ', ta: 'மிகவும் சாதகமானது', te: 'చాలా అనుకూలం', bn: 'অত্যন্ত অনুকূল', kn: 'ಅತ್ಯಂತ ಅನುಕೂಲ', gu: 'ખૂબ અનુકૂળ' },
          favorable: { en: 'Favorable', hi: 'शुभ', sa: 'शुभ', mai: 'शुभ', mr: 'शुभ', ta: 'சாதகமானது', te: 'అనుకూలం', bn: 'অনুকূল', kn: 'ಅನುಕೂಲ', gu: 'અનુકૂળ' },
          mixed: { en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रित', mai: 'मिश्रित', mr: 'मिश्रित', ta: 'கலவையான', te: 'మిశ్రమం', bn: 'মিশ্র', kn: 'ಮಿಶ್ರ', gu: 'મિશ્ર' },
          challenging: { en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'चुनौतीपूर्ण', mai: 'चुनौतीपूर्ण', mr: 'चुनौतीपूर्ण', ta: 'சவாலான', te: 'సవాలుదాయకం', bn: 'চ্যালেঞ্জিং', kn: 'ಸವಾಲಿನ', gu: 'પડકારજનક' },
          difficult: { en: 'Difficult', hi: 'कठिन', sa: 'कठिन', mai: 'कठिन', mr: 'कठिन', ta: 'கடினமான', te: 'కష్టమైన', bn: 'কঠিন', kn: 'ಕಠಿಣ', gu: 'કઠિન' },
        };
        const lifeAreaArrow = (text: string): string => {
          if (/favorable|strong|excellent|growth|success|gains|flourish|prosper|expand/i.test(text)) return '\u2191';
          if (/challenge|difficult|obstacle|strain|loss|conflict|stress|caution|decline/i.test(text)) return '\u2193';
          return '\u2192';
        };
        const lifeAreaColor = (arrow: string) => arrow === '\u2191' ? 'text-emerald-400' : arrow === '\u2193' ? 'text-rose-400' : 'text-amber-400';
        const fmtYear = (d: string) => d.slice(0, 4);
        const fmtDate = (d: string) => { const p = d.split('-'); return `${p[2]}/${p[1]}/${p[0].slice(2)}`; };
        const loc = isDevanagariLocale(locale) ? 'hi' as const : 'en' as const;

        return (
          <section className="space-y-6">
            {/* ── Section 1: Lifetime Timeline ── */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
                {locale === 'en' || isTamil ? 'Dasha Period Analysis' : isDevanagari ? 'दशा काल विश्लेषण' : 'दशाकालविश्लेषणम्'}
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gold-primary/30">
                {ds.lifetimeSummary.map((md, i) => {
                  const pid = NAME_TO_ID[md.planet] ?? 0;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedMahaTimeline(selectedMahaTimeline === i ? null : i)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 ${
                        md.isCurrent
                          ? 'bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-gold-primary/50 scale-105 shadow-lg shadow-gold-primary/10'
                          : md.isPast
                            ? 'bg-bg-primary/20 border-gold-primary/10 opacity-40'
                            : 'bg-bg-primary/30 border-gold-primary/15 hover:border-gold-primary/30'
                      } ${selectedMahaTimeline === i ? 'ring-1 ring-gold-primary/40' : ''}`}
                    >
                      <GrahaIconById id={pid} size={16} />
                      <span className={`text-xs font-medium whitespace-nowrap ${md.isCurrent ? 'text-gold-light' : 'text-text-secondary'}`}
                        style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {tl(md.planetName, locale)}
                      </span>
                      <span className="text-xs text-text-secondary/75 whitespace-nowrap">
                        {fmtYear(md.startDate)}-{fmtYear(md.endDate).slice(2)}
                      </span>
                      {md.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                {selectedMahaTimeline !== null && ds.lifetimeSummary[selectedMahaTimeline] && (
                  <motion.div
                    key={selectedMahaTimeline}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-lg bg-bg-primary/30 border border-gold-primary/10 overflow-hidden"
                  >
                    <p className="text-text-secondary text-sm leading-relaxed">{ds.lifetimeSummary[selectedMahaTimeline].theme}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Section 2: Current Mahadasha Card ── */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <GrahaIconById id={NAME_TO_ID[cm.planet] ?? 0} size={40} />
                <div>
                  <h3 className="text-xl text-gold-light font-bold" style={headingFont}>
                    {tl(cm.planetName, locale)} {locale === 'en' || isTamil ? 'Mahadasha' : 'महादशा'}
                  </h3>
                  <p className="text-text-secondary text-sm">{fmtDate(cm.startDate)} — {fmtDate(cm.endDate)} ({cm.years} {locale === 'en' || isTamil ? 'years' : 'वर्ष'})</p>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-6 whitespace-pre-line">{cm.overview}</p>

              {/* Activated Yogas */}
              {cm.yogasActivated.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Activated Yogas' : 'सक्रिय योग'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cm.yogasActivated.map((y, i) => {
                      const isAuspicious = /raja|dhana|mahapurusha|pancha|lakshmi|saraswati|budhaditya|gajakesari/i.test(y.type);
                      return (
                        <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          isAuspicious ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`} title={y.effect}>
                          {y.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Activated Doshas */}
              {cm.doshasActivated.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Activated Doshas' : 'सक्रिय दोष'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cm.doshasActivated.map((d, i) => (
                      <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        d.severity === 'high' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`} title={d.effect}>
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Divisional Insights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['D1', 'D9', 'D10', 'D2'] as const).map((key) => (
                  <div key={key} className="p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
                    <span className="text-gold-primary text-xs font-bold">{key}</span>
                    <p className="text-text-secondary text-xs mt-1 leading-relaxed">{cm.divisionalInsights[key]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 3: Antardasha Stack ── */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              <h3 className="text-lg text-gold-light font-semibold mb-5" style={headingFont}>
                {locale === 'en' || isTamil ? 'Antardasha Periods' : isDevanagari ? 'अन्तर्दशा काल' : 'अन्तर्दशाकालाः'}
              </h3>
              <div className="space-y-3 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-gold-primary/20 pr-1">
                {cm.antardashas.map((ad, ai) => {
                  const aColors = ASSESSMENT_COLORS[ad.netAssessment];
                  const aLabel = ASSESSMENT_LABELS[ad.netAssessment];
                  const isExpanded = expandedAntar === ai;
                  const adPlanetId = NAME_TO_ID[ad.planet] ?? 0;
                  const lifeKeys = ['career', 'relationships', 'health', 'finance', 'spirituality'] as const;
                  const LIFE_ICONS: Record<string, string> = { career: '\u{1F4BC}', relationships: '\u2764', health: '\u2695', finance: '\u{1F4B0}', spirituality: '\u2728' };
                  const LIFE_LABELS: Record<string, LocaleText> = {
                    career: { en: 'Career', hi: 'करियर', sa: 'करियर', mai: 'करियर', mr: 'करियर', ta: 'தொழில்', te: 'వృత్తి', bn: 'কর্মজীবন', kn: 'ವೃತ್ತಿ', gu: 'કારકિર્દી' },
                    relationships: { en: 'Relations', hi: 'सम्बन्ध', sa: 'सम्बन्ध', mai: 'सम्बन्ध', mr: 'सम्बन्ध', ta: 'உறவுகள்', te: 'సంబంధాలు', bn: 'সম্পর্ক', kn: 'ಸಂಬಂಧಗಳು', gu: 'સંબંધો' },
                    health: { en: 'Health', hi: 'स्वास्थ्य', sa: 'स्वास्थ्य', mai: 'स्वास्थ्य', mr: 'स्वास्थ्य', ta: 'ஆரோக்கியம்', te: 'ఆరోగ్యం', bn: 'স্বাস্থ্য', kn: 'ಆರೋಗ್ಯ', gu: 'આરોગ્ય' },
                    finance: { en: 'Finance', hi: 'वित्त', sa: 'वित्त', mai: 'वित्त', mr: 'वित्त', ta: 'நிதி', te: 'ఆర్థికం', bn: 'অর্থ', kn: 'ಹಣಕಾಸು', gu: 'નાણાં' },
                    spirituality: { en: 'Spirit', hi: 'आध्यात्म', sa: 'आध्यात्म', mai: 'आध्यात्म', mr: 'आध्यात्म', ta: 'ஆன்மிகம்', te: 'ఆధ్యాత్మికం', bn: 'আধ্যাত্মিক', kn: 'ಅಧ್ಯಾತ್ಮ', gu: 'આધ્યાત્મિક' },
                  };

                  return (
                    <div key={ai} className={`rounded-xl border transition-all duration-200 ${
                      ad.isCurrent ? 'border-gold-primary/40 shadow-lg shadow-gold-primary/5' : 'border-gold-primary/10'
                    } ${aColors.bg}`}>
                      {/* Collapsed Header */}
                      <button
                        onClick={() => { setExpandedAntar(isExpanded ? null : ai); setExpandedPratyantar(null); }}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <GrahaIconById id={adPlanetId} size={28} />
                            <div>
                              <span className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                {tl(ad.planetName, locale)}
                              </span>
                              {ad.isCurrent && <span className="ml-2 w-1.5 h-1.5 inline-block rounded-full bg-gold-primary animate-pulse" />}
                              <p className="text-text-secondary/75 text-xs">
                                {fmtDate(ad.startDate)} — {fmtDate(ad.endDate)} ({ad.durationMonths} {locale === 'en' || isTamil ? 'mo' : 'मा'})
                              </p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${aColors.bg} ${aColors.border} ${aColors.text}`}>
                            {aLabel[loc as 'en' | 'hi']}
                          </span>
                        </div>
                        {/* Life area arrows */}
                        <div className="flex gap-3 mt-1">
                          {lifeKeys.map(k => {
                            const arrow = lifeAreaArrow(ad.lifeAreas[k]);
                            return (
                              <span key={k} className="flex items-center gap-0.5 text-xs">
                                <span className="text-text-secondary/70">{LIFE_LABELS[k][loc as 'en' | 'hi']}</span>
                                <span className={`font-bold ${lifeAreaColor(arrow)}`}>{arrow}</span>
                              </span>
                            );
                          })}
                        </div>
                        <p className="text-text-secondary text-xs mt-2 line-clamp-1">{ad.summary}</p>
                      </button>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4 border-t border-gold-primary/10 pt-4">
                              {/* Lord Analysis */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Lord Analysis' : 'स्वामी विश्लेषण'}</h5>
                                <p className="text-text-secondary text-sm leading-relaxed">{ad.lordAnalysis}</p>
                              </div>

                              {/* Interaction */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Interaction' : 'परस्पर सम्बन्ध'}</h5>
                                <p className="text-text-secondary text-sm leading-relaxed">{ad.interaction}</p>
                              </div>

                              {/* Yogas & Doshas */}
                              {ad.yogasTriggered.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Yogas Triggered' : 'योग सक्रिय'}</h5>
                                  <p className="text-emerald-400/80 text-xs">{ad.yogasTriggered.join(', ')}</p>
                                </div>
                              )}
                              {ad.doshasTriggered.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Doshas Triggered' : 'दोष सक्रिय'}</h5>
                                  <p className="text-rose-400/80 text-xs">{ad.doshasTriggered.join(', ')}</p>
                                </div>
                              )}

                              {/* Houses Activated */}
                              {ad.housesActivated.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Houses Activated' : 'भाव सक्रिय'}</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {ad.housesActivated.map((h, hi) => (
                                      <span key={hi} className="px-2 py-0.5 rounded bg-bg-primary/40 border border-gold-primary/10 text-xs text-text-secondary">
                                        <span className="text-gold-light font-medium">H{h.house}</span> {h.theme}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Transit Context */}
                              {ad.transitContext && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Transit Context' : 'गोचर सन्दर्भ'}</h5>
                                  <p className="text-text-secondary text-sm">{ad.transitContext}</p>
                                </div>
                              )}

                              {/* Life Areas */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Life Areas' : 'जीवन क्षेत्र'}</h5>
                                <div className="space-y-2">
                                  {lifeKeys.map(k => {
                                    const arrow = lifeAreaArrow(ad.lifeAreas[k]);
                                    return (
                                      <div key={k} className="flex items-start gap-2">
                                        <span className={`font-bold mt-0.5 ${lifeAreaColor(arrow)}`}>{arrow}</span>
                                        <div>
                                          <span className="text-gold-light text-xs font-medium">{LIFE_LABELS[k][loc as 'en' | 'hi']}</span>
                                          <p className="text-text-secondary text-xs leading-relaxed">{ad.lifeAreas[k]}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Divisional Insights */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Divisional Insights' : 'वर्ग दृष्टि'}</h5>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {(['D1', 'D9', 'D10', 'D2'] as const).map(dk => (
                                    <div key={dk} className="p-2 rounded bg-bg-primary/40 border border-gold-primary/10">
                                      <span className="text-gold-primary text-xs font-bold">{dk}</span>
                                      <p className="text-text-secondary text-xs mt-0.5">{ad.divisionalInsights[dk]}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Advice */}
                              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                                <h5 className="text-amber-400 text-xs font-semibold mb-1">{locale === 'en' || isTamil ? 'Advice' : 'सलाह'}</h5>
                                <p className="text-text-secondary text-sm leading-relaxed">{ad.advice}</p>
                              </div>

                              {/* Key Dates */}
                              {ad.keyDates.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Key Dates' : 'महत्त्वपूर्ण तिथियाँ'}</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {ad.keyDates.map((kd, ki) => (
                                      <span key={ki} className="px-2 py-0.5 rounded bg-bg-primary/40 border border-gold-primary/10 text-xs text-text-secondary font-mono">{kd}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Section 4: Pratyantardasha Blocks */}
                              {ad.pratyantardashas.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Pratyantardasha Periods' : 'प्रत्यन्तर्दशा'}</h5>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ad.pratyantardashas.map((pd, pi) => {
                                      const pColors = ASSESSMENT_COLORS[pd.netAssessment];
                                      const ppid = NAME_TO_ID[pd.planet] ?? 0;
                                      const abbr = GRAHA_ABBREVIATIONS[ppid] || pd.planet.slice(0, 2);
                                      const pratyKey = `${ai}-${pi}`;
                                      const isPratyExpanded = expandedPratyantar === pratyKey;

                                      return (
                                        <div key={pi} className="flex flex-col items-center">
                                          <button
                                            onClick={(e) => { e.stopPropagation(); setExpandedPratyantar(isPratyExpanded ? null : pratyKey); }}
                                            className={`relative w-10 h-10 rounded-lg flex items-center justify-center border text-xs font-bold transition-all ${pColors.bg} ${pColors.border} ${pColors.text} hover:scale-110`}
                                            title={`${tl(pd.planetName, locale)} | ${fmtDate(pd.startDate)}-${fmtDate(pd.endDate)} | ${pd.keyTheme}`}
                                          >
                                            {abbr}
                                            {pd.isCritical && (
                                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold-primary" />
                                            )}
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {/* Expanded pratyantardasha detail */}
                                  <AnimatePresence>
                                    {expandedPratyantar?.startsWith(`${ai}-`) && (() => {
                                      const pIdx = parseInt(expandedPratyantar.split('-')[1]);
                                      const pd = ad.pratyantardashas[pIdx];
                                      if (!pd) return null;
                                      const pColors = ASSESSMENT_COLORS[pd.netAssessment];
                                      const pLabel = ASSESSMENT_LABELS[pd.netAssessment];
                                      return (
                                        <motion.div
                                          key={expandedPratyantar}
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          <div className={`mt-3 p-3 rounded-lg border ${pColors.bg} ${pColors.border}`}>
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <GrahaIconById id={NAME_TO_ID[pd.planet] ?? 0} size={20} />
                                                <span className="text-gold-light text-sm font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                                  {tl(pd.planetName, locale)}
                                                </span>
                                                <span className="text-text-secondary/70 text-xs">{fmtDate(pd.startDate)} — {fmtDate(pd.endDate)} ({pd.durationDays}d)</span>
                                              </div>
                                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pColors.text}`}>{pLabel[loc as 'en' | 'hi']}</span>
                                            </div>
                                            <p className="text-text-secondary text-xs mb-1"><span className="text-gold-primary font-medium">{locale === 'en' || isTamil ? 'Theme' : 'विषय'}:</span> {pd.keyTheme}</p>
                                            <p className="text-text-secondary text-xs"><span className="text-gold-primary font-medium">{locale === 'en' || isTamil ? 'Advice' : 'सलाह'}:</span> {pd.advice}</p>
                                            {pd.expanded && (
                                              <div className="mt-2 pt-2 border-t border-gold-primary/10 space-y-1">
                                                <p className="text-text-secondary text-xs">{pd.expanded.lordAnalysis}</p>
                                                <div className="flex gap-2">
                                                  <span className="text-xs text-text-secondary/75"><span className="text-gold-primary">D1:</span> {pd.expanded.divisionalInsights.D1}</span>
                                                  {pd.expanded.divisionalInsights.D9 && <span className="text-xs text-text-secondary/75"><span className="text-gold-primary">D9:</span> {pd.expanded.divisionalInsights.D9}</span>}
                                                  {pd.expanded.divisionalInsights.D10 && <span className="text-xs text-text-secondary/75"><span className="text-gold-primary">D10:</span> {pd.expanded.divisionalInsights.D10}</span>}
                                                </div>
                                                {pd.expanded.warning && (
                                                  <p className="text-rose-400 text-xs mt-1 p-2 rounded bg-rose-500/5 border border-rose-500/10">{pd.expanded.warning}</p>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      );
                                    })()}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ===== DASHA INSIGHT (fallback when synthesis unavailable) ===== */}
      {!tip.dashaSynthesis && tip.dashaInsight.currentMaha && (() => {
        // Extract planet name from "Mercury Mahadasha" or "बुध महादशा"
        const mahaText = tip.dashaInsight.currentMaha;
        const PLANET_NAME_TO_ID: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8, सूर्य: 0, चन्द्र: 1, मंगल: 2, बुध: 3, बृहस्पति: 4, शुक्र: 5, शनि: 6, राहु: 7, केतु: 8 };
        const mahaPlanetId = Object.entries(PLANET_NAME_TO_ID).find(([name]) => mahaText.includes(name))?.[1] ?? 0;
        const antarText = tip.dashaInsight.currentAntar || '';
        const antarPlanetId = Object.entries(PLANET_NAME_TO_ID).find(([name]) => antarText.includes(name))?.[1] ?? 0;
        const mahaGraha = GRAHAS[mahaPlanetId];
        const antarGraha = GRAHAS[antarPlanetId];

        return (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
          {/* Header with planet icon */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-primary/20 to-gold-dark/10 border border-gold-primary/25 flex items-center justify-center shadow-lg shadow-gold-primary/10">
              <GrahaIconById id={mahaPlanetId} size={32} />
            </div>
            <div>
              <h3 className="text-xl text-gold-light font-bold" style={headingFont}>{tTip('dashaAnalysis')}</h3>
              <p className="text-text-secondary/60 text-xs">{locale === 'en' || isTamil ? 'Your current planetary period' : 'आपका वर्तमान ग्रह काल'}</p>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4">
            {/* Current Mahadasha — mega card */}
            <div className="rounded-xl p-5 border-2 border-gold-primary/20 bg-gradient-to-r from-gold-primary/8 via-transparent to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: mahaGraha?.color || '#d4a853' }} />
                <span className="text-gold-light font-bold text-lg" style={headingFont}>{tip.dashaInsight.currentMaha}</span>
              </div>
              <p className="text-text-primary/80 text-sm leading-relaxed whitespace-pre-line" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tip.dashaInsight.currentMahaAnalysis}</p>
            </div>

            {/* Current Antardasha */}
            {tip.dashaInsight.currentAntar && (
              <div className="rounded-xl p-4 border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] ml-2 sm:ml-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center bg-bg-primary/50">
                    <GrahaIconById id={antarPlanetId} size={18} />
                  </div>
                  <div>
                    <span className="font-semibold text-sm" style={{ color: antarGraha?.color || '#e6e2d8' }}>{tip.dashaInsight.currentAntar}</span>
                    <p className="text-text-secondary/50 text-[10px]">{locale === 'en' || isTamil ? 'Sub-period within the main period' : 'मुख्य काल के भीतर उपकाल'}</p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed ml-11" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tip.dashaInsight.currentAntarAnalysis}</p>
              </div>
            )}

            {/* Next Transition */}
            {tip.dashaInsight.upcoming && (
              <div className="rounded-xl p-4 border border-indigo-500/15 bg-indigo-500/5 ml-2 sm:ml-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-indigo-400 text-xs uppercase tracking-wider font-bold">{tTip('upcoming')}</span>
                  <span className="w-4 h-px bg-indigo-500/30 flex-1" />
                </div>
                <p className="text-text-secondary/80 text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tip.dashaInsight.upcoming}</p>
              </div>
            )}
          </div>
        </section>
        );
      })()}

      {/* Transit Radar moved into Chart tab for visibility */}

      {/* ===== PLANETARY STRENGTH ===== */}
      {tip.strengthOverview.length > 0 && (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
            {locale === 'en' || isTamil ? 'Planetary Strength (Shadbala)' : isDevanagari ? 'ग्रह बल (षड्बल)' : 'ग्रहबलम् (षड्बलम्)'}
          </h3>
          <p className="text-text-secondary/60 text-xs mb-4">
            {locale === 'en' || isTamil
              ? 'Ratio = actual Rupas ÷ minimum required (BPHS Ch.27). ≥1.5× = Strong, ≥1.0× = Adequate, <1.0× = Weak.'
              : 'अनुपात = वास्तविक रूपा ÷ न्यूनतम आवश्यक (BPHS अ.27)। ≥1.5× = बलवान, ≥1.0× = पर्याप्त, <1.0× = दुर्बल।'}
          </p>
          <div className="space-y-3">
            {tip.strengthOverview.map((s, i) => {
              const ratio = (s as any).ratio as number | undefined;
              const rupas = (s as any).rupas as number | undefined;
              const ratioColor = ratio !== undefined
                ? (ratio >= 1.5 ? 'text-green-400' : ratio >= 1.0 ? 'text-amber-300' : 'text-red-400')
                : (s.strength >= 80 ? 'text-green-400' : s.strength >= 60 ? 'text-amber-300' : 'text-red-400');
              return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-20 text-right font-medium" style={{ color: s.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>{s.planetName}</span>
                <div className="flex-1 bg-gold-primary/10 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.strength}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.planetColor, opacity: 0.7 }}
                  />
                </div>
                <span className={`text-xs w-28 text-right font-mono ${ratioColor}`}>
                  {ratio !== undefined ? `${ratio.toFixed(2)}×` : `${s.strength}%`}
                  {rupas !== undefined && <span className="text-text-secondary/40 ml-1">({rupas.toFixed(1)}R)</span>}
                  <span className="ml-1 font-sans">{s.status}</span>
                </span>
              </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== REMEDIES ===== */}
      {(tip.remedies.gemstones.length > 0 || tip.remedies.mantras.length > 0) && (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('remedies')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tip.remedies.gemstones.length > 0 && (
              <div>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{locale === 'en' || isTamil ? 'Gemstones' : 'रत्न'}</h4>
                <div className="space-y-2">
                  {tip.remedies.gemstones.map((g, i) => (
                    <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5">
                      <p className="text-gold-light text-sm font-semibold">{g.name}</p>
                      <p className="text-text-secondary/70 text-xs">{locale === 'en' || isTamil ? 'For' : 'के लिए'}: {g.planet}</p>
                      <p className="text-text-secondary text-xs mt-1">{g.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tip.remedies.mantras.length > 0 && (
              <div>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{locale === 'en' || isTamil ? 'Mantras' : 'मन्त्र'}</h4>
                <div className="space-y-2">
                  {tip.remedies.mantras.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5">
                      <p className="text-gold-light text-sm font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{m.name}</p>
                      <p className="text-text-secondary/70 text-xs">{locale === 'en' || isTamil ? 'For' : 'के लिए'}: {m.planet}</p>
                      <p className="text-text-secondary text-xs mt-1">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tip.remedies.practices.length > 0 && (
              <div>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{locale === 'en' || isTamil ? 'Charitable Practices' : 'दानशील कार्य'}</h4>
                <div className="space-y-2">
                  {tip.remedies.practices.map((p, i) => (
                    <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5">
                      <p className="text-gold-light text-sm font-semibold">{p.name}</p>
                      <p className="text-text-secondary text-xs mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== GRAHA SHANTI PUJA RECOMMENDATIONS ===== */}
      {afflictedPlanets.length > 0 && (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-2" style={headingFont}>
            {locale === 'en' || isTamil ? 'Recommended Graha Shanti Pujas' : isDevanagari ? 'अनुशंसित ग्रह शान्ति पूजा' : 'अनुशंसित ग्रहशान्तिपूजाः'}
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            {locale === 'en' || isTamil
              ? 'Based on your chart analysis, the following planets are afflicted and may benefit from graha shanti rituals.'
              : 'आपकी कुण्डली विश्लेषण के अनुसार, निम्नलिखित ग्रह पीड़ित हैं और ग्रह शान्ति पूजा से लाभ हो सकता है।'}
          </p>
          <div className="space-y-4">
            {afflictedPlanets.map((ap) => {
              const severityConfig = {
                severe: { border: 'border-rose-500/20', bg: 'bg-rose-500/8', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-400', label: locale === 'en' || isTamil ? 'Severe' : 'गम्भीर' },
                moderate: { border: 'border-amber-500/20', bg: 'bg-amber-500/8', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400', label: locale === 'en' || isTamil ? 'Moderate' : 'मध्यम' },
                mild: { border: 'border-blue-500/20', bg: 'bg-blue-500/8', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400', label: locale === 'en' || isTamil ? 'Mild' : 'साधारण' },
              }[ap.severity];
              const planetData = kundali.planets.find(p => p.planet.id === ap.planetId);
              const planetName = tl(planetData?.planet.name, locale) || ap.planetName;
              return (
                <div key={ap.planetId} className={`p-4 rounded-xl border ${severityConfig.border} ${severityConfig.bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <GrahaIconById id={ap.planetId} size={32} />
                      <span className={`text-lg font-bold ${severityConfig.text}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
                        {planetName}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${severityConfig.badge}`}>
                      {severityConfig.label}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">{ap.reasons.join(', ')}</p>
                  <a
                    href={`/${locale}/puja/${ap.remedySlug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gold-primary hover:text-gold-light transition-colors"
                  >
                    {locale === 'en' || isTamil
                      ? `${planetName} Graha Shanti Puja`
                      : `${planetName} ग्रह शान्ति पूजा`}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══ ACTION PLAN SUMMARY ═══ */}
      {actionItems.length > 0 && (
        <>
          <SectionDivider />
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/5 via-[#1a1040]/40 to-[#0a0e27] border border-emerald-500/20 p-6 sm:p-8">
            <h3 className="text-emerald-400 text-lg font-bold mb-1" style={headingFont}>
              {isEn ? 'Your Action Plan' : 'आपकी कार्य योजना'}
            </h3>
            <p className="text-text-secondary text-xs mb-5">
              {isEn ? 'Prioritized steps based on your chart analysis' : 'कुण्डली विश्लेषण पर आधारित प्राथमिक कदम'}
            </p>
            <div className="space-y-3">
              {actionItems.slice(0, 5).map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-text-primary text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

