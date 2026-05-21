/**
 * GET /api/brihaspati/balance
 *
 * Returns the authenticated user's Brihaspati balance:
 *   { credits: number, subscription: 'none' | 'monthly' | 'annual',
 *     subscriptionExpiresAt?: string }
 *
 * Used by the panel to decide whether to show the payment UI or
 * proceed straight to question submission.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { getBalance } from '@/lib/brihaspati/credits/credit-manager';

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

    const balance = await getBalance(supabase as never, user.id);
    return NextResponse.json(balance);
  } catch (err) {
    console.error('[brihaspati/balance] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
