/**
 * Per-planet ritual remedies (gem, mantra, fasting, charity) plus a
 * "why-it-works" explainer string. EN/HI authored; other 7 locales
 * filled from Gemini-translated overlay JSON.
 *
 * Consumers should read via `tlScript(REMEDIES[id].remedy, locale)`.
 */
import type { LocaleText } from '@/types/panchang';
import OVERLAY from '@/lib/constants/planet-remedies-overlay.json';

type RemedyAxis = 'remedy' | 'why';
type OverlayShape = Partial<Record<string, Record<string, string>>>;

const overlay = OVERLAY as OverlayShape;

const AUTHORED_EN: Record<number, Record<RemedyAxis, string>> = {
  0: {
    remedy: 'Offer water to Sun at sunrise, recite Aditya Hridayam, wear Ruby',
    why: 'Ruby resonates with Sun\'s red-spectrum energy, amplifying confidence and vitality. Sunrise water offering aligns you with Sun\'s daily cycle.',
  },
  1: {
    remedy: 'Wear Pearl, Monday fasting, recite Chandra mantra, serve mother',
    why: 'Pearl forms from the ocean under moonlight, carrying lunar energy. Serving mother strengthens Moon\'s signification (nurturing, emotional security).',
  },
  2: {
    remedy: 'Wear Red Coral, Hanuman Chalisa on Tuesday, donate jaggery',
    why: 'Red Coral is formed from living organisms under the sea  –  it carries Mars\'s raw life-force energy. Hanuman embodies Mars\'s courage and protective strength.',
  },
  3: {
    remedy: 'Wear Emerald, recite Vishnu Sahasranama, feed green moong',
    why: 'Emerald\'s green frequency matches Mercury\'s wavelength, enhancing communication and intellect. Green offerings resonate with Mercury\'s color signature.',
  },
  4: {
    remedy: 'Wear Yellow Sapphire, Thursday fasting, recite Guru Stotra',
    why: 'Yellow Sapphire channels Jupiter\'s golden-yellow frequency  –  wisdom, expansion, and prosperity. Thursday (Guruvar) is Jupiter\'s day; fasting purifies its energy channel.',
  },
  5: {
    remedy: 'Wear Diamond/White Sapphire, Friday puja, recite Lakshmi Stotra',
    why: 'Diamond refracts all light frequencies, matching Venus\'s all-embracing aesthetic nature. Lakshmi is Venus\'s presiding deity (beauty, love, prosperity).',
  },
  6: {
    remedy: 'Wear Blue Sapphire (with caution), Saturday charity, feed crows',
    why: 'Blue Sapphire resonates with Saturn\'s deep blue energy  –  discipline and endurance. Feeding crows honors Saturn\'s vahana (vehicle); charity on Saturday earns Saturn\'s grace.',
  },
};

function buildLocaleText(planetId: number, axis: RemedyAxis): LocaleText {
  const en = AUTHORED_EN[planetId][axis];
  const key = `p${planetId}_${axis}`;
  const out: LocaleText = { en };
  for (const locale of ['hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {
    const v = overlay[locale]?.[key];
    if (v) out[locale] = v;
  }
  return out;
}

export const PLANET_REMEDIES: Record<number, { remedy: LocaleText; why: LocaleText }> = (() => {
  const out: Record<number, { remedy: LocaleText; why: LocaleText }> = {};
  for (const id of Object.keys(AUTHORED_EN).map(Number)) {
    out[id] = { remedy: buildLocaleText(id, 'remedy'), why: buildLocaleText(id, 'why') };
  }
  return out;
})();
