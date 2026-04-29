'use client';

/**
 * Transit Playground page.
 *
 * Step 1: User enters birth details → natal chart is generated.
 * Step 2: Current sky positions fetched from /api/sky/positions.
 * Step 3: TransitPlayground renders the interactive sandbox.
 */

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import BirthForm from '@/components/kundali/BirthForm';
import type { BirthData, ChartStyle, KundaliData } from '@/types/kundali';
import type { SkyPlanetPosition } from '@/lib/sky/positions';
import { tl } from '@/lib/utils/trilingual';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';

const TransitPlayground = dynamic(
  () => import('@/components/transit/TransitPlayground'),
  { ssr: false, loading: () => <PlaygroundSkeleton /> }
);

// ---------------------------------------------------------------------------
// Inline labels (4 active locales: en, hi, ta, bn)
// ---------------------------------------------------------------------------
const LABELS = {
  title: {
    en: 'Transit Playground',
    hi: 'गोचर प्रयोगशाला',
    ta: 'கோசர விளையாட்டு மைதானம்',
    bn: 'গোচর প্লেগ্রাউন্ড',
  },
  subtitle: {
    en: 'Interactive Vedic transit sandbox — drag planets, see real-time gochara analysis',
    hi: 'इंटरैक्टिव वैदिक गोचर — ग्रह खींचें, तुरंत विश्लेषण देखें',
    ta: 'இடர்வீசு வேத கோசர — கிரகங்களை இழுத்து நேரடி பகுப்பாய்வு பெறுங்கள்',
    bn: 'ইন্টারেক্টিভ বৈদিক গোচর — গ্রহ টানুন, তাৎক্ষণিক বিশ্লেষণ দেখুন',
  },
  step1: {
    en: 'Enter your birth details to load your natal chart',
    hi: 'अपनी जन्म कुंडली लोड करने के लिए जन्म विवरण दर्ज करें',
    ta: 'உங்கள் ஜாதகம் ஏற்ற பிறப்பு விவரங்களை உள்ளிடவும்',
    bn: 'আপনার জন্ম কুণ্ডলী লোড করতে জন্ম বিবরণ দিন',
  },
  loadingChart: {
    en: 'Generating natal chart…',
    hi: 'जन्म कुंडली बना रहे हैं…',
    ta: 'ஜாதகம் உருவாக்கப்படுகிறது…',
    bn: 'জন্ম কুণ্ডলী তৈরি হচ্ছে…',
  },
  loadingSky: {
    en: 'Fetching current sky positions…',
    hi: 'वर्तमान ग्रह स्थिति प्राप्त हो रही है…',
    ta: 'தற்போதைய வான நிலைகள் பெறப்படுகின்றன…',
    bn: 'বর্তমান গ্রহ অবস্থান আনা হচ্ছে…',
  },
  errorChart: {
    en: 'Failed to generate natal chart.',
    hi: 'जन्म कुंडली बनाने में विफल।',
    ta: 'ஜாதகம் உருவாக்க முடியவில்லை.',
    bn: 'জন্ম কুণ্ডলী তৈরি করতে ব্যর্থ হয়েছে।',
  },
  errorSky: {
    en: 'Failed to fetch sky positions.',
    hi: 'ग्रह स्थितियाँ प्राप्त करने में विफल।',
    ta: 'வான நிலைகளை பெற முடியவில்லை.',
    bn: 'গ্রহ অবস্থান আনতে ব্যর্থ হয়েছে।',
  },
  about: {
    en: 'About Transit Playground',
    hi: 'गोचर प्रयोगशाला के बारे में',
    ta: 'கோசர விளையாட்டு மைதானம் பற்றி',
    bn: 'গোচর প্লেগ্রাউন্ড সম্পর্কে',
  },
  aboutBody: {
    en: 'In Vedic astrology, Gochara (transit) analysis tracks how moving planets interact with your natal chart. Planets transit through the 12 rashis and their effects are measured from your natal Moon sign. This sandbox lets you freely place transit planets in any house and instantly see the classical gochara quality, Vedha obstruction, and Double Transit activation. Use it to understand how Saturn\'s 7½-year Sade Sati works, why Jupiter in the 5th house is auspicious, or what happens when two planets create Vedha.',
    hi: 'वैदिक ज्योतिष में गोचर विश्लेषण यह बताता है कि चलते ग्रह आपकी जन्म कुंडली के साथ कैसे संपर्क करते हैं। ग्रह 12 राशियों से गुजरते हैं और उनके प्रभाव चंद्र राशि से मापे जाते हैं। यह प्रयोगशाला आपको किसी भी भाव में ग्रह रखने और तुरंत गोचर गुणवत्ता, वेध और द्विगोचर देखने की सुविधा देती है।',
    ta: 'வேத ஜோதிடத்தில், கோசர பகுப்பாய்வு நகரும் கிரகங்கள் உங்கள் ஜாதகத்துடன் எவ்வாறு தொடர்பு கொள்கின்றன என்பதை சோதிக்கிறது. இந்த சாண்ட்பாக்ஸில் எந்த வீட்டிலும் கிரகங்களை வைத்து உடனடி கோசர தரம், வேத தடை மற்றும் இரட்டை கோசர செயல்பாட்டை காணலாம்.',
    bn: 'বৈদিক জ্যোতিষে গোচর বিশ্লেষণ চলমান গ্রহগুলি আপনার জন্মকুণ্ডলীর সাথে কীভাবে মিথস্ক্রিয়া করে তা পরীক্ষা করে। এই স্যান্ডবক্সে যেকোনো ভাবে গ্রহ রেখে তাৎক্ষণিক গোচর মান, বেধ বাধা এবং দ্বিগোচর সক্রিয়করণ দেখুন।',
  },
};

function PlaygroundSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full animate-pulse">
      <div className="lg:w-[60%] h-96 rounded-xl bg-bg-secondary/40" />
      <div className="lg:w-[40%] h-96 rounded-xl bg-bg-secondary/40" />
    </div>
  );
}

export default function TransitPlaygroundPage() {
  const locale = useLocale();

  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [natal, setNatal] = useState<KundaliData | null>(null);
  const [skyPositions, setSkyPositions] = useState<SkyPlanetPosition[] | null>(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingSky, setLoadingSky] = useState(false);
  const [errorChart, setErrorChart] = useState<string | null>(null);
  const [errorSky, setErrorSky] = useState<string | null>(null);

  // Fetch sky positions on mount (independent of natal chart)
  useEffect(() => {
    setLoadingSky(true);
    setErrorSky(null);
    fetch('/api/sky/positions')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: { positions: SkyPlanetPosition[] }) => {
        setSkyPositions(data.positions);
      })
      .catch(err => {
        console.error('[transit-playground] sky positions fetch failed:', err);
        setErrorSky(tl(LABELS.errorSky, locale));
      })
      .finally(() => setLoadingSky(false));
  }, [locale]);

  async function handleBirthFormSubmit(data: BirthData, _style: ChartStyle) {
    setBirthData(data);
    setLoadingChart(true);
    setErrorChart(null);
    setNatal(null);

    try {
      const res = await fetch('/api/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          date: data.date,
          time: data.time,
          lat: data.lat,
          lng: data.lng,
          timezone: data.timezone,
          ayanamsha: data.ayanamsha ?? 'lahiri',
          locale,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const kundali: KundaliData = await res.json();
      setNatal(kundali);
    } catch (err) {
      console.error('[transit-playground] kundali fetch failed:', err);
      setErrorChart(tl(LABELS.errorChart, locale));
    } finally {
      setLoadingChart(false);
    }
  }

  const showPlayground = natal !== null && skyPositions !== null;

  return (
    <main className="min-h-screen bg-[#0a0e27] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #f0d48a, #d4a853)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {tl(LABELS.title, locale)}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
            {tl(LABELS.subtitle, locale)}
          </p>
        </div>

        {/* Step 1: Birth form */}
        {!showPlayground && (
          <div className="max-w-xl mx-auto mb-8">
            <p className="text-center text-text-secondary text-sm mb-4">
              {tl(LABELS.step1, locale)}
            </p>
            <BirthForm
              onSubmit={handleBirthFormSubmit}
              loading={loadingChart}
            />
            {errorChart && (
              <div className="mt-3 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {errorChart}
              </div>
            )}
            {loadingSky && (
              <p className="text-center text-text-secondary text-xs mt-3">
                {tl(LABELS.loadingSky, locale)}
              </p>
            )}
            {errorSky && (
              <div className="mt-3 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {errorSky}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {loadingChart && (
          <div className="text-center text-text-secondary text-sm py-8">
            <div className="inline-block w-5 h-5 border-2 border-gold-primary border-t-transparent rounded-full animate-spin mr-2 align-middle" />
            {tl(LABELS.loadingChart, locale)}
          </div>
        )}

        {/* Step 2: Playground */}
        {showPlayground && (
          <>
            {/* Back button */}
            <button
              onClick={() => { setNatal(null); setBirthData(null); setErrorChart(null); }}
              className="mb-6 text-xs text-text-secondary hover:text-gold-light transition-colors flex items-center gap-1"
            >
              ← Change birth data
            </button>
            <TransitPlayground
              natal={natal}
              initialSkyPositions={skyPositions}
              locale={locale}
            />
          </>
        )}

        {/* About section */}
        <div className="mt-12 max-w-3xl mx-auto rounded-xl border border-gold-primary/15 bg-bg-secondary/30 p-6">
          <h2 className="text-base font-semibold text-gold-light mb-3">
            {tl(LABELS.about, locale)}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {tl(LABELS.aboutBody, locale)}
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-secondary">
            <div className="rounded-lg bg-bg-secondary/60 border border-gold-primary/10 p-3">
              <div className="text-gold-light font-semibold mb-1">Gochara Quality</div>
              Measured from natal Moon. Good houses for each planet differ — Jupiter favours 2, 5, 7, 9, 11; Saturn favours 3, 6, 11.
            </div>
            <div className="rounded-lg bg-bg-secondary/60 border border-gold-primary/10 p-3">
              <div className="text-gold-light font-semibold mb-1">Vedha Obstruction</div>
              A planet in its good transit house is obstructed if another planet occupies the Vedha house. Exception: Sun and Saturn never obstruct each other.
            </div>
            <div className="rounded-lg bg-bg-secondary/60 border border-gold-primary/10 p-3">
              <div className="text-gold-light font-semibold mb-1">Double Transit</div>
              When Jupiter and Saturn simultaneously activate the same house from Moon, the period becomes especially significant for that house's significations.
            </div>
          </div>
        </div>

        <RelatedLinks type="learn" links={getLearnLinksForTool('/transit-playground')} locale={locale} />
      </div>
    </main>
  );
}
