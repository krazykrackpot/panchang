// DELETE /api/whatsapp/optout
//
// Soft-delete the authenticated user's active WhatsApp subscription.
// Idempotent: calling on an already-opted-out user returns 200 with
// already_opted_out=true.
//
// Auth: Bearer token.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: sub, error: lookupErr } = await supabase
    .from('user_whatsapp_subscriptions')
    .select('id, phone_e164, opted_out_at')
    .eq('user_id', user.id)
    .is('opted_out_at', null)
    .maybeSingle();

  if (lookupErr) {
    console.error('[whatsapp/optout] lookup failed:', lookupErr);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
  if (!sub) {
    return NextResponse.json({ opted_out: true, already_opted_out: true });
  }

  const { error: updateErr } = await supabase
    .from('user_whatsapp_subscriptions')
    .update({
      opted_out_at: new Date().toISOString(),
      opt_out_reason: 'user_dashboard',
    })
    .eq('id', sub.id);

  if (updateErr) {
    console.error('[whatsapp/optout] update failed:', updateErr);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  return NextResponse.json({ opted_out: true, phone_e164: sub.phone_e164 });
}
