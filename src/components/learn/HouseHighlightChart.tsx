'use client';

import { motion } from 'framer-motion';

interface HouseHighlightChartProps {
  highlightHouses: number[];
  highlightColor?: string;
  size?: number;
  showAllNumbers?: boolean;
  label?: string;
}

// House paths matching ChartNorth (500x500 viewBox, 30px inset)
const HOUSE_PATHS: Record<number, { path: string; cx: number; cy: number }> = {
  1:  { path: 'M 250 30 L 140 140 L 250 250 L 360 140 Z', cx: 250, cy: 132 },
  2:  { path: 'M 30 30 L 140 140 L 250 30 Z', cx: 138, cy: 62 },
  3:  { path: 'M 30 30 L 30 250 L 140 140 Z', cx: 62, cy: 138 },
  4:  { path: 'M 30 250 L 140 140 L 250 250 L 140 360 Z', cx: 132, cy: 250 },
  5:  { path: 'M 30 250 L 140 360 L 30 470 Z', cx: 62, cy: 362 },
  6:  { path: 'M 30 470 L 140 360 L 250 470 Z', cx: 138, cy: 438 },
  7:  { path: 'M 250 470 L 140 360 L 250 250 L 360 360 Z', cx: 250, cy: 368 },
  8:  { path: 'M 250 470 L 360 360 L 470 470 Z', cx: 362, cy: 438 },
  9:  { path: 'M 470 470 L 360 360 L 470 250 Z', cx: 438, cy: 362 },
  10: { path: 'M 470 250 L 360 360 L 250 250 L 360 140 Z', cx: 368, cy: 250 },
  11: { path: 'M 470 250 L 360 140 L 470 30 Z', cx: 438, cy: 138 },
  12: { path: 'M 470 30 L 360 140 L 250 30 Z', cx: 362, cy: 62 },
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
        <rect x="0" y="0" width="500" height="500" rx="12" fill={`url(#bg-${filterId})`} />

        {/* Double border */}
        <rect x="18" y="18" width="464" height="464" fill="none" stroke={`url(#gold-${filterId})`} strokeWidth="2" rx="6" />
        <rect x="24" y="24" width="452" height="452" fill="none" stroke={`url(#gold-${filterId})`} strokeWidth="0.5" opacity="0.4" rx="4" />

        {/* Inner diamond */}
        <polygon points="250,30 470,250 250,470 30,250" fill="none" stroke={`url(#gold-${filterId})`} strokeWidth="1.5" />

        {/* Diagonal lines */}
        <line x1="30" y1="30" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.8" strokeOpacity="0.25" />
        <line x1="470" y1="30" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.8" strokeOpacity="0.25" />
        <line x1="30" y1="470" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.8" strokeOpacity="0.25" />
        <line x1="470" y1="470" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.8" strokeOpacity="0.25" />

        {/* Cross lines */}
        <line x1="30" y1="250" x2="470" y2="250" stroke="#d4a853" strokeWidth="0.3" strokeOpacity="0.18" />
        <line x1="250" y1="30" x2="250" y2="470" stroke="#d4a853" strokeWidth="0.3" strokeOpacity="0.18" />

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

        {/* Corner ornaments */}
        <g opacity="0.4">
          <line x1="18" y1="30" x2="18" y2="18" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="18" y1="18" x2="30" y2="18" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="470" y1="18" x2="482" y2="18" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="482" y1="18" x2="482" y2="30" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="18" y1="470" x2="18" y2="482" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="18" y1="482" x2="30" y2="482" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="470" y1="482" x2="482" y2="482" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="482" y1="482" x2="482" y2="470" stroke="#d4a853" strokeWidth="1.5" />
        </g>

        {/* Diamond points */}
        <circle cx="250" cy="30" r="2.5" fill="#d4a853" opacity="0.5" />
        <circle cx="470" cy="250" r="2.5" fill="#d4a853" opacity="0.5" />
        <circle cx="250" cy="470" r="2.5" fill="#d4a853" opacity="0.5" />
        <circle cx="30" cy="250" r="2.5" fill="#d4a853" opacity="0.5" />
      </svg>
    </motion.div>
  );
}
