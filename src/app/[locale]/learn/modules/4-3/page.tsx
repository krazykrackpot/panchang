'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/4-3.json';

const META: ModuleMeta = {
  id: 'mod_4_3', phase: 1, topic: 'Ayanamsha', moduleNumber: '4.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 16,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {META.title.en}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          There are two ways to define 0° Aries — and this single choice creates the fundamental split between Western and Vedic astrology. The <strong className="text-gold-light">tropical zodiac</strong> defines 0° Aries as the vernal equinox point: where the Sun crosses the celestial equator heading north, around March 20-21 each year. This ties the zodiac to Earth&apos;s seasons. The <strong className="text-gold-light">sidereal zodiac</strong> defines 0° Aries relative to the fixed background stars, making it independent of seasons but locked to the cosmic backdrop.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Neither zodiac is &quot;right&quot; or &quot;wrong&quot; — they are two valid coordinate systems measuring from different reference points. The tropical zodiac answers: &quot;where is this planet in the seasonal cycle?&quot; The sidereal zodiac answers: &quot;where is this planet against the fixed stars?&quot; Two thousand years ago these questions had the same answer. Today, due to precession, they differ by about 24°.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The practical consequence is striking: approximately 80% of people have a different Sun sign in Western astrology versus Vedic astrology. If your Western Sun is in early Aries (say 15°), your Vedic Sun is actually in Pisces (15° - 24.2° = 350.8° = Pisces 20.8°). This creates the common &quot;which sign am I really?&quot; confusion. The answer is: you are both. Your tropical Sun describes your seasonal archetype; your sidereal Sun describes your stellar position. They measure different things.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Why did Western and Vedic traditions diverge? In the 2nd century CE, Claudius Ptolemy wrote the <em>Tetrabiblos</em>, which became the bible of Western astrology. He explicitly defined the zodiac by equinoxes and solstices — tropical by design. Meanwhile, Indian astronomy was built around the 27 nakshatras, which are divisions of the ecliptic marked by actual stars. The nakshatra system demands a star-fixed reference frame. When Hipparchus discovered precession (~150 BCE), the die was cast: Greek-derived Western astrology chose the moving equinox, while star-focused Indian astrology remained anchored to the sky.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Vedanga Jyotisha (~1200 BCE), one of the earliest Indian astronomical texts, already used a star-based reference system. The 27 nakshatras — Ashwini, Bharani, Krittika, and so on — are defined by their yogataras (junction stars). The Surya Siddhanta and the BPHS both operate entirely in the sidereal framework. Varahamihira (505-587 CE), writing in the Brihat Samhita, was aware that the equinox point was shifting relative to the stars, but Jyotish practice remained sidereal because the nakshatra system — and thus dasha allocation, muhurta selection, and chart interpretation — required it.
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
          Historical Alignment &amp; Astrological Ages
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          When did the two zodiacs last agree? Under the Lahiri ayanamsha, the zero-point epoch is approximately <strong className="text-gold-light">285 CE</strong>. At that moment, the vernal equinox coincided with sidereal 0° Aries — tropical and sidereal positions were identical. Before that date, the sidereal zodiac was actually ahead of tropical (negative ayanamsha); after it, the gap has grown steadily at ~50.3 arcseconds per year. By 2026, the gap is ~24.22°. By ~2440 CE, it will reach 30° — a full sign offset.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This gradual drift gives rise to the concept of <strong className="text-gold-light">Astrological Ages</strong>. As the vernal equinox precesses westward through the sidereal constellations, it spends approximately 2,148 years in each one (25,772 / 12). The equinox entered the sidereal constellation Pisces roughly around the start of the Common Era (the exact date varies by system), which is why our current era is called the &quot;Age of Pisces.&quot; The much-discussed &quot;Age of Aquarius&quot; begins when the equinox enters sidereal Aquarius — estimates range from ~2100 CE to ~2600 CE depending on how constellation boundaries are defined.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          What happens as the zodiacs diverge further? Over the next 2000 years, the offset will grow from the current ~24° to ~52° — nearly two full signs. A person whose Western chart shows Sun in Aries could have their Vedic Sun in Aquarius. The nakshatra assignments would be even more dramatically different. This increasing divergence makes it ever more important to specify which zodiac system a chart uses.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Hindu concept of yugas (cosmic ages) is sometimes confused with astrological ages, but they are different. Astrological ages are defined by the equinox&apos;s position among sidereal constellations and last ~2,148 years each. Hindu yugas (Satya, Treta, Dvapara, Kali) are described in Puranic literature as lasting hundreds of thousands of years. Sri Yukteshwar Giri proposed a shorter yuga cycle of 24,000 years (roughly matching the precession period), but this remains a minority interpretation not accepted in mainstream Jyotish.
        </p>
      </section>
      <ExampleChart
        ascendant={1}
        planets={{ 1: [2], 4: [1], 10: [0] }}
        title="Tropical vs Sidereal — Same Sky, Different Signs"
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Example 1 — The &quot;sign confusion&quot;:</span> Someone born April 5 has Sun at ~15° Aries tropically (Western: Aries). Vedic sidereal: 15° - 24.2° = -9.2° → 360° - 9.2° = 350.8° → Pisces 20.8°. Western says bold fire sign Aries; Vedic says intuitive water sign Pisces. Both are astronomically correct — they reference different zero-points. The personality traits associated with each come from interpretive traditions developed within their respective frameworks.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Example 2 — The alignment epoch:</span> In 285 CE, the ayanamsha was 0°. A planet at tropical 72° was also at sidereal 72° (Gemini 12° in both systems). By 1285 CE (~1000 years later), the ayanamsha had grown to ~14°. That same tropical 72° was now sidereal 58° (Taurus 28°). By 2285 CE it will be ~38° ayanamsha, making tropical 72° = sidereal 34° (Taurus 4°). The sidereal position falls progressively behind.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example 3 — Age calculation:</span> If the Age of Pisces began when the equinox entered sidereal Pisces (~68 CE by one reckoning), and each age lasts ~2,148 years, then the Age of Aquarius begins around 68 + 2148 = ~2216 CE. This is one of many estimates — the uncertainty arises because sidereal constellation boundaries are not sharply defined (unlike the exactly 30° zodiac signs).
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <strong>Misconception:</strong> &quot;The sidereal zodiac is more accurate because it matches the actual constellations in the sky.&quot; <strong className="text-red-300">Reality:</strong> The 12 zodiac signs are each exactly 30° wide, but the actual constellations vary dramatically in size (Virgo spans ~44° while Cancer spans ~20°). Neither the tropical nor sidereal zodiac matches the irregular constellation boundaries. Both use an idealized, equal-division system. The sidereal zodiac is better aligned with the nakshatra framework, not with constellation edges.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <strong>Misconception:</strong> &quot;Vedic astrology is ancient and tropical is modern, so sidereal must be the original.&quot; <strong className="text-red-300">Reality:</strong> Both systems have ancient roots. Babylonian astrology (from which Greek astrology descended) originally used a sidereal-like system. Ptolemy&apos;s shift to tropical in the 2nd century CE was an intentional choice, not a mistake. Indian astronomy preserved the sidereal approach because its predictive techniques (nakshatras, dashas) were built for a star-fixed frame. The antiquity of one system does not invalidate the other.
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
          Practical Implications &amp; Reconciliation
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Why does Vedic astrology specifically need the sidereal zodiac? The answer lies in the <strong className="text-gold-light">nakshatra system</strong>. The 27 nakshatras divide the ecliptic into 13°20&apos; segments, each identified by a yogtara (junction star). Ashwini&apos;s yogtara is Beta Arietis, Krittika&apos;s is Alcyone in the Pleiades, Rohini&apos;s is Aldebaran. If you used the tropical zodiac, these star-named divisions would slowly drift away from their namesake stars — Krittika would no longer contain the Pleiades, Rohini would no longer contain Aldebaran. The entire nakshatra system would become meaningless. Since Vimshottari Dasha (the primary predictive tool in Parashari Jyotish) allocates planetary periods based on the Moon&apos;s nakshatra, using tropical positions would produce wrong dasha sequences.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Conversely, the tropical zodiac has its own logic. The signs Aries through Pisces were originally named for seasonal qualities: Aries = spring equinox energy, Cancer = summer solstice, Libra = autumn equinox balance, Capricorn = winter solstice. If you use sidereal positions, these seasonal correspondences break down — sidereal Aries no longer begins at the spring equinox. For Western astrology, which interprets signs primarily through seasonal symbolism, tropical positions are internally consistent.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Can the two systems be reconciled? In the 20th century, Irish astrologer <strong className="text-gold-light">Cyril Fagan</strong> and American statistician <strong className="text-gold-light">Donald Bradley</strong> launched the Western Sidereal movement, arguing that Western astrology should return to sidereal positions (as the Babylonians originally used). They developed the Fagan-Bradley ayanamsha (~24.04° at J2000.0, anchoring Aldebaran at 15° Taurus) and reinterpreted Western techniques using sidereal charts. This movement has a dedicated following but remains a minority within Western astrology.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The pragmatic resolution used by most modern practitioners is: use the system that matches your interpretive framework. If you practice Parashari or Jaimini Jyotish with nakshatras and dashas, use sidereal (Lahiri). If you practice modern Western astrology with aspects, transits, and psychological archetypes, use tropical. If you practice KP, use the KP ayanamsha. Mixing frameworks — applying Western interpretive rules to sidereal charts, or Vedic dasha rules to tropical charts — produces unreliable results because the interpretive rules were calibrated within their native zodiac system.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Brihat Parashara Hora Shastra (BPHS) assigns each nakshatra a dasha lord: Ashwini → Ketu (7 years), Bharani → Shukra (20 years), Krittika → Surya (6 years), and so on through the Vimshottari cycle of 120 years. This mapping is fixed to the star-based nakshatra positions. Parashara also assigns rashi lords, exaltation degrees, and moolatrikona ranges — all in the sidereal framework. The entire interpretive apparatus of classical Jyotish was built, tested, and refined over millennia using sidereal positions. Switching to tropical would require recalibrating every rule, every exaltation degree, every yogtara boundary — effectively creating a new system from scratch.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Example 1 — Dasha divergence:</span> Moon at tropical 40° (Taurus 10°) → sidereal 15.8° (Aries 15.8°). Tropical puts Moon in Krittika nakshatra (Taurus 10° = 40°, Krittika spans 26°40&apos; to 40°). Sidereal puts Moon in Ashwini (15.8° = Ashwini pada 2). Tropical Krittika → Sun dasha lord (6 years). Sidereal Ashwini → Ketu dasha lord (7 years). Completely different dasha sequence from birth — tropical gives Sun-Moon-Mars..., sidereal gives Ketu-Venus-Sun.... Every prediction diverges.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example 2 — Seasonal vs stellar logic:</span> On December 21 (winter solstice), the Sun is at tropical 270° = Capricorn 0° (by definition). Sidereal position: 270° - 24.2° = 245.8° = Sagittarius 5.8°. Tropically, Capricorn 0° perfectly captures the winter solstice symbolism (new beginning from the darkest point). Sidereally, the Sun is in Sagittarius — the archer — which carries entirely different mythological associations. Both are internally coherent within their respective interpretive traditions.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <strong>Misconception:</strong> &quot;Western astrology is wrong because it does not match the actual sky anymore.&quot; <strong className="text-red-300">Reality:</strong> Western astrology never claimed to match the sky — after Ptolemy, it explicitly chose the equinox as its reference. The tropical zodiac is a seasonal coordinate system. Saying it is &quot;wrong&quot; because Aries does not align with the Aries constellation is like saying the GMT timezone is &quot;wrong&quot; because noon does not match solar noon everywhere.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <strong>Misconception:</strong> &quot;We can simply use both zodiacs together for a more complete reading.&quot; <strong className="text-red-300">Reality:</strong> While some astrologers do examine both charts, you cannot mix techniques. Vimshottari Dasha must use sidereal nakshatra positions. Western aspect patterns were developed with tropical positions. Applying Vedic dasha rules to a tropical chart, or Western transit rules to a sidereal chart, yields unreliable results because the interpretive rules are calibrated to their native zodiac.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          This app computes planetary positions using Meeus algorithms (same mathematical basis as NASA&apos;s ephemerides), producing tropical longitudes accurate to ~0.01° for the Sun and ~0.5° for the Moon. The Lahiri ayanamsha polynomial then converts these to sidereal positions for all Vedic calculations — nakshatras, dashas, yogas, house cusps, and chart interpretation. The tropical-to-sidereal conversion is a simple subtraction, but it is the conceptual bridge between modern computational astronomy (which works in tropical/equatorial coordinates) and classical Jyotish (which requires sidereal/nakshatra-based positions). Understanding why this bridge exists — and why both sides are valid — is fundamental to understanding why Vedic and Western astrology give different but internally consistent readings for the same birth moment.
        </p>
      </section>
    </div>
  );
}

export default function Module4_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
