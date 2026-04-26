'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';

interface QuickPersonalizeProps {
  birthNakshatra: number | null;
  birthRashi: number | null;
  onNakshatraChange: (id: number | null) => void;
  onRashiChange: (id: number | null) => void;
}

const LS_KEY = 'muhurta-quick-personalize';

export default function QuickPersonalize({
  birthNakshatra,
  birthRashi,
  onNakshatraChange,
  onRashiChange,
}: QuickPersonalizeProps) {
  const locale = useLocale();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { nakshatra?: number | null; rashi?: number | null };
      if (saved.nakshatra !== undefined) onNakshatraChange(saved.nakshatra);
      if (saved.rashi !== undefined) onRashiChange(saved.rashi);
    } catch (err) {
      console.error('[QuickPersonalize] failed to load from localStorage:', err);
    }
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleNakshatraChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
    onNakshatraChange(val);
    persist(val, birthRashi);
  }

  function handleRashiChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
    onRashiChange(val);
    persist(birthNakshatra, val);
  }

  function persist(nakshatra: number | null, rashi: number | null) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ nakshatra, rashi }));
    } catch (err) {
      console.error('[QuickPersonalize] failed to save to localStorage:', err);
    }
  }

  return (
    <div className="bg-[#111633]/60 border border-[#8a6d2b]/20 rounded-xl p-4 flex flex-wrap gap-4 items-end">
      {/* Birth Nakshatra */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">Birth Nakshatra</label>
        <select
          value={birthNakshatra ?? ''}
          onChange={handleNakshatraChange}
          className="bg-[#161b42] border border-[#d4a853]/20 text-[#e6e2d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/15"
        >
          <option value="">— Any —</option>
          {NAKSHATRAS.map((n) => (
            <option key={n.id} value={n.id}>
              {tl(n.name, locale)}
            </option>
          ))}
        </select>
      </div>

      {/* Birth Rashi */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">Birth Rashi</label>
        <select
          value={birthRashi ?? ''}
          onChange={handleRashiChange}
          className="bg-[#161b42] border border-[#d4a853]/20 text-[#e6e2d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/15"
        >
          <option value="">— Any —</option>
          {RASHIS.map((r) => (
            <option key={r.id} value={r.id}>
              {tl(r.name, locale)}
            </option>
          ))}
        </select>
      </div>

      {/* Info + link */}
      <div className="flex flex-col gap-1 ml-auto text-right">
        <p className="text-[11px] text-[#8a8478]">Add birth details for personalized results</p>
        <Link
          href={`/${locale}/kundali`}
          className="text-[11px] text-[#d4a853] hover:text-[#f0d48a] transition-colors"
        >
          Generate a full chart for dasha-personalized results →
        </Link>
      </div>
    </div>
  );
}
