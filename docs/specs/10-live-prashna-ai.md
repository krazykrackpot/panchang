# Feature Spec 10: Ask a Question (Real-time Prashna with AI)

**Tier:** 2 — Interactive, 3 days
**Priority:** Deferred
**Status:** Spec Complete

---

## What It Does

User types a question. The app casts a fresh kundali for that exact moment at the user's location. Claude AI interprets the prashna chart using classical horary rules (lagna lord strength, Moon's last aspect, 7th house analysis) and streams a personalized answer.

## Why It Matters

- **Interactive, feels magical.** Combines the two biggest assets: computation engine + AI.
- **The existing prashna page exists** (`/prashna`) but isn't real-time or AI-powered — it's a form with pre-built interpretations.
- **Engagement:** each question = a unique chart + unique answer. High repeat usage.
- **AI cost managed:** 2 free prashna/day, uses existing AI rate limiting infrastructure.

---

## Core Flow

1. User types a question and selects a category (career, relationship, health, travel, etc.)
2. App captures exact timestamp + user's location
3. Generates a kundali for that moment (same engine as birth chart)
4. Feeds the chart data + question to Claude API with a Prashna-focused system prompt
5. Streams the interpretation back to the user
6. Shows the prashna chart alongside the interpretation

## System Prompt (for Claude API)

```
You are a classical Vedic astrology Prashna expert following Prashna Marga and Tajika Neelakanthi.
Given the horary chart cast at the exact moment of the question, analyze:
1. Lagna lord strength and placement — indicates the querent's state
2. 7th house lord — represents the subject of inquiry
3. Moon's last and next aspects — timing and outcome indicators
4. Relevant house for the question category (10th for career, 7th for relationships, etc.)
5. Benefic/malefic influences on the relevant house
Provide a 200-300 word interpretation in accessible language. Be specific, not vague.
End with timing indicators and a brief remedial suggestion if applicable.
```

## Page: `/prashna/live`

- Clean input field with category selector
- "Ask Now" button (captures timestamp on click)
- Split view: chart on left, streaming answer on right
- Previous questions history (session-level, not persisted)

## Learning Page: `/learn/advanced/prashna-live`

Topics: Prashna Shastra origins, why the moment of asking matters, classical rules of horary interpretation, how AI applies these rules, ethical use of prashna (not fortune-telling — self-reflection tool).

## Effort: ~3 days
