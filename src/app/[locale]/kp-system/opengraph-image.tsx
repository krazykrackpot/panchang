import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "KP System — Krishnamurti Paddhati";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/kp-system", locale, "KP System"),
    tagline: "SUB-LORD PRECISION",
    footer: "Placidus houses · 249 sub-lords · Significators",
  });
}
