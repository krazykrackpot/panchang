/**
 * Compose final video from AI-generated clips + voiceover + background music.
 *
 * Takes individual AI video clips and voiceover audio, composites them into
 * a single video with text overlays, transitions, and background music.
 *
 * Usage:
 *   npx tsx scripts/compose-video.ts vedic-vs-western
 *   npx tsx scripts/compose-video.ts vedic-vs-western --no-text  (skip text overlays)
 *
 * Input:
 *   /tmp/videos/clips/<script>/scene-{id}.mp4     — AI-generated clips
 *   /tmp/videos/voiceover/<script>/scene-{id}.mp3  — voiceover audio (optional)
 *   public/audio/<musicTrack>.mp3                  — background music (optional)
 *
 * Output:
 *   /tmp/videos/<script-name>-final.mp4
 *
 * Prerequisites:
 *   - ffmpeg installed (brew install ffmpeg)
 *   - AI clips generated via generate-ai-clips.ts
 *   - Voiceover generated via generate-voiceover.ts (optional)
 */

import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

interface Scene {
  id: number;
  duration: number;
  narration: string;
  visualType: string;
  textOverlay?: string;
  transition: string;
  videoPrompt?: string;
}

interface VideoScript {
  meta: {
    topic: string;
    type: string;
    language: string;
    estimatedDuration: number;
    style: string;
    musicMood?: string;
    musicTrack?: string;
  };
  scenes: Scene[];
}

function fileExists(p: string): boolean {
  return existsSync(p);
}

/**
 * Build FFmpeg filter_complex for compositing.
 *
 * For each scene:
 * 1. Scale to 1080x1920 (9:16 portrait)
 * 2. Trim to exact scene duration
 * 3. Add text overlay (if enabled)
 * 4. Add crossfade transitions between scenes
 * 5. Mix voiceover per scene + background music
 */
function buildFilterGraph(
  script: VideoScript,
  clipPaths: string[],
  voiceoverPaths: string[],
  musicPath: string | null,
  includeText: boolean
): { filterComplex: string; inputArgs: string[]; outputMap: string } {
  const scenes = script.scenes;
  const inputArgs: string[] = [];
  const filterParts: string[] = [];

  // Add video inputs
  for (let i = 0; i < scenes.length; i++) {
    inputArgs.push('-i', clipPaths[i]);
  }

  // Add voiceover inputs
  const voStartIdx = scenes.length;
  const voiceoverIndices: number[] = [];
  for (let i = 0; i < scenes.length; i++) {
    if (voiceoverPaths[i] && fileExists(voiceoverPaths[i])) {
      inputArgs.push('-i', voiceoverPaths[i]);
      voiceoverIndices.push(voStartIdx + voiceoverIndices.length);
    } else {
      voiceoverIndices.push(-1);
    }
  }

  // Add background music input
  let musicIdx = -1;
  if (musicPath && fileExists(musicPath)) {
    musicIdx = voStartIdx + voiceoverIndices.filter((v) => v >= 0).length;
    inputArgs.push('-i', musicPath);
  }

  // Process each video clip: crop to 9:16 portrait, trim, fade
  // Landscape clips get centre-cropped; portrait clips get scaled
  // Short clips get looped to fill the scene duration
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const dur = scene.duration;

    // Step 1: Loop short clips, scale + centre-crop to 1080x1920 portrait
    let videoFilter = `[${i}:v]loop=loop=-1:size=32767:start=0,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,trim=duration=${dur},setpts=PTS-STARTPTS`;

    // Step 2: Text overlays — use textTiming for precise sync, fallback to textOverlay
    const timings = (scene as unknown as Record<string, unknown>).textTiming as Array<{ text: string; start: number; end: number; position?: string }> | undefined;

    if (includeText && timings && timings.length > 0) {
      // Timed text lines — each appears and disappears at specific times
      for (const t of timings) {
        const cleanText = t.text
          .replace(/\*/g, '')
          .replace(/'/g, "\u2019")
          .replace(/:/g, '\\:');
        const yPos = t.position === 'center' ? '(h-text_h)/2' : 'h*0.85';
        const fontSize = t.position === 'center' ? 56 : 44;
        videoFilter += `,drawtext=text='${cleanText}':fontfile=/System/Library/Fonts/Helvetica.ttc:fontsize=${fontSize}:fontcolor=white:borderw=4:bordercolor=black@0.8:x=(w-text_w)/2:y=${yPos}:enable='between(t,${t.start},${t.end})'`;
      }
    } else if (includeText && scene.textOverlay) {
      // Fallback: single text for whole scene
      const cleanText = scene.textOverlay
        .replace(/\*/g, '')
        .replace(/'/g, "\u2019")
        .replace(/:/g, '\\:');
      const lines = cleanText.split('\n');
      for (let li = 0; li < lines.length; li++) {
        const yPos = `h*0.82+${li * 70}`;
        videoFilter += `,drawtext=text='${lines[li]}':fontfile=/System/Library/Fonts/Helvetica.ttc:fontsize=48:fontcolor=white:borderw=4:bordercolor=black@0.8:x=(w-text_w)/2:y=${yPos}:enable='between(t,0.3,${dur - 0.3})'`;
      }
    }

    // Step 3: Fade in/out
    videoFilter += `,fade=t=in:st=0:d=0.5,fade=t=out:st=${Math.max(0, dur - 0.5)}:d=0.5`;

    filterParts.push(`${videoFilter}[v${i}]`);
  }

  // Concatenate all video segments
  const videoConcat = scenes.map((_, i) => `[v${i}]`).join('');
  filterParts.push(`${videoConcat}concat=n=${scenes.length}:v=1:a=0[vout]`);

  // Audio mixing — concat approach (no overlap, no echo)
  // Pad each voiceover to its scene duration, then concatenate sequentially
  const audioFilters: string[] = [];
  let runningTime = 0;

  const hasAnyVoiceover = voiceoverIndices.some((v) => v >= 0);
  if (hasAnyVoiceover) {
    // For each scene: trim/pad voiceover to exact scene duration
    const voSegLabels: string[] = [];
    for (let i = 0; i < scenes.length; i++) {
      const voIdx = voiceoverIndices[i];
      const dur = scenes[i].duration;
      if (voIdx >= 0) {
        // Pad voiceover with silence to fill exactly the scene duration
        audioFilters.push(`[${voIdx}:a]apad=whole_dur=${dur}[vo${i}]`);
      } else {
        // No voiceover for this scene — generate silence
        audioFilters.push(`anullsrc=r=44100:cl=mono,atrim=duration=${dur}[vo${i}]`);
      }
      voSegLabels.push(`[vo${i}]`);
      runningTime += dur;
    }

    // Concatenate all voiceover segments sequentially (no overlap!)
    audioFilters.push(`${voSegLabels.join('')}concat=n=${scenes.length}:v=0:a=1[vomix]`);
  } else {
    runningTime = scenes.reduce((s, sc) => s + sc.duration, 0);
  }

  // Mix with background music
  let audioOut = '';
  if (musicIdx >= 0) {
    const totalDuration = runningTime;
    audioFilters.push(`[${musicIdx}:a]volume=0.15,aloop=loop=-1:size=2e+09,atrim=duration=${totalDuration}[bgm]`);

    if (hasAnyVoiceover) {
      audioFilters.push(`[vomix][bgm]amix=inputs=2:duration=first:normalize=0[aout]`);
    } else {
      audioFilters.push(`[bgm]acopy[aout]`);
    }
    audioOut = '[aout]';
  } else if (hasAnyVoiceover) {
    audioFilters.push(`[vomix]acopy[aout]`);
    audioOut = '[aout]';
  }

  // Combine all filter parts
  const allFilters = [...filterParts, ...audioFilters];
  const filterComplex = allFilters.join(';\n');

  // Output mapping — quote bracket labels to prevent shell glob expansion
  let outputMap = "-map '[vout]'";
  if (audioOut) {
    outputMap += ` -map '${audioOut}'`;
  }

  return { filterComplex, inputArgs, outputMap };
}

async function main() {
  const args = process.argv.slice(2);
  const scriptName = args.find((a) => !a.startsWith('--'));
  const noText = args.includes('--no-text');

  if (!scriptName) {
    console.error('Usage: npx tsx scripts/compose-video.ts <script-name> [--no-text]');
    process.exit(1);
  }

  const scriptPath = path.resolve(`src/video/scripts/${scriptName}.json`);
  let script: VideoScript;
  try {
    script = JSON.parse(readFileSync(scriptPath, 'utf-8'));
  } catch (err) {
    console.error(`[compose] Failed to read script: ${scriptPath}`, err);
    process.exit(1);
  }

  const clipsDir = `/tmp/videos/clips/${scriptName}`;
  const voiceoverDir = `/tmp/videos/voiceover/${scriptName}`;

  // Check all clips exist
  const clipPaths: string[] = [];
  const voiceoverPaths: string[] = [];
  let missingClips = 0;

  for (const scene of script.scenes) {
    const clipPath = path.join(clipsDir, `scene-${scene.id}.mp4`);
    clipPaths.push(clipPath);
    if (!fileExists(clipPath)) {
      console.error(`[compose] Missing clip: ${clipPath}`);
      missingClips++;
    }

    const voPath = path.join(voiceoverDir, `scene-${scene.id}.mp3`);
    voiceoverPaths.push(voPath);
  }

  if (missingClips > 0) {
    console.error(`[compose] ${missingClips} clips missing. Run: npx tsx scripts/generate-ai-clips.ts ${scriptName}`);
    process.exit(1);
  }

  // Check for background music
  let musicPath: string | null = null;
  if (script.meta.musicTrack) {
    const mp = path.resolve(`public/audio/${script.meta.musicTrack}.mp3`);
    if (fileExists(mp)) {
      musicPath = mp;
      console.log(`[compose] Background music: ${musicPath}`);
    }
  }

  // Check for voiceover
  const hasVoiceover = voiceoverPaths.some((p) => fileExists(p));
  if (hasVoiceover) {
    const voCount = voiceoverPaths.filter((p) => fileExists(p)).length;
    console.log(`[compose] Voiceover: ${voCount}/${script.scenes.length} scenes`);
  } else {
    console.log(`[compose] No voiceover found. Run: npx tsx scripts/generate-voiceover.ts ${scriptName}`);
  }

  console.log(`[compose] Text overlays: ${noText ? 'disabled' : 'enabled'}`);
  console.log(`[compose] Scenes: ${script.scenes.length}`);
  const totalDuration = script.scenes.reduce((s, sc) => s + sc.duration, 0);
  console.log(`[compose] Total duration: ${totalDuration}s`);
  console.log('');

  // Build filter graph
  const { filterComplex, inputArgs, outputMap } = buildFilterGraph(
    script,
    clipPaths,
    voiceoverPaths,
    musicPath,
    !noText
  );

  // Write filter to temp file (complex filters can exceed command line limits)
  const filterFile = `/tmp/videos/filter-${scriptName}.txt`;
  writeFileSync(filterFile, filterComplex);

  const outputPath = `/tmp/videos/${scriptName}-final.mp4`;

  // Build ffmpeg command
  const cmd = [
    'ffmpeg -y',
    ...inputArgs.map((a) => `"${a}"`).reduce((acc: string[], a, i, arr) => {
      if (i % 2 === 0) acc.push(`${a} ${arr[i + 1]}`);
      return acc;
    }, []),
    `-filter_complex_script "${filterFile}"`,
    outputMap,
    '-c:v libx264 -preset medium -crf 20',
    '-c:a aac -b:a 192k',
    '-movflags +faststart',
    `-t ${totalDuration}`,
    `"${outputPath}"`,
  ].join(' \\\n  ');

  console.log('[compose] Running ffmpeg...');
  console.log(`[compose] Output: ${outputPath}`);
  console.log('');

  try {
    execSync(cmd, { stdio: 'inherit', shell: '/bin/zsh' });
    console.log(`\n[compose] Done! Final video: ${outputPath}`);
    console.log(`[compose] To play: open "${outputPath}"`);
  } catch (err) {
    console.error('\n[compose] FFmpeg failed. Debug the filter:');
    console.error(`[compose] Filter file: ${filterFile}`);
    console.error(`[compose] Command:\n${cmd}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[compose] Fatal error:', err);
  process.exit(1);
});
