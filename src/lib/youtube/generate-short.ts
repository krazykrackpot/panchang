/**
 * YouTube Short video generator — cinematic 5-slide panchang Short.
 *
 * 1. Fetches 5 branded slides from /api/social/youtube?slide=1..5
 * 2. Uses ffmpeg to assemble with crossfade transitions + Ken Burns zoom
 * 3. Overlays background music (royalty-free ambient track from public/)
 * 4. Outputs a 30-second 1080x1920 MP4
 *
 * Requires: ffmpeg on the host. NOT for Vercel serverless.
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync, mkdtempSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';
const SLIDE_COUNT = 5;
const SLIDE_DURATION = 5;       // seconds per slide
const CROSSFADE = 0.8;          // crossfade overlap in seconds
const TOTAL_DURATION = SLIDE_COUNT * SLIDE_DURATION - (SLIDE_COUNT - 1) * CROSSFADE; // ~21s

export interface ShortVideoResult {
  videoBuffer: Buffer;
  title: string;
  description: string;
  tags: string[];
}

/**
 * Generate a cinematic daily panchang YouTube Short.
 */
export async function generateDailyShort(): Promise<ShortVideoResult> {
  const tmp = mkdtempSync(join(tmpdir(), 'yt-short-'));
  const slidePaths: string[] = [];
  const videoPath = join(tmp, 'short.mp4');

  try {
    // ── Step 1: Fetch all 5 slides (with delay to avoid overwhelming Satori) ──
    for (let i = 1; i <= SLIDE_COUNT; i++) {
      const imgPath = join(tmp, `slide${i}.png`);
      const url = `${BASE_URL}/api/social/youtube?slide=${i}`;
      // Small delay between slides to let Satori GC between renders
      if (i > 1) await new Promise(r => setTimeout(r, 1500));
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`[youtube] Slide ${i} fetch failed (${res.status}): ${await res.text()}`);
      }
      writeFileSync(imgPath, Buffer.from(await res.arrayBuffer()));
      slidePaths.push(imgPath);
    }

    // ── Step 2: Build ffmpeg command with crossfade transitions ──
    // Each slide gets a slow Ken Burns zoom, then crossfade to next
    const fps = 30;
    const slideFrames = SLIDE_DURATION * fps; // 150 frames per slide
    const fadeFrames = Math.round(CROSSFADE * fps); // 24 frames crossfade

    // Build filter graph:
    // 1. Each input: loop image, apply zoompan for Ken Burns
    // 2. Chain xfade transitions between consecutive slides
    const inputs = slidePaths.map((p, i) => `-loop 1 -t ${SLIDE_DURATION} -i "${p}"`).join(' ');

    // Zoompan + scale for each input
    const zoompanFilters = slidePaths.map((_, i) => {
      // Smooth zoom with floor() on x/y to prevent sub-pixel jitter
      // Alternate zoom direction for visual variety
      const zoomIn = i % 2 === 0;
      // Slower zoom increment (0.0002 instead of 0.0004) for smoother motion
      const zExpr = zoomIn
        ? `'min(zoom+0.0002,1.04)'`
        : `'if(eq(on,1),1.04,max(zoom-0.0002,1.0))'`;
      // floor() prevents sub-pixel positioning that causes jitter
      return `[${i}:v]zoompan=z=${zExpr}:d=${slideFrames}:x='floor(iw/2-(iw/zoom/2))':y='floor(ih/2-(ih/zoom/2))':s=1080x1920:fps=${fps}[v${i}]`;
    }).join(';\n');

    // Chain xfade transitions
    let xfadeChain = '';
    let lastOutput = 'v0';
    for (let i = 1; i < SLIDE_COUNT; i++) {
      const offset = i * SLIDE_DURATION - i * CROSSFADE;
      const outLabel = i < SLIDE_COUNT - 1 ? `xf${i}` : 'vout';
      // Smooth, elegant transitions only — no jarring effects
      const transitions = ['fade', 'fadeblack', 'fade', 'fadeblack'];
      const transition = transitions[i % transitions.length];
      xfadeChain += `;\n[${lastOutput}][v${i}]xfade=transition=${transition}:duration=${CROSSFADE}:offset=${offset.toFixed(2)}[${outLabel}]`;
      lastOutput = outLabel;
    }

    const filterComplex = `${zoompanFilters}${xfadeChain}`;

    // Check for background music
    const musicPath = join(process.cwd(), 'public', 'audio', 'ambient-short.mp3');
    const hasMusic = existsSync(musicPath);

    // Build full command
    const audioInput = hasMusic ? `-i "${musicPath}"` : '';
    const audioMap = hasMusic
      ? `-map "[vout]" -map ${SLIDE_COUNT}:a -shortest -af "afade=t=in:d=1,afade=t=out:st=${TOTAL_DURATION - 2}:d=2,volume=0.3"`
      : `-map "[vout]"`;

    const ffmpegCmd = [
      `ffmpeg -y`,
      inputs,
      audioInput,
      `-filter_complex "${filterComplex}"`,
      audioMap,
      `-c:v libx264 -preset slow -crf 15 -b:v 8M`,
      `-pix_fmt yuv420p`,
      `-movflags +faststart`,
      `-t ${Math.ceil(TOTAL_DURATION)}`,
      `"${videoPath}"`,
    ].filter(Boolean).join(' ');

    execSync(ffmpegCmd, { stdio: 'pipe', timeout: 120000 });

    const videoBuffer = readFileSync(videoPath);

    // ── Step 3: Build metadata ──
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const dateHi = today.toLocaleDateString('hi-IN', { month: 'long', day: 'numeric', year: 'numeric' });

    return {
      videoBuffer,
      title: `Today's Panchang — ${dateStr} | आज का पंचांग #Shorts`,
      description: [
        `📅 Daily Vedic Panchang for ${dateStr} (${dateHi})`,
        '',
        '✨ Tithi, Nakshatra, Yoga, Karana, Vara',
        '🌅 Sunrise, Sunset, Moonrise, Rahu Kaal',
        '🔮 Nakshatra spotlight with deity & characteristics',
        '',
        `🌐 Full interactive panchang: ${BASE_URL}/en/panchang`,
        `📊 Generate your Kundali: ${BASE_URL}/en/kundali`,
        `🤖 AI Muhurta Scanner: ${BASE_URL}/en/muhurta-ai`,
        '',
        'Computed for Ujjain — the traditional prime meridian of Hindu astronomy (Surya Siddhanta).',
        '',
        '#Panchang #VedicAstrology #Jyotish #HinduCalendar #Tithi #Nakshatra',
        '#RahuKaal #DekhoPanchang #DailyPanchang #Astrology #Shorts',
      ].join('\n'),
      tags: [
        'panchang', 'panchang today', 'aaj ka panchang', 'vedic astrology',
        'jyotish', 'tithi today', 'nakshatra today', 'hindu calendar',
        'rahu kaal today', 'dekho panchang', 'daily panchang',
        'horoscope', 'astrology shorts', 'hindu panchang',
      ],
    };
  } finally {
    // Cleanup temp files
    for (const p of slidePaths) { try { unlinkSync(p); } catch { /* ignore */ } }
    try { unlinkSync(videoPath); } catch { /* ignore */ }
    try { execSync(`rmdir "${tmp}"`); } catch { /* ignore */ }
  }
}
