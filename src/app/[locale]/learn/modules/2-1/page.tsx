'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_2_1', phase: 1, topic: 'Grahas', moduleNumber: '2.1',
  title: { en: 'The Nine Grahas — Nature & Karakatva', hi: 'नवग्रह — प्रकृति एवं कारकत्व' },
  subtitle: { en: 'Understanding each planet\'s fundamental nature, attributes, and what it signifies in a birth chart', hi: 'प्रत्येक ग्रह की मूल प्रकृति, गुण और जन्म कुण्डली में कारकत्व समझें' },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: '2.2 Planetary Relationships', hi: '2.2 ग्रह संबंध' }, href: '/learn/modules/2-2' },
    { label: { en: '2.3 Dignities', hi: '2.3 गरिमाएं' }, href: '/learn/modules/2-3' },
    { label: { en: 'Grahas reference', hi: 'ग्रह संदर्भ' }, href: '/learn/grahas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q2_1_01', type: 'mcq', question: { en: 'The Sanskrit word "Graha" literally means:', hi: 'संस्कृत शब्द "ग्रह" का शाब्दिक अर्थ है:' }, options: [{ en: 'Planet', hi: 'ग्रह (planet)' }, { en: 'That which grasps or seizes', hi: 'जो पकड़ता या आक्रमण करता है' }, { en: 'Star', hi: 'तारा' }, { en: 'Heavenly body', hi: 'आकाशीय पिंड' }], correctAnswer: 1, explanation: { en: 'Graha comes from the root "grah" (ग्रह्) meaning to seize, grasp, or eclipse. A Graha doesn\'t just exist — it ACTS on the native. This is why Rahu and Ketu (mathematical points, not physical bodies) are Grahas — they "grasp" the luminaries during eclipses.', hi: '"ग्रह" धातु "ग्रह्" से — जो पकड़े, ग्रसे या ग्रहण करे। ग्रह केवल अस्तित्व नहीं रखता — जातक पर कार्य करता है। इसलिए राहु-केतु (गणितीय बिंदु) भी ग्रह हैं — वे ग्रहण में ज्योतिर्मय पिंडों को ग्रसते हैं।' }, classicalRef: 'BPHS Ch.3 v.1' },
  { id: 'q2_1_02', type: 'mcq', question: { en: 'Which planet is the Karaka (significator) of the father?', hi: 'पिता का कारक ग्रह कौन है?' }, options: [{ en: 'Moon', hi: 'चन्द्र' }, { en: 'Mars', hi: 'मंगल' }, { en: 'Sun', hi: 'सूर्य' }, { en: 'Saturn', hi: 'शनि' }], correctAnswer: 2, explanation: { en: 'Sun is the Naisargika (natural) Karaka of the father, authority, government, soul (Atma), ego, vitality, and bones. Moon is mother, Mars is siblings/land, Mercury is speech/intellect, Jupiter is wisdom/children, Venus is marriage/luxury, Saturn is longevity/servants.', hi: 'सूर्य पिता, अधिकार, सरकार, आत्मा, अहंकार, जीवन शक्ति और अस्थियों का नैसर्गिक कारक है। चन्द्र=माता, मंगल=भाई/भूमि, बुध=वाणी/बुद्धि, गुरु=ज्ञान/संतान, शुक्र=विवाह/विलासिता, शनि=दीर्घायु/सेवक।' }, classicalRef: 'BPHS Ch.3' },
  { id: 'q2_1_03', type: 'mcq', question: { en: 'Rahu and Ketu are called "shadow planets" because:', hi: 'राहु और केतु "छाया ग्रह" कहलाते हैं क्योंकि:' }, options: [{ en: 'They are always in the shadow of the Sun', hi: 'वे हमेशा सूर्य की छाया में रहते हैं' }, { en: 'They are mathematical points (lunar nodes) without physical bodies', hi: 'वे भौतिक शरीर रहित गणितीय बिंदु (चंद्र नोड) हैं' }, { en: 'They can only be seen at night', hi: 'वे केवल रात में दिखते हैं' }, { en: 'They move very slowly', hi: 'वे बहुत धीरे चलते हैं' }], correctAnswer: 1, explanation: { en: 'Rahu (ascending node) and Ketu (descending node) are the two points where the Moon\'s orbit intersects the ecliptic. They have no physical body — they are mathematical points. But they CAUSE eclipses (when Sun/Moon are near these points), hence "Chaya Graha" (shadow planets). They are always exactly 180° apart and move retrograde at ~19.4° per year.', hi: 'राहु (आरोही नोड) और केतु (अवरोही नोड) वे बिंदु हैं जहां चंद्र की कक्षा क्रान्तिवृत्त को काटती है। कोई भौतिक शरीर नहीं — गणितीय बिंदु। लेकिन ग्रहण इन्हीं के कारण — इसलिए "छाया ग्रह"।' }, classicalRef: 'Surya Siddhanta Ch.2' },
  { id: 'q2_1_04', type: 'mcq', question: { en: 'Which classification system divides the 9 Grahas into Sattvic, Rajasic, and Tamasic?', hi: 'कौन सी वर्गीकरण प्रणाली 9 ग्रहों को सात्विक, राजसिक और तामसिक में बांटती है?' }, options: [{ en: 'The Guna system', hi: 'गुण प्रणाली' }, { en: 'The Drishti system', hi: 'दृष्टि प्रणाली' }, { en: 'The Varga system', hi: 'वर्ग प्रणाली' }, { en: 'The Dasha system', hi: 'दशा प्रणाली' }], correctAnswer: 0, explanation: { en: 'The three Gunas (qualities): Sattvic (pure/spiritual) = Sun, Moon, Jupiter. Rajasic (active/passionate) = Mercury, Venus. Tamasic (inert/dark) = Mars, Saturn, Rahu, Ketu. This classification from BPHS Ch.3 determines the fundamental nature of each planet\'s influence.', hi: 'तीन गुण: सात्विक (शुद्ध) = सूर्य, चन्द्र, गुरु। राजसिक (सक्रिय) = बुध, शुक्र। तामसिक (जड़) = मंगल, शनि, राहु, केतु। BPHS अध्याय 3 से।' }, classicalRef: 'BPHS Ch.3 v.14' },
  { id: 'q2_1_05', type: 'true_false', question: { en: 'Mercury is naturally classified as a benefic planet.', hi: 'बुध स्वभावतः शुभ ग्रह है।' }, correctAnswer: false, explanation: { en: 'Mercury is NEUTRAL by nature — neither naturally benefic nor naturally malefic. It takes on the nature of the planets it associates with. When conjunct benefics (Jupiter, Venus), Mercury acts as benefic. When conjunct malefics (Mars, Saturn), it acts as malefic. This is why Mercury is called the "prince" — adaptable and impressionable.', hi: 'बुध स्वभावतः तटस्थ है — न शुभ न अशुभ। यह संगत ग्रहों का स्वभाव अपनाता है। शुभ ग्रहों के साथ शुभ, अशुभ के साथ अशुभ। इसलिए बुध "कुमार" (राजकुमार) — अनुकूलनीय और प्रभावशील।' }, classicalRef: 'BPHS Ch.3 v.11' },
  { id: 'q2_1_06', type: 'mcq', question: { en: 'Which planet is the Karaka (significator) of marriage and romantic relationships?', hi: 'विवाह और प्रेम संबंधों का कारक ग्रह कौन है?' }, options: [{ en: 'Moon', hi: 'चन्द्र' }, { en: 'Mars', hi: 'मंगल' }, { en: 'Jupiter', hi: 'गुरु' }, { en: 'Venus', hi: 'शुक्र' }], correctAnswer: 3, explanation: { en: 'Venus (Shukra) is the Karaka of marriage, romance, beauty, luxury, arts, vehicles, and sensual pleasures. In a man\'s chart, Venus represents the wife. Venus is the Guru (teacher) of the Asuras — and his knowledge includes the science of Sanjeevani (revival from death), making him the most materially powerful planet.', hi: 'शुक्र विवाह, प्रेम, सौंदर्य, विलासिता, कला, वाहन और इंद्रिय सुख का कारक है। पुरुष की कुण्डली में शुक्र पत्नी का प्रतिनिधित्व करता है। शुक्र असुरों का गुरु — संजीवनी विद्या का ज्ञाता।' }, classicalRef: 'BPHS Ch.3 v.23' },
  { id: 'q2_1_07', type: 'true_false', question: { en: 'Jyotish includes Uranus, Neptune, and Pluto as Grahas.', hi: 'ज्योतिष में यूरेनस, नेप्च्यून और प्लूटो ग्रहों के रूप में शामिल हैं।' }, correctAnswer: false, explanation: { en: 'Traditional Jyotish does NOT include outer planets. Reasons: (1) They are invisible to the naked eye — ancient texts are based on visible observation. (2) Their orbital inclinations are high (Pluto: 17°), taking them outside the zodiac belt. (3) The 9-Graha system is mathematically complete — Vimshottari Dasha uses exactly 9 lords for 27 nakshatras. Adding more would break this elegance. Some modern practitioners experiment with them, but classical Jyotish is explicit: 9 Grahas only.', hi: 'पारंपरिक ज्योतिष बाह्य ग्रह शामिल नहीं करता। कारण: (1) नंगी आंखों से अदृश्य। (2) उच्च कक्षीय झुकाव (प्लूटो: 17°)। (3) 9-ग्रह प्रणाली गणितीय रूप से पूर्ण — विंशोत्तरी दशा 27 नक्षत्रों के लिए ठीक 9 स्वामी प्रयोग करती है।' } },
  { id: 'q2_1_08', type: 'mcq', question: { en: 'In Jyotish, the Sun and Moon are called:', hi: 'ज्योतिष में सूर्य और चन्द्र को कहते हैं:' }, options: [{ en: 'Stars', hi: 'तारे' }, { en: 'Luminaries (Jyoti)', hi: 'ज्योतिर्मय पिंड (ज्योति)' }, { en: 'Inner planets', hi: 'आंतरिक ग्रह' }, { en: 'Gas giants', hi: 'गैस विशालकाय' }], correctAnswer: 1, explanation: { en: 'Sun and Moon are the two "luminaries" (Jyoti, ज्योति) — sources of light. The word Jyotish itself comes from "Jyoti" (light) + "Isha" (lord/science) = the science of celestial light. The Sun emits its own light; the Moon reflects the Sun\'s light. Together they govern the two most visible cycles: the year (Sun) and the month (Moon).', hi: 'सूर्य और चन्द्र दो "ज्योतिर्मय पिंड" (ज्योति) हैं। ज्योतिष शब्द "ज्योति" (प्रकाश) + "ईश" (स्वामी/विज्ञान) = आकाशीय प्रकाश का विज्ञान।' } },
  { id: 'q2_1_09', type: 'mcq', question: { en: 'Which planet rules both the 10th and 11th signs (Capricorn and Aquarius)?', hi: 'कौन सा ग्रह 10वीं और 11वीं राशि (मकर और कुम्भ) दोनों का स्वामी है?' }, options: [{ en: 'Jupiter', hi: 'गुरु' }, { en: 'Mars', hi: 'मंगल' }, { en: 'Saturn', hi: 'शनि' }, { en: 'Mercury', hi: 'बुध' }], correctAnswer: 2, explanation: { en: 'Saturn rules Capricorn (10th sign, earth, movable) and Aquarius (11th sign, air, fixed). The lordship pattern is symmetric: Sun and Moon each rule one sign (Leo and Cancer), then pairs outward: Mercury (Gemini/Virgo), Venus (Taurus/Libra), Mars (Aries/Scorpio), Jupiter (Sagittarius/Pisces), Saturn (Capricorn/Aquarius).', hi: 'शनि मकर (10वीं, पृथ्वी, चर) और कुम्भ (11वीं, वायु, स्थिर) का स्वामी है। स्वामित्व सममित है: सूर्य-चन्द्र एक-एक, फिर बाहर जोड़ियाँ: बुध, शुक्र, मंगल, गुरु, शनि।' }, classicalRef: 'BPHS Ch.3' },
  { id: 'q2_1_10', type: 'true_false', question: { en: 'Jupiter is considered the most benefic (auspicious) planet in Jyotish.', hi: 'गुरु (बृहस्पति) ज्योतिष में सबसे शुभ ग्रह माना जाता है।' }, correctAnswer: true, explanation: { en: 'Correct. Jupiter (Guru/Brihaspati) is the greatest natural benefic. As the Guru (teacher) of the Devas, he represents wisdom, dharma, expansion, children, and divine grace. Jupiter\'s aspect on ANY house or planet improves it. Even Jupiter in a dusthana (6/8/12) gives some protection. BPHS calls him "Devaguru" and assigns him the Sattvic guna.', hi: 'सही। गुरु (बृहस्पति) सबसे बड़ा नैसर्गिक शुभ ग्रह है। देवताओं के गुरु — ज्ञान, धर्म, विस्तार, संतान और दिव्य कृपा का प्रतिनिधि। गुरु की दृष्टि किसी भी भाव/ग्रह को सुधारती है।' }, classicalRef: 'BPHS Ch.3 v.20' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>What Is a Graha? More Than Just a Planet</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Western word "planet" comes from Greek <em>planetes</em> (πλανήτης) — "wanderer." It's a passive, descriptive term. The Sanskrit word <span className="text-gold-light font-bold">Graha</span> (ग्रह) comes from the root <em>grah</em> (ग्रह्) — to <span className="text-gold-light">seize, grasp, eclipse, or take possession of</span>. This is an <em>active</em> term. A Graha doesn't just exist in the sky — it <span className="text-gold-light font-bold">acts on you</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This etymological difference reveals a fundamental philosophical distinction. In Western astronomy, planets are objects to be studied. In Jyotish, Grahas are <span className="text-gold-light">forces that influence</span> — cosmic agents that "grasp" aspects of your life. When we say "Saturn is in your 7th house," we mean Saturn is <em>acting on</em> your relationships, <em>seizing</em> them with its characteristic energy of delay, discipline, and karma.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          There are <span className="text-gold-light font-bold">9 Grahas</span> in Jyotish — not 7, not 8, not 10. This number is not arbitrary: 27 nakshatras ÷ 9 grahas = 3 nakshatras per graha, forming the Vimshottari Dasha system. 9 × 9 = 81, the number of possible Mahadasha-Antardasha combinations. The entire predictive timing framework of Jyotish is built on this 9-fold structure.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Parashara opens BPHS Chapter 3 with: <em>"O Brahmin, I shall now tell you about the Grahas."</em> He describes each Graha's nature (Prakriti), appearance (Swarupa), ruling deity (Devata), element (Tattva), gender (Linga), caste (Varna), direction (Disha), and natural significations (Karakatva). This chapter is the foundation — without understanding each Graha's inherent nature, no chart can be read correctly.
        </p>
      </section>

      {/* Graha Classification Table */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Nine Grahas — Complete Classification</h3>
        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-1.5 text-gold-dark">Graha</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Sanskrit</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Nature</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Guna</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Gender</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Element</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Day</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Gem</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { name: 'Sun', sa: 'सूर्य', nature: 'Malefic', guna: 'Sattvic', gender: 'Male', element: 'Fire', day: 'Sunday', gem: 'Ruby', color: 'text-amber-400' },
                { name: 'Moon', sa: 'चन्द्र', nature: 'Benefic*', guna: 'Sattvic', gender: 'Female', element: 'Water', day: 'Monday', gem: 'Pearl', color: 'text-blue-300' },
                { name: 'Mars', sa: 'मंगल', nature: 'Malefic', guna: 'Tamasic', gender: 'Male', element: 'Fire', day: 'Tuesday', gem: 'Red Coral', color: 'text-red-400' },
                { name: 'Mercury', sa: 'बुध', nature: 'Neutral**', guna: 'Rajasic', gender: 'Neuter', element: 'Earth', day: 'Wednesday', gem: 'Emerald', color: 'text-emerald-400' },
                { name: 'Jupiter', sa: 'गुरु', nature: 'Benefic', guna: 'Sattvic', gender: 'Male', element: 'Ether', day: 'Thursday', gem: 'Yellow Sapphire', color: 'text-yellow-400' },
                { name: 'Venus', sa: 'शुक्र', nature: 'Benefic', guna: 'Rajasic', gender: 'Female', element: 'Water', day: 'Friday', gem: 'Diamond', color: 'text-pink-300' },
                { name: 'Saturn', sa: 'शनि', nature: 'Malefic', guna: 'Tamasic', gender: 'Neuter', element: 'Air', day: 'Saturday', gem: 'Blue Sapphire', color: 'text-slate-300' },
                { name: 'Rahu', sa: 'राहु', nature: 'Malefic', guna: 'Tamasic', gender: '—', element: '—', day: '—', gem: 'Hessonite', color: 'text-violet-400' },
                { name: 'Ketu', sa: 'केतु', nature: 'Malefic', guna: 'Tamasic', gender: '—', element: '—', day: '—', gem: "Cat's Eye", color: 'text-gray-400' },
              ].map((g, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className={`py-1.5 px-1.5 font-bold ${g.color}`}>{g.name}</td>
                  <td className="py-1.5 px-1.5 text-text-tertiary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{g.sa}</td>
                  <td className={`py-1.5 px-1.5 ${g.nature.includes('Benefic') ? 'text-emerald-400' : g.nature === 'Neutral**' ? 'text-amber-400' : 'text-red-400'}`}>{g.nature}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.guna}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.gender}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.element}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.day}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.gem}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-text-tertiary text-xs mt-2 space-y-0.5">
            <p>* Moon is benefic when waxing (Shukla Paksha) and malefic when waning (Krishna Paksha, specifically after K.Ashtami)</p>
            <p>** Mercury is neutral — adopts the nature of planets it associates with</p>
          </div>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Karakatva — What Each Graha Signifies</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Karakatva</span> (कारकत्व) means "signification" — the things a planet naturally represents regardless of which house it occupies. These are <span className="text-gold-light">Naisargika</span> (natural) Karakatvas, fixed by the planet's intrinsic nature. They differ from <span className="text-gold-light">Bhava</span> (house) Karakatvas, which depend on house placement.
        </p>

        <div className="space-y-3">
          {[
            { name: 'Sun (Surya)', sa: 'सूर्य', color: 'text-amber-400', border: 'border-amber-500/15', karakatva: 'Soul (Atma), father, authority, government, bones, heart, right eye, ego, vitality, copper, wheat, forest, temple, east direction', karakatvahi: 'आत्मा, पिता, अधिकार, सरकार, अस्थि, हृदय, दाहिना नेत्र, अहंकार, जीवनशक्ति' },
            { name: 'Moon (Chandra)', sa: 'चन्द्र', color: 'text-blue-300', border: 'border-blue-500/15', karakatva: 'Mind (Manas), mother, emotions, public, blood, left eye, fluids, travel, silver, rice, northwest direction', karakatvahi: 'मन, माता, भावनाएं, जनता, रक्त, बायां नेत्र, तरल, यात्रा, चांदी' },
            { name: 'Mars (Mangal)', sa: 'मंगल', color: 'text-red-400', border: 'border-red-500/15', karakatva: 'Courage, siblings (younger), land/property, energy, surgery, military, fire, red coral, south direction', karakatvahi: 'साहस, छोटे भाई-बहन, भूमि/संपत्ति, ऊर्जा, शल्यक्रिया, सेना, अग्नि' },
            { name: 'Mercury (Budha)', sa: 'बुध', color: 'text-emerald-400', border: 'border-emerald-500/15', karakatva: 'Intellect, speech, commerce, writing, mathematics, skin, nervous system, maternal uncle, north direction', karakatvahi: 'बुद्धि, वाणी, वाणिज्य, लेखन, गणित, त्वचा, मातुल (मामा)' },
            { name: 'Jupiter (Guru)', sa: 'गुरु', color: 'text-yellow-400', border: 'border-yellow-500/15', karakatva: 'Wisdom, dharma, children, teacher, husband (in female chart), liver, fat, gold, northeast direction, sacred texts', karakatvahi: 'ज्ञान, धर्म, संतान, गुरु, पति (स्त्री कुण्डली), यकृत, स्वर्ण, शास्त्र' },
            { name: 'Venus (Shukra)', sa: 'शुक्र', color: 'text-pink-300', border: 'border-pink-500/15', karakatva: 'Marriage, wife (in male chart), beauty, arts, music, luxury, vehicles, semen, diamond, southeast direction', karakatvahi: 'विवाह, पत्नी (पुरुष कुण्डली), सौंदर्य, कला, संगीत, विलासिता, वाहन, हीरा' },
            { name: 'Saturn (Shani)', sa: 'शनि', color: 'text-slate-300', border: 'border-slate-500/15', karakatva: 'Longevity, karma, servants, labor, iron, oil, chronic disease, delay, discipline, democracy, west direction', karakatvahi: 'दीर्घायु, कर्म, सेवक, श्रम, लोहा, तेल, दीर्घ रोग, विलम्ब, अनुशासन, लोकतंत्र' },
          ].map((g, i) => (
            <div key={i} className={`p-3 rounded-xl border ${g.border}`}>
              <div className={`font-bold text-sm ${g.color} mb-1`}>{g.name} <span className="text-text-tertiary font-normal text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>({g.sa})</span></div>
              <p className="text-text-secondary text-xs leading-relaxed">{g.karakatva}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Rahu & Ketu — The Shadow Grahas</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Rahu and Ketu deserve special attention because they are unique to Indian astronomy — no other civilization treated the lunar nodes as "planets" with astrological significance.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Astronomically:</span> The Moon's orbit is tilted ~5° to the ecliptic. It crosses the ecliptic at two points: the <span className="text-violet-400">ascending node</span> (Rahu — where the Moon crosses from south to north) and the <span className="text-gray-400">descending node</span> (Ketu — north to south). These points are always exactly 180° apart and move retrograde (backward through the zodiac) at about 19.4° per year, completing one full cycle in ~18.6 years.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Why they cause eclipses:</span> When the Sun or Moon is near a node (within ~18° for solar eclipses, ~12° for lunar eclipses), an eclipse occurs. This is why they're called <span className="text-gold-light">Chaya Graha</span> (छाया ग्रह) — shadow planets. The mythology of the serpent Svarbhanu being cut in two (head = Rahu, tail = Ketu) by Vishnu's Sudarshana Chakra is a narrative encoding of this astronomical fact.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "The Sun is a benefic planet because sunlight is good."<br />
          <span className="text-emerald-300">Reality:</span> In Jyotish, the Sun is a NATURAL MALEFIC (Papa Graha). Its energy is powerful but harsh — it burns (combustion), it demands (ego/authority), and its heat is scorching. Benefic/malefic doesn't mean good/bad — it describes the quality of energy.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Saturn is always bad."<br />
          <span className="text-emerald-300">Reality:</span> Saturn is the planet of KARMA — it gives you what you deserve, for better or worse. Saturn in the 10th house can give extraordinary career success through discipline. Saturn is the most democratic planet — he treats kings and beggars equally. He delays but ultimately delivers.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Rahu and Ketu are imaginary, so they can't affect you."<br />
          <span className="text-emerald-300">Reality:</span> They cause ECLIPSES — the most dramatic astronomical events visible from Earth. If they can block the Sun and Moon, the idea that they influence earthly affairs is at least astronomically grounded. They represent the karmic axis — Rahu = material desire (what you chase), Ketu = spiritual detachment (what you release).</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">The 7 visible Grahas</span> are real astronomical bodies whose positions are computed to sub-arcsecond precision by modern ephemerides. <span className="text-blue-300 font-bold">Rahu and Ketu</span> are mathematically precise points — the mean lunar node is computed analytically, the true node accounts for perturbations. NASA uses the same nodal calculations for eclipse prediction.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          What's <span className="text-amber-400">debatable</span> is whether these astronomical positions have the MEANINGS Jyotish assigns (karakatva). That's beyond the scope of astronomy — it's the interpretive layer. Our app computes positions with modern precision, then applies the classical interpretive framework from BPHS.
        </p>
      </section>

      <ExampleChart
        ascendant={1}
        planets={{ 6: [6], 10: [0], 4: [1], 1: [2] }}
        title="Saturn in 6th House — Karakatva Alignment"
        highlight={[6]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example: Reading Karakatvas in a Chart</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> Saturn (karaka of servants, labor, chronic disease) is in the 6th house (house of enemies, disease, daily work). What does this indicate?
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Analysis:</span> Saturn's karakatva (labor, discipline, chronic conditions) aligns with the 6th house's significations (daily work, health challenges, service). This is a case where the karaka is in a "friendly" house — Saturn can actually do well here. The native may overcome enemies through patience, excel in service-oriented work (healthcare, social work, legal aid), but must watch for chronic health conditions (Saturn = slow, 6th = disease → slow-developing ailments). This is actually considered a good placement (malefic in dusthana = protective, per Viparita Raja Yoga logic).
        </p>
      </section>
    </div>
  );
}

export default function Module2_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
