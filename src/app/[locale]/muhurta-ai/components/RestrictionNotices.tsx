'use client';

import { AlertTriangle } from 'lucide-react';
import type { RestrictionNotice } from '@/types/muhurta-ai';
import { pickByScript } from "@/lib/utils/locale-fonts";

interface RestrictionNoticesProps {
  restrictions: RestrictionNotice[];
  locale: string;
}

export default function RestrictionNotices({
  restrictions,
  locale,
}: RestrictionNoticesProps) {
  if (restrictions.length === 0) return null;

  return (
    <div className="space-y-2">
      {restrictions.map((r, i) => (
        <div
          key={i}
          className="flex items-start gap-3 px-4 py-3 rounded-xl border bg-amber-500/10 border-amber-500/20"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300">
            {pickByScript(r.label.en, r.label.hi, locale)}
          </p>
        </div>
      ))}
    </div>
  );
}
