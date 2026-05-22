'use client';

/**
 * BrihaspatiShare — share row under the done answer.
 *
 * Surfaces:
 *   - Copy            navigator.clipboard.writeText (full answer)
 *   - Email           mailto: link (full answer)
 *   - WhatsApp        wa.me intent (summary + link back)
 *   - X / Twitter     intent/tweet (summary + link back)
 *   - Native share    navigator.share when available (summary + link)
 *
 * Channel pragmatics:
 *   - Personal channels (copy, email) get the FULL answer text.
 *   - Social channels (WhatsApp, X) get a ~200-char summary + a link
 *     back to the marketing surface so a reader can come ask their own
 *     question. We never link to the actual saved-answer URL — the
 *     answer belongs to the asker only.
 *   - Native share gets the summary form too (it usually targets social
 *     surfaces; users wanting full text use Copy or Email).
 *
 * The Instagram image-card flow is a separate component (server-side
 * @vercel/og PNG) and lives in BrihaspatiShareImage.
 */

import { useEffect, useState } from 'react';

const MAX_SOCIAL_CHARS = 220;
const SITE_URL = 'https://dekhopanchang.com';
// `?ref=brihaspati-share` is a UTM-style tag so we can read traffic
// from shared answers in analytics without adding a real UTM cluster
// to every share intent (which Twitter sometimes truncates).
const SHARE_LINK = `${SITE_URL}/brihaspati?ref=share`;
const SHARE_HASH = '#brihaspati';

function summarise(text: string, max = MAX_SOCIAL_CHARS): string {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= max) return collapsed;
  // Cut on a word boundary, then add an ellipsis. We avoid cutting in
  // the middle of a Devanagari conjunct by stopping at the nearest
  // ASCII whitespace; in practice every Sanskrit answer has spaces.
  const slice = collapsed.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + '…';
}

export interface BrihaspatiShareProps {
  /** Full answer text (what the LLM produced). */
  answer: string;
  /** The user's question. Optional — when the panel is resumed via the
   *  Stripe round-trip we only have the answer, not the original prompt. */
  question?: string;
  /** Question id — required for the Instagram image-card download.
   *  When absent the "Download image" button is hidden. */
  questionId?: string;
  /** Async getter for the Supabase access token. Required for the
   *  authenticated image-card download. */
  getAccessToken?: () => Promise<string | null>;
  /** Optional locale — flips the share-line scaffolding into Hindi. */
  locale?: string;
}

export function BrihaspatiShare({
  answer,
  question,
  questionId,
  getAccessToken,
  locale = 'en',
}: BrihaspatiShareProps) {
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageState, setImageState] = useState<'idle' | 'loading' | 'error'>('idle');

  // Feature-detect native share once on mount. iOS Safari + Android
  // Chrome expose this; desktop browsers usually don't.
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  // Personal channels — full text, signed. Question line is included
  // only when we have it (the Stripe-resume path drops it).
  const fullText = [
    question ? (isHi ? `प्रश्न: ${question}` : `Q: ${question}`) : null,
    question ? '' : null,
    answer,
    '',
    isHi
      ? `— बृहस्पति AI ज्योतिषी · ${SITE_URL}`
      : `— Brihaspati AI Astrologer · ${SITE_URL}`,
  ].filter((l) => l !== null).join('\n');

  // Social channels — first ~200 chars + back-link.
  const socialText = `${summarise(answer)}\n\n${isHi ? 'पूर्ण उत्तर:' : 'Full answer:'} ${SHARE_LINK}${SHARE_HASH}`;
  const socialSubject = isHi ? 'बृहस्पति AI ज्योतिषी कहते हैं…' : 'Brihaspati AI Astrologer says…';

  // ── Handlers ────────────────────────────────────────────────────
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('[brihaspati-share] clipboard write failed:', err);
      // Fallback: select-all via prompt() so user can manually copy.
      // Only fires when clipboard API is blocked (some iframes / older
      // browsers). Slightly ugly but never silent.
      try {
        window.prompt(isHi ? 'कॉपी करने के लिए Ctrl+C दबाएँ:' : 'Press Ctrl+C to copy:', fullText);
      } catch {
        /* truly unable to recover — leave the user without a share */
      }
    }
  };

  const onEmail = () => {
    const body = encodeURIComponent(fullText);
    const subject = encodeURIComponent(socialSubject);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const onWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(socialText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onNative = async () => {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return;
    try {
      await navigator.share({
        title: socialSubject,
        text: socialText,
        url: SHARE_LINK,
      });
    } catch (err) {
      // AbortError fires when user dismisses the sheet — that's normal,
      // don't surface it. Anything else gets logged.
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('[brihaspati-share] native share failed:', err);
      }
    }
  };

  const onDownloadImage = async () => {
    if (!questionId || !getAccessToken) return;
    setImageState('loading');
    try {
      const token = await getAccessToken();
      if (!token) {
        setImageState('error');
        return;
      }
      const res = await fetch('/api/brihaspati/share-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ questionId }),
      });
      if (!res.ok) {
        console.error('[brihaspati-share] image generation failed:', res.status);
        setImageState('error');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brihaspati-${questionId.slice(0, 8)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Safari is finicky if we revoke synchronously — give the
      // download a moment to start.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setImageState('idle');
    } catch (err) {
      console.error('[brihaspati-share] image download failed:', err);
      setImageState('error');
    }
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="pt-3 border-t border-gold-primary/15 space-y-2">
      <div className="text-text-secondary text-xs font-medium">
        {isHi ? 'साझा करें:' : 'Share this reading:'}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ShareButton onClick={onCopy} label={copied ? (isHi ? 'कॉपी हो गया ✓' : 'Copied ✓') : (isHi ? 'कॉपी' : 'Copy')} icon={<CopyIcon />} active={copied} />
        <ShareButton onClick={onEmail}    label={isHi ? 'ईमेल' : 'Email'}        icon={<MailIcon />} />
        <ShareButton onClick={onWhatsApp} label="WhatsApp"                       icon={<WhatsAppIcon />} />
        <ShareButton onClick={onTwitter}  label="X"                              icon={<TwitterIcon />} />
        {canNativeShare && (
          <ShareButton onClick={onNative} label={isHi ? 'और…' : 'More…'} icon={<ShareIcon />} />
        )}
      </div>

      {/* Image-card download — only shown when we have a questionId +
          auth token getter (i.e. we're on the live answer, not a
          historical fragment). Generates a 1080×1350 PNG server-side
          via /api/brihaspati/share-image for Instagram / X / WhatsApp
          Status. */}
      {questionId && getAccessToken && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onDownloadImage}
            disabled={imageState === 'loading'}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-colors w-full sm:w-auto justify-center ${
              imageState === 'error'
                ? 'border border-red-400/50 bg-red-500/10 text-red-200'
                : 'border border-gold-primary/30 bg-gold-primary/5 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/50 disabled:opacity-50'
            }`}
          >
            <DownloadIcon />
            {imageState === 'loading'
              ? (isHi ? 'छवि बन रही है…' : 'Generating image…')
              : imageState === 'error'
                ? (isHi ? 'पुनः प्रयास करें' : 'Try again')
                : (isHi ? 'इंस्टाग्राम कार्ड डाउनलोड करें' : 'Download Instagram card (1080×1350)')}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Visual building blocks ─────────────────────────────────────────

function ShareButton({
  onClick,
  label,
  icon,
  active = false,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
        active
          ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
          : 'border-gold-primary/20 hover:border-gold-primary/50 hover:bg-gold-primary/5 text-text-secondary'
      }`}
      aria-label={label}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Inline SVGs — small (14px), single-stroke, tinted via currentColor
// so they inherit the parent button's hover state.

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  );
}

function TwitterIcon() {
  // X/Twitter glyph — the post-2023 mark.
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
