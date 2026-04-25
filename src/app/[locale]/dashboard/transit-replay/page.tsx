'use client';

/**
 * /dashboard/transit-replay — "Time Machine"
 *
 * Pick any date → see full planetary positions for that date overlaid on the
 * user's natal chart houses, plus transit-to-natal aspects and notable conditions.
 *
 * No auth required. Birth data is entered manually (or auto-loaded from the
 * saved kundali snapshot when the user is signed in).
 *
 * Data flow:
 *  - On mount: if user is signed in, fetch birth data from kundali_snapshots
 *  - On submit: POST /api/transit-replay { date, birthData }
 *  - Display results table + aspects + notable conditions
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Search, Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

// ---------------------------------------------------------------------------
// Labels (en / hi / ta / bn)
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: 'Transit Replay',
    subtitle: 'See the sky on any date relative to your birth chart',
    back: 'Dashboard',
    datePicker: 'Select date',
    birthSection: 'Your Birth Data',
    nameLabel: 'Name',
    dateLabel: 'Birth date',
    timeLabel: 'Birth time (HH:MM)',
    placeLabel: 'Place of birth',
    latLabel: 'Latitude',
    lngLabel: 'Longitude',
    tzLabel: 'Timezone (IANA)',
    compute: 'See the Sky',
    computing: 'Computing…',
    signedInNote: 'Birth data auto-loaded from your saved chart.',
    noSavedChart: 'No saved chart found. Enter birth details below.',
    resultsTitle: (date: string) => `Sky on ${date}`,
    planet: 'Planet',
    transitSign: 'Sign',
    nakshatra: 'Nakshatra',
    house: 'Transit House',
    retro: 'R',
    aspectsTitle: 'Transit-to-Natal Aspects',
    aspect: 'Aspect',
    orb: 'Orb',
    notableTitle: 'Notable Conditions',
    noAspects: 'No classical aspects found for this date.',
    errorPrefix: 'Error:',
    missingFields: 'Please fill in all birth data fields.',
  },
  hi: {
    title: 'गोचर रिप्ले',
    subtitle: 'किसी भी तिथि पर आकाश को अपनी जन्म कुण्डली के सापेक्ष देखें',
    back: 'डैशबोर्ड',
    datePicker: 'तिथि चुनें',
    birthSection: 'आपका जन्म डेटा',
    nameLabel: 'नाम',
    dateLabel: 'जन्म तिथि',
    timeLabel: 'जन्म समय (HH:MM)',
    placeLabel: 'जन्म स्थान',
    latLabel: 'अक्षांश',
    lngLabel: 'देशांतर',
    tzLabel: 'टाइमज़ोन (IANA)',
    compute: 'आकाश देखें',
    computing: 'गणना हो रही है…',
    signedInNote: 'जन्म डेटा आपके सहेजे गए चार्ट से स्वतः लोड हुआ।',
    noSavedChart: 'कोई सहेजा गया चार्ट नहीं मिला। नीचे जन्म विवरण दर्ज करें।',
    resultsTitle: (date: string) => `${date} को आकाश`,
    planet: 'ग्रह',
    transitSign: 'राशि',
    nakshatra: 'नक्षत्र',
    house: 'गोचर भाव',
    retro: 'वक्री',
    aspectsTitle: 'गोचर-जन्म पहलू',
    aspect: 'पहलू',
    orb: 'अंतर',
    notableTitle: 'विशेष स्थितियाँ',
    noAspects: 'इस तिथि के लिए कोई शास्त्रीय पहलू नहीं मिला।',
    errorPrefix: 'त्रुटि:',
    missingFields: 'कृपया सभी जन्म विवरण भरें।',
  },
  ta: {
    title: 'கோசார ரீப்ளே',
    subtitle: 'எந்த தேதியிலும் உங்கள் ஜாதகத்தை மையமாக வைத்து வானத்தை காணுங்கள்',
    back: 'டாஷ்போர்ட்',
    datePicker: 'தேதி தேர்வு',
    birthSection: 'உங்கள் பிறப்பு தகவல்',
    nameLabel: 'பெயர்',
    dateLabel: 'பிறந்த தேதி',
    timeLabel: 'பிறந்த நேரம் (HH:MM)',
    placeLabel: 'பிறந்த இடம்',
    latLabel: 'அட்சரேகை',
    lngLabel: 'தீர்க்கரேகை',
    tzLabel: 'நேர மண்டலம் (IANA)',
    compute: 'வானத்தை காண்',
    computing: 'கணக்கிடுகிறது…',
    signedInNote: 'பிறப்பு தகவல் உங்கள் சேமித்த ஜாதகத்திலிருந்து தானாக ஏற்றப்பட்டது.',
    noSavedChart: 'சேமித்த ஜாதகம் கிடைக்கவில்லை. கீழே பிறப்பு விவரங்களை உள்ளிடவும்.',
    resultsTitle: (date: string) => `${date} அன்று வானம்`,
    planet: 'கோளம்',
    transitSign: 'ராசி',
    nakshatra: 'நட்சத்திரம்',
    house: 'கோசார இடம்',
    retro: 'வ',
    aspectsTitle: 'கோசார-ஜன்ம தொடர்புகள்',
    aspect: 'தொடர்பு',
    orb: 'வேறுபாடு',
    notableTitle: 'குறிப்பிடத்தக்க நிலைகள்',
    noAspects: 'இந்த தேதிக்கு பாரம்பரிய தொடர்புகள் இல்லை.',
    errorPrefix: 'பிழை:',
    missingFields: 'அனைத்து பிறப்பு தகவல் புலங்களையும் நிரப்பவும்.',
  },
  bn: {
    title: 'গোচর রিপ্লে',
    subtitle: 'যেকোনো তারিখে আপনার জন্মকুণ্ডলী অনুযায়ী আকাশ দেখুন',
    back: 'ড্যাশবোর্ড',
    datePicker: 'তারিখ বাছুন',
    birthSection: 'আপনার জন্মতথ্য',
    nameLabel: 'নাম',
    dateLabel: 'জন্ম তারিখ',
    timeLabel: 'জন্ম সময় (HH:MM)',
    placeLabel: 'জন্মস্থান',
    latLabel: 'অক্ষাংশ',
    lngLabel: 'দ্রাঘিমাংশ',
    tzLabel: 'টাইমজোন (IANA)',
    compute: 'আকাশ দেখুন',
    computing: 'গণনা চলছে…',
    signedInNote: 'আপনার সংরক্ষিত চার্ট থেকে জন্মতথ্য স্বয়ংক্রিয়ভাবে লোড হয়েছে।',
    noSavedChart: 'কোনো সংরক্ষিত চার্ট পাওয়া যায়নি। নিচে জন্মতথ্য লিখুন।',
    resultsTitle: (date: string) => `${date} তারিখে আকাশ`,
    planet: 'গ্রহ',
    transitSign: 'রাশি',
    nakshatra: 'নক্ষত্র',
    house: 'গোচর ভাব',
    retro: 'বক্রী',
    aspectsTitle: 'গোচর-জন্ম দৃষ্টি',
    aspect: 'দৃষ্টি',
    orb: 'ব্যবধান',
    notableTitle: 'উল্লেখযোগ্য অবস্থা',
    noAspects: 'এই তারিখের জন্য কোনো শাস্ত্রীয় দৃষ্টি পাওয়া যায়নি।',
    errorPrefix: 'ত্রুটি:',
    missingFields: 'অনুগ্রহ করে সমস্ত জন্মতথ্য পূরণ করুন।',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getL(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Rashi names (1-based)
// ---------------------------------------------------------------------------
const RASHI_NAMES: Record<number, string> = {
  1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer', 5: 'Leo', 6: 'Virgo',
  7: 'Libra', 8: 'Scorpio', 9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces',
};

const NAKSHATRA_NAMES: Record<number, string> = {
  1:'Ashwini',2:'Bharani',3:'Krittika',4:'Rohini',5:'Mrigashira',6:'Ardra',
  7:'Punarvasu',8:'Pushya',9:'Ashlesha',10:'Magha',11:'PurvaPhalguni',12:'UttaraPhalguni',
  13:'Hasta',14:'Chitra',15:'Swati',16:'Vishakha',17:'Anuradha',18:'Jyeshtha',
  19:'Mula',20:'PurvaAshadha',21:'UttaraAshadha',22:'Shravana',23:'Dhanishtha',
  24:'Shatabhisha',25:'PurvaBhadra',26:'UttaraBhadra',27:'Revati',
};

// ---------------------------------------------------------------------------
// API response types
// ---------------------------------------------------------------------------
interface TransitRow {
  id: number;
  name: string;
  rashi: number;
  nakshatra: number;
  nakshatraPada: number;
  siderealLongitude: number;
  isRetrograde: boolean;
  house: number;
  natalSign: number | null;
  natalHouse: number | null;
}

interface AspectRow {
  transitPlanet: string;
  natalPlanet: string;
  aspect: string;
  orb: number;
}

interface ReplayResult {
  selectedDate: string;
  natalSummary: {
    name: string;
    date: string;
    time: string;
    place: string;
    ascendantSign: number;
    ascendantDeg: number;
  };
  transitPositions: TransitRow[];
  aspects: AspectRow[];
  notableConditions: string[];
}

// ---------------------------------------------------------------------------
// Birth form state
// ---------------------------------------------------------------------------
interface BirthForm {
  name: string;
  date: string;
  time: string;
  place: string;
  lat: string;
  lng: string;
  timezone: string;
}

const EMPTY_FORM: BirthForm = {
  name: '', date: '', time: '', place: '', lat: '', lng: '', timezone: '',
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function TransitReplayPage() {
  const locale = useLocale() as Locale;
  const L = getL(locale);
  const hf = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : {};

  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
  });
  const [form, setForm] = useState<BirthForm>(EMPTY_FORM);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [loadNote, setLoadNote] = useState<string | null>(null);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReplayResult | null>(null);

  // --- Auto-load birth data from saved kundali_snapshot ---
  useEffect(() => {
    if (!user || !session) return;
    const supabase = getSupabase();
    if (!supabase) return;

    supabase
      .from('kundali_snapshots')
      .select('birth_data')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err) {
          console.error('[transit-replay] snapshot fetch failed:', err);
          return;
        }
        if (data?.birth_data) {
          const bd = data.birth_data as Partial<BirthForm & { ayanamsha?: string }>;
          setForm({
            name: bd.name ?? '',
            date: bd.date ?? '',
            time: bd.time ?? '',
            place: bd.place ?? '',
            lat: String(bd.lat ?? ''),
            lng: String(bd.lng ?? ''),
            timezone: bd.timezone ?? '',
          });
          setAutoLoaded(true);
          setLoadNote(L.signedInNote);
        } else {
          setLoadNote(L.noSavedChart);
        }
      });
  }, [user, session, L.signedInNote, L.noSavedChart]);

  const handleField = useCallback(
    (field: keyof BirthForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !form.date || !form.time || !form.lat || !form.lng || !form.timezone
      ) {
        setError(L.missingFields);
        return;
      }

      setError(null);
      setResult(null);
      setComputing(true);

      try {
        const res = await fetch('/api/transit-replay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: selectedDate,
            birthData: {
              name: form.name || 'Chart',
              date: form.date,
              time: form.time,
              place: form.place,
              lat: parseFloat(form.lat),
              lng: parseFloat(form.lng),
              timezone: form.timezone,
              ayanamsha: 'lahiri',
            },
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error ?? 'Request failed');
        }
        setResult(json as ReplayResult);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[transit-replay] fetch failed:', err);
        setError(msg);
      } finally {
        setComputing(false);
      }
    },
    [form, selectedDate, L.missingFields]
  );

  return (
    <main className="min-h-screen bg-[#0a0e27] text-text-primary px-4 py-8" style={bf}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light text-sm transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {L.back}
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-gold-primary/15 border border-gold-primary/25">
              <RotateCcw className="w-5 h-5 text-gold-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gold-light" style={hf}>{L.title}</h1>
          </div>
          <p className="text-text-secondary text-sm">{L.subtitle}</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6 mb-10"
        >
          {/* Date picker */}
          <div className="p-5 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <label className="block text-gold-light text-sm font-semibold mb-2">
              <Calendar className="inline w-4 h-4 mr-1.5" />
              {L.datePicker}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 rounded-lg bg-[#0a0e27] border border-gold-primary/25 text-text-primary text-sm focus:outline-none focus:border-gold-primary/60 transition-colors"
              required
            />
          </div>

          {/* Birth data */}
          <div className="p-5 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] space-y-4">
            <h2 className="text-gold-light text-sm font-semibold" style={hf}>{L.birthSection}</h2>

            {loadNote && (
              <p className={`text-xs px-3 py-2 rounded-lg border ${autoLoaded ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
                {loadNote}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  ['name',     L.nameLabel,   'text'],
                  ['date',     L.dateLabel,   'date'],
                  ['time',     L.timeLabel,   'time'],
                  ['place',    L.placeLabel,  'text'],
                  ['lat',      L.latLabel,    'number'],
                  ['lng',      L.lngLabel,    'number'],
                  ['timezone', L.tzLabel,     'text'],
                ] as [keyof BirthForm, string, string][]
              ).map(([field, label, type]) => (
                <div key={field}>
                  <label className="block text-text-secondary text-xs mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[field]}
                    onChange={handleField(field)}
                    step={type === 'number' ? '0.0001' : undefined}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0e27] border border-gold-primary/20 text-text-primary text-sm focus:outline-none focus:border-gold-primary/60 transition-colors placeholder:text-text-secondary/40"
                    required={field !== 'name' && field !== 'place'}
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{L.errorPrefix} {error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={computing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold text-sm hover:brightness-110 disabled:opacity-60 transition-all"
          >
            {computing ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{L.computing}</>
            ) : (
              <><Search className="w-4 h-4" />{L.compute}</>
            )}
          </button>
        </motion.form>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Positions table */}
            <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] overflow-hidden">
              <div className="px-5 py-4 border-b border-gold-primary/15">
                <h2 className="text-gold-light font-semibold" style={hf}>
                  {L.resultsTitle(result.selectedDate)}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text-secondary text-xs uppercase tracking-wide border-b border-gold-primary/10">
                      <th className="text-left px-4 py-3">{L.planet}</th>
                      <th className="text-left px-4 py-3">{L.transitSign}</th>
                      <th className="text-left px-4 py-3">{L.nakshatra}</th>
                      <th className="text-center px-4 py-3">{L.house}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.transitPositions.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <GrahaIconById id={row.id} size={18} />
                            <span className="font-medium text-text-primary">
                              {tl({ en: row.name, hi: row.name, sa: row.name, ta: row.name, te: row.name, bn: row.name, kn: row.name, mr: row.name, gu: row.name, mai: row.name }, locale)}
                            </span>
                            {row.isRetrograde && (
                              <span className="text-[10px] text-amber-400 font-bold border border-amber-400/30 rounded px-1">
                                {L.retro}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {RASHI_NAMES[row.rashi] ?? row.rashi}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {NAKSHATRA_NAMES[row.nakshatra] ?? row.nakshatra}
                          <span className="text-text-secondary/50 text-xs ml-1">p{row.nakshatraPada}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block w-7 h-7 rounded-full bg-gold-primary/15 border border-gold-primary/25 text-gold-light text-xs font-bold leading-7 text-center">
                            {row.house}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Aspects */}
            <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] overflow-hidden">
              <div className="px-5 py-4 border-b border-gold-primary/15">
                <h2 className="text-gold-light font-semibold" style={hf}>{L.aspectsTitle}</h2>
              </div>
              {result.aspects.length === 0 ? (
                <p className="px-5 py-6 text-text-secondary text-sm">{L.noAspects}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-text-secondary text-xs uppercase tracking-wide border-b border-gold-primary/10">
                        <th className="text-left px-4 py-3">{tl({ en: 'Transit', hi: 'गोचर', ta: 'கோசார', bn: 'গোচর' }, locale)}</th>
                        <th className="text-left px-4 py-3">{L.aspect}</th>
                        <th className="text-left px-4 py-3">{tl({ en: 'Natal', hi: 'जन्म', ta: 'ஜன்ம', bn: 'জন্ম' }, locale)}</th>
                        <th className="text-right px-4 py-3">{L.orb}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.aspects.slice(0, 20).map((asp, i) => {
                        const aspectColor =
                          asp.aspect === 'Trine' || asp.aspect === 'Sextile'
                            ? 'text-emerald-400'
                            : asp.aspect === 'Opposition' || asp.aspect === 'Square'
                            ? 'text-red-400'
                            : 'text-gold-light';
                        return (
                          <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                            <td className="px-4 py-2.5 font-medium text-text-primary">{asp.transitPlanet}</td>
                            <td className={`px-4 py-2.5 font-semibold ${aspectColor}`}>{asp.aspect}</td>
                            <td className="px-4 py-2.5 text-text-secondary">{asp.natalPlanet}</td>
                            <td className="px-4 py-2.5 text-right text-text-secondary/70 text-xs">{asp.orb}°</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Notable conditions */}
            {result.notableConditions.length > 0 && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                <h2 className="text-amber-400 font-semibold text-sm mb-3" style={hf}>
                  {L.notableTitle}
                </h2>
                <ul className="space-y-2">
                  {result.notableConditions.map((cond, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      {cond}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
