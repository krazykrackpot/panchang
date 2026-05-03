import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

/**
 * Celestial themed background with twinkling stars.
 * Uses Remotion interpolate for star opacity animation (no CSS keyframes in Remotion).
 */

interface Star {
  x: number;
  y: number;
  size: number;
  phaseOffset: number;
}

// Deterministic star field — seeded by index so it's consistent across frames
const STARS: Star[] = Array.from({ length: 80 }, (_, i) => ({
  x: ((i * 137.508) % 100), // golden angle spread
  y: ((i * 73.137) % 100),
  size: 1 + (i % 3),
  phaseOffset: i * 0.7,
}));

export const Background: React.FC<{ theme: string }> = ({ theme }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* Base gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            theme === 'celestial'
              ? 'linear-gradient(170deg, #0a0e27 0%, #1a1040 40%, #0a0e27 100%)'
              : '#0a0e27',
        }}
      />

      {/* Star field */}
      {STARS.map((star, i) => {
        const opacity = interpolate(
          Math.sin((frame + star.phaseOffset * 30) * 0.05),
          [-1, 1],
          [0.15, 0.9]
        );
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: '#f0d48a',
              opacity,
            }}
          />
        );
      })}

      {/* Subtle radial glow at center */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(45,27,105,0.3) 0%, transparent 70%)',
        }}
      />
    </AbsoluteFill>
  );
};
