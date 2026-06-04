/**
 * /api/pandit/invitations/[token]/accept
 *
 * POST — accept the invitation. The authenticated user becomes the
 *        linked client on the Pandit's record. Transitions
 *        pandit_clients.link_state to 'linked' and sets client_user_id
 *        — the migration 053 trigger then syncs birth_data from the
 *        user's profile. The migration 050 trigger propagates
 *        client_user_id to all child tables.
 *
 * Auth: standard Bearer token of the recipient (NOT a Pandit). The
 * server verifies the JWT user's email matches invitation.invited_email
 * (case-insensitive) or that invited_user_id is already set to the
 * authenticated user's id.
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

interface AcceptBody {
  permissions_granted?: Record<string, boolean>;
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

  // Verify the user's JWT
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${userToken}` } },
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser(userToken);
  if (userError || !user) {
    console.error('[pandit/invitations/accept] auth failed:', userError?.message);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Parse body (optional permissions overrides)
  let body: AcceptBody = {};
  try {
    const raw = await req.json();
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      body = raw as AcceptBody;
    }
  } catch {
    // Empty body is OK — defaults to requested permissions.
  }

  const svc = getServiceRoleClient();
  if (!svc) {
    return NextResponse.json({ error: 'service_unavailable' }, { status: 503 });
  }

  try {
    // Fetch invitation
    const { data: invitation, error: invError } = await svc
      .from('pandit_client_invitations')
      .select('id, status, expires_at, invited_email, invited_user_id, client_record_id, permissions_requested')
      .eq('invitation_token', invitationToken)
      .maybeSingle();
    if (invError) {
      console.error('[pandit/invitations/accept] invitation lookup failed:', invError.message);
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

    // Verify the authenticated user matches the invitation. Either:
    //   - invited_user_id matches user.id (resolved at invite-time), OR
    //   - invited_email matches user.email (case-insensitive)
    const userEmail = (user.email ?? '').toLowerCase();
    const isMatch =
      invitation.invited_user_id === user.id ||
      (userEmail && userEmail === invitation.invited_email.toLowerCase());
    if (!isMatch) {
      console.warn(
        `[pandit/invitations/accept] user ${user.id} (${userEmail}) tried to accept invitation for ${invitation.invited_email}`,
      );
      return NextResponse.json({ error: 'invitation_not_for_you' }, { status: 403 });
    }

    // Merge permissions: requested ∩ granted (only the keys the Pandit
    // asked for can be turned on; the recipient can untick to deny).
    const requested = (invitation.permissions_requested as Record<string, boolean>) ?? {};
    const granted = body.permissions_granted ?? {};
    const effective: Record<string, boolean> = {};
    for (const [key, askedFor] of Object.entries(requested)) {
      // Pandit had to ask for it; recipient gets the final say.
      // Default to asked-for value if recipient didn't toggle.
      effective[key] = askedFor
        ? (Object.prototype.hasOwnProperty.call(granted, key) ? granted[key] : true)
        : false;
    }

    // Update invitation status
    const { error: updateInvError } = await svc
      .from('pandit_client_invitations')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString(),
        invited_user_id: user.id, // backfill if it was null
      })
      .eq('id', invitation.id);
    if (updateInvError) {
      console.error('[pandit/invitations/accept] invitation update failed:', updateInvError.message);
      return NextResponse.json({ error: 'update_failed' }, { status: 500 });
    }

    // Link the parent pandit_clients row. The migration 053 trigger
    // syncs birth_data from user_profiles on the link transition; the
    // migration 050 trigger propagates client_user_id to children.
    const { error: linkError } = await svc
      .from('pandit_clients')
      .update({
        client_user_id: user.id,
        link_state: 'linked',
        permissions: effective,
      })
      .eq('id', invitation.client_record_id);
    if (linkError) {
      console.error('[pandit/invitations/accept] link update failed:', linkError.message);
      // Roll back the invitation status (best-effort) — the user can
      // retry accept after this gets resolved.
      await svc
        .from('pandit_client_invitations')
        .update({ status: 'pending', responded_at: null })
        .eq('id', invitation.id);
      return NextResponse.json({ error: 'link_failed', message: linkError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      effective_permissions: effective,
      client_record_id: invitation.client_record_id,
    });
  } catch (err) {
    console.error('[pandit/invitations/accept] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
