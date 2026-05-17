'use client';

import type { DashaEntry } from '@/types/kundali';
import { tl } from '@/lib/utils/trilingual';
import { ARCHETYPES } from '@/lib/constants/archetype-data';

// Map planet name (EN) to planet ID for archetype lookup
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

interface Props {
  dashas: DashaEntry[];
  locale: string;
}

function findCurrent(entries: DashaEntry[]): DashaEntry | undefined {
  const now = Date.now();
  return entries.find((d) => {
    const start = new Date(d.startDate).getTime();
    const end = new Date(d.endDate).getTime();
    return now >= start && now < end;
  });
}

function getChapterDescription(planetName: string): string {
  const pid = PLANET_NAME_TO_ID[planetName];
  if (pid == null) return '';
  const arch = ARCHETYPES[pid];
  return arch?.chapterDescription ?? '';
}

export default function SimpleTimeline({ dashas, locale }: Props) {
  const isHi = locale === 'hi' || locale === 'sa';
  const L = {
    title: isHi ? 'जीवन समयरेखा (विंशोत्तरी दशा)' : 'Life Timeline (Vimshottari Dasha)',
    currentMaha: isHi ? 'वर्तमान महादशा' : 'Current Mahadasha',
    mahadasha: isHi ? 'महादशा' : 'Mahadasha',
    currentAntar: isHi ? 'वर्तमान अन्तर्दशा' : 'Current Antardasha',
    antardasha: isHi ? 'अन्तर्दशा' : 'Antardasha',
  };

  // Only maha-level entries
  const mahas = dashas.filter((d) => d.level === 'maha');
  const currentMaha = findCurrent(mahas);
  const currentAntar = currentMaha?.subPeriods ? findCurrent(currentMaha.subPeriods) : undefined;

  // Progress bar computation
  const now = Date.now();
  const firstStart = mahas.length > 0 ? new Date(mahas[0].startDate).getTime() : now;
  const lastEnd = mahas.length > 0 ? new Date(mahas[mahas.length - 1].endDate).getTime() : now;
  const totalSpan = lastEnd - firstStart || 1;

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
      <h3 className="text-gold-light font-semibold text-sm mb-3">{L.title}</h3>

      {/* Progress bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-white/5">
        {mahas.map((d) => {
          const s = new Date(d.startDate).getTime();
          const e = new Date(d.endDate).getTime();
          const left = ((s - firstStart) / totalSpan) * 100;
          const width = ((e - s) / totalSpan) * 100;
          const isCurrent = d === currentMaha;
          const isPast = e <= now;

          return (
            <div
              key={d.planet + d.startDate}
              className={`absolute top-0 h-full ${
                isCurrent
                  ? 'bg-gradient-to-r from-gold-dark to-gold-primary'
                  : isPast
                    ? 'bg-white/15'
                    : 'bg-transparent'
              }`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${d.planet}: ${d.startDate} – ${d.endDate}`}
            />
          );
        })}
      </div>

      {/* Current Mahadasha */}
      {currentMaha && (
        <div className="mt-4">
          <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">{L.currentMaha}</p>
          <p className="text-gold-light font-semibold">
            {tl(currentMaha.planetName, locale)} {L.mahadasha}
          </p>
          <p className="text-text-secondary text-xs mt-0.5">
            {currentMaha.startDate} &ndash; {currentMaha.endDate}
          </p>
          <p className="text-text-primary text-sm mt-2 leading-relaxed">
            {getChapterDescription(currentMaha.planet)}
          </p>
        </div>
      )}

      {/* Current Antardasha */}
      {currentAntar && (
        <div className="mt-3 pl-4 border-l-2 border-gold-primary/20">
          <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">{L.currentAntar}</p>
          <p className="text-gold-light font-medium text-sm">
            {tl(currentAntar.planetName, locale)} {L.antardasha}
          </p>
          <p className="text-text-secondary text-xs mt-0.5">
            {currentAntar.startDate} &ndash; {currentAntar.endDate}
          </p>
          <p className="text-text-primary text-sm mt-1 leading-relaxed">
            {getChapterDescription(currentAntar.planet)}
          </p>
        </div>
      )}
    </div>
  );
}
