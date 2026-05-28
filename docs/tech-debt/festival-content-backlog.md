# Festival Deep-Dive — Content Backlog

**Filed:** 2026-05-28 (alongside PR #275)
**Status:** Tracked — additive content work, not blocking

The festival deep-dive feature (PRs #265 / #271 / #275) shipped with all UI, engine, and SEO infrastructure complete. A handful of content-only expansion items remain. None block the user-facing experience — the v1 baseline is functional and per-spec acceptance criteria.

---

## 1. Do's & Don'ts: 4+4 → 6+6 expansion (15 festivals)

**Spec target:** §4C — 6 dos + 6 donts per festival
**Shipped:** 5/20 at the 6+6 ideal; 15/20 at the 4+4 baseline.
**Fixture invariant:** `content-data-parity.test.ts` accepts the 4-6 range.
**Backlog size:** ~120 strings (2 dos + 2 donts × 15 festivals × en + hi).

### At 6+6 ideal (done)
- diwali
- dhanteras
- holi
- maha-shivaratri
- ram-navami

### At 4+4 baseline (expansion pending)
- janmashtami
- ganesh-chaturthi
- dussehra
- raksha-bandhan
- narak-chaturdashi
- govardhan-puja
- bhai-dooj
- hanuman-jayanti
- akshaya-tritiya
- guru-purnima
- vasant-panchami
- holika-dahan
- hartalika-teej
- chhath-puja
- makar-sankranti

**Each entry needs**: 2 more `dos` items + 2 more `donts` items, both in `{ en, hi }` form, with optional `source` citation when there's a classical anchor. Pattern: see `src/lib/festivals/observances.ts` Diwali / Holi entries.

---

## 2. Wishes: optional 5 → 7+ expansion

**Spec target:** §4B says "3-5 wishes" — already at the upper end.
**Shipped:** 5/20 at 5 wishes (the spec maximum).
**Backlog:** None required by spec. Adding 1-2 more per festival would deepen the share-pool but is not a fixed target.

---

## 3. Image-card greeting generation (v2)

**Spec §4B explicit deferral:** "Image-card greeting generation is a deliberate v2 follow-up."
**Status:** Not started. Data shape (`FestivalWish`) supports image overlay without modification.
**Approach when picked up:** wrap each wish via the existing `opengraph-image.tsx` pattern, generate a 1200×630 OG card per (slug, wish-index), serve via `/festivals/[slug]/wish-[n]/og.png`.

---

## 4. Translation backfill: 8 active locales

**Spec target:** §7 — `en` and `hi` required; other locales fall back to `en`.
**Shipped:** All 200 wishes + 320-480 observance items have en + hi populated. Other locales (`ta`, `te`, `bn`, `gu`, `kn`, `mai`) currently fall back via `tl()`.
**Backlog:** Incremental translation per locale per festival as traffic justifies. Maithili is the #1 organic-traffic locale per memory, so prioritise `mai` first if attacking this.

---

## 5. Wishes image-share + greeting-card OG (combined with #3)

When #3 lands, the wishes carousel UI gets a "Share as image" button alongside the existing text-only Copy/Share. The component prop shape is forward-compatible.

---

## Pickup order recommendation

1. **Do's & Don'ts expansion (#1)** — biggest visible improvement; pure content writing
2. **Mai translation pass for the existing en+hi content (#4)** — leverages #1's data shape; high traffic ROI
3. **Image-card generation (#3)** — most user-visible "next thing" but requires design + image rendering work
4. **5 → 7+ wishes (#2)** — only if engagement data shows users are sharing through all 5 already

None of these block the existing user experience. The festival deep-dive is shippable and shipped.
