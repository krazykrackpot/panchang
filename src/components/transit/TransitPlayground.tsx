'use client';

/**
 * TransitPlayground — interactive Vedic transit sandbox.
 *
 * Left panel (60%): North Indian diamond chart with natal planets (fixed dots)
 * and transit planets (draggable outlined circles).
 * Right panel (40%): real-time gochara analysis panel.
 *
 * Drag implementation: onMouseDown/onMouseMove/onMouseUp on SVG overlay.
 * On release, the transit planet snaps to whichever house the pointer is over.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { analyzeGochara, type GocharaResult, type TransitInput } from '@/lib/transit/gochara-engine';
import type { KundaliData } from '@/types/kundali';
import type { SkyPlanetPosition } from '@/lib/sky/positions';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Planet colors (id 0-6: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) */
const PLANET_COLORS: Record<number, string> = {
  0: '#FF6B35', // Sun
  1: '#C0C0C0', // Moon
  2: '#DC143C', // Mars
  3: '#50C878', // Mercury
  4: '#FFD700', // Jupiter
  5: '#FF69B4', // Venus
  6: '#4169E1', // Saturn
};

const PLANET_NAMES_EN: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter', 5: 'Venus', 6: 'Saturn',
};

const PLANET_ABBR: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa',
};

const RASHI_NAMES: Record<number, string> = {
  1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer',
  5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Scorpio',
  9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces',
};

/**
 * Good houses from natal Moon for each planet (from VEDHA_TABLE in gochara-engine).
 * Used to display quality labels.
 */
const GOOD_HOUSES: Record<number, number[]> = {
  0: [3, 6, 10, 11],
  1: [1, 3, 6, 7, 10, 11],
  2: [3, 6, 11],
  3: [2, 4, 6, 8, 10, 11],
  4: [2, 5, 7, 9, 11],
  5: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  6: [3, 6, 11],
};

const HOUSE_MEANING: Record<number, string> = {
  1: 'self/body', 2: 'wealth', 3: 'siblings/courage', 4: 'home/mother',
  5: 'children/intellect', 6: 'enemies/health', 7: 'relationships',
  8: 'longevity/secrets', 9: 'dharma/luck', 10: 'career/status',
  11: 'gains/desires', 12: 'loss/liberation',
};

// ---------------------------------------------------------------------------
// North Indian chart layout: 12-house grid in 4×4 diamond
// Each entry: [col, row, houseNumber, clipPath-relative polygon points]
// The SVG is 400×400. Each cell is 100×100.
// House order follows North Indian convention.
// ---------------------------------------------------------------------------

type HouseBox = {
  house: number;   // 1-12
  x: number;       // top-left x of 100x100 cell
  y: number;       // top-left y of 100x100 cell
  cx: number;      // centre x
  cy: number;      // centre y
  // polygon points for the house region (relative to SVG origin)
  polygon: string; // SVG polygon points attribute
};

/**
 * North Indian diamond layout:
 *
 *   [--][12][01][02]
 *   [11][--][--][03]
 *   [10][--][--][04]
 *   [--][09][08][05]   ← wait, this is wrong
 *
 * Correct NI layout (house numbers in each 100×100 cell, 0-indexed grid):
 *   (0,0)=12  (1,0)=1  (2,0)=2  (3,0)=3
 *   (0,1)=11  center    center  (3,1)=4
 *   (0,2)=10  center    center  (3,2)=5
 *   (0,3)=9   (1,3)=8  (2,3)=7  (3,3)=6
 *
 * Center cells are split diagonally — house 1 is top diamond, house 7 is bottom diamond.
 * For simplicity we use simple rectangular cells for houses around the border,
 * and split the center 2×2 into 4 triangles for houses...
 * Actually the canonical NI chart has the center diamond showing lagna info.
 * Let's use a proper polygon-based layout.
 *
 * Simplified approach: full 4×4 grid where the 4 center cells form a diamond.
 * The 4 corner grid cells (0,0), (3,0), (0,3), (3,3) are diagonal triangles.
 * The 4 edge cells are rectangles.
 * The center 2×2 is split into 4 triangles: top=house1, right=house7(?).
 *
 * For interactivity, we'll use polygons and hit-test via containsPoint.
 */

const CHART_SIZE = 400;

// House boxes with polygons for the North Indian layout
// SVG coordinate space: 0-400 × 0-400
// Each "cell" is 100×100
const HOUSE_LAYOUT: HouseBox[] = [
  // Top row (y=0..100)
  { house: 12, x: 0,   y: 0,   cx: 50,  cy: 50,  polygon: '0,0 100,0 100,100 0,100' },
  { house: 1,  x: 100, y: 0,   cx: 150, cy: 50,  polygon: '100,0 200,0 200,100 100,100' },
  { house: 2,  x: 200, y: 0,   cx: 250, cy: 50,  polygon: '200,0 300,0 300,100 200,100' },
  { house: 3,  x: 300, y: 0,   cx: 350, cy: 50,  polygon: '300,0 400,0 400,100 300,100' },
  // Left & right middle rows
  { house: 11, x: 0,   y: 100, cx: 50,  cy: 150, polygon: '0,100 100,100 100,200 0,200' },
  { house: 4,  x: 300, y: 100, cx: 350, cy: 150, polygon: '300,100 400,100 400,200 300,200' },
  { house: 10, x: 0,   y: 200, cx: 50,  cy: 250, polygon: '0,200 100,200 100,300 0,300' },
  { house: 5,  x: 300, y: 200, cx: 350, cy: 250, polygon: '300,200 400,200 400,300 300,300' },
  // Bottom row (y=300..400)
  { house: 9,  x: 0,   y: 300, cx: 50,  cy: 350, polygon: '0,300 100,300 100,400 0,400' },
  { house: 8,  x: 100, y: 300, cx: 150, cy: 350, polygon: '100,300 200,300 200,400 100,400' },
  { house: 7,  x: 200, y: 300, cx: 250, cy: 350, polygon: '200,300 300,300 300,400 200,400' },
  { house: 6,  x: 300, y: 300, cx: 350, cy: 350, polygon: '300,300 400,300 400,400 300,400' },
];

/** Find which house box contains a point (x, y) in SVG coordinates */
function getHouseAtPoint(svgX: number, svgY: number): number | null {
  for (const box of HOUSE_LAYOUT) {
    if (svgX >= box.x && svgX < box.x + 100 && svgY >= box.y && svgY < box.y + 100) {
      // Center cells (100-300 x, 100-300 y) are not houses
      if (svgX >= 100 && svgX < 300 && svgY >= 100 && svgY < 300) return null;
      return box.house;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TransitPlaygroundProps {
  natal: KundaliData;
  initialSkyPositions: SkyPlanetPosition[];
  locale: string;
}

interface DragState {
  planetId: number;
  svgX: number;
  svgY: number;
}

// ---------------------------------------------------------------------------
// Helper: convert sign (1-12) to house number given ascendant sign
// ---------------------------------------------------------------------------
function signToHouse(sign: number, ascSign: number): number {
  return ((sign - ascSign + 12) % 12) + 1;
}

// ---------------------------------------------------------------------------
// Compute gochara analysis
// ---------------------------------------------------------------------------
function computeAnalysis(
  transitHouses: Record<number, number[]>,
  ascSign: number,
  natalMoonSign: number,
  ashtakavargaReduced?: number[][]
): GocharaResult[] {
  // Convert house positions back to signs
  const transits: TransitInput[] = [];
  for (const [houseStr, planetIds] of Object.entries(transitHouses)) {
    const house = parseInt(houseStr, 10);
    // sign = (ascSign + house - 2) % 12 + 1
    const sign = ((ascSign + house - 2) % 12) + 1;
    for (const pid of planetIds) {
      if (pid >= 0 && pid <= 6) {
        transits.push({ id: pid, sign });
      }
    }
  }
  return analyzeGochara(transits, natalMoonSign, ashtakavargaReduced);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PlanetDot({
  cx, cy, planetId, isTransit = false, label,
}: {
  cx: number; cy: number; planetId: number; isTransit?: boolean; label?: string;
}) {
  const color = PLANET_COLORS[planetId] ?? '#aaa';
  const r = isTransit ? 9 : 5;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={isTransit ? `${color}80` : color}
        stroke={color}
        strokeWidth={isTransit ? 2 : 0}
      />
      {label && (
        <text
          x={cx}
          y={cy + r + 9}
          textAnchor="middle"
          fontSize={8}
          fill={color}
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Quality badge helper
// ---------------------------------------------------------------------------
function QualityBadge({ quality }: { quality: GocharaResult['quality'] }) {
  const colors: Record<string, string> = {
    strong: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    moderate: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    weak: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    adverse: 'text-red-400 bg-red-500/10 border-red-500/30',
  };
  return (
    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${colors[quality] ?? colors.weak}`}>
      {quality}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TransitPlayground({ natal, initialSkyPositions, locale }: TransitPlaygroundProps) {
  const ascSign = natal.ascendant.sign; // 1-12
  const natalMoonSign = natal.planets.find(p => p.planet.id === 1)?.sign ?? ascSign;
  const ashtakavargaReduced = natal.ashtakavarga?.reducedBpiTable;

  // Map each transit planet (0-6) to house based on sky positions
  function buildInitialTransitHouses(): Record<number, number[]> {
    const result: Record<number, number[]> = {};
    for (let h = 1; h <= 12; h++) result[h] = [];
    for (const pos of initialSkyPositions) {
      if (pos.id < 0 || pos.id > 6) continue;
      const house = signToHouse(pos.rashi, ascSign);
      if (!result[house]) result[house] = [];
      result[house].push(pos.id);
    }
    return result;
  }

  const [transitHouses, setTransitHouses] = useState<Record<number, number[]>>(buildInitialTransitHouses);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [jupiterPreset, setJupiterPreset] = useState<number | null>(null);
  const [saturnPreset, setSaturnPreset] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Derived: natal planet house assignments
  const natalHouses: Record<number, number[]> = {};
  for (let h = 1; h <= 12; h++) natalHouses[h] = [];
  for (const planet of natal.planets) {
    const h = planet.house;
    if (!natalHouses[h]) natalHouses[h] = [];
    natalHouses[h].push(planet.planet.id);
  }

  // Analysis
  const analysis = computeAnalysis(transitHouses, ascSign, natalMoonSign, ashtakavargaReduced);

  // ---------------------------------------------------------------------------
  // Drag helpers
  // ---------------------------------------------------------------------------

  function getSVGPoint(e: React.MouseEvent | MouseEvent): { x: number; y: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const scaleX = CHART_SIZE / rect.width;
    const scaleY = CHART_SIZE / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function handleMouseDown(e: React.MouseEvent, planetId: number) {
    e.preventDefault();
    const pt = getSVGPoint(e);
    if (!pt) return;
    setDrag({ planetId, svgX: pt.x, svgY: pt.y });
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!drag) return;
    const pt = getSVGPoint(e);
    if (!pt) return;
    setDrag(prev => prev ? { ...prev, svgX: pt.x, svgY: pt.y } : null);
    const house = getHouseAtPoint(pt.x, pt.y);
    setHoveredHouse(house);
  }, [drag]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!drag) return;
    const pt = getSVGPoint(e);
    if (pt) {
      const targetHouse = getHouseAtPoint(pt.x, pt.y);
      if (targetHouse !== null) {
        setTransitHouses(prev => {
          const next: Record<number, number[]> = {};
          for (const [h, ids] of Object.entries(prev)) {
            next[parseInt(h, 10)] = ids.filter(id => id !== drag.planetId);
          }
          next[targetHouse] = [...(next[targetHouse] ?? []), drag.planetId];
          return next;
        });
      }
    }
    setDrag(null);
    setHoveredHouse(null);
  }, [drag]);

  useEffect(() => {
    if (drag) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drag, handleMouseMove, handleMouseUp]);

  // ---------------------------------------------------------------------------
  // Preset buttons
  // ---------------------------------------------------------------------------

  function resetToCurrentTransits() {
    setTransitHouses(buildInitialTransitHouses());
    setJupiterPreset(null);
    setSaturnPreset(null);
  }

  function cycleJupiter() {
    const next = jupiterPreset === null ? 1 : (jupiterPreset % 12) + 1;
    setJupiterPreset(next);
    setTransitHouses(prev => {
      const next2: Record<number, number[]> = {};
      for (const [h, ids] of Object.entries(prev)) {
        next2[parseInt(h, 10)] = ids.filter(id => id !== 4); // remove Jupiter
      }
      next2[next] = [...(next2[next] ?? []), 4];
      return next2;
    });
  }

  function cycleSaturn() {
    const next = saturnPreset === null ? 1 : (saturnPreset % 12) + 1;
    setSaturnPreset(next);
    setTransitHouses(prev => {
      const next2: Record<number, number[]> = {};
      for (const [h, ids] of Object.entries(prev)) {
        next2[parseInt(h, 10)] = ids.filter(id => id !== 6); // remove Saturn
      }
      next2[next] = [...(next2[next] ?? []), 6];
      return next2;
    });
  }

  // ---------------------------------------------------------------------------
  // Render: SVG chart
  // ---------------------------------------------------------------------------

  // Place natal planets in a house — stack them horizontally
  function natalPlanetPositions(box: HouseBox): { cx: number; cy: number; pid: number }[] {
    const pids = natalHouses[box.house] ?? [];
    const count = pids.length;
    return pids.map((pid, i) => ({
      pid,
      cx: box.cx + (i - (count - 1) / 2) * 10,
      cy: box.cy - 14,
    }));
  }

  // Place transit planets — slightly below natal
  function transitPlanetPositions(box: HouseBox, excluded?: number): { cx: number; cy: number; pid: number }[] {
    const pids = (transitHouses[box.house] ?? []).filter(id => id !== excluded);
    const count = pids.length;
    return pids.map((pid, i) => ({
      pid,
      cx: box.cx + (i - (count - 1) / 2) * 14,
      cy: box.cy + 12,
    }));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* ------------------------------------------------------------------ */}
      {/* Left: Chart + preset buttons                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-4 lg:w-[60%]">
        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={resetToCurrentTransits}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gold-primary/15 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/25 transition-colors"
          >
            Current Transits
          </button>
          <button
            onClick={cycleJupiter}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
          >
            Jupiter House {jupiterPreset ?? '→'} {jupiterPreset ? `(${jupiterPreset}/12)` : ''}
          </button>
          <button
            onClick={cycleSaturn}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#4169E1]/30 text-[#4169E1] hover:bg-[#4169E1]/10 transition-colors"
          >
            Saturn House {saturnPreset ?? '→'} {saturnPreset ? `(${saturnPreset}/12)` : ''}
          </button>
        </div>

        {/* Chart */}
        <div
          className="relative rounded-xl border border-gold-primary/20 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a1040, #0a0e27)' }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
            className="w-full h-auto select-none"
            style={{ cursor: drag ? 'grabbing' : 'default' }}
          >
            {/* House grid */}
            {HOUSE_LAYOUT.map(box => (
              <g key={box.house}>
                <rect
                  x={box.x}
                  y={box.y}
                  width={100}
                  height={100}
                  fill={hoveredHouse === box.house ? 'rgba(212,168,83,0.12)' : 'transparent'}
                  stroke="rgba(138,109,43,0.35)"
                  strokeWidth={0.75}
                />
                {/* House number */}
                <text
                  x={box.x + 6}
                  y={box.y + 14}
                  fontSize={9}
                  fill="rgba(138,109,43,0.7)"
                  fontWeight="500"
                >
                  {box.house}
                </text>
              </g>
            ))}

            {/* Center diamond area — just an inert label */}
            <rect
              x={100} y={100} width={200} height={200}
              fill="rgba(10,14,39,0.85)"
              stroke="rgba(138,109,43,0.25)"
              strokeWidth={0.75}
            />
            {/* Diagonal lines for inner diamond */}
            <line x1={100} y1={100} x2={300} y2={300} stroke="rgba(138,109,43,0.2)" strokeWidth={0.75} />
            <line x1={300} y1={100} x2={100} y2={300} stroke="rgba(138,109,43,0.2)" strokeWidth={0.75} />
            <text x={200} y={193} textAnchor="middle" fontSize={9} fill="rgba(212,168,83,0.6)">
              Asc: {natal.ascendant.signName.en}
            </text>
            <text x={200} y={207} textAnchor="middle" fontSize={7} fill="rgba(138,109,43,0.7)">
              {natal.birthData.name || 'Natal Chart'}
            </text>
            <text x={200} y={219} textAnchor="middle" fontSize={7} fill="rgba(138,109,43,0.5)">
              Moon: {RASHI_NAMES[natalMoonSign] ?? natalMoonSign}
            </text>

            {/* Natal planets (fixed dots) */}
            {HOUSE_LAYOUT.map(box =>
              natalPlanetPositions(box).map(({ cx, cy, pid }) => (
                <PlanetDot key={`natal-${pid}`} cx={cx} cy={cy} planetId={pid} label={PLANET_ABBR[pid]} />
              ))
            )}

            {/* Transit planets (draggable circles) */}
            {HOUSE_LAYOUT.map(box =>
              transitPlanetPositions(box, drag?.planetId).map(({ cx, cy, pid }) => (
                <g
                  key={`transit-${pid}`}
                  style={{ cursor: 'grab' }}
                  onMouseDown={e => handleMouseDown(e, pid)}
                >
                  <PlanetDot cx={cx} cy={cy} planetId={pid} isTransit label={PLANET_ABBR[pid]} />
                </g>
              ))
            )}

            {/* Dragging ghost */}
            {drag && (
              <g style={{ pointerEvents: 'none' }}>
                <PlanetDot
                  cx={drag.svgX}
                  cy={drag.svgY}
                  planetId={drag.planetId}
                  isTransit
                  label={PLANET_ABBR[drag.planetId]}
                />
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="px-3 pb-3 flex items-center gap-4 text-[10px] text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-gold-primary" />
              Natal (fixed)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-gold-primary bg-gold-primary/30" />
              Transit (drag to move)
            </span>
          </div>
        </div>

        {/* Planet color legend */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
          {Object.entries(PLANET_NAMES_EN).map(([idStr, name]) => {
            const id = parseInt(idStr, 10);
            return (
              <div key={id} className="flex items-center gap-1 text-[10px]">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: PLANET_COLORS[id] }}
                />
                <span className="text-text-secondary">{name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right: Analysis panel                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="lg:w-[40%] flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gold-light">Gochara Analysis</h3>
        <p className="text-[11px] text-text-secondary leading-relaxed">
          Counted from natal Moon in <span className="text-gold-light">{RASHI_NAMES[natalMoonSign] ?? natalMoonSign}</span> (house 1).
          Drag transit planets to change positions.
        </p>

        <div className="flex flex-col gap-2">
          {analysis.map(result => {
            const color = PLANET_COLORS[result.planet] ?? '#aaa';
            const houseSign = ((ascSign + result.houseFromMoon - 2) % 12) + 1;
            return (
              <div
                key={result.planet}
                className="rounded-lg border border-gold-primary/15 bg-bg-secondary/60 p-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-semibold text-text-primary">
                      {PLANET_NAMES_EN[result.planet]}
                    </span>
                    <span className="text-[10px] text-text-secondary">
                      in {RASHI_NAMES[result.transitSign] ?? `sign ${result.transitSign}`}
                    </span>
                  </div>
                  <QualityBadge quality={result.quality} />
                </div>

                <div className="text-[11px] text-text-secondary space-y-0.5">
                  <div>
                    House <span className="text-gold-light font-medium">{result.houseFromMoon}</span>
                    {' '}from Moon
                    {GOOD_HOUSES[result.planet]?.includes(result.houseFromMoon)
                      ? <span className="text-emerald-400"> ✓ good house</span>
                      : <span className="text-red-400/80"> adverse house</span>
                    }
                  </div>
                  <div className="text-text-secondary/70 italic">
                    {HOUSE_MEANING[result.houseFromMoon] && (
                      <span>({HOUSE_MEANING[result.houseFromMoon]})</span>
                    )}
                  </div>
                  {result.vedhaActive && result.vedhaPlanet !== undefined && (
                    <div className="text-amber-400">
                      ⚠ Vedha by {PLANET_NAMES_EN[result.vedhaPlanet]} in house {result.vedhaHouse}
                    </div>
                  )}
                  {result.bavScore !== undefined && (
                    <div className="text-text-secondary/80">
                      BAV score: {result.bavScore}/8
                    </div>
                  )}
                </div>

                {/* Gochara narrative */}
                <div className="mt-1.5 text-[10px] text-text-secondary/90 leading-relaxed border-t border-gold-primary/10 pt-1.5">
                  {gocharaDescription(result.planet, result.houseFromMoon)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Double transit summary */}
        <DoubleTransitSummary analysis={analysis} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Double transit summary
// ---------------------------------------------------------------------------

function DoubleTransitSummary({ analysis }: { analysis: GocharaResult[] }) {
  const jupResult = analysis.find(r => r.planet === 4);
  const satResult = analysis.find(r => r.planet === 6);
  if (!jupResult || !satResult) return null;

  const jupHouse = jupResult.houseFromMoon;
  const satHouse = satResult.houseFromMoon;

  // Double transit: both activate same house
  const isDouble = jupHouse === satHouse;
  const jupGood = GOOD_HOUSES[4].includes(jupHouse);
  const satGood = GOOD_HOUSES[6].includes(satHouse);

  return (
    <div className="rounded-lg border border-gold-primary/20 bg-bg-secondary/40 p-3">
      <h4 className="text-xs font-semibold text-gold-light mb-2">Double Transit (Jup + Sat)</h4>
      <div className="text-[11px] text-text-secondary space-y-1">
        <div>
          Jupiter: house <span className="text-[#FFD700] font-medium">{jupHouse}</span>
          {jupGood ? ' ✓' : ''}
        </div>
        <div>
          Saturn: house <span className="text-[#4169E1] font-medium">{satHouse}</span>
          {satGood ? ' ✓' : ''}
        </div>
        {isDouble && (
          <div className="text-emerald-400 font-semibold mt-1">
            Both in house {jupHouse} — powerful double transit activation
          </div>
        )}
        {!isDouble && jupGood && satGood && (
          <div className="text-sky-400 mt-1">Both in good houses — favourable period overall</div>
        )}
        {!isDouble && !jupGood && !satGood && (
          <div className="text-amber-400 mt-1">Both in adverse houses — challenging period</div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gochara narrative descriptions
// ---------------------------------------------------------------------------

function gocharaDescription(planetId: number, house: number): string {
  const p = PLANET_NAMES_EN[planetId];
  const h = HOUSE_MEANING[house] ?? `house ${house}`;
  const good = GOOD_HOUSES[planetId]?.includes(house);

  if (good) {
    const phrases: Record<number, Record<number, string>> = {
      4: {
        2: 'Jupiter expands wealth and family prosperity.',
        5: 'Jupiter blesses intellect, children, and creative pursuits.',
        7: 'Jupiter favours partnerships and marriage prospects.',
        9: 'Jupiter strengthens dharma, fortune, and spiritual growth.',
        11: 'Jupiter brings gains, fulfillment of desires, and social recognition.',
      },
      6: {
        3: 'Saturn builds discipline, courage, and stamina.',
        6: 'Saturn defeats enemies and strengthens health routines.',
        11: 'Saturn grants gains through persistent effort.',
      },
      0: {
        3: 'Sun boosts confidence and creative expression.',
        6: 'Sun overcomes obstacles and gives vitality.',
        10: 'Sun shines on career and public recognition.',
        11: 'Sun brings gains and government favour.',
      },
      1: {
        1: 'Moon brings emotional clarity and good health.',
        3: 'Moon supports communication and short journeys.',
        7: 'Moon favours domestic harmony and relationships.',
      },
    };
    return phrases[planetId]?.[house] ?? `${p} in good house — ${h} matters are supported.`;
  }
  return `${p} transiting house ${house} may create pressure around ${h}. Monitor and adjust timing.`;
}
