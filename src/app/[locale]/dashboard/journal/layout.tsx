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
      en: 'Astro Journal — Dekho Panchang',
      hi: 'ज्योतिष डायरी — देखो पंचांग',
      sa: 'ज्योतिष-दैनिकी — देखो पंचांग',
      ta: 'ஜோதிட ஜர்னல் — தேக்கோ பஞ்சாங்கம்',
      bn: 'জ্যোতিষ জার্নাল — দেখো পঞ্চাঙ্গ',
    },
    locale,
  );

  const description = tl(
    {
      en: 'Track your daily mood, energy, and planetary alignments in your personal Astro Journal.',
      hi: 'अपनी व्यक्तिगत ज्योतिष डायरी में दैनिक मनोदशा, ऊर्जा और ग्रहीय स्थितियों को ट्रैक करें।',
      sa: 'स्वीये ज्योतिष-दैनिक्यां दैनिकमनोदशाम्, ऊर्जां, ग्रहस्थितिं च अनुवर्तयतु।',
      ta: 'உங்கள் தனிப்பட்ட ஜோதிட ஜர்னலில் தினசரி மனநிலை, ஆற்றல் மற்றும் கோள நிலைகளை கண்காணியுங்கள்.',
      bn: 'আপনার ব্যক্তিগত জ্যোতিষ জার্নালে দৈনিক মেজাজ, শক্তি এবং গ্রহীয় অবস্থান ট্র্যাক করুন।',
    },
    locale,
  );

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${BASE_URL}/${locale}/dashboard/journal`,
    },
  };
}

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
