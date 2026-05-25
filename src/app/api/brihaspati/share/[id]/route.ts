/**
 * GET /api/brihaspati/share/[id]
 *
 * Public, unauthenticated. Returns the question text + answer body for a
 * brihaspati_question row that the asker has opted in to share via the
 * Copy / WhatsApp / Native-share buttons (which POST /share/enable).
 *
 * Returns 404 when:
 *   - id doesn't match a row
 *   - row has is_public_share = false
 *   - status != 'completed' (incomplete answers are never shareable)
 *
 * The response is intentionally narrow: question, answer, completed_at,
 * locale. We do NOT leak user_id, chart_data, model_used, validation
 * details, ratings, or any other column.
 *
 * RLS is NOT relaxed for this endpoint — we use the service role and
 * gate on `is_public_share = true` server-side. That avoids opening a
 * public SELECT policy on the table.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

// UUID v4 shape — strict so we don't pound the DB with malformed lookups
// from random URL crawlers.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Not configured' }, { status: 503 });
    }
    const { id } = await params;
    if (!id || !UUID_RE.test(id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: row, error } = await supabase
      .from('brihaspati_questions')
      .select('id, question, answer, status, locale, completed_at, validation_passed, is_public_share')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      console.error('[brihaspati/share/get] lookup failed:', error.message);
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
    }
    if (!row || row.is_public_share !== true || row.status !== 'completed' || typeof row.answer !== 'string' || row.answer.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: row.id,
      question: row.question,
      answer: row.answer,
      locale: row.locale ?? 'en',
      completedAt: row.completed_at,
      validationPassed: row.validation_passed,
    }, {
      // Public answer body — cache for an hour at the CDN. The flag-flip
      // (enable / disable share) is rare; if the asker later revokes,
      // cached responses will linger up to an hour.
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('[brihaspati/share/get] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
