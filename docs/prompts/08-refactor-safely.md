# 08 — Refactor safely

Use this when you want to change code structure without changing behavior.
The graveyard of this project is full of "quick sed sweeps" that took hours
to unwind. Don't join it.

---

I want to refactor `<WHAT>` in `<PROJECT NAME>`.

## What I want to change

- **Current state:** `<e.g., "tippanni-engine is a 2,000-line file doing 8 things">`
- **Target state:** `<e.g., "split into 8 focused modules under src/lib/tippanni/">`
- **Why now:** `<e.g., "adding Varga tippanni is blocked by this mess">`

## What must stay the same (observable behavior)

- `<API surface / exported function names — or explicitly say "allowed to change, here's the callsite migration plan">`
- `<Performance characteristics — must not regress LCP by >50ms>`
- `<Test results — every passing test before must still pass after>`
- `<User-visible behavior — screenshot before, screenshot after, must be identical>`

## Hard rules

1. **Behavior-preserving refactors ONLY in this session.** No "while I was
   in there, I also fixed bug X" — that's a different commit with a
   different test.

2. **Before touching code, produce a plan:**
   - Which files will change, in what order
   - What the new structure looks like (ASCII tree or file listing)
   - Migration strategy for callers (rename-and-reexport, codemod, etc.)
   - Estimated line-count delta

3. **Ban bulk regex on TypeScript and class names.** Past incidents: a
   `tl(` → `t(` sed broke 3,343 unrelated call sites. A Tailwind bracket
   double-escape broke 128 files. If you MUST regex:
   - Print the exact command you're about to run
   - Print the match count
   - Paste 10 sample before/after lines including at least 3 from
     different file types
   - Wait for my "go" before applying
   - Run `npx next build` after applying and abort if it fails

4. **Prefer AST tools.** ts-morph or jscodeshift for TS rewrites. Slower to
   set up, massively safer at scale.

5. **Small steps with build gates.** Break the refactor into commits that
   each pass `tsc` + `vitest` + `next build` independently. Never stage
   multiple breaking changes in one big bang.

6. **Keep old API as a re-export until callers are migrated.** Don't
   delete the old path in the same commit that adds the new one.
   Sequence: add new → migrate callers batch by batch → delete old.

7. **Write a snapshot / golden test before refactoring** if one doesn't
   exist. Capture the current output for a known input, refactor, diff
   against the snapshot. Any diff must be explainable.

## What I want back

1. **Plan doc** (don't code yet):
   - File-by-file diff summary
   - Commit sequence (5–10 commits, each with a 1-line description)
   - Risks & mitigations
   - Rollback plan if something breaks in production

2. **Wait for my approval** on the plan.

3. **Execute one commit at a time.** After each commit:
   - Run full `tsc` + `vitest` + `next build`
   - Report the diff size and any surprising changes
   - Wait for my "next" before the next commit

4. **Final report:**
   - All commits, each with its test/build status
   - Files touched, files added, files deleted
   - Any callers you couldn't migrate and why
   - Follow-ups / known gaps

## What I do NOT want

- A giant "refactor-everything" commit
- Drive-by behavior changes ("I also improved the algorithm")
- Silent API breaks ("removed because unused" — verify!)
- Suppressed TS errors or eslint-disable sprinkled in to make it compile
- Tests deleted or weakened to make them pass post-refactor
