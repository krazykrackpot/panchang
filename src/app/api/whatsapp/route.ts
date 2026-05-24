import { NextResponse, after } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

// ── Environment ────────────────────────────────────────────────
// All env vars are .trim()ed to guard against Vercel trailing newlines (Lesson: ENV VAR SAFETY)
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN?.trim();
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN?.trim();
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET?.trim();
const WHATSAPP_API = 'https://graph.facebook.com/v21.0';

/**
 * Verify the Meta-issued HMAC-SHA256 signature on an inbound webhook
 * request. Without this, anyone who finds the URL could spoof inbound
 * messages and trigger paid Meta credits via `sendWhatsAppMessage`.
 * Round 4 audit.
 */
function verifyMetaSignature(rawBody: string, header: string | null): boolean {
  if (!WHATSAPP_APP_SECRET) {
    // Fail closed when the secret isn't configured — without it we can't
    // tell a real Meta webhook from a spoof.
    console.error('[whatsapp] WHATSAPP_APP_SECRET not set — rejecting webhook');
    return false;
  }
  if (!header || !header.startsWith('sha256=')) return false;
  const provided = header.slice('sha256='.length);
  // Digest directly into a Buffer (no hex-encoding round-trip) and parse
  // the provided header from hex once. Gemini #124 review.
  const expectedBuf = createHmac('sha256', WHATSAPP_APP_SECRET)
    .update(rawBody, 'utf8')
    .digest();
  const providedBuf = Buffer.from(provided, 'hex');
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}

// ── Constants ──────────────────────────────────────────────────
const DEFAULT_CITY = CITIES.find(c => c.slug === 'ujjain') || CITIES[0];

const SKIP_WORDS = new Set([
  'rahu', 'raahu', 'rahukaal', 'rahukalam', 'kaal', 'kalam',
  'panchang', 'panchaang', 'panchangam', 'aaj', 'ka', 'ke', 'ki',
  'today', 'for', 'in', 'liye', 'tithi', 'nakshatra', 'the', 'of',
  'tell', 'me', 'show', 'what', 'is', 'kya', 'hai', 'batao', 'bataiye',
]);

const WELCOME_MESSAGE = `\u{1F64F} *Namaste! Dekho Panchang mein aapka swaagat hai*

Main aapko daily panchang aur rahu kaal ki jaankaari de sakta hoon.

Ye likhkar bhejein:
\u{1F4C5} *panchang* — Aaj ka panchang (Ujjain)
\u{1F4C5} *panchang mumbai* — Mumbai ka panchang
\u26A0\uFE0F *rahu kaal delhi* — Delhi ka rahu kaal
\u{1F52E} *muhurta* — Shubh muhurta khojen

\u{1F310} https://dekhopanchang.com`;

const HELP_MESSAGE = `\u{1F914} Main samajh nahi paaya. Ye bhejkar dekhein:

\u{1F4C5} *panchang* — Aaj ka panchang
\u{1F4C5} *panchang mumbai* — Shahar ka panchang
\u26A0\uFE0F *rahu kaal* — Rahu Kaal
\u{1F52E} *muhurta* — Shubh muhurta

\u{1F310} https://dekhopanchang.com`;

// ── GET: Webhook verification ──────────────────────────────────
// Meta sends a GET with hub.mode, hub.verify_token, hub.challenge
// We must return the challenge string verbatim on success, 403 otherwise.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  // Round 2 SEC-12 — constant-time compare on the verify token. Even
  // though the GET runs once at app-config time, defense-in-depth: a
  // string `===` compare leaks character-by-character timing of how far
  // the supplied token matched VERIFY_TOKEN. Use timingSafeEqual.
  if (mode === 'subscribe' && token && VERIFY_TOKEN && tokensMatch(token, VERIFY_TOKEN)) {
    // Return challenge as plain text (not JSON) per Meta spec
    return new Response(challenge ?? '', { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

function tokensMatch(a: string, b: string): boolean {
  // Gemini #163 — the length check above is the only condition under which
  // timingSafeEqual would throw, so the try/catch is redundant. The length
  // check itself leaks the verify_token length via timing; we accept that
  // trade-off because the verify_token is a fixed-format secret known to
  // the operator (Meta's WhatsApp config). Hashing both inputs to a fixed
  // width before compare would mask the length but adds no defensive value
  // against an attacker who already knows VERIFY_TOKEN's format.
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

// ── POST: Incoming messages ────────────────────────────────────
// Meta requires a 200 response within 15 seconds — always return 200, even on errors.
// MUST verify the X-Hub-Signature-256 HMAC before parsing the body (Round 4
// audit): the URL is discoverable and the route triggers paid Meta credits
// via outbound sendWhatsAppMessage; without signature verification a bot
// could spam arbitrary numbers on our dime.
export async function POST(request: Request) {
  try {
    // Read the raw body BEFORE JSON parsing so the HMAC matches exactly
    // what Meta signed. JSON.parse-then-stringify would normalise the
    // bytes and break the signature check.
    const rawBody = await request.text();
    const sig = request.headers.get('x-hub-signature-256');
    if (!verifyMetaSignature(rawBody, sig)) {
      console.error('[whatsapp] signature verification failed');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = JSON.parse(rawBody);

    // WhatsApp webhook payload: entry[].changes[].value.messages[]
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message || message.type !== 'text') {
      // Acknowledge non-text messages (images, stickers, etc.) silently
      return NextResponse.json({ status: 'ok' });
    }

    const from: string = message.from; // sender phone number (E.164)
    const text: string = message.text.body.trim().toLowerCase();

    const reply = generateReply(text);

    // Round 3 R3-SF-3 — `after()` keeps the Next.js runtime alive until
    // the outbound graph.facebook.com call completes. Previously the
    // function returned 200 to Meta and Vercel killed the runtime mid-
    // fetch; the user got no reply. Meta does NOT retry inbound webhooks
    // on 200, so the failure was unrecoverable per-message.
    after(
      sendWhatsAppMessage(from, reply).catch((err) => {
        console.error('[whatsapp] failed to send reply:', err);
      }),
    );

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('[whatsapp] webhook error:', err);
    // Always return 200 to Meta — non-200 triggers retries
    return NextResponse.json({ status: 'ok' });
  }
}

// ── Message router ─────────────────────────────────────────────
function generateReply(text: string): string {
  const cleaned = text.replace(/[?!.,;:]/g, '').trim();

  // Greetings
  if (/^(hi|hello|hey|namaste|namaskar|ram ram|jai shri|hare krishna|jai jinendra|sat sri akal)/.test(cleaned)) {
    return WELCOME_MESSAGE;
  }

  // Rahu Kaal query
  if (/rahu|raahu|rahukaal|rahukalam/.test(cleaned)) {
    const city = extractCity(cleaned);
    return generateRahuKaalMessage(city);
  }

  // Panchang query
  if (/panchang|panchaang|panchangam|tithi|nakshatra|aaj ka/.test(cleaned)) {
    const city = extractCity(cleaned);
    return generatePanchangMessage(city);
  }

  // Muhurta
  if (/muhurta|muhurat|shubh/.test(cleaned)) {
    return '\u{1F52E} *Shubh Muhurta khojen*\n\nVivah, grih pravesh, vyapar aur 18 anya karyon ke liye shubh tithi:\n\n\u{1F449} https://dekhopanchang.com/hi/muhurta-ai';
  }

  // Help / unknown
  return HELP_MESSAGE;
}

// ── City extraction ────────────────────────────────────────────
function extractCity(text: string): CityData {
  const words = text.split(/\s+/);

  for (const word of words) {
    if (word.length < 2 || SKIP_WORDS.has(word)) continue;

    const match = CITIES.find(c =>
      c.slug === word ||
      c.slug.includes(word) ||
      c.name.en.toLowerCase() === word ||
      c.name.en.toLowerCase().includes(word) ||
      (c.name.hi && c.name.hi.includes(word))
    );
    if (match) return match;
  }

  return DEFAULT_CITY;
}

// ── Panchang message formatter ─────────────────────────────────
function generatePanchangMessage(city: CityData): string {
  // Round 3 R3-SF-4 — read y/m/d in the CITY's timezone, not server-local.
  // Previously a Delhi user at 02:00 IST (UTC 20:30 previous day) got
  // yesterday's panchang on a Vercel UTC instance. Pattern matches
  // daily-panchang cron.
  const tz = city.timezone;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const year = parseInt(parts.find((p) => p.type === 'year')!.value, 10);
  const month = parseInt(parts.find((p) => p.type === 'month')!.value, 10);
  const day = parseInt(parts.find((p) => p.type === 'day')!.value, 10);

  const tzOffset = getUTCOffsetForDate(year, month, day, tz);

  const panchang = computePanchang({
    year,
    month,
    day,
    lat: city.lat,
    lng: city.lng,
    tzOffset,
    timezone: tz,
    locationName: city.name.en,
  });

  const tithiName = panchang.tithi?.name?.hi || panchang.tithi?.name?.en || '\u2014';
  const nakshatraName = panchang.nakshatra?.name?.hi || panchang.nakshatra?.name?.en || '\u2014';
  const yogaName = panchang.yoga?.name?.hi || panchang.yoga?.name?.en || '\u2014';
  const karanaName = panchang.karana?.name?.hi || panchang.karana?.name?.en || '\u2014';

  // Format date in Hindi locale using the city's timezone.
  // (R3-SF-4 — now constructed fresh; `now` is no longer in scope.)
  const dateStr = new Date().toLocaleDateString('hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: tz,
  });

  return `\u{1F64F} *Aaj ka Panchang*
\u{1F4CD} ${city.name.hi || city.name.en} \u2014 ${dateStr}

\u{1F4C5} Tithi: ${tithiName}
\u2B50 Nakshatra: ${nakshatraName}
\u{1F52E} Yog: ${yogaName}
\u{1F4FF} Karan: ${karanaName}
\u{1F305} Suryoday: ${panchang.sunrise || '\u2014'}
\u{1F307} Suryaast: ${panchang.sunset || '\u2014'}
\u{1F319} Chandroday: ${panchang.moonrise || '\u2014'}

\u26A0\uFE0F Rahu Kaal: ${panchang.rahuKaal?.start || '\u2014'} \u2013 ${panchang.rahuKaal?.end || '\u2014'}

\u{1F517} Vistaar se dekhein:
https://dekhopanchang.com/hi/panchang/${city.slug}

_Dekho Panchang \u2014 Vedic Jyotish ka Vigyan_`;
}

// ── Rahu Kaal message formatter ────────────────────────────────
function generateRahuKaalMessage(city: CityData): string {
  // Round 3 R3-SF-4 — y/m/d in the CITY's tz, same fix as
  // generatePanchangMessage above.
  const tz = city.timezone;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const year = parseInt(parts.find((p) => p.type === 'year')!.value, 10);
  const month = parseInt(parts.find((p) => p.type === 'month')!.value, 10);
  const day = parseInt(parts.find((p) => p.type === 'day')!.value, 10);

  const tzOffset = getUTCOffsetForDate(year, month, day, tz);

  // computePanchang already calculates rahu kaal, yamaganda, gulika
  const panchang = computePanchang({
    year,
    month,
    day,
    lat: city.lat,
    lng: city.lng,
    tzOffset,
    timezone: tz,
    locationName: city.name.en,
  });

  const dateStr = new Date().toLocaleDateString('hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: tz,
  });

  return `\u26A0\uFE0F *Rahu Kaal*
\u{1F4CD} ${city.name.hi || city.name.en} \u2014 ${dateStr}

\u{1F534} Rahu Kaal: ${panchang.rahuKaal?.start || '\u2014'} \u2013 ${panchang.rahuKaal?.end || '\u2014'}
\u{1F7E0} Yamaganda: ${panchang.yamaganda?.start || '\u2014'} \u2013 ${panchang.yamaganda?.end || '\u2014'}
\u{1F7E3} Gulika Kaal: ${panchang.gulikaKaal?.start || '\u2014'} \u2013 ${panchang.gulikaKaal?.end || '\u2014'}

\u{1F305} Suryoday: ${panchang.sunrise || '\u2014'}
\u{1F307} Suryaast: ${panchang.sunset || '\u2014'}

\u{1F4A1} In samay mein naye kaam shuru karna varjit hai.

\u{1F517} Vistaar se dekhein:
https://dekhopanchang.com/hi/panchang/${city.slug}

_Dekho Panchang \u2014 Vedic Jyotish ka Vigyan_`;
}

// ── WhatsApp API sender ────────────────────────────────────────
async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error('[whatsapp] Missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID env vars');
    return;
  }

  const res = await fetch(`${WHATSAPP_API}/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error('[whatsapp] send failed:', res.status, errBody);
  }
}
