'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/10-2.json';

const META: ModuleMeta = {
  id: 'mod_10_2', phase: 3, topic: 'Vargas', moduleNumber: '10.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 18,
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
          Navamsha Calculation — The Mathematics
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Navamsha divides each 30-degree sign into <span className="text-gold-light font-medium">9 equal parts of 3°20'</span> (3 degrees and 20 minutes of arc). The crucial rule is which sign the first Navamsha maps to — this depends on the element of the rashi:
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { element: 'Fire', elementHi: 'अग्नि', signs: 'Aries, Leo, Sagittarius', signsHi: 'मेष, सिंह, धनु', start: 'Aries', startHi: 'मेष' },
              { element: 'Earth', elementHi: 'पृथ्वी', signs: 'Taurus, Virgo, Capricorn', signsHi: 'वृषभ, कन्या, मकर', start: 'Capricorn', startHi: 'मकर' },
              { element: 'Air', elementHi: 'वायु', signs: 'Gemini, Libra, Aquarius', signsHi: 'मिथुन, तुला, कुम्भ', start: 'Libra', startHi: 'तुला' },
              { element: 'Water', elementHi: 'जल', signs: 'Cancer, Scorpio, Pisces', signsHi: 'कर्क, वृश्चिक, मीन', start: 'Cancer', startHi: 'कर्क' },
            ].map(e => (
              <div key={e.element} className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
                <span className="text-gold-light font-bold text-xs">{isHi ? e.elementHi : e.element}</span>
                <p className="text-text-secondary/70 text-xs mt-1">{isHi ? e.signsHi : e.signs}</p>
                <p className="text-emerald-400 text-xs mt-1">{isHi ? `${e.startHi} से आरम्भ` : `Starts from: ${e.start}`}</p>
              </div>
            ))}
          </div>
        </div>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Worked Example:</span> A planet at 15° Aries. Aries is a fire sign, so Navamsha counting starts from Aries. Divide 15 by 3.333 (which is 3°20' in decimal): 15 ÷ 3.333 = 4.5. Take the ceiling: this is the 5th Navamsha. Counting from Aries: Aries(1), Taurus(2), Gemini(3), Cancer(4), <span className="text-gold-light font-medium">Leo(5)</span>. The planet is in Leo Navamsha — it takes on the inner qualities of Leo: pride, creativity, leadership from within.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Quick-Reference: 108 Navamshas</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          12 signs times 9 divisions = 108 total Navamshas. This sacred number (108) is not coincidental — it connects to the 108 beads of a japa mala, the 108 Upanishads, and reflects the completeness of the zodiacal-divisional framework. Each of the 108 Navamshas has a unique quality determined by the combination of rashi sign and Navamsha sign.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Navamsha cycle completes every 4 signs. Aries starts from Aries and ends at Pisces (9 Navamshas). Taurus starts from Capricorn and ends at Scorpio. By the time you reach Cancer (4th sign), the Navamsha is back at Cancer — and the cycle of 4 signs (one per element) repeats. This elegant mathematical structure ensures every Navamsha sign appears exactly 12 times across the zodiac.
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
          Navamsha and Marriage
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The D9 chart is the single most important reference for marriage predictions. Classical texts are unambiguous: <span className="text-gold-light font-medium">the Navamsha is consulted for EVERY marriage-related question</span> — spouse qualities, timing of marriage, marital happiness, and potential for separation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">The 7th house of D9</span> describes the spouse's essential nature. The sign on the 7th cusp gives basic temperament. Planets in the 7th modify this — benefics (Jupiter, Venus, well-placed Moon) indicate a harmonious, supportive partner; malefics (Saturn, Mars, Rahu) suggest challenges, delays, or a partner with a strong/difficult personality. The 7th lord's placement shows where the spouse's primary focus lies.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Venus in D9</span> is especially telling. As the natural karaka of marriage, Venus's Navamsha sign reveals the romantic nature at the deepest level. Venus in a water-sign Navamsha (Cancer, Scorpio, Pisces) indicates deep emotional bonds; in air signs (Gemini, Libra, Aquarius), intellectual companionship matters most; in fire signs (Aries, Leo, Sagittarius), passion and adventure drive relationships; in earth signs (Taurus, Virgo, Capricorn), stability and material security are valued.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Navamsha Lagna Lord — The Key to Marital Happiness</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The lord of the Navamsha Lagna represents the native within the context of partnerships. Its placement tells the story of marital satisfaction:
        </p>
        <div className="space-y-1.5 mt-2">
          {[
            { placement: 'In kendra (1, 4, 7, 10)', placementHi: 'केन्द्र में (1, 4, 7, 10)', result: 'Strong marital foundation, active partnership', resultHi: 'सुदृढ़ वैवाहिक आधार, सक्रिय साझेदारी' },
            { placement: 'In trikona (1, 5, 9)', placementHi: 'त्रिकोण में (1, 5, 9)', result: 'Dharmic alignment with partner, shared values', resultHi: 'साथी के साथ धार्मिक सामंजस्य, साझा मूल्य' },
            { placement: 'In dusthana (6, 8, 12)', placementHi: 'दुःस्थान में (6, 8, 12)', result: 'Challenges — conflict (6th), secrecy/crisis (8th), loss/distance (12th)', resultHi: 'चुनौतियाँ — विवाद (6), गोपनीयता/संकट (8), हानि/दूरी (12)' },
            { placement: 'In own/exalted sign', placementHi: 'स्वगृह/उच्च राशि में', result: 'Self-assured in relationships, natural harmony', resultHi: 'सम्बन्धों में आत्मविश्वासी, स्वाभाविक सौहार्द' },
          ].map((item, i) => (
            <div key={i} className="bg-bg-primary/40 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-gold-light text-xs font-medium">{isHi ? item.placementHi : item.placement}</span>
              <span className="text-text-secondary/70 text-xs ml-2">→ {isHi ? item.resultHi : item.result}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Marriage Timing with D9</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Marriage typically occurs during the Dasha or Antardasha of planets connected to the D9's 7th house — its lord, occupants, or planets aspecting it. When the D1 dasha lord also activates the D9's marriage significators, the probability of marriage is very high.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example:</span> If Jupiter is the 7th lord of D9 and the native is running Jupiter Mahadasha or Jupiter Antardasha, marriage is strongly indicated — especially if transiting Jupiter also aspects the 7th house of D1 or D9 simultaneously.
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
          Vargottama Planets and Pushkara Degrees
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Vargottama</span> — a planet in the same sign in both D1 and D9 — is one of the most valued conditions in Jyotish. It means the planet's outer expression (rashi) and inner nature (Navamsha) are perfectly harmonized. The planet acts with authenticity and integrated strength.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Vargottama occurs in specific degree ranges that depend on the sign's modality:
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Vargottama Degree Ranges</h4>
        <div className="space-y-2">
          {[
            { type: 'Cardinal Signs', typeHi: 'चर राशियाँ', signs: 'Aries, Cancer, Libra, Capricorn', signsHi: 'मेष, कर्क, तुला, मकर', range: '0°00\' — 3°20\'', note: 'First Navamsha = same sign' },
            { type: 'Fixed Signs', typeHi: 'स्थिर राशियाँ', signs: 'Taurus, Leo, Scorpio, Aquarius', signsHi: 'वृषभ, सिंह, वृश्चिक, कुम्भ', range: '13°20\' — 16°40\'', note: '5th Navamsha = same sign' },
            { type: 'Dual Signs', typeHi: 'द्विस्वभाव राशियाँ', signs: 'Gemini, Virgo, Sagittarius, Pisces', signsHi: 'मिथुन, कन्या, धनु, मीन', range: '26°40\' — 30°00\'', note: '9th Navamsha = same sign' },
          ].map(item => (
            <div key={item.type} className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-gold-light font-bold text-xs">{isHi ? item.typeHi : item.type}</span>
                <span className="text-emerald-400 font-mono text-xs">{item.range}</span>
              </div>
              <p className="text-text-secondary/70 text-xs mt-1">{isHi ? item.signsHi : item.signs}</p>
              <p className="text-text-secondary/70 text-xs mt-0.5">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Pushkara Navamsha — The Nourishing Degrees</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Certain Navamsha positions are called <span className="text-gold-light font-medium">Pushkara</span> (nourishing). These are specific degree ranges in each sign where the resulting Navamsha falls in a sign ruled by a natural benefic (Jupiter, Venus, Moon, or Mercury). A planet in Pushkara Navamsha gets an inherent boost — like planting a seed in the most fertile soil.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The Pushkara Navamshas are especially valued in Muhurta (electional astrology) — starting an important event when the Moon or Lagna is in a Pushkara Navamsha degree is considered highly auspicious. They are also meaningful in Prashna (horary astrology) as indicators of favorable outcomes.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Note on Pushkara Bhaga:</span> Related but distinct from Pushkara Navamsha are Pushkara Bhagas — specific individual degrees (one per sign) that are considered supremely auspicious. These are even more precise and powerful, often used in electional timing for critical events like marriages and temple consecrations.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara dedicates extensive chapters in BPHS to the Navamsha, stating it is the most important varga for assessing planetary strength and marital destiny. Mantreshwara in Phaladeepika (Chapter 15) elaborates on reading the D9 for spouse characteristics. Varahamihira in Brihat Jataka uses the Navamsha extensively for determining the true functional nature of planets. The unanimous classical consensus: no chart reading is complete without the Navamsha.
        </p>
      </section>
    </div>
  );
}

export default function Module10_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

