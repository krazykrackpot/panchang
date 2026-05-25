import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = 'Sade Sati — Saturn 7.5-Year Transit Check';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: 'Sade Sati Check',
    tagline: 'SATURN 7½ YEAR TRANSIT',
    footer: 'Current phase · Status · Classical remedies',
  });
}
