// src/lib/vrat/__tests__/next-reminder.test.ts
//
// Regression tests for recomputeNextReminderDueAt.
// Covers C4 audit finding: truthy-check on coordinates rejected lat=0/lng=0.

import { describe, it, expect } from 'vitest';
import {
  recomputeNextReminderDueAt,
  NEXT_REMINDER_INFINITY,
  type VratPrefMinimal,
  type UserContext,
} from '@/lib/vrat/next-reminder';

// Minimal enabled preference for ekadashi.
const BASE_PREF: VratPrefMinimal = {
  user_id: 'test-user',
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

// ─── C4 regression: equator / prime-meridian coordinates ─────────────────────
// Before fix: `if (!userCtx.lat || !userCtx.lng || !userCtx.tz)` returned null
// for lat=0 or lng=0 because !0 === true. Any user on the equator (Singapore,
// Quito, Nairobi) or prime meridian (London, Accra) would get null forever.

describe('C4 regression: recomputeNextReminderDueAt with lat=0 or lng=0', () => {
  it('lat=0, lng=0, tz=UTC (null island) returns a Date or infinity — never null', () => {
    const ctx: UserContext = {
      lat: 0,
      lng: 0,
      tz: 'UTC',
      tradition: 'smarta',
      paranaOffsetMin: 30,
    };
    const result = recomputeNextReminderDueAt(BASE_PREF, ctx);
    // Must not be null — null means "structurally missing context", but lat=0/lng=0/UTC
    // is structurally valid (null island, or a ship at sea).
    expect(result).not.toBeNull();
    // Must be either a concrete Date or the infinity sentinel.
    const isDate = result instanceof Date;
    const isInfinity = result === NEXT_REMINDER_INFINITY;
    expect(isDate || isInfinity).toBe(true);
  });

  it('lat=0, lng=77 (equator, somewhere over Indian Ocean) returns non-null', () => {
    const ctx: UserContext = {
      lat: 0,
      lng: 77,
      tz: 'Indian/Maldives',
      tradition: 'smarta',
      paranaOffsetMin: 30,
    };
    const result = recomputeNextReminderDueAt(BASE_PREF, ctx);
    expect(result).not.toBeNull();
  });

  it('lat=51.5, lng=0 (Greenwich / London) returns non-null', () => {
    const ctx: UserContext = {
      lat: 51.5,
      lng: 0,
      tz: 'Europe/London',
      tradition: 'smarta',
      paranaOffsetMin: 30,
    };
    const result = recomputeNextReminderDueAt(BASE_PREF, ctx);
    expect(result).not.toBeNull();
  });

  it('null lat returns null (genuinely missing context)', () => {
    // lat=undefined/null is a genuine "no location set" — must return null.
    const ctx = {
      lat: undefined as unknown as number,
      lng: 77.21,
      tz: 'Asia/Kolkata',
      tradition: 'smarta' as const,
      paranaOffsetMin: 30,
    };
    const result = recomputeNextReminderDueAt(BASE_PREF, ctx);
    expect(result).toBeNull();
  });

  it('disabled pref returns infinity regardless of location', () => {
    const ctx: UserContext = {
      lat: 0,
      lng: 0,
      tz: 'UTC',
      tradition: 'smarta',
      paranaOffsetMin: 30,
    };
    const result = recomputeNextReminderDueAt(
      { ...BASE_PREF, enabled: false },
      ctx,
    );
    expect(result).toBe(NEXT_REMINDER_INFINITY);
  });
});
