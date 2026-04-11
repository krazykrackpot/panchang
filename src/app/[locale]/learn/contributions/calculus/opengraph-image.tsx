import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Calculus — Kerala, 1350 CE';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'CALCULUS \u2014 KERALA, 1350 CE',
    '250 years before Newton'
  );
}
