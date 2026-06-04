/**
 * /api/pandit/calendar?month=YYYY-MM
 *
 * GET — list every alert across the Pandit's roster that fires
 *       within the given calendar month. Each row is joined with
 *       the parent client's full_name + color so the UI can render
 *       per-client visual treatment without a second round-trip.
 *
 * Date semantics: month boundaries are inclusive of the first day
 * and exclusive of the next-month first day. Server-side date math
 * uses UTC; client-side filtering should respect the Pandit's
 * timezone (default UTC if no preference).
 *
 * Auth: Bearer JWT of an account_type='pandit' user.
 *
 * Pandit CRM P11.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';

export async function GET(req: Request) {
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  const { searchParams } = new URL(req.url);
  const month = (searchParams.get('month') ?? '').trim();
  // Validate format YYYY-MM with strict integer range guard. Reject
  // anything that doesn't parse to a real calendar month.
  if (!/^(\d{4})-(\d{2})$/.test(month)) {
    return NextResponse.json(
      { error: 'invalid_month', message: 'month must be YYYY-MM' },
      { status: 400 },
    );
  }
  const [yStr, mStr] = month.split('-');
  const year = Number(yStr);
  const monthIdx = Number(mStr); // 1-12
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(monthIdx) ||
    year < 1900 ||
    year > 2200 ||
    monthIdx < 1 ||
    monthIdx > 12
  ) {
    return NextResponse.json({ error: 'invalid_month' }, { status: 400 });
  }

  // Window: [first of month, first of next month). Use Date.UTC to
  // avoid the server's local-tz interpreting the args (CLAUDE.md
  // lesson L). Format as ISO date strings since pandit_alerts.fires_at
  // is a DATE column.
  const monthStart = new Date(Date.UTC(year, monthIdx - 1, 1));
  const monthEnd = new Date(Date.UTC(year, monthIdx, 1)); // first of next month
  const toIso = (d: Date) => d.toISOString().slice(0, 10);

  try {
    const { data: alerts, error: alertsErr } = await supabase
      .from('pandit_alerts')
      .select(
        'id, client_record_id, kind, fires_at, severity, payload, acknowledged_at, client:pandit_clients!inner(id, full_name, color, link_state)',
      )
      .gte('fires_at', toIso(monthStart))
      .lt('fires_at', toIso(monthEnd))
      .order('fires_at', { ascending: true });

    if (alertsErr) {
      console.error('[pandit/calendar GET] alerts query failed:', alertsErr.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }

    return NextResponse.json({
      month,
      events: alerts ?? [],
    });
  } catch (err) {
    console.error('[pandit/calendar GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
