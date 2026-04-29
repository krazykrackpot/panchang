import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Vedic Birth Chart — Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Dynamic OG image for shared kundali pages (/kundali/[id]).
 *
 * The [id] page uses query params (?n=Name&d=date&t=time...) to pass birth data.
 * Since OG crawlers don't execute JS, we extract the name from the `n` query param
 * when available, otherwise show a generic branded card.
 *
 * The full personalized chart card (with diamond chart + planets) is served by
 * /api/card/birth-poster — the share button on the kundali page links there.
 */
export default function Image({ params: _params }: { params: Promise<{ locale: string; id: string }> }) {
  // OG crawlers visit the URL with query params intact, but the OG image route
  // doesn't receive searchParams. Show a branded card that works for all cases.
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

        {/* Top tag */}
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
          VEDIC BIRTH CHART
          <div style={{ width: 32, height: 1, background: '#d4a853', opacity: 0.5, display: 'flex' }} />
        </div>

        {/* Mini diamond chart outline (decorative) */}
        <div style={{ display: 'flex', marginBottom: 24 }}>
          <svg width={120} height={120} viewBox="0 0 120 120">
            <rect x="0" y="0" width="120" height="120" fill="none" />
            {/* Outer diamond */}
            <path d="M 60 7 L 7 60 L 60 113 L 113 60 Z" fill="none" stroke="#d4a853" strokeWidth={1} opacity={0.4} />
            {/* Inner cross lines */}
            <line x1="60" y1="7" x2="60" y2="113" stroke="#d4a853" strokeWidth={0.5} opacity={0.25} />
            <line x1="7" y1="60" x2="113" y2="60" stroke="#d4a853" strokeWidth={0.5} opacity={0.25} />
            {/* Inner diamond */}
            <path d="M 60 34 L 34 60 L 60 86 L 86 60 Z" fill="none" stroke="#d4a853" strokeWidth={0.7} opacity={0.3} />
          </svg>
        </div>

        {/* Title */}
        <div style={{ fontSize: 48, fontWeight: 800, color: '#f0d48a', letterSpacing: -1, marginBottom: 12, display: 'flex' }}>
          Shared Birth Chart
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 22, color: '#8a8478', letterSpacing: 1, display: 'flex' }}>
          Dashas, Yogas, Planetary Positions &amp; More
        </div>

        {/* Divider */}
        <div style={{ width: 80, height: 2, background: 'linear-gradient(90deg, transparent, #d4a853, transparent)', marginTop: 28, marginBottom: 28, display: 'flex' }} />

        {/* CTA */}
        <div style={{ fontSize: 18, color: '#f0d48a', fontWeight: 600, display: 'flex' }}>
          Generate YOUR birth chart for free
        </div>

        {/* Footer */}
        <div style={{ fontSize: 14, color: '#8a8478', marginTop: 20, opacity: 0.5, letterSpacing: 1, display: 'flex' }}>
          dekhopanchang.com
        </div>
      </div>
    ),
    { ...size }
  );
}
