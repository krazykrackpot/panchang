# Feature Spec 07: Personalized Daily Panchang Push Notifications

**Tier:** 2 — Strong retention, 2 days
**Priority:** Deferred
**Status:** Spec Complete

---

## What It Does

Enhances the existing push notification cron to deliver chart-aware morning briefings. Instead of generic "today's nakshatra is Rohini," the notification says: "Rohini activates your 10th house — strong for career. Avoid meetings during Rahu Kaal (10:30–12:00)."

## Why It Matters

- **Daily engagement before they open the app.** The "morning briefing" concept as a push notification.
- **Existing infra:** push subscription system, cron routes, panchang computation — all built. This just computes a 2-sentence personalized overlay.
- **Retention multiplier:** generic notifications get muted; personalized ones get read.

---

## Core Concept

Each morning push notification includes:

1. **Tarabala:** today's nakshatra counted from the user's birth nakshatra → favorable/unfavorable indicator
2. **Chandrabala:** Moon's transit sign relative to natal Moon → emotional forecast
3. **House activation:** which house of the user's chart the day's nakshatra activates
4. **Rahu Kaal warning:** time window to avoid, computed for the user's location
5. **Dasha context:** if the user is in a dasha transition within 30 days, mention it

## Content Template

```
🔮 Good morning! Today's Rohini nakshatra activates your 10th house — strong for career moves.
Tarabala: Sampat (2nd) ✓ Favorable | Chandrabala: Good (Moon in 11th from natal)
⚠ Rahu Kaal: 10:30–12:00 — avoid new starts.
```

## Implementation

- Enhance `src/app/api/cron/generate-notifications/route.ts`
- For each user with a saved chart + push subscription:
  - Compute today's panchang for their location
  - Cross-reference with their chart: tarabala, chandrabala, house activation
  - Generate 2-3 sentence personalized content
  - Send via existing `sendPushToUser()`

## Effort: ~2 days
