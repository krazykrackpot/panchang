'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

/* ─── Types ─── */
type Locale = 'en' | 'hi' | 'sa';

interface Props {
  locale: Locale;
}

/* ─── Bilingual labels ─── */
const L = {
  solarTab:   { en: 'Solar Eclipse',  hi: 'सूर्य ग्रहण' },
  lunarTab:   { en: 'Lunar Eclipse',  hi: 'चन्द्र ग्रहण' },
  sun:        { en: 'Sun',            hi: 'सूर्य' },
  moon:       { en: 'Moon',           hi: 'चन्द्र' },
  earth:      { en: 'Earth',          hi: 'पृथ्वी' },
  rahu:       { en: 'Rahu (Ascending Node)',   hi: 'राहु (आरोही पात)' },
  ketu:       { en: 'Ketu (Descending Node)',  hi: 'केतु (अवरोही पात)' },
  eclipse:    { en: 'Eclipse!',       hi: 'ग्रहण!' },
  noEclipse:  { en: 'Moon above/below ecliptic — no eclipse',  hi: 'चन्द्र क्रान्तिवृत्त से ऊपर/नीचे — ग्रहण नहीं' },
  entering:   { en: 'Moon entering shadow — Lunar Eclipse!',   hi: 'चन्द्र छाया में प्रवेश — चन्द्र ग्रहण!' },
  ecliptic:   { en: '─── Ecliptic',   hi: '─── क्रान्तिवृत्त' },
  moonOrbit:  { en: "╌╌╌ Moon's orbit (5.15° tilt)",  hi: "╌╌╌ चन्द्र कक्षा (5.15° झुकाव)" },
  solarExpl: {
    en: "During a Solar Eclipse, the New Moon (Amavasya) crosses the ecliptic at Rahu or Ketu. The Moon passes directly between Sun and Earth, casting its shadow on Earth's surface. This only happens when the Moon is within ~18° of a lunar node.",
    hi: "सूर्य ग्रहण में, अमावस्या का चन्द्र राहु या केतु पर क्रान्तिवृत्त को काटता है। चन्द्र सूर्य और पृथ्वी के बीच से गुजरता है, अपनी छाया पृथ्वी की सतह पर डालता है। यह केवल तब होता है जब चन्द्र किसी पात के ~18° के भीतर हो।",
  },
  lunarExpl: {
    en: "During a Lunar Eclipse, the Full Moon (Purnima) crosses the ecliptic at Rahu or Ketu. Earth passes between Sun and Moon, and Earth's shadow falls on the Moon. The Moon turns blood-red as it enters the umbral shadow — the famous 'Blood Moon' seen at total lunar eclipses.",
    hi: "चन्द्र ग्रहण में, पूर्णिमा का चन्द्र राहु या केतु पर क्रान्तिवृत्त को काटता है। पृथ्वी सूर्य और चन्द्र के बीच आती है, और पृथ्वी की छाया चन्द्र पर पड़ती है। चन्द्र पूर्ण छाया में प्रवेश करने पर लाल हो जाता है — प्रसिद्ध 'ब्लड मून'।",
  },
};

/* ─── SVG layout constants ─── */
const W = 600;
const H = 280;
const CY = 140; // ecliptic y-center

// Solar eclipse layout: Sun(left) → Moon(moving) → Earth(right)
const SOLAR = {
  sunX: 80,
  earthX: 520,
  rahuX: 230,  // node crossing 1 (left)
  ketuX: 370,  // node crossing 2 (right)
  orbitAmplitude: 45, // exaggerated tilt amplitude
};

// Lunar eclipse layout: Sun(left) → Earth(center-left) → Moon(moving, right)
const LUNAR = {
  sunX: 80,
  earthX: 260,
  rahuX: 370,
  ketuX: 510,
  orbitAmplitude: 45,
};

/* ─── Helpers ─── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Given t in [0,1], return Moon x,y along tilted orbit between left and right bounds */
function moonPos(
  t: number,
  leftX: number,
  rightX: number,
  amplitude: number
): { x: number; y: number } {
  const x = lerp(leftX, rightX, t);
  // Full sine wave: at t=0 bottom, t=0.5 crosses ecliptic (ascending), t=1 back to bottom-ish
  // We want crossings at t≈0.25 and t≈0.75 (the node points)
  // y=CY when sin=0 → at t=0.25 and t=0.75
  const y = CY + Math.sin(t * Math.PI * 2 - Math.PI / 2 + Math.PI / 2) * amplitude;
  // Simplify: y = CY + sin(2πt) * amplitude, crosses at t=0 and t=0.5
  // Rahu at t=0 (left crossing), Ketu at t=0.5 (right crossing)
  return { x, y: CY + Math.sin(t * Math.PI * 2) * amplitude };
}

/** How close is Moon to the ecliptic plane (0 = on ecliptic) */
function distToEcliptic(t: number, amplitude: number): number {
  return Math.abs(Math.sin(t * Math.PI * 2) * amplitude);
}

/* ─── Solar Eclipse SVG ─── */
function SolarEclipseSVG({
  t,
  isHi,
}: {
  t: number;
  isHi: boolean;
}) {
  const { sunX, earthX, rahuX, ketuX, orbitAmplitude } = SOLAR;
  const orbitLeft = sunX + 30;
  const orbitRight = earthX - 30;

  const moon = moonPos(t, orbitLeft, orbitRight, orbitAmplitude);
  const dist = distToEcliptic(t, orbitAmplitude);
  const nearNode = dist < 12;
  const nearRahu = Math.abs(moon.x - rahuX) < 25 && nearNode;
  const nearKetu = Math.abs(moon.x - ketuX) < 25 && nearNode;
  const isEclipse = nearRahu || nearKetu;

  // Shadow cone from Moon toward Earth (only when near node)
  const shadowOpacity = Math.max(0, 1 - dist / 14);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Solar eclipse animation">
      <defs>
        {/* Sun glow */}
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#f0d48a" stopOpacity="1" />
          <stop offset="40%" stopColor="#d4a853" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
        {/* Earth gradient */}
        <radialGradient id="earthGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%"  stopColor="#6bb8ff" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </radialGradient>
        {/* Moon gradient */}
        <radialGradient id="moonGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%"  stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </radialGradient>
        {/* Shadow cone clip */}
        <clipPath id="shadowClip">
          <rect x="0" y="0" width={W} height={H} />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill="#0a0e27" rx="12" />

      {/* Star field (static dots) */}
      {[
        [30,20],[100,45],[150,15],[220,35],[300,20],[400,40],[480,15],[550,30],
        [60,100],[170,85],[350,90],[500,75],[580,110],[40,180],[200,200],[450,190],
        [530,230],[80,250],[330,260],[490,245],
      ].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r="1" fill="white" opacity={0.2 + (i % 3) * 0.15} />
      ))}

      {/* ── Ecliptic plane ── */}
      <line
        x1="30" y1={CY} x2={W - 30} y2={CY}
        stroke="#d4a853" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.45"
      />
      <text x={W - 28} y={CY - 5} fontSize="9" fill="#d4a853" opacity="0.6" textAnchor="end">
        {isHi ? 'क्रान्तिवृत्त' : 'Ecliptic'}
      </text>

      {/* ── Moon's tilted orbital path ── */}
      {/* Drawn as a straight tilted line for clarity */}
      <line
        x1={orbitLeft} y1={CY + orbitAmplitude}
        x2={orbitRight} y2={CY - orbitAmplitude}
        stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.5"
      />
      {/* Return path (other half of orbit, dashed lighter) */}
      <line
        x1={orbitLeft} y1={CY - orbitAmplitude}
        x2={orbitRight} y2={CY + orbitAmplitude}
        stroke="#8b5cf6" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.25"
      />

      {/* ── Rahu node ── */}
      <circle cx={rahuX} cy={CY} r="7" fill="#d4a853" opacity="0.12" stroke="#d4a853" strokeWidth="1.5" />
      <text x={rahuX} y={CY + 4} textAnchor="middle" fontSize="11" fill="#d4a853" fontWeight="bold">☊</text>
      <text x={rahuX} y={CY + 18} textAnchor="middle" fontSize="8" fill="#d4a853" opacity="0.8">
        {isHi ? 'राहु' : 'Rahu'}
      </text>

      {/* ── Ketu node ── */}
      <circle cx={ketuX} cy={CY} r="7" fill="#8b5cf6" opacity="0.12" stroke="#8b5cf6" strokeWidth="1.5" />
      <text x={ketuX} y={CY + 4} textAnchor="middle" fontSize="11" fill="#8b5cf6" fontWeight="bold">☋</text>
      <text x={ketuX} y={CY + 18} textAnchor="middle" fontSize="8" fill="#8b5cf6" opacity="0.8">
        {isHi ? 'केतु' : 'Ketu'}
      </text>

      {/* ── Sun ── */}
      {/* Corona rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r1 = 42;
        const r2 = 56;
        return (
          <line
            key={i}
            x1={sunX + Math.cos(angle) * r1}
            y1={CY + Math.sin(angle) * r1}
            x2={sunX + Math.cos(angle) * r2}
            y2={CY + Math.sin(angle) * r2}
            stroke="#f0d48a"
            strokeWidth="1.5"
            opacity="0.5"
          />
        );
      })}
      <circle cx={sunX} cy={CY} r="40" fill="url(#sunGlow)" opacity="0.35" />
      <circle cx={sunX} cy={CY} r="30" fill="#d4a853" opacity="0.9" />
      <text x={sunX} y={CY + 4} textAnchor="middle" fontSize="18" fill="#0a0e27" fontWeight="bold">☀</text>
      <text x={sunX} y={CY + 50} textAnchor="middle" fontSize="9" fill="#d4a853" opacity="0.8">
        {isHi ? 'सूर्य' : 'Sun'}
      </text>

      {/* ── Earth ── */}
      <circle cx={earthX} cy={CY} r="20" fill="#1a3a6b" opacity="0.6" />
      <circle cx={earthX} cy={CY} r="18" fill="url(#earthGrad)" />
      <text x={earthX} y={CY + 5} textAnchor="middle" fontSize="14" fill="#0a0e27">⊕</text>
      <text x={earthX} y={CY + 35} textAnchor="middle" fontSize="9" fill="#60a5fa" opacity="0.8">
        {isHi ? 'पृथ्वी' : 'Earth'}
      </text>

      {/* ── Shadow cone (Moon → Earth) ── */}
      {shadowOpacity > 0.05 && (
        <polygon
          points={`
            ${moon.x - 8},${moon.y - 10}
            ${moon.x - 8},${moon.y + 10}
            ${earthX - 18},${CY + 14}
            ${earthX - 18},${CY - 14}
          `}
          fill="#000020"
          opacity={shadowOpacity * 0.55}
          clipPath="url(#shadowClip)"
        />
      )}
      {/* Penumbra (wider, lighter) */}
      {shadowOpacity > 0.05 && (
        <polygon
          points={`
            ${moon.x - 12},${moon.y - 16}
            ${moon.x - 12},${moon.y + 16}
            ${earthX - 16},${CY + 26}
            ${earthX - 16},${CY - 26}
          `}
          fill="#000030"
          opacity={shadowOpacity * 0.25}
          clipPath="url(#shadowClip)"
        />
      )}

      {/* ── Moon (animated) ── */}
      <circle cx={moon.x} cy={moon.y} r="13" fill="url(#moonGrad)" opacity="0.95" />
      {/* Crescent shadow on Moon for solar eclipse */}
      <circle cx={moon.x + 4} cy={moon.y} r="13" fill="#0a0e27" opacity="0.7" />

      {/* ── Eclipse label ── */}
      <text
        x={W / 2}
        y={H - 20}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill={isEclipse ? '#22c55e' : '#8a8478'}
        opacity={0.9}
      >
        {isEclipse
          ? (isHi ? '⚫ ग्रहण!' : '⚫ Eclipse!')
          : (isHi ? 'चन्द्र क्रान्तिवृत्त से ऊपर/नीचे — ग्रहण नहीं' : 'Moon above/below ecliptic — no eclipse')}
      </text>

      {/* Eclipse flash ring when aligned */}
      {isEclipse && (
        <circle
          cx={moon.x}
          cy={moon.y}
          r="20"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          opacity="0.6"
        />
      )}
    </svg>
  );
}

/* ─── Lunar Eclipse SVG ─── */
function LunarEclipseSVG({
  t,
  isHi,
}: {
  t: number;
  isHi: boolean;
}) {
  const { sunX, earthX, rahuX, ketuX, orbitAmplitude } = LUNAR;
  const orbitLeft = earthX + 20;
  const orbitRight = W - 40;

  const moon = moonPos(t, orbitLeft, orbitRight, orbitAmplitude);
  const dist = distToEcliptic(t, orbitAmplitude);
  const nearNode = dist < 12;
  const isEclipse = nearNode;

  // Blood Moon color interpolation
  const shadowFraction = Math.max(0, 1 - dist / 14);
  const moonR = Math.round(lerp(226, 200, shadowFraction));
  const moonG = Math.round(lerp(232, 50, shadowFraction));
  const moonB = Math.round(lerp(240, 30, shadowFraction));
  const moonColor = `rgb(${moonR},${moonG},${moonB})`;

  // Earth shadow cone extends rightward
  const coneBaseY1 = CY - 22;
  const coneBaseY2 = CY + 22;
  const coneTipX = W - 30;
  const coneTipY = CY;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Lunar eclipse animation">
      <defs>
        <radialGradient id="sunGlowL" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#f0d48a" stopOpacity="1" />
          <stop offset="40%" stopColor="#d4a853" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="earthGradL" cx="40%" cy="35%" r="60%">
          <stop offset="0%"  stopColor="#6bb8ff" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </radialGradient>
        <clipPath id="shadowClipL">
          <rect x="0" y="0" width={W} height={H} />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill="#0a0e27" rx="12" />

      {/* Stars */}
      {[
        [30,20],[100,45],[150,15],[220,35],[300,20],[400,40],[480,15],[550,30],
        [60,100],[170,85],[350,90],[500,75],[580,110],[40,180],[200,200],[450,190],
        [530,230],[80,250],[330,260],[490,245],
      ].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r="1" fill="white" opacity={0.2 + (i % 3) * 0.15} />
      ))}

      {/* ── Ecliptic ── */}
      <line
        x1="30" y1={CY} x2={W - 30} y2={CY}
        stroke="#d4a853" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.45"
      />
      <text x={W - 28} y={CY - 5} fontSize="9" fill="#d4a853" opacity="0.6" textAnchor="end">
        {isHi ? 'क्रान्तिवृत्त' : 'Ecliptic'}
      </text>

      {/* ── Moon orbital paths ── */}
      <line
        x1={orbitLeft} y1={CY + orbitAmplitude}
        x2={orbitRight} y2={CY - orbitAmplitude}
        stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.5"
      />
      <line
        x1={orbitLeft} y1={CY - orbitAmplitude}
        x2={orbitRight} y2={CY + orbitAmplitude}
        stroke="#8b5cf6" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.25"
      />

      {/* ── Earth's umbral shadow cone ── */}
      <polygon
        points={`
          ${earthX + 20},${coneBaseY1}
          ${earthX + 20},${coneBaseY2}
          ${coneTipX},${coneTipY + 5}
          ${coneTipX},${coneTipY - 5}
        `}
        fill="#000820"
        opacity="0.75"
        clipPath="url(#shadowClipL)"
      />
      {/* Penumbra (wider, lighter outer shadow) */}
      <polygon
        points={`
          ${earthX + 16},${coneBaseY1 - 18}
          ${earthX + 16},${coneBaseY2 + 18}
          ${coneTipX},${coneTipY + 28}
          ${coneTipX},${coneTipY - 28}
        `}
        fill="#000520"
        opacity="0.35"
        clipPath="url(#shadowClipL)"
      />

      {/* ── Rahu node ── */}
      <circle cx={rahuX} cy={CY} r="7" fill="#d4a853" opacity="0.12" stroke="#d4a853" strokeWidth="1.5" />
      <text x={rahuX} y={CY + 4} textAnchor="middle" fontSize="11" fill="#d4a853" fontWeight="bold">☊</text>
      <text x={rahuX} y={CY + 18} textAnchor="middle" fontSize="8" fill="#d4a853" opacity="0.8">
        {isHi ? 'राहु' : 'Rahu'}
      </text>

      {/* ── Ketu node ── */}
      <circle cx={ketuX} cy={CY} r="7" fill="#8b5cf6" opacity="0.12" stroke="#8b5cf6" strokeWidth="1.5" />
      <text x={ketuX} y={CY + 4} textAnchor="middle" fontSize="11" fill="#8b5cf6" fontWeight="bold">☋</text>
      <text x={ketuX} y={CY + 18} textAnchor="middle" fontSize="8" fill="#8b5cf6" opacity="0.8">
        {isHi ? 'केतु' : 'Ketu'}
      </text>

      {/* ── Sun ── */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r1 = 42, r2 = 56;
        return (
          <line
            key={i}
            x1={sunX + Math.cos(angle) * r1}
            y1={CY + Math.sin(angle) * r1}
            x2={sunX + Math.cos(angle) * r2}
            y2={CY + Math.sin(angle) * r2}
            stroke="#f0d48a" strokeWidth="1.5" opacity="0.5"
          />
        );
      })}
      <circle cx={sunX} cy={CY} r="40" fill="url(#sunGlowL)" opacity="0.35" />
      <circle cx={sunX} cy={CY} r="30" fill="#d4a853" opacity="0.9" />
      <text x={sunX} y={CY + 4} textAnchor="middle" fontSize="18" fill="#0a0e27" fontWeight="bold">☀</text>
      <text x={sunX} y={CY + 50} textAnchor="middle" fontSize="9" fill="#d4a853" opacity="0.8">
        {isHi ? 'सूर्य' : 'Sun'}
      </text>

      {/* ── Earth ── */}
      <circle cx={earthX} cy={CY} r="20" fill="#1a3a6b" opacity="0.6" />
      <circle cx={earthX} cy={CY} r="18" fill="url(#earthGradL)" />
      <text x={earthX} y={CY + 5} textAnchor="middle" fontSize="14" fill="#0a0e27">⊕</text>
      <text x={earthX} y={CY + 35} textAnchor="middle" fontSize="9" fill="#60a5fa" opacity="0.8">
        {isHi ? 'पृथ्वी' : 'Earth'}
      </text>

      {/* ── Moon (animated, color shifts to blood red) ── */}
      <circle cx={moon.x} cy={moon.y} r="13" fill={moonColor} opacity="0.95" />
      {/* Subtle highlight */}
      <circle cx={moon.x - 4} cy={moon.y - 4} r="5" fill="white" opacity={0.12 * (1 - shadowFraction)} />

      {/* Shadow on moon surface when in eclipse */}
      {shadowFraction > 0.2 && (
        <circle cx={moon.x + 3} cy={moon.y} r="13" fill="#1a0000" opacity={shadowFraction * 0.5} />
      )}

      {/* ── Eclipse label ── */}
      <text
        x={W / 2}
        y={H - 20}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill={isEclipse ? '#f87171' : '#8a8478'}
        opacity={0.9}
      >
        {isEclipse
          ? (isHi ? '🔴 चन्द्र छाया में — चन्द्र ग्रहण!' : '🔴 Moon enters shadow — Lunar Eclipse!')
          : (isHi ? 'चन्द्र क्रान्तिवृत्त से ऊपर/नीचे — ग्रहण नहीं' : 'Moon above/below ecliptic — no eclipse')}
      </text>
    </svg>
  );
}

/* ─── Main Component ─── */
export default function EclipseAnimation({ locale }: Props) {
  const [mode, setMode] = useState<'solar' | 'lunar'>('solar');
  const [t, setT] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const DURATION_MS = 8000; // 8 seconds per cycle

  const isHi = locale !== 'en';

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = (timestamp - startTimeRef.current) % DURATION_MS;
      setT(elapsed / DURATION_MS);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Reset animation start when mode changes
  useEffect(() => {
    startTimeRef.current = null;
  }, [mode]);

  const l = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  const tabBase =
    'px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer';
  const tabActive =
    'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35';
  const tabInactive =
    'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-text-primary';

  return (
    <div className="space-y-4">
      {/* ── Tab buttons ── */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode('solar')}
          className={`${tabBase} ${mode === 'solar' ? tabActive : tabInactive}`}
        >
          {isHi ? '☀ सूर्य ग्रहण' : '☀ Solar Eclipse'}
        </button>
        <button
          onClick={() => setMode('lunar')}
          className={`${tabBase} ${mode === 'lunar' ? tabActive : tabInactive}`}
        >
          {isHi ? '🌕 चन्द्र ग्रहण' : '🌕 Lunar Eclipse'}
        </button>
      </div>

      {/* ── Animation panel ── */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-5 sm:p-6"
      >
        {/* SVG */}
        <div className="rounded-xl overflow-hidden border border-white/5">
          {mode === 'solar' ? (
            <SolarEclipseSVG t={t} isHi={isHi} />
          ) : (
            <LunarEclipseSVG t={t} isHi={isHi} />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 sm:gap-5 justify-center mt-4 text-xs text-text-secondary/80">
          <span className="flex items-center gap-1.5">
            <span className="text-gold-primary font-bold">☊</span>
            <span>{isHi ? 'राहु (आरोही पात)' : 'Rahu (Ascending Node)'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-violet-400 font-bold">☋</span>
            <span>{isHi ? 'केतु (अवरोही पात)' : 'Ketu (Descending Node)'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-6 border-t border-dashed border-gold-primary/60" />
            <span>{isHi ? 'क्रान्तिवृत्त' : 'Ecliptic'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-6 border-t border-dashed border-violet-500/60" />
            <span>{isHi ? 'चन्द्र कक्षा (5.15°)' : "Moon's orbit (5.15° tilt)"}</span>
          </span>
        </div>
      </motion.div>

      {/* ── Explanation ── */}
      <p className="text-text-secondary text-sm leading-relaxed">
        {mode === 'solar' ? l(L.solarExpl) : l(L.lunarExpl)}
      </p>
    </div>
  );
}
