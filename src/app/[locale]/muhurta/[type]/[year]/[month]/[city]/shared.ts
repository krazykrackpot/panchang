import type { ExtendedActivityId } from '@/types/muhurta-ai';

export const ACTIVITY_SLUGS: Record<string, ExtendedActivityId> = {
  'marriage': 'marriage',
  'griha-pravesh': 'griha_pravesh',
  'mundan': 'mundan',
  'property': 'property',
  'business': 'business',
  'vehicle': 'vehicle',
  'travel': 'travel',
  'education': 'education',
  'gold-purchase': 'gold_purchase',
  'spiritual': 'spiritual_practice',
  'exam': 'exam',
};

export const MONTH_MAP: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
