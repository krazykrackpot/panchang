/**
 * Festival icon coverage tests.
 *
 * - Known slugs map to a non-undefined component
 * - Unknown slug + undefined fall back to GenericFestivalIcon (no crash)
 * - Sanity-check the manually-curated map: every Ekadashi/Sankranti slug is
 *   registered programmatically (see FestivalIcons.tsx) so the loops can't
 *   silently miss any.
 */
import { describe, it, expect } from 'vitest';
import { festivalIconFor, FESTIVAL_ICONS, GenericFestivalIcon } from '@/components/icons/FestivalIcons';

describe('festivalIconFor', () => {
  it('returns the specific icon for known slugs', () => {
    expect(festivalIconFor('diwali')).not.toBe(GenericFestivalIcon);
    expect(festivalIconFor('holi')).not.toBe(GenericFestivalIcon);
    expect(festivalIconFor('maha-shivaratri')).not.toBe(GenericFestivalIcon);
    expect(festivalIconFor('ganesh-chaturthi')).not.toBe(GenericFestivalIcon);
  });
  it('falls back to GenericFestivalIcon for unknown slug', () => {
    expect(festivalIconFor('unknown-festival-xyz')).toBe(GenericFestivalIcon);
  });
  it('falls back to GenericFestivalIcon for undefined / empty slug', () => {
    expect(festivalIconFor(undefined)).toBe(GenericFestivalIcon);
    expect(festivalIconFor('')).toBe(GenericFestivalIcon);
  });
});

describe('FESTIVAL_ICONS map — sanity', () => {
  it('every entry is a renderable component', () => {
    for (const [slug, comp] of Object.entries(FESTIVAL_ICONS)) {
      expect(comp, `slug "${slug}" has undefined component`).toBeDefined();
      expect(typeof comp).toBe('function');
    }
  });
  it('all 24 Ekadashi slugs are registered', () => {
    const expected = [
      'kamada-ekadashi', 'papamochani-ekadashi',
      'mohini-ekadashi', 'varuthini-ekadashi',
      'apara-ekadashi', 'nirjala-ekadashi',
      'devshayani-ekadashi', 'yogini-ekadashi',
      'shravana-putrada-ekadashi', 'kamika-ekadashi',
      'aja-ekadashi', 'parivartini-ekadashi', 'pavitra-ekadashi',
      'indira-ekadashi', 'papankusha-ekadashi',
      'rama-ekadashi', 'devuthana-ekadashi', 'devotthana-ekadashi', 'prabodhini-ekadashi',
      'utpanna-ekadashi', 'mokshada-ekadashi',
      'saphala-ekadashi', 'pausha-putrada-ekadashi',
      'shattila-ekadashi', 'jaya-ekadashi', 'vijaya-ekadashi',
      'amalaki-ekadashi',
    ];
    for (const slug of expected) {
      expect(FESTIVAL_ICONS[slug], `${slug} missing from map`).toBeDefined();
    }
  });
  it('all 12 Sankranti slugs are registered', () => {
    const expected = [
      'makar-sankranti', 'kumbha-sankranti', 'meena-sankranti',
      'mesha-sankranti', 'vrishabha-sankranti', 'mithuna-sankranti',
      'karka-sankranti', 'simha-sankranti', 'kanya-sankranti',
      'tula-sankranti', 'vrishchika-sankranti', 'dhanu-sankranti',
    ];
    for (const slug of expected) {
      expect(FESTIVAL_ICONS[slug], `${slug} missing from map`).toBeDefined();
    }
  });
});
