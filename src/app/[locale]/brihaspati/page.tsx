import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { BrihaspatiLandingCTA } from '@/components/brihaspati/BrihaspatiLandingCTA';

interface Feature { title: string; body: string }
interface Faq { q: string; a: string }

export default async function BrihaspatiLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('brihaspati.landing');
  const tPanel = await getTranslations('brihaspati.panel');

  const features = t.raw('features') as Feature[];
  const samples = t.raw('samples') as string[];
  const faqEntries = t.raw('faq') as Faq[];
  const ctaLabel = t('ctaPrimary');

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Brihaspati — Vedic AI Astrologer',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any (Web)',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    // aggregateRating removed May 2026 — was hardcoded `{ ratingValue: '4.8',
    // ratingCount: '120' }` with no review-collection backing. Google's
    // rich-result policy disallows fabricated aggregate ratings; manual
    // action risk > the snippet enhancement. Wire to a real review source
    // (e.g. user_reviews table) before re-enabling. Audit 2026-05-25 §D9.
    description: t('jsonLdDescription'),
    url: `https://dekhopanchang.com/${locale}/brihaspati`,
    inLanguage: locale,
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <section className="relative max-w-5xl mx-auto px-6 sm:px-10 pt-12 sm:pt-20 pb-12 text-center">
        <p className="text-gold-primary text-[11px] sm:text-xs uppercase tracking-[0.32em] font-semibold mb-4">
          {tPanel('title')} · {t('eyebrow')}
        </p>
        <h1
          className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#f0d48a] bg-clip-text text-transparent leading-tight mb-6"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {t('headline')}
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
          {t('subhead')}
        </p>
        <BrihaspatiLandingCTA label={ctaLabel} />
        <p className="text-xs text-text-secondary mt-4">{t('trustLine')}</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-colors"
          >
            <h2 className="text-lg font-bold text-gold-light mb-3">{f.title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
        <h2 className="text-3xl font-bold text-gold-light mb-6" style={{ fontFamily: 'var(--font-cinzel)' }}>
          {t('samplesTitle')}
        </h2>
        <ul className="space-y-3 text-text-primary">
          {samples.map((q) => (
            <li
              key={q}
              className="rounded-xl px-5 py-4 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10"
            >
              <span className="text-gold-primary mr-2" aria-hidden="true">›</span>
              {q}
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
        <h2 className="text-3xl font-bold text-gold-light mb-8" style={{ fontFamily: 'var(--font-cinzel)' }}>
          {t('faqTitle')}
        </h2>
        <div className="space-y-4">
          {faqEntries.map(({ q, a }) => (
            <details
              key={q}
              className="rounded-xl px-5 py-4 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 hover:border-gold-primary/30 transition-colors group"
            >
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-gold-light list-none flex justify-between items-start">
                <span>{q}</span>
                <span className="text-gold-primary ml-4 group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
              </summary>
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-10 py-12 text-center">
        <BrihaspatiLandingCTA label={ctaLabel} />
        <p className="text-xs text-text-secondary mt-6">
          {t('sadhakaCtaPre')}{' '}
          <Link href={`/${locale}/sadhaka-path`} className="text-gold-primary hover:underline">
            {t('sadhakaCtaLink')}
          </Link>{' '}
          {t('sadhakaCtaSuffix')}
        </p>
      </section>
    </main>
  );
}
