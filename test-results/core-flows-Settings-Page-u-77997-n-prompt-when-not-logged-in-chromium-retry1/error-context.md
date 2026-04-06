# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows.spec.ts >> Settings Page (unauthenticated) >> shows sign-in prompt when not logged in
- Location: e2e/core-flows.spec.ts:189:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Sign In|sign in/')
Expected: visible
Error: strict mode violation: locator('text=/Sign In|sign in/') resolved to 2 elements:
    1) <button aria-label="Sign in" class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300 whitespace-nowrap">…</button> aka getByRole('button', { name: 'Sign in' })
    2) <a href="/en" class="inline-block px-6 py-2 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-primary/20 transition-all">Sign In</a> aka getByRole('link', { name: 'Sign In' })

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=/Sign In|sign in/')

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
      - img [ref=e56]
      - paragraph [ref=e59]: You must be signed in to access settings.
      - link "Sign In" [ref=e60] [cursor=pointer]:
        - /url: /en
  - contentinfo [ref=e61]:
    - generic [ref=e63]:
      - generic [ref=e64]:
        - generic [ref=e65]: Dekho Panchang
        - generic [ref=e66]: © 2026
      - generic [ref=e67]:
        - link "Panchang" [ref=e68] [cursor=pointer]:
          - /url: /en/panchang
        - link "Kundali" [ref=e69] [cursor=pointer]:
          - /url: /en/kundali
        - link "Calendar" [ref=e70] [cursor=pointer]:
          - /url: /en/calendar
        - link "Learn" [ref=e71] [cursor=pointer]:
          - /url: /en/learn
        - link "About" [ref=e72] [cursor=pointer]:
          - /url: /en/about
        - link "Pricing" [ref=e73] [cursor=pointer]:
          - /url: /en/pricing
      - paragraph [ref=e74]: ॐ ज्योतिषां ज्योतिः
  - button "Open Next.js Dev Tools" [ref=e80] [cursor=pointer]:
    - img [ref=e81]
  - alert [ref=e84]
```

# Test source

```ts
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
> 191 |     await expect(page.locator('text=/Sign In|sign in/')).toBeVisible({ timeout: 10000 });
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  192 |   });
  193 | });
  194 | 
```