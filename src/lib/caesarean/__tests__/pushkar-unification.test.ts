/**
 * Regression lock for the caesarean Pushkar Navamsha migration (item #18
 * in docs/tech-debt/duplicate-code-audit.md).
 *
 * Before this migration, src/lib/caesarean/constants.ts defined its own
 * 19-entry PUSHKAR_NAVAMSHA_RANGES table that materially diverged from
 * the canonical 24-entry PUSHKAR_NAVAMSHA_SET in
 * @/lib/constants/pushkar-bhaga. Only Libra agreed between the two —
 * the other 11 signs claimed different navamsha positions as Pushkar.
 *
 * The caesarean scorer now imports `isInPushkarNavamsha` from the
 * canonical module. These tests lock that migration by exercising the
 * helper at positions where the OLD caesarean table would have given a
 * different answer than the canonical does today.
 *
 * Co-locked with src/lib/constants/__tests__/pushkar-bhaga.test.ts which
 * locks the canonical 24-position SET itself (PR #254).
 */

import { describe, expect, it } from 'vitest';
import { isInPushkarNavamsha } from '@/lib/constants/pushkar-bhaga';

describe('Caesarean Pushkar Navamsha — uses canonical (post-#18 migration)', () => {
  // ─── Positions canonical considers Pushkar — must remain Pushkar ────────

  it('Aries 2.0° (canonical nav 1) is Pushkar', () => {
    expect(isInPushkarNavamsha(1, 2.0)).toBe(true);
  });

  it('Aries 14.0° (canonical nav 5) is Pushkar', () => {
    expect(isInPushkarNavamsha(1, 14.0)).toBe(true);
  });

  it('Cancer 1.0° (canonical nav 1, own sign Pushkar) is Pushkar', () => {
    expect(isInPushkarNavamsha(4, 1.0)).toBe(true);
  });

  it('Libra 1.0° (canonical AND old-caesarean agree — only sign of agreement) is Pushkar', () => {
    expect(isInPushkarNavamsha(7, 1.0)).toBe(true);
  });

  it('Libra 21.0° (canonical AND old-caesarean agree) is Pushkar', () => {
    expect(isInPushkarNavamsha(7, 21.0)).toBe(true);
  });

  // ─── Positions OLD caesarean (incorrectly) marked Pushkar — now NOT Pushkar ─

  it('Aries 21.0° (was Pushkar in OLD caesarean, NOT canonical) is now NOT Pushkar', () => {
    // Aries 20–23.333° was the old caesarean range. Canonical Aries
    // Pushkars are navamshas 1 + 5 (degree ranges 0–3.333° and
    // 13.333–16.667°). The 20–23.333° band is navamsha 7, which the
    // canonical Saravali table does NOT class as Pushkar for Aries.
    expect(isInPushkarNavamsha(1, 21.0)).toBe(false);
  });

  it('Taurus 8.0° (was Pushkar in OLD caesarean, NOT canonical) is now NOT Pushkar', () => {
    // Old caesarean: Taurus 6.667–10° AND 20–23.333°. Canonical Taurus
    // Pushkars are navamshas 5 + 9 (13.333–16.667° and 26.667–30°).
    expect(isInPushkarNavamsha(2, 8.0)).toBe(false);
  });

  it('Sagittarius 18.0° (was Pushkar in OLD caesarean, NOT canonical) is now NOT Pushkar', () => {
    // Old caesarean: Sagittarius 16.667–20°. Canonical Sagittarius
    // Pushkars are navamshas 5 + 9 (13.333–16.667° and 26.667–30°).
    expect(isInPushkarNavamsha(9, 18.0)).toBe(false);
  });

  it('Pisces 18.0° (was Pushkar in OLD caesarean, NOT canonical) is now NOT Pushkar', () => {
    // Old caesarean: Pisces 16.667–20°. Canonical Pisces Pushkars are
    // navamshas 3 + 5 (6.667–10° and 13.333–16.667°).
    expect(isInPushkarNavamsha(12, 18.0)).toBe(false);
  });

  // ─── Positions canonical newly classes as Pushkar that OLD caesarean missed ─

  it('Taurus 14.0° (canonical Pushkar, OLD caesarean missed) is now Pushkar', () => {
    expect(isInPushkarNavamsha(2, 14.0)).toBe(true);
  });

  it('Sagittarius 14.0° (canonical Pushkar, OLD caesarean missed) is now Pushkar', () => {
    expect(isInPushkarNavamsha(9, 14.0)).toBe(true);
  });

  it('Pisces 8.0° (canonical Pushkar, OLD caesarean missed) is now Pushkar', () => {
    expect(isInPushkarNavamsha(12, 8.0)).toBe(true);
  });

  // ─── Edge cases / guard rails ────────────────────────────────────────────

  it('returns false for out-of-range sign', () => {
    expect(isInPushkarNavamsha(0, 5)).toBe(false);
    expect(isInPushkarNavamsha(13, 5)).toBe(false);
  });

  it('returns false for out-of-range degree', () => {
    expect(isInPushkarNavamsha(1, -1)).toBe(false);
    expect(isInPushkarNavamsha(1, 30)).toBe(false);
    expect(isInPushkarNavamsha(1, 31)).toBe(false);
  });

  it('boundary 0° of sign with Pushkar nav 1 is Pushkar (closed lower bound)', () => {
    // Aries nav 1 = 0–3.333°. The 0° boundary is INSIDE the navamsha.
    expect(isInPushkarNavamsha(1, 0)).toBe(true);
  });

  it('upper boundary 3.333° of nav 1 is NOT Pushkar (boundary belongs to next navamsha)', () => {
    // Math.floor(3.333 / 3.333) = 1 → navamsha 2, not navamsha 1.
    // This mirrors the half-open [start, end) convention the helper uses.
    expect(isInPushkarNavamsha(1, 30 / 9)).toBe(false);
  });
});
