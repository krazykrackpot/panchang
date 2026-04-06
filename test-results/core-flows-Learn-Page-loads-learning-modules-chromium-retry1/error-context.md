# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows.spec.ts >> Learn Page >> loads learning modules
- Location: e2e/core-flows.spec.ts:160:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Learn|Jyotish|Foundations/')
Expected: visible
Error: strict mode violation: locator('text=/Learn|Jyotish|Foundations/') resolved to 7 elements:
    1) <a href="/en/learn" class="text-text-secondary hover:text-gold-light transition-colors duration-200 text-sm font-medium whitespace-nowrap">Learn Jyotish</a> aka getByRole('link', { name: 'Learn Jyotish' })
    2) <span class="text-gold-primary text-xs uppercase tracking-widest font-bold">The Complete Jyotish Course</span> aka getByText('The Complete Jyotish Course')
    3) <span class="text-gold-gradient">Learn Vedic Astrology</span> aka getByText('Learn Vedic Astrology')
    4) <p class="text-text-secondary text-lg max-w-2xl mb-8">The most comprehensive free Jyotish course online…</p> aka getByText('The most comprehensive free')
    5) <h3 class="text-xl sm:text-2xl font-bold text-gold-light mb-2 group-hover:text-gold-primary transition-colors">Hindu Cosmology & Foundations</h3> aka getByRole('link', { name: 'Hindu Cosmology & Foundations' })
    6) <h3 class="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Cosmology & Foundations</h3> aka getByRole('heading', { name: 'Cosmology & Foundations', exact: true })
    7) <a href="/en/learn" class="hover:text-gold-light transition-colors">Learn</a> aka getByRole('link', { name: 'Learn', exact: true })

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=/Learn|Jyotish|Foundations/')

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
    - generic [ref=e55]:
      - generic [ref=e59]:
        - generic [ref=e60]:
          - img [ref=e61]
          - generic [ref=e63]: The Complete Jyotish Course
        - heading "Learn Vedic Astrology" [level=1] [ref=e64]
        - paragraph [ref=e65]: The most comprehensive free Jyotish course online — 3 structured tracks from cosmic foundations to advanced prediction
        - generic [ref=e66]:
          - generic [ref=e67]:
            - img [ref=e68]
            - generic [ref=e70]: "89"
            - generic [ref=e71]: Modules
          - generic [ref=e72]:
            - img [ref=e73]
            - generic [ref=e75]: "44"
            - generic [ref=e76]: References
          - generic [ref=e77]:
            - img [ref=e78]
            - generic [ref=e81]: "5"
            - generic [ref=e82]: Labs
          - generic [ref=e83]:
            - img [ref=e84]
            - generic [ref=e87]: "3"
            - generic [ref=e88]: Tracks
        - text: Free forever. No account needed.
      - heading "Choose Your Track" [level=2] [ref=e89]
      - generic [ref=e90]:
        - link "Hindu Cosmology & Foundations The universe, time, planets, stars, and the mathematical framework 26 modules · 13 references Cosmic time scales · Navagraha · 12 Rashis · 27 Nakshatras · Ayanamsha · Precession · Classical texts Explore Track" [ref=e92] [cursor=pointer]:
          - /url: /en/learn/track/cosmology
          - generic [ref=e93]:
            - generic [ref=e95]:
              - img [ref=e96]
              - heading "Hindu Cosmology & Foundations" [level=3] [ref=e99]
              - paragraph [ref=e100]: The universe, time, planets, stars, and the mathematical framework
              - generic [ref=e101]: 26 modules · 13 references
              - paragraph [ref=e102]: Cosmic time scales · Navagraha · 12 Rashis · 27 Nakshatras · Ayanamsha · Precession · Classical texts
            - generic [ref=e103]:
              - generic [ref=e104]: Explore Track
              - img [ref=e105]
        - link "Panchang — The Daily Practice Reading the cosmic weather that governs every day 11 modules · 9 references Tithi · Nakshatra · Yoga · Karana · Vara · Muhurta · Hora · Festivals · Calendar systems Explore Track" [ref=e108] [cursor=pointer]:
          - /url: /en/learn/track/panchang
          - generic [ref=e109]:
            - generic [ref=e111]:
              - img [ref=e112]
              - heading "Panchang — The Daily Practice" [level=3] [ref=e114]
              - paragraph [ref=e115]: Reading the cosmic weather that governs every day
              - generic [ref=e116]: 11 modules · 9 references
              - paragraph [ref=e117]: Tithi · Nakshatra · Yoga · Karana · Vara · Muhurta · Hora · Festivals · Calendar systems
            - generic [ref=e118]:
              - generic [ref=e119]: Explore Track
              - img [ref=e120]
        - link "Kundali — Your Personal Cosmic Map From birth chart basics to advanced predictive techniques 51 modules · 25 references · 5 labs Houses · Dashas · Yogas · Shadbala · Predictions · Matching · Remedies · Jaimini · KP System Explore Track" [ref=e123] [cursor=pointer]:
          - /url: /en/learn/track/kundali
          - generic [ref=e124]:
            - generic [ref=e126]:
              - img [ref=e127]
              - heading "Kundali — Your Personal Cosmic Map" [level=3] [ref=e129]
              - paragraph [ref=e130]: From birth chart basics to advanced predictive techniques
              - generic [ref=e131]: 51 modules · 25 references · 5 labs
              - paragraph [ref=e132]: Houses · Dashas · Yogas · Shadbala · Predictions · Matching · Remedies · Jaimini · KP System
            - generic [ref=e133]:
              - generic [ref=e134]: Explore Track
              - img [ref=e135]
      - generic [ref=e137]:
        - generic [ref=e138]:
          - generic [ref=e139]: ⚙
          - generic [ref=e140]:
            - heading "Interactive Labs" [level=2] [ref=e141]
            - paragraph [ref=e142]: Input your data, watch the engine calculate step by step
        - generic [ref=e143]:
          - link "Compute Your Panchang" [ref=e144] [cursor=pointer]:
            - /url: /en/learn/labs/panchang
            - heading "Compute Your Panchang" [level=3] [ref=e145]
          - link "Trace Your Moon" [ref=e146] [cursor=pointer]:
            - /url: /en/learn/labs/moon
            - heading "Trace Your Moon" [level=3] [ref=e147]
          - link "Dasha Timeline" [ref=e148] [cursor=pointer]:
            - /url: /en/learn/labs/dasha
            - heading "Dasha Timeline" [level=3] [ref=e149]
          - link "Shadbala Breakdown" [ref=e150] [cursor=pointer]:
            - /url: /en/learn/labs/shadbala
            - heading "Shadbala Breakdown" [level=3] [ref=e151]
          - link "KP Sub-Lord Lookup" [ref=e152] [cursor=pointer]:
            - /url: /en/learn/labs/kp
            - heading "KP Sub-Lord Lookup" [level=3] [ref=e153]
      - generic [ref=e154]:
        - heading "Reference Library" [level=2] [ref=e155]
        - paragraph [ref=e156]: Quick-access deep dives — use alongside the course or independently
        - generic [ref=e157]:
          - generic [ref=e158]:
            - heading "Cosmology & Foundations" [level=3] [ref=e159]
            - generic [ref=e160]:
              - link "Cosmology" [ref=e161] [cursor=pointer]:
                - /url: /en/learn/cosmology
              - link "Grahas" [ref=e162] [cursor=pointer]:
                - /url: /en/learn/grahas
              - link "Rashis" [ref=e163] [cursor=pointer]:
                - /url: /en/learn/rashis
              - link "Nakshatras" [ref=e164] [cursor=pointer]:
                - /url: /en/learn/nakshatras
              - link "Ayanamsha" [ref=e165] [cursor=pointer]:
                - /url: /en/learn/ayanamsha
              - link "Aspects" [ref=e166] [cursor=pointer]:
                - /url: /en/learn/aspects
              - link "Retrograde" [ref=e167] [cursor=pointer]:
                - /url: /en/learn/retrograde-effects
              - link "Combustion" [ref=e168] [cursor=pointer]:
                - /url: /en/learn/combustion
              - link "Remedies" [ref=e169] [cursor=pointer]:
                - /url: /en/learn/remedies
              - link "Classical Texts" [ref=e170] [cursor=pointer]:
                - /url: /en/learn/classical-texts
              - link "Vedanga Heritage" [ref=e171] [cursor=pointer]:
                - /url: /en/learn/vedanga
              - link "Observatories" [ref=e172] [cursor=pointer]:
                - /url: /en/learn/observatories
          - generic [ref=e173]:
            - heading "Panchang & Calendar" [level=3] [ref=e174]
            - generic [ref=e175]:
              - link "Tithis" [ref=e176] [cursor=pointer]:
                - /url: /en/learn/tithis
              - link "Yogas" [ref=e177] [cursor=pointer]:
                - /url: /en/learn/yogas
              - link "Karanas" [ref=e178] [cursor=pointer]:
                - /url: /en/learn/karanas
              - link "Vara" [ref=e179] [cursor=pointer]:
                - /url: /en/learn/vara
              - link "Muhurtas" [ref=e180] [cursor=pointer]:
                - /url: /en/learn/muhurtas
              - link "Hora" [ref=e181] [cursor=pointer]:
                - /url: /en/learn/hora
              - link "Masa" [ref=e182] [cursor=pointer]:
                - /url: /en/learn/masa
              - link "Transit Guide" [ref=e183] [cursor=pointer]:
                - /url: /en/learn/transit-guide
          - generic [ref=e184]:
            - heading "Kundali & Prediction" [level=3] [ref=e185]
            - generic [ref=e186]:
              - link "Planets" [ref=e187] [cursor=pointer]:
                - /url: /en/learn/planets
              - link "Planet-in-House" [ref=e188] [cursor=pointer]:
                - /url: /en/learn/planet-in-house
              - link "Dashas" [ref=e189] [cursor=pointer]:
                - /url: /en/learn/dashas
              - link "Shadbala" [ref=e190] [cursor=pointer]:
                - /url: /en/learn/shadbala
              - link "Bhavabala" [ref=e191] [cursor=pointer]:
                - /url: /en/learn/bhavabala
              - link "Avasthas" [ref=e192] [cursor=pointer]:
                - /url: /en/learn/avasthas
              - link "Sphutas" [ref=e193] [cursor=pointer]:
                - /url: /en/learn/sphutas
              - link "Ashtakavarga" [ref=e194] [cursor=pointer]:
                - /url: /en/learn/ashtakavarga
              - link "Jaimini" [ref=e195] [cursor=pointer]:
                - /url: /en/learn/jaimini
              - link "Argala" [ref=e196] [cursor=pointer]:
                - /url: /en/learn/argala
              - link "Sade Sati" [ref=e197] [cursor=pointer]:
                - /url: /en/learn/sade-sati
              - link "Career" [ref=e198] [cursor=pointer]:
                - /url: /en/learn/career
              - link "Marriage" [ref=e199] [cursor=pointer]:
                - /url: /en/learn/marriage
              - link "Wealth" [ref=e200] [cursor=pointer]:
                - /url: /en/learn/wealth
              - link "Health" [ref=e201] [cursor=pointer]:
                - /url: /en/learn/health
              - link "Matching" [ref=e202] [cursor=pointer]:
                - /url: /en/learn/matching
              - link "Compatibility" [ref=e203] [cursor=pointer]:
                - /url: /en/learn/compatibility
              - link "Advanced Houses" [ref=e204] [cursor=pointer]:
                - /url: /en/learn/advanced-houses
  - contentinfo [ref=e205]:
    - generic [ref=e207]:
      - generic [ref=e208]:
        - generic [ref=e209]: Dekho Panchang
        - generic [ref=e210]: © 2026
      - generic [ref=e211]:
        - link "Panchang" [ref=e212] [cursor=pointer]:
          - /url: /en/panchang
        - link "Kundali" [ref=e213] [cursor=pointer]:
          - /url: /en/kundali
        - link "Calendar" [ref=e214] [cursor=pointer]:
          - /url: /en/calendar
        - link "Learn" [ref=e215] [cursor=pointer]:
          - /url: /en/learn
        - link "About" [ref=e216] [cursor=pointer]:
          - /url: /en/about
        - link "Pricing" [ref=e217] [cursor=pointer]:
          - /url: /en/pricing
      - paragraph [ref=e218]: ॐ ज्योतिषां ज्योतिः
  - button "Open Next.js Dev Tools" [ref=e224] [cursor=pointer]:
    - img [ref=e225]
  - alert [ref=e228]
```

# Test source

```ts
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
> 162 |     await expect(page.locator('text=/Learn|Jyotish|Foundations/')).toBeVisible({ timeout: 10000 });
      |                                                                    ^ Error: expect(locator).toBeVisible() failed
  163 |   });
  164 | });
  165 | 
  166 | test.describe('Calendar Page', () => {
  167 |   test('loads festival calendar', async ({ page }) => {
  168 |     await page.goto(`${BASE}/en/calendar`);
  169 |     await expect(page.locator('text=/Festival|Calendar|Ekadashi/')).toBeVisible({ timeout: 10000 });
  170 |   });
  171 | });
  172 | 
  173 | test.describe('Pricing Page', () => {
  174 |   test('shows subscription tiers', async ({ page }) => {
  175 |     await page.goto(`${BASE}/en/pricing`);
  176 |     await expect(page.locator('text=Pro')).toBeVisible({ timeout: 10000 });
  177 |     await expect(page.locator('text=Jyotishi')).toBeVisible({ timeout: 10000 });
  178 |   });
  179 | });
  180 | 
  181 | test.describe('Profile Page (unauthenticated)', () => {
  182 |   test('shows sign-in prompt when not logged in', async ({ page }) => {
  183 |     await page.goto(`${BASE}/en/profile`);
  184 |     await expect(page.locator('text=/Sign In|sign in/')).toBeVisible({ timeout: 10000 });
  185 |   });
  186 | });
  187 | 
  188 | test.describe('Settings Page (unauthenticated)', () => {
  189 |   test('shows sign-in prompt when not logged in', async ({ page }) => {
  190 |     await page.goto(`${BASE}/en/settings`);
  191 |     await expect(page.locator('text=/Sign In|sign in/')).toBeVisible({ timeout: 10000 });
  192 |   });
  193 | });
  194 | 
```