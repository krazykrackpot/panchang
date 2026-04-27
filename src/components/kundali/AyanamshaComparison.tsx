'use client';

import { useMemo } from 'react';
import { getAyanamsa, type AyanamsaType } from '@/lib/astronomy/ayanamsa';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';

// Ayanamsha system metadata — hoisted to module level (no inline objects in render)
const AYANAMSHA_SYSTEMS: { key: AyanamsaType; label: string; desc: string }[] = [
  { key: 'lahiri', label: 'Lahiri', desc: 'Chitrapaksha — IAU standard, most widely used in India' },
  { key: 'raman', label: 'Raman', desc: 'B.V. Raman — popular in South India' },
  { key: 'krishnamurti', label: 'KP', desc: 'Krishnamurti Paddhati — used in KP system' },
];

interface AyanamshaComparisonProps {
  kundali: KundaliData;
  locale: string;
}

interface PlanetRow {
  id: number;
  name: string;
  /** Sidereal longitude per ayanamsha system */
  positions: {
    lahiri: number;
    raman: number;
    krishnamurti: number;
  };
  /** true if any system puts the planet in a different sign */
  hasSignChange: boolean;
}

/** Format sidereal longitude as "Aries 11°44'" */
function formatPosition(siderealLong: number, locale: string): { sign: string; formatted: string; signIndex: number } {
  const normalized = ((siderealLong % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30); // 0-based
  const degInSign = normalized - signIndex * 30;
  const deg = Math.floor(degInSign);
  const min = Math.floor((degInSign - deg) * 60);
  const signName = tl(RASHIS[signIndex]?.name, locale) || `Sign ${signIndex + 1}`;
  return {
    sign: signName,
    formatted: `${signName} ${deg}°${min.toString().padStart(2, '0')}'`,
    signIndex,
  };
}

export default function AyanamshaComparison({ kundali, locale }: AyanamshaComparisonProps) {
  const rows = useMemo(() => {
    const jd = kundali.julianDay;
    const lahiriAya = kundali.ayanamshaValue;
    const ramanAya = getAyanamsa(jd, 'raman');
    const kpAya = getAyanamsa(jd, 'krishnamurti');

    // Compute planet rows
    const planetRows: PlanetRow[] = kundali.planets.map((p: PlanetPosition) => {
      // p.longitude is sidereal (Lahiri). Convert back to tropical, then to each system.
      const tropicalLong = p.longitude + lahiriAya;
      const lahiriLong = tropicalLong - lahiriAya; // same as p.longitude
      const ramanLong = ((tropicalLong - ramanAya) % 360 + 360) % 360;
      const kpLong = ((tropicalLong - kpAya) % 360 + 360) % 360;

      const lahiriSign = Math.floor(lahiriLong / 30);
      const ramanSign = Math.floor(ramanLong / 30);
      const kpSign = Math.floor(kpLong / 30);

      return {
        id: p.planet.id,
        name: tl(p.planet.name, locale),
        positions: { lahiri: lahiriLong, raman: ramanLong, krishnamurti: kpLong },
        hasSignChange: lahiriSign !== ramanSign || lahiriSign !== kpSign,
      };
    });

    // Add Lagna row
    const ascLong = kundali.ascendant.degree;
    const tropAsc = ascLong + lahiriAya;
    const ramanAsc = ((tropAsc - ramanAya) % 360 + 360) % 360;
    const kpAsc = ((tropAsc - kpAya) % 360 + 360) % 360;
    const lahiriAscSign = Math.floor(ascLong / 30);
    const ramanAscSign = Math.floor(ramanAsc / 30);
    const kpAscSign = Math.floor(kpAsc / 30);

    planetRows.push({
      id: -1,
      name: locale === 'hi' ? 'लग्न' : 'Lagna',
      positions: { lahiri: ascLong, raman: ramanAsc, krishnamurti: kpAsc },
      hasSignChange: lahiriAscSign !== ramanAscSign || lahiriAscSign !== kpAscSign,
    });

    return {
      planets: planetRows,
      ayanamshaValues: {
        lahiri: lahiriAya,
        raman: ramanAya,
        krishnamurti: kpAya,
      },
    };
  }, [kundali, locale]);

  return (
    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 p-4 sm:p-6">
      <h3 className="text-gold-light text-sm font-bold mb-4 text-center">
        {locale === 'hi' ? 'अयनांश तुलना' : 'Ayanamsha Comparison'}
      </h3>

      {/* Ayanamsha values */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {AYANAMSHA_SYSTEMS.map((sys) => (
          <div key={sys.key} className="text-center p-2 rounded-lg bg-bg-secondary/50 border border-gold-primary/10">
            <div className="text-gold-light text-xs font-bold">{sys.label}</div>
            <div className="text-text-primary text-sm font-mono mt-0.5">
              {rows.ayanamshaValues[sys.key].toFixed(4)}°
            </div>
            <div className="text-text-secondary text-xs mt-0.5 hidden sm:block">{sys.desc}</div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-text-secondary font-medium">
                {locale === 'hi' ? 'ग्रह' : 'Planet'}
              </th>
              <th className="text-center py-2 px-2 text-gold-light font-bold">Lahiri</th>
              <th className="text-center py-2 px-2 text-gold-light font-bold">Raman</th>
              <th className="text-center py-2 px-2 text-gold-light font-bold">KP</th>
            </tr>
          </thead>
          <tbody>
            {rows.planets.map((row) => {
              const lahiri = formatPosition(row.positions.lahiri, locale);
              const raman = formatPosition(row.positions.raman, locale);
              const kp = formatPosition(row.positions.krishnamurti, locale);

              return (
                <tr
                  key={row.id}
                  className={`border-b border-gold-primary/5 ${
                    row.hasSignChange ? 'bg-amber-500/8' : ''
                  } ${row.id === -1 ? 'font-bold' : ''}`}
                >
                  <td className="py-2 px-2 text-text-primary whitespace-nowrap">
                    {row.name}
                    {row.hasSignChange && (
                      <span
                        className="ml-1.5 inline-block w-2 h-2 rounded-full bg-amber-400"
                        title={locale === 'hi'
                          ? 'भिन्न अयनांश में राशि परिवर्तन'
                          : 'Sign changes across ayanamshas'}
                      />
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-text-primary whitespace-nowrap">
                    {lahiri.formatted}
                  </td>
                  <td className={`py-2 px-2 text-center whitespace-nowrap ${
                    raman.signIndex !== lahiri.signIndex ? 'text-amber-300' : 'text-text-primary'
                  }`}>
                    {raman.formatted}
                  </td>
                  <td className={`py-2 px-2 text-center whitespace-nowrap ${
                    kp.signIndex !== lahiri.signIndex ? 'text-amber-300' : 'text-text-primary'
                  }`}>
                    {kp.formatted}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 justify-center">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-text-secondary text-xs">
          {locale === 'hi'
            ? 'एम्बर = इस अयनांश में राशि भिन्न है'
            : 'Amber = sign differs from Lahiri in this ayanamsha'}
        </span>
      </div>

      <p className="text-text-secondary/60 text-xs text-center mt-3">
        {locale === 'hi'
          ? 'राशि सन्धि पर स्थित ग्रह अयनांश के अनुसार राशि बदल सकते हैं। अधिकांश ज्योतिषी लाहिरी का प्रयोग करते हैं।'
          : 'Planets near sign boundaries may shift signs depending on the ayanamsha. Most Vedic astrologers use Lahiri (Chitrapaksha). KP practitioners use Krishnamurti. B.V. Raman\'s system is popular in South India.'}
      </p>
    </div>
  );
}
