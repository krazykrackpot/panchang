'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, ChevronDown, Crown, Gem, Globe, GraduationCap, Hammer, Landmark, Lightbulb, Palette, Rocket, Shield, Star, TrendingUp, Users, Zap } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import L from '@/messages/learn/career.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

/* ── 10th house sign career data ─────────────────────────────────── */
const SIGN_CAREERS: { signKey: string; natureKey: string; fieldsKey: string; color: string }[] = [
  { signKey: 'signAries', natureKey: 'ariesNature', fieldsKey: 'ariesFields', color: 'text-red-400' },
  { signKey: 'signTaurus', natureKey: 'taurusNature', fieldsKey: 'taurusFields', color: 'text-emerald-400' },
  { signKey: 'signGemini', natureKey: 'geminiNature', fieldsKey: 'geminiFields', color: 'text-yellow-300' },
  { signKey: 'signCancer', natureKey: 'cancerNature', fieldsKey: 'cancerFields', color: 'text-blue-300' },
  { signKey: 'signLeo', natureKey: 'leoNature', fieldsKey: 'leoFields', color: 'text-amber-400' },
  { signKey: 'signVirgo', natureKey: 'virgoNature', fieldsKey: 'virgoFields', color: 'text-green-400' },
  { signKey: 'signLibra', natureKey: 'libraNature', fieldsKey: 'libraFields', color: 'text-pink-300' },
  { signKey: 'signScorpio', natureKey: 'scorpioNature', fieldsKey: 'scorpioFields', color: 'text-red-500' },
  { signKey: 'signSagittarius', natureKey: 'sagittariusNature', fieldsKey: 'sagittariusFields', color: 'text-violet-400' },
  { signKey: 'signCapricorn', natureKey: 'capricornNature', fieldsKey: 'capricornFields', color: 'text-slate-300' },
  { signKey: 'signAquarius', natureKey: 'aquariusNature', fieldsKey: 'aquariusFields', color: 'text-cyan-400' },
  { signKey: 'signPisces', natureKey: 'piscesNature', fieldsKey: 'piscesFields', color: 'text-indigo-400' },
];

/* ── Planets in 10th house ───────────────────────────────────────── */
const PLANET_10TH: { planetKey: string; careersKey: string; icon: typeof Briefcase; color: string }[] = [
  { planetKey: 'planetSun', careersKey: 'sunCareers', icon: Crown, color: 'text-amber-400' },
  { planetKey: 'planetMoon', careersKey: 'moonCareers', icon: Users, color: 'text-blue-300' },
  { planetKey: 'planetMars', careersKey: 'marsCareers', icon: Shield, color: 'text-red-400' },
  { planetKey: 'planetMercury', careersKey: 'mercuryCareers', icon: Lightbulb, color: 'text-emerald-400' },
  { planetKey: 'planetJupiter', careersKey: 'jupiterCareers', icon: GraduationCap, color: 'text-yellow-400' },
  { planetKey: 'planetVenus', careersKey: 'venusCareers', icon: Palette, color: 'text-pink-400' },
  { planetKey: 'planetSaturn', careersKey: 'saturnCareers', icon: Hammer, color: 'text-slate-400' },
  { planetKey: 'planetRahu', careersKey: 'rahuCareers', icon: Globe, color: 'text-cyan-400' },
  { planetKey: 'planetKetu', careersKey: 'ketuCareers', icon: Star, color: 'text-violet-400' },
];

/* ── 10th lord placement data ────────────────────────────────────── */
const LORD_PLACEMENTS: { house: string; meaningKey: string }[] = [
  { house: '1st', meaningKey: 'lord1st' },
  { house: '2nd', meaningKey: 'lord2nd' },
  { house: '3rd', meaningKey: 'lord3rd' },
  { house: '4th', meaningKey: 'lord4th' },
  { house: '5th', meaningKey: 'lord5th' },
  { house: '6th', meaningKey: 'lord6th' },
  { house: '7th', meaningKey: 'lord7th' },
  { house: '8th', meaningKey: 'lord8th' },
  { house: '9th', meaningKey: 'lord9th' },
  { house: '10th', meaningKey: 'lord10th' },
  { house: '11th', meaningKey: 'lord11th' },
  { house: '12th', meaningKey: 'lord12th' },
];

/* ── SVG House Wheel with 10th house highlighted ─────────────────── */
function CareerHouseWheel() {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const r = 110;
  return (
    <svg viewBox="-150 -150 300 300" className="w-full max-w-[320px] mx-auto">
      <defs>
        <radialGradient id="cw-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#d4a853" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
        <filter id="cw-blur"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      {/* background glow */}
      <circle cx="0" cy="0" r="140" fill="url(#cw-glow)" />
      {/* house segments */}
      {houses.map((h) => {
        const a1 = ((h - 1) * 30 - 90) * (Math.PI / 180);
        const a2 = (h * 30 - 90) * (Math.PI / 180);
        const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
        const x2 = Math.cos(a2) * r, y2 = Math.sin(a2) * r;
        const mid = ((h - 0.5) * 30 - 90) * (Math.PI / 180);
        const tx = Math.cos(mid) * (r * 0.7), ty = Math.sin(mid) * (r * 0.7);
        const is10 = h === 10;
        return (
          <g key={h}>
            <path
              d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
              fill={is10 ? 'rgba(212,168,83,0.2)' : 'rgba(255,255,255,0.03)'}
              stroke={is10 ? '#d4a853' : 'rgba(212,168,83,0.15)'}
              strokeWidth={is10 ? 2 : 0.5}
            />
            {is10 && <path d={`M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill="rgba(212,168,83,0.08)" filter="url(#cw-blur)" />}
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
              className={`${is10 ? 'fill-gold-light font-bold' : 'fill-text-tertiary'}`}
              fontSize={is10 ? 14 : 10}>{h}</text>
          </g>
        );
      })}
      {/* D10 overlay label */}
      <rect x="-30" y="-140" width="60" height="22" rx="6" fill="rgba(212,168,83,0.15)" stroke="#d4a853" strokeWidth="1" />
      <text x="0" y="-125" textAnchor="middle" className="fill-gold-light" fontSize="10" fontWeight="bold">D10</text>
      {/* center */}
      <circle cx="0" cy="0" r="18" fill="rgba(10,14,39,0.8)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
      <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" className="fill-gold-light" fontSize="8" fontWeight="bold">10H</text>
    </svg>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function CareerPredictionGuide() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);
  const [expandedPlanet, setExpandedPlanet] = useState<number | null>(null);

  /* Steps data */
  const STEPS: { step: number; titleKey: string; descKey: string; icon: typeof Briefcase; color: string }[] = [
    { step: 1, titleKey: 'step1Title', descKey: 'step1Desc', icon: Building2, color: 'text-amber-400' },
    { step: 2, titleKey: 'step2Title', descKey: 'step2Desc', icon: TrendingUp, color: 'text-emerald-400' },
    { step: 3, titleKey: 'step3Title', descKey: 'step3Desc', icon: Star, color: 'text-violet-400' },
    { step: 4, titleKey: 'step4Title', descKey: 'step4Desc', icon: Gem, color: 'text-cyan-400' },
    { step: 5, titleKey: 'step5Title', descKey: 'step5Desc', icon: Rocket, color: 'text-gold-light' },
  ];

  /* Timing data */
  const TIMING: { triggerKey: string; effectKey: string; color: string }[] = [
    { triggerKey: 'timing1Trigger', effectKey: 'timing1Effect', color: 'bg-amber-500/10 border-amber-500/20' },
    { triggerKey: 'timing2Trigger', effectKey: 'timing2Effect', color: 'bg-slate-500/10 border-slate-500/20' },
    { triggerKey: 'timing3Trigger', effectKey: 'timing3Effect', color: 'bg-yellow-500/10 border-yellow-500/20' },
    { triggerKey: 'timing4Trigger', effectKey: 'timing4Effect', color: 'bg-gold-primary/10 border-gold-primary/20' },
  ];

  /* Change indicators data */
  const CHANGES: { indKey: string; meanKey: string; color: string }[] = [
    { indKey: 'change1Ind', meanKey: 'change1Mean', color: 'text-cyan-400' },
    { indKey: 'change2Ind', meanKey: 'change2Mean', color: 'text-violet-400' },
    { indKey: 'change3Ind', meanKey: 'change3Mean', color: 'text-amber-400' },
    { indKey: 'change4Ind', meanKey: 'change4Mean', color: 'text-indigo-400' },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium mb-4">
          <Briefcase className="w-3.5 h-3.5" />
          {t('practicalGuide', locale)}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>{t('title', locale)}</h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">{t('subtitle', locale)}</p>
      </motion.div>

      {/* SVG Wheel */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-12">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 flex flex-col items-center">
          <CareerHouseWheel />
          <p className="text-text-tertiary text-xs mt-3 text-center">
            {t('wheelCaption', locale)}
          </p>
        </div>
      </motion.div>

      {/* Section 1: 5-Step Career Analysis */}
      <LessonSection number={1} title={t('sec1Title', locale)} variant="highlight">
        <div className="space-y-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="flex gap-4 items-start p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold-dark text-xs font-bold uppercase tracking-wider">{t('step', locale)} {s.step}</span>
                    <h3 className="text-gold-light font-bold text-base" style={hf}>{t(s.titleKey, locale)}</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{t(s.descKey, locale)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section: 10th House Sign Career Table */}
      <LessonSection number={2} title={t('sec2Title', locale)}>
        <p className="text-text-secondary text-sm mb-5">
          {t('sec2Intro', locale)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SIGN_CAREERS.map((s, i) => (
            <div key={i} className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/20 transition-colors">
              <div className={`font-bold text-sm mb-1 ${s.color}`} style={hf}>{t(s.signKey, locale)}</div>
              <div className="text-text-secondary text-xs mb-1">{t(s.natureKey, locale)}</div>
              <div className="text-text-tertiary text-xs">{t(s.fieldsKey, locale)}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section: Planets in 10th House */}
      <LessonSection number={3} title={t('sec3Title', locale)}>
        <p className="text-text-secondary text-sm mb-5">
          {t('sec3Intro', locale)}
        </p>
        <div className="space-y-2">
          {PLANET_10TH.map((p, i) => {
            const Icon = p.icon;
            const isOpen = expandedPlanet === i;
            return (
              <div key={i} className="rounded-xl border border-gold-primary/10 overflow-hidden">
                <button onClick={() => setExpandedPlanet(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${p.color}`} />
                    <span className="text-gold-light font-bold text-sm" style={hf}>{t(p.planetKey, locale)}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-1">
                        <p className="text-text-secondary text-sm leading-relaxed">{t(p.careersKey, locale)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section: 10th Lord Placement */}
      <LessonSection number={4} title={t('sec4Title', locale)}>
        <p className="text-text-secondary text-sm mb-5">
          {t('sec4Intro', locale)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {LORD_PLACEMENTS.map((lp) => (
            <div key={lp.house} className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
              <span className="text-gold-light font-bold text-xs">{lp.house} {t('house', locale)}</span>
              <p className="text-text-secondary text-xs mt-1 leading-relaxed">{t(lp.meaningKey, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section: Timing Career Events */}
      <LessonSection number={5} title={t('sec5Title', locale)} variant="highlight">
        <div className="space-y-4">
          {TIMING.map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t(item.triggerKey, locale)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{t(item.effectKey, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section: Career Change Indicators */}
      <LessonSection number={6} title={t('sec6Title', locale)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHANGES.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
              <h4 className={`font-bold text-sm mb-2 ${item.color}`} style={hf}>{t(item.indKey, locale)}</h4>
              <p className="text-text-secondary text-xs leading-relaxed">{t(item.meanKey, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Cross-references */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>{t('relatedTopics', locale)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            { href: '/kundali' as const, labelKey: 'linkKundali' },
            { href: '/learn/planet-in-house' as const, labelKey: 'linkPlanetHouse' },
            { href: '/learn/planets' as const, labelKey: 'linkPlanets' },
            { href: '/learn/dashas' as const, labelKey: 'linkDashas' },
          ]).map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/25 transition-colors group">
              <Zap className="w-4 h-4 text-gold-dark group-hover:text-gold-light transition-colors" />
              <span className="text-text-secondary text-sm group-hover:text-gold-light transition-colors">{t(link.labelKey, locale)}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
