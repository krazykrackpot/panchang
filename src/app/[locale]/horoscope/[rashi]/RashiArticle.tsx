// src/app/[locale]/horoscope/[rashi]/RashiArticle.tsx

import { RASHI_EDITORIAL } from '@/lib/horoscope/rashi-editorial';
import { getRashiEditorialExtras } from '@/lib/horoscope/rashi-editorial-extras-with-overlay';
import type { LocaleText } from '@/types/panchang';
import { formatHoroscopeLabel } from '@/lib/content/horoscope-labels';

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

interface Props {
  rashiId: number;
  vedicName: string;
  westernName: string;
  locale: string;
}

// Section labels for the 3 deep-extras (dashaSignificance, transitsPlaybook,
// luckyAndUnlucky) added 2026-06-09 to lift the /horoscope/[rashi]/weekly +
// /monthly routes above the thin-content threshold. Inline rather than
// looked up because they're 3 strings × 9 locales = 27 — small enough.
const EXTRAS_LABELS: Record<string, { dasha: string; transits: string; lucky: string }> = {
  en: { dasha: 'Dasha Significance', transits: 'Transit Playbook', lucky: 'Lucky & Unlucky' },
  hi: { dasha: 'दशा महत्व', transits: 'गोचर मार्गदर्शिका', lucky: 'शुभ-अशुभ' },
  // `sa` retired (HTTP 410) but kept for structural parity with
  // sibling labels on /matching/[pair] + /learn/nakshatra-pada/[slug].
  // Gemini PR #640 cycle-1 MED.
  sa: { dasha: 'दशामहत्त्वम्', transits: 'गोचरमार्गदर्शिका', lucky: 'शुभाशुभम्' },
  mai: { dasha: 'दशाक महत्व', transits: 'गोचर मार्गदर्शिका', lucky: 'शुभ-अशुभ' },
  mr: { dasha: 'दशा महत्त्व', transits: 'गोचर मार्गदर्शक', lucky: 'शुभ-अशुभ' },
  ta: { dasha: 'தசை முக்கியத்துவம்', transits: 'திரிக்கோட்பாடு', lucky: 'அதிர்ஷ்டம் & துரதிர்ஷ்டம்' },
  te: { dasha: 'దశ ప్రాముఖ్యత', transits: 'గోచర మార్గదర్శి', lucky: 'శుభ-అశుభ' },
  bn: { dasha: 'দশার গুরুত্ব', transits: 'গোচর পথপ্রদর্শক', lucky: 'শুভ-অশুভ' },
  gu: { dasha: 'દશા મહત્વ', transits: 'ગોચર માર્ગદર્શિકા', lucky: 'શુભ-અશુભ' },
  kn: { dasha: 'ದಶಾ ಮಹತ್ವ', transits: 'ಗೋಚರ ಮಾರ್ಗದರ್ಶಿ', lucky: 'ಶುಭ-ಅಶುಭ' },
};

export function RashiArticle({ rashiId, vedicName, westernName, locale }: Props) {
  const editorial = RASHI_EDITORIAL[rashiId];
  if (!editorial) return null;

  const h2 = formatHoroscopeLabel('aboutRashiTemplate', locale, {
    NAME: vedicName, WESTERN_NAME: westernName,
  });
  const extras = getRashiEditorialExtras(rashiId);
  const extrasLabels = EXTRAS_LABELS[locale] ?? EXTRAS_LABELS.en;

  return (
    <section className="mt-12 space-y-6 max-w-3xl mx-auto px-4">
      <h2 className="text-xl font-semibold text-gold-light">{h2}</h2>
      <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
        <p>{tl(editorial.personality, locale)}</p>
        <p>{tl(editorial.rulerInfluence, locale)}</p>
        <p>{tl(editorial.elementTraits, locale)}</p>
        <p>{tl(editorial.strengthsWeaknesses, locale)}</p>
        <p>{tl(editorial.compatibility, locale)}</p>
      </div>
      {/* Deep-extras (3 fields × ~80-100 EN words each) — added
          2026-06-09 to lift /horoscope/[rashi]/weekly + monthly above
          the thin-content threshold. Renders gracefully (null) when
          the data is missing for a rashi. */}
      {extras && (
        <div className="space-y-6 mt-8">
          <div>
            <h3 className="text-lg font-semibold text-gold-light mb-2">{extrasLabels.dasha}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {tl(extras.dashaSignificance, locale)}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gold-light mb-2">{extrasLabels.transits}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {tl(extras.transitsPlaybook, locale)}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gold-light mb-2">{extrasLabels.lucky}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {tl(extras.luckyAndUnlucky, locale)}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
