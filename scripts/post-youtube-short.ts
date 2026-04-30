#!/usr/bin/env npx tsx
/**
 * Standalone script: generate and upload a daily panchang YouTube Short.
 *
 * Run manually:     npx tsx scripts/post-youtube-short.ts
 * Run from cron:    0 1 * * * cd /path/to/panchang && npx tsx scripts/post-youtube-short.ts
 * Run from GH Action: see .github/workflows/youtube-short.yml
 *
 * Prerequisites:
 *   - ffmpeg installed
 *   - .env.local with YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
 *   - NEXT_PUBLIC_SITE_URL set (or defaults to https://dekhopanchang.com)
 */

import { readFileSync } from 'fs';

// Load .env.local
try {
  const envContent = readFileSync('.env.local', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* rely on process.env */ }

async function main() {
  console.log('🎬 Generating daily panchang YouTube Short...\n');

  // Dynamic imports so env is loaded first
  const { generateDailyShort } = await import('../src/lib/youtube/generate-short');
  const { uploadToYouTube } = await import('../src/lib/youtube/upload');

  const short = await generateDailyShort();
  console.log(`✅ Video generated: ${(short.videoBuffer.byteLength / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Title: ${short.title}\n`);

  // Check if --dry-run flag
  if (process.argv.includes('--dry-run')) {
    console.log('🏁 Dry run — skipping upload. Video is ready.');
    return;
  }

  console.log('📤 Uploading to YouTube...\n');
  const videoId = await uploadToYouTube({
    videoBuffer: short.videoBuffer,
    title: short.title,
    description: short.description,
    tags: short.tags,
    isShort: true,
  });

  console.log(`🎉 Published: https://youtube.com/shorts/${videoId}`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
