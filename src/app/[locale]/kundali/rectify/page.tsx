'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Trash2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import LocationSearch from '@/components/ui/LocationSearch';
import UsageLimitBanner from '@/components/ui/UsageLimitBanner';
import { authedFetch } from '@/lib/api/authed-fetch';
import { parseGateError, type GateError } from '@/lib/api/parse-gate-error';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/types/panchang';
import type { RectificationResult, LifeEvent } from '@/lib/rectification/types';

// ---------------------------------------------------------------------------
// Static labels (inline i18n — Lesson I: no new namespace needed)
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: 'Birth Time Rectification',
    subtitle: 'Supply known life events to narrow down your true birth time using Vimshottari Dasha house activations.',
    howItWorks: 'How it works',
    howItWorksBody:
      'The engine generates up to 180 candidate birth times across a ±90-minute search window, computes the full Vimshottari Dasha sequence for each, then scores how well each dasha lord activates the houses associated with your life events. The top 3 candidates are returned ranked by confidence.',
    birthDate: 'Birth date',
    birthPlace: 'Birth place',
    birthPlacePlaceholder: 'Search for a city…',
    approxTime: 'Approximate time (optional)',
    approxTimeHint: 'If you know an approximate time (±90 min search)',
    lifeEvents: 'Life events',
    lifeEventsHint: 'Add at least 1 known life event. More events = higher accuracy.',
    addEvent: 'Add event',
    eventType: 'Event type',
    eventDate: 'Event date',
    remove: 'Remove',
    rectifyBtn: 'Rectify Birth Time',
    loading: 'Analysing…',
    needPlace: 'Please select a birth place first.',
    needEvents: 'Please add at least one life event.',
    needDate: 'Please enter a valid birth date.',
    errorGeneric: 'Rectification failed. Please try again.',
    candidatesEvaluated: (n: number, from: string, to: string) =>
      `${n} candidates evaluated · search window ${from} – ${to}`,
    topCandidates: 'Top candidates',
    bestMatch: '#1 Best Match',
    lagna: 'Lagna',
    confidence: 'Confidence',
    eventMatches: 'Event matches',
    score: 'Score',
    insufficientMsg:
      'Not enough signal to determine a confident result. Try adding more life events (marriage, career change, health events, etc.) for a better match.',
    strengthLabels: {
      strong: 'Strong match',
      moderate: 'Moderate match',
      ambiguous: 'Ambiguous',
      insufficient: 'Insufficient data',
    },
  },
  hi: {
    title: 'जन्म समय सुधार',
    subtitle: 'विमशोत्तरी दशा के माध्यम से जीवन की प्रमुख घटनाओं द्वारा आपका सटीक जन्म समय निर्धारित करें।',
    howItWorks: 'यह कैसे काम करता है',
    howItWorksBody:
      'इंजन ±90 मिनट की खिड़की में 180 संभावित जन्म समय बनाता है, प्रत्येक के लिए विमशोत्तरी दशा क्रम की गणना करता है, फिर देखता है कि प्रत्येक दशानाथ आपके जीवन की घटनाओं से संबंधित भावों को कितनी अच्छी तरह सक्रिय करता है।',
    birthDate: 'जन्म तिथि',
    birthPlace: 'जन्म स्थान',
    birthPlacePlaceholder: 'शहर खोजें…',
    approxTime: 'अनुमानित समय (वैकल्पिक)',
    approxTimeHint: 'यदि अनुमानित समय पता हो (±90 मिनट)',
    lifeEvents: 'जीवन की घटनाएँ',
    lifeEventsHint: 'कम से कम 1 घटना जोड़ें। अधिक घटनाएँ = अधिक सटीकता।',
    addEvent: 'घटना जोड़ें',
    eventType: 'घटना का प्रकार',
    eventDate: 'घटना की तिथि',
    remove: 'हटाएँ',
    rectifyBtn: 'जन्म समय सुधारें',
    loading: 'विश्लेषण हो रहा है…',
    needPlace: 'कृपया पहले जन्म स्थान चुनें।',
    needEvents: 'कृपया कम से कम एक घटना जोड़ें।',
    needDate: 'कृपया सही जन्म तिथि दर्ज करें।',
    errorGeneric: 'सुधार विफल हुआ। पुनः प्रयास करें।',
    candidatesEvaluated: (n: number, from: string, to: string) =>
      `${n} उम्मीदवारों का मूल्यांकन · खोज सीमा ${from} – ${to}`,
    topCandidates: 'शीर्ष उम्मीदवार',
    bestMatch: '#1 सर्वोत्तम मिलान',
    lagna: 'लग्न',
    confidence: 'विश्वास',
    eventMatches: 'घटना मिलान',
    score: 'स्कोर',
    insufficientMsg:
      'पर्याप्त संकेत नहीं मिले। बेहतर परिणाम के लिए और जीवन घटनाएँ जोड़ें।',
    strengthLabels: {
      strong: 'मजबूत मिलान',
      moderate: 'मध्यम मिलान',
      ambiguous: 'अस्पष्ट',
      insufficient: 'अपर्याप्त डेटा',
    },
  },
  ta: {
    title: 'பிறப்பு நேர சரிசெய்தல்',
    subtitle: 'விம்சோத்தரி தசை மூலம் உங்கள் சரியான பிறப்பு நேரத்தை கண்டறியுங்கள்.',
    howItWorks: 'இது எவ்வாறு செயல்படுகிறது',
    howItWorksBody:
      '±90 நிமிட தேடல் சாளரத்தில் 180 வேட்பாளர் நேரங்கள் உருவாக்கப்படுகின்றன, ஒவ்வொன்றிற்கும் தசை வரிசை கணக்கிடப்படுகிறது.',
    birthDate: 'பிறந்த தேதி',
    birthPlace: 'பிறந்த இடம்',
    birthPlacePlaceholder: 'நகரத்தைத் தேடுங்கள்…',
    approxTime: 'தோராயமான நேரம் (விருப்பத்தேர்வு)',
    approxTimeHint: 'தோராயமான நேரம் தெரிந்தால் (±90 நிமிடம்)',
    lifeEvents: 'வாழ்க்கை நிகழ்வுகள்',
    lifeEventsHint: 'குறைந்தது 1 நிகழ்வை சேர்க்கவும்.',
    addEvent: 'நிகழ்வை சேர்க்கவும்',
    eventType: 'நிகழ்வு வகை',
    eventDate: 'நிகழ்வு தேதி',
    remove: 'நீக்கு',
    rectifyBtn: 'பிறப்பு நேரத்தை சரிசெய்',
    loading: 'பகுப்பாய்வு செய்கிறது…',
    needPlace: 'முதலில் பிறந்த இடத்தைத் தேர்ந்தெடுக்கவும்.',
    needEvents: 'குறைந்தது ஒரு நிகழ்வை சேர்க்கவும்.',
    needDate: 'சரியான பிறந்த தேதியை உள்ளிடவும்.',
    errorGeneric: 'சரிசெய்தல் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    candidatesEvaluated: (n: number, from: string, to: string) =>
      `${n} வேட்பாளர்கள் மதிப்பிடப்பட்டனர் · தேடல் சாளரம் ${from} – ${to}`,
    topCandidates: 'சிறந்த வேட்பாளர்கள்',
    bestMatch: '#1 சிறந்த பொருத்தம்',
    lagna: 'லக்னம்',
    confidence: 'நம்பகத்தன்மை',
    eventMatches: 'நிகழ்வு பொருத்தங்கள்',
    score: 'மதிப்பெண்',
    insufficientMsg:
      'போதுமான தகவல் இல்லை. அதிக நிகழ்வுகளை சேர்க்கவும்.',
    strengthLabels: {
      strong: 'வலுவான பொருத்தம்',
      moderate: 'மிதமான பொருத்தம்',
      ambiguous: 'தெளிவற்றது',
      insufficient: 'போதுமான தரவு இல்லை',
    },
  },
  bn: {
    title: 'জন্মকাল সংশোধন',
    subtitle: 'বিংশোত্তরী দশা দ্বারা জীবনের ঘটনাগুলি ব্যবহার করে আপনার প্রকৃত জন্মসময় নির্ণয় করুন।',
    howItWorks: 'এটি কীভাবে কাজ করে',
    howItWorksBody:
      '±90 মিনিটের অনুসন্ধান উইন্ডোতে 180টি প্রার্থী জন্মসময় তৈরি হয়, প্রতিটির জন্য দশা ক্রম গণনা করা হয়।',
    birthDate: 'জন্ম তারিখ',
    birthPlace: 'জন্মস্থান',
    birthPlacePlaceholder: 'শহর অনুসন্ধান করুন…',
    approxTime: 'আনুমানিক সময় (ঐচ্ছিক)',
    approxTimeHint: 'আনুমানিক সময় জানা থাকলে (±90 মিনিট)',
    lifeEvents: 'জীবনের ঘটনা',
    lifeEventsHint: 'কমপক্ষে ১টি ঘটনা যোগ করুন।',
    addEvent: 'ঘটনা যোগ করুন',
    eventType: 'ঘটনার ধরন',
    eventDate: 'ঘটনার তারিখ',
    remove: 'সরান',
    rectifyBtn: 'জন্মকাল সংশোধন করুন',
    loading: 'বিশ্লেষণ চলছে…',
    needPlace: 'প্রথমে জন্মস্থান নির্বাচন করুন।',
    needEvents: 'কমপক্ষে একটি ঘটনা যোগ করুন।',
    needDate: 'সঠিক জন্ম তারিখ লিখুন।',
    errorGeneric: 'সংশোধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    candidatesEvaluated: (n: number, from: string, to: string) =>
      `${n} প্রার্থী মূল্যায়িত · অনুসন্ধান উইন্ডো ${from} – ${to}`,
    topCandidates: 'শীর্ষ প্রার্থী',
    bestMatch: '#1 সর্বোত্তম মিল',
    lagna: 'লগ্ন',
    confidence: 'আস্থা',
    eventMatches: 'ঘটনার মিল',
    score: 'স্কোর',
    insufficientMsg: 'যথেষ্ট তথ্য নেই। আরও ঘটনা যোগ করুন।',
    strengthLabels: {
      strong: 'শক্তিশালী মিল',
      moderate: 'মাঝারি মিল',
      ambiguous: 'অস্পষ্ট',
      insufficient: 'অপর্যাপ্ত তথ্য',
    },
  },
};

type LabelSet = typeof LABELS.en;

function getLabels(locale: string): LabelSet {
  return (LABELS as Record<string, LabelSet>)[locale] ?? LABELS.en;
}

// ---------------------------------------------------------------------------
// Event type display labels
// ---------------------------------------------------------------------------
const EVENT_TYPE_LABELS: Record<LifeEvent['type'], { en: string; hi: string; ta: string; bn: string }> = {
  marriage:        { en: 'Marriage',         hi: 'विवाह',           ta: 'திருமணம்',          bn: 'বিবাহ' },
  child_birth:     { en: 'Child Birth',      hi: 'संतान जन्म',      ta: 'குழந்தை பிறப்பு',   bn: 'সন্তান জন্ম' },
  career_change:   { en: 'Career Change',    hi: 'करियर परिवर्तन',  ta: 'தொழில் மாற்றம்',    bn: 'কর্মজীবন পরিবর্তন' },
  illness:         { en: 'Major Illness',    hi: 'गंभीर बीमारी',    ta: 'கடுமையான நோய்',     bn: 'গুরুতর অসুস্থতা' },
  parent_death:    { en: "Parent's Death",   hi: 'माता/पिता का निधन', ta: 'பெற்றோர் மரணம்',  bn: 'পিতামাতার মৃত্যু' },
  relocation:      { en: 'Relocation',       hi: 'स्थान परिवर्तन',  ta: 'இடமாற்றம்',         bn: 'স্থানান্তর' },
  financial_gain:  { en: 'Financial Gain',   hi: 'आर्थिक लाभ',      ta: 'நிதி ஆதாயம்',       bn: 'আর্থিক লাভ' },
  financial_loss:  { en: 'Financial Loss',   hi: 'आर्थिक हानि',     ta: 'நிதி இழப்பு',       bn: 'আর্থিক ক্ষতি' },
  education:       { en: 'Education',        hi: 'शिक्षा',           ta: 'கல்வி',              bn: 'শিক্ষা' },
};

const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as LifeEvent['type'][];

function eventLabel(type: LifeEvent['type'], locale: string): string {
  const row = EVENT_TYPE_LABELS[type];
  return (row as Record<string, string>)[locale] ?? row.en;
}

// ---------------------------------------------------------------------------
// Strength badge colours
// ---------------------------------------------------------------------------
const STRENGTH_COLORS: Record<RectificationResult['strength'], string> = {
  strong:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  moderate:    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  ambiguous:   'bg-orange-500/15 text-orange-400 border-orange-500/30',
  insufficient:'bg-red-500/15 text-red-400 border-red-500/30',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface EventRowProps {
  index: number;
  event: { type: LifeEvent['type']; date: string };
  locale: string;
  t: LabelSet;
  onChange: (index: number, field: 'type' | 'date', value: string) => void;
  onRemove: (index: number) => void;
}

function EventRow({ index, event, locale, t, onChange, onRemove }: EventRowProps) {
  const isDevanagari = isDevanagariLocale(locale);
  return (
    <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-xl bg-[#0a0e27]/60 border border-gold-primary/10">
      <div className="flex-1">
        <label className="text-text-secondary text-xs mb-1 block">{t.eventType}</label>
        <select
          value={event.type}
          onChange={e => onChange(index, 'type', e.target.value)}
          className={`w-full px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm focus:border-gold-primary/40 focus:outline-none ${isDevanagari ? 'font-[var(--font-devanagari-body)]' : ''}`}
        >
          {EVENT_TYPES.map(type => (
            <option key={type} value={type}>
              {eventLabel(type, locale)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="text-text-secondary text-xs mb-1 block">{t.eventDate}</label>
        <input
          type="date"
          value={event.date}
          onChange={e => onChange(index, 'date', e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm focus:border-gold-primary/40 focus:outline-none"
        />
      </div>
      <div className="flex items-end pb-0.5">
        <button
          onClick={() => onRemove(index)}
          aria-label={t.remove}
          className="p-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RectifyPage() {
  const locale = useLocale() as Locale;
  const t = getLabels(locale);
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);

  // --- Form state ---
  const [birthDate, setBirthDate] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);
  const [approxTime, setApproxTime] = useState('');

  const [events, setEvents] = useState<{ type: LifeEvent['type']; date: string }[]>([
    { type: 'marriage', date: '' },
  ]);

  // --- Result state ---
  const [result, setResult] = useState<RectificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gateError, setGateError] = useState<GateError | null>(null);

  // --- UI state ---
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // --- Event list handlers ---
  const addEvent = () => {
    setEvents(prev => [...prev, { type: 'career_change', date: '' }]);
  };

  const removeEvent = (index: number) => {
    setEvents(prev => prev.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: 'type' | 'date', value: string) => {
    setEvents(prev => prev.map((ev, i) => i === index ? { ...ev, [field]: value } : ev));
  };

  // --- Submit ---
  const handleRectify = async () => {
    setError(null);
    setGateError(null);
    setResult(null);

    if (!birthDate) {
      setError(t.needDate);
      return;
    }
    if (placeLat === null || placeLng === null || !placeTimezone) {
      setError(t.needPlace);
      return;
    }
    if (events.length === 0) {
      setError(t.needEvents);
      return;
    }
    // Validate all event dates are filled
    for (const ev of events) {
      if (!ev.date) {
        setError('Please fill in the date for all life events.');
        return;
      }
    }

    const [y, m, d] = birthDate.split('-').map(Number);
    const tzOffset = getUTCOffsetForDate(y, m, d, placeTimezone);

    setLoading(true);
    try {
      const res = await authedFetch('/api/rectification', {
        method: 'POST',
        body: JSON.stringify({
          birthDate,
          birthLat: placeLat,
          birthLng: placeLng,
          birthTimezone: tzOffset,
          approximateTime: approxTime || undefined,
          events: events.map(ev => ({ type: ev.type, date: ev.date })),
        }),
      });

      // Handle gate errors (403/429)
      const gate = await parseGateError(res.clone());
      if (gate) {
        setGateError(gate);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? t.errorGeneric);
        return;
      }

      const data: RectificationResult = await res.json();
      setResult(data);
      // Expand first candidate by default
      setExpandedCandidate(0);
    } catch (err) {
      console.error('[rectify] fetch failed:', err);
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* ── Hero ── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-gold-primary/10 border border-gold-primary/20">
                <Clock className="w-9 h-9 text-gold-primary" />
              </div>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-gold-light mb-3"
              style={headingFont}
            >
              {t.title}
            </h1>
            <p className="text-text-secondary text-sm max-w-md mx-auto leading-relaxed" style={bodyFont}>
              {t.subtitle}
            </p>
            <Link
              href="/kundali"
              className="text-xs text-gold-primary/60 hover:text-gold-primary mt-3 inline-block transition-colors"
            >
              ← Back to Kundali
            </Link>
          </div>

          {/* How it works accordion */}
          <div className="mb-6 rounded-xl bg-[#1a1040]/40 border border-gold-primary/10 overflow-hidden">
            <button
              onClick={() => setShowHowItWorks(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-gold-light/80 hover:text-gold-light transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Info className="w-4 h-4 text-gold-primary/60" />
                {t.howItWorks}
              </span>
              {showHowItWorks
                ? <ChevronUp className="w-4 h-4 text-gold-primary/60" />
                : <ChevronDown className="w-4 h-4 text-gold-primary/60" />}
            </button>
            <AnimatePresence>
              {showHowItWorks && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                    {t.howItWorksBody}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Form card ── */}
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-6">

            {/* Birth date */}
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">
                {t.birthDate}
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm focus:border-gold-primary/40 focus:outline-none"
              />
            </div>

            {/* Birth place */}
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">
                {t.birthPlace}
              </label>
              <LocationSearch
                value={placeName}
                onSelect={loc => {
                  setPlaceName(loc.name);
                  setPlaceLat(loc.lat);
                  setPlaceLng(loc.lng);
                  setPlaceTimezone(loc.timezone);
                }}
                placeholder={t.birthPlacePlaceholder}
              />
            </div>

            {/* Approximate time */}
            <div>
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1">
                {t.approxTime}
              </label>
              <p className="text-text-secondary text-xs mb-2">{t.approxTimeHint}</p>
              <input
                type="time"
                value={approxTime}
                onChange={e => setApproxTime(e.target.value)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-primary text-sm focus:border-gold-primary/40 focus:outline-none"
              />
            </div>

            {/* Life events */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold">
                  {t.lifeEvents}
                </label>
                <span className="text-text-secondary text-xs">{events.length} added</span>
              </div>
              <p className="text-text-secondary text-xs mb-3">{t.lifeEventsHint}</p>

              <div className="space-y-2">
                {events.map((ev, i) => (
                  <EventRow
                    key={i}
                    index={i}
                    event={ev}
                    locale={locale}
                    t={t}
                    onChange={updateEvent}
                    onRemove={removeEvent}
                  />
                ))}
              </div>

              <button
                onClick={addEvent}
                className="mt-3 flex items-center gap-1.5 text-gold-primary/70 hover:text-gold-primary text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t.addEvent}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Gate error */}
            {gateError && (
              <UsageLimitBanner
                type={gateError.type}
                feature={gateError.feature}
                featureName={gateError.featureName}
                requiredTier={gateError.requiredTier}
                limit={gateError.limit}
                message={gateError.message}
                source="rectify-page"
              />
            )}

            {/* Submit */}
            <button
              onClick={handleRectify}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-primary text-bg-primary font-bold text-sm hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t.loading : t.rectifyBtn}
            </button>
          </div>

          {/* ── Results ── */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.4, ease: 'easeOut' as const }}
                className="mt-8 space-y-4"
              >
                {/* Summary bar */}
                <div className="flex flex-wrap items-center gap-3 px-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${STRENGTH_COLORS[result.strength]}`}>
                    {t.strengthLabels[result.strength]}
                  </span>
                  <span className="text-text-secondary text-xs">
                    {t.candidatesEvaluated(
                      result.candidatesEvaluated,
                      result.searchWindow.from,
                      result.searchWindow.to
                    )}
                  </span>
                </div>

                {/* Insufficient data message */}
                {result.strength === 'insufficient' && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-300 text-sm leading-relaxed">
                    {t.insufficientMsg}
                  </div>
                )}

                {/* Top candidates */}
                {result.candidates.length > 0 && (
                  <div>
                    <h2
                      className="text-gold-light font-semibold text-lg mb-3"
                      style={headingFont}
                    >
                      {t.topCandidates}
                    </h2>

                    <div className="space-y-3">
                      {result.candidates.map((candidate, idx) => {
                        const isExpanded = expandedCandidate === idx;
                        const isBest = idx === 0;

                        return (
                          <motion.div
                            key={`${candidate.birthTime}-${idx}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className={`rounded-2xl border overflow-hidden ${
                              isBest
                                ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] border-gold-primary/30'
                                : 'bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border-gold-primary/12'
                            }`}
                          >
                            {/* Card header — clickable to expand */}
                            <button
                              onClick={() => setExpandedCandidate(isExpanded ? null : idx)}
                              className="w-full text-left p-5"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  {/* Best match badge */}
                                  {isBest && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gold-primary/20 border border-gold-primary/40 text-gold-light text-xs font-bold mb-2">
                                      {t.bestMatch}
                                    </span>
                                  )}

                                  {/* Time — large */}
                                  <div className="text-3xl font-mono font-black text-gold-light leading-none mb-2">
                                    {candidate.birthTime}
                                  </div>

                                  {/* Lagna */}
                                  <div className="text-text-secondary text-xs">
                                    {t.lagna}:{' '}
                                    <span className="text-text-primary font-medium">
                                      {candidate.lagnaSignName.en}
                                    </span>
                                    {isDevanagari && candidate.lagnaSignName.hi && (
                                      <span className="ml-1 text-text-secondary font-[var(--font-devanagari-body)]">
                                        ({candidate.lagnaSignName.hi})
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Confidence */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                  <span className="text-text-secondary text-xs">{t.confidence}</span>
                                  <span className="text-gold-light text-2xl font-bold font-mono">
                                    {candidate.confidence}%
                                  </span>
                                  {/* Confidence bar */}
                                  <div className="w-24 h-1.5 rounded-full bg-gold-primary/10">
                                    <div
                                      className="h-full rounded-full bg-gold-primary transition-all duration-700"
                                      style={{ width: `${candidate.confidence}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Expand toggle */}
                              <div className="flex items-center justify-end mt-3 text-gold-primary/50 hover:text-gold-primary transition-colors">
                                <span className="text-xs mr-1">{t.eventMatches}</span>
                                {isExpanded
                                  ? <ChevronUp className="w-3.5 h-3.5" />
                                  : <ChevronDown className="w-3.5 h-3.5" />}
                              </div>
                            </button>

                            {/* Event matches — expandable */}
                            <AnimatePresence>
                              {isExpanded && candidate.eventMatches.length > 0 && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="border-t border-gold-primary/10 px-5 py-4 space-y-3">
                                    {candidate.eventMatches.map((match, mIdx) => (
                                      <div key={mIdx} className="flex items-start gap-3">
                                        {/* Score badge */}
                                        <div className="shrink-0 flex flex-col items-center">
                                          <span className="text-xs font-bold text-gold-light font-mono">
                                            {match.score}/10
                                          </span>
                                          <span className="text-text-secondary text-[10px]">{t.score}</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-text-primary text-xs font-medium">
                                              {eventLabel(match.event.type, locale)}
                                            </span>
                                            <span className="text-text-secondary text-xs">
                                              {match.event.date}
                                            </span>
                                          </div>
                                          <p
                                            className="text-text-secondary text-xs mt-0.5 leading-relaxed"
                                            style={bodyFont}
                                          >
                                            {isDevanagari
                                              ? match.reason.hi
                                              : match.reason.en}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </div>
  );
}
