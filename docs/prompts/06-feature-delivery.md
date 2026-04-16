# 06 — Feature delivery (the daily workhorse)

Use this every time you're adding a non-trivial feature to an existing app.
This is the prompt you'll use most often. Keep it tight, use it every time.

---

I want to add **`<FEATURE NAME>`** to `<PROJECT NAME>`.

## What it does (user-visible)

- `<Behavior from the user's POV, 2–4 sentences>`
- `<Entry points: where does the user encounter it?>`
- `<Primary happy path, 3–5 steps>`
- `<1–2 edge cases worth calling out>`

## Acceptance criteria

1. `<Concrete check 1 — "user can X and then Y happens">`
2. `<Concrete check 2>`
3. `<...>`

## Constraints

- **Data layer:** `<new table / extend existing / client-side only>`
- **Auth:** `<authenticated only / anonymous OK>`
- **i18n:** every new string in every supported locale (no partial rollout)
- **Performance budget:** `<page stays < X ms LCP / API stays < Y ms p95>`
- **Mobile:** must work on 375px width without horizontal scroll
- **Accessibility:** keyboard nav + visible focus + correct ARIA

## Non-negotiable rules (always apply)

1. Errors are visible — no silent catches. Supabase/fetch responses:
   destructure `{ data, error }`, branch on `error`, log with
   `console.error('[module] op failed:', err)`, surface to user.
2. Loading state always terminates. Every branch of any fetch sets
   loading=false, including early returns.
3. Writes are idempotent. Dedupe by natural key before every INSERT.
   Disable the submit button while saving. Both.
4. URL > local state > cache. Mount effects that read local state must
   check URL first and comment the precedence.
5. New page/component → integrated into main nav / dashboard / sitemap in
   the SAME commit. Unlinked page = dead page.
6. Never `setTimeout` as a substitute for a real readiness signal.
7. Library quirks commented at the call site.
8. Never bulk-regex TS or class names.

## Definition of Done (all four required)

1. `npx tsc --noEmit -p tsconfig.build-check.json` passes
2. `npx vitest run` passes (add a regression test for the new behavior)
3. `npx next build` succeeds with zero errors
4. Manually verified in the running browser — click the actual UI, watch
   the network tab, confirm no console errors, resize to mobile

## Process

1. **Propose a plan first** — don't touch code yet.
   - File-by-file list of what changes, with 1-line purpose per file
   - Data-model diff (new columns, new tables, new migrations)
   - New routes / API endpoints
   - New i18n keys (exact key paths)
   - Which existing components are affected and how
   - Test additions (unit + E2E)
   - Rollback plan if this breaks something

2. **Wait for my approval on the plan.** Iterate if the plan feels too
   ambitious or glosses over edge cases.

3. **Implement in small commits.** One commit per logical chunk (migration,
   API route, UI, tests). Each commit must independently pass `tsc` and
   `build`.

4. **Verify end-to-end in the browser** before saying "done." Open the
   network tab, check for console errors, try the unhappy paths (empty
   form, duplicate submit, network failure).

5. **Report back with:**
   - What was built (file list)
   - Test results (tsc + vitest + build output)
   - Screenshot or description of the UI
   - Any deviations from the plan and why
   - Known gaps / follow-ups

## What I do NOT want

- Code before the plan is approved
- A sweeping refactor of adjacent unrelated code ("while I was in there…")
- New dependencies added without explicit approval
- Mocks or stubs passed off as real implementations
- `// TODO` comments in place of actually handling the case
- Tests that assert the happy path only
- "Done" claimed with a failing gate
