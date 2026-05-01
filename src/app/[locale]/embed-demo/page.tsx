'use client';

import { useState } from 'react';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';

const BASE_URL = 'https://dekhopanchang.com';

const POPULAR_CITIES = CITIES.filter(c =>
  ['varanasi', 'delhi', 'mumbai', 'ujjain', 'haridwar', 'tirupati', 'puri', 'rishikesh', 'chennai', 'kolkata', 'bangalore', 'hyderabad'].includes(c.slug)
);

export default function EmbedDemoPage() {
  const [selectedCity, setSelectedCity] = useState<CityData>(
    CITIES.find(c => c.slug === 'varanasi') || CITIES[0]
  );
  const [copied, setCopied] = useState(false);

  const embedUrl = `${BASE_URL}/embed/panchang?city=${selectedCity.slug}`;
  const embedCode = `<iframe src="${embedUrl}" width="300" height="420" frameborder="0" style="border:1px solid #ddd; border-radius:8px; overflow:hidden;"></iframe>`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = embedCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <p className="text-gold-primary text-xs uppercase tracking-widest font-bold">
          Free Widget
        </p>
        <h1 className="text-2xl sm:text-4xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
          Temple Panchang Widget
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
          Embed a live daily Panchang on your temple website, blog, or community page.
          Free, no ads, automatically updates every day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Preview */}
        <div className="space-y-4">
          <h2 className="text-gold-light font-bold text-lg flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-gold-primary" />
            Live Preview
          </h2>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 flex justify-center">
            <iframe
              src={`/embed/panchang?city=${selectedCity.slug}`}
              width={300}
              height={420}
              style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}
              title="Panchang Widget Preview"
            />
          </div>
        </div>

        {/* Right: Configuration */}
        <div className="space-y-6">
          {/* City Selector */}
          <div className="space-y-3">
            <h2 className="text-gold-light font-bold text-lg flex items-center gap-2">
              <Code className="w-4 h-4 text-gold-primary" />
              Configure
            </h2>
            <label className="block text-text-secondary text-sm font-medium">
              Select City
            </label>
            <select
              value={selectedCity.slug}
              onChange={(e) => {
                const city = CITIES.find(c => c.slug === e.target.value);
                if (city) setSelectedCity(city);
              }}
              className="w-full bg-bg-secondary border border-gold-primary/20 rounded-xl px-4 py-3 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none transition-colors"
            >
              <optgroup label="Popular Temple Cities">
                {POPULAR_CITIES.map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.name.en}{c.state ? ` — ${c.state}` : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="All Cities">
                {CITIES.filter(c => !POPULAR_CITIES.includes(c)).map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.name.en}{c.state ? ` — ${c.state}` : ''}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Embed Code */}
          <div className="space-y-3">
            <label className="block text-text-secondary text-sm font-medium">
              Embed Code
            </label>
            <div className="relative">
              <pre className="bg-bg-secondary border border-gold-primary/15 rounded-xl p-4 text-xs text-text-primary font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {embedCode}
              </pre>
              <button
                onClick={copyCode}
                className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-gold-primary/10 hover:bg-gold-primary/20 border-gold-primary/20 hover:border-gold-primary/40 text-gold-light'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 space-y-3">
            <h3 className="text-gold-light font-bold text-sm">How to add to your website</h3>
            <ol className="text-text-secondary text-sm space-y-2 list-decimal list-inside">
              <li>Select your city from the dropdown above</li>
              <li>Click &quot;Copy&quot; to copy the embed code</li>
              <li>Paste the code into your website&apos;s HTML where you want the widget</li>
              <li>The widget updates automatically every day</li>
            </ol>
          </div>

          {/* Custom coordinates note */}
          <div className="text-text-secondary/60 text-xs space-y-1">
            <p>
              <strong className="text-text-secondary">Custom coordinates:</strong> Use{' '}
              <code className="bg-bg-secondary px-1.5 py-0.5 rounded text-gold-light/70 text-[10px]">
                ?lat=25.31&amp;lng=82.97&amp;name=My+Temple
              </code>{' '}
              for locations not in the city list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
