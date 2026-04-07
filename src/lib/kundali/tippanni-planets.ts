// Planet-in-house implications and prognosis data
// Adds depth beyond the base descriptions in interpretations.ts

// Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu

interface HouseImplication {
  implications: string;
  prognosis: string;
}

// Implications: practical life effects | Prognosis: what to expect over time
export const PLANET_HOUSE_DEPTH: Record<number, Record<number, HouseImplication>> = {
  // SUN
  0: {
    1: { implications: 'Government connections benefit you. Father is influential. Leadership roles come naturally but ego conflicts with authority figures possible.', prognosis: 'Career peaks in mid-30s through bold leadership. Government recognition likely. Health stays robust if ego is managed.' },
    2: { implications: 'Family wealth tied to government or authority. Speech carries power. Dietary discipline important for health.', prognosis: 'Wealth accumulates steadily through authoritative positions. Family leadership role strengthens after 30.' },
    3: { implications: 'Strong willpower drives communication success. Siblings respect you. Short travels for official purposes beneficial.', prognosis: 'Writing and media success after early career. Courage increases with age. Younger siblings prosper under your guidance.' },
    4: { implications: 'Property through government connections. Mother is proud but relationship may have power dynamics. Inner authority develops through domestic stability.', prognosis: 'Property acquisition peaks 35-45. Domestic happiness improves with emotional maturity. Mother\'s health needs attention after 50.' },
    5: { implications: 'Children are source of pride. Creative intelligence is exceptional. Speculation may succeed through informed confidence.', prognosis: 'First child brings great joy. Creative projects succeed in 30s-40s. Romance leads to meaningful partnerships.' },
    6: { implications: 'Victory over competition through authority. Service career in government or leadership. Health recovers through willpower.', prognosis: 'Rivals and obstacles overcome by age 35. Health challenges in 40s require attention. Service brings recognition and authority.' },
    7: { implications: 'Spouse is strong-willed. Business partnerships with authority figures possible but ego balance critical. Public image is commanding.', prognosis: 'Marriage requires mutual respect and space. Business partnerships succeed after learning compromise. Public reputation strengthens with age.' },
    8: { implications: 'Transformation through authority challenges. Hidden knowledge and research abilities. Inheritance matters involve father or government.', prognosis: 'Major life transformation 28-35. Research career deepens after initial struggles. Longevity favored through disciplined living.' },
    9: { implications: 'Father is wise mentor. Higher education in prestigious institutions. Spiritual authority develops naturally.', prognosis: 'Recognition as teacher or guide by 40s. Foreign travel brings wisdom and honors. Father\'s legacy shapes your path.' },
    10: { implications: 'This is one of the strongest placements for career success. Public recognition, fame, and authority positions are natural. Government service brings distinction.', prognosis: 'Major career peaks 35-50. National or international recognition possible. Fame grows throughout career. Professional legacy endures.' },
    11: { implications: 'Powerful friends and networking. Gains through government connections. Elder siblings are supportive. Social ambitions fulfilled.', prognosis: 'Financial goals achieved through connections. Social circle expands with status. Major gains after 35 through influential network.' },
    12: { implications: 'Spiritual growth through ego dissolution. Foreign residence possible for career. Expenses on righteous causes.', prognosis: 'Spiritual awakening deepens after 40. Foreign opportunities may require sacrifice. Liberation through selfless service.' },
  },
  // MOON
  1: {
    1: { implications: 'Highly sensitive to environment. Public-facing roles suit you. Emotional intelligence is your superpower. Popularity through nurturing presence.', prognosis: 'Emotional maturity brings increasing social success. Public career peaks 30-40. Popularity grows throughout life.' },
    2: { implications: 'Fluctuating finances tied to emotions. Family life is emotionally rich but variable. Voice and speech carry emotional depth.', prognosis: 'Financial stability improves after learning emotional discipline. Family bonds deepen with age. Creative expression through voice or writing.' },
    3: { implications: 'Frequent short journeys. Emotional courage guides decisions. Adaptable mind learns quickly. Sibling bonds are emotionally deep.', prognosis: 'Communication career flourishes after 25. Travel increases in 30s. Emotional intelligence becomes professional asset.' },
    4: { implications: 'Very powerful placement — deep contentment, comfortable home, loving mother. Emotional security is foundation of all success.', prognosis: 'Domestic happiness grows throughout life. Property acquisition favored. Mother is lifelong source of support and wisdom.' },
    5: { implications: 'Emotionally creative and intuitive. Strong bonding with children. Romance driven by deep feelings. Intuition guides speculation successfully.', prognosis: 'Creative peak in 30s. Children bring emotional fulfillment. Romantic life deepens with emotional maturity.' },
    6: { implications: 'Emotional health challenges from stress. Service to others provides emotional healing. Maternal figures in workplace.', prognosis: 'Health improves through emotional healing practices. Service career brings inner peace. Enemies resolved through emotional intelligence.' },
    7: { implications: 'Marriage partner is nurturing and emotionally attuned. Partnerships based on emotional connection. Public dealings influenced by empathy.', prognosis: 'Marriage brings emotional security. Partnership success through emotional understanding. Public popularity through empathetic approach.' },
    8: { implications: 'Deep emotional intensity. Psychic sensitivity and interest in occult. Transformative emotional experiences reshape identity.', prognosis: 'Major emotional transformation 28-32. Psychic abilities develop with age. Research into hidden matters brings insight.' },
    9: { implications: 'Spiritual devotion through emotional connection. Mother is spiritual guide. Long journeys over water likely.', prognosis: 'Spiritual depth increases with age. Foreign travel brings emotional growth. Philosophy and religion become central after 35.' },
    10: { implications: 'Career involves public interaction and emotional connection. Fame through nurturing or caregiving roles. Political career through popular appeal.', prognosis: 'Public career peaks 30-45. Popularity fluctuates with emotional expression. Lasting fame through genuine care for others.' },
    11: { implications: 'Emotional fulfillment through social connections. Gains through women and public dealings. Supportive friend circle.', prognosis: 'Social circle brings emotional and financial support. Major wishes fulfilled through persistent effort. Elder siblings provide guidance.' },
    12: { implications: 'Rich inner life and vivid dreams. Foreign settlement possible. Spending on comfort and spiritual pursuits. Psychic abilities strong.', prognosis: 'Spiritual life deepens through solitude and meditation. Foreign connections bring growth. Inner peace achieved through letting go.' },
  },
  // MARS
  2: {
    1: { implications: 'Athletic build and competitive spirit. Quick to act, sometimes recklessly. Leadership through action. Physical vitality is exceptional.', prognosis: 'Energy channeled productively brings career success by 30. Physical prowess maintained through exercise. Impulsiveness decreases with maturity.' },
    2: { implications: 'Aggressive earning capacity. Speech can be harsh. Family conflicts possible but fierce protectiveness toward family.', prognosis: 'Wealth built through effort and courage. Speech softens with age. Family leadership role develops naturally.' },
    3: { implications: 'Excellent for valor and adventurous pursuits. Strong, supportive siblings. Bold communication style gets results.', prognosis: 'Career in competitive fields peaks 28-40. Sibling relationships strengthen with time. Adventure travel brings growth.' },
    4: { implications: 'Energy in domestic life but possible property disputes. Real estate dealings are active. Relationship with mother may be intense.', prognosis: 'Property acquisition through effort 30-45. Domestic peace improves after resolving control issues. Vehicle acquisition favorable.' },
    5: { implications: 'Competitive intelligence. Athletic or strong-willed children. Risk-taking in speculation. Technical education favored.', prognosis: 'Children show strong personalities early. Speculation success through calculated risks. Creative projects succeed through bold execution.' },
    6: { implications: 'Powerful placement for defeating enemies and overcoming obstacles. Excellent for military, surgery, or competitive careers.', prognosis: 'Rivals completely overcome by age 35. Career success in competitive fields. Health improves through vigorous exercise.' },
    7: { implications: 'Manglik Dosha — energetic spouse but requires patience in marriage. Passion is strong in partnerships. Business partnerships need careful management.', prognosis: 'Marriage succeeds with a strong, independent partner. Passion sustains relationship. Business partnerships thrive with clear boundaries.' },
    8: { implications: 'Risk of accidents, surgery, or sudden events. Strong research abilities. Interest in martial arts and occult. Inheritance disputes possible.', prognosis: 'Health caution needed 28-35. Research career deepens. Inheritance matters resolve eventually. Longevity through careful living.' },
    9: { implications: 'Active defense of beliefs. Father may be in military or sports. Courage in long journeys. Vigorous philosophical debates.', prognosis: 'Foreign travel brings success. Father\'s legacy involves action and courage. Spiritual warrior path develops after 35.' },
    10: { implications: 'Powerful career achievement through courage and effort. Military, police, engineering, surgery, sports management are ideal.', prognosis: 'Career peaks 30-45 through bold action. Authority positions through merit. Professional reputation as decisive leader.' },
    11: { implications: 'Gains through courage and competitive effort. Energetic friend circle. Ambitious goals achieved through bold action.', prognosis: 'Financial gains accelerate through competitive success. Friend circle includes warriors and leaders. Major ambitions fulfilled by 40.' },
    12: { implications: 'Expenses through conflict or foreign residence. Hidden enemies require vigilance. Energy directed toward spiritual practices.', prognosis: 'Foreign residence likely after 30. Spiritual martial arts bring transformation. Hidden enemies neutralized through awareness.' },
  },
  // MERCURY
  3: {
    1: { implications: 'Youthful appearance and communicative personality. Multi-talented and witty. Adaptability is your greatest asset.', prognosis: 'Communication-based career flourishes early. Lifelong learning keeps you young. Multiple skill sets open diverse opportunities.' },
    2: { implications: 'Wealth through intellect and communication. Clever, persuasive speech. Family values education highly.', prognosis: 'Financial gains through intellectual work increase with time. Speaking and writing abilities become income sources. Family business involves communication.' },
    3: { implications: 'Very strong placement — excellent communication, writing talent, and harmonious sibling relationships. Short travels for learning.', prognosis: 'Writing or media career peaks 25-40. Sibling relationships are assets. Communication skills become your brand.' },
    4: { implications: 'Educated home environment. Intellectual interests in domestic setting. Real estate transactions favorable.', prognosis: 'Home-based intellectual pursuits bring satisfaction. Property dealings succeed through negotiation. Education continues throughout life.' },
    5: { implications: 'Sharp intelligence and creative writing ability. Intellectually gifted children. Success in education and mental speculation.', prognosis: 'Academic achievements peak in 20s-30s. Children excel academically. Creative writing brings recognition.' },
    6: { implications: 'Analytical problem-solving overcomes obstacles. Good for medical, legal, or service professions. You outthink opponents.', prognosis: 'Victory over competition through intelligence. Medical or legal career success. Health managed through knowledge and discipline.' },
    7: { implications: 'Intelligent spouse and successful business partnerships. Communication is key to relationship success.', prognosis: 'Marriage to intellectual partner enriches life. Business partnerships through communication thrive. Public speaking brings opportunities.' },
    8: { implications: 'Research ability and interest in hidden knowledge. Analytical approach to mysteries. Financial acumen in joint resources.', prognosis: 'Research career deepens with experience. Hidden knowledge reveals itself through persistent inquiry. Financial management improves.' },
    9: { implications: 'Interest in philosophy, teaching, and foreign cultures. Higher education is favored. Teaching and publishing abilities.', prognosis: 'Academic career peaks 30-45. Publishing success. Foreign travel for education. Teaching becomes fulfilling vocation.' },
    10: { implications: 'Career success through intellect and communication. Business, writing, teaching, and technology are ideal professions.', prognosis: 'Professional reputation as communicator and thinker. Technology career grows with industry. Multiple career peaks through adaptability.' },
    11: { implications: 'Gains through intellectual pursuits and networking. Smart, communicative social circle.', prognosis: 'Financial goals achieved through intelligence. Social network becomes professional asset. Multiple income streams through diverse skills.' },
    12: { implications: 'Rich inner mental life. Foreign communication work possible. Expenses on learning and education.', prognosis: 'Writing or research in seclusion produces masterwork. Foreign language skills develop. Spiritual knowledge deepens through study.' },
  },
  // JUPITER
  4: {
    1: { implications: 'Blessed with wisdom, optimism, and good fortune. Philosophical nature attracts opportunities naturally. Natural teacher and guide.', prognosis: 'Wisdom and prosperity increase with age. Teaching or advisory roles bring fulfillment. Reputation as wise counselor grows.' },
    2: { implications: 'Excellent for wealth, family happiness, and eloquent speech. Noble values attract financial abundance.', prognosis: 'Wealth accumulates through wisdom and ethics. Family life is blessed. Speech becomes source of income and influence.' },
    3: { implications: 'Wise communication and good sibling relationships. Success through teaching and counseling. Short journeys for spiritual purposes.', prognosis: 'Communication career flourishes. Siblings benefit from your guidance. Writing on philosophical topics brings recognition.' },
    4: { implications: 'Domestic happiness, property, vehicles, and comfortable home. Education is blessed. Mother is wise and supportive.', prognosis: 'Property ownership and domestic bliss increase with age. Educational pursuits always rewarded. Home becomes center of wisdom.' },
    5: { implications: 'One of the best placements — intelligence, good children, spiritual merit, and success in education and speculation.', prognosis: 'Children bring great joy and pride. Academic excellence throughout life. Creative and speculative ventures succeed.' },
    6: { implications: 'Overcomes obstacles through wisdom and righteousness. Legal matters favor you. Service through teaching or healing.', prognosis: 'Enemies defeated through wisdom. Legal victories. Health protected by positive outlook. Service career brings honor.' },
    7: { implications: 'Wise, noble spouse. Partnerships are fortunate and prosper through ethical dealing. Marriage brings expansion.', prognosis: 'Marriage to educated partner brings growth. Business prospers through ethical practices. Public reputation as fair dealer.' },
    8: { implications: 'Protection from sudden harm. Interest in occult wisdom. Longevity favored. Inheritance likely.', prognosis: 'Protected from major calamities. Life-extending spiritual practices. Research into hidden knowledge brings wisdom. Inheritance benefits.' },
    9: { implications: 'Extremely fortunate — great wisdom, spiritual advancement, prosperity, and blessings from teachers and father.', prognosis: 'Fortune increases throughout life. Spiritual wisdom deepens. Pilgrimage and higher education bring transformation. Guru appears when ready.' },
    10: { implications: 'Career success, ethical leadership, and social respect. Professional life guided by higher principles.', prognosis: 'Career peaks bring widespread recognition. Ethical reputation attracts prosperity. Advisory or leadership positions in 40s-50s.' },
    11: { implications: 'Ambitions fulfilled through knowledge. Wise, influential social network. Gains through teaching and advisory work.', prognosis: 'Financial goals achieved through wisdom and connections. Social influence grows. Elder mentors support your growth.' },
    12: { implications: 'Spiritual growth, foreign travel, and charitable deeds. Expenses toward good causes. Moksha is attainable.', prognosis: 'Spiritual depth increases with age. Foreign connections bring wisdom. Liberation through devotion and service.' },
  },
  // VENUS
  5: {
    1: { implications: 'Charm, beauty, and artistic sensibility attract others naturally. Refined aesthetic sense. Life offers many pleasures.', prognosis: 'Attractiveness and charm increase with refinement. Artistic pursuits bring joy throughout life. Social grace opens doors.' },
    2: { implications: 'Excellent for wealth, sweet speech, and family harmony. Beautiful possessions and fine lifestyle.', prognosis: 'Wealth through beauty, art, and luxury industries. Family life harmonious. Voice may be an asset — singing, speaking.' },
    3: { implications: 'Artistic talents and harmonious sibling relationships. Creative communication succeeds.', prognosis: 'Creative career in media, design, or arts flourishes. Siblings are supportive. Short travels bring pleasure and inspiration.' },
    4: { implications: 'Luxury at home, beautiful vehicles, and domestic happiness. Living space is aesthetically refined.', prognosis: 'Home becomes increasingly beautiful. Vehicle and property acquisition favored. Domestic life brings deep contentment.' },
    5: { implications: 'Romantic fulfillment, creative talent, and pleasure from children. Entertainment and arts bring joy and income.', prognosis: 'Romance leads to happy marriage. Creative projects succeed. Children bring joy. Entertainment career peaks 25-40.' },
    6: { implications: 'Challenges in relationships but success in service-related creative fields. Artistic healing abilities.', prognosis: 'Relationship challenges teach important lessons. Service through beauty and art brings satisfaction. Health improves through aesthetic living.' },
    7: { implications: 'Strong for marriage and partnerships. Attractive spouse. Business partnerships prosper through charm and diplomacy.', prognosis: 'Happy marriage with attractive partner. Business success through relationships. Public image is charming and appealing.' },
    8: { implications: 'Sensual depth and interest in tantric arts. Transformation through intimate relationships. Possible inheritance through spouse.', prognosis: 'Deep emotional transformation through love. Inheritance from spouse\'s family possible. Hidden artistic talents emerge.' },
    9: { implications: 'Fortune through arts, beauty, and culture. Foreign connections are pleasant. Spiritual life has devotional quality.', prognosis: 'Foreign travel brings romance and cultural enrichment. Devotional practices deepen. Artistic work gains international recognition.' },
    10: { implications: 'Career success in arts, beauty, fashion, or entertainment. Public image is charming. Creative leadership.', prognosis: 'Career in beauty or entertainment industry peaks 30-45. Public recognition for artistic contributions. Charm creates opportunities.' },
    11: { implications: 'Desires for luxury and pleasure fulfilled. Gains through women, arts, and social connections.', prognosis: 'Luxury lifestyle achieved through social connections. Artistic networks become profitable. Major pleasurable experiences after 30.' },
    12: { implications: 'Pleasures in foreign lands. Rich fantasy and creative inner life. Spiritual love and devotion.', prognosis: 'Foreign romance or creative collaborations. Spiritual love transcends physical. Hidden artistic talents manifest through solitude.' },
  },
  // SATURN
  6: {
    1: { implications: 'Serious, disciplined personality. Life lessons through patience. Early life may have restrictions but longevity is favored.', prognosis: 'Life improves dramatically after Saturn maturity (36). Discipline yields massive rewards by 40s. Health and vitality improve with age.' },
    2: { implications: 'Delayed wealth but ensures lasting prosperity. Measured, authoritative speech. Family duties taken seriously.', prognosis: 'Financial hardship in youth gives way to stable wealth after 35. Speech becomes source of authority. Family responsibilities build character.' },
    3: { implications: 'Determination and persistence despite challenges. Siblings may face hardships. Success through disciplined communication.', prognosis: 'Writing or communication career succeeds through persistent effort. Sibling relationships mature with time. Courage develops late but deeply.' },
    4: { implications: 'Delayed domestic happiness but eventual stability. Property comes through hard work. Relationship with mother teaches patience.', prognosis: 'Property acquisition after 35-40 through sustained effort. Home life stabilizes in middle age. Mother\'s lessons become valuable wisdom.' },
    5: { implications: 'Delayed children or serious-minded offspring. Education requires persistence. Conservative approach to speculation.', prognosis: 'Children may come late but are disciplined and successful. Academic success through hard work. Creative output deepens with maturity.' },
    6: { implications: 'Good for overcoming long-term obstacles. Service career brings gradual recognition. Health improves with disciplined lifestyle.', prognosis: 'Enemies wear themselves out against your persistence. Career in service or healthcare brings steady recognition. Chronic conditions managed through discipline.' },
    7: { implications: 'Delayed marriage or mature spouse. Partnerships require patience but are lasting. Business deals need careful attention to detail.', prognosis: 'Marriage after 28-30 brings stability. Spouse may be older or mature. Business partnerships succeed through long-term commitment.' },
    8: { implications: 'Longevity and interest in deep research. Chronic conditions need management. Transformation through sustained effort.', prognosis: 'Long life through disciplined living. Research career produces authoritative work. Major transformation after Saturn return (28-30).' },
    9: { implications: 'Disciplined spiritual practice. Higher education may be delayed but thorough. Father teaches responsibility.', prognosis: 'Spiritual wisdom develops through sustained practice. Academic achievements come late but are substantial. Father\'s influence deepens with maturity.' },
    10: { implications: 'Powerful for career through steady effort. Government service, management, or structured leadership brings lasting success.', prognosis: 'Career success after sustained effort — major recognition 40-55. Becomes authority in field. Legacy through institutional contribution.' },
    11: { implications: 'Gains through persistent effort. Success comes after delays. Elder siblings are hardworking.', prognosis: 'Financial goals achieved through patience — major gains after 40. Persistent networking pays off. Long-term investments yield substantially.' },
    12: { implications: 'Foreign residence, spiritual discipline, and long-term projects. Liberation through persistent practice.', prognosis: 'Foreign settlement brings eventual peace. Spiritual depth through years of practice. Expenses on long-term worthy causes.' },
  },
  // RAHU
  7: {
    1: { implications: 'Unconventional personality with worldly ambitions. Foreign connections beneficial. May break social norms.', prognosis: 'Unique path brings unexpected success. Foreign connections open doors. Identity transforms multiple times through life.' },
    2: { implications: 'Unusual wealth patterns — sudden gains and losses. Unconventional speech. Foreign food and cultures attract.', prognosis: 'Wealth through unconventional means. Financial volatility decreases with wisdom. Multilingual abilities develop.' },
    3: { implications: 'Courage through unconventional means. Modern media and technology for communication. Bold, unorthodox approach.', prognosis: 'Media and technology career brings sudden recognition. Unconventional courage leads to unique achievements.' },
    4: { implications: 'Unique domestic situation. Property in foreign places possible. Unconventional home environment.', prognosis: 'Foreign property acquisition likely. Home life takes unconventional form. Domestic stability through accepting uniqueness.' },
    5: { implications: 'Unusual intelligence and creative approach. Children may follow unique paths. High-risk high-reward speculation.', prognosis: 'Creative breakthroughs through unconventional methods. Children are unique individuals. Speculative gains through technology.' },
    6: { implications: 'Powerful for overcoming obstacles through unconventional methods. Victory in competition through surprise tactics.', prognosis: 'Enemies defeated through unexpected means. Health issues may be unusual but treatable. Competitive advantage through innovation.' },
    7: { implications: 'Spouse from different culture or background. Unconventional partnerships. Foreign business ventures favored.', prognosis: 'Marriage to someone from different background enriches life. International business partnerships thrive.' },
    8: { implications: 'Fascination with occult and hidden knowledge. Sudden transformations. Research in unconventional fields.', prognosis: 'Major transformation through crisis becomes growth. Occult research brings insight. Unexpected inheritance or gains.' },
    9: { implications: 'Interest in foreign philosophies. Unconventional spiritual path. Long journeys to foreign lands.', prognosis: 'Foreign travel transforms worldview. Unconventional guru or teaching. Philosophy bridges cultures.' },
    10: { implications: 'Powerful for career success through unconventional means. Fame, political ambition, and public recognition.', prognosis: 'Sudden career rise through innovation. Political or public success. Fame through unique contributions.' },
    11: { implications: 'Excellent for fulfilling worldly desires. Large gains through technology and foreign connections.', prognosis: 'Major financial gains through technology and networking. Worldly desires fulfilled in unexpected ways.' },
    12: { implications: 'Foreign residence and spiritual awakening through unconventional means. Expenses on foreign travel.', prognosis: 'Foreign settlement brings spiritual growth. Unconventional spiritual practices. Liberation through accepting the unknown.' },
  },
  // KETU
  8: {
    1: { implications: 'Spiritual, detached personality with past-life wisdom. Mysterious presence. Very strong intuition.', prognosis: 'Spiritual depth increases throughout life. Past-life talents manifest. Identity transcends worldly definitions.' },
    2: { implications: 'Detachment from material wealth. Mystical or abstract speech. Family relationships have karmic quality.', prognosis: 'Wealth matters less over time. Speech develops mystical quality. Family karma resolves through awareness.' },
    3: { implications: 'Spiritual courage and intuitive communication. Past-life skills emerge naturally.', prognosis: 'Intuitive communication becomes your strength. Past-life abilities surface. Spiritual courage guides important decisions.' },
    4: { implications: 'Detachment from conventional domestic life. Spiritual practices at home bring peace.', prognosis: 'Home becomes spiritual sanctuary. Detachment from property brings freedom. Inner peace through spiritual practice.' },
    5: { implications: 'Mystical intelligence and spiritual merit from past lives. Children may be spiritually inclined.', prognosis: 'Past-life wisdom manifests in creative work. Children are old souls. Spiritual merit brings unexpected blessings.' },
    6: { implications: 'Overcomes enemies through spiritual means. Natural healing abilities. Service without attachment.', prognosis: 'Spiritual healing abilities strengthen. Enemies dissolve through non-engagement. Health improves through spiritual practice.' },
    7: { implications: 'Detachment in partnerships. Spouse may be spiritual. Karmic relationships for soul growth.', prognosis: 'Relationships teach spiritual lessons. Partnership evolves toward spiritual companionship. Business detachment brings paradoxical success.' },
    8: { implications: 'Powerful for occult knowledge and meditation. Spiritual transformation. Moksha-oriented placement.', prognosis: 'Deep meditation abilities develop. Occult knowledge comes naturally. Major spiritual transformation in life.' },
    9: { implications: 'Natural spiritual wisdom. Religion experienced internally rather than externally. Father may be spiritual.', prognosis: 'Spiritual wisdom deepens without formal education. Inner guru awakens. Philosophy lived rather than theorized.' },
    10: { implications: 'Detachment from worldly ambition. Career may involve healing, spirituality, or research.', prognosis: 'Career transforms toward meaningful service. Worldly success comes paradoxically through non-attachment.' },
    11: { implications: 'Spiritual gains over material. Detachment from desires brings true fulfillment.', prognosis: 'Material desires diminish as spiritual awareness grows. True fulfillment through service. Gains come when least expected.' },
    12: { implications: 'Excellent for spiritual liberation (moksha). Strong meditation abilities. Past-life spiritual merit manifests.', prognosis: 'Spiritual liberation is attainable. Meditation becomes natural state. Past-life spiritual work bears fruit.' },
  },
};

// Dignity effects by planet state
export const DIGNITY_EFFECTS: Record<string, { en: string; hi: string }> = {
  exalted: {
    en: 'is exalted — operating at peak strength. Its significations flourish naturally. This is an exceptionally favorable placement conferring strong results with minimal effort.',
    hi: 'उच्च राशि में है — चरम शक्ति पर कार्यरत। इसके कारकत्व स्वाभाविक रूप से फलते-फूलते हैं। यह अत्यन्त अनुकूल स्थिति है।',
  },
  debilitated: {
    en: 'is debilitated — its natural significations face challenges. Results come with extra effort. This placement requires conscious work to overcome its limitations, but cancellation yogas (Neechabhanga) may mitigate the weakness.',
    hi: 'नीच राशि में है — इसके स्वाभाविक कारकत्वों को चुनौतियों का सामना करना पड़ता है। परिणामों के लिए अतिरिक्त प्रयास आवश्यक। नीचभङ्ग योग दुर्बलता को कम कर सकता है।',
  },
  ownSign: {
    en: 'is in its own sign — comfortable and effective. It delivers results naturally, like being at home. Significations of this planet are well-supported and reliable throughout life.',
    hi: 'स्वगृह (अपनी राशि) में है — सहज और प्रभावी। यह स्वाभाविक रूप से परिणाम देता है। इस ग्रह के कारकत्व जीवनभर सुदृढ़ और विश्वसनीय रहते हैं।',
  },
  retrograde: {
    en: 'is retrograde — its energy turns inward, intensifying introspection and revisiting past patterns. Results may be delayed or come in unconventional ways. Past-life karma related to this planet\'s significations is being processed.',
    hi: 'वक्री है — इसकी ऊर्जा अन्तर्मुखी होती है, आत्मनिरीक्षण और पूर्व प्रतिमानों की पुनरावृत्ति। परिणाम विलम्बित या अपरम्परागत हो सकते हैं। पूर्वजन्म कर्म संसाधित हो रहा है।',
  },
};

// Dasha period interpretations by planet
export const DASHA_EFFECTS: Record<string, { en: string; hi: string }> = {
  Sun: {
    en: 'brings focus on authority, career advancement, government matters, father, and self-identity. Health vitality is highlighted. Leadership opportunities arise. Ego lessons may surface.',
    hi: 'अधिकार, कैरियर उन्नति, सरकारी मामले, पिता और आत्म-पहचान पर ध्यान केन्द्रित करता है। नेतृत्व के अवसर उत्पन्न होते हैं।',
  },
  Moon: {
    en: 'brings emotional growth, domestic changes, mother-related events, travel, and public interaction. Mental peace is important. Creativity and intuition heighten.',
    hi: 'भावनात्मक विकास, घरेलू परिवर्तन, माता सम्बन्धी घटनाएँ, यात्रा और जनसम्पर्क। मानसिक शान्ति महत्वपूर्ण। रचनात्मकता और अन्तर्ज्ञान बढ़ते हैं।',
  },
  Mars: {
    en: 'brings energy, competition, property matters, courage tests, and physical activity. Siblings may be prominent. Real estate transactions are possible. Watch for anger and accidents.',
    hi: 'ऊर्जा, प्रतिस्पर्धा, सम्पत्ति मामले, साहस परीक्षण और शारीरिक गतिविधि। भाई-बहन प्रमुख। भूसम्पत्ति लेनदेन सम्भव। क्रोध और दुर्घटनाओं से सावधान।',
  },
  Mercury: {
    en: 'brings intellectual growth, communication opportunities, business dealings, education, and skill development. Writing and speaking abilities peak. Short travels for learning.',
    hi: 'बौद्धिक विकास, संवाद अवसर, व्यापारिक लेनदेन, शिक्षा और कौशल विकास। लेखन और वाणी क्षमताएँ चरम पर। शिक्षा हेतु छोटी यात्राएँ।',
  },
  Jupiter: {
    en: 'brings wisdom, expansion, spiritual growth, children, higher education, and fortune. Teachers and mentors appear. Financial prosperity increases. Marriage or important ceremonies possible.',
    hi: 'ज्ञान, विस्तार, आध्यात्मिक विकास, सन्तान, उच्च शिक्षा और भाग्य। गुरु और मार्गदर्शक प्रकट होते हैं। आर्थिक समृद्धि बढ़ती है। विवाह या महत्वपूर्ण संस्कार सम्भव।',
  },
  Venus: {
    en: 'brings pleasure, relationships, marriage, artistic pursuits, luxury, and material comfort. Romance flourishes. Creative talents express fully. Financial gains through beauty and art.',
    hi: 'सुख, सम्बन्ध, विवाह, कलात्मक गतिविधियाँ, विलासिता और भौतिक सुख। प्रेम प्रस्फुटित होता है। रचनात्मक प्रतिभा पूर्ण अभिव्यक्ति पाती है। सौन्दर्य और कला से आर्थिक लाभ।',
  },
  Saturn: {
    en: 'brings discipline, hard work, karmic lessons, delays that build character, and eventual lasting success. Career restructuring is common. Patience is tested but rewarded. Health requires attention.',
    hi: 'अनुशासन, कठोर परिश्रम, कार्मिक पाठ, चरित्र निर्माण करने वाले विलम्ब। कैरियर पुनर्गठन सामान्य। धैर्य की परीक्षा होती है पर पुरस्कृत होती है। स्वास्थ्य पर ध्यान आवश्यक।',
  },
  Rahu: {
    en: 'brings worldly ambition, foreign connections, unconventional opportunities, technology, and sudden changes. Material desires intensify. Foreign travel or residence possible. Watch for illusions and obsessions.',
    hi: 'सांसारिक महत्वाकांक्षा, विदेशी सम्बन्ध, अपरम्परागत अवसर, प्रौद्योगिकी और अचानक परिवर्तन। भौतिक इच्छाएँ तीव्र। विदेश यात्रा या निवास सम्भव। भ्रम और जुनून से सावधान।',
  },
  Ketu: {
    en: 'brings spiritual awakening, detachment, past-life resolutions, intuitive growth, and liberation. Material losses may occur but spiritual gains compensate. Introspection deepens. Past patterns resolve.',
    hi: 'आध्यात्मिक जागृति, वैराग्य, पूर्वजन्म समाधान, अन्तर्ज्ञान विकास और मुक्ति। भौतिक हानि हो सकती है पर आध्यात्मिक लाभ क्षतिपूर्ति करते हैं। आत्मनिरीक्षण गहराता है।',
  },
};

// Remedy data by planet
export const PLANET_REMEDIES: Record<number, { gemstone: { en: string; hi: string }; mantra: { en: string; hi: string }; practice: { en: string; hi: string; day: string } }> = {
  0: { gemstone: { en: 'Ruby (Manikya)', hi: 'माणिक्य' }, mantra: { en: 'Om Suryaya Namah (108 times)', hi: 'ॐ सूर्याय नमः (108 बार)' }, practice: { en: 'Offer water to Sun at sunrise. Donate wheat on Sundays.', hi: 'सूर्योदय पर सूर्य को जल अर्पण करें। रविवार को गेहूँ दान करें।', day: 'Sunday' } },
  1: { gemstone: { en: 'Pearl (Moti)', hi: 'मोती' }, mantra: { en: 'Om Chandraya Namah (108 times)', hi: 'ॐ चन्द्राय नमः (108 बार)' }, practice: { en: 'Offer milk to Shivalinga on Mondays. Donate rice.', hi: 'सोमवार को शिवलिंग पर दूध अर्पित करें। चावल दान करें।', day: 'Monday' } },
  2: { gemstone: { en: 'Red Coral (Moonga)', hi: 'मूँगा' }, mantra: { en: 'Om Mangalaya Namah (108 times)', hi: 'ॐ मङ्गलाय नमः (108 बार)' }, practice: { en: 'Offer red flowers to Hanuman on Tuesdays. Donate red lentils.', hi: 'मंगलवार को हनुमान जी को लाल फूल अर्पित करें। मसूर दाल दान करें।', day: 'Tuesday' } },
  3: { gemstone: { en: 'Emerald (Panna)', hi: 'पन्ना' }, mantra: { en: 'Om Budhaya Namah (108 times)', hi: 'ॐ बुधाय नमः (108 बार)' }, practice: { en: 'Donate green vegetables on Wednesdays. Feed green grass to cows.', hi: 'बुधवार को हरी सब्जियाँ दान करें। गाय को हरा चारा खिलाएँ।', day: 'Wednesday' } },
  4: { gemstone: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज' }, mantra: { en: 'Om Gurave Namah (108 times)', hi: 'ॐ गुरवे नमः (108 बार)' }, practice: { en: 'Donate yellow cloth and turmeric on Thursdays. Respect teachers.', hi: 'गुरुवार को पीले वस्त्र और हल्दी दान करें। गुरुजनों का सम्मान करें।', day: 'Thursday' } },
  5: { gemstone: { en: 'Diamond (Heera)', hi: 'हीरा' }, mantra: { en: 'Om Shukraya Namah (108 times)', hi: 'ॐ शुक्राय नमः (108 बार)' }, practice: { en: 'Donate white clothes and sugar on Fridays. Support arts and artists.', hi: 'शुक्रवार को सफेद वस्त्र और शक्कर दान करें। कला और कलाकारों का समर्थन करें।', day: 'Friday' } },
  6: { gemstone: { en: 'Blue Sapphire (Neelam)', hi: 'नीलम' }, mantra: { en: 'Om Shanaischaraya Namah (108 times)', hi: 'ॐ शनैश्चराय नमः (108 बार)' }, practice: { en: 'Donate black sesame and oil on Saturdays. Serve the elderly and poor.', hi: 'शनिवार को काले तिल और तेल दान करें। बुजुर्गों और गरीबों की सेवा करें।', day: 'Saturday' } },
  7: { gemstone: { en: 'Hessonite Garnet (Gomed)', hi: 'गोमेद' }, mantra: { en: 'Om Rahave Namah (108 times)', hi: 'ॐ राहवे नमः (108 बार)' }, practice: { en: 'Donate blue/black cloth on Saturdays. Feed birds. Avoid intoxicants.', hi: 'शनिवार को नीले/काले वस्त्र दान करें। पक्षियों को दाना डालें। नशे से बचें।', day: 'Saturday' } },
  8: { gemstone: { en: 'Cat\'s Eye (Lehsuniya)', hi: 'लहसुनिया' }, mantra: { en: 'Om Ketave Namah (108 times)', hi: 'ॐ केतवे नमः (108 बार)' }, practice: { en: 'Donate blankets to the needy. Feed stray dogs. Practice meditation regularly.', hi: 'जरूरतमन्दों को कम्बल दान करें। आवारा कुत्तों को खिलाएँ। नियमित ध्यान करें।', day: 'Tuesday' } },
};
