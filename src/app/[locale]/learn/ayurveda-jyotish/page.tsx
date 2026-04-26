'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, ChevronDown, BookOpen, Heart, Flame, Droplets,
  Wind, Clock, Pill, Sparkles, FlaskConical, AlertTriangle,
} from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/ayurveda-jyotish.json';
import { getHeadingFont } from '@/lib/utils/locale-fonts';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

/* ── Dosha color tokens ──────────────────────────────────────────── */
const DOSHA_COLORS = {
  vata:  { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
  pitta: { bg: 'from-red-500/20 to-amber-500/20', border: 'border-red-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  kapha: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  tri:   { bg: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/20', text: 'text-violet-400', dot: 'bg-violet-400' },
} as const;

/* ── Planet-Dosha mapping table data ─────────────────────────────── */
const PLANET_DOSHA_MAP: { planetKey: string; doshaKey: string; elementKey: string; sigKey: string; dosha: keyof typeof DOSHA_COLORS; color: string }[] = [
  { planetKey: 'saturn', doshaKey: 'saturnDosha', elementKey: 'saturnElement', sigKey: 'saturnSig', dosha: 'vata', color: 'text-slate-400' },
  { planetKey: 'rahu', doshaKey: 'rahuDosha', elementKey: 'rahuElement', sigKey: 'rahuSig', dosha: 'vata', color: 'text-cyan-400' },
  { planetKey: 'sun', doshaKey: 'sunDosha', elementKey: 'sunElement', sigKey: 'sunSig', dosha: 'pitta', color: 'text-amber-400' },
  { planetKey: 'mars', doshaKey: 'marsDosha', elementKey: 'marsElement', sigKey: 'marsSig', dosha: 'pitta', color: 'text-red-400' },
  { planetKey: 'ketu', doshaKey: 'ketuDosha', elementKey: 'ketuElement', sigKey: 'ketuSig', dosha: 'pitta', color: 'text-violet-400' },
  { planetKey: 'moon', doshaKey: 'moonDosha', elementKey: 'moonElement', sigKey: 'moonSig', dosha: 'kapha', color: 'text-blue-300' },
  { planetKey: 'jupiter', doshaKey: 'jupiterDosha', elementKey: 'jupiterElement', sigKey: 'jupiterSig', dosha: 'kapha', color: 'text-yellow-400' },
  { planetKey: 'venus', doshaKey: 'venusDosha', elementKey: 'venusElement', sigKey: 'venusSig', dosha: 'kapha', color: 'text-pink-400' },
  { planetKey: 'mercury', doshaKey: 'mercuryDosha', elementKey: 'mercuryElement', sigKey: 'mercurySig', dosha: 'tri', color: 'text-emerald-400' },
];

/* ── Kala Purusha body map data ──────────────────────────────────── */
const KALA_PURUSHA: { houseNum: number; signKey: string; bodyKey: string; color: string }[] = [
  { houseNum: 1, signKey: 'house1Sign', bodyKey: 'house1Body', color: '#ef4444' },
  { houseNum: 2, signKey: 'house2Sign', bodyKey: 'house2Body', color: '#22c55e' },
  { houseNum: 3, signKey: 'house3Sign', bodyKey: 'house3Body', color: '#eab308' },
  { houseNum: 4, signKey: 'house4Sign', bodyKey: 'house4Body', color: '#94a3b8' },
  { houseNum: 5, signKey: 'house5Sign', bodyKey: 'house5Body', color: '#d4a853' },
  { houseNum: 6, signKey: 'house6Sign', bodyKey: 'house6Body', color: '#4ade80' },
  { houseNum: 7, signKey: 'house7Sign', bodyKey: 'house7Body', color: '#f472b6' },
  { houseNum: 8, signKey: 'house8Sign', bodyKey: 'house8Body', color: '#b91c1c' },
  { houseNum: 9, signKey: 'house9Sign', bodyKey: 'house9Body', color: '#a855f7' },
  { houseNum: 10, signKey: 'house10Sign', bodyKey: 'house10Body', color: '#78716c' },
  { houseNum: 11, signKey: 'house11Sign', bodyKey: 'house11Body', color: '#3b82f6' },
  { houseNum: 12, signKey: 'house12Sign', bodyKey: 'house12Body', color: '#2dd4bf' },
];

/* ── Dasha health timeline data ──────────────────────────────────── */
const DASHA_TIMELINE: { dashaKey: string; descKey: string; years: number; dosha: keyof typeof DOSHA_COLORS; icon: typeof Flame }[] = [
  { dashaKey: 'saturnDasha', descKey: 'saturnDashaDesc', years: 19, dosha: 'vata', icon: Wind },
  { dashaKey: 'marsDasha', descKey: 'marsDashaDesc', years: 7, dosha: 'pitta', icon: Flame },
  { dashaKey: 'moonDasha', descKey: 'moonDashaDesc', years: 10, dosha: 'kapha', icon: Droplets },
  { dashaKey: 'jupiterDasha', descKey: 'jupiterDashaDesc', years: 16, dosha: 'kapha', icon: Droplets },
  { dashaKey: 'venusRahuDasha', descKey: 'venusRahuDashaDesc', years: 45, dosha: 'tri', icon: Sparkles },
];

/* ── Ritu (Season) data ──────────────────────────────────────────── */
const RITUS: { nameKey: string; monthsKey: string; gregKey: string; doshaKey: string; dosha: keyof typeof DOSHA_COLORS }[] = [
  { nameKey: 'vasanta', monthsKey: 'vasantaMonths', gregKey: 'vasantaGreg', doshaKey: 'vasantaDosha', dosha: 'kapha' },
  { nameKey: 'grishma', monthsKey: 'grishmaMonths', gregKey: 'grishmaGreg', doshaKey: 'grishmaDosha', dosha: 'vata' },
  { nameKey: 'varsha', monthsKey: 'varshaMonths', gregKey: 'varshaGreg', doshaKey: 'varshaDosha', dosha: 'vata' },
  { nameKey: 'sharad', monthsKey: 'sharadMonths', gregKey: 'sharadGreg', doshaKey: 'sharadDosha', dosha: 'pitta' },
  { nameKey: 'hemanta', monthsKey: 'hemantaMonths', gregKey: 'hemantaGreg', doshaKey: 'hemantaDosha', dosha: 'kapha' },
  { nameKey: 'shishira', monthsKey: 'shishiraMonths', gregKey: 'shishiraGreg', doshaKey: 'shishiraDosha', dosha: 'kapha' },
];

/* ── Classical texts data ────────────────────────────────────────── */
const CLASSICAL_TEXTS: { nameKey: string; descKey: string; icon: typeof BookOpen }[] = [
  { nameKey: 'charaka', descKey: 'charakaDesc', icon: BookOpen },
  { nameKey: 'sushruta', descKey: 'sushrutaDesc', icon: FlaskConical },
  { nameKey: 'bphs', descKey: 'bphsDesc', icon: BookOpen },
  { nameKey: 'ashtanga', descKey: 'ashtangaDesc', icon: Pill },
];

/* ── SVG Kala Purusha Diagram ────────────────────────────────────── */
function KalaPurushaDiagram({ locale }: { locale: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  // Body segment positions (approximate vertical zones from head to feet)
  const ZONES = [
    { y: 0, h: 36 },   // 1: Head
    { y: 36, h: 30 },  // 2: Face/Throat
    { y: 66, h: 34 },  // 3: Arms/Shoulders
    { y: 100, h: 34 }, // 4: Chest
    { y: 134, h: 32 }, // 5: Upper Back
    { y: 166, h: 30 }, // 6: Intestines
    { y: 196, h: 30 }, // 7: Kidneys
    { y: 226, h: 30 }, // 8: Reproductive
    { y: 256, h: 34 }, // 9: Hips/Thighs
    { y: 290, h: 32 }, // 10: Knees
    { y: 322, h: 32 }, // 11: Calves
    { y: 354, h: 30 }, // 12: Feet
  ];

  return (
    <div className="relative w-full max-w-[700px] mx-auto">
      <svg viewBox="0 0 700 414" className="w-full">
        <defs>
          <linearGradient id="kp-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a853" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#d4a853" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Body silhouette */}
        <ellipse cx="350" cy="20" rx="28" ry="20" fill="none" stroke="rgba(212,168,83,0.18)" strokeWidth="1" />
        <line x1="350" y1="40" x2="350" y2="240" stroke="rgba(212,168,83,0.12)" strokeWidth="1.5" />
        <line x1="350" y1="75" x2="280" y2="150" stroke="rgba(212,168,83,0.1)" strokeWidth="1" />
        <line x1="350" y1="75" x2="420" y2="150" stroke="rgba(212,168,83,0.1)" strokeWidth="1" />
        <line x1="350" y1="240" x2="310" y2="380" stroke="rgba(212,168,83,0.1)" strokeWidth="1" />
        <line x1="350" y1="240" x2="390" y2="380" stroke="rgba(212,168,83,0.1)" strokeWidth="1" />

        {ZONES.map((z, i) => {
          const item = KALA_PURUSHA[i];
          const isActive = hovered === i;
          const barY = z.y + 4;
          const barH = z.h - 4;
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Left label */}
              <rect x="0" y={barY} width="210" height={barH} rx="5"
                fill={isActive ? item.color : 'transparent'}
                fillOpacity={isActive ? 0.12 : 0}
                stroke={item.color} strokeWidth={isActive ? 1.5 : 0.4} strokeOpacity={isActive ? 0.8 : 0.2}
              />
              <text x="8" y={barY + barH / 2} dominantBaseline="middle"
                fill={item.color} fontSize="10" fontWeight="bold" opacity={isActive ? 1 : 0.65}>
                {item.houseNum}. {t(item.signKey, locale)}
              </text>
              <text x="206" y={barY + barH / 2} dominantBaseline="middle" textAnchor="end"
                fill="rgba(255,255,255,0.45)" fontSize="8.5" opacity={isActive ? 1 : 0.5}>
                {t(item.bodyKey, locale).split(',').slice(0, 2).join(',')}
              </text>
              {/* Connector */}
              <line x1="210" y1={barY + barH / 2} x2="320" y2={barY + barH / 2}
                stroke={item.color} strokeWidth={isActive ? 0.8 : 0.25} strokeOpacity={isActive ? 0.5 : 0.12}
                strokeDasharray={isActive ? '0' : '4 4'}
              />
              {/* Body zone dot */}
              <rect x="320" y={barY + 2} width="60" height={barH - 4} rx="4"
                fill={item.color} fillOpacity={isActive ? 0.2 : 0.05}
                stroke={item.color} strokeWidth={isActive ? 1 : 0} strokeOpacity={0.4}
              />
              {/* Right connector */}
              <line x1="380" y1={barY + barH / 2} x2="490" y2={barY + barH / 2}
                stroke={item.color} strokeWidth={isActive ? 0.8 : 0.25} strokeOpacity={isActive ? 0.5 : 0.12}
                strokeDasharray={isActive ? '0' : '4 4'}
              />
              {/* House number circle */}
              <circle cx="510" cy={barY + barH / 2} r="11"
                fill={isActive ? item.color : 'transparent'} fillOpacity={isActive ? 0.18 : 0}
                stroke={item.color} strokeWidth={isActive ? 1.5 : 0.4} strokeOpacity={isActive ? 0.8 : 0.25}
              />
              <text x="510" y={barY + barH / 2} textAnchor="middle" dominantBaseline="middle"
                fill={item.color} fontSize="9.5" fontWeight="bold" opacity={isActive ? 1 : 0.55}>
                {item.houseNum}
              </text>
            </g>
          );
        })}
        <text x="350" y="406" textAnchor="middle" fill="rgba(212,168,83,0.4)" fontSize="9" fontStyle="italic">
          Kala Purusha — Aries (Head) to Pisces (Feet)
        </text>
      </svg>
    </div>
  );
}

/* ── Dasha Health Timeline SVG ───────────────────────────────────── */
function DashaTimeline({ locale }: { locale: string }) {
  const hf = getHeadingFont(locale);
  const total = 120; // Total Vimshottari cycle years
  const dashas = [
    { key: 'sun', label: 'Su', years: 6, dosha: 'pitta' as const },
    { key: 'moon', label: 'Mo', years: 10, dosha: 'kapha' as const },
    { key: 'mars', label: 'Ma', years: 7, dosha: 'pitta' as const },
    { key: 'rahu', label: 'Ra', years: 18, dosha: 'vata' as const },
    { key: 'jupiter', label: 'Ju', years: 16, dosha: 'kapha' as const },
    { key: 'saturn', label: 'Sa', years: 19, dosha: 'vata' as const },
    { key: 'mercury', label: 'Me', years: 17, dosha: 'tri' as const },
    { key: 'ketu', label: 'Ke', years: 7, dosha: 'pitta' as const },
    { key: 'venus', label: 'Ve', years: 20, dosha: 'kapha' as const },
  ];

  let xOffset = 0;
  const barHeight = 36;
  const width = 680;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${barHeight + 50}`} className="w-full min-w-[500px]">
        {dashas.map((d) => {
          const w = (d.years / total) * width;
          const x = xOffset;
          xOffset += w;
          const colors = DOSHA_COLORS[d.dosha];
          const fillColor = d.dosha === 'vata' ? '#3b82f6' : d.dosha === 'pitta' ? '#f59e0b' : d.dosha === 'kapha' ? '#22c55e' : '#8b5cf6';
          return (
            <g key={d.key}>
              <rect x={x} y={0} width={w} height={barHeight} rx="3"
                fill={fillColor} fillOpacity={0.2}
                stroke={fillColor} strokeWidth={0.5} strokeOpacity={0.4}
              />
              <text x={x + w / 2} y={barHeight / 2 - 2} textAnchor="middle" dominantBaseline="middle"
                fill={fillColor} fontSize="10" fontWeight="bold">
                {d.label}
              </text>
              <text x={x + w / 2} y={barHeight / 2 + 10} textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.4)" fontSize="8">
                {d.years}y
              </text>
              <text x={x + w / 2} y={barHeight + 16} textAnchor="middle"
                fill="rgba(255,255,255,0.35)" fontSize="7.5">
                {d.dosha === 'tri' ? 'Tri' : d.dosha.charAt(0).toUpperCase() + d.dosha.slice(1)}
              </text>
            </g>
          );
        })}
        {/* Legend */}
        {(['vata', 'pitta', 'kapha'] as const).map((d, i) => {
          const fillColor = d === 'vata' ? '#3b82f6' : d === 'pitta' ? '#f59e0b' : '#22c55e';
          return (
            <g key={d} transform={`translate(${width / 2 - 100 + i * 75}, ${barHeight + 32})`}>
              <rect x="0" y="0" width="10" height="10" rx="2" fill={fillColor} fillOpacity={0.4} />
              <text x="14" y="9" fill="rgba(255,255,255,0.5)" fontSize="9">{d.charAt(0).toUpperCase() + d.slice(1)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Ritu Dosha Wheel SVG ────────────────────────────────────────── */
function RituWheel({ locale }: { locale: string }) {
  const cx = 150, cy = 150, r = 120;
  const segments = RITUS.length;

  return (
    <div className="w-full max-w-[340px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full">
        {RITUS.map((ritu, i) => {
          const angle1 = (i / segments) * 2 * Math.PI - Math.PI / 2;
          const angle2 = ((i + 1) / segments) * 2 * Math.PI - Math.PI / 2;
          const midAngle = (angle1 + angle2) / 2;
          const x1 = cx + r * Math.cos(angle1);
          const y1 = cy + r * Math.sin(angle1);
          const x2 = cx + r * Math.cos(angle2);
          const y2 = cy + r * Math.sin(angle2);
          const tx = cx + (r * 0.65) * Math.cos(midAngle);
          const ty = cy + (r * 0.65) * Math.sin(midAngle);
          const fillColor = ritu.dosha === 'vata' ? '#3b82f6' : ritu.dosha === 'pitta' ? '#f59e0b' : '#22c55e';

          return (
            <g key={i}>
              <path
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                fill={fillColor} fillOpacity={0.15}
                stroke={fillColor} strokeWidth={0.8} strokeOpacity={0.3}
              />
              <text x={tx} y={ty - 4} textAnchor="middle" dominantBaseline="middle"
                fill={fillColor} fontSize="9" fontWeight="bold">
                {t(ritu.nameKey, locale).split(' ')[0]}
              </text>
              <text x={tx} y={ty + 8} textAnchor="middle" dominantBaseline="middle"
                fill="rgba(255,255,255,0.4)" fontSize="7">
                {t(ritu.gregKey, locale)}
              </text>
            </g>
          );
        })}
        {/* Center label */}
        <circle cx={cx} cy={cy} r="28" fill="rgba(10,14,39,0.8)" stroke="rgba(212,168,83,0.2)" strokeWidth="1" />
        <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(212,168,83,0.7)" fontSize="8" fontWeight="bold">
          Ritu
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(212,168,83,0.4)" fontSize="7">
          Dosha
        </text>
      </svg>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function AyurvedaJyotishPage() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);
  const [expandedDasha, setExpandedDasha] = useState<number | null>(null);
  const [expandedText, setExpandedText] = useState<number | null>(null);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium mb-4">
          <Leaf className="w-3.5 h-3.5" />
          {t('badge', locale)}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>
          {t('title', locale)}
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">
          {t('subtitle', locale)}
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="mb-10 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-text-tertiary text-xs leading-relaxed">{t('disclaimer', locale)}</p>
      </motion.div>

      {/* Section 1: Two Sister Sciences */}
      <LessonSection number={1} title={t('sec1Title', locale)} variant="highlight">
        <div className="space-y-4">
          <p>{t('sec1P1', locale)}</p>
          <p>{t('sec1P2', locale)}</p>
          <p className="text-gold-dark italic">{t('sec1P3', locale)}</p>
        </div>
      </LessonSection>

      {/* Section 2: Prakriti from Birth Chart */}
      <LessonSection number={2} title={t('sec2Title', locale)}>
        <p className="mb-5">{t('sec2Intro', locale)}</p>

        {/* Planet-Dosha Mapping Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs" style={hf}>{t('thPlanet', locale)}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs" style={hf}>{t('thDosha', locale)}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs" style={hf}>{t('thElement', locale)}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs hidden sm:table-cell" style={hf}>{t('thSignature', locale)}</th>
              </tr>
            </thead>
            <tbody>
              {PLANET_DOSHA_MAP.map((p, i) => {
                const dc = DOSHA_COLORS[p.dosha];
                return (
                  <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                    <td className={`py-2.5 px-3 font-bold text-sm ${p.color}`} style={hf}>{t(p.planetKey, locale)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${dc.text}`}>
                        <span className={`w-2 h-2 rounded-full ${dc.dot}`} />
                        {t(p.doshaKey, locale)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-text-tertiary text-xs">{t(p.elementKey, locale)}</td>
                    <td className="py-2.5 px-3 text-text-tertiary text-xs hidden sm:table-cell">{t(p.sigKey, locale)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Prakriti Determination Steps */}
        <h4 className="text-gold-light font-bold text-base mb-4" style={hf}>{t('sec2Step', locale)}</h4>
        <div className="space-y-3 mb-6">
          {(['step1', 'step2', 'step3', 'step4'] as const).map((stepKey, i) => (
            <div key={stepKey} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-7 h-7 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <h5 className="text-gold-light font-bold text-sm" style={hf}>{t(stepKey, locale)}</h5>
              </div>
              <p className="text-text-secondary text-sm ml-10">{t(`${stepKey}Desc`, locale)}</p>
            </div>
          ))}
        </div>

        {/* Worked Example */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/15">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h5 className="text-emerald-400 font-bold text-sm" style={hf}>{t('exampleTitle', locale)}</h5>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{t('exampleText', locale)}</p>
        </div>
      </LessonSection>

      {/* Section 3: Kala Purusha Body Map */}
      <LessonSection number={3} title={t('sec3Title', locale)}>
        <p className="mb-5">{t('sec3Intro', locale)}</p>

        {/* SVG Kala Purusha Diagram */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="mb-8">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
            <KalaPurushaDiagram locale={locale} />
          </div>
        </motion.div>

        {/* Planetary Anatomical Rulerships */}
        <h4 className="text-gold-light font-bold text-base mb-3" style={hf}>{t('planetRulerships', locale)}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(['sunAnatomy', 'moonAnatomy', 'marsAnatomy', 'mercuryAnatomy', 'jupiterAnatomy', 'venusAnatomy', 'saturnAnatomy'] as const).map((key) => (
            <div key={key} className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/6">
              <p className="text-text-secondary text-xs leading-relaxed">{t(key, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Disease Prediction */}
      <LessonSection number={4} title={t('sec4Title', locale)} variant="formula">
        <p className="mb-4">{t('sec4Intro', locale)}</p>

        <div className="space-y-3 mb-5">
          {(['house6Role', 'house8Role', 'house12Role'] as const).map((key, i) => {
            const icons = [Heart, Flame, Pill];
            const colors = ['text-amber-400', 'text-red-400', 'text-violet-400'];
            const Icon = icons[i];
            return (
              <div key={key} className="flex gap-3 items-start p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gold-primary/10 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${colors[i]}`} />
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{t(key, locale)}</p>
              </div>
            );
          })}
        </div>

        <p className="mb-3">{t('sec4Lords', locale)}</p>
        <p className="text-gold-dark italic text-sm">{t('sec4Dasha', locale)}</p>
      </LessonSection>

      {/* Section 5: Dasha Periods & Health Windows */}
      <LessonSection number={5} title={t('sec5Title', locale)}>
        <p className="mb-5">{t('sec5Intro', locale)}</p>

        {/* Dasha Timeline Diagram */}
        <div className="mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
          <DashaTimeline locale={locale} />
          <p className="text-text-tertiary text-xs mt-3 text-center italic">
            120-year Vimshottari Dasha cycle — each period activates its planetary dosha
          </p>
        </div>

        {/* Expandable dasha cards */}
        <div className="space-y-2">
          {DASHA_TIMELINE.map((d, i) => {
            const dc = DOSHA_COLORS[d.dosha];
            const Icon = d.icon;
            const isOpen = expandedDasha === i;
            return (
              <motion.div key={i} layout className={`rounded-xl bg-gradient-to-br ${dc.bg} border ${dc.border} overflow-hidden`}>
                <button onClick={() => setExpandedDasha(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${dc.text}`} />
                    <span className={`font-bold text-sm ${dc.text}`} style={hf}>{t(d.dashaKey, locale)}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gold-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4">
                        <p className="text-text-secondary text-sm leading-relaxed">{t(d.descKey, locale)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 6: Ritu & Dosha */}
      <LessonSection number={6} title={t('sec6Title', locale)} variant="highlight">
        <p className="mb-5">{t('sec6Intro', locale)}</p>

        {/* Ritu Wheel Diagram */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
            <RituWheel locale={locale} />
          </div>
        </div>

        {/* Ritu Table */}
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs" style={hf}>{t('rituCol', locale)}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs" style={hf}>{t('monthsCol', locale)}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs hidden sm:table-cell" style={hf}>{t('gregCol', locale)}</th>
                <th className="text-left py-2 px-3 text-gold-light font-bold text-xs" style={hf}>{t('doshaAction', locale)}</th>
              </tr>
            </thead>
            <tbody>
              {RITUS.map((ritu, i) => {
                const dc = DOSHA_COLORS[ritu.dosha];
                return (
                  <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                    <td className={`py-2.5 px-3 font-bold text-sm ${dc.text}`} style={hf}>{t(ritu.nameKey, locale)}</td>
                    <td className="py-2.5 px-3 text-text-secondary text-xs">{t(ritu.monthsKey, locale)}</td>
                    <td className="py-2.5 px-3 text-text-tertiary text-xs hidden sm:table-cell">{t(ritu.gregKey, locale)}</td>
                    <td className="py-2.5 px-3 text-text-tertiary text-xs">{t(ritu.doshaKey, locale)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dinacharya */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gold-light" />
            <h5 className="text-gold-light font-bold text-sm" style={hf}>{t('dinacharya', locale)}</h5>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{t('dinacharyaDesc', locale)}</p>
        </div>
      </LessonSection>

      {/* Section 7: Remedial Integration */}
      <LessonSection number={7} title={t('sec7Title', locale)}>
        <p className="mb-5">{t('sec7Intro', locale)}</p>

        {/* Gems */}
        <h4 className="text-gold-light font-bold text-sm mb-3" style={hf}>{t('gemsTitle', locale)}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {(['gemSun', 'gemMoon', 'gemMars', 'gemJupiter'] as const).map((key) => (
            <div key={key} className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
              <p className="text-text-secondary text-xs leading-relaxed">{t(key, locale)}</p>
            </div>
          ))}
        </div>

        {/* Herbs */}
        <h4 className="text-gold-light font-bold text-sm mb-3" style={hf}>{t('herbsTitle', locale)}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {(['herbSaturn', 'herbMoon', 'herbMars', 'herbSun', 'herbJupiter'] as const).map((key) => (
            <div key={key} className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/8 to-green-500/8 border border-emerald-500/10">
              <Leaf className="w-3.5 h-3.5 text-emerald-400 inline mr-1.5 -mt-0.5" />
              <span className="text-text-secondary text-xs leading-relaxed">{t(key, locale)}</span>
            </div>
          ))}
        </div>

        {/* Fasting */}
        <h4 className="text-gold-light font-bold text-sm mb-3" style={hf}>{t('fastingTitle', locale)}</h4>
        <div className="space-y-2 mb-5">
          {(['fastMonday', 'fastTuesday', 'fastSaturday', 'fastThursday'] as const).map((key) => (
            <div key={key} className="p-3 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/6">
              <p className="text-text-secondary text-xs leading-relaxed">{t(key, locale)}</p>
            </div>
          ))}
        </div>

        {/* Yoga */}
        <h4 className="text-gold-light font-bold text-sm mb-3" style={hf}>{t('yogaTitle', locale)}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(['yogaSun', 'yogaMoon', 'yogaSaturn', 'yogaMars'] as const).map((key) => (
            <div key={key} className="p-3 rounded-lg bg-gradient-to-br from-violet-500/8 to-purple-500/8 border border-violet-500/10">
              <p className="text-text-secondary text-xs leading-relaxed">{t(key, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 8: Classical Text Cross-References */}
      <LessonSection number={8} title={t('sec8Title', locale)} variant="formula">
        <div className="space-y-3">
          {CLASSICAL_TEXTS.map((ct, i) => {
            const Icon = ct.icon;
            const isOpen = expandedText === i;
            return (
              <motion.div key={i} layout className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10 overflow-hidden">
                <button onClick={() => setExpandedText(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gold-light" />
                    <span className="text-gold-light font-bold text-sm" style={hf}>{t(ct.nameKey, locale)}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gold-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4">
                        <p className="text-text-secondary text-sm leading-relaxed">{t(ct.descKey, locale)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 9: Modern Scientific Parallels */}
      <LessonSection number={9} title={t('sec9Title', locale)}>
        <div className="space-y-4">
          {(['chronobiology', 'circadian', 'psychoneuro'] as const).map((key) => (
            <div key={key} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
              <h5 className="text-gold-light font-bold text-sm mb-2" style={hf}>{t(key, locale)}</h5>
              <p className="text-text-secondary text-sm leading-relaxed">{t(`${key}Desc`, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Navigation links */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          { href: '/kundali' as const, labelKey: 'navKundali' },
          { href: '/medical-astrology' as const, labelKey: 'navHealth' },
          { href: '/learn/health' as const, labelKey: 'navLearnHealth' },
          { href: '/learn/hora' as const, labelKey: 'navHora' },
        ].map((link) => (
          <Link key={link.href} href={link.href}
            className="px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium hover:bg-gold-primary/20 transition-colors">
            {t(link.labelKey, locale)}
          </Link>
        ))}
      </motion.div>
    </main>
  );
}
