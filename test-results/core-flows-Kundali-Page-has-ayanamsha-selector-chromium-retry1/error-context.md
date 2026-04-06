# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows.spec.ts >> Kundali Page >> has ayanamsha selector
- Location: e2e/core-flows.spec.ts:68:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('text=Lahiri')
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Lahiri')
    14 × locator resolved to <option selected value="lahiri">Lahiri (Chitrapaksha)</option>
       - unexpected value "hidden"

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
      - generic [ref=e55]:
        - heading "Kundali Generator" [level=1] [ref=e56]
        - paragraph [ref=e57]: Generate your Vedic birth chart (Janma Patrika)
      - generic [ref=e58]:
        - generic [ref=e59]:
          - generic [ref=e60]:
            - generic [ref=e61]: Your Name
            - textbox "Enter your name" [ref=e62]
          - generic [ref=e63]:
            - generic [ref=e64]: Date of Birth
            - textbox [ref=e65]: 1990-01-15
          - generic [ref=e66]:
            - generic [ref=e67]: Time of Birth
            - textbox [ref=e68]: 06:00
          - generic [ref=e69]:
            - generic [ref=e70]: Place of Birth
            - generic [ref=e72]:
              - img [ref=e73]
              - textbox "Search location" [ref=e76]:
                - /placeholder: Search birth city...
          - generic [ref=e77]:
            - generic [ref=e78]: Ayanamsha
            - combobox [ref=e79]:
              - option "Lahiri (Chitrapaksha)" [selected]
              - option "Raman"
              - option "Krishnamurti (KP)"
          - generic [ref=e80]:
            - generic [ref=e81]: Chart Style
            - generic [ref=e82]:
              - button "◇ North Indian" [ref=e83]
              - button "▦ South Indian" [ref=e84]
        - button "Generate Kundali" [ref=e85]
  - contentinfo [ref=e86]:
    - generic [ref=e88]:
      - generic [ref=e89]:
        - generic [ref=e90]: Dekho Panchang
        - generic [ref=e91]: © 2026
      - generic [ref=e92]:
        - link "Panchang" [ref=e93] [cursor=pointer]:
          - /url: /en/panchang
        - link "Kundali" [ref=e94] [cursor=pointer]:
          - /url: /en/kundali
        - link "Calendar" [ref=e95] [cursor=pointer]:
          - /url: /en/calendar
        - link "Learn" [ref=e96] [cursor=pointer]:
          - /url: /en/learn
        - link "About" [ref=e97] [cursor=pointer]:
          - /url: /en/about
        - link "Pricing" [ref=e98] [cursor=pointer]:
          - /url: /en/pricing
      - paragraph [ref=e99]: ॐ ज्योतिषां ज्योतिः
  - button "Open Next.js Dev Tools" [ref=e105] [cursor=pointer]:
    - img [ref=e106]
  - alert [ref=e109]
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
  37  |     await expect(page.locator('text=Muhurta AI')).toBeVisible({ timeout: 10000 });
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
> 70  |     await expect(page.locator('text=Lahiri')).toBeVisible({ timeout: 10000 });
      |                                               ^ Error: expect(locator).toBeVisible() failed
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
  138 |     await page.goto(`${BASE}/en`);
  139 |     await page.click('text=Sign In');
  140 |     await page.click('text=Sign up');
  141 |     await expect(page.locator('text=Create Account')).toBeVisible({ timeout: 5000 });
  142 |     await expect(page.locator('input[placeholder="Name"]')).toBeVisible();
  143 |     await expect(page.locator('input[placeholder="Confirm Password"]')).toBeVisible();
  144 |   });
  145 | });
  146 | 
  147 | test.describe('Locale Switching', () => {
  148 |   test('switches to Hindi', async ({ page }) => {
  149 |     await page.goto(`${BASE}/en`);
  150 |     // Find and click the locale switcher
  151 |     const hindi = page.locator('text=हिन्दी');
  152 |     if (await hindi.isVisible()) {
  153 |       await hindi.click();
  154 |       await expect(page).toHaveURL(/\/hi/);
  155 |     }
  156 |   });
  157 | });
  158 | 
  159 | test.describe('Learn Page', () => {
  160 |   test('loads learning modules', async ({ page }) => {
  161 |     await page.goto(`${BASE}/en/learn`);
  162 |     await expect(page.locator('text=/Learn|Jyotish|Foundations/')).toBeVisible({ timeout: 10000 });
  163 |   });
  164 | });
  165 | 
  166 | test.describe('Calendar Page', () => {
  167 |   test('loads festival calendar', async ({ page }) => {
  168 |     await page.goto(`${BASE}/en/calendar`);
  169 |     await expect(page.locator('text=/Festival|Calendar|Ekadashi/')).toBeVisible({ timeout: 10000 });
  170 |   });
```