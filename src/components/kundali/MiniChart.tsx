'use client';

import { useState } from 'react';
import { NORTH_DIAMOND_HOUSE_PATHS } from '@/lib/constants/chart-geometry';

interface MiniChartProps {
  positions: { planetId: number; house: number; fromLagna?: boolean }[];
  size?: number;
  /** Initial chart style — default 'north' */
  defaultStyle?: 'north' | 'south';
}

const PLANET_ABBR: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

const PLANET_COLORS: Record<number, string> = {
  0: '#f0a020', 1: '#b0c8f0', 2: '#e84040', 3: '#50d890',
  4: '#f0c030', 5: '#f080c0', 6: '#8080d0', 7: '#70c0b0', 8: '#c07050',
};

// ─── North Indian diamond layout (500×500 viewBox) ──────────────────────────

// Geometry imported from canonical NORTH_DIAMOND_HOUSE_PATHS; cx/cy/
// labelX/labelY are MiniChart's per-surface visual choices. Audit P5f #23.
const NORTH_HOUSES: Record<number, { path: string; cx: number; cy: number; labelX: number; labelY: number }> = {
  1:  { path: NORTH_DIAMOND_HOUSE_PATHS[1],  cx: 250, cy: 130, labelX: 250, labelY: 60 },
  2:  { path: NORTH_DIAMOND_HOUSE_PATHS[2],  cx: 138, cy: 62,  labelX: 100, labelY: 42 },
  3:  { path: NORTH_DIAMOND_HOUSE_PATHS[3],  cx: 60,  cy: 138, labelX: 40,  labelY: 100 },
  4:  { path: NORTH_DIAMOND_HOUSE_PATHS[4],  cx: 130, cy: 250, labelX: 60,  labelY: 250 },
  5:  { path: NORTH_DIAMOND_HOUSE_PATHS[5],  cx: 60,  cy: 362, labelX: 40,  labelY: 400 },
  6:  { path: NORTH_DIAMOND_HOUSE_PATHS[6],  cx: 138, cy: 438, labelX: 100, labelY: 458 },
  7:  { path: NORTH_DIAMOND_HOUSE_PATHS[7],  cx: 250, cy: 370, labelX: 250, labelY: 440 },
  8:  { path: NORTH_DIAMOND_HOUSE_PATHS[8],  cx: 362, cy: 438, labelX: 400, labelY: 458 },
  9:  { path: NORTH_DIAMOND_HOUSE_PATHS[9],  cx: 440, cy: 362, labelX: 460, labelY: 400 },
  10: { path: NORTH_DIAMOND_HOUSE_PATHS[10], cx: 370, cy: 250, labelX: 440, labelY: 250 },
  11: { path: NORTH_DIAMOND_HOUSE_PATHS[11], cx: 440, cy: 138, labelX: 460, labelY: 100 },
  12: { path: NORTH_DIAMOND_HOUSE_PATHS[12], cx: 362, cy: 62,  labelX: 400, labelY: 42 },
};

// ─── South Indian grid layout (4×4 grid, houses on perimeter) ───────────────

// Signs are FIXED in South Indian — house numbers rotate based on lagna.
// For the example chart (Aries lagna), sign 1 = house 1 at Pisces position (row 0, col 0).
// South Indian grid: 12=top-left, 1=top-left+1, 2=top-left+2, 3=top-right, etc.
const SOUTH_GRID: Record<number, { col: number; row: number }> = {
  12: { col: 0, row: 0 },
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
};

// Sign names for South Indian chart (signs are fixed, houses rotate)
const SIGN_ABBR = ['', 'Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];

function groupByHouse(positions: MiniChartProps['positions']): Record<number, number[]> {
  const map: Record<number, number[]> = {};
  for (const p of positions) {
    if (!map[p.house]) map[p.house] = [];
    map[p.house].push(p.planetId);
  }
  return map;
}

// ─── North Indian Diamond SVG ───────────────────────────────────────────────

function NorthSVG({ planetsByHouse }: { planetsByHouse: Record<number, number[]> }) {
  return (
    <svg viewBox="0 0 500 500" width="100%" height="100%" role="img" aria-label="North Indian birth chart">
      <rect x="0" y="0" width="500" height="500" fill="#0a0e27" />
      <rect x="28" y="28" width="444" height="444" fill="none" stroke="#d4a853" strokeWidth="1.2" strokeOpacity="0.3" />
      <polygon points="250,30 470,250 250,470 30,250" fill="none" stroke="#d4a853" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="30" y1="30" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.2" />
      <line x1="470" y1="30" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.2" />
      <line x1="30" y1="470" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.2" />
      <line x1="470" y1="470" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.2" />
      {Object.entries(NORTH_HOUSES).map(([houseStr, { labelX, labelY, cx, cy }]) => {
        const h = parseInt(houseStr);
        const planets = planetsByHouse[h] || [];
        return (
          <g key={h}>
            <text x={labelX} y={labelY} fill="#d4a853" fillOpacity="0.35" fontSize="20" fontWeight="600" textAnchor="middle" dominantBaseline="middle">{h}</text>
            {planets.map((pid, idx) => {
              const offset = (idx - (planets.length - 1) / 2) * 30;
              return (
                <text key={pid} x={cx} y={cy + offset} fill={PLANET_COLORS[pid] ?? '#e6e2d8'} fontSize="22" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
                  {PLANET_ABBR[pid] ?? '??'}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// ─── South Indian Grid SVG ──────────────────────────────────────────────────

function SouthSVG({ planetsByHouse }: { planetsByHouse: Record<number, number[]> }) {
  const cell = 125; // 500 / 4
  return (
    <svg viewBox="0 0 500 500" width="100%" height="100%" role="img" aria-label="South Indian birth chart">
      <rect x="0" y="0" width="500" height="500" fill="#0a0e27" />
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}>
          <line x1={i * cell} y1="0" x2={i * cell} y2="500" stroke="#d4a853" strokeWidth="0.8" strokeOpacity="0.3" />
          <line x1="0" y1={i * cell} x2="500" y2={i * cell} stroke="#d4a853" strokeWidth="0.8" strokeOpacity="0.3" />
        </g>
      ))}
      {/* Centre label */}
      <text x="250" y="240" fill="#d4a853" fillOpacity="0.25" fontSize="18" fontWeight="600" textAnchor="middle" dominantBaseline="middle">Aries</text>
      <text x="250" y="265" fill="#d4a853" fillOpacity="0.25" fontSize="18" fontWeight="600" textAnchor="middle" dominantBaseline="middle">Lagna</text>

      {/* Cross-hatch centre */}
      <line x1={cell} y1={cell} x2={cell * 3} y2={cell * 3} stroke="#d4a853" strokeWidth="0.4" strokeOpacity="0.15" />
      <line x1={cell * 3} y1={cell} x2={cell} y2={cell * 3} stroke="#d4a853" strokeWidth="0.4" strokeOpacity="0.15" />

      {Object.entries(SOUTH_GRID).map(([houseStr, { col, row }]) => {
        const h = parseInt(houseStr);
        const planets = planetsByHouse[h] || [];
        const cx = col * cell + cell / 2;
        const cy = row * cell + cell / 2;

        // For Aries lagna, house N = sign N, so sign = house
        const sign = h;

        return (
          <g key={h}>
            {/* Sign abbreviation (top-left of cell) */}
            <text x={col * cell + 8} y={row * cell + 18} fill="#d4a853" fillOpacity="0.35" fontSize="14" fontWeight="600">
              {SIGN_ABBR[sign]}
            </text>
            {/* House number (top-right of cell) */}
            <text x={col * cell + cell - 8} y={row * cell + 18} fill="#d4a853" fillOpacity="0.2" fontSize="12" fontWeight="600" textAnchor="end">
              {h}
            </text>

            {/* Planets */}
            {planets.length <= 2 ? (
              // Side by side
              planets.map((pid, idx) => {
                const xOff = planets.length === 1 ? 0 : (idx === 0 ? -18 : 18);
                return (
                  <text key={pid} x={cx + xOff} y={cy + 8} fill={PLANET_COLORS[pid] ?? '#e6e2d8'} fontSize="20" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
                    {PLANET_ABBR[pid] ?? '??'}
                  </text>
                );
              })
            ) : (
              // Stack in rows of 2
              planets.map((pid, idx) => {
                const row2 = Math.floor(idx / 2);
                const col2 = idx % 2;
                const xOff = col2 === 0 ? -18 : 18;
                const yOff = (row2 - Math.floor((planets.length - 1) / 2 / 2 + 0.5) / 2) * 22;
                return (
                  <text key={pid} x={cx + xOff} y={cy + yOff + 8} fill={PLANET_COLORS[pid] ?? '#e6e2d8'} fontSize="18" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
                    {PLANET_ABBR[pid] ?? '??'}
                  </text>
                );
              })
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Combined component with toggle ─────────────────────────────────────────

export default function MiniChart({ positions, size = 200, defaultStyle = 'north' }: MiniChartProps) {
  const [style, setStyle] = useState<'north' | 'south'>(defaultStyle);
  const planetsByHouse = groupByHouse(positions);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Toggle */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-gold-primary/15 bg-[#0d1022]">
        {(['north', 'south'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all"
            style={{
              background: style === s ? '#d4a85320' : 'transparent',
              color: style === s ? '#f0d48a' : '#8a8478',
            }}
          >
            {s === 'north' ? 'North' : 'South'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div
        className="border border-gold-primary/20 rounded-xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        {style === 'north' ? (
          <NorthSVG planetsByHouse={planetsByHouse} />
        ) : (
          <SouthSVG planetsByHouse={planetsByHouse} />
        )}
      </div>
    </div>
  );
}
