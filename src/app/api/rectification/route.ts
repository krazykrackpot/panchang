/**
 * POST /api/rectification
 *
 * Birth Time Rectification API endpoint.
 * Accepts birth data + life events, returns ranked candidate birth times.
 *
 * Auth: Bearer token required.
 * Timeout budget: ~5-10 s for typical input (90 candidates).
 */

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { rectifyBirthTime } from '@/lib/rectification/rectification-engine';
import type { RectificationInput, LifeEvent } from '@/lib/rectification/types';

// Valid event types — must match the LifeEvent['type'] union
const VALID_EVENT_TYPES = new Set<LifeEvent['type']>([
  'marriage', 'child_birth', 'career_change', 'illness', 'parent_death',
  'relocation', 'financial_gain', 'financial_loss', 'education',
]);

export async function POST(request: Request) {
  // --- Auth ---
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    console.error('[rectification] Auth failed:', authErr?.message ?? 'No user');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // --- Parse & validate input ---
  let body: RectificationInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Required: birthDate
  if (!body.birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(body.birthDate)) {
    return NextResponse.json(
      { error: 'birthDate is required in YYYY-MM-DD format' },
      { status: 400 }
    );
  }
  const [year, month, day] = body.birthDate.split('-').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return NextResponse.json({ error: 'birthDate values out of range' }, { status: 400 });
  }

  // Required: coordinates
  if (typeof body.birthLat !== 'number' || typeof body.birthLng !== 'number') {
    return NextResponse.json(
      { error: 'birthLat and birthLng are required numbers' },
      { status: 400 }
    );
  }
  if (Math.abs(body.birthLat) > 90 || Math.abs(body.birthLng) > 180) {
    return NextResponse.json(
      { error: 'Coordinates out of range: lat [-90,90], lng [-180,180]' },
      { status: 400 }
    );
  }

  // Required: timezone (numeric offset)
  if (typeof body.birthTimezone !== 'number') {
    return NextResponse.json(
      { error: 'birthTimezone is required (numeric UTC offset, e.g. 5.5 for IST)' },
      { status: 400 }
    );
  }

  // Optional: approximateTime
  if (body.approximateTime && !/^\d{2}:\d{2}$/.test(body.approximateTime)) {
    return NextResponse.json(
      { error: 'approximateTime must be HH:MM format' },
      { status: 400 }
    );
  }

  // Optional: timeRange
  if (body.timeRange) {
    if (
      !body.timeRange.from || !body.timeRange.to ||
      !/^\d{2}:\d{2}$/.test(body.timeRange.from) ||
      !/^\d{2}:\d{2}$/.test(body.timeRange.to)
    ) {
      return NextResponse.json(
        { error: 'timeRange.from and timeRange.to must be HH:MM format' },
        { status: 400 }
      );
    }
  }

  // Required: at least 1 event
  if (!Array.isArray(body.events) || body.events.length === 0) {
    return NextResponse.json(
      { error: 'At least one life event is required' },
      { status: 400 }
    );
  }

  // Validate each event
  for (let i = 0; i < body.events.length; i++) {
    const ev = body.events[i];
    if (!ev.type || !VALID_EVENT_TYPES.has(ev.type as LifeEvent['type'])) {
      return NextResponse.json(
        { error: `events[${i}].type is invalid. Must be one of: ${[...VALID_EVENT_TYPES].join(', ')}` },
        { status: 400 }
      );
    }
    if (!ev.date || !/^\d{4}-\d{2}-\d{2}$/.test(ev.date)) {
      return NextResponse.json(
        { error: `events[${i}].date must be YYYY-MM-DD format` },
        { status: 400 }
      );
    }
  }

  // --- Run rectification ---
  try {
    const result = rectifyBirthTime(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[rectification] Engine error:', err);
    return NextResponse.json(
      { error: 'Rectification computation failed' },
      { status: 500 }
    );
  }
}
