# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows.spec.ts >> Panchang Page >> loads and shows tithi
- Location: e2e/core-flows.spec.ts:43:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Pratipada|Dwitiya|Tritiya|Chaturthi|Panchami|Shashthi|Saptami|Ashtami|Navami|Dashami|Ekadashi|Dwadashi|Trayodashi|Chaturdashi|Purnima|Amavasya/')
Expected: visible
Error: strict mode violation: locator('text=/Pratipada|Dwitiya|Tritiya|Chaturthi|Panchami|Shashthi|Saptami|Ashtami|Navami|Dashami|Ekadashi|Dwadashi|Trayodashi|Chaturdashi|Purnima|Amavasya/') resolved to 7 elements:
    1) <h3 class="text-xl font-bold text-purple-300">Sankashti Chaturthi</h3> aka getByRole('heading', { name: 'Sankashti Chaturthi' })
    2) <p class="text-text-secondary text-sm mt-1.5 leading-relaxed line-clamp-2">Monthly worship of the Remover of Obstacles (Vigh…</p> aka getByText('Monthly worship of the')
    3) <div class="text-gold-light text-lg font-bold leading-tight">Chaturthi</div> aka getByText('Chaturthi', { exact: true })
    4) <div class="text-gold-light text-lg font-bold leading-tight">Panchami</div> aka getByText('Panchami')
    5) <button class="px-3 py-2 sm:py-1.5 font-medium transition-all border-l border-gold-primary/15 text-text-secondary hover:text-gold-light hover:bg-gold-primary/5">Purnimant</button> aka getByRole('button', { name: 'Purnimant' })
    6) <p class="text-text-secondary text-xs mb-3">Amant system: Each month begins on Amavasya (New …</p> aka getByText('Amant system: Each month')
    7) <p class="text-text-tertiary text-xs mt-2">Amant dates computed from actual New Moon positio…</p> aka getByText('Amant dates computed from')

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('text=/Pratipada|Dwitiya|Tritiya|Chaturthi|Panchami|Shashthi|Saptami|Ashtami|Navami|Dashami|Ekadashi|Dwadashi|Trayodashi|Chaturdashi|Purnima|Amavasya/')

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
        - heading "Daily Panchang" [level=1] [ref=e56]
        - paragraph [ref=e57]: The five astronomical elements of the Indian calendar
      - generic [ref=e59]:
        - generic [ref=e60]:
          - generic [ref=e61]: Select Date
          - textbox [ref=e62]: 2026-04-06
        - generic [ref=e63]:
          - img [ref=e64]
          - button "Change" [ref=e67]
      - generic [ref=e68]:
        - generic [ref=e70]:
          - button "Download PDF" [ref=e71]:
            - img [ref=e72]
            - text: PDF
          - button "Print" [ref=e75]:
            - img [ref=e76]
            - text: Print
          - button "Share this page" [ref=e80]:
            - img [ref=e81]
            - text: Share
          - button "Set alerts" [ref=e87]:
            - img [ref=e88]
            - text: Alerts
        - generic [ref=e93]:
          - img [ref=e95]
          - generic [ref=e97]:
            - generic [ref=e98]:
              - heading "Sankashti Chaturthi" [level=3] [ref=e99]
              - generic [ref=e100]: Vrat
            - paragraph [ref=e101]: Monthly worship of the Remover of Obstacles (Vighnaharta). Falling on Krishna Chaturthi (4th day of waning moon), it carries the energy of perseverance through the dark half of the lunar cycle.
            - generic [ref=e103]:
              - img [ref=e104]
              - generic [ref=e110]: "Parana:"
              - generic [ref=e111]: 22:03 — 23:03
        - generic [ref=e112]:
          - button "What are the Five Elements of Panchang?" [expanded] [ref=e113]:
            - img [ref=e115]
            - generic [ref=e118]: What are the Five Elements of Panchang?
            - img [ref=e119]
          - generic [ref=e123]:
            - paragraph [ref=e124]: "Panchang is made of five celestial elements that reveal the quality and auspiciousness of a day:"
            - list [ref=e125]:
              - listitem [ref=e126]: Tithi — Lunar Day. Based on the Moon's phase (waxing or waning), it determines festivals and fasting days.
              - listitem [ref=e127]: Nakshatra — Lunar Mansion. One of 27 star-groups that the Moon passes through. Used for naming ceremonies and compatibility matching.
              - listitem [ref=e128]: Yoga — Sun-Moon Combination. (Not the exercise kind!) Formed by adding the longitudes of the Sun and Moon. There are 27 types — each considered favorable or unfavorable.
              - listitem [ref=e129]: Karana — Half Lunar Day. Half of a Tithi, with 11 types. Each is suited to specific kinds of work or activity.
              - listitem [ref=e130]: Vara — Weekday. Each day of the week is ruled by a planet that influences its overall energy.
            - paragraph [ref=e131]: Together, these five elements determine the most auspicious time for any activity.
        - generic [ref=e132]:
          - generic [ref=e133]:
            - img [ref=e135]
            - generic [ref=e141]: Tithi
            - generic [ref=e142]:
              - generic [ref=e143]: Chaturthi
              - generic [ref=e144]: Krishna Paksha (Waning)
              - generic [ref=e145]:
                - generic [ref=e146]: 08:30, 5 Apr — 10:41, 6 Apr
                - generic [ref=e147]: 24h
            - generic [ref=e148]:
              - generic [ref=e149]: Panchami
              - generic [ref=e150]: Krishna Paksha (Waning)
              - generic [ref=e151]: 10:41, 6 Apr onwards
            - generic [ref=e152]: "Waning Moon — Deity: Ganesha"
          - generic [ref=e153]:
            - img [ref=e155]
            - generic [ref=e160]: Nakshatra
            - generic [ref=e161]:
              - generic [ref=e162]: Anuradha
              - generic [ref=e163]: Mitra · Pada 2
              - generic [ref=e164]:
                - generic [ref=e165]: 20:37, 5 Apr — 23:26, 6 Apr
                - generic [ref=e166]: 24h
            - generic [ref=e167]:
              - generic [ref=e168]: Jyeshtha
              - generic [ref=e169]: Indra
              - generic [ref=e170]: 23:26, 6 Apr onwards
            - generic [ref=e171]: "Nature: Soft, Tender — Ruler: Saturn"
          - generic [ref=e172]:
            - img [ref=e174]
            - generic [ref=e179]: Yoga
            - generic [ref=e180]: Siddhi
            - generic [ref=e181]: Accomplishment
            - generic [ref=e182]:
              - generic [ref=e183]: 11:13, 5 Apr — 11:54, 6 Apr
              - generic [ref=e184]: 24h
              - generic [ref=e185]: then Vyatipata
            - generic [ref=e186]: Favorable — good for new beginnings
          - generic [ref=e187]:
            - img [ref=e189]
            - generic [ref=e195]: Karana
            - generic [ref=e196]: Kaulava
            - generic [ref=e197]: Movable
            - generic [ref=e198]:
              - generic [ref=e199]: 21:33, 5 Apr — 10:41, 6 Apr
              - generic [ref=e200]: 24h
            - generic [ref=e201]: Movable — good for travel & new work
          - generic [ref=e202]:
            - img [ref=e204]
            - generic [ref=e216]: Vara
            - generic [ref=e217]: Monday
            - generic [ref=e218]: Moon
            - generic [ref=e219]: Ruled by Moon — good for new starts
        - generic [ref=e220]:
          - generic [ref=e221]: Current Hora — Best Activity Now
          - generic [ref=e222]: 10:00 – 11:00
          - generic [ref=e223]: Education, finance, spiritual practice
        - generic [ref=e226]: ✻
        - generic [ref=e228]:
          - generic [ref=e229]:
            - img [ref=e230]
            - generic [ref=e236]:
              - generic [ref=e237]: Sunrise
              - generic [ref=e238]: 07:59
          - generic [ref=e239]:
            - img [ref=e240]
            - generic [ref=e243]:
              - generic [ref=e244]: Sunset
              - generic [ref=e245]: 20:05
          - generic [ref=e246]:
            - img [ref=e247]
            - generic [ref=e252]:
              - generic [ref=e253]: Moonrise
              - generic [ref=e254]: 23:36
          - generic [ref=e255]:
            - img [ref=e256]
            - generic [ref=e259]:
              - generic [ref=e260]: Moonset
              - generic [ref=e261]: 11:05
        - generic [ref=e264]: ✻
        - generic [ref=e266]:
          - generic [ref=e267]:
            - img [ref=e269]
            - heading "Auspicious Timings" [level=2] [ref=e276]
            - paragraph [ref=e277]: Sacred windows of time blessed by planetary harmony — begin new ventures, ceremonies, and important work during these periods.
          - generic [ref=e279]:
            - generic [ref=e282]: Sarvartha Siddhi Yoga
            - generic [ref=e284]: Active today! All new activities are favored.
            - generic [ref=e285]: All endeavors succeed — highly auspicious day
          - generic [ref=e286]:
            - generic [ref=e287]:
              - generic [ref=e288]: Brahma Muhurta
              - generic [ref=e289]: 06:23 — 07:11
              - generic [ref=e290]: 96 min before sunrise — ideal for meditation & study
            - generic [ref=e291]:
              - generic [ref=e292]: Abhijit Muhurta
              - generic [ref=e293]: 13:38 — 14:26
              - generic [ref=e294]: Most auspicious — victory assured
            - generic [ref=e295]:
              - generic [ref=e296]: Vijaya Muhurta
              - generic [ref=e297]: 15:15 — 16:03
              - generic [ref=e298]: 10th muhurta — victory assured
            - generic [ref=e299]:
              - generic [ref=e300]: Amrit Kalam
              - generic [ref=e301]: 02:23 — 03:59
              - generic [ref=e302]: The most auspicious time window of the day
            - generic [ref=e303]:
              - generic [ref=e304]: Godhuli Muhurta
              - generic [ref=e305]: 19:53 — 20:17
              - generic [ref=e306]: Cow-dust time around sunset — auspicious for ceremonies
            - generic [ref=e307]:
              - generic [ref=e308]: Morning Sandhya
              - generic [ref=e309]: 07:35 — 08:23
              - generic [ref=e310]: Pratah Sandhya — morning prayers
            - generic [ref=e311]:
              - generic [ref=e312]: Evening Sandhya
              - generic [ref=e313]: 19:41 — 20:29
              - generic [ref=e314]: Sayahna Sandhya — evening prayers
            - generic [ref=e315]:
              - generic [ref=e316]: Nishita Kaal
              - generic [ref=e317]: 01:38 — 02:26
              - generic [ref=e318]: Midnight period — sacred to Lord Shiva
            - generic [ref=e319]:
              - generic [ref=e320]: Anandadi Yoga
              - generic [ref=e321]: Ananda
              - generic [ref=e322]: Auspicious yoga — favourable energy
            - generic [ref=e323]:
              - generic [ref=e324]: Tamil Yoga
              - generic [ref=e325]: Marana Yoga
              - generic [ref=e326]: Inauspicious — avoid new ventures
            - generic [ref=e327]:
              - generic [ref=e328]: Homahuti Direction
              - generic [ref=e329]:
                - img [ref=e331]
                - generic [ref=e334]:
                  - generic [ref=e335]: Northwest
                  - generic [ref=e336]: Face this direction for Homa
              - generic [ref=e337]: "Presiding deity: Chandra"
            - generic [ref=e338]:
              - generic [ref=e339]: Mantri Mandala
              - generic [ref=e340]:
                - generic [ref=e341]:
                  - generic [ref=e342]: King
                  - generic [ref=e343]: Mercury
                - generic [ref=e344]:
                  - generic [ref=e345]: Minister
                  - generic [ref=e346]: Mercury
              - generic [ref=e347]: Day lord governs as King, sunrise Hora lord serves as Minister
        - generic [ref=e350]: ✻
        - generic [ref=e352]:
          - generic [ref=e353]:
            - img [ref=e355]
            - heading "Inauspicious Timings" [level=2] [ref=e358]
            - paragraph [ref=e359]: Avoid initiating new activities, journeys, or important decisions during these planetary affliction periods.
          - generic [ref=e360]:
            - generic [ref=e361]:
              - generic [ref=e362]: Rahu Kaal
              - generic [ref=e363]: 09:29 — 11:00
              - generic [ref=e364]: Rahu's period — avoid new work
            - generic [ref=e365]:
              - generic [ref=e366]: Yamaganda
              - generic [ref=e367]: 12:31 — 14:02
              - generic [ref=e368]: Yama's period — inauspicious
            - generic [ref=e369]:
              - generic [ref=e370]: Gulika Kaal
              - generic [ref=e371]: 15:33 — 17:04
              - generic [ref=e372]: Gulika's period — avoid travel
            - generic [ref=e373]:
              - generic [ref=e374]: Dur Muhurtam
              - generic [ref=e375]: 12:49 — 13:38
              - generic [ref=e376]: Inauspicious — avoid all new work
            - generic [ref=e377]:
              - generic [ref=e378]: Visha Ghatika
              - generic [ref=e379]: 17:35 — 17:59
              - generic [ref=e380]: 25th Ghatika — poison period, avoid all new activities
            - generic [ref=e381]:
              - generic [ref=e382]: Varjyam
              - generic [ref=e383]: 01:35 — 03:11
              - generic [ref=e384]: Inauspicious time — avoid starting new activities
        - generic [ref=e387]: ✻
        - generic [ref=e389]:
          - generic [ref=e390]:
            - img [ref=e392]
            - heading "Nivas & Shool" [level=2] [ref=e395]
            - paragraph [ref=e396]: Where cosmic forces reside today — directional afflictions, divine abodes, and their remedies.
          - link "Learn about all Nivas & Shool concepts →" [ref=e398] [cursor=pointer]:
            - /url: /en/nivas-shool
          - generic [ref=e399]:
            - generic [ref=e400]:
              - generic [ref=e401]: Disha Shool
              - generic [ref=e402]:
                - generic [ref=e404]: E
                - generic [ref=e405]:
                  - generic [ref=e406]: East
                  - generic [ref=e407]: Inauspicious direction for the day — avoid travel
              - generic [ref=e408]:
                - generic [ref=e409]: Remedy
                - generic [ref=e410]: Consume milk before travel
            - generic [ref=e411]:
              - generic [ref=e412]:
                - generic [ref=e413]: Shiva Vaas
                - generic [ref=e414]: Neutral
              - generic [ref=e415]: Sports & Play
              - generic [ref=e416]: "Tithis: 4, 9, 14"
              - generic [ref=e417]: Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.
              - generic [ref=e418]:
                - generic [ref=e419]: Activities
                - generic [ref=e420]: Arts, music, dance; avoid critical ventures
            - generic [ref=e421]:
              - generic [ref=e422]:
                - generic [ref=e423]: Agni Vaas
                - generic [ref=e424]: Auspicious
              - generic [ref=e425]: Earth (Bhumi)
              - generic [ref=e426]: Until 07:56
              - generic [ref=e427]: Agni is grounded in the earth plane. Fire rituals nourish the land and people.
              - generic [ref=e428]:
                - generic [ref=e429]: Fire Ritual Impact
                - generic [ref=e430]: Agriculture blessings, prosperity rituals, Griha Pravesh powerful
            - generic [ref=e431]:
              - generic [ref=e432]:
                - generic [ref=e433]: Chandra Vaas
                - generic [ref=e434]: Neutral
              - generic [ref=e435]:
                - generic [ref=e436]: Indra's Abode
                - generic [ref=e437]:
                  - img [ref=e438]
                  - generic [ref=e441]: South
              - generic [ref=e442]: Moon faces South in Nara (human) abode — ordinary activity plane. Results are as expected, neither elevated nor hindered.
              - generic [ref=e443]:
                - generic [ref=e444]: Activities
                - generic [ref=e445]: Daily work, business, social activities
            - generic [ref=e446]:
              - generic [ref=e447]:
                - generic [ref=e448]: Rahu Vaas
                - generic [ref=e449]: Avoid
              - generic [ref=e450]:
                - img [ref=e452]
                - generic [ref=e455]:
                  - generic [ref=e456]: Northwest
                  - generic [ref=e457]: Rahu's facing direction
              - generic [ref=e458]: Rahu (shadow planet) faces this direction today. Avoid land purchase, foundation laying, and long-term construction in this direction. Exercise caution for travel as well.
              - generic [ref=e459]:
                - generic [ref=e460]: Guidance
                - generic [ref=e461]: Do not initiate new ventures in this direction. Protective mantras and Hanuman invocation are beneficial.
        - generic [ref=e464]: ✻
        - generic [ref=e466]:
          - generic [ref=e467]:
            - img [ref=e469]
            - heading "Calendars & Epoch" [level=2] [ref=e471]
            - paragraph [ref=e472]: The Hindu calendar system — lunar months, seasons, cosmic cycles, and our position in deep time.
          - generic [ref=e473]:
            - heading "Hindu Calendar" [level=3] [ref=e474]:
              - img [ref=e475]
              - generic [ref=e481]: Hindu Calendar
            - generic [ref=e483]:
              - generic [ref=e484]:
                - generic [ref=e485]: Vikram Samvat
                - generic [ref=e486]: "2083"
              - generic [ref=e487]:
                - generic [ref=e488]: Shaka Samvat
                - generic [ref=e489]: "1948"
              - generic [ref=e490]:
                - img [ref=e492]:
                  - generic [ref=e505]: "60"
                - generic [ref=e506]: Samvatsara (Year)
                - generic [ref=e507]: Siddharthi
              - generic [ref=e508]:
                - img [ref=e510]
                - generic [ref=e516]: Masa (Amant)
                - generic [ref=e517]: Vaishakha
              - generic [ref=e518]:
                - generic [ref=e519]: Paksha
                - generic [ref=e520]: Krishna Paksha
              - generic [ref=e521]:
                - img [ref=e523]
                - generic [ref=e527]: Ritu (Season)
                - generic [ref=e528]: Vasanta (Spring)
              - generic [ref=e529]:
                - img [ref=e531]
                - generic [ref=e535]: Ayana
                - generic [ref=e536]: Uttarayana
              - generic [ref=e537]:
                - generic [ref=e538]: Ayanamsha (Lahiri)
                - generic [ref=e539]: 24.2239°
              - generic [ref=e540]:
                - generic [ref=e541]: Day Duration
                - generic [ref=e542]: 12:07
              - generic [ref=e543]:
                - generic [ref=e544]: Night Duration
                - generic [ref=e545]: 11:53
              - generic [ref=e546]:
                - generic [ref=e547]: Madhyahna
                - generic [ref=e548]: 14:02
          - generic [ref=e549]:
            - generic [ref=e550]:
              - heading "Hindu Months 2026" [level=4] [ref=e551]:
                - img [ref=e552]
                - text: Hindu Months 2026
              - generic [ref=e558]:
                - button "Amant" [ref=e559]
                - button "Purnimant" [ref=e560]
            - paragraph [ref=e561]: "Amant system: Each month begins on Amavasya (New Moon) and ends on the next Amavasya. Used in South & West India."
            - table [ref=e563]:
              - rowgroup [ref=e564]:
                - row "# Hindu Month Sanskrit Start End Ritu" [ref=e565]:
                  - columnheader "#" [ref=e566]
                  - columnheader "Hindu Month" [ref=e567]
                  - columnheader "Sanskrit" [ref=e568]
                  - columnheader "Start" [ref=e569]
                  - columnheader "End" [ref=e570]
                  - columnheader "Ritu" [ref=e571]
              - rowgroup [ref=e572]:
                - row "1 Margashirsha मार्गशीर्षः 11 Dec 10 Jan Hemanta (Pre-Winter)" [ref=e573]:
                  - cell "1" [ref=e574]
                  - cell "Margashirsha" [ref=e575]
                  - cell "मार्गशीर्षः" [ref=e576]
                  - cell "11 Dec" [ref=e577]
                  - cell "10 Jan" [ref=e578]
                  - cell "Hemanta (Pre-Winter)" [ref=e579]
                - row "2 Pausha पौषः 10 Jan 9 Feb Hemanta (Pre-Winter)" [ref=e580]:
                  - cell "2" [ref=e581]
                  - cell "Pausha" [ref=e582]
                  - cell "पौषः" [ref=e583]
                  - cell "10 Jan" [ref=e584]
                  - cell "9 Feb" [ref=e585]
                  - cell "Hemanta (Pre-Winter)" [ref=e586]
                - row "3 Magha माघः 9 Feb 11 Mar Shishira (Winter)" [ref=e587]:
                  - cell "3" [ref=e588]
                  - cell "Magha" [ref=e589]
                  - cell "माघः" [ref=e590]
                  - cell "9 Feb" [ref=e591]
                  - cell "11 Mar" [ref=e592]
                  - cell "Shishira (Winter)" [ref=e593]
                - row "4 PhalgunaNOW फाल्गुनः 11 Mar 10 Apr Shishira (Winter)" [ref=e594]:
                  - cell "4" [ref=e595]
                  - cell "PhalgunaNOW" [ref=e596]
                  - cell "फाल्गुनः" [ref=e597]
                  - cell "11 Mar" [ref=e598]
                  - cell "10 Apr" [ref=e599]
                  - cell "Shishira (Winter)" [ref=e600]
                - row "5 Chaitra चैत्रः 10 Apr 9 May Vasanta (Spring)" [ref=e601]:
                  - cell "5" [ref=e602]
                  - cell "Chaitra" [ref=e603]
                  - cell "चैत्रः" [ref=e604]
                  - cell "10 Apr" [ref=e605]
                  - cell "9 May" [ref=e606]
                  - cell "Vasanta (Spring)" [ref=e607]
                - row "6 Vaishakha वैशाखः 9 May 8 Jun Vasanta (Spring)" [ref=e608]:
                  - cell "6" [ref=e609]
                  - cell "Vaishakha" [ref=e610]
                  - cell "वैशाखः" [ref=e611]
                  - cell "9 May" [ref=e612]
                  - cell "8 Jun" [ref=e613]
                  - cell "Vasanta (Spring)" [ref=e614]
                - row "7 Jyeshtha ज्येष्ठः 8 Jun 7 Jul Grishma (Summer)" [ref=e615]:
                  - cell "7" [ref=e616]
                  - cell "Jyeshtha" [ref=e617]
                  - cell "ज्येष्ठः" [ref=e618]
                  - cell "8 Jun" [ref=e619]
                  - cell "7 Jul" [ref=e620]
                  - cell "Grishma (Summer)" [ref=e621]
                - row "8 Ashadha आषाढः 7 Jul 6 Aug Grishma (Summer)" [ref=e622]:
                  - cell "8" [ref=e623]
                  - cell "Ashadha" [ref=e624]
                  - cell "आषाढः" [ref=e625]
                  - cell "7 Jul" [ref=e626]
                  - cell "6 Aug" [ref=e627]
                  - cell "Grishma (Summer)" [ref=e628]
                - row "9 Shravana श्रावणः 6 Aug 4 Sep Varsha (Monsoon)" [ref=e629]:
                  - cell "9" [ref=e630]
                  - cell "Shravana" [ref=e631]
                  - cell "श्रावणः" [ref=e632]
                  - cell "6 Aug" [ref=e633]
                  - cell "4 Sep" [ref=e634]
                  - cell "Varsha (Monsoon)" [ref=e635]
                - row "10 Bhadrapada भाद्रपदः 4 Sep 3 Oct Varsha (Monsoon)" [ref=e636]:
                  - cell "10" [ref=e637]
                  - cell "Bhadrapada" [ref=e638]
                  - cell "भाद्रपदः" [ref=e639]
                  - cell "4 Sep" [ref=e640]
                  - cell "3 Oct" [ref=e641]
                  - cell "Varsha (Monsoon)" [ref=e642]
                - row "11 Ashvina आश्विनः 3 Oct 1 Nov Sharad (Autumn)" [ref=e643]:
                  - cell "11" [ref=e644]
                  - cell "Ashvina" [ref=e645]
                  - cell "आश्विनः" [ref=e646]
                  - cell "3 Oct" [ref=e647]
                  - cell "1 Nov" [ref=e648]
                  - cell "Sharad (Autumn)" [ref=e649]
                - row "12 Kartika कार्तिकः 1 Nov 1 Dec Sharad (Autumn)" [ref=e650]:
                  - cell "12" [ref=e651]
                  - cell "Kartika" [ref=e652]
                  - cell "कार्तिकः" [ref=e653]
                  - cell "1 Nov" [ref=e654]
                  - cell "1 Dec" [ref=e655]
                  - cell "Sharad (Autumn)" [ref=e656]
                - row "13 Margashirsha मार्गशीर्षः 1 Dec 30 Dec Hemanta (Pre-Winter)" [ref=e657]:
                  - cell "13" [ref=e658]
                  - cell "Margashirsha" [ref=e659]
                  - cell "मार्गशीर्षः" [ref=e660]
                  - cell "1 Dec" [ref=e661]
                  - cell "30 Dec" [ref=e662]
                  - cell "Hemanta (Pre-Winter)" [ref=e663]
                - row "14 Pausha पौषः 30 Dec 29 Jan Hemanta (Pre-Winter)" [ref=e664]:
                  - cell "14" [ref=e665]
                  - cell "Pausha" [ref=e666]
                  - cell "पौषः" [ref=e667]
                  - cell "30 Dec" [ref=e668]
                  - cell "29 Jan" [ref=e669]
                  - cell "Hemanta (Pre-Winter)" [ref=e670]
            - paragraph [ref=e671]: Amant dates computed from actual New Moon positions for 2026. Each month starts on Amavasya. Adhika Masa (intercalary, purple) occurs when two New Moons fall in the same solar month.
          - generic [ref=e672]:
            - heading "Epoch & Cosmic Time" [level=3] [ref=e673]:
              - img [ref=e674]
              - generic [ref=e676]: Epoch & Cosmic Time
            - generic [ref=e677]:
              - generic [ref=e678]:
                - generic [ref=e679]: Kali Ahargana
                - generic [ref=e680]: 1,872,671
                - generic [ref=e681]: Days elapsed since Kali Yuga began (Feb 18, 3102 BCE)
              - generic [ref=e682]:
                - generic [ref=e683]: Kaliyuga Year
                - generic [ref=e684]: 5,128
                - generic [ref=e685]: Current year in the Kali Yuga cycle (432,000 years total)
              - generic [ref=e686]:
                - generic [ref=e687]: Julian Day Number
                - generic [ref=e688]: 2,461,136
                - generic [ref=e689]: Astronomical day count from Jan 1, 4713 BCE noon
            - generic [ref=e690]:
              - generic [ref=e691]:
                - generic [ref=e692]:
                  - generic [ref=e693]: "Current Yuga: Kali Yuga"
                  - generic [ref=e694]: We are in the 4th and final Yuga of the current Mahayuga cycle. Kali Yuga began 3102 BCE (Feb 18) and spans 432,000 years. We are approximately 5,126 years in — only 1.2% complete.
                - generic [ref=e695]:
                  - generic [ref=e696]: Kali Yuga Progress
                  - generic [ref=e699]:
                    - generic [ref=e700]: 3102 BCE
                    - generic [ref=e701]: ~1.2%
                    - generic [ref=e702]: +426,874 yrs
              - generic [ref=e703]:
                - generic [ref=e704]: Mahayuga Timeline (4,320,000 years)
                - generic [ref=e705]:
                  - generic [ref=e706]:
                    - generic [ref=e707]: Satya Yuga
                    - generic [ref=e708]: 1,728,000y
                    - generic [ref=e709]: 40% of Mahayuga
                  - generic [ref=e710]:
                    - generic [ref=e711]: Treta Yuga
                    - generic [ref=e712]: 1,296,000y
                    - generic [ref=e713]: 30% of Mahayuga
                  - generic [ref=e714]:
                    - generic [ref=e715]: Dvapara Yuga
                    - generic [ref=e716]: 864,000y
                    - generic [ref=e717]: 20% of Mahayuga
                  - generic [ref=e718]:
                    - generic [ref=e719]: Kali Yuga
                    - generic [ref=e720]: 432,000y
                    - generic [ref=e721]: 10% of Mahayuga
                - generic [ref=e722]: Kalpa = 1,000 Mahayugas = 4.32 billion years (one Day of Brahma)
        - generic [ref=e725]: ✻
        - button "What is Choghadiya?" [ref=e728]:
          - img [ref=e730]
          - generic [ref=e733]: What is Choghadiya?
          - img [ref=e734]
        - generic [ref=e736]:
          - heading "Choghadiya" [level=2] [ref=e737]
          - paragraph [ref=e738]: Eight-fold day/night muhurat system for timing activities
          - generic [ref=e739]:
            - generic [ref=e740]:
              - generic [ref=e741]:
                - img [ref=e742]
                - heading "Day Choghadiya" [level=3] [ref=e748]
              - generic [ref=e749]:
                - generic [ref=e750]:
                  - generic [ref=e753]: Kaal
                  - generic [ref=e754]: 07:59 — 09:29
                - generic [ref=e755]:
                  - generic [ref=e758]: Shubh
                  - generic [ref=e759]: 09:29 — 11:00
                - generic [ref=e760]:
                  - generic [ref=e763]: Rog
                  - generic [ref=e764]: 11:00 — 12:31
                - generic [ref=e765]:
                  - generic [ref=e768]: Udveg
                  - generic [ref=e769]: 12:31 — 14:02
                - generic [ref=e770]:
                  - generic [ref=e773]: Char
                  - generic [ref=e774]: 14:02 — 15:33
                - generic [ref=e775]:
                  - generic [ref=e778]: Labh
                  - generic [ref=e779]: 15:33 — 17:04
                - generic [ref=e780]:
                  - generic [ref=e783]: Amrit
                  - generic [ref=e784]: 17:04 — 18:34
                - generic [ref=e785]:
                  - generic [ref=e788]: Kaal
                  - generic [ref=e789]: 18:34 — 20:05
            - generic [ref=e790]:
              - generic [ref=e791]:
                - img [ref=e792]
                - heading "Night Choghadiya" [level=3] [ref=e794]
              - generic [ref=e795]:
                - generic [ref=e796]:
                  - generic [ref=e799]: Char
                  - generic [ref=e800]: 20:05 — 21:34
                - generic [ref=e801]:
                  - generic [ref=e804]: Labh
                  - generic [ref=e805]: 21:34 — 23:04
                - generic [ref=e806]:
                  - generic [ref=e809]: Amrit
                  - generic [ref=e810]: 23:04 — 00:33
                - generic [ref=e811]:
                  - generic [ref=e814]: Kaal
                  - generic [ref=e815]: 00:33 — 02:02
                - generic [ref=e816]:
                  - generic [ref=e819]: Shubh
                  - generic [ref=e820]: 02:02 — 03:31
                - generic [ref=e821]:
                  - generic [ref=e824]: Rog
                  - generic [ref=e825]: 03:31 — 05:00
                - generic [ref=e826]:
                  - generic [ref=e829]: Udveg
                  - generic [ref=e830]: 05:00 — 06:29
                - generic [ref=e831]:
                  - generic [ref=e834]: Char
                  - generic [ref=e835]: 06:29 — 07:59
        - generic [ref=e838]: ✻
        - button "What are Planetary Hours (Hora)?" [ref=e841]:
          - img [ref=e843]
          - generic [ref=e846]: What are Planetary Hours (Hora)?
          - img [ref=e847]
        - generic [ref=e849]:
          - heading "Hora" [level=2] [ref=e850]
          - paragraph [ref=e851]: Planetary hours — each hour ruled by a planet
          - generic [ref=e852]:
            - generic [ref=e853]:
              - img [ref=e855]
              - generic [ref=e861]: Moon
              - generic [ref=e862]: 07:59—08:59
            - generic [ref=e863]:
              - img [ref=e865]
              - generic [ref=e871]: Saturn
              - generic [ref=e872]: 08:59—10:00
            - generic [ref=e873]:
              - img [ref=e875]
              - generic [ref=e881]: Jupiter
              - generic [ref=e882]: 10:00—11:00
            - generic [ref=e883]:
              - img [ref=e885]
              - generic [ref=e889]: Mars
              - generic [ref=e890]: 11:00—12:01
            - generic [ref=e891]:
              - img [ref=e893]
              - generic [ref=e904]: Sun
              - generic [ref=e905]: 12:01—13:01
            - generic [ref=e906]:
              - img [ref=e908]
              - generic [ref=e911]: Venus
              - generic [ref=e912]: 13:01—14:02
            - generic [ref=e913]:
              - img [ref=e915]
              - generic [ref=e919]: Mercury
              - generic [ref=e920]: 14:02—15:02
            - generic [ref=e921]:
              - img [ref=e923]
              - generic [ref=e929]: Moon
              - generic [ref=e930]: 15:02—16:03
            - generic [ref=e931]:
              - img [ref=e933]
              - generic [ref=e939]: Saturn
              - generic [ref=e940]: 16:03—17:04
            - generic [ref=e941]:
              - img [ref=e943]
              - generic [ref=e949]: Jupiter
              - generic [ref=e950]: 17:04—18:04
            - generic [ref=e951]:
              - img [ref=e953]
              - generic [ref=e957]: Mars
              - generic [ref=e958]: 18:04—19:05
            - generic [ref=e959]:
              - img [ref=e961]
              - generic [ref=e972]: Sun
              - generic [ref=e973]: 19:05—20:05
            - generic [ref=e974]:
              - img [ref=e976]
              - generic [ref=e979]: Venus
              - generic [ref=e980]: 20:05—21:05
            - generic [ref=e981]:
              - img [ref=e983]
              - generic [ref=e987]: Mercury
              - generic [ref=e988]: 21:05—22:04
            - generic [ref=e989]:
              - img [ref=e991]
              - generic [ref=e997]: Moon
              - generic [ref=e998]: 22:04—23:04
            - generic [ref=e999]:
              - img [ref=e1001]
              - generic [ref=e1007]: Saturn
              - generic [ref=e1008]: 23:04—00:03
            - generic [ref=e1009]:
              - img [ref=e1011]
              - generic [ref=e1017]: Jupiter
              - generic [ref=e1018]: 00:03—01:02
            - generic [ref=e1019]:
              - img [ref=e1021]
              - generic [ref=e1025]: Mars
              - generic [ref=e1026]: 01:02—02:02
            - generic [ref=e1027]:
              - img [ref=e1029]
              - generic [ref=e1040]: Sun
              - generic [ref=e1041]: 02:02—03:01
            - generic [ref=e1042]:
              - img [ref=e1044]
              - generic [ref=e1047]: Venus
              - generic [ref=e1048]: 03:01—04:01
            - generic [ref=e1049]:
              - img [ref=e1051]
              - generic [ref=e1055]: Mercury
              - generic [ref=e1056]: 04:01—05:00
            - generic [ref=e1057]:
              - img [ref=e1059]
              - generic [ref=e1065]: Moon
              - generic [ref=e1066]: 05:00—06:00
            - generic [ref=e1067]:
              - img [ref=e1069]
              - generic [ref=e1075]: Saturn
              - generic [ref=e1076]: 06:00—06:59
            - generic [ref=e1077]:
              - img [ref=e1079]
              - generic [ref=e1085]: Jupiter
              - generic [ref=e1086]: 06:59—07:59
        - generic [ref=e1089]: ✻
        - button "What are Daily Muhurtas?" [ref=e1092]:
          - img [ref=e1094]
          - generic [ref=e1097]: What are Daily Muhurtas?
          - img [ref=e1098]
        - generic [ref=e1100]:
          - heading "Today's Muhurtas" [level=2] [ref=e1101]
          - paragraph [ref=e1102]: The day is divided into 30 Muhurtas (~48 min each). Each is presided by a deity and carries specific energy. Click any muhurta to see its significance and best uses.
          - generic [ref=e1103]:
            - generic [ref=e1104]:
              - img [ref=e1105]
              - heading "Daytime Muhurtas" [level=3] [ref=e1111]
              - generic [ref=e1112]: (07:59 — 20:05)
            - generic [ref=e1113]:
              - generic [ref=e1114]:
                - generic [ref=e1115]:
                  - generic [ref=e1116]:
                    - generic [ref=e1117]: "1"
                    - generic [ref=e1118]: RudraRudra (Shiva)
                  - generic [ref=e1119]:
                    - generic [ref=e1120]: 07:59 — 08:47
                    - generic [ref=e1121]: Inauspicious
                - generic [ref=e1122]:
                  - paragraph [ref=e1123]: Named after Rudra, the fierce form of Shiva. This first muhurta at sunrise carries destructive energy — not suitable for new beginnings.
                  - paragraph [ref=e1124]: "Best for: Worship of Shiva, fire rituals (Homa), protective rites"
              - generic [ref=e1125]:
                - generic [ref=e1126]:
                  - generic [ref=e1127]:
                    - generic [ref=e1128]: "2"
                    - generic [ref=e1129]: AhiAhi (Serpent)
                  - generic [ref=e1130]:
                    - generic [ref=e1131]: 08:47 — 09:35
                    - generic [ref=e1132]: Inauspicious
                - generic [ref=e1133]:
                  - paragraph [ref=e1134]: Ruled by the serpent deity — unstable, transformative energy. Activities begun here may face hidden obstacles.
                  - paragraph [ref=e1135]: "Best for: Medicine preparation, snake-related remedies, Rahu puja"
              - generic [ref=e1136]:
                - generic [ref=e1137]:
                  - generic [ref=e1138]:
                    - generic [ref=e1139]: "3"
                    - generic [ref=e1140]: MitraMitra (Friend)
                  - generic [ref=e1141]:
                    - generic [ref=e1142]: 09:35 — 10:24
                    - generic [ref=e1143]: Auspicious
                - generic [ref=e1144]:
                  - paragraph [ref=e1145]: Mitra represents friendship, alliances, and harmony. Excellent for forming partnerships and social activities.
                  - paragraph [ref=e1146]: "Best for: Friendships, alliances, contracts, social gatherings"
              - generic [ref=e1147]:
                - generic [ref=e1148]:
                  - generic [ref=e1149]:
                    - generic [ref=e1150]: "4"
                    - generic [ref=e1151]: PitruNOWPitru (Ancestors)
                  - generic [ref=e1152]:
                    - generic [ref=e1153]: 10:24 — 11:12
                    - generic [ref=e1154]: Inauspicious
                - generic [ref=e1155]:
                  - paragraph [ref=e1156]: Dedicated to ancestral spirits. Not for material activities — but ideal for remembering and honoring the departed.
                  - paragraph [ref=e1157]: "Best for: Shraddha, Tarpan, ancestral rites, charity for deceased"
              - generic [ref=e1158]:
                - generic [ref=e1159]:
                  - generic [ref=e1160]:
                    - generic [ref=e1161]: "5"
                    - generic [ref=e1162]: VasuVasu (Wealth)
                  - generic [ref=e1163]:
                    - generic [ref=e1164]: 11:12 — 12:01
                    - generic [ref=e1165]: Auspicious
                - generic [ref=e1166]:
                  - paragraph [ref=e1167]: The Vasus are Vedic deities of wealth and natural elements. This muhurta brings material prosperity and stability.
                  - paragraph [ref=e1168]: "Best for: Financial dealings, construction, buying property, agriculture"
              - generic [ref=e1169]:
                - generic [ref=e1170]:
                  - generic [ref=e1171]:
                    - generic [ref=e1172]: "6"
                    - generic [ref=e1173]: VaraVaraha (Boar Avatar)
                  - generic [ref=e1174]:
                    - generic [ref=e1175]: 12:01 — 12:49
                    - generic [ref=e1176]: Auspicious
                - generic [ref=e1177]:
                  - paragraph [ref=e1178]: Named after Vishnu's boar incarnation who rescued the Earth. Represents protection, rescue, and recovery.
                  - paragraph [ref=e1179]: "Best for: Starting journeys, rescue missions, earth-related work, Vishnu puja"
              - generic [ref=e1180]:
                - generic [ref=e1181]:
                  - generic [ref=e1182]:
                    - generic [ref=e1183]: "7"
                    - generic [ref=e1184]: VishvedevaVishvedevas (All Gods)
                  - generic [ref=e1185]:
                    - generic [ref=e1186]: 12:49 — 13:38
                    - generic [ref=e1187]: Auspicious
                - generic [ref=e1188]:
                  - paragraph [ref=e1189]: Collectively ruled by all the Devas — universally auspicious. One of the most favorable muhurtas for any activity.
                  - paragraph [ref=e1190]: "Best for: All auspicious activities, ceremonies, education, marriages"
              - generic [ref=e1191]:
                - generic [ref=e1192]:
                  - generic [ref=e1193]:
                    - generic [ref=e1194]: "8"
                    - generic [ref=e1195]: VidhiAbhijitVidhi (Brahma)
                  - generic [ref=e1196]:
                    - generic [ref=e1197]: 13:38 — 14:26
                    - generic [ref=e1198]: Auspicious
                - generic [ref=e1199]:
                  - paragraph [ref=e1200]: Presided by Brahma the Creator. This is the ABHIJIT MUHURTA — the most auspicious muhurta of the day, around midday. Victory is assured in activities begun here.
                  - paragraph [ref=e1201]: "Best for: ALL ACTIVITIES — especially important decisions, marriages, housewarming, coronations, beginning studies"
              - generic [ref=e1202]:
                - generic [ref=e1203]:
                  - generic [ref=e1204]:
                    - generic [ref=e1205]: "9"
                    - generic [ref=e1206]: SatamukhiSatamukhi (Hundred-faced)
                  - generic [ref=e1207]:
                    - generic [ref=e1208]: 14:26 — 15:15
                    - generic [ref=e1209]: Auspicious
                - generic [ref=e1210]:
                  - paragraph [ref=e1211]: The hundred-faced one — represents versatility and multi-faceted success. Good for diverse activities.
                  - paragraph [ref=e1212]: "Best for: Trade, commerce, multi-tasking, travel, communication"
              - generic [ref=e1213]:
                - generic [ref=e1214]:
                  - generic [ref=e1215]:
                    - generic [ref=e1216]: "10"
                    - generic [ref=e1217]: PuruhutaIndra (King of Gods)
                  - generic [ref=e1218]:
                    - generic [ref=e1219]: 15:15 — 16:03
                    - generic [ref=e1220]: Auspicious
                - generic [ref=e1221]:
                  - paragraph [ref=e1222]: Ruled by Indra, king of the Devas. Brings authority, leadership power, and victory over adversaries.
                  - paragraph [ref=e1223]: "Best for: Government work, leadership roles, legal matters, competition"
              - generic [ref=e1224]:
                - generic [ref=e1225]:
                  - generic [ref=e1226]:
                    - generic [ref=e1227]: "11"
                    - generic [ref=e1228]: VahiniVahini (Fire Stream)
                  - generic [ref=e1229]:
                    - generic [ref=e1230]: 16:03 — 16:51
                    - generic [ref=e1231]: Inauspicious
                - generic [ref=e1232]:
                  - paragraph [ref=e1233]: Carries the energy of flowing fire — destructive and consuming. Activities may dissipate or burn out quickly.
                  - paragraph [ref=e1234]: "Best for: Fire-related work, metallurgy, demolition, destroying obstacles"
              - generic [ref=e1235]:
                - generic [ref=e1236]:
                  - generic [ref=e1237]:
                    - generic [ref=e1238]: "12"
                    - generic [ref=e1239]: NaktanakaraMoon (Night-maker)
                  - generic [ref=e1240]:
                    - generic [ref=e1241]: 16:51 — 17:40
                    - generic [ref=e1242]: Inauspicious
                - generic [ref=e1243]:
                  - paragraph [ref=e1244]: The "night-maker" — brings darkness into daytime activities. Mental confusion and poor judgment may prevail.
                  - paragraph [ref=e1245]: "Best for: Rest, meditation, introspection, lunar rituals"
              - generic [ref=e1246]:
                - generic [ref=e1247]:
                  - generic [ref=e1248]:
                    - generic [ref=e1249]: "13"
                    - generic [ref=e1250]: VarunaVaruna (Lord of Waters)
                  - generic [ref=e1251]:
                    - generic [ref=e1252]: 17:40 — 18:28
                    - generic [ref=e1253]: Auspicious
                - generic [ref=e1254]:
                  - paragraph [ref=e1255]: Presided by Varuna, lord of cosmic order and waters. Excellent for righteous acts, truth-telling, and water-related work.
                  - paragraph [ref=e1256]: "Best for: Water rituals, bathing ceremonies, oaths, truth-related matters"
              - generic [ref=e1257]:
                - generic [ref=e1258]:
                  - generic [ref=e1259]:
                    - generic [ref=e1260]: "14"
                    - generic [ref=e1261]: AryamanAryaman (Hospitality)
                  - generic [ref=e1262]:
                    - generic [ref=e1263]: 18:28 — 19:17
                    - generic [ref=e1264]: Auspicious
                - generic [ref=e1265]:
                  - paragraph [ref=e1266]: Aryaman presides over customs, marriages, and hospitality. Extremely favorable for weddings and social bonds.
                  - paragraph [ref=e1267]: "Best for: Marriages, engagements, hospitality, cultural ceremonies, naming"
              - generic [ref=e1268]:
                - generic [ref=e1269]:
                  - generic [ref=e1270]:
                    - generic [ref=e1271]: "15"
                    - generic [ref=e1272]: BhagaBhaga (Fortune)
                  - generic [ref=e1273]:
                    - generic [ref=e1274]: 19:17 — 20:05
                    - generic [ref=e1275]: Auspicious
                - generic [ref=e1276]:
                  - paragraph [ref=e1277]: Bhaga distributes wealth and fortune. The last daytime muhurta — represents the culmination of the day's blessings.
                  - paragraph [ref=e1278]: "Best for: Receiving wealth, inheritance matters, evening prayers, gratitude"
          - button "Nighttime Muhurtas (20:05 — next sunrise)" [ref=e1280]:
            - img [ref=e1281]
            - heading "Nighttime Muhurtas" [level=3] [ref=e1283]
            - generic [ref=e1284]: (20:05 — next sunrise)
            - img [ref=e1285]
        - generic [ref=e1289]: ✻
        - generic [ref=e1291]:
          - generic [ref=e1292]:
            - img [ref=e1294]
            - generic [ref=e1302]: Sun Sign
            - generic [ref=e1303]: Pisces
            - generic [ref=e1304]: Revati
          - generic [ref=e1305]:
            - img [ref=e1307]
            - generic [ref=e1312]: Moon Sign
            - generic [ref=e1313]: Scorpio
            - generic [ref=e1314]: Anuradha · Pada 2
          - generic [ref=e1315]:
            - img [ref=e1317]
            - generic [ref=e1323]: Day Duration
            - generic [ref=e1324]: 12:07
            - generic [ref=e1325]: "Night: 11:53"
          - generic [ref=e1326]:
            - img [ref=e1328]
            - generic [ref=e1331]: Madhyahna
            - generic [ref=e1332]: 14:02
            - generic [ref=e1333]: Local Midday
        - generic [ref=e1334]:
          - heading "Udaya Lagna — Rising Signs" [level=3] [ref=e1335]:
            - img [ref=e1336]
            - generic [ref=e1338]: Udaya Lagna — Rising Signs
          - paragraph [ref=e1339]: The zodiac sign rising on the eastern horizon changes approximately every 2 hours. Each rising window carries the energy of that sign for muhurta selection.
          - generic [ref=e1341]:
            - generic [ref=e1342]:
              - img [ref=e1344]
              - generic [ref=e1349]: Virgo
              - generic [ref=e1350]: 07:59 – 08:39
            - generic [ref=e1351]:
              - img [ref=e1353]
              - generic [ref=e1357]: Libra
              - generic [ref=e1358]: 08:39 – 10:29
            - generic [ref=e1359]:
              - img [ref=e1361]
              - generic [ref=e1366]: Scorpio
              - generic [ref=e1367]: 10:29 – 12:39
            - generic [ref=e1368]:
              - img [ref=e1370]
              - generic [ref=e1375]: Sagittarius
              - generic [ref=e1376]: 12:39 – 14:49
            - generic [ref=e1377]:
              - img [ref=e1379]
              - generic [ref=e1384]: Capricorn
              - generic [ref=e1385]: 14:49 – 16:49
            - generic [ref=e1386]:
              - img [ref=e1388]
              - generic [ref=e1394]: Aquarius
              - generic [ref=e1395]: 16:49 – 18:39
            - generic [ref=e1396]:
              - img [ref=e1398]
              - generic [ref=e1406]: Pisces
              - generic [ref=e1407]: 18:39 – 20:39
            - generic [ref=e1408]:
              - img [ref=e1410]
              - generic [ref=e1414]: Aries
              - generic [ref=e1415]: 20:39 – 22:29
            - generic [ref=e1416]:
              - img [ref=e1418]
              - generic [ref=e1426]: Taurus
              - generic [ref=e1427]: 22:29 – 00:39
            - generic [ref=e1428]:
              - img [ref=e1430]
              - generic [ref=e1435]: Gemini
              - generic [ref=e1436]: 00:39 – 02:49
            - generic [ref=e1437]:
              - img [ref=e1439]
              - generic [ref=e1444]: Cancer
              - generic [ref=e1445]: 02:49 – 04:49
            - generic [ref=e1446]:
              - img [ref=e1448]
              - generic [ref=e1455]: Leo
              - generic [ref=e1456]: 04:49 – 06:39
            - generic [ref=e1457]:
              - img [ref=e1459]
              - generic [ref=e1464]: Virgo
              - generic [ref=e1465]: 06:39 – 07:59
        - generic [ref=e1468]: ✻
        - button "What is Chandrabalam & Tarabalam?" [ref=e1471]:
          - img [ref=e1473]
          - generic [ref=e1476]: What is Chandrabalam & Tarabalam?
          - img [ref=e1477]
        - generic [ref=e1479]:
          - heading "Chandrabalam & Tarabalam" [level=2] [ref=e1480]
          - paragraph [ref=e1481]: Select your birth Nakshatra and Rashi, or generate a Kundali first to auto-detect.
          - generic [ref=e1483]:
            - generic [ref=e1484]:
              - generic [ref=e1485]: Birth Nakshatra
              - combobox [ref=e1486]:
                - option "Select..." [selected]
                - option "Ashwini"
                - option "Bharani"
                - option "Krittika"
                - option "Rohini"
                - option "Mrigashira"
                - option "Ardra"
                - option "Punarvasu"
                - option "Pushya"
                - option "Ashlesha"
                - option "Magha"
                - option "Purva Phalguni"
                - option "Uttara Phalguni"
                - option "Hasta"
                - option "Chitra"
                - option "Swati"
                - option "Vishakha"
                - option "Anuradha"
                - option "Jyeshtha"
                - option "Mula"
                - option "Purva Ashadha"
                - option "Uttara Ashadha"
                - option "Shravana"
                - option "Dhanishtha"
                - option "Shatabhisha"
                - option "Purva Bhadrapada"
                - option "Uttara Bhadrapada"
                - option "Revati"
            - generic [ref=e1487]:
              - generic [ref=e1488]: Birth Rashi (Moon)
              - combobox [ref=e1489]:
                - option "Select..." [selected]
                - option "Aries"
                - option "Taurus"
                - option "Gemini"
                - option "Cancer"
                - option "Leo"
                - option "Virgo"
                - option "Libra"
                - option "Scorpio"
                - option "Sagittarius"
                - option "Capricorn"
                - option "Aquarius"
                - option "Pisces"
        - generic [ref=e1492]: ✻
        - generic [ref=e1496]: ✻
        - generic [ref=e1498]:
          - heading "Planetary Positions (Navagraha)" [level=2] [ref=e1499]
          - table [ref=e1502]:
            - rowgroup [ref=e1503]:
              - row "Planet Sign Longitude Nakshatra Retrograde" [ref=e1504]:
                - columnheader "Planet" [ref=e1505]
                - columnheader "Sign" [ref=e1506]
                - columnheader "Longitude" [ref=e1507]
                - columnheader "Nakshatra" [ref=e1508]
                - columnheader "Retrograde" [ref=e1509]
            - rowgroup [ref=e1510]:
              - row "Sun Pisces 352.22° Revati —" [ref=e1511]:
                - cell "Sun" [ref=e1512]:
                  - generic [ref=e1513]:
                    - img [ref=e1514]
                    - generic [ref=e1525]: Sun
                - cell "Pisces" [ref=e1526]:
                  - generic [ref=e1527]:
                    - img [ref=e1528]
                    - generic [ref=e1536]: Pisces
                - cell "352.22°" [ref=e1537]
                - cell "Revati" [ref=e1538]
                - cell "—" [ref=e1539]
              - row "Moon Scorpio 218.99° Anuradha —" [ref=e1540]:
                - cell "Moon" [ref=e1541]:
                  - generic [ref=e1542]:
                    - img [ref=e1543]
                    - generic [ref=e1549]: Moon
                - cell "Scorpio" [ref=e1550]:
                  - generic [ref=e1551]:
                    - img [ref=e1552]
                    - generic [ref=e1557]: Scorpio
                - cell "218.99°" [ref=e1558]
                - cell "Anuradha" [ref=e1559]
                - cell "—" [ref=e1560]
              - row "Mars Pisces 333.00° Purva Bhadrapada —" [ref=e1561]:
                - cell "Mars" [ref=e1562]:
                  - generic [ref=e1563]:
                    - img [ref=e1564]
                    - generic [ref=e1568]: Mars
                - cell "Pisces" [ref=e1569]:
                  - generic [ref=e1570]:
                    - img [ref=e1571]
                    - generic [ref=e1579]: Pisces
                - cell "333.00°" [ref=e1580]
                - cell "Purva Bhadrapada" [ref=e1581]
                - cell "—" [ref=e1582]
              - row "Mercury Aquarius 324.59° Purva Bhadrapada —" [ref=e1583]:
                - cell "Mercury" [ref=e1584]:
                  - generic [ref=e1585]:
                    - img [ref=e1586]
                    - generic [ref=e1590]: Mercury
                - cell "Aquarius" [ref=e1591]:
                  - generic [ref=e1592]:
                    - img [ref=e1593]
                    - generic [ref=e1599]: Aquarius
                - cell "324.59°" [ref=e1600]
                - cell "Purva Bhadrapada" [ref=e1601]
                - cell "—" [ref=e1602]
              - row "Jupiter Gemini 81.94° Punarvasu —" [ref=e1603]:
                - cell "Jupiter" [ref=e1604]:
                  - generic [ref=e1605]:
                    - img [ref=e1606]
                    - generic [ref=e1612]: Jupiter
                - cell "Gemini" [ref=e1613]:
                  - generic [ref=e1614]:
                    - img [ref=e1615]
                    - generic [ref=e1620]: Gemini
                - cell "81.94°" [ref=e1621]
                - cell "Punarvasu" [ref=e1622]
                - cell "—" [ref=e1623]
              - row "Venus Aries 13.87° Bharani —" [ref=e1624]:
                - cell "Venus" [ref=e1625]:
                  - generic [ref=e1626]:
                    - img [ref=e1627]
                    - generic [ref=e1630]: Venus
                - cell "Aries" [ref=e1631]:
                  - generic [ref=e1632]:
                    - img [ref=e1633]
                    - generic [ref=e1637]: Aries
                - cell "13.87°" [ref=e1638]
                - cell "Bharani" [ref=e1639]
                - cell "—" [ref=e1640]
              - row "Saturn Pisces 341.97° Uttara Bhadrapada —" [ref=e1641]:
                - cell "Saturn" [ref=e1642]:
                  - generic [ref=e1643]:
                    - img [ref=e1644]
                    - generic [ref=e1650]: Saturn
                - cell "Pisces" [ref=e1651]:
                  - generic [ref=e1652]:
                    - img [ref=e1653]
                    - generic [ref=e1661]: Pisces
                - cell "341.97°" [ref=e1662]
                - cell "Uttara Bhadrapada" [ref=e1663]
                - cell "—" [ref=e1664]
              - row "Rahu Aquarius 312.90° Shatabhisha R" [ref=e1665]:
                - cell "Rahu" [ref=e1666]:
                  - generic [ref=e1667]:
                    - img [ref=e1668]
                    - generic [ref=e1678]: Rahu
                - cell "Aquarius" [ref=e1679]:
                  - generic [ref=e1680]:
                    - img [ref=e1681]
                    - generic [ref=e1687]: Aquarius
                - cell "312.90°" [ref=e1688]
                - cell "Shatabhisha" [ref=e1689]
                - cell "R" [ref=e1690]
              - row "Ketu Leo 132.90° Magha R" [ref=e1691]:
                - cell "Ketu" [ref=e1692]:
                  - generic [ref=e1693]:
                    - img [ref=e1694]
                    - generic [ref=e1700]: Ketu
                - cell "Leo" [ref=e1701]:
                  - generic [ref=e1702]:
                    - img [ref=e1703]
                    - generic [ref=e1710]: Leo
                - cell "132.90°" [ref=e1711]
                - cell "Magha" [ref=e1712]
                - cell "R" [ref=e1713]
        - generic [ref=e1716]: ✻
      - generic [ref=e1718]:
        - heading "Explore the Elements" [level=2] [ref=e1719]
        - generic [ref=e1720]:
          - link "Tithi" [ref=e1722] [cursor=pointer]:
            - /url: /en/panchang/tithi
            - img [ref=e1724]
            - generic [ref=e1730]: Tithi
          - link "Nakshatra" [ref=e1732] [cursor=pointer]:
            - /url: /en/panchang/nakshatra
            - img [ref=e1734]
            - generic [ref=e1739]: Nakshatra
          - link "Yoga" [ref=e1741] [cursor=pointer]:
            - /url: /en/panchang/yoga
            - img [ref=e1743]
            - generic [ref=e1748]: Yoga
          - link "Karana" [ref=e1750] [cursor=pointer]:
            - /url: /en/panchang/karana
            - img [ref=e1752]
            - generic [ref=e1758]: Karana
          - link "Muhurta" [ref=e1760] [cursor=pointer]:
            - /url: /en/panchang/muhurta
            - img [ref=e1762]
            - generic [ref=e1769]: Muhurta
          - link "Grahan" [ref=e1771] [cursor=pointer]:
            - /url: /en/panchang/grahan
            - img [ref=e1773]
            - generic [ref=e1790]: Grahan
          - link "Rashi" [ref=e1792] [cursor=pointer]:
            - /url: /en/panchang/rashi
            - img [ref=e1794]
            - generic [ref=e1806]: Rashi
          - link "Masa" [ref=e1808] [cursor=pointer]:
            - /url: /en/panchang/masa
            - img [ref=e1810]
            - generic [ref=e1816]: Masa
          - link "Samvatsara" [ref=e1818] [cursor=pointer]:
            - /url: /en/panchang/samvatsara
            - img [ref=e1820]:
              - generic [ref=e1833]: "60"
            - generic [ref=e1834]: Samvatsara
  - contentinfo [ref=e1835]:
    - generic [ref=e1837]:
      - generic [ref=e1838]:
        - generic [ref=e1839]: Dekho Panchang
        - generic [ref=e1840]: © 2026
      - generic [ref=e1841]:
        - link "Panchang" [ref=e1842] [cursor=pointer]:
          - /url: /en/panchang
        - link "Kundali" [ref=e1843] [cursor=pointer]:
          - /url: /en/kundali
        - link "Calendar" [ref=e1844] [cursor=pointer]:
          - /url: /en/calendar
        - link "Learn" [ref=e1845] [cursor=pointer]:
          - /url: /en/learn
        - link "About" [ref=e1846] [cursor=pointer]:
          - /url: /en/about
        - link "Pricing" [ref=e1847] [cursor=pointer]:
          - /url: /en/pricing
      - paragraph [ref=e1848]: ॐ ज्योतिषां ज्योतिः
  - generic [ref=e1853] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e1854]:
      - img [ref=e1855]
    - generic [ref=e1858]:
      - button "Open issues overlay" [ref=e1859]:
        - generic [ref=e1860]:
          - generic [ref=e1861]: "0"
          - generic [ref=e1862]: "1"
        - generic [ref=e1863]: Issue
      - button "Collapse issues badge" [ref=e1864]:
        - img [ref=e1865]
  - alert [ref=e1867]
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
> 46  |     await expect(page.locator('text=/Pratipada|Dwitiya|Tritiya|Chaturthi|Panchami|Shashthi|Saptami|Ashtami|Navami|Dashami|Ekadashi|Dwadashi|Trayodashi|Chaturdashi|Purnima|Amavasya/')).toBeVisible({ timeout: 15000 });
      |                                                                                                                                                                                         ^ Error: expect(locator).toBeVisible() failed
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
  138 |     await page.goto(`${BASE}/en`);
  139 |     await page.click('text=Sign In');
  140 |     await page.click('text=Sign up');
  141 |     await expect(page.locator('text=Create Account')).toBeVisible({ timeout: 5000 });
  142 |     await expect(page.locator('input[placeholder="Name"]')).toBeVisible();
  143 |     await expect(page.locator('input[placeholder="Confirm Password"]')).toBeVisible();
  144 |   });
  145 | });
  146 | 
```