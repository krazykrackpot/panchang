import crypto from 'crypto';
import type { LocaleText, PanchangData } from '@/types/panchang';
import { NextResponse } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';
import { YOGAS } from '@/lib/constants/yogas';
import { TRANSIT_ARTICLES } from '@/lib/content/transit-articles';

/**
 * Cron endpoint: posts daily panchang to Twitter/X.
 * Triggered by Vercel Cron at 00:30 UTC (06:00 IST).
 * Protected by CRON_SECRET header.
 *
 * Location: Ujjain (historical center of Indian astronomy, first meridian of Hindu geography).
 * Covers all of India well — within ±30 min of any Indian city's sunrise.
 *
 * Required env vars (all trimmed before use):
 * - CRON_SECRET: Bearer token for cron auth
 * - TWITTER_API_KEY: Twitter/X OAuth 1.0a consumer key
 * - TWITTER_API_SECRET: Twitter/X OAuth 1.0a consumer secret
 * - TWITTER_ACCESS_TOKEN: Twitter/X user access token
 * - TWITTER_ACCESS_SECRET: Twitter/X user access token secret
 */

// Ujjain — the traditional prime meridian of Hindu astronomy (Surya Siddhanta)
const UJJAIN_LAT = 23.1765;
const UJJAIN_LNG = 75.7885;
const UJJAIN_TZ = 'Asia/Kolkata';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const tzOffset = getTimezoneOffset(UJJAIN_TZ, now);

    // Compute today's date in IST
    const istMs = now.getTime() + tzOffset * 3600 * 1000;
    const istDate = new Date(istMs);
    const year = istDate.getUTCFullYear();
    const month = istDate.getUTCMonth() + 1;
    const day = istDate.getUTCDate();

    const panchang = computePanchang({
      year,
      month,
      day,
      lat: UJJAIN_LAT,
      lng: UJJAIN_LNG,
      tzOffset,
      timezone: UJJAIN_TZ,
      locationName: 'Ujjain',
    });

    const L = (obj: LocaleText) => obj.en;

    // Find today's festivals/vrats
    const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let festivals: FestivalEntry[] = [];
    try {
      const allFestivals = generateFestivalCalendarV2(year, UJJAIN_LAT, UJJAIN_LNG, UJJAIN_TZ);
      festivals = allFestivals.filter(f => f.date === todayStr);
    } catch (err) {
      console.error('[social-post] Festival lookup failed:', err);
    }

    // Day of week in IST: 0=Sunday, 1=Monday, ..., 6=Saturday
    const istDayOfWeek = istDate.getUTCDay();
    // Day of year for rotating through fact arrays
    const startOfYear = Date.UTC(year, 0, 0);
    const dayOfYear = Math.floor((Date.UTC(year, month - 1, day) - startOfYear) / 86400000);

    let tweetText: string;

    if (istDayOfWeek === 1) {
      // Monday — Daily Panchang (existing logic)
      const dateStr = new Date(Date.UTC(year, month - 1, day))
        .toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

      tweetText = composeTweet({
        date: dateStr,
        tithi: L(panchang.tithi.name),
        nakshatra: L(panchang.nakshatra.name),
        yoga: L(panchang.yoga.name),
        vara: L(panchang.vara.name),
        sunrise: panchang.sunrise,
        sunset: panchang.sunset,
        rahuKaalStart: panchang.rahuKaal.start,
        rahuKaalEnd: panchang.rahuKaal.end,
        festivals: festivals.map(f => ({
          name: L(f.name),
          type: f.type,
        })),
        panchakWarning: panchang.panchakInfo?.isActive
          ? `Panchak active — avoid southward travel, cremation`
          : undefined,
        holashtakWarning: panchang.holashtak?.isActive
          ? `Holashtak Day ${panchang.holashtak.dayNumber}/8 — avoid auspicious activities`
          : undefined,
      });
    } else {
      // All other days — educational content rotation
      tweetText = composeEducationalTweet(istDayOfWeek, panchang, dayOfYear);
    }

    // Fetch multiple card images and upload to Twitter (up to 4 per tweet)
    const mediaIds: string[] = [];
    try {
      // Image 1: Daily panchang card (always)
      const panchangImg = await fetchSocialImage('panchang');
      if (panchangImg) {
        const id = await uploadMediaToTwitter(panchangImg);
        if (id) mediaIds.push(id);
      }
      // Image 2: Nakshatra spotlight (today's nakshatra)
      const nkImg = await fetchSocialImage(`nakshatra&id=${panchang.nakshatra?.id || 1}`);
      if (nkImg) {
        const id = await uploadMediaToTwitter(nkImg);
        if (id) mediaIds.push(id);
      }
    } catch (err) {
      console.error('[social-post] Image attach failed (posting with what we have):', err);
    }

    const tweetResult = await postToTwitter(tweetText, mediaIds.length > 0 ? mediaIds : null);

    return NextResponse.json({
      posted: !!tweetResult,
      tweetId: tweetResult?.id || null,
      hasImage: mediaIds.length > 0,
      imageCount: mediaIds.length,
      date: todayStr,
      dayOfWeek: istDayOfWeek,
      textLength: tweetText.length,
      festivals: festivals.map(f => L(f.name)),
    });
  } catch (e) {
    console.error('[social-post] cron failed:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// ──────────────────────────────────────────────────────────────
// Educational tweet content arrays
// ──────────────────────────────────────────────────────────────

const LEARN_FACTS = [
  'Did you know? Ayanamsha is the difference between the tropical and sidereal zodiacs. Your Vedic Sun sign is usually one sign behind your Western Sun sign.',
  'Pushya Nakshatra is considered the most auspicious nakshatra for starting new ventures — its deity is Brihaspati (Jupiter), the cosmic teacher.',
  'The 27 Nakshatras divide the 360\u00b0 zodiac into 13\u00b020\' segments, each with a unique deity, animal symbol, and planetary ruler.',
  'Rahu Kaal is calculated by dividing the day (sunrise to sunset) into 8 equal parts. The inauspicious segment rotates: Mon=2nd, Sat=3rd, Fri=4th...',
  'Sade Sati is Saturn\'s 7.5-year transit over your Moon sign — not always bad! The peak phase (Saturn on Moon) is the most transformative.',
  'Ekadashi fasting follows the Dwi-tithi rule: if Ekadashi spans two sunrises, observe on the SECOND day.',
  'There are 27 Yogas in Panchang — not to be confused with physical yoga. Siddha Yoga is one of the most auspicious for new beginnings.',
  'The North Indian kundali chart always has Aries in the top-left diamond. In the South Indian chart, signs are fixed and planets move.',
  'Mangal Dosha (Mars in houses 1/2/4/7/8/12) affects ~40% of charts. But most cases are cancelled by Jupiter\'s aspect or other conditions.',
  'Hora is a 24-hour cycle where each hour is ruled by a different planet. The sequence follows the Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon.',
  'Abhijit Muhurta — the 8th muhurta of the day — is universally auspicious, except on Wednesdays.',
  'Vedic astrology uses the sidereal zodiac (fixed stars), while Western astrology uses the tropical zodiac (seasons). They diverged ~1,700 years ago.',
  'Ashta Kuta matching scores compatibility on 8 dimensions (max 36 points). Nadi Kuta alone carries 8 points — the highest weight.',
  'The 12 Bhava (houses) represent different life areas. The Kendra houses (1,4,7,10) are the strongest — planets here have maximum impact.',
  'Vimshottari Dasha is a 120-year cycle divided among 9 planets. Your birth nakshatra determines which planet\'s dasha you\'re born into.',
];

const GURU_FACTS = [
  'Thursday is Guruvar — ruled by Jupiter (Brihaspati). Wearing yellow, donating turmeric, and visiting temples is considered auspicious.',
  'Jupiter changes signs approximately once every 12 months. Jupiter in Cancer is the BEST Jupiter transit — it\'s exalted!',
  'Jupiter aspects houses 5, 7, and 9 from its position — unlike other planets which only aspect the 7th house.',
  'Jupiter is the Karaka (significator) of wealth, wisdom, children, and spirituality. A strong Jupiter blesses all four.',
  'Guru Chandal Yoga forms when Jupiter conjoins Rahu — it can distort wisdom and ethics, but also bring unconventional breakthroughs.',
  'Jupiter\'s Vimshottari Dasha lasts 16 years — often the most expansive, prosperous period of life when well-placed.',
  'In Navamsa (D-9 chart), Jupiter\'s placement reveals the spiritual nature of your marriage and dharmic path.',
  'Jupiter retrograde occurs for ~4 months each year. It\'s a time for inner reflection on beliefs, ethics, and long-term vision.',
];

const MATCHING_FACTS = [
  'Ashta Kuta scores 36 points across 8 dimensions. 28+ = Excellent match. But even low scores can work with mutual effort.',
  'Nadi Kuta (8 points) checks genetic compatibility. Same Nadi = Nadi Dosha. But same nakshatra + pada cancels it.',
  'Bhakut Kuta (7 points) checks the Moon sign relationship. 6-8 and 2-12 combinations are considered challenging.',
  'Gana Kuta checks temperament: Deva (divine), Manushya (human), Rakshasa (demon). Cross-gana matches need understanding.',
  'Mangal Dosha from both charts can cancel each other out — "Dosha Samya" makes the match viable.',
  'Yoni Kuta (4 points) uses animal symbols of nakshatras to check physical and intimate compatibility.',
  'Vashya Kuta checks mutual attraction and dominance patterns between Moon signs. Some signs naturally complement.',
  'A low Ashta Kuta score with strong Navamsa compatibility can still indicate a deeply fulfilling relationship.',
];

const SHANI_FACTS = [
  'Saturday is Shanivar — ruled by Saturn. Donate black sesame, mustard oil, or iron items. Avoid starting new ventures.',
  'Sade Sati has 3 phases: Rising (Saturn enters sign before Moon), Peak (Saturn on Moon sign), Setting (Saturn enters sign after Moon).',
  'Saturn\'s Vimshottari Dasha lasts 19 years — the longest of all planets. It teaches discipline, patience, and karmic lessons.',
  'Saturn is exalted in Libra and debilitated in Aries. A well-placed Saturn gives longevity, discipline, and worldly success.',
  'Shani Dev is the son of Surya (Sun) and Chhaya. Despite his fearsome reputation, he is the ultimate teacher of karma.',
  'Saturn aspects houses 3, 7, and 10 from its position — its 3rd and 10th aspects are unique to Saturn alone.',
  'Hanuman worship is a traditional remedy for Saturn afflictions. Reciting Hanuman Chalisa on Saturdays is widely practiced.',
  'Saturn returns to its natal position every ~29.5 years — your "Saturn Return" is a major life transition period.',
];

// ──────────────────────────────────────────────────────────────
// Educational tweet composer (day-of-week rotation)
// ──────────────────────────────────────────────────────────────

/** Build a compact panchang header that goes on EVERY tweet */
function panchangHeader(panchang: PanchangData, dateStr: string): string[] {
  const L = (obj: LocaleText) => obj.en;
  return [
    `\u{1F64F} ${dateStr}`,
    `${L(panchang.tithi.name)} \u00b7 ${L(panchang.nakshatra.name)} \u00b7 ${L(panchang.vara.name)}`,
    `\u26A0\uFE0F Rahu Kaal ${panchang.rahuKaal.start}\u2013${panchang.rahuKaal.end}`,
  ];
}

function composeEducationalTweet(
  dayOfWeek: number,
  panchang: PanchangData,
  dayOfYear: number,
): string {
  const L = (obj: LocaleText) => obj.en;
  const tags = getTempleHashtags(dayOfYear);
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const header = panchangHeader(panchang, dateStr);

  switch (dayOfWeek) {
    case 0: { // Sunday — Panchang + Learn fact
      const fact = LEARN_FACTS[dayOfYear % LEARN_FACTS.length];
      return truncateTweet([
        ...header,
        '',
        `\u{1F4A1} ${fact}`,
        '',
        'dekhopanchang.com/en/panchang',
        '',
        tags,
      ]);
    }

    case 2: { // Tuesday — Panchang + Nakshatra Deep Dive
      const nk = panchang.nakshatra;
      const detail = NAKSHATRA_DETAILS.find(d => d.id === nk.id);
      const meaning = detail ? L(detail.meaning) : '';
      return truncateTweet([
        ...header,
        '',
        `\u2726 ${L(nk.name)} Nakshatra`,
        `Deity: ${L(nk.deity)} | Ruler: ${nk.ruler}`,
        meaning ? `\u2192 ${meaning}` : '',
        '',
        'dekhopanchang.com/en/panchang',
        '',
        tags,
      ].filter(Boolean));
    }

    case 3: { // Wednesday — Panchang + Yoga meaning
      const yoga = panchang.yoga;
      const yogaData = YOGAS.find(y => y.number === yoga.number);
      const yogaMeaning = yogaData ? L(yogaData.meaning) : '';
      const yogaNature = yogaData ? yogaData.nature : '';
      return truncateTweet([
        ...header,
        '',
        `\u{1F52E} Yoga: ${L(yoga.name)}${yogaMeaning ? ` (${yogaMeaning})` : ''}`,
        yogaNature ? `Nature: ${yogaNature}` : '',
        '',
        'dekhopanchang.com/en/panchang',
        '',
        tags,
      ].filter(Boolean));
    }

    case 4: { // Thursday — Panchang + Guru/Transit
      const todayDate = new Date();
      const upcomingArticle = Object.values(TRANSIT_ARTICLES).find(a => {
        const transitDate = new Date(a.exactDate);
        const daysUntil = Math.ceil((transitDate.getTime() - todayDate.getTime()) / 86400000);
        return daysUntil > 0 && daysUntil <= 60;
      });

      if (upcomingArticle) {
        const daysUntil = Math.ceil((new Date(upcomingArticle.exactDate).getTime() - todayDate.getTime()) / 86400000);
        return truncateTweet([
          ...header,
          '',
          `\u{1FA90} ${upcomingArticle.title.en.split(':')[0]}`,
          `${daysUntil} days until this major transit.`,
          '',
          `dekhopanchang.com/en/learn/transits/${upcomingArticle.slug}`,
          '',
          tags,
        ]);
      }

      const fact = GURU_FACTS[dayOfYear % GURU_FACTS.length];
      return truncateTweet([
        ...header,
        '',
        `\u{1FA90} ${fact}`,
        '',
        'dekhopanchang.com/en/panchang',
        '',
        tags,
      ]);
    }

    case 5: { // Friday — Panchang + Compatibility tip
      const fact = MATCHING_FACTS[dayOfYear % MATCHING_FACTS.length];
      return truncateTweet([
        ...header,
        '',
        `\u{1F495} ${fact}`,
        '',
        'dekhopanchang.com/en/matching',
        '',
        tags,
      ]);
    }

    case 6: { // Saturday — Panchang + Shani wisdom
      const fact = SHANI_FACTS[dayOfYear % SHANI_FACTS.length];
      return truncateTweet([
        ...header,
        '',
        `\u{1FA94} ${fact}`,
        '',
        'dekhopanchang.com/en/sade-sati',
        '',
        tags,
      ]);
    }

    default: {
      return truncateTweet([
        ...header,
        '',
        'dekhopanchang.com/en/panchang',
        '',
        tags,
      ]);
    }
  }
}

function getTempleHashtags(dayOfYear: number): string {
  const TEMPLE_TAGS = [
    '#Mahakal #Ujjain #Panchang #Jyotish',
    '#KashiVishwanath #Varanasi #Panchang #Jyotish',
    '#Kamakhya #Panchang #HinduCalendar #Jyotish',
    '#Vindhyavasini #Panchang #VedicAstrology',
    '#Somnath #Panchang #Jyotish #HinduTemple',
    '#Tirupati #Panchang #Jyotish #VedicAstrology',
    '#Jagannath #Puri #Panchang #Jyotish',
  ];
  return TEMPLE_TAGS[dayOfYear % TEMPLE_TAGS.length];
}

/**
 * Progressive truncation to stay under 280 chars.
 * Drops hashtags first, then trims trailing lines.
 */
function truncateTweet(lines: string[]): string {
  let tweet = lines.join('\n');
  if (tweet.length <= 280) return tweet;

  // Drop temple tags, keep minimal hashtags
  lines[lines.length - 1] = '#Panchang #Jyotish';
  tweet = lines.join('\n');
  if (tweet.length <= 280) return tweet;

  // Remove all hashtags
  lines.pop();
  tweet = lines.join('\n');
  if (tweet.length <= 280) return tweet;

  // Remove trailing empty lines + last content line until it fits
  while (tweet.length > 280 && lines.length > 2) {
    lines.pop();
    // Also remove trailing empty line if present
    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }
    tweet = lines.join('\n');
  }

  return tweet.slice(0, 280);
}

// ──────────────────────────────────────────────────────────────
// Tweet composition (Monday daily panchang)
// ──────────────────────────────────────────────────────────────

function composeTweet(data: {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  vara: string;
  sunrise: string;
  sunset: string;
  rahuKaalStart: string;
  rahuKaalEnd: string;
  festivals: { name: string; type: string }[];
  specialYogas?: string[];
  panchakWarning?: string;
  holashtakWarning?: string;
}): string {
  const lines: string[] = [];

  // Festival/Vrat banner — prominent, at the top
  const majorFests = data.festivals.filter(f => f.type === 'major');
  const vrats = data.festivals.filter(f => f.type === 'vrat');
  if (majorFests.length > 0) {
    lines.push(`\u{1F31F} ${majorFests.map(f => f.name).join(' \u00b7 ')}`);
  }
  if (vrats.length > 0) {
    lines.push(`\u{1F4FF} ${vrats.map(f => f.name).join(' \u00b7 ')}`);
  }
  if (majorFests.length > 0 || vrats.length > 0) {
    lines.push('');
  }

  lines.push(`\u{1F64F} Panchang \u2014 ${data.date}`);
  lines.push(`\u{1F4CD} Ujjain`);
  lines.push('');
  lines.push(`Tithi: ${data.tithi}`);
  lines.push(`Nakshatra: ${data.nakshatra}`);
  lines.push(`Yoga: ${data.yoga} \u00b7 ${data.vara}`);
  lines.push('');
  lines.push(`\u2600\uFE0F ${data.sunrise} \u2014 \u{1F319} ${data.sunset}`);
  lines.push(`\u26A0\uFE0F Rahu Kaal: ${data.rahuKaalStart}\u2013${data.rahuKaalEnd}`);
  if (data.specialYogas && data.specialYogas.length > 0) {
    lines.push(`\u2726 ${data.specialYogas.join(' \u00b7 ')}`);
  }
  if (data.panchakWarning) {
    lines.push(`\u26A0\uFE0F ${data.panchakWarning}`);
  }
  if (data.holashtakWarning) {
    lines.push(`\u26A0\uFE0F ${data.holashtakWarning}`);
  }
  lines.push('');
  lines.push(`dekhopanchang.com`);

  // Rotate temple/mandir tags daily — uses shared helper
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  lines.push(getTempleHashtags(dayOfYear));

  // Trim to 280 chars — progressively drop elements
  let tweet = lines.join('\n');
  if (tweet.length > 280) {
    // Drop temple tags, keep minimal hashtags
    lines[lines.length - 1] = '#Panchang #Jyotish';
    tweet = lines.join('\n');
  }
  if (tweet.length > 280) {
    lines.pop(); // remove all hashtags
    tweet = lines.join('\n');
  }
  if (tweet.length > 280) {
    // Last resort: drop Rahu Kaal line
    const rkIdx = lines.findIndex(l => l.includes('Rahu Kaal'));
    if (rkIdx >= 0) lines.splice(rkIdx, 1);
    tweet = lines.join('\n');
  }

  return tweet;
}

// ──────────────────────────────────────────────────────────────
// Twitter/X v2 API with OAuth 1.0a signing (no external deps)
// ──────────────────────────────────────────────────────────────

const TWITTER_CREATE_TWEET_URL = 'https://api.twitter.com/2/tweets';
const TWITTER_MEDIA_UPLOAD_URL = 'https://upload.twitter.com/1.1/media/upload.json';

/**
 * Minimal OAuth 1.0a signature generator for Twitter API v2.
 * Implements HMAC-SHA1 signing per RFC 5849.
 */
function generateOAuthHeader(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  tokenKey: string,
  tokenSecret: string,
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: tokenKey,
    oauth_version: '1.0',
  };

  // Sort params and build parameter string
  const sortedParams = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}=${percentEncode(v)}`)
    .join('&');

  // Build signature base string: METHOD&URL&PARAMS
  const baseString = `${method}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64');

  oauthParams.oauth_signature = signature;

  // Build Authorization header value
  const authHeaderValue = Object.entries(oauthParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
    .join(', ');

  return `OAuth ${authHeaderValue}`;
}

/**
 * RFC 3986 percent-encode (required by OAuth 1.0a).
 * encodeURIComponent doesn't encode `!`, `*`, `'`, `(`, `)` per spec.
 */
function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/**
 * Upload an image to Twitter and return the media_id_string.
 * Uses the v1.1 media/upload endpoint (chunked not needed for images < 5MB).
 */
async function uploadMediaToTwitter(imageBuffer: Buffer): Promise<string | null> {
  const apiKey = process.env.TWITTER_API_KEY?.trim();
  const apiSecret = process.env.TWITTER_API_SECRET?.trim();
  const accessToken = process.env.TWITTER_ACCESS_TOKEN?.trim();
  const accessSecret = process.env.TWITTER_ACCESS_SECRET?.trim();
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) return null;

  const base64Data = imageBuffer.toString('base64');

  // OAuth header must be generated for the upload URL without body params in signature
  const authHeader = generateOAuthHeader('POST', TWITTER_MEDIA_UPLOAD_URL, apiKey, apiSecret, accessToken, accessSecret);

  // Use multipart/form-data with media_data (base64)
  const boundary = '----TwitterMediaBoundary' + Date.now();
  const body = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="media_data"',
    '',
    base64Data,
    `--${boundary}--`,
  ].join('\r\n');

  const res = await fetch(TWITTER_MEDIA_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[social-post] Media upload failed:', res.status, errText);
    return null;
  }

  const data = await res.json();
  const mediaId = data?.media_id_string;
  console.log('[social-post] Media uploaded:', mediaId);
  return mediaId;
}

/**
 * Fetch the panchang card image from our own Instagram image API.
 */
async function fetchSocialImage(typeParams: string): Promise<Buffer | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';
    const res = await fetch(`${baseUrl}/api/social/instagram?type=${typeParams}`);
    if (!res.ok) {
      console.error('[social-post] Image fetch failed:', res.status, typeParams);
      return null;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error('[social-post] Image fetch error:', err);
    return null;
  }
}

async function postToTwitter(text: string, mediaIds?: string[] | null): Promise<{ id: string } | null> {
  const TWITTER_API_KEY = process.env.TWITTER_API_KEY?.trim();
  const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET?.trim();
  const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN?.trim();
  const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET?.trim();

  if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
    console.log('[social-post] Twitter credentials not configured, skipping');
    return null;
  }

  const authHeader = generateOAuthHeader(
    'POST',
    TWITTER_CREATE_TWEET_URL,
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET,
  );

  const response = await fetch(TWITTER_CREATE_TWEET_URL, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      ...(mediaIds && mediaIds.length > 0 ? { media: { media_ids: mediaIds } } : {}),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[social-post] Twitter API error:', response.status, errorBody);
    throw new Error(`Twitter API ${response.status}: ${errorBody}`);
  }

  const result = await response.json();
  const tweetId = result?.data?.id;
  console.log('[social-post] Tweet posted:', tweetId);
  return { id: tweetId };
}

// ──────────────────────────────────────────────────────────────
// Timezone utility (same pattern as daily-panchang cron)
// ──────────────────────────────────────────────────────────────

function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const local = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (local.getTime() - utc.getTime()) / (3600 * 1000);
  } catch (err) {
    console.error('[social-post] TZ resolution failed for:', timezone, err, '- defaulting to IST');
    return 5.5; // Default to IST since this cron targets Indian audience
  }
}
