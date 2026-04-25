'use client';

import React from 'react';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { Locale, LocaleText } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { GrahaIconById } from '@/components/icons/GrahaIcons';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const PLANET_LABELS: Record<number, LocaleText> = {
  0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' },
  1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંদ્ર' },
  2: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' },
  3: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' },
  5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' },
  6: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનਿ' },
};

const STHANA_ROWS: { key: keyof ShadBalaComplete['sthanaBreakdown']; label: LocaleText }[] = [
  { key: 'ucchaBala',          label: { en: 'Uccha Bala',          hi: 'उच्च बल',         sa: 'उच्चबलम्',       mai: 'उच्च बल',       mr: 'उच्च बल',       ta: 'உச்ச பலம்',    te: 'ఉచ్చ బలం',   bn: 'উচ্চ বল',   kn: 'ಉಚ್ಚ ಬಲ',   gu: 'ઉચ્ચ બળ' } },
  { key: 'saptavargaja',       label: { en: 'Saptavargaja',        hi: 'सप्तवर्गज',       sa: 'सप्तवर्गजम्',    mai: 'सप्तवर्गज',     mr: 'सप्तवर्गज',     ta: 'சப்தவர்கஜ',   te: 'సప్తవర్గజ',  bn: 'সপ্তবর্গজ', kn: 'ಸಪ್ತವರ್ಗಜ', gu: 'સપ્તવર્ગજ' } },
  { key: 'ojhayugmaRashi',     label: { en: 'Ojha-Yugma Rashi',    hi: 'ओज-युग्म राशि',  sa: 'ओजयुग्मराशि',    mai: 'ओज-युग्म राशि', mr: 'ओज-युग्म राशि', ta: 'ஓஜ-யுக்ம ராசி', te: 'ఓజ-యుగ్మ రాశి', bn: 'ওজ-যুগ্ম রাশি', kn: 'ಓಜ-ಯುಗ್ಮ ರಾಶಿ', gu: 'ઓજ-યુગ્મ રાશિ' } },
  { key: 'ojhayugmaNavamsha',  label: { en: 'Ojha-Yugma Navamsha', hi: 'ओज-युग्म नवांश',  sa: 'ओजयुग्मनवांश',   mai: 'ओज-युग्म नवांश', mr: 'ओज-युग्म नवांश', ta: 'ஓஜ-யுக்ம நவாம்ச', te: 'ఓజ-యుగ్మ నవాంశ', bn: 'ওজ-যুগ্ম নবাংশ', kn: 'ಓಜ-ಯುಗ್ಮ ನವಾಂಶ', gu: 'ઓજ-યુગ્મ નવાંશ' } },
  { key: 'kendradiBala',       label: { en: 'Kendradi Bala',       hi: 'केंद्रादि बल',   sa: 'केन्द्रादिबलम्', mai: 'केंद्रादि बल',  mr: 'केंद्रादि बल',  ta: 'கேந்திராதி பலம்', te: 'కేంద్రాది బలం', bn: 'কেন্দ্রাদি বল', kn: 'ಕೇಂದ್ರಾದಿ ಬಲ', gu: 'કેન્દ્રાદિ બળ' } },
  { key: 'drekkanaBala',       label: { en: 'Drekkana Bala',       hi: 'द्रेष्काण बल',   sa: 'द्रेष्काणबलम्',  mai: 'द्रेष्काण बल',  mr: 'द्रेष्काण बल',  ta: 'த்ரேக்காண பலம்', te: 'ద్రేక్కాణ బలం', bn: 'দ্রেষ্কাণ বল', kn: 'ದ್ರೇಕ್ಕಾಣ ಬಲ', gu: 'ડ્રેક્કાણ બળ' } },
];

const KALA_ROWS: { key: keyof ShadBalaComplete['kalaBreakdown']; label: LocaleText }[] = [
  { key: 'natonnataBala', label: { en: 'Natonnata Bala',  hi: 'नतोन्नत बल',   sa: 'नतोन्नतबलम्',   mai: 'नतोन्नत बल',  mr: 'नतोन्नत बल',   ta: 'நதோந்நத பலம்',  te: 'నతోన్నత బలం',  bn: 'নতোন্নত বল',  kn: 'ನತೋನ್ನತ ಬಲ',  gu: 'નતોન્નત બળ' } },
  { key: 'pakshaBala',    label: { en: 'Paksha Bala',     hi: 'पक्ष बल',      sa: 'पक्षबलम्',      mai: 'पक्ष बल',     mr: 'पक्ष बल',      ta: 'பக்ஷ பலம்',     te: 'పక్ష బలం',     bn: 'পক্ষ বল',     kn: 'ಪಕ್ಷ ಬಲ',     gu: 'પક્ષ બળ' } },
  { key: 'tribhagaBala',  label: { en: 'Tribhaga Bala',   hi: 'त्रिभाग बल',   sa: 'त्रिभागबलम्',   mai: 'त्रिभाग बल',  mr: 'त्रिभाग बल',   ta: 'திரிபாக பலம்',  te: 'త్రిభాగ బలం',  bn: 'ত্রিভাগ বল',  kn: 'ತ್ರಿಭಾಗ ಬಲ',  gu: 'ત્રિભાગ બળ' } },
  { key: 'abdaBala',      label: { en: 'Abda Bala',       hi: 'अब्द बल',      sa: 'अब्दबलम्',      mai: 'अब्द बल',     mr: 'अब्द बल',      ta: 'அப்த பலம்',     te: 'అబ్ద బలం',     bn: 'অব্দ বল',     kn: 'ಅಬ್ದ ಬಲ',     gu: 'અ઼બ્દ બળ' } },
  { key: 'masaBala',      label: { en: 'Masa Bala',        hi: 'मास बल',       sa: 'मासबलम्',       mai: 'मास बल',      mr: 'मास बल',       ta: 'மாஸ பலம்',      te: 'మాస బలం',      bn: 'মাস বল',      kn: 'ಮಾಸ ಬಲ',      gu: 'માસ બળ' } },
  { key: 'varaBala',      label: { en: 'Vara Bala',        hi: 'वार बल',       sa: 'वारबलम्',       mai: 'वार बल',      mr: 'वार बल',       ta: 'வார பலம்',      te: 'వార బలం',      bn: 'বার বল',      kn: 'ವಾರ ಬಲ',      gu: 'વાર બળ' } },
  { key: 'horaBala',      label: { en: 'Hora Bala',        hi: 'होरा बल',      sa: 'होराबलम्',      mai: 'होरा बल',     mr: 'होरा बल',      ta: 'ஹோரா பலம்',     te: 'హోరా బలం',     bn: 'হোরা বল',     kn: 'ಹೋರಾ ಬಲ',     gu: 'હોરા બળ' } },
  { key: 'ayanaBala',     label: { en: 'Ayana Bala',       hi: 'अयन बल',       sa: 'अयनबलम्',       mai: 'अयन बल',      mr: 'अयन बल',       ta: 'அயன பலம்',      te: 'అయన బలం',      bn: 'অয়ন বল',     kn: 'ಅಯನ ಬಲ',      gu: 'અયન બળ' } },
  { key: 'yuddhaBala',    label: { en: 'Yuddha Bala',      hi: 'युद्ध बल',     sa: 'युद्धबलम्',     mai: 'युद्ध बल',    mr: 'युद्ध बल',     ta: 'யுத்த பலம்',    te: 'యుద్ధ బలం',    bn: 'যুদ্ধ বল',   kn: 'ಯುದ್ಧ ಬಲ',   gu: 'યુદ્ધ બળ' } },
];

const OTHER_AXIS_LABELS: Record<string, LocaleText> = {
  digBala:        { en: 'Dig Bala',        hi: 'दिग्बल',       sa: 'दिग्बलम्',     mai: 'दिग बल',      mr: 'दिग्बल',       ta: 'திக்பலம்',     te: 'దిక్ బలం',    bn: 'দিকবল',      kn: 'ದಿಕ್ ಬಲ',     gu: 'દિગ્બળ' },
  cheshtaBala:    { en: 'Cheshta Bala',    hi: 'चेष्टाबल',     sa: 'चेष्टाबलम्',   mai: 'चेष्टा बल',   mr: 'चेष्टा बल',    ta: 'சேஷ்டா பலம்', te: 'చేష్ట బలం',   bn: 'চেষ্টা বল',  kn: 'ಚೇಷ್ಟಾ ಬಲ',  gu: 'ચેષ્ટા બળ' },
  naisargikaBala: { en: 'Naisargika Bala', hi: 'नैसर्गिक बल',  sa: 'नैसर्गिकबलम्', mai: 'नैसर्गिक बल', mr: 'नैसर्गिक बल',  ta: 'நைசர்கிக பலம்', te: 'నైసర్గిక బలం', bn: 'নৈসর্গিক বল', kn: 'ನೈಸರ್ಗಿಕ ಬಲ', gu: 'નૈસર્ગિક બળ' },
  drikBala:       { en: 'Drik Bala',       hi: 'दृक्बल',       sa: 'दृक्बलम्',     mai: 'दृक बल',      mr: 'दृक्बल',       ta: 'திருஷ்டி பலம்', te: 'దృక్ బలం',   bn: 'দৃক্ বল',    kn: 'ದೃಕ್ ಬಲ',     gu: 'દૃક્ બળ' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number): string {
  return n.toFixed(2);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PlanetHeader({ planets, locale }: { planets: ShadBalaComplete[]; locale: Locale }) {
  return (
    <>
      <th className="py-2 px-2 text-left text-xs text-text-secondary font-normal w-32" />
      {planets.map(p => (
        <th key={p.planetId} className="py-2 px-2 text-center">
          <div className="flex flex-col items-center gap-0.5">
            <GrahaIconById id={p.planetId} size={18} />
            <span className="text-[10px] text-gold-light">{tl(PLANET_LABELS[p.planetId], locale)}</span>
          </div>
        </th>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface ShadbalaRadarDetailProps {
  selectedAxis: string;
  shadbala: ShadBalaComplete[];
  locale: Locale;
}

export default function ShadbalaRadarDetail({ selectedAxis, shadbala, locale }: ShadbalaRadarDetailProps) {
  const cardClass =
    'rounded-xl border border-[#8a6d2b]/30 bg-gradient-to-b from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4 overflow-x-auto';

  if (selectedAxis === 'sthanaBala') {
    return (
      <div className={cardClass}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#8a6d2b]/20">
              <PlanetHeader planets={shadbala} locale={locale} />
            </tr>
          </thead>
          <tbody>
            {STHANA_ROWS.map(row => (
              <tr key={row.key} className="border-b border-[#8a6d2b]/10 hover:bg-[#8a6d2b]/5 transition-colors">
                <td className="py-1.5 px-2 text-text-secondary whitespace-nowrap">
                  {tl(row.label, locale)}
                </td>
                {shadbala.map(p => (
                  <td key={p.planetId} className="py-1.5 px-2 text-center text-text-primary tabular-nums">
                    {fmt(p.sthanaBreakdown[row.key])}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total row */}
            <tr className="border-t border-[#8a6d2b]/30 font-semibold">
              <td className="py-1.5 px-2 text-gold-light">
                {locale === 'hi' || locale === 'sa' ? 'कुल' : 'Total'}
              </td>
              {shadbala.map(p => (
                <td key={p.planetId} className="py-1.5 px-2 text-center text-gold-light tabular-nums">
                  {fmt(p.sthanaBala)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (selectedAxis === 'kalaBala') {
    return (
      <div className={cardClass}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#8a6d2b]/20">
              <PlanetHeader planets={shadbala} locale={locale} />
            </tr>
          </thead>
          <tbody>
            {KALA_ROWS.map(row => (
              <tr key={row.key} className="border-b border-[#8a6d2b]/10 hover:bg-[#8a6d2b]/5 transition-colors">
                <td className="py-1.5 px-2 text-text-secondary whitespace-nowrap">
                  {tl(row.label, locale)}
                </td>
                {shadbala.map(p => (
                  <td key={p.planetId} className="py-1.5 px-2 text-center text-text-primary tabular-nums">
                    {fmt(p.kalaBreakdown[row.key])}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total row */}
            <tr className="border-t border-[#8a6d2b]/30 font-semibold">
              <td className="py-1.5 px-2 text-gold-light">
                {locale === 'hi' || locale === 'sa' ? 'कुल' : 'Total'}
              </td>
              {shadbala.map(p => (
                <td key={p.planetId} className="py-1.5 px-2 text-center text-gold-light tabular-nums">
                  {fmt(p.kalaBala)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Other axes — horizontal flex with raw values per planet
  const axisLabel = tl(OTHER_AXIS_LABELS[selectedAxis] ?? { en: selectedAxis }, locale);

  return (
    <div className={cardClass}>
      <p className="text-xs text-text-secondary mb-3">{axisLabel}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {shadbala.map(p => {
          const raw = p[selectedAxis as keyof ShadBalaComplete];
          const value = typeof raw === 'number' ? raw : null;
          return (
            <div
              key={p.planetId}
              className="flex flex-col items-center gap-1 min-w-[56px] p-2 rounded-lg border border-[#8a6d2b]/20 bg-[#8a6d2b]/5"
            >
              <GrahaIconById id={p.planetId} size={20} />
              <span className="text-[10px] text-gold-light">{tl(PLANET_LABELS[p.planetId], locale)}</span>
              <span className="text-xs font-semibold text-text-primary tabular-nums">
                {value !== null ? (value >= 0 ? '' : '') + value.toFixed(2) : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
