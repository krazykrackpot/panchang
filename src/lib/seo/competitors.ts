// Single source of truth for the /vs/* competitor landing pages.
// Used by:
//   - src/components/seo/CompareOthers.tsx (cross-link block on each page)
//   - src/components/layout/Footer.tsx ("Compare" strip — sitewide)
// Adding or renaming a competitor here propagates to both the sitewide
// footer link AND the cross-link rings on the 5 /vs/ pages.

export interface Competitor {
  slug: string;        // /vs/<slug>
  displayName: string; // brand-cased label (e.g. "AstroSage", "mPanchang")
  hiName: string;      // Devanagari rendering
}

export const COMPETITORS: readonly Competitor[] = [
  { slug: 'drik-panchang', displayName: 'Drik Panchang', hiName: 'दृक पंचांग' },
  { slug: 'prokerala',     displayName: 'Prokerala',     hiName: 'प्रोकेरला' },
  { slug: 'astrosage',     displayName: 'AstroSage',     hiName: 'एस्ट्रोसेज' },
  { slug: 'mpanchang',     displayName: 'mPanchang',     hiName: 'एमपंचांग' },
  { slug: 'ganeshaspeaks', displayName: 'GaneshaSpeaks', hiName: 'गणेशास्पीक्स' },
] as const;
