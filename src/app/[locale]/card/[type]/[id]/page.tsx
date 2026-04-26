import type { Metadata } from 'next';
import { isValidCardType, CARD_DIMENSIONS } from '@/lib/shareable/card-base';
import { Link } from '@/lib/i18n/navigation';

// ---------------------------------------------------------------------------
// Metadata — OG images point to the card API route for link previews
// ---------------------------------------------------------------------------

interface PageParams {
  locale: string;
  type: string;
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { type, id } = await params;

  const typeLabel = type
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const ogUrl = `/api/card/${type}?format=og&id=${encodeURIComponent(id)}`;
  const { width, height } = CARD_DIMENSIONS.og;

  return {
    title: `${typeLabel} | Dekho Panchang`,
    description: `View this ${typeLabel} on Dekho Panchang — Vedic astrology for the modern world.`,
    openGraph: {
      title: `${typeLabel} | Dekho Panchang`,
      description: `View this ${typeLabel} on Dekho Panchang.`,
      images: [
        {
          url: ogUrl,
          width,
          height,
          alt: typeLabel,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${typeLabel} | Dekho Panchang`,
      images: [ogUrl],
    },
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function ShareableCardPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { type, id } = await params;

  if (!isValidCardType(type)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <p className="text-text-secondary">Invalid card type.</p>
      </div>
    );
  }

  const typeLabel = type
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Build the card image URL with story format for the page display
  const cardImageUrl = `/api/card/${type}?format=story&id=${encodeURIComponent(id)}`;

  // CTA destination based on card type
  const ctaHref =
    type === 'daily-vibe' ? '/panchang' : '/kundali';
  const ctaText =
    type === 'daily-vibe'
      ? 'Check your daily vibe'
      : 'Create your own chart';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-4 py-12">
      {/* Card image */}
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gold-primary/10 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element -- Generated card image, not a content photo */}
        <img
          src={cardImageUrl}
          alt={typeLabel}
          width={1080}
          height={1920}
          className="h-auto w-full"
          loading="eager"
        />
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-xl bg-gold-primary px-8 py-3 text-lg font-semibold text-bg-primary transition-colors hover:bg-gold-light"
        >
          {ctaText} at Dekho Panchang
        </Link>

        <p className="text-sm text-text-secondary">
          Free Vedic astrology tools — no signup required
        </p>
      </div>
    </div>
  );
}
