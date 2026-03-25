'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import type { ChartData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

interface ChartNorthProps {
  data: ChartData;
  title: string;
  size?: number;
  selectedHouse?: number | null;
  onSelectHouse?: (house: number) => void;
}

// North Indian diamond chart — 12 house regions (scaled to 500x500)
const HOUSE_PATHS: Record<number, { path: string; cx: number; cy: number; signX: number; signY: number }> = {
  1:  { path: 'M 250 25 L 137 138 L 250 250 L 363 138 Z', cx: 250, cy: 130, signX: 250, signY: 60 },
  2:  { path: 'M 25 25 L 137 138 L 250 25 Z', cx: 135, cy: 60, signX: 88, signY: 38 },
  3:  { path: 'M 25 25 L 25 250 L 137 138 Z', cx: 60, cy: 135, signX: 38, signY: 88 },
  4:  { path: 'M 25 250 L 137 138 L 250 250 L 137 363 Z', cx: 130, cy: 250, signX: 60, signY: 250 },
  5:  { path: 'M 25 250 L 137 363 L 25 475 Z', cx: 60, cy: 365, signX: 38, signY: 412 },
  6:  { path: 'M 25 475 L 137 363 L 250 475 Z', cx: 135, cy: 440, signX: 88, signY: 462 },
  7:  { path: 'M 250 475 L 137 363 L 250 250 L 363 363 Z', cx: 250, cy: 370, signX: 250, signY: 440 },
  8:  { path: 'M 250 475 L 363 363 L 475 475 Z', cx: 365, cy: 440, signX: 412, signY: 462 },
  9:  { path: 'M 475 475 L 363 363 L 475 250 Z', cx: 440, cy: 365, signX: 462, signY: 412 },
  10: { path: 'M 475 250 L 363 363 L 250 250 L 363 138 Z', cx: 370, cy: 250, signX: 440, signY: 250 },
  11: { path: 'M 475 250 L 363 138 L 475 25 Z', cx: 440, cy: 135, signX: 462, signY: 88 },
  12: { path: 'M 475 25 L 363 138 L 250 25 Z', cx: 365, cy: 60, signX: 412, signY: 38 },
};

const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

export default function ChartNorth({ data, title, size = 500, selectedHouse, onSelectHouse }: ChartNorthProps) {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';

  const getGrahaName = (planetId: number): string => {
    const graha = GRAHAS[planetId];
    if (!graha) return '';
    return graha.name[locale];
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-gold-light text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      <motion.svg
        viewBox="0 0 500 500"
        width={size}
        height={size}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="drop-shadow-2xl w-full max-w-[500px]"
      >
        <defs>
          <radialGradient id="northBg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#141940" />
            <stop offset="100%" stopColor="#0a0e27" />
          </radialGradient>
          <linearGradient id="northGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a6d2b" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#8a6d2b" />
          </linearGradient>
          <radialGradient id="ascGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(212,168,83,0.15)" />
            <stop offset="100%" stopColor="rgba(212,168,83,0)" />
          </radialGradient>
          <filter id="planetGlowN">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="selectedGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="500" height="500" rx="16" fill="url(#northBg)" />

        {/* Outer border */}
        <rect x="22" y="22" width="456" height="456" fill="none" stroke="url(#northGold)" strokeWidth="1.5" />

        {/* Inner diamond */}
        <polygon points="250,25 475,250 250,475 25,250" fill="none" stroke="url(#northGold)" strokeWidth="1" />

        {/* Diagonal lines */}
        <line x1="25" y1="25" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.35" />
        <line x1="475" y1="25" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.35" />
        <line x1="25" y1="475" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.35" />
        <line x1="475" y1="475" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.35" />

        {/* Midpoint lines */}
        <line x1="25" y1="250" x2="475" y2="250" stroke="#d4a853" strokeWidth="0.4" strokeOpacity="0.2" />
        <line x1="250" y1="25" x2="250" y2="475" stroke="#d4a853" strokeWidth="0.4" strokeOpacity="0.2" />

        {/* Ascendant glow on House 1 */}
        <path d={HOUSE_PATHS[1].path} fill="url(#ascGlow)" stroke="none" />

        {/* House sections with planets */}
        {Object.entries(HOUSE_PATHS).map(([houseNum, { path, cx, cy, signX, signY }]) => {
          const hIdx = parseInt(houseNum) - 1;
          const planetsInHouse = data.houses[hIdx] || [];
          const isAsc = parseInt(houseNum) === 1;
          const signNum = ((data.ascendantSign - 1 + hIdx) % 12) + 1;
          const rashi = RASHIS[signNum - 1];
          const isSelected = selectedHouse === parseInt(houseNum);

          return (
            <g
              key={houseNum}
              onClick={() => onSelectHouse?.(parseInt(houseNum))}
              style={{ cursor: onSelectHouse ? 'pointer' : 'default' }}
            >
              {/* Clickable hover region */}
              <path
                d={path}
                fill={isSelected
                  ? 'rgba(212,168,83,0.12)'
                  : planetsInHouse.length > 0
                  ? 'rgba(212,168,83,0.03)'
                  : 'transparent'}
                stroke={isSelected ? 'rgba(212,168,83,0.4)' : 'none'}
                strokeWidth={isSelected ? '1.5' : '0'}
                className="transition-all duration-200 hover:fill-[rgba(212,168,83,0.08)]"
              />

              {/* Sign name + symbol */}
              <text
                x={signX}
                y={signY}
                fill={isAsc ? '#f0d48a' : 'rgba(212,168,83,0.65)'}
                fontSize={isAsc ? '13' : '11'}
                fontWeight={isAsc ? '700' : '500'}
                textAnchor="middle"
                dominantBaseline="middle"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                {rashi?.name[locale]}
              </text>

              {/* House number in corner */}
              <text
                x={signX}
                y={signY + (isAsc || parseInt(houseNum) === 7 ? 14 : parseInt(houseNum) <= 3 || parseInt(houseNum) >= 10 ? 13 : -13)}
                fill="rgba(212,168,83,0.25)"
                fontSize="9"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {houseNum}
              </text>

              {/* Planets - larger, with full names */}
              {planetsInHouse.map((planetId, pIdx) => {
                const color = PLANET_COLORS[planetId] || '#e8e6e3';
                const count = planetsInHouse.length;
                const cols = count <= 2 ? count : Math.min(count, 3);
                const col = pIdx % cols;
                const row = Math.floor(pIdx / cols);
                const spacing = count <= 2 ? 40 : 32;
                const offsetX = (col - (cols - 1) / 2) * spacing;
                const offsetY = row * 20 - (count > cols ? 8 : 0);
                const name = getGrahaName(planetId);

                return (
                  <g key={planetId}>
                    {/* Glow circle behind planet */}
                    <circle
                      cx={cx + offsetX}
                      cy={cy + offsetY}
                      r="14"
                      fill={color}
                      opacity="0.1"
                    />
                    {/* Planet name */}
                    <text
                      x={cx + offsetX}
                      y={cy + offsetY}
                      fill={color}
                      fontSize="14"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      filter="url(#planetGlowN)"
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

        {/* Ascendant label */}
        <text x="250" y="16" fill="#f0d48a" fontSize="11" textAnchor="middle" fontWeight="bold" letterSpacing="1.5">
          {isDevanagari ? 'लग्न' : 'ASC'}
        </text>

        {/* Corner decorations */}
        <circle cx="22" cy="22" r="3.5" fill="#d4a853" opacity="0.35" />
        <circle cx="478" cy="22" r="3.5" fill="#d4a853" opacity="0.35" />
        <circle cx="22" cy="478" r="3.5" fill="#d4a853" opacity="0.35" />
        <circle cx="478" cy="478" r="3.5" fill="#d4a853" opacity="0.35" />

        {/* Diamond corner dots */}
        <circle cx="250" cy="25" r="3" fill="#d4a853" opacity="0.6" />
        <circle cx="475" cy="250" r="3" fill="#d4a853" opacity="0.6" />
        <circle cx="250" cy="475" r="3" fill="#d4a853" opacity="0.6" />
        <circle cx="25" cy="250" r="3" fill="#d4a853" opacity="0.6" />
      </motion.svg>
    </div>
  );
}
