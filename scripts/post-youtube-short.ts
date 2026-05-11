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

// ── Seeded PRNG (must match generate-short.ts for consistency) ──
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

function getDayOfYear(): number {
  return Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
}

/** Fisher-Yates shuffle using seeded random */
function shuffleArray<T>(arr: T[], rand: () => number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ── Title templates — rotate daily ──
interface TitleData { monthDay: string; tithi: string; nakshatra: string; weekday: string; rahuKaal: string; yoga: string; karana: string }
const TITLE_TEMPLATES: Array<(d: TitleData) => string> = [
  (d) => `Panchang ${d.monthDay}  –  ${d.tithi} ${d.nakshatra} | आज का पंचांग #Shorts`,
  (d) => `${d.nakshatra} Nakshatra Today  –  ${d.weekday} ${d.monthDay} | दैनिक पंचांग #Shorts`,
  (d) => `Rahu Kaal ${d.rahuKaal}  –  ${d.monthDay} Panchang #Shorts`,
  (d) => `${d.weekday} Panchang  –  ${d.monthDay} | ${d.yoga} Yoga, ${d.karana} Karana #Shorts`,
  (d) => `Today's Panchang  –  ${d.monthDay} | ${d.tithi} ${d.nakshatra} राहु काल #Shorts`,
];

// ── Description section blocks (shuffled order per day) ──
const BASE_URL_POST = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

function buildDescription(dateStr: string, dateHi: string, rand: () => number): string {
  // Above-the-fold lines (always first — these show before "...more")
  const aboveFold = [
    `Full Panchang for ${dateStr}: ${BASE_URL_POST}/en/panchang`,
    `आज का पंचांग (${dateHi}): ${BASE_URL_POST}/hi/panchang`,
  ];

  // Shuffleable sections
  const sections = [
    [
      '✨ Tithi, Nakshatra, Yoga, Karana, Vara',
      '🌅 Sunrise, Sunset, Moonrise, Rahu Kaal',
      '🔮 Nakshatra spotlight with deity & characteristics',
    ].join('\n'),
    [
      `📊 Generate your Kundali FREE: ${BASE_URL_POST}/en/kundali`,
      `🤖 AI Muhurta Scanner: ${BASE_URL_POST}/en/muhurta-ai`,
      `📱 Rahu Kaal Today: ${BASE_URL_POST}/en/rahu-kaal`,
      `📅 Festival Calendar: ${BASE_URL_POST}/en/calendar`,
    ].join('\n'),
    [
      'Computed for Ujjain  –  the traditional prime meridian of Hindu astronomy (Surya Siddhanta).',
      'Swiss Ephemeris precision  –  not approximations.',
    ].join('\n'),
    [
      '🌍 Available in 7 languages: English, हिन्दी, தமிழ், తెలుగు, বাংলা, ગુજરાતી, ಕನ್ನಡ',
      `🌐 Website: ${BASE_URL_POST}`,
    ].join('\n'),
  ];

  const shuffledSections = shuffleArray(sections, rand);

  const hashtags = [
    '#Panchang #VedicAstrology #Jyotish #HinduCalendar #Tithi #Nakshatra',
    '#RahuKaal #DekhoPanchang #DailyPanchang #Astrology #Shorts',
    '#पंचांग #राशिफल #ज्योतिष #तिथि #नक्षत्र #राहुकाल',
    '#పంచాంగం #ராசிபலன் #পঞ্চাঙ্গ #પંચાંગ #ಪಂಚಾಂಗ',
  ];

  return [
    aboveFold.join('\n'),
    '',
    ...shuffledSections.flatMap(s => [s, '']),
    hashtags.join('\n'),
  ].join('\n');
}

async function main() {
  console.log('🎬 Generating daily panchang YouTube Short...\n');

  const dayOfYear = getDayOfYear();
  const year = new Date().getFullYear();
  const rand = seededRandom(dayOfYear * 2000 + year); // different seed from generate-short for independent shuffle

  // Pick theme and format for today
  const themes = ['cosmic', 'sunrise', 'moonlit', 'emerald'];
  const theme = themes[dayOfYear % themes.length];
  const format = dayOfYear % 5 === 0 ? 'quick-glance' : 'standard';

  // Dynamic imports so env is loaded first
  const { generateDailyShort } = await import('../src/lib/youtube/generate-short');
  const { uploadToYouTube } = await import('../src/lib/youtube/upload');

  const short = await generateDailyShort({ theme, format });

  // ── Override title with rotated template ──
  // Fetch panchang data for title fields
  const { computePanchang } = await import('../src/lib/ephem/panchang-calc');
  const { getUTCOffsetForDate } = await import('../src/lib/utils/timezone');
  const UJJAIN = { lat: 23.1765, lng: 75.7885, tz: 'Asia/Kolkata' };
  const now = new Date();
  const tzOffset = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), UJJAIN.tz);
  const istMs = now.getTime() + tzOffset * 3600 * 1000;
  const d = new Date(istMs);
  const panchang = computePanchang({
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    lat: UJJAIN.lat, lng: UJJAIN.lng, tzOffset, timezone: UJJAIN.tz, locationName: 'Ujjain',
  });

  const titleData: TitleData = {
    monthDay: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    tithi: panchang.tithi.name.en,
    nakshatra: panchang.nakshatra.name.en,
    weekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
    rahuKaal: `${panchang.rahuKaal.start}–${panchang.rahuKaal.end}`,
    yoga: panchang.yoga.name.en,
    karana: panchang.karana.name.en,
  };

  const titleTemplate = TITLE_TEMPLATES[dayOfYear % TITLE_TEMPLATES.length];
  const title = titleTemplate(titleData);

  // ── Override description with shuffled sections ──
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const dateHi = now.toLocaleDateString('hi-IN', { month: 'long', day: 'numeric', year: 'numeric' });
  const description = buildDescription(dateStr, dateHi, rand);

  // ── Shuffle tags + add day-specific ones ──
  const baseTags = [...short.tags];
  // Add panchang-specific tags for the day
  baseTags.push(panchang.tithi.name.en.toLowerCase(), panchang.nakshatra.name.en.toLowerCase());
  const tags = shuffleArray(baseTags, rand);

  console.log(`✅ Video generated: ${(short.videoBuffer.byteLength / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Theme: ${theme}, Format: ${format}`);
  console.log(`   Title: ${title}\n`);

  // Check if --dry-run flag
  if (process.argv.includes('--dry-run')) {
    console.log('🏁 Dry run — skipping upload. Video is ready.');
    console.log(`\n📝 Description:\n${description}\n`);
    console.log(`🏷️  Tags: ${tags.join(', ')}`);
    return;
  }

  console.log('📤 Uploading to YouTube...\n');
  const videoId = await uploadToYouTube({
    videoBuffer: short.videoBuffer,
    title,
    description,
    tags,
    isShort: true,
  });

  console.log(`🎉 Published: https://youtube.com/shorts/${videoId}`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
