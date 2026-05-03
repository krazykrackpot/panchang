import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

/**
 * Animated zodiac ring that slowly rotates.
 * Can highlight specific signs with a glow effect.
 * Planet dots appear one by one.
 */

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

interface ZodiacWheelProps {
  highlightSign?: string;
  textOverlay?: string;
}

export const ZodiacWheel: React.FC<ZodiacWheelProps> = ({
  highlightSign,
  textOverlay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow rotation — 1 full turn in 30 seconds
  const rotation = interpolate(frame, [0, fps * 30], [0, 360], {
    extrapolateRight: 'extend',
  });

  // Scale-in on mount
  const scale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const RADIUS = 340;
  const CENTER = 540; // half of 1080 width

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Rotating wheel container */}
      <div
        style={{
          position: 'relative',
          width: RADIUS * 2 + 120,
          height: RADIUS * 2 + 120,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
        }}
      >
        {/* Outer ring */}
        <svg
          width={RADIUS * 2 + 120}
          height={RADIUS * 2 + 120}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            cx={RADIUS + 60}
            cy={RADIUS + 60}
            r={RADIUS}
            fill="none"
            stroke="#d4a853"
            strokeWidth={2}
            opacity={0.6}
          />
          <circle
            cx={RADIUS + 60}
            cy={RADIUS + 60}
            r={RADIUS - 60}
            fill="none"
            stroke="#8a6d2b"
            strokeWidth={1}
            opacity={0.4}
          />
        </svg>

        {/* Sign symbols around the wheel */}
        {SIGNS.map((sign, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = (RADIUS + 60) + RADIUS * Math.cos(angle);
          const y = (RADIUS + 60) + RADIUS * Math.sin(angle);

          const isHighlighted = highlightSign?.toLowerCase() === sign.toLowerCase();

          // Each sign fades in sequentially
          const signOpacity = interpolate(
            frame,
            [i * 3 + 10, i * 3 + 20],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={sign}
              style={{
                position: 'absolute',
                left: x - 24,
                top: y - 24,
                width: 48,
                height: 48,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: signOpacity,
                // Counter-rotate so text stays upright
                transform: `rotate(${-rotation}deg)`,
                fontSize: isHighlighted ? 36 : 28,
                color: isHighlighted ? '#f0d48a' : '#d4a853',
                textShadow: isHighlighted
                  ? '0 0 20px rgba(240,212,138,0.8), 0 0 40px rgba(212,168,83,0.4)'
                  : 'none',
                fontFamily: 'serif',
              }}
            >
              {SIGN_SYMBOLS[i]}
            </div>
          );
        })}
      </div>

      {/* Text overlay at bottom */}
      {textOverlay && (
        <div
          style={{
            position: 'absolute',
            bottom: 300,
            fontSize: 48,
            fontWeight: 700,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#f0d48a',
            textAlign: 'center',
            padding: '0 80px',
            opacity: interpolate(frame, [30, 50], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {textOverlay}
        </div>
      )}
    </AbsoluteFill>
  );
};
