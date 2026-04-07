'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { GRAHAS } from '@/lib/constants/grahas';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import type { Locale } from '@/types/panchang';

// ── Vimshottari data ────────────────────────────────────────────
const VIMSHOTTARI = [
  { id: 8, years: 7,  label: 'Ke', name: 'Ketu',    color: '#8b5cf6' },
  { id: 5, years: 20, label: 'Ve', name: 'Venus',   color: '#ec4899' },
  { id: 0, years: 6,  label: 'Su', name: 'Sun',     color: '#f59e0b' },
  { id: 1, years: 10, label: 'Mo', name: 'Moon',    color: '#93c5fd' },
  { id: 2, years: 7,  label: 'Ma', name: 'Mars',    color: '#ef4444' },
  { id: 7, years: 18, label: 'Ra', name: 'Rahu',    color: '#6366f1' },
  { id: 4, years: 16, label: 'Ju', name: 'Jupiter', color: '#f97316' },
  { id: 6, years: 19, label: 'Sa', name: 'Saturn',  color: '#64748b' },
  { id: 3, years: 17, label: 'Me', name: 'Mercury', color: '#22c55e' },
];

const TOTAL_YEARS = 120;
const NAK_SPAN = 360 / 27; // 13.333...°

const RULER_TO_IDX: Record<string, number> = {
  Ketu: 0, Venus: 1, Sun: 2, Moon: 3, Mars: 4, Rahu: 5, Jupiter: 6, Saturn: 7, Mercury: 8,
};

const SIGN_RULER_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6,
};

const SIGN_COLORS = [
  '#ef4444','#22c55e','#f97316','#3b82f6','#f59e0b','#a855f7',
  '#ef4444','#3b82f6','#f97316','#22c55e','#f97316','#8b5cf6',
];

interface SubDivision {
  planetId: number; startDeg: number; endDeg: number; spanDeg: number; isCurrent: boolean;
}

function computeSubDivisions(nakStart: number, starLordIdx: number, posInNak: number): SubDivision[] {
  const subs: SubDivision[] = [];
  let cursor = nakStart;
  let idx = starLordIdx;
  for (let i = 0; i < 9; i++) {
    const planet = VIMSHOTTARI[idx];
    const span = (planet.years / TOTAL_YEARS) * NAK_SPAN;
    const startDeg = cursor;
    const endDeg = cursor + span;
    const localStart = startDeg - nakStart;
    const localEnd = endDeg - nakStart;
    subs.push({
      planetId: planet.id,
      startDeg, endDeg, spanDeg: span,
      isCurrent: posInNak >= localStart && posInNak < localEnd,
    });
    cursor = endDeg;
    idx = (idx + 1) % 9;
  }
  return subs;
}

// ── Shared Wizard Components ─────────────────────────────────────

function WhyBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/8 p-4 my-4">
      <div className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">Why does this matter?</div>
      <div className="text-white/80 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ConceptBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 my-4">
      <div className="text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">{label}</div>
      <div className="text-white/80 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-[#1a1a0a] p-4 my-4 font-mono text-sm">
      <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 font-sans">Formula</div>
      <div className="text-amber-200 leading-relaxed">{children}</div>
    </div>
  );
}

function ResultBanner({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-center my-4">
      <div className="text-violet-300 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className="text-white text-2xl font-bold">{value}</div>
    </div>
  );
}

function NavButtons({ step, totalSteps, onPrev, onNext, prevLabel = 'Previous', nextLabel = 'Next' }: {
  step: number; totalSteps: number;
  onPrev: () => void; onNext: () => void;
  prevLabel?: string; nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/8">
      <button
        onClick={onPrev}
        disabled={step === 0}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
      >
        <ChevronLeft className="w-4 h-4" /> {prevLabel}
      </button>
      <div className="text-white/40 text-sm">{step + 1} / {totalSteps}</div>
      <button
        onClick={onNext}
        disabled={step === totalSteps - 1}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold"
      >
        {nextLabel} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Visual Diagrams ──────────────────────────────────────────────

/** The KP zoom-in hierarchy: 360° → 12 signs → 27 nakshatras → 243 sub-lords */
function HierarchyDiagram() {
  const W = 560; const H = 220;
  const levels = [
    { label: '360°', sublabel: 'Full Zodiac', count: 1, color: '#6366f1', span: 360, each: 360 },
    { label: '12 Signs', sublabel: '30° each', count: 12, color: '#8b5cf6', span: 30, each: 30 },
    { label: '27 Nakshatras', sublabel: '13.33° each', count: 27, color: '#a78bfa', span: 13.33, each: 13.33 },
    { label: '243 Sub-lords', sublabel: '0.05–1.11° each', count: 243, color: '#c4b5fd', span: 1.11, each: '~0.5°' },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl overflow-hidden" style={{ maxHeight: 220 }}>
      <defs>
        <linearGradient id="kpbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0b27" />
          <stop offset="100%" stopColor="#0a0e27" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#kpbg)" />

      {/* Level columns */}
      {levels.map((lv, li) => {
        const colW = W / 4;
        const x = li * colW;
        const blockH = Math.max(20, Math.min(140, 200 / (li + 1)));
        const blockY = (H - blockH) / 2 - 20;
        const numBars = Math.min(lv.count, li === 0 ? 1 : li === 1 ? 3 : li === 2 ? 5 : 9);

        return (
          <g key={li}>
            {/* Connector line to next */}
            {li < 3 && (
              <line
                x1={x + colW - 10} y1={H / 2 - 20}
                x2={x + colW + 10} y2={H / 2 - 20}
                stroke={lv.color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.4}
              />
            )}
            {/* Zoom arrow */}
            {li < 3 && (
              <text x={x + colW} y={H / 2 - 14} textAnchor="middle" fill={lv.color} fontSize={12} opacity={0.6}>▶</text>
            )}
            {/* Bars representing divisions */}
            {Array.from({ length: numBars }, (_, bi) => {
              const gap = 3;
              const totalBarH = numBars * (blockH / numBars - gap) + gap;
              const barH = (blockH - gap * (numBars - 1)) / numBars;
              const barY = blockY + bi * (barH + gap);
              const isMiddle = bi === Math.floor(numBars / 2);
              return (
                <rect
                  key={bi}
                  x={x + 16}
                  y={barY}
                  width={colW - 44}
                  height={barH}
                  rx={3}
                  fill={isMiddle ? lv.color + 'aa' : lv.color + '30'}
                  stroke={isMiddle ? lv.color : lv.color + '55'}
                  strokeWidth={isMiddle ? 1.5 : 0.5}
                />
              );
            })}
            {/* Label */}
            <text x={x + colW / 2} y={blockY + blockH + 24} textAnchor="middle" fill={lv.color} fontSize={11} fontWeight="600">
              {lv.label}
            </text>
            <text x={x + colW / 2} y={blockY + blockH + 38} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9.5}>
              {lv.sublabel}
            </text>
          </g>
        );
      })}

      {/* Title */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10}>
        KP zooms in: each level subdivides the previous
      </text>
    </svg>
  );
}

/** 360-degree zodiac ring with nakshatra ticks and current degree needle */
function ZodiacRingDiagram({ deg, signIdx, nakIdx }: { deg: number; signIdx: number; nakIdx: number }) {
  const S = 300; const cx = S / 2; const cy = S / 2;
  const outerR = 135; const innerR = 98; const needleR = 128;

  function dxy(d: number, r: number) {
    const rad = ((d - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full" style={{ maxWidth: 300 }}>
      {/* Sign segments */}
      {RASHIS.map((r, i) => {
        const s1 = dxy(i * 30, outerR);
        const s2 = dxy((i + 1) * 30, outerR);
        const s3 = dxy((i + 1) * 30, innerR);
        const s4 = dxy(i * 30, innerR);
        const isActive = i === signIdx;
        const mid = dxy(i * 30 + 15, (outerR + innerR) / 2);
        return (
          <g key={i}>
            <path
              d={`M ${s1.x} ${s1.y} A ${outerR} ${outerR} 0 0 1 ${s2.x} ${s2.y} L ${s3.x} ${s3.y} A ${innerR} ${innerR} 0 0 0 ${s4.x} ${s4.y} Z`}
              fill={isActive ? SIGN_COLORS[i] + '50' : SIGN_COLORS[i] + '18'}
              stroke={isActive ? SIGN_COLORS[i] : 'rgba(255,255,255,0.08)'}
              strokeWidth={isActive ? 2 : 0.5}
            />
            <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="central"
              fill={isActive ? '#fff' : 'rgba(255,255,255,0.3)'} fontSize={isActive ? 14 : 11}>
              {r.symbol}
            </text>
          </g>
        );
      })}
      {/* Nakshatra ticks */}
      {Array.from({ length: 27 }, (_, i) => {
        const angle = i * NAK_SPAN;
        const p1 = dxy(angle, innerR);
        const p2 = dxy(angle, innerR - 9);
        const isActive = i === nakIdx;
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={isActive ? '#a78bfa' : 'rgba(255,255,255,0.1)'} strokeWidth={isActive ? 2.5 : 0.5} />
        );
      })}
      {/* Needle */}
      {(() => {
        const tip = dxy(deg, needleR);
        const b1 = dxy(deg - 2, 18);
        const b2 = dxy(deg + 2, 18);
        return (
          <>
            <polygon points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`} fill="#a78bfa" opacity={0.9} />
            <circle cx={cx} cy={cy} r={6} fill="#a78bfa" />
            <circle cx={tip.x} cy={tip.y} r={3} fill="#fff" />
          </>
        );
      })()}
      <text x={cx} y={cy - 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={9}>KP</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#a78bfa" fontSize={13} fontWeight="bold" fontFamily="monospace">
        {deg.toFixed(2)}°
      </text>
    </svg>
  );
}

/** Shows the nakshatra as a horizontal bar divided into 9 proportional sub-lord sections */
function SubLordBar({ subs, posInNak }: { subs: SubDivision[]; posInNak: number }) {
  const W = 520; const H = 80;
  const barY = 28; const barH = 28;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl overflow-visible" style={{ maxHeight: 80 }}>
      {/* Background */}
      <rect width={W} height={H} fill="transparent" />
      {/* Nakshatra label */}
      <text x={0} y={16} fill="rgba(255,255,255,0.5)" fontSize={10}>← One Nakshatra = {NAK_SPAN.toFixed(2)}°</text>
      {subs.map((sub, i) => {
        const pct = sub.spanDeg / NAK_SPAN;
        const x = subs.slice(0, i).reduce((acc, s) => acc + (s.spanDeg / NAK_SPAN) * W, 0);
        const w = pct * W;
        const v = VIMSHOTTARI.find(v => v.id === sub.planetId)!;
        return (
          <g key={i}>
            <rect x={x} y={barY} width={w} height={barH} rx={2}
              fill={sub.isCurrent ? v.color + 'cc' : v.color + '30'}
              stroke={sub.isCurrent ? v.color : v.color + '55'}
              strokeWidth={sub.isCurrent ? 2 : 0.5} />
            {w > 18 && (
              <text x={x + w / 2} y={barY + barH / 2 + 4} textAnchor="middle"
                fill={sub.isCurrent ? '#fff' : 'rgba(255,255,255,0.5)'} fontSize={9} fontWeight={sub.isCurrent ? '700' : '400'}>
                {v.label}
              </text>
            )}
          </g>
        );
      })}
      {/* Current position marker */}
      {(() => {
        const px = (posInNak / NAK_SPAN) * W;
        return (
          <>
            <line x1={px} y1={barY - 4} x2={px} y2={barY + barH + 4} stroke="#fff" strokeWidth={2} />
            <text x={px} y={barY + barH + 16} textAnchor="middle" fill="#fff" fontSize={9}>▲ you</text>
          </>
        );
      })()}
    </svg>
  );
}

/** Tree diagram showing the 3-level result */
function ResultTreeDiagram({ signLordId, starLordId, subLordId }: { signLordId: number; starLordId: number; subLordId: number }) {
  const W = 400; const H = 160;
  const nodes = [
    { x: 200, y: 28, id: signLordId, label: 'Sign Lord', color: '#22c55e' },
    { x: 200, y: 90, id: starLordId, label: 'Star Lord', color: '#3b82f6' },
    { x: 200, y: 148, id: subLordId, label: 'Sub Lord ★', color: '#a78bfa' },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 160 }}>
      {/* Connecting lines */}
      <line x1={200} y1={46} x2={200} y2={70} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeDasharray="3 2" />
      <line x1={200} y1={108} x2={200} y2={128} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeDasharray="3 2" />
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={70} y={n.y - 18} width={260} height={36} rx={8}
            fill={n.color + '18'} stroke={n.color + '55'} strokeWidth={1.5} />
          <text x={110} y={n.y + 5} fill={n.color} fontSize={13} fontWeight="600">
            {GRAHAS[n.id].symbol} {GRAHAS[n.id].name.en}
          </text>
          <text x={300} y={n.y + 5} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9.5}>
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Main Component ───────────────────────────────────────────────

const TOTAL_STEPS = 6;

export default function KPSubLordLabPage() {
  const locale = useLocale() as Locale;
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);
  const [degree, setDegree] = useState(45);

  const result = useMemo(() => {
    const deg = ((degree % 360) + 360) % 360;
    const signIdx = Math.floor(deg / 30);
    const sign = RASHIS[signIdx];
    const signLordId = SIGN_RULER_TO_ID[sign.ruler];
    const posInSign = deg - signIdx * 30;
    const nakIdx = Math.floor(deg / NAK_SPAN);
    const nak = NAKSHATRAS[nakIdx];
    const nakStart = nakIdx * NAK_SPAN;
    const posInNak = deg - nakStart;
    const starLordIdx = RULER_TO_IDX[nak.ruler];
    const subs = computeSubDivisions(nakStart, starLordIdx, posInNak);
    const currentSub = subs.find(s => s.isCurrent) || subs[0];
    return { deg, signIdx, sign, signLordId, posInSign, nakIdx, nak, nakStart, posInNak, starLordIdx, subs, currentSub };
  }, [degree]);

  function goTo(next: number) {
    setPrevStep(step);
    setStep(next);
  }

  const dir = step > prevStep ? 1 : -1;

  const STEP_LABELS = [
    'Setup', 'What is KP?', 'Sign Lord', 'Star Lord', 'Sub Lord', 'Summary',
  ];

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4">
            <Crosshair className="w-4 h-4" />
            <span>Lab 5 · KP System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-200 via-purple-100 to-violet-200 bg-clip-text text-transparent mb-3">
            KP Sub-Lord Lookup
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm">
            Discover how Krishnamurti Paddhati zooms into any degree with three-level precision
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="flex items-center gap-1.5 mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  i < step ? 'bg-violet-500' : i === step ? 'bg-violet-400' : 'bg-white/10'
                }`}
              />
              {i < step && <CheckCircle2 className="w-3 h-3 text-violet-400" />}
            </div>
          ))}
        </div>
        <div className="text-center text-violet-300 text-sm font-semibold mb-6">
          {STEP_LABELS[step]}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: dir * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -dir * 50 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8"
          >

            {/* ── STEP 0: Setup ── */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Choose a Degree</h2>
                <p className="text-white/60 text-sm mb-5">
                  In astrology, every planet, house cusp, and sensitive point has a precise longitude — a number from 0° to 360°.
                  Pick any degree and we'll reveal its KP three-level ruler.
                </p>

                <label className="block text-sm text-white/70 mb-3">
                  Degree: <span className="text-violet-300 font-mono text-lg">{degree.toFixed(2)}°</span>
                </label>
                <input
                  type="range" min={0} max={360} step={0.01} value={degree}
                  onChange={e => setDegree(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-white/10 accent-violet-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1.5 font-mono">
                  <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="number" min={0} max={360} step={0.01} value={degree}
                    onChange={e => setDegree(Math.min(360, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-32 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-center focus:border-violet-500/50 focus:outline-none"
                  />
                  <span className="text-white/50 text-sm">degrees (0–360)</span>
                </div>

                <WhyBox>
                  Regular Western astrology just says a planet is "in Aries" — that's 1 of 12 signs (30° slice).
                  KP astrology doesn't stop there. It keeps zooming in, narrowing down to a single small sliver of sky
                  with millimetre-like precision. This three-level zoom is what makes KP famous for specific predictions.
                </WhyBox>

                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/8 text-sm text-white/70">
                  <span className="text-white font-semibold">Your selected degree: </span>
                  <span className="font-mono text-violet-300">{degree.toFixed(2)}°</span>
                  <span className="text-white/40 ml-2">— falls in {result.sign.name.en} ({result.nak.name.en})</span>
                </div>
              </div>
            )}

            {/* ── STEP 1: What is KP? ── */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">What is KP Astrology?</h2>
                <p className="text-white/60 text-sm mb-5">
                  KP stands for <strong className="text-white">Krishnamurti Paddhati</strong> — a system invented by K.S. Krishnamurti
                  in the 1960s that dramatically improves prediction accuracy by introducing a three-level zoom.
                </p>

                <HierarchyDiagram />

                <div className="mt-5 space-y-3">
                  <div className="flex gap-3 items-start p-3 rounded-xl bg-green-500/8 border border-green-500/20">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold shrink-0">1</div>
                    <div>
                      <div className="text-green-300 font-semibold text-sm">Sign Lord (Rashi Adhipati)</div>
                      <div className="text-white/65 text-xs mt-0.5">
                        The zodiac is divided into 12 equal signs of 30° each. Every sign has a ruling planet.
                        Eg: 0–30° = Aries, ruled by Mars. Simple — 12 buckets.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 rounded-xl bg-blue-500/8 border border-blue-500/20">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">2</div>
                    <div>
                      <div className="text-blue-300 font-semibold text-sm">Star Lord (Nakshatra Adhipati)</div>
                      <div className="text-white/65 text-xs mt-0.5">
                        Now zoom in further. The zodiac is also split into 27 equal star mansions (Nakshatras) of 13.33° each.
                        Each Nakshatra has its own planetary ruler. This gives 27 buckets — much more specific.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start p-3 rounded-xl bg-violet-500/8 border border-violet-500/20">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">3</div>
                    <div>
                      <div className="text-violet-300 font-semibold text-sm">Sub Lord (KP's Secret Weapon)</div>
                      <div className="text-white/65 text-xs mt-0.5">
                        Each Nakshatra is further split into 9 sub-divisions using the <strong className="text-white">Vimshottari proportion</strong> —
                        the same 120-year planetary period system. This gives 27 × 9 = 243 slices. The Sub Lord is the
                        finest-grain ruler and is used for event timing and house analysis.
                      </div>
                    </div>
                  </div>
                </div>

                <WhyBox>
                  Think of it like a postal address. The Sign Lord is the country, the Star Lord is the city,
                  and the Sub Lord is the street. KP astrologers say: "The sign shows the area, the star shows the result,
                  but the sub determines whether you'll actually get it."
                </WhyBox>
              </div>
            )}

            {/* ── STEP 2: Sign Lord ── */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Step 1: Finding the Sign Lord</h2>
                <p className="text-white/60 text-sm mb-5">
                  The zodiac is divided into 12 equal signs. We find which sign our degree falls into
                  by simple integer division.
                </p>

                <div className="flex justify-center mb-4">
                  <ZodiacRingDiagram deg={result.deg} signIdx={result.signIdx} nakIdx={result.nakIdx} />
                </div>

                <ConceptBox label="The 12 Signs">
                  Each sign spans exactly 30°. So sign #1 (Aries) is 0–30°, sign #2 (Taurus) is 30–60°, and so on.
                  To find which sign: divide the degree by 30, take the integer part. That's your sign number.
                </ConceptBox>

                <FormulaBox>
                  Sign Number = floor({result.deg.toFixed(2)} ÷ 30) = floor({(result.deg / 30).toFixed(4)}) = {result.signIdx}<br />
                  → Sign #{result.signIdx + 1}: {result.sign.name.en}<br />
                  → Ruler: {result.sign.ruler}<br />
                  → Position within sign: {result.posInSign.toFixed(4)}° (= {result.deg.toFixed(2)}° − {result.signIdx} × 30)
                </FormulaBox>

                <ResultBanner
                  label={`Sign Lord (Rashi Adhipati) for ${result.deg.toFixed(2)}°`}
                  value={`${GRAHAS[result.signLordId].symbol} ${GRAHAS[result.signLordId].name.en} — ${result.sign.name.en}`}
                />

                <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {RASHIS.slice(0, 6).map((r, i) => (
                    <div key={i} className={`p-2 rounded-lg text-center border text-xs ${i === result.signIdx ? 'border-violet-400/50 bg-violet-500/15' : 'border-white/8 bg-white/3'}`}>
                      <div className="text-lg">{r.symbol}</div>
                      <div className={i === result.signIdx ? 'text-violet-300 font-bold' : 'text-white/50'}>{i * 30}–{(i + 1) * 30}°</div>
                    </div>
                  ))}
                </div>
                <p className="text-white/35 text-xs text-center mt-1">First 6 signs shown — pattern continues for all 12</p>
              </div>
            )}

            {/* ── STEP 3: Star Lord ── */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Step 2: Finding the Star Lord</h2>
                <p className="text-white/60 text-sm mb-5">
                  Now we zoom in further. The entire zodiac is also divided into 27 Nakshatras (star mansions),
                  each spanning 13.333°. We find which one our degree falls into.
                </p>

                <ConceptBox label="Why 27 Nakshatras?">
                  The Moon takes approximately 27.3 days to orbit the Earth. Ancient astronomers divided the zodiac
                  into 27 equal portions — one for each day of the Moon's journey. Each portion was named after a star
                  cluster the Moon passes through. These became the 27 Nakshatras.
                </ConceptBox>

                <FormulaBox>
                  Nakshatra span = 360° ÷ 27 = 13.3333°<br />
                  Nakshatra # = floor({result.deg.toFixed(2)} ÷ 13.3333) = floor({(result.deg / NAK_SPAN).toFixed(4)}) = {result.nakIdx}<br />
                  → Nakshatra #{result.nakIdx + 1}: {result.nak.name.en}<br />
                  → Star Lord: {result.nak.ruler}<br />
                  → Nakshatra starts at: {result.nakStart.toFixed(4)}°<br />
                  → Position within Nakshatra: {result.posInNak.toFixed(4)}° (out of 13.3333°)
                </FormulaBox>

                {/* Progress bar in nakshatra */}
                <div className="mt-4 mb-2 text-xs text-white/50">Where you are inside {result.nak.name.en}:</div>
                <div className="relative h-5 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-violet-500/50 transition-all"
                    style={{ width: `${(result.posInNak / NAK_SPAN) * 100}%` }}
                  />
                  <div className="absolute top-0 h-full w-0.5 bg-violet-300"
                    style={{ left: `${(result.posInNak / NAK_SPAN) * 100}%` }} />
                  <div className="absolute right-2 top-0 h-full flex items-center">
                    <span className="text-white/40 text-xs">{NAK_SPAN.toFixed(2)}°</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/35 mt-0.5 font-mono">
                  <span>{result.nakStart.toFixed(2)}°</span>
                  <span className="text-violet-400">{result.deg.toFixed(2)}° ← you</span>
                  <span>{(result.nakStart + NAK_SPAN).toFixed(2)}°</span>
                </div>

                <ResultBanner
                  label={`Star Lord (Nakshatra Adhipati) for ${result.deg.toFixed(2)}°`}
                  value={`${GRAHAS[VIMSHOTTARI[result.starLordIdx].id].symbol} ${GRAHAS[VIMSHOTTARI[result.starLordIdx].id].name.en} — ${result.nak.name.en}`}
                />

                <WhyBox>
                  The Star Lord is determined entirely by which Nakshatra you're in. Each of the 27 Nakshatras has
                  a fixed planetary ruler assigned by the Vimshottari Dasha system. These 9 planets rule 3 Nakshatras each.
                  The Star Lord is considered the primary indicator of events in KP — more important than the Sign Lord.
                </WhyBox>
              </div>
            )}

            {/* ── STEP 4: Sub Lord ── */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Step 3: Finding the Sub Lord</h2>
                <p className="text-white/60 text-sm mb-5">
                  The Sub Lord is KP's unique contribution. Each Nakshatra (13.33°) is further divided into 9 sub-sections
                  using the Vimshottari planetary proportions.
                </p>

                <ConceptBox label="Vimshottari Proportions">
                  The Vimshottari Dasha system assigns 120 years total across 9 planets.
                  Ketu=7yr, Venus=20yr, Sun=6yr, Moon=10yr, Mars=7yr, Rahu=18yr, Jupiter=16yr, Saturn=19yr, Mercury=17yr.
                  KP takes these same proportions and applies them <em>within each Nakshatra</em> to create 9 sub-divisions.
                  A planet with more years gets a larger slice.
                </ConceptBox>

                <div className="mb-4">
                  <div className="text-xs text-white/50 mb-1.5">Vimshottari proportions within this Nakshatra:</div>
                  <div className="flex rounded-lg overflow-hidden h-9 border border-white/10">
                    {VIMSHOTTARI.map((v, i) => {
                      const pct = (v.years / TOTAL_YEARS) * 100;
                      const isActive = VIMSHOTTARI[result.starLordIdx + i < 9 ? (result.starLordIdx + i) % 9 : (result.starLordIdx + i) % 9].id === result.currentSub.planetId;
                      return (
                        <div key={i} style={{ width: `${pct}%`, backgroundColor: v.color + '44', borderRight: i < 8 ? '1px solid rgba(255,255,255,0.08)' : undefined }}
                          className="relative flex items-center justify-center text-xs font-bold overflow-hidden"
                          title={`${v.name}: ${v.years} yr`}>
                          {pct > 5 && <span className="text-white/70">{v.label}</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-white/30 mt-0.5">
                    <span>Ke(7)</span><span>Ve(20)</span><span>Su(6)</span><span>Mo(10)</span><span>Ma(7)</span><span>Ra(18)</span><span>Ju(16)</span><span>Sa(19)</span><span>Me(17)</span>
                  </div>
                </div>

                <FormulaBox>
                  Sub-division span = (planet years ÷ 120) × 13.3333°<br />
                  Subdivisions start from the Star Lord's planet, cycling through all 9.<br />
                  Star Lord = {GRAHAS[VIMSHOTTARI[result.starLordIdx].id].name.en} → index {result.starLordIdx} in the Vimshottari order<br />
                  Your position: {result.posInNak.toFixed(4)}° into {result.nak.name.en}
                </FormulaBox>

                <div className="mt-4 mb-1 text-xs text-white/50">Sub-lord bars (you ▲ are at position {result.posInNak.toFixed(2)}°):</div>
                <SubLordBar subs={result.subs} posInNak={result.posInNak} />

                <ResultBanner
                  label={`Sub Lord for ${result.deg.toFixed(2)}°`}
                  value={`${GRAHAS[result.currentSub.planetId].symbol} ${GRAHAS[result.currentSub.planetId].name.en} (${result.currentSub.startDeg.toFixed(3)}° — ${result.currentSub.endDeg.toFixed(3)}°)`}
                />

                {/* Sub-division table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-white/40 border-b border-white/8">
                        <th className="text-left py-2 px-2">#</th>
                        <th className="text-left py-2 px-2">Planet</th>
                        <th className="text-left py-2 px-2">Range</th>
                        <th className="text-right py-2 px-2">Span</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.subs.map((sub, i) => {
                        const v = VIMSHOTTARI.find(vv => vv.id === sub.planetId)!;
                        return (
                          <tr key={i} className={`border-b border-white/5 ${sub.isCurrent ? 'bg-violet-500/12' : ''}`}>
                            <td className="py-1.5 px-2 text-white/35">{i + 1}</td>
                            <td className="py-1.5 px-2">
                              <span className={sub.isCurrent ? 'text-violet-300 font-bold' : 'text-white/70'}>
                                {GRAHAS[sub.planetId].symbol} {GRAHAS[sub.planetId].name.en}
                                {sub.isCurrent && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded bg-violet-500/25 text-violet-300">ACTIVE</span>}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 font-mono text-white/50">
                              {sub.startDeg.toFixed(3)}° – {sub.endDeg.toFixed(3)}°
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono text-white/40">
                              {v.years}/120 = {sub.spanDeg.toFixed(4)}°
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── STEP 5: Summary ── */}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Your KP Result</h2>
                <p className="text-white/60 text-sm mb-5">
                  For <span className="font-mono text-violet-300">{result.deg.toFixed(2)}°</span>, here is the complete three-level KP hierarchy:
                </p>

                <ResultTreeDiagram
                  signLordId={result.signLordId}
                  starLordId={VIMSHOTTARI[result.starLordIdx].id}
                  subLordId={result.currentSub.planetId}
                />

                {/* Three cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                  {[
                    {
                      level: 'Sign Lord', num: 1,
                      planet: GRAHAS[result.signLordId],
                      detail: `${result.sign.name.en} (${result.signIdx * 30}–${(result.signIdx + 1) * 30}°)`,
                      color: '#22c55e',
                    },
                    {
                      level: 'Star Lord', num: 2,
                      planet: GRAHAS[VIMSHOTTARI[result.starLordIdx].id],
                      detail: `${result.nak.name.en} (${result.nakStart.toFixed(2)}–${(result.nakStart + NAK_SPAN).toFixed(2)}°)`,
                      color: '#3b82f6',
                    },
                    {
                      level: 'Sub Lord', num: 3,
                      planet: GRAHAS[result.currentSub.planetId],
                      detail: `${result.currentSub.startDeg.toFixed(3)}–${result.currentSub.endDeg.toFixed(3)}°`,
                      color: '#a78bfa',
                    },
                  ].map((card, i) => (
                    <div key={i} className="rounded-xl p-4 border text-center" style={{ borderColor: card.color + '40', background: card.color + '10' }}>
                      <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: card.color }}>
                        Level {card.num}: {card.level}
                      </div>
                      <div className="text-2xl mb-1">{card.planet.symbol}</div>
                      <div className="text-white font-bold text-sm">{card.planet.name.en}</div>
                      <div className="text-white/45 text-xs mt-1">{card.detail}</div>
                    </div>
                  ))}
                </div>

                <WhyBox>
                  <strong className="text-indigo-200">How KP astrologers use this:</strong> They analyse which houses
                  each of these three lords signify. If the Sub Lord signifies the 7th house (marriage), and you're
                  running a relevant dasha period, marriage is predicted. The Sub Lord is the deciding factor —
                  without a supportive Sub Lord, even a perfect Sign + Star combination may not manifest.
                </WhyBox>

                {/* Adjust degree right here */}
                <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-white/60 text-xs mb-2">Try a different degree:</div>
                  <input
                    type="range" min={0} max={360} step={0.01} value={degree}
                    onChange={e => setDegree(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-white/10 accent-violet-500 cursor-pointer"
                  />
                  <div className="text-center text-violet-300 font-mono text-sm mt-1">{degree.toFixed(2)}°</div>
                </div>
              </div>
            )}

            <NavButtons
              step={step}
              totalSteps={TOTAL_STEPS}
              onPrev={() => goTo(step - 1)}
              onNext={() => goTo(step + 1)}
              prevLabel="← Back"
              nextLabel={step === TOTAL_STEPS - 2 ? 'See Result →' : 'Next →'}
            />
          </motion.div>
        </AnimatePresence>

        {/* Step pills */}
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {STEP_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                i === step
                  ? 'bg-violet-500/30 border border-violet-500/50 text-violet-200'
                  : i < step
                    ? 'bg-violet-500/10 border border-violet-500/20 text-violet-300/70 hover:text-violet-200'
                    : 'bg-white/5 border border-white/8 text-white/30 hover:text-white/50'
              }`}
            >
              {i < step && '✓ '}{label}
            </button>
          ))}
        </div>

      </div>
    </main>
  );
}
