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
  const isHi = isDevanagariLocale(locale);

  // Pick city + activity in the SAME script as the template chrome.
  // - English template: use EN throughout (Gemini #239 re-review MED).
  //   Previously `tl(... , locale)` gave ta/te/bn/kn/gu users mixed
  //   script titles like "திருமணம் Shubh Muhurat 2026 in சென்னை".
  // - Devanagari template: prefer the specific locale (mr/mai/sa)
  //   when authored, fall back to Hindi (still Devanagari), and only
  //   fall to EN if neither exists (Gemini #263 re-review MED).
  //   Pure `tl(... , 'mr')` falls straight to EN if the Marathi field
  //   is empty, producing "मुंबई में Wedding शुभ मुहूर्त" — mixed
  //   script inside what should be a fully-Devanagari title.
  function pickDevanagari<T extends { en: string; hi?: string; [k: string]: string | undefined }>(
    obj: T,
  ): string {
    const localeVal = obj[locale as keyof T] as string | undefined;
    return localeVal ?? obj.hi ?? obj.en;
  }
  const cityName = isHi ? pickDevanagari(cityData.name) : cityData.name.en;
  const activityName = isHi ? pickDevanagari(activity.label) : activity.label.en;

  // Lead with "Shubh Muhurat" (high-volume search term in EN+HI markets)
  // + "{Activity} {Year}" matching the dominant query form.
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
