'use client';

/**
 * /kp/prashna client — handles user input (mode toggle, number-stepper or
 * question text, location override) and renders the KP horary verdict.
 *
 * The cast itself runs via a Server Action defined in `actions.ts` to keep
 * the engine off the client bundle.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §3
 */

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, MessageSquare, Loader2, CircleCheck, CircleX, CircleAlert } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { useLocationStore } from '@/stores/location-store';
import { tl } from '@/lib/utils/trilingual';
import { castPrashnaAction, type ClientPrashnaResult } from './actions';
import KpNavStrip from '@/components/kp/KpNavStrip';
import { pickByScript } from "@/lib/utils/locale-fonts";

type Mode = 'number' | 'text';

const T: Record<string, {
  title: string;
  subtitle: string;
  modeNumber: string;
  modeText: string;
  enterNumber: string;
  enterQuestion: string;
  numberHelp: string;
  questionHelp: string;
  location: string;
  cast: string;
  casting: string;
  number: string;
  derivedFrom: string;
  nakshatra: string;
  sub: string;
  rulingPlanets: string;
  verdict: string;
  favourable: string;
  adverse: string;
  mixed: string;
  cuspalH11: string;
  signifies: string;
  fructification: string;
  fructificationDeferred: string;
  warnings: string;
  enterToBegin: string;
  invalidNumber: string;
  invalidQuestion: string;
  whatIsThis: string;
  whatIsThisBody: string;
}> = {
  en: {
    title: 'KP Prashna',
    subtitle: 'Krishnamurti horary astrology — ask any question, get a verdict from the cuspal sub-lord of the 11th house at the moment of submission.',
    modeNumber: 'Number (1–249)',
    modeText: 'Free question',
    enterNumber: 'Enter a number between 1 and 249',
    enterQuestion: 'Type your question',
    numberHelp: 'Canonical Krishnamurti tradition. The number identifies a specific nakshatra-sub position.',
    questionHelp: 'A number will be derived deterministically from your submission moment.',
    location: 'Cast location',
    cast: 'Cast Prashna',
    casting: 'Casting…',
    number: 'Number',
    derivedFrom: 'Derived from your submission moment',
    nakshatra: 'Nakshatra',
    sub: 'Sub-lord',
    rulingPlanets: 'Ruling Planets',
    verdict: 'Verdict',
    favourable: 'FAVOURABLE',
    adverse: 'ADVERSE',
    mixed: 'MIXED',
    cuspalH11: 'Cuspal sub-lord of 11th house',
    signifies: 'Signifies houses',
    fructification: 'Fructification window',
    fructificationDeferred: 'Timing analysis (Vimshottari Mahadasha) will be available in a future release.',
    warnings: 'Notes',
    enterToBegin: 'Enter a number or a question to begin.',
    invalidNumber: 'Please enter an integer between 1 and 249.',
    invalidQuestion: 'Please type your question.',
    whatIsThis: 'About KP Prashna',
    whatIsThisBody: 'KP horary astrology answers a single question by reading the cuspal sub-lord of the 11th house at the moment the question is submitted. The 11th house represents fulfilment, gain, and the materialisation of desires. If its sub-lord signifies favourable houses (2, 6, 10, 11), the matter is likely to materialise. If it signifies adverse houses (5, 8, 12), the matter is unlikely. Mixed signals require deeper analysis.',
  },
  hi: {
    title: 'केपी प्रश्न',
    subtitle: 'कृष्णमूर्ति होरारी ज्योतिष — कोई भी प्रश्न पूछें, समर्पण के क्षण के ११वें भाव के कस्पल उप-स्वामी से निर्णय प्राप्त करें।',
    modeNumber: 'संख्या (१–२४९)',
    modeText: 'मुक्त प्रश्न',
    enterNumber: '१ और २४९ के बीच एक संख्या दर्ज करें',
    enterQuestion: 'अपना प्रश्न लिखें',
    numberHelp: 'पारंपरिक कृष्णमूर्ति पद्धति। संख्या एक विशिष्ट नक्षत्र-उप स्थिति को दर्शाती है।',
    questionHelp: 'आपके समर्पण क्षण से संख्या निर्धारित होगी।',
    location: 'समर्पण स्थान',
    cast: 'प्रश्न समर्पित करें',
    casting: 'समर्पण…',
    number: 'संख्या',
    derivedFrom: 'आपके समर्पण क्षण से व्युत्पन्न',
    nakshatra: 'नक्षत्र',
    sub: 'उप-स्वामी',
    rulingPlanets: 'शासक ग्रह',
    verdict: 'निर्णय',
    favourable: 'शुभ',
    adverse: 'अशुभ',
    mixed: 'मिश्रित',
    cuspalH11: '११वें भाव का कस्पल उप-स्वामी',
    signifies: 'सूचित भाव',
    fructification: 'फलकाल',
    fructificationDeferred: 'समय विश्लेषण (विंशोत्तरी महादशा) भविष्य में उपलब्ध होगा।',
    warnings: 'टिप्पणियाँ',
    enterToBegin: 'आरम्भ करने हेतु संख्या या प्रश्न दर्ज करें।',
    invalidNumber: 'कृपया १ और २४९ के बीच पूर्णांक दर्ज करें।',
    invalidQuestion: 'कृपया अपना प्रश्न लिखें।',
    whatIsThis: 'केपी प्रश्न क्या है?',
    whatIsThisBody: 'केपी होरारी ज्योतिष एक ही प्रश्न का उत्तर ११वें भाव के कस्पल उप-स्वामी से देती है। ११वाँ भाव सिद्धि, लाभ और इच्छाओं की पूर्ति का प्रतीक है।',
  },
};

function getT(locale: string) {
  return T[locale] ?? T.en;
}

interface InitialLocation {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
}

export default function PrashnaClient({
  locale,
  initialLocation,
}: {
  locale: string;
  initialLocation: InitialLocation;
}) {
  const t = getT(locale);
  const loc = useLocationStore();

  const [mode, setMode] = useState<Mode>('number');
  const [num, setNum] = useState<number>(1);
  const [question, setQuestion] = useState('');
  const [overrideLocation, setOverrideLocation] = useState<InitialLocation | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClientPrashnaResult | null>(null);
  const [isPending, startTransition] = useTransition();

  // Precedence: user-picked override → location store → SSR geo-resolved
  // initial location. The SSR fallback removes the previous hardcoded
  // Varanasi default and matches /kp/transits.
  const effectiveLocation = useMemo<InitialLocation>(() => {
    if (overrideLocation) return overrideLocation;
    if (loc.lat != null && loc.lng != null) {
      return {
        name: loc.name || 'Detected location',
        lat: loc.lat,
        lng: loc.lng,
        timezone: loc.timezone || '+00:00',
      };
    }
    return initialLocation;
  }, [overrideLocation, loc.lat, loc.lng, loc.name, loc.timezone, initialLocation]);

  const handleCast = () => {
    setError(null);
    setResult(null);

    if (mode === 'number') {
      if (!Number.isInteger(num) || num < 1 || num > 249) {
        setError(t.invalidNumber);
        return;
      }
    } else if (mode === 'text') {
      if (!question.trim()) {
        setError(t.invalidQuestion);
        return;
      }
    }

    if (!effectiveLocation) {
      setError(pickByScript('Please select a location.', 'कृपया स्थान चुनें।', locale));
      return;
    }

    startTransition(async () => {
      try {
        const r = await castPrashnaAction({
          mode,
          number: mode === 'number' ? num : undefined,
          question: mode === 'text' ? question : undefined,
          submissionEpochMs: Date.now(),
          lat: effectiveLocation.lat,
          lng: effectiveLocation.lng,
          timezone: effectiveLocation.timezone,
        });
        setResult(r);
      } catch (err) {
        console.error('[kp/prashna] cast failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-3">{t.title}</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">{t.subtitle}</p>
        </header>

        <KpNavStrip current="prashna" locale={locale} />

        {/* INFO BLOCK */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gold-light mb-3">{t.whatIsThis}</h2>
          <p className="text-text-secondary text-sm leading-relaxed">{t.whatIsThisBody}</p>
        </div>

        {/* INPUT CARD */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-5">
          {/* Mode toggle */}
          <div role="tablist" aria-label="prashna-mode" className="flex gap-2 p-1 bg-bg-secondary/50 rounded-xl">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'number'}
              onClick={() => setMode('number')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                mode === 'number'
                  ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/30'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Hash className="h-4 w-4" /> {t.modeNumber}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'text'}
              onClick={() => setMode('text')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                mode === 'text'
                  ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/30'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <MessageSquare className="h-4 w-4" /> {t.modeText}
            </button>
          </div>

          {/* Number input */}
          {mode === 'number' && (
            <div>
              <label htmlFor="kp-prashna-number" className="block text-text-secondary text-sm mb-2">
                {t.enterNumber}
              </label>
              <input
                id="kp-prashna-number"
                type="number"
                min={1}
                max={249}
                value={num}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  setNum(Number.isFinite(parsed) ? parsed : 0);
                }}
                className="w-full bg-bg-secondary/50 border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50"
              />
              <p className="text-text-secondary/70 text-xs mt-2">{t.numberHelp}</p>
            </div>
          )}

          {/* Text input */}
          {mode === 'text' && (
            <div>
              <label htmlFor="kp-prashna-question" className="block text-text-secondary text-sm mb-2">
                {t.enterQuestion}
              </label>
              <textarea
                id="kp-prashna-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                className="w-full bg-bg-secondary/50 border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 resize-none"
                placeholder={pickByScript('Will I get the job?', 'क्या मुझे यह नौकरी मिलेगी?', locale)}
                maxLength={500}
              />
              <p className="text-text-secondary/70 text-xs mt-2">{t.questionHelp}</p>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-text-secondary text-sm mb-2">{t.location}</label>
            <LocationSearch
              value={effectiveLocation?.name ?? ''}
              onSelect={(l) => setOverrideLocation(l)}
              placeholder={pickByScript('Search city or place…', 'नगर खोजें…', locale)}
            />
            {effectiveLocation && (
              <p className="text-text-secondary/70 text-xs mt-1.5">
                {effectiveLocation.name} · {effectiveLocation.lat.toFixed(2)}, {effectiveLocation.lng.toFixed(2)} · {effectiveLocation.timezone}
              </p>
            )}
          </div>

          {error && (
            <div role="alert" className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleCast}
            disabled={isPending || !effectiveLocation}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-primary/15 hover:bg-gold-primary/25 disabled:opacity-50 disabled:cursor-not-allowed border border-gold-primary/30 text-gold-light font-medium transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t.casting}
              </>
            ) : (
              t.cast
            )}
          </button>
        </div>

        {/* RESULT */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <VerdictCard r={result} t={t} locale={locale} />
              <DerivedCard r={result} t={t} locale={locale} />
              <RulingPlanetsCard r={result} t={t} locale={locale} />
              <CuspalCard r={result} t={t} locale={locale} />
              <FructificationCard r={result} t={t} />
              {result.warnings.length > 0 && (
                <WarningsCard r={result} t={t} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !isPending && (
          <p className="text-center text-text-secondary text-sm py-8">{t.enterToBegin}</p>
        )}

        <div className="text-center">
          <Link
            href={`/${locale}/kp-system`}
            className="text-gold-primary hover:text-gold-light text-sm underline underline-offset-4"
          >
            {pickByScript('Open Full KP Analysis →', 'पूर्ण केपी विश्लेषण देखें →', locale)}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-cards
// ────────────────────────────────────────────────────────────────────────────

type T = ReturnType<typeof getT>;

function VerdictCard({ r, t, locale }: { r: ClientPrashnaResult; t: T; locale: string }) {
  const cfg: Record<typeof r.verdict, {
    label: string;
    color: string;
    border: string;
    bg: string;
    Icon: typeof CircleCheck;
  }> = {
    favourable: { label: t.favourable, color: 'text-green-300', border: 'border-green-500/40', bg: 'bg-green-500/5', Icon: CircleCheck },
    adverse: { label: t.adverse, color: 'text-red-300', border: 'border-red-500/40', bg: 'bg-red-500/5', Icon: CircleX },
    mixed: { label: t.mixed, color: 'text-amber-300', border: 'border-amber-500/40', bg: 'bg-amber-500/5', Icon: CircleAlert },
  };
  const v = cfg[r.verdict];

  const Icon = v.Icon;

  return (
    <div className={`border ${v.border} ${v.bg} rounded-2xl p-6 text-center`}>
      <Icon className={`h-12 w-12 mx-auto mb-3 ${v.color}`} />
      <p className={`uppercase tracking-widest text-xs ${v.color} mb-2`}>{t.verdict}</p>
      <p className={`text-3xl font-bold mb-3 ${v.color}`}>{v.label}</p>
      <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">
        {tl(r.verdictReason, locale)}
      </p>
    </div>
  );
}

function DerivedCard({ r, t, locale }: { r: ClientPrashnaResult; t: T; locale: string }) {
  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{t.number}</p>
          <p className="text-3xl text-gold-light font-bold">{r.number}</p>
          {r.question && (
            <p className="text-text-secondary/70 text-xs mt-2 italic">&ldquo;{r.question}&rdquo;</p>
          )}
        </div>
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{t.nakshatra}</p>
          <p className="text-xl text-gold-light font-semibold">{tl(r.nakshatra.name, locale)}</p>
        </div>
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{t.sub}</p>
          <p className="text-xl text-gold-light font-semibold">{tl(r.sub.name, locale)}</p>
        </div>
      </div>
    </div>
  );
}

function RulingPlanetsCard({ r, t, locale }: { r: ClientPrashnaResult; t: T; locale: string }) {
  const rps = [
    { label: 'Asc Sign', planet: r.rulingPlanets.ascSignLord },
    { label: 'Asc Star', planet: r.rulingPlanets.ascStarLord },
    { label: 'Asc Sub', planet: r.rulingPlanets.ascSubLord },
    { label: 'Moon Sign', planet: r.rulingPlanets.moonSignLord },
    { label: 'Moon Star', planet: r.rulingPlanets.moonStarLord },
    { label: 'Moon Sub', planet: r.rulingPlanets.moonSubLord },
    { label: 'Day', planet: r.rulingPlanets.dayLord },
  ];
  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-gold-light mb-4 text-center">{t.rulingPlanets}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {rps.map((rp) => (
          <div key={rp.label} className="rounded-xl p-3 bg-gold-primary/5 border border-gold-primary/15 text-center">
            <GrahaIconById id={rp.planet.id} size={28} />
            <p className="text-gold-light font-bold text-sm mt-2">{tl(rp.planet.name, locale)}</p>
            <p className="text-text-secondary text-xs mt-0.5">{rp.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CuspalCard({ r, t, locale }: { r: ClientPrashnaResult; t: T; locale: string }) {
  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-gold-light mb-4">{t.cuspalH11}</h2>
      <div className="flex items-center gap-4 mb-3">
        <GrahaIconById id={r.cuspalSubLordOfH11.planetId} size={48} />
        <div>
          <p className="text-xl text-gold-light font-semibold">{tl(r.cuspalSubLordOfH11.planetName, locale)}</p>
          <p className="text-text-secondary text-sm mt-1">
            {t.signifies}: {r.cuspalSubLordOfH11.signifiedHouses.length > 0
              ? r.cuspalSubLordOfH11.signifiedHouses.join(', ')
              : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

function FructificationCard({ r, t }: { r: ClientPrashnaResult; t: T }) {
  if (r.fructificationWindow) {
    return (
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gold-light mb-3">{t.fructification}</h2>
        <p className="text-text-secondary text-sm">{r.fructificationWindow.dashaContext}</p>
      </div>
    );
  }
  return (
    <div className="border border-gold-primary/10 rounded-2xl p-5 bg-bg-secondary/30">
      <p className="text-text-secondary text-xs uppercase tracking-wider mb-1.5">{t.fructification}</p>
      <p className="text-text-secondary/80 text-sm italic">{t.fructificationDeferred}</p>
    </div>
  );
}

function WarningsCard({ r, t }: { r: ClientPrashnaResult; t: T }) {
  return (
    <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-5">
      <p className="text-amber-300 text-xs uppercase tracking-wider mb-2">{t.warnings}</p>
      <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
        {r.warnings.map((w: string, i: number) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
