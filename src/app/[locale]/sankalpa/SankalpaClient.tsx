'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, Printer, Sparkles, ScrollText } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import GoldDivider from '@/components/ui/GoldDivider';
import { useLocationStore } from '@/stores/location-store';
import { useAuthStore } from '@/stores/auth-store';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { SANKALPA_LABELS as LABELS } from './sankalpa-labels';

/* ── Types ──────────────────────────────────────────────────── */

interface SankalpaResult {
  devanagari: string;
  iast: string;
  english: string;
  components: {
    kalpaText: string;
    samvatsara: string;
    ayana: string;
    ritu: string;
    masa: string;
    paksha: string;
    tithi: string;
    vara: string;
    nakshatra: string;
    desha: string;
    kartaa: string;
    purpose: string;
  };
  panchangDate: string;
  vikramSamvat: number;
}

const GOTRAS = [
  // Saptarishi (7 primary)
  { en: 'Atri', sa: 'अत्रि' },
  { en: 'Bharadwaj', sa: 'भारद्वाज' },
  { en: 'Gautam', sa: 'गौतम' },
  { en: 'Jamadagni', sa: 'जमदग्नि' },
  { en: 'Kashyap', sa: 'कश्यप' },
  { en: 'Vasishtha', sa: 'वशिष्ठ' },
  { en: 'Vishwamitra', sa: 'विश्वामित्र' },
  // Other major gotras (alphabetical)
  { en: 'Agastya', sa: 'अगस्त्य' },
  { en: 'Angiras', sa: 'अंगिरस' },
  { en: 'Baijavap', sa: 'बैजवाप' },
  { en: 'Bandhu', sa: 'बन्धु' },
  { en: 'Bhargava', sa: 'भार्गव' },
  { en: 'Bhrigu', sa: 'भृगु' },
  { en: 'Chandilya', sa: 'चान्दिल्य' },
  { en: 'Dhananjaya', sa: 'धनञ्जय' },
  { en: 'Garga', sa: 'गर्ग' },
  { en: 'Harita', sa: 'हारीत' },
  { en: 'Kanva', sa: 'काण्व' },
  { en: 'Katyayan', sa: 'कात्यायन' },
  { en: 'Kaundinya', sa: 'कौण्डिन्य' },
  { en: 'Kaushik', sa: 'कौशिक' },
  { en: 'Kutsa', sa: 'कुत्स' },
  { en: 'Mandavya', sa: 'माण्डव्य' },
  { en: 'Maudgalya', sa: 'मौद्गल्य' },
  { en: 'Mudgal', sa: 'मुद्गल' },
  { en: 'Naidhruva', sa: 'नैधृव' },
  { en: 'Parashara', sa: 'पराशर' },
  { en: 'Sandilya', sa: 'शाण्डिल्य' },
  { en: 'Sankritya', sa: 'सांकृत्य' },
  { en: 'Savarni', sa: 'सावर्णि' },
  { en: 'Shaunaka', sa: 'शौनक' },
  { en: 'Srivatsa', sa: 'श्रीवत्स' },
  { en: 'Upamanyu', sa: 'उपमन्यु' },
  { en: 'Vatsa', sa: 'वत्स' },
  { en: 'Vatsya', sa: 'वात्स्य' },
  { en: 'Vishnu', sa: 'विष्णु' },
  { en: 'Yaska', sa: 'यास्क' },
];

type PurposeTab = 'puja' | 'vrat' | 'custom';

/* ── Puja options from PUJA_VIDHIS ──────────────────────────── */

const PUJA_OPTIONS = Object.entries(PUJA_VIDHIS).map(([slug, puja]) => ({
  slug,
  label: puja.deity,
}));

/* ── Component badge labels ─────────────────────────────────── */

const COMPONENT_KEYS: { key: string; componentKey: keyof SankalpaResult['components']; colorClass: string }[] = [
  { key: 'samvatsara', componentKey: 'samvatsara', colorClass: 'bg-amber-500/15 border-amber-500/25 text-amber-300' },
  { key: 'ayana', componentKey: 'ayana', colorClass: 'bg-sky-500/15 border-sky-500/25 text-sky-300' },
  { key: 'ritu', componentKey: 'ritu', colorClass: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' },
  { key: 'masa', componentKey: 'masa', colorClass: 'bg-violet-500/15 border-violet-500/25 text-violet-300' },
  { key: 'paksha', componentKey: 'paksha', colorClass: 'bg-rose-500/15 border-rose-500/25 text-rose-300' },
  { key: 'tithi', componentKey: 'tithi', colorClass: 'bg-orange-500/15 border-orange-500/25 text-orange-300' },
  { key: 'vara', componentKey: 'vara', colorClass: 'bg-cyan-500/15 border-cyan-500/25 text-cyan-300' },
  { key: 'nakshatra', componentKey: 'nakshatra', colorClass: 'bg-fuchsia-500/15 border-fuchsia-500/25 text-fuchsia-300' },
  { key: 'desha', componentKey: 'desha', colorClass: 'bg-teal-500/15 border-teal-500/25 text-teal-300' },
  { key: 'kartaa', componentKey: 'kartaa', colorClass: 'bg-gold-primary/15 border-gold-primary/25 text-gold-light' },
  { key: 'purposeLabel', componentKey: 'purpose', colorClass: 'bg-indigo-500/15 border-indigo-500/25 text-indigo-300' },
];

/* ── Client form (page-level h1 + intro live in page.tsx) ───── */

export default function SankalpaClient() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const t = (LABELS as Record<string, Record<string, string>>)[locale] || LABELS.en;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const locationStore = useLocationStore();
  const authStore = useAuthStore();
  const searchParams = useSearchParams();

  // Pre-fill puja from URL param (e.g., /sankalpa?puja=Diwali)
  const pujaParam = searchParams.get('puja') || '';

  // Pre-fill name from logged-in user
  const userName = authStore.user?.user_metadata?.full_name
    || authStore.user?.user_metadata?.name
    || '';

  // Form state
  const [fullName, setFullName] = useState(userName);
  const [gotra, setGotra] = useState('');
  const [gotraInput, setGotraInput] = useState('');
  const [showGotraDropdown, setShowGotraDropdown] = useState(false);
  const [placeName, setPlaceName] = useState(locationStore.name || '');
  const [placeLat, setPlaceLat] = useState<number | null>(locationStore.lat);
  const [placeLng, setPlaceLng] = useState<number | null>(locationStore.lng);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(locationStore.timezone);
  const [dateStr, setDateStr] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [masaSystem, setMasaSystem] = useState<'purnimant' | 'amant'>('purnimant');
  const [purposeTab, setPurposeTab] = useState<PurposeTab>('puja');
  const [selectedPuja, setSelectedPuja] = useState('');
  const [vratName, setVratName] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');

  // Pre-fill name when auth loads
  useEffect(() => {
    if (!fullName && userName) setFullName(userName);
  }, [userName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fill from URL param
  useEffect(() => {
    if (pujaParam) {
      setPurposeTab('puja');
      // Try to match a puja slug by deity name
      // Gemini PR #282 MED: PUJA_OPTIONS comes from PUJA_VIDHIS; the
      // current data has `hi` on every entry, but a future addition
      // without it would crash here. Optional-chain so the EN check
      // alone still works.
      const matchedPuja = PUJA_OPTIONS.find(p =>
        p.label.en.toLowerCase().includes(pujaParam.toLowerCase()) ||
        p.label.hi?.includes(pujaParam)
      );
      if (matchedPuja) {
        setSelectedPuja(matchedPuja.slug);
      } else {
        // Fall back to custom with the puja name
        setPurposeTab('custom');
        setCustomPurpose(pujaParam);
      }
    }
  }, [pujaParam]);

  // Result state
  const [result, setResult] = useState<SankalpaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const gotraRef = useRef<HTMLDivElement>(null);

  // Derive the purpose text
  const getPurposeText = (): string => {
    if (purposeTab === 'puja' && selectedPuja) {
      const puja = PUJA_VIDHIS[selectedPuja];
      return puja ? puja.deity.sa || "" : '';
    }
    if (purposeTab === 'vrat') return vratName;
    return customPurpose;
  };

  const canSubmit = placeLat !== null && placeLng !== null && getPurposeText().trim().length > 0;

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/sankalpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          gotra: gotra || gotraInput,
          lat: placeLat,
          lng: placeLng,
          timezone: placeTimezone || undefined,
          placeName: placeName || undefined,
          date: dateStr,
          purposeType: purposeTab,
          purposeText: getPurposeText(),
          pujaSlug: purposeTab === 'puja' ? selectedPuja : undefined,
          masaSystem,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate sankalpa');
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.devanagari);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handlePrint = () => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    // HTML-escape every interpolated value (Gemini PR #282 HIGH).
    // `result.devanagari` and `result.iast` contain user-supplied
    // fragments (kartaa name + custom purpose); writing them raw into
    // `document.write` would let `<script>` injected via either input
    // execute in the print popup.
    const esc = (s: string) =>
      s.replace(/[&<>"']/g, (c) =>
        c === '&' ? '&amp;'
        : c === '<' ? '&lt;'
        : c === '>' ? '&gt;'
        : c === '"' ? '&quot;'
        : '&#39;');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Sankalpa</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Sanskrit&display=swap');
        body { font-family: 'Tiro Devanagari Sanskrit', serif; max-width: 700px; margin: 40px auto; padding: 20px; text-align: center; color: #1a1a1a; }
        .sankalpa { font-size: 22px; line-height: 2; white-space: pre-line; margin: 30px 0; padding: 30px; border: 2px solid #b8860b; border-radius: 12px; }
        .iast { font-style: italic; color: #666; font-size: 14px; margin: 20px 0; }
        .date { font-size: 12px; color: #999; margin-top: 30px; }
        h1 { color: #b8860b; font-size: 28px; }
        .om { font-size: 48px; color: #b8860b; margin-bottom: 10px; }
      </style></head><body>
      <div class="om">\u0950</div>
      <h1>Sankalpa</h1>
      <div class="sankalpa">${esc(result.devanagari)}</div>
      <div class="iast">${esc(result.iast)}</div>
      <div class="date">${esc(result.panchangDate)} | Vikram Samvat ${esc(String(result.vikramSamvat))}</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Gotra filtering
  const filteredGotras = gotraInput.length > 0
    ? GOTRAS.filter(g =>
        g.en.toLowerCase().includes(gotraInput.toLowerCase()) ||
        g.sa.includes(gotraInput)
      )
    : GOTRAS;

  const inputCls = 'w-full bg-bg-primary/60 border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/20 transition-all placeholder:text-text-secondary/55';
  const labelCls = 'text-text-secondary text-xs uppercase tracking-wider mb-1.5 block';

  return (
    // The page-level <h1>, subtitle and description are server-rendered
    // by page.tsx so Bingbot (and other crawlers with limited JS) get a
    // proper heading without waiting for hydration. The interactive form
    // below stays client-only — useSearchParams() bails the whole tree
    // out of SSR, but that's now invisible to crawlers.
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* ── Form Card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 sm:p-8 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <label className="block">
            <span className={labelCls} style={bodyFont}>{t.fullName}</span>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              className={inputCls}
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            />
          </label>

          {/* Gotra with dropdown */}
          <div className="block relative" ref={gotraRef}>
            <span className={labelCls} style={bodyFont}>{t.gotra}</span>
            <input
              type="text"
              value={gotra || gotraInput}
              onChange={e => {
                setGotraInput(e.target.value);
                setGotra('');
                setShowGotraDropdown(true);
              }}
              onFocus={() => setShowGotraDropdown(true)}
              onBlur={() => setTimeout(() => setShowGotraDropdown(false), 200)}
              placeholder={t.gotraPlaceholder}
              className={inputCls}
              style={{ fontFamily: 'var(--font-devanagari-body)' }}
            />
            <AnimatePresence>
              {showGotraDropdown && filteredGotras.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-30 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-gold-primary/20 bg-[#0d1230]/95 backdrop-blur-lg shadow-2xl"
                >
                  {filteredGotras.map(g => (
                    <button
                      key={g.en}
                      type="button"
                      onMouseDown={e => {
                        e.preventDefault();
                        setGotra(g.sa);
                        setGotraInput('');
                        setShowGotraDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gold-primary/10 transition-colors flex items-center justify-between"
                    >
                      <span className="text-gold-light" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{g.sa}</span>
                      <span className="text-text-secondary/70 text-xs">{g.en}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Place */}
          <label className="block">
            <span className={labelCls} style={bodyFont}>{t.place}</span>
            <LocationSearch
              value={placeName}
              onSelect={(loc) => {
                setPlaceName(loc.name);
                setPlaceLat(loc.lat);
                setPlaceLng(loc.lng);
                setPlaceTimezone(loc.timezone);
              }}
              placeholder={tl({ en: 'Search city or place...', hi: 'स्थान खोजें...', sa: 'नगरं स्थानं वा अन्विष्यतु...', ta: 'நகரம் அல்லது இடம் தேடுங்கள்...', te: 'నగరం లేదా స్థలం వెతకండి...', bn: 'শহর বা জায়গা খুঁজুন...', kn: 'ನಗರ ಅಥವಾ ಸ್ಥಳ ಹುಡುಕಿ...', gu: 'શહેર અથવા સ્થળ શોધો...', mai: 'शहर वा स्थान खोजू...', mr: 'शहर किंवा जागा शोधा...' }, locale)}
            />
          </label>

          {/* Date */}
          <label className="block">
            <span className={labelCls} style={bodyFont}>{t.date}</span>
            <input
              type="date"
              value={dateStr}
              onChange={e => setDateStr(e.target.value)}
              className={inputCls}
            />
          </label>

          {/* Masa System Toggle */}
          <div>
            <span className={labelCls} style={bodyFont}>
              {tl({ en: 'Calendar System', hi: 'पंचांग पद्धति', sa: 'पञ्चाङ्ग-पद्धतिः', ta: 'பஞ்சாங்க முறை', te: 'పంచాంగ పద్ధతి', bn: 'পঞ্চাঙ্গ পদ্ধতি', kn: 'ಪಂಚಾಂಗ ಪದ್ಧತಿ', gu: 'પંચાંગ પ્રણાલી', mai: 'पंचांग पद्धति', mr: 'पंचांग पद्धती' }, locale)}
            </span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setMasaSystem('purnimant')}
                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  masaSystem === 'purnimant'
                    ? 'bg-gold-primary/15 border-gold-primary/40 text-gold-light'
                    : 'border-gold-primary/10 text-text-secondary hover:border-gold-primary/25'
                }`}
              >
                {tl({ en: 'Purnimant', hi: 'पूर्णिमान्त', sa: 'पूर्णिमान्तः', ta: 'பூர்ணிமாந்த்', te: 'పూర్ణిమాంత', bn: 'পূর্ণিমান্ত', kn: 'ಪೂರ್ಣಿಮಾಂತ', gu: 'પૂર્ણિમાંત', mai: 'पूर्णिमान्त', mr: 'पौर्णिमान्त' }, locale)}
                <span className="block text-xs text-text-secondary/75 mt-0.5">
                  {tl({ en: 'North India', hi: 'उत्तर भारत', sa: 'उत्तर-भारतम्', ta: 'வட இந்தியா', te: 'ఉత్తర భారతదేశం', bn: 'উত্তর ভারত', kn: 'ಉತ್ತರ ಭಾರತ', gu: 'ઉત્તર ભારત', mai: 'उत्तर भारत', mr: 'उत्तर भारत' }, locale)}
                </span>
              </button>
              <button
                onClick={() => setMasaSystem('amant')}
                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  masaSystem === 'amant'
                    ? 'bg-gold-primary/15 border-gold-primary/40 text-gold-light'
                    : 'border-gold-primary/10 text-text-secondary hover:border-gold-primary/25'
                }`}
              >
                {tl({ en: 'Amant', hi: 'अमान्त', sa: 'अमान्तः', ta: 'அமாந்த்', te: 'అమాంత', bn: 'অমান্ত', kn: 'ಅಮಾಂತ', gu: 'અમાંત', mai: 'अमान्त', mr: 'अमांत' }, locale)}
                <span className="block text-xs text-text-secondary/75 mt-0.5">
                  {tl({ en: 'South India', hi: 'दक्षिण भारत', sa: 'दक्षिण-भारतम्', ta: 'தென் இந்தியா', te: 'దక్షిణ భారతదేశం', bn: 'দক্ষিণ ভারত', kn: 'ದಕ್ಷಿಣ ಭಾರತ', gu: 'દક્ષિણ ભારત', mai: 'दक्षिण भारत', mr: 'दक्षिण भारत' }, locale)}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Purpose Tabs ──────────────────────────────────────── */}
        <div className="mt-8">
          <span className={`${labelCls} mb-3`} style={bodyFont}>{t.purpose}</span>
          <div className="flex gap-2 mb-4">
            {(['puja', 'vrat', 'custom'] as PurposeTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setPurposeTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  purposeTab === tab
                    ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30 shadow-lg shadow-gold-primary/5'
                    : 'text-text-secondary/75 hover:text-text-secondary border border-transparent hover:border-gold-primary/10'
                }`}
                style={bodyFont}
              >
                {tab === 'puja' ? t.forPuja : tab === 'vrat' ? t.forVrat : t.custom}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {purposeTab === 'puja' && (
              <motion.div
                key="puja"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <select
                  value={selectedPuja}
                  onChange={e => setSelectedPuja(e.target.value)}
                  className={`${inputCls} appearance-none cursor-pointer`}
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                >
                  <option value="" className="bg-[#0a0e27]">{t.selectPuja}</option>
                  {PUJA_OPTIONS.map(p => (
                    <option key={p.slug} value={p.slug} className="bg-[#0a0e27]">
                      {tl(p.label, locale)} ({p.label.en})
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {purposeTab === 'vrat' && (
              <motion.div
                key="vrat"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <input
                  type="text"
                  value={vratName}
                  onChange={e => setVratName(e.target.value)}
                  placeholder={t.vratPlaceholder}
                  className={inputCls}
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                />
              </motion.div>
            )}

            {purposeTab === 'custom' && (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <input
                  type="text"
                  value={customPurpose}
                  onChange={e => setCustomPurpose(e.target.value)}
                  placeholder={t.customPlaceholder}
                  className={inputCls}
                  style={{ fontFamily: 'var(--font-devanagari-body)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Generate Button ───────────────────────────────────── */}
        <div className="text-center mt-8">
          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}
          <motion.button
            onClick={handleGenerate}
            disabled={loading || !canSubmit}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-12 py-4 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-light text-lg font-bold hover:bg-gold-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-3"
            style={headingFont}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' as const }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                {t.generating}
              </>
            ) : (
              <>
                <ScrollText className="w-5 h-5" />
                {t.generate}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Result ────────────────────────────────────────────── */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
            className="space-y-6"
          >
            <GoldDivider />

            {/* Vikram Samvat badge */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-gold-primary/10 border border-gold-primary/20 text-gold-primary/80">
                {t.vikramSamvat} {result.vikramSamvat}
              </span>
            </div>

            {/* Main Sankalpa Text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
            >
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold-primary/20 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-primary/20 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-primary/20 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold-primary/20 rounded-br-2xl" />

              <h2 className="text-gold-primary text-sm uppercase tracking-[0.2em] mb-8 font-bold" style={bodyFont}>
                {t.result}
              </h2>

              {/* Devanagari Sankalpa */}
              <p
                className="text-gold-light text-xl sm:text-2xl leading-loose whitespace-pre-line"
                style={{ fontFamily: 'var(--font-devanagari-heading)', letterSpacing: '0.02em' }}
              >
                {result.devanagari}
              </p>

              {/* IAST */}
              <div className="mt-8 pt-6 border-t border-gold-primary/10">
                <p className="text-text-secondary/70 text-xs uppercase tracking-wider mb-2">{t.iast}</p>
                <p className="text-text-secondary/70 text-sm italic leading-relaxed">
                  {result.iast}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 mt-8">
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gold-primary/15 hover:bg-gold-primary/25 border border-gold-primary/20 text-gold-light transition-all"
                  style={bodyFont}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? t.copied : t.copy}
                </motion.button>
                <motion.button
                  onClick={handlePrint}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-text-primary transition-all"
                >
                  <Printer className="w-4 h-4" />
                  {t.print}
                </motion.button>
              </div>
            </motion.div>

            {/* English Meaning (Accordion) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setShowMeaning(!showMeaning)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gold-primary/5 transition-colors"
              >
                <span className="text-gold-primary text-sm uppercase tracking-wider font-bold" style={bodyFont}>
                  {t.meaning}
                </span>
                <ChevronDown className={`w-4 h-4 text-gold-primary/60 transition-transform duration-300 ${showMeaning ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showMeaning && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' as const }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-text-secondary/80 text-sm leading-relaxed">
                      {result.english}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Component Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6"
            >
              <h3 className="text-gold-primary text-sm uppercase tracking-wider font-bold mb-5" style={bodyFont}>
                {t.components}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {COMPONENT_KEYS.map(({ key, componentKey, colorClass }, idx) => {
                  const label = (t as Record<string, string>)[key] || key;
                  const value = result.components[componentKey];
                  if (!value) return null;
                  return (
                    <motion.span
                      key={key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + idx * 0.04 }}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs border ${colorClass}`}
                    >
                      <span className="opacity-60 text-xs uppercase tracking-wider">{label}</span>
                      <span
                        className="font-semibold"
                        style={{ fontFamily: 'var(--font-devanagari-body)' }}
                      >
                        {value}
                      </span>
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
