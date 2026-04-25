import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = tl(
    {
      en: 'Prediction Scorecard — Dekho Panchang',
      hi: 'भविष्यवाणी स्कोरकार्ड — देखो पंचांग',
      sa: 'भविष्यवाणी-फलपत्र — देखो पंचांग',
      ta: 'கணிப்பு மதிப்பெண் அட்டை — தேக்கோ பஞ்சாங்கம்',
      bn: 'ভবিষ্যদ্বাণী স্কোরকার্ড — দেখো পঞ্চাঙ্গ',
    },
    locale,
  );

  const description = tl(
    {
      en: 'Track astrological predictions and measure their accuracy over time.',
      hi: 'ज्योतिषीय भविष्यवाणियों को ट्रैक करें और समय के साथ उनकी सटीकता मापें।',
      sa: 'ज्योतिषीय भविष्यवाणीः अनुवर्तयतु तासां सटीकतां च कालेन मापयतु।',
      ta: 'ஜோதிட கணிப்புகளை கண்காணித்து காலப்போக்கில் அவற்றின் துல்லியத்தை அளவிடுங்கள்.',
      bn: 'জ্যোতিষ ভবিষ্যদ্বাণী ট্র্যাক করুন এবং সময়ের সাথে সঠিকতা পরিমাপ করুন।',
    },
    locale,
  );

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${BASE_URL}/${locale}/dashboard/predictions`,
    },
  };
}

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
