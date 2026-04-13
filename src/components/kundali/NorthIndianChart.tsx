import type { LocaleText } from '@/types/panchang';
'use client';

import { motion } from 'framer-motion';
import { GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';

interface ChartProps {
  houses: Array<{
    number: number;
    sign: number;
    signName: LocaleText;
    signSymbol: string;
    planets: string[];
  }>;
  ascendantSign: number;
  title: string;
  size?: number;
}

// Planet colors by abbreviation
const PLANET_COLORS: Record<string, string> = {
  Su: '#e67e22', Mo: '#ecf0f1', Ma: '#e74c3c', Me: '#2ecc71',
  Ju: '#f39c12', Ve: '#e8e6e3', Sa: '#3498db', Ra: '#8e44ad', Ke: '#95a5a6',
};

export default function NorthIndianChart({ houses, ascendantSign, title, size = 400 }: ChartProps) {
  const s = size;
  const half = s / 2;
  const pad = 2;

  // North Indian diamond chart: outer square with inner diamond creating 12 triangular houses
  // House positions (relative to the center of each house region)
  // Layout: House 1 is always at the top center diamond
  const houseRegions = getHouseRegions(s);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-gold-light text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      <motion.svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="chartBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d1234" />
            <stop offset="100%" stopColor="#111638" />
          </linearGradient>
          <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8a6d2b" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#8a6d2b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect x={pad} y={pad} width={s - pad * 2} height={s - pad * 2} rx="8" fill="url(#chartBg)" stroke="#d4a853" strokeWidth="1.5" strokeOpacity="0.3" />

        {/* Outer square */}
        <rect x={pad + 8} y={pad + 8} width={s - 32} height={s - 32} fill="none" stroke="url(#goldLine)" strokeWidth="1" />

        {/* Inner diamond */}
        <polygon
          points={`${half},${pad + 8} ${s - pad - 8},${half} ${half},${s - pad - 8} ${pad + 8},${half}`}
          fill="none"
          stroke="url(#goldLine)"
          strokeWidth="1"
        />

        {/* Cross lines in diamond */}
        {/* Top-left to center */}
        <line x1={pad + 8} y1={pad + 8} x2={half} y2={half} stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.4" />
        {/* Top-right to center */}
        <line x1={s - pad - 8} y1={pad + 8} x2={half} y2={half} stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.4" />
        {/* Bottom-left to center */}
        <line x1={pad + 8} y1={s - pad - 8} x2={half} y2={half} stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.4" />
        {/* Bottom-right to center */}
        <line x1={s - pad - 8} y1={s - pad - 8} x2={half} y2={half} stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.4" />

        {/* House numbers and sign symbols */}
        {houseRegions.map((region, i) => {
          const house = houses[i];
          if (!house) return null;

          return (
            <g key={i}>
              {/* Sign symbol - small, at corner of house */}
              <text
                x={region.signX}
                y={region.signY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={i === 0 ? '#f0d48a' : 'rgba(212,168,83,0.85)'}
                fontSize="13"
                fontWeight={i === 0 ? '700' : '600'}
              >
                {house.signSymbol}
              </text>

              {/* Ascendant marker in house 1 */}
              {i === 0 && (
                <text
                  x={region.signX}
                  y={region.signY + 13}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#d4a853"
                  fontSize="10"
                  fontWeight="bold"
                  filter="url(#glow)"
                >
                  ASC
                </text>
              )}

              {/* Planet abbreviations */}
              {house.planets.map((abbr, j) => {
                const color = PLANET_COLORS[abbr] || '#e8e6e3';
                const offsetX = (j % 3) * 28 - ((Math.min(house.planets.length, 3) - 1) * 14);
                const offsetY = Math.floor(j / 3) * 16;
                return (
                  <text
                    key={`${i}-${j}`}
                    x={region.centerX + offsetX}
                    y={region.centerY + offsetY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={color}
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {abbr}
                  </text>
                );
              })}
            </g>
          );
        })}
      </motion.svg>
    </div>
  );
}

function getHouseRegions(s: number) {
  const half = s / 2;
  const q1 = s * 0.25 + 5;
  const q3 = s * 0.75 - 5;
  const edge = 20;

  // North Indian chart house layout (from house 1 at top-center going clockwise):
  // House 1: top diamond (center-top)
  // House 2: top-left triangle
  // House 3: left-top triangle
  // House 4: left diamond (center-left)
  // House 5: left-bottom triangle
  // House 6: bottom-left triangle
  // House 7: bottom diamond (center-bottom)
  // House 8: bottom-right triangle
  // House 9: right-bottom triangle
  // House 10: right diamond (center-right)
  // House 11: right-top triangle
  // House 12: top-right triangle

  return [
    // House 1 - top center diamond
    { centerX: half, centerY: half * 0.5, signX: half, signY: edge + 10 },
    // House 2 - top-left triangle
    { centerX: half * 0.5, centerY: half * 0.5, signX: edge + 12, signY: edge + 10 },
    // House 3 - left-top triangle
    { centerX: half * 0.5, centerY: half * 0.5 + half * 0.25, signX: edge + 12, signY: half - 15 },
    // House 4 - left center diamond
    { centerX: half * 0.5, centerY: half, signX: edge + 12, signY: half + 5 },
    // House 5 - left-bottom triangle
    { centerX: half * 0.5, centerY: half + half * 0.25, signX: edge + 12, signY: half + 20 },
    // House 6 - bottom-left triangle
    { centerX: half * 0.5, centerY: half * 1.5, signX: edge + 12, signY: s - edge - 10 },
    // House 7 - bottom center diamond
    { centerX: half, centerY: half * 1.5, signX: half, signY: s - edge - 10 },
    // House 8 - bottom-right triangle
    { centerX: half * 1.5, centerY: half * 1.5, signX: s - edge - 12, signY: s - edge - 10 },
    // House 9 - right-bottom triangle
    { centerX: half * 1.5, centerY: half + half * 0.25, signX: s - edge - 12, signY: half + 20 },
    // House 10 - right center diamond
    { centerX: half * 1.5, centerY: half, signX: s - edge - 12, signY: half + 5 },
    // House 11 - right-top triangle
    { centerX: half * 1.5, centerY: half * 0.5 + half * 0.25, signX: s - edge - 12, signY: half - 15 },
    // House 12 - top-right triangle
    { centerX: half * 1.5, centerY: half * 0.5, signX: s - edge - 12, signY: edge + 10 },
  ];
}
