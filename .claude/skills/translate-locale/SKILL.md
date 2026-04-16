---
name: translate-locale
description: Supervisor workflow to translate any namespace/file into all 10 locales with key-parity validation and auto-retry. Use when the user asks to translate, localize, or migrate message content.
---

# /translate-locale — supervisor-agent translation pipeline

Use this when you need to translate a namespace or message file into all 10 locales with verification. Replaces the ad-hoc "dispatch 10 parallel agents and hope" pattern that keeps losing work to rate limits.

## The problem this solves

Previous translation sessions failed because:
- Subagents scaffolded empty files instead of translating
- Rate limits killed agents mid-task, losing state
- Key parity was never verified, leading to runtime `MISSING_MESSAGE` errors
- No resumability — re-runs restarted from zero

## Supported locales

`en, hi, sa, ta, te, bn, kn, mr, gu, mai` (10). English is the source of truth.

## Workflow

### Phase 1 — manifest

1. Identify the source of truth (usually `src/messages/en/<file>.json` or a specific namespace within it).
2. Extract ALL keys (deep flatten) into a manifest. Log count.
3. For each target locale (all 9 non-English), check which keys already exist and which are missing/empty/equal-to-English. Produce a coverage table:

   ```
   locale  total  translated  missing  suspicious(==en)
   hi      1200   1198        0        2
   ta      1200   1145        0        55
   ...
   ```

4. Save the manifest + coverage to `.claude/i18n-progress/<namespace>.json` so the job is resumable.

### Phase 2 — batched dispatch

Do NOT dispatch one agent per locale. Dispatch one agent per **{locale × batch}** where each batch is ~100 keys. This keeps agents under rate-limit thresholds.

For each agent:
- Input: the batch of English source strings + the target locale name + the expected key list
- Output contract: a JSON object with EXACTLY the expected keys, each translated to the target locale. No scaffolds, no placeholders, no `"TODO"`.
- Validation before acceptance:
  1. JSON parses
  2. Every expected key is present
  3. No value equals the English source (unless the English is a proper noun / number / code)
  4. No value contains the string `TODO`, `FIXME`, or the key name itself

If validation fails, re-dispatch with stricter instructions pointing out the specific failure.

### Phase 3 — merge + verify

1. Merge the validated batches back into `src/messages/<locale>/<file>.json`.
2. Run the locale-parity check (same logic as `.git/hooks/pre-commit`):
   ```
   node -e "/* parity script */"
   ```
3. Run `npx tsc --noEmit -p tsconfig.build-check.json` — catches type errors if the file is imported somewhere.
4. Run `npx next build` scoped to affected routes if possible.

### Phase 4 — progress + commit

1. Update `.claude/i18n-progress/<namespace>.json` with completed locales.
2. Commit in small chunks: one commit per locale or per namespace, not one giant 10-locale commit. If a subsequent locale fails, the completed ones are already saved.
3. Commit message: `feat(i18n): translate <namespace> into <locales>` + body listing coverage.

## When rate limits hit

- The progress file means you can resume. Re-invoke `/translate-locale` with the same namespace; it picks up where it left off.
- Reduce batch size from 100 keys → 50 → 25 until dispatches succeed.
- Stagger agent starts by 30s if many agents queue simultaneously.

## Quality bars

- Regional Indian languages: prefer real translations from Jyotish/Vedic terminology where known (see CLAUDE.md § i18n Conventions). When unsure, use English as fallback — NEVER use `undefined`, empty string, or the English text disguised as the target locale.
- Sanskrit: use classical forms with sandhi, not Hindi copies.
- Marathi/Maithili: distinct from Hindi — these are separate languages, not dialect tags.

## Hard rules

- **Never** dispatch more than 5 agents simultaneously — rate limits will destroy the run.
- **Never** mark a locale "done" until the parity script passes.
- **Never** commit translations without running `npx next build` on at least one affected page.
- **Always** save progress to `.claude/i18n-progress/` before any commit.
- If the user says "just fill the rest with English" — confirm explicitly, then do it, and LOG which keys fell back.
