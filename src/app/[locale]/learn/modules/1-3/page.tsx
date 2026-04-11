'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_1_3', phase: 1, topic: 'Foundations', moduleNumber: '1.3',
  title: { en: 'The Zodiac Belt — Fixed Stars vs Moving Planets', hi: 'राशिचक्र — स्थिर तारे बनाम गतिशील ग्रह' },
  subtitle: { en: 'How ancient Indians identified 27 marker stars and built the Nakshatra system', hi: 'कैसे प्राचीन भारतीयों ने 27 चिह्नक तारे पहचाने और नक्षत्र प्रणाली बनाई' },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: '1.2 Measuring the Sky', hi: '1.2 आकाश मापन' }, href: '/learn/modules/1-2' },
    { label: { en: 'Nakshatras deep dive', hi: 'नक्षत्र विस्तृत' }, href: '/learn/nakshatras' },
    { label: { en: 'Ayanamsha', hi: 'अयनांश' }, href: '/learn/ayanamsha' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q1_3_01', type: 'mcq', question: { en: 'What is a "Yogtara" in the Nakshatra system?', hi: 'नक्षत्र प्रणाली में "योगतारा" क्या है?' }, options: [{ en: 'A planet that forms yoga', hi: 'एक ग्रह जो योग बनाता है' }, { en: 'The brightest star identifying each Nakshatra', hi: 'प्रत्येक नक्षत्र की पहचान करने वाला सबसे चमकीला तारा' }, { en: 'A type of yoga calculation', hi: 'एक प्रकार की योग गणना' }, { en: 'The pole star', hi: 'ध्रुव तारा' }], correctAnswer: 1, explanation: { en: 'A Yogtara (junction star) is the primary star that identifies each of the 27 Nakshatras. For example, Chitra\'s yogtara is Spica (Alpha Virginis), Rohini\'s is Aldebaran (Alpha Tauri). Ancient astronomers used these as reference markers.', hi: 'योगतारा प्रत्येक 27 नक्षत्र की पहचान करने वाला प्राथमिक तारा है। जैसे चित्रा का योगतारा Spica है, रोहिणी का Aldebaran।' }, classicalRef: 'Surya Siddhanta Ch.8' },
  { id: 'q1_3_02', type: 'mcq', question: { en: 'Which star anchors the Lahiri Ayanamsha system at 180° sidereal longitude?', hi: 'लाहिरी अयनांश प्रणाली में 180° निरयन देशांतर पर कौन सा तारा स्थिर है?' }, options: [{ en: 'Polaris (Dhruva)', hi: 'ध्रुव तारा' }, { en: 'Aldebaran (Rohini)', hi: 'एल्डेबैरन (रोहिणी)' }, { en: 'Spica / Chitra (Alpha Virginis)', hi: 'स्पाइका / चित्रा' }, { en: 'Regulus (Magha)', hi: 'रेगुलस (मघा)' }], correctAnswer: 2, explanation: { en: 'The Lahiri (Chitrapaksha) Ayanamsha defines Spica (Chitra yogtara, Alpha Virginis) as exactly 180° sidereal longitude — the start of Libra. This is why it\'s called "Chitrapaksha" — the system anchored to Chitra. The 1956 Indian Calendar Reform Committee chose this anchor.', hi: 'लाहिरी (चित्रपक्ष) अयनांश Spica (चित्रा योगतारा) को ठीक 180° निरयन देशांतर पर परिभाषित करता है। इसीलिए इसे "चित्रपक्ष" कहते हैं।' }, classicalRef: 'Indian Calendar Reform Committee, 1956' },
  { id: 'q1_3_03', type: 'true_false', question: { en: 'The physical constellations and the 30° zodiac signs are the same thing.', hi: 'भौतिक तारामंडल और 30° राशियाँ एक ही चीज़ हैं।' }, correctAnswer: false, explanation: { en: 'They are fundamentally different. Constellations (Tara Mandal) are physical groupings of stars with UNEQUAL spans — Virgo covers ~44°, Cancer only ~20°. Signs (Rashis) are EQUAL 30° mathematical divisions of the ecliptic. They were approximately aligned ~2000 years ago but have since diverged due to precession.', hi: 'वे मूलभूत रूप से भिन्न हैं। तारामंडल असमान विस्तार वाले भौतिक तारा-समूह हैं। राशियाँ क्रान्तिवृत्त के समान 30° गणितीय विभाजन हैं।' } },
  { id: 'q1_3_04', type: 'mcq', question: { en: 'The modern IAU constellation Virgo spans about 44°, while the Jyotish sign Virgo (Kanya) spans:', hi: 'आधुनिक IAU तारामंडल कन्या ~44° तक फैला है, जबकि ज्योतिष राशि कन्या का विस्तार:' }, options: [{ en: '44° (same as the constellation)', hi: '44° (तारामंडल जैसा)' }, { en: '30° (equal division)', hi: '30° (समान विभाजन)' }, { en: '13°20\' (one nakshatra)', hi: '13°20\' (एक नक्षत्र)' }, { en: 'It varies each year', hi: 'यह हर वर्ष बदलता है' }], correctAnswer: 1, explanation: { en: 'Every Jyotish sign is exactly 30° — this is a mathematical definition, not a physical measurement. The constellation Virgo\'s size is irrelevant to the sign Kanya\'s size. This equal division is what makes Jyotish calculations possible — you can\'t do precise math with unequal, fuzzy constellation boundaries.', hi: 'प्रत्येक ज्योतिष राशि ठीक 30° है — यह गणितीय परिभाषा है। तारामंडल कन्या का आकार राशि कन्या के आकार से असंबंधित है।' } },
  { id: 'q1_3_05', type: 'mcq', question: { en: 'Ancient astronomers mapped the ecliptic without telescopes by:', hi: 'प्राचीन खगोलशास्त्रियों ने बिना दूरबीन के क्रान्तिवृत्त का मानचित्रण किया:' }, options: [{ en: 'Observing which stars appear just before sunrise over many years (heliacal risings)', hi: 'वर्षों तक सूर्योदय से पहले कौन से तारे दिखते हैं यह देखकर (heliacal risings)' }, { en: 'Using mathematics alone without observation', hi: 'बिना अवलोकन के केवल गणित से' }, { en: 'By consulting other civilizations', hi: 'अन्य सभ्यताओं से परामर्श करके' }, { en: 'Random assignment', hi: 'यादृच्छिक निर्धारण' }], correctAnswer: 0, explanation: { en: 'By noting which stars were visible on the eastern horizon just before sunrise (heliacal rising), astronomers tracked the Sun\'s position against the star background throughout the year. Since the Sun obscures nearby stars with its brightness, the stars visible at dawn are those ~90° away — and by tracking these systematically, the entire ecliptic was mapped.', hi: 'सूर्योदय से पहले क्षितिज पर कौन से तारे दिखते हैं (heliacal rising) — इससे पूरे वर्ष सूर्य की तारों के विरुद्ध स्थिति का मानचित्रण।' } },
  { id: 'q1_3_06', type: 'mcq', question: { en: 'The Rohini yogtara (Aldebaran / Alpha Tauri) is which color?', hi: 'रोहिणी योगतारा (Aldebaran) किस रंग का है?' }, options: [{ en: 'Blue-white', hi: 'नीला-सफेद' }, { en: 'Orange-red', hi: 'नारंगी-लाल' }, { en: 'Yellow like the Sun', hi: 'सूर्य जैसा पीला' }, { en: 'It\'s invisible to the naked eye', hi: 'यह नंगी आंखों से अदृश्य है' }], correctAnswer: 1, explanation: { en: 'Aldebaran is a red giant star — distinctly orange-red, and one of the brightest stars in the sky (magnitude ~0.85). The name "Rohini" itself comes from "Rohita" (रोहित) = red/reddish. The naming reflects careful observation of the star\'s actual appearance.', hi: 'Aldebaran एक लाल विशालकाय तारा है — स्पष्ट रूप से नारंगी-लाल। "रोहिणी" नाम "रोहित" (लाल) से आता है — नामकरण तारे के वास्तविक स्वरूप का अवलोकन दर्शाता है।' } },
  { id: 'q1_3_07', type: 'true_false', question: { en: 'The 27 Nakshatras were chosen because the Moon takes approximately 27.3 days for one sidereal revolution.', hi: '27 नक्षत्र इसलिए चुने गए क्योंकि चंद्रमा एक नाक्षत्रिक परिक्रमा में लगभग 27.3 दिन लेता है।' }, correctAnswer: true, explanation: { en: 'Correct. The Moon\'s sidereal period is 27.3217 days — very close to 27. So the Moon moves through approximately one nakshatra per day. This made nakshatras a natural "daily calendar" — you could tell the date by knowing which nakshatra the Moon was in.', hi: 'सही। चंद्रमा का नाक्षत्रिक काल 27.3217 दिन है — 27 के बहुत निकट। चंद्रमा प्रतिदिन ~एक नक्षत्र पार करता है — नक्षत्र एक "दैनिक कैलेंडर" है।' } },
  { id: 'q1_3_08', type: 'mcq', question: { en: 'What problem does the "identification" of yogtaras solve?', hi: 'योगतारों की "पहचान" कौन सी समस्या हल करती है?' }, options: [{ en: 'It tells us the planets\' speeds', hi: 'यह ग्रहों की गति बताती है' }, { en: 'It anchors the sidereal coordinate system to physical stars so it doesn\'t drift', hi: 'यह निरयन निर्देशांक को भौतिक तारों से जोड़ती है ताकि यह विचलित न हो' }, { en: 'It determines the Moon\'s phase', hi: 'यह चंद्र कलाएं निर्धारित करती है' }, { en: 'It calculates eclipses', hi: 'यह ग्रहण की गणना करती है' }], correctAnswer: 1, explanation: { en: 'The fundamental purpose of yogtaras is to ANCHOR the sidereal coordinate system to physical stars. Without this anchor, the coordinate system would drift with precession (like the tropical system does). The Lahiri ayanamsha specifically uses Spica/Chitra at 180° as its anchor point.', hi: 'योगतारों का मूल उद्देश्य निरयन निर्देशांक को भौतिक तारों से जोड़ना है। बिना इस एंकर के, निर्देशांक प्रिसेशन से विचलित हो जाता (जैसे सायन प्रणाली)।' } },
  { id: 'q1_3_09', type: 'true_false', question: { en: 'The zodiac belt is about 360° wide.', hi: 'राशिचक्र पट्टी लगभग 360° चौड़ी है।' }, correctAnswer: false, explanation: { en: 'The zodiac is 360° LONG (circumference of the ecliptic circle) but only about 16° WIDE (8° on each side of the ecliptic). The "width" accommodates the orbital inclinations of planets. The "length" is the full circle we divide into signs and nakshatras.', hi: 'राशिचक्र 360° लम्बा है (क्रान्तिवृत्त की परिधि) लेकिन केवल ~16° चौड़ा। "चौड़ाई" ग्रहों के कक्षीय झुकाव को समायोजित करती है।' } },
  { id: 'q1_3_10', type: 'mcq', question: { en: 'If a new "planet" were discovered orbiting the Sun at 45° inclination to the ecliptic, would Jyotish need to include it?', hi: 'यदि क्रान्तिवृत्त से 45° झुकाव पर एक नया "ग्रह" खोजा जाए, तो क्या ज्योतिष में इसे शामिल करना होगा?' }, options: [{ en: 'Yes, all planets must be included', hi: 'हाँ, सभी ग्रह शामिल करने होंगे' }, { en: 'No — it would spend most of its time outside the zodiac belt, making sign placement meaningless', hi: 'नहीं — यह अधिकांश समय राशिचक्र पट्टी से बाहर रहेगा, राशि स्थिति अर्थहीन' }, { en: 'Only if it\'s visible to the naked eye', hi: 'केवल नंगी आंखों से दिखे तो' }, { en: 'Only during retrograde', hi: 'केवल वक्री गति में' }], correctAnswer: 1, explanation: { en: 'A body at 45° inclination would spend most of its orbit far from the ecliptic — outside the zodiac belt entirely. Assigning it a "sign" would be physically meaningless since signs are defined along the ecliptic. This is actually why Jyotish doesn\'t use Pluto (17° inclination), Eris (44°), or asteroids — they don\'t stay on the "highway."', hi: '45° झुकाव पर एक पिंड अधिकांश कक्षा में क्रान्तिवृत्त से बहुत दूर होगा। राशि निर्धारण भौतिक रूप से अर्थहीन। इसीलिए ज्योतिष प्लूटो (17°) या क्षुद्रग्रह प्रयोग नहीं करता।' } },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Sky as a Stage — Two Types of Actors</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Look up at the night sky and you see two fundamentally different types of objects. First, the <span className="text-gold-light font-bold">fixed stars</span> (Tara, तारा) — thousands of points of light that maintain their relative positions night after night, year after year, century after century. The Big Dipper (Saptarishi) looked essentially the same to your ancestors 5,000 years ago. These are the <span className="text-gold-light">backdrop</span> — the stage set that doesn't change.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Second, the <span className="text-gold-light font-bold">Grahas</span> — the seven "wanderers" (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) plus the two shadow points (Rahu, Ketu). These move against the fixed star backdrop, each at its own speed: the Moon races through ~13° per day, Saturn crawls at ~0.03° per day. These are the <span className="text-gold-light">actors</span> performing on the stage.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Jyotish is fundamentally about the <span className="text-gold-light font-bold">relationship between the moving actors and the fixed stage</span>. The Nakshatra system is how ancient Indians <em>labeled</em> the stage — dividing it into 27 marked sections so they could precisely describe where each actor was at any given moment.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          The word <span className="text-gold-light font-bold">Nakshatra</span> (नक्षत्र) is debated etymologically: some derive it from <em>naksha</em> (नक्ष, to approach) + <em>tra</em> (त्र, protector) = "that which approaches and protects." Others from <em>na</em> (न, not) + <em>kshatra</em> (क्षत्र, destructible) = "indestructible" — referring to the fixed stars' permanence. The Rig Veda (one of the oldest texts in any language) mentions nakshatras, placing their use at least 3,500 years ago. The Vedanga Jyotisha (~1200 BCE) gives the earliest systematic nakshatra list.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Each nakshatra is identified by a <span className="text-gold-light font-bold">Yogtara</span> (योगतारा) — a "junction star" or "identifying star." This is the brightest or most prominent star within that nakshatra's span. The Surya Siddhanta (Ch.8) gives the celestial coordinates of all 27 yogtaras, enabling precise identification thousands of years later.
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 27 Yogtaras — India's Star Catalog</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The identification of specific stars with specific nakshatras is one of India's great astronomical achievements. Here are some key yogtara identifications that connect the ancient Sanskrit names to modern stellar catalogs:
        </p>

        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Nakshatra</th>
              <th className="text-left py-2 px-2 text-gold-dark">Sanskrit</th>
              <th className="text-left py-2 px-2 text-gold-dark">Yogtara (Modern)</th>
              <th className="text-left py-2 px-2 text-gold-dark">Magnitude</th>
              <th className="text-left py-2 px-2 text-gold-dark">Significance</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { nak: 'Ashwini', sa: 'अश्विनी', star: 'β Arietis (Sheratan)', mag: '2.6', sig: 'First nakshatra — beginning of the zodiac' },
                { nak: 'Rohini', sa: 'रोहिणी', star: 'Aldebaran (α Tauri)', mag: '0.85', sig: 'Red giant — name means "red/reddish"' },
                { nak: 'Ardra', sa: 'आर्द्रा', star: 'Betelgeuse (α Orionis)', mag: '0.42', sig: 'Red supergiant, one of largest known stars' },
                { nak: 'Pushya', sa: 'पुष्य', star: 'δ Cancri (Asellus Australis)', mag: '3.9', sig: 'Most auspicious nakshatra for muhurta' },
                { nak: 'Magha', sa: 'मघा', star: 'Regulus (α Leonis)', mag: '1.35', sig: '"The great one" — royal star' },
                { nak: 'Chitra', sa: 'चित्रा', star: 'Spica (α Virginis)', mag: '0.97', sig: 'ANCHORS the Lahiri ayanamsha at 180°' },
                { nak: 'Swati', sa: 'स्वाति', star: 'Arcturus (α Boötis)', mag: '-0.05', sig: '4th brightest star in the sky' },
                { nak: 'Jyeshtha', sa: 'ज्येष्ठा', star: 'Antares (α Scorpii)', mag: '1.06', sig: 'Red supergiant — "rival of Mars" in color' },
                { nak: 'Shravana', sa: 'श्रवण', star: 'Altair (α Aquilae)', mag: '0.77', sig: '"The listener" — associated with learning' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-2 text-gold-light font-medium">{row.nak}</td>
                  <td className="py-1.5 px-2 text-text-tertiary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{row.sa}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.star}</td>
                  <td className="py-1.5 px-2 text-text-secondary font-mono">{row.mag}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.sig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Signs ≠ Constellations — A Critical Distinction</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          One of the most common sources of confusion in astrology — and one that Jyotish handles better than Western astrology — is the <span className="text-gold-light font-bold">difference between signs and constellations</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Constellations</span> (Tara Mandal, तारा मण्डल) are physical groupings of stars in the sky. They have <span className="text-red-400">irregular, unequal sizes</span>. The International Astronomical Union (IAU) defines 88 constellations with precise boundaries — and along the ecliptic, the constellation sizes vary wildly: Virgo spans ~44°, Scorpius only ~7° of ecliptic longitude, and there's even a 13th constellation (Ophiuchus) that the ecliptic passes through.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Signs</span> (Rashi, राशि) are <span className="text-emerald-400">equal 30° mathematical divisions</span>. They are a coordinate system, not a physical entity. Think of longitude lines on Earth — they don't correspond to physical features, they're a grid system for specifying location. Similarly, when we say "Jupiter is in Leo," we mean Jupiter is in the 5th 30° sector of the ecliptic — regardless of where the physical constellation Leo's stars are.
        </p>
      </section>

      <ExampleChart
        ascendant={6}
        planets={{ 1: [3] }}
        title="Planet at 175° — Virgo 25° (Chitra Nakshatra)"
        highlight={[1]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example: The Zodiacal Position Problem</h4>
        <div className="space-y-3">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">Scenario:</span> A planet is at 175° sidereal longitude. Where is it?
          </p>
          <div className="font-mono text-xs text-emerald-300 space-y-1">
            <div>Sign = floor(175/30) + 1 = floor(5.833) + 1 = 5 + 1 = <span className="text-gold-light font-bold">6 = Virgo (Kanya)</span></div>
            <div>Position in sign = 175 mod 30 = <span className="text-gold-light">25°</span> Virgo</div>
            <div>Nakshatra = floor(175/13.333) + 1 = floor(13.125) + 1 = <span className="text-gold-light font-bold">14 = Chitra</span></div>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            Now, the physical star Spica (Chitra yogtara) is at exactly 180° sidereal by definition (Lahiri). Our planet at 175° is 5° before Spica — it's approaching the Chitra yogtara. This is a case where the mathematical system and the physical stars agree beautifully.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "There should be 13 signs because the Sun passes through Ophiuchus."<br />
          <span className="text-emerald-300">Reality:</span> Signs are 30° mathematical sectors, not constellation boundaries. Ophiuchus is a constellation, not a sign. Adding it would break the 12 × 30° = 360° framework. This "13th sign" claim misunderstands what signs ARE.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Nakshatras are Indian constellations."<br />
          <span className="text-emerald-300">Reality:</span> Nakshatras are EQUAL 13°20' sectors — not constellations. Each is identified by a yogtara, but the nakshatra's span is mathematical, not defined by the physical star pattern's extent.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Fixed stars don't move at all."<br />
          <span className="text-emerald-300">Reality:</span> Stars have "proper motion" — they do move, but so slowly that it takes thousands of years to be noticeable. Barnard's Star (fastest proper motion) moves 10.3" per year. For practical Jyotish, stars are effectively fixed over human timescales.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">The sign system is fully valid</span> — it's a mathematical coordinate system, and math doesn't expire. The yogtara identifications are <span className="text-blue-300 font-bold">mostly valid</span> — a few identifications are debated (especially for faint nakshatras like Anuradha and Dhanishtha), but the major ones (Rohini=Aldebaran, Chitra=Spica, Magha=Regulus, Jyeshtha=Antares) are certain.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our app uses Swiss Ephemeris / Meeus algorithms for planet positions, but the coordinate mapping (degree → sign, degree → nakshatra) uses exactly the ancient formulas: <code className="text-emerald-300">sign = floor(longitude/30) + 1</code>.
        </p>
      </section>
    </div>
  );
}

export default function Module1_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}
