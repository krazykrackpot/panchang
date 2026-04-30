'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Moon, Eye, Telescope, BookOpen, ArrowLeft, Calendar, Globe, Sparkles } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ── Labels ────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Learn',
    title: 'Chandra Darshan',
    subtitle: 'The Art & Science of New Moon Sighting',
    intro: 'Introduction',
    introText: 'Chandra Darshan (Sanskrit: चन्द्र दर्शन, "Moon sighting") refers to the first observation of the thin crescent Moon after Amavasya (new Moon). This moment has profound significance across multiple cultures — it marks the beginning of lunar months, determines religious observances, and connects us to humanity\'s oldest astronomical tradition: watching the sky with the naked eye.',
    whatIs: 'What is Chandra Darshan?',
    whatIsText: 'After each Amavasya (new Moon / conjunction), the Moon begins to move away from the Sun. For the first 12-20 hours, it remains invisible — too close to the Sun\'s glare. As hours pass, the Moon\'s elongation (angular distance from the Sun) increases, and a paper-thin crescent appears on the western horizon just after sunset. This first sighting is Chandra Darshan. The crescent is always in the west because the young Moon is never far from the Sun, and both set in the west shortly after sunset.',
    science: 'The Science Behind Visibility',
    scienceText: 'Whether you can see the new crescent depends on three measurable factors:',
    scienceMoonAge: 'Moon Age — The number of hours since the exact moment of conjunction (Sun and Moon at the same ecliptic longitude). Below ~15 hours, the crescent is essentially impossible to see with the naked eye. The record naked-eye sighting is about 15.5 hours.',
    scienceElongation: 'Elongation — The angular separation between Moon and Sun, measured in degrees. Below ~7 degrees, the Moon is lost in the Sun\'s glare. Above 10-12 degrees, naked-eye sighting becomes feasible under good conditions.',
    scienceAltitude: 'Moon Altitude at Sunset — How high above the western horizon the Moon sits when the Sun sets. If the Moon has already set before the Sun, no sighting is possible. An altitude of at least 5 degrees at sunset is generally needed.',
    scienceAtmosphere: 'Atmospheric conditions also play a crucial role. Dust, humidity, light pollution, and clouds near the horizon can prevent sighting even when the geometric conditions are favorable. High-altitude desert locations with clean western horizons are ideal.',
    models: 'Visibility Models',
    modelsText: 'Astronomers have developed mathematical models to predict crescent visibility. The most widely used are the Yallop criterion (1997) and the Odeh criterion (2004). Both use a combination of Moon age, elongation, arc-of-vision (Moon\'s altitude minus Sun\'s depression), and relative azimuth to produce a visibility score. Our calculator uses a simplified version of these models that captures the essential physics while remaining computationally fast.',
    religious: 'Religious Significance',
    hinduTitle: 'Hindu Tradition',
    hinduText: 'In Hindu tradition, Chandra Darshan on Shukla Dwitiya (the second lunar day of the bright fortnight) is considered highly auspicious. Devotees offer arghya (water offering) to the Moon and recite prayers. The sighting is associated with Soma (the Moon deity) and is believed to bring prosperity, mental peace, and removal of sins. On specific occasions like Karva Chauth, married women observe a day-long fast and break it only after sighting the Moon through a sieve (chhalni), offering water to the Moon as a prayer for their husband\'s longevity.',
    islamTitle: 'Islamic Tradition (Hilal)',
    islamText: 'The Islamic lunar calendar (Hijri) begins each month with the confirmed sighting of the Hilal (new crescent Moon). The start of Ramadan (the fasting month), Eid al-Fitr, and Eid al-Adha all depend on Moon sighting. Islamic jurisprudence has extensive rules about who constitutes a reliable witness, how many witnesses are needed, and what happens when weather prevents sighting. Some communities now supplement visual sighting with astronomical calculations, while others insist on naked-eye observation.',
    otherTitle: 'Other Traditions',
    otherText: 'The Jewish calendar also historically relied on Moon sighting to declare the new month (Rosh Chodesh), though it now uses a fixed mathematical calendar. Ancient Babylonians, Egyptians, and Chinese all tracked the lunar crescent. The universal human impulse to watch for the new Moon reflects its fundamental importance to agriculture, navigation, and timekeeping throughout history.',
    howToSpot: 'How to Spot the Crescent Moon',
    howToSpotText: 'Practical tips for your first Moon sighting:',
    tip1: 'Timing — Look 20-30 minutes after sunset. Earlier, and the sky is too bright. Later, and the thin crescent may have already set below the horizon.',
    tip2: 'Direction — Always face west, toward where the Sun set. The crescent will be slightly above and to the left (in the Northern Hemisphere) of the sunset point.',
    tip3: 'Horizon — Find a location with a clear, unobstructed western horizon. Hilltops, beaches, and open fields are ideal. Buildings and trees block the critical low-altitude zone.',
    tip4: 'Binoculars — A pair of 7x50 or 10x50 binoculars dramatically improves your chances. They can reveal a crescent invisible to the naked eye. Never use binoculars before the Sun has fully set.',
    tip5: 'Patience — Scan the western sky slowly. The crescent is extremely thin and can easily blend with clouds or haze. Your eyes need 5-10 minutes to adapt.',
    tithiConnection: 'Connection to the Tithi System',
    tithiConnectionText: 'The Hindu Panchang divides each lunar month into 30 tithis (lunar days), 15 in the bright half (Shukla Paksha) and 15 in the dark half (Krishna Paksha). Amavasya is the 30th tithi — the darkest night. Shukla Pratipada (1st tithi of the bright half) begins immediately after the Sun-Moon conjunction. However, the Moon is usually not visible on Pratipada because it is still too young and too close to the Sun. Chandra Darshan typically occurs on Shukla Dwitiya (2nd tithi) or occasionally on Tritiya (3rd tithi) for locations where conditions are unfavorable.',
    tithiAmantText: 'In the Amant (Amanta) calendar system used in South and West India, the month begins after Amavasya — so Chandra Darshan effectively marks the visible start of a new month. In the Purnimant system used in North India, the month begins after Purnima (full Moon), so Chandra Darshan falls in the middle of the month, marking the transition from Krishna Paksha to Shukla Paksha.',
    historical: 'Historical Importance',
    historicalText: 'Before telescopes and precise astronomical tables, the visual sighting of the Moon crescent was the only way to determine when a new lunar month had begun. This made Moon-watchers essential figures in ancient societies. Priests, astronomers, and designated observers would gather on hilltops to watch the western horizon after each Amavasya. Their announcement would trigger calendar changes, festival preparations, and agricultural schedules. The Surya Siddhanta and other Indian astronomical texts contain detailed rules for predicting when the Moon would first become visible — an early form of the visibility models astronomers use today.',
    misconceptions: 'Common Misconceptions',
    misconception1: '"The new Moon is visible on Amavasya night" — This is incorrect. Amavasya is precisely when the Moon is NOT visible because it is conjunct with (next to) the Sun. The first crescent appears 1-2 days after Amavasya.',
    misconception2: '"If I can\'t see the Moon, it hasn\'t risen" — The Moon may be above the horizon but invisible due to glare, atmospheric conditions, or being too thin. Absence of sighting does not mean absence of the Moon.',
    misconception3: '"Chandra Darshan always happens on the same tithi" — The tithi at the time of first visibility varies by location. Western locations see the crescent earlier (same evening) than eastern locations at the same latitude.',
    misconception4: '"Telescopic sighting counts the same as naked-eye" — Traditions that rely on Moon sighting (Hindu, Islamic) generally require naked-eye visibility for religious purposes, though practices vary by community.',
    seeAlso: 'Related Topics',
    tryTool: 'Try the Moon Sighting Calculator',
  },
  hi: {
    back: 'सीखें',
    title: 'चन्द्र दर्शन',
    subtitle: 'नव चन्द्र दर्शन की कला एवं विज्ञान',
    intro: 'परिचय',
    introText: 'चन्द्र दर्शन (संस्कृत: चन्द्र दर्शन, "चन्द्रमा को देखना") अमावस्या के पश्चात् पतले चन्द्रमा के प्रथम अवलोकन को कहते हैं। यह क्षण अनेक संस्कृतियों में गहन महत्त्व रखता है — यह चन्द्र मासों की शुरुआत, धार्मिक अनुष्ठान और मानवता की प्राचीनतम खगोलीय परम्परा से जोड़ता है।',
    whatIs: 'चन्द्र दर्शन क्या है?',
    whatIsText: 'प्रत्येक अमावस्या के पश्चात् चन्द्रमा सूर्य से दूर जाने लगता है। प्रथम 12-20 घण्टों तक वह अदृश्य रहता है — सूर्य की चमक के बहुत निकट। जैसे-जैसे घण्टे बीतते हैं, सूर्यास्त के तुरन्त बाद पश्चिमी क्षितिज पर एक अत्यन्त पतला चन्द्रमा दिखाई देता है। यही प्रथम दर्शन चन्द्र दर्शन है।',
    science: 'दृश्यता का विज्ञान',
    scienceText: 'नव चन्द्रमा दिखेगा या नहीं, यह तीन मापने योग्य कारकों पर निर्भर करता है:',
    scienceMoonAge: 'चन्द्र आयु — युति के सटीक क्षण से बीते घण्टों की संख्या। ~15 घण्टे से कम में नग्न नेत्रों से देखना लगभग असम्भव है।',
    scienceElongation: 'दूरी (कोण) — चन्द्रमा और सूर्य के बीच कोणीय दूरी। ~7 अंश से कम में चन्द्रमा सूर्य की चमक में खो जाता है।',
    scienceAltitude: 'सूर्यास्त पर चन्द्र ऊँचाई — सूर्यास्त के समय चन्द्रमा क्षितिज से कितना ऊपर है। कम से कम 5 अंश ऊँचाई आवश्यक है।',
    scienceAtmosphere: 'वायुमण्डलीय स्थितियाँ भी महत्त्वपूर्ण भूमिका निभाती हैं। धूल, आर्द्रता, प्रकाश प्रदूषण और बादल दर्शन को रोक सकते हैं।',
    models: 'दृश्यता मॉडल',
    modelsText: 'खगोलविदों ने चन्द्र दृश्यता की भविष्यवाणी के लिए गणितीय मॉडल विकसित किए हैं। सबसे अधिक प्रयुक्त यल्लोप मापदण्ड (1997) और ओदेह मापदण्ड (2004) हैं।',
    religious: 'धार्मिक महत्त्व',
    hinduTitle: 'हिन्दू परम्परा',
    hinduText: 'हिन्दू परम्परा में शुक्ल द्वितीया पर चन्द्र दर्शन अत्यन्त शुभ माना जाता है। भक्त चन्द्रमा को अर्घ्य देते हैं और प्रार्थना करते हैं। करवा चौथ पर विवाहित स्त्रियाँ दिन भर का व्रत रखती हैं और छलनी से चन्द्रमा देखकर ही व्रत तोड़ती हैं।',
    islamTitle: 'इस्लामी परम्परा (हिलाल)',
    islamText: 'इस्लामी चन्द्र कैलेंडर (हिजरी) प्रत्येक मास की शुरुआत हिलाल (नव चन्द्र) के पुष्ट दर्शन से करता है। रमज़ान, ईद-उल-फ़ित्र और ईद-उल-अज़्हा सभी चन्द्र दर्शन पर निर्भर करते हैं।',
    otherTitle: 'अन्य परम्पराएँ',
    otherText: 'यहूदी कैलेंडर भी ऐतिहासिक रूप से नवीन मास घोषित करने के लिए चन्द्र दर्शन पर निर्भर था। प्राचीन बेबीलोनियन, मिस्री और चीनी सभी ने चन्द्र दर्शन का अनुसरण किया।',
    howToSpot: 'चन्द्र दर्शन कैसे करें',
    howToSpotText: 'प्रथम चन्द्र दर्शन के लिए व्यावहारिक सुझाव:',
    tip1: 'समय — सूर्यास्त के 20-30 मिनट बाद देखें।',
    tip2: 'दिशा — हमेशा पश्चिम की ओर मुँह करें, जहाँ सूर्य अस्त हुआ।',
    tip3: 'क्षितिज — स्वच्छ, बाधारहित पश्चिमी क्षितिज वाला स्थान चुनें।',
    tip4: 'दूरबीन — 7x50 या 10x50 दूरबीन दर्शन की सम्भावना बढ़ाती है। सूर्य पूर्णतः अस्त होने से पहले दूरबीन का प्रयोग कदापि न करें।',
    tip5: 'धैर्य — पश्चिमी आकाश को धीरे-धीरे स्कैन करें। चन्द्रमा अत्यन्त पतला होता है।',
    tithiConnection: 'तिथि प्रणाली से सम्बन्ध',
    tithiConnectionText: 'हिन्दू पंचांग प्रत्येक चन्द्र मास को 30 तिथियों में विभाजित करता है। अमावस्या 30वीं तिथि है। शुक्ल प्रतिपदा (प्रथम तिथि) सूर्य-चन्द्र युति के तुरन्त बाद आरम्भ होती है। परन्तु प्रतिपदा पर सामान्यतः चन्द्रमा दृश्य नहीं होता। चन्द्र दर्शन प्रायः शुक्ल द्वितीया पर होता है।',
    tithiAmantText: 'अमान्त पद्धति में मास अमावस्या के बाद आरम्भ होता है — अतः चन्द्र दर्शन नवीन मास का दृश्य आरम्भ चिह्नित करता है।',
    historical: 'ऐतिहासिक महत्त्व',
    historicalText: 'दूरबीनों और सटीक खगोलीय तालिकाओं से पहले, चन्द्र दर्शन ही नवीन चन्द्र मास निर्धारित करने का एकमात्र साधन था। पुजारी और खगोलविद् प्रत्येक अमावस्या के बाद पहाड़ियों पर एकत्र होकर पश्चिमी क्षितिज का अवलोकन करते थे।',
    misconceptions: 'आम भ्रांतियाँ',
    misconception1: '"अमावस्या की रात नया चन्द्रमा दिखता है" — यह गलत है। अमावस्या पर चन्द्रमा सूर्य के निकट होने के कारण अदृश्य रहता है। प्रथम दर्शन अमावस्या के 1-2 दिन बाद होता है।',
    misconception2: '"यदि चन्द्रमा नहीं दिखा, तो उदय नहीं हुआ" — चन्द्रमा क्षितिज से ऊपर होकर भी अदृश्य हो सकता है।',
    misconception3: '"चन्द्र दर्शन सदैव एक ही तिथि पर होता है" — प्रथम दृश्यता की तिथि स्थान के अनुसार भिन्न होती है।',
    misconception4: '"दूरबीन से दर्शन भी नग्न नेत्र जैसा है" — धार्मिक परम्पराएँ सामान्यतः नग्न नेत्रों से दर्शन की अपेक्षा करती हैं।',
    seeAlso: 'सम्बन्धित विषय',
    tryTool: 'चन्द्र दर्शन गणक आज़माएँ',
  },
};

const l = (key: string, locale: string) => LABELS[locale]?.[key] ?? LABELS.en[key] ?? key;

export default function LearnChandraDarshanPage() {
  const locale = useLocale();
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-gold-light transition-colors mb-4">
          <ArrowLeft size={14} /> {l('back', locale)}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] border border-gold-primary/20 flex items-center justify-center">
              <Moon size={24} className="text-gold-light" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient" style={hf}>{l('title', locale)}</h1>
              <p className="text-text-secondary text-sm" style={bf}>{l('subtitle', locale)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <GoldDivider className="my-4" />

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-2">
        {/* 1. Introduction */}
        <LessonSection number={1} title={l('intro', locale)}>
          <p style={bf}>{l('introText', locale)}</p>
        </LessonSection>

        {/* 2. What is Chandra Darshan */}
        <LessonSection number={2} title={l('whatIs', locale)}>
          <p style={bf}>{l('whatIsText', locale)}</p>
        </LessonSection>

        {/* 3. The Science */}
        <LessonSection number={3} title={l('science', locale)} variant="highlight">
          <p style={bf}>{l('scienceText', locale)}</p>
          <ul className="list-disc list-inside space-y-3 mt-3">
            <li style={bf}><strong className="text-gold-light">{locale === 'hi' ? 'चन्द्र आयु' : 'Moon Age'}</strong> — {l('scienceMoonAge', locale)}</li>
            <li style={bf}><strong className="text-gold-light">{locale === 'hi' ? 'दूरी' : 'Elongation'}</strong> — {l('scienceElongation', locale)}</li>
            <li style={bf}><strong className="text-gold-light">{locale === 'hi' ? 'ऊँचाई' : 'Altitude'}</strong> — {l('scienceAltitude', locale)}</li>
          </ul>
          <p className="mt-3" style={bf}>{l('scienceAtmosphere', locale)}</p>
        </LessonSection>

        {/* 4. Visibility Models */}
        <LessonSection number={4} title={l('models', locale)}>
          <p style={bf}>{l('modelsText', locale)}</p>
        </LessonSection>

        {/* 5. Religious Significance */}
        <LessonSection number={5} title={l('religious', locale)} variant="highlight">
          <h4 className="text-gold-light font-bold mb-2" style={hf}>{l('hinduTitle', locale)}</h4>
          <p style={bf}>{l('hinduText', locale)}</p>

          <h4 className="text-gold-light font-bold mb-2 mt-5" style={hf}>{l('islamTitle', locale)}</h4>
          <p style={bf}>{l('islamText', locale)}</p>

          <h4 className="text-gold-light font-bold mb-2 mt-5" style={hf}>{l('otherTitle', locale)}</h4>
          <p style={bf}>{l('otherText', locale)}</p>
        </LessonSection>

        {/* 6. How to Spot */}
        <LessonSection number={6} title={l('howToSpot', locale)}>
          <p style={bf}>{l('howToSpotText', locale)}</p>
          <ol className="list-decimal list-inside space-y-2 mt-3">
            <li style={bf}>{l('tip1', locale)}</li>
            <li style={bf}>{l('tip2', locale)}</li>
            <li style={bf}>{l('tip3', locale)}</li>
            <li style={bf}>{l('tip4', locale)}</li>
            <li style={bf}>{l('tip5', locale)}</li>
          </ol>
        </LessonSection>

        {/* 7. Connection to Tithi */}
        <LessonSection number={7} title={l('tithiConnection', locale)}>
          <p style={bf}>{l('tithiConnectionText', locale)}</p>
          <p className="mt-3" style={bf}>{l('tithiAmantText', locale)}</p>
        </LessonSection>

        {/* 8. Historical */}
        <LessonSection number={8} title={l('historical', locale)}>
          <p style={bf}>{l('historicalText', locale)}</p>
        </LessonSection>

        {/* 9. Misconceptions */}
        <LessonSection number={9} title={l('misconceptions', locale)} variant="highlight">
          <ul className="space-y-3">
            <li style={bf}><span className="text-red-400 font-medium">&times;</span> {l('misconception1', locale)}</li>
            <li style={bf}><span className="text-red-400 font-medium">&times;</span> {l('misconception2', locale)}</li>
            <li style={bf}><span className="text-red-400 font-medium">&times;</span> {l('misconception3', locale)}</li>
            <li style={bf}><span className="text-red-400 font-medium">&times;</span> {l('misconception4', locale)}</li>
          </ul>
        </LessonSection>

        {/* Cross-links */}
        <GoldDivider className="my-6" />

        <div className="space-y-4">
          <Link
            href="/chandra-darshan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light font-medium hover:bg-gold-primary/20 hover:border-gold-primary/40 transition-all text-sm"
          >
            <Eye size={16} /> {l('tryTool', locale)}
          </Link>

          <div>
            <h3 className="text-sm font-semibold text-gold-dark uppercase tracking-[2px] mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-gold-primary" /> {l('seeAlso', locale)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { href: '/learn/tithis', label: locale === 'hi' ? 'तिथियाँ' : 'Tithis' },
                { href: '/learn/masa', label: locale === 'hi' ? 'मास' : 'Masa (Months)' },
                { href: '/panchang', label: locale === 'hi' ? 'आज का पंचांग' : 'Today\'s Panchang' },
                { href: '/learn/eclipses', label: locale === 'hi' ? 'ग्रहण' : 'Eclipses' },
                { href: '/learn/nakshatras', label: locale === 'hi' ? 'नक्षत्र' : 'Nakshatras' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-white/8 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
