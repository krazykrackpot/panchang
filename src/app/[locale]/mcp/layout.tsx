import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/lib/i18n/config';
import { BASE_URL } from '@/lib/seo/base-url';
import { isSuppressedSeoLocale } from '@/lib/utils/locale-fonts';

/**
 * /mcp layout — metadata + full 9-locale hreflang for the LLM/agent
 * developer landing page.
 *
 * The MCP server itself is a locally-executed npm package; this page is
 * the human-facing install guide. Per-locale titles avoid the 2026-05-31
 * duplicate-content pattern (each locale carries its own copy directly,
 * NOT a Devanagari fallback).
 */

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const TITLES: Record<string, string> = {
  en: 'Vedic Astronomy MCP Server',
  hi: 'वैदिक ज्योतिष MCP सर्वर',
  mr: 'वैदिक ज्योतिष MCP सर्व्हर',
  mai: 'वैदिक ज्योतिष MCP सर्वर',
  ta: 'வேத ஜோதிட MCP சர்வர்',
  te: 'వైదిక జ్యోతిష్య MCP సర్వర్',
  bn: 'বৈদিক জ্যোতিষ MCP সার্ভার',
  gu: 'વૈદિક જ્યોતિષ MCP સર્વર',
  kn: 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ MCP ಸರ್ವರ್',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Give your AI agent accurate Vedic astronomy computation. Local MCP server for panchang, kundali, muhurat, and Ashta Kuta matching. Swiss Ephemeris, no API keys, no per-call cost. Install via npx @dekhopanchang/mcp.',
  hi: 'अपने AI एजेंट को सटीक वैदिक ज्योतिष गणना दें। पंचांग, कुण्डली, मुहूर्त और अष्ट कूट के लिए स्थानीय MCP सर्वर। Swiss Ephemeris, कोई API कुंजी नहीं, कोई प्रति-कॉल लागत नहीं।',
  mr: 'तुमच्या AI एजंटला अचूक वैदिक ज्योतिष गणना द्या. पंचांग, कुंडली, मुहूर्त आणि अष्ट कूट साठी स्थानिक MCP सर्व्हर. Swiss Ephemeris, कोणतीही API की नाही, प्रति-कॉल खर्च नाही.',
  mai: 'अपन AI एजेंट कें सही वैदिक ज्योतिष गणना दिअ। पंचांग, कुण्डली, मुहूर्त आ अष्ट कूट क लेल स्थानीय MCP सर्वर। Swiss Ephemeris, कोनो API कुंजी नहि, प्रति-कॉल लागत नहि।',
  ta: 'உங்கள் AI முகவருக்கு துல்லியமான வேத ஜோதிட கணிப்பை வழங்கவும். பஞ்சாங்கம், ஜாதகம், முகூர்த்தம் மற்றும் அஷ்ட கூட பொருத்தத்திற்கான உள்ளூர் MCP சர்வர். Swiss Ephemeris, API விசைகள் இல்லை, ஒரு அழைப்புக்கு கட்டணமில்லை.',
  te: 'మీ AI ఏజెంట్‌కు ఖచ్చితమైన వైదిక జ్యోతిష్య గణన ఇవ్వండి. పంచాంగం, జాతకం, ముహూర్తం మరియు అష్ట కూట పొందిక కోసం స్థానిక MCP సర్వర్. Swiss Ephemeris, API కీలు లేవు, ప్రతి-కాల్ ఖర్చు లేదు.',
  bn: 'আপনার AI এজেন্টকে সঠিক বৈদিক জ্যোতিষ গণনা দিন। পঞ্জিকা, কুণ্ডলি, মুহূর্ত এবং অষ্ট কূট মিলনের জন্য স্থানীয় MCP সার্ভার। Swiss Ephemeris, কোনো API কী নেই, প্রতি-কল খরচ নেই।',
  gu: 'તમારા AI એજન્ટને ચોકસાઈભરી વૈદિક જ્યોતિષ ગણતરી આપો. પંચાંગ, કુંડળી, મુહૂર્ત અને અષ્ટ કૂટ મેળાપ માટે સ્થાનિક MCP સર્વર. Swiss Ephemeris, કોઈ API કી નથી, પ્રતિ-કૉલ ખર્ચ નથી.',
  kn: 'ನಿಮ್ಮ AI ಏಜೆಂಟ್‌ಗೆ ನಿಖರವಾದ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಗಣನೆ ನೀಡಿ. ಪಂಚಾಂಗ, ಜಾತಕ, ಮುಹೂರ್ತ ಮತ್ತು ಅಷ್ಟ ಕೂಟ ಹೊಂದಾಣಿಕೆಗಾಗಿ ಸ್ಥಳೀಯ MCP ಸರ್ವರ್. Swiss Ephemeris, API ಕೀಗಳಿಲ್ಲ, ಪ್ರತಿ-ಕರೆಗೆ ವೆಚ್ಚವಿಲ್ಲ.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const title = TITLES[locale] ?? TITLES.en;
  const description = DESCRIPTIONS[locale] ?? DESCRIPTIONS.en;
  const url = `${BASE_URL}/${locale}/mcp`;
  const noindex = isSuppressedSeoLocale(locale);

  return {
    title,
    description,
    robots: noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}/mcp`])),
        'x-default': `${BASE_URL}/en/mcp`,
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

export default async function McpLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
