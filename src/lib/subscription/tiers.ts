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

export const FEATURE_INFO: Record<Feature, { en: string; hi: string }> = {
  kundali: { en: 'Kundali Generation', hi: 'कुण्डली निर्माण' },
  ai_chat: { en: 'AI Chart Chat', hi: 'AI चार्ट चैट' },
  saved_charts: { en: 'Saved Charts', hi: 'सहेजे गए चार्ट' },
  pdf_export: { en: 'PDF Export', hi: 'PDF निर्यात' },
  matching_full: { en: 'Full Matching Report', hi: 'पूर्ण मिलान रिपोर्ट' },
  shadbala_full: { en: 'Full Shadbala Analysis', hi: 'पूर्ण षड्बल विश्लेषण' },
  yogas_full: { en: 'Complete Yoga Analysis', hi: 'पूर्ण योग विश्लेषण' },
  varshaphal: { en: 'Varshaphal (Annual)', hi: 'वर्षफल' },
  kp_system: { en: 'KP System', hi: 'केपी पद्धति' },
  prashna: { en: 'Prashna Kundali', hi: 'प्रश्न कुण्डली' },
  muhurta_ai: { en: 'Muhurta AI Scanner', hi: 'मुहूर्त AI स्कैनर' },
  tippanni_full: { en: 'Full Interpretations', hi: 'पूर्ण टिप्पणी' },
  varga_full: { en: 'All Divisional Charts', hi: 'सभी विभागीय चार्ट' },
  batch: { en: 'Batch Processing', hi: 'बैच प्रोसेसिंग' },
  api_access: { en: 'API Access', hi: 'API एक्सेस' },
  ad_free: { en: 'Ad-Free Experience', hi: 'विज्ञापन-मुक्त अनुभव' },
};
