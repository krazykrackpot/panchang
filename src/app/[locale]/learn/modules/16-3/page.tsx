'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/16-3.json';

const META: ModuleMeta = {
  id: 'mod_16_3', phase: 5, topic: 'Classical', moduleNumber: '16.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 16,
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
          Surya Siddhanta — The Astronomical Foundation
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Surya Siddhanta is the oldest surviving complete astronomical text of India, dating in its current form to roughly the 4th-5th century CE (though it claims divine origin and its core methods may be much older). Unlike BPHS and Phaladeepika which focus on interpretation, the Surya Siddhanta is pure astronomy — it tells you WHERE planets are, not what their positions MEAN.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The text provides mean motions for all visible planets, epicyclic corrections (manda and shighra) to convert mean positions to true positions, methods for computing eclipses, and a sophisticated time-measurement system. Its sidereal year of 365.2587565 days differs from the modern value (365.25636 days) by only 1.4 seconds per year.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Aryabhata (499 CE) refined the Surya Siddhanta&rsquo;s methods in his Aryabhatiya. He proposed that the Earth rotates on its axis (over a millennium before Copernicus), improved sine tables to 24 values at 3.75-degree intervals, and refined the planetary parameters. Later astronomers like Brahmagupta (628 CE) and Bhaskara II (1150 CE) continued this tradition of precision refinement.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Epicyclic Theory — Manda and Shighra</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Planets do not move at constant speed in circular orbits. The Surya Siddhanta accounts for this with two corrections: the Manda (slow) correction handles the equation of center (the planet speeds up at perihelion and slows at aphelion). The Shighra (fast) correction converts heliocentric longitude to geocentric — explaining retrograde motion. Together, these two epicycles reproduce observed planetary positions with about 1-degree accuracy for most planets.
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
          Mathematical Legacy — From Jya to Sine
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Indian mathematicians developed the sine function (jya), cosine (kotijya), and versine (utkramajya) for astronomical computation. The Surya Siddhanta provides a sine table with 24 values at 3.75-degree intervals. Aryabhata compressed this into an elegant verse using an alphabetic numeral system. Bhaskara I (7th century) provided a rational approximation for sine that is accurate to about 1.9% maximum error.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The word &ldquo;sine&rdquo; itself is a remarkable linguistic fossil. Sanskrit &ldquo;jya&rdquo; (bowstring) was transliterated into Arabic as &ldquo;jiba.&rdquo; When Latin translators encountered this, they misread the Arabic consonantal script as &ldquo;jaib&rdquo; (meaning fold or bay) and translated it as &ldquo;sinus&rdquo; — which became English &ldquo;sine.&rdquo; Every time a student writes &ldquo;sin(x),&rdquo; they are using an Indian mathematical invention.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Beyond trigonometry, Indian astronomical tradition contributed iterative methods for solving transcendental equations (used in computing true planetary positions), spherical geometry for coordinate transformations (horizontal to ecliptic), and sophisticated calendar systems that tracked multiple astronomical cycles simultaneously.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Computing Without Telescopes</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          How did Indian astronomers achieve sub-degree accuracy without optical instruments? Through sustained observation programs spanning centuries, mathematical curve-fitting to naked-eye data, and progressive refinement of parameters. Each generation of astronomers recorded planetary positions against star fields, compared them to predictions, and adjusted the constants. This is essentially the same method modern science uses — just with less precise measuring instruments and more patience.
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
          Accuracy Comparison — Ancient to Modern
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The progression of astronomical accuracy tells a compelling story. The Surya Siddhanta achieves roughly 0.1-degree accuracy for the Sun and 1-degree for the Moon. Meeus algorithms achieve approximately 0.01-degree Sun and 0.3-degree Moon. The Swiss Ephemeris (what our app uses by default) achieves sub-arcsecond precision by fitting to JPL numerical integrations, with Meeus as a fallback. And JPL DE440 itself is accurate to milliarcseconds, calibrated by radar ranging and spacecraft tracking.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For Panchang purposes, the critical question is: does the accuracy matter? A tithi spans 12 degrees of Moon-Sun elongation. A nakshatra spans 13.33 degrees. Even the Surya Siddhanta&rsquo;s 1-degree Moon error would cause at most a 2-hour error in tithi transition time. Our Meeus-level accuracy reduces this to about 40 minutes — comparable to leading Panchang services.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Accuracy Table</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Surya Siddhanta:</span> Sun ~0.1 degree | Moon ~1 degree | Mars ~2-3 degrees</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Meeus (fallback):</span> Sun ~0.01 degree | Moon ~0.3 degree | Mars ~0.5 degree</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Swiss Ephemeris (our app default):</span> All planets &lt; 0.001 degree (sub-arcsecond)</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">JPL DE440:</span> All planets ~0.000001 degree (milliarcsecond)</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">When Higher Accuracy Matters</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          For basic Panchang (tithi, nakshatra, yoga, karana), Meeus is more than sufficient. But for precise Kundali lagna calculation (which changes sign every ~2 hours), higher accuracy matters — which is why our app uses Swiss Ephemeris by default. For divisional charts (D-9, D-12) where 1 degree can change the sign, Swiss Ephemeris sub-arcsecond precision is essential. Meeus serves as the fallback when Swiss Ephemeris is unavailable (e.g., client-side computation).
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">The Unbroken Lineage</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our app&rsquo;s Meeus algorithms are the intellectual descendants of the Surya Siddhanta. The same fundamental approach — compute mean position, apply periodic corrections, convert to geocentric coordinates — runs through the entire lineage. What changed is the number and precision of correction terms. The Surya Siddhanta uses one epicycle per planet; Meeus uses dozens of Fourier terms. But the architecture is recognizably the same. When you check today&rsquo;s Panchang in our app, you are using a computational tradition that is at least 1,500 years old.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example — Computing Sun&rsquo;s Position</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Surya Siddhanta method:</span> Start with the mean longitude of the Sun (mean daily motion x days since epoch). Apply the Manda correction using the Sun&rsquo;s apogee (mandocca) — this accounts for the elliptical orbit. The result is the true geocentric longitude of the Sun in the sidereal zodiac. Error: about 0.1 degrees.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Meeus method (our app):</span> Start with the mean longitude using refined constants. Apply ~30 periodic correction terms (Fourier series), each representing a gravitational perturbation. Apply aberration and nutation corrections. Subtract ayanamsha for sidereal position. Error: about 0.01 degrees — a 10x improvement, but the same architecture.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Practical impact:</span> For Panchang (tithi spans 12 degrees), even Surya Siddhanta accuracy is adequate. For Kundali (lagna changes every ~2 hours), Meeus precision matters. For divisional charts (D-9 spans 3.33 degrees), sub-arcsecond Swiss Ephemeris precision is essential.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Ancient astronomers had no idea of heliocentric orbits.&rdquo; Reality: the Shighra correction in Surya Siddhanta is mathematically equivalent to converting from heliocentric to geocentric coordinates. They described the phenomenon correctly without naming it.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &ldquo;Modern software makes learning the math unnecessary.&rdquo; Reality: understanding the algorithm lets you verify software output, detect bugs, and appreciate the precision limits. See Module 16.1 for BPHS and Module 16.2 for the interpretive texts that use these positions.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &ldquo;More precision always means better astrology.&rdquo; Reality: a sub-arcsecond Moon position is meaningless if the birth time is uncertain by 15 minutes. The weakest link in the chain is always the input data, not the astronomical computation.</p>
      </section>
    </div>
  );
}

export default function Module16_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
