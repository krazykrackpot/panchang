# Kundali ↔ Persona — Bridge & Precedence

**Status**: shipped 2026-06-03
**Owners**: kundali Client.tsx + lib/persona/*
**Related**: PR #382 (kundali 3-mode toggle), PR #381 (persona types + context), PR #379 (persona spec)

## Why two systems exist

The codebase has two related-but-distinct mode systems:

| System | Names | Storage | Scope |
|---|---|---|---|
| **Persona** | `beginner` / `enthusiast` / `acharya` | `dp-persona-mode` cookie + localStorage mirror | Sitewide (matching, sade-sati, daily briefing, future surfaces) |
| **Kundali view-mode** | `simple` / `detailed` / `expert` | `kundali-view-mode-v3` localStorage | Per-page override on `/kundali` |

They overlap in spirit (both have 3 tiers from gentle → technical) but represent different concepts. The persona is what the user identifies as across the whole product. The kundali view-mode is which surface they want on this particular chart, which may differ — an "enthusiast" who's curious about one specific chart's vargas should be able to dig in without permanently flipping their sitewide persona to acharya.

## Precedence (highest wins)

When `/kundali` mounts, it resolves the mode in this order:

1. **`kundali-view-mode-v3` localStorage** — the explicit per-page override. Written every time the user clicks the ViewModeToggle. Set means "this user has deliberately chosen a mode for /kundali; honour it."
2. **Legacy `kundali-view-mode` localStorage** — one-time migration from the 2-mode era. Migrated to v3 on first read, then deleted.
3. **Persona context** — read from the `dp-persona-mode` cookie (or its localStorage mirror) via the shared `usePersonaMode()` hook. Mapped through `personaToKundali()`:

   | Persona | Kundali default |
   |---|---|
   | beginner | simple |
   | enthusiast | detailed |
   | acharya | expert |

4. **Hard-coded `'simple'`** — initial state. Used for SSR + the brief window between mount and the storage / persona reads finishing.

## Why the gate on `personaHydrated`

The persona provider reads its cookie / localStorage CLIENT-side on hydration (not server-side, to keep the `[locale]/*` routes static-prerenderable — see the PersonaModeProvider comment for the SEO rationale). The hook exposes `isHydrated: boolean` which flips to `true` after that initial read.

If the kundali page seeded from `usePersonaMode().mode` immediately, it would seed from `DEFAULT_PERSONA_MODE` (`'enthusiast'`) for the first frame, then flip to the actual persona once hydration finishes. For a user whose actual persona is `beginner`, that's a visible Simple→Detailed→Simple flicker.

The gate prevents the flicker: the persona fallback only fires once `personaHydrated === true`. The effect re-runs when `personaHydrated` flips, which is when the actual persona value is known. The `resolvedFromStorage` guard inside the effect ensures the re-run can't overwrite a v3 value the user already set in a prior session.

## What writing the kundali toggle does NOT do

Clicking the ViewModeToggle writes to **`kundali-view-mode-v3`**, NOT to `dp-persona-mode`. A user who briefly switches to Expert on /kundali for one investigation is not silently re-labelled as an Acharya across the rest of the site.

Reverse direction: changing the persona via the Settings page (PR-2, not yet shipped) writes to `dp-persona-mode`. That update will be picked up on the next /kundali visit IF v3 is unset. If v3 IS set, the persona change does not affect /kundali — the per-page override stands.

## Profile-sync mapping

When a logged-in user lands on /kundali, the page reads `user_profiles.experience_level` from Supabase and applies it to the kundali view-mode. The mapping goes through the canonical persona helpers:

```
DB value → dbToPersonaMode() → personaToKundali() → kundali mode
beginner       beginner              simple              simple
intermediate   enthusiast            detailed            detailed
advanced       acharya               expert              expert
```

This is the change from PR #382's original two-bucket mapping (where `intermediate` users were forced into Simple). It aligns the kundali profile-sync with the persona system's full three-tier semantics.

## Eventual collapse (v2)

The persona spec (`docs/superpowers/specs/2026-06-03-persona-mode-setting-v1-design.md`) calls for PR-7 (~2 weeks after v1 ships) to remove the kundali-specific localStorage entirely and have the kundali page read directly from the persona context, with no per-page override. The rationale:

- A sitewide persona is conceptually cleaner than a per-page override.
- Users who briefly want a different mode for /kundali can use the in-page ViewModeToggle to switch — but the switch should update the persona, not create per-page divergence.
- One source of truth simplifies the cross-surface coordination (e.g., the future per-persona content variants on /matching and /sade-sati).

Until PR-7, both systems coexist with the precedence rules above.

## For future maintainers

If you're adding a new persona-aware surface:

- **Don't** add a new `<surface>-view-mode` localStorage key. Use `usePersonaMode()` directly.
- **Do** gate persona-driven rendering on `isHydrated` if the surface is SSR'd (which is most of them, given the static-prerendering policy).
- **Don't** write to `dp-persona-mode` from non-Settings UI without weighing whether you really want to flip the user's sitewide identity.

If you're touching the kundali ViewModeToggle or its storage:

- The persona bridge is read-only — leave the v3 storage alone unless you're actively retiring it (PR-7 territory).
- Any change to `personaToKundali()` must update this doc.
- The profile-sync at line ~486 uses the persona helpers — keep it that way so the mapping is in one place.
