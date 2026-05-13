/**
 * Generate AI video clips for each scene in a script using fal.ai.
 *
 * Supports multiple AI video models:
 *   - kling: Kling 3.0 ($0.029/s) — best value, 1080p
 *   - veo: Google Veo 3.1 ($0.20/s) — cinema quality, up to 4K
 *   - runway: Runway Gen-4 Turbo ($0.05/s) — good middle ground
 *
 * Usage:
 *   npx tsx scripts/generate-ai-clips.ts vedic-vs-western --model kling
 *   npx tsx scripts/generate-ai-clips.ts sade-sati-saturn --model veo
 *   npx tsx scripts/generate-ai-clips.ts pushya-nakshatra-gold --model runway
 *
 * Output: /tmp/videos/clips/<script-name>/scene-{id}.mp4
 *
 * Prerequisites:
 *   - FAL_KEY in .env.local
 *   - fal.ai account with credits
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fal } from '@fal-ai/client';

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

const FAL_KEY = process.env.FAL_KEY?.trim();

// Model configurations
type ModelId = 'kling' | 'veo' | 'runway';

interface ModelConfig {
  endpoint: string;
  name: string;
  costPerSecond: number;
  maxDuration: number; // seconds per clip
  supportsAspectRatio: boolean;
}

const MODELS: Record<ModelId, ModelConfig> = {
  kling: {
    endpoint: 'fal-ai/kling-video/v2/master/text-to-video',
    name: 'Kling 3.0',
    costPerSecond: 0.28,  // CORRECTED — was wrong at 0.029, actual is $0.28/s
    maxDuration: 10,
    supportsAspectRatio: true,
  },
  veo: {
    endpoint: 'fal-ai/veo3',
    name: 'Google Veo 3.1',
    costPerSecond: 0.40,  // CORRECTED — verify on fal.ai/pricing before use
    maxDuration: 8,
    supportsAspectRatio: true,
  },
  runway: {
    endpoint: 'fal-ai/runway-gen4/turbo/text-to-video',
    name: 'Runway Gen-4 Turbo',
    costPerSecond: 0.12,  // CORRECTED — verify on fal.ai/pricing before use
    maxDuration: 10,
    supportsAspectRatio: true,
  },
};

interface Scene {
  id: number;
  duration: number;
  narration: string;
  visualType: string;
  textOverlay?: string;
  transition: string;
  videoPrompt?: string;      // AI video generation prompt
  cosmicPreset?: string;
  planet?: string;
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

/**
 * Build a cinematic video prompt from scene data.
 * If scene has an explicit videoPrompt, use that.
 * Otherwise, generate one from the scene metadata.
 */
function buildVideoPrompt(scene: Scene, style: string): string {
  if (scene.videoPrompt) return scene.videoPrompt;

  // Build prompt from scene context
  const cinematic = 'Cinematic 4K, dramatic lighting, slow motion, epic cosmic atmosphere. ';
  const mood = style === 'dramatic'
    ? 'Dark and dramatic, golden light accents, awe-inspiring. '
    : style === 'educational'
      ? 'Elegant and clear, soft golden light, educational documentary feel. '
      : 'Warm and inviting, natural lighting, engaging. ';

  // Map visual types and presets to video descriptions
  const presetDescriptions: Record<string, string> = {
    nebula: 'Deep space nebula with swirling purple and blue gas clouds, golden star particles floating through cosmic dust, camera slowly drifting through the nebula',
    planet: 'Massive planet emerging from darkness, atmospheric glow around the limb, star field behind, camera slowly orbiting',
    sun_corona: 'Close-up of a blazing star with corona rays extending outward, plasma arcs and solar flares, golden light flooding the frame',
    galaxy: 'Spiral galaxy rotating in deep space, billions of stars in spiral arms, cosmic dust lanes, camera pulling back to reveal the full structure',
    deep_space: 'Vast deep space void with distant galaxies, sparse bright stars against infinite darkness, a single light beam crossing the frame',
    aurora: 'Northern lights dancing across a star-filled sky, green and purple curtains of light, mystical celestial atmosphere',
    eclipse: 'Total solar eclipse with diamond ring effect, corona streamers visible, dramatic light shift from day to darkness',
    constellation: 'Star constellation pattern forming in the night sky, golden lines connecting bright stars, ancient star map coming to life',
    celestial: 'Cosmic celestial scene with twinkling stars, gentle nebula glow in the distance, peaceful deep space atmosphere',
  };

  const planetDescriptions: Record<string, string> = {
    sun: 'Close-up of the Sun with solar flares and corona, blazing orange and gold surface, plasma eruptions',
    moon: 'Full Moon in sharp detail, craters and maria visible, silvery light, slowly rotating',
    mars: 'Mars in deep space, red desert surface visible, thin atmosphere, Olympus Mons and Valles Marineris',
    mercury: 'Mercury close to the Sun, cratered grey surface, extreme terminator shadow, harsh sunlight',
    jupiter: 'Jupiter with its Great Red Spot and atmospheric bands, swirling storms, massive gas giant filling the frame',
    venus: 'Venus with thick cloud atmosphere, golden-white glow, mysterious veiled planet',
    saturn: 'Saturn with its magnificent ring system, ice particles in the rings catching sunlight, Cassini Division visible',
    rahu: 'Dark shadowy celestial body, lunar node, eclipse-like darkness consuming light, mysterious and ominous',
    ketu: 'Fiery comet-like body with a blazing tail, spiritual energy, dissolution of matter into light',
  };

  let description = '';

  if (scene.planet && planetDescriptions[scene.planet]) {
    description = planetDescriptions[scene.planet];
  } else if (scene.cosmicPreset && presetDescriptions[scene.cosmicPreset]) {
    description = presetDescriptions[scene.cosmicPreset];
  } else {
    // Derive from visual type
    switch (scene.visualType) {
      case 'title_card':
      case 'cosmic_text':
        description = 'Dramatic cosmic reveal, light bursting through darkness, golden particles cascading, epic space atmosphere';
        break;
      case 'zodiac_wheel':
        description = 'Ancient zodiac wheel of golden constellations rotating in space, 12 star signs glowing, celestial map';
        break;
      case 'planet_render':
        description = 'Planet in deep space with atmospheric glow, star field background, cinematic slow orbit';
        break;
      case 'cta':
        description = 'Serene cosmic scene, calm starfield with gentle golden glow, peaceful resolution, camera pulling back from a galaxy';
        break;
      default:
        description = 'Beautiful cosmic space scene with stars and nebula, golden light, cinematic depth';
    }
  }

  return cinematic + mood + description;
}

async function generateClip(
  scene: Scene,
  model: ModelConfig,
  modelId: ModelId,
  outputPath: string,
  style: string
): Promise<void> {
  const prompt = buildVideoPrompt(scene, style);
  const clipDuration = Math.min(scene.duration, model.maxDuration);

  console.log(`[ai-clips] Scene ${scene.id}: generating ${clipDuration}s clip with ${model.name}`);
  console.log(`[ai-clips]   Prompt: "${prompt.slice(0, 100)}..."`);
  console.log(`[ai-clips]   Est. cost: $${(clipDuration * model.costPerSecond).toFixed(3)}`);

  // Build model-specific input
  let input: Record<string, unknown>;

  switch (modelId) {
    case 'kling':
      input = {
        prompt,
        duration: clipDuration <= 5 ? '5' : '10',
        aspect_ratio: '9:16',
      };
      break;
    case 'veo':
      input = {
        prompt,
        duration: `${clipDuration}s`,
        aspect_ratio: '9:16',
        // enhance_prompt: true, // Veo can auto-enhance prompts
      };
      break;
    case 'runway':
      input = {
        prompt,
        duration: clipDuration,
        aspect_ratio: '9:16',
        // resolution: '720p',
      };
      break;
    default:
      input = { prompt, duration: clipDuration };
  }

  try {
    const result = await fal.subscribe(model.endpoint, {
      input,
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_QUEUE') {
          console.log(`[ai-clips]   Queue position: ${(update as { queue_position?: number }).queue_position ?? 'unknown'}`);
        } else if (update.status === 'IN_PROGRESS') {
          console.log(`[ai-clips]   Generating...`);
        }
      },
    });

    // Extract video URL from result — structure varies by model
    const data = result.data as Record<string, unknown>;
    let videoUrl: string | undefined;

    // Try common response structures
    if (typeof data.video === 'object' && data.video && 'url' in (data.video as Record<string, unknown>)) {
      videoUrl = (data.video as { url: string }).url;
    } else if (typeof data.video_url === 'string') {
      videoUrl = data.video_url;
    } else if (typeof data.video === 'string') {
      videoUrl = data.video;
    } else if (typeof data.output === 'string') {
      videoUrl = data.output;
    } else if (Array.isArray(data.videos) && data.videos.length > 0) {
      const first = data.videos[0];
      videoUrl = typeof first === 'string' ? first : (first as { url: string }).url;
    }

    if (!videoUrl) {
      console.error(`[ai-clips]   Could not extract video URL from response:`, JSON.stringify(data).slice(0, 500));
      return;
    }

    // Download the video
    console.log(`[ai-clips]   Downloading clip...`);
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    writeFileSync(outputPath, Buffer.from(arrayBuffer));
    const sizeMB = (arrayBuffer.byteLength / (1024 * 1024)).toFixed(1);
    console.log(`[ai-clips]   Saved: ${outputPath} (${sizeMB}MB)`);
  } catch (err) {
    console.error(`[ai-clips]   ERROR generating scene ${scene.id}:`, err);
    console.error(`[ai-clips]   Skipping this scene. You can retry later.`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const scriptName = args.find((a) => !a.startsWith('--'));
  const modelFlag = args.find((a) => a.startsWith('--model='))?.split('=')[1]
    ?? args[args.indexOf('--model') + 1]
    ?? 'kling';

  const dryRun = args.includes('--dry-run');

  if (!scriptName) {
    console.error('Usage: npx tsx scripts/generate-ai-clips.ts <script-name> --model <kling|veo|runway> [--dry-run]');
    console.error('\nModels:');
    console.error('  kling   — Kling 3.0 via fal.ai ($0.029/s) [DEFAULT]');
    console.error('  veo     — Google Veo 3.1 via fal.ai ($0.20/s)');
    console.error('  runway  — Runway Gen-4 Turbo via fal.ai ($0.05/s)');
    console.error('\nFlags:');
    console.error('  --dry-run  Show prompts, durations, and costs without calling the API');
    process.exit(1);
  }

  const modelId = modelFlag as ModelId;
  if (!MODELS[modelId]) {
    console.error(`[ai-clips] Unknown model: ${modelFlag}. Use: kling, veo, or runway`);
    process.exit(1);
  }
  const model = MODELS[modelId];

  const scriptPath = path.resolve(`src/video/scripts/${scriptName}.json`);
  let script: VideoScript;
  try {
    script = JSON.parse(readFileSync(scriptPath, 'utf-8'));
  } catch (err) {
    console.error(`[ai-clips] Failed to read script: ${scriptPath}`, err);
    process.exit(1);
  }

  const outputDir = `/tmp/videos/clips/${scriptName}`;
  mkdirSync(outputDir, { recursive: true });

  // Calculate total cost estimate
  const totalSeconds = script.scenes.reduce((sum, s) => sum + Math.min(s.duration, model.maxDuration), 0);
  const totalCost = totalSeconds * model.costPerSecond;

  console.log(`[ai-clips] Script: ${script.meta.topic}`);
  console.log(`[ai-clips] Model: ${model.name} (${model.endpoint})`);
  console.log(`[ai-clips] Scenes: ${script.scenes.length}`);
  console.log(`[ai-clips] Total clip duration: ${totalSeconds}s`);
  console.log(`[ai-clips] Estimated cost: $${totalCost.toFixed(2)}`);
  if (dryRun) console.log(`[ai-clips] MODE: DRY RUN — no API calls will be made`);
  console.log('');

  // Dry run: show full breakdown and exit
  if (dryRun) {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  SCENE BREAKDOWN — Review before spending');
    console.log('═══════════════════════════════════════════════════════════════\n');

    for (const scene of script.scenes) {
      const clipDuration = Math.min(scene.duration, model.maxDuration);
      const sceneCost = clipDuration * model.costPerSecond;
      const prompt = buildVideoPrompt(scene, script.meta.style);

      console.log(`┌─ Scene ${scene.id} ─────────────────────────────────────────`);
      console.log(`│  Duration:  ${clipDuration}s (scene asks ${scene.duration}s, model max ${model.maxDuration}s)`);
      console.log(`│  Cost:      $${sceneCost.toFixed(3)}`);
      console.log(`│  Aspect:    9:16 (vertical)`);
      console.log(`│  Narration: "${scene.narration.slice(0, 80)}..."`);
      console.log(`│`);
      console.log(`│  PROMPT (what the AI will generate):`);
      // Word-wrap the prompt at ~70 chars
      const words = prompt.split(' ');
      let line = '│    ';
      for (const word of words) {
        if (line.length + word.length > 75) {
          console.log(line);
          line = '│    ' + word + ' ';
        } else {
          line += word + ' ';
        }
      }
      if (line.trim() !== '│') console.log(line);
      console.log(`└──────────────────────────────────────────────────────────────\n`);
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  TOTAL: ${script.scenes.length} clips × ${model.name} = $${totalCost.toFixed(2)}`);
    console.log(`  (Both EN and HI versions share the same clips — generate once)`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n  Happy with the prompts? Run without --dry-run to generate.`);
    console.log(`  npx tsx scripts/generate-ai-clips.ts ${scriptName} --model ${modelId}\n`);
    return;
  }

  // Check FAL_KEY only when actually generating
  if (!FAL_KEY) {
    console.error('[ai-clips] FAL_KEY not found in .env.local');
    console.error('[ai-clips] Get your API key at https://fal.ai/dashboard/keys');
    process.exit(1);
  }
  fal.config({ credentials: FAL_KEY });

  for (const scene of script.scenes) {
    const outputPath = path.join(outputDir, `scene-${scene.id}.mp4`);

    // Skip if already generated
    if (existsSync(outputPath)) {
      console.log(`[ai-clips] Scene ${scene.id}: already exists, skipping`);
      continue;
    }

    await generateClip(scene, model, modelId, outputPath, script.meta.style);
    console.log('');

    // Brief pause between API calls
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('[ai-clips] Done!');
  console.log(`[ai-clips] Clips saved to: ${outputDir}/`);
  console.log(`[ai-clips] Next step: npx tsx scripts/compose-video.ts ${scriptName}`);
}

main().catch((err) => {
  console.error('[ai-clips] Fatal error:', err);
  process.exit(1);
});
