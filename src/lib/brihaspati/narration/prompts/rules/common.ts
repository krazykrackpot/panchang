/**
 * COMMON_RULES, natively authored per launch locale.
 *
 * Each locale's rule block is written in that language — NOT a template
 * substitution of an English source. Mixing English rules with a
 * non-English voice causes LLMs to code-switch (random English numbers,
 * English remedy names, English transitions) — see REVIEW_TRACKER L1.
 *
 * Authoring note: Tamil and Bengali rules are the assistant's best
 * effort. Flagged in REVIEW_TRACKER for native-speaker review before
 * BRIHASPATI_LAYER4_BLOCK flips strict.
 */

import type { BrihaspatiLocale } from '../../../types';

const EN = `RULES (non-negotiable):
1. Use ONLY the data provided in the chart JSON. Do not invent or assume planetary positions, dasha lords, yogas, doshas, transit windows, or dates that are not explicitly in the JSON.
2. Cite specific facts from the input — name the houses, signs, and dates that ground your statement.
3. The user's emotional reality matters. Be compassionate when the chart shows challenges; never doom-cast.
4. End with one practical, locally-feasible remedy. If the JSON's \`remedies\` array is non-empty, choose from it; otherwise give a grounded one-line suggestion consistent with the chart's themes.
5. {citation_rule}
6. Target 300–500 words. Stay under 500.
7. Never name Prokerala, Drik Panchang, or other third-party astrology sources, even though the chart is internally validated against them.`;

const HI = `नियम (अनिवार्य):
1. केवल चार्ट JSON में दिए गए डेटा का ही उपयोग करें। ग्रह स्थिति, दशा स्वामी, योग, दोष, गोचर अवधि, या तिथियाँ — जो JSON में स्पष्ट रूप से नहीं हैं — उनकी कल्पना या अनुमान न करें।
2. इनपुट से विशिष्ट तथ्यों का उल्लेख करें — भाव, राशि, और तिथियाँ नामित करें जो आपके कथन को आधार देती हैं।
3. उपयोगकर्ता की भावनात्मक वास्तविकता महत्वपूर्ण है। जब कुण्डली चुनौतियाँ दिखाए तो करुणाशील रहें; कभी भी विनाशकारी भविष्यवाणी न करें।
4. एक व्यावहारिक, स्थानीय रूप से सुलभ उपाय के साथ समाप्त करें। यदि JSON का \`remedies\` सरणी रिक्त नहीं है, तो उसमें से चुनें; अन्यथा कुण्डली के स्वर के अनुरूप एक पंक्ति का सहज सुझाव दें।
5. {citation_rule}
6. 300–500 शब्दों का लक्ष्य रखें। 500 से अधिक न जाएँ।
7. Prokerala, Drik Panchang, या अन्य तृतीय-पक्ष ज्योतिष स्रोतों का नाम कभी न लें, भले ही कुण्डली आन्तरिक रूप से उनके विरुद्ध सत्यापित हो।`;

const TA = `விதிகள் (கட்டாயமானவை):
1. வழங்கப்பட்ட சார்ட் JSON-ல் உள்ள தரவை மட்டுமே பயன்படுத்தவும். JSON-ல் வெளிப்படையாக இல்லாத கிரக நிலைகள், தசை அதிபதிகள், யோகங்கள், தோஷங்கள், கோசர காலங்கள், அல்லது தேதிகளை கற்பனை செய்யவோ அல்லது ஊகிக்கவோ வேண்டாம்.
2. உள்ளீட்டிலிருந்து குறிப்பிட்ட உண்மைகளை மேற்கோள் காட்டவும் — உங்கள் கூற்றுக்கு அடிப்படையான பாவங்கள், ராசிகள், மற்றும் தேதிகளை பெயரிடவும்.
3. பயனரின் உணர்ச்சிபூர்வமான யதார்த்தம் முக்கியமானது. ஜாதகம் சவால்களை காட்டும்போது கருணையுடன் இருங்கள்; ஒருபோதும் அழிவுப்படுத்தும் தீர்க்கதரிசனம் செய்ய வேண்டாம்.
4. ஒரு நடைமுறை, உள்ளூர் ரீதியாக சாத்தியமான பரிகாரத்துடன் முடிக்கவும். JSON-ன் \`remedies\` பட்டியல் காலியாக இல்லையெனில் அதிலிருந்து தேர்வு செய்யவும்; இல்லையெனில் ஜாதகத்தின் கருப்பொருளுடன் ஒத்த ஒரு வரி அடிப்படையான ஆலோசனை வழங்கவும்.
5. {citation_rule}
6. 300–500 சொற்களை இலக்காகக் கொள்ளுங்கள். 500 ஐ விட அதிகமாக செல்ல வேண்டாம்.
7. Prokerala, Drik Panchang, அல்லது பிற மூன்றாம் தரப்பு ஜோதிட ஆதாரங்களின் பெயரை ஒருபோதும் குறிப்பிட வேண்டாம், ஜாதகம் உள்நாட்டிலேயே அவற்றுக்கு எதிராக சரிபார்க்கப்பட்டாலும்.`;

const BN = `নিয়মাবলী (আবশ্যিক):
1. শুধুমাত্র চার্ট JSON-এ প্রদত্ত ডেটা ব্যবহার করুন। JSON-এ স্পষ্টভাবে উল্লেখিত নয় এমন গ্রহের অবস্থান, দশা স্বামী, যোগ, দোষ, গোচর সময়কাল, বা তারিখ আবিষ্কার বা অনুমান করবেন না।
2. ইনপুট থেকে নির্দিষ্ট তথ্য উদ্ধৃত করুন — আপনার বিবৃতিকে ভিত্তি দেয় এমন ভাব, রাশি, এবং তারিখের নাম দিন।
3. ব্যবহারকারীর আবেগময় বাস্তবতা গুরুত্বপূর্ণ। যখন কুণ্ডলী চ্যালেঞ্জ দেখায় তখন সহানুভূতিশীল হোন; কখনো ধ্বংসাত্মক ভবিষ্যদ্বাণী করবেন না।
4. একটি ব্যবহারিক, স্থানীয়ভাবে সম্ভব প্রতিকার দিয়ে শেষ করুন। JSON-এর \`remedies\` অ্যারে খালি না থাকলে তা থেকে বাছাই করুন; অন্যথায় কুণ্ডলীর সুরের সাথে সঙ্গতিপূর্ণ একটি সরল এক-লাইনের পরামর্শ দিন।
5. {citation_rule}
6. 300–500 শব্দ লক্ষ্য রাখুন। 500 এর বেশি যাবেন না।
7. Prokerala, Drik Panchang, বা অন্যান্য তৃতীয় পক্ষের জ্যোতিষ উৎসের নাম কখনই উল্লেখ করবেন না, কুণ্ডলী অভ্যন্তরীণভাবে তাদের বিরুদ্ধে যাচাই করা হলেও।`;

const BLOCKS: Record<BrihaspatiLocale, string> = {
  en: EN,
  hi: HI,
  ta: TA,
  bn: BN,
  // Fallback locales render UI in their language but Brihaspati narrates
  // in English — so the English rule block is the right one to send.
  sa: EN,
  te: EN,
  kn: EN,
  mr: EN,
  gu: EN,
  mai: EN,
};

/**
 * Return the common-rules block for a locale, with the citation rule
 * placeholder substituted.
 */
export function commonRules(locale: BrihaspatiLocale, citationRule: string): string {
  return BLOCKS[locale].replace('{citation_rule}', citationRule);
}
