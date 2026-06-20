---
title: Why I Am Building Dekho Panchang — A Founder's Note From Switzerland
published_at: DRAFT — review then publish
target: Medium (also dev.to as cross-post)
canonical_url: https://dekhopanchang.com/blog/founders-note   # if/when we host
tags: indianstartup, jyotish, vedic, opensource, founder
cover_image: TBD — a photo of a panchang almanac on a desk, soft daylight
author: Aditya Kumar Jha
brand_url: https://dekhopanchang.com
---

# Why I Am Building Dekho Panchang — A Founder's Note From Switzerland

I write this from a desk in Corseaux, a village on the north shore of Lake Geneva. I am building a Hindu calendar.

That sentence sounds absurd until you sit with it. The Vedic Panchang — the five-element calendar of *tithi*, *nakshatra*, *yoga*, *karana*, and *vara* — is one of the oldest continuously-maintained timekeeping systems on Earth. The math behind it was already mature when the *Surya Siddhanta* was composed around 400 CE. Astronomers in Ujjain refined it for a thousand years. The calendar is older than most countries.

And yet, when I went looking for a Panchang application I would actually trust to plan my mother's puja, I could not find one. Most of them feel like spreadsheets dressed up in saffron-coloured CSS. Some show different answers on different pages of the same site. Most cannot tell you why a tithi started when it did.

I started [Dekho Panchang](https://dekhopanchang.com) to be the version I wanted to use.

## What "trust" means in a Panchang application

When you ask a Panchang app what tithi is running right now, you are asking three intertwined questions:

1. **What is the elongation between the Sun and Moon at this exact moment, from this exact location?** This is an astronomical question. The answer is a number.
2. **What classical rule applies to that number on this day?** This is a *Jyotish* question. The answer is a tradition.
3. **What does it mean for what I should do next?** This is a human question. The answer is a counsel.

The first question is solved physics. Computers do it in milliseconds. The second question is solved by 2,500 years of textual tradition — *Brihat Parashara Hora Shastra*, *Dharmasindhu*, *Nirnaya Sindhu*, *Phaladeepika*, *Jataka Parijata*. The third question is the one the existing apps mostly skip.

What I want to build is the version that takes all three questions seriously.

## What that means in code, in practice

Every calculation on Dekho Panchang is derived from first principles. Planetary positions, tithi boundaries, nakshatra transitions, sunrise / sunset times, dasha dates — all calculated using peer-reviewed astronomical algorithms and verified against independent reference data before release.

There are no external astrology APIs. Every result you see on the site is a direct product of mathematics, running on our servers, from the parameters you provide. This means every result is fully reproducible: given the same date, time, and geographic coordinates, the same calculation will always produce the same answer.

Specifics:

- **Sub-arcsecond accuracy** on planetary positions when the Swiss Ephemeris is available; ~0.01° on the Sun and ~0.5° on the Moon when the fallback path is used.
- **Sunrise and sunset within ±1 minute** of NASA solar tables and the United States Naval Observatory data, for every test location we have tried.
- **Festival dates verified** against the Indian Government's official Saka calendar — Diwali, Holi, Janmashtami, Karva Chauth, Ekadashi, all of them.
- **Dasha date precision at the millisecond level** — no month-truncation drift over multi-decade dasha periods.
- **Timezone resolved from coordinates only** — never from the browser. If you were born in Bombay in 1979, the Panchang knows India ran on UTC+5:30 then. If you were born in Ulm in 1879, it knows Germany had no zone standardisation yet and uses longitude-based local mean time.

The methodology — every algorithm, every classical text we draw on, every accuracy tolerance — is on the [methodology page](https://dekhopanchang.com/en/about/methodology). It is the only honest answer to "why should I trust your number over their number."

## Why Switzerland

People sometimes ask why I am building a Hindu calendar from Switzerland. The honest answer is: I live here, but the work has nothing to do with where I sit.

The Panchang is location-aware in a way most digital products are not. Mumbai's tithi at 6 PM today is not Bangalore's tithi at 6 PM today. Delhi's sunrise is not Hyderabad's sunrise. London's full moon rises three hours after Chennai's. The whole point of the engine is to compute the right answer for *your* coordinates, not to assume Delhi as a default. That requirement makes the geographic origin of the developer almost irrelevant — what matters is whether the engine handles every location correctly.

Practical consequence: Dekho Panchang has never assumed India. It works the same for a user in Varanasi, in Toronto, in Singapore, in Dubai, in Vevey. Sunrise computed correctly, tithi computed correctly, festival dates resolved against the local timezone the same way. The Switzerland desk is a feature, not a footnote.

## The cultural problem I keep coming back to

The Panchang is not a luxury product. It is a daily reference for millions of households for what to do, what to avoid, what kind of day is ahead. Wrong answers have consequences — a wedding muhurta computed against the wrong city, an Ekadashi observed on the wrong day, a Shraddha ritual offered at the wrong tithi.

The legacy Panchang industry has lived for years on calendars printed once a year, sometimes by hand, often without the tools to verify against contemporary astronomy. When that industry moved online, it mostly digitised the same approximations. The result is a category where the apps are widely used, widely trusted, and quietly wrong in places that nobody bothers to check.

I want to change the floor. Not by being louder — by being correct.

## The roadmap, briefly

The Panchang is the spine. Around it Dekho Panchang has:

- **Free Janma Kundali** (birth chart) generation with the North Indian diamond chart, full *vargas* (D-1 through D-60), *Shadbala*, *Ashtakavarga*, 30+ classical yogas detected with frequency-validated conditions, *Tippanni* interpretive commentary in English and Hindi.
- **Muhurta** finding for 20+ activities, scored across 9 inauspicious-period checks (*Rahu Kaal*, *Yamaganda*, *Gulika*, *Vishti karana*, *Panchaka*, *Abhijit availability*, etc.).
- **Festivals** for the next five years per the Amanta and Purnimanta conventions, with the full *Kala-Vyapti* (time-prevalence) rules from *Dharmasindhu* and *Nirnaya Sindhu*.
- **Matching** via the Ashta Kuta 36-point compatibility system.
- **Regional calendars** — Bengali, Tamil, Telugu, Malayalam, Kannada, Gujarati, Marathi, Maithili, Mithila, Odia, ISKCON variants.

All free. All computed live, server-side, from the user's coordinates.

## What I want from you, if you read this far

If you use a Panchang regularly — at the start of a fast, before a journey, before a major decision — try [Dekho Panchang](https://dekhopanchang.com) for a week. Compare it against whatever you use today. Tell me what is wrong.

The fastest way to improve a precision tool is to find a user who notices when the third decimal is off. I am looking for those users.

If you are a Jyotish scholar — if you read *Brihat Parashara Hora Shastra* in Sanskrit, if you maintain a school of Panchang interpretation, if you train students in classical reasoning — I would love to talk. The engine has a methodology, but the interpretive layer is where the real work is. I am building it carefully and I would rather build it with you than around you.

If you are a developer who works on Indian-origin software and runs into the same "wrong because the tools were never built right" problem — get in touch. There is a small community of people quietly trying to do this work to a higher standard than the field has historically expected. We should know each other.

## A note on names

The brand is *Dekho Panchang* (देखो पंचांग) — literally "see the calendar," in the imperative. The name comes from how my grandmother used to ask anyone in the room to read the Panchang aloud before a household event: *"देखो, आज क्या तिथि है?"* — *"See, what tithi is today?"*

I built this for that reading.

---

*Aditya Kumar Jha founded [Dekho Panchang](https://dekhopanchang.com) in 2026. He writes from Corseaux, Switzerland. Reach him at the contact form on the site.*
