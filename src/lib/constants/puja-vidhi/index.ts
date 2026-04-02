import type { PujaVidhi } from './types';
import { GANESH_CHATURTHI_PUJA } from './ganesh-chaturthi';
import { DIWALI_PUJA } from './diwali';
import { MAHA_SHIVARATRI_PUJA } from './maha-shivaratri';

export const PUJA_VIDHIS: Record<string, PujaVidhi> = {
  'ganesh-chaturthi': GANESH_CHATURTHI_PUJA,
  'diwali': DIWALI_PUJA,
  'maha-shivaratri': MAHA_SHIVARATRI_PUJA,
};

export function getPujaVidhiBySlug(slug: string): PujaVidhi | undefined {
  return PUJA_VIDHIS[slug];
}

export type { PujaVidhi, MantraDetail, VidhiStep, SamagriItem, AartiText, StotraReference } from './types';
