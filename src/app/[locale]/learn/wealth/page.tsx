'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CircleDollarSign, Zap } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/wealth.json';
import { getHeadingFont } from '@/lib/utils/locale-fonts';

/* ── Wealth Houses data ──────────────────────────────────────────── */
const WEALTH_HOUSES: { house: string; nameKey: string; descKey: string; sigKey: string; color: string }[] = [
  { house: '2', nameKey: 'wh2Name', descKey: 'wh2Desc', sigKey: 'wh2Significations', color: 'text-emerald-400' },
  { house: '5', nameKey: 'wh5Name', descKey: 'wh5Desc', sigKey: 'wh5Significations', color: 'text-violet-400' },
  { house: '9', nameKey: 'wh9Name', descKey: 'wh9Desc', sigKey: 'wh9Significations', color: 'text-amber-400' },
  { house: '11', nameKey: 'wh11Name', descKey: 'wh11Desc', sigKey: 'wh11Significations', color: 'text-gold-light' },
];

/* ── Dhana Yogas ─────────────────────────────────────────────────── */
const DHANA_YOGAS: { nameKey: string; conditionKey: string; effectKey: string; strength: 'powerful' | 'strong' | 'moderate' }[] = [
  { nameKey: 'dy1Name', conditionKey: 'dy1Condition', effectKey: 'dy1Effect', strength: 'powerful' },
  { nameKey: 'dy2Name', conditionKey: 'dy2Condition', effectKey: 'dy2Effect', strength: 'powerful' },
  { nameKey: 'dy3Name', conditionKey: 'dy3Condition', effectKey: 'dy3Effect', strength: 'strong' },
  { nameKey: 'dy4Name', conditionKey: 'dy4Condition', effectKey: 'dy4Effect', strength: 'strong' },
  { nameKey: 'dy5Name', conditionKey: 'dy5Condition', effectKey: 'dy5Effect', strength: 'strong' },
  { nameKey: 'dy6Name', conditionKey: 'dy6Condition', effectKey: 'dy6Effect', strength: 'moderate' },
];

/* ── Poverty Indicators ──────────────────────────────────────────── */
const POVERTY_INDICATORS: { indicatorKey: string; problemKey: string; remedyKey: string; color: string }[] = [
  { indicatorKey: 'pi1Indicator', problemKey: 'pi1Problem', remedyKey: 'pi1Remedy', color: 'border-red-500/20' },
  { indicatorKey: 'pi2Indicator', problemKey: 'pi2Problem', remedyKey: 'pi2Remedy', color: 'border-amber-500/20' },
  { indicatorKey: 'pi3Indicator', problemKey: 'pi3Problem', remedyKey: 'pi3Remedy', color: 'border-slate-500/20' },
  { indicatorKey: 'pi4Indicator', problemKey: 'pi4Problem', remedyKey: 'pi4Remedy', color: 'border-yellow-500/20' },
];

/* ── Timing Wealth ───────────────────────────────────────────────── */
const TIMING_WEALTH: { triggerKey: string; effectKey: string; color: string }[] = [
  { triggerKey: 'tw1Trigger', effectKey: 'tw1Effect', color: 'bg-emerald-500/10 border-emerald-500/20' },
  { triggerKey: 'tw2Trigger', effectKey: 'tw2Effect', color: 'bg-yellow-500/10 border-yellow-500/20' },
  { triggerKey: 'tw3Trigger', effectKey: 'tw3Effect', color: 'bg-slate-500/10 border-slate-500/20' },
  { triggerKey: 'tw4Trigger', effectKey: 'tw4Effect', color: 'bg-violet-500/10 border-violet-500/20' },
];

/* ── Ashtakavarga Score Ranges ───────────────────────────────────── */
const SAV_RANGES: { range: string; qualityKey: string; descKey: string; color: string }[] = [
  { range: '30+', qualityKey: 'excellent', descKey: 'excellentDesc', color: 'border-emerald-500/20 bg-emerald-500/5' },
  { range: '25-29', qualityKey: 'good', descKey: 'goodDesc', color: 'border-blue-500/20 bg-blue-500/5' },
  { range: '<25', qualityKey: 'challenging', descKey: 'challengingDesc', color: 'border-red-500/20 bg-red-500/5' },
];

/* ── Related Links ───────────────────────────────────────────────── */
const RELATED_LINKS: { href: '/kundali' | '/learn/ashtakavarga' | '/learn/planet-in-house' | '/learn/yogas'; labelKey: string }[] = [
  { href: '/kundali', labelKey: 'linkKundali' },
  { href: '/learn/ashtakavarga', labelKey: 'linkAshtakavarga' },
  { href: '/learn/planet-in-house', labelKey: 'linkPlanetInHouse' },
  { href: '/learn/yogas', labelKey: 'linkYogas' },
];

/* ── SVG: Wealth Triangle — houses 2, 5, 9, 11 connected ────────── */
function WealthTriangleSVG() {
  const r = 105;
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const wealthHouses = [2, 5, 9, 11];

  // Calculate positions
  const getPos = (h: number) => {
    const mid = ((h - 0.5) * 30 - 90) * (Math.PI / 180);
    return { x: Math.cos(mid) * (r * 0.72), y: Math.sin(mid) * (r * 0.72) };
  };

  const wealthPositions = wealthHouses.map(getPos);

  return (
    <svg viewBox="-150 -150 300 300" className="w-full max-w-[340px] mx-auto">
      <defs>
        <radialGradient id="wt-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wt-gold-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0.3" />
        </linearGradient>
        <filter id="wt-glow-f"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <circle cx="0" cy="0" r="140" fill="url(#wt-glow)" />

      {/* House segments */}
      {houses.map((h) => {
        const a1 = ((h - 1) * 30 - 90) * (Math.PI / 180);
        const a2 = (h * 30 - 90) * (Math.PI / 180);
        const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
        const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
        const mid = ((h - 0.5) * 30 - 90) * (Math.PI / 180);
        const tx = Math.cos(mid) * (r * 0.88), ty = Math.sin(mid) * (r * 0.88);
        const isWealth = wealthHouses.includes(h);
        return (
          <g key={h}>
            <path d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
              fill={isWealth ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.02)'}
              stroke={isWealth ? '#d4a853' : 'rgba(212,168,83,0.1)'}
              strokeWidth={isWealth ? 1.5 : 0.5} />
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
              className={isWealth ? 'fill-gold-light font-bold' : 'fill-text-tertiary'}
              fontSize={isWealth ? 12 : 8}>{h}</text>
          </g>
        );
      })}

      {/* Golden connection lines between wealth houses */}
      {wealthPositions.map((p1, i) =>
        wealthPositions.slice(i + 1).map((p2, j) => (
          <line key={`${i}-${j}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="url(#wt-gold-line)" strokeWidth="1.5" strokeDasharray="6,3" />
        ))
      )}

      {/* Glow dots at wealth house positions */}
      {wealthPositions.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="8" fill="rgba(212,168,83,0.15)" filter="url(#wt-glow-f)" />
          <circle cx={p.x} cy={p.y} r="4" fill="#d4a853" opacity="0.7" />
        </g>
      ))}

      {/* Center label */}
      <circle cx="0" cy="0" r="22" fill="rgba(10,14,39,0.85)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
      <text x="0" y="-3" textAnchor="middle" dominantBaseline="middle" className="fill-gold-light" fontSize="7" fontWeight="bold">WEALTH</text>
      <text x="0" y="7" textAnchor="middle" dominantBaseline="middle" className="fill-gold-dark" fontSize="6">2-5-9-11</text>
    </svg>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function WealthPredictionGuide() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const hf = getHeadingFont(locale);
  const [expandedYoga, setExpandedYoga] = useState<number | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
          <CircleDollarSign className="w-3.5 h-3.5" />
          {t('practicalGuide')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t('title')}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t('subtitle')}</p>
      </motion.div>

      {/* SVG Wealth Triangle */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 flex flex-col items-center">
          <WealthTriangleSVG />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {t('svgCaption')}
          </p>
        </div>
      </motion.div>

      {/* Section 1: The Wealth Houses */}
      <LessonSection number={1} title={t('sec1Title')} variant="highlight">
        <div className="space-y-4">
          {WEALTH_HOUSES.map((wh) => (
            <div key={wh.house} className="p-5 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center font-bold text-sm ${wh.color}`}>{wh.house}</div>
                <div>
                  <h3 className={`font-bold text-base ${wh.color}`} style={hf}>{t(wh.nameKey)}</h3>
                  <p className="text-text-tertiary text-xs">{t(wh.descKey)}</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed ml-11">{t(wh.sigKey)}</p>
            </div>
          ))}
          {/* Axis explanation */}
          <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t('axisConnection')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
                <span className="text-emerald-400 font-bold text-xs">{t('earningSavingAxis')}</span>
                <p className="text-text-secondary text-xs mt-1">{t('earningSavingDesc')}</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
                <span className="text-violet-400 font-bold text-xs">{t('fortuneIntelAxis')}</span>
                <p className="text-text-secondary text-xs mt-1">{t('fortuneIntelDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 2: Dhana Yogas */}
      <LessonSection number={2} title={t('sec2Title')}>
        <p className="text-text-secondary text-sm mb-5">
          {t('sec2Intro')}
        </p>
        <div className="space-y-2">
          {DHANA_YOGAS.map((dy, i) => {
            const isOpen = expandedYoga === i;
            const strengthColor = dy.strength === 'powerful' ? 'bg-amber-500/15 text-amber-300' : dy.strength === 'strong' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-blue-500/15 text-blue-300';
            return (
              <div key={i} className="rounded-xl border border-gold-primary/10 overflow-hidden">
                <button onClick={() => setExpandedYoga(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-gold-light font-bold text-sm" style={hf}>{t(dy.nameKey)}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${strengthColor}`}>
                      {t(dy.strength)}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1 space-y-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
                          <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{t('condition')}</span>
                          <p className="text-text-secondary text-sm">{t(dy.conditionKey)}</p>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">{t(dy.effectKey)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 3: Poverty Indicators & Remedies */}
      <LessonSection number={3} title={t('sec3Title')}>
        <div className="space-y-3">
          {POVERTY_INDICATORS.map((item, i) => (
            <div key={i} className={`p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border ${item.color}`}>
              <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{t(item.indicatorKey)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">{t(item.problemKey)}</p>
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
                <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold">{t('remedy')}</span>
                <p className="text-emerald-300/80 text-xs mt-1">{t(item.remedyKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Timing Wealth Events */}
      <LessonSection number={4} title={t('sec4Title')} variant="highlight">
        <div className="space-y-4">
          {TIMING_WEALTH.map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t(item.triggerKey)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{t(item.effectKey)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 5: Ashtakavarga and Wealth */}
      <LessonSection number={5} title={t('sec5Title')}>
        <div className="space-y-4">
          <p className="text-text-secondary text-sm leading-relaxed">
            {t('sec5Intro')}
          </p>
          {/* Score interpretation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAV_RANGES.map((s, i) => (
              <div key={i} className={`p-4 rounded-xl border ${s.color} text-center`}>
                <div className="text-2xl font-bold text-gold-light mb-1" style={hf}>{s.range}</div>
                <div className="text-gold-dark text-xs font-bold uppercase tracking-wider mb-2">{t(s.qualityKey)}</div>
                <p className="text-text-secondary text-xs leading-relaxed">{t(s.descKey)}</p>
              </div>
            ))}
          </div>
          {/* How it works */}
          <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t('howToUse')}</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {t('howToUseDesc')}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* Cross-references */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>{t('relatedTopics')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RELATED_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/25 transition-colors group">
              <Zap className="w-4 h-4 text-gold-dark group-hover:text-gold-light transition-colors" />
              <span className="text-text-secondary text-sm group-hover:text-gold-light transition-colors">{t(link.labelKey)}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
