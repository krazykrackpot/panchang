/* ════════════════════════════════════════════════════════════════
   Web Stories — 5 Google-optimized swipeable stories
   ════════════════════════════════════════════════════════════════ */

export interface StorySlide {
  type: 'title' | 'fact' | 'comparison' | 'quote' | 'cta';
  heading: { en: string; hi: string };
  body?: { en: string; hi: string };
  stat?: string;
  bgColor?: string;
  sourceText?: { en: string; hi: string };
}

export interface WebStory {
  slug: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  slides: StorySlide[];
  ctaUrl: string;
}

export const WEB_STORIES: WebStory[] = [
  /* ── Story 1: Sine is Sanskrit ── */
  {
    slug: 'sine-is-sanskrit',
    title: {
      en: 'Did You Know "Sine" Is Sanskrit?',
      hi: 'क्या आप जानते हैं "Sine" संस्कृत है?',
    },
    description: {
      en: 'The word "sine" comes from the Sanskrit word Jya meaning bowstring. Aryabhata created the first sine table in 499 CE.',
      hi: '"Sine" शब्द संस्कृत "ज्या" से आया है जिसका अर्थ है धनुष की प्रत्यंचा।',
    },
    ctaUrl: '/learn/contributions/sine',
    slides: [
      {
        type: 'title',
        heading: { en: 'DID YOU KNOW\n"SINE" IS SANSKRIT?', hi: 'क्या आप जानते हैं\n"SINE" संस्कृत है?' },
        bgColor: '#1a0a30',
      },
      {
        type: 'fact',
        heading: { en: 'The word comes from "Jya" (ज्या)', hi: 'यह शब्द "ज्या" से आया है' },
        body: { en: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', hi: 'ज्या का अर्थ है धनुष की प्रत्यंचा। प्राचीन भारतीय गणितज्ञों ने वृत्त में धनुष देखा — अर्धज्या बनी sine फ़ंक्शन।' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Aryabhata created the first sine table', hi: 'आर्यभट ने बनाई पहली ज्या तालिका' },
        body: { en: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', hi: '499 ई. में आर्यभट ने 3.75 अंश के अंतराल पर 24 ज्या मान संकलित किए — सम्पूर्ण आधुनिक त्रिकोणमिति की नींव।' },
        stat: '499 CE',
        bgColor: '#1a1040',
      },
      {
        type: 'comparison',
        heading: { en: 'The Great Mistranslation', hi: 'महान भ्रांत अनुवाद' },
        body: { en: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', hi: 'ज्या → जीब (अरबी में "य" नहीं) → जैब (अरबी में "जेब") → Sinus (लैटिन में "जेब") → Sine। चार चरण, तीन भाषाएँ, एक भूल।' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'Accurate to 4 decimal places', hi: '4 दशमलव स्थानों तक सटीक' },
        body: { en: 'Aryabhata\'s 24 values achieved 99.97% accuracy — computed entirely by hand, 1,500 years ago.', hi: 'आर्यभट के 24 मान 99.97% सटीक थे — पूर्णतः हस्तगणना द्वारा, 1,500 वर्ष पहले।' },
        stat: '99.97%',
        bgColor: '#0a2a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Greeks used full chords. Indians invented the HALF-chord.', hi: 'यूनानियों ने पूर्ण जीवा प्रयोग की। भारतीयों ने अर्धज्या का आविष्कार किया।' },
        body: { en: 'Ptolemy\'s chord tables required dividing by 2 every time. The Indian insight of using the half-chord directly was the breakthrough that made trigonometry practical.', hi: 'टॉलेमी की जीवा तालिकाओं में हर बार 2 से भाग देना पड़ता था। अर्धज्या का सीधा प्रयोग वह सफलता थी जिसने त्रिकोणमिति को व्यावहारिक बनाया।' },
        bgColor: '#1a0a30',
      },
      {
        type: 'quote',
        heading: { en: 'Every GPS satellite uses Aryabhata\'s invention', hi: 'हर GPS उपग्रह आर्यभट के आविष्कार का उपयोग करता है' },
        body: { en: 'Navigation, 3D graphics, signal processing, music compression — the sine function is everywhere. And it started with a bowstring.', hi: 'नौवहन, 3D ग्राफ़िक्स, सिग्नल प्रोसेसिंग, संगीत संपीड़न — ज्या फ़ंक्शन सर्वत्र है। और यह एक धनुष की प्रत्यंचा से शुरू हुआ।' },
        sourceText: { en: 'Modern application', hi: 'आधुनिक उपयोग' },
        bgColor: '#0a1a2a',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें' },
        body: { en: 'Discover how a Sanskrit bowstring became the world\'s most important mathematical function.', hi: 'जानें कैसे एक संस्कृत धनुष-प्रत्यंचा बनी विश्व का सबसे महत्वपूर्ण गणितीय फ़ंक्शन।' },
        bgColor: '#1a1040',
      },
    ],
  },

  /* ── Story 2: Zero Was Indian ── */
  {
    slug: 'zero-was-indian',
    title: {
      en: 'Zero — The Most Dangerous Idea in History',
      hi: 'शून्य — इतिहास का सबसे खतरनाक विचार',
    },
    description: {
      en: 'Brahmagupta defined zero as a number in 628 CE. Europe banned Arabic numerals in 1299. The most important invention in mathematics.',
      hi: 'ब्रह्मगुप्त ने 628 ई. में शून्य को एक संख्या के रूप में परिभाषित किया।',
    },
    ctaUrl: '/learn/contributions/zero',
    slides: [
      {
        type: 'title',
        heading: { en: 'ZERO\nTHE MOST DANGEROUS\nIDEA IN HISTORY', hi: 'शून्य\nइतिहास का सबसे\nखतरनाक विचार' },
        bgColor: '#0a0a20',
      },
      {
        type: 'fact',
        heading: { en: 'Brahmagupta defined zero as a NUMBER', hi: 'ब्रह्मगुप्त ने शून्य को संख्या के रूप में परिभाषित किया' },
        body: { en: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', hi: '628 ई. में, अपने ब्राह्मस्फुटसिद्धांत में, ब्रह्मगुप्त ने शून्य के साथ अंकगणित के पहले नियम लिखे।' },
        stat: '628 CE',
        bgColor: '#1a1040',
      },
      {
        type: 'quote',
        heading: { en: 'शून्यं शून्येन संयुक्तं शून्यम्', hi: 'शून्यं शून्येन संयुक्तं शून्यम्' },
        body: { en: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', hi: '"शून्य में शून्य जोड़ने पर शून्य।" — ब्रह्मगुप्त ने शून्यता के नियम लिखे।' },
        sourceText: { en: 'Brahmasphutasiddhanta, 628 CE', hi: 'ब्राह्मस्फुटसिद्धांत, 628 ई.' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'Florence BANNED Arabic numerals in 1299', hi: 'फ्लोरेंस ने 1299 में अरबी अंक प्रतिबंधित किए' },
        body: { en: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', hi: 'यूरोपीय व्यापारियों को डर था कि नई संख्याओं में जालसाजी आसान होगी। फ्लोरेंस ने इन्हें प्रतिबंधित किया।' },
        stat: 'BANNED',
        bgColor: '#2a0a0a',
      },
      {
        type: 'comparison',
        heading: { en: 'The Journey of Zero', hi: 'शून्य की यात्रा' },
        body: { en: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', hi: 'भारत (628 ई.) → बगदाद (825 ई.) → यूरोप (1202 ई.)। शून्य को भारत से यूरोप पहुँचने में लगभग 600 वर्ष लगे।' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Without zero: no binary, no computers, no internet', hi: 'शून्य के बिना: न बाइनरी, न कंप्यूटर, न इंटरनेट' },
        body: { en: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', hi: 'हर डिजिटल उपकरण 0 और 1 पर चलता है। बाइनरी कोड, बूलियन तर्क, डिजिटल सर्किट — सब शून्य के बिना असंभव।' },
        bgColor: '#0a2020',
      },
      {
        type: 'quote',
        heading: { en: 'The most important invention in mathematics. Period.', hi: 'गणित का सबसे महत्वपूर्ण आविष्कार। बस।' },
        body: { en: 'Without zero, there is no place-value system. Without place-value, there are no large calculations. Without large calculations, there is no modern science.', hi: 'शून्य के बिना स्थानीय मान प्रणाली नहीं। स्थानीय मान के बिना बड़ी गणनाएँ नहीं। बड़ी गणनाओं के बिना आधुनिक विज्ञान नहीं।' },
        bgColor: '#1a0a30',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें' },
        body: { en: 'How a concept that terrified Europe became the foundation of all modern technology.', hi: 'कैसे एक अवधारणा जिसने यूरोप को भयभीत किया, सारी आधुनिक प्रौद्योगिकी की नींव बनी।' },
        bgColor: '#0a0a20',
      },
    ],
  },

  /* ── Story 3: Calculus Before Newton ── */
  {
    slug: 'calculus-before-newton',
    title: {
      en: 'Calculus Was Invented in Kerala',
      hi: 'कलन का आविष्कार केरल में हुआ',
    },
    description: {
      en: 'Madhava of Sangamagrama discovered infinite series around 1350 CE — 316 years before Newton and Leibniz.',
      hi: 'संगमग्राम के माधव ने 1350 ई. के आसपास अनंत श्रेणी की खोज की — न्यूटन और लाइबनिट्ज़ से 316 वर्ष पहले।',
    },
    ctaUrl: '/learn/contributions/kerala-school',
    slides: [
      {
        type: 'title',
        heading: { en: 'CALCULUS WAS\nINVENTED IN KERALA', hi: 'कलन का आविष्कार\nकेरल में हुआ' },
        bgColor: '#0a2a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Madhava discovered infinite series', hi: 'माधव ने अनंत श्रेणी की खोज की' },
        body: { en: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', hi: '1350 ई. के आसपास, केरल के संगमग्राम के माधव ने sine, cosine और arctangent की अनंत श्रेणी विस्तार विकसित किए — कलन के मूल उपकरण।' },
        stat: '1350',
        bgColor: '#1a1040',
      },
      {
        type: 'fact',
        heading: { en: 'The Madhava-Leibniz Series', hi: 'माधव-लाइबनिट्ज़ श्रेणी' },
        body: { en: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', hi: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... माधव ने यह सूत्र लाइबनिट्ज़ द्वारा यूरोप में प्रकाशित करने से तीन शताब्दी पहले खोजा।' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'He computed π to 11 decimal places', hi: 'उन्होंने π को 11 दशमलव स्थानों तक गणना किया' },
        body: { en: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', hi: 'अपनी अनंत श्रेणी और सुधार पदों का उपयोग करते हुए, माधव ने π = 3.14159265359 प्राप्त किया — शताब्दियों तक अटूट रिकॉर्ड।' },
        stat: '11 decimals',
        bgColor: '#2a1a0a',
      },
      {
        type: 'comparison',
        heading: { en: '316 Years Earlier', hi: '316 वर्ष पहले' },
        body: { en: 'Madhava (~1350 CE) vs Newton/Leibniz (~1666 CE). The Kerala School of Mathematics had calculus-like tools three centuries before Europe.', hi: 'माधव (~1350 ई.) बनाम न्यूटन/लाइबनिट्ज़ (~1666 ई.)। केरल गणित विद्यालय के पास यूरोप से तीन शताब्दी पहले कलन-सदृश उपकरण थे।' },
        bgColor: '#1a0a30',
      },
      {
        type: 'fact',
        heading: { en: 'The first calculus TEXTBOOK', hi: 'पहली कलन पाठ्यपुस्तक' },
        body: { en: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', hi: 'ज्येष्ठदेव ने 1530 में युक्तिभाषा लिखी — गणितीय प्रमाणों की विस्तृत पाठ्यपुस्तक, जिसमें अनंत श्रेणी की व्युत्पत्तियाँ शामिल हैं।' },
        bgColor: '#0a2020',
      },
      {
        type: 'quote',
        heading: { en: '"The Leibniz series should be called the Madhava series"', hi: '"लाइबनिट्ज़ श्रेणी को माधव श्रेणी कहा जाना चाहिए"' },
        body: { en: 'Modern historians of mathematics increasingly acknowledge that these infinite series were discovered in Kerala long before their European "discovery."', hi: 'गणित के आधुनिक इतिहासकार बढ़ते क्रम में स्वीकार करते हैं कि ये अनंत श्रेणियाँ यूरोपीय "खोज" से बहुत पहले केरल में खोजी गई थीं।' },
        sourceText: { en: 'Modern mathematical historians', hi: 'आधुनिक गणित इतिहासकार' },
        bgColor: '#1a1040',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें' },
        body: { en: 'The Kerala School of Mathematics — India\'s forgotten revolution in calculus.', hi: 'केरल गणित विद्यालय — कलन में भारत की भूली हुई क्रांति।' },
        bgColor: '#0a2a1a',
      },
    ],
  },

  /* ── Story 4: Pythagoras Was Indian ── */
  {
    slug: 'pythagoras-was-indian',
    title: {
      en: 'The "Pythagorean" Theorem — 300 Years Before Pythagoras',
      hi: '"पाइथागोरस" प्रमेय — पाइथागोरस से 300 वर्ष पहले',
    },
    description: {
      en: 'Baudhayana stated the theorem in the Sulba Sutra around 800 BCE, centuries before Pythagoras was born.',
      hi: 'बौधायन ने यह प्रमेय शुल्ब सूत्र में ~800 ई.पू. में कहा, पाइथागोरस के जन्म से शताब्दियों पहले।',
    },
    ctaUrl: '/learn/contributions/pythagoras',
    slides: [
      {
        type: 'title',
        heading: { en: 'THE "PYTHAGOREAN"\nTHEOREM\n300 YEARS BEFORE\nPYTHAGORAS', hi: '"पाइथागोरस" प्रमेय\nपाइथागोरस से\n300 वर्ष पहले' },
        bgColor: '#2a0a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Baudhayana stated it in the Sulba Sutra', hi: 'बौधायन ने इसे शुल्ब सूत्र में कहा' },
        body: { en: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', hi: '~800 ई.पू. में, ऋषि बौधायन ने समकोण और वर्ग बनाने के सटीक नियम लिखे — जिसमें समकोण त्रिभुज की भुजाओं के बीच संबंध शामिल है।' },
        stat: '800 BCE',
        bgColor: '#1a1040',
      },
      {
        type: 'quote',
        heading: { en: 'The Original Sanskrit', hi: 'मूल संस्कृत' },
        body: { en: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', hi: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — आयत का विकर्ण वे दोनों क्षेत्रफल उत्पन्न करता है जो उसकी लंबाई और चौड़ाई अलग-अलग उत्पन्न करते हैं।' },
        sourceText: { en: 'Baudhayana Sulba Sutra, ~800 BCE', hi: 'बौधायन शुल्ब सूत्र, ~800 ई.पू.' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'He calculated √2 to 5 decimal places', hi: 'उन्होंने √2 को 5 दशमलव स्थानों तक गणना किया' },
        body: { en: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', hi: 'बौधायन ने √2 = 1.41421 दिया — 800 ई.पू. के लिए गणना की एक अद्भुत उपलब्धि, 5 दशमलव स्थानों तक सही।' },
        stat: '1.41421',
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Built for Vedic Fire Altars', hi: 'वैदिक अग्नि वेदियों के लिए निर्मित' },
        body: { en: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', hi: 'शुल्ब सूत्र सटीक ज्यामितीय आकारों की पवित्र अग्नि वेदियों के निर्माण के लिए व्यावहारिक पुस्तिकाएँ थीं।' },
        bgColor: '#1a0a30',
      },
      {
        type: 'comparison',
        heading: { en: 'The Timeline', hi: 'समयरेखा' },
        body: { en: 'Baudhayana (~800 BCE) vs Pythagoras (~500 BCE). The Indian formulation predates the Greek one by roughly 300 years.', hi: 'बौधायन (~800 ई.पू.) बनाम पाइथागोरस (~500 ई.पू.)। भारतीय सूत्रीकरण यूनानी से लगभग 300 वर्ष पहले है।' },
        bgColor: '#0a2020',
      },
      {
        type: 'fact',
        heading: { en: 'Pythagoras left no written works', hi: 'पाइथागोरस ने कोई लिखित कार्य नहीं छोड़ा' },
        body: { en: 'Everything attributed to Pythagoras was recorded by followers centuries later. The Sulba Sutras, by contrast, are dated physical texts.', hi: 'पाइथागोरस को श्रेय दी गई हर बात शताब्दियों बाद अनुयायियों ने दर्ज की। शुल्ब सूत्र, इसके विपरीत, दिनांकित भौतिक ग्रंथ हैं।' },
        bgColor: '#1a1040',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें' },
        body: { en: 'The Sulba Sutras — geometry born from sacred fire.', hi: 'शुल्ब सूत्र — पवित्र अग्नि से जन्मी ज्यामिति।' },
        bgColor: '#2a0a1a',
      },
    ],
  },

  /* ── Story 5: Speed of Light ── */
  {
    slug: 'speed-of-light',
    title: {
      en: 'Speed of Light — In a 14th Century Text',
      hi: 'प्रकाश की गति — एक 14वीं शताब्दी के ग्रंथ में',
    },
    description: {
      en: 'Sayana\'s commentary on the Rig Veda contains a value for the speed of light accurate to 0.14%.',
      hi: 'सायण की ऋग्वेद टीका में प्रकाश की गति का मान 0.14% सटीक है।',
    },
    ctaUrl: '/learn/contributions/speed-of-light',
    slides: [
      {
        type: 'title',
        heading: { en: 'SPEED OF LIGHT\nIN A 14TH CENTURY\nTEXT', hi: 'प्रकाश की गति\n14वीं शताब्दी के\nग्रंथ में' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Sayana\'s commentary on Rig Veda', hi: 'सायण की ऋग्वेद टीका' },
        body: { en: 'In his 14th century commentary on Rig Veda hymn 1.50.4 (a hymn to the Sun), Sayana describes the speed at which sunlight travels.', hi: 'ऋग्वेद सूक्त 1.50.4 (सूर्य स्तुति) पर अपनी 14वीं शताब्दी की टीका में, सायण ने सूर्य के प्रकाश की गति का वर्णन किया।' },
        bgColor: '#1a1040',
      },
      {
        type: 'quote',
        heading: { en: '"2,202 yojanas in half a nimesha"', hi: '"अर्ध निमेष में 2,202 योजन"' },
        body: { en: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', hi: '"योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण" — अर्ध निमेष में 2,202 योजन।' },
        sourceText: { en: 'Rig Veda 1.50.4, Sayana\'s commentary', hi: 'ऋग्वेद 1.50.4, सायण भाष्य' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'Calculated: ~186,536 miles per second', hi: 'गणना: ~186,536 मील प्रति सेकंड' },
        body: { en: 'Using the traditional definitions of yojana (~9 miles) and nimesha (~16/75 seconds), the value works out to approximately 186,536 miles per second.', hi: 'योजन (~9 मील) और निमेष (~16/75 सेकंड) की पारंपरिक परिभाषाओं का उपयोग करते हुए, यह मान लगभग 186,536 मील प्रति सेकंड बनता है।' },
        stat: '186,536',
        bgColor: '#0a2a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Modern value: 186,282 miles per second', hi: 'आधुनिक मान: 186,282 मील प्रति सेकंड' },
        body: { en: 'The scientifically measured speed of light in a vacuum is 186,282 miles per second (299,792 km/s).', hi: 'निर्वात में प्रकाश की वैज्ञानिक रूप से मापी गई गति 186,282 मील प्रति सेकंड (299,792 किमी/से) है।' },
        stat: '186,282',
        bgColor: '#1a0a30',
      },
      {
        type: 'comparison',
        heading: { en: 'Accuracy: 0.14% Error', hi: 'सटीकता: 0.14% त्रुटि' },
        body: { en: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', hi: 'वैदिक मान और आधुनिक माप के बीच का अंतर मात्र 0.14% है — किसी भी वैज्ञानिक माप से शताब्दियों पहले लिखे ग्रंथ के लिए लगभग असंभव सटीकता।' },
        stat: '0.14%',
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Ole Romer measured it 300 years later', hi: 'ओले रोमर ने 300 वर्ष बाद मापा' },
        body: { en: 'The first European measurement of the speed of light came from Danish astronomer Ole Romer in 1676 — roughly 300 years after Sayana\'s commentary.', hi: 'प्रकाश की गति का पहला यूरोपीय माप 1676 में डेनिश खगोलशास्त्री ओले रोमर से आया — सायण की टीका के लगभग 300 वर्ष बाद।' },
        bgColor: '#1a1040',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें' },
        body: { en: 'How an ancient hymn to the Sun encoded a value that modern science took centuries to measure.', hi: 'कैसे सूर्य की एक प्राचीन स्तुति ने वह मान संकेतित किया जिसे मापने में आधुनिक विज्ञान को शताब्दियाँ लगीं।' },
        bgColor: '#0a1a3a',
      },
    ],
  },
];

export function getStoryBySlug(slug: string): WebStory | undefined {
  return WEB_STORIES.find(s => s.slug === slug);
}

export function getAllStorySlugs(): string[] {
  return WEB_STORIES.map(s => s.slug);
}
