/**
 * Muhurta Scanner multilingual labels.
 * Uses the inline `L`-pattern (Record<string, Record<locale, string>>)
 * consistent with the rest of the muhurta-ai page.
 *
 * Active locales: en, hi, ta, bn.
 * Other locales fall back to en via sl().
 */
export const SL: Record<string, Record<string, string>> = {
  scannerTitle: {
    en: 'Muhurta Scanner',
    hi: 'मुहूर्त स्कैनर',
    ta: 'முகூர்த்த ஸ்கேனர்',
    bn: 'মুহূর্ত স্ক্যানার',
  },
  scannerSubtitle: {
    en: 'Find the most auspicious time for your activity — personalized to your birth chart',
    hi: 'अपनी गतिविधि के लिए सबसे शुभ समय खोजें — आपकी जन्म कुंडली के अनुसार',
    ta: 'உங்கள் செயலுக்கான மிகவும் சுபமான நேரத்தைக் கண்டறியுங்கள் — உங்கள் ஜாதகத்திற்கு ஏற்ப',
    bn: 'আপনার কার্যকলাপের জন্য সবচেয়ে শুভ সময় খুঁজুন — আপনার জন্মচার্ট অনুযায়ী',
  },
  scanMonth: {
    en: 'Scan Month',
    hi: 'माह स्कैन करें',
    ta: 'மாதம் ஸ்கேன்',
    bn: 'মাস স্ক্যান',
  },
  scanning: {
    en: 'Scanning…',
    hi: 'स्कैन हो रहा है…',
    ta: 'ஸ்கேன் ஆகிறது…',
    bn: 'স্ক্যান করা হচ্ছে…',
  },
  monthlyOverview: {
    en: 'Monthly Overview',
    hi: 'मासिक अवलोकन',
    ta: 'மாதாந்திர கண்ணோட்டம்',
    bn: 'মাসিক সংক্ষিপ্ত বিবরণ',
  },
  dayDetail: {
    en: 'Day Detail',
    hi: 'दिन विवरण',
    ta: 'நாள் விவரம்',
    bn: 'দিনের বিস্তারিত',
  },
  bestWindowsFor: {
    en: 'Best Windows for',
    hi: 'सर्वश्रेष्ठ समय',
    ta: 'சிறந்த நேரங்கள்',
    bn: 'সেরা উইন্ডোজ',
  },
  scoreBreakdown: {
    en: 'Score Breakdown',
    hi: 'अंक विश्लेषण',
    ta: 'மதிப்பெண் விவரம்',
    bn: 'স্কোর বিশ্লেষণ',
  },
  pass1Label: {
    en: '2-hour windows',
    hi: '2-घंटे की विंडो',
    ta: '2-மணி நேர சாளரங்கள்',
    bn: '2-ঘণ্টার উইন্ডো',
  },
  pass2Label: {
    en: '15-min resolution',
    hi: '15-मिनट रिज़ॉल्यूशन',
    ta: '15-நிமிட தெளிவுத்திறன்',
    bn: '15-মিনিট রেজোলিউশন',
  },
  bestMatch: {
    en: '★ Best Match',
    hi: '★ सर्वश्रेष्ठ',
    ta: '★ சிறந்த பொருத்தம்',
    bn: '★ সেরা মিল',
  },
  secondBest: {
    en: '2nd Best',
    hi: '२य सर्वश्रेष्ठ',
    ta: '2வது சிறந்தது',
    bn: '২য় সেরা',
  },
  thirdBest: {
    en: '3rd Best',
    hi: '३य सर्वश्रेष्ठ',
    ta: '3வது சிறந்தது',
    bn: '৩য় সেরা',
  },
  quickPersonalizeInfo: {
    en: 'Add birth details for personalized results',
    hi: 'व्यक्तिगत परिणामों के लिए जन्म विवरण जोड़ें',
    ta: 'தனிப்பயனாக்கப்பட்ட முடிவுகளுக்கு பிறப்பு விவரங்களை சேர்க்கவும்',
    bn: 'ব্যক্তিগতকৃত ফলাফলের জন্য জন্ম বিবরণ যোগ করুন',
  },
  fullChartCta: {
    en: 'Generate a full chart for dasha-personalized results →',
    hi: 'दशा-अनुकूलित परिणामों के लिए पूरी कुंडली बनाएं →',
    ta: 'தசை-தனிப்பயனாக்கப்பட்ட முடிவுகளுக்கு முழு ஜாதகம் உருவாக்கவும் →',
    bn: 'দশা-ব্যক্তিগতকৃত ফলাফলের জন্য পূর্ণ চার্ট তৈরি করুন →',
  },
  runningDasha: {
    en: 'Running Dasha:',
    hi: 'चालू दशा:',
    ta: 'நடப்பு தசை:',
    bn: 'চলমান দশা:',
  },
  until: {
    en: 'Until:',
    hi: 'तक:',
    ta: 'வரை:',
    bn: 'পর্যন্ত:',
  },
  favorable: {
    en: 'Favourable for this activity ✔',
    hi: 'इस गतिविधि के लिए अनुकूल ✔',
    ta: 'இந்த செயலுக்கு சாதகமானது ✔',
    bn: 'এই কার্যকলাপের জন্য অনুকূল ✔',
  },
  caution: {
    en: 'Caution — may suppress this activity',
    hi: 'सावधान — इस गतिविधि को दबा सकता है',
    ta: 'எச்சரிக்கை — இந்த செயலை மழுங்கடிக்கலாம்',
    bn: 'সতর্কতা — এই কার্যকলাপ দমন করতে পারে',
  },
  // Factor labels for ScoreBreakdown / PeakCards
  tithi: {
    en: 'Tithi',
    hi: 'तिथि',
    ta: 'திதி',
    bn: 'তিথি',
  },
  nakshatra: {
    en: 'Nakshatra',
    hi: 'नक्षत्र',
    ta: 'நட்சத்திரம்',
    bn: 'নক্ষত্র',
  },
  yoga: {
    en: 'Yoga',
    hi: 'योग',
    ta: 'யோகம்',
    bn: 'যোগ',
  },
  karana: {
    en: 'Karana',
    hi: 'करण',
    ta: 'கரணம்',
    bn: 'করণ',
  },
  taraBala: {
    en: 'Tara Bala',
    hi: 'तारा बल',
    ta: 'தார பல',
    bn: 'তারা বল',
  },
  chandraBala: {
    en: 'Chandra Bala',
    hi: 'चंद्र बल',
    ta: 'சந்திர பல',
    bn: 'চন্দ্র বল',
  },
  dashaHarmony: {
    en: 'Dasha Harmony',
    hi: 'दशा सामंजस्य',
    ta: 'தசை ஐக்கியம்',
    bn: 'দশা সামঞ্জস্য',
  },
  inauspiciousCheck: {
    en: 'Inauspicious',
    hi: 'अशुभ',
    ta: 'அசுபம்',
    bn: 'অশুভ',
  },
  panchangScore: {
    en: 'Panchang Score',
    hi: 'पंचांग स्कोर',
    ta: 'பஞ்சாங்க மதிப்பெண்',
    bn: 'পঞ্চাঙ্গ স্কোর',
  },
  none: {
    en: 'None',
    hi: 'कोई नहीं',
    ta: 'இல்லை',
    bn: 'কোনোটি নয়',
  },
  scanFailed: {
    en: 'Scan failed. Please try again.',
    hi: 'स्कैन विफल हुआ। कृपया पुनः प्रयास करें।',
    ta: 'ஸ்கேன் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    bn: 'স্ক্যান ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
  },
  birthNakshatra: {
    en: 'Birth Nakshatra',
    hi: 'जन्म नक्षत्र',
    ta: 'பிறப்பு நட்சத்திரம்',
    bn: 'জন্ম নক্ষত্র',
  },
  birthRashi: {
    en: 'Birth Rashi',
    hi: 'जन्म राशि',
    ta: 'பிறப்பு ராசி',
    bn: 'জন্ম রাশি',
  },
  // ScanControls field labels
  activity: {
    en: 'Activity',
    hi: 'गतिविधि',
    ta: 'செயல்',
    bn: 'কার্যকলাপ',
  },
  from: {
    en: 'From',
    hi: 'से',
    ta: 'இருந்து',
    bn: 'থেকে',
  },
  to: {
    en: 'To',
    hi: 'तक',
    ta: 'வரை',
    bn: 'পর্যন্ত',
  },
  location: {
    en: 'Location',
    hi: 'स्थान',
    ta: 'இடம்',
    bn: 'অবস্থান',
  },
  noLocationSet: {
    en: 'No location set',
    hi: 'स्थान उपलब्ध नहीं',
    ta: 'இடம் அமைக்கப்படவில்லை',
    bn: 'কোনো অবস্থান নির্ধারিত নেই',
  },
  locationDetecting: {
    en: 'Detecting…',
    hi: 'पता लगाया जा रहा है…',
    ta: 'கண்டறிகிறது…',
    bn: 'সনাক্ত করা হচ্ছে…',
  },
};

/**
 * Look up a scanner label by key and locale.
 * Falls back to English if the locale key is missing.
 * Falls back to the key itself if the key is missing entirely.
 */
export function sl(key: string, locale: string): string {
  return SL[key]?.[locale] ?? SL[key]?.en ?? key;
}
