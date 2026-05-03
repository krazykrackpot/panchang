import React from 'react';
import { AbsoluteFill, useVideoConfig, Sequence } from 'remotion';
import type { ShortVideoProps } from '../types';
import { SceneRenderer } from '../components/SceneRenderer';

/**
 * Main Short video composition.
 * Renders scenes sequentially using Remotion Sequences.
 * Each scene duration is specified in seconds and converted to frames.
 */

export const ShortVideo: React.FC<ShortVideoProps> = ({ script, theme }) => {
  const { fps } = useVideoConfig();

  // Pre-calculate frame offsets for each scene
  const sceneFrames: Array<{ startFrame: number; durationFrames: number }> = [];
  let runningFrame = 0;
  for (const scene of script.scenes) {
    const durationFrames = Math.round(scene.duration * fps);
    sceneFrames.push({ startFrame: runningFrame, durationFrames });
    runningFrame += durationFrames;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0e27' }}>
      {script.scenes.map((scene, i) => {
        const { startFrame, durationFrames } = sceneFrames[i];
        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={durationFrames}
          >
            <SceneRenderer scene={scene} theme={theme} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
