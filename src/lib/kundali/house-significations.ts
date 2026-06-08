/**
 * Per-house significations (life areas) + per-house remedy hints.
 *
 * EN/HI authored inline; mai/mr/ta/te/kn/gu/bn filled from Gemini
 * overlay JSON. Consumers read via `tlScript(HOUSE_SIGNIFICATIONS[id].signif, locale)`.
 */
import type { LocaleText } from '@/types/panchang';
import OVERLAY from '@/lib/constants/house-significations-overlay.json';

type Axis = 'signif' | 'remedy';
type OverlayShape = Partial<Record<string, Record<string, string>>>;
const overlay = OVERLAY as OverlayShape;

const AUTHORED_EN: Record<number, Record<Axis, string>> = {
  1:  { signif: 'Self, personality, health, vitality',                remedy: 'Strengthen lagna lord, Sun worship' },
  2:  { signif: 'Wealth, family, speech, food habits',                remedy: 'Donate food, strengthen 2nd lord' },
  3:  { signif: 'Courage, siblings, short travel, efforts',           remedy: 'Mars remedies, regular exercise' },
  4:  { signif: 'Mother, home, vehicles, inner peace',                remedy: 'Moon remedies, serve mother, plant trees' },
  5:  { signif: 'Children, education, intellect, romance',            remedy: 'Jupiter remedies, Saraswati puja' },
  6:  { signif: 'Enemies, disease, debts, daily work',                remedy: 'Mars/Saturn remedies, Hanuman worship' },
  7:  { signif: 'Marriage, partnerships, public dealings',            remedy: 'Venus remedies, Gauri puja for marriage' },
  8:  { signif: 'Longevity, transformation, hidden matters',          remedy: 'Mahamrityunjaya mantra, donate black items on Saturday' },
  9:  { signif: 'Fortune, father, dharma, higher education',          remedy: 'Jupiter remedies, pilgrimage, serve guru' },
  10: { signif: 'Career, reputation, authority, karma',               remedy: 'Sun + Saturn remedies, Shani Stotra' },
  11: { signif: 'Gains, income, elder siblings, desires',             remedy: 'Jupiter remedies, donate on Thursdays' },
  12: { signif: 'Losses, expenses, foreign travel, moksha',           remedy: 'Ketu remedies, meditation, spiritual practice' },
};

function build(houseId: number, axis: Axis): LocaleText {
  const en = AUTHORED_EN[houseId][axis];
  const key = `h${houseId}_${axis}`;
  const out: LocaleText = { en };
  for (const locale of ['hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {
    const v = overlay[locale]?.[key];
    if (v) out[locale] = v;
  }
  return out;
}

export const HOUSE_SIGNIFICATIONS: Record<number, { signif: LocaleText; remedy: LocaleText }> = (() => {
  const out: Record<number, { signif: LocaleText; remedy: LocaleText }> = {};
  for (const id of Object.keys(AUTHORED_EN).map(Number)) {
    out[id] = { signif: build(id, 'signif'), remedy: build(id, 'remedy') };
  }
  return out;
})();
