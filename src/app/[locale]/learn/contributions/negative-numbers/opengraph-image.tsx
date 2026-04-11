import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Negative Numbers — India, 628 CE';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'NEGATIVE NUMBERS \u2014 INDIA, 628 CE',
    'Europe said "impossible" for 1000 more years'
  );
}
