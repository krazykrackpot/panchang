/**
 * YouTube Short video generator.
 *
 * Fetches a 1080x1920 panchang image from the Instagram API (adapted for
 * vertical format) and converts it to a 15-second MP4 using system ffmpeg.
 *
 * This runs as a Node.js script or from a server-side API route — it shells
 * out to ffmpeg which must be installed on the host (local dev, CI, or
 * Hetzner). NOT suitable for Vercel serverless (no ffmpeg binary).
 *
 * For Vercel deployment: call this from a scheduled GitHub Action or
 * external worker, not from a Vercel function.
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync, mkdtempSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export interface ShortVideoResult {
  videoBuffer: Buffer;
  title: string;
  description: string;
  tags: string[];
}

/**
 * Generate a daily panchang YouTube Short.
 *
 * 1. Fetches the panchang image from /api/social/instagram?type=panchang&format=shorts
 * 2. Uses ffmpeg to create a 15-second MP4 with a slow Ken Burns zoom
 * 3. Returns the video buffer + metadata for upload
 */
export async function generateDailyShort(): Promise<ShortVideoResult> {
  const tmp = mkdtempSync(join(tmpdir(), 'yt-short-'));
  const imgPath = join(tmp, 'frame.png');
  const videoPath = join(tmp, 'short.mp4');

  try {
    // Fetch the vertical panchang image
    const imgUrl = `${BASE_URL}/api/social/instagram?type=panchang&format=shorts`;
    const imgRes = await fetch(imgUrl);
    if (!imgRes.ok) {
      throw new Error(`[youtube] Image fetch failed (${imgRes.status}): ${await imgRes.text()}`);
    }
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    writeFileSync(imgPath, imgBuffer);

    // Generate 15-second MP4 with subtle Ken Burns zoom effect
    // -loop 1: loop the single image
    // -t 15: 15 seconds duration
    // -vf zoompan: slow zoom from 100% to 105% over 15s (450 frames at 30fps)
    // -pix_fmt yuv420p: required for YouTube compatibility
    // -c:v libx264 -crf 18: high quality H.264
    const ffmpegCmd = [
      'ffmpeg -y',
      `-loop 1 -i "${imgPath}"`,
      '-t 15',
      '-vf "zoompan=z=\'min(zoom+0.0003,1.05)\':d=450:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s=1080x1920:fps=30"',
      '-c:v libx264 -preset medium -crf 18',
      '-pix_fmt yuv420p',
      '-movflags +faststart',
      `"${videoPath}"`,
    ].join(' ');

    execSync(ffmpegCmd, { stdio: 'pipe', timeout: 60000 });

    const videoBuffer = readFileSync(videoPath);

    // Build metadata
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const dateHi = today.toLocaleDateString('hi-IN', { month: 'long', day: 'numeric', year: 'numeric' });

    return {
      videoBuffer,
      title: `Today's Panchang — ${dateStr} | आज का पंचांग #Shorts`,
      description: [
        `Daily Vedic Panchang for ${dateStr} (${dateHi})`,
        '',
        'Tithi, Nakshatra, Yoga, Karana, Sunrise, Sunset, Rahu Kaal — computed for Ujjain.',
        '',
        `Full interactive panchang: ${BASE_URL}/en/panchang`,
        `Generate your Kundali: ${BASE_URL}/en/kundali`,
        '',
        '#Panchang #VedicAstrology #Jyotish #HinduCalendar #Tithi #Nakshatra #DekhoPanchang #Shorts',
      ].join('\n'),
      tags: [
        'panchang', 'panchang today', 'aaj ka panchang', 'vedic astrology',
        'jyotish', 'tithi', 'nakshatra', 'hindu calendar', 'rahu kaal',
        'dekho panchang', 'daily panchang',
      ],
    };
  } finally {
    // Cleanup temp files
    try { unlinkSync(imgPath); } catch { /* ignore */ }
    try { unlinkSync(videoPath); } catch { /* ignore */ }
    try { execSync(`rmdir "${tmp}"`); } catch { /* ignore */ }
  }
}
