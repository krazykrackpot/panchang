import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: 'India Knew the Earth Rotates — 1,000 Years Before Europe',
    hi: 'भारत को पता था पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले',
  },
  subtitle: {
    en: 'In 499 CE, while Europe was in the Dark Ages, a 23-year-old Indian mathematician wrote: "The starry sphere does not revolve; it is the Earth that rotates on its axis, causing the stars to appear to rise and set." His name was Aryabhata — and this was not a guess.',
    hi: '499 ई. में, जब यूरोप अंधकार युग में था, एक 23 वर्षीय भारतीय गणितज्ञ ने लिखा: "तारों का गोला नहीं घूमता; पृथ्वी अपनी धुरी पर घूमती है, जिससे तारे उगते और डूबते प्रतीत होते हैं।" उनका नाम था आर्यभट — और यह कोई अनुमान नहीं था।',
  },

  s1Title: { en: 'The Exact Quote — Aryabhatiya, Golapada', hi: 'सटीक उद्धरण — आर्यभटीय, गोलपाद' },
  s1Body: {
    en: 'The Aryabhatiya contains two critical verses in the Golapada (Celestial Sphere section) that state Earth\'s rotation with mathematical precision. These are not poetic metaphors — they are technical astronomical statements embedded in a work of applied mathematics.',
    hi: 'आर्यभटीय के गोलपाद (आकाशीय गोल खंड) में दो महत्वपूर्ण श्लोक हैं जो पृथ्वी के घूर्णन को गणितीय सटीकता के साथ बताते हैं। ये काव्यात्मक रूपक नहीं हैं — ये अनुप्रयुक्त गणित के कार्य में एम्बेड किए गए तकनीकी खगोलीय कथन हैं।',
  },
  s1Quote1: {
    en: 'Verse 9, Golapada: "Just as a man in a boat moving forward sees the stationary objects as moving backward, just so the stationary stars appear to move westward — to a person at Lanka (equator). The cause of rising and setting is this: the sphere of stars together with the planets appears to move westward at Lanka, driven by the provector wind, constantly revolves eastward."',
    hi: 'श्लोक 9, गोलपाद: "जैसे एक नाव में आगे बढ़ता व्यक्ति स्थिर वस्तुओं को पीछे जाते देखता है, वैसे ही स्थिर तारे लंका (भूमध्य रेखा) पर किसी व्यक्ति को पश्चिम की ओर जाते प्रतीत होते हैं। उदय और अस्त का कारण यह है: ग्रहों सहित तारों का गोला लंका में पश्चिम की ओर जाता प्रतीत होता है, प्रवह पवन द्वारा संचालित, निरंतर पूर्व की ओर घूमता है।"',
  },
  s1Sanskrit: 'अनुलोमगतिर्नौस्थः पश्यत्यचलं विलोमगं यद्वत् । अचलानि भानि तद्वत् समपश्चिमगानि लङ्कायाम् ॥',

  s2Title: {
    en: 'Why Was This Revolutionary?',
    hi: 'यह क्रांतिकारी क्यों था?',
  },
  s2Body: {
    en: 'In 499 CE, the dominant model across the entire known world was the Ptolemaic geocentric system: Earth at the center, stars and planets revolving around it. This was not mere folk belief — it was the rigorous mathematical system of the greatest Greek astronomer, backed by centuries of observation. Aryabhata\'s assertion contradicted it directly. He gave a reason: apparent motion is relative. An observer on a moving Earth would see stationary stars as moving — exactly what we observe. This is the same argument Galileo used 1,100 years later.',
    hi: '499 ई. में, पूरे ज्ञात संसार में प्रमुख मॉडल टॉलेमी का भू-केंद्रित प्रणाली था: पृथ्वी केंद्र में, तारे और ग्रह उसके चारों ओर घूमते हुए। यह केवल लोककथा नहीं थी — यह महानतम ग्रीक खगोलशास्त्री की कठोर गणितीय प्रणाली थी, जिसे सदियों के अवलोकन का समर्थन था। आर्यभट के दावे ने इसे सीधे चुनौती दी। उन्होंने एक कारण दिया: स्पष्ट गति सापेक्ष है। एक गतिशील पृथ्वी पर एक पर्यवेक्षक स्थिर तारों को गतिशील देखेगा — ठीक वही जो हम देखते हैं। यह वही तर्क है जो गैलीलियो ने 1,100 वर्ष बाद दिया।',
  },

  s3Title: {
    en: 'Brahmagupta\'s Criticism — Active Scientific Debate',
    hi: 'ब्रह्मगुप्त की आलोचना — सक्रिय वैज्ञानिक बहस',
  },
  s3Body: {
    en: 'Not everyone agreed. Brahmagupta (628 CE) famously criticized Aryabhata in his Brahmasphutasiddhanta, arguing that if the Earth rotated, a stone thrown upward would land far to the west. This is actually a reasonable objection — it was later resolved by Newton\'s concept of inertia. What matters here is the context: India in the 6th–7th century had an active, contentious scientific debate about Earth\'s motion. This was not dogma — it was science.',
    hi: 'सभी सहमत नहीं थे। ब्रह्मगुप्त (628 ई.) ने अपने ब्रह्मस्फुटसिद्धांत में आर्यभट की प्रसिद्ध रूप से आलोचना की, तर्क देते हुए कि यदि पृथ्वी घूमती, तो ऊपर फेंका गया पत्थर बहुत पश्चिम में गिरता। यह वास्तव में एक उचित आपत्ति थी — इसे बाद में न्यूटन की जड़त्व की अवधारणा ने हल किया। यहाँ जो महत्वपूर्ण है वह संदर्भ है: 6वीं-7वीं सदी के भारत में पृथ्वी की गति के बारे में एक सक्रिय, विवादास्पद वैज्ञानिक बहस थी। यह हठधर्मिता नहीं थी — यह विज्ञान था।',
  },

  s4Title: {
    en: 'Earth\'s Circumference — 99.7% Accurate',
    hi: 'पृथ्वी की परिधि — 99.7% सटीक',
  },
  s4Body: {
    en: 'Aryabhata\'s genius did not stop at rotation. In Ganitapada verse 14, he calculated Earth\'s circumference as 4,967 yojanas. Using the yojana value he himself defined (8 miles), this gives 39,736 miles. The modern value is 40,075 km (24,901 miles). His result: 99.4% accurate for a measurement made in 499 CE. He also calculated the Earth\'s diameter, correctly identifying it as larger than the Moon\'s but smaller than the Sun\'s.',
    hi: 'आर्यभट की प्रतिभा घूर्णन पर नहीं रुकी। गणितपाद श्लोक 14 में, उन्होंने पृथ्वी की परिधि 4,967 योजन बताई। उनके द्वारा परिभाषित योजन मान (8 मील) का उपयोग करते हुए, यह 39,736 मील देता है। आधुनिक मान 40,075 किमी (24,901 मील) है। उनका परिणाम: 499 ई. में किए गए माप के लिए 99.4% सटीक। उन्होंने पृथ्वी के व्यास की भी गणना की, सही ढंग से पहचाना कि यह चंद्रमा से बड़ा लेकिन सूर्य से छोटा है।',
  },

  s5Title: {
    en: 'Connection to Sidereal Astronomy & Ayanamsha',
    hi: 'नाक्षत्र खगोल विज्ञान और अयनांश से संबंध',
  },
  s5Body: {
    en: 'Aryabhata\'s heliocentric understanding directly influenced how Vedic astronomy measures planetary positions. He measured the sidereal day — Earth\'s rotation relative to the fixed stars — as 23h 56m 4.1s. Modern value: 23h 56m 4.091s. His value is off by less than 0.01 seconds after 1,500 years. This sidereal perspective is why Vedic astrology uses the sidereal zodiac (Nirayana) and why the ayanamsha correction exists in all our calculations.',
    hi: 'आर्यभट की सौर-केंद्रित समझ ने सीधे तौर पर प्रभावित किया कि वैदिक खगोल विज्ञान ग्रहीय स्थितियों को कैसे मापता है। उन्होंने नाक्षत्र दिन — स्थिर तारों के सापेक्ष पृथ्वी का घूर्णन — 23 घंटे 56 मिनट 4.1 सेकंड मापा। आधुनिक मान: 23 घंटे 56 मिनट 4.091 सेकंड। 1,500 वर्षों के बाद उनका मान 0.01 सेकंड से कम गलत है। यह नाक्षत्र दृष्टिकोण यही कारण है कि वैदिक ज्योतिष नाक्षत्र राशिचक्र (निरयण) का उपयोग करता है और क्यों हमारी सभी गणनाओं में अयनांश सुधार मौजूद है।',
  },

  s6Title: {
    en: 'Timeline — Aryabhata to Galileo',
    hi: 'समय-रेखा — आर्यभट से गैलीलियो तक',
  },

  s7Title: {
    en: 'Aryabhata\'s Other Astronomical Achievements',
    hi: 'आर्यभट की अन्य खगोलीय उपलब्धियाँ',
  },

  backLink: { en: '← Back to Learn', hi: '← सीखने पर वापस' },
  prevPage: { en: 'Sine — Sanskrit Origin', hi: 'Sine — संस्कृत उत्पत्ति' },
  nextPage: { en: 'Calculus in Kerala', hi: 'केरल में कलनशास्त्र' },
};

const TIMELINE = [
  { year: '499 CE', person: 'Aryabhata', event: { en: 'States Earth rotates on its axis, in Aryabhatiya Golapada', hi: 'आर्यभटीय गोलपाद में पृथ्वी के अक्षीय घूर्णन का कथन' }, color: '#f0d48a' },
  { year: '628 CE', person: 'Brahmagupta', event: { en: 'Disputes Aryabhata — active scientific debate', hi: 'आर्यभट का विरोध — सक्रिय वैज्ञानिक बहस' }, color: '#60a5fa' },
  { year: '1000 CE', person: 'Al-Biruni', event: { en: 'Arab scholar visits India, translates Aryabhatiya', hi: 'अरब विद्वान भारत आए, आर्यभटीय का अनुवाद किया' }, color: '#a78bfa' },
  { year: '1543 CE', person: 'Copernicus', event: { en: 'Publishes heliocentric model in Europe', hi: 'यूरोप में सौर-केंद्रित मॉडल प्रकाशित किया' }, color: '#f87171' },
  { year: '1632 CE', person: 'Galileo', event: { en: 'Imprisoned for teaching Earth moves', hi: 'पृथ्वी के गतिशील होने का पाठ पढ़ाने पर कारावास' }, color: '#f87171' },
  { year: '1687 CE', person: 'Newton', event: { en: 'Resolves the "thrown stone" objection with inertia', hi: 'जड़त्व से "फेंके गए पत्थर" की आपत्ति हल की' }, color: '#34d399' },
];

const ACHIEVEMENTS = [
  { metric: 'Sidereal day', aryabhata: '23h 56m 4.1s', modern: '23h 56m 4.091s', accuracy: '99.999%' },
  { metric: "Earth's circumference", aryabhata: '39,736 miles', modern: '24,901 miles', accuracy: '99.4%' },
  { metric: "Earth's diameter", aryabhata: '8,316 miles', modern: '7,917 miles', accuracy: '95%' },
  { metric: 'Year length', aryabhata: '365d 6h 12m 30s', modern: '365d 6h 9m 10s', accuracy: '99.99%' },
  { metric: 'Moon\'s orbit period', aryabhata: '27.32 days', modern: '27.32 days', accuracy: '99.99%' },
];

export default async function EarthRotationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{l(L.title)}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{l(L.subtitle)}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={l(L.title)} locale={locale} />
        </div>
      </div>

      {/* ── Section 1: The Quote ─────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s1Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s1Body)}</p>

        {/* Sanskrit verse */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4">
          <p className="text-xs text-text-secondary mb-2 font-semibold">{isHi ? 'आर्यभटीय, गोलपाद, श्लोक 9' : 'Aryabhatiya, Golapada, Verse 9'}</p>
          <p className="text-gold-light text-base font-mono leading-relaxed mb-3" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            {L.s1Sanskrit}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed italic">
            {l(L.s1Quote1)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-emerald-300 text-xs">
            {isHi
              ? '✦ आर्यभट ने नाव के उपमा का उपयोग किया — एक चलती नाव पर एक व्यक्ति स्थिर किनारे को पीछे जाते देखता है। यह आइंस्टाइन के सापेक्षता के सिद्धांत का वही प्रारंभिक बिंदु है।'
              : '✦ Aryabhata used the boat analogy — a person on a moving boat sees the stationary shore moving backward. This is the same starting point as Einstein\'s principle of relativity.'}
          </p>
        </div>
      </div>

      {/* ── Section 2: Why Revolutionary ────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s2Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s2Body)}</p>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/15">
            <div className="text-red-300 font-semibold text-sm mb-2">{isHi ? 'टॉलेमी का मॉडल (~150 CE)' : 'Ptolemaic Model (~150 CE)'}</div>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {isHi ? 'पृथ्वी केंद्र में स्थिर' : 'Earth fixed at center'}</li>
              <li>• {isHi ? 'सूर्य, चंद्रमा, ग्रह — पृथ्वी के चारों ओर घूमते हैं' : 'Sun, Moon, planets orbit Earth'}</li>
              <li>• {isHi ? '1,400 वर्षों तक यूरोप में प्रभुत्व' : 'Dominated Europe for 1,400 years'}</li>
              <li>• {isHi ? 'चर्च द्वारा हठधर्मिता के रूप में स्वीकृत' : 'Accepted as Church dogma'}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
            <div className="text-emerald-300 font-semibold text-sm mb-2">{isHi ? 'आर्यभट का मॉडल (499 CE)' : "Aryabhata's Model (499 CE)"}</div>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {isHi ? 'पृथ्वी अपनी धुरी पर घूमती है' : 'Earth rotates on its axis'}</li>
              <li>• {isHi ? 'तारों की स्पष्ट गति पृथ्वी के घूर्णन के कारण' : "Stars' apparent motion due to Earth's rotation"}</li>
              <li>• {isHi ? 'सापेक्ष गति का सिद्धांत प्रस्तुत किया' : 'Principle of relative motion stated'}</li>
              <li>• {isHi ? 'आगे चलकर केरल स्कूल ने इसे विकसित किया' : 'Later extended by Kerala School'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Section 3: Brahmagupta Debate ───────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s3Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s3Body)}</p>

        <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/15">
          <p className="text-blue-200 font-semibold text-xs mb-2">{isHi ? 'ब्रह्मगुप्त की आपत्ति (628 CE)' : "Brahmagupta's Objection (628 CE)"}</p>
          <p className="text-text-secondary text-sm italic">
            {isHi
              ? '"यदि पृथ्वी घूमती है, तो ऊपर फेंकी गई वस्तु पश्चिम में क्यों नहीं गिरती?" — ब्रह्मस्फुटसिद्धांत, अध्याय 11'
              : '"If the Earth rotates, why does an object thrown upward not land to the west?" — Brahmasphutasiddhanta, Ch. 11'}
          </p>
          <p className="text-text-secondary text-xs mt-2">
            {isHi
              ? '→ उत्तर: न्यूटन का जड़त्व — वस्तु पृथ्वी की गति को साथ लेती है। 1,059 वर्षों में खोजा गया।'
              : '→ Answer: Newton\'s inertia — the object carries the Earth\'s motion with it. Discovered 1,059 years later.'}
          </p>
        </div>
      </div>

      {/* ── Section 4: Circumference ────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s4Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s4Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
            <div className="text-gold-light text-2xl font-bold">39,968 km</div>
            <div className="text-text-secondary text-xs mt-1">{isHi ? 'आर्यभट की गणना' : "Aryabhata's calculation"}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-text-primary text-2xl font-bold">40,075 km</div>
            <div className="text-text-secondary text-xs mt-1">{isHi ? 'आधुनिक मान' : 'Modern value'}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center">
            <div className="text-emerald-400 text-2xl font-bold">99.7%</div>
            <div className="text-text-secondary text-xs mt-1">{isHi ? 'सटीकता (499 CE में!)' : 'Accuracy (in 499 CE!)'}</div>
          </div>
        </div>
      </div>

      {/* ── Section 5: Sidereal / Ayanamsha ─────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s5Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s5Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="text-text-secondary text-xs mb-2 font-semibold">{isHi ? 'नाक्षत्र दिन — आर्यभट' : 'Sidereal Day — Aryabhata'}</div>
            <div className="text-gold-light text-lg font-mono">23h 56m 4.1s</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="text-text-secondary text-xs mb-2 font-semibold">{isHi ? 'नाक्षत्र दिन — आधुनिक' : 'Sidereal Day — Modern'}</div>
            <div className="text-emerald-400 text-lg font-mono">23h 56m 4.091s</div>
          </div>
        </div>
        <p className="text-text-secondary text-xs mt-3 italic">
          {isHi
            ? '→ अंतर: 0.009 सेकंड। 1,500 वर्षों के बाद। यह इसलिए नहीं है कि उन्होंने भाग्य से अनुमान लगाया — यह इसलिए है कि उनके पास गणितीय मॉडल था।'
            : '→ Difference: 0.009 seconds. After 1,500 years. This is not because he guessed lucky — it\'s because he had a mathematical model.'}
        </p>
      </div>

      {/* ── Section 6: Timeline ──────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-6" style={hf}>{l(L.s6Title)}</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gold-primary/20" />
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-center z-10 border"
                  style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}
                >
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.year}</span>
                </div>
                <div className="pt-1">
                  <div className="text-text-primary text-sm font-semibold">{item.person}</div>
                  <div className="text-text-secondary text-xs leading-relaxed">{l(item.event)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 7: Achievements Table ───────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s7Title)}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-4">{isHi ? 'माप' : 'Measurement'}</th>
                <th className="text-right text-gold-light py-2 pr-4">{isHi ? 'आर्यभट (499 CE)' : 'Aryabhata (499 CE)'}</th>
                <th className="text-right text-gold-light py-2 pr-4">{isHi ? 'आधुनिक मान' : 'Modern Value'}</th>
                <th className="text-right text-gold-light py-2">{isHi ? 'सटीकता' : 'Accuracy'}</th>
              </tr>
            </thead>
            <tbody>
              {ACHIEVEMENTS.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="text-text-primary py-2 pr-4">{row.metric}</td>
                  <td className="text-right text-text-secondary py-2 pr-4 font-mono">{row.aryabhata}</td>
                  <td className="text-right text-text-secondary py-2 pr-4 font-mono">{row.modern}</td>
                  <td className="text-right text-emerald-400 py-2 font-mono font-semibold">{row.accuracy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {l(L.backLink)}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/sine" className="px-4 py-2 rounded-xl bg-gold-primary/10 border border-gold-primary/15 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
            ← {l(L.prevPage)}
          </Link>
          <Link href="/learn/contributions/calculus" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.nextPage)} →
          </Link>
        </div>
      </div>

    </div>
  );
}
