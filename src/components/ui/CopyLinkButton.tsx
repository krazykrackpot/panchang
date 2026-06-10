'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link2, Check } from 'lucide-react';

interface CopyLinkButtonProps {
  anchor: string;
  ariaLabel: string;
  copyLabel?: string;
  copiedLabel?: string;
}

export default function CopyLinkButton({
  anchor,
  ariaLabel,
  copyLabel = 'Copy link',
  copiedLabel = 'Copied',
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  // Hold the "copied" feedback timer so an unmount during the 2-second
  // window can't fire setCopied(false) on a dead component. Gemini #650 MED.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onClick = useCallback(() => {
    // Preserve existing query params (?utm_*, ?locale=, etc.) — bloggers
    // sharing links keep their attribution intact. Gemini #650 MED.
    const href = window.location.href.split('#')[0] + '#' + anchor;
    const clip = navigator.clipboard;
    if (!clip || typeof clip.writeText !== 'function') {
      console.error('[ReferenceBlock] clipboard API unavailable');
      return;
    }
    clip
      .writeText(href)
      .then(() => {
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch((err: unknown) => {
        console.error('[ReferenceBlock] clipboard write failed:', err);
      });
  }, [anchor]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-gold-light transition-colors duration-150 px-2 py-1 rounded border border-transparent hover:border-gold-primary/30"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" aria-hidden="true" />
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <Link2 className="w-3 h-3" aria-hidden="true" />
          <span>{copyLabel}</span>
        </>
      )}
    </button>
  );
}
