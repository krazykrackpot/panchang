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
import { tl } from '@/lib/utils/trilingual';

// ---------------------------------------------------------------------------
// Constants — hoisted from render path (perf rule)
// ---------------------------------------------------------------------------

const ECLIPTIC_TILT = 23.4 * (Math.PI / 180);
const ECLIPTIC_RADIUS = 3.0;
const NAKSHATRA_SPAN = 360 / 27; // ≈13.333°

/** Planet colors by id (0=Sun … 8=Ketu) */
const PLANET_COLORS: Record<number, string> = {
  0: '#FF6B35', 1: '#C0C0C0', 2: '#DC143C', 3: '#50C878',
  4: '#FFD700', 5: '#FF69B4', 6: '#4169E1', 7: '#8B6914', 8: '#808080',
};

/** Relative planet sizes (sphere radius) */
const PLANET_SIZES: Record<number, number> = {
  0: 0.10, 1: 0.07, 2: 0.055, 3: 0.045, 4: 0.12, 5: 0.06, 6: 0.11, 7: 0.055, 8: 0.05,
};

/** Short labels for planet spheres */
const PLANET_SHORT: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

/** Element fill colors for rashi segments */
const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#FF6B35', Earth: '#50C878', Air: '#6B8DD6', Water: '#B0BEC5',
};

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

/** Convert sidereal longitude (0-360°) to a 3D point on the ecliptic ring. */
function eclipticPosition(longitude: number, radius: number): [number, number, number] {
  const angle = (longitude * Math.PI) / 180;
  return [radius * Math.cos(angle), 0, radius * Math.sin(angle)];
}

/** Format degrees as D°MM' */
function fmtDeg(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, '0')}'`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Ecliptic ring — thicker and more prominent */
function EclipticRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[ECLIPTIC_RADIUS, 0.012, 16, 200]} />
      <meshStandardMaterial
        color="#d4a853" emissive="#d4a853" emissiveIntensity={0.5}
        transparent opacity={0.75}
      />
    </mesh>
  );
}

/** Degree tick marks every 30° on the ecliptic ring (rashi boundaries) */
function DegreeMarkings({ locale }: { locale: string }) {
  const marks: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const deg = i * 30;
    const rad = (deg * Math.PI) / 180;
    const innerR = ECLIPTIC_RADIUS - 0.08;
    const outerR = ECLIPTIC_RADIUS + 0.08;
    const ix = innerR * Math.cos(rad); const iz = innerR * Math.sin(rad);
    const ox = outerR * Math.cos(rad); const oz = outerR * Math.sin(rad);
    const mid = new THREE.Vector3((ix + ox) / 2, 0, (iz + oz) / 2);
    const dir = new THREE.Vector3(ox - ix, 0, oz - iz);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), dir.clone().normalize()
    );
    const lx = (ECLIPTIC_RADIUS + 0.55) * Math.cos(rad);
    const lz = (ECLIPTIC_RADIUS + 0.55) * Math.sin(rad);
    marks.push(
      <group key={`deg-${deg}`}>
        {/* Tick cylinder */}
        <mesh position={[mid.x, mid.y, mid.z]} quaternion={q}>
          <cylinderGeometry args={[0.006, 0.006, 0.16, 4]} />
          <meshStandardMaterial color="#f0d48a" emissive="#f0d48a" emissiveIntensity={0.5} />
        </mesh>
        {/* Degree label */}
        <Billboard position={[lx, 0, lz]}>
          <Html center style={{ pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}>
            <div style={{ color: '#f0d48a', fontSize: '9px', fontWeight: '700', textShadow: '0 0 6px #0a0e27' }}>
              {deg}°
            </div>
          </Html>
        </Billboard>
      </group>
    );
    void locale; // locale available for future use
  }
  return <group>{marks}</group>;
}

/** 12 rashi arc segments with full name labels */
function RashiSegments({ locale }: { locale: string }) {
  const segments: React.ReactNode[] = [];

  RASHIS.forEach((rashi) => {
    const elementEn = rashi.element?.en ?? 'Fire';
    const color = ELEMENT_COLORS[elementEn] ?? '#FF6B35';
    const startRad = (rashi.startDeg * Math.PI) / 180;
    const endRad = (rashi.endDeg * Math.PI) / 180;
    const midRad = (startRad + endRad) / 2;
    const arcSpan = endRad - startRad;

    const points: THREE.Vector3[] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const a = startRad + (arcSpan * i) / steps;
      points.push(new THREE.Vector3(
        (ECLIPTIC_RADIUS + 0.04) * Math.cos(a), 0, (ECLIPTIC_RADIUS + 0.04) * Math.sin(a)
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeom = new THREE.TubeGeometry(curve, 20, 0.018, 8, false);

    const lx = (ECLIPTIC_RADIUS + 0.32) * Math.cos(midRad);
    const lz = (ECLIPTIC_RADIUS + 0.32) * Math.sin(midRad);

    segments.push(
      <group key={rashi.id}>
        <mesh geometry={tubeGeom}>
          <meshStandardMaterial
            color={color} emissive={color} emissiveIntensity={0.25} transparent opacity={0.55}
          />
        </mesh>
        <Billboard position={[lx, 0, lz]}>
          <Html center style={{ pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}>
            <div style={{ color: '#f0d48a', fontSize: '9px', fontWeight: '600', textShadow: '0 0 6px #0a0e27', lineHeight: 1.2, textAlign: 'center' }}>
              <div style={{ fontSize: '13px' }}>{rashi.symbol}</div>
              <div style={{ fontSize: '9px', color: '#e0c070', marginTop: '1px' }}>
                {tl(rashi.name, locale)}
              </div>
            </div>
          </Html>
        </Billboard>
      </group>
    );
  });

  return <group>{segments}</group>;
}

/** 27 nakshatra tick marks + full names around the ecliptic */
function NakshatraTicks({ showLabels, locale }: { showLabels: boolean; locale: string }) {
  const ticks: React.ReactNode[] = [];

  for (let i = 0; i < 27; i++) {
    const startDeg = i * NAKSHATRA_SPAN;
    const midDeg = startDeg + NAKSHATRA_SPAN / 2;
    const tickRad = (startDeg * Math.PI) / 180;
    const midRad = (midDeg * Math.PI) / 180;

    const innerR = ECLIPTIC_RADIUS - 0.05;
    const outerR = ECLIPTIC_RADIUS + 0.05;
    const ix = innerR * Math.cos(tickRad); const iz = innerR * Math.sin(tickRad);
    const ox = outerR * Math.cos(tickRad); const oz = outerR * Math.sin(tickRad);
    const start = new THREE.Vector3(ix, 0, iz);
    const end = new THREE.Vector3(ox, 0, oz);
    const dir = end.clone().sub(start);
    const midPt = start.clone().add(end).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), dir.clone().normalize()
    );

    ticks.push(
      <mesh key={`tick-${i}`} position={[midPt.x, midPt.y, midPt.z]} quaternion={q}>
        <cylinderGeometry args={[0.004, 0.004, dir.length(), 4]} />
        <meshStandardMaterial color="#8a6d2b" emissive="#8a6d2b" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>
    );

    if (showLabels) {
      const nakshatra = NAKSHATRAS[i];
      const labelR = ECLIPTIC_RADIUS + 0.22;
      const lx = labelR * Math.cos(midRad);
      const lz = labelR * Math.sin(midRad);

      ticks.push(
        <Billboard key={`nak-label-${i}`} position={[lx, 0, lz]}>
          <Html center style={{ pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}>
            <div style={{ color: '#c8a040', fontSize: '9px', fontWeight: '500', textShadow: '0 0 4px #0a0e27', lineHeight: 1.1, textAlign: 'center' }}>
              {tl(nakshatra?.name, locale)}
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
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.25 + 0.2 * Math.abs(Math.sin(clock.elapsedTime * 2));
    }
  });
  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius * 1.8, 0.006, 8, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.3} />
    </mesh>
  );
}

/** Rich HTML tooltip content for a planet */
function PlanetTooltipContent({ planet, locale, persistent }: {
  planet: SkyPlanetPosition;
  locale: string;
  persistent: boolean;
}) {
  const color = PLANET_COLORS[planet.id] ?? '#ffffff';
  const degInRashi = planet.siderealLongitude % 30;
  const rashi = RASHIS[planet.rashi - 1];
  const nakshatra = NAKSHATRAS[planet.nakshatra - 1];

  return (
    <div style={{
      minWidth: '180px',
      background: 'rgba(17,22,51,0.97)',
      border: `1px solid ${persistent ? '#d4a853' : '#4a3a1b'}`,
      borderRadius: '10px',
      padding: '10px 12px',
      boxShadow: `0 4px 24px rgba(0,0,0,0.7), 0 0 12px ${color}33`,
      backdropFilter: 'blur(8px)',
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
        <span style={{ color: '#f0d48a', fontWeight: 700, fontSize: '12px' }}>{planet.name}</span>
        {planet.isRetrograde && <span style={{ color: '#f87171', fontSize: '10px' }}>℞</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px', color: '#8a8478' }}>
        <div><span style={{ color: '#e6e2d8' }}>{fmtDeg(planet.siderealLongitude)}</span> sidereal</div>
        <div><span style={{ color: '#e6e2d8' }}>{fmtDeg(degInRashi)}</span> in {tl(rashi?.name, locale)} {rashi?.symbol}</div>
        <div>Nakshatra: <span style={{ color: '#e6e2d8' }}>{tl(nakshatra?.name, locale)}</span> pada {planet.nakshatraPada}</div>
        <div>Speed: <span style={{ color: planet.isRetrograde ? '#f87171' : '#e6e2d8' }}>
          {planet.speed >= 0 ? '+' : ''}{planet.speed.toFixed(3)}°/day
        </span></div>
      </div>
    </div>
  );
}

interface PlanetSphereProps {
  planet: SkyPlanetPosition;
  onHover: (p: SkyPlanetPosition | null) => void;
  onSelect: (p: SkyPlanetPosition) => void;
  isSelected: boolean;
  isHovered: boolean;
  locale: string;
}

/** Single planet sphere on the ecliptic with glow, label, and rich tooltip */
function PlanetSphere({ planet, onHover, onSelect, isSelected, isHovered, locale }: PlanetSphereProps) {
  const color = PLANET_COLORS[planet.id] ?? '#ffffff';
  const size = PLANET_SIZES[planet.id] ?? 0.06;
  const pos = eclipticPosition(planet.siderealLongitude, ECLIPTIC_RADIUS);
  const glowColor = planet.isRetrograde ? '#DC143C' : color;

  return (
    <group position={pos}>
      {/* Glow point light near planet */}
      <pointLight color={glowColor} intensity={planet.isRetrograde ? 0.6 : 0.35} distance={1.2} decay={2} />

      {/* Retrograde pulsing ring */}
      {planet.isRetrograde && <RetroGlow color="#DC143C" radius={size} />}

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[size * 2.4, 0.007, 8, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} transparent opacity={0.9} />
        </mesh>
      )}

      {/* Planet sphere */}
      <mesh
        onPointerEnter={(e) => { e.stopPropagation(); onHover(planet); }}
        onPointerLeave={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onSelect(planet); }}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.6} roughness={0.35} metalness={0.1}
        />
      </mesh>

      {/* Persistent floating label: "Su 15°" */}
      <Billboard position={[0, size + 0.12, 0]}>
        <Html center style={{ pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}>
          <div style={{
            color: '#f0d48a',
            fontSize: '9px',
            fontWeight: '700',
            textShadow: '0 0 5px #0a0e27, 0 0 8px #0a0e27',
            background: 'rgba(10,14,39,0.7)',
            borderRadius: '3px',
            padding: '1px 3px',
          }}>
            {PLANET_SHORT[planet.id]} {Math.floor(planet.siderealLongitude)}°
          </div>
        </Html>
      </Billboard>

      {/* Rich tooltip on hover or selection */}
      {(isHovered || isSelected) && (
        <Billboard position={[0, size + 0.42, 0]}>
          <Html center style={{ pointerEvents: 'none', userSelect: 'none', zIndex: 50 }}>
            <PlanetTooltipContent planet={planet} locale={locale} persistent={isSelected} />
          </Html>
        </Billboard>
      )}
    </group>
  );
}

/** Equatorial reference plane */
function EquatorialPlane() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.01, ECLIPTIC_RADIUS * 1.5, 64]} />
      <meshStandardMaterial color="#1a2060" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Celestial equator ring */
function EquatorialRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[ECLIPTIC_RADIUS * 1.15, 0.005, 8, 128]} />
      <meshStandardMaterial color="#2d4080" emissive="#2d4080" emissiveIntensity={0.3} transparent opacity={0.35} />
    </mesh>
  );
}

/** Earth at center */
function EarthCenter() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#0d1230" emissive="#1a2060" emissiveIntensity={0.3} roughness={0.8} />
      </mesh>
      {[0, Math.PI / 2].map((rot, i) => (
        <mesh key={i} rotation={[0, rot, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.36, 4]} />
          <meshStandardMaterial color="#d4a853" emissive="#d4a853" emissiveIntensity={0.6} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Camera reset helper — lives inside Canvas */
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
  /** Display locale for planet/nakshatra/rashi names */
  locale?: string;
}

export function CelestialSphere({
  initialPositions,
  autoRotate = false,
  showLabels = true,
  resetSignal = 0,
  onPlanetSelect,
  locale = 'en',
}: CelestialSphereProps) {
  const [positions, setPositions] = useState<SkyPlanetPosition[]>(initialPositions ?? []);
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

  useEffect(() => {
    if (!initialPositions?.length) {
      void fetchPositions();
    } else {
      setLastUpdated(new Date());
      setLoading(false);
    }
  }, [fetchPositions, initialPositions]);

  useEffect(() => {
    const timer = setInterval(() => { void fetchPositions(); }, 60_000);
    return () => clearInterval(timer);
  }, [fetchPositions]);

  const handleSelect = useCallback((p: SkyPlanetPosition) => {
    const next = selectedPlanet?.id === p.id ? null : p;
    setSelectedPlanet(next);
    onPlanetSelect?.(next);
  }, [selectedPlanet, onPlanetSelect]);

  // Click on background dismisses selection
  const handleBackgroundClick = useCallback(() => {
    setSelectedPlanet(null);
    onPlanetSelect?.(null);
  }, [onPlanetSelect]);

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
      {lastUpdated && (
        <div className="absolute bottom-3 right-3 z-10 text-[#6a5a28] text-[10px] pointer-events-none">
          Updated {lastUpdated.toLocaleTimeString()} UTC
        </div>
      )}

      <Canvas
        camera={{ position: [0, 2, 5], fov: 60, near: 0.01, far: 500 }}
        style={{ background: '#0a0e27' }}
        gl={{ antialias: true }}
        onClick={handleBackgroundClick}
      >
        <CameraResetter resetSignal={resetSignal} />

        <ambientLight intensity={0.25} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#FFD700" distance={12} />
        <directionalLight position={[5, 3, 5]} intensity={0.4} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.15} color="#4466ff" />

        <Stars radius={100} depth={50} count={4000} factor={4} saturation={0.1} fade speed={0.3} />

        <EquatorialPlane />
        <EquatorialRing />
        <EarthCenter />

        <group rotation={[ECLIPTIC_TILT, 0, 0]}>
          <EclipticRing />
          <DegreeMarkings locale={locale} />
          <RashiSegments locale={locale} />
          <NakshatraTicks showLabels={showLabels} locale={locale} />

          {positions.map((p) => (
            <PlanetSphere
              key={p.id}
              planet={p}
              onHover={setHoveredPlanet}
              onSelect={handleSelect}
              isSelected={selectedPlanet?.id === p.id}
              isHovered={hoveredPlanet?.id === p.id}
              locale={locale}
            />
          ))}
        </group>

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
