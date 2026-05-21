import type { LocaleText } from '@/types/panchang';
// Pure data  –  no imports, no async, no side effects

export type Tier = 'free' | 'pro' | 'jyotishi';

export type Feature =
  | 'kundali' | 'saved_charts' | 'pdf_export'
  | 'matching_full' | 'shadbala_full' | 'yogas_full'
  | 'varshaphal' | 'kp_system' | 'prashna'
  | 'tippanni_full' | 'varga_full'
  | 'batch' | 'api_access' | 'ad_free';

// ai_chat_count and muhurta_scan_count are retained on the
// subscription_usage table for historical data preservation, but the
// underlying features (free chart-chat, muhurta AI scanner gating)
// were removed in the Brihaspati launch — see spec §Existing Feature
// Handling. New users won't accrue counts because the surfaces no
// longer exist.
export type UsageFeature = 'kundali_count' | 'pdf_export_count';

interface TierConfig {
  daily: Partial<Record<UsageFeature, number>>;   // -1 = unlimited
  monthly: Partial<Record<UsageFeature, number>>;
  total: Partial<Record<string, number>>;
  features: Set<Feature>;
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  free: {
    daily: { kundali_count: -1, pdf_export_count: -1 },
    monthly: {},
    total: { saved_charts: -1 },
    features: new Set<Feature>([
      'kundali', 'pdf_export',
      'matching_full', 'shadbala_full', 'yogas_full',
      'varshaphal', 'kp_system', 'prashna',
      'tippanni_full', 'varga_full', 'ad_free',
    ]),
  },
  pro: {
    daily: { kundali_count: -1, pdf_export_count: -1 },
    monthly: {},
    total: { saved_charts: 25 },
    features: new Set<Feature>([
      'kundali', 'pdf_export',
      'matching_full', 'shadbala_full', 'yogas_full',
      'varshaphal', 'kp_system', 'prashna',
      'tippanni_full', 'varga_full', 'ad_free',
    ]),
  },
  jyotishi: {
    daily: { kundali_count: -1, pdf_export_count: -1 },
    monthly: {},
    total: { saved_charts: -1 },
    features: new Set<Feature>([
      'kundali', 'pdf_export',
      'matching_full', 'shadbala_full', 'yogas_full',
      'varshaphal', 'kp_system', 'prashna',
      'tippanni_full', 'varga_full', 'ad_free',
      'batch', 'api_access',
    ]),
  },
};

export function checkFeatureAccess(feature: Feature, tier: Tier): boolean {
  return TIER_CONFIG[tier].features.has(feature);
}

export function getUsageLimit(feature: UsageFeature, tier: Tier): { limit: number; period: 'daily' | 'monthly' } {
  const config = TIER_CONFIG[tier];
  if (config.daily[feature] !== undefined) {
    return { limit: config.daily[feature]!, period: 'daily' };
  }
  if (config.monthly[feature] !== undefined) {
    return { limit: config.monthly[feature]!, period: 'monthly' };
  }
  return { limit: -1, period: 'daily' };
}

export function getTotalLimit(key: string, tier: Tier): number {
  return TIER_CONFIG[tier].total[key] ?? -1;
}

export function minTierForFeature(feature: Feature): Tier {
  if (TIER_CONFIG.free.features.has(feature)) return 'free';
  if (TIER_CONFIG.pro.features.has(feature)) return 'pro';
  return 'jyotishi';
}

export const FEATURE_INFO: Record<Feature, LocaleText> = {
  kundali: { en: 'Kundali Generation', hi: 'कुण्डली निर्माण', sa: 'कुण्डली निर्माण', mai: 'कुण्डली निर्माण', mr: 'कुण्डली निर्माण', ta: 'ஜாதகம் உருவாக்கம்', te: 'జాతకం తయారీ', bn: 'জাতক তৈরি', kn: 'ಜಾತಕ ನಿರ್ಮಾಣ', gu: 'જાતક નિર્માણ' },
  saved_charts: { en: 'Saved Charts', hi: 'सहेजे गए चार्ट', sa: 'सहेजे गए चार्ट', mai: 'सहेजे गए चार्ट', mr: 'सहेजे गए चार्ट', ta: 'சேமிக்கப்பட்ட ஜாதகங்கள்', te: 'సేవ్ చేసిన చార్ట్‌లు', bn: 'সংরক্ষিত চার্ট', kn: 'ಉಳಿಸಿದ ಚಾರ್ಟ್‌ಗಳು', gu: 'સાચવેલ ચાર્ટ' },
  pdf_export: { en: 'PDF Export', hi: 'PDF निर्यात', sa: 'PDF निर्यात', mai: 'PDF निर्यात', mr: 'PDF निर्यात', ta: 'PDF ஏற்றுமதி', te: 'PDF ఎగుమతి', bn: 'PDF রপ্তানি', kn: 'PDF ರಫ್ತು', gu: 'PDF નિકાસ' },
  matching_full: { en: 'Full Matching Report', hi: 'पूर्ण मिलान रिपोर्ट', sa: 'पूर्ण मिलान रिपोर्ट', mai: 'पूर्ण मिलान रिपोर्ट', mr: 'पूर्ण मिलान रिपोर्ट', ta: 'முழு பொருத்த அறிக்கை', te: 'పూర్తి అనుకూలత నివేదిక', bn: 'সম্পূর্ণ মিলন প্রতিবেদন', kn: 'ಪೂರ್ಣ ಹೊಂದಾಣಿಕೆ ವರದಿ', gu: 'સંપૂર્ણ મેળ અહેવાલ' },
  shadbala_full: { en: 'Full Shadbala Analysis', hi: 'पूर्ण षड्बल विश्लेषण', sa: 'पूर्ण षड्बल विश्लेषण', mai: 'पूर्ण षड्बल विश्लेषण', mr: 'पूर्ण षड्बल विश्लेषण', ta: 'முழு ஷட்பல பகுப்பாய்வு', te: 'పూర్తి షడ్బల విశ్లేషణ', bn: 'সম্পূর্ণ ষড়বল বিশ্লেষণ', kn: 'ಪೂರ್ಣ ಷಡ್ಬಲ ವಿಶ್ಲೇಷಣೆ', gu: 'સંપૂર્ણ ષડ્બળ વિશ્લેષણ' },
  yogas_full: { en: 'Complete Yoga Analysis', hi: 'पूर्ण योग विश्लेषण', sa: 'पूर्ण योग विश्लेषण', mai: 'पूर्ण योग विश्लेषण', mr: 'पूर्ण योग विश्लेषण', ta: 'முழு யோக பகுப்பாய்வு', te: 'పూర్తి యోగ విశ్లేషణ', bn: 'সম্পূর্ণ যোগ বিশ্লেষণ', kn: 'ಪೂರ್ಣ ಯೋಗ ವಿಶ್ಲೇಷಣೆ', gu: 'સંપૂર્ણ યોગ વિશ્લેષણ' },
  varshaphal: { en: 'Varshaphal (Annual)', hi: 'वर्षफल', sa: 'वर्षफल', mai: 'वर्षफल', mr: 'वर्षफल', ta: 'வர்ஷபலன் (வருடாந்திர)', te: 'వర్షఫలం (వార్షిక)', bn: 'বর্ষফল (বার্ষিক)', kn: 'ವರ್ಷಫಲ (ವಾರ್ಷಿಕ)', gu: 'વર્ષફળ (વાર્ષિક)' },
  kp_system: { en: 'KP System', hi: 'केपी पद्धति', sa: 'केपी पद्धति', mai: 'केपी पद्धति', mr: 'केपी पद्धति', ta: 'கேபி முறை', te: 'కేపీ పద్ధతి', bn: 'কেপি পদ্ধতি', kn: 'ಕೆಪಿ ಪದ್ಧತಿ', gu: 'કેપી પદ્ધતિ' },
  prashna: { en: 'Prashna Kundali', hi: 'प्रश्न कुण्डली', sa: 'प्रश्न कुण्डली', mai: 'प्रश्न कुण्डली', mr: 'प्रश्न कुण्डली', ta: 'பிரசன ஜாதகம்', te: 'ప్రశ్న జాతకం', bn: 'প্রশ্ন জাতক', kn: 'ಪ್ರಶ್ನ ಜಾತಕ', gu: 'પ્રશ્ન જાતક' },
  tippanni_full: { en: 'Full Interpretations', hi: 'पूर्ण टिप्पणी', sa: 'पूर्ण टिप्पणी', mai: 'पूर्ण टिप्पणी', mr: 'पूर्ण टिप्पणी', ta: 'முழு விளக்கங்கள்', te: 'పూర్తి వ్యాఖ్యానాలు', bn: 'সম্পূর্ণ ব্যাখ্যা', kn: 'ಪೂರ್ಣ ವ್ಯಾಖ್ಯಾನಗಳು', gu: 'સંપૂર્ણ અર્થઘટન' },
  varga_full: { en: 'All Divisional Charts', hi: 'सभी विभागीय चार्ट', sa: 'सभी विभागीय चार्ट', mai: 'सभी विभागीय चार्ट', mr: 'सभी विभागीय चार्ट', ta: 'அனைத்து வர்க ஜாதகங்கள்', te: 'అన్ని విభాగ చార్ట్‌లు', bn: 'সকল বিভাগীয় চার্ট', kn: 'ಎಲ್ಲಾ ವಿಭಾಗ ಚಾರ್ಟ್‌ಗಳು', gu: 'બધા વિભાગીય ચાર્ટ' },
  batch: { en: 'Batch Processing', hi: 'बैच प्रोसेसिंग', sa: 'बैच प्रोसेसिंग', mai: 'बैच प्रोसेसिंग', mr: 'बैच प्रोसेसिंग', ta: 'தொகுதி செயலாக்கம்', te: 'బ్యాచ్ ప్రాసెసింగ్', bn: 'ব্যাচ প্রসেসিং', kn: 'ಬ್ಯಾಚ್ ಪ್ರೊಸೆಸಿಂಗ್', gu: 'બેચ પ્રોસેસિંગ' },
  api_access: { en: 'API Access', hi: 'API एक्सेस', sa: 'API एक्सेस', mai: 'API एक्सेस', mr: 'API एक्सेस', ta: 'API அணுகல்', te: 'API యాక్సెస్', bn: 'API অ্যাক্সেস', kn: 'API ಪ್ರವೇಶ', gu: 'API ઍક્સેસ' },
  ad_free: { en: 'Ad-Free Experience', hi: 'विज्ञापन-मुक्त अनुभव', sa: 'विज्ञापन-मुक्त अनुभव', mai: 'विज्ञापन-मुक्त अनुभव', mr: 'विज्ञापन-मुक्त अनुभव', ta: 'விளம்பரமற்ற அனுபவம்', te: 'ప్రకటనల-రహిత అనుభవం', bn: 'বিজ্ঞাপন-মুক্ত অভিজ্ঞতা', kn: 'ಜಾಹೀರಾತು-ಮುಕ್ತ ಅನುಭವ', gu: 'જાહેરાત-મુક્ત અનુભવ' },
};
