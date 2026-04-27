'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { NATION_CHARTS } from '@/lib/mundane/nation-charts';
import { DOMAIN_LABELS } from '@/lib/mundane/constants';
import type { NationalForecastResult, DomainForecast, TransitEvent } from '@/lib/mundane/national-forecast';
import type { GreatConjunction } from '@/lib/mundane/great-conjunctions';

// ─── Inline labels (4 active locales: en, hi, ta, bn) ────────────────────────
const LABELS = {
  en: {
    title: 'Mundane Astrology',
    subtitle: 'National Charts · World Forecast · Great Conjunctions',
    desc: 'Explore foundation charts for nations, Jupiter-Saturn Great Conjunction cycles, and domain-by-domain world forecasts using Vedic mundane astrology.',
    disclaimer: 'Mundane astrology is a traditional framework for understanding collective trends. Forecasts reflect planetary symbolism, not literal predictions. For educational and self-awareness purposes only.',
    selectNation: 'Select a Nation',
    loading: 'Computing planetary forecast...',
    error: 'Forecast unavailable. Please try again.',
    chartSummary: 'National Chart Summary',
    foundingDate: 'Founding Date',
    capital: 'Capital',
    lagna: 'Lagna (Ascendant)',
    natalPlanets: 'Natal Planets',
    currentTransits: 'Active Transits',
    domainTitle: 'Domain Forecasts',
    domainDesc: 'Current planetary influences on each national domain',
    score: 'Score',
    transits: 'Transits',
    noTransits: 'No major transits active',
    overallTitle: 'Overall National Outlook',
    conjTitle: 'Jupiter-Saturn Great Conjunctions',
    conjDesc: 'The 20-year Jupiter-Saturn cycle marks epochal shifts in world history',
    past: 'Past Conjunctions',
    current: 'Current Era',
    upcoming: 'Upcoming Conjunctions',
    sign: 'Sign',
    element: 'Element',
    learnTitle: 'About Mundane Astrology',
    learnText: 'Mundane astrology is the branch of Vedic Jyotish concerned with nations, world events, and collective human experience. Rather than interpreting an individual birth chart, it reads the founding chart of a nation (its "birth" when it declared independence or was constituted), then applies current planetary transits to forecast trends across twelve domains of national life — from government and economy to public health and foreign relations.',
    learnText2: 'The most watched cycle is the Great Conjunction of Jupiter and Saturn, which recurs roughly every 20 years and marks long-term cultural, economic, and political eras. When they meet in a Fire sign (Aries, Leo, Sagittarius), idealism and expansion dominate. Earth signs bring materialism and consolidation; Air signs favour ideas and social change; Water signs bring emotional and spiritual currents.',
    source: 'Source',
    house: 'House',
    tone_excellent: 'Excellent', tone_good: 'Good', tone_neutral: 'Mixed', tone_caution: 'Caution', tone_challenging: 'Challenging',
    element_fire: 'Fire', element_earth: 'Earth', element_air: 'Air', element_water: 'Water',
    conjLoadError: 'Conjunction timeline unavailable.',
    conjLoading: 'Loading conjunction timeline...',
    planetNames: {
      0: 'Sun', 2: 'Mars', 4: 'Jupiter', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
    } as Record<number, string>,
  },
  hi: {
    title: 'मुण्डेन ज्योतिष',
    subtitle: 'राष्ट्रीय कुण्डलियाँ · विश्व पूर्वानुमान · महायोग',
    desc: 'वैदिक मुण्डेन ज्योतिष का उपयोग करके राष्ट्रों की जन्मकुण्डलियाँ, बृहस्पति-शनि महायोग और डोमेन-वार विश्व पूर्वानुमान देखें।',
    disclaimer: 'मुण्डेन ज्योतिष सामूहिक प्रवृत्तियों को समझने की एक पारम्परिक पद्धति है। पूर्वानुमान ग्रह प्रतीकवाद दर्शाते हैं, शाब्दिक भविष्यवाणी नहीं। केवल शैक्षिक उद्देश्यों के लिए।',
    selectNation: 'राष्ट्र चुनें',
    loading: 'ग्रह पूर्वानुमान गणना हो रही है...',
    error: 'पूर्वानुमान उपलब्ध नहीं। कृपया पुनः प्रयास करें।',
    chartSummary: 'राष्ट्रीय कुण्डली सारांश',
    foundingDate: 'स्थापना तिथि',
    capital: 'राजधानी',
    lagna: 'लग्न',
    natalPlanets: 'जन्म ग्रह',
    currentTransits: 'सक्रिय गोचर',
    domainTitle: 'डोमेन पूर्वानुमान',
    domainDesc: 'प्रत्येक राष्ट्रीय क्षेत्र पर वर्तमान ग्रह प्रभाव',
    score: 'अंक',
    transits: 'गोचर',
    noTransits: 'कोई प्रमुख गोचर सक्रिय नहीं',
    overallTitle: 'समग्र राष्ट्रीय दृष्टिकोण',
    conjTitle: 'बृहस्पति-शनि महायोग',
    conjDesc: '20-वर्षीय बृहस्पति-शनि चक्र विश्व इतिहास में युगान्तकारी परिवर्तनों का संकेत देता है',
    past: 'पूर्व महायोग',
    current: 'वर्तमान युग',
    upcoming: 'आगामी महायोग',
    sign: 'राशि',
    element: 'तत्त्व',
    learnTitle: 'मुण्डेन ज्योतिष के बारे में',
    learnText: 'मुण्डेन ज्योतिष वैदिक ज्योतिष की वह शाखा है जो राष्ट्रों, विश्व घटनाओं और सामूहिक मानव अनुभव से सम्बन्धित है। यह किसी राष्ट्र की स्थापना कुण्डली पर वर्तमान ग्रहों का गोचर देखकर उसके 12 जीवन क्षेत्रों — सरकार, अर्थव्यवस्था, जनस्वास्थ्य, विदेश सम्बन्ध आदि — में प्रवृत्तियों का पूर्वानुमान करती है।',
    learnText2: 'सबसे महत्त्वपूर्ण चक्र बृहस्पति-शनि का महायोग है जो लगभग 20 वर्षों में एक बार होता है और दीर्घकालिक सांस्कृतिक, आर्थिक एवं राजनीतिक युगों का संकेत देता है।',
    source: 'स्रोत',
    house: 'भाव',
    tone_excellent: 'उत्कृष्ट', tone_good: 'अनुकूल', tone_neutral: 'मिश्रित', tone_caution: 'सावधान', tone_challenging: 'कठिन',
    element_fire: 'अग्नि', element_earth: 'पृथ्वी', element_air: 'वायु', element_water: 'जल',
    conjLoadError: 'महायोग समयरेखा उपलब्ध नहीं।',
    conjLoading: 'महायोग समयरेखा लोड हो रही है...',
    planetNames: {
      0: 'सूर्य', 2: 'मंगल', 4: 'बृहस्पति', 6: 'शनि', 7: 'राहु', 8: 'केतु',
    } as Record<number, string>,
  },
  ta: {
    title: 'முண்டேன் ஜோதிடம்',
    subtitle: 'தேசிய ஜாதகங்கள் · உலக கணிப்பு · மஹா யோகம்',
    desc: 'வேத முண்டேன் ஜோதிடம் மூலம் நாடுகளின் ஜாதகங்கள், குரு-சனி மஹா யோக சுழற்சிகள் மற்றும் உலக கணிப்புகளை ஆராயுங்கள்.',
    disclaimer: 'முண்டேன் ஜோதிடம் கூட்டு போக்குகளை புரிந்துகொள்வதற்கான ஒரு பாரம்பரிய கட்டமைப்பு. கணிப்புகள் கிரக சின்னவியலை பிரதிபலிக்கின்றன. கல்வி மற்றும் சுய விழிப்புணர்வுக்காக மட்டுமே.',
    selectNation: 'நாட்டை தேர்ந்தெடுக்கவும்',
    loading: 'கிரக கணிப்பு கணக்கிடப்படுகிறது...',
    error: 'கணிப்பு கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.',
    chartSummary: 'தேசிய ஜாதக சுருக்கம்',
    foundingDate: 'நிறுவப்பட்ட தேதி',
    capital: 'தலைநகரம்',
    lagna: 'லக்னம்',
    natalPlanets: 'பிறப்பு கிரகங்கள்',
    currentTransits: 'செயலில் உள்ள கோச்சாரங்கள்',
    domainTitle: 'துறை கணிப்புகள்',
    domainDesc: 'ஒவ்வொரு தேசிய துறையிலும் தற்போதைய கிரக தாக்கங்கள்',
    score: 'மதிப்பெண்',
    transits: 'கோச்சாரங்கள்',
    noTransits: 'பெரிய கோச்சாரங்கள் இல்லை',
    overallTitle: 'ஒட்டுமொத்த தேசிய கணிப்பு',
    conjTitle: 'குரு-சனி மஹா யோகம்',
    conjDesc: '20 ஆண்டு குரு-சனி சுழற்சி உலக வரலாற்றில் யுக மாற்றங்களை குறிக்கிறது',
    past: 'கடந்த யோகங்கள்',
    current: 'தற்போதைய யுகம்',
    upcoming: 'வரவிருக்கும் யோகங்கள்',
    sign: 'ராசி',
    element: 'தத்துவம்',
    learnTitle: 'முண்டேன் ஜோதிடம் பற்றி',
    learnText: 'முண்டேன் ஜோதிடம் என்பது வேத ஜோதிடத்தின் கிளை, நாடுகள், உலக நிகழ்வுகள் மற்றும் கூட்டு மனித அனுபவம் பற்றியது.',
    learnText2: 'மிக முக்கியமான சுழற்சி குரு-சனி மஹா யோகம் ஆகும், இது சுமார் 20 ஆண்டுகளுக்கு ஒருமுறை நிகழ்கிறது.',
    source: 'ஆதாரம்',
    house: 'பாவம்',
    tone_excellent: 'சிறப்பானது', tone_good: 'சாதகமானது', tone_neutral: 'கலவையானது', tone_caution: 'எச்சரிக்கை', tone_challenging: 'சவாலானது',
    element_fire: 'நெருப்பு', element_earth: 'நிலம்', element_air: 'காற்று', element_water: 'நீர்',
    conjLoadError: 'யோக காலவரிசை கிடைக்கவில்லை.',
    conjLoading: 'யோக காலவரிசை ஏற்றப்படுகிறது...',
    planetNames: {
      0: 'சூரியன்', 2: 'செவ்வாய்', 4: 'குரு', 6: 'சனி', 7: 'ராகு', 8: 'கேது',
    } as Record<number, string>,
  },
  bn: {
    title: 'মুন্ডেন জ্যোতিষ',
    subtitle: 'জাতীয় জাতক · বিশ্ব পূর্বাভাস · মহাযোগ',
    desc: 'বৈদিক মুন্ডেন জ্যোতিষ ব্যবহার করে জাতির ভিত্তি জাতক, বৃহস্পতি-শনি মহাযোগ চক্র এবং বিশ্ব পূর্বাভাস অন্বেষণ করুন।',
    disclaimer: 'মুন্ডেন জ্যোতিষ সামগ্রিক প্রবণতা বোঝার একটি ঐতিহ্যবাহী কাঠামো। পূর্বাভাস গ্রহ প্রতীকতত্ত্ব প্রতিফলিত করে। শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে।',
    selectNation: 'একটি দেশ নির্বাচন করুন',
    loading: 'গ্রহ পূর্বাভাস গণনা হচ্ছে...',
    error: 'পূর্বাভাস পাওয়া যায়নি। আবার চেষ্টা করুন।',
    chartSummary: 'জাতীয় জাতক সারসংক্ষেপ',
    foundingDate: 'প্রতিষ্ঠার তারিখ',
    capital: 'রাজধানী',
    lagna: 'লগ্ন',
    natalPlanets: 'জন্ম গ্রহ',
    currentTransits: 'সক্রিয় গোচর',
    domainTitle: 'ডোমেইন পূর্বাভাস',
    domainDesc: 'প্রতিটি জাতীয় ডোমেইনে বর্তমান গ্রহ প্রভাব',
    score: 'স্কোর',
    transits: 'গোচর',
    noTransits: 'কোনো প্রধান গোচর সক্রিয় নেই',
    overallTitle: 'সামগ্রিক জাতীয় দৃষ্টিভঙ্গি',
    conjTitle: 'বৃহস্পতি-শনি মহাযোগ',
    conjDesc: '২০ বছরের বৃহস্পতি-শনি চক্র বিশ্ব ইতিহাসে যুগান্তকারী পরিবর্তন চিহ্নিত করে',
    past: 'অতীত যোগ',
    current: 'বর্তমান যুগ',
    upcoming: 'আসন্ন যোগ',
    sign: 'রাশি',
    element: 'তত্ত্ব',
    learnTitle: 'মুন্ডেন জ্যোতিষ সম্পর্কে',
    learnText: 'মুন্ডেন জ্যোতিষ হল বৈদিক জ্যোতিষের সেই শাখা যা জাতি, বিশ্ব ঘটনা এবং সামগ্রিক মানব অভিজ্ঞতার সাথে সম্পর্কিত।',
    learnText2: 'সবচেয়ে পর্যবেক্ষিত চক্র হল বৃহস্পতি-শনি মহাযোগ যা প্রায় ২০ বছরে একবার ঘটে।',
    source: 'উৎস',
    house: 'ভাব',
    tone_excellent: 'চমৎকার', tone_good: 'অনুকূল', tone_neutral: 'মিশ্র', tone_caution: 'সতর্কতা', tone_challenging: 'কঠিন',
    element_fire: 'অগ্নি', element_earth: 'পৃথিবী', element_air: 'বায়ু', element_water: 'জল',
    conjLoadError: 'যোগ সময়রেখা পাওয়া যায়নি।',
    conjLoading: 'যোগ সময়রেখা লোড হচ্ছে...',
    planetNames: {
      0: 'সূর্য', 2: 'মঙ্গল', 4: 'বৃহস্পতি', 6: 'শনি', 7: 'রাহু', 8: 'কেতু',
    } as Record<number, string>,
  },
} as const;

type LabelLocale = keyof typeof LABELS;
function L<K extends keyof typeof LABELS.en>(locale: string, key: K): typeof LABELS.en[K] {
  const loc = (locale in LABELS ? locale : 'en') as LabelLocale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LABELS[loc] as any)[key] ?? (LABELS.en as any)[key];
}

// ─── Tone colour ─────────────────────────────────────────────────────────────
const TONE_STYLES: Record<string, { bar: string; badge: string; text: string }> = {
  excellent:   { bar: 'bg-emerald-400',  badge: 'bg-emerald-500/20 text-emerald-300',  text: 'text-emerald-300' },
  good:        { bar: 'bg-green-400',    badge: 'bg-green-500/20 text-green-300',      text: 'text-green-300' },
  neutral:     { bar: 'bg-amber-400',    badge: 'bg-amber-500/20 text-amber-300',      text: 'text-amber-300' },
  caution:     { bar: 'bg-orange-400',   badge: 'bg-orange-500/20 text-orange-300',    text: 'text-orange-300' },
  challenging: { bar: 'bg-red-400',      badge: 'bg-red-500/20 text-red-300',          text: 'text-red-300' },
};

const ELEMENT_STYLES: Record<string, string> = {
  fire:  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  earth: 'bg-amber-500/20  text-amber-300  border-amber-500/30',
  air:   'bg-sky-500/20    text-sky-300    border-sky-500/30',
  water: 'bg-blue-500/20   text-blue-300   border-blue-500/30',
};

const NATURE_DOT: Record<string, string> = {
  benefic: 'bg-emerald-400',
  malefic: 'bg-red-400',
  neutral: 'bg-amber-400',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const tone =
    score >= 8 ? 'excellent' :
    score >= 6 ? 'good' :
    score >= 5 ? 'neutral' :
    score >= 3 ? 'caution' : 'challenging';
  const style = TONE_STYLES[tone];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${score * 10}%` }} />
      </div>
      <span className={`text-xs font-bold tabular-nums ${style.text}`}>{score}/10</span>
    </div>
  );
}

function ToneBadge({ tone, locale }: { tone: string; locale: string }) {
  const style = TONE_STYLES[tone] ?? TONE_STYLES.neutral;
  const key = `tone_${tone}` as keyof typeof LABELS.en;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
      {L(locale, key) as string}
    </span>
  );
}

function TransitRow({ t, locale }: { t: TransitEvent; locale: string }) {
  const pnames = L(locale, 'planetNames') as Record<number, string>;
  const name = pnames[t.planetId] ?? t.planetName;
  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${NATURE_DOT[t.nature] ?? NATURE_DOT.neutral}`} />
      <div>
        <span className="text-xs font-semibold text-text-primary">{name}</span>
        <span className="text-xs text-text-secondary ml-1">→ H{t.natalHouse}</span>
        <p className="text-xs text-text-secondary leading-snug mt-0.5">{t.description}</p>
      </div>
    </div>
  );
}

function DomainCard({ d, locale }: { d: DomainForecast; locale: string }) {
  const [open, setOpen] = useState(false);
  const lang = (locale in LABELS ? locale : 'en') as 'en' | 'hi' | 'ta' | 'bn';
  const label = d.label[lang] ?? d.label.en;
  const summary = d.summary[lang] ?? d.summary.en;
  const style = TONE_STYLES[d.tone] ?? TONE_STYLES.neutral;

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary font-mono">H{d.house}</span>
          <span className="text-sm font-semibold text-text-primary">{label}</span>
        </div>
        <ToneBadge tone={d.tone} locale={locale} />
      </div>
      <ScoreBar score={d.score} />
      <p className="text-xs text-text-secondary mt-2 leading-relaxed">{summary}</p>
      {d.transits.length > 0 && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-2 text-xs text-gold-primary hover:text-gold-light transition-colors"
        >
          {open ? '▲' : '▼'} {L(locale, 'transits')} ({d.transits.length})
        </button>
      )}
      {open && d.transits.map((t) => (
        <TransitRow key={t.planetId} t={t} locale={locale} />
      ))}
    </div>
  );
}

function ConjunctionCard({ c, locale, label }: { c: GreatConjunction; locale: string; label?: string }) {
  const elemKey = `element_${c.element}` as keyof typeof LABELS.en;
  const elemLabel = L(locale, elemKey) as string;
  const elemStyle = ELEMENT_STYLES[c.element] ?? ELEMENT_STYLES.air;

  return (
    <div className="bg-[#0d1030] border border-white/10 rounded-xl p-4">
      {label && (
        <div className="text-xs font-semibold text-gold-primary mb-2 uppercase tracking-wider">{label}</div>
      )}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-bold text-text-primary">{c.date}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${elemStyle}`}>{elemLabel}</span>
      </div>
      <div className="flex gap-3 text-xs text-text-secondary mb-2">
        <span>{L(locale, 'sign')}: <span className="text-gold-light font-semibold">{c.signName}</span></span>
        <span>{L(locale, 'element')}: <span className="text-gold-light font-semibold">{elemLabel}</span></span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{c.interpretation}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MundanePage() {
  const locale = useLocale();
  const lang = (locale in LABELS ? locale : 'en') as 'en' | 'hi' | 'ta' | 'bn';

  const [selectedId, setSelectedId] = useState('india');
  const [forecast, setForecast] = useState<NationalForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [conjData, setConjData] = useState<{
    past: GreatConjunction[];
    future: GreatConjunction[];
    current: GreatConjunction | null;
  } | null>(null);
  const [conjLoading, setConjLoading] = useState(true);
  const [conjError, setConjError] = useState<string | null>(null);

  // Load conjunctions once on mount
  useEffect(() => {
    setConjLoading(true);
    fetch('/api/mundane/conjunctions')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setConjData(data);
        setConjError(null);
      })
      .catch((err) => {
        console.error('[mundane] conjunction fetch failed:', err);
        setConjError(L(locale, 'conjLoadError') as string);
      })
      .finally(() => setConjLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadForecast = useCallback((nationId: string) => {
    setLoading(true);
    setError(null);
    fetch(`/api/mundane?nation=${encodeURIComponent(nationId)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: NationalForecastResult) => {
        setForecast(data);
        setError(null);
      })
      .catch((err) => {
        console.error('[mundane] forecast fetch failed:', err);
        setError(L(locale, 'error') as string);
        setForecast(null);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Load forecast for initial nation
  useEffect(() => {
    loadForecast(selectedId);
  }, [selectedId, loadForecast]);

  const selectedNation = NATION_CHARTS.find((n) => n.id === selectedId);

  return (
    <main className="min-h-screen bg-[#0a0e27] text-text-primary pb-16">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a4a]/50 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-primary text-xs font-semibold mb-4 uppercase tracking-wider">
            {L(locale, 'title')}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gold-light mb-3">
            {L(locale, 'title')}
          </h1>
          <p className="text-lg text-gold-primary/80 mb-2">{L(locale, 'subtitle')}</p>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto">{L(locale, 'desc')}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-10">

        {/* ── Nation Selector ── */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 rounded-2xl p-6">
          <label className="block text-sm font-semibold text-gold-light mb-3">
            {L(locale, 'selectNation')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {NATION_CHARTS.map((n) => {
              const name = n.name[lang] ?? n.name.en;
              const active = n.id === selectedId;
              return (
                <button
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm transition-all border ${
                    active
                      ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light font-semibold'
                      : 'bg-white/[0.06] border-white/10 text-text-secondary hover:bg-white/10 hover:text-text-primary'
                  }`}
                >
                  <span className="mr-1.5">{n.flagEmoji}</span>
                  {name}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Loading / Error ── */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-text-secondary">
            <svg className="animate-spin w-6 h-6 mr-3 text-gold-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
            </svg>
            {L(locale, 'loading')}
          </div>
        )}

        {error && !loading && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* ── Forecast content ── */}
        {!loading && forecast && selectedNation && (
          <>
            {/* Chart Summary */}
            <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gold-light flex items-center gap-2">
                    {selectedNation.flagEmoji}
                    {forecast.nationName[lang] ?? forecast.nationName.en}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">{L(locale, 'chartSummary')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <div className="text-xs text-text-secondary mb-1">{L(locale, 'foundingDate')}</div>
                  <div className="text-sm font-semibold text-text-primary">{selectedNation.date}</div>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <div className="text-xs text-text-secondary mb-1">{L(locale, 'capital')}</div>
                  <div className="text-sm font-semibold text-text-primary">{selectedNation.capitalCity}</div>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <div className="text-xs text-text-secondary mb-1">{L(locale, 'lagna')}</div>
                  <div className="text-sm font-semibold text-gold-light">{forecast.lagnaSignName}</div>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <div className="text-xs text-text-secondary mb-1">{L(locale, 'source')}</div>
                  <div className="text-xs text-text-secondary leading-snug">{selectedNation.source.split('—')[0]}</div>
                </div>
              </div>

              {/* Natal Planets quick strip */}
              <div className="flex flex-wrap gap-2">
                {forecast.natalPlanets.map((p) => {
                  const pnames = L(locale, 'planetNames') as Record<number, string>;
                  const name = pnames[p.planetId] ?? p.planetName;
                  return (
                    <span key={p.planetId} className="text-xs px-2.5 py-1 bg-white/[0.06] border border-white/10 rounded-full text-text-secondary">
                      {name} <span className="text-gold-light font-semibold">H{p.house}</span>
                    </span>
                  );
                })}
              </div>

              {/* Notes */}
              {selectedNation.notes && (
                <p className="text-xs text-text-secondary mt-3 italic">{selectedNation.notes}</p>
              )}
            </section>

            {/* Overall Outlook */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1060]/60 to-[#0d1030] border border-gold-primary/20 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gold-light mb-2">{L(locale, 'overallTitle')}</h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl font-bold text-gold-primary">{forecast.overallScore}/10</div>
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold-primary"
                      style={{ width: `${forecast.overallScore * 10}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {forecast.overallOutlook[lang] ?? forecast.overallOutlook.en}
              </p>
            </section>

            {/* Active Transits */}
            {forecast.currentTransits.length > 0 && (
              <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-gold-light mb-1">{L(locale, 'currentTransits')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {forecast.currentTransits.map((t) => (
                    <TransitRow key={t.planetId} t={t} locale={locale} />
                  ))}
                </div>
              </section>
            )}

            {/* Domain Forecasts */}
            <section>
              <h2 className="text-lg font-bold text-gold-light mb-1">{L(locale, 'domainTitle')}</h2>
              <p className="text-sm text-text-secondary mb-4">{L(locale, 'domainDesc')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {forecast.domainForecasts.map((d) => (
                  <DomainCard key={d.house} d={d} locale={locale} />
                ))}
              </div>
            </section>

            {/* Disclaimer */}
            <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-amber-300/90 text-xs leading-relaxed">{L(locale, 'disclaimer')}</p>
            </div>
          </>
        )}

        {/* ── Great Conjunctions ── */}
        <section>
          <h2 className="text-lg font-bold text-gold-light mb-1">{L(locale, 'conjTitle')}</h2>
          <p className="text-sm text-text-secondary mb-4">{L(locale, 'conjDesc')}</p>

          {conjLoading && (
            <p className="text-text-secondary text-sm py-4">{L(locale, 'conjLoading')}</p>
          )}
          {conjError && !conjLoading && (
            <p className="text-red-300 text-sm">{conjError}</p>
          )}

          {!conjLoading && conjData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Past */}
              <div>
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  {L(locale, 'past')}
                </h3>
                <div className="space-y-3">
                  {conjData.past.map((c) => (
                    <ConjunctionCard key={c.date} c={c} locale={locale} />
                  ))}
                </div>
              </div>

              {/* Current */}
              <div>
                <h3 className="text-xs font-semibold text-gold-primary uppercase tracking-wider mb-3">
                  {L(locale, 'current')}
                </h3>
                {conjData.current ? (
                  <ConjunctionCard c={conjData.current} locale={locale} label="Current Era" />
                ) : (
                  <p className="text-text-secondary text-sm">—</p>
                )}
              </div>

              {/* Upcoming */}
              <div>
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  {L(locale, 'upcoming')}
                </h3>
                <div className="space-y-3">
                  {conjData.future.map((c) => (
                    <ConjunctionCard key={c.date} c={c} locale={locale} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Educational section ── */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gold-light mb-4">{L(locale, 'learnTitle')}</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">{L(locale, 'learnText')}</p>
          <p className="text-sm text-text-secondary leading-relaxed">{L(locale, 'learnText2')}</p>

          {/* Domain reference table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-text-secondary py-2 pr-4 font-semibold w-8">{L(locale, 'house')}</th>
                  <th className="text-left text-text-secondary py-2 pr-4 font-semibold">Domain</th>
                  <th className="text-left text-text-secondary py-2 font-semibold">Significations</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(DOMAIN_LABELS).map(([domain, names], idx) => {
                  const name = names[lang] ?? names.en;
                  return (
                    <tr key={domain} className={`border-b border-white/5 ${idx % 2 === 0 ? 'bg-white/2' : ''}`}>
                      <td className="py-2 pr-4 text-gold-primary font-mono font-bold">{idx + 1}</td>
                      <td className="py-2 pr-4 text-text-primary font-semibold whitespace-nowrap">{name}</td>
                      <td className="py-2 text-text-secondary leading-snug">
                        {names.en}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}
