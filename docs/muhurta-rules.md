# Muhurta Scoring Rules — Classical Sources and Implementation

This document records the classical textual basis for every muhurta scoring rule
in the Dekho Panchang engine. Every penalty, bonus, and hard veto traces to a
named text, chapter, or verse. Where texts disagree, the disagreement is noted
and our resolution explained.

Last updated: 2026-05-04

---

## Primary Texts Consulted

| Text | Author | Period | Relevance |
|------|--------|--------|-----------|
| **Muhurta Chintamani** | Daivagna Acharya Shri Ram | c. 1600 CE, Kashi | Most comprehensive muhurta treatise. Ch. 6 = Vivah Prakarana (pp. 146-224, Girish Chand Sharma tr.) |
| **Dharmasindhu** | Kasinath Upadhyaya | 18th c. | Dharmashastra compilation. Vivaha Prakarana pp. 89-101 (VDN Rao summary ed.) |
| **Brihat Samhita** | Varahamihira | 6th c. CE | Ch. 103 Vivaha Patala — planetary placements at marriage time |
| **Muhurtha** (Electional Astrology) | B.V. Raman | 20th c. | Modern synthesis of classical sources. Ch. 12-13 = marriage elections |
| **Jyotirnibandha** | (companion to Muhurta Chintamani) | — | Pada-level nakshatra restrictions |
| **Kalaprakashika** | Kerala tradition | — | Dashavidha Porutham; consistent with MC on muhurta nakshatras |
| **Nirnaya Sindhu** | Kamalakara Bhatt | 17th c. | Calendar/ritual timing. Corroborates eclipse and Sankranti prohibitions |

---

## 1. Tithis

### Auspicious Tithis for Vivah

**Muhurta Chintamani Ch. 6**: 2 (Dwitiya), 3 (Tritiya), 5 (Panchami),
6 (Shashthi), 7 (Saptami), 10 (Dashami), 11 (Ekadashi), 12 (Dwadashi),
13 (Trayodashi).

**B.V. Raman**: Same list plus Pratipada (1st). Also adds 8th (Ashtami) to the
forbidden list, which Muhurta Chintamani does not.

**Our implementation** (`activity-rules-extended.ts`): Uses the MC list
`[2, 3, 5, 7, 10, 11, 13]`. Shashthi (6) and Dwadashi (12) are omitted from
the "good" list for marriage (though they appear for other activities) because
some regional traditions consider them neutral for Vivah specifically.

### Forbidden Tithis (Rikta)

**Muhurta Chintamani**: 4 (Chaturthi), 9 (Navami), 14 (Chaturdashi).
Also: Amavasya (30), and tithi-gandanthara periods (last 2 ghatis of 5th/10th/
Purnima; first 2 ghatis of 6th/11th/Krishna Pratipada).

**B.V. Raman**: Adds 8 (Ashtami) and Purnima (15) to the forbidden list.

**Our implementation**: `avoidTithis: [4, 8, 9, 14, 15, 30]` — union of MC and
Raman's lists. Conservative approach: if either authority forbids it, we penalise.

### Paksha (Shukla vs Krishna)

**No classical text explicitly forbids Krishna Paksha for marriage.**

Muhurta Chintamani lists auspicious tithis *without a paksha qualifier*. The
practical effect is that good tithis occur in both pakshas. Shukla Paksha is
universally *preferred* (waxing Moon = growth symbolism for new beginnings),
but Krishna Paksha is not textually banned.

**Regional practice**: North Indian panchangas tend to avoid Krishna Paksha by
convention. South Indian traditions (Tamil, Telugu, Kerala) regularly use
Krishna Paksha dates when nakshatra and yoga are favourable.

**Our implementation**: Conditional penalty that accounts for supporting factors.
The tithi scorer gives Shukla good tithi +8, Krishna good tithi +1. On top of
that, the scanner applies a Krishna Paksha adjustment based on nakshatra and
lagna quality (`classical-checks.ts → krishnaPakshaAdjustment`):

- Krishna + good nakshatra + good lagna (score >= 5): -1 (mild, allowed)
- Krishna + good nakshatra + weak lagna: -3 (moderate)
- Krishna + bad/neutral nakshatra: -6 (heavy)

This implements the classical principle: Shukla Paksha is preferred, but
Krishna Paksha with excellent nakshatra and lagna combinations is permitted.
A Krishna Panchami with Rohini nakshatra and Tula lagna, for example, would
score only slightly below its Shukla equivalent.

---

## 2. Nakshatras

### Auspicious Nakshatras for Vivah

**Muhurta Chintamani Ch. 6** (11 nakshatras):
Rohini (4), Mrigashira (5), Magha (10), Uttara Phalguni (12), Hasta (13),
Swati (15), Anuradha (17), Moola (19), Uttarashada (21),
Uttara Bhadrapada (26), Revati (27).

**B.V. Raman** (three tiers):
- Highly favourable: Shravana, Rohini, Anuradha, Swati, Revati, Moola,
  Uttara Phalguni, Uttarashada, Uttara Bhadrapada, Shatabhisha
- Ordinary: Pushya, Dhanishta, Mrigashira, Ashwini, Chitra, Punarvasu
- To avoid: Bharani, Krittika, last padas of Ashlesha/Jyeshtha/Revati

**Our implementation** (`goodNakshatras`): Union of MC + Raman's favourable
tiers: `[4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 26, 27]`. Includes
Punarvasu (7), Pushya (8), Chitra (14), Shravana (22), Dhanishtha (23) from
Raman's "ordinary" tier.

### Avoided Nakshatras (Hard Veto for Marriage)

**Muhurta Chintamani + Jyotirnibandha**: Ashwini (1, per some texts),
Ardra (6), Ashlesha (9), Vishakha (16), Jyeshtha (18), Mula (19),
Purva Ashadha (20), Shatabhisha (24), Purva Bhadrapada (25).

**Pada exceptions** (Jyotirnibandha): First pada of Magha and Moola, last pada
of Revati are specifically cited as causing "death to the couple."

**Note on Pushya**: Despite being "the most favorable of all nakshatras" for
general purposes, Pushya is considered inauspicious specifically for marriage
by several authorities. Raman lists it as merely "ordinary" (not forbidden),
showing textual disagreement. Our implementation includes Pushya in `goodNakshatras`
but not at full weight.

**Our implementation**: These are **hard vetoes** (`hardAvoidNakshatras`) for
marriage and griha pravesh. The consensus across MC, Raman, and regional
traditions is strong enough that no amount of good hora/transit should override
a forbidden nakshatra. This is the ONE hard veto category we enforce — all
other factors use soft penalties.

---

## 3. Weekdays (Vara)

### Auspicious

**Muhurta Chintamani**: Sunday, Wednesday, Thursday, Friday.
**B.V. Raman**: Monday, Wednesday, Thursday, Friday.

Disagreement: MC includes Sunday; Raman includes Monday instead. Both omit
Tuesday and Saturday.

**Our implementation**: `goodWeekdays: [1, 3, 4, 5]` (Mon, Wed, Thu, Fri) —
Raman's list, which is the more common modern practice.

### Avoided

**Tuesday**: Explicitly excluded by MC and Raman. Strong consensus across all
traditions. Mangalvar (Mars' day) = conflict.

**Saturday**: Not outright forbidden in MC; omitted from auspicious lists in
Raman. Weaker prohibition than Tuesday.

**Sunday**: *Auspicious* per Muhurta Chintamani. Omitted (neutral) per Raman.
No text explicitly forbids it.

**MC also notes**: "Tithis and weekdays are given less importance while
selecting marriage dates" — the Panchang Shuddhi for Vivah prioritises
nakshatra, yoga, and karana over vara and tithi.

**Our implementation**: Soft penalties, not hard vetoes. Tuesday = -4 points.
Saturday = -3 points. Sunday = -1 point. Good weekday = +3. This reflects the
classical position that weekdays matter less than nakshatra/yoga for marriage.

---

## 4. Yogas (Nitya Yoga)

### 9 Inauspicious Yogas

**Muhurta Chintamani Ch. 6**: Lists 9 Ashubh Yogas for marriage with specific
ill effects for each:

| # | Yoga | MC's stated effect |
|---|------|--------------------|
| 1 | Vishkambha | "Death of the bridegroom" |
| 6 | Atiganda | "Bride suffers from diseases" |
| 9 | Shula | "Bridegroom becomes drunkard, meat-eater" |
| 10 | Ganda | "Death of the son" |
| 13 | Vyaghata | (Severe inauspiciousness) |
| 15 | Vajra | (Severe inauspiciousness) |
| 17 | Vyatipata | (Severe inauspiciousness) |
| 19 | Parigha | (Severe inauspiciousness) |
| 27 | Vaidhriti | (Severe inauspiciousness) |

**Visha Ghati nuance**: MC notes each inauspicious yoga contains a specific
Visha Ghati (poison period). Some practitioners discard only that portion rather
than the entire yoga day. Our engine does not model sub-yoga periods yet.

**Our implementation**: Soft penalty (-3 points). Not a hard veto because:
(a) yogas change within a day (a window may catch a different yoga than sunrise),
(b) the Visha Ghati nuance suggests the entire yoga is not uniformly bad, and
(c) the lagna antidote (Jupiter/Venus in kendra) can neutralise yoga defects
per MC itself.

---

## 5. Karanas

### Forbidden

**All classical sources agree:**
- **Vishti (Bhadra)**: Most severely inauspicious. Hard penalty (-5).
- **Sthira karanas** (Shakuni, Chatushpada, Naga): Inauspicious (-3).

### Auspicious

- **Chara karanas** (Bava, Balava, Kaulava, Taitila, Gara, Vanija): Favourable.
  Taitila specifically noted as "propitious for marriage" (MC).
- **Kimstughna**: Auspicious sthira karana (+2).

---

## 6. Planetary Restrictions

### Venus Combustion (Shukra Asta)

**Muhurta Chintamani + Dharmasindhu**: Marriage absolutely forbidden when Venus
is combust (within ~10° of the Sun, ~8° if retrograde). Venus governs marriage
and conjugal happiness.

**Our implementation** (`classical-checks.ts → checkVivahCombustion`):
**Hard veto.** Checked once per day using `computeCombust()` with BPHS orbs
(Venus 10°/8° retro, Jupiter 11°). If either planet is combust, the entire
day is skipped for samskaras (marriage, engagement, griha pravesh, upanayana,
namakarana, mundan). Non-samskara activities (travel, business, etc.) are
unaffected.

Verified against Meeus planetary positions:
- Jan-Feb 2026: Venus combust (2.0° to 9.5°) → 0 marriage dates
- Jul 2026: Jupiter combust (10.5°) → only dates before/after peak affected
- Mar-Jun, Aug-Dec 2026: both clear → normal scoring

### Jupiter Combustion (Guru Asta)

**Muhurta Chintamani + Dharmasindhu**: Marriage forbidden when Jupiter is
combust. Jupiter governs dharma and progeny.

**Our implementation**: Combined with Venus check above. Same hard veto.

### Chaturmas

**Dharmasindhu**: Marriage prohibited during Chaturmas (Ashada Shukla Ekadashi
to Kartik Shukla Ekadashi, approximately July-November).

**Our implementation** (`classical-checks.ts → checkChaturmas`):
Uses `getLunarMasaForDate()` to identify the Amanta month. Shravana (month 4)
and Bhadrapada (month 5) are fully within Chaturmas — **hard veto** for
samskaras. Ashadha (3) and Ashwina (6) are partial edge months — noted in the
UI as "fewer auspicious days" but not hard vetoed (the exact Ekadashi boundary
varies by year).

### Adhika Masa

**Dharmasindhu**: Marriage prohibited during Adhika (intercalary) Masa.

**Our implementation** (`classical-checks.ts → isAdhikaMasa`):
**Hard veto** for samskaras. Uses `getLunarMasaForDate()` which checks whether
the lunar month contains a solar ingress (sankranti). If not, it's Adhika.
Verified: May 2026 has Adhika Jyeshtha (~May 19 to June 13) → 0 marriage
dates during that period.

---

## 7. Lagna (Ascendant at Marriage Time)

**Muhurta Chintamani**: "Even where other favourable conditions are not present,
a properly chosen lagna will remove the defects." This makes lagna the most
powerful single factor.

- Recommended: Mithuna (Gemini), Kanya (Virgo), Tula (Libra).
- Also favourable: Vrishabha (Taurus), Karka (Cancer), Dhanu (Sagittarius),
  Meena (Pisces).
- Venus/Mercury/Jupiter in ascendant "completely destroy all other adverse
  influences."

**B.V. Raman**: Taurus through Libra + Pisces. 8th house must be unoccupied.
7th house should be vacant (exception: waxing Moon).

**Brihat Samhita Ch. 103**: Godhuli Lagna (evening, when cows return home)
overrides ALL other factors — "the character of the Nakshatra need not be
considered."

**Our implementation** (`classical-checks.ts → scoreLagna`):
Computed per window using `calculateAscendant()` (tropical → sidereal via
`toSidereal()`). With 3-hour windows, lagna transits ~1.5 signs per window,
so the midpoint lagna is approximate but directionally correct.

Vivah lagna scores (-3 to +8):
- +8: Mithuna (3), Kanya (6), Tula (7) — MC top picks
- +6: Vrishabha (2) — Venus-ruled
- +5: Karka (4), Dhanu (9), Meena (12) — MC "also favourable"
- +2: Simha (5) — neutral
- +1: Makara (10), Kumbha (11) — Saturn-ruled, neutral
- -2: Mesha (1) — Mars-ruled, aggressive
- -3: Vrischika (8) — Mars-ruled, 8th natural sign

The lagna score contributes up to 8 points to the raw total, making it the
highest single-factor contributor after the 25-point category caps. This
reflects MC's statement that lagna is the most powerful factor.

**Krishna Paksha conditional logic**: Krishna Paksha penalty is now modulated
by nakshatra quality AND lagna score. If the nakshatra is in the good list and
lagna score >= 5, the Krishna penalty is only -1 (allowed by tradition). If
nakshatra is good but lagna is weak, penalty is -3. If nakshatra is also bad,
penalty is -6. This implements the classical principle that excellent supporting
factors can compensate for Krishna Paksha.

---

## 8. Panchaka

When Moon transits nakshatras 23-27 (Dhanishtha through Revati), Panchaka is
active. This is inauspicious for all auspicious activities.

**Our implementation**: -5 penalty when nakshatra is in 23-27 range.

---

## 9. Additional Inauspicious Periods

### Rahu Kaal

Standard 1/8th of daylight. Based on weekday rotation from Muhurta Chintamani.
Windows during Rahu Kaal: -5 penalty. Windows outside: +3 bonus.

### Yamaganda, Gulika Kaal

Modelled in `inauspicious-periods.ts`. Applied as subtractive scoring in V2.

### Abhijit Muhurta

The 8th muhurta of the day (~11:36-12:24 local time). Auspicious except on
Wednesdays per some texts. Not yet modelled as a bonus in the scanner.

---

## Summary: Hard Vetoes vs Soft Penalties

| Factor | Treatment | Textual Basis |
|--------|-----------|---------------|
| **Venus/Jupiter combust** | **Hard veto** (skip entire day) | MC + Dharmasindhu explicitly forbid for samskaras |
| **Avoided nakshatras** | **Hard veto** (score = 0) | Strong consensus: MC Ch. 6, Raman, Jyotirnibandha |
| Lagna | **+8 to -3** (strongest soft factor) | MC: "a properly chosen lagna removes all defects" |
| Krishna Paksha | **Conditional** (-1 to -6) | No text forbids; penalty depends on nakshatra + lagna quality |
| Tuesday | Soft penalty (-4) | MC and Raman exclude; MC deprioritises weekdays |
| Saturday | Soft penalty (-3) | Not forbidden in MC; omitted from auspicious lists |
| Sunday | Soft penalty (-1) | MC lists as auspicious; Raman omits |
| Inauspicious yogas | Soft penalty (-3) | MC forbids but notes Visha Ghati nuance + lagna antidote |
| Rikta tithis | Soft penalty (-5) | MC explicitly forbids 4th, 9th, 14th |
| Vishti karana | Soft penalty (-5) | Universal prohibition |
| Panchaka | Soft penalty (-5) | Traditional prohibition |
| **Chaturmas** (Shravana/Bhadrapada) | **Hard veto** (skip entire day) | Dharmasindhu: Harishayana period |
| **Adhika Masa** | **Hard veto** (skip entire day) | Dharmasindhu explicitly forbids |
| Navamsha Shuddhi | **+4 to -2** (half lagna weight) | MC: emphasised over Lagna Shuddhi for Vivah |

---

## Gaps and Future Enhancements

1. **Precise Chaturmas Ekadashi boundaries** — currently uses month-level
   approximation. Exact Devshayani/Prabodhini dates need tithi table lookup.
4. **Tithi-gandanthara** — junction periods between specific tithis.
5. **Godhuli Lagna** — universal override per Brihat Samhita Ch. 103.
6. **Pushya special case** — flag as "generally auspicious but disputed for Vivah."
7. **Planets in ascendant** — Venus/Mercury/Jupiter in lagna "destroy all adverse
   influences" per MC. Requires checking planetary house at window time.
8. **8th house vacancy** — Raman: 8th house must be unoccupied at marriage time.
