'use client';

/**
 * "Share My Birth Chart" button — generates a pretty birth poster PNG
 * and triggers native share (mobile) or download (desktop).
 *
 * Calls /api/card/birth-poster with chart data as query params.
 */

import { Share2, Download, Check } from 'lucide-react';
import { useCardShare } from './useCardShare';
import type { KundaliData } from '@/types/kundali';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';

interface Props {
  kundali: KundaliData;
  locale: string;
}

export default function ShareBirthPosterButton({ kundali, locale }: Props) {
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
  const name = kundali.birthData.name || 'Birth Chart';
  const ascSign = RASHIS[kundali.ascendant.sign - 1];
  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const sunPlanet = kundali.planets.find(p => p.planet.id === 0);

  const rising = ascSign ? tl(ascSign.name, 'en') : '';
  const moon = moonPlanet ? tl(moonPlanet.signName, 'en') : '';
  const sun = sunPlanet ? tl(sunPlanet.signName, 'en') : '';
  const dasha = kundali.dashas[0]?.planet ?? '';

  // Build card URL
  const cardUrl = (() => {
    const url = new URL('/api/card/birth-poster', typeof window !== 'undefined' ? window.location.origin : 'https://dekhopanchang.com');
    url.searchParams.set('format', 'story');
    url.searchParams.set('name', name);
    url.searchParams.set('date', kundali.birthData.date);
    url.searchParams.set('time', kundali.birthData.time);
    url.searchParams.set('place', kundali.birthData.place);
    url.searchParams.set('rising', rising);
    url.searchParams.set('moon', moon);
    url.searchParams.set('sun', sun);
    url.searchParams.set('dasha', dasha);
    url.searchParams.set('houses', JSON.stringify(kundali.chart.houses));
    return url.toString();
  })();

  const { sharing, done, handleShare } = useCardShare({
    cardUrl,
    filename: `${name.toLowerCase().replace(/\s+/g, '-')}-vedic-chart.png`,
    title: `${name}'s Vedic Birth Chart`,
    text: `${name}: ${rising} Rising, ${moon} Moon. Generate your Vedic birth chart at dekhopanchang.com`,
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
          : (isHi ? 'चार्ट साझा करें' : 'Share My Chart')}
    </button>
  );
}
