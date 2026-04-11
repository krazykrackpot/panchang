import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Fibonacci Was Indian — Indian Contributions to Mathematics';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'FIBONACCI WAS INDIAN',
    'Bharata Muni \u2192 Virahanka \u2192 Hemachandra'
  );
}
