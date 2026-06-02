# I Built a Free Embeddable Vedic Panchang Widget — One iframe, 9 Languages, NASA-Grade Accuracy

*Drop-in HTML for any website. No signup, no API key, no analytics. Daily panchang or upcoming Hindu festivals, themed to your colours, in your readers' language.*

---

A few months back I posted about [Dekho Panchang](https://dekhopanchang.com) — a Vedic almanac I built in TypeScript that computes daily panchang from first principles, using Swiss Ephemeris (sub-arcsecond planetary positions, the same library NASA uses) with a Meeus pure-math fallback. No external astrology APIs.

This week I shipped the next layer: an **embeddable widget**, free forever, that any website — temple, blog, diaspora community page, recipe site — can drop in with one line of HTML.

This post walks through what shipped, why it's structured the way it is, and the actual technical bits worth talking about.

## What you get

Two widgets:

```html
<!-- Daily Panchang — tithi, nakshatra, yoga, karana, sunrise/sunset -->
<iframe
  src="https://dekhopanchang.com/embed/panchang?city=varanasi"
  width="380" height="540" style="border:0;"></iframe>

<!-- Upcoming festivals — next 7 (or up to 30) days -->
<iframe
  src="https://dekhopanchang.com/embed/festivals?city=varanasi&days=14"
  width="380" height="500" style="border:0;"></iframe>
```

That's it. The widget renders on the host's page; the data updates daily (ISR-cached for 24h); the host pays nothing.

### Parameters

| Param | Values | Default | Notes |
|---|---|---|---|
| `city` | Any of 800+ canonical city slugs | required | Resolves IANA timezone for sunrise/sunset |
| `lat` + `lng` + `name` | Floats + display name | — | Alternative to `city` for any global location |
| `theme` | `light`, `dark`, `auto` | `light` | `auto` follows `prefers-color-scheme` |
| `size` | `narrow`, `default`, `wide` | `default` | Max-widths 280px / 380px / 480px |
| `locale` | `en`, `hi`, `ta`, `te`, `bn`, `gu`, `kn`, `mr`, `mai` | `en` | 9 languages with full UI translation |
| `ref` | `[a-z0-9-]{1,64}` | — | Attribution tag — visible in our Analytics; tells me which sites are sending traffic |
| `days` | `1`–`30` (festivals only) | `7` | Look-ahead window |

A builder UI at [/widget](https://dekhopanchang.com/widget) generates the snippet visually — pick city, theme, size, language, copy-paste the iframe. No code required for hosts.

## Why I built it

After Google's May 2026 Core Update demoted a lot of "scaled programmatic content" — including parts of my own site — I had two paths: write more, or get embedded elsewhere. Embeds are permanent backlinks, give the host site a useful free utility, and stop being subject to any single algorithm's mood swings.

The widget is **explicitly noindex** (`<meta name="robots" content="noindex,nofollow">` + the server emits `X-Robots-Tag: noindex` too). This is the part I think other "embeddable widget" projects get wrong — they hope to inherit ranking signal from the host. That's adversarial to the host's own SEO and Google penalises it now. The widget is purely a reader-utility; the value to me is the `?ref=` attribution + the brand exposure, not the link juice.

## Technical bits worth talking about

### 1. The ISR + clock-reading problem

Both embed pages are `revalidate = 86400` (ISR-cached daily). That means the HTML is generated at moment T1 and served to visitors at moment T2 — which can be several hours later. If the rendered HTML reads `new Date()` to derive "today", T1 and T2 disagree on what "today" is, and React's hydration mismatch (#418) kills the client tree.

This is a real bug we shipped earlier (and documented under "Lesson ZD" in our project guide). The fix for embed pages:

- The panchang widget derives the date from server-side `new Date()` once at SSR time
- The HTML is self-contained — no client component reads the clock again at hydration time
- The widget IS a server component end-to-end. No `'use client'` boundary. No interactive state. The trade-off: no live "tithi end-time countdown" — but you get hydration safety, which matters more.

If you genuinely need client-side clock in an ISR'd page, the right pattern is `useEffect` to populate after mount. Static at SSR, dynamic post-hydration. Never both at first paint.

### 2. The 9-locale dispatch trap

The widget supports 9 languages: English, Hindi, Tamil, Telugu, Bengali, Gujarati, Kannada, Marathi, Maithili. Most i18n implementations would write something like:

```typescript
// DON'T DO THIS
const text = isDevanagariLocale(locale) ? HINDI_TEXT : ENGLISH_TEXT;
```

We did exactly that across the site for a while. Then Google's Core Update came around, noticed that `/mr/*` and `/mai/*` pages were rendering Hindi text (because Marathi and Maithili are Devanagari-script and got bucketed into the Hindi branch), flagged them as duplicate-content, and tanked the rankings for Maithili — which was our #1 source of regional traffic.

The widget's labels are filled in directly for ALL 9 locales, with no `isDevanagariLocale` shortcut anywhere. There's even a vitest assertion that `mr` labels are NOT identical to `hi` labels — so anyone refactoring it can't accidentally re-introduce the bug:

```typescript
it('mr labels are NOT identical to hi labels (anti-fallback guard)', () => {
  const hi = getEmbedLabels('hi');
  const mr = getEmbedLabels('mr');
  const allMatch =
    hi.tithi === mr.tithi &&
    hi.nakshatra === mr.nakshatra &&
    hi.until === mr.until;
  expect(allMatch).toBe(false);
});
```

If you're building anything multi-language in a tight per-locale-distinct world, write this kind of structural test. It catches the regression before the SEO penalty does.

### 3. Attribution as the only price

The footer of each widget is a single line: "Powered by Dekho Panchang", linking to `https://dekhopanchang.com/?utm_source=embed&utm_medium=iframe&utm_campaign=<ref>`. Three details that matter:

- `target="_top"` so the link navigates the PARENT window, not the iframe (otherwise visitors would land "inside" the host's iframe context, which is confusing)
- `rel="noopener"` so the host's window object is not exposed to us (reverse tabnabbing is a thing)
- `utm_campaign=<ref>` lets me attribute which embed sent the visitor in Vercel Analytics — without that, embeds are dark traffic

The `ref` parameter is validated server-side against `/^[a-z0-9-]{1,64}$/` so an embed can't smuggle an XSS payload or an arbitrary URL into the campaign tag.

### 4. Locale-aware date format

```typescript
const dateStr = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(
  locale === 'en' ? 'en-IN' : `${locale}-IN-u-nu-latn`,
  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
);
```

The `-u-nu-latn` Unicode locale extension forces Latin numerals (1, 2, 3) instead of native numerals (১, ২, ৩ for Bengali, ௧, ௨, ௩ for Tamil) in the date display. Why: most embed hosts have a mixed numeric tradition — temples in the US display dates in Latin numerals even on a `bn` page, because their congregations read both scripts but compute days in Latin. Numeric-mismatch in a date string ("৭ October 2026") looks broken to many readers. Latin is the safer default; we can revisit if hosts ask.

### 5. The `dataLocale = locale === 'hi' ? 'hi' : 'en'` fallback

The festival names in the database are stored as `Trilingual` (`{ en, hi, sa }` — Sanskrit is the third). For locales outside that set, we explicitly fall back to English, NOT to Hindi:

```typescript
const dataLocale = locale === 'hi' ? 'hi' : 'en';
```

Same lesson as point 2 — pushing all Devanagari locales through Hindi is the duplicate-content trap. Bengali-language widget readers see "Durga Puja" in English Latin script rather than `দুর্গা পূজা` in Bengali script. That's a real translation gap we'll close in a follow-up batch — but English is the honest fallback, and an honest fallback never hurts the host.

## Try it

- Builder: https://dekhopanchang.com/widget
- Direct embed (panchang): https://dekhopanchang.com/embed/panchang?city=varanasi
- Direct embed (festivals): https://dekhopanchang.com/embed/festivals?city=varanasi&days=14

If you run a temple website, a diaspora community page, a Hindu lifestyle blog — or you know someone who does — please share. The widget is free forever; no commercial intent behind it. I built Dekho Panchang because computing panchang from first principles is a craft I love, and the widget extends that craft to anyone who wants it on their site.

## What's next

- 9-locale festival name translations (the Trilingual fallback closure mentioned above)
- A KP-system embed (sub-lord readings) for the small but enthusiastic KP audience
- A horoscope-strip embed (12 rashis, daily) — likely the highest-volume use case

If any of these sound interesting, drop a comment or [open an issue / DM me](https://dekhopanchang.com).

---

*[Aditya Jha](https://dekhopanchang.com/about) — software engineer + Maithil Brahmin building [Dekho Panchang](https://dekhopanchang.com).*

---

## Publishing notes (do NOT publish these)

- **Title test**: "I Built a Free Embeddable Vedic Panchang Widget" (current) vs "How to Embed a Free Hindu Panchang on Any Website" (alternative — more search-intent friendly). A/B if dev.to allows; otherwise go with the more search-intent variant.
- **Tags**: `webdev`, `typescript`, `nextjs`, `seo`. Avoid `tutorial` (it isn't one) and `programming` (too generic).
- **Cover image**: screenshot of the `/widget` builder page with the live preview iframe visible. 1280×640.
- **Cross-post**: hashnode.dev (5-minute change, mostly markdown-parity).
- **Internal link to**: the original "How I Built a Vedic Panchang Engine in TypeScript" article so dev.to surfaces both.
- **Tracking**: append `?ref=devto-widget-launch` to the homepage links; tag the post URL itself in social shares.
- **DO NOT** mention competitor sites (Prokerala / Drik / Shubh) by name — neutral comparison only ("most embeddable widget projects get this wrong" is acceptable; naming a specific competitor is not).
