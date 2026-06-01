import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generatePersonLD } from '../structured-data';

/**
 * Guards for the 2026-06-01 E-E-A-T pass.
 *
 * Two structural invariants:
 *   1. `generatePersonLD()` carries the structured credential properties
 *      Google's classifier reads (jobTitle, hasOccupation, worksFor) plus
 *      a broadened sameAs graph including the Wikidata entity.
 *   2. Every Article-schema generator delegates to `generatePersonLD()`
 *      for `author` — never inlines `{ '@type': 'Organization' }`.
 *      (Publisher remains Organization; that's correct.)
 *
 * The original bug: yoga learn pages + the general Article-LD helper
 * emitted `author: { '@type': 'Organization', name: 'Dekho Panchang' }`,
 * which reads to Google as "templated content without personal
 * authorship" — exactly the signal the May 2026 Core Update demotes.
 */

function read(rel: string): string {
  return readFileSync(join(process.cwd(), rel), 'utf8');
}

describe('generatePersonLD — structured credential properties', () => {
  const person = generatePersonLD() as Record<string, unknown>;

  it('has the canonical author name', () => {
    expect(person.name).toBe('Aditya Kumar');
  });

  it('declares jobTitle (Founder & Editor)', () => {
    expect(person.jobTitle).toBe('Founder & Editor');
  });

  it('declares hasOccupation as Vedic Astrology Researcher', () => {
    const occ = person.hasOccupation as Record<string, unknown>;
    expect(occ['@type']).toBe('Occupation');
    expect(occ.name).toBe('Vedic Astrology Researcher');
    expect(typeof occ.description).toBe('string');
    expect((occ.description as string).length).toBeGreaterThan(20);
  });

  it('links to the publishing Organization via worksFor', () => {
    const wf = person.worksFor as Record<string, unknown>;
    expect(wf['@type']).toBe('Organization');
    expect(wf.name).toBe('Dekho Panchang');
  });

  it('exposes a broadened sameAs graph including Wikidata', () => {
    const sameAs = person.sameAs as string[];
    expect(sameAs).toContain('https://twitter.com/dekhopanchang');
    expect(sameAs).toContain('https://www.linkedin.com/in/adityajha');
    expect(sameAs).toContain('https://github.com/krazykrackpot');
    expect(sameAs).toContain('https://www.youtube.com/@DekhoPanchang');
    expect(sameAs).toContain('https://www.wikidata.org/wiki/Q139054863');
  });

  it('preserves the knowsAbout topic list (canonical Jyotish curriculum)', () => {
    const topics = person.knowsAbout as string[];
    expect(topics).toContain('Vedic Astrology');
    expect(topics).toContain('Brihat Parashara Hora Shastra');
    expect(topics).toContain('Surya Siddhanta');
  });
});

describe('Article-LD generators — author is Person via generatePersonLD (not Organization)', () => {
  // Source-level grep: easier than evaluating each generator because they
  // take options with non-trivial signatures. Asserts the structural
  // invariant directly.
  it('article-ld.ts uses generatePersonLD for author', () => {
    const src = read('src/lib/seo/article-ld.ts');
    expect(src).toMatch(/import\s+\{[^}]*generatePersonLD[^}]*\}\s+from\s+['"]@\/lib\/seo\/structured-data['"]/);
    expect(src).toMatch(/author:\s*generatePersonLD\(\)/);
    // The previous inline Organization author must NOT exist anywhere in
    // this file (publisher Organization is fine — it's named `publisher`).
    expect(src).not.toMatch(/author:\s*\{\s*['"]@type['"]:\s*['"]Organization['"]/);
  });

  it('generateYogaArticleLD (structured-data.ts) uses generatePersonLD for author', () => {
    const src = read('src/lib/seo/structured-data.ts');
    // The yoga article block — sits between generateYogaArticleLD's open
    // brace and its closing return — must reference generatePersonLD.
    const yogaSlice = src.match(/generateYogaArticleLD[\s\S]{0,1500}/)?.[0] ?? '';
    expect(yogaSlice).toMatch(/author:\s*generatePersonLD\(\)/);
    expect(yogaSlice).not.toMatch(/author:\s*\{\s*['"]@type['"]:\s*['"]Organization['"]/);
  });

  it('generateExpertiseArticleLD already used Person — confirm regression guard', () => {
    const src = read('src/lib/seo/structured-data.ts');
    const sliceMatches = src.match(/generateExpertiseArticleLD[\s\S]{0,1500}/g) ?? [];
    // Use the function-definition slice (skip any earlier jsdoc reference).
    const slice = sliceMatches[sliceMatches.length - 1] ?? '';
    expect(slice).toMatch(/['"]@type['"]:\s*['"]Person['"]/);
  });
});

describe('AuthorByline coverage on the dynamic high-traffic routes', () => {
  it('muhurta/[type]/page.tsx imports + renders AuthorByline', () => {
    const src = read('src/app/[locale]/muhurta/[type]/page.tsx');
    expect(src).toMatch(/import\s+AuthorByline\s+from\s+['"]@\/components\/ui\/AuthorByline['"]/);
    expect(src).toMatch(/<AuthorByline\s*\/>/);
  });

  it('festivals/[slug]/[year]/page.tsx imports + renders AuthorByline', () => {
    const src = read('src/app/[locale]/festivals/[slug]/[year]/page.tsx');
    expect(src).toMatch(/import\s+AuthorByline\s+from\s+['"]@\/components\/ui\/AuthorByline['"]/);
    expect(src).toMatch(/<AuthorByline\s*\/>/);
  });
});
