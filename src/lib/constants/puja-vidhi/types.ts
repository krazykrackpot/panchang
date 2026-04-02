export interface Trilingual {
  en: string;
  hi: string;
  sa: string;
}

export interface SamagriItem {
  name: Trilingual;
  quantity?: string;
  note?: Trilingual;
}

export interface VidhiStep {
  step: number;
  title: Trilingual;
  description: Trilingual;
  mantraRef?: string;       // ID linking to MantraDetail
  duration?: string;
}

export interface MantraDetail {
  id: string;
  name: Trilingual;
  devanagari: string;       // Full mantra in Devanagari
  iast: string;             // IAST romanization with diacritics
  meaning: Trilingual;
  japaCount?: number;
  usage: Trilingual;
}

export interface StotraReference {
  name: Trilingual;
  text?: string;            // Full Devanagari text if short
  verseCount?: number;
  duration?: string;
  note?: Trilingual;
}

export interface AartiText {
  name: Trilingual;
  devanagari: string;
  iast: string;
}

export interface PujaVidhi {
  festivalSlug: string;
  category: 'festival' | 'vrat';    // Key distinction: festival vs vrat
  deity: Trilingual;

  samagri: SamagriItem[];

  muhurtaType: 'computed' | 'fixed';
  muhurtaDescription: Trilingual;
  muhurtaWindow?: { type: 'madhyahna' | 'aparahna' | 'pradosh' | 'nishita' | 'brahma_muhurta' | 'abhijit' };

  sankalpa: Trilingual;
  vidhiSteps: VidhiStep[];

  mantras: MantraDetail[];
  stotras?: StotraReference[];
  aarti?: AartiText;

  naivedya: Trilingual;
  precautions: Trilingual[];
  phala: Trilingual;
  visarjan?: Trilingual;
}
