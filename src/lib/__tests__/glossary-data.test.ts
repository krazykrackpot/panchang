// src/lib/__tests__/glossary-data.test.ts
import { describe, it, expect } from 'vitest';
import { GLOSSARY, type GlossaryEntry } from '../constants/glossary';

describe('glossary data integrity', () => {
  it('has at least 40 entries', () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(40);
  });

  it('every entry has all required fields', () => {
    for (const entry of GLOSSARY) {
      expect(entry.id, `${entry.id} missing id`).toBeTruthy();
      expect(entry.term.en, `${entry.id} missing term.en`).toBeTruthy();
      expect(entry.pronunciation, `${entry.id} missing pronunciation`).toBeTruthy();
      expect(entry.shortDef, `${entry.id} missing shortDef`).toBeTruthy();
      expect(entry.fullDef, `${entry.id} missing fullDef`).toBeTruthy();
      expect(entry.category, `${entry.id} missing category`).toBeTruthy();
      expect(['panchang', 'kundali', 'dasha', 'yoga', 'general']).toContain(entry.category);
      expect(Array.isArray(entry.relatedTerms), `${entry.id} relatedTerms not array`).toBe(true);
    }
  });

  it('has no duplicate IDs', () => {
    const ids = GLOSSARY.map(e => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every relatedTerms reference points to an existing term ID', () => {
    const ids = new Set(GLOSSARY.map(e => e.id));
    for (const entry of GLOSSARY) {
      for (const ref of entry.relatedTerms) {
        expect(ids.has(ref), `${entry.id} references non-existent term "${ref}"`).toBe(true);
      }
    }
  });

  it('covers all 5 categories', () => {
    const categories = new Set(GLOSSARY.map(e => e.category));
    expect(categories.has('panchang')).toBe(true);
    expect(categories.has('kundali')).toBe(true);
    expect(categories.has('dasha')).toBe(true);
    expect(categories.has('yoga')).toBe(true);
    expect(categories.has('general')).toBe(true);
  });

  it('shortDef is under 120 chars for tooltip display', () => {
    for (const entry of GLOSSARY) {
      expect(entry.shortDef.length, `${entry.id} shortDef too long: ${entry.shortDef.length}`).toBeLessThanOrEqual(120);
    }
  });
});
