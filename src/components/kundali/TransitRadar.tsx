'use client';

import { useMemo } from 'react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { computePersonalTransits, computeUpcomingTransitions } from '@/lib/transit/personal-transits';

interface TransitRadarProps {
  ascendantSign: number;
  savTable: number[];
  locale: string;
}

export default function TransitRadar({ ascendantSign, savTable, locale }: TransitRadarProps) {
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const transits = useMemo(() => computePersonalTransits(ascendantSign, savTable), [ascendantSign, savTable]);
  const upcoming = useMemo(() => computeUpcomingTransitions(), []);

  if (transits.length === 0) return null;

  const QUALITY_STYLES = {
    strong: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    neutral: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    weak: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
  };

  return (
    <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
        <h3 className="text-xl text-gold-light font-bold">
          {isHi ? 'गोचर राडार — आपकी कुण्डली पर वर्तमान प्रभाव' : 'Transit Radar — What\'s Activating Your Chart'}
        </h3>
        <p className="text-text-secondary/60 text-xs mt-1">
          {isHi ? 'धीमे ग्रहों की वर्तमान स्थिति और आपकी अष्टकवर्ग शक्ति' : 'Current slow-planet positions mapped to your Ashtakavarga strength'}
        </p>
      </div>

      {/* Transit rows */}
      <div className="px-6 sm:px-8 pb-4 space-y-3">
        {transits.map(t => {
          const style = QUALITY_STYLES[t.quality];
          return (
            <div key={t.planetId} className={`flex items-center gap-3 p-3 rounded-xl ${style.bg} border ${style.border}`}>
              <div className="w-10 h-10 rounded-lg bg-bg-primary/50 border border-white/10 flex items-center justify-center shrink-0">
                <GrahaIconById id={t.planetId} size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm" style={{ color: t.planetColor }}>
                    {isHi ? t.planetName.hi : t.planetName.en}
                  </span>
                  <span className="text-text-secondary/60 text-xs">
                    → {isHi ? t.signName.hi : t.signName.en} (H{t.house})
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${style.text} ${style.bg} border ${style.border}`}>
                    {t.savBindu} bindu
                  </span>
                </div>
                <p className="text-text-secondary/75 text-xs mt-0.5 truncate">
                  {isHi ? t.interpretation.hi : t.interpretation.en}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming transitions */}
      {upcoming.length > 0 && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <h4 className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
            {isHi ? 'आगामी परिवर्तन (अगले 6 माह)' : 'Upcoming Sign Changes (Next 6 Months)'}
          </h4>
          <div className="space-y-1.5">
            {upcoming.map((u, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-text-secondary/70">
                <GrahaIconById id={u.planetId} size={14} />
                <span className="font-medium text-text-secondary">
                  {isHi ? u.planetName.hi : u.planetName.en}
                </span>
                <span>→</span>
                <span className="text-gold-light">{isHi ? u.toSign.hi : u.toSign.en}</span>
                <span className="text-text-secondary/50 ml-auto">{u.approximateDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
