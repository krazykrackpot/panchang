/**
 * Citation rule — three modes.
 *
 *   full-cite       Cite the exact classical reference with verse/chapter from
 *                   the JSON's citation data. Use only when the chart-builder
 *                   has populated `citation: { source, ref }` on yogas / doshas.
 *
 *   principle-only  Name the classical principle without claiming a verse.
 *                   "Gajakesari Yoga per BPHS" is OK; "BPHS Ch. 36 verse 23"
 *                   is NOT. v0 default — engine doesn't carry citation refs yet.
 *
 *   drop            No citation requirement. Used if hallucination persists
 *                   after telemetry, or for categories where citations don't
 *                   apply (e.g. timing-only questions).
 *
 * Each mode has a per-locale natively-authored phrasing.
 */

import type { BrihaspatiLocale } from '../../../types';

export type CitationMode = 'full-cite' | 'principle-only' | 'drop';

const FULL_CITE: Record<BrihaspatiLocale, string> = {
  en: 'Quote one classical reference (BPHS, Saravali, or Phaladeepika) that supports the analysis. Use only references provided in the JSON\'s `citation` fields; never invent a verse number.',
  hi: 'विश्लेषण का समर्थन करने वाला एक शास्त्रीय सन्दर्भ (बृहत् पाराशर होरा शास्त्र, सारावली, या फलदीपिका) उद्धृत करें। केवल JSON के `citation` क्षेत्रों में दिए गए सन्दर्भों का प्रयोग करें; श्लोक संख्या की कल्पना कभी न करें।',
  ta: 'பகுப்பாய்வை ஆதரிக்கும் ஒரு பாரம்பரிய மேற்கோளை (BPHS, சாராவளி, அல்லது பலதீபிகா) குறிப்பிடவும். JSON-ன் `citation` புலங்களில் வழங்கப்பட்ட மேற்கோள்களை மட்டுமே பயன்படுத்தவும்; ஶ்லோக எண்ணை ஒருபோதும் கற்பனை செய்ய வேண்டாம்.',
  bn: 'বিশ্লেষণকে সমর্থন করে এমন একটি শাস্ত্রীয় উল্লেখ (BPHS, সারাবলী, অথবা ফলদীপিকা) উদ্ধৃত করুন। শুধুমাত্র JSON-এর `citation` ক্ষেত্রে প্রদত্ত উল্লেখগুলি ব্যবহার করুন; কখনই শ্লোক নম্বর আবিষ্কার করবেন না।',
  sa: '', te: '', kn: '', mr: '', gu: '', mai: '',
};

const PRINCIPLE_ONLY: Record<BrihaspatiLocale, string> = {
  en: 'Reference one classical principle by name (for example: "Gajakesari Yoga per BPHS", "Manglik Dosha as described in Saravali"). Do NOT claim a specific chapter or verse number — only the named principle and its source text.',
  hi: 'एक शास्त्रीय सिद्धान्त का नाम लेकर उल्लेख करें (उदाहरण: "बृहत् पाराशर होरा शास्त्र के अनुसार गजकेसरी योग", "सारावली में वर्णित मांगलिक दोष")। किसी विशिष्ट अध्याय या श्लोक संख्या का दावा न करें — केवल नामित सिद्धान्त और उसका स्रोत ग्रन्थ।',
  ta: 'ஒரு பாரம்பரிய கொள்கையை பெயரால் குறிப்பிடவும் (உதாரணம்: "BPHS-ன் படி கஜகேசரி யோகம்", "சாராவளியில் விவரிக்கப்பட்ட மாங்கல்ய தோஷம்"). எந்த குறிப்பிட்ட அத்தியாயம் அல்லது ஶ்லோக எண்ணையும் கூற வேண்டாம் — பெயரிடப்பட்ட கொள்கையும் அதன் மூல நூலும் மட்டுமே.',
  bn: 'একটি শাস্ত্রীয় নীতি নাম ধরে উল্লেখ করুন (উদাহরণ: "BPHS অনুসারে গজকেশরী যোগ", "সারাবলীতে বর্ণিত মাঙ্গলিক দোষ")। কোনো নির্দিষ্ট অধ্যায় বা শ্লোক নম্বর দাবি করবেন না — শুধুমাত্র নামকরা নীতি এবং তার মূল গ্রন্থ।',
  sa: '', te: '', kn: '', mr: '', gu: '', mai: '',
};

const DROP: Record<BrihaspatiLocale, string> = {
  en: 'No classical citation is required in this answer; focus on the chart\'s specifics from the JSON.',
  hi: 'इस उत्तर में किसी शास्त्रीय सन्दर्भ की आवश्यकता नहीं है; JSON से कुण्डली की विशिष्टताओं पर ध्यान दें।',
  ta: 'இந்த பதிலில் எந்த பாரம்பரிய மேற்கோளும் தேவையில்லை; JSON-லிருந்து ஜாதகத்தின் தனிச்சிறப்புகளில் கவனம் செலுத்தவும்.',
  bn: 'এই উত্তরে কোনো শাস্ত্রীয় উল্লেখের প্রয়োজন নেই; JSON থেকে কুণ্ডলীর সুনির্দিষ্ট বিষয়গুলিতে মনোযোগ দিন।',
  sa: '', te: '', kn: '', mr: '', gu: '', mai: '',
};

// Fallback locales use English text — they're not first-class narration
// locales (spec says answer prose falls back to EN).
for (const fallback of ['sa', 'te', 'kn', 'mr', 'gu', 'mai'] as const) {
  FULL_CITE[fallback] = FULL_CITE.en;
  PRINCIPLE_ONLY[fallback] = PRINCIPLE_ONLY.en;
  DROP[fallback] = DROP.en;
}

export function citationRule(mode: CitationMode, locale: BrihaspatiLocale): string {
  switch (mode) {
    case 'full-cite': return FULL_CITE[locale];
    case 'principle-only': return PRINCIPLE_ONLY[locale];
    case 'drop': return DROP[locale];
  }
}
