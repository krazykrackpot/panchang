import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = '2000 Years of Indian Science — Timeline';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    '2000 YEARS OF INDIAN SCIENCE',
    '16 discoveries, most attributed to Europeans'
  );
}
