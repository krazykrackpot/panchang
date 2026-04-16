---
name: ship
description: Full pre-push validation — type-check, build, tests, commit, push. Use when the user says "ship", "ship it", "push this", or after finishing a feature. Never skips tests.
---

# /ship — rigorous push workflow

Execute these steps IN ORDER. Do NOT skip any. Do NOT parallelize. If any step fails, STOP and report the failure; do not proceed or auto-fix unless the user asks.

## Step 1 — status snapshot

Run in parallel:
- `git status --short`
- `git diff --stat`
- `git log --oneline origin/main..HEAD`

Report: number of modified files, number of unpushed commits. If there are unstaged changes to files the user didn't explicitly mention, list them and ask whether to include.

## Step 2 — type-check (never skip)

```
npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | tail -30
```

Count `error TS` lines. If non-zero: STOP. Show the errors. Do not commit.

## Step 3 — tests (never skip)

```
npx vitest run 2>&1 | tail -10
```

If any test fails: STOP. Show failures. Do not commit. Ask the user whether to fix, skip with `--no-verify`, or abort.

## Step 4 — locale parity (if messages/ changed)

If `git diff --cached --name-only` or `git diff --name-only` includes anything under `src/messages/`, run:

```
node -e "/* see scripts/git-hooks/pre-commit for the inline script */"
```

(The pre-commit hook already does this — this step is a belt-and-braces early check.)

## Step 5 — build (never skip before a production push to main)

```
npx next build 2>&1 | tail -20
```

If the build fails: STOP. The pre-push hook won't save you — Vercel will break.

## Step 6 — stage and commit

- Stage specifically (`git add path/to/file ...`), not `git add .` or `git add -A`
- Refuse to stage `.env*`, `.claude/worktrees/`, or anything in `.gitignore`
- Commit message follows project convention: `type(scope): short description` + blank line + body explaining *why* + trailing `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
- Use HEREDOC for the commit message to preserve newlines:
  ```
  git commit -m "$(cat <<'EOF'
  fix(i18n): description

  Body.

  Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
  EOF
  )"
  ```

## Step 7 — rebase onto remote if needed

If `git log --oneline origin/main..HEAD` shows our commits AND `git fetch && git log --oneline HEAD..origin/main` shows remote commits, rebase: `git pull --rebase origin main`. If rebase has conflicts, STOP and surface them — never `--theirs`/`--ours` blindly.

## Step 8 — push

```
git push origin main
```

If the pre-push hook blocks, respect it. Do NOT use `--no-verify`.

## Step 9 — confirm landed

```
git log --oneline -3
```

Report commit SHAs and a one-line summary of what shipped.

## Hard rules

- **Never** skip tests "to save time"
- **Never** use `git commit --no-verify` or `git push --no-verify` unless the user explicitly authorizes it for this commit
- **Never** use `git add .` / `git add -A` — stage files by name
- **Never** force-push to `main`
- **Never** include `.claude/worktrees/` or `.env*` in a commit
- If the user says "just ship it" while tests are failing: STOP, show the failures, ask if they want to override. Do not auto-override.
