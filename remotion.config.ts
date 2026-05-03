/**
 * Remotion configuration file.
 * Used by @remotion/cli for the Remotion Studio and rendering.
 *
 * Note: This is separate from Next.js config — Remotion has its own
 * webpack bundler that does not interfere with Next.js builds.
 */
import { Config } from '@remotion/cli/config';

// Set the entry point for Remotion compositions
Config.setEntryPoint('./src/video/index.ts');

// Output codec defaults
Config.setCodec('h264');

// Increase concurrency for faster renders on multi-core machines
Config.setConcurrency(4);
