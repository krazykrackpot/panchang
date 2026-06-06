/**
 * Precompute writer — used by scripts/precompute/*.ts.
 *
 * Responsibilities:
 *   1. Serialize the page model via its Zod schema. Output schema-valid
 *      JSON or refuse — better to fail the precompute run than write a
 *      Blob the reader will reject anyway.
 *   2. Idempotent. Re-running over the same (key, value) is a no-op.
 *      Closes plan issue D: backfill is restartable.
 *   3. Skip-if-present mode for backfill resumability. When
 *      `skipIfPresent: true`, the writer checks exists() first.
 *
 * The writer does NOT call the revalidate webhook directly — that's the
 * orchestrator's job, after ALL writes for a batch complete (closes plan
 * issue E: upload-then-revalidate atomicity).
 */

import type { z } from 'zod';
import { getStorage } from './storage';

interface SetPrecomputedOptions<T> {
  key: string;
  schema: z.ZodSchema<T>;
  data: T;
  /** Backfill mode: don't overwrite if already present. */
  skipIfPresent?: boolean;
}

export interface SetPrecomputedResult {
  /** 'written' = new write succeeded. 'skipped' = present + skipIfPresent. */
  status: 'written' | 'skipped';
  key: string;
  bytes?: number;
}

export async function setPrecomputed<T>(
  opts: SetPrecomputedOptions<T>,
): Promise<SetPrecomputedResult> {
  const { key, schema, data, skipIfPresent = false } = opts;

  const storage = getStorage();

  if (skipIfPresent && (await storage.exists(key))) {
    return { status: 'skipped', key };
  }

  // Schema validation BEFORE write. We refuse to publish invalid data.
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `[precompute] writer refused invalid data for key=${key}: ${parsed.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ')}`,
    );
  }

  const json = JSON.stringify(parsed.data);
  await storage.put(key, json);

  return { status: 'written', key, bytes: json.length };
}
