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
 * Statically declared (Gemini #470 finding #4) — using
 * `Object.fromEntries(VISIBLE_LOCALES.map(...))` loses TS type info and
 * infers as `Record<string, any>` instead of the precise locale-keyed
 * shape. The list of visible locales is small and stable, so the static
 * form is strictly better: it gives the inferred type
 *   { en: string; hi?: string; ta?: string; te?: string; bn?: string;
 *     gu?: string; kn?: string; mai?: string; mr?: string }
 * which pages consuming the page model can rely on at compile time.
 *
 * If the visible-locale set ever changes, this object updates in lockstep
 * with `src/lib/i18n/config.ts`. There's no canonical-helper alternative
 * because Zod's z.object() needs literal keys.
 */
const LocaleText = z.object({
  en: z.string(), // canonical fallback — required
  hi: z.string().optional(),
  ta: z.string().optional(),
  te: z.string().optional(),
  bn: z.string().optional(),
  gu: z.string().optional(),
  kn: z.string().optional(),
  mai: z.string().optional(),
  mr: z.string().optional(),
});

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
