import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

/**
 * Generic data display card — for comparison views, data tables, timelines.
 * Renders text overlay with animated line-by-line reveal.
 */

interface DataCardProps {
  text: string;
  visualType: string;
}

export const DataCard: React.FC<DataCardProps> = ({ text, visualType }) => {
  const frame = useCurrentFrame();

  const lines = text.split('\n');

  // Header label based on visual type
  const headerLabel =
    visualType === 'comparison'
      ? 'COMPARISON'
      : visualType === 'timeline'
        ? 'TIMELINE'
        : visualType === 'data_table'
          ? 'REFERENCE'
          : visualType === 'nakshatra_card'
            ? 'NAKSHATRA'
            : visualType === 'planet_showcase'
              ? 'GRAHA'
              : 'INFO';

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          width: '85%',
          padding: '60px 64px',
          borderRadius: 24,
          background:
            'linear-gradient(135deg, rgba(45,27,105,0.5) 0%, rgba(26,16,64,0.7) 50%, rgba(10,14,39,0.9) 100%)',
          border: '1px solid rgba(212,168,83,0.2)',
        }}
      >
        {/* Type label */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#8a6d2b',
            letterSpacing: '0.25em',
            marginBottom: 32,
            opacity: interpolate(frame, [0, 15], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {headerLabel}
        </div>

        {/* Lines revealed one by one */}
        {lines.map((line, i) => {
          const lineOpacity = interpolate(
            frame,
            [10 + i * 8, 18 + i * 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const lineX = interpolate(
            frame,
            [10 + i * 8, 18 + i * 8],
            [-30, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                fontSize: 44,
                fontWeight: 600,
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#e6e2d8',
                marginBottom: 16,
                opacity: lineOpacity,
                transform: `translateX(${lineX}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
