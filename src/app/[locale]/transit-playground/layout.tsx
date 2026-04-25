import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Transit Playground — Interactive Vedic Gochara Sandbox',
    description:
      'Drag transit planets onto your natal chart and watch gochara analysis update in real time. Explore Jupiter and Saturn cycles, vedha obstruction, and double transit activation.',
  },
  hi: {
    title: 'ट्रांज़िट प्लेग्राउंड — वैदिक गोचर सैंडबॉक्स',
    description:
      'अपनी जन्म कुंडली पर ग्रहों को खींचें और तुरंत गोचर विश्लेषण देखें। बृहस्पति-शनि चक्र, वेध और द्विगोचर का अध्ययन करें।',
  },
  ta: {
    title: 'டிரான்சிட் பிளேக்ரவுண்ட் — வேத கோசர சாண்ட்பாக்ஸ்',
    description:
      'உங்கள் ஜாதக கட்டத்தில் கிரகங்களை இழுத்து நேரடி கோசர பகுப்பாய்வு பெறுங்கள். குரு-சனி சுழற்சிகள் மற்றும் வேத தடைகளை ஆராயுங்கள்.',
  },
  bn: {
    title: 'ট্রানজিট প্লেগ্রাউন্ড — বৈদিক গোচর স্যান্ডবক্স',
    description:
      'আপনার জন্ম কুণ্ডলীতে গ্রহ টেনে আনুন এবং রিয়েল-টাইম গোচর বিশ্লেষণ দেখুন। বৃহস্পতি-শনি চক্র ও বেধ বাধা অন্বেষণ করুন।',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;

  const locales = ['en', 'hi', 'ta', 'bn'];
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${BASE_URL}/${l}/transit-playground`;
  }

  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/transit-playground`,
      languages,
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${BASE_URL}/${locale}/transit-playground`,
      siteName: 'Dekho Panchang',
      type: 'website',
    },
  };
}

export default function TransitPlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
