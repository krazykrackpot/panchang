import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Pi = 3.1416 in 499 CE — Indian Contributions to Mathematics';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    '\u03C0 = 3.1416 IN 499 CE',
    'Aryabhata \u2014 4 decimal accuracy'
  );
}
