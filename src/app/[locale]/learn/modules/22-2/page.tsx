'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import QuickCheck from '@/components/learn/QuickCheck';

const META: ModuleMeta = {
  id: 'mod_22_2', phase: 9, topic: 'Astronomy', moduleNumber: '22.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'The Sun\'s position is computed using Meeus\'s algorithm with just 3 main sine corrections  –  achieving 0.01-degree accuracy.',
          'The algorithm accounts for Earth\'s elliptical orbit (Equation of Center), axial wobble (nutation), and light travel (aberration).',
          'Tropical-to-sidereal conversion via ayanamsha (~24.22° in 2026) is the final step for Vedic astrology.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Sun\'s Apparent Motion', hi: 'सूर्य की दृश्य गति', sa: 'सूर्य की दृश्य गति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">From Earth&apos;s perspective, the Sun appears to trace a great circle around the sky once per year. This path is the ecliptic, and the Sun moves along it at roughly 1 degree per day (360° / 365.25 days). But &quot;roughly&quot; is the key word  –  the motion is NOT uniform. Earth orbits the Sun in an ellipse with eccentricity e ≈ 0.017. At perihelion (closest approach, around January 3), the Sun appears to move about 1.02°/day. At aphelion (farthest, around July 4), only about 0.95°/day. This ~7% variation is why we need the Equation of Center.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Two fundamental quantities track the Sun&apos;s position. The <strong className="text-gold-light">geometric mean longitude</strong> L₀ = 280.466° + 36000.770° x T tells us where the Sun would be if Earth&apos;s orbit were a perfect circle. The <strong className="text-gold-light">mean anomaly</strong> M = 357.529° + 35999.050° x T tracks how far Earth has travelled from perihelion. These are &quot;mean&quot; quantities  –  averages that ignore the real elliptical variation. T is Julian centuries from J2000.0.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">The Meeus Algorithm Overview</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Jean Meeus&apos;s &quot;Astronomical Algorithms&quot; (1991) provides the standard reference implementation used by most panchang software. The algorithm proceeds in five steps:</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">1.</span> Compute T (Julian centuries from J2000.0) from the Julian Day number.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">2.</span> Compute mean longitude L₀ and mean anomaly M.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">3.</span> Apply the Equation of Center (3 sine terms) to get true longitude.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">4.</span> Apply nutation and aberration corrections to get apparent longitude.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">5.</span> Subtract ayanamsha to convert from tropical to sidereal (for Vedic use).</p>
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
          {tl({ en: 'Equation of Center  –  The Core Correction', hi: 'केन्द्र समीकरण  –  मूल सुधार', sa: 'केन्द्र समीकरण  –  मूल सुधार' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The Equation of Center converts the mean anomaly (where Earth &quot;should be&quot; if moving uniformly) to the true anomaly (where it actually is). For the Sun, the correction C is expressed as three sine terms:</p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-3">
          <p className="text-gold-light text-sm font-mono mb-1">C = 1.915° x sin(M) + 0.020° x sin(2M) + 0.000289° x sin(3M)</p>
          <p className="text-text-secondary text-xs mt-2">The dominant first term (1.915°) alone accounts for 99% of the correction. The second term adds orbit asymmetry. The third is negligible but included for completeness.</p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">True Longitude = L₀ + C. Then we apply two small corrections for the apparent (observed) longitude:</p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-3">
          <p className="text-gold-light text-sm font-mono mb-1">Apparent = True - 0.00569° - 0.00478° x sin(Ω)</p>
          <p className="text-text-secondary text-xs mt-2">where Ω = 125.04° - 1934.136° x T (Moon&apos;s ascending node longitude)</p>
          <p className="text-text-secondary text-xs mt-1">-0.00569° = aberration constant (20.5 arcseconds, due to finite light speed)</p>
          <p className="text-text-secondary text-xs">-0.00478° x sin(Ω) = nutation in longitude (18.6-year cycle from lunar gravity)</p>
        </div>
        <WhyItMatters locale={locale}>
          The Equation of Center is what the Surya Siddhanta called &quot;manda-phala&quot; (slow correction)  –  ancient Indian astronomers knew about it 1,500 years ago. Meeus formalised it with modern notation, but the concept is identical: real orbits are elliptical, not circular, so we must correct for the difference.
        </WhyItMatters>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Why Tropical Needs Sidereal Conversion</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          The Meeus algorithm gives the Sun&apos;s <strong>tropical</strong> longitude  –  measured from the vernal equinox (0° Aries in Western astrology). Vedic astrology uses the <strong>sidereal</strong> zodiac  –  measured from a fixed star reference. The difference is the <strong className="text-gold-light">ayanamsha</strong>, which increases by ~50.3 arcseconds per year due to Earth&apos;s axial precession (the ~25,772-year wobble cycle).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong>Sidereal Longitude = Tropical Longitude - Ayanamsha.</strong> Using the Lahiri ayanamsha (Indian government standard): ~24.22° for 2026. This means your Western &quot;Aries&quot; Sun at 10° tropical is actually at ~346° sidereal = ~16° Pisces in Vedic astrology.
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
          {tl({ en: 'Worked Example: Step-by-Step Sun Position', hi: 'कार्यान्वित उदाहरण: चरणबद्ध सूर्य स्थिति', sa: 'कार्यान्वित उदाहरण: चरणबद्ध सूर्य स्थिति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Compute the Sun&apos;s sidereal position for <strong className="text-gold-light">2 April 2026, noon UT</strong> (JD = 2461132.0).</p>

        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-gold-light text-xs font-bold mb-1">Step 1  –  Julian Century</p>
            <p className="text-text-secondary text-xs font-mono">T = (2461132.0 - 2451545.0) / 36525 = 0.26246</p>
          </div>
          <div>
            <p className="text-gold-light text-xs font-bold mb-1">Step 2  –  Mean Quantities</p>
            <p className="text-text-secondary text-xs font-mono mb-1">L₀ = 280.466° + 36000.770° x 0.26246 = 9728.97° → 8.97° (mod 360°)</p>
            <p className="text-text-secondary text-xs font-mono">M = 357.529° + 35999.050° x 0.26246 = 9805.73° → 85.73°</p>
          </div>
          <div>
            <p className="text-gold-light text-xs font-bold mb-1">Step 3  –  Equation of Center</p>
            <p className="text-text-secondary text-xs font-mono mb-1">C = 1.915° x sin(85.73°) + 0.020° x sin(171.46°) + 0.000289° x sin(257.19°)</p>
            <p className="text-text-secondary text-xs font-mono mb-1">C = 1.910° + 0.003° - 0.000° = 1.913°</p>
            <p className="text-text-secondary text-xs font-mono">True longitude = 8.97° + 1.913° = 10.88°</p>
          </div>
          <div>
            <p className="text-gold-light text-xs font-bold mb-1">Step 4  –  Nutation &amp; Aberration</p>
            <p className="text-text-secondary text-xs font-mono mb-1">Ω = 125.04° - 1934.136° x 0.26246 = -382.7° → 337.3°</p>
            <p className="text-text-secondary text-xs font-mono">Apparent = 10.88° - 0.006° + 0.002° = 10.876° (tropical)</p>
          </div>
          <div>
            <p className="text-gold-light text-xs font-bold mb-1">Step 5  –  Sidereal Conversion</p>
            <p className="text-text-secondary text-xs font-mono mb-1">Sidereal = 10.876° - 24.22° = -13.34° → 346.66° (mod 360°)</p>
            <p className="text-text-secondary text-xs font-mono">= 16.66° in Pisces (330°-360°) ✓ Correct for early April</p>
          </div>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">The Sun enters Aries around 14 April (Mesha Sankranti), so Sun in Pisces on 2 April is correct. This five-step process is what our <code className="text-gold-light text-xs">sunLongitude(jd)</code> function implements, called hundreds of times per page load.</p>
      </section>
    </div>
  );
}

function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Accuracy Comparison and Obliquity', hi: 'सटीकता तुलना और क्रान्तिवृत्त कोण', sa: 'सटीकता तुलना और क्रान्तिवृत्त कोण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">How accurate is our Sun position? The Meeus low-precision algorithm achieves approximately 0.01° (36 arcseconds). Since the Sun moves ~1°/day, a 0.01° error translates to roughly 1 minute of time  –  meaning our sunrise/sunset calculations have ~1 minute inherent uncertainty from the solar longitude alone.</p>

        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-3">
          <h5 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Accuracy Comparison Table</h5>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-gold-light py-1 pr-3">Method</th>
                <th className="text-left text-gold-light py-1 pr-3">Accuracy</th>
                <th className="text-left text-gold-light py-1">Used By</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Meeus (our app)</td><td className="py-1 pr-3">~0.01° (36&quot;)</td><td className="py-1">Panchang apps, basic astrology</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Swiss Ephemeris</td><td className="py-1 pr-3">~0.001° (3.6&quot;)</td><td className="py-1">Professional astrology software</td></tr>
              <tr><td className="py-1 pr-3">JPL DE440</td><td className="py-1 pr-3">~0.0001° (0.36&quot;)</td><td className="py-1">NASA, space missions</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">For Panchang purposes where the smallest meaningful unit is a tithi boundary (~12° of Moon-Sun separation), our 0.01° Sun accuracy is more than adequate. Even for sankranti timing (Sun crossing sign boundaries), the error is under 1 minute.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The <strong className="text-gold-light">obliquity of the ecliptic</strong> (Earth&apos;s axial tilt, currently ~23.44°) is needed for converting ecliptic coordinates to equatorial coordinates  –  essential for sunrise/sunset calculations. The obliquity slowly decreases (~0.013° per century) and also wobbles with the 18.6-year nutation cycle. Our code accounts for both effects.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;More sine terms always mean better accuracy for the Sun.&quot; For the Sun, 3 terms are sufficient because Earth&apos;s orbit has very low eccentricity (e ≈ 0.017). The 4th term would be ~0.000001°. The Moon, with its complex orbit, genuinely needs 60+ terms.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Tropical and sidereal zodiacs are rival systems  –  one is right, the other wrong.&quot; Both are astronomically valid. Tropical measures from the equinox (seasons). Sidereal measures from fixed stars. They answer different questions.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;Ayanamsha is a fixed number.&quot; It increases by ~50.3 arcseconds per year. In 2000 it was ~23.85°; in 2026 it is ~24.22°. Software must compute the exact value for each date.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Cross-References</h4>
        <p className="text-text-secondary text-xs leading-relaxed">For how JD and T are computed, see <span className="text-gold-light">Module 22.1 (Julian Day)</span>. For the Moon&apos;s position (60 terms), see <span className="text-gold-light">Module 22.3 (Moon Longitude)</span>. For sunrise/sunset, see <span className="text-gold-light">Module 22.4 (Sunrise/Sunset)</span>. For rashi meaning, see <span className="text-gold-light">Module 4 (Rashis)</span>.</p>
      </section>

      <QuickCheck
        question="How many sine terms does the Meeus Equation of Center use for the Sun?"
        options={['1 term', '3 terms', '12 terms', '60+ terms']}
        correctIndex={1}
        explanation="The Sun's Equation of Center uses just 3 sine terms (1.915° sin M + 0.020° sin 2M + 0.000289° sin 3M). Earth's low orbital eccentricity means higher terms are negligible. The Moon, with its complex orbit, needs 60+ terms."
      />
    </div>
  );
}

export default function Module22_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}
