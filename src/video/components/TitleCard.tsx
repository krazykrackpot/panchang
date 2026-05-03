import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

/**
 * Animated title screen with gold gradient text appearing letter by letter.
 * Includes "DEKHO PANCHANG" watermark at bottom.
 */

interface TitleCardProps {
  text: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = text.split('');

  // Overall container scale-in
  const containerScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Watermark fade
  const watermarkOpacity = interpolate(frame, [20, 40], [0, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Main title — letter by letter reveal */}
      <div
        style={{
          transform: `scale(${containerScale})`,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {letters.map((letter, i) => {
          const letterOpacity = interpolate(
            frame,
            [i * 2, i * 2 + 6],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const letterY = interpolate(
            frame,
            [i * 2, i * 2 + 6],
            [30, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <span
              key={i}
              style={{
                fontSize: 72,
                fontWeight: 900,
                fontFamily: 'Inter, system-ui, sans-serif',
                background: 'linear-gradient(180deg, #f0d48a 0%, #d4a853 50%, #8a6d2b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: letterOpacity,
                transform: `translateY(${letterY}px)`,
                textTransform: 'uppercase',
                letterSpacing: letter === ' ' ? '0.3em' : '0.05em',
                display: letter === ' ' ? 'inline-block' : 'inline',
                width: letter === ' ' ? '0.3em' : 'auto',
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          opacity: watermarkOpacity,
          fontSize: 28,
          fontWeight: 600,
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#d4a853',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
      >
        DEKHO PANCHANG
      </div>
    </AbsoluteFill>
  );
};
