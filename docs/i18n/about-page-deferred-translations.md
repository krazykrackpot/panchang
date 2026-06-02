# /about — Deferred translations for 5 locales

**Status**: tracked, not blocking
**Opened**: 2026-06-02
**Owner**: Aditya Jha + community

## What's already shipped

| Locale | Coverage | Notes |
|---|---|---|
| `en` | Full | Source language |
| `hi` | Full | Translated PR #349 |
| `mai` | New sections + author narrative | Translated 2026-06-02 (PR #369) — author is Maithil, highest-confidence translation; native-speaker review still welcome to polish flow |
| `mr` | New sections + author narrative | Translated 2026-06-02 (PR #369) — written from Devanagari proximity to Hindi; native-speaker review recommended before this counts as polished |

## What's deferred (5 locales)

| Locale | Script | Why deferred |
|---|---|---|
| `ta` (Tamil) | Tamil | Script-distinct from Devanagari + literary register matters in formal "About" prose; needs a native Tamil speaker |
| `te` (Telugu) | Telugu | Same — distinct script + formal register requirements |
| `bn` (Bengali) | Bengali | High-traffic locale (matches Bengali Panjika audience); deserves a sadhu-bhasha / cholito balance only a native can judge |
| `gu` (Gujarati) | Gujarati | Distinct script + formal vs everyday register considerations |
| `kn` (Kannada) | Kannada | Distinct script + literary Kannada vocabulary specifics |

Plus `odia` could be considered if/when the locale is added to `visibleLocales`.

## What users in these locales see today

The page falls back to English on a per-key basis (see `src/app/[locale]/about/page.tsx` line 156-160). Concretely:

- The hero `title` + `subtitle` are English
- The author narrative is English
- The new Jyotishacharya Council section is English
- The new Classical Canons section is English
- The methodology CTA is English
- The /about/methodology destination remains its own deep page (with its own translation policy)

This is the "honest English fallback" approach — better than serving Hindi (which Marathi/Maithili would have gotten under the old `isDevanagariLocale` heuristic before that anti-pattern was banned).

## Translation brief — for native-speaker contributors

If you'd like to contribute a locale, the keys to translate are inside `CONTENT[<locale>]` in `src/app/[locale]/about/page.tsx`. Compare against the `en:` block for the canonical source. Required keys:

**Hero**: `title`, `subtitle`, `authorHeading`

**Author narrative**: `authorIntro`, `authorName` (transliterate to your script), `authorHeritage`, `authorVedic`, `authorSoftware`, `authorMission`, `authorApproach`, `authorClosing`

**Jyotishacharya Council**: `consultantsHeading`, `consultantsIntro`, `consultantsScope`, `consultantsClosing`

**Classical Canons**: `canonsHeading`, `canonsIntro`, `canons[]` — each entry has `text` (the book's name, traditionally transliterated to your script) and `follow` (a short description of what we implement from it)

**Methodology link**: `methodologyCta`

**What NOT to translate** (these fall back to en intentionally — the `features[]` and `accuracy[]` arrays are technically-dense and currently considered out-of-scope for non-en/hi until we ship a glossary):

- `whatWeOffer`, `features[]`
- `accuracyHeading`, `accuracy[]`
- `heritageHeading`, `heritage[]`
- `contactHeading`, `contactIntro`, `contactEmail`, `contactPrivacy`, `contactLegal`, `contactResponse`

## Style guide for translations

- **Register**: formal but warm. The voice is "a craftsman explaining his work", not "a marketing site selling a product".
- **Sanskrit / technical terms** (षड्बल, अष्टकवर्ग, विंशोत्तरी, etc.): preserve in their Sanskrit form, written in your locale's script. They are recognised vocabulary in every Indic literary tradition.
- **Proper nouns** (Surya Siddhanta, BPHS, Aditya Jha, Mithila): transliterate to your script.
- **Sentence rhythm**: match the en/hi rhythm — short opening clause, comma-separated technical list, closing assertion. Don't over-flower.
- **No competitor references**: never mention Prokerala / Drik / Shubh by name. Use neutral language like "professional almanacs" / "authoritative sources" where comparison is warranted.

## Contributor process

1. Open a PR adding the new locale block to `CONTENT` in `src/app/[locale]/about/page.tsx`.
2. Include a short note in the PR description with your name + a way for future maintainers to credit you in the About page itself.
3. Tag @krazykrackpot for review. We'll merge after a native-speaker sanity check (other Tamil/Telugu/Bengali/Gujarati/Kannada community members on the project).
