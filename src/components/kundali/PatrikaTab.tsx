'use client';

import { useRef } from 'react';
import { Download } from 'lucide-react';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import PrintButton from '@/components/ui/PrintButton';
import { generateKundaliPrintHtml } from '@/lib/pdf/kundali-pdf';
import { RASHIS } from '@/lib/constants/rashis';
import type { KundaliData, ChartStyle } from '@/types/kundali';
import type { TippanniContent } from '@/lib/kundali/tippanni-types';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

interface PatrikaTabProps {
  kundali: KundaliData;
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
  tip: TippanniContent | null;
  chartStyle: ChartStyle;
  retrogradeIds: Set<number>;
  combustIds: Set<number>;
}

export default function PatrikaTab({ kundali, locale, isDevanagari, headingFont, tip, chartStyle, retrogradeIds, combustIds }: PatrikaTabProps) {
  const patrikaRef = useRef<HTMLDivElement>(null);

  const bd = kundali.birthData;
  const mahaDashas = kundali.dashas.filter(d => d.level === 'maha');
  const now = new Date();

  // Detect key doshas
  const doshas: { name: { en: string; hi: string }; present: boolean; detail: { en: string; hi: string } }[] = [];

  // Manglik: Mars in 1,2,4,7,8,12
  const mars = kundali.planets.find(p => p.planet.id === 2);
  const isManglik = mars ? [1, 2, 4, 7, 8, 12].includes(mars.house) : false;
  doshas.push({
    name: { en: 'Manglik Dosha', hi: 'मांगलिक दोष' },
    present: isManglik,
    detail: isManglik
      ? { en: `Mars in House ${mars!.house}`, hi: `मंगल भाव ${mars!.house} में` }
      : { en: 'Mars not in 1/2/4/7/8/12', hi: 'मंगल 1/2/4/7/8/12 में नहीं' },
  });

  // Kaal Sarp: all planets between Rahu-Ketu axis
  const rahu = kundali.planets.find(p => p.planet.id === 7);
  const ketu = kundali.planets.find(p => p.planet.id === 8);
  let isKaalSarp = false;
  if (rahu && ketu) {
    const rahuLon = rahu.longitude;
    const ketuLon = ketu.longitude;
    const others = kundali.planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
    const allOnOneSide = others.every(p => {
      const lon = p.longitude;
      if (rahuLon < ketuLon) return lon >= rahuLon && lon <= ketuLon;
      return lon >= rahuLon || lon <= ketuLon;
    });
    const allOnOtherSide = others.every(p => {
      const lon = p.longitude;
      if (ketuLon < rahuLon) return lon >= ketuLon && lon <= rahuLon;
      return lon >= ketuLon || lon <= rahuLon;
    });
    isKaalSarp = allOnOneSide || allOnOtherSide;
  }
  doshas.push({
    name: { en: 'Kaal Sarp Dosha', hi: 'काल सर्प दोष' },
    present: isKaalSarp,
    detail: isKaalSarp
      ? { en: 'All planets hemmed between Rahu-Ketu axis', hi: 'सभी ग्रह राहु-केतु अक्ष के बीच' }
      : { en: 'Not present', hi: 'उपस्थित नहीं' },
  });

  // Ganda Mula
  const moon = kundali.planets.find(p => p.planet.id === 1);
  const gandaMulaNakshatras = [1, 10, 19, 9, 18, 27];
  const isGandaMula = moon ? gandaMulaNakshatras.includes(moon.nakshatra.id) : false;
  doshas.push({
    name: { en: 'Ganda Mula', hi: 'गण्ड मूल' },
    present: isGandaMula,
    detail: isGandaMula
      ? { en: `Moon in ${moon!.nakshatra.name.en}`, hi: `चन्द्र ${moon!.nakshatra.name.hi} में` }
      : { en: 'Moon not in Ganda Mula nakshatra', hi: 'चन्द्र गण्ड मूल नक्षत्र में नहीं' },
  });

  // Sade Sati
  const isSadeSati = kundali.sadeSati?.isActive ?? false;
  doshas.push({
    name: { en: 'Sade Sati', hi: 'साढ़े साती' },
    present: isSadeSati,
    detail: isSadeSati
      ? { en: `Currently active — ${kundali.sadeSati?.currentPhase || 'ongoing'}`, hi: `वर्तमान में सक्रिय — ${kundali.sadeSati?.currentPhase || 'चालू'}` }
      : { en: 'Not currently active', hi: 'वर्तमान में सक्रिय नहीं' },
  });

  return (
    <div className="space-y-6">
      {/* Print/PDF controls */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={async () => {
            const { exportKundaliPDF } = await import('@/lib/export/pdf-kundali');
            exportKundaliPDF(kundali, locale as Locale, tip ?? undefined);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
        <PrintButton
          contentHtml={generateKundaliPrintHtml(kundali, locale as 'en' | 'hi' | 'sa')}
          title={`Patrika — ${bd.name}`}
          label={!isDevanagariLocale(locale) ? 'Print' : 'प्रिंट'}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
        />
      </div>

      {/* Patrika content */}
      <div ref={patrikaRef} className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 space-y-8">

        {/* Header: Swastika + Om + Name + Birth Details */}
        <div className="text-center space-y-3">
          <div className="text-5xl text-red-500" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>卐</div>
          <div className="text-orange-500 text-xl font-bold" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>ॐ श्री गणेशाय नमः॥</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
            {!isDevanagariLocale(locale) ? 'Janma Patrika' : 'जन्म पत्रिका'}
          </h2>

          {/* Name */}
          <p className="text-gold-primary text-xl font-bold" style={headingFont}>{bd.name || (!isDevanagariLocale(locale) ? 'Native' : 'जातक')}</p>

          {/* Birth data grid */}
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
              <span className="text-gold-dark text-right">{!isDevanagariLocale(locale) ? 'Date of Birth' : 'जन्म दिनांक'}</span>
              <span className="text-text-secondary text-left font-mono">{bd.date}</span>
              <span className="text-gold-dark text-right">{!isDevanagariLocale(locale) ? 'Time of Birth' : 'जन्म समय'}</span>
              <span className="text-text-secondary text-left font-mono">{bd.time}</span>
              <span className="text-gold-dark text-right">{!isDevanagariLocale(locale) ? 'Place of Birth' : 'जन्म स्थान'}</span>
              <span className="text-text-secondary text-left">{bd.place || `${bd.lat.toFixed(2)}°N, ${bd.lng.toFixed(2)}°E`}</span>
              <span className="text-gold-dark text-right">{!isDevanagariLocale(locale) ? 'Ayanamsha' : 'अयनांश'}</span>
              <span className="text-text-secondary text-left font-mono">{bd.ayanamsha} ({kundali.ayanamshaValue.toFixed(4)}°)</span>
            </div>
          </div>

          <div className="border-t border-gold-primary/10 my-2" />

          {/* Vedic birth details: Lagna, Rashi, Nakshatra, Tithi, Yoga, Masa */}
          {(() => {
            const moonP = kundali.planets.find(p => p.planet.id === 1);
            const sunP = kundali.planets.find(p => p.planet.id === 0);
            const lagnaR = RASHIS[kundali.ascendant.sign - 1];
            const moonR = moonP ? RASHIS[moonP.sign - 1] : null;
            const sunR = sunP ? RASHIS[sunP.sign - 1] : null;

            // Compute tithi, yoga, masa from julianDay
            const { calculateTithi, calculateYoga, sunLongitude: sunLon, toSidereal: toSid, getMasa, MASA_NAMES } = require('@/lib/ephem/astronomical');
            const { TITHIS } = require('@/lib/constants/tithis');
            const { YOGAS } = require('@/lib/constants/yogas');
            const jd = kundali.julianDay;
            const tR = calculateTithi(jd);
            const tD = TITHIS[tR.number - 1];
            const yN = calculateYoga(jd);
            const yD = YOGAS[yN - 1];
            const sS = toSid(sunLon(jd), jd);
            const mI = getMasa(sS);
            const mD = MASA_NAMES[mI];

            return (
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs">
                  <span><span className="text-text-secondary/70">{!isDevanagariLocale(locale) ? 'Lagna' : 'लग्न'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(lagnaR?.name, locale)} ({kundali.ascendant.degree.toFixed(1)}°)</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{!isDevanagariLocale(locale) ? 'Chandra' : 'चन्द्र'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{moonR?.name[locale] || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{!isDevanagariLocale(locale) ? 'Surya' : 'सूर्य'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{sunR?.name[locale] || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{!isDevanagariLocale(locale) ? 'Nakshatra' : 'नक्षत्र'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{moonP?.nakshatra?.name?.[locale] || '—'} ({!isDevanagariLocale(locale) ? 'Pada' : 'पाद'} {moonP?.pada || '—'})</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{!isDevanagariLocale(locale) ? 'Tithi' : 'तिथि'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tD?.name?.[locale] || '—'} ({tD?.paksha === 'shukla' ? (!isDevanagariLocale(locale) ? 'Shukla' : 'शुक्ल') : (!isDevanagariLocale(locale) ? 'Krishna' : 'कृष्ण')})</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{!isDevanagariLocale(locale) ? 'Yoga' : 'योग'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{yD?.name?.[locale] || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{!isDevanagariLocale(locale) ? 'Masa' : 'मास'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{mD?.[locale] || '—'}</span></span>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* D1 + D9 Charts Side by Side */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider mb-3">
                {!isDevanagariLocale(locale) ? 'D1 — Rashi Chart' : 'D1 — राशि चक्र'}
              </h3>
              <div className="flex justify-center">
                {chartStyle === 'south' ? (
                  <ChartSouth data={kundali.chart} title={!isDevanagariLocale(locale) ? 'D1 Rashi' : 'D1 राशि'} size={280} retrogradeIds={retrogradeIds} combustIds={combustIds} />
                ) : (
                  <ChartNorth data={kundali.chart} title={!isDevanagariLocale(locale) ? 'D1 Rashi' : 'D1 राशि'} size={280} retrogradeIds={retrogradeIds} combustIds={combustIds} />
                )}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider mb-3">
                {!isDevanagariLocale(locale) ? 'D9 — Navamsha Chart' : 'D9 — नवांश चक्र'}
              </h3>
              <div className="flex justify-center">
                {chartStyle === 'south' ? (
                  <ChartSouth data={kundali.navamshaChart} title={!isDevanagariLocale(locale) ? 'D9 Navamsha' : 'D9 नवांश'} size={280} />
                ) : (
                  <ChartNorth data={kundali.navamshaChart} title={!isDevanagariLocale(locale) ? 'D9 Navamsha' : 'D9 नवांश'} size={280} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* Planet Positions Table */}
        <div>
          <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
            {!isDevanagariLocale(locale) ? 'Planet Positions' : 'ग्रह स्थिति'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-gold-dark text-left py-2 px-3 font-semibold">{!isDevanagariLocale(locale) ? 'Planet' : 'ग्रह'}</th>
                  <th className="text-gold-dark text-left py-2 px-3 font-semibold">{!isDevanagariLocale(locale) ? 'Sign' : 'राशि'}</th>
                  <th className="text-gold-dark text-center py-2 px-3 font-semibold">{!isDevanagariLocale(locale) ? 'House' : 'भाव'}</th>
                  <th className="text-gold-dark text-right py-2 px-3 font-semibold">{!isDevanagariLocale(locale) ? 'Degree' : 'अंश'}</th>
                  <th className="text-gold-dark text-left py-2 px-3 font-semibold">{!isDevanagariLocale(locale) ? 'Nakshatra' : 'नक्षत्र'}</th>
                  <th className="text-gold-dark text-center py-2 px-3 font-semibold">{!isDevanagariLocale(locale) ? 'Pada' : 'पाद'}</th>
                  <th className="text-gold-dark text-center py-2 px-3 font-semibold">R</th>
                </tr>
              </thead>
              <tbody>
                {kundali.planets.map((p) => (
                  <tr key={p.planet.id} className="border-b border-gold-primary/5 hover:bg-gold-primary/[0.03]">
                    <td className="py-2 px-3 font-medium" style={{ color: PLANET_COLORS[p.planet.id] || '#d4a853' }}>
                      <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(p.planet.name, locale)}</span>
                    </td>
                    <td className="py-2 px-3 text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {tl(p.signName, locale)}
                    </td>
                    <td className="py-2 px-3 text-text-secondary text-center font-mono">{p.house}</td>
                    <td className="py-2 px-3 text-text-secondary text-right font-mono">{p.degree}</td>
                    <td className="py-2 px-3 text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {tl(p.nakshatra.name, locale)}
                    </td>
                    <td className="py-2 px-3 text-text-secondary text-center font-mono">{p.pada}</td>
                    <td className="py-2 px-3 text-center">
                      {p.isRetrograde ? <span className="text-red-400 font-bold">R</span> : <span className="text-text-secondary/50">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* Vimshottari Dasha Summary */}
        <div>
          <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
            {!isDevanagariLocale(locale) ? 'Vimshottari Maha Dasha' : 'विंशोत्तरी महादशा'}
          </h3>
          <div className="space-y-2">
            {mahaDashas.map((d, i) => {
              const start = new Date(d.startDate);
              const end = new Date(d.endDate);
              const isCurrent = now >= start && now <= end;
              const isPast = now > end;
              return (
                <div key={i} className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${isCurrent ? 'bg-gold-primary/10 border border-gold-primary/30' : 'border border-gold-primary/5'} ${isPast ? 'opacity-40' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-gold-primary animate-pulse' : isPast ? 'bg-text-secondary/30' : 'bg-gold-dark/40'}`} />
                    <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {tl(d.planetName, locale)}
                    </span>
                    {isCurrent && <span className="text-xs text-gold-primary font-bold uppercase tracking-wider">{!isDevanagariLocale(locale) ? 'Current' : 'वर्तमान'}</span>}
                  </div>
                  <span className="text-text-secondary text-xs font-mono">{d.startDate} → {d.endDate}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* Key Doshas */}
        <div>
          <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
            {!isDevanagariLocale(locale) ? 'Key Doshas' : 'प्रमुख दोष'}
          </h3>
          {doshas.some(d => d.present) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doshas.filter(d => d.present).map((dosha, i) => (
              <div key={i} className="rounded-xl p-4 border bg-red-500/5 border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                    {dosha.name[!isDevanagariLocale(locale) ? 'en' : 'hi']}
                  </span>
                </div>
                <p className="text-text-secondary/75 text-xs ml-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {dosha.detail[!isDevanagariLocale(locale) ? 'en' : 'hi']}
                </p>
              </div>
            ))}
          </div>
          ) : (
          <p className="text-emerald-400/70 text-sm text-center py-2">
            {!isDevanagariLocale(locale) ? 'None present' : 'कोई दोष नहीं'}
          </p>
          )}
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-text-secondary/55 text-xs">
            Generated by <span className="text-gold-dark/50">Dekho Panchang</span> — dekhopanchang.com
          </p>
        </div>
      </div>
    </div>
  );
}
