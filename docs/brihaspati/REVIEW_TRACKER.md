# Brihaspati Prompt & Layer-2 Review — Tracker

Issues raised in `PROMPT_AND_LAYER2_REVIEW.md` (2026-05-21). This tracker lives next to the review and is the source of truth for status. Each issue carries a status, the resolution decision, and the commit that closes it.

Status legend: **open** | **in-progress** | **resolved** | **deferred**

---

## 🔴 Launch-blocking

### L1 — TA/BN prompts mix English COMMON_RULES (code-switching risk)

| | |
|---|---|
| Status | **resolved** |
| Decision | Build a proper prompt library with **natively authored** EN/HI/TA/BN rules. No template substitution of English rules into a non-English prompt. |
| Where | `src/lib/brihaspati/narration/prompts/rules/common.ts` — keyed by locale |
| Notes | TA/BN rules are best-effort native authorship; flagged for native-speaker review before `BRIHASPATI_LAYER4_BLOCK` flips strict |
| Closed by | Phase 9.13 — prompt library + native rules commit |

### L2 — Layer-2 routing declared but not implemented; full kundali shovel

| | |
|---|---|
| Status | **resolved** |
| Decision | Implement `CATEGORY_ENGINES`-driven filtering inside `buildContext()`. Each category sees only the slice of the kundali its engines produce — career sees 10th-house analysis + Saturn/Sun positions + transits to 10th; marriage sees 7th-house + Venus/Jupiter/Mars + manglik yogas; etc. Sun + Moon always carried as base context across all categories. |
| Where | `src/lib/brihaspati/router/category-filters.ts` (new) + `router.ts` `buildContext()` now calls `filterForCategory(category, kundali)` |
| Notes | Filter is defensive — works against three kundali shapes (positions array, planets object, top-level planet keys); falls back gracefully when yoga/dosha domain match leaves nothing. 34 tests cover the filtering contract. |
| Closed by | Phase 9.14 — Layer-2 routing implementation |

### L3 — Citation rule (#5) is unsatisfiable; data shape lacks citations

| | |
|---|---|
| Status | **resolved (mode='principle-only')** |
| Decision | Three-mode citation rule. v0 ships with `mode='principle-only'`: model may reference principles by name ("Gajakesari Yoga per BPHS") but MUST NOT claim a specific verse. When the engine starts emitting `{ citation: { source, ref } }` on yogas/doshas, we flip to `mode='full-cite'`. The `'drop'` mode is the escape hatch if citation hallucination still happens. |
| Where | `src/lib/brihaspati/narration/prompts/rules/citation.ts` |
| Closed by | Phase 9.13 — prompt library |

---

## 🟠 Pre-public-launch (≤ 100 users)

### P1 — Layer-4 validator is English-only; Hindi narration is unvalidated

| | |
|---|---|
| Status | **resolved** |
| Decision | Devanagari claim extractor added — `extractHindiClaims()` runs in parallel to the English passes. Supports: planet aliases (सूर्य/चन्द्र/मंगल/बुध/गुरु/शुक्र/शनि/राहु/केतु + bare रवि / बृहस्पति variants); Devanagari sign aliases (मेष..मीन with vargottama variants); Hindi house ordinals both word-form (प्रथम..द्वादश) and digit-form (1वें..12वें); yoga/dosha name capture with article-strip (कुण्डली / जातक / में / का / की / के) and a Devanagari→English yoga-alias table for ~30 common yogas + 7 doshas; dasha-pair extraction (गुरु-बुध दशा / गुरु महादशा / अन्तर्दशा). Mixed-script narrations get checked from both ends — a single answer can mix "Venus in 7th" with "बृहस्पति धनु राशि में" and both pass through. |
| Where | `src/lib/brihaspati/narration/validator.ts` — `HI_PLANET_ALIASES`, `HI_SIGN_ALIASES`, `HI_HOUSE_ORDINALS`, `HI_YOGA_ALIASES` tables + `extractHindiClaims()` function. Perf shortcut: skips Hindi pass entirely when narration has no Devanagari characters. |
| Notes | TA/BN claim extraction is still fast-follow — they share Sanskrit Jyotish vocabulary so a future round can crib heavily from the Hindi tables. |
| Closed by | Phase 9.15 — Hindi-aware validator |

### P2 — Remedy rule references undocumented data shape

| | |
|---|---|
| Status | **resolved** |
| Decision | Promote `remedies: Remedy[]` to a top-level field on `BrihaspatiContext`. Layer-2 builder is responsible for populating it (currently empty array if engine doesn't supply). The prompt rule now reads "End with one remedy from `remedies` if non-empty; otherwise give a grounded one-line suggestion consistent with the chart". |
| Where | `src/lib/brihaspati/types.ts` + `router.ts` `buildContext()` |
| Closed by | Phase 9.16 — type tightening |

### P3 — No scope / safety guardrail (death, divorce, binary fortune-telling)

| | |
|---|---|
| Status | **resolved** |
| Decision | New pluggable rule (#8) authored natively per launch locale. Applied automatically to `marriage`, `health`, `children`, and `general` categories — those most likely to attract life-decision binaries. Categories with low risk (`career`, `finance`, `education`, `dasha`, `remedies`, `transit`, `timing`, `compatibility`) skip it to keep the prompt tight. |
| Where | `src/lib/brihaspati/narration/prompts/rules/safety.ts` + `scope.ts` |
| Closed by | Phase 9.13 — prompt library |

### P4 — `analysis: Record<string, unknown>` is too loose

| | |
|---|---|
| Status | **in-progress** |
| Decision | Per-category Zod schemas in `src/lib/brihaspati/router/schemas/{category}.ts`. `buildContext()` validates with the category schema before returning; on validation failure the row is logged and falls through to template-tier 0 so the user still gets an answer. |
| Where | `src/lib/brihaspati/router/schemas/*.ts` (new) + `buildContext()` |
| Notes | Schemas can start permissive and tighten over time as engine output stabilises |
| Closed by | Phase 9.16 — type tightening |

---

## 🟡 Iterate-after-launch

### I1 — Voice is generic-LLM-warm, not distinctively Brihaspati

| | |
|---|---|
| Status | **scaffolded** |
| Decision | Voice variant system built into the prompt library (`voices/default.ts`, `voices/brihaspati.ts`). Default ships; Brihaspati variant is wired but not active — A/B selection comes after we have telemetry from the first wave of paid questions. |
| Where | `src/lib/brihaspati/narration/prompts/voices/` |
| Closed by | Phase 9.13 — prompt library (scaffold only); A/B selection is post-launch follow-up |

### I2 — Cross-model portability — no format anchors for Qwen

| | |
|---|---|
| Status | **deferred** |
| Decision | Library has a `modelHint` parameter; default is `'claude'`. Qwen-specific scaffolds + few-shot examples land when self-host (INFRASTRUCTURE.md Phase 5+) lands. Until then, no work needed. |
| Closed by | Self-host phase (no commit on this branch) |

### I3 — Token cost / cache pressure — full kundali shipped every question

| | |
|---|---|
| Status | **resolved (auto via L2)** |
| Decision | Resolved as a side-effect of L2 routing. The category filter trims input to 3–9 planet positions (vs 9 in old shovel), 0–6 house cusps (vs all 12), and category-scoped yogas/doshas/transits. `inputTokens` is logged per question; INFRASTRUCTURE.md Phase 11 watch-list includes plotting median p50/p95 to confirm. |
| Closed by | Phase 9.14 — L2 routing implementation (same commit as L2) |

### I4 — Output cap of 800 may silently truncate

| | |
|---|---|
| Status | **resolved** |
| Decision | Raise `MAX_OUTPUT_TOKENS` to 1024. Add a truncation guard in `inference.ts` that records a telemetry warning when `output_tokens === MAX_OUTPUT_TOKENS` (likely silent truncation). |
| Where | `src/lib/brihaspati/narration/inference.ts` |
| Closed by | Phase 9.17 — small fixes |

---

## Cross-cutting follow-ups

1. **Native-speaker review for TA/BN rules** before `BRIHASPATI_LAYER4_BLOCK=true` flips strict. Authored best-effort by the assistant; needs human pass.
2. **Telemetry plot for input-tokens** post-launch — confirms L2 is working as intended (I3).
3. **A/B Brihaspati voice variant** when first 200 paid answers are in (I1).
4. **Qwen scaffolds + few-shot** when self-host lands (I2).

---

## Decision: implementation order

Per user direction "let us do a" — library first, then L2, then validator-Hindi, then types.

| Phase | Item | Issues addressed |
|---|---|---|
| 9.13 | Prompt library + native multi-lingual rules + voice scaffolds + scope/citation/safety rule plumbing | L1, L3, P3, I1 (scaffolded) |
| 9.14 | Layer-2 routing implementation | L2, I3 |
| 9.15 | Hindi-aware validator | P1 |
| 9.16 | `BrihaspatiContext` type tightening (remedies promoted; per-category Zod schemas) | P2, P4 |
| 9.17 | Output cap + truncation flag | I4 |
| post | TA/BN native-speaker review, Qwen scaffolds, voice A/B, token-cost plot | I1, I2, I3 (follow-up), L1 (review pass) |
