/**
 * POST /api/caesarean-scan  –  Caesarean birth time scanner
 *
 * Scans a date range at 15-minute resolution to find optimal birth times
 * for a scheduled C-section, scored by 5 classical Jyotish pillars.
 *
 * Input: { startDate, endDate, lat, lng, timezone, opStart?, opEnd?, maxResults? }
 * Output: Ranked ScoredBirthSlot[] with pillar breakdowns and defect details.
 */

import { NextResponse } from 'next/server';
import { scanCaesareanSlots } from '@/lib/caesarean';
import type { CaesareanScanInput } from '@/lib/caesarean';
import { getClientIP } from '@/lib/api/rate-limit';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DATE_RANGE_DAYS = 30;

// ─── In-memory rate limiter (10 requests per IP per hour) ─────────
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Periodically prune expired entries to prevent memory leak (every 100 requests)
let pruneCounter = 0;
function maybePrune() {
  if (++pruneCounter % 100 !== 0) return;
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now >= val.resetAt) rateLimitMap.delete(key);
  }
}

export async function POST(request: Request) {
  // ── Rate limiting ──────────────────────────────────────────
  // Use the canonical getClientIP helper which prefers x-real-ip /
  // x-vercel-forwarded-for and falls back to the RIGHTMOST hop. The
  // previous leftmost x-forwarded-for split was attacker-controlled —
  // any client could inject `X-Forwarded-For: 1.2.3.4` to evade their
  // own bucket or pin a victim's IP.
  const ip = getClientIP(request);
  maybePrune();
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Maximum 10 requests per hour.' },
      { status: 429, headers: { 'Retry-After': '3600' } },
    );
  }

  try {
    const body = await request.json();
    const {
      startDate,
      endDate,
      lat,
      lng,
      timezone: rawTimezone,
      opStart = 8,
      opEnd = 17,
      maxResults = 20,
    } = body as {
      startDate: string;
      endDate: string;
      lat: number;
      lng: number;
      timezone: string;
      opStart?: number;
      opEnd?: number;
      maxResults?: number;
    };

    // --- Input validation ---

    // Required fields
    if (!startDate || !endDate || lat == null || lng == null || !rawTimezone) {
      return NextResponse.json(
        { error: 'Missing required fields: startDate, endDate, lat, lng, timezone' },
        { status: 400 },
      );
    }

    // Trim timezone string (Vercel env vars / user input can have trailing whitespace)
    const timezone = typeof rawTimezone === 'string' ? rawTimezone.trim() : '';
    if (!timezone) {
      return NextResponse.json(
        { error: 'timezone must be a non-empty IANA timezone string' },
        { status: 400 },
      );
    }

    // Date format
    if (!DATE_REGEX.test(startDate) || !DATE_REGEX.test(endDate)) {
      return NextResponse.json(
        { error: 'Dates must be in YYYY-MM-DD format' },
        { status: 400 },
      );
    }

    // Parse and validate date values
    const [sY, sM, sD] = startDate.split('-').map(Number);
    const [eY, eM, eD] = endDate.split('-').map(Number);
    if (!sY || !sM || !sD || !eY || !eM || !eD) {
      return NextResponse.json(
        { error: 'Invalid date values' },
        { status: 400 },
      );
    }
    if (sM < 1 || sM > 12 || eM < 1 || eM > 12 || sD < 1 || sD > 31 || eD < 1 || eD > 31) {
      return NextResponse.json(
        { error: 'Date month must be 1-12 and day must be 1-31' },
        { status: 400 },
      );
    }

    // Date range: endDate must be >= startDate, max 30 days
    const startMs = Date.UTC(sY, sM - 1, sD);
    const endMs = Date.UTC(eY, eM - 1, eD);
    if (endMs < startMs) {
      return NextResponse.json(
        { error: 'endDate must be on or after startDate' },
        { status: 400 },
      );
    }
    const rangeDays = (endMs - startMs) / 86400000 + 1;
    if (rangeDays > MAX_DATE_RANGE_DAYS) {
      return NextResponse.json(
        { error: `Date range must not exceed ${MAX_DATE_RANGE_DAYS} days (got ${rangeDays})` },
        { status: 400 },
      );
    }

    // Coordinate ranges
    if (
      typeof lat !== 'number' || typeof lng !== 'number' ||
      lat < -90 || lat > 90 || lng < -180 || lng > 180
    ) {
      return NextResponse.json(
        { error: 'lat must be -90..90 and lng must be -180..180' },
        { status: 400 },
      );
    }

    // Operating hours: 0-24, opStart < opEnd
    if (
      typeof opStart !== 'number' || typeof opEnd !== 'number' ||
      opStart < 0 || opStart > 24 || opEnd < 0 || opEnd > 24
    ) {
      return NextResponse.json(
        { error: 'opStart and opEnd must be between 0 and 24' },
        { status: 400 },
      );
    }
    if (opStart >= opEnd) {
      return NextResponse.json(
        { error: 'opStart must be less than opEnd' },
        { status: 400 },
      );
    }

    // maxResults sanity
    const clampedMaxResults = Math.max(1, Math.min(100, maxResults));

    // --- Run scan ---

    const scanInput: CaesareanScanInput = {
      startDate,
      endDate,
      lat,
      lng,
      timezone,
      opStart,
      opEnd,
      maxResults: clampedMaxResults,
    };

    const result = scanCaesareanSlots(scanInput);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (err: unknown) {
    // Round 2 SEC-7 — constant error string. Same shape as muhurta-scan
    // (sibling route). Detail stays in console only.
    console.error('[caesarean-scan] Scan failed:', err);
    return NextResponse.json({ error: 'Caesarean scan failed' }, { status: 500 });
  }
}
