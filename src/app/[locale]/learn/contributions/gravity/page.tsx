import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: 'Gravity — 500 Years Before Newton\'s Apple',
    hi: 'गुरुत्वाकर्षण — न्यूटन के सेब से 500 वर्ष पहले',
  },
  subtitle: {
    en: 'Everyone knows the story: Newton sat under a tree, an apple fell, and he discovered gravity in 1687. But 537 years earlier, an Indian mathematician had already written: "The Earth, by its own force, attracts objects toward itself." Newton quantified it. India described it.',
    hi: 'सभी कहानी जानते हैं: न्यूटन एक पेड़ के नीचे बैठे, एक सेब गिरा, और उन्होंने 1687 में गुरुत्वाकर्षण की खोज की। लेकिन 537 वर्ष पहले, एक भारतीय गणितज्ञ ने पहले ही लिखा था: "पृथ्वी अपनी शक्ति से वस्तुओं को अपनी ओर आकर्षित करती है।" न्यूटन ने इसे मात्रात्मक रूप दिया। भारत ने इसका वर्णन किया।',
  },

  s1Title: {
    en: 'Bhaskaracharya II — The Clearest Statement (1150 CE)',
    hi: 'भास्कराचार्य II — सबसे स्पष्ट कथन (1150 CE)',
  },
  s1Body: {
    en: 'Bhaskaracharya II (1114–1185 CE), author of the Siddhanta Shiromani, wrote the most explicit Indian statement of gravitational attraction. In the Goladhyaya (Chapter on the Celestial Sphere), he states that the Earth attracts objects by its own force — and that this force acts in all directions, not just downward. He was the royal astronomer at the Ujjain observatory, arguably the greatest Indian mathematician of the medieval period.',
    hi: 'भास्कराचार्य II (1114-1185 CE), सिद्धांत शिरोमणि के लेखक, ने गुरुत्वीय आकर्षण का सबसे स्पष्ट भारतीय कथन लिखा। गोलाध्याय (आकाशीय गोल पर अध्याय) में, वे कहते हैं कि पृथ्वी अपनी शक्ति से वस्तुओं को आकर्षित करती है — और यह बल सभी दिशाओं में काम करता है, न केवल नीचे की ओर। वे उज्जैन वेधशाला में राज-खगोलशास्त्री थे, निस्संदेह मध्यकालीन भारत के महानतम गणितज्ञ।',
  },
  s1Sanskrit: 'मृत्स्वभावा चेयं भूः स्वशक्त्याऽधःपतनात्।',
  s1Translation: {
    en: '"The Earth has the nature of drawing things downward [toward itself] by its own power."',
    hi: '"पृथ्वी में अपनी शक्ति से वस्तुओं को नीचे [अपनी ओर] खींचने का स्वभाव है।"',
  },
  s1Source: {
    en: 'Siddhanta Shiromani, Goladhyaya, verse on Bhugola (Earth-sphere), ~1150 CE',
    hi: 'सिद्धांत शिरोमणि, गोलाध्याय, भूगोल पर श्लोक, ~1150 CE',
  },

  s2Title: {
    en: 'Varahamihira (505 CE) — The Earliest Statement',
    hi: 'वराहमिहिर (505 CE) — सबसे प्रारंभिक कथन',
  },
  s2Body: {
    en: 'Varahamihira (505–587 CE) in the Pancha Siddhantika (A Compendium of Five Astronomical Systems) provides one of the earliest explicit descriptions of gravitational attraction. He asks: why don\'t objects fly off the Earth? His answer: the Earth exerts an attractive force on all objects on its surface. He also noted that the force varies with distance, a remarkable insight.',
    hi: 'वराहमिहिर (505-587 CE) पंचसिद्धांतिका (पाँच खगोलीय प्रणालियों का संग्रह) में गुरुत्वीय आकर्षण के सबसे प्रारंभिक स्पष्ट विवरणों में से एक प्रदान करते हैं। वे पूछते हैं: वस्तुएँ पृथ्वी से उड़ क्यों नहीं जातीं? उनका उत्तर: पृथ्वी अपनी सतह पर सभी वस्तुओं पर एक आकर्षण बल लगाती है। उन्होंने यह भी नोट किया कि बल दूरी के साथ बदलता है, एक उल्लेखनीय अंतर्दृष्टि।',
  },

  s3Title: {
    en: 'Brahmagupta (628 CE) — Earth as Attractor',
    hi: 'ब्रह्मगुप्त (628 CE) — आकर्षक के रूप में पृथ्वी',
  },
  s3Quote: {
    en: 'In the Brahmasphutasiddhanta (628 CE), Brahmagupta writes: "Bodies fall towards the earth as it is in the nature of the earth to attract bodies, just as it is the nature of water to flow downwards." This is a direct statement of gravitational attraction — "in the nature of the earth" — 1,059 years before Newton.',
    hi: 'ब्रह्मस्फुटसिद्धांत (628 CE) में, ब्रह्मगुप्त लिखते हैं: "वस्तुएँ पृथ्वी की ओर गिरती हैं क्योंकि पृथ्वी का यह स्वभाव है कि वह वस्तुओं को आकर्षित करे, जैसे पानी का स्वभाव है नीचे की ओर बहना।" यह गुरुत्वीय आकर्षण का प्रत्यक्ष कथन है — "पृथ्वी का स्वभाव" — न्यूटन से 1,059 वर्ष पहले।',
  },

  s4Title: {
    en: 'What Indian Thinkers Said vs What Newton Added',
    hi: 'भारतीय विचारकों ने क्या कहा बनाम न्यूटन ने क्या जोड़ा',
  },
  s4India: {
    en: 'Indian thinkers described: (1) Earth attracts objects by its own nature/force; (2) Objects fall toward the center of the Earth; (3) The force acts universally on the Earth\'s surface; (4) The force may vary with distance (Varahamihira). These are qualitative, physical descriptions — in the tradition of natural philosophy.',
    hi: 'भारतीय विचारकों ने वर्णित किया: (1) पृथ्वी अपने स्वभाव/शक्ति से वस्तुओं को आकर्षित करती है; (2) वस्तुएँ पृथ्वी के केंद्र की ओर गिरती हैं; (3) बल पृथ्वी की सतह पर सार्वभौमिक रूप से काम करता है; (4) बल दूरी के साथ बदल सकता है (वराहमिहिर)। ये गुणात्मक, भौतिक विवरण हैं — प्राकृतिक दर्शन की परंपरा में।',
  },
  s4Newton: {
    en: 'Newton\'s unique contribution (1687): F = Gm₁m₂/r² — a precise mathematical law giving the exact magnitude of force between any two masses, at any distance. Newton also proved that this same force explains planetary orbits (Kepler\'s laws follow from it). The quantitative leap from description to law is Newton\'s genius. Both contributions matter.',
    hi: 'न्यूटन का अनूठा योगदान (1687): F = Gm₁m₂/r² — एक सटीक गणितीय नियम जो किसी भी दो द्रव्यमानों के बीच, किसी भी दूरी पर, बल का सटीक परिमाण देता है। न्यूटन ने यह भी सिद्ध किया कि यही बल ग्रहीय कक्षाओं की व्याख्या करता है (केप्लर के नियम इससे प्राप्त होते हैं)। वर्णन से नियम तक का मात्रात्मक छलाँग न्यूटन की प्रतिभा है। दोनों योगदान महत्वपूर्ण हैं।',
  },

  s5Title: {
    en: 'How Gravity Affects Our Panchang Calculations',
    hi: 'गुरुत्वाकर्षण हमारी पंचांग गणनाओं को कैसे प्रभावित करता है',
  },
  s5Body: {
    en: 'Gravity is not just philosophy in this app — it drives the mathematics of every panchang element. The Moon\'s orbit speed is governed by Earth\'s gravity, which determines how many tithis occur per month. Eclipse paths depend on the Moon\'s gravitational path around Earth. The Sun\'s gravitational pull flattens Earth\'s orbit into a slight ellipse, causing the equation of time correction in sunrise calculations. The Moon\'s gravitational tides influence the precise moment tithis begin and end.',
    hi: 'इस ऐप में गुरुत्वाकर्षण केवल दर्शन नहीं है — यह प्रत्येक पंचांग तत्व के गणित को चलाता है। चंद्रमा की कक्षीय गति पृथ्वी के गुरुत्वाकर्षण द्वारा नियंत्रित है, जो निर्धारित करती है कि प्रति माह कितने तिथि होते हैं। ग्रहण मार्ग पृथ्वी के चारों ओर चंद्रमा के गुरुत्वाकर्षण पथ पर निर्भर करते हैं। सूर्य का गुरुत्वाकर्षण खिंचाव पृथ्वी की कक्षा को एक हल्के दीर्घवृत्त में समतल करता है, जो सूर्योदय गणनाओं में समय समीकरण सुधार का कारण बनता है।',
  },

  s6Title: {
    en: 'The Timeline — India to Newton',
    hi: 'समय-रेखा — भारत से न्यूटन तक',
  },

  s7Title: {
    en: 'The Ujjain Observatory — Where These Ideas Were Born',
    hi: 'उज्जैन वेधशाला — जहाँ ये विचार जन्मे',
  },
  s7Body: {
    en: 'Bhaskara II worked at the Ujjain observatory, which served as India\'s "prime meridian" for over 1,500 years. The observatory was a center of astronomical research from at least 500 CE. Brahmagupta, Varahamihira, and Bhaskara II all worked here or in its intellectual tradition. The observatory\'s data directly fed into gravity calculations: precise observations of the Moon\'s acceleration, Jupiter\'s orbital perturbations, and the precession of Earth\'s axis all require gravitational understanding.',
    hi: 'भास्कराचार्य II ने उज्जैन वेधशाला में काम किया, जिसने 1,500 से अधिक वर्षों तक भारत के "प्रमुख मध्याह्न" के रूप में सेवा की। वेधशाला कम से कम 500 CE से खगोलीय अनुसंधान का केंद्र थी। ब्रह्मगुप्त, वराहमिहिर, और भास्कराचार्य II सभी यहाँ या इसकी बौद्धिक परंपरा में काम किया। वेधशाला का डेटा सीधे गुरुत्वाकर्षण गणनाओं में प्रयुक्त हुआ: चंद्रमा के त्वरण के सटीक अवलोकन, बृहस्पति के कक्षीय विक्षोभ, और पृथ्वी की धुरी के अग्रगमन के लिए सभी को गुरुत्वाकर्षण की समझ की आवश्यकता है।',
  },

  backLink: { en: '← Back to Learn', hi: '← सीखने पर वापस' },
  prevPage: { en: 'Speed of Light', hi: 'प्रकाश की गति' },
  firstPage: { en: 'Sine — Sanskrit Origin', hi: 'Sine — संस्कृत उत्पत्ति' },
};

const TIMELINE = [
  {
    year: '505 CE',
    person: 'Varahamihira',
    text: { en: 'Pancha Siddhantika: Earth attracts objects, force varies with distance', hi: 'पंचसिद्धांतिका: पृथ्वी वस्तुओं को आकर्षित करती है, बल दूरी के साथ बदलता है' },
    color: '#f0d48a',
    gap: { en: '1,182 years before Newton', hi: 'न्यूटन से 1,182 वर्ष पहले' },
  },
  {
    year: '628 CE',
    person: 'Brahmagupta',
    text: { en: 'Brahmasphutasiddhanta: "In the nature of the earth to attract bodies"', hi: 'ब्रह्मस्फुटसिद्धांत: "पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना"' },
    color: '#60a5fa',
    gap: { en: '1,059 years before Newton', hi: 'न्यूटन से 1,059 वर्ष पहले' },
  },
  {
    year: '1150 CE',
    person: 'Bhaskaracharya II',
    text: { en: 'Siddhanta Shiromani: "Earth draws things downward by its own power"', hi: 'सिद्धांत शिरोमणि: "पृथ्वी अपनी शक्ति से वस्तुओं को नीचे खींचती है"' },
    color: '#a78bfa',
    gap: { en: '537 years before Newton', hi: 'न्यूटन से 537 वर्ष पहले' },
  },
  {
    year: '1590s CE',
    person: 'Galileo',
    text: { en: 'Demonstrates objects fall at same rate regardless of mass (Tower of Pisa)', hi: 'दर्शाते हैं वस्तुएँ द्रव्यमान की परवाह किए बिना एक ही दर से गिरती हैं' },
    color: '#f87171',
    gap: { en: '~100 years before Newton', hi: 'न्यूटन से ~100 वर्ष पहले' },
  },
  {
    year: '1687 CE',
    person: 'Isaac Newton',
    text: { en: 'Principia Mathematica: F = Gm₁m₂/r² — the quantitative law of universal gravitation', hi: 'प्रिंसिपिया मैथमेटिका: F = Gm₁m₂/r² — सार्वभौमिक गुरुत्वाकर्षण का मात्रात्मक नियम' },
    color: '#34d399',
    gap: null,
  },
];

const THINKERS = [
  {
    name: 'Varahamihira',
    dates: '505–587 CE',
    work: 'Pancha Siddhantika',
    quote: {
      en: 'Objects are attracted to Earth; the force keeps them from flying off the surface.',
      hi: 'वस्तुएँ पृथ्वी की ओर आकर्षित होती हैं; बल उन्हें सतह से उड़ने से रोकता है।',
    },
    color: '#f0d48a',
  },
  {
    name: 'Brahmagupta',
    dates: '598–668 CE',
    work: 'Brahmasphutasiddhanta',
    quote: {
      en: '"Bodies fall towards the earth as it is in the nature of the earth to attract bodies."',
      hi: '"वस्तुएँ पृथ्वी की ओर गिरती हैं क्योंकि पृथ्वी का स्वभाव वस्तुओं को आकर्षित करना है।"',
    },
    color: '#60a5fa',
  },
  {
    name: 'Bhaskaracharya II',
    dates: '1114–1185 CE',
    work: 'Siddhanta Shiromani',
    quote: {
      en: '"The Earth draws things downward by its own power." (Goladhyaya, ~1150 CE)',
      hi: '"पृथ्वी अपनी शक्ति से वस्तुओं को नीचे खींचती है।" (गोलाध्याय, ~1150 CE)',
    },
    color: '#a78bfa',
  },
];

const GRAVITY_CONNECTIONS = [
  {
    topic: { en: "Moon's orbit speed", hi: 'चंद्रमा की कक्षीय गति' },
    detail: { en: "Determined by Earth's gravity → sets tithi length", hi: 'पृथ्वी के गुरुत्वाकर्षण द्वारा निर्धारित → तिथि की लंबाई निर्धारित करती है' },
  },
  {
    topic: { en: 'Eclipse paths', hi: 'ग्रहण मार्ग' },
    detail: { en: "Moon's gravitational orbit → shadow geometry", hi: "चंद्रमा की गुरुत्वाकर्षण कक्षा → छाया ज्यामिति" },
  },
  {
    topic: { en: "Equation of time", hi: 'समय का समीकरण' },
    detail: { en: "Earth's elliptical orbit (gravity) → sunrise correction", hi: "पृथ्वी की दीर्घवृत्तीय कक्षा (गुरुत्व) → सूर्योदय सुधार" },
  },
  {
    topic: { en: 'Precession / Ayanamsha', hi: 'अग्रगमन / अयनांश' },
    detail: { en: "Gravity on Earth's equatorial bulge → 26,000 year cycle", hi: "पृथ्वी के भूमध्यरेखीय उभार पर गुरुत्व → 26,000 वर्ष का चक्र" },
  },
];

export default async function GravityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = (locale === 'hi' || String(locale) === 'sa');
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

      {/* ── The Three Thinkers ───────────────────────────────────── */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {THINKERS.map((t, i) => (
          <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-full mb-3 flex items-center justify-center text-[#0a0e27] font-bold text-sm" style={{ background: t.color }}>
              {t.dates.split('–')[0].replace(' CE', '')}
            </div>
            <div className="text-text-primary font-bold text-base mb-0.5">{t.name}</div>
            <div className="text-text-secondary text-xs mb-2">{t.dates} · {t.work}</div>
            <p className="text-text-secondary text-xs italic leading-relaxed">{l(t.quote)}</p>
          </div>
        ))}
      </div>

      {/* ── Section 1: Bhaskaracharya ────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s1Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s1Body)}</p>

        {/* Sanskrit verse */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4">
          <p className="text-xs text-text-secondary mb-2 font-semibold">{l(L.s1Source)}</p>
          <p className="text-gold-light text-base font-mono leading-relaxed mb-3" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            {L.s1Sanskrit}
          </p>
          <p className="text-text-secondary text-sm italic">{l(L.s1Translation)}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Author', hi: 'लेखक' }, value: 'Bhaskaracharya II' },
            { label: { en: 'Born', hi: 'जन्म' }, value: '1114 CE' },
            { label: { en: 'Work', hi: 'ग्रंथ' }, value: 'Siddhanta Shiromani' },
            { label: { en: 'Before Newton', hi: 'न्यूटन से पहले' }, value: '537 years' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{l(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: Varahamihira ──────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s2Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{l(L.s2Body)}</p>
      </div>

      {/* ── Section 3: Brahmagupta ───────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s3Title)}</h3>
        <div className="p-5 rounded-xl bg-blue-500/8 border border-blue-500/20 mb-4">
          <p className="text-blue-200 font-semibold text-xs mb-2">{isHi ? 'ब्रह्मस्फुटसिद्धांत, 628 CE' : 'Brahmasphutasiddhanta, 628 CE'}</p>
          <p className="text-text-secondary text-sm italic leading-relaxed">{l(L.s3Quote)}</p>
        </div>
      </div>

      {/* ── Section 4: India vs Newton ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s4Title)}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20">
            <p className="text-gold-light font-semibold text-sm mb-2">{isHi ? 'भारत — वर्णन (505-1150 CE)' : 'India — Description (505–1150 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{l(L.s4India)}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <p className="text-emerald-300 font-semibold text-sm mb-2">{isHi ? 'न्यूटन — मात्रात्मक नियम (1687 CE)' : 'Newton — Quantitative Law (1687 CE)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{l(L.s4Newton)}</p>
          </div>
        </div>

        {/* F = Gm1m2/r2 visual */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 text-center">
          <p className="text-text-secondary text-xs mb-2">{isHi ? "न्यूटन का सूत्र — जो भारत में नहीं था" : "Newton's formula — what India did NOT have"}</p>
          <p className="text-text-primary text-2xl font-mono font-bold">F = G · m₁m₂ / r²</p>
          <p className="text-text-secondary text-xs mt-2">{isHi ? 'G = गुरुत्वाकर्षण स्थिरांक | r = दोनों द्रव्यमानों के बीच दूरी' : 'G = gravitational constant | r = distance between masses'}</p>
        </div>
      </div>

      {/* ── Section 5: App Connection ──────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s5Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s5Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GRAVITY_CONNECTIONS.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-gold-primary flex-shrink-0 mt-1.5" />
              <div>
                <div className="text-text-primary text-sm font-semibold mb-1">{l(item.topic)}</div>
                <div className="text-text-secondary text-xs">{l(item.detail)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: Timeline ──────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-6" style={hf}>{l(L.s6Title)}</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gold-primary/20" />
          <div className="space-y-5">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-center z-10 border"
                  style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}
                >
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.year}</span>
                </div>
                <div className="pt-1 flex-1">
                  <div className="text-text-primary text-sm font-semibold">{item.person}</div>
                  <div className="text-text-secondary text-xs leading-relaxed mb-1">{l(item.text)}</div>
                  {item.gap && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/15">
                      {l(item.gap)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 7: Ujjain ───────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s7Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{l(L.s7Body)}</p>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {l(L.backLink)}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/speed-of-light" className="px-4 py-2 rounded-xl bg-gold-primary/10 border border-gold-primary/15 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
            ← {l(L.prevPage)}
          </Link>
          <Link href="/learn/contributions/sine" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.firstPage)} ↩
          </Link>
        </div>
      </div>

    </div>
  );
}
