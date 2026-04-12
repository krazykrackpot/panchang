'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown, Clock, AlertTriangle, Crown, Gem, Moon, Shield, Sparkles, Star, Users, Zap } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import L from '@/messages/learn/marriage.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

/* ── Sign keys for spouse data ────────────────────────────────────── */
const SIGN_KEYS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const;
const SIGN_COLORS = ['text-red-400', 'text-emerald-400', 'text-yellow-300', 'text-blue-300', 'text-amber-400', 'text-green-400', 'text-pink-300', 'text-red-500', 'text-violet-400', 'text-slate-300', 'text-cyan-400', 'text-indigo-400'];

/* ── SVG: D1 (7H highlighted) + D9 Navamsha side by side ─────── */
function MarriageChartSVG() {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const r = 85;

  function Wheel({ cx, label, highlightHouse }: { cx: number; label: string; highlightHouse: number }) {
    return (
      <g transform={`translate(${cx}, 0)`}>
        {houses.map((h) => {
          const a1 = ((h - 1) * 30 - 90) * (Math.PI / 180);
          const a2 = (h * 30 - 90) * (Math.PI / 180);
          const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
          const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
          const mid = ((h - 0.5) * 30 - 90) * (Math.PI / 180);
          const tx = Math.cos(mid) * (r * 0.68), ty = Math.sin(mid) * (r * 0.68);
          const isHL = h === highlightHouse;
          return (
            <g key={h}>
              <path d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                fill={isHL ? 'rgba(220,100,130,0.2)' : 'rgba(255,255,255,0.03)'}
                stroke={isHL ? '#e8829a' : 'rgba(212,168,83,0.12)'}
                strokeWidth={isHL ? 1.5 : 0.5} />
              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                className={isHL ? 'fill-pink-300 font-bold' : 'fill-text-tertiary'}
                fontSize={isHL ? 11 : 8}>{h}</text>
            </g>
          );
        })}
        <circle cx="0" cy="0" r="14" fill="rgba(10,14,39,0.8)" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />
        <text x="0" y="-100" textAnchor="middle" className="fill-gold-light" fontSize="10" fontWeight="bold">{label}</text>
      </g>
    );
  }

  return (
    <svg viewBox="-220 -120 440 240" className="w-full max-w-[480px] mx-auto">
      <defs>
        <radialGradient id="mw-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#e8829a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e8829a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-220" y="-120" width="440" height="240" fill="url(#mw-glow)" rx="12" />
      <Wheel cx={-105} label="D1 (Rashi)" highlightHouse={7} />
      <Wheel cx={105} label="D9 (Navamsha)" highlightHouse={7} />
      {/* connector */}
      <line x1="-15" y1="0" x2="15" y2="0" stroke="rgba(212,168,83,0.3)" strokeWidth="1" strokeDasharray="4,3" />
      <text x="0" y="4" textAnchor="middle" className="fill-gold-dark" fontSize="7">+</text>
    </svg>
  );
}

/* ── Step data (icons + colors, text comes from JSON) ──────────── */
const STEPS = [
  { n: 1, titleKey: 'step1Title', descKey: 'step1Desc', icon: Users, color: 'text-pink-400' },
  { n: 2, titleKey: 'step2Title', descKey: 'step2Desc', icon: Star, color: 'text-amber-400' },
  { n: 3, titleKey: 'step3Title', descKey: 'step3Desc', icon: Gem, color: 'text-pink-300' },
  { n: 4, titleKey: 'step4Title', descKey: 'step4Desc', icon: Crown, color: 'text-violet-400' },
  { n: 5, titleKey: 'step5Title', descKey: 'step5Desc', icon: Sparkles, color: 'text-cyan-400' },
  { n: 6, titleKey: 'step6Title', descKey: 'step6Desc', icon: Shield, color: 'text-gold-light' },
];

const TIMING = [
  { triggerKey: 'timing1Trigger', effectKey: 'timing1Effect', color: 'bg-pink-500/10 border-pink-500/20' },
  { triggerKey: 'timing2Trigger', effectKey: 'timing2Effect', color: 'bg-yellow-500/10 border-yellow-500/20' },
  { triggerKey: 'timing3Trigger', effectKey: 'timing3Effect', color: 'bg-slate-500/10 border-slate-500/20' },
  { triggerKey: 'timing4Trigger', effectKey: 'timing4Effect', color: 'bg-gold-primary/10 border-gold-primary/20' },
  { triggerKey: 'timing5Trigger', effectKey: 'timing5Effect', color: 'bg-violet-500/10 border-violet-500/20' },
];

const DELAYS = [
  { indKey: 'delay1Indicator', detKey: 'delay1Detail', icon: Clock, color: 'text-slate-400' },
  { indKey: 'delay2Indicator', detKey: 'delay2Detail', icon: AlertTriangle, color: 'text-amber-400' },
  { indKey: 'delay3Indicator', detKey: 'delay3Detail', icon: Sparkles, color: 'text-cyan-400' },
  { indKey: 'delay4Indicator', detKey: 'delay4Detail', icon: AlertTriangle, color: 'text-red-400' },
  { indKey: 'delay5Indicator', detKey: 'delay5Detail', icon: Shield, color: 'text-red-500' },
  { indKey: 'delay6Indicator', detKey: 'delay6Detail', icon: Moon, color: 'text-indigo-400' },
];

const POSTS = [
  { aspKey: 'post1Aspect', resKey: 'post1Result' },
  { aspKey: 'post2Aspect', resKey: 'post2Result' },
  { aspKey: 'post3Aspect', resKey: 'post3Result' },
  { aspKey: 'post4Aspect', resKey: 'post4Result' },
  { aspKey: 'post5Aspect', resKey: 'post5Result' },
];

const LINKS = [
  { href: '/kundali' as const, key: 'linkKundali' },
  { href: '/matching' as const, key: 'linkMatching' },
  { href: '/learn/planet-in-house' as const, key: 'linkPlanetInHouse' },
  { href: '/learn/doshas' as const, key: 'linkDoshas' },
];

/* ── Main Page ───────────────────────────────────────────────────── */
export default function MarriagePredictionGuide() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);
  const [expandedSign, setExpandedSign] = useState<number | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium mb-4">
          <Heart className="w-3.5 h-3.5" />
          {t('practicalGuide', locale)}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t('title', locale)}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t('subtitle', locale)}</p>
      </motion.div>

      {/* SVG Charts */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-pink-500/15 flex flex-col items-center">
          <MarriageChartSVG />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {t('chartCaption', locale)}
          </p>
        </div>
      </motion.div>

      {/* Section 1: Marriage Analysis Framework */}
      <LessonSection number={1} title={t('sec1Title', locale)} variant="highlight">
        <div className="space-y-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="flex gap-4 items-start p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pink-300/70 text-xs font-bold uppercase tracking-wider">{t('stepLabel', locale)} {s.n}</span>
                    <h3 className="text-gold-light font-bold text-base" style={hf}>{t(s.titleKey, locale)}</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{t(s.descKey, locale)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 2: Spouse by 7th House Sign */}
      <LessonSection number={2} title={t('sec2Title', locale)}>
        <p className="text-text-secondary text-sm mb-5">
          {t('sec2Intro', locale)}
        </p>
        <div className="space-y-2">
          {SIGN_KEYS.map((sign, i) => {
            const isOpen = expandedSign === i;
            return (
              <div key={i} className="rounded-xl border border-gold-primary/10 overflow-hidden">
                <button onClick={() => setExpandedSign(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-pink-500/5 transition-colors">
                  <span className={`font-bold text-sm ${SIGN_COLORS[i]}`} style={hf}>{t(`sign${sign}`, locale)}</span>
                  <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1">
                        <p className="text-text-secondary text-sm leading-relaxed">{t(`traits${sign}`, locale)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 3: Marriage Timing */}
      <LessonSection number={3} title={t('sec3Title', locale)} variant="highlight">
        <div className="space-y-4">
          {TIMING.map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t(item.triggerKey, locale)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{t(item.effectKey, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Delay Indicators */}
      <LessonSection number={4} title={t('sec4Title', locale)}>
        <p className="text-text-secondary text-sm mb-5">
          {t('sec4Intro', locale)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DELAYS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <h4 className={`font-bold text-sm ${item.color}`} style={hf}>{t(item.indKey, locale)}</h4>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{t(item.detKey, locale)}</p>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 5: Post-marriage from D9 */}
      <LessonSection number={5} title={t('sec5Title', locale)}>
        <div className="space-y-4">
          {POSTS.map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-pink-400 mt-2" />
              <div>
                <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{t(item.aspKey, locale)}</h4>
                <p className="text-text-secondary text-sm leading-relaxed">{t(item.resKey, locale)}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Cross-references */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>{t('relatedTopics', locale)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/25 transition-colors group">
              <Zap className="w-4 h-4 text-gold-dark group-hover:text-gold-light transition-colors" />
              <span className="text-text-secondary text-sm group-hover:text-gold-light transition-colors">{t(link.key, locale)}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
