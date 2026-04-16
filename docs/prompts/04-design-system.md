# 04 — Design system

Use this to set up design tokens, primitive components, and the visual
language before building feature UI. Doing this on Day 1 saves refactoring
later when you realize every button is slightly different.

---

I need to set up a design system for `<PROJECT NAME>`. Style target: `<e.g.,
"dense and editorial like Linear," "premium dark like Raycast," "soft and
approachable like Notion">`. Tech: Tailwind v4 with `@theme` CSS variables,
React 19, no component library (or `<shadcn / Radix primitives / Headless UI>`).

Goal: every screen feels like part of the same app. New features don't
reinvent spacing, color, or typography.

## What I want you to produce

1. **Design tokens as CSS custom properties** in `src/styles/globals.css`
   under `@theme`. Cover:
   - Color palette (primary bg, surface levels, accent, text hierarchy,
     semantic — success/warning/danger/info). Use named tokens
     (`--color-bg-primary`, `--color-text-secondary`) — not raw hex in
     Tailwind classes outside the token layer.
   - Typography scale (6–8 font sizes with named purposes — `display`,
     `title`, `heading`, `body`, `label`, `caption`). Never use arbitrary
     `text-[13.7px]` in feature code.
   - Spacing scale (base 4px, keep to 4-6-8-12-16-24-32-48-64).
   - Radii (4 values: none, sm, md, lg).
   - Shadows (3 values: subtle, medium, elevated).
   - Animation/transition durations (fast=150ms, base=250ms, slow=400ms).

2. **Font loading via `next/font`** with `display: 'swap'` for every family.
   One primary, at most one secondary. If multi-script (Devanagari, Tamil,
   etc.), load subset per script via `next/font/google` variables and
   expose as `--font-<script>-<role>` tokens.

3. **Primitive components** (no business logic, purely presentational). At
   minimum:
   - `Button` — variants: primary, secondary, ghost, danger. Sizes: sm, md, lg.
     Loading state (spinner + disabled).
   - `Input` / `Textarea` — with label, helper text, error slot.
   - `Select` — accessible listbox (Radix / Headless UI).
   - `Card` — surface container with 3 elevation levels.
   - `Badge` — neutral + semantic colors.
   - `Icon` — wrap lucide-react with consistent sizing + color inheritance.
     No emoji anywhere in the UI.
   - `Dialog` / `Modal` — portal + backdrop + focus trap.
   - `Toast` — global provider, 4 types.
   - `Skeleton` — for loading states, matching component shapes.

   Each primitive:
   - Uses only tokens (no hardcoded colors/sizes in the component file)
   - Is keyboard-accessible (`:focus-visible` rings, no focus removal)
   - Has a Storybook/MDX usage example OR a `docs/components/<name>.md`
     showing every variant
   - Accepts `className` for extension but exposes no bag of ad-hoc props

4. **Dark/light mode strategy.** Either:
   - Dark only, documented explicitly in CLAUDE.md + enforced via
     `html class="dark"` + the theme toggle is removed, OR
   - Both modes with `html.light` overriding the relevant `--color-*`
     variables and every component tested in both.
   Pick one upfront — don't fake it.

5. **Accessibility rules baked in:**
   - All interactive elements have visible `:focus-visible` rings
   - Color contrast ≥ WCAG AA for body text (4.5:1) and ≥ AA large (3:1)
     for titles. Verify with a tool, not by eye.
   - All images have `alt`; decorative ones have `alt=""`
   - All icons inside buttons have `aria-label` if no visible text
   - No `div onClick` — always `button` or `Link`.

## What NOT to do

- **No hardcoded colors outside tokens.** Ban `bg-red-500`, `text-gray-700`,
  etc. in feature code. Feature code uses `bg-surface-elevated text-body`.
- **No arbitrary Tailwind values in feature code.** `bg-[#0a0e27]` is fine
  in the token layer, forbidden in a `Card`'s body.
- **No inline styles for anything token-expressible.** `style={{color: '#888'}}`
  is a code smell; use a token class.
- **No custom icons redrawn per-component.** One icon system, consistent sizes.
- **No emoji as UI elements.** Use a real SVG icon system.
- **No dynamic Tailwind class strings** like `` `text-${color}-500` ``. The
  JIT can't see them; they silently render as no class.

## Give me back

1. The full `globals.css` `@theme` block with every token.
2. A `tailwind.config` or v4 equivalent exposing each token as a utility.
3. The primitive components, each in its own file under `src/components/ui/`.
4. A `docs/DESIGN-SYSTEM.md` with visual examples, contrast ratios, and a
   1-sentence "when to use" per component.
5. A Playwright smoke test that renders each primitive in both states
   (default, disabled/loading, error) and asserts the `:focus-visible`
   ring is present when tabbed to.

Propose, wait for sign-off, then build.
