'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronDown, CheckCircle, Circle } from 'lucide-react';
import {
  YOGA_ANIMATIONS,
  PLANET_META,
  CATEGORY_META,
  type YogaAnimation,
  type YogaCategory,
  getYogasByCategory,
} from '@/lib/constants/yoga-animations';

// ─── Types ───────────────────────────────────────────────────────────────────

type Locale = 'en' | 'hi' | 'ta' | 'bn';
type SpeedKey = 'slow' | 'normal' | 'fast';
type ChartStyle = 'south' | 'north';

const SPEED_MS: Record<SpeedKey, number> = {
  slow: 1200,
  normal: 700,
  fast: 300,
};

const SPEED_LABELS: Record<SpeedKey, Record<Locale, string>> = {
  slow:   { en: 'Slow',   hi: 'धीमा',    ta: 'மெதுவாக', bn: 'ধীরে' },
  normal: { en: 'Normal', hi: 'सामान्य', ta: 'சாதாரண',  bn: 'সাধারণ' },
  fast:   { en: 'Fast',   hi: 'तेज़',    ta: 'வேகமாக',  bn: 'দ্রুত' },
};

// ─── UI labels ───────────────────────────────────────────────────────────────

const UI: Record<string, Record<Locale, string>> = {
  title:       { en: 'Yoga Formation Animator',     hi: 'योग निर्माण एनीमेटर',     ta: 'யோக அமைப்பு அனிமேட்டர்',  bn: 'যোগ গঠন অ্যানিমেটর' },
  subtitle:    { en: 'Watch how planetary combinations form classical Jyotish yogas  –  step by step', hi: 'देखें कैसे ग्रह योग बनाते हैं  –  चरण दर चरण', ta: 'கிரக கலவைகள் எவ்வாறு யோகங்களை உருவாக்குகின்றன என்பதை கண்டறியுங்கள்', bn: 'দেখুন কীভাবে গ্রহ মিলিত হয়ে যোগ তৈরি করে  –  ধাপে ধাপে' },
  selectYoga:  { en: 'Select a Yoga',               hi: 'योग चुनें',                ta: 'ஒரு யோகம் தேர்வு செய்யுங்கள்', bn: 'একটি যোগ নির্বাচন করুন' },
  conditions:  { en: 'Conditions',                  hi: 'शर्तें',                  ta: 'நிபந்தனைகள்',              bn: 'শর্তাবলী' },
  frequency:   { en: 'Frequency',                   hi: 'आवृत्ति',                 ta: 'அதிர்வெண்',               bn: 'ফ্রিকোয়েন্সি' },
  source:      { en: 'Source',                      hi: 'स्रोत',                   ta: 'மூலம்',                    bn: 'সূত্র' },
  play:        { en: 'Play',                        hi: 'चलाएं',                   ta: 'இயக்கு',                   bn: 'চালু' },
  pause:       { en: 'Pause',                       hi: 'रुकें',                   ta: 'நிறுத்து',                 bn: 'থামো' },
  reset:       { en: 'Reset',                       hi: 'रीसेट',                   ta: 'மீட்டமை',                  bn: 'রিসেট' },
  speed:       { en: 'Speed',                       hi: 'गति',                     ta: 'வேகம்',                    bn: 'গতি' },
  allMet:      { en: 'All conditions met!',         hi: 'सभी शर्तें पूरी!',        ta: 'அனைத்து நிபந்தனைகளும் நிறைவேறின!', bn: 'সব শর্ত পূরণ হয়েছে!' },
  fromLagna:   { en: 'from Lagna',                  hi: 'लग्न से',                 ta: 'லக்னத்திலிருந்து',         bn: 'লগ্ন থেকে' },
  fromMoon:    { en: 'from Moon',                   hi: 'चन्द्र से',               ta: 'சந்திரனிலிருந்து',         bn: 'চাঁদ থেকে' },
  house:       { en: 'House',                       hi: 'भाव',                     ta: 'வீடு',                     bn: 'ঘর' },
  learnMore:   { en: 'Learn more about Yogas',      hi: 'योगों के बारे में अधिक जानें', ta: 'யோகங்களைப் பற்றி மேலும் அறியுங்கள்', bn: 'যোগগুলি সম্পর্কে আরও জানুন' },
  northChart:  { en: 'North',                       hi: 'उत्तर',                   ta: 'வடக்கு',                   bn: 'উত্তর' },
  southChart:  { en: 'South',                       hi: 'दक्षिण',                  ta: 'தெற்கு',                   bn: 'দক্ষিণ' },
  kendra:      { en: 'Kendra',                      hi: 'केन्द्र',                 ta: 'கேந்திரம்',                bn: 'কেন্দ্র' },
  trikona:     { en: 'Trikona',                     hi: 'त्रिकोण',                 ta: 'திரிகோணம்',                bn: 'ত্রিকোণ' },
  dusthana:    { en: 'Dusthana',                    hi: 'दुस्थान',                 ta: 'துஸ்தானம்',                bn: 'দুস্থান' },
};

function t(key: string, locale: Locale): string {
  return UI[key]?.[locale] ?? UI[key]?.en ?? key;
}

// ─── House layout helpers ──────────────────────────────────────────────────

// Whether a house is a kendra (angular)
const KENDRA_HOUSES = new Set([1, 4, 7, 10]);
// Whether a house is a trikona (trine)
const TRIKONA_HOUSES = new Set([1, 5, 9]);
// Dusthana houses
const DUSTHANA_HOUSES = new Set([6, 8, 12]);

interface GridCell { col: number; row: number }

// South Indian chart: 4x4 grid, houses in perimeter cells (center 2x2 is label area)
const SOUTH_GRID: Record<number, GridCell> = {
  1:  { col: 1, row: 0 },
  2:  { col: 2, row: 0 },
  3:  { col: 3, row: 0 },
  4:  { col: 3, row: 1 },
  5:  { col: 3, row: 2 },
  6:  { col: 3, row: 3 },
  7:  { col: 2, row: 3 },
  8:  { col: 1, row: 3 },
  9:  { col: 0, row: 3 },
  10: { col: 0, row: 2 },
  11: { col: 0, row: 1 },
  12: { col: 0, row: 0 },
};

function houseLabel(house: number): string {
  const suffix = ['st', 'nd', 'rd'][house - 1] ?? 'th';
  return `${house}${house <= 3 ? suffix : 'th'}`;
}

// ─── North Indian diamond house paths (scaled to a viewBox) ───────────────
// North Indian chart: diamond layout with house 1 at top center, clockwise.
// viewBox is 300x300 for the SVG. House regions are triangular/quadrilateral.
// cx/cy = center of each house region for placing planet labels.

interface NorthHouseInfo {
  path: string;
  cx: number;
  cy: number;
}

const NORTH_HOUSES: Record<number, NorthHouseInfo> = {
  1:  { path: 'M 150 10 L 80 80 L 150 150 L 220 80 Z',   cx: 150, cy: 78 },
  2:  { path: 'M 10 10 L 80 80 L 150 10 Z',               cx: 78, cy: 30 },
  3:  { path: 'M 10 10 L 10 150 L 80 80 Z',               cx: 30, cy: 78 },
  4:  { path: 'M 10 150 L 80 80 L 150 150 L 80 220 Z',   cx: 78, cy: 150 },
  5:  { path: 'M 10 150 L 80 220 L 10 290 Z',             cx: 30, cy: 222 },
  6:  { path: 'M 10 290 L 80 220 L 150 290 Z',            cx: 78, cy: 270 },
  7:  { path: 'M 150 290 L 80 220 L 150 150 L 220 220 Z', cx: 150, cy: 222 },
  8:  { path: 'M 150 290 L 220 220 L 290 290 Z',          cx: 222, cy: 270 },
  9:  { path: 'M 290 290 L 220 220 L 290 150 Z',          cx: 270, cy: 222 },
  10: { path: 'M 290 150 L 220 220 L 150 150 L 220 80 Z', cx: 222, cy: 150 },
  11: { path: 'M 290 150 L 220 80 L 290 10 Z',            cx: 270, cy: 78 },
  12: { path: 'M 290 10 L 220 80 L 150 10 Z',             cx: 222, cy: 30 },
};

// ─── Planet dot (positioned in a cell for South chart) ────────────────────

interface PlanetDotProps {
  planetId: number;
  cellSize: number;
  offsetIndex: number;
  totalInCell: number;
  visible: boolean;
  glowing: boolean;
}

function PlanetDot({ planetId, cellSize, offsetIndex, totalInCell, visible, glowing }: PlanetDotProps) {
  const meta = PLANET_META[planetId];
  const dotSize = Math.min(28, cellSize * 0.28);
  const fontSize = dotSize * 0.55;

  const spread = totalInCell > 1 ? (cellSize * 0.3) / (totalInCell - 1) : 0;
  const xOffset = totalInCell > 1 ? -((totalInCell - 1) * spread * 0.5) + offsetIndex * spread : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={planetId}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${xOffset}px), -50%)`,
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              background: meta.color,
              border: `2px solid ${glowing ? '#f0d48a' : meta.color}`,
              boxShadow: glowing
                ? `0 0 12px ${meta.color}, 0 0 24px ${meta.color}80`
                : `0 0 6px ${meta.color}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize,
              color: '#0a0e27',
              fontWeight: 700,
              cursor: 'default',
              transition: 'box-shadow 0.4s ease',
            }}
            title={meta.label.en}
          >
            {meta.symbol}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Aspect line between two houses (South chart) ─────────────────────────

interface AspectLineProps {
  fromHouse: number;
  toHouse: number;
  cellSize: number;
  color: string;
  visible: boolean;
}

function AspectLine({ fromHouse, toHouse, cellSize, color, visible }: AspectLineProps) {
  const fromCell = SOUTH_GRID[fromHouse];
  const toCell = SOUTH_GRID[toHouse];
  if (!fromCell || !toCell) return null;

  const x1 = (fromCell.col + 0.5) * cellSize;
  const y1 = (fromCell.row + 0.5) * cellSize;
  const x2 = (toCell.col + 0.5) * cellSize;
  const y2 = (toCell.row + 0.5) * cellSize;
  const length = Math.hypot(x2 - x1, y2 - y1);

  return (
    <AnimatePresence>
      {visible && (
        <motion.line
          key={`${fromHouse}-${toHouse}`}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray={`${length} ${length}`}
          initial={{ strokeDashoffset: length, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' as const }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── South Indian Chart (grid-based) ──────────────────────────────────────

interface YogaChartProps {
  yoga: YogaAnimation;
  revealedSteps: number;
  locale: Locale;
  cellSize: number;
  allDone: boolean;
}

function SouthChart({ yoga, revealedSteps, locale, cellSize, allDone }: YogaChartProps) {
  const gridSize = cellSize * 4;

  // Group planets by house for stacking
  const houseMap: Record<number, number[]> = {};
  yoga.planets.forEach((step, idx) => {
    if (!houseMap[step.house]) houseMap[step.house] = [];
    houseMap[step.house].push(idx);
  });

  const visibleHouses = new Set<number>();
  yoga.planets.forEach((step, idx) => {
    if (idx < revealedSteps) visibleHouses.add(step.house);
  });

  const visiblePlanetHouses: number[] = [];
  yoga.planets.forEach((step, idx) => {
    if (idx < revealedSteps) visiblePlanetHouses.push(step.house);
  });

  const aspectPairs: [number, number][] = [];
  if (revealedSteps >= 2) {
    for (let i = 0; i < visiblePlanetHouses.length - 1; i++) {
      for (let j = i + 1; j < visiblePlanetHouses.length; j++) {
        if (visiblePlanetHouses[i] !== visiblePlanetHouses[j]) {
          const pair: [number, number] = [visiblePlanetHouses[i], visiblePlanetHouses[j]];
          if (!aspectPairs.some(p => p[0] === pair[0] && p[1] === pair[1])) {
            aspectPairs.push(pair);
          }
        }
      }
    }
  }

  const accentColor = allDone ? '#f0d48a' : yoga.accentColor;

  return (
    <div style={{ position: 'relative', width: gridSize, height: gridSize }}>
      {/* SVG layer for aspect lines */}
      <svg
        width={gridSize}
        height={gridSize}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, pointerEvents: 'none' }}
      >
        {aspectPairs.map(([a, b]) => (
          <AspectLine
            key={`${a}-${b}`}
            fromHouse={a}
            toHouse={b}
            cellSize={cellSize}
            color={accentColor}
            visible={revealedSteps >= 2}
          />
        ))}
      </svg>

      {/* House cells */}
      {Object.entries(SOUTH_GRID).map(([hStr, cell]) => {
        const house = Number(hStr);
        const isLit = visibleHouses.has(house);
        const isKendra = KENDRA_HOUSES.has(house);
        const isTrikona = TRIKONA_HOUSES.has(house);
        const planetsInCell = (houseMap[house] ?? []).filter(idx => idx < revealedSteps);

        return (
          <motion.div
            key={house}
            animate={{
              borderColor: isLit
                ? allDone ? '#f0d48a80' : `${accentColor}60`
                : isKendra ? '#d4a85320' : isTrikona ? '#6060c020' : '#ffffff10',
              backgroundColor: isLit
                ? allDone ? '#f0d48a0a' : `${accentColor}08`
                : 'transparent',
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' as const }}
            style={{
              position: 'absolute',
              left: cell.col * cellSize,
              top: cell.row * cellSize,
              width: cellSize,
              height: cellSize,
              border: '1px solid',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* House number */}
            <span style={{
              position: 'absolute',
              top: 4,
              left: 6,
              fontSize: 10,
              color: isKendra ? '#d4a85360' : isTrikona ? '#8080c060' : '#ffffff20',
              fontWeight: 600,
              lineHeight: 1,
            }}>
              {house}
            </span>

            {/* Planet dots */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {(houseMap[house] ?? []).map((stepIdx, stackIdx) => (
                <PlanetDot
                  key={stepIdx}
                  planetId={yoga.planets[stepIdx].planetId}
                  cellSize={cellSize}
                  offsetIndex={stackIdx}
                  totalInCell={houseMap[house].length}
                  visible={stepIdx < revealedSteps}
                  glowing={allDone}
                />
              ))}
            </div>

            {/* Planet labels below dot */}
            {planetsInCell.length > 0 && (
              <div style={{
                position: 'absolute',
                bottom: 3,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap',
                padding: '0 2px',
              }}>
                {planetsInCell.map(stepIdx => {
                  const meta = PLANET_META[yoga.planets[stepIdx].planetId];
                  return (
                    <span
                      key={stepIdx}
                      style={{
                        fontSize: 9,
                        color: meta.color,
                        opacity: 0.85,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {meta.label[locale] ?? meta.label.en}
                    </span>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Center panel */}
      <div style={{
        position: 'absolute',
        left: cellSize,
        top: cellSize,
        width: cellSize * 2,
        height: cellSize * 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 4,
        border: '1px solid',
        borderColor: allDone ? '#f0d48a40' : '#d4a85325',
        backgroundColor: allDone ? '#f0d48a05' : '#d4a85308',
        transition: 'all 0.5s ease',
      }}>
        <ChartCenterLabel yoga={yoga} allDone={allDone} />
      </div>
    </div>
  );
}

// ─── North Indian Diamond Chart (SVG-based) ───────────────────────────────

function NorthChart({ yoga, revealedSteps, locale, cellSize, allDone }: YogaChartProps) {
  const svgSize = cellSize * 4;
  const scale = svgSize / 300;

  // Group planets by house for stacking
  const houseMap: Record<number, number[]> = {};
  yoga.planets.forEach((step, idx) => {
    if (!houseMap[step.house]) houseMap[step.house] = [];
    houseMap[step.house].push(idx);
  });

  const visibleHouses = new Set<number>();
  yoga.planets.forEach((step, idx) => {
    if (idx < revealedSteps) visibleHouses.add(step.house);
  });

  const accentColor = allDone ? '#f0d48a' : yoga.accentColor;

  return (
    <div style={{ position: 'relative', width: svgSize, height: svgSize }}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 300 300"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <radialGradient id="nbg" cx="50%" cy="50%" r="72%">
            <stop offset="0%" stopColor="#111638" />
            <stop offset="100%" stopColor="#080b1f" />
          </radialGradient>
          <linearGradient id="ngold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7a5e22" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#7a5e22" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="300" height="300" rx="8" fill="url(#nbg)" />

        {/* Outer border */}
        <rect x="6" y="6" width="288" height="288" fill="none" stroke="url(#ngold)" strokeWidth="1.5" rx="4" />

        {/* Diamond */}
        <polygon points="150,10 290,150 150,290 10,150" fill="none" stroke="url(#ngold)" strokeWidth="1" />

        {/* Diagonals (corner to center) */}
        <line x1="10" y1="10" x2="150" y2="150" stroke="#d4a853" strokeWidth="0.5" opacity="0.35" />
        <line x1="290" y1="10" x2="150" y2="150" stroke="#d4a853" strokeWidth="0.5" opacity="0.35" />
        <line x1="10" y1="290" x2="150" y2="150" stroke="#d4a853" strokeWidth="0.5" opacity="0.35" />
        <line x1="290" y1="290" x2="150" y2="150" stroke="#d4a853" strokeWidth="0.5" opacity="0.35" />

        {/* House regions */}
        {Object.entries(NORTH_HOUSES).map(([hStr, info]) => {
          const house = Number(hStr);
          const isLit = visibleHouses.has(house);
          const isKendra = KENDRA_HOUSES.has(house);
          const isTrikona = TRIKONA_HOUSES.has(house);

          const fillColor = isLit
            ? allDone ? '#f0d48a0a' : `${accentColor}10`
            : 'transparent';
          const strokeColor = isLit
            ? allDone ? '#f0d48a80' : `${accentColor}60`
            : isKendra ? '#d4a85325' : isTrikona ? '#6060c020' : 'transparent';

          return (
            <g key={house}>
              <motion.path
                d={info.path}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={0.8}
                animate={{ fill: fillColor, stroke: strokeColor }}
                transition={{ duration: 0.4, ease: 'easeInOut' as const }}
              />
              {/* House number */}
              <text
                x={info.cx}
                y={info.cy - 12}
                textAnchor="middle"
                fontSize="9"
                fill={isKendra ? '#d4a85360' : isTrikona ? '#8080c060' : '#ffffff20'}
                fontWeight="600"
              >
                {house}
              </text>
            </g>
          );
        })}

        {/* Aspect lines between visible planets in different houses */}
        {revealedSteps >= 2 && (() => {
          const pairs: [number, number][] = [];
          const visible = yoga.planets.slice(0, revealedSteps);
          for (let i = 0; i < visible.length - 1; i++) {
            for (let j = i + 1; j < visible.length; j++) {
              if (visible[i].house !== visible[j].house) {
                const a = visible[i].house;
                const b = visible[j].house;
                if (!pairs.some(p => p[0] === a && p[1] === b)) {
                  pairs.push([a, b]);
                }
              }
            }
          }
          return pairs.map(([a, b]) => {
            const ha = NORTH_HOUSES[a];
            const hb = NORTH_HOUSES[b];
            if (!ha || !hb) return null;
            return (
              <motion.line
                key={`n-${a}-${b}`}
                x1={ha.cx} y1={ha.cy}
                x2={hb.cx} y2={hb.cy}
                stroke={accentColor}
                strokeWidth={1}
                strokeOpacity={0.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.6, ease: 'easeInOut' as const }}
              />
            );
          });
        })()}

        {/* Planet symbols in houses */}
        {yoga.planets.map((step, idx) => {
          if (idx >= revealedSteps) return null;
          const houseInfo = NORTH_HOUSES[step.house];
          if (!houseInfo) return null;
          const meta = PLANET_META[step.planetId];
          const planetsInHouse = (houseMap[step.house] ?? []).filter(i => i < revealedSteps);
          const stackIdx = planetsInHouse.indexOf(idx);
          const total = planetsInHouse.length;
          const xSpread = total > 1 ? (stackIdx - (total - 1) / 2) * 18 : 0;

          return (
            <motion.g
              key={`planet-${idx}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <circle
                cx={houseInfo.cx + xSpread}
                cy={houseInfo.cy}
                r={10}
                fill={meta.color}
                stroke={allDone ? '#f0d48a' : meta.color}
                strokeWidth={allDone ? 1.5 : 0.5}
                opacity={0.9}
              />
              {allDone && (
                <circle
                  cx={houseInfo.cx + xSpread}
                  cy={houseInfo.cy}
                  r={14}
                  fill="none"
                  stroke={meta.color}
                  strokeWidth={0.5}
                  opacity={0.3}
                />
              )}
              <text
                x={houseInfo.cx + xSpread}
                y={houseInfo.cy + 4}
                textAnchor="middle"
                fontSize="11"
                fill="#0a0e27"
                fontWeight="700"
              >
                {meta.symbol}
              </text>
              <text
                x={houseInfo.cx + xSpread}
                y={houseInfo.cy + 18}
                textAnchor="middle"
                fontSize="7"
                fill={meta.color}
                fontWeight="600"
                opacity={0.85}
              >
                {meta.label[locale] ?? meta.label.en}
              </text>
            </motion.g>
          );
        })}

        {/* Center label */}
        <text
          x={150}
          y={145}
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill={allDone ? '#f0d48a' : '#d4a85380'}
          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          {yoga.name}
        </text>
        {allDone && (
          <text x={150} y={162} textAnchor="middle" fontSize="14" fill="#f0d48a">
            ✦
          </text>
        )}
      </svg>
    </div>
  );
}

// ─── Center label shared ──────────────────────────────────────────────────

function ChartCenterLabel({ yoga, allDone }: { yoga: YogaAnimation; allDone: boolean }) {
  return (
    <motion.div
      animate={{ scale: allDone ? [1, 1.08, 1] : 1, opacity: allDone ? 1 : 0.6 }}
      transition={{ duration: 0.6, ease: 'easeInOut' as const }}
      style={{ textAlign: 'center', padding: '0 8px' }}
    >
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: allDone ? '#f0d48a' : '#d4a85380',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 4,
        lineHeight: 1.2,
      }}>
        {yoga.name}
      </div>
      {allDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, ease: 'easeOut' as const }}
          style={{ fontSize: 18 }}
        >
          ✦
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Mini house diagram (Kendra/Trikona/Dusthana) ────────────────────────

interface MiniChartProps {
  highlighted: Set<number>;
  color: string;
  label: string;
}

function MiniChart({ highlighted, color, label }: MiniChartProps) {
  const size = 120;
  const cell = size / 4;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs font-bold" style={{ color }}>{label}</span>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect x="0" y="0" width={size} height={size} rx="4" fill="#0a0e2790" />
        {/* South-style mini grid — perimeter cells only */}
        {Object.entries(SOUTH_GRID).map(([hStr, g]) => {
          const house = Number(hStr);
          const isHighlighted = highlighted.has(house);
          const isCenter = g.col >= 1 && g.col <= 2 && g.row >= 1 && g.row <= 2;
          if (isCenter && !isHighlighted) return null;
          return (
            <g key={house}>
              <rect
                x={g.col * cell + 0.5}
                y={g.row * cell + 0.5}
                width={cell - 1}
                height={cell - 1}
                fill={isHighlighted ? `${color}20` : 'transparent'}
                stroke={isHighlighted ? `${color}80` : '#ffffff10'}
                strokeWidth={isHighlighted ? 1.2 : 0.5}
                rx={2}
              />
              <text
                x={g.col * cell + cell / 2}
                y={g.row * cell + cell / 2 + 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight={isHighlighted ? '700' : '400'}
                fill={isHighlighted ? color : '#ffffff20'}
              >
                {house}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Condition checklist ────────────────────────────────────────────────────

interface ConditionListProps {
  yoga: YogaAnimation;
  revealedSteps: number;
  locale: Locale;
  allDone: boolean;
}

function ConditionList({ yoga, revealedSteps, locale, allDone }: ConditionListProps) {
  function conditionMet(condIdx: number): boolean {
    const cond = yoga.conditions[condIdx];
    return cond.triggeredByStep.every(stepIdx => stepIdx < revealedSteps);
  }

  function getCondText(condIdx: number): string {
    const cond = yoga.conditions[condIdx];
    if (locale === 'hi') return cond.textHi;
    if (locale === 'ta') return cond.textTa;
    if (locale === 'bn') return cond.textBn;
    return cond.text;
  }

  const allMet = yoga.conditions.every((_, i) => conditionMet(i));

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">
        {t('conditions', locale)}
      </h3>
      {yoga.conditions.map((_, i) => {
        const met = conditionMet(i);
        return (
          <motion.div
            key={i}
            animate={{ opacity: met ? 1 : 0.45 }}
            transition={{ duration: 0.4, ease: 'easeInOut' as const }}
            className="flex items-start gap-2.5"
          >
            <motion.div
              animate={{
                scale: met ? [1, 1.3, 1] : 1,
                color: met ? (allDone ? '#f0d48a' : '#4ade80') : '#8a8478',
              }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
              className="mt-0.5 flex-shrink-0"
            >
              {met ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </motion.div>
            <span className="text-sm leading-relaxed" style={{
              color: met ? (allDone ? '#f0d48a' : '#e6e2d8') : '#8a8478',
              transition: 'color 0.4s ease',
            }}>
              {getCondText(i)}
            </span>
          </motion.div>
        );
      })}

      {/* Planet placement summary */}
      <div className="mt-4 pt-4 border-t border-gold-primary/10 space-y-1.5">
        {yoga.planets.map((step, idx) => {
          const meta = PLANET_META[step.planetId];
          const revealed = idx < revealedSteps;
          return (
            <motion.div
              key={idx}
              animate={{ opacity: revealed ? 1 : 0.3 }}
              transition={{ duration: 0.3, ease: 'easeInOut' as const }}
              className="flex items-center gap-2 text-xs"
            >
              <span style={{ color: revealed ? meta.color : '#8a8478', fontSize: 14 }}>
                {meta.symbol}
              </span>
              <span style={{ color: revealed ? meta.color : '#8a8478', fontWeight: 600 }}>
                {meta.label[locale] ?? meta.label.en}
              </span>
              <span className="text-text-secondary">
                → {houseLabel(step.house)} {t(step.fromLagna ? 'fromLagna' : 'fromMoon', locale)}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* All conditions met banner */}
      <AnimatePresence>
        {allMet && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
            className="mt-4 px-3 py-2.5 rounded-xl border text-center text-sm font-bold"
            style={{
              borderColor: '#f0d48a60',
              background: 'linear-gradient(135deg, #f0d48a15, #d4a85308)',
              color: '#f0d48a',
              letterSpacing: '0.02em',
            }}
          >
            {t('allMet', locale)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

interface YogaAnimatorProps {
  locale?: Locale;
}

export default function YogaAnimator({ locale: localeProp }: YogaAnimatorProps) {
  const locale: Locale = (localeProp ?? 'en') as Locale;

  const [selectedCategory, setSelectedCategory] = useState<YogaCategory>('mahapurusha');
  const [selectedYogaId, setSelectedYogaId] = useState<string>(YOGA_ANIMATIONS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(1); // Start with 1 so chart shows something on load
  const [speed, setSpeed] = useState<SpeedKey>('normal');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('south');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const yoga = YOGA_ANIMATIONS.find(y => y.id === selectedYogaId) ?? YOGA_ANIMATIONS[0];
  const totalSteps = yoga.planets.length;
  const allDone = revealedSteps >= totalSteps;

  // Stop animation if we finished
  useEffect(() => {
    if (allDone && isPlaying) {
      setIsPlaying(false);
    }
  }, [allDone, isPlaying]);

  // Animation tick
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isPlaying || allDone) return;

    timerRef.current = setTimeout(() => {
      setRevealedSteps(prev => Math.min(prev + 1, totalSteps));
    }, SPEED_MS[speed]);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, revealedSteps, speed, totalSteps, allDone]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setRevealedSteps(0);
  }, []);

  const handleSelectYoga = useCallback((id: string) => {
    setSelectedYogaId(id);
    setRevealedSteps(1); // Show first planet immediately
    setIsPlaying(false);
    setDropdownOpen(false);
  }, []);

  const handleSelectCategory = useCallback((cat: YogaCategory) => {
    setSelectedCategory(cat);
    const yogasInCat = getYogasByCategory(cat);
    if (yogasInCat.length > 0) {
      handleSelectYoga(yogasInCat[0].id);
    }
  }, [handleSelectYoga]);

  const yogasInCategory = getYogasByCategory(selectedCategory);
  const catMeta = CATEGORY_META[selectedCategory];
  const categories = Object.keys(CATEGORY_META) as YogaCategory[];

  const cellSize = 80;

  function getYogaName(y: YogaAnimation): string {
    if (locale === 'hi') return y.nameHi;
    if (locale === 'ta') return y.nameTa;
    if (locale === 'bn') return y.nameBn;
    return y.name;
  }

  function getYogaDesc(y: YogaAnimation): string {
    if (locale === 'hi') return y.descriptionHi;
    if (locale === 'ta') return y.descriptionTa;
    if (locale === 'bn') return y.descriptionBn;
    return y.description;
  }

  function getCatLabel(cat: YogaCategory): string {
    const m = CATEGORY_META[cat];
    if (locale === 'hi') return m.label.hi;
    if (locale === 'ta') return m.label.ta;
    if (locale === 'bn') return m.label.bn;
    return m.label.en;
  }

  return (
    <div className="w-full space-y-6">
      {/* ── Header ── */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2">
          {t('title', locale)}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
          {t('subtitle', locale)}
        </p>
      </div>

      {/* ── Category tabs ── */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(cat => {
          const m = CATEGORY_META[cat];
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200"
              style={{
                borderColor: active ? m.color : `${m.color}30`,
                background: active ? `${m.color}18` : 'transparent',
                color: active ? m.color : `${m.color}80`,
              }}
            >
              {getCatLabel(cat)}
            </button>
          );
        })}
      </div>

      {/* ── Yoga selector dropdown ── */}
      <div className="relative max-w-sm mx-auto">
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-gold-primary/20 bg-[#111633] hover:border-gold-primary/40 transition-colors"
        >
          <span className="text-gold-light font-semibold text-sm truncate">
            {getYogaName(yoga)}
          </span>
          <ChevronDown
            className="w-4 h-4 text-gold-dark flex-shrink-0 transition-transform"
            style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scaleY: 0.9 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -6, scaleY: 0.9 }}
              transition={{ duration: 0.15, ease: 'easeOut' as const }}
              style={{ transformOrigin: 'top' }}
              className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-gold-primary/20 bg-[#111633] shadow-2xl shadow-black/60 overflow-hidden max-h-64 overflow-y-auto"
            >
              {yogasInCategory.map(y => (
                <button
                  key={y.id}
                  onClick={() => handleSelectYoga(y.id)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gold-primary/8 transition-colors border-b border-gold-primary/8 last:border-0"
                  style={{ color: y.id === selectedYogaId ? catMeta.color : '#e6e2d8' }}
                >
                  <span className="font-semibold">{getYogaName(y)}</span>
                  <span className="text-text-secondary text-xs ml-2">{y.frequency}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main layout: chart + controls + conditions ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">

        {/* ── Chart + controls ── */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0">
          {/* Chart style toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg border border-gold-primary/15 bg-[#0d1022]">
            {(['south', 'north'] as ChartStyle[]).map(style => (
              <button
                key={style}
                onClick={() => setChartStyle(style)}
                className="px-3 py-1 rounded-md text-xs font-bold transition-all"
                style={{
                  background: chartStyle === style ? '#d4a85320' : 'transparent',
                  color: chartStyle === style ? '#f0d48a' : '#8a8478',
                  borderColor: chartStyle === style ? '#d4a85340' : 'transparent',
                }}
              >
                {t(style === 'north' ? 'northChart' : 'southChart', locale)}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div
            className="rounded-2xl border border-gold-primary/15 bg-[#0d1022] overflow-hidden"
            style={{ padding: 12 }}
          >
            {chartStyle === 'south' ? (
              <SouthChart
                yoga={yoga}
                revealedSteps={revealedSteps}
                locale={locale}
                cellSize={cellSize}
                allDone={allDone}
              />
            ) : (
              <NorthChart
                yoga={yoga}
                revealedSteps={revealedSteps}
                locale={locale}
                cellSize={cellSize}
                allDone={allDone}
              />
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full" style={{ maxWidth: cellSize * 4 + 24 }}>
            <div className="flex justify-between text-xs text-text-secondary mb-1.5">
              <span>{revealedSteps} / {totalSteps} planets placed</span>
              <span style={{ color: catMeta.color }}>{yoga.frequency}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${(revealedSteps / totalSteps) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' as const }}
                style={{ background: allDone ? '#f0d48a' : catMeta.color }}
              />
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg border border-gold-primary/15 hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-all text-text-secondary hover:text-gold-light"
              title={t('reset', locale)}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (allDone) { handleReset(); return; }
                setIsPlaying(prev => !prev);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: isPlaying ? `${catMeta.color}25` : `${catMeta.color}18`,
                border: `1px solid ${catMeta.color}50`,
                color: catMeta.color,
              }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? t('pause', locale) : allDone ? t('reset', locale) : t('play', locale)}
            </button>

            {/* Speed selector */}
            <div className="flex items-center gap-1">
              {(['slow', 'normal', 'fast'] as SpeedKey[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="px-2 py-1 rounded text-xs font-semibold border transition-all"
                  style={{
                    borderColor: speed === s ? catMeta.color : '#ffffff15',
                    background: speed === s ? `${catMeta.color}18` : 'transparent',
                    color: speed === s ? catMeta.color : '#8a8478',
                  }}
                >
                  {SPEED_LABELS[s][locale]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel: description + conditions ── */}
        <div className="flex-1 min-w-0 max-w-sm space-y-5">
          {/* Yoga info card */}
          <div
            className="rounded-xl border p-4 space-y-2"
            style={{
              borderColor: `${catMeta.color}30`,
              background: `${catMeta.color}06`,
            }}
          >
            <div className="flex items-baseline gap-2 flex-wrap">
              <h2
                className="text-lg font-bold"
                style={{ color: catMeta.color }}
              >
                {getYogaName(yoga)}
              </h2>
              <span className="text-xs text-text-secondary">
                {yoga.classical}
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {getYogaDesc(yoga)}
            </p>
            <div className="flex gap-4 pt-1 text-xs text-text-secondary">
              <span>
                <span className="text-gold-dark font-semibold">{t('frequency', locale)}:</span>{' '}
                {locale === 'hi' ? yoga.frequencyHi : yoga.frequency}
              </span>
            </div>
          </div>

          {/* Conditions */}
          <div className="rounded-xl border border-gold-primary/10 bg-[#0d1022] p-4">
            <ConditionList
              yoga={yoga}
              revealedSteps={revealedSteps}
              locale={locale}
              allDone={allDone}
            />
          </div>
        </div>
      </div>

      {/* ── Kendra / Trikona / Dusthana mini diagrams ── */}
      <div className="border-t border-gold-primary/10 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4 text-center">
          {t('kendra', locale)} / {t('trikona', locale)} / {t('dusthana', locale)}
        </h3>
        <div className="flex flex-wrap gap-6 justify-center">
          <MiniChart
            highlighted={KENDRA_HOUSES}
            color="#d4a853"
            label={`${t('kendra', locale)} (1, 4, 7, 10)`}
          />
          <MiniChart
            highlighted={TRIKONA_HOUSES}
            color="#6b8bf5"
            label={`${t('trikona', locale)} (1, 5, 9)`}
          />
          <MiniChart
            highlighted={DUSTHANA_HOUSES}
            color="#e85050"
            label={`${t('dusthana', locale)} (6, 8, 12)`}
          />
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-4 justify-center text-xs text-text-secondary pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border" style={{ borderColor: '#d4a85340', background: '#d4a85308' }} />
          <span>Kendra (1, 4, 7, 10)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border" style={{ borderColor: '#6060c040', background: '#6060c008' }} />
          <span>Trikona (1, 5, 9)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#d4a85360' }} />
          <span>Planet dot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 20, height: 1.5, background: '#d4a85360' }} />
          <span>Aspect line</span>
        </div>
      </div>
    </div>
  );
}
