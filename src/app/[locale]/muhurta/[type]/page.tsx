import { notFound } from 'next/navigation';
import { getLocale, setRequestLocale } from 'next-intl/server';
import { MUHURTA_TYPES, getMuhurtaType } from '@/lib/constants/muhurta-types-with-overlay';
import type { MuhurtaTypeInfo } from '@/lib/constants/muhurta-types-with-overlay';
import { getHeadingFont, getBodyFont, isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import AuthorByline from '@/components/ui/AuthorByline';
import { BREADCRUMB_HOME, BREADCRUMB_MUHURTA } from '@/lib/i18n/breadcrumb-labels';
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { FAQ_DATA } from '@/lib/seo/faq-data';
import {
  Calendar, ArrowRight, BookOpen, HelpCircle, Sparkles, CheckCircle, ExternalLink,
  ScrollText, Baby, Star, LinkIcon,
} from 'lucide-react';

export function generateStaticParams() {
  return MUHURTA_TYPES.map(t => ({ type: t.slug }));
}

/* ─── Inline i18n labels ──────────────────────────────────────── */
const L: Record<string, Record<string, string>> = {
  en: {
    findDate: 'Find Your Date with Muhurta AI',
    findDateDesc: 'Our AI-powered engine scans time windows and scores them 0-100 based on Panchang, transits, hora, and choghadiya for your specific activity.',
    upcomingDates: 'Upcoming Auspicious Dates in 2026',
    upcomingDesc: 'Based on traditional Vedic muhurat rules  –  favorable nakshatras, tithis, weekdays, and planetary conditions.',
    guidance: 'Traditional Guidance',
    guidanceDesc: 'What to consider according to Vedic texts and Jyotish Shastras.',
    faq: 'Frequently Asked Questions',
    relatedTypes: 'Related Muhurat Types',
    viewAll: 'View All Muhurat Types',
    ctaButton: 'Find Best Muhurat',
    approximate: 'Note: These dates are approximate. Use our Muhurta AI tool for personalized, location-specific recommendations.',
    learnMore: 'Learn more about Muhurat selection',
    aboutTitle: 'About This Ceremony',
    exploreRelated: 'Explore Related Tools',
    babyNames: 'Baby Names by Nakshatra',
    babyNamesDesc: 'Find auspicious baby names based on birth nakshatra syllables.',
    kundali: 'Birth Chart (Kundali)',
    kundaliDesc: 'Generate your baby\'s complete Vedic birth chart with interpretations.',
    muhurtaAI: 'Muhurta AI Tool',
    muhurtaAIDesc: 'AI-powered personalised muhurta scoring for 20+ activities.',
    panchangToday: 'Today\'s Panchang',
    panchangTodayDesc: 'Check tithi, nakshatra, yoga, and karana for today.',
  },
  hi: {
    findDate: 'मुहूर्त AI से अपनी तिथि खोजें',
    findDateDesc: 'हमारा AI-संचालित इंजन आपकी विशिष्ट गतिविधि के लिए पंचांग, गोचर, होरा और चौघड़िया के आधार पर समय खंडों को 0-100 अंक देता है।',
    upcomingDates: '2026 की आगामी शुभ तिथियां',
    upcomingDesc: 'पारम्परिक वैदिक मुहूर्त नियमों पर आधारित  –  अनुकूल नक्षत्र, तिथि, वार और ग्रह स्थिति।',
    guidance: 'पारम्परिक मार्गदर्शन',
    guidanceDesc: 'वैदिक ग्रन्थों और ज्योतिष शास्त्रों के अनुसार ध्यान देने योग्य बातें।',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    relatedTypes: 'सम्बन्धित मुहूर्त प्रकार',
    viewAll: 'सभी मुहूर्त प्रकार देखें',
    ctaButton: 'सर्वोत्तम मुहूर्त खोजें',
    approximate: 'नोट: ये तिथियां अनुमानित हैं। व्यक्तिगत, स्थान-विशिष्ट सिफारिशों के लिए हमारा मुहूर्त AI टूल उपयोग करें।',
    learnMore: 'मुहूर्त चयन के बारे में और जानें',
    aboutTitle: 'इस संस्कार के बारे में',
    exploreRelated: 'सम्बन्धित उपकरण देखें',
    babyNames: 'नक्षत्र अनुसार शिशु नाम',
    babyNamesDesc: 'जन्म नक्षत्र के अक्षरों पर आधारित शुभ शिशु नाम खोजें।',
    kundali: 'जन्म कुण्डली',
    kundaliDesc: 'अपने शिशु की सम्पूर्ण वैदिक जन्म कुण्डली व्याख्या सहित बनाएं।',
    muhurtaAI: 'मुहूर्त AI उपकरण',
    muhurtaAIDesc: '20+ गतिविधियों के लिए AI-संचालित व्यक्तिगत मुहूर्त अंकन।',
    panchangToday: 'आज का पंचांग',
    panchangTodayDesc: 'आज की तिथि, नक्षत्र, योग और करण देखें।',
  },
  sa: {
    findDate: 'मुहूर्तकृत्रिमबुद्ध्या स्वतिथिं अन्विष्यतु',
    findDateDesc: 'अस्माकं AI-संचालितयन्त्रं भवतः विशिष्टकार्यस्य कृते पञ्चाङ्गगोचरहोराचौघड़ियाधारेण समयखण्डान् ० तः १०० अङ्कान् ददाति।',
    upcomingDates: '२०२६ वर्षस्य आगामिशुभतिथयः',
    upcomingDesc: 'पारम्परिकवैदिकमुहूर्तनियमाधारिताः  –  अनुकूलनक्षत्रतिथिवारग्रहस्थितयः।',
    guidance: 'पारम्परिकमार्गदर्शनम्',
    guidanceDesc: 'वैदिकग्रन्थानां ज्योतिषशास्त्राणां च अनुसारं विचारणीयाः विषयाः।',
    faq: 'प्रायः पृच्छ्यमानाः प्रश्नाः',
    relatedTypes: 'सम्बद्धमुहूर्तप्रकाराः',
    viewAll: 'सर्वान् मुहूर्तप्रकारान् पश्यतु',
    ctaButton: 'सर्वोत्तमं मुहूर्तम् अन्विष्यतु',
    approximate: 'टिप्पणी: एताः तिथयः अनुमानिताः। व्यक्तिगतस्थानविशिष्टानुशंसनार्थं अस्माकं मुहूर्त AI साधनम् उपयुज्यताम्।',
    learnMore: 'मुहूर्तचयनस्य विषये अधिकं जानीयात्',
    aboutTitle: 'अस्य संस्कारस्य विषये',
    exploreRelated: 'सम्बद्धसाधनानि अवलोकयतु',
    babyNames: 'नक्षत्रानुसारं शिशुनामानि',
    babyNamesDesc: 'जन्मनक्षत्राक्षराधारितानि शुभशिशुनामानि अन्विष्यतु।',
    kundali: 'जन्मकुण्डली',
    kundaliDesc: 'शिशोः सम्पूर्णां वैदिकजन्मकुण्डलीं व्याख्यासहितां रचयतु।',
    muhurtaAI: 'मुहूर्त-AI-साधनम्',
    muhurtaAIDesc: '२०+ कार्याणां कृते AI-संचालितं व्यक्तिगतमुहूर्ताङ्कनम्।',
    panchangToday: 'अद्यतनपञ्चाङ्गम्',
    panchangTodayDesc: 'अद्य तिथिं नक्षत्रं योगं करणं च पश्यतु।',
  },
};

function t(key: string, locale: string): string {
  return L[locale]?.[key] || L.en[key] || key;
}

function tName(obj: { en: string; hi: string; sa: string }, locale: string): string {
  return (obj as Record<string, string>)[locale] || obj.en;
}

export default async function MuhurtaTypePage({ params }: { params: Promise<{ locale: string; type: string }> }) {
  const { type } = await params;
  const locale = await getLocale();
  setRequestLocale(locale);
  const info = getMuhurtaType(type);
  if (!info) notFound();

  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const isDevanagari = isDevanagariLocale(locale);

  const relatedTypes = info.related
    .map(slug => getMuhurtaType(slug))
    .filter((r): r is MuhurtaTypeInfo => !!r);

  // JSON-LD structured data
  const toolLD = generateToolLD(
    `${info.name.en}  –  Auspicious Dates 2026`,
    info.description.en,
    `https://dekhopanchang.com/${locale}/muhurta/${type}`,
  );
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/muhurta/${type}`, locale);

  // Merge FAQs from muhurta-types + centralised faq-data for richer schema
  const centralFaqs = FAQ_DATA[`/muhurta/${type}`] ?? [];
  const allFaqEntries = [
    ...info.faqs.map(faq => ({
      q: (faq.question as Record<string, string>)[locale] || faq.question.en,
      a: (faq.answer as Record<string, string>)[locale] || faq.answer.en,
    })),
    ...centralFaqs.map(faq => ({
      q: faq.question[locale] || faq.question.en,
      a: faq.answer[locale] || faq.answer.en,
    })),
  ];
  // Deduplicate by question text (centralised FAQs may overlap with inline ones)
  const seenQuestions = new Set<string>();
  const uniqueFaqEntries = allFaqEntries.filter(entry => {
    const key = entry.q.toLowerCase().trim();
    if (seenQuestions.has(key)) return false;
    seenQuestions.add(key);
    return true;
  });
  const faqLD = uniqueFaqEntries.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: uniqueFaqEntries.map(entry => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.a,
      },
    })),
  } : null;

  // Article content for rich SSR (optional per muhurta type)
  const articleParagraphs = info.article
    ? (info.article[locale as 'en' | 'hi'] || info.article.en)
    : null;

  // All FAQ items for rendering (inline + centralised, deduplicated)
  // Reuse FAQ items from the JSON-LD (already deduplicated)
  const allFaqsForRender = ((faqLD as Record<string, unknown>)?.mainEntity as Array<{name: string; acceptedAnswer: {text: string}}> | undefined)?.map(q => ({
    question: q.name,
    answer: q.acceptedAnswer.text,
  })) ?? [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {faqLD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />}
    <main className="min-h-screen bg-bg-primary" style={bodyFont}>
      {/* ─── Hero Section ────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gold-primary/3 rounded-full blur-[120px]" />
        <div className="absolute top-32 right-1/4 w-48 h-48 bg-gold-primary/5 rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          {/* Visible breadcrumb — reinforces the /muhurta hub → /[type]
              landing relationship for users AND crawlers. The
              schema.org breadcrumb LD above describes the same trail
              for machines; this is the human-readable mirror.
              Labels resolve via the shared BREADCRUMB_HOME / MUHURTA
              maps so all 9 active locales render in their own script
              (Gemini PR #365 MEDIUM — the prior t()-based lookup only
              had en/hi/sa). */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="inline-flex items-center gap-2 text-text-secondary">
              <li>
                <Link href="/" className="hover:text-gold-light transition-colors">
                  {BREADCRUMB_HOME[locale] ?? 'Home'}
                </Link>
              </li>
              <li aria-hidden="true" className="text-gold-dark">/</li>
              <li>
                <Link href="/muhurta" className="hover:text-gold-light transition-colors">
                  {BREADCRUMB_MUHURTA[locale] ?? 'Muhurta'}
                </Link>
              </li>
              <li aria-hidden="true" className="text-gold-dark">/</li>
              <li aria-current="page" className="text-gold-light">
                {tName(info.name, locale)}
              </li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-primary/20 bg-gold-primary/5 text-gold-primary text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Muhurta 2026</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gold-light mb-3 leading-tight"
            style={headingFont}
          >
            {tName(info.name, locale)}
          </h1>

          {locale !== 'en' && (
            <p className="text-xl text-text-secondary mb-2">{tName(info.name, 'en')}</p>
          )}

          <p
            className="text-lg sm:text-xl text-text-primary/80 max-w-3xl mx-auto mt-4 leading-relaxed"
          >
            {tName(info.description, locale)}
          </p>

          <GoldDivider className="mt-8" />
        </div>
      </section>

      {/* ─── Rich Article Section (SSR content for crawlability) ── */}
      {articleParagraphs && articleParagraphs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <ScrollText className="w-6 h-6 text-gold-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
              {t('aboutTitle', locale)}
            </h2>
          </div>

          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 sm:p-8 space-y-5">
            {articleParagraphs.map((para, i) => (
              <p key={i} className="text-text-primary/85 leading-relaxed text-[15px] sm:text-base">
                {para}
              </p>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            <GoldDivider />
          </div>
        </section>
      )}

      {/* ─── CTA: Find Your Date ─────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 via-bg-secondary to-bg-secondary p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-light mb-3" style={headingFont}>
            {t('findDate', locale)}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-6">
            {t('findDateDesc', locale)}
          </p>
          <Link
            href={`/muhurta-ai?activity=${info.activityId}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-primary text-bg-primary font-semibold text-lg hover:bg-gold-light transition-colors"
          >
            {t('ctaButton', locale)}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── Upcoming Auspicious Dates ───────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-gold-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
            {t('upcomingDates', locale)}
          </h2>
        </div>
        <p className="text-text-secondary mb-6 ml-9">
          {t('upcomingDesc', locale)}
        </p>

        <div className="space-y-3">
          {info.dates2026.map((d, i) => (
            <div
              key={d.date}
              className="flex items-start gap-4 p-4 rounded-xl border border-gold-primary/10 bg-bg-secondary/60 hover:border-gold-primary/25 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-primary font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <p className="text-text-primary font-medium">
                  {tName(d.label, locale)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-text-secondary/70 text-sm mt-4 ml-1 italic">
          {t('approximate', locale)}
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <GoldDivider />
      </div>

      {/* ─── Traditional Guidance ─────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-gold-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
            {t('guidance', locale)}
          </h2>
        </div>
        <p className="text-text-secondary mb-6 ml-9">
          {t('guidanceDesc', locale)}
        </p>

        <div className="space-y-4">
          {(info.guidance[locale as 'en' | 'hi' | 'sa'] || info.guidance.en).map((rule, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl border border-gold-primary/10 bg-bg-secondary/40"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-text-primary/90 leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <GoldDivider />
      </div>

      {/* ─── FAQ Section ──────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-gold-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
            {t('faq', locale)}
          </h2>
        </div>

        <div className="space-y-4">
          {allFaqsForRender.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-gold-primary/10 bg-bg-secondary/40 overflow-hidden"
              {...(i === 0 ? { open: true } : {})}
            >
              <summary className="cursor-pointer p-5 flex items-center justify-between text-text-primary font-medium hover:text-gold-light transition-colors list-none">
                <span>{faq.question}</span>
                <span className="text-gold-primary/60 group-open:rotate-45 transition-transform text-xl ml-4 flex-shrink-0">+</span>
              </summary>
              <div className="px-5 pb-5 text-text-secondary leading-relaxed border-t border-gold-primary/5 pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <GoldDivider />
      </div>

      {/* ─── Related Muhurat Types ────────────────────────────── */}
      {relatedTypes.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-light mb-6" style={headingFont}>
            {t('relatedTypes', locale)}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTypes.map(related => (
              <Link
                key={related.slug}
                href={`/muhurta/${related.slug}`}
                className="group p-5 rounded-xl border border-gold-primary/10 bg-bg-secondary/40 hover:border-gold-primary/30 hover:bg-bg-secondary/70 transition-all"
              >
                <h3 className="text-gold-light font-semibold mb-1 group-hover:text-gold-primary transition-colors" style={headingFont}>
                  {tName(related.name, locale)}
                </h3>
                <p className="text-text-secondary text-sm line-clamp-2">
                  {tName(related.description, locale)}
                </p>
                <span className="inline-flex items-center gap-1 text-gold-primary/60 text-sm mt-3 group-hover:text-gold-primary transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t('learnMore', locale)}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/muhurta-ai"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/5 transition-colors"
            >
              {t('viewAll', locale)}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ─── Cross-links to Related Tools ──────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <LinkIcon className="w-6 h-6 text-gold-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
            {t('exploreRelated', locale)}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/baby-names"
            className="group flex items-start gap-4 p-5 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/30 transition-all"
          >
            <Baby className="w-8 h-8 text-gold-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors" style={headingFont}>
                {t('babyNames', locale)}
              </h3>
              <p className="text-text-secondary text-sm mt-1">{t('babyNamesDesc', locale)}</p>
            </div>
          </Link>

          <Link
            href="/kundali"
            className="group flex items-start gap-4 p-5 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/30 transition-all"
          >
            <Star className="w-8 h-8 text-gold-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors" style={headingFont}>
                {t('kundali', locale)}
              </h3>
              <p className="text-text-secondary text-sm mt-1">{t('kundaliDesc', locale)}</p>
            </div>
          </Link>

          <Link
            href="/muhurta-ai"
            className="group flex items-start gap-4 p-5 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/30 transition-all"
          >
            <Sparkles className="w-8 h-8 text-gold-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors" style={headingFont}>
                {t('muhurtaAI', locale)}
              </h3>
              <p className="text-text-secondary text-sm mt-1">{t('muhurtaAIDesc', locale)}</p>
            </div>
          </Link>

          <Link
            href="/panchang"
            className="group flex items-start gap-4 p-5 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] hover:border-gold-primary/30 transition-all"
          >
            <Calendar className="w-8 h-8 text-gold-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors" style={headingFont}>
                {t('panchangToday', locale)}
              </h3>
              <p className="text-text-secondary text-sm mt-1">{t('panchangTodayDesc', locale)}</p>
            </div>
          </Link>
        </div>
      </section>

      {/*
        2026-06-01 E-E-A-T pass — muhurta pages punch above their weight
        (positions 3-5 on activity queries) but lacked author attribution.
        Named author improves Google's per-page E-E-A-T classifier and
        rich-result eligibility. See docs/specs/2026-06-01-eeat-author-
        credentials.md.
      */}
      <section className="max-w-5xl mx-auto px-4">
        <AuthorByline />
      </section>

      {/* Bottom spacing */}
      <div className="h-16" />
    </main>
    </>
  );
}
