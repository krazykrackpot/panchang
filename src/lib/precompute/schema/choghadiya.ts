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

/**
 * Trilingual / multilingual label.
 *
 * Schema must mirror the canonical `LocaleText` from src/types/panchang.ts,
 * which is an OPEN record: `{ en: string; [key: string]: string | undefined }`.
 * Engine constants extend this via `Trilingual` to guarantee `hi` and `sa`.
 *
 * Two requirements collide:
 *   1. Static keys for TS autocomplete (Gemini cycle-1 #4).
 *   2. Preserve any locale the engine emits — without `.catchall`, Zod's
 *      `safeParse` SILENTLY STRIPS unknown keys. The Phase-1 equivalence
 *      test caught exactly this: live compute returned `{en, hi, sa}` but
 *      the Blob round-trip dropped `sa`, breaking State-A === State-C.
 *
 * Resolution: static fields for the 9 visible URL-locales PLUS `sa`
 * (engine still emits Sanskrit in constants even though the `/sa/`
 * URL locale is retired per memory). `.catchall(string|optional)` is
 * the safety net for any future locale the engine adds without a
 * schema bump.
 */
const LocaleText = z.object({
  en: z.string(), // canonical fallback — required
  hi: z.string().optional(),
  sa: z.string().optional(), // engine still emits — DO NOT remove (cycle-3 finding)
  ta: z.string().optional(),
  te: z.string().optional(),
  bn: z.string().optional(),
  gu: z.string().optional(),
  kn: z.string().optional(),
  mai: z.string().optional(),
  mr: z.string().optional(),
}).catchall(z.string().optional());

const ChoghadiyaSlot = z.object({
  name: LocaleText,
  /** The canonical 7-name set rotates per weekday +
   *  day-vs-night. Kept as a plain string to avoid coupling the
   *  Blob schema to the canonical union — the page reads it as
   *  string anyway (SSRSlot.type: string). */
  type: z.string(),
  /** 'auspicious' | 'inauspicious' | 'neutral' on the canonical
   *  type. Plain string here for the same reason. */
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
