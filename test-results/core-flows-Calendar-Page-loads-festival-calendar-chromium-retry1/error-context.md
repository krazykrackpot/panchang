# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows.spec.ts >> Calendar Page >> loads festival calendar
- Location: e2e/core-flows.spec.ts:167:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Festival|Calendar|Ekadashi/')
Expected: visible
Error: strict mode violation: locator('text=/Festival|Calendar|Ekadashi/') resolved to 6 elements:
    1) <button aria-haspopup="true" aria-expanded="false" class="flex items-center gap-1 text-text-secondary hover:text-gold-light transition-colors duration-200 text-sm font-medium">…</button> aka getByRole('button', { name: 'Calendars' })
    2) <span class="text-gold-gradient">Festival & Vrat Calendar</span> aka getByText('Festival & Vrat Calendar')
    3) <p class="text-text-secondary text-lg max-w-2xl mx-auto">Hindu festivals, Ekadashi, Purnima, Amavasya, San…</p> aka getByText('Hindu festivals, Ekadashi,')
    4) <button class="px-4 py-2 rounded-lg text-xs font-bold transition-all text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10">Festivals</button> aka getByRole('button', { name: 'Festivals' })
    5) <button class="px-4 py-2 rounded-lg text-xs font-bold transition-all text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10">Ekadashi</button> aka getByRole('button', { name: 'Ekadashi' })
    6) <a href="/en/calendar" class="hover:text-gold-light transition-colors">Calendar</a> aka getByRole('link', { name: 'Calendar' })

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=/Festival|Calendar|Ekadashi/')

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
        - img [ref=e57]
        - heading "Festival & Vrat Calendar" [level=1] [ref=e63]
        - paragraph [ref=e64]: Hindu festivals, Ekadashi, Purnima, Amavasya, Sankashti, and Pradosham dates
      - generic [ref=e65]:
        - button [ref=e66]:
          - img [ref=e67]
        - generic [ref=e69]: "2026"
        - button [ref=e70]:
          - img [ref=e71]
      - generic [ref=e73]:
        - img [ref=e74]
        - heading "Location Required" [level=3] [ref=e77]
        - paragraph [ref=e78]: All festival dates, tithi timings, and parana windows depend on your location. Please enter your city to see accurate data.
        - generic [ref=e79]:
          - textbox "Enter your city…" [active] [ref=e80]
          - button [ref=e81]:
            - img [ref=e82]
      - generic [ref=e85]:
        - button "Western Months" [ref=e86]
        - button "Hindu Lunar Months" [ref=e87]
      - generic [ref=e88]:
        - button "All" [ref=e89]
        - button "Jan" [ref=e90]
        - button "Feb" [ref=e91]
        - button "Mar" [ref=e92]
        - button "Apr" [ref=e93]
        - button "May" [ref=e94]
        - button "Jun" [ref=e95]
        - button "Jul" [ref=e96]
        - button "Aug" [ref=e97]
        - button "Sep" [ref=e98]
        - button "Oct" [ref=e99]
        - button "Nov" [ref=e100]
        - button "Dec" [ref=e101]
      - generic [ref=e102]:
        - button "All" [ref=e103]
        - button "Festivals" [ref=e104]
        - button "Ekadashi" [ref=e105]
        - button "Purnima" [ref=e106]
        - button "Amavasya" [ref=e107]
        - button "Chaturthi" [ref=e108]
        - button "Pradosham" [ref=e109]
        - button "Other Vrats" [ref=e110]
        - button "Eclipses" [ref=e111]
      - generic [ref=e114]: ✻
  - contentinfo [ref=e118]:
    - generic [ref=e120]:
      - generic [ref=e121]:
        - generic [ref=e122]: Dekho Panchang
        - generic [ref=e123]: © 2026
      - generic [ref=e124]:
        - link "Panchang" [ref=e125] [cursor=pointer]:
          - /url: /en/panchang
        - link "Kundali" [ref=e126] [cursor=pointer]:
          - /url: /en/kundali
        - link "Calendar" [ref=e127] [cursor=pointer]:
          - /url: /en/calendar
        - link "Learn" [ref=e128] [cursor=pointer]:
          - /url: /en/learn
        - link "About" [ref=e129] [cursor=pointer]:
          - /url: /en/about
        - link "Pricing" [ref=e130] [cursor=pointer]:
          - /url: /en/pricing
      - paragraph [ref=e131]: ॐ ज्योतिषां ज्योतिः
  - button "Open Next.js Dev Tools" [ref=e137] [cursor=pointer]:
    - img [ref=e138]
  - alert [ref=e141]
```

# Test source

```ts
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
  162 |     await expect(page.locator('text=/Learn|Jyotish|Foundations/')).toBeVisible({ timeout: 10000 });
  163 |   });
  164 | });
  165 | 
  166 | test.describe('Calendar Page', () => {
  167 |   test('loads festival calendar', async ({ page }) => {
  168 |     await page.goto(`${BASE}/en/calendar`);
> 169 |     await expect(page.locator('text=/Festival|Calendar|Ekadashi/')).toBeVisible({ timeout: 10000 });
      |                                                                     ^ Error: expect(locator).toBeVisible() failed
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