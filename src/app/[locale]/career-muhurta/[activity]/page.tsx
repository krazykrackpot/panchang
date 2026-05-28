import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { CAREER_CONTENT, SLUG_TO_ACTIVITY } from '@/lib/career/career-content';
import type { CareerActivityId } from '@/types/muhurta-ai';
import { tl } from '@/lib/utils/trilingual';
import CareerMuhurtaClient from '../CareerMuhurtaClient';
import CareerBrihaspatiCTA from '@/components/career/CareerBrihaspatiCTA';

// Force-dynamic — same reason as the index page. Mounting CareerMuhurtaClient,
// which computes its `dates` array via `todayInTimezone()` at render time,
// inside an ISR-cached HTML envelope creates the same React #418 trap that hit
// /choghadiya/[date] + /gauri-panchang/[date] on 2026-05-28 (PR #267 + #269).
export const dynamic = 'force-dynamic';

// generateStaticParams intentionally removed — force-dynamic supersedes any
// pre-render. Adding it back would be a no-op at request time but would
// confuse the next build budget audit.

export default async function CareerActivityLanding({ params }: { params: Promise<{ locale: string; activity: string }> }) {
  const { locale, activity: slug } = await params;
  setRequestLocale(locale);
  const activityId: CareerActivityId | undefined = SLUG_TO_ACTIVITY[slug];
  if (!activityId) notFound();
  const c = CAREER_CONTENT[activityId];

  const isTa = locale === 'ta';
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-text-secondary">
          <Link href={`/${locale}/career-muhurta`} className="hover:text-gold-light transition-colors">
            {isTa ? 'தொழில் முகூர்த்தம்' : isHi ? 'करियर मुहूर्त' : 'Career Muhurta'}
          </Link>
          <span className="mx-2 text-text-secondary/40">/</span>
          <span className="text-text-primary">{tl(c.name, locale)}</span>
        </nav>

        {/* Hero */}
        <div className="flex items-start gap-3">
          <span className="mt-1 shrink-0 w-10 h-10 rounded-xl bg-gold-primary/10 border border-gold-primary/25 flex items-center justify-center">
            <Briefcase size={20} className="text-gold-primary" />
          </span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold-light leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {tl(c.name, locale)}
            </h1>
            <p className="text-text-secondary text-sm mt-1 italic">
              {c.classicalName.sanskrit} · {c.classicalName.transliteration}
            </p>
          </div>
        </div>

        <p className="text-text-primary text-lg mt-4 leading-relaxed">{tl(c.oneLiner, locale)}</p>

        {/* Classical Rationale */}
        <section className="mt-8">
          <h2 className="text-gold-light text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTa ? 'பாரம்பரிய அடிப்படை' : isHi ? 'शास्त्रीय आधार' : 'Classical Rationale'}
          </h2>
          <p className="text-text-primary leading-relaxed">{tl(c.classicalRationale, locale)}</p>
        </section>

        {/* Sibling Comparison */}
        <section className="mt-8">
          <h2 className="text-gold-light text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTa ? 'பிற தொழில் முகூர்த்தங்களுடன் வேறுபாடு' : isHi ? 'अन्य करियर मुहूर्तों से अंतर' : 'How This Differs from Other Career Muhurtas'}
          </h2>
          <p className="text-text-primary leading-relaxed">{tl(c.siblingComparison, locale)}</p>
        </section>

        {/* What to Avoid */}
        <section className="mt-8">
          <h2 className="text-gold-light text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTa ? 'தவிர்க்க வேண்டியவை' : isHi ? 'क्या टालें' : 'What to Avoid'}
          </h2>
          <p className="text-text-primary leading-relaxed">{tl(c.whatToAvoid, locale)}</p>
        </section>
      </div>

      {/* 30-day calendar — locked to this activity */}
      <CareerMuhurtaClient activityLocked={activityId} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-gold-light text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : isHi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            {c.faqs.map((faq, i) => (
              <details key={i} className="rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4 group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                  <span className="text-gold-light font-medium text-base">{tl(faq.q, locale)}</span>
                  <span aria-hidden="true" className="text-gold-primary/60 text-sm shrink-0 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="text-text-primary mt-3 leading-relaxed">{tl(faq.a, locale)}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Brihaspati hand-off — see spec §13 question 3 (Yes — Recommended).
            The CTA is the same on every activity landing; the prompt
            template is parameterised by the activity ID. */}
        <CareerBrihaspatiCTA activityId={activityId} />

        {/* Siblings */}
        <section className="mt-10">
          <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
            {isTa ? 'தொடர்புடைய தொழில் முகூர்த்தங்கள்' : isHi ? 'सम्बन्धित करियर मुहूर्त' : 'Related Career Muhurtas'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {c.siblings.map((sid) => (
              <Link
                key={sid}
                href={`/${locale}/career-muhurta/${CAREER_CONTENT[sid].slug}`}
                className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-gold-light border border-gold-primary/10 hover:border-gold-primary/25 hover:bg-gold-primary/5 transition-colors"
              >
                {tl(CAREER_CONTENT[sid].name, locale)}
              </Link>
            ))}
          </div>
        </section>

        {/* Top-level nav */}
        <nav className="flex flex-wrap gap-3 mt-10 mb-8 text-sm">
          <Link href={`/${locale}/career-muhurta`} className="text-gold-primary hover:text-gold-light transition-colors">
            ← {isTa ? 'அனைத்து தொழில் முகூர்த்தங்கள்' : isHi ? 'सभी करियर मुहूर्त' : 'All career muhurtas'}
          </Link>
          <Link href={`/${locale}/learn/career-muhurta`} className="text-gold-primary hover:text-gold-light transition-colors">
            {isTa ? 'விளக்கம்' : isHi ? 'विस्तृत जानकारी' : 'Learn the theory'}
          </Link>
          <Link href={`/${locale}/muhurta-ai`} className="text-gold-primary hover:text-gold-light transition-colors">
            {isTa ? 'முகூர்த்த AI' : isHi ? 'मुहूर्त AI' : 'Muhurta AI'}
          </Link>
        </nav>
      </div>
    </main>
  );
}
