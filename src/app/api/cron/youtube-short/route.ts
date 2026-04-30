import { NextResponse } from 'next/server';
import { generateDailyShort } from '@/lib/youtube/generate-short';
import { uploadToYouTube } from '@/lib/youtube/upload';

/**
 * Cron endpoint: generates and uploads a daily panchang YouTube Short.
 *
 * Triggered by Vercel Cron or external scheduler at ~01:00 UTC (06:30 IST).
 * Protected by CRON_SECRET header.
 *
 * NOTE: This route requires ffmpeg on the host. It works on:
 *   - Local dev (homebrew ffmpeg)
 *   - Hetzner/Coolify (apt-get ffmpeg)
 *   - GitHub Actions (pre-installed)
 *   - NOT on Vercel serverless (no ffmpeg binary)
 *
 * For Vercel deployment: use a GitHub Action on a cron schedule instead,
 * calling the generate + upload functions directly.
 *
 * Required env vars:
 *   CRON_SECRET, YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check YouTube credentials exist
  if (!process.env.YOUTUBE_CLIENT_ID?.trim() || !process.env.YOUTUBE_REFRESH_TOKEN?.trim()) {
    return NextResponse.json(
      { error: 'YouTube credentials not configured. Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN.' },
      { status: 503 },
    );
  }

  try {
    console.log('[youtube-cron] Generating daily Short...');
    const short = await generateDailyShort();
    console.log(`[youtube-cron] Video generated: ${(short.videoBuffer.byteLength / 1024 / 1024).toFixed(1)} MB`);

    const videoId = await uploadToYouTube({
      videoBuffer: short.videoBuffer,
      title: short.title,
      description: short.description,
      tags: short.tags,
      isShort: true,
    });

    console.log(`[youtube-cron] Uploaded successfully: https://youtube.com/shorts/${videoId}`);

    return NextResponse.json({
      success: true,
      videoId,
      url: `https://youtube.com/shorts/${videoId}`,
      title: short.title,
    });
  } catch (err) {
    console.error('[youtube-cron] Failed:', err);
    return NextResponse.json(
      { error: 'YouTube Short generation/upload failed', detail: String(err) },
      { status: 500 },
    );
  }
}
