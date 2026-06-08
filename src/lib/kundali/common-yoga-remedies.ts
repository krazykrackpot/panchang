/**
 * Common yoga / dosha remedies surfaced on the InterpretationHelpers
 * "Common Yoga Remedies" block.
 *
 * EN/HI authored inline; remaining 7 locales from Gemini overlay JSON.
 * Yoga `name` is a Sanskrit-derived proper noun — kept as a single
 * string (not translated).
 */
import type { LocaleText } from '@/types/panchang';
import OVERLAY from '@/lib/constants/common-yoga-remedies-overlay.json';

type OverlayShape = Partial<Record<string, Record<string, string>>>;
const overlay = OVERLAY as OverlayShape;

interface AuthoredEntry {
  name: string;
  key: string; // slug — matches overlay keys "<key>_issue" / "<key>_remedy"
  issueEn: string;
  issueHi: string;
  remedyEn: string;
  remedyHi: string;
}

const AUTHORED: AuthoredEntry[] = [
  { name: 'Kemadruma',    key: 'kemadruma',    issueEn: 'Loneliness, isolation', issueHi: 'अकेलापन, एकांत',
    remedyEn: 'Strengthen Moon  –  pearl, Monday fasting', remedyHi: 'चन्द्र बलवान करें  –  मोती, सोमवार व्रत' },
  { name: 'Mangal Dosha', key: 'mangal_dosha', issueEn: 'Marital conflict', issueHi: 'वैवाहिक विवाद',
    remedyEn: 'Mars remedies  –  red coral, Hanuman worship', remedyHi: 'मंगल उपाय  –  मूंगा, हनुमान पूजा' },
  { name: 'Kala Sarpa',   key: 'kala_sarpa',   issueEn: 'Career blocks', issueHi: 'करियर में बाधा',
    remedyEn: 'Rahu-Ketu remedies  –  Nag puja, Saturday charity', remedyHi: 'राहु-केतु उपाय  –  नाग पूजा, शनिवार दान' },
  { name: 'Guru Chandal', key: 'guru_chandal', issueEn: 'Poor judgment', issueHi: 'खराब निर्णय',
    remedyEn: 'Jupiter remedies  –  yellow sapphire, Thursday puja', remedyHi: 'गुरु उपाय  –  पुखराज, गुरुवार पूजा' },
  { name: 'Daridra',      key: 'daridra',      issueEn: 'Financial struggle', issueHi: 'आर्थिक कठिनाई',
    remedyEn: '2nd/11th lord remedies, charity on Saturdays', remedyHi: '२/११ भावेश उपाय, शनिवार दान' },
];

function build(a: AuthoredEntry, axis: 'issue' | 'remedy'): LocaleText {
  const en = axis === 'issue' ? a.issueEn : a.remedyEn;
  const hi = axis === 'issue' ? a.issueHi : a.remedyHi;
  const key = `${a.key}_${axis}`;
  const out: LocaleText = { en, hi };
  for (const locale of ['mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {
    const v = overlay[locale]?.[key];
    if (v) out[locale] = v;
  }
  return out;
}

export interface YogaRemedyEntry {
  name: string;
  issue: LocaleText;
  remedy: LocaleText;
}

export const COMMON_YOGA_REMEDIES: YogaRemedyEntry[] = AUTHORED.map(a => ({
  name: a.name,
  issue: build(a, 'issue'),
  remedy: build(a, 'remedy'),
}));
