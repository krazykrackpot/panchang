import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: 'Dasha Diary — Dekho Panchang',
    hi: 'दशा डायरी — देखो पंचांग',
    ta: 'தசா டைரி — தேக்கோ பஞ்சாங்கம்',
    bn: 'দশা ডায়েরি — দেখো পঞ্চাং',
  };
  const descs: Record<string, string> = {
    en: 'Reflect on your current dasha period with personalised prompts aligned to your natal chart.',
    hi: 'अपनी जन्म कुण्डली के अनुसार वर्तमान दशाकाल पर व्यक्तिगत संकेतों के साथ विचार करें।',
    ta: 'உங்கள் ஜாதகத்திற்கு ஏற்ப தனிப்பட்ட தூண்டுதல்களுடன் தற்போதைய தசாகாலத்தை சிந்தியுங்கள்.',
    bn: 'আপনার জন্মকুণ্ডলী অনুযায়ী ব্যক্তিগতকৃত প্রম্পটের মাধ্যমে বর্তমান দশাকাল নিয়ে ভাবুন।',
  };
  const title = titles[locale] ?? titles.en;
  const description = descs[locale] ?? descs.en;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${BASE_URL}/${locale}/dashboard/dasha-diary`,
      languages: {
        en: `${BASE_URL}/en/dashboard/dasha-diary`,
        hi: `${BASE_URL}/hi/dashboard/dasha-diary`,
        ta: `${BASE_URL}/ta/dashboard/dasha-diary`,
        bn: `${BASE_URL}/bn/dashboard/dasha-diary`,
      },
    },
  };
}

export default function DashaDiaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
