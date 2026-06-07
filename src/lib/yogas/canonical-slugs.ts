/**
 * Canonical yoga slug list — kept in sync with YOGA_DETAIL_DATA keys.
 *
 * Lives in its own file (not yoga-details.ts) so the edge proxy can
 * import the validation set without pulling in the 228KB constant data
 * file. yoga-details.ts is over the Edge Function size budget by
 * itself; importing it from `src/proxy.ts` would blow the 1MB limit
 * documented in the proxy's own doc-comment.
 *
 * Drift guard lives in __tests__/canonical-slugs.test.ts — it asserts
 * this list equals `Object.keys(YOGA_DETAIL_DATA).sort()`. CI will
 * fail any PR that adds a yoga to YOGA_DETAIL_DATA without updating
 * this file, OR vice versa.
 */

export const CANONICAL_YOGA_SLUGS: ReadonlySet<string> = new Set([
  'adhi',
  'akhanda_samrajya',
  'alpayu',
  'amala',
  'amrita_yoga',
  'anapha',
  'angarak',
  'ardha_chandra_nabhasa',
  'arishta_bhanga',
  'badhaka',
  'balarishta',
  'bandhana',
  'bhadra',
  'bhagya_yoga',
  'bharati',
  'bheri',
  'budhaditya',
  'chamara',
  'chandra_grahan',
  'chandra_mangala',
  'chandra_surya',
  'chandradhi',
  'chapa',
  'chaturmukha',
  'chatussagara',
  'damini',
  'daridra',
  'dhana_yoga',
  'dharma_karmadhipati',
  'durdhara',
  'gajakesari',
  'gauri',
  'gola',
  'graha_malika',
  'graha_sanghata',
  'grahan',
  'guru_chandal',
  'guru_lagna',
  'guru_mangal',
  'guru_shukra',
  'hansa',
  'kahala',
  'kala_amrita',
  'kala_sarpa',
  'kalanidhi',
  'kalathra_dosha',
  'kedara',
  'kemadruma',
  'kendradhipati_dosha',
  'ketu_twelfth',
  'kubera',
  'lakshmi',
  'mahabhagya',
  'mahalakshmi',
  'mala_nabhasa',
  'malavya',
  'mangal_dasham',
  'mangala_dosha',
  'mars_saturn',
  'moksha_yoga',
  'neechabhanga_raja',
  'nipuna',
  'obhayachari',
  'papa_kartari',
  'parijata',
  'parvata',
  'pasha',
  'pitra_dosha',
  'pravrajya',
  'pushkala',
  'rahu_third',
  'raja_yoga',
  'rajalakshana',
  'ruchaka',
  'saraswati',
  'sarpa_nabhasa',
  'saubhagya',
  'shakata',
  'shani_dasham',
  'shani_rahu',
  'shankha',
  'shasha',
  'shiva_yoga',
  'shoola_nabhasa',
  'shrapit_dosha',
  'shrinatha',
  'shubha_kartari',
  'shukra_shani',
  'sun_saturn',
  'sunapha',
  'surya_dasham',
  'surya_grahan',
  'tapasvi',
  'tri_vakri',
  'vanchana_chora_bheeti',
  'varchasvi',
  'vargottama_lagna',
  'vasi',
  'vasumati',
  'veena',
  'venus_7th',
  'veshi',
  'viparita_raja',
  'yuga',
]);

/**
 * Resolve a possibly-hyphenated, possibly-uppercased slug to its
 * canonical underscore_lowercase key in CANONICAL_YOGA_SLUGS, or null
 * if no canonical match exists.
 *
 * Mirror of the resolver historically inline in
 * src/app/[locale]/learn/yoga/[slug]/layout.tsx. Extracted so the
 * proxy can validate at the network boundary BEFORE the request hits
 * ISR (where Next 16 turns `notFound()` into HTTP 200 — the soft-404
 * bug GSC flagged 2026-05-28/29 for /learn/yoga/lagna_mallika).
 *
 * Pre-condition: caller has lowercased `slug`. Layout.tsx and proxy
 * both lowercase before invoking — keeping the helper itself pure
 * (no implicit case-folding) means a future caller can detect
 * uppercase-only mismatches for the 308-canonicalisation flow.
 */
export function resolveCanonicalYogaSlug(normalizedSlug: string): string | null {
  if (CANONICAL_YOGA_SLUGS.has(normalizedSlug)) return normalizedSlug;
  if (!normalizedSlug.includes('-')) return null;
  const stripped = normalizedSlug.replace(/-/g, '');
  if (CANONICAL_YOGA_SLUGS.has(stripped)) return stripped;
  const underscored = normalizedSlug.replace(/-/g, '_');
  if (CANONICAL_YOGA_SLUGS.has(underscored)) return underscored;
  return null;
}
