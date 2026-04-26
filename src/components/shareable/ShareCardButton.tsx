'use client';

import { useState, useCallback } from 'react';
import { Share2, Download, Check } from 'lucide-react';

interface ShareCardButtonProps {
  cardUrl: string;
  imageBlob?: Blob;
  title: string;
  text: string;
  className?: string;
}

/**
 * Share button that uses the Web Share API on mobile (with image file if
 * available) and falls back to clipboard copy on desktop.
 *
 * Also exposes a "Save Image" variant that triggers a PNG download.
 */
export function ShareCardButton({
  cardUrl,
  imageBlob,
  title,
  text,
  className = '',
}: ShareCardButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      // Attempt native share with image file
      if (typeof navigator !== 'undefined' && navigator.share) {
        const shareData: ShareData = { title, text, url: cardUrl };

        if (imageBlob) {
          const file = new File([imageBlob], 'card.png', { type: 'image/png' });
          // navigator.canShare is not available everywhere — guard it
          if (navigator.canShare?.({ files: [file] })) {
            shareData.files = [file];
          }
        }

        await navigator.share(shareData);
        return;
      }

      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    } catch (err) {
      // User cancelled share sheet — not a real error
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('[ShareCardButton] share failed:', err);

      // Last-resort fallback: try clipboard
      try {
        await navigator.clipboard.writeText(cardUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipErr) {
        console.error('[ShareCardButton] clipboard fallback failed:', clipErr);
      }
    }
  }, [cardUrl, imageBlob, title, text]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-2 rounded-lg border border-gold-primary/40 bg-gold-primary/10 px-4 py-2 text-sm font-medium text-gold-light transition-colors hover:bg-gold-primary/20 ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Link copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Save Image Button
// ---------------------------------------------------------------------------

interface SaveImageButtonProps {
  imageBlob?: Blob;
  filename?: string;
  className?: string;
}

/**
 * Triggers a PNG download of the card image blob.
 * Disabled when no blob is available.
 */
export function SaveImageButton({
  imageBlob,
  filename = 'dekho-panchang-card.png',
  className = '',
}: SaveImageButtonProps) {
  const handleSave = useCallback(() => {
    if (!imageBlob) return;

    const url = URL.createObjectURL(imageBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }, [imageBlob, filename]);

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={!imageBlob}
      className={`inline-flex items-center gap-2 rounded-lg border border-gold-primary/40 bg-gold-primary/10 px-4 py-2 text-sm font-medium text-gold-light transition-colors hover:bg-gold-primary/20 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <Download className="h-4 w-4" />
      Save Image
    </button>
  );
}
