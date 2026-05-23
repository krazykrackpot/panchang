import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { LEVELS } from '@/lib/constants/levels';
import { BADGES } from '@/lib/constants/badges';
import { TOTAL_MODULES } from '@/lib/learn/module-sequence';
import { tl } from '@/lib/utils/trilingual';

export default async function SadhakaPathLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const totalLevels = LEVELS.length;
  const totalBadges = BADGES.length;
  const badgeCategories = Array.from(new Set(BADGES.map((b) => b.category)));

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Sadhaka Path — Free Vedic Astrology Learning Quest',
    description: `Free structured Vedic astrology curriculum with ${totalLevels} levels, ${totalBadges} badges, and a daily streak. Built on a ${TOTAL_MODULES}-module curriculum covering panchang, kundali, dashas, yogas, transits, and remedies.`,
    provider: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      sameAs: 'https://dekhopanchang.com',
    },
    educationalLevel: 'Beginner to Advanced',
    inLanguage: ['en', 'hi', 'ta', 'bn', 'gu', 'kn', 'te', 'mai'],
    isAccessibleForFree: true,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT2H',
    },
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      <section className="relative max-w-5xl mx-auto px-6 sm:px-10 pt-12 sm:pt-20 pb-12 text-center">
        <p className="text-gold-primary text-[11px] sm:text-xs uppercase tracking-[0.32em] font-semibold mb-4">
          Free · Open · No subscription
        </p>
        <h1
          className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#f0d48a] bg-clip-text text-transparent leading-tight mb-6"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          Sadhaka Path
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
          A free, gamified path through Vedic astrology — {totalLevels} levels, {totalBadges} badges, daily streak, and a {TOTAL_MODULES}-module curriculum. Earn portraits as you grow from Shishya to Acharya.
        </p>
        <Link
          href={`/${locale}/learn`}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] text-[#0a0e27] font-bold text-base sm:text-lg hover:from-[#fff4cc] hover:to-[#d4a853] transition-all shadow-lg shadow-gold-primary/30 hover:shadow-gold-primary/50"
        >
          Start your path
          <span aria-hidden="true">→</span>
        </Link>
        <p className="text-xs text-text-secondary mt-4">
          Sign in to track progress · Already started?{' '}
          <Link href={`/${locale}/path`} className="text-gold-primary hover:underline">
            View your dashboard
          </Link>
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
        <h2 className="text-3xl font-bold text-gold-light mb-2 text-center" style={{ fontFamily: 'var(--font-cinzel)' }}>
          The {totalLevels} levels
        </h2>
        <p className="text-sm text-text-secondary text-center mb-10">
          From beginner to acharya — one path, one progression.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {LEVELS.map((level) => (
            <div
              key={level.slug}
              className="flex flex-col items-center text-center rounded-2xl p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
            >
              <Image
                src={level.image}
                alt={tl(level.name, locale)}
                width={96}
                height={96}
                className="rounded-full border-2 border-gold-primary/40 shadow-[0_0_18px_rgba(212,168,83,0.25)] mb-3"
              />
              <p className="text-[10px] uppercase tracking-widest text-gold-primary mb-1">
                Level {level.ordinal}
              </p>
              <p className="text-base font-bold text-gold-light mb-2">
                {tl(level.name, locale)}
              </p>
              <p className="text-xs text-text-secondary leading-snug">
                {tl(level.criteria, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
        <h2 className="text-3xl font-bold text-gold-light mb-2 text-center" style={{ fontFamily: 'var(--font-cinzel)' }}>
          {totalBadges} badges across {badgeCategories.length} categories
        </h2>
        <p className="text-sm text-text-secondary text-center mb-10">
          Earn them as you complete profile, save charts, finish modules, use tools, and hold your streak.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => (
            <div
              key={badge.slug}
              className="rounded-xl p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10"
            >
              <p className="text-[10px] uppercase tracking-widest text-gold-primary mb-2">
                {badge.category}
              </p>
              <p className="text-base font-bold text-gold-light mb-2">
                {tl(badge.name, locale)}
              </p>
              <p className="text-sm text-text-secondary">{tl(badge.description, locale)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 sm:px-10 py-12 text-center">
        <h2 className="text-3xl font-bold text-gold-light mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>
          Why a learning quest, not just articles?
        </h2>
        <p className="text-base text-text-secondary leading-relaxed max-w-3xl mx-auto mb-6">
          Vedic astrology has a steep entry. Tithi, nakshatra, dasha, yoga, shadbala — without structure, beginners bounce off in five minutes. The Sadhaka Path gives you a single ordered route through everything, with progress markers so you always know what comes next and a streak so the habit forms.
        </p>
        <p className="text-base text-text-secondary leading-relaxed max-w-3xl mx-auto mb-8">
          You can also{' '}
          <Link href={`/${locale}/brihaspati`} className="text-gold-primary hover:underline font-semibold">
            ask Brihaspati
          </Link>{' '}
          anything along the way — the AI astrologer reads your own chart and answers your questions in plain language, with classical citations.
        </p>
        <Link
          href={`/${locale}/learn`}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] text-[#0a0e27] font-bold text-base sm:text-lg hover:from-[#fff4cc] hover:to-[#d4a853] transition-all shadow-lg shadow-gold-primary/30"
        >
          Begin with the first module
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
