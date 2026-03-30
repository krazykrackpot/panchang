'use client';

import { motion } from 'framer-motion';

interface HouseHighlightChartProps {
  highlightHouses: number[];
  highlightColor?: string;
  size?: number;
  showAllNumbers?: boolean;
  label?: string;
}

// Exact house paths from ChartNorth.tsx (500x500 viewBox)
const HOUSE_PATHS: Record<number, { path: string; cx: number; cy: number }> = {
  1:  { path: 'M 250 25 L 137 138 L 250 250 L 363 138 Z', cx: 250, cy: 130 },
  2:  { path: 'M 25 25 L 137 138 L 250 25 Z', cx: 135, cy: 60 },
  3:  { path: 'M 25 25 L 25 250 L 137 138 Z', cx: 60, cy: 135 },
  4:  { path: 'M 25 250 L 137 138 L 250 250 L 137 363 Z', cx: 130, cy: 250 },
  5:  { path: 'M 25 250 L 137 363 L 25 475 Z', cx: 60, cy: 365 },
  6:  { path: 'M 25 475 L 137 363 L 250 475 Z', cx: 135, cy: 440 },
  7:  { path: 'M 250 475 L 137 363 L 250 250 L 363 363 Z', cx: 250, cy: 370 },
  8:  { path: 'M 250 475 L 363 363 L 475 475 Z', cx: 365, cy: 440 },
  9:  { path: 'M 475 475 L 363 363 L 475 250 Z', cx: 440, cy: 365 },
  10: { path: 'M 475 250 L 363 363 L 250 250 L 363 138 Z', cx: 370, cy: 250 },
  11: { path: 'M 475 250 L 363 138 L 475 25 Z', cx: 440, cy: 135 },
  12: { path: 'M 475 25 L 363 138 L 250 25 Z', cx: 365, cy: 60 },
};

export default function HouseHighlightChart({
  highlightHouses,
  highlightColor = '#d4a853',
  size = 280,
  showAllNumbers = false,
  label,
}: HouseHighlightChartProps) {
  const filterId = `glow-${highlightHouses.join('-')}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
      className="flex flex-col items-center"
    >
      <svg
        viewBox="0 0 500 500"
        style={{ maxWidth: size, width: '100%' }}
        role="img"
        aria-label={label || `North Indian chart highlighting house${highlightHouses.length > 1 ? 's' : ''} ${highlightHouses.join(', ')}`}
      >
        <defs>
          <radialGradient id={`bg-${filterId}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#141940" />
            <stop offset="100%" stopColor="#0a0e27" />
          </radialGradient>
          <linearGradient id={`gold-${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a6d2b" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#8a6d2b" />
          </linearGradient>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="500" height="500" rx="16" fill={`url(#bg-${filterId})`} />

        {/* Outer border */}
        <rect x="22" y="22" width="456" height="456" fill="none" stroke={`url(#gold-${filterId})`} strokeWidth="1.5" />

        {/* Inner diamond */}
        <polygon points="250,25 475,250 250,475 25,250" fill="none" stroke={`url(#gold-${filterId})`} strokeWidth="1" />

        {/* Diagonal lines */}
        <line x1="25" y1="25" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.25" />
        <line x1="475" y1="25" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.25" />
        <line x1="25" y1="475" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.25" />
        <line x1="475" y1="475" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.25" />

        {/* Midpoint lines */}
        <line x1="25" y1="250" x2="475" y2="250" stroke="#d4a853" strokeWidth="0.4" strokeOpacity="0.15" />
        <line x1="250" y1="25" x2="250" y2="475" stroke="#d4a853" strokeWidth="0.4" strokeOpacity="0.15" />

        {/* House regions */}
        {Object.entries(HOUSE_PATHS).map(([num, { path, cx, cy }]) => {
          const houseNum = parseInt(num);
          const isHighlighted = highlightHouses.includes(houseNum);

          return (
            <g key={houseNum}>
              {/* Fill */}
              <path
                d={path}
                fill={isHighlighted ? highlightColor : 'transparent'}
                fillOpacity={isHighlighted ? 0.15 : 0}
                stroke={isHighlighted ? highlightColor : 'none'}
                strokeWidth={isHighlighted ? 1.5 : 0}
                strokeOpacity={isHighlighted ? 0.6 : 0}
                filter={isHighlighted ? `url(#${filterId})` : undefined}
              />

              {/* House number */}
              {(isHighlighted || showAllNumbers) && (
                <text
                  x={cx}
                  y={cy}
                  fill={isHighlighted ? highlightColor : 'rgba(212,168,83,0.25)'}
                  fontSize={isHighlighted ? 32 : 20}
                  fontWeight={isHighlighted ? 800 : 400}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={isHighlighted ? 1 : 0.5}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {houseNum}
                </text>
              )}
            </g>
          );
        })}

        {/* Corner decorations */}
        <circle cx="22" cy="22" r="3" fill="#d4a853" opacity="0.25" />
        <circle cx="478" cy="22" r="3" fill="#d4a853" opacity="0.25" />
        <circle cx="22" cy="478" r="3" fill="#d4a853" opacity="0.25" />
        <circle cx="478" cy="478" r="3" fill="#d4a853" opacity="0.25" />

        {/* Diamond corner dots */}
        <circle cx="250" cy="25" r="2.5" fill="#d4a853" opacity="0.4" />
        <circle cx="475" cy="250" r="2.5" fill="#d4a853" opacity="0.4" />
        <circle cx="250" cy="475" r="2.5" fill="#d4a853" opacity="0.4" />
        <circle cx="25" cy="250" r="2.5" fill="#d4a853" opacity="0.4" />
      </svg>
    </motion.div>
  );
}
