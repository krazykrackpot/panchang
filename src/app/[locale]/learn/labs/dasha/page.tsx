'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, ArrowRight, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { dateToJD, moonLongitude, toSidereal, getNakshatraNumber } from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';

// ── Vimshottari constants ───────────────────────────────────────────────────
const VIMSHOTTARI_ORDER = [
  { id: 8, years: 7,  name: 'Ketu',    color: '#95a5a6' },
  { id: 5, years: 20, name: 'Venus',   color: '#e8e6e3' },
  { id: 0, years: 6,  name: 'Sun',     color: '#e67e22' },
  { id: 1, years: 10, name: 'Moon',    color: '#ecf0f1' },
  { id: 2, years: 7,  name: 'Mars',    color: '#e74c3c' },
  { id: 7, years: 18, name: 'Rahu',    color: '#8e44ad' },
  { id: 4, years: 16, name: 'Jupiter', color: '#f39c12' },
  { id: 6, years: 19, name: 'Saturn',  color: '#3498db' },
  { id: 3, years: 17, name: 'Mercury', color: '#2ecc71' },
];

const NAK_SPAN = 360 / 27;
const RULER_TO_IDX: Record<string, number> = {
  Ketu: 0, Venus: 1, Sun: 2, Moon: 3, Mars: 4, Rahu: 5, Jupiter: 6, Saturn: 7, Mercury: 8,
};

interface LocationResult { name: string; lat: number; lng: number; timezone: string; }
interface DashaSegment { planetId: number; planetName: string; color: string; startDate: Date; endDate: Date; durationYears: number; isPartial?: boolean; }

function addYearsDecimal(base: Date, years: number): Date {
  return new Date(base.getTime() + years * 365.25 * 24 * 60 * 60 * 1000);
}
function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDuration(years: number): string {
  const y = Math.floor(years);
  const m = Math.floor((years - y) * 12);
  const d = Math.floor(((years - y) * 12 - m) * 30);
  return [y > 0 ? `${y}y` : '', m > 0 ? `${m}m` : '', d > 0 ? `${d}d` : ''].filter(Boolean).join(' ') || '< 1 day';
}

// ── UI Primitives ───────────────────────────────────────────────────────────

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
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg shadow-amber-900/30">
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
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <span>Step {stepNum}</span><span className="text-amber-500/40">/</span><span className="text-amber-500/60">{totalSteps}</span>
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
    <div className="mb-6 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
      <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-2">What is this?</div>
      <div className="text-text-primary text-sm leading-relaxed">{children}</div>
    </div>
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

// ── Diagrams ────────────────────────────────────────────────────────────────

function DashaCycleDiagram() {
  // Show the 9 planets in a cycle with their years
  const cx = 140, cy = 115, r = 90;
  const total = VIMSHOTTARI_ORDER.reduce((s, v) => s + v.years, 0); // 120

  let startAngle = -Math.PI / 2;
  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-3 font-semibold">The 120-Year Vimshottari Cycle</div>
      <svg viewBox="0 0 280 230" className="w-full max-w-[280px] mx-auto">
        {VIMSHOTTARI_ORDER.map((v, i) => {
          const sweep = (v.years / total) * 2 * Math.PI;
          const endAngle = startAngle + sweep;
          const midAngle = startAngle + sweep / 2;

          const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
          const largeArc = sweep > Math.PI ? 1 : 0;
          const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;

          const tx = cx + (r + 16) * Math.cos(midAngle);
          const ty = cy + (r + 16) * Math.sin(midAngle);

          const result = (
            <g key={i}>
              <path d={path} fill={v.color + '40'} stroke={v.color + 'aa'} strokeWidth="1" />
              <text x={tx} y={ty - 3} textAnchor="middle" fill={v.color} fontSize="8" fontWeight="bold">
                {GRAHAS[v.id].symbol}
              </text>
              <text x={tx} y={ty + 7} textAnchor="middle" fill={v.color + 'bb'} fontSize="7">
                {v.years}yr
              </text>
            </g>
          );
          startAngle = endAngle;
          return result;
        })}
        <circle cx={cx} cy={cy} r="30" fill="#060918" stroke="#1e293b" strokeWidth="1" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">120</text>
        <text x={cx} y={cy + 7} textAnchor="middle" fill="#64748b" fontSize="7">years</text>
      </svg>
      <p className="text-text-secondary/60 text-xs text-center mt-1">Each planet rules a period. Ketu starts, Venus ends. At the end, the cycle repeats from Ketu.</p>
    </div>
  );
}

function NakshatraNakshMap({ nakNum }: { nakNum: number }) {
  // Show which 3 nakshatras map to each planet
  const assignments: Record<string, number[]> = {
    Ketu: [1, 10, 19], Venus: [2, 11, 20], Sun: [3, 12, 21], Moon: [4, 13, 22],
    Mars: [5, 14, 23], Rahu: [6, 15, 24], Jupiter: [7, 16, 25], Saturn: [8, 17, 26], Mercury: [9, 18, 27],
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-3 font-semibold">Each planet rules 3 Nakshatras out of 27</div>
      <div className="grid grid-cols-9 gap-1 text-center">
        {VIMSHOTTARI_ORDER.map((v) => (
          <div key={v.name}>
            <div className="text-base mb-1">{GRAHAS[v.id].symbol}</div>
            {assignments[v.name].map(n => (
              <div key={n}
                className={`text-xs py-0.5 rounded mb-0.5 ${n === nakNum ? 'font-bold' : 'text-slate-600'}`}
                style={{ backgroundColor: n === nakNum ? v.color + '30' : undefined, color: n === nakNum ? v.color : undefined }}>
                #{n}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="text-text-secondary/60 text-xs text-center mt-2">Your birth Nakshatra #{nakNum} is highlighted above — that planet starts your Dasha sequence.</p>
    </div>
  );
}

function BalanceDiagram({ posInNak, nakSpan, planetName, planetYears, balanceYears, color }: {
  posInNak: number; nakSpan: number; planetName: string; planetYears: number; balanceYears: number; color: string;
}) {
  const pctConsumed = (posInNak / nakSpan) * 100;
  const pctRemaining = 100 - pctConsumed;

  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-text-secondary/60 uppercase tracking-wider mb-3 font-semibold">How much Dasha period is left?</div>
      <svg viewBox="0 0 300 80" className="w-full">
        {/* Nakshatra span bar */}
        <rect x="10" y="20" width="280" height="24" rx="4" fill="#1e293b" />
        {/* Consumed */}
        <rect x="10" y="20" width={pctConsumed * 2.8} height="24" rx="4" fill={color + '50'} />
        {/* Moon position marker */}
        <line x1={10 + pctConsumed * 2.8} y1="15" x2={10 + pctConsumed * 2.8} y2="50" stroke="#e2e8f0" strokeWidth="2" />
        <text x={10 + pctConsumed * 2.8} y="12" textAnchor="middle" fontSize="10">🌙</text>
        {/* Labels */}
        <text x="10" y="58" fill="#64748b" fontSize="8">Start of {planetName} Dasha</text>
        <text x="290" y="58" textAnchor="end" fill="#64748b" fontSize="8">End of {planetName} Dasha</text>
        {/* Remaining marker */}
        <rect x={10 + pctConsumed * 2.8} y="20" width={pctRemaining * 2.8} height="24" fill={color + '30'} />
        <text x={10 + (pctConsumed + pctRemaining / 2) * 2.8} y="36" textAnchor="middle" fill={color} fontSize="8" fontWeight="bold">
          {balanceYears.toFixed(2)} yrs left
        </text>
      </svg>
      <p className="text-text-secondary text-xs mt-2">
        The Moon has traversed {(posInNak / nakSpan * 100).toFixed(1)}% of this Nakshatra.
        The {planetName} Dasha ({planetYears} years total) is {(100 - pctConsumed).toFixed(1)}% remaining at birth.
      </p>
    </div>
  );
}

function TimelineBar({ segments, birthDate, today }: { segments: DashaSegment[]; birthDate: Date; today: Date }) {
  const totalMs = segments[segments.length - 1].endDate.getTime() - birthDate.getTime();
  const todayMs = today.getTime() - birthDate.getTime();
  const todayPct = Math.min(Math.max(todayMs / totalMs * 100, 0), 100);

  return (
    <div className="mb-6">
      <div className="relative">
        <div className="flex rounded-xl overflow-hidden h-14 border border-white/10">
          {segments.map((seg, i) => {
            const pct = (seg.endDate.getTime() - seg.startDate.getTime()) / totalMs * 100;
            const isCurrent = today >= seg.startDate && today < seg.endDate;
            return (
              <div key={i} className="relative flex items-center justify-center text-sm overflow-hidden transition-all"
                style={{ width: `${pct}%`, backgroundColor: seg.color + (isCurrent ? 'cc' : '44'), borderRight: '1px solid rgba(255,255,255,0.05)' }}
                title={`${seg.planetName}: ${formatDate(seg.startDate)} - ${formatDate(seg.endDate)}`}>
                {pct > 6 && <span style={{ color: isCurrent ? '#fff' : seg.color }}>{GRAHAS[seg.planetId].symbol}</span>}
                {isCurrent && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/80 animate-pulse" />}
              </div>
            );
          })}
        </div>
        {/* Today marker */}
        <div className="absolute top-0 h-14 w-0.5 bg-amber-400" style={{ left: `${todayPct}%` }} />
        <div className="relative h-5 mt-0.5">
          <div className="absolute text-[10px] text-amber-300 font-semibold whitespace-nowrap" style={{ left: `${todayPct}%`, transform: 'translateX(-50%)' }}>
            ▲ Today
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function DashaLabPage() {
  const locale = useLocale() as Locale;
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState('1990-01-15');
  const [birthTime, setBirthTime] = useState('06:00');
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [locationName, setLocationName] = useState('');
  const [computed, setComputed] = useState(false);

  const TOTAL_STEPS = 5;
  const today = new Date();

  const calc = useMemo(() => {
    if (!computed || !location) return null;
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    const decimalHour = hour + minute / 60;
    const tzOffset = getUTCOffsetForDate(year, month, day, location.timezone);
    const utHour = decimalHour - tzOffset;
    const jd = dateToJD(year, month, day, utHour);

    const tropMoon = moonLongitude(jd);
    const sidMoon = toSidereal(tropMoon, jd);
    const nakNum = getNakshatraNumber(sidMoon);
    const nak = NAKSHATRAS[nakNum - 1];

    const nakStart = (nakNum - 1) * NAK_SPAN;
    const posInNak = sidMoon - nakStart;
    const degRemaining = NAK_SPAN - posInNak;

    const vIdx = RULER_TO_IDX[nak.ruler];
    const startVimsh = VIMSHOTTARI_ORDER[vIdx];
    const balanceYears = (degRemaining / NAK_SPAN) * startVimsh.years;

    const birthDateObj = new Date(year, month - 1, day, hour, minute);
    const segments: DashaSegment[] = [];
    let cursor = new Date(birthDateObj);

    // First dasha (partial)
    const firstEnd = addYearsDecimal(cursor, balanceYears);
    segments.push({ planetId: startVimsh.id, planetName: startVimsh.name, color: startVimsh.color, startDate: cursor, endDate: firstEnd, durationYears: balanceYears, isPartial: true });
    cursor = firstEnd;

    let idx = (vIdx + 1) % 9;
    for (let cycle = 0; cycle < 18; cycle++) {
      const v = VIMSHOTTARI_ORDER[idx];
      const end = addYearsDecimal(cursor, v.years);
      segments.push({ planetId: v.id, planetName: v.name, color: v.color, startDate: cursor, endDate: end, durationYears: v.years });
      cursor = end;
      idx = (idx + 1) % 9;
      if ((cursor.getTime() - birthDateObj.getTime()) / (365.25 * 24 * 60 * 60 * 1000) > 130) break;
    }

    const currentSeg = segments.find(s => today >= s.startDate && today < s.endDate);

    return { tropMoon, sidMoon, nakNum, nak, posInNak, degRemaining, vIdx, startVimsh, balanceYears, segments, birthDateObj, currentSeg };
  }, [computed, birthDate, birthTime, location]);

  const L = (obj: { en: string; hi?: string; sa?: string } | undefined) => {
    if (!obj) return '';
    return (obj as Record<string, string>)[locale] || (obj as Record<string, string>).en || '';
  };

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const progressLabels = ['Setup', 'What is Dasha?', 'Birth Moon', 'Nakshatra Lord', 'Balance', 'Your Timeline'];

  return (
    <div className="min-h-screen">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <Moon className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
            Your Dasha Timeline
          </h1>
        </div>
        <p className="text-text-secondary text-base">Understand your life chapters — from birth data to a 120-year map</p>
      </div>

      {/* Progress */}
      <div className="max-w-3xl mx-auto mb-10 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max px-2">
          {progressLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <button onClick={() => { if (i === 0 || (calc && i > 0)) setStep(i); else if (i === 0) setStep(0); }}
                disabled={i > 1 && !calc}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === step ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
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

      <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-xl min-h-[500px]">
        <AnimatePresence mode="wait">

          {/* STEP 0: Setup */}
          {step === 0 && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">📅</div>
                <h2 className="text-2xl font-bold text-white mb-2">Compute Your Life Chapters</h2>
                <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
                  In Vedic astrology, your entire life is divided into planetary periods called Dashas. We'll calculate your personal 120-year sequence using just your birth date, time, and place.
                </p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-300/80 mb-1.5">Birth Date</label>
                    <input type="date" value={birthDate} onChange={e => { setBirthDate(e.target.value); setComputed(false); }}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-colors [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-300/80 mb-1.5">Birth Time</label>
                    <input type="time" value={birthTime} onChange={e => { setBirthTime(e.target.value); setComputed(false); }}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-amber-500/50 focus:outline-none transition-colors [color-scheme:dark]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-300/80 mb-1.5">Birth Place</label>
                  <LocationSearch value={locationName} onSelect={loc => { setLocation(loc); setLocationName(loc.name); setComputed(false); }} placeholder="Search city..." className="w-full" />
                </div>
              </div>
              <button onClick={() => { setComputed(true); setStep(1); }} disabled={!location}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2">
                Calculate My Dashas <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 1: What is Dasha? */}
          {step === 1 && (
            <StepShell key="concept" stepNum={1} totalSteps={TOTAL_STEPS}
              title="What is a Dasha? (Your Life Chapters)"
              subtitle="Vedic astrology divides your entire life into planetary periods — each with a distinct quality and theme.">
              <WhyBox>
                Imagine your life as a long road trip. Different planets take turns "driving" for multi-year stretches. When your Sun Dasha is active, solar themes dominate: identity, authority, vitality, father. When the Moon Dasha runs, lunar themes rise: mind, emotions, mother, public. The planet driving shapes the opportunities and challenges that tend to emerge during that period.
                <br /><br />
                This is the Vimshottari Dasha system — "Vimshottari" means 120 in Sanskrit, because the full cycle takes exactly 120 years.
              </WhyBox>

              <DashaCycleDiagram />

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                {VIMSHOTTARI_ORDER.map(v => (
                  <div key={v.name} className="text-center p-2 rounded-lg border border-white/8 bg-white/[0.02]">
                    <div className="text-xl mb-0.5">{GRAHAS[v.id].symbol}</div>
                    <div className="text-xs font-semibold" style={{ color: v.color }}>{v.name}</div>
                    <div className="text-xs text-text-secondary/60">{v.years} years</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <p className="text-text-primary text-sm leading-relaxed">
                  <strong className="text-amber-300">But why does your birth time matter?</strong> Because you're born mid-way through a planetary period. The Moon's position in your birth chart tells us exactly how far into the first period you are — and therefore when every subsequent period starts. This is why an accurate birth time is so critical.
                </p>
              </div>
              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 2: Birth Moon Position */}
          {step === 2 && calc && (
            <StepShell key="moon" stepNum={2} totalSteps={TOTAL_STEPS}
              title="Birth Moon Position"
              subtitle="The Moon at birth is the anchor of your entire Dasha sequence.">
              <WhyBox>
                Of all the planets, the Moon moves the fastest through the Nakshatras — completing one full round in just 27 days. This makes it ideal as a "clock hand" — by knowing exactly where in which Nakshatra the Moon was at birth, we know precisely how far into that Nakshatra's planetary period you arrived. That fraction becomes your starting Dasha balance.
              </WhyBox>

              <div className="space-y-2 mb-4">
                <CalcRow label="Birth Tropical Moon longitude" value={`${calc.tropMoon.toFixed(4)}°`} />
                <CalcRow label="Lahiri Ayanamsha applied" value="(see Moon lab for detail)" />
                <CalcRow label="Sidereal Moon longitude" value={`${calc.sidMoon.toFixed(4)}°`} highlight />
                <CalcRow label="Nakshatra = floor(° ÷ 13.333) + 1" value={`${calc.nakNum}`} />
                <CalcRow label="Birth Nakshatra" value={`${L(calc.nak.name)} (Nakshatra #${calc.nakNum})`} highlight />
                <CalcRow label="Ruling planet" value={calc.nak.ruler} />
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-center">
                <div className="text-xs text-amber-500/70 uppercase tracking-widest mb-1">Birth Moon</div>
                <div className="text-3xl font-bold text-amber-200">{L(calc.nak.name)}</div>
                <div className="text-amber-400/80 text-sm font-mono">{calc.sidMoon.toFixed(4)}° · Nakshatra {calc.nakNum}</div>
                <div className="text-text-secondary text-xs mt-1">Ruled by {calc.nak.ruler} → {calc.startVimsh.name} Dasha starts at birth</div>
              </div>
              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 3: Nakshatra Lord Mapping */}
          {step === 3 && calc && (
            <StepShell key="lord" stepNum={3} totalSteps={TOTAL_STEPS}
              title="Which Planet Starts Your Dasha?"
              subtitle="Each Nakshatra has a ruling planet. That planet's period is what runs first — but only the remaining portion.">
              <WhyBox>
                The 27 Nakshatras are divided equally among 9 planets — 3 Nakshatras per planet. Your birth Nakshatra tells us which planet "owns" the chapter you're being born into. Since you're born somewhere in the middle of that Nakshatra, you don't get the full period — only what's left. The remaining fraction becomes your "dasha balance" at birth.
              </WhyBox>

              <NakshatraNakshMap nakNum={calc.nakNum} />

              <div className="space-y-2">
                <CalcRow label="Birth Nakshatra" value={`${L(calc.nak.name)} (#${calc.nakNum})`} />
                <CalcRow label="Ruling planet" value={calc.startVimsh.name} highlight />
                <CalcRow label="Full period length" value={`${calc.startVimsh.years} years`} />
                <CalcRow label="Position in Nakshatra" value={`${calc.posInNak.toFixed(4)}° of ${NAK_SPAN.toFixed(3)}°`} />
                <CalcRow label="Degrees remaining" value={`${calc.degRemaining.toFixed(4)}°`} />
              </div>
              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 4: Balance Calculation */}
          {step === 4 && calc && (
            <StepShell key="balance" stepNum={4} totalSteps={TOTAL_STEPS}
              title="Dasha Balance at Birth"
              subtitle="A simple proportion: how much of the Nakshatra is left determines how much of the period is left.">
              <WhyBox>
                If the Moon is at the very start of the Nakshatra (0° in), you get the full Dasha period. If it's at the very end (13.333° in), you get almost nothing. Any position in between gives a proportional slice. This is elegant: the Nakshatra acts as a 13.333° measuring stick, and your Moon's position on that stick determines your birth-time starting balance.
              </WhyBox>

              <BalanceDiagram
                posInNak={calc.posInNak}
                nakSpan={NAK_SPAN}
                planetName={calc.startVimsh.name}
                planetYears={calc.startVimsh.years}
                balanceYears={calc.balanceYears}
                color={calc.startVimsh.color}
              />

              <div className="mb-4 p-4 rounded-xl bg-black/20 border border-white/8">
                <div className="text-xs text-text-secondary/60 font-semibold uppercase tracking-wider mb-3">Formula</div>
                <div className="font-mono text-amber-200 text-sm leading-relaxed">
                  Balance = (degrees remaining ÷ nakshatra span) × full period
                  <br />
                  = ({calc.degRemaining.toFixed(4)} ÷ {NAK_SPAN.toFixed(4)}) × {calc.startVimsh.years}
                  <br />
                  = <span className="text-amber-300 font-bold">{calc.balanceYears.toFixed(4)} years</span>
                </div>
              </div>

              <div className="space-y-2">
                <CalcRow label="Degrees remaining in Nakshatra" value={`${calc.degRemaining.toFixed(4)}°`} />
                <CalcRow label="Nakshatra span" value={`${NAK_SPAN.toFixed(4)}°`} />
                <CalcRow label="Fraction remaining" value={(calc.degRemaining / NAK_SPAN).toFixed(6)} />
                <CalcRow label={`× ${calc.startVimsh.name} period (${calc.startVimsh.years} years)`} value="" />
                <CalcRow label="Dasha balance at birth" value={formatDuration(calc.balanceYears)} highlight />
                <CalcRow label={`${calc.startVimsh.name} Dasha ends`} value={formatDate(calc.segments[0].endDate)} />
              </div>

              <NavButtons onBack={back} onNext={next} nextLabel="See Full Timeline →" />
            </StepShell>
          )}

          {/* STEP 5: Full Timeline */}
          {step === 5 && calc && (
            <motion.div key="timeline" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeOut' as const }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Step 5</span><span className="text-amber-500/40">/</span><span className="text-amber-500/60">{TOTAL_STEPS}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your 120-Year Dasha Map</h2>
              <p className="text-text-secondary text-base mb-6">Each colored block is one Maha Dasha. The white line is today.</p>

              <TimelineBar segments={calc.segments} birthDate={calc.birthDateObj} today={today} />

              {/* Current Dasha highlight */}
              {calc.currentSeg && (
                <div className="mb-5 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
                  <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-1">You are currently in</div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{GRAHAS[calc.currentSeg.planetId].symbol}</span>
                    <div>
                      <div className="text-white font-bold text-lg">{calc.currentSeg.planetName} Maha Dasha</div>
                      <div className="text-text-secondary text-xs">{formatDate(calc.currentSeg.startDate)} — {formatDate(calc.currentSeg.endDate)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="space-y-1.5">
                {calc.segments.map((seg, i) => {
                  const isCurrent = today >= seg.startDate && today < seg.endDate;
                  return (
                    <div key={i}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isCurrent ? 'border-amber-500/30 bg-amber-500/8' : 'border-white/5 bg-white/[0.02]'}`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ backgroundColor: seg.color + '25', color: seg.color }}>{GRAHAS[seg.planetId].symbol}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          {seg.planetName}
                          {seg.isPartial && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">PARTIAL</span>}
                          {isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 animate-pulse">NOW</span>}
                        </div>
                        <div className="text-xs text-text-secondary/60 font-mono">{formatDate(seg.startDate)} — {formatDate(seg.endDate)}</div>
                      </div>
                      <div className="text-xs font-mono text-text-secondary flex-shrink-0">{formatDuration(seg.durationYears)}</div>
                    </div>
                  );
                })}
              </div>

              <NavButtons onBack={back} onNext={() => setStep(0)} nextLabel="Try Another Birth" />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
