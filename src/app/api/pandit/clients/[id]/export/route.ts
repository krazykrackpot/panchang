/**
 * /api/pandit/clients/[id]/export
 *
 * GET — return the full data bundle for a single client owned by the
 *       authenticated Pandit. Includes the parent pandit_clients row
 *       plus every related row across pandit_family_members,
 *       pandit_consultations, pandit_deliverables, pandit_alerts,
 *       and pandit_client_invitations.
 *
 * GDPR-relevant: Pandits often need to hand over (or destroy) a
 * complete copy of a client's data on request. This endpoint
 * returns ONE authoritative JSON payload — no follow-up queries
 * required to reconstruct.
 *
 * Format: { client, family, consultations, deliverables, alerts,
 *           invitations, exported_at, schema_version }. Plain JSON,
 *           no PII filtering — the Pandit owns this data.
 *
 * Auth: Bearer JWT of an account_type='pandit' user. RLS guards
 *       cross-tenant access (the WHERE pandit_user_id = auth.uid()
 *       baked into every child-table policy).
 *
 * Pandit CRM P11.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const SCHEMA_VERSION = 1 as const;

export async function GET(req: Request, ctx: RouteParams) {
  const { id } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
    // Parent ownership check via RLS — if the row exists for this
    // Pandit, the select returns it; otherwise null.
    const { data: client, error: clientErr } = await supabase
      .from('pandit_clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (clientErr) {
      console.error('[pandit/export GET] client load failed:', clientErr.message);
      return NextResponse.json({ error: 'client_load_failed' }, { status: 500 });
    }
    if (!client) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    // Fetch all related rows in parallel. RLS scopes each query to
    // rows the Pandit owns; we additionally filter by client_record_id
    // so the bundle only contains data for THIS client.
    const [
      familyRes,
      consultationsRes,
      deliverablesRes,
      alertsRes,
      invitationsRes,
    ] = await Promise.all([
      supabase
        .from('pandit_family_members')
        .select('*')
        .eq('client_record_id', id)
        .order('created_at', { ascending: true }),
      supabase
        .from('pandit_consultations')
        .select('*')
        .eq('client_record_id', id)
        .order('consulted_at', { ascending: false }),
      supabase
        .from('pandit_deliverables')
        .select('*')
        .eq('client_record_id', id)
        .order('created_at', { ascending: false }),
      supabase
        .from('pandit_alerts')
        .select('*')
        .eq('client_record_id', id)
        .order('fires_at', { ascending: false }),
      supabase
        .from('pandit_client_invitations')
        .select('id, status, invited_email, invited_user_id, permissions_requested, expires_at, created_at, responded_at')
        .eq('client_record_id', id)
        .order('created_at', { ascending: false }),
    ]);

    // Collect any per-section errors but DON'T fail the whole export
    // — the partial bundle is more useful than a 500. Errors land in
    // `_partial_errors` so downstream consumers can flag.
    const partialErrors: Array<{ section: string; error: string }> = [];
    for (const [section, res] of [
      ['family', familyRes],
      ['consultations', consultationsRes],
      ['deliverables', deliverablesRes],
      ['alerts', alertsRes],
      ['invitations', invitationsRes],
    ] as const) {
      if (res.error) {
        console.error(`[pandit/export GET] ${section} load failed:`, res.error.message);
        partialErrors.push({ section, error: res.error.message });
      }
    }

    const bundle = {
      schema_version: SCHEMA_VERSION,
      exported_at: new Date().toISOString(),
      client,
      family: familyRes.data ?? [],
      consultations: consultationsRes.data ?? [],
      deliverables: deliverablesRes.data ?? [],
      alerts: alertsRes.data ?? [],
      invitations: invitationsRes.data ?? [],
      ...(partialErrors.length > 0 ? { _partial_errors: partialErrors } : {}),
    };

    // Suggest a Content-Disposition filename so the browser saves
    // as `pandit-client-<short-id>.json` instead of the route path.
    const shortId = id.slice(0, 8);
    const safeName = (client.full_name ?? 'client')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    const filename = `pandit-${safeName}-${shortId}.json`;

    return NextResponse.json(bundle, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[pandit/export GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
