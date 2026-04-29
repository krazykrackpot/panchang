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
