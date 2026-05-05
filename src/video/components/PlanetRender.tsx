import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

/**
 * Dramatic CSS-rendered planet with atmosphere, surface details,
 * and optional ring system. Used for planet_showcase scenes.
 *
 * Planets: sun, moon, mars, mercury, jupiter, venus, saturn, rahu, ketu
 */

export type PlanetId = 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' | 'rahu' | 'ketu';

interface PlanetRenderProps {
  planet?: PlanetId;
  textOverlay?: string;
  subtitle?: string;
}

interface PlanetStyle {
  surface: string;
  atmosphere: string;
  glow: string;
  glowColor: string;
  hasRings?: boolean;
  ringColor?: string;
  size: number;
}

const PLANET_STYLES: Record<PlanetId, PlanetStyle> = {
  sun: {
    surface: 'radial-gradient(circle at 40% 40%, #fff8e0 0%, #ffcc40 15%, #ff9020 40%, #cc4400 70%, #661100 100%)',
    atmosphere: 'rgba(255,180,50,0.2)',
    glow: '0 0 80px rgba(255,180,50,0.5), 0 0 160px rgba(255,120,30,0.3), 0 0 300px rgba(255,80,20,0.15)',
    glowColor: 'rgba(255,200,80,0.12)',
    size: 500,
  },
  moon: {
    surface: `
      radial-gradient(circle at 30% 35%, #d8d4c8 0%, #b8b0a0 30%, #8a8070 60%, #605848 100%),
      radial-gradient(circle at 65% 25%, rgba(180,170,155,0.4) 0%, transparent 20%),
      radial-gradient(circle at 45% 65%, rgba(100,90,75,0.5) 0%, transparent 15%)
    `,
    atmosphere: 'rgba(200,195,180,0.08)',
    glow: '0 0 40px rgba(200,195,180,0.2), 0 0 80px rgba(180,175,160,0.1)',
    glowColor: 'rgba(200,195,180,0.06)',
    size: 400,
  },
  mars: {
    surface: `
      radial-gradient(circle at 35% 35%, #e8a070 0%, #c87040 30%, #a04820 60%, #602810 100%),
      radial-gradient(circle at 60% 70%, rgba(180,80,30,0.4) 0%, transparent 25%)
    `,
    atmosphere: 'rgba(200,100,50,0.1)',
    glow: '0 0 50px rgba(200,100,50,0.3), 0 0 100px rgba(180,60,20,0.15)',
    glowColor: 'rgba(220,120,60,0.08)',
    size: 350,
  },
  mercury: {
    surface: `
      radial-gradient(circle at 40% 35%, #b0a898 0%, #8a8070 30%, #605850 60%, #383028 100%),
      radial-gradient(circle at 55% 55%, rgba(90,80,70,0.5) 0%, transparent 20%)
    `,
    atmosphere: 'rgba(150,140,120,0.06)',
    glow: '0 0 30px rgba(150,140,120,0.2)',
    glowColor: 'rgba(150,140,120,0.05)',
    size: 280,
  },
  jupiter: {
    surface: `
      radial-gradient(circle at 35% 35%, #e8d0a0 0%, #d4a868 20%, #c08840 40%, #a06830 60%, #704020 100%)
    `,
    atmosphere: 'rgba(220,180,120,0.12)',
    glow: '0 0 60px rgba(220,180,120,0.3), 0 0 120px rgba(200,150,80,0.15)',
    glowColor: 'rgba(220,180,120,0.08)',
    size: 550,
  },
  venus: {
    surface: `
      radial-gradient(circle at 40% 35%, #f0e8d0 0%, #e0d0a0 25%, #c8b878 50%, #a89858 80%, #887838 100%)
    `,
    atmosphere: 'rgba(240,230,200,0.15)',
    glow: '0 0 50px rgba(240,230,200,0.3), 0 0 100px rgba(220,200,150,0.15)',
    glowColor: 'rgba(240,230,200,0.08)',
    size: 380,
  },
  saturn: {
    surface: `
      radial-gradient(circle at 35% 35%, #e8d8b0 0%, #d0b880 25%, #b8a068 50%, #907840 80%, #685828 100%)
    `,
    atmosphere: 'rgba(220,200,160,0.1)',
    glow: '0 0 50px rgba(220,200,160,0.25), 0 0 100px rgba(200,180,120,0.12)',
    glowColor: 'rgba(220,200,160,0.07)',
    size: 420,
    hasRings: true,
    ringColor: 'rgba(200,180,140,0.3)',
  },
  rahu: {
    surface: `
      radial-gradient(circle at 45% 45%, #2a2040 0%, #1a1030 40%, #0a0818 80%, #050410 100%)
    `,
    atmosphere: 'rgba(80,50,120,0.15)',
    glow: '0 0 60px rgba(80,50,120,0.4), 0 0 120px rgba(60,30,100,0.2)',
    glowColor: 'rgba(100,60,160,0.1)',
    size: 380,
  },
  ketu: {
    surface: `
      radial-gradient(circle at 40% 40%, #403020 0%, #302018 30%, #201008 60%, #100808 100%),
      radial-gradient(circle at 60% 30%, rgba(255,100,30,0.2) 0%, transparent 30%)
    `,
    atmosphere: 'rgba(200,80,30,0.08)',
    glow: '0 0 40px rgba(200,80,30,0.3), 0 0 80px rgba(150,40,10,0.15)',
    glowColor: 'rgba(200,80,30,0.07)',
    size: 320,
  },
};

export const PlanetRender: React.FC<PlanetRenderProps> = ({ planet = 'jupiter', textOverlay, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const style = PLANET_STYLES[planet];

  // Planet emerges from darkness
  const revealScale = spring({
    frame,
    fps,
    config: { damping: 25, stiffness: 40 },
  });

  const revealOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Slow rotation for surface
  const surfaceRotation = frame * 0.08;

  // Atmosphere pulse
  const atmPulse = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.6, 1.0]
  );

  const planetSize = style.size;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Planet container */}
      <div
        style={{
          position: 'relative',
          width: planetSize,
          height: planetSize,
          transform: `scale(${revealScale})`,
          opacity: revealOpacity,
        }}
      >
        {/* Outer atmosphere glow */}
        <div style={{
          position: 'absolute',
          inset: -80,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${style.atmosphere} 40%, transparent 70%)`,
          opacity: atmPulse,
          filter: 'blur(20px)',
        }} />

        {/* Rings — behind planet for Saturn */}
        {style.hasRings && (
          <div style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: planetSize * 1.8,
            height: planetSize * 0.5,
            marginLeft: -planetSize * 0.9,
            marginTop: -planetSize * 0.25,
            borderRadius: '50%',
            border: `12px solid ${style.ringColor}`,
            transform: 'rotateX(70deg)',
            opacity: revealOpacity * 0.7,
            boxShadow: `0 0 20px ${style.ringColor}, inset 0 0 20px ${style.ringColor}`,
          }} />
        )}

        {/* Planet sphere */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: style.surface,
          boxShadow: `inset -60px -30px 80px rgba(0,0,0,0.6), ${style.glow}`,
          overflow: 'hidden',
        }}>
          {/* Jupiter-style bands */}
          {(planet === 'jupiter' || planet === 'saturn') && (
            <>
              {[0.2, 0.3, 0.45, 0.55, 0.7, 0.8].map((pos, i) => (
                <div
                  key={`band-${i}`}
                  style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    top: `${pos * 100}%`,
                    height: '4%',
                    background: `linear-gradient(90deg, transparent 5%, rgba(${i % 2 ? '0,0,0' : '255,255,255'},0.08) 20%, rgba(${i % 2 ? '0,0,0' : '255,255,255'},0.06) 80%, transparent 95%)`,
                    transform: `translateX(${surfaceRotation % 100}px)`,
                  }}
                />
              ))}
              {/* Jupiter Great Red Spot */}
              {planet === 'jupiter' && (
                <div style={{
                  position: 'absolute',
                  left: `${40 + Math.sin(surfaceRotation * 0.01) * 10}%`,
                  top: '55%',
                  width: 60, height: 40,
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(180,60,30,0.5) 0%, rgba(150,40,20,0.2) 50%, transparent 70%)',
                }} />
              )}
            </>
          )}

          {/* Moon craters */}
          {planet === 'moon' && (
            <>
              {[
                { x: 30, y: 25, size: 35 },
                { x: 55, y: 40, size: 25 },
                { x: 40, y: 65, size: 30 },
                { x: 70, y: 30, size: 20 },
                { x: 25, y: 50, size: 18 },
              ].map((crater, i) => (
                <div
                  key={`crater-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${crater.x}%`, top: `${crater.y}%`,
                    width: crater.size, height: crater.size,
                    marginLeft: -crater.size / 2, marginTop: -crater.size / 2,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%)',
                    boxShadow: `inset 2px 2px 4px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(255,255,255,0.05)`,
                  }}
                />
              ))}
            </>
          )}

          {/* Terminator shadow */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'linear-gradient(105deg, transparent 35%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 65%)',
          }} />
        </div>

        {/* Atmosphere rim light */}
        <div style={{
          position: 'absolute', inset: -3,
          borderRadius: '50%',
          background: 'transparent',
          boxShadow: `inset -4px 0 15px ${style.atmosphere}, -3px 0 20px ${style.atmosphere}`,
        }} />

        {/* Rahu — smoky shadow effect */}
        {planet === 'rahu' && (
          <div style={{
            position: 'absolute', inset: -40,
            borderRadius: '50%',
            background: 'radial-gradient(circle, transparent 40%, rgba(20,10,40,0.4) 55%, rgba(10,5,20,0.2) 70%, transparent 85%)',
            filter: 'blur(10px)',
            transform: `rotate(${frame * 0.2}deg)`,
          }} />
        )}

        {/* Ketu — fiery tail */}
        {planet === 'ketu' && (
          <div style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 200, height: 400,
            marginLeft: -100,
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,100,20,0.1) 30%, rgba(255,60,10,0.05) 60%, transparent 100%)',
            filter: 'blur(15px)',
            transformOrigin: '50% 0%',
            transform: `rotate(${30 + Math.sin(frame * 0.03) * 10}deg)`,
          }} />
        )}
      </div>

      {/* Text overlay below planet */}
      {textOverlay && (
        <div style={{
          position: 'absolute',
          bottom: 280,
          width: '100%',
          textAlign: 'center',
          padding: '0 80px',
        }}>
          <div style={{
            fontSize: 56,
            fontWeight: 800,
            fontFamily: 'Inter, system-ui, sans-serif',
            background: 'linear-gradient(180deg, #f0d48a 0%, #d4a853 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: interpolate(frame, [20, 40], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            }),
            textShadow: '0 0 40px rgba(240,212,138,0.3)',
          }}>
            {textOverlay}
          </div>
          {subtitle && (
            <div style={{
              fontSize: 32,
              fontWeight: 500,
              fontFamily: 'Inter, system-ui, sans-serif',
              color: '#8a8478',
              marginTop: 16,
              opacity: interpolate(frame, [30, 50], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              }),
            }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
