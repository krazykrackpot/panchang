'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_2_2', phase: 1, topic: 'Grahas', moduleNumber: '2.2',
  title: { en: 'Planetary Relationships — The Friendship Matrix', hi: 'ग्रह संबंध — मित्रता सारणी' },
  subtitle: { en: 'Natural friends, enemies, neutrals — and how temporary friendship changes everything', hi: 'नैसर्गिक मित्र, शत्रु, सम — और तात्कालिक मित्रता कैसे सब बदलती है' },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: '2.1 Nine Grahas', hi: '2.1 नवग्रह' }, href: '/learn/modules/2-1' },
    { label: { en: '2.3 Dignities', hi: '2.3 गरिमाएं' }, href: '/learn/modules/2-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q2_2_01', type: 'mcq', question: { en: 'How does Parashara derive natural planetary friendships (BPHS Ch.3)?', hi: 'पाराशर नैसर्गिक ग्रह मित्रता कैसे निकालते हैं (BPHS अ.3)?' }, options: [{ en: 'Based on mythology', hi: 'पुराण कथाओं पर आधारित' }, { en: 'Lords of the 2nd, 4th, 5th, 8th, 9th, 12th signs from moolatrikona = friends', hi: 'मूलत्रिकोण से 2, 4, 5, 8, 9, 12वीं राशि स्वामी = मित्र' }, { en: 'Based on proximity in the sky', hi: 'आकाश में निकटता पर आधारित' }, { en: 'Random assignment', hi: 'यादृच्छिक' }], correctAnswer: 1, explanation: { en: 'Parashara\'s method: From a planet\'s Moolatrikona sign, count the lords of the 2nd, 4th, 5th, 8th, 9th, and 12th signs. Those lords are its natural friends. Lords of the remaining signs (3rd, 6th, 7th, 10th, 11th) that are NOT friends are enemies. Those neither friend nor enemy are neutral. This is a mathematical derivation, not arbitrary.', hi: 'पाराशर विधि: ग्रह के मूलत्रिकोण से 2, 4, 5, 8, 9, 12वीं राशि स्वामी = मित्र। शेष (3, 6, 7, 10, 11) जो मित्र नहीं = शत्रु। न मित्र न शत्रु = सम।' }, classicalRef: 'BPHS Ch.3 v.55' },
  { id: 'q2_2_02', type: 'mcq', question: { en: 'Sun and Saturn are:', hi: 'सूर्य और शनि हैं:' }, options: [{ en: 'Natural friends', hi: 'नैसर्गिक मित्र' }, { en: 'Natural enemies', hi: 'नैसर्गिक शत्रु' }, { en: 'Neutral', hi: 'सम' }, { en: 'It depends on the chart', hi: 'कुण्डली पर निर्भर' }], correctAnswer: 1, explanation: { en: 'Sun and Saturn are natural enemies. Mythologically, Saturn (Shani) is the Sun\'s son but was rejected at birth due to his dark appearance — creating eternal enmity. Astronomically, their natures are opposite: Sun = authority/ego, Saturn = democracy/humility. When they conjunct or aspect in a chart, this tension manifests as father-son conflicts, authority vs rebellion dynamics.', hi: 'सूर्य और शनि नैसर्गिक शत्रु हैं। शनि सूर्य का पुत्र है लेकिन जन्म पर अस्वीकृत — शाश्वत शत्रुता।' }, classicalRef: 'BPHS Ch.3' },
  { id: 'q2_2_03', type: 'true_false', question: { en: 'Temporary friendship between planets depends on their positions in a specific birth chart.', hi: 'ग्रहों के बीच तात्कालिक मित्रता विशिष्ट जन्म कुण्डली में उनकी स्थिति पर निर्भर करती है।' }, correctAnswer: true, explanation: { en: 'Correct. Tatkalika (temporary) friendship is chart-specific. Any planet in the 2nd, 3rd, 4th, 10th, 11th, or 12th house FROM another planet becomes its temporary friend. Those in the 1st, 5th, 6th, 7th, 8th, or 9th house are temporary enemies. This changes with every chart.', hi: 'सही। तात्कालिक मित्रता कुण्डली-विशिष्ट है। किसी ग्रह से 2, 3, 4, 10, 11, 12वें भाव में ग्रह = तात्कालिक मित्र। 1, 5, 6, 7, 8, 9 = तात्कालिक शत्रु।' }, classicalRef: 'BPHS Ch.3 v.56' },
  { id: 'q2_2_04', type: 'mcq', question: { en: 'If two planets are natural friends AND temporary friends, the compound relationship is:', hi: 'यदि दो ग्रह नैसर्गिक मित्र भी हैं और तात्कालिक मित्र भी, तो यौगिक संबंध है:' }, options: [{ en: 'Mitra (Friend)', hi: 'मित्र' }, { en: 'Adhimitra (Great Friend)', hi: 'अधिमित्र (परम मित्र)' }, { en: 'Sama (Neutral)', hi: 'सम (तटस्थ)' }, { en: 'Shatru (Enemy)', hi: 'शत्रु' }], correctAnswer: 1, explanation: { en: 'The 5-level compound relationship: Natural Friend + Temporary Friend = Adhimitra (Great Friend). Natural Friend + Temporary Enemy = Sama (Neutral). Natural Enemy + Temporary Friend = Sama. Natural Enemy + Temporary Enemy = Adhishatru (Great Enemy). Natural Neutral + Temporary Friend = Mitra. Natural Neutral + Temporary Enemy = Shatru.', hi: '5-स्तरीय यौगिक संबंध: नैसर्गिक मित्र + तात्कालिक मित्र = अधिमित्र। नैसर्गिक मित्र + तात्कालिक शत्रु = सम। नैसर्गिक शत्रु + तात्कालिक मित्र = सम।' }, classicalRef: 'BPHS Ch.3 v.57' },
  { id: 'q2_2_05', type: 'mcq', question: { en: 'Why does the friendship matrix matter for chart reading?', hi: 'कुण्डली पठन में मित्रता सारणी क्यों महत्वपूर्ण है?' }, options: [{ en: 'It determines the color of planets', hi: 'यह ग्रहों का रंग निर्धारित करती है' }, { en: 'A planet in a friend\'s sign is strong; in an enemy\'s sign it\'s weak', hi: 'ग्रह मित्र राशि में बलवान; शत्रु राशि में दुर्बल' }, { en: 'It only matters for compatibility matching', hi: 'यह केवल मिलान के लिए महत्वपूर्ण है' }, { en: 'It determines dasha periods', hi: 'यह दशा अवधि निर्धारित करती है' }], correctAnswer: 1, explanation: { en: 'The friendship matrix directly determines a planet\'s dignity: a planet in a friend\'s sign gets "Mitra Kshetra" strength (stronger than neutral, weaker than own sign). In an enemy\'s sign, it gets "Shatru Kshetra" weakness. This affects the 7-level dignity hierarchy: Exalted > Moolatrikona > Own > Friend > Neutral > Enemy > Debilitated.', hi: 'मित्रता सारणी सीधे ग्रह की गरिमा निर्धारित करती है: मित्र राशि = मित्रक्षेत्र बल। शत्रु राशि = शत्रुक्षेत्र दुर्बलता। 7-स्तरीय पदानुक्रम प्रभावित।' } },
  { id: 'q2_2_06', type: 'true_false', question: { en: 'Jupiter and Venus are natural friends because they are both benefic planets.', hi: 'गुरु और शुक्र नैसर्गिक मित्र हैं क्योंकि दोनों शुभ ग्रह हैं।' }, correctAnswer: false, explanation: { en: 'Being benefic doesn\'t make planets friends! Jupiter and Venus are actually ENEMIES. Mythologically, Jupiter (Brihaspati) is Guru of Devas, Venus (Shukracharya) is Guru of Asuras — eternal opponents. Mathematically, from Jupiter\'s moolatrikona (Sagittarius), Venus rules signs that fall in the enemy positions.', hi: 'शुभ होने से मित्र नहीं बनते! गुरु और शुक्र वास्तव में शत्रु हैं। गुरु देवगुरु, शुक्र असुरगुरु — शाश्वत प्रतिद्वंद्वी।' }, classicalRef: 'BPHS Ch.3' },
  { id: 'q2_2_07', type: 'mcq', question: { en: 'Moon is a natural friend of:', hi: 'चन्द्र का नैसर्गिक मित्र है:' }, options: [{ en: 'Sun and Mercury', hi: 'सूर्य और बुध' }, { en: 'Mars and Saturn', hi: 'मंगल और शनि' }, { en: 'Venus and Rahu', hi: 'शुक्र और राहु' }, { en: 'Jupiter and Ketu', hi: 'गुरु और केतु' }], correctAnswer: 0, explanation: { en: 'Moon\'s natural friends are Sun and Mercury. Moon\'s moolatrikona is Taurus — counting from Taurus, the lords of 2nd (Gemini=Mercury), 4th (Leo=Sun), 5th (Virgo=Mercury), 8th (Sagittarius=Jupiter), 9th (Capricorn=Saturn), 12th (Aries=Mars) are its friends. But Mercury is already a friend, so Sun and Mercury are confirmed friends.', hi: 'चंद्र के नैसर्गिक मित्र सूर्य और बुध हैं। चंद्र का मूलत्रिकोण वृषभ — वहां से गिनकर मित्र निकालें।' } },
  { id: 'q2_2_08', type: 'mcq', question: { en: 'In the compound (Panchda) relationship system, how many levels are there?', hi: 'यौगिक (पंचधा) संबंध प्रणाली में कितने स्तर हैं?' }, options: [{ en: '3 (Friend, Neutral, Enemy)', hi: '3 (मित्र, सम, शत्रु)' }, { en: '5 (Great Friend → Great Enemy)', hi: '5 (अधिमित्र → अधिशत्रु)' }, { en: '7', hi: '7' }, { en: '9', hi: '9' }], correctAnswer: 1, explanation: { en: 'The Panchda (5-fold) system: (1) Adhimitra (Great Friend), (2) Mitra (Friend), (3) Sama (Neutral), (4) Shatru (Enemy), (5) Adhishatru (Great Enemy). Derived by combining natural (Naisargika) relationship with temporary (Tatkalika) relationship.', hi: 'पंचधा (5-गुण) प्रणाली: (1) अधिमित्र, (2) मित्र, (3) सम, (4) शत्रु, (5) अधिशत्रु। नैसर्गिक + तात्कालिक संबंध से व्युत्पन्न।' } },
  { id: 'q2_2_09', type: 'true_false', question: { en: 'A planet in the 7th house from another planet is that planet\'s temporary friend.', hi: 'किसी ग्रह से 7वें भाव में ग्रह उसका तात्कालिक मित्र है।' }, correctAnswer: false, explanation: { en: 'A planet in the 7th house from another is a temporary ENEMY. Temporary friends are in houses 2, 3, 4, 10, 11, 12 (the "nearby" houses). Temporary enemies are in houses 1, 5, 6, 7, 8, 9. The 7th house represents opposition — literally facing each other across the chart.', hi: '7वें भाव में ग्रह तात्कालिक शत्रु है। तात्कालिक मित्र = 2, 3, 4, 10, 11, 12 ("निकटवर्ती" भाव)। तात्कालिक शत्रु = 1, 5, 6, 7, 8, 9।' } },
  { id: 'q2_2_10', type: 'mcq', question: { en: 'Sun considers Moon as:', hi: 'सूर्य चन्द्र को मानता है:' }, options: [{ en: 'Friend', hi: 'मित्र' }, { en: 'Enemy', hi: 'शत्रु' }, { en: 'Neutral', hi: 'सम' }, { en: 'Great Friend', hi: 'अधिमित्र' }], correctAnswer: 0, explanation: { en: 'Sun considers Moon a friend. This is NOT reciprocal — relationships can be one-sided! Moon also considers Sun a friend, so this is mutual. But note: Sun considers Venus an enemy, while Venus considers Sun neutral. These asymmetric relationships create complex dynamics in chart interpretation.', hi: 'सूर्य चंद्र को मित्र मानता है। यह पारस्परिक है — चंद्र भी सूर्य को मित्र मानता है। लेकिन ध्यान दें: सूर्य शुक्र को शत्रु मानता है, शुक्र सूर्य को सम।' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Why Planets Have Relationships</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In Module 2.1, we learned each Graha's individual nature. But planets don't act in isolation — they interact. A planet's strength depends significantly on <span className="text-gold-light font-bold">whose sign it occupies</span>. Just as a person performs differently in a friend's house versus an enemy's territory, a planet's expression changes based on the sign lord's relationship with it.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Jyotish defines <span className="text-gold-light font-bold">two types</span> of planetary relationships:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <div className="text-amber-400 font-bold text-sm mb-1">Naisargika (Natural/Permanent)</div>
            <p className="text-text-secondary text-xs">Fixed relationships based on the planet's inherent nature. The Sun is ALWAYS a natural friend of Moon, regardless of the chart. These never change.</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="text-blue-300 font-bold text-sm mb-1">Tatkalika (Temporary/Chart-specific)</div>
            <p className="text-text-secondary text-xs">Relationships based on where planets are placed in a specific chart. If Mars is in the 3rd house from Jupiter, Mars is Jupiter's temporary friend — but only in THIS chart.</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin — Parashara's Derivation Method</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Parashara doesn't just LIST friends and enemies — he provides the <span className="text-gold-light">mathematical rule</span> for deriving them (BPHS Ch.3, v.55):
        </p>
        <div className="p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/10 font-mono text-xs text-emerald-300 mb-3">
          <div>From a planet's MOOLATRIKONA sign:</div>
          <div>→ Lords of 2nd, 4th, 5th, 8th, 9th, 12th signs = <span className="text-gold-light">FRIENDS</span></div>
          <div>→ Remaining lords that are NOT friends = <span className="text-red-400">ENEMIES</span></div>
          <div>→ Neither friend nor enemy = <span className="text-amber-400">NEUTRAL</span></div>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example for Sun:</span> Sun's moolatrikona is Leo (5th sign). From Leo: 2nd=Virgo (Mercury), 4th=Scorpio (Mars), 5th=Sagittarius (Jupiter), 8th=Pisces (Jupiter), 9th=Aries (Mars), 12th=Cancer (Moon). So Sun's friends = Moon, Mars, Jupiter. Mercury appears only once (2nd) — some texts count it as friend, others neutral. Saturn and Venus don't appear → enemies.
        </p>
      </section>

      {/* Full Natural Friendship Matrix */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Natural Friendship Matrix</h3>
        <div className="overflow-x-auto glass-card rounded-xl p-4 border border-gold-primary/10">
          <table className="w-full text-[10px]">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-1.5 text-gold-dark">Planet</th>
              <th className="text-left py-2 px-1.5 text-emerald-400">Friends</th>
              <th className="text-left py-2 px-1.5 text-amber-400">Neutral</th>
              <th className="text-left py-2 px-1.5 text-red-400">Enemies</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Sun', f: 'Moon, Mars, Jupiter', n: 'Mercury', e: 'Venus, Saturn' },
                { p: 'Moon', f: 'Sun, Mercury', n: 'Mars, Jupiter, Venus, Saturn', e: '—' },
                { p: 'Mars', f: 'Sun, Moon, Jupiter', n: 'Venus, Saturn', e: 'Mercury' },
                { p: 'Mercury', f: 'Sun, Venus', n: 'Mars, Jupiter, Saturn', e: 'Moon' },
                { p: 'Jupiter', f: 'Sun, Moon, Mars', n: 'Saturn', e: 'Mercury, Venus' },
                { p: 'Venus', f: 'Mercury, Saturn', n: 'Mars, Jupiter', e: 'Sun, Moon' },
                { p: 'Saturn', f: 'Mercury, Venus', n: 'Jupiter', e: 'Sun, Moon, Mars' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="py-1.5 px-1.5 text-gold-light font-bold">{r.p}</td>
                  <td className="py-1.5 px-1.5 text-emerald-300">{r.f}</td>
                  <td className="py-1.5 px-1.5 text-amber-300">{r.n}</td>
                  <td className="py-1.5 px-1.5 text-red-300">{r.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-text-tertiary text-[9px] mt-2">Note: Relationships are NOT always reciprocal. Sun considers Mercury neutral, but Mercury considers Sun a friend.</p>
        </div>
      </section>
    </div>
  );
}

function Page2() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Temporary Friendship — Chart-Specific Dynamics</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          While natural friendships are universal, <span className="text-gold-light font-bold">temporary (Tatkalika) friendships</span> depend on the specific birth chart. The rule is simple:
        </p>
        <div className="p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/10 font-mono text-xs mb-4">
          <div className="text-emerald-300">Planets in houses 2, 3, 4, 10, 11, 12 from a planet = <span className="text-gold-light">Temporary FRIEND</span></div>
          <div className="text-red-300">Planets in houses 1, 5, 6, 7, 8, 9 from a planet = <span className="text-gold-light">Temporary ENEMY</span></div>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Think of it this way: planets "nearby" (2-4 houses away or 10-12 houses away) are like neighbors — they become temporary allies. Planets "across" the chart (5-9 houses away) are distant and become temporary rivals.
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 5-Level Compound (Panchda) System</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The final relationship between two planets in a chart combines natural + temporary:
        </p>
        <div className="overflow-x-auto glass-card rounded-xl p-4 border border-gold-primary/10">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Natural</th>
              <th className="text-left py-2 px-2 text-gold-dark">Temporary</th>
              <th className="text-left py-2 px-2 text-gold-dark">Compound</th>
              <th className="text-left py-2 px-2 text-gold-dark">Dignity Effect</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              <tr><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-emerald-400 font-bold">Adhimitra (Great Friend)</td><td className="py-1.5 px-2 text-text-secondary">Very strong in this sign</td></tr>
              <tr><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-amber-300">Sama (Neutral)</td><td className="py-1.5 px-2 text-text-secondary">Average strength</td></tr>
              <tr><td className="py-1.5 px-2 text-amber-300">Neutral</td><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-emerald-300">Mitra (Friend)</td><td className="py-1.5 px-2 text-text-secondary">Good strength</td></tr>
              <tr><td className="py-1.5 px-2 text-amber-300">Neutral</td><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-red-300">Shatru (Enemy)</td><td className="py-1.5 px-2 text-text-secondary">Weakened</td></tr>
              <tr><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-amber-300">Sama (Neutral)</td><td className="py-1.5 px-2 text-text-secondary">Conflict mitigated</td></tr>
              <tr><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-red-400 font-bold">Adhishatru (Great Enemy)</td><td className="py-1.5 px-2 text-text-secondary">Very weak in this sign</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Example</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> In a chart, Venus is in Aries (Mars's sign), and Mars is in the 3rd house from Venus.
        </p>
        <div className="font-mono text-xs text-text-secondary space-y-1">
          <div>1. Natural relationship: Mars → Venus = <span className="text-amber-300">Neutral</span></div>
          <div>2. Temporary: Mars in 3rd from Venus = <span className="text-emerald-300">Temp Friend</span> (3rd is friendly house)</div>
          <div>3. Compound: Neutral + Temp Friend = <span className="text-emerald-400 font-bold">Mitra (Friend)</span></div>
          <div>4. Venus in Aries: Venus has <span className="text-emerald-300">Mitra Kshetra</span> dignity — decent strength</div>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "Planetary relationships are reciprocal — if A is B's friend, B must be A's friend."<br />
          <span className="text-emerald-300">Reality:</span> NOT always! Sun considers Mercury neutral, but Mercury considers Sun a FRIEND. This asymmetry is intentional and adds nuance.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Benefic planets are always friends with each other."<br />
          <span className="text-emerald-300">Reality:</span> Jupiter and Venus — both strong benefics — are ENEMIES. Their rivalry (Deva Guru vs Asura Guru) creates the Guru Chandal dynamic when they interact.</p>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-blue-300 font-bold">Fully used in modern Jyotish.</span> The friendship matrix is essential for computing planetary dignity (Module 2.3) and Shadbala. Our app's Vimshopaka Bala calculation uses compound relationships to determine dignity scores across all 16+ divisional charts. The mathematical derivation from moolatrikona signs means this system is internally consistent, not arbitrary.
        </p>
      </section>
    </div>
  );
}

export default function Module2_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}
