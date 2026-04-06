# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows.spec.ts >> Pricing Page >> shows subscription tiers
- Location: e2e/core-flows.spec.ts:174:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Pro')
Expected: visible
Error: strict mode violation: locator('text=Pro') resolved to 5 elements:
    1) <h2 class="text-2xl font-bold text-white mb-2">Pro</h2> aka getByRole('heading', { name: 'Pro' })
    2) <span class="text-white/80">Everything in Pro</span> aka getByText('Everything in Pro')
    3) <span class="text-white/80">Batch Processing (50 charts)</span> aka getByText('Batch Processing (50 charts)')
    4) <span data-nextjs-container-errors-pseudo-html-line="true">…</span> aka getByText('<ClientPageRoot Component={')
    5) <span data-nextjs-container-errors-pseudo-html-line="true">…</span> aka getByText('<PricingPage params={Promise')

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Pro')

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
    - main [ref=e54]:
      - generic [ref=e56]:
        - heading "Unlock the Full Power of Vedic Astrology" [level=1] [ref=e57]
        - paragraph [ref=e58]: Choose the plan that fits your practice
      - generic [ref=e59]:
        - generic [ref=e60]:
          - button "Monthly" [ref=e61]
          - button "Annual Save ~33%" [ref=e62]:
            - text: Annual
            - generic [ref=e63]: Save ~33%
        - generic [ref=e64]:
          - button "INR (₹)" [ref=e65]
          - button "USD ($)" [ref=e66]
      - generic [ref=e67]:
        - generic [ref=e68]:
          - heading "Free" [level=2] [ref=e69]
          - generic [ref=e72]: Free
          - list [ref=e73]:
            - listitem [ref=e74]:
              - img [ref=e75]
              - generic [ref=e77]: Daily Panchang (with ads)
            - listitem [ref=e78]:
              - img [ref=e79]
              - generic [ref=e81]: 2 Kundali/day
            - listitem [ref=e82]:
              - img [ref=e83]
              - generic [ref=e85]: 2 AI Chats/day
            - listitem [ref=e86]:
              - img [ref=e87]
              - generic [ref=e89]: 3 Saved Charts
            - listitem [ref=e90]:
              - img [ref=e91]
              - generic [ref=e93]: Basic Yogas & Tippanni
            - listitem [ref=e94]:
              - img [ref=e95]
              - generic [ref=e98]: Full Shadbala/Bhavabala
            - listitem [ref=e99]:
              - img [ref=e100]
              - generic [ref=e103]: Varshaphal / KP / Prashna
            - listitem [ref=e104]:
              - img [ref=e105]
              - generic [ref=e108]: All 17 Varga Charts
          - button "Current Plan" [disabled] [ref=e109]
        - generic [ref=e110]:
          - generic [ref=e111]: Most Popular
          - heading "Pro" [level=2] [ref=e112]
          - generic [ref=e113]: 7-day free trial
          - generic [ref=e115]:
            - generic [ref=e116]: $5
            - generic [ref=e117]: /mo
          - list [ref=e118]:
            - listitem [ref=e119]:
              - img [ref=e120]
              - generic [ref=e122]: Ad-free Panchang
            - listitem [ref=e123]:
              - img [ref=e124]
              - generic [ref=e126]: Unlimited Kundali
            - listitem [ref=e127]:
              - img [ref=e128]
              - generic [ref=e130]: 20 AI Chats/day
            - listitem [ref=e131]:
              - img [ref=e132]
              - generic [ref=e134]: 25 Saved Charts
            - listitem [ref=e135]:
              - img [ref=e136]
              - generic [ref=e138]: Full Shadbala & Yogas
            - listitem [ref=e139]:
              - img [ref=e140]
              - generic [ref=e142]: Varshaphal / KP / Prashna
            - listitem [ref=e143]:
              - img [ref=e144]
              - generic [ref=e146]: All 17 Varga Charts
            - listitem [ref=e147]:
              - img [ref=e148]
              - generic [ref=e150]: Full Tippanni + Classical Refs
          - button "Start Free Trial" [ref=e151]
        - generic [ref=e152]:
          - heading "Jyotishi" [level=2] [ref=e153]
          - generic [ref=e155]:
            - generic [ref=e156]: $15
            - generic [ref=e157]: /mo
          - list [ref=e158]:
            - listitem [ref=e159]:
              - img [ref=e160]
              - generic [ref=e162]: Everything in Pro
            - listitem [ref=e163]:
              - img [ref=e164]
              - generic [ref=e166]: Unlimited AI Chat
            - listitem [ref=e167]:
              - img [ref=e168]
              - generic [ref=e170]: Unlimited Saved Charts
            - listitem [ref=e171]:
              - img [ref=e172]
              - generic [ref=e174]: Unlimited Muhurta AI
            - listitem [ref=e175]:
              - img [ref=e176]
              - generic [ref=e178]: Batch Processing (50 charts)
            - listitem [ref=e179]:
              - img [ref=e180]
              - generic [ref=e182]: Custom PDF Branding
            - listitem [ref=e183]:
              - img [ref=e184]
              - generic [ref=e186]: API Access
            - listitem [ref=e187]:
              - img [ref=e188]
              - generic [ref=e190]: Priority Support
          - button "Get Started" [ref=e191]
      - generic [ref=e192]:
        - heading "Frequently Asked Questions" [level=2] [ref=e193]
        - generic [ref=e194]:
          - button "Can I cancel anytime?" [ref=e196]:
            - generic [ref=e197]: Can I cancel anytime?
            - img [ref=e198]
          - button "What happens after the trial?" [ref=e201]:
            - generic [ref=e202]: What happens after the trial?
            - img [ref=e203]
          - button "Can I switch plans?" [ref=e206]:
            - generic [ref=e207]: Can I switch plans?
            - img [ref=e208]
          - button "What payment methods are accepted?" [ref=e211]:
            - generic [ref=e212]: What payment methods are accepted?
            - img [ref=e213]
          - button "Is my data safe?" [ref=e216]:
            - generic [ref=e217]: Is my data safe?
            - img [ref=e218]
  - contentinfo [ref=e220]:
    - generic [ref=e222]:
      - generic [ref=e223]:
        - generic [ref=e224]: Dekho Panchang
        - generic [ref=e225]: © 2026
      - generic [ref=e226]:
        - link "Panchang" [ref=e227] [cursor=pointer]:
          - /url: /en/panchang
        - link "Kundali" [ref=e228] [cursor=pointer]:
          - /url: /en/kundali
        - link "Calendar" [ref=e229] [cursor=pointer]:
          - /url: /en/calendar
        - link "Learn" [ref=e230] [cursor=pointer]:
          - /url: /en/learn
        - link "About" [ref=e231] [cursor=pointer]:
          - /url: /en/about
        - link "Pricing" [ref=e232] [cursor=pointer]:
          - /url: /en/pricing
      - paragraph [ref=e233]: ॐ ज्योतिषां ज्योतिः
  - generic [ref=e238] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e239]:
      - img [ref=e240]
    - generic [ref=e243]:
      - button "Open issues overlay" [ref=e244]:
        - generic [ref=e245]:
          - generic [ref=e246]: "0"
          - generic [ref=e247]: "1"
        - generic [ref=e248]: Issue
      - button "Collapse issues badge" [ref=e249]:
        - img [ref=e250]
  - alert [ref=e252]
```

# Test source

```ts
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
  171 | });
  172 | 
  173 | test.describe('Pricing Page', () => {
  174 |   test('shows subscription tiers', async ({ page }) => {
  175 |     await page.goto(`${BASE}/en/pricing`);
> 176 |     await expect(page.locator('text=Pro')).toBeVisible({ timeout: 10000 });
      |                                            ^ Error: expect(locator).toBeVisible() failed
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