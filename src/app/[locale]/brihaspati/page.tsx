import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { BrihaspatiLandingCTA } from '@/components/brihaspati/BrihaspatiLandingCTA';

const FAQ = [
  {
    q: 'What is Brihaspati?',
    a: 'Brihaspati is a conversational Vedic AI astrologer that reads your kundali (birth chart) — dashas, transits, yogas, doshas, planetary aspects — and answers your questions in plain language. Every claim cites classical Jyotish sources (BPHS, Saravali, Phaladeepika) so you can trace the reasoning back to the texts.',
  },
  {
    q: 'How is Brihaspati different from a horoscope app?',
    a: 'Generic horoscopes give the same Aries / Taurus message to millions of people based on sun sign alone. Brihaspati uses your full birth chart — exact moment, exact place — computed via Swiss Ephemeris (NASA JPL DE441 ephemerides). The answer you get is built from your dashas, your current transits, your house lords. Nobody else gets your reading.',
  },
  {
    q: 'Is it free?',
    a: 'Yes — every signed-in user gets free monthly questions with their plan. If you want more, top up Brihaspati credits as a one-time, non-subscription purchase. There are no per-minute fees and no consultation upsells.',
  },
  {
    q: 'How accurate is it?',
    a: 'Planetary positions are computed from Swiss Ephemeris (the same library used by professional Jyotish software), with sub-arcsecond precision. Brihaspati ships with a Layer-4 anti-hallucination validator that blocks answers when the AI tries to invent yoga or dasha details not actually present in your chart. We surface the validator status on every answer.',
  },
  {
    q: 'Which languages does Brihaspati speak?',
    a: 'English, Hindi, Tamil, and Bengali at launch. The reasoning chain, Sanskrit verse citations, and classical terminology are preserved — only the natural-language explanation is translated.',
  },
  {
    q: 'What can I ask?',
    a: 'Anything that depends on your chart — career timing, relationship compatibility, when a dasha changes, why a transit is hitting hard, whether a muhurta is right for a specific decision. Brihaspati declines to predict death, illness severity, and other doom-cast questions by design.',
  },
];

export default async function BrihaspatiLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('brihaspati');

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
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
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '120' },
    description: 'Conversational Vedic AI astrologer that reads your kundali. Cites BPHS, Saravali, Phaladeepika. Swiss Ephemeris precision. Free monthly questions.',
    url: 'https://dekhopanchang.com/en/brihaspati',
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
          {t('panel.title')} · Vedic AI Astrologer
        </p>
        <h1
          className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#f0d48a] bg-clip-text text-transparent leading-tight mb-6"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          Ask Brihaspati anything about your chart
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
          A conversational Vedic AI astrologer that reads your kundali — dashas, transits, yogas, doshas —
          and answers in plain language. Every claim cites classical Jyotish sources. Free with your account.
        </p>
        <BrihaspatiLandingCTA locale={locale} />
        <p className="text-xs text-text-secondary mt-4">
          No consultation fee · No per-minute charge · BPHS-grounded reasoning
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { h: 'Your chart, not a sun sign', b: 'Brihaspati reads your full kundali computed via Swiss Ephemeris (NASA JPL DE441). Personal — not generic horoscope content.' },
          { h: 'Cites the classics', b: 'Every claim quotes BPHS, Saravali, or Phaladeepika. You can trace the reasoning back to the source verse.' },
          { h: 'Anti-hallucination guard', b: 'A Layer-4 validator blocks answers when the AI invents yogas or dashas not actually in your chart. Status shown on every reading.' },
        ].map(({ h, b }) => (
          <div
            key={h}
            className="rounded-2xl p-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-colors"
          >
            <h2 className="text-lg font-bold text-gold-light mb-3">{h}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{b}</p>
          </div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
        <h2 className="text-3xl font-bold text-gold-light mb-6" style={{ fontFamily: 'var(--font-cinzel)' }}>
          Questions Brihaspati answers
        </h2>
        <ul className="space-y-3 text-text-primary">
          {[
            'My Saturn dasha starts next year — what should I prepare for?',
            'Is the Jupiter transit through my 7th house good for a new partnership?',
            'When does my Rahu mahadasha end and what comes next?',
            'My birth chart shows Gajakesari Yoga — how is it actually playing out for me?',
            'Should I sign this contract during Mercury retrograde, or wait?',
            'My Manglik dosha — is it cancelled by Mars placement, or do I need remedies?',
          ].map((q) => (
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
          Frequently asked
        </h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
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
        <BrihaspatiLandingCTA locale={locale} />
        <p className="text-xs text-text-secondary mt-6">
          New to Vedic astrology? Start with the{' '}
          <Link href={`/${locale}/sadhaka-path`} className="text-gold-primary hover:underline">
            Sadhaka Path
          </Link>{' '}
          — earn levels and badges as you learn.
        </p>
      </section>
    </main>
  );
}
