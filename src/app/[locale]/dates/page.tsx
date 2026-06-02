/**
 * /dates — hub page listing every /dates/[category] family landing.
 *
 * Why this exists (2026-06-01 recovery §2.2 internal-linking topology,
 * follow-up to PR #344 which built the parallel /muhurta hub):
 *
 * Before this page, `/dates` returned 404 — the 5 `dates/[category]`
 * landings (ekadashi, purnima, amavasya, pradosham, chaturthi) plus the
 * custom `/dates/ganda-mool` page were structurally orphaned from
 * internal navigation. `/hi/dates/purnima` ranked at position ~10 with
 * 32 clicks/week but had zero internal-link authority — exactly the
 * "scaled programmatic content" pattern Google's Core Update down-weights.
 *
 * This page:
 *   - Becomes the canonical "dates family" hub Google can crawl
 *   - Gives every /dates/[category] page a 1-click parent
 *   - Cross-links to /panchang (today's tithi entry point) and the
 *     festival hub so date concepts flow into festival context
 *
 * Lesson D (CLAUDE.md): "Every feature must be reachable from its
 * natural entry points the moment it's built."
 *
 * The 6 category slugs MUST stay in sync with:
 *   - VALID_CATEGORIES in src/app/[locale]/dates/[category]/page.tsx (line 93)
 *   - VALID_CATEGORIES in src/app/[locale]/dates/[category]/layout.tsx (line 9)
 *   - The /dates/* entries in src/app/sitemap.ts (288-293)
 *   - PAGE_META in src/lib/seo/metadata.ts (4276-5116)
 * Inlined here rather than extracted to a shared constant because all 4
 * call sites use the data differently (validation vs metadata vs
 * sitemap iteration) and a unifying type would over-abstract. See
 * docs/tech-debt/duplicate-code-audit.md if extracting later.
 */

import { setRequestLocale } from 'next-intl/server';
import { getHeadingFont, getBodyFont, isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import AuthorByline from '@/components/ui/AuthorByline';
import { ArrowRight, Calendar, Moon, Sun, Sparkles, type LucideIcon } from 'lucide-react';

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface DateCategoryCard {
  slug: string;
  name: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  description: { en: string; hi: string };
  /** Lucide icon component — `LucideIcon` is the canonical type for
   *  every icon exported by `lucide-react`, so Sun/Moon/Sparkles/
   *  Calendar etc. all assign to this field without union types
   *  (Gemini PR #354 MEDIUM). */
  Icon: LucideIcon;
}

const DATE_CATEGORIES: DateCategoryCard[] = [
  {
    slug: 'ekadashi',
    name: { en: 'Ekadashi', hi: 'एकादशी' },
    subtitle: { en: '11th tithi — fasting day', hi: '11वीं तिथि — व्रत दिवस' },
    description: {
      en: 'The 11th lunar day of each paksha — 24 Ekadashis per year, each with its own name and significance. Sacred fasting day for Lord Vishnu devotees; complete year-by-year date list with sunrise-based observance times.',
      hi: 'प्रत्येक पक्ष का 11वां चांद्र दिवस — वर्ष में 24 एकादशियां, प्रत्येक का अपना नाम और महत्व। भगवान विष्णु के भक्तों के लिए पवित्र व्रत दिवस; सूर्योदय-आधारित पालन समय के साथ वर्ष-वार तिथि सूची।',
    },
    Icon: Sun,
  },
  {
    slug: 'purnima',
    name: { en: 'Purnima', hi: 'पूर्णिमा' },
    subtitle: { en: 'Full Moon day', hi: 'पूर्ण चन्द्र दिवस' },
    description: {
      en: 'The 15th tithi of Shukla Paksha — Full Moon. 12 Purnimas per year, each marking a major festival (Guru Purnima, Raksha Bandhan, Sharad, Kartik, Buddha, Hanuman Jayanti). Auspicious for puja and dakshina.',
      hi: 'शुक्ल पक्ष का 15वां तिथि — पूर्ण चन्द्र। वर्ष में 12 पूर्णिमायें, प्रत्येक एक प्रमुख त्यौहार (गुरु पूर्णिमा, रक्षा बन्धन, शरद, कार्तिक, बुद्ध, हनुमान जयन्ती) चिह्नित करती है। पूजा और दक्षिणा के लिए शुभ।',
    },
    Icon: Moon,
  },
  {
    slug: 'amavasya',
    name: { en: 'Amavasya', hi: 'अमावस्या' },
    subtitle: { en: 'New Moon day', hi: 'अमावस्या दिवस' },
    description: {
      en: 'The 15th tithi of Krishna Paksha — New Moon. 12 Amavasyas per year including the powerful Somvati (Monday), Shani (Saturday), Diwali, and Mauni variants. Sacred for ancestral rites (tarpan, shradh).',
      hi: 'कृष्ण पक्ष का 15वां तिथि — अमावस्या। वर्ष में 12 अमावस्यायें — शक्तिशाली सोमवती (सोमवार), शनि (शनिवार), दीपावली, और मौनी रूप सहित। पैतृक संस्कारों (तर्पण, श्राद्ध) के लिए पवित्र।',
    },
    Icon: Sparkles,
  },
  {
    slug: 'pradosham',
    name: { en: 'Pradosham', hi: 'प्रदोष' },
    subtitle: { en: '13th tithi — Shiva vrat', hi: '13वीं तिथि — शिव व्रत' },
    description: {
      en: 'The 13th lunar day of each paksha — sacred to Lord Shiva. Pradosh Kaal is the twilight window (1.5 hours around sunset). Saturday Pradosh (Shani Pradosh) and Monday Pradosh (Soma Pradosh) carry special significance.',
      hi: 'प्रत्येक पक्ष का 13वां चांद्र दिवस — भगवान शिव को समर्पित। प्रदोष काल सूर्यास्त के आसपास का सन्ध्या समय (लगभग 1.5 घण्टे) है। शनि प्रदोष और सोम प्रदोष का विशेष महत्व है।',
    },
    Icon: Moon,
  },
  {
    slug: 'chaturthi',
    name: { en: 'Chaturthi', hi: 'चतुर्थी' },
    subtitle: { en: '4th tithi — Ganesha vrat', hi: '4थी तिथि — गणेश व्रत' },
    description: {
      en: 'The 4th lunar day of each paksha — sacred to Lord Ganesha. Sankashti Chaturthi (Krishna Paksha) removes obstacles; Vinayaka Chaturthi (Shukla Paksha) invokes blessings. 24 Chaturthis per year with moonrise-timed puja.',
      hi: 'प्रत्येक पक्ष का चौथा चांद्र दिवस — भगवान गणेश को समर्पित। संकष्टी चतुर्थी (कृष्ण पक्ष) विघ्न दूर करती है; विनायक चतुर्थी (शुक्ल पक्ष) आशीर्वाद आह्वान करती है। वर्ष में 24 चतुर्थियां चन्द्रोदय-समयित पूजा के साथ।',
    },
    Icon: Calendar,
  },
  {
    slug: 'ganda-mool',
    name: { en: 'Ganda Mool', hi: 'गण्ड मूल' },
    subtitle: { en: 'Inauspicious nakshatra dates', hi: 'अशुभ नक्षत्र तिथियां' },
    description: {
      en: 'Dates when the Moon transits through the 6 inauspicious Ganda Mool Nakshatras (Ashwini, Ashlesha, Magha, Jyeshtha, Mula, Revati). Birth on these dates traditionally requires shanti puja; new ventures are postponed.',
      hi: '6 अशुभ गण्ड मूल नक्षत्रों (अश्विनी, आश्लेषा, मघा, ज्येष्ठा, मूल, रेवती) में चन्द्र गोचर की तिथियां। इन तिथियों पर जन्म के लिए पारम्परिक शान्ति पूजा आवश्यक है; नए कार्य स्थगित किए जाते हैं।',
    },
    Icon: Sparkles,
  },
];

function tl<T extends string>(obj: { en: T; hi: T }, locale: string): T {
  // Use the shared `isDevanagariLocale` helper rather than re-checking
  // the locale list inline — Gemini PR #354 MEDIUM. Keeps the
  // Devanagari-script gate in one place across the codebase.
  return isDevanagariLocale(locale) ? obj.hi : obj.en;
}

export default async function DatesHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const isDevanagari = isDevanagariLocale(locale);

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/dates`, locale);

  const heading = isDevanagari ? 'तिथि कैलेंडर' : 'Sacred Dates';
  const subtitle = isDevanagari
    ? 'पारम्परिक हिन्दू तिथियों की सम्पूर्ण सूची'
    : 'Complete reference for traditional Hindu tithis';
  const intro = isDevanagari
    ? 'हिन्दू पंचांग में प्रत्येक चांद्र तिथि (एकादशी, पूर्णिमा, अमावस्या, प्रदोष, चतुर्थी) का अपना धार्मिक महत्व है। नीचे प्रत्येक तिथि श्रेणी के लिए वर्ष-वार तिथियां, सूर्योदय-आधारित पालन समय और पारम्परिक मार्गदर्शन प्राप्त करें।'
    : 'Every lunar tithi in the Hindu calendar — Ekadashi, Purnima, Amavasya, Pradosham, Chaturthi — carries its own ritual significance. Below are dedicated pages for each tithi category with year-by-year dates, sunrise-based observance times, and classical guidance.';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      <main className="min-h-screen bg-bg-primary pb-20" style={bodyFont}>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-10">
          <p className="text-text-secondary text-sm uppercase tracking-widest mb-3">
            {isDevanagari ? 'तिथि शास्त्र' : 'Tithi Calendar'}
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {heading}
          </h1>
          <p className="text-xl text-text-secondary mb-6" style={headingFont}>
            {subtitle}
          </p>
          <p className="text-base text-text-primary/80 max-w-3xl leading-relaxed">
            {intro}
          </p>
        </section>

        {/* Cards — every DATE_CATEGORIES entry */}
        <section className="max-w-5xl mx-auto px-4">
          <h2
            className="text-2xl font-semibold text-gold-light mb-6 flex items-center gap-2"
            style={headingFont}
          >
            <Calendar className="w-6 h-6 text-gold-primary" />
            {isDevanagari ? `${DATE_CATEGORIES.length} तिथि श्रेणियां` : `${DATE_CATEGORIES.length} Tithi Categories`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DATE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/dates/${cat.slug}`}
                className="group block p-5 rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/40 transition-all"
              >
                <div className="flex items-start gap-3 mb-2">
                  <cat.Icon className="w-5 h-5 text-gold-primary mt-0.5 shrink-0" />
                  <div>
                    <h3
                      className="text-lg font-semibold text-gold-light group-hover:text-gold-primary transition-colors"
                      style={headingFont}
                    >
                      {tl(cat.name, locale)}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {tl(cat.subtitle, locale)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-primary/70 line-clamp-4 mb-3">
                  {tl(cat.description, locale)}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-gold-primary group-hover:translate-x-0.5 transition-transform">
                  {isDevanagari ? 'तिथियां देखें' : 'View Dates'}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Cross-links to related surfaces */}
        <section className="max-w-5xl mx-auto px-4 mt-12">
          <div className="p-6 rounded-2xl border border-gold-primary/15 bg-bg-secondary/40">
            <h2
              className="text-xl font-semibold text-gold-light mb-3"
              style={headingFont}
            >
              {isDevanagari ? 'सम्बन्धित संसाधन' : 'Related Resources'}
            </h2>
            <p className="text-sm text-text-primary/80 mb-4 leading-relaxed">
              {isDevanagari
                ? 'तिथि गणना दैनिक पंचांग, त्यौहार कैलेंडर और मुहूर्त चयन का आधार है।'
                : 'Tithi calculation underpins the daily Panchang, festival calendar, and muhurta selection.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/panchang"
                className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light text-sm hover:bg-gold-primary/10 transition-colors"
              >
                {isDevanagari ? 'आज का पंचांग' : 'Today’s Panchang'}
              </Link>
              <Link
                href="/festivals"
                className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light text-sm hover:bg-gold-primary/10 transition-colors"
              >
                {isDevanagari ? 'त्यौहार कैलेंडर' : 'Festival Calendar'}
              </Link>
              <Link
                href="/calendar"
                className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light text-sm hover:bg-gold-primary/10 transition-colors"
              >
                {isDevanagari ? 'मासिक कैलेंडर' : 'Monthly Calendar'}
              </Link>
              <Link
                href="/learn/tithis"
                className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light text-sm hover:bg-gold-primary/10 transition-colors"
              >
                {isDevanagari ? 'तिथि सीखें' : 'Learn About Tithis'}
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4">
          <AuthorByline />
        </section>

        <div className="h-12" />
      </main>
    </>
  );
}
