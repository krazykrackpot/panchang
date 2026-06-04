---
title: "The Day Maithili Disappeared (and the Widget I Built Three Weeks Later)"
published: false
description: "A duplicate-content de-rank, a six-line vitest test that should have existed a year earlier, and an embed widget I built because temple websites deserved better defaults than mine had been."
tags: webdev, typescript, india, sanskrit
canonical_url: ""
---

On May 31 the Maithili traffic to my site dropped sixty percent in one day.

Maithili is a language of Mithila, in northern Bihar and southern Nepal, written in Devanagari and Tirhuta. It's the language my grandfather spoke at home; I never picked it up properly, but I built proper support for it into the panchang site I run because Mithila has one of the densest concentrations of practising-jyotish households in the country and the language deserves the same first-class treatment as Hindi. By April it was paying me back. I was getting ten thousand monthly impressions from `/mai/*` URLs, peaking at fifteen thousand the week of Vat Savitri. Then a Monday in May, the cliff.

I noticed because the shape of the drop was wrong. Organic traffic decays — you lose a few percent a week as your old posts age out of the index, then your new content brings it back. A sixty percent same-day drop is not a decay shape. It's a flag.

I sat with Google Search Console for two hours before I saw it. The flag was duplicate-content on a small fraction of `/mai/` pages. Google's index thought they were duplicates of `/hi/` pages. The crawler was reading both languages and concluding they were the same content with cosmetic variation. Once flagged, Google demotes both copies until it picks a canonical and demotes the other into oblivion. Which one survives depends on signals — backlinks, time-on-page, social shares. `/hi/` won every comparison because Hindi has been around longer and has more inbound links. `/mai/` lost.

The pages were not actually duplicates. They were marked duplicate because I had been writing code, for over a year, that rendered identical text into them.

I had a function called `isDevanagariLocale`. It returned true for any language that uses the Devanagari script — Hindi, Sanskrit, Marathi, Maithili, sometimes Nepali. For most things, that grouping is correct. You want to load Devanagari fonts, handle conjunct consonants the same way, share the same hyphenation rules. So I'd written code that branched on it. There were eighty-seven of these calls across the codebase. Almost all of them were innocent.

The innocent ones were font-loading and CSS class assignment. The dangerous ones were content. For section headings, for festival names from a constants table, for embedded labels on charts, the code would check `isDevanagariLocale` and emit Hindi text if it returned true. The Maithili reader was seeing Hindi. Marathi readers were seeing Hindi. Google was reading both `/mai/` and `/hi/` URLs, finding identical content blocks, and concluding the pages were duplicates of each other. From the index's perspective it was right. From the reader's perspective the Hindi was somewhere between baffling and insulting — Maithili and Hindi share roots but diverge in vocabulary at exactly the kind of words that show up on a panchang page, words like "fortnight" and "lunar day."

I spent a week tracking down every offending call. The grep was easy. The decisions at each call site were not. Some places I had real Maithili translations in a JSON file we'd paid a translator for the previous year. I just hadn't wired them up; the `isDevanagariLocale` collapse was sitting between the translation file and the rendered page, intercepting every read. I removed it. Other places had Hindi translations but no Maithili. I left a deliberate fallback to English, not Hindi, because at least English text is recognizably a fallback to both a Maithili reader and to Google's classifier. Better an honest miss than a confident wrong answer.

The structural fix was a test. Six lines of vitest that say: for every translated string, the rendered text in `mr` mode must not be identical to the rendered text in `hi` mode. Same for `mai`. If a future refactor reintroduces the collapse, the test fails before the code can ship. The test is short enough to write in five minutes. I should have written it a year earlier.

That's the long backstory to why, three weeks later, when I sat down to build an embeddable widget that any temple or blog could drop into their site with one iframe, I already knew exactly which patterns to avoid.

The widget shows the daily panchang or a list of upcoming Hindu festivals. It supports nine languages: English, Hindi, Tamil, Telugu, Bengali, Gujarati, Kannada, Marathi, Maithili. Every label in every one of those languages is filled in directly, hand-typed, sometimes hand-fixed when I realized a translator had used a regional dialect spelling that wouldn't fly with academic readers. There is no `isDevanagariLocale` anywhere in the widget code. The vitest assertion from the de-rank incident runs on the widget's label dictionary too. It fires if anyone introduces a shortcut.

Architecturally the widget is small. One iframe per surface, one URL contract:

```html
<iframe src="https://dekhopanchang.com/embed/panchang?city=varanasi"
        width="380" height="540" style="border:0;"></iframe>
```

Pick a city, a theme (light, dark, auto), a size (narrow, default, wide), a language, and an optional `ref` tag for attribution. The server renders the panchang once a day at midnight UTC, caches the result, and serves the same HTML to every visitor for the next twenty-four hours. There is no JavaScript on the embedded page beyond what React needs to hydrate. There is no clock-reading code that could mismatch between the server's render time and the visitor's read time. (That's a different failure I had shipped earlier and recovered from. The fix was: don't call `new Date()` inside any component that mounts inside an ISR-cached page, ever. There is a separate vitest test for that one too.)

The widget is set to `noindex`. I'm explicit about it in two HTTP headers and a meta tag, because if Google reads the embedded iframe as the host's content, the host gets penalised for thin content and I would, very specifically, deserve a Slack message from a temple admin asking why their event page lost its rankings. The widget is purely a reader-utility, not a backlink farm. The trade Google should make is invisible to most readers and entirely beneficial to the few who notice: temple websites get a daily-updated useful tool, my site picks up a small `?ref=` attribution tag, and nobody's SEO gets traded for someone else's.

Attribution is the only price I ask. A single line at the bottom of each widget — "Powered by Dekho Panchang" — links back to the homepage with a UTM tag that identifies which embed sent the visitor. When a temple admin emails me asking to embed, I send back the iframe code with their `ref` slug pre-filled. From the analytics on the homepage I can tell which embed is driving anyone over. So far temple visitors click through about three percent of the time, which is high for an attribution link. Apparently people do read the line at the bottom.

The widget is still rolling out. The Maithil samaj in Toronto picked it up last week. A temple in Jersey City is reviewing it. A Bengali community newsletter is testing it on their events page. None of these people care that I had a duplicate-content incident in May. They want an event calendar that updates itself and looks reasonable inside their colour scheme. That's the kind of widget I would have wanted, if I were running a temple website on a Sunday morning before the visiting program coordinator showed up. So that's the widget I built.

If you'd like to try it: the builder is at [dekhopanchang.com/widget](https://dekhopanchang.com/widget?utm_source=devto&utm_medium=article&utm_campaign=widget-launch). It's free, requires no signup, copy-paste in two minutes. If you run a temple, a diaspora community site, or a Hindu lifestyle blog, I'd like to hear from you.

---

*Code: `src/app/embed/*` in [dekhopanchang.com](https://dekhopanchang.com?utm_source=devto&utm_medium=article&utm_campaign=widget-launch). The `mr ≠ hi` test is in `src/app/embed/__tests__/embed-helpers.test.ts`.*
