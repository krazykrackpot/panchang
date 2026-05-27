import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { CITIES } from '@/lib/constants/cities';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { ACTIVITY_SLUGS, MONTH_MAP, MONTH_NAMES } from './shared';

// Hindi month names — mirrored for mai/mr (all three share Devanagari +
// the same Hindi month nomenclature in everyday Indian usage).
const MONTH_NAMES_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string; year: string; month: string; city: string }> }): Promise<Metadata> {
  const { locale, type: activitySlug, year, month: monthStr, city: citySlug } = await params;
  setRequestLocale(locale);

  const activityId = ACTIVITY_SLUGS[activitySlug];
  const cityData = CITIES.find(c => c.slug === citySlug);
  const monthNum = MONTH_MAP[monthStr.toLowerCase()];

  if (!activityId || !cityData || !monthNum) return {};

  const activity = getExtendedActivity(activityId);
  const cityName = tl(cityData.name, locale);
  const activityName = tl(activity.label, locale);

  // SEO step 1 + Gemini #239: lead with "Shubh Muhurat" (high-volume
  // search term in EN+HI markets) + "{Activity} {Year}" matching the
  // dominant query form. Localise the title + description for
  // Devanagari locales (hi, mai, mr) so we don't ship "विवाह Shubh
  // Muhurat 2026 in मुंबई" mixed-language SERPs. Other regional locales
  // (ta/te/bn/kn/gu) fall back to English — acceptable per project
  // memory `feedback_four_locales`.
  const isHi = isDevanagariLocale(locale);
  const monthName = isHi ? MONTH_NAMES_HI[monthNum - 1] : MONTH_NAMES[monthNum - 1];

  const title = isHi
    ? `${cityName} में ${activityName} शुभ मुहूर्त ${year} — ${monthName} की तिथियाँ और समय`
    : `${activityName} Shubh Muhurat ${year} in ${cityName} — ${monthName} Dates & Times`;

  const description = isHi
    ? `${cityName} में ${monthName} ${year} के लिए सर्वश्रेष्ठ ${activityName} शुभ मुहूर्त। तिथि, नक्षत्र, योग और ग्रह गोचर के अनुसार चयनित। निःशुल्क, सटीक।`
    : `Best ${activityName.toLowerCase()} shubh muhurat in ${cityName} for ${monthName} ${year}. Auspicious dates scored by tithi, nakshatra, yoga, and planetary transits. Free.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
