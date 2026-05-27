/**
 * Canonical learning module sequence for the Jyotish curriculum.
 * 17 phases (0–16), ~260 modules. Every learn page is a curriculum module.
 * No React dependencies  –  safe to import in Zustand stores and server utilities.
 */

export interface ModuleRef {
  id: string;
  phase: number;
  topic: string;
  title: Record<string, string>;
  /** If set, links to this path instead of /learn/modules/[id]. Used for standalone pages. */
  href?: string;
}

export const MODULE_SEQUENCE: ModuleRef[] = [
  // ── Phase 0: Pre-Foundation ──────────────────────────────────────────────
  { id: '0-1', phase: 0, topic: 'Getting Started', title: { en: 'What is Jyotish?', hi: 'ज्योतिष क्या है?', ta: 'ஜோதிடம் என்றால் என்ன?', bn: 'জ্যোতিষ কী?' } },
  { id: '0-2', phase: 0, topic: 'Getting Started', title: { en: 'The Hindu Calendar', hi: 'हिन्दू पंचांग', ta: 'இந்து நாள்காட்டி', bn: 'হিন্দু পঞ্জিকা' } },
  { id: '0-3', phase: 0, topic: 'Getting Started', title: { en: 'Your Cosmic Address', hi: 'आपका ब्रह्माण्डीय पता', ta: 'உங்கள் அண்ட முகவரி', bn: 'আপনার মহাজাগতিক ঠিকানা' } },
  { id: '0-4', phase: 0, topic: 'Getting Started', title: { en: "Reading Today's Panchang", hi: 'आज का पंचांग पढ़ना', ta: "இன்றைய பஞ்சாங்கம் படிக்க", bn: "আজকের পঞ্চাঙ্গ পড়া" } },
  { id: '0-5', phase: 0, topic: 'Getting Started', title: { en: 'What is a Kundali?', hi: 'कुण्डली क्या है?', ta: 'ஜாதகம் என்றால் என்ன?', bn: 'জাতক কী?' } },
  { id: '0-6', phase: 0, topic: 'Foundations',     title: { en: 'Rituals & Astronomy', hi: 'कर्मकाण्ड और खगोल', ta: 'சடங்குகள் & வானியல்', bn: 'কর্মকাণ্ড ও জ্যোতির্বিদ্যা' } },
  // Absorbed standalone pages
  { id: 'hindu-calendar', phase: 0, topic: 'Foundations', href: '/learn/hindu-calendar', title: { en: 'Hindu Calendar  –  Complete Guide', hi: 'हिन्दू पंचांग  –  सम्पूर्ण मार्गदर्शक', ta: 'இந்து நாள்காட்டி வழிகாட்டி', bn: 'হিন্দু পঞ্জিকা নির্দেশিকা' } },
  { id: 'panchang-guide', phase: 0, topic: 'Foundations', href: '/learn/panchang-guide', title: { en: 'Panchang Guide', hi: 'पंचांग मार्गदर्शिका', ta: 'பஞ்சாங்க வழிகாட்டி', bn: 'পঞ্চাঙ্গ নির্দেশিকা' } },
  { id: 'cosmology', phase: 0, topic: 'Foundations', href: '/learn/cosmology', title: { en: 'Cosmology  –  Deep Dive', hi: 'ब्रह्माण्ड  –  विस्तृत', ta: 'பிரபஞ்ச ஆய்வு', bn: 'ব্রহ্মাণ্ড' } },
  { id: 'vedanga', phase: 0, topic: 'Foundations', href: '/learn/vedanga', title: { en: 'Vedanga Heritage', hi: 'वेदांग विरासत', ta: 'வேதாங்க பாரம்பரியம்', bn: 'বেদাঙ্গ ঐতিহ্য' } },
  { id: 'observatories', phase: 0, topic: 'Foundations', href: '/learn/observatories', title: { en: 'Indian Observatories (Jantar Mantar)', hi: 'भारतीय वेधशालाएं', ta: 'இந்திய வேதசாலைகள்', bn: 'ভারতীয় বেধশালা' } },

  // ── Phase 1: India's Contributions (moved from Phase 11) ──────────────────
  // Existing numbered modules (keep IDs, change phase)
  { id: '25-1', phase: 1, topic: 'Mathematics',     title: { en: 'Zero  –  The Most Dangerous Idea', hi: 'शून्य  –  सबसे खतरनाक विचार', ta: 'சுழியம்  –  மிக ஆபத்தான கருத்து', bn: 'শূন্য  –  সবচেয়ে বিপজ্জনক ধারণা' } },
  { id: '25-2', phase: 1, topic: 'Mathematics',     title: { en: "Sine Is Sanskrit  –  Jya to Sine", hi: 'Sine संस्कृत है  –  ज्या से Sine', ta: "Sine சமஸ்கிருதம்  –  ஜ்யாவிலிருந்து Sine", bn: "Sine সংস্কৃত  –  জ্যা থেকে Sine" } },
  { id: '25-3', phase: 1, topic: 'Mathematics',     title: { en: 'π = 3.1416  –  Aryabhata Nailed It', hi: 'π = 3.1416  –  आर्यभट की सटीक गणना', ta: 'π = 3.1416  –  ஆர்யபட்டரின் துல்லிய கணக்கு', bn: 'π = 3.1416  –  আর্যভট্টের নির্ভুল গণনা' } },
  { id: '25-4', phase: 1, topic: 'Mathematics',     title: { en: 'Negative Numbers  –  Less Than Nothing', hi: 'ऋणात्मक संख्याएँ  –  शून्य से कम', ta: 'எதிர்மறை எண்கள்  –  ஒன்றுமில்லாததை விடக் குறைவு', bn: 'ঋণাত্মক সংখ্যা  –  শূন্যের চেয়ে কম' } },
  { id: '25-5', phase: 1, topic: 'Mathematics',     title: { en: 'Binary Code  –  1,800 Years Early', hi: 'द्विआधारी  –  1,800 वर्ष पहले', ta: 'இருமக் குறியீடு  –  1,800 ஆண்டுகள் முன்பே', bn: 'বাইনারি কোড  –  1,800 বছর আগে' } },
  { id: '25-6', phase: 1, topic: 'Mathematics',     title: { en: 'Fibonacci Started With Music', hi: 'फिबोनाची संगीत से शुरू हुआ', ta: 'ஃபிபோனச்சி இசையில் தொடங்கியது', bn: 'ফিবোনাচি সঙ্গীত দিয়ে শুরু হয়েছিল' } },
  { id: '25-7', phase: 1, topic: 'Mathematics',     title: { en: 'Calculus  –  Kerala, Not Cambridge', hi: 'कैलकुलस  –  केरल, कैम्ब्रिज नहीं', ta: 'கணிதம்  –  கேரளா, கேம்பிரிட்ஜ் அல்ல', bn: 'ক্যালকুলাস  –  কেরালা, কেমব্রিজ নয়' } },
  { id: '25-8', phase: 1, topic: 'Mathematics',     title: { en: "Pythagorean Theorem  –  300 Years Before Pythagoras", hi: "पाइथागोरस प्रमेय  –  पाइथागोरस से 300 वर्ष पहले", ta: "பைதாகரஸ் தேற்றம்  –  பைதாகரஸுக்கு 300 ஆண்டுகள் முன்பு", bn: "পিথাগোরাসের উপপাদ্য  –  পিথাগোরাসের 300 বছর আগে" } },
  { id: '25-9', phase: 1, topic: 'Mathematics',     title: { en: 'Kerala School  –  When India Invented Calculus', hi: 'केरल स्कूल  –  जब भारत ने कलनशास्त्र खोजा', ta: 'கேரள பள்ளி  –  இந்தியா கணிதத்தைக் கண்டுபிடித்தபோது', bn: 'কেরালা স্কুল  –  যখন ভারত ক্যালকুলাস আবিষ্কার করল' } },
  { id: '26-1', phase: 1, topic: 'Astronomy & Physics', title: { en: 'Earth Rotates  –  1,000 Years Before Europe', hi: 'पृथ्वी घूमती है  –  यूरोप से 1,000 वर्ष पहले', ta: 'பூமி சுழல்கிறது  –  ஐரோப்பாவுக்கு 1,000 ஆண்டுகள் முன்பு', bn: 'পৃথিবী ঘোরে  –  ইউরোপের 1,000 বছর আগে' } },
  { id: '26-2', phase: 1, topic: 'Astronomy & Physics', title: { en: 'Gravity  –  500 Years Before Newton', hi: 'गुरुत्वाकर्षण  –  न्यूटन से 500 वर्ष पहले', ta: 'ஈர்ப்பு விசை  –  நியூட்டனுக்கு 500 ஆண்டுகள் முன்பு', bn: 'মাধ্যাকর্ষণ  –  নিউটনের 500 বছর আগে' } },
  { id: '26-3', phase: 1, topic: 'Astronomy & Physics', title: { en: 'Speed of Light  –  14th Century Text', hi: 'प्रकाश की गति  –  14वीं शताब्दी', ta: 'ஒளியின் வேகம்  –  14ஆம் நூற்றாண்டு நூல்', bn: 'আলোর গতি  –  14শ শতাব্দীর গ্রন্থ' } },
  { id: '26-4', phase: 1, topic: 'Astronomy & Physics', title: { en: '4.32 Billion Years  –  How Did They Know?', hi: '4.32 अरब वर्ष  –  कैसे पता था?', ta: '4.32 பில்லியன் ஆண்டுகள்  –  அவர்களுக்கு எப்படி தெரியும்?', bn: '4.32 বিলিয়ন বছর  –  তারা কীভাবে জানতেন?' } },
  // Absorbed contributions/ standalone pages

  // ── Phase 2: The Sky (was Phase 1) ───────────────────────────────────────
  // Foundations
  { id: '1-1', phase: 2, topic: 'Foundations', title: { en: 'The Night Sky & Ecliptic', hi: 'रात्रि आकाश एवं क्रान्तिवृत्त', ta: 'இரவு வானமும் சூரியப்பாதையும்', bn: 'রাতের আকাশ ও ক্রান্তিবৃত্ত' } },
  { id: '1-2', phase: 2, topic: 'Foundations', title: { en: 'Measuring the Sky', hi: 'आकाश मापन', ta: 'வானத்தை அளத்தல்', bn: 'আকাশ পরিমাপ' } },
  { id: '1-3', phase: 2, topic: 'Foundations', title: { en: 'The Zodiac Belt', hi: 'राशिचक्र पट्टी', ta: 'ராசிச்சக்கரப் பட்டை', bn: 'রাশিচক্র বলয়' } },
  // Grahas
  { id: '2-1', phase: 2, topic: 'Grahas',      title: { en: 'The Nine Grahas', hi: 'नवग्रह', ta: 'நவகிரகங்கள்', bn: 'নবগ্রহ' } },
  { id: '2-2', phase: 2, topic: 'Grahas',      title: { en: 'Planetary Relationships', hi: 'ग्रह संबंध', ta: 'கிரக உறவுகள்', bn: 'গ্রহ সম্পর্ক' } },
  { id: '2-3', phase: 2, topic: 'Grahas',      title: { en: 'Dignities', hi: 'ग्रह गरिमा', ta: 'கிரக கௌரவங்கள்', bn: 'গ্রহ মর্যাদা' } },
  { id: '2-4', phase: 2, topic: 'Grahas',      title: { en: 'Retrograde, Combustion & War', hi: 'वक्री, अस्त एवं ग्रह युद्ध', ta: 'வக்கிரம், அஸ்தமனம் & கிரக யுத்தம்', bn: 'বক্রী, অস্ত ও গ্রহ যুদ্ধ' } },
  // Rashis
  { id: '3-1', phase: 2, topic: 'Rashis',      title: { en: 'The 12 Rashis', hi: '12 राशियाँ', ta: '12 ராசிகள்', bn: '12 রাশি' } },
  { id: '3-2', phase: 2, topic: 'Rashis',      title: { en: 'Sign Qualities', hi: 'राशि गुण', ta: 'ராசி குணங்கள்', bn: 'রাশি গুণ' } },
  { id: '3-3', phase: 2, topic: 'Rashis',      title: { en: 'Sign Lordship', hi: 'राशि स्वामित्व', ta: 'ராசி அதிபத்தியம்', bn: 'রাশি স্বামিত্ব' } },
  // Ayanamsha
  { id: '4-1', phase: 2, topic: 'Ayanamsha',   title: { en: 'Earth Wobble', hi: 'अयनगति भौतिकी', ta: 'பூமியின் தள்ளாட்டம்', bn: 'পৃথিবীর বিচলন' } },
  { id: '4-2', phase: 2, topic: 'Ayanamsha',   title: { en: 'Two Zodiacs', hi: 'दो राशिचक्र', ta: 'இரு ராசிச்சக்கரங்கள்', bn: 'দুই রাশিচক্র' } },
  { id: '4-3', phase: 2, topic: 'Ayanamsha',   title: { en: 'Ayanamsha Systems', hi: 'अयनांश पद्धतियाँ', ta: 'அயனாம்ச முறைகள்', bn: 'অয়নাংশ পদ্ধতি' } },
  // Absorbed standalone pages  –  graha deep dives
  { id: 'surya',  phase: 2, topic: 'Grahas', href: '/learn/surya',  title: { en: 'Surya  –  The Sun', hi: 'सूर्य', ta: 'சூரியன்', bn: 'সূর্য' } },
  { id: 'chandra', phase: 2, topic: 'Grahas', href: '/learn/chandra', title: { en: 'Chandra  –  The Moon', hi: 'चन्द्रमा', ta: 'சந்திரன்', bn: 'চন্দ্র' } },
  { id: 'mangal', phase: 2, topic: 'Grahas', href: '/learn/mangal', title: { en: 'Mangal  –  Mars', hi: 'मंगल', ta: 'செவ்வாய்', bn: 'মঙ্গল' } },
  { id: 'budha',  phase: 2, topic: 'Grahas', href: '/learn/budha',  title: { en: 'Budha  –  Mercury', hi: 'बुध', ta: 'புதன்', bn: 'বুধ' } },
  { id: 'guru',   phase: 2, topic: 'Grahas', href: '/learn/guru',   title: { en: 'Guru  –  Jupiter', hi: 'गुरु', ta: 'குரு', bn: 'গুরু' } },
  { id: 'shukra', phase: 2, topic: 'Grahas', href: '/learn/shukra', title: { en: 'Shukra  –  Venus', hi: 'शुक्र', ta: 'சுக்கிரன்', bn: 'শুক্র' } },
  { id: 'shani',  phase: 2, topic: 'Grahas', href: '/learn/shani',  title: { en: 'Shani  –  Saturn', hi: 'शनि', ta: 'சனி', bn: 'শনি' } },
  { id: 'rahu',   phase: 2, topic: 'Grahas', href: '/learn/rahu',   title: { en: 'Rahu  –  North Node', hi: 'राहु', ta: 'ராகு', bn: 'রাহু' } },
  { id: 'ketu',   phase: 2, topic: 'Grahas', href: '/learn/ketu',   title: { en: 'Ketu  –  South Node', hi: 'केतु', ta: 'கேது', bn: 'কেতু' } },
  // Reference guides promoted
  { id: 'grahas', phase: 2, topic: 'Grahas', href: '/learn/grahas', title: { en: 'Grahas  –  Complete Guide', hi: 'ग्रह  –  सम्पूर्ण मार्गदर्शक', ta: 'கிரகங்கள் வழிகாட்டி', bn: 'গ্রহ সম্পূর্ণ নির্দেশিকা' } },
  { id: 'rashis', phase: 2, topic: 'Rashis', href: '/learn/rashis', title: { en: 'Rashis  –  Complete Guide', hi: 'राशियाँ  –  विस्तृत', ta: 'ராசிகள் வழிகாட்டி', bn: 'রাশি সম্পূর্ণ নির্দেশিকা' } },
  { id: 'nakshatras', phase: 2, topic: 'Nakshatras', href: '/learn/nakshatras', title: { en: 'Nakshatras  –  Complete Guide', hi: 'नक्षत्र  –  विस्तृत', ta: 'நட்சத்திரங்கள் வழிகாட்டி', bn: 'নক্ষত্র সম্পূর্ণ নির্দেশিকা' } },
  { id: 'ayanamsha', phase: 2, topic: 'Ayanamsha', href: '/learn/ayanamsha', title: { en: 'Ayanamsha  –  Deep Dive', hi: 'अयनांश  –  विस्तृत', ta: 'அயனாம்ச ஆய்வு', bn: 'অযনাংশ গভীর আলোচনা' } },
  { id: 'aspects', phase: 2, topic: 'Grahas', href: '/learn/aspects', title: { en: 'Aspects  –  Graha Drishti', hi: 'दृष्टि  –  विस्तृत', ta: 'திருஷ்டி வழிகாட்டி', bn: 'দৃষ্টি নির্দেশিকা' } },

  // ── Phase 3: Pancha Anga (was Phase 2) ───────────────────────────────────
  // Tithi
  { id: '5-1', phase: 3, topic: 'Tithi',                 title: { en: 'What Is a Tithi?', hi: 'तिथि क्या है?', ta: 'திதி என்றால் என்ன?', bn: 'তিথি কী?' } },
  { id: '5-2', phase: 3, topic: 'Tithi',                 title: { en: 'Shukla & Krishna Paksha', hi: 'शुक्ल एवं कृष्ण पक्ष', ta: 'சுக்ல & கிருஷ்ண பக்ஷம்', bn: 'শুক্ল ও কৃষ্ণ পক্ষ' } },
  { id: '5-3', phase: 3, topic: 'Tithi',                 title: { en: 'Special Tithis & Vrat', hi: 'विशेष तिथियाँ', ta: 'சிறப்பு திதிகள் & விரதம்', bn: 'বিশেষ তিথি ও ব্রত' } },
  // Nakshatra
  { id: '6-1', phase: 3, topic: 'Nakshatra',             title: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र', ta: '27 நட்சத்திரங்கள்', bn: '27 নক্ষত্র' } },
  { id: '6-2', phase: 3, topic: 'Nakshatra',             title: { en: 'Padas & Navamsha', hi: 'पाद एवं नवांश', ta: 'பாதங்கள் & நவாம்சம்', bn: 'পাদ ও নবাংশ' } },
  { id: '6-3', phase: 3, topic: 'Nakshatra',             title: { en: 'Nakshatra Dasha Lords', hi: 'दशा स्वामी', ta: 'நட்சத்திர தசை அதிபதிகள்', bn: 'নক্ষত্র দশা স্বামী' } },
  { id: '6-4', phase: 3, topic: 'Nakshatra',             title: { en: 'Gana, Yoni, Nadi', hi: 'गण, योनि, नाडी', ta: 'கணம், யோனி, நாடி', bn: 'গণ, যোনি, নাড়ী' } },
  // Yoga, Karana & Vara
  { id: '7-1', phase: 3, topic: 'Yoga, Karana & Vara',   title: { en: 'Panchang Yoga', hi: 'पंचांग योग', ta: 'பஞ்சாங்க யோகம்', bn: 'পঞ্চাঙ্গ যোগ' } },
  { id: '7-2', phase: 3, topic: 'Yoga, Karana & Vara',   title: { en: 'Karana', hi: 'करण', ta: 'கரணம்', bn: 'করণ' } },
  { id: '7-3', phase: 3, topic: 'Yoga, Karana & Vara',   title: { en: 'Vara & Hora', hi: 'वार एवं होरा', ta: 'வாரம் & ஹோரை', bn: 'বার ও হোরা' } },
  { id: '7-4', phase: 3, topic: 'Yoga, Karana & Vara',   title: { en: 'Why 7 Days?  –  Chaldean Order', hi: '7 दिन क्यों?  –  कैल्डियन क्रम', ta: '7 நாட்கள் ஏன்?  –  கால்டியன் வரிசை', bn: '7 দিন কেন?  –  ক্যালডীয় ক্রম' } },
  // Muhurta
  { id: '8-1', phase: 3, topic: 'Muhurta',               title: { en: '30 Muhurtas Per Day', hi: '30 मुहूर्त', ta: 'நாளொன்றுக்கு 30 முகூர்த்தங்கள்', bn: 'প্রতিদিন 30 মুহূর্ত' } },
  // Absorbed standalone pages
  { id: 'tithis',   phase: 3, topic: 'Tithi',     href: '/learn/tithis',   title: { en: 'Tithis  –  Complete Reference', hi: 'तिथियाँ  –  विस्तृत', ta: 'திதிகள் கையேடு', bn: 'তিথি নির্দেশিকা' } },
  { id: 'yogas',    phase: 3, topic: 'Yoga',      href: '/learn/yoga',     title: { en: 'Yogas  –  27 Panchang + 104 Kundali', hi: 'योग  –  27 पंचांग + 104 कुण्डली', ta: 'யோகங்கள்  –  27 பஞ்சாங்க + 104 ஜாதக', bn: 'যোগ  –  ২৭ পঞ্চাঙ্গ + ১০৪ জাতক' } },
  { id: 'karanas',  phase: 3, topic: 'Karana',    href: '/learn/karanas',  title: { en: 'Karanas  –  Complete Reference', hi: 'करण  –  विस्तृत', ta: 'கரணங்கள் கையேடு', bn: 'করণ নির্দেশিকা' } },
  { id: 'vara',     phase: 3, topic: 'Vara',      href: '/learn/vara',     title: { en: 'Vara  –  Weekdays & Lords', hi: 'वार  –  विस्तृत', ta: 'வாரம் வழிகாட்டி', bn: 'বার নির্দেশিকা' } },
  { id: 'hora',     phase: 3, topic: 'Hora',      href: '/learn/hora',     title: { en: 'Hora  –  Why 7 Days & Ahoratra', hi: 'होरा  –  7 दिन और अहोरात्र', ta: 'ஹோரை  –  7 நாட்கள் ஏன்', bn: 'হোরা  –  7 দিন কেন' } },
  { id: 'muhurtas', phase: 3, topic: 'Muhurta',   href: '/learn/muhurtas', title: { en: 'Muhurtas  –  Complete Reference', hi: 'मुहूर्त  –  विस्तृत', ta: 'முகூர்த்தங்கள் கையேடு', bn: 'মুহূর্ত নির্দেশিকা' } },
  { id: 'masa',     phase: 3, topic: 'Masa',      href: '/learn/masa',     title: { en: 'Masa  –  Lunar Months', hi: 'मास  –  चान्द्र मास', ta: 'மாதம் வழிகாட்டி', bn: 'মাস নির্দেশিকা' } },
  { id: 'choghadiya', phase: 3, topic: 'Time Divisions', href: '/learn/choghadiya', title: { en: 'Choghadiya  –  Auspicious Periods', hi: 'चौघड़िया  –  शुभ अवधियाँ', ta: 'சோகடியா  –  சுப காலம்', bn: 'চৌঘড়িয়া  –  শুভ সময়' } },
  { id: 'career-muhurta', phase: 3, topic: 'Time Divisions', href: '/learn/career-muhurta', title: { en: 'Career Muhurta  –  Timing Career Decisions', hi: 'करियर मुहूर्त  –  करियर निर्णयों का समय', ta: 'தொழில் முகூர்த்தம்', bn: 'কেরিয়ার মুহূর্ত' } },
  { id: 'rahu-kaal', phase: 3, topic: 'Time Divisions', href: '/learn/rahu-kaal', title: { en: 'Rahu Kaal  –  Inauspicious Period', hi: 'राहु काल  –  अशुभ समय', ta: 'ராகு காலம்', bn: 'রাহু কাল' } },
  { id: 'tarabalam', phase: 3, topic: 'Time Divisions', href: '/learn/tarabalam', title: { en: 'Tarabalam  –  Nakshatra Strength', hi: 'ताराबलम्  –  नक्षत्र बल', ta: 'தாரபலம்', bn: 'তারাবলম' } },
  { id: 'chandra-darshan', phase: 3, topic: 'Tithi', href: '/learn/chandra-darshan', title: { en: 'Chandra Darshan  –  New Moon Sighting', hi: 'चन्द्र दर्शन', ta: 'சந்திர தரிசனம்', bn: 'চন্দ্র দর্শন' } },
  { id: 'panchak', phase: 3, topic: 'Inauspicious', href: '/learn/panchak', title: { en: 'Panchak  –  Five Inauspicious Nakshatras', hi: 'पंचक  –  पाँच अशुभ नक्षत्र', ta: 'பஞ்சக்  –  ஐந்து அசுப நட்சத்திரங்கள்', bn: 'পঞ্চক  –  পাঁচ অশুভ নক্ষত্র' } },
  { id: 'holashtak', phase: 3, topic: 'Inauspicious', href: '/learn/holashtak', title: { en: 'Holashtak  –  Eight Days Before Holi', hi: 'होलाष्टक', ta: 'ஹோலாஷ்டக்', bn: 'হোলাষ্টক' } },
  { id: 'amrit-siddhi-yoga', phase: 3, topic: 'Auspicious Yogas', href: '/learn/amrit-siddhi-yoga', title: { en: 'Amrit Siddhi Yoga', hi: 'अमृत सिद्धि योग', ta: 'அமிர்த சித்தி யோகம்', bn: 'অমৃত সিদ্ধি যোগ' } },
  { id: 'sarvartha-siddhi-yoga', phase: 3, topic: 'Auspicious Yogas', href: '/learn/sarvartha-siddhi-yoga', title: { en: 'Sarvartha Siddhi Yoga', hi: 'सर्वार्थ सिद्धि योग', ta: 'சர்வார்த்த சித்தி யோகம்', bn: 'সর্বার্থ সিদ্ধি যোগ' } },
  { id: 'guru-pushya-yoga', phase: 3, topic: 'Auspicious Yogas', href: '/learn/guru-pushya-yoga', title: { en: 'Guru Pushya Yoga', hi: 'गुरु पुष्य योग', ta: 'குரு புஷ்ய யோகம்', bn: 'গুরু পুষ্য যোগ' } },
  { id: 'ravi-pushya-yoga', phase: 3, topic: 'Auspicious Yogas', href: '/learn/ravi-pushya-yoga', title: { en: 'Ravi Pushya Yoga', hi: 'रवि पुष्य योग', ta: 'ரவி புஷ்ய யோகம்', bn: 'রবি পুষ্য যোগ' } },
  { id: 'dwipushkar-yoga', phase: 3, topic: 'Auspicious Yogas', href: '/learn/dwipushkar-yoga', title: { en: 'Dwipushkar Yoga', hi: 'द्विपुष्कर योग', ta: 'த்விபுஷ்கர் யோகம்', bn: 'দ্বিপুষ্কর যোগ' } },
  { id: 'tripushkar-yoga', phase: 3, topic: 'Auspicious Yogas', href: '/learn/tripushkar-yoga', title: { en: 'Tripushkar Yoga', hi: 'त्रिपुष्कर योग', ta: 'திரிபுஷ்கர் யோகம்', bn: 'ত্রিপুষ্কর যোগ' } },
  { id: 'siddha-yoga', phase: 3, topic: 'Auspicious Yogas', href: '/learn/siddha-yoga', title: { en: 'Siddha Yoga', hi: 'सिद्ध योग', ta: 'சித்த யோகம்', bn: 'সিদ্ধ যোগ' } },

  // ── Phase 4: The Chart (was Phase 3) ─────────────────────────────────────
  // Kundali
  { id: '9-1',  phase: 4, topic: 'Kundali',   title: { en: 'What Is a Birth Chart?', hi: 'जन्म कुण्डली', ta: 'ஜாதகம் என்றால் என்ன?', bn: 'জন্ম জাতক কী?' } },
  { id: '9-2',  phase: 4, topic: 'Kundali',   title: { en: 'Computing the Lagna', hi: 'लग्न गणना', ta: 'லக்னம் கணித்தல்', bn: 'লগ্ন গণনা' } },
  { id: '9-3',  phase: 4, topic: 'Kundali',   title: { en: 'Placing Planets', hi: 'ग्रह स्थापन', ta: 'கிரகங்களை நிலைநிறுத்தல்', bn: 'গ্রহ স্থাপন' } },
  { id: '9-4',  phase: 4, topic: 'Kundali',   title: { en: 'Reading a Chart', hi: 'कुण्डली पठन', ta: 'ஜாதகம் படித்தல்', bn: 'জাতক পঠন' } },
  // Bhavas
  { id: '10-1', phase: 4, topic: 'Bhavas',    title: { en: '12 Houses', hi: '12 भाव', ta: '12 பாவங்கள்', bn: '12 ভাব' } },
  { id: '10-2', phase: 4, topic: 'Bhavas',    title: { en: 'Kendra, Trikona, Dusthana', hi: 'केंद्र, त्रिकोण, दुःस्थान', ta: 'கேந்திரம், திரிகோணம், துஷ்டானம்', bn: 'কেন্দ্র, ত্রিকোণ, দুঃস্থান' } },
  { id: '10-3', phase: 4, topic: 'Bhavas',    title: { en: 'House Lords', hi: 'भावेश', ta: 'பாவ அதிபதிகள்', bn: 'ভাবেশ' } },
  // Vargas
  { id: '11-1', phase: 4, topic: 'Vargas',    title: { en: 'Why Divisional Charts?', hi: 'विभागीय चार्ट', ta: 'வர்க ஜாதகங்கள் ஏன்?', bn: 'বিভাগীয় চার্ট কেন?' } },
  { id: '11-2', phase: 4, topic: 'Vargas',    title: { en: 'Navamsha (D9)', hi: 'नवांश', ta: 'நவாம்சம் (D9)', bn: 'নবাংশ (D9)' } },
  { id: '11-3', phase: 4, topic: 'Vargas',    title: { en: 'Key Vargas D2-D60', hi: 'प्रमुख वर्ग', ta: 'முக்கிய வர்கங்கள் D2-D60', bn: 'প্রধান বর্গ D2-D60' } },
  // Dashas
  { id: '12-1', phase: 4, topic: 'Dashas',    title: { en: 'Vimshottari', hi: 'विंशोत्तरी', ta: 'விம்சோத்தரி', bn: 'বিংশোত্তরী' } },
  { id: '12-2', phase: 4, topic: 'Dashas',    title: { en: 'Reading Dasha Periods', hi: 'दशा पठन', ta: 'தசை காலங்களைப் படித்தல்', bn: 'দশা পঠন' } },
  { id: '12-3', phase: 4, topic: 'Dashas',    title: { en: 'Timing Events', hi: 'घटना समय', ta: 'நிகழ்வுகளின் நேரம்', bn: 'ঘটনার সময়' } },
  // Transits
  { id: '13-1', phase: 4, topic: 'Transits',  title: { en: 'How Transits Work', hi: 'गोचर', ta: 'கோசாரம் எப்படி செயல்படுகிறது', bn: 'গোচর কীভাবে কাজ করে' } },
  { id: '13-2', phase: 4, topic: 'Transits',  title: { en: 'Sade Sati', hi: 'साढ़े साती', ta: 'சாடே சாதி', bn: 'সাড়ে সাতি' } },
  { id: '13-3', phase: 4, topic: 'Transits',  title: { en: 'Ashtakavarga Transit Scoring', hi: 'अष्टकवर्ग गोचर', ta: 'அஷ்டகவர்க கோசார மதிப்பீடு', bn: 'অষ্টকবর্গ গোচর স্কোরিং' } },
  { id: '13-4', phase: 4, topic: 'Transits',  title: { en: 'Eclipses  –  Grahan & Rahu-Ketu Axis', hi: 'ग्रहण  –  राहु-केतु अक्ष', ta: 'கிரகணம்  –  கிரகண & ராகு-கேது அச்சு', bn: 'গ্রহণ  –  গ্রহণ ও রাহু-কেতু অক্ষ' } },
  // Absorbed standalone pages
  { id: 'lagna',    phase: 4, topic: 'Kundali',   href: '/learn/lagna',    title: { en: 'Lagna  –  The Ascendant', hi: 'लग्न  –  उदय राशि', ta: 'லக்னம்', bn: 'লগ্ন' } },
  { id: 'bhavas',   phase: 4, topic: 'Bhavas',    href: '/learn/bhavas',   title: { en: 'Bhavas  –  The 12 Houses', hi: 'भाव  –  12 भाव', ta: 'பாவங்கள்', bn: 'ভাব' } },
  { id: 'lordship', phase: 4, topic: 'Bhavas',    href: '/learn/lordship', title: { en: 'Lordship & Karakas  –  Reference', hi: 'स्वामित्व एवं कारक', ta: 'அதிபத்தியம் & காரகங்கள்', bn: 'স্বামিত্ব ও কারক' } },
  { id: 'birth-chart', phase: 4, topic: 'Kundali', href: '/learn/birth-chart', title: { en: 'Birth Chart  –  How to Read', hi: 'जन्म कुण्डली  –  कैसे पढ़ें', ta: 'ஜாதகம் படிப்பது எப்படி', bn: 'জন্ম জাতক কীভাবে পড়বেন' } },
  { id: 'patrika',  phase: 4, topic: 'Kundali',   href: '/learn/patrika',  title: { en: 'Patrika  –  Chart Layout', hi: 'पत्रिका  –  कुण्डली प्रारूप', ta: 'பத்ரிகா  –  ஜாதக வடிவமைப்பு', bn: 'পত্রিকা  –  জাতক বিন্যাস' } },
  { id: 'kundali',  phase: 4, topic: 'Kundali',   href: '/learn/kundali',  title: { en: 'Kundali  –  Complete Guide', hi: 'कुण्डली  –  सम्पूर्ण मार्गदर्शक', ta: 'ஜாதகம் வழிகாட்டி', bn: 'জাতক নির্দেশিকা' } },
  { id: 'planets',  phase: 4, topic: 'Planets',   href: '/learn/planets',  title: { en: 'Planets in Houses', hi: 'भावों में ग्रह', ta: 'பாவங்களில் கிரகங்கள்', bn: 'ভাবে গ্রহ' } },
  { id: 'planet-in-house', phase: 4, topic: 'Planets', href: '/learn/planet-in-house', title: { en: 'Planet-in-House  –  84 Interpretations', hi: 'ग्रह-भाव  –  84 फल', ta: 'கிரகம்-பாவம் 84 பலன்கள்', bn: 'গ্রহ-ভাব 84 ফল' } },
  { id: 'bhava-chalit', phase: 4, topic: 'Bhavas', href: '/learn/bhava-chalit', title: { en: 'Bhava Chalit  –  House System', hi: 'भाव चलित  –  भाव पद्धति', ta: 'பாவ சாலித்  –  பாவ முறை', bn: 'ভাব চলিত  –  ভাব পদ্ধতি' } },
  { id: 'dashas',   phase: 4, topic: 'Dashas',    href: '/learn/dashas',   title: { en: 'Dashas  –  Complete Reference', hi: 'दशाएँ  –  विस्तृत', ta: 'தசைகள் கையேடு', bn: 'দশা নির্দেশিকা' } },
  { id: 'transit-guide', phase: 4, topic: 'Transits', href: '/learn/transit-guide', title: { en: 'Transit Guide', hi: 'गोचर मार्गदर्शक', ta: 'கோசார வழிகாட்டி', bn: 'গোচর নির্দেশিকা' } },
  { id: 'sade-sati', phase: 4, topic: 'Transits', href: '/learn/sade-sati', title: { en: 'Sade Sati  –  Deep Dive', hi: 'साढ़े साती  –  विस्तृत', ta: 'சாடே சாதி ஆய்வு', bn: 'সাড়ে সাতি গভীর' } },
  { id: 'vargas',   phase: 4, topic: 'Vargas',    href: '/learn/vargas',   title: { en: 'Vargas  –  Divisional Charts', hi: 'वर्ग  –  विभागीय चार्ट', ta: 'வர்கங்கள்  –  பிரிவு ஜாதகங்கள்', bn: 'বর্গ  –  বিভাগীয় চার্ট' } },
  { id: 'nadi-amsha', phase: 4, topic: 'Vargas',  href: '/learn/nadi-amsha', title: { en: 'Nadi Amsha  –  D150', hi: 'नाड़ी अंश  –  D150', ta: 'நாடி அம்சம்  –  D150', bn: 'নাড়ী অংশ  –  D150' } },

  // ── Phase 5: Applied Jyotish (was Phase 4) ───────────────────────────────
  // Compatibility
  { id: '14-1', phase: 5, topic: 'Compatibility',    title: { en: 'Ashta Kuta', hi: 'अष्ट कूट', ta: 'அஷ்ட கூடம்', bn: 'অষ্ট কূট' } },
  { id: '14-2', phase: 5, topic: 'Compatibility',    title: { en: 'Key Kutas & Doshas', hi: 'प्रमुख कूट', ta: 'முக்கிய கூடங்கள் & தோஷங்கள்', bn: 'প্রধান কূট ও দোষ' } },
  { id: '14-3', phase: 5, topic: 'Compatibility',    title: { en: 'Beyond Kuta', hi: 'कूट से परे', ta: 'கூடத்தைத் தாண்டி', bn: 'কূটের বাইরে' } },
  // Yogas & Doshas
  { id: '15-1', phase: 5, topic: 'Yogas & Doshas',   title: { en: 'Pancha Mahapurusha', hi: 'पंच महापुरुष', ta: 'பஞ்ச மகாபுருஷ', bn: 'পঞ্চ মহাপুরুষ' } },
  { id: '15-2', phase: 5, topic: 'Yogas & Doshas',   title: { en: 'Raja & Dhana Yogas', hi: 'राज एवं धन योग', ta: 'ராஜ & தன யோகங்கள்', bn: 'রাজ ও ধন যোগ' } },
  { id: '15-3', phase: 5, topic: 'Yogas & Doshas',   title: { en: 'Common Doshas', hi: 'प्रमुख दोष', ta: 'பொதுவான தோஷங்கள்', bn: 'সাধারণ দোষ' } },
  { id: '15-4', phase: 5, topic: 'Yogas & Doshas',   title: { en: 'Remedial Measures', hi: 'उपाय', ta: 'பரிகாரங்கள்', bn: 'উপায়' } },
  { id: '32-1', phase: 5, topic: 'Yogas & Doshas',   title: { en: 'Kaal Sarpa Dosha  –  The Serpent\'s Embrace', hi: 'काल सर्प दोष  –  सर्प का आलिंगन', ta: 'கால சர்ப்ப தோஷம்  –  பாம்பின் அணைப்பு', bn: 'কাল সর্প দোষ  –  সর্পের আলিঙ্গন' } },
  { id: '33-1', phase: 5, topic: 'Yogas & Doshas',   title: { en: 'Manglik Dosha  –  Mars and Marriage', hi: 'मांगलिक दोष  –  मंगल और विवाह', ta: 'மாங்கலிக தோஷம்  –  செவ்வாயும் திருமணமும்', bn: 'মাঙ্গলিক দোষ  –  মঙ্গল ও বিবাহ' } },
  // Absorbed standalone pages
  { id: 'matching', phase: 5, topic: 'Compatibility', href: '/learn/matching', title: { en: 'Matching  –  Complete Guide', hi: 'मिलान  –  विस्तृत', ta: 'பொருத்தம் வழிகாட்டி', bn: 'মেলানো নির্দেশিকা' } },
  { id: 'compatibility', phase: 5, topic: 'Compatibility', href: '/learn/compatibility', title: { en: 'Compatibility  –  Beyond Kuta', hi: 'अनुकूलता  –  कूट से परे', ta: 'பொருத்தம் கூடத்தை தாண்டி', bn: 'অনুকূলতা কূটের বাইরে' } },
  { id: 'gun-milan', phase: 5, topic: 'Compatibility', href: '/learn/gun-milan', title: { en: 'Gun Milan  –  36-Point Scoring', hi: 'गुण मिलान  –  36 अंक', ta: 'குண மிலான்  –  36 புள்ளி', bn: 'গুণ মিলান  –  36 পয়েন্ট' } },
  { id: 'compatibility-advanced', phase: 5, topic: 'Compatibility', href: '/learn/compatibility-advanced', title: { en: 'Advanced Compatibility', hi: 'उन्नत अनुकूलता', ta: 'உயர்நிலை பொருத்தம்', bn: 'উন্নত অনুকূলতা' } },
  { id: 'doshas',   phase: 5, topic: 'Doshas',       href: '/learn/doshas',   title: { en: 'Doshas  –  Overview', hi: 'दोष  –  अवलोकन', ta: 'தோஷங்கள் கண்ணோட்டம்', bn: 'দোষ  –  সংক্ষেপ' } },
  { id: 'doshas-detailed', phase: 5, topic: 'Doshas', href: '/learn/doshas-detailed', title: { en: 'Doshas  –  Detailed Analysis', hi: 'दोष  –  विस्तृत विश्लेषण', ta: 'தோஷங்கள்  –  விரிவான பகுப்பாய்வு', bn: 'দোষ  –  বিস্তারিত বিশ্লেষণ' } },
  { id: 'kaal-sarp', phase: 5, topic: 'Doshas',      href: '/learn/kaal-sarp', title: { en: 'Kaal Sarp Dosha  –  Deep Dive', hi: 'काल सर्प दोष  –  विस्तृत', ta: 'கால சர்ப்ப தோஷம் ஆய்வு', bn: 'কাল সর্প দোষ গভীর' } },
  { id: 'mangal-dosha', phase: 5, topic: 'Doshas',   href: '/learn/mangal-dosha', title: { en: 'Mangal Dosha  –  Deep Dive', hi: 'मांगलिक दोष  –  विस्तृत', ta: 'மாங்கலிக தோஷம் ஆய்வு', bn: 'মাঙ্গলিক দোষ গভীর' } },
  { id: 'career',   phase: 5, topic: 'Life Areas',   href: '/learn/career',   title: { en: 'Career Astrology', hi: 'कैरियर ज्योतिष', ta: 'தொழில் ஜோதிடம்', bn: 'ক্যারিয়ার জ্যোতিষ' } },
  { id: 'marriage', phase: 5, topic: 'Life Areas',   href: '/learn/marriage', title: { en: 'Marriage Astrology', hi: 'विवाह ज्योतिष', ta: 'திருமண ஜோதிடம்', bn: 'বিবাহ জ্যোতিষ' } },
  { id: 'wealth',   phase: 5, topic: 'Life Areas',   href: '/learn/wealth',   title: { en: 'Wealth Astrology', hi: 'धन ज्योतिष', ta: 'செல்வ ஜோதிடம்', bn: 'ধন জ্যোতিষ' } },
  { id: 'health',   phase: 5, topic: 'Life Areas',   href: '/learn/health',   title: { en: 'Health Astrology', hi: 'स्वास्थ्य ज्योतिष', ta: 'நலம் ஜோதிடம்', bn: 'স্বাস্থ্য জ্যোতিষ' } },
  { id: 'children', phase: 5, topic: 'Life Areas',   href: '/learn/children', title: { en: 'Children & Progeny', hi: 'संतान ज्योतिष', ta: 'குழந்தை ஜோதிடம்', bn: 'সন্তান জ্যোতিষ' } },
  { id: 'remedies', phase: 5, topic: 'Remedies',     href: '/learn/remedies', title: { en: 'Remedies  –  Deep Dive', hi: 'उपाय  –  विस्तृत', ta: 'பரிகாரங்கள் ஆய்வு', bn: 'উপায় গভীর' } },
  { id: 'grahan-yoga', phase: 5, topic: 'Yogas & Doshas', href: '/learn/grahan-yoga', title: { en: 'Grahan Yoga', hi: 'ग्रहण योग', ta: 'கிரகண யோகம்', bn: 'গ্রহণ যোগ' } },

  // ── Phase 6: Classical Knowledge (was Phase 5) ───────────────────────────
  { id: '16-1', phase: 6, topic: 'Classical Texts',  title: { en: 'Astronomical Texts', hi: 'खगोलशास्त्रीय', ta: 'வானியல் நூல்கள்', bn: 'জ্যোতির্বিদ্যা গ্রন্থ' } },
  { id: '16-2', phase: 6, topic: 'Classical Texts',  title: { en: 'Hora Texts', hi: 'होरा ग्रंथ', ta: 'ஹோரா நூல்கள்', bn: 'হোরা গ্রন্থ' } },
  { id: '16-3', phase: 6, topic: 'Classical Texts',  title: { en: "India's Contributions", hi: 'भारत का योगदान', ta: "இந்தியாவின் பங்களிப்புகள்", bn: "ভারতের অবদান" } },
  // Muhurta
  { id: '17-1', phase: 6, topic: 'Muhurta',          title: { en: 'Muhurta Selection', hi: 'मुहूर्त चयन', ta: 'முகூர்த்த தேர்வு', bn: 'মুহূর্ত নির্বাচন' } },
  { id: '17-2', phase: 6, topic: 'Muhurta',          title: { en: 'Muhurta for Marriage', hi: 'विवाह मुहूर्त', ta: 'திருமண முகூர்த்தம்', bn: 'বিবাহ মুহূর্ত' } },
  { id: '17-3', phase: 6, topic: 'Muhurta',          title: { en: 'Muhurta for Property', hi: 'सम्पत्ति मुहूर्त', ta: 'சொத்து முகூர்த்தம்', bn: 'সম্পত্তি মুহূর্ত' } },
  { id: '17-4', phase: 6, topic: 'Muhurta',          title: { en: 'Muhurta for Education', hi: 'शिक्षा मुहूर्त', ta: 'கல்வி முகூர்த்தம்', bn: 'শিক্ষা মুহূর্ত' } },
  // Strength
  { id: '18-1', phase: 6, topic: 'Strength',         title: { en: 'Shadbala  –  6-Fold Strength', hi: 'षड्बल', ta: 'ஷட்பலம்  –  6 வகை வலிமை', bn: 'ষড়বল  –  6-ধরনের শক্তি' } },
  { id: '18-2', phase: 6, topic: 'Strength',         title: { en: 'Bhavabala  –  House Strength', hi: 'भावबल', ta: 'பாவபலம்  –  பாவ வலிமை', bn: 'ভাবাবল  –  ভাব শক্তি' } },
  { id: '18-3', phase: 6, topic: 'Strength',         title: { en: 'Ashtakavarga  –  Bindu Scoring', hi: 'अष्टकवर्ग', ta: 'அஷ்டகவர்கம்  –  பிந்து மதிப்பீடு', bn: 'অষ্টকবর্গ  –  বিন্দু স্কোরিং' } },
  { id: '18-4', phase: 6, topic: 'Strength',         title: { en: 'Avasthas  –  Planetary States', hi: 'अवस्थाएँ', ta: 'அவஸ்தைகள்  –  கிரக நிலைகள்', bn: 'অবস্থা  –  গ্রহ অবস্থা' } },
  { id: '18-5', phase: 6, topic: 'Strength',         title: { en: 'Vimshopaka  –  Varga Strength', hi: 'विंशोपक बल', ta: 'விம்சோபக  –  வர்க வலிமை', bn: 'বিংশোপক  –  বর্গ শক্তি' } },
  // Absorbed standalone pages
  { id: 'shadbala', phase: 6, topic: 'Strength', href: '/learn/shadbala', title: { en: 'Shadbala  –  Deep Dive', hi: 'षड्बल  –  विस्तृत', ta: 'ஷட்பலம் ஆய்வு', bn: 'ষড্বল গভীর' } },
  { id: 'bhavabala', phase: 6, topic: 'Strength', href: '/learn/bhavabala', title: { en: 'Bhavabala  –  Deep Dive', hi: 'भावबल  –  विस्तृत', ta: 'பாவபலம் ஆய்வு', bn: 'ভাববল গভীর' } },
  { id: 'avasthas', phase: 6, topic: 'Strength', href: '/learn/avasthas', title: { en: 'Avasthas  –  Planetary States', hi: 'अवस्थाएँ  –  विस्तृत', ta: 'அவஸ்தைகள் ஆய்வு', bn: 'অবস্থা গভীর' } },
  { id: 'sphutas',  phase: 6, topic: 'Strength', href: '/learn/sphutas', title: { en: 'Sphutas  –  Sensitive Points', hi: 'स्फुट  –  विस्तृत', ta: 'ஸ்புடங்கள் ஆய்வு', bn: 'স্ফুট গভীর' } },
  { id: 'ashtakavarga', phase: 6, topic: 'Strength', href: '/learn/ashtakavarga', title: { en: 'Ashtakavarga  –  Deep Dive', hi: 'अष्टकवर्ग  –  विस्तृत', ta: 'அஷ்டகவர்கம் ஆய்வு', bn: 'অষ্টকবর্গ গভীর' } },
  { id: 'ashtakavarga-dasha', phase: 6, topic: 'Strength', href: '/learn/ashtakavarga-dasha', title: { en: 'Ashtakavarga Dasha', hi: 'अष्टकवर्ग दशा', ta: 'அஷ்டகவர்க தசை', bn: 'অষ্টকবর্গ দশা' } },
  { id: 'classical-texts', phase: 6, topic: 'Classical Texts', href: '/learn/classical-texts', title: { en: 'Classical Texts  –  Guide', hi: 'शास्त्रीय ग्रन्थ', ta: 'சாஸ்திர நூல்கள்', bn: 'শাস্ত্রীয় গ্রন্থ' } },
  { id: 'library', phase: 6, topic: 'Classical Texts', href: '/learn/library', title: { en: 'Text Library', hi: 'ग्रंथागार', ta: 'நூலகம்', bn: 'গ্রন্থাগার' } },
  { id: 'advanced', phase: 6, topic: 'Advanced', href: '/learn/advanced', title: { en: 'Advanced Jyotish', hi: 'उन्नत ज्योतिष', ta: 'உயர்நிலை ஜோதிடம்', bn: 'উন্নত জ্যোতিষ' } },
  { id: 'advanced-houses', phase: 6, topic: 'Advanced', href: '/learn/advanced-houses', title: { en: 'Advanced Houses', hi: 'उन्नत भाव', ta: 'உயர்நிலை பாவங்கள்', bn: 'উন্নত ভাব' } },
  { id: 'calculations', phase: 6, topic: 'Advanced', href: '/learn/calculations', title: { en: 'Calculations  –  Behind the Engine', hi: 'गणना  –  इंजन के पीछे', ta: 'கணிதங்கள்  –  இயந்திரத்தின் பின்னால்', bn: 'গণনা  –  ইঞ্জিনের পিছনে' } },

  // ── Phase 7: Jaimini System (was Phase 6) ────────────────────────────────
  { id: '19-1', phase: 7, topic: 'Jaimini',          title: { en: 'Chara Karakas', hi: 'चर कारक', ta: 'சர காரகங்கள்', bn: 'চর কারক' } },
  { id: '19-2', phase: 7, topic: 'Jaimini',          title: { en: 'Rashi Drishti', hi: 'राशि दृष्टि', ta: 'ராசி திருஷ்டி', bn: 'রাশি দৃষ্টি' } },
  { id: '19-3', phase: 7, topic: 'Jaimini',          title: { en: 'Argala', hi: 'अर्गला', ta: 'அர்கலா', bn: 'অর্গলা' } },
  { id: '19-4', phase: 7, topic: 'Jaimini',          title: { en: 'Special Lagnas', hi: 'विशेष लग्न', ta: 'சிறப்பு லக்னங்கள்', bn: 'বিশেষ লগ্ন' } },
  // Absorbed standalone pages
  { id: 'jaimini', phase: 7, topic: 'Jaimini', href: '/learn/jaimini', title: { en: 'Jaimini  –  Complete Reference', hi: 'जैमिनी  –  विस्तृत', ta: 'ஜைமினி கையேடு', bn: 'জৈমিনী নির্দেশিকা' } },
  { id: 'argala', phase: 7, topic: 'Jaimini', href: '/learn/argala', title: { en: 'Argala  –  Deep Dive', hi: 'अर्गला  –  विस्तृत', ta: 'அர்கலா ஆய்வு', bn: 'অর্গলা গভীর' } },

  // ── Phase 8: KP System (was Phase 7) ─────────────────────────────────────
  { id: '20-1', phase: 8, topic: 'KP System',        title: { en: 'Placidus Houses', hi: 'प्लेसिडस भाव', ta: 'பிளாசிடஸ் பாவங்கள்', bn: 'প্লেসিডাস ভাব' } },
  { id: '20-2', phase: 8, topic: 'KP System',        title: { en: '249 Sub-Lord Table', hi: '249 उप-स्वामी सारणी', ta: '249 உப-அதிபதி அட்டவணை', bn: '249 উপ-স্বামী সারণী' } },
  { id: '20-3', phase: 8, topic: 'KP System',        title: { en: 'Significators', hi: 'कारकत्व', ta: 'காரகத்துவங்கள்', bn: 'কারকত্ব' } },
  { id: '20-4', phase: 8, topic: 'KP System',        title: { en: 'Ruling Planets', hi: 'शासक ग्रह', ta: 'ஆளும் கிரகங்கள்', bn: 'শাসক গ্রহ' } },
  // Absorbed standalone page
  { id: 'kp-system', phase: 8, topic: 'KP System', href: '/learn/kp-system', title: { en: 'KP System  –  Complete Guide', hi: 'केपी पद्धति  –  विस्तृत', ta: 'கேபி முறை வழிகாட்டி', bn: 'কেপি পদ্ধতি নির্দেশিকা' } },

  // ── Phase 9: Varshaphal (was Phase 8) ────────────────────────────────────
  { id: '21-1', phase: 9, topic: 'Varshaphal',       title: { en: 'Tajika Aspects', hi: 'ताजिक दृष्टि', ta: 'தாஜிக திருஷ்டிகள்', bn: 'তাজিক দৃষ্টি' } },
  { id: '21-2', phase: 9, topic: 'Varshaphal',       title: { en: 'Sahams', hi: 'सहम', ta: 'சகங்கள்', bn: 'সহম' } },
  { id: '21-3', phase: 9, topic: 'Varshaphal',       title: { en: 'Mudda Dasha', hi: 'मुद्दा दशा', ta: 'முத்தா தசை', bn: 'মুদ্দা দশা' } },
  { id: '21-4', phase: 9, topic: 'Varshaphal',       title: { en: 'Tithi Pravesha', hi: 'तिथि प्रवेश', ta: 'திதி பிரவேசம்', bn: 'তিথি প্রবেশ' } },
  // Absorbed standalone pages
  { id: 'varshaphal', phase: 9, topic: 'Varshaphal', href: '/learn/varshaphal', title: { en: 'Varshaphal  –  Complete Guide', hi: 'वर्षफल  –  विस्तृत', ta: 'வர்ஷபலன் வழிகாட்டி', bn: 'বর্ষফল নির্দেশিকা' } },
  { id: 'tithi-pravesha', phase: 9, topic: 'Varshaphal', href: '/learn/tithi-pravesha', title: { en: 'Tithi Pravesha  –  Deep Dive', hi: 'तिथि प्रवेश  –  विस्तृत', ta: 'திதி பிரவேசம் ஆய்வு', bn: 'তিথি প্রবেশ গভীর' } },

  // ── Phase 10: Astronomy Engine (was Phase 9) ─────────────────────────────
  { id: '22-1', phase: 10, topic: 'Astronomy',        title: { en: 'Julian Day', hi: 'जूलियन दिवस', ta: 'ஜூலியன் நாள்', bn: 'জুলিয়ান দিবস' } },
  { id: '22-2', phase: 10, topic: 'Astronomy',        title: { en: 'Finding the Sun', hi: 'सूर्य की खोज', ta: 'சூரியனைக் கண்டறிதல்', bn: 'সূর্যের অনুসন্ধান' } },
  { id: '22-3', phase: 10, topic: 'Astronomy',        title: { en: 'Finding the Moon', hi: 'चन्द्रमा की खोज', ta: 'சந்திரனைக் கண்டறிதல்', bn: 'চন্দ্রের অনুসন্ধান' } },
  { id: '22-4', phase: 10, topic: 'Astronomy',        title: { en: 'Sunrise Calculation', hi: 'सूर्योदय गणना', ta: 'சூரிய உதய கணிதம்', bn: 'সূর্যোদয় গণনা' } },
  { id: '22-5', phase: 10, topic: 'Astronomy',        title: { en: 'Moonrise Calculation', hi: 'चन्द्रोदय गणना', ta: 'சந்திர உதய கணிதம்', bn: 'চন্দ্রোদয় গণনা' } },
  { id: '22-6', phase: 10, topic: 'Astronomy',        title: { en: 'Equation of Time', hi: 'समय का समीकरण', ta: 'கால சமன்பாடு', bn: 'সময়ের সমীকরণ' } },
  // Absorbed standalone pages  –  labs
  { id: 'labs-panchang', phase: 10, topic: 'Labs', href: '/learn/labs/panchang', title: { en: 'Lab: Panchang Calculator', hi: 'प्रयोगशाला: पंचांग गणक', ta: 'ஆய்வகம்: பஞ்சாங்க கணிப்பான்', bn: 'ল্যাব: পঞ্চাঙ্গ গণক' } },
  { id: 'labs-moon', phase: 10, topic: 'Labs', href: '/learn/labs/moon', title: { en: 'Lab: Moon Position', hi: 'प्रयोगशाला: चन्द्र स्थिति', ta: 'ஆய்வகம்: சந்திர நிலை', bn: 'ল্যাব: চন্দ্র অবস্থান' } },
  { id: 'labs-shadbala', phase: 10, topic: 'Labs', href: '/learn/labs/shadbala', title: { en: 'Lab: Shadbala Calculator', hi: 'प्रयोगशाला: षड्बल गणक', ta: 'ஆய்வகம்: ஷட்பல கணிப்பான்', bn: 'ল্যাব: ষড়বল গণক' } },
  { id: 'labs-dasha', phase: 10, topic: 'Labs', href: '/learn/labs/dasha', title: { en: 'Lab: Dasha Calculator', hi: 'प्रयोगशाला: दशा गणक', ta: 'ஆய்வகம்: தசை கணிப்பான்', bn: 'ল্যাব: দশা গণক' } },
  { id: 'labs-kp', phase: 10, topic: 'Labs', href: '/learn/labs/kp', title: { en: 'Lab: KP System', hi: 'प्रयोगशाला: केपी पद्धति', ta: 'ஆய்வகம்: கேபி முறை', bn: 'ল্যাব: কেপি পদ্ধতি' } },
  // Other absorbed pages
  { id: 'retrograde-effects', phase: 10, topic: 'Astronomy', href: '/learn/retrograde-effects', title: { en: 'Retrograde Effects', hi: 'वक्री प्रभाव', ta: 'வக்கிர பாதிப்புகள்', bn: 'বক্রী প্রভাব' } },
  { id: 'combustion', phase: 10, topic: 'Astronomy', href: '/learn/combustion', title: { en: 'Combustion (Asta)', hi: 'अस्त  –  विस्तृत', ta: 'அஸ்தமனம்', bn: 'অস্ত' } },
  { id: 'planetary-cycles', phase: 10, topic: 'Astronomy', href: '/learn/planetary-cycles', title: { en: 'Planetary Cycles', hi: 'ग्रह चक्र', ta: 'கிரக சுழற்சிகள்', bn: 'গ্রহ চক্র' } },

  // ── Phase 11: Advanced Prediction (was Phase 10) ─────────────────────────
  { id: '23-1', phase: 11, topic: 'Prediction',      title: { en: 'Eclipse Prediction', hi: 'ग्रहण भविष्यवाणी', ta: 'கிரகண கணிப்பு', bn: 'গ্রহণ ভবিষ্যদ্বাণী' } },
  { id: '23-2', phase: 11, topic: 'Prediction',      title: { en: 'Retrograde & Combustion', hi: 'वक्री और अस्त', ta: 'வக்கிரம் & அஸ்தமனம்', bn: 'বক্রী ও অস্ত' } },
  { id: '23-3', phase: 11, topic: 'Prediction',      title: { en: 'Chakra Systems', hi: 'चक्र प्रणालियाँ', ta: 'சக்கர அமைப்புகள்', bn: 'চক্র প্রণালী' } },
  { id: '23-4', phase: 11, topic: 'Prediction',      title: { en: 'Sphutas & Sensitive Points', hi: 'स्फुट एवं संवेदनशील बिन्दु', ta: 'ஸ்புடங்கள் & உணர்திறன் புள்ளிகள்', bn: 'স্ফুট ও সংবেদনশীল বিন্দু' } },
  { id: '23-5', phase: 11, topic: 'Prediction',      title: { en: 'Prashna Yogas', hi: 'प्रश्न योग', ta: 'பிரசன யோகங்கள்', bn: 'প্রশ্ন যোগ' } },
  { id: '24-1', phase: 11, topic: 'Prediction',      title: { en: 'Ganda Mula Nakshatras', hi: 'गण्ड मूल नक्षत्र', ta: 'கண்ட மூல நட்சத்திரங்கள்', bn: 'গণ্ড মূল নক্ষত্র' } },
  // Absorbed standalone pages
  { id: 'eclipses', phase: 11, topic: 'Prediction', href: '/learn/eclipses', title: { en: 'Eclipses (Grahan)  –  Deep Dive', hi: 'ग्रहण  –  विस्तृत', ta: 'கிரகணம் ஆய்வு', bn: 'গ্রহণ গভীর' } },
  { id: 'gochar', phase: 11, topic: 'Transits', href: '/learn/gochar', title: { en: 'Gochar  –  Transit Effects', hi: 'गोचर  –  गोचर फल', ta: 'கோசாரம்  –  கோசார பலன்கள்', bn: 'গোচর  –  গোচর ফল' } },
  { id: 'transits', phase: 11, topic: 'Transits', href: '/learn/transits', title: { en: 'Transits  –  Planet-by-Planet', hi: 'गोचर  –  ग्रहवार', ta: 'கோசாரம்  –  கிரகவாரியாக', bn: 'গোচর  –  গ্রহ অনুযায়ী' } },
  { id: 'dasha-sandhi', phase: 11, topic: 'Prediction', href: '/learn/dasha-sandhi', title: { en: 'Dasha Sandhi  –  Transition Periods', hi: 'दशा संधि  –  संक्रमण काल', ta: 'தசை சந்தி  –  மாற்றக் காலம்', bn: 'দশা সন্ধি  –  সংক্রমণ কাল' } },
  { id: 'tippanni', phase: 11, topic: 'Prediction', href: '/learn/tippanni', title: { en: 'Tippanni  –  Chart Commentary', hi: 'टिप्पणी  –  कुण्डली विवेचना', ta: 'டிப்பணி  –  ஜாதக விளக்கம்', bn: 'টিপ্পনী  –  জাতক ব্যাখ্যা' } },

  // ── Phase 12: Festival Calendar Science (same) ───────────────────────────
  { id: '27-1', phase: 12, topic: 'Festival Calendar Science', title: { en: 'Festival Timing Rules (Kala-Vyapti)', hi: 'त्योहार समय नियम (काल-व्याप्ति)', ta: 'திருவிழா நேர விதிகள்', bn: 'উৎসব সময় নিয়ম' } },
  { id: '27-2', phase: 12, topic: 'Festival Calendar Science', title: { en: 'Adhika Masa  –  The Intercalary Month', hi: 'अधिक मास  –  अन्तर्वेशी मास', ta: 'அதிக மாசம்', bn: 'অধিক মাস' } },
  { id: '27-3', phase: 12, topic: 'Festival Calendar Science', title: { en: 'Smarta & Vaishnava Calendar Systems', hi: 'स्मार्त और वैष्णव पंचांग पद्धतियाँ', ta: 'ஸ்மார்த & வைஷ்ணவ நாள்காட்டி', bn: 'স্মার্ত ও বৈষ্ণব পঞ্জিকা' } },
  // Absorbed standalone pages
  { id: 'adhika-masa', phase: 12, topic: 'Festival Calendar Science', href: '/learn/adhika-masa', title: { en: 'Adhika Masa  –  Deep Dive', hi: 'अधिक मास  –  विस्तृत', ta: 'அதிக மாசம் ஆய்வு', bn: 'অধিক মাস গভীর' } },
  { id: 'festival-rules', phase: 12, topic: 'Festival Calendar Science', href: '/learn/festival-rules', title: { en: 'Festival Timing Rules', hi: 'त्योहार नियम', ta: 'திருவிழா விதிகள்', bn: 'উৎসব নিয়ম' } },
  { id: 'smarta-vaishnava', phase: 12, topic: 'Festival Calendar Science', href: '/learn/smarta-vaishnava', title: { en: 'Smarta & Vaishnava Systems', hi: 'स्मार्त और वैष्णव', ta: 'ஸ்மார்த & வைஷ்ணவ', bn: 'স্মার্ত ও বৈষ্ণব' } },

  // ── Phase 13: Prashna & Medical (same) ───────────────────────────────────
  { id: '28-1', phase: 13, topic: 'Prashna', title: { en: 'Introduction to Prashna Jyotish', hi: 'प्रश्न ज्योतिष का परिचय', ta: 'பிரஷ்ன ஜோதிடம் அறிமுகம்', bn: 'প্রশ্ন জ্যোতিষ পরিচিতি' } },
  { id: '28-2', phase: 13, topic: 'Prashna', title: { en: 'Ashtamangala Prashna', hi: 'अष्टमंगल प्रश्न', ta: 'அஷ்டமங்கல பிரஷ்னம்', bn: 'অষ্টমঙ্গল প্রশ্ন' } },
  { id: '29-1', phase: 13, topic: 'Medical Jyotish', title: { en: 'Medical Jyotish  –  Body & Planets', hi: 'चिकित्सा ज्योतिष  –  शरीर और ग्रह', ta: 'மருத்துவ ஜோதிடம்  –  உடல் & கிரகங்கள்', bn: 'চিকিৎসা জ্যোতিষ  –  শরীর ও গ্রহ' } },
  { id: '29-2', phase: 13, topic: 'Medical Jyotish', title: { en: 'Ayurvedic Timing  –  Dosha & Dinacharya', hi: 'आयुर्वेदिक समय  –  दोष और दिनचर्या', ta: 'ஆயுர்வேத நேரம்  –  தோஷம் & தினசரி', bn: 'আয়ুর্বেদিক সময়  –  দোষ ও দিনচর্যা' } },
  // Absorbed standalone pages
  { id: 'prashna', phase: 13, topic: 'Prashna', href: '/learn/prashna', title: { en: 'Prashna  –  Complete Guide', hi: 'प्रश्न  –  विस्तृत', ta: 'பிரஷ்னம் வழிகாட்டி', bn: 'প্রশ্ন নির্দেশিকা' } },
  { id: 'ayurveda-jyotish', phase: 13, topic: 'Medical Jyotish', href: '/learn/ayurveda-jyotish', title: { en: 'Ayurveda & Jyotish', hi: 'आयुर्वेद और ज्योतिष', ta: 'ஆயுர்வேதம் & ஜோதிடம்', bn: 'আয়ুর্বেদ ও জ্যোতিষ' } },
  { id: 'pancha-pakshi', phase: 13, topic: 'Prashna', href: '/learn/pancha-pakshi', title: { en: 'Pancha Pakshi', hi: 'पंच पक्षी', ta: 'பஞ்ச பக்ஷி', bn: 'পঞ্চ পক্ষী' } },

  // ── Phase 14: Classical Mastery (same) ───────────────────────────────────
  { id: '30-1', phase: 14, topic: 'Classical Texts', title: { en: 'Reading BPHS  –  Structure & Method', hi: 'BPHS पढ़ना  –  संरचना और पद्धति', ta: 'BPHS படித்தல்  –  அமைப்பு & முறை', bn: 'BPHS পড়া  –  গঠন ও পদ্ধতি' } },
  { id: '30-2', phase: 14, topic: 'Classical Texts', title: { en: 'Phaladeepika  –  The Lamp of Results', hi: 'फलदीपिका  –  फलों का दीप', ta: 'பலதீபிகா  –  பலன்களின் தீபம்', bn: 'ফলদীপিকা  –  ফলের দীপ' } },
  { id: '30-3', phase: 14, topic: 'Classical Texts', title: { en: 'Saravali & Jataka Parijata', hi: 'सारावली और जातक पारिजात', ta: 'சாராவளி & ஜாதக பாரிஜாதம்', bn: 'সারাবলী ও জাতক পারিজাত' } },
  { id: '31-1', phase: 14, topic: 'Muhurta', title: { en: 'Muhurta Mastery  –  Beyond the Basics', hi: 'मुहूर्त निपुणता  –  मूल बातों से आगे', ta: 'முகூர்த்த தேர்ச்சி  –  அடிப்படைக்கு அப்பால்', bn: 'মুহূর্ত দক্ষতা  –  মৌলিক বিষয়ের বাইরে' } },
  // Absorbed standalone pages
  { id: 'muhurta-selection', phase: 14, topic: 'Muhurta', href: '/learn/muhurta-selection', title: { en: 'Muhurta Selection  –  Practical Guide', hi: 'मुहूर्त चयन  –  व्यावहारिक मार्गदर्शक', ta: 'முகூர்த்த தேர்வு  –  நடைமுறை வழிகாட்டி', bn: 'মুহূর্ত নির্বাচন  –  ব্যবহারিক নির্দেশিকা' } },
  { id: 'vivah-muhurta', phase: 14, topic: 'Muhurta', href: '/learn/vivah-muhurta', title: { en: 'Vivah Muhurta  –  Marriage Timing', hi: 'विवाह मुहूर्त  –  विवाह समय', ta: 'விவாக முகூர்த்தம்', bn: 'বিবাহ মুহূর্ত' } },

  // ── Phase 15: Rashi Deep Dives (NEW) ─────────────────────────────────────
  { id: 'mesha',     phase: 15, topic: 'Rashi', href: '/learn/mesha',     title: { en: 'Mesha  –  Aries', hi: 'मेष राशि', ta: 'மேஷம்', bn: 'মেষ' } },
  { id: 'vrishabha', phase: 15, topic: 'Rashi', href: '/learn/vrishabha', title: { en: 'Vrishabha  –  Taurus', hi: 'वृषभ राशि', ta: 'ரிஷபம்', bn: 'বৃষভ' } },
  { id: 'mithuna',   phase: 15, topic: 'Rashi', href: '/learn/mithuna',   title: { en: 'Mithuna  –  Gemini', hi: 'मिथुन राशि', ta: 'மிதுனம்', bn: 'মিথুন' } },
  { id: 'karka',     phase: 15, topic: 'Rashi', href: '/learn/karka',     title: { en: 'Karka  –  Cancer', hi: 'कर्क राशि', ta: 'கடகம்', bn: 'কর্কট' } },
  { id: 'simha',     phase: 15, topic: 'Rashi', href: '/learn/simha',     title: { en: 'Simha  –  Leo', hi: 'सिंह राशि', ta: 'சிம்மம்', bn: 'সিংহ' } },
  { id: 'kanya',     phase: 15, topic: 'Rashi', href: '/learn/kanya',     title: { en: 'Kanya  –  Virgo', hi: 'कन्या राशि', ta: 'கன்னி', bn: 'কন্যা' } },
  { id: 'tula',      phase: 15, topic: 'Rashi', href: '/learn/tula',      title: { en: 'Tula  –  Libra', hi: 'तुला राशि', ta: 'துலாம்', bn: 'তুলা' } },
  { id: 'vrishchika', phase: 15, topic: 'Rashi', href: '/learn/vrishchika', title: { en: 'Vrishchika  –  Scorpio', hi: 'वृश्चिक राशि', ta: 'விருச்சிகம்', bn: 'বৃশ্চিক' } },
  { id: 'dhanu',     phase: 15, topic: 'Rashi', href: '/learn/dhanu',     title: { en: 'Dhanu  –  Sagittarius', hi: 'धनु राशि', ta: 'தனுசு', bn: 'ধনু' } },
  { id: 'makara',    phase: 15, topic: 'Rashi', href: '/learn/makara',    title: { en: 'Makara  –  Capricorn', hi: 'मकर राशि', ta: 'மகரம்', bn: 'মকর' } },
  { id: 'kumbha',    phase: 15, topic: 'Rashi', href: '/learn/kumbha',    title: { en: 'Kumbha  –  Aquarius', hi: 'कुम्भ राशि', ta: 'கும்பம்', bn: 'কুম্ভ' } },
  { id: 'meena',     phase: 15, topic: 'Rashi', href: '/learn/meena',     title: { en: 'Meena  –  Pisces', hi: 'मीन राशि', ta: 'மீனம்', bn: 'মীন' } },

  // ── Phase 16: Special Topics (NEW) ───────────────────────────────────────
  { id: 'caesarean-muhurta', phase: 16, topic: 'Special Topics', href: '/learn/caesarean-muhurta', title: { en: 'Caesarean Muhurta', hi: 'सिजेरियन मुहूर्त', ta: 'சிசேரியன் முகூர்த்தம்', bn: 'সিজারিয়ান মুহূর্ত' } },
  { id: 'nakshatra-baby-names', phase: 16, topic: 'Special Topics', href: '/learn/nakshatra-baby-names', title: { en: 'Nakshatra Baby Names', hi: 'नक्षत्र शिशु नाम', ta: 'நட்சத்திர குழந்தைப் பெயர்கள்', bn: 'নক্ষত্র শিশু নাম' } },
  { id: 'nakshatra-pada', phase: 16, topic: 'Special Topics', href: '/learn/nakshatra-pada', title: { en: 'Nakshatra Pada  –  All 108', hi: 'नक्षत्र पाद  –  सभी 108', ta: 'நட்சத்திர பாதம்  –  அனைத்து 108', bn: 'নক্ষত্র পাদ  –  সব 108' } },
  { id: 'retrograde-visualizer', phase: 16, topic: 'Special Topics', href: '/learn/retrograde-visualizer', title: { en: 'Retrograde Visualizer', hi: 'वक्री दृश्यक', ta: 'வக்கிர காட்சியாக்கி', bn: 'বক্রী ভিজ্যুয়ালাইজার' } },
  { id: 'yoga-animator', phase: 16, topic: 'Special Topics', href: '/learn/yoga-animator', title: { en: 'Yoga Animator', hi: 'योग एनिमेटर', ta: 'யோக அனிமேட்டர்', bn: 'যোগ অ্যানিমেটর' } },
];

/** All entries are now curriculum modules  –  no ref: prefix entries */
export const CURRICULUM_MODULES = MODULE_SEQUENCE.filter(m => !m.id.startsWith('ref:'));
export const TOTAL_MODULES = CURRICULUM_MODULES.length;

// ── Phase metadata ────────────────────────────────────────────────────────────

interface PhaseInfo {
  phase: number;
  title: Record<string, string>;
  /** One-line English description for newcomers — displayed under the phase title */
  subtitle?: string;
  count: number;
}

export const PHASE_INFO: PhaseInfo[] = [
  { phase: 0,  title: { en: 'Pre-Foundation', hi: 'पूर्व-आधार', ta: 'முன்-அடித்தளம்', bn: 'প্রাক-ভিত্তি' },         subtitle: 'What is Jyotish? Start from zero.', count: CURRICULUM_MODULES.filter(m => m.phase === 0).length },
  { phase: 1,  title: { en: "India's Contributions", hi: 'भारत का योगदान', ta: "இந்தியாவின் பங்களிப்புகள்", bn: "ভারতের অবদান" },    subtitle: 'The mathematical heritage behind this tradition', count: CURRICULUM_MODULES.filter(m => m.phase === 1).length },
  { phase: 2,  title: { en: 'The Sky', hi: 'आकाश', ta: 'வானம்', bn: 'আকাশ' },               subtitle: 'Planets, signs, nakshatras — the building blocks', count: CURRICULUM_MODULES.filter(m => m.phase === 2).length },
  { phase: 3,  title: { en: 'Pancha Anga', hi: 'पंच अंग', ta: 'பஞ்ச அங்கம்', bn: 'পঞ্চ অঙ্গ' },            subtitle: 'The five daily elements of the Vedic calendar', count: CURRICULUM_MODULES.filter(m => m.phase === 3).length },
  { phase: 4,  title: { en: 'The Chart', hi: 'कुण्डली', ta: 'ஜாதகம்', bn: 'জাতক' },            subtitle: 'Reading a birth chart — houses, aspects, dignity', count: CURRICULUM_MODULES.filter(m => m.phase === 4).length },
  { phase: 5,  title: { en: 'Applied Jyotish', hi: 'व्यावहारिक ज्योतिष', ta: 'பயன்பாட்டு ஜோதிடம்', bn: 'ব্যবহারিক জ্যোতিষ' }, subtitle: 'Matching, muhurta, transits — practical applications', count: CURRICULUM_MODULES.filter(m => m.phase === 5).length },
  { phase: 6,  title: { en: 'Classical Knowledge', hi: 'शास्त्रीय ज्ञान', ta: 'சாஸ்திர ஞானம்', bn: 'শাস্ত্রীয় জ্ঞান' },   subtitle: 'BPHS, Phaladeepika — the original source texts', count: CURRICULUM_MODULES.filter(m => m.phase === 6).length },
  { phase: 7,  title: { en: 'Jaimini System', hi: 'जैमिनी पद्धति', ta: 'ஜைமினி முறை', bn: 'জৈমিনী পদ্ধতি' },     subtitle: 'An alternative prediction framework using signs', count: CURRICULUM_MODULES.filter(m => m.phase === 7).length },
  { phase: 8,  title: { en: 'KP System', hi: 'केपी पद्धति', ta: 'கேபி முறை', bn: 'কেপি পদ্ধতি' },        subtitle: 'Krishnamurti Paddhati — sub-lord based prediction', count: CURRICULUM_MODULES.filter(m => m.phase === 8).length },
  { phase: 9,  title: { en: 'Varshaphal', hi: 'वर्षफल', ta: 'வர்ஷபலன்', bn: 'বর্ষফল' },             subtitle: 'Solar return — your annual horoscope', count: CURRICULUM_MODULES.filter(m => m.phase === 9).length },
  { phase: 10, title: { en: 'Astronomy Engine', hi: 'खगोलीय गणना', ta: 'வானியல் கணிதம்', bn: 'জ্যোতির্বিদ্যা গণনা' },       subtitle: 'The maths behind the calculations', count: CURRICULUM_MODULES.filter(m => m.phase === 10).length },
  { phase: 11, title: { en: 'Advanced Prediction', hi: 'उन्नत भविष्यवाणी', ta: 'உயர்நிலை கணிப்பு', bn: 'উন্নত ভবিষ্যদ্বাণী' },  subtitle: 'Shadbala, Ashtakavarga, Argala — expert techniques', count: CURRICULUM_MODULES.filter(m => m.phase === 11).length },
  { phase: 12, title: { en: 'Festival Calendar Science', hi: 'त्योहार कैलेंडर विज्ञान', ta: 'திருவிழா நாட்காட்டி அறிவியல்', bn: 'উৎসব পঞ্জিকা বিজ্ঞান' }, subtitle: 'How Hindu festivals are astronomically determined', count: CURRICULUM_MODULES.filter(m => m.phase === 12).length },
  { phase: 13, title: { en: 'Prashna & Medical Jyotish', hi: 'प्रश्न और चिकित्सा ज्योतिष', ta: 'பிரஷ்னம் & மருத்துவ ஜோதிடம்', bn: 'প্রশ্ন ও চিকিৎসা জ্যোতিষ' }, subtitle: 'Horary astrology and health indicators', count: CURRICULUM_MODULES.filter(m => m.phase === 13).length },
  { phase: 14, title: { en: 'Classical Mastery', hi: 'शास्त्रीय प्रवीणता', ta: 'சாஸ்திர தேர்ச்சி', bn: 'শাস্ত্রীয় দক্ষতা' }, subtitle: 'Deep study of classical texts and commentaries', count: CURRICULUM_MODULES.filter(m => m.phase === 14).length },
  { phase: 15, title: { en: 'Rashi Deep Dives', hi: 'राशि गहन अध्ययन', ta: 'ராசி ஆழ்ந்த ஆய்வு', bn: 'রাশি গভীর অধ্যয়ন' }, subtitle: 'Detailed analysis of each zodiac sign', count: CURRICULUM_MODULES.filter(m => m.phase === 15).length },
  { phase: 16, title: { en: 'Special Topics', hi: 'विशेष विषय', ta: 'சிறப்பு தலைப்புகள்', bn: 'বিশেষ বিষয়' }, subtitle: 'Eclipses, Nadi, medical astrology, and more', count: CURRICULUM_MODULES.filter(m => m.phase === 16).length },
];

// ── Internal index map for O(1) lookups ───────────────────────────────────────

const _indexById = new Map<string, number>(
  MODULE_SEQUENCE.map((m, i) => [m.id, i])
);

// ── Helper functions ──────────────────────────────────────────────────────────

/** Returns the ModuleRef for a given ID, or undefined if not found. */
export function getModuleRef(id: string): ModuleRef | undefined {
  const idx = _indexById.get(id);
  return idx !== undefined ? MODULE_SEQUENCE[idx] : undefined;
}

/** Returns the next module's ID, or null if this is the last module. */
export function getNextModuleId(currentId: string): string | null {
  const idx = _indexById.get(currentId);
  if (idx === undefined) return null;
  const next = MODULE_SEQUENCE[idx + 1];
  return next ? next.id : null;
}

/** Returns the previous module's ID, or null if this is the first module. */
export function getPrevModuleId(currentId: string): string | null {
  const idx = _indexById.get(currentId);
  if (idx === undefined || idx === 0) return null;
  return MODULE_SEQUENCE[idx - 1].id;
}

/** Returns all modules belonging to a given phase number. */
export function getPhaseModules(phase: number): ModuleRef[] {
  return MODULE_SEQUENCE.filter(m => m.phase === phase);
}

/** Returns true if the module is the last one in its phase. */
export function isLastInPhase(id: string): boolean {
  const mod = getModuleRef(id);
  if (!mod) return false;
  const phaseModules = getPhaseModules(mod.phase);
  return phaseModules[phaseModules.length - 1].id === id;
}
