'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, ArrowRight, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { dateToJD, normalizeDeg, toRad, toSidereal, lahiriAyanamsha, getNakshatraNumber, getRashiNumber } from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import type { Locale } from '@/types/panchang';

// Top 60 sine terms from Meeus Table 47.A
const MOON_LR_TABLE: [number, number, number, number, number][] = [
  [0,0,1,0,6288774], [2,0,-1,0,1274027], [2,0,0,0,658314], [0,0,2,0,213618],
  [0,1,0,0,-185116], [0,0,0,2,-114332], [2,0,-2,0,58793], [2,-1,-1,0,57066],
  [2,0,1,0,53322], [2,-1,0,0,45758], [0,1,-1,0,-40923], [1,0,0,0,-34720],
  [0,1,1,0,-30383], [2,0,0,-2,15327], [0,0,1,2,-12528], [0,0,1,-2,10980],
  [4,0,-1,0,10675], [0,0,3,0,10034], [4,0,-2,0,8548], [2,1,-1,0,-7888],
  [2,1,0,0,-6766], [1,0,-1,0,-5163], [1,1,0,0,4987], [2,-1,1,0,4036],
  [2,0,2,0,3994], [4,0,0,0,3861], [2,0,-3,0,3665], [0,1,-2,0,-2689],
  [2,0,-1,2,-2602], [2,-1,-2,0,2390], [1,0,1,0,-2348], [2,-2,0,0,2236],
  [0,1,2,0,-2120], [0,2,0,0,-2069], [2,-2,-1,0,2048], [2,0,1,-2,-1773],
  [2,0,0,2,-1595], [4,-1,-1,0,1215], [0,0,2,2,-1110], [3,0,-1,0,-892],
  [2,1,1,0,-810], [4,-1,-2,0,759], [0,2,-1,0,-713], [2,2,-1,0,-700],
  [2,1,-2,0,691], [2,-1,0,-2,596], [4,0,1,0,549], [0,0,4,0,537],
  [4,-1,0,0,520], [1,0,-2,0,-487], [2,1,0,-2,-399], [0,0,2,-2,-381],
  [1,1,1,0,351], [3,0,-2,0,-340], [4,0,-3,0,330], [2,-1,2,0,327],
  [0,2,1,0,-323], [1,1,-1,0,299], [2,0,3,0,294], [2,0,-1,-2,0],
];

interface Location { name: string; lat: number; lng: number; timezone: string; }

// ── Shared UI primitives ────────────────────────────────────────────────────

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
        <button onClick={onNext} disabled={disableNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-900/30">
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
    <motion.div key={stepNum} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <span>Step {stepNum}</span><span className="text-indigo-500/40">/</span><span className="text-indigo-500/60">{totalSteps}</span>
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{title}</h2>
      <p className="text-text-secondary text-base mb-8 leading-relaxed">{subtitle}</p>
      {children}
    </motion.div>
  );
}

function WhyBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
      <div className="text-xs text-indigo-400 uppercase tracking-wider font-semibold mb-2">Why do we need this?</div>
      <div className="text-text-primary text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function CalcRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg ${highlight ? 'bg-indigo-500/10 border border-indigo-500/25' : 'bg-white/[0.025] border border-white/5'}`}>
      <span className={`text-sm ${highlight ? 'text-indigo-200 font-medium' : 'text-text-secondary'}`}>{label}</span>
      <span className={`font-mono text-sm font-semibold ${highlight ? 'text-indigo-300' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function ResultBanner({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/30 text-center">
      <div className="text-xs text-indigo-500/70 uppercase tracking-widest mb-1">Result</div>
      <div className="text-3xl font-bold text-indigo-200 mb-1">{label}</div>
      <div className="font-mono text-indigo-400/80 text-sm">{value}</div>
      {sub && <div className="text-text-secondary text-xs mt-2">{sub}</div>}
    </div>
  );
}

// ── Diagrams ────────────────────────────────────────────────────────────────

function MoonOrbitDiagram() {
  // Show elliptical orbit concept + perturbations
  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-3 font-semibold">The Moon's Orbit — Why it's complicated</div>
      <svg viewBox="0 0 400 160" className="w-full">
        {/* Earth */}
        <circle cx="80" cy="80" r="12" fill="#3b82f6" />
        <text x="80" y="84" textAnchor="middle" dominantBaseline="middle" fontSize="10">🌍</text>

        {/* Elliptical orbit (simplified) */}
        <ellipse cx="200" cy="80" rx="160" ry="55" fill="none" stroke="#4b5563" strokeWidth="1" strokeDasharray="5,3" />

        {/* Moon at apogee */}
        <circle cx="360" cy="80" r="8" fill="#e2e8f0" opacity="0.5" />
        <text x="360" y="83" textAnchor="middle" dominantBaseline="middle" fontSize="8" opacity="0.5">🌙</text>
        <text x="360" y="60" textAnchor="middle" fill="#6b7280" fontSize="8">Apogee</text>
        <text x="360" y="70" textAnchor="middle" fill="#6b7280" fontSize="7">(far, slower)</text>

        {/* Moon at perigee */}
        <circle cx="40" cy="80" r="10" fill="#e2e8f0" />
        <text x="40" y="83" textAnchor="middle" dominantBaseline="middle" fontSize="9">🌙</text>
        <text x="40" y="60" textAnchor="middle" fill="#94a3b8" fontSize="8">Perigee</text>
        <text x="40" y="70" textAnchor="middle" fill="#94a3b8" fontSize="7">(close, faster)</text>

        {/* Sun perturbation arrow */}
        <text x="200" y="155" textAnchor="middle" fill="#f97316" fontSize="9">☀️ Sun's gravity constantly tugs on the Moon, distorting its path</text>

        {/* Jupiter perturbation */}
        <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="8">Earth's equatorial bulge also affects the orbit</text>

        {/* 60 terms label */}
        <text x="200" y="100" textAnchor="middle" fill="#6366f1" fontSize="8">← 60 sine terms model all these distortions →</text>
      </svg>
    </div>
  );
}

function SineWaveDiagram({ top5 }: { top5: { contribution: number }[] }) {
  const W = 360, H = 100, cy = 50;
  // Draw a simplified sine wave for each top term
  const maxContrib = Math.max(...top5.map(t => Math.abs(t.contribution)));
  const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];
  const pts = (amplitude: number, phase: number, freq: number) =>
    Array.from({ length: 61 }, (_, i) => {
      const x = (i / 60) * W;
      const y = cy - (amplitude / maxContrib) * 35 * Math.sin(freq * i * Math.PI / 30 + phase);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-2 font-semibold">Concept: Adding sine waves to model the orbit</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1="0" y1={cy} x2={W} y2={cy} stroke="#1f2937" strokeWidth="1" />
        {top5.map((t, i) => (
          <polyline key={i}
            points={pts(t.contribution, i * 0.7, i + 1)}
            fill="none" stroke={colors[i]} strokeWidth={i === 0 ? 2 : 1.2} opacity={0.6 + i * 0.08} />
        ))}
        {/* Sum wave */}
        <polyline
          points={Array.from({ length: 61 }, (_, i) => {
            const x = (i / 60) * W;
            const y = cy - top5.reduce((s, t, j) => s + (t.contribution / maxContrib) * 25 * Math.sin((j + 1) * i * Math.PI / 30 + j * 0.7), 0);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ')}
          fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <text x="4" y="12" fill="#94a3b8" fontSize="7">Individual terms (faint)</text>
        <text x="4" y="H" dy="-8" fill="#f59e0b" fontSize="7">→ Sum = actual orbit correction</text>
      </svg>
      <p className="text-text-secondary/60 text-xs text-center mt-1">Each sine term captures one gravitational influence on the Moon's path. Adding them all gives the true position.</p>
    </div>
  );
}

function NakshatraPositionBar({ sidLong, nakNum }: { sidLong: number; nakNum: number }) {
  const nakSpan = 360 / 27;
  const nakStart = (nakNum - 1) * nakSpan;
  const posInNak = sidLong - nakStart;
  const pct = (posInNak / nakSpan) * 100;
  const pada = Math.floor(posInNak / (nakSpan / 4)) + 1;

  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-3 font-semibold">Moon's position within the Nakshatra</div>
      <div className="mb-2 flex justify-between text-xs text-text-secondary/60 font-mono">
        <span>{nakStart.toFixed(1)}° (start)</span>
        <span className="text-indigo-300">{sidLong.toFixed(2)}° ← Moon here</span>
        <span>{(nakStart + nakSpan).toFixed(1)}° (end)</span>
      </div>
      <div className="relative h-8 rounded-lg bg-white/5 border border-white/8 overflow-hidden">
        {/* Pada dividers */}
        {[1, 2, 3].map(p => (
          <div key={p} className="absolute top-0 h-full w-px bg-white/15" style={{ left: `${p * 25}%` }} />
        ))}
        {/* Progress */}
        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-600/40 to-indigo-400/30 rounded-lg" style={{ width: `${pct}%` }} />
        {/* Moon marker */}
        <div className="absolute top-1 h-6 w-6 -ml-3 bg-slate-200 rounded-full flex items-center justify-center text-xs shadow-lg" style={{ left: `${pct}%` }}>🌙</div>
        {/* Pada labels */}
        {[1, 2, 3, 4].map(p => (
          <div key={p} className={`absolute top-0 h-full flex items-center justify-center text-xs font-bold ${pada === p ? 'text-indigo-300' : 'text-slate-600'}`}
            style={{ left: `${(p - 1) * 25}%`, width: '25%' }}>
            P{p}
          </div>
        ))}
      </div>
      <p className="text-text-secondary/60 text-xs text-center mt-2">Moon is in Pada {pada} — {pct.toFixed(1)}% through this Nakshatra</p>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function MoonLabPage() {
  const locale = useLocale() as Locale;

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [step, setStep] = useState(0);
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(nowTime);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState('');

  const TOTAL_STEPS = 8;

  const calc = useMemo(() => {
    if (!date) return null;
    const [y, mo, d] = date.split('-').map(Number);
    const [h, min] = time.split(':').map(Number);
    const tz = location?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcOffset = getUTCOffsetForDate(y, mo, d, tz);
    const hourUT = h + min / 60 - utcOffset;
    const jd = dateToJD(y, mo, d, hourUT);

    // T
    const t = (jd - 2451545.0) / 36525.0;

    // Fundamental arguments
    const Lp = normalizeDeg(218.3164477 + 481267.88123421 * t - 0.0015786 * t * t + t * t * t / 538841 - t * t * t * t / 65194000);
    const D = normalizeDeg(297.8501921 + 445267.1114034 * t - 0.0018819 * t * t + t * t * t / 545868 - t * t * t * t / 113065000);
    const M = normalizeDeg(357.5291092 + 35999.0502909 * t - 0.0001536 * t * t + t * t * t / 24490000);
    const Mp = normalizeDeg(134.9633964 + 477198.8675055 * t + 0.0087414 * t * t + t * t * t / 69699 - t * t * t * t / 14712000);
    const F = normalizeDeg(93.2720950 + 483202.0175233 * t - 0.0036539 * t * t - t * t * t / 3526000 + t * t * t * t / 863310000);

    const E = 1 - 0.002516 * t - 0.0000074 * t * t;
    const E2 = E * E;
    const dr = toRad(D), mr = toRad(M), mpr = toRad(Mp), fr = toRad(F);

    const termDetails = MOON_LR_TABLE.map(([cd, cm, cmp, cf, sl]) => {
      const arg = cd * dr + cm * mr + cmp * mpr + cf * fr;
      let coeff = sl;
      const absM = Math.abs(cm);
      if (absM === 1) coeff *= E;
      else if (absM === 2) coeff *= E2;
      const sinVal = Math.sin(arg);
      return { dMult: cd, mMult: cm, mpMult: cmp, fMult: cf, coeff, sinArg: sinVal, contribution: coeff * sinVal };
    });

    const top5 = [...termDetails].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).slice(0, 5);
    let sumL = termDetails.reduce((s, td) => s + td.contribution, 0);

    const A1 = toRad(normalizeDeg(119.75 + 131.849 * t));
    const A2 = toRad(normalizeDeg(53.09 + 479264.290 * t));
    const venusCorr = 3958 * Math.sin(A1);
    const flatCorr = 1962 * Math.sin(toRad(Lp) - fr);
    const jupCorr = 318 * Math.sin(A2);
    const totalCorr = sumL + venusCorr + flatCorr + jupCorr;

    const tropLong = normalizeDeg(Lp + totalCorr / 1e6);
    const ayan = lahiriAyanamsha(jd);
    const sidLong = toSidereal(tropLong, jd);

    const rashiNum = getRashiNumber(sidLong);
    const nakNum = getNakshatraNumber(sidLong);
    const rashiData = RASHIS[rashiNum - 1];
    const nakData = NAKSHATRAS[nakNum - 1];
    const nakSpan = 360 / 27;
    const posInNak = sidLong - (nakNum - 1) * nakSpan;
    const pada = Math.floor(posInNak / (nakSpan / 4)) + 1;

    return {
      y, mo, d, h, min, tz, utcOffset, hourUT, jd, t, E, E2,
      Lp, D, M, Mp, F,
      sumL, venusCorr, flatCorr, jupCorr, totalCorr,
      tropLong, ayan, sidLong,
      rashiNum, nakNum, rashiData, nakData, nakSpan, posInNak, pada, top5,
      termCount: termDetails.length,
    };
  }, [date, time, location]);

  const L = (obj: { en: string; hi?: string; sa?: string } | undefined) => {
    if (!obj) return '';
    return (obj as Record<string, string>)[locale] || (obj as Record<string, string>).en || '';
  };

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS + 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const progressLabels = ['Setup', 'Why Moon?', 'JD + T', 'Arguments', 'Sine Terms', 'Sum', 'Tropical', 'Ayanamsha', 'Result'];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <Moon className="w-5 h-5 text-indigo-300" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-200 via-purple-100 to-indigo-200 bg-clip-text text-transparent">
            Trace Your Moon
          </h1>
        </div>
        <p className="text-text-secondary text-base">The Meeus algorithm — decoded step by step for a complete beginner</p>
      </div>

      {/* Progress */}
      <div className="max-w-3xl mx-auto mb-10 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max px-2">
          {progressLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <button onClick={() => { if (i === 0 || calc) setStep(i); }} disabled={i > 0 && !calc}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === step ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  : i < step ? 'text-green-400/80 hover:text-green-300' : 'text-slate-600 cursor-not-allowed'
                }`}>
                {i < step && i > 0 ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px]">{i}</span>}
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < progressLabels.length - 1 && <ChevronRight className="w-3 h-3 text-slate-700 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-xl min-h-[500px]">
        <AnimatePresence mode="wait">

          {/* STEP 0: Setup */}
          {step === 0 && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🌙</div>
                <h2 className="text-2xl font-bold text-white mb-2">Trace the Moon's Exact Position</h2>
                <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
                  The Moon's position can't be calculated with a simple formula — the Sun and Earth's shape both pull it in complex ways. We'll use the Meeus algorithm, which adds up 60+ mathematical waves to model the orbit with sub-degree accuracy.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/20 mb-6">
                <div className="text-xs text-indigo-400 uppercase tracking-wider font-semibold mb-2">What this lab shows</div>
                <div className="space-y-1.5">
                  {['Why the Moon\'s orbit is irregular', 'Julian Centuries — a compact time unit', '5 fundamental orbital angles', '60 sine correction terms (Fourier analysis)', 'Final tropical → sidereal conversion', 'Rashi and Nakshatra identification'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-text-primary text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-indigo-300/80 mb-1.5">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-indigo-500/50 focus:outline-none transition-colors [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo-300/80 mb-1.5">Time <span className="text-text-secondary/60 font-normal">(local)</span></label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-indigo-500/50 focus:outline-none transition-colors [color-scheme:dark]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-300/80 mb-1.5">Location <span className="text-text-secondary/60 font-normal">(for timezone)</span></label>
                  <LocationSearch value={locationName} onSelect={loc => { setLocation(loc); setLocationName(loc.name); }} placeholder="Search city..." className="w-full" />
                </div>
              </div>
              <NavButtons nextLabel="Begin Tracing →" onNext={() => setStep(1)} disableNext={!date} />
            </motion.div>
          )}

          {/* STEP 1: Why Moon + Orbit overview */}
          {step === 1 && calc && (
            <StepShell key="why" stepNum={1} totalSteps={TOTAL_STEPS}
              title="Why is the Moon's Position Hard to Calculate?"
              subtitle="Unlike the Sun — which moves in a nearly perfect ellipse — the Moon has one of the most complex orbits in the solar system.">
              <WhyBox>
                Three forces constantly distort the Moon's orbit:
                <br /><br />
                <strong className="text-white">1. Earth's gravity</strong> — the main force, keeping the Moon in orbit<br />
                <strong className="text-white">2. Sun's gravity</strong> — pulling the Moon sideways, stretching the orbit (this causes the biggest corrections — up to 6.3°!)<br />
                <strong className="text-white">3. Earth's equatorial bulge</strong> — Earth isn't a perfect sphere, so its gravity isn't perfectly uniform
                <br /><br />
                The result: the Moon's orbit is an ellipse that rotates, tilts, and stretches over time. You can't compute it with one formula. You need to add up many mathematical waves — each wave capturing one gravitational influence.
              </WhyBox>

              <MoonOrbitDiagram />

              <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-2">The Meeus Algorithm</div>
                <p className="text-text-primary text-sm leading-relaxed">
                  Jean Meeus, a Belgian astronomer, published "Astronomical Algorithms" in 1991. He distilled centuries of orbital observations into a set of 60+ trigonometric terms that together predict the Moon's position to within 0.5° — accurate enough for Panchang calculations. This is what almost every Vedic astrology software uses today.
                </p>
              </div>
              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 2: JD + Julian Centuries T */}
          {step === 2 && calc && (
            <StepShell key="jd" stepNum={2} totalSteps={TOTAL_STEPS}
              title="Julian Day & Julian Centuries"
              subtitle="We need to express 'how much time has passed' in a form that's easy to put into polynomial equations.">
              <WhyBox>
                The Julian Day (JD) gives us a single number for any moment. But for orbital calculations, astronomers use an even more convenient unit: <strong className="text-white">Julian Centuries (T)</strong> — how many 100-year chunks have passed since January 1.5, 2000 (the J2000 epoch). Why J2000? Because all of Meeus's equations were calibrated to that date. Using T means the numbers stay small and manageable — today T ≈ 0.26, instead of JD ≈ 2,460,000.
              </WhyBox>

              <div className="mb-5 p-4 rounded-xl bg-black/20 border border-white/8">
                <div className="text-xs text-text-secondary/60 font-semibold uppercase tracking-wider mb-3">Formula</div>
                <div className="font-mono text-indigo-200 text-center text-base py-2">
                  T = (JD − 2,451,545.0) ÷ 36,525
                </div>
                <p className="text-text-secondary text-sm mt-3">
                  <strong className="text-indigo-300">2,451,545.0</strong> — the JD of January 1.5, 2000 (the J2000 standard epoch)<br />
                  <strong className="text-indigo-300">36,525</strong> — days per Julian century (365.25 × 100). Dividing by this converts days to centuries.
                </p>
              </div>

              <div className="space-y-2">
                <CalcRow label={`Date: ${calc.y}-${String(calc.mo).padStart(2,'0')}-${String(calc.d).padStart(2,'0')} ${String(calc.h).padStart(2,'0')}:${String(calc.min).padStart(2,'0')}`} value="" />
                <CalcRow label="UTC offset" value={`${calc.utcOffset >= 0 ? '+' : ''}${calc.utcOffset.toFixed(1)}h`} />
                <CalcRow label="Time in UT hours" value={`${calc.hourUT.toFixed(4)} h`} />
                <CalcRow label="Julian Day Number" value={calc.jd.toFixed(6)} />
                <CalcRow label="JD − 2,451,545.0" value={(calc.jd - 2451545.0).toFixed(4)} />
                <CalcRow label="T = ÷ 36,525" value={calc.t.toFixed(10)} highlight />
              </div>

              <ResultBanner
                label={`T = ${calc.t.toFixed(8)}`}
                value="Julian centuries since J2000"
                sub={`${(calc.t * 100).toFixed(2)} years have passed since Jan 1, 2000`}
              />
              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 3: Fundamental Arguments */}
          {step === 3 && calc && (
            <StepShell key="args" stepNum={3} totalSteps={TOTAL_STEPS}
              title="5 Fundamental Arguments"
              subtitle="Before we can evaluate the 60 sine terms, we need 5 key orbital angles. Each is a linearly-growing angle based on T.">
              <WhyBox>
                Think of the solar system as a machine with spinning gears. Each gear has a frequency — it rotates at a certain rate over time. The 5 fundamental arguments are the "master angles" of that machine: the Moon's average position, the Sun-Moon angle, the Sun's orbit, the Moon's orbit shape, and the Moon's orbital tilt. Once we know where each gear is pointed, we can calculate the distortions using sine/cosine functions.
              </WhyBox>

              <div className="mb-5 p-4 rounded-xl bg-black/20 border border-white/8">
                <div className="text-xs text-text-secondary/60 font-semibold uppercase tracking-wider mb-3">The 5 Angles (all in degrees, mod 360°)</div>
                <div className="space-y-2 font-mono text-xs text-text-primary">
                  <div><span className="text-indigo-300">L'</span> = 218.316 + <span className="text-purple-300">481,267.881</span> × T — Moon's mean longitude</div>
                  <div><span className="text-indigo-300">D</span>  = 297.850 + <span className="text-purple-300">445,267.111</span> × T — Mean Moon-Sun elongation</div>
                  <div><span className="text-indigo-300">M</span>  = 357.529 + <span className="text-purple-300">35,999.050</span>  × T — Sun's mean anomaly</div>
                  <div><span className="text-indigo-300">M'</span> = 134.963 + <span className="text-purple-300">477,198.868</span> × T — Moon's mean anomaly</div>
                  <div><span className="text-indigo-300">F</span>  = 93.272  + <span className="text-purple-300">483,202.018</span> × T — Moon's argument of latitude</div>
                </div>
                <p className="text-text-secondary/60 text-xs mt-3">The large multipliers (e.g. 481,267) are the orbital frequencies in degrees per century. The Moon completes ~1,336 full orbits per century.</p>
              </div>

              <div className="space-y-2">
                <CalcRow label="T (Julian Centuries)" value={calc.t.toFixed(8)} />
                <CalcRow label="L' — Moon mean longitude" value={`${calc.Lp.toFixed(4)}°`} highlight />
                <CalcRow label="D  — Mean elongation" value={`${calc.D.toFixed(4)}°`} />
                <CalcRow label="M  — Sun mean anomaly" value={`${calc.M.toFixed(4)}°`} />
                <CalcRow label="M' — Moon mean anomaly" value={`${calc.Mp.toFixed(4)}°`} />
                <CalcRow label="F  — Arg of latitude" value={`${calc.F.toFixed(4)}°`} />
              </div>

              <ResultBanner label="5 angles computed" value="Now we can evaluate all 60 sine terms" />
              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 4: Sine Terms */}
          {step === 4 && calc && (
            <StepShell key="terms" stepNum={4} totalSteps={TOTAL_STEPS}
              title="60 Sine Correction Terms"
              subtitle="This is where all the gravitational complexity gets encoded — as a sum of 60 carefully measured sine waves.">
              <WhyBox>
                Fourier analysis (named after French mathematician Joseph Fourier) shows that <em>any</em> repeating shape can be approximated by adding sine waves of different frequencies and amplitudes. The Moon's irregular orbit is a repeating pattern — and Meeus found the 60 most important waves that together reconstruct it. Each row in his famous Table 47.A says: "multiply D by this, M by this, M' by this, F by this, take the sine, multiply by this coefficient". Adding all 60 results gives the total correction to add to the Moon's mean position.
              </WhyBox>

              <SineWaveDiagram top5={calc.top5} />

              <div className="mb-4">
                <div className="text-xs text-text-secondary/60 font-semibold uppercase tracking-wider mb-2">Top 5 terms by magnitude</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['D×', 'M×', "M'×", 'F×', 'Coeff', 'Contribution'].map(h => (
                          <th key={h} className="text-left px-2 py-1.5 text-text-secondary/60">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {calc.top5.map((t, i) => (
                        <tr key={i} className={`border-b border-white/[0.03] ${i === 0 ? 'bg-indigo-500/10' : ''}`}>
                          <td className="px-2 py-1.5 text-text-primary">{t.dMult}</td>
                          <td className="px-2 py-1.5 text-text-primary">{t.mMult}</td>
                          <td className="px-2 py-1.5 text-text-primary">{t.mpMult}</td>
                          <td className="px-2 py-1.5 text-text-primary">{t.fMult}</td>
                          <td className="px-2 py-1.5 text-text-secondary">{t.coeff.toFixed(0)}</td>
                          <td className={`px-2 py-1.5 font-bold ${i === 0 ? 'text-indigo-300' : 'text-text-primary'}`}>{(t.contribution / 1e6).toFixed(4)}°</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-text-secondary/60 text-xs mt-2">Total terms evaluated: {calc.termCount}. Contributions are in units of 10⁻⁶ degrees (millionths of a degree).</p>
              </div>

              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 5: Sum + Corrections */}
          {step === 5 && calc && (
            <StepShell key="sum" stepNum={5} totalSteps={TOTAL_STEPS}
              title="Summing All Corrections"
              subtitle="We add all 60 terms plus 3 extra corrections for Venus, Earth's shape, and Jupiter.">
              <WhyBox>
                After summing the main 60 terms, Meeus adds 3 extra corrections. These account for:<br />
                <strong className="text-white">Venus</strong> — the second-largest gravitational influence after the Sun (small but non-negligible)<br />
                <strong className="text-white">Earth's flattening</strong> — Earth is slightly squashed at the poles, so gravity isn't perfectly spherical<br />
                <strong className="text-white">Jupiter</strong> — the largest planet, whose gravity creates a tiny but measurable effect
              </WhyBox>

              <div className="space-y-2 mb-4">
                <CalcRow label="Sum of all 60 sine terms" value={`${calc.sumL.toFixed(0)} × 10⁻⁶°`} />
                <CalcRow label="+ Venus correction (3958 × sin A₁)" value={`${calc.venusCorr.toFixed(0)} × 10⁻⁶°`} />
                <CalcRow label="+ Earth flattening (1962 × sin(L'−F))" value={`${calc.flatCorr.toFixed(0)} × 10⁻⁶°`} />
                <CalcRow label="+ Jupiter correction (318 × sin A₂)" value={`${calc.jupCorr.toFixed(0)} × 10⁻⁶°`} />
                <CalcRow label="Total correction" value={`${calc.totalCorr.toFixed(0)} × 10⁻⁶°`} highlight />
                <CalcRow label="In degrees" value={`${(calc.totalCorr / 1e6).toFixed(6)}°`} highlight />
              </div>

              <ResultBanner label={`Correction: ${(calc.totalCorr / 1e6).toFixed(4)}°`} value="Total shift from mean position" sub="This gets added to L' (the mean longitude) in the next step" />
              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 6: Tropical Longitude */}
          {step === 6 && calc && (
            <StepShell key="trop" stepNum={6} totalSteps={TOTAL_STEPS}
              title="Final Tropical Longitude"
              subtitle="Now we add the total correction to the mean longitude to get where the Moon actually is.">
              <WhyBox>
                L' is the Moon's <em>mean</em> position — where it would be if the orbit were a perfect ellipse with no perturbations. The correction term (all those 60+ sine waves) tells us how far the Moon has deviated from that mean due to gravitational influences. Adding them gives the Moon's true tropical longitude — its position measured from the Spring Equinox point.
              </WhyBox>

              <div className="space-y-2 mb-4">
                <CalcRow label="L' (Moon mean longitude)" value={`${calc.Lp.toFixed(6)}°`} />
                <CalcRow label="Total correction" value={`${(calc.totalCorr / 1e6).toFixed(6)}°`} />
                <CalcRow label="L' + correction (before mod)" value={`${(calc.Lp + calc.totalCorr / 1e6).toFixed(6)}°`} />
                <CalcRow label="mod 360° → Tropical Moon longitude" value={`${calc.tropLong.toFixed(6)}°`} highlight />
              </div>

              <ResultBanner label={`Tropical Moon: ${calc.tropLong.toFixed(4)}°`} value="Measured from the Spring Equinox (tropical zodiac)" sub="Next: we convert this to sidereal (star-based) using the Ayanamsha" />
              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 7: Ayanamsha */}
          {step === 7 && calc && (
            <StepShell key="ayan" stepNum={7} totalSteps={TOTAL_STEPS}
              title="Apply the Ayanamsha"
              subtitle="The last step: convert from the Western (tropical) zodiac to the Vedic (sidereal) star-fixed zodiac.">
              <WhyBox>
                The tropical zodiac is anchored to the Spring Equinox — a point that slowly drifts due to Earth's 26,000-year axial wobble. The sidereal zodiac is anchored to the actual star backdrop. Since Vedic astrology uses the real stars, not the drifting equinox, we subtract the Lahiri Ayanamsha — the official correction adopted by the Government of India in 1955 — to get the true Vedic position.
              </WhyBox>

              <div className="space-y-2 mb-4">
                <CalcRow label="Tropical Moon longitude" value={`${calc.tropLong.toFixed(6)}°`} />
                <CalcRow label="Lahiri Ayanamsha" value={`${calc.ayan.toFixed(6)}°`} />
                <CalcRow label="Sidereal = Tropical − Ayanamsha" value={`${calc.sidLong.toFixed(6)}°`} highlight />
              </div>

              <ResultBanner label={`Sidereal Moon: ${calc.sidLong.toFixed(4)}°`} value="Vedic (star-fixed) position — ready for Nakshatra/Rashi lookup" />
              <NavButtons onBack={back} onNext={next} nextLabel="See Result →" />
            </StepShell>
          )}

          {/* STEP 8: Result */}
          {step === 8 && calc && (
            <StepShell key="result" stepNum={8} totalSteps={TOTAL_STEPS}
              title="Rashi & Nakshatra"
              subtitle="We divide the sky into 12 signs and 27 star clusters to identify where the Moon sits.">
              <NakshatraPositionBar sidLong={calc.sidLong} nakNum={calc.nakNum} />

              <div className="space-y-2 mb-4">
                <CalcRow label="Sidereal Moon" value={`${calc.sidLong.toFixed(4)}°`} />
                <CalcRow label="Rashi = floor(° ÷ 30) + 1" value={`${calc.rashiNum} — ${L(calc.rashiData.name)} ${calc.rashiData.symbol}`} highlight />
                <CalcRow label="Degree within sign" value={`${(calc.sidLong % 30).toFixed(2)}°`} />
                <CalcRow label="Nakshatra = floor(° ÷ 13.333) + 1" value={`${calc.nakNum} — ${L(calc.nakData.name)}`} highlight />
                <CalcRow label="Pada (quarter)" value={`${calc.pada} / 4`} />
                <CalcRow label="Nakshatra ruler" value={calc.nakData.ruler} />
              </div>

              <ResultBanner
                label={`${L(calc.rashiData.name)} ${calc.rashiData.symbol} · ${L(calc.nakData.name)} Pada ${calc.pada}`}
                value={`${calc.sidLong.toFixed(4)}° sidereal`}
                sub={`Ruled by ${calc.nakData.ruler} · This Nakshatra governs your birth Dasha if this is your birth Moon`}
              />

              <NavButtons onBack={back} onNext={() => setStep(0)} nextLabel="Try Another Date" />
            </StepShell>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
