---
title: "Sixty Names, Two Translations, One Disagreement"
published: false
description: "An evening with the Brihat Parashara Hora Shastra, a 1950 translation, a 2021 translation, and the small judgment call that sits in a constants file."
tags: jyotish, sanskrit, typescript, software-craft
---

Last Thursday I sat down to type sixty names into a TypeScript file.

The names come from the Brihat Parashara Hora Shastra, Chapter 6, verses 33 through 41. They're the deities of the Shashtiamsha — the sixtieth divisional chart of a Hindu birth chart, called D60. Each rashi is divided into sixty half-degree segments, and every segment has a name. Ghora. Rakshasa. Devadeva. Kulaghna. Yakshini. There's a Mrityu in there (death), a Vishadagdha (poison-burned), a Kapata (deception). And then a Mridu (gentle), Sumukha (well-faced), Mahishi (queen-consort). Sixty altogether. Some sound like things you'd cross the street to avoid. Some sound like things you'd name a baby after.

The chapter is short. Maitreya asks Parashara how to read a chart at the finest level of division, and the answer is: each segment has a deity, the planet falling into the segment takes on the deity's flavor, and that flavor modulates everything else in the chart. It's the most subtle interpretive layer the system has. Older practitioners usually look here last, after the gross indications have been worked out.

You'd think, given how important the chapter says this is, that every modern jyotish software would carry these sixty names somewhere. Most don't.

What they carry is the geometry. The sixtieth division itself, computed correctly. JHora has it. So do KPStarOne and most India-based commercial apps. The math is there. What's not there are the names. Just the planets in their sub-positions, with no indication that the sub-position itself has a name and that name was once important enough that Parashara dictated all sixty to his student.

I went looking for the source. The standard reference is R. Santhanam's English translation, published in two volumes in the early 1990s, scanned and hosted on the Vedpuran archive. The verses are in shloka-and-translation format: Sanskrit on the left, prose on the right. Santhanam translates verbatim, including a small marginal aside Parashara adds about reversal — "the order is reversed for even rashis." So the deity at degree 0 of Aries (Ghora) is the deity at degree 30 of Taurus, working backwards.

I sat with the PDF and typed all sixty names into a constants file. Devanagari, Sanskrit transliterated, English label, start and end degree of the segment. A comment header at the top citing chapter and verses. About two hours of work, most of it copy-paste from a Chrome tab that had Devanagari rendering in a way that subtly broke six of my entries; I didn't notice until five hours later when I was redoing them.

Halfway through I hit a problem.

The BPHS lists the deity names. It does not classify each one as Krura (harsh, malefic) or Saumya (gentle, benefic). That classification comes from a different and later text — Phaladeepika, by Mantreshwara, written sometime in the eleventh or twelfth century. Phaladeepika has a verse that gives the position numbers of the Krura subs. Modern software builds the malefic/benefic flag from this verse. So I went to look it up.

The two English translations of Phaladeepika I could find disagreed at one position.

V. Subrahmanya Sastri's 1950 edition, scanned on the Internet Archive, lists position 18 as Krura. Pandit Gopesh Kumar Ojha's 2021 edition, sold by an Indian publisher with a press run still in print, lists position 16. Everything else matches across the two translations. Both translators are well-respected. One of them is wrong.

The Sanskrit original would have resolved it, except Sanskrit metrical shlokas compress meaning in ways that need surrounding context to disambiguate, and you can't always tell from the verse alone which interpretation is intended. I'm not a Sanskrit scholar — I have the script training every Maithil Brahmin gets in childhood, and I read shlokas slowly with a dictionary at hand. As best I could tell, Mantreshwara's verse is talking about position counted with respect to the segment's directional flow, which is where the two translators read it differently.

I spent another two hours here. In the end I picked the older translation, 1950 Sastri, on the principle that the older edition is generally closer to the manuscript witnesses. I left a comment in the file saying which way I'd gone and why. The comment also notes that the next reader can override the choice with a flag if they prefer Ojha's reading. It felt important to write it down rather than commit to it silently.

Then I checked the apps. KPStarOne, JHora, three Indian commercial astrology programs, and two online "free D60 calculator" sites. None of them mentioned the disagreement. Three used position 18. Two used position 16. JHora didn't classify the deities at all — it just shows the name without saying whether the planet falling on that name is meeting a friendly figure or an angry one.

This is the part of modern jyotish software that surprises me the most. Not the math — the math is mostly right. The math is the easy part. The hard part is the interpretive layer, and the interpretive layer is held together with citations nobody has reconciled. The differences are small in any individual chart. They accumulate into systematic differences in how the same chart gets read across the software ecosystem, and nobody is keeping score.

I could have asked an LLM to generate the sixty names. I tried it once just to see what would happen. GPT-5 gave me a list. Forty-three of the names were exactly right. Eleven were misspelled — Devanagari is fragile under LLM noise, because the attention space for similar-looking but semantically different consonants is overloaded; Mahisha and Mahishi and Mahesha all sit in roughly the same neighborhood. Six were entirely invented. Names that aren't in BPHS, that sound like deity names but aren't deity names, plausible-sounding hallucinations. If I'd copied that list without checking, the chart it produced would have been confidently wrong.

The hand-typed file is two hours and a header note. It works. It cites verses. The judgment about position 18 vs 16 is documented where the next reader can find it.

The thing I keep noticing, after a year of building software around old texts, is that ancient texts are not really data sources. They're decisions. Every transcription is a chain of small calls — which manuscript witness, which translation, which English convention for a rare name — and most of those calls are silent in modern software. The way to be honest about them, as far as I can tell, is to write them down somewhere a future reader will see. Comments at the top of constants files are doing more work in my codebase than I expected.

The sixtieth division isn't what gets a casual user curious about astrology. Nobody opens an app to look up their D60. But for a system that claims to compute Vedic astrology from first principles, the choice between treating the interpretive layer as data or as a series of decisions is the choice between an oracle and a calculator. An oracle's work, it turns out, is mostly typing.

---

*Code: `src/lib/constants/d60-deities.ts` in [dekhopanchang.com](https://dekhopanchang.com?utm_source=medium&utm_medium=article&utm_campaign=d60-deities). 244 lines. Header citations to BPHS 6.33-41 and the two Phaladeepika translations.*
