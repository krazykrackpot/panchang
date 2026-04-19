# Feature Spec 09: Hora (Planetary Hours) Calculator

**Tier:** 2 — Strong SEO, 1 day
**Priority:** Deferred
**Status:** Spec Complete

---

## What It Does

Computes which planet rules the current hour using the classical Chaldean order (Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon). Divides day and night into 12 planetary hours each (unequal — day hours expand in summer, contract in winter). Shows a color-coded timeline for the current day.

## Why It Matters

- **High-volume search:** "planetary hours today" gets consistent traffic.
- **Pure computation:** no DB, no auth, no external API. One page, one calculation.
- **Cross-links naturally:** overlays with the existing choghadiya page (choghadiya is the Indian equivalent of planetary hours).
- **Quick win:** 1 day effort, strong SEO return.

---

## Core Concept

1. Compute sunrise and sunset for the user's location/date
2. Day duration = sunset - sunrise → divide into 12 equal parts (day hours)
3. Night duration = next sunrise - sunset → divide into 12 equal parts (night hours)
4. First day hour is ruled by the weekday lord (Sunday = Sun, Monday = Moon, etc.)
5. Subsequent hours follow the Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon

Each hour has a ruling planet → signification:
- Sun hours: authority, leadership, vitality
- Moon hours: emotions, travel, public dealings
- Mars hours: courage, surgery, competition
- Mercury hours: communication, trade, learning
- Jupiter hours: teaching, law, expansion
- Venus hours: arts, love, luxury
- Saturn hours: discipline, construction, agriculture

## Page: `/hora`

- Current hora highlighted with planet glyph and signification
- Full 24-hour timeline with color-coded hora bars
- Location picker (defaults to user's saved location)
- Date picker for planning ahead
- "Best hora for..." quick-reference table (activity → planet → next occurrence today)

## Integration

- Add to **Tools** dropdown in navbar
- Cross-link from choghadiya section on panchang page
- Cross-link from muhurat page

## Learning Page: `/learn/hora`

Topics: Chaldean order origin, why unequal hours (tied to sunrise/sunset), hora vs choghadiya comparison, practical use for daily planning, classical references (Brihat Samhita).

## Effort: ~1 day
