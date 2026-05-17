'use client';

import { getAshram } from '@/lib/constants/ashram-data';

interface Props {
  birthDate: string;
  locale: string;
}

export default function AshramStage({ birthDate, locale }: Props) {
  const ashram = getAshram(birthDate);
  const isHi = locale === 'hi' || locale === 'sa';

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
      {/* Header — show Sanskrit name for sa locale */}
      <h3 className="text-gold-light font-semibold text-lg">
        {ashram.nameEn}
        {locale === 'sa' && (
          <span className="text-text-secondary text-sm ml-2">({ashram.nameSa})</span>
        )}
        {locale === 'hi' && (
          <span className="text-text-secondary text-sm ml-2">({ashram.nameHi})</span>
        )}
      </h3>

      {/* Description */}
      <p className="text-text-primary text-sm mt-2 leading-relaxed">
        {isHi ? ashram.descriptionHi : ashram.descriptionEn}
      </p>

      {/* Focus area pills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {ashram.focusAreas.map((area) => (
          <span
            key={area.en}
            className="px-3 py-1 rounded-full text-xs font-medium bg-gold-primary/10 text-gold-light border border-gold-primary/20"
          >
            {isHi ? area.hi : area.en}
          </span>
        ))}
      </div>
    </div>
  );
}
