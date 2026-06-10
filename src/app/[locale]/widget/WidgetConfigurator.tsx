'use client';

/**
 * /widget builder — self-serve UI for generating an embed iframe.
 *
 * Generates URLs for both `/embed/panchang` and `/embed/festivals`
 * following the embed query contract (theme / size / locale / ref).
 *
 * Theme picker, size picker, language picker (9 locales), city
 * dropdown, tracking ID input, days slider (festivals only), live
 * preview, copy-paste textarea + button.
 *
 * Debounces preview URL so dragging the slider doesn't fire 30
 * iframe reloads.
 */

import { useState, useEffect, useMemo } from 'react';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { Copy, Check } from 'lucide-react';

const BASE_URL = 'https://dekhopanchang.com';

const POPULAR_CITY_SLUGS = [
  'varanasi', 'delhi', 'mumbai', 'ujjain', 'haridwar', 'tirupati',
  'puri', 'rishikesh', 'chennai', 'kolkata', 'bangalore', 'hyderabad',
];
const POPULAR_CITIES = CITIES.filter((c) => POPULAR_CITY_SLUGS.includes(c.slug));
// Hoisted so the city `<optgroup label="All cities">` doesn't re-filter
// the 325-entry CITIES list on every render. Gemini PR #360 MEDIUM.
const OTHER_CITIES = CITIES.filter((c) => !POPULAR_CITY_SLUGS.includes(c.slug));

type WidgetType =
  | 'panchang'
  | 'festivals'
  | 'horoscope'
  | 'kp-ruling'
  | 'kp-rashi'
  | 'kp-prashna'
  | 'kundali'      // birth chart — Phase 2B
  | 'choghadiya'   // day's auspicious windows — Phase 2B
  | 'transits';    // current planetary positions — Phase 2B
type ChartStyle = 'north' | 'south';

// Default demo birth for the kundali widget — Einstein. Recognisable
// enough that visitors immediately understand what the widget shows;
// also conveniently has a non-Indian timezone so the lat/lng → tz
// resolver gets exercised in the preview.
const DEMO_BIRTH = {
  date: '1879-03-14',
  time: '11:30',
  lat: 48.40,
  lng: 9.99,
  name: 'Einstein',
};
type HoroscopeMode = 'strip' | 'single';
type KpRulingMode = 'sunrise' | 'now';

const RASHI_OPTIONS: { value: string; label: string }[] = [
  { value: 'mesh', label: 'Mesh / Aries' },
  { value: 'vrishabh', label: 'Vrishabh / Taurus' },
  { value: 'mithun', label: 'Mithun / Gemini' },
  { value: 'kark', label: 'Kark / Cancer' },
  { value: 'simha', label: 'Simha / Leo' },
  { value: 'kanya', label: 'Kanya / Virgo' },
  { value: 'tula', label: 'Tula / Libra' },
  { value: 'vrishchik', label: 'Vrishchik / Scorpio' },
  { value: 'dhanu', label: 'Dhanu / Sagittarius' },
  { value: 'makar', label: 'Makar / Capricorn' },
  { value: 'kumbh', label: 'Kumbh / Aquarius' },
  { value: 'meen', label: 'Meen / Pisces' },
];
type Theme = 'light' | 'dark' | 'auto';
type Size = 'narrow' | 'default' | 'wide';
type WidgetLocale =
  | 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'mr' | 'mai';

const SIZE_CONFIG: Record<Size, { width: number; height: number; label: string }> = {
  narrow:  { width: 240, height: 420, label: 'Narrow (240 × 420)' },
  default: { width: 320, height: 480, label: 'Default (320 × 480)' },
  wide:    { width: 480, height: 520, label: 'Wide (480 × 520)' },
};

// All 9 locales spelled out so the dropdown stays in sync with the
// catalog discipline. Native-script labels — no English-only fallback.
const LOCALE_OPTIONS: { value: WidgetLocale; label: string }[] = [
  { value: 'en',  label: 'English' },
  { value: 'hi',  label: 'हिन्दी (Hindi)' },
  { value: 'mr',  label: 'मराठी (Marathi)' },
  { value: 'mai', label: 'मैथिली (Maithili)' },
  { value: 'ta',  label: 'தமிழ் (Tamil)' },
  { value: 'te',  label: 'తెలుగు (Telugu)' },
  { value: 'bn',  label: 'বাংলা (Bengali)' },
  { value: 'gu',  label: 'ગુજરાતી (Gujarati)' },
  { value: 'kn',  label: 'ಕನ್ನಡ (Kannada)' },
];

const THEME_OPTIONS: { value: Theme; label: string; hint: string }[] = [
  { value: 'light', label: 'Light', hint: 'Best for most temple / community sites' },
  { value: 'dark',  label: 'Dark',  hint: 'Matches dark-themed sites' },
  { value: 'auto',  label: 'Auto',  hint: "Follows visitor's system preference" },
];

const REF_PATTERN = /^[a-z0-9-]{0,64}$/;

interface Props {
  /** Page locale — drives default for the widget locale picker. */
  pageLocale: string;
}

export default function WidgetConfigurator({ pageLocale }: Props) {
  const [type, setType] = useState<WidgetType>('panchang');
  const [selectedCity, setSelectedCity] = useState<CityData>(
    CITIES.find((c) => c.slug === 'varanasi') || CITIES[0],
  );
  const [theme, setTheme] = useState<Theme>('light');
  const [size, setSize] = useState<Size>('default');
  const [widgetLocale, setWidgetLocale] = useState<WidgetLocale>(
    (LOCALE_OPTIONS.find((o) => o.value === pageLocale)?.value as WidgetLocale) ?? 'en',
  );
  const [refId, setRefId] = useState('');
  const [days, setDays] = useState(7);
  const [horoMode, setHoroMode] = useState<HoroscopeMode>('strip');
  const [highlight, setHighlight] = useState<string>('mesh');
  const [kpRulingMode, setKpRulingMode] = useState<KpRulingMode>('sunrise');
  const [kpPrashnaNumber, setKpPrashnaNumber] = useState<number>(100);
  // Phase 2B widget state — kundali birth fields + chart style; per-date
  // override for choghadiya / transits. Date strings stay in YYYY-MM-DD
  // shape; empty string means "use today (in widget's location tz)".
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');
  const [birthDate, setBirthDate] = useState<string>(DEMO_BIRTH.date);
  const [birthTime, setBirthTime] = useState<string>(DEMO_BIRTH.time);
  const [birthLat, setBirthLat] = useState<string>(String(DEMO_BIRTH.lat));
  const [birthLng, setBirthLng] = useState<string>(String(DEMO_BIRTH.lng));
  const [birthName, setBirthName] = useState<string>(DEMO_BIRTH.name);
  const [snapshotDate, setSnapshotDate] = useState<string>(''); // YYYY-MM-DD or ''
  const [copied, setCopied] = useState(false);

  // Debounced preview URL — prevents 30 iframe reloads while typing the
  // ref ID or dragging the days slider. The debounced state is seeded
  // with the initial preview URL (computed lazily so it matches what
  // `previewUrl` produces on first render); previously this was `''`
  // and the consumer fell back to `previewUrl` via `||`, which defeated
  // the debounce during the first burst of rapid input. Gemini PR #360
  // HIGH.
  const [debouncedUrl, setDebouncedUrl] = useState(() => {
    const initialLocale =
      (LOCALE_OPTIONS.find((o) => o.value === pageLocale)?.value as WidgetLocale) ?? 'en';
    return `/embed/panchang?city=varanasi&theme=light&size=default&locale=${initialLocale}`;
  });

  const refValid = useMemo(() => REF_PATTERN.test(refId), [refId]);
  // Lat/lng client-side validation — drives the red-border state on
  // the kundali birth inputs so an out-of-range value gives immediate
  // feedback instead of waiting for the preview iframe to error out.
  // Gemini #654 MED. Empty string counts as "not yet typed", not
  // invalid — the input is required, but the configurator seeds the
  // demo birth so a fresh load is always valid.
  const birthLatValid = useMemo(() => {
    if (!birthLat) return true;
    const n = parseFloat(birthLat);
    return Number.isFinite(n) && n >= -90 && n <= 90;
  }, [birthLat]);
  const birthLngValid = useMemo(() => {
    if (!birthLng) return true;
    const n = parseFloat(birthLng);
    return Number.isFinite(n) && n >= -180 && n <= 180;
  }, [birthLng]);

  const params = useMemo(() => {
    // The horoscope widget is rashi-based, not location-based — skip
    // the `city` param entirely for it. Including an unused city would
    // be harmless but noisy in the generated embed code.
    const base: Record<string, string> = {
      theme,
      size,
      locale: widgetLocale,
    };
    // Some widget types are intrinsically location-less or use their
    // own location inputs instead of the shared city selector:
    //   horoscope / kp-rashi → rashi-based, global
    //   transits             → geocentric, no location
    //   kundali              → birth lat/lng/date/time provided directly
    const locationLess =
      type === 'horoscope' || type === 'kp-rashi' ||
      type === 'transits'  || type === 'kundali';
    if (!locationLess) base.city = selectedCity.slug;
    const p = new URLSearchParams(base);
    if (refValid && refId.length > 0) p.set('ref', refId);
    if (type === 'festivals') p.set('days', String(days));
    if (type === 'horoscope') {
      p.set('mode', horoMode);
      if (horoMode === 'single') p.set('highlight', highlight);
    }
    if (type === 'kp-ruling') {
      p.set('mode', kpRulingMode);
    }
    if (type === 'kp-prashna') {
      p.set('number', String(kpPrashnaNumber));
    }
    // Shared snapshot-date contract — both /embed/choghadiya and
    // /embed/transits accept ?date=YYYY-MM-DD; blank = today.
    if ((type === 'choghadiya' || type === 'transits') && snapshotDate) {
      p.set('date', snapshotDate);
    }
    if (type === 'kundali') {
      p.set('date', birthDate);
      p.set('time', birthTime);
      p.set('lat', birthLat);
      p.set('lng', birthLng);
      if (birthName) p.set('name', birthName);
      p.set('style', chartStyle);
    }
    return p;
  }, [
    selectedCity, theme, size, widgetLocale, refId, refValid, days, type,
    horoMode, highlight, kpRulingMode, kpPrashnaNumber,
    snapshotDate, birthDate, birthTime, birthLat, birthLng, birthName, chartStyle,
  ]);

  const route =
    type === 'panchang' ? '/embed/panchang'
    : type === 'festivals' ? '/embed/festivals'
    : type === 'horoscope' ? '/embed/horoscope'
    : type === 'kp-ruling' ? '/embed/kp-ruling'
    : type === 'kp-rashi' ? '/embed/kp-rashi'
    : type === 'kp-prashna' ? '/embed/kp-prashna'
    : type === 'kundali' ? '/embed/kundali'
    : type === 'choghadiya' ? '/embed/choghadiya'
    : '/embed/transits';
  const embedUrl = `${BASE_URL}${route}?${params.toString()}`;
  const previewUrl = `${route}?${params.toString()}`;

  // Debounce preview URL — ~250ms after the last state change.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedUrl(previewUrl), 250);
    return () => clearTimeout(id);
  }, [previewUrl]);

  const { width, height } = SIZE_CONFIG[size];
  const titleAttr =
    type === 'panchang' ? `Daily Panchang — ${selectedCity.name.en}`
    : type === 'festivals' ? `Upcoming Festivals — ${selectedCity.name.en}`
    : type === 'horoscope'
      ? (horoMode === 'single'
        ? `Today's Horoscope — ${RASHI_OPTIONS.find((o) => o.value === highlight)?.label ?? 'Aries'}`
        : 'Today\'s Horoscope — All 12 Rashis')
    : type === 'kp-ruling' ? `KP Ruling Planets — ${selectedCity.name.en}`
    : type === 'kp-rashi' ? 'KP Daily Forecast — All 12 Rashis'
    : type === 'kp-prashna' ? `KP Prashna — Number ${kpPrashnaNumber}`
    : type === 'kundali' ? (birthName ? `Birth Chart — ${birthName}` : 'Birth Chart')
    : type === 'choghadiya' ? `Choghadiya — ${selectedCity.name.en}`
    : 'Current Transits';

  const embedCode = [
    `<iframe`,
    `  src="${embedUrl}"`,
    `  width="${width}" height="${height}"`,
    `  frameborder="0"`,
    `  loading="lazy"`,
    `  title="${titleAttr}"`,
    `  style="border-radius: 12px; border: 1px solid #ddd; overflow: hidden;"`,
    `></iframe>`,
  ].join('\n');

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch (err) {
      console.error('[widget] Clipboard API failed, using fallback:', err);
      const ta = document.createElement('textarea');
      ta.value = embedCode;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Widget-type tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          'panchang', 'festivals', 'horoscope',
          'kp-ruling', 'kp-rashi', 'kp-prashna',
          'kundali', 'choghadiya', 'transits',
        ] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              type === t
                ? 'bg-gold-primary/25 border-2 border-gold-primary/50 text-gold-light'
                : 'bg-gold-primary/5 border border-gold-primary/15 text-text-secondary hover:text-gold-light'
            }`}
          >
            {t === 'panchang' ? 'Daily Panchang'
              : t === 'festivals' ? 'Upcoming Festivals'
              : t === 'horoscope' ? 'Daily Horoscope'
              : t === 'kp-ruling' ? 'KP Ruling'
              : t === 'kp-rashi' ? 'KP Rashi'
              : t === 'kp-prashna' ? 'KP Prashna'
              : t === 'kundali' ? 'Birth Chart'
              : t === 'choghadiya' ? 'Choghadiya'
              : 'Transits'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Live Preview */}
        <div className="space-y-4">
          <h2 className="text-gold-light font-bold text-lg">Live Preview</h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 flex items-center justify-center min-h-[540px]">
            <iframe
              key={debouncedUrl}
              src={debouncedUrl}
              width={Math.min(width, 400)}
              height={height}
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#fff',
                maxWidth: '100%',
              }}
              title="Widget preview"
            />
          </div>
        </div>

        {/* Right: Configuration + Code */}
        <div className="space-y-6">
          <h2 className="text-gold-light font-bold text-lg">Configure your widget</h2>

          {/* City — hidden for widget types that don't use the shared
              city selector: horoscope / kp-rashi are rashi-based,
              transits is geocentric, kundali uses its own birth lat/lng. */}
          {type !== 'horoscope' && type !== 'kp-rashi' &&
           type !== 'transits' && type !== 'kundali' && (
            <div className="space-y-2">
              <label htmlFor="city" className="block text-text-secondary text-sm font-semibold">City</label>
              <select
                id="city"
                value={selectedCity.slug}
                onChange={(e) => {
                  const city = CITIES.find((c) => c.slug === e.target.value);
                  if (city) setSelectedCity(city);
                }}
                className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
              >
                <optgroup label="Popular">
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name.en}</option>
                  ))}
                </optgroup>
                <optgroup label="All cities">
                  {OTHER_CITIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name.en}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          {/* Theme */}
          <div className="space-y-2">
            <span className="block text-text-secondary text-sm font-semibold">Theme</span>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  title={opt.hint}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    theme === opt.value
                      ? 'bg-gold-primary/25 border-2 border-gold-primary/50 text-gold-light'
                      : 'bg-gold-primary/5 border border-gold-primary/15 text-text-secondary hover:text-gold-light'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <span className="block text-text-secondary text-sm font-semibold">Size</span>
            <div className="space-y-1.5">
              {(['narrow', 'default', 'wide'] as Size[]).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    checked={size === s}
                    onChange={() => setSize(s)}
                    className="accent-gold-primary"
                  />
                  <span className="text-text-primary text-sm">{SIZE_CONFIG[s].label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label htmlFor="locale" className="block text-text-secondary text-sm font-semibold">Language</label>
            <select
              id="locale"
              value={widgetLocale}
              onChange={(e) => setWidgetLocale(e.target.value as WidgetLocale)}
              className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
            >
              {LOCALE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Days (festivals only) */}
          {type === 'festivals' && (
            <div className="space-y-2">
              <label htmlFor="days" className="block text-text-secondary text-sm font-semibold">
                Days to show <span className="text-gold-primary">({days})</span>
              </label>
              <input
                id="days"
                type="range"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value, 10))}
                className="w-full accent-gold-primary"
              />
              <div className="flex justify-between text-text-secondary text-xs">
                <span>1</span>
                <span>30</span>
              </div>
            </div>
          )}

          {/* Horoscope mode (horoscope only) */}
          {type === 'horoscope' && (
            <div className="space-y-2">
              <label className="block text-text-secondary text-sm font-semibold">Layout mode</label>
              <div className="grid grid-cols-2 gap-2">
                {(['strip', 'single'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setHoroMode(m)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      horoMode === m
                        ? 'bg-gold-primary/20 border-2 border-gold-primary/50 text-gold-light'
                        : 'bg-gold-primary/5 border border-gold-primary/15 text-text-secondary hover:text-gold-light'
                    }`}
                  >
                    {m === 'strip' ? 'All 12 rashis' : 'Single rashi'}
                  </button>
                ))}
              </div>
              <p className="text-text-secondary/70 text-xs">
                {horoMode === 'strip'
                  ? 'Compact gateway: 12 tiles, each links to its own daily forecast.'
                  : 'Featured rashi with full insight; 11 others as a switcher strip.'}
              </p>
            </div>
          )}

          {/* Featured rashi (horoscope/single only) */}
          {type === 'horoscope' && horoMode === 'single' && (
            <div className="space-y-2">
              <label htmlFor="highlight" className="block text-text-secondary text-sm font-semibold">Featured rashi</label>
              <select
                id="highlight"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
              >
                {RASHI_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* KP Ruling mode (kp-ruling only) */}
          {type === 'kp-ruling' && (
            <div className="space-y-2">
              <label className="block text-text-secondary text-sm font-semibold">Cast moment</label>
              <div className="grid grid-cols-2 gap-2">
                {(['sunrise', 'now'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setKpRulingMode(m)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      kpRulingMode === m
                        ? 'bg-gold-primary/20 border-2 border-gold-primary/50 text-gold-light'
                        : 'bg-gold-primary/5 border border-gold-primary/15 text-text-secondary hover:text-gold-light'
                    }`}
                  >
                    {m === 'sunrise' ? "Today's sunrise" : 'Right now'}
                  </button>
                ))}
              </div>
              <p className="text-text-secondary/70 text-xs">
                {kpRulingMode === 'sunrise'
                  ? 'Cached daily; matches the temple-site daily-energy use case.'
                  : 'Live per request; higher compute cost, no caching.'}
              </p>
            </div>
          )}

          {/* KP Prashna number (kp-prashna only) */}
          {type === 'kp-prashna' && (
            <div className="space-y-2">
              <label htmlFor="kp-num" className="block text-text-secondary text-sm font-semibold">
                Number <span className="text-gold-primary">({kpPrashnaNumber})</span>
              </label>
              <input
                id="kp-num"
                type="number"
                min={1}
                max={249}
                value={kpPrashnaNumber}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!isNaN(n) && n >= 1 && n <= 249) setKpPrashnaNumber(n);
                }}
                className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
              />
              <p className="text-text-secondary/70 text-xs">
                Pre-cast a specific 1–249 number. Visitors land on the verdict instead of the form.
              </p>
            </div>
          )}

          {/* Birth fields (kundali only) */}
          {type === 'kundali' && (
            <>
              <div className="space-y-2">
                <label htmlFor="birth-name" className="block text-text-secondary text-sm font-semibold">
                  Name <span className="text-text-secondary/60">(optional)</span>
                </label>
                <input
                  id="birth-name"
                  type="text"
                  value={birthName}
                  maxLength={64}
                  onChange={(e) => setBirthName(e.target.value.slice(0, 64))}
                  className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="birth-date" className="block text-text-secondary text-sm font-semibold">Birth date</label>
                  <input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-3 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="birth-time" className="block text-text-secondary text-sm font-semibold">Birth time</label>
                  <input
                    id="birth-time"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-3 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="birth-lat" className="block text-text-secondary text-sm font-semibold">Latitude</label>
                  <input
                    id="birth-lat"
                    type="number"
                    step="0.01"
                    min={-90}
                    max={90}
                    value={birthLat}
                    onChange={(e) => setBirthLat(e.target.value)}
                    aria-invalid={!birthLatValid}
                    className={`w-full bg-bg-secondary border rounded-xl px-3 py-3 text-text-primary text-sm focus:outline-none transition-colors ${
                      birthLatValid
                        ? 'border-gold-primary/20 focus:border-gold-primary/50'
                        : 'border-red-500/60 focus:border-red-500'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="birth-lng" className="block text-text-secondary text-sm font-semibold">Longitude</label>
                  <input
                    id="birth-lng"
                    type="number"
                    step="0.01"
                    min={-180}
                    max={180}
                    value={birthLng}
                    onChange={(e) => setBirthLng(e.target.value)}
                    aria-invalid={!birthLngValid}
                    className={`w-full bg-bg-secondary border rounded-xl px-3 py-3 text-text-primary text-sm focus:outline-none transition-colors ${
                      birthLngValid
                        ? 'border-gold-primary/20 focus:border-gold-primary/50'
                        : 'border-red-500/60 focus:border-red-500'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="block text-text-secondary text-sm font-semibold">Chart style</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['north', 'south'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setChartStyle(s)}
                      className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        chartStyle === s
                          ? 'bg-gold-primary/20 border-2 border-gold-primary/50 text-gold-light'
                          : 'bg-gold-primary/5 border border-gold-primary/15 text-text-secondary hover:text-gold-light'
                      }`}
                    >
                      {s === 'north' ? 'North Indian (diamond)' : 'South Indian (grid)'}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-text-secondary/70 text-xs">
                Birth timezone is resolved automatically from latitude + longitude.
                Demo birth: Einstein, 1879-03-14 11:30 LMT, Ulm.
              </p>
            </>
          )}

          {/* Snapshot date — choghadiya / transits only. Blank = today. */}
          {(type === 'choghadiya' || type === 'transits') && (
            <div className="space-y-2">
              <label htmlFor="snapshot-date" className="block text-text-secondary text-sm font-semibold">
                Date <span className="text-text-secondary/60">(blank = today)</span>
              </label>
              <input
                id="snapshot-date"
                type="date"
                value={snapshotDate}
                onChange={(e) => setSnapshotDate(e.target.value)}
                className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
              />
              <p className="text-text-secondary/70 text-xs">
                {type === 'choghadiya'
                  ? 'Show choghadiyas for a specific date. Leave blank to update with each day.'
                  : 'Show planetary positions for a specific date (noon UT). Leave blank for today.'}
              </p>
            </div>
          )}

          {/* Tracking ID */}
          <div className="space-y-2">
            <label htmlFor="ref" className="block text-text-secondary text-sm font-semibold">
              Tracking ID <span className="text-text-secondary/60">(optional)</span>
            </label>
            <input
              id="ref"
              type="text"
              value={refId}
              onChange={(e) => setRefId(e.target.value.toLowerCase())}
              placeholder="iskcon-delhi"
              maxLength={64}
              className={`w-full bg-bg-secondary border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none transition-colors ${
                refId && !refValid
                  ? 'border-red-500/60'
                  : 'border-gold-primary/20 focus:border-gold-primary/50'
              }`}
            />
            <p className={`text-xs ${refId && !refValid ? 'text-red-400' : 'text-text-secondary/70'}`}>
              {refId && !refValid
                ? 'Use lowercase letters, digits, and hyphens only (1–64 chars).'
                : 'Helps you measure how much traffic each embed generates.'}
            </p>
          </div>

          {/* Embed Code */}
          <div className="space-y-2">
            <span className="block text-text-secondary text-sm font-semibold">Embed code</span>
            <pre className="bg-bg-secondary border border-gold-primary/20 rounded-xl p-4 text-xs text-text-primary overflow-x-auto whitespace-pre-wrap break-words">
              {embedCode}
            </pre>
            <button
              onClick={copyCode}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gold-primary/20 border-2 border-gold-primary/50 text-gold-light font-bold text-sm hover:bg-gold-primary/30 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy to clipboard
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
