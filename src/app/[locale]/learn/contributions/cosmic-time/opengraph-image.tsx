import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = '4.32 Billion Years — Hindu Cosmology vs Modern Science';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    '4.32 BILLION YEARS',
    'Hindu cosmology vs modern science: 95% match'
  );
}
