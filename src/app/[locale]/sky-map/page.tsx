'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';

import { useLocationStore } from '@/stores/location-store';
import { dateToJD } from '@/lib/astronomy/julian';
import { getPlanetaryPositions, normalizeDeg } from '@/lib/ephem/astronomical';
import { eclipticToEquatorial, computePlanetLatitude, equatorialToHorizontal } from '@/lib/ephem/coordinates';
import { getAyanamsa, tropicalToSidereal } from '@/lib/astronomy/ayanamsa';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { tl } from '@/lib/utils/trilingual';
import type { PlanispherePlanet, ProjectedPlanet } from '@/components/sky/Planisphere';

// Lazy-load the heavy SVG component
const Planisphere = dynamic(
  () => import('@/components/sky/Planisphere'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full" style={{ aspectRatio: '1/1', maxWidth: 700 }}>
        <div className="text-text-secondary text-sm animate-pulse">Loading sky map...</div>
      </div>
    ),
  }
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function currentJD(): number {
  const now = new Date();
  return dateToJD(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
}

function formatTimeOffset(minutes: number): string {
  if (minutes === 0) return 'Now';
  const absMin = Math.abs(minutes);
  if (absMin < 60) {
    return minutes > 0 ? `in ${absMin}m` : `${absMin}m ago`;
  }
  const hours = Math.round(absMin / 60);
  if (hours === 1) return minutes > 0 ? 'in 1 hour' : '1 hour ago';
  return minutes > 0 ? `in ${hours} hours` : `${hours} hours ago`;
}

/** Format azimuth to cardinal direction string */
function azimuthToCardinal(az: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(az / 22.5) % 16;
  return dirs[idx];
}

/**
 * Compute planet RA/Dec from tropical longitudes.
 * Uses eclipticToEquatorial with proper ecliptic latitude per planet.
 */
/**
 * Compute planet RA/Dec — pure astronomical math, locale-independent.
 * Names are resolved separately to avoid recomputing positions on locale change.
 */
function computePlanetRADec(jd: number): { planets: PlanispherePlanet[]; ayanamsa: number } {
  const positions = getPlanetaryPositions(jd);
  const ayanamsa = getAyanamsa(jd);

  const planets: PlanispherePlanet[] = positions.map((p) => {
    const eclipticLat = computePlanetLatitude(p.id, jd);
    const { ra, dec } = eclipticToEquatorial(p.longitude, eclipticLat, jd);
    const siderealLong = tropicalToSidereal(p.longitude, ayanamsa);

    return {
      id: p.id,
      name: '', // resolved below via locale-dependent memo
      ra,
      dec,
      tropicalLongitude: p.longitude,
      siderealLongitude: siderealLong,
    };
  });

  return { planets, ayanamsa };
}

// ---------------------------------------------------------------------------
// Planet info panel component
// ---------------------------------------------------------------------------

interface PlanetInfoProps {
  planet: ProjectedPlanet;
  sidereal: boolean;
  locale: string;
}

function PlanetInfoPanel({ planet, sidereal, locale }: PlanetInfoProps) {
  const longitude = sidereal
    ? (planet.siderealLongitude ?? 0)
    : (planet.tropicalLongitude ?? 0);
  const rashiIdx = Math.floor(normalizeDeg(longitude) / 30); // 0-based
  const rashi = RASHIS[rashiIdx];
  const nakshatraIdx = Math.floor(normalizeDeg(planet.siderealLongitude ?? 0) / (360 / 27));
  const nakshatra = NAKSHATRAS[nakshatraIdx];
  const degInSign = normalizeDeg(longitude) % 30;

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-[#8a6d2b]/30 rounded-xl p-5 max-w-[400px] mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-xl font-bold text-gold-light">
          {GRAHAS[planet.id]?.symbol ?? ''} {planet.name}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <span className="text-text-secondary">Altitude</span>
        <span className="text-text-primary font-medium">
          {planet.altitude.toFixed(1)}°
          {planet.altitude < 0 && <span className="text-red-400 ml-1">(below horizon)</span>}
        </span>

        <span className="text-text-secondary">Azimuth</span>
        <span className="text-text-primary font-medium">
          {planet.azimuth.toFixed(1)}° ({azimuthToCardinal(planet.azimuth)})
        </span>

        <span className="text-text-secondary">Zodiac Sign</span>
        <span className="text-text-primary font-medium">
          {rashi ? `${rashi.symbol} ${tl(rashi.name, locale)}` : '—'}
          <span className="text-text-secondary ml-1">
            {degInSign.toFixed(1)}°
          </span>
        </span>

        <span className="text-text-secondary">Nakshatra</span>
        <span className="text-text-primary font-medium">
          {nakshatra ? tl(nakshatra.name, locale) : '—'}
        </span>

        <span className="text-text-secondary">RA / Dec</span>
        <span className="text-text-primary font-medium text-xs">
          {(planet.ra / 15).toFixed(2)}h / {planet.dec >= 0 ? '+' : ''}{planet.dec.toFixed(1)}°
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-[#8a6d2b]/20">
        <a
          href={`/${locale}/kundali`}
          className="text-gold-primary text-xs hover:text-gold-light transition-colors"
        >
          View in Kundali →
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function SkyMapPage() {
  const locale = useLocale();
  const { lat, lng, name: locationName, confirmed, detect } = useLocationStore();

  // Time offset in minutes from now
  const [timeOffset, setTimeOffset] = useState(0);
  const [showConstellations, setShowConstellations] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [sidereal, setSidereal] = useState(true);
  const [selectedPlanetId, setSelectedPlanetId] = useState<number | null>(null);

  // Auto-detect location on mount if not confirmed
  useEffect(() => {
    if (!confirmed && lat === null) {
      detect();
    }
  }, [confirmed, lat, detect]);

  // Compute JD from time offset
  const jd = useMemo(() => {
    return currentJD() + timeOffset / 1440; // 1440 minutes per day
  }, [timeOffset]);

  // Compute planet RA/Dec positions (expensive math — no locale dependency)
  const { planets: rawPlanets, ayanamsa } = useMemo(() => {
    return computePlanetRADec(jd);
  }, [jd]);

  // Resolve locale-dependent names separately (cheap string lookup)
  const planets = useMemo(() => {
    return rawPlanets.map((p) => {
      const graha = GRAHAS[p.id];
      return { ...p, name: graha ? tl(graha.name, locale) : `Planet ${p.id}` };
    });
  }, [rawPlanets, locale]);

  // Selected planet info: find the ProjectedPlanet from Planisphere's onPlanetClick
  // We store the basic data here, the Planisphere component handles projection
  const selectedPlanetInput = useMemo(() => {
    if (selectedPlanetId === null) return null;
    return planets.find((p) => p.id === selectedPlanetId) ?? null;
  }, [selectedPlanetId, planets]);

  const handlePlanetClick = useCallback((id: number) => {
    setSelectedPlanetId((prev) => (prev === id ? null : id));
  }, []);

  // Default location fallback (user will be prompted to set location)
  const observerLat = lat ?? 46.46;  // Corseaux, Switzerland default per project rules
  const observerLng = lng ?? 6.81;

  // Compute selected planet altitude/azimuth for the info panel
  const selectedPlanetForPanel = useMemo((): ProjectedPlanet | null => {
    if (!selectedPlanetInput) return null;
    const { altitude, azimuth } = equatorialToHorizontal(
      selectedPlanetInput.ra,
      selectedPlanetInput.dec,
      observerLat,
      observerLng,
      jd
    );
    return {
      ...selectedPlanetInput,
      x: 0,
      y: 0,
      altitude,
      azimuth,
    };
  }, [selectedPlanetInput, observerLat, observerLng, jd]);

  if (lat === null) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold text-gold-light mb-3">Interactive Sky Map</h1>
          <p className="text-text-secondary mb-4">
            This feature requires your location to show the sky from where you are.
          </p>
          <button
            onClick={detect}
            className="px-5 py-2.5 bg-gold-primary/20 border border-gold-primary/40 rounded-lg text-gold-light hover:bg-gold-primary/30 transition-colors"
          >
            Detect My Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-16">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gold-light mb-2">
            Interactive Sky Map
          </h1>
          <p className="text-text-secondary text-sm">
            Real-time view of stars and planets from {locationName || 'your location'}
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]/80 border border-[#8a6d2b]/20 rounded-xl p-4 mb-4 space-y-3">
          {/* Time slider */}
          <div className="flex items-center gap-3">
            <label className="text-text-secondary text-xs min-w-[50px]">Time</label>
            <input
              type="range"
              min={-720}
              max={720}
              step={5}
              value={timeOffset}
              onChange={(e) => setTimeOffset(parseInt(e.target.value, 10))}
              className="flex-1 h-1.5 appearance-none bg-[#8a6d2b]/30 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(212,168,83,0.5)]"
            />
            <span className="text-gold-light text-xs font-mono min-w-[80px] text-right">
              {formatTimeOffset(timeOffset)}
            </span>
            {timeOffset !== 0 && (
              <button
                onClick={() => setTimeOffset(0)}
                className="text-[10px] px-2 py-1 rounded bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-4">
            <ToggleButton
              label="Constellations"
              active={showConstellations}
              onClick={() => setShowConstellations((v) => !v)}
            />
            <ToggleButton
              label="Grid"
              active={showGrid}
              onClick={() => setShowGrid((v) => !v)}
            />
            <ToggleButton
              label={sidereal ? 'Sidereal' : 'Tropical'}
              active={sidereal}
              onClick={() => setSidereal((v) => !v)}
            />
          </div>
        </div>

        {/* Planisphere */}
        <div className="flex justify-center">
          <Planisphere
            lat={observerLat}
            lng={observerLng}
            jd={jd}
            planetPositions={planets}
            selectedPlanetId={selectedPlanetId}
            onPlanetClick={handlePlanetClick}
            showConstellations={showConstellations}
            showGrid={showGrid}
          />
        </div>

        {/* Planet info panel */}
        {selectedPlanetForPanel && (
          <div className="mt-4">
            <PlanetInfoPanel
              planet={selectedPlanetForPanel}
              sidereal={sidereal}
              locale={locale}
            />
          </div>
        )}

        {/* Hint */}
        {!selectedPlanetId && (
          <p className="text-center text-text-secondary text-xs mt-3">
            Click any planet to see details. North is up. Horizon is the outer ring. Zenith is the center.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle button sub-component
// ---------------------------------------------------------------------------

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active
          ? 'bg-gold-primary/20 border border-gold-primary/40 text-gold-light'
          : 'bg-[#0a0e27]/50 border border-[#8a6d2b]/20 text-text-secondary hover:text-gold-light'
      }`}
    >
      {label}
    </button>
  );
}
