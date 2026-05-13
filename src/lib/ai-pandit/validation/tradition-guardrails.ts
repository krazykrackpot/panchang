/**
 * Layer 3 — Tradition Guardrails
 *
 * Catches claims that violate immutable Jyotish rules, regardless of chart.
 * Also detects Hinglish code-switching in Hindi narratives (warning, not block).
 *
 * Issue 11 from design review: exaltation rules are built once at module level
 * (not per call) to avoid compiling 77 regexes on every validation.
 */

import type { ValidationResult, ValidationFailure } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Rule type
// ─────────────────────────────────────────────────────────────────────────────

interface TraditionRule {
  pattern: RegExp;
  message: string;
  /** If true, can be fixed by string replacement. */
  fixable: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Benefic/Malefic rules (bilingual)
// ─────────────────────────────────────────────────────────────────────────────

const BENEFIC_MALEFIC_RULES: TraditionRule[] = [
  // English: benefic called malefic
  { pattern: /Jupiter[^.]{0,30}(malefic|cruel|papa)/i, message: 'Jupiter is a natural benefic, not malefic', fixable: true },
  { pattern: /Venus[^.]{0,30}(malefic|cruel|papa)/i, message: 'Venus is a natural benefic, not malefic', fixable: true },
  { pattern: /(malefic|cruel|papa)[^.]{0,30}Jupiter/i, message: 'Jupiter is a natural benefic, not malefic', fixable: true },
  { pattern: /(malefic|cruel|papa)[^.]{0,30}Venus/i, message: 'Venus is a natural benefic, not malefic', fixable: true },
  // English: malefic called benefic
  { pattern: /Saturn[^.]{0,30}(natural benefic|gentle|saumya)/i, message: 'Saturn is a natural malefic, not benefic', fixable: true },
  { pattern: /Mars[^.]{0,30}(natural benefic|gentle|saumya)/i, message: 'Mars is a natural malefic, not benefic', fixable: true },
  // Hindi: benefic called malefic
  { pattern: /बृहस्पति[^।]{0,30}(पाप|क्रूर|अशुभ ग्रह)/g, message: 'बृहस्पति शुभ ग्रह हैं, पाप ग्रह नहीं', fixable: true },
  { pattern: /गुरु[^।]{0,30}(पाप|क्रूर|अशुभ ग्रह)/g, message: 'गुरु शुभ ग्रह हैं, पाप ग्रह नहीं', fixable: true },
  { pattern: /शुक्र[^।]{0,30}(पाप|क्रूर|अशुभ ग्रह)/g, message: 'शुक्र शुभ ग्रह हैं, पाप ग्रह नहीं', fixable: true },
  // Hindi: malefic called benefic
  { pattern: /शनि[^।]{0,30}(शुभ ग्रह|सौम्य ग्रह)/g, message: 'शनि पाप ग्रह हैं, शुभ ग्रह नहीं', fixable: true },
  { pattern: /मंगल[^।]{0,30}(शुभ ग्रह|सौम्य ग्रह)/g, message: 'मंगल पाप ग्रह हैं, शुभ ग्रह नहीं', fixable: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// Wrong special aspect rules (bilingual)
// ─────────────────────────────────────────────────────────────────────────────

const WRONG_ASPECT_RULES: TraditionRule[] = [
  // Mars aspects 4th, 7th, 8th — NOT 5th or 9th
  { pattern: /Mars[^.]{0,40}aspects?[^.]{0,20}(5th|9th|fifth|ninth)/i, message: 'Mars aspects 4th/7th/8th, NOT 5th/9th', fixable: false },
  // Jupiter aspects 5th, 7th, 9th — NOT 4th or 8th
  { pattern: /Jupiter[^.]{0,40}aspects?[^.]{0,20}(4th|8th|fourth|eighth)/i, message: 'Jupiter aspects 5th/7th/9th, NOT 4th/8th', fixable: false },
  // Saturn aspects 3rd, 7th, 10th — NOT 5th or 9th
  { pattern: /Saturn[^.]{0,40}aspects?[^.]{0,20}(5th|9th|fifth|ninth)/i, message: 'Saturn aspects 3rd/7th/10th, NOT 5th/9th', fixable: false },
  // Hindi — both word orders: "मंगल ... दृष्टि ... पंचम" and "मंगल ... पंचम ... दृष्टि"
  { pattern: /मंगल[^।]{0,40}(पंचम|नवम)[^।]{0,20}(दृष्टि)/g, message: 'मंगल की 4/7/8 दृष्टि है, 5/9 नहीं', fixable: false },
  { pattern: /मंगल[^।]{0,40}(दृष्टि)[^।]{0,20}(पंचम|नवम)/g, message: 'मंगल की 4/7/8 दृष्टि है, 5/9 नहीं', fixable: false },
  { pattern: /बृहस्पति[^।]{0,40}(चतुर्थ|अष्टम)[^।]{0,20}(दृष्टि)/g, message: 'बृहस्पति की 5/7/9 दृष्टि है, 4/8 नहीं', fixable: false },
  { pattern: /बृहस्पति[^।]{0,40}(दृष्टि)[^।]{0,20}(चतुर्थ|अष्टम)/g, message: 'बृहस्पति की 5/7/9 दृष्टि है, 4/8 नहीं', fixable: false },
  { pattern: /शनि[^।]{0,40}(पंचम|नवम)[^।]{0,20}(दृष्टि)/g, message: 'शनि की 3/7/10 दृष्टि है, 5/9 नहीं', fixable: false },
  { pattern: /शनि[^।]{0,40}(दृष्टि)[^।]{0,20}(पंचम|नवम)/g, message: 'शनि की 3/7/10 दृष्टि है, 5/9 नहीं', fixable: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// Exaltation rules — built ONCE at module level (Issue 11)
// ─────────────────────────────────────────────────────────────────────────────

const EXALTATION_MAP: Record<string, string> = {
  Sun: 'Aries', Moon: 'Taurus', Mars: 'Capricorn', Mercury: 'Virgo',
  Jupiter: 'Cancer', Venus: 'Pisces', Saturn: 'Libra',
};

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

function buildExaltationRules(): TraditionRule[] {
  const rules: TraditionRule[] = [];
  for (const [planet, correctSign] of Object.entries(EXALTATION_MAP)) {
    for (const sign of SIGN_NAMES) {
      if (sign === correctSign) continue;
      rules.push({
        pattern: new RegExp(`${planet}[^.]{0,30}exalted[^.]{0,20}${sign}`, 'i'),
        message: `${planet} is exalted in ${correctSign}, not ${sign}`,
        fixable: false,
      });
    }
  }
  return rules;
}

// Computed ONCE at import time (77 patterns, not per call)
const EXALTATION_RULES = buildExaltationRules();

// ─────────────────────────────────────────────────────────────────────────────
// All tradition rules combined
// ─────────────────────────────────────────────────────────────────────────────

const ALL_RULES: TraditionRule[] = [
  ...BENEFIC_MALEFIC_RULES,
  ...WRONG_ASPECT_RULES,
  ...EXALTATION_RULES,
];

// ─────────────────────────────────────────────────────────────────────────────
// Hinglish code-switching detection (WARNING only)
// ─────────────────────────────────────────────────────────────────────────────

const HINGLISH_PATTERNS = [
  { pattern: /\b(Saturn|Jupiter|Mars|Venus|Mercury|Sun|Moon)\s+(ka|ki|ke|ko)\b/gi,
    correction: 'Use Hindi planet names: शनि, बृहस्पति, मंगल, शुक्र, बुध, सूर्य, चन्द्र' },
  { pattern: /\b(transit|retrograde|aspect|house|sign|dasha)\s+(ho|hai|hain|mein|ka|ki)\b/gi,
    correction: 'Use Hindi terms: गोचर, वक्री, दृष्टि, भाव, राशि, दशा' },
  { pattern: /\b(positive|negative|good|bad|excellent)\s+(hai|hain|ho|hoga)\b/gi,
    correction: 'Use Hindi: शुभ, अशुभ, उत्तम, कठिन' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main check
// ─────────────────────────────────────────────────────────────────────────────

export function checkTraditionGuardrails(
  narrative: string,
  locale: string,
): ValidationResult {
  const start = Date.now();
  const failures: ValidationFailure[] = [];
  const warnings: ValidationFailure[] = [];

  for (const rule of ALL_RULES) {
    const match = narrative.match(rule.pattern);
    if (match) {
      failures.push({
        layer: 'tradition_guardrails',
        message: rule.message,
        evidence: match[0],
        fixable: rule.fixable,
      });
    }
  }

  // Hinglish detection — warnings only, for Hindi locale
  if (locale === 'hi') {
    for (const hp of HINGLISH_PATTERNS) {
      const matches = [...narrative.matchAll(hp.pattern)];
      if (matches.length > 0) {
        warnings.push({
          layer: 'tradition_guardrails',
          message: `Hinglish code-switching: ${hp.correction}`,
          evidence: matches.map(m => m[0]).join(', '),
          fixable: false,
          isWarning: true,
        });
      }
    }
  }

  return {
    passed: failures.length === 0,
    failures,
    warnings,
    durationMs: Date.now() - start,
  };
}
