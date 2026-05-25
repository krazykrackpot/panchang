'use client';

/**
 * Public answer page — /<locale>/brihaspati/answer/<questionId>
 *
 * Renders a Brihaspati reading that the asker shared via the panel's
 * Copy / WhatsApp / Native share buttons. Anonymous; no auth required.
 *
 * Source of truth: GET /api/brihaspati/share/<id>. That endpoint gates
 * on is_public_share=true server-side; this page only renders what it
 * receives.
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { BrihaspatiAvatar } from '@/components/brihaspati/BrihaspatiAvatar';
import { Link } from '@/lib/i18n/navigation';

interface SharedAnswer {
  id: string;
  question: string;
  answer: string;
  locale: string;
  completedAt: string | null;
  validationPassed: boolean | null;
}

export default function BrihaspatiSharedAnswerPage() {
  const locale = useLocale() as Locale;
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isDeva = isDevanagariLocale(locale);
  const headingFont = isDeva
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDeva
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : undefined;

  const [data, setData] = useState<SharedAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/brihaspati/share/${params.id}`, { cache: 'no-store' });
        if (!res.ok) {
          if (res.status === 404) {
            setError(isDeva ? 'यह उत्तर साझा नहीं किया गया है या नहीं मिला' : 'This answer is not shared or was not found');
          } else {
            setError(isDeva ? 'उत्तर लोड नहीं हो सका' : 'Could not load the answer');
          }
          return;
        }
        const json = await res.json() as SharedAnswer;
        if (!cancelled) setData(json);
      } catch (err) {
        console.error('[brihaspati/answer] load failed:', err);
        if (!cancelled) setError(isDeva ? 'उत्तर लोड नहीं हो सका' : 'Could not load the answer');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params?.id, isDeva]);

  const onAskOwnQuestion = () => {
    router.push(`/${locale}/`);
    // Hint the BrihaspatiProvider on the next page to open the panel via
    // the shared event-bus contract. This is the same hook that the
    // marketing banner uses.
    setTimeout(() => {
      try {
        window.dispatchEvent(new CustomEvent('brihaspati:open', { detail: { entry: 'shared_answer_cta' } }));
      } catch { /* event-bus may not be wired on every page; harmless */ }
    }, 400);
  };

  return (
    <main className="min-h-screen px-4 py-12 sm:py-16 bg-gradient-to-b from-bg-primary via-bg-primary to-[#0f1235]">
      <div className="max-w-2xl mx-auto">
        {/* Brand mark */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] border border-gold-primary/40">
            <BrihaspatiAvatar size={40} />
          </div>
          <div className="leading-tight">
            <div className="text-gold-light text-base font-bold tracking-[0.15em]" style={headingFont}>
              BRIHASPATI
            </div>
            <div className="text-text-secondary text-[10px] tracking-wider">
              AI Astrologer · dekhopanchang.com
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-text-secondary text-sm">
              {isDeva ? 'उत्तर लोड हो रहा है…' : 'Loading the reading…'}
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-8 text-center">
            <h1 className="text-xl text-red-200 font-semibold mb-3" style={headingFont}>
              {isDeva ? 'उत्तर उपलब्ध नहीं' : 'Answer unavailable'}
            </h1>
            <p className="text-text-secondary text-sm mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block px-5 py-2 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-sm font-semibold hover:bg-gold-primary/30"
            >
              {isDeva ? 'मुख्य पृष्ठ' : 'Go to home'}
            </Link>
          </div>
        )}

        {data && !error && (
          <article className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 sm:p-10 shadow-2xl">
            <div className="text-gold-light/70 text-[10px] uppercase tracking-[0.22em] mb-3" style={headingFont}>
              {isDeva ? 'प्रश्न' : 'The question'}
            </div>
            <p className="text-gold-light text-lg sm:text-xl leading-relaxed mb-8" style={{ ...headingFont, fontWeight: 600 }}>
              {data.question}
            </p>

            <div className="border-t border-gold-primary/15 pt-6">
              <div className="text-gold-light/70 text-[10px] uppercase tracking-[0.22em] mb-3" style={headingFont}>
                {isDeva ? 'बृहस्पति का उत्तर' : 'Brihaspati answers'}
              </div>
              <div className="prose-pandit">
                <p
                  className="whitespace-pre-wrap text-text-primary leading-relaxed text-[15px] sm:text-base"
                  style={bodyFont}
                >
                  {data.answer}
                </p>
              </div>
            </div>

            {data.completedAt && (
              <p className="mt-8 text-text-secondary/60 text-[11px] text-right italic">
                {new Date(data.completedAt).toLocaleDateString(locale === 'en' ? 'en-US' : locale, {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            )}
          </article>
        )}

        {/* CTA — ask your own question. Renders whether or not the
            requested answer was found; it's the same value prop either
            way. Hidden during initial loading to keep the page clean. */}
        {!loading && (
          <div className="mt-10 text-center">
            <p className="text-text-secondary text-sm mb-4">
              {isDeva
                ? 'अपना प्रश्न बृहस्पति से पूछें — वैदिक AI ज्योतिषी'
                : 'Ask Brihaspati your own question — the Vedic AI astrologer'}
            </p>
            <button
              type="button"
              onClick={onAskOwnQuestion}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#d4a853] to-[#8a6d2b] text-bg-primary font-bold hover:from-[#f0d48a] hover:to-[#d4a853] transition-colors"
            >
              {isDeva ? 'बृहस्पति से पूछें →' : 'Ask Brihaspati →'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
