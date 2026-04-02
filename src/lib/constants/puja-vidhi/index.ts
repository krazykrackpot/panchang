import type { PujaVidhi } from './types';
import { GANESH_CHATURTHI_PUJA } from './ganesh-chaturthi';
import { DIWALI_PUJA } from './diwali';
import { MAHA_SHIVARATRI_PUJA } from './maha-shivaratri';
import { HOLI_PUJA } from './holi';
import { RAM_NAVAMI_PUJA } from './ram-navami';
import { JANMASHTAMI_PUJA } from './janmashtami';
import { NAVARATRI_PUJA } from './navaratri';
import { MAKAR_SANKRANTI_PUJA } from './makar-sankranti';
import { VASANT_PANCHAMI_PUJA } from './vasant-panchami';

export const PUJA_VIDHIS: Record<string, PujaVidhi> = {
  'ganesh-chaturthi': GANESH_CHATURTHI_PUJA,
  'diwali': DIWALI_PUJA,
  'maha-shivaratri': MAHA_SHIVARATRI_PUJA,
  'holi': HOLI_PUJA,
  'ram-navami': RAM_NAVAMI_PUJA,
  'janmashtami': JANMASHTAMI_PUJA,
  'navaratri': NAVARATRI_PUJA,
  'makar-sankranti': MAKAR_SANKRANTI_PUJA,
  'vasant-panchami': VASANT_PANCHAMI_PUJA,
};

export function getPujaVidhiBySlug(slug: string): PujaVidhi | undefined {
  return PUJA_VIDHIS[slug];
}

export type { PujaVidhi, MantraDetail, VidhiStep, SamagriItem, AartiText, StotraReference } from './types';
