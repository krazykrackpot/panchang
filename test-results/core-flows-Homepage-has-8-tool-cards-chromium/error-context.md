# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows.spec.ts >> Homepage >> has 8 tool cards
- Location: e2e/core-flows.spec.ts:33:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Muhurta AI')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Muhurta AI')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - navigation "Main navigation" [ref=e3]:
    - generic [ref=e5]:
      - link "Dekho Panchang" [ref=e6] [cursor=pointer]:
        - /url: /en
        - generic [ref=e7]:
          - img [ref=e8]
          - img [ref=e14]
        - generic [ref=e16]: Dekho Panchang
      - generic [ref=e17]:
        - link "Home" [ref=e18] [cursor=pointer]:
          - /url: /en
        - link "Panchang" [ref=e19] [cursor=pointer]:
          - /url: /en/panchang
        - button "Kundali" [ref=e21]:
          - text: Kundali
          - img [ref=e22]
        - button "Rituals" [ref=e25]:
          - text: Rituals
          - img [ref=e26]
        - button "Calendars" [ref=e29]:
          - text: Calendars
          - img [ref=e30]
        - button "Tools" [ref=e33]:
          - text: Tools
          - img [ref=e34]
        - link "Learn Jyotish" [ref=e36] [cursor=pointer]:
          - /url: /en/learn
      - generic [ref=e37]:
        - button "Search" [ref=e38]:
          - img [ref=e39]
          - generic [ref=e42]: Search
          - generic [ref=e43]: Ctrl+K
        - generic [ref=e45]:
          - button "EN" [ref=e46]
          - button "हिं" [ref=e47]
        - link "Upgrade" [ref=e48] [cursor=pointer]:
          - /url: /en/pricing
        - button "Sign in" [ref=e49]:
          - img [ref=e50]
          - text: Sign In
  - main [ref=e53]:
    - generic [ref=e54]:
      - generic [ref=e57]:
        - paragraph [ref=e58]: ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥
        - heading "Unveiling the Science of Time" [level=1] [ref=e59]
        - paragraph [ref=e60]: Explore the astronomical brilliance of India's ancient calendar system — where precise celestial mechanics meet timeless wisdom
        - paragraph [ref=e61]: असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय।
      - generic [ref=e64]: ✻
      - generic [ref=e67]:
        - heading "Three Pillars of Vedic Wisdom" [level=2] [ref=e69]
        - generic [ref=e70]:
          - link "Panchang Know Your Day Precise tithi, nakshatra, yoga and karana timings for your location. Festival calendar with step-by-step puja vidhis, mantras in Devanagari, and Ekadashi parana computed with Hari Vasara rules. Find the perfect muhurat for any of 20 life activities. View Today's Panchang →" [ref=e72] [cursor=pointer]:
            - /url: /en/panchang
            - generic [ref=e73]:
              - img [ref=e75]
              - heading "Panchang" [level=3] [ref=e98]
              - paragraph [ref=e99]: Know Your Day
              - paragraph [ref=e100]: Precise tithi, nakshatra, yoga and karana timings for your location. Festival calendar with step-by-step puja vidhis, mantras in Devanagari, and Ekadashi parana computed with Hari Vasara rules. Find the perfect muhurat for any of 20 life activities.
              - generic [ref=e101]: View Today's Panchang →
          - link "Kundali Know Yourself Your complete birth chart with 150+ yogas, shadbala strength, and period-by-period dasha forecasts across Mahadasha, Antardasha, and Pratyantardasha. 36-Guna compatibility matching, annual predictions via Varshaphal, and advanced systems — KP, Jaimini, Prashna. Generate Your Chart →" [ref=e103] [cursor=pointer]:
            - /url: /en/kundali
            - generic [ref=e104]:
              - img [ref=e106]:
                - generic [ref=e122]: La
              - heading "Kundali" [level=3] [ref=e125]
              - paragraph [ref=e126]: Know Yourself
              - paragraph [ref=e127]: Your complete birth chart with 150+ yogas, shadbala strength, and period-by-period dasha forecasts across Mahadasha, Antardasha, and Pratyantardasha. 36-Guna compatibility matching, annual predictions via Varshaphal, and advanced systems — KP, Jaimini, Prashna.
              - generic [ref=e128]: Generate Your Chart →
          - link "Jyotish Master the Science 89 structured modules taking you from the foundations — Grahas, Rashis, Nakshatras — through Dashas, Yogas, Shadbala, to advanced systems like KP, Jaimini, and Tajika. Interactive diagrams, classical Sanskrit references, and the computational astronomy behind every calculation. Start Learning →" [ref=e130] [cursor=pointer]:
            - /url: /en/learn
            - generic [ref=e131]:
              - img [ref=e133]:
                - generic [ref=e136]: ॐ
              - heading "Jyotish" [level=3] [ref=e145]
              - paragraph [ref=e146]: Master the Science
              - paragraph [ref=e147]: 89 structured modules taking you from the foundations — Grahas, Rashis, Nakshatras — through Dashas, Yogas, Shadbala, to advanced systems like KP, Jaimini, and Tajika. Interactive diagrams, classical Sanskrit references, and the computational astronomy behind every calculation.
              - generic [ref=e148]: Start Learning →
      - generic [ref=e151]: ✻
      - generic [ref=e154]:
        - heading "Today's Panchang" [level=2] [ref=e155]
        - generic [ref=e156]:
          - button "Set your location to see Panchang" [ref=e159]:
            - img [ref=e160]
            - generic [ref=e163]: Set your location to see Panchang
          - generic [ref=e164]:
            - img [ref=e165]
            - paragraph [ref=e168]: Location required for accurate Panchang
            - paragraph [ref=e169]: Panchang calculations depend on sunrise/sunset at your location
            - button "Search Location" [ref=e170]
  - contentinfo [ref=e171]:
    - generic [ref=e173]:
      - generic [ref=e174]:
        - generic [ref=e175]: Dekho Panchang
        - generic [ref=e176]: © 2026
      - generic [ref=e177]:
        - link "Panchang" [ref=e178] [cursor=pointer]:
          - /url: /en/panchang
        - link "Kundali" [ref=e179] [cursor=pointer]:
          - /url: /en/kundali
        - link "Calendar" [ref=e180] [cursor=pointer]:
          - /url: /en/calendar
        - link "Learn" [ref=e181] [cursor=pointer]:
          - /url: /en/learn
        - link "About" [ref=e182] [cursor=pointer]:
          - /url: /en/about
        - link "Pricing" [ref=e183] [cursor=pointer]:
          - /url: /en/pricing
      - paragraph [ref=e184]: ॐ ज्योतिषां ज्योतिः
  - button "Open Next.js Dev Tools" [ref=e190] [cursor=pointer]:
    - img [ref=e191]
  - alert [ref=e194]
```

# Test source

```ts
  1   | /**
  2   |  * E2E Core Flow Tests — Playwright
  3   |  *
  4   |  * Tests the critical user journeys:
  5   |  *   1. Homepage loads and displays panchang
  6   |  *   2. Panchang page shows all 5 elements
  7   |  *   3. Kundali page generates a chart
  8   |  *   4. Profile page (requires auth — skip if not logged in)
  9   |  *   5. Navigation works across pages
  10  |  *   6. Locale switching
  11  |  *   7. Vedic Time page loads and ticks
  12  |  */
  13  | import { test, expect } from '@playwright/test';
  14  | 
  15  | const BASE = 'http://localhost:3000';
  16  | 
  17  | test.describe('Homepage', () => {
  18  |   test('loads and shows Gayatri mantra', async ({ page }) => {
  19  |     await page.goto(`${BASE}/en`);
  20  |     await expect(page.locator('text=भूर्भुवः')).toBeVisible({ timeout: 10000 });
  21  |   });
  22  | 
  23  |   test('shows Today\'s Panchang section', async ({ page }) => {
  24  |     await page.goto(`${BASE}/en`);
  25  |     await expect(page.locator('text=Panchang')).toBeVisible({ timeout: 10000 });
  26  |   });
  27  | 
  28  |   test('has Explore Panchang CTA', async ({ page }) => {
  29  |     await page.goto(`${BASE}/en`);
  30  |     await expect(page.locator('text=Explore Panchang')).toBeVisible({ timeout: 10000 });
  31  |   });
  32  | 
  33  |   test('has 8 tool cards', async ({ page }) => {
  34  |     await page.goto(`${BASE}/en`);
  35  |     // The tool cards section
  36  |     await expect(page.locator('text=Birth Chart')).toBeVisible({ timeout: 10000 });
> 37  |     await expect(page.locator('text=Muhurta AI')).toBeVisible({ timeout: 10000 });
      |                                                   ^ Error: expect(locator).toBeVisible() failed
  38  |     await expect(page.locator('text=Learn Jyotish')).toBeVisible({ timeout: 10000 });
  39  |   });
  40  | });
  41  | 
  42  | test.describe('Panchang Page', () => {
  43  |   test('loads and shows tithi', async ({ page }) => {
  44  |     await page.goto(`${BASE}/en/panchang`);
  45  |     // Should show a tithi name (one of the 30)
  46  |     await expect(page.locator('text=/Pratipada|Dwitiya|Tritiya|Chaturthi|Panchami|Shashthi|Saptami|Ashtami|Navami|Dashami|Ekadashi|Dwadashi|Trayodashi|Chaturdashi|Purnima|Amavasya/')).toBeVisible({ timeout: 15000 });
  47  |   });
  48  | 
  49  |   test('shows sunrise and sunset times', async ({ page }) => {
  50  |     await page.goto(`${BASE}/en/panchang`);
  51  |     // Sunrise/sunset should be in HH:MM format
  52  |     await expect(page.locator('text=/\\d{2}:\\d{2}/')).toBeVisible({ timeout: 15000 });
  53  |   });
  54  | 
  55  |   test('shows nakshatra', async ({ page }) => {
  56  |     await page.goto(`${BASE}/en/panchang`);
  57  |     await expect(page.locator('text=/Ashwini|Bharani|Krittika|Rohini|Mrigashira|Ardra|Punarvasu|Pushya|Ashlesha|Magha|Purva Phalguni|Uttara Phalguni|Hasta|Chitra|Swati|Vishakha|Anuradha|Jyeshtha|Mula|Purva Ashadha|Uttara Ashadha|Shravana|Dhanishta|Shatabhisha|Purva Bhadrapada|Uttara Bhadrapada|Revati/')).toBeVisible({ timeout: 15000 });
  58  |   });
  59  | });
  60  | 
  61  | test.describe('Kundali Page', () => {
  62  |   test('loads and shows birth form', async ({ page }) => {
  63  |     await page.goto(`${BASE}/en/kundali`);
  64  |     await expect(page.locator('input[type="date"]')).toBeVisible({ timeout: 10000 });
  65  |     await expect(page.locator('input[type="time"]')).toBeVisible({ timeout: 10000 });
  66  |   });
  67  | 
  68  |   test('has ayanamsha selector', async ({ page }) => {
  69  |     await page.goto(`${BASE}/en/kundali`);
  70  |     await expect(page.locator('text=Lahiri')).toBeVisible({ timeout: 10000 });
  71  |   });
  72  | });
  73  | 
  74  | test.describe('Matching Page', () => {
  75  |   test('loads with boy/girl input panels', async ({ page }) => {
  76  |     await page.goto(`${BASE}/en/matching`);
  77  |     await expect(page.locator('text=/Groom|Boy|Bride|Girl/')).toBeVisible({ timeout: 10000 });
  78  |   });
  79  | });
  80  | 
  81  | test.describe('Vedic Time Page', () => {
  82  |   test('loads and shows Ghati clock', async ({ page }) => {
  83  |     await page.goto(`${BASE}/en/vedic-time`);
  84  |     await expect(page.locator('text=Ghati')).toBeVisible({ timeout: 10000 });
  85  |   });
  86  | 
  87  |   test('shows clock mode toggle', async ({ page }) => {
  88  |     await page.goto(`${BASE}/en/vedic-time`);
  89  |     await expect(page.locator('text=60-Ghati')).toBeVisible({ timeout: 10000 });
  90  |     await expect(page.locator('text=30-Ghati')).toBeVisible({ timeout: 10000 });
  91  |   });
  92  | 
  93  |   test('switches between 60 and 30 ghati modes', async ({ page }) => {
  94  |     await page.goto(`${BASE}/en/vedic-time`);
  95  |     await page.click('text=30-Ghati');
  96  |     await expect(page.locator('text=Dinamana')).toBeVisible({ timeout: 5000 });
  97  |     await page.click('text=60-Ghati');
  98  |     await expect(page.locator('text=Ishtakala')).toBeVisible({ timeout: 5000 });
  99  |   });
  100 | });
  101 | 
  102 | test.describe('Navigation', () => {
  103 |   test('navbar has logo', async ({ page }) => {
  104 |     await page.goto(`${BASE}/en`);
  105 |     await expect(page.locator('text=Dekho Panchang')).toBeVisible({ timeout: 5000 });
  106 |   });
  107 | 
  108 |   test('navbar links work — Panchang', async ({ page }) => {
  109 |     await page.goto(`${BASE}/en`);
  110 |     await page.click('nav >> text=Panchang');
  111 |     await expect(page).toHaveURL(/\/en\/panchang/);
  112 |   });
  113 | 
  114 |   test('navbar links work — Kundali', async ({ page }) => {
  115 |     await page.goto(`${BASE}/en`);
  116 |     await page.click('nav >> text=Kundali');
  117 |     await expect(page).toHaveURL(/\/en\/kundali/);
  118 |   });
  119 | 
  120 |   test('Sign In button visible when not authenticated', async ({ page }) => {
  121 |     await page.goto(`${BASE}/en`);
  122 |     await expect(page.locator('text=Sign In')).toBeVisible({ timeout: 5000 });
  123 |   });
  124 | 
  125 |   test('Sign In opens auth modal', async ({ page }) => {
  126 |     await page.goto(`${BASE}/en`);
  127 |     await page.click('text=Sign In');
  128 |     await expect(page.locator('text=Continue with Google')).toBeVisible({ timeout: 5000 });
  129 |   });
  130 | 
  131 |   test('auth modal has forgot password link', async ({ page }) => {
  132 |     await page.goto(`${BASE}/en`);
  133 |     await page.click('text=Sign In');
  134 |     await expect(page.locator('text=Forgot password?')).toBeVisible({ timeout: 5000 });
  135 |   });
  136 | 
  137 |   test('auth modal switches to signup mode', async ({ page }) => {
```