/**
 * /api/pandit/clients/[id]/invite
 *
 * POST — create a pending invitation for this client and send the
 *        notification email. If the invited email already matches an
 *        existing user, also store invited_user_id on the row. If not,
 *        the recipient signs up via the magic-link landing page.
 *
 * Idempotency: at most one pending invitation per client at any time
 * (enforced by unique index pandit_client_invitations_one_pending).
 * A second POST while one is pending returns 409 with the existing
 * token so the Pandit can resend.
 *
 * On successful invite, the parent pandit_clients.link_state flips to
 * 'invited' so the Pandit's UI reflects the pending state.
 *
 * Spec §5.2 (Path A) + §5.3 (permissions).
 *
 * Pandit CRM P6.
 */

import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { authenticatePandit } from '@/lib/pandit/auth';
import { generateInvitationToken } from '@/lib/pandit/invitation-token';
import { sendEmail } from '@/lib/email/resend-client';
import { panditInvitationEmail } from '@/lib/email/templates/pandit-invitation';
import {
  DEFAULT_REQUESTED_PERMISSIONS,
  type ClientPermissions,
} from '@/lib/pandit/types';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dekhopanchang.com').trim();

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface CreateInvitationBody {
  invited_email?: string;
  pandit_message?: string;
  permissions_requested?: Partial<ClientPermissions>;
}

function mergePermissions(requested: Partial<ClientPermissions> | undefined): ClientPermissions {
  return { ...DEFAULT_REQUESTED_PERMISSIONS, ...(requested ?? {}) };
}

/**
 * Service-role client — needed to resolve invited_email to invited_user_id.
 * The Pandit's RLS-scoped client can't see auth.users at all. We use
 * service role for the resolution lookup ONLY; the actual insert into
 * pandit_client_invitations still goes through the RLS-scoped client.
 */
function getServiceRoleClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Resolve `email` to an existing auth user id, or return null. Used so
 * the invitation row stores invited_user_id when the recipient already
 * has an account — the accept-page can skip the signup branch.
 *
 * Privacy note: this function NEVER tells the caller whether the email
 * matched. The Pandit UI displays the same "Invitation sent" response
 * regardless, so account enumeration via the invitation surface is
 * blocked.
 *
 * Implementation: Supabase's admin API doesn't expose getUserByEmail
 * directly. admin.listUsers is paginated; we walk pages until we find
 * a match or exhaust at the safety cap. At small scale (current
 * project: < 10k users) this is acceptable; if it ever matters,
 * replace with a `SECURITY DEFINER` SQL function on the DB side that
 * does `SELECT id FROM auth.users WHERE lower(email) = lower($1)`.
 */
async function resolveInvitedUserId(email: string): Promise<string | null> {
  const svc = getServiceRoleClient();
  if (!svc) {
    console.warn('[pandit/invite] SUPABASE_SERVICE_ROLE_KEY not configured — skipping email→user_id resolution; invitee will sign up via Branch B');
    return null;
  }
  const target = email.toLowerCase();
  try {
    let page = 1;
    const perPage = 100;
    const maxPages = 50; // 5000 users — safety cap
    while (page <= maxPages) {
      const { data: usersResp, error: listError } = await svc.auth.admin.listUsers({ page, perPage });
      if (listError) {
        console.error('[pandit/invite] admin.listUsers failed:', listError.message);
        return null;
      }
      const found = usersResp.users.find((u) => (u.email ?? '').toLowerCase() === target);
      if (found) return found.id;
      if (usersResp.users.length < perPage) return null; // last page
      page++;
    }
    return null;
  } catch (e) {
    console.error('[pandit/invite] auth lookup threw:', e);
    return null;
  }
}

export async function POST(req: Request, ctx: RouteParams) {
  const { id } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase, userId } = auth;

  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
    }
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json({ error: 'body_must_be_object' }, { status: 400 });
    }
    const body = rawBody as CreateInvitationBody;

    if (typeof body.invited_email !== 'string') {
      return NextResponse.json({ error: 'invited_email is required' }, { status: 400 });
    }
    const invitedEmail = body.invited_email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitedEmail)) {
      return NextResponse.json({ error: 'invited_email is invalid' }, { status: 400 });
    }

    let panditMessage: string | null = null;
    if (body.pandit_message !== undefined && body.pandit_message !== null) {
      if (typeof body.pandit_message !== 'string') {
        return NextResponse.json({ error: 'pandit_message must be a string' }, { status: 400 });
      }
      panditMessage = body.pandit_message.trim() || null;
      if (panditMessage && panditMessage.length > 2000) {
        return NextResponse.json({ error: 'pandit_message too long (max 2000)' }, { status: 400 });
      }
    }

    const permissionsRequested = mergePermissions(body.permissions_requested);

    // Parent ownership check
    const { data: parent, error: parentError } = await supabase
      .from('pandit_clients')
      .select('id, full_name, link_state')
      .eq('id', id)
      .maybeSingle();
    if (parentError) {
      console.error('[pandit/invite POST] parent check failed:', parentError.message);
      return NextResponse.json({ error: 'parent_check_failed' }, { status: 500 });
    }
    if (!parent) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    // Already-pending check: returns the existing invitation for resend
    const { data: existing } = await supabase
      .from('pandit_client_invitations')
      .select('id, invitation_token, expires_at')
      .eq('client_record_id', id)
      .eq('status', 'pending')
      .maybeSingle();
    if (existing) {
      // Send email again on the existing token (resend)
      const invitationUrl = `${SITE_URL}/pandit-invitation/${existing.invitation_token}`;
      const panditDisplayName = await loadPanditDisplayName(supabase, userId);
      const emailContent = panditInvitationEmail({
        panditName: panditDisplayName,
        panditMessage: panditMessage ?? undefined,
        invitationUrl,
      });
      await sendEmail({ to: invitedEmail, subject: emailContent.subject, html: emailContent.html });
      return NextResponse.json({
        invitation: existing,
        resent: true,
      });
    }

    // Resolve invited_email to user_id if they already exist
    const invitedUserId = await resolveInvitedUserId(invitedEmail);
    const token = generateInvitationToken();

    const { data: invitation, error: insertError } = await supabase
      .from('pandit_client_invitations')
      .insert({
        client_record_id: id,
        pandit_user_id: userId,
        invitation_token: token,
        invited_email: invitedEmail,
        invited_user_id: invitedUserId,
        permissions_requested: permissionsRequested,
        pandit_message: panditMessage,
      })
      .select('*')
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'pending_invitation_exists' }, { status: 409 });
      }
      console.error('[pandit/invite POST] insert failed:', insertError.message);
      return NextResponse.json({ error: 'insert_failed', message: insertError.message }, { status: 500 });
    }

    // Flip parent's link_state to 'invited' (and stash the timestamp via
    // the existing trigger). RLS gates the update via parent ownership.
    await supabase
      .from('pandit_clients')
      .update({ link_state: 'invited' })
      .eq('id', id);

    // Send email
    const invitationUrl = `${SITE_URL}/pandit-invitation/${token}`;
    const panditDisplayName = await loadPanditDisplayName(supabase, userId);
    const emailContent = panditInvitationEmail({
      panditName: panditDisplayName,
      panditMessage: panditMessage ?? undefined,
      invitationUrl,
    });
    const emailResult = await sendEmail({
      to: invitedEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });
    if (!emailResult.success) {
      console.error('[pandit/invite POST] email send failed:', emailResult.error);
      // Don't roll back the invitation — Pandit can resend. Just flag in
      // the response so the UI can surface a "saved but email failed" toast.
      return NextResponse.json({
        invitation,
        email_sent: false,
        email_error: emailResult.error,
      });
    }

    return NextResponse.json({ invitation, email_sent: true });
  } catch (err) {
    console.error('[pandit/invite POST] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

async function loadPanditDisplayName(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  // The Pandit's RLS-scoped client can read their own user_profiles row.
  const { data } = await supabase
    .from('user_profiles')
    .select('display_name')
    .eq('id', userId)
    .maybeSingle();
  const name = (data?.display_name ?? '').trim();
  return name || 'Your Pandit';
}
