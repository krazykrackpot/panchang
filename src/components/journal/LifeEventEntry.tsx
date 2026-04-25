'use client';

/**
 * LifeEventEntry — form to record a new life event.
 * Captures: date, type, title, description, significance (1-5 stars), tags.
 */

import { useState } from 'react';
import { Star, Plus, Loader2, X, Tag } from 'lucide-react';

const EVENT_TYPES = [
  { value: 'career',       en: 'Career',       hi: 'करियर',          ta: 'தொழில்',        bn: 'ক্যারিয়ার' },
  { value: 'health',       en: 'Health',        hi: 'स्वास्थ्य',     ta: 'சுகாதாரம்',     bn: 'স্বাস্থ্য' },
  { value: 'relationship', en: 'Relationship',  hi: 'सम्बंध',         ta: 'உறவு',           bn: 'সম্পর্ক' },
  { value: 'financial',    en: 'Financial',     hi: 'आर्थिक',         ta: 'நிதி',           bn: 'আর্থিক' },
  { value: 'spiritual',    en: 'Spiritual',     hi: 'आध्यात्मिक',    ta: 'ஆன்மீக',        bn: 'আধ্যাত্মিক' },
  { value: 'creative',     en: 'Creative',      hi: 'सृजनात्मक',      ta: 'படைப்பாற்றல்', bn: 'সৃজনশীল' },
  { value: 'family',       en: 'Family',        hi: 'परिवार',          ta: 'குடும்பம்',     bn: 'পরিবার' },
  { value: 'education',    en: 'Education',     hi: 'शिक्षा',          ta: 'கல்வி',          bn: 'শিক্ষা' },
  { value: 'travel',       en: 'Travel',        hi: 'यात्रा',          ta: 'பயணம்',          bn: 'ভ্রমণ' },
  { value: 'legal',        en: 'Legal',         hi: 'कानूनी',          ta: 'சட்டம்',         bn: 'আইনগত' },
  { value: 'loss',         en: 'Loss / Grief',  hi: 'हानि / शोक',     ta: 'இழப்பு',         bn: 'ক্ষতি' },
  { value: 'other',        en: 'Other',         hi: 'अन्य',            ta: 'மற்றவை',         bn: 'অন্যান্য' },
] as const;

const LABELS = {
  en: {
    heading: 'Add Life Event',
    date: 'Event Date',
    type: 'Category',
    title: 'What happened?',
    titlePlaceholder: 'E.g. Got promoted, Started meditation practice…',
    description: 'Details (optional)',
    descPlaceholder: 'Any additional context…',
    significance: 'Significance',
    tagInput: 'Add tag',
    tagPlaceholder: 'Press Enter to add',
    submit: 'Record Event',
    submitting: 'Recording…',
    errorPrefix: 'Error:',
    successMsg: 'Life event recorded',
    selectType: 'Select category',
  },
  hi: {
    heading: 'जीवन घटना जोड़ें',
    date: 'घटना की तारीख',
    type: 'श्रेणी',
    title: 'क्या हुआ?',
    titlePlaceholder: 'उदा. पदोन्नति मिली, ध्यान शुरू किया…',
    description: 'विवरण (वैकल्पिक)',
    descPlaceholder: 'कोई अतिरिक्त संदर्भ…',
    significance: 'महत्त्व',
    tagInput: 'टैग जोड़ें',
    tagPlaceholder: 'Enter दबाएँ',
    submit: 'घटना दर्ज करें',
    submitting: 'दर्ज हो रहा है…',
    errorPrefix: 'त्रुटि:',
    successMsg: 'घटना दर्ज हुई',
    selectType: 'श्रेणी चुनें',
  },
  ta: {
    heading: 'வாழ்க்கை நிகழ்வு சேர்',
    date: 'நிகழ்வு தேதி',
    type: 'வகை',
    title: 'என்ன நடந்தது?',
    titlePlaceholder: 'எ.கா. பதவி உயர்வு, தியானம் தொடங்கினேன்…',
    description: 'விவரங்கள் (விரும்பினால்)',
    descPlaceholder: 'கூடுதல் சூழல்…',
    significance: 'முக்கியத்துவம்',
    tagInput: 'குறிச்சொல் சேர்',
    tagPlaceholder: 'Enter அழுத்தவும்',
    submit: 'நிகழ்வைப் பதிவு செய்',
    submitting: 'பதிவு செய்கிறது…',
    errorPrefix: 'பிழை:',
    successMsg: 'நிகழ்வு பதிவு செய்யப்பட்டது',
    selectType: 'வகை தேர்ந்தெடு',
  },
  bn: {
    heading: 'জীবন ঘটনা যোগ করুন',
    date: 'ঘটনার তারিখ',
    type: 'বিভাগ',
    title: 'কী হয়েছে?',
    titlePlaceholder: 'যেমন: পদোন্নতি পেলাম, ধ্যান শুরু করলাম…',
    description: 'বিবরণ (ঐচ্ছিক)',
    descPlaceholder: 'অতিরিক্ত প্রসঙ্গ…',
    significance: 'গুরুত্ব',
    tagInput: 'ট্যাগ যোগ করুন',
    tagPlaceholder: 'Enter চাপুন',
    submit: 'ঘটনা লিপিবদ্ধ করুন',
    submitting: 'লিপিবদ্ধ হচ্ছে…',
    errorPrefix: 'ত্রুটি:',
    successMsg: 'ঘটনা লিপিবদ্ধ হয়েছে',
    selectType: 'বিভাগ নির্বাচন করুন',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getL(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}
function getTypeLabel(value: string, locale: string) {
  const t = EVENT_TYPES.find((et) => et.value === value);
  if (!t) return value;
  return (t as Record<string, string>)[locale as SupportedLocale] ?? t.en;
}

interface Props {
  locale: string;
  onSubmit: (data: {
    eventDate: string;
    eventType: string;
    title: string;
    description?: string;
    significance?: number;
    tags?: string[];
  }) => Promise<{ error?: string }>;
}

export default function LifeEventEntry({ locale, onSubmit }: Props) {
  const L = getL(locale);

  const todayStr = new Date().toISOString().slice(0, 10);

  const [eventDate, setEventDate]       = useState(todayStr);
  const [eventType, setEventType]       = useState('');
  const [title, setTitle]               = useState('');
  const [description, setDescription]   = useState('');
  const [significance, setSignificance] = useState<number>(3);
  const [tags, setTags]                 = useState<string[]>([]);
  const [tagInput, setTagInput]         = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState(false);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!eventType) { setError('Please select a category'); return; }
    if (!title.trim()) { setError('Please enter a title'); return; }

    setSubmitting(true);
    const result = await onSubmit({
      eventDate,
      eventType,
      title: title.trim(),
      description: description.trim() || undefined,
      significance,
      tags: tags.length > 0 ? tags : undefined,
    });
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Reset form on success
    setTitle('');
    setDescription('');
    setEventType('');
    setSignificance(3);
    setTags([]);
    setTagInput('');
    setEventDate(todayStr);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
          <Plus className="w-4 h-4 text-gold-primary" />
        </div>
        <h2 className="text-base font-semibold text-gold-light">{L.heading}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row: date + category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Date */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">{L.date}</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              max={todayStr}
              className="w-full px-3 py-2 rounded-lg bg-[#111633] border border-gold-primary/20 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50 transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">{L.type}</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#111633] border border-gold-primary/20 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50 transition-colors"
            >
              <option value="">{L.selectType}</option>
              {EVENT_TYPES.map((et) => (
                <option key={et.value} value={et.value}>
                  {getTypeLabel(et.value, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs text-text-secondary mb-1">{L.title}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={L.titlePlaceholder}
            maxLength={200}
            className="w-full px-3 py-2 rounded-lg bg-[#111633] border border-gold-primary/20 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-text-secondary mb-1">{L.description}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={L.descPlaceholder}
            maxLength={1000}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-[#111633] border border-gold-primary/20 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-gold-primary/50 transition-colors resize-none"
          />
        </div>

        {/* Significance stars + tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Significance */}
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">{L.significance}</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSignificance(n)}
                  className="p-0.5 focus:outline-none"
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      n <= significance
                        ? 'text-gold-primary fill-gold-primary'
                        : 'text-text-secondary/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">{L.tagInput}</label>
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary/50" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={L.tagPlaceholder}
                  maxLength={30}
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-[#111633] border border-gold-primary/20 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-2.5 py-2 rounded-lg border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tag badges */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-xs text-gold-light"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gold-primary/60 hover:text-gold-primary transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Error / success */}
        {error && (
          <p className="text-xs text-red-400/80 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {L.errorPrefix} {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            {L.successMsg}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {L.submitting}
            </>
          ) : (
            L.submit
          )}
        </button>
      </form>
    </div>
  );
}
