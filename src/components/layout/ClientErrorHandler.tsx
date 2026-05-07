'use client';

import { useEffect } from 'react';

/**
 * Global client-side error handler.
 * Catches unhandled promise rejections and uncaught errors,
 * logs them with tagged prefixes so they appear in Vercel Logs.
 *
 * Mount once in the root layout's ClientShell.
 */
export default function ClientErrorHandler() {
  useEffect(() => {
    const handleRejection = (e: PromiseRejectionEvent) => {
      console.error('[unhandled-rejection]', e.reason);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('[global-error]', e.message, e.filename, e.lineno, e.colno);
    };

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
