'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import BirthForm from '@/components/kundali/BirthForm';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { authedFetch } from '@/lib/api/authed-fetch';
import { generateCosmicBlueprint, type CosmicBlueprint } from '@/lib/kundali/archetype-engine';
import { GRAHAS } from '@/lib/constants/grahas';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import type { BirthData, ChartStyle, KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';

const BlueprintTab = dynamic(() => import('@/components/kundali/BlueprintTab'), { ssr: false });

// Lagna lord: lord of the ascendant sign (1-based rashi ID -> planet ID)
const SIGN_LORDS: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

const LABELS = {
  title: { en: 'Cosmic Blueprint', hi: 'कॉस्मिक ब्लूप्रिंट', sa: 'दैवनिर्माणम्' },
  subtitle: {
    en: 'Discover your primary archetype, shadow self, and current life chapter based on your Vedic birth chart.',
    hi: 'अपने वैदिक जन्म कुण्डली के आधार पर अपना प्राथमिक रूपांतर, छाया स्व, और वर्तमान जीवन अध्याय जानें।',
    sa: 'स्वस्य वैदिकजन्मकुण्डल्याः आधारेण प्राथमिकरूपं छायात्मानं वर्तमानजीवनाध्यायं च जानीयात्।',
  },
  seeFullChart: { en: 'See your complete birth chart', hi: 'अपनी पूर्ण जन्म कुण्डली देखें', sa: 'पूर्णजन्मकुण्डलीं पश्यतु' },
  errorTitle: { en: 'Blueprint generation failed', hi: 'ब्लूप्रिंट बनाने में त्रुटि', sa: 'दैवनिर्माणे दोषः' },
  errorMsg: {
    en: 'Could not generate your Cosmic Blueprint. This may happen if birth data is incomplete or if the chart computation encountered an issue. Please try again.',
    hi: 'आपका कॉस्मिक ब्लूप्रिंट बनाने में असमर्थ। कृपया पुनः प्रयास करें।',
    sa: 'भवतः दैवनिर्माणं कर्तुं न शक्यते। पुनः प्रयासं कुर्वन्तु।',
  },
  computeError: {
    en: 'Kundali computation failed. Please check your birth details and try again.',
    hi: 'कुण्डली गणना विफल। कृपया अपना जन्म विवरण जांचें और पुनः प्रयास करें।',
    sa: 'कुण्डलीगणनं विफलम्। स्वजन्मविवरणं परीक्ष्य पुनः प्रयतताम्।',
  },
} as const;

function tl(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en;
}

export default function CosmicBlueprintPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);

  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<CosmicBlueprint | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: BirthData, _style: ChartStyle) => {
    setLoading(true);
    setError(null);
    setBlueprint(null);
    setBirthData(data);

    try {
      const res = await authedFetch('/api/kundali', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const kundali: KundaliData = await res.json();

      if (!res.ok || !kundali.planets) {
        console.error('[cosmic-blueprint] Kundali API error:', (kundali as unknown as Record<string, unknown>).error || `HTTP ${res.status}`);
        setError(tl(LABELS.computeError, locale));
        setLoading(false);
        return;
      }

      // Extract data needed for blueprint generation
      if (!kundali.fullShadbala || !kundali.dashas || !kundali.yogasComplete || !kundali.ascendant) {
        console.error('[cosmic-blueprint] Missing required data for blueprint:', {
          hasShadbala: !!kundali.fullShadbala,
          hasDashas: !!kundali.dashas,
          hasYogas: !!kundali.yogasComplete,
          hasAscendant: !!kundali.ascendant,
        });
        setError(tl(LABELS.errorMsg, locale));
        setLoading(false);
        return;
      }

      const dashasWithDates = kundali.dashas
        .filter(d => d.level === 'maha')
        .map(d => ({
          planet: d.planet,
          startDate: new Date(d.startDate),
          endDate: new Date(d.endDate),
          years: (new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) / (365.25 * 24 * 3600 * 1000),
        }));

      const yogasForBlueprint = kundali.yogasComplete.map(y => ({
        id: y.id,
        name: y.name,
        present: y.present,
        strength: y.strength,
        isAuspicious: y.isAuspicious,
      }));

      const planetsForBlueprint = kundali.planets.map(p => ({ id: p.planet.id, longitude: p.longitude }));
      const rahuP = kundali.planets.find(p => p.planet.id === 7);
      const ketuP = kundali.planets.find(p => p.planet.id === 8);
      const moonP = kundali.planets.find(p => p.planet.id === 1);
      const lagnaLordId = SIGN_LORDS[kundali.ascendant.sign];

      const result = generateCosmicBlueprint({
        shadbala: kundali.fullShadbala,
        dashas: dashasWithDates,
        yogas: yogasForBlueprint,
        ascendantSign: kundali.ascendant.sign,
        planets: planetsForBlueprint,
        rahuLongitude: rahuP?.longitude,
        ketuLongitude: ketuP?.longitude,
        lagnaLordId,
        moonLongitude: moonP?.longitude,
      });

      setBlueprint(result);
    } catch (err) {
      console.error('[cosmic-blueprint] generation failed:', err);
      setError(tl(LABELS.errorMsg, locale));
    }

    setLoading(false);
  };

  // Build kundali URL params for "See your complete chart" CTA
  const kundaliUrl = useMemo(() => {
    if (!birthData) return '/kundali';
    const params = new URLSearchParams();
    if (birthData.name) params.set('n', birthData.name);
    if (birthData.date) params.set('d', birthData.date);
    if (birthData.time) params.set('t', birthData.time);
    if (birthData.lat) params.set('lat', String(birthData.lat));
    if (birthData.lng) params.set('lng', String(birthData.lng));
    if (birthData.place) params.set('p', birthData.place);
    if (birthData.timezone) params.set('tz', birthData.timezone);
    return `/kundali?${params.toString()}`;
  }, [birthData]);

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-gold-primary">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs tracking-[0.2em] uppercase font-medium">Vedic Personality Profile</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light leading-tight ${isDevanagari ? headingFont : ''}`}
          >
            {tl(LABELS.title, locale)}
          </h1>
          <p className="text-text-secondary mt-3 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {tl(LABELS.subtitle, locale)}
          </p>
        </div>

        <GoldDivider />

        {/* Birth Form — shown when no blueprint yet */}
        {!blueprint && (
          <div className="mt-8">
            <BirthForm onSubmit={handleGenerate} loading={loading} />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <p className="text-red-400 font-semibold mb-2">{tl(LABELS.errorTitle, locale)}</p>
            <p className="text-text-secondary text-sm">{error}</p>
          </div>
        )}

        {/* Blueprint result */}
        {blueprint && (
          <div className="mt-8 space-y-8">
            <BlueprintTab blueprint={blueprint} locale={locale} />

            {/* CTA to full kundali */}
            <div className="text-center pt-4">
              <Link
                href={kundaliUrl}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-primary/20 to-gold-dark/20 text-gold-light border border-gold-primary/30 hover:from-gold-primary/30 hover:to-gold-dark/30 transition-all text-sm font-semibold"
              >
                {tl(LABELS.seeFullChart, locale)}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Generate another */}
            <div className="text-center">
              <button
                onClick={() => {
                  setBlueprint(null);
                  setBirthData(null);
                  setError(null);
                }}
                className="text-text-secondary hover:text-gold-light transition-colors text-sm underline underline-offset-4"
              >
                {locale === 'hi' ? 'नया ब्लूप्रिंट बनाएं' : 'Generate another blueprint'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
