import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

/**
 * Call-to-action end card with animated URL and branding.
 */

interface CTACardProps {
  text: string;
}

export const CTACard: React.FC<CTACardProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.8]
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Glowing card container */}
      <div
        style={{
          transform: `scale(${scale})`,
          padding: '60px 80px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(45,27,105,0.6) 0%, rgba(26,16,64,0.8) 100%)',
          border: '2px solid rgba(212,168,83,0.4)',
          boxShadow: `0 0 ${40 * glowIntensity}px rgba(212,168,83,${glowIntensity * 0.3})`,
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Logo text */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            fontFamily: 'Inter, system-ui, sans-serif',
            background: 'linear-gradient(180deg, #f0d48a 0%, #d4a853 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          DEKHO PANCHANG
        </div>

        {/* URL / CTA text */}
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#e6e2d8',
          }}
        >
          {text}
        </div>

        {/* "Check it free" badge */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#8a8478',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          FREE - NO SIGN UP REQUIRED
        </div>
      </div>
    </AbsoluteFill>
  );
};
