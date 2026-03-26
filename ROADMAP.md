# Panchang Feature Roadmap

Feature gap analysis based on DrikPanchang.com audit. Organized in 4 priority tiers.

---

## Tier 1 — Must Have (Core Panchang Credibility)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| T1.1 | Transition Times | Tithi/Nakshatra/Yoga/Karana start & end times with binary search. Display "X upto HH:MM, then Y" | DONE |
| T1.2 | Choghadiya | 8-slot day + 8-slot night muhurat system (Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg). Split sunrise-sunset and sunset-next sunrise into 8 equal slots each | DONE |
| T1.3 | Hora | 24 planetary hours. Each hour ruled by a planet in weekday sequence (Sun→Venus→Mercury→Moon→Saturn→Jupiter→Mars cycle) | DONE |
| T1.4 | Amrit Kalam & Varjyam | Two daily time windows derived from Nakshatra/Vara combination. Amrit Kalam = most auspicious. Varjyam = avoid at all costs | DONE |
| T1.5 | Named Muhurtas | Brahma Muhurta (96 min before sunrise), Godhuli Muhurta (cow-dust time ~sunset), Nishita Kaal (midnight), Sandhya Kaal (twilight) | DONE |
| T1.6 | Disha Shool & Sarvartha Siddhi Yoga | Disha Shool: inauspicious direction per weekday. Sarvartha Siddhi: Nakshatra+Vara combinations that make all endeavors fruitful | DONE |

---

## Tier 2 — High Value (Differentiation Features)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| T2.1 | Horoscope Matching | Ashta Kuta / 36 Gunas matching (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi). Two birth charts input, compute compatibility score | DONE |
| T2.2 | Chandrabalam & Tarabalam | Chandrabalam: Moon transit strength from natal Moon. Tarabalam: Nakshatra-based daily strength. Both used for muhurat selection | DONE |
| T2.3 | Festival Calendar | Hindu festival dates with puja timings (Diwali, Holi, Navratri, Ganesh Chaturthi, Makar Sankranti, Janmashtami, etc.). Full year view | DONE |
| T2.4 | Vrat Calendar | Ekadashi, Sankashti Chaturthi, Pradosham, Purnima, Amavasya dates. Monthly view with parana (fast-breaking) times | DONE |
| T2.5 | Planet Transit Calendar | Sign change dates for all 9 planets through the year. Saturn, Jupiter, Rahu/Ketu transits are major events | DONE |
| T2.6 | Sade Sati Calculator | Standalone page: input Moon sign or birth data → full Sade Sati timeline (past + future cycles), current phase, intensity, remedies | DONE |

---

## Tier 3 — Nice to Have (Advanced Jyotish)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| T3.1 | Bhav Chalit Chart | Equal-house chart showing actual house cusps vs sign boundaries. Planets may shift houses compared to rashi chart | DONE |
| T3.2 | More Divisional Charts | D3 (Drekkana), D10 (Dasamsa), D12 (Dwadasamsa). Currently only D1 + D9 exist | DONE |
| T3.3 | Ashtakavarga | Sarvashtakavarga + Bhinnashtakavarga tables. Points system showing planetary strengths per house | DONE |
| T3.4 | Retrograde Calendar | Full-year retrograde schedule for all planets. Mercury retrograde dates, Saturn retrograde, etc. | DONE |
| T3.5 | Combustion Calendar | When planets get too close to Sun (combust/asta). Shows combustion start/end dates per planet | DONE |
| T3.6 | Eclipse Calendar | Solar & lunar eclipse dates, times, visibility maps, magnitude. Includes Grahan Kaal (inauspicious period) | DONE |
| T3.7 | Activity Muhurat Calendars | Dedicated muhurat pages: Marriage (Vivah), Griha Pravesh, Mundan, Vehicle Purchase, Travel, Property Purchase, etc. | DONE |

---

## Tier 4 — Eventually (Comprehensive Platform)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| T4.1 | Shraddha Calculator | Based on death tithi, calculates annual Shraddha date | DONE |
| T4.2 | Baby Name Suggester | Input birth nakshatra → suggest names starting with nakshatra syllables | DONE |
| T4.3 | Prashna Kundali | Horary chart cast for the moment of question. No birth data needed | DONE |
| T4.4 | Regional Calendars | Tamil/Telugu/Kannada/Bengali/Gujarati Panchang variants with regional month names and festivals | DONE |
| T4.5 | Vedic Time Display | Show current time in ghati/pala/vipala (1 day = 60 ghati = 3600 pala) | DONE |
| T4.6 | Upagraha Positions | Dhuma, Vyatipata, Parivesha, Chapa, Upaketu positions derived from Sun | DONE |
| T4.7 | Devotional Content | Daily mantra recommendations, stotra suggestions based on vara/tithi/nakshatra | DONE |
| T4.8 | Sun/Moon Sign Calculator | Standalone calculator: input DOB → show Sun sign and Moon sign (sidereal) | DONE |

---

## Already Implemented

| Feature | Description | When |
|---------|-------------|------|
| Core Panchang | Tithi, Nakshatra, Yoga, Karana, Vara at sunrise | v1 |
| 30 Muhurta Timeline | Day (15) + Night (15) muhurtas with deity, significance | v1 |
| Abhijit Muhurta | Highlighted 8th muhurta of the day | v1 |
| Inauspicious Times | Rahu Kaal, Yamaganda, Gulika Kaal | v1 |
| Planetary Positions | 9 planet positions with rashi, nakshatra, retrograde | v1 |
| Kundali Generator | Birth chart with D1, D9, Dasha, Shadbala | v1 |
| Tippanni System | Personality, planets, yogas, doshas, life areas, dasha insight, remedies, strength | v1 |
| Year Predictions | Sade Sati, Jupiter transit, Rahu-Ketu, dasha transitions, quarterly outlook | v2 |
| Learn Section | 9 sub-pages: foundations, grahas, rashis, nakshatras, tithis, yogas, karanas, muhurtas, kundali | v1 |
| Deep Dive Pages | Individual pages for each panchang element | v2 |
| Trilingual | English, Hindi, Sanskrit across all features | v1 |
| Custom SVG Icons | 27 nakshatras, 9 grahas, 12 rashis, panchang element icons | v1 |

---

## Notes
- All features must support trilingual (EN/HI/SA) content
- All calculations are pure JS (no external ephemeris APIs)
- Dark celestial theme with gold accents throughout
- Custom SVG icons preferred over emoji
- Mobile-first responsive design
