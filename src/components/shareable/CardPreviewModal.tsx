'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Link as LinkIcon, Check } from 'lucide-react';
import { ShareCardButton, SaveImageButton } from './ShareCardButton';

interface CardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  cardUrl: string;
  imageBlob?: Blob;
  children: React.ReactNode;
}

/**
 * Modal overlay that previews a shareable card with share/save/copy actions.
 * Animates in via CSS (opacity + scale). No Framer Motion dependency.
 */
export function CardPreviewModal({
  isOpen,
  onClose,
  title,
  cardUrl,
  imageBlob,
  children,
}: CardPreviewModalProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Animate in after mount
  useEffect(() => {
    if (isOpen) {
      // Trigger CSS transition on next frame
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('[CardPreviewModal] copy link failed:', err);
    }
  }, [cardUrl]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300"
      style={{
        backgroundColor: visible ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)',
      }}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gold-primary/20 bg-bg-secondary transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold-primary/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-gold-light">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-gold-primary/10 hover:text-gold-light"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto">{children}</div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-gold-primary/10 px-6 py-4">
          <ShareCardButton
            cardUrl={cardUrl}
            imageBlob={imageBlob}
            title={title}
            text={`Check out my ${title} on Dekho Panchang`}
          />

          <SaveImageButton imageBlob={imageBlob} filename={`${title.toLowerCase().replace(/\s+/g, '-')}.png`} />

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-lg border border-gold-primary/40 bg-gold-primary/10 px-4 py-2 text-sm font-medium text-gold-light transition-colors hover:bg-gold-primary/20"
          >
            {linkCopied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <LinkIcon className="h-4 w-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
