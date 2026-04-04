'use client';

import { useState } from 'react';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import type { Locale } from '@/types/panchang';

// Rashi colors (subtle, dark-theme friendly)
const RASHI_COLORS = [
  '#e74c3c30', '#2ecc7130', '#f39c1230', '#ecf0f130', '#e67e2230', '#2ecc7130',
  '#e8e6e330', '#e74c3c30', '#f39c1230', '#8a6d2b30', '#3498db30', '#ecf0f130',
];
const RASHI_BORDER = [
  '#e74c3c', '#2ecc71', '#f39c12', '#ecf0f1', '#e67e22', '#2ecc71',
  '#e8e6e3', '#e74c3c', '#f39c12', '#8a6d2b', '#3498db', '#ecf0f1',
];

// Elements for rashis
const ELEMENTS = ['Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water'];
const ELEMENT_HI = ['अग्नि', 'पृथ्वी', 'वायु', 'जल', 'अग्नि', 'पृथ्वी', 'वायु', 'जल', 'अग्नि', 'पृथ्वी', 'वायु', 'जल'];

interface Props { locale: Locale }

export default function RashiNakshatraWheel({ locale }: Props) {
  const [hoveredNak, setHoveredNak] = useState<number | null>(null);
  const [hoveredRashi, setHoveredRashi] = useState<number | null>(null);
  const isHi = locale !== 'en';

  const cx = 300, cy = 300;
  const outerR = 270, midR = 210, innerR = 140, centerR = 80;

  function polarToCart(angle: number, r: number) {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(startAngle: number, endAngle: number, r1: number, r2: number) {
    const s1 = polarToCart(startAngle, r1);
    const e1 = polarToCart(endAngle, r1);
    const s2 = polarToCart(endAngle, r2);
    const e2 = polarToCart(startAngle, r2);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s1.x} ${s1.y} A ${r1} ${r1} 0 ${largeArc} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${r2} ${r2} 0 ${largeArc} 0 ${e2.x} ${e2.y} Z`;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-gold-gradient text-xl font-bold text-center" style={{ fontFamily: 'var(--font-heading)' }}>
        {isHi ? 'राशि-नक्षत्र सम्बन्ध चक्र' : 'Rashi–Nakshatra Relationship Wheel'}
      </h3>
      <p className="text-text-secondary/60 text-sm text-center max-w-xl mx-auto">
        {isHi
          ? 'बाहरी वलय: 12 राशियाँ (30° प्रत्येक)। भीतरी वलय: 27 नक्षत्र (13°20\' प्रत्येक)। देखें कैसे नक्षत्र राशियों में फैले हुए हैं।'
          : 'Outer ring: 12 Rashis (30° each). Inner ring: 27 Nakshatras (13°20\' each). See how nakshatras span across rashi boundaries.'}
      </p>

      <div className="flex justify-center">
        <svg viewBox="0 0 600 600" className="w-full max-w-[500px]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {/* Outer ring — 12 Rashis */}
          {RASHIS.map((r, i) => {
            const startAngle = i * 30;
            const endAngle = (i + 1) * 30;
            const midAngle = startAngle + 15;
            const labelPos = polarToCart(midAngle, (outerR + midR) / 2);
            const isHovered = hoveredRashi === i;
            return (
              <g key={`r${i}`}
                onMouseEnter={() => setHoveredRashi(i)}
                onMouseLeave={() => setHoveredRashi(null)}
                className="cursor-pointer"
              >
                <path
                  d={arcPath(startAngle, endAngle, outerR, midR)}
                  fill={isHovered ? RASHI_COLORS[i].replace('30', '60') : RASHI_COLORS[i]}
                  stroke={RASHI_BORDER[i]}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  strokeOpacity={isHovered ? 0.8 : 0.3}
                />
                <text x={labelPos.x} y={labelPos.y - 4} textAnchor="middle" dominantBaseline="middle"
                  fill={RASHI_BORDER[i]} fontSize={isHovered ? 11 : 9} fontWeight={isHovered ? 700 : 500} opacity={isHovered ? 1 : 0.7}
                  style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {r.name[locale]}
                </text>
                <text x={labelPos.x} y={labelPos.y + 8} textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(255,255,255,0.25)" fontSize={7}>
                  {i * 30}°–{(i + 1) * 30}°
                </text>
              </g>
            );
          })}

          {/* Inner ring — 27 Nakshatras */}
          {NAKSHATRAS.map((n, i) => {
            const startAngle = i * (360 / 27);
            const endAngle = (i + 1) * (360 / 27);
            const midAngle = startAngle + (360 / 54);
            const labelPos = polarToCart(midAngle, (midR + innerR) / 2);
            const isHovered = hoveredNak === i;
            // Which rashi does this nakshatra's midpoint fall in?
            const midDeg = (startAngle + endAngle) / 2;
            const rashiIdx = Math.floor(midDeg / 30);
            return (
              <g key={`n${i}`}
                onMouseEnter={() => setHoveredNak(i)}
                onMouseLeave={() => setHoveredNak(null)}
                className="cursor-pointer"
              >
                <path
                  d={arcPath(startAngle, endAngle, midR, innerR)}
                  fill={isHovered ? 'rgba(212,168,83,0.15)' : 'rgba(212,168,83,0.03)'}
                  stroke="rgba(212,168,83,0.2)"
                  strokeWidth={isHovered ? 1.2 : 0.3}
                />
                <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="middle"
                  fill={isHovered ? '#f0d48a' : 'rgba(212,168,83,0.5)'} fontSize={isHovered ? 8 : 6.5} fontWeight={isHovered ? 700 : 400}
                  style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {n.name[locale].length > 8 ? n.name[locale].substring(0, 7) + '…' : n.name[locale]}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle cx={cx} cy={cy} r={centerR} fill="rgba(10,14,39,0.9)" stroke="rgba(212,168,83,0.15)" strokeWidth={1} />
          <text x={cx} y={cy - 12} textAnchor="middle" fill="#f0d48a" fontSize={12} fontWeight={700}>
            360°
          </text>
          <text x={cx} y={cy + 4} textAnchor="middle" fill="rgba(212,168,83,0.5)" fontSize={8}>
            12 Rashis × 30°
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(212,168,83,0.5)" fontSize={8}>
            27 Nakshatras × 13°20&apos;
          </text>

          {/* Hover tooltip */}
          {hoveredNak !== null && (() => {
            const n = NAKSHATRAS[hoveredNak];
            const startDeg = hoveredNak * (360 / 27);
            const endDeg = (hoveredNak + 1) * (360 / 27);
            const rashi1 = Math.floor(startDeg / 30);
            const rashi2 = Math.floor((endDeg - 0.01) / 30);
            const spans = rashi1 !== rashi2;
            return (
              <g>
                <rect x={cx - 110} y={cy - 55} width={220} height={70} rx={8} fill="rgba(10,14,39,0.95)" stroke="rgba(212,168,83,0.3)" strokeWidth={1} />
                <text x={cx} y={cy - 36} textAnchor="middle" fill="#f0d48a" fontSize={12} fontWeight={700}
                  style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                  {n.name[locale]}
                </text>
                <text x={cx} y={cy - 20} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={9}>
                  {startDeg.toFixed(1)}° – {endDeg.toFixed(1)}° | {isHi ? 'स्वामी' : 'Lord'}: {n.rulerName[locale]}
                </text>
                <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={9}>
                  {isHi ? 'राशि' : 'Rashi'}: {RASHIS[rashi1].name[locale]}{spans ? ` → ${RASHIS[rashi2].name[locale]}` : ''}
                </text>
              </g>
            );
          })()}

          {hoveredRashi !== null && hoveredNak === null && (() => {
            const r = RASHIS[hoveredRashi];
            const startNak = Math.floor((hoveredRashi * 30) / (360 / 27));
            const endNak = Math.floor(((hoveredRashi + 1) * 30 - 0.01) / (360 / 27));
            return (
              <g>
                <rect x={cx - 110} y={cy - 55} width={220} height={70} rx={8} fill="rgba(10,14,39,0.95)" stroke={RASHI_BORDER[hoveredRashi]} strokeWidth={1} strokeOpacity={0.5} />
                <text x={cx} y={cy - 36} textAnchor="middle" fill={RASHI_BORDER[hoveredRashi]} fontSize={12} fontWeight={700}
                  style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                  {r.name[locale]}
                </text>
                <text x={cx} y={cy - 20} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={9}>
                  {hoveredRashi * 30}° – {(hoveredRashi + 1) * 30}° | {isHi ? 'तत्व' : 'Element'}: {isHi ? ELEMENT_HI[hoveredRashi] : ELEMENTS[hoveredRashi]}
                </text>
                <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={9}>
                  {isHi ? 'नक्षत्र' : 'Nakshatras'}: {NAKSHATRAS[startNak].name[locale]} – {NAKSHATRAS[endNak].name[locale]}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Key insight */}
      <div className="text-center text-text-secondary/50 text-xs max-w-lg mx-auto leading-relaxed">
        {isHi
          ? 'ध्यान दें: कुछ नक्षत्र दो राशियों में फैले हैं (जैसे कृत्तिका मेष और वृषभ दोनों में)। इसीलिए एक ही नक्षत्र के अलग-अलग पादों में जन्मे लोगों की राशि भिन्न हो सकती है।'
          : 'Notice: Some nakshatras span two rashis (e.g., Krittika spans Aries and Taurus). This is why people born in the same nakshatra but different padas can have different rashis.'}
      </div>
    </div>
  );
}
