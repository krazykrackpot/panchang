'use server';

/**
 * Server Action for /kp/prashna — keeps the KP engine off the client bundle.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §3
 */

import { castKPPrashna, type KPPrashnaInput, type KPPrashnaResult } from '@/lib/kp/prashna';

/** Public shape consumed by the Client (re-export of KPPrashnaResult). */
export type ClientPrashnaResult = KPPrashnaResult;

export async function castPrashnaAction(input: KPPrashnaInput): Promise<ClientPrashnaResult> {
  try {
    return castKPPrashna(input);
  } catch (err) {
    console.error('[kp/prashna] action failed:', err);
    throw err instanceof Error ? err : new Error(String(err));
  }
}
