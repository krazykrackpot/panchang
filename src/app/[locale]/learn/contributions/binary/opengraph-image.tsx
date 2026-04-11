import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Binary Code — 200 BCE, India';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'BINARY CODE \u2014 200 BCE',
    'Pingala, 1800 years before computers'
  );
}
