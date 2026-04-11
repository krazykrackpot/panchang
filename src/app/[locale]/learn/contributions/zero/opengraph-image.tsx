import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = 'Zero Was Invented in India — Indian Contributions to Mathematics';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    'ZERO WAS INVENTED IN INDIA',
    'Brahmagupta, 628 CE'
  );
}
