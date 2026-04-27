'use client';

import { useState } from 'react';
import { GRAHA_SHANTI, type GrahaShanti as GrahaShantiData } from '@/lib/constants/graha-shanti';
import { tl } from '@/lib/utils/trilingual';
import { BookOpen, ChevronDown, Sparkles } from 'lucide-react';

interface GrahaShantiProps {
  planetId: number;  // 0-8
  locale: string;
  /** Render inline (no outer card chrome) when used inside ContextualRemediesPanel */
  inline?: boolean;
}

/** Module-level lookup — avoids recreating on every render */
const SHANTI_MAP: Record<number, GrahaShantiData> = {};
for (const s of GRAHA_SHANTI) {
  SHANTI_MAP[s.planetId] = s;
}

export default function GrahaShanti({ planetId, locale, inline }: GrahaShantiProps) {
  const isEn = locale === 'en' || locale === 'ta';
  const shanti = SHANTI_MAP[planetId];
  if (!shanti) return null;

  const [expanded, setExpanded] = useState(!!inline);

  const content = (
    <div className="space-y-4">
      {/* Deity */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-gold-primary shrink-0" />
        <div>
          <span className="text-text-secondary/50 text-xs block">
            {isEn ? 'Presiding Deity' : 'अधिष्ठाता देवता'}
          </span>
          <span className="text-text-primary text-sm font-medium">
            {tl(shanti.deity, locale)}
          </span>
        </div>
      </div>

      {/* Mantra */}
      <div>
        <h5 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
          {isEn ? 'Navagraha Stotra Mantra' : 'नवग्रह स्तोत्र मंत्र'}
        </h5>
        <div className="bg-gradient-to-r from-[#2d1b69]/30 to-[#1a1040]/30 border border-gold-primary/10 rounded-xl px-4 py-3">
          <p
            className="text-gold-light font-medium text-sm leading-relaxed"
            style={{ fontFamily: 'var(--font-devanagari-body)' }}
          >
            {shanti.mantra.text}
          </p>
          <p className="text-text-secondary/70 text-xs mt-2 leading-relaxed">
            {isEn ? shanti.mantra.meaning.en : shanti.mantra.meaning.hi}
          </p>
          <p className="text-text-secondary/40 text-xs mt-2">
            {isEn
              ? `Recommended japa count: ${shanti.mantra.count.toLocaleString()}`
              : `अनुशंसित जप संख्या: ${shanti.mantra.count.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Grid: gemstone, metal, day, color, grain, flower, direction */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {([
          { label: isEn ? 'Gemstone' : 'रत्न', value: isEn ? shanti.gemstone.en : shanti.gemstone.hi },
          { label: isEn ? 'Metal' : 'धातु', value: isEn ? shanti.metal.en : shanti.metal.hi },
          { label: isEn ? 'Day' : 'दिन', value: isEn ? shanti.day.en : shanti.day.hi },
          { label: isEn ? 'Color' : 'रंग', value: isEn ? shanti.color.en : shanti.color.hi },
          { label: isEn ? 'Grain' : 'अनाज', value: isEn ? shanti.grain.en : shanti.grain.hi },
          { label: isEn ? 'Flower' : 'पुष्प', value: isEn ? shanti.flower.en : shanti.flower.hi },
          { label: isEn ? 'Direction' : 'दिशा', value: isEn ? shanti.direction.en : shanti.direction.hi },
        ] as const).map((item) => (
          <div key={item.label} className="bg-white/[0.02] rounded-lg px-3 py-2">
            <span className="text-text-secondary/50 block">{item.label}</span>
            <span className="text-text-primary">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Fast note */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-amber-300 text-xs font-semibold block mb-1">
              {isEn ? 'Fasting Guidelines' : 'व्रत निर्देश'}
            </span>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isEn ? shanti.fastNote.en : shanti.fastNote.hi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // If inline, just return the content without card wrapper
  if (inline) return content;

  // Standalone card with expand/collapse
  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <Sparkles className="w-4 h-4 text-gold-primary shrink-0" />
        <span className="font-semibold text-gold-light text-sm flex-1">
          {tl(shanti.deity, locale)} — {isEn ? 'Graha Shanti Vidhi' : 'ग्रह शान्ति विधि'}
        </span>
        <ChevronDown className={`w-4 h-4 text-text-secondary/40 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4">
          {content}
        </div>
      )}
    </div>
  );
}

/** Show all 9 planets' shanti in an accordion */
export function GrahaShantiAll({ locale }: { locale: string }) {
  return (
    <div className="space-y-3">
      {GRAHA_SHANTI.map((s) => (
        <GrahaShanti key={s.planetId} planetId={s.planetId} locale={locale} />
      ))}
    </div>
  );
}
