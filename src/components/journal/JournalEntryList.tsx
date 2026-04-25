'use client';

/**
 * JournalEntryList — vertical list of journal entry cards.
 *
 * Each card shows: date, MoodEnergyDisplay, note, tags, planetary badges, delete button.
 * Empty state rendered when entries array is empty.
 */

import { useState } from 'react';
import { Trash2, BookOpen } from 'lucide-react';
import MoodEnergyDisplay from './MoodEnergyDisplay';
import type { JournalEntry } from '@/types/journal';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    empty: 'No journal entries yet. Start your first check-in on the dashboard!',
    deleteConfirm: 'Delete this journal entry? This cannot be undone.',
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    dasha: 'Dasha',
  },
  hi: {
    empty: 'अभी तक कोई जर्नल प्रविष्टि नहीं है। डैशबोर्ड पर अपनी पहली जाँच शुरू करें!',
    deleteConfirm: 'यह जर्नल प्रविष्टि हटाएं? यह पूर्ववत नहीं किया जा सकता।',
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    dasha: 'दशा',
  },
  sa: {
    empty: 'अद्यापि कापि प्रविष्टिः नास्ति। डैशबोर्डे प्रथमां जाँचं कुर्वन्तु!',
    deleteConfirm: 'इयं दैनिकी प्रविष्टिः मोचयामः? एतत् प्रत्यावर्तितुं न शक्यते।',
    tithi: 'तिथिः',
    nakshatra: 'नक्षत्रम्',
    dasha: 'दशा',
  },
  ta: {
    empty: 'இதுவரை ஜர்னல் பதிவுகள் இல்லை. டாஷ்போர்டில் முதல் செக்-இன் தொடங்குங்கள்!',
    deleteConfirm: 'இந்த ஜர்னல் பதிவை நீக்கவா? இதை மீட்டெடுக்க முடியாது.',
    tithi: 'திதி',
    nakshatra: 'நட்சத்திரம்',
    dasha: 'தசை',
  },
  bn: {
    empty: 'এখনও কোনো জার্নাল এন্ট্রি নেই। ড্যাশবোর্ডে প্রথম চেক-ইন শুরু করুন!',
    deleteConfirm: 'এই জার্নাল এন্ট্রি মুছবেন? এটি পূর্বাবস্থায় ফেরানো যাবে না।',
    tithi: 'তিথি',
    nakshatra: 'নক্ষত্র',
    dasha: 'দশা',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getLabels(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  entries: JournalEntry[];
  locale: string;
  onDelete: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Single entry card
// ---------------------------------------------------------------------------
function EntryCard({
  entry,
  locale,
  onDelete,
}: {
  entry: JournalEntry;
  locale: string;
  onDelete: (id: string) => void;
}) {
  const L = getLabels(locale);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    if (!window.confirm(L.deleteConfirm)) return;
    setDeleting(true);
    // Parent handles the async delete; optimistic removal keeps UI snappy.
    onDelete(entry.id);
    // Note: if delete fails, parent should restore the entry.
    // We don't reset deleting here since the card will be unmounted on success.
  };

  const ps = entry.planetary_state;

  return (
    <div
      className={[
        'rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-5 transition-opacity',
        deleting ? 'opacity-50 pointer-events-none' : '',
      ].join(' ')}
    >
      {/* Header row: date + delete */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-gold-light font-semibold text-sm">{formatDate(entry.entry_date)}</p>
        </div>
        <button
          onClick={handleDelete}
          aria-label="Delete entry"
          className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mood + Energy */}
      {entry.mood != null && entry.energy != null && (
        <div className="mb-3">
          <MoodEnergyDisplay mood={entry.mood} energy={entry.energy} size="sm" />
        </div>
      )}

      {/* Note */}
      {entry.note && (
        <p className="text-text-primary text-sm leading-relaxed italic mb-3">
          &ldquo;{entry.note}&rdquo;
        </p>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs border border-gold-primary/30 text-gold-primary bg-gold-primary/5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Planetary badges */}
      <div className="flex flex-wrap gap-1.5">
        {ps?.tithi?.name && (
          <span className="px-2 py-0.5 rounded-md text-[10px] bg-[#1a1040]/60 border border-gold-primary/10 text-text-secondary">
            <span className="text-gold-primary/70">{L.tithi}:</span> {ps.tithi.name}
          </span>
        )}
        {ps?.nakshatra?.name && (
          <span className="px-2 py-0.5 rounded-md text-[10px] bg-[#1a1040]/60 border border-gold-primary/10 text-text-secondary">
            <span className="text-gold-primary/70">{L.nakshatra}:</span> {ps.nakshatra.name}
          </span>
        )}
        {ps?.dasha?.mahaDasha && (
          <span className="px-2 py-0.5 rounded-md text-[10px] bg-[#1a1040]/60 border border-gold-primary/10 text-text-secondary">
            <span className="text-gold-primary/70">{L.dasha}:</span> {ps.dasha.mahaDasha}
            {ps.dasha.antarDasha ? ` / ${ps.dasha.antarDasha}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function JournalEntryList({ entries, locale, onDelete }: Props) {
  const L = getLabels(locale);

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-8 flex flex-col items-center gap-3 text-center">
        <BookOpen className="w-8 h-8 text-gold-primary/30" />
        <p className="text-text-secondary text-sm max-w-xs">{L.empty}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          locale={locale}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
