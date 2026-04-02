import type { PujaVidhi } from '../types';
import { SURYA_SHANTI } from './surya';
import { CHANDRA_SHANTI } from './chandra';
import { MANGAL_SHANTI } from './mangal';
import { BUDHA_SHANTI } from './budha';
import { GURU_SHANTI } from './guru';
import { SHUKRA_SHANTI } from './shukra';
import { SHANI_SHANTI } from './shani';
import { RAHU_SHANTI } from './rahu';
import { KETU_SHANTI } from './ketu';

export const GRAHA_SHANTI_VIDHIS: Record<string, PujaVidhi> = {
  'graha-shanti-surya': SURYA_SHANTI,
  'graha-shanti-chandra': CHANDRA_SHANTI,
  'graha-shanti-mangal': MANGAL_SHANTI,
  'graha-shanti-budha': BUDHA_SHANTI,
  'graha-shanti-guru': GURU_SHANTI,
  'graha-shanti-shukra': SHUKRA_SHANTI,
  'graha-shanti-shani': SHANI_SHANTI,
  'graha-shanti-rahu': RAHU_SHANTI,
  'graha-shanti-ketu': KETU_SHANTI,
};

export const PLANET_TO_SHANTI: Record<number, string> = {
  0: 'graha-shanti-surya',
  1: 'graha-shanti-chandra',
  2: 'graha-shanti-mangal',
  3: 'graha-shanti-budha',
  4: 'graha-shanti-guru',
  5: 'graha-shanti-shukra',
  6: 'graha-shanti-shani',
  7: 'graha-shanti-rahu',
  8: 'graha-shanti-ketu',
};

export {
  SURYA_SHANTI,
  CHANDRA_SHANTI,
  MANGAL_SHANTI,
  BUDHA_SHANTI,
  GURU_SHANTI,
  SHUKRA_SHANTI,
  SHANI_SHANTI,
  RAHU_SHANTI,
  KETU_SHANTI,
};
