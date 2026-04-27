'use client';

import { Sun, Moon, Shield, Clock } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';

interface HoraInfo {
  planetName: string;
  endTime: string;
  activity: string;
}

interface DeadZoneInfo {
  name: string;
  startTime: string;
}

interface AtAGlanceProps {
  currentHora?: HoraInfo | null;
  nextDeadZone?: DeadZoneInfo | null;
  dayQuality?: string;
  dayQualityColor?: string;
  sunrise?: string;
  sunset?: string;
  locale: string;
}

export default function AtAGlance({
  currentHora,
  nextDeadZone,
  dayQuality,
  dayQualityColor,
  sunrise,
  sunset,
  locale,
}: AtAGlanceProps) {
  const tileClass =
    'bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-[#d4a853]/10 rounded-xl p-3 min-h-[72px] flex flex-col justify-center';

  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {/* Current Hora */}
      <div className={tileClass}>
        <div className="flex items-center gap-1.5 mb-1">
          <Clock className="w-3.5 h-3.5 text-gold-primary/70" />
          <span className="text-[10px] uppercase tracking-widest text-text-secondary/70 font-semibold">
            {isHi ? 'होरा' : 'Hora'}
          </span>
        </div>
        {currentHora ? (
          <>
            <p className="text-sm font-bold text-gold-light truncate">{currentHora.planetName}</p>
            <p className="text-[11px] text-text-secondary">
              {tl({ en: 'until', hi: 'तक', sa: 'पर्यन्तम्', ta: 'வரை', bn: 'পর্যন্ত' }, locale)} {currentHora.endTime}
            </p>
          </>
        ) : (
          <p className="text-xs text-text-secondary/50">&mdash;</p>
        )}
      </div>

      {/* Next Caution Period */}
      <div className={tileClass}>
        <div className="flex items-center gap-1.5 mb-1">
          <Shield className="w-3.5 h-3.5 text-amber-400/70" />
          <span className="text-[10px] uppercase tracking-widest text-text-secondary/70 font-semibold">
            {isHi ? 'सावधान' : 'Caution'}
          </span>
        </div>
        {nextDeadZone ? (
          <>
            <p className="text-sm font-bold text-amber-400 truncate">{nextDeadZone.name}</p>
            <p className="text-[11px] text-text-secondary">
              {tl({ en: 'starts', hi: 'शुरू', sa: 'आरम्भः', ta: 'தொடக்கம்', bn: 'শুরু' }, locale)} {nextDeadZone.startTime}
            </p>
          </>
        ) : (
          <p className="text-xs text-text-secondary/50">
            {tl({ en: 'All clear', hi: 'सब ठीक', sa: 'सर्वं शुभम्', ta: 'எல்லாம் சரி', bn: 'সব ঠিক' }, locale)}
          </p>
        )}
      </div>

      {/* Day Quality */}
      <div className={tileClass}>
        <div className="flex items-center gap-1.5 mb-1">
          <Sun className="w-3.5 h-3.5 text-gold-primary/70" />
          <span className="text-[10px] uppercase tracking-widest text-text-secondary/70 font-semibold">
            {isHi ? 'दिन' : 'Day'}
          </span>
        </div>
        {dayQuality ? (
          <p className={`text-sm font-bold ${dayQualityColor || 'text-gold-light'}`}>{dayQuality}</p>
        ) : (
          <p className="text-xs text-text-secondary/50">&mdash;</p>
        )}
      </div>

      {/* Sun Times */}
      <div className={tileClass}>
        <div className="flex items-center gap-1.5 mb-1">
          <Moon className="w-3.5 h-3.5 text-gold-primary/70" />
          <span className="text-[10px] uppercase tracking-widest text-text-secondary/70 font-semibold">
            {isHi ? 'सूर्य' : 'Sun'}
          </span>
        </div>
        {sunrise || sunset ? (
          <div className="flex items-center gap-3">
            {sunrise && (
              <span className="text-sm text-gold-light font-bold">{sunrise}</span>
            )}
            {sunset && (
              <span className="text-sm text-text-secondary font-bold">{sunset}</span>
            )}
          </div>
        ) : (
          <p className="text-xs text-text-secondary/50">&mdash;</p>
        )}
      </div>
    </div>
  );
}
