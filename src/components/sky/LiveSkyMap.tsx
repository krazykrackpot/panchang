'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { type SkyPlanetPosition } from '@/lib/sky/positions';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';

// ----------------------------------------------------------------------------
// Constants — hoisted from render path (performance rule)
// ----------------------------------------------------------------------------

const SVG_SIZE = 600;
const CX = SVG_SIZE / 2; // 300
const CY = SVG_SIZE / 2; // 300

/** Radii for concentric rings */
const R_CENTER = 28;
const R_RASHI_INNER = 165;
const R_RASHI_OUTER = 222;
const R_PLANET_TRACK = 193; // between inner and outer rashi ring
const R_NAKSHATRA_INNER = 222;
const R_NAKSHATRA_OUTER = 262;
const R_TICK_OUTER = 262;

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
 * Format degrees as "DD°MM'" string.
 */
function formatDMS(deg: number): string {
  const d = Math.floor(deg);
  const mFrac = (deg - d) * 60;
  const m = Math.floor(mFrac);
  return `${d}°${String(m).padStart(2, '0')}'`;
}

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------

function RashiRing() {
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
              y={midPt.y - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fill="#f0d48a"
              fontWeight="600"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {rashi.symbol}
            </text>
            {/* Rashi short name */}
            <text
              x={midPt.x}
              y={midPt.y + 7}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={7.5}
              fill="#d4a853"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {rashi.name.en.substring(0, 3).toUpperCase()}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function NakshatraRing() {
  const nakshatraSpan = 360 / 27; // ≈13.333°

  return (
    <g aria-label="Nakshatra ring">
      {NAKSHATRAS.map((nak, i) => {
        const startDeg = i * nakshatraSpan;
        const endDeg = startDeg + nakshatraSpan;
        const midDeg = startDeg + nakshatraSpan / 2;

        // Show label for every nakshatra but alternate size for clarity
        const showLabel = true;
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
            {showLabel && (
              <text
                x={midPt.x}
                y={midPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={i % 3 === 0 ? 6.5 : 5.5}
                fill={i % 3 === 0 ? '#a08030' : '#6a5a28'}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {nak.name.en.substring(0, 4)}
              </text>
            )}
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
    const outerPt = polarToXY(deg, R_TICK_OUTER + (isMajor ? 6 : 3));
    const innerPt = polarToXY(deg, R_TICK_OUTER);

    markers.push(
      <line
        key={`tick-${deg}`}
        x1={innerPt.x}
        y1={innerPt.y}
        x2={outerPt.x}
        y2={outerPt.y}
        stroke={isMajor ? '#8a6d2b' : '#4a3d1a'}
        strokeOpacity={isMajor ? 0.7 : 0.4}
        strokeWidth={isMajor ? 1.2 : 0.7}
      />
    );

    // Degree label for major ticks (every 30°)
    if (isMajor) {
      const labelPt = polarToXY(deg, R_TICK_OUTER + 13);
      markers.push(
        <text
          key={`label-${deg}`}
          x={labelPt.x}
          y={labelPt.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={6}
          fill="#6a5a28"
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
}

function PlanetMarkers({ positions, onHover, onSelect, selectedId }: PlanetMarkersProps) {
  return (
    <g aria-label="Planet markers">
      {positions.map((planet) => {
        const pt = polarToXY(planet.siderealLongitude, R_PLANET_TRACK);
        const color = PLANET_COLORS[planet.id] ?? '#ffffff';
        const isSelected = selectedId === planet.id;

        return (
          <g
            key={planet.id}
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => {
              // Map SVG coords to screen for tooltip positioning
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
            {/* Retrograde pulsing ring (CSS animation applied via className) */}
            {planet.isRetrograde && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={11}
                fill="none"
                stroke="#DC143C"
                strokeWidth={1.2}
                strokeOpacity={0.7}
                className="animate-ping"
                style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
              />
            )}

            {/* Selection ring */}
            {isSelected && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={13}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeOpacity={0.9}
              />
            )}

            {/* Planet dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={7}
              fill={color}
              fillOpacity={0.9}
              stroke="#0a0e27"
              strokeWidth={1.2}
            />

            {/* Planet letter */}
            <text
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={6}
              fontWeight="700"
              fill="#0a0e27"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {PLANET_SHORT[planet.id]}
            </text>

            {/* Planet name label — offset outward from center */}
            <PlanetLabel planet={planet} pt={pt} color={color} />
          </g>
        );
      })}
    </g>
  );
}

/** Label placed radially outside the planet dot */
function PlanetLabel({
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
  const lx = CX + (dx / dist) * labelR;
  const ly = CY + (dy / dist) * labelR;

  return (
    <text
      x={lx}
      y={ly}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={8}
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
// Main exported component
// ----------------------------------------------------------------------------

interface LiveSkyMapProps {
  /** Initial positions — can be passed from server or computed client-side */
  initialPositions?: SkyPlanetPosition[];
}

export function LiveSkyMap({ initialPositions }: LiveSkyMapProps) {
  const [positions, setPositions] = useState<SkyPlanetPosition[]>(initialPositions ?? []);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<SkyPlanetPosition | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(initialPositions === undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    try {
      // We use the API endpoint so positions are computed server-side
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

  // Auto-refresh every 60s (Moon moves ~0.55° per hour, noticeable over a minute)
  useEffect(() => {
    const timer = setInterval(() => {
      void fetchPositions();
    }, 60_000);
    return () => clearInterval(timer);
  }, [fetchPositions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] w-full">
        <div className="text-[#8a8478] text-sm animate-pulse">Loading sky positions…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] w-full">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* SVG Chart */}
      <div className="relative flex-shrink-0">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          width={SVG_SIZE}
          height={SVG_SIZE}
          className="max-w-full"
          style={{ background: 'transparent' }}
          aria-label="Live Sky Map — sidereal ecliptic polar projection"
          role="img"
        >
          {/* Starfield background glow */}
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1f45" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#0a0e27" stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={SVG_SIZE / 2} fill="url(#bgGlow)" />

          {/* Outermost orbit reference ring */}
          <circle cx={CX} cy={CY} r={R_TICK_OUTER} fill="none" stroke="#8a6d2b" strokeOpacity={0.15} strokeWidth={0.5} />

          {/* Nakshatra ring (outermost labeled ring) */}
          <NakshatraRing />

          {/* Rashi ring */}
          <RashiRing />

          {/* Degree markers */}
          <DegreeMarkers />

          {/* Planet track ring (reference circle) */}
          <circle cx={CX} cy={CY} r={R_PLANET_TRACK} fill="none" stroke="#8a6d2b" strokeOpacity={0.12} strokeWidth={0.8} strokeDasharray="2 4" />

          {/* Planet markers */}
          <PlanetMarkers
            positions={positions}
            onHover={setTooltip}
            onSelect={setSelectedPlanet}
            selectedId={selectedPlanet?.id ?? null}
          />

          {/* Center */}
          <CenterSymbol />
        </svg>

        {/* Tooltip overlay */}
        {tooltip && <Tooltip data={tooltip} />}

        {/* Timestamp */}
        {lastUpdated && (
          <p className="text-center text-[#6a5a28] text-xs mt-2">
            Updated: {lastUpdated.toLocaleTimeString()} UTC {lastUpdated.toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Side panel */}
      <div className="flex-1 min-w-[240px] max-w-[320px]">
        {selectedPlanet ? (
          <SidePanel
            planet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
          />
        ) : (
          <div className="bg-[#111633]/60 border border-[#8a6d2b]/20 rounded-xl p-4 text-[#8a8478] text-sm">
            <p className="font-medium text-[#d4a853] mb-1">Live Sky Map</p>
            <p>Click any planet to see detailed position data.</p>
            <p className="mt-2 text-xs">Hover to preview. Positions update every 60 seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
