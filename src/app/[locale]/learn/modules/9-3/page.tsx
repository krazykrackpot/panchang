'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/9-3.json';

const META: ModuleMeta = {
  id: 'mod_9_3', phase: 3, topic: 'Kundali', moduleNumber: '9.3',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
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
          {tl({ en: 'Exaltation (Uccha) — Peak Planetary Strength', hi: 'उच्च — ग्रह की शिखर शक्ति', sa: 'उच्च — ग्रह की शिखर शक्ति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रत्येक ग्रह की एक विशिष्ट राशि होती है जहाँ वह अपने गुणों को अधिकतम शक्ति और स्पष्टता से व्यक्त करता है — यह उसकी उच्च राशि है। इसे ऐसे समझें कि ग्रह एक सम्मानित अतिथि है ऐसे गृहस्वामी के घर में जहाँ सब कुछ उसके स्वभाव से पूर्णतः मेल खाता है। उच्च ग्रह अपनी सूचकताएँ प्रचुर मात्रा में और सहजता से प्रदान करता है।</> : <>Every planet has one specific sign where it expresses its qualities with maximum power and clarity — this is its sign of exaltation (Uccha Rashi). Think of it as the planet being an honored guest in a host&apos;s home where everything aligns perfectly with its nature. An exalted planet delivers its significations abundantly and with ease.</>}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-gold-light text-left p-2">{tl({ en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' }, locale)}</th>
                <th className="text-gold-light text-left p-2">{tl({ en: 'Exalted In', hi: 'उच्च', sa: 'उच्च' }, locale)}</th>
                <th className="text-gold-light text-left p-2">{tl({ en: 'Deep Exaltation', hi: 'परम उच्च', sa: 'परम उच्च' }, locale)}</th>
                <th className="text-gold-light text-left p-2">{tl({ en: 'Why', hi: 'कारण', sa: 'कारण' }, locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, locale)}</td><td className="p-2">{tl({ en: 'Aries', hi: 'मेष', sa: 'मेष' }, locale)}</td><td className="p-2">10°</td><td className="p-2">Fire + initiative = peak authority</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, locale)}</td><td className="p-2">{tl({ en: 'Taurus', hi: 'वृषभ', sa: 'वृषभ' }, locale)}</td><td className="p-2">3°</td><td className="p-2">Earth stability nourishes emotions</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, locale)}</td><td className="p-2">{tl({ en: 'Capricorn', hi: 'मकर', sa: 'मकर' }, locale)}</td><td className="p-2">28°</td><td className="p-2">Discipline channels raw courage</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, locale)}</td><td className="p-2">{tl({ en: 'Virgo', hi: 'कन्या', sa: 'कन्या' }, locale)}</td><td className="p-2">15°</td><td className="p-2">Analytical sign perfects intellect</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Jupiter', hi: 'बृहस्पति', sa: 'गुरुः' }, locale)}</td><td className="p-2">{tl({ en: 'Cancer', hi: 'कर्क', sa: 'कर्क' }, locale)}</td><td className="p-2">5°</td><td className="p-2">Nurturing amplifies wisdom</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, locale)}</td><td className="p-2">{tl({ en: 'Pisces', hi: 'मीन', sa: 'मीन' }, locale)}</td><td className="p-2">27°</td><td className="p-2">Spiritual love = highest beauty</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, locale)}</td><td className="p-2">{tl({ en: 'Libra', hi: 'तुला', sa: 'तुला' }, locale)}</td><td className="p-2">20°</td><td className="p-2">Justice + balance = ideal discipline</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Rahu', hi: 'राहु', sa: 'राहु' }, locale)}</td><td className="p-2">{tl({ en: 'Taurus', hi: 'वृषभ*', sa: 'वृषभ*' }, locale)}</td><td className="p-2">20°</td><td className="p-2">Material mastery (per BPHS)</td></tr>
              <tr><td className="p-2">{tl({ en: 'Ketu', hi: 'केतु', sa: 'केतु' }, locale)}</td><td className="p-2">{tl({ en: 'Scorpio', hi: 'वृश्चिक*', sa: 'वृश्चिक*' }, locale)}</td><td className="p-2">20°</td><td className="p-2">Occult depth (per BPHS)</td></tr>
            </tbody>
          </table>
          <p className="text-text-tertiary text-xs mt-1">{isHi ? <>* राहु/केतु का उच्च परम्परा अनुसार भिन्न है। कुछ मिथुन/धनु मानते हैं। BPHS वृषभ/वृश्चिक का समर्थन करता है।</> : <>* Rahu/Ketu exaltation varies by tradition. Some use Gemini/Sagittarius. BPHS supports Taurus/Scorpio.</>}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीय उत्पत्ति' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>उच्च अंश BPHS अध्याय 3 (श्लोक 51) और फलदीपिका अध्याय 2 में सूचीबद्ध हैं। ये विशिष्ट राशि-अंश संयोजन सभी ज्योतिष परम्पराओं में 2000 से अधिक वर्षों से अपरिवर्तित हैं। परम उच्च अंश वह है जहाँ ग्रह पूर्ण अधिकतम शक्ति पर पहुँचता है — ठीक 10° मेष सूर्य या 5° कर्क बृहस्पति अपने शिखर पर होता है।</> : <>Exaltation degrees are listed in BPHS Chapter 3 (Shloka 51) and Phaladeepika Chapter 2. These specific sign-degree combinations have remained unchanged for over 2000 years across all Jyotish traditions. The deep exaltation degree is where the planet reaches absolute maximum potency — a planet at exactly 10° Aries Sun or 5° Cancer Jupiter is at its peak.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Debilitation and Neecha Bhanga ─────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Debilitation (Neecha) and Its Cancellation', hi: 'नीच और उसका भंग', sa: 'नीच और उसका भंग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>नीच राशि उच्च से ठीक विपरीत (180°) होती है। यहाँ ग्रह दुर्बल होता है — अपने स्वाभाविक गुणों को व्यक्त करने में संघर्ष करता है। तुला में नीच सूर्य समझौते की राशि में अपना निर्णायक अधिकार खो देता है। कर्क में नीच मंगल भावनात्मक, पोषण वातावरण में आक्रामकता को उत्पादक रूप से प्रवाहित नहीं कर पाता।</> : <>The debilitation sign is exactly opposite (180°) from exaltation. Here the planet is weakened — it struggles to express its natural qualities. Sun debilitated in Libra loses its decisive authority in the sign of compromise. Mars debilitated in Cancer cannot channel aggression productively in the emotional, nurturing environment.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          However, Jyotish provides a remarkable escape clause: <strong className="text-gold-light">Neecha Bhanga</strong> (cancellation of debilitation). Five classical conditions from BPHS can cancel the weakness:
        </p>
        <div className="space-y-1.5 text-xs text-text-secondary mb-3">{isHi ? <><p>1. नीच राशि का स्वामी लग्न या चन्द्र से केन्द्र में हो</p>
          <p>2. जिस राशि में नीच ग्रह उच्च होता है उसका स्वामी लग्न या चन्द्र से केन्द्र में हो</p>
          <p>3. नीच ग्रह पर उसकी नीच राशि के स्वामी की दृष्टि हो</p>
          <p>4. नीच ग्रह नवमांश कुण्डली में उच्च का हो</p>
          <p>5. नीच ग्रह किसी उच्च ग्रह से युक्त हो</p></> : <><p>1. The lord of the debilitation sign is in a Kendra from Lagna or Moon</p>
          <p>2. The lord of the sign where the debilitated planet gets exalted is in a Kendra from Lagna or Moon</p>
          <p>3. The debilitated planet is aspected by its debilitation sign lord</p>
          <p>4. The debilitated planet is exalted in the Navamsha chart</p>
          <p>5. The debilitated planet is conjoined with an exalted planet</p></>}</div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example: Neecha Bhanga', hi: 'कार्यान्वित उदाहरण: नीचभंग', sa: 'कार्यान्वित उदाहरण: नीचभंग' }, locale)}</h4>
        <ExampleChart
          ascendant={4}
          planets={{ 7: [4], 10: [6] }}
          title={tl({ en: 'Cancer Lagna — Jupiter debilitated in 7th, Saturn in 10th', hi: 'कर्क लग्न — बृहस्पति नीच सप्तम में, शनि दशम में', sa: 'कर्क लग्न — बृहस्पति नीच सप्तम में, शनि दशम में' }, locale)}
          highlight={[7, 10]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> बृहस्पति मकर में नीच, सप्तम भाव में। मकर का स्वामी शनि है। यदि शनि केन्द्र में हो (मान लें, दशम भाव में मेष में), तो शर्त 1 पूरी होती है — नीचभंग होता है। प्रारम्भ में दुर्बल बृहस्पति शक्तिशाली बल में बदल जाता है। जातक को प्रारम्भ में संबंधों में चुनौतियाँ हो सकती हैं (नीच सप्तम भाव बृहस्पति), लेकिन अंततः प्रारम्भिक बाधाओं को पार करके एक असाधारण अर्थपूर्ण साझेदारी प्राप्त करता है।</> : <><span className="text-gold-light font-medium">Example:</span> Jupiter is debilitated in Capricorn in the 7th house. Capricorn is ruled by Saturn. If Saturn is placed in a Kendra (say, the 10th house in Aries), condition 1 is met — Neecha Bhanga occurs. The initially weak Jupiter transforms into a powerful force. The native may initially face relationship challenges (debilitated 7th house Jupiter), but ultimately achieves an exceptionally meaningful partnership after overcoming early obstacles.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रांतियाँ', sa: 'सामान्य भ्रांतियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;नीच ग्रह का अर्थ है कि वह जीवन क्षेत्र बर्बाद है।&quot; यह दो स्तरों पर गलत है। पहला, नीचभंग की शर्तें बहुत सामान्य हैं — अधिकांश कुण्डलियों में कम से कम एक भंग होता है। दूसरा, भंग के बिना भी, नीच ग्रह ऐसी चुनौतियाँ उत्पन्न करता है जो विकास के लिए बाध्य करती हैं। कई अत्यंत सफल लोगों के पास नीच ग्रह होते हैं जो क्षतिपूर्ति के संघर्ष से उनकी महत्वाकांक्षा को संचालित करते हैं।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;A debilitated planet means that life area is doomed.&quot; This is wrong on two levels. First, Neecha Bhanga conditions are very common — most charts have at least one cancellation. Second, even without cancellation, a debilitated planet produces challenges that force growth. Many highly successful people have debilitated planets driving their ambition through the struggle to compensate.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Own Sign, Moolatrikona, and Dignity Hierarchy ──────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Own Sign, Moolatrikona, and the Full Hierarchy', hi: 'स्वराशि, मूलत्रिकोण, और पूर्ण क्रम', sa: 'स्वराशि, मूलत्रिकोण, और पूर्ण क्रम' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>उच्च और नीच के चरम बिन्दुओं के बीच पाँच मध्यवर्ती गरिमा स्तर हैं। <strong className="text-gold-light">स्वराशि (स्वक्षेत्र)</strong> में ग्रह घर पर होने जैसा है — सुविधाजनक, उत्पादक, आत्मनिर्भर। मेष या वृश्चिक में मंगल, वृषभ या तुला में शुक्र, धनु या मीन में बृहस्पति सभी स्वराशि में हैं। <strong className="text-gold-light">मूलत्रिकोण</strong> राशि में ग्रह अपने &quot;कार्यालय&quot; में है — वह राशि जहाँ वह अपना सबसे आवश्यक कार्य केन्द्रित दक्षता से करता है। यह स्वराशि से थोड़ा अधिक शक्तिशाली है।</> : <>Between the extremes of exaltation and debilitation lie five intermediate dignity levels. A planet in its <strong className="text-gold-light">own sign (Swakshetra)</strong> is like being at home — comfortable, productive, self-sufficient. Mars in Aries or Scorpio, Venus in Taurus or Libra, Jupiter in Sagittarius or Pisces are all in their own signs. A planet in its <strong className="text-gold-light">Moolatrikona</strong> sign is at its &quot;office&quot; — the sign where it performs its most essential function with focused efficiency. This is slightly stronger than own sign.</>}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-gold-light text-left p-2">{tl({ en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' }, locale)}</th>
                <th className="text-gold-light text-left p-2">{tl({ en: 'Moolatrikona', hi: 'मूलत्रिकोण', sa: 'मूलत्रिकोण' }, locale)}</th>
                <th className="text-gold-light text-left p-2">{tl({ en: 'Own Signs', hi: 'स्वराशि', sa: 'स्वराशि' }, locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, locale)}</td><td className="p-2">Leo 0°-20°</td><td className="p-2">{tl({ en: 'Leo', hi: 'सिंह', sa: 'सिंह' }, locale)}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, locale)}</td><td className="p-2">Taurus 4°-20°</td><td className="p-2">{tl({ en: 'Cancer', hi: 'कर्क', sa: 'कर्क' }, locale)}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, locale)}</td><td className="p-2">Aries 0°-12°</td><td className="p-2">{tl({ en: 'Aries, Scorpio', hi: 'मेष, वृश्चिक', sa: 'मेष, वृश्चिक' }, locale)}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, locale)}</td><td className="p-2">Virgo 16°-20°</td><td className="p-2">{tl({ en: 'Gemini, Virgo', hi: 'मिथुन, कन्या', sa: 'मिथुन, कन्या' }, locale)}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Jupiter', hi: 'बृहस्पति', sa: 'गुरुः' }, locale)}</td><td className="p-2">Sagittarius 0°-10°</td><td className="p-2">{tl({ en: 'Sagittarius, Pisces', hi: 'धनु, मीन', sa: 'धनु, मीन' }, locale)}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{tl({ en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, locale)}</td><td className="p-2">Libra 0°-15°</td><td className="p-2">{tl({ en: 'Taurus, Libra', hi: 'वृषभ, तुला', sa: 'वृषभ, तुला' }, locale)}</td></tr>
              <tr><td className="p-2">{tl({ en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, locale)}</td><td className="p-2">Aquarius 0°-20°</td><td className="p-2">{tl({ en: 'Capricorn, Aquarius', hi: 'मकर, कुम्भ', sa: 'मकर, कुम्भ' }, locale)}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3 mt-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Friend and Enemy Signs', hi: 'मित्र और शत्रु राशियाँ', sa: 'मित्र और शत्रु राशियाँ' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहों की प्राकृतिक मित्रता और शत्रुता होती है। बृहस्पति और सूर्य मित्र हैं — सिंह (सूर्य की राशि) में बृहस्पति सुविधाजनक है। शुक्र और सूर्य शत्रु हैं — सिंह में शुक्र असहज है। BPHS का <strong className="text-gold-light">पंचधा मैत्री</strong> (पाँच-स्तरीय संबंध) प्रणाली परिभाषित करती है: अधि मित्र, मित्र, सम, शत्रु, अधि शत्रु। ये गरिमा को संशोधित करती हैं: मित्र राशि में ग्रह शत्रु राशि की तुलना में अधिक प्रभावी होता है, भले ही कोई भी उच्च या नीच न हो।</> : <>Planets have natural friendships and enmities. Jupiter and Sun are friends — Jupiter in Leo (Sun&apos;s sign) is comfortable. Venus and Sun are enemies — Venus in Leo is uneasy. The <strong className="text-gold-light">Panchadha Maitri</strong> (five-fold relationship) system from BPHS defines: intimate friend, friend, neutral, enemy, bitter enemy. These modify the dignity: a planet in a friendly sign is more effective than in an enemy sign, even if neither is exalted or debilitated.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Complete Hierarchy', hi: 'पूर्ण गरिमा क्रम', sa: 'पूर्ण गरिमा क्रम' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>शक्तिशाली से कमजोर: <strong className="text-gold-light">उच्च</strong> (ग्रह शिखर शक्ति पर) &gt; <strong className="text-gold-light">मूलत्रिकोण</strong> (केन्द्रित कर्तव्य) &gt; <strong className="text-gold-light">स्वराशि</strong> (सुविधाजनक) &gt; <strong className="text-gold-light">मित्र राशि</strong> (स्वागत अतिथि) &gt; <strong className="text-gold-light">सम राशि</strong> (उदासीन) &gt; <strong className="text-gold-light">शत्रु राशि</strong> (अस्वागत अतिथि) &gt; <strong className="text-gold-light">नीच</strong> (ग्रह सबसे कमजोर)।</> : <>From strongest to weakest: <strong className="text-gold-light">Exalted</strong> (planet at peak power) &gt; <strong className="text-gold-light">Moolatrikona</strong> (focused duty) &gt; <strong className="text-gold-light">Own Sign</strong> (comfortable) &gt; <strong className="text-gold-light">Friend&apos;s Sign</strong> (welcome guest) &gt; <strong className="text-gold-light">Neutral Sign</strong> (indifferent) &gt; <strong className="text-gold-light">Enemy&apos;s Sign</strong> (unwelcome guest) &gt; <strong className="text-gold-light">Debilitated</strong> (planet at weakest).</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा कुण्डली इंजन स्वचालित रूप से आपकी कुण्डली में प्रत्येक ग्रह की गरिमा का मूल्यांकन करता है। टिप्पणी उच्च और नीच ग्रहों की पहचान करती है, नीचभंग शर्तों की जाँच करती है, और समझाती है कि गरिमा प्रत्येक ग्रह की अपने भाव में फल देने की क्षमता को कैसे प्रभावित करती है। यह षड्बल शक्ति मूल्यांकन में एकीकृत है।</> : <>Our Kundali engine automatically evaluates every planet&apos;s dignity in your chart. The tippanni commentary identifies exalted and debilitated planets, checks for Neecha Bhanga conditions, and explains how dignity affects each planet&apos;s ability to deliver results in its house. This is integrated into the Shadbala strength assessment for a complete picture of planetary power.</>}</p>
      </section>
    </div>
  );
}

export default function Module9_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

