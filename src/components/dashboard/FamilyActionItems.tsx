'use client';

import type { ActionItem } from '@/lib/kundali/family-synthesis/types';
import { tl } from '@/lib/utils/trilingual';
import { getBodyFont } from '@/lib/utils/locale-fonts';

interface FamilyActionItemsProps {
  items: ActionItem[];
  locale: string;
}

const TYPE_STYLES: Record<ActionItem['type'], { bg: string; border: string; text: string; label: string; labelHi: string }> = {
  do:    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'Do', labelHi: 'करें' },
  avoid: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', label: 'Avoid', labelHi: 'बचें' },
  watch: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', label: 'Watch', labelHi: 'ध्यान दें' },
};

export default function FamilyActionItems({ items, locale }: FamilyActionItemsProps) {
  const bodyStyle = getBodyFont(locale);

  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const style = TYPE_STYLES[item.type];
        return (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-xl ${style.bg} border ${style.border} px-3.5 py-2.5`}
          >
            <span className={`text-xs font-semibold uppercase tracking-wider shrink-0 mt-0.5 ${style.text}`}>
              {locale === 'hi' || locale === 'sa' ? style.labelHi : style.label}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm leading-relaxed" style={bodyStyle}>
                {tl(item.text, locale)}
              </p>
              {item.timing && (
                <span className="text-text-secondary text-xs mt-1 block">
                  {item.timing}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
