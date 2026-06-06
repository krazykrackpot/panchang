/**
 * Page model for /choghadiya/[date].
 *
 * Closes "issue B" from the plan self-review: the schema is defined
 * against what the PAGE renders, not against raw `computeChoghadiya`
 * output. Each slot carries trilingual labels (LocaleText) — the page
 * does `tl(name, locale)` at render time, so one Blob serves all 9
 * visible locales.
 *
 * Versioned via the `_v` literal field. Bump when the shape changes in a
 * breaking way — readers will then fail schema validation and fall back
 * to live compute until a new precompute run lands.
 */

import { z } from 'zod';

const VISIBLE_LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'] as const;

const LocaleText = z.object(
  Object.fromEntries(VISIBLE_LOCALES.map((l) => [l, z.string().optional()])),
).and(z.object({ en: z.string() })); // en is the canonical fallback — must exist.

const ChoghadiyaSlot = z.object({
  name: LocaleText,
  /** 'shubh' | 'ashubh' | 'neutral' — kept as a plain string for
   *  forward-compat with any future canonical types. */
  nature: z.string(),
  /** SSR-stable HH:mm strings — no Date objects in the Blob. */
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const ChoghadiyaPageModel = z.object({
  /** Schema version — bump on breaking changes. */
  _v: z.literal(1),
  /** ISO 8601 UTC timestamp of when this Blob was written. Used by the
   *  reader for the 7-day staleness fallback (closes plan issue D). */
  _computedAt: z.string(),

  /** YYYY-MM-DD — the URL date. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** City slug — matches the URL segment. */
  city: z.string().regex(/^[a-z][a-z0-9-]*$/),
  /** 0=Sun .. 6=Sat — matches Date.getUTCDay() (Lesson O). */
  weekday: z.number().int().min(0).max(6),

  /** Day choghadiya — sunrise → sunset. Exactly 8 slots when computed
   *  correctly, but kept as a flexible array so an off-day in compute
   *  doesn't reject the whole Blob. */
  daySlots: z.array(ChoghadiyaSlot),
  /** Night choghadiya — sunset → next sunrise. */
  nightSlots: z.array(ChoghadiyaSlot),
});

export type ChoghadiyaPageModel = z.infer<typeof ChoghadiyaPageModel>;
export type ChoghadiyaSlot = z.infer<typeof ChoghadiyaSlot>;
