'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { LiveSkyMap } from '@/components/sky/LiveSkyMap';
import type { SkyPlanetPosition } from '@/lib/sky/positions';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';

const CelestialSphere3D = dynamic(
  () => import('@/components/3d/CelestialSphere').then(m => m.CelestialSphere),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center rounded-2xl border border-[#8a6d2b]/20 bg-[#0d1230]" style={{ height: 600 }}>
        <p className="text-[#8a8478] text-sm animate-pulse">Loading 3D scene...</p>
      </div>
    ),
  },
);

// --------------------------------------------------------------------------
// Inline labels (page-specific i18n — not in global locale files)
// --------------------------------------------------------------------------

const LABELS = {
  title: { en: 'Live Sky Map', hi: 'लाइव आकाश मानचित्र', ta: 'நேரடி வான வரைபடம்', bn: 'লাইভ আকাশ মানচিত্র' },
  subtitle: {
    en: 'Current Sidereal Planetary Positions — Lahiri Ayanamsha',
    hi: 'वर्तमान ग्रह स्थितियाँ — लाहिरी अयनांश',
    ta: 'தற்போதைய கிரக நிலைகள் — லாஹிரி அயனாம்சம்',
    bn: 'বর্তমান গ্রহ অবস্থান — লাহিরি অয়নাংশ',
  },
  disclaimer: {
    en: 'Positions calculated using Lahiri ayanamsha (Indian government standard). Tropical longitudes computed via Meeus algorithms; Swiss Ephemeris used when available for higher accuracy.',
    hi: 'स्थितियां लाहिरी अयनांश (भारतीय सरकारी मानक) का उपयोग करके गणना की गई हैं। Meeus एल्गोरिदम के माध्यम से क्रांतिवृत्त देशांतर गणना की जाती है; उच्च सटीकता के लिए उपलब्ध होने पर स्विस एफेमेरिस का उपयोग किया जाता है।',
    ta: 'லாஹிரி அயனாம்சம் (இந்திய அரசு தரநிலை) பயன்படுத்தி நிலைகள் கணக்கிடப்படுகின்றன.',
    bn: 'লাহিরি অয়নাংশ (ভারতীয় সরকারি মান) ব্যবহার করে অবস্থান গণনা করা হয়।',
  },
  tableTitle: { en: 'Planet Positions Table', hi: 'ग्रह स्थिति तालिका', ta: 'கிரக நிலை அட்டவணை', bn: 'গ্রহ অবস্থান সারণি' },
  colPlanet: { en: 'Planet', hi: 'ग्रह', ta: 'கிரகம்', bn: 'গ্রহ' },
  colDegree: { en: 'Degree', hi: 'अंश', ta: 'படி', bn: 'ডিগ্রি' },
  colRashi: { en: 'Rashi', hi: 'राशि', ta: 'ராசி', bn: 'রাশি' },
  colNakshatra: { en: 'Nakshatra', hi: 'नक्षत्र', ta: 'நக்ஷத்திரம்', bn: 'নক্ষত্র' },
  colPada: { en: 'Pada', hi: 'पाद', ta: 'பாதம்', bn: 'পাদ' },
  colSpeed: { en: 'Speed (°/day)', hi: 'गति (°/दिन)', ta: 'வேகம் (°/நாள்)', bn: 'গতি (°/দিন)' },
  colMotion: { en: 'Motion', hi: 'गति', ta: 'இயக்கம்', bn: 'গতি' },
  direct: { en: 'Direct', hi: 'मार्गी', ta: 'நேர்', bn: 'সরল' },
  retro: { en: 'Retro ℞', hi: 'वक्री ℞', ta: 'வக்ர ℞', bn: 'বক্র ℞' },
  loading: { en: 'Loading positions…', hi: 'स्थितियाँ लोड हो रही हैं…', ta: 'நிலைகள் ஏற்றப்படுகின்றன…', bn: 'অবস্থান লোড হচ্ছে…' },
};

// Planet names (en only — used in table)
const PLANET_NAMES: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter',
  5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

function formatDMS(deg: number): string {
  const d = Math.floor(deg);
  const mFrac = (deg - d) * 60;
  const m = Math.floor(mFrac);
  return `${d}°${String(m).padStart(2, '0')}'`;
}

// --------------------------------------------------------------------------
// Planet table
// --------------------------------------------------------------------------

function PlanetTable({
  positions,
  locale,
}: {
  positions: SkyPlanetPosition[];
  locale: string;
}) {
  const t = (key: keyof typeof LABELS) => tl(LABELS[key], locale);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#8a6d2b]/30">
            {([
              'colPlanet', 'colDegree', 'colRashi', 'colNakshatra', 'colPada', 'colSpeed', 'colMotion',
            ] as const).map((col) => (
              <th
                key={col}
                className="px-3 py-2.5 text-left text-[#d4a853] font-semibold text-xs uppercase tracking-wide whitespace-nowrap"
              >
                {t(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => {
            const rashiObj = RASHIS[p.rashi - 1];
            const nakshatraObj = NAKSHATRAS[p.nakshatra - 1];
            const degInRashi = p.siderealLongitude % 30;
            const isRetro = p.isRetrograde;

            return (
              <tr
                key={p.id}
                className="border-b border-[#8a6d2b]/10 hover:bg-[#1a1f45]/40 transition-colors"
              >
                <td className="px-3 py-2.5 text-[#f0d48a] font-medium whitespace-nowrap">
                  {PLANET_NAMES[p.id] ?? p.name}
                </td>
                <td className="px-3 py-2.5 text-[#e6e2d8] font-mono whitespace-nowrap">
                  {formatDMS(p.siderealLongitude)}
                </td>
                <td className="px-3 py-2.5 text-[#e6e2d8] whitespace-nowrap">
                  <span className="mr-1">{rashiObj?.symbol ?? ''}</span>
                  {rashiObj ? tl(rashiObj.name, locale) : ''}
                  <span className="ml-1 text-[#8a8478] text-xs">{formatDMS(degInRashi)}</span>
                </td>
                <td className="px-3 py-2.5 text-[#e6e2d8] whitespace-nowrap">
                  {nakshatraObj ? tl(nakshatraObj.name, locale) : ''}
                </td>
                <td className="px-3 py-2.5 text-[#8a8478] text-center">{p.nakshatraPada}</td>
                <td className="px-3 py-2.5 text-[#8a8478] font-mono whitespace-nowrap">
                  {p.speed >= 0 ? '+' : ''}{p.speed.toFixed(4)}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  {isRetro ? (
                    <span className="text-red-400 text-xs font-medium">{t('retro')}</span>
                  ) : (
                    <span className="text-green-400 text-xs font-medium">{t('direct')}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// --------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------

export default function SkyPage() {
  const locale = useLocale();
  const [positions, setPositions] = useState<SkyPlanetPosition[]>([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [autoRotate, setAutoRotate] = useState(true);

  const t = (key: keyof typeof LABELS) => tl(LABELS[key], locale);

  useEffect(() => {
    fetch('/api/sky/positions')
      .then((r) => r.json())
      .then((data: { positions: SkyPlanetPosition[] }) => {
        setPositions(data.positions);
      })
      .catch((err) => {
        console.error('[SkyPage] fetch positions failed:', err);
      })
      .finally(() => {
        setLoadingTable(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0e27] text-[#e6e2d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#f0d48a] mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('title')}
            </h1>
            <p className="text-[#8a8478] text-base">{t('subtitle')}</p>
          </div>

          {/* 2D / 3D toggle */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl overflow-hidden border border-[#8a6d2b]/30">
              <button
                onClick={() => setViewMode('2d')}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                  viewMode === '2d'
                    ? 'bg-gold-primary/20 text-[#f0d48a] border-r border-[#8a6d2b]/30'
                    : 'text-[#8a8478] hover:text-[#f0d48a] border-r border-[#8a6d2b]/30'
                }`}
              >
                2D
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                  viewMode === '3d'
                    ? 'bg-gold-primary/20 text-[#f0d48a]'
                    : 'text-[#8a8478] hover:text-[#f0d48a]'
                }`}
              >
                3D
              </button>
            </div>
            {viewMode === '3d' && (
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                  autoRotate
                    ? 'border-[#8a6d2b]/40 bg-gold-primary/15 text-[#f0d48a]'
                    : 'border-[#8a6d2b]/20 text-[#8a8478]'
                }`}
              >
                {autoRotate ? 'Rotate: ON' : 'Rotate: OFF'}
              </button>
            )}
          </div>
        </div>

        {/* Chart */}
        <section className="mb-10" aria-label="Sky map visualization">
          {viewMode === '2d' ? (
            <LiveSkyMap locale={locale} />
          ) : (
            <div className="rounded-2xl border border-[#8a6d2b]/20 overflow-hidden" style={{ height: '70vh', minHeight: 500 }}>
              <CelestialSphere3D autoRotate={autoRotate} />
            </div>
          )}
        </section>

        {/* Planet positions table */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#d4a853] mb-4">{t('tableTitle')}</h2>
          <div className="bg-[#111633] border border-[#8a6d2b]/25 rounded-xl overflow-hidden">
            {loadingTable ? (
              <p className="text-[#8a8478] text-sm p-6 text-center animate-pulse">{t('loading')}</p>
            ) : (
              <PlanetTable positions={positions} locale={locale} />
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-[#6a5a28] text-xs leading-relaxed max-w-3xl">
          {t('disclaimer')}
        </p>
      </div>
    </main>
  );
}
