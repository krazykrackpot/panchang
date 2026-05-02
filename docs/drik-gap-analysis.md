# Drik Panchang Gap Analysis — Feature Parity Roadmap

**Date:** 2026-05-02
**Status:** Active implementation

## Priority 1: Devotional Content (Aarti/Chalisa/Stotram/Mantra)

**Gap:** Drik has 100+ aartis, chalisas, stotrams. We have a thin `/devotional` page.
**SEO Impact:** HUGE — "Ganesh Aarti lyrics" gets millions of searches.
**Plan:**
- Create `/devotional/aarti/[slug]` with 20+ popular aartis (Ganesh, Lakshmi, Hanuman, Shiva, Durga, Saraswati, Vishnu, Ram, Krishna, Santoshi Maa, etc.)
- Create `/devotional/chalisa/[slug]` with 10+ chalisas (Hanuman, Shiv, Durga, Ganesh, Saraswati, Lakshmi, etc.)
- Create `/devotional/stotram/[slug]` with 10+ stotrams (Vishnu Sahasranama, Lalita Sahasranama, Shiva Tandava, etc.)
- Create `/devotional/mantra/[slug]` with 15+ mantras (Gayatri, Mahamrityunjaya, Beej mantras for each graha, etc.)
- All content in Devanagari + English transliteration + English meaning
- Regional script support: Tamil, Telugu, Bengali, Kannada, Gujarati
- Audio pronunciation where possible
- Link from festival/vrat pages to relevant aartis

## Priority 2: Chandrabalam/Tarabalam Daily Page

**Gap:** Drik shows daily Moon/Star strength for all 12 rashis. We have partial SAV-based transit data.
**SEO Impact:** High — muhurta planners check this daily.
**Plan:**
- Create `/chandrabalam` tool page showing today's Chandrabalam (Moon strength) for all 12 rashis
- Create `/tarabalam` tool page showing today's Tarabalam (Star strength) for all 27 nakshatras
- Both should show: favorable/unfavorable/neutral status for each rashi/nakshatra
- Include on panchang page as a compact section

## Priority 3: Dinamana/Ratrimana/Ritu/Ayana on Panchang

**Gap:** Drik shows day/night duration, Hindu season, solar half-year. We don't.
**SEO Impact:** Medium — completeness signal for panchang pages.
**Plan:**
- Add to panchang computation: dinamana (day duration), ratrimana (night duration)
- Add Ritu (Hindu season): Vasanta, Grishma, Varsha, Sharad, Hemanta, Shishira
- Add Ayana: Uttarayana (Jan-Jul) / Dakshinayana (Jul-Jan)
- Display in PanchangClient alongside existing data

## Priority 4: More Regional Calendars

**Gap:** Drik has 8+ regional calendars. We have 3 (Tamil, Bengali, Mithila).
**SEO Impact:** High — regional language searches.
**Plan:**
- Add Telugu calendar (Ugadi new year, Telugu month names)
- Add Malayalam calendar (Vishu new year, Malayalam month names)
- Add Gujarati calendar (Kartik-starting year)
- Add Kannada calendar (Ugadi, Kannada month names)
- Add Assamese calendar (Bohag Bihu, Assamese month names)

## Priority 5: Ganda Mool Dates Page

**Gap:** Drik has a dedicated page listing all Ganda Mool nakshatra dates for the year.
**SEO Impact:** Medium — parents search this for newborns.
**Plan:**
- Create `/dates/ganda-mool` listing all dates when Moon enters Ganda Mool nakshatras
- Ganda Mool nakshatras: Ashwini, Ashlesha, Magha, Jyeshtha, Mula, Revati (junction nakshatras)
- Show date, time, duration, and which nakshatra
- Include learn page explaining significance + remedies

## Priority 6: Vrat Katha (Stories)

**Gap:** Drik has full vrat stories for each observance. We have significance text but not full stories.
**SEO Impact:** Medium — devotional traffic.
**Plan:**
- Create `/vrat-katha/[slug]` pages with full vrat stories
- Start with top 10: Ekadashi Katha, Satyanarayan Katha, Karva Chauth Katha, Pradosh Katha, Somvar Vrat Katha, Mangalvar Vrat Katha, Santoshi Maa Vrat Katha, Shivratri Katha, Gangaur Katha, Ahoi Ashtami Katha
- Content in Hindi (Devanagari) + English translation
- Link from each vrat/festival page to its katha

## Priority 7: ISKCON Calendar

**Gap:** Drik has a dedicated ISKCON/Vaishnava calendar.
**SEO Impact:** Medium — dedicated ISKCON audience.
**Plan:**
- Create `/calendar/regional/iskcon` page
- ISKCON follows Gaurabda calendar (from Chaitanya Mahaprabhu's appearance)
- Key dates: Ekadashi fasting (ISKCON follows next-day if Ekadashi <50% at sunrise), Appearance/Disappearance days of Vaishnava acharyas, Gaura Purnima, Janmashtami, Ratha Yatra
- Different Ekadashi rules from Smarta tradition — must highlight this

## Priority 8: Rudraksha Calculator

**Gap:** Drik has a Rudraksha recommendation tool.
**SEO Impact:** Low — niche.
**Plan:**
- Create `/rudraksha` tool page
- Based on birth nakshatra and lagna, recommend Rudraksha mukhi (1-21 faces)
- Include descriptions, mantras, benefits for each type

## Priority 9: Pancha Pakshi Calculator

**Gap:** Drik has a Pancha Pakshi (5 birds) activity timing system.
**SEO Impact:** Low — South Indian niche.
**Plan:**
- Create `/pancha-pakshi` tool page
- 5 birds: Vulture, Owl, Crow, Cock, Peacock
- Based on birth nakshatra and weekday, determine which bird is active
- Each bird has 5 activities in rotation: ruling, eating, walking, sleeping, dying
- Popular in Tamil Nadu

## Additional Quick Wins (from gap analysis)

- **Bhadra Vichar page** — detailed Vishti/Bhadra Karana analysis
- **Jwalamukhi Yoga detection** — add to special yogas
- **Anandadi Yoga** — Tamil daily yoga system (11 yogas)
- **Vinchudo** — Gujarati auspiciousness indicator
- **Kranti Samya Dosha** — declination-based dosha calculator
