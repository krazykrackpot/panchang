'use client';

/**
 * /[locale]/brihaspati/history
 *
 * Past Q&A list for the signed-in user. Paginated 20/page. Each row
 * expands to show the full answer. Linked from the Brihaspati panel
 * footer when state=done, and from UserMenu / dashboard (Phase 9.11).
 */

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getSupabase } from '@/lib/supabase/client';

interface QuestionRow {
  id: string;
  question: string;
  answer: string | null;
  locale: string;
  query_category: string | null;
  tier: number | null;
  pricing_tier: string | null;
  status: string;
  validation_passed: boolean | null;
  user_rating: number;
  created_at: string;
  completed_at: string | null;
}

const PAGE_SIZE = 20;

const TIER_LABEL_KEY: Record<number, string> = {
  0: 'history.tier0',
  1: 'history.tier1',
  2: 'history.tier2',
};

export default function BrihaspatiHistoryPage() {
  const t = useTranslations('brihaspati');
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const load = useCallback(async (pageIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Supabase client not available');
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        setError(t('history.errorSignIn'));
        setLoading(false);
        return;
      }
      const userId = sessionData.session.user.id;
      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE; // intentionally one extra to detect hasMore
      const { data, error: qErr } = await supabase
        .from('brihaspati_questions')
        .select('id, question, answer, locale, query_category, tier, pricing_tier, status, validation_passed, user_rating, created_at, completed_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);
      if (qErr) throw new Error(qErr.message);
      const items = (data ?? []) as QuestionRow[];
      setHasMore(items.length > PAGE_SIZE);
      setRows(items.slice(0, PAGE_SIZE));
    } catch (err) {
      console.error('[brihaspati/history] load failed:', err);
      setError(err instanceof Error ? err.message : t('history.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load(page);
  }, [page, load]);

  return (
    <main className="min-h-screen px-4 sm:px-6 py-10 max-w-3xl mx-auto text-text-primary">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-gold-light">{t('history.title')}</h1>
        <p className="text-text-secondary mt-2 text-sm">
          {t('history.subtitle')}
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading && rows.length === 0 ? (
        <p className="text-text-secondary">{t('history.loading')}</p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 px-6 py-12 text-center">
          <p className="text-text-secondary">{t('history.empty')}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const open = expandedId === row.id;
            const date = new Date(row.created_at).toLocaleString();
            return (
              <li
                key={row.id}
                className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(open ? null : row.id)}
                  className="w-full text-left px-5 py-4"
                  aria-expanded={open}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-gold-light text-sm font-medium leading-snug">{row.question}</p>
                      <div className="mt-1 flex items-center gap-2 text-text-secondary text-xs">
                        <span>{date}</span>
                        {row.query_category && (
                          <>
                            <span aria-hidden>•</span>
                            <span className="uppercase tracking-wide">{row.query_category}</span>
                          </>
                        )}
                        {row.tier !== null && TIER_LABEL_KEY[row.tier] && (
                          <>
                            <span aria-hidden>•</span>
                            <span>{t(TIER_LABEL_KEY[row.tier] as never)}</span>
                          </>
                        )}
                        {row.validation_passed === false && (
                          <>
                            <span aria-hidden>•</span>
                            <span className="text-amber-300/80">{t('history.partialMatch')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-text-secondary text-xs">{open ? '▾' : '▸'}</span>
                  </div>
                  {open && (
                    <div className="mt-4 border-t border-gold-primary/15 pt-4">
                      {row.status === 'completed' && row.answer ? (
                        <p className="whitespace-pre-wrap text-sm text-text-primary leading-relaxed">{row.answer}</p>
                      ) : (
                        <p className="text-text-secondary italic">
                          {row.status === 'failed'
                            ? t('history.pendingPrepared')
                            : t('history.pendingShort')}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {(page > 0 || hasMore) && (
        <nav className="flex items-center justify-between mt-8" aria-label={t('history.paginationAriaLabel')}>
          <button
            type="button"
            disabled={page === 0 || loading}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-4 py-2 rounded-md border border-gold-primary/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold-primary/50"
          >
            {t('history.paginationNewer')}
          </button>
          <span className="text-text-secondary text-xs">{t('history.paginationPage', { n: page + 1 })}</span>
          <button
            type="button"
            disabled={!hasMore || loading}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-md border border-gold-primary/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-gold-primary/50"
          >
            {t('history.paginationOlder')}
          </button>
        </nav>
      )}
    </main>
  );
}
