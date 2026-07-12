// Hourly cron — sends today's panchang to each subscriber whose chosen
// local send-time matches the current UTC hour (rounded to nearest tick).
//
// Schedule: vercel.json `"5 * * * *"` — runs 5 min past every hour. The
// 5-minute buffer gives upstream panchang precomputes time to settle.
//
// Auth: CRON_SECRET via verifyCronAuth() (Bearer header).
//
// Behavior per tick:
//   1. Compute current UTC hour
//   2. Query active+verified subscriptions whose (timezone, send_time_local
//      OR sunrise) rounds to the current UTC hour
//   3. Pre-check MTD cost vs WHATSAPP_MONTHLY_BUDGET_USD (default $25)
//   4. For each match: insert send_log row with idempotency lock, compute
//      panchang+festivals, render template, send via WhatsApp API, update
//      send_log with result
//   5. Return JSON summary { sent, skipped_budget, already_sent, failed,
//      matched, tick_hour_utc }
//
// Design doc: docs/specs/2026-06-15-whatsapp-daily-panchang.md §8

import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { approximateSunrise, dateToJD } from '@/lib/ephem/astronomical';
import {
  sendDailyForSubscription,
  resolveDefaultLocation,
  type Subscription,
} from '@/lib/whatsapp/send-daily';
import { getMonthlyBudgetUsd, getMonthlyBudgetMicros } from '@/lib/whatsapp/cost-rollup';
import type { Locale } from '@/lib/i18n/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Vercel function max duration — 60s is generous for 25 beta users.
// Scale up if subscribers grow past ~500 (rough send throughput is
// ~5 sends/second through Meta Cloud API).
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return handle(req);
}
// Vercel cron uses GET by default; accept both for flexibility
export async function GET(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const authFail = verifyCronAuth(req);
  if (authFail) return authFail;

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  // ─── Budget pre-check (once per tick) ─────────────────────────────────
  // Shared parser handles NaN / negative / missing env safely.
  const monthlyBudgetUsd = getMonthlyBudgetUsd();
  const monthlyBudgetMicros = getMonthlyBudgetMicros();

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const { data: costRow, error: costErr } = await supabase
    .from('whatsapp_send_log')
    .select('cost_micros.sum()')
    .gte('sent_at', monthStart.toISOString())
    .not('status', 'in', '(skipped_budget,skipped_paused)')
    .single();
  if (costErr && costErr.code !== 'PGRST116') {
    // PGRST116 = no rows; that's fine for an empty month
    console.error('[wa-cron] MTD cost query failed:', costErr);
  }
  // Supabase sum() returns { sum: BIGINT }; null when no rows
  const mtdCostMicros = Number(
    (costRow as { sum?: number | null } | null)?.sum ?? 0,
  );

  // ─── Time matching ────────────────────────────────────────────────────
  const now = new Date();
  const currentUtcHour = now.getUTCHours();

  // Pull all active+verified subscriptions. At 25-user pilot scale the
  // result set is trivially small; we filter in-memory by computing each
  // subscription's "next fire time" and matching it against current UTC
  // hour. Sub-1000 users we keep this simple; past 1000 we'd index on
  // (timezone, send_time_local) and partition by hash-of-bucket.
  const { data: subs, error: subErr } = await supabase
    .from('user_whatsapp_subscriptions')
    .select('id, user_id, phone_e164, locale, timezone, send_time_local, send_at_sunrise')
    .not('verified_at', 'is', null)
    .is('opted_out_at', null);
  if (subErr) {
    console.error('[wa-cron] subscription query failed:', subErr);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  const matched: Subscription[] = [];
  const skippedSunrise: string[] = [];

  for (const s of subs ?? []) {
    // Compute the user's local hour at "now"
    const tzOffsetMin = getUTCOffsetForDate(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      now.getUTCDate(),
      s.timezone,
    );

    if (s.send_at_sunrise) {
      // Get default city for their locale to compute sunrise. Phase 5+
      // can swap to user-stored lat/lng from profile.
      const loc = resolveDefaultLocation(s.locale as Locale);
      // approximateSunrise returns UT decimal hours of today's sunrise
      // (or null if Sun doesn't rise — polar latitudes). Round to nearest
      // UTC hour; compare to currentUtcHour.
      try {
        const jd = dateToJD(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
        const sunriseHours = approximateSunrise(jd, loc.lat, loc.lng);
        if (sunriseHours === null) {
          skippedSunrise.push(s.id);
          continue;
        }
        const sunriseUtcHour = ((Math.round(sunriseHours) % 24) + 24) % 24;
        if (sunriseUtcHour === currentUtcHour) {
          matched.push(toSub(s));
        }
      } catch (err) {
        console.warn(`[wa-cron] sunrise compute failed for sub ${s.id}:`, err);
        skippedSunrise.push(s.id);
      }
      continue;
    }

    // Fixed-time path: which UTC hour rounds to the user's local hour?
    const [hStr] = s.send_time_local.split(':');
    const localHour = parseInt(hStr, 10);
    // local_hour_in_minutes = local_hour * 60
    // utc_in_minutes = local_in_minutes - tzOffsetMin
    // utc_hour = round(utc_in_minutes / 60) mod 24
    const utcMinutes = localHour * 60 - tzOffsetMin;
    const utcHour = ((Math.round(utcMinutes / 60) % 24) + 24) % 24;
    if (utcHour === currentUtcHour) matched.push(toSub(s));
  }

  // ─── Send loop ────────────────────────────────────────────────────────
  const today = new Date(); // user-tz date computed inside sendDailyForSubscription
  const result = {
    tick_hour_utc: currentUtcHour,
    matched: matched.length,
    sent: 0,
    already_sent: 0,
    skipped_budget: 0,
    failed: 0,
    skipped_sunrise_failed: skippedSunrise.length,
    mtd_cost_usd: mtdCostMicros / 1_000_000,
    monthly_budget_usd: monthlyBudgetUsd,
  };

  // Cache festival lookups per (year, lat, lng, timezone) bucket. At the
  // 25-user pilot the cache hits are minimal but the structure is in place.
  const festivalCache = new Map<string, void>();
  void festivalCache; // reserved for future per-bucket reuse

  let mtdRunning = mtdCostMicros;
  for (const sub of matched) {
    const location = resolveDefaultLocation(sub.locale as Locale);
    const outcome = await sendDailyForSubscription({
      supabase,
      sub,
      location,
      panchangDate: today,
      monthlyBudgetMicros,
      mtdCostMicros: mtdRunning,
    });
    if (outcome.status === 'sent') {
      result.sent++;
      mtdRunning += outcome.cost_micros ?? 0;
    } else if (outcome.status === 'already_sent') {
      result.already_sent++;
    } else if (outcome.status === 'skipped_budget') {
      result.skipped_budget++;
    } else {
      result.failed++;
    }
  }

  // ─── Operator alert when crossing 80% of budget ──────────────────────
  const pct = monthlyBudgetMicros > 0 ? mtdRunning / monthlyBudgetMicros : 0;
  if (pct >= 0.8 && mtdCostMicros / monthlyBudgetMicros < 0.8) {
    // Just crossed 80%; alert. (Phase 4 wires notifyOperator(); for now
    // a console.error is the operator signal — visible in vercel logs.)
    console.error(
      `[wa-cron] BUDGET ALERT: MTD ${(pct * 100).toFixed(1)}% of $${monthlyBudgetUsd} cap`,
    );
  }

  return NextResponse.json(result);
}

function toSub(s: {
  id: string;
  user_id: string;
  phone_e164: string;
  locale: string;
  timezone: string;
}): Subscription {
  return {
    id: s.id,
    user_id: s.user_id,
    phone_e164: s.phone_e164,
    locale: s.locale,
    timezone: s.timezone,
  };
}
