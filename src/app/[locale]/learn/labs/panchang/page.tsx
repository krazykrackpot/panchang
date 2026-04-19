'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Calendar, Sun, Moon, Sparkles, ArrowRight, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import {
  dateToJD, sunLongitude, moonLongitude, toSidereal, lahiriAyanamsha,
  calculateTithi, calculateYoga, calculateKarana, getNakshatraNumber,
  getRashiNumber, normalizeDeg
} from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { RASHIS } from '@/lib/constants/rashis';
import { VARA_DATA } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/labs-panchang.json';

interface Location { name: string; lat: number; lng: number; timezone: string; }

// ── Shared layout pieces ────────────────────────────────────────────────────

function MagicNumber({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex flex-col items-center mx-1 relative group cursor-default">
      <span className="font-mono text-amber-300 font-bold underline decoration-dotted decoration-amber-400/50">{value}</span>
      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 w-52 bg-[#1a1040] border border-amber-500/30 rounded-lg px-3 py-2 text-xs text-text-primary leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl">
        {label}
      </span>
    </span>
  );
}

function CalcRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg ${highlight ? 'bg-amber-500/10 border border-amber-500/25' : 'bg-white/[0.025] border border-white/5'}`}>
      <span className={`text-sm ${highlight ? 'text-amber-200 font-medium' : 'text-text-secondary'}`}>{label}</span>
      <span className={`font-mono text-sm font-semibold ${highlight ? 'text-amber-300' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function ResultBanner({ label, value, sub, resultLabel = 'Result' }: { label: string; value: string; sub?: string; resultLabel?: string }) {
  return (
    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/30 text-center">
      <div className="text-xs text-amber-500/70 uppercase tracking-widest mb-1">{resultLabel}</div>
      <div className="text-3xl font-bold text-amber-200 mb-1">{label}</div>
      <div className="font-mono text-amber-400/80 text-sm">{value}</div>
      {sub && <div className="text-text-secondary text-xs mt-2">{sub}</div>}
    </div>
  );
}

function NavButtons({ onBack, onNext, backLabel = 'Back', nextLabel = 'Next Step', disableNext }: {
  onBack?: () => void; onNext?: () => void; backLabel?: string; nextLabel?: string; disableNext?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-8">
      {onBack
        ? <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />{backLabel}
          </button>
        : <div />}
      {onNext && (
        <button onClick={onNext} disabled={disableNext} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg shadow-amber-900/30">
          {nextLabel}<ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function StepShell({ stepNum, totalSteps, title, subtitle, children }: {
  stepNum: number; totalSteps: number; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <motion.div
      key={stepNum}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
    >
      {/* Step badge */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <span>Step {stepNum}</span>
          <span className="text-amber-500/40">/</span>
          <span className="text-amber-500/60">{totalSteps}</span>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{title}</h2>
      <p className="text-text-secondary text-base mb-8 leading-relaxed">{subtitle}</p>

      {children}
    </motion.div>
  );
}

function WhyBox({ children, heading = 'Why do we need this?' }: { children: React.ReactNode; heading?: string }) {
  return (
    <div className="mb-6 p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
      <div className="text-xs text-indigo-400 uppercase tracking-wider font-semibold mb-2">{heading}</div>
      <div className="text-text-primary text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function FormulaBox({ children, heading = 'The Formula — Explained' }: { children: React.ReactNode; heading?: string }) {
  return (
    <div className="mb-5 p-4 rounded-xl bg-black/30 border border-white/8">
      <div className="text-xs text-amber-500/60 uppercase tracking-wider font-semibold mb-3">{heading}</div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// ── Visual Diagrams ─────────────────────────────────────────────────────────

function JulianDayDiagram({ jd }: { jd: number }) {
  const epoch = 0;          // JD 0 = Jan 1, 4713 BC noon
  const j2000 = 2451545.0;  // Jan 1.5, 2000
  const today = jd;
  const displayJd = Math.round(jd);

  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-3 font-semibold">Timeline: How JD counts time</div>
      <svg viewBox="0 0 500 90" className="w-full" aria-label="Julian Day timeline">
        {/* Timeline baseline */}
        <line x1="30" y1="50" x2="470" y2="50" stroke="#4b5563" strokeWidth="2" />
        <line x1="30" y1="44" x2="30" y2="56" stroke="#4b5563" strokeWidth="2" />
        <line x1="470" y1="44" x2="470" y2="56" stroke="#4b5563" strokeWidth="2" />

        {/* JD 0 label */}
        <circle cx="30" cy="50" r="4" fill="#6b7280" />
        <text x="30" y="72" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">JD 0</text>
        <text x="30" y="82" textAnchor="middle" fill="#6b7280" fontSize="8">4713 BC</text>

        {/* JD 2000 */}
        <circle cx="200" cy="50" r="4" fill="#8b5cf6" />
        <line x1="200" y1="50" x2="200" y2="30" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3,2" />
        <text x="200" y="26" textAnchor="middle" fill="#8b5cf6" fontSize="9" fontFamily="monospace">JD 2,451,545</text>
        <text x="200" y="17" textAnchor="middle" fill="#8b5cf6" fontSize="8">Jan 1, 2000</text>

        {/* Today */}
        <circle cx="420" cy="50" r="6" fill="#f59e0b" />
        <line x1="420" y1="50" x2="420" y2="25" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="420" y="21" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">JD {displayJd.toLocaleString()}</text>
        <text x="420" y="12" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">TODAY</text>

        {/* Arrow direction */}
        <text x="245" y="65" textAnchor="middle" fill="#374151" fontSize="10">→ counting forward forever, never resetting →</text>
      </svg>
      <p className="text-text-secondary/60 text-xs text-center mt-1">Every moment in history has exactly one JD value. No leap-year confusion, no timezone ambiguity.</p>
    </div>
  );
}

function TropicalSiderealDiagram({ tropical, sidereal, ayan }: { tropical: number; sidereal: number; ayan: number }) {
  const cx = 130, cy = 110, r = 80, rInner = 55;
  const toRad = (deg: number) => (deg - 90) * Math.PI / 180;

  // Draw zodiac sign boundaries
  const signs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

  function wedge(startDeg: number, endDeg: number, rOuter: number, rIn: number, fill: string) {
    const s1 = toRad(startDeg), s2 = toRad(endDeg);
    const x1 = cx + rOuter * Math.cos(s1), y1 = cy + rOuter * Math.sin(s1);
    const x2 = cx + rOuter * Math.cos(s2), y2 = cy + rOuter * Math.sin(s2);
    const x3 = cx + rIn * Math.cos(s2), y3 = cy + rIn * Math.sin(s2);
    const x4 = cx + rIn * Math.cos(s1), y4 = cy + rIn * Math.sin(s1);
    return `M${x1},${y1} A${rOuter},${rOuter} 0 0,1 ${x2},${y2} L${x3},${y3} A${rIn},${rIn} 0 0,0 ${x4},${y4} Z`;
  }

  const tropAngle = tropical % 360;
  const sidAngle = sidereal % 360;

  const sunTropX = cx + (r - 12) * Math.cos(toRad(tropAngle));
  const sunTropY = cy + (r - 12) * Math.sin(toRad(tropAngle));
  const sunSidX = cx + (r - 12) * Math.cos(toRad(sidAngle));
  const sunSidY = cy + (r - 12) * Math.sin(toRad(sidAngle));

  // Arc showing the ayanamsha gap
  const a1 = toRad(sidAngle), a2 = toRad(tropAngle);

  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-3 font-semibold">Diagram: Tropical vs Sidereal</div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <svg viewBox="0 0 260 220" className="w-full sm:w-64 flex-shrink-0" aria-label="Zodiac circle showing tropical vs sidereal difference">
          {/* Zodiac wedges */}
          {signs.map((s, i) => (
            <g key={i}>
              <path d={wedge(i * 30, (i + 1) * 30, r, rInner, i % 2 === 0 ? '#1e1b4b' : '#0f172a')}
                fill={i % 2 === 0 ? '#1e1b4b' : '#0f0a23'}
                stroke="#2d2560" strokeWidth="0.5" />
              <text
                x={cx + (rInner + 13) * Math.cos(toRad(i * 30 + 15))}
                y={cy + (rInner + 13) * Math.sin(toRad(i * 30 + 15))}
                textAnchor="middle" dominantBaseline="middle"
                fill="#6366f1" fontSize="9">{s}</text>
            </g>
          ))}

          {/* Equinox reference line (tropical 0°) */}
          <line x1={cx} y1={cy} x2={cx + r * Math.cos(toRad(0))} y2={cy + r * Math.sin(toRad(0))}
            stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
          <text x={cx + (r + 6) * Math.cos(toRad(0))} y={cy + (r + 6) * Math.sin(toRad(0))} fill="#94a3b8" fontSize="7" textAnchor="start">♈ 0°</text>

          {/* Ayanamsha arc (gap between trop and sid) */}
          <path d={`M${cx + (r-4)*Math.cos(a1)},${cy+(r-4)*Math.sin(a1)} A${r-4},${r-4} 0 0,1 ${cx+(r-4)*Math.cos(a2)},${cy+(r-4)*Math.sin(a2)}`}
            fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

          {/* Sidereal Sun */}
          <circle cx={sunSidX} cy={sunSidY} r="7" fill="#f59e0b" />
          <text x={sunSidX} y={sunSidY} textAnchor="middle" dominantBaseline="middle" fontSize="8">☀</text>
          <text x={sunSidX - 10} y={sunSidY - 13} fill="#f59e0b" fontSize="7" fontWeight="bold">Sidereal</text>

          {/* Tropical Sun ghost */}
          <circle cx={sunTropX} cy={sunTropY} r="7" fill="#f59e0b" opacity="0.25" />
          <text x={sunTropX} y={sunTropY} textAnchor="middle" dominantBaseline="middle" fontSize="8" opacity="0.4">☀</text>
          <text x={sunTropX + 4} y={sunTropY - 13} fill="#94a3b8" fontSize="7">Tropical</text>

          {/* Center */}
          <circle cx={cx} cy={cy} r="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="7">🌍</text>
        </svg>

        <div className="text-xs text-text-secondary space-y-2 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0 mt-0.5" />
            <span><strong className="text-amber-300">Sidereal Sun</strong> — where the Sun actually appears against the background stars. Used by Vedic astrology.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400/25 flex-shrink-0 mt-0.5" />
            <span><strong className="text-text-secondary">Tropical Sun</strong> — measured from the Spring Equinox marker. Used by Western astrology.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3 h-1.5 rounded bg-amber-500/60 flex-shrink-0 mt-1" />
            <span><strong className="text-amber-500">Ayanamsha = {ayan.toFixed(2)}°</strong> — the gap, caused by Earth's 26,000-year axial wobble (precession). It grows by ~50" per year.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TithiDiagram({ elongation, tithiNum }: { elongation: number; tithiNum: number }) {
  const cx = 130, cy = 110, orbitR = 80, moonR = 10;

  function moonPos(elongDeg: number) {
    const angle = (elongDeg - 90) * Math.PI / 180;
    return { x: cx + orbitR * Math.cos(angle), y: cy + orbitR * Math.sin(angle) };
  }

  const currentMoon = moonPos(elongation);

  // Key tithi markers
  const markers = [
    { deg: 0, label: 'New Moon', sub: 'Amavasya', color: '#64748b' },
    { deg: 90, label: 'First Quarter', sub: 'Tithi 8', color: '#6366f1' },
    { deg: 180, label: 'Full Moon', sub: 'Purnima', color: '#f0d48a' },
    { deg: 270, label: 'Last Quarter', sub: 'Tithi 23', color: '#6366f1' },
  ];

  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-3 font-semibold">Diagram: Moon–Sun Angle = Tithi</div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <svg viewBox="0 0 260 220" className="w-full sm:w-64 flex-shrink-0">
          {/* Orbit ring */}
          <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4,3" />

          {/* Tithi arcs — 12° each, alternating shading */}
          {Array.from({ length: 30 }, (_, i) => {
            const start = (i * 12 - 90) * Math.PI / 180;
            const end = ((i + 1) * 12 - 90) * Math.PI / 180;
            const x1 = cx + (orbitR + 6) * Math.cos(start), y1 = cy + (orbitR + 6) * Math.sin(start);
            const x2 = cx + (orbitR + 6) * Math.cos(end), y2 = cy + (orbitR + 6) * Math.sin(end);
            const x3 = cx + (orbitR + 14) * Math.cos(end), y3 = cy + (orbitR + 14) * Math.sin(end);
            const x4 = cx + (orbitR + 14) * Math.cos(start), y4 = cy + (orbitR + 14) * Math.sin(start);
            const isActive = i === tithiNum - 1;
            return (
              <path key={i}
                d={`M${x1},${y1} A${orbitR+6},${orbitR+6} 0 0,1 ${x2},${y2} L${x3},${y3} A${orbitR+14},${orbitR+14} 0 0,0 ${x4},${y4} Z`}
                fill={isActive ? '#f59e0b' : i % 2 === 0 ? '#1e1b4b' : '#0f0a23'}
                stroke="#2d2560" strokeWidth="0.3" opacity={isActive ? 0.9 : 0.6} />
            );
          })}

          {/* Key markers */}
          {markers.map(m => {
            const pos = moonPos(m.deg);
            return (
              <g key={m.deg}>
                <circle cx={pos.x} cy={pos.y} r="3" fill={m.color} opacity="0.5" />
                <text x={pos.x} y={pos.y - 10} textAnchor="middle" fill={m.color} fontSize="7" opacity="0.8">{m.sub}</text>
              </g>
            );
          })}

          {/* Elongation arc */}
          {elongation > 5 && (
            <path d={`M${cx},${cy - 20} A20,20 0 ${elongation > 180 ? 1 : 0},1 ${cx + 20 * Math.sin((elongation) * Math.PI / 180)},${cy - 20 * Math.cos((elongation) * Math.PI / 180)}`}
              fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
          )}
          <text x={cx} y={cy + 10} textAnchor="middle" fill="#f59e0b" fontSize="7">{elongation.toFixed(0)}°</text>

          {/* Sun */}
          <circle cx={cx} cy={cy} r="16" fill="#f97316" opacity="0.9" />
          <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="14">☀️</text>

          {/* Current Moon */}
          <circle cx={currentMoon.x} cy={currentMoon.y} r={moonR} fill="#e2e8f0" />
          <text x={currentMoon.x} y={currentMoon.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10">🌙</text>
          <text x={currentMoon.x + 14} y={currentMoon.y - 14} fill="#f59e0b" fontSize="8" fontWeight="bold">Tithi {tithiNum}</text>
        </svg>

        <div className="text-xs text-text-secondary space-y-3 leading-relaxed">
          <p>Each orange wedge in the outer ring = one Tithi (12°). The highlighted wedge is today's Tithi {tithiNum}.</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><span className="text-[10px] text-text-secondary/60">Elongation 0°</span><span>→ New Moon (Amavasya)</span></div>
            <div className="flex items-center gap-2"><span className="text-[10px] text-text-secondary/60">Elongation 90°</span><span>→ First Quarter</span></div>
            <div className="flex items-center gap-2"><span className="text-[10px] text-text-secondary/60">Elongation 180°</span><span>→ Full Moon (Purnima)</span></div>
          </div>
          <p className="text-amber-400">Current elongation: {elongation.toFixed(1)}°</p>
        </div>
      </div>
    </div>
  );
}

function NakshatraDiagram({ moonSid, nakNum }: { moonSid: number; nakNum: number }) {
  const cx = 110, cy = 110, r = 85, rInner = 60;
  const nakNames = ['Ash','Bha','Kri','Roh','Mri','Ard','Pun','Pus','Asl','Mag','PPh','UPh','Has','Chi','Swa','Vis','Anu','Jye','Mul','PAs','UAs','Sra','Dha','Sha','PBh','UBh','Rev'];

  function wedge(i: number, rOut: number, rIn: number) {
    const toRad = (deg: number) => (deg - 90) * Math.PI / 180;
    const start = toRad(i * (360/27)), end = toRad((i+1) * (360/27));
    const x1 = cx + rOut * Math.cos(start), y1 = cy + rOut * Math.sin(start);
    const x2 = cx + rOut * Math.cos(end), y2 = cy + rOut * Math.sin(end);
    const x3 = cx + rIn * Math.cos(end), y3 = cy + rIn * Math.sin(end);
    const x4 = cx + rIn * Math.cos(start), y4 = cy + rIn * Math.sin(start);
    return `M${x1},${y1} A${rOut},${rOut} 0 0,1 ${x2},${y2} L${x3},${y3} A${rIn},${rIn} 0 0,0 ${x4},${y4} Z`;
  }

  const moonAngle = ((moonSid % 360) - 90) * Math.PI / 180;
  const moonX = cx + (r - 16) * Math.cos(moonAngle);
  const moonY = cy + (r - 16) * Math.sin(moonAngle);

  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-3 font-semibold">Diagram: 27 Nakshatras — Moon's position today</div>
      <svg viewBox="0 0 220 220" className="w-full max-w-[220px] mx-auto">
        {nakNames.map((name, i) => {
          const isActive = i === nakNum - 1;
          const midAngle = ((i + 0.5) * (360/27) - 90) * Math.PI / 180;
          const textR = (r + rInner) / 2;
          return (
            <g key={i}>
              <path d={wedge(i, r, rInner)}
                fill={isActive ? '#f59e0b' : i % 3 === 0 ? '#1e1b4b' : i % 3 === 1 ? '#0f0a23' : '#111827'}
                stroke="#2d2560" strokeWidth="0.5"
                opacity={isActive ? 1 : 0.7} />
              <text
                x={cx + textR * Math.cos(midAngle)}
                y={cy + textR * Math.sin(midAngle)}
                textAnchor="middle" dominantBaseline="middle"
                fill={isActive ? '#1a1040' : '#6366f1'}
                fontSize={isActive ? '7.5' : '6'}
                fontWeight={isActive ? 'bold' : 'normal'}>
                {name}
              </text>
            </g>
          );
        })}
        {/* Moon marker */}
        <circle cx={moonX} cy={moonY} r="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
        <text x={moonX} y={moonY + 1} textAnchor="middle" dominantBaseline="middle" fontSize="11">🌙</text>
        {/* Center */}
        <circle cx={cx} cy={cy} r={rInner} fill="#060918" stroke="#1e293b" strokeWidth="1" />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">27</text>
        <text x={cx} y={cx + 7} textAnchor="middle" fill="#64748b" fontSize="7">Nakshatras</text>
      </svg>
      <p className="text-text-secondary/60 text-xs text-center mt-2">The highlighted wedge is today's Nakshatra. The Moon is shown at its current position.</p>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function PanchangLabPage() {
  const locale = useLocale() as Locale;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [step, setStep] = useState(0);         // 0 = setup, 1-8 = calc steps, 9 = summary
  const [date, setDate] = useState(todayStr);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState('');

  const TOTAL_CALC_STEPS = 8;

  // ── Pre-compute everything once inputs are set ──────────────────
  const calc = useMemo(() => {
    if (!date) return null;
    const [y, m, d] = date.split('-').map(Number);
    const tz = location?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcOffset = getUTCOffsetForDate(y, m, d, tz);
    const hourUT = 12 - utcOffset;
    const jd = dateToJD(y, m, d, hourUT);

    const sunTrop = sunLongitude(jd);
    const ayan = lahiriAyanamsha(jd);
    const sunSid = toSidereal(sunTrop, jd);
    const sunRashi = RASHIS[getRashiNumber(sunSid) - 1];

    const moonTrop = moonLongitude(jd);
    const moonSid = toSidereal(moonTrop, jd);
    const moonRashi = RASHIS[getRashiNumber(moonSid) - 1];

    const tithiResult = calculateTithi(jd);
    const tithiData = TITHIS[tithiResult.number - 1];
    const elongation = tithiResult.degree;

    const nakNum = getNakshatraNumber(moonSid);
    const nakData = NAKSHATRAS[nakNum - 1];
    const nakSpan = 360 / 27;
    const posInNak = moonSid % nakSpan;
    const pada = Math.floor(posInNak / (nakSpan / 4)) + 1;

    const yogaNum = calculateYoga(jd);
    const yogaData = YOGAS[yogaNum - 1];
    const yogaSum = normalizeDeg(sunSid + moonSid);

    const karanaNum = calculateKarana(jd);
    const karanaData = KARANAS[karanaNum - 1];
    const karanaIndex = Math.floor(elongation / 6);

    const weekday = Math.floor(jd + 1.5) % 7;
    const varaData = VARA_DATA[weekday];

    const [dy, dm, dd] = [y, m, d];
    // B correction for Gregorian calendar
    const mAdj = dm <= 2 ? dm + 12 : dm;
    const yAdj = dm <= 2 ? dy - 1 : dy;
    const A = Math.floor(yAdj / 100);
    const B = 2 - A + Math.floor(A / 4);

    return {
      y, m, d, tz, utcOffset, hourUT, jd, B, A,
      mAdj, yAdj,
      sunTrop, ayan, sunSid, sunRashi,
      moonTrop, moonSid, moonRashi,
      tithiResult, tithiData, elongation,
      nakNum, nakData, nakSpan, posInNak, pada,
      yogaNum, yogaData, yogaSum,
      karanaNum, karanaData, karanaIndex,
      weekday, varaData,
    };
  }, [date, location]);

  const t = (key: string) => lt((LJ as unknown as Record<string, LocaleText>)[key], locale);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_CALC_STEPS + 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  // ── Progress bar ────────────────────────────────────────────────
  const progressSteps = [t('stepSetup'), t('stepJulianDay'), t('stepSun'), t('stepMoon'), t('stepTithi'), t('stepNakshatra'), t('stepYoga'), t('stepKarana'), t('stepVara'), t('stepSummary')];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
            {t('pageTitle')}
          </h1>
        </div>
        <p className="text-text-secondary text-base">{t('pageSubtitle')}</p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto mb-10 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max px-2">
          {progressSteps.map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <button
                onClick={() => { if (i === 0 || calc) setStep(i); }}
                disabled={i > 0 && !calc}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === step
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    : i < step
                    ? 'text-green-400/80 hover:text-green-300'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                {i < step && i > 0 ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px]">{i}</span>}
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < progressSteps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-700 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-xl min-h-[500px]">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Setup ───────────────────────────────────── */}
          {step === 0 && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🌅</div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('buildTitle')}</h2>
                <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
                  A Panchang is a Vedic almanac — it tells you the exact state of the Sun and Moon for any day and place on Earth.
                  We're going to calculate it step by step, and explain every single number along the way.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-6">
                <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-2">{t('whatWeCalculate')}</div>
                <div className="grid grid-cols-2 gap-2">
                  {['Julian Day Number', 'Sun\'s Position', 'Moon\'s Position', 'Tithi (Lunar Day)', 'Nakshatra (Star)', 'Yoga', 'Karana', 'Vara (Weekday)'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-text-primary text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-amber-300/80 mb-1.5">{t('date')}</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-300/80 mb-1.5">{t('location')} <span className="text-text-secondary/60 font-normal">{t('neededForTimezone')}</span></label>
                  <LocationSearch
                    value={locationName}
                    onSelect={loc => { setLocation(loc); setLocationName(loc.name); }}
                    placeholder={t('searchCity')}
                    className="w-full"
                  />
                  {!location && <p className="text-text-secondary/60 text-xs mt-1.5">{t('ifLeftBlank')}</p>}
                </div>
              </div>

              <NavButtons
                nextLabel={t('startCalculating')}
                onNext={() => setStep(1)}
                disableNext={!date}
              />
            </motion.div>
          )}

          {/* ── STEP 1: Julian Day ───────────────────────────────── */}
          {step === 1 && calc && (
            <StepShell key="jd" stepNum={1} totalSteps={TOTAL_CALC_STEPS}
              title="Julian Day Number"
              subtitle="Before we can find the Sun or Moon's position, we need a single, unambiguous way to refer to this exact moment in time."
            >
              <WhyBox heading={t('whyDoWeNeedThis')}>
                Imagine trying to calculate "how many days since January 1st, 2000?" — you'd have to count leap years, months of different lengths, calendar reforms... it's a mess. So astronomers invented the <strong className="text-white">Julian Day Number (JD)</strong>: a single, continuously-counting number that starts from noon on January 1st, 4713 BC and never resets. Every moment in history has exactly one JD. This makes time arithmetic trivial: to find how many days between two events, just subtract their JD numbers.
              </WhyBox>

              <JulianDayDiagram jd={calc.jd} />

              <FormulaBox heading="The Method — How It Works">
                <div className="space-y-3 text-text-primary mb-6">
                  <p>The goal is simple: convert any calendar date into a single continuous day count. The approach has 5 steps:</p>
                  <ol className="list-decimal list-inside space-y-2 text-text-primary/90">
                    <li><strong className="text-amber-300">Pick an ancient zero-point</strong> — astronomers chose noon on January 1st, 4713 BC as "Day 0." This date (the start of the Julian Period) was chosen because it predates all recorded history, so every historical date has a positive JD.</li>
                    <li><strong className="text-amber-300">Count full years</strong> — multiply the number of years since the zero-point by 365.25 (the average year length, accounting for leap years). This gives an approximate day count.</li>
                    <li><strong className="text-amber-300">Count the months within the current year</strong> — months have uneven lengths (28–31 days), so the formula uses 30.6001 days/month as an average, then adds the exact day of the month. A trick: January and February are treated as months 13–14 of the <em>previous</em> year, so the short month (February) falls at the end of the "year" and doesn't complicate leap-year logic.</li>
                    <li><strong className="text-amber-300">Fix the calendar reform</strong> — in 1582, Pope Gregory XIII dropped 10 days to correct accumulated drift. The "B correction" accounts for this: it removes the extra leap days that the Julian calendar counted but the Gregorian calendar doesn't (century years like 1700, 1800, 1900 are NOT leap years, but 2000 is).</li>
                    <li><strong className="text-amber-300">Apply a final offset</strong> — the intermediate sum overshoots the actual epoch by a fixed amount. Subtracting 1524.5 aligns everything so that JD 0.0 = noon, January 1st, 4713 BC. The .5 matters because JD counts from noon, not midnight.</li>
                  </ol>
                </div>

                <h4 className="text-gold-light font-semibold text-sm mb-3">The Formula</h4>
                <div className="font-mono text-amber-200/90 text-center py-2 mb-4 text-base">
                  JD = floor(365.25 × (Y + 4716)) + floor(30.6001 × (M + 1)) + D + h/24 + B − 1524.5
                </div>
                <div className="space-y-3 text-text-primary text-sm">
                  <p><strong className="text-amber-300">365.25 × (Y + 4716)</strong> — Total days from years. Y + 4716 shifts the year to count from the Julian epoch. 365.25 accounts for leap years (one extra day every 4 years). The floor() rounds down to whole days.</p>
                  <p><strong className="text-amber-300">30.6001 × (M + 1)</strong> — Total days from months. The "M + 1" offset and floor() together approximate the irregular month lengths. <span className="text-text-secondary/60">Why 30.6001 and not 30.6? Floating-point safety — 30.6 × 13 = 397.8 which floor() gives 397, but the correct value should be 397. The .0001 ensures we never round one short.</span></p>
                  <p><strong className="text-amber-300">D + h/24</strong> — The day of the month plus the fractional day. JD starts at noon, so noon = 0.0, 6pm = 0.25, midnight = 0.5, 6am = 0.75.</p>
                  <p><strong className="text-amber-300">B</strong> — Gregorian correction: B = 2 − floor(Y/100) + floor(Y/400). This removes the 10 days dropped in 1582 and adjusts for century years. For dates before October 15, 1582 (Julian calendar), B = 0.</p>
                  <p><strong className="text-amber-300">−1524.5</strong> — Why this number? It's the accumulated offset from the formula's internal arithmetic. The year/month terms overcount by exactly 1524.5 days relative to the true epoch. This constant was empirically derived so that the formula produces JD = 0.0 when you input noon on January 1st, 4713 BC. The .5 accounts for JD's noon-based counting.</p>
                </div>
              </FormulaBox>

              <div className="space-y-2">
                <CalcRow label={`Input date`} value={`${calc.y}-${String(calc.m).padStart(2,'0')}-${String(calc.d).padStart(2,'0')}`} />
                <CalcRow label="Month adjusted (Jan/Feb → 13/14 of prev year)" value={`M = ${calc.mAdj}, Y = ${calc.yAdj}`} />
                <CalcRow label="Century A = floor(Y / 100)" value={`${calc.A}`} />
                <CalcRow label="Gregorian correction B = 2 − A + floor(A/4)" value={`${calc.B}`} />
                <CalcRow label="Noon local time in UT hours" value={`${calc.hourUT.toFixed(4)} h  (noon − UTC offset ${calc.utcOffset >= 0 ? '+' : ''}${calc.utcOffset})`} />
                <CalcRow label="365.25 × (Y + 4716)" value={(365.25 * (calc.yAdj + 4716)).toFixed(2)} />
                <CalcRow label="30.6001 × (M + 1)" value={(30.6001 * (calc.mAdj + 1)).toFixed(4)} />
                <CalcRow label="Final Julian Day Number" value={calc.jd.toFixed(5)} highlight />
              </div>

              <ResultBanner resultLabel={t('result')}
                label={`JD ${calc.jd.toFixed(5)}`}
                value="A unique timestamp for this exact moment in astronomical time"
                sub="This single number is what all following calculations start from"
              />

              <NavButtons onBack={back} onNext={next} backLabel={t('back')} nextLabel={t('nextStep')} />
            </StepShell>
          )}

          {/* ── STEP 2: Sun Position ─────────────────────────────── */}
          {step === 2 && calc && (
            <StepShell key="sun" stepNum={2} totalSteps={TOTAL_CALC_STEPS}
              title="Where is the Sun right now?"
              subtitle="We calculate the Sun's exact position in the sky as a degree from 0° to 360°."
            >
              <WhyBox heading={t('whyDoWeNeedThis')}>
                The Sun moves roughly 1° per day through the zodiac, completing one full circle in a year. Knowing its exact degree tells us which zodiac sign it's in — and that's needed to calculate Tithi, Yoga, and other Panchang elements. We compute this using Meeus's planetary equations — a set of sine and cosine terms derived from centuries of precise astronomical observation.
              </WhyBox>

              <TropicalSiderealDiagram tropical={calc.sunTrop} sidereal={calc.sunSid} ayan={calc.ayan} />

              <div className="mb-5 p-4 rounded-xl bg-orange-500/8 border border-orange-500/20">
                <div className="text-xs text-orange-400 uppercase tracking-wider font-semibold mb-2">Tropical vs Sidereal — The Key Difference</div>
                <p className="text-text-primary text-sm leading-relaxed">
                  Western astrology measures the Sun against the <strong className="text-white">Spring Equinox point</strong> (called Tropical). But the Earth wobbles very slightly on its axis — a cycle called <strong className="text-white">precession</strong> that takes ~26,000 years to complete. Over 2,000 years this wobble has shifted the actual star positions by about 24°. Vedic astrology accounts for this shift using the <strong className="text-amber-300">Ayanamsha</strong> — a correction value that increases by ~50 arc-seconds every year. The Lahiri Ayanamsha (used officially in India) is currently about <strong className="text-amber-300">{calc.ayan.toFixed(2)}°</strong>.
                </p>
              </div>

              <FormulaBox heading={t('theFormulaExplained')}>
                <div className="font-mono text-amber-200/90 text-center py-2 mb-3 text-base">
                  Sidereal = Tropical − Ayanamsha
                </div>
                <p className="text-text-primary text-sm">Think of it like this: Tropical says "the Sun is 45° from the Spring Equinox marker". Sidereal says "but the stars have drifted 24° since we set that marker, so against the actual stars, the Sun is really at 21°." Vedic astrology always uses the star-based (sidereal) position.</p>
              </FormulaBox>

              <div className="space-y-2">
                <CalcRow label="Julian Day (from Step 1)" value={calc.jd.toFixed(5)} />
                <CalcRow label="Tropical Sun longitude (Meeus algorithm)" value={`${calc.sunTrop.toFixed(4)}°`} />
                <CalcRow label="Lahiri Ayanamsha (precession correction)" value={`${calc.ayan.toFixed(4)}°`} />
                <CalcRow label="Sidereal Sun = Tropical − Ayanamsha" value={`${calc.sunSid.toFixed(4)}°`} highlight />
                <CalcRow label="Zodiac sign (every 30° = 1 sign)" value={`${lt(calc.sunRashi.name as LocaleText, locale)}  (${calc.sunSid.toFixed(2)}° ÷ 30 = sign ${Math.floor(calc.sunSid / 30) + 1})`} />
                <CalcRow label="Degree within that sign" value={`${(calc.sunSid % 30).toFixed(2)}°`} />
              </div>

              <ResultBanner resultLabel={t('result')}
                label={`Sun in ${lt(calc.sunRashi.name as LocaleText, locale)} ${calc.sunRashi.symbol}`}
                value={`${calc.sunSid.toFixed(4)}° sidereal`}
                sub={`The Sun has been in ${lt(calc.sunRashi.name as LocaleText, locale)} since roughly ${Math.round((calc.sunSid % 30) / 1)} day(s) into the sign`}
              />

              <NavButtons onBack={back} onNext={next} backLabel={t('back')} nextLabel={t('nextStep')} />
            </StepShell>
          )}

          {/* ── STEP 3: Moon Position ────────────────────────────── */}
          {step === 3 && calc && (
            <StepShell key="moon" stepNum={3} totalSteps={TOTAL_CALC_STEPS}
              title="Where is the Moon right now?"
              subtitle="The Moon moves about 13° per day — much faster than the Sun. Its position drives most of the Panchang."
            >
              <WhyBox heading={t('whyDoWeNeedThis')}>
                While the Sun takes one year to circle the zodiac, the Moon does it in just 27.3 days. This rapid movement is what makes daily Panchang calculations meaningful — the Moon changes Nakshatra roughly every day, creates a new Tithi every ~24 hours, and its angle relative to the Sun defines the lunar calendar. Almost every element of the Panchang depends on the Moon's position.
              </WhyBox>

              <FormulaBox heading={t('theFormulaExplained')}>
                <div className="font-mono text-amber-200/90 text-center py-2 mb-3 text-base">
                  Sidereal Moon = Tropical Moon − Ayanamsha
                </div>
                <p className="text-text-primary text-sm">
                  Same concept as the Sun — we compute the tropical position using Meeus's lunar theory (which uses many more correction terms than the Sun, because the Moon is pulled by both the Sun and Earth's equatorial bulge), then subtract the same Lahiri Ayanamsha to get the sidereal position.
                </p>
              </FormulaBox>

              <div className="space-y-2">
                <CalcRow label="Julian Day (from Step 1)" value={calc.jd.toFixed(5)} />
                <CalcRow label="Tropical Moon longitude (Meeus)" value={`${calc.moonTrop.toFixed(4)}°`} />
                <CalcRow label="Lahiri Ayanamsha (same as Sun)" value={`${calc.ayan.toFixed(4)}°`} />
                <CalcRow label="Sidereal Moon = Tropical − Ayanamsha" value={`${calc.moonSid.toFixed(4)}°`} highlight />
                <CalcRow label="Zodiac sign" value={`${lt(calc.moonRashi.name as LocaleText, locale)}  (${calc.moonSid.toFixed(2)}° ÷ 30 = sign ${Math.floor(calc.moonSid / 30) + 1})`} />
                <CalcRow label="Degree within that sign" value={`${(calc.moonSid % 30).toFixed(2)}°`} />
              </div>

              <ResultBanner resultLabel={t('result')}
                label={`Moon in ${lt(calc.moonRashi.name as LocaleText, locale)} ${calc.moonRashi.symbol}`}
                value={`${calc.moonSid.toFixed(4)}° sidereal`}
                sub="The Moon's position drives Tithi, Nakshatra, and Yoga — the next three steps"
              />

              <NavButtons onBack={back} onNext={next} backLabel={t('back')} nextLabel={t('nextStep')} />
            </StepShell>
          )}

          {/* ── STEP 4: Tithi ────────────────────────────────────── */}
          {step === 4 && calc && (
            <StepShell key="tithi" stepNum={4} totalSteps={TOTAL_CALC_STEPS}
              title="Tithi — The Lunar Day"
              subtitle="A Tithi is NOT the same as a calendar day. It's the time it takes the Moon to gain exactly 12° on the Sun."
            >
              <WhyBox heading={t('whyDoWeNeedThis')}>
                Think of the Sun and Moon like two runners on a circular track. At New Moon (Amavasya), they're at the same position — 0° apart. Each day the Moon pulls ahead by about 12°. When the Moon is exactly 12° ahead, that's the 1st Tithi. At 24°, it's the 2nd. At 180° (opposite side), it's Full Moon (Purnima). There are 30 Tithis in a lunar month (15 in bright fortnight + 15 in dark fortnight). Since the Moon doesn't move at perfectly constant speed, a Tithi can be shorter or longer than 24 hours — sometimes two Tithis happen in one calendar day (Kshaya), sometimes a Tithi spans two calendar days (Vriddhi).
              </WhyBox>

              <TithiDiagram elongation={calc.elongation} tithiNum={calc.tithiResult.number} />

              <FormulaBox heading={t('theFormulaExplained')}>
                <div className="font-mono text-amber-200/90 text-center py-2 mb-3 text-base">
                  Elongation = Moon − Sun  (mod 360°)
                  <br />
                  Tithi = floor(Elongation ÷ 12) + 1
                </div>
                <p className="text-text-primary text-sm">
                  <strong className="text-amber-300">Why divide by 12?</strong> Because each Tithi spans exactly 12° of elongation. 360° ÷ 30 Tithis = 12° per Tithi. The floor (round down) gives which Tithi we're currently inside, and +1 converts from 0-indexed to 1-indexed (so Tithi 1 starts at 0°, not Tithi 0).
                </p>
              </FormulaBox>

              <div className="space-y-2">
                <CalcRow label="Moon sidereal (Step 3)" value={`${calc.moonSid.toFixed(4)}°`} />
                <CalcRow label="Sun sidereal (Step 2)" value={`${calc.sunSid.toFixed(4)}°`} />
                <CalcRow label="Elongation = Moon − Sun (mod 360°)" value={`${calc.elongation.toFixed(4)}°`} highlight />
                <CalcRow label="Elongation ÷ 12 = Tithi index" value={(calc.elongation / 12).toFixed(4)} />
                <CalcRow label="floor(...) + 1 = Tithi number" value={String(calc.tithiResult.number)} />
                <CalcRow label="Paksha" value={calc.tithiData.paksha === 'shukla' ? 'Shukla Paksha (Bright / Waxing Moon)' : 'Krishna Paksha (Dark / Waning Moon)'} />
              </div>

              <ResultBanner resultLabel={t('result')}
                label={lt(calc.tithiData.name as LocaleText, locale)}
                value={`Tithi ${calc.tithiResult.number} of 30`}
                sub={calc.tithiData.paksha === 'shukla' ? `Shukla (bright) fortnight — Moon is waxing toward Full Moon` : `Krishna (dark) fortnight — Moon is waning toward New Moon`}
              />

              <NavButtons onBack={back} onNext={next} backLabel={t('back')} nextLabel={t('nextStep')} />
            </StepShell>
          )}

          {/* ── STEP 5: Nakshatra ────────────────────────────────── */}
          {step === 5 && calc && (
            <StepShell key="nakshatra" stepNum={5} totalSteps={TOTAL_CALC_STEPS}
              title="Nakshatra — The Moon's Star Mansion"
              subtitle="While the zodiac has 12 signs, the sky is also divided into 27 Nakshatras — smaller star clusters the Moon passes through."
            >
              <WhyBox heading={t('whyDoWeNeedThis')}>
                Ancient Indian astronomers noticed that the Moon passes through a distinct group of stars every night over its 27-day cycle. They named these 27 star-clusters "Nakshatras" (lunar mansions). Each Nakshatra has a ruling planet, a presiding deity, and a distinct character. Your birth Nakshatra (where the Moon was when you were born) is considered even more personal than your Sun sign in Vedic astrology — it's the foundation of the Dasha system (life period predictions).
              </WhyBox>

              <NakshatraDiagram moonSid={calc.moonSid} nakNum={calc.nakNum} />

              <FormulaBox heading={t('theFormulaExplained')}>
                <div className="font-mono text-amber-200/90 text-center py-2 mb-3 text-base">
                  Nakshatra = floor(Moon° ÷ 13.333°) + 1
                  <br />
                  Pada = floor((Moon° mod 13.333°) ÷ 3.333°) + 1
                </div>
                <p className="text-text-primary text-sm">
                  <strong className="text-amber-300">Why 13.333°?</strong> Because 360° ÷ 27 Nakshatras = 13.333° per Nakshatra. So we divide the Moon's position by 13.333 to find which "slot" it's in.
                  <br /><br />
                  <strong className="text-amber-300">What's a Pada?</strong> Each Nakshatra is further divided into 4 equal quarters called Padas (3.333° each). So there are 27 × 4 = 108 Padas total — a sacred number in Vedic culture. Your Pada determines your birth syllable (the first syllable of your Vedic name).
                </p>
              </FormulaBox>

              <div className="space-y-2">
                <CalcRow label="Moon sidereal (Step 3)" value={`${calc.moonSid.toFixed(4)}°`} />
                <CalcRow label="Each Nakshatra spans (360° ÷ 27)" value={`${calc.nakSpan.toFixed(4)}°`} />
                <CalcRow label="Moon ÷ 13.333° = Nakshatra index" value={(calc.moonSid / calc.nakSpan).toFixed(4)} />
                <CalcRow label="floor(...) + 1 = Nakshatra number" value={String(calc.nakNum)} />
                <CalcRow label="Position within Nakshatra" value={`${calc.posInNak.toFixed(4)}°`} />
                <CalcRow label="Pada = floor(position ÷ 3.333°) + 1" value={`${calc.pada} / 4`} />
                <CalcRow label="Ruling planet" value={lt(calc.nakData.rulerName as LocaleText, locale)} />
              </div>

              <ResultBanner resultLabel={t('result')}
                label={`${lt(calc.nakData.name as LocaleText, locale)}, Pada ${calc.pada}`}
                value={`Nakshatra ${calc.nakNum} of 27`}
                sub={`Ruled by ${lt(calc.nakData.rulerName as LocaleText, locale)}`}
              />

              <NavButtons onBack={back} onNext={next} backLabel={t('back')} nextLabel={t('nextStep')} />
            </StepShell>
          )}

          {/* ── STEP 6: Yoga ─────────────────────────────────────── */}
          {step === 6 && calc && (
            <StepShell key="yoga" stepNum={6} totalSteps={TOTAL_CALC_STEPS}
              title="Yoga — The Sun–Moon Combination"
              subtitle="A Yoga is a quality of the day determined by adding the Sun and Moon positions together."
            >
              <WhyBox heading={t('whyDoWeNeedThis')}>
                While Tithi measures the Moon's angle <em>ahead of</em> the Sun, Yoga measures their combined angular <em>sum</em>. Think of it as the total energy of the day — how the Sun's solar energy and the Moon's lunar energy combine together. There are 27 Yogas (same count as Nakshatras), each with a distinct character ranging from auspicious (like Siddha — "perfect achievement") to inauspicious (like Vyatipata — "calamity"). Traditional texts prescribe avoiding certain activities on unfavorable Yoga days.
              </WhyBox>

              <FormulaBox heading={t('theFormulaExplained')}>
                <div className="font-mono text-amber-200/90 text-center py-2 mb-3 text-base">
                  Sum = (Sun° + Moon°) mod 360°
                  <br />
                  Yoga = floor(Sum ÷ 13.333°) + 1
                </div>
                <p className="text-text-primary text-sm">
                  <strong className="text-amber-300">Why the same 13.333°?</strong> Because Yoga uses the same 27-fold division as Nakshatra — dividing the circle into 27 equal parts of 13.333° each. The only difference is the input: instead of just the Moon, we add Sun + Moon together and divide that sum. The "mod 360" wraps the sum back into a 0–360° range if it exceeds 360°.
                </p>
              </FormulaBox>

              <div className="space-y-2">
                <CalcRow label="Sun sidereal (Step 2)" value={`${calc.sunSid.toFixed(4)}°`} />
                <CalcRow label="Moon sidereal (Step 3)" value={`${calc.moonSid.toFixed(4)}°`} />
                <CalcRow label="Sun + Moon (before mod)" value={`${(calc.sunSid + calc.moonSid).toFixed(4)}°`} />
                <CalcRow label="Sum mod 360° = yoga input" value={`${calc.yogaSum.toFixed(4)}°`} highlight />
                <CalcRow label="Sum ÷ 13.333°" value={(calc.yogaSum / (360 / 27)).toFixed(4)} />
                <CalcRow label="floor(...) + 1 = Yoga number" value={String(calc.yogaNum)} />
                <CalcRow label="Nature" value={calc.yogaData.nature === 'auspicious' ? 'Auspicious ✓' : calc.yogaData.nature === 'inauspicious' ? 'Inauspicious — avoid major activities' : 'Mixed'} />
              </div>

              <ResultBanner resultLabel={t('result')}
                label={lt(calc.yogaData.name as LocaleText, locale)}
                value={`Yoga ${calc.yogaNum} of 27`}
                sub={lt(calc.yogaData.meaning as LocaleText, locale)}
              />

              <NavButtons onBack={back} onNext={next} backLabel={t('back')} nextLabel={t('nextStep')} />
            </StepShell>
          )}

          {/* ── STEP 7: Karana ───────────────────────────────────── */}
          {step === 7 && calc && (
            <StepShell key="karana" stepNum={7} totalSteps={TOTAL_CALC_STEPS}
              title="Karana — The Half-Tithi"
              subtitle="A Karana is simply half a Tithi — the Moon advancing 6° instead of 12°. There are two Karanas per Tithi."
            >
              <WhyBox heading={t('whyDoWeNeedThis')}>
                Ancient Vedic astrologers needed a finer-grained time unit than a Tithi for scheduling rituals and activities. They split each Tithi in half, calling each half a Karana. So a Karana lasts roughly 6 hours (half of ~12 hours). There are 11 types of Karanas: 7 "Chara" (movable, repeating) Karanas that cycle through the lunar month, and 4 "Sthira" (fixed, non-repeating) Karanas that appear only once each month at specific positions.
              </WhyBox>

              <FormulaBox heading={t('theFormulaExplained')}>
                <div className="font-mono text-amber-200/90 text-center py-2 mb-3 text-base">
                  Raw Index = floor(Elongation ÷ 6°)
                  <br />
                  Map to 11 Karanas (7 movable + 4 fixed)
                </div>
                <p className="text-text-primary text-sm">
                  <strong className="text-amber-300">Why divide by 6?</strong> Each Karana spans exactly 6° of elongation (half of a Tithi's 12°). So 360° ÷ 6° = 60 Karana slots per lunar month. The 4 fixed Karanas occupy slots 0, 57, 58, and 59. The remaining 56 slots cycle through the 7 movable Karanas 8 times (7 × 8 = 56).
                </p>
              </FormulaBox>

              <div className="space-y-2">
                <CalcRow label="Elongation (from Step 4)" value={`${calc.elongation.toFixed(4)}°`} />
                <CalcRow label="Elongation ÷ 6° = raw index" value={(calc.elongation / 6).toFixed(4)} />
                <CalcRow label="floor(...) = Karana slot" value={String(calc.karanaIndex)} />
                <CalcRow label="Mapped Karana number" value={String(calc.karanaNum)} />
                <CalcRow label="Type" value={calc.karanaData.type === 'chara' ? 'Chara (Movable) — repeats 8 times per month' : 'Sthira (Fixed) — appears only once per month'} />
              </div>

              <ResultBanner resultLabel={t('result')}
                label={lt(calc.karanaData.name as LocaleText, locale)}
                value={`Karana ${calc.karanaNum} of 11`}
                sub={calc.karanaData.type === 'chara' ? 'Movable Karana — auspicious for most activities' : 'Fixed Karana — check classical texts for specific guidance'}
              />

              <NavButtons onBack={back} onNext={next} backLabel={t('back')} nextLabel={t('nextStep')} />
            </StepShell>
          )}

          {/* ── STEP 8: Vara ─────────────────────────────────────── */}
          {step === 8 && calc && (
            <StepShell key="vara" stepNum={8} totalSteps={TOTAL_CALC_STEPS}
              title="Vara — The Weekday"
              subtitle="The simplest element — but even here, the formula has a clever trick worth understanding."
            >
              <WhyBox heading={t('whyDoWeNeedThis')}>
                The Vedic week (Vara) uses the same 7-day cycle as the modern week, with the same planetary assignments: Sun→Sunday, Moon→Monday, Mars→Tuesday, Mercury→Wednesday, Jupiter→Thursday, Venus→Friday, Saturn→Saturday. The weekday influences the overall tone of the day and which deity is worshipped. The trick is extracting the weekday directly from the Julian Day Number — no calendar arithmetic needed.
              </WhyBox>

              <FormulaBox heading={t('theFormulaExplained')}>
                <div className="font-mono text-amber-200/90 text-center py-2 mb-3 text-base">
                  Weekday = floor(JD + 1.5) mod 7
                  <br />
                  0 = Sunday, 1 = Monday, … 6 = Saturday
                </div>
                <p className="text-text-primary text-sm">
                  <strong className="text-amber-300">Why +1.5?</strong> Julian Days start at noon (JD 0 was noon, January 1st, 4713 BC — which happened to be a Monday). Adding 1.5 shifts the reference so that when we take floor(), we're counting from midnight rather than noon. The +1 part shifts the alignment so that JD 0 mod 7 = 0 = Sunday correctly.
                  <br /><br />
                  <strong className="text-amber-300">Why mod 7?</strong> The week repeats every 7 days. Modulo 7 finds the remainder — any number mod 7 gives 0–6, which maps directly to the 7 weekdays.
                </p>
              </FormulaBox>

              <div className="space-y-2">
                <CalcRow label="Julian Day (from Step 1)" value={calc.jd.toFixed(5)} />
                <CalcRow label="JD + 1.5" value={(calc.jd + 1.5).toFixed(5)} />
                <CalcRow label="floor(JD + 1.5)" value={String(Math.floor(calc.jd + 1.5))} />
                <CalcRow label="mod 7 = weekday index" value={String(calc.weekday)} highlight />
                <CalcRow label="Ruling planet" value={lt(calc.varaData.ruler as LocaleText, locale)} />
              </div>

              <ResultBanner resultLabel={t('result')}
                label={lt(calc.varaData.name as LocaleText, locale)}
                value={`Day index ${calc.weekday} (0 = Sunday)`}
                sub={`Ruled by ${lt(calc.varaData.ruler as LocaleText, locale)} — ${lt(calc.varaData.ruler as LocaleText, locale)}'s day for worship and activities`}
              />

              <NavButtons onBack={back} onNext={next} backLabel={t('back')} nextLabel={t('result')} />
            </StepShell>
          )}

          {/* ── STEP 9: Summary ──────────────────────────────────── */}
          {step === 9 && calc && (
            <motion.div key="summary" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Panchang is Complete!</h2>
                <p className="text-text-secondary text-sm">
                  {`${calc.y}-${String(calc.m).padStart(2,'0')}-${String(calc.d).padStart(2,'0')}`}
                  {location ? ` · ${location.name}` : ''}
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: '🌅', label: 'Vara (Weekday)', value: lt(calc.varaData.name as LocaleText, locale), sub: `Ruled by ${lt(calc.varaData.ruler as LocaleText, locale)}` },
                  { icon: '🌙', label: 'Tithi (Lunar Day)', value: lt(calc.tithiData.name as LocaleText, locale), sub: calc.tithiData.paksha === 'shukla' ? 'Shukla Paksha · Waxing Moon' : 'Krishna Paksha · Waning Moon' },
                  { icon: '⭐', label: 'Nakshatra (Star)', value: `${lt(calc.nakData.name as LocaleText, locale)}, Pada ${calc.pada}`, sub: `Ruled by ${lt(calc.nakData.rulerName as LocaleText, locale)}` },
                  { icon: '☀️', label: 'Sun Position', value: `${lt(calc.sunRashi.name as LocaleText, locale)} ${calc.sunRashi.symbol}`, sub: `${calc.sunSid.toFixed(2)}° sidereal` },
                  { icon: '🌕', label: 'Moon Position', value: `${lt(calc.moonRashi.name as LocaleText, locale)} ${calc.moonRashi.symbol}`, sub: `${calc.moonSid.toFixed(2)}° sidereal` },
                  { icon: '✨', label: 'Yoga', value: lt(calc.yogaData.name as LocaleText, locale), sub: calc.yogaData.nature },
                  { icon: '⚡', label: 'Karana', value: lt(calc.karanaData.name as LocaleText, locale), sub: calc.karanaData.type },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/8">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs text-text-secondary/60 mb-0.5">{item.label}</div>
                      <div className="text-white font-semibold">{item.value}</div>
                    </div>
                    <div className="text-xs text-text-secondary/60 text-right">{item.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/20 text-center">
                <p className="text-text-primary text-sm leading-relaxed">
                  You just computed a full Panchang from scratch — the same way it's been calculated for over 1,500 years, now running in milliseconds on modern hardware. Every number you saw was derived from just two inputs: a date and a location.
                </p>
              </div>

              <NavButtons onBack={back} backLabel={t('back')} onNext={() => setStep(0)} nextLabel={t('startCalculating')} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
