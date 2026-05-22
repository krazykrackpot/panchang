# Brihaspati Prompt & Layer-2 Review — 2026-05-21

Reviewer: Claude (Opus 4.7) at user's request, before public launch.

## Scope

Reviewed:

- `src/lib/brihaspati/narration/prompts.ts` — Layer-3 system prompts (EN / HI / TA stub / BN stub / fallbacks).
- `src/lib/brihaspati/narration/inference.ts` — Claude orchestration, streaming, caching.
- `src/lib/brihaspati/narration/validator.ts` — Layer-4 regex claim verifier.
- `src/lib/brihaspati/router.ts` — Layer-2 `buildContext()` + `CATEGORY_ENGINES` map.
- `src/lib/brihaspati/types.ts` — `BrihaspatiContext` contract.
- `src/app/api/brihaspati/route.ts` — buildContext call site (lines ~140-200).

Out of scope: classifier internals, payment flow, frontend UI, GAMIFICATION plan.

---

## Strengths (keep)

- **Rule set is tight.** The 7 `COMMON_RULES` are the right ones: no-invention, cite-from-JSON, no doom-cast, one remedy, one citation, 300–500 words, no third-party source name. Each rule maps cleanly to something a validator can check.
- **Prompt hashing** (`systemPromptVersion` → sha256 → 16-char slice) is persisted on every question row. Training flywheel can group by prompt version. Good design.
- **Prompt caching on the system block** (`cache_control: { type: 'ephemeral' }`) — drops cost ~90% on warm calls. Correctly placed on the system slot, not the user message.
- **Per-locale prompts authored separately** — not "answer in Tamil" appended to an English system. Avoids the most common multi-locale failure.
- **Tier fallback discipline** — Tier 2 → retry → Tier 0 template fallback. `validationPassed` is recorded regardless of enforcement mode; `BRIHASPATI_LAYER4_BLOCK` env gates strict blocking. Production-safe progression.

---

## Concerns — by severity

### 🔴 Launch-blocking

#### L1. Tamil and Bengali prompts are stubs with English rules

`prompts.ts:66-78`. Both stubs swap the language instruction but keep `COMMON_RULES` in English:

```ts
const TA_PROMPT_STUB = `
You are Brihaspati ..., answer in Tamil (தமிழ்)...
${COMMON_RULES}   // ← English rules
`;
```

LLMs given contradictory language cues code-switch — random English numbers, English remedy names, English transitions mid-Tamil prose. Both locales are listed in `BRIHASPATI_LAUNCH_LOCALES = ['en','hi','ta','bn']`.

**Action:** either translate `COMMON_RULES` into TA + BN before launch, or drop them from launch locales until Phase X.

#### L2. Layer-2 routing is declared but not implemented

`router.ts:42-55` declares `CATEGORY_ENGINES`:

```ts
career:   ['domain', 'dasha', 'transit', 'tippanni'],
marriage: ['domain', 'dasha', 'transit', 'tippanni'],
health:   ['domain', 'tippanni', 'remedies'],
...
```

But `buildContext()` (line 89) **ignores the category entirely** and passes through whatever the API route gave it. The API route (`route.ts:140-160`) loads the full `kundali_snapshots` row and shovels:

```ts
const kundali = {
  chart:    snapshot.chart_data ?? snapshot.planet_positions ?? {},
  dashas:   snapshot.dasha_timeline ?? {},
  yogas:    extractArray(snapshot.full_kundali, 'yogas'),
  doshas:   extractArray(snapshot.full_kundali, 'doshas'),
  transits: extractArray(snapshot.full_kundali, 'transits'),
  analysis: snapshot.full_kundali,   // ← the ENTIRE blob
};
```

Consequences:

- **Layer-2 wall is bypassed.** The whole point of the wall is "LLM doesn't choose what's relevant — Layer 2 does." Right now the LLM does its own routing inside its context window.
- **The validator (Layer 4) can't catch wrong-section interpretation.** It catches outright fabrications but cannot detect "model talked about career bhāva for a marriage question because all the career data was in front of it too."
- **Massive duplication**: `analysis` (the whole `full_kundali`) already contains yogas/doshas/transits/dashas. The same data ships under multiple keys.

**Action:** implement `CATEGORY_ENGINES`-driven filtering inside `buildContext()` (or the API call site) so the LLM sees a category-tailored slice, not the whole kundali. Acceptable v0 alternative: ship as-is, mark Layer-2 routing as an explicit known-gap with a metric, narrow before scaling past ~100 users.

#### L3. Citation rule is unsatisfiable as written

Rule #5: *"Quote one classical reference (BPHS, Saravali, or Phaladeepika) … using only references already named in the JSON if any."*

But `yogas` and `doshas` are typed `Record<string, unknown>[]` — no guaranteed `citation` field. `extractArray()` in the API route pulls arrays by name without enrichment. The JSON almost certainly contains no citations.

So the model either:

- silently drops the rule (best case, but it's now a dead rule), OR
- invents Sanskrit-sounding sutras — **the exact hallucination mode the prompt was supposed to prevent.**

**Action:** either populate `citation: { text: string; source: 'BPHS' | 'Saravali' | 'Phaladeepika'; ref: string }` on every yoga/dosha at Layer-2, OR drop rule #5 entirely until citation data is wired.

---

### 🟠 Pre-public-launch (≤ 100 users)

#### P1. Validator is English-only; Hindi narration is anti-hallucination-free

`validator.ts:32-34` docstring: *"this verifier targets English narration."*

Hindi LLM output goes through the same `narrate()` path. EN claims get extracted, checked, can fail → retry / block. **HI claims pass through silently.** Hindi is a launch locale.

**Action:** add a Hindi-aware claim extractor (Devanagari planet aliases — सूर्य/चन्द्र/मंगल/बुध/गुरु/शुक्र/शनि/राहु/केतु — plus Hindi house ordinals and Devanagari sign names). Same regex shape, different alphabet table.

#### P2. Remedy rule references undocumented data shape

Rule #4 says *"End with one remedy drawn from the remedies in the JSON."* But `remedies` isn't a top-level field on `BrihaspatiContext`. It might be inside `analysis.remedies` if `full_kundali` happens to carry them — undocumented dependency on engine output shape.

**Action:** promote `remedies: Remedy[]` to a top-level field on `BrihaspatiContext` and guarantee it's populated by Layer-2.

#### P3. No scope / safety guardrail in the prompt

User asks: *"Will my mother die in 2027?"* / *"Should I divorce my wife?"* / *"Is this the right job?"* — the current rules don't constrain how Brihaspati handles death predictions, life-decision binaries, or terminal illness. Claude's RLHF will mostly do the right thing; Qwen / open models often won't.

**Action:** add rule #8:

> If the user asks about death, terminal illness, divorce decisions, or specific yes/no fortune-telling, address the underlying anxiety with what the chart shows about that life area — never give a literal date or binary answer.

#### P4. `analysis: Record<string, unknown>` is too loose

`types.ts:102` types `analysis` as completely free-shape. Rules #4 and #5 reference data that may or may not be inside it. If Layer-2 fills it well, fine. If sparsely, model invents to fill the silence.

**Action:** spec a minimum schema per category (e.g., `career.analysis` always has `dasaAffecting`, `tenthLordState`, `dignityOfSignificators`). Encode as TypeScript discriminated union or Zod schema validated before `narrate()`.

---

### 🟡 Iterate-after-launch

#### I1. Voice is generic-LLM-warm, not distinctively Brihaspati

"Wise but warm, specific not vague, compassionate" — could be any LLM persona. Misses what makes Brihaspati *Brihaspati*: guru-of-the-devas gravitas, dharmic-moral lens, decisive but not arrogant. User's stated preference is "concrete personal commentary, never abstract" — the prompt could pull harder toward life-implication framing rather than mechanic-citing.

**Action:** A/B variant after launch with stronger persona anchor and one Brihaspati-canonical phrasing example.

#### I2. Cross-model portability — no format anchors

Current prompt works for Claude because Sonnet 4.6 at temp 0.4 self-structures cleanly. **Qwen 2.5 / 3 do not** — they need explicit format anchors or they ramble past the word cap, skip the remedy, echo the JSON back, or open with prompt-restatement.

For future self-hosting (per `INFRASTRUCTURE.md` Phase 5+), prompt will need:

- Explicit section ordering: *"Structure: (1) opening salutation, (2) what the chart says, (3) timing window, (4) practical remedy, (5) classical reference."*
- 1–2 worked few-shot examples (EN + HI), also cacheable.
- Optional XML anchor mode (`<answer>...</answer>`) so streaming chunks are robust to leading model chatter.

**Action:** add a Qwen-specific prompt variant when Tier-1 self-hosting comes online; do not modify the Claude prompt now.

#### I3. Token cost / cache pressure

`full_kundali` for a rich chart is **50–200 KB JSON ≈ 12K–50K input tokens per question.** Prompt caching covers the system block, not the user message — so the JSON is sent fresh every question. Career and marriage questions for the same user both ship the entire chart.

Resolves automatically when L2 is fixed; until then, the per-question cost will scale with chart richness rather than question complexity.

**Action:** measure actual median input-tokens per question post-launch. If above ~5K consistently, prioritise L2 routing.

#### I4. Output token cap of 800 may truncate

`inference.ts:33`. 800 tokens ≈ 500-600 words. Combined with the *"300–500 words"* rule this is *usually* fine, but a chart with many flagged yogas + a discursive style can run over and silently truncate.

**Action:** bump to 1024 with a guard rail in validation that flags answers exactly hitting `outputTokens === MAX_OUTPUT_TOKENS` as suspicious (likely truncation).

---

## Cross-cutting observation

The prompt and the validator are well-designed for the contract they assume. **The gap is in Layer-2**, where the contract is technically declared (`CATEGORY_ENGINES`) but operationally a pass-through. Fixing Layer-2 properly makes rules #4 and #5 enforceable, makes the validator a meaningful gate (not just a fabrication detector), and reduces cost in line with question complexity.

A reasonable v0 posture is: launch with the wall intentionally "narrow at the top" (Layer-2 thin), watch Layer-4 fail rates, then close the gap. The risk is that without category-scoped context, Layer-4 will *pass* superficially-grounded answers that draw from the wrong section of the chart — and we won't know unless we read the answers ourselves.

---

## Priority order (suggested)

| # | Item | Severity | Effort |
|---|---|---|---|
| 1 | TA/BN COMMON_RULES translation OR drop from launch | 🔴 | S (translation only) |
| 2 | Decide: implement L2 routing or accept v0 gap | 🔴 | M (full impl) / S (decision + telemetry) |
| 3 | Citation rule — either wire citations into yogas/doshas OR drop rule #5 | 🔴 | M / XS |
| 4 | Hindi-aware validator | 🟠 | S |
| 5 | Promote `remedies` to top-level `BrihaspatiContext` field | 🟠 | S |
| 6 | Scope/safety rule #8 | 🟠 | XS |
| 7 | Minimum analysis schema per category | 🟠 | M |
| 8 | Voice A/B variant | 🟡 | XS |
| 9 | Qwen-targeted prompt (when self-hosting lands) | 🟡 | S |
| 10 | Token-cost measurement plan | 🟡 | XS |
| 11 | Output cap → 1024 + truncation flag | 🟡 | XS |

---

## Open questions for product owner

1. **Layer-2 v0 vs v1**: ship-now-iterate vs fix-first-then-launch? Affects items 2/3/5/7.
2. **Citation realism**: do we have actual BPHS / Saravali / Phaladeepika ref data available, or is this a wished-for shape? If unavailable, rule #5 must change to *"reference the classical principle by name (e.g., 'Gajakesari Yoga per BPHS')"* without claiming a specific verse.
3. **TA/BN launch commitment**: hard requirement, or can we ship EN + HI now and add TA/BN in Phase X with native rules?
4. **Strict-block Layer-4 cut-over**: at what user count / failure rate do we flip `BRIHASPATI_LAYER4_BLOCK` from log-only to enforced?
