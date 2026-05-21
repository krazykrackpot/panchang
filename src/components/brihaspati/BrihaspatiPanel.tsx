'use client';

/**
 * Brihaspati Panel — drawer on desktop, bottom-sheet on mobile.
 *
 * State machine is owned by BrihaspatiProvider; this component is a
 * pure visual reflection of `state.kind`.
 */
import { useEffect, useMemo, useState } from 'react';
import { useBrihaspati } from './BrihaspatiProvider';
import { BRIHASPATI_PRICING_TIERS, type BrihaspatiPricingTier } from '@/lib/brihaspati/types';

const TIER_LABEL: Record<BrihaspatiPricingTier, { en: string; hi: string }> = {
  single:  { en: '1 question',         hi: '1 प्रश्न' },
  pack_5:  { en: '5-question pack',    hi: '5-प्रश्न पैक' },
  monthly: { en: 'Monthly unlimited',  hi: 'मासिक असीमित' },
  annual:  { en: 'Annual unlimited',   hi: 'वार्षिक असीमित' },
};

const INR_DISPLAY: Record<BrihaspatiPricingTier, string> = {
  single: '₹49',
  pack_5: '₹199',
  monthly: '₹299',
  annual: '₹1,999',
};
const USD_DISPLAY: Record<BrihaspatiPricingTier, string> = {
  single: '$0.99',
  pack_5: '$2.99',
  monthly: '$3.99',
  annual: '$24.99',
};

export function BrihaspatiPanel() {
  const { state, currency, balance, loading, close, setQuestion, setCurrency, selectTier, startQuestion, rateAnswer } = useBrihaspati();
  const [reasonOpen, setReasonOpen] = useState(false);
  const [reason, setReason] = useState('');

  const isOpen = state.kind !== 'closed';

  // Lock body scroll when open (mobile sheet UX).
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const priceDisplay = currency === 'INR' ? INR_DISPLAY : USD_DISPLAY;

  const hasBalance = (balance?.credits ?? 0) > 0 || (balance?.subscription ?? 'none') !== 'none';

  const questionText = useMemo(() => {
    if (state.kind === 'composing') return state.question;
    if (state.kind === 'tier_select') return state.question;
    if (state.kind === 'paying') return state.question;
    return '';
  }, [state]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-label="Ask Brihaspati"
        className="
          fixed z-50
          bottom-0 inset-x-0 max-h-[85vh]
          sm:bottom-auto sm:right-4 sm:top-4 sm:max-h-[calc(100vh-2rem)] sm:w-[420px] sm:rounded-2xl
          rounded-t-2xl
          bg-gradient-to-br from-[#2d1b69]/95 via-[#1a1040]/95 to-[#0a0e27]
          border border-gold-primary/30
          shadow-2xl shadow-black/50
          flex flex-col
          text-text-primary
        "
      >
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gold-primary/15">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f0d48a] to-[#8a6d2b] flex items-center justify-center text-bg-primary text-base font-bold">
              बृ
            </div>
            <div>
              <h2 className="text-gold-light text-base font-semibold leading-tight">Brihaspati</h2>
              <p className="text-text-secondary text-xs">
                {balance && balance.subscription === 'annual'
                  ? 'Annual subscriber — free questions'
                  : balance && balance.subscription === 'monthly'
                  ? 'Monthly subscriber — free questions'
                  : balance && balance.credits > 0
                  ? `${balance.credits} credit${balance.credits === 1 ? '' : 's'} available`
                  : `From ${priceDisplay.single}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!hasBalance && (
              <div className="flex rounded-md border border-gold-primary/20 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-2 py-1 ${currency === 'INR' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary'}`}
                >
                  ₹
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-1 ${currency === 'USD' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary'}`}
                >
                  $
                </button>
              </div>
            )}
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {(state.kind === 'idle' || state.kind === 'composing' || state.kind === 'tier_select') && (
            <ComposeBody
              question={questionText}
              onChange={setQuestion}
            />
          )}

          {state.kind === 'paying' && (
            <p className="text-center text-text-secondary py-12">
              Awaiting payment confirmation…
            </p>
          )}

          {state.kind === 'streaming' && (
            <div className="prose-pandit">
              <p className="whitespace-pre-wrap">{state.answer}<span className="inline-block w-2 h-4 bg-gold-light animate-pulse ml-1 align-middle" /></p>
            </div>
          )}

          {state.kind === 'done' && (
            <div className="space-y-4">
              <div className="prose-pandit">
                <p className="whitespace-pre-wrap text-text-primary leading-relaxed">{state.answer}</p>
              </div>
              <Disclaimer />
              {state.validation === 'failed' && (
                <p className="text-amber-300/80 text-xs italic">
                  Some parts of this reading didn&apos;t fully match your chart — Brihaspati is improving.
                </p>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-gold-primary/15">
                <span className="text-text-secondary text-xs">Helpful?</span>
                <button
                  type="button"
                  onClick={() => rateAnswer(1)}
                  className="px-3 py-1 rounded-md border border-gold-primary/20 hover:border-gold-primary/50 text-sm"
                >
                  👍
                </button>
                <button
                  type="button"
                  onClick={() => setReasonOpen(true)}
                  className="px-3 py-1 rounded-md border border-gold-primary/20 hover:border-gold-primary/50 text-sm"
                >
                  👎
                </button>
              </div>
              {reasonOpen && (
                <div className="space-y-2">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="What was wrong? (optional)"
                    className="w-full rounded-md bg-black/40 border border-gold-primary/20 px-3 py-2 text-sm"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      await rateAnswer(-1, reason);
                      setReasonOpen(false);
                    }}
                    className="px-3 py-1 rounded-md bg-gold-primary/20 text-gold-light text-sm"
                  >
                    Send feedback
                  </button>
                </div>
              )}
            </div>
          )}

          {state.kind === 'error' && (
            <div className="space-y-3">
              <p className="text-red-300/90 text-sm">
                {state.message === 'sign-in-required'
                  ? 'Please sign in to continue. Your question is saved.'
                  : `Something went wrong: ${state.message}`}
              </p>
            </div>
          )}
        </div>

        {/* Footer (only meaningful before payment) */}
        {(state.kind === 'idle' || state.kind === 'composing' || state.kind === 'tier_select') && (
          <footer className="border-t border-gold-primary/15 px-5 py-3 space-y-2">
            {hasBalance ? (
              <button
                type="button"
                disabled={!questionText.trim() || loading}
                onClick={startQuestion}
                className="w-full py-2.5 rounded-md bg-gradient-to-r from-[#d4a853] to-[#8a6d2b] text-bg-primary font-semibold disabled:opacity-50"
              >
                {loading ? 'Asking…' : 'Ask Brihaspati (free with your plan)'}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {BRIHASPATI_PRICING_TIERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    disabled={!questionText.trim() || loading}
                    onClick={() => selectTier(tier)}
                    className="
                      flex flex-col items-center gap-1
                      py-2 rounded-md border border-gold-primary/20
                      hover:border-gold-primary/50
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    <span className="text-gold-light text-sm font-semibold">{priceDisplay[tier]}</span>
                    <span className="text-text-secondary text-[10px]">{TIER_LABEL[tier].en}</span>
                  </button>
                ))}
              </div>
            )}
          </footer>
        )}
      </aside>
    </>
  );
}

function ComposeBody({ question, onChange }: { question: string; onChange: (q: string) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-text-secondary text-xs">Ask anything about your life, career, relationships, health, or timing — Brihaspati reads your chart.</p>
      <textarea
        value={question}
        onChange={(e) => onChange(e.target.value)}
        placeholder="When will I get married? / What does my career chart say? / Should I buy property this year?"
        className="
          w-full rounded-md
          bg-black/40 border border-gold-primary/20
          px-3 py-2 text-sm text-text-primary
          placeholder:text-text-secondary/60
          focus:outline-none focus:border-gold-primary/50
        "
        rows={4}
        maxLength={500}
      />
      <p className="text-right text-text-secondary text-[10px]">{question.length}/500</p>
    </div>
  );
}

function Disclaimer() {
  return (
    <p className="text-text-secondary text-[11px] leading-relaxed border-t border-gold-primary/10 pt-3">
      Brihaspati&apos;s guidance is based on classical Jyotish principles computed from Swiss Ephemeris (NASA JPL DE441). This is for guidance only — for important life decisions, also consult a qualified Jyotishi. <a href="/refunds" className="underline hover:text-gold-light">Refund policy</a>.
    </p>
  );
}
