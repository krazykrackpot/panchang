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

type WidgetType = 'panchang' | 'festivals';
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
  const [copied, setCopied] = useState(false);

  // Debounced preview URL — prevents 30 iframe reloads while typing the
  // ref ID or dragging the days slider.
  const [debouncedKey, setDebouncedKey] = useState('');

  const refValid = useMemo(() => REF_PATTERN.test(refId), [refId]);

  const params = useMemo(() => {
    const p = new URLSearchParams({
      city: selectedCity.slug,
      theme,
      size,
      locale: widgetLocale,
    });
    if (refValid && refId.length > 0) p.set('ref', refId);
    if (type === 'festivals') p.set('days', String(days));
    return p;
  }, [selectedCity, theme, size, widgetLocale, refId, refValid, days, type]);

  const route = type === 'panchang' ? '/embed/panchang' : '/embed/festivals';
  const embedUrl = `${BASE_URL}${route}?${params.toString()}`;
  const previewUrl = `${route}?${params.toString()}`;

  // Debounce preview URL — ~250ms after the last state change.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedKey(previewUrl), 250);
    return () => clearTimeout(id);
  }, [previewUrl]);

  const { width, height } = SIZE_CONFIG[size];
  const titleAttr = type === 'panchang'
    ? `Daily Panchang — ${selectedCity.name.en}`
    : `Upcoming Festivals — ${selectedCity.name.en}`;

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
      <div className="flex gap-2">
        {(['panchang', 'festivals'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              type === t
                ? 'bg-gold-primary/25 border-2 border-gold-primary/50 text-gold-light'
                : 'bg-gold-primary/5 border border-gold-primary/15 text-text-secondary hover:text-gold-light'
            }`}
          >
            {t === 'panchang' ? 'Daily Panchang' : 'Upcoming Festivals'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Live Preview */}
        <div className="space-y-4">
          <h2 className="text-gold-light font-bold text-lg">Live Preview</h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 flex items-center justify-center min-h-[540px]">
            <iframe
              key={debouncedKey || previewUrl}
              src={debouncedKey || previewUrl}
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

          {/* City */}
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
                {CITIES.filter((c) => !POPULAR_CITY_SLUGS.includes(c.slug))
                  .map((c) => <option key={c.slug} value={c.slug}>{c.name.en}</option>)}
              </optgroup>
            </select>
          </div>

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
