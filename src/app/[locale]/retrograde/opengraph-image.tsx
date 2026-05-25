import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = 'Retrograde Calendar 2026';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle('/retrograde', locale, 'Retrograde Calendar 2026'),
    tagline: 'VAKRI GRAHAS',
    footer: 'Mercury · Venus · Mars · Jupiter · Saturn stations',
  });
}
