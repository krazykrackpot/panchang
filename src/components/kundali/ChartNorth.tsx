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
  retrogradeIds?: Set<number>;  // planet IDs that are retrograde
  combustIds?: Set<number>;      // planet IDs that are combust
  transitData?: ChartData;       // optional transit planet overlay
}

// North Indian diamond chart — 12 house regions (scaled to 500x500)
const HOUSE_PATHS: Record<number, { path: string; cx: number; cy: number; signX: number; signY: number }> = {
  1:  { path: 'M 250 30 L 140 140 L 250 250 L 360 140 Z', cx: 250, cy: 132, signX: 250, signY: 62 },
  2:  { path: 'M 30 30 L 140 140 L 250 30 Z', cx: 138, cy: 62, signX: 92, signY: 42 },
  3:  { path: 'M 30 30 L 30 250 L 140 140 Z', cx: 62, cy: 138, signX: 42, signY: 92 },
  4:  { path: 'M 30 250 L 140 140 L 250 250 L 140 360 Z', cx: 132, cy: 250, signX: 62, signY: 250 },
  5:  { path: 'M 30 250 L 140 360 L 30 470 Z', cx: 62, cy: 362, signX: 42, signY: 408 },
  6:  { path: 'M 30 470 L 140 360 L 250 470 Z', cx: 138, cy: 438, signX: 92, signY: 458 },
  7:  { path: 'M 250 470 L 140 360 L 250 250 L 360 360 Z', cx: 250, cy: 368, signX: 250, signY: 438 },
  8:  { path: 'M 250 470 L 360 360 L 470 470 Z', cx: 362, cy: 438, signX: 408, signY: 458 },
  9:  { path: 'M 470 470 L 360 360 L 470 250 Z', cx: 438, cy: 362, signX: 458, signY: 408 },
  10: { path: 'M 470 250 L 360 360 L 250 250 L 360 140 Z', cx: 368, cy: 250, signX: 438, signY: 250 },
  11: { path: 'M 470 250 L 360 140 L 470 30 Z', cx: 438, cy: 138, signX: 458, signY: 92 },
  12: { path: 'M 470 30 L 360 140 L 250 30 Z', cx: 362, cy: 62, signX: 408, signY: 42 },
};

const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

// Short abbreviations for compactness
const PLANET_ABBR: Record<number, Record<string, string>> = {
  0: { en: 'Su', hi: 'सू', sa: 'सू' },
  1: { en: 'Mo', hi: 'चं', sa: 'चं' },
  2: { en: 'Ma', hi: 'मं', sa: 'मं' },
  3: { en: 'Me', hi: 'बु', sa: 'बु' },
  4: { en: 'Ju', hi: 'गु', sa: 'गु' },
  5: { en: 'Ve', hi: 'शु', sa: 'शु' },
  6: { en: 'Sa', hi: 'श', sa: 'श' },
  7: { en: 'Ra', hi: 'रा', sa: 'रा' },
  8: { en: 'Ke', hi: 'के', sa: 'के' },
};

export default function ChartNorth({ data, title, size = 500, selectedHouse, onSelectHouse, retrogradeIds, combustIds, transitData }: ChartNorthProps) {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en' && String(locale) !== 'ta';

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-gold-light text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      <motion.svg
        viewBox="0 0 500 500"
        role="img"
        aria-label="North Indian birth chart showing planets in 12 houses"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="drop-shadow-2xl w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px]"
      >
        <defs>
          {/* Background gradient — deeper, richer */}
          <radialGradient id="nBg" cx="50%" cy="50%" r="72%">
            <stop offset="0%" stopColor="#111638" />
            <stop offset="100%" stopColor="#080b1f" />
          </radialGradient>
          {/* Gold border gradient */}
          <linearGradient id="nGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7a5e22" />
            <stop offset="30%" stopColor="#d4a853" />
            <stop offset="70%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#7a5e22" />
          </linearGradient>
          {/* Finer gold for inner lines */}
          <linearGradient id="nGoldFine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b5320" />
            <stop offset="50%" stopColor="#b8913f" />
            <stop offset="100%" stopColor="#6b5320" />
          </linearGradient>
          {/* Ascendant house glow */}
          <radialGradient id="nAscGlow" cx="50%" cy="30%" r="55%">
            <stop offset="0%" stopColor="rgba(212,168,83,0.12)" />
            <stop offset="100%" stopColor="rgba(212,168,83,0)" />
          </radialGradient>
          {/* Planet text — no blur for crispness */}
          {/* Selected house glow */}
          <filter id="nSelGlow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Ornamental corner pattern */}
          <pattern id="nCorner" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="#d4a853" opacity="0.15" />
          </pattern>
        </defs>

        {/* ─── Background ─── */}
        <rect x="0" y="0" width="500" height="500" rx="12" fill="url(#nBg)" />

        {/* ─── Double border frame ─── */}
        <rect x="18" y="18" width="464" height="464" fill="none" stroke="url(#nGold)" strokeWidth="2" rx="6" />
        <rect x="24" y="24" width="452" height="452" fill="none" stroke="url(#nGold)" strokeWidth="0.5" opacity="0.4" rx="4" />

        {/* ─── Inner diamond — crisp classical lines ─── */}
        <polygon points="250,30 470,250 250,470 30,250" fill="none" stroke="url(#nGold)" strokeWidth="1.5" />

        {/* ─── Diagonal lines (corner to center) ─── */}
        <line x1="30" y1="30" x2="250" y2="250" stroke="url(#nGoldFine)" strokeWidth="0.8" />
        <line x1="470" y1="30" x2="250" y2="250" stroke="url(#nGoldFine)" strokeWidth="0.8" />
        <line x1="30" y1="470" x2="250" y2="250" stroke="url(#nGoldFine)" strokeWidth="0.8" />
        <line x1="470" y1="470" x2="250" y2="250" stroke="url(#nGoldFine)" strokeWidth="0.8" />

        {/* ─── Cross lines (midpoint to midpoint) ─── */}
        <line x1="30" y1="250" x2="470" y2="250" stroke="#d4a853" strokeWidth="0.3" strokeOpacity="0.18" />
        <line x1="250" y1="30" x2="250" y2="470" stroke="#d4a853" strokeWidth="0.3" strokeOpacity="0.18" />

        {/* ─── Ascendant glow on House 1 ─── */}
        <path d={HOUSE_PATHS[1].path} fill="url(#nAscGlow)" stroke="none" />

        {/* ─── House sections ─── */}
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
              {/* Clickable region */}
              <path
                d={path}
                fill={isSelected
                  ? 'rgba(212,168,83,0.14)'
                  : planetsInHouse.length > 0
                  ? 'rgba(212,168,83,0.025)'
                  : 'transparent'}
                stroke={isSelected ? 'rgba(212,168,83,0.5)' : 'none'}
                strokeWidth={isSelected ? '1.5' : '0'}
                filter={isSelected ? 'url(#nSelGlow)' : undefined}
                className="transition-all duration-200 hover:fill-[rgba(212,168,83,0.06)]"
              />

              {/* Sign name */}
              <text
                x={signX}
                y={signY}
                fill={isAsc ? '#f0d48a' : 'rgba(212,168,83,0.85)'}
                fontSize={isAsc ? '14' : '12'}
                fontWeight={isAsc ? '700' : '600'}
                textAnchor="middle"
                dominantBaseline="middle"
                letterSpacing="0.5"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                {rashi?.name[locale]}
              </text>

              {/* House number */}
              <text
                x={signX}
                y={signY + (isAsc || parseInt(houseNum) === 7 ? 16 : parseInt(houseNum) <= 3 || parseInt(houseNum) >= 10 ? 15 : -15)}
                fill={isAsc ? 'rgba(240,212,138,0.85)' : 'rgba(212,168,83,0.7)'}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {houseNum}
              </text>

              {/* ─── Natal Planets — abbreviation style with colored dots ─── */}
              {planetsInHouse.map((planetId, pIdx) => {
                const color = PLANET_COLORS[planetId] || '#e8e6e3';
                const totalNatal = planetsInHouse.length;
                const transitPlanets = transitData?.houses[hIdx] || [];
                const totalAll = totalNatal + transitPlanets.length;
                const count = totalNatal;
                const cols = count <= 2 ? count : Math.min(count, 3);
                const col = pIdx % cols;
                const row = Math.floor(pIdx / cols);
                const spacing = totalAll > 4 ? 24 : count <= 2 ? 36 : 28;
                const offsetX = (col - (cols - 1) / 2) * spacing;
                const natalRows = Math.ceil(count / cols);
                const baseOffsetY = transitPlanets.length > 0 ? -6 : 0;
                const offsetY = row * 22 - (count > cols ? 8 : 0) + baseOffsetY;
                let abbr = PLANET_ABBR[planetId]?.[locale] || PLANET_ABBR[planetId]?.en || '';
                if (retrogradeIds?.has(planetId)) abbr += 'ᴿ';
                if (combustIds?.has(planetId)) abbr += '☄';

                return (
                  <g key={planetId}>
                    <circle cx={cx + offsetX - (isDevanagari ? 11 : 10)} cy={cy + offsetY} r="3" fill={color} opacity="0.9" />
                    <circle cx={cx + offsetX} cy={cy + offsetY} r="14" fill={color} opacity="0.06" />
                    <text
                      x={cx + offsetX + 2} y={cy + offsetY} fill={color}
                      fontSize="13" fontWeight="700" textAnchor="middle" dominantBaseline="middle"
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : { fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.5px' }}
                    >{abbr}</text>
                  </g>
                );
              })}

              {/* ─── Transit Planets — outlined style, offset below natal ─── */}
              {transitData && (() => {
                const transitPlanets = transitData.houses[hIdx] || [];
                if (transitPlanets.length === 0) return null;
                const natalCount = planetsInHouse.length;
                const natalCols = natalCount <= 2 ? natalCount : Math.min(natalCount, 3);
                const natalRows = Math.ceil(natalCount / (natalCols || 1));
                const tBaseY = natalCount > 0 ? natalRows * 20 + 2 : 0;
                return transitPlanets.map((planetId, pIdx) => {
                  const color = PLANET_COLORS[planetId] || '#e8e6e3';
                  const count = transitPlanets.length;
                  const cols = count <= 2 ? count : Math.min(count, 3);
                  const col = pIdx % cols;
                  const row = Math.floor(pIdx / cols);
                  const spacing = count <= 2 ? 36 : 24;
                  const offsetX = (col - (cols - 1) / 2) * spacing;
                  const offsetY = tBaseY + row * 18 - 6;
                  const abbr = PLANET_ABBR[planetId]?.[locale] || PLANET_ABBR[planetId]?.en || '';

                  return (
                    <g key={`t-${planetId}`} opacity="0.65">
                      <circle cx={cx + offsetX - (isDevanagari ? 11 : 10)} cy={cy + offsetY} r="2.5" fill="none" stroke={color} strokeWidth="1" />
                      <text
                        x={cx + offsetX + 2} y={cy + offsetY} fill={color}
                        fontSize="10" fontWeight="600" textAnchor="middle" dominantBaseline="middle"
                        style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : { fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.3px' }}
                      >{abbr}</text>
                    </g>
                  );
                });
              })()}
            </g>
          );
        })}

        {/* ─── Ascendant label ─── */}
        <text x="250" y="16" fill="#f0d48a" fontSize="10" textAnchor="middle" fontWeight="600" letterSpacing="2" opacity="0.8">
          {isDevanagari ? 'लग्न' : 'ASC'}
        </text>

        {/* ─── Corner ornaments — classical feel ─── */}
        {/* Outer corners */}
        <g opacity="0.5">
          {/* Top-left */}
          <line x1="18" y1="30" x2="18" y2="18" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="18" y1="18" x2="30" y2="18" stroke="#d4a853" strokeWidth="1.5" />
          {/* Top-right */}
          <line x1="470" y1="18" x2="482" y2="18" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="482" y1="18" x2="482" y2="30" stroke="#d4a853" strokeWidth="1.5" />
          {/* Bottom-left */}
          <line x1="18" y1="470" x2="18" y2="482" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="18" y1="482" x2="30" y2="482" stroke="#d4a853" strokeWidth="1.5" />
          {/* Bottom-right */}
          <line x1="470" y1="482" x2="482" y2="482" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="482" y1="482" x2="482" y2="470" stroke="#d4a853" strokeWidth="1.5" />
        </g>

        {/* Diamond point markers */}
        <circle cx="250" cy="30" r="2.5" fill="#d4a853" opacity="0.7" />
        <circle cx="470" cy="250" r="2.5" fill="#d4a853" opacity="0.7" />
        <circle cx="250" cy="470" r="2.5" fill="#d4a853" opacity="0.7" />
        <circle cx="30" cy="250" r="2.5" fill="#d4a853" opacity="0.7" />
      </motion.svg>
    </div>
  );
}
