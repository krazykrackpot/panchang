'use client';

import { useState, useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { MASA_NAMES, RITU_NAMES } from '@/lib/ephem/astronomical';
import { computeHinduMonths, computePurnimantMonths, formatMonthDate } from '@/lib/calendar/hindu-months';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { MasaIcon } from '@/components/icons/PanchangIcons';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import AuthorByline from '@/components/ui/AuthorByline';

const MASA_DETAILS: { gregApprox: string; nakshatraLink: string }[] = [
  { gregApprox: 'Mar-Apr', nakshatraLink: 'Chitra' },
  { gregApprox: 'Apr-May', nakshatraLink: 'Vishakha' },
  { gregApprox: 'May-Jun', nakshatraLink: 'Jyeshtha' },
  { gregApprox: 'Jun-Jul', nakshatraLink: 'Purva Ashadha' },
  { gregApprox: 'Jul-Aug', nakshatraLink: 'Shravana' },
  { gregApprox: 'Aug-Sep', nakshatraLink: 'Purva Bhadrapada' },
  { gregApprox: 'Sep-Oct', nakshatraLink: 'Ashwini' },
  { gregApprox: 'Oct-Nov', nakshatraLink: 'Krittika' },
  { gregApprox: 'Nov-Dec', nakshatraLink: 'Mrigashira' },
  { gregApprox: 'Dec-Jan', nakshatraLink: 'Pushya' },
  { gregApprox: 'Jan-Feb', nakshatraLink: 'Magha' },
  { gregApprox: 'Feb-Mar', nakshatraLink: 'Purva Phalguni' },
];

const rituColors = ['#4ade80', '#f97316', '#3b82f6', '#eab308', '#a78bfa', '#60a5fa'];

/* ------------------------------------------------------------------ */
/*  Annual Cycle — bold 12-segment wheel with season bands             */
/* ------------------------------------------------------------------ */

const RITU_COLORS = ['#4ade80', '#4ade80', '#f97316', '#f97316', '#3b82f6', '#3b82f6', '#eab308', '#eab308', '#a78bfa', '#a78bfa', '#60a5fa', '#60a5fa'];
const RITU_BG = ['rgba(74,222,128,0.08)', 'rgba(74,222,128,0.08)', 'rgba(249,115,22,0.08)', 'rgba(249,115,22,0.08)', 'rgba(59,130,246,0.08)', 'rgba(59,130,246,0.08)', 'rgba(234,179,8,0.08)', 'rgba(234,179,8,0.08)', 'rgba(167,139,250,0.08)', 'rgba(167,139,250,0.08)', 'rgba(96,165,250,0.08)', 'rgba(96,165,250,0.08)'];

function AnimatedAnnualWheel({ locale }: { locale: Locale }) {
  const CX = 300;
  const CY = 300;
  const R_OUTER = 260;
  const R_INNER = 140;
  const R_MID = (R_OUTER + R_INNER) / 2;
  const R_RITU = 120;

  function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  function segmentPath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number): string {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    const ox1 = cx + rOuter * Math.cos(toRad(startDeg));
    const oy1 = cy + rOuter * Math.sin(toRad(startDeg));
    const ox2 = cx + rOuter * Math.cos(toRad(endDeg));
    const oy2 = cy + rOuter * Math.sin(toRad(endDeg));
    const ix1 = cx + rInner * Math.cos(toRad(endDeg));
    const iy1 = cy + rInner * Math.sin(toRad(endDeg));
    const ix2 = cx + rInner * Math.cos(toRad(startDeg));
    const iy2 = cy + rInner * Math.sin(toRad(startDeg));
    return `M ${ox1} ${oy1} A ${rOuter} ${rOuter} 0 0 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${rInner} ${rInner} 0 0 0 ${ix2} ${iy2} Z`;
  }

  return (
    <motion.svg
      viewBox="0 0 600 600"
      className="w-full max-w-xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <defs>
        <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#f0d48a" stopOpacity="0" />
        </radialGradient>
        <filter id="goldGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d48a" /><stop offset="50%" stopColor="#d4a853" /><stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <circle cx={CX} cy={CY} r={R_OUTER + 20} fill="url(#wheelGlow)" />

      {/* 12 month segments — bold filled wedges */}
      {MASA_NAMES.map((masa, i) => {
        const startDeg = i * 30;
        const endDeg = (i + 1) * 30;
        const midRad = ((startDeg + endDeg) / 2 - 90) * Math.PI / 180;
        const textR = R_MID;
        const textX = CX + textR * Math.cos(midRad);
        const textY = CY + textR * Math.sin(midRad);
        const rotDeg = (startDeg + endDeg) / 2;
        // Flip text for bottom half so it reads left-to-right
        const flip = rotDeg > 90 && rotDeg < 270;

        return (
          <g key={`seg-${i}`}>
            {/* Filled segment */}
            <motion.path
              d={segmentPath(CX, CY, R_OUTER, R_INNER, startDeg, endDeg)}
              fill={RITU_BG[i]}
              stroke={RITU_COLORS[i]}
              strokeWidth="1.5"
              strokeOpacity="0.3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
              className="hover:brightness-150 transition-all cursor-default"
            />
            {/* Month name — bold, readable */}
            <motion.text
              x={textX}
              y={textY}
              fill="#f0d48a"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${flip ? rotDeg + 180 : rotDeg}, ${textX}, ${textY})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
            >
              {tl(masa, locale)}
            </motion.text>
          </g>
        );
      })}

      {/* 6 Ritu labels — inside the inner circle */}
      {RITU_NAMES.map((ritu, i) => {
        const midDeg = i * 60 + 30;
        const midRad = (midDeg - 90) * Math.PI / 180;
        const textX = CX + R_RITU * Math.cos(midRad);
        const textY = CY + R_RITU * Math.sin(midRad);
        const flip = midDeg > 90 && midDeg < 270;

        return (
          <motion.text
            key={`ritu-${i}`}
            x={textX}
            y={textY}
            fill={rituColors[i]}
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            opacity="0.7"
            transform={`rotate(${flip ? midDeg + 180 : midDeg}, ${textX}, ${textY})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
          >
            {tl(ritu, locale)}
          </motion.text>
        );
      })}

      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="url(#goldGrad)" strokeWidth="2" opacity="0.4" />
      {/* Inner ring */}
      <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.3" />

      {/* Center — golden moon+sun symbol */}
      <circle cx={CX} cy={CY} r="45" fill="#0a0e27" stroke="url(#goldGrad)" strokeWidth="2" />
      {/* Sun */}
      <circle cx={CX - 8} cy={CY - 4} r="14" fill="none" stroke="#d4a853" strokeWidth="1.5" opacity="0.7" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45) * Math.PI / 180;
        return <line key={i} x1={CX - 8 + 16 * Math.cos(a)} y1={CY - 4 + 16 * Math.sin(a)} x2={CX - 8 + 20 * Math.cos(a)} y2={CY - 4 + 20 * Math.sin(a)} stroke="#d4a853" strokeWidth="1" strokeLinecap="round" opacity="0.5" />;
      })}
      {/* Moon crescent */}
      <circle cx={CX + 10} cy={CY + 2} r="10" fill="none" stroke="#f0d48a" strokeWidth="1.5" opacity="0.6" />
      <circle cx={CX + 14} cy={CY - 1} r="8" fill="#0a0e27" />

      {/* Center text */}
      <text x={CX} y={CY + 32} fill="#d4a853" fontSize="8" textAnchor="middle" opacity="0.5" fontWeight="bold" letterSpacing="2">
        {tl({ en: 'LUNISOLAR', hi: 'चान्द्र-सौर', sa: 'चान्द्रसौरम्', ta: 'சந்திர-சூரிய', te: 'చాంద్ర-సౌర', bn: 'চান্দ্র-সৌর', kn: 'ಚಾಂದ್ರ-ಸೌರ', gu: 'ચાન્દ્ર-સૌર', mai: 'चान्द्र-सौर', mr: 'चांद्र-सौर' }, locale)}
      </text>

      {/* Orbiting golden sun dot */}
      <motion.circle
        r="5"
        fill="#fbbf24"
        filter="url(#goldGlow)"
        animate={{
          cx: Array.from({ length: 13 }, (_, i) => CX + (R_MID + 10) * Math.cos((i * 30 - 90) * Math.PI / 180)),
          cy: Array.from({ length: 13 }, (_, i) => CY + (R_MID + 10) * Math.sin((i * 30 - 90) * Math.PI / 180)),
        }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
    </motion.svg>
  );
}

/* ================================================================== */
/*  Computed Hindu Month Calendar — Amant / Purnimant toggle          */
/* ================================================================== */

function MasaCalendarTable({ locale, headingFont }: { locale: Locale; headingFont: React.CSSProperties }) {
  const [system, setSystem] = useState<'amant' | 'purnimant'>('amant');
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const isEn = locale === 'en' || String(locale) === 'ta';

  const amantMonths = useMemo(() => computeHinduMonths(calYear), [calYear]);
  const purnimantMonths = useMemo(() => computePurnimantMonths(calYear), [calYear]);
  const months = system === 'amant' ? amantMonths : purnimantMonths;

  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

  return (
    <section className="my-10">
      {/* Title + year nav */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient" style={headingFont}>
          {isEn ? `Hindu Month Calendar ${calYear}` : `हिन्दू मास पंचांग ${calYear}`}
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={() => setCalYear(y => y - 1)} className="p-2 rounded-lg border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-gold-light font-bold text-lg font-mono">{calYear}</span>
          <button onClick={() => setCalYear(y => y + 1)} className="p-2 rounded-lg border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Amant / Purnimant toggle */}
      <div className="flex justify-center gap-1 mb-6">
        <button
          onClick={() => setSystem('amant')}
          className={`px-5 py-2.5 rounded-l-xl text-sm font-bold transition-all border ${
            system === 'amant'
              ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-blue-300 border-blue-500/35 shadow-lg shadow-blue-500/5'
              : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light'
          }`}
        >
          {isEn ? 'Amant (New Moon)' : 'अमान्त (अमावस्या)'}
        </button>
        <button
          onClick={() => setSystem('purnimant')}
          className={`px-5 py-2.5 rounded-r-xl text-sm font-bold transition-all border ${
            system === 'purnimant'
              ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-amber-300 border-amber-500/35 shadow-lg shadow-amber-500/5'
              : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light'
          }`}
        >
          {isEn ? 'Purnimant (Full Moon)' : 'पूर्णिमान्त (पूर्णिमा)'}
        </button>
      </div>

      {/* System explanation */}
      <div className="text-center text-text-secondary text-xs mb-4">
        {system === 'amant'
          ? (isEn ? 'Amant system: each month begins on the day after Amavasya (New Moon). Used in South India, Maharashtra, Gujarat.' : 'अमान्त पद्धति: प्रत्येक मास अमावस्या के अगले दिन से आरम्भ। दक्षिण भारत, महाराष्ट्र, गुजरात में प्रचलित।')
          : (isEn ? 'Purnimant system: each month begins on the day after Purnima (Full Moon). Used in North India, Bihar, UP, MP. During Adhika Masa, the Shukla paksha of one month and Krishna paksha of the next share the Adhika name.' : 'पूर्णिमान्त पद्धति: प्रत्येक मास पूर्णिमा के अगले दिन से आरम्भ। उत्तर भारत, बिहार, उत्तर प्रदेश, मध्य प्रदेश में प्रचलित। अधिक मास में शुक्ल और कृष्ण पक्ष अलग-अलग मासों से आ सकते हैं।')}
      </div>

      {/* Month table */}
      {months.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20 bg-[#1a1040]/50">
                <th className="text-left py-3 px-4 text-gold-primary/70 font-bold text-xs uppercase tracking-wider">#</th>
                <th className="text-left py-3 px-4 text-gold-primary/70 font-bold text-xs uppercase tracking-wider">{isEn ? 'Month' : 'मास'}</th>
                <th className="text-left py-3 px-4 text-gold-primary/70 font-bold text-xs uppercase tracking-wider">{isEn ? 'Start Date' : 'आरम्भ'}</th>
                <th className="text-left py-3 px-4 text-gold-primary/70 font-bold text-xs uppercase tracking-wider">{isEn ? 'End Date' : 'समाप्ति'}</th>
                <th className="text-left py-3 px-4 text-gold-primary/70 font-bold text-xs uppercase tracking-wider">{isEn ? 'Ritu' : 'ऋतु'}</th>
                <th className="text-center py-3 px-4 text-gold-primary/70 font-bold text-xs uppercase tracking-wider">{isEn ? 'Days' : 'दिन'}</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // For Purnimant: expand Adhika+Nija into 3-layer sandwich rows.
                // Ported from commit da335420 (PanchangClient sandwich logic).
                interface DisplayRow {
                  n: number | string; en: string; hi: string;
                  startDate: string; endDate: string; ritu: Record<string, string>;
                  isAdhika: boolean; sandwichLayer?: 'top' | 'filling' | 'bottom';
                }
                const rows: DisplayRow[] = [];
                const skipNext = new Set<number>();
                const amantData = system === 'purnimant' ? computeHinduMonths(calYear) : [];

                for (let idx = 0; idx < months.length; idx++) {
                  if (skipNext.has(idx)) continue;
                  const m = months[idx];
                  const nextM = months[idx + 1];

                  if (system === 'purnimant' && m.isAdhika && nextM && !nextM.isAdhika) {
                    // Sandwich: Nija Krishna → Adhika → Nija Shukla
                    const baseName = m.en.replace('Adhika ', '');
                    const baseHi = m.hi.replace('अधिक ', '');
                    // Find the Amant Adhika month for Amavasya boundaries
                    const amAdhika = amantData.find(a => a.isAdhika);
                    const adhikaStart = amAdhika?.startDate || m.startDate;
                    const adhikaEnd = amAdhika?.endDate || m.endDate;

                    // Layer 1: Nija Krishna Paksha (Purnima → Amavasya)
                    rows.push({
                      n: '', en: `${baseName} Krishna`, hi: `${baseHi} कृष्ण`,
                      startDate: m.startDate, endDate: adhikaStart,
                      ritu: m.ritu as Record<string, string>, isAdhika: false, sandwichLayer: 'top',
                    });
                    // Layer 2: Adhika full month (Amavasya → Amavasya)
                    rows.push({
                      n: '', en: m.en, hi: m.hi,
                      startDate: adhikaStart, endDate: adhikaEnd,
                      ritu: m.ritu as Record<string, string>, isAdhika: true, sandwichLayer: 'filling',
                    });
                    // Layer 3: Nija Shukla Paksha (Amavasya → Purnima)
                    rows.push({
                      n: '', en: `${baseName} Shukla`, hi: `${baseHi} शुक्ल`,
                      startDate: adhikaEnd, endDate: nextM.endDate,
                      ritu: nextM.ritu as Record<string, string>, isAdhika: false, sandwichLayer: 'bottom',
                    });
                    skipNext.add(idx + 1);
                  } else {
                    rows.push({
                      n: m.n, en: m.en, hi: m.hi,
                      startDate: m.startDate, endDate: m.endDate,
                      ritu: m.ritu as Record<string, string>, isAdhika: m.isAdhika,
                    });
                  }
                }

                // Renumber after sandwich expansion
                let counter = 1;
                for (const r of rows) {
                  if (r.sandwichLayer === 'filling') r.n = '';
                  else r.n = counter++;
                }

                return rows.map((r) => {
                  const start = new Date(r.startDate);
                  const end = new Date(r.endDate);
                  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
                  const isCurrent = todayStr >= r.startDate && todayStr < r.endDate;
                  const monthName = locale === 'hi' ? r.hi : r.en;
                  const layerStyle = r.sandwichLayer === 'top' ? 'border-l-3 border-l-amber-500/40'
                    : r.sandwichLayer === 'filling' ? 'border-l-3 border-l-violet-500/60 bg-violet-500/[0.03]'
                    : r.sandwichLayer === 'bottom' ? 'border-l-3 border-l-amber-500/40'
                    : '';

                  return (
                    <tr
                      key={`${r.n}-${r.startDate}`}
                      className={`border-b border-gold-primary/5 transition-colors hover:bg-gold-primary/5 ${
                        isCurrent ? 'bg-gold-primary/10' : ''
                      } ${r.isAdhika && !r.sandwichLayer ? 'bg-violet-500/5' : ''} ${layerStyle}`}
                    >
                      <td className="py-3 px-4 text-text-secondary/50 text-xs">{r.n}</td>
                      <td className="py-3 px-4" style={headingFont}>
                        <span className={`font-bold ${
                          r.isAdhika ? 'text-violet-300 italic' :
                          r.sandwichLayer ? 'text-amber-300' : 'text-gold-light'
                        }`}>
                          {monthName}
                        </span>
                        {isCurrent && (
                          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-gold-primary/25 text-gold-light font-bold uppercase tracking-wider animate-pulse">
                            {isEn ? 'NOW' : 'अभी'}
                          </span>
                        )}
                        {r.isAdhika && (
                          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold">
                            {isEn ? 'INTERCALARY' : 'अधिक'}
                          </span>
                        )}
                        {r.sandwichLayer === 'top' && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
                            {isEn ? 'Nija (waning)' : 'निज (कृष्ण)'}
                          </span>
                        )}
                        {r.sandwichLayer === 'bottom' && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
                            {isEn ? 'Nija (waxing)' : 'निज (शुक्ल)'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-text-primary font-mono text-xs">{formatMonthDate(r.startDate, locale)}</td>
                      <td className="py-3 px-4 text-text-primary font-mono text-xs">{formatMonthDate(r.endDate, locale)}</td>
                      <td className="py-3 px-4 text-text-secondary text-xs">{tl(r.ritu, locale)}</td>
                      <td className="py-3 px-4 text-center text-text-secondary/60 text-xs">{days}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary">
          {isEn ? 'Computing month boundaries...' : 'मास सीमाओं की गणना हो रही है...'}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 justify-center text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gold-primary/25" />
          <span>{isEn ? 'Current Month' : 'वर्तमान मास'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-violet-500/20 border border-violet-500/30" />
          <span>{isEn ? 'Adhika Masa (Leap Month)' : 'अधिक मास (लौंद मास)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-blue-300 font-bold">{isEn ? 'Amant' : 'अमान्त'}</span>
          <span>= {isEn ? 'New Moon → New Moon' : 'अमावस्या → अमावस्या'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-amber-300 font-bold">{isEn ? 'Purnimant' : 'पूर्णिमान्त'}</span>
          <span>= {isEn ? 'Full Moon → Full Moon' : 'पूर्णिमा → पूर्णिमा'}</span>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  Page                                                              */
/* ================================================================== */
export default function MasaPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/panchang"
        className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t('backToPanchang')}
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-6"
      >
        <MasaIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
            <span className="text-gold-gradient">
              {tl({ en: 'Masa & Ritu', hi: 'मास एवं ऋतु', sa: 'मासः ऋतुश्च', ta: 'மாதம் மற்றும் பருவம்', te: 'మాసం మరియు ఋతువు', bn: 'মাস ও ঋতু', kn: 'ಮಾಸ ಮತ್ತು ಋತು', gu: 'માસ અને ઋતુ', mai: 'मास आ ऋतु', mr: 'मास आणि ऋतू' }, locale)}
            </span>
          </h1>
          <p
            className="text-text-secondary text-lg"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {tl({ en: '12 Months and 6 Seasons — The Lunisolar Calendar', hi: '12 मास और 6 ऋतुएँ — चान्द्र-सौर पञ्चाङ्ग', sa: 'द्वादशमासाः षड्ऋतवश्च — चान्द्रसौरपञ्चाङ्गम्', ta: '12 மாதங்கள் மற்றும் 6 பருவங்கள் — சந்திர-சூரிய பஞ்சாங்கம்', te: '12 నెలలు మరియు 6 ఋతువులు — చాంద్ర-సౌర పంచాంగం', bn: '12 মাস ও 6 ঋতু — চান্দ্র-সৌর পঞ্চাঙ্গ', kn: '12 ತಿಂಗಳು ಮತ್ತು 6 ಋತುಗಳು — ಚಾಂದ್ರ-ಸೌರ ಪಂಚಾಂಗ', gu: '12 માસ અને 6 ઋતુ — ચાન્દ્ર-સૌર પંચાંગ', mai: '12 मास आ 6 ऋतु — चान्द्र-सौर पंचांग', mr: '12 महिने आणि 6 ऋतू — चांद्र-सौर पंचांग' }, locale)}
          </p>
        </div>
      </motion.div>

      {/* ═══ COMPUTED MONTH TABLE — FIRST, above everything ═══ */}
      <MasaCalendarTable locale={locale as Locale} headingFont={headingFont} />

      <GoldDivider />

      {/* Scientific Basis */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('scientificBasis')}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? `The Hindu calendar is lunisolar. Months (Masa) are primarily lunar — each month spans one New Moon to the next (Amanta system) or one Full Moon to the next (Purnimanta system). The month name is derived from the Nakshatra in which the Full Moon falls. Seasons (Ritu) follow the solar cycle: 6 Ritus of 2 months each track the Sun's progression through the zodiac. A solar year has ~365.25 days, while 12 lunar months total only ~354 days. The ~11-day gap is resolved by intercalation — an extra "Adhika Masa" (leap month) is inserted roughly every 2.7 years when two New Moons fall within the same solar month.`
                : tl({ en: `हिन्दूपञ्चाङ्गं चान्द्रसौरम्। मासाः मुख्यतः चान्द्राः — प्रत्येकं मासः एकामावस्यातः अपरामावस्यापर्यन्तम् (अमान्तपद्धतिः) भवति। मासनाम तस्मात् नक्षत्रात् आगच्छति यस्मिन् पूर्णिमा पतति। ऋतवः सौरचक्रम् अनुसरन्ति — द्वौ-द्वौ मासयोः 6 ऋतवः।`, hi: `हिन्दू पञ्चाङ्ग चान्द्र-सौर है। मास मुख्यतः चान्द्र हैं — प्रत्येक मास एक अमावस्या से अगली तक (अमान्त) या एक पूर्णिमा से अगली तक (पूर्णिमान्त) होता है। मास का नाम उस नक्षत्र से आता है जिसमें पूर्णिमा पड़ती है। ऋतुएँ सौर चक्र का अनुसरण करती हैं: 2-2 मास की 6 ऋतुएँ। सौर वर्ष ~365.25 दिन और 12 चान्द्र मास ~354 दिन होते हैं। ~11 दिन का अन्तर अधिक मास (लौंद मास) से पूरा किया जाता है, जो लगभग हर 2.7 वर्ष में जुड़ता है।`, sa: `हिन्दू पञ्चाङ्ग चान्द्र-सौर है। मास मुख्यतः चान्द्र हैं — प्रत्येक मास एक अमावस्या से अगली तक (अमान्त) या एक पूर्णिमा से अगली तक (पूर्णिमान्त) होता है। मास का नाम उस नक्षत्र से आता है जिसमें पूर्णिमा पड़ती है। ऋतुएँ सौर चक्र का अनुसरण करती हैं: 2-2 मास की 6 ऋतुएँ। सौर वर्ष ~365.25 दिन और 12 चान्द्र मास ~354 दिन होते हैं। ~11 दिन का अन्तर अधिक मास (लौंद मास) से पूरा किया जाता है, जो लगभग हर 2.7 वर्ष में जुड़ता है।`, ta: `हिन्दूपञ्चाङ्गं चान्द्रसौरम्। मासाः मुख्यतः चान्द्राः — प्रत्येकं मासः एकामावस्यातः अपरामावस्यापर्यन्तम् (अमान्तपद्धतिः) भवति। मासनाम तस्मात् नक्षत्रात् आगच्छति यस्मिन् पूर्णिमा पतति। ऋतवः सौरचक्रम् अनुसरन्ति — द्वौ-द्वौ मासयोः 6 ऋतवः।`, te: `हिन्दूपञ्चाङ्गं चान्द्रसौरम्। मासाः मुख्यतः चान्द्राः — प्रत्येकं मासः एकामावस्यातः अपरामावस्यापर्यन्तम् (अमान्तपद्धतिः) भवति। मासनाम तस्मात् नक्षत्रात् आगच्छति यस्मिन् पूर्णिमा पतति। ऋतवः सौरचक्रम् अनुसरन्ति — द्वौ-द्वौ मासयोः 6 ऋतवः।`, bn: `हिन्दूपञ्चाङ्गं चान्द्रसौरम्। मासाः मुख्यतः चान्द्राः — प्रत्येकं मासः एकामावस्यातः अपरामावस्यापर्यन्तम् (अमान्तपद्धतिः) भवति। मासनाम तस्मात् नक्षत्रात् आगच्छति यस्मिन् पूर्णिमा पतति। ऋतवः सौरचक्रम् अनुसरन्ति — द्वौ-द्वौ मासयोः 6 ऋतवः।`, kn: `हिन्दूपञ्चाङ्गं चान्द्रसौरम्। मासाः मुख्यतः चान्द्राः — प्रत्येकं मासः एकामावस्यातः अपरामावस्यापर्यन्तम् (अमान्तपद्धतिः) भवति। मासनाम तस्मात् नक्षत्रात् आगच्छति यस्मिन् पूर्णिमा पतति। ऋतवः सौरचक्रम् अनुसरन्ति — द्वौ-द्वौ मासयोः 6 ऋतवः।`, gu: `हिन्दूपञ्चाङ्गं चान्द्रसौरम्। मासाः मुख्यतः चान्द्राः — प्रत्येकं मासः एकामावस्यातः अपरामावस्यापर्यन्तम् (अमान्तपद्धतिः) भवति। मासनाम तस्मात् नक्षत्रात् आगच्छति यस्मिन् पूर्णिमा पतति। ऋतवः सौरचक्रम् अनुसरन्ति — द्वौ-द्वौ मासयोः 6 ऋतवः।`, mai: `हिन्दू पञ्चाङ्ग चान्द्र-सौर है। मास मुख्यतः चान्द्र हैं — प्रत्येक मास एक अमावस्या से अगली तक (अमान्त) या एक पूर्णिमा से अगली तक (पूर्णिमान्त) होता है। मास का नाम उस नक्षत्र से आता है जिसमें पूर्णिमा पड़ती है। ऋतुएँ सौर चक्र का अनुसरण करती हैं: 2-2 मास की 6 ऋतुएँ। सौर वर्ष ~365.25 दिन और 12 चान्द्र मास ~354 दिन होते हैं। ~11 दिन का अन्तर अधिक मास (लौंद मास) से पूरा किया जाता है, जो लगभग हर 2.7 वर्ष में जुड़ता है।`, mr: `हिन्दू पञ्चाङ्ग चान्द्र-सौर है। मास मुख्यतः चान्द्र हैं — प्रत्येक मास एक अमावस्या से अगली तक (अमान्त) या एक पूर्णिमा से अगली तक (पूर्णिमान्त) होता है। मास का नाम उस नक्षत्र से आता है जिसमें पूर्णिमा पड़ती है। ऋतुएँ सौर चक्र का अनुसरण करती हैं: 2-2 मास की 6 ऋतुएँ। सौर वर्ष ~365.25 दिन और 12 चान्द्र मास ~354 दिन होते हैं। ~11 दिन का अन्तर अधिक मास (लौंद मास) से पूरा किया जाता है, जो लगभग हर 2.7 वर्ष में जुड़ता है।` }, locale)}
            </p>
            <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <p className="text-gold-light font-mono text-sm">
                {tl({ en: 'Lunar year:', hi: 'चान्द्र वर्ष:', sa: 'चान्द्रवर्षम्:', ta: 'சந்திர ஆண்டு:', te: 'చాంద్ర సంవత్సరం:', bn: 'চান্দ্র বছর:', kn: 'ಚಾಂದ್ರ ವರ್ಷ:', gu: 'ચાન્દ્ર વર્ષ:', mai: 'चान्द्र वर्ष:', mr: 'चांद्र वर्ष:' }, locale)} 12 x 29.53 = ~354.36{' '}
                {tl({ en: 'days', hi: 'दिन', sa: 'दिनानि', ta: 'நாட்கள்', te: 'రోజులు', bn: 'দিন', kn: 'ದಿನಗಳು', gu: 'દિવસ', mai: 'दिन', mr: 'दिवस' }, locale)}
              </p>
              <p className="text-gold-light/70 font-mono text-xs mt-1">
                {locale === 'en'
                  ? 'Solar year: ~365.25 days | Gap: ~11 days (Adhika Masa correction)'
                  : 'सौर वर्ष: ~365.25 दिन | अन्तर: ~11 दिन (अधिक मास सुधार)'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Month-Season Wheel Visualization */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en'
            ? 'Annual Cycle — Months & Seasons'
            : tl({ en: 'वार्षिकचक्रम् — मासाः ऋतवश्च', hi: 'वार्षिक चक्र — मास और ऋतु', sa: 'वार्षिकचक्रम् — मासाः ऋतवश्च', ta: 'வருடாந்திர சுழற்சி — மாதங்கள் மற்றும் பருவங்கள்', te: 'వార్షిక చక్రం — మాసాలు మరియు ఋతువులు', bn: 'বার্ষিক চক্র — মাস ও ঋতু', kn: 'ವಾರ್ಷಿಕ ಚಕ್ರ — ಮಾಸಗಳು ಮತ್ತು ಋತುಗಳು', gu: 'વાર્ષિક ચક્ર — માસ અને ઋતુ', mai: 'वार्षिक चक्र — मास आ ऋतु', mr: 'वार्षिक चक्र — मास आणि ऋतू' }, locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 flex justify-center">
          <AnimatedAnnualWheel locale={locale} />
        </div>
      </section>

      <GoldDivider />

      {/* Complete Listing - Months */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('completeListing')}
        </h2>

        <h3 className="text-xl text-gold-light mb-4" style={headingFont}>
          {locale === 'en'
            ? '12 Lunar Months (Masa)'
            : tl({ en: 'द्वादश चान्द्रमासाः', hi: '12 चान्द्र मास', sa: 'द्वादश चान्द्रमासाः', ta: 'பன்னிரண்டு சந்திர மாதங்கள்', te: 'పన్నెండు చాంద్ర మాసాలు', bn: 'দ্বাদশ চান্দ্র মাস', kn: 'ಹನ್ನೆರಡು ಚಾಂದ್ರ ಮಾಸಗಳು', gu: 'બારા ચાન્દ્ર માસ', mai: 'बारह चान्द्र मास', mr: 'बारा चांद्र मास' }, locale)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {MASA_NAMES.map((masa, i) => {
            const rituIndex = Math.floor(i / 2);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 text-center cursor-default"
              >
                <div className="text-gold-primary text-2xl mb-1">{i + 1}</div>
                <div
                  className="text-gold-light font-semibold text-sm"
                  style={
                    isDevanagari
                      ? { fontFamily: 'var(--font-devanagari-heading)' }
                      : undefined
                  }
                >
                  {tl(masa, locale)}
                </div>
                <div className="text-text-secondary text-xs mt-1 font-mono">
                  {MASA_DETAILS[i].gregApprox}
                </div>
                <div className="text-xs mt-1" style={{ color: rituColors[rituIndex] }}>
                  {tl(RITU_NAMES[rituIndex], locale)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 6 Seasons */}
        <h3 className="text-xl text-gold-light mb-4" style={headingFont}>
          {tl({ en: '6 Seasons (Ritu)', hi: '6 ऋतुएँ', sa: 'षड् ऋतवः', ta: '6 பருவங்கள் (ரிது)', te: '6 ఋతువులు (ఋతు)', bn: '6 ঋতু', kn: '6 ಋತುಗಳು (ಋತು)', gu: '6 ઋતુ', mai: '6 ऋतु', mr: '6 ऋतू' }, locale)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {RITU_NAMES.map((ritu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-5 text-center cursor-default"
            >
              <div className="text-2xl mb-2" style={{ color: rituColors[i] }}>
                {i + 1}
              </div>
              <div
                className="text-gold-light font-semibold"
                style={
                  isDevanagari
                    ? { fontFamily: 'var(--font-devanagari-heading)' }
                    : undefined
                }
              >
                {tl(ritu, locale)}
              </div>
              <div
                className="text-text-secondary text-xs mt-2"
                style={
                  isDevanagari
                    ? { fontFamily: 'var(--font-devanagari-body)' }
                    : undefined
                }
              >
                {tl(MASA_NAMES[i * 2], locale)} &ndash; {tl(MASA_NAMES[i * 2 + 1], locale)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AuthorByline />
    </div>
  );
}
