'use client';

/**
 * Reusable hook for sharing server-generated card images.
 *
 * Pattern: fetch PNG from /api/card/[type] → native share on mobile,
 * download on desktop. Same pattern as NakshatraShareButton.
 */

import { useState, useCallback } from 'react';

interface UseCardShareOptions {
  /** The /api/card/... URL to fetch the PNG from. */
  cardUrl: string;
  /** Filename for the downloaded/shared PNG. */
  filename: string;
  /** Share title (mobile native share sheet). */
  title: string;
  /** Share text (mobile native share sheet). */
  text: string;
}

interface UseCardShareResult {
  sharing: boolean;
  done: boolean;
  handleShare: () => Promise<void>;
}

export function useCardShare({ cardUrl, filename, title, text }: UseCardShareOptions): UseCardShareResult {
  const [sharing, setSharing] = useState(false);
  const [done, setDone] = useState(false);

  const handleShare = useCallback(async () => {
    setSharing(true);
    try {
      const res = await fetch(cardUrl);
      if (!res.ok) {
        console.error('[card-share] Card fetch failed:', res.status);
        return;
      }
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/png' });

      // Mobile: native share with image
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title, text, files: [file] });
      } else {
        // Desktop: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }

      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('[card-share] Share failed:', err);
      }
    } finally {
      setSharing(false);
    }
  }, [cardUrl, filename, title, text]);

  return { sharing, done, handleShare };
}
