/**
 * Download free stock video clips from Pexels for video production.
 *
 * Pexels API is free — just needs an API key from pexels.com/api
 * All clips are free for commercial use, no attribution required.
 *
 * Usage:
 *   npx tsx scripts/download-stock-clips.ts sade-sati-saturn-v2
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve('.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

const PEXELS_KEY = process.env.PEXELS_API_KEY?.trim();
if (!PEXELS_KEY) {
  console.error('[stock] PEXELS_API_KEY not found in .env.local');
  console.error('[stock] Get a free key at https://www.pexels.com/api/new/');
  process.exit(1);
}

interface PexelsVideo {
  id: number;
  url: string;
  video_files: Array<{
    id: number;
    quality: string;
    width: number;
    height: number;
    link: string;
    file_type: string;
  }>;
}

interface StockClipRequest {
  sceneId: number;
  query: string;
  orientation: 'portrait' | 'landscape';
  minDuration: number;
}

async function searchPexels(query: string, orientation: string, perPage: number = 5): Promise<PexelsVideo[]> {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${perPage}&size=large`;

  const res = await fetch(url, {
    headers: { Authorization: PEXELS_KEY! },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.videos || [];
}

function getBestFile(video: PexelsVideo, preferPortrait: boolean): { url: string; quality: string; width: number; height: number } | null {
  const files = video.video_files
    .filter(f => f.file_type === 'video/mp4')
    .sort((a, b) => {
      // Prefer HD/SD quality, avoid huge 4K files
      const qualityOrder: Record<string, number> = { hd: 0, sd: 1, uhd: 2 };
      return (qualityOrder[a.quality] ?? 3) - (qualityOrder[b.quality] ?? 3);
    });

  if (preferPortrait) {
    // Prefer portrait-oriented files
    const portrait = files.find(f => f.height > f.width);
    if (portrait) return { url: portrait.link, quality: portrait.quality, width: portrait.width, height: portrait.height };
  }

  // Fallback to any HD file
  const hd = files.find(f => f.quality === 'hd');
  if (hd) return { url: hd.link, quality: hd.quality, width: hd.width, height: hd.height };

  // Any file
  return files[0] ? { url: files[0].link, quality: files[0].quality, width: files[0].width, height: files[0].height } : null;
}

async function downloadClip(url: string, outputPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buffer);
  const sizeMB = (buffer.length / (1024 * 1024)).toFixed(1);
  console.log(`[stock]   Saved: ${outputPath} (${sizeMB}MB)`);
}

async function main() {
  const scriptName = process.argv[2];
  if (!scriptName) {
    console.error('Usage: npx tsx scripts/download-stock-clips.ts <script-name>');
    process.exit(1);
  }

  const outputDir = `/tmp/videos/clips/${scriptName}`;
  mkdirSync(outputDir, { recursive: true });

  // Define what we need for each scene
  const clips: StockClipRequest[] = [
    { sceneId: 1, query: 'saturn planet rings space', orientation: 'portrait', minDuration: 8 },
    { sceneId: 2, query: 'saturn planet moon space', orientation: 'portrait', minDuration: 8 },
    { sceneId: 3, query: 'saturn orbit space constellation', orientation: 'portrait', minDuration: 10 },
    { sceneId: 4, query: 'saturn rings close up space', orientation: 'portrait', minDuration: 10 },
    // Scene 5 (Rishi) = AI generated, skip
    // Scene 6 = KEEP_EXISTING
    { sceneId: 7, query: 'storm clouds lightning sunrise golden', orientation: 'portrait', minDuration: 10 },
    // Scene 8 = KEEP_EXISTING
  ];

  console.log(`[stock] Downloading ${clips.length} clips from Pexels (free, commercial use OK)`);
  console.log(`[stock] Output: ${outputDir}/\n`);

  for (const clip of clips) {
    const outputPath = path.join(outputDir, `scene-${clip.sceneId}.mp4`);

    if (existsSync(outputPath)) {
      console.log(`[stock] Scene ${clip.sceneId}: already exists, skipping`);
      continue;
    }

    console.log(`[stock] Scene ${clip.sceneId}: searching "${clip.query}"...`);

    try {
      const videos = await searchPexels(clip.query, clip.orientation);

      if (videos.length === 0) {
        // Try landscape as fallback
        console.log(`[stock]   No portrait results, trying landscape...`);
        const landscapeVideos = await searchPexels(clip.query, 'landscape');
        if (landscapeVideos.length === 0) {
          console.log(`[stock]   No results found. Try manually at https://www.pexels.com/search/videos/${encodeURIComponent(clip.query)}/`);
          continue;
        }
        videos.push(...landscapeVideos);
      }

      // Show options
      console.log(`[stock]   Found ${videos.length} results. Picking best match...`);

      const video = videos[0];
      const file = getBestFile(video, clip.orientation === 'portrait');

      if (!file) {
        console.log(`[stock]   No suitable file found for video ${video.id}`);
        continue;
      }

      console.log(`[stock]   Video #${video.id}: ${file.width}x${file.height} (${file.quality})`);
      console.log(`[stock]   Preview: ${video.url}`);

      await downloadClip(file.url, outputPath);
    } catch (err) {
      console.error(`[stock]   ERROR: ${err}`);
    }

    // Brief pause
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n[stock] Done!');
  console.log(`[stock] Clips: ${outputDir}/`);
  console.log('[stock] Scene 5 (Rishi): generate free at https://hailuoai.video');
  console.log('[stock] Then run: npx tsx scripts/compose-video.ts ' + scriptName);
}

main().catch(err => {
  console.error('[stock] Fatal:', err);
  process.exit(1);
});
