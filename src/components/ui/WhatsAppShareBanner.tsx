'use client';

import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { trackShareClicked } from '@/lib/analytics';
import type { Locale, LocaleText } from '@/types/panchang';

/* ════════════════════════════════════════════════════════════════
   Labels
   ════════════════════════════════════════════════════════════════ */
const L: Record<string, LocaleText> = {
  shareTitle: { en: 'Share with Family', hi: 'परिवार के साथ साझा करें', sa: 'परिवारेण सह प्रसारयतु' },
  shareDesc:  { en: 'Send today\'s details to your family WhatsApp group', hi: 'आज का विवरण अपने परिवार के WhatsApp ग्रुप में भेजें', sa: 'अद्य विवरणम् WhatsApp समूहे प्रेषयतु' },
  whatsapp:   { en: 'Share on WhatsApp', hi: 'WhatsApp पर भेजें', sa: 'WhatsApp इति प्रसारयतु' },
  copy:       { en: 'Copy Text', hi: 'टेक्स्ट कॉपी करें', sa: 'प्रतिलिपिः' },
  copied:     { en: 'Copied!', hi: 'कॉपी हुआ!', sa: 'प्रतिलिपितम्!' },
};

/* ════════════════════════════════════════════════════════════════
   WhatsApp icon (inline SVG)
   ════════════════════════════════════════════════════════════════ */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════
   WhatsAppShareBanner  –  prominent share CTA for viral distribution.
   Designed for daily panchang & horoscope pages where users share
   to family WhatsApp groups.
   ════════════════════════════════════════════════════════════════ */
interface WhatsAppShareBannerProps {
  /** The full text to share (appears in the WhatsApp message) */
  shareText: string;
  /** URL to append to the share text */
  url?: string;
  locale: Locale;
  className?: string;
}

export default function WhatsAppShareBanner({ shareText, url, locale, className = '' }: WhatsAppShareBannerProps) {
  const [copied, setCopied] = useState(false);
  const [clientUrl, setClientUrl] = useState('');
  const l = (obj: LocaleText) => obj[locale] || obj.en;

  useEffect(() => { if (!url) setClientUrl(window.location.href); }, [url]);
  const shareUrl = url || clientUrl;

  const fullText = shareText + '\n\n' + shareUrl;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = fullText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    trackShareClicked({ platform: 'copy', page: typeof window !== 'undefined' ? window.location.pathname : '' });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-[#25D366]/10 via-[#1a1040]/40 to-[#0a0e27] border border-[#25D366]/20 p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Icon + text */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center">
            <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
          </div>
          <div className="min-w-0">
            <p className="text-[#25D366] font-bold text-base">{l(L.shareTitle)}</p>
            <p className="text-text-secondary text-xs">{l(L.shareDesc)}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackShareClicked({ platform: 'whatsapp', page: typeof window !== 'undefined' ? window.location.pathname : '' })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm transition-all shadow-lg shadow-[#25D366]/20"
          >
            <WhatsAppIcon className="w-5 h-5" />
            {l(L.whatsapp)}
          </a>
          <button
            onClick={copyText}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              copied
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/10 hover:border-white/20 text-text-secondary hover:text-text-primary'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? l(L.copied) : l(L.copy)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
