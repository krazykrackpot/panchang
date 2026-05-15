#!/usr/bin/env npx tsx
/**
 * Produce the Mahayuga 4,320,000 YouTube Short — fully automated.
 *
 * Pipeline: Edge TTS (free) + Pexels (free) + Google ImageFX (manual stills) + FFmpeg
 * Total cost: $0.00
 *
 * Usage:
 *   npx tsx scripts/produce-mahayuga-short.ts
 *
 * Prerequisites:
 *   - ffmpeg installed (brew install ffmpeg)
 *   - python3 with edge-tts: pip install edge-tts
 *   - PEXELS_API_KEY in .env.local (free from pexels.com/api)
 *   - Google ImageFX stills placed in /tmp/videos/mahayuga-short/stills/ (script will prompt)
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const PEXELS_KEY = process.env.PEXELS_API_KEY?.trim();
const VOICE = 'hi-IN-MadhurNeural';
const OUTPUT_DIR = '/tmp/videos/mahayuga-short';
const CLIPS_DIR = path.join(OUTPUT_DIR, 'clips');
const VOICE_DIR = path.join(OUTPUT_DIR, 'voice');
const STILLS_DIR = path.join(OUTPUT_DIR, 'stills');
const SITAR_PATH = path.resolve('public/audio/sitar-darbari.mp3');

// Ensure dirs
for (const d of [OUTPUT_DIR, CLIPS_DIR, VOICE_DIR, STILLS_DIR]) {
  fs.mkdirSync(d, { recursive: true });
}

// Load script
const script = JSON.parse(
  fs.readFileSync('src/video/scripts/mahayuga-4320000-short-hi.json', 'utf-8'),
);
const scenes = script.scenes as Array<{
  id: number;
  duration: number;
  narration: string;
  source: string;
  searchQuery?: string;
  clips?: Array<{ source: string; search?: string; prompt?: string; duration: number; notes: string }>;
  textOverlay?: string;
  transition: string;
  audioDirection?: string;
}>;

// ─── Step 1: Generate voiceover for each scene ─────────────────────────

console.log('\n═══ STEP 1: Generating voiceovers (Edge TTS) ═══\n');

const sceneDurations: Record<number, number> = {};

for (const scene of scenes) {
  const voicePath = path.join(VOICE_DIR, `scene-${scene.id}.mp3`);

  if (fs.existsSync(voicePath)) {
    console.log(`  Scene ${scene.id}: voice exists, skipping`);
  } else {
    // Clean narration — remove direction cues like [2 BEATS SILENCE]
    const cleanNarration = scene.narration
      .replace(/\[.*?\]/g, '')
      .replace(/\.\.\./g, ', ')
      .trim();

    const tmpTxt = path.join(OUTPUT_DIR, `scene-${scene.id}-narration.txt`);
    fs.writeFileSync(tmpTxt, cleanNarration, 'utf-8');

    try {
      execSync(
        `python3 -m edge_tts --voice "${VOICE}" --rate="-5%" --file "${tmpTxt}" --write-media "${voicePath}"`,
        { stdio: 'pipe', timeout: 60_000 },
      );
      console.log(`  Scene ${scene.id}: ✓ voice generated`);
    } catch (err) {
      console.error(`  Scene ${scene.id}: ✗ TTS failed — ${err}`);
      console.error('  Ensure: pip install edge-tts');
      process.exit(1);
    } finally {
      if (fs.existsSync(tmpTxt)) fs.unlinkSync(tmpTxt);
    }
  }

  // Get duration
  try {
    const dur = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${voicePath}"`,
      { encoding: 'utf-8' },
    ).trim();
    sceneDurations[scene.id] = parseFloat(dur) + 1.5; // padding
    console.log(`  Scene ${scene.id}: ${parseFloat(dur).toFixed(1)}s + 1.5s padding = ${sceneDurations[scene.id].toFixed(1)}s`);
  } catch {
    sceneDurations[scene.id] = scene.duration;
    console.log(`  Scene ${scene.id}: using default ${scene.duration}s`);
  }
}

// Add 2 seconds silence for scene 5 (prime reveal)
if (sceneDurations[5]) {
  sceneDurations[5] += 2; // silence at start
  console.log(`  Scene 5: +2s silence = ${sceneDurations[5].toFixed(1)}s`);

  // Generate silence + voice file for scene 5
  const silentVoice = path.join(VOICE_DIR, 'scene-5-with-silence.mp3');
  if (!fs.existsSync(silentVoice)) {
    execSync(
      `ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t 2 -q:a 9 /tmp/silence-2s.mp3 2>/dev/null`,
    );
    execSync(
      `ffmpeg -y -i "concat:/tmp/silence-2s.mp3|${path.join(VOICE_DIR, 'scene-5.mp3')}" -acodec copy "${silentVoice}" 2>/dev/null || ` +
      `ffmpeg -y -i /tmp/silence-2s.mp3 -i "${path.join(VOICE_DIR, 'scene-5.mp3')}" -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" "${silentVoice}" 2>/dev/null`,
    );
    console.log('  Scene 5: ✓ silence prepended');
  }
}

// ─── Step 2: Download Pexels clips ─────────────────────────────────────

console.log('\n═══ STEP 2: Downloading Pexels clips ═══\n');

interface PexelsVideo {
  video_files: Array<{ quality: string; width: number; height: number; link: string }>;
}

async function downloadPexels(query: string, sceneId: number, clipIdx: number = 0): Promise<string> {
  const outPath = path.join(CLIPS_DIR, `scene-${sceneId}-clip-${clipIdx}.mp4`);
  if (fs.existsSync(outPath)) {
    console.log(`  Scene ${sceneId} clip ${clipIdx}: exists, skipping`);
    return outPath;
  }

  if (!PEXELS_KEY) {
    console.error('  PEXELS_API_KEY not found — get free key at pexels.com/api');
    process.exit(1);
  }

  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=3&size=large`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  const data = await res.json() as { videos: PexelsVideo[] };

  if (!data.videos?.length) {
    // Try landscape if no portrait
    const res2 = await fetch(url.replace('portrait', 'landscape'), { headers: { Authorization: PEXELS_KEY } });
    const data2 = await res2.json() as { videos: PexelsVideo[] };
    if (!data2.videos?.length) {
      console.error(`  Scene ${sceneId}: no Pexels results for "${query}"`);
      return '';
    }
    data.videos = data2.videos;
  }

  // Pick best quality file
  const video = data.videos[0];
  const file = video.video_files
    .filter(f => f.width >= 720)
    .sort((a, b) => b.width - a.width)[0] || video.video_files[0];

  console.log(`  Scene ${sceneId}: downloading ${file.width}x${file.height} from Pexels...`);

  const videoRes = await fetch(file.link);
  const buffer = Buffer.from(await videoRes.arrayBuffer());
  fs.writeFileSync(outPath, buffer);
  console.log(`  Scene ${sceneId} clip ${clipIdx}: ✓ ${(buffer.length / 1024 / 1024).toFixed(1)}MB`);

  return outPath;
}

// Download all Pexels clips
const pexelsDownloads: Array<{ sceneId: number; query: string; clipIdx: number }> = [];

for (const scene of scenes) {
  if (scene.source === 'pexels' && scene.searchQuery) {
    pexelsDownloads.push({ sceneId: scene.id, query: scene.searchQuery, clipIdx: 0 });
  }
  if (scene.clips) {
    scene.clips.forEach((clip, idx) => {
      if (clip.source === 'pexels' && clip.search) {
        pexelsDownloads.push({ sceneId: scene.id, query: clip.search, clipIdx: idx });
      }
    });
  }
  // Scene with pexels_multi
  if (scene.source === 'pexels_multi' && scene.clips) {
    scene.clips.forEach((clip, idx) => {
      if (clip.search) {
        pexelsDownloads.push({ sceneId: scene.id, query: clip.search, clipIdx: idx });
      }
    });
  }
}

async function downloadAllPexels() {
  for (const dl of pexelsDownloads) {
    await downloadPexels(dl.query, dl.sceneId, dl.clipIdx);
    // Rate limit — 200 req/hour for Pexels free tier
    await new Promise(r => setTimeout(r, 500));
  }
}

// ─── Wrap remaining steps in async main ─────────────────────────────────

async function main() {

await downloadAllPexels();

// ─── Step 3: Check for Google ImageFX stills ───────────────────────────

console.log('\n═══ STEP 3: Google ImageFX stills ═══\n');

const imageFxNeeded: Array<{ sceneId: number; prompt: string; filename: string }> = [];

for (const scene of scenes) {
  if (scene.clips) {
    scene.clips.forEach((clip, idx) => {
      if (clip.source === 'google_imagefx') {
        const filename = `scene-${scene.id}-still-${idx}.png`;
        const filepath = path.join(STILLS_DIR, filename);
        if (fs.existsSync(filepath)) {
          console.log(`  ${filename}: ✓ exists`);
        } else {
          imageFxNeeded.push({ sceneId: scene.id, prompt: clip.prompt!, filename });
        }
      }
    });
  }
}

if (imageFxNeeded.length > 0) {
  console.log('\n  ⚠ MANUAL STEP REQUIRED: Generate these stills at https://aitestkitchen.withgoogle.com/tools/image-fx\n');
  for (const img of imageFxNeeded) {
    console.log(`  📸 ${img.filename}`);
    console.log(`     Prompt: ${img.prompt}`);
    console.log(`     Save to: ${path.join(STILLS_DIR, img.filename)}`);
    console.log('');
  }
  console.log(`  Save all stills to: ${STILLS_DIR}/`);
  console.log('  Then re-run this script.\n');
  process.exit(0);
}

// ─── Step 4: Process clips — Ken Burns on stills, crop to 9:16 ─────────

console.log('\n═══ STEP 4: Processing clips (Ken Burns, crop) ═══\n');

function kenBurnsOnStill(stillPath: string, duration: number, outputPath: string): void {
  if (fs.existsSync(outputPath)) return;
  // Zoom from 1.0 to 1.15 over duration, output 1080x1920
  execSync(
    `ffmpeg -y -loop 1 -i "${stillPath}" -vf "scale=2160:3840,zoompan=z='min(zoom+0.0003,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${Math.ceil(duration * 30)}:s=1080x1920:fps=30" -t ${duration} -pix_fmt yuv420p -c:v libx264 -preset fast "${outputPath}" 2>/dev/null`,
    { timeout: 120_000 },
  );
  console.log(`  ✓ Ken Burns: ${path.basename(outputPath)} (${duration}s)`);
}

function cropTo916(inputPath: string, duration: number, outputPath: string): void {
  if (fs.existsSync(outputPath)) return;
  execSync(
    `ffmpeg -y -i "${inputPath}" -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1" -t ${duration} -c:v libx264 -preset fast -pix_fmt yuv420p "${outputPath}" 2>/dev/null`,
    { timeout: 120_000 },
  );
  console.log(`  ✓ Cropped: ${path.basename(outputPath)} (${duration}s)`);
}

// Process each scene into a single clip
for (const scene of scenes) {
  const dur = sceneDurations[scene.id] || scene.duration;
  const processedPath = path.join(CLIPS_DIR, `scene-${scene.id}-processed.mp4`);

  if (fs.existsSync(processedPath)) {
    console.log(`  Scene ${scene.id}: processed exists, skipping`);
    continue;
  }

  if (scene.source === 'pexels' || (scene.source?.includes('pexels') && !scene.clips)) {
    // Single Pexels clip — crop to 9:16
    const rawClip = path.join(CLIPS_DIR, `scene-${scene.id}-clip-0.mp4`);
    if (fs.existsSync(rawClip)) {
      cropTo916(rawClip, dur, processedPath);
    } else {
      console.log(`  Scene ${scene.id}: ⚠ clip missing, generating black placeholder`);
      execSync(
        `ffmpeg -y -f lavfi -i "color=c=black:s=1080x1920:d=${dur}" -pix_fmt yuv420p "${processedPath}" 2>/dev/null`,
      );
    }
  } else if (scene.clips) {
    // Multi-clip scene — process each sub-clip, then concat
    const subClips: string[] = [];
    let remainingDur = dur;

    for (let idx = 0; idx < scene.clips.length; idx++) {
      const clip = scene.clips[idx];
      const subDur = Math.min(clip.duration, remainingDur);
      remainingDur -= subDur;
      const subOut = path.join(CLIPS_DIR, `scene-${scene.id}-sub-${idx}.mp4`);

      if (fs.existsSync(subOut)) {
        subClips.push(subOut);
        continue;
      }

      if (clip.source === 'google_imagefx') {
        const still = path.join(STILLS_DIR, `scene-${scene.id}-still-${idx}.png`);
        kenBurnsOnStill(still, subDur, subOut);
      } else if (clip.source === 'pexels' || clip.source === undefined) {
        const rawClip = path.join(CLIPS_DIR, `scene-${scene.id}-clip-${idx}.mp4`);
        if (fs.existsSync(rawClip)) {
          cropTo916(rawClip, subDur, subOut);
        }
      } else if (clip.source === 'hailuo') {
        // Hailuo clip should be manually placed
        const hailuoClip = path.join(CLIPS_DIR, `scene-${scene.id}-hailuo.mp4`);
        if (fs.existsSync(hailuoClip)) {
          cropTo916(hailuoClip, subDur, subOut);
        } else {
          console.log(`  Scene ${scene.id} sub ${idx}: ⚠ Hailuo clip missing, using black`);
          execSync(
            `ffmpeg -y -f lavfi -i "color=c=black:s=1080x1920:d=${subDur}" -pix_fmt yuv420p "${subOut}" 2>/dev/null`,
          );
        }
      }

      if (fs.existsSync(subOut)) subClips.push(subOut);
    }

    if (subClips.length > 0) {
      // Concat sub-clips
      const concatFile = path.join(OUTPUT_DIR, `scene-${scene.id}-concat.txt`);
      fs.writeFileSync(concatFile, subClips.map(c => `file '${c}'`).join('\n'));
      execSync(
        `ffmpeg -y -f concat -safe 0 -i "${concatFile}" -c copy "${processedPath}" 2>/dev/null`,
        { timeout: 60_000 },
      );
      console.log(`  Scene ${scene.id}: ✓ ${subClips.length} sub-clips concatenated`);
    }
  }
}

// ─── Step 5: Add text overlays ─────────────────────────────────────────

console.log('\n═══ STEP 5: Text overlays ═══\n');

for (const scene of scenes) {
  if (!scene.textOverlay) continue;

  const input = path.join(CLIPS_DIR, `scene-${scene.id}-processed.mp4`);
  const output = path.join(CLIPS_DIR, `scene-${scene.id}-titled.mp4`);

  if (fs.existsSync(output) || !fs.existsSync(input)) continue;

  // Gold text on semi-transparent dark strip at bottom
  const escapedText = scene.textOverlay.replace(/'/g, "'\\''").replace(/:/g, '\\:');
  execSync(
    `ffmpeg -y -i "${input}" -vf "drawbox=x=0:y=ih-120:w=iw:h=120:color=black@0.6:t=fill,drawtext=text='${escapedText}':fontsize=28:fontcolor=0xf0d48a:x=(w-text_w)/2:y=h-80:font=Arial" -c:a copy "${output}" 2>/dev/null`,
    { timeout: 60_000 },
  );
  console.log(`  Scene ${scene.id}: ✓ text overlay added`);
}

// ─── Step 6: Final assembly — video + voice + sitar ────────────────────

console.log('\n═══ STEP 6: Final assembly ═══\n');

const finalPath = path.join(OUTPUT_DIR, 'mahayuga-short-final.mp4');

// Build concat list of all scene videos
const allSceneClips: string[] = [];
for (const scene of scenes) {
  const titled = path.join(CLIPS_DIR, `scene-${scene.id}-titled.mp4`);
  const processed = path.join(CLIPS_DIR, `scene-${scene.id}-processed.mp4`);
  allSceneClips.push(fs.existsSync(titled) ? titled : processed);
}

// Concat all video clips
const videoConcatFile = path.join(OUTPUT_DIR, 'video-concat.txt');
fs.writeFileSync(videoConcatFile, allSceneClips.map(c => `file '${c}'`).join('\n'));

const rawVideo = path.join(OUTPUT_DIR, 'raw-video.mp4');
execSync(
  `ffmpeg -y -f concat -safe 0 -i "${videoConcatFile}" -c:v libx264 -preset fast -pix_fmt yuv420p "${rawVideo}" 2>/dev/null`,
  { timeout: 300_000 },
);
console.log('  ✓ Video concatenated');

// Concat all voiceovers
const voiceParts = scenes.map(s => {
  if (s.id === 5) {
    const withSilence = path.join(VOICE_DIR, 'scene-5-with-silence.mp3');
    return fs.existsSync(withSilence) ? withSilence : path.join(VOICE_DIR, `scene-${s.id}.mp3`);
  }
  return path.join(VOICE_DIR, `scene-${s.id}.mp3`);
});

const voiceConcatFile = path.join(OUTPUT_DIR, 'voice-concat.txt');
fs.writeFileSync(voiceConcatFile, voiceParts.map(p => `file '${p}'`).join('\n'));

const fullVoice = path.join(OUTPUT_DIR, 'full-voice.mp3');
execSync(
  `ffmpeg -y -f concat -safe 0 -i "${voiceConcatFile}" -c:a libmp3lame -q:a 2 "${fullVoice}" 2>/dev/null`,
  { timeout: 60_000 },
);
console.log('  ✓ Voiceover concatenated');

// Get total video duration
const totalDur = execSync(
  `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${rawVideo}"`,
  { encoding: 'utf-8' },
).trim();

// Mix: video + voiceover + sitar (from 4:30 = 270s offset, lower volume)
const sitarOffset = 270; // seconds into the sitar track (skip alap)
execSync(
  `ffmpeg -y -i "${rawVideo}" -i "${fullVoice}" -ss ${sitarOffset} -i "${SITAR_PATH}" -filter_complex "[1:a]volume=1.0[voice];[2:a]volume=0.15,atrim=0:${totalDur},asetpts=PTS-STARTPTS[music];[voice][music]amix=inputs=2:duration=first:dropout_transition=3[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest "${finalPath}" 2>/dev/null`,
  { timeout: 300_000 },
);

console.log(`\n✅ DONE: ${finalPath}`);
console.log(`   Duration: ${totalDur}s`);
console.log(`   Cost: $0.00\n`);

// Print file size
const stat = fs.statSync(finalPath);
console.log(`   Size: ${(stat.size / 1024 / 1024).toFixed(1)}MB`);

} // end main

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
