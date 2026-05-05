'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import ClassicalReference from '@/components/learn/ClassicalReference';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import { Link } from '@/lib/i18n/navigation';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import SectionNav from '@/components/learn/SectionNav';

// ─── Multilingual helper ───────────────────────────────────────────────
type ML = Record<string, string>;
function useML(locale: string) {
  return (obj: ML) => obj[locale] || obj.en || '';
}

// ─── Sanskrit Terms ────────────────────────────────────────────────────
const TERMS = [
  { devanagari: 'शुक्र', transliteration: 'Shukra', meaning: { en: 'The bright one — semen, purity, brilliance', hi: 'चमकीला — शुक्ल, शुद्धता, तेज' } },
  { devanagari: 'शुक्राचार्य', transliteration: 'Shukrāchārya', meaning: { en: 'Preceptor of the Asuras (demons)', hi: 'असुरों के गुरु — दैत्यगुरु' } },
  { devanagari: 'कलत्रकारक', transliteration: 'Kalatrakāraka', meaning: { en: 'Significator of marriage and spouse', hi: 'विवाह और जीवनसाथी का कारक' } },
  { devanagari: 'भृगु', transliteration: 'Bhrigu', meaning: { en: 'Son of Sage Bhrigu — the seer of desire', hi: 'ऋषि भृगु के पुत्र — काम के द्रष्टा' } },
  { devanagari: 'दैत्यगुरु', transliteration: 'Daityaguru', meaning: { en: 'Teacher of the titans — keeper of Sanjeevani', hi: 'दैत्यों के शिक्षक — संजीवनी के रक्षक' } },
  { devanagari: 'काव्य', transliteration: 'Kāvya', meaning: { en: 'Poetry, refined expression, aesthetic beauty', hi: 'काव्य, परिष्कृत अभिव्यक्ति, सौन्दर्य' } },
];

// ─── Dignities ─────────────────────────────────────────────────────────
const DIGNITIES = {
  exaltation: { en: 'Pisces (Meena) — deepest exaltation at 27°', hi: 'मीन — 27° पर परम उच्च' },
  debilitation: { en: 'Virgo (Kanya) — deepest debilitation at 27°', hi: 'कन्या — 27° पर परम नीच' },
  ownSign: { en: 'Taurus (Vrishabha) & Libra (Tula)', hi: 'वृषभ एवं तुला' },
  moolatrikona: { en: 'Libra 0°–5°', hi: 'तुला 0°–5°' },
  friends: { en: 'Mercury, Saturn', hi: 'बुध, शनि' },
  enemies: { en: 'Sun, Moon', hi: 'सूर्य, चन्द्र' },
  neutral: { en: 'Mars, Jupiter', hi: 'मंगल, गुरु' },
};

// ─── Significations ────────────────────────────────────────────────────
const SIGNIFICATIONS = {
  people: { en: 'Wife/spouse, lover, artist, musician, fashion designer, courtesan, diplomat', hi: 'पत्नी/जीवनसाथी, प्रेमी, कलाकार, संगीतकार, फैशन डिज़ाइनर, राजनयिक' },
  bodyParts: { en: 'Reproductive system, kidneys, face, skin, throat, semen, ovaries, urinary tract', hi: 'प्रजनन तन्त्र, वृक्क, मुख, त्वचा, कण्ठ, शुक्राणु, अण्डाशय, मूत्र मार्ग' },
  professions: { en: 'Fashion, entertainment, film, music, perfumery, jewelry, hospitality, interior design, diplomacy', hi: 'फैशन, मनोरंजन, फिल्म, संगीत, इत्र, आभूषण, आतिथ्य, गृह सज्जा, कूटनीति' },
  materials: { en: 'Diamond (Heera), silver, silk, perfume, sugar, camphor, white flowers, rice', hi: 'हीरा, चाँदी, रेशम, इत्र, शर्करा, कपूर, श्वेत पुष्प, चावल' },
  direction: { en: 'South-East (Agneya)', hi: 'आग्नेय (दक्षिण-पूर्व)' },
  day: { en: 'Friday (Shukravara)', hi: 'शुक्रवार' },
  color: { en: 'White / Iridescent / Pastel', hi: 'श्वेत / इन्द्रधनुषी / हल्का रंग' },
  season: { en: 'Vasanta (Spring)', hi: 'वसन्त ऋतु' },
  taste: { en: 'Sour (Amla)', hi: 'अम्ल (खट्टा)' },
  guna: { en: 'Rajas', hi: 'रजस्' },
  element: { en: 'Water (Jala)', hi: 'जल तत्त्व' },
  gender: { en: 'Feminine', hi: 'स्त्रीलिंग' },
  nature: { en: 'Natural Benefic (Shubha Graha) — the second-greatest benefic, governing pleasure and harmony', hi: 'स्वाभाविक शुभ ग्रह — दूसरा सबसे बड़ा शुभ, सुख और सामंजस्य का शासक' },
};

// ─── Venus in 12 Signs ────────────────────────────────────────────────
const VENUS_IN_SIGNS: { sign: ML; effect: ML; dignity: string }[] = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, dignity: 'Neutral',
    effect: { en: 'Venus in Mars\'s fire sign creates passionate, impulsive love. The native falls in love quickly and intensely. Attraction to bold, athletic, and adventurous partners. Artistic expression is dynamic and action-oriented — dance, martial arts as art, performance art. Spending is impulsive. Romance can burn hot and flame out. Physical beauty tends toward a strong, athletic build. The creative fire is intense but can lack refinement. Fashion choices are bold and attention-grabbing.', hi: 'मंगल की अग्नि राशि में शुक्र उत्कट, आवेगपूर्ण प्रेम बनाता है। जातक तेज़ी से और तीव्रता से प्रेम में पड़ता है। साहसी, खिलाड़ी साथियों के प्रति आकर्षण। कलात्मक अभिव्यक्ति गतिशील — नृत्य, प्रदर्शन कला। खर्च आवेगपूर्ण। प्रेम तीव्र किन्तु अल्पकालिक हो सकता है।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, dignity: 'Own sign',
    effect: { en: 'Venus in its own earth sign — the connoisseur of life\'s pleasures. This is Venus at its most sensual and materialistic. The native has exquisite taste in food, clothing, art, and music. Natural ability to accumulate wealth and luxury items. Steady, loyal love that values security over excitement. Beautiful singing voice. Can be possessive and overly attached to comfort. Gardening, cooking, and interior design are natural talents. Marriage is stable and often materially prosperous. Physical beauty is classic and enduring rather than flashy.', hi: 'शुक्र अपनी पृथ्वी राशि में — जीवन के सुखों का पारखी। यह शुक्र का सबसे कामुक और भौतिकवादी रूप है। भोजन, वस्त्र, कला और संगीत में उत्कृष्ट रुचि। धन और विलासिता संचय की स्वाभाविक क्षमता। स्थिर, वफादार प्रेम। सुन्दर गायन स्वर। अधिकारी और सुख से अत्यधिक आसक्त हो सकता है। विवाह स्थिर और भौतिक रूप से समृद्ध।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, dignity: "Friend's sign",
    effect: { en: 'Venus in Mercury\'s air sign creates a charming, witty, and socially versatile lover. The native flirts with words — poetry, love letters, and intellectual seduction are their style. Attracted to intelligent, communicative partners. Can maintain multiple romantic interests simultaneously. Artistic expression through writing, comedy, and verbal arts. Spending on books, gadgets, and social events. Love feels lighter here — playful rather than intense. Can produce songwriters, advertising creatives, and social media influencers.', hi: 'बुध की वायु राशि में शुक्र एक आकर्षक, बुद्धिमान और सामाजिक रूप से बहुमुखी प्रेमी बनाता है। शब्दों से आकर्षित करता है — काव्य, प्रेम पत्र और बौद्धिक मोहकता। बुद्धिमान, संवादशील साथियों के प्रति आकर्षण। एक साथ अनेक रोमांटिक रुचियाँ। गीतकार, विज्ञापन रचनाकार उत्पन्न कर सकता है।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, dignity: 'Neutral',
    effect: { en: 'Venus in Moon\'s nurturing sign creates deep emotional attachment in love. The native seeks comfort, security, and emotional intimacy above all. Home becomes a sanctuary of beauty — decorated with care, filled with good food and soft textures. Mothering quality in relationships. Attracted to partners who provide emotional security. Can be moody and clingy in love. Cooking, home decoration, and creating comfortable spaces are natural talents. Wealth through real estate and hospitality industries.', hi: 'चन्द्र की पोषक राशि में शुक्र प्रेम में गहरी भावनात्मक आसक्ति बनाता है। जातक सबसे ऊपर सुख, सुरक्षा और भावनात्मक अन्तरंगता चाहता है। घर सौन्दर्य का अभयारण्य बनता है। सम्बन्धों में पालन-पोषण गुण। भावनात्मक सुरक्षा देने वाले साथियों के प्रति आकर्षण। खाना पकाने और गृह सज्जा में स्वाभाविक प्रतिभा।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, dignity: "Enemy's sign",
    effect: { en: 'Venus in the Sun\'s royal sign creates a dramatic, grand, and attention-seeking lover. Romance must be theatrical — grand gestures, public displays of affection, luxury gifts. The native wants to be adored and puts their partner on a pedestal (as long as they reciprocate). Artistic expression is bold, colorful, and performative. Spending is extravagant. Fashion sense is dramatic and luxury-oriented. Can produce actors, entertainers, and fashion designers. Heart and ego dominate love — pride can destroy relationships if unchecked.', hi: 'सूर्य की राजसी राशि में शुक्र नाटकीय, भव्य और ध्यान आकर्षित करने वाला प्रेमी बनाता है। प्रेम नाटकीय होना चाहिए — भव्य भाव, सार्वजनिक स्नेह प्रदर्शन, विलासितापूर्ण उपहार। कलात्मक अभिव्यक्ति साहसी और प्रदर्शनकारी। खर्च भव्य। अभिनेता, मनोरंजनकर्ता उत्पन्न कर सकता है। हृदय और अहंकार प्रेम पर हावी।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, dignity: 'Debilitated',
    effect: { en: 'Venus is debilitated here — beauty is analyzed to death. The native applies Mercury\'s critical eye to love and pleasure, finding faults where there should be enjoyment. Relationships suffer from perfectionism and over-analysis. The 27° point is the deepest fall. However, Neecha Bhanga is common and can produce extraordinarily refined aesthetics — think of the craftsperson who perfects every detail. Practical love expressed through service rather than romance. Can produce master craftspeople, precision artists, and health-beauty specialists. The lesson: love is not perfect, and that is its beauty.', hi: 'शुक्र यहाँ नीच है — सौन्दर्य का विश्लेषण करके मार दिया जाता है। जातक प्रेम और सुख पर बुध की आलोचनात्मक दृष्टि लगाता है। सम्बन्ध पूर्णतावाद और अति-विश्लेषण से पीड़ित। 27° पर सबसे गहरी नीचता। तथापि नीच भंग सामान्य है और असाधारण परिष्कृत सौन्दर्य बोध उत्पन्न कर सकता है। सेवा से व्यक्त व्यावहारिक प्रेम।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, dignity: 'Own sign (Moolatrikona)',
    effect: { en: 'Venus in its own air sign — the diplomat of love and beauty. This is Venus at its most refined, balanced, and socially graceful. The native has an innate sense of proportion, harmony, and aesthetic perfection. Marriage is central to life purpose. The first 5° is Moolatrikona — even stronger than own-sign dignity. Excellent for law, diplomacy, fashion, and interior design. Partnerships of all kinds thrive. Can mediate any conflict with grace. The danger is indecisiveness — weighing options endlessly without committing. Social life is rich and culturally sophisticated.', hi: 'शुक्र अपनी वायु राशि में — प्रेम और सौन्दर्य का राजनयिक। यह शुक्र का सबसे परिष्कृत, सन्तुलित और सामाजिक रूप से सुशील रूप है। अनुपात, सामंजस्य और सौन्दर्य पूर्णता का जन्मजात बोध। विवाह जीवन के उद्देश्य का केन्द्र। प्रथम 5° मूलत्रिकोण — स्वराशि से भी बलवान। विधि, कूटनीति, फैशन के लिए उत्कृष्ट। अनिर्णय का खतरा।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, dignity: 'Neutral',
    effect: { en: 'Venus in Mars\'s water sign creates intense, obsessive, all-or-nothing love. Sexual passion is at its peak — desire becomes a consuming force. The native is magnetically attractive with an aura of mystery. Jealousy and possessiveness can be extreme. Artistic expression is dark, provocative, and emotionally raw. Wealth through inheritance, insurance, or partner\'s resources. Can produce tantric practitioners, passionate musicians, and psychological counselors. Love involves power dynamics — surrender and control alternate. The deepest romantic connections and the most painful betrayals happen here.', hi: 'मंगल की जल राशि में शुक्र तीव्र, जुनूनी, सर्वस्व-या-कुछ-नहीं प्रेम बनाता है। कामवासना अपने शिखर पर — इच्छा एक भस्म करने वाली शक्ति बनती है। जातक रहस्यमय आभा के साथ चुम्बकीय रूप से आकर्षक। ईर्ष्या और अधिकार भावना चरम पर। कलात्मक अभिव्यक्ति अन्धकारमय, उत्तेजक। गहनतम प्रेम सम्बन्ध और सबसे दर्दनाक विश्वासघात।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, dignity: 'Neutral',
    effect: { en: 'Venus in Jupiter\'s fire sign brings philosophical depth to love and pleasure. The native seeks a partner who is also a travel companion and intellectual equal. Love of foreign cultures, exotic cuisines, and adventure. Artistic expression is expansive and cross-cultural — world music, travel writing, multicultural fashion. Spending is generous but scattered. Freedom in relationships is non-negotiable. Can produce international art dealers, cultural ambassadors, and travel content creators. Marriage to someone from a different culture or religion is common.', hi: 'गुरु की अग्नि राशि में शुक्र प्रेम और सुख में दार्शनिक गहराई लाता है। जातक ऐसा साथी चाहता है जो यात्रा साथी और बौद्धिक समकक्ष भी हो। विदेशी संस्कृतियों, व्यंजनों और साहस का प्रेम। कलात्मक अभिव्यक्ति विस्तारशील और बहुसांस्कृतिक। सम्बन्धों में स्वतन्त्रता अपरिहार्य। भिन्न संस्कृति या धर्म से विवाह सामान्य।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, dignity: "Friend's sign",
    effect: { en: 'Venus in Saturn\'s earth sign brings structure, discipline, and longevity to love. Romance is practical, not poetic — the native chooses partners based on status, stability, and long-term compatibility rather than passion. Age-gap relationships are common. Beauty is classical, understated, and elegant. Artistic expression favors architecture, sculpture, and timeless design. Wealth accumulates slowly through disciplined saving. Marriage improves with age. Can produce fashion designers known for clean lines, financial advisors for the luxury sector, and museum curators.', hi: 'शनि की पृथ्वी राशि में शुक्र प्रेम में संरचना, अनुशासन और दीर्घायु लाता है। प्रेम व्यावहारिक, काव्यात्मक नहीं — जातक स्थिति, स्थिरता और दीर्घकालिक संगतता के आधार पर साथी चुनता है। आयु-अन्तर सम्बन्ध सामान्य। सौन्दर्य शास्त्रीय, संयमित। विवाह आयु के साथ सुधरता है।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, dignity: "Friend's sign",
    effect: { en: 'Venus in Saturn\'s air sign creates unconventional, progressive, and freedom-loving romantic sensibilities. The native is attracted to unique, eccentric individuals. Friendships may blur into romance. Artistic expression is avant-garde, technological, and community-oriented — digital art, social media aesthetics, electronic music. Humanitarian causes inspire beauty. Relationships may follow non-traditional structures. Wealth through technology, social enterprises, and innovative luxury brands. Fashion choices are futuristic and individualistic.', hi: 'शनि की वायु राशि में शुक्र अपरम्परागत, प्रगतिशील और स्वतन्त्रता-प्रिय प्रेम संवेदनशीलता बनाता है। अद्वितीय, विलक्षण व्यक्तियों के प्रति आकर्षण। मित्रता प्रेम में बदल सकती है। कलात्मक अभिव्यक्ति अवान-गार्ड, तकनीकी — डिजिटल कला, इलेक्ट्रॉनिक संगीत। अपरम्परागत सम्बन्ध संरचनाएँ।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, dignity: 'Exalted',
    effect: { en: 'Venus is exalted here — love reaches its most transcendent, selfless, and spiritually refined expression. The native experiences love as a devotional practice — bhakti in human form. Artistic genius is at its peak: music, poetry, film, and dance achieve divine beauty. The 27° point is the deepest exaltation. Compassion overflows into all relationships. Can sacrifice personal comfort for a loved one without resentment. This placement produces the greatest musicians, poets, and romantic artists in history. Marriage has a karmic, destined quality. The danger is losing practical sense entirely — drowning in romantic idealism.', hi: 'शुक्र यहाँ उच्च है — प्रेम अपनी सबसे उत्कृष्ट, निःस्वार्थ और आध्यात्मिक रूप से परिष्कृत अभिव्यक्ति तक पहुँचता है। जातक प्रेम को भक्ति साधना के रूप में अनुभव करता है — मानवीय रूप में भक्ति। कलात्मक प्रतिभा अपने शिखर पर: संगीत, काव्य, फिल्म में दिव्य सौन्दर्य। 27° पर परम उच्च। करुणा सभी सम्बन्धों में उमड़ती है। इतिहास के महानतम संगीतकार, कवि उत्पन्न करती है।' } },
];

// ─── Venus in 12 Houses ───────────────────────────────────────────────
const VENUS_IN_HOUSES: { house: number; name: ML; effect: ML }[] = [
  { house: 1, name: { en: '1st House (Lagna)', hi: 'प्रथम भाव (लग्न)' },
    effect: { en: 'Attractive physical appearance, charming personality, and magnetic social presence. The native is naturally beautiful or handsome, with a pleasant demeanor that draws others. Strong interest in fashion, grooming, and self-presentation. Artistic talent is visible from childhood. Love life is active and central to the native\'s identity. Can indicate vanity if afflicted. Health is generally good, with a soft, well-proportioned body. The native brings beauty and harmony wherever they go. Venus aspects the 7th from here — blessing marriage.', hi: 'आकर्षक शारीरिक रूप, मनमोहक व्यक्तित्व और चुम्बकीय सामाजिक उपस्थिति। जातक स्वाभाविक रूप से सुन्दर, सुखद व्यवहार से दूसरों को आकर्षित करता है। फैशन, सज्जा और आत्म-प्रस्तुति में गहरी रुचि। बचपन से दृश्य कलात्मक प्रतिभा। शुक्र यहाँ से 7वें भाव को देखता है — विवाह को आशीर्वाद।' } },
  { house: 2, name: { en: '2nd House (Dhana)', hi: 'द्वितीय भाव (धन)' },
    effect: { en: 'Sweet, melodious speech and beautiful singing voice. Wealth through artistic pursuits, luxury goods, or beauty industries. The native accumulates precious jewelry, silk, and fine possessions. Family life is harmonious and aesthetically pleasing. Food preferences are refined and gourmet. Excellent for careers in hospitality, culinary arts, and luxury retail. Face is particularly attractive — beautiful eyes, lips, or smile. Multiple sources of income through Venus-ruled activities. Family values emphasize beauty, culture, and refinement.', hi: 'मधुर, सुरीली वाणी और सुन्दर गायन स्वर। कलात्मक कार्यों, विलास वस्तुओं या सौन्दर्य उद्योगों से धन। बहुमूल्य आभूषण, रेशम और श्रेष्ठ वस्तुओं का संचय। पारिवारिक जीवन सामंजस्यपूर्ण। भोजन रुचि परिष्कृत। चेहरा विशेष रूप से आकर्षक। शुक्र-शासित गतिविधियों से आय के अनेक स्रोत।' } },
  { house: 3, name: { en: '3rd House (Sahaja)', hi: 'तृतीय भाव (सहज)' },
    effect: { en: 'Artistic communication skills — the native expresses beauty through writing, media, and short-form content. Younger siblings may be attractive or artistically gifted. Short travels for pleasure, shopping, or cultural events. Hands are skilled in fine arts — painting, calligraphy, jewelry-making. Social media presence is aesthetic and curated. Courageous in pursuing artistic goals. Can produce fashion bloggers, beauty vloggers, music journalists, and art critics. Romantic adventures during travel.', hi: 'कलात्मक संवाद कौशल — लेखन, मीडिया और लघु-रूप सामग्री से सौन्दर्य अभिव्यक्ति। छोटे भाई-बहन आकर्षक या कलात्मक रूप से प्रतिभाशाली। सुख, खरीदारी या सांस्कृतिक कार्यक्रमों के लिए लघु यात्राएँ। हाथ ललित कलाओं में कुशल। सोशल मीडिया उपस्थिति सौन्दर्यपरक।' } },
  { house: 4, name: { en: '4th House (Sukha)', hi: 'चतुर्थ भाव (सुख)' },
    effect: { en: 'Beautiful home with luxurious furnishings. The native finds deep happiness in domestic life. Mother is beautiful, cultured, and possibly artistic. Vehicles are comfortable and aesthetic — luxury cars. Academic life is pleasant and artistically inclined. Inner peace comes through beauty, comfort, and emotional security. Real estate investments in beautiful locations. Can indicate a home studio for art or music. This is a Kendra placement — Venus here produces Malavya Yoga (one of the five Mahapurusha Yogas) if in own sign or exalted. Last years of life are comfortable and beautiful.', hi: 'विलासितापूर्ण साज-सज्जा वाला सुन्दर घर। जातक गृहस्थ जीवन में गहरा सुख पाता है। माता सुन्दर, संस्कृत और सम्भवतः कलात्मक। वाहन आरामदायक और सौन्दर्यपरक। केन्द्र स्थिति — शुक्र यहाँ मालव्य योग बनाता है यदि स्वराशि या उच्च में। जीवन के अन्तिम वर्ष आरामदायक।' } },
  { house: 5, name: { en: '5th House (Putra)', hi: 'पंचम भाव (पुत्र)' },
    effect: { en: 'Romantic, creative, and blessed with beautiful children. The native has a natural flair for performing arts, cinema, and entertainment. Love affairs are passionate and dramatic — this is the placement of the great romancer. Speculative gains through artistic ventures. Children are attractive and artistically gifted. Mantra practice has aesthetic quality — devotional music over silent meditation. Government or public recognition for creative work. This is one of the best placements for artists, actors, and musicians.', hi: 'रोमांटिक, सृजनात्मक और सुन्दर सन्तान से आशीर्वादित। प्रदर्शन कला, सिनेमा और मनोरंजन में स्वाभाविक प्रतिभा। प्रेम सम्बन्ध उत्कट और नाटकीय। कलात्मक उद्यमों से सट्टा लाभ। सन्तान आकर्षक और कलात्मक। सृजनात्मक कार्य के लिए सार्वजनिक मान्यता। कलाकारों, अभिनेताओं के लिए सर्वश्रेष्ठ स्थितियों में।' } },
  { house: 6, name: { en: '6th House (Ripu)', hi: 'षष्ठ भाव (रिपु)' },
    effect: { en: 'Venus in a dusthana creates complications in love — the native may attract partners who need healing or rescue. Service-oriented relationships. Health issues related to kidneys, reproductive system, or diabetes (Venus rules sugar). Can indicate workplace romance or love with colleagues. Enemies are overcome through charm and diplomacy rather than confrontation. Beauty industry in the service sector — medical aesthetics, cosmetic dermatology, rehabilitation through art therapy. Debts may arise from luxury spending.', hi: 'दुस्थान में शुक्र प्रेम में जटिलताएँ बनाता है — जातक ऐसे साथी आकर्षित कर सकता है जिन्हें उपचार की आवश्यकता। वृक्क, प्रजनन तन्त्र या मधुमेह से स्वास्थ्य समस्याएँ। कार्यस्थल प्रेम सम्भव। शत्रुओं पर आकर्षण और कूटनीति से विजय। विलासिता खर्च से ऋण सम्भव।' } },
  { house: 7, name: { en: '7th House (Kalatra)', hi: 'सप्तम भाव (कलत्र)' },
    effect: { en: 'The natural significator in its natural house — an exceptionally strong placement for marriage. The spouse is beautiful, cultured, loving, and possibly from a wealthy or artistic family. Marriage brings luxury, social status, and emotional fulfillment. Business partnerships with creative or luxury brands succeed. Diplomatic skill is exceptional. Can produce celebrity marriages or marriages that elevate social status. Multiple relationships are possible before settling. Venus aspects the Lagna from here — the native becomes more attractive after marriage.', hi: 'स्वाभाविक कारक अपने स्वाभाविक भाव में — विवाह के लिए असाधारण शक्तिशाली स्थिति। जीवनसाथी सुन्दर, संस्कृत, प्रेमपूर्ण और सम्भवतः सम्पन्न या कलात्मक परिवार से। विवाह विलासिता, सामाजिक प्रतिष्ठा और भावनात्मक पूर्ति लाता है। शुक्र यहाँ से लग्न को देखता है — विवाह के बाद जातक और आकर्षक बनता है।' } },
  { house: 8, name: { en: '8th House (Ayu)', hi: 'अष्टम भाव (आयु)' },
    effect: { en: 'Intense sexual magnetism and deep, transformative romantic experiences. The native has a mysterious allure that attracts others powerfully. Wealth through spouse, inheritance, or insurance. Interest in tantric practices and the esoteric dimension of love. Secretive about romantic life. Can indicate a partner\'s wealth benefiting the native. Sudden changes in love life — dramatic beginnings and endings. Beauty has a dark, seductive quality. Longevity is generally good with Venus in the 8th. Research into art history, ancient beauty practices, or occult dimensions of pleasure.', hi: 'तीव्र यौन चुम्बकत्व और गहरे, परिवर्तनकारी प्रेम अनुभव। रहस्यमय आकर्षण। जीवनसाथी, विरासत या बीमा से धन। तान्त्रिक साधना और प्रेम के गूढ़ आयाम में रुचि। प्रेम जीवन में अचानक परिवर्तन। सौन्दर्य में अन्धकारमय, मोहक गुण। 8वें भाव में शुक्र से दीर्घायु प्रायः शुभ।' } },
  { house: 9, name: { en: '9th House (Dharma)', hi: 'नवम भाव (धर्म)' },
    effect: { en: 'Love and beauty as a spiritual path — the native finds dharma through art, pleasure, and harmonious living. Father may be wealthy, cultured, or connected to arts. Long-distance travel for romantic or cultural purposes. Marriage to someone from a different culture, religion, or country is common. Higher education in arts, music, design, or aesthetics. Philosophical approach to love and relationships. Luck through Venus-ruled activities. Temple art, devotional music, and sacred architecture resonate deeply. The native sees beauty as a manifestation of the divine.', hi: 'आध्यात्मिक पथ के रूप में प्रेम और सौन्दर्य — जातक कला, सुख और सामंजस्यपूर्ण जीवन से धर्म पाता है। पिता सम्पन्न, संस्कृत या कला से जुड़ा हो सकता है। प्रेम या सांस्कृतिक उद्देश्यों से दीर्घ यात्रा। भिन्न संस्कृति या देश से विवाह सामान्य। कला में उच्च शिक्षा। सौन्दर्य को दिव्य अभिव्यक्ति के रूप में देखता है।' } },
  { house: 10, name: { en: '10th House (Karma)', hi: 'दशम भाव (कर्म)' },
    effect: { en: 'Career in arts, entertainment, fashion, beauty, or luxury industries. The native achieves fame and recognition through Venus-ruled activities. Public image is attractive and charming. Can indicate celebrity status or a career that involves beauty and aesthetics. Government recognition for artistic contributions. This is a Kendra placement — Malavya Yoga forms if Venus is in own sign or exalted here. Business acumen in luxury brands and creative enterprises. The native\'s career defines their social charm. International recognition for aesthetic work.', hi: 'कला, मनोरंजन, फैशन, सौन्दर्य या विलासिता उद्योगों में करियर। शुक्र-शासित गतिविधियों से यश और मान्यता। सार्वजनिक छवि आकर्षक। सेलिब्रिटी दर्जा सम्भव। केन्द्र स्थिति — मालव्य योग बनता है यदि शुक्र स्वराशि या उच्च। विलासिता ब्राण्ड और सृजनात्मक उद्यमों में व्यापार कौशल।' } },
  { house: 11, name: { en: '11th House (Labha)', hi: 'एकादश भाव (लाभ)' },
    effect: { en: 'Gains through artistic and creative networks. Beautiful, wealthy, and influential friends. Elder siblings may be attractive or connected to arts. Social life is rich and culturally vibrant. Income through entertainment, fashion, beauty, and luxury industries. Desires are fulfilled — especially those related to love, comfort, and aesthetic pleasure. Community involvement in cultural organizations. Romantic connections through social networks and friend circles. This is an upachaya house — Venus\'s results strengthen with age.', hi: 'कलात्मक और सृजनात्मक नेटवर्क से लाभ। सुन्दर, सम्पन्न और प्रभावशाली मित्र। सामाजिक जीवन समृद्ध और सांस्कृतिक रूप से जीवन्त। मनोरंजन, फैशन और विलासिता उद्योगों से आय। प्रेम, सुख और सौन्दर्य से सम्बन्धित इच्छाएँ पूर्ण। उपचय भाव — शुक्र के फल आयु के साथ बलवान।' } },
  { house: 12, name: { en: '12th House (Vyaya)', hi: 'द्वादश भाव (व्यय)' },
    effect: { en: 'Venus in the 12th is excellent for bedroom pleasures and spiritual love. The native has an active and fulfilling intimate life. Expenses on luxury, travel, and pleasure. Foreign connections bring romantic opportunities. Artistic expression has a dreamy, otherworldly quality. Can indicate secret affairs or love that operates behind the scenes. Excellent for spiritual practices involving beauty — devotional music, sacred dance, temple art. Moksha through love and surrender. Financial outflow is constant but on pleasurable causes. The native may live abroad for love or work in the luxury/entertainment sector internationally.', hi: '12वें भाव में शुक्र शयनकक्ष सुख और आध्यात्मिक प्रेम के लिए उत्कृष्ट। सक्रिय और पूर्ण अन्तरंग जीवन। विलासिता, यात्रा और सुख पर व्यय। विदेशी सम्बन्ध प्रेम अवसर लाते हैं। कलात्मक अभिव्यक्ति स्वप्निल, अलौकिक। गुप्त प्रेम सम्भव। भक्ति संगीत, पवित्र नृत्य में आध्यात्मिक साधना। प्रेम और समर्पण से मोक्ष।' } },
];

// ─── Astronomical Profile ──────────────────────────────────────────────
const ASTRONOMICAL = {
  orbitalPeriod: { en: 'Orbital period: 224.7 days — Venus completes its orbit in about 7.5 months, making it faster than Earth but appearing to move slowly from our perspective due to its similar orbital distance. Venus is Earth\'s closest planetary neighbor and the brightest object in the sky after the Sun and Moon.', hi: 'कक्षीय अवधि: 224.7 दिन — शुक्र लगभग 7.5 माह में अपनी कक्षा पूरी करता है। शुक्र पृथ्वी का निकटतम ग्रह पड़ोसी और सूर्य-चन्द्र के बाद आकाश की सबसे चमकीली वस्तु है।' },
  dailyMotion: { en: 'Average daily motion: ~1.6° per day (varies 0.6°–1.3° in geocentric terms). Venus spends 15–60 days in each sign depending on its retrograde cycle. Because Venus is an inferior planet (orbiting closer to the Sun than Earth), it oscillates between being a morning star (visible before sunrise) and evening star (visible after sunset) — never appearing at midnight.', hi: 'औसत दैनिक गति: ~1.6° प्रतिदिन (भूकेन्द्रिक दृष्टि से 0.6°-1.3°)। शुक्र प्रत्येक राशि में 15-60 दिन बिताता है। शुक्र अधोग्रह होने से प्रातः तारा (सूर्योदय से पूर्व) और सायं तारा (सूर्यास्त के बाद) के बीच दोलन करता है — कभी मध्यरात्रि में दृश्य नहीं।' },
  synodicPeriod: { en: 'Synodic period: 583.9 days — the interval between successive inferior conjunctions. This nearly 19-month cycle is deeply significant: five synodic periods almost exactly equal 8 Earth years, creating the famous Venus Pentagram — if you plot Venus\'s inferior conjunctions on the zodiac over 8 years, they form a near-perfect five-pointed star. Ancient civilizations tracked this pattern, associating Venus with the number 5 and the pentagram.', hi: 'सिनॉडिक अवधि: 583.9 दिन — क्रमिक अधोयुतियों के बीच। यह लगभग 19-माह चक्र गहन महत्त्वपूर्ण है: पाँच सिनॉडिक अवधियाँ लगभग 8 पृथ्वी वर्षों के बराबर, प्रसिद्ध शुक्र पंचकोण बनाते हैं — 8 वर्षों में शुक्र की अधोयुतियाँ राशिचक्र पर लगभग पूर्ण पंचकोणीय तारा बनाती हैं।' },
  retrograde: { en: 'Retrograde frequency: Once every 18 months, lasting approximately 40–43 days. Venus retrograde is the rarest inner-planet retrograde. During retrograde, old lovers may reappear, past relationship patterns resurface, and aesthetic judgments may be unreliable (avoid cosmetic surgery, major beauty purchases, or wedding planning). Natal Venus retrograde (~7% of charts — the rarest) indicates deeply internalized values around love and beauty, often with a karmic quality to relationships.', hi: 'वक्री आवृत्ति: प्रत्येक 18 माह में एक बार, लगभग 40-43 दिन। शुक्र वक्री सबसे दुर्लभ आन्तरिक ग्रह वक्री है। वक्री काल में पुराने प्रेमी पुनः प्रकट हो सकते हैं, पूर्व सम्बन्ध पैटर्न उभर सकते हैं। जन्मजात शुक्र वक्री (~7% कुण्डलियों में — सबसे दुर्लभ) प्रेम और सौन्दर्य के प्रति गहन आन्तरिक मूल्य सूचित करता है।' },
  combustion: { en: 'Combustion: Venus is combust within ~10° of Sun (direct) or ~8° (retrograde). Venus combustion is the MOST COMMON planetary combustion because Venus never strays more than ~47° from the Sun. About 10% of people have combust Venus at birth. When combust, romantic significations weaken — the native may prioritize ego, career, or social status over genuine love and intimacy. Marriage may be delayed or the spouse may feel overshadowed.', hi: 'अस्त: शुक्र सूर्य से ~10° (मार्गी) या ~8° (वक्री) के भीतर अस्त। शुक्र अस्त सबसे सामान्य ग्रह अस्त है क्योंकि शुक्र सूर्य से कभी ~47° से अधिक दूर नहीं। लगभग 10% लोगों का जन्मजात शुक्र अस्त। अस्त होने पर प्रेम कारकत्व दुर्बल — जातक अहंकार या करियर को प्रेम और अन्तरंगता पर प्राथमिकता दे सकता है। विवाह में विलम्ब सम्भव।' },
  astronomicalSignificance: { en: 'Astronomical vs. astrological significance: Venus is Earth\'s "sister planet" — nearly identical in size and mass, yet with a surface temperature of 475°C and an atmosphere of sulfuric acid clouds. This duality mirrors Venus\'s astrological nature: externally beautiful but internally intense. Venus rotates backward (retrograde rotation), making its day longer than its year — the only planet with this property. Astrologically, this reflects Venus\'s capacity to reverse conventional expectations: what looks like pleasure can become suffering, and what seems like loss in love can become spiritual liberation.', hi: 'खगोलीय बनाम ज्योतिषीय महत्त्व: शुक्र पृथ्वी का "भगिनी ग्रह" — आकार और द्रव्यमान में लगभग समान, तथापि 475°C सतह तापमान और सल्फ्यूरिक अम्ल मेघ। यह द्वैत ज्योतिषीय प्रकृति को प्रतिबिम्बित करता है: बाहर से सुन्दर किन्तु भीतर तीव्र। शुक्र उलटा घूमता है (वक्री घूर्णन), इसका दिन वर्ष से लम्बा — एकमात्र ग्रह। ज्योतिषीय रूप से, यह शुक्र की परम्परागत अपेक्षाओं को उलटने की क्षमता दर्शाता है।' },
};

// ─── Notable Yogas ────────────────────────────────────────────────────
const NOTABLE_YOGAS = [
  { name: { en: 'Malavya Yoga (Mahapurusha)', hi: 'मालव्य योग (महापुरुष)' },
    condition: { en: 'Venus in a kendra (1st, 4th, 7th, or 10th house) in its own sign (Taurus/Libra) or exalted (Pisces). This is one of the five Mahapurusha Yogas.', hi: 'शुक्र केन्द्र (1, 4, 7, 10 भाव) में स्वराशि (वृषभ/तुला) या उच्च (मीन) में। यह पाँच महापुरुष योगों में एक है।' },
    effect: { en: 'The native possesses exceptional beauty, charm, and artistic talent. Malavya (meaning "born of the Malava people" — a culture known for refinement) produces individuals who elevate their surroundings through aesthetic grace. Luxurious lifestyle, beautiful spouse, many vehicles, and social prominence. The native becomes a patron or creator of art, fashion, or luxury. Strong sensual nature balanced by refined taste. This yoga often produces celebrities, fashion moguls, and cultural icons.', hi: 'जातक में असाधारण सौन्दर्य, आकर्षण और कलात्मक प्रतिभा। मालव्य सौन्दर्य कृपा से अपने परिवेश को ऊँचा करने वाले व्यक्ति उत्पन्न करता है। विलासितापूर्ण जीवनशैली, सुन्दर जीवनसाथी, अनेक वाहन और सामाजिक प्रमुखता। कला, फैशन या विलासिता का संरक्षक या सृजक। सेलिब्रिटी, फैशन शक्तिशाली और सांस्कृतिक प्रतीक उत्पन्न करता है।' },
    strength: { en: 'Strongest in 7th house (marriage) and 4th house (comforts). In the 10th, it creates fame through beauty/art. Weakened if Venus is combust, retrograde, or aspected by Saturn (delays) or Mars (conflict in love).', hi: '7वें भाव (विवाह) और 4थे भाव (सुख) में सबसे बलवान। 10वें में सौन्दर्य/कला से यश। शुक्र अस्त, वक्री या शनि (विलम्ब) या मंगल (प्रेम में संघर्ष) की दृष्टि में हो तो दुर्बल।' } },
  { name: { en: 'Lakshmi Yoga', hi: 'लक्ष्मी योग' },
    condition: { en: 'The lord of the 9th house is strong and Venus occupies its own or exalted sign in a kendra or trikona. Alternatively, Venus as 9th lord in a kendra in strong dignity.', hi: '9वें भाव का स्वामी बलवान और शुक्र केन्द्र या त्रिकोण में स्वराशि या उच्च में। वैकल्पिक: शुक्र 9वें भाव स्वामी के रूप में केन्द्र में बलवान गरिमा में।' },
    effect: { en: 'Named after the goddess of wealth and beauty, this yoga bestows material abundance with aesthetic refinement. The native accumulates luxury, art, and precious items. Wealth comes through beauty-related industries, partnerships, or spouse\'s family. Unlike purely material wealth yogas, Lakshmi Yoga implies that prosperity is accompanied by grace, taste, and cultural sophistication.', hi: 'धन और सौन्दर्य की देवी के नाम पर, यह योग सौन्दर्य परिष्कार के साथ भौतिक प्रचुरता देता है। विलासिता, कला और बहुमूल्य वस्तुओं का संचय। सौन्दर्य-सम्बन्धित उद्योगों, साझेदारियों या जीवनसाथी के परिवार से धन। समृद्धि कृपा, रुचि और सांस्कृतिक परिष्कार के साथ।' },
    strength: { en: 'Full strength requires Venus and 9th lord both unafflicted. Jupiter\'s aspect on Venus significantly enhances this yoga.', hi: 'पूर्ण बल के लिए शुक्र और 9वें भाव स्वामी दोनों अपीड़ित। शुक्र पर गुरु की दृष्टि योग को बहुत बढ़ाती है।' } },
  { name: { en: 'Raja Lakshmi Yoga', hi: 'राज लक्ष्मी योग' },
    condition: { en: 'Venus conjunct or aspecting the lord of the Lagna while being placed in a kendra or trikona in good dignity. Venus should not be combust.', hi: 'शुक्र लग्न स्वामी से युत या दृष्टि करता हो, केन्द्र या त्रिकोण में सुगरिमा। शुक्र अस्त न हो।' },
    effect: { en: 'The native leads a life of both power and luxury — the queen or king who rules with grace. Political power through charm and cultural influence rather than brute force. Produces leaders in creative industries, diplomatic corps, and fashion empires. Marriage elevates social status dramatically.', hi: 'जातक शक्ति और विलासिता दोनों का जीवन जीता है — कृपा से शासन करने वाला राजा या रानी। आकर्षण और सांस्कृतिक प्रभाव से राजनीतिक शक्ति। सृजनात्मक उद्योगों, कूटनीतिक दल और फैशन साम्राज्यों में नेता। विवाह सामाजिक प्रतिष्ठा नाटकीय रूप से ऊँची करता है।' },
    strength: { en: 'Strongest when Venus is exalted in Pisces and the Lagna lord is Jupiter. Weakened by any malefic aspect on Venus.', hi: 'शुक्र मीन में उच्च हो और लग्न स्वामी गुरु हो तो सबसे बलवान। शुक्र पर किसी पापी दृष्टि से दुर्बल।' } },
  { name: { en: 'Kalatramsha Yoga', hi: 'कलत्रांश योग' },
    condition: { en: 'Venus in the Navamsha (D-9) chart placed in its own sign, exalted sign, or in a kendra from the Navamsha Lagna. The D-9 is the chart of marriage — Venus\'s dignity here is crucial for married life.', hi: 'नवमांश (D-9) में शुक्र स्वराशि, उच्च राशि या नवमांश लग्न से केन्द्र में। D-9 विवाह की कुण्डली है — यहाँ शुक्र की गरिमा वैवाहिक जीवन के लिए महत्त्वपूर्ण।' },
    effect: { en: 'Even if Venus is poorly placed in the Rashi chart, strong Venus in the Navamsha rescues married life. The native finds a beautiful, supportive, and compatible spouse. Physical intimacy is fulfilling. Artistic appreciation deepens with marriage. This yoga is often overlooked because astrologers only check the Rashi chart — but for marriage, the Navamsha is equally or more important.', hi: 'राशि कुण्डली में शुक्र दुर्बल हो तो भी नवमांश में बलवान शुक्र वैवाहिक जीवन बचाता है। सुन्दर, सहायक और अनुकूल जीवनसाथी मिलता है। शारीरिक अन्तरंगता पूर्ण। विवाह के साथ कलात्मक सराहना गहरी। यह योग प्रायः अनदेखा क्योंकि ज्योतिषी केवल राशि कुण्डली जाँचते हैं — किन्तु विवाह के लिए नवमांश समान या अधिक महत्त्वपूर्ण।' },
    strength: { en: 'Strongest when Venus is Vargottama (same sign in both Rashi and Navamsha). Jupiter\'s aspect in the Navamsha adds spiritual depth to marriage.', hi: 'शुक्र वर्गोत्तम (राशि और नवमांश दोनों में एक ही राशि) हो तो सबसे बलवान। नवमांश में गुरु की दृष्टि विवाह में आध्यात्मिक गहराई जोड़ती है।' } },
  { name: { en: 'Venus-Saturn Yoga (Shukra-Shani)', hi: 'शुक्र-शनि योग' },
    condition: { en: 'Venus and Saturn conjunct or in mutual aspect, especially in signs favorable to both (Libra, Taurus, Capricorn, Aquarius). They are natural friends.', hi: 'शुक्र और शनि युत या परस्पर दृष्टि, विशेषकर दोनों के अनुकूल राशियों (तुला, वृषभ, मकर, कुम्भ) में। वे स्वाभाविक मित्र हैं।' },
    effect: { en: 'The endurance artist. Saturn gives Venus discipline, structure, and longevity. The native creates timeless beauty — architecture that lasts centuries, music that becomes classical, fashion that defines an era. Marriage may come late but lasts forever. Relationships improve dramatically after age 35. Love expressed through commitment and loyalty rather than passion. This combination also excels in real estate, classical arts, and luxury brands built on heritage.', hi: 'धैर्यवान कलाकार। शनि शुक्र को अनुशासन, संरचना और दीर्घायु देता है। शाश्वत सौन्दर्य का सृजन — सदियों टिकने वाली वास्तुकला, शास्त्रीय बनने वाला संगीत। विवाह देर से किन्तु शाश्वत। 35 वर्ष के बाद सम्बन्ध नाटकीय सुधार। प्रतिबद्धता और वफादारी से व्यक्त प्रेम। अचल सम्पत्ति और विरासत-आधारित विलासिता ब्राण्ड में उत्कृष्ट।' },
    strength: { en: 'Strongest in Libra (Venus\'s Moolatrikona and Saturn\'s exaltation sign) — both planets are dignified. Weakened in Leo (Sun\'s sign — enemy of both).', hi: 'तुला में सबसे बलवान (शुक्र का मूलत्रिकोण और शनि की उच्च राशि) — दोनों ग्रह गरिमावान। सिंह (सूर्य की राशि — दोनों का शत्रु) में दुर्बल।' } },
];

// ─── Practical Application ────────────────────────────────────────────
const PRACTICAL = {
  assessStrength: {
    en: 'To assess Venus\'s strength in your chart: (1) Sign placement — exalted in Pisces (27°) is strongest, debilitated in Virgo (27°) is weakest; own signs Taurus and Libra are strong. (2) House placement — Venus thrives in kendras (especially 4th and 7th for marriage) and the 5th for romance; 6th/8th/12th create complications but the 12th paradoxically enhances bedroom pleasures. (3) Combustion — within 10° of Sun weakens romantic significations; this is the MOST COMMON Venus affliction (check your chart). (4) Navamsha dignity — for marriage assessment, Venus\'s sign in the D-9 chart is as important as in the D-1. (5) Aspects — Jupiter\'s aspect adds spiritual depth; Saturn\'s aspect delays but stabilizes; Mars\'s aspect adds passion but also conflict. (6) Retrograde — natal Venus retrograde (~7%) suggests karmic patterns in love from past lives.',
    hi: 'कुण्डली में शुक्र के बल का आकलन: (1) राशि — मीन 27° में उच्च सबसे बलवान, कन्या 27° में नीच दुर्बलतम; स्वराशि वृषभ और तुला बलवान। (2) भाव — केन्द्र (विशेषकर 4 और 7 विवाह के लिए) और 5वाँ प्रेम के लिए उत्कृष्ट; 6/8/12 जटिल किन्तु 12वाँ शयनकक्ष सुख बढ़ाता है। (3) अस्त — सूर्य से 10° के भीतर प्रेम कारकत्व दुर्बल; सबसे सामान्य शुक्र पीड़ा। (4) नवमांश गरिमा — विवाह के लिए D-9 में शुक्र की राशि D-1 जितनी महत्त्वपूर्ण। (5) दृष्टि — गुरु आध्यात्मिक गहराई; शनि विलम्ब किन्तु स्थिरता; मंगल उत्कटता किन्तु संघर्ष। (6) वक्री — जन्मजात शुक्र वक्री (~7%) पूर्वजन्म से प्रेम में कार्मिक पैटर्न।',
  },
  strongIndicators: {
    en: 'Signs of a strong Venus: Natural beauty and charm, harmonious relationships, artistic talent or refined taste, good marriage, pleasant voice, ability to attract wealth and luxury, social grace and diplomatic skill, sexual vitality, love of music and beauty, healthy skin and reproductive system, ability to create beauty in environment, and a magnetic personality that draws others.',
    hi: 'बलवान शुक्र के संकेत: स्वाभाविक सौन्दर्य और आकर्षण, सामंजस्यपूर्ण सम्बन्ध, कलात्मक प्रतिभा, अच्छा विवाह, मधुर स्वर, धन और विलासिता आकर्षित करने की क्षमता, सामाजिक कृपा और कूटनीतिक कौशल, यौन जीवन शक्ति, संगीत और सौन्दर्य प्रेम, स्वस्थ त्वचा और प्रजनन तन्त्र, चुम्बकीय व्यक्तित्व।',
  },
  weakIndicators: {
    en: 'Signs of a weak Venus: Troubled or delayed marriage, lack of aesthetic sense, reproductive health issues, kidney or urinary problems, skin disorders, inability to maintain romantic relationships, chronic dissatisfaction with appearance, difficulty attracting or retaining partners, excessive or suppressed sexuality, diabetes or hormonal imbalances, and a general inability to experience pleasure and beauty in daily life.',
    hi: 'दुर्बल शुक्र के संकेत: कष्टप्रद या विलम्बित विवाह, सौन्दर्य बोध की कमी, प्रजनन स्वास्थ्य समस्याएँ, वृक्क या मूत्र समस्याएँ, त्वचा विकार, प्रेम सम्बन्ध बनाये रखने में असमर्थता, दिखावट से दीर्घकालिक असन्तोष, साथी आकर्षित करने में कठिनाई, अत्यधिक या दमित कामुकता, मधुमेह या हार्मोनल असन्तुलन।',
  },
  whenToRemediate: {
    en: 'Seek Venus remedies when: Venus dasha is running and marriage, romantic, or financial issues dominate. When Venus is combust in your natal chart and relationships consistently feel overshadowed by career or ego. When Venus is debilitated and artistic expression feels blocked. When you experience repeated patterns of love that starts passionately but ends painfully. Venus remedies are MOST effective when combined with genuinely cultivating beauty — learning music, improving your living space, practicing generosity toward women and artists, and developing genuine appreciation (not just consumption) of art and culture.',
    hi: 'शुक्र उपाय कब करें: शुक्र दशा चल रही हो और विवाह, प्रेम या आर्थिक मुद्दे प्रभावी। शुक्र अस्त हो और सम्बन्ध करियर या अहंकार से लगातार दबे। शुक्र नीच हो और कलात्मक अभिव्यक्ति अवरुद्ध। बार-बार प्रेम उत्कट शुरू किन्तु दर्दनाक समापन। शुक्र उपाय सौन्दर्य का सच्चा विकास — संगीत सीखना, रहने की जगह सुधारना, महिलाओं और कलाकारों के प्रति उदारता — के साथ सबसे प्रभावी।',
  },
  misconceptions: {
    en: 'Common misconceptions: (1) "Venus is only about love and marriage" — Venus governs ALL pleasure, including artistic creation, financial luxury, diplomatic skill, and sensory refinement. It is equally important for career (in creative/luxury industries) as for love. (2) "Diamond is safe for everyone" — a strong Venus amplified by Diamond can increase sensual excess, extramarital temptation, and luxury addiction. Only wear it when Venus is genuinely weak. (3) "Venus in the 7th guarantees good marriage" — it guarantees an attractive spouse, but not necessarily a harmonious marriage. Afflictions to Venus in the 7th can create the most passionate AND the most painful partnerships. (4) "Venus retrograde means bad love life" — only 7% have this placement, and it indicates depth and karmic significance in love, not absence of it.',
    hi: 'सामान्य भ्रान्तियाँ: (1) "शुक्र केवल प्रेम और विवाह" — शुक्र सभी सुख शासित करता है — कलात्मक सृजन, आर्थिक विलासिता, कूटनीतिक कौशल। (2) "हीरा सबके लिए सुरक्षित" — बलवान शुक्र के साथ हीरा कामुक अतिरेक, विवाहेतर प्रलोभन बढ़ा सकता है। (3) "7वें भाव में शुक्र अच्छा विवाह गारण्टी" — आकर्षक जीवनसाथी गारण्टी, सामंजस्यपूर्ण विवाह नहीं। (4) "शुक्र वक्री बुरा प्रेम जीवन" — केवल 7% में; प्रेम में गहराई और कार्मिक महत्त्व सूचित करता है, अनुपस्थिति नहीं।',
  },
  malavyaDetail: {
    en: 'Malavya Yoga conditions and when it actually works: Malavya requires Venus in a kendra in own sign (Taurus/Libra) or exalted (Pisces). The 7th house placement is the strongest for marriage and partnerships — producing a spouse who is genuinely beautiful, cultured, and supportive. The 4th house produces the most luxurious home life and vehicle collection. The 10th house creates fame through beauty, art, or fashion. The 1st house makes the native themselves strikingly attractive. However, Malavya fails to deliver when: (a) Venus is combust (within 10° of Sun) — the light of beauty is consumed by ego. (b) Mars afflicts Venus — passion overrides harmony, creating relationship turbulence. (c) Saturn aspects Venus — delays and austerity undermine luxury. When Malavya operates fully, the native lives a life that others openly envy — beauty, love, wealth, and cultural refinement in abundance.',
    hi: 'मालव्य योग शर्तें और वास्तव में कब काम करता है: मालव्य के लिए शुक्र केन्द्र में स्वराशि (वृषभ/तुला) या उच्च (मीन)। 7वाँ भाव विवाह के लिए सबसे बलवान — वास्तव में सुन्दर, संस्कृत और सहायक जीवनसाथी। 4था भाव सबसे विलासितापूर्ण गृहस्थ जीवन। 10वाँ भाव सौन्दर्य, कला या फैशन से यश। 1ला भाव जातक को स्वयं अत्यन्त आकर्षक बनाता है। तथापि मालव्य विफल जब: (क) शुक्र अस्त — सौन्दर्य का प्रकाश अहंकार में विलीन। (ख) मंगल शुक्र पीड़ित — उत्कटता सामंजस्य पर हावी। (ग) शनि दृष्टि — विलम्ब और कठोरता विलासिता कम करती है।',
  },
};

// ─── Dasha Information ─────────────────────────────────────────────────
const DASHA = {
  years: 20,
  overview: {
    en: 'The Venus Mahadasha lasts 20 years — the longest of all planetary periods. This two-decade span typically defines the prime years of a person\'s romantic, creative, and material life. Marriage, romantic relationships, artistic achievements, luxury acquisitions, and social rise are central themes. The native\'s relationship with beauty, pleasure, and material comfort comes into sharp focus. For those with a well-placed Venus, this can be the most enjoyable and prosperous period of life. For those with an afflicted Venus, it can be 20 years of romantic suffering, financial drain through luxury, and unfulfilled desire.',
    hi: 'शुक्र महादशा 20 वर्ष चलती है — सभी ग्रह काल में सबसे लम्बी। यह दो-दशक की अवधि प्रायः व्यक्ति के प्रेम, सृजनात्मक और भौतिक जीवन के प्रमुख वर्षों को परिभाषित करती है। विवाह, प्रेम सम्बन्ध, कलात्मक उपलब्धियाँ, विलासिता अर्जन और सामाजिक उत्थान केन्द्रीय विषय। सुस्थित शुक्र के लिए यह जीवन की सबसे सुखद और समृद्ध अवधि। पीड़ित शुक्र के लिए 20 वर्ष प्रेम पीड़ा, विलासिता से आर्थिक हानि और अपूर्ण इच्छा।',
  },
  strongResult: {
    en: 'If Venus is well-placed: Marriage to an ideal partner, artistic fame and recognition, luxury vehicles and property, international travel for pleasure, successful creative business, harmonious relationships, physical beauty and health, wealth accumulation through art/fashion/entertainment, social elevation, diplomatic success, fulfillment of romantic desires.',
    hi: 'यदि शुक्र सुस्थित है: आदर्श साथी से विवाह, कलात्मक यश और मान्यता, विलासितापूर्ण वाहन और सम्पत्ति, सुख के लिए अन्तर्राष्ट्रीय यात्रा, सफल सृजनात्मक व्यवसाय, सामंजस्यपूर्ण सम्बन्ध, शारीरिक सौन्दर्य और स्वास्थ्य, कला/फैशन/मनोरंजन से धन संचय।',
  },
  weakResult: {
    en: 'If Venus is afflicted: Extramarital affairs, divorce or separation, reproductive health issues, kidney or urinary problems, diabetes, excessive spending on luxury, financial drain through partners, loss of beauty or youth-related confidence, artistic failure or creative blocks, scandal related to relationships.',
    hi: 'यदि शुक्र पीड़ित है: विवाहेतर सम्बन्ध, तलाक या विछोह, प्रजनन स्वास्थ्य समस्याएँ, वृक्क या मूत्र समस्याएँ, मधुमेह, विलासिता पर अत्यधिक खर्च, साथियों से आर्थिक हानि, सौन्दर्य या युवा-सम्बन्धी आत्मविश्वास की हानि, कलात्मक विफलता।',
  },
};

// ─── Remedies ──────────────────────────────────────────────────────────
const REMEDIES = {
  mantra: { text: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', transliteration: 'Om Draam Dreem Draum Sah Shukraya Namah', count: '20,000 or 16,000 times in 40 days', en: 'The Shukra Beej Mantra — chant on Fridays facing south-east, preferably at sunrise or sunset wearing white clothes', hi: 'शुक्र बीज मन्त्र — शुक्रवार को दक्षिण-पूर्व की ओर मुख करके, सूर्योदय या सूर्यास्त पर श्वेत वस्त्र पहनकर जाप करें' },
  gemstone: { en: 'Diamond (Heera) — set in platinum or white gold, worn on the ring finger or middle finger of the right hand on a Friday during Shukla Paksha in Venus\'s Hora. Minimum 0.5 carats. Must touch the skin. Alternatives: White Sapphire, Zircon, or Opal for those who cannot afford diamond.', hi: 'हीरा — प्लैटिनम या श्वेत स्वर्ण में जड़ित, शुक्रवार को शुक्ल पक्ष में शुक्र की होरा में दाहिने हाथ की अनामिका या मध्यमा में धारण करें। न्यूनतम 0.5 कैरेट। विकल्प: श्वेत नीलम, जिर्कॉन या ओपल।' },
  charity: { en: 'Donate white clothes, rice, sugar, camphor, white flowers, perfume, silver, or ghee on Fridays. Feed white cows. Support women\'s education and empowerment.', hi: 'शुक्रवार को श्वेत वस्त्र, चावल, शर्करा, कपूर, श्वेत पुष्प, इत्र, चाँदी या घी दान करें। श्वेत गायों को भोजन कराएँ। महिला शिक्षा और सशक्तिकरण का समर्थन करें।' },
  fasting: { en: 'Friday fasting — eat only one meal of white foods (rice, milk, curd, sugar). Some traditions recommend eating only fruits until sunset.', hi: 'शुक्रवार का उपवास — केवल एक भोजन श्वेत खाद्य पदार्थों का (चावल, दूध, दही, शर्करा)। कुछ परम्पराएँ सूर्यास्त तक केवल फल खाने की सलाह देती हैं।' },
  worship: { en: 'Visit Lakshmi or Devi temples on Fridays. Recite Lakshmi Stotra, Shri Suktam, or Soundarya Lahari. Offer white flowers, rice, and sweets to Goddess Lakshmi. Light a ghee lamp on Friday evening.', hi: 'शुक्रवार को लक्ष्मी या देवी मन्दिर जाएँ। लक्ष्मी स्तोत्र, श्री सूक्तम् या सौन्दर्य लहरी का पाठ करें। देवी लक्ष्मी को श्वेत पुष्प, चावल और मिठाई अर्पित करें। शुक्रवार सन्ध्या को घी का दीपक जलाएँ।' },
  yantra: { en: 'Shukra Yantra — a 5×5 magic square. Install on a silver plate, worship on Fridays with white flowers and camphor.', hi: 'शुक्र यन्त्र — 5×5 जादुई वर्ग। चाँदी के पत्र पर स्थापित करें, शुक्रवार को श्वेत पुष्प और कपूर से पूजन करें।' },
  dietary: { en: 'Dietary remedies: White foods — rice, milk, curd, white butter, coconut, sugar, kheer (rice pudding), and white sesame. Friday meals should emphasize white and sweet foods. Venus rules reproductive health — foods rich in zinc and healthy fats support Venus\'s significations. Saffron in warm milk on Friday evenings strengthens Venus (saffron connects to both Venus and Jupiter). Avoid excessively spicy or sour foods during Venus dasha. Rose petal jam (gulkand) is a classical Venus food — cooling, sweet, and beautifying.', hi: 'आहार उपाय: श्वेत खाद्य — चावल, दूध, दही, सफेद मक्खन, नारियल, शर्करा, खीर और सफेद तिल। शुक्रवार का भोजन श्वेत और मीठे खाद्य पर जोर। शुक्र प्रजनन स्वास्थ्य शासित — जिंक और स्वस्थ वसा समृद्ध भोजन शुक्र के कारकत्व का समर्थन। शुक्रवार सन्ध्या गरम दूध में केसर शुक्र बलवान करता है। शुक्र दशा में अत्यधिक तीखे या खट्टे भोजन से बचें। गुलकन्द शास्त्रीय शुक्र भोजन।' },
  colorTherapy: { en: 'Color therapy: Wear white, cream, pastel pink, or iridescent colors on Fridays. The bedroom should have soft, luxurious textures and light colors — Venus rules the bedroom. Avoid harsh, dark colors in intimate spaces. White flowers (jasmine, tuberose, lily) in the bedroom or on the dressing table strengthen Venus. Silver jewelry carries Venus\'s vibration. Rose quartz crystal in the bedroom enhances Venus\'s energy for relationships. Ensure your wardrobe includes high-quality fabrics that feel good against the skin — Venus appreciates texture as much as color.', hi: 'रंग चिकित्सा: शुक्रवार को श्वेत, क्रीम, हल्का गुलाबी या इन्द्रधनुषी रंग पहनें। शयनकक्ष में मुलायम, विलासितापूर्ण बनावट और हल्के रंग — शुक्र शयनकक्ष शासित करता है। अन्तरंग स्थानों में कठोर, अन्धेरे रंगों से बचें। शयनकक्ष में श्वेत पुष्प (चमेली, रजनीगन्धा) शुक्र बलवान करते हैं। चाँदी के आभूषण शुक्र का स्पन्दन वहन करते हैं। शयनकक्ष में रोज़ क्वार्ट्ज़ सम्बन्धों के लिए शुक्र ऊर्जा बढ़ाता है।' },
  behavioral: { en: 'Behavioral remedies (most powerful for Venus): Cultivate genuine appreciation for beauty — visit art galleries, listen to live music, spend time in gardens. Treat your spouse or partner with respect and tenderness — Venus weakens when intimacy is neglected. Support women\'s causes through donation or volunteer work. Learn a creative skill — singing, painting, dancing, cooking, or instrument playing. Keep your living space clean, fragrant, and aesthetically pleasing — a cluttered, ugly home weakens Venus. Practice self-care — grooming, skincare, and dressing well are not vanity but Venus worship. Maintain sexual health and intimacy in marriage. Never disrespect or exploit women.', hi: 'व्यवहारिक उपाय (शुक्र के लिए सबसे शक्तिशाली): सौन्दर्य के प्रति सच्ची सराहना विकसित करें — कला दीर्घा जाएँ, जीवित संगीत सुनें, बागों में समय बिताएँ। जीवनसाथी या साथी से सम्मान और कोमलता से व्यवहार — अन्तरंगता उपेक्षित होने पर शुक्र दुर्बल। महिला कारणों का समर्थन। सृजनात्मक कौशल सीखें — गायन, चित्रकला, नृत्य। रहने की जगह स्वच्छ, सुगन्धित और सौन्दर्यपरक रखें। आत्म-देखभाल — सज्जा और अच्छे वस्त्र शुक्र पूजा हैं।' },
  timing: { en: 'Timing for mantra recitation: Friday during Venus Hora (calculate based on sunrise — Venus Hora is the first hora after sunrise on Fridays). Sunrise or sunset hours are most auspicious for Venus mantras — Venus is literally the morning/evening star. Face south-east (Agneya — Venus\'s direction). The 40-day mandala should begin on a Friday in Shukla Paksha when Venus is not combust and not retrograde. Friday during Purva Phalguni or Bharani Nakshatra is especially powerful for Venus remedies. Full Moon Fridays (Purnima on Shukravara) are the most auspicious.', hi: 'मन्त्र जाप का समय: शुक्रवार को शुक्र होरा में (सूर्योदय से गणना — शुक्रवार को सूर्योदय के बाद पहली होरा शुक्र की)। सूर्योदय या सूर्यास्त शुक्र मन्त्रों के लिए सबसे शुभ — शुक्र शाब्दिक रूप से प्रातः/सायं तारा। आग्नेय (दक्षिण-पूर्व — शुक्र की दिशा) की ओर मुख। 40-दिवसीय मण्डल शुक्ल पक्ष में शुक्रवार से शुरू जब शुक्र अस्त या वक्री न हो। पूर्वा फाल्गुनी या भरणी नक्षत्र में शुक्रवार विशेष शक्तिशाली। पूर्णिमा शुक्रवार सबसे शुभ।' },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  origin: {
    en: 'Shukracharya is the son of the great sage Bhrigu and is the preceptor (Guru) of the Asuras — the counterpart to Brihaspati who teaches the Devas. He possesses the Sanjeevani Vidya — the knowledge of reviving the dead — which made the Asuras nearly invincible in their wars against the Devas. This is why Venus is called the "morning star" and "evening star" — like the Asuras, it appears to die (set) and rise again. The eternal rivalry between Shukracharya (Venus) and Brihaspati (Jupiter) mirrors the cosmic tension between material desire and spiritual aspiration. Shukra lost one eye when Vishnu in the Vamana avatar tricked King Bali — Shukra tried to block the water pot but Vishnu pierced it with a straw, blinding one eye. This is why Venus is associated with one-eyed perception — seeing beauty but missing the complete truth.',
    hi: 'शुक्राचार्य महर्षि भृगु के पुत्र और असुरों के गुरु (आचार्य) हैं — देवताओं को पढ़ाने वाले बृहस्पति के प्रतिपक्षी। उनके पास संजीवनी विद्या — मृतकों को पुनर्जीवित करने का ज्ञान — जिसने असुरों को देवताओं के विरुद्ध युद्ध में लगभग अजेय बनाया। शुक्राचार्य (शुक्र) और बृहस्पति (गुरु) की शाश्वत प्रतिद्वन्द्विता भौतिक इच्छा और आध्यात्मिक आकांक्षा के बीच ब्रह्माण्डीय तनाव को प्रतिबिम्बित करती है। वामन अवतार में विष्णु ने राजा बलि को छलने पर शुक्र ने जलपात्र को रोकने का प्रयास किया, किन्तु विष्णु ने तिनके से उनकी एक आँख भेद दी।',
  },
  temples: {
    en: 'Major Shukra temples: Shukra Peyarchi Temple, Kancheepuram (Tamil Nadu) — the primary Navagraha Shukra temple; Thiru Pughoor Agneeswarar Temple — associated with Venus in the Navagraha circuit; Kamakhya Temple (Guwahati, Assam) — the great Shakti Peetha associated with feminine creative power; All Lakshmi temples — Lakshmi is Venus\'s presiding deity, and Friday worship at any Lakshmi temple strengthens Venus.',
    hi: 'प्रमुख शुक्र मन्दिर: शुक्र पेयर्ची मन्दिर, काञ्चीपुरम् (तमिलनाडु) — प्राथमिक नवग्रह शुक्र मन्दिर; तिरु पुघूर अग्नीश्वरर मन्दिर — नवग्रह परिपथ में शुक्र से सम्बद्ध; कामाख्या मन्दिर (गुवाहाटी, असम) — स्त्री सृजनात्मक शक्ति से सम्बद्ध महान शक्ति पीठ; सभी लक्ष्मी मन्दिर — लक्ष्मी शुक्र की अधिष्ठात्री देवी, शुक्रवार की पूजा शुक्र को बलवान करती है।',
  },
  stotra: {
    en: 'The Shukra Stotra from the Navagraha Stotram: "Hima Kunda Mrinalaabham Daityaanam Paramam Gurum, Sarva Shastra Pravaktaaram Bhaargavam Pranamaamyaham." Meaning: "I bow to Shukra, who shines like a snow-white jasmine and a lotus stalk, who is the supreme teacher of the Asuras, who expounds all sciences, and who is the son of Bhrigu." The Soundarya Lahari by Adi Shankaracharya is also considered a powerful Venus remedy.',
    hi: 'नवग्रह स्तोत्रम् से शुक्र स्तोत्र: "हिमकुन्दमृणालाभं दैत्यानां परमं गुरुम्, सर्वशास्त्रप्रवक्तारं भार्गवं प्रणमाम्यहम्।" अर्थ: "मैं शुक्र को नमन करता हूँ जो हिमकुन्द और कमलनाल के समान चमकते हैं, जो असुरों के परम गुरु हैं, जो सभी शास्त्रों के प्रवक्ता हैं, और जो भृगु के पुत्र हैं।" आदि शंकराचार्य का सौन्दर्य लहरी भी शक्तिशाली शुक्र उपाय माना जाता है।',
  },
};

// ─── Relationships ─────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'King vs. minister of pleasures. Sun represents duty and ego; Venus represents desire and beauty. Their conjunction creates combustion — Venus within ~10° of Sun loses its romantic and artistic significations. This is the most common combustion in charts and weakens marriage prospects.', hi: 'राजा बनाम सुख-मन्त्री। सूर्य कर्तव्य और अहंकार; शुक्र इच्छा और सौन्दर्य। इनकी युति अस्त बनाती है — ~10° के भीतर शुक्र प्रेम और कलात्मक कारकत्व खो देता है। यह कुण्डलियों में सबसे सामान्य अस्त है और विवाह सम्भावनाओं को कमज़ोर करता है।' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, relation: { en: 'Enemy', hi: 'शत्रु' }, note: { en: 'Venus views Moon as an enemy — material beauty vs. emotional need. Their conjunction creates a highly emotional, romantic, and aesthetically sensitive nature. Can indicate luxury-loving tendencies that override practical considerations. The native seeks comfort through beautiful possessions.', hi: 'शुक्र चन्द्र को शत्रु मानता है — भौतिक सौन्दर्य बनाम भावनात्मक आवश्यकता। इनकी युति अत्यन्त भावनात्मक, रोमांटिक और सौन्दर्य-संवेदनशील स्वभाव बनाती है। विलासिता-प्रेम व्यावहारिक विचारों पर हावी हो सकता है।' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Passion meets beauty. Mars-Venus conjunction creates intense sexual attraction and passionate relationships. Can indicate a spouse who is aggressive or athletic. The creative fire is powerful — dance, martial arts, and physical performance arts. When harmonized: passionate love. When afflicted: obsession, jealousy, and conflict in relationships.', hi: 'उत्कटता सौन्दर्य से मिलती है। मंगल-शुक्र युति तीव्र यौन आकर्षण और उत्कट सम्बन्ध बनाती है। जीवनसाथी आक्रामक या खिलाड़ी हो सकता है। सामंजस्य होने पर: उत्कट प्रेम। पीड़ित होने पर: जुनून, ईर्ष्या और सम्बन्धों में संघर्ष।' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Beauty meets intellect. Venus-Mercury conjunction produces artistic communicators — writers of love poetry, designers, advertising creatives, and skilled negotiators. Speech is sweet and charming. Can indicate a youthful appearance. The combination excels in fashion journalism, art criticism, and luxury marketing.', hi: 'सौन्दर्य बुद्धि से मिलता है। शुक्र-बुध युति कलात्मक संवादक उत्पन्न करती है — प्रेम काव्य लेखक, डिज़ाइनर, विज्ञापन रचनाकार। वाणी मधुर और आकर्षक। फैशन पत्रकारिता, कला समीक्षा और विलासिता विपणन में उत्कृष्ट।' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Asura Guru meets Deva Guru. Venus views Jupiter as neutral, but their mythological rivalry (Shukracharya vs Brihaspati) adds complexity. Their conjunction can produce the highest art — beauty infused with spiritual meaning. Or it can create conflict between desire and dharma, pleasure and duty. Wealth is generally enhanced by this combination.', hi: 'असुर गुरु देव गुरु से मिलता है। शुक्र गुरु को सम मानता है, किन्तु पौराणिक प्रतिद्वन्द्विता जटिलता जोड़ती है। इनकी युति उच्चतम कला — आध्यात्मिक अर्थ से ओतप्रोत सौन्दर्य उत्पन्न कर सकती है। या इच्छा और धर्म, सुख और कर्तव्य के बीच संघर्ष।' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, relation: { en: 'Friend', hi: 'मित्र' }, note: { en: 'Structure meets beauty — discipline applied to art creates masterpieces. Venus-Saturn conjunction often delays marriage but produces a stable, long-lasting partnership when it finally arrives. The native\'s artistic sensibility matures with age. Can indicate love with an older partner, or beauty in austerity. Saturn\'s patience combined with Venus\'s aesthetics creates architects, classical musicians, and timeless fashion designers.', hi: 'संरचना सौन्दर्य से मिलती है — कला में अनुशासन उत्कृष्ट कृतियाँ बनाता है। शुक्र-शनि युति प्रायः विवाह में विलम्ब करती है किन्तु अन्ततः स्थिर, दीर्घस्थायी साझेदारी। कलात्मक संवेदनशीलता आयु के साथ परिपक्व। शनि का धैर्य शुक्र के सौन्दर्य के साथ वास्तुकार, शास्त्रीय संगीतकार बनाता है।' } },
  { planet: { en: 'Rahu', hi: 'राहु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Obsessive desire. Rahu amplifies Venus\'s cravings to extreme levels — the native may pursue forbidden pleasures, unconventional relationships, or foreign luxury. Can produce celebrities with scandalous love lives. Artistic innovation through breaking conventions. Wealth through technology-meets-luxury. The native\'s desires are magnified beyond reason.', hi: 'जुनूनी इच्छा। राहु शुक्र की लालसा को चरम स्तर तक बढ़ाता है — निषिद्ध सुख, अपरम्परागत सम्बन्ध या विदेशी विलासिता। परम्परा तोड़कर कलात्मक नवाचार। प्रौद्योगिकी-विलासिता से धन। जातक की इच्छाएँ तर्क से परे बढ़ जाती हैं।' } },
  { planet: { en: 'Ketu', hi: 'केतु' }, relation: { en: 'Neutral', hi: 'सम' }, note: { en: 'Detachment from desire. Ketu strips Venus of material craving, creating a native who has experienced pleasure fully and now seeks something beyond. Can indicate past-life mastery of art or love. Spiritual art, ascetic beauty, and renunciation of luxury. Marriage may feel destined but also involves karmic lessons. The native finds beauty in simplicity.', hi: 'इच्छा से वैराग्य। केतु शुक्र की भौतिक लालसा छीन लेता है, ऐसा जातक बनाता है जिसने सुख का पूर्ण अनुभव किया है और अब कुछ परे चाहता है। पूर्वजन्म में कला या प्रेम की दक्षता। आध्यात्मिक कला, तपस्वी सौन्दर्य। सरलता में सौन्दर्य पाता है।' } },
];

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/grahas', label: { en: 'All Nine Grahas', hi: 'सभी नवग्रह' } },
  { href: '/learn/surya', label: { en: 'Surya — The Sun', hi: 'सूर्य' } },
  { href: '/learn/guru', label: { en: 'Guru — Jupiter', hi: 'गुरु' } },
  { href: '/learn/shani', label: { en: 'Shani — Saturn', hi: 'शनि' } },
  { href: '/learn/rashis', label: { en: 'The Twelve Rashis', hi: 'बारह राशियाँ' } },
  { href: '/learn/dashas', label: { en: 'Vimshottari Dasha System', hi: 'विंशोत्तरी दशा पद्धति' } },
  { href: '/learn/combustion', label: { en: 'Planetary Combustion', hi: 'ग्रह अस्त' } },
  { href: '/learn/compatibility', label: { en: 'Marriage Compatibility', hi: 'विवाह मिलान' } },
  { href: '/learn/remedies', label: { en: 'Remedial Measures', hi: 'उपाय' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function ShukraPage() {
  const locale = useLocale();
  const ml = useML(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);

  let section = 0;
  const next = () => ++section;

  const SECTIONS = [
    { id: 'section-1', label: ml({ en: 'Overview', hi: 'परिचय' }) },
    { id: 'section-2', label: ml({ en: 'Astronomy', hi: 'खगोल' }) },
    { id: 'section-3', label: ml({ en: 'Dignities', hi: 'गरिमा' }) },
    { id: 'section-4', label: ml({ en: 'In 12 Signs', hi: '12 राशियों में' }) },
    { id: 'section-5', label: ml({ en: 'In 12 Houses', hi: '12 भावों में' }) },
    { id: 'section-6', label: ml({ en: 'Dasha', hi: 'दशा' }) },
    { id: 'section-7', label: ml({ en: 'Yogas', hi: 'योग' }) },
    { id: 'section-8', label: ml({ en: 'Practical', hi: 'व्यावहारिक' }) },
    { id: 'section-9', label: ml({ en: 'Relationships', hi: 'सम्बन्ध' }) },
    { id: 'section-10', label: ml({ en: 'Remedies', hi: 'उपाय' }) },
    { id: 'section-11', label: ml({ en: 'Mythology', hi: 'पौराणिक कथा' }) },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graha-venus/15 border border-graha-venus/30 mb-4">
          <span className="text-4xl">&#9792;</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Shukra — Venus', hi: 'शुक्र — शुक्र ग्रह' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'Kalatrakaaraka — significator of marriage, love, beauty, art, and material luxury in Vedic astrology. The Asura Guru who holds the secret of immortality.', hi: 'कलत्रकारक — वैदिक ज्योतिष में विवाह, प्रेम, सौन्दर्य, कला और भौतिक विलासिता का कारक। असुर गुरु जो अमरत्व का रहस्य रखता है।' })}
        </p>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Overview & Nature ── */}
      <LessonSection number={next()} title={ml({ en: 'Overview & Nature', hi: 'परिचय एवं स्वभाव' })}>
        <p style={bf}>{ml({ en: 'Shukra (Venus) is the second-greatest natural benefic in Vedic astrology — the planet of love, beauty, art, and material luxury. As Kalatrakaaraka (significator of marriage), Venus governs the most intimate relationships in human life. As Daityaguru (preceptor of the Asuras), he represents worldly wisdom — the intelligence that creates civilization, culture, and refinement. Venus rules the creative impulse that transforms raw material into art, raw attraction into love, and raw desire into refined pleasure. In a birth chart, Venus reveals where and how the native will experience love, beauty, wealth through luxury, and artistic expression. Venus also signifies semen (shukra dhatu) in Ayurveda — the most refined tissue that carries the essence of vitality.', hi: 'शुक्र वैदिक ज्योतिष में दूसरा सबसे बड़ा स्वाभाविक शुभ ग्रह है — प्रेम, सौन्दर्य, कला और भौतिक विलासिता का ग्रह। कलत्रकारक (विवाह का कारक) के रूप में शुक्र मानव जीवन के सबसे अन्तरंग सम्बन्धों को शासित करता है। दैत्यगुरु के रूप में वह सांसारिक ज्ञान — सभ्यता, संस्कृति और परिष्कार बनाने वाली बुद्धि का प्रतिनिधित्व करता है। शुक्र उस सृजनात्मक प्रेरणा को शासित करता है जो कच्चे माल को कला में, कच्चे आकर्षण को प्रेम में रूपान्तरित करती है।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGNIFICATIONS).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-dark text-xs uppercase tracking-wider">{key}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Visheshaphala" />
      </LessonSection>

      {/* ── 2. Astronomical Profile ── */}
      <LessonSection number={next()} title={ml({ en: 'Astronomical Profile', hi: 'खगोलीय परिचय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Venus\'s astronomical behavior explains many of its astrological signatures — the most frequent combustion, the rarest retrograde among inner planets, and the mesmerizing Venus Pentagram that ancient civilizations tracked for millennia.', hi: 'शुक्र का खगोलीय व्यवहार इसके अनेक ज्योतिषीय लक्षणों को स्पष्ट करता है — सबसे बार-बार अस्त, आन्तरिक ग्रहों में सबसे दुर्लभ वक्री, और वह मनमोहक शुक्र पंचकोण जिसे प्राचीन सभ्यताओं ने सहस्राब्दियों तक ट्रैक किया।' })}</p>
        <div className="space-y-3">
          {Object.entries(ASTRONOMICAL).map(([key, val]) => (
            <div key={key} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-venus/10 rounded-xl p-4">
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="Surya Siddhanta" chapter="Venus Orbital Parameters" />
      </LessonSection>

      {/* ── 3. Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Dignities & Strength', hi: 'गरिमा एवं बल' })}>
        <p style={bf}>{ml({ en: 'Venus\'s dignity determines the quality of love, beauty, and artistic expression in the native\'s life. Exalted in Pisces at 27°, Venus achieves its highest expression — selfless love, transcendent art, and beauty that touches the divine. Debilitated in Virgo at 27°, Venus becomes hyper-critical of beauty, analyzing love until the joy is gone. In its own signs (Taurus and Libra), Venus is the master of its domain — sensual pleasure in Taurus, refined harmony in Libra.', hi: 'शुक्र की गरिमा जातक के जीवन में प्रेम, सौन्दर्य और कलात्मक अभिव्यक्ति की गुणवत्ता निर्धारित करती है। मीन में 27° पर उच्च, शुक्र अपनी उच्चतम अभिव्यक्ति प्राप्त करता है — निःस्वार्थ प्रेम, उत्कृष्ट कला और दिव्य सौन्दर्य। कन्या में 27° पर नीच, शुक्र सौन्दर्य की अति-आलोचना करता है। वृषभ और तुला में शुक्र अपने क्षेत्र का स्वामी।' })}</p>
        <div className="space-y-2 mt-4">
          {Object.entries(DIGNITIES).map(([key, val]) => (
            <div key={key} className="flex items-start gap-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-primary text-sm font-bold min-w-[120px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-text-primary text-sm" style={bf}>{ml(val)}</span>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha" />
      </LessonSection>

      {/* ── 4. Venus in Each Sign ── */}
      <LessonSection number={next()} title={ml({ en: 'Venus in the Twelve Signs', hi: 'बारह राशियों में शुक्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Venus completes one orbit around the Sun in about 225 days but spends variable time in each sign (15-60 days) due to its elongation from the Sun. It is never more than ~47° away from the Sun, which is why Venus combustion is the most common planetary combustion. The sign placement colors how the native experiences love, creates art, and pursues beauty.', hi: 'शुक्र लगभग 225 दिनों में सूर्य की एक परिक्रमा पूरी करता है किन्तु सूर्य से दूरी के कारण प्रत्येक राशि में अलग-अलग समय (15-60 दिन) बिताता है। यह सूर्य से कभी ~47° से अधिक दूर नहीं होता, इसीलिए शुक्र अस्त सबसे सामान्य ग्रह अस्त है। राशि स्थिति रंगती है कि जातक प्रेम, कला और सौन्दर्य कैसे अनुभव करता है।' })}</p>
        {VENUS_IN_SIGNS.map((s, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-venus/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(s.sign)}</span>
              {s.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  s.dignity === 'Exalted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  s.dignity === 'Debilitated' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  s.dignity.includes('Own sign') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{s.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(s.effect)}</p>
          </div>
        ))}
      </LessonSection>

      {/* ── 5. Venus in Each House ── */}
      <LessonSection number={next()} title={ml({ en: 'Venus in the Twelve Houses', hi: 'बारह भावों में शुक्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Venus aspects the 7th house from its placement — always connecting to partnerships. In Kendras (1, 4, 7, 10), Venus can form Malavya Yoga (one of the five Mahapurusha Yogas) if in its own sign or exalted, bestowing exceptional beauty, luxury, and artistic talent. In Trikonas, Venus enhances dharma through aesthetic refinement. Even in Dusthanas, Venus\'s benefic nature often mitigates negative effects.', hi: 'शुक्र अपनी स्थिति से 7वें भाव को देखता है — सदा साझेदारियों से जुड़ता है। केन्द्रों (1, 4, 7, 10) में शुक्र मालव्य योग बना सकता है यदि स्वराशि या उच्च में, असाधारण सौन्दर्य, विलासिता और कलात्मक प्रतिभा प्रदान करता है। त्रिकोणों में सौन्दर्य परिष्कार से धर्म की वृद्धि। दुस्थानों में भी शुक्र का शुभ स्वभाव नकारात्मक प्रभावों को कम करता है।' })}</p>
        {VENUS_IN_HOUSES.map((h) => (
          <div key={h.house} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-venus/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-graha-venus/15 border border-graha-venus/30 flex items-center justify-center text-graha-venus text-xs font-bold">{h.house}</span>
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(h.name)}</span>
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(h.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala (Effects of Planets in Houses)" />
      </LessonSection>

      {/* ── 6. Dasha Period ── */}
      <LessonSection number={next()} title={ml({ en: 'Shukra Mahadasha (20 Years)', hi: 'शुक्र महादशा (20 वर्ष)' })}>
        <p style={bf}>{ml(DASHA.overview)}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Venus Dasha', hi: 'बलवान शुक्र दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.strongResult)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Venus Dasha', hi: 'दुर्बल शुक्र दशा' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(DASHA.weakResult)}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 7. Notable Yogas ── */}
      <LessonSection number={next()} title={ml({ en: 'Notable Yogas Involving Venus', hi: 'शुक्र से सम्बन्धित प्रमुख योग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Venus participates in yogas that govern marriage, wealth, beauty, and creative expression. These yogas are especially important for assessing the quality of romantic life and artistic potential.', hi: 'शुक्र उन योगों में भाग लेता है जो विवाह, धन, सौन्दर्य और सृजनात्मक अभिव्यक्ति को शासित करते हैं। ये योग प्रेम जीवन और कलात्मक क्षमता की गुणवत्ता आकलन के लिए विशेष महत्त्वपूर्ण हैं।' })}</p>
        {NOTABLE_YOGAS.map((yoga, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/25 via-[#1a1040]/30 to-[#0a0e27] border border-graha-venus/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-base mb-2" style={hf}>{ml(yoga.name)}</h4>
            <div className="space-y-2">
              <div>
                <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{ml({ en: 'Condition', hi: 'शर्त' })}</span>
                <p className="text-text-primary text-sm mt-1" style={bf}>{ml(yoga.condition)}</p>
              </div>
              <div>
                <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{ml({ en: 'Effect', hi: 'फल' })}</span>
                <p className="text-text-primary text-sm mt-1" style={bf}>{ml(yoga.effect)}</p>
              </div>
              <div>
                <span className="text-gold-dark text-xs uppercase tracking-wider font-bold">{ml({ en: 'Strength Assessment', hi: 'बल आकलन' })}</span>
                <p className="text-text-secondary text-sm mt-1" style={bf}>{ml(yoga.strength)}</p>
              </div>
            </div>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 34-36 — Yoga Adhyaya" />
      </LessonSection>

      {/* ── 8. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Venus assessment requires looking beyond the Rashi chart — the Navamsha (D-9) is equally important for marriage, and Venus combustion is so common that many people carry this affliction without knowing it.', hi: 'शुक्र आकलन राशि कुण्डली से परे देखना चाहता है — विवाह के लिए नवमांश (D-9) समान रूप से महत्त्वपूर्ण, और शुक्र अस्त इतना सामान्य कि कई लोग बिना जाने यह पीड़ा वहन करते हैं।' })}</p>

        <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-graha-venus/10 rounded-xl p-5 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'How to Assess Venus\'s Strength', hi: 'शुक्र के बल का आकलन कैसे करें' })}</h4>
          <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.assessStrength)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strong Venus Indicators', hi: 'बलवान शुक्र के संकेत' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PRACTICAL.strongIndicators)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weak Venus Indicators', hi: 'दुर्बल शुक्र के संकेत' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PRACTICAL.weakIndicators)}</p>
          </div>
        </div>

        <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'When to Seek Remedies', hi: 'उपाय कब करें' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(PRACTICAL.whenToRemediate)}</p>
        </div>

        <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(PRACTICAL.misconceptions)}</p>
        </div>

        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-graha-venus/15 rounded-xl p-5">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Malavya Yoga — Deep Dive', hi: 'मालव्य योग — गहन विश्लेषण' })}</h4>
          <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(PRACTICAL.malavyaDetail)}</p>
        </div>
      </LessonSection>

      {/* ── 9. Planetary Relationships ── */}
      <LessonSection number={next()} title={ml({ en: 'Relationships with Other Planets', hi: 'अन्य ग्रहों के साथ सम्बन्ध' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Venus\'s friendships and enmities shape marriage compatibility, artistic talent, and material prosperity. The Venus-Mercury friendship creates Lakshmi Yoga (wealth through art and commerce). The Venus-Saturn friendship produces enduring beauty. The Venus-Sun and Venus-Moon enmities explain why combustion and emotional turbulence often afflict love in charts.', hi: 'शुक्र की मैत्री और शत्रुता विवाह संगतता, कलात्मक प्रतिभा और भौतिक समृद्धि को आकार देती है। शुक्र-बुध मैत्री लक्ष्मी योग बनाती है (कला और वाणिज्य से धन)। शुक्र-शनि मैत्री चिरस्थायी सौन्दर्य उत्पन्न करती है। शुक्र-सूर्य और शुक्र-चन्द्र शत्रुता समझाती है कि अस्त और भावनात्मक उथल-पुथल प्रेम को क्यों पीड़ित करती है।' })}</p>
        <div className="space-y-3">
          {RELATIONSHIPS.map((r, i) => (
            <div key={i} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-gold-light font-bold text-sm" style={hf}>{ml(r.planet)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  ml(r.relation).includes('Friend') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  ml(r.relation).includes('Enemy') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>{ml(r.relation)}</span>
              </div>
              <p className="text-text-secondary text-sm" style={bf}>{ml(r.note)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.23-26 — Naisargika Maitri" />
      </LessonSection>

      {/* ── 10. Remedies ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies for Venus', hi: 'शुक्र के उपाय' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Remedies are prescribed when Venus is weak, afflicted, combust, or poorly placed. A strong Venus does not need remedies — and wearing Diamond with a strong Venus can amplify luxury attachment and sensual excess. Venus combustion is the most common affliction (Venus is never far from the Sun). Consult a qualified Jyotishi before wearing gemstones.', hi: 'उपाय तब निर्धारित किये जाते हैं जब शुक्र दुर्बल, पीड़ित, अस्त या अशुभ स्थान पर हो। बलवान शुक्र को उपाय की आवश्यकता नहीं — और बलवान शुक्र के साथ हीरा पहनना विलासिता आसक्ति और कामुक अतिरेक बढ़ा सकता है। शुक्र अस्त सबसे सामान्य पीड़ा। रत्न धारण से पूर्व योग्य ज्योतिषी से परामर्श करें।' })}</p>

        {/* Mantra */}
        <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-graha-venus/15 rounded-xl p-5 mb-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Beej Mantra', hi: 'बीज मन्त्र' })}</h4>
          <p className="text-gold-primary text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{REMEDIES.mantra.text}</p>
          <p className="text-text-secondary text-xs italic mb-2">{REMEDIES.mantra.transliteration}</p>
          <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES.mantra)}</p>
          <p className="text-text-secondary text-xs mt-1">{ml({ en: `Count: ${REMEDIES.mantra.count}`, hi: `जाप: ${REMEDIES.mantra.count}` })}</p>
        </div>

        {/* Other remedies */}
        {[
          { key: 'gemstone', title: { en: 'Gemstone — Diamond (Heera)', hi: 'रत्न — हीरा' } },
          { key: 'charity', title: { en: 'Charity (Dana)', hi: 'दान' } },
          { key: 'fasting', title: { en: 'Fasting (Upavasa)', hi: 'उपवास' } },
          { key: 'worship', title: { en: 'Worship & Puja', hi: 'पूजा एवं उपासना' } },
          { key: 'yantra', title: { en: 'Shukra Yantra', hi: 'शुक्र यन्त्र' } },
          { key: 'dietary', title: { en: 'Dietary Recommendations', hi: 'आहार अनुशंसाएँ' } },
          { key: 'colorTherapy', title: { en: 'Color Therapy', hi: 'रंग चिकित्सा' } },
          { key: 'behavioral', title: { en: 'Behavioral Remedies', hi: 'व्यवहारिक उपाय' } },
          { key: 'timing', title: { en: 'Optimal Timing for Mantra', hi: 'मन्त्र जाप का उत्तम समय' } },
        ].map(({ key, title }) => (
          <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4 mb-3">
            <h4 className="text-gold-light font-bold text-sm mb-1" style={hf}>{ml(title)}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(REMEDIES[key as keyof typeof REMEDIES] as ML)}</p>
          </div>
        ))}
        <WhyItMatters locale={locale}>
          {ml({ en: 'Venus remedies work best when combined with cultivating genuine appreciation for beauty, practicing generosity toward women and artists, maintaining marital fidelity, and developing artistic skills. The deepest Shukra remedy is to create beauty — in your home, in your relationships, and in the world.', hi: 'शुक्र के उपाय सौन्दर्य के प्रति सच्ची सराहना, महिलाओं और कलाकारों के प्रति उदारता, वैवाहिक निष्ठा और कलात्मक कौशल विकसित करने के साथ सबसे अच्छे काम करते हैं। सबसे गहरा शुक्र उपाय सौन्दर्य का सृजन करना है — अपने घर, सम्बन्धों और संसार में।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 11. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Worship', hi: 'पौराणिक कथा एवं उपासना' })}>
        <div className="space-y-4">
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Origin Story', hi: 'उत्पत्ति कथा' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.origin)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Shukra Stotra & Soundarya Lahari', hi: 'शुक्र स्तोत्र एवं सौन्दर्य लहरी' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.stotra)}</p>
          </div>
          <div>
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Sacred Temples', hi: 'पवित्र मन्दिर' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.temples)}</p>
          </div>
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Graha Characteristics" />
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Venus is the Kalatrakaaraka — significator of marriage, love, beauty, and luxury. Its placement determines the quality of your romantic and aesthetic life.', hi: 'शुक्र कलत्रकारक है — विवाह, प्रेम, सौन्दर्य और विलासिता का कारक। इसकी स्थिति आपके प्रेम और सौन्दर्य जीवन की गुणवत्ता निर्धारित करती है।' }),
        ml({ en: 'Exalted in Pisces (27°), debilitated in Virgo (27°). Own signs: Taurus & Libra. Moolatrikona: Libra 0°-5°.', hi: 'मीन 27° में उच्च, कन्या 27° में नीच। स्वराशि: वृषभ एवं तुला। मूलत्रिकोण: तुला 0°-5°।' }),
        ml({ en: 'Friends: Mercury, Saturn. Enemies: Sun, Moon. Neutral: Mars, Jupiter. The Venus-Jupiter rivalry (Asura Guru vs Deva Guru) is mythologically profound.', hi: 'मित्र: बुध, शनि। शत्रु: सूर्य, चन्द्र। सम: मंगल, गुरु। शुक्र-गुरु प्रतिद्वन्द्विता (असुर गुरु बनाम देव गुरु) पौराणिक रूप से गहन।' }),
        ml({ en: 'Mahadasha: 20 years (longest). Remedy: Diamond, Friday fasting, Lakshmi worship, Soundarya Lahari, white flower/rice charity.', hi: 'महादशा: 20 वर्ष (सबसे लम्बी)। उपाय: हीरा, शुक्रवार उपवास, लक्ष्मी पूजा, सौन्दर्य लहरी, श्वेत पुष्प/चावल दान।' }),
      ]} />

      {/* ── Cross-links ── */}
      <div className="mt-12 border-t border-gold-primary/10 pt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4">{ml({ en: 'Explore Further', hi: 'और जानें' })}</h3>
        <div className="flex flex-wrap gap-2">
          {CROSS_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-1.5 text-sm rounded-lg border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-colors" style={bf}>
              {ml(link.label)}
            </Link>
          ))}
        </div>
      </div>
      <SectionNav sections={SECTIONS} />
    </main>
  );
}
