import React from 'react';
import { Composition } from 'remotion';
import { ShortVideo } from './compositions/ShortVideo';
import type { ShortVideoProps, VideoScript } from './types';

/**
 * Remotion entry point — registers all video compositions.
 *
 * The "Short" composition renders vertical 9:16 videos (1080x1920)
 * at 30fps. Duration is dynamically calculated from the script's
 * scene durations, defaulting to 60s if no script is provided.
 */

const EMPTY_SCRIPT: VideoScript = {
  meta: {
    topic: 'placeholder',
    type: 'short',
    language: 'en',
    estimatedDuration: 60,
    style: 'dramatic',
  },
  scenes: [],
};

// Cast component to satisfy Remotion's LooseComponentType<Record<string, unknown>>
// Remotion's Composition generic expects Record<string, unknown> when no Zod schema is provided.
// Our ShortVideoProps is a subtype, but TS can't infer that without the cast.
const ShortVideoComponent = ShortVideo as unknown as React.FC<Record<string, unknown>>;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Short"
        component={ShortVideoComponent}
        durationInFrames={30 * 60}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          script: EMPTY_SCRIPT as unknown as Record<string, unknown>,
          theme: 'celestial',
        }}
        calculateMetadata={async ({ props }) => {
          const typedProps = props as unknown as ShortVideoProps;
          const totalSeconds = typedProps.script.scenes.reduce(
            (sum: number, s: { duration: number }) => sum + s.duration,
            0
          );
          return {
            durationInFrames: Math.max(30, Math.round(totalSeconds * 30)),
          };
        }}
      />
    </>
  );
};
