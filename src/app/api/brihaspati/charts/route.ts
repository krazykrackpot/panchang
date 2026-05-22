/**
 * GET /api/brihaspati/charts
 *
 * Returns the authenticated user's saved charts in a shape the Brihaspati
 * panel can present in a subject picker. Used by the panel UI to show
 * "Asking about: Me | Vaibhavi | Arjun | …" and by the order route to
 * auto-detect the subject from the question text.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Not configured' }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7));
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('saved_charts')
      .select('id, label, is_primary, chart_data, birth_data')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[brihaspati/charts] read failed:', error.message);
      return NextResponse.json({ error: 'Failed to load charts' }, { status: 500 });
    }

    const charts = (data ?? []).map((c) => ({
      id: c.id as string,
      label: c.label as string,
      is_primary: c.is_primary as boolean,
      // `has_computed` tells the panel whether asking about this chart
      // will trigger an on-demand compute (slower first time).
      has_computed: c.chart_data != null,
      // `has_birth_data` is reported so the panel can flag any chart
      // that's just a placeholder label without enough data to compute.
      has_birth_data: c.birth_data != null,
    }));

    return NextResponse.json({ charts });
  } catch (err) {
    console.error('[brihaspati/charts] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
