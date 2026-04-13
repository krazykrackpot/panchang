import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-gravity.json';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */

const TIMELINE = [
  {
    year: '505 CE',
    person: 'Varahamihira',
    text: { en: 'Pancha Siddhantika: Earth attracts objects, force varies with distance', hi: 'पंचसिद्धांतिका: पृथ्वी वस्तुओं को आकर्षित करती है, बल दूरी के साथ बदलता है', sa: 'पंचसिद्धांतिका: पृथ्वी वस्तुओं को आकर्षित करती है, बल दूरी के साथ बदलता है', mai: 'पंचसिद्धांतिका: पृथ्वी वस्तुओं को आकर्षित करती है, बल दूरी के साथ बदलता है', mr: 'पंचसिद्धांतिका: पृथ्वी वस्तुओं को आकर्षित करती है, बल दूरी के साथ बदलता है', ta: 'Pancha Siddhantika: Earth attracts objects, force varies with distance', te: 'Pancha Siddhantika: Earth attracts objects, force varies with distance', bn: 'Pancha Siddhantika: Earth attracts objects, force varies with distance', kn: 'Pancha Siddhantika: Earth attracts objects, force varies with distance', gu: 'Pancha Siddhantika: Earth attracts objects, force varies with distance' },
    color: '#f0d48a',
    gap: { en: '1,182 years before Newton', hi: 'न्यूटन से 1,182 वर्ष पहले', sa: 'न्यूटन से 1,182 वर्ष पहले', mai: 'न्यूटन से 1,182 वर्ष पहले', mr: 'न्यूटन से 1,182 वर्ष पहले', ta: '1,182 years before Newton', te: '1,182 years before Newton', bn: '1,182 years before Newton', kn: '1,182 years before Newton', gu: '1,182 years before Newton' },
  },
  {
    year: '628 CE',
    person: 'Brahmagupta',
    text: { en: 'Brahmasphutasiddhanta: "In the nature of the earth to attract bodies"', hi: 'ब्रह्मस्फुटसिद्धांत: "पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना"', sa: 'ब्रह्मस्फुटसिद्धांत: "पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना"', mai: 'ब्रह्मस्फुटसिद्धांत: "पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना"', mr: 'ब्रह्मस्फुटसिद्धांत: "पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना"', ta: 'Brahmasphutasiddhanta: "In the nature of the earth to attract bodies"', te: 'Brahmasphutasiddhanta: "In the nature of the earth to attract bodies"', bn: 'Brahmasphutasiddhanta: "In the nature of the earth to attract bodies"', kn: 'Brahmasphutasiddhanta: "In the nature of the earth to attract bodies"', gu: 'Brahmasphutasiddhanta: "In the nature of the earth to attract bodies"' },
    color: '#60a5fa',
    gap: { en: '1,059 years before Newton', hi: 'न्यूटन से 1,059 वर्ष पहले', sa: 'न्यूटन से 1,059 वर्ष पहले', mai: 'न्यूटन से 1,059 वर्ष पहले', mr: 'न्यूटन से 1,059 वर्ष पहले', ta: '1,059 years before Newton', te: '1,059 years before Newton', bn: '1,059 years before Newton', kn: '1,059 years before Newton', gu: '1,059 years before Newton' },
  },
  {
    year: '1150 CE',
    person: 'Bhaskaracharya II',
    text: { en: 'Siddhanta Shiromani: "Earth draws things downward by its own power"', hi: 'सिद्धांत शिरोमणि: "पृथ्वी अपनी शक्ति से वस्तुओं को नीचे खींचती है"', sa: 'सिद्धांत शिरोमणि: "पृथ्वी अपनी शक्ति से वस्तुओं को नीचे खींचती है"', mai: 'सिद्धांत शिरोमणि: "पृथ्वी अपनी शक्ति से वस्तुओं को नीचे खींचती है"', mr: 'सिद्धांत शिरोमणि: "पृथ्वी अपनी शक्ति से वस्तुओं को नीचे खींचती है"', ta: 'Siddhanta Shiromani: "Earth draws things downward by its own power"', te: 'Siddhanta Shiromani: "Earth draws things downward by its own power"', bn: 'Siddhanta Shiromani: "Earth draws things downward by its own power"', kn: 'Siddhanta Shiromani: "Earth draws things downward by its own power"', gu: 'Siddhanta Shiromani: "Earth draws things downward by its own power"' },
    color: '#a78bfa',
    gap: { en: '537 years before Newton', hi: 'न्यूटन से 537 वर्ष पहले', sa: 'न्यूटन से 537 वर्ष पहले', mai: 'न्यूटन से 537 वर्ष पहले', mr: 'न्यूटन से 537 वर्ष पहले', ta: '537 years before Newton', te: '537 years before Newton', bn: '537 years before Newton', kn: '537 years before Newton', gu: '537 years before Newton' },
  },
  {
    year: '1590s CE',
    person: 'Galileo',
    text: { en: 'Demonstrates objects fall at same rate regardless of mass (Tower of Pisa)', hi: 'दर्शाते हैं वस्तुएँ द्रव्यमान की परवाह किए बिना एक ही दर से गिरती हैं', sa: 'दर्शाते हैं वस्तुएँ द्रव्यमान की परवाह किए बिना एक ही दर से गिरती हैं', mai: 'दर्शाते हैं वस्तुएँ द्रव्यमान की परवाह किए बिना एक ही दर से गिरती हैं', mr: 'दर्शाते हैं वस्तुएँ द्रव्यमान की परवाह किए बिना एक ही दर से गिरती हैं', ta: 'Demonstrates objects fall at same rate regardless of mass (Tower of Pisa)', te: 'Demonstrates objects fall at same rate regardless of mass (Tower of Pisa)', bn: 'Demonstrates objects fall at same rate regardless of mass (Tower of Pisa)', kn: 'Demonstrates objects fall at same rate regardless of mass (Tower of Pisa)', gu: 'Demonstrates objects fall at same rate regardless of mass (Tower of Pisa)' },
    color: '#f87171',
    gap: { en: '~100 years before Newton', hi: 'न्यूटन से ~100 वर्ष पहले', sa: 'न्यूटन से ~100 वर्ष पहले', mai: 'न्यूटन से ~100 वर्ष पहले', mr: 'न्यूटन से ~100 वर्ष पहले', ta: '~100 years before Newton', te: '~100 years before Newton', bn: '~100 years before Newton', kn: '~100 years before Newton', gu: '~100 years before Newton' },
  },
  {
    year: '1687 CE',
    person: 'Isaac Newton',
    text: { en: 'Principia Mathematica: F = Gm₁m₂/r² — the quantitative law of universal gravitation', hi: 'प्रिंसिपिया मैथमेटिका: F = Gm₁m₂/r² — सार्वभौमिक गुरुत्वाकर्षण का मात्रात्मक नियम', sa: 'प्रिंसिपिया मैथमेटिका: F = Gm₁m₂/r² — सार्वभौमिक गुरुत्वाकर्षण का मात्रात्मक नियम', mai: 'प्रिंसिपिया मैथमेटिका: F = Gm₁m₂/r² — सार्वभौमिक गुरुत्वाकर्षण का मात्रात्मक नियम', mr: 'प्रिंसिपिया मैथमेटिका: F = Gm₁m₂/r² — सार्वभौमिक गुरुत्वाकर्षण का मात्रात्मक नियम', ta: 'Principia Mathematica: F = Gm₁m₂/r² — the quantitative law of universal gravitation', te: 'Principia Mathematica: F = Gm₁m₂/r² — the quantitative law of universal gravitation', bn: 'Principia Mathematica: F = Gm₁m₂/r² — the quantitative law of universal gravitation', kn: 'Principia Mathematica: F = Gm₁m₂/r² — the quantitative law of universal gravitation', gu: 'Principia Mathematica: F = Gm₁m₂/r² — the quantitative law of universal gravitation' },
    color: '#34d399',
    gap: null,
  },
];

const THINKERS = [
  {
    name: 'Varahamihira',
    dates: '505–587 CE',
    work: 'Pancha Siddhantika',
    quote: {
      en: 'Objects are attracted to Earth; the force keeps them from flying off the surface.',
      hi: 'वस्तुएँ पृथ्वी की ओर आकर्षित होती हैं; बल उन्हें सतह से उड़ने से रोकता है।',
    },
    color: '#f0d48a',
  },
  {
    name: 'Brahmagupta',
    dates: '598–668 CE',
    work: 'Brahmasphutasiddhanta',
    quote: {
      en: '"Bodies fall towards the earth as it is in the nature of the earth to attract bodies."',
      hi: '"वस्तुएँ पृथ्वी की ओर गिरती हैं क्योंकि पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना है।"',
    },
    color: '#60a5fa',
  },
  {
    name: 'Bhaskaracharya II',
    dates: '1114–1185 CE',
    work: 'Siddhanta Shiromani',
    quote: {
      en: '"The Earth draws things downward by its own power." (Goladhyaya, ~1150 CE)',
      hi: '"पृथ्वी अपनी शक्ति से वस्तुओं को नीचे खींचती है।" (गोलाध्याय, ~1150 CE)',
    },
    color: '#a78bfa',
  },
];

const GRAVITY_CONNECTIONS = [
  {
    topic: { en: "Moon's orbit speed", hi: 'चंद्रमा की कक्षीय गति', sa: 'चंद्रमा की कक्षीय गति', mai: 'चंद्रमा की कक्षीय गति', mr: 'चंद्रमा की कक्षीय गति', ta: "Moon's orbit speed", te: "Moon's orbit speed", bn: "Moon's orbit speed", kn: "Moon's orbit speed", gu: "Moon's orbit speed" },
    detail: { en: "Determined by Earth's gravity → sets tithi length", hi: 'पृथ्वी के गुरुत्वाकर्षण द्वारा निर्धारित → तिथि की लंबाई निर्धारित करती है', sa: 'पृथ्वी के गुरुत्वाकर्षण द्वारा निर्धारित → तिथि की लंबाई निर्धारित करती है', mai: 'पृथ्वी के गुरुत्वाकर्षण द्वारा निर्धारित → तिथि की लंबाई निर्धारित करती है', mr: 'पृथ्वी के गुरुत्वाकर्षण द्वारा निर्धारित → तिथि की लंबाई निर्धारित करती है', ta: "Determined by Earth's gravity → sets tithi length", te: "Determined by Earth's gravity → sets tithi length", bn: "Determined by Earth's gravity → sets tithi length", kn: "Determined by Earth's gravity → sets tithi length", gu: "Determined by Earth's gravity → sets tithi length" },
  },
  {
    topic: { en: 'Eclipse paths', hi: 'ग्रहण मार्ग', sa: 'ग्रहण मार्ग', mai: 'ग्रहण मार्ग', mr: 'ग्रहण मार्ग', ta: 'Eclipse paths', te: 'Eclipse paths', bn: 'Eclipse paths', kn: 'Eclipse paths', gu: 'Eclipse paths' },
    detail: { en: "Moon's gravitational orbit → shadow geometry", hi: "चंद्रमा की गुरुत्वाकर्षण कक्षा → छाया ज्यामिति", sa: "चंद्रमा की गुरुत्वाकर्षण कक्षा → छाया ज्यामिति", mai: "चंद्रमा की गुरुत्वाकर्षण कक्षा → छाया ज्यामिति", mr: "चंद्रमा की गुरुत्वाकर्षण कक्षा → छाया ज्यामिति", ta: "Moon's gravitational orbit → shadow geometry", te: "Moon's gravitational orbit → shadow geometry", bn: "Moon's gravitational orbit → shadow geometry", kn: "Moon's gravitational orbit → shadow geometry", gu: "Moon's gravitational orbit → shadow geometry" },
  },
  {
    topic: { en: "Equation of time", hi: 'समय का समीकरण', sa: 'समय का समीकरण', mai: 'समय का समीकरण', mr: 'समय का समीकरण', ta: "Equation of time", te: "Equation of time", bn: "Equation of time", kn: "Equation of time", gu: "Equation of time" },
    detail: { en: "Earth's elliptical orbit (gravity) → sunrise correction", hi: "पृथ्वी की दीर्घवृत्तीय कक्षा (गुरुत्व) → सूर्योदय सुधार", sa: "पृथ्वी की दीर्घवृत्तीय कक्षा (गुरुत्व) → सूर्योदय सुधार", mai: "पृथ्वी की दीर्घवृत्तीय कक्षा (गुरुत्व) → सूर्योदय सुधार", mr: "पृथ्वी की दीर्घवृत्तीय कक्षा (गुरुत्व) → सूर्योदय सुधार", ta: "Earth's elliptical orbit (gravity) → sunrise correction", te: "Earth's elliptical orbit (gravity) → sunrise correction", bn: "Earth's elliptical orbit (gravity) → sunrise correction", kn: "Earth's elliptical orbit (gravity) → sunrise correction", gu: "Earth's elliptical orbit (gravity) → sunrise correction" },
  },
  {
    topic: { en: 'Precession / Ayanamsha', hi: 'अग्रगमन / अयनांश', sa: 'अग्रगमन / अयनांश', mai: 'अग्रगमन / अयनांश', mr: 'अग्रगमन / अयनांश', ta: 'Precession / Ayanamsha', te: 'Precession / Ayanamsha', bn: 'Precession / Ayanamsha', kn: 'Precession / Ayanamsha', gu: 'Precession / Ayanamsha' },
    detail: { en: "Gravity on Earth's equatorial bulge → 26,000 year cycle", hi: "पृथ्वी के भूमध्यरेखीय उभार पर गुरुत्व → 26,000 वर्ष का चक्र", sa: "पृथ्वी के भूमध्यरेखीय उभार पर गुरुत्व → 26,000 वर्ष का चक्र", mai: "पृथ्वी के भूमध्यरेखीय उभार पर गुरुत्व → 26,000 वर्ष का चक्र", mr: "पृथ्वी के भूमध्यरेखीय उभार पर गुरुत्व → 26,000 वर्ष का चक्र", ta: "Gravity on Earth's equatorial bulge → 26,000 year cycle", te: "Gravity on Earth's equatorial bulge → 26,000 year cycle", bn: "Gravity on Earth's equatorial bulge → 26,000 year cycle", kn: "Gravity on Earth's equatorial bulge → 26,000 year cycle", gu: "Gravity on Earth's equatorial bulge → 26,000 year cycle" },
  },
];

export default async function GravityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const l = (obj: LocaleText | Record<string, string>) => lt(obj as LocaleText, locale);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{t('title')}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{t('subtitle')}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={t('title')} locale={locale} />
        </div>
      </div>

      {/* ── The Three Thinkers ───────────────────────────────────── */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {THINKERS.map((t, i) => (
          <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-full mb-3 flex items-center justify-center text-[#0a0e27] font-bold text-sm" style={{ background: t.color }}>
              {t.dates.split('–')[0].replace(' CE', '')}
            </div>
            <div className="text-text-primary font-bold text-base mb-0.5">{t.name}</div>
            <div className="text-text-secondary text-xs mb-2">{t.dates} · {t.work}</div>
            <p className="text-text-secondary text-xs italic leading-relaxed">{l(t.quote)}</p>
          </div>
        ))}
      </div>

      {/* ── Section 1: Bhaskaracharya ────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s1Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s1Body')}</p>

        {/* Sanskrit verse */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4">
          <p className="text-xs text-text-secondary mb-2 font-semibold">{t('s1Source')}</p>
          <p className="text-gold-light text-base font-mono leading-relaxed mb-3" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            {t('s1Sanskrit')}
          </p>
          <p className="text-text-secondary text-sm italic">{t('s1Translation')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Author', hi: 'लेखक', sa: 'लेखक', mai: 'लेखक', mr: 'लेखक', ta: 'Author', te: 'Author', bn: 'Author', kn: 'Author', gu: 'Author' }, value: 'Bhaskaracharya II' },
            { label: { en: 'Born', hi: 'जन्म', sa: 'जन्म', mai: 'जन्म', mr: 'जन्म', ta: 'Born', te: 'Born', bn: 'Born', kn: 'Born', gu: 'Born' }, value: '1114 CE' },
            { label: { en: 'Work', hi: 'ग्रंथ', sa: 'ग्रंथ', mai: 'ग्रंथ', mr: 'ग्रंथ', ta: 'Work', te: 'Work', bn: 'Work', kn: 'Work', gu: 'Work' }, value: 'Siddhanta Shiromani' },
            { label: { en: 'Before Newton', hi: 'न्यूटन से पहले', sa: 'न्यूटन से पहले', mai: 'न्यूटन से पहले', mr: 'न्यूटन से पहले', ta: 'Before Newton', te: 'Before Newton', bn: 'Before Newton', kn: 'Before Newton', gu: 'Before Newton' }, value: '537 years' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{l(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: Varahamihira ──────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s2Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{t('s2Body')}</p>
      </div>

      {/* ── Section 3: Brahmagupta ───────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s3Title')}</h3>
        <div className="p-5 rounded-xl bg-blue-500/8 border border-blue-500/20 mb-4">
          <p className="text-blue-200 font-semibold text-xs mb-2">{isHi ? 'ब्रह्मस्फुटसिद्धांत, 628 CE' : 'Brahmasphutasiddhanta, 628 CE'}</p>
          <p className="text-text-secondary text-sm italic leading-relaxed">{t('s3Quote')}</p>
        </div>
      </div>

      {/* ── Section 4: India vs Newton ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s4Title')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20">
            <p className="text-gold-light font-semibold text-sm mb-2">{isHi ? 'भारत — वर्णन (505-1150 CE)' : 'India — Description (505–1150 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{t('s4India')}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <p className="text-emerald-300 font-semibold text-sm mb-2">{isHi ? 'न्यूटन — मात्रात्मक नियम (1687 CE)' : 'Newton — Quantitative Law (1687 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{t('s4Newton')}</p>
          </div>
        </div>

        {/* F = Gm1m2/r2 visual */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 text-center">
          <p className="text-text-secondary text-xs mb-2">{isHi ? "न्यूटन का सूत्र — जो भारत में नहीं था" : "Newton's formula — what India did NOT have"}</p>
          <p className="text-text-primary text-2xl font-mono font-bold">F = G · m₁m₂ / r²</p>
          <p className="text-text-secondary text-xs mt-2">{isHi ? 'G = गुरुत्वाकर्षण स्थिरांक | r = दोनों द्रव्यमानों के बीच दूरी' : 'G = gravitational constant | r = distance between masses'}</p>
        </div>
      </div>

      {/* ── Section 5: App Connection ──────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s5Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s5Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GRAVITY_CONNECTIONS.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gold-primary flex-shrink-0 mt-1.5" />
              <div>
                <div className="text-text-primary text-sm font-semibold mb-1">{l(item.topic)}</div>
                <div className="text-text-secondary text-xs">{l(item.detail)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: Timeline ──────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-6" style={hf}>{t('s6Title')}</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gold-primary/20" />
          <div className="space-y-5">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-center z-10 border"
                  style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}
                >
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.year}</span>
                </div>
                <div className="pt-1 flex-1">
                  <div className="text-text-primary text-sm font-semibold">{item.person}</div>
                  <div className="text-text-secondary text-xs leading-relaxed mb-1">{l(item.text)}</div>
                  {item.gap && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/15">
                      {l(item.gap)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 7: Ujjain ───────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s7Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{t('s7Body')}</p>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {t('backLink')}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/speed-of-light" className="px-4 py-2 rounded-xl bg-gold-primary/10 border border-gold-primary/15 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
            ← {t('prevPage')}
          </Link>
          <Link href="/learn/contributions/sine" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('firstPage')} ↩
          </Link>
        </div>
      </div>

    </div>
  );
}
