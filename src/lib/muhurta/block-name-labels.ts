/**
 * 9-locale labels for the 22 BLOCK_DEFINITIONS entries in
 * verdict-config.ts plus 3 dynamic "{ACTIVITY} unsuitable for X"
 * templates from verdict-engine.ts.
 *
 * EN/HI are authored inline (matches verdict-config.ts and the
 * verdict-engine template literals); 7 remaining locales come from
 * the Gemini overlay. Read via
 * `tlScript(BLOCK_NAME_LABELS[blockId], locale)`.
 *
 * The activity-template helper `formatActivityBlockName(template, activity, locale)`
 * substitutes `{ACTIVITY}` with `activity.label[locale]` after looking up
 * the localised template — keeps the verdict-engine site simple.
 */
import type { LocaleText } from '@/types/panchang';
import BLOCK_OVERLAY from '@/lib/constants/verdict-block-names-overlay.json';
import TEMPLATE_OVERLAY from '@/lib/constants/verdict-activity-templates-overlay.json';

type OverlayShape = Partial<Record<string, Record<string, string>>>;
const blockOverlay = BLOCK_OVERLAY as OverlayShape;
const templateOverlay = TEMPLATE_OVERLAY as OverlayShape;

const AUTHORED_BLOCKS: Record<string, { en: string; hi: string }> = {
  vishti:                  { en: 'Vishti (Bhadra)',                 hi: 'विष्टि (भद्रा)' },
  vyatipata:               { en: 'Vyatipata Yoga',                  hi: 'व्यतीपात योग' },
  vaidhriti:               { en: 'Vaidhriti Yoga',                  hi: 'वैधृति योग' },
  rahu_kaal:               { en: 'Rahu Kaal',                       hi: 'राहु काल' },
  yamaganda:               { en: 'Yamaganda',                       hi: 'यमगंड' },
  gulika_kaal:             { en: 'Gulika Kaal',                     hi: 'गुलिक काल' },
  varjyam:                 { en: 'Varjyam',                         hi: 'वर्ज्यम्' },
  durmuhurta:              { en: 'Durmuhurta',                      hi: 'दुर्मुहूर्त' },
  visha_ghatika:           { en: 'Visha Ghatika',                   hi: 'विष घटिका' },
  activity_nakshatra_hard: { en: 'Nakshatra vetoed for activity',   hi: 'गतिविधि हेतु नक्षत्र वर्जित' },
  activity_nakshatra:      { en: 'Nakshatra unsuitable for activity', hi: 'गतिविधि हेतु नक्षत्र अनुपयुक्त' },
  activity_tithi:          { en: 'Tithi unsuitable for activity',   hi: 'गतिविधि हेतु तिथि अनुपयुक्त' },
  guru_pushya:             { en: 'Guru Pushya Yoga',                hi: 'गुरु पुष्य योग' },
  ravi_pushya:             { en: 'Ravi Pushya Yoga',                hi: 'रवि पुष्य योग' },
  amrit_siddhi:            { en: 'Amrit Siddhi Yoga',               hi: 'अमृत सिद्धि योग' },
  abhijit:                 { en: 'Abhijit Muhurta',                 hi: 'अभिजित मुहूर्त' },
  sarvartha_siddhi:        { en: 'Sarvartha Siddhi Yoga',           hi: 'सर्वार्थ सिद्धि योग' },
  amrit_kalam:             { en: 'Amrit Kalam',                     hi: 'अमृत काल' },
  brahma_muhurta:          { en: 'Brahma Muhurta',                  hi: 'ब्रह्म मुहूर्त' },
  siddha_yoga:             { en: 'Siddha Yoga',                     hi: 'सिद्ध योग' },
  vijaya_muhurta:          { en: 'Vijaya Muhurta',                  hi: 'विजय मुहूर्त' },
  godhuli:                 { en: 'Godhuli Lagna',                   hi: 'गोधूलि लग्न' },
};

const AUTHORED_TEMPLATES: Record<string, { en: string; hi: string }> = {
  activity_nakshatra_hard_template: { en: 'Nakshatra vetoed for {ACTIVITY}', hi: '{ACTIVITY} हेतु नक्षत्र वर्जित' },
  activity_nakshatra_template:      { en: 'Nakshatra unsuitable for {ACTIVITY}', hi: '{ACTIVITY} हेतु नक्षत्र अनुपयुक्त' },
  activity_tithi_template:          { en: 'Tithi unsuitable for {ACTIVITY}', hi: '{ACTIVITY} हेतु तिथि अनुपयुक्त' },
};

function mergeOverlay(
  authored: Record<string, { en: string; hi: string }>,
  overlay: OverlayShape,
): Record<string, LocaleText> {
  const result: Record<string, LocaleText> = {};
  for (const [key, { en, hi }] of Object.entries(authored)) {
    const out: LocaleText = { en, hi };
    for (const locale of ['mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {
      const v = overlay[locale]?.[key];
      if (v) out[locale] = v;
    }
    result[key] = out;
  }
  return result;
}

export const BLOCK_NAME_LABELS: Record<string, LocaleText> = mergeOverlay(AUTHORED_BLOCKS, blockOverlay);
export const ACTIVITY_TEMPLATE_LABELS: Record<string, LocaleText> = mergeOverlay(AUTHORED_TEMPLATES, templateOverlay);

/**
 * Substitute `{ACTIVITY}` in the localised template with the activity
 * label in the same locale. Falls back through Devanagari script family
 * via tlScript on both the template and the activity label.
 */
import { tlScript } from '@/lib/utils/trilingual';
export function formatActivityBlockName(
  templateKey: keyof typeof ACTIVITY_TEMPLATE_LABELS,
  activityLabel: LocaleText,
  locale: string,
): LocaleText {
  const tmpl = ACTIVITY_TEMPLATE_LABELS[templateKey];
  const out: LocaleText = { en: tmpl.en.replace('{ACTIVITY}', activityLabel.en) };
  for (const loc of ['hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {
    const t = tmpl[loc];
    const a = activityLabel[loc] ?? tlScript(activityLabel, loc);
    if (t) out[loc] = t.replace('{ACTIVITY}', a);
  }
  // tlScript caller will look up by locale or fall back through script family
  return out;
}
