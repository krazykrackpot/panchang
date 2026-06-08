import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { BASE_URL } from '@/lib/seo/base-url';

// Title + description per visible locale. /learn/dashboard is
// `robots: { index: false }` (personal dashboard, not for search),
// but we still want proper metadata for the OG card and browser tab.
const TITLES: Record<string, string> = {
  en: 'My Learning Dashboard',
  hi: 'मेरा सीखने का डैशबोर्ड',
  ta: 'என் கற்றல் டாஷ்போர்ட்',
  te: 'నా అభ్యాస డాష్‌బోర్డ్',
  bn: 'আমার শেখার ড্যাশবোর্ড',
  gu: 'મારું શીખવાનું ડેશબોર્ડ',
  kn: 'ನನ್ನ ಕಲಿಕೆಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
  mai: 'हमर सिकबाक डैशबोर्ड',
  mr: 'माझे शिकण्याचे डॅशबोर्ड',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Track your Jyotish learning progress, streak, level, and badges',
  hi: 'अपनी ज्योतिष शिक्षा प्रगति, स्ट्रीक, स्तर और बैज ट्रैक करें',
  ta: 'உங்கள் ஜோதிட கற்றல் முன்னேற்றம், தொடர், நிலை மற்றும் பதக்கங்களைக் கண்காணிக்கவும்',
  te: 'మీ జ్యోతిష అభ్యాస పురోగతి, స్ట్రీక్, స్థాయి మరియు బ్యాడ్జ్‌లను ట్రాక్ చేయండి',
  bn: 'আপনার জ্যোতিষ শিক্ষার অগ্রগতি, ধারাবাহিকতা, স্তর এবং ব্যাজ ট্র্যাক করুন',
  gu: 'તમારી જ્યોતિષ શિક્ષણ પ્રગતિ, સ્ટ્રીક, સ્તર અને બેજ ટ્રેક કરો',
  kn: 'ನಿಮ್ಮ ಜ್ಯೋತಿಷ ಕಲಿಕೆಯ ಪ್ರಗತಿ, ಸ್ಟ್ರೀಕ್, ಮಟ್ಟ ಮತ್ತು ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
  mai: 'अपन ज्योतिष शिक्षाक प्रगति, स्ट्रीक, स्तर आ बैज ट्रैक करू',
  mr: 'तुमची ज्योतिष शिक्षण प्रगती, स्ट्रीक, स्तर आणि बॅज ट्रॅक करा',
};

const VISIBLE_LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const languages: Record<string, string> = {};
  for (const l of VISIBLE_LOCALES) {
    languages[l] = `${BASE_URL}/${l}/learn/dashboard`;
  }
  languages['x-default'] = `${BASE_URL}/en/learn/dashboard`;

  return {
    title: TITLES[locale] ?? TITLES.en,
    description: DESCRIPTIONS[locale] ?? DESCRIPTIONS.en,
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/dashboard`,
      languages,
    },
    robots: { index: false },
  };
}

export default function LearnDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
