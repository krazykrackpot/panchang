'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { type SkyPlanetPosition } from '@/lib/sky/positions';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';

// ----------------------------------------------------------------------------
// Constants — hoisted from render path (performance rule)
// ----------------------------------------------------------------------------

const SVG_SIZE = 800;
const CX = SVG_SIZE / 2; // 400
const CY = SVG_SIZE / 2; // 400

/** Radii for concentric rings — scaled up for 800px viewBox */
const R_CENTER = 36;
const R_RASHI_INNER = 220;
const R_RASHI_OUTER = 296;
const R_PLANET_TRACK = 258; // between inner and outer rashi ring
const R_NAKSHATRA_INNER = 296;
const R_NAKSHATRA_OUTER = 350;
const R_TICK_OUTER = 350;

/** Zoom constraints */
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;

/** Planet colors by id (0=Sun … 8=Ketu) */
const PLANET_COLORS: Record<number, string> = {
  0: '#FF9500', // Sun — amber-orange
  1: '#C0C0C0', // Moon — silver
  2: '#DC143C', // Mars — crimson
  3: '#50C878', // Mercury — emerald
  4: '#FFD700', // Jupiter — gold
  5: '#FF69B4', // Venus — pink
  6: '#6B8DD6', // Saturn — slate-blue
  7: '#B8860B', // Rahu — dark-gold
  8: '#808080', // Ketu — grey
};

/** Planet short labels for chart */
const PLANET_SHORT: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

/** Glow filter IDs per planet */
const PLANET_GLOW_IDS: Record<number, string> = {
  0: 'glow-sun',
  1: 'glow-moon',
  2: 'glow-mars',
  3: 'glow-mercury',
  4: 'glow-jupiter',
  5: 'glow-venus',
  6: 'glow-saturn',
  7: 'glow-rahu',
  8: 'glow-ketu',
};

/** Element colors for rashi segments (15% opacity fill) */
const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#FF6B35',
  Earth: '#50C878',
  Air: '#6B8DD6',
  Water: '#B0BEC5',
};

/** Rashi elements by id (1-12) */
const RASHI_ELEMENTS: Record<number, string> = {
  1: 'Fire', 2: 'Earth', 3: 'Air', 4: 'Water',
  5: 'Fire', 6: 'Earth', 7: 'Air', 8: 'Water',
  9: 'Fire', 10: 'Earth', 11: 'Air', 12: 'Water',
};

// ----------------------------------------------------------------------------
// Polar projection helpers
// ----------------------------------------------------------------------------

/**
 * Convert sidereal longitude (0-360°) to SVG (x, y) at the given radius.
 * 0° Aries = 12-o'clock (top). Clockwise progression.
 *
 * angle = longitude_rad - π/2  (subtract 90° so 0° lands at top)
 */
function polarToXY(longitude: number, radius: number): { x: number; y: number } {
  const rad = (longitude * Math.PI) / 180 - Math.PI / 2;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

/**
 * SVG arc path for an annular sector (donut slice).
 * startDeg / endDeg: sidereal degrees (0-360)
 * innerR / outerR: radii
 */
function annularSectorPath(
  startDeg: number,
  endDeg: number,
  innerR: number,
  outerR: number
): string {
  const start = polarToXY(startDeg, outerR);
  const end = polarToXY(endDeg, outerR);
  const startInner = polarToXY(startDeg, innerR);
  const endInner = polarToXY(endDeg, innerR);

  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${start.x} ${start.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');
}

/**
 * SVG arc path for a partial arc (trail).
 * startDeg / endDeg: sidereal degrees, radius: circle radius
 */
function arcPath(startDeg: number, endDeg: number, radius: number): string {
  const start = polarToXY(startDeg, radius);
  const end = polarToXY(endDeg, radius);
  const span = endDeg - startDeg;
  // Normalize span to always be positive (going clockwise)
  const normalizedSpan = ((span % 360) + 360) % 360;
  const largeArc = normalizedSpan > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

/**
 * Format degrees as "DD°MM'" string.
 */
function formatDMS(deg: number): string {
  const d = Math.floor(deg);
  const mFrac = (deg - d) * 60;
  const m = Math.floor(mFrac);
  return `${d}°${String(m).padStart(2, '0')}'`;
}

// ----------------------------------------------------------------------------
// SVG Defs: glow filters + retrograde animation
// ----------------------------------------------------------------------------

function SvgDefs() {
  return (
    <defs>
      {/* Background radial gradient */}
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1a1f45" stopOpacity={0.6} />
        <stop offset="100%" stopColor="#0a0e27" stopOpacity={0} />
      </radialGradient>

      {/* Planet track gradient ring */}
      <radialGradient id="trackGlow" cx="50%" cy="50%" r="50%">
        <stop offset="88%" stopColor="#8a6d2b" stopOpacity={0} />
        <stop offset="95%" stopColor="#d4a853" stopOpacity={0.18} />
        <stop offset="100%" stopColor="#8a6d2b" stopOpacity={0} />
      </radialGradient>

      {/* Per-planet glow filters */}
      {Object.entries(PLANET_COLORS).map(([idStr, color]) => {
        const id = Number(idStr);
        const filterId = PLANET_GLOW_IDS[id];
        return (
          <filter key={filterId} id={filterId} x="-80%" y="-80%" width="260%" height="260%">
            {/* Blur the source graphic */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            {/* Colorise the blur with the planet color */}
            <feFlood floodColor={color} floodOpacity={0.65} result="flood" />
            <feComposite in="flood" in2="blur" operator="in" result="coloredBlur" />
            {/* Merge halo + original */}
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        );
      })}
    </defs>
  );
}

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------

function RashiRing({ locale = 'en' }: { locale?: string }) {
  return (
    <g aria-label="Rashi ring">
      {RASHIS.map((rashi) => {
        const startDeg = rashi.startDeg;
        const endDeg = rashi.endDeg;
        const midDeg = (startDeg + endDeg) / 2;
        const elementEn = RASHI_ELEMENTS[rashi.id] ?? 'Fire';
        const baseColor = ELEMENT_COLORS[elementEn] ?? '#FF6B35';
        const midPt = polarToXY(midDeg, (R_RASHI_INNER + R_RASHI_OUTER) / 2);

        return (
          <g key={rashi.id}>
            {/* Sector fill */}
            <path
              d={annularSectorPath(startDeg, endDeg, R_RASHI_INNER, R_RASHI_OUTER)}
              fill={baseColor}
              fillOpacity={0.13}
              stroke="#8a6d2b"
              strokeOpacity={0.35}
              strokeWidth={0.7}
            />
            {/* Rashi symbol */}
            <text
              x={midPt.x}
              y={midPt.y - 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={14}
              fill="#f0d48a"
              fontWeight="700"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {rashi.symbol}
            </text>
            {/* Rashi short name */}
            <text
              x={midPt.x}
              y={midPt.y + 9}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={9.5}
              fontWeight={500}
              fill="#d4a853"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {tl(rashi.name, locale).substring(0, 4)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function NakshatraRing({ locale = 'en' }: { locale?: string }) {
  const nakshatraSpan = 360 / 27; // ≈13.333°

  return (
    <g aria-label="Nakshatra ring">
      {NAKSHATRAS.map((nak, i) => {
        const startDeg = i * nakshatraSpan;
        const endDeg = startDeg + nakshatraSpan;
        const midDeg = startDeg + nakshatraSpan / 2;

        const midPt = polarToXY(midDeg, (R_NAKSHATRA_INNER + R_NAKSHATRA_OUTER) / 2);

        return (
          <g key={nak.id}>
            <path
              d={annularSectorPath(startDeg, endDeg, R_NAKSHATRA_INNER, R_NAKSHATRA_OUTER)}
              fill="#1a1f45"
              fillOpacity={0.5}
              stroke="#8a6d2b"
              strokeOpacity={0.25}
              strokeWidth={0.5}
            />
            <text
              x={midPt.x}
              y={midPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={8}
              fontWeight={600}
              fill="#c8a040"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {tl(nak.name, locale)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function DegreeMarkers() {
  const markers: React.ReactNode[] = [];

  for (let deg = 0; deg < 360; deg += 10) {
    const isMajor = deg % 30 === 0;
    const outerPt = polarToXY(deg, R_TICK_OUTER + (isMajor ? 10 : 4));
    const innerPt = polarToXY(deg, R_TICK_OUTER);

    markers.push(
      <line
        key={`tick-${deg}`}
        x1={innerPt.x}
        y1={innerPt.y}
        x2={outerPt.x}
        y2={outerPt.y}
        stroke={isMajor ? '#a08030' : '#4a3d1a'}
        strokeOpacity={isMajor ? 0.8 : 0.4}
        strokeWidth={isMajor ? 1.5 : 0.7}
      />
    );

    // Degree label for major ticks (every 30°)
    if (isMajor) {
      const labelPt = polarToXY(deg, R_TICK_OUTER + 20);
      markers.push(
        <text
          key={`label-${deg}`}
          x={labelPt.x}
          y={labelPt.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight={600}
          fill="#c8a040"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {deg}°
        </text>
      );
    }
  }

  return <g aria-label="Degree markers">{markers}</g>;
}

function CenterSymbol() {
  return (
    <g aria-label="Center Earth symbol">
      {/* Outer glow ring */}
      <circle cx={CX} cy={CY} r={R_CENTER + 4} fill="none" stroke="#d4a853" strokeOpacity={0.2} strokeWidth={1} />
      <circle cx={CX} cy={CY} r={R_CENTER} fill="#0d1230" stroke="#d4a853" strokeOpacity={0.5} strokeWidth={1.2} />
      {/* Om-like concentric circles */}
      <circle cx={CX} cy={CY} r={14} fill="none" stroke="#d4a853" strokeOpacity={0.4} strokeWidth={0.8} />
      <circle cx={CX} cy={CY} r={8} fill="#d4a853" fillOpacity={0.15} stroke="#d4a853" strokeOpacity={0.6} strokeWidth={0.7} />
      {/* Earth cross lines */}
      <line x1={CX - 10} y1={CY} x2={CX + 10} y2={CY} stroke="#d4a853" strokeOpacity={0.5} strokeWidth={0.8} />
      <line x1={CX} y1={CY - 10} x2={CX} y2={CY + 10} stroke="#d4a853" strokeOpacity={0.5} strokeWidth={0.8} />
      {/* Center dot */}
      <circle cx={CX} cy={CY} r={3} fill="#d4a853" fillOpacity={0.8} />
    </g>
  );
}

// ----------------------------------------------------------------------------
// Planet trail arcs (last ~30° of motion as a thin colored arc)
// ----------------------------------------------------------------------------

function PlanetTrails({ positions }: { positions: SkyPlanetPosition[] }) {
  return (
    <g aria-label="Planet trail arcs">
      {positions.map((planet) => {
        const color = PLANET_COLORS[planet.id] ?? '#ffffff';
        // Trail extends 30° behind the current longitude in the direction of recent motion.
        // Direct planets: trail is behind (lon - 30° to lon)
        // Retrograde planets: trail is behind in reverse direction (lon to lon + 30°)
        const trailSpan = 28; // degrees
        const trailStart = planet.isRetrograde
          ? planet.siderealLongitude
          : (planet.siderealLongitude - trailSpan + 360) % 360;
        const trailEnd = planet.isRetrograde
          ? (planet.siderealLongitude + trailSpan) % 360
          : planet.siderealLongitude;

        // Build a gradient along the trail: fade from 0 opacity to ~0.45
        const gradId = `trail-grad-${planet.id}`;

        return (
          <g key={`trail-${planet.id}`}>
            <defs>
              {/* Gradient along the arc direction */}
              <linearGradient id={gradId} gradientUnits="userSpaceOnUse"
                x1={polarToXY(trailStart, R_PLANET_TRACK).x}
                y1={polarToXY(trailStart, R_PLANET_TRACK).y}
                x2={polarToXY(trailEnd, R_PLANET_TRACK).x}
                y2={polarToXY(trailEnd, R_PLANET_TRACK).y}
              >
                <stop offset="0%" stopColor={color} stopOpacity={0} />
                <stop offset="100%" stopColor={color} stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <path
              d={arcPath(trailStart, trailEnd, R_PLANET_TRACK)}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </g>
  );
}

// ----------------------------------------------------------------------------
// Tooltip
// ----------------------------------------------------------------------------

interface TooltipData {
  planet: SkyPlanetPosition;
  x: number;
  y: number;
}

interface PlanetMarkersProps {
  positions: SkyPlanetPosition[];
  onHover: (data: TooltipData | null) => void;
  onSelect: (planet: SkyPlanetPosition | null) => void;
  selectedId: number | null;
  /** Whether the component has mounted (drives entry animation) */
  mounted: boolean;
}

function PlanetMarkers({ positions, onHover, onSelect, selectedId, mounted }: PlanetMarkersProps) {
  return (
    <g aria-label="Planet markers">
      {positions.map((planet) => {
        const pt = polarToXY(planet.siderealLongitude, R_PLANET_TRACK);
        const color = PLANET_COLORS[planet.id] ?? '#ffffff';
        const isSelected = selectedId === planet.id;
        const filterId = PLANET_GLOW_IDS[planet.id];

        // Entry animation: planets animate from center to their position when mounted
        // We use a CSS transition on transform. The <g> starts at center, then moves to pt.
        const translateX = mounted ? pt.x - CX : 0;
        const translateY = mounted ? pt.y - CY : 0;

        return (
          <g
            key={planet.id}
            transform={`translate(${CX}, ${CY})`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => {
              onHover({ planet, x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(isSelected ? null : planet)}
            role="button"
            aria-label={`${planet.name} at ${formatDMS(planet.siderealLongitude)}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(isSelected ? null : planet);
              }
            }}
          >
            {/* Inner group that moves from center on mount */}
            <g
              transform={`translate(${translateX}, ${translateY})`}
              style={{ transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              {/* Retrograde pulsing ring — gentle CSS pulse, replaces aggressive animate-ping */}
              {planet.isRetrograde && (
                <circle
                  r={13}
                  fill="none"
                  stroke="#DC143C"
                  strokeWidth={1.5}
                  strokeOpacity={0.75}
                  style={{
                    animation: 'retrograde-pulse 2s ease-in-out infinite',
                  }}
                />
              )}

              {/* Selection ring */}
              {isSelected && (
                <circle
                  r={15}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.8}
                  strokeOpacity={0.9}
                />
              )}

              {/* Planet glow + dot */}
              <circle
                r={9}
                fill={color}
                fillOpacity={0.92}
                stroke="#0a0e27"
                strokeWidth={1.4}
                filter={`url(#${filterId})`}
              />

              {/* Planet letter */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={7}
                fontWeight="800"
                fill="#0a0e27"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {PLANET_SHORT[planet.id]}
              </text>

              {/* Planet name label — offset outward from planet center */}
              <PlanetLabelOffset planet={planet} color={color} pt={pt} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

/** Label placed radially outside the planet dot, offset from the translated origin */
function PlanetLabelOffset({
  planet,
  pt,
  color,
}: {
  planet: SkyPlanetPosition;
  pt: { x: number; y: number };
  color: string;
}) {
  // Offset outward from center by 22px along the radial direction
  const dx = pt.x - CX;
  const dy = pt.y - CY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const labelR = R_PLANET_TRACK + 22;
  // Position relative to the planet dot's translate(CX+dx, CY+dy) origin
  // The inner g is at (0,0) relative to the planet center (pt.x, pt.y)
  // So the label offset is: from pt → outward
  const lxRel = (dx / dist) * (labelR - R_PLANET_TRACK);
  const lyRel = (dy / dist) * (labelR - R_PLANET_TRACK);

  return (
    <text
      x={lxRel}
      y={lyRel}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={8.5}
      fontWeight="600"
      fill={color}
      style={{ userSelect: 'none', pointerEvents: 'none' }}
    >
      {planet.name}
    </text>
  );
}

// ----------------------------------------------------------------------------
// Tooltip popup (rendered outside SVG via HTML overlay)
// ----------------------------------------------------------------------------

interface TooltipProps {
  data: TooltipData;
}

function Tooltip({ data }: TooltipProps) {
  const { planet } = data;
  const rashiObj = RASHIS[planet.rashi - 1];
  const nakshatraObj = NAKSHATRAS[planet.nakshatra - 1];
  const degInRashi = planet.siderealLongitude % 30;

  return (
    <div
      style={{
        position: 'fixed',
        left: data.x + 14,
        top: data.y - 10,
        pointerEvents: 'none',
        zIndex: 50,
      }}
      className="bg-[#111633] border border-[#8a6d2b]/40 rounded-lg px-3 py-2.5 shadow-xl text-xs min-w-[180px]"
    >
      <p className="text-[#f0d48a] font-semibold text-sm mb-1">
        {planet.name}
        {planet.isRetrograde && (
          <span className="ml-1.5 text-red-400 text-[10px]">℞ Retrograde</span>
        )}
      </p>
      <div className="space-y-0.5 text-[#8a8478]">
        <p>
          <span className="text-[#e6e2d8]">{formatDMS(planet.siderealLongitude)}</span>
          {' '}sidereal
        </p>
        <p>
          <span className="text-[#e6e2d8]">{formatDMS(degInRashi)}</span>
          {' '}{rashiObj?.name.en ?? ''}
        </p>
        <p>Nakshatra: <span className="text-[#e6e2d8]">{nakshatraObj?.name.en ?? ''}</span> pada {planet.nakshatraPada}</p>
        <p>Speed: <span className="text-[#e6e2d8]">{planet.speed.toFixed(3)}°/day</span></p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Side panel shown on planet click
// ----------------------------------------------------------------------------

interface SidePanelProps {
  planet: SkyPlanetPosition;
  onClose: () => void;
}

function SidePanel({ planet, onClose }: SidePanelProps) {
  const rashiObj = RASHIS[planet.rashi - 1];
  const nakshatraObj = NAKSHATRAS[planet.nakshatra - 1];
  const color = PLANET_COLORS[planet.id] ?? '#ffffff';
  const degInRashi = planet.siderealLongitude % 30;

  return (
    <div className="bg-[#111633] border border-[#8a6d2b]/30 rounded-xl p-5 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-[#8a8478] hover:text-[#f0d48a] transition-colors text-lg leading-none"
        aria-label="Close panel"
      >
        ×
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#0a0e27] font-bold text-sm"
          style={{ backgroundColor: color }}
        >
          {PLANET_SHORT[planet.id]}
        </div>
        <div>
          <h3 className="text-[#f0d48a] font-semibold text-base">{planet.name}</h3>
          {planet.isRetrograde && (
            <span className="text-red-400 text-xs">℞ Retrograde</span>
          )}
        </div>
      </div>

      <div className="space-y-2.5 text-sm">
        <Row label="Sidereal Longitude" value={formatDMS(planet.siderealLongitude)} />
        <Row label="In Sign" value={`${formatDMS(degInRashi)} ${rashiObj?.name.en ?? ''}`} />
        <Row label="Rashi" value={`${rashiObj?.name.en ?? ''} (${rashiObj?.symbol ?? ''})`} />
        <Row label="Element" value={RASHI_ELEMENTS[planet.rashi] ?? ''} />
        <Row label="Nakshatra" value={nakshatraObj?.name.en ?? ''} />
        <Row label="Pada" value={String(planet.nakshatraPada)} />
        <Row label="Daily Speed" value={`${planet.speed >= 0 ? '+' : ''}${planet.speed.toFixed(4)}°/day`} />
        <Row
          label="Motion"
          value={planet.isRetrograde ? 'Retrograde (℞)' : 'Direct'}
          valueClass={planet.isRetrograde ? 'text-red-400' : 'text-green-400'}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = 'text-[#e6e2d8]',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[#8a8478]">{label}</span>
      <span className={`${valueClass} font-medium`}>{value}</span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Zoom control buttons (HTML overlay on the SVG)
// ----------------------------------------------------------------------------

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  zoomLevel: number;
}

function ZoomControls({ onZoomIn, onZoomOut, onReset, zoomLevel }: ZoomControlsProps) {
  const btnClass =
    'w-8 h-8 flex items-center justify-center rounded-lg bg-[#111633]/90 border border-[#8a6d2b]/40 text-[#d4a853] hover:bg-[#1a2050] hover:border-[#d4a853]/60 hover:text-[#f0d48a] transition-all text-sm font-semibold select-none';

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
      <button className={btnClass} onClick={onZoomIn} aria-label="Zoom in" title="Zoom in">
        +
      </button>
      <button className={btnClass} onClick={onZoomOut} aria-label="Zoom out" title="Zoom out">
        −
      </button>
      <button
        className={`${btnClass} text-[10px]`}
        onClick={onReset}
        aria-label="Reset zoom"
        title="Reset zoom"
        style={{ opacity: Math.abs(zoomLevel - 1) > 0.05 ? 1 : 0.4 }}
      >
        ⊙
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Inline CSS for retrograde pulse animation
// (Avoids creating a separate CSS file; scoped to this component)
// ----------------------------------------------------------------------------

const RETROGRADE_CSS = `
@keyframes retrograde-pulse {
  0%   { r: 13; opacity: 0.75; }
  50%  { r: 16; opacity: 0.35; }
  100% { r: 13; opacity: 0.75; }
}
`;

// ----------------------------------------------------------------------------
// Main exported component
// ----------------------------------------------------------------------------

interface LiveSkyMapProps {
  /** Initial positions — can be passed from server or computed client-side */
  initialPositions?: SkyPlanetPosition[];
  /** Locale for nakshatra/rashi labels — defaults to 'en' */
  locale?: string;
}

/** Time animation speeds */
const TIME_SPEEDS = [
  { label: 'Live', hours: 0 },
  { label: '1h/s', hours: 1 },
  { label: '6h/s', hours: 6 },
  { label: '1d/s', hours: 24 },
  { label: '7d/s', hours: 168 },
  { label: '30d/s', hours: 720 },
] as const;

export function LiveSkyMap({ initialPositions, locale = 'en' }: LiveSkyMapProps) {
  const [positions, setPositions] = useState<SkyPlanetPosition[]>(initialPositions ?? []);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<SkyPlanetPosition | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(initialPositions === undefined);
  const [error, setError] = useState<string | null>(null);
  /** Whether the component has fully mounted — drives planet entry animation */
  const [mounted, setMounted] = useState(false);
  /** Simple React-driven zoom — scale and pan in viewBox coordinates */
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  /** Time animation state */
  const [simDate, setSimDate] = useState<Date>(new Date());
  const [timeSpeed, setTimeSpeed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const animFrameRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  const svgRef = useRef<SVGSVGElement>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  // ---- Zoom via wheel -------------------------------------------------------
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? 0.85 : 1.18; // scroll down = zoom out
      setZoomLevel((prev) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, prev * delta)));
    };

    svgEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => svgEl.removeEventListener('wheel', handleWheel);
  }, []);

  // ---- Pan via mouse drag ---------------------------------------------------
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const onDown = (e: PointerEvent) => {
      isPanningRef.current = true;
      // Convert screen pixels to viewBox units using current zoom
      panStartRef.current = { x: e.clientX, y: e.clientY, ox: panOffset.x, oy: panOffset.y };
      svgEl.setPointerCapture(e.pointerId);
      svgEl.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!isPanningRef.current) return;
      const rect = svgEl.getBoundingClientRect();
      const scalePixelToVB = SVG_SIZE / rect.width / zoomLevel;
      const dx = (e.clientX - panStartRef.current.x) * scalePixelToVB;
      const dy = (e.clientY - panStartRef.current.y) * scalePixelToVB;
      setPanOffset({ x: panStartRef.current.ox - dx, y: panStartRef.current.oy - dy });
    };
    const onUp = () => {
      isPanningRef.current = false;
      svgEl.style.cursor = 'grab';
    };

    svgEl.addEventListener('pointerdown', onDown);
    svgEl.addEventListener('pointermove', onMove);
    svgEl.addEventListener('pointerup', onUp);
    svgEl.addEventListener('pointerleave', onUp);
    return () => {
      svgEl.removeEventListener('pointerdown', onDown);
      svgEl.removeEventListener('pointermove', onMove);
      svgEl.removeEventListener('pointerup', onUp);
      svgEl.removeEventListener('pointerleave', onUp);
    };
  }, [zoomLevel, panOffset]);

  // ---- Zoom control handlers ------------------------------------------------
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(ZOOM_MAX, prev * 1.4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(ZOOM_MIN, prev / 1.4));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // ---- Data fetching --------------------------------------------------------
  const fetchPositions = useCallback(async () => {
    try {
      const res = await fetch('/api/sky/positions');
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as { positions: SkyPlanetPosition[]; timestamp: string };
      setPositions(data.positions);
      setLastUpdated(new Date(data.timestamp));
      setError(null);
    } catch (err) {
      console.error('[LiveSkyMap] fetchPositions failed:', err);
      setError('Failed to load planetary positions. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!initialPositions || initialPositions.length === 0) {
      void fetchPositions();
    } else {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, [fetchPositions, initialPositions]);

  // Trigger entry animation after mount (small delay so CSS transition fires)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Auto-refresh every 60s (Moon moves ~0.55° per hour, noticeable over a minute)
  useEffect(() => {
    // Only auto-refresh when in live mode (timeSpeed === 0)
    if (timeSpeed !== 0) return;
    const timer = setInterval(() => {
      void fetchPositions();
    }, 60_000);
    return () => clearInterval(timer);
  }, [fetchPositions, timeSpeed]);

  // ---- Time animation loop ---------------------------------------------------
  useEffect(() => {
    if (!playing || timeSpeed === 0) return;
    const hoursPerSecond = TIME_SPEEDS[timeSpeed].hours;

    const tick = (timestamp: number) => {
      if (lastTickRef.current === 0) {
        lastTickRef.current = timestamp;
      }
      const dtSec = (timestamp - lastTickRef.current) / 1000;
      lastTickRef.current = timestamp;

      setSimDate((prev) => {
        const next = new Date(prev.getTime() + dtSec * hoursPerSecond * 3600_000);
        return next;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = 0;
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [playing, timeSpeed]);

  // Fetch positions when simDate changes (throttled to ~10fps via rAF batching)
  const lastFetchRef = useRef(0);
  useEffect(() => {
    if (timeSpeed === 0) return; // Live mode uses its own fetch
    const now = Date.now();
    if (now - lastFetchRef.current < 100) return; // throttle to 10fps
    lastFetchRef.current = now;

    fetch(`/api/sky/positions?date=${simDate.toISOString()}`)
      .then((r) => r.json())
      .then((data: { positions: SkyPlanetPosition[] }) => {
        setPositions(data.positions);
        setLastUpdated(simDate);
      })
      .catch((err) => console.error('[LiveSkyMap] time-anim fetch:', err));
  }, [simDate, timeSpeed]);

  const handleResetToLive = useCallback(() => {
    setTimeSpeed(0);
    setPlaying(false);
    setSimDate(new Date());
    void fetchPositions();
  }, [fetchPositions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="text-[#8a8478] text-sm animate-pulse">Loading sky positions…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  // Convert D3 zoom transform into a viewBox that zooms/pans correctly.
  // D3 gives us pixel-space (k, x, y). We map to viewBox coords:
  //   viewBox origin = (-x/k, -y/k), size = SVG_SIZE/k × SVG_SIZE/k
  // Zoom into center: as zoomLevel increases, viewBox shrinks around CX,CY
  const vbSize = SVG_SIZE / zoomLevel;
  const vbX = CX - vbSize / 2 + panOffset.x;
  const vbY = CY - vbSize / 2 + panOffset.y;
  const dynamicViewBox = `${vbX} ${vbY} ${vbSize} ${vbSize}`;

  return (
    <div className="relative w-full">
      {/* Inject retrograde animation keyframes */}
      <style>{RETROGRADE_CSS}</style>

      {/* SVG Chart — full width, aspect-ratio square */}
      <div className="relative w-full" style={{ aspectRatio: '1 / 1', maxHeight: '85vh' }}>
        <svg
          ref={svgRef}
          viewBox={dynamicViewBox}
          className="w-full h-full"
          style={{ background: 'transparent', cursor: 'grab' }}
          aria-label="Live Sky Map — sidereal ecliptic polar projection (scroll to zoom, drag to pan)"
          role="img"
        >
          <SvgDefs />

          {/* Background glow (fixed — not zoomed) */}
          <circle cx={CX} cy={CY} r={SVG_SIZE / 2} fill="url(#bgGlow)" />

          {/* All chart content inside a zoomable group */}
          <g>
            {/* Outermost orbit reference ring */}
            <circle cx={CX} cy={CY} r={R_TICK_OUTER} fill="none" stroke="#8a6d2b" strokeOpacity={0.15} strokeWidth={0.5} />

            {/* Nakshatra ring (outermost labeled ring) */}
            <NakshatraRing locale={locale} />

            {/* Rashi ring */}
            <RashiRing locale={locale} />

            {/* Degree markers */}
            <DegreeMarkers />

            {/* Planet track ring — gradient ring instead of dashed */}
            <circle
              cx={CX}
              cy={CY}
              r={R_PLANET_TRACK}
              fill="url(#trackGlow)"
              stroke="#d4a853"
              strokeOpacity={0.2}
              strokeWidth={1.2}
            />

            {/* Planet trail arcs */}
            <PlanetTrails positions={positions} />

            {/* Planet markers */}
            <PlanetMarkers
              positions={positions}
              onHover={setTooltip}
              onSelect={setSelectedPlanet}
              selectedId={selectedPlanet?.id ?? null}
              mounted={mounted}
            />

            {/* Center */}
            <CenterSymbol />
          </g>
        </svg>

        {/* Zoom controls overlay */}
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleZoomReset}
          zoomLevel={zoomLevel}
        />

        {/* Tooltip overlay */}
        {tooltip && <Tooltip data={tooltip} />}

        {/* Time animation controls — BELOW the chart, not overlaid */}
      </div>{/* end chart container */}
      <div className="flex flex-col items-center gap-2 bg-[#111633]/90 border border-[#8a6d2b]/30 rounded-xl px-4 py-3 mx-auto max-w-[560px] mt-3">
          {/* Timeline slider — scrub ±1 year from current real time */}
          <div className="w-full flex items-center gap-2">
            <span className="text-[#6a5a28] text-[9px] whitespace-nowrap">-1yr</span>
            <input
              type="range"
              min={-365}
              max={365}
              step={1}
              value={timeSpeed === 0 ? 0 : Math.round((simDate.getTime() - new Date().getTime()) / 86_400_000)}
              onChange={(e) => {
                const dayOffset = parseInt(e.target.value, 10);
                const newDate = new Date(Date.now() + dayOffset * 86_400_000);
                setSimDate(newDate);
                if (timeSpeed === 0) setTimeSpeed(1);
                setPlaying(false);
                // Fetch positions for this date
                fetch(`/api/sky/positions?date=${newDate.toISOString()}`)
                  .then(r => r.json())
                  .then((data: { positions: SkyPlanetPosition[] }) => {
                    setPositions(data.positions);
                    setLastUpdated(newDate);
                  })
                  .catch(err => console.error('[LiveSkyMap] slider fetch:', err));
              }}
              className="flex-1 h-1.5 appearance-none bg-[#8a6d2b]/30 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(212,168,83,0.5)]"
            />
            <span className="text-[#6a5a28] text-[9px] whitespace-nowrap">+1yr</span>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={() => {
              if (timeSpeed === 0) setTimeSpeed(1);
              setPlaying(!playing);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gold-primary/15 text-gold-light hover:bg-gold-primary/25 transition-colors text-sm font-bold"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? '⏸' : '▶'}
          </button>

          {/* Speed selector */}
          <div className="flex gap-0.5">
            {TIME_SPEEDS.map((speed, i) => (
              <button
                key={speed.label}
                onClick={() => {
                  setTimeSpeed(i);
                  if (i === 0) { setPlaying(false); handleResetToLive(); }
                  else if (!playing) setPlaying(true);
                }}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                  timeSpeed === i
                    ? 'bg-gold-primary/25 text-gold-light border border-gold-primary/40'
                    : 'text-[#8a8478] hover:text-gold-light'
                }`}
              >
                {speed.label}
              </button>
            ))}
          </div>

          {/* Current date display */}
          <span className="text-[#c8a040] text-xs font-mono ml-2 min-w-[130px] text-center">
            {(timeSpeed === 0 ? (lastUpdated ?? new Date()) : simDate).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
            {' '}
            {(timeSpeed === 0 ? (lastUpdated ?? new Date()) : simDate).toLocaleTimeString('en-GB', {
              hour: '2-digit', minute: '2-digit',
            })}
          </span>

          {/* Reset to Live */}
          {timeSpeed !== 0 && (
            <button
              onClick={handleResetToLive}
              className="px-2 py-1 rounded text-[10px] font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
            >
              LIVE
            </button>
          )}
          </div>{/* end controls row */}
        </div>{/* end time controls */}

      {/* Planet info panel */}
      {selectedPlanet && (
        <div className="max-w-[320px] mx-auto mt-3">
          <SidePanel
            planet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
          />
        </div>
      )}

      {/* Instructions hint */}
      {!selectedPlanet && (
        <p className="text-center text-[#8a8478] text-xs mt-2">
          Click any planet for details. Scroll over the chart to zoom. Drag to pan.
        </p>
      )}
    </div>
  );
}
