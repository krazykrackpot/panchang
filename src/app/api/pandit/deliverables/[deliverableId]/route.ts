/**
 * /api/pandit/deliverables/[deliverableId]
 *
 * PATCH — update title, content, locale. Visibility flip to
 *         'client_pushed' is reserved for the push endpoint (P7).
 * DELETE — remove deliverable. If pushed_at is set, also clears the
 *          client-side notification (P7 wires this).
 *
 * Pandit CRM P5.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';

interface RouteParams {
  params: Promise<{ deliverableId: string }>;
}

interface PatchBody {
  title?: string;
  content?: unknown;
  locale?: string;
}

export async function PATCH(req: Request, ctx: RouteParams) {
  const { deliverableId } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

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
    const body = rawBody as PatchBody;

    const update: Record<string, unknown> = {};
    if (Object.prototype.hasOwnProperty.call(body, 'title')) {
      if (typeof body.title !== 'string') {
        return NextResponse.json({ error: 'title must be a string' }, { status: 400 });
      }
      const t = body.title.trim();
      if (!t) return NextResponse.json({ error: 'title cannot be empty' }, { status: 400 });
      if (t.length > 200) {
        return NextResponse.json({ error: 'title too long (max 200)' }, { status: 400 });
      }
      update.title = t;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'content')) {
      update.content = body.content;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'locale')) {
      if (body.locale === null) {
        update.locale = 'en';
      } else if (typeof body.locale !== 'string' || !body.locale.trim()) {
        return NextResponse.json({ error: 'locale must be a non-empty string' }, { status: 400 });
      } else {
        update.locale = body.locale.trim();
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pandit_deliverables')
      .update(update)
      .eq('id', deliverableId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      console.error('[pandit/deliverables PATCH] update failed:', error.message);
      return NextResponse.json({ error: 'update_failed' }, { status: 500 });
    }
    return NextResponse.json({ deliverable: data });
  } catch (err) {
    console.error('[pandit/deliverables PATCH] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: RouteParams) {
  const { deliverableId } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
    const { error, count } = await supabase
      .from('pandit_deliverables')
      .delete({ count: 'exact' })
      .eq('id', deliverableId);
    if (error) {
      console.error('[pandit/deliverables DELETE] failed:', error.message);
      return NextResponse.json({ error: 'delete_failed' }, { status: 500 });
    }
    if (count === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pandit/deliverables DELETE] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
