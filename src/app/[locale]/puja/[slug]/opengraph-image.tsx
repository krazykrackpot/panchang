import { ImageResponse } from 'next/og';
import { pickByScript } from "@/lib/utils/locale-fonts";

export const runtime = 'edge';
export const alt = 'Puja Vidhi — Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Format slug to title: "ganesh-chaturthi" → "Ganesh Chaturthi" */
function slugToTitle(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const pujaName = slugToTitle(slug);

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
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(212, 168, 83, 0.1)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(212, 168, 83, 0.08)', display: 'flex' }} />

        {/* Gold line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginBottom: 24, borderRadius: 2, display: 'flex' }} />

        {/* Puja name */}
        <div style={{ fontSize: 52, fontWeight: 800, color: '#f0d48a', letterSpacing: -1, marginBottom: 16, display: 'flex', textAlign: 'center', paddingLeft: 40, paddingRight: 40 }}>
          {pujaName}
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 26, color: '#e6e2d8', display: 'flex' }}>
          {pickByScript('Puja Vidhi', 'पूजा विधि', locale)}
        </div>

        {/* Description */}
        <div style={{ fontSize: 18, color: '#8a8478', marginTop: 12, display: 'flex' }}>
          {pickByScript('Mantras · Samagri · Vidhi · Sankalpa', 'मंत्र · सामग्री · विधि · संकल्प', locale)}
        </div>

        {/* Gold line */}
        <div style={{ width: 80, height: 3, background: '#d4a853', marginTop: 28, borderRadius: 2, display: 'flex' }} />

        <div style={{ fontSize: 15, color: '#8a8478', marginTop: 28, opacity: 0.5, letterSpacing: 1, display: 'flex' }}>
          dekhopanchang.com
        </div>
      </div>
    ),
    { ...size }
  );
}
