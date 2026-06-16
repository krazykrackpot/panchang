// Send the daily panchang to a single subscription. Used by:
//   - /api/cron/whatsapp-daily-panchang (hourly, fires for matched buckets)
//   - /api/whatsapp/verify (synchronous welcome send when next bucket > 12h)
//
// Both paths share idempotency via the (subscription_id, panchang_date)
// UNIQUE constraint on whatsapp_send_log. If the row already exists, we
// don't double-send — the second caller sees the unique-violation and
// reports `already_sent`.

import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getSeoCityForLocale } from '@/lib/constants/cities';
import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/lib/i18n/config';
import { TEMPLATES, chooseTemplateLang } from './templates';
import { renderDailyPanchang } from './render-daily';
import { sendTemplateMessage } from './client';

export interface Subscription {
  id: string;
  user_id: string;
  phone_e164: string;
  locale: string;
  timezone: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  /** City name in the user's locale (falls back to lat/lng if unknown). */
  cityName: string;
}

export interface SendOutcome {
  status: 'sent' | 'already_sent' | 'skipped_budget' | 'failed';
  message_id?: string;
  error?: string;
  cost_micros?: number;
}

export interface SendDailyContext {
  supabase: SupabaseClient;
  /** Subscriber row from user_whatsapp_subscriptions. */
  sub: Subscription;
  /** Where to compute panchang for. Resolved per-user from their profile or
   *  default city; not stored on the subscription row. */
  location: UserLocation;
  /** The calendar date (in subscriber's timezone) the panchang is FOR. */
  panchangDate: Date;
  /** Hard MTD budget in micro-USD. Pre-checked by the caller — we only
   *  re-check at the row-level to avoid a TOCTOU race within a single tick. */
  monthlyBudgetMicros: number;
  /** Current MTD cost in micro-USD. Passed in to avoid re-querying per
   *  subscriber (the cron computes it once per tick). */
  mtdCostMicros: number;
}

/**
 * Send today's panchang to one subscriber. Idempotent: re-runs are safe.
 *
 * The DB row INSERT happens BEFORE the WhatsApp API call. If the cron
 * dies mid-send, the next tick sees the row and skips (status='pending'
 * gets retried as 'sent' on the WhatsApp side via Meta's idempotency on
 * the same message body? — no, Meta does NOT dedupe; that's why we
 * use the DB row as the lock).
 *
 * Failure modes:
 *   - Already sent today        → status='already_sent', no API call
 *   - Budget cap exceeded       → status='skipped_budget', row marked
 *   - WhatsApp API error        → status='failed', error code captured
 *   - WhatsApp says invalid phone → caller should opt-out the subscription
 */
export async function sendDailyForSubscription(
  ctx: SendDailyContext,
): Promise<SendOutcome> {
  const { supabase, sub, location, panchangDate } = ctx;
  const dateYmd = formatDateYmd(panchangDate, sub.timezone);

  // ─── Idempotency: try to claim the slot ──────────────────────────────
  // INSERT with ON CONFLICT DO NOTHING — if the row exists from a prior
  // tick or a parallel invocation, we get `null` back instead of the
  // new row, and we skip.
  const tplKey = 'daily_panchang_v1';
  const templateLang = chooseTemplateLang(tplKey, sub.locale as Locale);

  const { data: inserted, error: insertErr } = await supabase
    .from('whatsapp_send_log')
    .insert({
      subscription_id: sub.id,
      panchang_date: dateYmd,
      template_name: TEMPLATES[tplKey].name,
      template_lang: templateLang,
      status: 'pending',
    })
    .select('id')
    .single();

  if (insertErr) {
    // 23505 = unique_violation = row already exists for this (sub, date)
    if ((insertErr as { code?: string }).code === '23505') {
      return { status: 'already_sent' };
    }
    console.error('[whatsapp/send-daily] insert send_log failed:', insertErr);
    return { status: 'failed', error: insertErr.message };
  }
  const logId = inserted!.id;

  // ─── Budget pre-check at the row level ────────────────────────────────
  // ctx.mtdCostMicros is a tick-level estimate; pre-check it here so we
  // don't burn budget if the operator changed the cap between cron ticks.
  if (ctx.mtdCostMicros >= ctx.monthlyBudgetMicros) {
    await supabase
      .from('whatsapp_send_log')
      .update({ status: 'skipped_budget' })
      .eq('id', logId);
    return { status: 'skipped_budget' };
  }

  // ─── Compute panchang + render template body ─────────────────────────
  //
  // CRITICAL (Gemini PR #706 round-3): derive year/month/day from `dateYmd`,
  // which is the user's LOCAL date. Using panchangDate.getUTC*() would
  // shift the date by up to a full day for users in non-UTC timezones —
  // e.g. an IST subscriber at 04:30 IST sees UTC date = yesterday → we'd
  // compute yesterday's panchang for them. dateYmd is built via
  // Intl.DateTimeFormat with the user's tz, so it's correct.
  const [yStr, mStr, dStr] = dateYmd.split('-');
  const localYear = parseInt(yStr, 10);
  const localMonth = parseInt(mStr, 10);
  const localDay = parseInt(dStr, 10);

  const tzOffsetHours = getUTCOffsetForDate(
    localYear, localMonth, localDay, sub.timezone,
  ) / 60;
  const festivalsList = generateFestivalCalendarV2(
    localYear,
    location.lat,
    location.lng,
    sub.timezone,
  );
  const festivalsToday = festivalsList.filter((f) => f.date === dateYmd);

  const rendered = renderDailyPanchang({
    year: localYear,
    month: localMonth,
    day: localDay,
    lat: location.lat,
    lng: location.lng,
    tzOffset: tzOffsetHours,
    timezone: sub.timezone,
    cityName: location.cityName,
    templateLang,
    userLocale: sub.locale as Locale,
    festivalsToday,
  });

  // ─── Send via WhatsApp API ───────────────────────────────────────────
  const result = await sendTemplateMessage({
    to: sub.phone_e164,
    templateName: TEMPLATES[tplKey].name,
    templateLang,
    bodyParams: rendered.bodyParams,
    urlButtonParam: rendered.urlButtonParam,
  });

  // ─── Update send_log row with the outcome ────────────────────────────
  if (result.ok) {
    await supabase
      .from('whatsapp_send_log')
      .update({
        status: 'sent',
        whatsapp_message_id: result.whatsappMessageId,
        cost_micros: result.costMicros,
      })
      .eq('id', logId);
    return {
      status: 'sent',
      message_id: result.whatsappMessageId,
      cost_micros: result.costMicros,
    };
  } else {
    await supabase
      .from('whatsapp_send_log')
      .update({
        status: 'failed',
        failure_code: result.errorCode,
        failure_message: result.errorMessage,
      })
      .eq('id', logId);
    return { status: 'failed', error: `${result.errorCode}: ${result.errorMessage}` };
  }
}

// Caller looks up the user's location once per send. The cron passes the
// user's profile lat/lng if set, falling back to the locale's SEO-default
// city. We keep that lookup out of sendDailyForSubscription so test code
// can pass a fixed location without stubbing the location store.
export interface DefaultLocation {
  lat: number;
  lng: number;
  cityName: string;
}
export function resolveDefaultLocation(locale: Locale): DefaultLocation {
  const city = getSeoCityForLocale(locale);
  return {
    lat: city.lat,
    lng: city.lng,
    // tl() picks the user's locale, falling back to English
    cityName: tl(city.name, locale),
  };
}

/**
 * Compute the user's "next scheduled send" — used by the verify route to
 * decide whether to fire an immediate welcome message.
 *
 * Returns the next UTC instant when the cron would normally send to this
 * subscriber. Doesn't account for sunrise mode (those are handled at
 * cron-time per day, not predictable in advance).
 */
export function nextScheduledSendUtc(
  sub: Pick<Subscription, 'timezone'> & { send_time_local: string; send_at_sunrise: boolean },
  nowUtc: Date = new Date(),
): Date | null {
  if (sub.send_at_sunrise) {
    // Sunrise sends happen at the rounded UTC hour of today's sunrise. The
    // verify route doesn't compute sunrise itself; we conservatively treat
    // this case as "send tomorrow" and let the cron pick it up. Returns
    // 24h from now as the worst-case estimate.
    return new Date(nowUtc.getTime() + 24 * 60 * 60 * 1000);
  }

  // Parse "HH:MM:00" into the local hour the user wants
  const [hStr] = sub.send_time_local.split(':');
  const localHourTarget = parseInt(hStr, 10);

  const tzOffsetMin = getUTCOffsetForDate(
    nowUtc.getUTCFullYear(),
    nowUtc.getUTCMonth() + 1,
    nowUtc.getUTCDate(),
    sub.timezone,
  );
  // What hour is it RIGHT NOW in the user's tz?
  const localNowMs = nowUtc.getTime() + tzOffsetMin * 60 * 1000;
  const localNow = new Date(localNowMs);
  const localNowHour = localNow.getUTCHours(); // we've already shifted to wall-clock

  // How many hours from now until the user's local target hour?
  let hoursUntil = localHourTarget - localNowHour;
  if (hoursUntil <= 0) hoursUntil += 24;

  // Build the next UTC fire-time. Round to nearest UTC hour to match the
  // cron's bucket-firing rule.
  const nextLocalMs = localNowMs + hoursUntil * 60 * 60 * 1000;
  const nextUtcMs = nextLocalMs - tzOffsetMin * 60 * 1000;
  // Round to the nearest UTC hour
  const rounded = Math.round(nextUtcMs / (60 * 60 * 1000)) * (60 * 60 * 1000);
  return new Date(rounded);
}

function formatDateYmd(d: Date, timezone: string): string {
  // YYYY-MM-DD in the user's timezone
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}
