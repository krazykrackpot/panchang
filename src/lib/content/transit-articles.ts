/**
 * Transit article content — editorial-style articles published ahead of major transits.
 * Each article covers the transit's significance + effects on all 12 Moon signs.
 *
 * Content is pre-written and committed. No runtime API calls.
 * Add new articles by inserting entries into TRANSIT_ARTICLES.
 */

export interface MoonSignEffect {
  rashiId: number;
  house: number;
  headline: string;
  body: string;
  dosAndDonts: string[];
  remedy: string;
}

export interface KeyDate {
  date: string;
  event: string;
  significance: string;
}

export interface TransitArticle {
  slug: string;
  planetId: number;
  fromSignId: number;
  toSignId: number;
  year: number;
  exactDate: string;
  endDate: string;
  duration: string;
  title: { en: string; hi: string };
  metaDescription: { en: string; hi: string };
  overview: { en: string; hi: string };
  generalThemes: { en: string; hi: string }[];
  moonSignEffects: MoonSignEffect[];
  keyDates: KeyDate[];
  retrogradeNote?: string;
  publishDate: string;
}

// ─── Articles ───

export const TRANSIT_ARTICLES: Record<string, TransitArticle> = {
  'jupiter-in-cancer-2026': {
    slug: 'jupiter-in-cancer-2026',
    planetId: 4,
    fromSignId: 2,
    toSignId: 4,
    year: 2026,
    exactDate: '2026-06-02',
    endDate: '2026-11-01',
    duration: '~5 months (June 2 – November 1, 2026)',
    publishDate: '2026-04-29',
    title: {
      en: 'Jupiter in Cancer 2026: Effects on All 12 Moon Signs',
      hi: 'गुरु कर्क राशि में 2026: सभी 12 चन्द्र राशियों पर प्रभाव',
    },
    metaDescription: {
      en: 'Jupiter enters Cancer on June 2, 2026 — its sign of exaltation. Discover how this rare, powerful transit affects your Moon sign for the next 5 months.',
      hi: 'गुरु 2 जून 2026 को कर्क राशि में प्रवेश करेगा — अपनी उच्च राशि में। जानें कि यह दुर्लभ गोचर आपकी चन्द्र राशि को कैसे प्रभावित करेगा।',
    },
    overview: {
      en: `Jupiter's transit into Cancer on June 2, 2026 is arguably the most auspicious planetary movement of the year. Cancer is Jupiter's sign of exaltation — the one place in the zodiac where the great benefic operates at peak strength. The last time Jupiter occupied Cancer was June–July 2014, and before that, 2002. This is a once-in-twelve-years window that classical texts describe as a period when dharma, compassion, and material prosperity all find fertile ground.

What makes this transit exceptional is the nature of both planet and sign. Jupiter represents wisdom, expansion, generosity, children, and spiritual growth. Cancer is the sign of nurturing, emotional depth, home, mother, and inner security. When Jupiter exalts here, the combination produces a rare alignment between material abundance and emotional fulfillment — the kind of period where a promotion doesn't just bring money but genuine satisfaction, where family relationships deepen rather than merely persist.

Parashara's Brihat Hora Shastra places special emphasis on Jupiter's dignity. An exalted Jupiter in transit blesses the house it occupies from your Moon sign with protection, growth, and opportunity. But this isn't passive luck — Jupiter rewards those who act with integrity, pursue learning, and serve others. The lazy and the dishonest find that even an exalted Jupiter passes them by.

The transit runs from June 2 to November 1, 2026 — approximately five months. Jupiter will station retrograde around mid-August, turning direct in early October. The retrograde period is not malefic; rather, it's a time for consolidating gains, revisiting decisions, and deepening understanding. The most potent windows for initiating new ventures are the first six weeks (June 2–mid July) and the final three weeks after Jupiter turns direct (early–late October).`,
      hi: `2 जून 2026 को गुरु का कर्क राशि में गोचर इस वर्ष का सबसे शुभ ग्रह-संचार है। कर्क राशि गुरु की उच्च राशि है — राशिचक्र का वह एकमात्र स्थान जहाँ यह महान शुभ ग्रह अपनी पूर्ण शक्ति से कार्य करता है। पिछली बार गुरु कर्क में जून-जुलाई 2014 में था, और उससे पहले 2002 में। यह बारह वर्षों में एक बार आने वाला अवसर है जिसे शास्त्रीय ग्रन्थ धर्म, करुणा और भौतिक समृद्धि के उर्वर काल के रूप में वर्णित करते हैं।

इस गोचर को विशेष बनाने वाली बात ग्रह और राशि दोनों की प्रकृति है। गुरु ज्ञान, विस्तार, उदारता, सन्तान और आध्यात्मिक विकास का प्रतिनिधित्व करता है। कर्क पालन-पोषण, भावनात्मक गहराई, गृह, माता और आन्तरिक सुरक्षा की राशि है। जब गुरु यहाँ उच्च होता है, तो यह संयोजन भौतिक प्रचुरता और भावनात्मक पूर्णता के बीच एक दुर्लभ सामंजस्य उत्पन्न करता है।

पराशर के बृहत् होरा शास्त्र में गुरु की गरिमा पर विशेष बल दिया गया है। गोचर में उच्च का गुरु आपकी चन्द्र राशि से जिस भाव में बैठता है, उसे सुरक्षा, विकास और अवसर से आशीर्वादित करता है। परन्तु यह निष्क्रिय भाग्य नहीं है — गुरु उन्हें पुरस्कृत करता है जो सत्यनिष्ठा से कार्य करते हैं, ज्ञान का अनुसरण करते हैं और सेवा करते हैं।

यह गोचर 2 जून से 1 नवम्बर 2026 तक — लगभग पाँच माह तक रहेगा। गुरु मध्य अगस्त के आसपास वक्री होगा और अक्तूबर की शुरुआत में मार्गी। वक्री काल अशुभ नहीं है; बल्कि यह लाभ को सुदृढ़ करने, निर्णयों पर पुनर्विचार करने और समझ को गहरा करने का समय है।`,
    },
    generalThemes: [
      { en: 'Family expansion — marriages, births, reunions, and deepening of bonds with parents and siblings', hi: 'परिवार का विस्तार — विवाह, जन्म, पुनर्मिलन, और माता-पिता व भाई-बहनों से बन्धन का गहरा होना' },
      { en: 'Property and real estate — buying a home, renovating, or securing ancestral property becomes favored', hi: 'सम्पत्ति और भूमि — घर खरीदना, नवीनीकरण, या पैतृक सम्पत्ति को सुरक्षित करना अनुकूल हो जाता है' },
      { en: 'Emotional healing — old wounds surface to be resolved; therapy, counseling, and inner work bear fruit', hi: 'भावनात्मक उपचार — पुराने घाव समाधान के लिए सामने आते हैं; चिकित्सा और आन्तरिक कार्य फलदायी होता है' },
      { en: 'Education and wisdom — higher learning, spiritual study, and teaching roles are amplified', hi: 'शिक्षा और ज्ञान — उच्च शिक्षा, आध्यात्मिक अध्ययन, और शिक्षण भूमिकाएँ प्रवर्धित होती हैं' },
      { en: 'Water-related gains — coastal property, maritime trade, travel over water, and water-sign professions benefit', hi: 'जल-सम्बन्धी लाभ — तटीय सम्पत्ति, समुद्री व्यापार, जल यात्रा, और जल-राशि व्यवसायों को लाभ' },
      { en: 'Charitable instincts strengthen — donations, seva, and community service feel natural and are well-received', hi: 'दानशीलता प्रबल होती है — दान, सेवा, और सामुदायिक कार्य स्वाभाविक लगते हैं और सराहे जाते हैं' },
    ],
    moonSignEffects: [
      // 1. Aries (Mesha) — Jupiter in 4th house
      {
        rashiId: 1,
        house: 4,
        headline: 'Home, Comfort, and Inner Peace',
        body: `For Aries Moon natives, Jupiter transits your fourth house — the domain of home, mother, emotional security, and landed property. This is one of the most comforting transits you can experience. The restless Aries energy finally finds a place to land.

Expect tangible developments around your living situation. You may buy a home, renovate an existing one, or move to a place that genuinely feels like yours. If you've been living in temporary arrangements or feeling unsettled, this transit brings the sense of belonging you've been missing. Your relationship with your mother or a maternal figure deepens; old misunderstandings may resolve with surprising ease.

Emotionally, this is a period of unusual calm for Aries. Jupiter's exaltation in your sukha bhava (house of happiness) doesn't just bring external comforts — it quiets the inner restlessness that drives so much of your sign's behavior. You may find yourself drawn to meditation, prayer, or simply spending quiet evenings at home rather than chasing the next adventure. Don't resist this. The inner peace you cultivate now becomes the foundation for the next phase of outward action.

Vehicles, domestic appliances, and home infrastructure purchases are favored — Jupiter blesses material comfort in the fourth. Students preparing for competitive exams will find their concentration and retention markedly improved.`,
        dosAndDonts: [
          'Do invest in property or home improvements — this is the best window in 12 years',
          'Do prioritize your relationship with your mother and family elders',
          'Don\'t ignore the pull toward inner work — meditation pays compound interest now',
          'Don\'t uproot yourself unnecessarily — stability is your friend this transit',
        ],
        remedy: 'Offer water to a Peepal tree on Thursdays and recite "Om Guruve Namaha" 108 times',
      },
      // 2. Taurus (Vrishabha) — Jupiter in 3rd house
      {
        rashiId: 2,
        house: 3,
        headline: 'Courage, Communication, and New Skills',
        body: `Jupiter transits your third house — the house of courage, communication, siblings, short journeys, and skill acquisition. While the third isn't traditionally Jupiter's strongest placement, an exalted Jupiter here produces remarkable results for Taurus Moon natives.

Your communication abilities receive a significant upgrade. Whether you write, speak publicly, negotiate deals, or simply need to express yourself more clearly in personal relationships, words flow with unusual persuasiveness and warmth. If you've been meaning to start a blog, podcast, YouTube channel, or any creative project that requires putting yourself out there — this is your window.

Relationships with siblings and close neighbors improve noticeably. If there have been disputes or distance, Jupiter's benevolence creates openings for reconciliation. You may also find yourself becoming a mentor or guide to younger siblings or junior colleagues, a role that suits Jupiter's natural teaching instinct perfectly.

Short trips and local travel increase, often bringing unexpected opportunities. A weekend trip leads to a business contact; a training workshop opens a career door you hadn't considered. Jupiter in the third also strengthens your willpower and courage — decisions that previously felt daunting now feel manageable.`,
        dosAndDonts: [
          'Do launch creative projects, courses, or content — your voice carries authority now',
          'Do invest in learning a new skill, especially one involving communication',
          'Don\'t neglect sibling relationships — small gestures of connection pay disproportionate dividends',
          'Don\'t stay in your comfort zone — Jupiter rewards the bold in the third house',
        ],
        remedy: 'Donate green vegetables or moong dal on Thursdays; wear a yellow thread on your right wrist',
      },
      // 3. Gemini (Mithuna) — Jupiter in 2nd house
      {
        rashiId: 3,
        house: 2,
        headline: 'Wealth, Family, and Sweet Speech',
        body: `For Gemini Moon natives, Jupiter transits your second house — the house of accumulated wealth, family, speech, food, and face. This is a classically auspicious transit for financial growth, and with Jupiter exalted, the gains can be substantial.

Your income streams multiply or existing ones deepen. This isn't windfall gambling luck — it's the kind of steady, legitimate wealth accumulation that comes from being in the right position at the right time. Pay raises, profitable investments, family inheritance settlements, and business growth all fall under Jupiter's second-house blessings. If you've been considering starting a savings plan, investment portfolio, or family trust, initiate it during the first six weeks of this transit.

Your speech becomes notably more refined, persuasive, and pleasant. Gemini already excels at communication, but Jupiter in the second adds gravitas and warmth that your sign sometimes lacks. People listen to you differently — with more respect and trust. This is invaluable for negotiations, sales, teaching, and any profession where your words directly impact your income.

Family meals, celebrations, and gatherings increase. You may host more, eat better (watch weight gain — Jupiter expands everything, including waistlines), and find genuine joy in domestic traditions you previously found tedious.`,
        dosAndDonts: [
          'Do start or increase systematic investments — SIPs, mutual funds, or gold accumulation',
          'Do speak with intention — your words carry unusual weight and consequence now',
          'Don\'t overindulge in rich food — Jupiter in the 2nd expands appetite along with wealth',
          'Don\'t make impulsive large purchases in the retrograde period (mid-Aug to early Oct)',
        ],
        remedy: 'Feed bananas and chana dal to cows on Thursdays; keep a yellow cloth in your wallet',
      },
      // 4. Cancer (Karka) — Jupiter in 1st house (LAGNA!)
      {
        rashiId: 4,
        house: 1,
        headline: 'Personal Renaissance — Jupiter Exalted in Your Own Sign',
        body: `This is the headline transit for Cancer Moon natives. Jupiter, the greatest benefic, transits your first house — your own sign — in its highest dignity. This happens once every twelve years, and it is among the most transformative transits any Moon sign can experience.

Everything about you is amplified in the best possible way. Your confidence surges without tipping into arrogance. Your health improves, your appearance may change (weight gain is common but often welcome — you look prosperous and vital). People perceive you differently: more authoritative, more trustworthy, more magnetic. Job interviews, marriage proposals, public appearances, and leadership opportunities all carry an extra tailwind.

This transit is particularly powerful because Jupiter is the natural significator of wisdom, children, and fortune, and it sits in Cancer's nurturing, emotionally intelligent environment. If you've been planning to have a child, this is among the best astrological windows. If you're single and seeking a partner, your magnetism is at a twelve-year peak. If you're already in a relationship, you bring renewed warmth and generosity to it.

The personal growth during this period extends beyond material gains. Your philosophical outlook matures. You may develop a genuine spiritual practice, find a teacher or guru, or experience moments of insight that permanently shift your worldview. Jupiter in the first house doesn't just make your life better — it makes you better.`,
        dosAndDonts: [
          'Do take bold personal initiatives — career moves, relationships, health transformations',
          'Do wear yellow sapphire (Pukhraj) if recommended by your astrologer — it amplifies Jupiter\'s blessing',
          'Don\'t waste this rare window on indecision or playing small',
          'Don\'t let weight gain go unchecked — exercise and portion control keep Jupiter\'s expansion healthy',
        ],
        remedy: 'Visit a temple on Thursdays, offer turmeric and yellow flowers to Jupiter; chant "Om Brim Brihaspataye Namaha" 108 times',
      },
      // 5. Leo (Simha) — Jupiter in 12th house
      {
        rashiId: 5,
        house: 12,
        headline: 'Spiritual Depth, Foreign Lands, and Quiet Surrender',
        body: `Jupiter transits your twelfth house — the house of losses, expenditure, foreign lands, hospitals, ashrams, and moksha. Before you wince at "losses," understand that an exalted Jupiter in the twelfth is one of the most spiritually productive transits possible. The twelfth house strips away what you don't need so you can receive what you truly do.

Foreign connections become unusually prominent. You may travel abroad, receive an international job offer, or begin working with clients in other countries. Immigration processes that have been stuck may finally move. If you're already abroad, your situation stabilizes and improves. Jupiter's exaltation here suggests that what you spend or "lose" during this period is actually an investment — charitable donations bring invisible returns, medical expenses lead to lasting health, and even financial outflows often seed future prosperity.

Sleep quality and dream life intensify. You may experience vivid, meaningful dreams or develop an interest in dream interpretation. Meditation, yoga, and spiritual retreat become deeply attractive. If you've been running on adrenaline (a very Leo pattern), Jupiter in the twelfth gently insists that you slow down, go inward, and reconnect with something larger than your personal ambition.

The most important thing for Leo Moon natives during this transit: don't fight the twelfth house. It's asking you to let go — of control, of ego investment in outcomes, of the need to always be center stage. What replaces it is a deeper, quieter confidence that doesn't need external validation.`,
        dosAndDonts: [
          'Do invest in spiritual practice — this is the best meditation transit in 12 years for you',
          'Do say yes to international opportunities, even if they feel disruptive',
          'Don\'t resist expenditure that serves genuine needs — Jupiter recycles what you give',
          'Don\'t ignore sleep and rest — your subconscious is processing important material',
        ],
        remedy: 'Donate yellow cloth and turmeric to a temple or ashram on Thursdays; practice 20 minutes of silent meditation daily',
      },
      // 6. Virgo (Kanya) — Jupiter in 11th house
      {
        rashiId: 6,
        house: 11,
        headline: 'Gains, Networks, and Fulfilled Aspirations',
        body: `Jupiter transits your eleventh house — the house of gains, income, social networks, elder siblings, and the fulfillment of desires. This is one of the most materially favorable transits for Virgo Moon natives in the entire twelve-year Jupiter cycle.

The eleventh house is where aspirations become tangible. Projects you've been building toward — a business goal, a savings target, a social position — reach fruition during this period. Your professional network expands dramatically, and the new connections you make are high-quality: mentors, patrons, collaborators, and allies who genuinely advance your goals rather than merely adding to your contact list.

Income from multiple sources increases. This could manifest as a raise, a side project that becomes profitable, returns on past investments, or gifts and awards. Virgo's natural financial prudence combined with Jupiter's expansive abundance creates a particularly effective wealth-building environment. You're not just earning more — you're deploying it wisely.

Social life becomes richer and more fulfilling. You may join organizations, clubs, or professional associations that introduce you to your next major opportunity. Elder siblings or older friends play a helpful role. Community involvement — which Virgo sometimes neglects in favor of private productivity — brings unexpected joy and recognition.`,
        dosAndDonts: [
          'Do actively expand your professional network — attend events, accept invitations, host gatherings',
          'Do set specific financial targets for this five-month window and track progress',
          'Don\'t isolate yourself in work — the 11th house rewards social engagement',
          'Don\'t hoard — share your gains generously and they multiply',
        ],
        remedy: 'Donate to educational charities on Thursdays; offer jaggery and gram to Brahmins or the needy',
      },
      // 7. Libra (Tula) — Jupiter in 10th house
      {
        rashiId: 7,
        house: 10,
        headline: 'Career Peak and Public Recognition',
        body: `Jupiter transits your tenth house — the house of career, public reputation, authority, and life direction. For Libra Moon natives, this is a career-defining transit. An exalted Jupiter in your karma bhava is the kind of alignment that produces promotions, public awards, and professional breakthroughs that you'll reference for years to come.

Your work gains visibility. Projects you lead attract attention from senior management, media, or industry peers. You may receive a title, a corner office, or a leadership role that positions you significantly higher than where you started the year. If you're self-employed, your business reputation reaches new clients and markets. If you're in politics, law, or public service, your influence expands notably.

The quality of your work also improves, not just its visibility. Jupiter in the tenth isn't empty fame — it's recognition that follows genuine contribution. You find yourself naturally gravitating toward work that matters, that serves a larger purpose, and that aligns with your values. The Libra tendency to please everyone gives way to a more confident, principled approach to leadership.

Your relationship with authority figures — bosses, mentors, government officials — improves substantially. Bureaucratic obstacles clear. Applications, permits, and approvals that have been pending may finally move forward. If your father or a father figure is alive, your relationship with them enters a warmer, more respectful phase.`,
        dosAndDonts: [
          'Do take on high-visibility projects and leadership roles — you\'re being watched by people who matter',
          'Do formalize career goals in writing — Jupiter rewards clear intention in the 10th',
          'Don\'t coast on charm alone — Jupiter recognizes substance over style',
          'Don\'t neglect home life in pursuit of career — balance prevents burnout',
        ],
        remedy: 'Offer water to the Sun at sunrise on Thursdays; wear yellow on important work days',
      },
      // 8. Scorpio (Vrishchika) — Jupiter in 9th house
      {
        rashiId: 8,
        house: 9,
        headline: 'Fortune, Dharma, and Spiritual Awakening',
        body: `Jupiter transits your ninth house — the house of fortune, dharma, father, guru, long journeys, and higher education. The ninth is Jupiter's own house (it naturally rules the ninth in the kalapurusha chart), so an exalted Jupiter here is operating at its absolute best. For Scorpio Moon natives, this may be the most blessed transit of the entire cycle.

Luck — genuine, unmistakable luck — enters your life. Opportunities appear from unexpected directions. A chance meeting leads to a life-changing collaboration. A book you read shifts your entire professional approach. An application you'd forgotten about gets accepted. This isn't magical thinking; it's Jupiter's ninth-house effect of placing you at the right intersection of preparation and opportunity.

Long-distance travel, particularly for pilgrimage, education, or cultural enrichment, is strongly favored. You may visit a holy site that leaves a permanent impression, or travel to a country that feels like a second home. Higher education pursuits — degrees, certifications, advanced training — proceed smoothly and lead to concrete outcomes.

Your relationship with teachers, mentors, and spiritual guides deepens profoundly. You may find a guru or philosophical framework that organizes your understanding of life in a way nothing else has. Scorpio's intensity, combined with ninth-house wisdom, can produce genuine spiritual breakthroughs — not superficial "spiritual experiences" but lasting shifts in how you understand suffering, purpose, and meaning.`,
        dosAndDonts: [
          'Do plan a meaningful journey — pilgrimage, study abroad, or a cultural immersion trip',
          'Do seek out a teacher or mentor for whatever you\'re most passionate about',
          'Don\'t dismiss fortunate coincidences — follow them and see where they lead',
          'Don\'t let Scorpio\'s natural skepticism block you from genuine spiritual openings',
        ],
        remedy: 'Visit your guru or a revered temple on Thursdays; donate yellow items to Brahmins; recite Vishnu Sahasranama',
      },
      // 9. Sagittarius (Dhanu) — Jupiter in 8th house
      {
        rashiId: 9,
        house: 8,
        headline: 'Transformation, Research, and Hidden Wealth',
        body: `Jupiter transits your eighth house — the house of transformation, longevity, hidden knowledge, inheritance, and sudden events. The eighth house has a fearsome reputation, but an exalted Jupiter here is one of the few placements that turns this house's intensity into a genuine asset. For Sagittarius Moon natives — Jupiter's own sign — this transit carries special significance.

Research, investigation, and deep study bear exceptional fruit. If your work involves uncovering hidden information — detective work, investigative journalism, scientific research, audit, therapy, or occult studies — your abilities are supercharged. You penetrate surfaces and find what others miss. Academic researchers may produce their most cited work during this period.

Financial gains through inheritance, insurance settlements, spouse's income, or tax benefits become likely. The eighth house governs "unearned wealth" — money that comes to you through others' generosity, through institutional mechanisms, or through the resolution of past claims. An exalted Jupiter makes these channels flow freely.

Health-wise, Jupiter protects longevity in the eighth house. If you've been dealing with chronic health issues, this transit often brings the right diagnosis, the right doctor, or the right treatment protocol. Surgeries performed during this period tend to have better outcomes. Your overall vitality improves despite the eighth house's association with vulnerability.

The transformative aspect is perhaps the most important. You shed an old identity — an outdated self-concept, a relationship pattern that no longer serves you, a career trajectory that has run its course — and emerge renewed. This isn't comfortable, but with Jupiter's guidance, it's purposeful.`,
        dosAndDonts: [
          'Do pursue deep research, therapy, or spiritual investigation — your insight is at a peak',
          'Do review your insurance, will, and financial instruments — hidden value may be unlocked',
          'Don\'t fear change — Jupiter ensures the transformation is ultimately beneficial',
          'Don\'t engage in risky speculative ventures — the 8th house rewards patience, not gambling',
        ],
        remedy: 'Recite the Maha Mrityunjaya Mantra 108 times on Thursdays; donate to medical charities',
      },
      // 10. Capricorn (Makara) — Jupiter in 7th house
      {
        rashiId: 10,
        house: 7,
        headline: 'Partnerships, Marriage, and New Alliances',
        body: `Jupiter transits your seventh house — the house of marriage, partnerships, business alliances, and the public. For Capricorn Moon natives, this is the most relationship-focused transit in the twelve-year cycle, and with Jupiter exalted, the quality of what you attract is exceptional.

If you're single and seeking a life partner, this is your best window. Jupiter in the seventh brings potential partners who are genuinely compatible — not just attractive on the surface but aligned in values, life goals, and temperament. Arranged marriage prospects improve dramatically. For those using dating apps or meeting through social circles, you'll notice the quality of connections shifts upward.

Existing marriages and partnerships deepen. If there's been tension or distance, Jupiter's benevolent influence creates opportunities for honest conversation, renewed intimacy, and mutual growth. Your partner may experience their own professional or personal breakthrough, which indirectly benefits you. If your marriage has been strong, it becomes genuinely joyful during this period — you remember why you chose each other.

Business partnerships and professional alliances also benefit. Joint ventures, collaborations, and client relationships formed during this transit tend to be durable and mutually profitable. Legal matters, contracts, and negotiations resolve in your favor more often than not. If you've been considering bringing on a business partner, this transit supports careful selection and formal agreement.

Capricorn's natural reserve sometimes makes it difficult to fully open to partnership. Jupiter in the seventh gently pushes you past that boundary — you discover that vulnerability in the right relationship isn't weakness but strength.`,
        dosAndDonts: [
          'Do actively pursue partnerships — romantic, professional, or creative collaborations',
          'Do prioritize your spouse or primary partner — small investments of attention yield large returns',
          'Don\'t be so focused on terms and conditions that you miss genuine human connection',
          'Don\'t delay marriage proposals or partnership agreements — timing favors action',
        ],
        remedy: 'Worship Lord Vishnu with your partner on Thursdays; donate yellow sweets to couples',
      },
      // 11. Aquarius (Kumbha) — Jupiter in 6th house
      {
        rashiId: 11,
        house: 6,
        headline: 'Victory Over Enemies, Health Improvement, and Debt Clearance',
        body: `Jupiter transits your sixth house — the house of enemies, disease, debt, competition, and daily work. The sixth house sounds challenging, but an exalted Jupiter here is actually one of the most practically useful transits. Jupiter in the sixth is a "problem solver" placement — it doesn't prevent challenges but gives you overwhelming resources to handle them.

Enemies and competitors are neutralized. Legal disputes move toward favorable resolution. Workplace rivals find their influence diminishing while yours grows. If you've been in a contested situation — a lawsuit, a competitive bid, a political struggle — Jupiter's exaltation tips the scales decisively in your favor. This is particularly powerful for lawyers, athletes, military personnel, and anyone in competitive fields.

Health improves, especially chronic conditions that have been lingering. You may discover a treatment, diet, or exercise regimen that produces noticeably better results than anything you've tried before. Jupiter in the sixth also supports preventive health — this is an excellent time to start a fitness routine, adjust your diet, or address issues you've been postponing. Medical professionals find their diagnostic accuracy and healing effectiveness enhanced.

Debts and financial obligations become manageable. If you've been struggling with loans, EMIs, or accumulated expenses, this transit brings either increased income to service them or opportunities to restructure or settle. The sixth house isn't about windfall wealth — it's about clearing the obstacles that have been blocking your progress.

Your daily work routine finds a more satisfying rhythm. You may restructure your workflow, delegate more effectively, or find that tasks which previously drained you become engaging. Service-oriented work — volunteering, social work, healthcare — brings particular fulfillment.`,
        dosAndDonts: [
          'Do address health issues you\'ve been postponing — Jupiter supports lasting solutions',
          'Do pursue competitive opportunities aggressively — the odds favor you',
          'Don\'t ignore debts — this is the window to restructure or pay them down',
          'Don\'t create unnecessary enemies — Jupiter in the 6th conquers existing opposition, not new ones',
        ],
        remedy: 'Donate medicines or fund medical treatment for the needy on Thursdays; keep a small Jupiter yantra at your workplace',
      },
      // 12. Pisces (Meena) — Jupiter in 5th house
      {
        rashiId: 12,
        house: 5,
        headline: 'Creativity, Children, and Romantic Joy',
        body: `Jupiter transits your fifth house — the house of creativity, children, romance, education, speculation, and poorva punya (merit from past lives). For Pisces Moon natives — Jupiter's own sign — this is one of the most delightful transits in the entire cycle. An exalted Jupiter in the fifth combines your sign lord's blessing with the house of joy. The result is a period where life feels genuinely good.

Creativity surges. Whatever your medium — writing, music, art, design, coding, cooking, gardening — you produce work that surprises you with its quality and originality. The fifth house is where inspiration meets execution, and Jupiter's exaltation means both sides are operating at peak. If you have a creative project you've been nursing, this is the transit to bring it into the world.

Children figure prominently. If you're trying to conceive, this transit is among the most favorable. Existing children bring joy, achievements, and moments of connection that remind you why parenthood matters. Your ability to teach, guide, and nurture young people — whether your own children or students — reaches a natural peak.

Romance blossoms with unusual depth. Single Pisces natives attract partners who appreciate their sensitivity and imagination. New relationships that begin during this transit often have a fairy-tale quality — not superficial infatuation but genuine mutual enchantment. Existing romantic relationships are renewed with playfulness, tenderness, and shared adventures.

Speculative investments and calculated risks tend to pay off during this period, though "calculated" is the operative word. Jupiter doesn't bless recklessness — it rewards informed, well-timed action. Stock market, real estate, or business ventures initiated with proper research during the first six weeks often perform well.`,
        dosAndDonts: [
          'Do pursue creative projects with full commitment — your output will be exceptional',
          'Do spend quality time with children — your influence on them is especially potent now',
          'Don\'t suppress romantic feelings — Jupiter in the 5th rewards emotional honesty',
          'Don\'t confuse Jupiter\'s support for speculation with permission to gamble blindly',
        ],
        remedy: 'Recite Saraswati mantra on Thursdays; donate to children\'s education charities; wear yellow on Thursdays',
      },
    ],
    keyDates: [
      { date: '2026-06-02', event: 'Jupiter enters Cancer', significance: 'The transit begins. Best window for initiating new ventures, especially property purchases, family events, and educational pursuits.' },
      { date: '2026-06-15', event: 'Jupiter conjunct Sun in Cancer', significance: 'Combustion period begins — Jupiter\'s visible effects may feel muted for ~2 weeks, but the underlying current remains strong.' },
      { date: '2026-07-15', event: 'Jupiter clears combustion', significance: 'Jupiter becomes visible again as an evening star. The period from mid-July to mid-August is exceptionally potent for Jupiter-related activities.' },
      { date: '2026-08-11', event: 'Jupiter stations retrograde at ~10° Cancer', significance: 'Consolidation phase begins. Don\'t start new projects; instead, revisit and strengthen what you\'ve already begun. Second opinions on major decisions are wise.' },
      { date: '2026-10-07', event: 'Jupiter stations direct at ~2° Cancer', significance: 'Forward momentum resumes. The final three weeks of Jupiter in Cancer (Oct 7–Nov 1) are excellent for completing and launching delayed projects.' },
      { date: '2026-11-01', event: 'Jupiter enters Leo', significance: 'Transit ends. Jupiter moves to Leo — still a friendly sign but no longer exalted. The Cancer-window closes.' },
    ],
    retrogradeNote: 'Jupiter retrogrades from approximately August 11 to October 7, 2026 within Cancer. During this period, the transit\'s effects turn inward — growth becomes reflective rather than expansive. Avoid initiating major new ventures; instead, refine and strengthen existing projects. Financial decisions benefit from extra deliberation. Spiritually, the retrograde deepens insight and introspection. Jupiter\'s retrograde is not malefic — it\'s a natural pause that prevents overextension.',
  },

  'jupiter-in-leo-2026': {
    slug: 'jupiter-in-leo-2026',
    planetId: 4,
    fromSignId: 4,
    toSignId: 5,
    year: 2026,
    exactDate: '2026-11-01',
    endDate: '2027-04-15',
    duration: '~5.5 months (November 1, 2026 – April 15, 2027)',
    publishDate: '2026-10-01',
    title: {
      en: 'Jupiter in Leo 2026–27: Effects on All 12 Moon Signs',
      hi: 'गुरु सिंह राशि में 2026–27: सभी 12 चन्द्र राशियों पर प्रभाव',
    },
    metaDescription: {
      en: 'Jupiter enters Leo on November 1, 2026 — a friend\'s sign ruled by the Sun. Learn how this 5.5-month transit of authority, creativity, and leadership affects your Moon sign.',
      hi: 'गुरु 1 नवम्बर 2026 को सिंह राशि में प्रवेश करेगा — सूर्य की मित्र राशि में। जानें कि यह 5.5 माह का गोचर आपकी चन्द्र राशि को कैसे प्रभावित करेगा।',
    },
    overview: {
      en: `On November 1, 2026, Jupiter leaves its exaltation in Cancer and steps into Leo — the sign of the Sun. While Jupiter no longer enjoys the extraordinary dignity of Cancer, it enters a sign ruled by a natural friend, and this friendship matters more than casual observers might think. The Sun and Jupiter share a mutual respect that classical texts describe as the relationship between a king and his priest: the Sun rules, Jupiter advises. When Jupiter occupies Leo, the priest walks the king's court — dignified, influential, and heard.

Leo is the sign of authority, self-expression, creativity, fatherhood, government, and the heart — both the physical organ and the metaphorical seat of courage. Jupiter's presence here amplifies all of these themes. Generosity becomes magnanimous rather than merely polite. Leadership acquires a moral dimension. Creative output gains philosophical depth. The person who has been quietly competent finds that the world suddenly notices.

This is not a subtle transit. Jupiter in Leo is loud, visible, and unapologetically confident. Where Jupiter in Cancer was about inner security and emotional depth, Jupiter in Leo is about stepping onto the stage and claiming your role. Parashara notes that Jupiter in a friend's sign produces "moderate but reliable" results — the gains may not match the extraordinary peaks of an exalted Jupiter, but they are steady, dignified, and lasting.

The transit runs from November 1, 2026 through approximately April 15, 2027 — about five and a half months. Jupiter will station retrograde around late February 2027 and turn direct in late June 2027, though by then it will have moved into subsequent signs. The pre-retrograde window (November through mid-February) is the most dynamic period for launching new initiatives, seeking recognition, and stepping into leadership roles.`,
      hi: `1 नवम्बर 2026 को गुरु अपनी उच्च राशि कर्क को छोड़कर सिंह राशि में प्रवेश करता है — सूर्य की राशि। यद्यपि गुरु को अब कर्क की असाधारण गरिमा प्राप्त नहीं है, वह एक स्वाभाविक मित्र की राशि में प्रवेश करता है, और यह मित्रता उससे कहीं अधिक महत्वपूर्ण है जितना सामान्यतः समझा जाता है। सूर्य और गुरु के बीच वह पारस्परिक सम्मान है जिसे शास्त्रीय ग्रन्थ राजा और पुरोहित के सम्बन्ध के रूप में वर्णित करते हैं: सूर्य शासन करता है, गुरु परामर्श देता है। जब गुरु सिंह में बैठता है, तो पुरोहित राजदरबार में विचरण करता है — गरिमामय, प्रभावशाली और सुना जाने वाला।

सिंह अधिकार, आत्माभिव्यक्ति, सृजनशीलता, पितृत्व, शासन और हृदय की राशि है — भौतिक अंग और साहस का रूपक दोनों। गुरु की उपस्थिति इन सभी विषयों को प्रवर्धित करती है। उदारता केवल शिष्ट नहीं बल्कि महानुभाव हो जाती है। नेतृत्व में नैतिक आयाम जुड़ जाता है। सृजनात्मक कार्य में दार्शनिक गहराई आती है।

यह कोई सूक्ष्म गोचर नहीं है। सिंह में गुरु स्पष्ट, दृश्यमान और निःसंकोच आत्मविश्वासी है। जहाँ कर्क में गुरु आन्तरिक सुरक्षा और भावनात्मक गहराई के बारे में था, सिंह में गुरु मंच पर आकर अपनी भूमिका का दावा करने के बारे में है। पराशर टिप्पणी करते हैं कि मित्र राशि में गुरु "मध्यम किन्तु विश्वसनीय" फल देता है — लाभ उच्च गुरु की असाधारण चोटियों से मेल नहीं खा सकते, परन्तु वे स्थिर, गरिमामय और स्थायी होते हैं।

यह गोचर 1 नवम्बर 2026 से लगभग 15 अप्रैल 2027 तक — लगभग साढ़े पाँच माह तक रहेगा। गुरु फ़रवरी 2027 के अन्त में वक्री होगा और जून 2027 के अन्त में मार्गी। वक्री-पूर्व काल (नवम्बर से मध्य फ़रवरी) नई पहल शुरू करने, मान्यता प्राप्त करने और नेतृत्व भूमिकाओं में कदम रखने के लिए सबसे गतिशील अवधि है।`,
    },
    generalThemes: [
      { en: 'Leadership and authority — promotions, political appointments, and public roles that carry real responsibility and visibility', hi: 'नेतृत्व और अधिकार — पदोन्नति, राजनीतिक नियुक्तियाँ, और सार्वजनिक भूमिकाएँ जो वास्तविक उत्तरदायित्व और दृश्यता रखती हैं' },
      { en: 'Creative expression — performing arts, writing, film, music, and any medium where personal vision meets public audience', hi: 'सृजनात्मक अभिव्यक्ति — प्रदर्शन कला, लेखन, चलचित्र, संगीत, और कोई भी माध्यम जहाँ व्यक्तिगत दृष्टि सार्वजनिक दर्शकों से मिलती है' },
      { en: 'Father figures and mentors — strengthened bonds with fathers, paternal blessings, and guru-like guidance from authority figures', hi: 'पितृ-तुल्य व्यक्ति और गुरु — पिता से सम्बन्ध सुदृढ़ होना, पैतृक आशीर्वाद, और अधिकारी व्यक्तियों से गुरु-सदृश मार्गदर्शन' },
      { en: 'Government and institutional engagement — favorable interactions with bureaucracy, approvals, grants, and policy influence', hi: 'सरकार और संस्थागत संलग्नता — नौकरशाही के साथ अनुकूल बातचीत, अनुमोदन, अनुदान, और नीति प्रभाव' },
      { en: 'Spiritual teaching and dharmic leadership — those who teach, preach, or guide others find their audience growing and their message resonating', hi: 'आध्यात्मिक शिक्षण और धार्मिक नेतृत्व — जो शिक्षा, प्रवचन या मार्गदर्शन करते हैं उनके श्रोता बढ़ते हैं और उनका सन्देश प्रतिध्वनित होता है' },
      { en: 'Heart health and vitality — Leo rules the heart; Jupiter here supports cardiovascular wellbeing and overall physical vigor', hi: 'हृदय स्वास्थ्य और जीवन-शक्ति — सिंह हृदय पर शासन करता है; यहाँ गुरु हृदय स्वास्थ्य और समग्र शारीरिक ओज का समर्थन करता है' },
    ],
    moonSignEffects: [
      // 1. Aries (Mesha) — Jupiter in 5th house
      {
        rashiId: 1,
        house: 5,
        headline: 'Creativity, Children, and Romance',
        body: `For Aries Moon natives, Jupiter transits your fifth house — the house of creativity, children, romance, intellect, and poorva punya. This is one of the most joyful transits you can receive. The fifth house is a trikona (trine), and Jupiter — a natural benefic — thrives here, bringing inspiration, warmth, and a palpable sense that life is opening up.

Your creative faculties sharpen dramatically. Whether you work in the arts, technology, business strategy, or any field requiring original thinking, ideas arrive with unusual clarity and force. Projects that have been gestating in the back of your mind suddenly demand expression. If you have been postponing a creative venture — a book, a business concept, a design project — the November-to-February window is your strongest launch period.

Children occupy a more central role in your life during this transit. For those trying to conceive, Jupiter in the fifth is classically favorable. Existing children bring pride through academic achievements, creative accomplishments, or simply by being present in ways that deepen your bond. If you mentor or teach young people, your influence on them carries lasting weight now.

Romance takes on a warmer, more generous quality. New relationships that begin under this transit tend to have substance — not just physical attraction but intellectual compatibility and shared values. For those already in relationships, playfulness and spontaneous gestures revive the spark. Aries can sometimes treat love as a conquest; Jupiter in the fifth teaches you to treat it as a celebration.`,
        dosAndDonts: [
          'Do launch creative projects — your originality and follow-through are both elevated',
          'Do invest quality time in children or young people you mentor',
          'Don\'t suppress romantic impulses — Jupiter in the 5th rewards emotional openness',
          'Don\'t speculate recklessly — Jupiter supports informed risk, not blind gambling',
        ],
        remedy: 'Recite Saraswati Vandana on Thursdays; donate to children\'s education or orphanage charities',
      },
      // 2. Taurus (Vrishabha) — Jupiter in 4th house
      {
        rashiId: 2,
        house: 4,
        headline: 'Home, Mother, and Inner Peace',
        body: `Jupiter transits your fourth house — the domain of home, mother, vehicles, landed property, and emotional security. For Taurus Moon natives, who already value stability and comfort, this transit deepens what you cherish most. The restless striving of the past months gives way to a period where settling in, putting down roots, and nurturing your domestic world feels not just pleasant but necessary.

Property matters are strongly favored. Buying a home, renovating, securing a mortgage at favorable terms, or resolving disputes over ancestral property — all carry Jupiter's blessing. If you have been renting and wondering whether to buy, this transit tips the scale. The fourth house also governs vehicles, so purchasing a car or upgrading your mode of transport goes smoothly.

Your relationship with your mother or a maternal figure enters a warmer phase. Old tensions dissolve, not through dramatic confrontation but through quiet gestures of care that accumulate into genuine understanding. If your mother is no longer living, you may find yourself connecting with her memory in a healing way — perhaps through family traditions, cooking her recipes, or visiting places she loved.

The inner dimension of the fourth house is equally important. Jupiter here brings emotional equilibrium. The anxieties that normally hum beneath Taurus's composed surface grow quieter. Meditation, prayer, or simply spending unhurried evenings at home becomes genuinely restorative. Students preparing for examinations find their concentration improved and their recall sharper.`,
        dosAndDonts: [
          'Do invest in property or home improvements — this is a strong window for real estate',
          'Do nurture your relationship with your mother and family elders',
          'Don\'t ignore the pull toward inner quiet — meditation pays dividends now',
          'Don\'t relocate impulsively during Jupiter\'s retrograde phase',
        ],
        remedy: 'Offer water to a Peepal tree on Thursdays; keep a yellow cloth under your pillow for peaceful sleep',
      },
      // 3. Gemini (Mithuna) — Jupiter in 3rd house
      {
        rashiId: 3,
        house: 3,
        headline: 'Courage, Communication, and Initiative',
        body: `Jupiter transits your third house — the house of courage, communication, siblings, short travel, and practical skills. The third house is not traditionally considered Jupiter's strongest placement, but don't mistake subtlety for weakness. For Gemini Moon natives — already gifted communicators — Jupiter in the third adds a layer of authority and gravitas to your naturally quick, versatile speech.

Your words carry weight they haven't carried before. Where Gemini can sometimes be dismissed as clever but lightweight, Jupiter's presence in your house of communication adds depth and conviction. This is the transit to write the article, pitch the proposal, record the podcast, or deliver the presentation that positions you as a serious voice in your field. People who previously nodded politely at your ideas now lean in and listen.

Relationships with siblings and close peers improve noticeably. If there have been misunderstandings or distance, Jupiter's generosity creates natural openings for reconciliation. You may find yourself becoming an advisor or mentor to younger siblings, a role that Jupiter inhabits comfortably. Short trips increase in frequency and often lead to unexpectedly valuable connections.

Courage is the third house's most underrated gift. Jupiter here strengthens your willpower for decisions that require nerve — changing jobs, ending a draining commitment, starting a venture that feels risky but right. The Gemini tendency to analyze every angle before acting finds a useful counterweight in Jupiter's expansive confidence.`,
        dosAndDonts: [
          'Do publish, present, or pitch — your communication carries unusual authority now',
          'Do invest in skill development, especially writing, speaking, or media production',
          'Don\'t neglect sibling relationships — small acts of connection compound into trust',
          'Don\'t overthink action — Jupiter in the 3rd rewards those who move, not those who deliberate endlessly',
        ],
        remedy: 'Donate green moong dal and stationery to students on Thursdays; wear a yellow thread on the right wrist',
      },
      // 4. Cancer (Karka) — Jupiter in 2nd house
      {
        rashiId: 4,
        house: 2,
        headline: 'Wealth, Family, and Refined Speech',
        body: `Jupiter transits your second house — the house of accumulated wealth, family bonds, speech, food, and facial appearance. For Cancer Moon natives, this transit follows directly after Jupiter's exaltation in your own sign. The personal renaissance of the previous months now translates into tangible material gains. You've grown; now the world pays you accordingly.

Financial accumulation accelerates through legitimate channels. This is not windfall luck but the kind of steady, earned prosperity that comes from being well-positioned and well-regarded. Pay increases, profitable investments, family inheritance matters resolving favorably, and business revenue growing — all fall within the second house's domain. If you have been meaning to start a systematic investment plan or open a fixed deposit, the first few months of this transit are ideal.

Your speech becomes remarkably effective. Cancer's natural emotional intelligence, combined with Jupiter's wisdom in the second house, produces a way of speaking that people find simultaneously warm and authoritative. This is invaluable in negotiations, counseling, teaching, or any role where trust must be established through words. Singers and public speakers notice improvement in vocal quality and audience response.

Family gatherings and celebrations increase. The dinner table becomes a place of genuine connection rather than obligation. You may host more, cook more elaborately, and find surprising pleasure in the rituals of domestic hospitality. Be mindful of weight gain — Jupiter expands everything it touches, and the second house governs food.`,
        dosAndDonts: [
          'Do begin or increase systematic savings and investments — timing strongly favors accumulation',
          'Do speak with deliberate kindness — your words leave deeper impressions than usual',
          'Don\'t overindulge in rich food — Jupiter in the 2nd is generous to a fault with appetite',
          'Don\'t make large impulsive purchases during Jupiter\'s retrograde window',
        ],
        remedy: 'Feed bananas and chana dal to cows on Thursdays; keep a small piece of turmeric in your wallet',
      },
      // 5. Leo (Simha) — Jupiter in 1st house (LAGNA!)
      {
        rashiId: 5,
        house: 1,
        headline: 'Personal Expansion — Jupiter in Your Own Sign',
        body: `This is the headline transit for Leo Moon natives. Jupiter transits your first house — your own sign — bringing the full force of the great benefic directly to bear on your personality, health, appearance, and life direction. This happens once every twelve years, and its effects are among the most visible and transformative you will experience.

Everything about you is amplified. Your confidence rises without becoming arrogance. Your physical appearance may change — you look more prosperous, more vital, more commanding. People perceive you differently: job interviewers lean forward, acquaintances treat you with more respect, strangers assume you are someone important. This is not illusion; Jupiter in the first house genuinely elevates the way you carry yourself, and the world responds in kind.

The Sun-Jupiter friendship gives this transit a particular quality of noble authority. Leo already carries a regal bearing; Jupiter adds wisdom, generosity, and philosophical depth to that natural magnetism. You are not just noticed — you are trusted. Leadership opportunities arrive, and you find yourself equal to them in ways that might have surprised you a year ago. If you have been playing small, this transit makes that impossible to sustain.

Health improves notably, though Jupiter's expansive nature means you must manage weight and over-indulgence. Your outlook on life matures — you develop genuine philosophical convictions, possibly a spiritual practice, and a broader perspective on your role in the world. Jupiter in the first house doesn't just make your circumstances better; it makes you a better version of yourself.`,
        dosAndDonts: [
          'Do take bold personal initiatives — career changes, relationship commitments, health transformations',
          'Do wear yellow sapphire (Pukhraj) if recommended by your astrologer — its effects are strongest now',
          'Don\'t waste this rare twelve-year window on indecision or modesty',
          'Don\'t let physical expansion go unchecked — exercise and dietary discipline keep Jupiter\'s gifts healthy',
        ],
        remedy: 'Visit a temple on Thursdays, offer turmeric and yellow flowers; chant "Om Brim Brihaspataye Namaha" 108 times at sunrise',
      },
      // 6. Virgo (Kanya) — Jupiter in 12th house
      {
        rashiId: 6,
        house: 12,
        headline: 'Spiritual Surrender and Foreign Connections',
        body: `Jupiter transits your twelfth house — the house of expenditure, foreign lands, isolation, sleep, spiritual liberation, and the unseen. Before the word "losses" makes you defensive, understand that Jupiter is the one planet that can turn the twelfth house from a liability into an asset. What you release during this transit makes space for what the next cycle — Jupiter in your first house — will bring.

Foreign connections become prominent. International travel, relocation abroad, or remote work with overseas clients may materialize. Immigration processes that have been stalled start moving. If you are already settled abroad, your situation stabilizes. The twelfth house is the house of "other shores," and Jupiter here suggests that distance — geographical or psychological — serves your growth rather than diminishing it.

Expenditure increases, but an important distinction applies: what you spend now is investment disguised as expense. Charitable donations, medical treatments, educational costs, and spiritual retreats all fall under Jupiter's twelfth-house grace. The money flows out, but it returns in forms that ledgers cannot capture — health, peace, knowledge, karmic credit.

Sleep and dreams deepen. You may experience vivid, symbolically rich dreams or develop a meditation practice that goes deeper than anything you have managed before. Virgo's relentless analytical mind, which usually resists stillness, finds that Jupiter in the twelfth gently insists on letting go. Surrender is not Virgo's natural mode, but this transit teaches that some of the most important work happens when you stop working.`,
        dosAndDonts: [
          'Do invest in meditation, yoga, or spiritual practice — this is the most fertile window in 12 years',
          'Do embrace international opportunities even if they feel inconvenient',
          'Don\'t resist necessary expenditures — Jupiter recycles what you give in unexpected ways',
          'Don\'t neglect sleep — your subconscious is doing essential processing',
        ],
        remedy: 'Donate yellow cloth and turmeric to a temple or ashram on Thursdays; practice 20 minutes of silent sitting daily',
      },
      // 7. Libra (Tula) — Jupiter in 11th house
      {
        rashiId: 7,
        house: 11,
        headline: 'Gains, Networks, and Fulfilled Ambitions',
        body: `Jupiter transits your eleventh house — the house of gains, income from profession, social networks, elder siblings, and the fulfillment of long-held desires. This is one of the most materially favorable transits in the entire Jupiter cycle for Libra Moon natives. The eleventh is the house where sustained effort finally converts into visible reward.

Income increases through multiple channels. A raise, a profitable side venture, returns on investments made years ago, royalties, commissions, or simply a larger client base — the eleventh house governs all forms of incoming wealth beyond your base salary. Libra's natural affinity for partnerships and collaboration means many of these gains arrive through other people: a contact introduces you to a major client, a friend tips you off to an investment, an elder sibling's connection opens a door.

Your social circle expands in both size and quality. You meet people who are genuinely useful — not in a transactional sense, but in the deeper sense of mutual growth. Professional associations, clubs, conferences, and community organizations become unexpectedly rewarding. The connections you make during this transit often persist for years, forming the backbone of your professional network.

Long-standing aspirations reach fruition. A goal you set years ago — a financial target, a social position, a professional milestone — materializes during this period. The eleventh house does not create new desires; it fulfills the ones you have been quietly building toward. For Libra, who often struggles to choose one ambition from many, Jupiter's clarity helps you focus on what truly matters.`,
        dosAndDonts: [
          'Do actively expand your professional and social networks — attend events, accept invitations',
          'Do set measurable financial goals for this transit window and track your progress weekly',
          'Don\'t isolate yourself — the 11th house rewards presence and participation',
          'Don\'t hoard gains — generosity during abundance creates reciprocity during scarcity',
        ],
        remedy: 'Donate to educational institutions on Thursdays; offer jaggery and yellow lentils to those in need',
      },
      // 8. Scorpio (Vrishchika) — Jupiter in 10th house
      {
        rashiId: 8,
        house: 10,
        headline: 'Career Authority and Public Standing',
        body: `Jupiter transits your tenth house — the house of career, public reputation, authority, karma, and life direction. For Scorpio Moon natives, this is a career-defining period. Jupiter in the karma bhava brings not just advancement but the specific kind of advancement that changes how others perceive your professional identity. You are no longer climbing — you have arrived at a new altitude.

Promotions, title changes, leadership appointments, and increased professional visibility are all strongly indicated. Your work attracts attention from people who matter — senior management, industry leaders, media, or institutional gatekeepers. If you have been doing excellent work in relative obscurity, this transit pulls the curtain aside. Projects you lead gain traction and recognition that feeds further opportunity.

The quality of this recognition matters. Jupiter in the tenth is not empty celebrity — it is reputation earned through genuine contribution. Scorpio's natural intensity and investigative depth, combined with Jupiter's wisdom and ethical compass, produces a leadership style that people trust. You find yourself drawn to work that has meaning beyond personal advancement: projects that serve a community, solve a systemic problem, or establish a standard others will follow.

Your relationship with authority figures — bosses, government officials, institutional leaders — improves markedly. Approvals that have been stuck begin to move. Applications, licenses, and permits proceed with unusual smoothness. If your father is living, your relationship with him enters a phase of greater mutual respect and warmth.`,
        dosAndDonts: [
          'Do accept leadership roles and high-visibility assignments — you are being evaluated by future allies',
          'Do document your professional goals in writing — Jupiter in the 10th rewards deliberate aim',
          'Don\'t rely on political maneuvering — Jupiter recognizes substance, not strategy',
          'Don\'t sacrifice personal health and relationships for career gains — sustainable success requires balance',
        ],
        remedy: 'Offer water to the Sun at sunrise on Thursdays; wear yellow or saffron on important professional days',
      },
      // 9. Sagittarius (Dhanu) — Jupiter in 9th house
      {
        rashiId: 9,
        house: 9,
        headline: 'Fortune, Dharma, and the Guru\'s Grace',
        body: `Jupiter transits your ninth house — the house of fortune, higher learning, dharma, father, guru, and long journeys. For Sagittarius Moon natives, this is Jupiter transiting the house it naturally rules in the kalapurusha chart, and Sagittarius is Jupiter's own sign. The alignment is almost redundant in its auspiciousness: your ruling planet, in the house of fortune, activating the themes that define your sign. Luck is not quite the right word — alignment is better.

Opportunity arrives from directions you did not anticipate. A chance conversation leads to a collaboration that reshapes your career. A book you pick up at random contains the insight you have been searching for. An application you submitted months ago and forgot about receives an enthusiastic acceptance. Jupiter in the ninth does not manufacture these events; it places you at the intersection of preparation and possibility, and you notice openings that would otherwise have passed unmarked.

Long-distance travel is strongly favored, particularly for pilgrimage, education, or cultural exploration. You may visit a place that rearranges your understanding of the world, or return to a country you once knew and find it has new lessons for you. Higher education — degrees, certifications, research programs — proceeds with momentum and purpose. Academic work submitted during this transit tends to be well-received.

The guru dimension is the deepest layer of this transit. You may find a teacher whose guidance fundamentally alters your trajectory, or you may become that teacher for someone else. Sagittarius's natural hunger for meaning finds its most satisfying food in the ninth house, and Jupiter ensures the nourishment is real rather than decorative.`,
        dosAndDonts: [
          'Do plan a meaningful journey — pilgrimage, study abroad, or an exploration that stretches your worldview',
          'Do seek a mentor for your most important pursuit — the right teacher appears when Jupiter blesses the 9th',
          'Don\'t dismiss fortunate coincidences as random — follow them seriously',
          'Don\'t let philosophical certainty harden into arrogance — the 9th house teaches humility through revelation',
        ],
        remedy: 'Visit your guru or a sacred site on Thursdays; donate yellow items and books to scholars; recite Vishnu Sahasranama',
      },
      // 10. Capricorn (Makara) — Jupiter in 8th house
      {
        rashiId: 10,
        house: 8,
        headline: 'Transformation, Hidden Gains, and Deep Research',
        body: `Jupiter transits your eighth house — the house of transformation, longevity, hidden wealth, sudden events, and occult knowledge. The eighth house carries a fearsome reputation, but Jupiter is the one planet that can turn its intensity into a genuine asset. For Capricorn Moon natives, this transit strips away structures that have outlived their purpose and replaces them with something more aligned with who you are becoming.

Financial gains through channels other than direct salary become likely: insurance settlements, inheritance, a spouse's improved income, tax refunds, royalties from past work, or the resolution of long-pending claims. The eighth house governs "other people's money," and Jupiter opens those channels. If you have pending legal or financial claims, this transit often brings resolution.

Research and investigation reach unusual depth. If your work involves uncovering hidden patterns — data analysis, detective work, therapy, audit, academic research, or any form of deep inquiry — your perception sharpens. You see connections others miss. You ask questions others do not think to ask. Academic and professional output during this period tends to be your most incisive.

The transformative dimension is the most important for Capricorn, a sign that tends to resist change. Jupiter in the eighth does not ask permission — it reorganizes your life around what is authentic and discards what is merely habitual. A job you have outgrown ends so a better one can begin. A relationship pattern that no longer serves you becomes impossible to maintain. This process is uncomfortable, but Jupiter ensures it is purposeful. You emerge lighter, clearer, and more genuinely yourself.`,
        dosAndDonts: [
          'Do review insurance, wills, and joint financial instruments — hidden value may surface',
          'Do pursue deep research or therapeutic work — your insight is at its sharpest',
          'Don\'t resist transformation — what Jupiter removes was already ready to go',
          'Don\'t engage in speculative gambles — the 8th house rewards patience and investigation, not risk-taking',
        ],
        remedy: 'Recite the Maha Mrityunjaya Mantra 108 times on Thursdays; donate to medical and hospice charities',
      },
      // 11. Aquarius (Kumbha) — Jupiter in 7th house
      {
        rashiId: 11,
        house: 7,
        headline: 'Marriage, Partnerships, and Public Life',
        body: `Jupiter transits your seventh house — the house of marriage, partnerships, business alliances, and public dealings. For Aquarius Moon natives, this is the most relationship-focused transit in the twelve-year cycle. Jupiter in the seventh brings not just more relationships but better ones — the quality of the people you attract and the depth of connection you form both improve markedly.

If you are single and seeking a life partner, this is among your strongest windows. Jupiter in the seventh draws potential partners who are compatible at multiple levels — not merely attractive but aligned in values, ambition, and temperament. For arranged marriage processes, suitable proposals arrive with greater frequency and quality. If you use dating platforms, the matches feel different: more substantive, more promising.

Existing partnerships — romantic, professional, or creative — deepen and stabilize. If there has been friction in your marriage, Jupiter's benevolence creates space for honest conversation and renewed commitment. Your partner may experience their own breakthrough during this period, and the rising tide lifts both of you. For business partnerships, this is an excellent time to formalize agreements, negotiate terms, and build joint ventures on solid foundations.

Aquarius sometimes holds partners at analytical arm's length, preferring ideas to intimacy. Jupiter in the seventh gently challenges this tendency. You discover that vulnerability — genuine, not performed — is not a weakness but a form of strength that deepens every relationship it touches. Legal matters and contracts resolve favorably, and interactions with the general public carry a warmth that works in your favor.`,
        dosAndDonts: [
          'Do actively pursue partnership — romantic, professional, or collaborative',
          'Do prioritize your spouse or closest partner — attention invested here compounds rapidly',
          'Don\'t let analysis substitute for emotional presence — the 7th house rewards vulnerability',
          'Don\'t delay proposals or partnership formalization — Jupiter\'s timing favors decisive action',
        ],
        remedy: 'Worship Lord Vishnu with your partner on Thursdays; donate yellow sweets to married couples',
      },
      // 12. Pisces (Meena) — Jupiter in 6th house
      {
        rashiId: 12,
        house: 6,
        headline: 'Victory Over Obstacles, Health, and Service',
        body: `Jupiter transits your sixth house — the house of enemies, disease, debt, competition, and daily work. For Pisces Moon natives — Jupiter's own sign — this transit is less about glamour and more about practical problem-solving. Jupiter in the sixth does not prevent challenges; it gives you the resources, clarity, and resilience to overcome them decisively.

Enemies and competitors lose their edge. Legal disputes trend toward favorable outcomes. Workplace rivals find their influence waning while yours grows quietly but steadily. If you are in any contested situation — a lawsuit, a competitive tender, a bureaucratic battle — Jupiter in the sixth tips the balance in your favor. Athletes, lawyers, and anyone in competitive professions notice that their timing, preparation, and execution improve in concert.

Health matters benefit from Jupiter's protective presence. Chronic conditions that have resisted treatment may finally respond to a new approach — the right doctor, the right protocol, the right dietary change. This is an excellent transit for beginning a fitness routine, addressing nagging health issues, or making preventive lifestyle changes. Jupiter does not guarantee perfect health, but it dramatically improves your odds of finding effective solutions.

Debt and financial obligations become more manageable. If loans, EMIs, or accumulated expenses have been weighing on you, this transit brings either increased income to service them or structural opportunities to refinance, settle, or consolidate. Your daily work routine also improves — you find a rhythm that is both productive and sustainable. Service-oriented work and volunteering bring unexpected fulfillment and often open doors in adjacent areas of your life.`,
        dosAndDonts: [
          'Do confront health issues you have been postponing — Jupiter supports lasting solutions now',
          'Do pursue competitive opportunities with full effort — the odds favor you',
          'Don\'t ignore debts — this is the window to restructure, settle, or pay them down',
          'Don\'t create unnecessary conflict — Jupiter conquers existing enemies, not ones you manufacture',
        ],
        remedy: 'Donate medicines or sponsor medical treatment for the underprivileged on Thursdays; keep a Jupiter yantra at your workplace',
      },
    ],
    keyDates: [
      { date: '2026-11-01', event: 'Jupiter enters Leo', significance: 'The transit begins. The first six weeks (November–mid December) are the most dynamic window for launching new ventures, seeking promotions, and stepping into leadership roles.' },
      { date: '2026-12-15', event: 'Jupiter conjunct Sun in Leo (approximate)', significance: 'Combustion period — Jupiter\'s visible effects may feel subdued for 2–3 weeks while Jupiter is too close to the Sun, but the underlying momentum continues.' },
      { date: '2027-01-10', event: 'Jupiter clears combustion', significance: 'Jupiter re-emerges as a morning star. The January–February window is excellent for completing projects started in November and initiating second-wave plans.' },
      { date: '2027-02-25', event: 'Jupiter stations retrograde at ~18° Leo (approximate)', significance: 'Consolidation phase begins. Avoid launching new ventures; instead revisit, refine, and strengthen what is already in motion. Second opinions on major decisions are wise.' },
      { date: '2027-04-15', event: 'Jupiter exits Leo, enters Virgo', significance: 'Jupiter moves into Virgo — a sign it considers neutral-to-unfriendly. The Leo window closes. Projects and relationships initiated during the Leo transit continue to bear fruit if properly grounded.' },
      { date: '2027-06-22', event: 'Jupiter stations direct at ~10° Virgo (approximate)', significance: 'Jupiter turns direct in Virgo, fully clearing the retrograde shadow. Commitments made during Jupiter in Leo gain forward momentum again.' },
    ],
    retrogradeNote: 'Jupiter stations retrograde around February 25, 2027 at approximately 18° Leo and continues retrograde motion into Virgo, turning direct around June 22, 2027 at ~10° Virgo. The retrograde period within Leo (late February through mid-April) is a time for consolidation rather than expansion. Leadership roles assumed during the direct phase are tested and refined. Creative projects deepen in quality even as external progress slows. Financial decisions benefit from extra deliberation. Jupiter retrograde is not malefic — it is a natural pause that ensures your growth is sustainable rather than over-extended.',
  },

  'rahu-in-capricorn-2026': {
    slug: 'rahu-in-capricorn-2026',
    planetId: 7,
    fromSignId: 11,
    toSignId: 10,
    year: 2026,
    exactDate: '2026-12-06',
    endDate: '2028-06-15',
    duration: '~18 months (December 6, 2026 – June 2028)',
    publishDate: '2026-11-15',
    title: {
      en: 'Rahu in Capricorn 2026–28: Effects on All 12 Moon Signs',
      hi: 'राहु मकर राशि में 2026–28: सभी 12 चन्द्र राशियों पर प्रभाव',
    },
    metaDescription: {
      en: 'Rahu enters Capricorn on December 6, 2026 — Saturn\'s sign of cold ambition. Learn how this 18-month transit of power, career obsession, and karmic reckoning affects your Moon sign.',
      hi: 'राहु 6 दिसम्बर 2026 को मकर राशि में प्रवेश करेगा — शनि की महत्वाकांक्षा की राशि में। जानें कि यह 18 माह का गोचर आपकी चन्द्र राशि को कैसे प्रभावित करेगा।',
    },
    overview: {
      en: `On December 6, 2026, Rahu — the north lunar node, the shadow planet of insatiable desire — leaves Aquarius and enters Capricorn, Saturn's earth sign of structure, discipline, and relentless ambition. Rahu will remain in Capricorn for approximately eighteen months, until June 2028. This is not a gentle transit. Rahu in Capricorn is the executive who sleeps four hours a night, the politician who remembers every favor owed, the entrepreneur who builds empires and forgets to call home. It amplifies everything Capricorn represents — career, hierarchy, institutional power, pragmatism — and strips away the pretense of modesty.

The reason this transit hits so hard is the natural affinity between Rahu and Saturn. Classical texts note that Rahu behaves like Saturn — both are karmic enforcers, both deal in consequences, both operate on long timescales. When Rahu occupies Saturn's own sign, these qualities are not merely present but dominant. The desire for status, recognition, and material security becomes an all-consuming drive. People who have been quietly building careers may find themselves thrust into positions of unexpected authority. Those who have been cutting corners will find that Capricorn's structural integrity demands a reckoning.

The last time Rahu occupied Capricorn was approximately 2008–2009 — the period of the global financial crisis, when institutional structures that appeared invincible were exposed as hollow. Rahu in Capricorn does not create or destroy institutions; it reveals whether they are built on substance or illusion. The same principle applies to individual careers: if your professional position is grounded in genuine competence and ethical conduct, Rahu amplifies your authority. If it rests on appearances, networking without substance, or borrowed credibility, this transit exposes the gap.

Rahu always moves retrograde — backward through the zodiac — which gives this transit an inherently revisionary quality. You are not building something entirely new; you are revisiting old ambitions, unfinished career arcs, and power dynamics you thought you had resolved. The karmic dimension is inescapable. Rahu's transits are never purely material — they carry the weight of past-life patterns, compulsive behaviors, and desires so deep they feel like instinct rather than choice. The eighteen months ahead will teach you the difference between ambition that serves your dharma and ambition that merely feeds your ego.`,
      hi: `6 दिसम्बर 2026 को राहु — उत्तर चन्द्र पात, अतृप्त इच्छा का छाया ग्रह — कुम्भ राशि छोड़कर मकर राशि में प्रवेश करता है, शनि की पृथ्वी राशि जो अनुशासन, संरचना और अदम्य महत्वाकांक्षा का प्रतीक है। राहु लगभग अठारह माह तक, जून 2028 तक मकर में रहेगा। यह कोई सौम्य गोचर नहीं है। मकर में राहु वह अधिकारी है जो रात में चार घण्टे सोता है, वह राजनेता जो हर एहसान याद रखता है, वह उद्यमी जो साम्राज्य बनाता है और घर फ़ोन करना भूल जाता है।

इस गोचर के इतने प्रभावशाली होने का कारण राहु और शनि के बीच स्वाभाविक सम्बन्ध है। शास्त्रीय ग्रन्थ बताते हैं कि राहु शनि के समान व्यवहार करता है — दोनों कार्मिक प्रवर्तक हैं, दोनों परिणामों से निपटते हैं, दोनों दीर्घकालिक समयावधि पर कार्य करते हैं। जब राहु शनि की अपनी राशि में बैठता है, तो ये गुण केवल उपस्थित नहीं बल्कि प्रभावी होते हैं। प्रतिष्ठा, मान्यता और भौतिक सुरक्षा की इच्छा एक सर्वग्राही अभियान बन जाती है।

पिछली बार राहु मकर में लगभग 2008-2009 में था — वैश्विक वित्तीय संकट का काल, जब अजेय प्रतीत होने वाली संस्थागत संरचनाएँ खोखली सिद्ध हुईं। मकर में राहु संस्थाओं को बनाता या नष्ट नहीं करता; वह प्रकट करता है कि वे सार पर बनी हैं या भ्रम पर। यही सिद्धान्त व्यक्तिगत कैरियर पर लागू होता है।

राहु सदैव वक्री गति से चलता है — राशिचक्र में पीछे की ओर — जो इस गोचर को एक स्वाभाविक रूप से पुनरीक्षात्मक गुण प्रदान करता है। आप कुछ पूर्णतः नया नहीं बना रहे; आप पुरानी महत्वाकांक्षाओं, अधूरे कैरियर पथों, और उन शक्ति गतिकी को पुनः देख रहे हैं जिन्हें आपने हल मान लिया था। कार्मिक आयाम अनिवार्य है। आगे के अठारह माह आपको सिखाएँगे कि धर्म की सेवा करने वाली महत्वाकांक्षा और केवल अहंकार को पोषित करने वाली महत्वाकांक्षा में क्या अन्तर है।`,
    },
    generalThemes: [
      { en: 'Career obsession — sudden promotions, corporate power grabs, and an all-consuming drive to climb the professional ladder', hi: 'कैरियर का जुनून — अचानक पदोन्नति, कॉर्पोरेट सत्ता अधिग्रहण, और व्यावसायिक सीढ़ी चढ़ने की सर्वग्राही प्रेरणा' },
      { en: 'Institutional upheaval — government restructuring, corporate scandals, and the exposure of hollow structures built on appearances rather than substance', hi: 'संस्थागत उथल-पुथल — सरकारी पुनर्गठन, कॉर्पोरेट घोटाले, और दिखावे पर बनी खोखली संरचनाओं का भण्डाफोड़' },
      { en: 'Burnout and workaholism — the shadow side of Rahu\'s relentless ambition; the body demands rest that the mind refuses to grant', hi: 'थकान और कार्य-व्यसन — राहु की अथक महत्वाकांक्षा का छाया पक्ष; शरीर विश्राम माँगता है जो मन देने से इनकार करता है' },
      { en: 'Karmic reckoning in authority — leaders face consequences for past decisions; those who led with integrity are rewarded, those who didn\'t are exposed', hi: 'अधिकार में कार्मिक हिसाब — नेता पिछले निर्णयों के परिणाम भुगतते हैं; जिन्होंने सत्यनिष्ठा से नेतृत्व किया उन्हें पुरस्कृत किया जाता है' },
      { en: 'Material pragmatism over idealism — practical results matter more than noble intentions; Rahu in Capricorn judges you by what you built, not what you planned', hi: 'आदर्शवाद पर भौतिक व्यावहारिकता — व्यावहारिक परिणाम उदात्त इरादों से अधिक महत्वपूर्ण; मकर में राहु आपको बनाए गए से आँकता है, योजना से नहीं' },
      { en: 'Father figures and authority relationships — complex karmic patterns with father, boss, or government surface for resolution', hi: 'पितृ-तुल्य व्यक्ति और अधिकार सम्बन्ध — पिता, बॉस, या सरकार के साथ जटिल कार्मिक प्रतिरूप समाधान के लिए सामने आते हैं' },
    ],
    moonSignEffects: [
      // 1. Aries (Mesha) — Rahu in 10th house
      {
        rashiId: 1,
        house: 10,
        headline: 'Career Earthquake — Sudden Rise or Reckoning',
        body: `Rahu transits your tenth house — the house of career, public reputation, and authority. For Aries Moon natives, this is the most career-intensive eighteen months in the entire Rahu cycle. The tenth house is Rahu's preferred domain in many respects: this is where the shadow planet's hunger for status, recognition, and worldly power finds its most direct expression.

Expect your professional trajectory to accelerate in ways that feel slightly surreal. Promotions arrive ahead of schedule. Responsibilities land on your desk that would normally go to someone with a decade more experience. You may find yourself speaking to audiences, managing teams, or making decisions at a level that surprises even you. Rahu in the tenth doesn't ask whether you feel ready — it throws you into the deep end and rewards those who swim.

The shadow side is real and must be watched. Rahu's ambition has no natural brake pedal. You can become so consumed by career advancement that your health, relationships, and inner life wither. The temptation to cut ethical corners — to take credit for others' work, to play political games, to sacrifice principle for promotion — is strong during this transit. Capricorn's Saturn rulership will eventually hold you accountable for every shortcut. The careers that collapse most dramatically under Rahu in the tenth are the ones built on manipulation rather than merit. Build on substance, and Rahu will elevate you to heights you hadn't imagined possible.`,
        dosAndDonts: [
          'Do accept leadership opportunities even if they feel premature — Rahu rewards boldness in the 10th',
          'Do maintain ethical boundaries rigorously — shortcuts are tempting but Saturn eventually audits every one',
          'Don\'t sacrifice family and health for career — burnout during this transit is a genuine risk',
          'Don\'t let sudden power change how you treat subordinates — Rahu observes how you handle authority',
        ],
        remedy: 'Recite "Om Raam Rahave Namaha" 108 times on Saturdays; donate dark-colored blankets to the homeless',
      },
      // 2. Taurus (Vrishabha) — Rahu in 9th house
      {
        rashiId: 2,
        house: 9,
        headline: 'Unconventional Faith and Foreign Fortune',
        body: `Rahu transits your ninth house — the house of dharma, fortune, father, guru, and long-distance travel. For Taurus Moon natives, this is a deeply unsettling yet ultimately productive transit. The ninth house represents everything you believe about the world — your faith, your philosophy, your sense of cosmic order. Rahu here doesn't destroy those beliefs; it forces you to examine whether they are genuinely yours or simply inherited.

Foreign connections become prominent and often life-changing. You may travel to distant countries, take an overseas assignment, or begin working with international clients in a way that reshapes your worldview. Immigration or visa matters that have been stuck may suddenly move — though Rahu's movement is rarely straightforward, so expect complications alongside progress. The foreign element brings growth precisely because it pulls you out of Taurus's comfort-loving default.

Your relationship with father figures, gurus, and authority becomes complicated. You may question a teacher you previously accepted without reservation, or discover that a mentor's guidance was more self-serving than you realized. This is Rahu's gift disguised as disruption: it strips away false teachers so genuine wisdom can enter. If you find a spiritual path or philosophical framework during this transit that survives Rahu's scrutiny, it will be the real thing — not a comforting illusion but a practice that holds up under pressure.`,
        dosAndDonts: [
          'Do explore foreign cultures, philosophies, and spiritual traditions outside your comfort zone',
          'Do question inherited beliefs — not to destroy faith but to find one that is genuinely yours',
          'Don\'t blindly follow a new guru or ideology that appears during this transit — Rahu can glamorize charlatans',
          'Don\'t neglect your relationship with your father — karmic patterns here demand conscious attention',
        ],
        remedy: 'Feed birds on Saturdays, especially crows; donate to an educational institution serving underprivileged students',
      },
      // 3. Gemini (Mithuna) — Rahu in 8th house
      {
        rashiId: 3,
        house: 8,
        headline: 'Deep Transformation and Hidden Power',
        body: `Rahu transits your eighth house — the house of sudden change, hidden wealth, occult knowledge, longevity, and other people's money. For Gemini Moon natives, this is one of the more intense Rahu placements, and intensity is not a word Gemini uses lightly. The eighth house operates beneath the surface, and Rahu's presence here pulls you into depths you might prefer to avoid.

Financial matters involving others become prominent. Inheritance, insurance claims, shared investments, your spouse's income, and tax matters all carry Rahu's amplifying energy. Unexpected money may arrive from sources you hadn't considered — a forgotten policy, a legal settlement, or an investment that suddenly appreciates. Conversely, watch for financial entanglements where the terms are unclear. Rahu in the eighth can bring gain, but it can also create obligations you didn't intend.

The transformative dimension of this transit is its most significant feature. You undergo a psychological or circumstantial shift that changes how you understand yourself. A secret comes to light — about yourself, about someone close to you, about a situation you thought you understood. Gemini's natural lightness is forced to reckon with heavy truths. This is uncomfortable, but it is also the transit that produces genuine depth in a sign that sometimes skims surfaces. Research, investigation, and occult or psychological studies are powerfully favored. Your analytical mind, applied to hidden subjects, produces insights that surprise you with their precision.`,
        dosAndDonts: [
          'Do pursue deep research, therapy, or psychological self-investigation — Rahu sharpens eighth-house perception',
          'Do review financial instruments — insurance, wills, joint accounts — and clarify all terms',
          'Don\'t ignore health symptoms — the eighth house governs longevity, and Rahu amplifies what you neglect',
          'Don\'t enter financial arrangements with unclear terms — Rahu in the 8th punishes vagueness',
        ],
        remedy: 'Recite the Maha Mrityunjaya Mantra on Saturdays; donate to hospice or palliative care organizations',
      },
      // 4. Cancer (Karka) — Rahu in 7th house
      {
        rashiId: 4,
        house: 7,
        headline: 'Obsessive Partnerships and Karmic Relationships',
        body: `Rahu transits your seventh house — the house of marriage, partnerships, and public dealing. For Cancer Moon natives, this transit brings relationships that feel fated, magnetic, and slightly overwhelming. Rahu in the seventh draws partners who are unusual, foreign, or outside your normal social circle. The attraction is powerful — often irrationally so — because Rahu operates through desire rather than reason.

If you are single, you may meet someone who fascinated you from the first conversation. The connection feels deeper than mere attraction; there is a karmic quality, as though you are continuing something that began long before this lifetime. This person may be from a different culture, significantly older or younger, or from a background that your family wouldn't immediately approve. Rahu in the seventh doesn't care about social conventions — it cares about karmic completion.

For those already married, this transit tests the partnership. Rahu amplifies whatever is already present: if the marriage is strong, it intensifies the bond; if fractures exist, they become impossible to ignore. A spouse may undergo their own professional or personal transformation, which changes the dynamic between you. Business partnerships carry similar intensity. Deals proposed during this transit are rarely simple — they involve complex terms, unusual partners, and stakes that feel higher than normal. The key with Rahu in the seventh is discrimination: not every magnetic connection is healthy, and not every intense proposal is wise. Let the initial fascination settle before committing.`,
        dosAndDonts: [
          'Do remain open to unconventional partnerships — Rahu brings growth through unfamiliar connections',
          'Do examine existing relationships honestly — what you avoid now will be forced into the open later',
          'Don\'t rush into marriage or business partnerships based on intense initial attraction alone',
          'Don\'t ignore your instincts when a partner or deal feels too good to be true — Rahu glamorizes',
        ],
        remedy: 'Worship Durga on Saturdays; keep a piece of gomed (hessonite) in your bedroom after consulting an astrologer',
      },
      // 5. Leo (Simha) — Rahu in 6th house
      {
        rashiId: 5,
        house: 6,
        headline: 'Crushing Competition and Unconventional Healing',
        body: `Rahu transits your sixth house — the house of enemies, disease, debt, and daily work. For Leo Moon natives, this is one of the more favorable Rahu placements. The sixth house is an upachaya (growth house), and malefics like Rahu actually perform well here — they direct their aggressive energy toward defeating obstacles rather than creating them. Rahu in the sixth is the corporate warrior, the litigator who never loses, the strategist who outmaneuvers every opponent.

Your competitive edge sharpens dramatically. Legal disputes, workplace rivalries, competitive examinations, and professional contests all trend in your favor. Enemies who have been undermining you find their tactics backfiring. If you have been in a prolonged struggle — a lawsuit, a territorial dispute at work, a conflict with a neighbor or relative — Rahu in the sixth provides the ruthless pragmatism needed to end it decisively.

Health takes an unusual trajectory. Rahu here can bring unconventional healing — alternative medicine, experimental treatments, or dietary changes that produce results where conventional approaches stalled. Conversely, stress-related health issues need watching. Rahu's intensity in the sixth house means you push yourself harder than your body wants to go. The very competitiveness that wins professional battles can become self-destructive if turned inward. Exercise as a stress outlet, not just as a performance metric, is essential. Debt matters resolve, often through aggressive negotiation or a lump-sum settlement that clears accumulated obligations.`,
        dosAndDonts: [
          'Do pursue competitive opportunities with full intensity — Rahu in the 6th is your secret weapon',
          'Do explore alternative healing modalities if conventional treatment has stalled',
          'Don\'t let competitive drive become personal cruelty — defeat opponents, don\'t destroy them',
          'Don\'t ignore stress signals from your body — Rahu pushes past healthy limits',
        ],
        remedy: 'Donate medicines to the needy on Saturdays; keep a small piece of lead in your workplace',
      },
      // 6. Virgo (Kanya) — Rahu in 5th house
      {
        rashiId: 6,
        house: 5,
        headline: 'Unconventional Creativity and Karmic Children',
        body: `Rahu transits your fifth house — the house of creativity, children, romance, intellect, and poorva punya. For Virgo Moon natives, this is one of the more psychologically complex Rahu placements. The fifth house governs what you create — whether children, art, ideas, or speculative ventures — and Rahu here adds an obsessive, unconventional quality to every act of creation.

Creative output during this transit is unlike anything you normally produce. Virgo's analytical precision combines with Rahu's boundary-breaking energy to generate ideas that are original, occasionally controversial, and almost always ahead of their time. If you work in any creative field — technology, design, writing, music, or entrepreneurship — expect to produce your most distinctive work. The catch: it may not be immediately appreciated. Rahu's creations often make more sense in retrospect.

Matters related to children carry karmic weight. If you are trying to conceive, the process may involve unexpected twists — fertility treatments, adoption considerations, or a pregnancy that arrives at an inconvenient time but proves to be exactly right. Existing children may exhibit unusual talents or challenging behaviors that demand a parenting approach you hadn't planned. Romance takes an intense, slightly obsessive quality. New relationships that begin under Rahu in the fifth feel consuming and transformative. Speculative investments attract you, but Rahu's fifth-house energy can make you overconfident — calculated risks, not gambles.`,
        dosAndDonts: [
          'Do pursue creative projects that feel risky or unconventional — Rahu rewards originality in the 5th',
          'Do pay attention to your children\'s unusual needs or talents — karmic patterns are active',
          'Don\'t gamble with money you cannot afford to lose — Rahu inflates speculative confidence',
          'Don\'t dismiss unconventional romantic connections — but don\'t rush commitment either',
        ],
        remedy: 'Donate to children\'s charities on Saturdays; recite Saraswati mantra for clarity in creative work',
      },
      // 7. Libra (Tula) — Rahu in 4th house
      {
        rashiId: 7,
        house: 4,
        headline: 'Disrupted Roots and Restless Homes',
        body: `Rahu transits your fourth house — the house of home, mother, emotional security, and landed property. For Libra Moon natives, this is one of the more uncomfortable Rahu placements because it disturbs the very foundation you stand on. The fourth house is where you feel safe, and Rahu is the planet that makes safety feel insufficient.

Expect changes in your living situation. You may relocate — perhaps to a foreign country or an unfamiliar city — or undergo significant renovations that temporarily upend your domestic routine. Property matters carry both opportunity and complication: you may acquire real estate, but the process involves unexpected obstacles, legal tangles, or financing that doesn't proceed as planned. Rahu in the fourth brings properties that are unusual in some way — a foreign home, an unconventional layout, or a deal with complex terms.

Your relationship with your mother or maternal figures undergoes a karmic review. Old emotional patterns — dependency, resentment, guilt, or unspoken expectations — surface for examination. This is not comfortable, but it is necessary. Rahu forces you to see the relationship as it actually is, not as childhood memory has painted it. The psychological dimension of this transit is profound: you may question the emotional programming you received in childhood and begin rewriting scripts that no longer serve you. Inner restlessness is the hallmark of this placement — a feeling that nowhere is quite home. Rather than fighting this, use it as fuel for genuine self-inquiry.`,
        dosAndDonts: [
          'Do embrace necessary relocations — Rahu in the 4th brings growth through uprooting',
          'Do address unresolved emotional patterns with your mother or family of origin',
          'Don\'t rush property purchases without thorough due diligence — hidden complications are likely',
          'Don\'t medicate inner restlessness with material comforts — sit with the discomfort and learn from it',
        ],
        remedy: 'Offer water to the Moon on Monday nights; keep a coconut wrapped in white cloth at home and replace it monthly',
      },
      // 8. Scorpio (Vrishchika) — Rahu in 3rd house
      {
        rashiId: 8,
        house: 3,
        headline: 'Fearless Communication and Bold Ventures',
        body: `Rahu transits your third house — the house of courage, communication, siblings, short travel, and initiative. For Scorpio Moon natives, this is one of the most empowering Rahu placements. The third house is another upachaya where malefic planets thrive, and Rahu here gives you a voice that cuts through noise, a courage that borders on recklessness, and a willingness to take initiatives that others find daunting.

Your communication style becomes magnetic and unusually persuasive. Whether you write, speak, negotiate, or simply converse, words carry a hypnotic intensity that is characteristically Rahu. This is the transit to launch a media venture, publish provocative ideas, start a podcast with real edge, or pitch proposals that your conventional self would have softened. Scorpio's depth combined with Rahu's boundary-crossing produces communication that is memorable — sometimes uncomfortably so.

Sibling relationships take on karmic dimensions. A brother or sister may need your help in ways that test your boundaries, or a long-dormant rivalry may reignite. Short travel increases dramatically and often leads to unexpected opportunities — a weekend trip produces a business contact; a training program opens a career door. Your willpower and raw courage reach a peak. Decisions that previously felt paralyzingly risky now feel merely challenging. The danger is overconfidence: Rahu in the third can make you so bold that you forget to calculate the odds. Channel this energy into ventures where courage genuinely matters, and you will look back on these eighteen months as the period when you stopped hesitating and started doing.`,
        dosAndDonts: [
          'Do launch bold communication ventures — content, media, writing, public speaking',
          'Do take calculated risks on projects requiring nerve — your courage is at an eighteen-year peak',
          'Don\'t let boldness become recklessness — Rahu\'s courage needs Scorpio\'s strategic calculation',
          'Don\'t ignore sibling relationships — karmic debts are being settled in the 3rd house',
        ],
        remedy: 'Donate stationery and books to underprivileged students on Saturdays; wear a dark green thread on the right wrist',
      },
      // 9. Sagittarius (Dhanu) — Rahu in 2nd house
      {
        rashiId: 9,
        house: 2,
        headline: 'Unconventional Wealth and Disrupted Values',
        body: `Rahu transits your second house — the house of accumulated wealth, family, speech, and values. For Sagittarius Moon natives, this transit brings an unusual relationship with money: income may arrive from unexpected or unconventional sources — foreign earnings, digital assets, technology-driven income streams, or professions your family doesn't quite understand. Rahu in the second house doesn't care about traditional wealth-building; it finds money in the margins.

Your speech patterns shift. The expansive, philosophical Sagittarian voice acquires a more provocative, contrarian edge. You may find yourself saying things that surprise you — opinions that challenge consensus, language that is blunter than your usual diplomatic default. This can be powerfully effective in negotiations, sales, or any profession where directness creates trust. It can also alienate people who expect the familiar, affable Sagittarius. Watch the line between refreshing honesty and unnecessary provocation.

Family dynamics undergo karmic review. Your relationship with money, food, and the values you were raised with comes under scrutiny. You may discover that financial habits inherited from your family no longer serve you, or that dietary patterns you've followed since childhood need fundamental revision. The second house governs what you consume — food, information, substances — and Rahu here can create compulsive consumption patterns. The antidote is consciousness: notice what you are drawn to consume and ask whether it nourishes or merely fills.`,
        dosAndDonts: [
          'Do explore unconventional income streams — Rahu rewards innovation in the 2nd house',
          'Do examine your relationship with money and inherited financial habits',
          'Don\'t let provocative speech damage relationships you value — directness is useful, cruelty is not',
          'Don\'t develop compulsive eating, spending, or consumption habits — Rahu amplifies appetite',
        ],
        remedy: 'Donate food to the hungry on Saturdays; keep a coin from a foreign country in your wallet',
      },
      // 10. Capricorn (Makara) — Rahu in 1st house (LAGNA!)
      {
        rashiId: 10,
        house: 1,
        headline: 'Identity Upheaval — Rahu Over Your Head',
        body: `Rahu transits your first house — your own sign. For Capricorn Moon natives, this is the most personally disruptive transit in the eighteen-year Rahu cycle. Your identity, self-image, physical appearance, and the way the world perceives you undergo a transformation that feels both exhilarating and destabilizing. You are not the same person at the end of this transit as you were at the beginning, and the change is visible to everyone around you.

Your ambition reaches a fever pitch. Capricorn already carries the zodiac's most formidable work ethic; add Rahu's insatiable hunger and you become a force that is difficult to compete with or to live with. Career advancement comes, but at a cost measured in sleep, relationships, and inner peace. You may adopt a dramatically different personal style — a new look, a new public persona, or a complete rebranding that reflects who you are becoming rather than who you have been. People who knew you well may feel they no longer recognize you.

The first-house Rahu transit is fundamentally about authenticity versus persona. Rahu amplifies your public image, but the image it creates may not match your inner reality. The gap between how others see you and how you feel inside can become a source of existential anxiety. The resolution is not to suppress the transformation but to ensure it is rooted in genuine self-knowledge rather than mere ambition. The Capricorn natives who navigate this transit most successfully are the ones who use Rahu's energy to become more fully themselves — not a better-packaged version for public consumption, but a truer version that no longer needs packaging.`,
        dosAndDonts: [
          'Do embrace personal reinvention — Rahu in the 1st demands that you evolve, not just achieve',
          'Do maintain a grounding practice — meditation, exercise, time in nature — to counterbalance Rahu\'s intensity',
          'Don\'t lose yourself in the persona Rahu creates — stay connected to who you are beneath the ambition',
          'Don\'t neglect health — Rahu over the ascendant can bring mysterious or hard-to-diagnose conditions',
        ],
        remedy: 'Recite "Om Raam Rahave Namaha" 108 times daily; wear gomed (hessonite) after consulting an astrologer; donate dark blankets on Saturdays',
      },
      // 11. Aquarius (Kumbha) — Rahu in 12th house
      {
        rashiId: 11,
        house: 12,
        headline: 'Foreign Lands, Hidden Expenses, and Spiritual Obsession',
        body: `Rahu transits your twelfth house — the house of losses, foreign lands, isolation, sleep, and spiritual liberation. For Aquarius Moon natives, this is one of the more psychologically demanding Rahu placements. The twelfth house dissolves boundaries, and Rahu — a planet that feeds on intensity — finds itself in a space that demands surrender rather than conquest.

Foreign connections become dominant. You may relocate abroad, take an international assignment, or begin a relationship with someone from a distant culture. Immigration processes advance, though Rahu's involvement means nothing proceeds without complication. Expenditure increases, sometimes dramatically — medical bills, legal fees, travel costs, or financial obligations you didn't anticipate. The twelfth house does not steal from you; it redirects your resources toward things your soul needs more than your bank account does.

Sleep and dreams become vivid and occasionally disturbing. You may develop insomnia or, conversely, sleep excessively as an escape from waking intensity. Rahu in the twelfth can produce fascination with altered states — meditation, lucid dreaming, psychedelic experiences, or intense spiritual practice. The danger is escapism disguised as spirituality. Genuine twelfth-house work involves releasing control and accepting what comes; Rahu's obsessive nature wants to control even the release. The Aquarius natives who benefit most from this transit are the ones who learn to let go — of money, of outcomes, of the need to understand everything — and trust that what remains after Rahu's passage is what genuinely belongs to them.`,
        dosAndDonts: [
          'Do pursue international opportunities — Rahu in the 12th opens foreign doors',
          'Do invest in genuine spiritual practice — not as escapism but as honest inner work',
          'Don\'t resist necessary expenditures — fighting the 12th house creates more loss',
          'Don\'t use substances, excessive sleep, or "spiritual" experiences to avoid dealing with reality',
        ],
        remedy: 'Donate dark-colored cloth to ashrams or hospices on Saturdays; practice 20 minutes of silent meditation daily',
      },
      // 12. Pisces (Meena) — Rahu in 11th house
      {
        rashiId: 12,
        house: 11,
        headline: 'Amplified Gains and Unconventional Networks',
        body: `Rahu transits your eleventh house — the house of gains, income, social networks, and the fulfillment of desires. For Pisces Moon natives, this is among the most materially favorable Rahu placements. The eleventh house is an upachaya where Rahu operates with particular effectiveness, and the gains it produces tend to be substantial, unconventional, and slightly surprising in their origin.

Income increases through channels you hadn't planned for. Technology-driven revenue, foreign clients, unusual business models, or income from fields that didn't exist a few years ago — Rahu in the eleventh finds money at the frontier. Your social network expands dramatically, and the new connections are not your usual crowd. You meet people from different industries, cultures, and social strata who introduce you to opportunities your existing circle could never have provided.

Aspirations that have been dormant reactivate with Rahu's obsessive energy. A goal you set years ago — financial independence, a specific social position, a philanthropic ambition — suddenly feels achievable and urgent. The eleventh house fulfills desires, and Rahu amplifies both the desire and the fulfillment. The shadow side: Rahu's gains can be morally ambiguous. Money arrives, but the source or the method may not align with Pisces's naturally ethical instincts. The natives who navigate this transit best are those who maintain their moral compass while accepting that Rahu's gifts don't come in neat, conventional packages. Accept the abundance, but keep your ethics non-negotiable.`,
        dosAndDonts: [
          'Do expand your network aggressively — Rahu in the 11th rewards unconventional connections',
          'Do pursue ambitious financial goals — this is your strongest material window in the Rahu cycle',
          'Don\'t compromise ethical standards for material gain — Rahu tests your integrity through abundance',
          'Don\'t neglect old friends while chasing new networks — the 11th house values loyalty',
        ],
        remedy: 'Donate to technological or digital education initiatives on Saturdays; feed stray dogs near your home',
      },
    ],
    keyDates: [
      { date: '2026-12-06', event: 'Rahu enters Capricorn', significance: 'The transit begins. Career and institutional themes intensify immediately. The first three months set the tone for the entire eighteen-month period.' },
      { date: '2027-03-05', event: 'Solar eclipse in Pisces (Rahu-influenced)', significance: 'Rahu causes eclipses — this solar eclipse triggers sudden events related to your Rahu house placement. Decisions made near eclipses carry disproportionate long-term consequences.' },
      { date: '2027-05-15', event: 'Rahu-Saturn conjunction in Capricorn (approximate)', significance: 'Saturn transits its own sign while Rahu occupies it — doubled karmic pressure on career, structure, and institutional authority. A stress test for professional foundations.' },
      { date: '2027-09-17', event: 'Lunar eclipse in Pisces-Virgo axis', significance: 'Eclipse season reactivates Rahu\'s themes. Hidden matters surface; financial or relationship truths that were buried come to light.' },
      { date: '2028-03-01', event: 'Final direct station period before exit', significance: 'The last major activation window. Unresolved Rahu-in-Capricorn themes demand final attention. Career decisions made now have lasting consequences.' },
      { date: '2028-06-15', event: 'Rahu exits Capricorn, enters Sagittarius', significance: 'Transit ends. The career and authority themes that dominated eighteen months begin to settle. Integration phase begins — what you built under Rahu must now be maintained by your own effort.' },
    ],
  },

  'ketu-in-cancer-2026': {
    slug: 'ketu-in-cancer-2026',
    planetId: 8,
    fromSignId: 5,
    toSignId: 4,
    year: 2026,
    exactDate: '2026-12-06',
    endDate: '2028-06-15',
    duration: '~18 months (December 6, 2026 – June 2028)',
    publishDate: '2026-11-15',
    title: {
      en: 'Ketu in Cancer 2026–28: Effects on All 12 Moon Signs',
      hi: 'केतु कर्क राशि में 2026–28: सभी 12 चन्द्र राशियों पर प्रभाव',
    },
    metaDescription: {
      en: 'Ketu enters Cancer on December 6, 2026 — the Moon\'s sign of emotional security. Learn how this 18-month transit of spiritual detachment, family karma, and emotional liberation affects your Moon sign.',
      hi: 'केतु 6 दिसम्बर 2026 को कर्क राशि में प्रवेश करेगा — चन्द्रमा की भावनात्मक सुरक्षा की राशि में। जानें कि यह 18 माह का आध्यात्मिक वैराग्य का गोचर आपकी चन्द्र राशि को कैसे प्रभावित करेगा।',
    },
    overview: {
      en: `On December 6, 2026, Ketu — the south lunar node, the shadow planet of detachment, past-life wisdom, and spiritual liberation — enters Cancer, the Moon's own sign. This is one of the most emotionally challenging transits in the entire nodal cycle, because Ketu is the planet that severs attachment, and Cancer is the sign that lives for attachment. Home, mother, emotional security, nourishment, traditions, roots — everything Cancer holds sacred, Ketu examines with the dispassionate eye of a renunciant who has already moved beyond.

This does not mean you lose your home or your mother. Ketu is subtler than that. What it does is create a strange emotional distance from things that previously felt essential. The house that used to feel like a sanctuary starts feeling like a stage set. The comfort food that once soothed now tastes hollow. The family traditions you performed without thinking suddenly seem like rituals whose meaning has evaporated. Ketu in Cancer forces the question: do you cling to emotional security because it genuinely nourishes you, or because you are afraid of what lies on the other side of letting go?

The answer to that question is the spiritual gift of this transit. Ketu doesn't take things away to punish — it removes what you have outgrown so that something deeper can emerge. The Cancer native who has built an identity entirely around family, home, and emotional caretaking may find that identity dissolving — not because those things were wrong, but because they were incomplete. What replaces the old emotional scaffolding is a more resilient inner security that does not depend on external circumstances. You learn to feel at home inside yourself.

The last time Ketu occupied Cancer was approximately 2008–2009, the same period as the Rahu-in-Capricorn financial crisis. While Rahu was exposing institutional hollowness, Ketu was quietly teaching millions of people that emotional security cannot be found in material prosperity alone. The homes, families, and lifestyles that felt permanent were revealed as impermanent. The lesson was not despair but liberation: when you stop clinging, you discover that what truly matters cannot be taken from you.`,
      hi: `6 दिसम्बर 2026 को केतु — दक्षिण चन्द्र पात, वैराग्य, पूर्वजन्म ज्ञान और आध्यात्मिक मुक्ति का छाया ग्रह — कर्क राशि में प्रवेश करता है, चन्द्रमा की अपनी राशि। यह सम्पूर्ण राहु-केतु चक्र के सबसे भावनात्मक रूप से चुनौतीपूर्ण गोचरों में से एक है, क्योंकि केतु आसक्ति को काटने वाला ग्रह है, और कर्क वह राशि है जो आसक्ति के लिए जीती है। घर, माता, भावनात्मक सुरक्षा, पोषण, परम्पराएँ, जड़ें — जो कुछ भी कर्क पवित्र मानता है, केतु उसे एक संन्यासी की निर्लिप्त दृष्टि से परीक्षित करता है।

इसका अर्थ यह नहीं है कि आप अपना घर या अपनी माँ खो देंगे। केतु उससे अधिक सूक्ष्म है। यह उन चीज़ों से एक विचित्र भावनात्मक दूरी बनाता है जो पहले आवश्यक लगती थीं। जो घर कभी आश्रय लगता था वह एक मंच-सज्जा लगने लगता है। जो परम्पराएँ आप बिना सोचे निभाते थे वे अचानक ऐसे अनुष्ठान लगने लगते हैं जिनका अर्थ वाष्पित हो गया है।

इस प्रश्न का उत्तर ही इस गोचर का आध्यात्मिक उपहार है। केतु दण्डित करने के लिए नहीं छीनता — यह उसे हटाता है जिससे आप आगे बढ़ चुके हैं ताकि कुछ गहरा उभर सके। पुरानी भावनात्मक संरचना के स्थान पर एक अधिक सुदृढ़ आन्तरिक सुरक्षा आती है जो बाह्य परिस्थितियों पर निर्भर नहीं करती। आप अपने भीतर घर अनुभव करना सीखते हैं।

पिछली बार केतु कर्क में लगभग 2008-2009 में था — मकर में राहु के वैश्विक वित्तीय संकट का वही काल। जबकि राहु संस्थागत खोखलापन उजागर कर रहा था, केतु चुपचाप लाखों लोगों को सिखा रहा था कि भावनात्मक सुरक्षा केवल भौतिक समृद्धि में नहीं मिल सकती। जब आप चिपकना बन्द करते हैं, तो आप खोजते हैं कि जो वास्तव में महत्वपूर्ण है वह आपसे छीना नहीं जा सकता।`,
    },
    generalThemes: [
      { en: 'Emotional detachment from comfort zones — the things that used to feel like home begin to feel like limitations that must be outgrown', hi: 'सुविधा क्षेत्रों से भावनात्मक वैराग्य — जो चीज़ें घर जैसी लगती थीं वे सीमाएँ लगने लगती हैं जिन्हें पार करना आवश्यक है' },
      { en: 'Mother and family karma — unresolved patterns with mother figures surface for healing; the relationship shifts from dependency to conscious choice', hi: 'माता और पारिवारिक कर्म — माता-तुल्य व्यक्तियों के साथ अनसुलझे प्रतिरूप उपचार के लिए सामने आते हैं; सम्बन्ध निर्भरता से सचेत चुनाव में बदलता है' },
      { en: 'Spiritual breakthroughs through emotional pain — Ketu in Cancer produces its deepest insights precisely when comfort is withdrawn', hi: 'भावनात्मक पीड़ा के माध्यम से आध्यात्मिक सफलताएँ — कर्क में केतु अपनी गहनतम अन्तर्दृष्टि तब उत्पन्न करता है जब सुविधा वापस ले ली जाती है' },
      { en: 'Property and home changes — relocations, selling ancestral property, or a feeling that your current home no longer fits who you are becoming', hi: 'सम्पत्ति और गृह परिवर्तन — स्थानान्तरण, पैतृक सम्पत्ति बेचना, या यह अनुभव कि वर्तमान घर अब आपके बनते व्यक्तित्व से मेल नहीं खाता' },
      { en: 'Past-life emotional patterns completing — relationships and attachments that feel "ancient" reach their natural conclusion', hi: 'पूर्वजन्म के भावनात्मक प्रतिरूपों का पूर्ण होना — जो सम्बन्ध और आसक्तियाँ "प्राचीन" लगती हैं वे अपने स्वाभाविक अन्त पर पहुँचती हैं' },
      { en: 'Intuition sharpens as emotional noise quiets — Ketu in Cancer strips away sentimental confusion and reveals what you truly feel versus what you think you should feel', hi: 'भावनात्मक शोर शान्त होने पर अन्तर्ज्ञान तीव्र होता है — कर्क में केतु भावुक भ्रम को हटाता है और प्रकट करता है कि आप वास्तव में क्या अनुभव करते हैं' },
    ],
    moonSignEffects: [
      // 1. Aries (Mesha) — Ketu in 4th house
      {
        rashiId: 1,
        house: 4,
        headline: 'Letting Go of False Security',
        body: `Ketu transits your fourth house — the house of home, mother, inner peace, and emotional foundations. For Aries Moon natives, this transit creates a peculiar sense of estrangement from your own comfort zones. The apartment that felt perfect last year now feels like a cage. The family routines that once anchored you start to feel performative. Something inside you is outgrowing its container, and the container is your emotional life.

This is not a transit of catastrophic loss — it is a transit of quiet release. You may relocate, sell a property, or simply redecorate in a way that signals a new chapter. Your relationship with your mother enters a phase where old roles dissolve. The dynamic that defined your childhood — whether it was warmth, conflict, dependency, or distance — loosens its grip. This can feel like loss, but it is actually liberation. You are being freed to relate to your mother as an adult, not as a child replaying ancient scripts.

The inner dimension is the most important. Ketu in the fourth strips away the emotional padding that Aries uses to avoid stillness. You may find meditation easier than ever — not because your mind quiets, but because the things that used to disturb your peace simply matter less. Academic focus improves paradoxically: by caring less about results, you study with more genuine absorption. The key to navigating this transit is to let go willingly. What Ketu takes by force is painful; what you release consciously is liberating.`,
        dosAndDonts: [
          'Do let go of living situations that no longer serve your growth — Ketu rewards conscious release',
          'Do invest in meditation and inner work — the fourth house is the seat of the soul, and Ketu deepens access',
          'Don\'t cling to nostalgic attachment — Ketu in the 4th is asking you to outgrow, not to mourn',
          'Don\'t suppress the grief that arises — feel it fully, then let it pass',
        ],
        remedy: 'Offer milk to a Shiva lingam on Mondays; keep a small silver item at home for lunar stability',
      },
      // 2. Taurus (Vrishabha) — Ketu in 3rd house
      {
        rashiId: 2,
        house: 3,
        headline: 'Effortless Courage and Quiet Mastery',
        body: `Ketu transits your third house — the house of courage, communication, siblings, and initiative. For Taurus Moon natives, this is one of the more manageable Ketu placements. The third house is an upachaya, and Ketu here operates with a kind of detached mastery — you find yourself performing acts of courage or communication without the usual anxiety, not because you have conquered fear but because Ketu has made the stakes feel less personal.

Your communication style shifts toward economy and precision. Where you might normally deliberate at length before speaking, Ketu in the third produces a stripped-down directness that surprises you. You say what needs to be said without embellishment. In writing, your prose becomes leaner. In negotiations, you find yourself less attached to outcomes, which paradoxically makes you more effective. The counterpart who expects you to be emotionally invested encounters a calm they don't know how to handle.

Sibling relationships carry a karmic completion quality. You may feel less emotionally entangled with a brother or sister — not in a cold way, but in a way that acknowledges the relationship without being defined by it. Short trips decrease or become less eventful. Skills you developed in past lives may surface with surprising fluency — a musical instrument feels familiar the first time you pick it up, a craft comes naturally, or a foreign language clicks faster than it should.`,
        dosAndDonts: [
          'Do trust the skills that arise spontaneously — Ketu in the 3rd activates past-life competence',
          'Do communicate with directness — Ketu removes the need for diplomatic padding',
          'Don\'t force yourself to be more social or communicative than feels natural — Ketu values economy',
          'Don\'t ignore a sibling who reaches out — karmic threads deserve conscious acknowledgment',
        ],
        remedy: 'Donate to animal shelters on Tuesdays; recite Ganesh mantra for clarity in communication',
      },
      // 3. Gemini (Mithuna) — Ketu in 2nd house
      {
        rashiId: 3,
        house: 2,
        headline: 'Detachment from Material Security',
        body: `Ketu transits your second house — the house of wealth, family, speech, and values. For Gemini Moon natives, this is a transit that loosens your grip on financial security and inherited values — not by taking things away, but by making you question why you held them so tightly. The savings account that represented safety starts to feel like a number. The family traditions that defined your identity start to feel like someone else's choices that you adopted without examination.

Financial patterns shift. Income may become irregular — not necessarily reduced, but less predictable. You spend on things that don't make logical sense: a spiritual retreat, a charitable donation that exceeds your usual comfort zone, an experience rather than an asset. Ketu in the second is teaching you that security is an inner state, not an account balance. This is genuinely disorienting for a sign that processes the world through information and logic. The lesson is not to become financially reckless but to notice how much emotional weight you have placed on material certainty.

Your speech becomes unusually quiet or detached. The witty, verbose Gemini voice tones down. You find yourself speaking less but meaning more. In social situations, you may feel like an observer rather than a participant — present but not performing. Family meals and gatherings lose their charge; you attend, but the emotional investment is lighter. The gift hidden in this discomfort is clarity: when you stop needing family approval, you can finally see your family as they are, and love them freely.`,
        dosAndDonts: [
          'Do examine your relationship with money — are you saving from wisdom or from fear?',
          'Do simplify your diet and consumption habits — Ketu in the 2nd rewards austerity',
          'Don\'t panic at financial irregularity — Ketu teaches that true security is internal',
          'Don\'t cut off family communication — detachment means freedom, not abandonment',
        ],
        remedy: 'Donate food to the elderly on Tuesdays; recite "Om Namah Shivaya" 108 times daily',
      },
      // 4. Cancer (Karka) — Ketu in 1st house (LAGNA!)
      {
        rashiId: 4,
        house: 1,
        headline: 'The Great Dissolution — Ketu Over Your Identity',
        body: `Ketu transits your first house — your own sign. For Cancer Moon natives, this is the most personally transformative transit in the entire eighteen-year Ketu cycle. While Rahu in Capricorn drives your seventh house toward obsessive partnership, Ketu over your head dissolves the very sense of self you have constructed around emotional security, caretaking, and belonging.

Your self-image becomes unfamiliar. The person you see in the mirror looks the same, but something behind the eyes has shifted. You feel less defined by your emotions — the mood swings that once seemed central to your identity flatten out. This is not depression; it is Ketu's detachment working on the most fundamental level. You are being separated from an outdated version of yourself so a truer version can emerge. The process is disorienting, and it is also profoundly liberating.

Physical health may present with vague, hard-to-diagnose symptoms. Ketu in the first house creates disconnection between mind and body — you may ignore physical signals because you feel detached from the body itself. This is the one area where Ketu's detachment is genuinely dangerous: pay attention to health symptoms even when they don't feel urgent. Spiritually, this is the most productive transit you can experience. Meditation deepens effortlessly. Past-life memories or intuitive flashes arrive without warning. You discover that beneath the personality you assembled from family conditioning and emotional habit, there is a quieter, vaster self that has been waiting.`,
        dosAndDonts: [
          'Do embrace the identity shift — resistance prolongs the discomfort, surrender accelerates the growth',
          'Do establish a daily spiritual practice — Ketu in the 1st is the most powerful meditation transit possible',
          'Don\'t ignore health symptoms — Ketu creates mind-body disconnection that can mask illness',
          'Don\'t cling to the old self-image — it is being replaced, not destroyed',
        ],
        remedy: 'Worship Lord Ganesha on Tuesdays; wear cat\'s eye (lehsunia) only after consulting an experienced astrologer; donate to spiritual organizations',
      },
      // 5. Leo (Simha) — Ketu in 12th house
      {
        rashiId: 5,
        house: 12,
        headline: 'Spiritual Liberation and the Surrender of Ego',
        body: `Ketu transits your twelfth house — the house of moksha, foreign lands, isolation, and the dissolution of material identity. For Leo Moon natives, this is a profoundly spiritual transit, though it may not feel that way at first. Ketu is the planet of liberation, and the twelfth house is the house of liberation. Together, they create a double-dose of dissolution that can feel like losing your footing — or like being released from chains you didn't know you were wearing.

Expenditure increases in ways that feel meaningful rather than wasteful. You may spend on pilgrimages, retreats, charitable work, or healing treatments for yourself or others. Money that flows out during this transit tends to generate karmic returns that are invisible to accounting but palpable to the soul. Foreign connections deepen — you may feel more at home in another country than in the place you were born.

Sleep and dreams become a primary channel of insight. You may experience dreams that feel like memories — not fantasies but recollections of experiences that seem to predate this lifetime. Meditation becomes not just a practice but a need, like breathing. Leo's natural desire for recognition and applause quiets. You find yourself less interested in performing for an audience and more interested in understanding who you are when no one is watching. This is Ketu's deepest gift in the twelfth: it liberates you from the tyranny of needing to be seen, and reveals that the self that observes is more real than the self that performs.`,
        dosAndDonts: [
          'Do invest seriously in spiritual practice — this is the most naturally moksha-oriented transit you can receive',
          'Do accept foreign or isolating experiences as growth opportunities',
          'Don\'t fight the pull toward solitude — Leo needs to learn that alone is not lonely',
          'Don\'t spend recklessly, but don\'t resist spending that genuinely serves spiritual growth',
        ],
        remedy: 'Donate to ashrams or monasteries on Tuesdays; practice silence for one hour daily; visit a pilgrimage site',
      },
      // 6. Virgo (Kanya) — Ketu in 11th house
      {
        rashiId: 6,
        house: 11,
        headline: 'Detachment from Gains and Social Ambition',
        body: `Ketu transits your eleventh house — the house of gains, income, social networks, and the fulfillment of desires. For Virgo Moon natives, this transit creates a curious relationship with success: the gains arrive, but the satisfaction doesn't. You achieve goals you set years ago and feel a flatness where you expected elation. This is not failure — it is Ketu teaching you that fulfillment does not live where you have been looking for it.

Income may become irregular or arrive from unexpected, unconventional sources. Your social network shifts: old connections lose their relevance, and new ones feel meaningful but impermanent. You may withdraw from professional associations, social media, or networking events that previously felt essential to your career. This withdrawal is not self-sabotage; it is a recalibration. Ketu in the eleventh asks whether your social life serves your growth or merely your anxiety about being left out.

Elder siblings or older friends may play a less prominent role in your life — not through conflict but through a natural drifting apart that both parties accept. Long-held aspirations complete in a muted way: the goal is achieved, the checkbox is ticked, and you realize the wanting was more vivid than the having. This transit's purpose is not to make you indifferent to success but to free you from the compulsive need for it. When you stop needing external validation, you discover what you actually want — and it is usually simpler, quieter, and more genuine than the ambitious targets Virgo habitually sets.`,
        dosAndDonts: [
          'Do let go of social obligations that drain more than they nourish',
          'Do examine your aspirations — which ones are genuinely yours, and which did you absorb from others?',
          'Don\'t interpret reduced social engagement as failure — Ketu in the 11th is a conscious simplification',
          'Don\'t abandon financial discipline — irregular income requires more careful management, not less',
        ],
        remedy: 'Donate to elderly care organizations on Tuesdays; offer sesame seeds to a sacred fire',
      },
      // 7. Libra (Tula) — Ketu in 10th house
      {
        rashiId: 7,
        house: 10,
        headline: 'Career Detachment and the Search for Meaning',
        body: `Ketu transits your tenth house — the house of career, public reputation, and authority. For Libra Moon natives, this is one of the more professionally disorienting transits in the Ketu cycle. The tenth house defines how the world sees you, and Ketu here creates a disconnect between your professional persona and your inner truth. You may achieve career milestones during this period and feel nothing — or you may lose interest in a career that once defined you.

Professional recognition becomes less motivating. Promotions, titles, and public acknowledgment arrive or recede, but neither triggers the emotional response you expect. This is not burnout — it is Ketu dissolving your attachment to career identity. The Libra native who has built an entire self-concept around professional accomplishment finds that the concept is being quietly dismantled. What replaces it is a more authentic relationship with work: you do it because it matters, not because it proves you matter.

Your relationship with authority figures — bosses, mentors, government — becomes less charged. Where you might previously have been anxious about their approval or resentful of their power, Ketu creates equanimity. You neither seek their blessing nor fear their judgment. This detachment can be professionally useful — colleagues and superiors respond differently to someone who is genuinely unattached to outcomes. Paradoxically, career advancement sometimes accelerates when you stop trying so hard.`,
        dosAndDonts: [
          'Do let go of career goals that no longer align with your genuine values',
          'Do consider whether your current professional path reflects who you are or who you were told to be',
          'Don\'t make impulsive career changes during Ketu\'s transit — detachment is not the same as rejection',
          'Don\'t ignore professional obligations just because they feel less meaningful — fulfill commitments, then reassess',
        ],
        remedy: 'Donate to veterans or public service organizations on Tuesdays; practice karma yoga — work without attachment to results',
      },
      // 8. Scorpio (Vrishchika) — Ketu in 9th house
      {
        rashiId: 8,
        house: 9,
        headline: 'Questioning Dharma and the Guru Within',
        body: `Ketu transits your ninth house — the house of dharma, fortune, father, guru, and higher learning. For Scorpio Moon natives, this transit creates a philosophical earthquake. The ninth house holds your beliefs about meaning, justice, and cosmic order — and Ketu does not leave beliefs unexamined. Faith that was inherited rather than earned comes under intense scrutiny. The guru you followed without question now seems more human than divine. The religious practices that once provided comfort now feel hollow unless you reinvest them with conscious intention.

This is not a loss of faith — it is its refinement. Ketu in the ninth strips away spiritual materialism, guru dependency, and philosophical certainty that substitutes for genuine understanding. What remains after the stripping is leaner, more honest, and infinitely more durable. You may leave a spiritual community, break with a teacher, or simply stop performing religious rituals mechanically. Each of these is a graduation, not a failure.

Your relationship with your father enters a phase of karmic resolution. Old grievances may dissolve — not through dramatic confrontation but through a quiet realization that holding onto them no longer serves you. Long-distance travel may decrease, or it may increase but feel less transformative than you expected. Academic pursuits carry a detached quality: you study not for credentials or social standing but because the subject genuinely interests you. Fortune becomes irregular — luck is present but unpredictable, as though the universe is teaching you to act without relying on favorable outcomes.`,
        dosAndDonts: [
          'Do question beliefs and practices that feel performative — Ketu rewards genuine seeking over habitual devotion',
          'Do allow your relationship with your father to evolve naturally — forcing resolution is counterproductive',
          'Don\'t abandon all spiritual practice — refine it, don\'t discard it',
          'Don\'t mistake Ketu\'s skepticism for nihilism — questioning faith is the first step toward deeper faith',
        ],
        remedy: 'Read sacred texts with fresh eyes on Tuesdays — not for answers but for better questions; donate religious books to libraries',
      },
      // 9. Sagittarius (Dhanu) — Ketu in 8th house
      {
        rashiId: 9,
        house: 8,
        headline: 'Transformation Without Drama',
        body: `Ketu transits your eighth house — the house of transformation, hidden knowledge, longevity, and sudden change. For Sagittarius Moon natives, this is one of the more mystically potent Ketu placements. The eighth house is the domain of secrets, death and rebirth, and occult knowledge, and Ketu — a planet that has already "been there" in past lives — navigates this territory with eerie familiarity.

Transformation happens, but without the melodrama that the eighth house usually brings. Where Rahu in the eighth produces crises that force change, Ketu produces a quiet shedding — old identities fall away like dry leaves, and you barely notice until you look back and realize you are fundamentally different. Psychological patterns that have driven you for decades lose their power. Fears that once paralyzed you become manageable, not because you conquered them but because they simply stopped mattering.

Research, occult studies, and deep psychological work are unusually productive. You may develop intuitive abilities — a sense for hidden dynamics in relationships or situations that proves uncannily accurate. Financial matters involving others (inheritance, insurance, joint accounts) resolve with less friction than expected. Health-wise, Ketu in the eighth provides a strange protection: crisis is averted not through dramatic intervention but through quiet course-correction. The Sagittarius tendency to expand and reach outward gives way, temporarily, to a deeper inward exploration that produces wisdom your sign typically seeks in books and foreign lands but finds, during this transit, inside your own psyche.`,
        dosAndDonts: [
          'Do pursue occult studies, depth psychology, or meditation practices that involve inner exploration',
          'Do allow old identities and fears to dissolve without trying to replace them immediately',
          'Don\'t ignore recurring health patterns — Ketu in the 8th resolves gently, but only if you pay attention',
          'Don\'t resist the quieting of your normally expansive energy — the inward turn is temporary and productive',
        ],
        remedy: 'Recite Maha Mrityunjaya Mantra on Tuesdays; donate to hospice or end-of-life care organizations',
      },
      // 10. Capricorn (Makara) — Ketu in 7th house
      {
        rashiId: 10,
        house: 7,
        headline: 'Partnership Karma and Detached Relating',
        body: `Ketu transits your seventh house — the house of marriage, partnerships, and one-to-one relationships. For Capricorn Moon natives, this transit creates emotional distance in your closest partnerships — not hostility or abandonment, but a pervasive sense that you and your partner are operating on different frequencies. While Rahu in your first house pushes you toward personal reinvention, Ketu in the seventh loosens the relational bonds you have relied on for stability.

If you are married, your spouse may seem less central to your daily experience. You still love them, but the emotional charge of the relationship dims. Conversations that once felt intimate become functional. This is not a signal to end the marriage — it is Ketu teaching you that your partner is a companion, not a life support system. The relationships that survive this transit emerge stronger because they are built on genuine choice rather than emotional dependency.

For single Capricorn natives, this transit can make partnership feel less urgent. The drive to find a mate quiets, and you discover that being alone is not the emergency your culture told you it was. New relationships that begin during Ketu in the seventh often carry a karmic, past-life quality — the person feels familiar in a way that defies the brevity of your acquaintance. Business partnerships may dissolve or restructure during this period, usually without rancor. The key to this transit is non-attachment: hold your partnerships lightly, love fully, and accept that Ketu is teaching both you and your partner to stand independently before standing together.`,
        dosAndDonts: [
          'Do give your partner space — Ketu in the 7th asks for independence within intimacy',
          'Do examine whether you stay in partnerships from genuine love or from fear of being alone',
          'Don\'t mistake Ketu\'s detachment for a mandate to end relationships — distance is not rejection',
          'Don\'t start new business partnerships without very clear terms — Ketu creates ambiguity in the 7th',
        ],
        remedy: 'Worship Lord Shiva and Parvati together on Mondays for partnership harmony; donate white items to couples in need',
      },
      // 11. Aquarius (Kumbha) — Ketu in 6th house
      {
        rashiId: 11,
        house: 6,
        headline: 'Effortless Victory and Dissolving Enemies',
        body: `Ketu transits your sixth house — the house of enemies, disease, debt, and daily work. For Aquarius Moon natives, this is one of the most favorable Ketu placements in the entire cycle. The sixth house is where obstacles live, and Ketu — the planet of dissolution — dissolves them with minimal effort. Enemies lose interest in opposing you. Health issues that have been chronic quietly improve. Debts become manageable or are cleared through unexpected means.

The mechanism is characteristically Ketu: nothing dramatic happens. Your workplace rival doesn't confront you — they simply stop being relevant. The chronic pain you have carried for years doesn't vanish overnight — it gradually fades until one day you realize it has been weeks since you noticed it. Legal disputes settle without the courtroom drama you anticipated. Ketu in the sixth wins not through force but through rendering opposition irrelevant.

Your daily work routine undergoes a spiritual recalibration. Tasks that once felt burdensome now feel neutral — you do them without the emotional charge that makes work feel like suffering. This detachment from daily grind is not apathy; it is Ketu showing you that most of what you consider "struggle" is actually resistance you create with your own emotional investment. Service work — helping the sick, the poor, or those in distress — becomes unexpectedly fulfilling. Ketu in the sixth excels at selfless service because the self is already quiet.`,
        dosAndDonts: [
          'Do let enemies and obstacles dissolve naturally — Ketu in the 6th does not require aggressive action',
          'Do address chronic health issues with alternative or holistic approaches — Ketu responds to subtle healing',
          'Don\'t create new conflicts during this transit — Ketu dissolves existing enemies but doesn\'t protect against new ones',
          'Don\'t resist the simplification of your daily routine — less struggle does not mean less meaning',
        ],
        remedy: 'Feed stray animals on Tuesdays; donate to medical charities; recite "Om Ketave Namaha" 108 times',
      },
      // 12. Pisces (Meena) — Ketu in 5th house
      {
        rashiId: 12,
        house: 5,
        headline: 'Detached Creativity and Children\'s Karma',
        body: `Ketu transits your fifth house — the house of creativity, children, romance, and past-life merit. For Pisces Moon natives, this transit strips your creative process of its usual emotional intensity and replaces it with something cleaner — a creativity that arises from emptiness rather than from feeling. The results can be genuinely remarkable: art, writing, or problem-solving that is uncannily precise because it is uncontaminated by the artist's ego.

Your relationship with children shifts. If you have children, you may feel less emotionally entangled with their outcomes — their grades, their choices, their moods — which paradoxically makes you a better parent. You offer guidance without anxiety, support without control, love without possession. If you are trying to conceive, Ketu in the fifth can create delays or detours — adoption, fertility treatments, or a pregnancy that arrives at an unexpected time. The karmic dimension is unmistakable: children who arrive or become prominent during this transit carry past-life significance.

Romance loses its usual intensity. New relationships lack the consuming passion that Pisces typically craves, feeling instead like calm, companionable connections. This can disappoint if you measure love by its voltage, but Ketu is teaching you that the quietest love is often the most real. Speculative ventures lose their appeal — the stock market, gambling, or high-risk investments feel less interesting, which is actually Ketu protecting you from losses. The creative and romantic detachment of this transit is not numbness; it is the stillness from which genuine inspiration and genuine love eventually emerge.`,
        dosAndDonts: [
          'Do create from a place of emptiness rather than emotional urgency — the results will be your most original work',
          'Do parent with detachment — which is not the same as indifference but means trusting your children\'s paths',
          'Don\'t speculate or gamble during this transit — Ketu in the 5th removes the instinct that keeps you safe',
          'Don\'t chase romantic intensity — accept quieter connections as potentially deeper ones',
        ],
        remedy: 'Recite Saraswati mantra on Tuesdays; donate to children\'s welfare organizations; offer sesame oil lamps at a Ketu shrine',
      },
    ],
    keyDates: [
      { date: '2026-12-06', event: 'Ketu enters Cancer', significance: 'The transit begins simultaneously with Rahu entering Capricorn. Emotional detachment themes activate across all Moon signs. The first three months establish the karmic patterns that will play out over eighteen months.' },
      { date: '2027-03-05', event: 'Solar eclipse in Pisces (nodal axis activated)', significance: 'Eclipses intensify Ketu\'s dissolving effect. Family secrets may surface, emotional patterns reach a breaking point, and spiritual breakthroughs become possible for those who have been doing inner work.' },
      { date: '2027-06-20', event: 'Ketu conjunct Moon in Cancer (approximate)', significance: 'The most emotionally intense point of the transit. Moon-Ketu conjunction triggers deep emotional purging — old grief, childhood patterns, and mother-related karma surface with unusual clarity.' },
      { date: '2027-09-17', event: 'Lunar eclipse on Pisces-Virgo axis', significance: 'Second eclipse season reactivates Ketu\'s themes. What was released in March now shows its consequences — usually more positive than anticipated.' },
      { date: '2028-03-15', event: 'Final activation before Ketu exits Cancer', significance: 'Last major window for completing emotional and family karma. Relationships and attachments that have been slowly releasing reach their final form.' },
      { date: '2028-06-15', event: 'Ketu exits Cancer, enters Gemini', significance: 'Transit ends. The emotional detachment that dominated eighteen months begins to integrate. You discover what remains when Ketu\'s dissolution is complete — and it is usually more than you feared and less than you clung to.' },
    ],
  },
};

/** Get all published article slugs (for sitemap and index pages) */
export function getTransitArticleSlugs(): string[] {
  return Object.keys(TRANSIT_ARTICLES);
}

/** Find article slug for a specific planet → sign transit (if published) */
export function findArticleSlug(planetId: number, toSignId: number): string | null {
  for (const [slug, article] of Object.entries(TRANSIT_ARTICLES)) {
    if (article.planetId === planetId && article.toSignId === toSignId) return slug;
  }
  return null;
}

/** Get the Moon-sign effect for a specific rashi from an article */
export function getMoonSignEffect(slug: string, rashiId: number): MoonSignEffect | null {
  const article = TRANSIT_ARTICLES[slug];
  if (!article) return null;
  return article.moonSignEffects.find(e => e.rashiId === rashiId) || null;
}
