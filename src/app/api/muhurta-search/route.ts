/**
 * POST /api/muhurta-search
 *
 * Accepts a natural-language query (e.g. "best time for marriage next month in Zurich"),
 * uses Claude to extract structured parameters, then runs the two-pass smart muhurta
 * search engine and returns scored windows.
 *
 * LLM call is the expensive part; the astronomical scan itself is pure math.
 */

import { NextResponse } from 'next/server';
import { getClaudeClient, DEFAULT_MODEL } from '@/lib/llm/llm-client';
import { smartMuhurtaSearch, type SearchParams, type UserSnapshot } from '@/lib/muhurta/smart-search';
import { EXTENDED_ACTIVITIES } from '@/lib/muhurta/activity-rules-extended';
import { resolveTimezone } from '@/lib/utils/timezone';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

// ─── Valid activity keys for LLM prompt ─────────────────────────
const VALID_ACTIVITIES = Object.keys(EXTENDED_ACTIVITIES) as ExtendedActivityId[];

const ACTIVITY_LIST_FOR_PROMPT = VALID_ACTIVITIES
  .map(id => `${id} — ${EXTENDED_ACTIVITIES[id].label.en}`)
  .join('\n');

// ─── Request body type ──────────────────────────────────────────
interface MuhurtaSearchRequest {
  query: string;
  lat?: number;
  lng?: number;
  birthData?: {
    date: string;   // "YYYY-MM-DD"
    time: string;   // "HH:MM"
    lat: number;
    lng: number;
  };
}

// ─── LLM extraction result ──────────────────────────────────────
interface ExtractedParams {
  activity: string;
  startDate: string;   // "YYYY-MM-DD"
  endDate: string;     // "YYYY-MM-DD"
  lat: number | null;
  lng: number | null;
}

// ─── System prompt for parameter extraction ─────────────────────
function buildExtractionPrompt(today: string): string {
  return `You are a parameter extractor for a Vedic muhurta (auspicious timing) search engine.
Given a user's natural language query, extract structured parameters.

Today's date: ${today}

VALID ACTIVITIES (you MUST pick exactly one):
${ACTIVITY_LIST_FOR_PROMPT}

RULES:
1. Map the user's intent to the closest activity key from the list above. Use the exact key string.
2. For date ranges:
   - "next month" = first day to last day of the calendar month after today
   - "this week" = today to end of this week (Sunday)
   - "next week" = next Monday to next Sunday
   - "in October" = October 1 to October 31 of the current/next year
   - If no date mentioned, use next 30 days from today
   - All dates in YYYY-MM-DD format
3. For location: extract lat/lng if a city/place is mentioned. If no location is mentioned, return null for both.
4. If you cannot determine the activity at all, set activity to "unknown".

Respond with ONLY valid JSON, no markdown fences:
{"activity":"<key>","startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","lat":<number|null>,"lng":<number|null>}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MuhurtaSearchRequest;

    // ── Validate request ──────────────────────────────────────
    if (!body.query || typeof body.query !== 'string' || body.query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 },
      );
    }

    const query = body.query.trim();
    if (query.length > 500) {
      return NextResponse.json(
        { error: 'Query too long. Maximum 500 characters.' },
        { status: 400 },
      );
    }

    // ── LLM parameter extraction ──────────────────────────────
    const claude = getClaudeClient();
    if (!claude) {
      // ANTHROPIC_API_KEY not configured — env var guard per CLAUDE.md rules
      return NextResponse.json(
        { error: 'Muhurta search is temporarily unavailable. Please try the manual muhurta tool instead.' },
        { status: 503 },
      );
    }

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    let extracted: ExtractedParams;

    try {
      const completion = await claude.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: 300,
        system: buildExtractionPrompt(today),
        messages: [{ role: 'user', content: query }],
      });

      // Extract text from response — use index + type guard pattern (Anthropic SDK's
      // ContentBlock union includes ThinkingBlock etc., so direct .filter type predicate
      // doesn't satisfy TS without importing the exact TextBlock type)
      const firstBlock = completion.content[0];
      const responseText = firstBlock.type === 'text' ? firstBlock.text : '';

      // Parse JSON — strip markdown fences if LLM included them despite instructions
      const cleaned = responseText.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim();
      extracted = JSON.parse(cleaned) as ExtractedParams;
    } catch (llmErr) {
      console.error('[API/muhurta-search] LLM extraction failed:', llmErr);
      return NextResponse.json(
        { error: 'Failed to understand your query. Please try rephrasing, e.g. "best time for marriage in May in Zurich".' },
        { status: 422 },
      );
    }

    // ── Validate extracted activity ───────────────────────────
    if (
      !extracted.activity ||
      extracted.activity === 'unknown' ||
      !VALID_ACTIVITIES.includes(extracted.activity as ExtendedActivityId)
    ) {
      return NextResponse.json(
        {
          error: `Could not determine activity. Please specify one of: ${VALID_ACTIVITIES.map(id => EXTENDED_ACTIVITIES[id].label.en).join(', ')}.`,
          extractedParams: extracted,
        },
        { status: 422 },
      );
    }

    // ── Resolve location ──────────────────────────────────────
    // Priority: request body lat/lng > LLM-extracted lat/lng
    const lat = body.lat ?? extracted.lat;
    const lng = body.lng ?? extracted.lng;

    if (lat == null || lng == null) {
      return NextResponse.json(
        {
          error: 'Could not determine location. Please provide your city or coordinates.',
          extractedParams: extracted,
        },
        { status: 422 },
      );
    }

    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates: lat must be -90 to 90, lng must be -180 to 180.' },
        { status: 400 },
      );
    }

    // ── Default date range: next 30 days if missing ───────────
    let startDate = extracted.startDate;
    let endDate = extracted.endDate;

    if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      startDate = today;
    }
    if (!endDate || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      endDate = d.toISOString().slice(0, 10);
    }

    // Cap search range to 90 days to bound computation time
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const MAX_RANGE_MS = 90 * 24 * 60 * 60 * 1000;
    if (endMs - startMs > MAX_RANGE_MS) {
      const capped = new Date(startMs + MAX_RANGE_MS);
      endDate = capped.toISOString().slice(0, 10);
    }

    // ── Resolve timezone offset from coordinates ──────────────
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    // Estimate tz offset from longitude (simple heuristic for the search)
    // resolveTimezone needs an IANA string or numeric; use longitude-based estimate
    const estimatedTzOffset = Math.round(lng / 15);
    let tzOffset: number;
    try {
      tzOffset = resolveTimezone(String(estimatedTzOffset), startYear, startMonth, startDay);
    } catch {
      // Fallback to longitude-based estimate
      tzOffset = estimatedTzOffset;
    }

    // ── Build search params ───────────────────────────────────
    const searchParams: SearchParams = {
      activity: extracted.activity as ExtendedActivityId,
      startDate,
      endDate,
      lat,
      lng,
      tzOffset,
    };

    // ── Build user snapshot if birth data provided ────────────
    let userSnapshot: UserSnapshot | undefined;
    if (body.birthData) {
      const bd = body.birthData;
      if (bd.date && bd.time && bd.lat != null && bd.lng != null) {
        // Estimate birth timezone from birth coordinates
        const birthTzOffset = Math.round(bd.lng / 15);
        // Determine IANA-ish timezone string from offset
        const birthTzStr = `Etc/GMT${birthTzOffset >= 0 ? '-' : '+'}${Math.abs(birthTzOffset)}`;

        userSnapshot = {
          birthData: {
            name: '',
            date: bd.date,
            time: bd.time,
            place: '',
            lat: bd.lat,
            lng: bd.lng,
            timezone: birthTzStr,
            ayanamsha: 'lahiri',
          },
        };
      }
    }

    // ── Execute search ────────────────────────────────────────
    const windows = smartMuhurtaSearch(searchParams, userSnapshot);

    return NextResponse.json(
      {
        windows,
        extractedParams: {
          activity: extracted.activity,
          activityLabel: EXTENDED_ACTIVITIES[extracted.activity as ExtendedActivityId].label.en,
          startDate,
          endDate,
          lat,
          lng,
          tzOffset,
        },
      },
      {
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  } catch (err) {
    console.error('[API/muhurta-search] Request failed:', err);
    return NextResponse.json(
      { error: 'Muhurta search failed. Please try again.' },
      { status: 500 },
    );
  }
}
