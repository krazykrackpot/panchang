'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type Locale = 'en' | 'hi' | 'sa';
interface Props { locale: Locale }

/**
 * Static diagrams showing:
 * 1. The two orbital planes and their 5.15° tilt
 * 2. Rahu and Ketu as intersection nodes
 * 3. Solar eclipse geometry (Sun—Moon—Earth aligned at a node)
 * 4. Lunar eclipse geometry (Sun—Earth—Moon aligned at a node)
 */
export default function EclipseAnimation({ locale }: Props) {
  const [tab, setTab] = useState<'planes' | 'solar' | 'lunar'>('planes');
  const isHi = locale !== 'en';

  const tabBase = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer';
  const tabActive = 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5';
  const tabInactive = 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-8">
      {/* Tabs */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-5 flex-wrap">
        <button onClick={() => setTab('planes')} className={`${tabBase} ${tab === 'planes' ? tabActive : tabInactive}`}>
          {isHi ? 'कक्षीय तल और पात' : 'Orbital Planes & Nodes'}
        </button>
        <button onClick={() => setTab('solar')} className={`${tabBase} ${tab === 'solar' ? tabActive : tabInactive}`}>
          ☀ {isHi ? 'सूर्य ग्रहण' : 'Solar Eclipse'}
        </button>
        <button onClick={() => setTab('lunar')} className={`${tabBase} ${tab === 'lunar' ? tabActive : tabInactive}`}>
          ☽ {isHi ? 'चन्द्र ग्रहण' : 'Lunar Eclipse'}
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-5">
        {tab === 'planes' && <OrbitalPlanesDiagram isHi={isHi} />}
        {tab === 'solar' && <SolarEclipseDiagram isHi={isHi} />}
        {tab === 'lunar' && <LunarEclipseDiagram isHi={isHi} />}

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center mt-4 text-[10px] text-text-secondary/60">
          <span className="flex items-center gap-1.5"><span className="w-4 h-[2px] bg-gold-primary inline-block rounded" /> {isHi ? 'क्रान्तिवृत्त (पृथ्वी कक्षा)' : "Ecliptic (Earth's orbit)"}</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-[2px] bg-purple-400 inline-block rounded opacity-70" /> {isHi ? 'चन्द्र कक्षा (5.15° झुकी)' : "Moon's orbit (5.15° tilted)"}</span>
          <span className="flex items-center gap-1.5"><span className="text-gold-light text-xs">☊</span> {isHi ? 'राहु (आरोही पात)' : 'Rahu (Ascending Node)'}</span>
          <span className="flex items-center gap-1.5"><span className="text-purple-300 text-xs">☋</span> {isHi ? 'केतु (अवरोही पात)' : 'Ketu (Descending Node)'}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DIAGRAM 1: Two Orbital Planes + 5.15° Tilt + Rahu/Ketu Nodes
   ═══════════════════════════════════════════════════════════════════════════════ */
function OrbitalPlanesDiagram({ isHi }: { isHi: boolean }) {
  // Oblique view: Sun at center, Earth's orbit as large ellipse
  const W = 800, H = 480, CX = 400, CY = 230;
  const ERX = 300, ERY = 120; // Earth orbit radii
  const MRX = 75, MRY = 32; // Moon orbit radii (ecliptic-aligned)
  const TILT = 22; // visual tilt in px (exaggerated from 5.15° for visibility)

  // Earth at right side of orbit
  const earthAngle = 0;
  const earthX = CX + ERX * Math.cos(earthAngle);
  const earthY = CY + ERY * Math.sin(earthAngle);

  // Moon orbit path — ecliptic-aligned (ghost)
  const eclipticOrbit = ellipsePath(earthX, earthY, MRX, MRY);
  // Moon orbit path — tilted
  const tiltedOrbit = tiltedEllipsePath(earthX, earthY, MRX, MRY, TILT);

  // Nodes: where tilted orbit intersects ecliptic orbit (left and right of Earth)
  const rahuX = earthX + MRX;
  const rahuY = earthY;
  const ketuX = earthX - MRX;
  const ketuY = earthY;

  // Moon positions: one above ecliptic, one below, one at node
  const moonAbove = { x: earthX, y: earthY - MRY - TILT }; // top of tilted orbit
  const moonBelow = { x: earthX, y: earthY + MRY + TILT }; // bottom of tilted orbit

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 480 }}>
      <rect width={W} height={H} fill="#04071a" rx="16" />
      <Stars />

      {/* ── Earth's orbit = Ecliptic Plane ── */}
      <ellipse cx={CX} cy={CY} rx={ERX} ry={ERY} fill="#d4a853" opacity="0.03" />
      <ellipse cx={CX} cy={CY} rx={ERX} ry={ERY} fill="none" stroke="#d4a853" strokeWidth="1.8" opacity="0.5" />
      <Label x={CX} y={CY - ERY - 14} text={isHi ? 'क्रान्तिवृत्त तल — पृथ्वी की सूर्य के चारों ओर कक्षा' : "Ecliptic Plane — Earth's orbit around the Sun"} color="#d4a853" size={11} bold />

      {/* ── Sun ── */}
      <SunIcon cx={CX} cy={CY} r={24} />
      <Label x={CX} y={CY + 38} text={isHi ? 'सूर्य' : 'Sun'} color="#f0d48a" size={11} bold />

      {/* ── Earth ── */}
      <EarthIcon cx={earthX} cy={earthY} r={12} />
      <Label x={earthX} y={earthY + 22} text={isHi ? 'पृथ्वी' : 'Earth'} color="#60a5fa" size={10} bold />

      {/* ── Moon's orbit — ecliptic-aligned ghost ── */}
      <path d={eclipticOrbit} fill="none" stroke="#d4a853" strokeWidth="0.7" strokeDasharray="3 4" opacity="0.2" />

      {/* ── Moon's orbit — TILTED ── */}
      <path d={tiltedOrbit} fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeDasharray="8 4" opacity="0.65" />
      <Label x={earthX + MRX + 12} y={earthY - TILT - 8} text={isHi ? 'चन्द्र कक्षा' : "Moon's Orbit"} color="#a78bfa" size={10} bold />

      {/* ── 5.15° angle arc ── */}
      <path
        d={`M ${earthX + MRX * 0.6} ${earthY} A 15 15 0 0 0 ${earthX + MRX * 0.58} ${earthY - TILT * 0.6}`}
        fill="none" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.8"
      />
      <text x={earthX + MRX * 0.65 + 4} y={earthY - TILT * 0.25} fontSize="13" fill="#c4b5fd" fontWeight="bold" opacity="0.9">5.15°</text>

      {/* ── RAHU NODE ── */}
      <circle cx={rahuX} cy={rahuY} r="14" fill="#f0d48a" opacity="0.08" />
      <circle cx={rahuX} cy={rahuY} r="14" fill="none" stroke="#f0d48a" strokeWidth="2.5" opacity="0.8" />
      <text x={rahuX} y={rahuY + 5} textAnchor="middle" fontSize="16" fill="#f0d48a" fontWeight="bold">☊</text>
      <Label x={rahuX} y={rahuY - 22} text={isHi ? 'राहु' : 'Rahu'} color="#f0d48a" size={12} bold />
      <Label x={rahuX} y={rahuY + 28} text={isHi ? 'आरोही पात' : 'Ascending Node'} color="#d4a853" size={8} />
      <Label x={rahuX} y={rahuY + 38} text={isHi ? '(चन्द्र ऊपर जाता है)' : '(Moon crosses upward)'} color="#d4a853" size={7} />

      {/* ── KETU NODE ── */}
      <circle cx={ketuX} cy={ketuY} r="14" fill="#c4b5fd" opacity="0.08" />
      <circle cx={ketuX} cy={ketuY} r="14" fill="none" stroke="#c4b5fd" strokeWidth="2.5" opacity="0.8" />
      <text x={ketuX} y={ketuY + 5} textAnchor="middle" fontSize="16" fill="#c4b5fd" fontWeight="bold">☋</text>
      <Label x={ketuX} y={ketuY - 22} text={isHi ? 'केतु' : 'Ketu'} color="#c4b5fd" size={12} bold />
      <Label x={ketuX} y={ketuY + 28} text={isHi ? 'अवरोही पात' : 'Descending Node'} color="#a78bfa" size={8} />
      <Label x={ketuX} y={ketuY + 38} text={isHi ? '(चन्द्र नीचे जाता है)' : '(Moon crosses downward)'} color="#a78bfa" size={7} />

      {/* ── Moon positions showing above/below ecliptic ── */}
      <MoonIcon cx={moonAbove.x} cy={moonAbove.y} r={8} />
      <Label x={moonAbove.x + 14} y={moonAbove.y + 3} text={isHi ? '← चन्द्र क्रान्तिवृत्त से ऊपर' : '← Moon above ecliptic'} color="#94a3b8" size={8} align="start" />

      <MoonIcon cx={moonBelow.x} cy={moonBelow.y} r={8} />
      <Label x={moonBelow.x + 14} y={moonBelow.y + 3} text={isHi ? '← चन्द्र क्रान्तिवृत्त से नीचे' : '← Moon below ecliptic'} color="#94a3b8" size={8} align="start" />

      {/* ── Annotation: when eclipse happens ── */}
      <rect x={CX - 180} y={H - 55} width="360" height="40" rx="8" fill="#0f0a2a" opacity="0.85" stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.3" />
      <text x={CX} y={H - 38} textAnchor="middle" fontSize="10" fill="#d4a853" fontWeight="bold">
        {isHi ? 'ग्रहण तभी होता है जब अमावस्या/पूर्णिमा किसी पात (राहु/केतु) के निकट हो' : 'Eclipse occurs ONLY when New/Full Moon happens NEAR a node (Rahu/Ketu)'}
      </text>
      <text x={CX} y={H - 24} textAnchor="middle" fontSize="9" fill="#8a8478">
        {isHi ? 'अधिकांश अमावस्या/पूर्णिमा बिना ग्रहण के गुजरती हैं — चन्द्र पातों से दूर रहता है' : 'Most New/Full Moons pass without eclipse — Moon is far from the nodes'}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DIAGRAM 2: Solar Eclipse — Sun, Moon, Earth aligned at a node
   ═══════════════════════════════════════════════════════════════════════════════ */
function SolarEclipseDiagram({ isHi }: { isHi: boolean }) {
  const W = 800, H = 360;
  const Y = 170; // alignment line

  // Left to right: Sun — Moon — Earth, all on the ecliptic line
  const sunX = 120;
  const moonX = 380;
  const earthX = 620;
  const nodeX = moonX; // Moon is AT the node

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 360 }}>
      <rect width={W} height={H} fill="#04071a" rx="16" />
      <Stars />

      {/* ── Ecliptic plane line ── */}
      <line x1="30" y1={Y} x2={W - 30} y2={Y} stroke="#d4a853" strokeWidth="2" opacity="0.5" />
      <Label x={W - 35} y={Y - 8} text={isHi ? 'क्रान्तिवृत्त' : 'Ecliptic'} color="#d4a853" size={9} align="end" />

      {/* ── Moon's tilted orbit (shown as angled line through node) ── */}
      <line x1={nodeX - 120} y1={Y + 40} x2={nodeX + 120} y2={Y - 40} stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
      <text x={nodeX + 125} y={Y - 38} fontSize="10" fill="#a78bfa" fontWeight="bold" opacity="0.8">5.15°</text>

      {/* ── Alignment line Sun → Moon → Earth ── */}
      <line x1={sunX} y1={Y} x2={earthX} y2={Y} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35" />

      {/* ── Shadow cone: Moon → Earth ── */}
      <polygon
        points={`${moonX + 18},${Y - 12} ${moonX + 18},${Y + 12} ${earthX - 16},${Y + 20} ${earthX - 16},${Y - 20}`}
        fill="#001008" opacity="0.5"
      />
      <polygon
        points={`${moonX + 14},${Y - 20} ${moonX + 14},${Y + 20} ${earthX - 14},${Y + 34} ${earthX - 14},${Y - 34}`}
        fill="#000a05" opacity="0.2"
      />
      <Label x={(moonX + earthX) / 2} y={Y - 30} text={isHi ? 'चन्द्र की छाया' : "Moon's Shadow"} color="#4ade80" size={9} />

      {/* ── Sun ── */}
      <SunIcon cx={sunX} cy={Y} r={35} />
      <Label x={sunX} y={Y + 50} text={isHi ? 'सूर्य' : 'Sun'} color="#f0d48a" size={12} bold />

      {/* ── Moon (at the node) ── */}
      <circle cx={moonX} cy={Y} r="16" fill="#64748b" />
      <circle cx={moonX + 5} cy={Y - 3} r="14" fill="#04071a" opacity="0.6" />
      <Label x={moonX} y={Y - 24} text={isHi ? 'चन्द्र (अमावस्या)' : 'Moon (New Moon)'} color="#94a3b8" size={10} bold />

      {/* ── Node marker ── */}
      <circle cx={nodeX} cy={Y} r="22" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
      <Label x={nodeX} y={Y + 34} text={isHi ? '☊ राहु/केतु पात पर' : '☊ At Rahu/Ketu Node'} color="#4ade80" size={9} bold />

      {/* ── Earth ── */}
      <EarthIcon cx={earthX} cy={Y} r={18} />
      <Label x={earthX} y={Y + 30} text={isHi ? 'पृथ्वी' : 'Earth'} color="#60a5fa" size={12} bold />
      {/* Shadow on Earth */}
      <circle cx={earthX} cy={Y} r="6" fill="#000" opacity="0.4" />

      {/* ── Title ── */}
      <rect x={W / 2 - 170} y={H - 50} width="340" height="36" rx="8" fill="#052e16" opacity="0.8" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.4" />
      <text x={W / 2} y={H - 35} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#4ade80">
        {isHi ? '⚫ सूर्य ग्रहण — चन्द्र सूर्य और पृथ्वी के बीच (पात पर)' : '⚫ Solar Eclipse — Moon between Sun & Earth (at a node)'}
      </text>
      <text x={W / 2} y={H - 21} textAnchor="middle" fontSize="9" fill="#6ee7b7" opacity="0.7">
        {isHi ? 'अमावस्या + पात = सूर्य ग्रहण' : 'New Moon (Amavasya) + Node = Solar Eclipse'}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DIAGRAM 3: Lunar Eclipse — Sun, Earth, Moon aligned at a node
   ═══════════════════════════════════════════════════════════════════════════════ */
function LunarEclipseDiagram({ isHi }: { isHi: boolean }) {
  const W = 800, H = 360;
  const Y = 170;

  // Left to right: Sun — Earth — Moon
  const sunX = 120;
  const earthX = 380;
  const moonX = 620;
  const nodeX = moonX;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 360 }}>
      <rect width={W} height={H} fill="#04071a" rx="16" />
      <Stars />

      {/* ── Ecliptic ── */}
      <line x1="30" y1={Y} x2={W - 30} y2={Y} stroke="#d4a853" strokeWidth="2" opacity="0.5" />
      <Label x={W - 35} y={Y - 8} text={isHi ? 'क्रान्तिवृत्त' : 'Ecliptic'} color="#d4a853" size={9} align="end" />

      {/* ── Moon's tilted orbit ── */}
      <line x1={nodeX - 120} y1={Y + 40} x2={nodeX + 120} y2={Y - 40} stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
      <text x={nodeX + 125} y={Y - 38} fontSize="10" fill="#a78bfa" fontWeight="bold" opacity="0.8">5.15°</text>

      {/* ── Earth's shadow cone ── */}
      <polygon
        points={`${earthX + 20},${Y - 18} ${earthX + 20},${Y + 18} ${moonX + 30},${Y + 8} ${moonX + 30},${Y - 8}`}
        fill="#0a0010" opacity="0.6"
      />
      <Label x={(earthX + moonX) / 2} y={Y - 28} text={isHi ? 'प्रच्छाया (Umbra)' : 'Umbra'} color="#6d28d9" size={9} />
      <polygon
        points={`${earthX + 16},${Y - 34} ${earthX + 16},${Y + 34} ${moonX + 40},${Y + 26} ${moonX + 40},${Y - 26}`}
        fill="#080014" opacity="0.25"
      />
      <Label x={(earthX + moonX) / 2} y={Y + 38} text={isHi ? 'उपच्छाया (Penumbra)' : 'Penumbra'} color="#7c3aed" size={8} />

      {/* ── Alignment line ── */}
      <line x1={sunX} y1={Y} x2={moonX} y2={Y} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />

      {/* ── Sun ── */}
      <SunIcon cx={sunX} cy={Y} r={35} />
      <Label x={sunX} y={Y + 50} text={isHi ? 'सूर्य' : 'Sun'} color="#f0d48a" size={12} bold />

      {/* ── Earth ── */}
      <EarthIcon cx={earthX} cy={Y} r={18} />
      <Label x={earthX} y={Y + 30} text={isHi ? 'पृथ्वी' : 'Earth'} color="#60a5fa" size={12} bold />

      {/* ── Moon (at node, in shadow) — Blood Moon ── */}
      <circle cx={moonX} cy={Y} r="16" fill="#c0392b" />
      <circle cx={moonX - 4} cy={Y - 3} r="5" fill="#e74c3c" opacity="0.3" />
      <Label x={moonX} y={Y - 24} text={isHi ? 'चन्द्र (पूर्णिमा) — रक्त चन्द्र' : 'Moon (Full Moon) — Blood Moon'} color="#fca5a5" size={10} bold />

      {/* ── Node marker ── */}
      <circle cx={nodeX} cy={Y} r="22" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
      <Label x={nodeX} y={Y + 34} text={isHi ? '☋ राहु/केतु पात पर' : '☋ At Rahu/Ketu Node'} color="#fca5a5" size={9} bold />

      {/* ── Title ── */}
      <rect x={W / 2 - 175} y={H - 50} width="350" height="36" rx="8" fill="#2a0a0a" opacity="0.8" stroke="#ef4444" strokeWidth="0.5" strokeOpacity="0.4" />
      <text x={W / 2} y={H - 35} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fca5a5">
        {isHi ? '🔴 चन्द्र ग्रहण — पृथ्वी सूर्य और चन्द्र के बीच (पात पर)' : '🔴 Lunar Eclipse — Earth between Sun & Moon (at a node)'}
      </text>
      <text x={W / 2} y={H - 21} textAnchor="middle" fontSize="9" fill="#fca5a5" opacity="0.7">
        {isHi ? 'पूर्णिमा + पात = चन्द्र ग्रहण (रक्त चन्द्र)' : 'Full Moon (Purnima) + Node = Lunar Eclipse (Blood Moon)'}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Shared SVG Helpers
   ═══════════════════════════════════════════════════════════════════════════════ */

function Stars() {
  const stars: [number, number, number][] = [
    [20,15,0.1],[90,35,0.2],[160,10,0.12],[240,28,0.18],[350,12,0.1],
    [450,32,0.2],[530,8,0.1],[600,22,0.15],[70,85,0.12],[180,72,0.2],
    [380,78,0.1],[520,65,0.15],[610,95,0.1],[40,160,0.2],[220,180,0.1],
    [480,170,0.15],[570,195,0.1],[100,230,0.2],[350,250,0.1],[510,235,0.15],
    [30,310,0.1],[150,340,0.15],[300,360,0.1],[460,345,0.2],[590,320,0.1],
    [700,50,0.15],[750,180,0.1],[720,300,0.12],[680,120,0.18],[770,260,0.1],
  ];
  return <>{stars.map(([x, y, o], i) => <circle key={i} cx={x} cy={y} r="0.8" fill="white" opacity={o} />)}</>;
}

function SunIcon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={cx + Math.cos(a) * (r + 4)} y1={cy + Math.sin(a) * (r + 4)}
          x2={cx + Math.cos(a) * (r + 14)} y2={cy + Math.sin(a) * (r + 14)}
          stroke="#f0d48a" strokeWidth="1.5" opacity="0.3" />;
      })}
      <circle cx={cx} cy={cy} r={r + 8} fill="#d4a853" opacity="0.1" />
      <circle cx={cx} cy={cy} r={r} fill="#d4a853" />
    </>
  );
}

function EarthIcon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r + 2} fill="#1e3a5f" opacity="0.4" />
      <circle cx={cx} cy={cy} r={r} fill="#3b82f6" />
      <circle cx={cx - r * 0.2} cy={cy - r * 0.15} r={r * 0.35} fill="#22c55e" opacity="0.35" />
    </>
  );
}

function MoonIcon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#94a3b8" />
      <circle cx={cx + r * 0.2} cy={cy - r * 0.1} r={r * 0.8} fill="#64748b" opacity="0.5" />
    </>
  );
}

function Label({ x, y, text, color, size, bold, align }: { x: number; y: number; text: string; color: string; size: number; bold?: boolean; align?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} textAnchor={align || 'middle'} fontSize={size} fill={color} fontWeight={bold ? 'bold' : 'normal'} opacity={0.9}>
      {text}
    </text>
  );
}

function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx},${cy} A${rx},${ry} 0 1 1 ${cx + rx},${cy} A${rx},${ry} 0 1 1 ${cx - rx},${cy}Z`;
}

function tiltedEllipsePath(cx: number, cy: number, rx: number, ry: number, tiltPx: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const x = cx + rx * Math.cos(a);
    const baseY = cy + ry * Math.sin(a);
    const tiltOffset = tiltPx * Math.sin(a); // tilt rises/falls with angle
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${(baseY - tiltOffset).toFixed(1)}`);
  }
  return pts.join(' ') + 'Z';
}
