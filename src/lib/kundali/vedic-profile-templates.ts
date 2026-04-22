/**
 * Vedic Profile — Narrative Templates
 * Hook templates, moon-sign narratives, connector phrases, house theme labels.
 * All templates are EN + HI. Other locales fall back to EN.
 */

type BiText = { en: string; hi: string };

// ─── House theme labels (for stellium descriptions) ──────────────
export const HOUSE_THEME_LABELS: Record<number, BiText> = {
  1:  { en: 'self-identity and physical presence',  hi: 'आत्म-पहचान और शारीरिक उपस्थिति' },
  2:  { en: 'wealth, family, and speech',            hi: 'धन, परिवार और वाणी' },
  3:  { en: 'courage, communication, and siblings',  hi: 'साहस, संवाद और भाई-बहन' },
  4:  { en: 'home, mother, and inner peace',         hi: 'घर, माता और आन्तरिक शान्ति' },
  5:  { en: 'creativity, children, and romance',     hi: 'सृजनात्मकता, सन्तान और प्रेम' },
  6:  { en: 'health challenges, enemies, and service', hi: 'स्वास्थ्य, शत्रु और सेवा' },
  7:  { en: 'marriage, partnerships, and public dealings', hi: 'विवाह, साझेदारी और सार्वजनिक व्यवहार' },
  8:  { en: 'transformation, occult, and inheritance', hi: 'परिवर्तन, गुप्त विद्या और विरासत' },
  9:  { en: 'fortune, dharma, and higher learning',   hi: 'भाग्य, धर्म और उच्च शिक्षा' },
  10: { en: 'career, authority, and public reputation', hi: 'कैरियर, अधिकार और प्रतिष्ठा' },
  11: { en: 'gains, aspirations, and social networks', hi: 'लाभ, आकांक्षाएँ और सामाजिक सम्बन्ध' },
  12: { en: 'spiritual liberation, foreign lands, and solitude', hi: 'मोक्ष, विदेश और एकान्त' },
};

// ─── Element names ───────────────────────────────────────────────
export const ELEMENT_NAMES: Record<string, BiText> = {
  Fire:  { en: 'fiery',  hi: 'अग्नि' },
  Earth: { en: 'earthy', hi: 'पृथ्वी' },
  Air:   { en: 'airy',   hi: 'वायु' },
  Water: { en: 'watery', hi: 'जल' },
};

// ─── Lagna lord planets for each sign (1-indexed) ────────────────
export const LAGNA_LORDS: Record<number, number> = {
  1: 2,  // Aries → Mars
  2: 5,  // Taurus → Venus
  3: 3,  // Gemini → Mercury
  4: 1,  // Cancer → Moon
  5: 0,  // Leo → Sun
  6: 3,  // Virgo → Mercury
  7: 5,  // Libra → Venus
  8: 2,  // Scorpio → Mars
  9: 4,  // Sagittarius → Jupiter
  10: 6, // Capricorn → Saturn
  11: 6, // Aquarius → Saturn
  12: 4, // Pisces → Jupiter
};

// ─── Hook templates ──────────────────────────────────────────────
// Each pattern type has 2-3 variants. Variant is selected by hash.
// Placeholders: {house}, {houseTheme}, {count}, {planet}, {sign},
//               {yoga}, {element1}, {element2}, {sign1}, {sign2}

interface HookTemplate {
  en: string;
  hi: string;
}

export const HOOK_TEMPLATES: Record<string, HookTemplate[]> = {
  stellium: [
    {
      en: 'Your chart concentrates enormous energy in {houseTheme} — {count} planets crowd your {house}th house, making this the gravitational center of your life.',
      hi: 'आपकी कुण्डली {houseTheme} में अपार ऊर्जा केन्द्रित करती है — {count} ग्रह आपके {house}वें भाव में एकत्रित हैं, जो इसे आपके जीवन का गुरुत्वाकर्षण केन्द्र बनाते हैं।',
    },
    {
      en: 'With {count} planets gathered in your {house}th house, your life story is dominated by themes of {houseTheme}.',
      hi: '{count} ग्रह आपके {house}वें भाव में एकत्रित होकर {houseTheme} के विषयों को प्रधान बनाते हैं।',
    },
  ],
  kaalSarpa: [
    {
      en: 'The Rahu-Ketu axis grips your entire chart — all planets are hemmed between houses {house} and {house2}, channeling every planetary energy through a karmic corridor.',
      hi: 'राहु-केतु अक्ष आपकी पूरी कुण्डली को जकड़ता है — सभी ग्रह {house}वें और {house2}वें भाव के बीच सीमित हैं, प्रत्येक ग्रहीय ऊर्जा को कार्मिक गलियारे से गुजरने को बाध्य करते हैं।',
    },
  ],
  rajaYoga: [
    {
      en: 'Your chart carries unusual markers of authority and recognition — {count} raja yogas weave together planets of power and opportunity.',
      hi: 'आपकी कुण्डली अधिकार और मान्यता के असामान्य संकेत वहन करती है — {count} राजयोग शक्ति और अवसर के ग्रहों को गूँथते हैं।',
    },
  ],
  mahapurusha: [
    {
      en: '{yoga} forms in your chart: {planet} in its strongest dignity in a kendra house, conferring qualities that set you apart.',
      hi: '{yoga} आपकी कुण्डली में बनता है: {planet} अपनी सर्वोत्तम गरिमा में केन्द्र भाव में, आपको विशिष्ट गुण प्रदान करता है।',
    },
  ],
  dignifiedLagnaLord: [
    {
      en: 'With {planet} — lord of your ascendant — commanding from a position of strength in {sign}, your chart has an unusually strong anchor.',
      hi: '{planet} — आपके लग्नेश — {sign} में बलवान स्थिति से कुण्डली को असामान्य रूप से मजबूत आधार प्रदान करते हैं।',
    },
    {
      en: 'Your lagna lord {planet} sits in {sign} in its own dignity — the captain of your chart commands from solid ground.',
      hi: 'आपके लग्नेश {planet} {sign} में स्वगरिमा में विराजमान — कुण्डली का कर्णधार दृढ़ भूमि पर खड़ा है।',
    },
  ],
  debilitatedKey: [
    {
      en: '{planet} labors in {sign}, its sign of debilitation — this shapes a core theme that asks for conscious effort and patience.',
      hi: '{planet} अपनी नीच राशि {sign} में श्रम करता है — यह एक मूल विषय बनाता है जो सचेत प्रयास और धैर्य माँगता है।',
    },
  ],
  sameLagnaMoon: [
    {
      en: 'Your outer persona and inner emotional world are unified in {sign1} — there is no duality here, only concentrated {element1} energy.',
      hi: 'आपका बाह्य व्यक्तित्व और आन्तरिक भावनात्मक संसार {sign1} में एकीकृत — यहाँ कोई द्वन्द्व नहीं, केवल केन्द्रित {element1} ऊर्जा।',
    },
  ],
  contrastingElements: [
    {
      en: 'You navigate between {element1} intellect and {element2} depth — {sign1} shapes your face to the world while {sign2} runs the inner current.',
      hi: 'आप {element1} बुद्धि और {element2} गहराई के बीच संतुलन बनाते हैं — {sign1} आपका बाह्य रूप गढ़ता है जबकि {sign2} आन्तरिक धारा चलाता है।',
    },
    {
      en: '{sign1} gives you a {element1} exterior — analytical, measured, outward-facing — but your Moon in {sign2} runs on {element2} instinct beneath the surface.',
      hi: '{sign1} आपको {element1} बाह्य आवरण देता है — विश्लेषणात्मक, मापा हुआ — परन्तु {sign2} में आपका चन्द्र {element2} सहज ज्ञान पर चलता है।',
    },
  ],
  sadeSati: [
    {
      en: "Saturn's passage over your Moon — Sade Sati — is the defining pressure of your current years, reshaping how you relate to your emotional core.",
      hi: 'आपके चन्द्र पर शनि का गोचर — साढ़े साती — आपके वर्तमान वर्षों का निर्णायक दबाव है, आपकी भावनात्मक नींव को पुनर्गठित कर रहा है।',
    },
  ],
  lunarYoga: [
    {
      en: '{yoga} forms between {planet} and Moon, creating {quality} — one of the more recognized combinations in Jyotish.',
      hi: '{yoga} {planet} और चन्द्र के बीच बनता है, {quality} उत्पन्न करता है — ज्योतिष में सर्वाधिक मान्यता प्राप्त संयोगों में से एक।',
    },
  ],
  retrogradeKendra: [
    {
      en: '{planet} retrograde in your {house}th house — a kendra — turns its energy inward, demanding introspection before outward action in {houseTheme}.',
      hi: '{planet} वक्री आपके {house}वें भाव — एक केन्द्र — में अपनी ऊर्जा अन्तर्मुखी करता है, {houseTheme} में बाह्य कर्म से पहले आत्मनिरीक्षण माँगता है।',
    },
  ],
  fallback: [
    {
      en: 'With a {element1} ascendant and {element2} Moon, your chart balances the outward energy of {sign1} with the inner nature of {sign2}.',
      hi: '{element1} लग्न और {element2} चन्द्र के साथ, आपकी कुण्डली {sign1} की बाह्य ऊर्जा को {sign2} की आन्तरिक प्रकृति से संतुलित करती है।',
    },
  ],
};

// ─── Moon-sign narrative templates (per rashi, 1-indexed) ────────
// Each is 2-3 sentences incorporating element, quality, ruler.
// The nakshatra-specific part is appended separately from NAKSHATRA_DETAILS.
export const MOON_SIGN_NARRATIVES: Record<number, BiText> = {
  1:  { en: 'Your Moon in Aries gives you a quick, fiery emotional nature. You process feelings through action — sitting with discomfort is harder than charging through it. Emotional independence matters deeply; you recover from setbacks faster than most.', hi: 'मेष में चन्द्र आपको तीव्र, अग्निमय भावनात्मक स्वभाव देता है। आप भावनाओं को क्रिया के माध्यम से संसाधित करते हैं। भावनात्मक स्वतन्त्रता आपके लिए अत्यन्त महत्वपूर्ण है।' },
  2:  { en: 'Your Moon in Taurus grounds your emotions in the physical world — comfort, beauty, and stability are not luxuries for you but necessities. You are steady in attachment and slow to anger, but once provoked, equally slow to forgive.', hi: 'वृषभ में चन्द्र आपकी भावनाओं को भौतिक संसार में स्थिर करता है — सुख, सौन्दर्य और स्थिरता आपके लिए आवश्यकताएँ हैं। आप जुड़ाव में स्थिर और क्रोध में धीमे हैं।' },
  3:  { en: 'Your Moon in Gemini makes your emotional life verbal and restless. You process feelings by talking them through, writing them out, or simply moving. Boredom is your real enemy — emotional stagnation feels like suffocation.', hi: 'मिथुन में चन्द्र आपके भावनात्मक जीवन को वाचाल और अस्थिर बनाता है। आप भावनाओं को बातचीत या लेखन से संसाधित करते हैं। ऊब आपकी वास्तविक शत्रु है।' },
  4:  { en: 'Moon is at home in Cancer — your emotional intelligence is exceptionally high. You absorb the moods of everyone around you, which is both a gift and a burden. Home and family are not just important to you; they are your emotional oxygen.', hi: 'कर्क में चन्द्र अपने घर में — आपकी भावनात्मक बुद्धि असाधारण रूप से उच्च है। आप अपने आसपास सभी के मनोभावों को अवशोषित करते हैं। परिवार आपकी भावनात्मक प्राणवायु है।' },
  5:  { en: 'Your Moon in Leo needs to be seen, heard, and appreciated. You feel most alive when expressing yourself creatively or leading others. Emotional generosity comes naturally, but wounded pride can shut you down completely.', hi: 'सिंह में चन्द्र को देखे जाने, सुने जाने और सराहे जाने की आवश्यकता है। सृजनात्मक अभिव्यक्ति या नेतृत्व में आप सर्वाधिक जीवन्त अनुभव करते हैं।' },
  6:  { en: 'Your Moon in Virgo processes emotions through analysis — you need to understand why you feel something before you can accept it. This gives you unusual emotional precision but can delay the simple act of feeling.', hi: 'कन्या में चन्द्र विश्लेषण के माध्यम से भावनाओं को संसाधित करता है — आपको कुछ अनुभव करने से पहले समझना आवश्यक है कि आप ऐसा क्यों अनुभव कर रहे हैं।' },
  7:  { en: 'Your Moon in Libra seeks emotional equilibrium above all. You are attuned to fairness, beauty, and harmony in relationships. Conflict genuinely disturbs your inner peace — you are not avoiding it out of weakness but because dissonance costs you more than most.', hi: 'तुला में चन्द्र सबसे पहले भावनात्मक संतुलन चाहता है। आप सम्बन्धों में निष्पक्षता, सौन्दर्य और सामंजस्य के प्रति सचेत हैं।' },
  8:  { en: 'Your Moon in Scorpio runs deep — emotions are not things you have but forces that move through you. You process feelings through transformation rather than expression. Trust is earned slowly, but once given, your loyalty is absolute.', hi: 'वृश्चिक में चन्द्र गहरा चलता है — भावनाएँ वे चीज़ें नहीं जो आपके पास हैं बल्कि शक्तियाँ हैं जो आपके भीतर प्रवाहित होती हैं। विश्वास धीरे अर्जित होता है, परन्तु एक बार दिया गया तो निष्ठा पूर्ण है।' },
  9:  { en: 'Your Moon in Sagittarius makes you emotionally expansive and optimistic. You need meaning in your emotional life — shallow connections drain you. Philosophy, travel, and the search for truth feed your emotional well-being.', hi: 'धनु में चन्द्र आपको भावनात्मक रूप से विस्तृत और आशावादी बनाता है। आपको अपने भावनात्मक जीवन में अर्थ की आवश्यकता है। दर्शन और यात्रा आपकी भावनात्मक भलाई को पोषित करते हैं।' },
  10: { en: 'Your Moon in Capricorn processes emotions with restraint and gravity. You are not cold — you simply take feelings seriously and prefer to handle them privately. Emotional security for you is built through achievement and self-reliance.', hi: 'मकर में चन्द्र संयम और गम्भीरता से भावनाओं को संसाधित करता है। आप शीतल नहीं — बस भावनाओं को गम्भीरता से लेते हैं। भावनात्मक सुरक्षा उपलब्धि से निर्मित होती है।' },
  11: { en: 'Your Moon in Aquarius gives you an emotionally detached, observational quality. You care deeply about humanity in the abstract but can struggle with one-on-one emotional intimacy. Independence is not a preference — it is a need.', hi: 'कुम्भ में चन्द्र आपको भावनात्मक रूप से अलग, पर्यवेक्षी गुण देता है। आप मानवता की व्यापक रूप से गहरी चिन्ता करते हैं परन्तु व्यक्तिगत भावनात्मक निकटता में संघर्ष कर सकते हैं।' },
  12: { en: 'Your Moon in Pisces dissolves the boundary between self and other — you absorb emotions from your environment like a sponge. Creativity, spirituality, and compassion flow naturally, but you must guard against emotional overwhelm.', hi: 'मीन में चन्द्र स्वयं और दूसरे के बीच की सीमा को विलीन करता है — आप अपने परिवेश से भावनाओं को स्पंज की तरह अवशोषित करते हैं। सृजनात्मकता और करुणा स्वाभाविक हैं।' },
};

// ─── Connector phrases for planetary observations ────────────────
export const CONNECTORS: BiText[] = [
  { en: 'Adding to this picture,', hi: 'इस तस्वीर में जोड़ते हुए,' },
  { en: 'Meanwhile,',              hi: 'इसी बीच,' },
  { en: 'Equally significant,',    hi: 'समान रूप से महत्वपूर्ण,' },
  { en: 'Worth noting:',           hi: 'उल्लेखनीय:' },
  { en: 'On another front,',       hi: 'एक अन्य पक्ष पर,' },
];

// ─── Dignity labels ──────────────────────────────────────────────
export const DIGNITY_LABELS: Record<string, BiText> = {
  exalted:      { en: 'Exalted',      hi: 'उच्च' },
  debilitated:  { en: 'Debilitated',  hi: 'नीच' },
  ownSign:      { en: 'Own Sign',     hi: 'स्वराशि' },
  retrograde:   { en: 'Retrograde',   hi: 'वक्री' },
  neutral:      { en: 'Neutral',      hi: 'सामान्य' },
};

// ─── Dasha period label templates ────────────────────────────────
export const DASHA_TEMPLATES: Record<string, BiText> = {
  mahaIntro: {
    en: 'You are currently in {planet} Mahadasha — a {years}-year period',
    hi: 'आप वर्तमान में {planet} महादशा में हैं — {years} वर्ष की अवधि',
  },
  antarIntro: {
    en: 'The current Antardasha of {planet} adds',
    hi: '{planet} की वर्तमान अन्तर्दशा जोड़ती है',
  },
};

// ─── UI labels ───────────────────────────────────────────────────
export const UI_LABELS = {
  profileTitle: { en: 'Vedic Profile', hi: 'वैदिक प्रोफाइल' },
  readMore: { en: 'Read full profile', hi: 'पूरा प्रोफाइल पढ़ें' },
  readLess: { en: 'Show less', hi: 'कम दिखाएँ' },
  coreIdentity: { en: 'Core Identity', hi: 'मूल पहचान' },
  keyObservations: { en: 'Key Planetary Observations', hi: 'प्रमुख ग्रहीय अवलोकन' },
  nakshatraInsight: { en: 'Nakshatra Insight', hi: 'नक्षत्र अन्तर्दृष्टि' },
  dashaContext: { en: 'Current Dasha Period', hi: 'वर्तमान दशा काल' },
  activeDoshas: { en: 'Active Doshas', hi: 'सक्रिय दोष' },
  strengthSnapshot: { en: 'Planetary Strengths', hi: 'ग्रहीय बल' },
  planet: { en: 'Planet', hi: 'ग्रह' },
  dignity: { en: 'Dignity', hi: 'गरिमा' },
  house: { en: 'House', hi: 'भाव' },
  impact: { en: 'Impact', hi: 'प्रभाव' },
};

// Helper to resolve locale from BiText
export function bt(text: BiText, locale: string): string {
  if (locale === 'hi') return text.hi;
  return text.en; // EN fallback for ta, bn, sa, and all others
}
