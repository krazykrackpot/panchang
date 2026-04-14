'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface Props { locale: string }

/**
 * Static diagrams showing:
 * 1. The two orbital planes and their 5.15° tilt
 * 2. Rahu and Ketu as intersection nodes
 * 3. Solar eclipse geometry (Sun—Moon—Earth aligned at a node)
 * 4. Lunar eclipse geometry (Sun—Earth—Moon aligned at a node)
 */
export default function EclipseAnimation({ locale }: Props) {
  const [tab, setTab] = useState<'planes' | 'solar' | 'lunar'>('planes');
  const isHi = isDevanagariLocale(locale);

  const tabBase = 'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer';
  const tabActive = 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5';
  const tabInactive = 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="my-8">
      {/* Tabs */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-5 flex-wrap">
        <button onClick={() => setTab('planes')} className={`${tabBase} ${tab === 'planes' ? tabActive : tabInactive}`}>
          {tl({ en: 'Orbital Planes & Nodes', hi: 'कक्षीय तल और पात', sa: 'कक्षीय तल और पात' }, locale)}
        </button>
        <button onClick={() => setTab('solar')} className={`${tabBase} ${tab === 'solar' ? tabActive : tabInactive}`}>
          ☀ {tl({ en: 'Solar Eclipse', hi: 'सूर्य ग्रहण', sa: 'सूर्यग्रहणम्' }, locale)}
        </button>
        <button onClick={() => setTab('lunar')} className={`${tabBase} ${tab === 'lunar' ? tabActive : tabInactive}`}>
          ☽ {tl({ en: 'Lunar Eclipse', hi: 'चन्द्र ग्रहण', sa: 'चन्द्रग्रहणम्' }, locale)}
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-3 sm:p-5">
        {tab === 'planes' && <OrbitalPlanesDiagram locale={locale} />}
        {tab === 'solar' && <SolarEclipseDiagram locale={locale} />}
        {tab === 'lunar' && <LunarEclipseDiagram locale={locale} />}

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center mt-4 text-[10px] text-text-secondary/60">
          <span className="flex items-center gap-1.5"><span className="w-4 h-[2px] bg-gold-primary inline-block rounded" /> {tl({ en: "Ecliptic (Earth's orbit)", hi: "क्रान्तिवृत्त (पृथ्वी कक्षा)", sa: "क्रान्तिवृत्त (पृथ्वी कक्षा)" }, locale)}</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-[2px] bg-purple-400 inline-block rounded opacity-70" /> {tl({ en: "Moon's orbit (5.15° tilted)", hi: "चन्द्र कक्षा (5.15° झुकी)", sa: "चन्द्र कक्षा (5.15° झुकी)" }, locale)}</span>
          <span className="flex items-center gap-1.5"><span className="text-gold-light text-xs">☊</span> {tl({ en: 'Rahu (Ascending Node)', hi: 'राहु (आरोही पात)', sa: 'राहु (आरोही पात)' }, locale)}</span>
          <span className="flex items-center gap-1.5"><span className="text-purple-300 text-xs">☋</span> {tl({ en: 'Ketu (Descending Node)', hi: 'केतु (अवरोही पात)', sa: 'केतु (अवरोही पात)' }, locale)}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DIAGRAM 1: Two Orbital Planes + 5.15° Tilt + Rahu/Ketu Nodes
   ═══════════════════════════════════════════════════════════════════════════════ */
function OrbitalPlanesDiagram({ locale }: { locale: string }) {
  // Oblique view: Sun at center-left, Earth at right, Moon's orbit large and clear
  const W = 800, H = 520, CX = 280, CY = 250;
  const ERX = 220, ERY = 90; // Earth orbit radii (smaller to give room for Moon orbit)
  const MRX = 140, MRY = 55; // Moon orbit radii — LARGE for clarity
  const TILT = 35; // visual tilt in px (exaggerated for visibility)

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
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 520 }}>
      <rect width={W} height={H} fill="#04071a" rx="16" />
      <Stars />

      {/* ── Earth's orbit = Ecliptic Plane ── */}
      <ellipse cx={CX} cy={CY} rx={ERX} ry={ERY} fill="#d4a853" opacity="0.03" />
      <ellipse cx={CX} cy={CY} rx={ERX} ry={ERY} fill="none" stroke="#d4a853" strokeWidth="1.8" opacity="0.5" />
      <Label x={CX} y={CY - ERY - 14} text={tl({ en: "Ecliptic Plane — Earth's orbit around the Sun", hi: "क्रान्तिवृत्त तल — पृथ्वी की सूर्य के चारों ओर कक्षा", sa: "क्रान्तिवृत्त तल — पृथ्वी की सूर्य के चारों ओर कक्षा" }, locale)} color="#d4a853" size={11} bold />

      {/* ── Sun ── */}
      <SunIcon cx={CX} cy={CY} r={24} />
      <Label x={CX} y={CY + 38} text={tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, locale)} color="#f0d48a" size={11} bold />

      {/* ── Earth ── */}
      <EarthIcon cx={earthX} cy={earthY} r={12} />
      <Label x={earthX} y={earthY + 22} text={tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी' }, locale)} color="#60a5fa" size={10} bold />

      {/* ── Moon's orbit — ecliptic-aligned ghost ── */}
      <path d={eclipticOrbit} fill="none" stroke="#d4a853" strokeWidth="0.7" strokeDasharray="3 4" opacity="0.2" />

      {/* ── Moon's orbit — TILTED ── */}
      <path d={tiltedOrbit} fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeDasharray="8 4" opacity="0.65" />
      <Label x={earthX + MRX + 12} y={earthY - TILT - 8} text={tl({ en: "Moon's Orbit", hi: "चन्द्र कक्षा", sa: "चन्द्र कक्षा" }, locale)} color="#a78bfa" size={10} bold />

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
      <Label x={rahuX} y={rahuY - 22} text={tl({ en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, locale)} color="#f0d48a" size={12} bold />
      <Label x={rahuX} y={rahuY + 28} text={tl({ en: 'Ascending Node', hi: 'आरोही पात', sa: 'आरोहीपातः' }, locale)} color="#d4a853" size={8} />
      <Label x={rahuX} y={rahuY + 38} text={tl({ en: '(Moon crosses upward)', hi: '(चन्द्र ऊपर जाता है)', sa: '(चन्द्र ऊपर जाता है)' }, locale)} color="#d4a853" size={7} />

      {/* ── KETU NODE ── */}
      <circle cx={ketuX} cy={ketuY} r="14" fill="#c4b5fd" opacity="0.08" />
      <circle cx={ketuX} cy={ketuY} r="14" fill="none" stroke="#c4b5fd" strokeWidth="2.5" opacity="0.8" />
      <text x={ketuX} y={ketuY + 5} textAnchor="middle" fontSize="16" fill="#c4b5fd" fontWeight="bold">☋</text>
      <Label x={ketuX} y={ketuY - 22} text={tl({ en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, locale)} color="#c4b5fd" size={12} bold />
      <Label x={ketuX} y={ketuY + 28} text={tl({ en: 'Descending Node', hi: 'अवरोही पात', sa: 'अवरोहीपातः' }, locale)} color="#a78bfa" size={8} />
      <Label x={ketuX} y={ketuY + 38} text={tl({ en: '(Moon crosses downward)', hi: '(चन्द्र नीचे जाता है)', sa: '(चन्द्र नीचे जाता है)' }, locale)} color="#a78bfa" size={7} />

      {/* ── Moon positions showing above/below ecliptic ── */}
      <MoonIcon cx={moonAbove.x} cy={moonAbove.y} r={8} />
      <Label x={moonAbove.x + 14} y={moonAbove.y + 3} text={tl({ en: '← Moon above ecliptic', hi: '← चन्द्र क्रान्तिवृत्त से ऊपर', sa: '← चन्द्र क्रान्तिवृत्त से ऊपर' }, locale)} color="#94a3b8" size={8} align="start" />

      <MoonIcon cx={moonBelow.x} cy={moonBelow.y} r={8} />
      <Label x={moonBelow.x + 14} y={moonBelow.y + 3} text={tl({ en: '← Moon below ecliptic', hi: '← चन्द्र क्रान्तिवृत्त से नीचे', sa: '← चन्द्र क्रान्तिवृत्त से नीचे' }, locale)} color="#94a3b8" size={8} align="start" />

      {/* ── Annotation: when eclipse happens ── */}
      <rect x={CX - 180} y={H - 55} width="360" height="40" rx="8" fill="#0f0a2a" opacity="0.85" stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.3" />
      <text x={CX} y={H - 38} textAnchor="middle" fontSize="10" fill="#d4a853" fontWeight="bold">
        {tl({ en: 'Eclipse occurs ONLY when New/Full Moon happens NEAR a node (Rahu/Ketu)', hi: 'ग्रहण तभी होता है जब अमावस्या/पूर्णिमा किसी पात (राहु/केतु) के निकट हो', sa: 'ग्रहण तभी होता है जब अमावस्या/पूर्णिमा किसी पात (राहु/केतु) के निकट हो' }, locale)}
      </text>
      <text x={CX} y={H - 24} textAnchor="middle" fontSize="9" fill="#8a8478">
        {tl({ en: 'Most New/Full Moons pass without eclipse — Moon is far from the nodes', hi: 'अधिकांश अमावस्या/पूर्णिमा बिना ग्रहण के गुजरती हैं — चन्द्र पातों से दूर रहता है', sa: 'अधिकांश अमावस्या/पूर्णिमा बिना ग्रहण के गुजरती हैं — चन्द्र पातों से दूर रहता है' }, locale)}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DIAGRAM 2: Solar Eclipse — Sun, Moon, Earth aligned at a node
   ═══════════════════════════════════════════════════════════════════════════════ */
function SolarEclipseDiagram({ locale }: { locale: string }) {
  const W = 800, H = 400;
  const Y = 180;

  const sunX = 100;
  const rahuX = 340;    // Rahu node — where eclipse happens
  const earthX = 640;
  const ketuY_offset = 50; // Ketu shown on the tilted orbit, above/below ecliptic

  // Ketu is on the opposite side of the tilted orbit from Rahu
  // In this side view, if Rahu is on the ecliptic, Ketu is also on the ecliptic
  // but on the other side of Earth's orbit (shown as a marker further along the tilted line)
  const ketuX = rahuX; // same X (it's on the line), but we'll show it offset on the orbit
  const orbitExtent = 160;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 400 }}>
      <rect width={W} height={H} fill="#04071a" rx="16" />
      <Stars />

      {/* Ecliptic */}
      <line x1="30" y1={Y} x2={W - 30} y2={Y} stroke="#d4a853" strokeWidth="2" opacity="0.5" />
      <Label x={50} y={Y - 10} text={tl({ en: 'Ecliptic Plane', hi: 'क्रान्तिवृत्त तल', sa: 'क्रान्तिवृत्त तल' }, locale)} color="#d4a853" size={9} align="start" />

      {/* Moon's tilted orbit line — extends through both nodes */}
      <line x1={rahuX - orbitExtent} y1={Y + ketuY_offset} x2={rahuX + orbitExtent} y2={Y - ketuY_offset} stroke="#a78bfa" strokeWidth="1.8" strokeDasharray="7 4" opacity="0.5" />
      <text x={rahuX + orbitExtent + 5} y={Y - ketuY_offset} fontSize="11" fill="#a78bfa" fontWeight="bold" opacity="0.8">5.15°</text>
      <text x={rahuX + orbitExtent + 5} y={Y - ketuY_offset + 12} fontSize="8" fill="#a78bfa" opacity="0.5">{tl({ en: "Moon's orbit", hi: "चन्द्र कक्षा", sa: "चन्द्र कक्षा" }, locale)}</text>

      {/* Alignment line */}
      <line x1={sunX} y1={Y} x2={earthX} y2={Y} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />

      {/* Shadow cone */}
      <polygon points={`${rahuX + 18},${Y - 14} ${rahuX + 18},${Y + 14} ${earthX - 16},${Y + 22} ${earthX - 16},${Y - 22}`} fill="#001008" opacity="0.45" />
      <polygon points={`${rahuX + 14},${Y - 22} ${rahuX + 14},${Y + 22} ${earthX - 14},${Y + 36} ${earthX - 14},${Y - 36}`} fill="#000a05" opacity="0.15" />
      <Label x={(rahuX + earthX) / 2} y={Y - 34} text={tl({ en: "Moon's Shadow", hi: "चन्द्र की छाया", sa: "चन्द्र की छाया" }, locale)} color="#4ade80" size={9} />

      {/* Sun */}
      <SunIcon cx={sunX} cy={Y} r={35} />
      <Label x={sunX} y={Y + 52} text={tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, locale)} color="#f0d48a" size={12} bold />

      {/* Moon at Rahu */}
      <circle cx={rahuX} cy={Y} r="16" fill="#64748b" />
      <circle cx={rahuX + 5} cy={Y - 3} r="14" fill="#04071a" opacity="0.6" />
      <Label x={rahuX} y={Y - 28} text={tl({ en: 'Moon (New Moon)', hi: 'चन्द्र (अमावस्या)', sa: 'चन्द्र (अमावस्या)' }, locale)} color="#94a3b8" size={10} bold />

      {/* ☊ RAHU — where eclipse happens */}
      <circle cx={rahuX} cy={Y} r="24" fill="none" stroke="#22c55e" strokeWidth="2.5" opacity="0.6" />
      <text x={rahuX - 30} y={Y + 44} fontSize="14" fill="#f0d48a" fontWeight="bold">☊</text>
      <text x={rahuX - 14} y={Y + 44} fontSize="11" fill="#f0d48a" fontWeight="bold">{tl({ en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, locale)}</text>
      <text x={rahuX - 30} y={Y + 56} fontSize="8" fill="#d4a853" opacity="0.6">{tl({ en: 'Ascending Node — Eclipse here!', hi: 'आरोही पात — ग्रहण यहाँ!', sa: 'आरोही पात — ग्रहण यहाँ!' }, locale)}</text>

      {/* ☋ KETU — on the opposite side of the tilted orbit */}
      <circle cx={rahuX - orbitExtent + 20} cy={Y + ketuY_offset - 6} r="10" fill="none" stroke="#c4b5fd" strokeWidth="2" opacity="0.6" />
      <text x={rahuX - orbitExtent + 20} y={Y + ketuY_offset - 2} textAnchor="middle" fontSize="12" fill="#c4b5fd" fontWeight="bold">☋</text>
      <text x={rahuX - orbitExtent + 20} y={Y + ketuY_offset + 12} textAnchor="middle" fontSize="9" fill="#c4b5fd" fontWeight="bold">{tl({ en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, locale)}</text>
      <text x={rahuX - orbitExtent + 20} y={Y + ketuY_offset + 22} textAnchor="middle" fontSize="7" fill="#a78bfa" opacity="0.5">{tl({ en: 'Descending Node', hi: 'अवरोही पात', sa: 'अवरोहीपातः' }, locale)}</text>

      {/* Earth */}
      <EarthIcon cx={earthX} cy={Y} r={18} />
      <Label x={earthX} y={Y + 30} text={tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी' }, locale)} color="#60a5fa" size={12} bold />
      <circle cx={earthX} cy={Y} r="6" fill="#000" opacity="0.4" />

      {/* Title */}
      <rect x={W / 2 - 190} y={H - 52} width="380" height="40" rx="8" fill="#052e16" opacity="0.8" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.4" />
      <text x={W / 2} y={H - 36} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#4ade80">
        {tl({ en: '⚫ Solar Eclipse — Moon at Rahu node, between Sun & Earth', hi: '⚫ सूर्य ग्रहण — चन्द्र राहु पात पर, सूर्य और पृथ्वी के बीच', sa: '⚫ सूर्य ग्रहण — चन्द्र राहु पात पर, सूर्य और पृथ्वी के बीच' }, locale)}
      </text>
      <text x={W / 2} y={H - 22} textAnchor="middle" fontSize="9" fill="#6ee7b7" opacity="0.7">
        {tl({ en: 'New Moon (Amavasya) at Rahu or Ketu = Solar Eclipse', hi: 'अमावस्या + राहु/केतु पात = सूर्य ग्रहण', sa: 'अमावस्या + राहु/केतु पात = सूर्य ग्रहण' }, locale)}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DIAGRAM 3: Lunar Eclipse — Sun, Earth, Moon aligned at a node
   ═══════════════════════════════════════════════════════════════════════════════ */
function LunarEclipseDiagram({ locale }: { locale: string }) {
  const W = 800, H = 400;
  const Y = 180;

  const sunX = 100;
  const earthX = 360;
  const ketuX = 600;    // Ketu node — where eclipse happens
  const orbitExtent = 160;
  const ketuY_offset = 50;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 400 }}>
      <rect width={W} height={H} fill="#04071a" rx="16" />
      <Stars />

      {/* Ecliptic */}
      <line x1="30" y1={Y} x2={W - 30} y2={Y} stroke="#d4a853" strokeWidth="2" opacity="0.5" />
      <Label x={50} y={Y - 10} text={tl({ en: 'Ecliptic Plane', hi: 'क्रान्तिवृत्त तल', sa: 'क्रान्तिवृत्त तल' }, locale)} color="#d4a853" size={9} align="start" />

      {/* Moon's tilted orbit line — extends through both nodes */}
      <line x1={ketuX - orbitExtent} y1={Y + ketuY_offset} x2={ketuX + orbitExtent} y2={Y - ketuY_offset} stroke="#a78bfa" strokeWidth="1.8" strokeDasharray="7 4" opacity="0.5" />
      <text x={ketuX + orbitExtent + 5} y={Y - ketuY_offset} fontSize="11" fill="#a78bfa" fontWeight="bold" opacity="0.8">5.15°</text>
      <text x={ketuX + orbitExtent + 5} y={Y - ketuY_offset + 12} fontSize="8" fill="#a78bfa" opacity="0.5">{tl({ en: "Moon's orbit", hi: "चन्द्र कक्षा", sa: "चन्द्र कक्षा" }, locale)}</text>

      {/* Earth's shadow cones */}
      <polygon points={`${earthX + 20},${Y - 18} ${earthX + 20},${Y + 18} ${ketuX + 30},${Y + 8} ${ketuX + 30},${Y - 8}`} fill="#0a0010" opacity="0.6" />
      <Label x={(earthX + ketuX) / 2} y={Y - 28} text={tl({ en: 'Umbra', hi: 'प्रच्छाया (Umbra)', sa: 'प्रच्छाया (Umbra)' }, locale)} color="#6d28d9" size={9} />
      <polygon points={`${earthX + 16},${Y - 34} ${earthX + 16},${Y + 34} ${ketuX + 40},${Y + 26} ${ketuX + 40},${Y - 26}`} fill="#080014" opacity="0.25" />
      <Label x={(earthX + ketuX) / 2} y={Y + 38} text={tl({ en: 'Penumbra', hi: 'उपच्छाया (Penumbra)', sa: 'उपच्छाया (Penumbra)' }, locale)} color="#7c3aed" size={8} />

      {/* Alignment line */}
      <line x1={sunX} y1={Y} x2={ketuX} y2={Y} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />

      {/* Sun */}
      <SunIcon cx={sunX} cy={Y} r={35} />
      <Label x={sunX} y={Y + 52} text={tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, locale)} color="#f0d48a" size={12} bold />

      {/* Earth */}
      <EarthIcon cx={earthX} cy={Y} r={18} />
      <Label x={earthX} y={Y + 30} text={tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी' }, locale)} color="#60a5fa" size={12} bold />

      {/* Moon at Ketu — Blood Moon */}
      <circle cx={ketuX} cy={Y} r="16" fill="#c0392b" />
      <circle cx={ketuX - 4} cy={Y - 3} r="5" fill="#e74c3c" opacity="0.3" />
      <Label x={ketuX} y={Y - 28} text={tl({ en: 'Moon (Full Moon) — Blood Moon', hi: 'चन्द्र (पूर्णिमा) — रक्त चन्द्र', sa: 'चन्द्र (पूर्णिमा) — रक्त चन्द्र' }, locale)} color="#fca5a5" size={10} bold />

      {/* ☋ KETU — where this eclipse happens */}
      <circle cx={ketuX} cy={Y} r="24" fill="none" stroke="#ef4444" strokeWidth="2.5" opacity="0.6" />
      <text x={ketuX + 30} y={Y + 44} fontSize="14" fill="#c4b5fd" fontWeight="bold">☋</text>
      <text x={ketuX + 46} y={Y + 44} fontSize="11" fill="#c4b5fd" fontWeight="bold">{tl({ en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, locale)}</text>
      <text x={ketuX + 30} y={Y + 56} fontSize="8" fill="#a78bfa" opacity="0.6">{tl({ en: 'Descending Node — Eclipse here!', hi: 'अवरोही पात — ग्रहण यहाँ!', sa: 'अवरोही पात — ग्रहण यहाँ!' }, locale)}</text>

      {/* ☊ RAHU — on the opposite side of the tilted orbit */}
      <circle cx={ketuX + orbitExtent - 20} cy={Y - ketuY_offset + 6} r="10" fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.6" />
      <text x={ketuX + orbitExtent - 20} y={Y - ketuY_offset + 10} textAnchor="middle" fontSize="12" fill="#f0d48a" fontWeight="bold">☊</text>
      <text x={ketuX + orbitExtent - 20} y={Y - ketuY_offset - 6} textAnchor="middle" fontSize="9" fill="#f0d48a" fontWeight="bold">{tl({ en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, locale)}</text>
      <text x={ketuX + orbitExtent - 20} y={Y - ketuY_offset + 22} textAnchor="middle" fontSize="7" fill="#d4a853" opacity="0.5">{tl({ en: 'Ascending Node', hi: 'आरोही पात', sa: 'आरोहीपातः' }, locale)}</text>

      {/* Title */}
      <rect x={W / 2 - 190} y={H - 52} width="380" height="40" rx="8" fill="#2a0a0a" opacity="0.8" stroke="#ef4444" strokeWidth="0.5" strokeOpacity="0.4" />
      <text x={W / 2} y={H - 36} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fca5a5">
        {tl({ en: "🔴 Lunar Eclipse — Moon at Ketu node, in Earth\'s shadow", hi: "🔴 चन्द्र ग्रहण — चन्द्र केतु पात पर, पृथ्वी की छाया में", sa: "🔴 चन्द्र ग्रहण — चन्द्र केतु पात पर, पृथ्वी की छाया में" }, locale)}
      </text>
      <text x={W / 2} y={H - 22} textAnchor="middle" fontSize="9" fill="#fca5a5" opacity="0.7">
        {tl({ en: 'Full Moon (Purnima) at Rahu or Ketu = Lunar Eclipse (Blood Moon)', hi: 'पूर्णिमा + राहु/केतु पात = चन्द्र ग्रहण (रक्त चन्द्र)', sa: 'पूर्णिमा + राहु/केतु पात = चन्द्र ग्रहण (रक्त चन्द्र)' }, locale)}
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
