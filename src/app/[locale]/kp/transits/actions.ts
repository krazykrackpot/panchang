'use server';

/**
 * Server Action for /kp/transits — returns the 7 KP ruling planets for a
 * moment + location without exposing the full chart pipeline to the
 * client bundle. Used both for the initial SSR render and the 60s
 * client-side refresh.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §4
 */

import {
  getRulingPlanetsForMoment,
  type RulingNowInput,
  type RulingNowResult,
} from '@/lib/kp/ruling-now';

export type ClientRulingNowResult = RulingNowResult;

export async function getCurrentRPsAction(
  input: RulingNowInput,
): Promise<ClientRulingNowResult> {
  try {
    return getRulingPlanetsForMoment(input);
  } catch (err) {
    console.error('[kp/transits] action failed:', err);
    throw err instanceof Error ? err : new Error(String(err));
  }
}
