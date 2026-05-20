/**
 * Vedic Archetypes — one per Lagna (Ascendant) sign.
 * Used for the dramatic "reveal" moment when a user completes their birth profile.
 * Each archetype maps to a Rashi ID (1-12).
 */

export interface Archetype {
  rashiId: number;
  name: { en: string; hi: string };
  title: { en: string; hi: string };
  essence: { en: string; hi: string };
  /** 2-3 sentence personality snapshot */
  description: { en: string; hi: string };
  /** What makes this archetype unique */
  superpower: { en: string; hi: string };
  /** The shadow side to watch */
  shadow: { en: string; hi: string };
}

export const ARCHETYPES: Archetype[] = [
  {
    rashiId: 1, // Aries / Mesha
    name: { en: 'The Warrior', hi: 'योद्धा' },
    title: { en: 'Mesha Lagna — The Warrior', hi: 'मेष लग्न — योद्धा' },
    essence: { en: 'Mars-ruled fire. You lead by doing, not by asking.', hi: 'मंगल शासित अग्नि। आप करके नेतृत्व करते हैं, माँगकर नहीं।' },
    description: {
      en: 'You are built for action. Where others deliberate, you have already begun. Your instinct is to confront, to pioneer, to cut through hesitation with decisive force. The world feels your presence before you speak.',
      hi: 'आप कर्म के लिए बने हैं। जहाँ दूसरे विचार करते हैं, आप पहले ही शुरू कर चुके होते हैं। आपकी सहज प्रवृत्ति टकराव, नवाचार और निर्णायक बल से हिचकिचाहट को काटने की है।',
    },
    superpower: { en: 'Courage under fire — you thrive when stakes are highest', hi: 'संकट में साहस — आप तब सबसे अच्छा करते हैं जब दाँव सबसे ऊँचे होते हैं' },
    shadow: { en: 'Impatience that burns bridges before they are built', hi: 'अधैर्य जो पुलों को बनने से पहले जला देता है' },
  },
  {
    rashiId: 2, // Taurus / Vrishabha
    name: { en: 'The Builder', hi: 'निर्माता' },
    title: { en: 'Vrishabha Lagna — The Builder', hi: 'वृषभ लग्न — निर्माता' },
    essence: { en: 'Venus-ruled earth. You create things that last.', hi: 'शुक्र शासित पृथ्वी। आप ऐसी चीज़ें बनाते हैं जो टिकती हैं।' },
    description: {
      en: 'You understand that real wealth is not speed but substance. Your power lies in patience, in the slow accumulation of value — material, relational, aesthetic. What you build endures long after louder voices fade.',
      hi: 'आप समझते हैं कि वास्तविक सम्पत्ति गति नहीं बल्कि सार है। आपकी शक्ति धैर्य में है, मूल्य के धीमे संचय में — भौतिक, सम्बन्धात्मक, सौन्दर्यात्मक।',
    },
    superpower: { en: 'Endurance — you outlast everyone in the room', hi: 'सहनशक्ति — आप सबसे अधिक टिकते हैं' },
    shadow: { en: 'Stubbornness that mistakes rigidity for stability', hi: 'ज़िद जो कठोरता को स्थिरता समझ बैठती है' },
  },
  {
    rashiId: 3, // Gemini / Mithuna
    name: { en: 'The Communicator', hi: 'संवादक' },
    title: { en: 'Mithuna Lagna — The Communicator', hi: 'मिथुन लग्न — संवादक' },
    essence: { en: 'Mercury-ruled air. You connect ideas that nobody else sees.', hi: 'बुध शासित वायु। आप ऐसे विचार जोड़ते हैं जो कोई और नहीं देखता।' },
    description: {
      en: 'Your mind moves faster than most people can follow. You see connections, patterns, and possibilities in every conversation. The world is a puzzle and you are always three moves ahead.',
      hi: 'आपका मन अधिकांश लोगों की समझ से तेज़ चलता है। आप हर बातचीत में सम्बन्ध, पैटर्न और सम्भावनाएँ देखते हैं। दुनिया एक पहेली है और आप हमेशा तीन कदम आगे हैं।',
    },
    superpower: { en: 'Adaptability — you thrive in chaos that paralyses others', hi: 'अनुकूलनशीलता — जो अराजकता दूसरों को पंगु करती है, उसमें आप फलते-फूलते हैं' },
    shadow: { en: 'Scattered energy that starts everything and finishes little', hi: 'बिखरी ऊर्जा जो सब शुरू करती है लेकिन कम पूरा करती है' },
  },
  {
    rashiId: 4, // Cancer / Karka
    name: { en: 'The Nurturer', hi: 'पोषक' },
    title: { en: 'Karka Lagna — The Nurturer', hi: 'कर्क लग्न — पोषक' },
    essence: { en: 'Moon-ruled water. You feel what others cannot articulate.', hi: 'चन्द्र शासित जल। आप वह महसूस करते हैं जो दूसरे शब्दों में नहीं कह सकते।' },
    description: {
      en: 'Your emotional intelligence is your greatest asset. You create safety for others — homes, families, teams — and in that safety, people become their best selves. Your memory is long, your loyalty deeper.',
      hi: 'आपकी भावनात्मक बुद्धिमत्ता आपकी सबसे बड़ी सम्पत्ति है। आप दूसरों के लिए सुरक्षा बनाते हैं — घर, परिवार, टीम — और उस सुरक्षा में लोग अपना सर्वश्रेष्ठ बनते हैं।',
    },
    superpower: { en: 'Emotional depth that creates unbreakable bonds', hi: 'भावनात्मक गहराई जो अटूट बन्धन बनाती है' },
    shadow: { en: 'Mood swings that make you retreat when the world needs you most', hi: 'मिज़ाज के उतार-चढ़ाव जो आपको तब पीछे हटाते हैं जब दुनिया को आपकी सबसे ज़्यादा ज़रूरत होती है' },
  },
  {
    rashiId: 5, // Leo / Simha
    name: { en: 'The Sovereign', hi: 'सम्राट' },
    title: { en: 'Simha Lagna — The Sovereign', hi: 'सिंह लग्न — सम्राट' },
    essence: { en: 'Sun-ruled fire. You were born to be seen.', hi: 'सूर्य शासित अग्नि। आप देखे जाने के लिए जन्मे हैं।' },
    description: {
      en: 'There is a gravity to your presence that draws people in. You do not demand attention — you simply occupy space in a way that makes it impossible to look away. Your generosity is as large as your pride.',
      hi: 'आपकी उपस्थिति में एक गुरुत्वाकर्षण है जो लोगों को खींचता है। आप ध्यान की माँग नहीं करते — आप बस ऐसे स्थान घेरते हैं कि नज़र हटाना असम्भव हो जाता है।',
    },
    superpower: { en: 'Natural authority — people follow you without being asked', hi: 'प्राकृतिक अधिकार — लोग बिना कहे आपका अनुसरण करते हैं' },
    shadow: { en: 'Pride that cannot accept help or admit vulnerability', hi: 'गर्व जो सहायता स्वीकार नहीं कर सकता या कमज़ोरी स्वीकार नहीं कर सकता' },
  },
  {
    rashiId: 6, // Virgo / Kanya
    name: { en: 'The Analyst', hi: 'विश्लेषक' },
    title: { en: 'Kanya Lagna — The Analyst', hi: 'कन्या लग्न — विश्लेषक' },
    essence: { en: 'Mercury-ruled earth. You see the flaw everyone else missed.', hi: 'बुध शासित पृथ्वी। आप वह दोष देखते हैं जो सबसे छूट गया।' },
    description: {
      en: 'Precision is not your habit — it is your nature. You improve everything you touch: systems, processes, people, health. Your service is quiet but indispensable. Without you, things fall apart in ways nobody notices until it is too late.',
      hi: 'सटीकता आपकी आदत नहीं — आपका स्वभाव है। आप जो कुछ छूते हैं उसमें सुधार करते हैं: प्रणालियाँ, प्रक्रियाएँ, लोग, स्वास्थ्य। आपकी सेवा शान्त लेकिन अपरिहार्य है।',
    },
    superpower: { en: 'Discernment — you see through noise to find the signal', hi: 'विवेक — आप शोर के पार सार को देखते हैं' },
    shadow: { en: 'Perfectionism that paralyses action with endless analysis', hi: 'पूर्णतावाद जो अनन्त विश्लेषण से कर्म को पंगु करता है' },
  },
  {
    rashiId: 7, // Libra / Tula
    name: { en: 'The Harmoniser', hi: 'सामंजस्यकर्ता' },
    title: { en: 'Tula Lagna — The Harmoniser', hi: 'तुला लग्न — सामंजस्यकर्ता' },
    essence: { en: 'Venus-ruled air. You see beauty where others see conflict.', hi: 'शुक्र शासित वायु। जहाँ दूसरे संघर्ष देखते हैं, आप सौन्दर्य देखते हैं।' },
    description: {
      en: 'You are the bridge between opposing forces. Your gift is not avoiding conflict but transforming it — finding the solution where both sides gain more than they lose. Justice matters to you more than winning.',
      hi: 'आप विरोधी शक्तियों के बीच सेतु हैं। आपका उपहार संघर्ष से बचना नहीं बल्कि उसे रूपान्तरित करना है — वह समाधान ढूँढ़ना जहाँ दोनों पक्ष खोने से अधिक पाएँ।',
    },
    superpower: { en: 'Diplomacy — you negotiate outcomes that seem impossible', hi: 'कूटनीति — आप ऐसे परिणाम प्राप्त करते हैं जो असम्भव लगते हैं' },
    shadow: { en: 'Indecision that avoids necessary confrontation', hi: 'अनिर्णय जो आवश्यक टकराव से बचता है' },
  },
  {
    rashiId: 8, // Scorpio / Vrishchika
    name: { en: 'The Transformer', hi: 'रूपान्तरक' },
    title: { en: 'Vrishchika Lagna — The Transformer', hi: 'वृश्चिक लग्न — रूपान्तरक' },
    essence: { en: 'Mars-ruled water. You destroy what is false so truth can emerge.', hi: 'मंगल शासित जल। आप झूठ को नष्ट करते हैं ताकि सत्य प्रकट हो सके।' },
    description: {
      en: 'You understand power in ways that make others uncomfortable. You see through masks, detect hidden motives, and possess a psychological depth that can heal or wound. Nothing superficial survives your gaze.',
      hi: 'आप शक्ति को ऐसे समझते हैं जो दूसरों को असहज करता है। आप मुखौटों के पार देखते हैं, छिपे उद्देश्यों को पहचानते हैं, और एक मनोवैज्ञानिक गहराई रखते हैं जो उपचार या घाव कर सकती है।',
    },
    superpower: { en: 'Regeneration — you rise from ashes that would bury others', hi: 'पुनर्जन्म — आप उन राखों से उठते हैं जो दूसरों को दफ़ना देतीं' },
    shadow: { en: 'Obsession with control that poisons trust', hi: 'नियन्त्रण का जुनून जो विश्वास को ज़हर देता है' },
  },
  {
    rashiId: 9, // Sagittarius / Dhanu
    name: { en: 'The Seeker', hi: 'अन्वेषक' },
    title: { en: 'Dhanu Lagna — The Seeker', hi: 'धनु लग्न — अन्वेषक' },
    essence: { en: 'Jupiter-ruled fire. You chase meaning, not comfort.', hi: 'गुरु शासित अग्नि। आप अर्थ का पीछा करते हैं, आराम का नहीं।' },
    description: {
      en: 'Your horizon is always further than where you stand. Philosophy, travel, teaching, law — anything that expands understanding draws you. You are the eternal student who becomes the teacher.',
      hi: 'आपका क्षितिज हमेशा आपसे आगे है। दर्शन, यात्रा, शिक्षण, कानून — कुछ भी जो समझ का विस्तार करे, आपको खींचता है। आप शाश्वत छात्र हैं जो गुरु बन जाते हैं।',
    },
    superpower: { en: 'Vision — you see the big picture when others are lost in details', hi: 'दृष्टि — जब दूसरे विवरणों में खोए होते हैं, आप बड़ी तस्वीर देखते हैं' },
    shadow: { en: 'Restlessness that abandons depth for breadth', hi: 'बेचैनी जो गहराई को चौड़ाई के लिए छोड़ देती है' },
  },
  {
    rashiId: 10, // Capricorn / Makara
    name: { en: 'The Architect', hi: 'वास्तुकार' },
    title: { en: 'Makara Lagna — The Architect', hi: 'मकर लग्न — वास्तुकार' },
    essence: { en: 'Saturn-ruled earth. You build empires from discipline.', hi: 'शनि शासित पृथ्वी। आप अनुशासन से साम्राज्य बनाते हैं।' },
    description: {
      en: 'Time is your ally, not your enemy. You understand that lasting achievement requires structure, sacrifice, and the willingness to delay gratification. Where others sprint, you build infrastructure.',
      hi: 'समय आपका मित्र है, शत्रु नहीं। आप समझते हैं कि स्थायी उपलब्धि के लिए संरचना, त्याग और तत्काल सन्तुष्टि टालने की इच्छा आवश्यक है।',
    },
    superpower: { en: 'Strategic patience — your plans unfold across years, not weeks', hi: 'रणनीतिक धैर्य — आपकी योजनाएँ सप्ताहों नहीं, वर्षों में प्रकट होती हैं' },
    shadow: { en: 'Cold ambition that sacrifices warmth for achievement', hi: 'ठण्डी महत्वाकांक्षा जो उपलब्धि के लिए गर्मजोशी का त्याग करती है' },
  },
  {
    rashiId: 11, // Aquarius / Kumbha
    name: { en: 'The Visionary', hi: 'दूरदर्शी' },
    title: { en: 'Kumbha Lagna — The Visionary', hi: 'कुम्भ लग्न — दूरदर्शी' },
    essence: { en: 'Saturn-ruled air. You see the future before it arrives.', hi: 'शनि शासित वायु। आप भविष्य को उसके आने से पहले देखते हैं।' },
    description: {
      en: 'You think in systems, not individuals. Your concern is the collective — how structures serve people, how technology can liberate, how society can evolve. You are often misunderstood because you are ahead of your time.',
      hi: 'आप प्रणालियों में सोचते हैं, व्यक्तियों में नहीं। आपकी चिन्ता सामूहिक है — संरचनाएँ लोगों की कैसे सेवा करें, प्रौद्योगिकी कैसे मुक्त करे, समाज कैसे विकसित हो।',
    },
    superpower: { en: 'Innovation — you solve problems nobody else has even identified', hi: 'नवाचार — आप ऐसी समस्याएँ सुलझाते हैं जो किसी और ने पहचानी भी नहीं' },
    shadow: { en: 'Emotional detachment that makes intimacy feel like a cage', hi: 'भावनात्मक अलगाव जो अन्तरंगता को पिंजरा महसूस कराता है' },
  },
  {
    rashiId: 12, // Pisces / Meena
    name: { en: 'The Mystic', hi: 'रहस्यवादी' },
    title: { en: 'Meena Lagna — The Mystic', hi: 'मीन लग्न — रहस्यवादी' },
    essence: { en: 'Jupiter-ruled water. You dissolve boundaries between worlds.', hi: 'गुरु शासित जल। आप संसारों के बीच सीमाएँ मिटा देते हैं।' },
    description: {
      en: 'You live in two worlds — the seen and the unseen. Your intuition is not a skill but a sense, as natural as sight. Artists, healers, dreamers, and saints share your lagna. The material world is not your home but your assignment.',
      hi: 'आप दो संसारों में रहते हैं — दृश्य और अदृश्य। आपकी अन्तर्ज्ञान एक कौशल नहीं बल्कि एक इन्द्रिय है, दृष्टि जितनी स्वाभाविक। कलाकार, चिकित्सक, स्वप्नदर्शी और सन्त आपका लग्न साझा करते हैं।',
    },
    superpower: { en: 'Intuition — you know things before evidence arrives', hi: 'अन्तर्ज्ञान — आप प्रमाण आने से पहले जानते हैं' },
    shadow: { en: 'Escapism that confuses surrender with avoidance', hi: 'पलायनवाद जो समर्पण को टालने से भ्रमित करता है' },
  },
];

/** Get archetype by rashi ID (1-12) */
export function getArchetype(rashiId: number): Archetype | null {
  return ARCHETYPES.find(a => a.rashiId === rashiId) ?? null;
}
