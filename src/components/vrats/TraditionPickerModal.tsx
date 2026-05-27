'use client';

import { useState } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { VratTradition } from '@/lib/vrat/generator';

interface Props {
  locale: string;
  onPick: (tradition: VratTradition) => void;
  onCancel: () => void;
}

const COPY = {
  en: {
    title: 'Pick your tradition',
    subtitle:
      'Smarta and Vaishnava traditions can fast on different days for Ekadashi and a few other vrats. We need to know which you follow.',
    smartaTitle: 'Smarta',
    smartaBadge: 'Most common',
    smartaDesc:
      'Followed by the majority of Hindu households. Matches most published panchangs. Pick this if you are not sure.',
    vaishnavaTitle: 'Vaishnava',
    vaishnavaDesc:
      'Followed by ISKCON and Gaudiya Vaishnava practitioners. Rejects viddha tithi when the previous tithi touches sunrise. Differs from Smarta on Ekadashi about 4–6 times per year.',
    readMore: 'Read the full explanation in the learn module',
    confirm: 'Confirm selection',
    cancel: 'Cancel',
    notSure: 'Not sure — pick Smarta for me',
  },
  hi: {
    title: 'अपनी परम्परा चुनें',
    subtitle:
      'स्मार्त और वैष्णव परम्पराएँ एकादशी एवं कुछ अन्य व्रतों पर अलग-अलग दिन उपवास कर सकती हैं। हमें जानना है कि आप कौन सी परम्परा का अनुसरण करते हैं।',
    smartaTitle: 'स्मार्त',
    smartaBadge: 'सबसे प्रचलित',
    smartaDesc:
      'अधिकांश हिन्दू परिवार इसी का पालन करते हैं। मुख्यधारा के प्रकाशित पंचांगों से मेल खाता है। यदि आप अनिश्चित हैं तो यही चुनें।',
    vaishnavaTitle: 'वैष्णव',
    vaishnavaDesc:
      'इस्कॉन और गौड़ीय वैष्णव साधक इसी का पालन करते हैं। पिछली तिथि के सूर्योदय पर रहने पर "विद्ध" तिथि अस्वीकार करते हैं। एकादशी पर स्मार्त से वर्ष में 4-6 बार भिन्न होते हैं।',
    readMore: 'पूरी व्याख्या के लिए learn मॉड्यूल देखें',
    confirm: 'चयन पुष्टि करें',
    cancel: 'रद्द करें',
    notSure: 'अनिश्चित — मेरे लिए स्मार्त चुनें',
  },
};

export function TraditionPickerModal({ locale, onPick, onCancel }: Props) {
  const isHi = isDevanagariLocale(locale);
  const c = isHi ? COPY.hi : COPY.en;
  const [selected, setSelected] = useState<VratTradition>('smarta');

  const titleFontStyle = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-w-lg w-full bg-gradient-to-br from-[#2d1b69]/95 via-[#1a1040]/95 to-[#0a0e27] border border-gold-primary/30 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gold-light mb-2" style={titleFontStyle}>
          {c.title}
        </h2>
        <p className="text-text-secondary text-sm mb-5">{c.subtitle}</p>

        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={() => setSelected('smarta')}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selected === 'smarta'
                ? 'border-gold-primary bg-gold-primary/10'
                : 'border-white/10 hover:border-gold-primary/40 bg-[#1a1040]/40'
            }`}
            aria-pressed={selected === 'smarta'}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-text-primary" style={titleFontStyle}>
                {c.smartaTitle}
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-gold-primary/20 text-gold-light px-2 py-0.5 rounded-full">
                {c.smartaBadge}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{c.smartaDesc}</p>
          </button>

          <button
            type="button"
            onClick={() => setSelected('vaishnava')}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selected === 'vaishnava'
                ? 'border-gold-primary bg-gold-primary/10'
                : 'border-white/10 hover:border-gold-primary/40 bg-[#1a1040]/40'
            }`}
            aria-pressed={selected === 'vaishnava'}
          >
            <div className="mb-1.5">
              <span className="font-bold text-text-primary" style={titleFontStyle}>
                {c.vaishnavaTitle}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{c.vaishnavaDesc}</p>
          </button>
        </div>

        <Link
          href="/learn/smarta-vaishnava"
          className="block text-xs text-gold-light hover:underline mb-5"
          target="_blank"
          rel="noopener"
        >
          {c.readMore} →
        </Link>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => onPick(selected)}
            className="flex-1 px-4 py-2.5 bg-gold-primary text-bg-primary font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm"
          >
            {c.confirm}
          </button>
          <button
            type="button"
            onClick={() => onPick('smarta')}
            className="flex-1 px-4 py-2.5 border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/10 transition-colors text-sm"
          >
            {c.notSure}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="sm:flex-none px-4 py-2.5 text-text-secondary hover:text-text-primary text-sm"
          >
            {c.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
