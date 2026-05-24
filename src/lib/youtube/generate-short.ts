/**
 * YouTube Short video generator  –  cinematic 5-slide panchang Short.
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

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();
const SLIDE_COUNT = 5;
const CROSSFADE = 0.8;          // crossfade overlap in seconds

// ── Audio track rotation — 1 ambient + 7 Nikhil Banerjee sitar ragas ──
const AUDIO_TRACKS = [
  'ambient-short', 'sitar-bhairavi-thumri', 'sitar-puriya-dhanashree',
  'sitar-bhairavi', 'sitar-bageshree', 'sitar-ahir-bhairav',
  'sitar-darbari', 'sitar-megh',
];

// ── Available ffmpeg xfade transitions ──
const TRANSITIONS = ['fade', 'fadeblack', 'fadewhite', 'dissolve', 'wipeleft', 'slideup'];

// ── Seeded PRNG for deterministic daily variation (same day = same output) ──
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

function getDayOfYear(): number {
  return Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
}

export interface ShortVideoResult {
  videoBuffer: Buffer;
  title: string;
  description: string;
  tags: string[];
}

/** Options passed from the caller to vary content each day. */
export interface ShortOptions {
  theme?: string;   // colour palette name for the slide API
  format?: string;  // 'standard' (5 slides) or 'quick-glance' (1 mega-slide)
}

/**
 * Generate a cinematic daily panchang YouTube Short.
 *
 * Randomisation is seeded by day-of-year so the same calendar date always
 * produces identical output (deterministic for debugging), but each day
 * looks different: transitions, zoom, slide duration, audio track, volume.
 */
export async function generateDailyShort(opts: ShortOptions = {}): Promise<ShortVideoResult> {
  const tmp = mkdtempSync(join(tmpdir(), 'yt-short-'));
  const slidePaths: string[] = [];
  const videoPath = join(tmp, 'short.mp4');

  const dayOfYear = getDayOfYear();
  const year = new Date().getFullYear();
  const rand = seededRandom(dayOfYear * 1000 + year);

  // ── Per-day randomised parameters ──
  const theme = opts.theme || ['cosmic', 'sunrise', 'moonlit', 'emerald'][dayOfYear % 4];
  const format = opts.format || (dayOfYear % 5 === 0 ? 'quick-glance' : 'standard');
  const slideCount = format === 'quick-glance' ? 3 : SLIDE_COUNT; // quick-glance: intro + mega + CTA
  const slideDurations = Array.from({ length: slideCount }, () => Math.floor(rand() * 3) + 4); // 4-6s each
  const totalSlideTime = slideDurations.reduce((a, b) => a + b, 0);
  const totalDuration = totalSlideTime - (slideCount - 1) * CROSSFADE;

  // Audio: rotate through tracks by day-of-year
  const trackName = AUDIO_TRACKS[dayOfYear % AUDIO_TRACKS.length];
  const musicVolume = 0.15 + rand() * 0.20; // 0.15–0.35

  try {
    // ── Step 1: Fetch slides ──
    const themeParam = `&theme=${encodeURIComponent(theme)}`;
    if (format === 'quick-glance') {
      // 3 slides: intro, quick-glance mega-slide, CTA
      const slideNums = [1, -1, 5]; // -1 = quick-glance format
      for (let idx = 0; idx < slideNums.length; idx++) {
        const imgPath = join(tmp, `slide${idx + 1}.png`);
        const sn = slideNums[idx];
        const url = sn === -1
          ? `${BASE_URL}/api/social/youtube?slide=1&format=quick-glance${themeParam}`
          : `${BASE_URL}/api/social/youtube?slide=${sn}${themeParam}`;
        if (idx > 0) await new Promise(r => setTimeout(r, 1500));
        const res = await fetch(url);
        if (!res.ok) throw new Error(`[youtube] Slide ${idx + 1} fetch failed (${res.status}): ${await res.text()}`);
        writeFileSync(imgPath, Buffer.from(await res.arrayBuffer()));
        slidePaths.push(imgPath);
      }
    } else {
      for (let i = 1; i <= slideCount; i++) {
        const imgPath = join(tmp, `slide${i}.png`);
        const url = `${BASE_URL}/api/social/youtube?slide=${i}${themeParam}`;
        if (i > 1) await new Promise(r => setTimeout(r, 1500));
        const res = await fetch(url);
        if (!res.ok) throw new Error(`[youtube] Slide ${i} fetch failed (${res.status}): ${await res.text()}`);
        writeFileSync(imgPath, Buffer.from(await res.arrayBuffer()));
        slidePaths.push(imgPath);
      }
    }

    // ── Step 2: Build ffmpeg command ──
    const fps = 30;

    const inputs = slidePaths.map((p, i) => `-loop 1 -t ${slideDurations[i]} -i "${p}"`).join(' ');

    // Zoompan with randomised zoom direction and speed per slide
    const zoompanFilters = slidePaths.map((_, i) => {
      const slideFrames = slideDurations[i] * fps;
      const zoomIn = rand() > 0.5;
      // Random zoom speed between 0.0001 and 0.0003
      const zoomSpeed = (0.0001 + rand() * 0.0002).toFixed(5);
      const zExpr = zoomIn
        ? `'min(zoom+${zoomSpeed},1.04)'`
        : `'if(eq(on,1),1.04,max(zoom-${zoomSpeed},1.0))'`;
      return `[${i}:v]zoompan=z=${zExpr}:d=${slideFrames}:x='floor(iw/2-(iw/zoom/2))':y='floor(ih/2-(ih/zoom/2))':s=1080x1920:fps=${fps}[v${i}]`;
    }).join(';\n');

    // Chain xfade transitions — random transition type per boundary
    let xfadeChain = '';
    let lastOutput = 'v0';
    let cumulativeOffset = 0;
    for (let i = 1; i < slideCount; i++) {
      cumulativeOffset += slideDurations[i - 1] - CROSSFADE;
      const outLabel = i < slideCount - 1 ? `xf${i}` : 'vout';
      const transition = TRANSITIONS[Math.floor(rand() * TRANSITIONS.length)];
      xfadeChain += `;\n[${lastOutput}][v${i}]xfade=transition=${transition}:duration=${CROSSFADE}:offset=${cumulativeOffset.toFixed(2)}[${outLabel}]`;
      lastOutput = outLabel;
    }

    const filterComplex = `${zoompanFilters}${xfadeChain}`;

    // Check for background music — try day-specific track first, fall back to ambient-short
    let musicPath = join(process.cwd(), 'public', 'audio', `${trackName}.mp3`);
    if (!existsSync(musicPath)) {
      musicPath = join(process.cwd(), 'public', 'audio', 'ambient-short.mp3');
    }
    const hasMusic = existsSync(musicPath);

    const audioInput = hasMusic ? `-i "${musicPath}"` : '';
    const audioMap = hasMusic
      ? `-map "[vout]" -map ${slideCount}:a -shortest -af "afade=t=in:d=1,afade=t=out:st=${Math.max(totalDuration - 2, 1)}:d=2,volume=${musicVolume.toFixed(2)}"`
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
      `-t ${Math.ceil(totalDuration)}`,
      `"${videoPath}"`,
    ].filter(Boolean).join(' ');

    console.log(`[youtube] Theme: ${theme}, Format: ${format}, Audio: ${trackName}, Volume: ${musicVolume.toFixed(2)}`);
    console.log(`[youtube] Slide durations: [${slideDurations.join(', ')}]s, Total: ${totalDuration.toFixed(1)}s`);

    execSync(ffmpegCmd, { stdio: 'pipe', timeout: 120000 });

    const videoBuffer = readFileSync(videoPath);

    // ── Step 3: Build metadata (title/description/tags generated in caller) ──
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const dateHi = today.toLocaleDateString('hi-IN', { month: 'long', day: 'numeric', year: 'numeric' });

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    // P2-2 — getUTCDay() so the weekday in the YT video metadata doesn't
    // depend on the server's local timezone. The cron fires on a UTC
    // schedule, so UTC is the right ground-truth here. (0 = Sunday.)
    const dayName = dayNames[today.getUTCDay()];

    return {
      videoBuffer,
      // RULE: "Today" in title = 2-3x more views. Always include "Today" or "आज" + date.
      title: `Panchang Today ${dateStr} — आज का पंचांग | तिथि नक्षत्र राहु काल #Shorts`,
      description: [
        `📅 Full Panchang for ${dateStr}: ${BASE_URL}/en/panchang`,
        `📅 आज का पंचांग (${dateHi}): ${BASE_URL}/hi/panchang`,
        '',
        '✨ Tithi, Nakshatra, Yoga, Karana, Vara',
        '🌅 Sunrise, Sunset, Moonrise, Rahu Kaal',
        '🔮 Nakshatra spotlight with deity & characteristics',
        '',
        `📊 Generate your Kundali FREE: ${BASE_URL}/en/kundali`,
        `🤖 AI Muhurta Scanner: ${BASE_URL}/en/muhurta-ai`,
        `📱 Rahu Kaal Today: ${BASE_URL}/en/rahu-kaal`,
        `📅 Festival Calendar: ${BASE_URL}/en/calendar`,
        '',
        'Computed for Ujjain  –  the traditional prime meridian of Hindu astronomy (Surya Siddhanta).',
        'Swiss Ephemeris precision  –  not approximations.',
        '',
        '🌍 Available in 7 languages: English, हिन्दी, தமிழ், తెలుగు, বাংলা, ગુજરાતી, ಕನ್ನಡ',
        `🌐 Website: ${BASE_URL}`,
        '',
        '#Panchang #VedicAstrology #Jyotish #HinduCalendar #Tithi #Nakshatra',
        '#RahuKaal #DekhoPanchang #DailyPanchang #Astrology #Shorts',
        '#पंचांग #राशिफल #ज्योतिष #तिथि #नक्षत्र #राहुकाल',
        '#పంచాంగం #ராசிபலன் #পঞ্চাঙ্গ #પંચાંગ #ಪಂಚಾಂಗ',
      ].join('\n'),
      tags: [
        'panchang', 'panchang today', 'aaj ka panchang',
        'daily panchang', 'vedic astrology', 'jyotish',
        'rahu kaal', 'rahu kaal today',
        'tithi today', 'nakshatra today',
        'hindu calendar', 'horoscope', 'rashifal',
        'kundali', 'dekho panchang',
        `panchang ${dayName}`,
        'astrology shorts',
      ],
    };
  } finally {
    // Cleanup temp files
    for (const p of slidePaths) { try { unlinkSync(p); } catch { /* ignore cleanup */ } }
    try { unlinkSync(videoPath); } catch { /* ignore cleanup */ }
    try { execSync(`rmdir "${tmp}"`); } catch { /* ignore cleanup */ }
  }
}
