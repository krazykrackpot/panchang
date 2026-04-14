'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { NakshatraIcon } from '@/components/icons/PanchangIcons';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

export default function NakshatraPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/panchang" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('backToPanchang')}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-6">
        <NakshatraIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2" style={headingFont}>
            <span className="text-gold-gradient">{tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्', ta: 'நட்சத்திரம்', te: 'నక్షత్రము', bn: 'নক্ষত্র', kn: 'ನಕ್ಷತ್ರ', gu: 'નક્ષત્ર', mai: 'नक्षत्र', mr: 'नक्षत्र' }, locale)}</span>
          </h1>
          <p className="text-text-secondary text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({ en: 'The 27 Lunar Mansions — Stars that Map the Ecliptic', hi: '27 चन्द्र गृह — क्रान्तिवृत्त के तारामण्डल', sa: 'सप्तविंशतिचन्द्रगृहाणि — क्रान्तिवृत्तं मापयन्ति ये ताराः', ta: '27 சந்திர மாளிகைகள் — கிரகண வட்டத்தை வரையறுக்கும் நட்சத்திரங்கள்', te: '27 చాంద్ర మందిరాలు — క్రాంతివృత్తాన్ని మ్యాప్ చేసే నక్షత్రాలు', bn: '27 চন্দ্র মনসিল — ক্রান্তিবৃত্তের মানচিত্র তৈরিকারী তারাগুলি', kn: '27 ಚಂದ್ರ ಮನೆಗಳು — ಕ್ರಾಂತಿವೃತ್ತವನ್ನು ಗುರುತಿಸುವ ನಕ್ಷತ್ರಗಳು', gu: '27 ચંદ્ર ભવنો — ક્રાંતિવૃત્ત દર્શાવતા તારા', mai: '27 चन्द्र गृह — क्रान्तिवृत्त मापनेवाला तारागण', mr: '27 चंद्र गृहे — क्रांतिवृत्त मोजणारे तारे' }, locale)}
          </p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* What are Nakshatras */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl({ en: 'What are Nakshatras?', hi: 'नक्षत्र क्या हैं?', sa: 'नक्षत्राणि कानि सन्ति?', ta: 'நட்சத்திரங்கள் என்றால் என்ன?', te: 'నక్షత్రాలు అంటే ఏమిటి?', bn: 'নক্ষত্র কী?', kn: 'ನಕ್ಷತ್ರಗಳು ಯಾವುವು?', gu: 'નક્ષત્ર શું છે?', mai: 'नक्षत्र की अछि?', mr: 'नक्षत्रे काय आहेत?' }, locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <div className="text-text-secondary space-y-4">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? 'The word "Nakshatra" derives from Sanskrit — "naksha" (map) + "tra" (guard), literally meaning "guardians of the sky map." They are 27 divisions of the ecliptic, each spanning 13°20\' of celestial longitude, identified by prominent stars or star groups near the Moon\'s path.'
                : isDevanagari
                ? '"नक्षत्र" शब्द संस्कृत से आता है — "नक्ष" (मानचित्र) + "त्र" (रक्षक), अर्थात् "आकाश मानचित्र के संरक्षक।" ये क्रान्तिवृत्त के 27 विभाग हैं, प्रत्येक 13°20\' खगोलीय देशांतर का, जो चन्द्र पथ के निकट प्रमुख तारों या तारासमूहों द्वारा पहचाने जाते हैं।'
                : '"नक्षत्र" इति शब्दः संस्कृतात् आगच्छति — "नक्ष" (चित्रम्) + "त्र" (रक्षकः), यथार्थतः "आकाशचित्रस्य रक्षकाः" इति। एतानि क्रान्तिवृत्तस्य सप्तविंशतिविभागाः सन्ति।'}
            </p>
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? 'This system predates the 12-sign zodiac and represents one of humanity\'s oldest star catalogues. The Rigveda (c. 1500 BCE) references many Nakshatras, and the Vedanga Jyotisha (c. 1200 BCE) provides a systematic framework. Each Nakshatra is associated with a presiding deity, a ruling planet (Graha), a symbol representing its energy, and specific qualities that influence human activities.'
                : tl({ en: 'एषा प्रणाली द्वादशराशिचक्रात् पूर्वतनी अस्ति मानवतायाः प्राचीनतमतारासूचीषु एका च। ऋग्वेदे (प्रा. 1500 ई.पू.) बहूनां नक्षत्राणाम् उल्लेखः अस्ति।', hi: 'यह प्रणाली 12 राशियों की राशि से पहले की है और मानवता के सबसे पुराने तारा-सूचियों में से एक है। ऋग्वेद (लगभग 1500 ई.पू.) में अनेक नक्षत्रों का उल्लेख है, और वेदांग ज्योतिष (लगभग 1200 ई.पू.) एक व्यवस्थित ढांचा प्रदान करता है।', sa: 'एषा प्रणाली द्वादशराशिचक्रात् पूर्वतनी अस्ति मानवतायाः प्राचीनतमतारासूचीषु एका च। ऋग्वेदे (प्रा. 1500 ई.पू.) बहूनां नक्षत्राणाम् उल्लेखः अस्ति।', ta: 'இந்த முறைமை பன்னிரண்டு ராசி மண்டலத்தைவிட பழமையானது மற்றும் மனிதகுலத்தின் மிகப் பழமையான நட்சத்திர பட்டியல்களில் ஒன்றாகும். ரிக்வேதத்தில் (சுமார் கி.மு. 1500) பல நட்சத்திரங்களின் குறிப்பு உள்ளது.', te: 'ఈ వ్యవస్థ పన్నెండు రాశి చక్రం కంటే పురాతనమైనది మరియు మానవజాతి యొక్క పురాతన నక్షత్ర జాబితాలలో ఒకటి. ఋగ్వేదంలో (సుమారు క్రీ.పూ. 1500) అనేక నక్షత్రాల ప్రస్తావన ఉంది.', bn: 'এই পদ্ধতি বারোটি রাশিচক্রের চেয়েও প্রাচীন এবং মানবজাতির প্রাচীনতম তারা-তালিকাগুলির মধ্যে একটি। ঋগ্বেদে (প্রায় খ্রিস্টপূর্ব ১৫০০) বহু নক্ষত্রের উল্লেখ রয়েছে।', kn: 'ಈ ಪದ್ಧತಿ ಹನ್ನೆರಡು ರಾಶಿಚಕ್ರಕ್ಕಿಂತ ಪ್ರಾಚೀನವಾಗಿದ್ದು ಮಾನವಜಾತಿಯ ಅತ್ಯಂತ ಹಳೆಯ ತಾರಾ-ಪಟ್ಟಿಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ. ಋಗ್ವೇದದಲ್ಲಿ (ಸು. ಕ್ರಿ.ಪೂ. 1500) ಅನೇಕ ನಕ್ಷತ್ರಗಳ ಉಲ್ಲೇಖ ಇದೆ.', gu: 'આ પ્રણાલી બારા રાશિ ચક્ર કરતાં પ્રાચીન છે અને માનવજાતની સૌથી જૂની તારા-સૂચિઓ પૈકી એક છે. ઋગ્વેદ (આ. ઈ.પૂ. 1500) માં અનેક નક્ષત્રોનો ઉલ્લેખ છે.', mai: 'ई प्रणाली बारह राशि चक्रसँ पुरान अछि आ मानवताक प्राचीनतम तारा-सूचीमेसँ एक अछि। ऋग्वेद (लगभग 1500 ई.पू.) मे बहुत नक्षत्रक उल्लेख अछि।', mr: 'ही प्रणाली बारा राशींपेक्षा जुनी आहे आणि मानवजातीच्या सर्वात प्राचीन तारा-सूचींपैकी एक आहे. ऋग्वेदात (सु. 1500 ई.पू.) अनेक नक्षत्रांचा उल्लेख आहे.' }, locale)}
            </p>
          </div>
        </div>
      </section>

      {/* How Names Arise */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl({ en: 'How Nakshatras Get Their Names', hi: 'नक्षत्रों के नाम कैसे पड़े', sa: 'नक्षत्राणि स्वनामानि कथं लभन्ते', ta: 'நட்சத்திரங்களுக்கு எப்படி பெயர் கிடைத்தது', te: 'నక్షత్రాలకు పేర్లు ఎలా వచ్చాయి', bn: 'নক্ষত্রের নাম কীভাবে এল', kn: 'ನಕ್ಷತ್ರಗಳಿಗೆ ಹೆಸರು ಹೇಗೆ ಬಂತು', gu: 'નક્ષત્રોને તેમના નામ કેવી રીતે મળ્યા', mai: 'नक्षत्रकेँ अपन नाम कोना भेटैत अछि', mr: 'नक्षत्रांना त्यांची नावे कशी मिळाली' }, locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <div className="text-text-secondary space-y-4">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? 'Nakshatra names derive from multiple sources: the shape of their star patterns (Mrigashira — "deer\'s head"), their presiding deities (Brahma for Rohini), the qualities they embody (Pushya — "nourisher"), or mythological narratives (Ashwini — named after the divine twin horsemen, the Ashwini Kumaras, physicians of the gods).'
                : tl({ en: 'नक्षत्रनामानि बहुविधस्रोतेभ्यः आगच्छन्ति — तारारूपाणाम् आकारात् (मृगशिरा — "मृगस्य शिरः"), अधिष्ठातृदेवताभ्यः (रोहिण्याः ब्रह्मा), गुणेभ्यः (पुष्यः — "पोषकः")।', hi: 'नक्षत्रों के नाम विभिन्न स्रोतों से आते हैं: उनके तारा-प्रतिरूपों का आकार (मृगशिरा — "हिरण का सिर"), उनके अधिष्ठाता देवता (रोहिणी के लिए ब्रह्मा), उनके गुण (पुष्य — "पोषक"), या पौराणिक कथाएं (अश्विनी — देव जुड़वां अश्वारोहियों, अश्विनी कुमारों के नाम पर)।', sa: 'नक्षत्रनामानि बहुविधस्रोतेभ्यः आगच्छन्ति — तारारूपाणाम् आकारात् (मृगशिरा — "मृगस्य शिरः"), अधिष्ठातृदेवताभ्यः (रोहिण्याः ब्रह्मा), गुणेभ्यः (पुष्यः — "पोषकः")।', ta: 'நட்சத்திரங்களின் பெயர்கள் பல்வேறு மூலங்களிலிருந்து வருகின்றன — நட்சத்திர கூட்டங்களின் வடிவத்திலிருந்து (மிருகசீரிஷம் — "மான் தலை"), அதிஷ்டான தெய்வங்களிலிருந்து (ரோஹிணிக்கு பிரம்மா), குணங்களிலிருந்து (புஷ்யம் — "போஷிப்பவன்").', te: 'నక్షత్రాల పేర్లు వివిధ మూలాల నుండి వస్తాయి — తారా సమూహాల ఆకారం నుండి (మృగశిర — "జింక తల"), అధిష్ఠాన దేవతల నుండి (రోహిణికి బ్రహ్మ), గుణాల నుండి (పుష్యమి — "పోషించేది").', bn: 'নক্ষত্রের নাম বিভিন্ন উৎস থেকে আসে — তারামণ্ডলের আকৃতি (মৃগশিরা — "হরিণের মাথা"), অধিষ্ঠাতা দেবতা (রোহিণীর জন্য ব্রহ্মা), গুণ (পুষ্য — "পোষণকারী") থেকে।', kn: 'ನಕ್ಷತ್ರಗಳ ಹೆಸರುಗಳು ಹಲವು ಮೂಲಗಳಿಂದ ಬರುತ್ತವೆ — ತಾರಾಮಂಡಲದ ಆಕಾರ (ಮೃಗಶಿರ — "ಜಿಂಕೆಯ ತಲೆ"), ಅಧಿಷ್ಠಾನ ದೇವತೆ (ರೋಹಿಣಿಗೆ ಬ್ರಹ್ಮ), ಗುಣ (ಪುಷ್ಯ — "ಪೋಷಿಸುವವನು") ಮೂಲಗಳಿಂದ.', gu: 'નક્ષત્રોના નામ ઘણા સ્ત્રોતો પરથી આવ્યા છે — તારા-ઝૂંડના આકારો (મૃગશિરા — "હરણનું માથું"), અધિષ્ઠાન દેવ (રોહિણી માટે બ્રહ્મા), ગુણો (પુષ્ય — "પોષક").', mai: 'नक्षत्रक नाम विभिन्न स्रोतसँ आबैत अछि — तारासमूहक आकारसँ (मृगशिरा — "हिरणक सिर"), अधिष्ठाता देवतासँ (रोहिणीक ब्रह्मा), गुणसँ (पुष्य — "पोषक")।', mr: 'नक्षत्रांची नावे अनेक स्रोतांतून येतात — तारासमूहांच्या आकारावरून (मृगशिरा — "हरणाचे डोके"), अधिष्ठाता देवतांवरून (रोहिणीसाठी ब्रह्मा), गुणांवरून (पुष्य — "पोषक").' }, locale)}
            </p>
          </div>
        </div>
      </section>

      {/* Scientific Basis */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('scientificBasis')}</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? `The 27 Nakshatras divide the 360° ecliptic into equal segments of 13°20' (13.333°) each. They are defined by prominent stars (Yogatara) near the ecliptic plane. As the Moon completes one sidereal orbit in approximately 27.3 days, it spends roughly one day in each Nakshatra. The Nakshatra is determined by the Moon's sidereal longitude: Nakshatra number = floor(Moon_sidereal_longitude / 13.333) + 1. Each Nakshatra is further divided into 4 Padas (quarters) of 3°20' each, linking them to the Navamsha chart in Jyotish.`
                : tl({ en: `सप्तविंशतिः नक्षत्राणि 360° क्रान्तिवृत्तं 13°20' (13.333°) समखण्डेषु विभजन्ति। एतानि क्रान्तिवृत्तसमीपस्थप्रमुखताराभिः (योगताराभिः) परिभाष्यन्ते।`, hi: `27 नक्षत्र 360° क्रान्तिवृत्त को 13°20' (13.333°) के बराबर खण्डों में विभाजित करते हैं। ये क्रान्तिवृत्त के निकट प्रमुख तारों (योगतारा) द्वारा परिभाषित हैं। चन्द्रमा लगभग 27.3 दिनों में एक नाक्षत्रिक परिक्रमा पूर्ण करता है, अतः प्रत्येक नक्षत्र में लगभग एक दिन व्यतीत करता है।`, sa: `27 नक्षत्र 360° क्रान्तिवृत्त को 13°20' (13.333°) के बराबर खण्डों में विभाजित करते हैं। ये क्रान्तिवृत्त के निकट प्रमुख तारों (योगतारा) द्वारा परिभाषित हैं। चन्द्रमा लगभग 27.3 दिनों में एक नाक्षत्रिक परिक्रमा पूर्ण करता है, अतः प्रत्येक नक्षत्र में लगभग एक दिन व्यतीत करता है।`, ta: `सप्तविंशतिः नक्षत्राणि 360° क्रान्तिवृत्तं 13°20' (13.333°) समखण्डेषु विभजन्ति। एतानि क्रान्तिवृत्तसमीपस्थप्रमुखताराभिः (योगताराभिः) परिभाष्यन्ते।`, te: `सप्तविंशतिः नक्षत्राणि 360° क्रान्तिवृत्तं 13°20' (13.333°) समखण्डेषु विभजन्ति। एतानि क्रान्तिवृत्तसमीपस्थप्रमुखताराभिः (योगताराभिः) परिभाष्यन्ते।`, bn: `सप्तविंशतिः नक्षत्राणि 360° क्रान्तिवृत्तं 13°20' (13.333°) समखण्डेषु विभजन्ति। एतानि क्रान्तिवृत्तसमीपस्थप्रमुखताराभिः (योगताराभिः) परिभाष्यन्ते।`, kn: `सप्तविंशतिः नक्षत्राणि 360° क्रान्तिवृत्तं 13°20' (13.333°) समखण्डेषु विभजन्ति। एतानि क्रान्तिवृत्तसमीपस्थप्रमुखताराभिः (योगताराभिः) परिभाष्यन्ते।`, gu: `सप्तविंशतिः नक्षत्राणि 360° क्रान्तिवृत्तं 13°20' (13.333°) समखण्डेषु विभजन्ति। एतानि क्रान्तिवृत्तसमीपस्थप्रमुखताराभिः (योगताराभिः) परिभाष्यन्ते।`, mai: `27 नक्षत्र 360° क्रान्तिवृत्त को 13°20' (13.333°) के बराबर खण्डों में विभाजित करते हैं। ये क्रान्तिवृत्त के निकट प्रमुख तारों (योगतारा) द्वारा परिभाषित हैं। चन्द्रमा लगभग 27.3 दिनों में एक नाक्षत्रिक परिक्रमा पूर्ण करता है, अतः प्रत्येक नक्षत्र में लगभग एक दिन व्यतीत करता है।`, mr: `27 नक्षत्र 360° क्रान्तिवृत्त को 13°20' (13.333°) के बराबर खण्डों में विभाजित करते हैं। ये क्रान्तिवृत्त के निकट प्रमुख तारों (योगतारा) द्वारा परिभाषित हैं। चन्द्रमा लगभग 27.3 दिनों में एक नाक्षत्रिक परिक्रमा पूर्ण करता है, अतः प्रत्येक नक्षत्र में लगभग एक दिन व्यतीत करता है।` }, locale)}
            </p>
            <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <p className="text-gold-light font-mono text-sm">
                {tl({ en: 'Formula:', hi: 'सूत्र:', sa: 'सूत्रम्:', ta: 'சூத்திரம்:', te: 'సూత్రము:', bn: 'সূত্র:', kn: 'ಸೂತ್ರ:', gu: 'સૂત્ર:', mai: 'सूत्र:', mr: 'सूत्र:' }, locale)} Nakshatra = floor(Moon_sidereal_longitude / 13.333) + 1
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecliptic Belt Visualization */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl({ en: 'Ecliptic Belt — 27 Nakshatras', hi: 'क्रान्तिवृत्त — 27 नक्षत्र', sa: 'क्रान्तिवृत्तमेखला — सप्तविंशतिनक्षत्राणि', ta: 'கிரகண வளையம் — 27 நட்சத்திரங்கள்', te: 'క్రాంతివృత్త మేఖల — 27 నక్షత్రాలు', bn: 'ক্রান্তিবৃত্ত বেল্ট — 27 নক্ষত্র', kn: 'ಕ್ರಾಂತಿವೃತ್ತ ಪಟ್ಟಿ — 27 ನಕ್ಷತ್ರಗಳು', gu: 'ક્રાંતિવૃત્ત પટ્ટો — 27 નક્ષત્ર', mai: 'क्रान्तिवृत्त पट्टी — 27 नक्षत्र', mr: 'क्रांतिवृत्त पट्टा — 27 नक्षत्रे' }, locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 flex justify-center">
          <EclipticBelt locale={locale} isDevanagari={isDevanagari} />
        </div>
      </section>

      <GoldDivider />

      {/* Complete Listing with SVG Icons and Links */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-3" style={headingFont}>{t('completeListing')}</h2>
        <p className="text-text-secondary mb-8">
          {tl({ en: 'Click any Nakshatra to explore its mythology, significance, and detailed characteristics.', hi: 'किसी भी नक्षत्र पर क्लिक करें उसकी पौराणिक कथा, महत्व और विस्तृत विशेषताओं का अन्वेषण करने के लिए।', sa: 'कस्यापि नक्षत्रस्य पुराणकथां महत्त्वं विस्तृतविशेषताश्च ज्ञातुं तदुपरि क्लिक्यतु।', ta: 'எந்த நட்சத்திரத்தையும் கிளிக் செய்து அதன் தொன்மம், முக்கியத்துவம் மற்றும் விரிவான பண்புகளை அறியுங்கள்.', te: 'ఏదైనా నక్షత్రంపై క్లిక్ చేసి దాని పురాణగాథ, ప్రాముఖ్యత మరియు వివరణాత్మక లక్షణాలను తెలుసుకోండి.', bn: 'যেকোনো নক্ষত্রে ক্লিক করুন তার পৌরাণিক কাহিনি, গুরুত্ব ও বিস্তারিত বৈশিষ্ট্য জানতে।', kn: 'ಯಾವುದೇ ನಕ್ಷತ್ರದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಅದರ ಪುರಾಣ, ಮಹತ್ವ ಮತ್ತು ವಿಸ್ತೃತ ಗುಣಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಯಿರಿ.', gu: 'કોઈ પણ નક્ષત્ર પર ક્લિક કરો અને તેની પૌરાણિક કથા, મહત્ત્વ અને વિગતવાર વૈશિષ્ટ્યો જાણો.', mai: 'कोनो नक्षत्रपर क्लिक करू तकर पौराणिक कथा, महत्व आ विस्तृत विशेषता जानबाक लेल।', mr: 'कोणत्याही नक्षत्रावर क्लिक करा त्याची पौराणिक कथा, महत्त्व व तपशीलवार वैशिष्ट्ये जाणून घेण्यासाठी.' }, locale)}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {NAKSHATRAS.map((nak, i) => (
            <motion.div
              key={nak.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ scale: 1.04, y: -4 }}
            >
              <Link
                href={`/panchang/nakshatra/${nak.id}`}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 flex items-center gap-5 hover:border-gold-primary/40 transition-all group block"
              >
                <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                  <NakshatraIconById id={nak.id} size={64} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold-dark text-xs font-mono">#{nak.id}</span>
                    <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {nak.name[locale]}
                    </span>
                  </div>
                  <div className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {nak.deity[locale]} · {nak.rulerName[locale]}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-gold-dark/60 text-xs font-mono">{nak.startDeg.toFixed(1)}° — {nak.endDeg.toFixed(1)}°</span>
                    <span className="text-xs text-text-secondary/75" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{nak.nature[locale]}</span>
                  </div>
                </div>
                <div className="text-gold-primary/40 group-hover:text-gold-light transition-colors text-lg">→</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Ecliptic Belt — extracted to avoid hydration mismatch with SVG floats
function EclipticBelt({ locale, isDevanagari }: { locale: Locale; isDevanagari: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-full max-w-lg aspect-square" />;

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="w-full max-w-lg"
      initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="nakBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1f4e" />
          <stop offset="100%" stopColor="#0a0e27" />
        </radialGradient>
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx="250" cy="250" r="245" fill="url(#nakBg)" />

      {[230, 180, 130].map((r, i) => (
        <motion.circle
          key={r} cx="250" cy="250" r={r} fill="none"
          stroke="rgba(212,168,83,0.15)" strokeWidth={i === 0 ? '1' : '0.5'}
          initial={{ r: 0, opacity: 0 }}
          animate={{ r, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
        />
      ))}

      <motion.g animate={{ rotate: 360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '250px 250px' }}>
        <circle cx="250" cy="68" r="4" fill="#f0d48a" opacity="0.7" filter="url(#starGlow)" />
        <circle cx="250" cy="68" r="6" fill="none" stroke="#f0d48a" strokeWidth="0.5" opacity="0.3" />
      </motion.g>

      {NAKSHATRAS.map((nak, i) => {
        const sectorAngle = 360 / 27;
        const angle = (i * sectorAngle - 90) * Math.PI / 180;
        const midAngle = ((i * sectorAngle + sectorAngle / 2) - 90) * Math.PI / 180;
        const x1 = 250 + 180 * Math.cos(angle);
        const y1 = 250 + 180 * Math.sin(angle);
        const x2 = 250 + 230 * Math.cos(angle);
        const y2 = 250 + 230 * Math.sin(angle);
        const textX = 250 + 205 * Math.cos(midAngle);
        const textY = 250 + 205 * Math.sin(midAngle);
        const dotX = 250 + 155 * Math.cos(midAngle);
        const dotY = 250 + 155 * Math.sin(midAngle);
        const rotationDeg = i * sectorAngle;

        return (
          <motion.g key={nak.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.03 }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
            <text x={textX} y={textY} fill="#f0d48a" fontSize="5.5" textAnchor="middle" dominantBaseline="middle"
              transform={`rotate(${rotationDeg}, ${textX}, ${textY})`}
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {nak.name[locale]}
            </text>
            <circle cx={dotX} cy={dotY} r="3" fill="#d4a853" opacity="0.5" />
          </motion.g>
        );
      })}

      <circle cx="250" cy="250" r="70" fill="#0a0e27" stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
      <text x="250" y="240" fill="#f0d48a" fontSize="14" textAnchor="middle" fontFamily="var(--font-heading)">
        {tl({ en: 'ECLIPTIC', hi: 'क्रान्तिवृत्त', sa: 'क्रान्तिवृत्तम्', ta: 'கிரகண வட்டம்', te: 'క్రాంతివృత్తం', bn: 'ক্রান্তিবৃত্ত', kn: 'ಕ್ರಾಂತಿವೃತ್ತ', gu: 'ક્રાંતિવૃત્ત', mai: 'क्रान्तिवृत्त', mr: 'क्रांतिवृत्त' }, locale)}
      </text>
      <text x="250" y="260" fill="rgba(212,168,83,0.5)" fontSize="9" textAnchor="middle">
        360° / 27 = 13°20&apos;
      </text>
    </motion.svg>
  );
}

