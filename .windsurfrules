## CRITICAL: READ CLAUDE.md FIRST
All project context, architecture, conventions, and rules are in CLAUDE.md. Read it before doing anything.

## ABSOLUTE RULES — NON-NEGOTIABLE

### NEVER ASK FOR PERMISSION
- When assigned a task, GO. Do not ask "should I proceed?", "would you like me to?", or "shall I?".
- Execute fully to 100% completion without prompting. The task is the permission.
- If something is ambiguous, make the best decision and document it — don't block on a question.
- Do NOT ask clarifying questions unless the task is genuinely impossible without more info.

### COMPLETION STANDARD
- Every task must be DONE-done: built, tested, visually verified.
- UI work must be complete and consistent — no half-styled components, no missing hover states, no broken responsive layouts.
- Run `npx next build` before considering anything finished. Zero errors, no exceptions.
- Dark theme only (navy #0a0e27 + gold #d4a853). No light theme colors.

### TESTING
- Run `npx vitest run` after every change.
- For large changes: augment existing tests or write new ones.
- Run full test suite AND verify build before declaring done.

### CODE QUALITY
- No emoji icons — use custom SVG icon system.
- Prefer editing existing files over creating new ones.
- Always `.trim()` env vars in API routes.
- Use `'use client'` only when component needs interactivity/browser APIs.
- All new pages must support EN/HI/SA (trilingual).
- After any refactoring: search for ALL references to changed variables/functions.
