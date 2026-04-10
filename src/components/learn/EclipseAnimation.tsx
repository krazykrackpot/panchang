'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

type Locale = 'en' | 'hi' | 'sa';
interface Props { locale: Locale }

const L = {
  solarTab: { en: 'Solar Eclipse', hi: 'सूर्य ग्रहण' },
  lunarTab: { en: 'Lunar Eclipse', hi: 'चन्द्र ग्रहण' },
  solarExpl: {
    en: 'Solar Eclipse: When the Moon crosses the ecliptic plane at Rahu or Ketu during New Moon (Amavasya), it passes directly between Sun and Earth, blocking sunlight. The Moon\'s shadow falls on Earth.',
    hi: 'सूर्य ग्रहण: जब अमावस्या के समय चन्द्र राहु या केतु पर क्रान्तिवृत्त तल को काटता है, तो वह सूर्य और पृथ्वी के ठीक बीच से गुजरता है। चन्द्रमा की छाया पृथ्वी पर पड़ती है।',
  },
  lunarExpl: {
    en: 'Lunar Eclipse: When the Moon crosses the ecliptic plane at a node during Full Moon (Purnima), Earth comes between Sun and Moon. Earth\'s shadow engulfs the Moon, turning it blood-red (Blood Moon).',
    hi: 'चन्द्र ग्रहण: जब पूर्णिमा के समय चन्द्र किसी पात पर क्रान्तिवृत्त तल को काटता है, तो पृथ्वी सूर्य और चन्द्र के बीच आती है। पृथ्वी की छाया चन्द्र को ढक लेती है, जिससे वह रक्त-लाल हो जाता है।',
  },
};

const W = 800;
const H = 500;
const CX = 400;
const CY = 250;

// Earth's orbit (ecliptic plane): large ellipse, foreshortened for perspective
const EARTH_RX = 310;
const EARTH_RY = 130;

// Moon's orbit around Earth
const MOON_RX = 70;
const MOON_RY_ECLIPTIC = 30;
const VISUAL_TILT = 18; // exaggerated for visibility (actual 5.15°)
const MOON_RY = MOON_RY_ECLIPTIC;
const MOON_TILT_OFFSET = Math.tan(VISUAL_TILT * Math.PI / 180) * MOON_RX;

// Animation timing
const CYCLE_MS = 12000;
const PAUSE_MS = 2000;

// Stars
const STARS: [number, number, number][] = [
  [20,15,0.12],[90,35,0.25],[160,10,0.15],[240,28,0.2],[350,12,0.15],
  [450,32,0.25],[530,8,0.12],[600,22,0.2],[70,85,0.15],[180,72,0.25],
  [380,78,0.12],[520,65,0.2],[610,95,0.15],[40,160,0.25],[220,180,0.12],
  [480,170,0.2],[570,195,0.15],[100,230,0.25],[350,250,0.12],[510,235,0.2],
  [30,310,0.15],[150,340,0.2],[300,360,0.12],[460,345,0.25],[590,320,0.15],
  [550,380,0.12],[80,370,0.2],[420,390,0.15],[260,300,0.25],
];

/** Earth position on its orbit at time t [0,1] */
function earthPos(t: number): { x: number; y: number } {
  const angle = t * Math.PI * 2;
  return {
    x: CX + EARTH_RX * Math.cos(angle),
    y: CY + EARTH_RY * Math.sin(angle),
  };
}

/**
 * Moon position on its tilted orbit around Earth.
 * moonPhase [0,1] = Moon's position in its own orbit.
 * nodeAngle = orientation of the nodal axis (radians).
 * The tilt is applied perpendicular to the node axis.
 */
function moonPos(earthX: number, earthY: number, moonPhase: number, nodeAngle: number): { x: number; y: number; aboveEcliptic: boolean } {
  const angle = moonPhase * Math.PI * 2;
  // Moon position on ecliptic-plane ellipse
  const mx = MOON_RX * Math.cos(angle);
  const my = MOON_RY * Math.sin(angle);
  // Tilt offset: maximum displacement perpendicular to the node axis
  // Tilt is zero at the nodes (angle aligned with nodeAngle) and maximum 90° away
  const tiltOffset = MOON_TILT_OFFSET * Math.sin(angle - nodeAngle);
  return {
    x: earthX + mx,
    y: earthY + my - tiltOffset,
    aboveEcliptic: tiltOffset > 0,
  };
}

/** Moon orbit SVG path (tilted ellipse around Earth, respecting nodeAngle) */
function moonOrbitPath(earthX: number, earthY: number, nodeAngle: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    const mx = MOON_RX * Math.cos(angle);
    const my = MOON_RY * Math.sin(angle);
    const tiltOffset = MOON_TILT_OFFSET * Math.sin(angle - nodeAngle);
    pts.push(`${i === 0 ? 'M' : 'L'}${(earthX + mx).toFixed(1)},${(earthY + my - tiltOffset).toFixed(1)}`);
  }
  return pts.join(' ') + 'Z';
}

/** Eclipse-plane-aligned orbit (what Moon's orbit would be WITHOUT tilt) */
function moonOrbitEclipticPath(earthX: number, earthY: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    const x = earthX + MOON_RX * Math.cos(angle);
    const y = earthY + MOON_RY * Math.sin(angle);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ') + 'Z';
}

/**
 * Node positions (where tilted orbit crosses ecliptic).
 * The nodal axis precesses slowly (~18.6 year cycle).
 * We rotate the node line based on a separate phase so it's NOT
 * always aligned with the Sun-Earth direction.
 * nodeAngle controls the orientation of the Rahu-Ketu axis.
 */
function nodePositions(earthX: number, earthY: number, nodeAngle: number): { rahu: { x: number; y: number }; ketu: { x: number; y: number } } {
  return {
    rahu: {
      x: earthX + MOON_RX * Math.cos(nodeAngle),
      y: earthY + MOON_RY * Math.sin(nodeAngle),
    },
    ketu: {
      x: earthX - MOON_RX * Math.cos(nodeAngle),
      y: earthY - MOON_RY * Math.sin(nodeAngle),
    },
  };
}

/**
 * Apply animation timing with pause at eclipse points.
 * The nodeAngle is fixed at a specific orientation. Earth orbits the Sun.
 * Moon orbits Earth. Eclipse happens when Moon is at a node AND the
 * Sun-Earth-Moon geometry is right. We arrange the timing so one eclipse
 * happens per cycle to illustrate the concept.
 */
function applyPause(rawT: number): { earthT: number; moonPhase: number; nodeAngle: number; paused: boolean } {
  const earthT = rawT;
  const nodeAngle = 0;
  // Moon makes 3 orbits per Earth orbit — continuous, no pausing
  const moonPhase = (rawT * 3) % 1;
  // Detect when Moon is near a node for visual highlights (no pause, just glow)
  const atNode = Math.abs(Math.sin(moonPhase * Math.PI * 2)) < 0.15;
  return { earthT, moonPhase, nodeAngle, paused: atNode };
}

/* ─── Solar Eclipse View ─── */
const SolarView = memo(function SolarView({ earthT, moonPhase, nodeAngle, paused, isHi }: { earthT: number; moonPhase: number; nodeAngle: number; paused: boolean; isHi: boolean }) {
  const earth = earthPos(earthT);
  const moon = moonPos(earth.x, earth.y, moonPhase, nodeAngle);
  const nodes = nodePositions(earth.x, earth.y, nodeAngle);
  const atNode = Math.abs(Math.sin((moonPhase * Math.PI * 2) - nodeAngle) * MOON_TILT_OFFSET) < 4;

  // Check if Moon is between Sun and Earth (New Moon position ≈ moonPhase near 0.75 facing Sun)
  // Simplified: eclipse = at node
  const isEclipse = paused && atNode;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 500 }}>
      <rect width={W} height={H} fill="#04071a" rx="16" />

      {/* Stars */}
      {STARS.map(([sx, sy, op], i) => <circle key={i} cx={sx} cy={sy} r="0.7" fill="white" opacity={op} />)}

      {/* ════ EARTH'S ORBIT (ECLIPTIC PLANE) ════ */}
      <ellipse cx={CX} cy={CY} rx={EARTH_RX} ry={EARTH_RY} fill="none" stroke="#d4a853" strokeWidth="1.5" opacity="0.4" />
      {/* Ecliptic plane fill — subtle */}
      <ellipse cx={CX} cy={CY} rx={EARTH_RX} ry={EARTH_RY} fill="#d4a853" opacity="0.02" />
      {/* Label */}
      <text x={CX + EARTH_RX - 30} y={CY - EARTH_RY - 8} fontSize="10" fill="#d4a853" fontWeight="bold" opacity="0.7">
        {isHi ? 'क्रान्तिवृत्त तल' : 'Ecliptic Plane'}
      </text>
      <text x={CX + EARTH_RX - 30} y={CY - EARTH_RY + 4} fontSize="8" fill="#d4a853" opacity="0.4">
        {isHi ? '(पृथ्वी की कक्षा)' : "(Earth's Orbit)"}
      </text>

      {/* ════ SUN ════ */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <line key={i} x1={CX + Math.cos(a) * 22} y1={CY + Math.sin(a) * 22}
          x2={CX + Math.cos(a) * 30} y2={CY + Math.sin(a) * 30}
          stroke="#f0d48a" strokeWidth="1.5" opacity="0.3" />;
      })}
      <circle cx={CX} cy={CY} r="20" fill="#d4a853" />
      <circle cx={CX} cy={CY} r="28" fill="#d4a853" opacity="0.1" />
      <text x={CX} y={CY + 38} textAnchor="middle" fontSize="10" fill="#f0d48a" fontWeight="bold">{isHi ? 'सूर्य' : 'Sun'}</text>

      {/* ════ MOON'S TILTED ORBIT (around Earth) ════ */}
      {/* Ghost orbit: ecliptic-aligned (what it would be without tilt) */}
      <path d={moonOrbitEclipticPath(earth.x, earth.y)} fill="none" stroke="#d4a853" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.15" />
      {/* Actual tilted orbit */}
      <path d={moonOrbitPath(earth.x, earth.y, nodeAngle)} fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeDasharray="6 3" opacity="0.6" />
      {/* Tilt angle arc indicator */}
      <text x={earth.x + MOON_RX + 8} y={earth.y - MOON_TILT_OFFSET / 2} fontSize="10" fill="#a78bfa" fontWeight="bold" opacity="0.8">
        5.15°
      </text>
      <text x={earth.x + MOON_RX + 8} y={earth.y - MOON_TILT_OFFSET / 2 + 11} fontSize="7" fill="#a78bfa" opacity="0.5">
        {isHi ? 'कक्षीय झुकाव' : 'orbital tilt'}
      </text>

      {/* ════ NODES (intersection of orbits) ════ */}
      {/* Rahu — ascending node */}
      <circle cx={nodes.rahu.x} cy={nodes.rahu.y} r="8" fill="#d4a853" opacity="0.1" />
      <circle cx={nodes.rahu.x} cy={nodes.rahu.y} r="8" fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.8" />
      <text x={nodes.rahu.x} y={nodes.rahu.y + 4} textAnchor="middle" fontSize="12" fill="#f0d48a" fontWeight="bold">☊</text>
      <text x={nodes.rahu.x + 14} y={nodes.rahu.y - 6} fontSize="9" fill="#f0d48a" fontWeight="bold">{isHi ? 'राहु' : 'Rahu'}</text>
      <text x={nodes.rahu.x + 14} y={nodes.rahu.y + 5} fontSize="7" fill="#d4a853" opacity="0.5">{isHi ? 'आरोही पात' : 'Ascending'}</text>

      {/* Ketu — descending node */}
      <circle cx={nodes.ketu.x} cy={nodes.ketu.y} r="8" fill="#a78bfa" opacity="0.1" />
      <circle cx={nodes.ketu.x} cy={nodes.ketu.y} r="8" fill="none" stroke="#c4b5fd" strokeWidth="2" opacity="0.8" />
      <text x={nodes.ketu.x} y={nodes.ketu.y + 4} textAnchor="middle" fontSize="12" fill="#c4b5fd" fontWeight="bold">☋</text>
      <text x={nodes.ketu.x - 14} y={nodes.ketu.y - 6} fontSize="9" fill="#c4b5fd" fontWeight="bold" textAnchor="end">{isHi ? 'केतु' : 'Ketu'}</text>
      <text x={nodes.ketu.x - 14} y={nodes.ketu.y + 5} fontSize="7" fill="#a78bfa" opacity="0.5" textAnchor="end">{isHi ? 'अवरोही पात' : 'Descending'}</text>

      {/* Sun → Moon shadow line when eclipse */}
      {isEclipse && (
        <line x1={CX} y1={CY} x2={moon.x} y2={moon.y} stroke="#22c55e" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 2" />
      )}

      {/* ════ EARTH ════ */}
      <circle cx={earth.x} cy={earth.y} r="10" fill="#1e3a5f" opacity="0.5" />
      <circle cx={earth.x} cy={earth.y} r="8" fill="#3b82f6" />
      <text x={earth.x} y={earth.y + 18} textAnchor="middle" fontSize="8" fill="#60a5fa" fontWeight="bold">{isHi ? 'पृथ्वी' : 'Earth'}</text>

      {/* ════ MOON ════ */}
      <circle cx={moon.x} cy={moon.y} r="5" fill="#94a3b8" />
      <circle cx={moon.x + 1.5} cy={moon.y - 1} r="4" fill="#04071a" opacity="0.5" />
      {isEclipse && <circle cx={moon.x} cy={moon.y} r="10" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8" />}
      <text x={moon.x} y={moon.y - 10} textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold">{isHi ? 'चन्द्र' : 'Moon'}</text>

      {/* ════ STATUS BAR ════ */}
      <rect x={W / 2 - 185} y={H - 42} width="370" height="28" rx="8" fill={isEclipse ? '#052e16' : '#0f0a2a'} opacity="0.85" stroke={isEclipse ? '#22c55e' : '#d4a853'} strokeWidth="0.5" strokeOpacity="0.4" />
      <text x={W / 2} y={H - 24} textAnchor="middle" fontSize="11" fontWeight="bold" fill={isEclipse ? '#4ade80' : '#8a8478'}>
        {isEclipse
          ? (isHi ? '⚫ सूर्य ग्रहण! चन्द्र पात पर — सूर्य और पृथ्वी के बीच' : '⚫ Solar Eclipse! Moon at node — between Sun and Earth')
          : (isHi ? 'चन्द्र क्रान्तिवृत्त तल से ऊपर/नीचे — ग्रहण नहीं' : 'Moon above/below ecliptic plane — no eclipse')}
      </text>
    </svg>
  );
});

/* ─── Lunar Eclipse View ─── */
const LunarView = memo(function LunarView({ earthT, moonPhase, nodeAngle, paused, isHi }: { earthT: number; moonPhase: number; nodeAngle: number; paused: boolean; isHi: boolean }) {
  const earth = earthPos(earthT);
  const moon = moonPos(earth.x, earth.y, moonPhase, nodeAngle);
  const nodes = nodePositions(earth.x, earth.y, nodeAngle);
  const atNode = Math.abs(Math.sin((moonPhase * Math.PI * 2) - nodeAngle) * MOON_TILT_OFFSET) < 4;
  const isEclipse = paused && atNode;

  // Blood Moon color when eclipsed
  const moonFill = isEclipse ? '#c0392b' : '#94a3b8';

  // Earth shadow cone toward Moon when eclipse
  const shadowAngle = Math.atan2(moon.y - earth.y, moon.x - earth.x);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 500 }}>
      <rect width={W} height={H} fill="#04071a" rx="16" />
      {STARS.map(([sx, sy, op], i) => <circle key={i} cx={sx} cy={sy} r="0.7" fill="white" opacity={op} />)}

      {/* Earth's orbit */}
      <ellipse cx={CX} cy={CY} rx={EARTH_RX} ry={EARTH_RY} fill="none" stroke="#d4a853" strokeWidth="1.5" opacity="0.4" />
      <ellipse cx={CX} cy={CY} rx={EARTH_RX} ry={EARTH_RY} fill="#d4a853" opacity="0.02" />
      <text x={CX + EARTH_RX - 30} y={CY - EARTH_RY - 8} fontSize="10" fill="#d4a853" fontWeight="bold" opacity="0.7">
        {isHi ? 'क्रान्तिवृत्त तल' : 'Ecliptic Plane'}
      </text>

      {/* Sun */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <line key={i} x1={CX + Math.cos(a) * 22} y1={CY + Math.sin(a) * 22}
          x2={CX + Math.cos(a) * 30} y2={CY + Math.sin(a) * 30}
          stroke="#f0d48a" strokeWidth="1.5" opacity="0.3" />;
      })}
      <circle cx={CX} cy={CY} r="20" fill="#d4a853" />
      <text x={CX} y={CY + 38} textAnchor="middle" fontSize="10" fill="#f0d48a" fontWeight="bold">{isHi ? 'सूर्य' : 'Sun'}</text>

      {/* Moon's tilted orbit */}
      <path d={moonOrbitEclipticPath(earth.x, earth.y)} fill="none" stroke="#d4a853" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.15" />
      <path d={moonOrbitPath(earth.x, earth.y, nodeAngle)} fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeDasharray="6 3" opacity="0.6" />
      <text x={earth.x + MOON_RX + 8} y={earth.y - MOON_TILT_OFFSET / 2} fontSize="10" fill="#a78bfa" fontWeight="bold" opacity="0.8">5.15°</text>

      {/* Nodes */}
      <circle cx={nodes.rahu.x} cy={nodes.rahu.y} r="8" fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.8" />
      <text x={nodes.rahu.x} y={nodes.rahu.y + 4} textAnchor="middle" fontSize="12" fill="#f0d48a" fontWeight="bold">☊</text>
      <text x={nodes.rahu.x + 14} y={nodes.rahu.y - 6} fontSize="9" fill="#f0d48a" fontWeight="bold">{isHi ? 'राहु' : 'Rahu'}</text>

      <circle cx={nodes.ketu.x} cy={nodes.ketu.y} r="8" fill="none" stroke="#c4b5fd" strokeWidth="2" opacity="0.8" />
      <text x={nodes.ketu.x} y={nodes.ketu.y + 4} textAnchor="middle" fontSize="12" fill="#c4b5fd" fontWeight="bold">☋</text>
      <text x={nodes.ketu.x - 14} y={nodes.ketu.y - 6} fontSize="9" fill="#c4b5fd" fontWeight="bold" textAnchor="end">{isHi ? 'केतु' : 'Ketu'}</text>

      {/* Earth shadow toward Moon when eclipse */}
      {isEclipse && (
        <>
          <polygon
            points={`${earth.x + Math.cos(shadowAngle - 0.3) * 10},${earth.y + Math.sin(shadowAngle - 0.3) * 10} ${earth.x + Math.cos(shadowAngle + 0.3) * 10},${earth.y + Math.sin(shadowAngle + 0.3) * 10} ${moon.x + Math.cos(shadowAngle + 0.15) * 6},${moon.y + Math.sin(shadowAngle + 0.15) * 6} ${moon.x + Math.cos(shadowAngle - 0.15) * 6},${moon.y + Math.sin(shadowAngle - 0.15) * 6}`}
            fill="#1a0020" opacity="0.6"
          />
          <line x1={CX} y1={CY} x2={earth.x} y2={earth.y} stroke="#ef4444" strokeWidth="1" opacity="0.3" strokeDasharray="4 2" />
        </>
      )}

      {/* Earth */}
      <circle cx={earth.x} cy={earth.y} r="10" fill="#1e3a5f" opacity="0.5" />
      <circle cx={earth.x} cy={earth.y} r="8" fill="#3b82f6" />
      <text x={earth.x} y={earth.y + 18} textAnchor="middle" fontSize="8" fill="#60a5fa" fontWeight="bold">{isHi ? 'पृथ्वी' : 'Earth'}</text>

      {/* Moon */}
      <circle cx={moon.x} cy={moon.y} r="5" fill={moonFill} />
      {isEclipse && <circle cx={moon.x} cy={moon.y} r="10" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8" />}
      {isEclipse && (
        <text x={moon.x} y={moon.y - 12} textAnchor="middle" fontSize="7" fill="#fca5a5" fontWeight="bold">
          {isHi ? 'ब्लड मून' : 'Blood Moon'}
        </text>
      )}
      {!isEclipse && <text x={moon.x} y={moon.y - 10} textAnchor="middle" fontSize="7" fill="#94a3b8">{isHi ? 'चन्द्र' : 'Moon'}</text>}

      {/* Status */}
      <rect x={W / 2 - 190} y={H - 42} width="380" height="28" rx="8" fill={isEclipse ? '#2a0a0a' : '#0f0a2a'} opacity="0.85" stroke={isEclipse ? '#ef4444' : '#d4a853'} strokeWidth="0.5" strokeOpacity="0.4" />
      <text x={W / 2} y={H - 24} textAnchor="middle" fontSize="11" fontWeight="bold" fill={isEclipse ? '#fca5a5' : '#8a8478'}>
        {isEclipse
          ? (isHi ? '🔴 चन्द्र ग्रहण! चन्द्र पात पर — पृथ्वी की छाया में' : '🔴 Lunar Eclipse! Moon at node — in Earth\'s shadow')
          : (isHi ? 'चन्द्र क्रान्तिवृत्त तल से ऊपर/नीचे — ग्रहण नहीं' : 'Moon above/below ecliptic plane — no eclipse')}
      </text>
    </svg>
  );
});

/* ─── Main ─── */
export default function EclipseAnimation({ locale }: Props) {
  const [mode, setMode] = useState<'solar' | 'lunar'>('solar');
  const [state, setState] = useState({ earthT: 0, moonPhase: 0, nodeAngle: 0.5, paused: false });
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const isHi = locale !== 'en';

  useEffect(() => {
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const rawT = ((ts - startRef.current) % CYCLE_MS) / CYCLE_MS;
      setState(applyPause(rawT));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current !== null) cancelAnimationFrame(animRef.current); };
  }, []);

  useEffect(() => { startRef.current = null; }, [mode]);

  const l = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  const tabBase = 'px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer';
  const tabActive = 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5';
  const tabInactive = 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-8">
      <div className="flex justify-center gap-3 mb-5">
        <button onClick={() => setMode('solar')} className={`${tabBase} ${mode === 'solar' ? tabActive : tabInactive}`}>☀ {l(L.solarTab)}</button>
        <button onClick={() => setMode('lunar')} className={`${tabBase} ${mode === 'lunar' ? tabActive : tabInactive}`}>☽ {l(L.lunarTab)}</button>
      </div>

      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-5">
        {mode === 'solar'
          ? <SolarView earthT={state.earthT} moonPhase={state.moonPhase} nodeAngle={state.nodeAngle} paused={state.paused} isHi={isHi} />
          : <LunarView earthT={state.earthT} moonPhase={state.moonPhase} nodeAngle={state.nodeAngle} paused={state.paused} isHi={isHi} />
        }

        <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center mt-4 text-[10px] text-text-secondary/60">
          <span className="flex items-center gap-1.5"><span className="w-4 h-[2px] bg-gold-primary inline-block rounded" /> {isHi ? 'क्रान्तिवृत्त (पृथ्वी कक्षा)' : "Ecliptic (Earth's orbit)"}</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-[2px] bg-purple-400 inline-block rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#a78bfa 0,#a78bfa 3px,transparent 3px,transparent 6px)' }} /> {isHi ? 'चन्द्र कक्षा (5.15° झुकी)' : "Moon's orbit (5.15° tilted)"}</span>
          <span className="flex items-center gap-1.5"><span className="text-gold-light text-xs">☊</span> {isHi ? 'राहु (आरोही पात)' : 'Rahu (Ascending)'}</span>
          <span className="flex items-center gap-1.5"><span className="text-purple-300 text-xs">☋</span> {isHi ? 'केतु (अवरोही पात)' : 'Ketu (Descending)'}</span>
        </div>
      </div>

      <p className="text-text-secondary text-sm mt-4 leading-relaxed text-center max-w-2xl mx-auto" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {mode === 'solar' ? l(L.solarExpl) : l(L.lunarExpl)}
      </p>
    </motion.div>
  );
}
