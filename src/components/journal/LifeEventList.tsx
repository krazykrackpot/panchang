'use client';

/**
 * LifeEventList — renders a list of LifeEvent cards with category icon,
 * significance stars, planetary badges, and a delete button.
 */

import { useState } from 'react';
import { Star, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { LifeEvent } from '@/types/journal';

// Category to color mapping
const TYPE_COLORS: Record<string, string> = {
  career:       'text-blue-400 bg-blue-500/10 border-blue-500/20',
  health:       'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  relationship: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  financial:    'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  spiritual:    'text-violet-400 bg-violet-500/10 border-violet-500/20',
  creative:     'text-orange-400 bg-orange-500/10 border-orange-500/20',
  family:       'text-teal-400 bg-teal-500/10 border-teal-500/20',
  education:    'text-sky-400 bg-sky-500/10 border-sky-500/20',
  travel:       'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  legal:        'text-slate-400 bg-slate-500/10 border-slate-500/20',
  loss:         'text-gray-400 bg-gray-500/10 border-gray-500/20',
  other:        'text-text-secondary bg-white/5 border-white/10',
};

const TYPE_LABELS: Record<string, Record<string, string>> = {
  career:       { en: 'Career',      hi: 'करियर',         ta: 'தொழில்',        bn: 'ক্যারিয়ার' },
  health:       { en: 'Health',      hi: 'स्वास्थ्य',    ta: 'சுகாதாரம்',     bn: 'স্বাস্থ্য' },
  relationship: { en: 'Relationship',hi: 'सम्बंध',        ta: 'உறவு',           bn: 'সম্পর্ক' },
  financial:    { en: 'Financial',   hi: 'आर्थिक',        ta: 'நிதி',           bn: 'আর্থিক' },
  spiritual:    { en: 'Spiritual',   hi: 'आध्यात्मिक',   ta: 'ஆன்மீக',        bn: 'আধ্যাত্মিক' },
  creative:     { en: 'Creative',    hi: 'सृजनात्मक',     ta: 'படைப்பாற்றல்', bn: 'সৃজনশীল' },
  family:       { en: 'Family',      hi: 'परिवार',         ta: 'குடும்பம்',     bn: 'পরিবার' },
  education:    { en: 'Education',   hi: 'शिक्षा',         ta: 'கல்வி',          bn: 'শিக்ஷা' },
  travel:       { en: 'Travel',      hi: 'यात्रा',         ta: 'பயணம்',          bn: 'ভ্রমণ' },
  legal:        { en: 'Legal',       hi: 'कानूनी',         ta: 'சட்டம்',         bn: 'আইনগত' },
  loss:         { en: 'Loss',        hi: 'हानि',           ta: 'இழப்பு',         bn: 'ক্ষতি' },
  other:        { en: 'Other',       hi: 'अन्य',           ta: 'மற்றவை',         bn: 'অন্যান্য' },
};

const LABELS = {
  en: {
    noEvents: 'No life events recorded yet.',
    maha: 'Maha',
    antar: 'Antar',
    deleteConfirm: 'Delete this event?',
    yes: 'Yes, delete',
    cancel: 'Cancel',
    details: 'Details',
  },
  hi: {
    noEvents: 'अभी तक कोई जीवन घटना दर्ज नहीं है।',
    maha: 'महा',
    antar: 'अंतर',
    deleteConfirm: 'यह घटना हटाएँ?',
    yes: 'हाँ, हटाएँ',
    cancel: 'रद्द करें',
    details: 'विवरण',
  },
  ta: {
    noEvents: 'இதுவரை வாழ்க்கை நிகழ்வுகள் எதுவும் பதிவு செய்யப்படவில்லை.',
    maha: 'மஹா',
    antar: 'அந்தர்',
    deleteConfirm: 'இந்த நிகழ்வை நீக்கவா?',
    yes: 'ஆம், நீக்கு',
    cancel: 'ரத்து செய்',
    details: 'விவரங்கள்',
  },
  bn: {
    noEvents: 'এখনও কোনো জীবন ঘটনা নথিভুক্ত হয়নি।',
    maha: 'মহা',
    antar: 'অন্তর',
    deleteConfirm: 'এই ঘটনাটি মুছবেন?',
    yes: 'হ্যাঁ, মুছুন',
    cancel: 'বাতিল করুন',
    details: 'বিবরণ',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getL(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}
function getTypeLabel(type: string, locale: string): string {
  return TYPE_LABELS[type]?.[locale] ?? TYPE_LABELS[type]?.['en'] ?? type;
}

interface Props {
  events: LifeEvent[];
  locale: string;
  onDelete: (id: string) => void;
}

function EventCard({
  event,
  locale,
  onDelete,
  L,
}: {
  event: LifeEvent;
  locale: string;
  onDelete: (id: string) => void;
  L: (typeof LABELS)[SupportedLocale];
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const typeColor = TYPE_COLORS[event.event_type] ?? TYPE_COLORS.other;

  // Format event_date
  const dateStr = new Date(event.event_date + 'T12:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#1a1040]/30 to-[#0a0e27] overflow-hidden">
      {/* Header row */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Significance / stars column */}
          <div className="flex flex-col items-center pt-0.5 min-w-[40px]">
            <div className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold mb-1.5 ${typeColor}`}>
              {getTypeLabel(event.event_type, locale)}
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`w-2.5 h-2.5 ${
                    n <= (event.significance ?? 0)
                      ? 'text-gold-primary fill-gold-primary'
                      : 'text-text-secondary/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-text-primary leading-snug truncate">
                {event.title}
              </h3>
              <span className="text-xs text-text-secondary/60 shrink-0">{dateStr}</span>
            </div>

            {/* Dasha badges */}
            {(event.maha_dasha || event.antar_dasha) && (
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {event.maha_dasha && (
                  <span className="px-1.5 py-0.5 rounded bg-gold-primary/10 border border-gold-primary/20 text-[10px] text-gold-light">
                    {L.maha}: {event.maha_dasha}
                  </span>
                )}
                {event.antar_dasha && event.antar_dasha !== event.maha_dasha && (
                  <span className="px-1.5 py-0.5 rounded bg-gold-dark/10 border border-gold-dark/20 text-[10px] text-gold-primary">
                    {L.antar}: {event.antar_dasha}
                  </span>
                )}
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {event.description && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="p-1.5 rounded-lg text-text-secondary/50 hover:text-gold-light hover:bg-gold-primary/10 transition-all"
                aria-label={L.details}
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-text-secondary/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
              aria-label="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded description */}
        {expanded && event.description && (
          <p className="mt-3 text-xs text-text-secondary leading-relaxed pl-[52px] border-t border-white/5 pt-3">
            {event.description}
          </p>
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
              onClick={() => { onDelete(event.id); setConfirmDelete(false); }}
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

export default function LifeEventList({ events, locale, onDelete }: Props) {
  const L = getL(locale);

  if (events.length === 0) {
    return (
      <p className="text-center text-sm text-text-secondary/60 py-8">{L.noEvents}</p>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          locale={locale}
          onDelete={onDelete}
          L={L}
        />
      ))}
    </div>
  );
}
