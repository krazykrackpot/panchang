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
import { HANUMAN_JAYANTI_PUJA } from './hanuman-jayanti';
import { RAKSHA_BANDHAN_PUJA } from './raksha-bandhan';
import { CHHATH_PUJA } from './chhath-puja';
import { DHANTERAS_PUJA } from './dhanteras';
import { DUSSEHRA_PUJA } from './dussehra';
import { GURU_PURNIMA_PUJA } from './guru-purnima';
import { EKADASHI_PUJA } from './ekadashi';
import { PRADOSHAM_PUJA } from './pradosham';
import { SATYANARAYAN_PUJA } from './satyanarayan';
import { KARVA_CHAUTH_PUJA } from './karva-chauth';
import { NAG_PANCHAMI_PUJA } from './nag-panchami';
import { AMAVASYA_TARPAN_PUJA } from './amavasya-tarpan';
import { MASIK_SHIVARATRI_PUJA } from './masik-shivaratri';
import { SOMVAR_VRAT_PUJA } from './somvar-vrat';
import { MANGALVAR_VRAT_PUJA } from './mangalvar-vrat';
import { SANKASHTI_CHATURTHI_PUJA } from './sankashti-chaturthi';
import { HARTALIKA_TEEJ_PUJA } from './hartalika-teej';
import { VAT_SAVITRI_PUJA } from './vat-savitri';
import { AKSHAYA_TRITIYA_PUJA } from './akshaya-tritiya';
import { TULSI_VIVAH_PUJA } from './tulsi-vivah';
import { AHOI_ASHTAMI_PUJA } from './ahoi-ashtami';
import { GRAHA_SHANTI_VIDHIS } from './graha-shanti';
import { GOVARDHAN_PUJA } from './govardhan-puja';
import { BHAI_DOOJ_PUJA } from './bhai-dooj';
import { BUDDHA_PURNIMA_PUJA } from './buddha-purnima';
import { CHAITRA_NAVRATRI_PUJA } from './chaitra-navratri';
import { DURGA_ASHTAMI_PUJA } from './durga-ashtami';
import { HOLIKA_DAHAN_PUJA } from './holika-dahan';
import { ANANT_CHATURDASHI_PUJA } from './anant-chaturdashi';
import { GURU_NANAK_JAYANTI_PUJA } from './guru-nanak-jayanti';
import { MAHA_NAVAMI_PUJA } from './maha-navami';
import { PURNIMA_VRAT_PUJA } from './purnima-vrat';
import { PONGAL_PUJA } from './pongal';
import { BAISAKHI_PUJA } from './baisakhi';
import { UGADI_PUJA } from './ugadi';
import { BIHU_PUJA } from './bihu';

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
  'hanuman-jayanti': HANUMAN_JAYANTI_PUJA,
  'raksha-bandhan': RAKSHA_BANDHAN_PUJA,
  'chhath-puja': CHHATH_PUJA,
  'dhanteras': DHANTERAS_PUJA,
  'dussehra': DUSSEHRA_PUJA,
  'guru-purnima': GURU_PURNIMA_PUJA,
  'ekadashi': EKADASHI_PUJA,
  'pradosham': PRADOSHAM_PUJA,
  'satyanarayan': SATYANARAYAN_PUJA,
  'karva-chauth': KARVA_CHAUTH_PUJA,
  'nag-panchami': NAG_PANCHAMI_PUJA,
  'amavasya-tarpan': AMAVASYA_TARPAN_PUJA,
  'masik-shivaratri': MASIK_SHIVARATRI_PUJA,
  'somvar-vrat': SOMVAR_VRAT_PUJA,
  'mangalvar-vrat': MANGALVAR_VRAT_PUJA,
  'sankashti-chaturthi': SANKASHTI_CHATURTHI_PUJA,
  'hartalika-teej': HARTALIKA_TEEJ_PUJA,
  'vat-savitri': VAT_SAVITRI_PUJA,
  'akshaya-tritiya': AKSHAYA_TRITIYA_PUJA,
  'tulsi-vivah': TULSI_VIVAH_PUJA,
  'ahoi-ashtami': AHOI_ASHTAMI_PUJA,
  'govardhan-puja': GOVARDHAN_PUJA,
  'bhai-dooj': BHAI_DOOJ_PUJA,
  'buddha-purnima': BUDDHA_PURNIMA_PUJA,
  'chaitra-navratri': CHAITRA_NAVRATRI_PUJA,
  'durga-ashtami': DURGA_ASHTAMI_PUJA,
  'holika-dahan': HOLIKA_DAHAN_PUJA,
  'anant-chaturdashi': ANANT_CHATURDASHI_PUJA,
  'guru-nanak-jayanti': GURU_NANAK_JAYANTI_PUJA,
  'maha-navami': MAHA_NAVAMI_PUJA,
  'purnima-vrat': PURNIMA_VRAT_PUJA,
  'pongal': PONGAL_PUJA,
  'baisakhi': BAISAKHI_PUJA,
  'ugadi': UGADI_PUJA,
  'bihu': BIHU_PUJA,
  ...GRAHA_SHANTI_VIDHIS,
};

export function getPujaVidhiBySlug(slug: string): PujaVidhi | undefined {
  return PUJA_VIDHIS[slug];
}

export type { PujaVidhi, MantraDetail, VidhiStep, SamagriItem, AartiText, StotraReference } from './types';
