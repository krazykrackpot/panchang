/**
 * Precompute reader — the page-side consumer.
 *
 * Contract:
 *   1. If PRECOMPUTE_FETCH_ENABLED is unset/false → fallback() runs every
 *      time. Kill switch (closes plan rollback requirement).
 *   2. If the Blob is missing → fallback() runs, page renders correctly.
 *      Backfill failures degrade gracefully (closes issue D).
 *   3. If the Blob is present but schema-invalid → fallback() runs +
 *      logs a warning. Catches schema drift mid-rollout (closes issue J).
 *   4. If the Blob is older than MAX_STALE_DAYS → fallback() runs.
 *      Catches dead cron jobs (closes plan staleness risk).
 *   5. Otherwise → parsed Blob returns.
 *
 * No double-cache (closes plan issue A): this reader does NOT use
 * `unstable_cache` or `'use cache'` itself. Caching is the route page's
 * responsibility — it sets `revalidate = false` and wraps its render in
 * a tagged cache so revalidateTag from /api/precompute/revalidate flips
 * exactly the affected entries. Reader is pure: storage → parse → return.
 */

import type { z } from 'zod';
import { getStorage } from './storage';

const MAX_STALE_DAYS = 7;

interface GetPrecomputedOptions<T> {
  /** Logical key (forward-slash-separated, no extension). */
  key: string;
  /** Zod schema for the page model. */
  schema: z.ZodSchema<T>;
  /** Fallback to live compute on any failure. Must produce a valid T. */
  fallback: () => Promise<T> | T;
}

export async function getPrecomputed<T>(opts: GetPrecomputedOptions<T>): Promise<T> {
  const { key, schema, fallback } = opts;

  // 1. Kill switch.
  if (process.env.PRECOMPUTE_FETCH_ENABLED !== 'true') {
    return await fallback();
  }

  // 2-5. Try the Blob.
  try {
    const raw = await getStorage().get(key);
    if (raw === null) {
      // Cold-cache: no precompute yet for this key. Fallback silently —
      // this is expected for keys outside the precompute window.
      return await fallback();
    }

    const json = JSON.parse(raw);

    // Schema check.
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      console.warn(
        '[precompute] schema mismatch — falling back to live compute',
        { key, issues: parsed.error.issues.slice(0, 3) },
      );
      return await fallback();
    }

    // Staleness check. The shape requires _computedAt; if it's missing on
    // the parsed shape we treat as fresh (schemas that don't expose it
    // simply don't have the gate — pure-data shapes that never go stale).
    //
    // NaN guard (Gemini #470 finding #5): a corrupted _computedAt string
    // produces `new Date('garbage').getTime() === NaN`, and `NaN > maxMs`
    // is `false`. Without the explicit isNaN check, malformed timestamps
    // silently serve stale data forever — defeating the entire staleness
    // gate. Treat NaN as "stale" so we fall back to live compute.
    const computedAt = (parsed.data as unknown as { _computedAt?: string })._computedAt;
    if (computedAt) {
      const ageMs = Date.now() - new Date(computedAt).getTime();
      const maxMs = MAX_STALE_DAYS * 24 * 60 * 60 * 1000;
      if (isNaN(ageMs) || ageMs > maxMs) {
        console.warn('[precompute] entry stale or has invalid _computedAt — falling back', {
          key,
          ageDays: isNaN(ageMs) ? null : Math.round(ageMs / (24 * 60 * 60 * 1000)),
          computedAt,
        });
        return await fallback();
      }
    }

    return parsed.data;
  } catch (err) {
    // Network error, JSON parse error, storage backend error — fall back.
    // Production code must NEVER throw from getPrecomputed; the page
    // render contract is "fast or correct, never broken".
    console.warn('[precompute] read failed — falling back to live compute', {
      key,
      error: err instanceof Error ? err.message : String(err),
    });
    return await fallback();
  }
}
