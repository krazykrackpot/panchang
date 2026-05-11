'use client';

import { useState } from 'react';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { Copy, Check } from 'lucide-react';

const BASE_URL = 'https://dekhopanchang.com';

const POPULAR_CITIES = CITIES.filter(c =>
  ['varanasi', 'delhi', 'mumbai', 'ujjain', 'haridwar', 'tirupati', 'puri', 'rishikesh', 'chennai', 'kolkata', 'bangalore', 'hyderabad'].includes(c.slug)
);

type Theme = 'light';
type Size = 'compact' | 'standard' | 'wide';
type WidgetLocale = 'en' | 'hi';

const SIZE_CONFIG: Record<Size, { width: number; height: number; label: string }> = {
  compact:  { width: 300, height: 420, label: 'Compact (300 x 420)' },
  standard: { width: 400, height: 500, label: 'Standard (400 x 500)' },
  wide:     { width: 600, height: 420, label: 'Wide (600 x 420)' },
};

export default function WidgetConfigurator() {
  const [selectedCity, setSelectedCity] = useState<CityData>(
    CITIES.find(c => c.slug === 'varanasi') || CITIES[0]
  );
  const [size, setSize] = useState<Size>('standard');
  const [widgetLocale, setWidgetLocale] = useState<WidgetLocale>('en');
  const [copied, setCopied] = useState(false);

  // The embed widget at /embed/panchang is a light-theme server-rendered page
  // with inline CSS. Theme parameter reserved for future dark embed support.
  const _theme: Theme = 'light';

  const { width, height } = SIZE_CONFIG[size];
  const embedUrl = `${BASE_URL}/embed/panchang?city=${selectedCity.slug}`;
  const embedCode = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" style="border-radius: 12px; border: 1px solid #ddd; overflow: hidden;" title="Daily Panchang  –  ${selectedCity.name.en}"></iframe>`;

  // Preview uses relative URL for same-origin iframe
  const previewUrl = `/embed/panchang?city=${selectedCity.slug}`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch (err) {
      // Fallback for older browsers / non-HTTPS
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* ── Left: Live Preview ── */}
      <div className="space-y-4">
        <h2 className="text-gold-light font-bold text-lg">Live Preview</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 flex items-center justify-center min-h-[480px]">
          <iframe
            key={`${selectedCity.slug}-${size}-${widgetLocale}`}
            src={previewUrl}
            width={Math.min(width, 400)}
            height={height}
            style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#fff',
              maxWidth: '100%',
            }}
            title="Panchang Widget Preview"
          />
        </div>
      </div>

      {/* ── Right: Configuration + Code ── */}
      <div className="space-y-6">
        <h2 className="text-gold-light font-bold text-lg">Configure Your Widget</h2>

        {/* City Selector */}
        <div className="space-y-2">
          <label className="block text-text-secondary text-sm font-semibold">City</label>
          <select
            value={selectedCity.slug}
            onChange={(e) => {
              const city = CITIES.find(c => c.slug === e.target.value);
              if (city) setSelectedCity(city);
            }}
            className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
          >
            <optgroup label="Popular Cities">
              {POPULAR_CITIES.map(c => (
                <option key={c.slug} value={c.slug}>
                  {c.name.en}{c.state ? ` \u2013 ${c.state}` : ''}
                </option>
              ))}
            </optgroup>
            <optgroup label="All Cities">
              {CITIES.filter(c => !POPULAR_CITIES.includes(c)).map(c => (
                <option key={c.slug} value={c.slug}>
                  {c.name.en}{c.state ? ` \u2013 ${c.state}` : ''}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Size Selector */}
        <div className="space-y-2">
          <label className="block text-text-secondary text-sm font-semibold">Size</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SIZE_CONFIG) as Size[]).map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 text-sm rounded-xl border transition-all duration-200 ${
                  size === s
                    ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light font-semibold'
                    : 'bg-bg-secondary border-gold-primary/12 text-text-secondary hover:border-gold-primary/30 hover:text-text-primary'
                }`}
              >
                {SIZE_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Locale Selector */}
        <div className="space-y-2">
          <label className="block text-text-secondary text-sm font-semibold">Language</label>
          <div className="flex gap-2">
            {([['en', 'English'], ['hi', 'Hindi']] as const).map(([code, label]) => (
              <button
                key={code}
                onClick={() => setWidgetLocale(code)}
                className={`px-4 py-2 text-sm rounded-xl border transition-all duration-200 ${
                  widgetLocale === code
                    ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light font-semibold'
                    : 'bg-bg-secondary border-gold-primary/12 text-text-secondary hover:border-gold-primary/30 hover:text-text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Embed Code */}
        <div className="space-y-2">
          <label className="block text-text-secondary text-sm font-semibold">Embed Code</label>
          <div className="relative">
            <pre className="bg-[#080b1e] border border-gold-primary/15 rounded-xl p-4 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed select-all">
              {embedCode}
            </pre>
            <button
              onClick={copyCode}
              className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
                copied
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-gold-primary/10 hover:bg-gold-primary/20 border-gold-primary/20 hover:border-gold-primary/40 text-gold-light'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Custom Coordinates Note */}
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4 text-text-secondary text-xs space-y-1">
          <p className="text-gold-light/80 font-semibold text-sm">Custom location?</p>
          <p>
            For locations not in the city list, use coordinates:{' '}
            <code className="bg-[#080b1e] px-1.5 py-0.5 rounded text-green-400/70 text-[10px]">
              ?lat=25.31&amp;lng=82.97&amp;name=My+Temple
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
