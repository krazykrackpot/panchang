'use client';

/**
 * Client-side helpers for firing gamification events at the moment of a
 * user action — chart save, module complete, tool first-use.
 *
 * Pattern (mirrors the chart_saved wiring shipped in PR #477):
 *
 *   1. Caller performs the actual write (e.g. supabase upsert).
 *   2. On success, calls one of the `fire*` functions below.
 *   3. The helper wraps a session lookup + POST in `void (async () =>
 *      {...})()` so the caller's promise resolves immediately — the
 *      gamification award happens out-of-band.
 *   4. `res.ok` is checked because `fetch` only rejects on network
 *      failures; an HTTP 401 / 503 / 500 would silently pass `.catch()`
 *      otherwise (Gemini PR #477 round-1 MED).
 *
 * Each helper is fire-and-forget. A failed gamification request must
 * not affect the action the user just performed. Errors land in the
 * console only — they're operationally interesting but not user-
 * actionable.
 *
 * Why a helper instead of inlining at each site:
 *
 *   - module_completed has two call sites in learning-progress-store
 *     (markQuizPassed + markComplete) that would otherwise share 9
 *     lines verbatim.
 *   - tool_used will get wired into ~10 tool entry points over time.
 *     Inline duplication compounds.
 */

import { getSupabase } from '@/lib/supabase/client';
import type { COUNTED_TOOLS } from '@/lib/constants/badges';

type CountedTool = (typeof COUNTED_TOOLS)[number];

async function fireProgressEvent(
  endpoint: string,
  body: Record<string, unknown> | null,
  tag: string,
): Promise<void> {
  try {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) throw new Error(`${tag} returned ${res.status}`);
  } catch (err) {
    console.error(`[gamification] ${tag} failed:`, err);
  }
}

/**
 * Fire after a module's status transitions to 'mastered'.
 *
 * `moduleId` is required by the server-side event type (used for any
 * future "which modules has this user completed" logic). Pass the same
 * id we just wrote into `learning_progress.module_id`.
 */
export function fireModuleCompleted(moduleId: string): void {
  void fireProgressEvent(
    '/api/user/progress/module-completed',
    { module_id: moduleId },
    'module_completed',
  );
}

/**
 * Fire the first time a user runs one of the COUNTED_TOOLS. Server-
 * side dedup means it's safe to call on every run — the awardProgress
 * `tool_used` case is a no-op when the slug is already in the user's
 * tools_used set.
 */
export function fireToolUsed(toolSlug: CountedTool): void {
  void fireProgressEvent(
    '/api/user/progress/tool-used',
    { tool_slug: toolSlug },
    'tool_used',
  );
}
