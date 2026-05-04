import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import type { Scene } from '../types';
import { CosmicBackground } from './CosmicBackground';
import type { CosmicPreset } from './CosmicBackground';
import { TitleCard } from './TitleCard';
import { TextReveal } from './TextReveal';
import { ZodiacWheel } from './ZodiacWheel';
import { CTACard } from './CTACard';
import { DataCard } from './DataCard';
import { PlanetRender } from './PlanetRender';
import { CosmicText } from './CosmicText';

/**
 * Routes to the correct visual component based on scene.visualType.
 * Uses CosmicBackground with per-scene preset for dramatic cosmic imagery.
 *
 * Visual types:
 * - title_card: Animated title with letter reveal
 * - cosmic_text: Dramatic text with light burst/ascend/glow effects
 * - text_reveal: Kinetic word-by-word text (simpler)
 * - zodiac_wheel: Animated zodiac ring
 * - planet_render: CSS-rendered planet with atmosphere
 * - cta: Call-to-action end card
 * - comparison/timeline/data_table/nakshatra_card/planet_showcase: DataCard variants
 */

interface SceneRendererProps {
  scene: Scene;
  theme: string;
}

/** Default cosmic preset based on visual type */
function getDefaultPreset(visualType: string): CosmicPreset {
  switch (visualType) {
    case 'title_card': return 'nebula';
    case 'cosmic_text': return 'deep_space';
    case 'zodiac_wheel': return 'constellation';
    case 'planet_render': return 'deep_space';
    case 'planet_showcase': return 'deep_space';
    case 'nakshatra_card': return 'constellation';
    case 'cta': return 'galaxy';
    case 'comparison': return 'nebula';
    case 'timeline': return 'aurora';
    case 'data_table': return 'deep_space';
    default: return 'celestial';
  }
}

function renderVisual(scene: Scene): React.ReactNode {
  const text = scene.textOverlay ?? scene.narration;

  switch (scene.visualType) {
    case 'title_card':
      return <TitleCard text={text} />;

    case 'cosmic_text':
      return <CosmicText text={text} style={scene.textStyle} />;

    case 'text_reveal':
      return <TextReveal text={text} />;

    case 'zodiac_wheel':
      return <ZodiacWheel textOverlay={text} />;

    case 'planet_render':
      return <PlanetRender planet={scene.planet} textOverlay={text} subtitle={scene.subtitle} />;

    case 'cta':
      return <CTACard text={text} />;

    case 'comparison':
    case 'timeline':
    case 'data_table':
    case 'nakshatra_card':
    case 'planet_showcase':
      return <DataCard text={text} visualType={scene.visualType} />;

    default:
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

  // Use scene-specific cosmic preset, or derive from visual type
  const cosmicPreset = scene.cosmicPreset ?? getDefaultPreset(scene.visualType);

  return (
    <AbsoluteFill>
      <CosmicBackground preset={cosmicPreset} />
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
