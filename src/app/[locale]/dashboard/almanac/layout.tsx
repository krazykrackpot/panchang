import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'Year in the Stars — Dekho Panchang',
    hi: 'सितारों में वर्ष — देखो पंचांग',
    ta: 'நட்சத்திரங்களில் ஆண்டு — தேக்கோ பஞ்சாங்கம்',
    bn: 'তারাদের মধ্যে বছর — দেখো পঞ্চাঙ্গ',
  };

  const descs: Record<string, string> = {
    en: 'Your personalised annual almanac — mood trends, life events, nakshatra affinities, and prediction accuracy for the year.',
    hi: 'आपका व्यक्तिगत वार्षिक पंचांग — वर्ष के लिए मनोदशा प्रवृत्तियाँ, जीवन घटनाएँ, नक्षत्र समानताएँ और भविष्यवाणी सटीकता।',
    ta: 'உங்கள் தனிப்பட்ட வருடாந்திர பஞ்சாங்கம் — ஆண்டிற்கான மனநிலை போக்குகள், வாழ்க்கை நிகழ்வுகள், நட்சத்திர ஈர்ப்புகள் மற்றும் கணிப்பு துல்லியம்.',
    bn: 'আপনার ব্যক্তিগতকৃত বার্ষিক পঞ্চাঙ্গ — বছরের জন্য মেজাজের প্রবণতা, জীবনের ঘটনা, নক্ষত্র আত্মীয়তা এবং ভবিষ্যদ্বাণীর নির্ভুলতা।',
  };

  const title = titles[locale] ?? titles.en;
  const description = descs[locale] ?? descs.en;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${BASE_URL}/${locale}/dashboard/almanac`,
      languages: {
        en: `${BASE_URL}/en/dashboard/almanac`,
        hi: `${BASE_URL}/hi/dashboard/almanac`,
        ta: `${BASE_URL}/ta/dashboard/almanac`,
        bn: `${BASE_URL}/bn/dashboard/almanac`,
      },
    },
  };
}

export default function AlmanacLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
