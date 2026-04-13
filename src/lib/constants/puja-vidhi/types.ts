import type { LocaleText } from '@/types/panchang';
export type { LocaleText as Trilingual };

export interface SamagriItem {
  name: LocaleText;
  quantity?: string;
  note?: LocaleText;
  category?: 'flowers' | 'food' | 'puja_items' | 'clothing' | 'vessels' | 'other';
  essential?: boolean;
  substitutions?: { item: LocaleText; note: LocaleText }[];
  prepNote?: LocaleText;
}

export interface VidhiStep {
  step: number;
  title: LocaleText;
  description: LocaleText;
  mantraRef?: string;       // ID linking to MantraDetail
  duration?: string;
  essential?: boolean;
  stepType?: 'preparation' | 'invocation' | 'offering' | 'mantra' | 'meditation' | 'conclusion';
}

export interface MantraDetail {
  id: string;
  name: LocaleText;
  devanagari: string;       // Full mantra in Devanagari
  iast: string;             // IAST romanization with diacritics
  meaning: LocaleText;
  japaCount?: number;
  usage: LocaleText;
}

export interface StotraReference {
  name: LocaleText;
  text?: string;            // Full Devanagari text if short
  verseCount?: number;
  duration?: string;
  note?: LocaleText;
}

export interface AartiText {
  name: LocaleText;
  devanagari: string;
  iast: string;
}

export interface ParanaRule {
  type: 'sunrise_plus_quarter' | 'moonrise' | 'next_sunrise' | 'tithi_end';
  description: LocaleText;
}

export type MuhurtaWindowType = 'madhyahna' | 'aparahna' | 'pradosh' | 'nishita' | 'brahma_muhurta' | 'abhijit';

export interface PujaVidhi {
  festivalSlug: string;
  category: 'festival' | 'vrat' | 'graha_shanti';    // Key distinction: festival vs vrat vs graha shanti
  deity: LocaleText;

  samagri: SamagriItem[];

  muhurtaType: 'computed' | 'fixed';
  muhurtaDescription: LocaleText;
  muhurtaWindow?: { type: MuhurtaWindowType };

  sankalpa: LocaleText;
  vidhiSteps: VidhiStep[];

  mantras: MantraDetail[];
  stotras?: StotraReference[];
  aarti?: AartiText;

  naivedya: LocaleText;
  precautions: LocaleText[];
  phala: LocaleText;
  visarjan?: LocaleText;
  parana?: ParanaRule;
}
