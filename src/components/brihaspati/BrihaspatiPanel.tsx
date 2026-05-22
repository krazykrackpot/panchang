'use client';

/**
 * Brihaspati Panel — drawer on desktop, bottom-sheet on mobile.
 *
 * State machine is owned by BrihaspatiProvider; this component is a
 * pure visual reflection of `state.kind`.
 */
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { useBrihaspati } from './BrihaspatiProvider';
import { BrihaspatiAvatar } from './BrihaspatiAvatar';
import { BrihaspatiPreparing } from './BrihaspatiPreparing';
import { BrihaspatiShare } from './BrihaspatiShare';
import { BRIHASPATI_PRICING_TIERS, type BrihaspatiPricingTier } from '@/lib/brihaspati/types';

const INR_DISPLAY: Record<BrihaspatiPricingTier, string> = {
  single: '₹99',
  pack_5: '₹199',
  monthly: '₹999',
  annual: '₹11,000',
};
const USD_DISPLAY: Record<BrihaspatiPricingTier, string> = {
  single: '$0.99',
  pack_5: '$2.99',
  monthly: '$12.99',
  annual: '$129.99',
};

const TIER_LABEL_KEY: Record<BrihaspatiPricingTier, string> = {
  single:  'panel.tierSingle',
  pack_5:  'panel.tierPack5',
  monthly: 'panel.tierMonthly',
  annual:  'panel.tierAnnual',
};

export function BrihaspatiPanel() {
  const t = useTranslations('brihaspati');
  const {
    state, currency, balance, loading,
    savedCharts, subjectChartId, setSubjectChartId,
    close, setQuestion, setCurrency, selectTier, startQuestion, rateAnswer,
    getAccessToken,
  } = useBrihaspati();
  const [reasonOpen, setReasonOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [rated, setRated] = useState<null | 1 | -1>(null);
  // Reset rating state when a new question starts (state.kind moves out
  // of 'done'). Tracked separately from rateAnswer so we know to show
  // the confirmation without re-querying the DB.
  useEffect(() => {
    if (state.kind !== 'done') {
      setRated(null);
      setReasonOpen(false);
      setReason('');
    }
  }, [state.kind]);

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
        aria-label={t('panel.closeLabel')}
        onClick={close}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-label={t('button.ariaLabel')}
        className="
          fixed z-50
          bottom-0 inset-x-0 max-h-[90vh]
          sm:bottom-auto sm:right-4 sm:top-4 sm:max-h-[calc(100vh-2rem)]
          sm:w-[520px] sm:max-w-[calc(100vw-2rem)]
          sm:rounded-2xl
          rounded-t-2xl
          bg-gradient-to-br from-[#2d1b69]/95 via-[#1a1040]/95 to-[#0a0e27]
          border border-gold-primary/30
          shadow-2xl shadow-black/50
          flex flex-col
          text-text-primary
        "
      >
        {/* Header — sage avatar + prominent name */}
        <header className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gold-primary/15">
          <div className="flex items-center gap-4">
            <div className="
              h-16 w-16 rounded-full overflow-hidden
              bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b]
              border-2 border-gold-primary/40
              flex items-center justify-center
              shadow-md shadow-gold-primary/30
              shrink-0
            ">
              <BrihaspatiAvatar size={62} />
            </div>
            <div className="min-w-0">
              <h2 className="text-gold-light font-serif text-2xl leading-tight tracking-wide">
                {t('panel.title')}
              </h2>
              <p className="text-text-secondary text-[10px] uppercase tracking-[0.18em] mt-0.5">
                बृहस्पति · Vedic Sage
              </p>
              <p className="text-text-secondary text-xs mt-1.5">
                {balance && balance.subscription === 'annual'
                  ? t('panel.annualSubscriber')
                  : balance && balance.subscription === 'monthly'
                  ? t('panel.monthlySubscriber')
                  : balance && balance.credits > 0
                  ? t(balance.credits === 1 ? 'panel.creditAvailableOne' : 'panel.creditAvailableOther', { count: balance.credits })
                  : t('panel.fromPrice', { price: priceDisplay.single })}
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
              aria-label={t('panel.closeLabel')}
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
              savedCharts={savedCharts}
              subjectChartId={subjectChartId}
              onSubjectChange={setSubjectChartId}
            />
          )}

          {state.kind === 'paying' && (
            <p className="text-center text-text-secondary py-12">
              {t('panel.awaitingPayment')}
            </p>
          )}

          {state.kind === 'streaming' && state.answer.length === 0 && (
            <BrihaspatiPreparing />
          )}
          {state.kind === 'streaming' && state.answer.length > 0 && (
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
                  {t('panel.validationWarning')}
                </p>
              )}
              {/* Share row — copy / email / WhatsApp / X / native share +
                  Instagram image-card download. question is optional
                  (Stripe-resume path drops it). */}
              <BrihaspatiShare
                answer={state.answer}
                question={state.question}
                questionId={state.questionId}
                getAccessToken={getAccessToken}
                locale={typeof navigator !== 'undefined' ? (navigator.language?.slice(0, 2) ?? 'en') : 'en'}
              />
              <div className="flex items-center gap-2 pt-2 border-t border-gold-primary/15">
                <span className="text-text-secondary text-xs">{t('panel.helpfulLabel')}</span>
                {rated === null && (
                  <>
                    <button
                      type="button"
                      onClick={async () => {
                        setRated(1);
                        await rateAnswer(1);
                      }}
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
                  </>
                )}
                {rated === 1 && (
                  <span className="text-gold-light text-xs">
                    {t.has('panel.feedbackThanks') ? t('panel.feedbackThanks') : 'Thanks — feedback saved'} ✓
                  </span>
                )}
                {rated === -1 && !reasonOpen && (
                  <span className="text-gold-light text-xs">
                    {t.has('panel.feedbackThanks') ? t('panel.feedbackThanks') : 'Thanks — feedback saved'} ✓
                  </span>
                )}
              </div>
              {reasonOpen && rated === null && (
                <div className="space-y-2">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t('panel.reasonPlaceholder')}
                    className="w-full rounded-md bg-black/40 border border-gold-primary/20 px-3 py-2 text-sm"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      setRated(-1);
                      await rateAnswer(-1, reason);
                      setReasonOpen(false);
                    }}
                    className="px-3 py-1 rounded-md bg-gold-primary/20 text-gold-light text-sm"
                  >
                    {t('panel.sendFeedback')}
                  </button>
                </div>
              )}
            </div>
          )}

          {state.kind === 'needs_relative_chart' && (() => {
            // Bhava ordinal suffix — 1st, 2nd, 3rd, 4th-9th, 12th, etc.
            const n = state.bhava;
            const ord =
              n === 1 ? 'st' :
              n === 2 ? 'nd' :
              n === 3 ? 'rd' : 'th';

            // Price-tag the proxy button so the user knows they're paying
            // now if they pick this option. The "Add chart" branch is
            // explicitly free — no order is created until they return
            // here with the saved chart in hand.
            const proxyPrice = currency === 'INR'
              ? INR_DISPLAY[state.tier]
              : USD_DISPLAY[state.tier];

            return (
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 space-y-3">
                  <h3 className="text-amber-200 font-semibold text-sm">
                    We don&apos;t have your {state.relative}&apos;s chart on file.
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    You asked about your <span className="text-amber-200 font-medium">{state.relative}</span>, but no
                    birth chart for them is registered. Two options:
                  </p>
                  <ul className="text-text-secondary text-xs space-y-2 list-disc list-inside">
                    <li>
                      <span className="text-gold-light font-medium">Recommended &middot; Free:</span> Add their
                      birth details first so Brihaspati reads from their actual chart on your next question. <span className="text-text-secondary/70">No payment now.</span>
                    </li>
                    <li>
                      <span className="text-gold-light font-medium">Continue now &middot; {proxyPrice}:</span> Read from your own
                      chart&apos;s <span className="text-gold-light">{state.bhavaLabel.en}</span> — the classical Bhava that
                      describes this relative. Partial reading, not a full one.
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    href="/kundali"
                    onClick={() => {
                      // Stash the pending question so the panel can offer
                      // to re-open with it after the user returns. The
                      // resume key is the same one used by the OAuth
                      // round-trip.
                      if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem('dp-brihaspati-pending-question', state.question);
                      }
                      close();
                    }}
                    className="text-center py-2.5 rounded-md bg-gradient-to-r from-[#d4a853] to-[#8a6d2b] text-bg-primary font-semibold text-sm hover:from-[#f0d48a] hover:to-[#d4a853] transition-all"
                  >
                    + Add their chart (free)
                  </Link>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => selectTier(state.tier, { useParentBhavaProxy: true })}
                    className="py-2.5 rounded-md border border-gold-primary/40 text-gold-light text-sm font-semibold hover:bg-gold-primary/10 transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? 'Continuing…'
                      : `Continue from my ${n}${ord} house — pay ${proxyPrice}`}
                  </button>
                </div>
              </div>
            );
          })()}

          {state.kind === 'error' && (
            <div className="space-y-3">
              <p className="text-red-300/90 text-sm">
                {state.message === 'sign-in-required'
                  ? t('panel.errorSignIn')
                  : t('panel.errorGeneric', { message: state.message })}
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
                {loading
                  ? t('panel.asking')
                  : balance?.subscription && balance.subscription !== 'none'
                    ? (t.has('panel.askFreeSubscription') ? t('panel.askFreeSubscription') : t('panel.askFree'))
                    : (balance?.credits ?? 0) > 0
                      ? (t.has('panel.askUseCredit')
                        ? t('panel.askUseCredit', { count: balance!.credits })
                        : t('panel.askFree'))
                      : t('panel.askFree')}
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
                    <span className="text-text-secondary text-[10px]">{t(TIER_LABEL_KEY[tier] as never)}</span>
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

interface ComposeBodyProps {
  question: string;
  onChange: (q: string) => void;
  savedCharts: { id: string; label: string; is_primary: boolean; has_birth_data: boolean }[];
  subjectChartId: string | null;
  onSubjectChange: (id: string | null) => void;
}

function ComposeBody({ question, onChange, savedCharts, subjectChartId, onSubjectChange }: ComposeBodyProps) {
  const t = useTranslations('brihaspati');
  // Show the picker only when the user has at least one family chart
  // (anything beyond the primary self chart). Otherwise the picker is
  // pure noise — same as no picker at all.
  const familyCharts = savedCharts.filter((c) => c.has_birth_data && !c.is_primary);
  const showPicker = familyCharts.length > 0;
  const selectedLabel = subjectChartId
    ? familyCharts.find((c) => c.id === subjectChartId)?.label ?? null
    : null;

  return (
    <div className="space-y-3">
      {showPicker && (
        <div className="space-y-1.5">
          <label className="text-text-secondary text-[10px] uppercase tracking-[0.15em]">
            {t.has('panel.aboutLabel') ? t('panel.aboutLabel') : 'About'}
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onSubjectChange(null)}
              className={`
                px-2.5 py-1 rounded-md text-xs border transition-colors
                ${subjectChartId === null
                  ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light'
                  : 'border-gold-primary/15 text-text-secondary hover:border-gold-primary/30'}
              `}
            >
              {t.has('panel.subjectMe') ? t('panel.subjectMe') : 'Me'}
            </button>
            {familyCharts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSubjectChange(c.id)}
                className={`
                  px-2.5 py-1 rounded-md text-xs border transition-colors
                  ${subjectChartId === c.id
                    ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light'
                    : 'border-gold-primary/15 text-text-secondary hover:border-gold-primary/30'}
                `}
              >
                {c.label}
              </button>
            ))}
          </div>
          {selectedLabel && (
            <p className="text-text-secondary text-[10px] italic">
              {t.has('panel.subjectHint')
                ? t('panel.subjectHint', { name: selectedLabel })
                : `Asking about ${selectedLabel}'s chart`}
            </p>
          )}
        </div>
      )}
      <p className="text-text-secondary text-xs">{t('panel.composeHelp')}</p>
      <textarea
        value={question}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('panel.composePlaceholder')}
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
      <p className="text-right text-text-secondary text-[10px]">{t('panel.charCount', { count: question.length })}</p>
    </div>
  );
}

function Disclaimer() {
  const t = useTranslations('brihaspati');
  return (
    <p className="text-text-secondary text-[11px] leading-relaxed border-t border-gold-primary/10 pt-3">
      {t('panel.disclaimer')} <Link href="/refunds" className="underline hover:text-gold-light">{t('panel.disclaimerRefundLink')}</Link>.
    </p>
  );
}
