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
 *      is still missing after one reload, fall through to the normal
 *      error UI rather than loop.
 *   4. `location.reload()`.
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

  console.warn(`[chunk-error] ${source}: reloading to recover stale chunks:`, err);
  window.location.reload();
  return true;
}
