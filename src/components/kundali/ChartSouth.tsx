'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import type { ChartData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

interface ChartSouthProps {
  data: ChartData;
  title: string;
  size?: number;
  selectedHouse?: number | null;
  onSelectHouse?: (house: number) => void;
}

// South Indian chart: 4x4 outer ring with fixed sign positions
const GRID_CELLS: { col: number; row: number; sign: number }[] = [
  { col: 0, row: 0, sign: 12 },
  { col: 1, row: 0, sign: 1 },
  { col: 2, row: 0, sign: 2 },
  { col: 3, row: 0, sign: 3 },
  { col: 3, row: 1, sign: 4 },
  { col: 3, row: 2, sign: 5 },
  { col: 3, row: 3, sign: 6 },
  { col: 2, row: 3, sign: 7 },
  { col: 1, row: 3, sign: 8 },
  { col: 0, row: 3, sign: 9 },
  { col: 0, row: 2, sign: 10 },
  { col: 0, row: 1, sign: 11 },
];

const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

export default function ChartSouth({ data, title, size = 500, selectedHouse, onSelectHouse }: ChartSouthProps) {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const cell = 115;
  const pad = 15;

  const getGrahaName = (planetId: number): string => {
    const graha = GRAHAS[planetId];
    if (!graha) return '';
    return graha.name[locale];
  };

  const signToHouse = (sign: number): number => {
    return ((sign - data.ascendantSign + 12) % 12) + 1;
  };

  const getPlanetsInSign = (sign: number): number[] => {
    const house = signToHouse(sign);
    return data.houses[house - 1] || [];
  };

  const totalW = pad * 2 + cell * 4;

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-gold-light text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      <motion.svg
        viewBox={`0 0 ${totalW} ${totalW}`}
        width={size}
        height={size}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="drop-shadow-2xl w-full max-w-[500px]"
      >
        <defs>
          <radialGradient id="southBg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#141940" />
            <stop offset="100%" stopColor="#0a0e27" />
          </radialGradient>
          <linearGradient id="southGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a6d2b" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#8a6d2b" />
          </linearGradient>
          <filter id="sglowF">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width={totalW} height={totalW} rx="16" fill="url(#southBg)" />

        {/* Outer border */}
        <rect x={pad} y={pad} width={totalW - pad * 2} height={totalW - pad * 2} fill="none" stroke="url(#southGold)" strokeWidth="1.5" rx="4" />

        {/* Grid lines */}
        {[1, 2, 3].map(i => (
          <g key={`grid-${i}`}>
            <line x1={pad + i * cell} y1={pad} x2={pad + i * cell} y2={totalW - pad} stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.3" />
            <line x1={pad} y1={pad + i * cell} x2={totalW - pad} y2={pad + i * cell} stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.3" />
          </g>
        ))}

        {/* Center area */}
        <rect x={pad + cell} y={pad + cell} width={cell * 2} height={cell * 2} fill="rgba(212,168,83,0.02)" stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
        <text x={totalW / 2} y={totalW / 2 - 8} fill="rgba(212,168,83,0.18)" fontSize="13" textAnchor="middle" fontFamily="var(--font-heading)" letterSpacing="2">
          {isDevanagari ? 'कुण्डली' : 'KUNDALI'}
        </text>
        <text x={totalW / 2} y={totalW / 2 + 10} fill="rgba(212,168,83,0.12)" fontSize="10" textAnchor="middle">
          {isDevanagari ? 'दक्षिण शैली' : 'South Indian'}
        </text>

        {/* Sign cells */}
        {GRID_CELLS.map(({ col, row, sign }) => {
          const px = pad + col * cell;
          const py = pad + row * cell;
          const planetsInSign = getPlanetsInSign(sign);
          const rashi = RASHIS[sign - 1];
          const isAscendant = sign === data.ascendantSign;
          const house = signToHouse(sign);
          const isSelected = selectedHouse === house;

          return (
            <g
              key={sign}
              onClick={() => onSelectHouse?.(house)}
              style={{ cursor: onSelectHouse ? 'pointer' : 'default' }}
            >
              {/* Cell background */}
              <rect
                x={px}
                y={py}
                width={cell}
                height={cell}
                fill={isSelected
                  ? 'rgba(212,168,83,0.12)'
                  : isAscendant
                  ? 'rgba(212,168,83,0.08)'
                  : planetsInSign.length > 0
                  ? 'rgba(212,168,83,0.02)'
                  : 'transparent'}
                stroke={isSelected ? 'rgba(212,168,83,0.4)' : 'none'}
                strokeWidth={isSelected ? '1.5' : '0'}
                className="transition-all duration-200 hover:fill-[rgba(212,168,83,0.06)]"
              />

              {/* Sign name - larger, more visible */}
              <text
                x={px + 10}
                y={py + 18}
                fill={isAscendant ? '#f0d48a' : 'rgba(212,168,83,0.7)'}
                fontSize={isAscendant ? '13' : '11'}
                fontWeight={isAscendant ? '700' : '500'}
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                {rashi?.name[locale]}
              </text>

              {/* House number */}
              <text
                x={px + cell - 10}
                y={py + 16}
                fill="rgba(212,168,83,0.25)"
                fontSize="9"
                textAnchor="end"
                dominantBaseline="middle"
              >
                {house}
              </text>

              {/* Ascendant diagonal marker */}
              {isAscendant && (
                <>
                  <line x1={px} y1={py} x2={px + 22} y2={py + 22} stroke="#f0d48a" strokeWidth="2" />
                  <text x={px + 26} y={py + 20} fill="#f0d48a" fontSize="9" fontWeight="bold">
                    {isDevanagari ? 'लग्न' : 'ASC'}
                  </text>
                </>
              )}

              {/* Planets - much larger, full names */}
              {planetsInSign.map((planetId, pIdx) => {
                const color = PLANET_COLORS[planetId] || '#e8e6e3';
                const count = planetsInSign.length;
                const cols = Math.min(count, 2);
                const colIdx = pIdx % cols;
                const rowIdx = Math.floor(pIdx / cols);
                const startX = px + 14 + colIdx * (cell / 2 - 6);
                const startY = py + 42 + rowIdx * 22;
                const name = getGrahaName(planetId);

                return (
                  <g key={planetId}>
                    {/* Glow */}
                    <circle cx={startX + 20} cy={startY - 2} r="12" fill={color} opacity="0.08" />
                    {/* Planet name */}
                    <text
                      x={startX + 20}
                      y={startY}
                      fill={color}
                      fontSize="14"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      filter="url(#sglowF)"
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : { fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Corner decorations */}
        <circle cx={pad} cy={pad} r="3" fill="#d4a853" opacity="0.4" />
        <circle cx={totalW - pad} cy={pad} r="3" fill="#d4a853" opacity="0.4" />
        <circle cx={pad} cy={totalW - pad} r="3" fill="#d4a853" opacity="0.4" />
        <circle cx={totalW - pad} cy={totalW - pad} r="3" fill="#d4a853" opacity="0.4" />
      </motion.svg>
    </div>
  );
}
