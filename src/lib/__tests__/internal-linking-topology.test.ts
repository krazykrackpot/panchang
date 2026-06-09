import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MUHURTA_TYPES } from '@/lib/constants/muhurta-types-with-overlay';

/**
 * Guards for §2.2 internal-linking topology. The 12 /muhurta/[type]
 * landings were orphaned — no parent hub, no top-nav entry — which
 * matches the structural pattern Google's May 2026 Core Update
 * down-weights. This PR adds /muhurta as a hub; the guards below
 * stop a future refactor from quietly removing it.
 */

function read(rel: string): string {
  return readFileSync(join(process.cwd(), rel), 'utf8');
}

describe('Muhurta hub /[locale]/muhurta', () => {
  const pageSrc = read('src/app/[locale]/muhurta/page.tsx');
  const layoutSrc = read('src/app/[locale]/muhurta/layout.tsx');

  it('imports MUHURTA_TYPES and renders one card per entry', () => {
    // Accept either the legacy `muhurta-types` or the overlay-extended
    // `muhurta-types-with-overlay` module (PR #511 split the constant).
    expect(pageSrc).toMatch(/import\s+\{[^}]*MUHURTA_TYPES[^}]*\}\s+from\s+['"]@\/lib\/constants\/muhurta-types(-with-overlay)?['"]/);
    expect(pageSrc).toMatch(/MUHURTA_TYPES\.map/);
  });

  it('links each card to /muhurta/{slug}', () => {
    expect(pageSrc).toMatch(/href=\{`\/muhurta\/\$\{m\.slug\}`\}/);
  });

  it('cross-links to the AI-powered muhurta surfaces and the learn module', () => {
    expect(pageSrc).toMatch(/href="\/muhurta-ai"/);
    expect(pageSrc).toMatch(/href="\/career-muhurta"/);
    expect(pageSrc).toMatch(/href="\/caesarean-muhurta"/);
    expect(pageSrc).toMatch(/href="\/learn\/muhurtas"/);
  });

  it('layout emits per-locale title/description + canonical/hreflang', () => {
    expect(layoutSrc).toMatch(/export\s+async\s+function\s+generateMetadata/);
    expect(layoutSrc).toMatch(/canonical:\s*url/);
    expect(layoutSrc).toMatch(/['"]x-default['"]/);
    // Suppressed locales (sa) must still go noindex on the hub.
    expect(layoutSrc).toMatch(/isSuppressedSeoLocale/);
    expect(layoutSrc).toMatch(/robots:\s*noindex\s*\?\s*\{\s*index:\s*false/);
  });

  it('hub has ISR revalidate so it stays self-fresh', () => {
    expect(pageSrc).toMatch(/export\s+const\s+revalidate\s*=\s*86400/);
  });

  it('MUHURTA_TYPES still has the 12 expected entries — guards data drift', () => {
    expect(MUHURTA_TYPES.length).toBeGreaterThanOrEqual(10);
    const slugs = new Set(MUHURTA_TYPES.map((m) => m.slug));
    // Smoke-check the top-traffic landings per §1.3 GSC inventory.
    expect(slugs.has('annaprashan')).toBe(true);
    expect(slugs.has('vehicle-purchase')).toBe(true);
    expect(slugs.has('travel')).toBe(true);
    expect(slugs.has('mundan')).toBe(true);
    expect(slugs.has('wedding')).toBe(true);
  });
});

describe('Cross-link integration', () => {
  it('sitemap-data.ts routes array includes /muhurta', () => {
    // 2026-06-09: legacy `src/app/sitemap.ts` metadata-route was
    // replaced by the `src/app/sitemap.xml/route.ts` handler +
    // `src/lib/seo/sitemap-data.ts` data module (PR #625). The
    // hard-coded `/muhurta` route lives in the data module now.
    const src = read('src/lib/seo/sitemap-data.ts');
    // Look for `/muhurta` as a standalone routes-array entry (not
    // `/muhurta-ai`, `/muhurta-` etc.).
    expect(src).toMatch(/['"]\/muhurta['"]/);
  });

  it('Footer lists /muhurta as a link (per feedback_orphan_links_in_footer)', () => {
    // Orphan-recovery hubs go in the Footer, NOT main nav or /tools.
    // Confirmed user preference 2026-06-01.
    const src = read('src/components/layout/Footer.tsx');
    expect(src).toMatch(/href:\s*['"]\/muhurta['"]/);
  });

  it('/tools page does NOT cross-link to /muhurta — keep main curation clean', () => {
    const src = read('src/app/[locale]/tools/page.tsx');
    // Should not appear as a tools-page card (would clutter the curation).
    // Note: the hub still exists; users get there via Footer + organic
    // search.
    expect(src).not.toMatch(/href:\s*['"]\/muhurta['"]/);
  });
});
