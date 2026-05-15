'use client';

/**
 * "Share Matching Score" button — generates a compatibility card PNG
 * and triggers native share (mobile) or download (desktop).
 *
 * Calls /api/card/compatibility with score data as query params.
 */

import { Share2, Download, Check } from 'lucide-react';
import { useCardShare } from './useCardShare';

interface KutaHighlight {
  name: string;
  score: number;
  max: number;
  insight: string;
}

interface Props {
  person1Name: string;
  person1Sign: string;
  person2Name: string;
  person2Sign: string;
  score: number;
  maxScore: number;
  verdict: string;
  topKutas: KutaHighlight[];
  locale: string;
}

export default function ShareCompatibilityButton({
  person1Name, person1Sign, person2Name, person2Sign,
  score, maxScore, verdict, topKutas, locale,
}: Props) {
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  const cardUrl = (() => {
    const url = new URL('/api/card/compatibility', typeof window !== 'undefined' ? window.location.origin : 'https://dekhopanchang.com');
    url.searchParams.set('format', 'story');
    url.searchParams.set('person1Name', person1Name);
    url.searchParams.set('person1Sign', person1Sign);
    url.searchParams.set('person2Name', person2Name);
    url.searchParams.set('person2Sign', person2Sign);
    url.searchParams.set('score', String(score));
    url.searchParams.set('maxScore', String(maxScore));
    url.searchParams.set('verdict', verdict);
    if (topKutas[0]) {
      url.searchParams.set('kuta1Name', topKutas[0].name);
      url.searchParams.set('kuta1Score', String(topKutas[0].score));
      url.searchParams.set('kuta1Max', String(topKutas[0].max));
      url.searchParams.set('kuta1Insight', topKutas[0].insight);
    }
    if (topKutas[1]) {
      url.searchParams.set('kuta2Name', topKutas[1].name);
      url.searchParams.set('kuta2Score', String(topKutas[1].score));
      url.searchParams.set('kuta2Max', String(topKutas[1].max));
      url.searchParams.set('kuta2Insight', topKutas[1].insight);
    }
    if (topKutas[2]) {
      url.searchParams.set('kuta3Name', topKutas[2].name);
      url.searchParams.set('kuta3Score', String(topKutas[2].score));
      url.searchParams.set('kuta3Max', String(topKutas[2].max));
      url.searchParams.set('kuta3Insight', topKutas[2].insight);
    }
    return url.toString();
  })();

  const { sharing, done, handleShare } = useCardShare({
    cardUrl,
    filename: `${person1Name}-${person2Name}-compatibility.png`,
    title: `${person1Name} & ${person2Name} — ${score}/${maxScore} Compatibility`,
    text: `Our Kundali matching score is ${score}/${maxScore}! Check yours at dekhopanchang.com`,
  });

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
          : (isHi ? 'स्कोर साझा करें' : 'Share Score')}
    </button>
  );
}
