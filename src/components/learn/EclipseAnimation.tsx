'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

type Locale = 'en' | 'hi' | 'sa';

interface Props {
  locale: Locale;
}

const L = {
  solarTab:   { en: 'Solar Eclipse',  hi: 'सूर्य ग्रहण' },
  lunarTab:   { en: 'Lunar Eclipse',  hi: 'चन्द्र ग्रहण' },
  eclipse:    { en: 'Eclipse! Moon aligned with Sun-Earth at the node', hi: 'ग्रहण! चन्द्र पात पर सूर्य-पृथ्वी के साथ संरेखित' },
  noEclipse:  { en: 'No eclipse — Moon is above/below the ecliptic plane', hi: 'ग्रहण नहीं — चन्द्र क्रान्तिवृत्त तल से ऊपर/नीचे है' },
  lunarEclipse: { en: 'Lunar Eclipse! Moon enters Earth\'s shadow at the node', hi: 'चन्द्र ग्रहण! चन्द्र पात पर पृथ्वी की छाया में प्रवेश' },
  solarExpl: {
    en: 'Watch the Moon travel along its tilted orbit. When it crosses the ecliptic plane at a node (Rahu or Ketu) during New Moon, it passes between Sun and Earth — casting its shadow on Earth. This is a Solar Eclipse.',
    hi: 'चन्द्रमा को उसकी झुकी हुई कक्षा में चलते देखें। जब यह अमावस्या के समय किसी पात (राहु या केतु) पर क्रान्तिवृत्त तल को काटता है, तो यह सूर्य और पृथ्वी के बीच से गुजरता है — पृथ्वी पर अपनी छाया डालता है। यह सूर्य ग्रहण है।',
  },
  lunarExpl: {
    en: 'When the Full Moon crosses the ecliptic at a node, Earth comes between Sun and Moon. Earth\'s shadow falls on the Moon, turning it blood-red. This is a Lunar Eclipse (Blood Moon).',
    hi: 'जब पूर्णिमा का चन्द्र किसी पात पर क्रान्तिवृत्त को काटता है, तो पृथ्वी सूर्य और चन्द्र के बीच आती है। पृथ्वी की छाया चन्द्र पर पड़ती है, जिससे वह रक्त-लाल हो जाता है। यह चन्द्र ग्रहण (ब्लड मून) है।',
  },
};

const W = 620;
const H = 320;
const CY = 150; // ecliptic y-center
const ORBIT_AMP = 55; // exaggerated orbital tilt amplitude for visibility

// Animation: 10 seconds total, with 1.5s pause at each node crossing
const CYCLE_MS = 10000;
const PAUSE_DURATION = 1500; // ms to pause at eclipse point

/* Static star field */
const STARS: [number, number, number][] = [
  [25,18,0.15],[95,42,0.3],[155,12,0.2],[225,32,0.3],[305,18,0.15],
  [405,38,0.3],[485,12,0.2],[555,28,0.3],[65,95,0.15],[175,82,0.3],
  [355,88,0.15],[505,72,0.3],[585,108,0.15],[45,178,0.3],[205,198,0.15],
  [455,188,0.3],[535,228,0.15],[85,248,0.3],[335,258,0.15],[495,243,0.3],
  [600,40,0.2],[30,140,0.15],[580,160,0.2],[290,10,0.25],[420,280,0.2],
];

/**
 * Convert linear time [0,1] to animation time with pauses at eclipse points.
 * Eclipse crossings happen at raw t ≈ 0.25 and t ≈ 0.75.
 * At these points, the output t "stalls" for PAUSE_DURATION.
 */
function applyPause(rawT: number): number {
  // Total pause time as fraction of cycle
  const pauseFrac = (PAUSE_DURATION * 2) / CYCLE_MS; // two pauses
  const singlePause = pauseFrac / 2;

  // Pause windows centered at 0.25 and 0.75
  const p1Start = 0.25 - singlePause / 2;
  const p1End = 0.25 + singlePause / 2;
  const p2Start = 0.75 - singlePause / 2;
  const p2End = 0.75 + singlePause / 2;

  if (rawT >= p1Start && rawT <= p1End) return 0.25;
  if (rawT >= p2Start && rawT <= p2End) return 0.75;

  // Compress the remaining motion into the non-pause time
  if (rawT < p1Start) {
    return rawT * (0.25 / p1Start);
  } else if (rawT < p2Start) {
    const segment = rawT - p1End;
    const segmentLen = p2Start - p1End;
    return 0.25 + segment / segmentLen * 0.5;
  } else {
    const segment = rawT - p2End;
    const segmentLen = 1.0 - p2End;
    return 0.75 + segment / segmentLen * 0.25;
  }
}

/** Moon position on an elliptical orbit path. Crosses ecliptic at t=0.25 and t=0.75. */
function moonPos(t: number, leftX: number, rightX: number): { x: number; y: number } {
  const x = leftX + (rightX - leftX) * t;
  // Sine wave: crosses zero (ecliptic) at t=0.25 (ascending) and t=0.75 (descending)
  const y = CY - Math.sin((t - 0.25) * Math.PI * 2) * ORBIT_AMP;
  return { x, y };
}

/** Generate SVG path data for the elliptical orbit */
function orbitPath(leftX: number, rightX: number, direction: 'forward' | 'return'): string {
  const steps = 60;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = leftX + (rightX - leftX) * t;
    const sign = direction === 'forward' ? -1 : 1;
    const y = CY + sign * Math.sin((t - 0.25) * Math.PI * 2) * ORBIT_AMP;
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

function isNearEcliptic(t: number): boolean {
  const distFromEcliptic = Math.abs(Math.sin((t - 0.25) * Math.PI * 2) * ORBIT_AMP);
  return distFromEcliptic < 10;
}

/* ─── Solar Eclipse SVG ─── */
const SolarEclipseSVG = memo(function SolarEclipseSVG({ t, isHi }: { t: number; isHi: boolean }) {
  const sunX = 75;
  const earthX = 545;
  const orbitLeft = 130;
  const orbitRight = 510;

  // Node positions (where orbit crosses ecliptic)
  const node1X = orbitLeft + (orbitRight - orbitLeft) * 0.25; // ascending
  const node2X = orbitLeft + (orbitRight - orbitLeft) * 0.75; // descending

  const moon = moonPos(t, orbitLeft, orbitRight);
  const eclipse = isNearEcliptic(t);
  const shadowOpacity = eclipse ? Math.max(0, 1 - Math.abs(Math.sin((t - 0.25) * Math.PI * 2) * ORBIT_AMP) / 12) : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 320 }}>
      <rect width={W} height={H} fill="#060a1f" rx="16" />

      {/* Stars */}
      {STARS.map(([sx, sy, op], i) => (
        <circle key={i} cx={sx} cy={sy} r="0.8" fill="white" opacity={op} />
      ))}

      {/* ════ ECLIPTIC PLANE ════ — prominent gold line across full width */}
      <line x1="20" y1={CY} x2={W - 20} y2={CY} stroke="#d4a853" strokeWidth="2" opacity="0.6" />
      {/* Ecliptic label — left side */}
      <rect x="22" y={CY - 12} width={isHi ? 82 : 58} height="14" rx="3" fill="#0a0e27" opacity="0.8" />
      <text x="26" y={CY - 2} fontSize="9" fill="#d4a853" fontWeight="bold" opacity="0.9">
        {isHi ? 'क्रान्तिवृत्त तल' : 'Ecliptic Plane'}
      </text>

      {/* ════ MOON'S ORBITAL PATH ════ — smooth elliptical curve */}
      <path d={orbitPath(orbitLeft, orbitRight, 'forward')} fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeDasharray="8 4" opacity="0.6" />
      {/* Tilt label */}
      <text x={orbitRight + 5} y={CY - ORBIT_AMP - 5} fontSize="8" fill="#a78bfa" opacity="0.7">5.15°</text>
      <text x={orbitRight + 5} y={CY - ORBIT_AMP + 5} fontSize="7" fill="#a78bfa" opacity="0.5">
        {isHi ? 'कक्षा झुकाव' : 'orbit tilt'}
      </text>

      {/* ════ NODE MARKERS ════ */}
      {/* Rahu — ascending node */}
      <circle cx={node1X} cy={CY} r="12" fill="#d4a853" opacity="0.08" />
      <circle cx={node1X} cy={CY} r="12" fill="none" stroke="#d4a853" strokeWidth="2" opacity="0.7" />
      <text x={node1X} y={CY + 5} textAnchor="middle" fontSize="14" fill="#f0d48a" fontWeight="bold">☊</text>
      <text x={node1X} y={CY - 18} textAnchor="middle" fontSize="9" fill="#f0d48a" fontWeight="bold" opacity="0.9">
        {isHi ? 'राहु' : 'Rahu'}
      </text>
      <text x={node1X} y={CY + 26} textAnchor="middle" fontSize="7" fill="#d4a853" opacity="0.5">
        {isHi ? 'आरोही पात' : 'Ascending Node'}
      </text>

      {/* Ketu — descending node */}
      <circle cx={node2X} cy={CY} r="12" fill="#a78bfa" opacity="0.08" />
      <circle cx={node2X} cy={CY} r="12" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.7" />
      <text x={node2X} y={CY + 5} textAnchor="middle" fontSize="14" fill="#c4b5fd" fontWeight="bold">☋</text>
      <text x={node2X} y={CY - 18} textAnchor="middle" fontSize="9" fill="#c4b5fd" fontWeight="bold" opacity="0.9">
        {isHi ? 'केतु' : 'Ketu'}
      </text>
      <text x={node2X} y={CY + 26} textAnchor="middle" fontSize="7" fill="#a78bfa" opacity="0.5">
        {isHi ? 'अवरोही पात' : 'Descending Node'}
      </text>

      {/* ════ SUN ════ */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <line key={i} x1={sunX + Math.cos(angle) * 38} y1={CY + Math.sin(angle) * 38}
            x2={sunX + Math.cos(angle) * 50} y2={CY + Math.sin(angle) * 50}
            stroke="#f0d48a" strokeWidth="1.5" opacity="0.35" />
        );
      })}
      <circle cx={sunX} cy={CY} r="35" fill="#d4a853" opacity="0.15" />
      <circle cx={sunX} cy={CY} r="28" fill="#d4a853" />
      <text x={sunX} y={CY + 48} textAnchor="middle" fontSize="10" fill="#f0d48a" fontWeight="bold">{isHi ? 'सूर्य' : 'Sun'}</text>

      {/* ════ EARTH ════ */}
      <circle cx={earthX} cy={CY} r="18" fill="#1e3a5f" opacity="0.5" />
      <circle cx={earthX} cy={CY} r="16" fill="#3b82f6" />
      <circle cx={earthX - 3} cy={CY - 2} r="5" fill="#22c55e" opacity="0.4" />
      <text x={earthX} y={CY + 32} textAnchor="middle" fontSize="10" fill="#60a5fa" fontWeight="bold">{isHi ? 'पृथ्वी' : 'Earth'}</text>

      {/* ════ SHADOW CONE (Moon → Earth) ════ */}
      {shadowOpacity > 0.05 && (
        <>
          <polygon points={`${moon.x},${moon.y - 8} ${moon.x},${moon.y + 8} ${earthX - 14},${CY + 12} ${earthX - 14},${CY - 12}`}
            fill="#000030" opacity={shadowOpacity * 0.6} />
          <polygon points={`${moon.x},${moon.y - 14} ${moon.x},${moon.y + 14} ${earthX - 12},${CY + 22} ${earthX - 12},${CY - 22}`}
            fill="#000020" opacity={shadowOpacity * 0.25} />
        </>
      )}

      {/* ════ MOON ════ */}
      <circle cx={moon.x} cy={moon.y} r="11" fill="#94a3b8" />
      <circle cx={moon.x + 3} cy={moon.y - 2} r="9" fill="#0a0e27" opacity="0.6" />
      {/* Glow when at eclipse point */}
      {eclipse && <circle cx={moon.x} cy={moon.y} r="18" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.7" />}

      {/* ════ STATUS ════ */}
      <rect x={W / 2 - 170} y={H - 38} width="340" height="24" rx="6" fill={eclipse ? '#052e16' : '#1a1040'} opacity="0.8" stroke={eclipse ? '#22c55e' : '#d4a853'} strokeWidth="0.5" strokeOpacity="0.3" />
      <text x={W / 2} y={H - 22} textAnchor="middle" fontSize="11" fontWeight="bold" fill={eclipse ? '#4ade80' : '#8a8478'}>
        {eclipse ? (isHi ? '⚫ ग्रहण! चन्द्र पात पर संरेखित' : '⚫ Eclipse! Moon aligned at the node') : (isHi ? 'चन्द्र क्रान्तिवृत्त से दूर — ग्रहण नहीं' : 'Moon away from ecliptic — no eclipse')}
      </text>
    </svg>
  );
});

/* ─── Lunar Eclipse SVG ─── */
const LunarEclipseSVG = memo(function LunarEclipseSVG({ t, isHi }: { t: number; isHi: boolean }) {
  const sunX = 60;
  const earthX = 250;
  const orbitLeft = 300;
  const orbitRight = 580;

  const node1X = orbitLeft + (orbitRight - orbitLeft) * 0.25;
  const node2X = orbitLeft + (orbitRight - orbitLeft) * 0.75;

  const moon = moonPos(t, orbitLeft, orbitRight);
  const eclipse = isNearEcliptic(t);
  const shadowFrac = eclipse ? Math.max(0, 1 - Math.abs(Math.sin((t - 0.25) * Math.PI * 2) * ORBIT_AMP) / 12) : 0;

  // Blood Moon color
  const r = Math.round(200 + (1 - shadowFrac) * 30);
  const g = Math.round(50 + (1 - shadowFrac) * 180);
  const b = Math.round(30 + (1 - shadowFrac) * 210);
  const moonColor = `rgb(${r},${g},${b})`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 320 }}>
      <rect width={W} height={H} fill="#060a1f" rx="16" />

      {STARS.map(([sx, sy, op], i) => (
        <circle key={i} cx={sx} cy={sy} r="0.8" fill="white" opacity={op} />
      ))}

      {/* Ecliptic */}
      <line x1="20" y1={CY} x2={W - 20} y2={CY} stroke="#d4a853" strokeWidth="2" opacity="0.6" />
      <rect x="22" y={CY - 12} width={isHi ? 82 : 58} height="14" rx="3" fill="#060a1f" opacity="0.8" />
      <text x="26" y={CY - 2} fontSize="9" fill="#d4a853" fontWeight="bold" opacity="0.9">
        {isHi ? 'क्रान्तिवृत्त तल' : 'Ecliptic Plane'}
      </text>

      {/* Moon orbit */}
      <path d={orbitPath(orbitLeft, orbitRight, 'forward')} fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeDasharray="8 4" opacity="0.6" />
      <text x={orbitRight + 5} y={CY - ORBIT_AMP - 5} fontSize="8" fill="#a78bfa" opacity="0.7">5.15°</text>

      {/* Earth's shadow cones (umbra + penumbra) */}
      <polygon points={`${earthX + 18},${CY - 20} ${earthX + 18},${CY + 20} ${W - 20},${CY + 8} ${W - 20},${CY - 8}`}
        fill="#0a0010" opacity="0.7" />
      <polygon points={`${earthX + 14},${CY - 36} ${earthX + 14},${CY + 36} ${W - 20},${CY + 30} ${W - 20},${CY - 30}`}
        fill="#080014" opacity="0.3" />
      {/* Shadow labels */}
      <text x={earthX + 60} y={CY - 26} fontSize="7" fill="#a78bfa" opacity="0.4">{isHi ? 'उपच्छाया' : 'Penumbra'}</text>
      <text x={earthX + 60} y={CY - 8} fontSize="7" fill="#6d28d9" opacity="0.5">{isHi ? 'प्रच्छाया' : 'Umbra'}</text>

      {/* Node markers */}
      <circle cx={node1X} cy={CY} r="12" fill="none" stroke="#d4a853" strokeWidth="2" opacity="0.7" />
      <text x={node1X} y={CY + 5} textAnchor="middle" fontSize="14" fill="#f0d48a" fontWeight="bold">☊</text>
      <text x={node1X} y={CY - 18} textAnchor="middle" fontSize="9" fill="#f0d48a" fontWeight="bold">{isHi ? 'राहु' : 'Rahu'}</text>

      <circle cx={node2X} cy={CY} r="12" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.7" />
      <text x={node2X} y={CY + 5} textAnchor="middle" fontSize="14" fill="#c4b5fd" fontWeight="bold">☋</text>
      <text x={node2X} y={CY - 18} textAnchor="middle" fontSize="9" fill="#c4b5fd" fontWeight="bold">{isHi ? 'केतु' : 'Ketu'}</text>

      {/* Sun */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return (
          <line key={i} x1={sunX + Math.cos(angle) * 32} y1={CY + Math.sin(angle) * 32}
            x2={sunX + Math.cos(angle) * 42} y2={CY + Math.sin(angle) * 42}
            stroke="#f0d48a" strokeWidth="1.5" opacity="0.3" />
        );
      })}
      <circle cx={sunX} cy={CY} r="28" fill="#d4a853" opacity="0.15" />
      <circle cx={sunX} cy={CY} r="22" fill="#d4a853" />
      <text x={sunX} y={CY + 40} textAnchor="middle" fontSize="10" fill="#f0d48a" fontWeight="bold">{isHi ? 'सूर्य' : 'Sun'}</text>

      {/* Earth */}
      <circle cx={earthX} cy={CY} r="18" fill="#1e3a5f" opacity="0.5" />
      <circle cx={earthX} cy={CY} r="16" fill="#3b82f6" />
      <circle cx={earthX - 3} cy={CY - 2} r="5" fill="#22c55e" opacity="0.4" />
      <text x={earthX} y={CY + 32} textAnchor="middle" fontSize="10" fill="#60a5fa" fontWeight="bold">{isHi ? 'पृथ्वी' : 'Earth'}</text>

      {/* Moon */}
      <circle cx={moon.x} cy={moon.y} r="12" fill={moonColor} />
      {!eclipse && <circle cx={moon.x - 3} cy={moon.y - 2} r="4" fill="white" opacity="0.15" />}
      {eclipse && <circle cx={moon.x} cy={moon.y} r="18" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7" />}
      {eclipse && shadowFrac > 0.5 && (
        <text x={moon.x} y={moon.y - 22} textAnchor="middle" fontSize="8" fill="#fca5a5" fontWeight="bold">
          {isHi ? 'ब्लड मून' : 'Blood Moon'}
        </text>
      )}

      {/* Status */}
      <rect x={W / 2 - 180} y={H - 38} width="360" height="24" rx="6" fill={eclipse ? '#2a0a0a' : '#1a1040'} opacity="0.8" stroke={eclipse ? '#ef4444' : '#d4a853'} strokeWidth="0.5" strokeOpacity="0.3" />
      <text x={W / 2} y={H - 22} textAnchor="middle" fontSize="11" fontWeight="bold" fill={eclipse ? '#fca5a5' : '#8a8478'}>
        {eclipse ? (isHi ? '🔴 चन्द्र छाया में — चन्द्र ग्रहण!' : '🔴 Moon enters shadow — Lunar Eclipse!') : (isHi ? 'चन्द्र क्रान्तिवृत्त से दूर — ग्रहण नहीं' : 'Moon away from ecliptic — no eclipse')}
      </text>
    </svg>
  );
});

/* ─── Main Component ─── */
export default function EclipseAnimation({ locale }: Props) {
  const [mode, setMode] = useState<'solar' | 'lunar'>('solar');
  const [t, setT] = useState(0);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const isHi = locale !== 'en';

  useEffect(() => {
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const rawT = ((ts - startRef.current) % CYCLE_MS) / CYCLE_MS;
      setT(applyPause(rawT));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current !== null) cancelAnimationFrame(animRef.current); };
  }, []);

  useEffect(() => { startRef.current = null; }, [mode]);

  const l = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  const tabBase = 'px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer';
  const tabActive = 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5';
  const tabInactive = 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-8">
      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-5">
        <button onClick={() => setMode('solar')} className={`${tabBase} ${mode === 'solar' ? tabActive : tabInactive}`}>
          ☀ {l(L.solarTab)}
        </button>
        <button onClick={() => setMode('lunar')} className={`${tabBase} ${mode === 'lunar' ? tabActive : tabInactive}`}>
          ☽ {l(L.lunarTab)}
        </button>
      </div>

      {/* Animation */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 sm:p-6">
        {mode === 'solar' ? <SolarEclipseSVG t={t} isHi={isHi} /> : <LunarEclipseSVG t={t} isHi={isHi} />}

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center mt-4 text-[10px] text-text-secondary/60">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 bg-gold-primary inline-block" /> {isHi ? 'क्रान्तिवृत्त तल' : 'Ecliptic Plane'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 bg-purple-400 inline-block" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #a78bfa 0, #a78bfa 4px, transparent 4px, transparent 8px)' }} /> {isHi ? 'चन्द्र कक्षा (5.15°)' : "Moon's Orbit (5.15°)"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-gold-light text-xs">☊</span> {isHi ? 'राहु' : 'Rahu'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-purple-300 text-xs">☋</span> {isHi ? 'केतु' : 'Ketu'}
          </span>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-text-secondary text-sm mt-4 leading-relaxed text-center max-w-xl mx-auto" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {mode === 'solar' ? l(L.solarExpl) : l(L.lunarExpl)}
      </p>
    </motion.div>
  );
}
