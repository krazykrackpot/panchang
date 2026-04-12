'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, Check, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ════════════════════════════════════════════════════════════════
   Labels
   ════════════════════════════════════════════════════════════════ */
const LABELS = {
  share:   { en: 'Share', hi: 'शेयर करें', sa: 'प्रसारयतु' },
  copied:  { en: 'Copied!', hi: 'कॉपी हुआ!', sa: 'प्रतिलिपितम्!' },
  copy:    { en: 'Copy Link', hi: 'लिंक कॉपी करें', sa: 'लिंक प्रतिलिपिः' },
  wa:      { en: 'WhatsApp', hi: 'व्हाट्सएप', sa: 'WhatsApp' },
  x:       { en: 'Post on X', hi: 'X पर पोस्ट', sa: 'X इति प्रसारयतु' },
};

/* ════════════════════════════════════════════════════════════════
   SVG icons (inline to avoid dependencies)
   ════════════════════════════════════════════════════════════════ */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════
   ShareButton component
   ════════════════════════════════════════════════════════════════ */
interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  locale: Locale;
  variant?: 'inline' | 'floating';
  className?: string;
}

export default function ShareButton({ title, text, url, locale, variant = 'inline', className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const l = (obj: { en: string; hi: string; sa: string }) => obj[locale] || obj.en;

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Detect native Web Share API support (typically mobile)
  useEffect(() => {
    setHasNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url: shareUrl });
    } catch {
      // User cancelled or API unavailable — silently ignore
    }
  }

  // Close floating panel on outside click
  useEffect(() => {
    if (variant !== 'floating' || !open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [variant, open]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;

  /* ── Inline variant ────────────────────────────────────────── */
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Native share — shown on mobile when available, hides individual buttons */}
        {hasNativeShare && (
          <button
            onClick={nativeShare}
            aria-label={l(LABELS.share)}
            className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gold-primary/10 hover:bg-gold-primary/20 text-gold-light border border-gold-primary/20 hover:border-gold-primary/40 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
            {l(LABELS.share)}
          </button>
        )}

        {/* WhatsApp — hidden on mobile when native share is available */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l(LABELS.wa)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/20 hover:border-[#25D366]/40 transition-all duration-200 ${hasNativeShare ? 'hidden sm:inline-flex' : ''}`}
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{l(LABELS.wa)}</span>
        </a>

        {/* X/Twitter — hidden on mobile when native share is available */}
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l(LABELS.x)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/8 hover:bg-white/15 text-white/80 border border-white/10 hover:border-white/20 transition-all duration-200 ${hasNativeShare ? 'hidden sm:inline-flex' : ''}`}
        >
          <XIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{l(LABELS.x)}</span>
        </a>

        {/* Copy link — always visible */}
        <button
          onClick={copyLink}
          aria-label={copied ? l(LABELS.copied) : l(LABELS.copy)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
            copied
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-gold-primary/8 hover:bg-gold-primary/15 border-gold-primary/20 hover:border-gold-primary/40 text-gold-light'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? l(LABELS.copied) : l(LABELS.copy)}</span>
        </button>
      </div>
    );
  }

  /* ── Floating variant ──────────────────────────────────────── */
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`} ref={panelRef}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 right-0 w-52 bg-gradient-to-br from-[#2d1b69]/95 via-[#1a1040]/95 to-bg-primary/95 backdrop-blur-xl border border-gold-primary/20 rounded-2xl p-3 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-gold-light text-xs font-bold uppercase tracking-wider">{l(LABELS.share)}</span>
              <button onClick={() => setOpen(false)} className="text-text-secondary hover:text-gold-light transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1.5">
              {/* WhatsApp — biggest */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] font-semibold text-sm transition-all"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {l(LABELS.wa)}
              </a>

              {/* X */}
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl bg-white/8 hover:bg-white/15 text-white/80 text-sm transition-all"
              >
                <XIcon className="w-4 h-4" />
                {l(LABELS.x)}
              </a>

              {/* Copy */}
              <button
                onClick={copyLink}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all ${
                  copied
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-gold-primary/10 hover:bg-gold-primary/20 text-gold-light'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? l(LABELS.copied) : l(LABELS.copy)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger pill */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg shadow-black/30 transition-all duration-300 ${
          open
            ? 'bg-gold-primary/20 border border-gold-primary/40 text-gold-light'
            : 'bg-gradient-to-r from-[#2d1b69]/90 to-[#1a1040]/90 backdrop-blur-xl border border-gold-primary/20 hover:border-gold-primary/40 text-gold-light'
        }`}
      >
        <Share2 className="w-4 h-4" />
        <span className="text-xs font-semibold">{l(LABELS.share)}</span>
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ShareRow — convenience wrapper that auto-generates share text
   from a page title. Renders the inline variant.
   ════════════════════════════════════════════════════════════════ */
interface ShareRowProps {
  /** Page title — used to build share text */
  pageTitle: string;
  /** Optional override for share text (skips auto-generation) */
  shareText?: string;
  /** Optional override URL */
  url?: string;
  locale: Locale;
  className?: string;
}

export function ShareRow({ pageTitle, shareText, url, locale, className = '' }: ShareRowProps) {
  const text = shareText || `${pageTitle} — Dekho Panchang`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-text-secondary/50 text-xs hidden sm:inline">
        {!isDevanagariLocale(locale) ? 'Share:' : locale === 'sa' ? 'प्रसारः:' : 'शेयर:'}
      </span>
      <ShareButton
        title={pageTitle}
        text={text}
        url={url}
        locale={locale}
        variant="inline"
      />
    </div>
  );
}
