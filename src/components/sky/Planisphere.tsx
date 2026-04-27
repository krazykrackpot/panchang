'use client';

import React, { useMemo } from 'react';
import { BRIGHT_STARS, CONSTELLATION_LINES } from '@/lib/astronomy/star-catalog';
import { equatorialToHorizontal } from '@/lib/ephem/coordinates';

// ---------------------------------------------------------------------------
// Constants — hoisted from render path
// ---------------------------------------------------------------------------

const DEG = Math.PI / 180;
const SVG_SIZE = 800;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;
const HORIZON_R = 350;

/** Planet colors by id (0=Sun through 8=Ketu) */
const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', // Sun
  1: '#c0c0c0', // Moon
  2: '#e74c3c', // Mars
  3: '#2ecc71', // Mercury
  4: '#f1c40f', // Jupiter
  5: '#e91e9f', // Venus
  6: '#7f8c8d', // Saturn
  7: '#3498db', // Rahu
  8: '#9b59b6', // Ketu
};

/** Cardinal direction labels positioned outside the horizon circle */
const CARDINALS = [
  { label: 'N', x: CX, y: 32 },       // top
  { label: 'E', x: SVG_SIZE - 32, y: CX + 4 }, // right (azimuth convention: E at right in planisphere)
  { label: 'S', x: CX, y: SVG_SIZE - 26 },
  { label: 'W', x: 32, y: CX + 4 },
] as const;

// ---------------------------------------------------------------------------
// Projection math
// ---------------------------------------------------------------------------

/**
 * Stereographic polar projection: zenith at center, horizon at edge.
 *
 * @param alt  Altitude in degrees (-90 to +90)
 * @param az   Azimuth in degrees (0=N, 90=E, 180=S, 270=W)
 * @returns SVG (x, y) or null if far below horizon
 */
function project(alt: number, az: number): { x: number; y: number; r: number } | null {
  // Skip objects well below horizon (allow slight dip for rendering near-horizon objects)
  if (alt < -5) return null;
  // Clamp altitude for projection math — objects slightly below horizon get projected to edge
  const clampedAlt = Math.max(0, alt);
  const altRad = clampedAlt * DEG;
  const stereographicR = Math.cos(altRad) / (1 + Math.sin(altRad));
  const azRad = az * DEG;
  return {
    x: CX + stereographicR * HORIZON_R * Math.sin(azRad),
    y: CY - stereographicR * HORIZON_R * Math.cos(azRad), // -cos: North is up
    r: stereographicR,
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlanispherePlanet {
  id: number;       // 0=Sun through 8=Ketu
  name: string;
  ra: number;       // Right Ascension in degrees (0-360)
  dec: number;      // Declination in degrees (-90 to +90)
  magnitude?: number;
  tropicalLongitude?: number;
  siderealLongitude?: number;
}

interface ProjectedStar {
  idx: number;
  name: string;
  constellation: string;
  x: number;
  y: number;
  mag: number;
  color: string;
  altitude: number;
  azimuth: number;
}

interface ProjectedPlanet extends PlanispherePlanet {
  x: number;
  y: number;
  altitude: number;
  azimuth: number;
}

export interface PlanisphereProps {
  lat: number;
  lng: number;
  jd: number;
  planetPositions: PlanispherePlanet[];
  selectedPlanetId: number | null;
  onPlanetClick: (id: number) => void;
  showConstellations: boolean;
  showGrid: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SkyBackground() {
  return (
    <>
      <defs>
        <radialGradient id="planisphere-sky-bg">
          <stop offset="0%" stopColor="#0a0e27" />
          <stop offset="80%" stopColor="#080b1f" />
          <stop offset="100%" stopColor="#060818" />
        </radialGradient>
        <filter id="planisphere-star-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="planisphere-planet-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="planisphere-selected-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Sky disc */}
      <circle cx={CX} cy={CY} r={HORIZON_R + 5} fill="url(#planisphere-sky-bg)" />
    </>
  );
}

function HorizonAndCardinals() {
  return (
    <>
      {/* Horizon circle */}
      <circle
        cx={CX} cy={CY} r={HORIZON_R}
        fill="none" stroke="#d4a853" strokeWidth={0.5} opacity={0.4}
      />
      {/* Subtle altitude rings at 30 and 60 degrees */}
      {[30, 60].map((alt) => {
        const altR = Math.cos(alt * DEG) / (1 + Math.sin(alt * DEG));
        return (
          <circle
            key={alt}
            cx={CX} cy={CY} r={altR * HORIZON_R}
            fill="none" stroke="#d4a853" strokeWidth={0.3} opacity={0.12}
          />
        );
      })}
      {/* Cardinal labels */}
      {CARDINALS.map((c) => (
        <text
          key={c.label}
          x={c.x} y={c.y}
          textAnchor="middle" dominantBaseline="middle"
          fill="#d4a853" fontSize={13} fontWeight={600} opacity={0.6}
          style={{ userSelect: 'none' }}
        >
          {c.label}
        </text>
      ))}
    </>
  );
}

/** RA/Dec grid lines projected to horizontal coordinates */
function GridLines({ lat, lng, jd }: { lat: number; lng: number; jd: number }) {
  const paths: React.ReactNode[] = [];

  // Declination circles: every 30 degrees from -60 to +60
  for (let dec = -60; dec <= 60; dec += 30) {
    const points: string[] = [];
    for (let ra = 0; ra <= 360; ra += 2) {
      const { altitude, azimuth } = equatorialToHorizontal(ra, dec, lat, lng, jd);
      const p = project(altitude, azimuth);
      if (p) points.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    if (points.length > 2) {
      paths.push(
        <polyline
          key={`dec-${dec}`}
          points={points.join(' ')}
          fill="none" stroke="#d4a853" strokeWidth={0.3} strokeOpacity={0.1}
        />
      );
    }
  }

  // RA lines: every 30 degrees (2 hours)
  for (let ra = 0; ra < 360; ra += 30) {
    const points: string[] = [];
    for (let dec = -80; dec <= 80; dec += 2) {
      const { altitude, azimuth } = equatorialToHorizontal(ra, dec, lat, lng, jd);
      const p = project(altitude, azimuth);
      if (p) points.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    if (points.length > 2) {
      paths.push(
        <polyline
          key={`ra-${ra}`}
          points={points.join(' ')}
          fill="none" stroke="#d4a853" strokeWidth={0.3} strokeOpacity={0.1}
        />
      );
    }
  }

  return <g aria-label="RA/Dec grid">{paths}</g>;
}

function Stars({ stars }: { stars: ProjectedStar[] }) {
  return (
    <g aria-label="Stars">
      {stars.map((star) => {
        const radius = Math.max(0.8, 4 - star.mag * 0.8);
        const opacity = Math.min(1, Math.max(0.3, 1.5 - star.mag * 0.3));
        const isBright = star.mag < 1;
        return (
          <circle
            key={star.idx}
            cx={star.x} cy={star.y}
            r={radius}
            fill={star.color}
            opacity={opacity}
            filter={isBright ? 'url(#planisphere-star-glow)' : undefined}
          />
        );
      })}
    </g>
  );
}

function StarLabels({ stars }: { stars: ProjectedStar[] }) {
  // Only label bright stars (mag < 1.5)
  const labeled = stars.filter((s) => s.mag < 1.5);
  return (
    <g aria-label="Star labels">
      {labeled.map((star) => (
        <text
          key={`label-${star.idx}`}
          x={star.x + 6} y={star.y - 6}
          fill="#e6e2d8" fontSize={7.5} fontWeight={500}
          opacity={0.4}
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          {star.name}
        </text>
      ))}
    </g>
  );
}

function ConstellationLinesSvg({ stars }: { stars: ProjectedStar[] }) {
  // Build a lookup from original catalog index to projected star
  const starByIdx = new Map<number, ProjectedStar>();
  for (const s of stars) starByIdx.set(s.idx, s);

  return (
    <g aria-label="Constellation lines">
      {CONSTELLATION_LINES.map((con) => (
        <g key={con.constellation}>
          {con.lines.map((polyline, li) => {
            const points: string[] = [];
            for (const starIdx of polyline) {
              const s = starByIdx.get(starIdx);
              if (s) points.push(`${s.x.toFixed(1)},${s.y.toFixed(1)}`);
              else points.push(''); // gap
            }
            // Filter out segments with gaps
            const validSegments: string[][] = [];
            let current: string[] = [];
            for (const pt of points) {
              if (pt === '') {
                if (current.length >= 2) validSegments.push(current);
                current = [];
              } else {
                current.push(pt);
              }
            }
            if (current.length >= 2) validSegments.push(current);

            return validSegments.map((seg, si) => (
              <polyline
                key={`${con.constellation}-${li}-${si}`}
                points={seg.join(' ')}
                fill="none"
                stroke="#d4a853"
                strokeWidth={0.6}
                strokeOpacity={0.15}
                strokeLinecap="round"
              />
            ));
          })}
        </g>
      ))}
    </g>
  );
}

function ConstellationLabels({ stars }: { stars: ProjectedStar[] }) {
  // Find center of each visible constellation
  const constellationCenters = new Map<string, { xs: number[]; ys: number[]; name: string }>();
  for (const con of CONSTELLATION_LINES) {
    const cStars = stars.filter((s) => s.constellation === con.constellation);
    if (cStars.length === 0) continue;
    if (!constellationCenters.has(con.constellation)) {
      constellationCenters.set(con.constellation, { xs: [], ys: [], name: con.name });
    }
    const entry = constellationCenters.get(con.constellation)!;
    for (const cs of cStars) {
      entry.xs.push(cs.x);
      entry.ys.push(cs.y);
    }
  }

  return (
    <g aria-label="Constellation labels">
      {Array.from(constellationCenters.entries()).map(([key, data]) => {
        const cx = data.xs.reduce((a, b) => a + b, 0) / data.xs.length;
        const cy = data.ys.reduce((a, b) => a + b, 0) / data.ys.length;
        return (
          <text
            key={key}
            x={cx} y={cy + 14}
            textAnchor="middle" dominantBaseline="middle"
            fill="#d4a853" fontSize={8} fontWeight={500}
            opacity={0.2}
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {data.name}
          </text>
        );
      })}
    </g>
  );
}

function PlanetMarkers({
  planets,
  selectedPlanetId,
  onPlanetClick,
}: {
  planets: ProjectedPlanet[];
  selectedPlanetId: number | null;
  onPlanetClick: (id: number) => void;
}) {
  return (
    <g aria-label="Planet markers">
      {planets.map((planet) => {
        const isSelected = selectedPlanetId === planet.id;
        const isNode = planet.id === 7 || planet.id === 8; // Rahu/Ketu are mathematical points
        const color = PLANET_COLORS[planet.id] ?? '#ffffff';
        const baseR = isSelected ? 10 : 7;

        return (
          <g
            key={planet.id}
            onClick={() => onPlanetClick(planet.id)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label={`${planet.name} at altitude ${planet.altitude.toFixed(1)}, azimuth ${planet.azimuth.toFixed(1)}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onPlanetClick(planet.id);
            }}
          >
            {/* Selected glow ring */}
            {isSelected && (
              <circle
                cx={planet.x} cy={planet.y} r={baseR + 5}
                fill="none" stroke="#d4a853" strokeWidth={1.5}
                opacity={0.7}
                filter="url(#planisphere-selected-glow)"
              >
                <animate
                  attributeName="r" values={`${baseR + 4};${baseR + 8};${baseR + 4}`}
                  dur="2s" repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity" values="0.7;0.3;0.7"
                  dur="2s" repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Planet body */}
            {isNode ? (
              // Rahu/Ketu: hollow dashed circle
              <circle
                cx={planet.x} cy={planet.y} r={baseR}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="3 2"
                opacity={0.8}
                filter="url(#planisphere-planet-glow)"
              />
            ) : (
              <circle
                cx={planet.x} cy={planet.y} r={baseR}
                fill={color}
                opacity={0.9}
                filter="url(#planisphere-planet-glow)"
              />
            )}

            {/* Planet label */}
            <text
              x={planet.x + baseR + 5} y={planet.y + 4}
              fill="#e6e2d8" fontSize={10} fontWeight={600}
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {planet.name}
            </text>

            {/* Below-horizon warning for Sun */}
            {planet.id === 0 && planet.altitude < 0 && (
              <text
                x={planet.x + baseR + 5} y={planet.y + 16}
                fill="#8a8478" fontSize={7}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                below horizon
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Planisphere({
  lat,
  lng,
  jd,
  planetPositions,
  selectedPlanetId,
  onPlanetClick,
  showConstellations,
  showGrid,
}: PlanisphereProps) {
  // 1. Project all catalog stars to horizontal coordinates, then to SVG
  const visibleStars = useMemo<ProjectedStar[]>(() => {
    const result: ProjectedStar[] = [];
    for (let i = 0; i < BRIGHT_STARS.length; i++) {
      const star = BRIGHT_STARS[i];
      const { altitude, azimuth } = equatorialToHorizontal(star.ra, star.dec, lat, lng, jd);
      if (altitude < -5) continue;
      const p = project(altitude, azimuth);
      if (!p) continue;
      result.push({
        idx: i,
        name: star.name,
        constellation: star.constellation,
        x: p.x,
        y: p.y,
        mag: star.mag,
        color: star.color,
        altitude,
        azimuth,
      });
    }
    return result;
  }, [lat, lng, jd]);

  // 2. Project planets
  const visiblePlanets = useMemo<ProjectedPlanet[]>(() => {
    const result: ProjectedPlanet[] = [];
    for (const planet of planetPositions) {
      const { altitude, azimuth } = equatorialToHorizontal(planet.ra, planet.dec, lat, lng, jd);
      // Always show planets (even slightly below horizon) for educational value
      const p = project(Math.max(altitude, -3), azimuth);
      if (!p) continue;
      result.push({ ...planet, x: p.x, y: p.y, altitude, azimuth });
    }
    return result;
  }, [planetPositions, lat, lng, jd]);

  return (
    <svg
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      className="w-full max-w-[700px] mx-auto"
      style={{ aspectRatio: '1 / 1' }}
      aria-label="Planisphere — stereographic sky projection showing stars and planets above the horizon"
      role="img"
    >
      <SkyBackground />
      <HorizonAndCardinals />

      {/* Optional RA/Dec grid */}
      {showGrid && <GridLines lat={lat} lng={lng} jd={jd} />}

      {/* Constellation lines */}
      {showConstellations && <ConstellationLinesSvg stars={visibleStars} />}

      {/* Stars */}
      <Stars stars={visibleStars} />

      {/* Star labels for bright stars */}
      {showConstellations && <StarLabels stars={visibleStars} />}

      {/* Constellation labels */}
      {showConstellations && <ConstellationLabels stars={visibleStars} />}

      {/* Planets — rendered last so they appear on top */}
      <PlanetMarkers
        planets={visiblePlanets}
        selectedPlanetId={selectedPlanetId}
        onPlanetClick={onPlanetClick}
      />
    </svg>
  );
}

export { PLANET_COLORS };
export type { ProjectedPlanet };
