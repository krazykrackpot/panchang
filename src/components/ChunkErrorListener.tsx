'use client';

/**
 * Global listener for `ChunkLoadError` thrown outside the React tree
 * (window.error / unhandledrejection). Errors thrown INSIDE the tree are
 * caught by route `error.tsx` boundaries and recovered separately via
 * `RouteError` — see `src/lib/utils/chunk-error.ts` for the shared
 * detection + reload logic.
 */

import { useEffect } from 'react';
import { isChunkLoadError, recoverFromChunkError } from '@/lib/utils/chunk-error';

export function ChunkErrorListener() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onError = (event: ErrorEvent) => {
      if (isChunkLoadError(event.error) || isChunkLoadError({ message: event.message })) {
        recoverFromChunkError('window.error', event.error ?? event.message);
      }
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) {
        recoverFromChunkError('unhandledrejection', event.reason);
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
