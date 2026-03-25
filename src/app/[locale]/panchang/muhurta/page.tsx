'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import MuhurtaCard from '@/components/muhurta/MuhurtaCard';
import ConflictSection from '@/components/muhurta/ConflictSection';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { MuhurtaIcon } from '@/components/icons/PanchangIcons';

const MUHURTAS: { number: number; name: { en: string; hi: string; sa: string }; nature: 'auspicious' | 'inauspicious' | 'neutral' }[] = [
  { number: 1, name: { en: 'Rudra', hi: 'रुद्र', sa: 'रुद्रः' }, nature: 'inauspicious' },
  { number: 2, name: { en: 'Ahi', hi: 'अहि', sa: 'अहिः' }, nature: 'inauspicious' },
  { number: 3, name: { en: 'Mitra', hi: 'मित्र', sa: 'मित्रः' }, nature: 'auspicious' },
  { number: 4, name: { en: 'Pitru', hi: 'पितृ', sa: 'पितृः' }, nature: 'inauspicious' },
  { number: 5, name: { en: 'Vasu', hi: 'वसु', sa: 'वसुः' }, nature: 'auspicious' },
  { number: 6, name: { en: 'Vara', hi: 'वाराह', sa: 'वाराहः' }, nature: 'auspicious' },
  { number: 7, name: { en: 'Vishvedeva', hi: 'विश्वदेव', sa: 'विश्वदेवः' }, nature: 'auspicious' },
  { number: 8, name: { en: 'Vidhi', hi: 'विधि', sa: 'विधिः' }, nature: 'auspicious' },
  { number: 9, name: { en: 'Satamukhi', hi: 'शतमुखी', sa: 'शतमुखी' }, nature: 'auspicious' },
  { number: 10, name: { en: 'Puruhuta', hi: 'पुरुहूत', sa: 'पुरुहूतः' }, nature: 'auspicious' },
  { number: 11, name: { en: 'Vahini', hi: 'वाहिनी', sa: 'वाहिनी' }, nature: 'inauspicious' },
  { number: 12, name: { en: 'Naktanakara', hi: 'नक्तनकर', sa: 'नक्तनकरः' }, nature: 'inauspicious' },
  { number: 13, name: { en: 'Varuna', hi: 'वरुण', sa: 'वरुणः' }, nature: 'auspicious' },
  { number: 14, name: { en: 'Aryaman', hi: 'अर्यमन्', sa: 'अर्यमा' }, nature: 'auspicious' },
  { number: 15, name: { en: 'Bhaga', hi: 'भग', sa: 'भगः' }, nature: 'auspicious' },
  { number: 16, name: { en: 'Girisha', hi: 'गिरीश', sa: 'गिरीशः' }, nature: 'inauspicious' },
  { number: 17, name: { en: 'Ajapada', hi: 'अजपाद', sa: 'अजपादः' }, nature: 'inauspicious' },
  { number: 18, name: { en: 'Ahir-Budhnya', hi: 'अहिर्बुध्न्य', sa: 'अहिर्बुध्न्यः' }, nature: 'auspicious' },
  { number: 19, name: { en: 'Pusha', hi: 'पूषा', sa: 'पूषा' }, nature: 'auspicious' },
  { number: 20, name: { en: 'Ashvini', hi: 'अश्विनी', sa: 'अश्विनौ' }, nature: 'auspicious' },
  { number: 21, name: { en: 'Yama', hi: 'यम', sa: 'यमः' }, nature: 'inauspicious' },
  { number: 22, name: { en: 'Agni', hi: 'अग्नि', sa: 'अग्निः' }, nature: 'auspicious' },
  { number: 23, name: { en: 'Vidhaatru', hi: 'विधातृ', sa: 'विधातृः' }, nature: 'auspicious' },
  { number: 24, name: { en: 'Kanda', hi: 'कण्ड', sa: 'कण्डः' }, nature: 'auspicious' },
  { number: 25, name: { en: 'Aditi', hi: 'अदिति', sa: 'अदितिः' }, nature: 'auspicious' },
  { number: 26, name: { en: 'Jiva', hi: 'जीव', sa: 'जीवः' }, nature: 'auspicious' },
  { number: 27, name: { en: 'Vishnu', hi: 'विष्णु', sa: 'विष्णुः' }, nature: 'auspicious' },
  { number: 28, name: { en: 'Dyumadgadyuti', hi: 'द्युमद्गद्युति', sa: 'द्युमद्गद्युतिः' }, nature: 'auspicious' },
  { number: 29, name: { en: 'Brahma', hi: 'ब्रह्मा', sa: 'ब्रह्मा' }, nature: 'auspicious' },
  { number: 30, name: { en: 'Samudram', hi: 'समुद्रम्', sa: 'समुद्रम्' }, nature: 'auspicious' },
];

/* ------------------------------------------------------------------ */
/*  Animated Muhurta Wheel                                            */
/* ------------------------------------------------------------------ */
function AnimatedMuhurtaWheel({
  locale,
  selectedMuhurta,
  onSelect,
}: {
  locale: Locale;
  selectedMuhurta: number | null;
  onSelect: (n: number) => void;
}) {
  const [hoveredSector, setHoveredSector] = useState<number | null>(null);

  const CX = 250;
  const CY = 250;
  const INNER_R = 140;
  const OUTER_R = 220;
  const SECTOR_ANGLE = 360 / 30; // 12 degrees per muhurta

  /** Build an SVG arc-sector path for a given muhurta index. */
  function sectorPath(index: number, innerR: number, outerR: number) {
    const startDeg = index * SECTOR_ANGLE - 90; // -90 so 0 starts at top
    const endDeg = startDeg + SECTOR_ANGLE;
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;

    const x1o = CX + outerR * Math.cos(startRad);
    const y1o = CY + outerR * Math.sin(startRad);
    const x2o = CX + outerR * Math.cos(endRad);
    const y2o = CY + outerR * Math.sin(endRad);
    const x1i = CX + innerR * Math.cos(endRad);
    const y1i = CY + innerR * Math.sin(endRad);
    const x2i = CX + innerR * Math.cos(startRad);
    const y2i = CY + innerR * Math.sin(startRad);

    return [
      `M ${x1o} ${y1o}`,
      `A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o}`,
      `L ${x1i} ${y1i}`,
      `A ${innerR} ${innerR} 0 0 0 ${x2i} ${y2i}`,
      'Z',
    ].join(' ');
  }

  /** Midpoint angle for placing labels / dots. */
  function midAngle(index: number) {
    return ((index * SECTOR_ANGLE + SECTOR_ANGLE / 2) - 90) * (Math.PI / 180);
  }

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return '#4ade80';
    if (nature === 'inauspicious') return '#f87171';
    return '#fbbf24';
  };

  const concentricrRings = [100, 130, 160, 190, 220];

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="w-full max-w-lg cursor-pointer"
      initial={{ opacity: 0, rotate: -60 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <defs>
        {/* Golden glow for daytime half */}
        <radialGradient id="dayGlow" cx="50%" cy="25%" r="55%">
          <stop offset="0%" stopColor="#f0d48a" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#d4a853" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
        </radialGradient>
        {/* Dark blue glow for nighttime half */}
        <radialGradient id="nightGlow" cx="50%" cy="75%" r="55%">
          <stop offset="0%" stopColor="#4a4ac0" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#2a2a6e" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#1a1a4e" stopOpacity="0" />
        </radialGradient>
        {/* Sun glow filter */}
        <filter id="sunGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Selection glow */}
        <filter id="selectGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background halves */}
      {/* Daytime half (top: indices 0-14, angles -90 to +90) */}
      <path
        d={`M ${CX + OUTER_R + 10} ${CY} A ${OUTER_R + 10} ${OUTER_R + 10} 0 0 0 ${CX - OUTER_R - 10} ${CY} Z`}
        fill="url(#dayGlow)"
      />
      {/* Nighttime half (bottom: indices 15-29, angles +90 to +270) */}
      <path
        d={`M ${CX - OUTER_R - 10} ${CY} A ${OUTER_R + 10} ${OUTER_R + 10} 0 0 0 ${CX + OUTER_R + 10} ${CY} Z`}
        fill="url(#nightGlow)"
      />

      {/* Animated concentric rings */}
      {concentricrRings.map((r, i) => (
        <motion.circle
          key={`ring-${r}`}
          cx={CX}
          cy={CY}
          fill="none"
          stroke="rgba(212,168,83,0.12)"
          strokeWidth="0.5"
          initial={{ r: 0 }}
          animate={{ r }}
          transition={{ duration: 1.0, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
        />
      ))}

      {/* 30 Muhurta sectors */}
      {MUHURTAS.map((m, i) => {
        const isHovered = hoveredSector === i;
        const isSelected = selectedMuhurta === m.number;
        const expandedOuter = isHovered ? OUTER_R + 12 : OUTER_R;
        const expandedInner = isHovered ? INNER_R - 4 : INNER_R;
        const isDaytime = i < 15;

        // Nature dot position
        const mAngle = midAngle(i);
        const dotR = (INNER_R + OUTER_R) / 2;
        const dotX = CX + dotR * Math.cos(mAngle);
        const dotY = CY + dotR * Math.sin(mAngle);

        // Label position (just outside outer ring on hover)
        const labelR = OUTER_R + 28;
        const labelX = CX + labelR * Math.cos(mAngle);
        const labelY = CY + labelR * Math.sin(mAngle);
        const labelRotation = (i * SECTOR_ANGLE);

        return (
          <g
            key={m.number}
            onMouseEnter={() => setHoveredSector(i)}
            onMouseLeave={() => setHoveredSector(null)}
            onClick={() => onSelect(m.number)}
            style={{ cursor: 'pointer' }}
          >
            {/* Sector wedge */}
            <motion.path
              d={sectorPath(i, expandedInner, expandedOuter)}
              fill={
                isSelected
                  ? isDaytime
                    ? 'rgba(240,212,138,0.22)'
                    : 'rgba(100,100,200,0.22)'
                  : isHovered
                  ? isDaytime
                    ? 'rgba(240,212,138,0.14)'
                    : 'rgba(100,100,200,0.14)'
                  : 'rgba(255,255,255,0.02)'
              }
              stroke={
                isSelected
                  ? '#f0d48a'
                  : isDaytime
                  ? 'rgba(212,168,83,0.25)'
                  : 'rgba(100,100,180,0.2)'
              }
              strokeWidth={isSelected ? 1.5 : 0.5}
              filter={isSelected ? 'url(#selectGlow)' : undefined}
              animate={{
                d: sectorPath(i, expandedInner, expandedOuter),
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />

            {/* Sector tick marks */}
            {(() => {
              const tickAngle = (i * SECTOR_ANGLE - 90) * (Math.PI / 180);
              const x1 = CX + INNER_R * Math.cos(tickAngle);
              const y1 = CY + INNER_R * Math.sin(tickAngle);
              const x2 = CX + OUTER_R * Math.cos(tickAngle);
              const y2 = CY + OUTER_R * Math.sin(tickAngle);
              return (
                <motion.line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(212,168,83,0.2)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.04 }}
                />
              );
            })()}

            {/* Nature-coded dot */}
            <motion.circle
              cx={dotX}
              cy={dotY}
              r={isHovered || isSelected ? 5 : 3}
              fill={natureColor(m.nature)}
              opacity={isHovered || isSelected ? 1 : 0.7}
              initial={{ r: 0 }}
              animate={{ r: isHovered || isSelected ? 5 : 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            />

            {/* Number label inside the sector */}
            <text
              x={dotX}
              y={dotY}
              fill={isHovered || isSelected ? '#fff' : 'rgba(255,255,255,0.55)'}
              fontSize={isHovered || isSelected ? '8' : '6'}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ pointerEvents: 'none', fontWeight: isSelected ? 700 : 400 }}
            >
              {m.number}
            </text>

            {/* Muhurta name tooltip on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.text
                  x={labelX}
                  y={labelY}
                  fill="#f0d48a"
                  fontSize="7"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${labelRotation}, ${labelX}, ${labelY})`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  style={{ pointerEvents: 'none' }}
                >
                  {m.name[locale]}
                </motion.text>
              )}
            </AnimatePresence>
          </g>
        );
      })}

      {/* Orbiting sun indicator -- golden dot circling the top (daytime) half */}
      <motion.circle
        cx={CX}
        cy={CY - (INNER_R + OUTER_R) / 2}
        r="6"
        fill="#f5c842"
        filter="url(#sunGlow)"
        animate={{
          rotate: [0, 180],
        }}
        transition={{
          duration: 15,
          ease: 'linear',
          repeat: Infinity,
        }}
        style={{ originX: `${CX}px`, originY: `${CY}px`, transformBox: 'fill-box' }}
      />
      {/* Use a group-level transform for the orbiting sun so it properly rotates around the center */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        <circle
          cx={CX}
          cy={CY - (INNER_R + OUTER_R) / 2}
          r="5"
          fill="#f5c842"
          filter="url(#sunGlow)"
          opacity="0.9"
        />
        {/* Sun rays */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rayLen = 4;
          const baseR = 8;
          const angleSun = CY - (INNER_R + OUTER_R) / 2;
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={CX + baseR * Math.cos(rad)}
              y1={angleSun + baseR * Math.sin(rad)}
              x2={CX + (baseR + rayLen) * Math.cos(rad)}
              y2={angleSun + (baseR + rayLen) * Math.sin(rad)}
              stroke="#f5c842"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}
      </motion.g>

      {/* Center labels */}
      <text x={CX} y={CY - 20} fill="#f0d48a" fontSize="13" textAnchor="middle" fontFamily="var(--font-heading)" opacity="0.9">
        {locale === 'en' ? 'DAYTIME' : locale === 'hi' ? 'दिवा' : 'दिवा'}
      </text>
      <text x={CX} y={CY - 5} fill="rgba(212,168,83,0.5)" fontSize="9" textAnchor="middle">
        {locale === 'en' ? '15 Muhurtas' : '15 मुहूर्त'}
      </text>
      <text x={CX} y={CY + 18} fill="#8a8adf" fontSize="13" textAnchor="middle" fontFamily="var(--font-heading)" opacity="0.9">
        {locale === 'en' ? 'NIGHTTIME' : locale === 'hi' ? 'रात्रि' : 'रात्रिः'}
      </text>
      <text x={CX} y={CY + 33} fill="rgba(138,138,223,0.5)" fontSize="9" textAnchor="middle">
        {locale === 'en' ? '15 Muhurtas' : '15 मुहूर्त'}
      </text>

      {/* Sunrise / Sunset markers */}
      <motion.text
        x={CX + OUTER_R + 24} y={CY + 4}
        fill="#f0d48a" fontSize="8" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
      >
        {locale === 'en' ? 'Sunrise' : 'सूर्योदय'}
      </motion.text>
      <motion.text
        x={CX - OUTER_R - 24} y={CY + 4}
        fill="#8a6d2b" fontSize="8" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
      >
        {locale === 'en' ? 'Sunset' : 'सूर्यास्त'}
      </motion.text>
    </motion.svg>
  );
}


/* ------------------------------------------------------------------ */
/*  Animated Sunrise-Sunset Timeline Diagram                          */
/* ------------------------------------------------------------------ */
function AnimatedSunriseSunsetDiagram({
  locale,
  selectedMuhurta,
  onSelect,
}: {
  locale: Locale;
  selectedMuhurta: number | null;
  onSelect: (n: number) => void;
}) {
  const totalW = 900;
  const barH = 48;
  const topY = 50;
  const segW = totalW / 30;

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return '#4ade80';
    if (nature === 'inauspicious') return '#f87171';
    return '#fbbf24';
  };

  const natureBg = (nature: string, isDaytime: boolean) => {
    if (nature === 'auspicious') return isDaytime ? 'rgba(74,222,128,0.12)' : 'rgba(74,222,128,0.08)';
    if (nature === 'inauspicious') return isDaytime ? 'rgba(248,113,113,0.12)' : 'rgba(248,113,113,0.08)';
    return isDaytime ? 'rgba(251,191,36,0.12)' : 'rgba(251,191,36,0.08)';
  };

  return (
    <div className="overflow-x-auto pb-4">
      <motion.svg
        viewBox={`0 0 ${totalW} 160`}
        className="min-w-[700px] w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <defs>
          <linearGradient id="dayBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(240,212,138,0.08)" />
            <stop offset="100%" stopColor="rgba(240,212,138,0.02)" />
          </linearGradient>
          <linearGradient id="nightBg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(80,80,180,0.08)" />
            <stop offset="100%" stopColor="rgba(80,80,180,0.02)" />
          </linearGradient>
        </defs>

        {/* Background bands */}
        <rect x="0" y={topY} width={segW * 15} height={barH} fill="url(#dayBg)" rx="4" />
        <rect x={segW * 15} y={topY} width={segW * 15} height={barH} fill="url(#nightBg)" rx="4" />

        {/* Individual segment bars */}
        {MUHURTAS.map((m, i) => {
          const isDaytime = i < 15;
          const isSelected = selectedMuhurta === m.number;
          const x = i * segW;

          return (
            <g key={m.number} onClick={() => onSelect(m.number)} style={{ cursor: 'pointer' }}>
              <motion.rect
                x={x + 1}
                y={topY + 2}
                width={segW - 2}
                height={barH - 4}
                rx="3"
                fill={natureBg(m.nature, isDaytime)}
                stroke={isSelected ? '#f0d48a' : 'transparent'}
                strokeWidth={isSelected ? 1.5 : 0}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
                style={{ transformOrigin: `${x}px ${topY}px` }}
              />
              {/* Nature dot */}
              <motion.circle
                cx={x + segW / 2}
                cy={topY + barH / 2 - 6}
                r="3"
                fill={natureColor(m.nature)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.04, type: 'spring', stiffness: 400 }}
              />
              {/* Number */}
              <motion.text
                x={x + segW / 2}
                y={topY + barH / 2 + 8}
                fill={isDaytime ? 'rgba(240,212,138,0.8)' : 'rgba(138,138,223,0.8)'}
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight={isSelected ? 700 : 400}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.03 }}
              >
                {m.number}
              </motion.text>
            </g>
          );
        })}

        {/* Sunrise marker */}
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <line x1="0" y1={topY - 6} x2="0" y2={topY + barH + 6} stroke="#f0d48a" strokeWidth="2" strokeDasharray="3,3" />
          <text x="4" y={topY - 12} fill="#f0d48a" fontSize="9" fontFamily="var(--font-heading)">
            {locale === 'en' ? 'Sunrise' : 'सूर्योदय'}
          </text>
          {/* Sun icon */}
          <circle cx="0" cy={topY - 22} r="5" fill="#f5c842" opacity="0.7" />
        </motion.g>

        {/* Sunset marker (midpoint) */}
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <line x1={segW * 15} y1={topY - 6} x2={segW * 15} y2={topY + barH + 6} stroke="#8a6d2b" strokeWidth="2" strokeDasharray="3,3" />
          <text x={segW * 15 + 4} y={topY - 12} fill="#8a8adf" fontSize="9" fontFamily="var(--font-heading)">
            {locale === 'en' ? 'Sunset' : 'सूर्यास्त'}
          </text>
          {/* Moon icon */}
          <circle cx={segW * 15} cy={topY - 22} r="4" fill="#8a8adf" opacity="0.6" />
        </motion.g>

        {/* Next Sunrise marker (end) */}
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
          <line x1={totalW} y1={topY - 6} x2={totalW} y2={topY + barH + 6} stroke="#f0d48a" strokeWidth="2" strokeDasharray="3,3" />
          <text x={totalW - 4} y={topY - 12} fill="#f0d48a" fontSize="9" textAnchor="end" fontFamily="var(--font-heading)">
            {locale === 'en' ? 'Sunrise' : 'सूर्योदय'}
          </text>
          <circle cx={totalW} cy={topY - 22} r="5" fill="#f5c842" opacity="0.7" />
        </motion.g>

        {/* Daytime / Nighttime labels below the bar */}
        <text x={segW * 7.5} y={topY + barH + 22} fill="#f0d48a" fontSize="10" textAnchor="middle" opacity="0.7" fontFamily="var(--font-heading)">
          {locale === 'en' ? '15 Daytime Muhurtas' : locale === 'hi' ? '15 दिवा मुहूर्त' : '15 दिवामुहूर्ताः'}
        </text>
        <text x={segW * 22.5} y={topY + barH + 22} fill="#8a8adf" fontSize="10" textAnchor="middle" opacity="0.7" fontFamily="var(--font-heading)">
          {locale === 'en' ? '15 Nighttime Muhurtas' : locale === 'hi' ? '15 रात्रि मुहूर्त' : '15 रात्रिमुहूर्ताः'}
        </text>

        {/* Animated progress sweep */}
        <motion.line
          x1="0" y1={topY + barH + 4}
          x2={totalW} y2={topY + barH + 4}
          stroke="rgba(212,168,83,0.15)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </motion.svg>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Main Page Component                                               */
/* ------------------------------------------------------------------ */
export default function MuhurtaPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [selectedMuhurta, setSelectedMuhurta] = useState<number | null>(null);

  const daytime = MUHURTAS.slice(0, 15);
  const nighttime = MUHURTAS.slice(15);

  const selected = selectedMuhurta ? MUHURTAS.find((m) => m.number === selectedMuhurta) : null;

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return 'text-emerald-400';
    if (nature === 'inauspicious') return 'text-red-400';
    return 'text-amber-400';
  };

  const natureBorder = (nature: string) => {
    if (nature === 'auspicious') return 'border-emerald-500/30';
    if (nature === 'inauspicious') return 'border-red-500/30';
    return 'border-amber-500/30';
  };

  const handleSelect = (n: number) => {
    setSelectedMuhurta((prev) => (prev === n ? null : n));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/panchang" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('backToPanchang')}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-6">
        <MuhurtaIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
            <span className="text-gold-gradient">{locale === 'en' ? 'Muhurta' : locale === 'hi' ? 'मुहूर्त' : 'मुहूर्तः'}</span>
          </h1>
          <p className="text-text-secondary text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {locale === 'en' ? 'The 30 Time Divisions of the Day -- Ancient Temporal Framework' : locale === 'hi' ? 'दिन के 30 काल विभाग -- प्राचीन समय-चक्र' : 'दिनस्य त्रिंशत् कालविभागाः -- प्राचीनकालचक्रम्'}
          </p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* Scientific Basis */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('scientificBasis')}</h2>
        <motion.div
          className="glass-card rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? `A Muhurta is one-thirtieth of a full day (sunrise to sunrise), lasting approximately 48 minutes. The day is divided into 15 daytime Muhurtas (sunrise to sunset) and 15 nighttime Muhurtas (sunset to next sunrise). Since the duration of day and night varies by season, the actual length of each Muhurta changes accordingly -- a daytime Muhurta is longer in summer and shorter in winter. Each Muhurta is presided over by a specific deity and carries an auspicious or inauspicious quality, making this system essential for electional astrology (Muhurta Shastra).`
                : locale === 'hi'
                ? `मुहूर्त एक पूर्ण दिन (सूर्योदय से सूर्योदय) का तीसवाँ भाग है, जो लगभग 48 मिनट का होता है। दिन को 15 दिवा मुहूर्तों (सूर्योदय से सूर्यास्त) और 15 रात्रि मुहूर्तों (सूर्यास्त से अगले सूर्योदय) में विभाजित किया जाता है। ऋतु के अनुसार दिन-रात की अवधि बदलती है, अतः प्रत्येक मुहूर्त की वास्तविक लम्बाई भी बदलती है। प्रत्येक मुहूर्त एक विशिष्ट देवता द्वारा अधिष्ठित है और शुभ या अशुभ गुण रखता है।`
                : `मुहूर्तः पूर्णदिनस्य (सूर्योदयात् सूर्योदयपर्यन्तम्) त्रिंशत्तमः भागः, प्रायः 48 निमेषाणां कालः। दिनं 15 दिवामुहूर्तेषु (सूर्योदयात् सूर्यास्तपर्यन्तम्) 15 रात्रिमुहूर्तेषु च विभज्यते।`}
            </p>
            <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <p className="text-gold-light font-mono text-sm">
                {locale === 'en' ? 'Formula:' : 'सूत्र:'} 1 Muhurta = (Sunrise to Sunset) / 15 = ~48 min
              </p>
              <p className="text-gold-light/70 font-mono text-xs mt-1">
                {locale === 'en' ? '1 day = 30 Muhurtas = 15 daytime + 15 nighttime' : '1 दिन = 30 मुहूर्त = 15 दिवा + 15 रात्रि'}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Animated Muhurta Wheel Visualization */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en' ? 'Muhurta Wheel' : locale === 'hi' ? 'मुहूर्त चक्र' : 'मुहूर्तचक्रम्'}
        </h2>
        <p className="text-text-secondary text-sm mb-4">
          {locale === 'en'
            ? 'Click any sector to view details. Green = auspicious, Red = inauspicious.'
            : locale === 'hi'
            ? 'विवरण देखने के लिए किसी भी खंड पर क्लिक करें। हरा = शुभ, लाल = अशुभ।'
            : 'विवरणार्थं कमपि खण्डं क्लिक्कयतु। हरितम् = शुभम्, रक्तम् = अशुभम्।'}
        </p>
        <div className="glass-card rounded-xl p-8 flex justify-center">
          <AnimatedMuhurtaWheel locale={locale} selectedMuhurta={selectedMuhurta} onSelect={handleSelect} />
        </div>
      </section>

      {/* Selected Muhurta Detail Panel */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.section
            key={selected.number}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`glass-card rounded-xl p-8 mb-8 border ${natureBorder(selected.nature)}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <motion.h3
                    className="text-2xl font-bold text-gold-gradient"
                    style={headingFont}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {selected.number}. {selected.name[locale]}
                  </motion.h3>
                  {locale !== 'en' && (
                    <motion.p
                      className="text-text-secondary text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {selected.name.en}
                    </motion.p>
                  )}
                </div>
                <motion.button
                  onClick={() => setSelectedMuhurta(null)}
                  className="text-text-secondary hover:text-gold-primary transition-colors p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Nature */}
                <motion.div
                  className="bg-bg-primary/40 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="text-text-secondary text-xs mb-1">
                    {locale === 'en' ? 'Nature' : locale === 'hi' ? 'स्वभाव' : 'स्वभावः'}
                  </p>
                  <p className={`text-lg font-semibold ${natureColor(selected.nature)}`}>
                    {selected.nature === 'auspicious'
                      ? (locale === 'en' ? 'Auspicious' : locale === 'hi' ? 'शुभ' : 'शुभम्')
                      : selected.nature === 'inauspicious'
                      ? (locale === 'en' ? 'Inauspicious' : locale === 'hi' ? 'अशुभ' : 'अशुभम्')
                      : (locale === 'en' ? 'Neutral' : locale === 'hi' ? 'सम' : 'समम्')}
                  </p>
                </motion.div>

                {/* Period */}
                <motion.div
                  className="bg-bg-primary/40 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-text-secondary text-xs mb-1">
                    {locale === 'en' ? 'Period' : locale === 'hi' ? 'काल' : 'कालः'}
                  </p>
                  <p className={`text-lg font-semibold ${selected.number <= 15 ? 'text-gold-light' : 'text-indigo-300'}`}>
                    {selected.number <= 15
                      ? (locale === 'en' ? 'Daytime' : locale === 'hi' ? 'दिवा' : 'दिवा')
                      : (locale === 'en' ? 'Nighttime' : locale === 'hi' ? 'रात्रि' : 'रात्रिः')}
                  </p>
                </motion.div>

                {/* Trilingual Names */}
                <motion.div
                  className="bg-bg-primary/40 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <p className="text-text-secondary text-xs mb-1">
                    {locale === 'en' ? 'All Names' : locale === 'hi' ? 'सभी नाम' : 'सर्वाणि नामानि'}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    <span className="text-gold-light">{selected.name.en}</span>
                    {' / '}
                    <span style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{selected.name.hi}</span>
                    {' / '}
                    <span style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{selected.name.sa}</span>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Animated Sunrise-Sunset Timeline */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en' ? 'Day-Night Muhurta Timeline' : locale === 'hi' ? 'दिवा-रात्रि मुहूर्त समयरेखा' : 'दिवारात्रिमुहूर्तकालरेखा'}
        </h2>
        <div className="glass-card rounded-xl p-6">
          <AnimatedSunriseSunsetDiagram locale={locale} selectedMuhurta={selectedMuhurta} onSelect={handleSelect} />
        </div>
      </section>

      <GoldDivider />

      {/* Detailed Muhurta Listing with Expandable Cards */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('completeListing')}</h2>
        <p className="text-text-secondary text-sm mb-6">
          {locale === 'en'
            ? 'Click any muhurta to expand and view its deity, significance, and best activities.'
            : locale === 'hi'
            ? 'देवता, महत्त्व और सर्वोत्तम कार्य देखने के लिए किसी भी मुहूर्त पर क्लिक करें।'
            : 'देवतां महत्त्वं सर्वोत्तमकर्माणि च द्रष्टुं कमपि मुहूर्तं क्लिक्कयतु।'}
        </p>

        {/* Daytime Muhurtas */}
        <h3 className="text-xl text-gold-light mb-4" style={headingFont}>
          {locale === 'en' ? 'Daytime Muhurtas (Sunrise to Sunset)' : locale === 'hi' ? 'दिवा मुहूर्त (सूर्योदय से सूर्यास्त)' : 'दिवामुहूर्ताः (सूर्योदयात् सूर्यास्तपर्यन्तम्)'}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
          {MUHURTA_DATA.filter(m => m.period === 'day').map((m) => (
            <MuhurtaCard key={m.number} muhurta={m} locale={locale} />
          ))}
        </div>

        {/* Nighttime Muhurtas */}
        <h3 className="text-xl text-indigo-300/80 mb-4" style={headingFont}>
          {locale === 'en' ? 'Nighttime Muhurtas (Sunset to Sunrise)' : locale === 'hi' ? 'रात्रि मुहूर्त (सूर्यास्त से सूर्योदय)' : 'रात्रिमुहूर्ताः (सूर्यास्तात् सूर्योदयपर्यन्तम्)'}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {MUHURTA_DATA.filter(m => m.period === 'night').map((m) => (
            <MuhurtaCard key={m.number} muhurta={m} locale={locale} />
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* Conflict Commentary Section */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {locale === 'en' ? 'Timing Conflicts & Resolution' : locale === 'hi' ? 'समय विरोध एवं समाधान' : 'कालविरोधः समाधानं च'}
        </h2>
        <p className="text-text-secondary mb-6">
          {locale === 'en'
            ? 'When auspicious and inauspicious periods overlap, classical texts provide clear guidance on which influence prevails.'
            : locale === 'hi'
            ? 'जब शुभ और अशुभ काल ओवरलैप करते हैं, शास्त्रीय ग्रन्थ स्पष्ट मार्गदर्शन प्रदान करते हैं कि कौन सा प्रभाव प्रबल होता है।'
            : 'यदा शुभाशुभकालौ परस्परं संलग्नौ भवतः, शास्त्रीयग्रन्थाः स्पष्टं मार्गदर्शनं प्रददति।'}
        </p>
        <ConflictSection locale={locale} />
      </section>

      {/* Link to Learn */}
      <div className="mt-8 text-center">
        <Link
          href="/learn/muhurtas"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {locale === 'en' ? 'Learn Muhurta Basics →' : locale === 'hi' ? 'मुहूर्त मूल बातें सीखें →' : 'मुहूर्तमूलतत्त्वानि शिक्षतु →'}
        </Link>
      </div>
    </div>
  );
}
