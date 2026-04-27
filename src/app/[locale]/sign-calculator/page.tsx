'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { formatDegrees, dateToJD } from '@/lib/ephem/astronomical';
import { computeBirthSignsAction } from '@/app/actions/birth-signs';
import { computeComparison, type PlanetComparison } from '@/lib/ephem/comparison-engine';
import JyotishTerm from '@/components/ui/JyotishTerm';
import type { Locale , LocaleText} from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const SIGN_MEANING: Record<number, LocaleText> = {
  1:  { en: 'Bold, pioneering, competitive. Natural leaders who act on instinct.', hi: 'साहसी, अग्रणी, प्रतिस्पर्धी। सहज ज्ञान से कार्य करने वाले नेता।', sa: 'साहसिनः, अग्रगामिनः, प्रतिस्पर्धिनः। सहजज्ञानेन कर्म कुर्वन्तः नेतारः।', mai: 'साहसी, अगुआ, प्रतिस्पर्धी। सहज ज्ञानसँ काज करय वाला नेता।', mr: 'धाडसी, अग्रणी, स्पर्धात्मक। सहजबुद्धीने कार्य करणारे नेते।', ta: 'துணிச்சலான, முன்னோடி, போட்டியான. உள்ளுணர்வால் செயல்படும் இயல்பான தலைவர்கள்.', te: 'ధైర్యవంతులు, ముందుకు నడిపేవారు, పోటీతత్వం. సహజ ప్రవృత్తితో పనిచేసే నాయకులు.', bn: 'সাহসী, পথিকৃৎ, প্রতিযোগী। সহজাত প্রবৃত্তিতে কাজ করা স্বাভাবিক নেতা।', kn: 'ಧೈರ್ಯಶಾಲಿ, ಮುಂಚೂಣಿ, ಸ್ಪರ್ಧಾತ್ಮಕ. ಸಹಜ ಪ್ರವೃತ್ತಿಯಿಂದ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ನೈಸರ್ಗಿಕ ನಾಯಕರು.', gu: 'હિંમતવાન, અગ્રણી, સ્પર્ધાત્મક. સહજ વૃત્તિથી કાર્ય કરતા કુદરતી નેતા.' },
  2:  { en: 'Steady, sensual, loyal. Values stability, beauty, and material comfort.', hi: 'स्थिर, संवेदनशील, वफादार। स्थिरता, सौन्दर्य और भौतिक सुख को महत्व।', sa: 'स्थिराः, संवेदनशीलाः, विश्वासिनः। स्थैर्यं सौन्दर्यं भौतिकसुखं च मन्यन्ते।', mai: 'स्थिर, संवेदनशील, वफादार। स्थिरता, सुन्दरता आ भौतिक सुखकेँ महत्व।', mr: 'स्थिर, संवेदनशील, निष्ठावंत। स्थिरता, सौंदर्य आणि भौतिक सुख यांना महत्त्व।', ta: 'நிலையான, உணர்வுள்ள, விசுவாசமான. நிலைத்தன்மை, அழகு மற்றும் பொருள் வசதிக்கு மதிப்பளிப்பவர்.', te: 'స్థిరమైన, సున్నితమైన, విశ్వసనీయమైన. స్థిరత్వం, అందం మరియు భౌతిక సుఖానికి విలువనిచ్చేవారు.', bn: 'স্থির, সংবেদনশীল, বিশ্বস্ত। স্থিরতা, সৌন্দর্য ও বৈষয়িক স্বাচ্ছন্দ্যকে মূল্য দেয়।', kn: 'ಸ್ಥಿರ, ಸಂವೇದನಾಶೀಲ, ನಿಷ್ಠಾವಂತ. ಸ್ಥಿರತೆ, ಸೌಂದರ್ಯ ಮತ್ತು ಭೌತಿಕ ಸುಖಕ್ಕೆ ಬೆಲೆ ಕೊಡುವವರು.', gu: 'સ્થિર, સંવેદનશીલ, વફાદાર. સ્થિરતા, સૌંદર્ય અને ભૌતિક સુખને મહત્ત્વ આપનાર.' },
  3:  { en: 'Curious, communicative, adaptable. Quick thinkers who thrive on variety.', hi: 'जिज्ञासु, संवादी, अनुकूलनशील। तेज़ विचारक जो विविधता में पनपते हैं।', sa: 'जिज्ञासवः, संवादशीलाः, अनुकूलनक्षमाः। विविधतायां वर्धमानाः शीघ्रचिन्तकाः।', mai: 'जिज्ञासु, बातचीत करय वाला, अनुकूल। विविधतामे पनपय वाला तेज विचारक।', mr: 'जिज्ञासू, संवादी, अनुकूलनक्षम। विविधतेत भरभराट करणारे चपळ विचारवंत।', ta: 'ஆர்வமுள்ள, தொடர்பாடல் திறன் கொண்ட, தகவமைப்புள்ள. பன்முகத்தன்மையில் செழிக்கும் விரைவான சிந்தனையாளர்கள்.', te: 'ఆసక్తిగల, సంభాషణాపరులు, అనుకూలమైన. వైవిధ్యంలో అభివృద్ధి చెందే వేగవంతమైన ఆలోచనాపరులు.', bn: 'কৌতূহলী, যোগাযোগপটু, অভিযোজনক্ষম। বৈচিত্র্যে বিকশিত দ্রুত চিন্তাবিদ।', kn: 'ಕುತೂಹಲಿ, ಸಂವಹನಶೀಲ, ಹೊಂದಾಣಿಕೆಯ. ವೈವಿಧ್ಯದಲ್ಲಿ ಅಭಿವೃದ್ಧಿ ಹೊಂದುವ ತ್ವರಿತ ಚಿಂತಕರು.', gu: 'જિજ્ઞાસુ, વાતચીત કરનાર, અનુકૂલનશીલ. વિવિધતામાં ખીલનારા ઝડપી વિચારક.' },
  4:  { en: 'Nurturing, intuitive, protective. Deeply emotional with strong family bonds.', hi: 'पोषक, सहज ज्ञानी, रक्षात्मक। गहरे भावनात्मक, मज़बूत पारिवारिक बन्धन।', sa: 'पोषकाः, सहजज्ञानिनः, रक्षाकर्तारः। गहनभावुकाः दृढपारिवारिकबन्धनैः युक्ताः।', mai: 'पालनकर्ता, सहज ज्ञानी, रक्षात्मक। गहन भावनात्मक, मजगूत पारिवारिक बंधन।', mr: 'पोषणकर्ते, अंतर्ज्ञानी, संरक्षक। कुटुंबाशी दृढ नात्यांसह खोल भावनिक।', ta: 'பாதுகாக்கும், உள்ளுணர்வு கொண்ட, பாதுகாப்பான. வலுவான குடும்ப பிணைப்புடன் ஆழமான உணர்வுள்ளவர்கள்.', te: 'పోషించే, అంతర్ దృష్టి గల, రక్షణాత్మక. బలమైన కుటుంబ బంధాలతో లోతైన భావోద్వేగం.', bn: 'লালনকারী, অন্তর্জ্ঞানী, রক্ষাকারী। দৃঢ় পারিবারিক বন্ধন সহ গভীর আবেগপ্রবণ।', kn: 'ಪೋಷಕ, ಅಂತಃಪ್ರಜ್ಞೆಯ, ರಕ್ಷಣಾತ್ಮಕ. ಬಲವಾದ ಕುಟುಂಬ ಬಂಧಗಳೊಂದಿಗೆ ಆಳವಾದ ಭಾವನಾಶೀಲ.', gu: 'પોષક, સહજ જ્ઞાની, રક્ષણાત્મક. મજબૂત પારિવારિક બંધન સાથે ઊંડા ભાવનાત્મક.' },
  5:  { en: 'Charismatic, creative, generous. Born to lead, perform, and inspire.', hi: 'करिश्माई, रचनात्मक, उदार। नेतृत्व, प्रदर्शन और प्रेरणा के लिए जन्मे।', sa: 'आकर्षकाः, सृजनशीलाः, उदाराः। नेतृत्वाय प्रदर्शनाय प्रेरणायै च जाताः।', mai: 'करिश्माई, रचनात्मक, उदार। नेतृत्व, प्रदर्शन आ प्रेरणाक लेल जन्मल।', mr: 'करिश्माई, सर्जनशील, उदार। नेतृत्व, सादरीकरण आणि प्रेरणा यासाठी जन्मले।', ta: 'கவர்ச்சிமிக்க, படைப்பாற்றல் கொண்ட, தாராள மனம். தலைமை தாங்க, நிகழ்த்த மற்றும் ஊக்கமளிக்கப் பிறந்தவர்கள்.', te: 'ఆకర్షణీయమైన, సృజనాత్మక, ఉదారమైన. నాయకత్వం, ప్రదర్శన మరియు ప్రేరణ కోసం పుట్టినవారు.', bn: 'আকর্ষণীয়, সৃজনশীল, উদার। নেতৃত্ব, পরিবেশনা ও অনুপ্রেরণার জন্য জন্ম।', kn: 'ಆಕರ್ಷಕ, ಸೃಜನಶೀಲ, ಉದಾರ. ಮುನ್ನಡೆಸಲು, ಪ್ರದರ್ಶಿಸಲು ಮತ್ತು ಸ್ಫೂರ್ತಿ ನೀಡಲು ಜನಿಸಿದವರು.', gu: 'આકર્ષક, સર્જનાત્મક, ઉદાર. નેતૃત્વ, પ્રદર્શન અને પ્રેરણા માટે જન્મેલા.' },
  6:  { en: 'Analytical, detail-oriented, service-minded. Seeks perfection in all things.', hi: 'विश्लेषणात्मक, विस्तार-उन्मुख, सेवाभावी। हर चीज़ में पूर्णता चाहते हैं।', sa: 'विश्लेषणात्मकाः, विस्तारोन्मुखाः, सेवापराः। सर्वत्र पूर्णतां इच्छन्ति।', mai: 'विश्लेषणात्मक, विस्तारपर ध्यान देय वाला, सेवाभावी। हर चीजमे पूर्णता चाहय वाला।', mr: 'विश्लेषणात्मक, तपशीलवार, सेवाभावी। प्रत्येक गोष्टीत परिपूर्णता शोधतात।', ta: 'பகுப்பாய்வு திறன் கொண்ட, நுணுக்கமான, சேவை மனப்பான்மையுள்ள. எல்லாவற்றிலும் நிறைவை நாடுபவர்.', te: 'విశ్లేషణాత్మక, వివరాలపై దృష్టి, సేవాభావం. అన్ని విషయాలలో పరిపూర్ణత కోరేవారు.', bn: 'বিশ্লেষণাত্মক, বিস্তারিত, সেবামনস্ক। সবকিছুতে পরিপূর্ণতা চায়।', kn: 'ವಿಶ್ಲೇಷಣಾತ್ಮಕ, ವಿವರ-ಆಧಾರಿತ, ಸೇವಾಮನೋಭಾವ. ಎಲ್ಲದರಲ್ಲೂ ಪರಿಪೂರ್ಣತೆಯನ್ನು ಬಯಸುವವರು.', gu: 'વિશ્લેષણાત્મક, વિગતવાર, સેવાભાવી. દરેક વસ્તુમાં પૂર્ણતા ઇચ્છનાર.' },
  7:  { en: 'Diplomatic, charming, balance-seeking. Thrives in partnerships and art.', hi: 'कूटनीतिक, आकर्षक, संतुलन-प्रेमी। साझेदारी और कला में पनपते हैं।', sa: 'कूटनीतिज्ञाः, चारुचित्ताः, सन्तुलनप्रियाः। साझीदार्ये कलायां च वर्धन्ते।', mai: 'कूटनीतिक, आकर्षक, संतुलन-प्रेमी। साझेदारी आ कलामे पनपय वाला।', mr: 'मुत्सद्दी, आकर्षक, संतुलन शोधणारे। भागीदारी आणि कलेत भरभराट करतात।', ta: 'இராஜதந்திர, கவர்ச்சியான, சமநிலை நாடும். கூட்டாண்மை மற்றும் கலையில் செழிப்பவர்.', te: 'దౌత్యపరమైన, ఆకర్షణీయమైన, సమతుల్యత కోరే. భాగస్వామ్యాలు మరియు కళలో అభివృద్ధి చెందేవారు.', bn: 'কূটনৈতিক, মোহনীয়, ভারসাম্য-সন্ধানী। অংশীদারিত্ব ও শিল্পে সমৃদ্ধ।', kn: 'ರಾಜತಾಂತ್ರಿಕ, ಆಕರ್ಷಕ, ಸಮತೋಲನ-ಪ್ರಿಯ. ಪಾಲುದಾರಿಕೆ ಮತ್ತು ಕಲೆಯಲ್ಲಿ ಅಭಿವೃದ್ಧಿ ಹೊಂದುವವರು.', gu: 'કૂટનીતિજ્ઞ, આકર્ષક, સંતુલન-પ્રેમી. ભાગીદારી અને કલામાં ખીલનાર.' },
  8:  { en: 'Intense, transformative, perceptive. Drawn to depth, mystery, and power.', hi: 'तीव्र, रूपान्तरकारी, सूक्ष्मदर्शी। गहराई, रहस्य और शक्ति की ओर।', sa: 'तीव्राः, रूपान्तरकारिणः, सूक्ष्मदर्शिनः। गभीरतायां रहस्ये शक्तौ च आकृष्टाः।', mai: 'तीव्र, रूपान्तरकारी, सूक्ष्मदर्शी। गहिनता, रहस्य आ शक्तिक ओर।', mr: 'तीव्र, रूपांतरकारी, सूक्ष्मदर्शी। खोली, गूढ आणि सामर्थ्याकडे आकर्षित।', ta: 'தீவிரமான, மாற்றமளிக்கும், நுண்ணுணர்வுள்ள. ஆழம், மர்மம் மற்றும் சக்தியால் ஈர்க்கப்படுபவர்.', te: 'తీవ్రమైన, పరివర్తనాత్మక, సూక్ష్మదర్శి. లోతు, రహస్యం మరియు శక్తి వైపు ఆకర్షితులు.', bn: 'তীব্র, রূপান্তরকারী, সূক্ষ্মদর্শী। গভীরতা, রহস্য ও ক্ষমতার প্রতি আকৃষ্ট।', kn: 'ತೀವ್ರ, ರೂಪಾಂತರಕಾರಿ, ಸೂಕ್ಷ್ಮದರ್ಶಿ. ಆಳ, ರಹಸ್ಯ ಮತ್ತು ಶಕ್ತಿಯ ಕಡೆ ಆಕರ್ಷಿತ.', gu: 'તીવ્ર, પરિવર્તનકારી, સૂક્ષ્મદર્શી. ઊંડાણ, રહસ્ય અને શક્તિ તરફ ખેંચાતા.' },
  9:  { en: 'Optimistic, philosophical, adventurous. Eternal seeker of wisdom and truth.', hi: 'आशावादी, दार्शनिक, साहसी। ज्ञान और सत्य के शाश्वत खोजी।', sa: 'आशावादिनः, दार्शनिकाः, साहसिनः। ज्ञानस्य सत्यस्य च शाश्वताः अन्वेषकाः।', mai: 'आशावादी, दार्शनिक, साहसी। ज्ञान आ सत्यक शाश्वत खोजी।', mr: 'आशावादी, तत्त्वज्ञ, साहसी। ज्ञान आणि सत्याचे चिरंतन शोधक।', ta: 'நம்பிக்கையான, தத்துவ ஞானமுள்ள, சாகசமான. ஞானம் மற்றும் உண்மையின் நிரந்தர தேடுபவர்.', te: 'ఆశావాది, తాత్విక, సాహసోపేత. జ్ఞానం మరియు సత్యం యొక్క శాశ్వత అన్వేషి.', bn: 'আশাবাদী, দার্শনিক, দুঃসাহসী। জ্ঞান ও সত্যের চিরন্তন সন্ধানী।', kn: 'ಆಶಾವಾದಿ, ತಾತ್ವಿಕ, ಸಾಹಸಿ. ಜ್ಞಾನ ಮತ್ತು ಸತ್ಯದ ಶಾಶ್ವತ ಅನ್ವೇಷಕ.', gu: 'આશાવાદી, દાર્શનિક, સાહસિક. જ્ઞાન અને સત્યના શાશ્વત શોધક.' },
  10: { en: 'Ambitious, disciplined, pragmatic. Builds lasting achievements through patience.', hi: 'महत्वाकांक्षी, अनुशासित, व्यावहारिक। धैर्य से स्थायी उपलब्धियाँ बनाते हैं।', sa: 'महत्त्वाकाङ्क्षिणः, अनुशासिताः, व्यावहारिकाः। धैर्येण स्थायिनीः उपलब्धीः निर्मान्ति।', mai: 'महत्वाकांक्षी, अनुशासित, व्यावहारिक। धैर्यसँ स्थायी उपलब्धि बनबय वाला।', mr: 'महत्त्वाकांक्षी, शिस्तबद्ध, व्यावहारिक। संयमाने चिरस्थायी यश निर्माण करतात।', ta: 'லட்சியமுள்ள, ஒழுக்கமான, நடைமுறையான. பொறுமையின் மூலம் நிலையான சாதனைகளை உருவாக்குபவர்.', te: 'ఆశయవంతమైన, క్రమశిక్షణ గల, ఆచరణాత్మక. ఓపికతో శాశ్వత విజయాలు సాధించేవారు.', bn: 'উচ্চাকাঙ্ক্ষী, শৃঙ্খলাবদ্ধ, বাস্তববাদী। ধৈর্যের মাধ্যমে স্থায়ী অর্জন গড়ে তোলে।', kn: 'ಮಹತ್ವಾಕಾಂಕ್ಷಿ, ಶಿಸ್ತುಬದ್ಧ, ಪ್ರಾಯೋಗಿಕ. ತಾಳ್ಮೆಯಿಂದ ಶಾಶ್ವತ ಸಾಧನೆಗಳನ್ನು ನಿರ್ಮಿಸುವವರು.', gu: 'મહત્ત્વાકાંક્ષી, શિસ્તબદ્ધ, વ્યાવહારિક. ધીરજથી કાયમી સિદ્ધિઓ બનાવનાર.' },
  11: { en: 'Innovative, independent, humanitarian. Thinks ahead of their time.', hi: 'नवोन्मेषी, स्वतन्त्र, मानवतावादी। अपने समय से आगे सोचते हैं।', sa: 'नवोन्मेषिणः, स्वतन्त्राः, मानवतावादिनः। स्वकालात् अग्रे चिन्तयन्ति।', mai: 'नवोन्मेषी, स्वतंत्र, मानवतावादी। अपन समयसँ आगू सोचय वाला।', mr: 'नवकल्पक, स्वतंत्र, मानवतावादी। आपल्या काळापुढे विचार करतात।', ta: 'புதுமையான, சுதந்திரமான, மனிதநேயமுள்ள. தங்கள் காலத்திற்கு முன்னால் சிந்திப்பவர்.', te: 'నూతనమైన, స్వతంత్రమైన, మానవతావాద. తమ కాలానికి ముందుగా ఆలోచించేవారు.', bn: 'উদ্ভাবনী, স্বাধীন, মানবতাবাদী। নিজের সময়ের চেয়ে এগিয়ে চিন্তা করে।', kn: 'ನವೀನ, ಸ್ವತಂತ್ರ, ಮಾನವತಾವಾದಿ. ತಮ್ಮ ಕಾಲಕ್ಕಿಂತ ಮುಂದೆ ಯೋಚಿಸುವವರು.', gu: 'નવીન, સ્વતંત્ર, માનવતાવાદી. પોતાના સમયથી આગળ વિચારનાર.' },
  12: { en: 'Intuitive, compassionate, spiritual. The mystic and healer of the zodiac.', hi: 'सहज ज्ञानी, करुणामय, आध्यात्मिक। राशिचक्र के रहस्यवादी और उपचारक।', sa: 'सहजज्ञानिनः, करुणामयाः, आध्यात्मिकाः। राशिचक्रस्य रहस्यवादिनः उपचारकाश्च।', mai: 'सहज ज्ञानी, करुणामय, आध्यात्मिक। राशिचक्रक रहस्यवादी आ उपचारक।', mr: 'अंतर्ज्ञानी, करुणामय, आध्यात्मिक। राशिचक्रातील गूढवादी आणि उपचारक।', ta: 'உள்ளுணர்வுள்ள, இரக்கமுள்ள, ஆன்மீகமான. ராசி மண்டலத்தின் மர்ம ஞானி மற்றும் குணமளிப்பவர்.', te: 'అంతర్ దృష్టి గల, దయగల, ఆధ్యాత్మిక. రాశిచక్రం యొక్క రహస్యవాది మరియు వైద్యుడు.', bn: 'অন্তর্জ্ঞানী, সহানুভূতিশীল, আধ্যাত্মিক। রাশিচক্রের রহস্যবাদী ও নিরাময়কারী।', kn: 'ಅಂತಃಪ್ರಜ್ಞೆಯ, ಕರುಣಾಮಯ, ಆಧ್ಯಾತ್ಮಿಕ. ರಾಶಿಚಕ್ರದ ರಹಸ್ಯವಾದಿ ಮತ್ತು ಗುಣಪಡಿಸುವವರು.', gu: 'સહજ જ્ઞાની, કરુણામય, આધ્યાત્મિક. રાશિચક્રના રહસ્યવાદી અને ઉપચારક.' },
};

export default function SignCalculatorPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('12:00');
  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);

  // Auto-fill from user profile if logged in
  const { user, initialized } = useAuthStore();
  useEffect(() => {
    if (!initialized || !user || autoFilled) return;
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.from('user_profiles')
      .select('date_of_birth, time_of_birth, birth_time_known, birth_place, birth_lat, birth_lng, birth_timezone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.date_of_birth && data?.birth_lat != null) {
          setDateStr(data.date_of_birth);
          if (data.time_of_birth && data.birth_time_known) {
            setTimeStr(data.time_of_birth.substring(0, 5)); // HH:MM from HH:MM:SS
          }
          setPlaceName(data.birth_place || '');
          setPlaceLat(data.birth_lat);
          setPlaceLng(data.birth_lng);
          // ALWAYS resolve timezone from coordinates — never trust stored birth_timezone
          if (data.birth_lat && data.birth_lng) {
            resolveTimezoneFromCoords(Number(data.birth_lat), Number(data.birth_lng)).then(tz => setPlaceTimezone(tz));
          }
          setAutoFilled(true);
        }
      });
  }, [initialized, user, autoFilled]);

  // Server action: compute birth signs on server where Swiss Ephemeris is available
  const [result, setResult] = useState<{
    sunSign: number; sunSignName: LocaleText; sunDegree: string; sunLong: number;
    moonSign: number; moonSignName: LocaleText; moonDegree: string; moonLong: number;
    moonNakshatra: typeof NAKSHATRAS[0]; moonNakNum: number; moonPada: number;
    location: string; tzOffset: number;
  } | null>(null);

  const [comparison, setComparison] = useState<{
    planets: PlanetComparison[];
    shiftedCount: number;
    hookLine: string;
    ayanamshaFormatted: string;
  } | null>(null);

  useEffect(() => {
    if (!dateStr || !placeLat || !placeLng || !placeTimezone) { setResult(null); setComparison(null); return; }
    let cancelled = false;
    computeBirthSignsAction(dateStr, timeStr, Number(placeLat), Number(placeLng), placeTimezone)
      .then(b => {
        if (cancelled) return;
        setResult({
          sunSign: b.sunSign,
          sunSignName: RASHIS[b.sunSign - 1].name,
          sunDegree: formatDegrees(b.sunLong % 30),
          sunLong: b.sunLong,
          moonSign: b.moonSign,
          moonSignName: RASHIS[b.moonSign - 1].name,
          moonDegree: formatDegrees(b.moonLong % 30),
          moonLong: b.moonLong,
          moonNakshatra: NAKSHATRAS[b.moonNakshatra - 1],
          moonNakNum: b.moonNakshatra,
          moonPada: b.moonPada,
          location: placeName,
          tzOffset: b.tzOffset,
        });

        // Compute tropical vs sidereal comparison
        try {
          const [year, month, day] = dateStr.split('-').map(Number);
          const [hour, minute] = timeStr.split(':').map(Number);
          const hourDecimal = hour + minute / 60;
          const jd = dateToJD(year, month, day, hourDecimal);
          const comp = computeComparison(jd);
          if (!cancelled) {
            setComparison({
              planets: comp.planets.filter(p => p.id === 0 || p.id === 1), // Sun and Moon only
              shiftedCount: comp.planets.filter(p => p.id <= 1 && p.isShifted).length,
              hookLine: comp.hookLine,
              ayanamshaFormatted: comp.precessionData.currentAyanamsha.toFixed(1) + '°',
            });
          }
        } catch (err) {
          console.error('[sign-calculator] comparison failed:', err);
          if (!cancelled) setComparison(null);
        }
      })
      .catch(() => { if (!cancelled) { setResult(null); setComparison(null); } });
    return () => { cancelled = true; };
  }, [dateStr, timeStr, placeLat, placeLng, placeName, placeTimezone]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{isTamil ? 'சூரிய & சந்திர ராசி கணிப்பான்' : locale === 'en' ? 'Sun & Moon Sign Calculator' : 'सूर्य एवं चन्द्र राशि गणक'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>
          {isTamil ? 'உங்கள் பிறப்பு விவரங்களிலிருந்து வேத சூரிய மற்றும் சந்திர ராசியை அறியுங்கள்'
            : locale === 'en'
            ? 'Find your Vedic (Sidereal) Sun and Moon signs from your birth details'
            : 'अपने जन्म विवरण से वैदिक (सायन) सूर्य और चन्द्र राशि जानें'}
        </p>
      </motion.div>

      {/* Static educational content for SEO */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          {locale === 'en' || isTamil ? (
            <>
              <p className="text-text-secondary/80 text-base leading-relaxed mb-4">
                Your Moon sign (Rashi) is the cornerstone of Vedic astrology — more important than your Western Sun sign. While your Sun sign changes roughly once a month, the Moon moves through all 12 signs every 27.3 days, spending about 2.25 days in each sign. Your Moon sign at the exact moment of birth determines your emotional nature, mental patterns, and the starting point for Vimshottari Dasha — the 120-year predictive timeline that is uniquely Vedic.
              </p>
              <p className="text-text-secondary/80 text-base leading-relaxed">
                Unlike Western astrology which uses the tropical zodiac, Vedic astrology uses the sidereal zodiac corrected by Ayanamsha (currently ~24°). This means your Vedic Moon sign is often one sign behind your Western sign. Enter your birth details below to discover your true sidereal Moon sign, Nakshatra (birth star), and Ascendant (Lagna).
              </p>
            </>
          ) : (
            <>
              <p className="text-text-secondary/80 text-base leading-relaxed mb-4" style={bodyFont}>
                आपकी चन्द्र राशि वैदिक ज्योतिष की आधारशिला है — पश्चिमी सूर्य राशि से अधिक महत्वपूर्ण। जबकि सूर्य राशि लगभग एक महीने में बदलती है, चन्द्रमा हर 27.3 दिनों में सभी 12 राशियों से गुजरता है। जन्म के सटीक समय पर आपकी चन्द्र राशि आपकी भावनात्मक प्रकृति और विंशोत्तरी दशा — 120 वर्षों की भविष्यवाणी समयरेखा — का आरंभ बिंदु निर्धारित करती है।
              </p>
              <p className="text-text-secondary/80 text-base leading-relaxed" style={bodyFont}>
                पश्चिमी ज्योतिष उष्णकटिबंधीय राशि चक्र का उपयोग करता है जबकि वैदिक ज्योतिष अयनांश (~24°) द्वारा सही किया गया नक्षत्र राशि चक्र उपयोग करता है। अपनी सही नक्षत्र चन्द्र राशि, नक्षत्र और लग्न जानने के लिए नीचे अपना जन्म विवरण दर्ज करें।
              </p>
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2" style={bodyFont}>
              {isTamil ? 'பிறந்த தேதி' : locale === 'en' ? 'Date of Birth' : 'जन्म तिथि'}
            </label>
            <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-tertiary/50 border border-gold-primary/20 text-gold-light font-mono focus:outline-none focus:border-gold-primary/50"
            />
          </div>
          <div>
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2" style={bodyFont}>
              {isTamil ? 'பிறந்த நேரம்' : locale === 'en' ? 'Time of Birth' : 'जन्म समय'}
            </label>
            <input type="time" value={timeStr} onChange={e => setTimeStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-tertiary/50 border border-gold-primary/20 text-gold-light font-mono focus:outline-none focus:border-gold-primary/50"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2" style={bodyFont}>
            {isTamil ? 'பிறந்த இடம்' : locale === 'en' ? 'Birth Place' : 'जन्म स्थान'}
          </label>
          <LocationSearch
            value={placeName}
            onSelect={(loc) => {
              setPlaceName(loc.name);
              setPlaceLat(loc.lat);
              setPlaceLng(loc.lng);
              setPlaceTimezone(loc.timezone);
            }}
            placeholder={isTamil ? 'பிறந்த நகரத்தைத் தேடுங்கள்...' : locale === 'en' ? 'Search birth city...' : 'जन्म शहर खोजें...'}
          />
        </div>
        <p className="text-text-secondary/70 text-xs text-center mt-4" style={bodyFont}>
          {locale === 'en'
            ? 'Location is essential — Moon moves ~13° per day and timezone affects calculations.'
            : 'स्थान आवश्यक है — चन्द्रमा प्रतिदिन ~13° चलता है और समयक्षेत्र गणना को प्रभावित करता है।'}
        </p>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GoldDivider />

            {/* Location + timezone confirmation */}
            <p className="text-text-secondary/75 text-xs text-center my-4">
              {result.location} (UTC{result.tzOffset >= 0 ? '+' : ''}{result.tzOffset})
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              {/* Sun Sign */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent text-center"
              >
                <div className="text-amber-400 text-xs uppercase tracking-[0.3em] font-bold mb-4">
                  {isTamil ? 'சூரிய ராசி' : locale === 'en' ? 'SUN SIGN (Surya Rashi)' : 'सूर्य राशि'}
                </div>
                <RashiIconById id={result.sunSign} size={80} />
                <h3 className="text-amber-300 text-3xl font-bold mt-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                  {tl(result.sunSignName, locale)}
                </h3>
                <div className="text-text-secondary text-sm mt-2 font-mono">{result.sunDegree} ({result.sunLong.toFixed(2)}°)</div>
                {SIGN_MEANING[result.sunSign] && (
                  <p className="text-text-secondary/80 text-xs mt-3 leading-relaxed" style={bodyFont}>
                    {!isDevanagariLocale(locale) ? SIGN_MEANING[result.sunSign].en : SIGN_MEANING[result.sunSign].hi}
                  </p>
                )}
              </motion.div>

              {/* Moon Sign */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 text-center"
              >
                <div className="text-indigo-400 text-xs uppercase tracking-[0.3em] font-bold mb-4">
                  {isTamil ? 'சந்திர ராசி' : locale === 'en' ? 'MOON SIGN (Chandra Rashi)' : 'चन्द्र राशि'}
                </div>
                <RashiIconById id={result.moonSign} size={80} />
                <h3 className="text-indigo-300 text-3xl font-bold mt-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                  {tl(result.moonSignName, locale)}
                </h3>
                <div className="text-text-secondary text-sm mt-2 font-mono">{result.moonDegree} ({result.moonLong.toFixed(2)}°)</div>
                {SIGN_MEANING[result.moonSign] && (
                  <p className="text-text-secondary/80 text-xs mt-3 leading-relaxed" style={bodyFont}>
                    {!isDevanagariLocale(locale) ? SIGN_MEANING[result.moonSign].en : SIGN_MEANING[result.moonSign].hi}
                  </p>
                )}
              </motion.div>
            </div>

            {/* What do Sun & Moon signs mean? */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/10 p-5 my-6">
              <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
                {isTamil ? 'சூரிய & சந்திர ராசிகள் என்ன வெளிப்படுத்துகின்றன?' : locale === 'en' ? 'What do Sun & Moon signs reveal?' : 'सूर्य और चन्द्र राशि क्या बताती हैं?'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary leading-relaxed" style={bodyFont}>
                <div>
                  <span className="text-amber-400 font-bold">{isTamil ? 'சூரிய ராசி' : locale === 'en' ? 'Sun Sign' : 'सूर्य राशि'}</span>
                  {locale === 'en'
                    ? ' — Your core identity, ego, and life purpose. It shows how you express your will and where you shine most brightly. In Vedic astrology, this is often one sign behind your Western sign.'
                    : ' — आपकी मूल पहचान, अहंकार और जीवन उद्देश्य। यह दर्शाती है कि आप अपनी इच्छाशक्ति कैसे व्यक्त करते हैं।'}
                </div>
                <div>
                  <span className="text-indigo-400 font-bold">{isTamil ? 'சந்திர ராசி' : locale === 'en' ? 'Moon Sign' : 'चन्द्र राशि'}</span>
                  {locale === 'en'
                    ? ' — Your emotional nature, instincts, and subconscious mind. This is the MOST important sign in Vedic astrology — more than Sun sign. It determines your Nakshatra, Dasha system, and how transits affect you.'
                    : ' — आपका भावनात्मक स्वभाव, सहज वृत्ति और अवचेतन मन। वैदिक ज्योतिष में यह सबसे महत्वपूर्ण राशि है — सूर्य राशि से भी अधिक। यह आपका नक्षत्र, दशा और गोचर प्रभाव निर्धारित करती है।'}
                </div>
              </div>
            </div>

            {/* Moon Nakshatra */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 text-center"
            >
              <div className="flex items-center justify-center gap-4">
                <NakshatraIconById id={result.moonNakNum} size={48} />
                <div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1" style={bodyFont}>
                    {isTamil ? 'ஜன்ம நட்சத்திரம்' : locale === 'en' ? 'Birth Nakshatra (Janma Nakshatra)' : 'जन्म नक्षत्र'}
                  </div>
                  <div className="text-gold-light text-2xl font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                    {tl(result.moonNakshatra.name, locale)}
                  </div>
                  <div className="text-text-secondary text-sm" style={bodyFont}>
                    {isTamil ? 'பாதம்' : locale === 'en' ? 'Pada' : 'पद'} {result.moonPada}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="text-center text-text-secondary/70 text-xs mt-6" style={bodyFont}>
              {locale === 'en'
                ? 'Note: These are Vedic (Sidereal) signs using Lahiri Ayanamsha, not Western (Tropical) signs.'
                : 'नोट: ये लाहिरी अयनांश के साथ वैदिक (सायन) राशियाँ हैं, पश्चिमी (सायन) राशियाँ नहीं।'}
            </div>

            {/* Tropical vs Sidereal Comparison Panel */}
            {comparison && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 p-6 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20"
              >
                <h3 className="text-gold-light text-lg font-bold mb-2" style={headingFont}>
                  {locale === 'en'
                    ? 'The 24° Shift — Why Your Western Sign Is Different'
                    : isTamil
                      ? '24° மாற்றம் — உங்கள் மேற்கத்திய ராசி ஏன் வேறுபட்டது'
                      : '24° का अंतर — आपकी पश्चिमी राशि अलग क्यों है'}
                </h3>
                <p className="text-text-secondary text-sm mb-5 leading-relaxed" style={bodyFont}>
                  {locale === 'en' ? (
                    <>
                      Western astrology uses the tropical zodiac, while Vedic astrology uses the sidereal zodiac corrected by{' '}
                      <JyotishTerm term="ayanamsha">Ayanamsha</JyotishTerm> (currently {comparison.ayanamshaFormatted}).
                      This ~24° difference means your Western and Vedic signs often land in different constellations.
                    </>
                  ) : (
                    <>
                      पश्चिमी ज्योतिष उष्णकटिबंधीय राशि चक्र का उपयोग करता है, जबकि वैदिक ज्योतिष अयनांश
                      ({comparison.ayanamshaFormatted}) द्वारा सही किया गया नक्षत्र राशि चक्र उपयोग करता है।
                      यह ~24° का अंतर अक्सर आपकी पश्चिमी और वैदिक राशि को अलग-अलग नक्षत्रों में रखता है।
                    </>
                  )}
                </p>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-text-secondary border-b border-gold-primary/10">
                        <th className="text-left py-2 px-3 font-medium">{locale === 'en' ? 'Planet' : 'ग्रह'}</th>
                        <th className="text-left py-2 px-3 font-medium">{locale === 'en' ? 'Western (Tropical)' : 'पश्चिमी (उष्णकटिबंधीय)'}</th>
                        <th className="text-left py-2 px-3 font-medium">{locale === 'en' ? 'Vedic (Sidereal)' : 'वैदिक (नक्षत्र)'}</th>
                        <th className="text-center py-2 px-3 font-medium">{locale === 'en' ? 'Shifted' : 'परिवर्तन'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.planets.map((p) => (
                        <tr key={p.id} className={p.isShifted ? 'text-gold-light' : 'text-text-secondary'}>
                          <td className="py-2.5 px-3 font-medium" style={bodyFont}>{tl(p.name, locale)}</td>
                          <td className="py-2.5 px-3" style={bodyFont}>{tl(p.tropicalSignName, locale)}</td>
                          <td className="py-2.5 px-3" style={bodyFont}>{tl(p.siderealSignName, locale)}</td>
                          <td className="py-2.5 px-3 text-center">
                            {p.isShifted
                              ? <span className="text-gold-primary font-semibold">&#10022; YES</span>
                              : <span className="text-text-secondary/50">—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Shifted count summary */}
                <p className="text-text-secondary text-xs mt-4" style={bodyFont}>
                  {locale === 'en'
                    ? `${comparison.shiftedCount} of 2 luminaries changed sign between tropical and sidereal zodiacs.`
                    : `2 में से ${comparison.shiftedCount} ज्योतिपिंड उष्णकटिबंधीय और नक्षत्र राशि चक्र के बीच राशि बदलते हैं।`}
                </p>

                {/* Hook line */}
                <div className="mt-4 p-4 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <p className="text-gold-light/90 text-sm italic" style={bodyFont}>
                    &ldquo;{comparison.hookLine}&rdquo;
                  </p>
                </div>

                {/* CTA link */}
                <div className="mt-5 text-center">
                  <a
                    href={`/${locale}/tropical-compare`}
                    className="inline-block px-4 py-2 rounded-lg bg-gold-primary/15 text-gold-light text-sm font-medium hover:bg-gold-primary/25 transition-colors"
                  >
                    {locale === 'en' ? 'See Full Comparison →' : 'पूर्ण तुलना देखें →'}
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
