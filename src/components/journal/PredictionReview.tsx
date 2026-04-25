'use client';

/**
 * PredictionReview — shows a single prediction card with rating controls.
 * Used in the pending-predictions queue on the predictions dashboard.
 */

import { useState } from 'react';
import { CheckCircle2, XCircle, MinusCircle, Loader2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import type { PredictionEntry } from '@/types/journal';
import type { PredictionRateInput } from '@/stores/predictions-store';

const DOMAIN_LABELS: Record<string, Record<string, string>> = {
  career:       { en: 'Career',      hi: 'करियर',         ta: 'தொழில்',        bn: 'ক্যারিয়ার' },
  health:       { en: 'Health',      hi: 'स्वास्थ्य',    ta: 'சுகாதாரம்',     bn: 'স্বাস্থ্য' },
  relationship: { en: 'Relationship',hi: 'सम्बंध',        ta: 'உறவு',           bn: 'সম্পর্ক' },
  financial:    { en: 'Financial',   hi: 'आर्थिक',        ta: 'நிதி',           bn: 'আর்থিக' },
  spiritual:    { en: 'Spiritual',   hi: 'आध्यात्मिक',   ta: 'ஆன்மீக',        bn: 'আধ্যাত্মিক' },
  family:       { en: 'Family',      hi: 'परिवार',         ta: 'குடும்பம்',     bn: 'পরিবার' },
  education:    { en: 'Education',   hi: 'शिक्षा',         ta: 'கல்வி',          bn: 'শিক্ষা' },
  travel:       { en: 'Travel',      hi: 'यात्रा',         ta: 'பயணம்',          bn: 'ভ্রমণ' },
  general:      { en: 'General',     hi: 'सामान्य',        ta: 'பொதுவான',       bn: 'সাধারণ' },
};

const LABELS = {
  en: {
    pending: 'Pending',
    correct: 'Correct',
    partiallyCorrect: 'Partial',
    incorrect: 'Incorrect',
    rateIt: 'Rate this prediction',
    notePlaceholder: 'What actually happened? (optional)',
    submit: 'Submit rating',
    submitting: 'Saving…',
    domain: 'Domain',
    source: 'Source',
    predictedFor: 'For',
    dasha: 'Dasha',
    deleteConfirm: 'Delete this prediction?',
    yes: 'Delete',
    cancel: 'Cancel',
    details: 'Details',
    recorded: 'Recorded',
  },
  hi: {
    pending: 'लंबित',
    correct: 'सही',
    partiallyCorrect: 'आंशिक',
    incorrect: 'गलत',
    rateIt: 'इस भविष्यवाणी को रेट करें',
    notePlaceholder: 'वास्तव में क्या हुआ? (वैकल्पिक)',
    submit: 'रेटिंग सबमिट करें',
    submitting: 'सहेजा जा रहा है…',
    domain: 'क्षेत्र',
    source: 'स्रोत',
    predictedFor: 'हेतु',
    dasha: 'दशा',
    deleteConfirm: 'यह भविष्यवाणी हटाएँ?',
    yes: 'हटाएँ',
    cancel: 'रद्द करें',
    details: 'विवरण',
    recorded: 'दर्ज किया',
  },
  ta: {
    pending: 'நிலுவை',
    correct: 'சரியானது',
    partiallyCorrect: 'பகுதியளவு',
    incorrect: 'தவறானது',
    rateIt: 'இந்த கணிப்பை மதிப்பிடு',
    notePlaceholder: 'உண்மையில் என்ன நடந்தது? (விரும்பினால்)',
    submit: 'மதிப்பீட்டை சமர்ப்பி',
    submitting: 'சேமிக்கிறது…',
    domain: 'துறை',
    source: 'ஆதாரம்',
    predictedFor: 'காலம்',
    dasha: 'தசா',
    deleteConfirm: 'இந்த கணிப்பை நீக்கவா?',
    yes: 'நீக்கு',
    cancel: 'ரத்து',
    details: 'விவரங்கள்',
    recorded: 'பதிவு',
  },
  bn: {
    pending: 'অপেক্ষমান',
    correct: 'সঠিক',
    partiallyCorrect: 'আংশিক',
    incorrect: 'ভুল',
    rateIt: 'এই ভবিষ্যদ্বাণীটি মূল্যায়ন করুন',
    notePlaceholder: 'আসলে কী হয়েছিল? (ঐচ্ছিক)',
    submit: 'রেটিং জমা দিন',
    submitting: 'সংরক্ষণ হচ্ছে…',
    domain: 'ক্ষেত্র',
    source: 'উৎস',
    predictedFor: 'সময়কাল',
    dasha: 'দশা',
    deleteConfirm: 'এই ভবিষ্যদ্বাণীটি মুছবেন?',
    yes: 'মুছুন',
    cancel: 'বাতিল',
    details: 'বিবরণ',
    recorded: 'নথিভুক্ত',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getL(locale: string): (typeof LABELS)[SupportedLocale] {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}
function getDomainLabel(domain: string | null, locale: string): string {
  if (!domain) return '';
  return DOMAIN_LABELS[domain]?.[locale] ?? DOMAIN_LABELS[domain]?.['en'] ?? domain;
}

/** Parse a Postgres daterange like "[2026-04-01,2026-04-30]" → "Apr 1 – Apr 30, 2026" */
function parseDateRange(range: string | null): string | null {
  if (!range) return null;
  const match = range.match(/\[?(\d{4}-\d{2}-\d{2}),(\d{4}-\d{2}-\d{2})\]?/);
  if (!match) return null;
  const fmt = (d: string) =>
    new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${fmt(match[1])} – ${fmt(match[2])}`;
}

const OUTCOME_CONFIG = {
  correct:           { icon: CheckCircle2,  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  partially_correct: { icon: MinusCircle,   color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20' },
  incorrect:         { icon: XCircle,       color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
  pending:           { icon: MinusCircle,   color: 'text-text-secondary', bg: 'bg-white/5 border-white/10' },
} as const;

interface Props {
  prediction: PredictionEntry;
  locale: string;
  showRatingForm?: boolean;
  onRate?: (id: string, input: PredictionRateInput) => Promise<{ error?: string }>;
  onDelete?: (id: string) => void;
}

export default function PredictionReview({
  prediction,
  locale,
  showRatingForm = false,
  onRate,
  onDelete,
}: Props) {
  const L = getL(locale);
  const [expanded, setExpanded] = useState(showRatingForm);
  const [selectedOutcome, setSelectedOutcome] = useState<PredictionRateInput['outcome'] | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isPending = prediction.outcome === 'pending' || prediction.outcome == null;
  const outcomeKey = (prediction.outcome ?? 'pending') as keyof typeof OUTCOME_CONFIG;
  const outcomeConf = OUTCOME_CONFIG[outcomeKey] ?? OUTCOME_CONFIG.pending;
  const OutcomeIcon = outcomeConf.icon;

  const createdStr = new Date(prediction.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const dateRange = parseDateRange(prediction.predicted_for);

  const handleSubmitRating = async () => {
    if (!selectedOutcome || !onRate) return;
    setError(null);
    setSubmitting(true);
    const result = await onRate(prediction.id, {
      outcome: selectedOutcome,
      outcomeNote: note.trim() || undefined,
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#1a1040]/30 to-[#0a0e27] overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Outcome icon */}
          <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${outcomeConf.bg} border`}>
            <OutcomeIcon className={`w-3.5 h-3.5 ${outcomeConf.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary leading-snug">{prediction.prediction_text}</p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {prediction.domain && (
                <span className="text-xs text-text-secondary/70">
                  {L.domain}: <span className="text-text-secondary">{getDomainLabel(prediction.domain, locale)}</span>
                </span>
              )}
              {prediction.source && (
                <span className="text-xs text-text-secondary/70">
                  {L.source}: <span className="text-text-secondary">{prediction.source}</span>
                </span>
              )}
              {dateRange && (
                <span className="text-xs text-text-secondary/70">
                  {L.predictedFor}: <span className="text-text-secondary">{dateRange}</span>
                </span>
              )}
              <span className="text-xs text-text-secondary/50">
                {L.recorded}: {createdStr}
              </span>
            </div>

            {/* Dasha at time of recording */}
            {prediction.planetary_state?.dasha && (
              <div className="mt-1.5 flex gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-gold-primary/10 border border-gold-primary/20 text-[10px] text-gold-light">
                  {L.dasha}: {prediction.planetary_state.dasha.mahaDasha}
                  {prediction.planetary_state.dasha.antarDasha !== prediction.planetary_state.dasha.mahaDasha
                    ? ` / ${prediction.planetary_state.dasha.antarDasha}`
                    : ''}
                </span>
              </div>
            )}

            {/* Resolved outcome note */}
            {!isPending && prediction.outcome_note && (
              <p className="mt-2 text-xs text-text-secondary/80 italic">{prediction.outcome_note}</p>
            )}
          </div>

          {/* Expand / delete buttons */}
          <div className="flex gap-1 shrink-0">
            {isPending && onRate && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="p-1.5 rounded-lg text-text-secondary/50 hover:text-gold-light hover:bg-gold-primary/10 transition-all"
                aria-label={L.details}
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-lg text-text-secondary/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                aria-label="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Rating form (expanded) */}
        {isPending && expanded && onRate && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
            <p className="text-xs text-text-secondary/70 font-medium">{L.rateIt}</p>

            {/* Outcome buttons */}
            <div className="flex gap-2">
              {(
                [
                  { key: 'correct',           label: L.correct,           icon: CheckCircle2, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20' },
                  { key: 'partially_correct', label: L.partiallyCorrect,  icon: MinusCircle,  color: 'text-yellow-400  border-yellow-500/30  bg-yellow-500/10  hover:bg-yellow-500/20' },
                  { key: 'incorrect',         label: L.incorrect,         icon: XCircle,      color: 'text-red-400    border-red-500/30    bg-red-500/10    hover:bg-red-500/20' },
                ] as const
              ).map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedOutcome(key)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-xs font-medium transition-all ${color} ${
                    selectedOutcome === key ? 'ring-1 ring-current opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Note */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={L.notePlaceholder}
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2 rounded-lg bg-[#111633] border border-gold-primary/20 text-text-primary text-xs placeholder:text-text-secondary/40 focus:outline-none focus:border-gold-primary/50 transition-colors resize-none"
            />

            {error && (
              <p className="text-xs text-red-400/80 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmitRating}
              disabled={!selectedOutcome || submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold text-xs hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {L.submitting}
                </>
              ) : (
                L.submit
              )}
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="px-4 pb-4 border-t border-red-500/10 bg-red-500/5 flex items-center justify-between gap-3">
          <span className="text-xs text-red-300/80">{L.deleteConfirm}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2.5 py-1 rounded-lg border border-white/10 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              {L.cancel}
            </button>
            <button
              onClick={() => { onDelete?.(prediction.id); setConfirmDelete(false); }}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-xs text-red-300 hover:bg-red-500/30 transition-colors"
            >
              {L.yes}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
