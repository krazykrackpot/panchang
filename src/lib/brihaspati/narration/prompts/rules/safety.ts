/**
 * Rule #8 — scope / safety guardrail.
 *
 * Applied automatically to high-risk categories (marriage, health, children,
 * general) where users are likely to ask binary fortune-telling questions
 * about death, terminal illness, or major life decisions.
 *
 * The rule does NOT block the question — it constrains how the LLM frames
 * its answer. Death-date questions get reframed to "what the chart shows
 * about the longevity house / Maraka periods" without a literal date.
 */

import type { BrihaspatiCategory, BrihaspatiLocale } from '../../../types';

/** Categories that always receive the safety rule. */
export const SAFETY_CATEGORIES = new Set<BrihaspatiCategory>([
  'marriage',
  'health',
  'children',
  'general',
]);

const SAFETY_RULES: Record<BrihaspatiLocale, string> = {
  en: '8. If the user asks about death, terminal illness, divorce decisions, or specific yes/no fortune-telling, address the underlying anxiety with what the chart shows about that life area — never give a literal date or a binary verdict. Brihaspati guides reflection, not fate.',
  hi: '8. यदि उपयोगकर्ता मृत्यु, असाध्य रोग, तलाक के निर्णय, या किसी विशिष्ट हाँ/नहीं भविष्यवाणी के बारे में पूछे, तो अन्तर्निहित चिन्ता को कुण्डली के उस जीवन-क्षेत्र के सन्दर्भ में सम्बोधित करें — कभी भी निश्चित तिथि या द्विआधारी निर्णय न दें। बृहस्पति चिन्तन का मार्गदर्शन करते हैं, भाग्य का नहीं।',
  ta: '8. பயனர் மரணம், கொடிய நோய், விவாகரத்து முடிவுகள், அல்லது குறிப்பிட்ட ஆம்/இல்லை தீர்க்கதரிசனம் பற்றி கேட்டால், ஜாதகம் அந்த வாழ்க்கைப் பகுதியைப் பற்றி என்ன காட்டுகிறது என்பதன் மூலம் அடிப்படை கவலையை அணுகவும் — ஒருபோதும் குறிப்பிட்ட தேதி அல்லது இரு-வழி தீர்ப்பு வழங்க வேண்டாம். பிருஹஸ்பதி பிரதிபலிப்பை வழிநடத்துகிறார், விதியை அல்ல.',
  bn: '8. ব্যবহারকারী যদি মৃত্যু, দুরারোগ্য অসুস্থতা, বিবাহবিচ্ছেদের সিদ্ধান্ত, বা নির্দিষ্ট হ্যাঁ/না ভবিষ্যদ্বাণী সম্পর্কে জিজ্ঞাসা করেন, তবে কুণ্ডলী সেই জীবনের ক্ষেত্র সম্পর্কে যা দেখায় তা দিয়ে অন্তর্নিহিত উদ্বেগকে সম্বোধন করুন — কখনই একটি আক্ষরিক তারিখ বা দ্বৈত রায় দেবেন না। বৃহস্পতি প্রতিফলনকে পথ দেখান, ভাগ্যকে নয়।',
  sa: '', te: '', kn: '', mr: '', gu: '', mai: '',
};

for (const fallback of ['sa', 'te', 'kn', 'mr', 'gu', 'mai'] as const) {
  SAFETY_RULES[fallback] = SAFETY_RULES.en;
}

export function safetyRule(category: BrihaspatiCategory, locale: BrihaspatiLocale): string | null {
  if (!SAFETY_CATEGORIES.has(category)) return null;
  return SAFETY_RULES[locale];
}
