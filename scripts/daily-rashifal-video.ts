/**
 * Daily Rashifal Video Generator
 *
 * Generates a ~2 minute Hindi panchang + rashifal video with voiceover,
 * using stock video clips as backgrounds for each segment.
 *
 * Architecture:
 *   1. Compute today's panchang (Ujjain) + 12 rashi horoscopes
 *   2. Generate Hindi voiceover script
 *   3. Generate voiceover via edge-tts (Python CLI, free)
 *   4. Parse VTT subtitles to get exact segment timings
 *   5. Build video segments from stock clips + text overlays via ffmpeg
 *   6. Concatenate segments + mux voiceover audio
 *   7. Optionally upload to YouTube
 *
 * Stock clips expected in scripts/video-assets/rashi-clips/:
 *   intro.mp4, mesh.mp4, vrishabh.mp4, ..., meen.mp4, outro.mp4
 *
 * Usage:
 *   npx tsx scripts/daily-rashifal-video.ts                 # today
 *   npx tsx scripts/daily-rashifal-video.ts 2026-05-04      # specific date
 *   npx tsx scripts/daily-rashifal-video.ts --upload         # generate + upload
 *   npx tsx scripts/daily-rashifal-video.ts 2026-05-04 --upload
 *
 * Prerequisites:
 *   - Python 3 with edge-tts: `pip install edge-tts`
 *   - ffmpeg in PATH (with drawtext filter support)
 *   - For upload: YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN in .env.local
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { computePanchang, type PanchangInput } from '../src/lib/ephem/panchang-calc';
import { generateDailyHoroscope, type DailyHoroscope } from '../src/lib/horoscope/daily-engine';
import { RASHIS } from '../src/lib/constants/rashis';
import { getUTCOffsetForDate } from '../src/lib/utils/timezone';

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────
const UJJAIN = { lat: 23.18, lng: 75.79, tz: 'Asia/Kolkata', name: 'Ujjain' };
const VOICE = 'hi-IN-MadhurNeural'; // Male Hindi voice (Edge TTS, free)
const VIDEO_WIDTH = 1080;
const VIDEO_HEIGHT = 1920; // Shorts / portrait format
const OUTPUT_DIR = path.resolve(__dirname, 'video-assets');
const CLIPS_DIR = path.join(OUTPUT_DIR, 'rashi-clips');

// Devanagari font for ffmpeg drawtext — macOS system font
// Kohinoor Devanagari is bundled with macOS and renders Hindi cleanly
const DEVANAGARI_FONT = '/System/Library/Fonts/Kohinoor.ttc';

// Hindi day names — 0=Sunday per Date.getDay()
const HINDI_DAYS: Record<number, string> = {
  0: 'Ravivaar', 1: 'Somvaar', 2: 'Mangalvaar',
  3: 'Budhvaar', 4: 'Guruvaar', 5: 'Shukravaar', 6: 'Shanivaar',
};

// Hindi month names
const HINDI_MONTHS: Record<number, string> = {
  1: 'Janvari', 2: 'Farvari', 3: 'March', 4: 'April',
  5: 'Mai', 6: 'June', 7: 'July', 8: 'August',
  9: 'September', 10: 'October', 11: 'November', 12: 'December',
};

// Rashi names in spoken Hindi (romanised for TTS clarity)
const RASHI_SPOKEN: Record<number, string> = {
  1: 'Mesh', 2: 'Vrishabh', 3: 'Mithun', 4: 'Kark',
  5: 'Simha', 6: 'Kanya', 7: 'Tula', 8: 'Vrishchik',
  9: 'Dhanu', 10: 'Makar', 11: 'Kumbh', 12: 'Meen',
};

// Rashi display names — Devanagari + romanised for on-screen text
const RASHI_DISPLAY: Record<number, string> = {
  1: 'मेष | MESH', 2: 'वृषभ | VRISHABH', 3: 'मिथुन | MITHUN', 4: 'कर्क | KARK',
  5: 'सिंह | SIMHA', 6: 'कन्या | KANYA', 7: 'तुला | TULA', 8: 'वृश्चिक | VRISHCHIK',
  9: 'धनु | DHANU', 10: 'मकर | MAKAR', 11: 'कुम्भ | KUMBH', 12: 'मीन | MEEN',
};

// Map rashi ID to stock clip filename (without extension)
const RASHI_CLIP_FILE: Record<number, string> = {
  1: 'mesh', 2: 'vrishabh', 3: 'mithun', 4: 'kark',
  5: 'simha', 6: 'kanya', 7: 'tula', 8: 'vrishchik',
  9: 'dhanu', 10: 'makar', 11: 'kumbh', 12: 'meen',
};

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface VTTCue {
  index: number;
  startSec: number;
  endSec: number;
  text: string;
}

interface VideoSegment {
  id: string;
  clipPath: string;       // stock clip to use
  startSec: number;       // start time in overall timeline
  endSec: number;         // end time in overall timeline
  durationSec: number;    // segment duration
  overlayTexts: Array<{   // text overlays to draw
    text: string;
    x: string;            // ffmpeg expression (e.g., '(w-tw)/2')
    y: string;            // ffmpeg expression
    fontSize: number;
    fontColor: string;    // hex like '0xd4a853'
    font?: string;        // font path override
  }>;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function parseDate(input?: string): { year: number; month: number; day: number } {
  if (input && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = input.split('-').map(Number);
    return { year: y, month: m, day: d };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

function formatHindiDate(year: number, month: number, day: number): string {
  const d = new Date(year, month - 1, day);
  const dayName = HINDI_DAYS[d.getDay()] || 'Somvaar';
  const monthName = HINDI_MONTHS[month] || 'January';
  return `${dayName}, ${day} ${monthName} ${year}`;
}

/** Pick the single most relevant Hindi area prediction for a rashi */
function pickRashiPrediction(h: DailyHoroscope): string {
  const areas = [
    { key: 'career' as const, label: 'Kaam kaaj', data: h.areas.career },
    { key: 'finance' as const, label: 'Dhan', data: h.areas.finance },
    { key: 'love' as const, label: 'Prem', data: h.areas.love },
    { key: 'health' as const, label: 'Swasthya', data: h.areas.health },
    { key: 'spirituality' as const, label: 'Adhyatm', data: h.areas.spirituality },
  ];

  // Pick the most actionable area: highest deviation from 5.5
  let best = areas[0];
  let maxDev = 0;
  for (const a of areas) {
    const dev = Math.abs(a.data.score - 5.5);
    if (dev > maxDev) {
      maxDev = dev;
      best = a;
    }
  }

  return best.data.text.hi || best.data.text.en;
}

/** Build the complete Hindi voiceover script */
function buildScript(
  panchang: ReturnType<typeof computePanchang>,
  horoscopes: DailyHoroscope[],
  year: number, month: number, day: number,
): string {
  const dateStr = formatHindiDate(year, month, day);
  const tithiName = panchang.tithi.name.hi || panchang.tithi.name.en;
  const nakshatraName = panchang.nakshatra.name.hi || panchang.nakshatra.name.en;
  const yogaName = panchang.yoga.name.hi || panchang.yoga.name.en;
  const rahuStart = panchang.rahuKaal.start;
  const rahuEnd = panchang.rahuKaal.end;
  const abhijitStart = panchang.abhijitMuhurta.start;
  const abhijitEnd = panchang.abhijitMuhurta.end;

  const lines: string[] = [];

  // INTRO (~4 sec)
  lines.push(`Namaste! Aaj ka panchang aur rashifal, ${dateStr}.`);

  // PANCHANG (~10 sec)
  lines.push(`Aaj ${tithiName} tithi, ${nakshatraName} nakshatra, ${yogaName} yoga.`);
  lines.push(`Rahu Kaal ${rahuStart} se ${rahuEnd}.`);
  if (panchang.abhijitMuhurta.available !== false) {
    lines.push(`Abhijit Muhurat ${abhijitStart} se ${abhijitEnd}.`);
  }

  // 12 RASHIFAL (~6 sec each = ~72 sec)
  lines.push('Ab barah rashiyon ka rashifal.');

  for (let i = 1; i <= 12; i++) {
    const h = horoscopes[i - 1];
    const rashiName = RASHI_SPOKEN[i];
    const prediction = pickRashiPrediction(h);
    lines.push(`${rashiName}. ${prediction}`);
  }

  // OUTRO (~4 sec)
  lines.push('Jai Shree Ram! Sampurn panchang Dekho Panchang dot com par dekhein.');

  return lines.join('\n');
}

/** Build SRT subtitle file from the script sections */
function buildSRT(
  panchang: ReturnType<typeof computePanchang>,
  horoscopes: DailyHoroscope[],
  year: number, month: number, day: number,
): string {
  const subs: { idx: number; start: string; end: string; text: string }[] = [];
  let idx = 1;

  const dateStr = formatHindiDate(year, month, day);
  const tithiHi = panchang.tithi.name.hi || panchang.tithi.name.en;
  const nakHi = panchang.nakshatra.name.hi || panchang.nakshatra.name.en;
  const yogaHi = panchang.yoga.name.hi || panchang.yoga.name.en;

  const ts = (sec: number): string => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.round((sec % 1) * 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  };

  let t = 0;

  // Intro
  subs.push({ idx: idx++, start: ts(t), end: ts(t + 5), text: `Namaste!\n${dateStr}` });
  t += 5;

  // Panchang
  subs.push({ idx: idx++, start: ts(t), end: ts(t + 6), text: `${tithiHi} | ${nakHi}\n${yogaHi}` });
  t += 6;

  subs.push({
    idx: idx++, start: ts(t), end: ts(t + 5),
    text: `Rahu Kaal: ${panchang.rahuKaal.start}-${panchang.rahuKaal.end}\nAbhijit: ${panchang.abhijitMuhurta.start}-${panchang.abhijitMuhurta.end}`,
  });
  t += 6;

  // 12 Rashis (~8 sec each)
  for (let i = 1; i <= 12; i++) {
    const h = horoscopes[i - 1];
    const rashiHi = RASHIS[i - 1].name.hi;
    const prediction = pickRashiPrediction(h);
    const score = h.overallScore;
    const stars = score >= 7 ? '***' : score >= 5 ? '**' : '*';

    subs.push({
      idx: idx++,
      start: ts(t),
      end: ts(t + 8),
      text: `${rashiHi} ${stars}\n${prediction}`,
    });
    t += 8;
  }

  // Outro
  subs.push({ idx: idx++, start: ts(t), end: ts(t + 5), text: 'dekhopanchang.com' });

  return subs.map(s => `${s.idx}\n${s.start} --> ${s.end}\n${s.text}\n`).join('\n');
}

// ─────────────────────────────────────────────────────────────
// VTT Parser — extracts precise segment boundaries from TTS
// ─────────────────────────────────────────────────────────────

/** Parse VTT timestamp "HH:MM:SS,mmm" or "HH:MM:SS.mmm" to seconds */
function parseTimestamp(ts: string): number {
  // VTT uses "." and SRT uses "," for milliseconds
  const normalised = ts.replace(',', '.');
  const parts = normalised.split(':');
  if (parts.length !== 3) return 0;
  const [h, m, rest] = parts;
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(rest);
}

/** Parse VTT file into cues */
function parseVTT(vttContent: string): VTTCue[] {
  const cues: VTTCue[] = [];
  // VTT format: index\nstart --> end\ntext\n\n
  const blocks = vttContent.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 3) continue;

    const index = parseInt(lines[0]);
    if (isNaN(index)) continue;

    const timeLine = lines[1];
    const timeMatch = timeLine.match(/(\d[\d:.,]+)\s*-->\s*(\d[\d:.,]+)/);
    if (!timeMatch) continue;

    const startSec = parseTimestamp(timeMatch[1]);
    const endSec = parseTimestamp(timeMatch[2]);
    const text = lines.slice(2).join('\n');

    cues.push({ index, startSec, endSec, text });
  }

  return cues;
}

/**
 * Find segment boundaries from VTT cues.
 *
 * The VTT from edge-tts has entries like:
 *   "Namaste!" → intro start
 *   "Mesh." → rashi 1 start
 *   "Vrishabh." → rashi 2 start
 *   ...
 *   "Jai Shree Ram!" → outro start
 *
 * We find the cue that contains each rashi spoken name to determine its start time.
 * The end time is the start of the next segment.
 */
interface SegmentTiming {
  id: string;
  startSec: number;
  endSec: number;
}

function extractSegmentTimings(cues: VTTCue[], totalDuration: number): SegmentTiming[] {
  const timings: SegmentTiming[] = [];

  // Find intro: from start to the cue containing the first rashi name
  // Find each rashi: cue containing "Mesh.", "Vrishabh.", etc.
  // Find outro: cue containing "Jai Shree Ram"

  const rashiOrder = [
    'Mesh', 'Vrishabh', 'Mithun', 'Kark', 'Simha', 'Kanya',
    'Tula', 'Vrishchik', 'Dhanu', 'Makar', 'Kumbh', 'Meen',
  ];

  // Find the cue index for each rashi name mention
  const rashiStarts: { name: string; startSec: number }[] = [];
  for (const rashiName of rashiOrder) {
    // Look for a cue whose text is just the rashi name (e.g., "Mesh.")
    const cue = cues.find(c => {
      const trimmed = c.text.trim();
      return trimmed === `${rashiName}.` || trimmed === rashiName;
    });
    if (cue) {
      rashiStarts.push({ name: rashiName, startSec: cue.startSec });
    }
  }

  // Find outro start: cue containing "Jai Shree Ram"
  const outroCue = cues.find(c => c.text.includes('Jai Shree Ram'));
  const outroStart = outroCue ? outroCue.startSec : totalDuration - 5;

  // Build segment list
  if (rashiStarts.length > 0) {
    // Intro: 0 to first rashi
    timings.push({
      id: 'intro',
      startSec: 0,
      endSec: rashiStarts[0].startSec,
    });

    // Each rashi: from its start to the next rashi's start (or outro)
    for (let i = 0; i < rashiStarts.length; i++) {
      const nextStart = i < rashiStarts.length - 1
        ? rashiStarts[i + 1].startSec
        : outroStart;

      timings.push({
        id: rashiStarts[i].name.toLowerCase(),
        startSec: rashiStarts[i].startSec,
        endSec: nextStart,
      });
    }

    // Outro: from outro start to end
    timings.push({
      id: 'outro',
      startSec: outroStart,
      endSec: totalDuration,
    });
  } else {
    // Fallback: no VTT parsing worked, use estimated timings
    console.warn('[timing] Could not parse VTT rashi boundaries, using estimates');
    let t = 0;
    const introDur = 17;
    timings.push({ id: 'intro', startSec: t, endSec: t + introDur });
    t += introDur;

    const rashiDur = (totalDuration - introDur - 7) / 12;
    for (const name of rashiOrder) {
      timings.push({ id: name.toLowerCase(), startSec: t, endSec: t + rashiDur });
      t += rashiDur;
    }

    timings.push({ id: 'outro', startSec: t, endSec: totalDuration });
  }

  return timings;
}

// ─────────────────────────────────────────────────────────────
// Video Segment Builder
// ─────────────────────────────────────────────────────────────

/** Escape text for ffmpeg drawtext filter — colons, backslashes, quotes */
function escapeDrawtext(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/%/g, '%%');
}

/** Build the ffmpeg filter chain for a single segment with dark overlay + text */
function buildSegmentFilter(
  segment: VideoSegment,
): string {
  const filters: string[] = [];

  // 1. Scale/crop source clip to 1080x1920 portrait
  //    Most clips are 720x1280 — scale up to 1080x1920, cropping if aspect ratio differs
  filters.push(
    `scale=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:force_original_aspect_ratio=increase`,
    `crop=${VIDEO_WIDTH}:${VIDEO_HEIGHT}`,
  );

  // 2. Darken the footage heavily so gold/white text is always readable.
  //    Use eq filter for brightness reduction (more effective than colorlevels
  //    on bright outdoor clips like mesh ram, vrishabh bull, simha lion).
  //    The stock footage serves as atmospheric backdrop, not the focal point.
  filters.push('eq=brightness=-0.15:saturation=0.6');

  // 3. Full-frame dark overlay via drawbox, then extra-dark bands at edges
  filters.push(
    // Full-frame dim
    `drawbox=x=0:y=0:w=${VIDEO_WIDTH}:h=${VIDEO_HEIGHT}:color=black@0.55:t=fill`,
    // Extra-dark band at top for rashi name + score
    `drawbox=x=0:y=0:w=${VIDEO_WIDTH}:h=420:color=black@0.4:t=fill`,
    // Extra-dark band at bottom for prediction text
    `drawbox=x=0:y=${VIDEO_HEIGHT - 600}:w=${VIDEO_WIDTH}:h=600:color=black@0.4:t=fill`,
  );

  // 4. Draw text overlays
  for (const overlay of segment.overlayTexts) {
    const escapedText = escapeDrawtext(overlay.text);
    const fontPath = overlay.font || DEVANAGARI_FONT;
    filters.push(
      `drawtext=text='${escapedText}':fontfile='${fontPath}':fontsize=${overlay.fontSize}:fontcolor=${overlay.fontColor}:x=${overlay.x}:y=${overlay.y}:borderw=3:bordercolor=black@0.9:shadowcolor=black@0.5:shadowx=2:shadowy=2`,
    );
  }

  return filters.join(',');
}

/** Create a single video segment file (trimmed clip + overlays, no audio) */
function createSegment(
  segment: VideoSegment,
  outputPath: string,
): void {
  const duration = segment.durationSec;
  const filter = buildSegmentFilter(segment);

  // Use -stream_loop to loop short clips if they're shorter than the segment
  // -t trims to exact duration needed
  const cmd = [
    'ffmpeg', '-y',
    '-stream_loop', '-1',           // loop clip if shorter than duration
    '-i', `"${segment.clipPath}"`,
    '-t', duration.toFixed(3),
    '-vf', `"${filter}"`,
    '-an',                           // no audio (will add voiceover later)
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-pix_fmt', 'yuv420p',
    '-r', '30',                      // consistent frame rate
    `"${outputPath}"`,
  ].join(' ');

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 120_000 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? (err as { stderr?: Buffer }).stderr?.toString() || err.message : String(err);
    console.error(`[ffmpeg] Segment ${segment.id} failed:`, msg.slice(0, 500));
    throw new Error(`Failed to create segment: ${segment.id}`);
  }
}

/** Generate score display — plain ASCII, no Unicode stars (ffmpeg font compat) */
function scoreDisplay(score: number): string {
  const rounded = Math.round(score * 10) / 10;
  // Simple bar: filled blocks for score out of 10
  const filled = Math.round(rounded);
  const bar = '|'.repeat(filled) + '.'.repeat(10 - filled);
  return `${rounded}/10  [${bar}]`;
}

/** Build all video segments from timing data */
function buildVideoSegments(
  timings: SegmentTiming[],
  panchang: ReturnType<typeof computePanchang>,
  horoscopes: DailyHoroscope[],
  year: number, month: number, day: number,
): VideoSegment[] {
  const segments: VideoSegment[] = [];
  const dateStr = formatHindiDate(year, month, day);
  const tithiHi = panchang.tithi.name.hi || panchang.tithi.name.en;
  const nakHi = panchang.nakshatra.name.hi || panchang.nakshatra.name.en;
  const yogaHi = panchang.yoga.name.hi || panchang.yoga.name.en;

  for (const timing of timings) {
    const duration = timing.endSec - timing.startSec;

    // Panchang intro: cycle through atmospheric clips (planets, sunrise, moon, stars)
    // instead of a single static 'intro.mp4'
    const PANCHANG_CLIPS = ['planets', 'sunrise', 'moon-phases', 'stars', 'shiva', 'vedic', 'astrology', 'diya-lamp'];
    const panchangClipForIntro = (): string => {
      // Pick a clip based on the day of month for variety
      const clipName = PANCHANG_CLIPS[day % PANCHANG_CLIPS.length];
      const clipPath = path.join(CLIPS_DIR, clipName + '.mp4');
      return fs.existsSync(clipPath) ? clipPath : path.join(CLIPS_DIR, 'intro.mp4');
    };

    if (timing.id === 'intro') {
      segments.push({
        id: 'intro',
        clipPath: panchangClipForIntro(),
        startSec: timing.startSec,
        endSec: timing.endSec,
        durationSec: duration,
        overlayTexts: [
          // Branding at top
          {
            text: 'DEKHO PANCHANG',
            x: '(w-tw)/2', y: '120',
            fontSize: 48, fontColor: '0xd4a853',
          },
          // Date
          {
            text: dateStr,
            x: '(w-tw)/2', y: '220',
            fontSize: 44, fontColor: '0xf0d48a',
            font: DEVANAGARI_FONT,
          },
          // Decorative divider — plain ASCII for font compatibility
          {
            text: '------  *  ------',
            x: '(w-tw)/2', y: '300',
            fontSize: 32, fontColor: '0x8a6d2b',
          },
          // Tithi + Nakshatra
          {
            text: `${tithiHi}  |  ${nakHi}`,
            x: '(w-tw)/2', y: '780',
            fontSize: 42, fontColor: '0xf0d48a',
            font: DEVANAGARI_FONT,
          },
          // Yoga
          {
            text: yogaHi,
            x: '(w-tw)/2', y: '860',
            fontSize: 38, fontColor: '0xe6e2d8',
            font: DEVANAGARI_FONT,
          },
          // Rahu Kaal
          {
            text: `Rahu Kaal  ${panchang.rahuKaal.start} - ${panchang.rahuKaal.end}`,
            x: '(w-tw)/2', y: '980',
            fontSize: 34, fontColor: '0xff6b6b',
          },
          // Abhijit Muhurta
          {
            text: `Abhijit  ${panchang.abhijitMuhurta.start} - ${panchang.abhijitMuhurta.end}`,
            x: '(w-tw)/2', y: '1050',
            fontSize: 34, fontColor: '0x4ecdc4',
          },
          // Bottom branding
          {
            text: 'dekhopanchang.com',
            x: '(w-tw)/2', y: `${VIDEO_HEIGHT - 120}`,
            fontSize: 28, fontColor: '0x8a6d2b',
          },
        ],
      });
    } else if (timing.id === 'outro') {
      // Outro: use diya/temple clip, fall back to outro.mp4
      const outroClip = fs.existsSync(path.join(CLIPS_DIR, 'diya-lamp.mp4'))
        ? path.join(CLIPS_DIR, 'diya-lamp.mp4')
        : path.join(CLIPS_DIR, 'outro.mp4');
      segments.push({
        id: 'outro',
        clipPath: outroClip,
        startSec: timing.startSec,
        endSec: timing.endSec,
        durationSec: duration,
        overlayTexts: [
          {
            text: 'DEKHO PANCHANG',
            x: '(w-tw)/2', y: '700',
            fontSize: 64, fontColor: '0xd4a853',
          },
          {
            text: 'dekhopanchang.com',
            x: '(w-tw)/2', y: '800',
            fontSize: 36, fontColor: '0xf0d48a',
          },
          {
            text: 'Subscribe for daily rashifal',
            x: '(w-tw)/2', y: '900',
            fontSize: 30, fontColor: '0xe6e2d8',
          },
          {
            text: 'Jai Shree Ram',
            x: '(w-tw)/2', y: '1050',
            fontSize: 42, fontColor: '0xd4a853',
            font: DEVANAGARI_FONT,
          },
        ],
      });
    } else {
      // Rashi segment — find the rashi ID
      const rashiEntry = Object.entries(RASHI_CLIP_FILE).find(([, v]) => v === timing.id);
      if (!rashiEntry) {
        console.warn(`[segment] Unknown rashi segment: ${timing.id}, skipping`);
        continue;
      }
      const rashiId = parseInt(rashiEntry[0]);
      const horoscope = horoscopes[rashiId - 1];
      const clipFile = path.join(CLIPS_DIR, `${timing.id}.mp4`);
      const displayName = RASHI_DISPLAY[rashiId];
      const score = horoscope.overallScore;
      const prediction = pickRashiPrediction(horoscope);

      // Word-wrap prediction text for on-screen display (~30 chars per line)
      const wrappedPrediction = wordWrap(prediction, 28);

      segments.push({
        id: timing.id,
        clipPath: clipFile,
        startSec: timing.startSec,
        endSec: timing.endSec,
        durationSec: duration,
        overlayTexts: [
          // Rashi name — large gold text at top
          {
            text: displayName,
            x: '(w-tw)/2', y: '200',
            fontSize: 56, fontColor: '0xd4a853',
            font: DEVANAGARI_FONT,
          },
          // Score
          {
            text: scoreDisplay(score),
            x: '(w-tw)/2', y: '300',
            fontSize: 42, fontColor: score >= 7 ? '0x4ecdc4' : score >= 5 ? '0xf0d48a' : '0xff6b6b',
            font: DEVANAGARI_FONT,
          },
          // Prediction text — bottom third, wrapped across multiple drawtext entries
          ...wrappedPrediction.map((line, lineIdx) => ({
            text: line,
            x: '(w-tw)/2',
            y: `${VIDEO_HEIGHT - 450 + lineIdx * 65}`,
            fontSize: 36,
            fontColor: '0xe6e2d8',
            font: DEVANAGARI_FONT,
          })),
          // Small branding at very bottom
          {
            text: 'dekhopanchang.com',
            x: '(w-tw)/2', y: `${VIDEO_HEIGHT - 100}`,
            fontSize: 22, fontColor: '0x8a6d2b',
          },
        ],
      });
    }
  }

  return segments;
}

/** Word-wrap text to a given character width. Handles Hindi (no simple word boundary). */
function wordWrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxChars && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Limit to 4 lines max to avoid text overflow
  return lines.slice(0, 4);
}

// ─────────────────────────────────────────────────────────────
// TTS + Audio
// ─────────────────────────────────────────────────────────────

/** Generate voiceover MP3 via edge-tts (Python CLI) */
function generateVoiceover(scriptText: string, outputPath: string): void {
  console.log('[tts] Generating voiceover with Edge TTS...');

  const tmpScript = path.join(OUTPUT_DIR, 'tts-script.txt');
  fs.writeFileSync(tmpScript, scriptText, 'utf-8');

  const vttPath = outputPath.replace(/\.mp3$/, '.vtt');

  try {
    execSync(
      `python3 -m edge_tts --voice "${VOICE}" --rate="-5%" --file "${tmpScript}" --write-media "${outputPath}" --write-subtitles "${vttPath}"`,
      { stdio: 'pipe', timeout: 120_000 },
    );
    console.log('[tts] Voiceover generated:', outputPath);
    if (fs.existsSync(vttPath)) {
      console.log('[tts] TTS subtitles generated:', vttPath);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[tts] edge-tts failed:', msg);
    console.error('[tts] Ensure edge-tts is installed: pip install edge-tts');
    process.exit(1);
  } finally {
    if (fs.existsSync(tmpScript)) fs.unlinkSync(tmpScript);
  }
}

/** Get audio duration in seconds via ffprobe */
function getAudioDuration(audioPath: string): number {
  try {
    const result = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`,
      { encoding: 'utf-8' },
    ).trim();
    return parseFloat(result);
  } catch {
    console.error('[ffprobe] Failed to get audio duration, defaulting to 120s');
    return 120;
  }
}

// ─────────────────────────────────────────────────────────────
// Final Assembly — concat segments + mux audio
// ─────────────────────────────────────────────────────────────

/** Concatenate segment files and mux with voiceover */
function assembleVideo(
  segmentPaths: string[],
  voicePath: string,
  srtPath: string,
  outputPath: string,
  totalDuration: number,
): void {
  console.log('[ffmpeg] Assembling final video from segments...');

  // Write concat list
  const concatListPath = path.join(OUTPUT_DIR, 'concat-list.txt');
  const concatContent = segmentPaths
    .map(p => `file '${p}'`)
    .join('\n');
  fs.writeFileSync(concatListPath, concatContent, 'utf-8');

  // Prefer VTT subtitles from TTS (word-level timing) over estimated SRT
  const vttPath = voicePath.replace(/\.mp3$/, '.vtt');
  const subFile = fs.existsSync(vttPath) ? vttPath : srtPath;
  console.log(`[ffmpeg] Using subtitle file: ${path.basename(subFile)}`);

  // Step 1: Concatenate all video segments into one silent video
  const silentVideoPath = path.join(OUTPUT_DIR, 'concat-silent.mp4');
  const concatCmd = [
    'ffmpeg', '-y',
    '-f', 'concat', '-safe', '0',
    '-i', `"${concatListPath}"`,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '22',
    '-pix_fmt', 'yuv420p',
    '-r', '30',
    '-an',
    `"${silentVideoPath}"`,
  ].join(' ');

  try {
    execSync(concatCmd, { stdio: 'pipe', timeout: 300_000 });
    console.log('[ffmpeg] Concatenated segments');
  } catch (err: unknown) {
    const msg = err instanceof Error ? (err as { stderr?: Buffer }).stderr?.toString() || err.message : String(err);
    console.error('[ffmpeg] Concat failed:', msg.slice(0, 500));
    throw new Error('Failed to concatenate video segments');
  }

  // Step 2: Mux audio + burn subtitles
  // Position subtitles in the middle band (between top overlay and bottom overlay)
  // MarginV=550 pushes text up from bottom to avoid overlap with drawtext prediction text
  // Alignment=2 = bottom-centre (SSA convention)
  const subtitleFilter = [
    `subtitles=${subFile.replace(/'/g, "\\'")}`,
    `force_style='FontName=Kohinoor Devanagari,FontSize=20,PrimaryColour=&H00D4E6E6,OutlineColour=&HC0000000,BorderStyle=3,Outline=2,MarginV=550,Alignment=2,BackColour=&HA0000000'`,
  ].join(':');

  const muxCmd = [
    'ffmpeg', '-y',
    '-i', `"${silentVideoPath}"`,
    '-i', `"${voicePath}"`,
    '-vf', `"${subtitleFilter}"`,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '20',
    '-c:a', 'aac', '-b:a', '192k',
    '-pix_fmt', 'yuv420p',
    '-shortest',
    '-t', String(Math.ceil(totalDuration) + 1),
    '-movflags', '+faststart',
    `"${outputPath}"`,
  ].join(' ');

  try {
    execSync(muxCmd, { stdio: 'pipe', timeout: 300_000 });
    console.log('[ffmpeg] Final video with subtitles:', outputPath);
  } catch {
    // Subtitle burn may fail if font not found — retry without subtitles
    console.warn('[ffmpeg] Subtitle burn failed, retrying without subtitles...');
    const fallbackCmd = [
      'ffmpeg', '-y',
      '-i', `"${silentVideoPath}"`,
      '-i', `"${voicePath}"`,
      '-c:v', 'copy',
      '-c:a', 'aac', '-b:a', '192k',
      '-shortest',
      '-t', String(Math.ceil(totalDuration) + 1),
      '-movflags', '+faststart',
      `"${outputPath}"`,
    ].join(' ');

    try {
      execSync(fallbackCmd, { stdio: 'pipe', timeout: 300_000 });
      console.log('[ffmpeg] Final video (no subtitles):', outputPath);
    } catch (err2: unknown) {
      const msg2 = err2 instanceof Error ? err2.message : String(err2);
      console.error('[ffmpeg] Final assembly failed:', msg2);
      throw new Error('Failed to assemble final video');
    }
  }

  // Clean up temp files
  try {
    fs.unlinkSync(silentVideoPath);
    fs.unlinkSync(concatListPath);
  } catch {
    // Non-critical cleanup — ignore errors
  }
}

// ─────────────────────────────────────────────────────────────
// YouTube Upload (unchanged from original)
// ─────────────────────────────────────────────────────────────

async function uploadToYouTube(
  videoPath: string,
  year: number, month: number, day: number,
  panchang: ReturnType<typeof computePanchang>,
  horoscopes: DailyHoroscope[],
): Promise<void> {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }

  const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID?.trim();
  const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET?.trim();
  const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN?.trim();

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error('[youtube] Missing YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, or YOUTUBE_REFRESH_TOKEN in .env.local');
    console.error('[youtube] Skipping upload. Video is available locally.');
    return;
  }

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const tithiHi = panchang.tithi.name.hi || panchang.tithi.name.en;
  const nakHi = panchang.nakshatra.name.hi || panchang.nakshatra.name.en;

  const rashiLines = horoscopes.map((h, i) => {
    const name = RASHIS[i].name.hi;
    const score = h.overallScore;
    const stars = score >= 7 ? '***' : score >= 5 ? '**' : '*';
    const text = pickRashiPrediction(h);
    return `${name} (${RASHI_SPOKEN[i + 1]}) ${stars}: ${text}`;
  }).join('\n');

  // RULE: "Today" or "आज" in title = 2-3x more views. Always include it + date.
  const title = `आज का राशिफल Today ${day} ${HINDI_MONTHS[month]} ${year} | ${tithiHi} | 12 Rashi Panchang`;
  const description = `आज का पंचांग और राशिफल — ${formatHindiDate(year, month, day)}

पंचांग:
तिथि: ${tithiHi}
नक्षत्र: ${nakHi}
योग: ${panchang.yoga.name.hi || panchang.yoga.name.en}
राहु काल: ${panchang.rahuKaal.start} - ${panchang.rahuKaal.end}
अभिजित मुहूर्त: ${panchang.abhijitMuhurta.start} - ${panchang.abhijitMuhurta.end}

12 राशियों का राशिफल:
${rashiLines}

FREE Panchang & Kundali tools:
https://dekhopanchang.com/hi/panchang
https://dekhopanchang.com/hi/kundali
https://dekhopanchang.com/hi/matching

#राशिफल #पंचांग #${tithiHi.replace(/\s/g, '')} #ज्योतिष #rashifal #panchang #DekhoPanchang`;

  const tags = [
    'rashifal', 'राशिफल', 'panchang', 'पंचांग', 'horoscope', 'ज्योतिष',
    'mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya',
    'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen',
    'Dekho Panchang', dateStr,
  ];

  console.log('[youtube] Refreshing access token...');

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error(`[youtube] Token refresh failed (${tokenRes.status}): ${err}`);
    return;
  }

  const { access_token: accessToken } = await tokenRes.json();
  console.log('[youtube] Auth OK');

  const videoData = fs.readFileSync(videoPath);
  const fileSize = videoData.length;
  console.log(`[youtube] Uploading ${(fileSize / 1024 / 1024).toFixed(1)}MB...`);

  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': String(fileSize),
        'X-Upload-Content-Type': 'video/mp4',
      },
      body: JSON.stringify({
        snippet: {
          title: title.slice(0, 100),
          description,
          tags,
          categoryId: '27',
          defaultLanguage: 'hi',
          defaultAudioLanguage: 'hi',
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
          embeddable: true,
        },
      }),
    },
  );

  if (!initRes.ok) {
    const err = await initRes.text();
    console.error(`[youtube] Upload init failed (${initRes.status}): ${err}`);
    return;
  }

  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) {
    console.error('[youtube] No upload URL in response');
    return;
  }

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': String(fileSize),
    },
    body: videoData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    console.error(`[youtube] Upload failed (${uploadRes.status}): ${err}`);
    return;
  }

  const result = await uploadRes.json();
  console.log(`[youtube] Uploaded! Video ID: ${result.id}`);
  console.log(`[youtube] URL: https://www.youtube.com/watch?v=${result.id}`);
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dateArg = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a));
  const shouldUpload = args.includes('--upload');

  const { year, month, day } = parseDate(dateArg);
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  console.log('='.repeat(60));
  console.log(`  Daily Rashifal Video — ${dateStr}`);
  console.log(`  Using stock video clips from rashi-clips/`);
  console.log('='.repeat(60));
  console.log('');

  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Verify stock clips exist
  const requiredClips = ['intro', ...Object.values(RASHI_CLIP_FILE), 'outro'];
  const missingClips = requiredClips.filter(c => !fs.existsSync(path.join(CLIPS_DIR, `${c}.mp4`)));
  if (missingClips.length > 0) {
    console.error(`[clips] Missing stock clips in ${CLIPS_DIR}:`);
    for (const c of missingClips) console.error(`  - ${c}.mp4`);
    console.error('[clips] Download clips first. See scripts/download-stock-clips.ts');
    process.exit(1);
  }
  console.log(`[clips] All ${requiredClips.length} stock clips found`);
  console.log('');

  // ── Step 1: Compute Panchang ──────────────────────────────
  console.log('[panchang] Computing panchang for Ujjain...');

  const tzOffset = getUTCOffsetForDate(year, month, day, UJJAIN.tz);

  const panchangInput: PanchangInput = {
    year, month, day,
    lat: UJJAIN.lat,
    lng: UJJAIN.lng,
    tzOffset,
    timezone: UJJAIN.tz,
    locationName: UJJAIN.name,
  };

  const panchang = computePanchang(panchangInput);
  console.log(`[panchang] Tithi: ${panchang.tithi.name.hi}`);
  console.log(`[panchang] Nakshatra: ${panchang.nakshatra.name.hi}`);
  console.log(`[panchang] Yoga: ${panchang.yoga.name.hi}`);
  console.log(`[panchang] Rahu Kaal: ${panchang.rahuKaal.start} - ${panchang.rahuKaal.end}`);
  console.log('');

  // ── Step 2: Generate 12 Rashifal ──────────────────────────
  console.log('[rashifal] Generating horoscopes for 12 rashis...');

  const horoscopes: DailyHoroscope[] = [];
  for (let rashiId = 1; rashiId <= 12; rashiId++) {
    const h = generateDailyHoroscope({ moonSign: rashiId, date: dateStr });
    horoscopes.push(h);
    const rashiName = RASHIS[rashiId - 1].name.hi;
    console.log(`  ${rashiName}: ${h.overallScore}/10`);
  }
  console.log('');

  // ── Step 3: Build voiceover script ────────────────────────
  console.log('[script] Building Hindi voiceover script...');
  const script = buildScript(panchang, horoscopes, year, month, day);

  const scriptPath = path.join(OUTPUT_DIR, `rashifal-${dateStr}.txt`);
  fs.writeFileSync(scriptPath, script, 'utf-8');
  console.log(`[script] Script saved: ${scriptPath}`);
  console.log(`[script] Script length: ~${script.split(/\s+/).length} words`);
  console.log('');

  // ── Step 4: Generate voiceover ────────────────────────────
  const voicePath = path.join(OUTPUT_DIR, `rashifal-${dateStr}.mp3`);
  generateVoiceover(script, voicePath);

  const duration = getAudioDuration(voicePath);
  console.log(`[tts] Audio duration: ${duration.toFixed(1)}s`);
  console.log('');

  // ── Step 5: Generate SRT subtitles (fallback) ─────────────
  console.log('[srt] Generating fallback subtitles...');
  const srt = buildSRT(panchang, horoscopes, year, month, day);
  const srtPath = path.join(OUTPUT_DIR, `rashifal-${dateStr}.srt`);
  fs.writeFileSync(srtPath, srt, 'utf-8');
  console.log(`[srt] Subtitles saved: ${srtPath}`);
  console.log('');

  // ── Step 6: Parse VTT for precise segment timings ─────────
  console.log('[timing] Parsing VTT for segment boundaries...');
  const vttPath = voicePath.replace(/\.mp3$/, '.vtt');
  let timings: SegmentTiming[];

  if (fs.existsSync(vttPath)) {
    const vttContent = fs.readFileSync(vttPath, 'utf-8');
    const cues = parseVTT(vttContent);
    console.log(`[timing] Parsed ${cues.length} VTT cues`);
    timings = extractSegmentTimings(cues, duration);
  } else {
    console.warn('[timing] No VTT file found, using estimated timings');
    timings = extractSegmentTimings([], duration);
  }

  console.log('[timing] Segment breakdown:');
  for (const t of timings) {
    const dur = (t.endSec - t.startSec).toFixed(1);
    console.log(`  ${t.id.padEnd(12)} ${t.startSec.toFixed(1)}s - ${t.endSec.toFixed(1)}s  (${dur}s)`);
  }
  console.log('');

  // ── Step 7: Build video segments ──────────────────────────
  console.log('[segments] Building video segments from stock clips...');
  const segments = buildVideoSegments(timings, panchang, horoscopes, year, month, day);

  const segmentDir = path.join(OUTPUT_DIR, `segments-${dateStr}`);
  if (!fs.existsSync(segmentDir)) fs.mkdirSync(segmentDir, { recursive: true });

  const segmentPaths: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segPath = path.join(segmentDir, `${String(i).padStart(2, '0')}-${seg.id}.mp4`);

    console.log(`  [${i + 1}/${segments.length}] ${seg.id} (${seg.durationSec.toFixed(1)}s) — ${path.basename(seg.clipPath)}`);
    createSegment(seg, segPath);
    segmentPaths.push(segPath);
  }
  console.log(`[segments] All ${segments.length} segments created`);
  console.log('');

  // ── Step 8: Assemble final video ──────────────────────────
  const outputVideo = path.join(OUTPUT_DIR, `rashifal-${dateStr}.mp4`);
  assembleVideo(segmentPaths, voicePath, srtPath, outputVideo, duration);

  // Clean up segment files
  try {
    for (const sp of segmentPaths) {
      if (fs.existsSync(sp)) fs.unlinkSync(sp);
    }
    if (fs.existsSync(segmentDir)) fs.rmdirSync(segmentDir);
  } catch {
    // Non-critical cleanup
  }

  // Report final file size
  if (fs.existsSync(outputVideo)) {
    const stats = fs.statSync(outputVideo);
    console.log(`\n[done] Final video: ${outputVideo}`);
    console.log(`[done] Size: ${(stats.size / 1024 / 1024).toFixed(1)}MB`);
    console.log(`[done] Duration: ~${duration.toFixed(0)}s`);
    console.log(`[done] Resolution: ${VIDEO_WIDTH}x${VIDEO_HEIGHT}`);
  }

  // ── Step 9: Upload (optional) ─────────────────────────────
  if (shouldUpload) {
    console.log('\n[youtube] Starting upload...');
    await uploadToYouTube(outputVideo, year, month, day, panchang, horoscopes);
  } else {
    console.log('\n[info] To upload to YouTube, run with --upload flag');
  }

  console.log('\n' + '='.repeat(60));
  console.log('  Done!');
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('[fatal] Unhandled error:', err);
  process.exit(1);
});
