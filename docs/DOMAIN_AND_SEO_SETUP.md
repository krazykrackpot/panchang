# Domain & SEO Configuration

**Last updated:** 2026-04-12

---

## Domain Setup

| Item | Value |
|------|-------|
| Canonical domain | `https://dekhopanchang.com` (no www) |
| DNS provider | Cloudflare (`lennox.ns.cloudflare.com`, `lia.ns.cloudflare.com`) |
| Hosting | Vercel (auto-deploy from `main` branch) |
| www redirect | `www.dekhopanchang.com` → `dekhopanchang.com` (308 Permanent Redirect, configured in Vercel) |
| Vercel subdomain | `panchang-psi.vercel.app` (auto-noindexed by Vercel) |

### DNS Records (Cloudflare)

| Type | Name | Value | Notes |
|------|------|-------|-------|
| ALIAS | `@` | `3f4e1f79d2043263.vercel-dns-017.com` | Root domain → Vercel |
| ALIAS | `*` | `cname.vercel-dns-017.com` | Wildcard → Vercel |
| CAA | `@` | `0 issue "letsencrypt.org"` | SSL certificate authority |
| CAA | `@` | `0 issue "pki.goog"` | SSL certificate authority |
| CAA | `@` | `0 issue "sectigo.com"` | SSL certificate authority |
| TXT | `@` | `google-site-verification=...` | Google Search Console verification |

### Vercel Domain Config

Vercel wants its own nameservers (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`) but we use Cloudflare. This is fine — site works correctly. The "DNS Change Recommended" warning in Vercel dashboard can be ignored.

---

## Google Search Console

| Item | Value |
|------|-------|
| Property type | Domain property (`sc-domain:dekhopanchang.com`) |
| Verification method | DNS TXT record via Cloudflare (auto-configured by Google) |
| Sitemap | `https://dekhopanchang.com/sitemap.xml` |
| Indexed locales | `en`, `hi` only |
| Noindexed locales | `sa`, `ta` (set via `robots.index: false` in layout.tsx metadata) |

### Sitemap

- **Source:** `src/app/sitemap.ts` (dynamic, generated at build time)
- **Locales:** Only `en` and `hi` (sa/ta excluded to prevent duplicate content)
- **URL count:** ~610 URLs
- **Includes:** All pages, puja vidhis (53 slugs), calendar/festival slugs (59), with hreflang alternates

### robots.txt

- **Source:** `public/robots.txt`
- Allows all crawlers to `/`
- Blocks: `/api/`, `/_next/`, `/*/auth/`, `/*/settings/`, `/*/profile/`, `/*/dashboard/`, `/*/embed/`
- Blocks AI bots: GPTBot, ChatGPT-User, CCBot
- Sitemap reference: `https://dekhopanchang.com/sitemap.xml`

---

## SEO Architecture

### Canonical URL Strategy

- All canonical URLs use `https://dekhopanchang.com` (no www)
- Set via `NEXT_PUBLIC_SITE_URL` env var (fallback in code: `https://dekhopanchang.com`)
- `www` 308-redirects to non-www (configured in Vercel Domains)
- Each page's `generateMetadata` sets `alternates.canonical`
- Hreflang tags via `alternates.languages` (en + hi)

### Server-Side Rendering

| Page Type | Rendering | Notes |
|-----------|-----------|-------|
| Legal (privacy, terms) | Server component | Full SSR, no JS |
| Learn contributions (14) | Server component | Converted from client 2026-04-12 |
| Regional calendars (2) | Server component | Tamil, Bengali |
| Web stories | Server component | Google Discover format |
| All other pages | Client component | SSR on first pass (Next.js renders client components server-side), but ships JS bundle |
| Home page widgets | Dynamic import (with SSR) | `ssr: false` removed 2026-04-12 |

### Locale Indexing

| Locale | Indexed | Sitemap | Reason |
|--------|---------|---------|--------|
| `en` (English) | Yes | Yes | Primary, fully translated |
| `hi` (Hindi) | Yes | Yes | Fully translated, major audience |
| `sa` (Sanskrit) | No (`noindex`) | No | Minimal translation, duplicate English content |
| `ta` (Tamil) | No (`noindex`) | No | Partial translation, duplicate English content |

When sa/ta translations are complete, remove the noindex by changing `locale === 'en' || locale === 'hi'` to `true` in `layout.tsx` metadata, and add them back to the sitemap locales array.

### Structured Data

| Type | File | Pages |
|------|------|-------|
| Organization | `src/lib/seo/structured-data.ts` | All (via layout) |
| WebSite | `src/lib/seo/structured-data.ts` | All (via layout) |
| SoftwareApplication | `src/lib/seo/structured-data.ts` | All (via layout) |
| Article + FAQ | `src/lib/seo/contribution-jsonld.ts` | 14 contribution pages |

---

## Google AdSense

See `docs/google-adsense-guide.md` for full AdSense setup, rejection history, and implementation plan.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/layout.tsx` | Metadata, robots, hreflang, structured data |
| `src/app/sitemap.ts` | Dynamic sitemap generation |
| `public/robots.txt` | Crawler directives |
| `public/ads.txt` | AdSense publisher verification |
| `public/manifest.json` | PWA manifest |
| `src/app/[locale]/privacy/page.tsx` | Privacy Policy (server component) |
| `src/app/[locale]/terms/page.tsx` | Terms of Service (server component) |
