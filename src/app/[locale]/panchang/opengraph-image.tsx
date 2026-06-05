import { ImageResponse } from 'next/og';
import {
  dateToJD,
  toSidereal,
  moonLongitude,
  calculateTithi,
  calculateYoga,
  getNakshatraNumber,
} from '@/lib/ephem/astronomical';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/types/panchang';

// Daily revalidation — content changes once per day, not hourly. Daily
// cadence + once-per-region generation means the Node runtime is fine;
// Edge gave no useful speed-up but forced an inlined Meeus implementation
// that drifted from the canonical engine (audit P3 #6).
export const alt = "Today's Panchang — Dekho Panchang";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 86400;

// Map our app locale → an Intl.DateTimeFormat tag for the date label.
// Fall back to the locale itself; Node's Intl handles unknown tags via
// best-fit so the worst case is en-US.
const INTL_LOCALE: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  kn: 'kn-IN',
  gu: 'gu-IN',
  mai: 'mai',  // best-fit
  mr: 'mr-IN',
};

// ─── OG Image ───────────────────────────────────────────────────────────────

export default function Image({ params }: { params: { locale: string } }) {
  const locale = (params?.locale ?? 'en') as Locale;
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const jd = dateToJD(year, month, day, 12); // noon UT for stable values

  // Canonical engine helpers — same code path the /panchang page uses.
  // calculateTithi + calculateYoga internally derive sunLongitude; only
  // moonSid is needed independently for the nakshatra lookup.
  const moonSid = toSidereal(moonLongitude(jd), jd);

  const tithiResult = calculateTithi(jd);
  const tithiNum = tithiResult.number;
  const tithiName = tl(TITHIS[tithiNum - 1]?.name, locale) || 'Unknown';
  const paksha = tithiNum <= 15 ? 'Shukla' : 'Krishna';

  const nakshatraNum = getNakshatraNumber(moonSid);
  const nakshatraName = tl(NAKSHATRAS[nakshatraNum - 1]?.name, locale) || 'Unknown';

  const yogaNum = calculateYoga(jd);
  const yogaName = tl(YOGAS[yogaNum - 1]?.name, locale) || 'Unknown';

  const dateStr = now.toLocaleDateString(INTL_LOCALE[locale] ?? 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1040 50%, #0a0e27 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '1px solid rgba(212, 168, 83, 0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '1px solid rgba(212, 168, 83, 0.08)',
            display: 'flex',
          }}
        />

        {/* Header */}
        <div
          style={{
            fontSize: 18,
            color: '#8a8478',
            letterSpacing: 4,
            marginBottom: 12,
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          {"Today's Panchang"}
        </div>

        {/* Date */}
        <div
          style={{
            fontSize: 38,
            color: '#f0d48a',
            fontWeight: 700,
            marginBottom: 8,
            display: 'flex',
          }}
        >
          {dateStr}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
            marginTop: 16,
            marginBottom: 32,
            display: 'flex',
          }}
        />

        {/* Panchang elements row */}
        <div style={{ display: 'flex', gap: 64, marginTop: 0 }}>
          {/* Tithi */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#8a8478', marginBottom: 6, letterSpacing: 2, display: 'flex' }}>
              TITHI
            </div>
            <div style={{ fontSize: 28, color: '#d4a853', fontWeight: 600, display: 'flex' }}>{tithiName}</div>
            <div style={{ fontSize: 14, color: '#8a8478', marginTop: 4, display: 'flex' }}>{paksha} Paksha</div>
          </div>

          {/* Nakshatra */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#8a8478', marginBottom: 6, letterSpacing: 2, display: 'flex' }}>
              NAKSHATRA
            </div>
            <div style={{ fontSize: 28, color: '#d4a853', fontWeight: 600, display: 'flex' }}>{nakshatraName}</div>
          </div>

          {/* Yoga */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#8a8478', marginBottom: 6, letterSpacing: 2, display: 'flex' }}>
              YOGA
            </div>
            <div style={{ fontSize: 28, color: '#d4a853', fontWeight: 600, display: 'flex' }}>{yogaName}</div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 15,
            color: '#8a8478',
            marginTop: 48,
            opacity: 0.5,
            letterSpacing: 1,
            display: 'flex',
          }}
        >
          dekhopanchang.com
        </div>
      </div>
    ),
    { ...size }
  );
}
