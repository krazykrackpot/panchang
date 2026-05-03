import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * Kinetic typography — text appears word by word or line by line.
 * Gold color for emphasis words (wrapped in *asterisks* in the input).
 */

interface TextRevealProps {
  text: string;
}

interface WordToken {
  word: string;
  isEmphasis: boolean;
}

function parseWords(text: string): WordToken[] {
  return text.split(/\s+/).map((w) => {
    if (w.startsWith('*') && w.endsWith('*')) {
      return { word: w.slice(1, -1), isEmphasis: true };
    }
    return { word: w, isEmphasis: false };
  });
}

export const TextReveal: React.FC<TextRevealProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split by newlines first, then words per line
  const lines = text.split('\n');
  const FRAMES_PER_WORD = 4;

  let globalWordIndex = 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          alignItems: 'center',
        }}
      >
        {lines.map((line, lineIdx) => {
          const words = parseWords(line);
          const lineWords = words.map((token) => {
            const idx = globalWordIndex++;
            const wordOpacity = interpolate(
              frame,
              [idx * FRAMES_PER_WORD, idx * FRAMES_PER_WORD + 8],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const wordY = interpolate(
              frame,
              [idx * FRAMES_PER_WORD, idx * FRAMES_PER_WORD + 8],
              [20, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                  marginRight: 12,
                  fontSize: 52,
                  fontWeight: token.isEmphasis ? 800 : 500,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  color: token.isEmphasis ? '#f0d48a' : '#e6e2d8',
                }}
              >
                {token.word}
              </span>
            );
          });

          return (
            <div
              key={lineIdx}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {lineWords}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
