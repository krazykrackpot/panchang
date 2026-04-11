import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Earth Rotates — Aryabhata, 499 CE';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'EARTH ROTATES \u2014 499 CE',
    'Aryabhata, 1000 years before Copernicus'
  );
}
