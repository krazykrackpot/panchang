/**
 * 9-locale labels for the 14 named windows surfaced on BestWindowsCard
 * lane bars: 4 inauspicious yogas, Rahu Kaal, Yamaganda, Gulika,
 * Varjyam, Vishti, Durmuhurta, Visha Ghatika, plus the auspicious set
 * (Brahma Muhurta, Abhijit, Amrit Kalam, Vijaya, Godhuli).
 *
 * EN/HI authored inline; 7 remaining locales come from the Gemini
 * overlay JSON. Read via `tlScript(NAMED_WINDOW_LABELS[id], locale)`.
 */
import type { LocaleText } from '@/types/panchang';
import OVERLAY from '@/lib/constants/named-window-labels-overlay.json';

type OverlayShape = Partial<Record<string, Record<string, string>>>;
const overlay = OVERLAY as OverlayShape;

const AUTHORED: Record<string, { en: string; hi: string }> = {
  vyatipata:      { en: 'Vyatipata',      hi: 'व्यतीपात' },
  vaidhriti:      { en: 'Vaidhriti',      hi: 'वैधृति' },
  rahu_kaal:      { en: 'Rahu Kaal',      hi: 'राहु काल' },
  yamaganda:      { en: 'Yamaganda',      hi: 'यमगण्ड' },
  gulika:         { en: 'Gulika',         hi: 'गुलिक' },
  varjyam:        { en: 'Varjyam',        hi: 'वर्ज्यम्' },
  vishti:         { en: 'Vishti',         hi: 'विष्टि' },
  durmuhurta:     { en: 'Durmuhurta',     hi: 'दुर्मुहूर्त' },
  visha_ghatika:  { en: 'Visha Ghatika',  hi: 'विष घटिका' },
  brahma_muhurta: { en: 'Brahma Muhurta', hi: 'ब्रह्म मुहूर्त' },
  abhijit:        { en: 'Abhijit',        hi: 'अभिजित' },
  amrit_kalam:    { en: 'Amrit Kalam',    hi: 'अमृत काल' },
  vijaya:         { en: 'Vijaya',         hi: 'विजय' },
  godhuli:        { en: 'Godhuli',        hi: 'गोधूलि' },
};

function build(key: string): LocaleText {
  const a = AUTHORED[key];
  const out: LocaleText = { en: a.en, hi: a.hi };
  for (const locale of ['mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {
    const v = overlay[locale]?.[key];
    if (v) out[locale] = v;
  }
  return out;
}

export const NAMED_WINDOW_LABELS: Record<string, LocaleText> = (() => {
  const out: Record<string, LocaleText> = {};
  for (const k of Object.keys(AUTHORED)) out[k] = build(k);
  return out;
})();
