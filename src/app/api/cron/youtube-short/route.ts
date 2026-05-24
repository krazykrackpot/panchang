import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { claimCronSingletonRun, utcRunDate } from '@/lib/cron/email-sent-anchor';
import { generateDailyShort } from '@/lib/youtube/generate-short';
import { uploadToYouTube } from '@/lib/youtube/upload';

// This route requires ffmpeg — it CANNOT run on Vercel serverless.
// Run locally or via GitHub Actions instead. maxDuration is irrelevant here
// but set to prevent accidental Vercel CPU burn if someone adds it to crons.
export const maxDuration = 10;

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
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  // Check YouTube credentials exist
  if (!process.env.YOUTUBE_CLIENT_ID?.trim() || !process.env.YOUTUBE_REFRESH_TOKEN?.trim()) {
    return NextResponse.json(
      { error: 'YouTube credentials not configured. Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN.' },
      { status: 503 },
    );
  }

  try {
    // Round 3 R3-IDEM-5 — singleton dedup. Without it, a Vercel cron
    // retry on 502 would re-generate AND re-upload a second video. Each
    // upload burns ffmpeg CPU + YouTube quota; the YouTube channel ends
    // up with duplicates. Claim-first via cron_singleton_run (migration
    // 041) collides on the UTC day and short-circuits.
    // Gemini #166 — fail-fast on missing supabase (was silent
    // bypass-dedup). YouTube uploads are expensive enough that
    // proceeding without dedup is the riskier failure mode; matches the
    // social-post route's 503 convention.
    const supabase = getServerSupabase();
    if (!supabase) {
      console.error('[youtube-cron] supabase not configured — cannot dedup; refusing to upload');
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const runDate = utcRunDate();
    const { claimed, error: claimErr } = await claimCronSingletonRun(supabase, {
      cronName: 'youtube-short',
      runDate,
    });
    if (claimErr) {
      console.error('[youtube-cron] claim failed:', claimErr.message);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    if (!claimed) {
      return NextResponse.json({
        success: false,
        reason: 'Already uploaded today',
        date: runDate,
      });
    }

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
    // Drop detail — console.error retains the full message + stack for
    // ops; leaking ffmpeg/Google API errors to the response is the same
    // pattern audit M14 scrubbed elsewhere. Round 4.
    console.error('[youtube-cron] Failed:', err);
    return NextResponse.json(
      { error: 'YouTube Short generation/upload failed' },
      { status: 500 },
    );
  }
}
