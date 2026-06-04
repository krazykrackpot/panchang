# Publish playbook — "Sixty Names, Two Translations, One Disagreement"

## Status

- ✅ **Medium — PUBLISHED 2026-06-04**: https://medium.com/@aditya.kr.jha/sixty-names-two-translations-one-disagreement-f3d9265b0ae5
- ⏳ **dev.to — PENDING**. Canonical URL pre-filled in `devto-d60-deities.md`. Paste and flip `published: true`.

---

Two paste-ready files in this directory:
- `medium-d60-deities.md` — Medium version (no platform frontmatter; UTM=medium)
- `devto-d60-deities.md` — dev.to version (with frontmatter; UTM=devto; `canonical_url` already points at the Medium post above)

Recommended sequence: **Medium first, dev.to second with canonical pointing back at Medium**. Reasons:
- Medium has the wider general-audience reach for a personal-essay piece. Better fit for the tone.
- Dev.to natively supports a `canonical_url` field. Setting it to the Medium URL declares Medium the original — no duplicate-content penalty on either platform.
- If you reverse the order, you have to manually edit the Medium piece later to add a "this was originally posted on dev.to" link, which Medium handles less gracefully.

## Step 1 — Publish on Medium  ✅ DONE

1. Open https://medium.com/new-story.
2. Paste the body of `medium-d60-deities.md` (everything BELOW the `---` frontmatter line — the frontmatter is for dev.to only, Medium doesn't use it).
3. Title: **Sixty Names, Two Translations, One Disagreement**.
4. Subtitle (optional but recommended): An evening with the Brihat Parashara Hora Shastra, a 1950 translation, a 2021 translation, and the small judgment call that sits in a constants file.
5. Tags (5 max, Medium's UI): `Hindu Astrology`, `Sanskrit`, `Software Engineering`, `Typescript`, `India`.
6. Set the publication-toggle to "no publication" (personal post) unless you have a Medium publication set up.
7. Add a cover image — see the cover image suggestions below.
8. Click **Publish**.
9. Copy the resulting Medium URL.

## Step 2 — Publish on dev.to (canonical pointing at Medium)

1. Open https://dev.to/new.
2. Click the **gear icon** ("Frontmatter / Settings") at the top of the editor.
3. Paste the full content of `devto-d60-deities.md` including its frontmatter.
4. In the frontmatter, edit `canonical_url: ""` to `canonical_url: "https://medium.com/<your-medium-url>"` — the URL you copied in step 1.9.
5. In the frontmatter, change `published: false` to `published: true`.
6. Add the cover image (Settings panel → Cover Image, paste an image URL or upload).
7. Click **Publish**.

## Step 3 — Verify

- Visit the Medium post in a logged-out browser; confirm the body renders cleanly + the dekhopanchang.com link has `?utm_source=medium&utm_medium=article&utm_campaign=d60-deities`.
- Visit the dev.to post; same check with `utm_source=devto`.
- Hover over the canonical-URL indicator on the dev.to post; it should display the Medium URL.

## Cover-image suggestions

The article is text-heavy and the platforms prefer a 1200×600 (Medium) / 1280×640 (dev.to) cover image. Options:

1. **Best**: a screenshot of the constants file showing 4-5 of the deity entries (Devanagari + transliteration + English label + degree range). Crop to a strip, dark theme. Highlights "this is real code" framing.
2. **Second-best**: a photograph or scan of an open page of the Santhanam BPHS translation with the verse numbers visible. Works if you have a copy of the book.
3. **Generic**: a public-domain image of a star chart or birth-chart sextant from Wikimedia Commons (CC0). Lower impact, but loads instantly.

## Tracking — what to expect

- **First 48 hours**: most of the traffic comes from each platform's algorithmic feed. dev.to surfaces new posts in the "Latest" feed for ~6 hours; Medium ranks via tag-recency and follower-graph signals.
- **First 2 weeks**: tail-off as the post ages out of "Latest" but starts collecting organic / search traffic.
- **30-day baseline**: 10–50 visits per platform per week from indexed search results if the title hits a search query someone types. The article's title isn't optimized for search — it's optimized for click — so this number is on the lower end of the band.

To track, watch Vercel Web Analytics for the two UTM campaigns:
- `utm_source=medium&utm_campaign=d60-deities`
- `utm_source=devto&utm_campaign=d60-deities`

Aggregate visits across both campaigns vs the dev.to Pt 1 + Pt 2 baselines from `reference_devto_article.md`.

## Editorial calls baked in

Two judgments in the article that may invite reader comments. Worth knowing now so you can respond consistently:

1. **The "I'm not a Sanskrit scholar" line.** A reader might push back: "if you're not a scholar, why publish a judgment about which translation is correct?" The honest answer is in the article — you made the call as a software developer who had to ship something, documented it transparently, and left a flag for the next reader. Stand by it; don't soften it.

2. **The "JHora doesn't classify the deities" claim.** Verify before publishing if you want to be defensive: open JHora's D60 view on a test chart and check whether the segment names appear classified anywhere. If JHora does classify them and you missed it, edit the sentence to "JHora classifies them differently from both Sastri and Ojha — its own internal table, no citation visible." Either way is fine; just verify.
