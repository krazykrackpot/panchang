'use client';

/**
 * Kundali "Ask Your Chart" tab.
 *
 * Originally hosted the free chart-chat (2 AI questions/day, free tier).
 * That feature is REMOVED per the Brihaspati spec — replaced with a
 * Brihaspati entry point.
 *
 * The export name + props are preserved so kundali/Client.tsx's dynamic
 * import doesn't need to change.
 */

import { motion } from 'framer-motion';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { useBrihaspati } from '@/components/brihaspati/BrihaspatiProvider';

interface ChartChatTabProps {
  kundali: KundaliData;
  locale: Locale;
  headingFont: React.CSSProperties;
}

const COPY: Record<string, { title: string; body: string; cta: string; prompts: string[] }> = {
  en: {
    title: 'Ask Brihaspati about your chart',
    body: 'Brihaspati reads every detail of your kundali — dashas, transits, yogas, doshas — and answers in plain language. Pay only when you ask.',
    cta: 'Ask Brihaspati',
    prompts: [
      'Do I have Mangal Dosha? How severe is it?',
      'When is the best time for marriage in my chart?',
      'What do my current dashas say about the next year?',
      'Which gemstone should I wear based on my chart?',
    ],
  },
  hi: {
    title: 'अपनी कुंडली के बारे में बृहस्पति से पूछें',
    body: 'बृहस्पति आपकी कुंडली का हर विवरण पढ़ते हैं — दशा, गोचर, योग, दोष — और सरल भाषा में उत्तर देते हैं। पूछने पर ही भुगतान।',
    cta: 'बृहस्पति से पूछें',
    prompts: [
      'क्या मुझे मंगल दोष है? कितना गंभीर?',
      'मेरी कुंडली में विवाह का सर्वोत्तम समय कब है?',
      'मेरी वर्तमान दशा अगले वर्ष के बारे में क्या कहती है?',
      'मेरी कुंडली के अनुसार कौन सा रत्न पहनूँ?',
    ],
  },
};

export default function ChartChatTab({ kundali: _kundali, locale, headingFont }: ChartChatTabProps) {
  const { open } = useBrihaspati();
  const copy = COPY[locale] ?? COPY.en;

  const fireWith = (prompt: string) => {
    open('kundali_tab', prompt);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          rounded-2xl
          bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]
          border border-gold-primary/12
          hover:border-gold-primary/40
          p-8
          text-center
        "
      >
        <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-[#f0d48a] to-[#8a6d2b] flex items-center justify-center text-bg-primary text-2xl font-bold mb-4">
          बृ
        </div>
        <h2 style={headingFont} className="text-2xl text-gold-light mb-3">
          {copy.title}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xl mx-auto">
          {copy.body}
        </p>
        <button
          type="button"
          onClick={() => open('kundali_tab')}
          className="
            px-6 py-3 rounded-md
            bg-gradient-to-r from-[#d4a853] to-[#8a6d2b]
            text-bg-primary font-semibold
            hover:from-[#f0d48a] hover:to-[#a0813a]
            transition-all
          "
        >
          {copy.cta}
        </button>
      </motion.div>

      <div className="mt-8">
        <p className="text-text-secondary text-xs uppercase tracking-wide mb-3 text-center">
          {locale === 'hi' ? 'सुझाए गए प्रश्न' : 'Suggested questions'}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {copy.prompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => fireWith(p)}
              className="
                text-left
                rounded-xl
                bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]
                border border-gold-primary/12
                hover:border-gold-primary/40
                px-4 py-3
                text-sm text-text-primary
                transition-colors
              "
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
