'use client';

/**
 * Global state machine for the Brihaspati panel.
 *
 * Owns:
 *  - Whether the panel is open
 *  - The current question text
 *  - The selected pricing tier + currency (geo-detected)
 *  - The streaming answer text
 *  - The user's balance (refreshed when panel opens / after payment)
 *
 * Children consume via the useBrihaspati() hook.
 *
 * No payment SDK is loaded here — components handle their own Razorpay /
 * Stripe widget. This Provider only owns app-level state and the API
 * client.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type {
  BrihaspatiBalance,
  BrihaspatiPricingTier,
} from '@/lib/brihaspati/types';
import {
  trackBrihaspatiPanelOpened,
  trackBrihaspatiPaymentStarted,
  trackBrihaspatiPaymentFailed,
  trackBrihaspatiAnswerStreamed,
  trackBrihaspatiAnswerRated,
} from '@/lib/analytics';

export type Currency = 'INR' | 'USD';

export type PanelEntry = 'button' | 'banner' | 'kundali_tab' | 'oauth_return';

export type PanelState =
  | { kind: 'closed' }
  | { kind: 'idle' }                                  // open, awaiting question
  | { kind: 'composing'; question: string }            // user typing
  | { kind: 'tier_select'; question: string }          // pick tier
  | { kind: 'paying'; question: string; tier: BrihaspatiPricingTier; questionId: string }
  | { kind: 'streaming'; questionId: string; answer: string }
  | { kind: 'done'; questionId: string; answer: string; validation: 'passed' | 'failed' | 'logged' }
  | { kind: 'error'; message: string };

/** A saved chart the user owns — used by the subject picker. */
export interface SavedChartOption {
  id: string;
  label: string;
  is_primary: boolean;
  has_birth_data: boolean;
}

interface BrihaspatiContextValue {
  state: PanelState;
  currency: Currency;
  balance: BrihaspatiBalance | null;
  loading: boolean;
  savedCharts: SavedChartOption[];
  /**
   * Selected subject chart id (null = self / asker's own kundali).
   * Set by the picker; if left null the order route auto-detects from
   * the question text using saved-chart labels.
   */
  subjectChartId: string | null;
  setSubjectChartId(id: string | null): void;
  open(entry?: PanelEntry, prefilledQuestion?: string): void;
  close(): void;
  setQuestion(q: string): void;
  setCurrency(c: Currency): void;
  selectTier(tier: BrihaspatiPricingTier): Promise<void>;
  startQuestion(): Promise<void>;
  rateAnswer(rating: -1 | 1, reason?: string): Promise<void>;
  refreshBalance(): Promise<void>;
}

const Ctx = createContext<BrihaspatiContextValue | null>(null);

export function useBrihaspati(): BrihaspatiContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useBrihaspati must be used inside <BrihaspatiProvider>');
  return v;
}

const STORAGE_PENDING = 'dp-brihaspati-pending';

interface ProviderProps {
  children: React.ReactNode;
  /** Pass the Supabase access token. Auth is owned by the parent app. */
  getAccessToken: () => Promise<string | null>;
  /** Initial currency hint (e.g. from server geo). */
  initialCurrency?: Currency;
}

export function BrihaspatiProvider({ children, getAccessToken, initialCurrency = 'INR' }: ProviderProps) {
  const [state, setState] = useState<PanelState>({ kind: 'closed' });
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);
  const [balance, setBalance] = useState<BrihaspatiBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedCharts, setSavedCharts] = useState<SavedChartOption[]>([]);
  // null = self (default). Explicit value overrides the order-route
  // auto-detector. Reset to null when the panel closes (next question
  // starts fresh).
  const [subjectChartId, setSubjectChartId] = useState<string | null>(null);
  const _entryRef = useRef<PanelEntry | null>(null);

  const open = useCallback((entry: PanelEntry = 'button', prefilled?: string) => {
    _entryRef.current = entry;
    trackBrihaspatiPanelOpened({ entry });
    setState((prev) => {
      if (prev.kind === 'streaming' || prev.kind === 'paying') return prev;
      return prefilled ? { kind: 'composing', question: prefilled } : { kind: 'idle' };
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => (prev.kind === 'streaming' || prev.kind === 'paying' ? prev : { kind: 'closed' }));
  }, []);

  // Restore pending question from OAuth roundtrip (sessionStorage).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pending = window.sessionStorage.getItem(STORAGE_PENDING);
    if (pending) {
      window.sessionStorage.removeItem(STORAGE_PENDING);
      open('oauth_return', pending);
    }
  }, [open]);

  // Restore pending question after Stripe Checkout returns.
  // The /brihaspati/return page sets dp-brihaspati-resume to the
  // questionId. We pick it up, open the panel, and stream the answer
  // directly — payment_verified is set on the row by the Stripe
  // webhook (`stripe listen` forwards locally).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const resumeId = window.sessionStorage.getItem('dp-brihaspati-resume');
    if (!resumeId) return;
    window.sessionStorage.removeItem('dp-brihaspati-resume');

    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setState({ kind: 'error', message: 'sign-in-required' });
          return;
        }
        setState({ kind: 'streaming', questionId: resumeId, answer: '' });
        const streamRes = await fetch('/api/brihaspati', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({ questionId: resumeId }),
        });
        if (!streamRes.ok || !streamRes.body) {
          setState({ kind: 'error', message: 'Stream failed' });
          return;
        }
        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        let answer = '';
        let validation: 'passed' | 'failed' | 'logged' = 'logged';
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const payload = JSON.parse(line.slice(6));
              if (payload.type === 'token' && typeof payload.text === 'string') {
                answer += payload.text;
                setState({ kind: 'streaming', questionId: resumeId, answer });
              } else if (payload.type === 'done') {
                validation = payload.validation ?? 'logged';
              } else if (payload.type === 'error') {
                setState({ kind: 'error', message: String(payload.message) });
                return;
              }
            } catch (err) {
              console.error('[brihaspati] sse parse failed:', err);
            }
          }
        }
        setState({ kind: 'done', questionId: resumeId, answer, validation });
      } catch (err) {
        console.error('[brihaspati] resume failed:', err);
        setState({ kind: 'error', message: 'Resume failed' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setQuestion = useCallback((q: string) => {
    setState((prev) => {
      if (prev.kind === 'closed') return prev;
      return { kind: 'composing', question: q };
    });
  }, []);

  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), []);

  const refreshBalance = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setBalance({ credits: 0, subscription: 'none' });
        return;
      }
      const res = await fetch('/api/brihaspati/balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`balance ${res.status}`);
      const data = (await res.json()) as BrihaspatiBalance;
      setBalance(data);
    } catch (err) {
      console.error('[brihaspati] balance refresh failed:', err);
      setBalance({ credits: 0, subscription: 'none' });
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  // Refresh balance whenever the panel opens.
  useEffect(() => {
    if (state.kind === 'idle' || state.kind === 'composing') {
      void refreshBalance();
    }
  }, [state.kind, refreshBalance]);

  // Load the user's saved charts once when the panel opens. Cheap query
  // (one Supabase round-trip) and the result is cached for the panel
  // lifetime — re-fetched when the panel closes + reopens. Failure is
  // non-fatal: the picker just stays empty and auto-detection takes the
  // hit (it can still match nothing, which falls back to self).
  useEffect(() => {
    if (state.kind !== 'idle' && state.kind !== 'composing') return;
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const res = await fetch('/api/brihaspati/charts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error('[brihaspati] saved charts load failed:', res.status);
          return;
        }
        const data = await res.json() as { charts: SavedChartOption[] };
        if (!cancelled) setSavedCharts(data.charts ?? []);
      } catch (err) {
        console.error('[brihaspati] saved charts fetch error:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [state.kind, getAccessToken]);

  // Reset subject when the panel closes — each new question picks fresh.
  useEffect(() => {
    if (state.kind === 'closed') setSubjectChartId(null);
  }, [state.kind]);

  const selectTier = useCallback(
    async (tier: BrihaspatiPricingTier) => {
      if (state.kind !== 'composing' && state.kind !== 'tier_select') return;
      const question = state.kind === 'composing' ? state.question : state.question;
      setLoading(true);
      try {
        const token = await getAccessToken();
        if (!token) {
          // Persist the question across the OAuth round-trip; AuthModal
          // owns the actual sign-in flow.
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(STORAGE_PENDING, question);
          }
          setState({ kind: 'error', message: 'sign-in-required' });
          return;
        }
        trackBrihaspatiPaymentStarted({ tier, currency });
        const res = await fetch('/api/brihaspati/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            question,
            locale: navigator.language?.slice(0, 2) || 'en',
            tier,
            currency,
            subjectChartId,
          }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({ error: 'order failed' }));
          trackBrihaspatiPaymentFailed({ tier, errorCode: `http_${res.status}` });
          setState({ kind: 'error', message: typeof j.error === 'string' ? j.error : 'Order failed' });
          return;
        }
        const order = await res.json();
        setState({ kind: 'paying', question, tier, questionId: order.questionId });
        // Persist the pending questionId so the success-return page can
        // resume streaming without re-creating the order.
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('dp-brihaspati-resume', order.questionId);
        }
        // Open the payment widget directly.
        //  - Stripe: sessionUrl is the hosted Checkout URL; navigate to it.
        //  - Razorpay: shortUrl is the Razorpay-hosted checkout URL.
        // Either way the user finishes payment on the provider's domain and
        // is redirected back to the /brihaspati/return route configured in
        // success_url / cancel_url.
        const redirectUrl =
          (order.provider === 'stripe' && typeof order.sessionUrl === 'string' && order.sessionUrl) ||
          (order.provider === 'razorpay' && typeof order.shortUrl === 'string' && order.shortUrl) ||
          null;
        if (redirectUrl) {
          window.location.assign(redirectUrl);
        } else {
          console.error('[brihaspati] order returned without a redirect URL', order);
          setState({ kind: 'error', message: 'Payment widget URL missing' });
        }
      } catch (err) {
        console.error('[brihaspati] order failed:', err);
        trackBrihaspatiPaymentFailed({ tier, errorCode: 'exception' });
        setState({ kind: 'error', message: 'Order failed' });
      } finally {
        setLoading(false);
      }
    },
    [state, currency, getAccessToken, subjectChartId],
  );

  /**
   * Called by the payment widget after success (or directly when the
   * user has balance/subscription). Opens the SSE stream and updates
   * state token-by-token until done.
   */
  const startQuestion = useCallback(async () => {
    if (state.kind !== 'paying' && state.kind !== 'composing') return;
    const startedAt = Date.now();
    const questionId =
      state.kind === 'paying' ? state.questionId : '';
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setState({ kind: 'error', message: 'sign-in-required' });
        return;
      }
      // For composing → no payment path means we have balance/subscription.
      // In that case we still need a question_id; create one via /order
      // with currency=user's preference and tier=single (the cheapest
      // sentinel; the API treats it as the balance path because we won't
      // pass paymentRef on the main request).
      let qid = questionId;
      let body: Record<string, unknown> = { questionId: qid };
      if (state.kind === 'composing') {
        const orderRes = await fetch('/api/brihaspati/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            question: state.question,
            locale: navigator.language?.slice(0, 2) || 'en',
            tier: 'single',
            currency,
            subjectChartId,
          }),
        });
        if (!orderRes.ok) {
          setState({ kind: 'error', message: 'Could not initiate question' });
          return;
        }
        const order = await orderRes.json();
        qid = order.questionId;
        body = { questionId: qid };
      }

      setState({ kind: 'streaming', questionId: qid, answer: '' });

      const streamRes = await fetch('/api/brihaspati', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(body),
      });
      if (!streamRes.ok || !streamRes.body) {
        setState({ kind: 'error', message: 'Stream failed' });
        return;
      }

      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let answer = '';
      let validation: 'passed' | 'failed' | 'logged' = 'logged';

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.type === 'token' && typeof payload.text === 'string') {
              answer += payload.text;
              setState({ kind: 'streaming', questionId: qid, answer });
            } else if (payload.type === 'done') {
              validation = payload.validation ?? 'logged';
            } else if (payload.type === 'error') {
              setState({ kind: 'error', message: String(payload.message) });
              return;
            }
          } catch (err) {
            console.error('[brihaspati] sse parse failed:', err);
          }
        }
      }

      setState({ kind: 'done', questionId: qid, answer, validation });
      const validationPassed =
        validation === 'passed' ? true : validation === 'failed' ? false : null;
      trackBrihaspatiAnswerStreamed({
        category: 'unknown', // category set server-side; client doesn't know it post-stream
        model: 'unknown',
        validationPassed,
        outputTokens: Math.round(answer.length / 4),
        latencyMs: Date.now() - startedAt,
      });
      void refreshBalance();
    } catch (err) {
      console.error('[brihaspati] stream failed:', err);
      setState({ kind: 'error', message: 'Stream failed' });
    } finally {
      setLoading(false);
    }
  }, [state, currency, getAccessToken, refreshBalance, subjectChartId]);

  const rateAnswer = useCallback(
    async (rating: -1 | 1, reason?: string) => {
      if (state.kind !== 'done') return;
      try {
        const token = await getAccessToken();
        if (!token) return;
        trackBrihaspatiAnswerRated({
          rating,
          category: 'unknown',
          model: 'unknown',
          hasReason: !!reason && reason.length > 0,
        });
        await fetch('/api/brihaspati/rating', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ questionId: state.questionId, rating, reason }),
        });
      } catch (err) {
        console.error('[brihaspati] rating failed:', err);
      }
    },
    [state, getAccessToken],
  );

  const value = useMemo<BrihaspatiContextValue>(
    () => ({
      state,
      currency,
      balance,
      loading,
      savedCharts,
      subjectChartId,
      setSubjectChartId,
      open,
      close,
      setQuestion,
      setCurrency,
      selectTier,
      startQuestion,
      rateAnswer,
      refreshBalance,
    }),
    [state, currency, balance, loading, savedCharts, subjectChartId, open, close, setQuestion, setCurrency, selectTier, startQuestion, rateAnswer, refreshBalance],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
