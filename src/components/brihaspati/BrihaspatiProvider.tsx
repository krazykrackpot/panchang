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
import { BRIHASPATI_OPEN_EVENT, type BrihaspatiOpenEvent } from './events';

export type Currency = 'INR' | 'USD';

export type PanelEntry = 'button' | 'banner' | 'kundali_tab' | 'oauth_return' | 'chart_add_return';

export type PanelState =
  | { kind: 'closed' }
  | { kind: 'idle' }                                  // open, awaiting question
  | { kind: 'composing'; question: string }            // user typing
  | { kind: 'tier_select'; question: string }          // pick tier
  | { kind: 'paying'; question: string; tier: BrihaspatiPricingTier; questionId: string }
  | { kind: 'streaming'; questionId: string; answer: string; question?: string }
  | { kind: 'done'; questionId: string; answer: string; validation: 'passed' | 'failed' | 'logged'; question?: string }
  // Server returned NO_RELATIVE_CHART — user asked about a relative
  // (daughter / wife / etc.) but no chart for them is registered. The
  // panel prompts the user to either save the chart, or proceed with a
  // parent-Bhava-proxy reading from their own chart's Nth house.
  | {
      kind: 'needs_relative_chart';
      question: string;
      tier: BrihaspatiPricingTier;
      relative: string;
      term: string;
      bhava: number;
      bhavaLabel: { en: string; hi: string };
    }
  // Server returned DUPLICATE_DETECTED — the question text is very
  // similar to one this user submitted in the last 30 min. We pause
  // before charging again so the user can either open the existing
  // answer or explicitly confirm they want a new (paid) attempt. Added
  // after the 2026-05-25 Madhavi incident.
  | {
      kind: 'confirming_duplicate';
      question: string;
      tier: BrihaspatiPricingTier;
      duplicates: Array<{
        questionId: string;
        similarity: number;
        minutesAgo: number;
        status: string;
      }>;
    }
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
  selectTier(tier: BrihaspatiPricingTier, opts?: { useParentBhavaProxy?: boolean; confirmDuplicate?: boolean }): Promise<void>;
  startQuestion(): Promise<void>;
  rateAnswer(rating: -1 | 1, reason?: string): Promise<void>;
  refreshBalance(): Promise<void>;
  /** Re-exposed for authenticated client calls that aren't part of the
   *  main state machine (e.g. the Brihaspati share-image download). */
  getAccessToken: () => Promise<string | null>;
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

  // Persist the active questionId so a navigate-away / refresh / full
  // reload can resume the answer without re-charging. The /api/brihaspati
  // route is idempotent: if status='completed' and answer exists, it
  // replays the cached body. The resume-on-mount effect below picks up
  // this key and runs the same fetch.
  //
  // Previously the key was only set by the Stripe-Checkout return page,
  // so nav-away during streaming lost the answer the user just paid for
  // (credit consumed, narration completed server-side, no way to deliver).
  //
  // Only WRITE the key here; let the resume-on-mount effect clear it
  // after consuming. Clearing on every 'closed' / 'idle' transition
  // would wipe a key written by a previous tab/session before the
  // resume effect (which runs in declaration order AFTER this one) gets
  // to read it.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (state.kind === 'streaming' || state.kind === 'paying') {
      const qid = state.questionId;
      if (qid) window.sessionStorage.setItem('dp-brihaspati-resume', qid);
    } else if (state.kind === 'done' || state.kind === 'error') {
      // Answer delivered (done) or hard-failed (error) — no point in
      // auto-resuming on the next mount.
      window.sessionStorage.removeItem('dp-brihaspati-resume');
    }
    // Do NOT touch the key for 'closed' / 'idle' / 'composing' / etc.
    // Those happen on first mount (closed) or while the user is
    // composing a new question — in both cases an unread resume key
    // from a prior session should be honoured.
  }, [state]);

  // Restore pending question from OAuth roundtrip (sessionStorage).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pending = window.sessionStorage.getItem(STORAGE_PENDING);
    if (pending) {
      window.sessionStorage.removeItem(STORAGE_PENDING);
      open('oauth_return', pending);
      return;
    }
    // Restore the question stashed when the user navigated to /kundali
    // to add a missing relative's chart. We pop it back into the panel
    // so they don't have to retype, but DON'T fire the order yet — the
    // user has to re-confirm tier (and pay) on re-submit. Free path
    // (no LLM, no charge) is preserved.
    const fromChartAdd = window.sessionStorage.getItem('dp-brihaspati-pending-question');
    if (fromChartAdd) {
      window.sessionStorage.removeItem('dp-brihaspati-pending-question');
      open('chart_add_return', fromChartAdd);
    }
  }, [open]);

  // Window-event bus: components that live OUTSIDE the Provider tree
  // (e.g. <BrihaspatiHomeBanner> on the locale homepage, which is a
  // sibling of ClientShell where the Provider mounts) can fire
  // BRIHASPATI_OPEN_EVENT and we'll handle it here. Decouples the
  // Provider from the layout topology. Event name + payload type live
  // in ./events.ts so both sides import the same contract.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: Event) => {
      const detail = (e as BrihaspatiOpenEvent).detail ?? {};
      open(detail.entry ?? 'banner', detail.question);
    };
    window.addEventListener(BRIHASPATI_OPEN_EVENT, handler);
    return () => window.removeEventListener(BRIHASPATI_OPEN_EVENT, handler);
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
          // Try to surface the real server error rather than the cryptic
          // 'Stream failed'. SSE error frames look like:
          //   event: error\n
          //   data: {"status":404,"message":"…"}\n\n
          let detail = `HTTP ${streamRes.status}`;
          try {
            const text = await streamRes.text();
            const dataLine = text.split('\n').find((l) => l.startsWith('data:'));
            if (dataLine) {
              const json = JSON.parse(dataLine.slice(5).trim());
              if (json && typeof json.message === 'string') detail = json.message;
            }
          } catch { /* keep the HTTP status */ }
          console.error('[brihaspati] resume stream failed:', detail);
          setState({ kind: 'error', message: detail });
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

  // P1-21 — single-flight guard against rapid tier-button clicks.
  // The disabled={loading} prop on tier buttons sets loading via
  // setState, which doesn't take effect synchronously — multiple
  // physical clicks within the same React batch can all enter the
  // handler, each creating a `brihaspati_questions` row + a Stripe
  // checkout session. Only one is paid; the rest are orphan rows that
  // also count against the 60/hr rate limit. This ref-based guard
  // short-circuits BEFORE any state update is visible to React.
  const selectTierInFlightRef = useRef(false);

  const selectTier = useCallback(
    async (tier: BrihaspatiPricingTier, opts: { useParentBhavaProxy?: boolean; confirmDuplicate?: boolean } = {}) => {
      if (
        state.kind !== 'composing' &&
        state.kind !== 'tier_select' &&
        state.kind !== 'needs_relative_chart' &&
        state.kind !== 'confirming_duplicate'
      ) return;
      if (selectTierInFlightRef.current) return;
      selectTierInFlightRef.current = true;
      const question =
        state.kind === 'composing' ? state.question
        : state.kind === 'tier_select' ? state.question
        : state.question;
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
            useParentBhavaProxy: opts.useParentBhavaProxy === true,
            // Only set when the user explicitly chose "Pay for new
            // question" on the near-duplicate modal — server enforces.
            confirmDuplicate: opts.confirmDuplicate === true,
          }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({ error: 'order failed' }));
          // 422 NO_RELATIVE_CHART → user mentioned a relative we don't
          // have. Surface the picker UI instead of a dead-end error.
          if (res.status === 422 && j.error === 'NO_RELATIVE_CHART') {
            setState({
              kind: 'needs_relative_chart',
              question,
              tier,
              relative: String(j.relative ?? ''),
              term: String(j.term ?? ''),
              bhava: Number(j.bhava ?? 1),
              bhavaLabel: (j.bhavaLabel as { en: string; hi: string }) ?? { en: '', hi: '' },
            });
            return;
          }
          // 409 DUPLICATE_DETECTED → recent near-duplicate exists.
          // Show the confirmation modal; user can open the previous
          // answer or explicitly pay for a new one.
          if (res.status === 409 && j.error === 'DUPLICATE_DETECTED' && Array.isArray(j.duplicates)) {
            // Typed shape mirrors the server's DuplicateMatch — we trust
            // the wire-format here but coerce defensively at the boundary
            // (String/Number) so a malformed payload can't crash the panel.
            type DupWire = {
              questionId?: unknown;
              similarity?: unknown;
              minutesAgo?: unknown;
              status?: unknown;
            };
            setState({
              kind: 'confirming_duplicate',
              question,
              tier,
              duplicates: (j.duplicates as DupWire[]).map((d) => ({
                questionId: String(d.questionId ?? ''),
                similarity: Number(d.similarity ?? 0),
                minutesAgo: Number(d.minutesAgo ?? 0),
                status: String(d.status ?? ''),
              })),
            });
            return;
          }
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
        // Release the single-flight ref so the user can retry after an error.
        selectTierInFlightRef.current = false;
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
          // Same NO_RELATIVE_CHART guard as the paying flow: surface the
          // picker UI rather than dead-ending in an error.
          if (orderRes.status === 422) {
            const j = await orderRes.json().catch(() => ({}));
            if (j.error === 'NO_RELATIVE_CHART') {
              setState({
                kind: 'needs_relative_chart',
                question: state.question,
                tier: 'single',
                relative: String(j.relative ?? ''),
                term: String(j.term ?? ''),
                bhava: Number(j.bhava ?? 1),
                bhavaLabel: (j.bhavaLabel as { en: string; hi: string }) ?? { en: '', hi: '' },
              });
              return;
            }
          }
          setState({ kind: 'error', message: 'Could not initiate question' });
          return;
        }
        const order = await orderRes.json();
        qid = order.questionId;
        body = { questionId: qid };
      }

      // Capture the question text so the done state can pass it to the
      // share component (resume-from-Stripe path will still have it
      // undefined, which the share component handles).
      const startQuestionText =
        state.kind === 'paying' ? state.question
        : state.kind === 'composing' ? state.question
        : undefined;
      setState({ kind: 'streaming', questionId: qid, answer: '', question: startQuestionText });

      const postRes = await fetch('/api/brihaspati', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(body),
      });
      if (!postRes.ok || !postRes.body) {
        let detail = `HTTP ${postRes.status}`;
        let status = postRes.status;
        try {
          const text = await postRes.text();
          const dataLine = text.split('\n').find((l) => l.startsWith('data:'));
          if (dataLine) {
            const json = JSON.parse(dataLine.slice(5).trim());
            if (json && typeof json.message === 'string') detail = json.message;
            if (json && typeof json.status === 'number') status = json.status;
          }
        } catch { /* keep the HTTP status */ }
        console.error('[brihaspati] startQuestion stream failed:', detail, 'status:', status);
        // Recovery path: if the server said "no balance / payment
        // required" (402), don't dead-end at an error screen — drop
        // back into tier_select so the seeker can buy more credits.
        // The question text is preserved across the transition.
        const isPaymentRequired = status === 402 ||
          /payment required|no balance|out of credit/i.test(detail);
        const originalQuestion = state.kind === 'paying' ? state.question
          : state.kind === 'composing' ? state.question
          : '';
        if (isPaymentRequired && originalQuestion) {
          // Force balance refresh so the panel renders the correct tier
          // buttons instead of the stale "free with your plan" CTA.
          void refreshBalance();
          setState({ kind: 'tier_select', question: originalQuestion });
          return;
        }
        setState({ kind: 'error', message: detail });
        return;
      }

      // ── Fix 3: POST may return JSON { status: 'awaiting_payment' } ────────
      // This happens when Stripe webhook hasn't arrived yet (browser
      // outran delivery). In that case:
      //   1. Open GET /api/brihaspati/wait?questionId=... to poll payment.
      //   2. When 'payment_verified' event arrives, open
      //      GET /api/brihaspati/stream?questionId=... for the LLM stream.
      // Both routes accept Authorization: Bearer (same as POST).
      const contentType = postRes.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        let postJson: { status?: string } = {};
        try { postJson = await postRes.json(); } catch { /* ignore */ }
        if (postJson.status === 'awaiting_payment') {
          // ── Wait phase ────────────────────────────────────────────────
          const waitRes = await fetch(
            `/api/brihaspati/wait?questionId=${encodeURIComponent(qid)}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (!waitRes.ok || !waitRes.body) {
            console.error('[brihaspati] wait fetch failed:', waitRes.status);
            setState({ kind: 'error', message: 'Payment confirmation failed — please try again' });
            return;
          }
          // Read wait SSE until payment_verified or error.
          const waitReader = waitRes.body.getReader();
          const waitDecoder = new TextDecoder();
          let waitBuf = '';
          let paymentConfirmed = false;
          // eslint-disable-next-line no-constant-condition
          outer: while (true) {
            const { value, done } = await waitReader.read();
            if (done) break;
            waitBuf += waitDecoder.decode(value, { stream: true });
            const lines = waitBuf.split('\n');
            waitBuf = lines.pop() ?? '';
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              try {
                const evt = JSON.parse(line.slice(6));
                if (evt.type === 'payment_verified') {
                  paymentConfirmed = true;
                  break outer;
                } else if (evt.type === 'error') {
                  console.error('[brihaspati] wait error:', evt.message);
                  setState({ kind: 'error', message: String(evt.message ?? 'Payment error') });
                  return;
                }
                // 'payment_pending' events: keep waiting.
              } catch (err) {
                console.error('[brihaspati] wait sse parse failed:', err);
              }
            }
          }
          if (!paymentConfirmed) {
            setState({ kind: 'error', message: 'Payment not confirmed — please refresh in a moment' });
            return;
          }

          // ── Stream phase ──────────────────────────────────────────────
          const streamRes2 = await fetch(
            `/api/brihaspati/stream?questionId=${encodeURIComponent(qid)}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (!streamRes2.ok || !streamRes2.body) {
            console.error('[brihaspati] stream (wait path) failed:', streamRes2.status);
            setState({ kind: 'error', message: `Stream failed: HTTP ${streamRes2.status}` });
            return;
          }
          // Fall through to the SSE reader below using streamRes2.body.
          // Reassign so the shared reader block works for both paths.
          const streamBody = streamRes2.body;
          const reader2 = streamBody.getReader();
          const decoder2 = new TextDecoder();
          let buf2 = '';
          let answer2 = '';
          let validation2: 'passed' | 'failed' | 'logged' = 'logged';
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { value, done } = await reader2.read();
            if (done) break;
            buf2 += decoder2.decode(value, { stream: true });
            const lines = buf2.split('\n');
            buf2 = lines.pop() ?? '';
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              try {
                const payload = JSON.parse(line.slice(6));
                if (payload.type === 'token' && typeof payload.text === 'string') {
                  answer2 += payload.text;
                  setState({ kind: 'streaming', questionId: qid, answer: answer2, question: startQuestionText });
                } else if (payload.type === 'done') {
                  validation2 = payload.validation ?? 'logged';
                } else if (payload.type === 'error') {
                  setState({ kind: 'error', message: String(payload.message) });
                  return;
                }
              } catch (err) {
                console.error('[brihaspati] stream2 sse parse failed:', err);
              }
            }
          }
          setState({ kind: 'done', questionId: qid, answer: answer2, validation: validation2, question: startQuestionText });
          const validationPassed2 =
            validation2 === 'passed' ? true : validation2 === 'failed' ? false : null;
          trackBrihaspatiAnswerStreamed({
            category: 'unknown',
            model: 'unknown',
            validationPassed: validationPassed2,
            outputTokens: Math.round(answer2.length / 4),
            latencyMs: Date.now() - startedAt,
          });
          void refreshBalance();
          return;
        }
      }

      // ── Standard SSE path (credit/subscription/already-verified) ──────────
      const streamRes = postRes;
      const reader = streamRes.body!.getReader();
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
              setState({ kind: 'streaming', questionId: qid, answer, question: startQuestionText });
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

      setState({ kind: 'done', questionId: qid, answer, validation, question: startQuestionText });
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
      getAccessToken,
    }),
    [state, currency, balance, loading, savedCharts, subjectChartId, open, close, setQuestion, setCurrency, selectTier, startQuestion, rateAnswer, refreshBalance, getAccessToken],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
