import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * Dramatic cosmic background with multiple presets.
 * Each preset uses layered CSS gradients, particles, light effects,
 * and Ken Burns camera movement for cinematic feel.
 *
 * Presets: nebula, planet, sun_corona, galaxy, deep_space, aurora, eclipse, constellation
 */

export type CosmicPreset =
  | 'nebula'
  | 'planet'
  | 'sun_corona'
  | 'galaxy'
  | 'deep_space'
  | 'aurora'
  | 'eclipse'
  | 'constellation'
  | 'celestial'; // fallback — original star field

interface CosmicBackgroundProps {
  preset: CosmicPreset;
}

// Deterministic particle field — golden angle spread
function makeParticles(count: number, seed: number = 0) {
  return Array.from({ length: count }, (_, i) => ({
    x: ((i * 137.508 + seed * 47) % 100),
    y: ((i * 73.137 + seed * 31) % 100),
    size: 0.5 + (i % 5) * 0.6,
    phaseOffset: i * 0.7 + seed,
    brightness: 0.3 + (i % 7) * 0.1,
  }));
}

const STARS_NEAR = makeParticles(60, 0);
const STARS_MID = makeParticles(120, 42);
const STARS_FAR = makeParticles(200, 99);
const DUST_PARTICLES = makeParticles(40, 17);

/**
 * Ken Burns — slow zoom + pan drift over time.
 */
function useKenBurns(frame: number, fps: number, duration: number) {
  const progress = frame / (duration || fps * 10);
  // Gentle zoom 1.0 → 1.12 over the scene duration
  const scale = interpolate(progress, [0, 1], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });
  // Slight drift
  const translateX = interpolate(progress, [0, 1], [0, -15], {
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(progress, [0, 1], [0, -8], {
    extrapolateRight: 'clamp',
  });
  return { scale, translateX, translateY };
}

/** Multi-layer star field with parallax depth */
const StarLayers: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {/* Far stars — tiny, slow twinkle */}
    {STARS_FAR.map((star, i) => {
      const opacity = interpolate(
        Math.sin((frame + star.phaseOffset * 50) * 0.02),
        [-1, 1],
        [0.08, 0.5]
      );
      return (
        <div
          key={`far-${i}`}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: '#e8e4f0',
            opacity,
          }}
        />
      );
    })}

    {/* Mid stars — medium, moderate twinkle */}
    {STARS_MID.map((star, i) => {
      const opacity = interpolate(
        Math.sin((frame + star.phaseOffset * 30) * 0.04),
        [-1, 1],
        [0.1, 0.7]
      );
      return (
        <div
          key={`mid-${i}`}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size * 1.2,
            height: star.size * 1.2,
            borderRadius: '50%',
            background: '#f0d48a',
            opacity,
          }}
        />
      );
    })}

    {/* Near stars — bright, fast twinkle, with glow */}
    {STARS_NEAR.map((star, i) => {
      const opacity = interpolate(
        Math.sin((frame + star.phaseOffset * 20) * 0.07),
        [-1, 1],
        [0.2, 1.0]
      );
      const glowSize = star.size * 6;
      return (
        <React.Fragment key={`near-${i}`}>
          {/* Glow halo */}
          <div
            style={{
              position: 'absolute',
              left: `calc(${star.x}% - ${glowSize / 2}px)`,
              top: `calc(${star.y}% - ${glowSize / 2}px)`,
              width: glowSize,
              height: glowSize,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(240,212,138,0.3) 0%, transparent 70%)',
              opacity: opacity * 0.5,
            }}
          />
          {/* Core */}
          <div
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * 2,
              height: star.size * 2,
              borderRadius: '50%',
              background: '#fff',
              opacity,
              boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,0.6)`,
            }}
          />
        </React.Fragment>
      );
    })}
  </>
);

/** Cosmic dust — slowly drifting particles */
const CosmicDust: React.FC<{ frame: number; color?: string }> = ({ frame, color = 'rgba(160,120,200,0.15)' }) => (
  <>
    {DUST_PARTICLES.map((p, i) => {
      const drift = (frame * 0.15 + p.phaseOffset * 100) % 120;
      const x = (p.x + drift * 0.3) % 110 - 5;
      const y = (p.y + drift * 0.15) % 110 - 5;
      const opacity = interpolate(
        Math.sin((frame + p.phaseOffset * 40) * 0.03),
        [-1, 1],
        [0.05, 0.25]
      );
      return (
        <div
          key={`dust-${i}`}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: p.size * 20,
            height: p.size * 20,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            opacity,
            filter: 'blur(8px)',
          }}
        />
      );
    })}
  </>
);

/** Lens flare — animated light burst */
const LensFlare: React.FC<{ frame: number; x: string; y: string; delay?: number; color?: string }> = ({
  frame, x, y, delay = 0, color = '#f0d48a'
}) => {
  const intensity = interpolate(
    frame - delay,
    [0, 15, 40, 60],
    [0, 1, 0.7, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  if (intensity <= 0) return null;

  return (
    <>
      {/* Core burst */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 200 * intensity,
          height: 200 * intensity,
          marginLeft: -100 * intensity,
          marginTop: -100 * intensity,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
          opacity: intensity * 0.8,
          filter: 'blur(2px)',
        }}
      />
      {/* Horizontal streak */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 500 * intensity,
          height: 3,
          marginLeft: -250 * intensity,
          marginTop: -1.5,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: intensity * 0.5,
          filter: 'blur(1px)',
        }}
      />
      {/* Vertical streak */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 3,
          height: 300 * intensity,
          marginLeft: -1.5,
          marginTop: -150 * intensity,
          background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
          opacity: intensity * 0.3,
          filter: 'blur(1px)',
        }}
      />
    </>
  );
};

/** ========== PRESET BACKGROUNDS ========== */

/** Deep purple-blue nebula with swirling gas clouds */
function NebulaPreset({ frame, kb }: { frame: number; kb: ReturnType<typeof useKenBurns> }) {
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)` }}>
      {/* Base space */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #050816 0%, #0a0220 30%, #12062e 60%, #070419 100%)' }} />

      {/* Primary nebula cloud — upper left */}
      <div style={{
        position: 'absolute', left: '-10%', top: '-5%', width: '70%', height: '80%',
        background: 'radial-gradient(ellipse 100% 80% at 40% 30%, rgba(120,40,180,0.35) 0%, rgba(60,20,120,0.15) 40%, transparent 70%)',
        filter: 'blur(40px)',
      }} />

      {/* Secondary nebula cloud — lower right, warm */}
      <div style={{
        position: 'absolute', right: '-15%', bottom: '-10%', width: '65%', height: '70%',
        background: 'radial-gradient(ellipse 90% 100% at 60% 70%, rgba(180,60,40,0.25) 0%, rgba(200,100,50,0.1) 35%, transparent 65%)',
        filter: 'blur(50px)',
      }} />

      {/* Tertiary — cyan highlight */}
      <div style={{
        position: 'absolute', left: '20%', top: '40%', width: '50%', height: '40%',
        background: 'radial-gradient(ellipse at center, rgba(40,120,200,0.2) 0%, transparent 60%)',
        filter: 'blur(60px)',
      }} />

      {/* Animated gas wisps */}
      {[0, 1, 2].map((i) => {
        const drift = Math.sin(frame * 0.008 + i * 2.1) * 30;
        const vDrift = Math.cos(frame * 0.006 + i * 1.7) * 20;
        return (
          <div
            key={`wisp-${i}`}
            style={{
              position: 'absolute',
              left: `${25 + i * 20 + drift * 0.1}%`,
              top: `${20 + i * 25 + vDrift * 0.1}%`,
              width: '40%',
              height: '30%',
              background: `radial-gradient(ellipse at center, rgba(${100 + i * 50},${30 + i * 20},${180 - i * 40},0.12) 0%, transparent 60%)`,
              filter: 'blur(30px)',
              transform: `translate(${drift}px, ${vDrift}px) rotate(${i * 30 + frame * 0.05}deg)`,
            }}
          />
        );
      })}

      <StarLayers frame={frame} />
      <CosmicDust frame={frame} color="rgba(140,80,200,0.12)" />
      <LensFlare frame={frame} x="30%" y="25%" delay={10} color="#c090ff" />
    </div>
  );
}

/** Planet view — large planet sphere with atmospheric glow */
function PlanetPreset({ frame, kb }: { frame: number; kb: ReturnType<typeof useKenBurns> }) {
  const planetScale = interpolate(frame, [0, 30], [0.8, 1.0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const atmosphereGlow = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.4, 0.8]
  );

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)` }}>
      {/* Deep space base */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #020510 0%, #0a0e27 50%, #050816 100%)' }} />

      <StarLayers frame={frame} />

      {/* Planet — positioned center-bottom, partially out of frame for drama */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: '-20%',
        width: 900,
        height: 900,
        marginLeft: -450,
        borderRadius: '50%',
        transform: `scale(${planetScale})`,
      }}>
        {/* Atmosphere outer glow */}
        <div style={{
          position: 'absolute', inset: -60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100,150,255,0.15) 45%, rgba(60,100,200,0.08) 55%, transparent 70%)',
          opacity: atmosphereGlow,
          filter: 'blur(15px)',
        }} />

        {/* Planet surface */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 35% 30%, rgba(80,120,180,0.5) 0%, transparent 50%),
            radial-gradient(circle at 65% 60%, rgba(40,60,100,0.4) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, #1a2844 0%, #0d1825 60%, #060d18 100%)
          `,
          boxShadow: 'inset -80px -40px 120px rgba(0,0,0,0.7), inset 30px 20px 80px rgba(100,150,220,0.15)',
        }} />

        {/* Surface bands */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((pos, i) => (
          <div
            key={`band-${i}`}
            style={{
              position: 'absolute',
              left: '5%',
              right: '5%',
              top: `${pos * 100}%`,
              height: '3%',
              background: `linear-gradient(90deg, transparent, rgba(${80 + i * 20},${100 + i * 15},${160 + i * 10},0.12), transparent)`,
              borderRadius: '50%',
              filter: 'blur(4px)',
            }}
          />
        ))}

        {/* Terminator shadow — dark side */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: 'linear-gradient(110deg, transparent 40%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.85) 70%)',
        }} />

        {/* Atmosphere rim light */}
        <div style={{
          position: 'absolute', inset: -4,
          borderRadius: '50%',
          background: 'transparent',
          boxShadow: `
            inset -6px 0 20px rgba(100,160,255,${atmosphereGlow * 0.4}),
            -4px 0 30px rgba(100,160,255,${atmosphereGlow * 0.2})
          `,
        }} />
      </div>

      {/* Distant light source — upper left */}
      <LensFlare frame={frame} x="15%" y="10%" delay={5} color="#aaccff" />
    </div>
  );
}

/** Sun corona — blazing star close-up with corona rays */
function SunCoronaPreset({ frame, kb }: { frame: number; kb: ReturnType<typeof useKenBurns> }) {
  const coronaPulse = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.6, 1.0]
  );

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)` }}>
      {/* Dark base */}
      <div style={{ position: 'absolute', inset: 0, background: '#020105' }} />

      <StarLayers frame={frame} />

      {/* Sun disc — upper right, partially out of frame */}
      <div style={{ position: 'absolute', right: '-25%', top: '-30%', width: 1200, height: 1200 }}>
        {/* Outer corona */}
        <div style={{
          position: 'absolute', inset: -200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,180,50,0.15) 30%, rgba(255,120,30,0.05) 50%, transparent 70%)',
          opacity: coronaPulse,
          filter: 'blur(30px)',
        }} />

        {/* Corona rays */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30;
          const rayLen = 200 + Math.sin(frame * 0.04 + i * 0.8) * 80;
          return (
            <div
              key={`ray-${i}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 4,
                height: rayLen,
                marginLeft: -2,
                background: `linear-gradient(180deg, rgba(255,200,80,${coronaPulse * 0.3}), transparent)`,
                transformOrigin: '50% 0%',
                transform: `rotate(${angle + frame * 0.1}deg)`,
                filter: 'blur(3px)',
              }}
            />
          );
        })}

        {/* Inner glow */}
        <div style={{
          position: 'absolute', inset: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,220,120,0.4) 0%, rgba(255,160,50,0.2) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }} />

        {/* Solar surface */}
        <div style={{
          position: 'absolute', inset: 150,
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 40% 40%, #fff8e0 0%, #ffcc40 20%, #ff9020 50%, #cc4400 80%, #661100 100%)
          `,
          boxShadow: '0 0 100px rgba(255,180,50,0.5), 0 0 200px rgba(255,120,30,0.3)',
        }} />
      </div>

      <CosmicDust frame={frame} color="rgba(255,150,50,0.08)" />
    </div>
  );
}

/** Spiral galaxy viewed from above */
function GalaxyPreset({ frame, kb }: { frame: number; kb: ReturnType<typeof useKenBurns> }) {
  const rotation = frame * 0.03;

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)` }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #020208 0%, #050510 50%, #020208 100%)' }} />

      <StarLayers frame={frame} />

      {/* Galaxy center — bright core */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '45%',
        width: 600, height: 600,
        marginLeft: -300, marginTop: -300,
        transform: `rotate(${rotation}deg)`,
      }}>
        {/* Core glow */}
        <div style={{
          position: 'absolute', inset: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,240,200,0.6) 0%, rgba(240,200,120,0.3) 30%, transparent 60%)',
          filter: 'blur(10px)',
        }} />

        {/* Spiral arms */}
        {[0, 1, 2, 3].map((arm) => (
          <div
            key={`arm-${arm}`}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              background: `conic-gradient(from ${arm * 90}deg at 50% 50%, transparent 0deg, rgba(180,160,220,0.15) 20deg, rgba(120,140,200,0.08) 60deg, transparent 90deg)`,
              filter: 'blur(15px)',
            }}
          />
        ))}

        {/* Outer halo */}
        <div style={{
          position: 'absolute', inset: -100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, transparent 30%, rgba(100,80,160,0.06) 50%, transparent 75%)',
          filter: 'blur(25px)',
        }} />
      </div>

      <CosmicDust frame={frame} color="rgba(120,100,180,0.08)" />
    </div>
  );
}

/** Deep space void — minimal, vast emptiness with distant light */
function DeepSpacePreset({ frame, kb }: { frame: number; kb: ReturnType<typeof useKenBurns> }) {
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)` }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #010108 0%, #030310 40%, #060818 100%)' }} />

      <StarLayers frame={frame} />

      {/* Distant nebula glow — very faint */}
      <div style={{
        position: 'absolute', left: '60%', top: '30%', width: '50%', height: '40%',
        background: 'radial-gradient(ellipse at center, rgba(80,40,120,0.08) 0%, transparent 60%)',
        filter: 'blur(40px)',
      }} />

      {/* Light shaft from above */}
      <div style={{
        position: 'absolute',
        left: '40%', top: 0, width: '20%', height: '100%',
        background: 'linear-gradient(180deg, rgba(200,180,255,0.04), transparent 60%)',
        filter: 'blur(30px)',
        transform: `skewX(${-5 + Math.sin(frame * 0.01) * 2}deg)`,
      }} />

      <CosmicDust frame={frame} color="rgba(100,80,150,0.06)" />
    </div>
  );
}

/** Northern lights / aurora borealis with cosmic backdrop */
function AuroraPreset({ frame, kb }: { frame: number; kb: ReturnType<typeof useKenBurns> }) {
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)` }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #020510 0%, #050a20 50%, #0a1530 100%)' }} />

      <StarLayers frame={frame} />

      {/* Aurora curtains — multiple layers with different phase */}
      {[0, 1, 2].map((i) => {
        const wave = Math.sin(frame * 0.015 + i * 1.5);
        const wave2 = Math.cos(frame * 0.01 + i * 2);
        const colors = [
          'rgba(40,200,120,0.12)',
          'rgba(80,180,220,0.1)',
          'rgba(140,80,200,0.08)',
        ];
        return (
          <div
            key={`aurora-${i}`}
            style={{
              position: 'absolute',
              left: `${10 + i * 15}%`,
              top: `${15 + wave * 5}%`,
              width: '60%',
              height: '50%',
              background: `linear-gradient(180deg, transparent, ${colors[i]}, transparent)`,
              filter: 'blur(40px)',
              transform: `skewX(${wave2 * 8}deg) scaleY(${1 + wave * 0.2})`,
              opacity: 0.6 + wave * 0.3,
            }}
          />
        );
      })}

      <CosmicDust frame={frame} color="rgba(60,180,140,0.08)" />
    </div>
  );
}

/** Solar eclipse — dramatic ring of light */
function EclipsePreset({ frame, kb }: { frame: number; kb: ReturnType<typeof useKenBurns> }) {
  const coronaIntensity = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.5, 1.0]
  );

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)` }}>
      <div style={{ position: 'absolute', inset: 0, background: '#010105' }} />

      <StarLayers frame={frame} />

      {/* Eclipse — center of frame */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '40%',
        width: 400, height: 400,
        marginLeft: -200, marginTop: -200,
      }}>
        {/* Diamond ring effect */}
        <div style={{
          position: 'absolute', inset: -100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, transparent 35%, rgba(255,220,150,0.15) 40%, rgba(255,180,100,0.05) 55%, transparent 70%)',
          opacity: coronaIntensity,
          filter: 'blur(8px)',
        }} />

        {/* Corona streamers */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = i * 45;
          const len = 120 + Math.sin(frame * 0.05 + i) * 40;
          return (
            <div
              key={`corona-${i}`}
              style={{
                position: 'absolute', left: '50%', top: '50%',
                width: 6, height: len,
                marginLeft: -3,
                background: `linear-gradient(180deg, rgba(255,200,120,${coronaIntensity * 0.25}), transparent)`,
                transformOrigin: '50% 0%',
                transform: `rotate(${angle + frame * 0.08}deg)`,
                filter: 'blur(4px)',
              }}
            />
          );
        })}

        {/* Moon disc — perfectly black */}
        <div style={{
          position: 'absolute', inset: 20,
          borderRadius: '50%',
          background: '#000',
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
        }} />

        {/* Rim highlight — bright edge */}
        <div style={{
          position: 'absolute', inset: 18,
          borderRadius: '50%',
          background: 'transparent',
          boxShadow: `0 0 8px rgba(255,220,150,${coronaIntensity * 0.6}), 0 0 25px rgba(255,180,100,${coronaIntensity * 0.3})`,
        }} />
      </div>

      <CosmicDust frame={frame} color="rgba(200,180,120,0.05)" />
    </div>
  );
}

/** Constellation map — connected star patterns */
function ConstellationPreset({ frame, kb }: { frame: number; kb: ReturnType<typeof useKenBurns> }) {
  // Stylized constellation lines
  const constellationStars = [
    { x: 25, y: 20 }, { x: 35, y: 35 }, { x: 30, y: 55 },
    { x: 45, y: 45 }, { x: 55, y: 25 }, { x: 65, y: 40 },
    { x: 60, y: 60 }, { x: 75, y: 50 }, { x: 70, y: 30 },
  ];
  const lines = [
    [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [5, 7], [4, 8],
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)` }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #030818 0%, #0a1030 50%, #050a20 100%)' }} />

      <StarLayers frame={frame} />

      {/* Constellation lines — draw progressively */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {lines.map(([a, b], i) => {
          const lineOpacity = interpolate(frame, [i * 8 + 15, i * 8 + 30], [0, 0.4], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const s1 = constellationStars[a];
          const s2 = constellationStars[b];
          return (
            <line
              key={`line-${i}`}
              x1={`${s1.x}%`} y1={`${s1.y}%`}
              x2={`${s2.x}%`} y2={`${s2.y}%`}
              stroke="#d4a853"
              strokeWidth={1.5}
              opacity={lineOpacity}
            />
          );
        })}
      </svg>

      {/* Constellation anchor stars */}
      {constellationStars.map((star, i) => {
        const starOpacity = interpolate(frame, [i * 5 + 5, i * 5 + 15], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        return (
          <React.Fragment key={`cstar-${i}`}>
            <div style={{
              position: 'absolute',
              left: `calc(${star.x}% - 8px)`, top: `calc(${star.y}% - 8px)`,
              width: 16, height: 16,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(240,212,138,0.5) 0%, transparent 70%)',
              opacity: starOpacity,
            }} />
            <div style={{
              position: 'absolute',
              left: `calc(${star.x}% - 3px)`, top: `calc(${star.y}% - 3px)`,
              width: 6, height: 6,
              borderRadius: '50%',
              background: '#f0d48a',
              opacity: starOpacity,
              boxShadow: '0 0 6px rgba(240,212,138,0.6)',
            }} />
          </React.Fragment>
        );
      })}

      <CosmicDust frame={frame} color="rgba(100,120,180,0.06)" />
    </div>
  );
}

/** Fallback — original celestial star field (enhanced) */
function CelestialPreset({ frame, kb }: { frame: number; kb: ReturnType<typeof useKenBurns> }) {
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)` }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, #0a0e27 0%, #1a1040 40%, #0a0e27 100%)' }} />
      <StarLayers frame={frame} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(45,27,105,0.3) 0%, transparent 70%)',
      }} />
      <CosmicDust frame={frame} />
    </div>
  );
}

/** Main component — selects preset and wraps with Ken Burns */
export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ preset }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const kb = useKenBurns(frame, fps, durationInFrames);

  const presetMap: Record<CosmicPreset, React.ReactNode> = {
    nebula: <NebulaPreset frame={frame} kb={kb} />,
    planet: <PlanetPreset frame={frame} kb={kb} />,
    sun_corona: <SunCoronaPreset frame={frame} kb={kb} />,
    galaxy: <GalaxyPreset frame={frame} kb={kb} />,
    deep_space: <DeepSpacePreset frame={frame} kb={kb} />,
    aurora: <AuroraPreset frame={frame} kb={kb} />,
    eclipse: <EclipsePreset frame={frame} kb={kb} />,
    constellation: <ConstellationPreset frame={frame} kb={kb} />,
    celestial: <CelestialPreset frame={frame} kb={kb} />,
  };

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {presetMap[preset] ?? presetMap.celestial}

      {/* Global vignette overlay — cinematic framing */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
