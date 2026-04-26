'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ChevronDown, CheckCircle, AlertTriangle, XCircle,
  BookOpen, ArrowRight, Eye, Moon, Sun, Flame, Zap, Target,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { isIndicLocale } from '@/lib/utils/locale-fonts';

// ─── Types ──────────────────────────────────────────────────────────────────

interface CancellationRule {
  code: string;
  rule: string;
  description: string;
}

interface DoshaSection {
  id: string;
  name: string;
  sanskrit: string;
  hindi: string;
  severity: 'high' | 'medium';
  icon: typeof Shield;
  color: string;
  borderColor: string;
  planets: string;
  formation: string;
  detectionMethod: string[];
  workedExample: string;
  severityLevels: { level: string; color: string; description: string }[];
  cancellations: CancellationRule[];
  effects: string[];
  remedies: string[];
  classicalRefs: string[];
  misconceptions?: string[];
  subtypes?: { name: string; description: string }[];
}

// ─── Dosha Data ─────────────────────────────────────────────────────────────

const DOSHAS: DoshaSection[] = [
  {
    id: 'mangal',
    name: 'Mangal Dosha (Kuja Dosha)',
    sanskrit: 'मङ्गलदोषः (कुजदोषः)',
    hindi: 'मंगल दोष (कुज दोष)',
    severity: 'high',
    icon: Flame,
    color: 'text-red-400',
    borderColor: 'border-red-500/20',
    planets: 'Mars (Mangal)',
    formation: 'Mars placed in houses 1, 2, 4, 7, 8, or 12 from Lagna (ascendant), Moon, or Venus. The dosha is checked from all three reference points independently. If Mars triggers the dosha from all three, it is considered most severe (triple Manglik). From Lagna alone is the mildest form.',
    detectionMethod: [
      'Step 1: Note Mars\'s rashi (sign) position in the birth chart.',
      'Step 2: Calculate Mars\'s house from Lagna: house = ((Mars sign - Lagna sign + 12) % 12) + 1.',
      'Step 3: Check if this house is in the set {1, 2, 4, 7, 8, 12}. If yes, Mangal Dosha from Lagna.',
      'Step 4: Repeat from Moon sign and Venus sign.',
      'Step 5: Count how many reference points trigger it (scope severity).',
      'Step 6: Determine house severity: 7th/8th = severe, 1st/4th = moderate, 2nd/12th = mild.',
      'Step 7: Check all cancellation conditions before concluding.',
    ],
    workedExample: 'Birth chart: Lagna in Aries (1), Mars in Scorpio (8). House from Lagna = ((8 - 1 + 12) % 12) + 1 = 8. House 8 is in the Mangal set, so Dosha is present from Lagna. House 8 = severe house severity. But Mars is in its own sign (Scorpio) — cancellation C1 applies. Effective severity drops from severe to moderate. If Moon is in Leo (5), house from Moon = ((8 - 5 + 12) % 12) + 1 = 4, also in the set. Dosha from Moon too — scope severity = moderate (2 references). After C1 cancellation, effective severity = mild.',
    severityLevels: [
      { level: 'Full (Purna)', color: 'text-red-400', description: 'Mars in 7th or 8th house from all three references (Lagna, Moon, Venus). No cancellation conditions apply. Most severe — marriage delay is significant.' },
      { level: 'Partial (Anshik)', color: 'text-amber-400', description: 'Mars triggers from 1-2 references only, or is in milder houses (2nd, 12th). Some cancellation conditions partially reduce severity.' },
      { level: 'Cancelled (Bhanga)', color: 'text-emerald-400', description: 'One or more cancellation conditions fully neutralize the dosha. Marriage can proceed normally.' },
    ],
    cancellations: [
      { code: 'C1', rule: 'Mars in own sign', description: 'Mars in Aries (1) or Scorpio (8) — the aggressive energy is channelled constructively through dignity. Mars is "at home" and behaves well.' },
      { code: 'C2', rule: 'Mars exalted', description: 'Mars in Capricorn (10) — exaltation gives Mars disciplined, constructive expression. Its malefic nature is significantly reduced.' },
      { code: 'C3', rule: 'Jupiter aspects Mars', description: 'Jupiter\'s 5th, 7th, or 9th aspect falls on Mars. Jupiter\'s wisdom tempers Mars\'s aggression. Also applies if Jupiter is conjunct Mars.' },
      { code: 'C4', rule: 'Venus in 7th house', description: 'Venus (karaka for marriage) in the 7th house provides natural marital harmony that counteracts Mars\'s disruption.' },
      { code: 'C5', rule: 'Benefic conjunction', description: 'Mars conjunct Jupiter or Venus in the same house — the benefic planet softens Mars\'s energy.' },
      { code: 'C6', rule: 'Mars in Mercury sign in 2nd', description: 'Mars in Gemini (3) or Virgo (6) AND in 2nd house. Mercury\'s intellectual influence neutralizes Mars\'s aggression in the house of family/speech.' },
      { code: 'C7', rule: 'Both partners Manglik', description: 'If both bride and groom have Mangal Dosha, the energies balance out — mutual cancellation. This is the most commonly applied cancellation in match-making.' },
      { code: 'C8', rule: 'Age 28+', description: 'Mars matures at age 28 (its maturation age in Vedic astrology). Post-28, Mangal Dosha effects reduce significantly. Many astrologers consider it largely neutralized after 28.' },
    ],
    effects: [
      'Delays or obstacles in marriage — difficulty finding a compatible partner.',
      'Aggressive temperament leading to marital conflicts.',
      'Mars in 7th: direct conflict with spouse, domineering partner dynamics.',
      'Mars in 8th: sudden health events or accidents affecting spouse, inheritance disputes.',
      'Mars in 1st: self-assertion overpowers relationships, ego clashes.',
      'Mars in 2nd: harsh speech damaging family harmony.',
      'Mars in 4th: domestic disturbance, property disputes, mother\'s health.',
      'Mars in 12th: bedroom disharmony, expenditure on disputes.',
    ],
    remedies: [
      'Kumbh Vivah — symbolic marriage to a banana tree, Vishnu idol, or clay pot before the actual marriage (the most traditional remedy).',
      'Mangal Shanti Puja — fire ritual to appease Mars, typically performed on Tuesdays.',
      'Red Coral (Moonga) — worn on the ring finger in gold/copper, ONLY after confirming Mars is a functional benefic in the chart. Gemstones amplify — they do not pacify.',
      'Hanuman Chalisa recitation on Tuesdays — Hanuman is the deity of Mars.',
      'Donate red lentils (masoor dal), red cloth, copper vessels on Tuesdays.',
      'Fasting on Tuesdays (Mangalvar Vrat).',
      'For couples: Mangal matching — if both are Manglik, the dosha is mutually cancelled.',
    ],
    classicalRefs: [
      'Brihat Parashara Hora Shastra (BPHS), Chapter 35 — primary source for Mangal Dosha rules.',
      'Phaladeepika by Mantreshwara, Chapter 7 — marriage doshas.',
      'Saravali by Kalyana Varma — supplementary rules on Mars placement.',
    ],
  },
  {
    id: 'kaal_sarpa',
    name: 'Kaal Sarpa Dosha',
    sanskrit: 'कालसर्पदोषः',
    hindi: 'काल सर्प दोष',
    severity: 'high',
    icon: Zap,
    color: 'text-violet-400',
    borderColor: 'border-violet-500/20',
    planets: 'All planets hemmed by Rahu-Ketu axis',
    formation: 'All seven visible planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are positioned on one side of the Rahu-Ketu axis. Rahu and Ketu always occupy exactly opposite signs (180 degrees apart), forming a dividing line through the chart. When every planet falls between Rahu and Ketu going in one direction, the "serpent" swallows all planetary energies.',
    detectionMethod: [
      'Step 1: Identify Rahu and Ketu positions (always 180 degrees apart).',
      'Step 2: Moving from Rahu to Ketu in zodiacal order (counterclockwise), check if ALL 7 planets fall within this arc.',
      'Step 3: If all 7 are within the arc, it is a full Kaal Sarpa Dosha.',
      'Step 4: If any planet is exactly conjunct Rahu or Ketu (within 1 degree), some authorities say it "breaks" the hemming.',
      'Step 5: If one planet is outside the arc, it is Partial Kaal Sarpa (less severe).',
      'Step 6: Identify the type based on Rahu\'s house position (see 12 types below).',
    ],
    workedExample: 'Rahu in Aries (house 1), Ketu in Libra (house 7). Sun in Taurus (2), Moon in Gemini (3), Mars in Cancer (4), Mercury in Taurus (2), Jupiter in Gemini (3), Venus in Aries (1, conjunct Rahu), Saturn in Taurus (2). All planets from houses 1-6 — all between Rahu (1) and Ketu (7). This is Ananta Kaal Sarpa (Rahu in 1st house). Venus conjunct Rahu means some authorities would call this "broken" — but most still classify it as present.',
    severityLevels: [
      { level: 'Full (Purna)', color: 'text-red-400', description: 'All 7 planets strictly between Rahu and Ketu, none conjunct either node. The serpent fully contains all planetary energies.' },
      { level: 'Partial (Anshik)', color: 'text-amber-400', description: 'One planet on the boundary (conjunct Rahu or Ketu) or barely outside the arc. Effects are present but less intense.' },
      { level: 'Cancelled', color: 'text-emerald-400', description: 'One or more planets clearly outside the Rahu-Ketu arc. Not a true Kaal Sarpa despite superficial resemblance.' },
    ],
    cancellations: [
      { code: 'K1', rule: 'Planet outside the axis', description: 'Any planet clearly positioned outside the Rahu-Ketu hemming arc (not conjunct either node) breaks the dosha entirely.' },
      { code: 'K2', rule: 'Jupiter conjunct a node', description: 'Jupiter conjunct Rahu or Ketu provides Guru\'s protective wisdom that counteracts the serpent\'s constriction.' },
      { code: 'K3', rule: 'Benefic aspects on nodes', description: 'Strong benefic aspects (especially Jupiter) on Rahu and Ketu reduce the dosha\'s intensity significantly.' },
      { code: 'K4', rule: 'Exalted Rahu/Ketu', description: 'Rahu exalted in Taurus or Ketu exalted in Scorpio (per some authorities) reduces malefic intensity of the axis.' },
    ],
    effects: [
      'Cyclical pattern of build-up and collapse — success followed by sudden reversal.',
      'Mental anxiety and restlessness, feeling of being "trapped" by circumstances.',
      'Career sees repeated near-successes followed by setbacks.',
      'Relationship difficulties, especially trust issues.',
      'Financial instability despite capability.',
      'Specific effects depend on the type (Rahu\'s house position determines the primary life area affected).',
    ],
    remedies: [
      'Kaal Sarpa Dosha puja — traditionally performed at Trimbakeshwar (Maharashtra) or Kukke Subrahmanya (Karnataka).',
      'Rahu-Ketu Shanti Homam — fire ritual specifically for the nodes.',
      'Naga Puja — worship of serpent deities (Naga Devata).',
      'Maha Mrityunjaya Japa — 125,000 repetitions of the Mrityunjaya mantra.',
      'Silver Naga idol worship — especially on Nag Panchami.',
      'Donate black sesame, mustard oil, and blue/black cloth on Saturdays.',
      'Visit Kalahasti (Andhra Pradesh) for Rahu-Ketu dosha puja.',
    ],
    classicalRefs: [
      'Manasagari — one of the earliest references to this yoga (as Kala Sarpa Yoga, not Dosha).',
      'Hora Sara by Prithuyashas.',
      'Note: Kaal Sarpa is NOT mentioned in BPHS or Phaladeepika. Its classical authority is debated. Many modern astrologers consider it an important yoga nonetheless.',
    ],
    subtypes: [
      { name: '1. Ananta (Rahu in 1st)', description: 'Affects personality and self-image. Life feels like a constant struggle for identity.' },
      { name: '2. Kulika (Rahu in 2nd)', description: 'Financial and family speech issues. Wealth fluctuates unpredictably.' },
      { name: '3. Vasuki (Rahu in 3rd)', description: 'Communication and sibling issues. Courage alternates with cowardice.' },
      { name: '4. Shankhapala (Rahu in 4th)', description: 'Domestic disturbance, property issues, maternal problems.' },
      { name: '5. Padma (Rahu in 5th)', description: 'Children and creative blocks. Education faces unexpected hurdles.' },
      { name: '6. Maha Padma (Rahu in 6th)', description: 'Legal battles and health issues. Enemies create persistent trouble.' },
      { name: '7. Takshaka (Rahu in 7th)', description: 'Marriage and partnership difficulties. Most directly affects relationships.' },
      { name: '8. Karkotaka (Rahu in 8th)', description: 'Sudden events, occult experiences, transformation through crisis.' },
      { name: '9. Shankhachuda (Rahu in 9th)', description: 'Dharma and father issues. Fortune comes through unconventional means.' },
      { name: '10. Ghataka (Rahu in 10th)', description: 'Career obstacles and authority conflicts. Professional life is the battleground.' },
      { name: '11. Vishdhara (Rahu in 11th)', description: 'Gains and social circle disrupted. Friends become unreliable.' },
      { name: '12. Sheshanaga (Rahu in 12th)', description: 'Spiritual confusion, foreign land issues, sleep disturbance, expenditure.' },
    ],
    misconceptions: [
      '"Kaal Sarpa Dosha ruins your life" — False. Many highly successful people have this yoga. Nehru, Sachin Tendulkar, and Dhirubhai Ambani all had variants of it. It creates intensity, not guaranteed suffering.',
      '"It is mentioned in BPHS" — Incorrect. The concept doesn\'t appear in Parashara\'s works. It gained prominence in the 20th century, though some argue it existed under different names.',
      '"It can never be remedied" — False. Like all doshas, it has specific remedial measures and cancellation conditions. Its effects also diminish during favorable dasha periods.',
      '"Partial Kaal Sarpa is just as bad" — Incorrect. A single planet outside the arc significantly changes the dynamic. Partial KSD is considerably milder.',
    ],
  },
  {
    id: 'pitra',
    name: 'Pitra Dosha',
    sanskrit: 'पितृदोषः',
    hindi: 'पित्र दोष',
    severity: 'medium',
    icon: Sun,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/20',
    planets: 'Sun + Rahu/Saturn (9th house affliction)',
    formation: 'The primary formation is Sun conjunct Rahu or Ketu, especially in the 1st, 5th, or 9th house. Secondary formations include: 9th lord placed in 6th, 8th, or 12th house (dusthana); malefics (Saturn, Mars, Rahu, Ketu) in the 9th house without benefic aspects; Saturn aspecting the 9th house with no Jupiter protection. The 9th house is the seat of Dharma, father, and ancestral merit (Punya). Its affliction signals unresolved ancestral karma.',
    detectionMethod: [
      'Step 1: Check if Sun is conjunct Rahu or Ketu in the chart (same sign, ideally within 15 degrees).',
      'Step 2: Note the house of this conjunction — 1st, 5th, or 9th makes it strongest.',
      'Step 3: Check the 9th house: is its lord in a dusthana (6/8/12)?',
      'Step 4: Are malefics (Saturn, Mars, Rahu, Ketu) placed in the 9th house?',
      'Step 5: Is there any benefic influence (Jupiter aspect, Venus conjunction) on the 9th?',
      'Step 6: If multiple conditions are met, Pitra Dosha is confirmed.',
    ],
    workedExample: 'Chart: Sun in Leo (5th house) conjunct Rahu. 9th lord (Jupiter, for Aries Lagna) is placed in the 6th house (Virgo). Saturn aspects the 9th house from the 11th. No Jupiter aspect on the 9th. Three conditions met: (1) Sun-Rahu conjunction, (2) 9th lord in dusthana, (3) Saturn\'s aspect on 9th. This is a confirmed Pitra Dosha. However, if Jupiter were aspecting the 9th from the 1st or 5th house, condition (3) would be mitigated.',
    severityLevels: [
      { level: 'Severe', color: 'text-red-400', description: 'Sun-Rahu conjunction in the 9th house with 9th lord in dusthana and no benefic protection. Father\'s life significantly affected.' },
      { level: 'Moderate', color: 'text-amber-400', description: 'Sun-Rahu conjunction in other houses, or 9th house afflicted by only one malefic. Some ancestral karma issues.' },
      { level: 'Mild / Cancelled', color: 'text-emerald-400', description: 'Jupiter aspects the 9th house or Sun is strong (exalted/own sign). Ancestral karma is being resolved naturally.' },
    ],
    cancellations: [
      { code: 'P1', rule: 'Jupiter aspects 9th house', description: 'Jupiter\'s protective gaze on the house of Dharma neutralizes much of the ancestral affliction.' },
      { code: 'P2', rule: 'Sun in exaltation or own sign', description: 'Sun in Aries (exalted) or Leo (own sign) — a strong Sun can withstand Rahu\'s influence.' },
      { code: 'P3', rule: 'Strong benefics in 9th', description: 'Jupiter or Venus placed in the 9th house counteract malefic energies with their own benefic nature.' },
      { code: 'P4', rule: '9th lord in Kendra/Trikona', description: 'If the 9th lord is strong in a kendra (1,4,7,10) or trikona (1,5,9), the damage is significantly reduced.' },
      { code: 'P5', rule: 'Regular Shraddha/Tarpana', description: 'Consistent ancestral rites (not a chart condition but a remedy that functions as preventive cancellation).' },
    ],
    effects: [
      'Obstacles from father figures and authority — father may be absent, distant, or a source of difficulty.',
      'Difficulty with government and bureaucratic matters — applications rejected, red tape multiplied.',
      'Childlessness or children facing unusual challenges.',
      'Unexplained family health patterns repeating across generations.',
      'Career blocks despite qualifications — a persistent sense of being "held back."',
      'Financial setbacks that seem to come from ancestral patterns rather than personal decisions.',
    ],
    remedies: [
      'Pitra Tarpan on every Amavasya — especially Sarva Pitri Amavasya (Ashwin month).',
      'Narayan Nagbali at Trimbakeshwar — elaborate 3-day ritual for ancestral debt.',
      'Pind Daan at Gaya — offering rice balls for departed ancestors.',
      'Feed Brahmins on father\'s death anniversary (Shraddha tithi).',
      'Vishnu Sahasranama daily recitation — Lord Vishnu governs ancestral blessings.',
      'Donate food, clothes, and medicines to the elderly on Sundays.',
    ],
    classicalRefs: [
      'BPHS Chapter 35 — afflictions to the 9th house and ancestral karma.',
      'Lal Kitab — extensive coverage of Pitra Dosha with practical remedies.',
      'Garuda Purana — Shraddha and Tarpana procedures for ancestral debt.',
    ],
  },
  {
    id: 'kemdrum',
    name: 'Kemadruma Dosha',
    sanskrit: 'केमद्रुमदोषः',
    hindi: 'केमद्रुम दोष',
    severity: 'medium',
    icon: Moon,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    planets: 'Moon (isolated)',
    formation: 'No planet (excluding Sun, Rahu, Ketu) occupies the 2nd or 12th house from the Moon. The Moon is left without "companions" — no planet flanking it on either side. Some authorities apply a stricter definition: no planet in any kendra (1, 4, 7, 10) from Moon either. The core idea is that Moon needs planetary support for emotional and material stability; without it, the native struggles.',
    detectionMethod: [
      'Step 1: Identify Moon\'s sign/house in the chart.',
      'Step 2: Check the sign immediately before Moon (12th from Moon) — is any planet there? (Exclude Sun, Rahu, Ketu.)',
      'Step 3: Check the sign immediately after Moon (2nd from Moon) — same exclusion.',
      'Step 4: If both are empty (of Mars, Mercury, Jupiter, Venus, Saturn), Kemadruma is present.',
      'Step 5: Apply the cancellation conditions — this dosha is very commonly cancelled.',
    ],
    workedExample: 'Moon in Virgo (6). 12th from Moon = Leo (5) — Sun is there, but Sun is excluded. 2nd from Moon = Libra (7) — empty. Neither house has Mars/Mercury/Jupiter/Venus/Saturn. Basic Kemadruma is present. But check: is any planet in a kendra from Moon? Jupiter in Sagittarius (4th from Moon\'s Virgo) — cancellation applies! This is NOT a true Kemadruma despite the initial detection. Always check cancellations.',
    severityLevels: [
      { level: 'Full', color: 'text-red-400', description: 'Moon completely isolated — no planets in 2nd/12th AND no planets in kendras from Moon AND Moon is waning. Extremely rare in practice.' },
      { level: 'Partial', color: 'text-amber-400', description: 'Basic condition met (empty 2nd/12th) but some kendra support exists. Effects are mild and manageable.' },
      { level: 'Cancelled', color: 'text-emerald-400', description: 'Any of the multiple cancellation conditions apply. This is the most commonly cancelled dosha — ~25% of charts trigger basic detection, but very few survive cancellation checks.' },
    ],
    cancellations: [
      { code: 'KD1', rule: 'Planet in kendra from Moon', description: 'Any planet (Mars, Mercury, Jupiter, Venus, Saturn) in houses 1, 4, 7, or 10 from Moon. This is the most common cancellation.' },
      { code: 'KD2', rule: 'Moon in kendra from Lagna', description: 'Moon itself in the 1st, 4th, 7th, or 10th house from the ascendant provides angular strength.' },
      { code: 'KD3', rule: 'Full Moon (Purnima)', description: 'A full or near-full Moon (born near Purnima tithi) has inherent luminous strength that overrides isolation.' },
      { code: 'KD4', rule: 'Moon in own or exalted sign', description: 'Moon in Cancer (own sign) or Taurus (exaltation) is dignified enough to handle isolation.' },
      { code: 'KD5', rule: 'Jupiter aspects Moon', description: 'Jupiter\'s benefic aspect on Moon provides wisdom and emotional stability even without flanking planets.' },
      { code: 'KD6', rule: 'Moon conjunct a benefic', description: 'If Moon is conjunct Jupiter, Venus, or well-placed Mercury, isolation is broken by direct contact.' },
    ],
    effects: [
      'Emotional isolation — feeling unsupported even among people.',
      'Financial hardship despite honest effort — poverty tendency.',
      'Lack of genuine support systems — fair-weather friends.',
      'Mental distress, anxiety, and difficulty maintaining inner peace.',
      'Social invisibility — achievements go unrecognized.',
      'Important caveat: pure Kemadruma (surviving all cancellation checks) is quite rare. Most detected cases are cancelled.',
    ],
    remedies: [
      'Worship Lord Shiva on Mondays — Shiva is the lord of the Moon.',
      'Pearl (Moti) wearing — on the little finger in silver, on a Monday during Shukla Paksha. Only if Moon is a functional benefic.',
      'Chandra Graha Shanti puja — specific lunar pacification ritual.',
      'Donate white items on Mondays: rice, milk, white cloth, silver.',
      'Som Pradosh Vrat — fasting on Monday Trayodashi.',
      'Chandra Beej Mantra japa: "Om Shraam Shreem Shraum Sah Chandramase Namah" — 10,000 repetitions.',
    ],
    classicalRefs: [
      'Phaladeepika by Mantreshwara, Chapter 6, Verse 8 — primary source.',
      'Brihat Jataka by Varahamihira — Moon\'s strength and weakness.',
      'Saravali — supplementary rules on Moon isolation.',
    ],
    misconceptions: [
      '"Kemadruma makes you poor for life" — False. It indicates a tendency toward scarcity, but strong dashas, transits, and personal effort can completely override it. Many successful people have this yoga in its cancelled form.',
      '"It\'s very rare" — Actually, the basic condition (empty 2nd/12th from Moon) occurs in roughly 25% of charts. However, true uncancelled Kemadruma is indeed rare because the cancellation conditions are numerous and easy to satisfy.',
    ],
  },
  {
    id: 'guru_chandal',
    name: 'Guru Chandal Dosha',
    sanskrit: 'गुरुचाण्डालदोषः',
    hindi: 'गुरु चाण्डाल दोष',
    severity: 'medium',
    icon: Eye,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    planets: 'Jupiter + Rahu (or Ketu)',
    formation: 'Jupiter conjunct Rahu in any house. The name "Chandal" means "outcaste" — the idea is that Rahu (the shadow, the unconventional) pollutes Jupiter (the Guru, wisdom, dharma). Jupiter-Ketu conjunction is sometimes included but has different effects (more spiritual confusion than moral corruption). The dosha is strongest when the conjunction occurs in the Dharma Trikona (1st, 5th, or 9th house) because these are Jupiter\'s natural domains.',
    detectionMethod: [
      'Step 1: Check if Jupiter and Rahu are in the same sign (conjunction).',
      'Step 2: Check the orb — within 15 degrees is strongest, 15-30 degrees is moderate.',
      'Step 3: Note the house — 1st, 5th, or 9th house is most potent.',
      'Step 4: Check in Navamsa (D-9) too — Guru Chandal in Navamsa affects marriage wisdom.',
      'Step 5: Evaluate Jupiter\'s strength — is it in own sign, exalted, or debilitated?',
      'Step 6: Check if Jupiter is stronger than Rahu in Shadbala — if so, Jupiter prevails.',
    ],
    workedExample: 'Jupiter in Gemini (3rd house), Rahu in Gemini (3rd house). They are conjunct. Gemini is not a Jupiter-friendly sign (neutral territory). The 3rd house is not a Dharma Trikona, so severity is moderate rather than maximum. Check Jupiter\'s Shadbala: if Jupiter scores 380 (above the 390 minimum for sufficiency) and Rahu has less, Jupiter is holding its own. If Jupiter were in Sagittarius (own sign) conjunct Rahu, cancellation GC2 would apply and the dosha would be largely neutralized.',
    severityLevels: [
      { level: 'Severe', color: 'text-red-400', description: 'Jupiter-Rahu in 1st/5th/9th house, Jupiter debilitated (Capricorn) or weak in Shadbala, no benefic aspects.' },
      { level: 'Moderate', color: 'text-amber-400', description: 'Conjunction in other houses, Jupiter of moderate strength, some mitigating aspects.' },
      { level: 'Mild / Cancelled', color: 'text-emerald-400', description: 'Jupiter in own sign or exaltation, stronger than Rahu, or receiving benefic aspects from Moon/Venus.' },
    ],
    cancellations: [
      { code: 'GC1', rule: 'Jupiter exalted', description: 'Jupiter in Cancer (exaltation) — even with Rahu present, Jupiter\'s exalted wisdom is too strong to be corrupted.' },
      { code: 'GC2', rule: 'Jupiter in own sign', description: 'Jupiter in Sagittarius or Pisces — dignity provides natural immunity against Rahu\'s distortion.' },
      { code: 'GC3', rule: 'Jupiter stronger in Shadbala', description: 'If Jupiter\'s six-fold strength score exceeds Rahu\'s, Jupiter dominates the conjunction rather than being polluted by it.' },
      { code: 'GC4', rule: 'Benefic aspects', description: 'Moon or Venus aspecting the conjunction adds emotional/aesthetic intelligence that counterbalances Rahu\'s confusion.' },
      { code: 'GC5', rule: 'Rahu in Jupiter\'s nakshatra', description: 'Rahu in Punarvasu, Vishakha, or Purva Bhadrapada (Jupiter-ruled nakshatras) — Rahu is operating under Jupiter\'s rules, reducing its disruptive capacity.' },
    ],
    effects: [
      'Disrespect for traditions, elders, and established wisdom.',
      'Association with dubious spiritual teachers or misleading gurus.',
      'Making wrong moral choices despite knowing better — judgment in Dharma matters becomes unreliable.',
      'Educational disruptions — may drop out, change fields repeatedly, or undervalue formal learning.',
      'Children may face unusual challenges or the native struggles with conception.',
      'Silver lining: can give extraordinary unconventional wisdom, success in foreign/cutting-edge fields, and the ability to challenge established norms productively.',
    ],
    remedies: [
      'Jupiter (Guru) puja on Thursdays — Brihaspati Stotram or Guru Beej Mantra.',
      'Dakshinamurthy Stotram — invoking the true Guru principle.',
      'Vishnu puja — Lord Vishnu is Jupiter\'s presiding deity.',
      'Yellow Sapphire (Pukhraj) — only if Jupiter is a functional benefic after full chart analysis.',
      'Donate turmeric, yellow cloth, chana dal, and bananas on Thursdays.',
      'Guru Graha Shanti Homam — fire ritual for Jupiter pacification.',
    ],
    classicalRefs: [
      'BPHS Chapter 35 — Jupiter afflictions and their effects.',
      'Phaladeepika — Jupiter-Rahu combinations.',
      'Uttara Kalamrita — supplementary rules on Guru-Rahu yoga.',
    ],
  },
  {
    id: 'grahan',
    name: 'Grahan Yoga (Eclipse Dosha)',
    sanskrit: 'ग्रहणयोगः',
    hindi: 'ग्रहण दोष',
    severity: 'medium',
    icon: Target,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    planets: 'Sun/Moon + Rahu/Ketu',
    formation: 'Sun or Moon conjunct Rahu or Ketu in the birth chart. This mirrors the astronomical phenomenon of eclipses — Rahu/Ketu literally "swallow" the luminaries. Surya Grahan Dosha (Sun-Rahu/Ketu) affects father, authority, career, self-image. Chandra Grahan Dosha (Moon-Rahu/Ketu) affects mother, mind, emotions, public image. The dosha is strongest when the conjunction is tight (within 5 degrees) and in angular houses (1, 4, 7, 10).',
    detectionMethod: [
      'Step 1: Check if Sun is in the same sign as Rahu or Ketu — Surya Grahan Dosha.',
      'Step 2: Check if Moon is in the same sign as Rahu or Ketu — Chandra Grahan Dosha.',
      'Step 3: Calculate the degree difference — within 5 degrees is a tight conjunction (most severe).',
      'Step 4: Check if the conjunction was near an actual eclipse date (birth near eclipse = intensified).',
      'Step 5: Note the house — angular houses amplify the effects.',
      'Step 6: Both luminaries afflicted = double Grahan (very intense chart).',
    ],
    workedExample: 'Moon at 15 degrees Taurus, Rahu at 18 degrees Taurus — 3 degree orb, tight conjunction. This is Chandra Grahan Dosha. Moon in the 2nd house (for Aries Lagna). Effects: emotional turmoil affecting speech and family life, mother\'s health may be affected, financial ups and downs driven by emotional decisions. If Jupiter aspects from Scorpio (8th house — Jupiter\'s 7th aspect hits 2nd house), the dosha is significantly mitigated.',
    severityLevels: [
      { level: 'Severe', color: 'text-red-400', description: 'Tight conjunction (within 5 degrees), in angular houses, born near actual eclipse, no benefic aspects.' },
      { level: 'Moderate', color: 'text-amber-400', description: 'Same sign but wider orb (5-15 degrees), in non-angular houses, some benefic support.' },
      { level: 'Mild / Cancelled', color: 'text-emerald-400', description: 'Wide orb, strong luminary (own/exalted sign), Jupiter\'s aspect, or luminary in a favorable nakshatra.' },
    ],
    cancellations: [
      { code: 'G1', rule: 'Strong luminary', description: 'Sun in Leo/Aries or Moon in Cancer/Taurus — dignified luminaries can withstand Rahu/Ketu\'s shadow.' },
      { code: 'G2', rule: 'Jupiter\'s aspect', description: 'Jupiter aspecting the conjunction provides divine protection — the "Guru" light overcomes the eclipse.' },
      { code: 'G3', rule: 'Wide orb', description: 'If the luminary and node are in the same sign but more than 15 degrees apart, the "eclipse" is incomplete and effects are minimal.' },
      { code: 'G4', rule: 'Benefic conjunction', description: 'Jupiter or Venus conjunct with the luminary and node — the benefic acts as a buffer.' },
      { code: 'G5', rule: 'Node in friendly nakshatra', description: 'Rahu/Ketu in a nakshatra ruled by a benefic planet (Jupiter, Venus, Mercury) softens their nature.' },
    ],
    effects: [
      'Surya Grahan: Father absent or troubled, career authority challenged, self-confidence eclipsed by doubt, government/authority issues.',
      'Chandra Grahan: Mother\'s health affected, emotional instability, mental anxiety, public image suffers, sleep disturbance.',
      'Both: identity crisis — the native struggles to know who they truly are.',
      'Health: Surya Grahan can indicate eye/heart issues; Chandra Grahan can indicate mental health/digestive issues.',
      'Spiritual potential: paradoxically, Grahan Dosha can indicate deep spiritual capacity — the "eclipse" forces inner exploration.',
    ],
    remedies: [
      'Surya Grahan: Surya Namaskar at sunrise, Aditya Hridaya Stotram, Ruby (Manik) only if Sun is functional benefic, donate wheat and jaggery on Sundays.',
      'Chandra Grahan: Chandra Puja on Mondays, Durga Saptashati recitation, Pearl only if Moon is functional benefic, donate rice and white items on Mondays.',
      'Both: Grahan Dosha Nivaran puja, Rahu-Ketu Shanti homam, fast on eclipse days, donate to the blind/visually impaired (symbolic of the eclipsed light).',
      'Eclipse day rituals: chant mantras during eclipses, bathe in holy rivers after eclipse ends, donate food and clothing.',
    ],
    classicalRefs: [
      'BPHS — Sun-Rahu and Moon-Rahu conjunctions in natal charts.',
      'Phaladeepika — effects of luminaries with nodes.',
      'Brihat Samhita by Varahamihira — eclipse effects and remedies.',
      'Surya Siddhanta — astronomical basis for eclipse calculations.',
    ],
  },
];

// ─── Flowchart for Mangal Dosha ─────────────────────────────────────────────

const MANGAL_FLOWCHART_STEPS = [
  { label: 'Find Mars in chart', detail: 'Note Mars\'s sign (1-12)', type: 'start' as const },
  { label: 'Calculate house from Lagna', detail: '((Mars sign - Lagna sign + 12) % 12) + 1', type: 'process' as const },
  { label: 'House in {1,2,4,7,8,12}?', detail: '', type: 'decision' as const },
  { label: 'Repeat for Moon & Venus', detail: 'Same formula, different reference', type: 'process' as const },
  { label: 'Any reference triggers?', detail: '', type: 'decision' as const },
  { label: 'Check 7 cancellation rules', detail: 'C1-C8 evaluation', type: 'process' as const },
  { label: 'Determine final severity', detail: 'Full / Partial / Cancelled', type: 'end' as const },
];

// ─── House Diagram Data ─────────────────────────────────────────────────────

const HOUSE_EFFECTS: { house: number; severity: string; color: string; effect: string }[] = [
  { house: 1, severity: 'Moderate', color: 'text-amber-400', effect: 'Self-assertion, ego conflicts, aggressive personality' },
  { house: 2, severity: 'Mild', color: 'text-yellow-300', effect: 'Harsh speech, family discord, financial aggression' },
  { house: 4, severity: 'Moderate', color: 'text-amber-400', effect: 'Domestic strife, property disputes, mother\'s health' },
  { house: 7, severity: 'Severe', color: 'text-red-400', effect: 'Spouse conflict, domineering dynamics, marriage disruption' },
  { house: 8, severity: 'Severe', color: 'text-red-400', effect: 'Sudden events, spouse health, accidents, inheritance fights' },
  { house: 12, severity: 'Mild', color: 'text-yellow-300', effect: 'Bedroom disharmony, excessive expenditure, foreign lands' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function DoshasDetailedPage() {
  const locale = useLocale();
  const isHi = isIndicLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const [expandedDosha, setExpandedDosha] = useState<string | null>('mangal');
  const [expandedSections, setExpandedSections] = useState<Record<string, Set<string>>>({});

  const toggleSection = (doshaId: string, section: string) => {
    setExpandedSections((prev) => {
      const current = prev[doshaId] || new Set();
      const next = new Set(current);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return { ...prev, [doshaId]: next };
    });
  };

  const isSectionOpen = (doshaId: string, section: string) => {
    return expandedSections[doshaId]?.has(section) ?? false;
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {isHi ? 'दोष विस्तृत मार्गदर्शिका' : 'Doshas in Vedic Astrology — Comprehensive Guide'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl" style={bodyFont}>
          {isHi
            ? 'ज्योतिष के सभी प्रमुख दोषों का गहन अध्ययन — निर्माण, पहचान, गंभीरता स्तर, रद्दीकरण शर्तें, प्रभाव और उपचार। प्रत्येक दोष के लिए चरणबद्ध पहचान विधि और कार्यशील उदाहरण सहित।'
            : 'An in-depth study of every major Jyotish dosha — formation conditions, step-by-step detection, severity levels, cancellation rules, effects, remedies, and classical references. Each dosha includes worked examples and detection flowcharts.'}
        </p>
      </div>

      {/* Important context */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-violet-400/15 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-6 h-6 text-violet-400" />
          <h3 className="text-violet-300 text-lg font-bold" style={headingFont}>
            {isHi ? 'दोष = बाधा, शाप नहीं' : 'Doshas = Obstacles, Not Curses'}
          </h3>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-3" style={bodyFont}>
          {isHi
            ? 'दोष का अर्थ है "दोष" या "अपूर्णता" — यह शाप नहीं है। यह चार्ट में एक ग्रहीय तनाव बिंदु है जो विशिष्ट जीवन क्षेत्रों में चुनौतियां पैदा कर सकता है। अधिकांश लोगों के चार्ट में कम से कम एक दोष होता है — यह सामान्य है, असामान्य नहीं।'
            : '"Dosha" literally means "fault" or "imperfection" — it is not a curse. It is a point of planetary tension in a chart that can create challenges in specific life areas. Most people have at least one dosha in their chart — this is normal, not exceptional.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
          {isHi
            ? 'गंभीर रूप से: ऑनलाइन दोष कैलकुलेटर अक्सर रद्दीकरण शर्तों की जांच किए बिना दोष रिपोर्ट करते हैं, जिससे अनावश्यक भय पैदा होता है। एक उचित मूल्यांकन के लिए पूर्ण चार्ट — राशि, पहलू, युति, षड्बल और वर्ग कुंडलियों (विशेषकर नवमांश) की जांच आवश्यक है।'
            : 'Critically: online dosha calculators often report doshas without checking cancellation conditions, causing unnecessary alarm. A proper assessment requires examining the full chart — signs, aspects, conjunctions, Shadbala, and divisional charts (especially Navamsa). Never panic based on a single dosha result.'}
        </p>
      </div>

      {/* Severity legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-text-secondary">{isHi ? 'गंभीर (High)' : 'Severe'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-text-secondary">{isHi ? 'मध्यम (Medium)' : 'Moderate'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-text-secondary">{isHi ? 'रद्द / हल्का' : 'Cancelled / Mild'}</span>
        </span>
      </div>

      {/* ─── Mangal Dosha Flowchart ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-xl font-bold mb-4" style={headingFont}>
          {isHi ? 'मंगल दोष पहचान प्रवाह चार्ट' : 'Mangal Dosha Detection Flowchart'}
        </h3>
        <div className="flex flex-col items-center gap-2">
          {MANGAL_FLOWCHART_STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2 w-full max-w-md">
              <div
                className={`w-full text-center p-3 rounded-xl text-xs ${
                  step.type === 'start'
                    ? 'bg-violet-500/15 border border-violet-400/25 text-violet-300'
                    : step.type === 'decision'
                      ? 'bg-amber-500/15 border border-amber-400/25 text-amber-300 rounded-full'
                      : step.type === 'end'
                        ? 'bg-emerald-500/15 border border-emerald-400/25 text-emerald-300'
                        : 'bg-gold-primary/10 border border-gold-primary/20 text-gold-light'
                }`}
              >
                <div className="font-bold" style={headingFont}>{step.label}</div>
                {step.detail && <div className="text-text-tertiary mt-1 text-[10px]">{step.detail}</div>}
              </div>
              {i < MANGAL_FLOWCHART_STEPS.length - 1 && (
                <ArrowRight className="w-4 h-4 text-text-tertiary rotate-90" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── House Position Diagram (Mangal Dosha) ──────────────── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-gradient text-lg font-bold mb-4" style={headingFont}>
          {isHi ? 'मंगल दोष — भाव प्रभाव मानचित्र' : 'Mangal Dosha — House Effects Map'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {HOUSE_EFFECTS.map((h) => (
            <div key={h.house} className={`p-3 rounded-xl border ${
              h.severity === 'Severe' ? 'border-red-500/20 bg-red-500/5' :
              h.severity === 'Moderate' ? 'border-amber-500/20 bg-amber-500/5' :
              'border-yellow-500/20 bg-yellow-500/5'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-lg font-bold ${h.color}`} style={headingFont}>{h.house}</span>
                <span className={`text-[10px] uppercase tracking-wider ${h.color}`}>{isHi ? `भाव` : `House`}</span>
                <span className={`text-[10px] ml-auto ${h.color}`}>{h.severity}</span>
              </div>
              <p className="text-text-secondary text-[11px] leading-relaxed" style={bodyFont}>{h.effect}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Dosha Deep Dives ────────────────────────────────────── */}
      <div className="space-y-4">
        {DOSHAS.map((dosha) => {
          const Icon = dosha.icon;
          const isExpanded = expandedDosha === dosha.id;
          const sevDot = dosha.severity === 'high' ? 'bg-red-500' : 'bg-amber-500';

          return (
            <div key={dosha.id} className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border ${dosha.borderColor} rounded-2xl overflow-hidden`}>
              {/* Header */}
              <button
                onClick={() => setExpandedDosha(isExpanded ? null : dosha.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gold-primary/3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${dosha.color}`} />
                  <span className={`w-2.5 h-2.5 rounded-full ${sevDot}`} />
                  <div className="text-left">
                    <span className="text-gold-light font-bold text-sm" style={headingFont}>{dosha.name}</span>
                    {isHi && <span className="text-text-tertiary text-xs ml-2">{dosha.hindi}</span>}
                  </div>
                  <span className="text-text-tertiary text-xs hidden sm:inline">{dosha.planets}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                    className="overflow-hidden border-t border-gold-primary/10"
                  >
                    <div className="p-5 space-y-5">

                      {/* Sanskrit name */}
                      <div className="text-text-tertiary text-xs italic" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                        {dosha.sanskrit}
                      </div>

                      {/* Formation */}
                      <div>
                        <h4 className="text-gold-light text-sm font-bold mb-2 flex items-center gap-2" style={headingFont}>
                          <BookOpen className="w-4 h-4 text-gold-dark" />
                          {isHi ? 'निर्माण शर्तें' : 'Formation Conditions'}
                        </h4>
                        <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                          {dosha.formation}
                        </p>
                      </div>

                      {/* Detection Method */}
                      <CollapsibleSection
                        title={isHi ? 'चरणबद्ध पहचान विधि' : 'Step-by-Step Detection'}
                        isOpen={isSectionOpen(dosha.id, 'detection')}
                        onToggle={() => toggleSection(dosha.id, 'detection')}
                        headingFont={headingFont}
                        color="text-cyan-400"
                      >
                        <ol className="space-y-2">
                          {dosha.detectionMethod.map((step, i) => (
                            <li key={i} className="flex gap-3 text-xs text-text-secondary" style={bodyFont}>
                              <span className="text-cyan-400 font-mono font-bold shrink-0">{i + 1}.</span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CollapsibleSection>

                      {/* Worked Example */}
                      <CollapsibleSection
                        title={isHi ? 'कार्यशील उदाहरण' : 'Worked Example'}
                        isOpen={isSectionOpen(dosha.id, 'example')}
                        onToggle={() => toggleSection(dosha.id, 'example')}
                        headingFont={headingFont}
                        color="text-violet-400"
                      >
                        <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-4">
                          <p className="text-text-secondary text-xs leading-relaxed font-mono" style={bodyFont}>
                            {dosha.workedExample}
                          </p>
                        </div>
                      </CollapsibleSection>

                      {/* Severity Levels */}
                      <div>
                        <h4 className="text-gold-light text-sm font-bold mb-3" style={headingFont}>
                          {isHi ? 'गंभीरता स्तर' : 'Severity Levels'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {dosha.severityLevels.map((sl) => (
                            <div key={sl.level} className={`p-3 rounded-xl border ${
                              sl.color === 'text-red-400' ? 'border-red-500/20 bg-red-500/5' :
                              sl.color === 'text-amber-400' ? 'border-amber-500/20 bg-amber-500/5' :
                              'border-emerald-500/20 bg-emerald-500/5'
                            }`}>
                              <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${sl.color}`}>{sl.level}</div>
                              <p className="text-text-secondary text-[11px] leading-relaxed" style={bodyFont}>{sl.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cancellation Conditions */}
                      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-emerald-400 text-sm font-bold" style={headingFont}>
                            {isHi ? 'रद्दीकरण शर्तें (भंग)' : 'Cancellation Conditions (Bhanga)'}
                          </h4>
                        </div>
                        <div className="space-y-3">
                          {dosha.cancellations.map((c) => (
                            <div key={c.code} className="flex gap-3">
                              <span className="text-emerald-400 font-mono font-bold text-xs shrink-0 w-8">{c.code}</span>
                              <div>
                                <div className="text-emerald-300 text-xs font-bold">{c.rule}</div>
                                <div className="text-text-secondary text-[11px] leading-relaxed" style={bodyFont}>{c.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subtypes (for Kaal Sarpa) */}
                      {dosha.subtypes && (
                        <CollapsibleSection
                          title={isHi ? '12 प्रकार' : '12 Types'}
                          isOpen={isSectionOpen(dosha.id, 'subtypes')}
                          onToggle={() => toggleSection(dosha.id, 'subtypes')}
                          headingFont={headingFont}
                          color="text-violet-400"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {dosha.subtypes.map((st) => (
                              <div key={st.name} className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/10">
                                <div className="text-violet-300 text-xs font-bold mb-1" style={headingFont}>{st.name}</div>
                                <div className="text-text-secondary text-[11px] leading-relaxed" style={bodyFont}>{st.description}</div>
                              </div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}

                      {/* Misconceptions */}
                      {dosha.misconceptions && (
                        <CollapsibleSection
                          title={isHi ? 'आम भ्रांतियां' : 'Common Misconceptions'}
                          isOpen={isSectionOpen(dosha.id, 'misconceptions')}
                          onToggle={() => toggleSection(dosha.id, 'misconceptions')}
                          headingFont={headingFont}
                          color="text-amber-400"
                        >
                          <div className="space-y-3">
                            {dosha.misconceptions.map((m, i) => (
                              <div key={i} className="flex gap-3 items-start">
                                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{m}</p>
                              </div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}

                      {/* Effects */}
                      <div>
                        <h4 className="text-red-400 text-sm font-bold mb-2 flex items-center gap-2" style={headingFont}>
                          <AlertTriangle className="w-4 h-4" />
                          {isHi ? 'प्रभाव' : 'Effects'}
                        </h4>
                        <ul className="space-y-1.5">
                          {dosha.effects.map((e, i) => (
                            <li key={i} className="flex gap-2 text-xs text-text-secondary items-start" style={bodyFont}>
                              <span className="text-red-400/60 mt-1">--</span>
                              <span className="leading-relaxed">{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Remedies */}
                      <div className="bg-gold-primary/5 border border-gold-primary/15 rounded-xl p-4">
                        <h4 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
                          {isHi ? 'उपाय' : 'Remedies'}
                        </h4>
                        <ul className="space-y-1.5">
                          {dosha.remedies.map((r, i) => (
                            <li key={i} className="flex gap-2 text-xs text-text-secondary items-start" style={bodyFont}>
                              <span className="text-gold-primary mt-1">--</span>
                              <span className="leading-relaxed">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Classical References */}
                      <div>
                        <h4 className="text-text-tertiary text-xs uppercase tracking-wider font-bold mb-2">
                          {isHi ? 'शास्त्रीय संदर्भ' : 'Classical References'}
                        </h4>
                        <ul className="space-y-1">
                          {dosha.classicalRefs.map((ref, i) => (
                            <li key={i} className="text-text-tertiary text-[11px] flex gap-2 items-start" style={bodyFont}>
                              <BookOpen className="w-3 h-3 shrink-0 mt-0.5" />
                              <span>{ref}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ─── Important Warning ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-400/15 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-300 font-bold text-sm mb-2" style={headingFont}>
              {isHi ? 'दोष मूल्यांकन पर महत्वपूर्ण टिप्पणी' : 'Critical Note on Dosha Assessment'}
            </h4>
            <p className="text-text-secondary text-xs leading-relaxed mb-2" style={bodyFont}>
              {isHi
                ? 'कोई भी एकल दोष आपके जीवन को परिभाषित नहीं करता। ज्योतिष शास्त्र एक जटिल प्रणाली है जहां सैकड़ों कारक एक साथ काम करते हैं। एक दोष जो एक ग्रह स्थिति में गंभीर दिखता है, दूसरे ग्रह के पहलू या योग से पूरी तरह निष्प्रभावित हो सकता है।'
                : 'No single dosha defines your life. Vedic astrology is a complex system where hundreds of factors operate simultaneously. A dosha that appears severe based on one placement can be completely neutralized by another planet\'s aspect or a counteracting yoga.'}
            </p>
            <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {isHi
                ? 'दशा (ग्रह काल) भी महत्वपूर्ण हैं — एक दोष केवल तभी सक्रिय होता है जब संबंधित ग्रह की दशा चल रही हो। शेष समय यह सुप्त रहता है। किसी भी गंभीर निर्णय से पहले एक योग्य ज्योतिषी से पूर्ण कुंडली विश्लेषण कराएं।'
                : 'Dasha periods (planetary cycles) are equally important — a dosha is typically activated only during the dasha of the involved planet. The rest of the time, it lies dormant. Always consult a qualified astrologer for full chart analysis before making major life decisions based on dosha findings.'}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Related Pages ──────────────────────────────────────── */}
      <div>
        <h3 className="text-gold-gradient text-lg font-bold mb-3" style={headingFont}>
          {isHi ? 'संबंधित पाठ' : 'Related Topics'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/doshas' as const, label: isHi ? 'दोष — सामान्य अवलोकन' : 'Doshas — Overview' },
            { href: '/learn/yogas' as const, label: isHi ? 'योग — शुभ संयोग' : 'Yogas — Auspicious Combinations' },
            { href: '/learn/remedies' as const, label: isHi ? 'उपाय — ग्रह शांति' : 'Remedies — Planetary Pacification' },
            { href: '/mangal-dosha' as const, label: isHi ? 'मंगल दोष विश्लेषक' : 'Mangal Dosha Analyzer' },
            { href: '/learn/modules/13-3' as const, label: isHi ? 'पाठ 13-3: जन्म कुंडली में दोष' : 'Lesson 13-3: Doshas in Birth Chart' },
            { href: '/learn/avasthas' as const, label: isHi ? 'अवस्थाएं — ग्रह दशाएं' : 'Avasthas — Planetary States' },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {mod.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Collapsible Section Component ──────────────────────────────────────────

function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  headingFont,
  color,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  headingFont: React.CSSProperties;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gold-primary/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/3 transition-colors"
      >
        <span className={`text-xs font-bold ${color}`} style={headingFont}>{title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' as const }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
