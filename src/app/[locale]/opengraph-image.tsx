import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dekho Panchang — Vedic Astrology';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #111638 40%, #1a1f4e 70%, #0a0e27 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Gold border */}
        <div
          style={{
            position: 'absolute',
            inset: '16px',
            border: '1px solid rgba(212, 168, 83, 0.3)',
            borderRadius: '16px',
            display: 'flex',
          }}
        />

        {/* Decorative corner ornaments */}
        <div
          style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            width: '40px',
            height: '40px',
            borderTop: '2px solid #d4a853',
            borderLeft: '2px solid #d4a853',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '32px',
            right: '32px',
            width: '40px',
            height: '40px',
            borderTop: '2px solid #d4a853',
            borderRight: '2px solid #d4a853',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '32px',
            width: '40px',
            height: '40px',
            borderBottom: '2px solid #d4a853',
            borderLeft: '2px solid #d4a853',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '32px',
            width: '40px',
            height: '40px',
            borderBottom: '2px solid #d4a853',
            borderRight: '2px solid #d4a853',
            display: 'flex',
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #d4a853, #f0d48a, #d4a853)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '16px',
            display: 'flex',
          }}
        >
          Dekho Panchang
        </div>

        {/* Divider */}
        <div
          style={{
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
            marginBottom: '24px',
            display: 'flex',
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#9b97a0',
            display: 'flex',
          }}
        >
          The Science of Indian Astronomy
        </div>

        {/* Sanskrit shloka */}
        <div
          style={{
            fontSize: '20px',
            color: '#8a6d2b',
            marginTop: '24px',
            display: 'flex',
          }}
        >
          ज्योतिषां सूर्यादिग्रहाणां बोधकं शास्त्रम्
        </div>
      </div>
    ),
    { ...size }
  );
}
