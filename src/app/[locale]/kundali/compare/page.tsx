'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import BirthForm from '@/components/kundali/BirthForm';
import ChartNorth from '@/components/kundali/ChartNorth';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { KundaliData, BirthData, ChartStyle } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Chart Comparison', hi: 'कुण्डली तुलना', sa: 'कुण्डली तुलना' },
  subtitle: { en: 'Compare two birth charts side by side — synastry aspects, planet positions, and compatibility at a glance', hi: 'दो जन्म कुण्डलियों की साथ-साथ तुलना करें', sa: '' },
  chart1: { en: 'Chart A', hi: 'कुण्डली अ', sa: '' },
  chart2: { en: 'Chart B', hi: 'कुण्डली ब', sa: '' },
  enterFirst: { en: 'Enter birth details for Chart A first', hi: 'पहले कुण्डली अ के लिए जन्म विवरण दर्ज करें', sa: '' },
  enterSecond: { en: 'Now enter birth details for Chart B', hi: 'अब कुण्डली ब के लिए जन्म विवरण दर्ज करें', sa: '' },
  synastry: { en: 'Synastry Aspects', hi: 'सिनेस्ट्री पक्ष', sa: '' },
  planetComparison: { en: 'Planet Position Comparison', hi: 'ग्रह स्थिति तुलना', sa: '' },
  back: { en: '← Back to Kundali', hi: '← कुण्डली पर वापस', sa: '' },
};

function t(obj: { en: string; hi: string; sa: string }, locale: string) {
  return obj[locale as Locale] ?? obj.en;
}

// Simple synastry: check conjunctions, oppositions, trines, squares
function computeSynastry(a: KundaliData, b: KundaliData) {
  const aspects: { planetA: number; planetB: number; type: string; orb: number }[] = [];
  const ASPECT_TYPES = [
    { name: 'Conjunction', angle: 0, orb: 10 },
    { name: 'Opposition', angle: 180, orb: 10 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Square', angle: 90, orb: 8 },
    { name: 'Sextile', angle: 60, orb: 6 },
  ];
  for (const pA of a.planets) {
    for (const pB of b.planets) {
      const diff = Math.abs(pA.longitude - pB.longitude);
      const angle = diff > 180 ? 360 - diff : diff;
      for (const asp of ASPECT_TYPES) {
        const orb = Math.abs(angle - asp.angle);
        if (orb <= asp.orb) {
          aspects.push({ planetA: pA.planet.id, planetB: pB.planet.id, type: asp.name, orb: Math.round(orb * 10) / 10 });
        }
      }
    }
  }
  return aspects.sort((a, b) => a.orb - b.orb).slice(0, 20);
}

export default function ComparePage() {
  const locale = useLocale();
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [chartA, setChartA] = useState<KundaliData | null>(null);
  const [chartB, setChartB] = useState<KundaliData | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const generateChart = async (birthData: BirthData, _style: ChartStyle, target: 'A' | 'B') => {
    const setLoading = target === 'A' ? setLoadingA : setLoadingB;
    const setChart = target === 'A' ? setChartA : setChartB;
    setLoading(true);
    try {
      const res = await authedFetch('/api/kundali', {
        method: 'POST',
        body: JSON.stringify(birthData),
      });
      const data = await res.json();
      setChart(data);
      if (target === 'A') setStep(2);
      else setStep(3);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const synastry = chartA && chartB ? computeSynastry(chartA, chartB) : [];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Hero */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1235] to-bg-primary" />
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient mb-3" style={headingFont}>{t(L.title, locale)}</h1>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">{t(L.subtitle, locale)}</p>
          <div className="mt-4">
            <Link href="/kundali" className="text-sm text-gold-primary/60 hover:text-gold-primary transition-colors">{t(L.back, locale)}</Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Step indicators */}
        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${step >= s ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/30' : 'text-text-tertiary border border-gold-primary/10'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-gold-primary text-bg-primary' : 'bg-bg-secondary text-text-tertiary'}`}>{s}</span>
              {s === 1 ? t(L.chart1, locale) : s === 2 ? t(L.chart2, locale) : t(L.synastry, locale)}
            </div>
          ))}
        </div>

        {/* Birth forms */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
            <h2 className="text-gold-light text-lg font-bold mb-4 text-center" style={headingFont}>{t(L.enterFirst, locale)}</h2>
            <BirthForm onSubmit={(bd, style) => generateChart(bd, style, 'A')} loading={loadingA} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
            <h2 className="text-gold-light text-lg font-bold mb-4 text-center" style={headingFont}>{t(L.enterSecond, locale)}</h2>
            <BirthForm onSubmit={(bd, style) => generateChart(bd, style, 'B')} loading={loadingB} />
          </motion.div>
        )}

        {/* Side-by-side charts + synastry */}
        {step === 3 && chartA && chartB && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="text-center mb-2">
                  <span className="text-xs text-gold-dark uppercase tracking-widest font-bold">{t(L.chart1, locale)}</span>
                  <div className="text-text-secondary text-xs mt-1">{chartA.birthData.name || chartA.birthData.place}</div>
                </div>
                <ChartNorth data={chartA.chart} title="" size={450} />
              </div>
              <div>
                <div className="text-center mb-2">
                  <span className="text-xs text-gold-dark uppercase tracking-widest font-bold">{t(L.chart2, locale)}</span>
                  <div className="text-text-secondary text-xs mt-1">{chartB.birthData.name || chartB.birthData.place}</div>
                </div>
                <ChartNorth data={chartB.chart} title="" size={450} />
              </div>
            </div>

            {/* Planet comparison table */}
            <div>
              <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>{t(L.planetComparison, locale)}</h3>
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-primary/15">
                      <th className="text-left py-3 px-4 text-gold-primary font-semibold">{locale === 'en' ? 'Planet' : 'ग्रह'}</th>
                      <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.chart1, locale)} — {locale === 'en' ? 'Sign' : 'राशि'}</th>
                      <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.chart2, locale)} — {locale === 'en' ? 'Sign' : 'राशि'}</th>
                      <th className="text-left py-3 px-4 text-gold-primary font-semibold">{locale === 'en' ? 'Same Sign?' : 'एक राशि?'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-primary/5">
                    {chartA.planets.map((pA) => {
                      const pB = chartB.planets.find(p => p.planet.id === pA.planet.id);
                      const sameSign = pB && pA.sign === pB.sign;
                      return (
                        <tr key={pA.planet.id} className="hover:bg-gold-primary/3">
                          <td className="py-2.5 px-4 text-gold-light font-medium" style={headingFont}>{pA.planet.name[locale as Locale]}</td>
                          <td className="py-2.5 px-4 text-text-secondary">{RASHIS[pA.sign - 1]?.name[locale as Locale]} ({pA.degree})</td>
                          <td className="py-2.5 px-4 text-text-secondary">{pB ? `${RASHIS[pB.sign - 1]?.name[locale as Locale]} (${pB.degree})` : '—'}</td>
                          <td className="py-2.5 px-4">{sameSign ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-text-tertiary">—</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Synastry aspects */}
            <div>
              <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>{t(L.synastry, locale)}</h3>
              {synastry.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {synastry.map((asp, i) => {
                    const aspColor = asp.type === 'Conjunction' ? 'border-emerald-500/20 text-emerald-300'
                      : asp.type === 'Trine' || asp.type === 'Sextile' ? 'border-blue-500/20 text-blue-300'
                      : 'border-red-500/20 text-red-400';
                    return (
                      <div key={i} className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-3 border ${aspColor.split(' ')[0]}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${aspColor.split(' ')[1]}`}>{asp.type}</span>
                          <span className="text-text-tertiary text-xs">{asp.orb}° orb</span>
                        </div>
                        <div className="text-text-secondary text-xs">
                          <span className="text-gold-light">{GRAHAS[asp.planetA]?.name[locale as Locale]}</span>
                          {' ↔ '}
                          <span className="text-gold-light">{GRAHAS[asp.planetB]?.name[locale as Locale]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-text-tertiary text-sm py-8">{locale === 'en' ? 'No significant aspects found' : 'कोई महत्वपूर्ण पक्ष नहीं मिला'}</div>
              )}
            </div>

            {/* Reset */}
            <div className="text-center">
              <button onClick={() => { setChartA(null); setChartB(null); setStep(1); }}
                className="px-6 py-2 rounded-xl border border-gold-primary/20 text-gold-primary text-sm hover:bg-gold-primary/10 transition-colors">
                {locale === 'en' ? 'Compare Different Charts' : 'अलग कुण्डलियों की तुलना करें'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
