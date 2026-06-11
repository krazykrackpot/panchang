import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { buildIndexableHreflang, buildCanonicalUrl } from '@/lib/seo/hreflang';
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';

import { BASE_URL } from '@/lib/seo/base-url';

export const revalidate = 86400; // Daily revalidation — horoscope is deterministic per date (saves ~46K invocations/day)

export function generateStaticParams() {
  return RASHIS.map(r => ({ rashi: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; rashi: string }> }): Promise<Metadata> {
  const { locale, rashi } = await params;
  setRequestLocale(locale);
  const r = getRashiBySlug(rashi);
  if (!r) return {};

  const vedicName = tl(r.name, locale);
  const westernName = r.name.en;
  const hindiName = r.name.hi;
  // Native rashi names per locale (from RASHIS constant which has all 10 locales)
  const guName = r.name.gu || r.name.en;
  const knName = r.name.kn || r.name.en;
  const teName = r.name.te || r.name.en;
  const bnName = r.name.bn || r.name.en;
  const taName = r.name.ta || r.name.en;
  const maiName = r.name.mai || r.name.hi || r.name.en;
  const mrName = r.name.mr || r.name.hi || r.name.en;

  const isHi = isDevanagariLocale(locale);

  // Root layout template appends " | Dekho Panchang" — don't include it here.
  // Keep titles short and query-focused for CTR ("तुला राशिफल आज", "tula rashifal today").
  const title = tl({
    en: `${westernName} (${hindiName}) Horoscope Today — Daily Vedic Rashifal`,
    hi: `${hindiName} राशिफल आज — ${westernName} दैनिक भविष्यफल`,
    sa: `${hindiName} राशिफल आज — ${westernName} दैनिक भविष्यफल`,
    mai: `${maiName} राशिफल आइ — ${westernName} दैनिक भविष्यफल`,
    mr: `${mrName} राशीभविष्य आज — ${westernName} दैनिक राशीफळ`,
    ta: `${taName} ராசிபலன் இன்று — ${westernName} தினசரி வேத ராசி பலன்`,
    gu: `${guName} રાશિફળ આજ — ${westernName} દૈનિક ભવિષ્યફળ`,
    kn: `${knName} ರಾಶಿಫಲ ಇಂದು — ${westernName} ದೈನಿಕ ಭವಿಷ್ಯ`,
    te: `${teName} రాశిఫలం నేడు — ${westernName} దైనిక భవిష్యం`,
    bn: `${bnName} রাশিফল আজ — ${westernName} দৈনিক ভবিষ্যৎফল`,
  }, locale);

  const rulerEn = r ? tl(r.rulerName, 'en') : '';
  const rulerHi = r ? tl(r.rulerName, 'hi') : '';
  const elementEn = r ? tl(r.element, 'en') : '';

  const description = tl({
    en: `Today's ${vedicName} (${elementEn} sign, ruled by ${rulerEn}) horoscope based on real planetary transits. Daily scores for career, love, health & finance + lucky colour, number & remedy.`,
    hi: `${hindiName} राशि (${rulerHi} ग्रह) का आज का राशिफल — करियर, प्रेम, स्वास्थ्य, वित्त स्कोर। शुभ रंग, शुभ अंक और उपाय। वास्तविक ग्रह गोचर पर आधारित।`,
    sa: `${hindiName} राशि का आज का राशिफल वास्तविक ग्रह गोचर पर आधारित  –  करियर, प्रेम, स्वास्थ्य, वित्त। सटीक वैदिक गणना, न कि सामान्य भविष्यवाणी।`,
    mai: `${maiName} राशि (${rulerHi} ग्रह) क आजुक राशिफल — कैरियर, प्रेम, स्वास्थ्य, धन स्कोर। शुभ रंग, शुभ अंक आ उपाय। वास्तविक ग्रह गोचर पर आधारित।`,
    mr: `${mrName} राशीचे (${rulerHi} ग्रह) आजचे राशीभविष्य — कारकीर्द, प्रेम, आरोग्य, अर्थ स्कोर. शुभ रंग, शुभ अंक आणि उपाय. वास्तविक ग्रह गोचरावर आधारित.`,
    ta: `${taName} ராசிக்கு (${rulerEn} கிரகம்) இன்றைய ராசிபலன் — தொழில், காதல், ஆரோக்கியம், நிதி மதிப்பு. அதிர்ஷ்ட நிறம், எண் மற்றும் பரிகாரம். உண்மையான கிரக சஞ்சாரம் ஆதாரம்.`,
    gu: `${guName} રાશિ માટે આજનું રાશિફળ વાસ્તવિક ગ્રહ ગોચર પર આધારિત  –  કારકિર્દી, પ્રેમ, સ્વાસ્થ્ય, નાણાં.`,
    kn: `${knName} ರಾಶಿಯ ಇಂದಿನ ರಾಶಿಫಲ ನಿಜವಾದ ಗ್ರಹ ಸಂಚಾರ ಆಧಾರಿತ  –  ವೃತ್ತಿ, ಪ್ರೀತಿ, ಆರೋಗ್ಯ, ಹಣಕಾಸು.`,
    te: `${teName} రాశి నేటి రాశిఫలం నిజమైన గ్రహ గోచారం ఆధారంగా  –  వృత్తి, ప్రేమ, ఆరోగ్యం, ఆర్థికం.`,
    bn: `${bnName} রাশির আজকের রাশিফল প্রকৃত গ্রহ গোচরের উপর ভিত্তি করে  –  ক্যারিয়ার, প্রেম, স্বাস্থ্য, অর্থ.`,
  }, locale);

  const route = `/horoscope/${rashi}`;
  const isIndexable = isLocaleIndexable(route, locale);
  const url = buildCanonicalUrl(route, locale);

  return {
    title,
    description,
    // Dual-script keywords: Latin for EN/global search, Devanagari for HI users searching in Hindi
    keywords: [
      `${westernName.toLowerCase()} horoscope today`,
      `${vedicName.toLowerCase()} rashifal`,
      `${westernName.toLowerCase()} daily horoscope`,
      `${rashi} rashi today`,
      `${hindiName} राशि`,
      `${hindiName} राशिफल`,
      `${hindiName} राशिफल आज`,
      'vedic horoscope',
      'daily rashifal',
      'moon sign horoscope',
    ],
    robots: isIndexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical: url,
      languages: buildIndexableHreflang(route),
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Dekho Panchang',
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; rashi: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // FAQPage JSON-LD moved to page.tsx — emitting it from this shared
  // layout duplicated the FAQ schema on every indexable child
  // (/[date], /weekly, /monthly), surfacing as identical FAQPage
  // markup at /horoscope/aries AND /horoscope/aries/2026-06-11.
  // The "emit from the most-specific page" rule already governs
  // Breadcrumb + Article from this same layout; FAQ now follows it.
  // 2026-06-11 audit.
  return <>{children}</>;
}
