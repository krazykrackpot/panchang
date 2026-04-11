import { createContributionOG, OG_SIZE } from '../og-helper';

export const runtime = 'edge';
export const alt = '"Sine" is a Sanskrit Word — Indian Contributions to Mathematics';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createContributionOG(
    '"SINE" IS A SANSKRIT WORD',
    'Jya → Jiba → Sinus → Sine'
  );
}
