/**
 * Career Muhurta — 8 activity definitions.
 *
 * Each entry uses the same `ExtendedActivity` shape as the existing 20
 * activities in `activity-rules-extended.ts`. The registry is merged into
 * `EXTENDED_ACTIVITIES` so the existing `computeDayVerdict` engine path
 * handles career activities exactly like marriage / griha_pravesh —
 * no parallel scorer (see docs/superpowers/specs/2026-05-27-career-muhurta-design.md §3).
 *
 * NAKSHATRA NUMBER REFERENCE (1-indexed):
 *   1 Ashwini · 2 Bharani · 3 Krittika · 4 Rohini · 5 Mrigashira · 6 Ardra
 *   7 Punarvasu · 8 Pushya · 9 Ashlesha · 10 Magha · 11 P.Phalguni · 12 U.Phalguni
 *   13 Hasta · 14 Chitra · 15 Swati · 16 Vishakha · 17 Anuradha · 18 Jyeshtha
 *   19 Mula · 20 P.Ashadha · 21 U.Ashadha · 22 Shravana · 23 Dhanishtha
 *   24 Shatabhisha · 25 P.Bhadrapada · 26 U.Bhadrapada · 27 Revati
 *
 * Sources (cross-referenced for each entry below):
 *   MC = Muhurta Chintamani — Daivagna Ramacharya
 *   BR = Muhurtha (B.V. Raman, Ch. 12-13)
 *   BS = Brihat Samhita Ch. 105 (Varahamihira — career & wealth)
 *   NS = Nirṇaya Sindhu
 *
 * Saturday note: per user decision 2026-05-27, Saturday is NOT in
 * `goodWeekdays` for career activities (Shani is not ideal for new
 * beginnings) but is NOT in any avoid list either — so it renders as
 * "fair" not "avoid". Working professionals who can only interview /
 * negotiate on weekends still get usable windows.
 */
import type { ExtendedActivity, CareerActivityId } from '@/types/muhurta-ai';

export const CAREER_ACTIVITIES: Record<CareerActivityId, ExtendedActivity> = {

  // ═══════════════════════════════════════════════════════════════════
  // JOB INTERVIEW (Vidyārambha / first-impression overlay)
  // ═══════════════════════════════════════════════════════════════════
  job_interview: {
    id: 'job_interview',
    label: {
      en: 'Job Interview',
      hi: 'नौकरी इंटरव्यू',
      sa: 'साक्षात्कारः',
    },
    // Jaya (3, 13) + Purna (5, 10, 15) tithis classically favourable for
    // verbal exchange + first impression. MC Ch. 4 (Vidyārambha) confirms.
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Nakshatras supporting communication / first impressions / accomplishment:
    // Rohini(4) wealth+stability; Mrigashira(5) curiosity; Pushya(8)
    // universally auspicious; U.Phalguni(12), Hasta(13), Anuradha(17),
    // U.Ashadha(21), Shravana(22) — career-friendly per BS 105; U.Bhadrapada(26),
    // Revati(27) soft auspicious.
    goodNakshatras: [4, 5, 8, 12, 13, 14, 17, 21, 22, 26, 27],
    // Wed (Mercury — communication), Thu (Jupiter — wisdom), Fri (Venus —
    // first impression), Mon (Moon — gentle public-facing). Tue+Sat omitted.
    goodWeekdays: [1, 3, 4, 5],
    // Rikta (4, 9, 14) + Amavasya (30).
    avoidTithis: [4, 9, 14, 30],
    // Ashwini(1) impulsive, Ardra(6) destruction, Ashlesha(9) treachery,
    // P.Phalguni(11) self-indulgent, Jyeshtha(18) eldership conflict,
    // Mula(19) uprooting, P.Ashadha(20) purification, P.Bhadrapada(25) fierce.
    avoidNakshatras: [1, 6, 9, 11, 18, 19, 20, 25],
    // Jupiter (4) wisdom, Mercury (3) communication, Sun (0) authority.
    goodHoras: [4, 3, 0],
    // No absolute nakshatra veto — even unfavourable nakshatras don't
    // forbid the activity (an interview is not as classically guarded
    // as marriage). The verdict scanner still hard-blocks Rahu Kaal etc.
    hardAvoidNakshatras: [],
    // 10 Karma (career), 6 Service (employment), 2 Wealth (compensation).
    relevantHouses: [10, 6, 2],
  },

  // ═══════════════════════════════════════════════════════════════════
  // JOB APPLICATION (Vyavasāya prasāra — sending one's work outward)
  // ═══════════════════════════════════════════════════════════════════
  job_application: {
    id: 'job_application',
    label: {
      en: 'Job Application',
      hi: 'नौकरी आवेदन',
      sa: 'व्यवसायप्रसारः',
    },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Communication-focused selection: Pushya(8), U.Phalguni(12),
    // Hasta(13), Anuradha(17), U.Ashadha(21), Shravana(22), U.Bhadrapada(26).
    // Rohini(4) for wealth backing. Slightly stricter than interview.
    goodNakshatras: [4, 8, 12, 13, 17, 21, 22, 26],
    // Wed-Thu-Fri primary; Mon secondary.
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 9, 14, 30],
    avoidNakshatras: [1, 2, 6, 9, 11, 18, 19, 25],
    // Mercury hora (communication) is FIRST for sending applications.
    goodHoras: [3, 4, 0],
    hardAvoidNakshatras: [],
    // 10 Karma, 3 Communication (the actual sending act), 6 Service.
    relevantHouses: [10, 3, 6],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SALARY NEGOTIATION (Dhana-arjana — wealth acquisition)
  // ═══════════════════════════════════════════════════════════════════
  salary_negotiation: {
    id: 'salary_negotiation',
    label: {
      en: 'Salary Negotiation',
      hi: 'वेतन वार्ता',
      sa: 'धनार्जनम्',
    },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Wealth-emphasis: Rohini(4) wealth, Mrigashira(5) gains, Pushya(8)
    // prosperity, U.Phalguni(12) gains, Hasta(13), Anuradha(17) friendship,
    // U.Ashadha(21) success, Shravana(22), Dhanishtha(23) wealth (literally
    // "wealthiest"), U.Bhadrapada(26).
    goodNakshatras: [4, 5, 8, 12, 13, 17, 21, 22, 23, 26],
    // Thursday (Jupiter — expansion, generosity) and Friday (Venus —
    // luxury, partnership) lead; Mon+Wed support.
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 9, 14, 30],
    avoidNakshatras: [1, 2, 6, 9, 11, 18, 19, 25],
    // Jupiter (expansion) and Venus (luxury) lead the hora preference.
    goodHoras: [4, 5, 3],
    hardAvoidNakshatras: [],
    // 2 Wealth, 11 Gains, 10 Karma.
    relevantHouses: [2, 11, 10],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CONTRACT / OFFER SIGNING (Lekhya-pātha + Sankalpa)
  // Stricter than interview — written commitment is classically guarded
  // close to marriage. Vishti karana and Mula/Bharani are hard vetoes.
  // ═══════════════════════════════════════════════════════════════════
  contract_signing: {
    id: 'contract_signing',
    label: {
      en: 'Contract / Offer Signing',
      hi: 'अनुबंध हस्ताक्षर',
      sa: 'सङ्कल्प-लेख्यपाठः',
    },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Sthira (fixed) nakshatras dominate — a contract is a fixed commitment.
    // Rohini(4), U.Phalguni(12), U.Ashadha(21), U.Bhadrapada(26) are the
    // four Sthira nakshatras. Plus Pushya(8), Hasta(13), Anuradha(17),
    // Shravana(22) — soft + reliable.
    goodNakshatras: [4, 8, 12, 13, 17, 21, 22, 26],
    goodWeekdays: [1, 3, 4, 5],
    // Ashtami (8) added to avoid — classical caution for binding writs.
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 2, 6, 9, 11, 18, 19, 20, 25],
    // Mercury (writing/documents) first; Jupiter (wisdom in commitment)
    // second; Venus (smooth handshake) third.
    goodHoras: [3, 4, 5],
    // Bharani(2)=Yama/ending — antithetical to a beginning; Mula(19)=
    // uprooting — directly opposes the "fixed" nature of a contract.
    hardAvoidNakshatras: [2, 19],
    relevantHouses: [10, 2, 11],
  },

  // ═══════════════════════════════════════════════════════════════════
  // FIRST DAY AT NEW JOB (Gṛha-praveśa figurative — entering new "home")
  // ═══════════════════════════════════════════════════════════════════
  first_day_at_job: {
    id: 'first_day_at_job',
    label: {
      en: 'First Day at New Job',
      hi: 'नई नौकरी का पहला दिन',
      sa: 'नवकार्यप्रवेशः',
    },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Same Sthira-emphasis as Griha Pravesh — entering a permanent place.
    // Adds Revati(27) for auspicious arrival.
    goodNakshatras: [4, 8, 12, 13, 17, 21, 22, 26, 27],
    // Mon/Wed/Thu/Fri — Tue/Sat avoided per Griha Pravesh tradition
    // (Mars=conflict, Saturn=delay for entering new space).
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 9, 14, 30],
    avoidNakshatras: [1, 2, 6, 9, 11, 18, 19, 20, 25],
    // Jupiter (auspicious arrival), Sun (visibility), Mercury (introductions).
    goodHoras: [4, 0, 3],
    // Same hard vetoes as contract: Bharani (ending), Mula (uprooting)
    // — opposite of entering a stable new role.
    hardAvoidNakshatras: [2, 19],
    // 10 Karma, 4 Home (figurative new "home"), 2 Wealth.
    relevantHouses: [10, 4, 2],
  },

  // ═══════════════════════════════════════════════════════════════════
  // RESIGNATION (Tyāga-saṅkalpa — letting go, conclusion)
  //
  // Inverted from "beginning" activities. Rikta tithis are CLASSICALLY
  // SUITABLE for ending things (BR Muhurtha Ch. 13 — endings). Bharani
  // (Yama/ending) and Mula (uprooting) become favourable here, not vetoes.
  // Saturday (Saturn — completion) is allowed in goodWeekdays for the
  // first time among career activities. ═══════════════════════════════
  resignation: {
    id: 'resignation',
    label: {
      en: 'Resignation',
      hi: 'त्यागपत्र',
      sa: 'त्यागसङ्कल्पः',
    },
    // Rikta (4, 9, 14) ACCEPTABLE for endings. Krishna-paksha 8 also.
    goodTithis: [4, 8, 9, 14],
    // Ending-friendly: Bharani(2)=Yama/ending, Ardra(6)=destruction,
    // Ashlesha(9)=release/shed, Jyeshtha(18)=eldership conclusion,
    // Mula(19)=uprooting. Hasta(13) for graceful handover.
    goodNakshatras: [2, 6, 9, 13, 18, 19],
    // Tuesday (Mars — separation), Saturday (Saturn — completion).
    // Both classically suited to "cutting" an attachment.
    goodWeekdays: [2, 6],
    // Auspicious "new beginning" tithis are WRONG for resignation —
    // Pratipada(1), Panchami(5), Dashami(10), Ekadashi(11), Purnima(15).
    avoidTithis: [1, 5, 10, 11, 15],
    // Growth/auspicious nakshatras are wrong for endings.
    avoidNakshatras: [4, 8, 12, 17, 21, 27],
    // Saturn (completion) and Mars (separation). Mercury for the
    // resignation letter itself.
    goodHoras: [6, 2, 3],
    hardAvoidNakshatras: [],
    // 12 Loss / release, 8 Transformation, 6 Service (the role being left).
    relevantHouses: [12, 8, 6],
  },

  // ═══════════════════════════════════════════════════════════════════
  // BUSINESS LAUNCH (Vyāpāra ārambha — already in classical literature)
  // ═══════════════════════════════════════════════════════════════════
  business_launch: {
    id: 'business_launch',
    label: {
      en: 'Business Launch',
      hi: 'व्यापार आरम्भ',
      sa: 'व्यापार-आरम्भः',
    },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Broad auspicious set — business needs every favourable factor.
    // Includes Punarvasu(7), Chitra(14), Swati(15), Dhanishtha(23) on
    // top of the standard career-friendly set. BS 105 confirms.
    goodNakshatras: [4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 26, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 9, 14, 30],
    avoidNakshatras: [1, 2, 6, 9, 11, 18, 19, 25],
    // Jupiter (expansion) leads; Mercury (commerce); Venus (clients).
    goodHoras: [4, 3, 5],
    // Same as contract — Bharani and Mula are hard vetoes for any
    // new venture (death/uprooting at launch is disastrous).
    hardAvoidNakshatras: [2, 19],
    // 10 Karma, 2 Wealth, 11 Gains, 7 Partnerships (clients).
    relevantHouses: [10, 2, 11, 7],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ASKING FOR PROMOTION (Adhikāra-vṛddhi — elevation in office)
  // ═══════════════════════════════════════════════════════════════════
  asking_promotion: {
    id: 'asking_promotion',
    label: {
      en: 'Asking for Promotion',
      hi: 'पदोन्नति अनुरोध',
      sa: 'अधिकार-वृद्धिः',
    },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Magha(10) ADDED here (vs other career activities) — Magha represents
    // throne, lineage, elevated position. BR Muhurtha Ch. 13 specifically
    // favours Magha for matters of rank.
    goodNakshatras: [4, 8, 10, 12, 13, 17, 21, 22, 26],
    // Sun (authority day) leads, plus Wed (communication) and Thu (Jupiter
    // — expansion of role).
    goodWeekdays: [0, 3, 4],
    avoidTithis: [4, 9, 14, 30],
    avoidNakshatras: [1, 2, 6, 9, 11, 18, 19, 20, 25],
    // Sun (authority) and Jupiter (expansion of position).
    goodHoras: [0, 4, 3],
    hardAvoidNakshatras: [],
    // 10 Karma, 11 Gains (the raise), 1 Self (the elevation).
    relevantHouses: [10, 11, 1],
  },

};
