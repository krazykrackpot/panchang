'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_2_3', phase: 1, topic: 'Grahas', moduleNumber: '2.3',
  title: { en: 'Dignities — Where Planets Thrive & Suffer', hi: 'ग्रह गरिमा — ग्रह कहाँ फलते-फूलते और कहाँ कष्ट पाते हैं' },
  subtitle: { en: 'The 7-level hierarchy from Exaltation to Debilitation — and the miracle of Neecha Bhanga', hi: 'उच्च से नीच तक 7-स्तरीय पदानुक्रम — और नीच भंग का चमत्कार' },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: '2.2 Relationships', hi: '2.2 संबंध' }, href: '/learn/modules/2-2' },
    { label: { en: '2.4 Retrograde', hi: '2.4 वक्री' }, href: '/learn/modules/2-4' },
    { label: { en: 'Yogas (Neecha Bhanga)', hi: 'योग (नीच भंग)' }, href: '/learn/yogas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q2_3_01', type: 'mcq', question: { en: 'The correct dignity hierarchy from strongest to weakest is:', hi: 'सबसे बलवान से दुर्बल तक सही गरिमा क्रम है:' }, options: [{ en: 'Exalted > Own > Moolatrikona > Friend > Neutral > Enemy > Debilitated', hi: 'उच्च > स्व > मूलत्रिकोण > मित्र > सम > शत्रु > नीच' }, { en: 'Exalted > Moolatrikona > Own > Friend > Neutral > Enemy > Debilitated', hi: 'उच्च > मूलत्रिकोण > स्व > मित्र > सम > शत्रु > नीच' }, { en: 'Own > Exalted > Moolatrikona > Friend > Neutral > Enemy > Debilitated', hi: 'स्व > उच्च > मूलत्रिकोण > मित्र > सम > शत्रु > नीच' }, { en: 'Moolatrikona > Exalted > Own > Friend > Neutral > Enemy > Debilitated', hi: 'मूलत्रिकोण > उच्च > स्व > मित्र > सम > शत्रु > नीच' }], correctAnswer: 1, explanation: { en: 'The correct order: Exalted (उच्च) > Moolatrikona (मूलत्रिकोण) > Own Sign (स्वक्षेत्र) > Friend\'s Sign (मित्रक्षेत्र) > Neutral (समक्षेत्र) > Enemy\'s Sign (शत्रुक्षेत्र) > Debilitated (नीच). Moolatrikona is STRONGER than own sign — it\'s a special portion of the planet\'s own sign where it has extra power.', hi: 'सही क्रम: उच्च > मूलत्रिकोण > स्वक्षेत्र > मित्रक्षेत्र > समक्षेत्र > शत्रुक्षेत्र > नीच। मूलत्रिकोण स्वराशि से बलवान — ग्रह की अपनी राशि का विशेष भाग।' }, classicalRef: 'BPHS Ch.3 v.18-20' },
  { id: 'q2_3_02', type: 'mcq', question: { en: 'Sun is exalted in which sign, at what degree?', hi: 'सूर्य किस राशि में, कितने अंश पर उच्च है?' }, options: [{ en: 'Leo at 20°', hi: 'सिंह 20° पर' }, { en: 'Aries at 10°', hi: 'मेष 10° पर' }, { en: 'Cancer at 5°', hi: 'कर्क 5° पर' }, { en: 'Capricorn at 28°', hi: 'मकर 28° पर' }], correctAnswer: 1, explanation: { en: 'Sun is exalted in Aries at exactly 10°. This is its HIGHEST point of power — called the "deep exaltation degree" (Paramocha Amsha). At exactly 10° Aries, the Sun is at maximum strength. As it moves away from 10° (either direction), exaltation strength decreases proportionally.', hi: 'सूर्य मेष राशि में ठीक 10° पर उच्च है — "परमोच्च अंश"। इस बिंदु पर अधिकतम बल। 10° से दूर जाने पर उच्च बल आनुपातिक रूप से कम होता है।' }, classicalRef: 'BPHS Ch.3 v.18' },
  { id: 'q2_3_03', type: 'mcq', question: { en: 'Moon is debilitated in:', hi: 'चन्द्र नीच है:' }, options: [{ en: 'Taurus', hi: 'वृषभ' }, { en: 'Cancer', hi: 'कर्क' }, { en: 'Scorpio', hi: 'वृश्चिक' }, { en: 'Capricorn', hi: 'मकर' }], correctAnswer: 2, explanation: { en: 'Moon is debilitated in Scorpio at 3°. Debilitation is always in the sign exactly opposite (180°) from exaltation. Moon is exalted in Taurus (2nd sign) → debilitated in Scorpio (8th sign, 180° away). The 3° point mirrors the 3° exaltation degree in Taurus.', hi: 'चन्द्र वृश्चिक में 3° पर नीच। नीच हमेशा उच्च से ठीक 180° विपरीत (7वीं) राशि में। चन्द्र उच्च वृषभ → नीच वृश्चिक।' }, classicalRef: 'BPHS Ch.3 v.19' },
  { id: 'q2_3_04', type: 'true_false', question: { en: 'The exaltation sign and debilitation sign of a planet are always exactly 180° (7 signs) apart.', hi: 'ग्रह की उच्च और नीच राशि हमेशा ठीक 180° (7 राशि) दूर होती हैं।' }, correctAnswer: true, explanation: { en: 'Correct. This is a fundamental rule: Exaltation and debilitation signs are always directly opposite. Sun: Aries↔Libra, Moon: Taurus↔Scorpio, Mars: Capricorn↔Cancer, Mercury: Virgo↔Pisces, Jupiter: Cancer↔Capricorn, Venus: Pisces↔Virgo, Saturn: Libra↔Aries. Notice: Sun exalted in Aries = Saturn debilitated in Aries (and vice versa).', hi: 'सही। उच्च और नीच राशि हमेशा विपरीत। सूर्य: मेष↔तुला, चन्द्र: वृषभ↔वृश्चिक, मंगल: मकर↔कर्क...' }, classicalRef: 'BPHS Ch.3' },
  { id: 'q2_3_05', type: 'mcq', question: { en: 'What is Moolatrikona?', hi: 'मूलत्रिकोण क्या है?' }, options: [{ en: 'A type of yoga', hi: 'एक प्रकार का योग' }, { en: 'A special strong portion within a planet\'s own sign', hi: 'ग्रह की अपनी राशि का एक विशेष बलवान भाग' }, { en: 'Another name for exaltation', hi: 'उच्च का दूसरा नाम' }, { en: 'The sign opposite to debilitation', hi: 'नीच के विपरीत राशि' }], correctAnswer: 1, explanation: { en: 'Moolatrikona is a specific degree range within a planet\'s own sign where it\'s especially powerful — stronger than the rest of own sign, but weaker than exaltation. Example: Sun\'s moolatrikona is Leo 0°-20° (the first 20° of Leo). The remaining 20°-30° of Leo is "own sign" (Swakshetra) — strong but not moolatrikona level.', hi: 'मूलत्रिकोण ग्रह की अपनी राशि का विशिष्ट अंश-सीमा है जहां विशेष बल — स्वराशि से बलवान, उच्च से कम। उदा: सूर्य मूलत्रिकोण = सिंह 0°-20°।' }, classicalRef: 'BPHS Ch.3 v.20' },
  { id: 'q2_3_06', type: 'mcq', question: { en: 'Which of these is a condition for Neecha Bhanga (debilitation cancellation)?', hi: 'नीच भंग की शर्त कौन सी है?' }, options: [{ en: 'The debilitated planet is in a kendra', hi: 'नीच ग्रह केंद्र में हो' }, { en: 'The lord of the debilitation sign is in a kendra from Lagna or Moon', hi: 'नीच राशि का स्वामी लग्न या चंद्र से केंद्र में हो' }, { en: 'The planet is retrograde', hi: 'ग्रह वक्री हो' }, { en: 'All of the above', hi: 'उपरोक्त सभी' }], correctAnswer: 3, explanation: { en: 'All are valid Neecha Bhanga conditions! The 4 classical conditions (BPHS): (1) Lord of debilitation sign in kendra from Lagna or Moon, (2) Lord of the exaltation sign in kendra, (3) The debilitated planet itself is in a kendra, (4) The debilitated planet is retrograde. ANY one condition cancels the debilitation, transforming weakness into Neecha Bhanga RAJA Yoga — extraordinary strength from adversity.', hi: 'सभी मान्य नीच भंग शर्तें हैं! 4 शास्त्रीय शर्तें: (1) नीच राशि स्वामी केंद्र में, (2) उच्च राशि स्वामी केंद्र में, (3) नीच ग्रह स्वयं केंद्र में, (4) नीच ग्रह वक्री। कोई भी एक शर्त → नीच भंग राजयोग।' }, classicalRef: 'BPHS Ch.34 v.22' },
  { id: 'q2_3_07', type: 'mcq', question: { en: 'What is "Vargottama"?', hi: '"वर्गोत्तम" क्या है?' }, options: [{ en: 'A planet in its exaltation sign in both D1 and D9', hi: 'D1 और D9 दोनों में उच्च राशि में ग्रह' }, { en: 'A planet in the SAME sign in both D1 (Rashi) and D9 (Navamsha)', hi: 'D1 (राशि) और D9 (नवांश) दोनों में एक ही राशि में ग्रह' }, { en: 'A planet with the highest Shadbala', hi: 'सबसे अधिक षड्बल वाला ग्रह' }, { en: 'A planet aspected by Jupiter', hi: 'गुरु द्वारा दृष्ट ग्रह' }], correctAnswer: 1, explanation: { en: 'Vargottama (वर्ग = division + उत्तम = best) means a planet is in the SAME sign in both the Rashi chart (D1) and Navamsha chart (D9). This significantly strengthens the planet — it\'s "confirmed" in that sign across two charts. Happens when a planet is in the 1st pada of a movable sign, 5th pada of a fixed sign, or 9th pada of a dual sign.', hi: 'वर्गोत्तम = वर्ग (विभाग) + उत्तम (सर्वश्रेष्ठ)। D1 और D9 दोनों में एक ही राशि → ग्रह बहुत सशक्त। चर राशि का 1st पाद, स्थिर का 5th, द्विस्वभाव का 9th पाद में होता है।' } },
  { id: 'q2_3_08', type: 'mcq', question: { en: 'Jupiter is exalted in Cancer and debilitated in:', hi: 'गुरु कर्क में उच्च और नीच है:' }, options: [{ en: 'Aries', hi: 'मेष' }, { en: 'Virgo', hi: 'कन्या' }, { en: 'Capricorn', hi: 'मकर' }, { en: 'Pisces', hi: 'मीन' }], correctAnswer: 2, explanation: { en: 'Jupiter exalted in Cancer (4th sign) → debilitated in Capricorn (10th sign, 180° away). Jupiter at 5° Cancer = peak exaltation. Jupiter at 5° Capricorn = deepest debilitation. Note: Mars is EXALTED in Capricorn — showing that a sign can exalt one planet while debilitating another.', hi: 'गुरु उच्च कर्क (4th) → नीच मकर (10th, 180° दूर)। गुरु 5° कर्क = शिखर उच्च। ध्यान दें: मंगल मकर में उच्च — एक राशि एक ग्रह को उच्च और दूसरे को नीच कर सकती है।' }, classicalRef: 'BPHS Ch.3' },
  { id: 'q2_3_09', type: 'true_false', question: { en: 'A debilitated planet always gives bad results.', hi: 'नीच ग्रह हमेशा बुरे परिणाम देता है।' }, correctAnswer: false, explanation: { en: 'False! A debilitated planet can give EXTRAORDINARY results through Neecha Bhanga Raja Yoga. If the debilitation is cancelled (4 conditions), the planet transforms from its weakest to one of its strongest states. Like a leader who rises from the bottom — having overcome adversity, they achieve more than someone who started privileged. Many successful people have Neecha Bhanga yogas.', hi: 'गलत! नीच ग्रह नीच भंग राज योग से असाधारण परिणाम दे सकता है। यदि नीच रद्द हो → ग्रह सबसे दुर्बल से सबसे बलवान बनता है। जैसे नीचे से उठा नेता — विपरीत परिस्थितियों को पार कर अधिक प्राप्त करता है।' }, classicalRef: 'BPHS Ch.34' },
  { id: 'q2_3_10', type: 'mcq', question: { en: 'Saturn\'s moolatrikona is:', hi: 'शनि का मूलत्रिकोण है:' }, options: [{ en: 'Capricorn 0°-20°', hi: 'मकर 0°-20°' }, { en: 'Aquarius 0°-20°', hi: 'कुम्भ 0°-20°' }, { en: 'Libra 0°-20°', hi: 'तुला 0°-20°' }, { en: 'Pisces 0°-20°', hi: 'मीन 0°-20°' }], correctAnswer: 1, explanation: { en: 'Saturn\'s moolatrikona is Aquarius 0°-20°. Saturn owns both Capricorn and Aquarius, but Aquarius is its moolatrikona (the sign where it\'s more powerful). Capricorn is its regular own sign. This distinction matters for dignity assessment — Saturn at 10° Aquarius is stronger than at 10° Capricorn.', hi: 'शनि का मूलत्रिकोण कुम्भ 0°-20° है। शनि मकर और कुम्भ दोनों का स्वामी, लेकिन कुम्भ मूलत्रिकोण (अधिक बलवान)। शनि 10° कुम्भ > 10° मकर।' }, classicalRef: 'BPHS Ch.3 v.20' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 7-Level Dignity Hierarchy</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          A planet's <span className="text-gold-light font-bold">dignity</span> (गरिमा) describes how strong or weak it is based on the sign it occupies. Parashara uses a powerful metaphor in BPHS: <em>"A king in his own kingdom commands respect; a king in exile is powerless."</em> A planet in its exaltation sign is like a king on his throne. The same planet in its debilitation sign is like a king imprisoned in enemy territory.
        </p>

        {/* Dignity Tower */}
        <div className="glass-card rounded-xl p-4 border border-gold-primary/10 mb-4">
          <div className="space-y-2">
            {[
              { level: 1, name: { en: 'Exalted (Uchcha)', hi: 'उच्च' }, desc: 'Peak power — planet at its absolute strongest', color: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400', strength: '100%' },
              { level: 2, name: { en: 'Moolatrikona', hi: 'मूलत्रिकोण' }, desc: 'Special strong zone within own sign (0°-20° typically)', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', strength: '90%' },
              { level: 3, name: { en: 'Own Sign (Swakshetra)', hi: 'स्वक्षेत्र' }, desc: 'Planet in its own ruled sign — comfortable and effective', color: 'bg-blue-500/10 border-blue-500/20 text-blue-300', strength: '80%' },
              { level: 4, name: { en: "Friend's Sign (Mitrakshetra)", hi: 'मित्रक्षेत्र' }, desc: "Planet in a friendly planet's sign — supported", color: 'bg-blue-500/5 border-blue-500/15 text-blue-200', strength: '60%' },
              { level: 5, name: { en: 'Neutral Sign (Samakshetra)', hi: 'समक्षेत्र' }, desc: 'Planet in a neutral sign — average performance', color: 'bg-amber-500/5 border-amber-500/15 text-amber-300', strength: '50%' },
              { level: 6, name: { en: "Enemy's Sign (Shatrukshetra)", hi: 'शत्रुक्षेत्र' }, desc: "Planet in an enemy's sign — weakened, struggling", color: 'bg-red-500/5 border-red-500/15 text-red-300', strength: '25%' },
              { level: 7, name: { en: 'Debilitated (Neecha)', hi: 'नीच' }, desc: 'Weakest point — planet at its lowest expression', color: 'bg-red-500/10 border-red-500/25 text-red-400', strength: '5%' },
            ].map((d) => (
              <div key={d.level} className={`flex items-center gap-3 p-2.5 rounded-lg border ${d.color}`}>
                <span className={`text-lg font-black w-6 text-center ${d.color.split(' ')[2]}`}>{d.level}</span>
                <div className="flex-1">
                  <span className={`font-bold text-xs ${d.color.split(' ')[2]}`}>{d.name.en} <span className="font-normal text-text-tertiary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>({d.name.hi})</span></span>
                  <div className="text-text-secondary text-[10px]">{d.desc}</div>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">{d.strength}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          BPHS Ch.3 v.18-20 defines exaltation, debilitation, and moolatrikona for each planet. The term <span className="text-gold-light font-bold">Uchcha</span> (उच्च) means "high/elevated," <span className="text-gold-light font-bold">Neecha</span> (नीच) means "low/fallen," and <span className="text-gold-light font-bold">Moolatrikona</span> means "root triangle" — the foundational zone of power. Parashara explicitly states that a planet's exaltation and debilitation points are always 180° apart — this is not coincidence but cosmic symmetry.
        </p>
      </section>

      {/* Exaltation/Debilitation table */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Complete Exaltation & Debilitation Table</h3>
        <div className="overflow-x-auto glass-card rounded-xl p-4 border border-gold-primary/10">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Planet</th>
              <th className="text-left py-2 px-2 text-emerald-400">Exaltation Sign (Degree)</th>
              <th className="text-left py-2 px-2 text-red-400">Debilitation Sign (Degree)</th>
              <th className="text-left py-2 px-2 text-blue-300">Moolatrikona</th>
              <th className="text-left py-2 px-2 text-amber-300">Own Sign(s)</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Sun', ex: 'Aries (10°)', deb: 'Libra (10°)', mt: 'Leo 0°-20°', own: 'Leo' },
                { p: 'Moon', ex: 'Taurus (3°)', deb: 'Scorpio (3°)', mt: 'Taurus 4°-30°', own: 'Cancer' },
                { p: 'Mars', ex: 'Capricorn (28°)', deb: 'Cancer (28°)', mt: 'Aries 0°-12°', own: 'Aries, Scorpio' },
                { p: 'Mercury', ex: 'Virgo (15°)', deb: 'Pisces (15°)', mt: 'Virgo 16°-20°', own: 'Gemini, Virgo' },
                { p: 'Jupiter', ex: 'Cancer (5°)', deb: 'Capricorn (5°)', mt: 'Sagittarius 0°-10°', own: 'Sagittarius, Pisces' },
                { p: 'Venus', ex: 'Pisces (27°)', deb: 'Virgo (27°)', mt: 'Libra 0°-15°', own: 'Taurus, Libra' },
                { p: 'Saturn', ex: 'Libra (20°)', deb: 'Aries (20°)', mt: 'Aquarius 0°-20°', own: 'Capricorn, Aquarius' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-2 text-gold-light font-bold">{r.p}</td>
                  <td className="py-1.5 px-2 text-emerald-300">{r.ex}</td>
                  <td className="py-1.5 px-2 text-red-300">{r.deb}</td>
                  <td className="py-1.5 px-2 text-blue-200">{r.mt}</td>
                  <td className="py-1.5 px-2 text-amber-200">{r.own}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-text-tertiary text-[9px] mt-2">Note: Mercury is unique — exalted in its OWN sign (Virgo). Moolatrikona range is the narrow 16°-20° zone within Virgo.</p>
        </div>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Neecha Bhanga Raja Yoga — The Phoenix Principle</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          One of the most powerful principles in Jyotish: a <span className="text-gold-light font-bold">debilitated planet whose debilitation is cancelled</span> doesn't just become normal — it becomes <span className="text-gold-light font-bold">extraordinarily strong</span>. This is called <span className="text-gold-light">Neecha Bhanga Raja Yoga</span> (नीच भंग राज योग) — literally "debilitation-breaking royal yoga."
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The metaphor is a <span className="text-gold-light">phoenix</span> — rising from the ashes of adversity to achieve greatness. Or a leader who comes from poverty and, having overcome every obstacle, leads with greater strength than someone born into privilege. Many highly successful people have Neecha Bhanga yogas in their charts.
        </p>

        <div className="glass-card rounded-xl p-4 border border-emerald-500/15 mb-4">
          <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-2">The 4 Classical Cancellation Conditions (BPHS Ch.34 v.22)</h4>
          <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
            <p><span className="text-emerald-300 font-bold">Condition 1:</span> The lord of the DEBILITATION sign is in a kendra (1/4/7/10) from Lagna or Moon. <span className="text-text-tertiary">(Example: Moon debilitated in Scorpio → Mars (Scorpio's lord) in kendra from Lagna)</span></p>
            <p><span className="text-emerald-300 font-bold">Condition 2:</span> The lord of the EXALTATION sign of the debilitated planet is in a kendra. <span className="text-text-tertiary">(Example: Moon debilitated → Venus (lord of Taurus, Moon's exaltation sign) in kendra)</span></p>
            <p><span className="text-emerald-300 font-bold">Condition 3:</span> The debilitated planet ITSELF is in a kendra from Lagna. <span className="text-text-tertiary">(Debilitated planet in 1st, 4th, 7th, or 10th house)</span></p>
            <p><span className="text-emerald-300 font-bold">Condition 4:</span> The debilitated planet is RETROGRADE (Vakri). <span className="text-text-tertiary">(Retrograde adds internal intensity that overcomes the weakness)</span></p>
          </div>
          <p className="text-gold-light text-xs font-medium mt-3">ANY ONE of these 4 conditions is sufficient for cancellation → Neecha Bhanga Raja Yoga.</p>
        </div>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vargottama — Double Confirmation</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Vargottama</span> (वर्गोत्तम = वर्ग + उत्तम = "best division") is when a planet occupies the <span className="text-gold-light">same sign in both the D1 (Rashi) and D9 (Navamsha)</span> charts. This "double confirmation" significantly strengthens the planet — it's genuinely in that sign at both the gross and subtle levels.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          When does Vargottama happen? Each sign has 9 navamshas (3°20' each). The FIRST navamsha of movable signs, the MIDDLE (5th) of fixed signs, and the LAST (9th) of dual signs map back to the same sign. So Vargottama occurs in: Aries 0°-3°20', Taurus 13°20'-16°40', Gemini 26°40'-30°, Cancer 0°-3°20', etc.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Example: Complete Dignity Assessment</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> Jupiter at 8° Capricorn in a chart where Mars is in the 7th house from Lagna.
        </p>
        <div className="font-mono text-xs text-text-secondary space-y-1">
          <div>1. Jupiter's sign: Capricorn → Jupiter is <span className="text-red-400 font-bold">DEBILITATED</span> (peak debilitation at 5°)</div>
          <div>2. Check Neecha Bhanga conditions:</div>
          <div>   - Lord of Capricorn = Saturn → Is Saturn in kendra? <span className="text-text-tertiary">(check chart)</span></div>
          <div>   - Lord of Cancer (Jupiter's exaltation) = Moon → Is Moon in kendra? <span className="text-text-tertiary">(check chart)</span></div>
          <div>   - Jupiter itself in kendra? <span className="text-text-tertiary">(check which house Capricorn falls in)</span></div>
          <div>   - Jupiter retrograde? <span className="text-text-tertiary">(check if speed is negative)</span></div>
          <div>3. If ANY condition is met → <span className="text-emerald-400 font-bold">Neecha Bhanga Raja Yoga!</span></div>
          <div>4. Jupiter's karakatvas (children, wisdom, dharma) initially suffer but ultimately flourish through adversity.</div>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "A debilitated planet is always harmful."<br />
          <span className="text-emerald-300">Reality:</span> With Neecha Bhanga, a debilitated planet can produce GREATER success than an exalted one. Abraham Lincoln, Steve Jobs, and many leaders had Neecha Bhanga yogas.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Moolatrikona is the same as own sign."<br />
          <span className="text-emerald-300">Reality:</span> Moolatrikona is STRONGER than own sign. It's a specific degree range (e.g., Sun: Leo 0°-20° is moolatrikona, Leo 20°-30° is regular own sign). This distinction affects Shadbala calculation.</p>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-blue-300 font-bold">Fully used in all Jyotish software.</span> Our app computes dignity for every planet in every chart — it's the foundation of Shadbala (Sthana Bala component), Vimshopaka Bala, and chart strength assessment. The Neecha Bhanga detection is part of our 55+ yoga engine. The exaltation/debilitation degrees are from BPHS — unchanged in 1,000+ years.
        </p>
      </section>
    </div>
  );
}

export default function Module2_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}
