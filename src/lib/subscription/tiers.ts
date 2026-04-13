import type { LocaleText } from '@/types/panchang';
// Pure data — no imports, no async, no side effects

export type Tier = 'free' | 'pro' | 'jyotishi';

export type Feature =
  | 'kundali' | 'ai_chat' | 'saved_charts' | 'pdf_export'
  | 'matching_full' | 'shadbala_full' | 'yogas_full'
  | 'varshaphal' | 'kp_system' | 'prashna'
  | 'muhurta_ai' | 'tippanni_full' | 'varga_full'
  | 'batch' | 'api_access' | 'ad_free';

export type UsageFeature = 'kundali_count' | 'ai_chat_count' | 'muhurta_scan_count' | 'pdf_export_count';

interface TierConfig {
  daily: Partial<Record<UsageFeature, number>>;   // -1 = unlimited
  monthly: Partial<Record<UsageFeature, number>>;
  total: Partial<Record<string, number>>;
  features: Set<Feature>;
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  free: {
    daily: { kundali_count: -1, ai_chat_count: 2, pdf_export_count: -1 },
    monthly: { muhurta_scan_count: 2 },
    total: { saved_charts: -1 },
    features: new Set<Feature>([
      'kundali', 'ai_chat', 'pdf_export', 'muhurta_ai',
      'matching_full', 'shadbala_full', 'yogas_full',
      'varshaphal', 'kp_system', 'prashna',
      'tippanni_full', 'varga_full', 'ad_free',
    ]),
  },
  pro: {
    daily: { kundali_count: -1, ai_chat_count: 20, pdf_export_count: -1 },
    monthly: { muhurta_scan_count: 10 },
    total: { saved_charts: 25 },
    features: new Set<Feature>([
      'kundali', 'ai_chat', 'pdf_export', 'muhurta_ai',
      'matching_full', 'shadbala_full', 'yogas_full',
      'varshaphal', 'kp_system', 'prashna',
      'tippanni_full', 'varga_full', 'ad_free',
    ]),
  },
  jyotishi: {
    daily: { kundali_count: -1, ai_chat_count: -1, pdf_export_count: -1 },
    monthly: { muhurta_scan_count: -1 },
    total: { saved_charts: -1 },
    features: new Set<Feature>([
      'kundali', 'ai_chat', 'pdf_export', 'muhurta_ai',
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
  kundali: { en: 'Kundali Generation', hi: 'कुण्डली निर्माण', sa: 'कुण्डली निर्माण', mai: 'कुण्डली निर्माण', mr: 'कुण्डली निर्माण', ta: 'Kundali Generation', te: 'Kundali Generation', bn: 'Kundali Generation', kn: 'Kundali Generation', gu: 'Kundali Generation' },
  ai_chat: { en: 'AI Chart Chat', hi: 'AI चार्ट चैट', sa: 'AI चार्ट चैट', mai: 'AI चार्ट चैट', mr: 'AI चार्ट चैट', ta: 'AI Chart Chat', te: 'AI Chart Chat', bn: 'AI Chart Chat', kn: 'AI Chart Chat', gu: 'AI Chart Chat' },
  saved_charts: { en: 'Saved Charts', hi: 'सहेजे गए चार्ट', sa: 'सहेजे गए चार्ट', mai: 'सहेजे गए चार्ट', mr: 'सहेजे गए चार्ट', ta: 'Saved Charts', te: 'Saved Charts', bn: 'Saved Charts', kn: 'Saved Charts', gu: 'Saved Charts' },
  pdf_export: { en: 'PDF Export', hi: 'PDF निर्यात', sa: 'PDF निर्यात', mai: 'PDF निर्यात', mr: 'PDF निर्यात', ta: 'PDF Export', te: 'PDF Export', bn: 'PDF Export', kn: 'PDF Export', gu: 'PDF Export' },
  matching_full: { en: 'Full Matching Report', hi: 'पूर्ण मिलान रिपोर्ट', sa: 'पूर्ण मिलान रिपोर्ट', mai: 'पूर्ण मिलान रिपोर्ट', mr: 'पूर्ण मिलान रिपोर्ट', ta: 'Full Matching Report', te: 'Full Matching Report', bn: 'Full Matching Report', kn: 'Full Matching Report', gu: 'Full Matching Report' },
  shadbala_full: { en: 'Full Shadbala Analysis', hi: 'पूर्ण षड्बल विश्लेषण', sa: 'पूर्ण षड्बल विश्लेषण', mai: 'पूर्ण षड्बल विश्लेषण', mr: 'पूर्ण षड्बल विश्लेषण', ta: 'Full Shadbala Analysis', te: 'Full Shadbala Analysis', bn: 'Full Shadbala Analysis', kn: 'Full Shadbala Analysis', gu: 'Full Shadbala Analysis' },
  yogas_full: { en: 'Complete Yoga Analysis', hi: 'पूर्ण योग विश्लेषण', sa: 'पूर्ण योग विश्लेषण', mai: 'पूर्ण योग विश्लेषण', mr: 'पूर्ण योग विश्लेषण', ta: 'Complete Yoga Analysis', te: 'Complete Yoga Analysis', bn: 'Complete Yoga Analysis', kn: 'Complete Yoga Analysis', gu: 'Complete Yoga Analysis' },
  varshaphal: { en: 'Varshaphal (Annual)', hi: 'वर्षफल', sa: 'वर्षफल', mai: 'वर्षफल', mr: 'वर्षफल', ta: 'Varshaphal (Annual)', te: 'Varshaphal (Annual)', bn: 'Varshaphal (Annual)', kn: 'Varshaphal (Annual)', gu: 'Varshaphal (Annual)' },
  kp_system: { en: 'KP System', hi: 'केपी पद्धति', sa: 'केपी पद्धति', mai: 'केपी पद्धति', mr: 'केपी पद्धति', ta: 'KP System', te: 'KP System', bn: 'KP System', kn: 'KP System', gu: 'KP System' },
  prashna: { en: 'Prashna Kundali', hi: 'प्रश्न कुण्डली', sa: 'प्रश्न कुण्डली', mai: 'प्रश्न कुण्डली', mr: 'प्रश्न कुण्डली', ta: 'Prashna Kundali', te: 'Prashna Kundali', bn: 'Prashna Kundali', kn: 'Prashna Kundali', gu: 'Prashna Kundali' },
  muhurta_ai: { en: 'Muhurta AI Scanner', hi: 'मुहूर्त AI स्कैनर', sa: 'मुहूर्त AI स्कैनर', mai: 'मुहूर्त AI स्कैनर', mr: 'मुहूर्त AI स्कैनर', ta: 'Muhurta AI Scanner', te: 'Muhurta AI Scanner', bn: 'Muhurta AI Scanner', kn: 'Muhurta AI Scanner', gu: 'Muhurta AI Scanner' },
  tippanni_full: { en: 'Full Interpretations', hi: 'पूर्ण टिप्पणी', sa: 'पूर्ण टिप्पणी', mai: 'पूर्ण टिप्पणी', mr: 'पूर्ण टिप्पणी', ta: 'Full Interpretations', te: 'Full Interpretations', bn: 'Full Interpretations', kn: 'Full Interpretations', gu: 'Full Interpretations' },
  varga_full: { en: 'All Divisional Charts', hi: 'सभी विभागीय चार्ट', sa: 'सभी विभागीय चार्ट', mai: 'सभी विभागीय चार्ट', mr: 'सभी विभागीय चार्ट', ta: 'All Divisional Charts', te: 'All Divisional Charts', bn: 'All Divisional Charts', kn: 'All Divisional Charts', gu: 'All Divisional Charts' },
  batch: { en: 'Batch Processing', hi: 'बैच प्रोसेसिंग', sa: 'बैच प्रोसेसिंग', mai: 'बैच प्रोसेसिंग', mr: 'बैच प्रोसेसिंग', ta: 'Batch Processing', te: 'Batch Processing', bn: 'Batch Processing', kn: 'Batch Processing', gu: 'Batch Processing' },
  api_access: { en: 'API Access', hi: 'API एक्सेस', sa: 'API एक्सेस', mai: 'API एक्सेस', mr: 'API एक्सेस', ta: 'API Access', te: 'API Access', bn: 'API Access', kn: 'API Access', gu: 'API Access' },
  ad_free: { en: 'Ad-Free Experience', hi: 'विज्ञापन-मुक्त अनुभव', sa: 'विज्ञापन-मुक्त अनुभव', mai: 'विज्ञापन-मुक्त अनुभव', mr: 'विज्ञापन-मुक्त अनुभव', ta: 'Ad-Free Experience', te: 'Ad-Free Experience', bn: 'Ad-Free Experience', kn: 'Ad-Free Experience', gu: 'Ad-Free Experience' },
};
