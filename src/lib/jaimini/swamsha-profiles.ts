/**
 * Swamsha Profile Library
 *
 * Interpretations for the Atmakaraka in each of the 12 navamsha signs
 * (Swamsha / Karakamsha Lagna). Based on Jaimini Sutras Ch.1-2.
 *
 * The Atmakaraka's navamsha sign defines the soul's deepest purpose,
 * spiritual orientation, and natural career inclination.
 *
 * planetModifiers (added Apr 2026): per-planet nuances when a specific
 * planet is the AK in this Swamsha sign. 7 classical planets (0-6);
 * Rahu/Ketu are rarely AK in classical Jaimini, so omitted.
 * Reference: Jaimini Sutras 1.2.19-31, Sanjay Rath "Upadesa Sutras"
 */

export interface SwamshaProfile {
  signId: number;  // 1-12
  signName: { en: string; hi: string };
  personality: { en: string; hi: string };  // 2-3 sentences
  spiritualPath: { en: string; hi: string }; // 1-2 sentences
  career: { en: string; hi: string };        // 1-2 sentences
  keywords: string[];
  /**
   * Planet-specific modifiers when a given planet is the Atmakaraka in this Swamsha sign.
   * Key: planet ID (0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn).
   * Each modifier adjusts the base sign interpretation for the specific AK planet.
   */
  planetModifiers: Record<number, { en: string; hi: string }>;
}

/**
 * 12 Swamsha profiles indexed by sign ID (1=Aries .. 12=Pisces).
 * Reference: Jaimini Sutras 1.2.19-31, Sanjay Rath's "Jaimini Maharishi's Upadesa Sutras"
 */
export const SWAMSHA_PROFILES: SwamshaProfile[] = [
  {
    signId: 1,
    signName: { en: 'Aries', hi: 'मेष' },
    personality: {
      en: 'The soul is pioneering, courageous, and self-reliant. There is a natural drive to initiate, lead, and conquer new territory. Impatience and combativeness are the shadow side that must be tempered with wisdom.',
      hi: 'आत्मा अग्रणी, साहसी और आत्मनिर्भर है। नई दिशाओं में पहल, नेतृत्व और विजय की स्वाभाविक प्रवृत्ति। अधीरता और आक्रामकता को बुद्धि से संतुलित करना आवश्यक।',
    },
    spiritualPath: {
      en: 'Karma Yoga — the path of selfless action. Spiritual growth comes through fearless service and righteous battle against adharma.',
      hi: 'कर्म योग — निष्काम कर्म का मार्ग। निर्भय सेवा और अधर्म के विरुद्ध धर्मयुद्ध से आध्यात्मिक विकास।',
    },
    career: {
      en: 'Military, surgery, engineering, entrepreneurship, competitive sports, or any field requiring bold initiative.',
      hi: 'सैन्य, शल्य चिकित्सा, इंजीनियरिंग, उद्यमिता, प्रतिस्पर्धी खेल, या साहसिक पहल वाला कोई भी क्षेत्र।',
    },
    keywords: ['leadership', 'courage', 'initiative', 'independence', 'pioneering'],
    planetModifiers: {
      0: { en: 'Sun as AK in Aries Swamsha: the soul craves sovereign authority. Government leadership, political power, or founding institutions come naturally. Ego must be channelled into dharmic governance, not personal aggrandizement.', hi: 'सूर्य AK मेष स्वांश में: आत्मा सर्वोच्च अधिकार चाहती है। शासन नेतृत्व, राजनीतिक शक्ति या संस्थाओं की स्थापना। अहंकार को धार्मिक शासन में लगाना आवश्यक।' },
      1: { en: 'Moon as AK in Aries Swamsha: emotional courage and instinctive leadership. The soul acts from gut feeling and protects fiercely. Military nursing, emergency response, or crisis management suit this placement.', hi: 'चन्द्र AK मेष स्वांश में: भावनात्मक साहस और सहज नेतृत्व। आत्मा प्रवृत्ति से कार्य करती है। सैन्य नर्सिंग, आपातकालीन सेवा उपयुक्त।' },
      2: { en: 'Mars as AK in Aries Swamsha: the warrior soul in its most natural form. Physical courage, combat mastery, and raw initiative define the life. Surgery, martial arts, or firefighting are ideal paths. Temper and impulsiveness are the primary karmic lessons.', hi: 'मंगल AK मेष स्वांश में: योद्धा आत्मा अपने सबसे स्वाभाविक रूप में। शारीरिक साहस और युद्ध कौशल। शल्य चिकित्सा, मार्शल आर्ट। क्रोध पर नियंत्रण कार्मिक सबक।' },
      3: { en: 'Mercury as AK in Aries Swamsha: sharp intellect channelled into competitive strategy. Debate champion, tech startup founder, or sports analyst. The mind is quick but may lack patience for deep study.', hi: 'बुध AK मेष स्वांश में: तीक्ष्ण बुद्धि प्रतिस्पर्धी रणनीति में। वाद-विवाद, टेक स्टार्टअप, या खेल विश्लेषक। मन तेज पर गहन अध्ययन में धैर्य की कमी।' },
      4: { en: 'Jupiter as AK in Aries Swamsha: righteous warrior-sage. The soul fights for dharma through teaching, law, or religious leadership. Crusading judge, military chaplain, or reform-minded guru.', hi: 'बृहस्पति AK मेष स्वांश में: धर्मी योद्धा-ऋषि। शिक्षण, कानून या धार्मिक नेतृत्व से धर्म के लिए संघर्ष। सुधारवादी गुरु।' },
      5: { en: 'Venus as AK in Aries Swamsha: passionate pursuit of beauty and pleasure. Fashion entrepreneur, bold artist, or luxury brand creator. Romantic intensity is high, but relationships may be stormy.', hi: 'शुक्र AK मेष स्वांश में: सौंदर्य और आनंद की उत्कट खोज। फैशन उद्यमी, साहसी कलाकार। रोमांटिक तीव्रता उच्च, पर संबंध तूफानी।' },
      6: { en: 'Saturn as AK in Aries Swamsha: disciplined ambition with slow, steady ascent. The soul learns patience through repeated setbacks in leadership. Construction, mining, or industrial engineering. Authority comes late but is enduring.', hi: 'शनि AK मेष स्वांश में: अनुशासित महत्वाकांक्षा, धीमी चढ़ाई। नेतृत्व में बार-बार बाधाओं से धैर्य सीखना। निर्माण, खनन। अधिकार देर से पर स्थायी।' },
    },
  },
  {
    signId: 2,
    signName: { en: 'Taurus', hi: 'वृष' },
    personality: {
      en: 'The soul seeks stability, beauty, and material security. There is a strong affinity for land, art, music, and accumulated wealth. Patient and persistent, this soul builds lasting value over time.',
      hi: 'आत्मा स्थिरता, सौंदर्य और भौतिक सुरक्षा चाहती है। भूमि, कला, संगीत और संचित धन के प्रति गहरा आकर्षण। धैर्यवान और दृढ़, यह आत्मा समय के साथ स्थायी मूल्य बनाती है।',
    },
    spiritualPath: {
      en: 'Bhakti through beauty and devotion. The divine is experienced through sacred music, temple arts, and sensory refinement.',
      hi: 'सौंदर्य और भक्ति के माध्यम से भक्ति योग। पवित्र संगीत, मंदिर कला और इंद्रिय परिष्कार से दिव्यता का अनुभव।',
    },
    career: {
      en: 'Finance, agriculture, real estate, luxury goods, music, culinary arts, or banking.',
      hi: 'वित्त, कृषि, अचल संपत्ति, विलासिता, संगीत, पाक कला, या बैंकिंग।',
    },
    keywords: ['stability', 'wealth', 'beauty', 'patience', 'material security'],
    planetModifiers: {
      0: { en: 'Sun as AK in Taurus Swamsha: the soul seeks authority through wealth and material empire. Government treasury, central banking, or land administration. Dignity is tied to financial standing.', hi: 'सूर्य AK वृष स्वांश में: धन और भौतिक साम्राज्य से अधिकार। सरकारी खजाना, केंद्रीय बैंकिंग। गरिमा वित्तीय स्थिति से जुड़ी।' },
      1: { en: 'Moon as AK in Taurus Swamsha: deep emotional attachment to comfort and beauty. Exceptional artistic sensibility, especially in music and food. The soul finds peace through sensory pleasures and domestic harmony.', hi: 'चन्द्र AK वृष स्वांश में: सुख-सुविधा और सौंदर्य से गहरा भावनात्मक लगाव। संगीत और भोजन में असाधारण कलात्मक संवेदनशीलता। घरेलू सामंजस्य से शांति।' },
      2: { en: 'Mars as AK in Taurus Swamsha: aggressive accumulation of wealth and property. Real estate developer, agricultural entrepreneur, or land-based military operations. Stubbornness is amplified.', hi: 'मंगल AK वृष स्वांश में: धन और संपत्ति का आक्रामक संचय। रियल एस्टेट, कृषि उद्यम। हठ बढ़ा हुआ।' },
      3: { en: 'Mercury as AK in Taurus Swamsha: commercial intelligence applied to luxury and trade. Gemstone dealer, financial analyst, or commodity trader. Writing about wealth, food, or aesthetics.', hi: 'बुध AK वृष स्वांश में: विलासिता और व्यापार में वाणिज्यिक बुद्धि। रत्न व्यापारी, वित्तीय विश्लेषक। धन या सौंदर्यशास्त्र पर लेखन।' },
      4: { en: 'Jupiter as AK in Taurus Swamsha: wealth through wisdom and teaching. Banking with ethical principles, temple treasury management, or philanthropy. Generous and acquisitive in equal measure.', hi: 'बृहस्पति AK वृष स्वांश में: ज्ञान और शिक्षण से धन। नैतिक सिद्धांतों से बैंकिंग, मंदिर कोष प्रबंधन। उदार और संग्रहशील।' },
      5: { en: 'Venus as AK in Taurus Swamsha: the supreme aesthete. Mastery in music, fine dining, luxury fashion, or perfumery. Venus in its own sign gives extraordinary artistic talent and sensual refinement.', hi: 'शुक्र AK वृष स्वांश में: सर्वोच्च सौंदर्यज्ञ। संगीत, ललित भोजन, विलासिता फैशन में निपुणता। अपनी राशि में शुक्र असाधारण कलात्मक प्रतिभा देता है।' },
      6: { en: 'Saturn as AK in Taurus Swamsha: wealth earned through long, hard labour. Agriculture, mining, or construction over decades. Financial security comes late but is rock-solid. Attachment to possessions is the karmic lesson.', hi: 'शनि AK वृष स्वांश में: लंबे कठोर परिश्रम से अर्जित धन। दशकों में कृषि, खनन या निर्माण। वित्तीय सुरक्षा देर से पर अटल। संपत्ति से मोह कार्मिक सबक।' },
    },
  },
  {
    signId: 3,
    signName: { en: 'Gemini', hi: 'मिथुन' },
    personality: {
      en: 'The soul is intellectually versatile, curious, and communicative. Multiple simultaneous interests and projects are the norm. Adaptability is the greatest strength, but scattered focus is the challenge.',
      hi: 'आत्मा बौद्धिक रूप से बहुमुखी, जिज्ञासु और संवादशील है। एक साथ कई रुचियां और परियोजनाएं सामान्य हैं। अनुकूलनशीलता सबसे बड़ी ताकत, किन्तु बिखरा ध्यान चुनौती।',
    },
    spiritualPath: {
      en: 'Jnana Yoga — the path of knowledge. Scriptural study, philosophical debate, and intellectual discrimination lead to liberation.',
      hi: 'ज्ञान योग — ज्ञान का मार्ग। शास्त्र अध्ययन, दार्शनिक वाद-विवाद और बौद्धिक विवेक से मुक्ति।',
    },
    career: {
      en: 'Writing, journalism, teaching, commerce, translation, media, or information technology.',
      hi: 'लेखन, पत्रकारिता, शिक्षण, वाणिज्य, अनुवाद, मीडिया, या सूचना प्रौद्योगिकी।',
    },
    keywords: ['intellect', 'communication', 'versatility', 'curiosity', 'duality'],
    planetModifiers: {
      0: { en: 'Sun as AK in Gemini Swamsha: authority through communication and intellectual leadership. Government spokesperson, media mogul, or academic administrator. The soul commands through words rather than force.', hi: 'सूर्य AK मिथुन स्वांश में: संवाद और बौद्धिक नेतृत्व से अधिकार। सरकारी प्रवक्ता, मीडिया मुगल। आत्मा बल की बजाय शब्दों से आदेश देती है।' },
      1: { en: 'Moon as AK in Gemini Swamsha: emotionally expressive communicator. Poetry, songwriting, counselling through conversation. The mind is restless and needs multiple emotional outlets.', hi: 'चन्द्र AK मिथुन स्वांश में: भावनात्मक रूप से अभिव्यक्त संवादक। कविता, गीत लेखन, बातचीत से परामर्श। मन चंचल, कई भावनात्मक माध्यम चाहिए।' },
      2: { en: 'Mars as AK in Gemini Swamsha: aggressive debater and sharp-tongued strategist. Technical writing, sports journalism, or military communications. Words are used as weapons.', hi: 'मंगल AK मिथुन स्वांश में: आक्रामक वाद-विवादी और तीक्ष्ण-भाषी रणनीतिकार। तकनीकी लेखन, खेल पत्रकारिता। शब्दों को हथियार के रूप में प्रयोग।' },
      3: { en: 'Mercury as AK in Gemini Swamsha: the quintessential communicator. Mercury in its own sign gives genius-level linguistic ability. Polyglot, coder, mathematician, or master trader. The mind never stops.', hi: 'बुध AK मिथुन स्वांश में: सर्वोत्कृष्ट संवादक। अपनी राशि में बुध प्रतिभाशाली भाषा क्षमता देता है। बहुभाषाविद, कोडर, गणितज्ञ। मन कभी नहीं रुकता।' },
      4: { en: 'Jupiter as AK in Gemini Swamsha: wisdom expressed through teaching and writing. University professor, dharma author, or scriptural commentator. Breadth of knowledge may sacrifice depth.', hi: 'बृहस्पति AK मिथुन स्वांश में: शिक्षण और लेखन से व्यक्त ज्ञान। विश्वविद्यालय प्रोफेसर, धर्म लेखक। ज्ञान की व्यापकता गहराई की बलि दे सकती है।' },
      5: { en: 'Venus as AK in Gemini Swamsha: artistic communication and elegant expression. Fashion writer, music critic, advertising creative, or film dialogue writer. Charm and wit define social interactions.', hi: 'शुक्र AK मिथुन स्वांश में: कलात्मक संवाद और सुरुचिपूर्ण अभिव्यक्ति। फैशन लेखक, संगीत समीक्षक, विज्ञापन। आकर्षण और बुद्धिमत्ता।' },
      6: { en: 'Saturn as AK in Gemini Swamsha: methodical, slow communication with lasting impact. Technical manual writer, archivist, or linguistic researcher. Speech may be delayed in childhood but becomes authoritative.', hi: 'शनि AK मिथुन स्वांश में: व्यवस्थित, धीमा संवाद पर स्थायी प्रभाव। तकनीकी मैनुअल लेखक, अभिलेखागार। बचपन में वाणी में देरी पर बाद में प्रामाणिक।' },
    },
  },
  {
    signId: 4,
    signName: { en: 'Cancer', hi: 'कर्क' },
    personality: {
      en: 'The soul is nurturing, emotionally deep, and protective. There is a strong connection to mother, homeland, and the collective emotional wellbeing. The instinct to shelter and feed others defines this soul.',
      hi: 'आत्मा पोषणकारी, भावनात्मक रूप से गहरी और रक्षात्मक है। माता, मातृभूमि और सामूहिक भावनात्मक कल्याण से गहरा जुड़ाव। दूसरों को आश्रय और भोजन देने की वृत्ति।',
    },
    spiritualPath: {
      en: 'Bhakti Yoga through devotion to the Divine Mother. Pilgrimage to sacred water bodies and service to the needy.',
      hi: 'दिव्य माता की भक्ति के माध्यम से भक्ति योग। पवित्र जल स्थलों की तीर्थयात्रा और जरूरतमंदों की सेवा।',
    },
    career: {
      en: 'Healthcare, hospitality, real estate, food industry, social work, or public service.',
      hi: 'स्वास्थ्य सेवा, आतिथ्य, अचल संपत्ति, खाद्य उद्योग, समाज सेवा, या लोक सेवा।',
    },
    keywords: ['nurturing', 'emotional depth', 'protection', 'homeland', 'mothering'],
    planetModifiers: {
      0: { en: 'Sun as AK in Cancer Swamsha: authority expressed through patriotic service and homeland protection. Government housing, national security, or cultural preservation. The father figure looms large in the soul narrative.', hi: 'सूर्य AK कर्क स्वांश में: देशभक्ति सेवा और मातृभूमि रक्षा से अधिकार। सरकारी आवास, राष्ट्रीय सुरक्षा। पिता की छवि आत्मा कथा में बड़ी।' },
      1: { en: 'Moon as AK in Cancer Swamsha: the most nurturing possible placement. Moon in its own sign gives extraordinary emotional intelligence, psychic sensitivity, and maternal instinct. Healthcare, counselling, or feeding the masses.', hi: 'चन्द्र AK कर्क स्वांश में: सबसे पोषणकारी स्थिति। अपनी राशि में चन्द्र असाधारण भावनात्मक बुद्धि, मानसिक संवेदनशीलता देता है। स्वास्थ्य सेवा, परामर्श।' },
      2: { en: 'Mars as AK in Cancer Swamsha: protective warrior energy in a nurturing sign. Military defence of homeland, coastguard, real estate developer with aggressive tactics. Emotional volatility needs management.', hi: 'मंगल AK कर्क स्वांश में: पोषण राशि में रक्षात्मक योद्धा ऊर्जा। मातृभूमि की सैन्य रक्षा, तटरक्षक। भावनात्मक अस्थिरता का प्रबंधन आवश्यक।' },
      3: { en: 'Mercury as AK in Cancer Swamsha: emotional intelligence combined with analytical skill. Child psychologist, family counsellor, food science, or writing about home and family themes.', hi: 'बुध AK कर्क स्वांश में: विश्लेषणात्मक कौशल के साथ भावनात्मक बुद्धि। बाल मनोवैज्ञानिक, पारिवारिक परामर्शदाता, खाद्य विज्ञान।' },
      4: { en: 'Jupiter as AK in Cancer Swamsha: Jupiter is exalted here — the highest spiritual placement. Guru, temple priest, dharma teacher, or philanthropist. Wisdom flows through compassion and generosity. Exceptional for spiritual attainment.', hi: 'बृहस्पति AK कर्क स्वांश में: बृहस्पति यहां उच्च — सर्वोच्च आध्यात्मिक स्थिति। गुरु, मंदिर पुजारी, धर्म शिक्षक। करुणा और उदारता से ज्ञान प्रवाहित। आध्यात्मिक प्राप्ति के लिए उत्कृष्ट।' },
      5: { en: 'Venus as AK in Cancer Swamsha: love of home beauty and domestic arts. Interior design, hospitality, catering, or wedding planning. Deep attachment to romantic partnerships and family comfort.', hi: 'शुक्र AK कर्क स्वांश में: गृह सौंदर्य और घरेलू कलाओं से प्रेम। इंटीरियर डिज़ाइन, आतिथ्य, विवाह नियोजन। रोमांटिक साझेदारी से गहरा लगाव।' },
      6: { en: 'Saturn as AK in Cancer Swamsha: karmic duty to family and homeland that feels burdensome. Elderly care, housing for the poor, or social welfare administration. Emotional detachment is the spiritual lesson.', hi: 'शनि AK कर्क स्वांश में: परिवार और मातृभूमि के प्रति कार्मिक कर्तव्य जो बोझिल लगता है। वृद्ध देखभाल, गरीबों के लिए आवास। भावनात्मक वैराग्य आध्यात्मिक सबक।' },
    },
  },
  {
    signId: 5,
    signName: { en: 'Leo', hi: 'सिंह' },
    personality: {
      en: 'The soul carries a regal quality with natural authority and creative power. The desire to lead, inspire, and be recognized drives all action. Dignity and honor are non-negotiable values.',
      hi: 'आत्मा में राजकीय गुण, स्वाभाविक अधिकार और सृजनात्मक शक्ति है। नेतृत्व, प्रेरणा और मान्यता की इच्छा सभी कर्मों को प्रेरित करती है। गरिमा और सम्मान अटल मूल्य।',
    },
    spiritualPath: {
      en: 'Raja Yoga — the royal path of meditation and self-mastery. The ego must be surrendered to the Atman.',
      hi: 'राज योग — ध्यान और आत्म-निपुणता का राजमार्ग। अहंकार को आत्मन् के समक्ष समर्पित करना आवश्यक।',
    },
    career: {
      en: 'Politics, performing arts, administration, government, entertainment, or executive leadership.',
      hi: 'राजनीति, प्रदर्शन कला, प्रशासन, सरकार, मनोरंजन, या कार्यकारी नेतृत्व।',
    },
    keywords: ['royalty', 'authority', 'creativity', 'leadership', 'dignity'],
    planetModifiers: {
      0: { en: 'Sun as AK in Leo Swamsha: Sun in its own sign — maximum royal energy. Born to rule, administer, and inspire. Head of state, CEO, or institutional founder. The ego is powerful and must be consciously surrendered.', hi: 'सूर्य AK सिंह स्वांश में: सूर्य अपनी राशि में — अधिकतम राजकीय ऊर्जा। शासन, प्रशासन और प्रेरणा के लिए जन्मा। राज्यप्रमुख, CEO। अहंकार शक्तिशाली, सचेत समर्पण आवश्यक।' },
      1: { en: 'Moon as AK in Leo Swamsha: emotional need for recognition and creative self-expression. Actor, performer, or public figure who connects with masses through charisma. Mood swings can undermine authority.', hi: 'चन्द्र AK सिंह स्वांश में: मान्यता और सृजनात्मक आत्म-अभिव्यक्ति की भावनात्मक आवश्यकता। अभिनेता, कलाकार। करिश्मे से जनता से जुड़ाव। मूड स्विंग अधिकार को कमजोर कर सकते हैं।' },
      2: { en: 'Mars as AK in Leo Swamsha: commanding warrior-king energy. Military general, sports champion, or political leader who leads from the front. Courage is theatrical and inspiring to followers.', hi: 'मंगल AK सिंह स्वांश में: आदेश देने वाली योद्धा-राजा ऊर्जा। सैन्य जनरल, खेल चैम्पियन। साहस नाटकीय और अनुयायियों के लिए प्रेरक।' },
      3: { en: 'Mercury as AK in Leo Swamsha: intellectual showmanship. Brilliant public speaker, theatre writer, or royal court adviser. Intelligence is used for display and influence rather than quiet scholarship.', hi: 'बुध AK सिंह स्वांश में: बौद्धिक प्रदर्शन कौशल। शानदार सार्वजनिक वक्ता, नाट्य लेखक। बुद्धि शांत विद्वत्ता की बजाय प्रदर्शन और प्रभाव के लिए।' },
      4: { en: 'Jupiter as AK in Leo Swamsha: the dharmic king — wisdom combined with royal authority. High court judge, university chancellor, or religious institution head. Generosity is naturally regal.', hi: 'बृहस्पति AK सिंह स्वांश में: धर्मी राजा — ज्ञान और राजकीय अधिकार का संयोग। उच्च न्यायालय न्यायाधीश, विश्वविद्यालय कुलपति। उदारता स्वाभाविक रूप से राजसी।' },
      5: { en: 'Venus as AK in Leo Swamsha: creative luxury and artistic leadership. Film director, fashion house founder, or patron of the arts. Romance is dramatic and passionate, with high standards in partnership.', hi: 'शुक्र AK सिंह स्वांश में: सृजनात्मक विलासिता और कलात्मक नेतृत्व। फिल्म निर्देशक, फैशन हाउस संस्थापक। रोमांस नाटकीय और उत्कट।' },
      6: { en: 'Saturn as AK in Leo Swamsha: authority earned through long struggle and denial. The soul faces repeated humiliation before achieving lasting recognition. Government service, administration in harsh conditions.', hi: 'शनि AK सिंह स्वांश में: लंबे संघर्ष से अर्जित अधिकार। स्थायी मान्यता से पहले बार-बार अपमान। कठिन परिस्थितियों में सरकारी सेवा, प्रशासन।' },
    },
  },
  {
    signId: 6,
    signName: { en: 'Virgo', hi: 'कन्या' },
    personality: {
      en: 'The soul finds purpose through precision, service, and healing. Analytical, methodical, and detail-oriented, this soul perfects whatever it touches. Self-criticism can become excessive.',
      hi: 'आत्मा सटीकता, सेवा और उपचार में उद्देश्य पाती है। विश्लेषणात्मक, व्यवस्थित और विस्तार-उन्मुख, यह आत्मा जो भी छूती है उसे पूर्ण करती है। आत्म-आलोचना अत्यधिक हो सकती है।',
    },
    spiritualPath: {
      en: 'Seva Yoga — the path of selfless service. Purification through discipline, fasting, and meticulous ritual observance.',
      hi: 'सेवा योग — निस्वार्थ सेवा का मार्ग। अनुशासन, उपवास और सूक्ष्म अनुष्ठान पालन से शुद्धि।',
    },
    career: {
      en: 'Medicine, healing arts, editing, accounting, research, quality control, or environmental science.',
      hi: 'चिकित्सा, उपचार कला, संपादन, लेखांकन, अनुसंधान, गुणवत्ता नियंत्रण, या पर्यावरण विज्ञान।',
    },
    keywords: ['precision', 'service', 'healing', 'analysis', 'perfection'],
    planetModifiers: {
      0: { en: 'Sun as AK in Virgo Swamsha: authority through expertise and meticulous competence. Health administrator, quality standards chief, or audit authority. Leadership is earned through demonstrated mastery, not charisma.', hi: 'सूर्य AK कन्या स्वांश में: विशेषज्ञता और सूक्ष्म योग्यता से अधिकार। स्वास्थ्य प्रशासक, गुणवत्ता मानक प्रमुख। नेतृत्व करिश्मे से नहीं, प्रदर्शित निपुणता से।' },
      1: { en: 'Moon as AK in Virgo Swamsha: emotional fulfilment through service and healing. Nurse, dietician, or therapist who combines caring instinct with clinical precision. Worry and anxiety are the shadow qualities.', hi: 'चन्द्र AK कन्या स्वांश में: सेवा और उपचार से भावनात्मक पूर्णता। नर्स, आहार विशेषज्ञ, या चिकित्सक। चिंता और व्यग्रता छाया गुण।' },
      2: { en: 'Mars as AK in Virgo Swamsha: surgical precision and technical mastery. Microsurgery, forensic analysis, or precision engineering. Energy is channelled into perfecting skills rather than brute force.', hi: 'मंगल AK कन्या स्वांश में: शल्य सटीकता और तकनीकी निपुणता। माइक्रोसर्जरी, फोरेंसिक विश्लेषण। ऊर्जा कौशल परिष्कार में, बल में नहीं।' },
      3: { en: 'Mercury as AK in Virgo Swamsha: Mercury exalted — supreme analytical intelligence. Mathematician, accountant, editor, data scientist, or pharmacist. The mind classifies, categorizes, and perfects with unmatched precision.', hi: 'बुध AK कन्या स्वांश में: बुध उच्च — सर्वोच्च विश्लेषणात्मक बुद्धि। गणितज्ञ, लेखाकार, संपादक, डेटा वैज्ञानिक। मन अद्वितीय सटीकता से वर्गीकृत करता है।' },
      4: { en: 'Jupiter as AK in Virgo Swamsha: wisdom applied to practical service. Ayurvedic physician, agricultural scientist, or research professor. Teaching is methodical and evidence-based rather than philosophical.', hi: 'बृहस्पति AK कन्या स्वांश में: व्यावहारिक सेवा में लागू ज्ञान। आयुर्वेदिक चिकित्सक, कृषि वैज्ञानिक। शिक्षण व्यवस्थित और प्रमाण-आधारित।' },
      5: { en: 'Venus as AK in Virgo Swamsha: Venus is debilitated — artistic talent exists but meets constant self-criticism. Craft artisan, technical designer, or beauty therapist. Relationships suffer from over-analysis.', hi: 'शुक्र AK कन्या स्वांश में: शुक्र नीच — कलात्मक प्रतिभा है पर निरंतर आत्म-आलोचना। शिल्प कारीगर, तकनीकी डिज़ाइनर। संबंधों में अति-विश्लेषण।' },
      6: { en: 'Saturn as AK in Virgo Swamsha: lifelong dedication to unglamorous but essential service. Sanitation, public health infrastructure, or agricultural labour management. Humility through tedious work is the soul lesson.', hi: 'शनि AK कन्या स्वांश में: अनाकर्षक पर आवश्यक सेवा के प्रति आजीवन समर्पण। स्वच्छता, सार्वजनिक स्वास्थ्य अवसंरचना। कठिन कार्य से विनम्रता सबक।' },
    },
  },
  {
    signId: 7,
    signName: { en: 'Libra', hi: 'तुला' },
    personality: {
      en: 'The soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Fairness and aesthetic harmony are the guiding principles of all decisions.',
      hi: 'आत्मा संतुलन, न्याय और सौंदर्य की ओर उन्मुख है। कूटनीतिक, कलात्मक और संबंध-केंद्रित। निष्पक्षता और सौंदर्य सामंजस्य सभी निर्णयों के मार्गदर्शक सिद्धांत।',
    },
    spiritualPath: {
      en: 'The path of dharmic partnership — spiritual growth through sacred relationship, marriage, and harmonizing opposites.',
      hi: 'धार्मिक साझेदारी का मार्ग — पवित्र संबंध, विवाह और विपरीतताओं में सामंजस्य से आध्यात्मिक विकास।',
    },
    career: {
      en: 'Law, diplomacy, design, fashion, mediation, counseling, or fine arts.',
      hi: 'कानून, कूटनीति, डिजाइन, फैशन, मध्यस्थता, परामर्श, या ललित कला।',
    },
    keywords: ['balance', 'justice', 'beauty', 'diplomacy', 'partnership'],
    planetModifiers: {
      0: { en: 'Sun as AK in Libra Swamsha: Sun is debilitated — authority is tested through partnerships and compromises. The soul must learn to share power. Diplomat, mediator, or judge who balances competing interests.', hi: 'सूर्य AK तुला स्वांश में: सूर्य नीच — साझेदारी और समझौतों से अधिकार परीक्षित। आत्मा को सत्ता साझा करना सीखना होगा। कूटनीतिज्ञ, मध्यस्थ, न्यायाधीश।' },
      1: { en: 'Moon as AK in Libra Swamsha: emotional need for partnership harmony. Marriage counsellor, relationship therapist, or social hostess. The soul feels incomplete without a partner and must learn inner balance.', hi: 'चन्द्र AK तुला स्वांश में: साझेदारी सामंजस्य की भावनात्मक आवश्यकता। विवाह परामर्शदाता, संबंध चिकित्सक। साथी के बिना अधूरा अनुभव।' },
      2: { en: 'Mars as AK in Libra Swamsha: aggressive pursuit of justice. Litigator, labour union leader, or activist for equality. Combative energy is channelled into fighting for fairness rather than personal gain.', hi: 'मंगल AK तुला स्वांश में: न्याय की आक्रामक खोज। मुकदमेबाज, श्रम संघ नेता, समानता कार्यकर्ता। लड़ाई निष्पक्षता के लिए, व्यक्तिगत लाभ नहीं।' },
      3: { en: 'Mercury as AK in Libra Swamsha: intellectual elegance and diplomatic communication. Contract law, trade negotiations, or design consultancy. The mind seeks balanced, beautiful solutions.', hi: 'बुध AK तुला स्वांश में: बौद्धिक सुरुचि और कूटनीतिक संवाद। अनुबंध कानून, व्यापार वार्ता, डिज़ाइन परामर्श। मन संतुलित, सुंदर समाधान चाहता है।' },
      4: { en: 'Jupiter as AK in Libra Swamsha: dharmic justice and ethical partnerships. High court judge, marriage priest, or ethics professor. Wisdom is expressed through fair dealing and counselling couples.', hi: 'बृहस्पति AK तुला स्वांश में: धार्मिक न्याय और नैतिक साझेदारी। उच्च न्यायालय न्यायाधीश, विवाह पुरोहित, नैतिकता प्रोफेसर। निष्पक्ष व्यवहार से ज्ञान।' },
      5: { en: 'Venus as AK in Libra Swamsha: Venus in its moolatrikona — supreme artistic and romantic expression. Fashion designer, musician, or luxury brand ambassador. Partnership is the central life theme; beauty is a spiritual practice.', hi: 'शुक्र AK तुला स्वांश में: शुक्र मूलत्रिकोण में — सर्वोच्च कलात्मक और रोमांटिक अभिव्यक्ति। फैशन डिज़ाइनर, संगीतकार। साझेदारी केंद्रीय जीवन विषय।' },
      6: { en: 'Saturn as AK in Libra Swamsha: Saturn is exalted — karmic maturity in relationships and justice. Senior judge, constitutional authority, or labour rights champion. Fairness is enforced with iron discipline.', hi: 'शनि AK तुला स्वांश में: शनि उच्च — संबंधों और न्याय में कार्मिक परिपक्वता। वरिष्ठ न्यायाधीश, संवैधानिक प्राधिकरण। लौह अनुशासन से निष्पक्षता।' },
    },
  },
  {
    signId: 8,
    signName: { en: 'Scorpio', hi: 'वृश्चिक' },
    personality: {
      en: 'The soul seeks transformation through depth and hidden knowledge. Intensely perceptive, secretive, and drawn to the mysteries of life and death. The capacity for complete regeneration is the greatest gift.',
      hi: 'आत्मा गहराई और छिपे ज्ञान से परिवर्तन चाहती है। अत्यंत सूक्ष्मदर्शी, गोपनीय, जीवन-मृत्यु के रहस्यों की ओर आकर्षित। पूर्ण पुनर्जन्म की क्षमता सबसे बड़ा वरदान।',
    },
    spiritualPath: {
      en: 'Tantra and Kundalini Yoga — transformation through confronting the shadow. Mantra sadhana and occult disciplines.',
      hi: 'तंत्र और कुंडलिनी योग — छाया का सामना करके परिवर्तन। मंत्र साधना और गुप्त अनुशासन।',
    },
    career: {
      en: 'Research, psychology, detective work, surgery, occult sciences, insurance, or intelligence.',
      hi: 'अनुसंधान, मनोविज्ञान, जासूसी, शल्य चिकित्सा, गुप्त विज्ञान, बीमा, या गुप्तचर।',
    },
    keywords: ['transformation', 'depth', 'mystery', 'regeneration', 'occult'],
    planetModifiers: {
      0: { en: 'Sun as AK in Scorpio Swamsha: authority through hidden power and investigation. Intelligence agency head, secret service, or institutional transformation leader. Power is wielded behind the scenes.', hi: 'सूर्य AK वृश्चिक स्वांश में: छिपी शक्ति और जांच से अधिकार। खुफिया एजेंसी प्रमुख, गुप्त सेवा। शक्ति पर्दे के पीछे से।' },
      1: { en: 'Moon as AK in Scorpio Swamsha: Moon is debilitated — intense emotional depth with transformative suffering. Psychotherapist, grief counsellor, or hospice worker. Emotional crises become gateways to spiritual evolution.', hi: 'चन्द्र AK वृश्चिक स्वांश में: चन्द्र नीच — परिवर्तनकारी पीड़ा के साथ गहन भावनात्मक गहराई। मनोचिकित्सक, शोक परामर्शदाता। भावनात्मक संकट आध्यात्मिक विकास के द्वार।' },
      2: { en: 'Mars as AK in Scorpio Swamsha: Mars in its own sign — the supreme investigator and transformer. Surgeon, detective, crisis manager, or research scientist. Fearless confrontation of danger and hidden truths.', hi: 'मंगल AK वृश्चिक स्वांश में: मंगल अपनी राशि में — सर्वोच्च अन्वेषक और परिवर्तक। शल्य चिकित्सक, जासूस, संकट प्रबंधक। खतरे का निर्भय सामना।' },
      3: { en: 'Mercury as AK in Scorpio Swamsha: penetrating analytical mind applied to hidden subjects. Cryptographer, forensic accountant, or occult researcher. Communication is strategic and calculating.', hi: 'बुध AK वृश्चिक स्वांश में: छिपे विषयों में भेदक विश्लेषणात्मक मन। कूटलेखक, फोरेंसिक लेखाकार, गुप्त शोधकर्ता। संवाद रणनीतिक।' },
      4: { en: 'Jupiter as AK in Scorpio Swamsha: wisdom of the occult and mystical traditions. Tantric guru, depth psychologist, or researcher of ancient mysteries. Teaching transforms students at the deepest level.', hi: 'बृहस्पति AK वृश्चिक स्वांश में: गुप्त और रहस्यमय परंपराओं का ज्ञान। तांत्रिक गुरु, गहन मनोवैज्ञानिक। शिक्षण छात्रों को गहनतम स्तर पर बदलता है।' },
      5: { en: 'Venus as AK in Scorpio Swamsha: intense, transformative romantic experiences. Passionate art that explores dark themes — film noir, gothic art, or erotic literature. Beauty is found in the shadows.', hi: 'शुक्र AK वृश्चिक स्वांश में: गहन, परिवर्तनकारी रोमांटिक अनुभव। अंधेरे विषयों की उत्कट कला — फिल्म नोआर, गॉथिक कला। सौंदर्य छाया में।' },
      6: { en: 'Saturn as AK in Scorpio Swamsha: karmic debt related to power and secrets. Long, painful transformation through suffering and endurance. Mining, waste management, or end-of-life services. Spiritual liberation through confronting mortality.', hi: 'शनि AK वृश्चिक स्वांश में: शक्ति और रहस्यों से संबंधित कार्मिक ऋण। पीड़ा और सहनशीलता से लंबा परिवर्तन। खनन, अंत्येष्टि सेवा। मृत्यु के सामना से आध्यात्मिक मुक्ति।' },
    },
  },
  {
    signId: 9,
    signName: { en: 'Sagittarius', hi: 'धनु' },
    personality: {
      en: 'The soul is oriented toward truth, philosophy, and higher education. Optimistic, expansive, and drawn to foreign cultures and long-distance travel. Teaching and preaching come naturally.',
      hi: 'आत्मा सत्य, दर्शन और उच्च शिक्षा की ओर उन्मुख है। आशावादी, विस्तारवादी, विदेशी संस्कृतियों और दूरस्थ यात्रा की ओर आकर्षित। शिक्षण और प्रवचन स्वाभाविक।',
    },
    spiritualPath: {
      en: 'Guru Bhakti — devotion to a spiritual teacher. Pilgrimage, scriptural study, and dharma propagation are the soul-level purpose.',
      hi: 'गुरु भक्ति — आध्यात्मिक गुरु के प्रति समर्पण। तीर्थयात्रा, शास्त्र अध्ययन और धर्म प्रचार आत्मा का उद्देश्य।',
    },
    career: {
      en: 'Teaching, law, philosophy, publishing, religion, international affairs, or higher education.',
      hi: 'शिक्षण, कानून, दर्शन, प्रकाशन, धर्म, अंतर्राष्ट्रीय मामले, या उच्च शिक्षा।',
    },
    keywords: ['truth', 'philosophy', 'expansion', 'teaching', 'dharma'],
    planetModifiers: {
      0: { en: 'Sun as AK in Sagittarius Swamsha: royal philosopher-king. Authority expressed through moral vision and dharmic governance. University chancellor, religious leader, or diplomat representing national values.', hi: 'सूर्य AK धनु स्वांश में: राजसी दार्शनिक-राजा। नैतिक दृष्टि और धार्मिक शासन से अधिकार। विश्वविद्यालय कुलपति, धार्मिक नेता।' },
      1: { en: 'Moon as AK in Sagittarius Swamsha: emotional fulfilment through faith and exploration. Pilgrimage guide, spiritual counsellor, or travel writer. The soul needs philosophical meaning in every experience.', hi: 'चन्द्र AK धनु स्वांश में: विश्वास और अन्वेषण से भावनात्मक पूर्णता। तीर्थ मार्गदर्शक, आध्यात्मिक परामर्शदाता। हर अनुभव में दार्शनिक अर्थ चाहिए।' },
      2: { en: 'Mars as AK in Sagittarius Swamsha: crusading warrior for truth and justice. Military attached to a righteous cause, sports coach, or dharma defender who acts decisively. Adventure and risk-taking are spiritual practices.', hi: 'मंगल AK धनु स्वांश में: सत्य और न्याय का धर्मयोद्धा। धार्मिक कार्य से जुड़ा सैन्य, खेल प्रशिक्षक। साहसिक कार्य आध्यात्मिक अभ्यास।' },
      3: { en: 'Mercury as AK in Sagittarius Swamsha: philosophical writer and teacher. Publishing house founder, scriptural translator, or comparative religion scholar. Breadth of learning across cultures and languages.', hi: 'बुध AK धनु स्वांश में: दार्शनिक लेखक और शिक्षक। प्रकाशन गृह संस्थापक, शास्त्र अनुवादक, तुलनात्मक धर्म विद्वान। संस्कृतियों में व्यापक शिक्षा।' },
      4: { en: 'Jupiter as AK in Sagittarius Swamsha: Jupiter in its own sign — the born guru and dharma teacher. Pontiff, ashram founder, or supreme court philosopher. Teaching and spiritual guidance are the soul\'s primary purpose.', hi: 'बृहस्पति AK धनु स्वांश में: बृहस्पति अपनी राशि में — जन्मजात गुरु और धर्म शिक्षक। आश्रम संस्थापक, सर्वोच्च दार्शनिक। शिक्षण आत्मा का प्राथमिक उद्देश्य।' },
      5: { en: 'Venus as AK in Sagittarius Swamsha: love of foreign cultures and philosophical art. International artist, cross-cultural relationship, or sacred music composer. Beauty is experienced through travel and higher learning.', hi: 'शुक्र AK धनु स्वांश में: विदेशी संस्कृतियों और दार्शनिक कला का प्रेम। अंतर्राष्ट्रीय कलाकार, पवित्र संगीत रचनाकार। यात्रा और उच्च शिक्षा से सौंदर्य अनुभव।' },
      6: { en: 'Saturn as AK in Sagittarius Swamsha: slow, methodical seeker of truth through hardship. Academic career with delayed recognition, or religious service in austere conditions. Pilgrimage is arduous but profoundly transformative.', hi: 'शनि AK धनु स्वांश में: कठिनाई से सत्य का धीमा, व्यवस्थित अन्वेषक। विलंबित मान्यता वाला शैक्षणिक करियर। तीर्थयात्रा कठिन पर गहन परिवर्तनकारी।' },
    },
  },
  {
    signId: 10,
    signName: { en: 'Capricorn', hi: 'मकर' },
    personality: {
      en: 'The soul builds slowly and surely with ambition, patience, and discipline. Destined for a late-career peak, this soul earns authority through sustained effort rather than inherited privilege.',
      hi: 'आत्मा महत्वाकांक्षा, धैर्य और अनुशासन से धीरे-धीरे निर्माण करती है। देर से करियर चरम के लिए नियत, यह आत्मा विरासती विशेषाधिकार की बजाय निरंतर प्रयास से अधिकार अर्जित करती है।',
    },
    spiritualPath: {
      en: 'Tapas — austerity and self-discipline as spiritual practice. The path of renunciation, structured meditation, and karma purification.',
      hi: 'तपस — तपस्या और आत्म-अनुशासन आध्यात्मिक साधना के रूप में। त्याग, व्यवस्थित ध्यान और कर्म शुद्धि का मार्ग।',
    },
    career: {
      en: 'Administration, engineering, corporate leadership, government, mining, or architecture.',
      hi: 'प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व, सरकार, खनन, या वास्तुकला।',
    },
    keywords: ['ambition', 'discipline', 'patience', 'authority', 'structure'],
    planetModifiers: {
      0: { en: 'Sun as AK in Capricorn Swamsha: authority through institutional power and bureaucratic mastery. Government secretary, corporate CEO after decades of service, or infrastructure builder. Dignity is earned, never given.', hi: 'सूर्य AK मकर स्वांश में: संस्थागत शक्ति और नौकरशाही निपुणता से अधिकार। सरकारी सचिव, दशकों की सेवा के बाद CEO। गरिमा अर्जित, कभी दी नहीं जाती।' },
      1: { en: 'Moon as AK in Capricorn Swamsha: emotional restraint and duty-bound nurturing. The soul suppresses feelings for responsibility. Elderly care administrator, institutional caretaker, or stoic family pillar.', hi: 'चन्द्र AK मकर स्वांश में: भावनात्मक संयम और कर्तव्य-बद्ध पोषण। जिम्मेदारी के लिए भावनाओं का दमन। वृद्ध देखभाल प्रशासक, संस्थागत देखभालकर्ता।' },
      2: { en: 'Mars as AK in Capricorn Swamsha: Mars is exalted — supreme disciplined action. Military career with highest honours, structural engineering, or competitive sports requiring long-term stamina. Ambition is relentless.', hi: 'मंगल AK मकर स्वांश में: मंगल उच्च — सर्वोच्च अनुशासित कर्म। उच्चतम सम्मान सहित सैन्य करियर, संरचनात्मक इंजीनियरिंग। महत्वाकांक्षा अदम्य।' },
      3: { en: 'Mercury as AK in Capricorn Swamsha: practical, structured thinking applied to administration. Government auditor, corporate planner, or architectural drafter. Communication is formal and precise.', hi: 'बुध AK मकर स्वांश में: प्रशासन में व्यावहारिक, संरचित चिंतन। सरकारी लेखापरीक्षक, कॉर्पोरेट योजनाकार। संवाद औपचारिक और सटीक।' },
      4: { en: 'Jupiter as AK in Capricorn Swamsha: Jupiter is debilitated — wisdom struggles against pragmatism and materialism. The soul must learn that spiritual growth requires more than worldly achievement. Ethics in business, corporate dharma.', hi: 'बृहस्पति AK मकर स्वांश में: बृहस्पति नीच — ज्ञान व्यावहारिकता और भौतिकवाद से संघर्ष करता है। व्यापार में नैतिकता, कॉर्पोरेट धर्म सीखना आवश्यक।' },
      5: { en: 'Venus as AK in Capricorn Swamsha: beauty and luxury through disciplined effort. Architecture, fashion brand built over decades, or luxury real estate. Relationships are formal and status-conscious.', hi: 'शुक्र AK मकर स्वांश में: अनुशासित प्रयास से सौंदर्य और विलासिता। वास्तुकला, दशकों में निर्मित फैशन ब्रांड। संबंध औपचारिक और प्रतिष्ठा-सचेत।' },
      6: { en: 'Saturn as AK in Capricorn Swamsha: Saturn in its own sign — the ultimate karmic labourer. Lifelong builder of institutions, infrastructure, or social structures. Authority comes very late but is unshakeable. Renunciation is the final spiritual stage.', hi: 'शनि AK मकर स्वांश में: शनि अपनी राशि में — परम कार्मिक श्रमिक। संस्थाओं, अवसंरचना का आजीवन निर्माता। अधिकार बहुत देर से पर अटल। त्याग अंतिम आध्यात्मिक चरण।' },
    },
  },
  {
    signId: 11,
    signName: { en: 'Aquarius', hi: 'कुंभ' },
    personality: {
      en: 'The soul works for collective betterment through science, social reform, and humanitarian causes. Innovative, unconventional, and group-oriented, this soul challenges the status quo.',
      hi: 'आत्मा विज्ञान, सामाजिक सुधार और मानवतावादी कार्यों से सामूहिक उन्नति के लिए कार्य करती है। नवाचारी, अपरंपरागत और समूह-उन्मुख, यह आत्मा यथास्थिति को चुनौती देती है।',
    },
    spiritualPath: {
      en: 'Sangha — spiritual growth through community, shared practice, and service to humanity. The ashram model of collective awakening.',
      hi: 'संघ — समुदाय, साझा अभ्यास और मानवता की सेवा से आध्यात्मिक विकास। सामूहिक जागृति का आश्रम मॉडल।',
    },
    career: {
      en: 'Technology, science, social activism, NGOs, aviation, networking, or futuristic industries.',
      hi: 'प्रौद्योगिकी, विज्ञान, सामाजिक सक्रियतावाद, एनजीओ, विमानन, नेटवर्किंग, या भविष्यवादी उद्योग।',
    },
    keywords: ['innovation', 'humanitarianism', 'community', 'reform', 'unconventional'],
    planetModifiers: {
      0: { en: 'Sun as AK in Aquarius Swamsha: authority exercised through democratic ideals rather than hierarchy. Elected leader, NGO founder, or science administrator. The ego dissolves into collective purpose.', hi: 'सूर्य AK कुंभ स्वांश में: पदानुक्रम की बजाय लोकतांत्रिक आदर्शों से अधिकार। निर्वाचित नेता, NGO संस्थापक। अहंकार सामूहिक उद्देश्य में विलीन।' },
      1: { en: 'Moon as AK in Aquarius Swamsha: emotional connection to large groups and humanitarian causes. Social worker, community organizer, or psychologist working with marginalized populations. Personal feelings are subordinated to collective needs.', hi: 'चन्द्र AK कुंभ स्वांश में: बड़े समूहों और मानवतावादी कार्यों से भावनात्मक जुड़ाव। सामाजिक कार्यकर्ता, सामुदायिक संगठनकर्ता। व्यक्तिगत भावनाएं सामूहिक आवश्यकताओं के अधीन।' },
      2: { en: 'Mars as AK in Aquarius Swamsha: revolutionary energy directed at social change. Protest leader, military reformer, or tech disruptor. Courage is applied to breaking outdated systems.', hi: 'मंगल AK कुंभ स्वांश में: सामाजिक परिवर्तन की ओर क्रांतिकारी ऊर्जा। विरोध नेता, सैन्य सुधारक, तकनीकी विघटनकर्ता। पुरानी व्यवस्थाओं को तोड़ने में साहस।' },
      3: { en: 'Mercury as AK in Aquarius Swamsha: innovative thinking and futuristic communication. Software architect, AI researcher, or science fiction writer. The mind is wired for unconventional problem-solving.', hi: 'बुध AK कुंभ स्वांश में: नवोन्मेषी चिंतन और भविष्यवादी संवाद। सॉफ्टवेयर आर्किटेक्ट, AI शोधकर्ता, विज्ञान कथा लेखक। अपरंपरागत समस्या-समाधान।' },
      4: { en: 'Jupiter as AK in Aquarius Swamsha: wisdom applied to social reform and collective upliftment. Progressive religious leader, educational reformer, or philosopher of technology. Teaching targets the masses, not individuals.', hi: 'बृहस्पति AK कुंभ स्वांश में: सामाजिक सुधार और सामूहिक उत्थान में लागू ज्ञान। प्रगतिशील धार्मिक नेता, शैक्षिक सुधारक। शिक्षण जनता के लिए।' },
      5: { en: 'Venus as AK in Aquarius Swamsha: art and beauty for social change. Digital artist, music for activism, or design for accessibility. Relationships are unconventional and freedom-oriented.', hi: 'शुक्र AK कुंभ स्वांश में: सामाजिक परिवर्तन के लिए कला और सौंदर्य। डिजिटल कलाकार, सक्रियतावाद संगीत। संबंध अपरंपरागत और स्वतंत्रता-उन्मुख।' },
      6: { en: 'Saturn as AK in Aquarius Swamsha: Saturn in its moolatrikona — the master organizer of collective labour. Trade union founder, social infrastructure builder, or NGO administrator. Service to the underprivileged is the soul\'s core purpose.', hi: 'शनि AK कुंभ स्वांश में: शनि मूलत्रिकोण में — सामूहिक श्रम का मास्टर संगठक। ट्रेड यूनियन संस्थापक, सामाजिक अवसंरचना निर्माता। वंचितों की सेवा आत्मा का मूल उद्देश्य।' },
    },
  },
  {
    signId: 12,
    signName: { en: 'Pisces', hi: 'मीन' },
    personality: {
      en: 'The soul is oriented toward transcendence, mysticism, and compassion. Deeply intuitive and empathic, this soul dissolves boundaries between self and other. The final sign represents the completion of the soul journey.',
      hi: 'आत्मा अतिक्रमण, रहस्यवाद और करुणा की ओर उन्मुख है। गहन अंतर्ज्ञानी और सहानुभूतिशील, यह आत्मा स्वयं और दूसरे के बीच की सीमाओं को मिटाती है। अंतिम राशि आत्मा यात्रा की पूर्णता।',
    },
    spiritualPath: {
      en: 'Moksha — the path of liberation and dissolution of the ego. Meditation, compassionate service, and surrender to the divine will.',
      hi: 'मोक्ष — मुक्ति और अहंकार विसर्जन का मार्ग। ध्यान, करुणामय सेवा और दिव्य इच्छा के प्रति समर्पण।',
    },
    career: {
      en: 'Spiritual teaching, charitable work, healing, cinema, photography, maritime, or any work serving the disadvantaged.',
      hi: 'आध्यात्मिक शिक्षण, दानकार्य, उपचार, सिनेमा, फोटोग्राफी, समुद्री, या वंचितों की सेवा।',
    },
    keywords: ['transcendence', 'mysticism', 'compassion', 'intuition', 'moksha'],
    planetModifiers: {
      0: { en: 'Sun as AK in Pisces Swamsha: authority dissolved into spiritual service. Ashram leader who shuns personal fame, charitable trust administrator, or spiritual healer. The ego surrenders to divine will.', hi: 'सूर्य AK मीन स्वांश में: आध्यात्मिक सेवा में विलीन अधिकार। व्यक्तिगत यश से बचने वाला आश्रम नेता, धर्मार्थ ट्रस्ट प्रशासक। अहंकार दिव्य इच्छा के समक्ष समर्पित।' },
      1: { en: 'Moon as AK in Pisces Swamsha: oceanic emotional depth and psychic sensitivity. Meditation teacher, dream analyst, or compassionate healer. The soul absorbs others\' suffering and must learn energetic boundaries.', hi: 'चन्द्र AK मीन स्वांश में: सागर-सी भावनात्मक गहराई और मानसिक संवेदनशीलता। ध्यान शिक्षक, स्वप्न विश्लेषक। आत्मा दूसरों की पीड़ा अवशोषित करती है।' },
      2: { en: 'Mars as AK in Pisces Swamsha: spiritual warrior who fights for the voiceless. Medical missionary, disaster relief worker, or monk with a martial arts discipline. Action is motivated by compassion, not ego.', hi: 'मंगल AK मीन स्वांश में: वंचितों के लिए लड़ने वाला आध्यात्मिक योद्धा। चिकित्सा मिशनरी, आपदा राहत कार्यकर्ता। कर्म करुणा से प्रेरित, अहंकार से नहीं।' },
      3: { en: 'Mercury as AK in Pisces Swamsha: Mercury is debilitated — logical mind struggles with intuitive, boundary-less Piscean energy. Poet, fantasy writer, or musician whose art transcends rational analysis. Learning to trust intuition over logic.', hi: 'बुध AK मीन स्वांश में: बुध नीच — तार्किक मन सहज, सीमाहीन मीन ऊर्जा से संघर्ष करता है। कवि, कल्पना लेखक। तर्क से अधिक अंतर्ज्ञान पर विश्वास सीखना।' },
      4: { en: 'Jupiter as AK in Pisces Swamsha: Jupiter in its own sign — the supreme spiritual teacher and sage. Moksha-oriented guru, meditation master, or mystic philosopher. The soul\'s entire journey points toward liberation and selfless service.', hi: 'बृहस्पति AK मीन स्वांश में: बृहस्पति अपनी राशि में — सर्वोच्च आध्यात्मिक शिक्षक और ऋषि। मोक्ष-उन्मुख गुरु, ध्यान गुरु। समस्त आत्मा यात्रा मुक्ति और निस्वार्थ सेवा की ओर।' },
      5: { en: 'Venus as AK in Pisces Swamsha: Venus is exalted — transcendent love and divine art. Sacred music, devotional cinema, or compassionate beauty. Romantic love evolves into universal love. The highest artistic expression comes through surrender.', hi: 'शुक्र AK मीन स्वांश में: शुक्र उच्च — दिव्य प्रेम और दिव्य कला। पवित्र संगीत, भक्ति सिनेमा। रोमांटिक प्रेम सार्वभौमिक प्रेम में विकसित। समर्पण से सर्वोच्च कलात्मक अभिव्यक्ति।' },
      6: { en: 'Saturn as AK in Pisces Swamsha: karmic completion through selfless service and renunciation. Hospital administrator, prison reformer, or monk in austere conditions. The soul finishes its worldly debts through compassion and detachment.', hi: 'शनि AK मीन स्वांश में: निस्वार्थ सेवा और त्याग से कार्मिक पूर्णता। अस्पताल प्रशासक, कारागार सुधारक। करुणा और वैराग्य से सांसारिक ऋणों का अंत।' },
    },
  },
];

/**
 * Get the Swamsha profile for a given navamsha sign (1-12).
 * Returns undefined if signId is out of range.
 */
export function getSwamshaProfile(signId: number): SwamshaProfile | undefined {
  return SWAMSHA_PROFILES.find(p => p.signId === signId);
}

/**
 * Get the planet-specific modifier for a given AK planet in a given Swamsha sign.
 * Returns undefined if the sign or planet is out of range.
 * @param signId - Navamsha sign of AK (1-12)
 * @param planetId - Planet ID of the AK (0=Sun through 6=Saturn)
 */
export function getSwamshaPlanetModifier(signId: number, planetId: number): { en: string; hi: string } | undefined {
  const profile = getSwamshaProfile(signId);
  if (!profile) return undefined;
  return profile.planetModifiers[planetId];
}
