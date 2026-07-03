'use client';

/**
 * VratRuleAndParanaCard — a compact display for any vrat/festival whose
 * date resolution depends on a Kala-Vyapti rule (Chandrodaya, Madhyahna,
 * Pradosh, Nishita, Aparahna, Arunodaya, Pratah, or the default Udaya
 * Tithi / Sunrise rule).
 *
 * Renders:
 *   1. A rule badge naming the classical rule (e.g. "Chandrodaya Rule
 *      · Moonrise-vyapini")
 *   2. A one-line explanation of what that rule means for the observance
 *   3. The computed window on the observance day (start–end times) —
 *      only shown when the festival generator emitted paranaStart/End.
 *
 * Fills the gap surfaced 2026-07-03 where /puja/sankashti-chaturthi
 * showed only generic Chaturthi info without the moonrise time (which
 * is when the fast is actually broken). The generator has been emitting
 * paranaStart/End for Sankashti / Karva Chauth / Pradosham / Somvati
 * Amavasya / Satyanarayan Purnima for a while — this card surfaces it.
 */

import { Moon, Sun, Sunrise, Sunset, Clock, MapPin } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';

export type MuhurtaRuleName =
  | 'sunrise'
  | 'pratah'
  | 'madhyahna'
  | 'aparahna'
  | 'pradosh'
  | 'nishita'
  | 'arunodaya'
  | 'chandrodaya';

interface RuleInfo {
  displayName: { en: string; hi: string; sa: string };
  vyapiniLabel: { en: string; hi: string; sa: string };
  explainer: { en: string; hi: string; sa: string };
  icon: 'sun' | 'sunrise' | 'sunset' | 'moon' | 'clock';
  frame: 'amber' | 'blue' | 'rose' | 'gold' | 'indigo';
}

/**
 * Human-readable metadata for each classical Kala-Vyapti rule. All entries
 * come from Dharmasindhu / Nirnayasindhu conventions. The `vyapiniLabel`
 * is the technical name (chandrodaya-vyapini, madhyahna-vyapini, etc.);
 * the `explainer` translates that into "the fast is broken at moonrise"
 * style plain-language guidance.
 */
export const RULE_INFO: Record<MuhurtaRuleName, RuleInfo> = {
  sunrise: {
    displayName: {
      en: 'Udaya Tithi (Sunrise) Rule',
      hi: 'उदय तिथि (सूर्योदय) नियम',
      sa: 'उदयतिथिनियमः',
    },
    vyapiniLabel: {
      en: 'Sunrise-vyapini',
      hi: 'सूर्योदय-व्यापिनी',
      sa: 'सूर्योदय-व्यापिनी',
    },
    explainer: {
      en: 'Observed on the day the tithi prevails at local sunrise — the default rule for most Hindu festivals.',
      hi: 'जिस दिन तिथि स्थानीय सूर्योदय पर विद्यमान हो, उस दिन मनाया जाता है — अधिकांश हिन्दू त्योहारों का सामान्य नियम।',
      sa: 'स्थानीयसूर्योदये विद्यमानायां तिथौ पालनम् — अधिकांशहिन्दूपर्वणां साधारणनियमः।',
    },
    icon: 'sunrise',
    frame: 'amber',
  },
  pratah: {
    displayName: {
      en: 'Pratah Kala Rule',
      hi: 'प्रातः काल नियम',
      sa: 'प्रातःकालनियमः',
    },
    vyapiniLabel: {
      en: 'Pratah-vyapini',
      hi: 'प्रातः-व्यापिनी',
      sa: 'प्रातः-व्यापिनी',
    },
    explainer: {
      en: 'The tithi must prevail during the first fifth of daytime (Pratah Kala) — the early-morning window between sunrise and roughly 9:00 AM.',
      hi: 'तिथि प्रातः काल (दिनमान के प्रथम एक पञ्चमांश) में व्याप्त हो — सूर्योदय से लगभग 9 बजे तक।',
      sa: 'तिथिः प्रातःकाले (दिनमानस्य प्रथमपञ्चमांशे) व्याप्ता स्यात्।',
    },
    icon: 'sunrise',
    frame: 'amber',
  },
  madhyahna: {
    displayName: {
      en: 'Madhyahna (Midday) Rule',
      hi: 'मध्याह्न (मध्यान्ह) नियम',
      sa: 'मध्याह्ननियमः',
    },
    vyapiniLabel: {
      en: 'Madhyahna-vyapini',
      hi: 'मध्याह्न-व्यापिनी',
      sa: 'मध्याह्न-व्यापिनी',
    },
    explainer: {
      en: 'The tithi must prevail during the middle fifth of daytime (Madhyahna) — the classical rule for Ganesh Chaturthi, Ram Navami, Akshaya Tritiya, Vinayaka Chaturthi.',
      hi: 'तिथि मध्याह्न काल (दिनमान के मध्य एक पञ्चमांश) में व्याप्त हो — गणेश चतुर्थी, राम नवमी, अक्षय तृतीया आदि का शास्त्रीय नियम।',
      sa: 'तिथिः मध्याह्नकाले व्याप्ता स्यात् — गणेशचतुर्थी-रामनवमी-अक्षयतृतीयादीनां नियमः।',
    },
    icon: 'sun',
    frame: 'gold',
  },
  aparahna: {
    displayName: {
      en: 'Aparahna (Afternoon) Rule',
      hi: 'अपराह्न नियम',
      sa: 'अपराह्ननियमः',
    },
    vyapiniLabel: {
      en: 'Aparahna-vyapini',
      hi: 'अपराह्न-व्यापिनी',
      sa: 'अपराह्न-व्यापिनी',
    },
    explainer: {
      en: 'The tithi must prevail during the fourth fifth of daytime (Aparahna, roughly 3:00–4:30 PM) — the classical rule for Bhai Dooj, Dussehra, Pitru Paksha Shraddha.',
      hi: 'तिथि अपराह्न काल में व्याप्त हो (दिनमान का चतुर्थ पञ्चमांश) — भाई दूज, दशहरा, पितृ पक्ष श्राद्ध का नियम।',
      sa: 'तिथिः अपराह्नकाले व्याप्ता स्यात् — भ्रातृद्वितीया-दशहरा-पितृपक्षश्राद्धानां नियमः।',
    },
    icon: 'sun',
    frame: 'gold',
  },
  pradosh: {
    displayName: {
      en: 'Pradosh (Sunset) Rule',
      hi: 'प्रदोष (सूर्यास्त) नियम',
      sa: 'प्रदोषनियमः',
    },
    vyapiniLabel: {
      en: 'Pradosh-vyapini',
      hi: 'प्रदोष-व्यापिनी',
      sa: 'प्रदोष-व्यापिनी',
    },
    explainer: {
      en: 'The tithi must prevail at sunset and the following ~96 minutes (Pradosh Kala) — the classical rule for Diwali Lakshmi Puja, Dhanteras, and the monthly Pradosham vrat.',
      hi: 'तिथि सूर्यास्त के समय एवं इसके बाद के ~96 मिनट (प्रदोष काल) में व्याप्त हो — दीवाली लक्ष्मी पूजा, धनतेरस, मासिक प्रदोष व्रत का नियम।',
      sa: 'तिथिः सूर्यास्तकाले तदनन्तर-षण्णवत्यां निमेषेषु (प्रदोषकाले) व्याप्ता स्यात्।',
    },
    icon: 'sunset',
    frame: 'rose',
  },
  nishita: {
    displayName: {
      en: 'Nishita Kala (Midnight) Rule',
      hi: 'निशीथ काल (मध्य रात्रि) नियम',
      sa: 'निशीथकालनियमः',
    },
    vyapiniLabel: {
      en: 'Nishita-vyapini',
      hi: 'निशीथ-व्यापिनी',
      sa: 'निशीथ-व्यापिनी',
    },
    explainer: {
      en: 'The tithi must prevail during Nishita Kala (midnight window, middle of the night) — the classical rule for Krishna Janmashtami and Maha Shivaratri.',
      hi: 'तिथि निशीथ काल (मध्य रात्रि) में व्याप्त हो — कृष्ण जन्माष्टमी एवं महाशिवरात्रि का शास्त्रीय नियम।',
      sa: 'तिथिः निशीथकाले (रात्रिमध्ये) व्याप्ता स्यात् — जन्माष्टमी-शिवरात्र्योः नियमः।',
    },
    icon: 'moon',
    frame: 'indigo',
  },
  arunodaya: {
    displayName: {
      en: 'Arunodaya (Pre-Dawn) Rule',
      hi: 'अरुणोदय (प्रातः पूर्व) नियम',
      sa: 'अरुणोदयनियमः',
    },
    vyapiniLabel: {
      en: 'Arunodaya-vyapini',
      hi: 'अरुणोदय-व्यापिनी',
      sa: 'अरुणोदय-व्यापिनी',
    },
    explainer: {
      en: 'The tithi must prevail during Arunodaya (four ghatis / ~96 minutes before sunrise) — the classical rule for Narak Chaturdashi Abhyanga Snan and other pre-dawn observances.',
      hi: 'तिथि अरुणोदय काल (सूर्योदय से पूर्व चार घटी / ~96 मिनट) में व्याप्त हो — नरक चतुर्दशी अभ्यंग स्नान आदि का नियम।',
      sa: 'तिथिः अरुणोदये (सूर्योदयात् चतुर्घटिकापूर्वे) व्याप्ता स्यात्।',
    },
    icon: 'sunrise',
    frame: 'blue',
  },
  chandrodaya: {
    displayName: {
      en: 'Chandrodaya (Moonrise) Rule',
      hi: 'चन्द्रोदय (चन्द्र-उदय) नियम',
      sa: 'चन्द्रोदयनियमः',
    },
    vyapiniLabel: {
      en: 'Chandrodaya-vyapini',
      hi: 'चन्द्रोदय-व्यापिनी',
      sa: 'चन्द्रोदय-व्यापिनी',
    },
    explainer: {
      en: 'The tithi must prevail at moonrise — the fast is broken only after sighting the Moon. The classical rule for Karva Chauth, Sankashti Chaturthi, Sakat Chauth.',
      hi: 'तिथि चन्द्रोदय के समय व्याप्त हो — चन्द्र दर्शन के बाद ही व्रत भङ्ग होता है। करवा चौथ, संकष्टी चतुर्थी, सकट चौथ का शास्त्रीय नियम।',
      sa: 'तिथिः चन्द्रोदये व्याप्ता स्यात् — चन्द्रदर्शनानन्तरं व्रतभञ्जनम्।',
    },
    icon: 'moon',
    frame: 'indigo',
  },
};

const FRAME_STYLES: Record<RuleInfo['frame'], { border: string; bg: string; text: string; accent: string }> = {
  amber:  { border: 'border-amber-500/25',  bg: 'from-amber-500/[0.06]',  text: 'text-amber-300',  accent: 'text-amber-200' },
  blue:   { border: 'border-sky-500/25',    bg: 'from-sky-500/[0.06]',    text: 'text-sky-300',    accent: 'text-sky-200' },
  rose:   { border: 'border-rose-500/25',   bg: 'from-rose-500/[0.06]',   text: 'text-rose-300',   accent: 'text-rose-200' },
  gold:   { border: 'border-gold-primary/25', bg: 'from-gold-primary/[0.06]', text: 'text-gold-light', accent: 'text-gold-primary' },
  indigo: { border: 'border-indigo-400/25', bg: 'from-indigo-400/[0.06]', text: 'text-indigo-300', accent: 'text-indigo-200' },
};

interface Props {
  /** The classical rule this festival follows. */
  rule: MuhurtaRuleName;
  /** Category label — used for the parana window heading (e.g. "Fast-Break" for chandrodaya on chaturthi, "Puja Window" for others). */
  category?: string;
  /** Observance date (YYYY-MM-DD) — human-readable "Fri, 3 Jul". Optional. */
  observanceDate?: string;
  /** Computed parana start time (HH:mm) — from festival-generator. Optional. */
  paranaStart?: string;
  /** Computed parana end time (HH:mm). */
  paranaEnd?: string;
  /** Human location for the "computed for X" caption. */
  locationName?: string;
  /** IANA tz string for the tz-abbreviation badge (e.g. Asia/Kolkata → IST). */
  timezone?: string;
  locale: Locale;
}

function pickIcon(icon: RuleInfo['icon']) {
  switch (icon) {
    case 'sun':     return Sun;
    case 'sunrise': return Sunrise;
    case 'sunset':  return Sunset;
    case 'moon':    return Moon;
    default:        return Clock;
  }
}

/**
 * Human label for the parana window given the rule. Chandrodaya rule
 * = "Fast-Break at Moonrise"; Pradosh = "Puja at Sunset"; Madhyahna =
 * "Puja at Midday"; default = "Observance Window".
 */
function paranaWindowLabel(rule: MuhurtaRuleName, locale: Locale): string {
  switch (rule) {
    case 'chandrodaya':
      return tl({ en: 'Fast-Break at Moonrise', hi: 'चन्द्रोदय पर व्रत पारण', sa: 'चन्द्रोदये पारणम्' }, locale);
    case 'pradosh':
      return tl({ en: 'Puja Window (Pradosh Kala)', hi: 'पूजा काल (प्रदोष)', sa: 'प्रदोषकाले पूजा' }, locale);
    case 'madhyahna':
      return tl({ en: 'Puja Window (Madhyahna)', hi: 'पूजा काल (मध्याह्न)', sa: 'मध्याह्नपूजा' }, locale);
    case 'nishita':
      return tl({ en: 'Puja Window (Nishita Kala)', hi: 'पूजा काल (निशीथ)', sa: 'निशीथपूजा' }, locale);
    case 'aparahna':
      return tl({ en: 'Puja Window (Aparahna)', hi: 'पूजा काल (अपराह्न)', sa: 'अपराह्णपूजा' }, locale);
    case 'arunodaya':
      return tl({ en: 'Pre-Dawn Window (Arunodaya)', hi: 'अरुणोदय काल', sa: 'अरुणोदयकाले' }, locale);
    case 'pratah':
      return tl({ en: 'Morning Window (Pratah Kala)', hi: 'प्रातः काल', sa: 'प्रातःकाले' }, locale);
    default:
      return tl({ en: 'Observance Window', hi: 'पालन काल', sa: 'पालनकालः' }, locale);
  }
}

export default function VratRuleAndParanaCard({
  rule,
  category,
  observanceDate,
  paranaStart,
  paranaEnd,
  locationName,
  timezone,
  locale,
}: Props) {
  const info = RULE_INFO[rule];
  const styles = FRAME_STYLES[info.frame];
  const Icon = pickIcon(info.icon);

  const hasComputedWindow = Boolean(paranaStart && paranaEnd);
  const tzAbbr = (() => {
    if (!timezone) return null;
    try {
      const parts = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'short',
      }).formatToParts(new Date());
      return parts.find((p) => p.type === 'timeZoneName')?.value ?? null;
    } catch {
      return null;
    }
  })();

  // Nudge for the pradosham case: computeSimpleParana returns
  // sunset..sunset+96min in HH:mm — those minutes can span midnight
  // (e.g. sunset 23:54, ends 00:54 next civil day). No date rollover
  // handling needed for display — the times themselves communicate.

  return (
    <div className={`rounded-2xl border ${styles.border} bg-gradient-to-br ${styles.bg} to-transparent p-5`}>
      {/* Rule badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5">
          <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${styles.text}`} />
          <div>
            <div className={`text-sm font-semibold tracking-wide ${styles.text}`}>
              {tl(info.displayName, locale)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-text-secondary/70 mt-0.5">
              {tl(info.vyapiniLabel, locale)}
              {category ? ` · ${category}` : ''}
            </div>
          </div>
        </div>
        {observanceDate && (
          <span className={`text-xs font-medium ${styles.accent} bg-white/[0.03] border ${styles.border} px-2.5 py-1 rounded-full whitespace-nowrap`}>
            {observanceDate}
          </span>
        )}
      </div>

      {/* Explainer */}
      <p className="text-xs text-text-secondary/80 leading-relaxed mb-4">
        {tl(info.explainer, locale)}
      </p>

      {/* Computed window */}
      {hasComputedWindow ? (
        <div className="rounded-xl border border-white/[0.05] bg-black/[0.15] px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-text-secondary/60 mb-1">
            {paranaWindowLabel(rule, locale)}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black tracking-tight ${styles.accent}`}>{paranaStart}</span>
            <span className="text-text-secondary/50 text-xl font-light">—</span>
            <span className={`text-2xl font-black tracking-tight ${styles.accent}`}>{paranaEnd}</span>
          </div>
          {(locationName || tzAbbr) && (
            <div className="flex items-center gap-1 mt-2 text-[11px] text-text-secondary/70">
              {locationName && <MapPin className="w-3 h-3" />}
              {locationName}
              {tzAbbr && ` (${tzAbbr})`}
            </div>
          )}
        </div>
      ) : (
        // Rule is known but no computed window (major fest without a
        // parana rule, or a solar Sankranti). Skip the second panel.
        null
      )}
    </div>
  );
}
