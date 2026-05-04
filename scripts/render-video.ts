/**
 * Render a Short video from a script JSON file.
 *
 * Usage:
 *   npx tsx scripts/render-video.ts vedic-vs-western
 *   npx tsx scripts/render-video.ts vedic-vs-western --with-audio
 *
 * Output: /tmp/videos/<script-name>.mp4
 *
 * Flags:
 *   --with-audio   Copy voiceover files from /tmp/videos/voiceover/<script-name>/
 *                   to public/video/audio/<script-name>/ before rendering.
 *                   Run generate-voiceover.ts first to create the audio files.
 *
 * Prerequisites:
 *   - ffmpeg must be installed (brew install ffmpeg)
 *   - Remotion packages installed (remotion, @remotion/cli, @remotion/renderer)
 */

import { readFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import path from 'path';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

async function main() {
  const args = process.argv.slice(2);
  const scriptName = args.find((a) => !a.startsWith('--'));
  const withAudio = args.includes('--with-audio');

  if (!scriptName) {
    console.error('Usage: npx tsx scripts/render-video.ts <script-name> [--with-audio]');
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

  // Copy voiceover audio to public/ if --with-audio
  if (withAudio) {
    const voiceoverDir = `/tmp/videos/voiceover/${scriptName}`;
    const publicAudioDir = path.resolve(`public/video/audio/${scriptName}`);
    mkdirSync(publicAudioDir, { recursive: true });

    let copiedCount = 0;
    for (const scene of script.scenes) {
      const srcFile = path.join(voiceoverDir, `scene-${scene.id}.mp3`);
      const destFile = path.join(publicAudioDir, `scene-${scene.id}.mp3`);
      if (existsSync(srcFile)) {
        copyFileSync(srcFile, destFile);
        copiedCount++;
      }
    }
    console.log(`[render-video] Copied ${copiedCount} voiceover files to ${publicAudioDir}`);

    // Also copy music track if specified
    if (script.meta.musicTrack) {
      const musicSrc = path.resolve(`public/audio/${script.meta.musicTrack}.mp3`);
      const musicDest = path.resolve(`public/video/audio/music/${script.meta.musicTrack}.mp3`);
      if (existsSync(musicSrc)) {
        mkdirSync(path.dirname(musicDest), { recursive: true });
        copyFileSync(musicSrc, musicDest);
        console.log(`[render-video] Copied music track: ${script.meta.musicTrack}`);
      } else {
        console.log(`[render-video] Music track not found: ${musicSrc}`);
      }
    }
  }

  console.log(`[render-video] Bundling Remotion project...`);
  const entryPoint = path.resolve('./src/video/index.ts');
  const bundled = await bundle({
    entryPoint,
  });
  console.log(`[render-video] Bundle complete: ${bundled}`);

  const inputProps = { script, theme: 'celestial', includeAudio: withAudio };

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
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0) {
        process.stdout.write(`\r[render-video] Progress: ${pct}%`);
      }
    },
  });

  console.log(`\n[render-video] Video rendered: ${outputLocation}`);
  console.log(`[render-video] To play: open ${outputLocation}`);
}

main().catch((err) => {
  console.error('[render-video] Fatal error:', err);
  process.exit(1);
});
