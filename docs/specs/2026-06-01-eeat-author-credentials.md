# E-E-A-T: Author bylines, methodology, Person credentials

**Date**: 2026-06-01
**Context**: §2.1 of the May 2026 Core Update recovery plan. Google's core update prioritises Experience-Expertise-Authoritativeness-Trustworthiness signals. Audit + close the gaps that turned us into a "generic templated content" classifier match.

## Audit findings

### ✅ Already in place

| Surface | Status |
|---|---|
| `generatePersonLD()` (Aditya Kumar) | Exists, well-described |
| `generateOrganizationLD()` | Exists, references Person as founder |
| `/about/page.tsx` Person JSON-LD | Emitted |
| `/about/methodology/page.tsx` | Exists |
| `AuthorByline` component | Exists, used on 10+ static pages |
| `generateExpertiseArticleLD()` | author = Person ✓ |

### ❌ Gaps

1. **`generateYogaArticleLD()` author = Organization** (`structured-data.ts:378`). Yoga learn pages would tell Google "this content has no personal author".
2. **`generateArticleLD()` author = Organization** (`article-ld.ts:89`). The general-purpose article schema — used widely.
3. **AuthorByline absent from key dynamic routes**: `/muhurta/[slug]`, `/festivals/[slug]`. These cover annaprashan, hartalika-teej, diwali — top 5 traffic surfaces.
4. **Person LD missing structured credentials**: no `jobTitle`, `hasOccupation`, `alumniOf`, `worksFor`. The description string mentions credentials but Google parses structured properties more reliably.
5. **Person LD `sameAs` is short**: only Twitter + LinkedIn. Wikidata entity (already referenced in Organization at `Q139054863`), GitHub, YouTube would broaden the cross-reference graph Google uses for entity resolution.

### Things to NOT change

- `/about/page.tsx` already renders Person LD — don't duplicate
- AuthorByline is a visible UI element; don't put it on tool/calculator pages where it's UX noise

## This PR

Surgical scope — close the structured-data gaps + extend AuthorByline coverage to the dynamic routes. Methodology page deepening and an editorial pass on `/about` are separate work.

### 1. Article-LD authors → Person

Replace `author: { '@type': 'Organization', name: 'Dekho Panchang' }` with `author: generatePersonLD()` in:
- `src/lib/seo/article-ld.ts` `generateArticleLD()`
- `src/lib/seo/structured-data.ts` `generateYogaArticleLD()`

Keep `publisher` as Organization (that's correct — Person authored, Org published).

### 2. Person LD expansion

Add structured credential properties:

```ts
jobTitle: 'Founder & Editor',
hasOccupation: {
  '@type': 'Occupation',
  name: 'Vedic Astrology Researcher',
  description: 'Building a free Jyotish platform with first-principles astronomical calculations.',
},
worksFor: {
  '@type': 'Organization',
  name: 'Dekho Panchang',
  url: BASE_URL,
},
```

Expand `sameAs`:
```ts
sameAs: [
  'https://twitter.com/dekhopanchang',
  'https://www.linkedin.com/in/adityajha',
  'https://github.com/krazykrackpot',
  'https://www.youtube.com/@DekhoPanchang',
  'https://www.wikidata.org/wiki/Q139054863', // Dekho Panchang entity (also linked from Organization)
].filter(Boolean),
```

### 3. AuthorByline on dynamic routes

- `src/app/[locale]/muhurta/[slug]/page.tsx` — add at the bottom of the page content
- `src/app/[locale]/festivals/[slug]/page.tsx` — add at the bottom of the page content

These are the two highest-impact missing routes per the §1.3 inventory. `/dates/[category]/Client.tsx` already has it.

## Test plan

- Source-level grep: `src/lib/seo/structured-data.ts` + `article-ld.ts` no longer emit `author: { '@type': 'Organization' ...` (except in `publisher` context)
- Validate emitted JSON-LD via Google's [Rich Results test](https://search.google.com/test/rich-results) post-deploy
- E2E spec: muhurta + festival pages render AuthorByline component

## Out of scope (separate work)

- §2.1.2 Methodology page deepening (BPHS/Surya Siddhanta citations with chapter references)
- §2.1.3 About page editorial pass (Aditya's full backstory)
- §2.1.4 Add `Article` LD output to category pages that currently emit only `Tool` LD
- Establishing real backlinks (manual outreach work)

## Open questions for user

1. Real jobTitle preference? "Founder", "Founder & Editor", "Author", "Researcher" — what reads most accurate?
2. `hasOccupation` description — the placeholder above is best-guess. Replace with what you'd write yourself?
3. `alumniOf` — happy to add educational background if you want it in structured data?
