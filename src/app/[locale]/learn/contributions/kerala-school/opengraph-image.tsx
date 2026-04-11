import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Kerala Invented Calculus — Madhava and the Kerala School';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'KERALA INVENTED CALCULUS',
    'Madhava: \u03C0 to 11 decimals, sin/cos series'
  );
}
