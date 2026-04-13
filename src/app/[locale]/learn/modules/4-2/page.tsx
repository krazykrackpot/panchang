'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/4-2.json';

const META: ModuleMeta = {
  id: 'mod_4_2', phase: 1, topic: 'Ayanamsha', moduleNumber: '4.2',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
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
          If the sidereal zodiac is anchored to fixed stars, you might expect there to be only one correct ayanamsha value. But here lies the crux: which fixed star do you anchor to, and at what exact ecliptic longitude? Different astronomers across centuries chose slightly different reference stars and calibration dates, producing ayanamsha values that diverge by 1 to 3 degrees. This seemingly small gap can change a planet&apos;s sign for positions near a rashi boundary, cascading into different dasha sequences, different house lordships, and entirely different predictions.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The four most widely used systems are: <strong className="text-gold-light">Lahiri (Chitrapaksha)</strong>, the Indian Government standard that anchors Spica at 180°; <strong className="text-gold-light">B.V. Raman</strong>, popularized by the legendary Bangalore astrologer, placing the zero-point around 397 CE; <strong className="text-gold-light">KP (Krishnamurti)</strong>, nearly identical to Lahiri but fine-tuned for the Krishnamurti Paddhati sub-lord system; and <strong className="text-gold-light">Fagan-Bradley</strong>, the Western sidereal standard that anchors Aldebaran and Antares on the Taurus-Scorpio axis.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          All four systems agree on the physics — precession advances at approximately 50.3 arcseconds per year. Where they disagree is the epoch: the exact year when the tropical and sidereal zodiacs coincided (zero ayanamsha). Lahiri places this around 285 CE, Raman around 397 CE, and Fagan-Bradley around 221 CE. Since all then apply the same precession rate forward, the differences remain constant across centuries.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The &quot;reference star debate&quot; is fundamentally a question of convention rather than correctness. The ecliptic does not have a physically marked zero point among the stars. Ancient Indian astronomers used the nakshatra Chitra (Spica) as their primary reference because it lies almost exactly on the ecliptic and is one of the brightest stars in the sky — making it easy to observe. Western siderealists preferred the Aldebaran-Antares axis because those two bright stars sit nearly 180° apart, providing a self-checking baseline.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Surya Siddhanta and early siddhantas did not specify a single precise ayanamsha value — they used approximate corrections or the trepidation model. The concept of a fixed, monotonically increasing ayanamsha anchored to a specific star emerged in the modern era. Nyanatiloka Chattopadhyaya (later known as N.C. Lahiri) computed his ayanamsha tables in the 1930s-40s. The 1955 Calendar Reform Committee report, chaired by the great physicist Meghnad Saha, evaluated 30+ ayanamsha proposals and selected Lahiri as best matching observable star positions and traditional Indian calendar conventions. Meanwhile, Cyril Fagan derived his system from Babylonian star catalogues in the 1940s, and B.V. Raman published his independent calculations based on his interpretation of classical texts.
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
          Numerical Comparison &amp; Conversion
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          At the J2000.0 epoch (1 January 2000, 12:00 TT), the four major ayanamsha values are: <strong className="text-gold-light">Lahiri: 23.853°</strong>, <strong className="text-gold-light">KP (Krishnamurti): 23.749°</strong>, <strong className="text-gold-light">B.V. Raman: 22.370°</strong>, and <strong className="text-gold-light">Fagan-Bradley: 24.042°</strong>. The spread from smallest (Raman) to largest (Fagan-Bradley) is 1.672° — enough to shift a boundary planet into a different sign.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          For 2026 (T = 0.26 centuries from J2000.0), applying the standard precession rate to each: Lahiri ≈ 24.22°, KP ≈ 24.11°, Raman ≈ 22.73°, Fagan-Bradley ≈ 24.41°. The formula for Lahiri specifically is: A = 23.85306 + 1.39722×T + 0.00018×T² - 0.000005×T³, where T is Julian centuries from J2000.0. Other systems use the same precession polynomial but with a different initial constant.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          How do you choose which system to use? For traditional Parashari or Jaimini Vedic astrology, Lahiri is the safe default — it has the largest practitioner base, the most validated predictions, and official Indian Government backing. For KP (Krishnamurti Paddhati) astrology specifically, use the KP ayanamsha since the sub-lord tables were computed with it. For Western sidereal astrology, use Fagan-Bradley. If you follow B.V. Raman&apos;s interpretive methods, use his ayanamsha for internal consistency.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The key principle: always be consistent within a single chart reading. Never mix Lahiri positions with KP sub-lord tables, or Raman positions with Lahiri-based dasha calculations. The system is self-consistent — the interpretive rules were developed and tested under a specific ayanamsha, and switching mid-analysis introduces errors.
        </p>
      </section>
      <ExampleChart
        ascendant={1}
        planets={{ 1: [0], 4: [1], 10: [4] }}
        title="Ayanamsha Comparison — Same Planets, Different Systems"
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Example 1 — Sign change across systems:</span> Suppose the Sun is at 45° tropical (Taurus 15°) on a given date in 2026. Lahiri sidereal: 45° - 24.22° = 20.78° = Aries 20°47&apos;. Raman sidereal: 45° - 22.73° = 22.27° = Aries 22°16&apos;. KP sidereal: 45° - 24.11° = 20.89° = Aries 20°53&apos;. Fagan-Bradley: 45° - 24.41° = 20.59° = Aries 20°35&apos;. All four systems agree: Aries. No sign change here because 45° is well within one sign of the nearest cusp.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Example 2 — Boundary case with sign change:</span> Now suppose Moon is at 54.5° tropical (Taurus 24.5°). Lahiri: 54.5° - 24.22° = 30.28° = Taurus 0°17&apos; (just entered Taurus). Raman: 54.5° - 22.73° = 31.77° = Taurus 1°46&apos;. But if Moon were at 53.9° tropical: Lahiri gives 29.68° = Aries 29°41&apos; (still in Aries!), while Raman gives 31.17° = Taurus 1°10&apos; (already in Taurus). Different sign, different house lord, different dasha.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example 3 — Lahiri polynomial for 2026:</span> T = (2026.0 - 2000.0)/100 = 0.26. A = 23.85306 + 1.39722×0.26 + 0.00018×(0.26)² - 0.000005×(0.26)³ = 23.85306 + 0.36328 + 0.00001 - 0.00000 = 24.2164°. This matches published Lahiri values for 2026.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <strong>Misconception:</strong> &quot;Lahiri is the only correct ayanamsha and all others are wrong.&quot; <strong className="text-red-300">Reality:</strong> No ayanamsha can be mathematically proven &quot;correct&quot; in an absolute sense — the choice of anchor star is a human convention. Lahiri is the most widely used and officially recognized, giving it the largest empirical validation base. But competent astrologers get excellent results with KP, Raman, and other systems.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <strong>Misconception:</strong> &quot;The difference between systems is negligible and does not matter.&quot; <strong className="text-red-300">Reality:</strong> The ~1.5° gap between Lahiri and Raman may seem small, but for any planet within 2° of a sign boundary (statistically, about 13% of all planets), the sign changes. Different sign means different house lordship, different natural benefic/malefic status, different dasha sequence — the entire reading can diverge.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our app defaults to the Lahiri ayanamsha (Indian Government standard) for all calculations. The internal pipeline works as follows: Meeus algorithms compute tropical planetary longitudes to sub-degree accuracy, then the Lahiri polynomial subtracts the ayanamsha to produce sidereal positions. For KP practitioners, the app&apos;s KP module uses the Krishnamurti ayanamsha with its own sub-lord tables. The difference between systems is purely in the constant offset — the underlying astronomical engine remains identical. When in doubt, use Lahiri: it has 70+ years of institutional backing, the largest corpus of validated predictions, and is what the Rashtriya Panchang uses.
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
          The Lahiri System — Deep Dive
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Lahiri ayanamsha owes its name to Nirmala Chandra Lahiri (1906-1980), an astronomer and mathematician who served as the head of the Positional Astronomy Centre in Kolkata. Lahiri computed precise ayanamsha tables by defining the bright star Spica (Alpha Virginis, known as Chitra in the nakshatra system) at exactly 180° sidereal ecliptic longitude — the first point of Tula (Libra). This definition is called &quot;Chitrapaksha&quot; because it takes the Chitra nakshatra as its reference.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In 1952, the Indian Government established the Calendar Reform Committee under the Council of Scientific and Industrial Research (CSIR), chaired by the Nobel-nominated physicist Meghnad Saha. The committee surveyed over 30 different ayanamsha proposals from various regional panchangs across India. Their 1955 report concluded that the Chitrapaksha (Lahiri) system best reconciled astronomical observation with traditional calendar practices. The recommendation was adopted in 1956, and the Rashtriya Panchang (National Calendar) has used Lahiri ever since.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Why Spica? It is the 15th brightest star in the sky (magnitude +1.04), lies within 2° of the ecliptic plane (making it an excellent zodiacal reference), and has been used as a fiducial star in Indian astronomy for millennia. The word &quot;Chitra&quot; itself means &quot;bright&quot; or &quot;brilliant&quot; in Sanskrit. Spica&apos;s proper motion is only about 43 milliarcseconds per year — negligible over human timescales, ensuring the reference remains stable for centuries.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Lahiri polynomial formula is: A(T) = 23.85306 + 1.39722×T + 0.00018×T² - 0.000005×T³, where T is Julian centuries from J2000.0. The linear term (1.39722°/century = 50.3 arcsec/year) represents the precession rate. The quadratic and cubic terms capture tiny accelerations in precession caused by planetary perturbations on Earth&apos;s orbit. At current rates, Lahiri ayanamsha crosses 25° around the year 2080 and will reach 30° (a full sign offset) around approximately 2440 CE.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          While the BPHS (Brihat Parashara Hora Shastra) does not specify a numerical ayanamsha, the Surya Siddhanta (circa 400 CE) places the Chitra star in a manner consistent with the Chitrapaksha framework. The concept of using Chitra/Spica as the primary reference star has roots going back to the Vedanga Jyotisha period. The modern Lahiri formalization simply quantified what was already implicit in the Indian astronomical tradition. The Calendar Reform Committee drew on this heritage while applying modern observational precision.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Example 1 — Lahiri across centuries:</span> For year 1900 (T = -1.0): A = 23.85306 - 1.39722 + 0.00018 + 0.000005 = 22.456°. For year 2000 (T = 0): A = 23.853°. For year 2100 (T = 1.0): A = 23.85306 + 1.39722 + 0.00018 - 0.000005 = 25.250°. The ayanamsha grew by 2.794° over 200 years, averaging 1.397° per century.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example 2 — Finding the zero-ayanamsha year:</span> We need A(T) = 0. Using the linear approximation: 0 = 23.853 + 1.397×T, so T = -17.07 centuries = year 2000 - 1707 = ~293 CE. The full polynomial gives ~285 CE, the commonly cited epoch when the tropical vernal equinox coincided with sidereal 0° Aries under the Lahiri system. This is why the two zodiacs diverged — from ~285 CE onward, the gap grew by ~1.4° per century.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <strong>Misconception:</strong> &quot;Lahiri ayanamsha has been used since ancient times.&quot; <strong className="text-red-300">Reality:</strong> The modern Lahiri formulation dates to the 20th century. Ancient Indian astronomers used approximate corrections or trepidation models. Lahiri systematized what was a scattered tradition into a precise, computable formula.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <strong>Misconception:</strong> &quot;Since Spica has proper motion, the Lahiri system drifts over time.&quot; <strong className="text-red-300">Reality:</strong> Spica&apos;s proper motion is ~43 milliarcseconds/year — it takes about 84 years to accumulate a single arcsecond of drift. Over a human lifetime, this is completely negligible. Over 10,000 years it would be about 7 arcminutes — still smaller than the uncertainty in any ancient text. The Lahiri system is stable for all practical astrological purposes.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Lahiri ayanamsha is used by the Indian Government&apos;s Rashtriya Panchang, the India Meteorological Department, virtually all North Indian panchangs, most South Indian panchangs, and the vast majority of practicing Jyotishis worldwide. When software like this app, Jagannatha Hora, or Parashara&apos;s Light defaults to &quot;Lahiri,&quot; they are implementing the same polynomial. The institutional consensus means that Lahiri-based predictions have been tested across millions of charts for over 70 years — a validation corpus no other ayanamsha can match. For this reason, Lahiri is the recommended default for anyone beginning Vedic astrology study.
        </p>
      </section>
    </div>
  );
}

export default function Module4_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
