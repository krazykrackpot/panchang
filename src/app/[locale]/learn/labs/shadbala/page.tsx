'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, ArrowRight, ArrowLeft, ChevronRight, CheckCircle2, Crown, Trophy } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { GRAHAS } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/labs-shadbala.json';

interface LocationResult { name: string; lat: number; lng: number; timezone: string; }

const BALA_INFO = [
  { key: 'sthanaBala' as const,    color: '#e67e22', label: 'Sthana Bala',    icon: '🏠', plain: 'Positional strength — is the planet in its home, exalted, or a hostile sign?', detail: 'A planet in its own sign (like Mars in Aries) or exalted sign (like Mars in Capricorn) gets full Sthana Bala. Like a person performing at their home stadium — they have all the advantages.' },
  { key: 'digBala' as const,       color: '#3498db', label: 'Dig Bala',       icon: '🧭', plain: 'Directional strength — which house (corner of the chart) does the planet prefer?', detail: 'Each planet has a preferred angular house (kendra) where it shines brightest: Jupiter loves the 1st house, Sun/Mars prefer the 10th, Saturn the 7th, Moon/Venus the 4th, Mercury the 1st.' },
  { key: 'kalaBala' as const,      color: '#9b59b6', label: 'Kala Bala',      icon: '⏰', plain: 'Temporal strength — is the planet powerful right now (day vs night, lunar phase)?', detail: 'Solar planets (Sun, Jupiter, Venus) are stronger by day; Lunar planets (Moon, Mars, Saturn) are stronger by night. Mercury is equal both times. The lunar paksha (fortnight) also boosts or weakens planets.' },
  { key: 'cheshtaBala' as const,   color: '#e74c3c', label: 'Cheshta Bala',   icon: '🏃', plain: 'Motional strength — is the planet moving fast, slow, or retrograde?', detail: 'A planet moving faster than average is exerting more effort (more cheshta). Retrograde planets get a special high Cheshta Bala — their apparent backward motion shows unusual intensity. Stationary planets get low Cheshta Bala.' },
  { key: 'naisargikaBala' as const, color: '#2ecc71', label: 'Naisargika Bala', icon: '✨', plain: 'Natural/inherent strength — some planets are just naturally stronger than others.', detail: 'This is fixed and never changes: Sun has the most natural strength, then Moon, Venus, Jupiter, Mercury, Mars, Saturn (weakest). Think of it as the planet\'s baseline "wattage" regardless of position.' },
  { key: 'drikBala' as const,      color: '#f39c12', label: 'Drik Bala',      icon: '👁️', plain: 'Aspectual strength — what aspects does the planet receive from benefics or malefics?', detail: 'Benefic planets (Jupiter, Venus, Moon, Mercury) aspecting a planet give it positive Drik Bala. Malefic aspects (Saturn, Mars, Rahu, Ketu) reduce it. A planet heavily aspected by Jupiter is like having a powerful mentor.' },
];

function getBarColor(strengthRatio: number): string {
  if (strengthRatio >= 1.5) return '#22c55e'; // green — strong
  if (strengthRatio >= 1.0) return '#eab308'; // yellow — adequate
  return '#ef4444'; // red — weak
}

// ── UI Primitives ───────────────────────────────────────────────────────────

function NavButtons({ onBack, onNext, backLabel = 'Back', nextLabel = 'Next Step', disableNext }: {
  onBack?: () => void; onNext?: () => void; backLabel?: string; nextLabel?: string; disableNext?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-8">
      {onBack
        ? <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />{backLabel}
          </button>
        : <div />}
      {onNext && (
        <button onClick={onNext} disabled={disableNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2d1b69] to-purple-900 hover:from-[#3d2b79] hover:to-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg">
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
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <span>Step {stepNum}</span><span className="text-emerald-500/40">/</span><span className="text-emerald-500/60">{totalSteps}</span>
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{title}</h2>
      <p className="text-slate-400 text-base mb-8 leading-relaxed">{subtitle}</p>
      {children}
    </motion.div>
  );
}

// ── Diagrams ────────────────────────────────────────────────────────────────

function SixBalaWheel() {
  const cx = 130, cy = 130, r = 90, rInner = 45;
  const n = BALA_INFO.length;

  function wedgePath(i: number) {
    const sweep = (2 * Math.PI) / n;
    const start = sweep * i - Math.PI / 2;
    const end = start + sweep;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const x3 = cx + rInner * Math.cos(end), y3 = cy + rInner * Math.sin(end);
    const x4 = cx + rInner * Math.cos(start), y4 = cy + rInner * Math.sin(start);
    return `M${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} L${x3},${y3} A${rInner},${rInner} 0 0,0 ${x4},${y4} Z`;
  }

  return (
    <div className="mb-6 p-4 rounded-xl bg-black/20 border border-white/8">
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">The 6 Sources of Planetary Strength</div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <svg viewBox="0 0 260 260" className="w-52 flex-shrink-0">
          {BALA_INFO.map((b, i) => {
            const sweep = (2 * Math.PI) / n;
            const mid = sweep * i - Math.PI / 2 + sweep / 2;
            const tx = cx + (r + 18) * Math.cos(mid);
            const ty = cy + (r + 18) * Math.sin(mid);
            return (
              <g key={i}>
                <path d={wedgePath(i)} fill={b.color + '30'} stroke={b.color + '70'} strokeWidth="1.5" />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="12">{b.icon}</text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={rInner} fill="#060918" stroke="#1e293b" strokeWidth="1" />
          <text x={cx} y={cy - 6} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">Shadbala</text>
          <text x={cx} y={cy + 7} textAnchor="middle" fill="#64748b" fontSize="8">6 Strengths</text>
        </svg>
        <div className="space-y-2 flex-1">
          {BALA_INFO.map(b => (
            <div key={b.key} className="flex items-start gap-2">
              <span className="text-base flex-shrink-0">{b.icon}</span>
              <div>
                <span className="text-xs font-semibold" style={{ color: b.color }}>{b.label}</span>
                <p className="text-slate-500 text-xs leading-tight">{b.plain}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RadarDiagram({ sb, maxBala }: { sb: ShadBalaComplete; maxBala: number }) {
  const cx = 100, cy = 100, r = 70, n = 6;
  const toRad = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2;

  const values = [
    Math.abs(sb.sthanaBala), Math.abs(sb.digBala), Math.abs(sb.kalaBala),
    Math.abs(sb.cheshtaBala), Math.abs(sb.naisargikaBala), Math.abs(sb.drikBala),
  ];

  const points = values.map((v, i) => {
    const pct = Math.min(v / maxBala, 1);
    const angle = toRad(i);
    return { x: cx + r * pct * Math.cos(angle), y: cy + r * pct * Math.sin(angle) };
  });

  const path = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ') + ' Z';

  // Grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg viewBox="0 0 200 200" className="w-32 flex-shrink-0">
      {/* Grid */}
      {gridLevels.map(level => (
        <polygon key={level}
          points={Array.from({ length: n }, (_, i) => {
            const angle = toRad(i);
            return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`;
          }).join(' ')}
          fill="none" stroke="#1e293b" strokeWidth="0.5" />
      ))}
      {/* Axis lines */}
      {Array.from({ length: n }, (_, i) => {
        const angle = toRad(i);
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#1e293b" strokeWidth="0.5" />;
      })}
      {/* Filled area */}
      <path d={path} fill="#22c55e30" stroke="#22c55e" strokeWidth="1.5" />
      {/* Icons */}
      {BALA_INFO.map((b, i) => {
        const angle = toRad(i);
        const tx = cx + (r + 14) * Math.cos(angle);
        const ty = cy + (r + 14) * Math.sin(angle);
        return <text key={i} x={tx} y={ty + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10">{b.icon}</text>;
      })}
    </svg>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function ShadbalaLabPage() {
  const locale = useLocale() as Locale;
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState('1990-01-15');
  const [birthTime, setBirthTime] = useState('06:00');
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [locationName, setLocationName] = useState('');
  const [computed, setComputed] = useState(false);
  const [selectedBala, setSelectedBala] = useState(0); // index into BALA_INFO

  const TOTAL_STEPS = 4;

  const [result, setResult] = useState<{
    shadbala: ShadBalaComplete[];
    ranked: ShadBalaComplete[];
    captain: ShadBalaComplete;
    maxBala: number;
  } | null>(null);

  // Fetch kundali via API to ensure Swiss Ephemeris accuracy (never client-side Meeus fallback)
  useEffect(() => {
    if (!computed || !location) { setResult(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/kundali', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Lab User', date: birthDate, time: birthTime, place: location.name,
            lat: location.lat, lng: location.lng, timezone: location.timezone,
            ayanamsha: 'lahiri',
          }),
        });
        if (cancelled) return;
        const kundali = await res.json();
        const shadbala: ShadBalaComplete[] | undefined = kundali.fullShadbala;
        if (!shadbala || shadbala.length === 0) { setResult(null); return; }
        const ranked = [...shadbala].sort((a, b) => b.rupas - a.rupas);
        const maxBala = Math.max(...shadbala.flatMap((s: ShadBalaComplete) => [s.sthanaBala, s.digBala, s.kalaBala, s.cheshtaBala, s.naisargikaBala, Math.abs(s.drikBala)]));
        setResult({ shadbala, ranked, captain: ranked[0], maxBala });
      } catch (err) {
        console.error('[shadbala-lab] Kundali fetch failed:', err);
        setResult(null);
      }
    })();
    return () => { cancelled = true; };
  }, [computed, birthDate, birthTime, location]);

  const t = (key: string) => lt((LJ as unknown as Record<string, LocaleText>)[key], locale);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const progressLabels = ['Setup', 'What is Shadbala?', 'Explore Each Bala', 'All Planets', 'Ranking'];

  return (
    <div className="min-h-screen">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#f0d48a] bg-clip-text text-transparent">
            Shadbala Breakdown
          </h1>
        </div>
        <p className="text-slate-400 text-base">Six ways to measure planetary strength — explained from scratch</p>
      </div>

      {/* Progress */}
      <div className="max-w-3xl mx-auto mb-10 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max px-2">
          {progressLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <button onClick={() => { if (i === 0 || (i <= 2) || result) setStep(i); }}
                disabled={i > 2 && !result}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === step ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
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
                <div className="text-4xl mb-3">⚖️</div>
                <h2 className="text-2xl font-bold text-white mb-2">Measure Your Planets' Strength</h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                  Not all planets in a chart are equally powerful. Shadbala is a precise 6-component scoring system that tells you exactly how strong each planet is — and therefore which ones dominate your life.
                </p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-300/80 mb-1.5">Birth Date</label>
                    <input type="date" value={birthDate} onChange={e => { setBirthDate(e.target.value); setComputed(false); }}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-emerald-500/50 focus:outline-none transition-colors [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-300/80 mb-1.5">Birth Time</label>
                    <input type="time" value={birthTime} onChange={e => { setBirthTime(e.target.value); setComputed(false); }}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-emerald-500/50 focus:outline-none transition-colors [color-scheme:dark]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-300/80 mb-1.5">Birth Place</label>
                  <LocationSearch value={locationName} onSelect={loc => { setLocation(loc); setLocationName(loc.name); setComputed(false); }} placeholder="Search city..." className="w-full" />
                </div>
              </div>
              <button onClick={() => { setComputed(true); setStep(1); }} disabled={!location}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2d1b69] to-purple-900 hover:from-[#3d2b79] hover:to-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2">
                Calculate Shadbala <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 1: Concept */}
          {step === 1 && (
            <StepShell key="concept" stepNum={1} totalSteps={TOTAL_STEPS}
              title="What is Shadbala?"
              subtitle="'Shadba' means six, 'Bala' means strength. Shadbala is a precise system for measuring a planet's total power from 6 independent angles.">
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                <div className="text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-2">Why does this matter for you?</div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  In a birth chart, the same planet in two different charts can have very different levels of actual influence. A Saturn placed in its own sign (Capricorn) at a kendra house, aspected by Jupiter, in a daytime chart — that Saturn has enormous Shadbala. A Saturn in an enemy sign, in a cadent house, retrograde and aspected by Mars — much weaker. The same planet, radically different impact. Shadbala lets you quantify this.
                </p>
              </div>

              <SixBalaWheel />

              <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-2">The Score: Rupas</div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  All 6 components are summed into a single score called <strong className="text-white">Rupas</strong> (units). Each planet has a minimum Rupas threshold it needs to be considered "strong enough":
                </p>
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-7 gap-2 text-center text-xs">
                  {[{s: '☀️', n: 'Sun', min: '6.5'}, {s: '🌙', n: 'Moon', min: '6.0'}, {s: '♂️', n: 'Mars', min: '5.0'}, {s: '☿', n: 'Merc', min: '7.0'}, {s: '♃', n: 'Jup', min: '6.5'}, {s: '♀', n: 'Ven', min: '5.5'}, {s: '♄', n: 'Sat', min: '5.0'}].map(p => (
                    <div key={p.n} className="p-1.5 rounded-lg bg-white/5 border border-white/8">
                      <div>{p.s}</div>
                      <div className="text-slate-400">{p.min}</div>
                    </div>
                  ))}
                </div>
              </div>

              <NavButtons onBack={back} onNext={next} />
            </StepShell>
          )}

          {/* STEP 2: Explore Each Bala */}
          {step === 2 && (
            <StepShell key="explore" stepNum={2} totalSteps={TOTAL_STEPS}
              title="Explore Each Bala"
              subtitle="Click any of the 6 strength components to understand what it measures and why it matters.">
              {/* Bala selector tabs */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {BALA_INFO.map((b, i) => (
                  <button key={i} onClick={() => setSelectedBala(i)}
                    className={`p-3 rounded-xl border text-center transition-all ${selectedBala === i ? 'border-opacity-50 bg-opacity-15' : 'border-white/8 bg-white/[0.02] hover:bg-white/5'}`}
                    style={{ borderColor: selectedBala === i ? b.color : undefined, backgroundColor: selectedBala === i ? b.color + '15' : undefined }}>
                    <div className="text-xl mb-1">{b.icon}</div>
                    <div className="text-xs font-semibold" style={{ color: selectedBala === i ? b.color : '#94a3b8' }}>{b.label.replace(' Bala', '')}</div>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={selectedBala} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}>
                  <div className="p-5 rounded-2xl border" style={{ borderColor: BALA_INFO[selectedBala].color + '40', backgroundColor: BALA_INFO[selectedBala].color + '08' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{BALA_INFO[selectedBala].icon}</span>
                      <h3 className="text-xl font-bold text-white">{BALA_INFO[selectedBala].label}</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{BALA_INFO[selectedBala].detail}</p>

                    {/* Visual for each bala */}
                    {selectedBala === 0 && (
                      <div className="p-3 rounded-lg bg-black/20 text-xs text-slate-400 leading-relaxed">
                        <strong className="text-orange-300">Example:</strong> Jupiter placed in Cancer (its exaltation sign) gets near-maximum Sthana Bala. Jupiter in Capricorn (its debilitation sign) gets minimal Sthana Bala. The same Jupiter — completely different home-field advantage.
                      </div>
                    )}
                    {selectedBala === 1 && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[{p: 'Jupiter / Mercury', h: '1st house (Lagna)', c: '#f39c12'}, {p: 'Sun / Mars', h: '10th house (MC)', c: '#e67e22'}, {p: 'Saturn', h: '7th house (Descendent)', c: '#3498db'}, {p: 'Moon / Venus', h: '4th house (IC)', c: '#ecf0f1'}].map(item => (
                          <div key={item.p} className="p-2 rounded-lg bg-black/20 border border-white/5">
                            <div className="font-semibold" style={{ color: item.c }}>{item.p}</div>
                            <div className="text-slate-500">→ strongest in {item.h}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedBala === 4 && (
                      <div className="grid grid-cols-4 gap-1 text-xs text-center">
                        {[{s: '☀️', n: 'Sun', v: '60'}, {s: '🌙', n: 'Moon', v: '51.4'}, {s: '♀', n: 'Venus', v: '45'}, {s: '♃', n: 'Jupiter', v: '34.3'}, {s: '☿', n: 'Mercury', v: '25.7'}, {s: '♂️', n: 'Mars', v: '17.1'}, {s: '♄', n: 'Saturn', v: '8.6'}].map(p => (
                          <div key={p.n} className="p-1.5 rounded bg-white/5 border border-white/8">
                            <div>{p.s}</div>
                            <div className="text-emerald-400 font-mono text-[10px]">{p.v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <NavButtons onBack={back} onNext={next} backLabel={t('back')} disableNext={!result} nextLabel={result ? t('seeYourResults') : 'Calculating…'} />
            </StepShell>
          )}

          {/* STEP 3: All Planets */}
          {step === 3 && result && (
            <motion.div key="planets" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeOut' as const }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Step 3</span><span className="opacity-40">/</span><span className="opacity-60">{TOTAL_STEPS}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">All Planets — Six Strengths Each</h2>
              <p className="text-slate-400 text-base mb-6">Each bar shows one of the 6 Bala components. The overall score (Rupas) determines planetary dominance.</p>

              <div className="space-y-4">
                {result.shadbala.map((sb, idx) => {
                  const graha = GRAHAS[sb.planetId];
                  const totalColor = getBarColor(sb.strengthRatio);
                  const barMax = result.maxBala * 1.1;

                  return (
                    <motion.div key={sb.planetId}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      className="p-4 rounded-2xl border border-white/8 bg-white/[0.02]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <RadarDiagram sb={sb} maxBala={result.maxBala} />
                          <div>
                            <div className="font-bold text-white text-lg">{graha.symbol} {lt(graha.name as LocaleText, locale)}</div>
                            <div className="text-xs text-slate-500">Rank #{sb.rank}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-mono font-bold" style={{ color: totalColor }}>{sb.rupas.toFixed(2)}</div>
                          <div className="text-xs text-slate-500">min {sb.minRequired.toFixed(1)}</div>
                          <div className="text-xs font-semibold" style={{ color: totalColor }}>
                            {sb.rupas >= sb.minRequired ? `✓ ${t('strong')}` : `✗ ${t('weak')}`}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {BALA_INFO.map(b => {
                          const val = sb[b.key];
                          const pct = Math.min(Math.abs(val) / barMax * 100, 100);
                          return (
                            <div key={b.key} className="flex items-center gap-2">
                              <span className="w-5 text-center text-xs flex-shrink-0">{b.icon}</span>
                              <div className="flex-1 relative h-3.5 rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ delay: idx * 0.07 + 0.2, duration: 0.5, ease: 'easeOut' as const }}
                                  className="absolute left-0 top-0 h-full rounded-full"
                                  style={{ backgroundColor: b.color + 'bb' }} />
                              </div>
                              <span className="w-10 text-right text-xs font-mono text-slate-400 flex-shrink-0">{val.toFixed(1)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <NavButtons onBack={back} onNext={next} nextLabel="See Ranking →" />
            </motion.div>
          )}

          {/* STEP 4: Ranking */}
          {step === 4 && result && (
            <motion.div key="ranking" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeOut' as const }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Step 4</span><span className="opacity-40">/</span><span className="opacity-60">{TOTAL_STEPS}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Planetary Ranking</h2>
              <p className="text-slate-400 text-base mb-6">The strongest planet dominates your chart's overall themes.</p>

              {/* Chart Captain */}
              <div className="mb-6 p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-orange-500/5 flex items-center gap-4">
                <Crown className="w-10 h-10 text-amber-300 flex-shrink-0" />
                <div>
                  <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-1">Chart Captain — Strongest Planet</div>
                  <div className="text-2xl font-bold text-amber-200 flex items-center gap-2">
                    <span className="text-3xl">{GRAHAS[result.captain.planetId].symbol}</span>
                    {lt(GRAHAS[result.captain.planetId].name as LocaleText, locale)}
                    <span className="text-lg font-mono text-amber-300/70">{result.captain.rupas.toFixed(2)} rupas</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">This planet dominates the chart — its significations, house placement, and dasha periods carry the most weight in life outcomes.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {result.ranked.map((sb, i) => {
                  const graha = GRAHAS[sb.planetId];
                  const pct = (sb.rupas / result.ranked[0].rupas) * 100;
                  const color = getBarColor(sb.strengthRatio);
                  return (
                    <motion.div key={sb.planetId}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${i === 0 ? 'border-amber-500/25 bg-amber-500/8' : 'border-white/5 bg-white/[0.02]'}`}>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white/60">#{i + 1}</div>
                      <span className="text-xl">{graha.symbol}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-white">{lt(graha.name as LocaleText, locale)}</span>
                          <span className="font-mono text-sm font-bold" style={{ color }}>{sb.rupas.toFixed(2)}</span>
                        </div>
                        <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ delay: i * 0.06 + 0.3, duration: 0.5 }}
                            className="absolute left-0 top-0 h-full rounded-full" style={{ backgroundColor: color }} />
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 flex-shrink-0">
                        {sb.rupas >= sb.minRequired ? <span className="text-emerald-400">✓ Strong</span> : <span className="text-red-400">✗ Weak</span>}
                      </div>
                    </motion.div>
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
