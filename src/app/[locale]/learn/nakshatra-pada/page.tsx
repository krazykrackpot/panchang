'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { NAKSHATRA_PADA_PROFILES } from '@/lib/constants/nakshatra-pada-profiles';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont } from '@/lib/utils/locale-fonts';

const NAK_SLUGS = ['ashwini','bharani','krittika','rohini','mrigashira','ardra','punarvasu','pushya','ashlesha','magha','purva-phalguni','uttara-phalguni','hasta','chitra','swati','vishakha','anuradha','jyeshtha','mula','purva-ashadha','uttara-ashadha','shravana','dhanishta','shatabhisha','purva-bhadrapada','uttara-bhadrapada','revati'];

const ELEMENT_DOT: Record<string, string> = {
  Fire: 'bg-red-400', Earth: 'bg-emerald-400', Air: 'bg-cyan-400', Water: 'bg-blue-400',
};

export default function NakshatraPadaIndex() {
  const locale = useLocale();
  const hf = getHeadingFont(locale);
  const isHi = locale === 'hi' || locale === 'sa';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {isHi ? 'नक्षत्र पद विश्लेषण' : 'Nakshatra Pada Analysis'}
        </h2>
        <p className="text-text-secondary text-lg">
          {isHi ? '27 नक्षत्र × 4 पद = 108 अद्वितीय व्यक्तित्व प्रोफाइल। शिशु नाम अक्षर सहित।' : '27 nakshatras × 4 padas = 108 unique personality profiles. Including baby name starting syllables.'}
        </p>
      </div>

      {/* 27×4 Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-text-secondary text-xs uppercase tracking-wider py-2 px-3 border-b border-white/10">
                {isHi ? 'नक्षत्र' : 'Nakshatra'}
              </th>
              {[1, 2, 3, 4].map(p => (
                <th key={p} className="text-center text-text-secondary text-xs uppercase tracking-wider py-2 px-3 border-b border-white/10">
                  {isHi ? `पद ${p}` : `Pada ${p}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 27 }, (_, n) => {
              const nakData = NAKSHATRAS[n];
              const nakName = tl(nakData?.name, locale) || NAK_SLUGS[n];
              return (
                <tr key={n} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2 px-3">
                    <span className="text-gold-light text-sm font-medium">{nakName}</span>
                    <span className="text-text-secondary/50 text-xs ml-2">#{n + 1}</span>
                  </td>
                  {[1, 2, 3, 4].map(p => {
                    const profile = NAKSHATRA_PADA_PROFILES.find(pr => pr.nakshatraId === n + 1 && pr.pada === p);
                    const slug = `${NAK_SLUGS[n]}-pada-${p}`;
                    const dotColor = ELEMENT_DOT[profile?.element || ''] || 'bg-gold-primary';
                    return (
                      <td key={p} className="py-2 px-3 text-center">
                        <Link href={`/learn/nakshatra-pada/${slug}`}
                          className="inline-flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-white/5 hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-all group">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                            <span className="text-gold-light text-sm font-bold group-hover:text-gold-primary">{profile?.syllable || '—'}</span>
                          </div>
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-text-secondary">
        {Object.entries(ELEMENT_DOT).map(([elem, color]) => (
          <div key={elem} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span>{elem}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
