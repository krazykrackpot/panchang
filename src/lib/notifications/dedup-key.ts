/**
 * Deterministic dedup-key generator for user_notifications inserts.
 *
 * Backs the partial unique index in migration 039. Each cron embeds the
 * cron's natural time bucket into the key (per-day for daily crons,
 * per-week for weekly), so the same notification fired on different
 * days/weeks generates distinct keys (legitimate re-fire) while a same-
 * bucket re-fire collides (duplicate suppressed).
 *
 * The key layout: `{user_id}:{type}:{md5(stable_metadata)}:{bucket}`.
 * `bucket` is whatever scope the caller passes; conventional values:
 *   - 'YYYY-MM-DD' for daily crons
 *   - 'YYYY-WW' for weekly crons
 *   - a fixed string for one-shot system messages
 *
 * Metadata is canonicalised by sorting object keys recursively, so
 * `{a:1,b:2}` and `{b:2,a:1}` produce the same md5. This is the JSON
 * .stringify(metadata) bug noted in audit IDEM-8.
 */

import { createHash } from 'node:crypto';

export type DedupBucket = string;

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }
  // Object: sort keys for determinism.
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const entries = keys.map((k) => JSON.stringify(k) + ':' + stableStringify(obj[k]));
  return '{' + entries.join(',') + '}';
}

export function buildNotificationDedupKey(opts: {
  userId: string;
  type: string;
  metadata: Record<string, unknown> | undefined;
  bucket: DedupBucket;
}): string {
  const { userId, type, metadata, bucket } = opts;
  const metaCanonical = stableStringify(metadata ?? {});
  const metaHash = createHash('md5').update(metaCanonical).digest('hex');
  return `${userId}:${type}:${metaHash}:${bucket}`;
}

/**
 * Returns today's YYYY-MM-DD in UTC for use as a daily-cron bucket.
 * Crons run in UTC so the bucket aligns with the cron schedule by
 * default; pass a different timezone-derived string if needed.
 */
export function utcDayBucket(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Returns the ISO week bucket (`YYYY-WW`) for the given date. Used by
 * weekly crons (transit-alerts) so the same alert can re-fire in a
 * later week.
 */
export function utcWeekBucket(date: Date = new Date()): string {
  // ISO week: Thursday of the same week determines the year.
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
