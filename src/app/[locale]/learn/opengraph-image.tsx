import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Learn Vedic Astrology — Dekho Panchang';
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

        {/* Gold decorative line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginBottom: 24, borderRadius: 2, display: 'flex' }} />

        {/* Title */}
        <div style={{ fontSize: 60, fontWeight: 800, color: '#f0d48a', letterSpacing: -1, marginBottom: 16, display: 'flex' }}>
          Learn Vedic Astrology
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: '#8a8478', letterSpacing: 1, display: 'flex' }}>
          90 Modules &middot; 24 Courses &middot; Trilingual
        </div>

        {/* Bottom decorative line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginTop: 32, borderRadius: 2, display: 'flex' }} />

        {/* Footer */}
        <div style={{ fontSize: 15, color: '#8a8478', marginTop: 32, opacity: 0.5, letterSpacing: 1, display: 'flex' }}>
          dekhopanchang.com
        </div>
      </div>
    ),
    { ...size }
  );
}
