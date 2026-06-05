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
import type { SupabaseClient } from '@supabase/supabase-js';
import { authenticatePandit } from '@/lib/pandit/auth';
import { getProfile } from '@/lib/user/get-profile';
import { generateInvitationToken } from '@/lib/pandit/invitation-token';
import { sendEmail } from '@/lib/email/resend-client';
import { panditInvitationEmail } from '@/lib/email/templates/pandit-invitation';
import {
  DEFAULT_REQUESTED_PERMISSIONS,
  type ClientPermissions,
} from '@/lib/pandit/types';

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
 * We deliberately DO NOT pre-resolve invited_email → invited_user_id at
 * invite-time. The previous implementation walked admin.listUsers in
 * 100-row pages up to a 5000-user safety cap, which meant up to 50
 * sequential Supabase Auth API requests on every invitation send —
 * frequently timing out and rate-limiting at scale (Gemini PR #406
 * round P10 narrative #1).
 *
 * Deferring resolution to accept-time is safe because:
 *   - The accept route already backfills invited_user_id from the
 *     authenticated user (token-based identity), so the row is
 *     fully resolved at accept-time anyway.
 *   - The tightened accept route (round 10 #2) treats
 *     invited_user_id === null as "Branch B: email-match fallback"
 *     which is exactly the right path for an existing user who
 *     accepts via the invitation link.
 *   - The Pandit-side UX shows the same "Invitation sent" response
 *     either way, so no information leaks.
 *
 * Long-term: replace with a SECURITY DEFINER SQL function
 * (`get_user_id_by_email(text) returns uuid`) for O(1) lookups when
 * pre-resolution becomes desirable for a downstream feature.
 */

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

    // Refuse to invite if the client is already linked (or in paused linked
    // state). The previous code unconditionally flipped parent.link_state
    // to 'invited' lower down, which would have SEVERED an active link
    // when a Pandit accidentally re-invited a linked client. Gemini PR
    // #406 round 10 narrative #3.
    if (parent.link_state === 'linked' || parent.link_state === 'paused') {
      return NextResponse.json(
        {
          error: 'already_linked',
          message:
            parent.link_state === 'linked'
              ? 'This client is already linked. To change permissions, edit the link from the client detail page.'
              : 'This client\'s link is paused. They can restore it from their own dashboard.',
          link_state: parent.link_state,
        },
        { status: 409 },
      );
    }

    // Already-pending check: returns the existing invitation for resend
    const { data: existing } = await supabase
      .from('pandit_client_invitations')
      .select('id, invitation_token, expires_at')
      .eq('client_record_id', id)
      .eq('status', 'pending')
      .maybeSingle();
    if (existing) {
      // Resend on the existing token — same email_sent reporting shape as
      // the new-invitation path so the UI can surface "saved but email
      // failed" identically in both cases. Gemini PR #406 round 7
      // narrative #4 (silent failure was a real bug on this branch).
      const invitationUrl = `${SITE_URL}/pandit-invitation/${existing.invitation_token}`;
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
        console.error('[pandit/invite POST resend] email send failed:', emailResult.error);
        return NextResponse.json({
          invitation: existing,
          resent: true,
          email_sent: false,
          email_error: emailResult.error,
        });
      }
      return NextResponse.json({
        invitation: existing,
        resent: true,
        email_sent: true,
      });
    }

    // invited_user_id intentionally null at insert time. The accept
    // route backfills it from the authenticated user (see deferred-
    // resolution rationale at the top of this file).
    const token = generateInvitationToken();

    const { data: invitation, error: insertError } = await supabase
      .from('pandit_client_invitations')
      .insert({
        client_record_id: id,
        pandit_user_id: userId,
        invitation_token: token,
        invited_email: invitedEmail,
        invited_user_id: null,
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

    // Flip parent's link_state to 'invited' (the existing trigger
    // stamps link_state_changed_at). RLS gates the update via parent
    // ownership.
    // Error handling: if the link_state flip fails, the invitation
    // row is still inserted — that's by design (Pandit can resend),
    // but we log so we can investigate state drift. Gemini PR #406
    // round 9 narrative #5.
    const { error: linkStateError } = await supabase
      .from('pandit_clients')
      .update({ link_state: 'invited' })
      .eq('id', id);
    if (linkStateError) {
      console.error(
        '[pandit/invite POST] parent link_state flip failed (invitation already inserted):',
        linkStateError.message,
      );
    }

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
  const profile = await getProfile(supabase, userId, ['display_name'] as const, 'pandit/invite');
  const name = (profile?.display_name ?? '').trim();
  return name || 'Your Pandit';
}
