/**
 * Render a Short video from a script JSON file.
 *
 * Usage:
 *   npx tsx scripts/render-video.ts vedic-vs-western
 *   npx tsx scripts/render-video.ts rahu-kaal-explained
 *   npx tsx scripts/render-video.ts pushya-nakshatra-gold
 *
 * Output: /tmp/videos/<script-name>.mp4
 *
 * Prerequisites:
 *   - ffmpeg must be installed (brew install ffmpeg)
 *   - Remotion packages installed (remotion, @remotion/cli, @remotion/renderer)
 */

import { readFileSync, mkdirSync } from 'fs';
import path from 'path';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

async function main() {
  const scriptName = process.argv[2];
  if (!scriptName) {
    console.error('Usage: npx tsx scripts/render-video.ts <script-name>');
    console.error('Available scripts: vedic-vs-western, rahu-kaal-explained, pushya-nakshatra-gold');
    process.exit(1);
  }

  const scriptPath = path.resolve(`src/video/scripts/${scriptName}.json`);
  let script;
  try {
    script = JSON.parse(readFileSync(scriptPath, 'utf-8'));
  } catch (err) {
    console.error(`[render-video] Failed to read script: ${scriptPath}`, err);
    process.exit(1);
  }

  console.log(`[render-video] Bundling Remotion project...`);
  const entryPoint = path.resolve('./src/video/index.ts');
  const bundled = await bundle({
    entryPoint,
    // Remotion bundler uses webpack internally — no conflict with Next.js
  });
  console.log(`[render-video] Bundle complete: ${bundled}`);

  const inputProps = { script, theme: 'celestial' };

  console.log(`[render-video] Selecting composition "Short"...`);
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'Short',
    inputProps,
  });
  console.log(
    `[render-video] Composition: ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames`
  );

  const outputDir = '/tmp/videos';
  mkdirSync(outputDir, { recursive: true });
  const outputLocation = path.join(outputDir, `${scriptName}.mp4`);

  console.log(`[render-video] Rendering to ${outputLocation}...`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation,
    inputProps,
    onProgress: ({ progress }) => {
      // Log every 10%
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0) {
        process.stdout.write(`\r[render-video] Progress: ${pct}%`);
      }
    },
  });

  console.log(`\n[render-video] Video rendered: ${outputLocation}`);
}

main().catch((err) => {
  console.error('[render-video] Fatal error:', err);
  process.exit(1);
});
