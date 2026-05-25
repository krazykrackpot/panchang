import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = 'Nakshatra-Based Baby Names';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: 'Nakshatra Baby Names',
    tagline: 'BIRTH-NAKSHATRA ALIGNED',
    footer: '27 nakshatras · 108 padas · Sanskrit + modern variants',
  });
}
