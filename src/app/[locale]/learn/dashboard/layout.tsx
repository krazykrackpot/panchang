import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'hi' ? 'मेरा सीखने का डैशबोर्ड' :
                locale === 'ta' ? 'என் கற்றல் டாஷ்போர்ட்' :
                locale === 'bn' ? 'আমার শেখার ড্যাশবোর্ড' :
                'My Learning Dashboard';
  const description = locale === 'hi' ? 'अपनी ज्योतिष शिक्षा प्रगति, स्ट्रीक, स्तर और बैज ट्रैक करें' :
                      locale === 'ta' ? 'உங்கள் ஜோதிட கற்றல் முன்னேற்றம், தொடர், நிலை மற்றும் பதக்கங்களைக் கண்காணிக்கவும்' :
                      locale === 'bn' ? 'আপনার জ্যোতিষ শিক্ষার অগ্রগতি, ধারাবাহিকতা, স্তর এবং ব্যাজ ট্র্যাক করুন' :
                      'Track your Jyotish learning progress, streak, level, and badges';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/dashboard`,
      languages: {
        en: `${BASE_URL}/en/learn/dashboard`,
        hi: `${BASE_URL}/hi/learn/dashboard`,
        ta: `${BASE_URL}/ta/learn/dashboard`,
        bn: `${BASE_URL}/bn/learn/dashboard`,
      },
    },
    robots: { index: false },
  };
}

export default function LearnDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
