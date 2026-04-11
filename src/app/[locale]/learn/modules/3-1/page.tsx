'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_3_1', phase: 1, topic: 'Rashis', moduleNumber: '3.1',
  title: { en: 'The 12 Rashis — Parashara\'s Description', hi: '12 राशियाँ — पाराशर का वर्णन' },
  subtitle: { en: 'Each sign as Parashara described it — form, direction, caste, and the Kalapurusha body', hi: 'प्रत्येक राशि का पाराशर द्वारा वर्णन — रूप, दिशा, वर्ण और कालपुरुष शरीर' },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: '3.2 Sign Qualities', hi: '3.2 राशि गुण' }, href: '/learn/modules/3-2' },
    { label: { en: '2.3 Dignities', hi: '2.3 गरिमाएं' }, href: '/learn/modules/2-3' },
    { label: { en: 'Rashis reference', hi: 'राशि संदर्भ' }, href: '/learn/rashis' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q3_1_01', type: 'mcq', question: { en: 'In the Kalapurusha (Cosmic Person), which body part does Aries represent?', hi: 'कालपुरुष में मेष राशि किस अंग का प्रतिनिधित्व करती है?' }, options: [{ en: 'Feet', hi: 'पैर' }, { en: 'Heart', hi: 'हृदय' }, { en: 'Head', hi: 'सिर' }, { en: 'Hands', hi: 'हाथ' }], correctAnswer: 2, explanation: { en: 'Aries = Head, Taurus = Face/Throat, Gemini = Arms/Shoulders, Cancer = Chest, Leo = Stomach/Heart, Virgo = Waist/Intestines, Libra = Lower Abdomen, Scorpio = Genitals, Sagittarius = Thighs, Capricorn = Knees, Aquarius = Calves, Pisces = Feet. The zodiac maps from HEAD to FEET, following the body downward.', hi: 'मेष=सिर, वृषभ=मुख/कंठ, मिथुन=भुजाएं, कर्क=वक्ष, सिंह=उदर/हृदय, कन्या=कटि, तुला=नाभि, वृश्चिक=गुप्तांग, धनु=जांघ, मकर=घुटने, कुम्भ=पिंडली, मीन=पैर।' }, classicalRef: 'BPHS Ch.4 v.4-5' },
  { id: 'q3_1_02', type: 'mcq', question: { en: 'The Kalapurusha concept maps the 12 signs to:', hi: 'कालपुरुष अवधारणा 12 राशियों को मानचित्रित करती है:' }, options: [{ en: 'The 12 months of the year', hi: 'वर्ष के 12 मास' }, { en: 'The 12 limbs/parts of a Cosmic Person\'s body, from head (Aries) to feet (Pisces)', hi: 'ब्रह्मांडीय पुरुष के 12 अंग, सिर (मेष) से पैर (मीन) तक' }, { en: 'The 12 Adityas (Sun gods)', hi: '12 आदित्य (सूर्य देव)' }, { en: '12 directions', hi: '12 दिशाएं' }], correctAnswer: 1, explanation: { en: 'Kalapurusha (काल = time, पुरुष = cosmic person) is the cosmic being whose body IS the zodiac. This concept connects astrology to Ayurveda — when a sign is afflicted in a chart, the corresponding body part may be vulnerable. The 1st house (Aries) rules the head because Aries IS the head of the Kalapurusha.', hi: 'कालपुरुष (काल=समय, पुरुष=ब्रह्मांडीय व्यक्ति) — जिसका शरीर ही राशिचक्र है। राशि पीड़ित → संबंधित शरीर अंग कमजोर (ज्योतिष-आयुर्वेद संबंध)।' }, classicalRef: 'BPHS Ch.4' },
  { id: 'q3_1_03', type: 'true_false', question: { en: 'The zodiac signs follow the body from head (Aries) to feet (Pisces) in descending order.', hi: 'राशिचक्र शरीर में सिर (मेष) से पैर (मीन) तक अवरोही क्रम में चलता है।' }, correctAnswer: true, explanation: { en: 'Correct. This is not arbitrary — it reflects the flow of consciousness from the crown (Aries = initiative, beginning) to the feet (Pisces = dissolution, transcendence). The 6th sign (Virgo = waist/intestines) marks the midpoint where the upper body (visible, external) transitions to the lower body (hidden, internal).', hi: 'सही। मेष (सिर/आरम्भ) से मीन (पैर/मोक्ष) तक चेतना का प्रवाह। 6वीं राशि (कन्या=कटि) मध्य बिंदु — ऊपरी (बाहरी) से निचला (आंतरिक) शरीर।' } },
  { id: 'q3_1_04', type: 'mcq', question: { en: 'According to BPHS, which signs are classified as "Biped" (two-footed/human)?', hi: 'BPHS अनुसार कौन सी राशियाँ "द्विपद" (दो पैरों वाली/मानव) हैं?' }, options: [{ en: 'Aries, Taurus, Leo', hi: 'मेष, वृषभ, सिंह' }, { en: 'Gemini, Virgo, Libra, first half of Sagittarius, Aquarius', hi: 'मिथुन, कन्या, तुला, धनु का पूर्वार्ध, कुम्भ' }, { en: 'Cancer, Scorpio, Pisces', hi: 'कर्क, वृश्चिक, मीन' }, { en: 'All fire signs', hi: 'सभी अग्नि राशियाँ' }], correctAnswer: 1, explanation: { en: 'Biped (human/two-footed) signs: Gemini (twins), Virgo (maiden), Libra (person with scales), first half of Sagittarius (human archer), Aquarius (water bearer). Quadruped (four-footed): Aries (ram), Taurus (bull), Leo (lion), second half of Sagittarius (horse). Insect: Scorpio (scorpion). Water: Cancer (crab), Pisces (fish). Capricorn is half-quadruped/half-water (crocodile/sea-goat).', hi: 'द्विपद: मिथुन, कन्या, तुला, धनु पूर्वार्ध, कुम्भ। चतुष्पद: मेष, वृषभ, सिंह, धनु उत्तरार्ध। कीट: वृश्चिक। जल: कर्क, मीन। मकर: अर्ध-चतुष्पद/अर्ध-जल।' }, classicalRef: 'BPHS Ch.4 v.12' },
  { id: 'q3_1_05', type: 'mcq', question: { en: 'Scorpio represents which body part in the Kalapurusha?', hi: 'कालपुरुष में वृश्चिक किस अंग का प्रतिनिधित्व करती है?' }, options: [{ en: 'Knees', hi: 'घुटने' }, { en: 'Thighs', hi: 'जांघ' }, { en: 'Genitals/reproductive organs', hi: 'गुप्तांग/प्रजनन अंग' }, { en: 'Stomach', hi: 'पेट' }], correctAnswer: 2, explanation: { en: 'Scorpio = genitals and reproductive organs. This is why the 8th house (Scorpio\'s natural house) deals with transformation, death, rebirth, sexual energy, and hidden matters. Scorpio\'s reputation for intensity and secrecy comes directly from the body part it governs — the most private and powerful area.', hi: 'वृश्चिक = गुप्तांग/प्रजनन अंग। इसलिए 8वां भाव (वृश्चिक का नैसर्गिक भाव) परिवर्तन, मृत्यु, पुनर्जन्म, यौन ऊर्जा से संबंधित।' } },
  { id: 'q3_1_06', type: 'true_false', question: { en: 'Each Rashi in Jyotish spans exactly 30° of the ecliptic.', hi: 'ज्योतिष में प्रत्येक राशि क्रान्तिवृत्त के ठीक 30° तक फैली है।' }, correctAnswer: true, explanation: { en: 'Correct. 360° ÷ 12 = 30° per sign. This equal division is a mathematical definition, established in BPHS Ch.1. Unlike physical constellations (which have unequal spans), signs are precise 30° sectors that enable exact computation.', hi: 'सही। 360° ÷ 12 = 30° प्रति राशि। BPHS अ.1 में स्थापित गणितीय परिभाषा। भौतिक तारामंडलों (असमान विस्तार) से भिन्न।' } },
  { id: 'q3_1_07', type: 'mcq', question: { en: 'Which sign does Parashara describe as having the form of a "balance" (person holding scales)?', hi: 'पाराशर किस राशि को "तराजू" (तुला धारण करने वाला) के रूप में वर्णित करते हैं?' }, options: [{ en: 'Virgo', hi: 'कन्या' }, { en: 'Libra', hi: 'तुला' }, { en: 'Aquarius', hi: 'कुम्भ' }, { en: 'Gemini', hi: 'मिथुन' }], correctAnswer: 1, explanation: { en: 'Libra (Tula, तुला) is depicted as a person holding scales/balance — representing justice, equilibrium, and commerce. Ruled by Venus, Libra governs partnerships, trade, and the aesthetic sense of balance. It\'s the 7th sign, associated with marriage and legal contracts.', hi: 'तुला (Libra) — तराजू धारण करने वाला — न्याय, संतुलन और वाणिज्य। शुक्र शासित। 7वीं राशि — विवाह और कानूनी अनुबंध।' } },
  { id: 'q3_1_08', type: 'mcq', question: { en: 'The water signs in the zodiac are:', hi: 'राशिचक्र में जल राशियाँ हैं:' }, options: [{ en: 'Aries, Leo, Sagittarius', hi: 'मेष, सिंह, धनु' }, { en: 'Taurus, Virgo, Capricorn', hi: 'वृषभ, कन्या, मकर' }, { en: 'Cancer, Scorpio, Pisces', hi: 'कर्क, वृश्चिक, मीन' }, { en: 'Gemini, Libra, Aquarius', hi: 'मिथुन, तुला, कुम्भ' }], correctAnswer: 2, explanation: { en: 'Water signs: Cancer (crab), Scorpio (scorpion), Pisces (fish). All three have water creature forms. Water element represents emotions, intuition, and receptivity. In the Kalapurusha, these signs cover chest (Cancer), genitals (Scorpio), and feet (Pisces) — all areas associated with deep feeling and surrender.', hi: 'जल राशियाँ: कर्क (केकड़ा), वृश्चिक (बिच्छू), मीन (मछली)। जल तत्व = भावनाएं, अंतर्ज्ञान, ग्रहणशीलता।' } },
  { id: 'q3_1_09', type: 'true_false', question: { en: 'Sagittarius (Dhanu) has a dual nature — the first half is human (archer) and the second half is animal (horse).', hi: 'धनु (Sagittarius) की दोहरी प्रकृति है — पूर्वार्ध मानव (धनुर्धर) और उत्तरार्ध पशु (अश्व)।' }, correctAnswer: true, explanation: { en: 'Correct. Sagittarius is depicted as a centaur (Dhanu-dhara = bow-holder) — half human, half horse. The first 15° (human half) is biped — intellectual, philosophical, spiritual. The second 15° (horse half) is quadruped — physical, adventurous, restless. Planets in the first vs second half of Sagittarius can express quite differently.', hi: 'सही। धनु अर्ध-मानव अर्ध-अश्व (सेंटॉर)। पहले 15° (मानव) = बौद्धिक, दार्शनिक। अगले 15° (अश्व) = शारीरिक, साहसी। दोनों भागों में ग्रह भिन्न व्यक्त करते हैं।' }, classicalRef: 'BPHS Ch.4 v.10' },
  { id: 'q3_1_10', type: 'mcq', question: { en: 'How many signs are classified as "nocturnal" (night-strong) versus "diurnal" (day-strong)?', hi: 'कितनी राशियाँ "रात्रि बलवान" बनाम "दिवस बलवान" हैं?' }, options: [{ en: '6 each (alternating)', hi: '6 प्रत्येक (बारी-बारी)' }, { en: 'All 12 are day-strong', hi: 'सभी 12 दिवस बलवान' }, { en: '4 nocturnal, 8 diurnal', hi: '4 रात्रि, 8 दिवस' }, { en: 'It depends on the season', hi: 'ऋतु पर निर्भर' }], correctAnswer: 0, explanation: { en: 'Signs alternate: Aries (day), Taurus (night), Gemini (day), Cancer (night)... Odd signs (1,3,5,7,9,11) are diurnal (day-strong, male). Even signs (2,4,6,8,10,12) are nocturnal (night-strong, female). This diurnal/nocturnal classification affects planetary strength — a diurnal planet in a diurnal sign gains additional Sthana Bala.', hi: 'राशियाँ बारी-बारी: विषम (1,3,5,7,9,11) = दिवस (पुरुष)। सम (2,4,6,8,10,12) = रात्रि (स्त्री)। यह वर्गीकरण स्थान बल प्रभावित करता है।' }, classicalRef: 'BPHS Ch.4' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Kalapurusha — The Cosmic Body</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Parashara begins his description of the Rashis (BPHS Ch.4) with a remarkable concept: the entire zodiac is the body of the <span className="text-gold-light font-bold">Kalapurusha</span> (कालपुरुष) — the "Cosmic Person" or "Time Being." Each sign corresponds to a specific body part, creating a direct bridge between astrology and the physical body.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This is not just a poetic metaphor — it has practical consequences. When a sign is afflicted in your chart (malefic planets, lord in dusthana), the corresponding body part may be vulnerable to disease or injury. This is the foundation of <span className="text-gold-light">Medical Astrology</span> (Vaidya Jyotish) and its connection to Ayurveda.
        </p>

        {/* Kalapurusha body mapping */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Kalapurusha Body Map</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {[
              { sign: 'Aries (मेष)', body: 'Head, Brain', num: 1, color: 'text-red-400' },
              { sign: 'Taurus (वृषभ)', body: 'Face, Throat, Neck', num: 2, color: 'text-emerald-400' },
              { sign: 'Gemini (मिथुन)', body: 'Arms, Shoulders', num: 3, color: 'text-sky-400' },
              { sign: 'Cancer (कर्क)', body: 'Chest, Lungs', num: 4, color: 'text-blue-300' },
              { sign: 'Leo (सिंह)', body: 'Heart, Stomach', num: 5, color: 'text-amber-400' },
              { sign: 'Virgo (कन्या)', body: 'Waist, Intestines', num: 6, color: 'text-emerald-300' },
              { sign: 'Libra (तुला)', body: 'Lower Abdomen', num: 7, color: 'text-pink-300' },
              { sign: 'Scorpio (वृश्चिक)', body: 'Genitals', num: 8, color: 'text-red-300' },
              { sign: 'Sagittarius (धनु)', body: 'Thighs', num: 9, color: 'text-amber-300' },
              { sign: 'Capricorn (मकर)', body: 'Knees', num: 10, color: 'text-slate-300' },
              { sign: 'Aquarius (कुम्भ)', body: 'Calves, Shins', num: 11, color: 'text-indigo-300' },
              { sign: 'Pisces (मीन)', body: 'Feet', num: 12, color: 'text-violet-300' },
            ].map(s => (
              <div key={s.num} className="p-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/5">
                <span className={`font-bold ${s.color}`}>{s.num}. {s.sign}</span>
                <div className="text-text-tertiary mt-0.5">{s.body}</div>
              </div>
            ))}
          </div>
          <p className="text-text-tertiary text-xs mt-2">The body flows from head (Aries) to feet (Pisces) — initiative to dissolution, action to surrender.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          BPHS Ch.4 opens: <em>"O Brahmin, now I tell you about the nature of the Rashis."</em> Parashara describes each sign's physical form (Ram, Bull, Twins...), the direction it faces, the terrain it inhabits (forest, water, market, etc.), its caste (Brahmana, Kshatriya, Vaishya, Shudra), and its gender. These aren't arbitrary — each detail encodes the sign's fundamental energy pattern. A "forest-dwelling" sign (Aries, Leo) has different energy from a "water-dwelling" sign (Cancer, Pisces).
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Parashara's Sign Descriptions — Complete Table</h3>
        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-1.5 text-gold-dark">#</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Sign</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Form</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Lord</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Gender</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Nature</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Habitat</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { n: 1, sign: 'Aries / मेष', form: 'Ram', lord: 'Mars', gender: 'M', nature: 'Movable/Fire', hab: 'Forest, hills' },
                { n: 2, sign: 'Taurus / वृषभ', form: 'Bull', lord: 'Venus', gender: 'F', nature: 'Fixed/Earth', hab: 'Agricultural land' },
                { n: 3, sign: 'Gemini / मिथुन', form: 'Couple', lord: 'Mercury', gender: 'M', nature: 'Dual/Air', hab: 'Bedroom, garden' },
                { n: 4, sign: 'Cancer / कर्क', form: 'Crab', lord: 'Moon', gender: 'F', nature: 'Movable/Water', hab: 'Water, rivers' },
                { n: 5, sign: 'Leo / सिंह', form: 'Lion', lord: 'Sun', gender: 'M', nature: 'Fixed/Fire', hab: 'Forest, cave' },
                { n: 6, sign: 'Virgo / कन्या', form: 'Maiden+boat', lord: 'Mercury', gender: 'F', nature: 'Dual/Earth', hab: 'Market, office' },
                { n: 7, sign: 'Libra / तुला', form: 'Man+scales', lord: 'Venus', gender: 'M', nature: 'Movable/Air', hab: 'Market, trade' },
                { n: 8, sign: 'Scorpio / वृश्चिक', form: 'Scorpion', lord: 'Mars', gender: 'F', nature: 'Fixed/Water', hab: 'Holes, caves' },
                { n: 9, sign: 'Sagittarius / धनु', form: 'Centaur+bow', lord: 'Jupiter', gender: 'M', nature: 'Dual/Fire', hab: 'War field, stable' },
                { n: 10, sign: 'Capricorn / मकर', form: 'Crocodile', lord: 'Saturn', gender: 'F', nature: 'Movable/Earth', hab: 'Water+forest' },
                { n: 11, sign: 'Aquarius / कुम्भ', form: 'Man+pot', lord: 'Saturn', gender: 'M', nature: 'Fixed/Air', hab: 'Potter\'s workshop' },
                { n: 12, sign: 'Pisces / मीन', form: 'Two fish', lord: 'Jupiter', gender: 'F', nature: 'Dual/Water', hab: 'Ocean, temple' },
              ].map(r => (
                <tr key={r.n} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-1.5 text-text-tertiary">{r.n}</td>
                  <td className="py-1.5 px-1.5 text-gold-light font-medium">{r.sign}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.form}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.lord}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.gender}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.nature}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.hab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "The sign descriptions are just poetic metaphors with no practical use."<br />
          <span className="text-emerald-300">Reality:</span> Each attribute has practical application. Prashna (horary) astrology uses sign habitats to determine WHERE lost objects might be found — an object lost during a Cancer Lagna may be near water. Medical astrology uses the body mapping for health predictions.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Aquarius is a water sign because it's the 'water bearer'."<br />
          <span className="text-emerald-300">Reality:</span> Aquarius is an AIR sign. The water bearer (man pouring water from a pot) represents the distribution of knowledge, not the water element itself. The water signs are Cancer, Scorpio, and Pisces — all depicted as water creatures.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-blue-300 font-bold">Fully used.</span> Sign descriptions from BPHS are used in every chart interpretation. The Kalapurusha body mapping is the basis of medical astrology. Sign habitats are used in Prashna. The form descriptions (biped/quadruped/insect/water) affect how signs express — a human-form sign (Gemini, Virgo, Libra) produces more intellectual expression than an animal-form sign (Aries, Taurus, Leo).
        </p>
      </section>
    </div>
  );
}

export default function Module3_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}
