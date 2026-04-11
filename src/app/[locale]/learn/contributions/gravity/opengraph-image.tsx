import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Gravity — Bhaskaracharya, 1150 CE';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'GRAVITY \u2014 1150 CE',
    'Bhaskaracharya, 500 years before Newton'
  );
}
