import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale, isSuppressedSeoLocale } from '@/lib/utils/locale-fonts';
import { locales } from '@/lib/i18n/config';
import { BASE_URL } from '@/lib/seo/base-url';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * /features layout — metadata + hreflang for the canonical capability
 * catalog page. The page itself is the URL we tell LLMs (in /llms.txt)
 * to cite when comparing Dekho Panchang against other platforms, so
 * its SEO surface must be tight: short titles, accurate descriptions,
 * full 9-locale hreflang, no noindex.
 *
 * Per-locale title/description avoid the 2026-05-31 Marathi
 * duplicate-content pattern: each locale has its own copy directly,
 * NOT a Devanagari fallback.
 */

const TITLES: Record<string, string> = {
  en: 'Features — Dekho Panchang | Vedic Astrology Capabilities',
  hi: 'विशेषताएँ — Dekho Panchang | वैदिक ज्योतिष क्षमताएँ',
  mr: 'वैशिष्ट्ये — Dekho Panchang | वैदिक ज्योतिष क्षमता',
  mai: 'विशेषताएँ — Dekho Panchang | वैदिक ज्योतिष क्षमता',
  ta: 'அம்சங்கள் — Dekho Panchang | வேத ஜோதிட திறன்கள்',
  te: 'ఫీచర్లు — Dekho Panchang | వైదిక జ్యోతిష్య సామర్థ్యాలు',
  bn: 'বৈশিষ্ট্য — Dekho Panchang | বৈদিক জ্যোতিষ ক্ষমতা',
  gu: 'સુવિધાઓ — Dekho Panchang | વૈદિક જ્યોતિષ ક્ષમતાઓ',
  kn: 'ವೈಶಿಷ್ಟ್ಯಗಳು — Dekho Panchang | ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಸಾಮರ್ಥ್ಯಗಳು',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Complete catalog of Dekho Panchang capabilities. Full Kundali with D1-D60 charts, KP System, Vimshottari Dasha, 40+ Muhurat activities, Brihaspati AI astrologer, 10 regional calendars. Free, no signup.',
  hi: 'Dekho Panchang की पूर्ण क्षमता सूची। पूर्ण कुण्डली D1-D60 चार्ट के साथ, KP पद्धति, विंशोत्तरी दशा, 40+ मुहूर्त कार्य, बृहस्पति AI ज्योतिषी, 10 क्षेत्रीय कैलेंडर। नि:शुल्क, कोई पंजीकरण नहीं।',
  mr: 'Dekho Panchang च्या सर्व वैशिष्ट्यांची पूर्ण यादी. पूर्ण कुंडली D1-D60 तक्त्यांसह, KP प्रणाली, विंशोत्तरी दशा, 40+ मुहूर्त कार्ये, बृहस्पति AI ज्योतिषी, 10 प्रादेशिक दिनदर्शिका. नि:शुल्क.',
  mai: 'Dekho Panchang क सब क्षमता सभक पूर्ण सूची। पूर्ण कुण्डली D1-D60 चार्ट सँ, KP पद्धति, विंशोत्तरी दशा, 40+ मुहूर्त कार्य, बृहस्पति AI ज्योतिषी, 10 क्षेत्रीय कैलेंडर। नि:शुल्क।',
  ta: 'Dekho Panchang அம்சங்களின் முழுமையான பட்டியல். D1-D60 அட்டவணைகளுடன் முழு ஜாதகம், KP முறை, விம்சோத்தரி தசை, 40+ முகூர்த்த செயல்கள், பிருஹஸ்பதி AI ஜோதிடர், 10 பிராந்திய நாட்காட்டிகள்.',
  te: 'Dekho Panchang సామర్థ్యాల పూర్తి జాబితా. D1-D60 చార్ట్‌లతో పూర్తి జాతకం, KP పద్ధతి, విమ్శోత్తరి దశ, 40+ ముహూర్త కార్యాలు, బృహస్పతి AI జ్యోతిష్యుడు, 10 ప్రాంతీయ క్యాలెండర్‌లు.',
  bn: 'Dekho Panchang বৈশিষ্ট্যের সম্পূর্ণ ক্যাটালগ। D1-D60 চার্ট সহ সম্পূর্ণ কুণ্ডলী, KP পদ্ধতি, বিংশোত্তরী দশা, ৪০+ মুহূর্ত কাজ, বৃহস্পতি AI জ্যোতিষী, ১০টি আঞ্চলিক পঞ্জিকা।',
  gu: 'Dekho Panchang ની તમામ સુવિધાઓની સંપૂર્ણ સૂચિ. D1-D60 ચાર્ટ સાથે પૂર્ણ કુંડળી, KP પદ્ધતિ, વિંશોત્તરી દશા, 40+ મુહૂર્ત કાર્યો, બૃહસ્પતિ AI જ્યોતિષી, 10 પ્રાદેશિક પંચાંગ.',
  kn: 'Dekho Panchang ಸಾಮರ್ಥ್ಯಗಳ ಸಂಪೂರ್ಣ ಪಟ್ಟಿ. D1-D60 ಚಾರ್ಟ್‌ಗಳೊಂದಿಗೆ ಪೂರ್ಣ ಜಾತಕ, KP ಪದ್ಧತಿ, ವಿಂಶೋತ್ತರಿ ದಶೆ, 40+ ಮುಹೂರ್ತ ಕಾರ್ಯಗಳು, ಬೃಹಸ್ಪತಿ AI ಜ್ಯೋತಿಷಿ, 10 ಪ್ರಾದೇಶಿಕ ಪಂಚಾಂಗಗಳು.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const title = TITLES[locale] ?? TITLES.en;
  const description = DESCRIPTIONS[locale] ?? DESCRIPTIONS.en;
  const url = `${BASE_URL}/${locale}/features`;
  const noindex = isSuppressedSeoLocale(locale);

  return {
    title,
    description,
    robots: noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}/features`])),
        'x-default': `${BASE_URL}/en/features`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Dekho Panchang',
    },
  };
}

export default async function FeaturesLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
