import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import type { Scene } from '../types';
import { Background } from './Background';
import { TitleCard } from './TitleCard';
import { TextReveal } from './TextReveal';
import { ZodiacWheel } from './ZodiacWheel';
import { CTACard } from './CTACard';
import { DataCard } from './DataCard';

/**
 * Routes to the correct visual component based on scene.visualType.
 * Wraps each scene with background + transition effects.
 */

interface SceneRendererProps {
  scene: Scene;
  theme: string;
}

function renderVisual(scene: Scene): React.ReactNode {
  const text = scene.textOverlay ?? scene.narration;

  switch (scene.visualType) {
    case 'title_card':
      return <TitleCard text={text} />;

    case 'text_reveal':
      return <TextReveal text={text} />;

    case 'zodiac_wheel':
      return <ZodiacWheel textOverlay={text} />;

    case 'cta':
      return <CTACard text={text} />;

    // comparison, timeline, data_table, nakshatra_card, planet_showcase
    // all use the generic DataCard with type-aware header
    case 'comparison':
    case 'timeline':
    case 'data_table':
    case 'nakshatra_card':
    case 'planet_showcase':
      return <DataCard text={text} visualType={scene.visualType} />;

    default:
      // Fallback: simple centered text
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
              fontSize: 48,
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              color: '#e6e2d8',
              textAlign: 'center',
            }}
          >
            {text}
          </div>
        </AbsoluteFill>
      );
  }
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationFrames = scene.duration * fps;

  // Transition: fade in at start, fade out at end
  let opacity = 1;
  if (scene.transition === 'fade' || scene.transition === 'slide') {
    const fadeIn = interpolate(frame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const fadeOut = interpolate(
      frame,
      [durationFrames - 10, durationFrames],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    opacity = Math.min(fadeIn, fadeOut);
  }

  // Slide transition: translate X
  let translateX = 0;
  if (scene.transition === 'slide') {
    translateX = interpolate(frame, [0, 12], [100, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // Zoom transition: scale from 1.2 to 1.0
  let scale = 1;
  if (scene.transition === 'zoom') {
    scale = interpolate(frame, [0, 15], [1.2, 1.0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  return (
    <AbsoluteFill>
      <Background theme={theme} />
      <AbsoluteFill
        style={{
          opacity,
          transform: `translateX(${translateX}px) scale(${scale})`,
        }}
      >
        {renderVisual(scene)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
