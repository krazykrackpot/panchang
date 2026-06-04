/**
 * /api/pandit/invitations/[token]/decline
 *
 * POST — decline the invitation. Same auth model as accept: the
 *        recipient's JWT email (or pre-resolved invited_user_id) must
 *        match the invitation. On success: invitation.status='declined',
 *        parent pandit_clients.link_state='declined'. Pandit can
 *        re-invite after 30d cooldown.
 *
 * Pandit CRM P6.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

interface RouteParams {
  params: Promise<{ token: string }>;
}

function bearerToken(req: Request): string | null {
  const h = req.headers.get('authorization');
  if (!h?.toLowerCase().startsWith('bearer ')) return null;
  return h.slice(7).trim() || null;
}

function getServiceRoleClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: Request, ctx: RouteParams) {
  const { token: invitationToken } = await ctx.params;
  const userToken = bearerToken(req);
  if (!userToken) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${userToken}` } },
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser(userToken);
  if (userError || !user) {
    console.error('[pandit/invitations/decline] auth failed:', userError?.message);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const svc = getServiceRoleClient();
  if (!svc) {
    return NextResponse.json({ error: 'service_unavailable' }, { status: 503 });
  }

  try {
    const { data: invitation, error: invError } = await svc
      .from('pandit_client_invitations')
      .select('id, status, expires_at, invited_email, invited_user_id, client_record_id')
      .eq('invitation_token', invitationToken)
      .maybeSingle();
    if (invError) {
      console.error('[pandit/invitations/decline] lookup failed:', invError.message);
      return NextResponse.json({ error: 'lookup_failed' }, { status: 500 });
    }
    if (!invitation) {
      return NextResponse.json({ error: 'invitation_not_found' }, { status: 404 });
    }
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'invitation_not_pending', status: invitation.status },
        { status: 410 },
      );
    }
    if (new Date(invitation.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'invitation_expired' }, { status: 410 });
    }

    const userEmail = (user.email ?? '').toLowerCase();
    const isMatch =
      invitation.invited_user_id === user.id ||
      (userEmail && userEmail === invitation.invited_email.toLowerCase());
    if (!isMatch) {
      return NextResponse.json({ error: 'invitation_not_for_you' }, { status: 403 });
    }

    const { error: updateInvError } = await svc
      .from('pandit_client_invitations')
      .update({
        status: 'declined',
        responded_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);
    if (updateInvError) {
      console.error('[pandit/invitations/decline] invitation update failed:', updateInvError.message);
      return NextResponse.json({ error: 'update_failed' }, { status: 500 });
    }

    // Flip parent pandit_clients.link_state to 'declined' so the Pandit's
    // UI shows the rejection. No client_user_id is set.
    await svc
      .from('pandit_clients')
      .update({ link_state: 'declined' })
      .eq('id', invitation.client_record_id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pandit/invitations/decline] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
