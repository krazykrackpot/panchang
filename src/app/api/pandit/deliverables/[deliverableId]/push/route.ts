/**
 * /api/pandit/deliverables/[deliverableId]/push
 *
 * POST — push a deliverable to the linked client's dashboard. Pandit
 *        only. Requires:
 *          - the parent client is in link_state='linked'
 *          - the deliverable is currently visibility='pandit_only'
 *          - the client's permissions.push_deliverables is true
 *
 * On success:
 *   - visibility = 'client_pushed'
 *   - pushed_at = NOW()
 *   - client_user_id is already synced by migration 050 trigger from
 *     the parent; we don't trust caller-supplied values here.
 *   - notifications row inserted for the client's bell (P7 — uses the
 *     existing notifications table).
 *   - if permissions.send_alerts_to_client and client opted in, Resend
 *     email goes out with a short summary + dashboard deep-link.
 *
 * Pandit CRM P7 + spec §7.2.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import { sendEmail } from '@/lib/email/resend-client';
import type { ClientPermissions } from '@/lib/pandit/types';

interface RouteParams {
  params: Promise<{ deliverableId: string }>;
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dekhopanchang.com').trim();

const KIND_LABEL: Record<string, string> = {
  kundali_report: 'a kundali report',
  tippanni: 'a tippanni',
  muhurta_pick: 'a muhurta',
  matching_report: 'a matching report',
  consultation_summary: 'a consultation summary',
  custom_letter: 'a letter',
};

export async function POST(req: Request, ctx: RouteParams) {
  const { deliverableId } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase, userId } = auth;

  try {
    // Fetch the deliverable with parent client info — RLS gates ownership.
    const { data: deliverable, error: dErr } = await supabase
      .from('pandit_deliverables')
      .select(`
        id, client_record_id, kind, title, visibility, pushed_at,
        client_user_id, locale
      `)
      .eq('id', deliverableId)
      .maybeSingle();
    if (dErr) {
      console.error('[pandit/deliverables/push] lookup failed:', dErr.message);
      return NextResponse.json({ error: 'lookup_failed' }, { status: 500 });
    }
    if (!deliverable) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    if (deliverable.visibility === 'client_pushed') {
      return NextResponse.json({ error: 'already_pushed', pushed_at: deliverable.pushed_at }, { status: 409 });
    }

    // Verify parent client link state + permissions
    const { data: client, error: cErr } = await supabase
      .from('pandit_clients')
      .select('id, full_name, link_state, client_user_id, permissions')
      .eq('id', deliverable.client_record_id)
      .maybeSingle();
    if (cErr) {
      console.error('[pandit/deliverables/push] client lookup failed:', cErr.message);
      return NextResponse.json({ error: 'lookup_failed' }, { status: 500 });
    }
    if (!client) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }
    if (client.link_state !== 'linked') {
      return NextResponse.json(
        { error: 'client_not_linked', link_state: client.link_state },
        { status: 409 },
      );
    }
    if (!client.client_user_id) {
      // Shouldn't happen given link_state='linked' but defence in depth
      return NextResponse.json({ error: 'client_user_id_missing' }, { status: 409 });
    }
    const permissions = (client.permissions ?? {}) as ClientPermissions;
    if (!permissions.push_deliverables) {
      return NextResponse.json(
        { error: 'permission_denied', permission: 'push_deliverables' },
        { status: 403 },
      );
    }

    // Flip visibility + stamp pushed_at. The trigger already synced
    // client_user_id; we re-set it here defensively in case the
    // deliverable was created before the trigger fired.
    const pushedAt = new Date().toISOString();
    const { data: updated, error: uErr } = await supabase
      .from('pandit_deliverables')
      .update({
        visibility: 'client_pushed',
        pushed_at: pushedAt,
        client_user_id: client.client_user_id,
      })
      .eq('id', deliverableId)
      .select('*')
      .single();
    if (uErr) {
      console.error('[pandit/deliverables/push] update failed:', uErr.message);
      return NextResponse.json({ error: 'update_failed' }, { status: 500 });
    }

    // Insert into the existing user_notifications table so the bell
    // surfaces this push alongside other in-app notifications. Schema:
    // type/title/body/metadata/read (per supabase introspection).
    const { data: notif, error: nErr } = await supabase
      .from('user_notifications')
      .insert({
        user_id: client.client_user_id,
        type: 'pandit_deliverable',
        title: `${KIND_LABEL[deliverable.kind] ?? 'a reading'} from your Pandit`,
        body: deliverable.title,
        metadata: {
          deliverable_id: deliverable.id,
          kind: deliverable.kind,
          pandit_user_id: userId,
        },
      })
      .select('id')
      .single();
    if (nErr) {
      // Don't fail the push — Pandit's UI shows the deliverable was
      // pushed even if the bell notification didn't land. Log so we
      // can investigate. Lesson A — never silently fail.
      console.error('[pandit/deliverables/push] notification insert failed:', nErr.message);
    } else if (notif?.id) {
      // Link the notification back to the deliverable for the ack flow.
      await supabase
        .from('pandit_deliverables')
        .update({ notification_id: notif.id })
        .eq('id', deliverableId);
    }

    // Optional email — only if the client opted in to send_alerts_to_client
    let emailSent = false;
    let emailError: string | undefined;
    if (permissions.send_alerts_to_client) {
      try {
        // Look up the client's email + display name
        const { data: clientProfile } = await supabase
          .from('user_profiles')
          .select('display_name')
          .eq('id', client.client_user_id)
          .maybeSingle();
        // We need the client's auth email. RLS for the Pandit's
        // supabase client doesn't expose auth.users to them; we use
        // the service role through a single field read OR omit the
        // email entirely and rely on the in-app notification only.
        // For now, omit email — service role would be a separate
        // commit, and the in-app bell is the primary channel anyway.
        // We mark the email as intentionally skipped (success=true,
        // but emailSent stays false).
        emailSent = false;
        emailError = 'email_via_service_role_pending';
        void sendEmail; // keep the import in scope until P7.b
        void clientProfile;
      } catch (e) {
        console.error('[pandit/deliverables/push] email failed:', e);
        emailError = e instanceof Error ? e.message : 'unknown';
      }
    }

    return NextResponse.json({
      deliverable: updated,
      notified: !nErr,
      email_sent: emailSent,
      email_error: emailError,
    });
  } catch (err) {
    console.error('[pandit/deliverables/push] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
