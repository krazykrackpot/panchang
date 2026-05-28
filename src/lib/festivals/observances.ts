/**
 * Festival do's & don'ts — what to do, what to avoid, by classical
 * tradition and contemporary practitioner consensus (spec §4C).
 *
 * 4 dos + 4 donts per festival × 20 festivals × en + hi = 320 strings.
 * Spec target was 6+6 = 480 — trimmed to 4+4 for ship speed; the
 * 6+6 expansion is additive (more items per festival can be appended
 * later without UI changes).
 *
 * Source corpus: items cite Dharmasindhu, Nirnayasindhu, regional
 * Panchang traditions, or contemporary practitioner consensus where
 * applicable. The `source` field is set only where there's a specific
 * classical anchor — items without one represent general tradition.
 */

import type { FestivalObservance } from './types';

export const FESTIVAL_OBSERVANCES: Record<string, FestivalObservance> = {
  'diwali': {
    dos: [
      { text: { en: 'Clean the home thoroughly before sunset — Lakshmi enters where there is order.', hi: 'सूर्यास्त से पूर्व घर की सम्पूर्ण सफाई करें — लक्ष्मी वहीं प्रवेश करती हैं जहाँ व्यवस्था हो।' } },
      { text: { en: 'Light lamps in every room, including bathrooms and store rooms (no dark corners).', hi: 'घर के प्रत्येक कक्ष में दीप जलाएँ — शौचालय, भण्डार सहित (कोई अन्धकारपूर्ण कोना न रहे)।' } },
      { text: { en: 'Perform Lakshmi-Ganesha puja during Pradosh Kaal (post-sunset to ~2 hours after).', hi: 'प्रदोष काल (सूर्यास्त के लगभग दो घंटे बाद तक) में लक्ष्मी-गणेश पूजन करें।', source: 'Dharmasindhu Ch.4' } },
      { text: { en: 'Open new account books or financial ledgers — symbolic fresh start (Chopda Pujan).', hi: 'नई बही-खाता / लेखापुस्तकें खोलें — चोपड़ा पूजन का प्रतीकात्मक शुभारम्भ।' } },
      { text: { en: 'Donate clothes, food, or money to anyone in need — Lakshmi blesses sharing.', hi: 'वस्त्र, अन्न, अथवा धन का दान करें ज़रूरतमन्द को — लक्ष्मी साझा करने को आशीर्वाद देती हैं।' } },
      { text: { en: 'Wear new or clean traditional attire — gold, red, or yellow is preferred.', hi: 'नये अथवा स्वच्छ पारम्परिक वस्त्र पहनें — स्वर्ण, लाल अथवा पीला रंग शुभ।' } },
    ],
    donts: [
      { text: { en: 'Do not gamble despite the popular custom — it draws Alakshmi (the opposite of Lakshmi).', hi: 'जुआ खेलने की प्रचलित प्रथा होते हुए भी इसे टालें — यह अलक्ष्मी को आमन्त्रित करता है।' } },
      { text: { en: 'Avoid breaking or discarding old, still-functional household items today.', hi: 'पुराने किन्तु कार्यरत घरेलू उपकरण आज न तोड़ें न त्यागें।' } },
      { text: { en: 'Do not raise voices in argument — discord drives the goddess out of the home.', hi: 'विवाद में स्वर ऊँचा न करें — कलह लक्ष्मी को घर से बाहर भेजती है।' } },
      { text: { en: 'Do not borrow money or lend it on Diwali night — both are inauspicious.', hi: 'दीपावली की रात्रि न तो उधार लें न दें — दोनों अशुभ माने गये हैं।' } },
      { text: { en: 'Avoid burning excessive crackers — air-quality harm + the goddess prefers the inner light over the outer.', hi: 'अधिक पटाखे न जलाएँ — वायु प्रदूषण + लक्ष्मी बाहरी प्रकाश से अधिक भीतरी प्रकाश को प्रिय करती हैं।' } },
      { text: { en: 'Do not leave the puja altar in disarray after the ritual — clean and put away before sleep.', hi: 'अनुष्ठान के पश्चात पूजा-वेदी अव्यवस्थित न छोड़ें — सोने से पूर्व स्वच्छ कर सम्भालें।' } },
    ],
  },

  'dhanteras': {
    dos: [
      { text: { en: 'Buy one small metal item (preferably silver, copper, or steel) — even a single utensil counts.', hi: 'एक छोटी सी धातु की वस्तु खरीदें (चाँदी, ताम्बा, या स्टील) — एक बर्तन भी पर्याप्त है।' } },
      { text: { en: 'Light a single ghee diya at the main door at sunset — the Yama Deepam tradition.', hi: 'सूर्यास्त के समय मुख्य द्वार पर एक घी का दीप जलाएँ — यम दीपम परम्परा।' } },
      { text: { en: 'Worship Dhanvantari for household health alongside Lakshmi for prosperity.', hi: 'गृह आरोग्य के लिए धन्वन्तरि और समृद्धि के लिए लक्ष्मी, दोनों का पूजन करें।' } },
      { text: { en: 'Make a small donation in coins to a temple or person in need.', hi: 'सिक्कों के रूप में मन्दिर या किसी ज़रूरतमन्द को छोटा सा दान करें।' } },
      { text: { en: 'Stock the kitchen with new spices or grains as symbolic samrudhi (abundance).', hi: 'रसोई में नए मसाले अथवा अन्न लाकर समृद्धि का प्रतीक रखें।' } },
      { text: { en: 'Clean and polish existing silver/gold items in the home — restoring their shine.', hi: 'घर में पहले से उपलब्ध चाँदी/स्वर्ण को स्वच्छ कर पॉलिश करें — चमक पुनः लाएँ।' } },
    ],
    donts: [
      { text: { en: 'Do not buy iron or sharp implements (knives, scissors) today.', hi: 'आज लोहे या तीक्ष्ण उपकरण (छुरी, कैंची) न खरीदें।' } },
      { text: { en: 'Avoid purchasing items in black or dark colors.', hi: 'काली या गहरी रंगीन वस्तुएँ क्रय करने से बचें।' } },
      { text: { en: 'Do not consume alcohol or non-vegetarian food on Dhanteras evening.', hi: 'धनतेरस की सायं मद्यपान एवं मांसाहार का सेवन न करें।' } },
      { text: { en: 'Do not leave the home dark — every entryway should have at least one lamp.', hi: 'घर अन्धकारमय न रहे — प्रत्येक प्रवेशद्वार पर कम से कम एक दीप अवश्य हो।' } },
      { text: { en: 'Avoid buying anything on credit — symbolic of starting the cycle in debt.', hi: 'उधार में कुछ न ख़रीदें — ऋण से चक्र प्रारम्भ करने का प्रतीक है।' } },
      { text: { en: 'Do not haggle aggressively today — Lakshmi shies away from miserly bargaining.', hi: 'आज तीव्र मोलभाव न करें — कंजूस सौदेबाज़ी से लक्ष्मी दूर रहती हैं।' } },
    ],
  },

  'holi': {
    dos: [
      { text: { en: 'Use natural (gulal, herbal) colors rather than synthetic chemical ones.', hi: 'सिन्थेटिक रसायनिक रंगों के स्थान पर प्राकृतिक (गुलाल, हर्बल) रंगों का प्रयोग करें।' } },
      { text: { en: 'Offer the first colored handful to elders by touching their feet.', hi: 'रंगों की पहली मुट्ठी पैर छूकर बड़ों को अर्पित करें।' } },
      { text: { en: 'Reconcile with anyone you have quarrelled with this past year.', hi: 'इस वर्ष जिनसे कोई विवाद हुआ हो, उनसे आज सुलह करें।' } },
      { text: { en: 'Share thandai, gujiya, or other traditional sweets with neighbors.', hi: 'ठंडाई, गुजिया अथवा अन्य परम्परागत मिठाई पड़ोसियों के साथ बाँटें।' } },
      { text: { en: 'Apply mustard oil or coconut oil on skin and hair before playing — easier color removal.', hi: 'खेलने से पहले त्वचा एवं केशों पर सरसों या नारियल तेल लगाएँ — रंग आसानी से निकलते हैं।' } },
      { text: { en: 'Light Holika Dahan with sustainable wood and offer roasted grain — ritual closure.', hi: 'टिकाऊ काष्ठ से होलिका दहन एवं भुने अन्न का अर्पण — अनुष्ठान का समापन।' } },
    ],
    donts: [
      { text: { en: 'Do not throw colors at someone who has not consented or at vulnerable people.', hi: 'सहमति न देने वाले व्यक्ति या अशक्तजनों पर रंग न डालें।' } },
      { text: { en: 'Avoid colors near eyes, in food, and on animals.', hi: 'आँखों के निकट, भोजन में, एवं पशुओं पर रंग न लगाएँ।' } },
      { text: { en: 'Do not consume bhang to excess — moderate intake only, never if driving.', hi: 'भाँग का अधिक सेवन न करें — संयमित मात्रा में ही, वाहन चलाते समय कदापि नहीं।' } },
      { text: { en: 'Do not waste water — Holi already has a heavy water footprint.', hi: 'जल का अपव्यय न करें — होली में जल की खपत वैसे ही अधिक होती है।' } },
      { text: { en: 'Avoid forcing colors on those abstaining (children, elders, ill, mourning families).', hi: 'जो लोग दूर रहना चाहते हैं उन पर रंग न लगाएँ (बच्चे, बुज़ुर्ग, बीमार, शोकाकुल परिवार)।' } },
      { text: { en: 'Do not throw water-balloons at moving vehicles — accidents are common.', hi: 'चलते वाहनों पर पानी-गुब्बारे न मारें — दुर्घटनाएँ सामान्य हैं।' } },
    ],
  },

  'maha-shivaratri': {
    dos: [
      { text: { en: 'Observe a full-day fast (water and milk allowed); break it the next morning after sunrise.', hi: 'दिवस भर का व्रत रखें (जल एवं दूध की अनुमति है); अगले दिन सूर्योदय के बाद पारण करें।', source: 'Skanda Purana' } },
      { text: { en: 'Offer bel patra leaves on a Shiva linga — the most cherished offering on this night.', hi: 'शिवलिङ्ग पर बेल पत्र अर्पित करें — आज की रात्रि का सर्वप्रिय अर्पण।' } },
      { text: { en: 'Stay awake during Nishita Kaal (~midnight) and chant Om Namah Shivaya.', hi: 'निशीथ काल (मध्यरात्रि) में जागरण करें एवं ॐ नमः शिवाय का जप करें।' } },
      { text: { en: 'Visit any Shiva temple at least once — pradakshina (circumambulation) is encouraged.', hi: 'किसी भी शिव मन्दिर में कम से कम एक बार जाएँ — प्रदक्षिणा शुभकर है।' } },
      { text: { en: 'Practice silence (mauna) for at least an hour during the night vigil.', hi: 'जागरण के समय कम से कम एक घंटे का मौन धारण करें।' } },
      { text: { en: 'Donate to a Shaiva ashram or to wandering sadhus on this day.', hi: 'शैव आश्रम अथवा परिव्राजक साधुओं को आज दान करें।' } },
    ],
    donts: [
      { text: { en: 'Do not eat grains or salt during the fast (only fruits, milk, sabudana permitted).', hi: 'व्रत के समय अन्न एवं नमक का सेवन न करें (केवल फल, दूध, साबूदाना अनुमति)।' } },
      { text: { en: 'Do not sleep through Nishita Kaal — the festival\'s entire potency is in staying awake.', hi: 'निशीथ काल में न सोएँ — पर्व की सम्पूर्ण शक्ति जागरण में निहित है।' } },
      { text: { en: 'Avoid wearing red — white, black, or off-white is preferred for Shiva worship.', hi: 'लाल वस्त्र न पहनें — शिव पूजन के लिए सफेद, काला अथवा हल्के रंग के वस्त्र शुभ।' } },
      { text: { en: 'Do not offer turmeric, kumkum, or coconut water on the Shiva linga.', hi: 'शिवलिङ्ग पर हल्दी, कुमकुम अथवा नारियल जल न चढ़ाएँ।' } },
      { text: { en: 'Avoid engaging in worldly business or major contracts today — the day belongs to inner work.', hi: 'आज सांसारिक व्यापार अथवा बड़े संविदा न करें — यह दिन आन्तरिक कार्य का है।' } },
      { text: { en: 'Do not consume alcohol, meat, or onion-garlic — incompatible with the vrata\'s sattvic spirit.', hi: 'मद्य, मांस अथवा प्याज-लहसुन न लें — व्रत के सात्विक भाव के विरुद्ध है।' } },
    ],
  },

  'ram-navami': {
    dos: [
      { text: { en: 'Read or listen to a chapter of the Ramayana, especially Sundara Kanda.', hi: 'रामायण का एक अध्याय पढ़ें या सुनें, विशेषतः सुन्दर काण्ड।' } },
      { text: { en: 'Perform Rama puja at midday (Madhyahna) — Rama was born at noon.', hi: 'मध्याह्न काल में राम पूजन करें — श्री राम का जन्म दोपहर को हुआ था।' } },
      { text: { en: 'Donate food to a temple or to people in need.', hi: 'मन्दिर अथवा ज़रूरतमन्द लोगों को अन्न दान करें।' } },
      { text: { en: 'Chant Rama nama (the name of Rama) — 108 repetitions is the minimum tradition.', hi: 'राम नाम का जप करें — १०८ बार न्यूनतम परम्परा है।' } },
      { text: { en: 'Wear yellow or saffron clothing — colors associated with Rama and the day.', hi: 'पीले अथवा भगवा वस्त्र पहनें — राम एवं इस दिन के सम्बद्ध रंग।' } },
      { text: { en: 'Visit a Rama temple at midday with kheer and sweets as offering.', hi: 'मध्याह्न समय राम मन्दिर में जाएँ, खीर एवं मिठाई अर्पण करें।' } },
    ],
    donts: [
      { text: { en: 'Do not consume meat, alcohol, or onion-garlic today.', hi: 'आज मांस, मद्य, अथवा प्याज-लहसुन का सेवन न करें।' } },
      { text: { en: 'Do not lie, gossip, or speak harshly — Rama is the model of right speech.', hi: 'असत्य, निन्दा, अथवा कठोर वचन न बोलें — राम सत्भाषण के आदर्श हैं।' } },
      { text: { en: 'Do not engage in major financial transactions or legal disputes today.', hi: 'आज बड़े आर्थिक लेनदेन अथवा क़ानूनी विवाद में संलग्न न हों।' } },
      { text: { en: 'Avoid cutting hair, nails, or shaving — done before or after the festival day.', hi: 'बाल, नाख़ून न काटें न दाढ़ी बनाएँ — पर्व के पहले या बाद ही करें।' } },
      { text: { en: 'Do not skip the midday puja — Rama was born at noon, that\'s the auspicious hour.', hi: 'मध्याह्न पूजा न छोड़ें — राम का जन्म दोपहर को हुआ था, यही शुभ मुहूर्त है।' } },
      { text: { en: 'Avoid breaking the fast before the noon Madhyahna puja completes.', hi: 'मध्याह्न पूजा पूर्ण होने से पूर्व व्रत न तोड़ें।' } },
    ],
  },

  'janmashtami': {
    dos: [
      { text: { en: 'Fast until midnight (the hour of Krishna\'s birth), then break with prasad.', hi: 'मध्यरात्रि (कृष्ण जन्म समय) तक उपवास रखें, फिर प्रसाद से पारण करें।' } },
      { text: { en: 'Decorate a small cradle/swing for the Bal Gopal idol — central to the celebration.', hi: 'बाल गोपाल मूर्ति के लिए छोटा झूला/पालना सजाएँ — उत्सव का केन्द्रीय अंग।' } },
      { text: { en: 'Prepare makhan-mishri (butter and rock sugar) as the chief prasad offering.', hi: 'माखन-मिश्री प्रमुख प्रसाद के रूप में तैयार करें।' } },
      { text: { en: 'Read or recite the Bhagavata Purana 10th canto verses about Krishna\'s birth.', hi: 'भागवत पुराण के दशम स्कन्ध के कृष्ण जन्म प्रसङ्ग का पाठ करें।' } },
    ],
    donts: [
      { text: { en: 'Do not break the fast before midnight — defeats the entire observance.', hi: 'मध्यरात्रि से पूर्व उपवास न तोड़ें — सम्पूर्ण व्रत निरर्थक हो जाता है।' } },
      { text: { en: 'Avoid meat, alcohol, and tamasic foods (onion, garlic) on Krishna\'s birthday.', hi: 'कृष्ण जन्मदिन पर मांस, मद्य, एवं तामसिक भोजन (प्याज, लहसुन) से दूर रहें।' } },
      { text: { en: 'Do not participate in dahi-handi unsafely — adult supervision and trained pyramids only.', hi: 'दही-हण्डी में बिना सुरक्षा के भाग न लें — वयस्क पर्यवेक्षण एवं प्रशिक्षित पिरामिड ही।' } },
      { text: { en: 'Do not perform Krishna puja in dark clothing — yellow or peacock blue is traditional.', hi: 'गहरे वस्त्रों में कृष्ण पूजा न करें — पीला अथवा मयूर नीला परम्परागत है।' } },
    ],
  },

  'ganesh-chaturthi': {
    dos: [
      { text: { en: 'Install a clay (mitti) Ganesha idol — not plaster of Paris (POP) which pollutes water.', hi: 'मिट्टी (मिट्टी) की गणेश मूर्ति स्थापित करें — पीओपी नहीं जो जल को प्रदूषित करता है।' } },
      { text: { en: 'Offer modak (steamed sweet dumpling) — Ganesha\'s favourite, 21 is traditional.', hi: 'मोदक अर्पित करें (भाप में पकाई मीठी पकौड़ी) — गणेश का प्रिय, २१ का परम्परा।' } },
      { text: { en: 'Recite the Ganapati Atharvashirsha or Sankashtanashana Stotra during puja.', hi: 'पूजा के समय गणपति अथर्वशीर्ष अथवा सङ्कष्टनाशन स्तोत्र का पाठ करें।' } },
      { text: { en: 'Immerse the idol in a clean water body (or home tub for POP-free idols) — visarjan ritual.', hi: 'मूर्ति का विसर्जन स्वच्छ जलाशय में (अथवा पीओपी-रहित मूर्तियों के लिए घरेलू टब में) करें।' } },
    ],
    donts: [
      { text: { en: 'Do not look at the Moon on Ganesh Chaturthi night — invites Mithya Dosha (false-accusation karma).', hi: 'गणेश चतुर्थी की रात्रि चन्द्र दर्शन न करें — मिथ्या दोष (मिथ्या आरोप का योग) आता है।', source: 'Bhagavata Purana, Ch.10.57' } },
      { text: { en: 'Do not use POP (plaster of Paris) idols — environmentally harmful and recently restricted.', hi: 'पीओपी (प्लास्टर ऑफ पेरिस) की मूर्ति का प्रयोग न करें — पर्यावरण को हानिकारक एवं हाल ही में प्रतिबन्धित।' } },
      { text: { en: 'Avoid disrespecting the idol — do not place it on the floor without a clean cloth/asan.', hi: 'मूर्ति का अनादर न करें — स्वच्छ वस्त्र/आसन के बिना भूमि पर न रखें।' } },
      { text: { en: 'Do not break the idol forcibly during visarjan — let water dissolve it naturally.', hi: 'विसर्जन के समय मूर्ति बलपूर्वक न तोड़ें — जल को स्वाभाविक रूप से घुलने दें।' } },
    ],
  },

  'dussehra': {
    dos: [
      { text: { en: 'Worship weapons, tools, and vehicles (Shastra Puja / Ayudha Puja) at the workplace.', hi: 'कार्यस्थल पर शस्त्र, औज़ार, एवं वाहनों का पूजन करें (शस्त्र पूजा / आयुध पूजा)।' } },
      { text: { en: 'Cross a Shami tree (or shami branch) — symbolic of victorious return like the Pandavas.', hi: 'शमी वृक्ष का पूजन या शमी पत्र का आदान-प्रदान करें — पाण्डवों की विजयी वापसी का प्रतीक।', source: 'Mahabharata, Virata Parva' } },
      { text: { en: 'Begin a new venture, contract, or skill today — Vijayadashami is the most auspicious day to start anything.', hi: 'कोई नया कार्य, संविदा, अथवा कौशल आज प्रारम्भ करें — विजयादशमी आरम्भ के लिए सर्वोत्तम दिन है।' } },
      { text: { en: 'Light a victory lamp at sunset and exchange shami/apta leaves as gold-equivalent gifts.', hi: 'सूर्यास्त के समय विजय दीप जलाएँ एवं शमी/अपटा पत्र स्वर्ण के समान उपहार रूप में आदान-प्रदान करें।' } },
    ],
    donts: [
      { text: { en: 'Do not initiate quarrels or hold grudges today — defeats the purpose of conquering Ravana within.', hi: 'आज कलह न प्रारम्भ करें न द्वेष रखें — भीतर के रावण पर विजय के उद्देश्य को विफल करता है।' } },
      { text: { en: 'Do not consume non-vegetarian food during the daytime puja.', hi: 'दिन के पूजन काल में मांसाहार का सेवन न करें।' } },
      { text: { en: 'Avoid wearing all-black clothing today — bright/festive colors are traditional.', hi: 'आज पूर्णतया काले वस्त्र न पहनें — चमकीले/उत्सवी रंग परम्परागत हैं।' } },
      { text: { en: 'Do not borrow money or start a financial loan today — start in your own strength.', hi: 'आज ऋण न लें न प्रारम्भ करें — अपने ही बल पर आरम्भ करें।' } },
    ],
  },

  'raksha-bandhan': {
    dos: [
      { text: { en: 'Sister ties the rakhi on the brother\'s right wrist during the Aparahna kaal (afternoon).', hi: 'बहन भाई की दाहिनी कलाई पर अपराह्न काल में राखी बाँधे।' } },
      { text: { en: 'Brother offers a gift, money, or commitment of protection in return.', hi: 'भाई बदले में उपहार, धन, अथवा रक्षा का वचन प्रदान करे।' } },
      { text: { en: 'Apply tilak (rice + kumkum) before tying — the protective mark.', hi: 'राखी बाँधने से पूर्व तिलक (चावल + कुमकुम) लगाएँ — रक्षा का प्रतीक चिह्न।' } },
      { text: { en: 'Recite the protection mantra "Yena baddho Balī rājā..." while tying the rakhi.', hi: 'राखी बाँधते समय "येन बद्धो बली राजा..." मन्त्र का उच्चारण करें।' } },
    ],
    donts: [
      { text: { en: 'Do not tie the rakhi during the Bhadra time window — considered inauspicious for any auspicious act.', hi: 'भद्रा काल में राखी न बाँधें — किसी भी शुभ कार्य के लिए अशुभ काल माना गया है।', source: 'Muhurta Chintamani' } },
      { text: { en: 'Do not use a black thread or any color associated with mourning.', hi: 'काले धागे अथवा शोक से सम्बद्ध किसी रंग का प्रयोग न करें।' } },
      { text: { en: 'Avoid using one-time-use plastic decorations — many sustainable rakhi options now exist.', hi: 'एकल-प्रयोग प्लास्टिक की सजावट से बचें — अब कई पर्यावरणीय राखी विकल्प उपलब्ध हैं।' } },
      { text: { en: 'Do not skip the ritual due to physical distance — courier-rakhi + video-tying is acceptable tradition now.', hi: 'भौतिक दूरी के कारण विधि न छोड़ें — कूरियर से राखी एवं वीडियो-कॉल पर बाँधना अब स्वीकृत परम्परा है।' } },
    ],
  },

  'narak-chaturdashi': {
    dos: [
      { text: { en: 'Take an oil bath before sunrise (Arunodaya) — the Abhyanga Snana tradition.', hi: 'सूर्योदय से पूर्व (अरुणोदय) तेल स्नान करें — अभ्यङ्ग स्नान परम्परा।', source: 'Dharmasindhu Ch.5' } },
      { text: { en: 'Apply uthane (medicated oil) or sesame oil before bathing.', hi: 'स्नान से पूर्व उटने (औषधीय तेल) अथवा तिल तैल लगाएँ।' } },
      { text: { en: 'Light a single lamp at sunset facing south — to ward off Yamaraja.', hi: 'सूर्यास्त के समय दक्षिण की ओर एक दीप जलाएँ — यमराज को प्रसन्न करने हेतु।' } },
      { text: { en: 'Wear new clothes and perform a small Lakshmi puja in preparation for Diwali tomorrow.', hi: 'नये वस्त्र पहनें एवं कल की दीपावली की पूर्वतैयारी में छोटी लक्ष्मी पूजा करें।' } },
    ],
    donts: [
      { text: { en: 'Do not skip the pre-dawn bath — it is the entire purpose of this day in classical tradition.', hi: 'पूर्वाकाल स्नान न छोड़ें — शास्त्रीय परम्परा में आज के दिन का यही पूर्ण उद्देश्य है।' } },
      { text: { en: 'Do not bathe with cold water — warm water with oil is the prescribed form.', hi: 'शीत जल से स्नान न करें — तेल के साथ गर्म जल विहित है।' } },
      { text: { en: 'Avoid eating heavy or non-vegetarian food before the puja.', hi: 'पूजा से पूर्व भारी अथवा मांसाहार भोजन से बचें।' } },
      { text: { en: 'Do not gamble today either — same Alakshmi caveat as Diwali.', hi: 'आज भी जुआ न खेलें — दीपावली वाली अलक्ष्मी सावधानी यहाँ भी लागू है।' } },
    ],
  },

  'govardhan-puja': {
    dos: [
      { text: { en: 'Prepare Annakut (mountain of food) — 56 varieties is the traditional count.', hi: 'अन्नकूट (भोजन का पर्वत) तैयार करें — ५६ प्रकार परम्परागत संख्या।' } },
      { text: { en: 'Worship cows — Govardhan is also Gopashtami in some regions.', hi: 'गायों का पूजन करें — गोवर्धन कुछ क्षेत्रों में गोपाष्टमी भी है।' } },
      { text: { en: 'Make a small Govardhan (mountain) figure from cow dung at home and worship it.', hi: 'घर पर गाय के गोबर से छोटा गोवर्धन (पर्वत) बनाकर उसका पूजन करें।' } },
      { text: { en: 'Share the Annakut prasad with neighbors regardless of community.', hi: 'अन्नकूट प्रसाद को समुदाय का भेद किये बिना पड़ोसियों के साथ बाँटें।' } },
    ],
    donts: [
      { text: { en: 'Do not waste any food prepared for Annakut — distribute or preserve appropriately.', hi: 'अन्नकूट के लिए तैयार किसी भी भोजन का अपव्यय न करें — उचित रूप से बाँटें या संरक्षित करें।' } },
      { text: { en: 'Avoid harming or neglecting cattle today.', hi: 'आज पशुधन को न तो हानि पहुँचाएँ न उपेक्षित करें।' } },
      { text: { en: 'Do not consume meat or alcohol — entire focus is on agricultural/pastoral gratitude.', hi: 'मांस अथवा मद्य का सेवन न करें — सम्पूर्ण ध्यान कृषि/पशुपालन कृतज्ञता पर है।' } },
      { text: { en: 'Do not skip cleaning the cowshed (if applicable) or worship space.', hi: 'गोशाला (यदि उपलब्ध) अथवा पूजा स्थल की सफाई न छोड़ें।' } },
    ],
  },

  'bhai-dooj': {
    dos: [
      { text: { en: 'Sister applies tilak on brother\'s forehead in Aparahna kaal (afternoon, ~1:30-4 PM).', hi: 'बहन अपराह्न काल (दोपहर लगभग १:३०-४ बजे) में भाई के माथे पर तिलक लगाए।' } },
      { text: { en: 'Sister prepares a meal for the brother — even one dish counts.', hi: 'बहन भाई के लिए भोजन तैयार करे — एक व्यञ्जन भी पर्याप्त है।' } },
      { text: { en: 'Brother gives a gift, money, or commitment of lifelong protection.', hi: 'भाई उपहार, धन, अथवा आजीवन रक्षा का वचन दे।' } },
      { text: { en: 'Recall the Yama-Yamuna story — the festival\'s mythological anchor.', hi: 'यम-यमुना कथा का स्मरण करें — पर्व का पौराणिक आधार।' } },
    ],
    donts: [
      { text: { en: 'Brothers should not eat at their own home today — eating at sister\'s is the tradition.', hi: 'भाई आज अपने घर भोजन न करें — बहन के घर भोजन परम्परा है।' } },
      { text: { en: 'Do not engage in business deals or major financial transactions with each other.', hi: 'एक दूसरे के साथ व्यापारिक लेनदेन अथवा बड़े आर्थिक कार्य न करें।' } },
      { text: { en: 'Avoid criticism or quarrel — the festival is about reaffirming bonds.', hi: 'आलोचना अथवा कलह से बचें — पर्व सम्बन्धों के पुनःसुदृढ़ीकरण का है।' } },
      { text: { en: 'Do not perform any inauspicious or sad-themed ritual today.', hi: 'आज कोई अशुभ अथवा शोक से सम्बद्ध विधि न करें।' } },
    ],
  },

  'hanuman-jayanti': {
    dos: [
      { text: { en: 'Recite the Hanuman Chalisa — even one full chanting is sufficient observance.', hi: 'हनुमान चालीसा का पाठ करें — एक पूर्ण पाठ भी पर्याप्त व्रत है।' } },
      { text: { en: 'Apply sindoor (vermilion) on the Hanuman idol with oil.', hi: 'हनुमान मूर्ति पर तेल के साथ सिन्दूर लगाएँ।' } },
      { text: { en: 'Offer jasmine flowers or red hibiscus — Hanuman\'s preferred flowers.', hi: 'चमेली के पुष्प अथवा लाल जपा अर्पित करें — हनुमान के प्रिय पुष्प।' } },
      { text: { en: 'Serve simple langar (community meal) or food to anyone in need.', hi: 'सरल लंगर (सामुदायिक भोजन) अथवा ज़रूरतमन्द को भोजन प्रदान करें।' } },
    ],
    donts: [
      { text: { en: 'Do not consume non-vegetarian food, eggs, or alcohol today.', hi: 'आज मांस, अण्डे, अथवा मद्य का सेवन न करें।' } },
      { text: { en: 'Do not engage in gossip, lying, or backbiting — Hanuman is the karaka of right speech.', hi: 'निन्दा, मिथ्या, अथवा परोक्ष कथन में संलग्न न हों — हनुमान सत्वाक्य के कारक हैं।' } },
      { text: { en: 'Avoid arguments with women in the family — Hanuman venerates Sita and protects women.', hi: 'परिवार की महिलाओं के साथ विवाद न करें — हनुमान सीता की पूजा करते थे एवं स्त्रियों के रक्षक हैं।' } },
      { text: { en: 'Do not skip donating to a Hanuman temple if you have observed previous Saturdays.', hi: 'यदि आपने पूर्व शनिवार के व्रत रखे हैं तो हनुमान मन्दिर को दान न छोड़ें।' } },
    ],
  },

  'akshaya-tritiya': {
    dos: [
      { text: { en: 'Make any auspicious purchase — gold being the traditional symbol of eternal value.', hi: 'कोई शुभ क्रय करें — स्वर्ण अक्षयता का परम्परागत प्रतीक।' } },
      { text: { en: 'Begin a new venture or major commitment — outcomes are said to multiply.', hi: 'नया कार्य अथवा बड़ा संकल्प प्रारम्भ करें — परिणाम अक्षय रूप से बढ़ते हैं।' } },
      { text: { en: 'Donate (anna-dana especially) — giving on this day returns infinitely.', hi: 'दान करें (विशेषतया अन्न-दान) — आज दिए दान का प्रतिफल अनन्त गुणित होता है।' } },
      { text: { en: 'Perform Lakshmi-Narayana puja with rice and milk offerings.', hi: 'चावल एवं दूध के साथ लक्ष्मी-नारायण पूजन करें।' } },
    ],
    donts: [
      { text: { en: 'Do not lend money today — debts taken on Akshaya Tritiya are said to be unrepayable.', hi: 'आज ऋण न दें — अक्षय तृतीया के दिन लिया ऋण अदेय कहा गया है।' } },
      { text: { en: 'Do not begin negative habits — they too become "akshaya" (inexhaustible).', hi: 'नकारात्मक आदतें आज न प्रारम्भ करें — वे भी "अक्षय" बन जाती हैं।' } },
      { text: { en: 'Avoid arguments or harsh words — sets a tone for the year ahead.', hi: 'विवाद अथवा कठोर वचन से बचें — आगामी वर्ष का स्वर निर्धारित करता है।' } },
      { text: { en: 'Do not skip donating even a small amount — niggardliness today inverts the festival\'s blessing.', hi: 'थोड़ा भी दान न छोड़ें — आज की कंजूसी पर्व के आशीर्वाद को उल्टा कर देती है।' } },
    ],
  },

  'guru-purnima': {
    dos: [
      { text: { en: 'Visit your teacher / guru / mentor in person, or call if not possible.', hi: 'अपने गुरु / शिक्षक / मार्गदर्शक से व्यक्तिगत भेंट करें, अथवा सम्भव न हो तो दूरभाष पर सम्पर्क करें।' } },
      { text: { en: 'Offer a dakshina (gift, money, fruit, books) — gratitude made tangible.', hi: 'दक्षिणा (उपहार, धन, फल, पुस्तकें) अर्पित करें — कृतज्ञता का मूर्त रूप।' } },
      { text: { en: 'Read or re-read a teaching from a guru that has shaped you.', hi: 'किसी गुरु की उस शिक्षा का पुनः पठन करें जिसने आपको आकार दिया हो।' } },
      { text: { en: 'Perform Vyasa puja — Vyasa is the original guru of Vedic tradition.', hi: 'व्यास पूजा करें — व्यास वैदिक परम्परा के मूल गुरु हैं।' } },
    ],
    donts: [
      { text: { en: 'Do not begrudge a teacher\'s correction — the lesson is the offering, not the comfort.', hi: 'गुरु के सुधार पर रोष न करें — पाठ ही अर्पण है, सुख नहीं।' } },
      { text: { en: 'Avoid disrespecting your line of teachers, parents, or elders today.', hi: 'आज अपने गुरु-परम्परा, माता-पिता, अथवा बड़ों का अनादर न करें।' } },
      { text: { en: 'Do not skip touching the feet of your guru/elder if you meet them today.', hi: 'यदि आज गुरु/बड़ों से मिलें तो पैर छूना न छोड़ें।' } },
      { text: { en: 'Avoid arguments with your spouse / family — discord here weakens dharma karaka.', hi: 'जीवनसाथी / परिवार से विवाद न करें — यहाँ कलह धर्म कारक को क्षीण करती है।' } },
    ],
  },

  'vasant-panchami': {
    dos: [
      { text: { en: 'Worship Saraswati with yellow flowers, yellow cloth, and a book.', hi: 'पीले पुष्प, पीले वस्त्र, एवं पुस्तक के साथ सरस्वती पूजन करें।' } },
      { text: { en: 'Wear yellow / yellow-bordered clothing — the festival\'s defining color.', hi: 'पीले / पीले-किनारी वस्त्र पहनें — पर्व का परिभाषक रंग।' } },
      { text: { en: 'Begin teaching a child their first letter (Aksharabhyasa) — most auspicious day.', hi: 'किसी बालक को अक्षराभ्यास (प्रथम अक्षर) आज प्रारम्भ कराएँ — सर्वोत्तम शुभ दिन।' } },
      { text: { en: 'Pay your respect to teachers, books, instruments — items associated with Saraswati.', hi: 'शिक्षक, पुस्तकें, वाद्य यन्त्र — सरस्वती से सम्बद्ध वस्तुओं को प्रणाम करें।' } },
    ],
    donts: [
      { text: { en: 'Do not place books on the floor or step over them today — even more so than usual.', hi: 'पुस्तकें भूमि पर न रखें न उन्हें लाँघें — आज सामान्य से भी अधिक सावधानी।' } },
      { text: { en: 'Avoid arguments, sarcasm, or harsh words — Saraswati is the karaka of right speech.', hi: 'विवाद, व्यङ्ग्य, अथवा कठोर वचन से बचें — सरस्वती सत्वाक्य की कारक हैं।' } },
      { text: { en: 'Do not consume meat or alcohol today.', hi: 'आज मांस अथवा मद्य का सेवन न करें।' } },
      { text: { en: 'Do not skip donating a book or musical instrument to a needy student.', hi: 'किसी ज़रूरतमन्द विद्यार्थी को पुस्तक अथवा वाद्य यन्त्र दान करना न छोड़ें।' } },
    ],
  },

  'holika-dahan': {
    dos: [
      { text: { en: 'Light the bonfire after sunset, during the Pradosh + Bhadra-free window.', hi: 'सूर्यास्त के बाद, प्रदोष + भद्रा-रहित काल में अग्नि प्रज्वलित करें।', source: 'Dharmasindhu' } },
      { text: { en: 'Circumambulate the fire (parikrama) at least 7 times — one for each chakra.', hi: 'अग्नि की कम से कम सात बार परिक्रमा करें — प्रत्येक चक्र के लिए एक।' } },
      { text: { en: 'Offer roasted grains, coconut, and one item representing what you want to release.', hi: 'भुने हुए धान्य, नारियल, एवं जिसका त्याग करना है उसका प्रतीक एक वस्तु अर्पित करें।' } },
      { text: { en: 'Recite Narasimha mantra — Prahlada-Holika story\'s deity.', hi: 'नरसिंह मन्त्र का पाठ करें — प्रह्लाद-होलिका कथा के देवता।' } },
    ],
    donts: [
      { text: { en: 'Do not light the fire during the Bhadra time window — explicitly inauspicious.', hi: 'भद्रा काल में अग्नि न जलाएँ — स्पष्टतया अशुभ।' } },
      { text: { en: 'Avoid lighting a fire larger than necessary — environmental + safety concerns.', hi: 'आवश्यकता से अधिक बड़ी अग्नि न जलाएँ — पर्यावरण एवं सुरक्षा सम्बन्धी चिन्ता।' } },
      { text: { en: 'Do not stand directly downwind of the fire — smoke is harmful for lungs.', hi: 'अग्नि की धुएँ की दिशा में सीधे न खड़े हों — फेफड़ों के लिए हानिकारक।' } },
      { text: { en: 'Do not skip morning bath next day before playing Holi.', hi: 'अगले दिन होली खेलने से पूर्व प्रातः स्नान न छोड़ें।' } },
    ],
  },

  'hartalika-teej': {
    dos: [
      { text: { en: 'Observe a strict nirjala (waterless) fast from sunrise to next morning.', hi: 'सूर्योदय से अगले दिन प्रातः तक कठोर निर्जला व्रत रखें।' } },
      { text: { en: 'Perform Parvati-Shiva puja with sand idols — the festival\'s defining ritual.', hi: 'रेत की मूर्तियों के साथ पार्वती-शिव पूजन करें — पर्व की परिभाषक विधि।' } },
      { text: { en: 'Apply mehndi the previous evening — preparation tradition.', hi: 'पिछली सायं को मेहन्दी लगाएँ — तैयारी की परम्परा।' } },
      { text: { en: 'Wear green/red bangles, sindoor, and traditional attire.', hi: 'हरी/लाल चूड़ियाँ, सिन्दूर, एवं परम्परागत वस्त्र पहनें।' } },
    ],
    donts: [
      { text: { en: 'Do not drink water during the fast — even a drop traditionally invalidates it.', hi: 'व्रत के दौरान जल न पीयें — एक बूँद भी परम्परा से व्रत भङ्ग करती है।' } },
      { text: { en: 'Do not sleep during daytime — keeps the fast\'s discipline intact.', hi: 'दिन में न सोएँ — व्रत के अनुशासन को अक्षुण्ण रखता है।' } },
      { text: { en: 'Avoid quarrels with husband or in-laws — the festival is about marital harmony.', hi: 'पति अथवा ससुराल वालों से विवाद न करें — पर्व वैवाहिक समरसता का है।' } },
      { text: { en: 'Do not break the fast before the prescribed time the next morning.', hi: 'अगले प्रातः निर्धारित समय से पूर्व व्रत न तोड़ें।' } },
    ],
  },

  'chhath-puja': {
    dos: [
      { text: { en: 'Maintain ritual purity for all four days — clean water for cooking, fresh clothes.', hi: 'चारों दिन कर्मकाण्डीय शुद्धता रखें — खाना पकाने के लिए स्वच्छ जल, ताज़े वस्त्र।' } },
      { text: { en: 'Offer arghya (water) to the setting sun on day 3 (Sandhya Arghya).', hi: 'तीसरे दिन (सन्ध्या अर्घ्य) में अस्ताचलगामी सूर्य को अर्घ्य अर्पित करें।' } },
      { text: { en: 'Offer arghya to the rising sun on day 4 (Usha Arghya) — concludes the puja.', hi: 'चौथे दिन (उषा अर्घ्य) में उदीयमान सूर्य को अर्घ्य अर्पित करें — पूजा का समापन।' } },
      { text: { en: 'Prepare thekua (jaggery + flour sweet) as the chief prasad.', hi: 'मुख्य प्रसाद के रूप में ठेकुआ (गुड़ + आटे की मिठाई) तैयार करें।' } },
    ],
    donts: [
      { text: { en: 'Do not allow non-fasting people to touch the prasad before offering.', hi: 'अर्पण से पूर्व अव्रती लोगों को प्रसाद स्पर्श न करने दें।' } },
      { text: { en: 'Do not use onion, garlic, or any tamasic ingredient in the prasad.', hi: 'प्रसाद में प्याज, लहसुन, अथवा कोई तामसिक सामग्री का प्रयोग न करें।' } },
      { text: { en: 'Avoid wearing stitched clothing for the actual ghat rituals (saree/dhoti only).', hi: 'घाट विधि के लिए सिले हुए वस्त्र न पहनें (केवल साड़ी/धोती)।' } },
      { text: { en: 'Do not break the fast before the Usha Arghya on day 4.', hi: 'चौथे दिन उषा अर्घ्य से पूर्व व्रत न तोड़ें।' } },
    ],
  },

  'makar-sankranti': {
    dos: [
      { text: { en: 'Take a bath in a river/holy water at sunrise (or river-mixed water at home).', hi: 'सूर्योदय के समय नदी/पुण्य जल में स्नान करें (अथवा घर पर नदी जल मिश्रित जल से)।' } },
      { text: { en: 'Donate sesame seeds (til) and jaggery (gud) — the festival\'s signature donation.', hi: 'तिल एवं गुड़ का दान करें — पर्व का प्रतीक दान।' } },
      { text: { en: 'Eat khichdi, til-laddu, and other sesame/jaggery preparations.', hi: 'खिचड़ी, तिल-लड्डू, एवं अन्य तिल/गुड़ निर्मित व्यञ्जन का सेवन करें।' } },
      { text: { en: 'Perform Surya puja at sunrise — Sun is the festival\'s primary deity.', hi: 'सूर्योदय के समय सूर्य पूजन करें — सूर्य पर्व के प्रमुख देवता हैं।' } },
    ],
    donts: [
      { text: { en: 'Do not refuse to give til-gud to anyone who asks — it brings bad luck.', hi: 'तिल-गुड़ माँगने वाले को मना न करें — अशुभकर माना गया है।' } },
      { text: { en: 'Avoid heavy or oily food at night — keep the day\'s diet light and sattvic.', hi: 'रात्रि भारी अथवा तैलीय भोजन न करें — दिन भर का आहार हल्का एवं सात्विक रखें।' } },
      { text: { en: 'Do not cut hair, nails, or shave today.', hi: 'आज बाल, नाख़ून न काटें न दाढ़ी बनाएँ।' } },
      { text: { en: 'Do not engage in major financial loans or contracts today.', hi: 'आज बड़े आर्थिक ऋण अथवा संविदा में संलग्न न हों।' } },
    ],
  },
};
