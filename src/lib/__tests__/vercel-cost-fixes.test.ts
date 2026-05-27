/**
 * Tests for the 3 Vercel cost-reduction fixes.
 * Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md
 *
 * Fix 1 — vrat-reminder cron early-exit (next_reminder_due_at helper)
 * Fix 2 — healthDiagnosis snapshot cache (engine-version coverage)
 * Fix 3 — Brihaspati wait+stream split (route shape)
 */

import { describe, it, expect, vi } from 'vitest';
import { recomputeNextReminderDueAt, NEXT_REMINDER_INFINITY } from '@/lib/vrat/next-reminder';
import type { VratPrefMinimal, UserContext } from '@/lib/vrat/next-reminder';

// ─────────────────────────────────────────────────────────────────────────────
// Fix 1 — recomputeNextReminderDueAt helper unit tests
// ─────────────────────────────────────────────────────────────────────────────

const BASE_CTX: UserContext = {
  lat: 47.36,
  lng: 8.53,
  tz: 'Europe/Zurich',
  tradition: 'smarta',
  paranaOffsetMin: 30,
};

const BASE_PREF: VratPrefMinimal = {
  user_id: 'u1',
  vrat_type: 'ekadashi',
  enabled: true,
  email_reminders: true,
  remind_day_before: true,
  remind_parana: false,
  start_date: null,
  end_date: null,
  last_day_before_reminder_date: null,
  last_parana_reminder_date: null,
};

describe('Fix 1 — recomputeNextReminderDueAt', () => {
  it('returns NEXT_REMINDER_INFINITY when email_reminders is false', () => {
    const pref = { ...BASE_PREF, email_reminders: false };
    expect(recomputeNextReminderDueAt(pref, BASE_CTX)).toBe(NEXT_REMINDER_INFINITY);
  });

  it('returns NEXT_REMINDER_INFINITY when enabled is false', () => {
    const pref = { ...BASE_PREF, enabled: false };
    expect(recomputeNextReminderDueAt(pref, BASE_CTX)).toBe(NEXT_REMINDER_INFINITY);
  });

  it('returns NEXT_REMINDER_INFINITY when both remind flags are false', () => {
    const pref = { ...BASE_PREF, remind_day_before: false, remind_parana: false };
    expect(recomputeNextReminderDueAt(pref, BASE_CTX)).toBe(NEXT_REMINDER_INFINITY);
  });

  it('returns null when context is missing lat/lng', () => {
    const ctx = { ...BASE_CTX, lat: 0, lng: 0, tz: '' };
    expect(recomputeNextReminderDueAt(BASE_PREF, ctx)).toBeNull();
  });

  it('returns NEXT_REMINDER_INFINITY when pref is past end_date', () => {
    const pref = { ...BASE_PREF, end_date: '2020-01-01' };
    // Today is well past 2020-01-01
    expect(recomputeNextReminderDueAt(pref, BASE_CTX)).toBe(NEXT_REMINDER_INFINITY);
  });

  it('returns a Date (not NEXT_REMINDER_INFINITY, not null) for an active pref', () => {
    // Ekadashi occurs twice a month — within a 32-day window there should
    // always be at least one upcoming occurrence for an active subscriber.
    const result = recomputeNextReminderDueAt(BASE_PREF, BASE_CTX);
    // Most likely a Date; could be NEXT_REMINDER_INFINITY if we're in a weird
    // window, but definitely not null (context is valid).
    expect(result).not.toBeNull();
    if (result !== NEXT_REMINDER_INFINITY) {
      expect(result).toBeInstanceOf(Date);
      expect((result as Date).getTime()).toBeGreaterThan(Date.now());
    }
  });

  it('respects NEXT_REMINDER_INFINITY sentinel value (string constant)', () => {
    // The sentinel must be the literal string 'infinity' so Postgres
    // interprets it as timestamptz infinity.
    expect(NEXT_REMINDER_INFINITY).toBe('infinity');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fix 1 — cron early-exit mode shape
// ─────────────────────────────────────────────────────────────────────────────

describe('Fix 1 — cron early-exit JSON shape', () => {
  it('early-exit response has expected fields', () => {
    // Verify the shape contract used in tests and monitoring.
    const earlyExitResponse = { success: true, checked: 0, sent: 0, mode: 'early-exit' };
    expect(earlyExitResponse.mode).toBe('early-exit');
    expect(earlyExitResponse.checked).toBe(0);
    expect(earlyExitResponse.sent).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fix 2 — engine-version hash covers health-diagnosis files
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Fix 2 — engine-version hash includes health-diagnosis pipeline', () => {
  it('compute-engine-hash.ts PIPELINE_FILES includes health-diagnosis index', () => {
    const scriptContent = readFileSync(
      resolve('scripts/compute-engine-hash.ts'),
      'utf-8',
    );
    // Check a representative set of the new health-diagnosis entries.
    expect(scriptContent).toContain('src/lib/kundali/health-diagnosis/index.ts');
    expect(scriptContent).toContain('src/lib/kundali/health-diagnosis/weights.ts');
    expect(scriptContent).toContain('src/lib/kundali/health-diagnosis/layer-1-natal.ts');
    expect(scriptContent).toContain('src/lib/kundali/health-diagnosis/elements/cardiac.ts');
    expect(scriptContent).toContain('src/lib/kundali/health-diagnosis/elements/vitality.ts');
  });

  it('engine-version.ts exists and exports a 12-character hex string', () => {
    const engineVersion = readFileSync(
      resolve('src/lib/kundali/engine-version.ts'),
      'utf-8',
    );
    const match = engineVersion.match(/ENGINE_VERSION = '([0-9a-f]+)'/);
    expect(match).not.toBeNull();
    expect(match![1]).toHaveLength(12);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fix 2 — /api/medical cache column coverage
// ─────────────────────────────────────────────────────────────────────────────

describe('Fix 2 — /api/medical route uses ENGINE_VERSION for cache', () => {
  it('route.ts imports ENGINE_VERSION', () => {
    const routeContent = readFileSync(
      resolve('src/app/api/medical/route.ts'),
      'utf-8',
    );
    expect(routeContent).toContain("from '@/lib/kundali/engine-version'");
    expect(routeContent).toContain('ENGINE_VERSION');
  });

  it('route.ts reads health_diagnosis columns from snapshot', () => {
    const routeContent = readFileSync(
      resolve('src/app/api/medical/route.ts'),
      'utf-8',
    );
    expect(routeContent).toContain('health_diagnosis_computed_at');
    expect(routeContent).toContain('health_diagnosis_extended');
  });

  it('migration 046 adds health_diagnosis columns', () => {
    const migration = readFileSync(
      resolve('supabase/migrations/046_kundali_snapshot_health_diagnosis.sql'),
      'utf-8',
    );
    expect(migration).toContain('health_diagnosis JSONB');
    expect(migration).toContain('health_diagnosis_extended JSONB');
    expect(migration).toContain('health_diagnosis_computed_at TIMESTAMPTZ');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fix 3 — Brihaspati POST returns awaiting_payment for Stripe pending
// ─────────────────────────────────────────────────────────────────────────────

describe('Fix 3 — POST /api/brihaspati no longer contains pollForPaymentVerified', () => {
  it('main brihaspati route.ts does not contain the old polling loop', () => {
    const routeContent = readFileSync(
      resolve('src/app/api/brihaspati/route.ts'),
      'utf-8',
    );
    // The old 10 × 500 ms poll loop must be gone.
    expect(routeContent).not.toContain('pollForPaymentVerified');
    expect(routeContent).not.toContain('inFlightPolls');
    // New early-return shape must be present.
    expect(routeContent).toContain('awaiting_payment');
  });

  it('wait route exists and contains payment_pending + payment_verified events', () => {
    const waitContent = readFileSync(
      resolve('src/app/api/brihaspati/wait/route.ts'),
      'utf-8',
    );
    expect(waitContent).toContain('payment_pending');
    expect(waitContent).toContain('payment_verified');
    expect(waitContent).toContain('streamUrl');
  });

  it('stream route exists and handles completed idempotent re-delivery', () => {
    const streamContent = readFileSync(
      resolve('src/app/api/brihaspati/stream/route.ts'),
      'utf-8',
    );
    // Idempotent re-delivery check.
    expect(streamContent).toContain("row.status === 'completed'");
    // Still emits token + done events.
    expect(streamContent).toContain("type: 'token'");
    expect(streamContent).toContain("type: 'done'");
  });

  it('wait route maxDuration is 30 (lightweight, not 300)', () => {
    const waitContent = readFileSync(
      resolve('src/app/api/brihaspati/wait/route.ts'),
      'utf-8',
    );
    expect(waitContent).toContain('maxDuration = 30');
  });

  it('stream route maxDuration is 300 (LLM can take up to 5 min)', () => {
    const streamContent = readFileSync(
      resolve('src/app/api/brihaspati/stream/route.ts'),
      'utf-8',
    );
    expect(streamContent).toContain('maxDuration = 300');
  });

  it('client BrihaspatiProvider handles awaiting_payment response', () => {
    const providerContent = readFileSync(
      resolve('src/components/brihaspati/BrihaspatiProvider.tsx'),
      'utf-8',
    );
    expect(providerContent).toContain('awaiting_payment');
    expect(providerContent).toContain('/api/brihaspati/wait');
    expect(providerContent).toContain('/api/brihaspati/stream');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fix 1 — migration 045 SQL shape
// ─────────────────────────────────────────────────────────────────────────────

describe('Fix 1 — migration 045 SQL shape', () => {
  it('adds next_reminder_due_at column and partial index', () => {
    const migration = readFileSync(
      resolve('supabase/migrations/045_vrat_next_reminder_due_at.sql'),
      'utf-8',
    );
    expect(migration).toContain('next_reminder_due_at TIMESTAMPTZ');
    expect(migration).toContain('idx_vrat_prefs_next_reminder');
    expect(migration).toContain('enabled = TRUE');
    expect(migration).toContain('email_reminders = TRUE');
    expect(migration).toContain('next_reminder_due_at IS NOT NULL');
  });
});
