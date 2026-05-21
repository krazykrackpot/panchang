/**
 * Tests for the prompt library.
 *
 * The library is composed from four building blocks (voice, scaffold,
 * common rules with citation substituted, optional safety rule). These
 * tests verify the composition contract — what shows up in the final
 * prompt under which inputs.
 */
import { describe, it, expect } from 'vitest';
import { systemPromptFor, systemPrompt, systemPromptVersion, type CitationMode, type VoiceVariant } from './index';
import { BRIHASPATI_CATEGORIES, BRIHASPATI_LAUNCH_LOCALES, type BrihaspatiCategory, type BrihaspatiLocale } from '../../types';
import { SAFETY_CATEGORIES } from './rules/safety';

const ALL_LOCALES: BrihaspatiLocale[] = ['en', 'hi', 'ta', 'bn', 'sa', 'te', 'kn', 'mr', 'gu', 'mai'];

// ── Composition contract ─────────────────────────────────────────────────

describe('prompt library — composition contract', () => {
  it('produces non-empty text + 16-char version hash for every (category × launch-locale)', () => {
    for (const locale of BRIHASPATI_LAUNCH_LOCALES) {
      for (const category of BRIHASPATI_CATEGORIES) {
        const prompt = systemPromptFor({ category, locale });
        expect(prompt.text.length, `${locale}/${category} text empty`).toBeGreaterThan(200);
        expect(prompt.version, `${locale}/${category} version shape`).toMatch(/^[0-9a-f]{16}$/);
      }
    }
  });

  it('produces non-empty text for every fallback locale (rules fall back to EN)', () => {
    for (const locale of ['sa', 'te', 'kn', 'mr', 'gu', 'mai'] as const) {
      const prompt = systemPromptFor({ category: 'general', locale });
      expect(prompt.text.length).toBeGreaterThan(200);
    }
  });

  it('is deterministic — same inputs always produce same text + version', () => {
    const a = systemPromptFor({ category: 'marriage', locale: 'hi', voice: 'default', citationMode: 'principle-only' });
    const b = systemPromptFor({ category: 'marriage', locale: 'hi', voice: 'default', citationMode: 'principle-only' });
    expect(a.text).toBe(b.text);
    expect(a.version).toBe(b.version);
  });

  it('different categories produce different versions (scaffold differs)', () => {
    const career = systemPromptFor({ category: 'career', locale: 'en' });
    const marriage = systemPromptFor({ category: 'marriage', locale: 'en' });
    expect(career.version).not.toBe(marriage.version);
    expect(career.text).not.toBe(marriage.text);
  });

  it('different locales produce different versions (rules + voice differ)', () => {
    const en = systemPromptFor({ category: 'general', locale: 'en' });
    const hi = systemPromptFor({ category: 'general', locale: 'hi' });
    expect(en.version).not.toBe(hi.version);
  });

  it('different voice variants produce different versions', () => {
    const def = systemPromptFor({ category: 'general', locale: 'en', voice: 'default' });
    const bri = systemPromptFor({ category: 'general', locale: 'en', voice: 'brihaspati' });
    expect(def.version).not.toBe(bri.version);
    expect(def.text).not.toBe(bri.text);
  });

  it('different citation modes produce different versions', () => {
    const principle = systemPromptFor({ category: 'general', locale: 'en', citationMode: 'principle-only' });
    const drop = systemPromptFor({ category: 'general', locale: 'en', citationMode: 'drop' });
    const full = systemPromptFor({ category: 'general', locale: 'en', citationMode: 'full-cite' });
    expect(new Set([principle.version, drop.version, full.version]).size).toBe(3);
  });
});

// ── Multi-locale native authoring (REVIEW L1) ───────────────────────────

describe('prompt library — multi-locale native rules (REVIEW L1)', () => {
  it('Hindi prompt has Devanagari rule block (not English with Hindi voice)', () => {
    const prompt = systemPromptFor({ category: 'marriage', locale: 'hi' });
    // Must contain Devanagari rule keyword "नियम" (rule)
    expect(prompt.text).toMatch(/नियम/);
    // Must NOT contain the English "RULES (non-negotiable)" block
    expect(prompt.text).not.toMatch(/RULES \(non-negotiable\)/);
  });

  it('Tamil prompt has Tamil-script rule block', () => {
    const prompt = systemPromptFor({ category: 'marriage', locale: 'ta' });
    expect(prompt.text).toMatch(/விதிகள்/);
    expect(prompt.text).not.toMatch(/RULES \(non-negotiable\)/);
  });

  it('Bengali prompt has Bengali-script rule block', () => {
    const prompt = systemPromptFor({ category: 'marriage', locale: 'bn' });
    expect(prompt.text).toMatch(/নিয়মাবলী/);
    expect(prompt.text).not.toMatch(/RULES \(non-negotiable\)/);
  });

  it('EN prompt has English rule block', () => {
    const prompt = systemPromptFor({ category: 'marriage', locale: 'en' });
    expect(prompt.text).toMatch(/RULES \(non-negotiable\)/);
  });
});

// ── Citation rule modes (REVIEW L3) ──────────────────────────────────────

describe('prompt library — citation rule modes (REVIEW L3)', () => {
  it('principle-only mode forbids verse-number claims explicitly', () => {
    const prompt = systemPromptFor({ category: 'general', locale: 'en', citationMode: 'principle-only' });
    expect(prompt.text).toMatch(/principle by name/i);
    expect(prompt.text).toMatch(/Do NOT claim a specific chapter or verse number/i);
  });

  it('full-cite mode requires references from JSON only', () => {
    const prompt = systemPromptFor({ category: 'general', locale: 'en', citationMode: 'full-cite' });
    expect(prompt.text).toMatch(/citation/i);
    expect(prompt.text).toMatch(/never invent a verse number/i);
  });

  it('drop mode states no citation is required', () => {
    const prompt = systemPromptFor({ category: 'general', locale: 'en', citationMode: 'drop' });
    expect(prompt.text).toMatch(/No classical citation is required/i);
  });

  it('default mode is principle-only (v0 launch posture)', () => {
    const explicit = systemPromptFor({ category: 'general', locale: 'en', citationMode: 'principle-only' });
    const defaulted = systemPromptFor({ category: 'general', locale: 'en' });
    expect(defaulted.version).toBe(explicit.version);
  });
});

// ── Safety rule scoping (REVIEW P3) ──────────────────────────────────────

describe('prompt library — safety rule scoping (REVIEW P3)', () => {
  const SAFETY_KEYWORDS = ['death', 'divorce', 'binary', 'never give a literal date', 'मृत्यु', 'மரணம்', 'মৃত্যু'];
  function hasSafetyClause(text: string): boolean {
    return SAFETY_KEYWORDS.some((kw) => text.includes(kw));
  }

  it('marriage, health, children, general get the safety rule', () => {
    const SAFETY: BrihaspatiCategory[] = ['marriage', 'health', 'children', 'general'];
    for (const category of SAFETY) {
      const prompt = systemPromptFor({ category, locale: 'en' });
      expect(hasSafetyClause(prompt.text), `${category} missing safety rule`).toBe(true);
    }
  });

  it('career, finance, education, dasha, remedies, compatibility, timing, transit do NOT include the safety rule', () => {
    const NO_SAFETY: BrihaspatiCategory[] = ['career', 'finance', 'education', 'dasha', 'remedies', 'compatibility', 'timing', 'transit'];
    for (const category of NO_SAFETY) {
      const prompt = systemPromptFor({ category, locale: 'en' });
      expect(hasSafetyClause(prompt.text), `${category} should NOT have safety rule`).toBe(false);
    }
  });

  it('SAFETY_CATEGORIES set is the source of truth', () => {
    expect(SAFETY_CATEGORIES.has('marriage')).toBe(true);
    expect(SAFETY_CATEGORIES.has('health')).toBe(true);
    expect(SAFETY_CATEGORIES.has('children')).toBe(true);
    expect(SAFETY_CATEGORIES.has('general')).toBe(true);
    expect(SAFETY_CATEGORIES.has('career')).toBe(false);
    expect(SAFETY_CATEGORIES.has('finance')).toBe(false);
  });

  it('safety rule respects locale (HI prompt has Devanagari safety clause)', () => {
    const prompt = systemPromptFor({ category: 'health', locale: 'hi' });
    expect(prompt.text).toMatch(/मृत्यु/);
  });
});

// ── No competitor references — at the LEVEL the rule was meant to guard ──
//
// The prompt itself names Prokerala/Drik/Shubh in rule-7 ("Never name X")
// as a forbidden-list instruction to the LLM. That's intentional. The
// invariant we DO want is that those names appear ONLY in a "never / Do
// not / कभी न / ஒருபோதும் / কখনই" context — i.e. in the negation, not
// as a positive source citation.

describe('prompt library — competitor names appear only in negation context', () => {
  const BANNED = ['Prokerala', 'Drik Panchang', 'Shubh Panchang'];
  // Each negation marker is paired with a window around the banned term.
  const NEGATION_MARKERS = ['never', 'Never', 'NEVER', 'Do not', 'do not', 'कभी न', 'ஒருபோதும்', 'কখনই'];

  it('every (locale × category × voice × citationMode) prompt: each banned term sits in a negation context', () => {
    for (const locale of BRIHASPATI_LAUNCH_LOCALES) {
      for (const category of BRIHASPATI_CATEGORIES) {
        for (const citationMode of ['principle-only', 'full-cite', 'drop'] as CitationMode[]) {
          for (const voice of ['default', 'brihaspati'] as VoiceVariant[]) {
            const text = systemPromptFor({ category, locale, citationMode, voice }).text;
            for (const term of BANNED) {
              const idx = text.indexOf(term);
              if (idx === -1) continue; // term not mentioned — fine
              // 300-char window around the term (covers SOV negation in Hindi
              // where "कभी न" comes after the noun phrase) must include a
              // negation marker.
              const before = text.slice(Math.max(0, idx - 300), idx);
              const after = text.slice(idx, Math.min(text.length, idx + term.length + 300));
              const hasNegation = NEGATION_MARKERS.some((m) => before.includes(m) || after.includes(m));
              expect(
                hasNegation,
                `${locale}/${category}/${voice}/${citationMode}: "${term}" appears without a negation marker within 300 chars`,
              ).toBe(true);
            }
          }
        }
      }
    }
  });
});

// ── Legacy compatibility ─────────────────────────────────────────────────

describe('prompt library — legacy compatibility', () => {
  it('systemPrompt() (legacy) returns the same text as systemPromptFor({...defaults})', () => {
    const legacy = systemPrompt('en');
    const explicit = systemPromptFor({ category: 'general', locale: 'en' }).text;
    expect(legacy).toBe(explicit);
  });

  it('systemPromptVersion() (legacy) returns the same hash as systemPromptFor({...defaults}).version', () => {
    const legacy = systemPromptVersion('en');
    const explicit = systemPromptFor({ category: 'general', locale: 'en' }).version;
    expect(legacy).toBe(explicit);
  });
});

// ── Coverage across all locales (parity) ─────────────────────────────────

describe('prompt library — locale parity', () => {
  it('every locale produces a valid prompt for every category', () => {
    for (const locale of ALL_LOCALES) {
      for (const category of BRIHASPATI_CATEGORIES) {
        const prompt = systemPromptFor({ category, locale });
        expect(prompt.text.length, `${locale}/${category}`).toBeGreaterThan(200);
      }
    }
  });
});
