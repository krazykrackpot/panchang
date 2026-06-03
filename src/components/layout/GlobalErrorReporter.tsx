'use client';

import { useEffect, useRef } from 'react';
import { isChunkLoadError } from '@/lib/utils/chunk-error';

/**
 * Forwards window-level uncaught errors, unhandled rejections, and
 * React hydration mismatches to `/api/client-error` so they reach
 * Vercel logs. Errors caught inside React error boundaries are
 * already reported by `RouteError`; this fills the gap for everything
 * thrown outside the tree.
 *
 * Chunk-load errors are skipped — `ChunkErrorListener` already owns
 * those (recovery + reload). Forwarding them here would double-log.
 *
 * Hydration mismatches (React #418 / #423 / #425) surface via
 * `console.error` rather than `window.onerror`, so we wrap
 * `console.error` to detect their signatures and forward them as a
 * separate `source: 'hydration'` event. CLAUDE.md Lesson ZD canary.
 */

const HYDRATION_SIGNATURES = [
  'Hydration failed',
  'There was an error while hydrating',
  'Text content did not match',
  "server-rendered HTML didn't match",
  'Minified React error #418',
  'Minified React error #423',
  'Minified React error #425',
];

export function isHydrationMismatchMessage(args: unknown[]): boolean {
  for (const arg of args) {
    if (typeof arg !== 'string') continue;
    for (const sig of HYDRATION_SIGNATURES) {
      if (arg.includes(sig)) return true;
    }
  }
  return false;
}

function postError(payload: { source: string; message: string; stack?: string }) {
  if (typeof window === 'undefined') return;
  try {
    void fetch('/api/client-error', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        source: payload.source,
        message: payload.message,
        stack: payload.stack,
        url: window.location.href,
        ua: navigator.userAgent,
        ts: new Date().toISOString(),
      }),
    }).catch(() => {
      /* never block UI on logging */
    });
  } catch {
    /* never block UI on logging */
  }
}

export default function GlobalErrorReporter() {
  // Strict-mode double-mounts the effect; guard against double-wrap of
  // console.error, which would compound on every remount.
  const installedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (installedRef.current) return;
    installedRef.current = true;

    const onError = (event: ErrorEvent) => {
      if (isChunkLoadError(event.error) || isChunkLoadError({ message: event.message })) {
        return;
      }
      const err = event.error as { stack?: string } | undefined;
      postError({
        source: 'window.error',
        message: event.message || String(event.error),
        stack: err?.stack?.slice(0, 4000),
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) return;
      const reason = event.reason;
      const isErr = reason instanceof Error;
      postError({
        source: 'unhandledrejection',
        message: isErr ? reason.message : String(reason),
        stack: isErr ? reason.stack?.slice(0, 4000) : undefined,
      });
    };

    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      if (isHydrationMismatchMessage(args)) {
        const first = typeof args[0] === 'string' ? args[0] : String(args[0]);
        postError({ source: 'hydration', message: first.slice(0, 500) });
      }
      originalConsoleError.apply(console, args as Parameters<typeof console.error>);
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
      console.error = originalConsoleError;
      installedRef.current = false;
    };
  }, []);

  return null;
}
