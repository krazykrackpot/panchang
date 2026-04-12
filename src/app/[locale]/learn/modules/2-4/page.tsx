'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_2_4', phase: 1, topic: 'Grahas', moduleNumber: '2.4',
  title: { en: 'Retrograde, Combustion & Planetary War', hi: 'वक्री गति, अस्त एवं ग्रह युद्ध' },
  subtitle: { en: 'When planets move backward, get burned by the Sun, or battle each other', hi: 'जब ग्रह पीछे चलें, सूर्य से जलें, या एक दूसरे से युद्ध करें' },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: '2.3 Dignities', hi: '2.3 गरिमाएं' }, href: '/learn/modules/2-3' },
    { label: { en: 'Retrograde Calendar', hi: 'वक्री कैलेंडर' }, href: '/learn/../retrograde' },
    { label: { en: '3.1 The 12 Rashis', hi: '3.1 राशियाँ' }, href: '/learn/modules/3-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q2_4_01', type: 'mcq', question: { en: 'What causes a planet to appear retrograde?', hi: 'ग्रह वक्री क्यों दिखता है?' }, options: [{ en: 'The planet actually reverses its orbit', hi: 'ग्रह वास्तव में अपनी कक्षा उलटता है' }, { en: 'Earth overtakes or is overtaken by the planet, creating an optical illusion of backward motion', hi: 'पृथ्वी ग्रह से आगे निकलती है या पीछे रहती है, पीछे चलने का आभास' }, { en: 'The Sun\'s gravity pulls the planet backward', hi: 'सूर्य का गुरुत्व ग्रह को पीछे खींचता है' }, { en: 'The planet enters a black hole', hi: 'ग्रह ब्लैक होल में प्रवेश करता है' }], correctAnswer: 1, explanation: { en: 'Retrograde is an OPTICAL ILLUSION caused by relative orbital speeds. When Earth overtakes an outer planet (like Mars or Jupiter), the planet appears to move backward against the stars — like a slower car seeming to go backward when you pass it on the highway. The planet never actually reverses direction.', hi: 'वक्री गति एक दृष्टि भ्रम है — सापेक्ष कक्षीय गति के कारण। जब पृथ्वी बाहरी ग्रह से आगे निकलती है, ग्रह तारों के विरुद्ध पीछे चलता प्रतीत होता है — जैसे धीमी कार को पार करने पर वह पीछे जाती लगती है।' }, classicalRef: 'Surya Siddhanta Ch.2' },
  { id: 'q2_4_02', type: 'true_false', question: { en: 'Sun and Moon can be retrograde.', hi: 'सूर्य और चन्द्र वक्री हो सकते हैं।' }, correctAnswer: false, explanation: { en: 'Sun NEVER appears retrograde from Earth (since Earth orbits the Sun, not the other way). Moon never appears retrograde because it always moves in the same direction relative to Earth. Rahu and Ketu are always retrograde by nature (they move backward through the zodiac at ~19.4°/year). Only Mars, Mercury, Jupiter, Venus, Saturn can appear retrograde.', hi: 'सूर्य कभी वक्री नहीं (पृथ्वी सूर्य की कक्षा करती है)। चंद्र कभी वक्री नहीं। राहु-केतु सदैव वक्री। केवल मंगल, बुध, गुरु, शुक्र, शनि वक्री हो सकते हैं।' } },
  { id: 'q2_4_03', type: 'mcq', question: { en: 'In Jyotish, a retrograde planet is generally considered:', hi: 'ज्योतिष में वक्री ग्रह सामान्यतः माना जाता है:' }, options: [{ en: 'Always weak', hi: 'सदैव दुर्बल' }, { en: 'Always strong', hi: 'सदैव बलवान' }, { en: 'Strong in some ways (intensified, internalized energy) but expressing differently', hi: 'कुछ मायनों में बलवान (तीव्र, आंतरिक ऊर्जा) लेकिन भिन्न अभिव्यक्ति' }, { en: 'Neutral — no effect', hi: 'तटस्थ — कोई प्रभाव नहीं' }], correctAnswer: 2, explanation: { en: 'The Jyotish view of retrograde is nuanced. Retrograde planets are actually CLOSER to Earth (and therefore BRIGHTER) — giving them extra Cheshta Bala (motional strength). But their expression is internalized, unconventional, and often delayed. A retrograde planet does things differently — not weaker, but in an unexpected way. Retrograde also cancels debilitation (Neecha Bhanga condition #4).', hi: 'ज्योतिष दृष्टिकोण सूक्ष्म है। वक्री ग्रह पृथ्वी के निकट (अधिक चमकीले) — अतिरिक्त चेष्टा बल। लेकिन अभिव्यक्ति आंतरिक, अपरंपरागत, विलंबित। वक्री नीच भंग भी करता है (शर्त #4)।' }, classicalRef: 'BPHS, Saravali Ch.33' },
  { id: 'q2_4_04', type: 'mcq', question: { en: 'Mercury is combust when within how many degrees of the Sun?', hi: 'बुध सूर्य से कितने अंश के भीतर अस्त होता है?' }, options: [{ en: '12° (or 14° if retrograde)', hi: '12° (वक्री हो तो 14°)' }, { en: '14° (or 12° if retrograde)', hi: '14° (वक्री हो तो 12°)' }, { en: '17°', hi: '17°' }, { en: '10°', hi: '10°' }], correctAnswer: 1, explanation: { en: 'Mercury combustion orb: 14° normally, 12° if retrograde (retrograde Mercury is brighter, so the orb shrinks). Full combustion orbs: Moon 12°, Mars 17°, Mercury 14°/12°(R), Jupiter 11°, Venus 10°/8°(R), Saturn 15°. These are from BPHS and represent the distance within which the planet becomes invisible due to Sun\'s glare.', hi: 'बुध अस्त सीमा: सामान्यतः 14°, वक्री हो तो 12°। सभी सीमाएं: चंद्र 12°, मंगल 17°, बुध 14°/12°(वक्री), गुरु 11°, शुक्र 10°/8°(वक्री), शनि 15°।' }, classicalRef: 'BPHS Ch.3 v.42' },
  { id: 'q2_4_05', type: 'mcq', question: { en: 'What is "Graha Yuddha" (Planetary War)?', hi: '"ग्रह युद्ध" क्या है?' }, options: [{ en: 'When two planets are in the same sign', hi: 'जब दो ग्रह एक ही राशि में हों' }, { en: 'When two planets are within 1° of each other', hi: 'जब दो ग्रह एक दूसरे से 1° के भीतर हों' }, { en: 'When a planet is debilitated', hi: 'जब ग्रह नीच हो' }, { en: 'When a planet is retrograde', hi: 'जब ग्रह वक्री हो' }], correctAnswer: 1, explanation: { en: 'Graha Yuddha occurs when two planets (excluding Sun, Moon, Rahu, Ketu) are within 1° of each other. The planet with higher declination (more northerly position) is considered the WINNER. The loser\'s karakatvas suffer. Only true planets (Mars-Saturn) participate; luminaries and nodes don\'t "war."', hi: 'ग्रह युद्ध तब होता है जब दो ग्रह (सूर्य, चंद्र, राहु, केतु छोड़कर) 1° के भीतर हों। अधिक उत्तरी क्रांति वाला विजयी। हारने वाले के कारकत्व पीड़ित।' }, classicalRef: 'Surya Siddhanta Ch.6' },
  { id: 'q2_4_06', type: 'mcq', question: { en: 'How many times per year is Mercury retrograde (approximately)?', hi: 'बुध प्रति वर्ष लगभग कितनी बार वक्री होता है?' }, options: [{ en: 'Once', hi: 'एक बार' }, { en: 'About 3 times', hi: 'लगभग 3 बार' }, { en: 'About 6 times', hi: 'लगभग 6 बार' }, { en: 'Every month', hi: 'हर महीने' }], correctAnswer: 1, explanation: { en: 'Mercury retrogrades ~3 times per year, each lasting ~3 weeks. This is because Mercury\'s orbital period (88 days) means it "laps" its synodic cycle with Earth frequently. Saturn retrogrades only ~once per year (for ~4.5 months), Jupiter ~once per year (for ~4 months). Mars retrogrades ~every 26 months (for ~2.5 months).', hi: 'बुध ~3 बार/वर्ष वक्री, प्रत्येक ~3 सप्ताह। बुध की कक्षीय अवधि (88 दिन) छोटी होने से बार-बार। शनि ~1/वर्ष (~4.5 माह), गुरु ~1/वर्ष (~4 माह), मंगल ~1/26 माह (~2.5 माह)।' } },
  { id: 'q2_4_07', type: 'true_false', question: { en: 'A combust planet completely loses its ability to give results.', hi: 'अस्त ग्रह परिणाम देने की क्षमता पूरी तरह खो देता है।' }, correctAnswer: false, explanation: { en: 'False. A combust planet is weakened — its significations may struggle — but it doesn\'t become zero. Combustion is like an employee overshadowed by a dominant boss (the Sun). The employee still works but gets no credit. If the Sun is benefic for the chart, combustion can even be mitigated further. Some authorities say Mercury combust is barely affected since Mercury is always near the Sun anyway.', hi: 'गलत। अस्त ग्रह दुर्बल होता है लेकिन शून्य नहीं। अस्त ऐसे है जैसे एक कर्मचारी प्रभावी बॉस (सूर्य) की छाया में। कुछ विद्वान कहते हैं बुध अस्त का कम प्रभाव क्योंकि बुध सदैव सूर्य के निकट रहता है।' } },
  { id: 'q2_4_08', type: 'mcq', question: { en: 'Retrograde planets are actually _____ to Earth than normal:', hi: 'वक्री ग्रह वास्तव में पृथ्वी से सामान्य से _____ होते हैं:' }, options: [{ en: 'Farther', hi: 'दूर' }, { en: 'Closer', hi: 'निकट' }, { en: 'Same distance', hi: 'समान दूरी' }, { en: 'It varies randomly', hi: 'यह यादृच्छिक रूप से बदलता है' }], correctAnswer: 1, explanation: { en: 'Retrograde planets are CLOSER to Earth — that\'s why they appear to move backward (Earth is passing them or they\'re passing us). Being closer also means they\'re BRIGHTER. This is why Jyotish considers retrograde planets to have extra Cheshta Bala (strength of motion). The paradox: moving backward = closer = brighter = stronger in some ways.', hi: 'वक्री ग्रह पृथ्वी के निकट होते हैं — इसीलिए पीछे चलते प्रतीत। निकट = अधिक चमकीले। इसलिए ज्योतिष वक्री ग्रहों को अतिरिक्त चेष्टा बल देता है। विरोधाभास: पीछे = निकट = चमकीला = कुछ तरह से बलवान।' } },
  { id: 'q2_4_09', type: 'true_false', question: { en: 'Rahu and Ketu are always retrograde (moving backward through the zodiac).', hi: 'राहु और केतु सदैव वक्री (राशिचक्र में पीछे) चलते हैं।' }, correctAnswer: true, explanation: { en: 'Correct. The lunar nodes (Rahu/Ketu) move retrograde — backward through the zodiac — at ~19.4° per year, completing one full cycle in ~18.6 years. This perpetual retrograde motion is their natural state (they have no "direct" period). Some texts note brief "direct" stationary periods, but the dominant motion is always retrograde.', hi: 'सही। चंद्र नोड (राहु/केतु) ~19.4°/वर्ष की दर से राशिचक्र में पीछे चलते हैं, ~18.6 वर्षों में एक पूर्ण चक्र। यह उनकी प्राकृतिक अवस्था है।' }, classicalRef: 'Surya Siddhanta Ch.2' },
  { id: 'q2_4_10', type: 'mcq', question: { en: 'Which planet has the LARGEST combustion orb (gets combust furthest from the Sun)?', hi: 'किस ग्रह की सबसे बड़ी अस्त सीमा है (सूर्य से सबसे दूर अस्त होता है)?' }, options: [{ en: 'Venus (10°)', hi: 'शुक्र (10°)' }, { en: 'Mars (17°)', hi: 'मंगल (17°)' }, { en: 'Jupiter (11°)', hi: 'गुरु (11°)' }, { en: 'Saturn (15°)', hi: 'शनि (15°)' }], correctAnswer: 1, explanation: { en: 'Mars has the largest combustion orb at 17°. This means Mars becomes combust (invisible due to Sun\'s brightness) when within 17° of the Sun — a larger zone than any other planet. The orbs reflect each planet\'s apparent brightness: dimmer planets (Mars can be dim) get overwhelmed by the Sun at greater distances.', hi: 'मंगल की सबसे बड़ी अस्त सीमा 17° है। सूर्य से 17° के भीतर आने पर मंगल अस्त। सीमाएं ग्रह की आभासी चमक दर्शाती हैं: धुंधले ग्रह अधिक दूरी पर सूर्य से दब जाते हैं।' }, classicalRef: 'BPHS Ch.3 v.42' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Retrograde Motion (Vakri Gati) — The Great Illusion</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Vakri</span> (वक्री) means "crooked" or "curved." When a planet is Vakri, it appears to move <span className="text-gold-light">backward</span> (from east to west) against the background stars, instead of its normal west-to-east motion. This is entirely an <span className="text-gold-light font-bold">optical illusion</span> caused by the relative orbital speeds of Earth and the planet.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">The highway analogy:</span> Imagine you're driving on a highway and passing a slower car. As you pull alongside and overtake it, the slower car seems to move <em>backward</em> relative to the distant hills — even though it's still moving forward. This is exactly what happens when Earth overtakes Mars, Jupiter, or Saturn in their orbits.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          For <span className="text-gold-light">inner planets</span> (Mercury, Venus), retrograde happens when THEY overtake Earth from our perspective — they swing between us and the Sun, appearing to reverse direction.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Surya Siddhanta describes retrograde motion as part of the Sighra correction (Ch.2) — the difference between a planet's mean position and its true position as seen from Earth. Ancient Indian astronomers understood this was an observational effect, not a real reversal. The term <span className="text-gold-light font-bold">Vakri</span> (crooked) itself implies something that appears bent from the observer's perspective, not truly reversed.
        </p>
      </section>

      {/* Retrograde frequency table */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>How Often Each Planet Goes Retrograde</h3>
        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Planet</th>
              <th className="text-left py-2 px-2 text-gold-dark">Frequency</th>
              <th className="text-left py-2 px-2 text-gold-dark">Duration</th>
              <th className="text-left py-2 px-2 text-gold-dark">% of Time Retrograde</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Mercury', freq: '~3 times/year', dur: '~3 weeks each', pct: '~19%' },
                { p: 'Venus', freq: '~every 18 months', dur: '~6 weeks', pct: '~7%' },
                { p: 'Mars', freq: '~every 26 months', dur: '~2.5 months', pct: '~9%' },
                { p: 'Jupiter', freq: '~once/year', dur: '~4 months', pct: '~30%' },
                { p: 'Saturn', freq: '~once/year', dur: '~4.5 months', pct: '~36%' },
                { p: 'Rahu/Ketu', freq: 'ALWAYS', dur: 'Permanent', pct: '100%' },
              ].map((r, i) => (
                <tr key={i}><td className="py-1.5 px-2 text-gold-light font-medium">{r.p}</td><td className="py-1.5 px-2 text-text-secondary">{r.freq}</td><td className="py-1.5 px-2 text-text-secondary">{r.dur}</td><td className="py-1.5 px-2 text-text-secondary font-mono">{r.pct}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="text-text-tertiary text-xs mt-2">Sun and Moon NEVER go retrograde. Outer planets (Jupiter, Saturn) are retrograde ~1/3 of the time — so retrograde Jupiter/Saturn is very common, not alarming.</p>
        </div>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Retrograde Paradox in Jyotish</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Here's the beautiful paradox: a retrograde planet is <span className="text-gold-light font-bold">closer to Earth</span> (and therefore brighter) than when it's in direct motion. Jyotish recognizes this by giving retrograde planets extra <span className="text-gold-light">Cheshta Bala</span> (motional strength in Shadbala).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          But the energy is <span className="text-gold-light font-bold">internalized</span>. A direct planet expresses outwardly; a retrograde planet expresses <em>inwardly</em>. Think of it as the difference between speaking your thoughts aloud (direct) versus deep internal reflection (retrograde). Neither is better — they're different modes of expression.
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Retrograde Effects Summary</div>
          <ul className="text-text-secondary text-xs space-y-1.5">
            <li>• <span className="text-gold-light">Retrograde Saturn:</span> Karmic lessons intensified but internalized. Delays become more pronounced. Discipline deepened.</li>
            <li>• <span className="text-gold-light">Retrograde Jupiter:</span> Wisdom directed inward — philosophical, less social. May struggle with conventional education but excels at self-study.</li>
            <li>• <span className="text-gold-light">Retrograde Mars:</span> Courage internalized — less aggressive externally, but immense inner drive. May suppress anger.</li>
            <li>• <span className="text-gold-light">Retrograde Mercury:</span> Famous for communication mix-ups in pop astrology. In Jyotish: deeper thinking, may revisit old ideas, unconventional communication style.</li>
            <li>• <span className="text-gold-light">Retrograde Venus:</span> Love and relationships approached differently — unconventional partnerships, revisiting past relationships.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Combustion (Asta) — Planets Burned by the Sun</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          When a planet gets too close to the Sun, it becomes invisible — overwhelmed by the Sun's brightness. This is called <span className="text-gold-light font-bold">Asta</span> (अस्त, literally "setting" or "disappearing"). In Jyotish, a combust planet's significations are <span className="text-gold-light">weakened</span> — the Sun's ego/authority energy overshadows the planet's own expression.
        </p>

        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-4">
          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Combustion Orbs (BPHS Ch.3 v.42)</h4>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Planet</th>
              <th className="text-left py-2 px-2 text-gold-dark">Normal Orb</th>
              <th className="text-left py-2 px-2 text-gold-dark">Retrograde Orb</th>
              <th className="text-left py-2 px-2 text-gold-dark">Karakatva Impact</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Moon', normal: '12°', retro: 'N/A', impact: 'Mind, emotions, mother — weakened' },
                { p: 'Mars', normal: '17°', retro: '17°', impact: 'Courage, siblings, property — diminished' },
                { p: 'Mercury', normal: '14°', retro: '12°', impact: 'Intellect, speech, commerce — overshadowed' },
                { p: 'Jupiter', normal: '11°', retro: '11°', impact: 'Wisdom, children, dharma — suppressed' },
                { p: 'Venus', normal: '10°', retro: '8°', impact: 'Marriage, arts, luxury — reduced' },
                { p: 'Saturn', normal: '15°', retro: '15°', impact: 'Longevity, karma, servants — afflicted' },
              ].map((r, i) => (
                <tr key={i}><td className="py-1.5 px-2 text-gold-light font-bold">{r.p}</td><td className="py-1.5 px-2 text-text-secondary">{r.normal}</td><td className="py-1.5 px-2 text-text-secondary">{r.retro}</td><td className="py-1.5 px-2 text-text-secondary">{r.impact}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Planetary War (Graha Yuddha)</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          When two true planets (Mars, Mercury, Jupiter, Venus, Saturn) are within <span className="text-gold-light font-bold">1° of each other</span>, they are in <span className="text-gold-light font-bold">Graha Yuddha</span> (ग्रह युद्ध, planetary war). The planet with <span className="text-gold-light">higher northern latitude</span> (closer to the north celestial pole) is the <span className="text-emerald-400">winner</span>; the other is the <span className="text-red-400">loser</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The winner's significations are strengthened by the conquest; the loser's are damaged. If the loser rules important houses in your chart, those life areas may suffer during the period when this war occurred or when dashas activate those planets.
        </p>
        <p className="text-text-secondary text-xs text-text-tertiary">
          Note: Sun, Moon, Rahu, and Ketu do NOT participate in Graha Yuddha. Sun is too powerful to "war" (conjunction with Sun = combustion instead). Moon, Rahu, Ketu have different interaction dynamics.
        </p>
      </section>

      <ExampleChart
        ascendant={1}
        planets={{ 2: [0, 3], 9: [2, 4] }}
        title="Mercury Combust (near Sun) + Mars-Jupiter War"
        highlight={[2, 9]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <div>
            <p className="text-gold-light font-medium mb-1">Example 1: Is Mercury combust?</p>
            <p>Sun at 45° sidereal, Mercury at 37° sidereal. Distance = |45 - 37| = 8°. Mercury's combustion orb = 14°. Since 8° &lt; 14°, Mercury IS combust. Impact: native's intellect, speech, and commercial abilities may be overshadowed by ego/authority issues.</p>
          </div>
          <div>
            <p className="text-gold-light font-medium mb-1">Example 2: Are Mars and Jupiter at war?</p>
            <p>Mars at 120.3°, Jupiter at 120.8°. Distance = |120.8 - 120.3| = 0.5° &lt; 1° → YES, Graha Yuddha! The planet with higher celestial latitude wins. If Jupiter has +1.2° latitude and Mars +0.8°, Jupiter wins → Jupiter strengthened, Mars weakened.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "Mercury retrograde ruins everything."<br />
          <span className="text-emerald-300">Reality:</span> This is pop astrology exaggeration. Mercury is retrograde ~19% of the time — that's ~70 days per year. If it truly "ruined everything," 1/5th of all days would be catastrophic. In Jyotish, retrograde Mercury simply indicates a different communication style — more reflective, less spontaneous.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Combust planets become completely useless."<br />
          <span className="text-emerald-300">Reality:</span> Combustion weakens but doesn't eliminate. Mercury is always near the Sun (never more than 28° away), so it's frequently combust — yet Mercury-ruled individuals (Gemini/Virgo Lagna) still thrive. Context matters.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-blue-300 font-bold">Astronomically correct.</span> Retrograde, combustion, and planetary conjunctions are all real, observable phenomena. Our app tracks retrograde status for all planets and displays it on the Panchang and Transit Calendar pages. The combustion orbs from BPHS correspond roughly to the angular distances at which planets become invisible to the naked eye — an observational fact.
        </p>
      </section>
    </div>
  );
}

export default function Module2_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}
