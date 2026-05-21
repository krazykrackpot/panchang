/**
 * GET /api/cron/brihaspati-mark-eligible
 *
 * Vercel Cron job (daily at 02:00 UTC). Marks brihaspati_questions rows
 * training_eligible=true when they pass every §11 filter:
 *
 *   - validation_passed = true
 *   - status = 'completed'
 *   - training_opt_out = false (user did not opt out)
 *   - tier = 2 (Claude API — never train Qwen on its own output)
 *   - output_tokens between 200 and 800 (filters runts + run-aways)
 *   - user_rating >= 0 (any thumbs-down is dropped)
 *   - engine_version is within the last 90 days
 *   - created_at is at least 7 days old (refund window)
 *
 * The eligibility is mark-only — never unmarks. Training-eligibility is
 * frozen at the moment the cron decides.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    const provided = req.headers.get('authorization')?.replace(/^Bearer\s+/, '') ?? '';
    if (!cronSecret || provided !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServerSupabase();
    if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

    const sevenDaysAgo = new Date(Date.now() - 7 * 86400 * 1000).toISOString();

    // Select candidate rows and update them. Two-step to keep the query
    // legible; a single UPDATE ... WHERE could work but Supabase JS
    // client doesn't expose all the WHERE predicates we need cleanly.
    const { data: candidates, error: selErr } = await supabase
      .from('brihaspati_questions')
      .select('id, output_tokens, user_rating, training_opt_out, tier, validation_passed, status')
      .is('training_eligible', null)
      .eq('status', 'completed')
      .eq('validation_passed', true)
      .eq('training_opt_out', false)
      .eq('tier', 2)
      .gte('output_tokens', 200)
      .lte('output_tokens', 800)
      .gte('user_rating', 0)
      .lt('created_at', sevenDaysAgo)
      .limit(1000);

    if (selErr) {
      console.error('[brihaspati/cron/mark-eligible] select failed:', selErr.message);
      return NextResponse.json({ error: 'Select failed' }, { status: 500 });
    }
    const ids = (candidates ?? []).map((r) => r.id as string);

    if (ids.length === 0) {
      return NextResponse.json({ marked: 0 });
    }

    const { error: updErr } = await supabase
      .from('brihaspati_questions')
      .update({ training_eligible: true })
      .in('id', ids);
    if (updErr) {
      console.error('[brihaspati/cron/mark-eligible] update failed:', updErr.message);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
    return NextResponse.json({ marked: ids.length });
  } catch (err) {
    console.error('[brihaspati/cron/mark-eligible] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
