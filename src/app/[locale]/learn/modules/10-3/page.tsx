'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/10-3.json';

const META: ModuleMeta = {
  id: 'mod_10_3', phase: 3, topic: 'Vargas', moduleNumber: '10.3',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 17,
  crossRefs: L.crossRefs.map(cr => ({ label: cr.label as unknown as Record<string, string>, href: cr.href })),
};

const QUESTIONS = (L.questions as unknown) as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Dasamsha (D10) — The Career Chart
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Dasamsha is the divisional chart dedicated entirely to <span className="text-gold-light font-medium">career, profession, and public standing</span>. While the 10th house of D1 gives a general picture of one's karma-sthana (house of action), the D10 provides the magnified, detailed view — the specific nature of the profession, career trajectory, peaks and valleys, and professional reputation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Construction:</span> Each sign is divided into 10 equal parts of 3° each. The starting point depends on whether the sign is odd or even:
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
              <span className="text-gold-light font-bold text-xs">Odd Signs (विषम राशियाँ)</span>
              <p className="text-text-secondary/70 text-xs mt-1">Aries, Gemini, Leo, Libra, Sagittarius, Aquarius</p>
              <p className="text-emerald-400 text-xs mt-1">Count from the same sign</p>
            </div>
            <div className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
              <span className="text-gold-light font-bold text-xs">Even Signs (सम राशियाँ)</span>
              <p className="text-text-secondary/70 text-xs mt-1">Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces</p>
              <p className="text-emerald-400 text-xs mt-1">Count from the 9th sign</p>
            </div>
          </div>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Example:</span> A planet at 17° Leo. Leo is odd, so we count from Leo. 17 ÷ 3 = 5.67, so the planet is in the 6th D10 division. Counting from Leo: Leo(1), Virgo(2), Libra(3), Scorpio(4), Sagittarius(5), <span className="text-gold-light font-medium">Capricorn(6)</span>. The planet sits in Capricorn in D10 — structured, authority-oriented, corporate career energy. If this were the D10 Lagna, it would suggest a career in management, government, or structured organizations.
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरण कुण्डली' }, locale)} />
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Reading the D10 Career Chart</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">D10 Lagna sign:</span> Shows the overall professional orientation — Aries D10 Lagna indicates pioneering/entrepreneurial careers; Taurus suggests banking/luxury/agriculture; Gemini points to communication/media/writing.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">10th house of D10:</span> The most powerful indicator of career nature. Planets here dominate the professional expression. Sun here gives government/authority; Moon gives public-facing/nurturing roles; Mars gives engineering/military/surgery; Mercury gives commerce/IT/communication.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">D10 10th lord placement:</span> Shows WHERE the career energy flows. In the 1st house — self-made career. In the 7th — partnerships/consulting. In the 11th — networking/gains-oriented work. In the 12th — foreign lands, research, or behind-the-scenes work.
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
          Saptamsha (D7) — The Chart of Children
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Saptamsha divides each sign into <span className="text-gold-light font-medium">7 equal parts of approximately 4°17'</span> each (precisely 4°17'8.57"). This chart is dedicated to <span className="text-gold-light font-medium">children, progeny, and creative output</span>. Just as D9 is indispensable for marriage and D10 for career, the D7 is the definitive chart for all questions about offspring.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Construction rules:</span> For odd signs (Aries, Gemini, Leo, etc.), the Saptamsha count begins from the same sign. For even signs (Taurus, Cancer, Virgo, etc.), it begins from the 7th sign. So the first D7 division of Aries (0°-4°17') maps to Aries, while the first D7 division of Taurus maps to Scorpio (the 7th from Taurus).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Key houses:</span> The 5th house of D7 represents the first child. The 7th house shows the second child, the 9th the third — each subsequent child is seen from the 3rd house of the previous (since the 3rd is "next sibling" from any reference point). Jupiter's overall strength in D7 is the single most important factor for progeny — as the Putra Karaka (significator of children), a strong Jupiter in D7 blesses with healthy, well-timed offspring.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Jupiter in D7 — The Decisive Factor</h4>
        <div className="space-y-2">
          {[
            { status: 'Jupiter exalted/own sign in D7', statusHi: 'D7 में बृहस्पति उच्च/स्वगृही', result: 'Strong fertility, timely childbirth, happiness from children', resultHi: 'प्रबल प्रजनन क्षमता, समय पर सन्तान, सन्तान से सुख' },
            { status: 'Jupiter in kendra of D7', statusHi: 'D7 के केन्द्र में बृहस्पति', result: 'Children play a central role in life; supportive parent-child bond', resultHi: 'सन्तान जीवन में केन्द्रीय भूमिका; सहयोगी अभिभावक-सन्तान बन्धन' },
            { status: 'Jupiter debilitated in D7', statusHi: 'D7 में बृहस्पति नीच का', result: 'Delays, difficulty conceiving, or strained relationship with children', resultHi: 'विलम्ब, गर्भधारण में कठिनाई, या सन्तान से तनावपूर्ण सम्बन्ध' },
            { status: 'Jupiter in 6/8/12 of D7', statusHi: 'D7 के 6/8/12 में बृहस्पति', result: 'Obstacles to progeny; medical intervention may be needed; children may live at distance', resultHi: 'सन्तान में बाधाएँ; चिकित्सकीय हस्तक्षेप आवश्यक; सन्तान दूर रह सकती है' },
          ].map((item, i) => (
            <div key={i} className="bg-bg-primary/40 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-gold-light text-xs font-medium">{isHi ? item.statusHi : item.status}</span>
              <p className="text-text-secondary/70 text-xs mt-0.5">{isHi ? item.resultHi : item.result}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Childbirth Timing with D7</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The Dasha of the 5th lord of D7, Jupiter's dasha periods, or the dasha of planets occupying the 5th house of D7 are prime periods for childbirth. When the same planet is simultaneously the 5th lord in D1 and well-placed in D7, the indication becomes very strong.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Transit confirmation:</span> Jupiter transiting over the 5th house of D7 or D1, or over the Saptamsha 5th lord, often provides the final trigger for conception and birth. The convergence of dasha and transit signals is what gives timing precision.
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
          Dwadashamsha (D12) — The Chart of Parents
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Dwadashamsha divides each sign into <span className="text-gold-light font-medium">12 equal parts of 2°30'</span> each. Uniquely among the common vargas, the D12 count always starts from the sign itself regardless of odd/even classification. The first D12 division of Aries maps to Aries, the second to Taurus, and the 12th to Pisces — it cycles through the entire zodiac within each sign.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The D12 chart is dedicated to <span className="text-gold-light font-medium">parents, ancestry, and inherited karma</span>. The 4th house of D12 represents the mother — her health, her relationship with the native, and the karmic bond. The 9th house represents the father. Afflictions to these houses in D12 can indicate parental health issues, strained relationships, or early separation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Inherited karma:</span> D12 goes beyond just describing parents — it reveals the karmic patterns inherited through the lineage. Benefic planets in the 4th and 9th of D12 suggest ancestral blessings flowing to the native. Malefics or afflicted lords indicate karmic debts that the native carries from the family line. This is why D12 is consulted in remedial astrology when ancestral issues (pitru dosha) are suspected.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Reading the D12 — Parents and Lineage</h4>
        <div className="space-y-2">
          {[
            { house: '4th House (Mother)', houseHi: 'चतुर्थ भाव (माता)', desc: 'Sign, planets in 4th, and 4th lord placement describe mother\'s nature, health, and the emotional bond', descHi: 'राशि, चतुर्थ में ग्रह और चतुर्थेश की स्थिति माता के स्वभाव, स्वास्थ्य और भावनात्मक बन्धन का वर्णन करते हैं' },
            { house: '9th House (Father)', houseHi: 'नवम भाव (पिता)', desc: 'Sign, planets in 9th, and 9th lord placement describe father\'s character, fortune, and guidance role', descHi: 'राशि, नवम में ग्रह और नवमेश की स्थिति पिता के चरित्र, भाग्य और मार्गदर्शक भूमिका का वर्णन करते हैं' },
            { house: '1st House (Self)', houseHi: 'प्रथम भाव (स्वयं)', desc: 'The native\'s own inherited constitution and how ancestral patterns express through them', descHi: 'जातक का विरासत में मिला संविधान और पैतृक प्रतिरूप उनके माध्यम से कैसे अभिव्यक्त होते हैं' },
            { house: '10th House (Legacy)', houseHi: 'दशम भाव (विरासत)', desc: 'What the native does with inherited karma — continuation, transformation, or transcendence of family patterns', descHi: 'विरासत में मिले कर्म से जातक क्या करता है — पारिवारिक प्रतिरूपों की निरन्तरता, रूपान्तरण या पारगमन' },
          ].map((item, i) => (
            <div key={i} className="bg-bg-primary/40 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-gold-light text-xs font-medium">{isHi ? item.houseHi : item.house}</span>
              <p className="text-text-secondary/70 text-xs mt-0.5">{isHi ? item.descHi : item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Timing Parental Events</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The Dasha of the D12 4th lord or planets aspecting/occupying the 4th house often coincides with significant maternal events — health concerns, relocation, or deepening of the bond. Similarly, the 9th lord's dasha period activates paternal themes. When maraka (death-inflicting) planets of D12 are simultaneously activated in D1 dasha, they can indicate serious parental health crises.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Practical note:</span> D12 is not just about difficulties — it equally reveals the gifts flowing from parents. A strong 9th house in D12 with Jupiter's aspect may indicate inheriting the father's wisdom, reputation, or spiritual merit. A strong 4th with Moon well-placed may indicate deep maternal nurturing that shapes the native's emotional foundation for life.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara in BPHS (Chapters 6-7) provides the mathematical rules for all three vargas covered here. He emphasizes that the D10 should be consulted for all questions about profession and status, D7 for children and creative output, and D12 for parents and lineage. Mantreshwara and Varahamihira concur, adding that these vargas should not be read in isolation — the D1 provides the foundation, and each varga deepens a specific dimension of the same fundamental chart.
        </p>
      </section>
    </div>
  );
}

export default function Module10_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

