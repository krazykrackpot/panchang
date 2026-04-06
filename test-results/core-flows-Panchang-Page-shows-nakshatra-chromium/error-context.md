# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows.spec.ts >> Panchang Page >> shows nakshatra
- Location: e2e/core-flows.spec.ts:55:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/Ashwini|Bharani|Krittika|Rohini|Mrigashira|Ardra|Punarvasu|Pushya|Ashlesha|Magha|Purva Phalguni|Uttara Phalguni|Hasta|Chitra|Swati|Vishakha|Anuradha|Jyeshtha|Mula|Purva Ashadha|Uttara Ashadha|Shravana|Dhanishta|Shatabhisha|Purva Bhadrapada|Uttara Bhadrapada|Revati/')
Expected: visible
Error: strict mode violation: locator('text=/Ashwini|Bharani|Krittika|Rohini|Mrigashira|Ardra|Punarvasu|Pushya|Ashlesha|Magha|Purva Phalguni|Uttara Phalguni|Hasta|Chitra|Swati|Vishakha|Anuradha|Jyeshtha|Mula|Purva Ashadha|Uttara Ashadha|Shravana|Dhanishta|Shatabhisha|Purva Bhadrapada|Uttara Bhadrapada|Revati/') resolved to 42 elements:
    1) <div class="text-gold-light text-lg font-bold leading-tight">Anuradha</div> aka locator('div').filter({ hasText: /^Anuradha$/ })
    2) <div class="text-gold-light text-lg font-bold leading-tight">Jyeshtha</div> aka locator('div').filter({ hasText: /^Jyeshtha$/ })
    3) <span class="text-gold-light">Magha</span> aka getByText('Magha').first()
    4) <span class="text-gold-light">Jyeshtha</span> aka locator('span').filter({ hasText: 'Jyeshtha' })
    5) <span class="text-gold-light">Shravana</span> aka locator('span').filter({ hasText: 'Shravana' })
    6) <div class="text-text-secondary text-xs mt-1">Revati</div> aka locator('div').filter({ hasText: /^Revati$/ })
    7) <div class="text-text-secondary text-xs mt-1">Anuradha · Pada 2</div> aka getByText('Anuradha · Pada')
    8) <option value="1">Ashwini</option> aka getByRole('combobox').first()
    9) <option value="2">Bharani</option> aka getByRole('combobox').first()
    10) <option value="3">Krittika</option> aka getByRole('combobox').first()
    ...

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('text=/Ashwini|Bharani|Krittika|Rohini|Mrigashira|Ardra|Punarvasu|Pushya|Ashlesha|Magha|Purva Phalguni|Uttara Phalguni|Hasta|Chitra|Swati|Vishakha|Anuradha|Jyeshtha|Mula|Purva Ashadha|Uttara Ashadha|Shravana|Dhanishta|Shatabhisha|Purva Bhadrapada|Uttara Bhadrapada|Revati/')

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
          - generic [ref=e113]:
            - img [ref=e115]
            - generic [ref=e121]: Tithi
            - generic [ref=e122]:
              - generic [ref=e123]: Chaturthi
              - generic [ref=e124]: Krishna Paksha (Waning)
              - generic [ref=e125]:
                - generic [ref=e126]: 08:30, 5 Apr — 10:41, 6 Apr
                - generic [ref=e127]: 24h
            - generic [ref=e128]:
              - generic [ref=e129]: Panchami
              - generic [ref=e130]: Krishna Paksha (Waning)
              - generic [ref=e131]: 10:41, 6 Apr onwards
            - generic [ref=e132]: "Waning Moon — Deity: Ganesha"
          - generic [ref=e133]:
            - img [ref=e135]
            - generic [ref=e140]: Nakshatra
            - generic [ref=e141]:
              - generic [ref=e142]: Anuradha
              - generic [ref=e143]: Mitra · Pada 2
              - generic [ref=e144]:
                - generic [ref=e145]: 20:37, 5 Apr — 23:26, 6 Apr
                - generic [ref=e146]: 24h
            - generic [ref=e147]:
              - generic [ref=e148]: Jyeshtha
              - generic [ref=e149]: Indra
              - generic [ref=e150]: 23:26, 6 Apr onwards
            - generic [ref=e151]: "Nature: Soft, Tender — Ruler: Saturn"
          - generic [ref=e152]:
            - img [ref=e154]
            - generic [ref=e159]: Yoga
            - generic [ref=e160]: Siddhi
            - generic [ref=e161]: Accomplishment
            - generic [ref=e162]:
              - generic [ref=e163]: 11:13, 5 Apr — 11:54, 6 Apr
              - generic [ref=e164]: 24h
              - generic [ref=e165]: then Vyatipata
            - generic [ref=e166]: Favorable — good for new beginnings
          - generic [ref=e167]:
            - img [ref=e169]
            - generic [ref=e175]: Karana
            - generic [ref=e176]: Kaulava
            - generic [ref=e177]: Movable
            - generic [ref=e178]:
              - generic [ref=e179]: 21:33, 5 Apr — 10:41, 6 Apr
              - generic [ref=e180]: 24h
            - generic [ref=e181]: Movable — good for travel & new work
          - generic [ref=e182]:
            - img [ref=e184]
            - generic [ref=e196]: Vara
            - generic [ref=e197]: Monday
            - generic [ref=e198]: Moon
            - generic [ref=e199]: Ruled by Moon — good for new starts
        - generic [ref=e200]:
          - generic [ref=e201]: Current Hora — Best Activity Now
          - generic [ref=e202]: 10:00 – 11:00
          - generic [ref=e203]: Education, finance, spiritual practice
        - generic [ref=e206]: ✻
        - generic [ref=e208]:
          - generic [ref=e209]:
            - img [ref=e210]
            - generic [ref=e216]:
              - generic [ref=e217]: Sunrise
              - generic [ref=e218]: 07:59
          - generic [ref=e219]:
            - img [ref=e220]
            - generic [ref=e223]:
              - generic [ref=e224]: Sunset
              - generic [ref=e225]: 20:05
          - generic [ref=e226]:
            - img [ref=e227]
            - generic [ref=e232]:
              - generic [ref=e233]: Moonrise
              - generic [ref=e234]: 23:36
          - generic [ref=e235]:
            - img [ref=e236]
            - generic [ref=e239]:
              - generic [ref=e240]: Moonset
              - generic [ref=e241]: 11:05
        - generic [ref=e244]: ✻
        - generic [ref=e246]:
          - generic [ref=e247]:
            - img [ref=e249]
            - heading "Auspicious Timings" [level=2] [ref=e256]
            - paragraph [ref=e257]: Sacred windows of time blessed by planetary harmony — begin new ventures, ceremonies, and important work during these periods.
          - generic [ref=e259]:
            - generic [ref=e262]: Sarvartha Siddhi Yoga
            - generic [ref=e264]: Active today! All new activities are favored.
            - generic [ref=e265]: All endeavors succeed — highly auspicious day
          - generic [ref=e266]:
            - generic [ref=e267]:
              - generic [ref=e268]: Brahma Muhurta
              - generic [ref=e269]: 06:23 — 07:11
              - generic [ref=e270]: 96 min before sunrise — ideal for meditation & study
            - generic [ref=e271]:
              - generic [ref=e272]: Abhijit Muhurta
              - generic [ref=e273]: 13:38 — 14:26
              - generic [ref=e274]: Most auspicious — victory assured
            - generic [ref=e275]:
              - generic [ref=e276]: Vijaya Muhurta
              - generic [ref=e277]: 15:15 — 16:03
              - generic [ref=e278]: 10th muhurta — victory assured
            - generic [ref=e279]:
              - generic [ref=e280]: Amrit Kalam
              - generic [ref=e281]: 02:23 — 03:59
              - generic [ref=e282]: The most auspicious time window of the day
            - generic [ref=e283]:
              - generic [ref=e284]: Godhuli Muhurta
              - generic [ref=e285]: 19:53 — 20:17
              - generic [ref=e286]: Cow-dust time around sunset — auspicious for ceremonies
            - generic [ref=e287]:
              - generic [ref=e288]: Morning Sandhya
              - generic [ref=e289]: 07:35 — 08:23
              - generic [ref=e290]: Pratah Sandhya — morning prayers
            - generic [ref=e291]:
              - generic [ref=e292]: Evening Sandhya
              - generic [ref=e293]: 19:41 — 20:29
              - generic [ref=e294]: Sayahna Sandhya — evening prayers
            - generic [ref=e295]:
              - generic [ref=e296]: Nishita Kaal
              - generic [ref=e297]: 01:38 — 02:26
              - generic [ref=e298]: Midnight period — sacred to Lord Shiva
            - generic [ref=e299]:
              - generic [ref=e300]: Anandadi Yoga
              - generic [ref=e301]: Ananda
              - generic [ref=e302]: Auspicious yoga — favourable energy
            - generic [ref=e303]:
              - generic [ref=e304]: Tamil Yoga
              - generic [ref=e305]: Marana Yoga
              - generic [ref=e306]: Inauspicious — avoid new ventures
            - generic [ref=e307]:
              - generic [ref=e308]: Homahuti Direction
              - generic [ref=e309]:
                - img [ref=e311]
                - generic [ref=e314]:
                  - generic [ref=e315]: Northwest
                  - generic [ref=e316]: Face this direction for Homa
              - generic [ref=e317]: "Presiding deity: Chandra"
            - generic [ref=e318]:
              - generic [ref=e319]: Mantri Mandala
              - generic [ref=e320]:
                - generic [ref=e321]:
                  - generic [ref=e322]: King
                  - generic [ref=e323]: Mercury
                - generic [ref=e324]:
                  - generic [ref=e325]: Minister
                  - generic [ref=e326]: Mercury
              - generic [ref=e327]: Day lord governs as King, sunrise Hora lord serves as Minister
        - generic [ref=e330]: ✻
        - generic [ref=e332]:
          - generic [ref=e333]:
            - img [ref=e335]
            - heading "Inauspicious Timings" [level=2] [ref=e338]
            - paragraph [ref=e339]: Avoid initiating new activities, journeys, or important decisions during these planetary affliction periods.
          - generic [ref=e340]:
            - generic [ref=e341]:
              - generic [ref=e342]: Rahu Kaal
              - generic [ref=e343]: 09:29 — 11:00
              - generic [ref=e344]: Rahu's period — avoid new work
            - generic [ref=e345]:
              - generic [ref=e346]: Yamaganda
              - generic [ref=e347]: 12:31 — 14:02
              - generic [ref=e348]: Yama's period — inauspicious
            - generic [ref=e349]:
              - generic [ref=e350]: Gulika Kaal
              - generic [ref=e351]: 15:33 — 17:04
              - generic [ref=e352]: Gulika's period — avoid travel
            - generic [ref=e353]:
              - generic [ref=e354]: Dur Muhurtam
              - generic [ref=e355]: 12:49 — 13:38
              - generic [ref=e356]: Inauspicious — avoid all new work
            - generic [ref=e357]:
              - generic [ref=e358]: Visha Ghatika
              - generic [ref=e359]: 17:35 — 17:59
              - generic [ref=e360]: 25th Ghatika — poison period, avoid all new activities
            - generic [ref=e361]:
              - generic [ref=e362]: Varjyam
              - generic [ref=e363]: 01:35 — 03:11
              - generic [ref=e364]: Inauspicious time — avoid starting new activities
        - generic [ref=e367]: ✻
        - generic [ref=e369]:
          - generic [ref=e370]:
            - img [ref=e372]
            - heading "Nivas & Shool" [level=2] [ref=e375]
            - paragraph [ref=e376]: Where cosmic forces reside today — directional afflictions, divine abodes, and their remedies.
          - link "Learn about all Nivas & Shool concepts →" [ref=e378] [cursor=pointer]:
            - /url: /en/nivas-shool
          - generic [ref=e379]:
            - generic [ref=e380]:
              - generic [ref=e381]: Disha Shool
              - generic [ref=e382]:
                - generic [ref=e384]: E
                - generic [ref=e385]:
                  - generic [ref=e386]: East
                  - generic [ref=e387]: Inauspicious direction for the day — avoid travel
              - generic [ref=e388]:
                - generic [ref=e389]: Remedy
                - generic [ref=e390]: Consume milk before travel
            - generic [ref=e391]:
              - generic [ref=e392]:
                - generic [ref=e393]: Shiva Vaas
                - generic [ref=e394]: Neutral
              - generic [ref=e395]: Sports & Play
              - generic [ref=e396]: "Tithis: 4, 9, 14"
              - generic [ref=e397]: Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.
              - generic [ref=e398]:
                - generic [ref=e399]: Activities
                - generic [ref=e400]: Arts, music, dance; avoid critical ventures
            - generic [ref=e401]:
              - generic [ref=e402]:
                - generic [ref=e403]: Agni Vaas
                - generic [ref=e404]: Auspicious
              - generic [ref=e405]: Earth (Bhumi)
              - generic [ref=e406]: Until 07:56
              - generic [ref=e407]: Agni is grounded in the earth plane. Fire rituals nourish the land and people.
              - generic [ref=e408]:
                - generic [ref=e409]: Fire Ritual Impact
                - generic [ref=e410]: Agriculture blessings, prosperity rituals, Griha Pravesh powerful
            - generic [ref=e411]:
              - generic [ref=e412]:
                - generic [ref=e413]: Chandra Vaas
                - generic [ref=e414]: Neutral
              - generic [ref=e415]:
                - generic [ref=e416]: Indra's Abode
                - generic [ref=e417]:
                  - img [ref=e418]
                  - generic [ref=e421]: South
              - generic [ref=e422]: Moon faces South in Nara (human) abode — ordinary activity plane. Results are as expected, neither elevated nor hindered.
              - generic [ref=e423]:
                - generic [ref=e424]: Activities
                - generic [ref=e425]: Daily work, business, social activities
            - generic [ref=e426]:
              - generic [ref=e427]:
                - generic [ref=e428]: Rahu Vaas
                - generic [ref=e429]: Avoid
              - generic [ref=e430]:
                - img [ref=e432]
                - generic [ref=e435]:
                  - generic [ref=e436]: Northwest
                  - generic [ref=e437]: Rahu's facing direction
              - generic [ref=e438]: Rahu (shadow planet) faces this direction today. Avoid land purchase, foundation laying, and long-term construction in this direction. Exercise caution for travel as well.
              - generic [ref=e439]:
                - generic [ref=e440]: Guidance
                - generic [ref=e441]: Do not initiate new ventures in this direction. Protective mantras and Hanuman invocation are beneficial.
        - generic [ref=e444]: ✻
        - generic [ref=e446]:
          - generic [ref=e447]:
            - img [ref=e449]
            - heading "Calendars & Epoch" [level=2] [ref=e451]
            - paragraph [ref=e452]: The Hindu calendar system — lunar months, seasons, cosmic cycles, and our position in deep time.
          - generic [ref=e453]:
            - heading "Hindu Calendar" [level=3] [ref=e454]:
              - img [ref=e455]
              - generic [ref=e461]: Hindu Calendar
            - generic [ref=e463]:
              - generic [ref=e464]:
                - generic [ref=e465]: Vikram Samvat
                - generic [ref=e466]: "2083"
              - generic [ref=e467]:
                - generic [ref=e468]: Shaka Samvat
                - generic [ref=e469]: "1948"
              - generic [ref=e470]:
                - img [ref=e472]:
                  - generic [ref=e485]: "60"
                - generic [ref=e486]: Samvatsara (Year)
                - generic [ref=e487]: Siddharthi
              - generic [ref=e488]:
                - img [ref=e490]
                - generic [ref=e496]: Masa (Amant)
                - generic [ref=e497]: Vaishakha
              - generic [ref=e498]:
                - generic [ref=e499]: Paksha
                - generic [ref=e500]: Krishna Paksha
              - generic [ref=e501]:
                - img [ref=e503]
                - generic [ref=e507]: Ritu (Season)
                - generic [ref=e508]: Vasanta (Spring)
              - generic [ref=e509]:
                - img [ref=e511]
                - generic [ref=e515]: Ayana
                - generic [ref=e516]: Uttarayana
              - generic [ref=e517]:
                - generic [ref=e518]: Ayanamsha (Lahiri)
                - generic [ref=e519]: 24.2239°
              - generic [ref=e520]:
                - generic [ref=e521]: Day Duration
                - generic [ref=e522]: 12:07
              - generic [ref=e523]:
                - generic [ref=e524]: Night Duration
                - generic [ref=e525]: 11:53
              - generic [ref=e526]:
                - generic [ref=e527]: Madhyahna
                - generic [ref=e528]: 14:02
          - generic [ref=e529]:
            - generic [ref=e530]:
              - heading "Hindu Months 2026" [level=4] [ref=e531]:
                - img [ref=e532]
                - text: Hindu Months 2026
              - generic [ref=e538]:
                - button "Amant" [ref=e539]
                - button "Purnimant" [ref=e540]
            - paragraph [ref=e541]: "Amant system: Each month begins on Amavasya (New Moon) and ends on the next Amavasya. Used in South & West India."
            - table [ref=e543]:
              - rowgroup [ref=e544]:
                - row "# Hindu Month Sanskrit Start End Ritu" [ref=e545]:
                  - columnheader "#" [ref=e546]
                  - columnheader "Hindu Month" [ref=e547]
                  - columnheader "Sanskrit" [ref=e548]
                  - columnheader "Start" [ref=e549]
                  - columnheader "End" [ref=e550]
                  - columnheader "Ritu" [ref=e551]
              - rowgroup [ref=e552]:
                - row "1 Margashirsha मार्गशीर्षः 11 Dec 10 Jan Hemanta (Pre-Winter)" [ref=e553]:
                  - cell "1" [ref=e554]
                  - cell "Margashirsha" [ref=e555]
                  - cell "मार्गशीर्षः" [ref=e556]
                  - cell "11 Dec" [ref=e557]
                  - cell "10 Jan" [ref=e558]
                  - cell "Hemanta (Pre-Winter)" [ref=e559]
                - row "2 Pausha पौषः 10 Jan 9 Feb Hemanta (Pre-Winter)" [ref=e560]:
                  - cell "2" [ref=e561]
                  - cell "Pausha" [ref=e562]
                  - cell "पौषः" [ref=e563]
                  - cell "10 Jan" [ref=e564]
                  - cell "9 Feb" [ref=e565]
                  - cell "Hemanta (Pre-Winter)" [ref=e566]
                - row "3 Magha माघः 9 Feb 11 Mar Shishira (Winter)" [ref=e567]:
                  - cell "3" [ref=e568]
                  - cell "Magha" [ref=e569]
                  - cell "माघः" [ref=e570]
                  - cell "9 Feb" [ref=e571]
                  - cell "11 Mar" [ref=e572]
                  - cell "Shishira (Winter)" [ref=e573]
                - row "4 PhalgunaNOW फाल्गुनः 11 Mar 10 Apr Shishira (Winter)" [ref=e574]:
                  - cell "4" [ref=e575]
                  - cell "PhalgunaNOW" [ref=e576]
                  - cell "फाल्गुनः" [ref=e577]
                  - cell "11 Mar" [ref=e578]
                  - cell "10 Apr" [ref=e579]
                  - cell "Shishira (Winter)" [ref=e580]
                - row "5 Chaitra चैत्रः 10 Apr 9 May Vasanta (Spring)" [ref=e581]:
                  - cell "5" [ref=e582]
                  - cell "Chaitra" [ref=e583]
                  - cell "चैत्रः" [ref=e584]
                  - cell "10 Apr" [ref=e585]
                  - cell "9 May" [ref=e586]
                  - cell "Vasanta (Spring)" [ref=e587]
                - row "6 Vaishakha वैशाखः 9 May 8 Jun Vasanta (Spring)" [ref=e588]:
                  - cell "6" [ref=e589]
                  - cell "Vaishakha" [ref=e590]
                  - cell "वैशाखः" [ref=e591]
                  - cell "9 May" [ref=e592]
                  - cell "8 Jun" [ref=e593]
                  - cell "Vasanta (Spring)" [ref=e594]
                - row "7 Jyeshtha ज्येष्ठः 8 Jun 7 Jul Grishma (Summer)" [ref=e595]:
                  - cell "7" [ref=e596]
                  - cell "Jyeshtha" [ref=e597]
                  - cell "ज्येष्ठः" [ref=e598]
                  - cell "8 Jun" [ref=e599]
                  - cell "7 Jul" [ref=e600]
                  - cell "Grishma (Summer)" [ref=e601]
                - row "8 Ashadha आषाढः 7 Jul 6 Aug Grishma (Summer)" [ref=e602]:
                  - cell "8" [ref=e603]
                  - cell "Ashadha" [ref=e604]
                  - cell "आषाढः" [ref=e605]
                  - cell "7 Jul" [ref=e606]
                  - cell "6 Aug" [ref=e607]
                  - cell "Grishma (Summer)" [ref=e608]
                - row "9 Shravana श्रावणः 6 Aug 4 Sep Varsha (Monsoon)" [ref=e609]:
                  - cell "9" [ref=e610]
                  - cell "Shravana" [ref=e611]
                  - cell "श्रावणः" [ref=e612]
                  - cell "6 Aug" [ref=e613]
                  - cell "4 Sep" [ref=e614]
                  - cell "Varsha (Monsoon)" [ref=e615]
                - row "10 Bhadrapada भाद्रपदः 4 Sep 3 Oct Varsha (Monsoon)" [ref=e616]:
                  - cell "10" [ref=e617]
                  - cell "Bhadrapada" [ref=e618]
                  - cell "भाद्रपदः" [ref=e619]
                  - cell "4 Sep" [ref=e620]
                  - cell "3 Oct" [ref=e621]
                  - cell "Varsha (Monsoon)" [ref=e622]
                - row "11 Ashvina आश्विनः 3 Oct 1 Nov Sharad (Autumn)" [ref=e623]:
                  - cell "11" [ref=e624]
                  - cell "Ashvina" [ref=e625]
                  - cell "आश्विनः" [ref=e626]
                  - cell "3 Oct" [ref=e627]
                  - cell "1 Nov" [ref=e628]
                  - cell "Sharad (Autumn)" [ref=e629]
                - row "12 Kartika कार्तिकः 1 Nov 1 Dec Sharad (Autumn)" [ref=e630]:
                  - cell "12" [ref=e631]
                  - cell "Kartika" [ref=e632]
                  - cell "कार्तिकः" [ref=e633]
                  - cell "1 Nov" [ref=e634]
                  - cell "1 Dec" [ref=e635]
                  - cell "Sharad (Autumn)" [ref=e636]
                - row "13 Margashirsha मार्गशीर्षः 1 Dec 30 Dec Hemanta (Pre-Winter)" [ref=e637]:
                  - cell "13" [ref=e638]
                  - cell "Margashirsha" [ref=e639]
                  - cell "मार्गशीर्षः" [ref=e640]
                  - cell "1 Dec" [ref=e641]
                  - cell "30 Dec" [ref=e642]
                  - cell "Hemanta (Pre-Winter)" [ref=e643]
                - row "14 Pausha पौषः 30 Dec 29 Jan Hemanta (Pre-Winter)" [ref=e644]:
                  - cell "14" [ref=e645]
                  - cell "Pausha" [ref=e646]
                  - cell "पौषः" [ref=e647]
                  - cell "30 Dec" [ref=e648]
                  - cell "29 Jan" [ref=e649]
                  - cell "Hemanta (Pre-Winter)" [ref=e650]
            - paragraph [ref=e651]: Amant dates computed from actual New Moon positions for 2026. Each month starts on Amavasya. Adhika Masa (intercalary, purple) occurs when two New Moons fall in the same solar month.
          - generic [ref=e652]:
            - heading "Epoch & Cosmic Time" [level=3] [ref=e653]:
              - img [ref=e654]
              - generic [ref=e656]: Epoch & Cosmic Time
            - generic [ref=e657]:
              - generic [ref=e658]:
                - generic [ref=e659]: Kali Ahargana
                - generic [ref=e660]: 1,872,671
                - generic [ref=e661]: Days elapsed since Kali Yuga began (Feb 18, 3102 BCE)
              - generic [ref=e662]:
                - generic [ref=e663]: Kaliyuga Year
                - generic [ref=e664]: 5,128
                - generic [ref=e665]: Current year in the Kali Yuga cycle (432,000 years total)
              - generic [ref=e666]:
                - generic [ref=e667]: Julian Day Number
                - generic [ref=e668]: 2,461,136
                - generic [ref=e669]: Astronomical day count from Jan 1, 4713 BCE noon
            - generic [ref=e670]:
              - generic [ref=e671]:
                - generic [ref=e672]:
                  - generic [ref=e673]: "Current Yuga: Kali Yuga"
                  - generic [ref=e674]: We are in the 4th and final Yuga of the current Mahayuga cycle. Kali Yuga began 3102 BCE (Feb 18) and spans 432,000 years. We are approximately 5,126 years in — only 1.2% complete.
                - generic [ref=e675]:
                  - generic [ref=e676]: Kali Yuga Progress
                  - generic [ref=e679]:
                    - generic [ref=e680]: 3102 BCE
                    - generic [ref=e681]: ~1.2%
                    - generic [ref=e682]: +426,874 yrs
              - generic [ref=e683]:
                - generic [ref=e684]: Mahayuga Timeline (4,320,000 years)
                - generic [ref=e685]:
                  - generic [ref=e686]:
                    - generic [ref=e687]: Satya Yuga
                    - generic [ref=e688]: 1,728,000y
                    - generic [ref=e689]: 40% of Mahayuga
                  - generic [ref=e690]:
                    - generic [ref=e691]: Treta Yuga
                    - generic [ref=e692]: 1,296,000y
                    - generic [ref=e693]: 30% of Mahayuga
                  - generic [ref=e694]:
                    - generic [ref=e695]: Dvapara Yuga
                    - generic [ref=e696]: 864,000y
                    - generic [ref=e697]: 20% of Mahayuga
                  - generic [ref=e698]:
                    - generic [ref=e699]: Kali Yuga
                    - generic [ref=e700]: 432,000y
                    - generic [ref=e701]: 10% of Mahayuga
                - generic [ref=e702]: Kalpa = 1,000 Mahayugas = 4.32 billion years (one Day of Brahma)
        - generic [ref=e705]: ✻
        - generic [ref=e707]:
          - heading "Choghadiya" [level=2] [ref=e708]
          - paragraph [ref=e709]: Eight-fold day/night muhurat system for timing activities
          - generic [ref=e710]:
            - generic [ref=e711]:
              - generic [ref=e712]:
                - img [ref=e713]
                - heading "Day Choghadiya" [level=3] [ref=e719]
              - generic [ref=e720]:
                - generic [ref=e721]:
                  - generic [ref=e724]: Kaal
                  - generic [ref=e725]: 07:59 — 09:29
                - generic [ref=e726]:
                  - generic [ref=e729]: Shubh
                  - generic [ref=e730]: 09:29 — 11:00
                - generic [ref=e731]:
                  - generic [ref=e734]: Rog
                  - generic [ref=e735]: 11:00 — 12:31
                - generic [ref=e736]:
                  - generic [ref=e739]: Udveg
                  - generic [ref=e740]: 12:31 — 14:02
                - generic [ref=e741]:
                  - generic [ref=e744]: Char
                  - generic [ref=e745]: 14:02 — 15:33
                - generic [ref=e746]:
                  - generic [ref=e749]: Labh
                  - generic [ref=e750]: 15:33 — 17:04
                - generic [ref=e751]:
                  - generic [ref=e754]: Amrit
                  - generic [ref=e755]: 17:04 — 18:34
                - generic [ref=e756]:
                  - generic [ref=e759]: Kaal
                  - generic [ref=e760]: 18:34 — 20:05
            - generic [ref=e761]:
              - generic [ref=e762]:
                - img [ref=e763]
                - heading "Night Choghadiya" [level=3] [ref=e765]
              - generic [ref=e766]:
                - generic [ref=e767]:
                  - generic [ref=e770]: Char
                  - generic [ref=e771]: 20:05 — 21:34
                - generic [ref=e772]:
                  - generic [ref=e775]: Labh
                  - generic [ref=e776]: 21:34 — 23:04
                - generic [ref=e777]:
                  - generic [ref=e780]: Amrit
                  - generic [ref=e781]: 23:04 — 00:33
                - generic [ref=e782]:
                  - generic [ref=e785]: Kaal
                  - generic [ref=e786]: 00:33 — 02:02
                - generic [ref=e787]:
                  - generic [ref=e790]: Shubh
                  - generic [ref=e791]: 02:02 — 03:31
                - generic [ref=e792]:
                  - generic [ref=e795]: Rog
                  - generic [ref=e796]: 03:31 — 05:00
                - generic [ref=e797]:
                  - generic [ref=e800]: Udveg
                  - generic [ref=e801]: 05:00 — 06:29
                - generic [ref=e802]:
                  - generic [ref=e805]: Char
                  - generic [ref=e806]: 06:29 — 07:59
        - generic [ref=e809]: ✻
        - generic [ref=e811]:
          - heading "Hora" [level=2] [ref=e812]
          - paragraph [ref=e813]: Planetary hours — each hour ruled by a planet
          - generic [ref=e814]:
            - generic [ref=e815]:
              - img [ref=e817]
              - generic [ref=e823]: Moon
              - generic [ref=e824]: 07:59—08:59
            - generic [ref=e825]:
              - img [ref=e827]
              - generic [ref=e833]: Saturn
              - generic [ref=e834]: 08:59—10:00
            - generic [ref=e835]:
              - img [ref=e837]
              - generic [ref=e843]: Jupiter
              - generic [ref=e844]: 10:00—11:00
            - generic [ref=e845]:
              - img [ref=e847]
              - generic [ref=e851]: Mars
              - generic [ref=e852]: 11:00—12:01
            - generic [ref=e853]:
              - img [ref=e855]
              - generic [ref=e866]: Sun
              - generic [ref=e867]: 12:01—13:01
            - generic [ref=e868]:
              - img [ref=e870]
              - generic [ref=e873]: Venus
              - generic [ref=e874]: 13:01—14:02
            - generic [ref=e875]:
              - img [ref=e877]
              - generic [ref=e881]: Mercury
              - generic [ref=e882]: 14:02—15:02
            - generic [ref=e883]:
              - img [ref=e885]
              - generic [ref=e891]: Moon
              - generic [ref=e892]: 15:02—16:03
            - generic [ref=e893]:
              - img [ref=e895]
              - generic [ref=e901]: Saturn
              - generic [ref=e902]: 16:03—17:04
            - generic [ref=e903]:
              - img [ref=e905]
              - generic [ref=e911]: Jupiter
              - generic [ref=e912]: 17:04—18:04
            - generic [ref=e913]:
              - img [ref=e915]
              - generic [ref=e919]: Mars
              - generic [ref=e920]: 18:04—19:05
            - generic [ref=e921]:
              - img [ref=e923]
              - generic [ref=e934]: Sun
              - generic [ref=e935]: 19:05—20:05
            - generic [ref=e936]:
              - img [ref=e938]
              - generic [ref=e941]: Venus
              - generic [ref=e942]: 20:05—21:05
            - generic [ref=e943]:
              - img [ref=e945]
              - generic [ref=e949]: Mercury
              - generic [ref=e950]: 21:05—22:04
            - generic [ref=e951]:
              - img [ref=e953]
              - generic [ref=e959]: Moon
              - generic [ref=e960]: 22:04—23:04
            - generic [ref=e961]:
              - img [ref=e963]
              - generic [ref=e969]: Saturn
              - generic [ref=e970]: 23:04—00:03
            - generic [ref=e971]:
              - img [ref=e973]
              - generic [ref=e979]: Jupiter
              - generic [ref=e980]: 00:03—01:02
            - generic [ref=e981]:
              - img [ref=e983]
              - generic [ref=e987]: Mars
              - generic [ref=e988]: 01:02—02:02
            - generic [ref=e989]:
              - img [ref=e991]
              - generic [ref=e1002]: Sun
              - generic [ref=e1003]: 02:02—03:01
            - generic [ref=e1004]:
              - img [ref=e1006]
              - generic [ref=e1009]: Venus
              - generic [ref=e1010]: 03:01—04:01
            - generic [ref=e1011]:
              - img [ref=e1013]
              - generic [ref=e1017]: Mercury
              - generic [ref=e1018]: 04:01—05:00
            - generic [ref=e1019]:
              - img [ref=e1021]
              - generic [ref=e1027]: Moon
              - generic [ref=e1028]: 05:00—06:00
            - generic [ref=e1029]:
              - img [ref=e1031]
              - generic [ref=e1037]: Saturn
              - generic [ref=e1038]: 06:00—06:59
            - generic [ref=e1039]:
              - img [ref=e1041]
              - generic [ref=e1047]: Jupiter
              - generic [ref=e1048]: 06:59—07:59
        - generic [ref=e1051]: ✻
        - generic [ref=e1053]:
          - heading "Today's Muhurtas" [level=2] [ref=e1054]
          - paragraph [ref=e1055]: The day is divided into 30 Muhurtas (~48 min each). Each is presided by a deity and carries specific energy. Click any muhurta to see its significance and best uses.
          - generic [ref=e1056]:
            - generic [ref=e1057]:
              - img [ref=e1058]
              - heading "Daytime Muhurtas" [level=3] [ref=e1064]
              - generic [ref=e1065]: (07:59 — 20:05)
            - generic [ref=e1066]:
              - generic [ref=e1067]:
                - generic [ref=e1068]:
                  - generic [ref=e1069]:
                    - generic [ref=e1070]: "1"
                    - generic [ref=e1071]: RudraRudra (Shiva)
                  - generic [ref=e1072]:
                    - generic [ref=e1073]: 07:59 — 08:47
                    - generic [ref=e1074]: Inauspicious
                - generic [ref=e1075]:
                  - paragraph [ref=e1076]: Named after Rudra, the fierce form of Shiva. This first muhurta at sunrise carries destructive energy — not suitable for new beginnings.
                  - paragraph [ref=e1077]: "Best for: Worship of Shiva, fire rituals (Homa), protective rites"
              - generic [ref=e1078]:
                - generic [ref=e1079]:
                  - generic [ref=e1080]:
                    - generic [ref=e1081]: "2"
                    - generic [ref=e1082]: AhiAhi (Serpent)
                  - generic [ref=e1083]:
                    - generic [ref=e1084]: 08:47 — 09:35
                    - generic [ref=e1085]: Inauspicious
                - generic [ref=e1086]:
                  - paragraph [ref=e1087]: Ruled by the serpent deity — unstable, transformative energy. Activities begun here may face hidden obstacles.
                  - paragraph [ref=e1088]: "Best for: Medicine preparation, snake-related remedies, Rahu puja"
              - generic [ref=e1089]:
                - generic [ref=e1090]:
                  - generic [ref=e1091]:
                    - generic [ref=e1092]: "3"
                    - generic [ref=e1093]: MitraMitra (Friend)
                  - generic [ref=e1094]:
                    - generic [ref=e1095]: 09:35 — 10:24
                    - generic [ref=e1096]: Auspicious
                - generic [ref=e1097]:
                  - paragraph [ref=e1098]: Mitra represents friendship, alliances, and harmony. Excellent for forming partnerships and social activities.
                  - paragraph [ref=e1099]: "Best for: Friendships, alliances, contracts, social gatherings"
              - generic [ref=e1100]:
                - generic [ref=e1101]:
                  - generic [ref=e1102]:
                    - generic [ref=e1103]: "4"
                    - generic [ref=e1104]: PitruPitru (Ancestors)
                  - generic [ref=e1105]:
                    - generic [ref=e1106]: 10:24 — 11:12
                    - generic [ref=e1107]: Inauspicious
                - generic [ref=e1108]:
                  - paragraph [ref=e1109]: Dedicated to ancestral spirits. Not for material activities — but ideal for remembering and honoring the departed.
                  - paragraph [ref=e1110]: "Best for: Shraddha, Tarpan, ancestral rites, charity for deceased"
              - generic [ref=e1111]:
                - generic [ref=e1112]:
                  - generic [ref=e1113]:
                    - generic [ref=e1114]: "5"
                    - generic [ref=e1115]: VasuVasu (Wealth)
                  - generic [ref=e1116]:
                    - generic [ref=e1117]: 11:12 — 12:01
                    - generic [ref=e1118]: Auspicious
                - generic [ref=e1119]:
                  - paragraph [ref=e1120]: The Vasus are Vedic deities of wealth and natural elements. This muhurta brings material prosperity and stability.
                  - paragraph [ref=e1121]: "Best for: Financial dealings, construction, buying property, agriculture"
              - generic [ref=e1122]:
                - generic [ref=e1123]:
                  - generic [ref=e1124]:
                    - generic [ref=e1125]: "6"
                    - generic [ref=e1126]: VaraVaraha (Boar Avatar)
                  - generic [ref=e1127]:
                    - generic [ref=e1128]: 12:01 — 12:49
                    - generic [ref=e1129]: Auspicious
                - generic [ref=e1130]:
                  - paragraph [ref=e1131]: Named after Vishnu's boar incarnation who rescued the Earth. Represents protection, rescue, and recovery.
                  - paragraph [ref=e1132]: "Best for: Starting journeys, rescue missions, earth-related work, Vishnu puja"
              - generic [ref=e1133]:
                - generic [ref=e1134]:
                  - generic [ref=e1135]:
                    - generic [ref=e1136]: "7"
                    - generic [ref=e1137]: VishvedevaVishvedevas (All Gods)
                  - generic [ref=e1138]:
                    - generic [ref=e1139]: 12:49 — 13:38
                    - generic [ref=e1140]: Auspicious
                - generic [ref=e1141]:
                  - paragraph [ref=e1142]: Collectively ruled by all the Devas — universally auspicious. One of the most favorable muhurtas for any activity.
                  - paragraph [ref=e1143]: "Best for: All auspicious activities, ceremonies, education, marriages"
              - generic [ref=e1144]:
                - generic [ref=e1145]:
                  - generic [ref=e1146]:
                    - generic [ref=e1147]: "8"
                    - generic [ref=e1148]: VidhiAbhijitVidhi (Brahma)
                  - generic [ref=e1149]:
                    - generic [ref=e1150]: 13:38 — 14:26
                    - generic [ref=e1151]: Auspicious
                - generic [ref=e1152]:
                  - paragraph [ref=e1153]: Presided by Brahma the Creator. This is the ABHIJIT MUHURTA — the most auspicious muhurta of the day, around midday. Victory is assured in activities begun here.
                  - paragraph [ref=e1154]: "Best for: ALL ACTIVITIES — especially important decisions, marriages, housewarming, coronations, beginning studies"
              - generic [ref=e1155]:
                - generic [ref=e1156]:
                  - generic [ref=e1157]:
                    - generic [ref=e1158]: "9"
                    - generic [ref=e1159]: SatamukhiSatamukhi (Hundred-faced)
                  - generic [ref=e1160]:
                    - generic [ref=e1161]: 14:26 — 15:15
                    - generic [ref=e1162]: Auspicious
                - generic [ref=e1163]:
                  - paragraph [ref=e1164]: The hundred-faced one — represents versatility and multi-faceted success. Good for diverse activities.
                  - paragraph [ref=e1165]: "Best for: Trade, commerce, multi-tasking, travel, communication"
              - generic [ref=e1166]:
                - generic [ref=e1167]:
                  - generic [ref=e1168]:
                    - generic [ref=e1169]: "10"
                    - generic [ref=e1170]: PuruhutaIndra (King of Gods)
                  - generic [ref=e1171]:
                    - generic [ref=e1172]: 15:15 — 16:03
                    - generic [ref=e1173]: Auspicious
                - generic [ref=e1174]:
                  - paragraph [ref=e1175]: Ruled by Indra, king of the Devas. Brings authority, leadership power, and victory over adversaries.
                  - paragraph [ref=e1176]: "Best for: Government work, leadership roles, legal matters, competition"
              - generic [ref=e1177]:
                - generic [ref=e1178]:
                  - generic [ref=e1179]:
                    - generic [ref=e1180]: "11"
                    - generic [ref=e1181]: VahiniVahini (Fire Stream)
                  - generic [ref=e1182]:
                    - generic [ref=e1183]: 16:03 — 16:51
                    - generic [ref=e1184]: Inauspicious
                - generic [ref=e1185]:
                  - paragraph [ref=e1186]: Carries the energy of flowing fire — destructive and consuming. Activities may dissipate or burn out quickly.
                  - paragraph [ref=e1187]: "Best for: Fire-related work, metallurgy, demolition, destroying obstacles"
              - generic [ref=e1188]:
                - generic [ref=e1189]:
                  - generic [ref=e1190]:
                    - generic [ref=e1191]: "12"
                    - generic [ref=e1192]: NaktanakaraMoon (Night-maker)
                  - generic [ref=e1193]:
                    - generic [ref=e1194]: 16:51 — 17:40
                    - generic [ref=e1195]: Inauspicious
                - generic [ref=e1196]:
                  - paragraph [ref=e1197]: The "night-maker" — brings darkness into daytime activities. Mental confusion and poor judgment may prevail.
                  - paragraph [ref=e1198]: "Best for: Rest, meditation, introspection, lunar rituals"
              - generic [ref=e1199]:
                - generic [ref=e1200]:
                  - generic [ref=e1201]:
                    - generic [ref=e1202]: "13"
                    - generic [ref=e1203]: VarunaVaruna (Lord of Waters)
                  - generic [ref=e1204]:
                    - generic [ref=e1205]: 17:40 — 18:28
                    - generic [ref=e1206]: Auspicious
                - generic [ref=e1207]:
                  - paragraph [ref=e1208]: Presided by Varuna, lord of cosmic order and waters. Excellent for righteous acts, truth-telling, and water-related work.
                  - paragraph [ref=e1209]: "Best for: Water rituals, bathing ceremonies, oaths, truth-related matters"
              - generic [ref=e1210]:
                - generic [ref=e1211]:
                  - generic [ref=e1212]:
                    - generic [ref=e1213]: "14"
                    - generic [ref=e1214]: AryamanAryaman (Hospitality)
                  - generic [ref=e1215]:
                    - generic [ref=e1216]: 18:28 — 19:17
                    - generic [ref=e1217]: Auspicious
                - generic [ref=e1218]:
                  - paragraph [ref=e1219]: Aryaman presides over customs, marriages, and hospitality. Extremely favorable for weddings and social bonds.
                  - paragraph [ref=e1220]: "Best for: Marriages, engagements, hospitality, cultural ceremonies, naming"
              - generic [ref=e1221]:
                - generic [ref=e1222]:
                  - generic [ref=e1223]:
                    - generic [ref=e1224]: "15"
                    - generic [ref=e1225]: BhagaBhaga (Fortune)
                  - generic [ref=e1226]:
                    - generic [ref=e1227]: 19:17 — 20:05
                    - generic [ref=e1228]: Auspicious
                - generic [ref=e1229]:
                  - paragraph [ref=e1230]: Bhaga distributes wealth and fortune. The last daytime muhurta — represents the culmination of the day's blessings.
                  - paragraph [ref=e1231]: "Best for: Receiving wealth, inheritance matters, evening prayers, gratitude"
          - button "Nighttime Muhurtas (20:05 — next sunrise)" [ref=e1233]:
            - img [ref=e1234]
            - heading "Nighttime Muhurtas" [level=3] [ref=e1236]
            - generic [ref=e1237]: (20:05 — next sunrise)
            - img [ref=e1238]
        - generic [ref=e1242]: ✻
        - generic [ref=e1244]:
          - generic [ref=e1245]:
            - img [ref=e1247]
            - generic [ref=e1255]: Sun Sign
            - generic [ref=e1256]: Pisces
            - generic [ref=e1257]: Revati
          - generic [ref=e1258]:
            - img [ref=e1260]
            - generic [ref=e1265]: Moon Sign
            - generic [ref=e1266]: Scorpio
            - generic [ref=e1267]: Anuradha · Pada 2
          - generic [ref=e1268]:
            - img [ref=e1270]
            - generic [ref=e1276]: Day Duration
            - generic [ref=e1277]: 12:07
            - generic [ref=e1278]: "Night: 11:53"
          - generic [ref=e1279]:
            - img [ref=e1281]
            - generic [ref=e1284]: Madhyahna
            - generic [ref=e1285]: 14:02
            - generic [ref=e1286]: Local Midday
        - generic [ref=e1287]:
          - heading "Udaya Lagna — Rising Signs" [level=3] [ref=e1288]:
            - img [ref=e1289]
            - generic [ref=e1291]: Udaya Lagna — Rising Signs
          - paragraph [ref=e1292]: The zodiac sign rising on the eastern horizon changes approximately every 2 hours. Each rising window carries the energy of that sign for muhurta selection.
          - generic [ref=e1294]:
            - generic [ref=e1295]:
              - img [ref=e1297]
              - generic [ref=e1302]: Virgo
              - generic [ref=e1303]: 07:59 – 08:39
            - generic [ref=e1304]:
              - img [ref=e1306]
              - generic [ref=e1310]: Libra
              - generic [ref=e1311]: 08:39 – 10:29
            - generic [ref=e1312]:
              - img [ref=e1314]
              - generic [ref=e1319]: Scorpio
              - generic [ref=e1320]: 10:29 – 12:39
            - generic [ref=e1321]:
              - img [ref=e1323]
              - generic [ref=e1328]: Sagittarius
              - generic [ref=e1329]: 12:39 – 14:49
            - generic [ref=e1330]:
              - img [ref=e1332]
              - generic [ref=e1337]: Capricorn
              - generic [ref=e1338]: 14:49 – 16:49
            - generic [ref=e1339]:
              - img [ref=e1341]
              - generic [ref=e1347]: Aquarius
              - generic [ref=e1348]: 16:49 – 18:39
            - generic [ref=e1349]:
              - img [ref=e1351]
              - generic [ref=e1359]: Pisces
              - generic [ref=e1360]: 18:39 – 20:39
            - generic [ref=e1361]:
              - img [ref=e1363]
              - generic [ref=e1367]: Aries
              - generic [ref=e1368]: 20:39 – 22:29
            - generic [ref=e1369]:
              - img [ref=e1371]
              - generic [ref=e1379]: Taurus
              - generic [ref=e1380]: 22:29 – 00:39
            - generic [ref=e1381]:
              - img [ref=e1383]
              - generic [ref=e1388]: Gemini
              - generic [ref=e1389]: 00:39 – 02:49
            - generic [ref=e1390]:
              - img [ref=e1392]
              - generic [ref=e1397]: Cancer
              - generic [ref=e1398]: 02:49 – 04:49
            - generic [ref=e1399]:
              - img [ref=e1401]
              - generic [ref=e1408]: Leo
              - generic [ref=e1409]: 04:49 – 06:39
            - generic [ref=e1410]:
              - img [ref=e1412]
              - generic [ref=e1417]: Virgo
              - generic [ref=e1418]: 06:39 – 07:59
        - generic [ref=e1421]: ✻
        - generic [ref=e1423]:
          - heading "Chandrabalam & Tarabalam" [level=2] [ref=e1424]
          - paragraph [ref=e1425]: Select your birth Nakshatra and Rashi, or generate a Kundali first to auto-detect.
          - generic [ref=e1427]:
            - generic [ref=e1428]:
              - generic [ref=e1429]: Birth Nakshatra
              - combobox [ref=e1430]:
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
            - generic [ref=e1431]:
              - generic [ref=e1432]: Birth Rashi (Moon)
              - combobox [ref=e1433]:
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
        - generic [ref=e1436]: ✻
        - generic [ref=e1440]: ✻
        - generic [ref=e1442]:
          - heading "Planetary Positions (Navagraha)" [level=2] [ref=e1443]
          - table [ref=e1446]:
            - rowgroup [ref=e1447]:
              - row "Planet Sign Longitude Nakshatra Retrograde" [ref=e1448]:
                - columnheader "Planet" [ref=e1449]
                - columnheader "Sign" [ref=e1450]
                - columnheader "Longitude" [ref=e1451]
                - columnheader "Nakshatra" [ref=e1452]
                - columnheader "Retrograde" [ref=e1453]
            - rowgroup [ref=e1454]:
              - row "Sun Pisces 352.22° Revati —" [ref=e1455]:
                - cell "Sun" [ref=e1456]:
                  - generic [ref=e1457]:
                    - img [ref=e1458]
                    - generic [ref=e1469]: Sun
                - cell "Pisces" [ref=e1470]:
                  - generic [ref=e1471]:
                    - img [ref=e1472]
                    - generic [ref=e1480]: Pisces
                - cell "352.22°" [ref=e1481]
                - cell "Revati" [ref=e1482]
                - cell "—" [ref=e1483]
              - row "Moon Scorpio 218.99° Anuradha —" [ref=e1484]:
                - cell "Moon" [ref=e1485]:
                  - generic [ref=e1486]:
                    - img [ref=e1487]
                    - generic [ref=e1493]: Moon
                - cell "Scorpio" [ref=e1494]:
                  - generic [ref=e1495]:
                    - img [ref=e1496]
                    - generic [ref=e1501]: Scorpio
                - cell "218.99°" [ref=e1502]
                - cell "Anuradha" [ref=e1503]
                - cell "—" [ref=e1504]
              - row "Mars Pisces 333.00° Purva Bhadrapada —" [ref=e1505]:
                - cell "Mars" [ref=e1506]:
                  - generic [ref=e1507]:
                    - img [ref=e1508]
                    - generic [ref=e1512]: Mars
                - cell "Pisces" [ref=e1513]:
                  - generic [ref=e1514]:
                    - img [ref=e1515]
                    - generic [ref=e1523]: Pisces
                - cell "333.00°" [ref=e1524]
                - cell "Purva Bhadrapada" [ref=e1525]
                - cell "—" [ref=e1526]
              - row "Mercury Aquarius 324.59° Purva Bhadrapada —" [ref=e1527]:
                - cell "Mercury" [ref=e1528]:
                  - generic [ref=e1529]:
                    - img [ref=e1530]
                    - generic [ref=e1534]: Mercury
                - cell "Aquarius" [ref=e1535]:
                  - generic [ref=e1536]:
                    - img [ref=e1537]
                    - generic [ref=e1543]: Aquarius
                - cell "324.59°" [ref=e1544]
                - cell "Purva Bhadrapada" [ref=e1545]
                - cell "—" [ref=e1546]
              - row "Jupiter Gemini 81.94° Punarvasu —" [ref=e1547]:
                - cell "Jupiter" [ref=e1548]:
                  - generic [ref=e1549]:
                    - img [ref=e1550]
                    - generic [ref=e1556]: Jupiter
                - cell "Gemini" [ref=e1557]:
                  - generic [ref=e1558]:
                    - img [ref=e1559]
                    - generic [ref=e1564]: Gemini
                - cell "81.94°" [ref=e1565]
                - cell "Punarvasu" [ref=e1566]
                - cell "—" [ref=e1567]
              - row "Venus Aries 13.87° Bharani —" [ref=e1568]:
                - cell "Venus" [ref=e1569]:
                  - generic [ref=e1570]:
                    - img [ref=e1571]
                    - generic [ref=e1574]: Venus
                - cell "Aries" [ref=e1575]:
                  - generic [ref=e1576]:
                    - img [ref=e1577]
                    - generic [ref=e1581]: Aries
                - cell "13.87°" [ref=e1582]
                - cell "Bharani" [ref=e1583]
                - cell "—" [ref=e1584]
              - row "Saturn Pisces 341.97° Uttara Bhadrapada —" [ref=e1585]:
                - cell "Saturn" [ref=e1586]:
                  - generic [ref=e1587]:
                    - img [ref=e1588]
                    - generic [ref=e1594]: Saturn
                - cell "Pisces" [ref=e1595]:
                  - generic [ref=e1596]:
                    - img [ref=e1597]
                    - generic [ref=e1605]: Pisces
                - cell "341.97°" [ref=e1606]
                - cell "Uttara Bhadrapada" [ref=e1607]
                - cell "—" [ref=e1608]
              - row "Rahu Aquarius 312.90° Shatabhisha R" [ref=e1609]:
                - cell "Rahu" [ref=e1610]:
                  - generic [ref=e1611]:
                    - img [ref=e1612]
                    - generic [ref=e1622]: Rahu
                - cell "Aquarius" [ref=e1623]:
                  - generic [ref=e1624]:
                    - img [ref=e1625]
                    - generic [ref=e1631]: Aquarius
                - cell "312.90°" [ref=e1632]
                - cell "Shatabhisha" [ref=e1633]
                - cell "R" [ref=e1634]
              - row "Ketu Leo 132.90° Magha R" [ref=e1635]:
                - cell "Ketu" [ref=e1636]:
                  - generic [ref=e1637]:
                    - img [ref=e1638]
                    - generic [ref=e1644]: Ketu
                - cell "Leo" [ref=e1645]:
                  - generic [ref=e1646]:
                    - img [ref=e1647]
                    - generic [ref=e1654]: Leo
                - cell "132.90°" [ref=e1655]
                - cell "Magha" [ref=e1656]
                - cell "R" [ref=e1657]
        - generic [ref=e1660]: ✻
      - generic [ref=e1662]:
        - heading "Explore the Elements" [level=2] [ref=e1663]
        - generic [ref=e1664]:
          - link "Tithi" [ref=e1666] [cursor=pointer]:
            - /url: /en/panchang/tithi
            - img [ref=e1668]
            - generic [ref=e1674]: Tithi
          - link "Nakshatra" [ref=e1676] [cursor=pointer]:
            - /url: /en/panchang/nakshatra
            - img [ref=e1678]
            - generic [ref=e1683]: Nakshatra
          - link "Yoga" [ref=e1685] [cursor=pointer]:
            - /url: /en/panchang/yoga
            - img [ref=e1687]
            - generic [ref=e1692]: Yoga
          - link "Karana" [ref=e1694] [cursor=pointer]:
            - /url: /en/panchang/karana
            - img [ref=e1696]
            - generic [ref=e1702]: Karana
          - link "Muhurta" [ref=e1704] [cursor=pointer]:
            - /url: /en/panchang/muhurta
            - img [ref=e1706]
            - generic [ref=e1713]: Muhurta
          - link "Grahan" [ref=e1715] [cursor=pointer]:
            - /url: /en/panchang/grahan
            - img [ref=e1717]
            - generic [ref=e1734]: Grahan
          - link "Rashi" [ref=e1736] [cursor=pointer]:
            - /url: /en/panchang/rashi
            - img [ref=e1738]
            - generic [ref=e1750]: Rashi
          - link "Masa" [ref=e1752] [cursor=pointer]:
            - /url: /en/panchang/masa
            - img [ref=e1754]
            - generic [ref=e1760]: Masa
          - link "Samvatsara" [ref=e1762] [cursor=pointer]:
            - /url: /en/panchang/samvatsara
            - img [ref=e1764]:
              - generic [ref=e1777]: "60"
            - generic [ref=e1778]: Samvatsara
  - contentinfo [ref=e1779]:
    - generic [ref=e1781]:
      - generic [ref=e1782]:
        - generic [ref=e1783]: Dekho Panchang
        - generic [ref=e1784]: © 2026
      - generic [ref=e1785]:
        - link "Panchang" [ref=e1786] [cursor=pointer]:
          - /url: /en/panchang
        - link "Kundali" [ref=e1787] [cursor=pointer]:
          - /url: /en/kundali
        - link "Calendar" [ref=e1788] [cursor=pointer]:
          - /url: /en/calendar
        - link "Learn" [ref=e1789] [cursor=pointer]:
          - /url: /en/learn
        - link "About" [ref=e1790] [cursor=pointer]:
          - /url: /en/about
        - link "Pricing" [ref=e1791] [cursor=pointer]:
          - /url: /en/pricing
      - paragraph [ref=e1792]: ॐ ज्योतिषां ज्योतिः
  - generic [ref=e1797] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e1798]:
      - img [ref=e1799]
    - generic [ref=e1802]:
      - button "Open issues overlay" [ref=e1803]:
        - generic [ref=e1804]:
          - generic [ref=e1805]: "0"
          - generic [ref=e1806]: "1"
        - generic [ref=e1807]: Issue
      - button "Collapse issues badge" [ref=e1808]:
        - img [ref=e1809]
  - alert [ref=e1811]
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
> 57  |     await expect(page.locator('text=/Ashwini|Bharani|Krittika|Rohini|Mrigashira|Ardra|Punarvasu|Pushya|Ashlesha|Magha|Purva Phalguni|Uttara Phalguni|Hasta|Chitra|Swati|Vishakha|Anuradha|Jyeshtha|Mula|Purva Ashadha|Uttara Ashadha|Shravana|Dhanishta|Shatabhisha|Purva Bhadrapada|Uttara Bhadrapada|Revati/')).toBeVisible({ timeout: 15000 });
      |                                                                                                                                                                                                                                                                                                                   ^ Error: expect(locator).toBeVisible() failed
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
```