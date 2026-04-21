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
};
