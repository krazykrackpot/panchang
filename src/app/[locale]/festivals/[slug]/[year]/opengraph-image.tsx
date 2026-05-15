import { ImageResponse } from 'next/og';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { tl } from '@/lib/utils/trilingual';

export const runtime = 'edge';
export const alt = 'Festival Date — Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string; year: string }> }) {
  const { locale, slug, year } = await params;
  const detail = FESTIVAL_DETAILS[slug];
  const festivalName = detail ? tl(detail.name, locale) : slug.replace(/-/g, ' ');

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #2d1b69 50%, #0a0e27 100%)',
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
        <div style={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(212, 168, 83, 0.12)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 260, height: 260, borderRadius: '50%', border: '1px solid rgba(212, 168, 83, 0.08)', display: 'flex' }} />

        {/* Gold decorative line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginBottom: 24, borderRadius: 2, display: 'flex' }} />

        {/* Festival name */}
        <div style={{ fontSize: 60, fontWeight: 800, color: '#f0d48a', letterSpacing: -1, marginBottom: 12, display: 'flex', textAlign: 'center', paddingLeft: 40, paddingRight: 40 }}>
          {festivalName}
        </div>

        {/* Year */}
        <div style={{ fontSize: 48, fontWeight: 700, color: '#e6e2d8', marginBottom: 16, display: 'flex' }}>
          {year}
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 22, color: '#8a8478', display: 'flex' }}>
          {locale === 'hi' ? 'तिथि, मुहूर्त एवं पूजा समय' : 'Date, Muhurta & Puja Timings'}
        </div>

        {/* Gold decorative line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginTop: 28, borderRadius: 2, display: 'flex' }} />

        {/* Footer */}
        <div style={{ fontSize: 15, color: '#8a8478', marginTop: 28, opacity: 0.5, letterSpacing: 1, display: 'flex' }}>
          dekhopanchang.com
        </div>
      </div>
    ),
    { ...size }
  );
}
