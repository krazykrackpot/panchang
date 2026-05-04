import React from 'react';
import { AbsoluteFill, useVideoConfig, Sequence, Audio, staticFile } from 'remotion';
import type { ShortVideoProps } from '../types';
import { SceneRenderer } from '../components/SceneRenderer';

/**
 * Main Short video composition.
 * Renders scenes sequentially using Remotion Sequences.
 * Supports voiceover audio per scene and background music track.
 *
 * Audio files referenced via staticFile() from public/video/audio/:
 * - Voiceover: public/video/audio/{topic}/scene-{id}.mp3
 * - Music: public/video/audio/music/{musicTrack}.mp3
 *
 * Audio is only included when `includeAudio` is true in props
 * (set by render-video.ts --with-audio flag).
 */

export const ShortVideo: React.FC<ShortVideoProps> = ({ script, theme, includeAudio }) => {
  const { fps } = useVideoConfig();

  // Pre-calculate frame offsets for each scene
  const sceneFrames: Array<{ startFrame: number; durationFrames: number }> = [];
  let runningFrame = 0;
  for (const scene of script.scenes) {
    const durationFrames = Math.round(scene.duration * fps);
    sceneFrames.push({ startFrame: runningFrame, durationFrames });
    runningFrame += durationFrames;
  }

  const totalFrames = runningFrame;
  const musicTrack = script.meta.musicTrack;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0e27' }}>
      {/* Visual scenes */}
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

      {/* Voiceover audio per scene — only when --with-audio */}
      {includeAudio && script.scenes.map((scene, i) => {
        const { startFrame, durationFrames } = sceneFrames[i];
        return (
          <Sequence
            key={`vo-${scene.id}`}
            from={startFrame}
            durationInFrames={durationFrames}
          >
            <Audio
              src={staticFile(`video/audio/${script.meta.topic}/scene-${scene.id}.mp3`)}
              volume={1.0}
            />
          </Sequence>
        );
      })}

      {/* Background music — full duration, lower volume */}
      {includeAudio && musicTrack && (
        <Sequence from={0} durationInFrames={totalFrames}>
          <Audio
            src={staticFile(`video/audio/music/${musicTrack}.mp3`)}
            volume={0.15}
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
