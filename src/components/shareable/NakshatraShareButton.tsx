'use client';

import { useState } from 'react';
import { Share2, Download, Check } from 'lucide-react';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';
import { RASHIS } from '@/lib/constants/rashis';

interface NakshatraShareButtonProps {
  name: string;
  nakshatraId: number;    // 1-27
  rashiId?: number;       // 1-12
  locale: string;
}

/**
 * "Share My Nakshatra" button  –  generates a personalized nakshatra personality
 * card image and triggers native share (mobile) or download (desktop).
 *
 * This is the viral engine: each share drives 3-5 friends to make their own card.
 */
export default function NakshatraShareButton({ name, nakshatraId, rashiId, locale }: NakshatraShareButtonProps) {
  const [sharing, setSharing] = useState(false);
  const [done, setDone] = useState(false);

  const nak = NAKSHATRAS[nakshatraId - 1];
  const detail = NAKSHATRA_DETAILS.find(d => d.id === nakshatraId);
  const rashi = rashiId ? RASHIS[rashiId - 1] : null;

  if (!nak) return null;

  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  // Build card URL with params
  const cardUrl = new URL('/api/card/nakshatra-card', typeof window !== 'undefined' ? window.location.origin : 'https://dekhopanchang.com');
  cardUrl.searchParams.set('format', 'story');
  cardUrl.searchParams.set('name', name);
  cardUrl.searchParams.set('nakshatra', nak.name.en);
  cardUrl.searchParams.set('symbol', nak.symbol || '✦');
  if (rashi) cardUrl.searchParams.set('rashi', rashi.name.en);
  if (nak.rulerName) cardUrl.searchParams.set('ruler', nak.rulerName.en);
  if (nak.deity) cardUrl.searchParams.set('deity', nak.deity.en);
  if (nak.nature) cardUrl.searchParams.set('nature', nak.nature.en);
  if (detail?.gana) cardUrl.searchParams.set('gana', detail.gana.en);
  // First sentence of characteristics as the trait line
  if (detail?.characteristics?.en) {
    const firstSentence = detail.characteristics.en.split('.')[0] + '.';
    cardUrl.searchParams.set('trait', firstSentence);
  }

  const handleShare = async () => {
    setSharing(true);
    try {
      const res = await fetch(cardUrl.toString());
      const blob = await res.blob();
      const file = new File([blob], `${nak.name.en.toLowerCase()}-nakshatra.png`, { type: 'image/png' });

      // Try native share (works on mobile)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `I'm ${nak.name.en} Moon  –  ${nak.nature?.en || 'Vedic Astrology'}`,
          text: `Discover your Nakshatra personality at dekhopanchang.com`,
          files: [file],
        });
      } else {
        // Desktop fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      }
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('[NakshatraShare] Failed:', err);
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
        done
          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
          : 'bg-gradient-to-r from-gold-primary/20 to-gold-dark/20 border border-gold-primary/30 text-gold-light hover:from-gold-primary/30 hover:to-gold-dark/30 hover:border-gold-primary/50'
      }`}
    >
      {sharing ? (
        <div className="w-4 h-4 border-2 border-gold-primary/30 border-t-gold-primary rounded-full animate-spin" />
      ) : done ? (
        <Check className="w-4 h-4" />
      ) : typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
        <Share2 className="w-4 h-4" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {done
        ? (isHi ? 'साझा हो गया!' : 'Shared!')
        : sharing
          ? (isHi ? 'बना रहे हैं...' : 'Creating...')
          : (isHi ? 'मेरा नक्षत्र कार्ड साझा करें' : 'Share My Nakshatra Card')}
    </button>
  );
}
