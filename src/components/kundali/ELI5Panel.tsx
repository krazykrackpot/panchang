'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Sparkles, Moon, Star, BookOpen, Eye, Compass } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { generateELI5, type ELI5Section } from '@/lib/kundali/eli5-engine';
import type { KundaliData } from '@/types/kundali';

interface ELI5PanelProps {
  kundali: KundaliData;
  locale: string;
}

// Map internal emoji classifiers to Lucide icons
const SECTION_ICONS: Record<string, React.ReactNode> = {
  door:     <Compass className="w-5 h-5" />,
  moon:     <Moon className="w-5 h-5" />,
  star:     <Star className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  book:     <BookOpen className="w-5 h-5" />,
  eye:      <Eye className="w-5 h-5" />,
};

function SectionCard({ section, locale, defaultOpen }: { section: ELI5Section; locale: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const lang = (locale === 'hi' || locale === 'sa') ? 'hi' : 'en';
  const title = section.title[lang] || section.title.en;
  const body = section.body[lang] || section.body.en;
  const icon = SECTION_ICONS[section.emoji] || <Sparkles className="w-5 h-5" />;

  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#111633]/80 to-[#0d1029]/80 overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gold-primary/5 transition-colors"
      >
        <span className="text-gold-primary/70 shrink-0">{icon}</span>
        <span className="font-semibold text-gold-light text-sm sm:text-base flex-1">{title}</span>
        <span className="text-text-secondary/50 shrink-0">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0">
          <div className="text-text-primary/85 text-sm leading-relaxed whitespace-pre-line">
            {body}
          </div>

          {section.learnMoreHref && section.learnMoreLabel && (
            <Link
              href={section.learnMoreHref}
              className="inline-flex items-center gap-1.5 mt-3 text-gold-primary/60 text-xs hover:text-gold-light transition-colors"
            >
              {section.learnMoreLabel[lang] || section.learnMoreLabel.en}
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function ELI5Panel({ kundali, locale }: ELI5PanelProps) {
  const result = useMemo(() => generateELI5(kundali), [kundali]);
  const lang = (locale === 'hi' || locale === 'sa') ? 'hi' : 'en';

  return (
    <div className="space-y-4">
      {/* Headline */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gold-light">
          {result.headline[lang] || result.headline.en}
        </h2>
        <p className="text-text-secondary text-sm mt-1">
          {lang === 'hi'
            ? 'यहाँ आपकी कुंडली की सबसे ज़रूरी बातें सरल शब्दों में हैं।'
            : 'Here are the most important things in your chart, explained simply.'}
        </p>
      </div>

      {/* Section cards — all stacked vertically */}
      <div className="space-y-3">
        {result.sections.map((section, i) => (
          <SectionCard
            key={section.emoji + i}
            section={section}
            locale={locale}
            defaultOpen={i < 3} // first 3 sections open by default
          />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-text-secondary/50 text-xs text-center pt-4">
        {lang === 'hi'
          ? 'यह सारांश है — पूरे विश्लेषण के लिए "Expert" मोड देखें।'
          : 'This is a summary — switch to "Expert" mode for the full technical analysis.'}
      </p>
    </div>
  );
}
