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

interface BrihaspatiContextValue {
  state: PanelState;
  currency: Currency;
  balance: BrihaspatiBalance | null;
  loading: boolean;
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
  const _entryRef = useRef<PanelEntry | null>(null);

  const open = useCallback((entry: PanelEntry = 'button', prefilled?: string) => {
    _entryRef.current = entry;
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
        const res = await fetch('/api/brihaspati/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ question, locale: navigator.language?.slice(0, 2) || 'en', tier, currency }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({ error: 'order failed' }));
          setState({ kind: 'error', message: typeof j.error === 'string' ? j.error : 'Order failed' });
          return;
        }
        const order = await res.json();
        // Hand the order off to the component that actually opens the
        // Razorpay / Stripe widget. State stays at 'paying' until the
        // widget reports success or cancellation.
        setState({ kind: 'paying', question, tier, questionId: order.questionId });
        // Custom event bridge so components can react to "open payment widget".
        window.dispatchEvent(new CustomEvent('brihaspati:open-payment', { detail: order }));
      } catch (err) {
        console.error('[brihaspati] order failed:', err);
        setState({ kind: 'error', message: 'Order failed' });
      } finally {
        setLoading(false);
      }
    },
    [state, currency, getAccessToken],
  );

  /**
   * Called by the payment widget after success (or directly when the
   * user has balance/subscription). Opens the SSE stream and updates
   * state token-by-token until done.
   */
  const startQuestion = useCallback(async () => {
    if (state.kind !== 'paying' && state.kind !== 'composing') return;
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
      void refreshBalance();
    } catch (err) {
      console.error('[brihaspati] stream failed:', err);
      setState({ kind: 'error', message: 'Stream failed' });
    } finally {
      setLoading(false);
    }
  }, [state, currency, getAccessToken, refreshBalance]);

  const rateAnswer = useCallback(
    async (rating: -1 | 1, reason?: string) => {
      if (state.kind !== 'done') return;
      try {
        const token = await getAccessToken();
        if (!token) return;
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
      open,
      close,
      setQuestion,
      setCurrency,
      selectTier,
      startQuestion,
      rateAnswer,
      refreshBalance,
    }),
    [state, currency, balance, loading, open, close, setQuestion, setCurrency, selectTier, startQuestion, rateAnswer, refreshBalance],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
