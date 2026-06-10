/**
 * Page model for /gauri-panchang/[date].
 *
 * Mirrors the choghadiya page-model shape — both routes are date-keyed,
 * deterministic per (date, city), and render the same day/night-slots
 * table structure. One Blob serves all 9 visible locales: each slot
 * carries a `LocaleText` `name` and the page resolves at render time.
 *
 * Schema versioned via `_v` literal. Bump on breaking shape changes.
 * Readers fail-soft to live compute on schema mismatch.
 */

import { z } from 'zod';

// LocaleText — open record. See choghadiya schema for the rationale on
// why we need static keys for the 9 visible locales + sa + a catchall.
const LocaleText = z.object({
  en: z.string(),
  hi: z.string().optional(),
  sa: z.string().optional(),
  ta: z.string().optional(),
  te: z.string().optional(),
  bn: z.string().optional(),
  gu: z.string().optional(),
  kn: z.string().optional(),
  mai: z.string().optional(),
  mr: z.string().optional(),
}).catchall(z.string().optional());

const GauriSlot = z.object({
  /** Per-locale period name (Amritha/Siddha/etc. in the locale's script). */
  name: LocaleText,
  /** Canonical type slug — kept as a plain string to avoid coupling
   *  the Blob schema to the engine's GauriType union. */
  type: z.string(),
  /** 'auspicious' | 'inauspicious' | 'neutral' on the canonical type. */
  nature: z.string(),
  /** SSR-stable HH:mm — no Date objects in the Blob. */
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const GauriPanchangPageModel = z.object({
  _v: z.literal(1),
  _computedAt: z.string(),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().regex(/^[a-z][a-z0-9-]*$/),
  /** 0=Sun..6=Sat — matches Date.getUTCDay() (Lesson O). */
  weekday: z.number().int().min(0).max(6),
  /** Tithi number 1-30. Used for chrome text only (not for engine calc). */
  tithiNumber: z.number().int().min(0).max(30),

  daySlots: z.array(GauriSlot),
  nightSlots: z.array(GauriSlot),
});

export type GauriPanchangPageModel = z.infer<typeof GauriPanchangPageModel>;
export type GauriSlot = z.infer<typeof GauriSlot>;
