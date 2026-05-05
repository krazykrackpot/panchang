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
  { devanagari: 'मीन', transliteration: 'Mīna', meaning: { en: 'Fish — the sign of two fish swimming in opposite directions', hi: 'मछली — दो विपरीत दिशाओं में तैरती मछलियों की राशि' } },
  { devanagari: 'अन्त्य', transliteration: 'Antya', meaning: { en: 'The final one — last sign of the zodiac cycle', hi: 'अन्तिम — राशिचक्र की अंतिम राशि' } },
  { devanagari: 'गुरुक्षेत्र', transliteration: 'Gurukṣetra', meaning: { en: 'Field of Jupiter — the second domain of the guru', hi: 'गुरु का क्षेत्र — गुरु का द्वितीय स्थान' } },
  { devanagari: 'मोक्षराशि', transliteration: 'Mokṣarāśi', meaning: { en: 'Sign of liberation — where the soul returns to source', hi: 'मोक्ष राशि — जहाँ आत्मा मूल स्रोत में लौटती है' } },
  { devanagari: 'जलराशि', transliteration: 'Jalarāśi', meaning: { en: 'Water sign — the deepest ocean of emotion and spirit', hi: 'जल राशि — भावना और आत्मा का गहनतम सागर' } },
  { devanagari: 'द्विमीन', transliteration: 'Dvimīna', meaning: { en: 'Two fish — dual nature of material and spiritual life', hi: 'दो मछलियाँ — भौतिक और आध्यात्मिक जीवन का द्वैत' } },
];

// ─── Sign Overview ─────────────────────────────────────────────────────
const SIGN_OVERVIEW = {
  element: { en: 'Water (Jala Tattva)', hi: 'जल तत्त्व' },
  modality: { en: 'Mutable (Dvisvabhava — dual-natured)', hi: 'द्विस्वभाव (उभय — दोहरे स्वभाव वाला)' },
  gender: { en: 'Feminine (Stri)', hi: 'स्त्रीलिंग (स्त्री)' },
  ruler: { en: 'Jupiter (Guru/Brihaspati) — co-ruled by Ketu per some traditions', hi: 'गुरु (बृहस्पति) — कुछ परम्पराओं में केतु सह-स्वामी' },
  symbol: { en: 'Two Fish swimming in opposite directions ♓', hi: 'दो विपरीत दिशाओं में तैरती मछलियाँ ♓' },
  degreeRange: { en: '330° to 360° (0°) of the zodiac', hi: 'राशिचक्र के 330° से 360° (0°)' },
  direction: { en: 'North (Uttara)', hi: 'उत्तर दिशा' },
  season: { en: 'Vasanta Ritu (Early Spring)', hi: 'वसन्त ऋतु (प्रारम्भिक बसन्त)' },
  color: { en: 'Sea green / Pale yellow / Iridescent', hi: 'समुद्री हरा / हल्का पीला / इन्द्रधनुषी' },
  bodyPart: { en: 'Feet, lymphatic system, immune system, pineal gland', hi: 'पैर, लसीका तन्त्र, प्रतिरक्षा तन्त्र, पीनियल ग्रन्थि' },
};

// ─── Nakshatras in Meena ───────────────────────────────────────────────
const NAKSHATRAS_IN_SIGN = [
  {
    name: { en: 'Purva Bhadrapada (pada 4)', hi: 'पूर्वभाद्रपद (पद 4)' },
    range: { en: '330°00\' to 333°20\' (pada 4 only in Meena)', hi: '330°00\' से 333°20\' (केवल पद 4 मीन में)' },
    lord: { en: 'Jupiter (Guru)', hi: 'गुरु' },
    nature: { en: 'Purva Bhadrapada\'s fourth pada falls in Meena navamsha — the most transcendent expression of this intensely transformative nakshatra. Here, the scorching fire of radical change is softened by Pisces\' compassionate waters, producing spiritual revolutionaries who transform society through love rather than force. The funeral cot symbol becomes the bed of final surrender — ego death that leads to cosmic rebirth. Monks, mystics, and artists who channel divine inspiration emerge from this narrow but potent sliver.', hi: 'पूर्वभाद्रपद का चौथा पद मीन नवांश में — इस तीव्र परिवर्तनकारी नक्षत्र की सबसे पारलौकिक अभिव्यक्ति। आमूल परिवर्तन की तीक्ष्ण अग्नि मीन के करुणामय जल से कोमल, बल के बजाय प्रेम से समाज बदलने वाले आध्यात्मिक क्रान्तिकारी। अहंकार की मृत्यु ब्रह्मांडीय पुनर्जन्म की ओर। सन्यासी, रहस्यवादी और दिव्य प्रेरणा के कलाकार।' },
  },
  {
    name: { en: 'Uttara Bhadrapada', hi: 'उत्तरभाद्रपद' },
    range: { en: '333°20\' to 346°40\' (all 4 padas in Meena)', hi: '333°20\' से 346°40\' (सभी 4 पद मीन में)' },
    lord: { en: 'Saturn (Shani)', hi: 'शनि' },
    nature: { en: 'Uttara Bhadrapada means "the latter lucky feet" — the nakshatra of deep wisdom earned through endurance, the back of the funeral cot, and the cosmic serpent Ahir Budhnya who lies at the bottom of the ocean of consciousness. Saturn\'s disciplined rulership in Jupiter\'s compassionate water sign creates the deepest spiritual practitioners — those who sustain meditation for decades, endure austerity without complaint, and achieve wisdom through systematic spiritual effort. The native is the silent sage, the patient healer, the counselor who listens without judgment. Sleep and dreams are exceptionally vivid and spiritually significant.', hi: 'उत्तरभाद्रपद का अर्थ है "बाद के भाग्यशाली पद" — सहनशीलता से अर्जित गहन ज्ञान का नक्षत्र। शनि का अनुशासित स्वामित्व गुरु की करुणामय जल राशि में गहनतम आध्यात्मिक साधक — जो दशकों तक ध्यान बनाए रखते हैं, बिना शिकायत तपस्या सहते हैं और व्यवस्थित प्रयास से ज्ञान प्राप्त करते हैं। मौन ऋषि, धैर्यवान चिकित्सक, निर्णय रहित परामर्शदाता। स्वप्न असाधारण रूप से स्पष्ट और आध्यात्मिक रूप से महत्वपूर्ण।' },
  },
  {
    name: { en: 'Revati', hi: 'रेवती' },
    range: { en: '346°40\' to 360°00\' (all 4 padas in Meena)', hi: '346°40\' से 360°00\' (सभी 4 पद मीन में)' },
    lord: { en: 'Mercury (Budha)', hi: 'बुध' },
    nature: { en: 'Revati means "the wealthy one" or "the nourisher" — the final nakshatra of the zodiac, representing the completion of the soul\'s journey and the nurturing of all life before the cycle begins anew. Mercury\'s intellectual rulership in Jupiter\'s spiritual water sign creates articulate visionaries who can translate mystical experience into comprehensible language. The deity Pushan (the shepherd of souls, guide of the dead to the afterlife) presides here. This nakshatra produces compassionate communicators, translators, and those who guide others across thresholds — therapists, hospice workers, midwives, and spiritual teachers who help others transition between states of being.', hi: 'रेवती का अर्थ है "धनवान" या "पोषक" — राशिचक्र का अंतिम नक्षत्र, आत्मा की यात्रा की पूर्णता और चक्र पुनः आरम्भ से पहले समस्त जीवन का पोषण। गुरु की आध्यात्मिक जल राशि में बुध का बौद्धिक स्वामित्व — रहस्यमय अनुभव को समझने योग्य भाषा में अनुवाद करने वाले स्पष्टवादी दूरदर्शी। देवता पूषन (आत्माओं का चरवाहा)। करुणामय संवादक, अनुवादक और दहलीज पार कराने वाले — चिकित्सक, धर्मशाला कार्यकर्ता, दाई और आध्यात्मिक शिक्षक।' },
  },
];

// ─── Planetary Dignities in Meena ──────────────────────────────────────
const PLANETARY_DIGNITIES_HERE = {
  rulerAndOwn: { en: 'Jupiter (Guru) — own sign (second of two, the other being Sagittarius). Jupiter in Pisces expresses through spiritual wisdom, compassion, and devotional faith rather than the philosophical teaching of Sagittarius. This is Jupiter the mystic, the compassionate sage, the divine grace incarnate.', hi: 'गुरु (बृहस्पति) — स्वराशि (दो में से दूसरी, पहली धनु)। मीन में गुरु दार्शनिक शिक्षण के बजाय आध्यात्मिक ज्ञान, करुणा और भक्ति विश्वास से अभिव्यक्त। यह गुरु रहस्यवादी, करुणामय ऋषि, दिव्य कृपा का अवतार।' },
  exalted: { en: 'Venus (Shukra) is exalted in Pisces with deepest exaltation at 27°. The planet of love, beauty, and pleasure achieves its highest expression in the waters of unconditional compassion — love that transcends physical desire to become divine devotion (bhakti). Art becomes prayer, beauty becomes transcendence, and relationships become vehicles for spiritual awakening.', hi: 'शुक्र मीन में उच्च है, 27° पर परम उच्च। प्रेम, सौन्दर्य और आनन्द का ग्रह बिना शर्त करुणा के जल में उच्चतम अभिव्यक्ति — प्रेम जो शारीरिक इच्छा से परे दिव्य भक्ति बनता है। कला प्रार्थना बनती है, सौन्दर्य पारलौकिकता, और सम्बन्ध आध्यात्मिक जागरण के वाहन।' },
  debilitated: { en: 'Mercury (Budha) is debilitated in Pisces with deepest debilitation at 15°. The analytical, detail-oriented intellect dissolves in Pisces\' boundless waters — logical precision gives way to intuitive knowing, facts blur into feelings, and communication becomes poetic rather than precise. However, this "weakness" produces some of the most inspired artists, musicians, and visionaries.', hi: 'बुध मीन में नीच है, 15° पर परम नीच। विश्लेषणात्मक, विस्तार-उन्मुख बुद्धि मीन के असीम जल में विलीन — तार्किक सूक्ष्मता अन्तर्ज्ञानी ज्ञान को रास्ता देती है, तथ्य भावनाओं में धुँधले, संवाद सूक्ष्म के बजाय काव्यात्मक। तथापि यह "दुर्बलता" कुछ सबसे प्रेरित कलाकार, संगीतकार और दूरदर्शी बनाती है।' },
  coRuler: { en: 'Ketu is considered the co-ruler of Pisces by many Jyotish traditions. The headless node\'s natural spirituality, detachment from material illusion, and moksha-oriented energy find their most comfortable expression in Jupiter\'s compassionate water sign. Ketu here dissolves the ego into cosmic unity.', hi: 'कई ज्योतिष परम्पराओं में केतु मीन का सह-स्वामी। शिरहीन छाया ग्रह की स्वाभाविक आध्यात्मिकता, भौतिक भ्रम से विरक्ति और मोक्ष-उन्मुख ऊर्जा गुरु की करुणामय जल राशि में सबसे सहज अभिव्यक्ति। केतु यहाँ अहंकार को ब्रह्मांडीय एकता में विलीन करता है।' },
};

// ─── Each Planet in Meena ──────────────────────────────────────────────
const EACH_PLANET_IN_SIGN: { planet: ML; effect: ML; dignity: string }[] = [
  {
    planet: { en: 'Sun (Surya)', hi: 'सूर्य' },
    dignity: 'Friend\'s sign',
    effect: {
      en: 'Sun in Pisces softens the sovereign\'s ego with compassion and spiritual awareness. The native\'s identity is tied to service, healing, and spiritual leadership rather than worldly authority. The soul (Atma) expresses through creative imagination, empathetic connection, and selfless action. The father may be spiritual, artistic, or serve in healthcare. Government service through welfare, healthcare administration, or charitable organizations suits well. Self-confidence fluctuates with emotional tides, and the native may struggle with clear self-definition — their boundaries dissolve into the needs of others.',
      hi: 'मीन में सूर्य राजा के अहंकार को करुणा और आध्यात्मिक जागरूकता से कोमल करता है। जातक की पहचान सांसारिक अधिकार के बजाय सेवा, चिकित्सा और आध्यात्मिक नेतृत्व से। पिता आध्यात्मिक, कलात्मक या स्वास्थ्य सेवा में। कल्याण, स्वास्थ्य प्रशासन या दान संगठनों में सरकारी सेवा उपयुक्त। आत्मविश्वास भावनात्मक ज्वार के साथ उतार-चढ़ाव।'
    },
  },
  {
    planet: { en: 'Moon (Chandra)', hi: 'चन्द्र' },
    dignity: 'Neutral',
    effect: {
      en: 'Moon in Pisces creates one of the most emotionally sensitive, intuitive, and compassionate placements in the zodiac. The mind operates through feeling, intuition, and imagination rather than logic. The native absorbs the emotional atmosphere of every environment, making them natural empaths, healers, and artists. The mother is likely gentle, spiritual, or artistically gifted. Emotional security comes from spiritual connection, creative expression, and caring for the vulnerable. The shadow side is emotional overwhelm, escapism through substance or fantasy, and difficulty maintaining practical boundaries. Dreams are extraordinarily vivid and often prophetic.',
      hi: 'मीन में चन्द्र राशिचक्र की सबसे भावनात्मक रूप से संवेदनशील, अन्तर्ज्ञानी और करुणामय स्थितियों में। मन तर्क के बजाय भावना, अन्तर्ज्ञान और कल्पना से संचालित। जातक हर वातावरण का भावनात्मक वातावरण अवशोषित करता है — स्वाभाविक सहानुभूतिशील, चिकित्सक और कलाकार। माता कोमल, आध्यात्मिक या कलात्मक। भावनात्मक सुरक्षा आध्यात्मिक जुड़ाव और सृजनात्मक अभिव्यक्ति से। स्वप्न असाधारण रूप से स्पष्ट और प्रायः भविष्यसूचक।'
    },
  },
  {
    planet: { en: 'Mars (Mangal)', hi: 'मंगल' },
    dignity: 'Neutral',
    effect: {
      en: 'Mars in Pisces creates the spiritual warrior — aggressive energy softened by empathy and directed toward protecting the helpless, healing the suffering, and fighting injustice through compassion rather than force. The native channels martial energy into creative arts, spiritual practice with physical discipline (yoga, tai chi), and charitable action. Energy can dissipate in fantasy, escapism, or misdirected compassion. When focused, this placement produces saints who fight injustice, doctors who heal through intuitive diagnosis, and artists who transform rage into transcendent beauty.',
      hi: 'मीन में मंगल आध्यात्मिक योद्धा — सहानुभूति से कोमल और असहायों की रक्षा, पीड़ा की चिकित्सा और बल के बजाय करुणा से अन्याय के विरुद्ध निर्देशित। सैन्य ऊर्जा सृजनात्मक कलाओं, शारीरिक अनुशासन सहित आध्यात्मिक साधना (योग) और दान कार्य में। केन्द्रित होने पर अन्याय से लड़ने वाले संत, अन्तर्ज्ञानी निदान से चिकित्सा करने वाले डॉक्टर और क्रोध को पारलौकिक सौन्दर्य में बदलने वाले कलाकार।'
    },
  },
  {
    planet: { en: 'Mercury (Budha)', hi: 'बुध' },
    dignity: 'Debilitated (15°)',
    effect: {
      en: 'Mercury is debilitated in Pisces — the analytical intellect dissolves in the ocean of feeling and imagination. Logical precision suffers, but intuitive understanding, creative writing, and poetic expression flourish. The native thinks in images, metaphors, and feelings rather than facts and figures. Mathematics and accounting may be challenging, but music, poetry, and visual storytelling come naturally. This placement produces some of the world\'s greatest artists and most inspired communicators — those who speak the language of the soul rather than the mind. Neecha Bhanga can produce brilliant synthesis of logic and intuition.',
      hi: 'बुध मीन में नीच — विश्लेषणात्मक बुद्धि भावना और कल्पना के सागर में विलीन। तार्किक सूक्ष्मता कम, किन्तु अन्तर्ज्ञानी समझ, सृजनात्मक लेखन और काव्यात्मक अभिव्यक्ति फलती-फूलती है। जातक तथ्यों और आँकड़ों के बजाय चित्रों, रूपकों और भावनाओं में सोचता है। गणित और लेखा चुनौतीपूर्ण, किन्तु संगीत, कविता और दृश्य कथा स्वाभाविक। विश्व के महानतम कलाकार और सबसे प्रेरित संवादक। नीच भंग तर्क और अन्तर्ज्ञान का शानदार संश्लेषण।'
    },
  },
  {
    planet: { en: 'Jupiter (Guru)', hi: 'गुरु' },
    dignity: 'Own sign',
    effect: {
      en: 'Jupiter in its own sign Pisces is the compassionate sage — wisdom expressed through devotion, empathy, and unconditional grace. Unlike Jupiter in Sagittarius (the philosophical teacher), Jupiter in Pisces teaches through being, not through lecture. The native radiates a gentle authority that heals by proximity. Spiritual practice is devotional (bhakti) rather than intellectual (jnana). This placement bestows intuitive understanding of suffering, natural healing abilities, and a faith that sustains others through crisis. Can become escapist, over-idealistic, or naive about human nature. The native may sacrifice personal wellbeing for others without adequate self-care.',
      hi: 'गुरु अपनी स्वराशि मीन में करुणामय ऋषि — भक्ति, सहानुभूति और बिना शर्त कृपा से व्यक्त ज्ञान। धनु में गुरु (दार्शनिक शिक्षक) से भिन्न, मीन में गुरु होकर सिखाता है, व्याख्यान से नहीं। जातक कोमल अधिकार विकीर्ण करता है जो निकटता से चिकित्सा करता है। आध्यात्मिक अभ्यास बौद्धिक (ज्ञान) के बजाय भक्तिमय (भक्ति)। पीड़ा की अन्तर्ज्ञानी समझ, स्वाभाविक चिकित्सा क्षमताएँ। पलायनवादी या मानव स्वभाव के बारे में भोला हो सकता है।'
    },
  },
  {
    planet: { en: 'Venus (Shukra)', hi: 'शुक्र' },
    dignity: 'Exalted (27°)',
    effect: {
      en: 'Venus achieves its highest expression in Pisces — love becomes devotion, beauty becomes transcendence, and pleasure becomes spiritual ecstasy. This is the most romantic, artistic, and spiritually refined Venus placement. The native experiences love as a cosmic force, not merely a personal emotion. Art produced under this influence has an otherworldly, dreamlike quality that moves viewers to tears. Music, dance, poetry, and visual art reach their most inspired expression. Relationships are idealized and sometimes disappointing when reality fails to match the dream. At 27° (deepest exaltation), love becomes indistinguishable from prayer. Compassion extends to all living beings.',
      hi: 'शुक्र मीन में उच्चतम अभिव्यक्ति प्राप्त करता है — प्रेम भक्ति बनता है, सौन्दर्य पारलौकिकता, आनन्द आध्यात्मिक परमानन्द। सबसे रोमांटिक, कलात्मक और आध्यात्मिक रूप से परिष्कृत शुक्र। जातक प्रेम को ब्रह्मांडीय शक्ति अनुभव करता है, केवल व्यक्तिगत भावना नहीं। इस प्रभाव की कला अलौकिक, स्वप्निल। 27° पर (परम उच्च) प्रेम प्रार्थना से अभिन्न। करुणा सभी प्राणियों तक।'
    },
  },
  {
    planet: { en: 'Saturn (Shani)', hi: 'शनि' },
    dignity: 'Neutral',
    effect: {
      en: 'Saturn in Pisces creates a serious, disciplined approach to spiritual practice and compassionate service. The native earns wisdom through suffering, endurance, and selfless labor for those in need. Spiritual practice is austere and sustained over decades — not the ecstatic bhakti of short retreats but the steady meditation of a lifetime. The native may work in institutions of suffering — hospitals, prisons, rehabilitation centers, and hospices. Chronic health issues, particularly affecting the feet, lymphatic system, or immune function, may arise. Depression can result from absorbing too much collective pain without adequate spiritual grounding.',
      hi: 'मीन में शनि आध्यात्मिक साधना और करुणामय सेवा के प्रति गम्भीर, अनुशासित दृष्टिकोण। पीड़ा, सहनशीलता और ज़रूरतमन्दों के लिए निःस्वार्थ श्रम से ज्ञान अर्जित। आध्यात्मिक अभ्यास तपस्वी और दशकों तक — लघु शिविरों की उत्कट भक्ति नहीं बल्कि जीवनभर का स्थिर ध्यान। पीड़ा की संस्थाओं — अस्पताल, जेल, पुनर्वास केन्द्र। पैर, लसीका या प्रतिरक्षा को प्रभावित करने वाली दीर्घ स्वास्थ्य समस्याएँ।'
    },
  },
  {
    planet: { en: 'Rahu', hi: 'राहु' },
    dignity: 'Neutral',
    effect: {
      en: 'Rahu in Pisces creates an insatiable hunger for transcendence, mystical experience, and escape from material reality — but through unconventional, sometimes deceptive channels. The native may pursue exotic spiritual practices, psychedelic exploration, or immersive virtual realities as substitutes for genuine spiritual awakening. Fascination with foreign spiritual traditions, occult practices, and alternative healing methods. Shadow expressions include spiritual fraud, drug addiction, and fantasy-based delusions. At its best, Rahu here produces visionary artists, pioneering meditation researchers, and healers who synthesize ancient wisdom with modern science.',
      hi: 'मीन में राहु पारलौकिकता, रहस्यमय अनुभव और भौतिक वास्तविकता से पलायन की अतृप्त भूख — किन्तु अपरम्परागत, कभी-कभी भ्रामक माध्यमों से। विदेशी आध्यात्मिक परम्पराओं, गूढ़ अभ्यासों और वैकल्पिक चिकित्सा में आकर्षण। छाया अभिव्यक्ति: आध्यात्मिक धोखा, नशा, कल्पना-आधारित भ्रम। सर्वोत्तम रूप में दूरदर्शी कलाकार, अग्रणी ध्यान शोधकर्ता और प्राचीन ज्ञान को आधुनिक विज्ञान से जोड़ने वाले चिकित्सक।'
    },
  },
  {
    planet: { en: 'Ketu', hi: 'केतु' },
    dignity: 'Co-ruler (strong placement)',
    effect: {
      en: 'Ketu in its co-ruled sign Pisces is exceptionally powerful for spiritual liberation. The headless node achieves its deepest expression in Jupiter\'s ocean of compassion — complete dissolution of ego, direct perception of cosmic unity, and natural attainment of moksha-oriented states. The native may be a born mystic with little interest in material achievement. Past-life spiritual accomplishment manifests as innate meditative ability and spontaneous states of transcendence. The challenge is functioning in the material world while consciousness naturally gravitates toward dissolution. Can produce saints, sages, and those who simply exist in a state of grace that inspires without effort.',
      hi: 'केतु अपनी सह-शासित राशि मीन में आध्यात्मिक मुक्ति के लिए असाधारण रूप से शक्तिशाली। शिरहीन छाया ग्रह गुरु के करुणा सागर में गहनतम अभिव्यक्ति — अहंकार का सम्पूर्ण विलय, ब्रह्मांडीय एकता की प्रत्यक्ष अनुभूति। जातक जन्मजात रहस्यवादी। पूर्व जन्म का आध्यात्मिक पुण्य जन्मजात ध्यान क्षमता और स्वतःस्फूर्त पारलौकिक अवस्थाओं में प्रकट। चुनौती: चेतना विलय की ओर जाते हुए भौतिक संसार में कार्य करना। संत, ऋषि और बिना प्रयास प्रेरित करने वाले कृपा की अवस्था।'
    },
  },
];

// ─── Personality Traits ────────────────────────────────────────────────
const PERSONALITY_TRAITS = {
  strengths: {
    en: 'Extraordinarily compassionate and empathetic — feels the joy and suffering of others as their own. Creatively gifted with an imagination that operates in dimensions beyond ordinary perception. Deeply spiritual with natural access to intuitive wisdom and mystical states. Selflessly devoted to the wellbeing of others, often at personal cost. Adaptable and accepting — the mutable water sign flows around obstacles that rigid signs crash against. Natural healer whose presence alone brings comfort and calm. Artistic expression reaches heights of beauty that move hearts across cultures and centuries.',
    hi: 'असाधारण रूप से करुणामय और सहानुभूतिशील — दूसरों के आनन्द और पीड़ा को अपना अनुभव करता है। सामान्य धारणा से परे कल्पना के साथ सृजनात्मक रूप से प्रतिभाशाली। गहन आध्यात्मिक, अन्तर्ज्ञानी ज्ञान और रहस्यमय अवस्थाओं तक स्वाभाविक पहुँच। दूसरों के कल्याण के लिए निःस्वार्थ समर्पित। अनुकूलनीय और स्वीकारशील। स्वाभाविक चिकित्सक जिसकी उपस्थिति मात्र आराम और शान्ति लाती है। कलात्मक अभिव्यक्ति सौन्दर्य की ऊँचाइयाँ।'
  },
  weaknesses: {
    en: 'Boundary-less — absorbs others\' emotions, problems, and energy without adequate self-protection. Escapist tendencies through fantasy, substance abuse, excessive sleep, or spiritual bypassing of real-world problems. Martyr complex that sacrifices personal needs and calls it virtue. Difficulty with practical matters — money management, deadlines, and organizational structure feel alien. Naive trust that enables exploitation by predatory personalities. Emotional overwhelm that leads to withdrawal, depression, or dissociation. Can be passive, indecisive, and dependent on stronger personalities for direction.',
    hi: 'सीमाहीन — पर्याप्त आत्म-सुरक्षा के बिना दूसरों की भावनाएँ, समस्याएँ और ऊर्जा अवशोषित। कल्पना, नशा, अत्यधिक नींद या वास्तविक समस्याओं से आध्यात्मिक पलायन। शहीद जटिलता जो व्यक्तिगत आवश्यकताओं का बलिदान कर सद्गुण कहती है। व्यावहारिक मामलों — धन प्रबन्धन, समय सीमा, संगठनात्मक संरचना में कठिनाई। भोला विश्वास। भावनात्मक अभिभूत जो पीछे हटना, अवसाद या विभाजन की ओर।'
  },
  temperament: {
    en: 'The Piscean temperament is phlegmatic and melancholic — cool, moist, and deeply receptive to environmental influences. Kapha dominates the constitution with Vata secondary, producing a soft, fluid physicality that tends toward water retention and lymphatic sluggishness. The native exists in a perpetual state of emotional porosity — absorbing feelings, atmospheres, and subtle energies from their surroundings. They are the natural psychics of the zodiac, though they may not consciously recognize their sensitivity. Mood shifts with the lunar cycle, weather changes, and the emotional states of people nearby. Solitude and proximity to water are essential for emotional recharge.',
    hi: 'मीन का स्वभाव कफ और उदास — शीतल, नम और पर्यावरणीय प्रभावों के प्रति गहन ग्राही। कफ प्रधान संरचना वात सहित, कोमल, तरल भौतिकता जो जल प्रतिधारण की ओर। जातक भावनात्मक सरन्ध्रता की शाश्वत अवस्था में — परिवेश से भावनाएँ, वातावरण और सूक्ष्म ऊर्जाएँ अवशोषित। राशिचक्र के स्वाभाविक मानसिक। मनोदशा चन्द्र चक्र, मौसम परिवर्तन और निकट लोगों की भावनात्मक अवस्थाओं के साथ बदलती है। एकान्त और जल की निकटता भावनात्मक पुनर्भरण के लिए आवश्यक।'
  },
  appearance: {
    en: 'Soft, rounded features with large, dreamy, often slightly watery eyes that seem to gaze at something beyond the visible world. Medium build that tends toward fullness, especially with age. Skin is soft, sometimes pale, and unusually sensitive. The feet are often small, delicate, or distinctively shaped. Movement is graceful, flowing, and sometimes appears to glide rather than walk. The overall impression is of gentleness and otherworldliness — someone who belongs partly to this world and partly to another. Hair tends to be fine and may be wavy or curly.',
    hi: 'कोमल, गोलाकार आकृतियाँ, बड़ी, स्वप्निल, प्रायः थोड़ी नम आँखें जो दृश्य संसार से परे कुछ देखती प्रतीत। मध्यम काया जो पूर्णता की ओर, विशेषकर आयु के साथ। त्वचा कोमल, कभी-कभी पीली और असामान्य रूप से संवेदनशील। पैर प्रायः छोटे, नाज़ुक या विशिष्ट आकार। गति सुन्दर, प्रवाही और कभी-कभी चलने के बजाय तैरती प्रतीत। समग्र छवि: कोमलता और अलौकिकता — अंशतः इस संसार और अंशतः किसी अन्य का।'
  },
};

// ─── Career Tendencies ─────────────────────────────────────────────────
const CAREER_TENDENCIES = {
  suited: {
    en: 'Musician, painter, poet, dancer, filmmaker, photographer, spiritual teacher, meditation instructor, Ayurvedic practitioner, homeopath, psychotherapist, counselor, hospice worker, nurse, charity director, marine biologist, oceanographer, fisherman, perfumer, wine maker, pharmacist, anesthesiologist, dream researcher, astrologer, mystic, religious scholar, translator, interpreter',
    hi: 'संगीतकार, चित्रकार, कवि, नर्तक, फिल्म निर्माता, फोटोग्राफर, आध्यात्मिक शिक्षक, ध्यान प्रशिक्षक, आयुर्वेदिक चिकित्सक, होम्योपैथ, मनोचिकित्सक, परामर्शदाता, धर्मशाला कार्यकर्ता, नर्स, दान निदेशक, समुद्री जीवविज्ञानी, मछुआरा, इत्रकार, फार्मासिस्ट, स्वप्न शोधकर्ता, ज्योतिषी, रहस्यवादी, धार्मिक विद्वान, अनुवादक'
  },
  nature: {
    en: 'Pisces natives excel in careers that allow emotional expression, spiritual service, and creative imagination. They need roles where empathy is an asset, not a liability — where feeling deeply makes them better at their work. The ideal Meena career dissolves the boundary between work and devotion, creating a vocation rather than merely a job. They are at their worst in competitive, materialistic, and emotionally sterile environments and at their best when their work heals, inspires, or connects souls.',
    hi: 'मीन जातक ऐसे करियर में उत्कृष्ट होते हैं जो भावनात्मक अभिव्यक्ति, आध्यात्मिक सेवा और सृजनात्मक कल्पना की अनुमति देते हैं। ऐसी भूमिकाएँ जहाँ सहानुभूति सम्पत्ति है, बाधा नहीं — जहाँ गहराई से अनुभव करना उन्हें बेहतर बनाता है। आदर्श मीन करियर कार्य और भक्ति की सीमा मिटाता है। प्रतिस्पर्धी, भौतिकवादी वातावरण में सबसे कमजोर और चिकित्सा, प्रेरणा या आत्माओं को जोड़ने वाले कार्य में सबसे अच्छे।'
  },
};

// ─── Compatibility ─────────────────────────────────────────────────────
const COMPATIBILITY = {
  best: {
    en: 'Cancer (Karka) — fellow water sign that matches Pisces\' emotional depth and nurturing instinct. Scorpio (Vrischika) — water-sign harmony with shared intensity, intuition, and transformative depth. Taurus (Vrishabha) — earth grounds water; Venus-ruled Taurus provides the material stability Pisces needs. Capricorn (Makara) — opposite sign that provides the structure and discipline Pisces lacks.',
    hi: 'कर्क — सह-जल राशि जो मीन की भावनात्मक गहराई और पोषण प्रवृत्ति से मेल। वृश्चिक — साझा तीव्रता, अन्तर्ज्ञान और परिवर्तनकारी गहराई में जल-राशि सामंजस्य। वृषभ — पृथ्वी जल को भूमिगत करती है; शुक्र-शासित वृषभ भौतिक स्थिरता। मकर — विपरीत राशि जो मीन में अनुपस्थित संरचना और अनुशासन प्रदान करती है।'
  },
  challenging: {
    en: 'Gemini (Mithuna) — Mercury\'s airy intellectualism feels superficial to deep-feeling Pisces; both are mutable, creating instability. Virgo (Kanya) — opposite sign axis; Virgo\'s criticism and detail-focus wounds Pisces\' sensitive nature. Sagittarius (Dhanu) — despite shared Jupiter rulership, Sagittarius\' blunt honesty and restless energy exhaust Pisces\' need for gentle intimacy.',
    hi: 'मिथुन — बुध की बौद्धिक वायव्यता गहन भावनाशील मीन को सतही लगती है; दोनों द्विस्वभाव, अस्थिरता। कन्या — विपरीत अक्ष; कन्या की आलोचना और विस्तार-केन्द्रण मीन की संवेदनशील प्रकृति को घायल। धनु — साझा गुरु स्वामित्व के बावजूद स्पष्ट ईमानदारी और अस्थिर ऊर्जा मीन की कोमल अन्तरंगता की आवश्यकता को थकाती है।'
  },
};

// ─── Remedies & Worship ────────────────────────────────────────────────
const REMEDIES_AND_WORSHIP = {
  deity: {
    en: 'Lord Vishnu in his Matsya (Fish) avatara — the first incarnation who saved the Vedas and all life from the cosmic deluge. This directly connects to Pisces\' fish symbolism and its role as the sign that preserves cosmic knowledge through cycles of dissolution. Lord Krishna as the embodiment of divine love and compassionate wisdom is also deeply aligned with Piscean energy. Brihaspati (Jupiter personified) as the guru of the devas represents the ruling planet\'s highest expression.',
    hi: 'भगवान विष्णु मत्स्य अवतार में — प्रथम अवतार जिसने प्रलय से वेदों और समस्त जीवन की रक्षा की। यह सीधे मीन के मछली प्रतीकवाद और विलय चक्रों में ब्रह्मांडीय ज्ञान संरक्षण की भूमिका से जुड़ता है। दिव्य प्रेम और करुणामय ज्ञान के अवतार भगवान कृष्ण। देवगुरु बृहस्पति (गुरु साकार) शासक ग्रह की उच्चतम अभिव्यक्ति।'
  },
  practices: {
    en: 'Jupiter remedies apply: Guru Beej Mantra "Om Graam Greem Graum Sah Gurave Namah" — 19,000 times in 40 days. Wear Yellow Sapphire (Pukhraj) in gold on the index finger on Thursday during Shukla Paksha. Donate yellow cloth, turmeric, books, and food to Brahmins on Thursdays. Fast on Thursdays. Additionally for Pisces: practice Vishnu Sahasranama chanting. Serve near water bodies — clean rivers, protect marine life, care for fishermen communities. Practice meditation near water. Offer water to Peepal tree. Create art as devotional practice. The most powerful Pisces remedy is compassionate service without expectation of recognition — seva that dissolves ego boundaries.',
    hi: 'गुरु उपाय: गुरु बीज मन्त्र "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः" — 40 दिनों में 19,000 जाप। पुखराज स्वर्ण में गुरुवार शुक्ल पक्ष में। गुरुवार को पीला वस्त्र, हल्दी, पुस्तकें और भोजन दान। मीन हेतु अतिरिक्त: विष्णु सहस्रनाम पाठ। जल निकायों के पास सेवा — नदी सफाई, समुद्री जीवन रक्षा। जल के पास ध्यान। पीपल वृक्ष को जल। कला भक्ति अभ्यास के रूप में। सबसे शक्तिशाली मीन उपाय: मान्यता की अपेक्षा के बिना करुणामय सेवा — अहंकार सीमाओं को विलीन करने वाली सेवा।'
  },
};

// ─── Mythology ─────────────────────────────────────────────────────────
const MYTHOLOGY = {
  story: {
    en: 'The two fish of Pisces swimming in opposite directions represent the fundamental duality of existence — the soul\'s simultaneous pull toward material experience and spiritual liberation. In Vedic tradition, this image connects to the Matsya (Fish) avatara of Vishnu, who appeared as a small golden fish to the sage Manu. The fish grew to cosmic proportions, saved Manu from the great deluge (pralaya), and preserved the Vedas and the seeds of all life on a divine boat guided by Vasuki (the cosmic serpent). Pisces is the twelfth and final sign of the zodiac — in the Kala Purusha (cosmic being), it corresponds to the feet, which touch the earth while the head (Aries) reaches toward heaven. The feet represent humility, service, and the completion of the soul\'s journey through all twelve signs. At the end of the zodiac cycle, the individual self dissolves back into the cosmic ocean — only to be reborn in Aries as the cycle begins again. This eternal rhythm of dissolution (pralaya) and creation (srishti) is the essence of Meena: the sign where everything ends and everything begins, where the drop returns to the ocean and discovers it was the ocean all along.',
    hi: 'मीन की दो मछलियाँ विपरीत दिशाओं में तैरती हुई अस्तित्व के मूल द्वैत का प्रतिनिधित्व — आत्मा का भौतिक अनुभव और आध्यात्मिक मुक्ति दोनों की ओर एक साथ खिंचाव। वैदिक परम्परा में यह विष्णु के मत्स्य अवतार से जुड़ता है, जो ऋषि मनु को छोटी सुनहरी मछली के रूप में प्रकट हुआ। मछली ब्रह्मांडीय विशालता तक बढ़ी, मनु को महाप्रलय से बचाया, वेदों और समस्त जीवन के बीजों को वासुकि (ब्रह्मांडीय सर्प) द्वारा निर्देशित दिव्य नाव पर संरक्षित किया। मीन राशिचक्र की बारहवीं और अंतिम राशि — काल पुरुष में पैरों से सम्बन्धित जो पृथ्वी को छूते हैं जबकि मस्तक (मेष) स्वर्ग की ओर। पैर विनम्रता, सेवा और बारह राशियों से आत्मा की यात्रा की पूर्णता। राशिचक्र के अन्त में व्यक्तिगत स्वयं ब्रह्मांडीय सागर में विलीन — मेष में पुनर्जन्म। विलय (प्रलय) और सृष्टि (सृष्टि) की यह शाश्वत लय मीन का सार: जहाँ सब समाप्त और सब आरम्भ, जहाँ बूँद सागर में लौटती है और खोजती है कि वह सदा सागर ही थी।'
  },
};

// ─── Cross-reference links ─────────────────────────────────────────────
const CROSS_LINKS = [
  { href: '/learn/rashis', label: { en: 'All Twelve Rashis', hi: 'सभी बारह राशियाँ' } },
  { href: '/learn/guru', label: { en: 'Guru (Jupiter) — Ruler of Meena', hi: 'गुरु (बृहस्पति) — मीन का स्वामी' } },
  { href: '/learn/ketu', label: { en: 'Ketu — Co-ruler of Meena', hi: 'केतु — मीन का सह-स्वामी' } },
  { href: '/learn/shukra', label: { en: 'Shukra (Venus) — Exalted in Meena', hi: 'शुक्र — मीन में उच्च' } },
  { href: '/learn/budha', label: { en: 'Budha (Mercury) — Debilitated in Meena', hi: 'बुध — मीन में नीच' } },
  { href: '/learn/nakshatras', label: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { href: '/learn/mesha', label: { en: 'Mesha (Aries) — Next Sign / New Cycle', hi: 'मेष — अगली राशि / नया चक्र' } },
  { href: '/learn/kumbha', label: { en: 'Kumbha (Aquarius) — Previous Sign', hi: 'कुम्भ — पिछली राशि' } },
  { href: '/learn/yogas', label: { en: 'Yogas in Jyotish', hi: 'ज्योतिष में योग' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएँ' } },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function MeenaPage() {
  const locale = useLocale();
  const ml = useML(locale);
  const hf = getHeadingFont(locale);
  const bf = getBodyFont(locale);

  let section = 0;
  const next = () => ++section;

  const SECTIONS = [
    { id: 'section-1', label: ml({ en: 'Overview', hi: 'अवलोकन' }) },
    { id: 'section-2', label: ml({ en: 'Personality', hi: 'व्यक्तित्व' }) },
    { id: 'section-3', label: ml({ en: 'Nakshatras', hi: 'नक्षत्र' }) },
    { id: 'section-4', label: ml({ en: 'Dignities', hi: 'गरिमा' }) },
    { id: 'section-5', label: ml({ en: 'Each Planet', hi: 'प्रत्येक ग्रह' }) },
    { id: 'section-6', label: ml({ en: 'Career', hi: 'करियर' }) },
    { id: 'section-7', label: ml({ en: 'Compatibility', hi: 'अनुकूलता' }) },
    { id: 'section-8', label: ml({ en: 'Remedies', hi: 'उपाय' }) },
    { id: 'section-9', label: ml({ en: 'Mythology', hi: 'पौराणिक कथा' }) },
    { id: 'section-10', label: ml({ en: 'Health', hi: 'स्वास्थ्य' }) },
    { id: 'section-11', label: ml({ en: 'Practical', hi: 'व्यावहारिक' }) },
    { id: 'section-12', label: ml({ en: 'House Cusps', hi: 'भाव शिखर' }) },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
          <span className="text-4xl">♓</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-3" style={hf}>
          {ml({ en: 'Meena — Pisces', hi: 'मीन राशि — मछली' })}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>
          {ml({ en: 'The twelfth and final sign of the zodiac — Jupiter\'s oceanic domain of compassion, spiritual transcendence, creative imagination, and the soul\'s return to cosmic unity.', hi: 'राशिचक्र की बारहवीं और अंतिम राशि — गुरु का सागरीय क्षेत्र, करुणा, आध्यात्मिक पारलौकिकता, सृजनात्मक कल्पना और आत्मा का ब्रह्मांडीय एकता में पुनर्मिलन।' })}
        </p>
      </motion.div>

      {/* ── Sanskrit Terms ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
        {TERMS.map((t, i) => (
          <SanskritTermCard key={i} term={t.devanagari} transliteration={t.transliteration} meaning={ml(t.meaning)} />
        ))}
      </div>

      {/* ── 1. Sign Overview ── */}
      <LessonSection number={next()} title={ml({ en: 'Sign Overview', hi: 'राशि परिचय' })}>
        <p style={bf}>{ml({ en: 'Meena (Pisces) is the twelfth and final sign of the zodiac, spanning 330° to 360° (0°). Ruled by Jupiter (Guru) with Ketu as co-ruler per many traditions, it is the mutable water sign — the most fluid, receptive, and spiritually oriented sign in the zodiac. The two fish swimming in opposite directions symbolize the eternal tension between worldly engagement and spiritual liberation. As the natural ruler of the twelfth house (Vyaya Bhava), Pisces governs expenditure, loss, foreign lands, hospitalization, imprisonment, spiritual liberation (moksha), bed pleasures, and the dissolution of individual identity into cosmic consciousness. It is the sign where the zodiac cycle completes — where the drop returns to the ocean, and existence prepares for renewal in Aries.', hi: 'मीन राशिचक्र की बारहवीं और अंतिम राशि है, 330° से 360° (0°) तक। गुरु द्वारा शासित, कई परम्पराओं में केतु सह-स्वामी, यह द्विस्वभाव जल राशि — सबसे तरल, ग्राही और आध्यात्मिक। विपरीत दिशाओं में तैरती दो मछलियाँ सांसारिक संलग्नता और आध्यात्मिक मुक्ति के बीच शाश्वत तनाव। द्वादश भाव (व्यय भाव) का स्वाभाविक शासक — व्यय, हानि, विदेश, अस्पताल, मोक्ष, शय्या सुख और व्यक्तिगत पहचान का ब्रह्मांडीय चेतना में विलय। जहाँ राशिचक्र पूर्ण — बूँद सागर में लौटती है।' })}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(SIGN_OVERVIEW).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-dark text-xs uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Svaroopa (Nature of Signs)" />
      </LessonSection>

      {/* ── 2. Personality Traits ── */}
      <LessonSection number={next()} title={ml({ en: 'Personality & Temperament', hi: 'व्यक्तित्व एवं स्वभाव' })}>
        <div className="space-y-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Strengths', hi: 'शक्तियाँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.strengths)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Weaknesses', hi: 'दुर्बलताएँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.weaknesses)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Temperament & Constitution', hi: 'स्वभाव एवं संरचना' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.temperament)}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Physical Appearance', hi: 'शारीरिक रूप' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(PERSONALITY_TRAITS.appearance)}</p>
          </div>
        </div>
        <ClassicalReference shortName="PD" chapter="Ch. 2 — Rashi Adhyaya" />
      </LessonSection>

      {/* ── 3. Nakshatras ── */}
      <LessonSection number={next()} title={ml({ en: 'Nakshatras in Meena', hi: 'मीन में नक्षत्र' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Pisces contains parts of three nakshatras whose lords — Jupiter, Saturn, and Mercury — create the final progression of the zodiac: radical spiritual transformation (Purva Bhadrapada/Jupiter), deep wisdom through endurance (Uttara Bhadrapada/Saturn), and compassionate completion (Revati/Mercury). Together they embody the Piscean journey from ego-death through patient discipline to the nurturing of all life before the cycle begins anew.', hi: 'मीन में तीन नक्षत्रों के अंश जिनके स्वामी — गुरु, शनि और बुध — राशिचक्र का अंतिम क्रम: आमूल आध्यात्मिक परिवर्तन (पूर्वभाद्रपद/गुरु), सहनशीलता से गहन ज्ञान (उत्तरभाद्रपद/शनि), और करुणामय पूर्णता (रेवती/बुध)। अहंकार-मृत्यु से धैर्यपूर्ण अनुशासन से चक्र पुनः आरम्भ से पहले समस्त जीवन का पोषण।' })}</p>
        {NAKSHATRAS_IN_SIGN.map((n, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(n.name)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">{ml(n.lord)}</span>
            </div>
            <p className="text-text-secondary text-xs mb-2">{ml(n.range)}</p>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(n.nature)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 — Nakshatra Vibhaga" />
      </LessonSection>

      {/* ── 4. Planetary Dignities ── */}
      <LessonSection number={next()} title={ml({ en: 'Planetary Dignities in Meena', hi: 'मीन में ग्रह गरिमा' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Pisces is one of the most significant signs for planetary dignity — Venus achieves exaltation at 27° while Mercury finds its debilitation at 15°. This reveals the sign\'s nature: unconditional love and aesthetic transcendence are exalted (Venus), while analytical precision and logical categorization are weakened (Mercury). Jupiter rules as owner, and Ketu co-rules with spiritual liberation energy.', hi: 'मीन ग्रह गरिमा के लिए सबसे महत्वपूर्ण राशियों में — शुक्र 27° पर उच्च जबकि बुध 15° पर नीच। यह राशि की प्रकृति प्रकट करता है: बिना शर्त प्रेम और सौन्दर्य पारलौकिकता उच्च (शुक्र), विश्लेषणात्मक सूक्ष्मता और तार्किक वर्गीकरण दुर्बल (बुध)। गुरु स्वामी, केतु मोक्ष ऊर्जा से सह-शासक।' })}</p>
        <div className="space-y-3">
          {Object.entries(PLANETARY_DIGNITIES_HERE).map(([key, val]) => (
            <div key={key} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-primary text-sm font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(val)}</p>
            </div>
          ))}
        </div>
        <ClassicalReference shortName="BPHS" chapter="Ch. 3 v.18 — Uccha-Neecha-Adi" />
      </LessonSection>

      {/* ── 5. Each Planet in Meena ── */}
      <LessonSection number={next()} title={ml({ en: 'Each Planet in Pisces', hi: 'मीन में प्रत्येक ग्रह' })}>
        <p style={bf} className="mb-4">{ml({ en: 'Planets in Pisces are immersed in the ocean of cosmic consciousness. Personal boundaries dissolve, individual expression merges with collective feeling, and all planetary energies are colored by compassion, imagination, and spiritual awareness. The challenge for every planet here is maintaining functional clarity while swimming in the depths of infinite possibility.', hi: 'मीन में ग्रह ब्रह्मांडीय चेतना के सागर में डूबे। व्यक्तिगत सीमाएँ विलीन, व्यक्तिगत अभिव्यक्ति सामूहिक भावना में विलय, सभी ग्रह ऊर्जाएँ करुणा, कल्पना और आध्यात्मिक जागरूकता से रंगित। प्रत्येक ग्रह की चुनौती: अनन्त सम्भावना की गहराइयों में तैरते हुए कार्यात्मक स्पष्टता बनाए रखना।' })}</p>
        {EACH_PLANET_IN_SIGN.map((p, i) => (
          <div key={i} className="mb-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gold-light font-bold text-sm" style={hf}>{ml(p.planet)}</span>
              {p.dignity !== 'Neutral' && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  p.dignity.includes('Exalted') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  p.dignity.includes('Debilitated') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  p.dignity.includes('Own') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  p.dignity.includes('Co-ruler') ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  p.dignity.includes('Friend') ? 'bg-gold-primary/10 border-gold-primary/30 text-gold-light' :
                  'bg-gold-primary/10 border-gold-primary/30 text-gold-light'
                }`}>{p.dignity}</span>
              )}
            </div>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(p.effect)}</p>
          </div>
        ))}
        <ClassicalReference shortName="BPHS" chapter="Ch. 24 — Bhava Phala" />
      </LessonSection>

      {/* ── 6. Career Tendencies ── */}
      <LessonSection number={next()} title={ml({ en: 'Career & Professional Life', hi: 'करियर एवं व्यावसायिक जीवन' })}>
        <p style={bf}>{ml(CAREER_TENDENCIES.nature)}</p>
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
          <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Suited Professions', hi: 'उपयुक्त व्यवसाय' })}</h4>
          <p className="text-text-primary text-sm" style={bf}>{ml(CAREER_TENDENCIES.suited)}</p>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'The Piscean career reaches its zenith when work becomes indistinguishable from devotion. When a Meena native creates art that heals, teaches with compassion that transforms, or serves with selflessness that dissolves their own suffering along with others\', they have found their dharma. The question for Pisces is never "what can I earn?" but "how can I serve?"', hi: 'मीन करियर चरम पर तब पहुँचता है जब कार्य भक्ति से अभिन्न हो जाता है। जब मीन जातक ऐसी कला बनाता है जो चिकित्सा करे, ऐसी करुणा से पढ़ाता है जो बदल दे, या ऐसी निःस्वार्थता से सेवा करता है जो दूसरों के साथ अपनी पीड़ा भी विलीन करे — तो उसने अपना धर्म पा लिया। मीन का प्रश्न कभी "मैं क्या कमा सकता हूँ?" नहीं बल्कि "मैं कैसे सेवा कर सकता हूँ?"' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 7. Compatibility ── */}
      <LessonSection number={next()} title={ml({ en: 'Compatibility & Relationships', hi: 'अनुकूलता एवं सम्बन्ध' })}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Best Matches', hi: 'सर्वोत्तम जोड़ियाँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.best)}</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-sm mb-2" style={hf}>{ml({ en: 'Challenging Matches', hi: 'चुनौतीपूर्ण जोड़ियाँ' })}</h4>
            <p className="text-text-primary text-sm" style={bf}>{ml(COMPATIBILITY.challenging)}</p>
          </div>
        </div>
        <ClassicalReference shortName="JP" chapter="Ch. 19 — Vivaha (Marriage)" />
      </LessonSection>

      {/* ── 8. Remedies & Worship ── */}
      <LessonSection number={next()} title={ml({ en: 'Remedies & Worship', hi: 'उपाय एवं उपासना' })}>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-5">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Presiding Deity', hi: 'अधिष्ठात्री देवता' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.deity)}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-4">
            <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml({ en: 'Practices & Remedial Measures', hi: 'साधना एवं उपचारात्मक उपाय' })}</h4>
            <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(REMEDIES_AND_WORSHIP.practices)}</p>
          </div>
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Pisces is the sign of moksha — ultimate liberation. The deepest remedy for this sign is not a mantra, gemstone, or ritual, but the practice of unconditional compassion. When a Meena native serves without the slightest expectation of recognition, they dissolve the very ego that creates suffering. This is not sacrifice — it is the natural state of a sign that already knows the self and the other are one.', hi: 'मीन मोक्ष की राशि — परम मुक्ति। इस राशि का गहनतम उपाय मन्त्र, रत्न या अनुष्ठान नहीं, बल्कि बिना शर्त करुणा का अभ्यास। जब मीन जातक मान्यता की तनिक भी अपेक्षा बिना सेवा करता है, तो वह उस अहंकार को विलीन करता है जो पीड़ा उत्पन्न करता है। यह बलिदान नहीं — यह उस राशि की स्वाभाविक अवस्था है जो पहले से जानती है कि स्वयं और दूसरा एक हैं।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 9. Mythology ── */}
      <LessonSection number={next()} title={ml({ en: 'Mythology & Symbolism', hi: 'पौराणिक कथा एवं प्रतीकवाद' })}>
        <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(MYTHOLOGY.story)}</p>
        <ClassicalReference shortName="BPHS" chapter="Ch. 4 — Rashi Characteristics" />
      </LessonSection>

      {/* ── 10. Health & Body ── */}
      <LessonSection number={next()} title={ml({ en: 'Health & Body', hi: 'स्वास्थ्य एवं शरीर' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Meena governs the feet, toes, lymphatic system, immune system, and the pineal gland — the organs of grounding, fluid purification, and spiritual perception. As a water sign ruled by Jupiter (with Ketu as co-ruler), Pisces natives are susceptible to foot problems — plantar fasciitis, bunions, fungal infections, flat feet, and gout in the toes. The lymphatic and immune systems are the deeper vulnerability — Pisces natives are unusually sensitive to environmental toxins, allergens, and infections because their boundaries (both physical and psychic) are naturally porous. Autoimmune disorders, chronic fatigue syndrome, fibromyalgia, and allergic sensitivities are signature health challenges. When Jupiter is strong, the native possesses strong natural immunity, good lymphatic drainage, and a constitution that responds well to faith-based healing — Pisces natives often heal through prayer, visualization, and spiritual practice in ways that seem miraculous to others. A weak Jupiter manifests as swollen feet, lymphedema, compromised immunity, chronic infections, substance sensitivity (alcohol, drugs, medications affect Pisces natives far more intensely than other signs), and psychosomatic illnesses where emotional states directly produce physical symptoms. Ketu\'s co-rulership adds sensitivity to mysterious, hard-to-diagnose conditions and adverse reactions to conventional medication. Ayurvedically, Meena is predominantly Kapha — the water constitution that gives emotional depth and nurturing capacity but also tendency toward fluid retention, mucous congestion, sluggish lymphatics, and cold, damp conditions. Dietary recommendations emphasize warm, dry, light foods that move fluids: ginger, turmeric, pepper, warm soups, light grains, and immune-supporting herbs like ashwagandha, tulsi, and chyawanprash. Avoid cold, heavy, mucous-producing foods — dairy, cold sweets, ice cream, and excess wheat. Alcohol and recreational substances must be strictly limited — Pisces has the lowest tolerance in the zodiac. Exercise should emphasize foot health and lymphatic movement — walking barefoot on natural surfaces, foot massage (pada abhyanga), yoga (especially inversions for lymphatic drainage), swimming, and dance. Mentally, Meena natives are prone to escapism (the fish swimming away from reality), depression arising from absorbing collective suffering, and substance abuse as a misguided attempt to reach the transcendent states their soul craves — disciplined spiritual practice (meditation, seva, devotional singing) provides the healthy avenue to these states without the destruction of substance dependency.', hi: 'मीन पैरों, पंजों, लसीका तन्त्र, प्रतिरक्षा तन्त्र और पीनियल ग्रन्थि का शासक है — भूमिकरण, तरल शुद्धिकरण और आध्यात्मिक अनुभूति के अंग। गुरु शासित (केतु सह-शासक) जल राशि होने से मीन जातक पैर समस्याओं — प्लांटर फैसाइटिस, गाँठ, कवक संक्रमण, चपटे पैर और गठिया — के प्रति संवेदनशील। लसीका और प्रतिरक्षा तन्त्र गहरी भेद्यता — पर्यावरणीय विषाक्त पदार्थों, एलर्जी और संक्रमणों के प्रति असामान्य रूप से संवेदनशील। स्व-प्रतिरक्षा विकार, पुरानी थकान, फाइब्रोमायल्जिया और एलर्जी संवेदनशीलता। बली गुरु में मजबूत प्राकृतिक प्रतिरक्षा, अच्छा लसीका निकास। दुर्बल गुरु — सूजे पैर, लिम्फेडेमा, कमज़ोर प्रतिरक्षा, पुराने संक्रमण, पदार्थ संवेदनशीलता (मद्य, दवाएँ मीन जातकों को अन्य राशियों से कहीं अधिक प्रभावित), मनोदैहिक रोग। केतु सह-शासन — रहस्यमय, निदान कठिन स्थितियाँ। आयुर्वेदिक रूप से मीन प्रधानतः कफ — जल संविधान। आहार में ऊष्ण, शुष्क, हल्के तरल-गतिशील — अदरक, हल्दी, काली मिर्च, गरम सूप, हल्के अनाज और अश्वगन्धा, तुलसी, च्यवनप्राश। शीतल, भारी, कफकारक — दुग्ध, ठण्डी मिठाई, आइसक्रीम वर्जित। मद्य और मनोरंजक पदार्थ कड़ाई से सीमित — मीन की सहनशक्ति राशिचक्र में सबसे कम। व्यायाम पैर स्वास्थ्य और लसीका गति — प्राकृतिक सतहों पर नंगे पैर चलना, पाद अभ्यंग, योग (विशेषकर विपरीत), तैराकी और नृत्य। मानसिक रूप से पलायनवाद, सामूहिक पीड़ा अवशोषण से अवसाद और पदार्थ दुरुपयोग — अनुशासित आध्यात्मिक साधना (ध्यान, सेवा, भक्ति संगीत) स्वस्थ मार्ग।' })}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Vulnerable Areas', hi: 'संवेदनशील अंग' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Feet, toes, lymphatic system, immune system, pineal gland, mucous membranes', hi: 'पैर, पंजे, लसीका तन्त्र, प्रतिरक्षा तन्त्र, पीनियल ग्रन्थि, श्लेष्मा झिल्लियाँ' })}</p>
          </div>
          <div className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
            <span className="text-gold-dark text-xs uppercase tracking-wider">{ml({ en: 'Ayurvedic Constitution', hi: 'आयुर्वेदिक प्रकृति' })}</span>
            <p className="text-text-primary text-sm mt-1" style={bf}>{ml({ en: 'Kapha dominant (water-heavy). Favour warm, dry, light foods with immune-supporting herbs. Avoid cold, heavy, mucous-forming items. Strictly limit alcohol and substances. Foot care and lymphatic exercise essential.', hi: 'कफ प्रधान (जल-भारी)। ऊष्ण, शुष्क, हल्के प्रतिरक्षा-सहायक जड़ी-बूटी वाले आहार अनुकूल। शीतल, भारी, कफकारक पदार्थ वर्जित। मद्य और पदार्थ कड़ाई से सीमित। पैर देखभाल और लसीका व्यायाम अनिवार्य।' })}</p>
          </div>
        </div>
      </LessonSection>

      {/* ── 11. Practical Application ── */}
      <LessonSection number={next()} title={ml({ en: 'Practical Application', hi: 'व्यावहारिक अनुप्रयोग' })}>
        <p style={bf} className="mb-3">{ml({ en: 'Understanding Meena in chart interpretation means identifying where Jupiter\'s expansive wisdom combines with Ketu\'s spiritual dissolution in the native\'s life. Where Pisces falls reveals where you connect to the transcendent, where boundaries dissolve for better or worse, and where compassion is both your greatest gift and your most dangerous vulnerability.', hi: 'कुण्डली व्याख्या में मीन को समझने का अर्थ है पहचानना कि गुरु का विस्तारशील ज्ञान केतु के आध्यात्मिक विसर्जन के साथ जातक के जीवन में कहाँ संयोजित होता है। मीन जहाँ पड़ता है वहाँ पारलौकिक से जुड़ते हैं, सीमाएँ विलीन होती हैं और करुणा सबसे बड़ा उपहार और सबसे खतरनाक भेद्यता दोनों है।' })}</p>
        <div className="space-y-3">
          {[
            { title: { en: 'If Meena is your Lagna', hi: 'यदि मीन आपका लग्न है' }, content: { en: 'Jupiter becomes your lagna lord, making spiritual growth, compassion, and transcendence the central axis of your life. Purva Bhadrapada pada 4 (Jupiter nakshatra) creates a radically transformative personality that channels spiritual fire into worldly action — monks who build hospitals, artists who heal through their work. Uttara Bhadrapada lagna (Saturn nakshatra) produces the most disciplined Pisces — Saturn\'s structure contains and channels the oceanic Piscean energy into sustained spiritual practice and institutional service. Revati lagna (Mercury nakshatra) creates a nurturing, protective personality with the ability to guide others safely through transitions — the shepherd archetype. Jupiter as lagna lord demands that life have spiritual meaning — a materialist Pisces rising is swimming against their own current.', hi: 'गुरु लग्नेश बनता है — आध्यात्मिक विकास, करुणा और पारलौकिकता जीवन का केन्द्रीय अक्ष। पूर्वभाद्रपद पद 4 (गुरु नक्षत्र) आमूल रूपान्तरकारी व्यक्तित्व — अस्पताल बनाने वाले सन्यासी, कार्य से उपचार करने वाले कलाकार। उत्तरभाद्रपद लग्न (शनि नक्षत्र) सबसे अनुशासित मीन — सागरीय मीन ऊर्जा को सतत आध्यात्मिक साधना में। रेवती लग्न (बुध नक्षत्र) पोषक, रक्षात्मक व्यक्तित्व — चरवाहा मूलरूप। गुरु लग्नेश माँग करता है कि जीवन में आध्यात्मिक अर्थ हो।' } },
            { title: { en: 'If Meena is your Moon sign', hi: 'यदि मीन आपकी चन्द्र राशि है' }, content: { en: 'The mind is oceanic — vast, deep, and without clear boundaries between self and other. Emotions are felt not as personal experiences but as universal currents. This creates extraordinary empathy, artistic sensitivity, and spiritual receptivity — but also chronic difficulty distinguishing one\'s own feelings from absorbed environmental emotions. Pisces Moon natives are psychic sponges who need regular emotional cleansing. Uttara Bhadrapada Moon creates a uniquely powerful combination — Saturn\'s discipline gives structure to Pisces\' oceanic emotional nature, producing deep meditators, ascetic saints, and individuals with extraordinary emotional endurance. Revati Moon is the most nurturing final placement — the protector at the end of the zodiac who guides souls home.', hi: 'मन सागरीय — विशाल, गहरा और स्व-पर के बीच स्पष्ट सीमाओं के बिना। भावनाएँ व्यक्तिगत अनुभवों के बजाय सार्वभौमिक धाराओं के रूप में। असाधारण सहानुभूति, कलात्मक संवेदनशीलता और आध्यात्मिक ग्राह्यता — किन्तु अपनी और अवशोषित भावनाओं में भेद करने में पुरानी कठिनाई। मीन चन्द्र जातक मानसिक स्पंज — नियमित भावनात्मक शोधन। उत्तरभाद्रपद चन्द्र अनूठा शक्तिशाली संयोजन — शनि का अनुशासन मीन की सागरीय भावनात्मक प्रकृति को संरचना। रेवती चन्द्र सबसे पोषक अन्तिम स्थान — आत्माओं को घर ले जाने वाला रक्षक।' } },
            { title: { en: 'Meena in divisional charts', hi: 'विभागीय कुण्डलियों में मीन' }, content: { en: 'In Navamsha (D9), Meena indicates a spouse who is spiritually inclined, compassionate, artistic, and possibly connected to healing, music, or spiritual teaching. Marriage has a karmic, destined quality. In Dashamsha (D10), it suggests careers in healing arts, spiritual guidance, music, film, photography, charitable organizations, or any field that serves through compassion — hospitals, ashrams, rehabilitation centres, creative studios.', hi: 'नवांश (D9) में मीन जीवनसाथी को इंगित करता है जो आध्यात्मिक प्रवृत्ति, करुणामय, कलात्मक और सम्भवतः उपचार, संगीत या आध्यात्मिक शिक्षण से जुड़ा। विवाह में कार्मिक, नियतिगत गुण। दशमांश (D10) में उपचार कला, आध्यात्मिक मार्गदर्शन, संगीत, फिल्म, फोटोग्राफी, धर्मार्थ संगठन या करुणा से सेवा वाले क्षेत्र — अस्पताल, आश्रम, पुनर्वास केन्द्र, सृजनात्मक स्टूडियो।' } },
            { title: { en: 'Common misconceptions', hi: 'सामान्य भ्रान्तियाँ' }, content: { en: 'Misconception: Pisces is weak. Reality: Pisces\' strength is the strength of water — it cannot be broken, cut, or destroyed, and it eventually wears down the hardest stone. Misconception: Pisces is escapist. Reality: Pisces seeks transcendence — escapism is the shadow expression of a legitimate spiritual need for connection to something beyond the material. Misconception: Pisces cannot function in the real world. Reality: Jupiter rules Pisces — this is the same planet that rules Sagittarius, one of the most worldly signs. Pisces can be extraordinarily effective when spiritually grounded. Misconception: Pisces has no boundaries. Reality: Pisces has fluid boundaries — like a cell membrane that selectively admits what nourishes and repels what harms. The task is not to build walls but to train the membrane.', hi: 'भ्रान्ति: मीन कमज़ोर है। सत्य: मीन की शक्ति जल की शक्ति — तोड़ा, काटा नहीं जा सकता और अन्ततः कठोरतम पत्थर को भी घिस देता है। भ्रान्ति: मीन पलायनवादी है। सत्य: मीन पारलौकिकता चाहता है — भौतिक से परे जुड़ने की वैध आध्यात्मिक आवश्यकता की छाया अभिव्यक्ति। भ्रान्ति: मीन वास्तविक दुनिया में काम नहीं कर सकता। सत्य: गुरु मीन का शासक — यही ग्रह सबसे सांसारिक राशियों में से एक धनु का भी शासक। भ्रान्ति: मीन की सीमाएँ नहीं। सत्य: मीन की तरल सीमाएँ — कोशिका झिल्ली जैसी जो पोषण को चयनात्मक रूप से स्वीकार और हानि को रोकती है। कार्य दीवारें बनाना नहीं बल्कि झिल्ली प्रशिक्षित करना।' } },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
              <h4 className="text-gold-light font-bold text-sm mb-2" style={hf}>{ml(item.title)}</h4>
              <p className="text-text-primary text-sm leading-relaxed" style={bf}>{ml(item.content)}</p>
            </div>
          ))}
        </div>
        <WhyItMatters locale={locale}>
          {ml({ en: 'Reading Meena in a chart reveals where the native connects to the infinite, where compassion flows naturally, and where the dissolution of ego is both the highest calling and the deepest danger. The house where Pisces falls is where you merge with something greater than yourself — and where the challenge is to dissolve boundaries consciously, in service, rather than unconsciously, in escape.', hi: 'कुण्डली में मीन पढ़ना बताता है कि जातक कहाँ अनन्त से जुड़ता है, करुणा कहाँ स्वाभाविक रूप से बहती है, और अहंकार का विसर्जन कहाँ उच्चतम आह्वान और गहनतम खतरा दोनों है। जिस भाव में मीन पड़ता है वहाँ स्वयं से बड़ी किसी चीज़ में विलीन — और चुनौती है सीमाओं को सचेत रूप से सेवा में विलीन करना, अचेतन रूप से पलायन में नहीं।' })}
        </WhyItMatters>
      </LessonSection>

      {/* ── 12. Meena as House Cusp ── */}
      <LessonSection number={next()} title={ml({ en: 'Meena as House Cusp', hi: 'भाव शिखर के रूप में मीन' })}>
        <p style={bf} className="mb-3">{ml({ en: 'When Meena falls on different house cusps, it brings Jupiter and Ketu\'s spiritual, compassionate, and boundary-dissolving energy to that life domain. Here is how Pisces colours each house:', hi: 'जब मीन विभिन्न भाव शिखरों पर पड़ता है, तो वह उस जीवन क्षेत्र में गुरु और केतु की आध्यात्मिक, करुणामय और सीमा-विलीन ऊर्जा लाता है। यहाँ मीन प्रत्येक भाव को कैसे रंगता है:' })}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { house: '1st', effect: { en: 'Jupiter-ruled personality — compassionate, dreamy, spiritually inclined. Fluid appearance that changes with mood. Natural healer and empath. Others feel calm in this native\'s presence.', hi: 'गुरु शासित व्यक्तित्व — करुणामय, स्वप्निल, आध्यात्मिक प्रवृत्ति। मनोदशा से बदलता तरल रूप। स्वाभाविक चिकित्सक और सहानुभूतिशील। दूसरे इस जातक की उपस्थिति में शान्त।' } },
            { house: '2nd', effect: { en: 'Wealth through healing, spiritual services, or creative arts. Soft, melodious speech. Family values centred on compassion and spirituality. Financial boundaries may be weak — money flows in and out freely.', hi: 'उपचार, आध्यात्मिक सेवाओं या सृजनात्मक कलाओं से धन। कोमल, मधुर वाणी। करुणा और अध्यात्म वाले पारिवारिक मूल्य। वित्तीय सीमाएँ कमज़ोर — धन स्वतन्त्र रूप से आता-जाता।' } },
            { house: '3rd', effect: { en: 'Intuitive, poetic communication. Writing that touches the soul — poetry, spiritual literature, music lyrics. Deeply empathetic sibling bonds. Short travels for spiritual purposes.', hi: 'अन्तर्ज्ञानी, काव्यात्मक संवाद। आत्मा स्पर्शी लेखन — काव्य, आध्यात्मिक साहित्य, गीत। गहन सहानुभूतिपूर्ण भाई-बहन बन्धन। आध्यात्मिक उद्देश्यों से लघु यात्राएँ।' } },
            { house: '4th', effect: { en: 'Serene, spiritual home near water. Deep connection to mother and ancestral memory. Property may be near rivers or ocean. Emotional life is vast, deep, and connected to collective unconscious.', hi: 'जल निकट शान्त, आध्यात्मिक गृह। माता और पैतृक स्मृति से गहरा सम्बन्ध। नदियों या सागर निकट सम्पत्ति। भावनात्मक जीवन विशाल, गहरा और सामूहिक अचेतन से जुड़ा।' } },
            { house: '5th', effect: { en: 'Creative expression through music, poetry, film, and visionary art. Deeply romantic and idealistic in love. Children are sensitive and spiritually gifted. Intuition guides speculation — dreams as investment signals.', hi: 'संगीत, काव्य, फिल्म और दूरदर्शी कला से सृजनात्मक अभिव्यक्ति। प्रेम में गहन रोमांटिक और आदर्शवादी। सन्तान संवेदनशील और आध्यात्मिक रूप से प्रतिभाशाली। अन्तर्ज्ञान सट्टे का मार्गदर्शन — निवेश संकेतों के रूप में स्वप्न।' } },
            { house: '6th', effect: { en: 'Foot and immune system health issues. Service through healing, charity, and compassionate care. Enemies are hidden and work through deception. Illness may be psychosomatic — emotions directly create physical symptoms.', hi: 'पैर और प्रतिरक्षा तन्त्र स्वास्थ्य समस्याएँ। उपचार, दान और करुणामय देखभाल से सेवा। शत्रु छिपे और छल से। रोग मनोदैहिक — भावनाएँ सीधे शारीरिक लक्षण।' } },
            { house: '7th', effect: { en: 'Spouse is spiritual, artistic, compassionate, and possibly from a different world (culturally or spiritually). Marriage has a karmic, destined quality. Partnerships dissolve ego and teach surrender.', hi: 'जीवनसाथी आध्यात्मिक, कलात्मक, करुणामय और सम्भवतः भिन्न लोक (सांस्कृतिक या आध्यात्मिक) से। विवाह में कार्मिक, नियतिगत गुण। साझेदारियाँ अहंकार विलीन करती हैं और समर्पण सिखाती हैं।' } },
            { house: '8th', effect: { en: 'Profound spiritual transformation. Deep psychic and intuitive powers. Inheritance connected to spiritual or artistic legacy. Interest in past lives, near-death experiences, and consciousness after death.', hi: 'गहन आध्यात्मिक रूपान्तरण। गहरी मानसिक और अन्तर्ज्ञान शक्तियाँ। आध्यात्मिक या कलात्मक विरासत से विरासत। पूर्वजन्म, निकट-मृत्यु अनुभव और मृत्यु के बाद चेतना में रुचि।' } },
            { house: '9th', effect: { en: 'Dharma through devotional practice and compassionate service. Father is spiritual or absent (dissolved). Fortune through spiritual teaching and healing. Pilgrimage to sacred water bodies and ancient ashrams.', hi: 'भक्ति साधना और करुणामय सेवा से धर्म। पिता आध्यात्मिक या अनुपस्थित (विलीन)। आध्यात्मिक शिक्षण और उपचार से भाग्य। पवित्र जल निकायों और प्राचीन आश्रमों की तीर्थयात्रा।' } },
            { house: '10th', effect: { en: 'Career in healing arts, spiritual guidance, music, film, charity, or compassionate service. Public reputation for gentleness and spiritual depth. Career may lack clear structure but serves a transcendent purpose.', hi: 'उपचार कला, आध्यात्मिक मार्गदर्शन, संगीत, फिल्म, दान या करुणामय सेवा में करियर। कोमलता और आध्यात्मिक गहराई की सार्वजनिक प्रतिष्ठा। करियर में स्पष्ट संरचना की कमी किन्तु पारलौकिक उद्देश्य।' } },
            { house: '11th', effect: { en: 'Gains through spiritual networks and compassionate communities. Friends are artists, healers, and spiritual seekers. Aspirations involve universal service and alleviating collective suffering.', hi: 'आध्यात्मिक नेटवर्क और करुणामय समुदायों से लाभ। मित्र कलाकार, चिकित्सक और आध्यात्मिक खोजी। सार्वभौमिक सेवा और सामूहिक पीड़ा कम करने की आकांक्षाएँ।' } },
            { house: '12th', effect: { en: 'Pisces in its natural house — extraordinary moksha potential. Deep meditation capacity, vivid prophetic dreams, and natural connection to the divine. Foreign residence in spiritual communities. The ego dissolves here willingly — liberation is the natural destination.', hi: 'मीन अपने स्वाभाविक भाव में — असाधारण मोक्ष सम्भावना। गहन ध्यान क्षमता, स्पष्ट भविष्यसूचक स्वप्न और दिव्य से स्वाभाविक सम्बन्ध। आध्यात्मिक समुदायों में विदेशी निवास। अहंकार यहाँ स्वेच्छा से विलीन — मुक्ति स्वाभाविक गन्तव्य।' } },
          ].map((item, i) => (
            <div key={i} className="bg-bg-primary/50 rounded-lg border border-gold-primary/10 p-3">
              <span className="text-gold-light font-bold text-sm" style={hf}>{item.house} House</span>
              <p className="text-text-primary text-sm mt-1" style={bf}>{ml(item.effect)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ── Key Takeaway ── */}
      <KeyTakeaway locale={locale} points={[
        ml({ en: 'Meena (Pisces) is the twelfth and final sign — water element, mutable quality, ruled by Jupiter with Ketu as co-ruler. Spans 330°-360°.', hi: 'मीन बारहवीं और अंतिम राशि — जल तत्त्व, द्विस्वभाव, गुरु शासक केतु सह-स्वामी। 330°-360°।' }),
        ml({ en: 'Venus is exalted at 27°. Mercury is debilitated at 15°. Jupiter is in its own sign. Body: feet, lymphatic system, immune system.', hi: 'शुक्र 27° पर उच्च। बुध 15° पर नीच। गुरु स्वराशि में। शरीर: पैर, लसीका तन्त्र, प्रतिरक्षा तन्त्र।' }),
        ml({ en: 'Three nakshatras: Purva Bhadrapada pada 4 (Jupiter), Uttara Bhadrapada (Saturn), Revati (Mercury).', hi: 'तीन नक्षत्र: पूर्वभाद्रपद पद 4 (गुरु), उत्तरभाद्रपद (शनि), रेवती (बुध)।' }),
        ml({ en: 'Remedy: Yellow Sapphire, Thursday fasting, Vishnu/Krishna worship. The deepest remedy is selfless compassionate service — seva that dissolves ego.', hi: 'उपाय: पुखराज, गुरुवार व्रत, विष्णु/कृष्ण पूजा। गहनतम उपाय: निःस्वार्थ करुणामय सेवा — अहंकार विलीन करने वाली सेवा।' }),
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
