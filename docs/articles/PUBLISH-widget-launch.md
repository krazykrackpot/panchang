# Publish playbook — "The Day Maithili Disappeared"

## Status

- ⏳ **Medium — PENDING**. Paste body of `medium-widget-launch.md`.
- ⏳ **dev.to — PENDING**. Paste-ready in `devto-widget-launch.md`. `canonical_url` empty; fill in after Medium publishes.

---

Two paste-ready files in this directory:
- `medium-widget-launch.md` — Medium version (no platform frontmatter; UTM=medium)
- `devto-widget-launch.md` — dev.to version (with frontmatter; UTM=devto; `canonical_url` empty)

Same sequence as D60: **Medium first, dev.to second with canonical pointing back**.

## Step 1 — Publish on Medium

1. Open https://medium.com/new-story.
2. Paste the body of `medium-widget-launch.md` (everything BELOW the `---` frontmatter line).
3. Title: **The Day Maithili Disappeared (and the Widget I Built Three Weeks Later)**.
4. Subtitle (optional): A duplicate-content de-rank, a six-line vitest test that should have existed a year earlier, and an embed widget I built because temple websites deserved better defaults than mine had been.
5. Tags (5 max): `Web Development`, `Typescript`, `India`, `SEO`, `Software Engineering`.
6. Cover image — see suggestions below.
7. Click **Publish**.
8. Copy the resulting Medium URL.

## Step 2 — Publish on dev.to (canonical → Medium)

1. Open https://dev.to/new.
2. Paste the full content of `devto-widget-launch.md` (frontmatter included).
3. Edit `canonical_url: ""` → `canonical_url: "<Medium URL from step 1>"`.
4. Flip `published: false` → `true`.
5. Add the cover image.
6. Click **Publish**.

## Cover-image suggestions

The article opens with a sudden traffic drop, so the visual should evoke that or the recovery. Options:

1. **Best**: a screenshot of the Vercel Web Analytics chart for the actual May-June Maithili traffic, with the cliff visible. Dark theme. 1280×640. Crops well to Medium's 1200×600.
2. **Second-best**: a screenshot of the embed widget rendered on a temple website (or a mocked-up one with neutral branding). Demonstrates the artifact the article is about.
3. **Generic**: a stock photo of a temple bulletin board or community newsletter (Unsplash, CC0). Lower impact but loads instantly.

## Tracking

UTM campaigns to watch in Vercel Web Analytics:
- `utm_source=medium&utm_campaign=widget-launch`
- `utm_source=devto&utm_campaign=widget-launch`

Compare against the D60 article's UTM campaigns. The widget-launch piece targets a more technical/SEO audience than D60's literary-jyotish angle.

## Editorial calls baked in

Two judgments that may invite reader comments:

1. **The specific "sixty percent" drop number.** This is the actual Vercel Web Analytics number for the incident. If asked, the answer is "I checked the dashboard." Don't make it precise to a decimal — the rounded sixty is the truthful summary.

2. **"My grandfather spoke Maithili at home; I never picked it up properly."** A reader might ask why you build for a language you don't speak. The answer in the piece is implicit (Mithila has the densest jyotish households, the language deserves treatment) but a follow-up comment could expand: building software for a community is different from speaking the language; both contributions are welcome and neither replaces the other.

## Outreach companion

This article pairs with the outreach pitches in `docs/outreach/`:
- The temple pitches reference the iframe embed
- The diaspora pitches mention the multilingual support
- Once published, the article URL can be linked from each pitch as supporting context

Recommended pitch addition for any outreach sent after this article goes live:
> *I wrote about the technical decisions behind it last week — [Medium URL] — if you want the back story before deciding whether it's a fit for your site.*
