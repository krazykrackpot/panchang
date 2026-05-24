/**
 * Sprint 21 — Cron dedup hardening.
 *
 * Asserts the four cron jobs all (a) carry a deterministic dedup_key,
 * (b) upsert with onConflict + ignoreDuplicates, (c) surface errors on
 * dedup-SELECT queries, and (d) write dedup anchors BEFORE side-effects.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildNotificationDedupKey,
  utcDayBucket,
  utcWeekBucket,
} from '../notifications/dedup-key';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('Migration 039 — user_notifications.dedup_key', () => {
  const src = read('supabase/migrations/039_notification_dedup_key.sql');

  it('adds nullable dedup_key column', () => {
    expect(src).toMatch(/ALTER TABLE public\.user_notifications/);
    expect(src).toMatch(/ADD COLUMN IF NOT EXISTS dedup_key TEXT/);
  });

  it('creates partial unique index WHERE dedup_key IS NOT NULL', () => {
    expect(src).toMatch(/CREATE UNIQUE INDEX IF NOT EXISTS idx_user_notifications_dedup_key/);
    expect(src).toMatch(/WHERE dedup_key IS NOT NULL/);
  });
});

describe('Dedup-key helper', () => {
  it('produces identical keys for the same canonical metadata regardless of key order', () => {
    const key1 = buildNotificationDedupKey({
      userId: 'u1',
      type: 'transit_alert',
      metadata: { planetId: 5, sign: 7 },
      bucket: '2026-05-24',
    });
    const key2 = buildNotificationDedupKey({
      userId: 'u1',
      type: 'transit_alert',
      metadata: { sign: 7, planetId: 5 },
      bucket: '2026-05-24',
    });
    expect(key1).toBe(key2);
  });

  it('produces different keys when metadata differs', () => {
    const key1 = buildNotificationDedupKey({
      userId: 'u1', type: 't', metadata: { x: 1 }, bucket: 'b',
    });
    const key2 = buildNotificationDedupKey({
      userId: 'u1', type: 't', metadata: { x: 2 }, bucket: 'b',
    });
    expect(key1).not.toBe(key2);
  });

  it('produces different keys across buckets (re-fire across days)', () => {
    const key1 = buildNotificationDedupKey({
      userId: 'u1', type: 't', metadata: {}, bucket: '2026-05-24',
    });
    const key2 = buildNotificationDedupKey({
      userId: 'u1', type: 't', metadata: {}, bucket: '2026-05-25',
    });
    expect(key1).not.toBe(key2);
  });

  it('utcDayBucket produces YYYY-MM-DD', () => {
    const bucket = utcDayBucket(new Date('2026-05-24T15:30:00Z'));
    expect(bucket).toBe('2026-05-24');
  });

  it('utcWeekBucket produces YYYY-Www', () => {
    const bucket = utcWeekBucket(new Date('2026-05-24T00:00:00Z'));
    expect(bucket).toMatch(/^\d{4}-W\d{2}$/);
  });
});

describe('generate-notifications cron — upsert with dedup_key', () => {
  const src = read('src/app/api/cron/generate-notifications/route.ts');

  it('imports the dedup-key helper', () => {
    expect(src).toMatch(/import \{ buildNotificationDedupKey, utcDayBucket \} from '@\/lib\/notifications\/dedup-key'/);
  });

  it('upserts with onConflict=dedup_key, ignoreDuplicates=true', () => {
    expect(src).toMatch(/upsert\(toInsert,\s*\{\s*onConflict:\s*'dedup_key',\s*ignoreDuplicates:\s*true\s*\}\)/);
  });

  it('uses inserted-row count (not toInsert.length) for stats and push', () => {
    expect(src).toMatch(/const insertedCount = inserted\?\.length \?\? 0/);
    expect(src).toMatch(/pushItem = inserted!\[0\]/);
  });

  it('does NOT use the old SELECT-then-INSERT existingKeys pattern', () => {
    expect(src).not.toMatch(/existingKeys\.has/);
    expect(src).not.toMatch(/JSON\.stringify\(e\.metadata\)/);
  });
});

describe('transit-alerts cron — weekly dedup_key + surfaced dedup error', () => {
  const src = read('src/app/api/cron/transit-alerts/route.ts');

  it('imports the dedup-key helper', () => {
    expect(src).toMatch(/import \{ buildNotificationDedupKey, utcWeekBucket \} from '@\/lib\/notifications\/dedup-key'/);
  });

  it('upserts with weekly dedup_key keyed on planetId only', () => {
    expect(src).toMatch(/upsert\(\{[\s\S]{0,400}dedup_key,\s*\}, \{ onConflict: 'dedup_key', ignoreDuplicates: true \}\)/);
    expect(src).toMatch(/utcWeekBucket\(\)/);
  });

  it('surfaces dedup SELECT errors (not silent empty Set)', () => {
    expect(src).toMatch(/const \{ data: existing, error: existingErr \}/);
    expect(src).toMatch(/dedup SELECT failed/);
  });

  it('skips push on dedup hit (empty inserted set)', () => {
    expect(src).toMatch(/!inserted \|\| inserted\.length === 0/);
  });
});

describe('monthly-readings cron — upsert + UTC month + error capture', () => {
  const src = read('src/app/api/cron/monthly-readings/route.ts');

  it('uses .upsert with onConflict=user_id,reading_month', () => {
    expect(src).toMatch(/upsert\(\{[\s\S]{0,2000}\},\s*\{\s*onConflict:\s*'user_id,reading_month',\s*ignoreDuplicates:\s*true\s*\}\)/);
  });

  it('captures { error } and increments errors counter on failure', () => {
    expect(src).toMatch(/const \{ error: insertErr \} = await supabase\.from\('domain_readings'\)\.upsert/);
    expect(src).toMatch(/errors\+\+;\s*continue;/);
  });

  it('uses UTC month boundary (not server-local)', () => {
    expect(src).toMatch(/now\.getUTCFullYear/);
    expect(src).toMatch(/now\.getUTCMonth/);
  });
});

describe('domain-activations cron — dedup anchor FIRST, then notify', () => {
  const src = read('src/app/api/cron/domain-activations/route.ts');

  it('imports the dedup-key helper', () => {
    expect(src).toMatch(/import \{ buildNotificationDedupKey, utcDayBucket \} from '@\/lib\/notifications\/dedup-key'/);
  });

  it('writes domain_readings BEFORE user_notifications insert', () => {
    const drIdx = src.indexOf("from('domain_readings')\n        .insert(newRow)");
    const nuIdx = src.indexOf("from('user_notifications').upsert");
    expect(drIdx).toBeGreaterThan(0);
    expect(nuIdx).toBeGreaterThan(0);
    expect(drIdx).toBeLessThan(nuIdx);
  });

  it('notification upsert uses dedup_key with daily bucket', () => {
    expect(src).toMatch(/dedup_key:\s*buildNotificationDedupKey/);
    expect(src).toMatch(/utcDayBucket\(\)/);
    expect(src).toMatch(/onConflict:\s*'dedup_key',\s*ignoreDuplicates:\s*true/);
  });
});
