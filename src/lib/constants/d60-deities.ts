/**
 * D60 Shashtiamsha (षष्ट्यंश) — sixty-deity table
 *
 * Each Rāśi is divided into 60 segments of 0.5° (half a degree) each. Every
 * segment is named after a deity, and each deity has a classical
 * benefic/malefic nature that modulates the effect of any graha falling
 * within that segment. D60 is considered the most subtle and important
 * divisional chart in BPHS (past-life karma, overall confirmation of
 * promises seen in other vargas).
 *
 * Primary sources (hand-transcribed; do NOT regenerate from LLM training
 * data):
 *
 *   1. Deity names: Brihat Parāśara Horā Śhāstra Ch. 6, verses 33-41.
 *      Santhanam (R.) English translation, available via the Vedpuran
 *      archive (https://vedpuran.net/wp-content/uploads/2021/04/
 *      brihat_parashara_hora_shastra_english_v.pdf). Verbatim quote from
 *      v.41: "The reverse is the order for even Rāśis in so much, as these
 *      names are cased. Grahas in benefic Shashtiāńśas produce auspicious,
 *      while the opposite is true in case of Grahas in malefic
 *      Shashtiāńśas." Cross-verified against srivarahamihira.medium.com
 *      and jothishi.com (both independently citing "BPHS 6.33-41" with
 *      matching names).
 *
 *   2. Krura (malefic) classification: Phaladeepika (Mantreswara). BPHS Ch.6
 *      does not classify each deity as benefic/malefic — it only assigns
 *      names. The Krura/Saumya tagging comes from Phaladeepika.
 *      Two English translations differ at a single position:
 *        - V. Subrahmanya Sastri (1950, Internet Archive): position 18 Krura
 *        - Pandit Gopesh Kumar Ojha (2021):                position 16 Krura
 *      We expose both as variants and default to Sastri (the standard
 *      academic reference). Spec: docs/superpowers/specs/
 *      2026-05-30-d60-deity-table-spec.md.
 *
 * Sign calculation for D60 is a separate concern handled in
 * src/lib/ephem/kundali-calc.ts and is NOT part of this file. The current
 * engine uses the Sanjay Rath simplification (same-sign odd / 7th-sign
 * even); switching to the BPHS-canonical "tadraaseh" formula is gated
 * behind a feature flag in a separate follow-up PR.
 */

import type { LocaleText } from '@/types/panchang';

export interface D60Deity {
  /** 1-based position within the 60 segments (1..60) */
  readonly position: number;
  /** Deity name across the bundled locales. EN is the Santhanam transliteration;
   *  HI and SA use the canonical Devanagari forms. Other locales fall back to
   *  EN at render time (project convention for classical-text terms). */
  readonly name: LocaleText;
}

/**
 * Sixty deity names for D60 segments IN ODD RĀŚIS, listed in the order BPHS
 * Ch.6 v.33-41 gives them. Position 1 corresponds to the first 0.5° segment
 * (0°00'-0°30') of an odd sign. For EVEN signs the order is REVERSED — use
 * {@link getD60Deity} to apply the reversal correctly.
 *
 * Some names repeat (e.g., "Kaal" at positions 15, 32, 44; "Amrit" at 17,
 * 38, 57; "Deva" at 3, 25; "Komal" at 20, 46; "Ghora" at 1, 34; "Saumya"
 * at 45, 54). This is per BPHS and is intentional — the deity-segment
 * mapping is the canonical 1:1 even though some deity NAMES recur.
 */
export const D60_DEITIES_ODD: ReadonlyArray<D60Deity> = Object.freeze([
  { position: 1,  name: { en: 'Ghora',          hi: 'घोर',           sa: 'घोर'           } },
  { position: 2,  name: { en: 'Rakshasa',       hi: 'राक्षस',         sa: 'राक्षस'         } },
  { position: 3,  name: { en: 'Deva',           hi: 'देव',           sa: 'देव'           } },
  { position: 4,  name: { en: 'Kuber',          hi: 'कुबेर',          sa: 'कुबेर'          } },
  { position: 5,  name: { en: 'Yaksh',          hi: 'यक्ष',           sa: 'यक्ष'           } },
  { position: 6,  name: { en: 'Kindar',         hi: 'किन्नर',          sa: 'किन्नर'          } },
  { position: 7,  name: { en: 'Bhrasht',        hi: 'भ्रष्ट',          sa: 'भ्रष्ट'          } },
  { position: 8,  name: { en: 'Kulaghna',       hi: 'कुलघ्न',          sa: 'कुलघ्न'          } },
  { position: 9,  name: { en: 'Garal',          hi: 'गरल',           sa: 'गरल'           } },
  { position: 10, name: { en: 'Vahni',          hi: 'वह्नि',           sa: 'वह्नि'           } },
  { position: 11, name: { en: 'Maya',           hi: 'माया',           sa: 'माया'           } },
  { position: 12, name: { en: 'Purishak',       hi: 'पुरीषक',          sa: 'पुरीषक'          } },
  { position: 13, name: { en: 'Apampathi',      hi: 'अपांपति',         sa: 'अपांपति'         } },
  { position: 14, name: { en: 'Marutwan',       hi: 'मरुत्वान्',        sa: 'मरुत्वान्'        } },
  { position: 15, name: { en: 'Kaal',           hi: 'काल',           sa: 'काल'           } },
  { position: 16, name: { en: 'Sarpa',          hi: 'सर्प',           sa: 'सर्प'           } },
  { position: 17, name: { en: 'Amrit',          hi: 'अमृत',           sa: 'अमृत'           } },
  { position: 18, name: { en: 'Indu',           hi: 'इन्दु',           sa: 'इन्दु'           } },
  { position: 19, name: { en: 'Mridu',          hi: 'मृदु',           sa: 'मृदु'           } },
  { position: 20, name: { en: 'Komal',          hi: 'कोमल',           sa: 'कोमल'           } },
  { position: 21, name: { en: 'Heramba',        hi: 'हेरम्ब',          sa: 'हेरम्ब'          } },
  { position: 22, name: { en: 'Brahma',         hi: 'ब्रह्मा',          sa: 'ब्रह्मा'          } },
  { position: 23, name: { en: 'Vishnu',         hi: 'विष्णु',          sa: 'विष्णु'          } },
  { position: 24, name: { en: 'Maheshwara',     hi: 'महेश्वर',         sa: 'महेश्वर'         } },
  { position: 25, name: { en: 'Deva',           hi: 'देव',           sa: 'देव'           } },
  { position: 26, name: { en: 'Ardr',           hi: 'आर्द्र',          sa: 'आर्द्र'          } },
  { position: 27, name: { en: 'Kalinas',        hi: 'कलिनाश',          sa: 'कलिनाश'          } },
  { position: 28, name: { en: 'Kshitees',       hi: 'क्षितीश',          sa: 'क्षितीश'          } },
  { position: 29, name: { en: 'Kamalakar',      hi: 'कमलाकर',          sa: 'कमलाकर'          } },
  { position: 30, name: { en: 'Gulik',          hi: 'गुलिक',          sa: 'गुलिक'          } },
  { position: 31, name: { en: 'Mrityu',         hi: 'मृत्यु',          sa: 'मृत्यु'          } },
  { position: 32, name: { en: 'Kaal',           hi: 'काल',           sa: 'काल'           } },
  { position: 33, name: { en: 'Davagni',        hi: 'दवाग्नि',         sa: 'दवाग्नि'         } },
  { position: 34, name: { en: 'Ghora',          hi: 'घोर',           sa: 'घोर'           } },
  { position: 35, name: { en: 'Yama',           hi: 'यम',            sa: 'यम'            } },
  { position: 36, name: { en: 'Kantak',         hi: 'कण्टक',          sa: 'कण्टक'          } },
  { position: 37, name: { en: 'Suddh',          hi: 'शुद्ध',           sa: 'शुद्ध'           } },
  { position: 38, name: { en: 'Amrit',          hi: 'अमृत',           sa: 'अमृत'           } },
  { position: 39, name: { en: 'PurnaCandr',     hi: 'पूर्णचन्द्र',         sa: 'पूर्णचन्द्र'         } },
  { position: 40, name: { en: 'Vishadagdha',    hi: 'विषदग्ध',         sa: 'विषदग्ध'         } },
  { position: 41, name: { en: 'Kulanas',        hi: 'कुलनाश',          sa: 'कुलनाश'          } },
  { position: 42, name: { en: 'Vamshakshaya',   hi: 'वंशक्षय',         sa: 'वंशक्षय'         } },
  { position: 43, name: { en: 'Utpat',          hi: 'उत्पात',          sa: 'उत्पात'          } },
  { position: 44, name: { en: 'Kaal',           hi: 'काल',           sa: 'काल'           } },
  { position: 45, name: { en: 'Saumya',         hi: 'सौम्य',          sa: 'सौम्य'          } },
  { position: 46, name: { en: 'Komal',          hi: 'कोमल',           sa: 'कोमल'           } },
  { position: 47, name: { en: 'Sheetal',        hi: 'शीतल',           sa: 'शीतल'           } },
  { position: 48, name: { en: 'Karaladamshtr',  hi: 'करालदंष्ट्र',       sa: 'करालदंष्ट्र'       } },
  { position: 49, name: { en: 'Candramukhi',    hi: 'चन्द्रमुखी',        sa: 'चन्द्रमुखी'        } },
  { position: 50, name: { en: 'Praveen',        hi: 'प्रवीण',          sa: 'प्रवीण'          } },
  { position: 51, name: { en: 'Kaalpavak',      hi: 'कालपावक',         sa: 'कालपावक'         } },
  { position: 52, name: { en: 'Dhannayudh',     hi: 'दण्डायुध',         sa: 'दण्डायुध'         } },
  { position: 53, name: { en: 'Nirmal',         hi: 'निर्मल',          sa: 'निर्मल'          } },
  { position: 54, name: { en: 'Saumya',         hi: 'सौम्य',          sa: 'सौम्य'          } },
  { position: 55, name: { en: 'Krur',           hi: 'क्रूर',           sa: 'क्रूर'           } },
  { position: 56, name: { en: 'Atisheetal',     hi: 'अतिशीतल',         sa: 'अतिशीतल'         } },
  { position: 57, name: { en: 'Amrit',          hi: 'अमृत',           sa: 'अमृत'           } },
  { position: 58, name: { en: 'Payodhi',        hi: 'पयोधि',          sa: 'पयोधि'          } },
  { position: 59, name: { en: 'Brahman',        hi: 'ब्रह्मन्',          sa: 'ब्रह्मन्'          } },
  { position: 60, name: { en: 'CandraRekha',    hi: 'चन्द्ररेखा',        sa: 'चन्द्ररेखा'        } },
]);

/** Krura (malefic) D60 positions in ODD signs per Phaladeepika.
 *  Two translations disagree at a single position: Sastri lists 18, Ojha
 *  lists 16. Both sets have 24 entries. For EVEN signs, swap Krura/Saumya
 *  via {@link isKruraD60}. */
export type D60KruraVariant = 'sastri' | 'ojha';

const KRURA_BASE = [1, 2, 8, 9, 10, 11, 12, 15, 30, 31, 32, 33, 34, 35, 39, 40, 42, 43, 44, 48, 51, 52, 59] as const;

/** Sastri (1950) — the standard academic reference. Position 18 is Krura. */
export const KRURA_POSITIONS_SASTRI: ReadonlySet<number> = Object.freeze(new Set<number>([...KRURA_BASE, 18])) as ReadonlySet<number>;

/** Ojha (2021) — modern Bhavartha Bodhini commentary. Position 16 is Krura instead of 18. */
export const KRURA_POSITIONS_OJHA: ReadonlySet<number> = Object.freeze(new Set<number>([...KRURA_BASE, 16])) as ReadonlySet<number>;

const KRURA_VARIANTS: Record<D60KruraVariant, ReadonlySet<number>> = {
  sastri: KRURA_POSITIONS_SASTRI,
  ojha: KRURA_POSITIONS_OJHA,
};

/** Default Krura variant — Sastri because it is the more widely cited
 *  Phaladeepika English translation in academic Jyotish literature. */
export const DEFAULT_KRURA_VARIANT: D60KruraVariant = 'sastri';

/**
 * Return the deity for D60 position `position` (1..60) given whether the
 * containing rāśi is odd or even. Handles the BPHS even-sign reversal:
 * position N in an even sign yields the deity at index (60 - N + 1) of the
 * odd-sign list (per Ch.6 v.41 "the reverse is the order for even Rāśis").
 *
 * Throws on out-of-range input — the caller should always pass a valid
 * 1-60 position derived from `floor(degInSign * 2) + 1`.
 */
export function getD60Deity(position: number, isOddSign: boolean): D60Deity {
  if (!Number.isInteger(position) || position < 1 || position > 60) {
    throw new RangeError(`getD60Deity: position must be 1..60, got ${position}`);
  }
  const effectiveIndex = isOddSign ? position - 1 : 60 - position;
  // Both branches index into a 60-element frozen array; bounds are
  // guaranteed by the range check above.
  return D60_DEITIES_ODD[effectiveIndex]!;
}

/**
 * Is the D60 position Krura (malefic) for the given sign parity? Reverses
 * Krura/Saumya for even signs per Phaladeepika ("...the Shastyamsa portions
 * stated as Krura in the odd signs are the Saumya ones in the even signs
 * and vice versa").
 */
export function isKruraD60(
  position: number,
  isOddSign: boolean,
  variant: D60KruraVariant = DEFAULT_KRURA_VARIANT,
): boolean {
  if (!Number.isInteger(position) || position < 1 || position > 60) {
    throw new RangeError(`isKruraD60: position must be 1..60, got ${position}`);
  }
  const set = KRURA_VARIANTS[variant];
  const oddSignKrura = set.has(position);
  return isOddSign ? oddSignKrura : !oddSignKrura;
}
