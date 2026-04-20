# Personal Pandit v2 — Critical Review & Enhancements

## Self-Review of the Spec

### Strengths
- Correctly identifies the #1 bug (natal positions used as transits)
- Key Dates is a high-visibility, low-complexity feature users will love
- Emotional intelligence framework is concrete and actionable
- Daily cadence creates a reason to return every day (retention)

### Gaps Found on Review

**1. Missing: Yogini Dasha integration**
The app has a Yogini Dasha engine (seen in e2e tests). For many natives, Yogini Dasha is more accurate for timing than Vimshottari. The Key Dates and timeline should optionally factor in both dasha systems.

**2. Missing: Ashtakavarga transit scoring**
When Jupiter transits a house, its effect depends on how many bindus that house has in Jupiter's Sarvashtakavarga. A house with 5+ bindus = strong positive transit; 2 or fewer = weak/negative. This is THE standard technique for transit strength in classical Jyotish and is completely absent.

**3. Missing: Divisional chart transit confirmation**
When Saturn transits natal 10th house (career), also check where it falls in D10 (career divisional chart). Double-confirmation = much stronger signal.

**4. Missing: Nakshatra-level transit analysis**
Transiting planets through specific nakshatras have distinct effects beyond just rashi-level. Moon transiting Ashlesha (snake nakshatra) has different flavor than Moon in Pushya (nourishing). The daily layer should use nakshatra qualities.

**5. Missing: Dasha Sandhi (junction periods)**
The 2-3 months around a Mahadasha change are called "sandhi" — extremely turbulent. This should be a prominent Key Date with special handling (not just "dasha changes on X date" but "you're entering a 3-month transition zone starting [date]").

**6. Missing: Combustion/Retrograde status of transiting planets**
A retrograde Saturn transit is very different from direct Saturn transit. Combustion weakens a planet's ability to deliver results. The transit activation engine should factor this.

**7. Missing: Planetary War (Graha Yuddha)**
When two transiting planets are within 1° of each other, there's a planetary war. This can trigger sudden events in affected domains. Should be detected in Key Dates.

**8. Missing: Solar/Lunar return charts**
Varshaphal (solar return) is already built as a separate tool. Its key predictions should feed into the Personal Pandit's annual overlay, not exist as a disconnected tool.

**9. Missing: Remedial timing**
Remedies are more effective on specific days (planet's day), during specific nakshatras, or specific tithis. The remedy section should say "Chant this mantra on Saturdays during Saturn's hora" not just "Chant this mantra."

**10. Missing: Comparative context**
Users have no sense of "is 6.5/10 good for career?" Adding percentile context ("stronger than 72% of charts") gives meaning to abstract numbers.

---

## Enhanced Scope (Added, Not Removed)

### Addition 1: Ashtakavarga Transit Strength
For each slow-planet transit, compute Sarvashtakavarga bindus in the transited house. Weight the transit activation score by bindu count. This is a 5-line change in the transit activation module that massively improves accuracy.

### Addition 2: Dasha Sandhi Periods
Identify Mahadasha/Antardasha transition zones (±45 days from exact change). Mark as "transition period" in Key Dates with special narrator text explaining turbulence and how to navigate it.

### Addition 3: Retrograde-Aware Transit Scoring
When a transiting planet is retrograde:
- Reduce "new opportunity" signals
- Increase "revisit/redo" signals
- Career domain: delays but deepens
- Marriage domain: past connections resurface

### Addition 4: Nakshatra-Quality Daily Layer
The daily micro-reading should reference the quality of today's Moon nakshatra:
- Kshipra (swift) nakshatras = good for quick actions
- Ugra (fierce) = avoid initiating, good for competition
- Sthira (fixed) = foundation-laying, long-term planning
- Mridu (soft) = relationships, creativity, worship

### Addition 5: Percentile Context
After scoring a domain, run the same algorithm against 1000 synthetic charts (precomputed) to establish percentile bands. Store as a static lookup table. Then present: "Career: 7.8/10 (stronger than 78% of charts)."

### Addition 6: Remedy Calendar
Don't just list remedies — generate a weekly schedule:
- Monday: Moon remedy (for family/emotional domains)
- Tuesday: Mars remedy (for health/courage)
- Saturday: Saturn remedy (for career/longevity)
- Include specific hora windows per day

### Addition 7: Life Stage Calibration (Enhanced)
The narrator already has age-awareness vocabulary. Enhance to calibrate EXPECTATIONS:
- Age 18-25: Education + Career domains weighted higher
- Age 25-35: Marriage + Career + Children weighted higher
- Age 35-50: Career + Wealth + Health weighted higher
- Age 50+: Spiritual + Health + Family weighted higher

This adjusts the priority ranking algorithm, not just the language.

### Addition 8: Eclipse Shadow Period
Eclipses have a shadow period (±15 days) where effects manifest. Key Dates should show the full window, not just the eclipse date.

### Addition 9: Muhurta Integration in Key Dates
For positive Key Dates ("Jupiter enters career house"), also compute the single best muhurta window in the first week for taking action in that domain.

### Addition 10: "Your Year at a Glance" Mini-Calendar
A 12-month horizontal bar showing which months are strong (green), challenging (red), or neutral (gold) for each domain. Computed from dasha sub-periods + major transit positions per month. Shows on dashboard as a compact heatmap.

---

## Revised Implementation Order

| Phase | Tasks | Files | Est. Lines |
|-------|-------|-------|-----------|
| **1a** | Real transit activation + Ashtakavarga scoring | transit-activation.ts, scorer.ts | ~200 |
| **1b** | Varga delivery + Sade Sati + retrograde awareness | scorer.ts, synthesizer.ts | ~100 |
| **2a** | Key Dates engine (all 8 sources + sandhi + eclipse shadow) | key-dates.ts | ~300 |
| **2b** | KeyDatesTimeline UI component | KeyDatesTimeline.tsx | ~200 |
| **2c** | Integration into kundali page + dashboard | page.tsx, dashboard/page.tsx | ~80 |
| **3a** | Daily insights engine (panchang + Moon + hora + nakshatra quality) | daily-insights.ts | ~250 |
| **3b** | Priority ranking + daily section UI | LifeReadingDashboard.tsx | ~100 |
| **4a** | Emotional intelligence narrator + celebration + action plans | narrator-v2.ts | ~300 |
| **4b** | Percentile context (precomputed lookup) | percentile-table.ts | ~100 |
| **5a** | Question entry UI + remedy calendar | QuestionEntry.tsx, RemedyCalendar.tsx | ~200 |
| **5b** | Year-at-a-glance heatmap | YearHeatmap.tsx | ~150 |

**Total new code: ~2,000 lines across 12 files.**

---

## Testing Strategy

Each phase must pass before merging:

1. **Unit tests** — Key dates computation with known chart + known date → expected events
2. **Transit accuracy** — Compare transit positions against Prokerala for same date
3. **Scoring regression** — Ensure existing domain scores don't change by >1 point after fixes
4. **Visual regression** — Screenshot compare dashboard before/after
5. **Performance** — `synthesizeReading()` must complete in <100ms even with transit computation
6. **Locale** — All new text must have en + hi (other locales fall back via tl())
