---
title: "When the Tithi Wins: Bhai Dooj, Kala-Vyapti, and the Tie-Break Hiding in Plain Sight"
published: true
published_url: "https://medium.com/@aditya.kr.jha/hindu-festival-tithi-rules-e7cc0c927b75"
published_at: "2026-06-11"
description: "An afternoon with Kartika Shukla Dwitiya, two classical readings of the same Sanskrit rule, and the calendar machinery that has to choose between them."
tags: jyotish, sanskrit, typescript, software-craft
---

I was migrating our regional calendar pages from hand-coded festival dates to engine-computed ones when I noticed Bhai Dooj for 2026 was floating between two answers. The default behaviour of our engine put it on Wednesday the 11th of November. The Maithili village tradition I grew up around treats Tuesday the 10th as the day. The published Indian panchangs — the references most families pull off the shelf to cross-check — say Wednesday the 11th.

Two answers, both classically defended, both with a paper trail running back through medieval Sanskrit jurisprudence. The calendar has to pick one, and the picking turned out to be more interesting than I expected when I started.

A tithi is not a day.

A tithi is the duration during which the Moon moves twelve degrees of longitude away from the Sun. The Moon's orbit is elliptical, so the duration isn't constant. It varies between about twenty hours at the fastest and twenty-seven at the slowest. The average is twenty-three hours and thirty-seven minutes. Almost never a clean multiple of the solar day.

So a tithi spans, on most days, two Gregorian dates. It begins partway through one day, runs across the night, ends partway through the next.

For someone computing when a festival happens, this is the central problem. Bhai Dooj is observed on Kartika Shukla Dwitiya. In November 2026, Dwitiya began at 2:00 PM IST on Tuesday the 10th and ended at 3:53 PM on Wednesday the 11th. Both days have Dwitiya in them. Neither has it the whole way through. Which is the Bhai Dooj day?

The Sanskrit legal tradition has a name for this question. *Kala-vyapti*, time-prevalence. A festival has a designated time window during the day, and the tithi has to be present (vyapta) during that window for the rite to be observed on that day. The windows aren't arbitrary. Each one maps to the time of day when the festival's central act is supposed to happen.

Diwali is observed when Amavasya is present in *pradosh*, the ninety-six minutes after sunset, because the Lakshmi Puja happens at twilight.

Maha Shivaratri is observed when Chaturdashi is present in *nishita*, around midnight, because the rite is the night vigil.

Ram Navami is observed when Navami overlaps *madhyahna*, the third fifth of daytime, because Ram is said to have been born at noon.

Bhai Dooj is observed when Dwitiya is present in *aparahna*, the fourth fifth of daytime, mid-to-late afternoon, because the rite is the sister's visit and the tilak. The brother walks across town, the sister applies the mark, the meal is eaten. It's a daytime ritual, anchored to the post-meridian window.

Our code didn't have this layer for Bhai Dooj.

The festival definition was this:

```ts
{ masa: 'kartika', paksha: 'shukla', tithi: 2, slug: 'bhai-dooj',
  type: 'major', category: 'festival' }
```

No muhurta rule. When the field is absent, our engine defaults to the sunrise rule — the most common one, classically called *Udaya Tithi*: pick the day where the tithi is present at the moment of sunrise. For most festivals that default is right. For Bhai Dooj it isn't, because the sunrise rule lets a festival land on a day where the tithi happens to be present at six in the morning but doesn't see the afternoon at all. That's not when the rite happens. So the first move was to teach the engine that Bhai Dooj is aparahna-vyāpinī:

```diff
- { ..., type: 'major', category: 'festival' }
+ { ..., type: 'major', category: 'festival', muhurtaRule: 'aparahna' }
```

This is the uncontroversial part. The classical literature is unambiguous that Bhai Dooj attaches to the aparahna kaal, not to sunrise. Dharmasindhu (1790) says so. Nirnayasindhu (1612) says so. Hemādri (13th century) says so. Every published Indian panchang that displays a muhurat time for Bhai Dooj displays the aparahna window. The rule itself isn't contested.

What's contested is what to do when the tithi is present in the aparahna window on *both* candidate days.

For November 2026, Dwitiya enters Tuesday the 10th's aparahna window late — around 2:00 PM, with aparahna ending near 3:20 PM. That's about eighty minutes of overlap. Dwitiya then spans the entire aparahna window on Wednesday the 11th — full sunrise-to-3:20 PM presence, with aparahna ending at 3:20 PM and Dwitiya itself ending at 3:53 PM. About a hundred and thirty minutes of overlap. Both days qualify under the bare rule. The tie-break decides which one wins.

The classical jurists sorted tie-breaks into three families.

*Pūrva-vyāpinī*. First-touch. If the tithi is present in the window on Day 1 at all, even briefly, observe on Day 1.

*Para-vyāpinī*. Second-day. The opposite reading: if the tithi extends into Day 2's window at all, observe on Day 2.

*Bhūyo-vyāpinī*. Majority-span. Observe on whichever day the tithi occupies the larger fraction of the window. The window itself is what's being measured — whichever day the tithi covers more of it.

Each major festival has its tie-break assignment worked out in the medieval legal corpus. For some festivals there's no real disagreement. Pradosh-vyāpinī Amavasya for Diwali, for instance — every lineage agrees this is pūrva-vyāpinī, because by Day 2's pradosh the new lunar day has effectively begun in the lunar-day sense. Nishita-vyāpinī Chaturdashi for Maha Shivaratri is the same — pūrva-vyāpinī, no contest.

For Bhai Dooj's aparahna-vyāpinī Dwitiya, the lineages disagree. The Maharashtrian Dharmasindhu lineage reads it as pūrva-vyāpinī — if Dwitiya enters Day 1's aparahna at all, Day 1 wins. The broader Nirnayasindhu tradition that the mainstream Indian panchang ecosystem follows reads it as bhūyo-vyāpinī — the day with majority aparahna-overlap wins. November 2026 is exactly the year these two readings disagree. November 10 if you read with the Maharashtrian-Maithili lineage; November 11 if you read with the published Indian panchang.

Both are classical. Both are textually defended. Neither is "the bug."

The question for the calendar engine became which reading to encode as the default. The choice is a value judgment, not a fact about the texts. We chose the bhūyo-vyāpinī reading, because the calendar's job for our users is to land where the panchang on their bookshelf lands. If their grandmother is observing on November 10 with the family elders, the calendar disagreeing with the panchang she also has open doesn't help — it just makes our app look broken.

So the second change was the tie-break logic:

```ts
if (overlap1 > 0 && overlap2 === 0) {
  // Day 1 wins
} else if (overlap1 > 0 && overlap2 > 0) {
  if (['pradosh', 'nishita'].includes(rule) || overlap1 >= overlap2) {
    // Day 1 wins
  }
  // else Day 2 wins (bhūyo-vyāpinī default)
}
```

`pradosh` and `nishita` are on the priority list because they actually are pūrva-vyāpinī by classical consensus — the night portion of Day 1 is the "real" night for the lunar day; Day 2's same window has already moved past it. `aparahna` is not on that list, because it's the contested one, and the mainstream reading takes the bhūyo-vyāpinī path.

For Bhai Dooj 2026, the math runs:

> Tuesday Nov 10: Dwitiya in aparahna ≈ 80 minutes (overlap1)
> Wednesday Nov 11: Dwitiya in aparahna ≈ 130 minutes (overlap2)
> Neither rule is in the pūrva-vyāpinī priority list. overlap1 < overlap2.
> Day 2 keeps the date. November 11.

Which is what the published Indian panchangs say.

The Maithili kitchen-table answer is still November 10. That tradition is reading the same classical rules but with the Dharmasindhu tie-break. It's not wrong; it's a different lineage choice. If we ever build out per-tradition calendars — a Maithili calendar, an Iyer calendar, a Bengali calendar with the regional vyapti picks — that'd be one of the rows. The default calendar lands where the published Indian panchang lands.

What sits underneath this is that the festival defs in our codebase aren't really configuration data. They're closer to a transcription of medieval Sanskrit jurisprudence into a different notation. The classical rule has two layers: the window the tithi has to occupy, and the tie-break when both candidate days qualify. The first layer is uncontroversial; the second is where lineages diverge. Encoding it in code is mostly catching up to the verses — but it's also picking, on the user's behalf, which classical reading the surrounding ecosystem already chose.

The Dharmasindhu has been on shelves since 1790. The Nirnayasindhu since 1612. The aparahna tie-break disagreement has been on shelves longer than the calendar app. The new part is just the encoding.

---

*Code: `src/lib/calendar/festival-defs.ts` and `src/lib/calendar/festival-generator.ts` in [dekhopanchang.com](https://dekhopanchang.com?utm_source=medium&utm_medium=article&utm_campaign=festival-rules). The muhurta rules sit on a `muhurtaRule` field with the kala-vyapti taxonomy documented inline.*
