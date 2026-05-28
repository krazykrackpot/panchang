/**
 * Cross-link clusters — multi-day festival sequences that should be
 * surfaced together for SEO topical authority + user navigation.
 *
 * Keyed by a stable cluster ID (NOT a festival slug — clusters group
 * multiple festivals).
 *
 * Entries with `comingSoon: true` flag festival slugs that don't have
 * pages yet (most Navratri / Pitru Paksha day-pages). The render layer
 * shows them as non-clickable badges with a "coming soon" indicator,
 * preserving the visual cluster timeline without 404-ing the user.
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4F
 */

import type { FestivalCluster } from './types';

export const FESTIVAL_CLUSTERS: Record<string, FestivalCluster> = {
  // ── 5-Day Diwali sequence ────────────────────────────────────────────────
  // All 5 festivals exist as pages.
  'diwali-sequence': {
    type: 'sequence',
    name: { en: '5-Day Diwali Sequence', hi: 'पञ्च-दिवसीय दीपावली पर्व' },
    description: {
      en: 'The five days of Diwali begin with Dhanteras and end with Bhai Dooj — each day with its own deity, ritual, and astrological focus.',
      hi: 'दीपावली के पाँच दिन धनतेरस से प्रारम्भ होकर भाई दूज तक चलते हैं — प्रत्येक दिन का अपना देवता, अनुष्ठान एवं ज्योतिषीय केन्द्रबिन्दु है।',
    },
    entries: [
      { slug: 'dhanteras' },
      { slug: 'narak-chaturdashi' },
      { slug: 'diwali' },
      { slug: 'govardhan-puja' },
      { slug: 'bhai-dooj' },
    ],
  },

  // ── Holika Dahan + Holi ──────────────────────────────────────────────────
  // Both pages exist.
  'holi-sequence': {
    type: 'sequence',
    name: { en: 'Holika Dahan + Holi', hi: 'होलिका दहन एवं होली' },
    description: {
      en: 'The Phalguna full-moon bonfire (Holika Dahan) and the colour-throwing day after (Holi) are a two-day Mars-driven sequence of release and renewal.',
      hi: 'फाल्गुन पूर्णिमा की होलिका दहन की रात्रि एवं अगले दिन रंगों की होली — मङ्गल-प्रधान विमुक्ति एवं नवीनीकरण का द्वि-दिवसीय क्रम।',
    },
    entries: [
      { slug: 'holika-dahan' },
      { slug: 'holi' },
    ],
  },

  // ── Navratri (9 nights) + Dussehra ───────────────────────────────────────
  // Day pages don't exist yet — marked comingSoon. Dussehra is real.
  'navratri-sequence': {
    type: 'navratri',
    name: { en: 'Navratri (9 Nights) + Dussehra', hi: 'नवरात्रि एवं दशहरा' },
    description: {
      en: 'Nine nights of Devi worship — one form of the Goddess per day — culminating in Vijaya Dashami (Dussehra), the victory of Rama over Ravana.',
      hi: 'नवरात्रि की नौ रात्रियाँ — प्रत्येक दिन देवी के एक रूप का पूजन — तत्पश्चात विजया दशमी (दशहरा), राम की रावण पर विजय।',
    },
    entries: [
      { slug: 'navratri-day-1', comingSoon: true, dayLabel: { en: 'Day 1 — Shailaputri', hi: 'प्रथम दिवस — शैलपुत्री' } },
      { slug: 'navratri-day-2', comingSoon: true, dayLabel: { en: 'Day 2 — Brahmacharini', hi: 'द्वितीय — ब्रह्मचारिणी' } },
      { slug: 'navratri-day-3', comingSoon: true, dayLabel: { en: 'Day 3 — Chandraghanta', hi: 'तृतीय — चन्द्रघण्टा' } },
      { slug: 'navratri-day-4', comingSoon: true, dayLabel: { en: 'Day 4 — Kushmanda', hi: 'चतुर्थ — कूष्माण्डा' } },
      { slug: 'navratri-day-5', comingSoon: true, dayLabel: { en: 'Day 5 — Skandamata', hi: 'पञ्चम — स्कन्दमाता' } },
      { slug: 'navratri-day-6', comingSoon: true, dayLabel: { en: 'Day 6 — Katyayani', hi: 'षष्ठ — कात्यायनी' } },
      { slug: 'navratri-day-7', comingSoon: true, dayLabel: { en: 'Day 7 — Kalaratri', hi: 'सप्तम — कालरात्रि' } },
      { slug: 'navratri-day-8', comingSoon: true, dayLabel: { en: 'Day 8 — Mahagauri (Ashtami)', hi: 'अष्टम — महागौरी' } },
      { slug: 'navratri-day-9', comingSoon: true, dayLabel: { en: 'Day 9 — Siddhidatri (Navami)', hi: 'नवम — सिद्धिदात्री' } },
      { slug: 'dussehra' },
    ],
  },

  // ── Pitru Paksha (15 days of tarpan) ─────────────────────────────────────
  // None of the day pages exist yet — all comingSoon.
  'pitru-paksha-sequence': {
    type: 'pitru-paksha',
    name: { en: 'Pitru Paksha (15 Days of Ancestor Rites)', hi: 'पितृ पक्ष' },
    description: {
      en: 'The dark fortnight of Bhadrapada — fifteen days when tarpan (water offerings) and shraddha (food offerings) are made to the ancestors, each tithi reserved for souls who passed on that day of the month.',
      hi: 'भाद्रपद का कृष्ण पक्ष — पन्द्रह दिनों तक पितरों के निमित्त तर्पण एवं श्राद्ध — प्रत्येक तिथि उन पूर्वजों के लिए जो उस तिथि पर परलोक गमन कर गये।',
    },
    entries: [
      { slug: 'pitru-paksha-day-1',  comingSoon: true, dayLabel: { en: 'Pratipada Shraddha',     hi: 'प्रतिपदा श्राद्ध' } },
      { slug: 'pitru-paksha-day-2',  comingSoon: true, dayLabel: { en: 'Dwitiya Shraddha',       hi: 'द्वितीया श्राद्ध' } },
      { slug: 'pitru-paksha-day-3',  comingSoon: true, dayLabel: { en: 'Tritiya Shraddha',       hi: 'तृतीया श्राद्ध' } },
      { slug: 'pitru-paksha-day-4',  comingSoon: true, dayLabel: { en: 'Chaturthi Shraddha',     hi: 'चतुर्थी श्राद्ध' } },
      { slug: 'pitru-paksha-day-5',  comingSoon: true, dayLabel: { en: 'Panchami Shraddha',      hi: 'पञ्चमी श्राद्ध' } },
      { slug: 'pitru-paksha-day-6',  comingSoon: true, dayLabel: { en: 'Shashthi Shraddha',      hi: 'षष्ठी श्राद्ध' } },
      { slug: 'pitru-paksha-day-7',  comingSoon: true, dayLabel: { en: 'Saptami Shraddha',       hi: 'सप्तमी श्राद्ध' } },
      { slug: 'pitru-paksha-day-8',  comingSoon: true, dayLabel: { en: 'Ashtami Shraddha',       hi: 'अष्टमी श्राद्ध' } },
      { slug: 'pitru-paksha-day-9',  comingSoon: true, dayLabel: { en: 'Navami Shraddha (mātṛnavamī)', hi: 'नवमी श्राद्ध (मातृनवमी)' } },
      { slug: 'pitru-paksha-day-10', comingSoon: true, dayLabel: { en: 'Dashami Shraddha',       hi: 'दशमी श्राद्ध' } },
      { slug: 'pitru-paksha-day-11', comingSoon: true, dayLabel: { en: 'Ekadashi Shraddha',      hi: 'एकादशी श्राद्ध' } },
      { slug: 'pitru-paksha-day-12', comingSoon: true, dayLabel: { en: 'Dwadashi Shraddha',      hi: 'द्वादशी श्राद्ध' } },
      { slug: 'pitru-paksha-day-13', comingSoon: true, dayLabel: { en: 'Trayodashi Shraddha',    hi: 'त्रयोदशी श्राद्ध' } },
      { slug: 'pitru-paksha-day-14', comingSoon: true, dayLabel: { en: 'Chaturdashi Shraddha',   hi: 'चतुर्दशी श्राद्ध' } },
      { slug: 'pitru-paksha-day-15', comingSoon: true, dayLabel: { en: 'Sarva Pitru Amavasya',   hi: 'सर्व पितृ अमावस्या' } },
    ],
  },
};

/**
 * Reverse lookup: given a festival slug, find the cluster it belongs to
 * (if any). Used by the cluster cross-link section on the festival year page.
 */
export function findClusterForFestival(festivalSlug: string): { clusterId: string; cluster: FestivalCluster } | null {
  for (const [clusterId, cluster] of Object.entries(FESTIVAL_CLUSTERS)) {
    if (cluster.entries.some((e) => e.slug === festivalSlug)) {
      return { clusterId, cluster };
    }
  }
  return null;
}
