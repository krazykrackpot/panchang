import { ImageResponse } from 'next/og';
import { getCityBySlugExtended } from '@/lib/constants/cities-extended';
import { pickByScript } from "@/lib/utils/locale-fonts";

export const runtime = 'edge';
export const alt = 'Panchang Today — Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ locale: string; city: string }> }) {
  const { locale, city: slug } = await params;
  const city = getCityBySlugExtended(slug);
  const cityName = city ? (pickByScript(city.name.en, (city.name.hi || city.name.en), locale)) : slug;
  const stateName = city?.state || '';
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

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
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(212, 168, 83, 0.1)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(212, 168, 83, 0.08)', display: 'flex' }} />

        {/* Gold decorative line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginBottom: 20, borderRadius: 2, display: 'flex' }} />

        {/* City name */}
        <div style={{ fontSize: 56, fontWeight: 800, color: '#f0d48a', letterSpacing: -1, marginBottom: 8, display: 'flex' }}>
          {cityName}
        </div>

        {/* State */}
        {stateName && (
          <div style={{ fontSize: 22, color: '#8a8478', marginBottom: 20, display: 'flex' }}>
            {stateName}
          </div>
        )}

        {/* Panchang Today */}
        <div style={{ fontSize: 32, fontWeight: 600, color: '#e6e2d8', marginBottom: 8, display: 'flex' }}>
          {pickByScript('Panchang Today', 'आज का पंचांग', locale)}
        </div>

        {/* Date */}
        <div style={{ fontSize: 20, color: '#8a8478', marginBottom: 24, display: 'flex' }}>
          {today}
        </div>

        {/* Gold decorative line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginTop: 8, borderRadius: 2, display: 'flex' }} />

        {/* Footer */}
        <div style={{ fontSize: 15, color: '#8a8478', marginTop: 28, opacity: 0.5, letterSpacing: 1, display: 'flex' }}>
          dekhopanchang.com
        </div>
      </div>
    ),
    { ...size }
  );
}
