# /kp-system + /learn/kp-system — Deferred translations for 5 locales

**Status**: tracked, not blocking
**Opened**: 2026-06-05
**Owner**: Aditya Jha + community
**Mirrors**: `docs/i18n/about-page-deferred-translations.md` (same deferral pattern)

## What's already shipped

| Locale | Coverage | Notes |
|---|---|---|
| `en` | Full | Source language |
| `hi` | Full | Original KP system content authored in Hindi alongside English |
| `mai` | Partial | Devanagari-proximity translation — author is Maithil, high confidence on `pages/kp-system.json` value strings; native-speaker review welcome for technical precision around Krishnamurti-specific terminology |
| `mr` | Partial | Same Devanagari-proximity rationale — Marathi script and many KP terms (कस्प, उप-स्वामी, सूचक) share roots with the Hindi version |

`pages/kp-system.json` and `learn/kp-system.json` carry all 9 locale keys per string (structural parity satisfied — verified by `scripts/check-locale-parity.py --namespace kp-system`). The 5 deferred locales below currently fall back to the English source text for the same keys.

## What's deferred (5 locales)

| Locale | Script | Why deferred |
|---|---|---|
| `ta` (Tamil) | Tamil | Script-distinct from Devanagari + KP terminology has Tamil-specific conventions (e.g. कस्प → கஸ்ப, but சார்பு / சார்நிலை also competes). Needs a native Tamil speaker familiar with KP literature |
| `te` (Telugu) | Telugu | Distinct script + KP vocabulary register considerations. Some Telugu KP texts use the Sanskrit-Devanagari loan terms verbatim; others Telugu-ise them. Need a contributor to pick a register |
| `bn` (Bengali) | Bengali | High-traffic locale; KP terminology in Bengali astrology literature has its own conventions worth preserving |
| `gu` (Gujarati) | Gujarati | Distinct script. Gujarati KP literature is sparse; need contributor with Krishnamurti familiarity |
| `kn` (Kannada) | Kannada | Distinct script. Kannada-specific KP vocabulary needed |

## What users in these locales see today

- The KP system page's interactive labels (`pages/kp-system.json`) and the learn module (`learn/kp-system.json`) fall back to English text for the 5 deferred locales.
- The kundali tab's KPTab component (`src/components/kundali/KPTab.tsx`) hosts an inline `T` LABELS table covering `en`, `hi`, `sa` (Sanskrit retired but kept as Devanagari fallback), `ta` (partial native authoring), and `bn` (partial native authoring). For `mai`/`mr`/`te`/`gu`/`kn`, the lookup `T[locale] || T.en` returns English at runtime. Same partial-locale strategy — not a regression.
- Sub-lord planet names rendered through `tl(...)` from the `Trilingual`-typed `GRAHAS` constants resolve to Hindi for any Devanagari locale (`mai`, `mr`) and English elsewhere, regardless of this doc's deferred-locale status. That's correct: planet names are a shared constant, not page copy.

This is the "honest English fallback" approach. Better than:
- Crashing on `undefined` (would happen if the JSON key was missing — structural parity prevents that).
- Auto-Hindi-fallback (banned `isDevanagariLocale` heuristic — see CLAUDE.md Lesson J).

## Translation brief — for contributors

If you would like to translate KP system content into one of the 5 deferred locales:

1. **Locate the two source files**:
   - `src/messages/pages/kp-system.json` — interactive page labels (Cusp / Star / Sub / Sub-Sub Lord; Promised / Denied verdicts; tooltip copy)
   - `src/messages/learn/kp-system.json` — the curriculum / explainer copy (Krishnamurti history, how the 249 subs work, why Placidus, ruling planets, etc.)

2. **Per-key structure**: each translatable string is a 9-locale dictionary:
   ```jsonc
   "ascSubLord": {
     "en": "Asc Sub Lord",
     "hi": "लग्न उप-स्वामी",
     "ta": "Asc Sub Lord",   //  ← deferred — currently identical to en
     "te": "Asc Sub Lord",
     "bn": "Asc Sub Lord",
     "kn": "Asc Sub Lord",
     "mr": "लग्न उप-स्वामी",   // already authored in Devanagari proximity
     "gu": "Asc Sub Lord",
     "mai": "लग्न उप-स्वामी"
   }
   ```
   Replace the `"en"`-shadowed deferred locale with your translated string.

3. **Style guide**:
   - **Technical KP terms** — keep the Krishnamurti vocabulary if there isn't a well-established native equivalent (e.g. "Sub Lord" is recognised in KP literature across languages; transliteration is fine). For Devanagari-script locales, "उप-स्वामी" is standard.
   - **Verdict language** ("Promised", "Denied", "Favourable", "Mixed") should use everyday register, not Sanskrit-loan formality. KP is a practitioner system, not a śāstric text.
   - **Personal pronouns** — second person (`आप`/`நீ`) is preferred over impersonal phrasings. The KP tab reads like an oracle response, not a manual.
   - **Numbers and degrees** — keep ASCII digits + degree symbol (`°`). Don't transliterate to Devanagari or other script numerals.

4. **Verify your work**:
   ```bash
   scripts/check-locale-parity.py --namespace kp-system
   ```
   Should print `✓ Structural parity: every key has all 9 locale variants` and, after your additions, fewer shadow warnings than before.

5. **Submit a PR** referencing this doc and your locale.

## Future expansion candidates

- Once a deferred locale reaches >90% non-shadow coverage, promote it from "deferred" to "shipped" in the table above.
- `KPTab.tsx`'s inline `T` table is the next surface to translate after the JSON files. The table currently mixes English/Hindi/Sanskrit/Tamil/Bengali; extending to the other 5 locales is straightforward but mechanical.
- The `/kp/prashna` and `/kp/transits` routes ship their copy via `kp-system.json` (page-level keys) and `KpNavStrip` labels — no separate translation file needed yet.
