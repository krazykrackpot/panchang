import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getMuhurtaType } from '@/lib/constants/muhurta-types';

/** Get current month name, e.g. "April" */
function currentMonthName(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;

  // Try to get the muhurta type info for a richer title
  const info = getMuhurtaType(type);
  if (info) {
    const locKey = locale as 'en' | 'hi' | 'sa';
    const name = info.name[locKey] || info.name.en;
    const nameEn = info.name.en;
    const year = new Date().getFullYear();
    const month = currentMonthName();

    // Show the next auspicious date if available
    const nextDate = info.dates2026?.[0];
    let dateHint = '';
    if (nextDate) {
      const [, m, d] = nextDate.date.split('-').map(Number);
      const dt = new Date(Date.UTC(year, m - 1, d));
      dateHint = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    }

    // Title under 60 chars: "Wedding Muhurat 2026 — Next: May 14"
    const title = dateHint
      ? `${name} ${year} — Next: ${dateHint} | Dekho Panchang`
      : `${name} ${year} — ${month} Dates | Dekho Panchang`;

    // Description under 155 chars
    const description = dateHint
      ? `${nameEn} ${year}: next auspicious date ${dateHint}. Vedic Panchang-based dates with nakshatra, tithi & planetary analysis.`.slice(0, 155)
      : `${nameEn} ${year}: auspicious dates for ${month}. Vedic Panchang-based recommendations with nakshatra & tithi analysis.`.slice(0, 155);

    return {
      title,
      description,
      keywords: info.keywords,
      openGraph: { title, description },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  // Fallback to centralized metadata
  return getPageMetadata(`/muhurta/${type}`, locale);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
