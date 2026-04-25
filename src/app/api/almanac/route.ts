import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateAlmanac } from '@/lib/personalization/almanac-engine';

const MIN_JOURNAL_ENTRIES = 10;

// ---------------------------------------------------------------------------
// GET /api/almanac?year=2026
// Requires: Authorization: Bearer <token>
// Returns: AlmanacReport JSON
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  // --- Auth ---
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // --- Parse year ---
  const yearParam = req.nextUrl.searchParams.get('year');
  if (!yearParam || !/^\d{4}$/.test(yearParam)) {
    return NextResponse.json({ error: 'year must be a 4-digit integer' }, { status: 400 });
  }
  const year = parseInt(yearParam, 10);
  if (year < 2020 || year > 2100) {
    return NextResponse.json({ error: 'year must be between 2020 and 2100' }, { status: 400 });
  }

  // --- Check minimum data threshold ---
  const dateFrom = `${year}-01-01`;
  const dateTo   = `${year}-12-31`;

  const { count, error: countErr } = await supabase
    .from('astro_journal')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('entry_date', dateFrom)
    .lte('entry_date', dateTo);

  if (countErr) {
    console.error('[almanac] entry count failed:', countErr);
    return NextResponse.json({ error: 'Failed to check journal entries' }, { status: 500 });
  }

  const entryCount = count ?? 0;
  if (entryCount < MIN_JOURNAL_ENTRIES) {
    return NextResponse.json(
      {
        error: 'insufficient_data',
        message: `Your ${year} almanac needs at least ${MIN_JOURNAL_ENTRIES} journal entries. You have ${entryCount} so far.`,
        entryCount,
        required: MIN_JOURNAL_ENTRIES,
      },
      { status: 400 },
    );
  }

  // --- Generate almanac ---
  try {
    const report = await generateAlmanac(user.id, year, supabase);
    return NextResponse.json({ report }, { status: 200 });
  } catch (err) {
    console.error('[almanac] generate failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate almanac' },
      { status: 500 },
    );
  }
}
