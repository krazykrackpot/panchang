'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/4-1.json';

const META: ModuleMeta = {
  id: 'mod_4_1', phase: 1, topic: 'Ayanamsha', moduleNumber: '4.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Opening Hook */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'पुरस्सरण क्या है और यह क्यों महत्त्वपूर्ण है' : 'What Is Precession and Why It Matters'}
        </h3>
        <p className="text-gold-light/90 text-sm leading-relaxed mb-4 italic border-l-2 border-gold-primary/30 pl-4">
          {isHi
            ? 'प्रत्येक 72 वर्ष में आपकी राशि 1 अंश खिसकती है। 2000 वर्षों में यह पूरी एक राशि खिसक जाती है। यह ज्योतिष नहीं — यह भौतिकशास्त्र है। और यही कारण है कि आपकी वैदिक राशि आपकी पश्चिमी राशि से भिन्न है।'
            : 'Every 72 years, your zodiac sign shifts by 1 degree. In 2,000 years, it shifts by an entire sign. This isn\'t astrology — it\'s physics. And it\'s the reason your Vedic sign differs from your Western sign.'}
        </p>
      </section>

      {/* The Spinning Top Analogy */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'लट्टू की उपमा' : 'The Spinning Top Analogy'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'मेज़ पर एक घूमते हुए लट्टू की कल्पना कीजिए। जैसे-जैसे यह घूमता है, इसका अक्ष हवा में धीरे-धीरे एक वृत्त बनाता है — इसे पुरस्सरण कहते हैं। पृथ्वी ठीक यही करती है। पृथ्वी का घूर्णन अक्ष अन्तरिक्ष में एक शंकु बनाते हुए घूमता है, एक पूर्ण चक्र 25,772 वर्षों में पूरा करता है। इसे "प्लेटोनिक वर्ष" या "महावर्ष" कहा जाता है।'
            : 'Imagine a spinning top on a table. As it spins, its axis slowly traces a circle in the air — that\'s precession. Earth does exactly the same thing. Earth\'s rotation axis traces a cone in space, completing one full circle every 25,772 years. This is called the "Platonic Year" or "Great Year."'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'भौतिकशास्त्र: सूर्य और चन्द्रमा का गुरुत्वाकर्षण पृथ्वी के भूमध्यरेखीय उभार पर खींचता है (पृथ्वी ध्रुवों की तुलना में भूमध्य रेखा पर 43 किलोमीटर अधिक चौड़ी है)। यह एक बलाघूर्ण उत्पन्न करता है जो घूर्णन अक्ष को धीरे-धीरे घुमाता है। दर: 50.29 कलांश/वर्ष, अर्थात् प्रत्येक 71.6 वर्ष में 1 अंश।'
            : 'The physics: the Sun and Moon\'s gravitational pull acts on Earth\'s equatorial bulge (Earth is 43 kilometres wider at the equator than from pole to pole). This creates a torque that slowly tilts the rotation axis. Rate: 50.29 arcseconds per year, which equals 1 degree every 71.6 years.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'परिणाम: वसन्त सम्पात (जहाँ सूर्य खगोलीय भूमध्य रेखा को पार करता है) क्रान्तिवृत्त के सापेक्ष धीरे-धीरे पश्चिम की ओर विस्थापित होता है। इसका अर्थ है कि सायन राशिचक्र (सम्पातों पर आधारित) और निरयन राशिचक्र (तारों पर आधारित) धीरे-धीरे अलग होते जाते हैं। अयनांश = सायन और निरयन के बीच संचित कोणीय अन्तर। आज: ~24.22° (लहिरी)। प्रत्येक शताब्दी में ~1.4° की वृद्धि।'
            : 'The consequence: the vernal equinox (the point where the Sun crosses the celestial equator) slowly drifts westward along the ecliptic. This means the tropical zodiac (anchored to equinoxes) and the sidereal zodiac (anchored to fixed stars) slowly separate. The ayanamsha is the accumulated angular gap between them. Today: ~24.22 degrees (Lahiri). Growing at ~1.4 degrees per century.'}
        </p>
      </section>

      {/* Historical Discovery */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'ऐतिहासिक खोज' : 'Historical Discovery'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'हिपार्कस (लगभग 150 ई.पू., ग्रीस): 150 वर्षों के अन्तराल पर तारा-सूचियों की तुलना करके पुरस्सरण को मापने वाले प्रथम व्यक्ति। उनका अनुमान: 36 कलांश/वर्ष (वास्तविक: 50.3 कलांश/वर्ष)। उन्होंने देखा कि तारों की स्थितियाँ पिछली सूचियों से व्यवस्थित रूप से खिसकी हुई थीं — एक ही दिशा में, एक स्थिर दर से।'
            : 'Hipparchus (c. 150 BCE, Greece): First to measure precession by comparing star catalogues 150 years apart. His estimate: 36 arcseconds per year (actual: 50.3 arcseconds per year). He noticed that star positions had systematically shifted from earlier catalogues — all in the same direction, at a steady rate.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'भारतीय खोज (स्वतन्त्र): सूर्य सिद्धान्त ने पुरस्सरण का वर्णन किया किन्तु "कम्पन" (दोलन) प्रतिरूप प्रयोग किया — अधिकतम ±27° तक दोलन। यह त्रुटिपूर्ण था; पुरस्सरण वस्तुतः एकदिशात्मक है। वराहमिहिर (505 ई.) ने पञ्चसिद्धान्तिका में पाँच खगोलीय पद्धतियों की तुलना की और विस्थापित होते सम्पात को नोट किया। भास्कराचार्य द्वितीय (1150 ई.) ने आधुनिक मान के निकट पुरस्सरण दर दी।'
            : 'Indian discovery (independent): The Surya Siddhanta described precession but used a "trepidation" model — an oscillation with a maximum of plus or minus 27 degrees. This was wrong; precession is actually monotonic (one-directional). Varahamihira (505 CE) compared five astronomical systems in the Pancha Siddhantika and noted the shifting equinox. Bhaskaracharya II (1150 CE) gave a precession rate close to the modern value.'}
        </p>
      </section>

      {/* Classical Origin Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'सूर्य सिद्धान्त, अध्याय 3: "सम्पात बिन्दु क्रान्तिवृत्त के अनुदिश गति करते हैं, कभी पूर्व की ओर, कभी पश्चिम की ओर, 54 कलांश (प्रति वर्ष) की दर से।" यह कम्पन प्रतिरूप था — दिशा उलटने का विचार सूर्य सिद्धान्त की एकमात्र बड़ी त्रुटि थी। फिर भी, यह तथ्य कि प्राचीन भारतीय खगोलशास्त्रियों ने पुरस्सरण को बिल्कुल भी पहचाना, एक उल्लेखनीय उपलब्धि है।'
            : 'Surya Siddhanta, Chapter 3: "The solstitial points move along the ecliptic, sometimes eastward, sometimes westward, at the rate of 54 arcseconds (per year)." This was the trepidation model — the idea that the direction reverses was the Surya Siddhanta\'s one major error. Yet the fact that ancient Indian astronomers recognized precession at all was a remarkable achievement.'}
        </p>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 2 — The Ayanamsha: Where Tropical and Sidereal Diverge
   ═══════════════════════════════════════════════════════════════ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Zero Ayanamsha Date */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अयनांश — जहाँ सायन और निरयन विभक्त होते हैं' : 'The Ayanamsha — Where Tropical and Sidereal Diverge'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'राशिचक्र कब संरेखित थे? इसे "शून्य अयनांश तिथि" कहते हैं — वह युग जब सायन = निरयन। विभिन्न पद्धतियाँ असहमत हैं, क्योंकि प्रत्येक पद्धति भिन्न सन्दर्भ तारे या गणितीय विधि का प्रयोग करती है।'
            : 'When were the two zodiacs aligned? This is called the "zero ayanamsha date" — the epoch when tropical equals sidereal. Different systems disagree, because each uses a different reference star or mathematical method.'}
        </p>
      </section>

      {/* Ayanamsha Systems Table */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 overflow-x-auto">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'अयनांश पद्धतियों की तुलना' : 'Ayanamsha Systems Compared'}
        </h4>
        <table className="w-full text-xs text-text-secondary">
          <thead>
            <tr className="border-b border-gold-primary/10">
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">{isHi ? 'पद्धति' : 'System'}</th>
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">J2000.0</th>
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">2026</th>
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">{isHi ? 'आधार तारा' : 'Anchor'}</th>
              <th className="text-left py-2 text-gold-light font-semibold">{isHi ? 'शून्य तिथि' : 'Zero Date'}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{isHi ? 'लहिरी (चित्रापक्ष)' : 'Lahiri (Chitrapaksha)'}</td>
              <td className="py-2 pr-3">23.85&deg;</td>
              <td className="py-2 pr-3">24.22&deg;</td>
              <td className="py-2 pr-3">{isHi ? 'चित्रा (स्पाइका) 180° पर' : 'Spica (Chitra) at 180\u00b0'}</td>
              <td className="py-2">{isHi ? '~285 ई.' : '~285 CE'}</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{isHi ? 'रमण' : 'Raman'}</td>
              <td className="py-2 pr-3">22.40&deg;</td>
              <td className="py-2 pr-3">22.76&deg;</td>
              <td className="py-2 pr-3">&#8212;</td>
              <td className="py-2">{isHi ? '~397 ई.' : '~397 CE'}</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{isHi ? 'के.पी. (कृष्णमूर्ति)' : 'KP (Krishnamurti)'}</td>
              <td className="py-2 pr-3">23.82&deg;</td>
              <td className="py-2 pr-3">24.19&deg;</td>
              <td className="py-2 pr-3">{isHi ? 'चित्रा (शोधित)' : 'Spica (refined)'}</td>
              <td className="py-2">{isHi ? '~291 ई.' : '~291 CE'}</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{isHi ? 'फ़गन-ब्रैडली' : 'Fagan-Bradley'}</td>
              <td className="py-2 pr-3">24.74&deg;</td>
              <td className="py-2 pr-3">25.10&deg;</td>
              <td className="py-2 pr-3">&#8212;</td>
              <td className="py-2">{isHi ? '~221 ई.' : '~221 CE'}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* The Calculation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'गणना कैसे होती है' : 'The Calculation'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'किसी भी तिथि के लिए लहिरी अयनांश एक बहुपद सूत्र से निकाला जाता है:'
            : 'The Lahiri ayanamsha for any date is computed from a polynomial formula:'}
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 font-mono text-xs text-gold-light/90 mb-3">
          <p>A = 24.042 + 1.3968 &times; T + 0.0005 &times; T&sup2;</p>
          <p className="text-text-secondary mt-1">
            {isHi ? 'जहाँ T = J2000.0 (1 जनवरी 2000) से शताब्दियाँ' : 'where T = centuries from J2000.0 (Jan 1, 2000)'}
          </p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'अप्रैल 2026 के लिए: T ≈ 0.2625 → A ≈ 24.042 + (1.3968 × 0.2625) + (0.0005 × 0.0689) ≈ 24.042 + 0.367 + 0.00003 ≈ 24.41° (सरलीकृत; पूर्ण IAU बहुपद ~24.22° देता है)। सटीक मान प्रयुक्त शब्दों की संख्या पर निर्भर करता है — हमारा ऐप IAU पुरस्सरण के साथ पूर्ण बहुपद प्रयोग करता है।'
            : 'For April 2026: T is approximately 0.2625 centuries. A is approximately 24.042 + (1.3968 times 0.2625) + (0.0005 times 0.0689) = roughly 24.41 degrees (simplified; the full IAU polynomial yields ~24.22 degrees). The exact value depends on how many terms are included — our app uses the full polynomial fitted to IAU precession.'}
        </p>
      </section>

      {/* Worked Examples Card */}
      <ExampleChart
        ascendant={1}
        planets={{ 1: [2], 4: [1], 10: [0] }}
        title="Ayanamsha Boundary — Same Sky, Different Coordinates"
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'उदाहरण — सीमारेखा की समस्या' : 'Worked Example — The Boundary Problem'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'प्रश्न:' : 'Problem:'}</span>{' '}
          {isHi
            ? 'एक ग्रह 24.5° सायन देशान्तर पर है। दोनों अयनांशों से निरयन स्थिति ज्ञात कीजिए।'
            : 'A planet is at 24.5 degrees tropical longitude. Find its sidereal position under both ayanamshas.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'लहिरी (24.22°):' : 'Lahiri (24.22 deg):'}</span>{' '}
          {isHi
            ? '24.5 - 24.22 = 0.28° → 0°17\' मेष (मेष राशि में)'
            : '24.5 minus 24.22 = 0.28 degrees = 0 degrees 17 arcminutes Aries (in Aries)'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'फ़गन-ब्रैडली (25.10°):' : 'Fagan-Bradley (25.10 deg):'}</span>{' '}
          {isHi
            ? '24.5 - 25.10 = -0.60° → 360° - 0.60° = 359.40° = 29°24\' मीन (मीन राशि में!)'
            : '24.5 minus 25.10 = negative 0.60 degrees, wraps to 359.40 degrees = 29 degrees 24 arcminutes Pisces (in Pisces!)'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-2 pt-2 border-t border-white/5">
          {isHi
            ? 'अयनांश में मात्र 0.88° का अन्तर ग्रह को मेष से मीन में धकेल देता है — पूर्णतः भिन्न राशि, भिन्न स्वामी, भिन्न फलादेश। यह समस्या तब उत्पन्न होती है जब ग्रह किसी राशि की सीमा (0°-2° या 28°-30°) के निकट हो।'
            : 'A mere 0.88-degree difference in ayanamsha pushes the planet from Aries to Pisces — a completely different sign, different ruler, different interpretation. This problem arises when a planet is near any sign boundary (0-2 degrees or 28-30 degrees of any sign).'}
        </p>
      </section>

      {/* Real-World Comparison */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-violet-500/15">
        <h4 className="text-violet-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'वास्तविक उदाहरण — लहिरी बनाम रमन' : 'Real Chart Comparison — Lahiri vs Raman'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {isHi
            ? 'जन्म: 14 मई 1988, 06:00 IST, दिल्ली। लहिरी अयनांश: 23.69°। रमन अयनांश: 22.30°। अन्तर: 1.39°। यह छोटा सा अन्तर तीन प्रमुख परिवर्तन लाता है:'
            : 'Birth: 14 May 1988, 06:00 IST, Delhi. Lahiri ayanamsha: 23.69°. Raman ayanamsha: 22.30°. Difference: 1.39°. This seemingly small gap causes THREE major changes:'}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-violet-500/20">
                <th className="text-left text-text-tertiary py-2 pr-3">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'लहिरी' : 'Lahiri'}</th>
                <th className="text-left text-cyan-300 py-2 pr-3">{isHi ? 'रमन' : 'Raman'}</th>
                <th className="text-left text-red-400 py-2">{isHi ? 'परिवर्तन' : 'Changed?'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5 bg-red-500/5">
                <td className="py-2 pr-3 font-medium text-gold-light">{isHi ? 'सूर्य' : 'Sun'}</td>
                <td className="py-2 pr-3">{isHi ? 'मेष 29.75°' : 'Aries 29.75°'}</td>
                <td className="py-2 pr-3">{isHi ? 'वृषभ 1.14°' : 'Taurus 1.14°'}</td>
                <td className="py-2 text-red-400 font-bold">{isHi ? 'राशि बदली!' : 'SIGN CHANGED!'}</td>
              </tr>
              <tr className="border-b border-white/5 bg-amber-500/5">
                <td className="py-2 pr-3 font-medium text-gold-light">{isHi ? 'शुक्र' : 'Venus'}</td>
                <td className="py-2 pr-3">{isHi ? 'मृगशिरा नक्षत्र' : 'Mrigashira Nak.'}</td>
                <td className="py-2 pr-3">{isHi ? 'आर्द्रा नक्षत्र' : 'Ardra Nak.'}</td>
                <td className="py-2 text-amber-400 font-bold">{isHi ? 'नक्षत्र बदला!' : 'NAK. CHANGED!'}</td>
              </tr>
              <tr className="border-b border-white/5 bg-amber-500/5">
                <td className="py-2 pr-3 font-medium text-gold-light">{isHi ? 'केतु' : 'Ketu'}</td>
                <td className="py-2 pr-3">{isHi ? 'पूर्वा फाल्गुनी' : 'P. Phalguni Nak.'}</td>
                <td className="py-2 pr-3">{isHi ? 'उत्तरा फाल्गुनी' : 'U. Phalguni Nak.'}</td>
                <td className="py-2 text-amber-400 font-bold">{isHi ? 'नक्षत्र बदला!' : 'NAK. CHANGED!'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{isHi ? 'अन्य 6 ग्रह' : 'Other 6 planets'}</td>
                <td className="py-2" colSpan={3}>{isHi ? 'समान राशि, समान नक्षत्र (सीमा से दूर)' : 'Same signs, same nakshatras (not near boundaries)'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {isHi
            ? 'सूर्य का मेष से वृषभ में जाना एक बड़ा परिवर्तन है — सूर्य राशि, सूर्य का स्वामी, और सूर्य से जुड़े सभी योग प्रभावित होते हैं। शुक्र का नक्षत्र बदलना विवाह अनुकूलता (मेलापक) गणना को प्रभावित करता है। एक ही जन्म डेटा — दो अलग-अलग जीवन कथाएँ, केवल अयनांश चयन के कारण।'
            : 'The Sun moving from Aries to Taurus is a MAJOR shift — the Sun sign, its lordship, and all Sun-related yogas change entirely. Venus changing nakshatras affects marriage compatibility (Melapaka) calculations. Ketu changing nakshatras shifts spiritual karmic patterns. Same birth data — two different life narratives, just from the ayanamsha choice.'}
        </p>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 3 — India's Contribution and the Great Debate
   ═══════════════════════════════════════════════════════════════ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* Why Lahiri Won */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'लहिरी ने क्यों जीता — भारतीय पंचांग सुधार' : 'Why Lahiri Won — India\'s Calendar Reform'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'भारतीय पंचांग सुधार समिति (1955), भौतिकशास्त्री मेघनाद साहा (जिन्होंने खगोल भौतिकी में विश्वव्यापी रूप से प्रयुक्त साहा आयनन समीकरण की खोज की) के नेतृत्व में, ने भारत के राष्ट्रीय पंचांग के लिए लहिरी (चित्रापक्ष) अयनांश को आधिकारिक रूप से अपनाया। साहा ने इसे चुना क्योंकि:'
            : 'The Indian Calendar Reform Committee (1955), headed by physicist Meghnad Saha (who discovered the Saha ionization equation used in astrophysics worldwide), officially adopted the Lahiri (Chitrapaksha) ayanamsha for India\'s National Calendar. Saha chose it because:'}
        </p>
        <ul className="text-text-secondary text-sm leading-relaxed space-y-2 ml-4 mb-3">
          <li className="flex items-start gap-2">
            <span className="text-gold-primary mt-1 shrink-0">1.</span>
            <span>
              {isHi
                ? 'यह चित्रा (स्पाइका) पर आधारित है — एक चमकीला, आसानी से प्रेक्षणीय तारा जो प्रथम कोटि का है।'
                : 'It anchors to Spica (Chitra) — a bright, first-magnitude star that is easily observable.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-primary mt-1 shrink-0">2.</span>
            <span>
              {isHi
                ? '180° खगोलीय रूप से स्वच्छ है — वसन्त सम्पात के ठीक विपरीत।'
                : '180 degrees is astronomically clean — exactly opposite the vernal equinox.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-primary mt-1 shrink-0">3.</span>
            <span>
              {isHi
                ? 'यह भारतीय ग्रन्थों में ऐतिहासिक खगोलीय प्रेक्षणों से सर्वोत्तम मेल खाता है।'
                : 'It best fits historical astronomical observations recorded in Indian texts.'}
            </span>
          </li>
        </ul>
      </section>

      {/* WHY Everyone Disagrees */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'सब असहमत क्यों हैं — मूल समस्या' : 'Why Everyone Disagrees — The Root Problem'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'अयनांश विवाद को समझने के लिए आपको मूल समस्या समझनी होगी: कोई नहीं जानता कि सायन और निरयन राशिचक्र ठीक कब संरेखित थे। यह "शून्य अयनांश तिथि" है — वह क्षण जब वसन्त सम्पात 0° मेष निरयन के साथ मेल खाता था। लेकिन तीन बाधाएँ हैं:'
            : 'To understand the ayanamsha debate, you need to understand the root problem: nobody knows the EXACT date when the tropical and sidereal zodiacs were aligned. This is called the "zero ayanamsha date" — the moment when the vernal equinox coincided with 0° Aries sidereal. But there are three fundamental obstacles:'}
        </p>
        <ul className="text-text-secondary text-sm leading-relaxed space-y-3 ml-4 mb-3">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1 shrink-0 font-bold">1.</span>
            <span>
              {isHi
                ? 'सम्पात बिन्दु अदृश्य है — यह वह गणितीय बिन्दु है जहाँ क्रान्तिवृत्त तल भूमध्यरेखीय तल को काटता है। आप इसे "देख" नहीं सकते। आकाश में कोई चिह्न नहीं है।'
                : 'The equinox is INVISIBLE — it\'s a mathematical point where the ecliptic plane intersects the equatorial plane. You can\'t "see" it. There\'s no marker in the sky.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1 shrink-0 font-bold">2.</span>
            <span>
              {isHi
                ? '0° मेष निरयन अलग-अलग परिभाषित है — तारामंडलों की तीक्ष्ण सीमाएँ नहीं होतीं। "मेष" कहाँ समाप्त होता है और "मीन" कहाँ आरम्भ होता है? तारे लेबल के साथ नहीं आते। प्रत्येक प्रणाली एक भिन्न "लंगर तारा" चुनती है।'
                : '"0° Aries sidereal" is defined differently by each system — constellations don\'t have sharp edges. Where does "Aries" end and "Pisces" begin? Stars don\'t come with labels. Each system chose a DIFFERENT anchor star to define this boundary.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1 shrink-0 font-bold">3.</span>
            <span>
              {isHi
                ? 'प्राचीन खगोलशास्त्रियों ने सापेक्ष स्थिति मापी, निरपेक्ष नहीं — "ग्रह X तारा Y से 30° दूर है" — इसे निरपेक्ष सन्दर्भ ढाँचे में रूपान्तरित करने के लिए एक लंगर तारा चुनना आवश्यक है।'
                : 'Ancient astronomers measured RELATIVE positions, not absolute — "planet X is 30° from star Y." Converting these to an absolute reference frame requires choosing an anchor star — and that choice is a human convention.'}
            </span>
          </li>
        </ul>
      </section>

      {/* Each System's Anchor Logic */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'प्रत्येक प्रणाली ने अपना लंगर कैसे चुना' : 'How Each System Chose Its Anchor'}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-bold">Lahiri:</span> {isHi ? 'स्पाइका (चित्रा, α Virginis) को ठीक 180° निरयन पर स्थिर किया। चित्रा चमकीला (प्रथम कोटि), आसानी से प्रेक्षणीय, और 180° गणितीय रूप से स्वच्छ है (0° मेष के ठीक विपरीत)। स्पाइका की ज्ञात गति से पीछे गणना करने पर → शून्य तिथि ≈ 285 ई.।' : 'Fixed Spica (Chitra, α Virginis) at exactly 180° sidereal. Spica is bright (magnitude 1.0), easily observable, and 180° is mathematically clean (exactly opposite 0° Aries). Working backward from Spica\'s known proper motion → zero date ≈ 285 CE.'}</p>
          <p><span className="text-gold-light font-bold">BV Raman:</span> {isHi ? 'रेवती (ζ Piscium) को 359°50\' निरयन पर लंगर के रूप में प्रयोग किया, सूर्य सिद्धान्त के सन्दर्भों के आधार पर। भिन्न तारा → भिन्न शून्य → शून्य तिथि ≈ 397 ई.।' : 'Used Revati (ζ Piscium) as anchor at 359°50\' sidereal, based on Surya Siddhanta references. Different star → different zero → zero date ≈ 397 CE.'}</p>
          <p><span className="text-gold-light font-bold">KP (Krishnamurti):</span> {isHi ? 'लहिरी से आरम्भ किया लेकिन दशा समय की सटीकता के अपने प्रेक्षणों के आधार पर एक छोटा सुधार लागू किया। विचार: जो अयनांश विंशोत्तरी दशा भविष्यवाणियों को सबसे सटीक बनाए, वही "सही" है। प्रायोगिक समायोजन → शून्य ≈ 291 ई.।' : 'Started from Lahiri but applied a small correction based on his own observations of dasha timing accuracy. The idea: whichever ayanamsha makes Vimshottari dasha predictions MOST accurate is the "correct" one. Empirical tuning → zero ≈ 291 CE.'}</p>
          <p><span className="text-gold-light font-bold">Fagan-Bradley:</span> {isHi ? 'सिरिल फ़गन (आयरिश) ने अल्डेबैरन (α Tauri) को ठीक 15° वृषभ और एन्टेयर्स (α Scorpii) को ठीक 15° वृश्चिक में दोहरे लंगर के रूप में प्रयोग किया। दोहरा सत्यापन, भिन्न तारे → शून्य ≈ 221 ई.।' : 'Cyril Fagan (Irish) used Aldebaran (α Tauri) at exactly 15° Taurus AND Antares (α Scorpii) at exactly 15° Scorpio as dual anchors. Double verification with two opposite stars → zero ≈ 221 CE.'}</p>
          <p><span className="text-gold-light font-bold">Yukteshwar:</span> {isHi ? 'श्री युक्तेश्वर गिरि (योगानन्द के गुरु) ने अपनी पुस्तक "The Holy Science" (1894) में पुरस्सरण सिद्धान्त से गणना की। एक अद्वितीय शून्य तिथि ~499 ई. प्राप्त की।' : 'Sri Yukteshwar Giri (Yogananda\'s guru) calculated from precessional theory in "The Holy Science" (1894). Derived a unique zero date of ~499 CE.'}</p>
        </div>
      </section>

      {/* Why Can't We Just Measure It? */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-cyan-500/15">
        <h4 className="text-cyan-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'क्या हम इसे माप नहीं सकते?' : 'Why Can\'t We Just Measure It?'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? 'क्योंकि पुरस्सरण सतत है और "सही" शून्य बिन्दु इस पर निर्भर करता है कि आप तारामंडल की सीमा कहाँ खींचते हैं — जो एक मानवीय परम्परा है, भौतिक तथ्य नहीं। IAU (अन्तर्राष्ट्रीय खगोलीय संघ) की तारामंडल सीमाएँ परम्परागत 30°-प्रति-राशि विभाजनों से मेल नहीं खातीं।'
            : 'Because precession is continuous and the "correct" zero point depends on WHERE you draw the constellation boundary — which is a human convention, not a physical fact. The IAU (International Astronomical Union) constellation boundaries don\'t even match the traditional 30°-per-sign equal divisions.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'यह किसी शहर की सीमा चुनने जैसा है — "दिल्ली" रेलवे स्टेशन पर समाप्त होती है या हवाई अड्डे पर? दोनों उत्तर वैध हैं, दोनों मानवीय चुनाव हैं, और दोनों एक सुसंगत मानचित्र देते हैं — बस थोड़ा अलग। अयनांश का चुनाव ठीक ऐसा ही है।'
            : 'Think of it like choosing a city boundary — does "Delhi" end at the railway station or the airport? Both answers are valid, both are human choices, and both give you a consistent map — just slightly different. The ayanamsha choice is exactly like this.'}
        </p>
      </section>

      {/* The Ongoing Debate */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कौन सा चुनें?' : 'Which One Should You Use?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'लहिरी भारत में प्रमुख है (~90% ज्योतिषी)। के.पी. पद्धति एक बहुत निकट संस्करण प्रयोग करती है। रमण एक महत्त्वपूर्ण अल्पसंख्यक द्वारा प्रयुक्त है। पश्चिमी निरयन ज्योतिषी फ़गन-ब्रैडली प्रयोग करते हैं। हमारा सुझाव: लहिरी से आरम्भ करें (सबसे व्यापक, सबसे अधिक सत्यापित)। यदि आपके गुरु या परम्परा कोई अन्य पद्धति प्रयोग करती है, उसे चुनें। हमारा ऐप तीनों (लहिरी/रमन/केपी) का समर्थन करता है।'
            : 'Lahiri is dominant in India (roughly 90 percent of practitioners). KP uses a very close variant. Raman is used by a significant minority. Our recommendation: START with Lahiri (most widely used, most validated). If your guru or tradition uses a different system, choose that one. Our app supports all three (Lahiri/Raman/KP) — you can generate the same chart with different systems and compare.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'व्यावहारिक प्रभाव: यदि आपका ग्रह किसी राशि की सीमा के 2° के भीतर है, तो अयनांश का चुनाव महत्त्वपूर्ण है। राशि के मध्य में स्थित ग्रहों के लिए सभी पद्धतियाँ सहमत हैं।'
            : 'Practical impact: if your planet is within 2 degrees of a sign boundary, the ayanamsha choice matters. For planets in the middle of a sign, all systems agree.'}
        </p>
      </section>

      {/* How Our App Handles It */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'हमारा ऐप कैसे सँभालता है' : 'How Our App Handles It'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'कुण्डली जनक आपको लहिरी, रमण या के.पी. अयनांश चुनने देता है। पूर्वनिर्धारित लहिरी है (सर्वाधिक व्यापक)। सूत्र IAU पुरस्सरण पर आधारित बहुपद है जिसमें चित्रा (स्पाइका) 180° निरयन पर स्थिर है। सभी ग्रह स्थितियाँ पहले सायन (उष्णकटिबन्धीय) गणित से निकाली जाती हैं, फिर चयनित अयनांश घटाकर निरयन (नाक्षत्र) में रूपान्तरित की जाती हैं।'
            : 'The kundali generator lets you choose Lahiri, Raman, or KP ayanamsha. The default is Lahiri (most widely used). The formula is a polynomial fitted to IAU precession with Spica pinned at 180 degrees sidereal. All planetary positions are first computed using tropical (equinox-based) mathematics, then converted to sidereal by subtracting the chosen ayanamsha.'}
        </p>
      </section>

      {/* Misconceptions Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          <span className="text-red-300 font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span>{' '}
          {isHi
            ? '"पश्चिमी ज्योतिष गलत है क्योंकि वह अयनांश का प्रयोग नहीं करता।"'
            : '"Western astrology is wrong because it doesn\'t use ayanamsha."'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-emerald-400 font-medium">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
          {isHi
            ? 'दोनों पद्धतियाँ आन्तरिक रूप से सुसंगत हैं। सायन ज्योतिष मौसमी सम्बन्धों को ट्रैक करता है (मौसम और कृषि के लिए मान्य)। निरयन ज्योतिष तारकीय सम्बन्धों को ट्रैक करता है (नक्षत्र-आधारित पद्धतियों के लिए मान्य)। कोई भी "गलत" नहीं है — वे भिन्न लंगरों का उपयोग करके भिन्न प्रश्नों का उत्तर देते हैं।'
            : 'Both systems are internally consistent. Tropical astrology tracks seasonal and equinox relationships (valid for weather and agricultural cycles). Sidereal astrology tracks stellar relationships (valid for nakshatra-based systems). Neither is "wrong" — they answer different questions using different anchors.'}
        </p>
      </section>

      {/* Modern Relevance Card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'अन्तर्राष्ट्रीय खगोलीय संघ (IAU) ICRS (अन्तर्राष्ट्रीय खगोलीय सन्दर्भ पद्धति) प्रयोग करता है जो दूरस्थ क्वेसारों पर आधारित है — न सायन, न निरयन। सभी अयनांश पद्धतियाँ मानव-चयनित सन्दर्भ ढाँचे हैं। जो महत्त्वपूर्ण है वह सुसंगतता है, न कि परम "सत्य"। नासा कक्षीय गणनाओं में पुरस्सरण प्रयोग करता है। हमारा ऐप वही गणित प्रयोग करता है — IAU पुरस्सरण दर पर आधारित बहुपद, चित्रा तारे से 180° पर स्थिर।'
            : 'The IAU (International Astronomical Union) uses the ICRS (International Celestial Reference System) anchored to distant quasars — neither tropical nor sidereal. All ayanamsha systems are human-chosen reference frames. What matters is consistency, not absolute "truth." NASA uses precession in all orbital calculations. Our app uses the same mathematics — a polynomial based on the IAU precession rate, anchored to the star Spica at 180 degrees sidereal.'}
        </p>
      </section>
    </div>
  );
}

export default function Module4_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
