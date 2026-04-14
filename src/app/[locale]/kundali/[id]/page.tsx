'use client';
import { tl } from '@/lib/utils/trilingual';

import { useEffect, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import type { KundaliData } from '@/types/kundali';
import { detectAfflictedPlanets, type AfflictedPlanet } from '@/lib/puja/affliction-detector';
import ChartNorth from '@/components/kundali/ChartNorth';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

function decodeChartParams(params: URLSearchParams): { name: string; date: string; time: string; lat: number; lng: number; place: string; timezone: string } | null {
  const name = params.get('n');
  const date = params.get('d');
  const time = params.get('t');
  const lat = params.get('la');
  const lng = params.get('lo');
  const place = params.get('p');
  const tz = params.get('tz');
  if (!name || !date || !time || !lat || !lng) return null;
  // Fallback timezone: estimate from longitude (~15° per hour) if not provided
  const fallbackTz = String(Math.round(parseFloat(lng) / 15 * 10) / 10);
  return { name: decodeURIComponent(name), date, time, lat: parseFloat(lat), lng: parseFloat(lng), place: place ? decodeURIComponent(place) : '', timezone: tz ? decodeURIComponent(tz) : fallbackTz };
}

export default function SharedKundaliPage() {
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = { fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' };

  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const chartData = useMemo(() => decodeChartParams(searchParams), [searchParams]);

  useEffect(() => {
    if (!chartData) {
      setError('Invalid chart link. Missing birth data parameters.');
      setLoading(false);
      return;
    }

    const fetchKundali = async () => {
      try {
        const response = await authedFetch('/api/kundali', {
          method: 'POST',
          body: JSON.stringify({
            name: chartData.name,
            date: chartData.date,
            time: chartData.time,
            lat: chartData.lat,
            lng: chartData.lng,
            place: chartData.place,
            timezone: chartData.timezone,
            ayanamsha: 'lahiri',
          }),
        });

        if (!response.ok) throw new Error('Failed to generate chart');
        const data = await response.json();
        setKundali(data);
      } catch {
        setError('Failed to generate chart from shared link.');
      } finally {
        setLoading(false);
      }
    };

    fetchKundali();
  }, [chartData]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-12 h-12 border-2 border-gold-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-text-secondary">{tl({ en: 'Loading shared chart...', hi: 'साझा कुण्डली लोड हो रही है...', sa: 'साझा कुण्डली लोड हो रही है...', ta: 'Loading shared chart...', te: 'Loading shared chart...', bn: 'Loading shared chart...', kn: 'Loading shared chart...', gu: 'Loading shared chart...', mai: 'साझा कुण्डली लोड हो रही है...', mr: 'साझा कुण्डली लोड हो रही है...' }, locale)}</p>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/kundali" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8">
          <ArrowLeft className="w-4 h-4" /> {tl({ en: 'Generate New Chart', hi: 'नई कुण्डली बनाएं', sa: 'नई कुण्डली बनाएं', ta: 'Generate New Chart', te: 'Generate New Chart', bn: 'Generate New Chart', kn: 'Generate New Chart', gu: 'Generate New Chart', mai: 'नई कुण्डली बनाएं', mr: 'नई कुण्डली बनाएं' }, locale)}
        </Link>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-12 text-center">
          <h1 className="text-3xl text-red-400 font-bold mb-4" style={headingFont}>
            {tl({ en: 'Invalid Chart Link', hi: 'अमान्य कुण्डली लिंक', sa: 'अमान्य कुण्डली लिंक', ta: 'Invalid Chart Link', te: 'Invalid Chart Link', bn: 'Invalid Chart Link', kn: 'Invalid Chart Link', gu: 'Invalid Chart Link', mai: 'अमान्य कुण्डली लिंक', mr: 'अमान्य कुण्डली लिंक' }, locale)}
          </h1>
          <p className="text-text-secondary">{error}</p>
          <Link href="/kundali" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-lg">
            {tl({ en: 'Create Your Own Chart', hi: 'अपनी कुण्डली बनाएं', sa: 'अपनी कुण्डली बनाएं', ta: 'Create Your Own Chart', te: 'Create Your Own Chart', bn: 'Create Your Own Chart', kn: 'Create Your Own Chart', gu: 'Create Your Own Chart', mai: 'अपनी कुण्डली बनाएं', mr: 'अपनी कुण्डली बनाएं' }, locale)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <Link href="/kundali" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light">
          <ArrowLeft className="w-4 h-4" /> {tl({ en: 'Generate New Chart', hi: 'नई कुण्डली बनाएं', sa: 'नई कुण्डली बनाएं', ta: 'Generate New Chart', te: 'Generate New Chart', bn: 'Generate New Chart', kn: 'Generate New Chart', gu: 'Generate New Chart', mai: 'नई कुण्डली बनाएं', mr: 'नई कुण्डली बनाएं' }, locale)}
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg text-sm text-gold-primary hover:text-gold-light">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? (tl({ en: 'Copied!', hi: 'कॉपी!', sa: 'कॉपी!', ta: 'Copied!', te: 'Copied!', bn: 'Copied!', kn: 'Copied!', gu: 'Copied!', mai: 'कॉपी!', mr: 'कॉपी!' }, locale)) : (tl({ en: 'Copy Link', hi: 'लिंक कॉपी', sa: 'लिंक कॉपी', ta: 'Copy Link', te: 'Copy Link', bn: 'Copy Link', kn: 'Copy Link', gu: 'Copy Link', mai: 'लिंक कॉपी', mr: 'लिंक कॉपी' }, locale))}
          </button>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button onClick={() => navigator.share({ title: `${chartData.name} - Kundali`, url: shareUrl })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg text-sm text-gold-primary hover:text-gold-light">
              <Share2 className="w-4 h-4" /> {tl({ en: 'Share', hi: 'साझा', sa: 'साझा', ta: 'Share', te: 'Share', bn: 'Share', kn: 'Share', gu: 'Share', mai: 'साझा', mr: 'साझा' }, locale)}
            </button>
          )}
        </div>
      </div>

      {/* Chart Header */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 mb-8">
        <h1 className="text-3xl text-gold-gradient font-bold mb-2" style={headingFont}>{chartData.name}</h1>
        <div className="flex flex-wrap gap-4 text-text-secondary text-sm">
          <span>{chartData.date} at {chartData.time}</span>
          {chartData.place && <span>{chartData.place}</span>}
          <span>{chartData.lat.toFixed(4)}, {chartData.lng.toFixed(4)}</span>
        </div>
        {kundali && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-bg-primary/30 rounded-lg text-center">
              <p className="text-text-tertiary text-xs mb-1">{tl({ en: 'Ascendant', hi: 'लग्न', sa: 'लग्न', ta: 'Ascendant', te: 'Ascendant', bn: 'Ascendant', kn: 'Ascendant', gu: 'Ascendant', mai: 'लग्न', mr: 'लग्न' }, locale)}</p>
              <p className="text-gold-light font-semibold">{kundali.ascendant.signName[locale]}</p>
            </div>
            <div className="p-3 bg-bg-primary/30 rounded-lg text-center">
              <p className="text-text-tertiary text-xs mb-1">{tl({ en: 'Moon Sign', hi: 'चंद्र राशि', sa: 'चंद्र राशि', ta: 'Moon Sign', te: 'Moon Sign', bn: 'Moon Sign', kn: 'Moon Sign', gu: 'Moon Sign', mai: 'चंद्र राशि', mr: 'चंद्र राशि' }, locale)}</p>
              <p className="text-gold-light font-semibold">{kundali.planets.find(p => p.planet.id === 1)?.signName[locale] || '-'}</p>
            </div>
            <div className="p-3 bg-bg-primary/30 rounded-lg text-center">
              <p className="text-text-tertiary text-xs mb-1">{tl({ en: 'Sun Sign', hi: 'सूर्य राशि', sa: 'सूर्य राशि', ta: 'Sun Sign', te: 'Sun Sign', bn: 'Sun Sign', kn: 'Sun Sign', gu: 'Sun Sign', mai: 'सूर्य राशि', mr: 'सूर्य राशि' }, locale)}</p>
              <p className="text-gold-light font-semibold">{kundali.planets.find(p => p.planet.id === 0)?.signName[locale] || '-'}</p>
            </div>
            <div className="p-3 bg-bg-primary/30 rounded-lg text-center">
              <p className="text-text-tertiary text-xs mb-1">{tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्र', ta: 'Nakshatra', te: 'Nakshatra', bn: 'Nakshatra', kn: 'Nakshatra', gu: 'Nakshatra', mai: 'नक्षत्र', mr: 'नक्षत्र' }, locale)}</p>
              <p className="text-gold-light font-semibold">{kundali.planets.find(p => p.planet.id === 1)?.nakshatra?.name?.[locale] || '-'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Birth Chart Diagram */}
      {kundali?.chart && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 mb-8 flex flex-col items-center">
          <h2 className="text-xl text-gold-gradient font-bold mb-6 self-start" style={headingFont}>
            {tl({ en: 'Birth Chart (D1 — Rashi)', hi: 'जन्म कुण्डली (D1 — राशि)', sa: 'जन्मकुण्डली (D1 — राशिः)' }, locale)}
          </h2>
          <div className="w-full max-w-md mx-auto">
            <ChartNorth data={kundali.chart} title={chartData?.name || ''} size={400} />
          </div>
        </div>
      )}

      {/* Planet Positions */}
      {kundali && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 mb-8">
          <h2 className="text-xl text-gold-gradient font-bold mb-6" style={headingFont}>
            {tl({ en: 'Planetary Positions', hi: 'ग्रह स्थिति', sa: 'ग्रह स्थिति', ta: 'Planetary Positions', te: 'Planetary Positions', bn: 'Planetary Positions', kn: 'Planetary Positions', gu: 'Planetary Positions', mai: 'ग्रह स्थिति', mr: 'ग्रह स्थिति' }, locale)}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gold-primary border-b border-gold-primary/10">
                  <th className="text-left py-2 px-3">{tl({ en: 'Planet', hi: 'ग्रह', sa: 'ग्रह', ta: 'Planet', te: 'Planet', bn: 'Planet', kn: 'Planet', gu: 'Planet', mai: 'ग्रह', mr: 'ग्रह' }, locale)}</th>
                  <th className="text-left py-2 px-3">{tl({ en: 'Sign', hi: 'राशि', sa: 'राशि', ta: 'Sign', te: 'Sign', bn: 'Sign', kn: 'Sign', gu: 'Sign', mai: 'राशि', mr: 'राशि' }, locale)}</th>
                  <th className="text-right py-2 px-3">{tl({ en: 'Degree', hi: 'अंश', sa: 'अंश', ta: 'Degree', te: 'Degree', bn: 'Degree', kn: 'Degree', gu: 'Degree', mai: 'अंश', mr: 'अंश' }, locale)}</th>
                  <th className="text-center py-2 px-3">{tl({ en: 'House', hi: 'भाव', sa: 'भाव', ta: 'House', te: 'House', bn: 'House', kn: 'House', gu: 'House', mai: 'भाव', mr: 'भाव' }, locale)}</th>
                  <th className="text-center py-2 px-3">{tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्र', ta: 'Nakshatra', te: 'Nakshatra', bn: 'Nakshatra', kn: 'Nakshatra', gu: 'Nakshatra', mai: 'नक्षत्र', mr: 'नक्षत्र' }, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {kundali.planets.map((p, i) => (
                  <tr key={i} className="border-b border-gold-primary/5 text-text-secondary">
                    <td className="py-2 px-3 text-gold-light font-semibold">{p.planet.name[locale]}</td>
                    <td className="py-2 px-3">{p.signName[locale]}</td>
                    <td className="py-2 px-3 text-right font-mono">{(p.longitude % 30).toFixed(2)}°</td>
                    <td className="py-2 px-3 text-center">{p.house}</td>
                    <td className="py-2 px-3 text-center">{p.nakshatra?.name?.[locale] || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Graha Shanti Recommendations */}
      {kundali && (() => {
        const afflicted = detectAfflictedPlanets(
          kundali.planets.map(p => ({
            id: p.planet.id,
            name: p.planet.name.en,
            house: p.house,
            isDebilitated: p.isDebilitated,
            isCombust: p.isCombust,
            isRetrograde: p.isRetrograde,
          }))
        );
        if (afflicted.length === 0) return null;
        return (
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 mb-8">
            <h2 className="text-xl text-gold-gradient font-bold mb-2" style={headingFont}>
              {tl({ en: 'Recommended Graha Shanti Pujas', hi: 'अनुशंसित ग्रह शान्ति पूजा', sa: 'अनुशंसित ग्रह शान्ति पूजा', ta: 'Recommended Graha Shanti Pujas', te: 'Recommended Graha Shanti Pujas', bn: 'Recommended Graha Shanti Pujas', kn: 'Recommended Graha Shanti Pujas', gu: 'Recommended Graha Shanti Pujas', mai: 'अनुशंसित ग्रह शान्ति पूजा', mr: 'अनुशंसित ग्रह शान्ति पूजा' }, locale)}
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              {locale === 'en'
                ? 'Based on your chart, the following planets may benefit from graha shanti rituals.'
                : 'आपकी कुण्डली के अनुसार, निम्नलिखित ग्रहों को ग्रह शान्ति पूजा से लाभ हो सकता है।'}
            </p>
            <div className="space-y-3">
              {afflicted.map((ap) => {
                const cfg = {
                  severe: { border: 'border-rose-500/20', bg: 'bg-rose-500/8', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-400', label: tl({ en: 'Severe', hi: 'गम्भीर', sa: 'गम्भीर', ta: 'Severe', te: 'Severe', bn: 'Severe', kn: 'Severe', gu: 'Severe', mai: 'गम्भीर', mr: 'गम्भीर' }, locale) },
                  moderate: { border: 'border-amber-500/20', bg: 'bg-amber-500/8', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400', label: tl({ en: 'Moderate', hi: 'मध्यम', sa: 'मध्यम', ta: 'Moderate', te: 'Moderate', bn: 'Moderate', kn: 'Moderate', gu: 'Moderate', mai: 'मध्यम', mr: 'मध्यम' }, locale) },
                  mild: { border: 'border-blue-500/20', bg: 'bg-blue-500/8', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400', label: tl({ en: 'Mild', hi: 'साधारण', sa: 'साधारण', ta: 'Mild', te: 'Mild', bn: 'Mild', kn: 'Mild', gu: 'Mild', mai: 'साधारण', mr: 'साधारण' }, locale) },
                }[ap.severity];
                const planetName = kundali.planets.find(p => p.planet.id === ap.planetId)?.planet.name[locale] || ap.planetName;
                return (
                  <div key={ap.planetId} className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-bold ${cfg.text}`} style={headingFont}>{planetName}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                    <p className="text-text-secondary text-sm mb-2">{ap.reasons.join(', ')}</p>
                    <Link
                      href={`/puja/${ap.remedySlug}` as '/puja/graha-shanti-surya'}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-primary hover:text-gold-light transition-colors"
                    >
                      {tl({ en: 'View Puja Details', hi: 'पूजा विवरण देखें', sa: 'पूजा विवरण देखें', ta: 'View Puja Details', te: 'View Puja Details', bn: 'View Puja Details', kn: 'View Puja Details', gu: 'View Puja Details', mai: 'पूजा विवरण देखें', mr: 'पूजा विवरण देखें' }, locale)}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* CTA */}
      <div className="text-center mt-8">
        <p className="text-text-secondary mb-4">
          {tl({ en: 'Want a full analysis with Dashas, Yogas, and more?', hi: 'पूर्ण दशा, योग और अधिक विश्लेषण चाहते हैं?', sa: 'पूर्ण दशा, योग और अधिक विश्लेषण चाहते हैं?', ta: 'Want a full analysis with Dashas, Yogas, and more?', te: 'Want a full analysis with Dashas, Yogas, and more?', bn: 'Want a full analysis with Dashas, Yogas, and more?', kn: 'Want a full analysis with Dashas, Yogas, and more?', gu: 'Want a full analysis with Dashas, Yogas, and more?', mai: 'पूर्ण दशा, योग और अधिक विश्लेषण चाहते हैं?', mr: 'पूर्ण दशा, योग और अधिक विश्लेषण चाहते हैं?' }, locale)}
        </p>
        <Link href="/kundali" className="inline-block px-8 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-lg hover:from-gold-primary hover:to-gold-light transition-all">
          {tl({ en: 'Generate Full Chart', hi: 'पूर्ण कुण्डली बनाएं', sa: 'पूर्ण कुण्डली बनाएं', ta: 'Generate Full Chart', te: 'Generate Full Chart', bn: 'Generate Full Chart', kn: 'Generate Full Chart', gu: 'Generate Full Chart', mai: 'पूर्ण कुण्डली बनाएं', mr: 'पूर्ण कुण्डली बनाएं' }, locale)}
        </Link>
      </div>
    </div>
  );
}
