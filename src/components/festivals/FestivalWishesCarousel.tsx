'use client';

/**
 * Festival wishes & greetings carousel.
 *
 * Renders 3 shareable text greetings per festival as a horizontally
 * scrollable carousel on mobile and a grid on desktop. Each card has
 * a copy-to-clipboard button (and a native Web Share API button on
 * mobile devices that support it).
 *
 * v1: text-only. Image-card generation comes in v2 per spec §4B.
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4B
 */

import { useState } from 'react';
import { Copy, Check, Share2, Quote } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import type { Locale, LocaleText } from '@/types/panchang';
import type { FestivalWish } from '@/lib/festivals/types';
import { pickByScript } from "@/lib/utils/locale-fonts";

const TONE_LABELS: Record<FestivalWish['tone'], LocaleText> = {
  traditional: { en: 'Traditional', hi: 'पारम्परिक' },
  modern:      { en: 'Modern',      hi: 'आधुनिक'   },
  family:      { en: 'Family',      hi: 'पारिवारिक' },
  business:    { en: 'Business',    hi: 'व्यावसायिक' },
};

const TONE_STYLES: Record<FestivalWish['tone'], string> = {
  traditional: 'bg-gold-primary/15 text-gold-light border-gold-primary/30',
  modern:      'bg-sky-500/15 text-sky-300 border-sky-500/30',
  family:      'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  business:    'bg-violet-500/15 text-violet-300 border-violet-500/30',
};

interface Props {
  wishes: FestivalWish[];
  festivalNameEn: string;
  festivalNameHi: string;
  year: number;
  locale: Locale;
}

export default function FestivalWishesCarousel({ wishes, festivalNameEn, festivalNameHi, year, locale }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const sectionTitle = pickByScript(`${festivalNameEn} ${year} Wishes & Greetings`, `${festivalNameHi} ${year} शुभकामनाएँ — साझा करने योग्य संदेश`, locale);

  const hint = pickByScript('One click to copy. All original — free to share, even for business.', 'क्लिक करें — साझा करने के लिए तैयार। ये सभी मूल रचनाएँ हैं — व्यावसायिक उपयोग के लिए स्वतन्त्र।', locale);

  const copyToClipboard = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch (err) {
      // Clipboard API can fail on insecure contexts or older browsers.
      // Surface to console so failures don't silently swallow per Lesson A.
      console.error('[festival-wishes] clipboard.writeText failed:', err);
    }
  };

  const share = async (text: string) => {
    if (!navigator.share) {
      // No native share API — fall back to copying.
      const idx = wishes.findIndex((w) => tl(w.text, locale) === text);
      copyToClipboard(text, idx);
      return;
    }
    try {
      await navigator.share({ text });
    } catch (err) {
      // User dismissing the share sheet is the most common path here;
      // logging keeps real failures visible without spamming the console
      // on cancel — Web Share rejects with AbortError on cancel.
      if ((err as { name?: string })?.name !== 'AbortError') {
        console.error('[festival-wishes] navigator.share failed:', err);
      }
    }
  };

  return (
    <section className="mb-10" aria-labelledby="wishes-heading">
      <div className="text-center mb-5">
        <h2
          id="wishes-heading"
          className="text-xl sm:text-2xl font-bold text-gold-light mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {sectionTitle}
        </h2>
        <p className="text-text-secondary text-xs">{hint}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wishes.map((wish, idx) => {
          const text = tl(wish.text, locale);
          const isCopied = copiedIdx === idx;
          return (
            <article
              key={idx}
              className="relative bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 flex flex-col gap-3"
            >
              <span className={`self-start inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${TONE_STYLES[wish.tone]}`}>
                {tl(TONE_LABELS[wish.tone], locale)}
              </span>
              <div className="flex items-start gap-2">
                <Quote className="w-4 h-4 text-gold-primary/40 flex-shrink-0 mt-0.5" />
                <p className="text-text-primary text-sm leading-relaxed">{text}</p>
              </div>
              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gold-primary/8">
                <button
                  type="button"
                  onClick={() => copyToClipboard(text, idx)}
                  aria-label={pickByScript('Copy to clipboard', 'प्रतिलिपि बनाएँ', locale)}
                  className="inline-flex items-center gap-1.5 text-xs text-gold-light hover:text-gold-primary transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied
                    ? (pickByScript('Copied', 'प्रतिलिपि बन गई', locale))
                    : (pickByScript('Copy', 'प्रतिलिपि', locale))}</span>
                </button>
                <button
                  type="button"
                  onClick={() => share(text)}
                  aria-label={pickByScript('Share', 'साझा करें', locale)}
                  className="inline-flex items-center gap-1.5 text-xs text-gold-light hover:text-gold-primary transition-colors ml-auto"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{pickByScript('Share', 'साझा करें', locale)}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
