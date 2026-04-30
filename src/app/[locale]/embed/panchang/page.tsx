'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import type { Locale , LocaleText} from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface WidgetData {
  date: string;
  tithi: { name: LocaleText };
  nakshatra: { name: LocaleText; pada: number };
  yoga: { name: LocaleText };
  karana: { name: LocaleText };
  vara: { name: LocaleText };
  sunrise: string;
  sunset: string;
  rahuKaal: { start: string; end: string };
  moonrise?: string;
}

export default function PanchangWidget() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const [data, setData] = useState<WidgetData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Get user location for accurate panchang
    if (!navigator.geolocation) { setError(true); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
          const now = new Date();
          const res = await fetch(`/api/panchang?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&timezone=${encodeURIComponent(timezone)}&year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}`);
          if (res.ok) setData(await res.json());
          else setError(true);
        } catch { setError(true); }
      },
      () => setError(true),
      { timeout: 5000 }
    );
  }, []);

  if (error) return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#0a0e27', color: '#8a8478', padding: '16px', borderRadius: '12px', textAlign: 'center', fontSize: '12px' }}>
      {tl({ en: 'Could not load panchang. Please allow location access.', hi: 'पंचांग लोड नहीं हो सका। कृपया स्थान अनुमति दें।', sa: 'पंचांग लोड नहीं हो सका। कृपया स्थान अनुमति दें।' }, locale)}
    </div>
  );

  if (!data) return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#0a0e27', color: '#d4a853', padding: '20px', borderRadius: '12px', textAlign: 'center', fontSize: '12px' }}>
      {tl({ en: 'Loading panchang...', hi: 'पंचांग लोड हो रहा है...', sa: 'पंचांग लोड हो रहा है...' }, locale)}
    </div>
  );

  const L = (obj: LocaleText) => obj[locale] || obj.en;
  const gold = '#d4a853';
  const goldLight = '#f0d48a';
  const textSec = '#8a8478';
  const bg = '#0a0e27';
  const bgCard = '#111633';

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      background: bg,
      color: '#e6e2d8',
      borderRadius: '12px',
      border: `1px solid ${gold}33`,
      overflow: 'hidden',
      maxWidth: '360px',
      fontSize: '12px',
      lineHeight: 1.5,
    }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${bgCard}, ${bg})`, padding: '12px 16px', borderBottom: `1px solid ${gold}20` }}>
        <div style={{ color: goldLight, fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>
          {tl({ en: "Today's Panchang", hi: "आज का पंचांग", sa: "आज का पंचांग" }, locale)}
        </div>
        <div style={{ color: textSec, fontSize: '10px' }}>
          {L(data.vara.name)} — {data.date}
        </div>
      </div>

      {/* Core 5 elements */}
      <div style={{ padding: '12px 16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              { label: tl({ en: 'Tithi', hi: 'तिथि', sa: 'तिथि' }, locale), value: L(data.tithi.name) },
              { label: tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' }, locale), value: `${L(data.nakshatra.name)} (${tl({ en: 'Pada', hi: 'पाद', sa: 'पाद' }, locale)} ${data.nakshatra.pada})` },
              { label: tl({ en: 'Yoga', hi: 'योग', sa: 'योग' }, locale), value: L(data.yoga.name) },
              { label: tl({ en: 'Karana', hi: 'करण', sa: 'करण' }, locale), value: L(data.karana.name) },
              { label: tl({ en: 'Vara', hi: 'वार', sa: 'वार' }, locale), value: L(data.vara.name) },
            ].map(({ label, value }) => (
              <tr key={label}>
                <td style={{ padding: '3px 0', color: textSec, width: '35%', verticalAlign: 'top' }}>{label}</td>
                <td style={{ padding: '3px 0', color: goldLight, fontWeight: 600 }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timing row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', background: bgCard, borderTop: `1px solid ${gold}15` }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: textSec, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tl({ en: 'Sunrise', hi: 'सूर्योदय', sa: 'सूर्योदय' }, locale)}</div>
          <div style={{ color: '#e67e22', fontWeight: 700, fontFamily: 'monospace' }}>{data.sunrise}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: textSec, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tl({ en: 'Sunset', hi: 'सूर्यास्त', sa: 'सूर्यास्त' }, locale)}</div>
          <div style={{ color: '#3498db', fontWeight: 700, fontFamily: 'monospace' }}>{data.sunset}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: textSec, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tl({ en: 'Rahu Kaal', hi: 'राहु काल', sa: 'राहु काल' }, locale)}</div>
          <div style={{ color: '#e74c3c', fontWeight: 700, fontFamily: 'monospace', fontSize: '10px' }}>{data.rahuKaal.start}–{data.rahuKaal.end}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '6px 16px', borderTop: `1px solid ${gold}10` }}>
        <a
          href="https://dekhopanchang.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: gold, fontSize: '9px', textDecoration: 'none', opacity: 0.7 }}
        >
          dekhopanchang.com
        </a>
      </div>
    </div>
  );
}
