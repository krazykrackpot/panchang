import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600; // Refresh every hour

// ─── Inlined rashi data (edge-safe, no native deps) ─────────────────────────

const RASHI_MAP: Record<string, { vedic: string; western: string; symbol: string }> = {
  mesh:      { vedic: 'Mesh',      western: 'Aries',       symbol: '♈' },
  vrishabh:  { vedic: 'Vrishabh', western: 'Taurus',      symbol: '♉' },
  mithun:    { vedic: 'Mithun',   western: 'Gemini',      symbol: '♊' },
  kark:      { vedic: 'Kark',     western: 'Cancer',      symbol: '♋' },
  simha:     { vedic: 'Simha',    western: 'Leo',         symbol: '♌' },
  kanya:     { vedic: 'Kanya',    western: 'Virgo',       symbol: '♍' },
  tula:      { vedic: 'Tula',     western: 'Libra',       symbol: '♎' },
  vrishchik: { vedic: 'Vrishchik',western: 'Scorpio',     symbol: '♏' },
  dhanu:     { vedic: 'Dhanu',    western: 'Sagittarius', symbol: '♐' },
  makar:     { vedic: 'Makar',    western: 'Capricorn',   symbol: '♑' },
  kumbh:     { vedic: 'Kumbh',    western: 'Aquarius',    symbol: '♒' },
  meen:      { vedic: 'Meen',     western: 'Pisces',      symbol: '♓' },
};

// Western slug aliases → vedic slug
const WESTERN_TO_VEDIC: Record<string, string> = {
  aries: 'mesh', taurus: 'vrishabh', gemini: 'mithun', cancer: 'kark',
  leo: 'simha', virgo: 'kanya', libra: 'tula', scorpio: 'vrishchik',
  sagittarius: 'dhanu', capricorn: 'makar', aquarius: 'kumbh', pisces: 'meen',
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getRashiInfo(slug: string) {
  const vedicSlug = RASHI_MAP[slug] ? slug : WESTERN_TO_VEDIC[slug.toLowerCase()];
  return vedicSlug ? RASHI_MAP[vedicSlug] : null;
}

// ─── OG Image ───────────────────────────────────────────────────────────────

export const alt = 'Monthly Horoscope — Dekho Panchang';

export default async function Image({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  // params is a Promise in Next.js 16 — must be awaited before accessing properties.
  const { rashi: rashiSlug } = await params;

  const rashiInfo = getRashiInfo(rashiSlug ?? '');
  const vedicName = rashiInfo?.vedic ?? 'Horoscope';
  const westernName = rashiInfo?.western ?? '';
  const symbol = rashiInfo?.symbol ?? '✦';

  const now = new Date();
  const monthName = MONTH_NAMES[now.getUTCMonth()];
  const year = now.getUTCFullYear();

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
        {/* Decorative circles */}
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

        {/* Top eyebrow */}
        <div
          style={{
            fontSize: 13,
            letterSpacing: 5,
            color: '#d4a853',
            textTransform: 'uppercase',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 32, height: 1, background: '#d4a853', opacity: 0.5, display: 'flex' }} />
          MONTHLY HOROSCOPE
          <div style={{ width: 32, height: 1, background: '#d4a853', opacity: 0.5, display: 'flex' }} />
        </div>

        {/* Zodiac symbol */}
        <div
          style={{
            fontSize: 72,
            color: '#d4a853',
            marginBottom: 8,
            display: 'flex',
            opacity: 0.85,
          }}
        >
          {symbol}
        </div>

        {/* Rashi name (Vedic + Western) */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#f0d48a',
            letterSpacing: -1,
            marginBottom: 4,
            display: 'flex',
          }}
        >
          {vedicName}
        </div>
        {westernName ? (
          <div
            style={{
              fontSize: 24,
              color: '#8a8478',
              letterSpacing: 2,
              marginBottom: 20,
              display: 'flex',
            }}
          >
            {westernName}
          </div>
        ) : null}

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
            marginTop: 8,
            marginBottom: 24,
            display: 'flex',
          }}
        />

        {/* Month + Year */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div style={{ fontSize: 28, color: '#d4a853', fontWeight: 700, display: 'flex' }}>
            {monthName}
          </div>
          <div style={{ fontSize: 22, color: '#8a8478', fontWeight: 400, display: 'flex' }}>
            {year}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 15,
            color: '#8a8478',
            marginTop: 40,
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
