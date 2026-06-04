/**
 * /api/pandit/invitations/[token]
 *
 * GET — fetch invitation by token. Used by the public-ish
 *       /pandit-invitation/[token] landing page. Returns minimal
 *       Pandit identity + requested permissions + optional message.
 *       Authentication is NOT required (token IS the auth) — but the
 *       invitation must be in 'pending' status and not expired.
 *
 * Pandit CRM P6.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

interface RouteParams {
  params: Promise<{ token: string }>;
}

function getServiceRoleClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(req: Request, ctx: RouteParams) {
  const { token } = await ctx.params;
  if (!token || token.length < 16 || token.length > 200) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 });
  }

  const svc = getServiceRoleClient();
  if (!svc) {
    return NextResponse.json({ error: 'service_unavailable' }, { status: 503 });
  }

  try {
    const { data: invitation, error } = await svc
      .from('pandit_client_invitations')
      .select(`
        id, status, expires_at, sent_at, pandit_message,
        permissions_requested, invited_email, invited_user_id,
        client_record_id, pandit_user_id
      `)
      .eq('invitation_token', token)
      .maybeSingle();
    if (error) {
      console.error('[pandit/invitations GET] query failed:', error.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }
    if (!invitation) {
      return NextResponse.json({ error: 'invitation_not_found' }, { status: 404 });
    }
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: 'invitation_not_pending', status: invitation.status },
        { status: 410 }, // Gone — was once valid, no longer is
      );
    }
    if (new Date(invitation.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'invitation_expired' }, { status: 410 });
    }

    // Hydrate Pandit's display name + letterhead subtitle for the page
    const { data: panditProfile } = await svc
      .from('user_profiles')
      .select('display_name')
      .eq('id', invitation.pandit_user_id)
      .maybeSingle();
    const { data: panditSettings } = await svc
      .from('pandit_settings')
      .select('letterhead_subtitle')
      .eq('pandit_user_id', invitation.pandit_user_id)
      .maybeSingle();

    // Hydrate client record summary (full_name only — Pandit's nickname
    // for the client; not their auth-user info)
    const { data: clientRecord } = await svc
      .from('pandit_clients')
      .select('full_name')
      .eq('id', invitation.client_record_id)
      .maybeSingle();

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        status: invitation.status,
        sent_at: invitation.sent_at,
        expires_at: invitation.expires_at,
        pandit_message: invitation.pandit_message,
        permissions_requested: invitation.permissions_requested,
        invited_email: invitation.invited_email,
        has_existing_account: !!invitation.invited_user_id,
      },
      pandit: {
        display_name: panditProfile?.display_name ?? 'Your Pandit',
        subtitle: panditSettings?.letterhead_subtitle ?? null,
      },
      client_record: {
        full_name: clientRecord?.full_name ?? null,
      },
    });
  } catch (err) {
    console.error('[pandit/invitations GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
