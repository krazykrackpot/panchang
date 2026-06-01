import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { locales, type Locale } from '@/lib/i18n/config';
import { BASE_URL } from '@/lib/seo/base-url';

// Per-locale metadata. Previous version only had en + hi and used
// `locale === 'hi' ? hi : en`, collapsing all 7 other locales into
// identical English titles → GSC Coverage Validation flagged
// /te/matching/report (and likely others) as "Duplicate, Google chose
// different canonical than user". Each locale now has distinct
// native-script copy. Lesson 2026-06-01 GSC drop.
const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Detailed Compatibility Report  –  Vedic Marriage Analysis | Dekho Panchang',
    description: 'In-depth Vedic compatibility report with Manglik analysis, Nadi Dosha, cross-chart aspects, 7th house analysis, Venus compatibility, and a narrative summary.',
  },
  hi: {
    title: 'विस्तृत अनुकूलता रिपोर्ट  –  वैदिक विवाह विश्लेषण | देखो पंचांग',
    description: 'मांगलिक विश्लेषण, नाड़ी दोष, क्रॉस-चार्ट पहलू, सप्तम भाव विश्लेषण, शुक्र अनुकूलता और कथात्मक सारांश के साथ गहन वैदिक अनुकूलता रिपोर्ट।',
  },
  mr: {
    title: 'विस्तृत अनुकूलता अहवाल  –  वैदिक विवाह विश्लेषण | देखो पंचांग',
    description: 'मांगलिक विश्लेषण, नाडी दोष, क्रॉस-चार्ट पैलू, सप्तम स्थान विश्लेषण, शुक्र अनुकूलता आणि कथनात्मक सारांशासह सखोल वैदिक अनुकूलता अहवाल.',
  },
  mai: {
    title: 'विस्तृत अनुकूलता रिपोर्ट  –  वैदिक विवाह विश्लेषण | देखो पंचांग',
    description: 'मांगलिक विश्लेषण, नाड़ी दोष, क्रॉस-चार्ट पहलू, सप्तम भाव विश्लेषण, शुक्र अनुकूलता आ कथनात्मक सारांश क संग गहन वैदिक अनुकूलता रिपोर्ट।',
  },
  bn: {
    title: 'বিশদ সামঞ্জস্যতা প্রতিবেদন  –  বৈদিক বিবাহ বিশ্লেষণ | দেখো পঞ্জিকা',
    description: 'মাঙ্গলিক বিশ্লেষণ, নাড়ি দোষ, ক্রস-চার্ট দিক, সপ্তম ভাব বিশ্লেষণ, শুক্র সামঞ্জস্যতা এবং বর্ণনামূলক সারাংশ সহ গভীর বৈদিক সামঞ্জস্যতা প্রতিবেদন।',
  },
  te: {
    title: 'వివరణాత్మక అనుకూలత నివేదిక  –  వేద వివాహ విశ్లేషణ | చూడు పంచాంగం',
    description: 'మాంగలిక విశ్లేషణ, నాడీ దోషం, క్రాస్-చార్ట్ అంశాలు, సప్తమ భావ విశ్లేషణ, శుక్ర అనుకూలత మరియు కథన సారాంశంతో సహా లోతైన వేద అనుకూలత నివేదిక.',
  },
  gu: {
    title: 'વિગતવાર સુસંગતતા અહેવાલ  –  વૈદિક લગ્ન વિશ્લેષણ | દેખો પંચાંગ',
    description: 'મંગળિક વિશ્લેષણ, નાડી દોષ, ક્રોસ-ચાર્ટ પાસાઓ, સપ્તમ ભાવ વિશ્લેષણ, શુક્ર સુસંગતતા અને કથનાત્મક સારાંશ સાથે ગહન વૈદિક સુસંગતતા અહેવાલ.',
  },
  kn: {
    title: 'ವಿಸ್ತೃತ ಹೊಂದಾಣಿಕೆ ವರದಿ  –  ವೈದಿಕ ವಿವಾಹ ವಿಶ್ಲೇಷಣೆ | ದೇಖೋ ಪಂಚಾಂಗ',
    description: 'ಮಾಂಗಲಿಕ ವಿಶ್ಲೇಷಣೆ, ನಾಡಿ ದೋಷ, ಕ್ರಾಸ್-ಚಾರ್ಟ್ ಅಂಶಗಳು, ಸಪ್ತಮ ಭಾವ ವಿಶ್ಲೇಷಣೆ, ಶುಕ್ರ ಹೊಂದಾಣಿಕೆ ಮತ್ತು ನಿರೂಪಣಾ ಸಾರಾಂಶದೊಂದಿಗೆ ಆಳವಾದ ವೈದಿಕ ಹೊಂದಾಣಿಕೆ ವರದಿ.',
  },
  ta: {
    title: 'விரிவான பொருத்தம் அறிக்கை  –  வேத திருமண பகுப்பாய்வு | தேக்கோ பஞ்சாங்கம்',
    description: 'மாங்கலிக பகுப்பாய்வு, நாடி தோஷம், குறுக்கு-விளக்கப்பட அம்சங்கள், சப்தம பாவ பகுப்பாய்வு, சுக்கிர பொருத்தம் மற்றும் கதை சுருக்கம் உள்ளிட்ட ஆழமான வேத பொருத்தம் அறிக்கை.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const m = META[locale as Locale] ?? META.en;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/matching/report`,
      // Full hreflang across all active locales — the previous map
      // only listed en + hi, so Google saw only those two as
      // alternatives and treated the other 7 as un-alternated, which
      // compounds the duplicate-content signal.
      languages: {
        ...Object.fromEntries(locales.map(l => [l, `${BASE_URL}/${l}/matching/report`])),
        'x-default': `${BASE_URL}/en/matching/report`,
      },
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const toolLD = generateToolLD(
    'Detailed Compatibility Report  –  Vedic Marriage Analysis',
    'In-depth cross-chart compatibility analysis including Manglik, Nadi, aspects, 7th house, and Venus analysis.',
    `${BASE_URL}/${locale}/matching/report`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/matching/report`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
