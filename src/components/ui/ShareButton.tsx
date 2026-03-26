'use client';

import { useState } from 'react';
import { Share2, Check, Link as LinkIcon } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

export default function ShareButton({ title, text, url, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  async function handleShare() {
    // Try native Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // User cancelled or API unavailable — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Final fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label={copied ? 'Link copied' : 'Share this page'}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 ${
        copied
          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
          : 'border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share
        </>
      )}
    </button>
  );
}
