import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Speed of Light — 14th Century India';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'SPEED OF LIGHT \u2014 14TH CENTURY',
    'Sayana: 0.14% accuracy'
  );
}
