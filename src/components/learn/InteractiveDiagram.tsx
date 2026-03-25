'use client';

import { motion } from 'framer-motion';

export function EclipticDiagram() {
  return (
    <svg viewBox="0 0 400 300" className="w-full max-w-md">
      {/* Earth */}
      <circle cx="200" cy="150" r="30" fill="#1a3a5c" stroke="#4a9eff" strokeWidth="1" />
      <text x="200" y="153" textAnchor="middle" fill="#4a9eff" fontSize="10">Earth</text>

      {/* Equator plane */}
      <ellipse cx="200" cy="150" rx="170" ry="30" fill="none" stroke="rgba(74,158,255,0.3)" strokeWidth="1" strokeDasharray="4 4" />
      <text x="380" y="145" fill="rgba(74,158,255,0.5)" fontSize="8">Equator</text>

      {/* Ecliptic plane (tilted 23.5°) */}
      <g transform="rotate(-23.5, 200, 150)">
        <ellipse cx="200" cy="150" rx="170" ry="30" fill="none" stroke="rgba(240,212,138,0.6)" strokeWidth="1.5" />
        {/* Sun position on ecliptic */}
        <circle cx="370" cy="150" r="8" fill="#f0d48a" />
        <text x="370" y="135" textAnchor="middle" fill="#f0d48a" fontSize="8">Sun</text>
        {/* Zodiac belt */}
        <ellipse cx="200" cy="150" rx="170" ry="45" fill="none" stroke="rgba(240,212,138,0.15)" strokeWidth="30" opacity="0.4" />
      </g>
      <text x="380" y="115" fill="rgba(240,212,138,0.7)" fontSize="8">Ecliptic</text>

      {/* Angle indicator */}
      <path d="M 200 120 A 30 30 0 0 0 212 126" fill="none" stroke="#f0d48a" strokeWidth="1" />
      <text x="218" y="118" fill="#f0d48a" fontSize="8">23.5°</text>

      {/* Axis */}
      <line x1="200" y1="60" x2="200" y2="240" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />
    </svg>
  );
}

export function ZodiacBeltDiagram() {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagit.', 'Capri.', 'Aquarius', 'Pisces'];
  const signsSa = ['मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];
  const cx = 200, cy = 200, r = 160;

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-sm">
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r + 30} fill="none" stroke="rgba(212,168,83,0.1)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 30} fill="none" stroke="rgba(212,168,83,0.1)" strokeWidth="1" />

      {/* 12 sign divisions */}
      {signs.map((sign, i) => {
        const startAngle = (i * 30 - 90) * Math.PI / 180;
        const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
        const midAngle = ((i * 30 + 15) - 90) * Math.PI / 180;

        const x1 = cx + (r - 30) * Math.cos(startAngle);
        const y1 = cy + (r - 30) * Math.sin(startAngle);
        const x2 = cx + (r + 30) * Math.cos(startAngle);
        const y2 = cy + (r + 30) * Math.sin(startAngle);

        const textX = cx + r * Math.cos(midAngle);
        const textY = cy + r * Math.sin(midAngle);
        const textSaX = cx + (r + 18) * Math.cos(midAngle);
        const textSaY = cy + (r + 18) * Math.sin(midAngle);

        return (
          <g key={sign}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,168,83,0.25)" strokeWidth="0.5" />
            <text
              x={textX} y={textY}
              textAnchor="middle" dominantBaseline="middle"
              fill="#f0d48a" fontSize="7"
              transform={`rotate(${i * 30}, ${textX}, ${textY})`}
            >
              {sign}
            </text>
            <text
              x={textSaX} y={textSaY}
              textAnchor="middle" dominantBaseline="middle"
              fill="rgba(240,212,138,0.5)" fontSize="6"
              transform={`rotate(${i * 30}, ${textSaX}, ${textSaY})`}
            >
              {signsSa[i]}
            </text>
          </g>
        );
      })}

      {/* Degree markers */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(240,212,138,0.6)" fontSize="9">360° ÷ 12</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(240,212,138,0.4)" fontSize="8">= 30° each</text>
    </svg>
  );
}

export function TithiDiagram() {
  const cx = 200, cy = 200, r = 140;
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-xs">
      {/* Sun at center-left */}
      <circle cx={100} cy={cy} r={20} fill="#f0d48a" opacity="0.8" />
      <text x={100} y={cy + 35} textAnchor="middle" fill="#f0d48a" fontSize="10">Sun</text>

      {/* Earth at center */}
      <circle cx={cx} cy={cy} r={12} fill="#1a3a5c" stroke="#4a9eff" strokeWidth="1" />
      <text x={cx} y={cy + 25} textAnchor="middle" fill="#4a9eff" fontSize="9">Earth</text>

      {/* Moon orbit */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(200,200,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />

      {/* Moon positions with elongation labels */}
      {[0, 30, 90, 180, 270, 330].map((deg) => {
        const angle = (deg - 90) * Math.PI / 180;
        const mx = cx + r * Math.cos(angle);
        const my = cy + r * Math.sin(angle);
        const labels: Record<number, string> = { 0: 'New (0°)', 30: '30°', 90: '90°', 180: 'Full (180°)', 270: '270°', 330: '330°' };
        return (
          <g key={deg}>
            <circle cx={mx} cy={my} r={6} fill="#c8c8ff" opacity="0.6" />
            <text x={mx} y={my - 12} textAnchor="middle" fill="rgba(200,200,255,0.8)" fontSize="7">{labels[deg]}</text>
          </g>
        );
      })}

      {/* Angular arrow */}
      <text x={cx} y={cy - r - 15} textAnchor="middle" fill="#f0d48a" fontSize="9">Tithi = (Moon - Sun) / 12°</text>
    </svg>
  );
}

export function AyanamshaDiagram() {
  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-md">
      {/* Two number lines */}
      <line x1="30" y1="60" x2="370" y2="60" stroke="rgba(240,212,138,0.4)" strokeWidth="1.5" />
      <line x1="30" y1="140" x2="370" y2="140" stroke="rgba(74,158,255,0.4)" strokeWidth="1.5" />

      {/* Tropical (Western) */}
      <text x="30" y="45" fill="#4a9eff" fontSize="10">Tropical (Western): 0° = Equinox Point</text>
      {[0, 30, 60, 90].map((d, i) => {
        const x = 50 + i * 90;
        return (
          <g key={`t-${d}`}>
            <line x1={x} y1="55" x2={x} y2="65" stroke="#4a9eff" strokeWidth="1" />
            <text x={x} y="78" textAnchor="middle" fill="rgba(74,158,255,0.6)" fontSize="8">{d}°</text>
          </g>
        );
      })}

      {/* Sidereal (Indian) */}
      <text x="30" y="125" fill="#f0d48a" fontSize="10">Sidereal (Indian): 0° = Fixed Star (Spica - 180°)</text>
      {[0, 30, 60, 90].map((d, i) => {
        const x = 50 + i * 90 + 24; // shifted by ~24° worth
        return (
          <g key={`s-${d}`}>
            <line x1={x} y1="135" x2={x} y2="145" stroke="#f0d48a" strokeWidth="1" />
            <text x={x} y="158" textAnchor="middle" fill="rgba(240,212,138,0.6)" fontSize="8">{d}°</text>
          </g>
        );
      })}

      {/* Ayanamsha arrow */}
      <line x1="50" y1="90" x2="74" y2="90" stroke="#ff6b6b" strokeWidth="1" markerEnd="url(#arrowhead)" />
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="#ff6b6b" />
        </marker>
      </defs>
      <text x="62" y="105" textAnchor="middle" fill="#ff6b6b" fontSize="9">~24°</text>
      <text x="62" y="115" textAnchor="middle" fill="rgba(255,107,107,0.6)" fontSize="7">Ayanamsha</text>
    </svg>
  );
}
