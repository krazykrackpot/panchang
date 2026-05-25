import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Vedic vs Western Sign Calculator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/sign-calculator", locale, "Vedic Sign Calculator"),
    tagline: "VEDIC + TROPICAL",
    footer: "Find your Vedic Rashi · Compare with Western Sun sign",
  });
}
