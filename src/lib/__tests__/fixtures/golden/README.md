# Golden Dataset — Jyotish Accuracy Fixtures

Purpose: lock our astronomical + Jyotish calculations to a reference source so
regressions surface in CI, not in user reports.

## Reference sources

Per CLAUDE.md we compare against **Prokerala** and **Shubh Panchang** (not Drik),
for the SAME location, on the SAME date, with Lahiri ayanamsha.

## Format

Each fixture file is `{category}-{location-slug}-{YYYY-MM-DD}.json`.

```json
{
  "source": "Prokerala",
  "sourceUrl": "https://www.prokerala.com/astrology/panchang/...",
  "capturedAt": "2026-04-16T10:00:00Z",
  "location": {
    "name": "Vevey, CH",
    "lat": 46.464,
    "lng": 6.843,
    "tzOffset": 2
  },
  "date": "2026-04-16",
  "expected": {
    "sunrise": "06:42",
    "sunset":  "20:18",
    "tithi":     { "name": "Krishna Chaturthi", "id": 19 },
    "nakshatra": { "name": "Uttara Ashadha", "id": 21 },
    "yoga":      { "name": "Vaidhriti", "id": 27 },
    "karana":    { "name": "Bava", "id": 1 },
    "rahuKaal":    { "start": "10:30", "end": "12:00" },
    "yamaganda":   { "start": "13:30", "end": "15:00" },
    "gulikaKaal":  { "start": "09:00", "end": "10:30" }
  },
  "tolerances": {
    "timeMinutes": 2
  }
}
```

`tzOffset` is a plain hours-offset-from-UTC number (e.g. `2` for CEST, `5.5` for IST).
Use the value in effect for that specific date (respect DST).

## Test pattern

See `src/lib/__tests__/golden-panchang.test.ts` for the template. Fail if any
value is outside tolerance; include the Prokerala URL in the assertion message
so a human can verify quickly.

## Capturing fixtures

Do NOT fabricate values. The process is:

1. Open the Prokerala panchang page for the target location + date
2. Screenshot → store in `fixtures/golden/screenshots/`
3. Transcribe exact values into the JSON
4. Cite source URL + capture timestamp

## Coverage targets (priority order)

- [ ] Sunrise/sunset — 3 locations × 4 dates (DST boundary, summer/winter solstice)
- [ ] Tithi end times — 10 samples across a lunar month
- [ ] Nakshatra transitions
- [ ] Rahu Kaal / Yamaganda / Gulika Kaal
- [ ] Kundali — 5 reference charts (Lagna + 9 planets)
- [ ] Vimshottari Mahadasha boundaries for 5 nakshatras at specific longitudes
- [ ] Sade Sati phase detection (pre, peak, post)
- [ ] Ashta Kuta matching — 5 pair fixtures with Prokerala scoring
