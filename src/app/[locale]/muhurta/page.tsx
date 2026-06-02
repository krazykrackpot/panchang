/**
 * /muhurta — hub page listing every Muhurta-activity landing page.
 *
 * Why this exists (2026-06-01 recovery §2.2 internal-linking topology):
 * Before this page, `/muhurta` returned 404 — the 12 `muhurta/[type]`
 * landings (annaprashan, wedding, vehicle-purchase, ...) were orphaned
 * from internal navigation. The only entry points were the sitemap
 * and direct URLs. `/en/muhurta/annaprashan` ranked at position 3.8
 * with 46 clicks/week but had zero internal-link authority — exactly
 * the structural pattern Google's Core Update down-weights.
 *
 * This page:
 *   - Becomes the canonical "muhurta family" hub Google can crawl
 *   - Gives every /muhurta/[type] page a 1-click parent
 *   - Cross-links via `related` slugs so each landing has sibling
 *     authority flowing through this hub
 *
 * Lesson D (CLAUDE.md): "Every feature must be reachable from its
 * natural entry points the moment it's built." Annaprashan was built
 * but the entry was missing.
 */

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MUHURTA_TYPES, type MuhurtaTypeInfo } from '@/lib/constants/muhurta-types';
import { getHeadingFont, getBodyFont, isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { BREADCRUMB_HOME, BREADCRUMB_MUHURTA } from '@/lib/i18n/breadcrumb-labels';
import AuthorByline from '@/components/ui/AuthorByline';
import { ArrowRight, Calendar } from 'lucide-react';

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ locale: string }>;
}

/** Trilingual helper that falls back to English when the locale key is missing. */
function tl<T extends string>(obj: { en: T; hi?: T; sa?: T; ta?: T; bn?: T }, locale: string): T {
  return (obj as Record<string, T>)[locale] ?? obj.en;
}

export default async function MuhurtaHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const isDevanagari = isDevanagariLocale(locale);

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/muhurta`, locale);

  const heading = isDevanagari ? 'मुहूर्त' : 'Muhurta';
  const subtitle = isDevanagari
    ? 'जीवन के प्रत्येक संस्कार के लिए शुभ काल'
    : 'Auspicious timing for every life event';
  const intro = isDevanagari
    ? 'पारम्परिक मुहूर्त शास्त्र के अनुसार, प्रत्येक संस्कार और कार्य के लिए ग्रहों की एक विशिष्ट संरचना सर्वोत्तम मानी जाती है। नीचे 12 प्रमुख जीवन-कार्यों के लिए शुभ काल और मार्गदर्शन प्राप्त करें।'
    : 'Classical Muhurta Shastra prescribes a distinct planetary configuration for each life event. Below are 12 dedicated landing pages — auspicious dates, classical guidance, and FAQs — for the major life-cycle muhurtas.';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      <main className="min-h-screen bg-bg-primary pb-20" style={bodyFont}>
        {/* Visible breadcrumb trail — pairs with the JSON-LD
            BreadcrumbList above. Renders Home → Muhurta in the active
            locale's script. Hardcoded English fell flat in Tamil /
            Telugu / Bengali / Kannada / Gujarati locales (Gemini PR
            #365 MEDIUM). */}
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <Breadcrumb
            items={[
              { href: '/', label: BREADCRUMB_HOME[locale] ?? 'Home' },
              { label: BREADCRUMB_MUHURTA[locale] ?? 'Muhurta' },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 pt-8 pb-10">
          <p className="text-text-secondary text-sm uppercase tracking-widest mb-3">
            {isDevanagari ? 'मुहूर्त शास्त्र' : 'Muhurta Shastra'}
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

        {/* Cards — every MUHURTA_TYPES entry */}
        <section className="max-w-5xl mx-auto px-4">
          <h2
            className="text-2xl font-semibold text-gold-light mb-6 flex items-center gap-2"
            style={headingFont}
          >
            <Calendar className="w-6 h-6 text-gold-primary" />
            {isDevanagari ? '12 जीवन-संस्कार' : '12 Life-Cycle Muhurtas'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MUHURTA_TYPES.map((m: MuhurtaTypeInfo) => (
              <Link
                key={m.slug}
                href={`/muhurta/${m.slug}`}
                className="group block p-5 rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/40 transition-all"
              >
                <h3
                  className="text-lg font-semibold text-gold-light group-hover:text-gold-primary transition-colors mb-1"
                  style={headingFont}
                >
                  {tl(m.name, locale)}
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  {tl(m.subtitle, locale)}
                </p>
                <p className="text-xs text-text-primary/70 line-clamp-3 mb-3">
                  {tl(m.description, locale)}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-gold-primary group-hover:translate-x-0.5 transition-transform">
                  {isDevanagari ? 'विवरण देखें' : 'View Details'}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Cross-links to related muhurta surfaces */}
        <section className="max-w-5xl mx-auto px-4 mt-12">
          <div className="p-6 rounded-2xl border border-gold-primary/15 bg-bg-secondary/40">
            <h2
              className="text-xl font-semibold text-gold-light mb-3"
              style={headingFont}
            >
              {isDevanagari ? 'अन्य मुहूर्त उपकरण' : 'Other Muhurta Tools'}
            </h2>
            <p className="text-sm text-text-primary/80 mb-4 leading-relaxed">
              {isDevanagari
                ? 'इन 12 पारम्परिक मुहूर्तों के अतिरिक्त, हमारे AI-संचालित मुहूर्त इंजन से कोई भी कार्य के लिए शुभ समय खोजें।'
                : 'Beyond these 12 classical muhurtas, our AI-powered engines find auspicious timing for any activity.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/muhurta-ai"
                className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light text-sm hover:bg-gold-primary/10 transition-colors"
              >
                {isDevanagari ? 'मुहूर्त AI (20 कार्य)' : 'Muhurta AI — 20 Activities'}
              </Link>
              <Link
                href="/career-muhurta"
                className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light text-sm hover:bg-gold-primary/10 transition-colors"
              >
                {isDevanagari ? 'करियर मुहूर्त' : 'Career Muhurta'}
              </Link>
              <Link
                href="/caesarean-muhurta"
                className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light text-sm hover:bg-gold-primary/10 transition-colors"
              >
                {isDevanagari ? 'सीज़ेरियन मुहूर्त' : 'Caesarean Muhurta'}
              </Link>
              <Link
                href="/learn/muhurtas"
                className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light text-sm hover:bg-gold-primary/10 transition-colors"
              >
                {isDevanagari ? 'मुहूर्त सीखें' : 'Learn Muhurtas'}
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
