/**
 * Generate voiceover audio for a video script using ElevenLabs TTS API.
 *
 * Usage:
 *   npx tsx scripts/generate-voiceover.ts vedic-vs-western
 *
 * Output: /tmp/videos/voiceover/<script-name>/scene-{id}.mp3
 *         /tmp/videos/voiceover/<script-name>/combined.mp3 (all scenes concatenated)
 *
 * Prerequisites:
 *   - ELEVENLABS_API_KEY in .env.local
 *   - ffmpeg installed (for concatenation)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Load .env.local
const envPath = path.resolve('.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY?.trim();
if (!API_KEY) {
  console.error('[voiceover] ELEVENLABS_API_KEY not found in .env.local');
  process.exit(1);
}

// ElevenLabs voice IDs — curated for Vedic astrology narration
const VOICE_PROFILES: Record<string, string> = {
  // Male narrators
  'narrator-en': 'pNInz6obpgDQGcFmaJgB',   // Adam — deep, authoritative
  'narrator-hi': 'pqHfZKP75CvOlQylNhV4',   // Bill — wise, mature, balanced (best Hindi pronunciation)
  // Female narrators
  'narrator-en-f': 'EXAVITQu4vr4xnSDxMaL', // Sarah
  'narrator-hi-f': 'EXAVITQu4vr4xnSDxMaL', // Sarah
};

interface Scene {
  id: number;
  duration: number;
  narration: string;
  visualType: string;
  textOverlay?: string;
  transition: string;
}

interface VideoScript {
  meta: {
    topic: string;
    type: string;
    language: string;
    estimatedDuration: number;
    style: string;
    musicMood?: string;
    voiceProfile?: string;
  };
  scenes: Scene[];
}

async function generateSceneAudio(
  text: string,
  voiceId: string,
  outputPath: string,
  sceneId: number
): Promise<void> {
  console.log(`[voiceover] Scene ${sceneId}: "${text.slice(0, 60)}..."`);

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY!,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.6,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[voiceover] ElevenLabs API error (${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  writeFileSync(outputPath, buffer);
  console.log(`[voiceover] Scene ${sceneId}: saved ${(buffer.length / 1024).toFixed(1)}KB → ${outputPath}`);
}

async function concatenateAudio(scenePaths: string[], outputPath: string): Promise<void> {
  // Create ffmpeg concat file
  const concatList = scenePaths.map((p) => `file '${p}'`).join('\n');
  const concatFile = path.join(path.dirname(outputPath), 'concat.txt');
  writeFileSync(concatFile, concatList);

  try {
    execSync(`ffmpeg -y -f concat -safe 0 -i "${concatFile}" -c copy "${outputPath}"`, {
      stdio: 'pipe',
    });
    console.log(`[voiceover] Combined audio: ${outputPath}`);
  } catch (err) {
    console.error('[voiceover] ffmpeg concatenation failed:', err);
    console.log('[voiceover] Individual scene files are still available.');
  }
}

async function main() {
  const scriptName = process.argv[2];
  if (!scriptName) {
    console.error('Usage: npx tsx scripts/generate-voiceover.ts <script-name>');
    process.exit(1);
  }

  const scriptPath = path.resolve(`src/video/scripts/${scriptName}.json`);
  let script: VideoScript;
  try {
    script = JSON.parse(readFileSync(scriptPath, 'utf-8'));
  } catch (err) {
    console.error(`[voiceover] Failed to read script: ${scriptPath}`, err);
    process.exit(1);
  }

  const voiceProfile = script.meta.voiceProfile ?? 'narrator-en';
  const voiceId = VOICE_PROFILES[voiceProfile] ?? VOICE_PROFILES['narrator-en'];

  const outputDir = `/tmp/videos/voiceover/${scriptName}`;
  mkdirSync(outputDir, { recursive: true });

  console.log(`[voiceover] Generating ${script.scenes.length} scene voiceovers...`);
  console.log(`[voiceover] Voice: ${voiceProfile} (${voiceId})`);
  console.log(`[voiceover] Language: ${script.meta.language}`);
  console.log('');

  const scenePaths: string[] = [];

  for (const scene of script.scenes) {
    if (!scene.narration || scene.narration.trim().length === 0) {
      console.log(`[voiceover] Scene ${scene.id}: skipped (no narration)`);
      continue;
    }

    const outputPath = path.join(outputDir, `scene-${scene.id}.mp3`);
    scenePaths.push(outputPath);

    // Skip if already generated
    if (existsSync(outputPath)) {
      console.log(`[voiceover] Scene ${scene.id}: already exists, skipping`);
      continue;
    }

    await generateSceneAudio(scene.narration, voiceId, outputPath, scene.id);

    // Brief pause to respect rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  // Concatenate all scenes
  if (scenePaths.length > 1) {
    const combinedPath = path.join(outputDir, 'combined.mp3');
    await concatenateAudio(scenePaths, combinedPath);
  }

  console.log('\n[voiceover] Done!');
  console.log(`[voiceover] Scene files: ${outputDir}/scene-*.mp3`);
  console.log(`[voiceover] Combined: ${outputDir}/combined.mp3`);
}

main().catch((err) => {
  console.error('[voiceover] Fatal error:', err);
  process.exit(1);
});
