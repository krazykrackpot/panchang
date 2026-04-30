import crypto from 'crypto';
import type { LocaleText } from '@/types/panchang';
import { NextResponse } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';

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

    // Format date for display
    const dateStr = new Date(Date.UTC(year, month - 1, day))
      .toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

    const tweetText = composeTweet({
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
    });

    const tweetResult = await postToTwitter(tweetText);

    return NextResponse.json({
      posted: !!tweetResult,
      tweetId: tweetResult?.id || null,
      date: todayStr,
      textLength: tweetText.length,
      festivals: festivals.map(f => L(f.name)),
    });
  } catch (e) {
    console.error('[social-post] cron failed:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// ──────────────────────────────────────────────────────────────
// Tweet composition
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
  lines.push('');
  lines.push(`dekhopanchang.com`);

  // Rotate temple/mandir tags daily — each day features a different set
  const TEMPLE_TAGS = [
    '#Mahakal #Ujjain #Panchang #Jyotish',
    '#KashiVishwanath #Varanasi #Panchang #Jyotish',
    '#Kamakhya #Panchang #HinduCalendar #Jyotish',
    '#Vindhyavasini #Panchang #VedicAstrology',
    '#Somnath #Panchang #Jyotish #HinduTemple',
    '#Tirupati #Panchang #Jyotish #VedicAstrology',
    '#Jagannath #Puri #Panchang #Jyotish',
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  lines.push(TEMPLE_TAGS[dayOfYear % TEMPLE_TAGS.length]);

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

async function postToTwitter(text: string): Promise<{ id: string } | null> {
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
    body: JSON.stringify({ text }),
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
