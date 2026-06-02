/**
 * Localised breadcrumb labels for top-level sections.
 *
 * Centralised so the visible breadcrumb trail and any future SEO-side
 * breadcrumb rendering use the same strings per locale. Sanskrit (`sa`)
 * is included for the few legacy routes that still surface it, even
 * though it's not in the active `Locale` union.
 */

export const BREADCRUMB_HOME: Record<string, string> = {
  en: 'Home',
  hi: 'मुख्य',
  sa: 'मुख्यम्',
  ta: 'முகப்பு',
  te: 'హోమ్',
  bn: 'হোম',
  kn: 'ಹೋಮ್',
  gu: 'હોમ',
  mr: 'मुख्य',
  mai: 'मुख्य',
};

export const BREADCRUMB_MUHURTA: Record<string, string> = {
  en: 'Muhurta',
  hi: 'मुहूर्त',
  sa: 'मुहूर्तम्',
  ta: 'முகூர்த்தம்',
  te: 'ముహూర్తం',
  bn: 'মুহূর্ত',
  kn: 'ಮುಹೂರ್ತ',
  gu: 'મુહૂર્ત',
  mr: 'मुहूर्त',
  mai: 'मुहूर्त',
};
