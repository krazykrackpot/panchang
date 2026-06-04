/**
 * /api/pandit/settings
 *
 * GET   — fetch authenticated Pandit's settings row. If none exists,
 *         returns a stub with defaults so the UI can render the
 *         "configure your letterhead" form before any save.
 * PATCH — upsert settings fields. Letterhead identity (name, subtitle,
 *         logo_url, signature_url, contact_*), alert preferences,
 *         past_threshold_months, default_report_locale.
 *
 * Pandit CRM P9.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import type { PanditSettings } from '@/lib/pandit/types';

interface PatchBody {
  letterhead_name?: string | null;
  letterhead_subtitle?: string | null;
  letterhead_address?: string | null;
  logo_url?: string | null;
  signature_url?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  default_report_locale?: string;
  alert_email_enabled?: boolean;
  alert_lookahead_days?: number;
  past_threshold_months?: number;
  weekly_digest_enabled?: boolean;
  digest_day?: PanditSettings['digest_day'];
}

const VALID_LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const VALID_DIGEST_DAYS: PanditSettings['digest_day'][] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

function asTrimmedStringOrNull(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

export async function GET(req: Request) {
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase, userId } = auth;

  try {
    const { data, error } = await supabase
      .from('pandit_settings')
      .select('*')
      .eq('pandit_user_id', userId)
      .maybeSingle();
    if (error) {
      console.error('[pandit/settings GET] query failed:', error.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }
    if (!data) {
      // Stub the defaults — UI renders form fields without a prior save.
      return NextResponse.json({
        settings: {
          pandit_user_id: userId,
          letterhead_name: null,
          letterhead_subtitle: null,
          letterhead_address: null,
          logo_url: null,
          signature_url: null,
          contact_phone: null,
          contact_email: null,
          default_report_locale: 'en',
          alert_email_enabled: true,
          alert_lookahead_days: 14,
          past_threshold_months: 12,
          weekly_digest_enabled: true,
          digest_day: 'monday' as const,
          created_at: null,
          updated_at: null,
        },
        is_default: true,
      });
    }
    return NextResponse.json({ settings: data, is_default: false });
  } catch (err) {
    console.error('[pandit/settings GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
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
    const body = rawBody as PatchBody;
    const update: Record<string, unknown> = { pandit_user_id: userId };

    // String fields (nullable)
    for (const key of [
      'letterhead_name',
      'letterhead_subtitle',
      'letterhead_address',
      'logo_url',
      'signature_url',
      'contact_phone',
      'contact_email',
    ] as const) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const v = body[key];
        if (v !== null && typeof v !== 'string') {
          return NextResponse.json({ error: `${key} must be a string or null` }, { status: 400 });
        }
        update[key] = asTrimmedStringOrNull(v);
      }
    }

    if (Object.prototype.hasOwnProperty.call(body, 'default_report_locale')) {
      if (typeof body.default_report_locale !== 'string' || !VALID_LOCALES.includes(body.default_report_locale)) {
        return NextResponse.json(
          { error: `default_report_locale must be one of: ${VALID_LOCALES.join(', ')}` },
          { status: 400 },
        );
      }
      update.default_report_locale = body.default_report_locale;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'alert_email_enabled')) {
      if (typeof body.alert_email_enabled !== 'boolean') {
        return NextResponse.json({ error: 'alert_email_enabled must be a boolean' }, { status: 400 });
      }
      update.alert_email_enabled = body.alert_email_enabled;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'alert_lookahead_days')) {
      const d = body.alert_lookahead_days;
      if (!Number.isInteger(d) || (d as number) < 1 || (d as number) > 90) {
        return NextResponse.json({ error: 'alert_lookahead_days must be 1-90' }, { status: 400 });
      }
      update.alert_lookahead_days = d;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'past_threshold_months')) {
      const m = body.past_threshold_months;
      if (!Number.isInteger(m) || (m as number) < 1 || (m as number) > 60) {
        return NextResponse.json({ error: 'past_threshold_months must be 1-60' }, { status: 400 });
      }
      update.past_threshold_months = m;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'weekly_digest_enabled')) {
      if (typeof body.weekly_digest_enabled !== 'boolean') {
        return NextResponse.json({ error: 'weekly_digest_enabled must be a boolean' }, { status: 400 });
      }
      update.weekly_digest_enabled = body.weekly_digest_enabled;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'digest_day')) {
      if (typeof body.digest_day !== 'string' || !VALID_DIGEST_DAYS.includes(body.digest_day as PanditSettings['digest_day'])) {
        return NextResponse.json(
          { error: `digest_day must be one of: ${VALID_DIGEST_DAYS.join(', ')}` },
          { status: 400 },
        );
      }
      update.digest_day = body.digest_day;
    }

    if (Object.keys(update).length === 1) {
      // Only pandit_user_id, no real updates
      return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pandit_settings')
      .upsert(update, { onConflict: 'pandit_user_id' })
      .select('*')
      .single();

    if (error) {
      console.error('[pandit/settings PATCH] upsert failed:', error.message);
      return NextResponse.json({ error: 'update_failed', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ settings: data });
  } catch (err) {
    console.error('[pandit/settings PATCH] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
