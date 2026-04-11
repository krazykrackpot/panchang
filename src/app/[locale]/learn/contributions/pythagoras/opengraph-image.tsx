import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Pythagorean Theorem — Baudhayana, 800 BCE';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'PYTHAGOREAN THEOREM \u2014 800 BCE',
    'Baudhayana, 300 years before Pythagoras'
  );
}
