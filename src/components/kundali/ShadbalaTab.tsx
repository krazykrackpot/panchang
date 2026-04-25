'use client';

import { tl } from '@/lib/utils/trilingual';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { Locale, LocaleText } from '@/types/panchang';
import ShadbalaRadar from './ShadbalaRadar';

export default function ShadbalaTab({ shadbala, locale, isDevanagari, headingFont }: {
  shadbala: ShadBalaComplete[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const PLANET_LABELS: Record<string, LocaleText> = {
    Sun: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' }, Moon: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' },
    Mars: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, Mercury: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
    Jupiter: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' }, Venus: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' },
    Saturn: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' },
  };

  const ROW_LABELS: { key: string; en: string; hi: string }[] = [
    { key: 'rank', en: 'Relative Rank', hi: 'सापेक्ष क्रम' },
    { key: 'sthana', en: 'Sthana Bala', hi: 'स्थान बल' },
    { key: 'disha', en: 'Dig Bala', hi: 'दिग्बल' },
    { key: 'kala', en: 'Kala Bala', hi: 'कालबल' },
    { key: 'chesta', en: 'Chesta Bala', hi: 'चेष्टाबल' },
    { key: 'naisargika', en: 'Naisargika Bala', hi: 'नैसर्गिक बल' },
    { key: 'drishti', en: 'Drik Bala', hi: 'दृक्बल' },
    { key: 'divider1', en: '', hi: '' },
    { key: 'total', en: 'Total Pinda', hi: 'कुल पिण्ड' },
    { key: 'rupas', en: 'Rupas', hi: 'रूप' },
    { key: 'minReq', en: 'Min. Required', hi: 'न्यूनतम' },
    { key: 'ratio', en: 'Strength Ratio', hi: 'बल अनुपात' },
    { key: 'divider2', en: '', hi: '' },
    { key: 'ishta', en: 'Ishta Phala', hi: 'इष्ट फल' },
    { key: 'kashta', en: 'Kashta Phala', hi: 'कष्ट फल' },
  ];

  function getValue(s: ShadBalaComplete, key: string): string {
    switch (key) {
      case 'rank': return String(s.rank);
      case 'sthana': return s.sthanaBala.toFixed(2);
      case 'disha': return s.digBala.toFixed(2);
      case 'kala': return s.kalaBala.toFixed(2);
      case 'chesta': return s.cheshtaBala.toFixed(2);
      case 'naisargika': return s.naisargikaBala.toFixed(2);
      case 'drishti': return (s.drikBala >= 0 ? '+' : '') + s.drikBala.toFixed(2);
      case 'total': return s.totalPinda.toFixed(2);
      case 'rupas': return s.rupas.toFixed(2);
      case 'minReq': return s.minRequired.toFixed(2);
      case 'ratio': return s.strengthRatio.toFixed(4);
      case 'ishta': return s.ishtaPhala.toFixed(2);
      case 'kashta': return s.kashtaPhala.toFixed(2);
      default: return '';
    }
  }

  function getColor(s: ShadBalaComplete, key: string): string {
    if (key === 'ratio') {
      return s.strengthRatio >= 1.5 ? 'text-green-400' : s.strengthRatio >= 1.0 ? 'text-gold-light' : 'text-red-400';
    }
    if (key === 'drishti') return s.drikBala >= 0 ? 'text-green-400' : 'text-red-400';
    if (key === 'rank') return s.rank <= 2 ? 'text-green-400 font-bold' : 'text-text-secondary';
    return 'text-text-secondary';
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Shadbala — Six-Fold Strength' : 'षड्बल — छह प्रकार का बल'}
      </h3>
      <p className="text-text-secondary text-xs text-center max-w-2xl mx-auto" style={bodyFont}>
        {locale === 'en' || isTamil
          ? 'Classical six-component planetary strength calculation. Values in Shashtiamshas (60ths of a Rupa). Strength Ratio above 1.0 indicates adequate strength.'
          : 'शास्त्रीय षड्बल गणना। मान षष्ट्यंशों में। बल अनुपात 1.0 से अधिक पर्याप्त बल दर्शाता है।'}
      </p>

      {/* Strength Radar — interactive spider chart with drill-down */}
      <div className="rounded-xl bg-gradient-to-b from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6">
        <ShadbalaRadar shadbala={shadbala} locale={locale} />
      </div>

      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold-primary/20">
              <th className="text-left py-3 px-2 text-text-secondary text-xs" style={bodyFont}></th>
              {shadbala.map(s => {
                const label = PLANET_LABELS[s.planet] || { en: s.planet, hi: s.planet };
                return (
                  <th key={s.planetId} className="text-center py-3 px-2 min-w-[70px]">
                    <GrahaIconById id={s.planetId} size={20} />
                    <p className="text-gold-light text-xs font-medium mt-1" style={bodyFont}>{tl(label, locale)}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROW_LABELS.map(row => {
              if (row.key.startsWith('divider')) {
                return <tr key={row.key}><td colSpan={8} className="py-1"><div className="border-t border-gold-primary/15" /></td></tr>;
              }
              const isSummary = ['total', 'rupas', 'ratio'].includes(row.key);
              return (
                <tr key={row.key} className={isSummary ? 'bg-gold-primary/5' : 'hover:bg-gold-primary/3'}>
                  <td className={`py-2 px-2 text-xs ${isSummary ? 'text-gold-light font-bold' : 'text-text-secondary'}`} style={bodyFont}>
                    {tl(row, locale)}
                  </td>
                  {shadbala.map(s => (
                    <td key={s.planetId} className={`py-2 px-2 text-center font-mono text-xs ${isSummary ? 'font-bold ' : ''}${getColor(s, row.key)}`}>
                      {getValue(s, row.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
