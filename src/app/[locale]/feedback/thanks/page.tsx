/**
 * Thank-you destination for the NPS click-capture flow.
 *
 * Rendered after `/api/feedback/nps?score=N&token=T` records the score
 * and 303-redirects here. The score is echoed so the user knows their
 * tap registered (the difference between "did it work?" and "did it
 * silently fail?" is the whole point of having this page).
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank you for your feedback — Dekho Panchang',
  robots: { index: false, follow: false },
};

const COPY = {
  en: {
    headline: 'Thank you.',
    subhead: (n: number) =>
      `Your score of ${n} is in — recorded directly to my notes, no extra step needed.`,
    addReason: 'Have 30 seconds more?',
    addReasonBody:
      'Tell me why you picked that number — a single sentence is plenty. The reply lands in my inbox personally.',
    cta: 'Reply with a reason',
    backToDashboard: 'Back to your dashboard',
  },
  hi: {
    headline: 'धन्यवाद।',
    subhead: (n: number) =>
      `आपका ${n} स्कोर दर्ज हो गया — सीधे मेरे नोट्स में, बिना किसी अतिरिक्त कदम के।`,
    addReason: '30 सेकंड और हैं?',
    addReasonBody:
      'मुझे बताइए कि आपने वह संख्या क्यों चुनी — एक वाक्य पर्याप्त है। उत्तर सीधे मेरे इनबॉक्स में आएगा।',
    cta: 'कारण के साथ उत्तर दें',
    backToDashboard: 'अपने डैशबोर्ड पर वापस जाएँ',
  },
};

type Locale = keyof typeof COPY;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ score?: string }>;
}

function parseScore(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isInteger(n) || n < 0 || n > 10 || String(n) !== raw) return null;
  return n;
}

export default async function FeedbackThanksPage({ params, searchParams }: PageProps) {
  const { locale: localeRaw } = await params;
  const { score: scoreRaw } = await searchParams;

  const locale = (localeRaw in COPY ? localeRaw : 'en') as Locale;
  const L = COPY[locale];
  const score = parseScore(scoreRaw);

  return (
    <main
      className="mx-auto max-w-xl px-6 py-20 text-center"
      data-testid="feedback-thanks"
    >
      <h1 className="text-3xl font-bold text-gold-light">{L.headline}</h1>

      {score !== null && (
        <p className="mt-4 text-text-secondary text-base">{L.subhead(score)}</p>
      )}

      <div className="mt-12 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 text-left">
        <p className="text-gold-light font-semibold text-base">{L.addReason}</p>
        <p className="mt-2 text-text-secondary text-sm leading-relaxed">{L.addReasonBody}</p>
        <a
          href={`mailto:namaste@dekhopanchang.com?subject=${encodeURIComponent(
            score !== null ? `NPS ${score} — reason` : 'NPS feedback',
          )}`}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 bg-gold-primary/15 hover:bg-gold-primary/25 border border-gold-primary/30 rounded-lg text-gold-light text-sm font-semibold transition-colors"
        >
          {L.cta} →
        </a>
      </div>

      <div className="mt-8">
        <Link
          href={`/${locale}/dashboard`}
          className="text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          {L.backToDashboard} →
        </Link>
      </div>
    </main>
  );
}
