import type { Metadata } from 'next';
import { CITIES } from '@/lib/constants/cities';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { tl } from '@/lib/utils/trilingual';
import { ACTIVITY_SLUGS, MONTH_MAP, MONTH_NAMES } from './shared';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string; year: string; month: string; city: string }> }): Promise<Metadata> {
  const { locale, type: activitySlug, year, month: monthStr, city: citySlug } = await params;

  const activityId = ACTIVITY_SLUGS[activitySlug];
  const cityData = CITIES.find(c => c.slug === citySlug);
  const monthNum = MONTH_MAP[monthStr.toLowerCase()];

  if (!activityId || !cityData || !monthNum) return {};

  const activity = getExtendedActivity(activityId);
  const cityName = tl(cityData.name, locale);
  const activityName = tl(activity.label, locale);
  const monthName = MONTH_NAMES[monthNum - 1];

  const title = `Best Muhurta for ${activityName} in ${monthName} ${year} — ${cityName} | Dekho Panchang`;
  const description = `Find the most auspicious dates and times for ${activityName.toLowerCase()} in ${cityName} during ${monthName} ${year}. Scored by tithi, nakshatra, yoga, and planetary transits.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
