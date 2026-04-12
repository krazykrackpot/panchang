'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ── Bilingual labels ─────────────────────────────────────────────── */
const L = {
  badge: { en: 'Reference', hi: 'सन्दर्भ' },
  title: {
    en: 'Why Exactly 7 Days in a Week?',
    hi: 'सप्ताह में ठीक 7 दिन क्यों?',
    ta: 'ஏன் ஒரு வாரத்தில் சரியாக 7 நாட்கள்?',
  },
  titleSub: {
    en: 'And Why Does Tuesday Follow Monday? The Answer Is Over 2,000 Years Old.',
    hi: 'और मंगलवार सोमवार के बाद क्यों? उत्तर 2,000 वर्ष से अधिक पुराना है।',
  },
  intro: {
    en: 'Have you ever wondered why there are exactly 7 days in the week — not 5, not 10, not 12? Why does Tuesday follow Monday and not, say, Thursday? And why do completely unrelated cultures — Indian, Roman, Norse, Japanese — all name their days after the same 7 planets in the same sequence? The answer is one of the most elegant pieces of mathematics in human history, and it comes from ancient India. It starts with a word: "Hora" — derived from the Sanskrit "Ahoratra" (अहोरात्र), meaning "day + night" (Aho = day, Ratra = night). This Sanskrit word likely traveled to Greece as "Hora" (ὥρα), then to Latin, and eventually became the English "Hour". The very concept of an hour may have Indian origins. The Surya Siddhanta (Ch. 12) defines 24 Horas in one Ahoratra. Varahamihira confirms in Brihat Samhita (Ch. 2): "The lord of the first hora of each day gives that day its name." The Arthashastra of Kautilya (~300 BCE) already references the 7-day week with planetary names — centuries before it appeared in Roman records.',
    hi: 'क्या आपने कभी सोचा है कि सप्ताह में ठीक 7 दिन क्यों हैं — 5 क्यों नहीं, 10 क्यों नहीं? मंगलवार सोमवार के बाद क्यों आता है, बृहस्पतिवार क्यों नहीं? और पूरी तरह असम्बन्धित संस्कृतियाँ — भारतीय, रोमन, नॉर्स, जापानी — सब अपने दिनों के नाम उन्हीं 7 ग्रहों पर उसी क्रम में क्यों रखती हैं? उत्तर मानव इतिहास का सबसे सुन्दर गणित है, और यह प्राचीन भारत से आता है। यह एक शब्द से शुरू होता है: "होरा" — संस्कृत "अहोरात्र" (अहो = दिन + रात्र = रात) से व्युत्पन्न। यह संस्कृत शब्द सम्भवतः ग्रीस में "ὥρα" (होरा), फिर लैटिन, और अन्ततः अंग्रेज़ी "Hour" बना। घण्टे की अवधारणा ही भारतीय मूल की हो सकती है। सूर्य सिद्धान्त (अ.12) एक अहोरात्र में 24 होरा परिभाषित करता है। वराहमिहिर बृहत् संहिता (अ.2) में पुष्टि करते हैं: "प्रत्येक दिन की पहली होरा का स्वामी उस दिन को अपना नाम देता है।" कौटिल्य का अर्थशास्त्र (~300 ई.पू.) पहले से ग्रह नामों वाले 7-दिवसीय सप्ताह का उल्लेख करता है — रोमन अभिलेखों से सदियों पहले।',
  },

  /* Section 1 */
  s1Title: {
    en: 'The Speed of Planets — Why 7 and Not 9?',
    hi: 'ग्रहों की गति — 7 क्यों, 9 क्यों नहीं?',
  },
  s1p1: {
    en: 'Ancient Indian astronomers observed 7 celestial bodies moving against the fixed stars. They ranked them by how fast each traverses the zodiac — the basis of all hora timekeeping. The Surya Siddhanta (Ch. 12, earliest layers ~400 CE, encoding much older knowledge) lists precise mean motions. The Aryabhatiya (Aryabhata, 499 CE) computes orbital periods to remarkable accuracy. The Yajnavalkya Smriti prescribes hora-based muhurta timing for rituals. The Romaka Siddhanta documents the transmission of this Indian astronomical framework to Alexandria and the wider Mediterranean world.',
    hi: 'प्राचीन भारतीय खगोलविदों ने तारों के विरुद्ध चलते 7 खगोलीय पिण्ड देखे। उन्होंने प्रत्येक की राशिचक्र गति से क्रमबद्ध किया — सम्पूर्ण होरा काल-गणना का आधार। सूर्य सिद्धान्त (अ.12) माध्य गतियाँ सूचीबद्ध करता है। आर्यभटीय (499 ई.) असाधारण परिशुद्धता से कक्षीय काल गणना करता है। याज्ञवल्क्य स्मृति होरा-आधारित मुहूर्त काल निर्धारित करती है। रोमक सिद्धान्त इस भारतीय खगोलीय ढाँचे के अलेक्ज़ान्ड्रिया और भूमध्यसागरीय विश्व तक संचरण का दस्तावेज़ीकरण करता है।',
  },
  s1p2: {
    en: 'The seven Grahas visible to the naked eye are: Sun (Surya), Moon (Chandra), Mars (Mangala), Mercury (Budha), Jupiter (Brihaspati), Venus (Shukra), and Saturn (Shani). These are the seven that constitute the Chaldean order and give their names to the seven days of the week.',
    hi: 'नग्न नेत्र से दृश्य सात ग्रह हैं: सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र और शनि। ये सात ही कैल्डियन क्रम का निर्माण करते हैं और सप्ताह के सात दिनों को अपने नाम देते हैं।',
  },
  s1p3: {
    en: 'Rahu and Ketu — the ascending and descending lunar nodes — are the 8th and 9th Grahas in the Indian Navagraha system. They are not physical bodies but mathematical points where the Moon\'s orbital plane intersects the ecliptic. Their ~18.6-year nodal cycle governs eclipse timing with remarkable precision, a contribution unique to Indian astronomy. No other ancient culture incorporated the lunar nodes as named "planets" with this level of sophistication.',
    hi: 'राहु और केतु — आरोही और अवरोही चंद्र पात — भारतीय नवग्रह पद्धति में 8वें और 9वें ग्रह हैं। ये भौतिक पिण्ड नहीं बल्कि गणितीय बिन्दु हैं जहाँ चंद्रमा की कक्षीय तल क्रान्तिवृत्त को काटती है। उनका ~18.6 वर्षीय पात चक्र ग्रहण के समय को असाधारण परिशुद्धता से नियंत्रित करता है।',
  },

  /* Section 2 */
  s2Title: {
    en: 'The Speed Ranking — Slowest to Fastest',
    hi: 'गति क्रम — सबसे धीमे से सबसे तेज़',
  },
  s2p1: {
    en: 'Ancient astronomers observed how long each planet takes to complete one full circuit of the zodiac. The planet that takes the longest appears to move slowest against the fixed stars; the one that takes the least time appears fastest. This is the Chaldean order:',
    hi: 'प्राचीन खगोलशास्त्रियों ने देखा कि प्रत्येक ग्रह राशिचक्र का एक पूर्ण परिक्रमा पूरी करने में कितना समय लेता है। जो ग्रह सबसे अधिक समय लेता है वह स्थिर तारों के सापेक्ष सबसे धीमा दिखता है; जो सबसे कम समय लेता है वह सबसे तेज़। यही कैल्डियन क्रम है:',
  },
  s2note: {
    en: 'This order — Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon — is called the "Chaldean order" because Western historians first documented it through Babylonian (Chaldean) sources. But the astronomical knowledge underlying it was developed independently and in greater depth in India, where it predates the Babylonian attribution by centuries.',
    hi: 'इस क्रम को — शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चन्द्र — "कैल्डियन क्रम" कहा जाता है क्योंकि पश्चिमी इतिहासकारों ने इसे पहले बेबीलोनियाई (कैल्डियन) स्रोतों के माध्यम से प्रलेखित किया। किन्तु इसके अन्तर्गत खगोलीय ज्ञान भारत में स्वतन्त्र रूप से और अधिक गहराई से विकसित हुआ।',
  },

  /* Section 3 */
  s3Title: {
    en: 'How the Hora System Works',
    hi: 'होरा पद्धति कैसे काम करती है',
  },
  s3p1: {
    en: 'A Hora (होरा) is one twenty-fourth of the day measured from sunrise to the next sunrise. Each of the 24 horas is ruled by one of the seven planets, cycling through the Chaldean order continuously. The first hora of each day belongs to that day\'s ruling planet.',
    hi: 'होरा एक दिन (एक सूर्योदय से अगले सूर्योदय तक) का चौबीसवाँ भाग है। 24 होराओं में से प्रत्येक पर कैल्डियन क्रम में एक ग्रह का शासन होता है। प्रत्येक दिन की पहली होरा उस दिन के स्वामी ग्रह की होती है।',
  },
  s3p2: {
    en: 'KEY MATHEMATICAL INSIGHT: After 24 horas, the sequence has advanced by 24 positions. Since 24 = 3 × 7 + 3, the 25th hora (which is the first hora of the NEXT day) falls 3 positions ahead in the Chaldean order. This "jump of 3" applied repeatedly to the Chaldean sequence generates exactly the order of the weekdays. This is NOT a coincidence — the 7-day week with these specific day-planet assignments is a direct mathematical consequence of the hora system.',
    hi: 'मुख्य गणितीय अन्तर्दृष्टि: 24 होराओं के बाद अनुक्रम 24 स्थान आगे बढ़ा है। चूँकि 24 = 3 × 7 + 3, इसलिए 25वीं होरा (= अगले दिन की पहली होरा) कैल्डियन क्रम में 3 स्थान आगे पड़ती है। इस "3 की छलाँग" को बार-बार लागू करने से ठीक सप्ताह के दिनों का क्रम मिलता है। यह संयोग नहीं है — इन विशेष ग्रह नियुक्तियों वाला 7-दिवसीय सप्ताह होरा पद्धति का प्रत्यक्ष गणितीय परिणाम है।',
  },
  s3weekLabel: {
    en: 'How each day\'s first hora determines the next day:',
    hi: 'प्रत्येक दिन की पहली होरा अगले दिन को कैसे निर्धारित करती है:',
  },

  /* Section 4 */
  s4Title: {
    en: 'From India to the World — The Weekday Names',
    hi: 'भारत से विश्व तक — सप्ताह के दिनों के नाम',
  },
  s4p1: {
    en: 'The Sanskrit names for the days of the week directly use planet names followed by "vara" (वार, meaning "day"). English day names use Norse and Germanic gods — but these gods were explicitly mapped to the same planets by early medieval Europeans. The underlying planetary assignment is identical across every culture, because they all derive from the same hora system.',
    hi: 'सप्ताह के दिनों के संस्कृत नाम सीधे ग्रह नामों के बाद "वार" (दिन) लगाकर बनते हैं। अंग्रेज़ी नाम नॉर्स और जर्मनिक देवताओं का उपयोग करते हैं — किन्तु इन देवताओं को प्रारम्भिक मध्यकालीन यूरोपीयों ने स्पष्ट रूप से उन्हीं ग्रहों से जोड़ा था। सभी संस्कृतियों में अन्तर्निहित ग्रह नियुक्ति समान है, क्योंकि सभी उसी होरा पद्धति से उत्पन्न हैं।',
  },
  s4p2: {
    en: 'Tuesday = Tyr\'s day (Norse war god = Mars). Wednesday = Woden\'s day (Odin = Mercury). Thursday = Thor\'s day (thunder god = Jupiter). Friday = Freya\'s day (goddess of love = Venus). The correspondence is direct and intentional — medieval European scholars were fully aware they were mapping their gods to the Roman planetary week.',
    hi: 'Tuesday = Tyr का दिन (नॉर्स युद्ध देवता = मंगल)। Wednesday = Woden का दिन (ओडिन = बुध)। Thursday = Thor का दिन (वज्र देवता = गुरु)। Friday = Freya का दिन (प्रेम देवी = शुक्र)। यह पत्राचार प्रत्यक्ष और जानबूझकर था।',
  },

  /* Section 5 */
  s5Title: {
    en: 'The Hora in Daily Practice',
    hi: 'दैनिक अभ्यास में होरा',
  },
  s5p1: {
    en: 'Hora is still used daily in Vedic astrology for Muhurta (electional timing). Choosing the right hora for an activity significantly strengthens the quality of that action according to classical texts. The hora system is one of the fastest and most practical tools in the Jyotishi\'s toolkit.',
    hi: 'होरा का उपयोग आज भी वैदिक ज्योतिष में मुहूर्त (इष्ट समय निर्धारण) के लिए प्रतिदिन किया जाता है। किसी गतिविधि के लिए सही होरा चुनना शास्त्रीय ग्रन्थों के अनुसार उस कार्य की गुणवत्ता को महत्वपूर्ण रूप से बढ़ाता है।',
  },

  /* Section 6 */
  s6Title: {
    en: 'Rahu & Ketu — India\'s Unique Addition',
    hi: 'राहु और केतु — भारत का अद्वितीय योगदान',
  },
  s6p1: {
    en: 'The seven Chaldean planets are shared across ancient cultures — Babylonian, Greek, Roman, Indian. But India\'s unique contribution is the elevation of Rahu (the ascending lunar node) and Ketu (the descending lunar node) to the status of full Grahas — the 8th and 9th members of the Navagraha system.',
    hi: 'सात कैल्डियन ग्रह प्राचीन संस्कृतियों — बेबीलोनियाई, यूनानी, रोमन, भारतीय — में समान हैं। किन्तु भारत का अद्वितीय योगदान राहु (आरोही चंद्र पात) और केतु (अवरोही चंद्र पात) को पूर्ण ग्रह की स्थिति में उठाना है — नवग्रह पद्धति के 8वें और 9वें सदस्य।',
  },
  s6p2: {
    en: 'Rahu and Ketu are the points where the Moon\'s orbital plane crosses the Sun\'s apparent path (the ecliptic). An eclipse can ONLY occur when the Moon is near one of these nodes at the time of a new or full Moon. The ~18.6-year Saros-like nodal cycle that Indian astronomers tracked with precision is what makes eclipse prediction possible. No other ancient culture developed such a systematic mathematical treatment of the lunar nodes.',
    hi: 'राहु और केतु वे बिन्दु हैं जहाँ चंद्रमा की कक्षीय तल सूर्य के आभासी पथ (क्रान्तिवृत्त) को काटती है। ग्रहण तभी हो सकता है जब नई या पूर्णिमा के समय चंद्रमा इन पातों के निकट हो। ~18.6 वर्षीय पात चक्र जिसे भारतीय खगोलशास्त्रियों ने परिशुद्धता से ट्रैक किया, ग्रहण भविष्यवाणी को सम्भव बनाता है।',
  },
  s6p3: {
    en: 'Rahu Kaal — the inauspicious daily period ruled by Rahu — is calculated from a modified hora sequence applied to the weekday. Each weekday has a fixed Rahu Kaal slot (e.g., Monday 7:30–9:00 AM, Tuesday 3:00–4:30 PM in a standard 12-hour day). This shows how deeply the hora system and the node system are integrated in Indian timekeeping.',
    hi: 'राहु काल — राहु द्वारा शासित दैनिक अशुभ अवधि — सप्ताह के दिन पर लागू एक संशोधित होरा अनुक्रम से गणना की जाती है। प्रत्येक सप्ताह के दिन में एक निश्चित राहु काल खण्ड होता है (जैसे सोमवार 7:30-9:00 बजे, मंगलवार 3:00-4:30 बजे मानक 12 घंटे के दिन में)।',
  },

  /* Section 7: Classical Sources */
  s7Title: {
    en: 'Classical Sources — The Texts That Built This System',
    hi: 'शास्त्रीय स्रोत — जिन ग्रन्थों ने यह पद्धति बनाई',
  },
  srcSurya: {
    en: 'Surya Siddhanta (Ch. 12, "Bhugola-adhyaya") — The foundational Indian astronomical treatise. Chapter 12 defines the hora system explicitly: "The lord of the first hora of the day gives the day its name" (दिनस्य प्रथमहोराधिपतिः तद्दिनस्य नामकारणम्). It provides precise mean daily motions for all 7 planets: Sun = 0°59\'8", Moon = 13°10\'35", Mars = 0°31\'26", Mercury = 4°5\'32", Jupiter = 0°4\'59", Venus = 1°36\'8", Saturn = 0°2\'0". These motions directly establish the speed ranking that generates the Chaldean order. The text also defines the 24-hora division of the Ahoratra and prescribes hora-based activity timing.',
    hi: 'सूर्य सिद्धान्त (अ.12, "भूगोलाध्याय") — मूलभूत भारतीय खगोलीय ग्रन्थ। अध्याय 12 होरा पद्धति को स्पष्ट रूप से परिभाषित करता है: "दिन की प्रथम होरा का अधिपति उस दिन को अपना नाम देता है।" यह सभी 7 ग्रहों की सटीक माध्य दैनिक गतियाँ प्रदान करता है: सूर्य = 0°59\'8", चन्द्र = 13°10\'35", मंगल = 0°31\'26", बुध = 4°5\'32", गुरु = 0°4\'59", शुक्र = 1°36\'8", शनि = 0°2\'0"। ये गतियाँ सीधे गति क्रम स्थापित करती हैं।',
  },
  srcAryabhata: {
    en: 'Aryabhatiya (Aryabhata, 499 CE) — Perhaps the most revolutionary Indian astronomical work. In the "Kalakriya-pada" (time reckoning section), Aryabhata provides: (1) The sidereal year = 365 days 6 hours 12 minutes 30 seconds — accurate to within 3 minutes of the modern value. (2) The sidereal rotation periods of all planets computed from first principles, not just observed tables. (3) A heliocentric hint: Aryabhata states the Earth rotates on its axis (not the sky rotating around Earth), which was 1,000 years ahead of Copernicus. (4) The kshaya (duration loss) concept for tithis — directly connected to the variable hora lengths used at higher latitudes. His orbital period calculations confirm the Chaldean speed ranking with mathematical rigour that Babylonian astronomy never achieved.',
    hi: 'आर्यभटीय (आर्यभट, 499 ई.) — सम्भवतः सबसे क्रान्तिकारी भारतीय खगोलीय कृति। "कालक्रियापाद" में आर्यभट प्रदान करते हैं: (1) नाक्षत्र वर्ष = 365 दिन 6 घण्टे 12 मिनट 30 सेकण्ड — आधुनिक मान से 3 मिनट भीतर सटीक। (2) सभी ग्रहों की नाक्षत्र घूर्णन अवधि मूल सिद्धान्तों से गणित, केवल प्रेक्षित तालिकाओं से नहीं। (3) सूर्यकेन्द्री संकेत: आर्यभट कहते हैं कि पृथ्वी अपनी धुरी पर घूमती है — कॉपर्निकस से 1,000 वर्ष पहले। (4) तिथि क्षय अवधारणा — उच्च अक्षांशों पर प्रयुक्त परिवर्तनीय होरा अवधि से सीधे जुड़ी। उनकी कक्षीय अवधि गणनाएँ कैल्डियन गति क्रम की गणितीय कठोरता से पुष्टि करती हैं।',
  },
  srcBrihat: {
    en: 'Brihat Samhita (Varahamihira, ~505 CE, Ch. 2) — The encyclopaedic work on mundane astrology. Chapter 2 ("Adityachara") explicitly states: "प्रथमहोराधिपो दिनेशः" — "The lord of the first hora is the lord of the day." Varahamihira provides the complete hora table for all 7 days and connects hora to muhurta timing for royal activities, military campaigns, and construction. He also documents the 7-day week as an established, universally accepted system — evidence that it was already ancient by the 6th century CE.',
    hi: 'बृहत् संहिता (वराहमिहिर, ~505 ई., अ.2) — मुण्डन ज्योतिष पर विश्वकोशीय कृति। अध्याय 2 ("आदित्यचार") स्पष्ट रूप से कहता है: "प्रथमहोराधिपो दिनेशः" — "प्रथम होरा का अधिपति दिन का स्वामी है।" वराहमिहिर सभी 7 दिनों की पूर्ण होरा तालिका प्रदान करते हैं और होरा को राजकीय, सैन्य और निर्माण कार्यों के मुहूर्त से जोड़ते हैं। वे 7-दिवसीय सप्ताह को एक स्थापित, सर्वमान्य पद्धति के रूप में प्रलेखित करते हैं — प्रमाण कि यह 6वीं शताब्दी तक पहले से प्राचीन थी।',
  },
  srcArthashastra: {
    en: 'Arthashastra (Kautilya, ~300 BCE) — The treatise on statecraft and governance. References the 7-day week with planet-based day names in the context of scheduling royal duties and tax collection cycles. This is among the earliest datable references to the planetary week — centuries before the Roman adoption of the 7-day week (which occurred only around 1st century CE). Kautilya\'s text proves the system was already established in India by at least the 4th century BCE.',
    hi: 'अर्थशास्त्र (कौटिल्य, ~300 ई.पू.) — राजनीति और शासन पर ग्रन्थ। राजकीय कर्तव्यों और कर संग्रह चक्रों के सन्दर्भ में ग्रह-आधारित दिन नामों वाले 7-दिवसीय सप्ताह का उल्लेख करता है। यह ग्रह सप्ताह का सबसे पुराना दिनांकित सन्दर्भों में से एक है — रोमन 7-दिवसीय सप्ताह अपनाने (जो केवल ~1वीं शताब्दी ई. में हुआ) से सदियों पहले।',
  },
  srcYajnavalkya: {
    en: 'Yajnavalkya Smriti (Ch. 1, "Achara-adhyaya") — The dharmic law code prescribes hora-based timing for Vedic rituals: "शुभकर्मसु शुभहोरा ग्राह्या" — "For auspicious deeds, choose an auspicious hora." It codifies the principle that the planetary ruler of the current hora influences the outcome of activities initiated during that period — the foundation of electional astrology (muhurta) that is still practiced daily.',
    hi: 'याज्ञवल्क्य स्मृति (अ.1, "आचाराध्याय") — धर्मशास्त्रीय विधि संहिता वैदिक कर्मकाण्ड हेतु होरा-आधारित समय निर्धारित करती है: "शुभकर्मसु शुभहोरा ग्राह्या" — "शुभ कार्यों के लिए शुभ होरा चुनें।" यह सिद्धान्त संहिताबद्ध करती है कि वर्तमान होरा का ग्रह शासक उस अवधि में आरम्भ किए कार्यों के परिणाम को प्रभावित करता है — मुहूर्त ज्योतिष की नींव जो आज भी प्रतिदिन प्रचलित है।',
  },
  srcRomaka: {
    en: 'Romaka Siddhanta — Documents the transmission route of Indian astronomical knowledge westward. "Romaka" literally means "Roman" — this text acknowledges the exchange between Indian and Mediterranean astronomical traditions. The planetary week, hora system, and precise orbital calculations traveled from India to Alexandria (Egypt), and from there to the Roman Empire, eventually becoming the universal calendar system we use today.',
    hi: 'रोमक सिद्धान्त — भारतीय खगोलीय ज्ञान के पश्चिम की ओर संचरण मार्ग का दस्तावेज़। "रोमक" का शाब्दिक अर्थ "रोमन" है — यह ग्रन्थ भारतीय और भूमध्यसागरीय खगोलीय परम्पराओं के बीच आदान-प्रदान को स्वीकार करता है। ग्रह सप्ताह, होरा पद्धति और सटीक कक्षीय गणनाएँ भारत से अलेक्ज़ान्ड्रिया (मिस्र) और वहाँ से रोमन साम्राज्य तक पहुँचीं।',
  },

  /* Related */
  related: { en: 'Explore Further', hi: 'और जानें' },
};

/* ── Planet speed data ────────────────────────────────────────────── */
const SPEED_TABLE = [
  {
    rank: 1, label: { en: 'Slowest', hi: 'सबसे धीमा' },
    planet: { en: 'Saturn', hi: 'शनि' },
    period: { en: '29.46 years', hi: '29.46 वर्ष' },
    note: { en: 'Takes longest to traverse the entire zodiac', hi: 'राशिचक्र पूरा करने में सबसे अधिक समय' },
    color: '#60a5fa', border: 'border-blue-500/30', bg: 'bg-blue-500/8',
  },
  {
    rank: 2, label: { en: '', hi: '' },
    planet: { en: 'Jupiter', hi: 'बृहस्पति' },
    period: { en: '11.86 years', hi: '11.86 वर्ष' },
    note: { en: 'Completes ~2.4 circuits in Saturn\'s one orbit', hi: 'शनि के एक चक्र में ~2.4 परिक्रमाएँ' },
    color: '#facc15', border: 'border-yellow-500/30', bg: 'bg-yellow-500/8',
  },
  {
    rank: 3, label: { en: '', hi: '' },
    planet: { en: 'Mars', hi: 'मंगल' },
    period: { en: '1.88 years', hi: '1.88 वर्ष' },
    note: { en: 'Completes ~2 years per zodiac circuit', hi: 'राशिचक्र में ~2 वर्ष प्रति परिक्रमा' },
    color: '#ef4444', border: 'border-red-500/30', bg: 'bg-red-500/8',
  },
  {
    rank: 4, label: { en: '', hi: '' },
    planet: { en: 'Sun', hi: 'सूर्य' },
    period: { en: '1 year', hi: '1 वर्ष' },
    note: { en: 'Earth\'s orbit defines the tropical year', hi: 'पृथ्वी की कक्षा उष्णकटिबंधीय वर्ष परिभाषित करती है' },
    color: '#f59e0b', border: 'border-amber-500/30', bg: 'bg-amber-500/8',
  },
  {
    rank: 5, label: { en: '', hi: '' },
    planet: { en: 'Venus', hi: 'शुक्र' },
    period: { en: '224.7 days', hi: '224.7 दिन' },
    note: { en: 'Completes ~1.6 orbits per Earth year', hi: 'प्रति पृथ्वी वर्ष ~1.6 कक्षाएँ' },
    color: '#f472b6', border: 'border-pink-500/30', bg: 'bg-pink-500/8',
  },
  {
    rank: 6, label: { en: '', hi: '' },
    planet: { en: 'Mercury', hi: 'बुध' },
    period: { en: '87.97 days', hi: '87.97 दिन' },
    note: { en: 'Fastest of the classical planets; ~4 orbits per year', hi: 'शास्त्रीय ग्रहों में सबसे तेज़; ~4 कक्षाएँ प्रति वर्ष' },
    color: '#4ade80', border: 'border-emerald-500/30', bg: 'bg-emerald-500/8',
  },
  {
    rank: 7, label: { en: 'Fastest', hi: 'सबसे तेज़' },
    planet: { en: 'Moon', hi: 'चन्द्र' },
    period: { en: '27.32 days', hi: '27.32 दिन' },
    note: { en: 'Completes one orbit in under a month', hi: 'एक महीने से कम में एक कक्षा पूरी करता है' },
    color: '#94a3b8', border: 'border-slate-400/30', bg: 'bg-slate-400/8',
  },
];

/* ── Hora → weekday derivation ────────────────────────────────────── */
const WEEKDAY_DERIVATION = [
  {
    day: { en: 'Saturday', hi: 'शनिवार' },
    lord: { en: 'Saturn', hi: 'शनि' },
    color: '#60a5fa',
    hora25: { en: 'Sun', hi: 'सूर्य' },
    next: { en: 'Sunday', hi: 'रविवार' },
    nextColor: '#f59e0b',
  },
  {
    day: { en: 'Sunday', hi: 'रविवार' },
    lord: { en: 'Sun', hi: 'सूर्य' },
    color: '#f59e0b',
    hora25: { en: 'Moon', hi: 'चन्द्र' },
    next: { en: 'Monday', hi: 'सोमवार' },
    nextColor: '#94a3b8',
  },
  {
    day: { en: 'Monday', hi: 'सोमवार' },
    lord: { en: 'Moon', hi: 'चन्द्र' },
    color: '#94a3b8',
    hora25: { en: 'Mars', hi: 'मंगल' },
    next: { en: 'Tuesday', hi: 'मंगलवार' },
    nextColor: '#ef4444',
  },
  {
    day: { en: 'Tuesday', hi: 'मंगलवार' },
    lord: { en: 'Mars', hi: 'मंगल' },
    color: '#ef4444',
    hora25: { en: 'Mercury', hi: 'बुध' },
    next: { en: 'Wednesday', hi: 'बुधवार' },
    nextColor: '#4ade80',
  },
  {
    day: { en: 'Wednesday', hi: 'बुधवार' },
    lord: { en: 'Mercury', hi: 'बुध' },
    color: '#4ade80',
    hora25: { en: 'Jupiter', hi: 'गुरु' },
    next: { en: 'Thursday', hi: 'गुरुवार' },
    nextColor: '#facc15',
  },
  {
    day: { en: 'Thursday', hi: 'गुरुवार' },
    lord: { en: 'Jupiter', hi: 'गुरु' },
    color: '#facc15',
    hora25: { en: 'Venus', hi: 'शुक्र' },
    next: { en: 'Friday', hi: 'शुक्रवार' },
    nextColor: '#f472b6',
  },
  {
    day: { en: 'Friday', hi: 'शुक्रवार' },
    lord: { en: 'Venus', hi: 'शुक्र' },
    color: '#f472b6',
    hora25: { en: 'Saturn', hi: 'शनि' },
    next: { en: 'Saturday', hi: 'शनिवार' },
    nextColor: '#60a5fa',
  },
];

/* ── Weekday names comparison ─────────────────────────────────────── */
const WEEKDAYS = [
  {
    num: 1,
    sanskrit: 'Ravivara', hi: 'रविवार', en: 'Sunday', latin: 'Dies Solis',
    planet: { en: 'Sun', hi: 'सूर्य' }, color: '#f59e0b',
    norse: { en: '(Sun\'s day)', hi: '(सूर्य का दिन)' },
  },
  {
    num: 2,
    sanskrit: 'Somavara', hi: 'सोमवार', en: 'Monday', latin: 'Dies Lunae',
    planet: { en: 'Moon', hi: 'चन्द्र' }, color: '#94a3b8',
    norse: { en: '(Moon\'s day)', hi: '(चंद्र का दिन)' },
  },
  {
    num: 3,
    sanskrit: 'Mangalavara', hi: 'मंगलवार', en: 'Tuesday', latin: 'Dies Martis',
    planet: { en: 'Mars', hi: 'मंगल' }, color: '#ef4444',
    norse: { en: '(Tyr\'s day = Mars)', hi: '(Tyr = मंगल)' },
  },
  {
    num: 4,
    sanskrit: 'Budhavara', hi: 'बुधवार', en: 'Wednesday', latin: 'Dies Mercurii',
    planet: { en: 'Mercury', hi: 'बुध' }, color: '#4ade80',
    norse: { en: '(Woden\'s day = Mercury)', hi: '(Woden = बुध)' },
  },
  {
    num: 5,
    sanskrit: 'Brihaspativara', hi: 'बृहस्पतिवार / गुरुवार', en: 'Thursday', latin: 'Dies Jovis',
    planet: { en: 'Jupiter', hi: 'बृहस्पति' }, color: '#facc15',
    norse: { en: '(Thor\'s day = Jupiter)', hi: '(Thor = बृहस्पति)' },
  },
  {
    num: 6,
    sanskrit: 'Shukravara', hi: 'शुक्रवार', en: 'Friday', latin: 'Dies Veneris',
    planet: { en: 'Venus', hi: 'शुक्र' }, color: '#f472b6',
    norse: { en: '(Freya\'s day = Venus)', hi: '(Freya = शुक्र)' },
  },
  {
    num: 7,
    sanskrit: 'Shanivara', hi: 'शनिवार', en: 'Saturday', latin: 'Dies Saturni',
    planet: { en: 'Saturn', hi: 'शनि' }, color: '#60a5fa',
    norse: { en: '(Saturn\'s day)', hi: '(शनि का दिन)' },
  },
];

/* ── Hora practice data ───────────────────────────────────────────── */
const HORA_PRACTICE = [
  {
    planet: { en: 'Sun Hora', hi: 'सूर्य होरा' }, color: '#f59e0b', bg: 'bg-amber-500/8', border: 'border-amber-500/25',
    activities: {
      en: 'Authority, government work, meetings with officials, leadership tasks, father-related matters, self-expression and command',
      hi: 'अधिकार, सरकारी कार्य, अधिकारियों से मिलना, नेतृत्व, पिता सम्बन्धित, आत्म-अभिव्यक्ति',
    },
  },
  {
    planet: { en: 'Moon Hora', hi: 'चन्द्र होरा' }, color: '#94a3b8', bg: 'bg-slate-400/8', border: 'border-slate-400/25',
    activities: {
      en: 'Travel, emotional conversations, mother-related, public dealings, water work, starting creative projects',
      hi: 'यात्रा, भावनात्मक बातचीत, माता सम्बन्धित, सार्वजनिक व्यवहार, जल कार्य, रचनात्मक परियोजना',
    },
  },
  {
    planet: { en: 'Mars Hora', hi: 'मंगल होरा' }, color: '#ef4444', bg: 'bg-red-500/8', border: 'border-red-500/25',
    activities: {
      en: 'Surgery, property work, sports, engineering and machinery, military or police matters, unavoidable confrontation',
      hi: 'शल्यक्रिया, सम्पत्ति कार्य, खेल, यन्त्र-अभियान्त्रिकी, सेना/पुलिस, अपरिहार्य संघर्ष',
    },
  },
  {
    planet: { en: 'Mercury Hora', hi: 'बुध होरा' }, color: '#4ade80', bg: 'bg-emerald-500/8', border: 'border-emerald-500/25',
    activities: {
      en: 'Business deals, contract signing, communication, education, writing, accounting, banking, technology, short trips',
      hi: 'व्यापारिक सौदे, अनुबन्ध, संचार, शिक्षा, लेखन, लेखांकन, बैंकिंग, प्रौद्योगिकी, छोटी यात्रा',
    },
  },
  {
    planet: { en: 'Jupiter Hora', hi: 'गुरु होरा' }, color: '#facc15', bg: 'bg-yellow-500/8', border: 'border-yellow-500/25',
    activities: {
      en: 'Spiritual work, teaching, consulting advisors, charity, legal proceedings, religious ceremonies, financial expansion',
      hi: 'आध्यात्मिक कार्य, अध्यापन, सलाहकार परामर्श, दान, कानूनी कार्यवाही, धार्मिक अनुष्ठान, वित्त',
    },
  },
  {
    planet: { en: 'Venus Hora', hi: 'शुक्र होरा' }, color: '#f472b6', bg: 'bg-pink-500/8', border: 'border-pink-500/25',
    activities: {
      en: 'Romance, marriage-related, arts and music, buying luxury items, beauty treatments, fashion, jewelry purchase',
      hi: 'प्रेम-प्रणय, विवाह सम्बन्धित, कला-संगीत, विलासिता वस्तुएँ, सौन्दर्य उपचार, आभूषण',
    },
  },
  {
    planet: { en: 'Saturn Hora', hi: 'शनि होरा' }, color: '#60a5fa', bg: 'bg-blue-500/8', border: 'border-blue-500/25',
    activities: {
      en: 'Completing unfinished work, agriculture, iron/steel, deep meditation, dealing with laborers, mining, oil — AVOID starting new ventures',
      hi: 'अधूरा कार्य पूरा करें, कृषि, लोहा/इस्पात, गहन ध्यान, श्रमिकों से व्यवहार — नई शुरुआत से बचें',
    },
  },
];

/* ── Main Page ────────────────────────────────────────────────────── */
export default function HoraChaldeanPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const isDevanagari = isHi;
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const t = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto" style={bodyFont}>

      {/* ═══ Header ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="text-indigo-300 text-sm font-medium">{t(L.badge)}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t(L.title)}
        </h1>
        <p className="text-xl text-gold-light/70 mb-4" style={headingFont}>
          {t(L.titleSub)}
        </p>
        <p className="text-text-secondary max-w-3xl mx-auto text-base leading-relaxed">
          {t(L.intro)}
        </p>
      </motion.div>

      {/* ═══ Section 1: Indian Origin ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            1
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t(L.s1Title)}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t(L.s1p1)}</p>
          <p>{t(L.s1p2)}</p>

          {/* 7 Grahas visual row */}
          <div className="bg-black/20 border border-gold-primary/10 rounded-xl p-4 my-4">
            <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">
              {isHi ? 'सात दृश्य ग्रह (सप्तग्रह)' : 'The Seven Visible Grahas (Saptagraha)'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { en: 'Sun', hi: 'सूर्य', sa: 'Surya', color: '#f59e0b' },
                { en: 'Moon', hi: 'चन्द्र', sa: 'Chandra', color: '#94a3b8' },
                { en: 'Mars', hi: 'मंगल', sa: 'Mangala', color: '#ef4444' },
                { en: 'Mercury', hi: 'बुध', sa: 'Budha', color: '#4ade80' },
                { en: 'Jupiter', hi: 'बृहस्पति', sa: 'Brihaspati', color: '#facc15' },
                { en: 'Venus', hi: 'शुक्र', sa: 'Shukra', color: '#f472b6' },
                { en: 'Saturn', hi: 'शनि', sa: 'Shani', color: '#60a5fa' },
              ].map((g, i) => (
                <div key={i} className="flex flex-col items-center px-3 py-2 rounded-lg border border-white/10 bg-white/3 min-w-[72px] text-center">
                  <span className="text-sm font-bold" style={{ color: g.color }}>{isHi ? g.hi : g.en}</span>
                  <span className="text-text-tertiary text-xs mt-0.5">{g.sa}</span>
                </div>
              ))}
            </div>
          </div>

          <p>{t(L.s1p3)}</p>

          {/* Navagraha note */}
          <div className="flex gap-3 p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
            <div className="flex-shrink-0 w-1 rounded-full bg-purple-400/50" />
            <div>
              <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">
                {isHi ? 'नवग्रह = सप्त + राहु + केतु' : 'Navagraha = Sapta + Rahu + Ketu'}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                {isHi
                  ? 'भारतीय नवग्रह पद्धति सात कैल्डियन ग्रहों को राहु और केतु के साथ जोड़ती है — कुल 9 ग्रह। यह विस्तार अन्य किसी प्राचीन संस्कृति में नहीं मिलता।'
                  : 'The Indian Navagraha system extends the seven Chaldean planets with Rahu and Ketu — totaling 9. This extension is not found in any other ancient astronomical tradition.'}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 2: Speed Ranking Table ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            2
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t(L.s2Title)}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t(L.s2p1)}</p>

          {/* Speed table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-2.5 px-3 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'क्रम' : 'Rank'}
                  </th>
                  <th className="text-left py-2.5 px-3 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'ग्रह' : 'Planet'}
                  </th>
                  <th className="text-left py-2.5 px-3 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'परिक्रमण काल' : 'Sidereal Period'}
                  </th>
                  <th className="text-left py-2.5 px-3 text-gold-dark text-xs uppercase tracking-widest font-bold hidden sm:table-cell">
                    {isHi ? 'विशेषता' : 'Note'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {SPEED_TABLE.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0e27]"
                          style={{ backgroundColor: row.color }}
                        >
                          {row.rank}
                        </span>
                        {row.label.en && (
                          <span className="text-xs text-text-tertiary hidden lg:inline">
                            {t(row.label)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold" style={{ color: row.color }}>
                        {t(row.planet)}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-text-primary">
                      {t(row.period)}
                    </td>
                    <td className="py-3 px-3 text-text-tertiary text-xs hidden sm:table-cell">
                      {t(row.note)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-gold-primary/6 border border-gold-primary/20">
            <p className="text-text-secondary text-sm leading-relaxed">{t(L.s2note)}</p>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 3: How the Hora System Works ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            3
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t(L.s3Title)}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t(L.s3p1)}</p>
          <p>{t(L.s3p2)}</p>

          {/* Chaldean cycle visual */}
          <div className="bg-black/25 border border-gold-primary/15 rounded-xl p-4 my-2">
            <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">
              {isHi ? 'कैल्डियन चक्र (होरा क्रम)' : 'Chaldean Cycle (Hora Sequence)'}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-1.5">
              {[
                { en: 'Saturn', hi: 'शनि', color: '#60a5fa' },
                { en: 'Jupiter', hi: 'गुरु', color: '#facc15' },
                { en: 'Mars', hi: 'मंगल', color: '#ef4444' },
                { en: 'Sun', hi: 'सूर्य', color: '#f59e0b' },
                { en: 'Venus', hi: 'शुक्र', color: '#f472b6' },
                { en: 'Mercury', hi: 'बुध', color: '#4ade80' },
                { en: 'Moon', hi: 'चन्द्र', color: '#94a3b8' },
              ].map((p, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ backgroundColor: p.color + '25', color: p.color, border: `1px solid ${p.color}40` }}
                  >
                    {isHi ? p.hi : p.en}
                  </span>
                  {i < 6 && <span className="text-text-tertiary text-sm">→</span>}
                  {i === 6 && <span className="text-text-tertiary text-sm">↺</span>}
                </span>
              ))}
            </div>
            <p className="text-text-tertiary text-xs text-center mt-2">
              {isHi ? '24 होराएँ = 3 पूर्ण चक्र + 3 अतिरिक्त → अगले दिन का स्वामी' : '24 horas = 3 full cycles + 3 extra → determines next day\'s lord'}
            </p>
          </div>

          {/* Weekday derivation step-by-step */}
          <div>
            <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 mt-4">
              {t(L.s3weekLabel)}
            </p>
            <div className="space-y-2">
              {WEEKDAY_DERIVATION.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-white/3 border border-white/6 text-sm"
                >
                  <span className="font-bold min-w-[90px]" style={{ color: row.color }}>
                    {t(row.day)}
                  </span>
                  <span className="text-text-tertiary text-xs">
                    ({isHi ? 'स्वामी:' : 'lord:'}{' '}
                    <span style={{ color: row.color }}>{t(row.lord)}</span>)
                  </span>
                  <span className="text-text-tertiary mx-1">→</span>
                  <span className="text-text-tertiary text-xs">
                    {isHi ? '25वीं होरा =' : '25th hora ='}
                  </span>
                  <span className="font-bold text-xs" style={{ color: row.nextColor }}>
                    {t(row.hora25)}
                  </span>
                  <span className="text-text-tertiary mx-1">→</span>
                  <span className="font-bold text-xs" style={{ color: row.nextColor }}>
                    {t(row.next)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Highlight callout */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 mt-4">
            <p className="text-indigo-200 text-sm leading-relaxed font-medium">
              {isHi
                ? 'यह संयोग नहीं है। इन विशेष ग्रह-दिन नियुक्तियों वाला 7-दिवसीय सप्ताह कैल्डियन क्रम पर लागू होरा पद्धति का प्रत्यक्ष गणितीय परिणाम है।'
                : 'This is NOT a coincidence. The 7-day week with these specific day-planet assignments is a DIRECT mathematical consequence of the hora system applied to the Chaldean order.'}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 4: Weekday Names Comparison ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            4
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t(L.s4Title)}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t(L.s4p1)}</p>

          {/* Weekday comparison table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold">#</th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'संस्कृत' : 'Sanskrit'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'हिन्दी' : 'Hindi'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold hidden sm:table-cell">
                    {isHi ? 'अंग्रेज़ी' : 'English'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold hidden md:table-cell">
                    {isHi ? 'लैटिन' : 'Latin'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'ग्रह' : 'Planet'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold hidden lg:table-cell">
                    {isHi ? 'अंग्रेज़ी व्युत्पत्ति' : 'English etymology'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {WEEKDAYS.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-2 text-text-tertiary text-xs">{row.num}</td>
                    <td className="py-3 px-2 text-text-primary font-medium text-xs">{row.sanskrit}</td>
                    <td className="py-3 px-2 font-bold text-sm" style={{ color: row.color, fontFamily: isDevanagari ? 'var(--font-devanagari-body)' : undefined }}>{row.hi}</td>
                    <td className="py-3 px-2 text-text-primary text-xs hidden sm:table-cell">{row.en}</td>
                    <td className="py-3 px-2 text-text-tertiary text-xs italic hidden md:table-cell">{row.latin}</td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-xs px-2 py-1 rounded-full" style={{ backgroundColor: row.color + '20', color: row.color }}>
                        {t(row.planet)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-text-tertiary text-xs hidden lg:table-cell">{t(row.norse)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>{t(L.s4p2)}</p>

          <div className="p-4 rounded-xl bg-gold-primary/6 border border-gold-primary/20">
            <p className="text-gold-light/90 text-sm leading-relaxed">
              {isHi
                ? 'संस्कृत नाम सीधे ग्रह नाम + "वार" का उपयोग करते हैं। अंग्रेज़ी नाम नॉर्स/जर्मनिक देवताओं का उपयोग करते हैं जिन्हें उन्हीं ग्रहों से मैप किया गया था। सभी संस्कृतियों में अन्तर्निहित ग्रह नियुक्ति समान है — क्योंकि वे सभी एक ही होरा पद्धति से उत्पन्न हैं।'
                : 'Sanskrit names directly use the planet name + "vara" (वार = day). English names use Norse/Germanic gods mapped to the same planets. The underlying planetary assignment is identical across all cultures — because they all derive from the same hora system.'}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 5: Hora in Practice ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            5
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t(L.s5Title)}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t(L.s5p1)}</p>

          <div className="grid gap-3 sm:grid-cols-2 mt-4">
            {HORA_PRACTICE.map((hp, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.015 }}
                className={`rounded-xl p-4 border ${hp.border} ${hp.bg} transition-colors`}
              >
                <h4 className="font-bold text-sm mb-2" style={{ color: hp.color }}>
                  {t(hp.planet)}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">{t(hp.activities)}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/vedic-time"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {isHi ? 'वैदिक समय उपकरण' : 'Vedic Time Tool'}
            </Link>
            <Link
              href="/muhurta-ai"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {isHi ? 'मुहूर्त AI' : 'Muhurta AI Tool'}
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 6: Rahu & Ketu ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            6
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t(L.s6Title)}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t(L.s6p1)}</p>
          <p>{t(L.s6p2)}</p>

          {/* Rahu / Ketu visual cards */}
          <div className="grid sm:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
              <h4 className="text-purple-300 font-bold text-sm mb-2">
                {isHi ? 'राहु (Rahu)' : 'Rahu — Ascending Node'}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? 'आरोही चंद्र पात — वह बिन्दु जहाँ चंद्रमा दक्षिण से उत्तर की ओर क्रान्तिवृत्त को पार करता है। उत्तर नोड। ~18.6 वर्षीय चक्र। राहु काल प्रत्येक दिन होरा अनुक्रम से व्युत्पन्न होता है।'
                  : 'The ascending lunar node — where the Moon crosses the ecliptic moving northward. The North Node. ~18.6-year cycle. Rahu Kaal each day is derived from the hora sequence.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-500/8 border border-slate-500/20">
              <h4 className="text-slate-300 font-bold text-sm mb-2">
                {isHi ? 'केतु (Ketu)' : 'Ketu — Descending Node'}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? 'अवरोही चंद्र पात — वह बिन्दु जहाँ चंद्रमा उत्तर से दक्षिण की ओर क्रान्तिवृत्त को पार करता है। दक्षिण नोड। राहु के ठीक सामने (180° विपरीत)। दोनों सदा विपरीत दिशाओं में होते हैं।'
                  : 'The descending lunar node — where the Moon crosses the ecliptic moving southward. South Node. Always exactly opposite Rahu (180° apart). Eclipses require the Moon near a node at new/full Moon.'}
              </p>
            </div>
          </div>

          <p>{t(L.s6p3)}</p>

          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/learn/eclipses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200 text-sm hover:bg-purple-500/20 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {isHi ? 'ग्रहण के बारे में जानें' : 'Learn about Eclipses'}
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 7: Classical Sources ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t(L.s7Title)}
        </h3>
        <div className="space-y-5">
          {[
            { label: { en: 'Surya Siddhanta (Ch. 12)', hi: 'सूर्य सिद्धान्त (अ.12)' }, text: L.srcSurya, color: 'border-amber-500/20' },
            { label: { en: 'Aryabhatiya (499 CE)', hi: 'आर्यभटीय (499 ई.)' }, text: L.srcAryabhata, color: 'border-emerald-500/20' },
            { label: { en: 'Brihat Samhita (Ch. 2)', hi: 'बृहत् संहिता (अ.2)' }, text: L.srcBrihat, color: 'border-violet-500/20' },
            { label: { en: 'Arthashastra (~300 BCE)', hi: 'अर्थशास्त्र (~300 ई.पू.)' }, text: L.srcArthashastra, color: 'border-blue-500/20' },
            { label: { en: 'Yajnavalkya Smriti (Ch. 1)', hi: 'याज्ञवल्क्य स्मृति (अ.1)' }, text: L.srcYajnavalkya, color: 'border-gold-primary/20' },
            { label: { en: 'Romaka Siddhanta', hi: 'रोमक सिद्धान्त' }, text: L.srcRomaka, color: 'border-red-500/20' },
          ].map((src, i) => (
            <div key={i} className={`border ${src.color} rounded-xl p-4 bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]`}>
              <div className="text-gold-light font-bold text-sm mb-2" style={headingFont}>{t(src.label)}</div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{t(src.text)}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Cross-references ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-gold-gradient mb-4 flex items-center gap-2" style={headingFont}>
          <BookOpen className="w-5 h-5 text-gold-light flex-shrink-0" />
          {t(L.related)}
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/vedic-time', label: { en: 'Vedic Time', hi: 'वैदिक समय' } },
            { href: '/learn/vara', label: { en: 'Learn: Vara (Weekdays)', hi: 'सीखें: वार' } },
            { href: '/learn/muhurtas', label: { en: 'Learn: Muhurtas', hi: 'सीखें: मुहूर्त' } },
            { href: '/learn/eclipses', label: { en: 'Learn: Eclipses', hi: 'सीखें: ग्रहण' } },
            { href: '/learn/grahas', label: { en: 'Learn: The Nine Grahas', hi: 'सीखें: नवग्रह' } },
            { href: '/muhurta-ai', label: { en: 'Muhurta AI', hi: 'मुहूर्त AI' } },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href as '/'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {t(link.label)}
            </Link>
          ))}
        </div>
      </motion.div>

    </main>
  );
}
