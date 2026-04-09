import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dekho Panchang — Vedic Astrology';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
        }}
      >
        {/* Gold decorative line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginBottom: 24, borderRadius: 2, display: 'flex' }} />

        {/* Title */}
        <div style={{ fontSize: 64, fontWeight: 800, color: '#f0d48a', letterSpacing: -1, marginBottom: 12, display: 'flex' }}>
          Dekho Panchang
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 28, color: '#8a8478', letterSpacing: 2, display: 'flex' }}>
          VEDIC ASTROLOGY
        </div>

        {/* Features line */}
        <div style={{ fontSize: 22, color: '#d4a853', marginTop: 32, opacity: 0.8, display: 'flex' }}>
          Panchang · Kundali · Muhurta · Matching
        </div>

        {/* Bottom decorative line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginTop: 24, borderRadius: 2, display: 'flex' }} />
      </div>
    ),
    { ...size }
  );
}
