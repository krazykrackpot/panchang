'use client';

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
          const tz = -(new Date().getTimezoneOffset() / 60);
          const now = new Date();
          const res = await fetch(`/api/panchang?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&tz=${tz}&year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}`);
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
      {isHi ? 'पंचांग लोड नहीं हो सका। कृपया स्थान अनुमति दें।' : 'Could not load panchang. Please allow location access.'}
    </div>
  );

  if (!data) return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#0a0e27', color: '#d4a853', padding: '20px', borderRadius: '12px', textAlign: 'center', fontSize: '12px' }}>
      {isHi ? 'पंचांग लोड हो रहा है...' : 'Loading panchang...'}
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
          {isHi ? 'आज का पंचांग' : "Today's Panchang"}
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
              { label: isHi ? 'तिथि' : 'Tithi', value: L(data.tithi.name) },
              { label: isHi ? 'नक्षत्र' : 'Nakshatra', value: `${L(data.nakshatra.name)} (${isHi ? 'पाद' : 'Pada'} ${data.nakshatra.pada})` },
              { label: isHi ? 'योग' : 'Yoga', value: L(data.yoga.name) },
              { label: isHi ? 'करण' : 'Karana', value: L(data.karana.name) },
              { label: isHi ? 'वार' : 'Vara', value: L(data.vara.name) },
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
          <div style={{ color: textSec, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isHi ? 'सूर्योदय' : 'Sunrise'}</div>
          <div style={{ color: '#e67e22', fontWeight: 700, fontFamily: 'monospace' }}>{data.sunrise}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: textSec, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isHi ? 'सूर्यास्त' : 'Sunset'}</div>
          <div style={{ color: '#3498db', fontWeight: 700, fontFamily: 'monospace' }}>{data.sunset}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: textSec, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isHi ? 'राहु काल' : 'Rahu Kaal'}</div>
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
