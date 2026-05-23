'use client';

/**
 * Recovers from `ChunkLoadError` — what happens when a tab loaded from a
 * previous deployment tries to lazy-load a JS chunk whose filename no
 * longer exists on the current deployment's CDN.
 *
 * Next.js code-splits per-route. Each production build emits a fresh set
 * of content-hashed chunks. Vercel garbage-collects old chunk files
 * shortly after the deployment they came from is no longer the active
 * production. A user with a tab still open from the previous deploy will
 * have HTML referring to chunks that 404, and any client-side navigation
 * or lazy `import()` will throw `ChunkLoadError`.
 *
 * Fix: catch the error globally and `location.reload()`. The browser
 * fetches fresh HTML pointing at the CURRENT deployment's chunks; the
 * user sees a quick refresh instead of a white screen.
 *
 * Guards against infinite reload loops by:
 *   1. Only reloading if the page is fully loaded (avoids loops on SSR
 *      bootstrap).
 *   2. Setting a sessionStorage flag so we never reload twice in the
 *      same session — if the chunk still 404s after one reload, fall
 *      through to the normal error UI so the user can decide.
 */

import { useEffect } from 'react';

const SESSION_RELOAD_KEY = 'chunkErrorReloadedAt';

function isChunkLoadError(err: unknown): boolean {
  if (!err) return false;
  const e = err as { name?: string; message?: string };
  if (e.name === 'ChunkLoadError') return true;
  const msg = String(e.message ?? '');
  return /Failed to (load|fetch) (chunk|dynamically imported module)/i.test(msg)
      || /Loading chunk \d+ failed/i.test(msg)
      || /Loading CSS chunk/i.test(msg);
}

function maybeReload(reason: string, err: unknown): void {
  if (typeof window === 'undefined') return;
  if (document.readyState !== 'complete') return;
  const recent = sessionStorage.getItem(SESSION_RELOAD_KEY);
  if (recent) {
    // Already reloaded once this session and the chunk still 404s — don't
    // loop. Let the user see the error and decide.
    console.error('[chunk-error] still failing after reload; surfacing:', reason, err);
    return;
  }
  sessionStorage.setItem(SESSION_RELOAD_KEY, String(Date.now()));
  console.warn('[chunk-error] reloading to recover stale chunks:', reason);
  window.location.reload();
}

export function ChunkErrorListener() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onError = (event: ErrorEvent) => {
      if (isChunkLoadError(event.error) || isChunkLoadError({ message: event.message })) {
        maybeReload('window.error', event.error ?? event.message);
      }
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) {
        maybeReload('unhandledrejection', event.reason);
      }
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
