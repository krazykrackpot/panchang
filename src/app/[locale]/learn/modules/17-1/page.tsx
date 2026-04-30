'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/17-1.json';

const META: ModuleMeta = {
  id: 'mod_17_1', phase: 5, topic: 'Muhurta', moduleNumber: '17.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
  crossRefs: (L.crossRefs as unknown as Array<{ label: ModuleMeta['title']; href: string }>).map(cr => ({ label: cr.label, href: cr.href })),
};

const QUESTIONS: ModuleQuestion[] = (L.questions as unknown as ModuleQuestion[]);

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Muhurta — Why the Start Time Matters
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Muhurta is the branch of Jyotish devoted to selecting auspicious times for important activities — marriage, business launch, house entry, travel, education. The core principle: the moment you START something creates a &ldquo;birth chart&rdquo; for that activity. Just as your natal chart shapes your life patterns, the inception chart of an activity shapes its trajectory.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The five Panchang elements form the primary filter: Tithi (lunar day), Nakshatra (lunar mansion), Yoga (Sun-Moon angular combination), Karana (half-tithi), and Vara (weekday). Each has inherently auspicious and inauspicious categories. Beyond these five, the Lagna (rising sign at the event time) and current planetary strengths add crucial layers of analysis.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The classical hierarchy of importance is: Nakshatra &gt; Tithi &gt; Yoga &gt; Vara &gt; Karana. This means the nakshatra at the time of starting has the strongest influence. A good nakshatra can partially compensate for a mediocre tithi, but a bad nakshatra undermines even the best tithi. This hierarchy guides how our scoring algorithm weights each factor.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">The Inception Chart Concept</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Think of Muhurta like choosing the &ldquo;birthday&rdquo; of your project. A company registered under Pushya nakshatra with strong Jupiter in the lagna has a chart that favours growth, nourishment, and expansion. The same company registered during Rahu Kaal with Vishti karana has a chart riddled with delays and obstacles. The Muhurta IS the natal chart of the endeavour.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          General Rules of Muhurta Selection
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Elements to AVOID in any Muhurta: Rikta tithis (Chaturthi/4th, Navami/9th, Chaturdashi/14th — called &ldquo;empty&rdquo;). Vishti (Bhadra) karana — the most inauspicious karana. Vyatipata and Vaidhriti yogas — the two &ldquo;disaster&rdquo; yogas. Rahu Kaal — the daily period ruled by Rahu. Amavasya (new moon) for most activities.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Elements to PREFER: Shubha nakshatras appropriate to the activity type. Strong lagna lord (not debilitated, combust, or in dusthana). Benefic planets (Jupiter, Venus, Mercury, Moon) in kendras (1st, 4th, 7th, 10th). Waxing Moon (Shukla paksha generally preferred). The hora (planetary hour) matching the activity type.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Nakshatras are classified by activity type: Dhruva (fixed — Rohini, Uttara Phalguni, Uttara Ashadha, Uttarabhadrapada) for permanent works like house construction. Kshipra (swift — Ashwini, Pushya, Hasta) for quick tasks. Mridu (soft — Mrigashira, Chitra, Anuradha, Revati) for arts, relationships. Tikshna (sharp — Ardra, Ashlesha, Jyeshtha, Mula) for surgery, warfare, fierce acts. Matching nakshatra type to activity type is the first step.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Lagna Selection</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The lagna changes every ~2 hours, so it is the most precise timing tool. For marriage: 2nd, 7th, or 11th house lagna. For business: 1st, 10th, or 11th. For education: 2nd or 5th. For travel: 3rd or 9th. The lagna lord must be strong — not debilitated, combust, or retrograde — and ideally placed in a kendra or trikona.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Additionally, no malefic planets (Saturn, Mars, Rahu, Ketu) should occupy the 8th house of the Muhurta chart. Jupiter aspecting the lagna or Moon is always beneficial. These lagna-level rules fine-tune the Muhurta within the broader Panchang framework.
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          The Multi-Factor Scoring Approach
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Our Muhurta AI engine implements a comprehensive scoring system that evaluates each potential time window across four dimensions, combining them into a single 0-100 score.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          This multi-factor approach ensures that no single bad element can hide behind good ones. A time window needs consistent quality across all dimensions to score highly. The result is a ranked list of time windows, colour-coded by quality, that the user can choose from with confidence.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">The Four Scoring Dimensions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Panchang Score:</span> Evaluates the quality of tithi, nakshatra, yoga, karana, and vara at the given time. Each element is rated shubha/ashubha per classical rules. Activity-specific nakshatra matching adds bonus points.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Transit Score:</span> Assesses current planetary strength — are benefics strong? Are malefics contained? Is the relevant house lord well-placed? This captures the broader celestial weather.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Timing Score:</span> Checks the hora ruler (planetary hour) and choghadiya period. A business started during Jupiter hora scores higher than one during Saturn hora. Amrit and Shubha choghadiyas add points.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Personal Score:</span> When the user provides birth details, the engine checks Tara Bala (star strength from birth nakshatra), Chandrabala (Moon position from natal Moon), and Disha Shool (directional defect). This personalizes the Muhurta to the individual.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Score Interpretation</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Scores above 75 indicate excellent Muhurta windows suitable for major events. Scores 50-75 are acceptable for routine activities. Scores below 50 should be avoided for important initiations. In practice, most days have a few high-scoring windows (often early morning or specific evening hours) and several low-scoring periods (particularly during Rahu Kaal and Vishti karana). The engine supports 20 activity types with activity-specific weightings.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example — Business Launch</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> You want to register a new company. The engine evaluates a Thursday morning in Pushya Nakshatra. Panchang Score: high (Pushya is the most auspicious nakshatra for new ventures; Thursday is Jupiter&rsquo;s day). Transit Score: good (Jupiter is strong, not retrograde). Timing Score: excellent (Jupiter Hora active from 7:30-8:30 AM). Personal Score: favorable (good Tara Bala from birth nakshatra). Combined: 82/100 — an excellent window.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Contrast:</span> The same Thursday afternoon during Rahu Kaal (1:30-3:00 PM) with Vishti Karana active. Panchang Score: low (Vishti karana penalized). Timing Score: very low (Rahu Kaal active). Combined: 31/100 — avoid for important work. Same day, vastly different quality of time.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Any time during Rahu Kaal is bad.&rdquo; Reality: Rahu Kaal primarily affects new initiations. Routine activities already in progress are not significantly affected. However, starting anything new during Rahu Kaal is universally avoided.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Muhurta can override a bad birth chart.&rdquo; Reality: Muhurta optimizes timing within the possibilities your chart allows. It cannot create outcomes your chart does not promise. Think of it as choosing the best weather to sail — it helps, but cannot change the ship.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Abhijit Muhurta is always auspicious.&rdquo; Reality: Abhijit (the 48 minutes around local noon) is NOT auspicious on Wednesdays per classical rules. Our scoring engine accounts for this exception. See Module 17.2 for marriage-specific Muhurta and Module 17.3 for travel, vehicle, and Griha Pravesh Muhurta.</p>
      </section>
    </div>
  );
}

export default function Module17_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
