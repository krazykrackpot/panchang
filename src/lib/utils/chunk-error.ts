/**
 * Shared helpers for recovering from `ChunkLoadError` after a deploy.
 *
 * Background: Next.js code-splits per route. Each production build emits a
 * fresh set of content-hashed chunks. Vercel garbage-collects old chunk
 * files shortly after the deployment they came from is no longer the
 * active production. A user with a tab still open from the previous deploy
 * will have HTML referring to chunks that 404, and any client-side
 * navigation or lazy `import()` throws `ChunkLoadError`.
 *
 * The chunk error can surface in two places:
 *  - As a global window error / unhandledrejection → handled by
 *    `ChunkErrorListener` mounted in the root layout.
 *  - As an error caught by a React error boundary (the route-level
 *    `error.tsx` files) → handled by `RouteError` calling `recoverFromChunkError`
 *    here.
 *
 * Both call the same `recoverFromChunkError` which:
 *   1. Checks the error is genuinely a chunk-load error.
 *   2. Verifies the page has finished loading (no SSR-bootstrap reloads).
 *   3. Sets a sessionStorage flag so we never reload twice — if the chunk
 *      is still missing after one hardReload, fall through to the
 *      user-friendly error UI rather than loop.
 *   4. Calls `hardReload()` (unregisters SW, clears caches, cache-busts).
 *
 * When the loop-guard does fire (second chunk error in same session),
 * RouteError shows a polite "we need to refresh" UI that includes a
 * "Refresh & continue" button calling `hardReload()` directly. The
 * developer-facing error message is hidden behind a "Show technical
 * details" disclosure — users see nothing about chunk paths or
 * deployment IDs.
 */

const SESSION_RELOAD_KEY = 'chunkErrorReloadedAt';

export function isChunkLoadError(err: unknown): boolean {
  if (!err) return false;
  // unhandledrejection event.reason may be a raw string, not an Error.
  // Coerce defensively so we don't miss those cases.
  const e = (typeof err === 'object' ? err : {}) as { name?: string; message?: string };
  if (e.name === 'ChunkLoadError') return true;
  const msg = typeof err === 'string' ? err : String(e.message ?? '');
  return /Failed to (load|fetch) (chunk|dynamically imported module)/i.test(msg)
      || /Loading chunk \d+ failed/i.test(msg)
      || /Loading CSS chunk/i.test(msg);
}

/**
 * Best-effort recovery from a chunk-load error. Returns true if a reload
 * was triggered (caller should stop further error handling), false if
 * the error wasn't recoverable (caller should fall through to normal
 * error UI).
 */
export function recoverFromChunkError(source: string, err: unknown): boolean {
  if (typeof window === 'undefined') return false;
  if (!isChunkLoadError(err)) return false;

  if (document.readyState !== 'complete') {
    // Reloading mid-bootstrap is a recipe for loops. Skip.
    return false;
  }

  // sessionStorage can throw in private browsing (SecurityError) or when
  // the quota is exceeded (QuotaExceededError). If we can't read or
  // write the loop-guard flag, we can't safely auto-reload — a flag-less
  // reload could cycle forever in those browsers. Bail out and surface
  // the error normally.
  try {
    const recent = sessionStorage.getItem(SESSION_RELOAD_KEY);
    if (recent) {
      console.error(`[chunk-error] ${source}: still failing after reload; surfacing to user:`, err);
      return false;
    }
    sessionStorage.setItem(SESSION_RELOAD_KEY, String(Date.now()));
  } catch (storageErr) {
    console.error(`[chunk-error] ${source}: sessionStorage unavailable, skipping auto-reload to avoid loop:`, storageErr, err);
    return false;
  }

  console.warn(`[chunk-error] ${source}: hard-reloading to recover stale chunks:`, err);
  // Fire-and-forget; the page is about to unload.
  void hardReload();
  return true;
}

/**
 * Aggressive reload that bypasses every layer of caching:
 *   1. Unregisters all service workers (might be serving cached HTML
 *      that still points at gone chunks)
 *   2. Clears every Cache Storage entry (SW caches, stale chunk
 *      responses)
 *   3. Clears the chunk-error loop guard so the next chunk failure
 *      can trigger recovery again
 *   4. Navigates to the current URL with a cache-busting `_r=<ts>`
 *      query param, forcing the browser to fetch fresh HTML
 *
 * A plain `window.location.reload()` was insufficient in practice —
 * iOS Safari and some Chrome configurations still served chunks from
 * disk cache, so the user reloaded into the same broken state. This
 * helper covers the edge cases at the cost of a few hundred ms of
 * cleanup before the navigation kicks in.
 */
export async function hardReload(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Drop the loop-guard so a future chunk-error on this tab can retry
  // the auto-recovery path.
  try {
    sessionStorage.removeItem(SESSION_RELOAD_KEY);
  } catch {
    /* private browsing — ignore */
  }

  // Run both cleanup tasks in parallel and race them against a 1 s
  // timeout. On slow / older devices the storage APIs can hang for
  // multiple seconds; we'd rather skip cleanup than make the user
  // stare at a broken page. Cleanup is best-effort either way — the
  // cache-busted reload below still forces fresh HTML even when these
  // tasks didn't complete.
  const cleanupTasks: Promise<unknown>[] = [];

  if ('serviceWorker' in navigator) {
    cleanupTasks.push(
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => Promise.all(regs.map((r) => r.unregister())))
        .catch((e) => console.warn('[chunk-error] failed to unregister service workers:', e)),
    );
  }

  if (typeof caches !== 'undefined') {
    cleanupTasks.push(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .catch((e) => console.warn('[chunk-error] failed to clear caches:', e)),
    );
  }

  if (cleanupTasks.length > 0) {
    try {
      await Promise.race([
        Promise.all(cleanupTasks),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
    } catch (e) {
      console.warn('[chunk-error] cleanup hit unexpected error:', e);
    }
  }

  // Navigate with a cache-busting query param. `replace` (not `assign`)
  // so the broken state doesn't end up in the back-history.
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('_r', String(Date.now()));
    window.location.replace(url.toString());
  } catch {
    // URL constructor can fail for exotic cases; fall back to plain reload.
    window.location.reload();
  }
}
