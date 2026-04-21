/**
 * Domain-specific planet-in-house interpretations for divisional (varga) charts.
 *
 * Currently covers the Navamsha (D9) marriage/dharma domain with 108 entries
 * (9 planets x 12 houses). Interpretations are rooted in classical Jyotish
 * sources (BPHS, Phaladeepika) and contextualised for D9 — they are NOT
 * generic D1 planet-in-house text.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus,
 *             6=Saturn, 7=Rahu, 8=Ketu
 * Houses: 1-12 (D9 house significations for marriage/dharma)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DomainPlacement = { en: string; hi: string };

// domain -> planetId -> house -> text
export type VargaPlanetTextMap = Record<
  string,
  Record<number, Record<number, DomainPlacement>>
>;

// ---------------------------------------------------------------------------
// Lookup helper
// ---------------------------------------------------------------------------

export function getVargaPlanetText(
  domain: string,
  planetId: number,
  house: number,
): DomainPlacement | null {
  return VARGA_PLANET_TEXT[domain]?.[planetId]?.[house] ?? null;
}

// ---------------------------------------------------------------------------
// D9 Marriage / Dharma interpretations — 108 entries
// ---------------------------------------------------------------------------

export const VARGA_PLANET_TEXT: VargaPlanetTextMap = {
  marriage: {
    // -----------------------------------------------------------------------
    // Sun (0) — authority, ego, soul purpose in marriage
    // -----------------------------------------------------------------------
    0: {
      1: {
        en: 'Sun in the D9 1st house gives a strong sense of identity within marriage. The native approaches partnership with confidence and may take a leadership role in the relationship.',
        hi: 'नवांश लग्न में सूर्य विवाह में आत्म-विश्वास और नेतृत्व प्रदान करता है। जातक साझेदारी में प्रमुख भूमिका निभाता है।',
      },
      2: {
        en: 'Sun in the D9 2nd house indicates authoritative speech in married life and pride in the family built through marriage. Wealth may come through government or father-in-law\'s side.',
        hi: 'नवांश के दूसरे भाव में सूर्य वैवाहिक जीवन में अधिकारपूर्ण वाणी और ससुराल पक्ष से धन का संकेत देता है।',
      },
      3: {
        en: 'Sun in the D9 3rd house shows courage and initiative in sustaining the marriage. The native puts conscious effort into the relationship and may have an influential brother-in-law.',
        hi: 'नवांश के तीसरे भाव में सूर्य विवाह को बनाए रखने में साहस और पहल दर्शाता है। देवर/जेठ प्रभावशाली हो सकते हैं।',
      },
      4: {
        en: 'Sun in the D9 4th house indicates a dignified domestic environment but possible ego clashes over household matters. The native seeks respect and recognition within the home.',
        hi: 'नवांश के चतुर्थ भाव में सूर्य गरिमामय गृहस्थ जीवन किंतु घरेलू मामलों में अहंकार टकराव का संकेत देता है।',
      },
      5: {
        en: 'Sun in the D9 5th house blesses romance with warmth and creative expression. Children from the marriage may be talented and self-assured, and the love life carries regal dignity.',
        hi: 'नवांश के पंचम भाव में सूर्य प्रेम में उष्णता और रचनात्मकता देता है। संतान प्रतिभाशाली और आत्मविश्वासी होती है।',
      },
      6: {
        en: 'Sun in the D9 6th house can create conflicts driven by ego and dominance in marriage. Health issues of the spouse may require attention, and service to the partner becomes a theme.',
        hi: 'नवांश के छठे भाव में सूर्य विवाह में अहंकारजनित विवाद उत्पन्न कर सकता है। जीवनसाथी के स्वास्थ्य पर ध्यान आवश्यक है।',
      },
      7: {
        en: 'Sun in the D9 7th house indicates a dominant, authoritative, and self-respecting spouse. The partner may hold a position of power or come from a prestigious family, but ego clashes in marriage are possible.',
        hi: 'नवांश सप्तम में सूर्य प्रभावशाली, आत्मसम्मानी जीवनसाथी का संकेत देता है। साथी उच्च पद पर हो सकता है, किंतु अहंकार टकराव संभव है।',
      },
      8: {
        en: 'Sun in the D9 8th house can bring transformation of identity through marriage. The father-in-law\'s wealth may fluctuate, and intimacy carries an element of power dynamics.',
        hi: 'नवांश अष्टम में सूर्य विवाह द्वारा पहचान में परिवर्तन लाता है। ससुर की संपत्ति में उतार-चढ़ाव और अंतरंगता में शक्ति गतिशीलता रहती है।',
      },
      9: {
        en: 'Sun in the D9 9th house is excellent for dharmic growth through marriage. The father-in-law is likely respected and influential, and the partnership elevates one\'s spiritual path.',
        hi: 'नवांश नवम में सूर्य विवाह से धार्मिक उन्नति के लिए उत्तम है। ससुर सम्मानित और प्रभावशाली होते हैं।',
      },
      10: {
        en: 'Sun in the D9 10th house grants public recognition as a couple. Marriage enhances career or social standing, and the native gains authority through the partnership.',
        hi: 'नवांश दशम में सूर्य दंपत्ति के रूप में सामाजिक प्रतिष्ठा प्रदान करता है। विवाह से करियर और सामाजिक स्थिति में वृद्धि होती है।',
      },
      11: {
        en: 'Sun in the D9 11th house brings fulfilment of desires through marriage. The couple\'s social circle includes influential people, and gains from the partnership are significant.',
        hi: 'नवांश एकादश में सूर्य विवाह से इच्छापूर्ति और प्रभावशाली सामाजिक वृत्त प्रदान करता है।',
      },
      12: {
        en: 'Sun in the D9 12th house may diminish ego in marriage, leading to spiritual surrender. Bedroom life may lack vitality, but foreign connections through the spouse are possible.',
        hi: 'नवांश द्वादश में सूर्य विवाह में अहंकार का क्षय और आध्यात्मिक समर्पण दर्शाता है। जीवनसाथी से विदेशी संबंध संभव हैं।',
      },
    },

    // -----------------------------------------------------------------------
    // Moon (1) — emotions, nurturing, mental connection in marriage
    // -----------------------------------------------------------------------
    1: {
      1: {
        en: 'Moon in the D9 1st house makes the native emotionally invested in marriage. The person brings nurturing energy to the partnership and values emotional security above all.',
        hi: 'नवांश लग्न में चंद्रमा जातक को विवाह में भावनात्मक रूप से समर्पित बनाता है। जातक साझेदारी में पोषण और भावनात्मक सुरक्षा को प्राथमिकता देता है।',
      },
      2: {
        en: 'Moon in the D9 2nd house indicates soft, loving communication with the spouse. The marital family environment is warm, and food/nourishment shared together strengthens the bond.',
        hi: 'नवांश द्वितीय में चंद्रमा जीवनसाथी के साथ कोमल और स्नेहपूर्ण संवाद का संकेत देता है। वैवाहिक पारिवारिक वातावरण स्नेहमय रहता है।',
      },
      3: {
        en: 'Moon in the D9 3rd house shows emotional effort to maintain the marriage. Communication with the spouse is heartfelt, and short journeys together bring happiness.',
        hi: 'नवांश तृतीय में चंद्रमा विवाह बनाए रखने में भावनात्मक प्रयास दर्शाता है। जीवनसाथी के साथ छोटी यात्राएं सुखदायी होती हैं।',
      },
      4: {
        en: 'Moon in the D9 4th house is a blessing for domestic happiness in marriage. The home environment is peaceful and emotionally nourishing, and the native finds deep comfort in married life.',
        hi: 'नवांश चतुर्थ में चंद्रमा वैवाहिक गृहस्थ सुख के लिए वरदान है। घर का वातावरण शांतिपूर्ण और भावनात्मक रूप से पोषक रहता है।',
      },
      5: {
        en: 'Moon in the D9 5th house brings deep emotional romance and strong desire for children. The love between partners is tender and intuitive, with a natural creative harmony.',
        hi: 'नवांश पंचम में चंद्रमा गहन भावनात्मक प्रेम और संतान की प्रबल इच्छा देता है। साझेदारों के बीच कोमल और सहज प्रेम रहता है।',
      },
      6: {
        en: 'Moon in the D9 6th house may bring emotional turbulence and worry in married life. The native tends to over-serve the spouse or struggle with mood-driven conflicts.',
        hi: 'नवांश षष्ठ में चंद्रमा वैवाहिक जीवन में भावनात्मक उथल-पुथल ला सकता है। जातक जीवनसाथी की अत्यधिक सेवा या मनोदशा-जनित विवादों से जूझता है।',
      },
      7: {
        en: 'Moon in the D9 7th house blesses the native with a nurturing, emotionally attuned, and caring spouse. The partner is sensitive, adaptive, and deeply connected at a feeling level.',
        hi: 'नवांश सप्तम में चंद्रमा पोषणकारी, भावनात्मक रूप से संवेदनशील और देखभाल करने वाला जीवनसाथी प्रदान करता है।',
      },
      8: {
        en: 'Moon in the D9 8th house creates intense emotional undercurrents in marriage. Intimacy is deep but may be tinged with insecurity; the native undergoes emotional transformation through the spouse.',
        hi: 'नवांश अष्टम में चंद्रमा विवाह में गहरी भावनात्मक धाराएं बनाता है। अंतरंगता गहन किंतु असुरक्षा से प्रभावित हो सकती है।',
      },
      9: {
        en: 'Moon in the D9 9th house connects emotions to dharma through marriage. The mother-in-law may be supportive, and the partnership inspires spiritual and philosophical growth.',
        hi: 'नवांश नवम में चंद्रमा विवाह से धर्म और भावनाओं का संयोग करता है। सास सहायक हो सकती हैं और साझेदारी आध्यात्मिक विकास को प्रेरित करती है।',
      },
      10: {
        en: 'Moon in the D9 10th house makes the marriage publicly visible and emotionally significant for career. The native\'s reputation is tied to how they are perceived as a spouse.',
        hi: 'नवांश दशम में चंद्रमा विवाह को सार्वजनिक रूप से दृश्यमान बनाता है। जातक की प्रतिष्ठा जीवनसाथी के रूप में उनकी छवि से जुड़ी होती है।',
      },
      11: {
        en: 'Moon in the D9 11th house fulfils emotional desires through marriage. The couple builds a warm social network, and friendships formed as a pair bring lasting happiness.',
        hi: 'नवांश एकादश में चंद्रमा विवाह से भावनात्मक इच्छाओं की पूर्ति करता है। दंपत्ति मिलकर स्नेहपूर्ण सामाजिक नेटवर्क बनाते हैं।',
      },
      12: {
        en: 'Moon in the D9 12th house indicates a private, introspective emotional life in marriage. Bedroom pleasures are emotionally rich, but the native may feel a sense of emotional isolation at times.',
        hi: 'नवांश द्वादश में चंद्रमा विवाह में एकांत और अंतर्मुखी भावनात्मक जीवन दर्शाता है। शयनकक्ष सुख भावनात्मक रूप से समृद्ध रहता है।',
      },
    },

    // -----------------------------------------------------------------------
    // Mars (2) — passion, energy, conflict in marriage
    // -----------------------------------------------------------------------
    2: {
      1: {
        en: 'Mars in the D9 1st house makes the native assertive and passionate in marriage. The person brings energy and drive to the partnership but must guard against being domineering.',
        hi: 'नवांश लग्न में मंगल जातक को विवाह में उत्साही और जोशीला बनाता है। साझेदारी में ऊर्जा लाता है किंतु दबंगता से बचना आवश्यक है।',
      },
      2: {
        en: 'Mars in the D9 2nd house can bring sharp or aggressive speech in married life. Financial arguments are possible, but the native also fights to protect family resources.',
        hi: 'नवांश द्वितीय में मंगल वैवाहिक जीवन में तीखी वाणी और आर्थिक विवाद ला सकता है, किंतु जातक परिवार की रक्षा हेतु संघर्ष भी करता है।',
      },
      3: {
        en: 'Mars in the D9 3rd house shows intense effort and courage in maintaining the marriage. The native is a fighter for the relationship and may have a bold sibling-in-law.',
        hi: 'नवांश तृतीय में मंगल विवाह बनाए रखने में तीव्र प्रयास और साहस दर्शाता है। जातक रिश्ते के लिए लड़ने वाला होता है।',
      },
      4: {
        en: 'Mars in the D9 4th house can disturb domestic peace due to heated arguments at home. However, it also gives the energy to build and protect the marital property.',
        hi: 'नवांश चतुर्थ में मंगल घर में गरमा-गरम बहस से गृहस्थ शांति भंग कर सकता है, किंतु वैवाहिक संपत्ति की रक्षा की ऊर्जा भी देता है।',
      },
      5: {
        en: 'Mars in the D9 5th house brings fiery romance and passionate love affairs. Children may be spirited and athletic. The courtship is intense and physically driven.',
        hi: 'नवांश पंचम में मंगल उग्र रोमांस और जोशीला प्रेम देता है। संतान उत्साही और खेलकूद में रुचि रखने वाली हो सकती है।',
      },
      6: {
        en: 'Mars in the D9 6th house is a classic indicator of marital conflict and disputes. Legal issues in marriage or health problems of an aggressive nature may arise. The native must consciously manage anger.',
        hi: 'नवांश षष्ठ में मंगल वैवाहिक विवाद और कानूनी समस्याओं का सूचक है। जातक को क्रोध पर नियंत्रण रखना आवश्यक है।',
      },
      7: {
        en: 'Mars in the D9 7th house (Manglik in D9) indicates a passionate, energetic, but potentially argumentative spouse. The partner is courageous and action-oriented, but temper and impulsiveness may strain the marriage.',
        hi: 'नवांश सप्तम में मंगल (नवांश मांगलिक) जोशीले किंतु संभावित रूप से झगड़ालू जीवनसाथी का संकेत देता है। साथी साहसी है किंतु क्रोध विवाह पर दबाव डाल सकता है।',
      },
      8: {
        en: 'Mars in the D9 8th house intensifies physical intimacy and may bring sudden transformations in marriage. Accidents or surgeries of the spouse are possible; the relationship undergoes periodic upheaval.',
        hi: 'नवांश अष्टम में मंगल शारीरिक अंतरंगता को तीव्र करता है और विवाह में अचानक परिवर्तन ला सकता है। रिश्ते में समय-समय पर उथल-पुथल होती है।',
      },
      9: {
        en: 'Mars in the D9 9th house channels passion into dharmic pursuits through marriage. The father-in-law may be in the military or engineering. The native fights for righteous causes alongside the spouse.',
        hi: 'नवांश नवम में मंगल विवाह के माध्यम से धार्मिक कार्यों में उत्साह देता है। ससुर सैन्य या तकनीकी क्षेत्र से हो सकते हैं।',
      },
      10: {
        en: 'Mars in the D9 10th house gives a power-couple dynamic. The marriage boosts career ambition, and the couple is known for their drive and competitive spirit in public life.',
        hi: 'नवांश दशम में मंगल शक्तिशाली दंपत्ति की गतिशीलता देता है। विवाह करियर महत्वाकांक्षा को बढ़ावा देता है।',
      },
      11: {
        en: 'Mars in the D9 11th house brings gains through marriage driven by the native\'s initiative. Desires are fulfilled through active effort, and the couple\'s social life is energetic.',
        hi: 'नवांश एकादश में मंगल जातक की पहल से विवाह द्वारा लाभ देता है। दंपत्ति का सामाजिक जीवन ऊर्जावान रहता है।',
      },
      12: {
        en: 'Mars in the D9 12th house brings intense bedroom passion but also potential for hidden anger in marriage. Expenses due to disputes or foreign settlement with the spouse are indicated.',
        hi: 'नवांश द्वादश में मंगल शयनकक्ष में तीव्र जुनून किंतु विवाह में छिपे क्रोध की संभावना देता है। विवादों से व्यय या विदेश बसने का संकेत है।',
      },
    },

    // -----------------------------------------------------------------------
    // Mercury (3) — communication, intellect, adaptability in marriage
    // -----------------------------------------------------------------------
    3: {
      1: {
        en: 'Mercury in the D9 1st house makes the native witty, communicative, and adaptable in marriage. The person approaches partnership with intellect and a youthful charm.',
        hi: 'नवांश लग्न में बुध जातक को विवाह में हाजिरजवाब, संवादशील और अनुकूलनशील बनाता है। साझेदारी में बौद्धिकता और युवा आकर्षण लाता है।',
      },
      2: {
        en: 'Mercury in the D9 2nd house blesses married life with articulate, pleasant speech and good financial planning. Communication with the spouse\'s family is smooth and diplomatic.',
        hi: 'नवांश द्वितीय में बुध वैवाहिक जीवन में स्पष्ट, मधुर वाणी और अच्छी वित्तीय योजना का वरदान देता है।',
      },
      3: {
        en: 'Mercury in the D9 3rd house enhances intellectual connection and communication in marriage. The couple enjoys shared learning, writing, or short travels together.',
        hi: 'नवांश तृतीय में बुध विवाह में बौद्धिक संबंध और संवाद को बढ़ाता है। दंपत्ति साथ मिलकर सीखने और यात्रा का आनंद लेते हैं।',
      },
      4: {
        en: 'Mercury in the D9 4th house creates a home environment filled with books, learning, and lively conversation. Domestic happiness comes through intellectual compatibility with the spouse.',
        hi: 'नवांश चतुर्थ में बुध पुस्तकों, ज्ञान और जीवंत संवाद से भरा गृह वातावरण बनाता है। बौद्धिक अनुकूलता से गृहस्थ सुख मिलता है।',
      },
      5: {
        en: 'Mercury in the D9 5th house brings playful, cerebral romance. Love is expressed through words, humor, and intellectual games. Children from the marriage may be academically gifted.',
        hi: 'नवांश पंचम में बुध चंचल और बौद्धिक प्रेम देता है। प्रेम शब्दों और हास्य से व्यक्त होता है। संतान शैक्षणिक रूप से प्रतिभाशाली हो सकती है।',
      },
      6: {
        en: 'Mercury in the D9 6th house may bring arguments rooted in over-analysis and criticism in marriage. However, the native is skilled at resolving disputes through negotiation and logic.',
        hi: 'नवांश षष्ठ में बुध अत्यधिक विश्लेषण और आलोचना से वैवाहिक विवाद ला सकता है, किंतु जातक बातचीत से विवाद सुलझाने में कुशल होता है।',
      },
      7: {
        en: 'Mercury in the D9 7th house indicates a youthful, intelligent, and communicative spouse. The partner is likely skilled in commerce, writing, or speech. The marriage thrives on mental rapport.',
        hi: 'नवांश सप्तम में बुध युवा, बुद्धिमान और संवादशील जीवनसाथी का संकेत देता है। विवाह मानसिक तालमेल पर फलता-फूलता है।',
      },
      8: {
        en: 'Mercury in the D9 8th house gives a research-oriented approach to intimacy and the hidden aspects of marriage. The native may investigate the spouse\'s secrets or handle joint finances analytically.',
        hi: 'नवांश अष्टम में बुध अंतरंगता और विवाह के छिपे पहलुओं में शोधपरक दृष्टिकोण देता है। संयुक्त वित्त का विश्लेषणात्मक प्रबंधन करता है।',
      },
      9: {
        en: 'Mercury in the D9 9th house combines intellect with dharma through marriage. The couple grows together through study of scriptures, philosophy, or higher education.',
        hi: 'नवांश नवम में बुध विवाह से बुद्धि और धर्म का संयोग करता है। दंपत्ति शास्त्र अध्ययन और दर्शन से साथ बढ़ते हैं।',
      },
      10: {
        en: 'Mercury in the D9 10th house means the couple is known for their intellectual contributions. Marriage supports career in communication, media, or business, and the pair is publicly articulate.',
        hi: 'नवांश दशम में बुध दंपत्ति को बौद्धिक योगदान के लिए जाना जाता है। विवाह संचार या व्यापार में करियर का समर्थन करता है।',
      },
      11: {
        en: 'Mercury in the D9 11th house brings gains through the spouse\'s networking and communication skills. Desires in marriage are met through strategic thinking and social adaptability.',
        hi: 'नवांश एकादश में बुध जीवनसाथी के नेटवर्किंग कौशल से लाभ देता है। रणनीतिक सोच और सामाजिक अनुकूलता से इच्छाएं पूरी होती हैं।',
      },
      12: {
        en: 'Mercury in the D9 12th house may cause overthinking about marriage or anxiety in private moments. However, it favours foreign connections and imaginative bedroom conversation.',
        hi: 'नवांश द्वादश में बुध विवाह के बारे में अत्यधिक सोच या निजी क्षणों में चिंता ला सकता है, किंतु विदेशी संबंधों के लिए अनुकूल है।',
      },
    },

    // -----------------------------------------------------------------------
    // Jupiter (4) — wisdom, dharma, blessing in marriage
    // -----------------------------------------------------------------------
    4: {
      1: {
        en: 'Jupiter in the D9 1st house is one of the finest placements for marriage. The native brings wisdom, generosity, and dharmic values to the partnership, earning the spouse\'s deep respect.',
        hi: 'नवांश लग्न में गुरु विवाह के लिए सर्वोत्तम स्थितियों में से एक है। जातक साझेदारी में ज्ञान, उदारता और धार्मिक मूल्य लाता है।',
      },
      2: {
        en: 'Jupiter in the D9 2nd house blesses the marital family with prosperity, sweet speech, and traditional values. Wealth accumulates steadily through the marriage.',
        hi: 'नवांश द्वितीय में गुरु वैवाहिक परिवार को समृद्धि, मधुर वाणी और पारंपरिक मूल्यों का आशीर्वाद देता है।',
      },
      3: {
        en: 'Jupiter in the D9 3rd house guides marital efforts with wisdom. The native supports the spouse through wise counsel, and relationships with in-law siblings are harmonious.',
        hi: 'नवांश तृतीय में गुरु वैवाहिक प्रयासों को ज्ञान से मार्गदर्शित करता है। ननद-देवर संबंध सौहार्दपूर्ण रहते हैं।',
      },
      4: {
        en: 'Jupiter in the D9 4th house gives expansive domestic happiness and a spacious, prosperous home through marriage. Emotional security is abundant, and the home becomes a place of learning.',
        hi: 'नवांश चतुर्थ में गुरु विवाह से विशाल गृहस्थ सुख और समृद्ध घर प्रदान करता है। घर ज्ञान का केंद्र बनता है।',
      },
      5: {
        en: 'Jupiter in the D9 5th house is excellent for children and romance. The love between spouses has a spiritual quality, children are blessed and virtuous, and creative expression flourishes.',
        hi: 'नवांश पंचम में गुरु संतान और प्रेम के लिए उत्तम है। पति-पत्नी का प्रेम आध्यात्मिक गुण रखता है और संतान सद्गुणी होती है।',
      },
      6: {
        en: 'Jupiter in the D9 6th house can mitigate marital conflicts through wisdom, but its placement here still indicates some obstacles in marriage. The native overcomes disputes through patience and dharma.',
        hi: 'नवांश षष्ठ में गुरु ज्ञान से वैवाहिक विवादों को कम कर सकता है, किंतु कुछ बाधाएं रहती हैं। जातक धैर्य और धर्म से विवाद पार करता है।',
      },
      7: {
        en: 'Jupiter in the D9 7th house is a classical blessing for marriage. The spouse is wise, generous, righteous, and well-educated. The partnership is built on mutual respect, shared values, and spiritual growth.',
        hi: 'नवांश सप्तम में गुरु विवाह के लिए शास्त्रीय आशीर्वाद है। जीवनसाथी ज्ञानी, उदार, धर्मपरायण और सुशिक्षित होता है।',
      },
      8: {
        en: 'Jupiter in the D9 8th house protects the marriage through crises and brings wisdom from transformative experiences. Inheritance from in-laws is possible, and the native finds meaning in marital challenges.',
        hi: 'नवांश अष्टम में गुरु संकटों में विवाह की रक्षा करता है। ससुराल से विरासत संभव है और जातक वैवाहिक चुनौतियों में अर्थ खोजता है।',
      },
      9: {
        en: 'Jupiter in the D9 9th house is the most powerful placement for dharmic marriage. The couple walks a spiritual path together, the father-in-law is a guiding figure, and the marriage is a vehicle for moksha.',
        hi: 'नवांश नवम में गुरु धार्मिक विवाह के लिए सर्वाधिक शक्तिशाली स्थिति है। दंपत्ति साथ आध्यात्मिक मार्ग पर चलते हैं।',
      },
      10: {
        en: 'Jupiter in the D9 10th house elevates the couple\'s public standing through righteousness. Marriage supports a career in teaching, law, or advisory, and the pair is respected in society.',
        hi: 'नवांश दशम में गुरु धार्मिकता से दंपत्ति की सार्वजनिक प्रतिष्ठा बढ़ाता है। दंपत्ति समाज में सम्मानित होते हैं।',
      },
      11: {
        en: 'Jupiter in the D9 11th house fulfils the highest aspirations through marriage. Gains are abundant and ethically earned, and the couple\'s friend circle is wise and supportive.',
        hi: 'नवांश एकादश में गुरु विवाह से उच्चतम आकांक्षाओं की पूर्ति करता है। लाभ प्रचुर और नैतिक होते हैं।',
      },
      12: {
        en: 'Jupiter in the D9 12th house brings spiritual liberation through marriage. Bedroom life is blessed, and the spouse may have foreign or spiritual connections. Expenses are on charitable or religious causes.',
        hi: 'नवांश द्वादश में गुरु विवाह से आध्यात्मिक मुक्ति देता है। शयनकक्ष सुख आशीर्वादित रहता है और व्यय धार्मिक कार्यों पर होता है।',
      },
    },

    // -----------------------------------------------------------------------
    // Venus (5) — love, beauty, sensuality in marriage
    // -----------------------------------------------------------------------
    5: {
      1: {
        en: 'Venus in the D9 1st house blesses the native with charm, grace, and attractiveness in marriage. The person is a naturally loving partner who values beauty and harmony in the relationship.',
        hi: 'नवांश लग्न में शुक्र जातक को विवाह में आकर्षण, शालीनता और सौंदर्य का आशीर्वाद देता है। जातक स्वाभाविक रूप से प्रेमी साथी होता है।',
      },
      2: {
        en: 'Venus in the D9 2nd house enriches the marital family with wealth, fine tastes, and sweet speech. The couple enjoys good food, art, and material comfort together.',
        hi: 'नवांश द्वितीय में शुक्र वैवाहिक परिवार को धन, उत्तम रुचि और मधुर वाणी से समृद्ध करता है।',
      },
      3: {
        en: 'Venus in the D9 3rd house brings artistic expression and romantic communication in marriage. The couple shares creative hobbies, and the sister-in-law may be charming.',
        hi: 'नवांश तृतीय में शुक्र विवाह में कलात्मक अभिव्यक्ति और रोमांटिक संवाद लाता है। दंपत्ति रचनात्मक शौक साझा करते हैं।',
      },
      4: {
        en: 'Venus in the D9 4th house creates a beautiful, comfortable home filled with luxury and emotional warmth. Domestic happiness in marriage is exceptional, and the couple takes pride in their living space.',
        hi: 'नवांश चतुर्थ में शुक्र विलासिता और भावनात्मक उष्णता से भरा सुंदर, आरामदायक घर बनाता है। वैवाहिक गृहस्थ सुख असाधारण होता है।',
      },
      5: {
        en: 'Venus in the D9 5th house is one of the strongest placements for romantic love. The courtship is deeply romantic, creative expression flourishes through love, and children are beautiful and artistically inclined.',
        hi: 'नवांश पंचम में शुक्र प्रेम के लिए सर्वाधिक शक्तिशाली स्थितियों में से एक है। प्रणय अत्यंत रोमांटिक होता है और संतान सुंदर व कलात्मक होती है।',
      },
      6: {
        en: 'Venus in the D9 6th house can bring disharmony in marriage through indulgence or infidelity issues. The native must guard against taking the spouse for granted or seeking pleasure outside the bond.',
        hi: 'नवांश षष्ठ में शुक्र भोग-विलास या विश्वासघात से वैवाहिक असामंजस्य ला सकता है। जातक को साथी को हल्के में लेने से बचना चाहिए।',
      },
      7: {
        en: 'Venus in the D9 7th house is the most auspicious placement for a harmonious spouse. The partner is beautiful, artistic, loving, and devoted. The marriage is aesthetically rich, sensually fulfilling, and deeply affectionate.',
        hi: 'नवांश सप्तम में शुक्र सामंजस्यपूर्ण जीवनसाथी के लिए सर्वाधिक शुभ स्थिति है। साथी सुंदर, कलात्मक, प्रेमी और समर्पित होता है।',
      },
      8: {
        en: 'Venus in the D9 8th house deepens physical intimacy and brings transformative love. The marriage has an element of mystery and intensity; the native may receive wealth or luxury through the spouse\'s family.',
        hi: 'नवांश अष्टम में शुक्र शारीरिक अंतरंगता को गहरा करता है और रूपांतरकारी प्रेम लाता है। ससुराल से धन या विलासिता प्राप्त हो सकती है।',
      },
      9: {
        en: 'Venus in the D9 9th house combines love with dharma beautifully. The marriage has a devotional quality, the couple shares religious practices, and the father-in-law is cultured and supportive.',
        hi: 'नवांश नवम में शुक्र प्रेम और धर्म का सुंदर संयोग करता है। विवाह में भक्ति का गुण रहता है और ससुर सुसंस्कृत होते हैं।',
      },
      10: {
        en: 'Venus in the D9 10th house gives the couple a glamorous public image. Marriage supports careers in art, fashion, entertainment, or diplomacy, and the pair is admired in social circles.',
        hi: 'नवांश दशम में शुक्र दंपत्ति को आकर्षक सार्वजनिक छवि देता है। विवाह कला, फैशन या मनोरंजन में करियर का समर्थन करता है।',
      },
      11: {
        en: 'Venus in the D9 11th house fulfils romantic and material desires through marriage. The couple enjoys a rich social life, and friendships formed together are joyful and lasting.',
        hi: 'नवांश एकादश में शुक्र विवाह से रोमांटिक और भौतिक इच्छाओं की पूर्ति करता है। दंपत्ति समृद्ध सामाजिक जीवन का आनंद लेते हैं।',
      },
      12: {
        en: 'Venus in the D9 12th house is excellent for bedroom pleasures and spiritual love. The native may marry someone from a foreign land or find that the deepest marital connection happens in private, intimate moments.',
        hi: 'नवांश द्वादश में शुक्र शयनकक्ष सुख और आध्यात्मिक प्रेम के लिए उत्तम है। जातक विदेशी व्यक्ति से विवाह कर सकता है।',
      },
    },

    // -----------------------------------------------------------------------
    // Saturn (6) — delay, endurance, duty in marriage
    // -----------------------------------------------------------------------
    6: {
      1: {
        en: 'Saturn in the D9 1st house makes the native serious, responsible, and mature in marriage. The person approaches partnership as a duty, which can feel heavy but builds an enduring bond.',
        hi: 'नवांश लग्न में शनि जातक को विवाह में गंभीर, जिम्मेदार और परिपक्व बनाता है। साझेदारी को कर्तव्य के रूप में अपनाता है जो स्थायी बंधन बनाता है।',
      },
      2: {
        en: 'Saturn in the D9 2nd house may restrict wealth in early married life but builds it steadily over time. Speech with the spouse is measured and sometimes cold, yet financially disciplined.',
        hi: 'नवांश द्वितीय में शनि प्रारंभिक वैवाहिक जीवन में धन सीमित कर सकता है किंतु समय के साथ स्थिर रूप से बढ़ाता है।',
      },
      3: {
        en: 'Saturn in the D9 3rd house requires persistent effort to keep the marriage alive. Communication may be slow or strained, but the bond is resilient. Relationships with in-law siblings need patience.',
        hi: 'नवांश तृतीय में शनि विवाह को जीवित रखने के लिए निरंतर प्रयास की आवश्यकता देता है। संवाद धीमा किंतु बंधन लचीला होता है।',
      },
      4: {
        en: 'Saturn in the D9 4th house can limit domestic happiness initially — the home may feel austere or there may be property disputes. Over time, however, the marriage builds a solid, stable foundation.',
        hi: 'नवांश चतुर्थ में शनि प्रारंभ में गृहस्थ सुख सीमित कर सकता है, किंतु समय के साथ विवाह मजबूत नींव पर टिकता है।',
      },
      5: {
        en: 'Saturn in the D9 5th house can delay children or make romance feel constrained. Love matures slowly, and the native must learn to express affection despite Saturn\'s reserve.',
        hi: 'नवांश पंचम में शनि संतान में विलंब या प्रेम में संकोच ला सकता है। प्रेम धीरे-धीरे परिपक्व होता है।',
      },
      6: {
        en: 'Saturn in the D9 6th house can bring chronic low-grade friction in marriage and health issues that affect the relationship. The native serves the spouse out of duty, which can feel burdensome.',
        hi: 'नवांश षष्ठ में शनि विवाह में दीर्घकालिक हल्का तनाव और स्वास्थ्य समस्याएं ला सकता है। जातक कर्तव्यवश जीवनसाथी की सेवा करता है।',
      },
      7: {
        en: 'Saturn in the D9 7th house classically indicates a delayed but durable marriage. The spouse is mature, responsible, possibly older, and the relationship deepens with age. Early years may feel cold or distant.',
        hi: 'नवांश सप्तम में शनि विलंबित किंतु टिकाऊ विवाह का शास्त्रीय संकेत है। जीवनसाथी परिपक्व और जिम्मेदार होता है। रिश्ता उम्र के साथ गहरा होता है।',
      },
      8: {
        en: 'Saturn in the D9 8th house brings longevity to the marriage but also chronic struggles with intimacy or in-law finances. Transformation through the relationship is slow and sometimes painful.',
        hi: 'नवांश अष्टम में शनि विवाह को दीर्घायु देता है किंतु अंतरंगता या ससुराल वित्त में दीर्घकालिक संघर्ष भी लाता है।',
      },
      9: {
        en: 'Saturn in the D9 9th house brings dharmic discipline through marriage. The father-in-law may be strict or absent, and the couple\'s spiritual journey is one of structured, patient practice.',
        hi: 'नवांश नवम में शनि विवाह से धार्मिक अनुशासन लाता है। ससुर कड़क या अनुपस्थित हो सकते हैं। आध्यात्मिक यात्रा धैर्यपूर्ण होती है।',
      },
      10: {
        en: 'Saturn in the D9 10th house makes the couple respected for their hard work and perseverance. Marriage may feel like a business partnership at times, but it builds lasting social credibility.',
        hi: 'नवांश दशम में शनि दंपत्ति को कठोर परिश्रम और दृढ़ता के लिए सम्मान दिलाता है। विवाह स्थायी सामाजिक विश्वसनीयता बनाता है।',
      },
      11: {
        en: 'Saturn in the D9 11th house brings slow but steady fulfilment of desires through marriage. Gains come through discipline and patience, and the couple\'s social circle values reliability.',
        hi: 'नवांश एकादश में शनि विवाह से इच्छाओं की धीमी किंतु स्थिर पूर्ति देता है। लाभ अनुशासन और धैर्य से आते हैं।',
      },
      12: {
        en: 'Saturn in the D9 12th house may bring sorrow, separation, or heavy expenses in marriage. Bedroom life may lack warmth, but the placement can also indicate deep spiritual surrender through marital hardship.',
        hi: 'नवांश द्वादश में शनि विवाह में दुःख, वियोग या भारी व्यय ला सकता है। वैवाहिक कठिनाई से गहन आध्यात्मिक समर्पण संभव है।',
      },
    },

    // -----------------------------------------------------------------------
    // Rahu (7) — unconventional, obsession, foreign in marriage
    // -----------------------------------------------------------------------
    7: {
      1: {
        en: 'Rahu in the D9 1st house gives an unconventional approach to marriage. The native may project a deceptive image in relationships or be drawn to non-traditional partnership models.',
        hi: 'नवांश लग्न में राहु विवाह के प्रति अपरंपरागत दृष्टिकोण देता है। जातक गैर-पारंपरिक साझेदारी मॉडल की ओर आकर्षित हो सकता है।',
      },
      2: {
        en: 'Rahu in the D9 2nd house may bring unusual wealth through marriage or deceptive speech patterns. The marital family dynamics can be complex, involving mixed cultural or religious backgrounds.',
        hi: 'नवांश द्वितीय में राहु विवाह से असामान्य धन या भ्रामक वाणी ला सकता है। वैवाहिक पारिवारिक गतिशीलता मिश्रित सांस्कृतिक पृष्ठभूमि से जटिल होती है।',
      },
      3: {
        en: 'Rahu in the D9 3rd house amplifies ambition and unconventional communication in marriage. The native uses strategic or manipulative effort to maintain the relationship.',
        hi: 'नवांश तृतीय में राहु विवाह में महत्वाकांक्षा और अपरंपरागत संवाद को बढ़ाता है। जातक रिश्ते को बनाए रखने में रणनीतिक प्रयास करता है।',
      },
      4: {
        en: 'Rahu in the D9 4th house can create restlessness at home and dissatisfaction with domestic life. The native may seek constant change in living arrangements or feel emotionally ungrounded in marriage.',
        hi: 'नवांश चतुर्थ में राहु घर में बेचैनी और गृहस्थ जीवन से असंतोष पैदा कर सकता है। जातक विवाह में भावनात्मक रूप से अस्थिर महसूस कर सकता है।',
      },
      5: {
        en: 'Rahu in the D9 5th house brings intense, obsessive romance and unconventional love affairs. There may be unusual circumstances around children, or the native seeks excitement over stability in love.',
        hi: 'नवांश पंचम में राहु तीव्र, जुनूनी प्रेम और अपरंपरागत प्रेम संबंध लाता है। संतान के विषय में असामान्य परिस्थितियां हो सकती हैं।',
      },
      6: {
        en: 'Rahu in the D9 6th house amplifies conflicts in marriage through obsessive grievances or hidden enemies. Legal battles over marriage and deceptive adversaries are possible.',
        hi: 'नवांश षष्ठ में राहु जुनूनी शिकायतों से वैवाहिक विवादों को बढ़ाता है। विवाह को लेकर कानूनी लड़ाई और छिपे शत्रु संभव हैं।',
      },
      7: {
        en: 'Rahu in the D9 7th house indicates an unconventional, foreign, or cross-cultural spouse. The partner may be from a different background, community, or country. The marriage is intense and karmic but can involve illusion or deception.',
        hi: 'नवांश सप्तम में राहु अपरंपरागत, विदेशी या अंतर-सांस्कृतिक जीवनसाथी का संकेत देता है। विवाह तीव्र और कार्मिक होता है किंतु भ्रम संभव है।',
      },
      8: {
        en: 'Rahu in the D9 8th house intensifies the transformative power of marriage to an extreme. Sudden events, hidden wealth, or taboo experiences through the spouse are indicated. Intimacy has an obsessive quality.',
        hi: 'नवांश अष्टम में राहु विवाह की रूपांतरकारी शक्ति को चरम तक ले जाता है। अंतरंगता में जुनूनी गुण और छिपा धन संभव है।',
      },
      9: {
        en: 'Rahu in the D9 9th house may disrupt traditional dharmic values in marriage. The native might question conventional religious practices or marry outside their faith. The father-in-law may be unconventional.',
        hi: 'नवांश नवम में राहु विवाह में पारंपरिक धार्मिक मूल्यों को बाधित कर सकता है। जातक अपने धर्म के बाहर विवाह कर सकता है।',
      },
      10: {
        en: 'Rahu in the D9 10th house gives an ambitious public image as a couple. The marriage may be a vehicle for social climbing, and the pair projects an image that may differ from private reality.',
        hi: 'नवांश दशम में राहु दंपत्ति को महत्वाकांक्षी सार्वजनिक छवि देता है। विवाह सामाजिक उन्नति का साधन हो सकता है।',
      },
      11: {
        en: 'Rahu in the D9 11th house amplifies material desires in marriage. Gains through the spouse may come from unconventional sources, and the couple\'s social circle is diverse and possibly influential.',
        hi: 'नवांश एकादश में राहु विवाह में भौतिक इच्छाओं को बढ़ाता है। जीवनसाथी से अपरंपरागत स्रोतों से लाभ और विविध सामाजिक वृत्त संभव है।',
      },
      12: {
        en: 'Rahu in the D9 12th house can bring foreign settlement through marriage or unusual bedroom experiences. The native may feel a persistent void or dissatisfaction in the private sphere of married life.',
        hi: 'नवांश द्वादश में राहु विवाह से विदेश बसने या असामान्य शयनकक्ष अनुभव ला सकता है। वैवाहिक निजी जीवन में असंतोष संभव है।',
      },
    },

    // -----------------------------------------------------------------------
    // Ketu (8) — detachment, past life, spirituality in marriage
    // -----------------------------------------------------------------------
    8: {
      1: {
        en: 'Ketu in the D9 1st house creates a sense of detachment from the identity of being a spouse. The native may feel internally disconnected from marriage despite outward participation.',
        hi: 'नवांश लग्न में केतु जीवनसाथी की पहचान से वैराग्य की भावना बनाता है। बाहरी भागीदारी के बावजूद जातक आंतरिक रूप से विवाह से विरक्त महसूस कर सकता है।',
      },
      2: {
        en: 'Ketu in the D9 2nd house may cause disinterest in accumulating wealth through marriage. Speech with the spouse can be cryptic or minimal, and family traditions may be neglected.',
        hi: 'नवांश द्वितीय में केतु विवाह से धन संचय में अरुचि ला सकता है। जीवनसाथी से संवाद न्यूनतम और पारिवारिक परंपराएं उपेक्षित हो सकती हैं।',
      },
      3: {
        en: 'Ketu in the D9 3rd house indicates past-life skill in maintaining relationships that now manifests as effortless but detached support. The native intuitively knows what the marriage needs.',
        hi: 'नवांश तृतीय में केतु रिश्ते बनाए रखने में पूर्वजन्म कौशल दर्शाता है जो सहज किंतु विरक्त सहायता के रूप में प्रकट होता है।',
      },
      4: {
        en: 'Ketu in the D9 4th house can create emotional detachment from domestic life. The native may feel restless at home or disinterested in material comforts of marriage, seeking inner peace instead.',
        hi: 'नवांश चतुर्थ में केतु गृहस्थ जीवन से भावनात्मक विरक्ति बना सकता है। जातक भौतिक सुखों के बजाय आंतरिक शांति की खोज करता है।',
      },
      5: {
        en: 'Ketu in the D9 5th house may bring unusual or spiritually significant children. Romance has a past-life quality — love feels ancient and familiar. Creative expression is intuitive but unconventional.',
        hi: 'नवांश पंचम में केतु आध्यात्मिक रूप से महत्वपूर्ण संतान ला सकता है। प्रेम में पूर्वजन्म का गुण — प्राचीन और परिचित अनुभव होता है।',
      },
      6: {
        en: 'Ketu in the D9 6th house can dissolve marital conflicts through spiritual acceptance. The native may be indifferent to petty disputes, which either resolves them or causes frustration in the spouse.',
        hi: 'नवांश षष्ठ में केतु आध्यात्मिक स्वीकृति से वैवाहिक विवाद को भंग कर सकता है। जातक छोटे विवादों के प्रति उदासीन रहता है।',
      },
      7: {
        en: 'Ketu in the D9 7th house indicates a deep past-life connection with the spouse, leading to either a profoundly spiritual partnership or detachment from marriage altogether. The partner may be ascetic, introverted, or spiritually inclined.',
        hi: 'नवांश सप्तम में केतु जीवनसाथी से गहन पूर्वजन्म संबंध दर्शाता है — गहन आध्यात्मिक साझेदारी या विवाह से पूर्ण विरक्ति। साथी आध्यात्मिक प्रवृत्ति का होता है।',
      },
      8: {
        en: 'Ketu in the D9 8th house brings mystical experiences in intimacy and a sense of having lived through these transformations before. The native is unafraid of marital upheavals, viewing them as karmic purification.',
        hi: 'नवांश अष्टम में केतु अंतरंगता में रहस्यमय अनुभव और कार्मिक शुद्धि के रूप में वैवाहिक उथल-पुथल को देखने का भाव देता है।',
      },
      9: {
        en: 'Ketu in the D9 9th house gives natural, intuitive spiritual wisdom through marriage. The native may already possess dharmic understanding from past lives and needs no formal religious instruction.',
        hi: 'नवांश नवम में केतु विवाह से स्वाभाविक, सहज आध्यात्मिक ज्ञान देता है। जातक को पूर्वजन्म से धार्मिक समझ प्राप्त होती है।',
      },
      10: {
        en: 'Ketu in the D9 10th house makes the native indifferent to public perception of the marriage. The couple may shun social visibility, preferring a private and unassuming life together.',
        hi: 'नवांश दशम में केतु जातक को विवाह की सार्वजनिक धारणा के प्रति उदासीन बनाता है। दंपत्ति सामाजिक दृश्यता से दूर निजी जीवन पसंद करते हैं।',
      },
      11: {
        en: 'Ketu in the D9 11th house detaches the native from material gains through marriage. Desires are few, and the couple may find that worldly ambitions dissolve in favour of spiritual contentment.',
        hi: 'नवांश एकादश में केतु जातक को विवाह से भौतिक लाभ के प्रति विरक्त करता है। सांसारिक महत्वाकांक्षाएं आध्यात्मिक संतोष में विलीन हो जाती हैं।',
      },
      12: {
        en: 'Ketu in the D9 12th house is a powerful indicator of moksha through marriage. The native finds ultimate liberation in surrendering to the spiritual dimension of the partnership. Bedroom life may be minimal but deeply transcendent.',
        hi: 'नवांश द्वादश में केतु विवाह से मोक्ष का शक्तिशाली सूचक है। साझेदारी के आध्यात्मिक आयाम में समर्पण से जातक मुक्ति पाता है।',
      },
    },
  },

  // ---------------------------------------------------------------------------
  // D10 Career / Profession (Dashamsha) interpretations — 108 entries
  // ---------------------------------------------------------------------------

  career: {
    // -----------------------------------------------------------------------
    // Sun (0) — authority, leadership, government, personal branding
    // -----------------------------------------------------------------------
    0: {
      1: {
        en: 'Sun in the D10 1st house creates a powerful professional identity. Colleagues see you as a natural authority figure, and personal branding comes effortlessly — your career is an extension of who you are.',
        hi: 'दशमांश लग्न में सूर्य शक्तिशाली व्यावसायिक पहचान बनाता है। सहकर्मी आपको स्वाभाविक अधिकारी मानते हैं और करियर आपकी पहचान का विस्तार होता है।',
      },
      2: {
        en: 'Sun in the D10 2nd house indicates strong income from authoritative positions. Your professional communication carries weight, and you earn through government, administration, or leadership roles.',
        hi: 'दशमांश द्वितीय में सूर्य अधिकारपूर्ण पदों से अच्छी आय दर्शाता है। आपकी व्यावसायिक वाणी में प्रभाव होता है।',
      },
      3: {
        en: 'Sun in the D10 3rd house gives courage and initiative in career pursuits. You excel in marketing, sales, or any field requiring bold communication and short business travels.',
        hi: 'दशमांश तृतीय में सूर्य करियर में साहस और पहल देता है। विपणन, बिक्री या साहसिक संवाद वाले क्षेत्रों में उत्कृष्टता मिलती है।',
      },
      4: {
        en: 'Sun in the D10 4th house indicates a prestigious workplace and emotional pride in your profession. You may work from an impressive office or hold authority over workplace property and assets.',
        hi: 'दशमांश चतुर्थ में सूर्य प्रतिष्ठित कार्यस्थल और पेशे में भावनात्मक गर्व दर्शाता है। प्रभावशाली कार्यालय या संपत्ति पर अधिकार संभव है।',
      },
      5: {
        en: 'Sun in the D10 5th house brings creative authority at work. You shine in mentoring roles, speculative ventures, or creative industries where your personal vision drives professional output.',
        hi: 'दशमांश पंचम में सूर्य कार्य में रचनात्मक अधिकार लाता है। मार्गदर्शन, सट्टा उद्यम या रचनात्मक उद्योगों में चमक मिलती है।',
      },
      6: {
        en: 'Sun in the D10 6th house makes you a formidable competitor in the workplace. You overcome professional rivals through sheer force of will and excel in service-oriented roles with clear hierarchy.',
        hi: 'दशमांश षष्ठ में सूर्य कार्यस्थल पर दुर्जेय प्रतिस्पर्धी बनाता है। इच्छाशक्ति से प्रतिद्वंद्वियों पर विजय और सेवा भूमिकाओं में श्रेष्ठता मिलती है।',
      },
      7: {
        en: 'Sun in the D10 7th house indicates career advancement through powerful partnerships and clients. Negotiations carry your personal stamp, and you attract high-status business associates.',
        hi: 'दशमांश सप्तम में सूर्य शक्तिशाली साझेदारियों और ग्राहकों से करियर उन्नति दर्शाता है। उच्च दर्जे के व्यापारिक सहयोगी आकर्षित होते हैं।',
      },
      8: {
        en: 'Sun in the D10 8th house brings career transformation through crisis leadership. You thrive in research, investigation, insurance, or roles that manage hidden resources and institutional power.',
        hi: 'दशमांश अष्टम में सूर्य संकट नेतृत्व से करियर परिवर्तन लाता है। शोध, जांच, बीमा या छिपे संसाधनों के प्रबंधन में सफलता मिलती है।',
      },
      9: {
        en: 'Sun in the D10 9th house elevates the career through higher education, publishing, or international platforms. Your boss or mentor recognizes your potential and becomes a career catalyst.',
        hi: 'दशमांश नवम में सूर्य उच्च शिक्षा, प्रकाशन या अंतरराष्ट्रीय मंचों से करियर ऊंचा करता है। बॉस या गुरु आपकी क्षमता पहचानते हैं।',
      },
      10: {
        en: 'Sun in the D10 10th house is a premier placement for leadership and public achievement. You are born for executive, government, or top-management roles — authority and recognition define your career.',
        hi: 'दशमांश दशम में सूर्य नेतृत्व और सार्वजनिक उपलब्धि का सर्वोत्तम स्थान है। कार्यकारी, सरकारी या शीर्ष प्रबंधन भूमिकाओं के लिए जन्मे हैं।',
      },
      11: {
        en: 'Sun in the D10 11th house brings professional gains through influential networks. Your career ambitions are fulfilled through connections with people in positions of power and government circles.',
        hi: 'दशमांश एकादश में सूर्य प्रभावशाली नेटवर्क से व्यावसायिक लाभ लाता है। सत्ता और सरकारी हलकों के संपर्क से करियर महत्वाकांक्षाएं पूरी होती हैं।',
      },
      12: {
        en: 'Sun in the D10 12th house may indicate a career abroad or in behind-the-scenes roles. Authority is exercised quietly — hospitals, research labs, foreign governments, or spiritual institutions.',
        hi: 'दशमांश द्वादश में सूर्य विदेशी करियर या पर्दे के पीछे की भूमिकाओं का संकेत देता है। अस्पताल, शोध प्रयोगशालाओं या आध्यात्मिक संस्थानों में अधिकार।',
      },
    },

    // -----------------------------------------------------------------------
    // Moon (1) — public image, emotional satisfaction, popularity at work
    // -----------------------------------------------------------------------
    1: {
      1: {
        en: 'Moon in the D10 1st house gives a career shaped by emotional intelligence and public appeal. You adapt to professional environments instinctively and your work persona resonates with others.',
        hi: 'दशमांश लग्न में चंद्र भावनात्मक बुद्धि और जनता से जुड़ाव वाला करियर देता है। कार्य व्यक्तित्व सहज रूप से लोगों से जुड़ता है।',
      },
      2: {
        en: 'Moon in the D10 2nd house indicates fluctuating but potentially lucrative professional income. Your earnings depend on public favour, and your communication at work is nurturing and persuasive.',
        hi: 'दशमांश द्वितीय में चंद्र उतार-चढ़ाव वाली किंतु लाभदायक व्यावसायिक आय दर्शाता है। कार्यस्थल पर संवाद पोषणकारी और प्रेरक होता है।',
      },
      3: {
        en: 'Moon in the D10 3rd house brings initiative fuelled by emotional conviction. You excel in media, writing, customer relations, or any career requiring frequent travel and public interaction.',
        hi: 'दशमांश तृतीय में चंद्र भावनात्मक विश्वास से प्रेरित पहल लाता है। मीडिया, लेखन, ग्राहक संबंध या जनसंपर्क वाले करियर में उत्कृष्टता।',
      },
      4: {
        en: 'Moon in the D10 4th house gives deep emotional satisfaction from work. You thrive in careers related to real estate, hospitality, interior design, or creating comfortable workplace environments.',
        hi: 'दशमांश चतुर्थ में चंद्र कार्य से गहरी भावनात्मक संतुष्टि देता है। रियल एस्टेट, आतिथ्य, इंटीरियर डिज़ाइन में सफलता मिलती है।',
      },
      5: {
        en: 'Moon in the D10 5th house blesses creative professions with emotional depth. Teaching, childcare, entertainment, or artistic careers flourish, and your mentoring style is empathetic and intuitive.',
        hi: 'दशमांश पंचम में चंद्र रचनात्मक पेशों को भावनात्मक गहराई देता है। शिक्षण, मनोरंजन या कलात्मक करियर फलते-फूलते हैं।',
      },
      6: {
        en: 'Moon in the D10 6th house can bring emotional stress from workplace competition and daily routines. You excel in healthcare, nursing, social services, or roles that require serving the public\'s emotional needs.',
        hi: 'दशमांश षष्ठ में चंद्र कार्यस्थल प्रतिस्पर्धा से भावनात्मक तनाव ला सकता है। स्वास्थ्य सेवा, नर्सिंग या सामाजिक सेवाओं में श्रेष्ठता।',
      },
      7: {
        en: 'Moon in the D10 7th house attracts career success through client relationships and business partnerships. You have an instinct for understanding what clients need and build loyalty through emotional rapport.',
        hi: 'दशमांश सप्तम में चंद्र ग्राहक संबंधों और व्यापारिक साझेदारियों से करियर सफलता आकर्षित करता है। ग्राहकों की आवश्यकता समझने की सहज प्रतिभा।',
      },
      8: {
        en: 'Moon in the D10 8th house indicates a career involving emotional healing, psychology, counselling, or managing shared resources. Professional life goes through periodic emotional upheavals that lead to reinvention.',
        hi: 'दशमांश अष्टम में चंद्र भावनात्मक उपचार, मनोविज्ञान या साझा संसाधनों के प्रबंधन से जुड़ा करियर दर्शाता है। समय-समय पर व्यावसायिक पुनर्निर्माण होता है।',
      },
      9: {
        en: 'Moon in the D10 9th house favours careers in education, travel, or cross-cultural work. Your professional growth accelerates abroad or through higher learning, and your mentor-boss relationship is emotionally supportive.',
        hi: 'दशमांश नवम में चंद्र शिक्षा, यात्रा या अंतर-सांस्कृतिक कार्य में करियर का पक्ष लेता है। विदेश या उच्च शिक्षा से व्यावसायिक वृद्धि।',
      },
      10: {
        en: 'Moon in the D10 10th house makes your career public-facing and popularity-driven. You gain recognition through emotional connection with audiences — ideal for politics, hospitality, media, and public service.',
        hi: 'दशमांश दशम में चंद्र जनता से जुड़ा और लोकप्रियता-आधारित करियर बनाता है। राजनीति, आतिथ्य, मीडिया और जनसेवा के लिए आदर्श।',
      },
      11: {
        en: 'Moon in the D10 11th house brings professional gains through networking and community building. Your career ambitions are nurtured by a supportive circle of industry friends and well-wishers.',
        hi: 'दशमांश एकादश में चंद्र नेटवर्किंग और समुदाय निर्माण से व्यावसायिक लाभ लाता है। उद्योग मित्रों के सहयोग से करियर महत्वाकांक्षाएं पूरी होती हैं।',
      },
      12: {
        en: 'Moon in the D10 12th house may indicate a career in foreign lands, charitable institutions, or behind-the-scenes creative work. Professional expenses may be high, but emotional fulfilment comes from selfless service.',
        hi: 'दशमांश द्वादश में चंद्र विदेशी करियर, धर्मार्थ संस्थानों या पर्दे के पीछे रचनात्मक कार्य का संकेत देता है। निस्वार्थ सेवा से भावनात्मक तृप्ति।',
      },
    },

    // -----------------------------------------------------------------------
    // Mars (2) — drive, engineering, competition, action-oriented career
    // -----------------------------------------------------------------------
    2: {
      1: {
        en: 'Mars in the D10 1st house creates a fiercely ambitious professional identity. You are action-oriented, competitive, and colleagues perceive you as someone who gets things done through sheer force.',
        hi: 'दशमांश लग्न में मंगल अत्यंत महत्वाकांक्षी व्यावसायिक पहचान बनाता है। आप कर्मठ, प्रतिस्पर्धी हैं और सहकर्मी आपको कर्मशील मानते हैं।',
      },
      2: {
        en: 'Mars in the D10 2nd house indicates aggressive earning capacity and direct, forceful professional communication. Income may come from engineering, manufacturing, real estate, or defence-related work.',
        hi: 'दशमांश द्वितीय में मंगल आक्रामक कमाई क्षमता और सीधा व्यावसायिक संवाद दर्शाता है। इंजीनियरिंग, विनिर्माण या रक्षा से आय।',
      },
      3: {
        en: 'Mars in the D10 3rd house gives extraordinary courage and initiative in business. You thrive in sales, marketing, sports journalism, or entrepreneurial ventures requiring bold, quick decisions.',
        hi: 'दशमांश तृतीय में मंगल व्यापार में असाधारण साहस और पहल देता है। बिक्री, विपणन, खेल या साहसी उद्यमों में सफलता मिलती है।',
      },
      4: {
        en: 'Mars in the D10 4th house gives energy to workplace improvement but may cause friction in the office environment. Careers in construction, real estate development, or property management suit this placement.',
        hi: 'दशमांश चतुर्थ में मंगल कार्यस्थल सुधार में ऊर्जा देता है किंतु कार्यालय में घर्षण संभव है। निर्माण, रियल एस्टेट विकास में उपयुक्त।',
      },
      5: {
        en: 'Mars in the D10 5th house brings competitive creativity and speculative boldness to the career. You excel in sports, trading, creative direction, or mentoring through tough-love approaches.',
        hi: 'दशमांश पंचम में मंगल प्रतिस्पर्धी रचनात्मकता और सट्टा साहस लाता है। खेल, ट्रेडिंग या रचनात्मक निर्देशन में उत्कृष्टता।',
      },
      6: {
        en: 'Mars in the D10 6th house is excellent for competitive careers — you crush workplace rivals. Ideal for military, surgery, law enforcement, litigation, or any profession where combating opposition is the daily routine.',
        hi: 'दशमांश षष्ठ में मंगल प्रतिस्पर्धी करियर के लिए उत्कृष्ट है — कार्यस्थल प्रतिद्वंद्वियों पर विजय। सैन्य, शल्य चिकित्सा, कानून प्रवर्तन के लिए आदर्श।',
      },
      7: {
        en: 'Mars in the D10 7th house brings aggressive negotiation skills and combative business partnerships. You attract dynamic, action-oriented clients, though contractual disputes are possible.',
        hi: 'दशमांश सप्तम में मंगल आक्रामक वार्ता कौशल और गतिशील व्यापारिक साझेदारी लाता है। अनुबंध विवाद संभव किंतु ऊर्जावान ग्राहक आकर्षित होते हैं।',
      },
      8: {
        en: 'Mars in the D10 8th house thrives in crisis management, surgery, mining, or investigative fields. Career undergoes dramatic transformations, and hidden income sources may involve risk and danger.',
        hi: 'दशमांश अष्टम में मंगल संकट प्रबंधन, शल्य चिकित्सा, खनन या जांच क्षेत्रों में सफल होता है। करियर में नाटकीय परिवर्तन और जोखिम भरी आय।',
      },
      9: {
        en: 'Mars in the D10 9th house propels the career through adventurous international assignments, defence academia, or publishing on technical subjects. Your professional philosophy is action-first.',
        hi: 'दशमांश नवम में मंगल साहसिक अंतरराष्ट्रीय कार्य, रक्षा शिक्षा या तकनीकी प्रकाशन से करियर को आगे बढ़ाता है। कर्म-प्रधान दर्शन।',
      },
      10: {
        en: 'Mars in the D10 10th house is a powerhouse placement for engineering, military command, surgery, and competitive leadership. You achieve through relentless effort and are unafraid of professional battles.',
        hi: 'दशमांश दशम में मंगल इंजीनियरिंग, सैन्य कमान, शल्य चिकित्सा और प्रतिस्पर्धी नेतृत्व के लिए शक्तिशाली स्थान है। अथक प्रयास से उपलब्धि।',
      },
      11: {
        en: 'Mars in the D10 11th house brings professional gains through competitive victories and bold networking. Career ambitions are fulfilled by seizing opportunities aggressively and building alliances with powerful peers.',
        hi: 'दशमांश एकादश में मंगल प्रतिस्पर्धी विजय और साहसी नेटवर्किंग से व्यावसायिक लाभ लाता है। अवसरों को आक्रामक रूप से पकड़ कर महत्वाकांक्षाएं पूरी होती हैं।',
      },
      12: {
        en: 'Mars in the D10 12th house channels professional energy into foreign assignments, defence research, or physically demanding behind-the-scenes work. Career expenses may be high due to travel or equipment.',
        hi: 'दशमांश द्वादश में मंगल विदेशी कार्य, रक्षा शोध या शारीरिक रूप से कठिन पर्दे के पीछे के कार्य में ऊर्जा लगाता है। यात्रा से करियर खर्च अधिक।',
      },
    },

    // -----------------------------------------------------------------------
    // Mercury (3) — intellect, communication, analytical profession
    // -----------------------------------------------------------------------
    3: {
      1: {
        en: 'Mercury in the D10 1st house creates an intellectually sharp professional identity. You are known for analytical thinking, verbal dexterity, and adaptability — the quintessential knowledge worker.',
        hi: 'दशमांश लग्न में बुध बौद्धिक रूप से तीक्ष्ण व्यावसायिक पहचान बनाता है। विश्लेषणात्मक सोच, वाक्चातुर्य और अनुकूलन क्षमता के लिए जाने जाते हैं।',
      },
      2: {
        en: 'Mercury in the D10 2nd house indicates income through communication-based careers — writing, accounting, data analysis, or financial advisory. Professional speech is articulate and detail-oriented.',
        hi: 'दशमांश द्वितीय में बुध संवाद-आधारित करियर से आय दर्शाता है — लेखन, लेखांकन, डेटा विश्लेषण। व्यावसायिक वाणी स्पष्ट और विस्तृत होती है।',
      },
      3: {
        en: 'Mercury in the D10 3rd house is exceptional for marketing, journalism, copywriting, and business communication. Short work trips are frequent and fruitful, and multitasking is your professional superpower.',
        hi: 'दशमांश तृतीय में बुध विपणन, पत्रकारिता, कॉपीराइटिंग और व्यापारिक संवाद के लिए असाधारण है। बहुकार्य आपकी व्यावसायिक महाशक्ति है।',
      },
      4: {
        en: 'Mercury in the D10 4th house favours careers in education technology, smart workspace design, or home-based intellectual work. Emotional satisfaction comes from mentally stimulating work environments.',
        hi: 'दशमांश चतुर्थ में बुध शिक्षा प्रौद्योगिकी, स्मार्ट कार्यक्षेत्र डिज़ाइन या घर-आधारित बौद्धिक कार्य का पक्ष लेता है।',
      },
      5: {
        en: 'Mercury in the D10 5th house excels in creative writing, game design, educational content, or speculative analysis. You mentor through wit and logic, and your creative output is intellectually rich.',
        hi: 'दशमांश पंचम में बुध रचनात्मक लेखन, गेम डिज़ाइन, शैक्षिक सामग्री या विश्लेषण में उत्कृष्ट है। बुद्धि और तर्क से मार्गदर्शन।',
      },
      6: {
        en: 'Mercury in the D10 6th house brings analytical prowess to problem-solving roles. You excel in auditing, quality control, debugging, legal analysis, or healthcare administration — detail work under pressure.',
        hi: 'दशमांश षष्ठ में बुध समस्या-समाधान भूमिकाओं में विश्लेषणात्मक कौशल लाता है। ऑडिटिंग, गुणवत्ता नियंत्रण, कानूनी विश्लेषण में श्रेष्ठता।',
      },
      7: {
        en: 'Mercury in the D10 7th house makes you a skilled negotiator and contract specialist. Business partnerships thrive on intellectual compatibility, and you attract clients through sharp communication.',
        hi: 'दशमांश सप्तम में बुध कुशल वार्ताकार और अनुबंध विशेषज्ञ बनाता है। बौद्धिक अनुकूलता से व्यापारिक साझेदारी फलती है।',
      },
      8: {
        en: 'Mercury in the D10 8th house suits careers in forensic accounting, cybersecurity, data mining, or research requiring deep investigative analysis. You uncover what others miss in professional settings.',
        hi: 'दशमांश अष्टम में बुध फोरेंसिक लेखांकन, साइबर सुरक्षा, डेटा माइनिंग या गहन शोध वाले करियर के लिए उपयुक्त है।',
      },
      9: {
        en: 'Mercury in the D10 9th house propels careers in academia, publishing, translation, international trade, or law. Higher education is directly career-enhancing, and you learn throughout your professional life.',
        hi: 'दशमांश नवम में बुध शिक्षा, प्रकाशन, अनुवाद, अंतरराष्ट्रीय व्यापार या कानून में करियर को आगे बढ़ाता है। उच्च शिक्षा करियर-वर्धक है।',
      },
      10: {
        en: 'Mercury in the D10 10th house is ideal for intellectual professions — technology, consulting, analytics, communications, or administration. Your career is defined by mental agility and communication mastery.',
        hi: 'दशमांश दशम में बुध बौद्धिक पेशों के लिए आदर्श है — प्रौद्योगिकी, परामर्श, विश्लेषण या संचार। मानसिक चपलता और संवाद कौशल से करियर परिभाषित होता है।',
      },
      11: {
        en: 'Mercury in the D10 11th house brings professional gains through intellectual networks, tech communities, and information-sharing circles. Career ambitions are fulfilled by staying connected and informed.',
        hi: 'दशमांश एकादश में बुध बौद्धिक नेटवर्क, तकनीकी समुदायों और सूचना साझाकरण से व्यावसायिक लाभ लाता है। जुड़ाव से महत्वाकांक्षाएं पूरी होती हैं।',
      },
      12: {
        en: 'Mercury in the D10 12th house favours careers in foreign language services, remote data work, coding for international clients, or writing in solitude. Behind-the-scenes intellectual labour is your forte.',
        hi: 'दशमांश द्वादश में बुध विदेशी भाषा सेवाओं, दूरस्थ डेटा कार्य या एकांत लेखन वाले करियर का पक्ष लेता है। पर्दे के पीछे बौद्धिक श्रम।',
      },
    },

    // -----------------------------------------------------------------------
    // Jupiter (4) — wisdom, teaching, law, ethics, expansion
    // -----------------------------------------------------------------------
    4: {
      1: {
        en: 'Jupiter in the D10 1st house bestows a wise and respected professional identity. Colleagues view you as ethical and trustworthy, and your career naturally gravitates toward advisory or teaching roles.',
        hi: 'दशमांश लग्न में गुरु बुद्धिमान और सम्मानित व्यावसायिक पहचान प्रदान करता है। सहकर्मी आपको नैतिक और विश्वसनीय मानते हैं।',
      },
      2: {
        en: 'Jupiter in the D10 2nd house brings generous professional income and valued speech at work. You earn through education, finance, consulting, or roles where your wisdom directly generates revenue.',
        hi: 'दशमांश द्वितीय में गुरु उदार व्यावसायिक आय और कार्यस्थल पर मूल्यवान वाणी लाता है। शिक्षा, वित्त या परामर्श से कमाई।',
      },
      3: {
        en: 'Jupiter in the D10 3rd house gives expansive professional communication and successful business initiatives. Publishing, educational outreach, and motivational speaking are natural career channels.',
        hi: 'दशमांश तृतीय में गुरु विस्तृत व्यावसायिक संवाद और सफल व्यापारिक पहल देता है। प्रकाशन, शैक्षिक प्रसार और प्रेरक वक्तृत्व स्वाभाविक मार्ग।',
      },
      4: {
        en: 'Jupiter in the D10 4th house provides a nurturing, expansive workplace and deep contentment from professional life. Education institutions, real estate, or homeland-connected careers prosper.',
        hi: 'दशमांश चतुर्थ में गुरु पोषक, विस्तृत कार्यस्थल और व्यावसायिक जीवन से गहरी संतुष्टि प्रदान करता है। शिक्षा संस्थान या रियल एस्टेट में समृद्धि।',
      },
      5: {
        en: 'Jupiter in the D10 5th house excels in education, spiritual teaching, creative management, or speculative finance. Mentoring is a core part of your professional identity and brings you fulfilment.',
        hi: 'दशमांश पंचम में गुरु शिक्षा, आध्यात्मिक शिक्षण, रचनात्मक प्रबंधन में उत्कृष्ट है। मार्गदर्शन आपकी व्यावसायिक पहचान का मूल है।',
      },
      6: {
        en: 'Jupiter in the D10 6th house helps overcome professional obstacles through righteous conduct. You excel in legal practice, NGO work, healthcare, or dispute resolution where ethics matter most.',
        hi: 'दशमांश षष्ठ में गुरु धार्मिक आचरण से व्यावसायिक बाधाओं पर विजय में सहायता करता है। कानूनी प्रैक्टिस, एनजीओ या स्वास्थ्य सेवा में श्रेष्ठता।',
      },
      7: {
        en: 'Jupiter in the D10 7th house blesses business partnerships with trust and mutual growth. Clients respect your fairness, and your career thrives through collaborative, ethical business relationships.',
        hi: 'दशमांश सप्तम में गुरु व्यापारिक साझेदारियों को विश्वास और पारस्परिक वृद्धि से आशीर्वाद देता है। ग्राहक आपकी निष्पक्षता का सम्मान करते हैं।',
      },
      8: {
        en: 'Jupiter in the D10 8th house protects during career crises and can bring hidden windfalls. Research, philanthropy, insurance, or managing institutional endowments are natural professional domains.',
        hi: 'दशमांश अष्टम में गुरु करियर संकटों में सुरक्षा और छिपे लाभ ला सकता है। शोध, परोपकार, बीमा या संस्थागत कोषों का प्रबंधन स्वाभाविक क्षेत्र।',
      },
      9: {
        en: 'Jupiter in the D10 9th house is a stellar placement for careers in education, law, philosophy, spiritual teaching, or international development. Your professional life is a vehicle for dharmic purpose.',
        hi: 'दशमांश नवम में गुरु शिक्षा, कानून, दर्शन, आध्यात्मिक शिक्षण या अंतरराष्ट्रीय विकास में करियर के लिए उत्कृष्ट स्थान है। करियर धर्म का वाहन।',
      },
      10: {
        en: 'Jupiter in the D10 10th house grants expansive career success, high social standing, and recognition as an authority in your field. Government advisory, judiciary, university leadership, or religious institutions thrive.',
        hi: 'दशमांश दशम में गुरु व्यापक करियर सफलता, उच्च सामाजिक प्रतिष्ठा और क्षेत्र में अधिकारी के रूप में मान्यता देता है।',
      },
      11: {
        en: 'Jupiter in the D10 11th house brings abundant professional gains through ethical networking and wise alliances. Career ambitions are fulfilled generously, and industry peers become lifelong supporters.',
        hi: 'दशमांश एकादश में गुरु नैतिक नेटवर्किंग और बुद्धिमान गठबंधनों से प्रचुर व्यावसायिक लाभ लाता है। करियर महत्वाकांक्षाएं उदारता से पूरी होती हैं।',
      },
      12: {
        en: 'Jupiter in the D10 12th house favours international careers, spiritual organizations, charitable foundations, or academic sabbaticals abroad. Career expenses serve a higher purpose and yield intangible returns.',
        hi: 'दशमांश द्वादश में गुरु अंतरराष्ट्रीय करियर, आध्यात्मिक संगठनों या विदेश में शैक्षणिक कार्य का पक्ष लेता है। करियर खर्च उच्च उद्देश्य की सेवा करते हैं।',
      },
    },

    // -----------------------------------------------------------------------
    // Venus (5) — arts, diplomacy, luxury, partnerships, hospitality
    // -----------------------------------------------------------------------
    5: {
      1: {
        en: 'Venus in the D10 1st house creates a charming, attractive professional persona. Your career benefits from aesthetic sense, diplomacy, and an ability to make every workplace interaction pleasant.',
        hi: 'दशमांश लग्न में शुक्र आकर्षक व्यावसायिक व्यक्तित्व बनाता है। सौंदर्य बोध, कूटनीति और सुखद कार्यस्थल बातचीत से करियर लाभान्वित होता है।',
      },
      2: {
        en: 'Venus in the D10 2nd house brings wealth through beauty, arts, fashion, or luxury industries. Professional speech is refined and persuasive, and your career values align with comfort and quality.',
        hi: 'दशमांश द्वितीय में शुक्र सौंदर्य, कला, फैशन या विलासिता उद्योगों से धन लाता है। व्यावसायिक वाणी परिष्कृत और प्रेरक होती है।',
      },
      3: {
        en: 'Venus in the D10 3rd house excels in creative marketing, graphic design, social media management, or arts journalism. Business communication has an artistic, appealing quality that wins clients.',
        hi: 'दशमांश तृतीय में शुक्र रचनात्मक विपणन, ग्राफ़िक डिज़ाइन, सोशल मीडिया या कला पत्रकारिता में उत्कृष्ट है।',
      },
      4: {
        en: 'Venus in the D10 4th house gives a beautiful, harmonious workplace and satisfaction through interior design, hospitality, or real estate luxury segments. Work-life balance is prioritized.',
        hi: 'दशमांश चतुर्थ में शुक्र सुंदर, सामंजस्यपूर्ण कार्यस्थल और इंटीरियर डिज़ाइन, आतिथ्य या रियल एस्टेट लक्ज़री में संतुष्टि देता है।',
      },
      5: {
        en: 'Venus in the D10 5th house is outstanding for entertainment, performing arts, fashion design, or luxury brand management. Creative speculation brings gains, and your mentoring style is graceful.',
        hi: 'दशमांश पंचम में शुक्र मनोरंजन, प्रदर्शन कला, फैशन डिज़ाइन या विलासिता ब्रांड प्रबंधन के लिए उत्कृष्ट है।',
      },
      6: {
        en: 'Venus in the D10 6th house can create workplace conflicts through jealousy or aesthetic disagreements. You excel in beauty services, wellness, dietetics, or resolving disputes through diplomacy.',
        hi: 'दशमांश षष्ठ में शुक्र ईर्ष्या या सौंदर्य मतभेदों से कार्यस्थल विवाद बना सकता है। सौंदर्य सेवाओं, कूटनीतिक विवाद समाधान में श्रेष्ठता।',
      },
      7: {
        en: 'Venus in the D10 7th house is ideal for careers built on partnerships, diplomacy, art dealing, hospitality, or client-facing luxury services. Business relationships are harmonious and mutually profitable.',
        hi: 'दशमांश सप्तम में शुक्र साझेदारी, कूटनीति, कला व्यापार या आतिथ्य पर आधारित करियर के लिए आदर्श है। व्यापारिक संबंध सामंजस्यपूर्ण और लाभदायक।',
      },
      8: {
        en: 'Venus in the D10 8th house can bring hidden wealth through creative or luxury industries. Careers in cosmetic surgery, inheritance management, or transformative beauty services thrive under this placement.',
        hi: 'दशमांश अष्टम में शुक्र रचनात्मक या विलासिता उद्योगों से छिपा धन ला सकता है। कॉस्मेटिक सर्जरी, विरासत प्रबंधन में सफलता।',
      },
      9: {
        en: 'Venus in the D10 9th house blesses international careers in arts, culture, fashion, or hospitality. Higher education in design or aesthetics accelerates professional growth, and foreign travel is frequent.',
        hi: 'दशमांश नवम में शुक्र कला, संस्कृति, फैशन या आतिथ्य में अंतरराष्ट्रीय करियर को आशीर्वाद देता है। डिज़ाइन में उच्च शिक्षा से वृद्धि।',
      },
      10: {
        en: 'Venus in the D10 10th house grants a glamorous, well-liked public career. You achieve recognition in arts, entertainment, fashion, diplomacy, or luxury commerce — beauty and grace define your professional legacy.',
        hi: 'दशमांश दशम में शुक्र आकर्षक, लोकप्रिय सार्वजनिक करियर देता है। कला, मनोरंजन, फैशन या कूटनीति में मान्यता — सौंदर्य आपकी विरासत।',
      },
      11: {
        en: 'Venus in the D10 11th house brings professional gains through artistic communities, creative collaborations, and luxury industry networks. Career dreams are fulfilled with grace and abundant support.',
        hi: 'दशमांश एकादश में शुक्र कलात्मक समुदायों, रचनात्मक सहयोग और विलासिता नेटवर्क से व्यावसायिक लाभ लाता है।',
      },
      12: {
        en: 'Venus in the D10 12th house suits careers in foreign luxury markets, behind-the-scenes film/music production, spa and retreat management, or charitable arts foundations. Expenses may go toward workplace aesthetics.',
        hi: 'दशमांश द्वादश में शुक्र विदेशी विलासिता बाज़ारों, पर्दे के पीछे फिल्म/संगीत निर्माण या स्पा प्रबंधन वाले करियर के लिए उपयुक्त है।',
      },
    },

    // -----------------------------------------------------------------------
    // Saturn (6) — discipline, slow rise, institutional authority, endurance
    // -----------------------------------------------------------------------
    6: {
      1: {
        en: 'Saturn in the D10 1st house creates a serious, disciplined professional identity. Career success comes slowly but is built on bedrock — colleagues respect your perseverance and work ethic.',
        hi: 'दशमांश लग्न में शनि गंभीर, अनुशासित व्यावसायिक पहचान बनाता है। करियर सफलता धीमी किंतु ठोस होती है — सहकर्मी आपकी कर्मनिष्ठा का सम्मान करते हैं।',
      },
      2: {
        en: 'Saturn in the D10 2nd house indicates steady but modest professional income that grows over time. You are frugal with professional resources, and career communication is measured and authoritative.',
        hi: 'दशमांश द्वितीय में शनि स्थिर किंतु मामूली व्यावसायिक आय दर्शाता है जो समय के साथ बढ़ती है। व्यावसायिक संवाद संयमित और अधिकारपूर्ण होता है।',
      },
      3: {
        en: 'Saturn in the D10 3rd house requires persistent effort in business communication and marketing. Success in writing, publishing, or sales comes late but endures, and business travels involve hardship.',
        hi: 'दशमांश तृतीय में शनि व्यापारिक संवाद और विपणन में निरंतर प्रयास की आवश्यकता रखता है। लेखन या बिक्री में सफलता देर से किंतु स्थायी।',
      },
      4: {
        en: 'Saturn in the D10 4th house may create a demanding workplace environment but grants stability through real estate, government property management, or institutional infrastructure careers.',
        hi: 'दशमांश चतुर्थ में शनि कठिन कार्यस्थल वातावरण बना सकता है किंतु रियल एस्टेट, सरकारी संपत्ति प्रबंधन में स्थिरता देता है।',
      },
      5: {
        en: 'Saturn in the D10 5th house brings a structured, methodical approach to creative work. Speculative ventures are cautious, and mentoring is serious and traditional — you teach through discipline, not charm.',
        hi: 'दशमांश पंचम में शनि रचनात्मक कार्य में संरचित, व्यवस्थित दृष्टिकोण लाता है। सट्टा उद्यम सतर्क और मार्गदर्शन अनुशासन-आधारित होता है।',
      },
      6: {
        en: 'Saturn in the D10 6th house gives extraordinary endurance in competitive work environments. You outlast rivals through sheer persistence and excel in labour relations, mining, manufacturing, or government service.',
        hi: 'दशमांश षष्ठ में शनि प्रतिस्पर्धी कार्य वातावरण में असाधारण सहनशक्ति देता है। श्रम संबंध, खनन, विनिर्माण या सरकारी सेवा में श्रेष्ठता।',
      },
      7: {
        en: 'Saturn in the D10 7th house indicates long-term, structured business partnerships that require patience. Contracts and client relationships are built on trust that takes years to develop but lasts decades.',
        hi: 'दशमांश सप्तम में शनि दीर्घकालिक, संरचित व्यापारिक साझेदारी दर्शाता है। अनुबंध और ग्राहक संबंध वर्षों में बनते हैं किंतु दशकों तक टिकते हैं।',
      },
      8: {
        en: 'Saturn in the D10 8th house brings career longevity through crisis management, insurance, pension administration, or dealing with organizational restructuring. Transformations are slow but permanent.',
        hi: 'दशमांश अष्टम में शनि संकट प्रबंधन, बीमा, पेंशन प्रशासन या संगठनात्मक पुनर्गठन से करियर दीर्घायु लाता है। परिवर्तन धीमे किंतु स्थायी।',
      },
      9: {
        en: 'Saturn in the D10 9th house gives a career grounded in tradition, law, or institutional governance. International career growth comes with delays, and higher education is a lifelong, disciplined pursuit.',
        hi: 'दशमांश नवम में शनि परंपरा, कानून या संस्थागत शासन पर आधारित करियर देता है। अंतरराष्ट्रीय वृद्धि में विलंब किंतु उच्च शिक्षा आजीवन।',
      },
      10: {
        en: 'Saturn in the D10 10th house is the classic indicator of a slow but unstoppable career rise to institutional authority. Government, judiciary, corporate governance, or infrastructure — your achievement is carved in stone.',
        hi: 'दशमांश दशम में शनि संस्थागत अधिकार तक धीमी किंतु अजेय करियर वृद्धि का शास्त्रीय सूचक है। सरकार, न्यायपालिका या कॉर्पोरेट गवर्नेंस — उपलब्धि पत्थर पर खुदी।',
      },
      11: {
        en: 'Saturn in the D10 11th house brings delayed but substantial professional gains. Career ambitions are fulfilled in the second half of life through patient, disciplined networking and long-term industry relationships.',
        hi: 'दशमांश एकादश में शनि विलंबित किंतु पर्याप्त व्यावसायिक लाभ लाता है। जीवन के दूसरे भाग में धैर्यपूर्ण नेटवर्किंग से महत्वाकांक्षाएं पूरी।',
      },
      12: {
        en: 'Saturn in the D10 12th house may bring career isolation, foreign assignments in harsh conditions, or institutional roles in prisons, monasteries, or remote facilities. Retirement is well-planned and structured.',
        hi: 'दशमांश द्वादश में शनि करियर में एकांत, कठिन परिस्थितियों में विदेशी कार्य या जेल, मठ जैसे संस्थागत भूमिकाएं ला सकता है। सेवानिवृत्ति सुनियोजित।',
      },
    },

    // -----------------------------------------------------------------------
    // Rahu (7) — unconventional career, technology, foreign, innovation
    // -----------------------------------------------------------------------
    7: {
      1: {
        en: 'Rahu in the D10 1st house creates an unconventional, boundary-breaking professional identity. You reinvent yourself at work, thrive in emerging industries, and your career persona defies traditional categories.',
        hi: 'दशमांश लग्न में राहु अपरंपरागत, सीमा-तोड़ व्यावसायिक पहचान बनाता है। उभरते उद्योगों में सफलता और करियर पारंपरिक श्रेणियों से परे।',
      },
      2: {
        en: 'Rahu in the D10 2nd house indicates income from unconventional sources — cryptocurrency, foreign trade, tech startups, or disruptive business models. Professional speech can be persuasive but occasionally misleading.',
        hi: 'दशमांश द्वितीय में राहु अपरंपरागत स्रोतों से आय दर्शाता है — क्रिप्टो, विदेशी व्यापार, टेक स्टार्टअप। वाणी प्रेरक किंतु कभी भ्रामक।',
      },
      3: {
        en: 'Rahu in the D10 3rd house gives exceptional boldness in business ventures and digital marketing. You excel in social media, viral content creation, or tech sales — unconventional communication channels are your strength.',
        hi: 'दशमांश तृतीय में राहु व्यापारिक उद्यमों और डिजिटल विपणन में असाधारण साहस देता है। सोशल मीडिया, वायरल कंटेंट या टेक बिक्री में श्रेष्ठता।',
      },
      4: {
        en: 'Rahu in the D10 4th house brings an unusual or high-tech workplace environment. You may work for foreign companies from home, or your office uses cutting-edge technology. Workplace culture is unconventional.',
        hi: 'दशमांश चतुर्थ में राहु असामान्य या उच्च-तकनीक कार्यस्थल वातावरण लाता है। विदेशी कंपनियों से घर से कार्य या अत्याधुनिक प्रौद्योगिकी कार्यालय।',
      },
      5: {
        en: 'Rahu in the D10 5th house brings innovation to creative fields — AI art, tech entertainment, gaming, or speculative trading with algorithms. Mentoring style is unorthodox and breaks traditional moulds.',
        hi: 'दशमांश पंचम में राहु रचनात्मक क्षेत्रों में नवाचार लाता है — AI कला, तकनीकी मनोरंजन, गेमिंग या एल्गोरिदमिक ट्रेडिंग।',
      },
      6: {
        en: 'Rahu in the D10 6th house gives cunning ability to overcome workplace enemies and competition. You excel in cybersecurity, foreign healthcare, alternative medicine, or roles that disrupt established service models.',
        hi: 'दशमांश षष्ठ में राहु कार्यस्थल शत्रुओं और प्रतिस्पर्धा पर विजय में चतुराई देता है। साइबर सुरक्षा, वैकल्पिक चिकित्सा या विघटनकारी सेवा भूमिकाओं में श्रेष्ठता।',
      },
      7: {
        en: 'Rahu in the D10 7th house attracts foreign or unconventional business partners and clients. Career grows through cross-cultural negotiations, tech partnerships, or alliances with disruptive companies.',
        hi: 'दशमांश सप्तम में राहु विदेशी या अपरंपरागत व्यापारिक साझेदार और ग्राहक आकर्षित करता है। अंतर-सांस्कृतिक वार्ता या टेक साझेदारी से वृद्धि।',
      },
      8: {
        en: 'Rahu in the D10 8th house thrives in cutting-edge research, biotechnology, occult sciences, or financial instruments dealing with hidden wealth. Career transformations are sudden, dramatic, and technology-driven.',
        hi: 'दशमांश अष्टम में राहु अत्याधुनिक शोध, जैव प्रौद्योगिकी, गूढ़ विज्ञान या छिपे धन के वित्तीय साधनों में सफल होता है। करियर परिवर्तन अचानक और प्रौद्योगिकी-चालित।',
      },
      9: {
        en: 'Rahu in the D10 9th house propels career growth through foreign universities, international organizations, or unconventional spiritual/philosophical platforms. Your professional guru may be from a different culture.',
        hi: 'दशमांश नवम में राहु विदेशी विश्वविद्यालयों, अंतरराष्ट्रीय संगठनों या अपरंपरागत दार्शनिक मंचों से करियर वृद्धि करता है।',
      },
      10: {
        en: 'Rahu in the D10 10th house is a powerful indicator of an unconventional career in technology, foreign companies, or disruptive industries. You achieve public recognition through innovation and breaking professional norms.',
        hi: 'दशमांश दशम में राहु प्रौद्योगिकी, विदेशी कंपनियों या विघटनकारी उद्योगों में अपरंपरागत करियर का शक्तिशाली सूचक है। नवाचार से सार्वजनिक मान्यता।',
      },
      11: {
        en: 'Rahu in the D10 11th house brings massive professional gains through tech networks, foreign industry contacts, and trend-riding. Career ambitions are fulfilled through disruption and being ahead of the curve.',
        hi: 'दशमांश एकादश में राहु तकनीकी नेटवर्क, विदेशी उद्योग संपर्कों और ट्रेंड-राइडिंग से भारी व्यावसायिक लाभ लाता है।',
      },
      12: {
        en: 'Rahu in the D10 12th house strongly indicates a career in foreign lands, multinational corporations, or virtual/remote work for international clients. Career expenses may involve foreign travel, immigration, or technology infrastructure.',
        hi: 'दशमांश द्वादश में राहु विदेश में करियर, बहुराष्ट्रीय कंपनियों या अंतरराष्ट्रीय ग्राहकों के लिए दूरस्थ कार्य का प्रबल सूचक है।',
      },
    },

    // -----------------------------------------------------------------------
    // Ketu (8) — detachment, spirituality, past-life skill, niche expertise
    // -----------------------------------------------------------------------
    8: {
      1: {
        en: 'Ketu in the D10 1st house creates a detached, selfless professional identity. You are unconcerned with personal branding and work best in roles where ego takes a backseat to expertise and mission.',
        hi: 'दशमांश लग्न में केतु विरक्त, निस्वार्थ व्यावसायिक पहचान बनाता है। व्यक्तिगत ब्रांडिंग से उदासीन और विशेषज्ञता-प्रधान भूमिकाओं में सर्वश्रेष्ठ।',
      },
      2: {
        en: 'Ketu in the D10 2nd house shows disinterest in material income accumulation. You may earn through spiritual services, alternative healing, or niche consulting where money is secondary to purpose.',
        hi: 'दशमांश द्वितीय में केतु भौतिक आय संचय में अरुचि दर्शाता है। आध्यात्मिक सेवाओं, वैकल्पिक उपचार या विशिष्ट परामर्श से कमाई।',
      },
      3: {
        en: 'Ketu in the D10 3rd house gives intuitive business instincts from past-life experience. You make professional decisions effortlessly without extensive analysis — marketing and sales feel like second nature.',
        hi: 'दशमांश तृतीय में केतु पूर्वजन्म अनुभव से सहज व्यापारिक प्रवृत्ति देता है। विपणन और बिक्री सहज स्वभाव जैसे महसूस होते हैं।',
      },
      4: {
        en: 'Ketu in the D10 4th house makes the native indifferent to workplace comforts and office politics. You prefer working from unconventional spaces, and emotional attachment to any single workplace is minimal.',
        hi: 'दशमांश चतुर्थ में केतु कार्यस्थल सुखों और कार्यालय राजनीति के प्रति उदासीन बनाता है। अपरंपरागत स्थानों से काम करना पसंद।',
      },
      5: {
        en: 'Ketu in the D10 5th house brings mastery in niche creative or technical fields from past-life talent. Speculation is not your style, but when you create, the output is deeply original and unconventionally brilliant.',
        hi: 'दशमांश पंचम में केतु पूर्वजन्म प्रतिभा से विशिष्ट रचनात्मक या तकनीकी क्षेत्रों में महारत लाता है। रचनात्मक उत्पादन गहन मौलिक होता है।',
      },
      6: {
        en: 'Ketu in the D10 6th house dissolves professional competition effortlessly — rivals find you hard to target because you operate outside normal competitive frameworks. Alternative medicine and spiritual healing are suited careers.',
        hi: 'दशमांश षष्ठ में केतु सहज रूप से व्यावसायिक प्रतिस्पर्धा को भंग करता है — प्रतिद्वंद्वी आपको लक्ष्य बनाना कठिन पाते हैं। वैकल्पिक चिकित्सा उपयुक्त।',
      },
      7: {
        en: 'Ketu in the D10 7th house may bring unusual or short-lived business partnerships. You work best independently, and clients are attracted to your niche expertise rather than conventional relationship-building.',
        hi: 'दशमांश सप्तम में केतु असामान्य या अल्पकालिक व्यापारिक साझेदारी ला सकता है। स्वतंत्र रूप से सर्वश्रेष्ठ कार्य और विशिष्ट विशेषज्ञता से ग्राहक आकर्षित।',
      },
      8: {
        en: 'Ketu in the D10 8th house gives natural aptitude for research, occult, or spiritual healing professions. Career crises don\'t faze you — you view professional upheavals as opportunities for deeper purpose.',
        hi: 'दशमांश अष्टम में केतु शोध, गूढ़ या आध्यात्मिक उपचार पेशों के लिए स्वाभाविक योग्यता देता है। करियर संकट आपको विचलित नहीं करते।',
      },
      9: {
        en: 'Ketu in the D10 9th house indicates past-life wisdom applied to career — you may instinctively know your dharmic professional path without formal guidance. Careers in spirituality, astrology, or ancient knowledge systems suit well.',
        hi: 'दशमांश नवम में केतु करियर में पूर्वजन्म ज्ञान का संकेत देता है — बिना औपचारिक मार्गदर्शन के धार्मिक पेशे सहज ज्ञात। ज्योतिष या प्राचीन ज्ञान में उपयुक्त।',
      },
      10: {
        en: 'Ketu in the D10 10th house makes the native indifferent to worldly career achievement and public status. You may achieve recognition paradoxically by not seeking it, or find purpose in work that transcends material success.',
        hi: 'दशमांश दशम में केतु सांसारिक करियर उपलब्धि और सार्वजनिक प्रतिष्ठा के प्रति उदासीन बनाता है। भौतिक सफलता से परे कार्य में उद्देश्य मिलता है।',
      },
      11: {
        en: 'Ketu in the D10 11th house detaches the native from professional networking and material career ambitions. Gains come unexpectedly, and fulfilment is found in purposeful work rather than industry recognition.',
        hi: 'दशमांश एकादश में केतु व्यावसायिक नेटवर्किंग और भौतिक करियर महत्वाकांक्षाओं से विरक्त करता है। लाभ अप्रत्याशित और उद्देश्यपूर्ण कार्य से तृप्ति।',
      },
      12: {
        en: 'Ketu in the D10 12th house is a powerful indicator of career in spiritual organizations, ashrams, charitable work, or behind-the-scenes research. Professional life serves moksha, and retirement comes early or willingly.',
        hi: 'दशमांश द्वादश में केतु आध्यात्मिक संगठनों, आश्रमों, धर्मार्थ कार्य या पर्दे के पीछे शोध में करियर का शक्तिशाली सूचक है। पेशेवर जीवन मोक्ष की सेवा करता है।',
      },
    },
  },

  // ---------------------------------------------------------------------------
  // D7 Saptamsha — Children / Progeny domain — 63 entries
  // 9 planets × houses 1, 2, 4, 5, 7, 9, 11
  // ---------------------------------------------------------------------------
  children: {
    // Sun (0)
    0: {
      1: {
        en: 'Sun in the D7 1st house shows a parenting style marked by authority and pride. The native leads the family unit with confidence and instils strong values of self-respect in children.',
        hi: 'सप्तमांश लग्न में सूर्य अधिकारपूर्ण और गर्वपूर्ण पालन-पोषण शैली दर्शाता है। जातक परिवार में आत्मविश्वास से नेतृत्व करता और बच्चों में आत्मसम्मान भरता है।',
      },
      2: {
        en: 'Sun in the D7 2nd house expands the family through children who bring honour and status. The native values lineage highly and may have children who uphold family pride.',
        hi: 'सप्तमांश द्वितीय में सूर्य उन बच्चों से कुल-विस्तार का संकेत देता है जो सम्मान लाते हैं। जातक वंश को उच्च महत्व देता है।',
      },
      4: {
        en: 'Sun in the D7 4th house creates a strong emotional bond between parent and child rooted in mutual respect. The home environment is structured and dignified, giving children a secure foundation.',
        hi: 'सप्तमांश चतुर्थ में सूर्य माता-पिता और बच्चे के बीच परस्पर सम्मान पर आधारित दृढ़ भावनात्मक बंधन बनाता है।',
      },
      5: {
        en: 'Sun in the D7 5th house is a powerful blessing for progeny. Children are talented, bright, and may hold positions of authority. The native takes great pride and joy in raising them.',
        hi: 'सप्तमांश पंचम में सूर्य संतान के लिए शक्तिशाली आशीर्वाद है। बच्चे प्रतिभाशाली, तेजस्वी और नेतृत्व-योग्य होते हैं।',
      },
      7: {
        en: 'Sun in the D7 7th house indicates that the spouse takes an authoritative role in parenting. Shared parenting decisions may involve ego negotiations, but the result is a disciplined household.',
        hi: 'सप्तमांश सप्तम में सूर्य जीवनसाथी की पालन-पोषण में अधिकारपूर्ण भूमिका दर्शाता है। संयुक्त निर्णयों में अहंकार समन्वय आवश्यक।',
      },
      9: {
        en: 'Sun in the D7 9th house blesses the native with children who carry forward the family\'s dharmic or academic legacy. Grandchildren are distinguished, and the lineage commands respect.',
        hi: 'सप्तमांश नवम में सूर्य उन बच्चों का आशीर्वाद देता है जो कुल की धार्मिक या शैक्षणिक विरासत आगे ले जाते हैं।',
      },
      11: {
        en: 'Sun in the D7 11th house fulfils the native\'s deepest desire for children and progeny. Children bring social recognition and pride, and their achievements elevate the entire family.',
        hi: 'सप्तमांश एकादश में सूर्य संतान की गहरी इच्छा पूर्ण करता है। बच्चे सामाजिक सम्मान लाते हैं और उनकी उपलब्धियां पूरे परिवार को उठाती हैं।',
      },
    },
    // Moon (1)
    1: {
      1: {
        en: 'Moon in the D7 1st house gives a deeply nurturing and emotionally attentive parenting style. The native is instinctively protective and forms strong emotional bonds with each child.',
        hi: 'सप्तमांश लग्न में चंद्रमा गहन पोषणकारी और भावनात्मक रूप से चौकस पालन-पोषण शैली देता है। जातक सहज रक्षात्मक होता है।',
      },
      2: {
        en: 'Moon in the D7 2nd house expands the family through loving, emotionally close relationships with children. The home is warm and nourishing, and maternal bonds run deep across generations.',
        hi: 'सप्तमांश द्वितीय में चंद्रमा प्रेमपूर्ण और भावनात्मक रूप से घनिष्ठ संबंधों से परिवार विस्तार का संकेत देता है।',
      },
      4: {
        en: 'Moon in the D7 4th house is one of the finest placements for parent-child emotional bonding. The domestic atmosphere is tender and secure, and children thrive under the native\'s nurturing care.',
        hi: 'सप्तमांश चतुर्थ में चंद्रमा माता-पिता-बच्चे के भावनात्मक बंधन के लिए श्रेष्ठ स्थान है। घरेलू वातावरण कोमल और सुरक्षित रहता है।',
      },
      5: {
        en: 'Moon in the D7 5th house creates a deeply intuitive and loving relationship with children. The native\'s emotional intelligence shines in parenting, and children feel unconditionally loved.',
        hi: 'सप्तमांश पंचम में चंद्रमा बच्चों के साथ गहन सहज और प्रेमपूर्ण संबंध बनाता है। जातक की भावनात्मक बुद्धिमत्ता पालन-पोषण में प्रकाशित होती है।',
      },
      7: {
        en: 'Moon in the D7 7th house shows a spouse who is emotionally engaged and nurturing toward children. The couple naturally co-parent with sensitivity and shared emotional language.',
        hi: 'सप्तमांश सप्तम में चंद्रमा बच्चों के प्रति भावनात्मक रूप से संलग्न और पोषणकारी जीवनसाथी दर्शाता है।',
      },
      9: {
        en: 'Moon in the D7 9th house bestows a caring, emotionally sensitive relationship with grandchildren. The native becomes a beloved elder figure whose emotional wisdom is cherished by future generations.',
        hi: 'सप्तमांश नवम में चंद्रमा पोती-पोतों के साथ देखभालपूर्ण संबंध प्रदान करता है। जातक भविष्य की पीढ़ियों के लिए प्रिय बुजुर्ग बनता है।',
      },
      11: {
        en: 'Moon in the D7 11th house fulfils emotional desires for a loving family circle. Children bring deep personal satisfaction and become the native\'s closest friends in later life.',
        hi: 'सप्तमांश एकादश में चंद्रमा प्रेमपूर्ण परिवार की भावनात्मक इच्छा पूर्ण करता है। बच्चे गहरी व्यक्तिगत तृप्ति लाते हैं।',
      },
    },
    // Mars (2)
    2: {
      1: {
        en: 'Mars in the D7 1st house gives an energetic, action-oriented parenting style. The native is a protective and driven parent who encourages courage and physical vitality in children.',
        hi: 'सप्तमांश लग्न में मंगल ऊर्जावान, क्रिया-उन्मुख पालन-पोषण शैली देता है। जातक रक्षात्मक और प्रेरक माता-पिता होता है।',
      },
      2: {
        en: 'Mars in the D7 2nd house drives the native to work hard to expand the family and provide financially for children. Arguments about family matters may occur, but the intent is protective.',
        hi: 'सप्तमांश द्वितीय में मंगल जातक को परिवार विस्तार और बच्चों के लिए कड़ी मेहनत करने को प्रेरित करता है।',
      },
      4: {
        en: 'Mars in the D7 4th house can create a dynamic, sometimes tense home environment. The native is fiercely protective of children but must guard against being overly controlling or aggressive.',
        hi: 'सप्तमांश चतुर्थ में मंगल गतिशील, कभी-कभी तनावपूर्ण घरेलू वातावरण बना सकता है। जातक बच्चों का उग्र रक्षक होता है।',
      },
      5: {
        en: 'Mars in the D7 5th house, if afflicted, can indicate risks or delays in childbirth. However, children who do arrive are bold, energetic, and competitive — natural leaders who blaze their own trails.',
        hi: 'सप्तमांश पंचम में मंगल, यदि पीड़ित हो, संतान में विलंब या जोखिम का संकेत दे सकता है। आने वाले बच्चे साहसी और प्रतिस्पर्धी नेता होते हैं।',
      },
      7: {
        en: 'Mars in the D7 7th house indicates a spouse who is energetic and protective of children. Parenting disagreements may be heated but are resolved through direct communication and shared goals.',
        hi: 'सप्तमांश सप्तम में मंगल बच्चों के प्रति ऊर्जावान और रक्षात्मक जीवनसाथी दर्शाता है। पालन-पोषण मतभेद उग्र लेकिन प्रत्यक्ष संवाद से सुलझते हैं।',
      },
      9: {
        en: 'Mars in the D7 9th house gives grandchildren who are courageous pioneers. The native inspires the next generation through action-oriented values and a tradition of bold enterprise.',
        hi: 'सप्तमांश नवम में मंगल साहसी अग्रदूत पोती-पोते देता है। जातक अगली पीढ़ी को साहसी उद्यम की परंपरा से प्रेरित करता है।',
      },
      11: {
        en: 'Mars in the D7 11th house brings fulfilment of desires for progeny through determined effort. Children become allies and achieve material success that benefits the entire family network.',
        hi: 'सप्तमांश एकादश में मंगल दृढ़ प्रयास से संतान की इच्छा पूर्ण करता है। बच्चे सहयोगी बनते हैं और पूरे परिवार को लाभ पहुंचाने वाली सफलता प्राप्त करते हैं।',
      },
    },
    // Mercury (3)
    3: {
      1: {
        en: 'Mercury in the D7 1st house gives an intellectually engaged and communicative parenting style. The native educates children through conversation, story, and curiosity-driven exploration.',
        hi: 'सप्तमांश लग्न में बुध बौद्धिक रूप से संलग्न और संचारशील पालन-पोषण शैली देता है। जातक संवाद और जिज्ञासा से बच्चों को शिक्षित करता है।',
      },
      2: {
        en: 'Mercury in the D7 2nd house expands the family through children who are articulate and academically gifted. The native invests in their education and models a love of learning and language.',
        hi: 'सप्तमांश द्वितीय में बुध वाक्पटु और शैक्षणिक रूप से प्रतिभाशाली बच्चों से परिवार विस्तार दर्शाता है।',
      },
      4: {
        en: 'Mercury in the D7 4th house creates a stimulating home environment rich in books, discussions, and creative play. Children develop sharp minds and strong communication skills in this setting.',
        hi: 'सप्तमांश चतुर्थ में बुध पुस्तकों, चर्चाओं और रचनात्मक खेल से समृद्ध उत्तेजक घरेलू वातावरण बनाता है।',
      },
      5: {
        en: 'Mercury in the D7 5th house blesses the native with clever, witty, and intellectually curious children. Parenting is playful and mentally engaging, with an emphasis on creativity and critical thinking.',
        hi: 'सप्तमांश पंचम में बुध चतुर, विनोदी और बौद्धिक रूप से जिज्ञासु बच्चों का आशीर्वाद देता है।',
      },
      7: {
        en: 'Mercury in the D7 7th house shows a spouse who engages children through intellectual stimulation and communication. Co-parenting discussions are rational and solution-focused.',
        hi: 'सप्तमांश सप्तम में बुध बौद्धिक उत्तेजना और संवाद से बच्चों को संलग्न करने वाला जीवनसाथी दर्शाता है।',
      },
      9: {
        en: 'Mercury in the D7 9th house indicates grandchildren who carry forward intellectual and scholarly traditions. The native\'s wisdom is communicated clearly and leaves a lasting educational legacy.',
        hi: 'सप्तमांश नवम में बुध बौद्धिक और विद्वतापूर्ण परंपरा आगे ले जाने वाले पोती-पोते दर्शाता है।',
      },
      11: {
        en: 'Mercury in the D7 11th house fulfils the native\'s desire for children through networking and intellectual connections. Children excel in communication fields and bring social gains to the family.',
        hi: 'सप्तमांश एकादश में बुध नेटवर्किंग और बौद्धिक संपर्कों से संतान इच्छा पूर्ण करता है। बच्चे संवाद क्षेत्रों में उत्कृष्ट होते हैं।',
      },
    },
    // Jupiter (4)
    4: {
      1: {
        en: 'Jupiter in the D7 1st house gives a wise, generous, and principled parenting style. The native is a natural guide and teacher to children, instilling ethical values and expansive thinking.',
        hi: 'सप्तमांश लग्न में गुरु बुद्धिमान, उदार और नैतिक पालन-पोषण शैली देता है। जातक बच्चों का स्वाभाविक मार्गदर्शक और शिक्षक होता है।',
      },
      2: {
        en: 'Jupiter in the D7 2nd house expands the family bountifully. Children are numerous or deeply valued, and the family lineage grows in wisdom and prosperity across generations.',
        hi: 'सप्तमांश द्वितीय में गुरु परिवार को प्रचुर रूप से विस्तृत करता है। बच्चे अनेक या अत्यंत मूल्यवान होते हैं और वंश ज्ञान में बढ़ता है।',
      },
      4: {
        en: 'Jupiter in the D7 4th house creates a joyful, wisdom-filled home environment. Children flourish spiritually and academically, and the parent-child bond is built on trust, learning, and generosity.',
        hi: 'सप्तमांश चतुर्थ में गुरु आनंदमय, ज्ञान से भरे घरेलू वातावरण का निर्माण करता है। बच्चे आध्यात्मिक और शैक्षणिक रूप से फलते-फूलते हैं।',
      },
      5: {
        en: 'Jupiter in the D7 5th house is the finest placement for blessed progeny. Children are gifted, fortunate, and may become scholars, teachers, or spiritual figures. The parenting bond is deeply dharmic.',
        hi: 'सप्तमांश पंचम में गुरु आशीर्वादित संतान के लिए सर्वोत्तम स्थान है। बच्चे प्रतिभाशाली, भाग्यशाली और विद्वान हो सकते हैं।',
      },
      7: {
        en: 'Jupiter in the D7 7th house blesses the native with a wise and supportive spouse in parenting. Co-parenting is harmonious, dharmic, and grounded in shared spiritual or philosophical values.',
        hi: 'सप्तमांश सप्तम में गुरु पालन-पोषण में बुद्धिमान और सहायक जीवनसाथी का आशीर्वाद देता है।',
      },
      9: {
        en: 'Jupiter in the D7 9th house bestows grandchildren who are spiritually inclined, wise, and respected. The native becomes a revered patriarch or matriarch whose blessings carry across generations.',
        hi: 'सप्तमांश नवम में गुरु आध्यात्मिक रूप से इच्छुक, बुद्धिमान और सम्मानित पोती-पोते प्रदान करता है।',
      },
      11: {
        en: 'Jupiter in the D7 11th house grants abundant fulfilment through children and progeny. The native\'s desires for family expansion are richly met, and children become pillars of social and material success.',
        hi: 'सप्तमांश एकादश में गुरु बच्चों और संतान के माध्यम से प्रचुर तृप्ति प्रदान करता है।',
      },
    },
    // Venus (5)
    5: {
      1: {
        en: 'Venus in the D7 1st house gives a warm, affectionate, and artistically inclined parenting style. The native creates a beautiful and harmonious environment in which children feel loved and inspired.',
        hi: 'सप्तमांश लग्न में शुक्र उष्ण, स्नेही और कलात्मक पालन-पोषण शैली देता है। जातक सुंदर और सौहार्दपूर्ण वातावरण बनाता है।',
      },
      2: {
        en: 'Venus in the D7 2nd house brings beauty, art, and abundance to the family through children. The native invests in creative education for children and cherishes aesthetic family traditions.',
        hi: 'सप्तमांश द्वितीय में शुक्र बच्चों के माध्यम से परिवार में सौंदर्य, कला और प्रचुरता लाता है।',
      },
      4: {
        en: 'Venus in the D7 4th house makes the home a sanctuary of beauty and affection. Children grow up in a loving, aesthetically rich environment and develop refined sensibilities and emotional warmth.',
        hi: 'सप्तमांश चतुर्थ में शुक्र घर को सौंदर्य और स्नेह का अभयारण्य बनाता है। बच्चे प्रेमपूर्ण और कलात्मक रूप से समृद्ध वातावरण में बढ़ते हैं।',
      },
      5: {
        en: 'Venus in the D7 5th house brings charming, artistically talented children. The native\'s relationship with progeny is filled with joy, playfulness, and creative expression shared together.',
        hi: 'सप्तमांश पंचम में शुक्र आकर्षक, कलात्मक रूप से प्रतिभाशाली बच्चे लाता है। जातक और संतान के बीच आनंद और रचनात्मकता का संबंध रहता है।',
      },
      7: {
        en: 'Venus in the D7 7th house indicates a loving, aesthetically attuned spouse who co-parents with grace. Parenting decisions are made collaboratively with warmth and mutual appreciation.',
        hi: 'सप्तमांश सप्तम में शुक्र प्रेमपूर्ण, कलात्मक जीवनसाथी दर्शाता है जो सुंदरता से सह-पालन करता है।',
      },
      9: {
        en: 'Venus in the D7 9th house gives grandchildren who are charming, artistic, and socially graceful. The native\'s influence across generations is one of beauty, culture, and harmonious living.',
        hi: 'सप्तमांश नवम में शुक्र आकर्षक, कलात्मक और सामाजिक रूप से कुशल पोती-पोते देता है।',
      },
      11: {
        en: 'Venus in the D7 11th house fulfils desires for a beautiful family life. Children bring social pleasures and artistic achievements that enrich the native\'s personal and social world.',
        hi: 'सप्तमांश एकादश में शुक्र सुंदर पारिवारिक जीवन की इच्छा पूर्ण करता है। बच्चे सामाजिक आनंद और कलात्मक उपलब्धियां लाते हैं।',
      },
    },
    // Saturn (6)
    6: {
      1: {
        en: 'Saturn in the D7 1st house gives a serious, disciplined, and sometimes austere parenting approach. The native takes parenting responsibilities gravely and teaches children endurance and accountability.',
        hi: 'सप्तमांश लग्न में शनि गंभीर, अनुशासित और कभी-कभी कठोर पालन-पोषण दृष्टिकोण देता है। जातक बच्चों को धैर्य और जवाबदेही सिखाता है।',
      },
      2: {
        en: 'Saturn in the D7 2nd house may delay or limit family expansion, but children who arrive are resilient and industrious. The native works steadily to provide material security for the family.',
        hi: 'सप्तमांश द्वितीय में शनि परिवार विस्तार में विलंब कर सकता है, लेकिन आने वाले बच्चे दृढ़ और परिश्रमी होते हैं।',
      },
      4: {
        en: 'Saturn in the D7 4th house creates a structured, sometimes emotionally restrained home environment. Children learn self-reliance and discipline, though the native must consciously nurture warmth.',
        hi: 'सप्तमांश चतुर्थ में शनि संरचित, कभी-कभी भावनात्मक रूप से संयमित घरेलू वातावरण बनाता है। बच्चे आत्मनिर्भरता सीखते हैं।',
      },
      5: {
        en: 'Saturn in the D7 5th house classically indicates delayed progeny or limited number of children. Those born are serious, hardworking, and achieve success through sustained effort rather than luck.',
        hi: 'सप्तमांश पंचम में शनि क्लासिकली संतान में विलंब या सीमित संख्या दर्शाता है। जन्मे बच्चे गंभीर और परिश्रमी होते हैं।',
      },
      7: {
        en: 'Saturn in the D7 7th house shows a spouse who is responsible and methodical in parenting. Co-parenting may feel duty-driven rather than emotionally warm, but the household is stable and reliable.',
        hi: 'सप्तमांश सप्तम में शनि पालन-पोषण में जिम्मेदार और व्यवस्थित जीवनसाथी दर्शाता है। गृहस्थ स्थिर और विश्वसनीय रहता है।',
      },
      9: {
        en: 'Saturn in the D7 9th house gives grandchildren who are disciplined, patient achievers. The native\'s legacy is built through enduring effort, and the family tree gains respect through perseverance.',
        hi: 'सप्तमांश नवम में शनि अनुशासित, धैर्यवान पोती-पोते देता है। जातक की विरासत स्थायी प्रयास से बनती है।',
      },
      11: {
        en: 'Saturn in the D7 11th house brings delayed but ultimately fulfilled desires for progeny. Children, once arrived, work diligently and become sources of practical support and long-term familial strength.',
        hi: 'सप्तमांश एकादश में शनि विलंबित लेकिन अंततः पूर्ण संतान इच्छा लाता है। बच्चे परिश्रमी बनते हैं और व्यावहारिक सहारा देते हैं।',
      },
    },
    // Rahu (7)
    7: {
      1: {
        en: 'Rahu in the D7 1st house gives an unconventional parenting style driven by ambition and experimentation. The native may push children toward innovative paths, sometimes overriding traditional upbringing norms.',
        hi: 'सप्तमांश लग्न में राहु महत्वाकांक्षा और प्रयोग से प्रेरित अपरंपरागत पालन-पोषण शैली देता है।',
      },
      2: {
        en: 'Rahu in the D7 2nd house may create complex family dynamics around children. There can be unconventional additions to the family, and the native\'s approach to lineage may deviate from tradition.',
        hi: 'सप्तमांश द्वितीय में राहु बच्चों के इर्द-गिर्द जटिल पारिवारिक गतिशीलता बना सकता है। परिवार में अपरंपरागत जोड़ संभव।',
      },
      4: {
        en: 'Rahu in the D7 4th house creates an unusual or disrupted home environment for children. The native may parent in unconventional settings — cross-cultural households, blended families, or foreign lands.',
        hi: 'सप्तमांश चतुर्थ में राहु बच्चों के लिए असामान्य या अस्त-व्यस्त घरेलू वातावरण बनाता है।',
      },
      5: {
        en: 'Rahu in the D7 5th house may bring irregular or unexpected experiences around childbirth. Children can be unusually gifted or come through unconventional means such as adoption or assisted reproduction.',
        hi: 'सप्तमांश पंचम में राहु संतान के इर्द-गिर्द अनियमित या अप्रत्याशित अनुभव ला सकता है। बच्चे असाधारण रूप से प्रतिभाशाली या अपरंपरागत माध्यम से आ सकते हैं।',
      },
      7: {
        en: 'Rahu in the D7 7th house indicates a spouse whose parenting style is unconventional or cross-cultural. Parenting discussions may be complex, but the outcome is a uniquely stimulating environment for children.',
        hi: 'सप्तमांश सप्तम में राहु अपरंपरागत या बहुसांस्कृतिक पालन-पोषण शैली वाला जीवनसाथी दर्शाता है।',
      },
      9: {
        en: 'Rahu in the D7 9th house suggests grandchildren from unusual or cross-cultural backgrounds. The family legacy takes unexpected turns, and the next generation may live far from ancestral roots.',
        hi: 'सप्तमांश नवम में राहु असामान्य या बहुसांस्कृतिक पृष्ठभूमि से पोती-पोते का सुझाव देता है।',
      },
      11: {
        en: 'Rahu in the D7 11th house can bring sudden or unexpected fulfilment of the desire for children. Gains through children may come from unconventional sources, and the native\'s social network expands dramatically through them.',
        hi: 'सप्तमांश एकादश में राहु संतान की इच्छा की अचानक या अप्रत्याशित पूर्ति ला सकता है।',
      },
    },
    // Ketu (8)
    8: {
      1: {
        en: 'Ketu in the D7 1st house gives a spiritually detached yet intuitively wise parenting style. The native raises children with emphasis on inner values over worldly achievement, sometimes appearing emotionally distant.',
        hi: 'सप्तमांश लग्न में केतु आध्यात्मिक रूप से विरक्त लेकिन सहज रूप से बुद्धिमान पालन-पोषण शैली देता है।',
      },
      2: {
        en: 'Ketu in the D7 2nd house indicates a past-life karmic connection to family lineage. The native may feel ambivalent about family expansion but carries deep ancestral wisdom that is transmitted to children.',
        hi: 'सप्तमांश द्वितीय में केतु परिवार वंश से पूर्वजन्म कार्मिक संबंध दर्शाता है। जातक गहन पूर्वजन्म ज्ञान संतान को देता है।',
      },
      4: {
        en: 'Ketu in the D7 4th house may create emotional distance in the parent-child home bond. The native\'s spiritual detachment can make the home feel unworldly, yet children gain a rare connection to inner peace.',
        hi: 'सप्तमांश चतुर्थ में केतु माता-पिता-बच्चे के घरेलू बंधन में भावनात्मक दूरी बना सकता है। बच्चे आंतरिक शांति से दुर्लभ संबंध पाते हैं।',
      },
      5: {
        en: 'Ketu in the D7 5th house often indicates past-life karma around progeny — the native may experience delays, detachment from children, or children who pursue highly spiritual or renunciate paths.',
        hi: 'सप्तमांश पंचम में केतु अक्सर संतान के इर्द-गिर्द पूर्वजन्म कर्म दर्शाता है। बच्चे आध्यात्मिक या वैराग्य मार्ग अपना सकते हैं।',
      },
      7: {
        en: 'Ketu in the D7 7th house shows a spouse who is spiritually oriented and somewhat detached in parenting. The co-parenting dynamic has a quiet, introspective quality, and children are raised with meditative values.',
        hi: 'सप्तमांश सप्तम में केतु आध्यात्मिक रूप से उन्मुख और पालन-पोषण में कुछ हद तक विरक्त जीवनसाथी दर्शाता है।',
      },
      9: {
        en: 'Ketu in the D7 9th house suggests grandchildren with deep spiritual inclinations or past-life connections to the native. The family lineage carries a thread of mystical wisdom across generations.',
        hi: 'सप्तमांश नवम में केतु गहरी आध्यात्मिक प्रवृत्ति वाले या जातक से पूर्वजन्म संबंध वाले पोती-पोते का सुझाव देता है।',
      },
      11: {
        en: 'Ketu in the D7 11th house detaches the native from conventional desires for progeny. Fulfilment comes through spiritual surrender, and children, if present, find their highest purpose in service or renunciation.',
        hi: 'सप्तमांश एकादश में केतु संतान की पारंपरिक इच्छाओं से विरक्त करता है। बच्चे सेवा या वैराग्य में सर्वोच्च उद्देश्य पाते हैं।',
      },
    },
  },

  // ---------------------------------------------------------------------------
  // D2/D4 — Wealth / Dhan domain — 54 entries
  // 9 planets × houses 1, 2, 4, 5, 9, 11
  // ---------------------------------------------------------------------------
  wealth: {
    // Sun (0)
    0: {
      1: {
        en: 'Sun in the D2 1st house gives strong self-earned financial capacity. The native accumulates wealth through authority, government connections, or personal enterprise driven by a powerful sense of identity.',
        hi: 'धनांश लग्न में सूर्य प्रबल स्व-अर्जित वित्तीय क्षमता देता है। जातक अधिकार, सरकारी संपर्कों या व्यक्तिगत उद्यम से संपत्ति अर्जित करता है।',
      },
      2: {
        en: 'Sun in the D2 2nd house illuminates savings and family wealth. The native builds financial reserves with pride and may inherit or manage wealth connected to the father or government institutions.',
        hi: 'धनांश द्वितीय में सूर्य बचत और पारिवारिक धन को प्रकाशित करता है। जातक गर्व से वित्तीय भंडार बनाता है।',
      },
      4: {
        en: 'Sun in the D2 4th house indicates wealth through property, real estate, or vehicles. The native derives prestige from home ownership and may accumulate ancestral assets that carry social status.',
        hi: 'धनांश चतुर्थ में सूर्य संपत्ति, अचल संपत्ति या वाहनों से धन का संकेत देता है। जातक गृह-स्वामित्व से प्रतिष्ठा प्राप्त करता है।',
      },
      5: {
        en: 'Sun in the D2 5th house brings speculative financial gains with confidence. The native may profit from bold investments, creative ventures, or fields related to entertainment and children.',
        hi: 'धनांश पंचम में सूर्य आत्मविश्वास के साथ सट्टा वित्तीय लाभ लाता है। जातक साहसी निवेश या मनोरंजन से लाभ पा सकता है।',
      },
      9: {
        en: 'Sun in the D2 9th house connects fortune to dharmic living. Windfalls may come through father, guru, or long-distance connections, and the native\'s wealth grows when aligned with righteous action.',
        hi: 'धनांश नवम में सूर्य भाग्य को धार्मिक जीवन से जोड़ता है। पिता, गुरु या दूरस्थ संपर्कों से सौभाग्य आ सकता है।',
      },
      11: {
        en: 'Sun in the D2 11th house generates income through leadership, networks of influence, and government channels. The native\'s income streams grow as their social status and authority expand.',
        hi: 'धनांश एकादश में सूर्य नेतृत्व, प्रभाव-नेटवर्क और सरकारी माध्यमों से आय उत्पन्न करता है।',
      },
    },
    // Moon (1)
    1: {
      1: {
        en: 'Moon in the D2 1st house gives an intuitive, fluctuating capacity to earn wealth. The native accumulates through nurturing professions, real estate, or businesses that serve public emotional needs.',
        hi: 'धनांश लग्न में चंद्रमा धन अर्जन की सहज, उतार-चढ़ाव भरी क्षमता देता है। जातक पोषण व्यवसायों या अचल संपत्ति से संचय करता है।',
      },
      2: {
        en: 'Moon in the D2 2nd house indicates savings that wax and wane like the Moon. The native builds family wealth through cycles of accumulation and spending, with emotional satisfaction driving financial decisions.',
        hi: 'धनांश द्वितीय में चंद्रमा चंद्रमा की तरह घटती-बढ़ती बचत दर्शाता है। जातक संचय और व्यय के चक्रों से पारिवारिक धन बनाता है।',
      },
      4: {
        en: 'Moon in the D2 4th house strongly favours property and real estate wealth. The native accumulates through ancestral land, domestic businesses, or nurturing environments that generate passive income.',
        hi: 'धनांश चतुर्थ में चंद्रमा संपत्ति और अचल संपत्ति धन का प्रबल समर्थन करता है। जातक पैतृक भूमि या घरेलू व्यवसायों से संचय करता है।',
      },
      5: {
        en: 'Moon in the D2 5th house brings emotional and intuitive investment decisions. The native may gain through speculative ventures driven by instinct, though emotional swings can affect financial judgement.',
        hi: 'धनांश पंचम में चंद्रमा भावनात्मक और सहज निवेश निर्णय लाता है। जातक सहज ज्ञान से सट्टे में लाभ पा सकता है।',
      },
      9: {
        en: 'Moon in the D2 9th house bestows fluctuating but recurring fortune. The native is blessed with intermittent windfalls connected to travel, mother\'s lineage, or devotional and spiritual activities.',
        hi: 'धनांश नवम में चंद्रमा उतार-चढ़ाव भरा लेकिन आवर्ती भाग्य प्रदान करता है। यात्रा, मातृ वंश या आध्यात्मिक गतिविधियों से सौभाग्य।',
      },
      11: {
        en: 'Moon in the D2 11th house generates multiple emotional and fluctuating income streams. The native earns through public-facing work, nurturing businesses, and a wide network of emotionally connected associates.',
        hi: 'धनांश एकादश में चंद्रमा अनेक भावनात्मक और उतार-चढ़ाव भरी आय धाराएं उत्पन्न करता है।',
      },
    },
    // Mars (2)
    2: {
      1: {
        en: 'Mars in the D2 1st house gives aggressive, self-driven wealth accumulation. The native earns through physical effort, competitive enterprise, real estate development, or technical fields.',
        hi: 'धनांश लग्न में मंगल आक्रामक, स्व-प्रेरित धन संचय देता है। जातक शारीरिक प्रयास, प्रतिस्पर्धी उद्यम या तकनीकी क्षेत्रों से कमाता है।',
      },
      2: {
        en: 'Mars in the D2 2nd house may cause impulsive spending that erodes savings. However, the native\'s drive to earn is powerful, and accumulated wealth is rebuilt repeatedly through sheer determination.',
        hi: 'धनांश द्वितीय में मंगल आवेगपूर्ण व्यय से बचत घटा सकता है। लेकिन जातक की कमाई की प्रेरणा शक्तिशाली है।',
      },
      4: {
        en: 'Mars in the D2 4th house drives wealth through land, construction, and real estate ventures. The native may profit from property development or technical work on immovable assets.',
        hi: 'धनांश चतुर्थ में मंगल भूमि, निर्माण और अचल संपत्ति उद्यमों से धन प्रेरित करता है।',
      },
      5: {
        en: 'Mars in the D2 5th house brings bold, high-risk speculative gains. The native may excel in trading, sports betting, or competitive investments — though losses are equally dramatic when Mars afflicts.',
        hi: 'धनांश पंचम में मंगल साहसी, उच्च-जोखिम सट्टा लाभ लाता है। जातक व्यापार या प्रतिस्पर्धी निवेश में उत्कृष्ट हो सकता है।',
      },
      9: {
        en: 'Mars in the D2 9th house connects fortune to adventurous action and overseas enterprise. The native may profit through bold dharmic ventures, sports, military, or foreign trade that requires physical courage.',
        hi: 'धनांश नवम में मंगल भाग्य को साहसिक कार्य और विदेशी उद्यम से जोड़ता है।',
      },
      11: {
        en: 'Mars in the D2 11th house generates income through competitive endeavours, technical skills, and an enterprising social network. The native turns friendships and alliances into active financial opportunities.',
        hi: 'धनांश एकादश में मंगल प्रतिस्पर्धी प्रयासों, तकनीकी कौशल और उद्यमशील नेटवर्क से आय उत्पन्न करता है।',
      },
    },
    // Mercury (3)
    3: {
      1: {
        en: 'Mercury in the D2 1st house gives intellectual and communicative financial capacity. The native earns through trade, writing, media, and mental agility — accumulating wealth by leveraging information and wit.',
        hi: 'धनांश लग्न में बुध बौद्धिक और संचारशील वित्तीय क्षमता देता है। जातक व्यापार, लेखन, मीडिया से धन अर्जित करता है।',
      },
      2: {
        en: 'Mercury in the D2 2nd house is excellent for accumulating wealth through business and commerce. The native saves intelligently, diversifies income, and understands financial instruments with natural ease.',
        hi: 'धनांश द्वितीय में बुध व्यापार और वाणिज्य से धन संचय के लिए उत्तम है। जातक बुद्धिमानी से बचत करता और आय विविधीकृत करता है।',
      },
      4: {
        en: 'Mercury in the D2 4th house creates wealth through real estate, data-driven businesses, or services connected to home and family. The native may profit from renting, property management, or domestic consulting.',
        hi: 'धनांश चतुर्थ में बुध अचल संपत्ति, डेटा-चालित व्यवसायों या घर और परिवार से संबंधित सेवाओं से धन बनाता है।',
      },
      5: {
        en: 'Mercury in the D2 5th house favours speculative gains through analytical intelligence. The native may profit through stock analysis, algorithmic trading, or intellectual creative ventures.',
        hi: 'धनांश पंचम में बुध विश्लेषणात्मक बुद्धिमत्ता से सट्टे में लाभ का समर्थन करता है। जातक शेयर विश्लेषण या एल्गोरिदमिक व्यापार से लाभ पा सकता है।',
      },
      9: {
        en: 'Mercury in the D2 9th house generates fortune through publishing, teaching, law, and long-distance trade. The native\'s intellectual breadth opens diverse income channels across geographies.',
        hi: 'धनांश नवम में बुध प्रकाशन, शिक्षण, कानून और दूरस्थ व्यापार से भाग्य उत्पन्न करता है।',
      },
      11: {
        en: 'Mercury in the D2 11th house creates income through diverse, intellectually driven networks. The native earns through consulting, media, and information businesses that reach wide audiences.',
        hi: 'धनांश एकादश में बुध विविध, बौद्धिक रूप से संचालित नेटवर्क से आय बनाता है।',
      },
    },
    // Jupiter (4)
    4: {
      1: {
        en: 'Jupiter in the D2 1st house is a powerful blessing for natural wealth accumulation. The native has an expansive financial capacity and attracts abundance through wisdom, generosity, and dharmic living.',
        hi: 'धनांश लग्न में गुरु प्राकृतिक धन संचय के लिए शक्तिशाली आशीर्वाद है। जातक ज्ञान, उदारता और धार्मिक जीवन से प्रचुरता आकर्षित करता है।',
      },
      2: {
        en: 'Jupiter in the D2 2nd house is the finest placement for savings and family wealth. The native is a natural accumulator who builds lasting financial reserves, and wealth grows across generations of the family.',
        hi: 'धनांश द्वितीय में गुरु बचत और पारिवारिक धन के लिए सर्वोत्तम स्थान है। जातक स्वाभाविक संचयकर्ता है और धन पीढ़ियों में बढ़ता है।',
      },
      4: {
        en: 'Jupiter in the D2 4th house multiplies wealth through property and ancestral assets. The native benefits from wise real estate decisions and may inherit or steward significant immovable wealth.',
        hi: 'धनांश चतुर्थ में गुरु संपत्ति और पैतृक संपदा से धन बढ़ाता है। जातक बुद्धिमान अचल संपत्ति निर्णयों से लाभान्वित होता है।',
      },
      5: {
        en: 'Jupiter in the D2 5th house gives fortunate speculative gains through wisdom and luck. The native may profit from education-related investments, children\'s enterprise, or well-timed market entries.',
        hi: 'धनांश पंचम में गुरु ज्ञान और भाग्य से अनुकूल सट्टा लाभ देता है। जातक शिक्षा-संबंधी निवेश या बच्चों के उद्यम से लाभ पा सकता है।',
      },
      9: {
        en: 'Jupiter in the D2 9th house is a supreme indicator of fortune, windfalls, and dharmic wealth. The native is financially blessed through their guru, father, or wise spiritual alignment with abundance.',
        hi: 'धनांश नवम में गुरु भाग्य, अनायास धन और धार्मिक संपत्ति का सर्वोच्च सूचक है।',
      },
      11: {
        en: 'Jupiter in the D2 11th house multiplies income streams through wisdom and expansive networks. The native\'s gains are abundant and grow through education, publishing, and philosophically aligned enterprises.',
        hi: 'धनांश एकादश में गुरु ज्ञान और विस्तृत नेटवर्क से आय धाराएं बढ़ाता है।',
      },
    },
    // Venus (5)
    5: {
      1: {
        en: 'Venus in the D2 1st house gives natural financial magnetism. The native attracts wealth through beauty, art, luxury goods, and relationships — money flows toward them as naturally as charm.',
        hi: 'धनांश लग्न में शुक्र प्राकृतिक वित्तीय आकर्षण देता है। जातक सौंदर्य, कला, विलासिता और संबंधों से धन आकर्षित करता है।',
      },
      2: {
        en: 'Venus in the D2 2nd house creates a love of luxury and beautiful possessions. The native accumulates wealth through aesthetic businesses, jewellery, perfumery, or the entertainment industry.',
        hi: 'धनांश द्वितीय में शुक्र विलासिता और सुंदर संपत्तियों के प्रति प्रेम बनाता है। जातक सौंदर्य व्यवसायों, जेवेलरी या मनोरंजन से संचय करता है।',
      },
      4: {
        en: 'Venus in the D2 4th house generates wealth through beautiful properties, luxury real estate, and interior aesthetics. The native may profit from hospitality, home décor, or leisure-oriented businesses.',
        hi: 'धनांश चतुर्थ में शुक्र सुंदर संपत्तियों, विलासिता अचल संपत्ति और आंतरिक सौंदर्यशास्त्र से धन उत्पन्न करता है।',
      },
      5: {
        en: 'Venus in the D2 5th house brings pleasant speculative gains, especially from creative industries. The native may profit from art investments, entertainment stocks, or beauty-related startups.',
        hi: 'धनांश पंचम में शुक्र सुखद सट्टा लाभ, विशेषकर रचनात्मक उद्योगों से लाता है।',
      },
      9: {
        en: 'Venus in the D2 9th house connects fortune to beauty, diplomacy, and harmonious international connections. The native may profit from luxury exports, fashion, and cross-cultural creative partnerships.',
        hi: 'धनांश नवम में शुक्र भाग्य को सौंदर्य, कूटनीति और सौहार्दपूर्ण अंतर्राष्ट्रीय संबंधों से जोड़ता है।',
      },
      11: {
        en: 'Venus in the D2 11th house generates income through pleasure, beauty, and a magnetic social circle. The native earns from creative collaborations, luxury networks, and artistic income streams.',
        hi: 'धनांश एकादश में शुक्र आनंद, सौंदर्य और आकर्षक सामाजिक वृत्त से आय उत्पन्न करता है।',
      },
    },
    // Saturn (6)
    6: {
      1: {
        en: 'Saturn in the D2 1st house gives slow but steadily accumulating wealth through disciplined effort and patience. The native builds financial capacity methodically, favouring conservative savings over risk.',
        hi: 'धनांश लग्न में शनि अनुशासित प्रयास और धैर्य से धीमी लेकिन स्थिरतापूर्वक बढ़ने वाली संपत्ति देता है।',
      },
      2: {
        en: 'Saturn in the D2 2nd house restricts spending and drives the native toward frugal, long-term wealth building. Financial growth is slow initially but compounds with age into substantial reserves.',
        hi: 'धनांश द्वितीय में शनि व्यय सीमित करता और मितव्ययी, दीर्घकालिक धन निर्माण की ओर प्रेरित करता है।',
      },
      4: {
        en: 'Saturn in the D2 4th house connects wealth to old, enduring property and ancestral land. The native may work in infrastructure, agriculture, or real estate that appreciates only over long periods.',
        hi: 'धनांश चतुर्थ में शनि धन को पुरानी, टिकाऊ संपत्ति और पैतृक भूमि से जोड़ता है।',
      },
      5: {
        en: 'Saturn in the D2 5th house restricts speculative gains and cautions the native against risky investments. Wealth, when it comes, is earned through disciplined, long-term financial strategies rather than short-term bets.',
        hi: 'धनांश पंचम में शनि सट्टा लाभ सीमित करता और जोखिम भरे निवेश से सावधान करता है।',
      },
      9: {
        en: 'Saturn in the D2 9th house delays fortune but ultimately delivers through sustained dharmic effort. The native may accumulate wealth in the second half of life through persistent, principled action.',
        hi: 'धनांश नवम में शनि भाग्य में विलंब करता है लेकिन निरंतर धार्मिक प्रयास से अंततः देता है।',
      },
      11: {
        en: 'Saturn in the D2 11th house creates income through sustained professional effort and long-term institutional relationships. Gains come steadily from disciplined networks and enduring business partnerships.',
        hi: 'धनांश एकादश में शनि निरंतर व्यावसायिक प्रयास और दीर्घकालिक संस्थागत संबंधों से आय बनाता है।',
      },
    },
    // Rahu (7)
    7: {
      1: {
        en: 'Rahu in the D2 1st house gives an insatiable drive for wealth accumulation, often through unconventional or foreign-linked financial channels. Sudden gains are possible, as are sudden reversals.',
        hi: 'धनांश लग्न में राहु धन संचय की अतृप्त प्रेरणा देता है, अक्सर अपरंपरागत या विदेश-संबंधित वित्तीय माध्यमों से।',
      },
      2: {
        en: 'Rahu in the D2 2nd house drives materialistic accumulation through ambitious, sometimes ethically ambiguous means. The native may accumulate rapidly but must guard against financial deception or dishonest speech.',
        hi: 'धनांश द्वितीय में राहु महत्वाकांक्षी, कभी-कभी नैतिक रूप से अस्पष्ट माध्यमों से भौतिक संचय प्रेरित करता है।',
      },
      4: {
        en: 'Rahu in the D2 4th house brings unusual or foreign-linked property gains. The native may accumulate real estate through unconventional transactions or benefit from land in foreign or non-ancestral locations.',
        hi: 'धनांश चतुर्थ में राहु असामान्य या विदेश-संबंधित संपत्ति लाभ लाता है।',
      },
      5: {
        en: 'Rahu in the D2 5th house brings sudden, dramatic speculative gains — and equally sudden losses. The native is attracted to high-risk investment strategies and must temper speculative instincts with discipline.',
        hi: 'धनांश पंचम में राहु अचानक, नाटकीय सट्टा लाभ — और समान रूप से अचानक हानि लाता है।',
      },
      9: {
        en: 'Rahu in the D2 9th house generates fortune through foreign lands, unconventional guru connections, or ethically ambiguous long-distance trade. Windfalls can come from unexpected overseas quarters.',
        hi: 'धनांश नवम में राहु विदेशी भूमि, अपरंपरागत गुरु संबंधों या नैतिक रूप से अस्पष्ट दूरस्थ व्यापार से भाग्य उत्पन्न करता है।',
      },
      11: {
        en: 'Rahu in the D2 11th house is a classic indicator of sudden gains through unconventional income streams — cryptocurrency, speculation, or technology-driven financial innovation. Gains can be spectacular.',
        hi: 'धनांश एकादश में राहु अपरंपरागत आय धाराओं — क्रिप्टोकरेंसी, सट्टे या प्रौद्योगिकी — से अचानक लाभ का क्लासिक सूचक है।',
      },
    },
    // Ketu (8)
    8: {
      1: {
        en: 'Ketu in the D2 1st house creates detachment from material wealth accumulation. The native may be financially capable yet indifferent to money, finding that wealth comes and goes according to karmic patterns.',
        hi: 'धनांश लग्न में केतु भौतिक धन संचय से विरक्ति बनाता है। जातक वित्तीय रूप से सक्षम हो सकता है फिर भी धन के प्रति उदासीन रहता है।',
      },
      2: {
        en: 'Ketu in the D2 2nd house indicates past-life karma around family wealth. The native may struggle to retain savings or experience unexpected dissolution of accumulated assets, learning to value non-material riches.',
        hi: 'धनांश द्वितीय में केतु पारिवारिक धन के इर्द-गिर्द पूर्वजन्म कर्म दर्शाता है। जातक बचत बनाए रखने में संघर्ष कर सकता है।',
      },
      4: {
        en: 'Ketu in the D2 4th house detaches the native from conventional property accumulation. Real estate matters may dissolve or become irrelevant, and the native finds their true home in spiritual rather than material anchors.',
        hi: 'धनांश चतुर्थ में केतु पारंपरिक संपत्ति संचय से विरक्त करता है। जातक भौतिक के बजाय आध्यात्मिक लंगर में सच्चा घर पाता है।',
      },
      5: {
        en: 'Ketu in the D2 5th house brings disinterest in speculation and an intuitive avoidance of risky investment. Past-life financial wisdom makes the native cautious, and financial losses through speculation are minimised.',
        hi: 'धनांश पंचम में केतु सट्टे में अरुचि और जोखिम भरे निवेश से सहज परिहार लाता है।',
      },
      9: {
        en: 'Ketu in the D2 9th house creates spiritual detachment from fortune and windfall expectations. The native\'s greatest wealth is inner wisdom, and material fortune serves the spiritual path rather than ego desires.',
        hi: 'धनांश नवम में केतु भाग्य और अनायास धन की अपेक्षाओं से आध्यात्मिक विरक्ति बनाता है।',
      },
      11: {
        en: 'Ketu in the D2 11th house detaches the native from conventional income ambitions. Gains may come unexpectedly from spiritual or charitable work, and the native finds fulfilment beyond material income measures.',
        hi: 'धनांश एकादश में केतु पारंपरिक आय महत्वाकांक्षाओं से विरक्त करता है। लाभ आध्यात्मिक या धर्मार्थ कार्य से अप्रत्याशित रूप से आ सकता है।',
      },
    },
  },

  // ---------------------------------------------------------------------------
  // D20/D60 — Spiritual / Moksha domain — 36 entries
  // 9 planets × houses 1, 5, 9, 12
  // ---------------------------------------------------------------------------
  spiritual: {
    // Sun (0)
    0: {
      1: {
        en: 'Sun in the D20 1st house reveals a soul whose spiritual identity is strong and luminous. The native is drawn to solar, radiant spiritual paths — devotion to a divine father figure, Shaivism, or royal Vedic traditions.',
        hi: 'विंशांश लग्न में सूर्य एक आत्मा दर्शाता है जिसकी आध्यात्मिक पहचान प्रबल और तेजस्वी है। जातक शैवागम या वैदिक परंपराओं की ओर आकर्षित होता है।',
      },
      5: {
        en: 'Sun in the D20 5th house indicates past-life spiritual merit accumulated through devotional practice, royal patronage of temples, or teaching sacred arts. Creative expression becomes a vehicle for divine connection.',
        hi: 'विंशांश पंचम में सूर्य भक्ति, मंदिर संरक्षण या पवित्र कलाओं की शिक्षा से संचित पूर्वजन्म आध्यात्मिक योग्यता दर्शाता है।',
      },
      9: {
        en: 'Sun in the D20 9th house grants a luminous guru relationship and a clear dharmic path. The native is blessed with direct access to authoritative spiritual teachers and a tradition of respected solar lineage.',
        hi: 'विंशांश नवम में सूर्य तेजस्वी गुरु संबंध और स्पष्ट धार्मिक मार्ग प्रदान करता है। जातक अधिकृत आध्यात्मिक शिक्षकों तक सीधी पहुंच से धन्य है।',
      },
      12: {
        en: 'Sun in the D20 12th house dissolves the ego in spiritual service and liberation. The native is drawn toward renunciation, monastic life, or moksha through surrender of individual will to the divine.',
        hi: 'विंशांश द्वादश में सूर्य आध्यात्मिक सेवा और मुक्ति में अहंकार का विसर्जन करता है। जातक संन्यास या ईश्वरीय इच्छा के समर्पण से मोक्ष की ओर आकर्षित होता है।',
      },
    },
    // Moon (1)
    1: {
      1: {
        en: 'Moon in the D20 1st house shows a naturally devotional, emotionally receptive spiritual nature. The native is drawn to bhakti traditions, lunar deity worship, and paths that honour the divine feminine.',
        hi: 'विंशांश लग्न में चंद्रमा स्वाभाविक रूप से भक्तिमय, भावनात्मक रूप से ग्रहणशील आध्यात्मिक प्रकृति दर्शाता है।',
      },
      5: {
        en: 'Moon in the D20 5th house reveals past-life spiritual merit through emotional devotion, mantra practice, and service at sacred sites. The heart is an open channel for divine grace.',
        hi: 'विंशांश पंचम में चंद्रमा भावनात्मक भक्ति, मंत्र साधना और पवित्र स्थलों पर सेवा से पूर्वजन्म आध्यात्मिक योग्यता प्रकट करता है।',
      },
      9: {
        en: 'Moon in the D20 9th house blesses the native with a compassionate guru and a devotional dharmic path. Pilgrimage and sacred water rituals carry special significance for this soul\'s spiritual evolution.',
        hi: 'विंशांश नवम में चंद्रमा करुणामय गुरु और भक्तिमय धार्मिक मार्ग का आशीर्वाद देता है।',
      },
      12: {
        en: 'Moon in the D20 12th house draws the native toward mystical, oceanic spiritual experiences. Liberation comes through emotional dissolution, dream work, and surrender to the divine mother.',
        hi: 'विंशांश द्वादश में चंद्रमा जातक को रहस्यमय, महासागरीय आध्यात्मिक अनुभवों की ओर खींचता है।',
      },
    },
    // Mars (2)
    2: {
      1: {
        en: 'Mars in the D20 1st house gives a warrior-like spiritual constitution. The native pursues the spiritual path with intense discipline and energy — suited for tantric practice, martial spiritual arts, or fierce renunciation.',
        hi: 'विंशांश लग्न में मंगल योद्धा-सी आध्यात्मिक संरचना देता है। जातक तांत्रिक साधना, मार्शल आध्यात्मिक कला या कठोर संन्यास के लिए उपयुक्त।',
      },
      5: {
        en: 'Mars in the D20 5th house indicates past-life merit built through tapas, physical austerities, and protection of the dharmic order. Spiritual energy is strong and activating.',
        hi: 'विंशांश पंचम में मंगल तपस, शारीरिक तपस्या और धार्मिक व्यवस्था की रक्षा से निर्मित पूर्वजन्म योग्यता दर्शाता है।',
      },
      9: {
        en: 'Mars in the D20 9th house connects dharma to action and protection. The native\'s guru is a fiery, action-oriented teacher, and the spiritual path involves active service, pilgrimage on foot, or temple defence.',
        hi: 'विंशांश नवम में मंगल धर्म को कार्य और रक्षा से जोड़ता है। जातक का गुरु उग्र, क्रिया-उन्मुख शिक्षक है।',
      },
      12: {
        en: 'Mars in the D20 12th house channels spiritual energy toward intense yogic practice and dissolution of ego through willpower. Moksha is approached through disciplined tapas rather than passive surrender.',
        hi: 'विंशांश द्वादश में मंगल आध्यात्मिक ऊर्जा को गहन योगिक अभ्यास की ओर मोड़ता है। मोक्ष निष्क्रिय समर्पण के बजाय अनुशासित तपस से प्राप्त होता है।',
      },
    },
    // Mercury (3)
    3: {
      1: {
        en: 'Mercury in the D20 1st house gives a spiritually intellectual nature. The native pursues liberation through scriptural study, debate, and analytical understanding of sacred texts rather than emotional devotion alone.',
        hi: 'विंशांश लग्न में बुध आध्यात्मिक रूप से बौद्धिक प्रकृति देता है। जातक शास्त्र अध्ययन, बहस और पवित्र ग्रंथों के विश्लेषण से मुक्ति की ओर अग्रसर होता है।',
      },
      5: {
        en: 'Mercury in the D20 5th house indicates past-life merit through teaching, translating scriptures, and intellectual propagation of dharma. The mind carries ancient Vedic knowledge from prior births.',
        hi: 'विंशांश पंचम में बुध शिक्षण, शास्त्र अनुवाद और धर्म के बौद्धिक प्रसार से पूर्वजन्म योग्यता दर्शाता है।',
      },
      9: {
        en: 'Mercury in the D20 9th house blesses the native with a learned, articulate guru who transmits dharma through precise language and systematic teaching. The Jnana yoga path suits this native deeply.',
        hi: 'विंशांश नवम में बुध विद्वान, वाक्पटु गुरु का आशीर्वाद देता है जो सटीक भाषा से धर्म प्रसारित करता है।',
      },
      12: {
        en: 'Mercury in the D20 12th house brings liberation through intellectual silence — the native must ultimately surrender analytical mind to experience moksha beyond concepts and words.',
        hi: 'विंशांश द्वादश में बुध बौद्धिक मौन से मुक्ति लाता है। जातक को मोक्ष का अनुभव करने के लिए अंततः विश्लेषणात्मक मन को समर्पित करना होगा।',
      },
    },
    // Jupiter (4)
    4: {
      1: {
        en: 'Jupiter in the D20 1st house gives an innately wise, benevolent, and naturally dharmic spiritual constitution. The native is a born spiritual aspirant whose very presence radiates Vedic grace.',
        hi: 'विंशांश लग्न में गुरु सहज रूप से बुद्धिमान, परोपकारी और स्वाभाविक रूप से धार्मिक आध्यात्मिक संरचना देता है।',
      },
      5: {
        en: 'Jupiter in the D20 5th house reveals deep past-life merit accumulated through teaching, philanthropy, and embodying dharma across multiple lifetimes. Spiritual grace flows effortlessly to this soul.',
        hi: 'विंशांश पंचम में गुरु शिक्षण, परोपकार और अनेक जन्मों में धर्म के मूर्त रूप से संचित गहन पूर्वजन्म योग्यता प्रकट करता है।',
      },
      9: {
        en: 'Jupiter in the D20 9th house is the finest placement for guru blessing. The native receives direct transmission from a genuine spiritual lineage and their dharmic path is clear, expansive, and deeply fulfilling.',
        hi: 'विंशांश नवम में गुरु गुरु आशीर्वाद के लिए सर्वोत्तम स्थान है। जातक प्रामाणिक आध्यात्मिक वंश से सीधा संचरण प्राप्त करता है।',
      },
      12: {
        en: 'Jupiter in the D20 12th house guides the native toward liberation through expansive wisdom and compassionate service. Moksha is achieved not through withdrawal but through universal love and selfless teaching.',
        hi: 'विंशांश द्वादश में गुरु विशाल ज्ञान और करुणामय सेवा से मुक्ति की ओर मार्गदर्शन करता है।',
      },
    },
    // Venus (5)
    5: {
      1: {
        en: 'Venus in the D20 1st house gives a spirituality rooted in beauty, art, and devotional aesthetics. The native is drawn to Vaishnava traditions, sacred music, mandalas, and worship through sensory refinement.',
        hi: 'विंशांश लग्न में शुक्र सौंदर्य, कला और भक्तिमय सौंदर्यशास्त्र में निहित आध्यात्मिकता देता है। जातक वैष्णव परंपराओं की ओर आकर्षित होता है।',
      },
      5: {
        en: 'Venus in the D20 5th house reveals past-life spiritual merit earned through sacred art, temple dance, devotional music, and service through beauty. The soul carries deep aesthetic dharmic wisdom.',
        hi: 'विंशांश पंचम में शुक्र पवित्र कला, मंदिर नृत्य, भक्ति संगीत और सौंदर्य के माध्यम से सेवा से अर्जित पूर्वजन्म आध्यात्मिक योग्यता प्रकट करता है।',
      },
      9: {
        en: 'Venus in the D20 9th house gives a guru who transmits dharma through love, art, and devotional grace. The native\'s spiritual path is filled with aesthetic beauty, sacred relationships, and bhakti.',
        hi: 'विंशांश नवम में शुक्र प्रेम, कला और भक्ति अनुग्रह से धर्म प्रसारित करने वाला गुरु देता है।',
      },
      12: {
        en: 'Venus in the D20 12th house channels spiritual energy through surrender in love and dissolution of the individual self in divine union. Liberation through bhakti and sacred intimacy is the native\'s path.',
        hi: 'विंशांश द्वादश में शुक्र प्रेम में समर्पण और दिव्य मिलन में व्यक्तिगत आत्मा के विसर्जन से आध्यात्मिक ऊर्जा को प्रवाहित करता है।',
      },
    },
    // Saturn (6)
    6: {
      1: {
        en: 'Saturn in the D20 1st house gives a spirituality of patient endurance, karma yoga, and service. The native earns liberation slowly through disciplined action, self-denial, and unwavering commitment to duty.',
        hi: 'विंशांश लग्न में शनि धैर्यपूर्ण सहनशीलता, कर्म योग और सेवा की आध्यात्मिकता देता है।',
      },
      5: {
        en: 'Saturn in the D20 5th house indicates past-life merit through austere practice, karma yoga, and service to the marginalized. The soul carries the weight of many lifetimes of disciplined spiritual effort.',
        hi: 'विंशांश पंचम में शनि कठोर साधना, कर्म योग और हाशिये पर रहने वाले लोगों की सेवा से पूर्वजन्म योग्यता दर्शाता है।',
      },
      9: {
        en: 'Saturn in the D20 9th house gives a stern, disciplined guru whose teachings involve endurance and stripping away illusion. The dharmic path is rigorous but leads to solid, unshakeable liberation.',
        hi: 'विंशांश नवम में शनि कठोर, अनुशासित गुरु देता है जिसकी शिक्षाओं में सहनशीलता और भ्रम को दूर करना शामिल है।',
      },
      12: {
        en: 'Saturn in the D20 12th house leads the native toward liberation through extended isolation, monastic life, or solitary contemplative practice. Moksha comes slowly but with the permanence of stone.',
        hi: 'विंशांश द्वादश में शनि विस्तारित एकांत, मठवासी जीवन या एकल चिंतनशील अभ्यास से मुक्ति की ओर ले जाता है।',
      },
    },
    // Rahu (7)
    7: {
      1: {
        en: 'Rahu in the D20 1st house gives an unusual, eclectic, and intensely curious spiritual nature. The native may explore foreign or heterodox spiritual systems before arriving at a deeply personal synthesis.',
        hi: 'विंशांश लग्न में राहु असामान्य, उदार और तीव्र रूप से जिज्ञासु आध्यात्मिक प्रकृति देता है।',
      },
      5: {
        en: 'Rahu in the D20 5th house suggests complex past-life karmic patterns around spiritual practice — the native may have used spiritual power ambitiously in prior lives and now seeks genuine purification.',
        hi: 'विंशांश पंचम में राहु आध्यात्मिक साधना के इर्द-गिर्द जटिल पूर्वजन्म कार्मिक पैटर्न का सुझाव देता है।',
      },
      9: {
        en: 'Rahu in the D20 9th house may bring an unconventional, foreign, or non-traditional guru. The native\'s dharma is discovered through experimentation and may involve western, tantric, or cross-cultural paths.',
        hi: 'विंशांश नवम में राहु अपरंपरागत, विदेशी या गैर-पारंपरिक गुरु ला सकता है।',
      },
      12: {
        en: 'Rahu in the D20 12th house creates a complex relationship with liberation — the native\'s desire for moksha can itself become an obsession. True surrender requires releasing even the ambition to be free.',
        hi: 'विंशांश द्वादश में राहु मुक्ति के साथ जटिल संबंध बनाता है। सच्चे समर्पण के लिए मुक्त होने की महत्वाकांक्षा भी छोड़नी होती है।',
      },
    },
    // Ketu (8)
    8: {
      1: {
        en: 'Ketu in the D20 1st house is one of the deepest moksha indicators in the varga chart. The native arrives in this life already spiritually advanced, drawn instinctively toward renunciation, mysticism, and the formless.',
        hi: 'विंशांश लग्न में केतु वर्ग कुंडली में गहनतम मोक्ष सूचकों में से एक है। जातक इस जीवन में पहले से आध्यात्मिक रूप से उन्नत आता है।',
      },
      5: {
        en: 'Ketu in the D20 5th house reveals vast past-life spiritual merit through deep meditation, mystical attainment, and service in ashrams or renunciate communities. Liberation is very close for this soul.',
        hi: 'विंशांश पंचम में केतु गहरे ध्यान, रहस्यमय उपलब्धि और आश्रमों में सेवा से विशाल पूर्वजन्म आध्यात्मिक योग्यता प्रकट करता है।',
      },
      9: {
        en: 'Ketu in the D20 9th house indicates a guru or tradition that is formless, mystical, and beyond conventional religion. The native\'s dharma is to dissolve all conceptual frameworks and rest in pure awareness.',
        hi: 'विंशांश नवम में केतु निराकार, रहस्यमय और पारंपरिक धर्म से परे गुरु या परंपरा का संकेत देता है।',
      },
      12: {
        en: 'Ketu in the D20 12th house is the supreme moksha placement. The native has nearly completed the spiritual journey across lifetimes and this incarnation serves as the final doorway into liberation.',
        hi: 'विंशांश द्वादश में केतु सर्वोच्च मोक्ष स्थान है। जातक ने जन्मों में आध्यात्मिक यात्रा लगभग पूर्ण कर ली है और यह जन्म मुक्ति का अंतिम द्वार है।',
      },
    },
  },

  // ---------------------------------------------------------------------------
  // D30 Trimsamsha — Health / Vitality domain — 36 entries
  // 9 planets × houses 1, 6, 8, 12
  // ---------------------------------------------------------------------------
  health: {
    // Sun (0)
    0: {
      1: {
        en: 'Sun in the D30 1st house gives a robust vital constitution with strong recuperative power. The native has a fundamentally resilient body that resists chronic illness and recovers quickly from acute conditions.',
        hi: 'त्रिंशांश लग्न में सूर्य मजबूत पुनर्प्राप्ति शक्ति के साथ दृढ़ जीवन संरचना देता है। जातक का शरीर पुरानी बीमारी से प्रतिरोधी और तेजी से ठीक होता है।',
      },
      6: {
        en: 'Sun in the D30 6th house gives strong immunity and the capacity to overcome enemies of health through willpower. The native fights disease with authority but must watch for heart or spine-related conditions.',
        hi: 'त्रिंशांश षष्ठ में सूर्य प्रबल रोग-प्रतिरोधक क्षमता और इच्छाशक्ति से स्वास्थ्य शत्रुओं पर विजय की क्षमता देता है।',
      },
      8: {
        en: 'Sun in the D30 8th house indicates hidden vitality challenges — conditions that are not immediately apparent but may surface under stress. Surgery or invasive procedures may be needed; recovery is ultimately possible.',
        hi: 'त्रिंशांश अष्टम में सूर्य छिपी हुई जीवन शक्ति चुनौतियों का संकेत देता है। शल्य चिकित्सा की आवश्यकता हो सकती है लेकिन स्वास्थ्य-लाभ संभव है।',
      },
      12: {
        en: 'Sun in the D30 12th house may indicate hospitalisation or periods of isolation for health reasons. The native must consciously attend to sleep quality and right-eye health; retreats aid recovery.',
        hi: 'त्रिंशांश द्वादश में सूर्य अस्पताल में भर्ती या स्वास्थ्य कारणों से एकांत का संकेत दे सकता है।',
      },
    },
    // Moon (1)
    1: {
      1: {
        en: 'Moon in the D30 1st house gives an emotionally sensitive constitution. Physical health is closely tied to mental and emotional states — when the mind is at peace, the body thrives.',
        hi: 'त्रिंशांश लग्न में चंद्रमा भावनात्मक रूप से संवेदनशील संरचना देता है। जब मन शांत होता है, शरीर फलता-फूलता है।',
      },
      6: {
        en: 'Moon in the D30 6th house creates susceptibility to emotionally triggered illnesses — digestive disorders, hormonal imbalances, and conditions worsened by anxiety. Emotional regulation is primary preventive care.',
        hi: 'त्रिंशांश षष्ठ में चंद्रमा भावनात्मक रूप से उत्पन्न बीमारियों की संवेदनशीलता बनाता है। भावनात्मक नियमन प्राथमिक निवारक देखभाल है।',
      },
      8: {
        en: 'Moon in the D30 8th house indicates vulnerability to hidden or fluctuating chronic conditions, especially those related to fluids, blood, or the lymphatic system. Intuition is a guide to early symptom detection.',
        hi: 'त्रिंशांश अष्टम में चंद्रमा छिपी या उतार-चढ़ाव वाली पुरानी स्थितियों, विशेषकर तरल पदार्थ या लसीका प्रणाली से संबंधित, के प्रति संवेदनशीलता दर्शाता है।',
      },
      12: {
        en: 'Moon in the D30 12th house connects health to mental rest and subconscious healing. Hospitalisations may occur during emotionally turbulent periods; dream states carry important health information.',
        hi: 'त्रिंशांश द्वादश में चंद्रमा स्वास्थ्य को मानसिक विश्राम और अवचेतन उपचार से जोड़ता है।',
      },
    },
    // Mars (2)
    2: {
      1: {
        en: 'Mars in the D30 1st house gives a strong, energetic, and muscular constitution with high physical resilience. The native recovers fast from injuries and has abundant vitality, though inflammatory conditions are a risk.',
        hi: 'त्रिंशांश लग्न में मंगल उच्च शारीरिक लचीलापन के साथ मजबूत, ऊर्जावान और मांसपेशीय संरचना देता है।',
      },
      6: {
        en: 'Mars in the D30 6th house is a classic indicator of strong immunity and the ability to fight off disease decisively. The native\'s body mounts aggressive immune responses; accidents and febrile illnesses are the main risks.',
        hi: 'त्रिंशांश षष्ठ में मंगल प्रबल प्रतिरक्षा और रोग को निर्णायक रूप से दूर करने की क्षमता का क्लासिक सूचक है।',
      },
      8: {
        en: 'Mars in the D30 8th house indicates risk of surgery, accident-related injuries, or acute crises requiring medical intervention. The native must take precautions with sharp instruments and high-risk activities.',
        hi: 'त्रिंशांश अष्टम में मंगल शल्य चिकित्सा, दुर्घटना-संबंधी चोटों या चिकित्सा हस्तक्षेप की आवश्यकता वाले तीव्र संकट का जोखिम दर्शाता है।',
      },
      12: {
        en: 'Mars in the D30 12th house may indicate hospitalisation following injury, surgery, or inflammatory conditions requiring extended recovery. Physical isolation allows the body\'s natural healing processes to work.',
        hi: 'त्रिंशांश द्वादश में मंगल चोट, शल्य चिकित्सा या विस्तारित पुनर्प्राप्ति की आवश्यकता वाली सूजन स्थितियों के बाद अस्पताल में भर्ती का संकेत दे सकता है।',
      },
    },
    // Mercury (3)
    3: {
      1: {
        en: 'Mercury in the D30 1st house gives a nervous, adaptable constitution with quick reflexes. The native is mentally agile and recovers well from illness, though the nervous system is the primary vulnerability.',
        hi: 'त्रिंशांश लग्न में बुध तीव्र सजगता के साथ तंत्रिका, अनुकूलनीय संरचना देता है। तंत्रिका तंत्र प्राथमिक संवेदनशीलता है।',
      },
      6: {
        en: 'Mercury in the D30 6th house creates susceptibility to nervous-system disorders, respiratory conditions, and conditions worsened by mental stress. Intellectual activity must be balanced with physical grounding.',
        hi: 'त्रिंशांश षष्ठ में बुध तंत्रिका तंत्र विकारों, श्वसन स्थितियों और मानसिक तनाव से बिगड़ने वाली स्थितियों की संवेदनशीलता बनाता है।',
      },
      8: {
        en: 'Mercury in the D30 8th house may indicate hidden neurological conditions or diagnostic complexity — illnesses that require extensive testing to identify. The native often researches their own health deeply.',
        hi: 'त्रिंशांश अष्टम में बुध छिपी न्यूरोलॉजिकल स्थितियों या नैदानिक जटिलता का संकेत दे सकता है।',
      },
      12: {
        en: 'Mercury in the D30 12th house connects health to mental rest and the quieting of analytical mind. Sleep disorders and anxiety-driven illness are risks; meditation and digital detox are powerful remedies.',
        hi: 'त्रिंशांश द्वादश में बुध स्वास्थ्य को मानसिक विश्राम और विश्लेषणात्मक मन की शांति से जोड़ता है।',
      },
    },
    // Jupiter (4)
    4: {
      1: {
        en: 'Jupiter in the D30 1st house gives an expansive, healthy, and naturally fortified constitution. The native tends toward good health throughout life, with a strong liver and broad physical resilience.',
        hi: 'त्रिंशांश लग्न में गुरु विस्तृत, स्वस्थ और स्वाभाविक रूप से सुदृढ़ संरचना देता है। जातक जीवन भर अच्छे स्वास्थ्य की ओर झुकता है।',
      },
      6: {
        en: 'Jupiter in the D30 6th house gives the native natural healing capacity and optimistic recovery. Health challenges are overcome through wisdom, appropriate treatment, and the body\'s innate expansive vitality.',
        hi: 'त्रिंशांश षष्ठ में गुरु जातक को प्राकृतिक उपचार क्षमता और आशावादी स्वास्थ्य-लाभ देता है।',
      },
      8: {
        en: 'Jupiter in the D30 8th house mitigates the severity of hidden health challenges through protective grace. Even serious chronic conditions tend to be manageable, and medical interventions generally succeed.',
        hi: 'त्रिंशांश अष्टम में गुरु सुरक्षात्मक अनुग्रह से छिपी स्वास्थ्य चुनौतियों की गंभीरता को कम करता है।',
      },
      12: {
        en: 'Jupiter in the D30 12th house turns hospitalisation or health isolation into a period of healing and philosophical reflection. The native finds meaning in illness and recovers with expanded wisdom.',
        hi: 'त्रिंशांश द्वादश में गुरु अस्पताल में भर्ती या स्वास्थ्य एकांत को उपचार और दार्शनिक चिंतन के काल में बदलता है।',
      },
    },
    // Venus (5)
    5: {
      1: {
        en: 'Venus in the D30 1st house gives a pleasurable, sensory-rich constitution with good reproductive vitality. The native maintains health through beauty routines, balanced pleasures, and a harmonious lifestyle.',
        hi: 'त्रिंशांश लग्न में शुक्र अच्छी प्रजनन जीवन शक्ति के साथ सुखद, इंद्रिय-समृद्ध संरचना देता है।',
      },
      6: {
        en: 'Venus in the D30 6th house may create susceptibility to kidney, urinary, or reproductive health conditions. A lifestyle of excessive pleasure can compound these risks; balance and moderation are protective.',
        hi: 'त्रिंशांश षष्ठ में शुक्र गुर्दे, मूत्र या प्रजनन स्वास्थ्य स्थितियों की संवेदनशीलता बना सकता है।',
      },
      8: {
        en: 'Venus in the D30 8th house indicates vulnerability to hidden reproductive or hormonal conditions. The native may require gynaecological or urological investigation; early screening is advisable.',
        hi: 'त्रिंशांश अष्टम में शुक्र छिपी प्रजनन या हार्मोनल स्थितियों के प्रति संवेदनशीलता दर्शाता है।',
      },
      12: {
        en: 'Venus in the D30 12th house connects health to rest, sensory withdrawal, and rejuvenating retreats. The native heals best in luxurious, peaceful environments where aesthetic pleasures are consciously enjoyed.',
        hi: 'त्रिंशांश द्वादश में शुक्र स्वास्थ्य को विश्राम, इंद्रिय वापसी और कायाकल्प विश्रामागार से जोड़ता है।',
      },
    },
    // Saturn (6)
    6: {
      1: {
        en: 'Saturn in the D30 1st house gives a lean, enduring constitution that is slow to both sicken and recover. Chronic conditions may develop early but are typically manageable through disciplined health regimens.',
        hi: 'त्रिंशांश लग्न में शनि दुबली, स्थायी संरचना देता है जो बीमार पड़ने और ठीक होने दोनों में धीमी है।',
      },
      6: {
        en: 'Saturn in the D30 6th house creates susceptibility to chronic, slow-developing conditions — arthritis, skeletal issues, and conditions of gradual degeneration. Preventive discipline and regular health monitoring are key.',
        hi: 'त्रिंशांश षष्ठ में शनि पुरानी, धीरे-धीरे विकसित होने वाली स्थितियों की संवेदनशीलता बनाता है। निवारक अनुशासन और नियमित स्वास्थ्य निगरानी आवश्यक।',
      },
      8: {
        en: 'Saturn in the D30 8th house indicates chronic but manageable hidden health conditions. Longevity is generally strong despite recurrent ailments, and the native survives health crises through endurance and medical persistence.',
        hi: 'त्रिंशांश अष्टम में शनि पुरानी लेकिन प्रबंधनीय छिपी स्वास्थ्य स्थितियों का संकेत देता है। बार-बार आने वाली बीमारियों के बावजूद दीर्घायु आम तौर पर प्रबल रहती है।',
      },
      12: {
        en: 'Saturn in the D30 12th house may indicate prolonged hospitalisation or extended periods of physical isolation for health reasons. The native is built for endurance — long recoveries ultimately succeed.',
        hi: 'त्रिंशांश द्वादश में शनि स्वास्थ्य कारणों से लंबे समय तक अस्पताल में भर्ती या शारीरिक एकांत का संकेत दे सकता है।',
      },
    },
    // Rahu (7)
    7: {
      1: {
        en: 'Rahu in the D30 1st house gives an unusual, hard-to-diagnose constitutional health profile. The native may experience atypical or exotic conditions that confuse conventional medicine; integrative and alternative approaches help.',
        hi: 'त्रिंशांश लग्न में राहु असामान्य, निदान करने में कठिन संवैधानिक स्वास्थ्य प्रोफ़ाइल देता है।',
      },
      6: {
        en: 'Rahu in the D30 6th house may create mysterious or misdiagnosed chronic conditions. The native is drawn to alternative, foreign, or experimental medical treatments — some of which prove unexpectedly effective.',
        hi: 'त्रिंशांश षष्ठ में राहु रहस्यमय या गलत निदान वाली पुरानी स्थितियां बना सकता है।',
      },
      8: {
        en: 'Rahu in the D30 8th house indicates sudden, unexpected health crises that erupt without obvious warning. Foreign or viral illnesses and unusual surgical findings are possible; second opinions are strongly advisable.',
        hi: 'त्रिंशांश अष्टम में राहु अचानक, अप्रत्याशित स्वास्थ्य संकट का संकेत देता है। दूसरी राय दृढ़ता से उचित है।',
      },
      12: {
        en: 'Rahu in the D30 12th house may lead to hospitalisation in foreign countries or treatment through unconventional medical institutions. The native\'s path to healing may involve radical departures from mainstream care.',
        hi: 'त्रिंशांश द्वादश में राहु विदेशी देशों में या अपरंपरागत चिकित्सा संस्थानों के माध्यम से उपचार की ओर ले जा सकता है।',
      },
    },
    // Ketu (8)
    8: {
      1: {
        en: 'Ketu in the D30 1st house gives an otherworldly, sometimes fragile constitution that is spiritually sensitive. The native may experience psychosomatic conditions or illnesses that defy physical explanation.',
        hi: 'त्रिंशांश लग्न में केतु आध्यात्मिक रूप से संवेदनशील, कभी-कभी नाजुक संरचना देता है। जातक मनोदैहिक स्थितियां अनुभव कर सकता है।',
      },
      6: {
        en: 'Ketu in the D30 6th house gives an unusual relationship with disease — conditions may dissolve inexplicably, or the native may develop immunity through past-life health karma. Spiritual healing is especially effective.',
        hi: 'त्रिंशांश षष्ठ में केतु रोग के साथ असामान्य संबंध देता है। स्थितियां अकथनीय रूप से ठीक हो सकती हैं। आध्यात्मिक उपचार विशेष रूप से प्रभावी है।',
      },
      8: {
        en: 'Ketu in the D30 8th house indicates past-life health karma playing out through mysterious or rare conditions. The native may be drawn to spiritual healing over conventional medicine, sometimes with remarkable results.',
        hi: 'त्रिंशांश अष्टम में केतु रहस्यमय या दुर्लभ स्थितियों से पूर्वजन्म स्वास्थ्य कर्म दर्शाता है। आध्यात्मिक उपचार उल्लेखनीय परिणाम दे सकता है।',
      },
      12: {
        en: 'Ketu in the D30 12th house points to liberation through illness — the native may experience transformative health crises that strip away ego and accelerate spiritual growth. Healing becomes a deeply mystical process.',
        hi: 'त्रिंशांश द्वादश में केतु रोग से मुक्ति की ओर संकेत करता है। उपचार एक गहरी रहस्यमय प्रक्रिया बन जाती है।',
      },
    },
  },
};
