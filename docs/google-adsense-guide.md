# Google AdSense Integration Guide

**Last updated:** 2026-04-12
**Status:** Rejected once (low value content), SEO fixes applied, reapply after Apr 17
**Publisher ID:** `pub-4787764488539456`

---

## AdSense Approval Timeline

| Date | Event |
|------|-------|
| 2026-04-04 | Initial AdSense application submitted |
| 2026-04-11 | Rejected: "Low value content" |
| 2026-04-12 | Root cause analysis + fixes applied (see below) |
| 2026-04-12 | Domain property added to Search Console, sitemap resubmitted |
| 2026-04-17+ | Target reapply date (after Google recrawls) |

### Rejection Root Causes (diagnosed 2026-04-12)

1. **242 of 245 pages were `'use client'`** — Googlebot saw empty shells on initial HTML. Home page used `ssr: false` on key widgets.
2. **No Privacy Policy or Terms of Service pages** — hard AdSense requirement.
3. **Duplicate content across 4 locales** — Sanskrit (sa) and Tamil (ta) pages served identical English body text, creating 1220 URLs with massive duplication.
4. **www vs non-www inconsistency** — both served the site with no redirect. Canonical URLs in sitemap used non-www but Search Console property was www.
5. **Tool pages had zero static content** — forms only, nothing for crawlers to index.

### Fixes Applied (2026-04-12)

| Fix | Impact |
|-----|--------|
| Added `/privacy` and `/terms` pages (server components) | AdSense hard requirement met |
| Added `noindex` for sa/ta locales | Eliminated duplicate content |
| Reduced sitemap from 1220 → 610 URLs (en/hi only) | Focused crawl budget |
| Set up www → non-www 308 redirect (Vercel) | Single canonical domain |
| Replaced all hardcoded `www.dekhopanchang.com` → `dekhopanchang.com` | Consistent canonicals |
| Removed `ssr: false` from home page dynamic imports | Content visible in initial HTML |
| Converted 14 contribution pages to server components | Full SSR for content-heavy pages |
| Added static educational text to sign-calculator, baby-names, vedic-time | Crawler-visible content on tool pages |
| Added Domain property in Google Search Console | Covers www + non-www |
| Requested indexing for 10 key pages | Accelerated recrawl |

### Reapply Checklist

Before reapplying, verify in Search Console:
- [ ] At least 10-15 pages show as "Indexed" in Coverage report
- [ ] Sitemap shows "Success" status (not "Couldn't fetch")
- [ ] No new "Duplicate canonical" issues
- [ ] Privacy + Terms pages are indexed

---

## Current State

### What's Done

| Component | File | Status |
|-----------|------|--------|
| AdSense publisher ID | `ca-pub-4787764488539456` | Registered |
| `ads.txt` | `public/ads.txt` | Live at dekhopanchang.com/ads.txt |
| Google Search Console | `public/googlef2c686aab81d237e.html` | Verified |
| AdSense script loading | `src/app/[locale]/layout.tsx` (line 143) | Lazy-loaded, gated by env var |
| `AdUnit` component | `src/components/ads/AdUnit.tsx` | Built, tier-aware (hides for paid users) |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | `.env.example`, Vercel env | Configured |

### What's NOT Done

| Component | Status | What's Needed |
|-----------|--------|---------------|
| Ad slot IDs | Not created | Create ad units in AdSense dashboard |
| `AdSlot` wrapper component | Not built | Simplifies page-level placement |
| Ad placements on pages | **None wired** | Import `<AdUnit>` on target pages |
| Slot env vars | Not set | `NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD`, etc. |
| Auto ads decision | Not configured | Enable or skip in AdSense dashboard |
| Ad category blocking | Not configured | Block irrelevant categories in dashboard |

---

## Architecture

### How It Works

```
User visits page
  → layout.tsx checks NEXT_PUBLIC_ADSENSE_CLIENT_ID env var
  → If set: loads AdSense script with strategy="lazyOnload"
  → AdUnit component checks subscription tier via useSubscription()
  → If tier === 'free': renders <ins class="adsbygoogle"> tag
  → If tier === 'pro' or 'jyotishi': renders nothing (null)
  → AdSense fills the ad slot via adsbygoogle.push({})
```

### AdUnit Component (`src/components/ads/AdUnit.tsx`)

```typescript
interface AdUnitProps {
  slot?: string;                              // AdSense slot ID
  format?: 'auto' | 'rectangle' | 'horizontal'; // Ad format
  className?: string;                         // Extra CSS classes
}
```

- Returns `null` when: loading, paid user, or no `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- Uses `useRef` to prevent double-push on re-renders
- `data-full-width-responsive="true"` for mobile adaptation

### Script Loading (`layout.tsx`)

```typescript
{process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
  <Script
    async
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
    strategy="lazyOnload"
    crossOrigin="anonymous"
  />
)}
```

- `lazyOnload`: loads after page is interactive — zero impact on LCP/FCP
- Only loads when env var is set — no script on paid users or local dev without key

---

## Ad Placement Plan

### Pages WITH Ads (free tier only)

| Page | Route | Placements |
|------|-------|------------|
| Homepage | `/` | Leaderboard below hero, in-content rectangle |
| Panchang | `/panchang` | Leaderboard, between element cards, footer |
| Calendar | `/calendar` | Leaderboard, between month sections |
| Learn (all) | `/learn/*` | Leaderboard, in-content, footer |
| Festivals/Transits | `/calendar`, `/transits` | Leaderboard, in-content |
| Retrograde | `/retrograde` | In-content rectangle |
| Eclipses | `/grahan` | In-content rectangle |
| About | `/about` | Footer only |
| Deep dives | `/tithi`, `/nakshatra`, etc. | In-content rectangle |

### Pages WITHOUT Ads (never, even free tier)

| Page | Reason |
|------|--------|
| Kundali (`/kundali`) | Conversion funnel — ads hurt upgrade intent |
| Matching (`/matching`) | Conversion funnel |
| Pricing (`/pricing`) | Directly selling — ads are contradictory |
| Profile (`/profile`) | User trust — personal data page |
| Settings (`/settings`) | User trust |
| Auth flows | User trust |
| Dashboard (`/dashboard/*`) | Premium feel even on free tier |
| Sade Sati tool | Interactive tool — ads break flow |
| KP System | Interactive tool |
| Varshaphal | Interactive tool |
| Prashna | Interactive tool |
| Muhurta AI | Interactive tool |

### 3 Standard Slot Types

1. **Leaderboard** (728x90 desktop / responsive mobile)
   - Position: Below page header, above main content
   - Best for: High-traffic content pages (panchang, calendar, learn)

2. **In-content Rectangle** (300x250 or responsive)
   - Position: Between content sections (e.g., between panchang cards)
   - Best for: Long-scroll pages with natural content breaks

3. **Sticky Footer** (320x50 mobile / 728x90 desktop)
   - Position: Bottom of viewport, fixed
   - Must be dismissible (close button)
   - Best for: All eligible pages as a baseline

---

## Environment Variables

```bash
# Required — enables the entire ad system
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4787764488539456

# Per-slot IDs (create these in AdSense dashboard)
NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD=   # 728x90 / responsive
NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE=     # 300x250 / responsive
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=        # 320x50 / responsive
```

All are `NEXT_PUBLIC_` because they render in client-side code. This is safe — AdSense publisher IDs and slot IDs are public by design (visible in page source on any site running AdSense).

---

## Auto Ads vs Manual Placements

### What Are Auto Ads?

Auto Ads is a Google AdSense feature where Google's ML algorithm automatically decides where to place ads on your pages. You enable it with a single toggle in the AdSense dashboard — no code changes needed beyond the base AdSense script (which we already load).

### Why Auto Ads Are Tempting

- Zero code work — flip a switch, ads appear
- Google optimizes placement for revenue
- Fills pages you haven't manually configured
- Tests new placements automatically

### Downsides of Auto Ads

#### 1. Loss of Layout Control
Auto ads inject themselves anywhere Google thinks will earn clicks — between navigation items, inside card grids, splitting content sections. On a dark-themed astrology app with carefully designed card layouts, this creates visual chaos. An ad appearing between Tithi and Nakshatra cards, or splitting a Dasha timeline, destroys the reading flow.

#### 2. CLS (Cumulative Layout Shift) — Core Web Vitals Killer
Auto ads load asynchronously and push content down after the page has rendered. This causes layout shift that directly hurts your CLS score. Google penalizes poor CLS in search rankings. Manual placements reserve space upfront (fixed height containers), so content never jumps.

#### 3. Dark Theme Incompatibility
AdSense ad creatives are designed for white/light backgrounds. On our dark navy (#0a0e27) background, auto-placed ads with white backgrounds create jarring visual contrast. Manual placements let us wrap ads in styled containers with borders/padding that integrate better.

#### 4. Breaks Conversion Funnels
Auto ads don't know which pages are conversion funnels. They'll happily place ads on the Kundali page (where we want users to upgrade), the Pricing page (where we're selling), or inside the auth flow. Manual placement strategy deliberately excludes these pages.

#### 5. Mobile Experience Degradation
Auto ads on mobile are aggressive — full-width interstitials, anchor ads that cover content, and in-feed ads that break scrolling. On a mobile-first audience (India, where most traffic comes from), this drives users away. Manual placements let us choose mobile-appropriate sizes (320x50 footer) and keep the experience clean.

#### 6. Subscription Tier Leakage
Our `AdUnit` component checks `tier !== 'free'` before rendering. Auto ads bypass this entirely — they inject via the global AdSense script, ignoring React component logic. Paid users would see ads they're paying to remove. This is the single biggest technical reason to avoid auto ads.

#### 7. Ad Density Violations
Google has its own ad density policies, but auto ads can still stack multiple ads in a short scroll distance on content-light pages. Our learn pages and deep-dive pages vary in length — some are 500 words, some are 3000. Auto ads don't adapt well to this variance and may over-saturate short pages.

#### 8. Revenue Isn't Actually Better
Google claims auto ads optimize for revenue, but this is optimized across their entire publisher network. For niche sites with specific audiences (Vedic astrology enthusiasts), manually placed ads in contextually relevant positions (e.g., between horoscope sections) typically outperform auto-placed ads because the user is already in the right mindset.

#### 9. Page Speed Impact
Auto ads load additional JavaScript for placement detection, viewability tracking, and dynamic insertion. Manual placements are static `<ins>` tags that load one ad per slot — less JS execution, fewer network requests, faster pages.

#### 10. No A/B Testing Control
With auto ads, you can't A/B test specific placements. With manual placements, you can: try a leaderboard vs no leaderboard on the panchang page and measure both revenue and subscription conversion. Auto ads change on their own schedule.

### Recommendation

**Use manual placements only.** Do NOT enable Auto Ads.

Rationale:
- We have a dark theme that needs careful ad integration
- Subscription tier logic must control ad visibility (auto ads bypass this)
- Conversion funnel pages must stay ad-free
- CLS matters for our SEO traffic
- We have a specific placement plan (3 slots per page, documented above)

If revenue is lower than expected after 3 months, consider enabling auto ads ONLY as a "page-level experiment" for specific high-traffic pages (panchang, calendar) via the AdSense dashboard's page-level controls — never site-wide.

---

## Detailed Next Steps

### Step 1: AdSense Dashboard Configuration (you, manual)

1. Log into [Google AdSense](https://www.google.com/adsense/)
2. Verify site ownership is approved (ads.txt is already live at dekhopanchang.com/ads.txt)
3. **Disable Auto Ads**: Sites → dekhopanchang.com → Auto ads → **OFF**
4. Go to **Ads → By ad unit → Display ads** and create 3 ad units:

| Unit Name | Type | Size Setting | Purpose |
|-----------|------|-------------|---------|
| `panchang-leaderboard` | Display ad | Responsive | Below page headers (728x90 desktop, fluid mobile) |
| `panchang-rectangle` | Display ad | Responsive | Between content sections (300x250 default) |
| `panchang-footer` | Display ad | Responsive | Sticky bottom bar (320x50 mobile, 728x90 desktop) |

5. After creating each unit, copy the **slot ID** (a 10-digit number like `1234567890`)
6. Keep the "Ad code" page open — you'll need the slot IDs for Step 2

### Step 2: Set Environment Variables (you, manual)

Add the slot IDs to Vercel:

```bash
# Run these one at a time
vercel env add NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD    # paste the leaderboard slot ID
vercel env add NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE      # paste the rectangle slot ID
vercel env add NEXT_PUBLIC_ADSENSE_SLOT_FOOTER          # paste the footer slot ID
```

When prompted, select **all environments** (Production, Preview, Development).

Then pull to local:
```bash
vercel env pull
```

Verify `.env.local` now has:
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4787764488539456
NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=XXXXXXXXXX
```

Also update `.env.example` with the new variable names (no values).

### Step 3: Upgrade AdUnit Component (code change)

The current `AdUnit` component needs a few improvements before wiring to pages:

**3a. Support slot env var fallbacks**

Currently the component takes a `slot` prop but has no defaults. Add named slot presets:

```tsx
// src/components/ads/AdUnit.tsx
const SLOT_MAP = {
  leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD,
  rectangle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE,
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER,
} as const;

interface AdUnitProps {
  slot?: string;
  placement?: 'leaderboard' | 'rectangle' | 'footer';  // NEW — uses env var
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}
```

Usage becomes `<AdUnit placement="leaderboard" />` — no slot ID in page code.

**3b. Reserve space to prevent CLS**

Wrap the `<ins>` tag in a container with minimum height so content doesn't jump when the ad loads:

```tsx
const MIN_HEIGHTS = {
  leaderboard: 'min-h-[90px] sm:min-h-[90px]',   // 728x90
  rectangle: 'min-h-[250px]',                       // 300x250
  footer: 'min-h-[50px] sm:min-h-[90px]',          // 320x50 mobile, 728x90 desktop
};
```

**3c. Add a subtle "ad" label**

Google requires ads to not be deceptive. Add a tiny label:

```tsx
<div className="text-[9px] text-text-tertiary/40 text-center mb-0.5">
  Advertisement
</div>
```

**3d. Dark theme wrapper**

Wrap ads in a styled container so they don't look jarring on our dark background:

```tsx
<div className={`ad-container text-center my-6 py-3 rounded-lg
  border border-gold-primary/8 bg-bg-secondary/20 ${className}`}>
```

### Step 4: Wire Ad Placements to Pages (code change)

Add `<AdUnit>` to each target page at the documented insertion points. Detailed per-page plan:

---

#### 4a. Homepage (`src/app/[locale]/page.tsx`)

**2 ad slots:**

| Position | Placement | Where |
|----------|-----------|-------|
| After TodayPanchangWidget, before feature card grid | `leaderboard` | After the dynamic panchang widget section (~line 340) |
| After the Three Pillars section, before footer | `rectangle` | After the 3-pillar grid closes (~line 540) |

```tsx
import AdUnit from '@/components/ads/AdUnit';

// After TodayPanchangWidget
<AdUnit placement="leaderboard" className="max-w-4xl mx-auto my-8" />

// After Three Pillars
<AdUnit placement="rectangle" className="max-w-2xl mx-auto my-12" />
```

---

#### 4b. Panchang Page (`src/app/[locale]/panchang/page.tsx`)

**3 ad slots (highest traffic page):**

| Position | Placement | Where |
|----------|-----------|-------|
| Below page header, above location/date selector | `leaderboard` | After the page title section |
| Between panchang element cards (after ~6th card) | `rectangle` | Natural content break in the card grid |
| After all panchang content, before footer | `footer` | End of main content |

```tsx
// Below header
<AdUnit placement="leaderboard" className="max-w-4xl mx-auto" />

// Between card sections (e.g., after Muhurta section, before Hora)
<AdUnit placement="rectangle" className="max-w-xl mx-auto" />

// Bottom
<AdUnit placement="footer" className="max-w-4xl mx-auto" />
```

---

#### 4c. Calendar Page (`src/app/[locale]/calendar/page.tsx`)

**2 ad slots:**

| Position | Placement | Where |
|----------|-----------|-------|
| After year/month selector, before festival list | `leaderboard` | Between controls and content |
| After festival list, before footer | `rectangle` | End of content |

---

#### 4d. Learn Hub (`src/app/[locale]/learn/page.tsx`)

**2 ad slots:**

| Position | Placement | Where |
|----------|-----------|-------|
| After hero card, before "Choose Your Track" | `leaderboard` | After hero section (~line 188) |
| After track cards, before "Interactive Labs" | `rectangle` | Between sections (~line 231) |

---

#### 4e. Learn Subpages (all pages under `/learn/*`)

**1-2 ad slots each (consistent pattern):**

| Position | Placement | Where |
|----------|-----------|-------|
| After page header/intro | `leaderboard` | Below the title and intro paragraph |
| After ~50% of content | `rectangle` | Natural content break midway through |

There are ~20 learn subpages. Use a consistent pattern: leaderboard after header, rectangle midway.

---

#### 4f. Deep Dive Pages (`/tithi`, `/nakshatra`, `/yoga`, etc.)

**1 ad slot each:**

| Position | Placement | Where |
|----------|-----------|-------|
| Between content sections | `rectangle` | After the overview section, before detailed content |

These are reference pages with moderate traffic. One well-placed rectangle is enough.

---

#### 4g. Retrograde, Eclipses, Transits Pages

**1 ad slot each:**

| Position | Placement | Where |
|----------|-----------|-------|
| Between data and explanation sections | `rectangle` | Natural content break |

---

### Step 5: Ad Category Blocking (you, manual)

In AdSense dashboard → **Blocking controls** → **General categories**:

**Block these categories** (irrelevant or conflicting with our audience):

| Category | Why Block |
|----------|-----------|
| Dating & Personals | Irrelevant, low quality |
| Weight loss / Dietary supplements | Spam-adjacent |
| Get rich quick schemes | Contradicts trust we're building |
| Gambling & Betting | Culturally inappropriate for astrology audience |
| Political ads | Divisive for religious/spiritual audience |
| Alcohol | Culturally sensitive for Hindu audience |
| Tobacco | Same |

**Allow and encourage these categories:**

| Category | Why |
|----------|-----|
| Education & Learning | High relevance, good RPM |
| Books & Literature | Matches our learn/reference pages |
| Finance & Insurance | Good RPM, relevant to astrology users |
| Health & Wellness | Aligns with Ayurveda overlap audience |
| Travel (India/Spiritual) | Pilgrimage, temple tourism |
| Technology | General, high RPM |
| Shopping | Jewelry, gemstones — very relevant to astrology remedies |

### Step 6: Build, Test & Deploy

**6a. Local testing:**
```bash
npx next dev --turbopack
# Open http://localhost:3000/en/panchang
# Verify: ad containers render with "Advertisement" label
# Verify: ad containers have reserved min-height (no CLS)
# Note: actual ads won't fill locally — AdSense only serves on approved domains
```

**6b. Test tier gating:**
```
1. Open incognito → visit /panchang → ad containers should render
2. Log in as Pro user → visit /panchang → ad containers should be GONE
3. Visit /kundali (any tier) → no ads anywhere
4. Visit /pricing (any tier) → no ads anywhere
```

**6c. Run Lighthouse before and after:**
```bash
# Before wiring ads (baseline)
npx next build && npx next start
# Run Lighthouse on /panchang, record CLS score

# After wiring ads
# Run Lighthouse again, compare CLS
# Target: CLS < 0.1 (good), absolutely no > 0.25 (poor)
```

**6d. Build check:**
```bash
npx next build   # Must pass with 0 errors
npx vitest run    # All tests must pass
```

**6e. Deploy:**
```bash
git add -A
git commit -m "feat: wire AdSense placements to free-tier pages"
git push origin main
```

**6f. Production verification:**
```
1. Wait for Vercel deploy to complete (vercel ls)
2. Open dekhopanchang.com/en/panchang in incognito
3. Check: ads load (may take 10-30 min for first fill on new slots)
4. Check: no ads on /kundali, /matching, /pricing
5. Check mobile: ads responsive, no layout breakage
6. Check: paid user sees no ads
```

### Step 7: Monitor & Optimize (ongoing, after 1 week)

**7a. Revenue dashboard:**
- Check AdSense → Reports → daily RPM and earnings
- Track by page: which pages generate most revenue?
- Track by device: mobile vs desktop RPM

**7b. Performance monitoring:**
- Vercel Analytics → check CLS regression on ad pages
- Compare bounce rate before/after ads (Google Analytics)
- Check page load time impact

**7c. Fill rate check:**
- If fill rate < 80%: ads are too niche or blocked categories too aggressive
- If fill rate > 95%: good, all slots being monetized

**7d. Conversion impact:**
- Compare free → Pro upgrade rate before/after ads
- If upgrades increase: ads are creating healthy friction (good)
- If upgrades decrease: ads may be driving users away (reduce placements)

**7e. Iterate after 30 days:**
- Remove underperforming placements (low RPM, high bounce)
- Consider adding placements to high-traffic pages that don't have them
- Test: 2 ads vs 3 ads per page — which earns more without hurting UX?

---

## Implementation Priority Order

Work in this order to get revenue flowing fastest with least risk:

| Priority | Page | Traffic | Ad Slots | Effort |
|----------|------|---------|----------|--------|
| 1 | Panchang | Highest | 3 | Medium |
| 2 | Homepage | High | 2 | Low |
| 3 | Calendar | High | 2 | Low |
| 4 | Learn hub | Medium | 2 | Low |
| 5 | Learn subpages (20) | Medium | 1-2 each | Medium (batch) |
| 6 | Deep dives (10) | Low-Med | 1 each | Low (batch) |
| 7 | Retrograde/Eclipses/Transits | Low | 1 each | Low |

Steps 1-2 (dashboard + env vars) must happen first. Steps 3-4 can be done in one coding session. Steps 5-7 are post-launch monitoring.

---

## Ad Revenue Expectations

For a niche Indian astrology site with 10k-50k monthly pageviews:

| Metric | Estimate |
|--------|----------|
| RPM (revenue per 1000 impressions) | $0.50–$2.00 |
| CTR (click-through rate) | 0.5%–1.5% |
| Monthly revenue (10k views) | $5–$20 |
| Monthly revenue (50k views) | $25–$100 |
| Monthly revenue (100k views) | $50–$200 |

Ad revenue is supplementary — the primary monetization is subscriptions. Ads serve two purposes:
1. Generate some revenue from the large free-tier base
2. Create mild friction that nudges users toward paid tiers (ad-free experience)

The second purpose is often more valuable than the ad revenue itself.

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/components/ads/AdUnit.tsx` | Core ad component (tier-aware) |
| `src/app/[locale]/layout.tsx` | AdSense script loading |
| `public/ads.txt` | Publisher verification |
| `public/googlef2c686aab81d237e.html` | Search Console verification |
| `.env.example` | Env var template |
| `docs/superpowers/specs/2026-03-31-monetization-design.md` | Original monetization spec (Section 7) |
