import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = 'Solar & Lunar Eclipse Calendar 2026';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: 'Solar & Lunar Eclipses 2026',
    tagline: 'ECLIPSE CALENDAR',
    footer: 'Sutak times · Visibility · Traditional remedies',
  });
}
