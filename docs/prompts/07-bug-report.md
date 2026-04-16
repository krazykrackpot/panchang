# 07 — Bug report (writing one that gets fixed correctly)

Use this when reporting a bug. Writing a structured report costs 60 seconds
and prevents 2-hour round trips where the wrong thing gets fixed. Often, the
act of writing the report surfaces the cause before you hit send.

---

I'm reporting a bug in `<PROJECT NAME>`.

## Where

- **Route / URL:** `<full path, e.g., /en/dashboard/saved-charts>`
- **Component / file (if known):** `<e.g., src/app/[locale]/dashboard/page.tsx>`
- **Browser + OS:** `<Chrome 131 / Safari 17 / macOS 14>`
- **Auth state:** `<logged in as X / anonymous / has saved data>`
- **Locale active:** `<en / hi / sa / ...>`

## What I did (reproduction steps)

1. `<Step 1 — concrete action>`
2. `<Step 2>`
3. `<...>`

## What I expected

`<One sentence. If it's a regression, say when it last worked.>`

## What actually happened

`<One sentence of observable behavior. Quote error text verbatim.>`

## Evidence

- **Screenshot / video:** `<path or "attached">`
- **Browser console errors:** `<paste or "none">`
- **Network tab:** `<relevant failed request, status, response body>`
- **Vercel / server logs (if applicable):** `<paste or "didn't check">`

## What I've already ruled out

`<e.g., cleared cache, tried incognito, tried different locale, checked
network tab>`

## My guess at the cause (optional)

`<If you have one. Explicitly labeled as a guess so Claude doesn't anchor
on it without verification.>`

---

## Rules for the fix

1. **Verify you're looking at the right element.** If I say "the Solar
   Eclipse card is wrong," confirm which DOM element you're editing —
   card vs. SVG vs. banner. Ask if ambiguous.

2. **Reproduce the bug first, then fix.** Open the page, trigger the
   action, observe the failure. If you can't reproduce, say so — don't
   guess.

3. **Root-cause, don't band-aid.** `try/catch` around a crash isn't a
   fix. Find what's actually wrong.

4. **Write a regression test** that reproduces the bug before the fix.
   Confirm it fails, apply the fix, confirm it passes. Commit test + fix
   together.

5. **Scope minimally.** Fix the reported bug. Do not refactor adjacent
   code, rename variables, or "tidy up while you're here." If you find a
   related issue, report it separately — don't silently expand the fix.

6. **Report back with:**
   - Root cause in 1–2 sentences
   - File + line number of the fix
   - The failing-then-passing test output
   - Anything I should manually verify in the browser

## If the bug reappears after a "fix"

Reply with just: "still broken — here's what I now see: `<fresh evidence>`".
That's a signal to me (Claude) that I misdiagnosed. I should treat the next
attempt as a fresh investigation, not incremental patching on top of the
wrong fix.
