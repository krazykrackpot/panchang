'use client';

/**
 * CelestialSphere — Three.js 3D ecliptic sphere with planets, nakshatras, and orbit controls.
 *
 * Architecture:
 * - Canvas fills its container; parent must set height.
 * - Ecliptic plane is tilted 23.4° from the equatorial plane (Earth's axial tilt).
 * - Sidereal longitude (0-360°) maps to position on the ecliptic ring.
 * - Planet positions refreshed every 60s from /api/sky/positions.
 *
 * NOTE: This file uses @react-three/fiber and @react-three/drei.
 * THREE.js cannot run server-side — this component must be dynamically imported
 * with { ssr: false } in the consuming page.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { SkyPlanetPosition } from '@/lib/sky/positions';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';

// ---------------------------------------------------------------------------
// Constants — hoisted from render path (perf rule)
// ---------------------------------------------------------------------------

const ECLIPTIC_TILT = 23.4 * (Math.PI / 180); // radians
const ECLIPTIC_RADIUS = 3.0;
const NAKSHATRA_SPAN = 360 / 27; // ≈13.333°

/** Planet colors by id (0=Sun … 8=Ketu) */
const PLANET_COLORS: Record<number, string> = {
  0: '#FF6B35', // Sun
  1: '#C0C0C0', // Moon
  2: '#DC143C', // Mars
  3: '#50C878', // Mercury
  4: '#FFD700', // Jupiter
  5: '#FF69B4', // Venus
  6: '#4169E1', // Saturn
  7: '#8B6914', // Rahu
  8: '#808080', // Ketu
};

/** Relative planet sizes (sphere radius) */
const PLANET_SIZES: Record<number, number> = {
  0: 0.10, // Sun — prominent
  1: 0.07, // Moon
  2: 0.055, // Mars
  3: 0.045, // Mercury — small
  4: 0.12, // Jupiter — largest
  5: 0.06, // Venus
  6: 0.11, // Saturn — large
  7: 0.055, // Rahu
  8: 0.05, // Ketu — smallest
};

/** Short labels for planet spheres */
const PLANET_SHORT: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju',
  5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

/** Element fill colors for rashi segments */
const ELEMENT_COLORS: Record<string, string> = {
  Fire:  '#FF6B35',
  Earth: '#50C878',
  Air:   '#6B8DD6',
  Water: '#B0BEC5',
};

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

/**
 * Convert sidereal longitude (0-360°) to a 3D point on the ecliptic ring.
 * The ring lies in the XZ plane (y=0) before the parent group applies the tilt.
 * 0° Aries starts at +X axis, progresses counter-clockwise when viewed from above.
 */
function eclipticPosition(longitude: number, radius: number): [number, number, number] {
  const angle = (longitude * Math.PI) / 180;
  return [
    radius * Math.cos(angle),
    0,
    radius * Math.sin(angle),
  ];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Thin golden torus representing the ecliptic ring */
function EclipticRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[ECLIPTIC_RADIUS, 0.008, 16, 200]} />
      <meshStandardMaterial
        color="#d4a853"
        emissive="#d4a853"
        emissiveIntensity={0.4}
        transparent
        opacity={0.65}
      />
    </mesh>
  );
}

/** 12 rashi arc segments coloured by element */
function RashiSegments() {
  const segments: React.ReactNode[] = [];

  RASHIS.forEach((rashi) => {
    const elementEn = rashi.element?.en ?? 'Fire';
    const color = ELEMENT_COLORS[elementEn] ?? '#FF6B35';
    const startRad = (rashi.startDeg * Math.PI) / 180;
    const endRad = (rashi.endDeg * Math.PI) / 180;
    const midRad = (startRad + endRad) / 2;
    const arcSpan = endRad - startRad; // 30° in radians

    // Build a curved arc tube along the ecliptic ring for this rashi
    // We approximate using a series of small cylinder segments
    const points: THREE.Vector3[] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const a = startRad + (arcSpan * i) / steps;
      points.push(
        new THREE.Vector3(
          (ECLIPTIC_RADIUS + 0.04) * Math.cos(a),
          0,
          (ECLIPTIC_RADIUS + 0.04) * Math.sin(a)
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeom = new THREE.TubeGeometry(curve, 20, 0.018, 8, false);

    // Label position
    const lx = (ECLIPTIC_RADIUS + 0.38) * Math.cos(midRad);
    const lz = (ECLIPTIC_RADIUS + 0.38) * Math.sin(midRad);

    segments.push(
      <group key={rashi.id}>
        <mesh geometry={tubeGeom}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.25}
            transparent
            opacity={0.55}
          />
        </mesh>
        {/* Rashi symbol label */}
        <Billboard position={[lx, 0, lz]}>
          <Html
            center
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                color: '#f0d48a',
                fontSize: '10px',
                fontWeight: '600',
                textShadow: '0 0 6px #0a0e27',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px' }}>{rashi.symbol}</div>
              <div style={{ fontSize: '8px', color: '#d4a853', marginTop: '1px' }}>
                {rashi.name.en.substring(0, 3).toUpperCase()}
              </div>
            </div>
          </Html>
        </Billboard>
      </group>
    );
  });

  return <group>{segments}</group>;
}

/** 27 nakshatra boundary tick marks around the ecliptic */
function NakshatraTicks({ showLabels }: { showLabels: boolean }) {
  const ticks: React.ReactNode[] = [];

  for (let i = 0; i < 27; i++) {
    const startDeg = i * NAKSHATRA_SPAN;
    const midDeg = startDeg + NAKSHATRA_SPAN / 2;
    const tickRad = (startDeg * Math.PI) / 180;
    const midRad = (midDeg * Math.PI) / 180;

    // Tick mark — thin radial cylinder at nakshatra boundary
    const innerR = ECLIPTIC_RADIUS - 0.05;
    const outerR = ECLIPTIC_RADIUS + 0.05;
    const ix = innerR * Math.cos(tickRad);
    const iz = innerR * Math.sin(tickRad);
    const ox = outerR * Math.cos(tickRad);
    const oz = outerR * Math.sin(tickRad);

    const start = new THREE.Vector3(ix, 0, iz);
    const end = new THREE.Vector3(ox, 0, oz);
    const dir = end.clone().sub(start);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const len = dir.length();
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      up,
      dir.clone().normalize()
    );

    ticks.push(
      <mesh key={`tick-${i}`} position={[mid.x, mid.y, mid.z]} quaternion={quaternion}>
        <cylinderGeometry args={[0.004, 0.004, len, 4]} />
        <meshStandardMaterial
          color="#8a6d2b"
          emissive="#8a6d2b"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    );

    // Nakshatra label (shown at every 3rd for clarity, all if showLabels)
    if (showLabels && (i % 3 === 0 || showLabels)) {
      const nakshatra = NAKSHATRAS[i];
      const labelR = ECLIPTIC_RADIUS + 0.22;
      const lx = labelR * Math.cos(midRad);
      const lz = labelR * Math.sin(midRad);

      ticks.push(
        <Billboard key={`label-${i}`} position={[lx, 0, lz]}>
          <Html
            center
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                color: i % 3 === 0 ? '#a08030' : '#6a5a28',
                fontSize: i % 3 === 0 ? '7px' : '6px',
                textShadow: '0 0 4px #0a0e27',
              }}
            >
              {nakshatra?.name.en.substring(0, 4) ?? ''}
            </div>
          </Html>
        </Billboard>
      );
    }
  }

  return <group>{ticks}</group>;
}

/** Pulsing glow ring for retrograde planets */
function RetroGlow({ color, radius }: { color: string; radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + 0.35 * Math.abs(Math.sin(clock.elapsedTime * 2));
      meshRef.current.scale.setScalar(s);
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.25 + 0.2 * Math.abs(Math.sin(clock.elapsedTime * 2));
    }
  });
  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius * 1.8, 0.006, 8, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

interface PlanetSphereProps {
  planet: SkyPlanetPosition;
  onHover: (p: SkyPlanetPosition | null) => void;
  onSelect: (p: SkyPlanetPosition) => void;
  isSelected: boolean;
}

/** Single planet sphere on the ecliptic */
function PlanetSphere({ planet, onHover, onSelect, isSelected }: PlanetSphereProps) {
  const color = PLANET_COLORS[planet.id] ?? '#ffffff';
  const size = PLANET_SIZES[planet.id] ?? 0.06;
  const pos = eclipticPosition(planet.siderealLongitude, ECLIPTIC_RADIUS);

  return (
    <group position={pos}>
      {/* Retrograde pulsing ring */}
      {planet.isRetrograde && <RetroGlow color="#DC143C" radius={size} />}

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 2.2, 0.006, 8, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {/* Planet sphere */}
      <mesh
        onPointerEnter={() => onHover(planet)}
        onPointerLeave={() => onHover(null)}
        onClick={() => onSelect(planet)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Planet short label */}
      <Billboard>
        <Html
          center
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            style={{
              color: '#0a0e27',
              fontSize: '7px',
              fontWeight: '800',
              textShadow: 'none',
              marginTop: `${-size * 40}px`,
              background: color,
              borderRadius: '50%',
              width: '14px',
              height: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            {PLANET_SHORT[planet.id]}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

/** Equatorial plane — a faint reference disc */
function EquatorialPlane() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.01, ECLIPTIC_RADIUS * 1.5, 64]} />
      <meshStandardMaterial
        color="#1a2060"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Celestial equator ring */
function EquatorialRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[ECLIPTIC_RADIUS * 1.15, 0.005, 8, 128]} />
      <meshStandardMaterial
        color="#2d4080"
        emissive="#2d4080"
        emissiveIntensity={0.3}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

/** Earth at center */
function EarthCenter() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#0d1230"
          emissive="#1a2060"
          emissiveIntensity={0.3}
          roughness={0.8}
        />
      </mesh>
      {/* Gold cross lines on the equatorial plane */}
      {[0, Math.PI / 2].map((rot, i) => (
        <mesh key={i} rotation={[0, rot, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.36, 4]} />
          <meshStandardMaterial
            color="#d4a853"
            emissive="#d4a853"
            emissiveIntensity={0.6}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Camera reset helper — lives inside Canvas so it can access useThree
// ---------------------------------------------------------------------------

function CameraResetter({ resetSignal }: { resetSignal: number }) {
  const { camera } = useThree();
  useEffect(() => {
    if (resetSignal > 0) {
      camera.position.set(0, 2, 5);
      camera.lookAt(0, 0, 0);
    }
  }, [resetSignal, camera]);
  return null;
}

// ---------------------------------------------------------------------------
// Tooltip overlay (HTML, outside Canvas)
// ---------------------------------------------------------------------------

function TooltipOverlay({ planet }: { planet: SkyPlanetPosition | null }) {
  if (!planet) return null;
  const color = PLANET_COLORS[planet.id] ?? '#ffffff';
  const degInRashi = planet.siderealLongitude % 30;
  const rashi = RASHIS[planet.rashi - 1];
  const nakshatra = NAKSHATRAS[planet.nakshatra - 1];

  const fmt = (deg: number) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d}°${String(m).padStart(2, '0')}'`;
  };

  return (
    <div
      className="absolute top-4 left-4 z-20 pointer-events-none"
      style={{ minWidth: '200px' }}
    >
      <div className="bg-[#111633]/95 border border-[#8a6d2b]/40 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
          />
          <span className="text-[#f0d48a] font-semibold text-sm">{planet.name}</span>
          {planet.isRetrograde && (
            <span className="text-red-400 text-[10px] font-medium">℞</span>
          )}
        </div>
        <div className="space-y-0.5 text-xs text-[#8a8478]">
          <div>
            <span className="text-[#e6e2d8]">{fmt(planet.siderealLongitude)}</span>
            {' '}sidereal
          </div>
          <div>
            <span className="text-[#e6e2d8]">{fmt(degInRashi)}</span>
            {' '}{rashi?.name.en ?? ''} {rashi?.symbol ?? ''}
          </div>
          <div>
            Nakshatra:{' '}
            <span className="text-[#e6e2d8]">{nakshatra?.name.en ?? ''}</span>
            {' '}pada {planet.nakshatraPada}
          </div>
          <div>
            Speed:{' '}
            <span className="text-[#e6e2d8]">
              {planet.speed >= 0 ? '+' : ''}{planet.speed.toFixed(3)}°/day
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export interface CelestialSphereProps {
  /** Initial positions (e.g. passed from server) */
  initialPositions?: SkyPlanetPosition[];
  /** Whether to auto-rotate the scene */
  autoRotate?: boolean;
  /** Whether to show nakshatra labels */
  showLabels?: boolean;
  /** Signal to reset camera (increment to trigger) */
  resetSignal?: number;
  /** Called when a planet is selected */
  onPlanetSelect?: (planet: SkyPlanetPosition | null) => void;
}

export function CelestialSphere({
  initialPositions,
  autoRotate = false,
  showLabels = true,
  resetSignal = 0,
  onPlanetSelect,
}: CelestialSphereProps) {
  const [positions, setPositions] = useState<SkyPlanetPosition[]>(
    initialPositions ?? []
  );
  const [hoveredPlanet, setHoveredPlanet] = useState<SkyPlanetPosition | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<SkyPlanetPosition | null>(null);
  const [loading, setLoading] = useState(!initialPositions?.length);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
      console.error('[CelestialSphere] fetchPositions failed:', err);
      setError('Failed to load planetary positions. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!initialPositions?.length) {
      void fetchPositions();
    } else {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, [fetchPositions, initialPositions]);

  // Auto-refresh every 60s
  useEffect(() => {
    const timer = setInterval(() => { void fetchPositions(); }, 60_000);
    return () => clearInterval(timer);
  }, [fetchPositions]);

  const handleSelect = useCallback((p: SkyPlanetPosition) => {
    const next = selectedPlanet?.id === p.id ? null : p;
    setSelectedPlanet(next);
    onPlanetSelect?.(next);
  }, [selectedPlanet, onPlanetSelect]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-[#0a0e27] rounded-xl" style={{ height: 500 }}>
        <div className="text-[#8a8478] text-sm animate-pulse">Initialising 3D scene…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-[#0a0e27] rounded-xl" style={{ height: 500 }}>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#8a6d2b]/20" style={{ height: 500, background: '#0a0e27' }}>
      {/* Tooltip overlay — HTML on top of canvas */}
      {(hoveredPlanet ?? selectedPlanet) && (
        <TooltipOverlay planet={hoveredPlanet ?? selectedPlanet} />
      )}

      {/* Timestamp */}
      {lastUpdated && (
        <div className="absolute bottom-3 right-3 z-10 text-[#6a5a28] text-[10px] pointer-events-none">
          Updated {lastUpdated.toLocaleTimeString()} UTC
        </div>
      )}

      <Canvas
        camera={{ position: [0, 2, 5], fov: 60, near: 0.01, far: 500 }}
        style={{ background: '#0a0e27' }}
        gl={{ antialias: true }}
      >
        <CameraResetter resetSignal={resetSignal} />

        {/* Lighting */}
        <ambientLight intensity={0.25} />
        {/* Central "sun" point light */}
        <pointLight position={[0, 0, 0]} intensity={2} color="#FFD700" distance={12} />
        {/* Fill lights */}
        <directionalLight position={[5, 3, 5]} intensity={0.4} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.15} color="#4466ff" />

        {/* Star field background */}
        <Stars
          radius={100}
          depth={50}
          count={4000}
          factor={4}
          saturation={0.1}
          fade
          speed={0.3}
        />

        {/* Equatorial reference plane and ring (not tilted) */}
        <EquatorialPlane />
        <EquatorialRing />

        {/* Earth at center */}
        <EarthCenter />

        {/* Ecliptic group — tilted 23.4° from equatorial */}
        <group rotation={[ECLIPTIC_TILT, 0, 0]}>
          <EclipticRing />
          <RashiSegments />
          <NakshatraTicks showLabels={showLabels} />

          {/* Planet spheres */}
          {positions.map((p) => (
            <PlanetSphere
              key={p.id}
              planet={p}
              onHover={setHoveredPlanet}
              onSelect={handleSelect}
              isSelected={selectedPlanet?.id === p.id}
            />
          ))}
        </group>

        {/* Orbit controls */}
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.4}
          enablePan={false}
          minDistance={1.5}
          maxDistance={12}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
