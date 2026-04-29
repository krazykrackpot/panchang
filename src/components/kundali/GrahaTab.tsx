'use client';

import { useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { GrahaDetail, UpagrahaPosition } from '@/types/kundali';
import type { PlanetInsight } from '@/lib/kundali/tippanni-types';
import type { Locale, LocaleText } from '@/types/panchang';

/* ------------------------------------------------------------------ */
/*  Static data — hoisted to module level                             */
/* ------------------------------------------------------------------ */

/** Short planet-in-sign flavor text (composed from planet nature + sign nature) */
const PLANET_IN_SIGN_EN: Record<number, Record<number, string>> = {
  // Sun (0) in signs 1-12
  0: {
    1: 'Bold, pioneering self-expression. Natural leader with fierce independence.',
    2: 'Steady, value-driven identity. Finds purpose through material security and loyalty.',
    3: 'Curious, communicative self. Excels in learning, writing, and versatile pursuits.',
    4: 'Nurturing identity, deeply tied to home and family. Emotional depth fuels purpose.',
    5: 'Radiant self-confidence and creative power. Natural performer and generous spirit.',
    6: 'Analytical, service-oriented identity. Finds purpose through helping and perfecting.',
    7: 'Identity shaped through partnerships. Diplomatic, harmony-seeking, and aesthetically aware.',
    8: 'Intense, transformative self. Drawn to mysteries, research, and psychological depth.',
    9: 'Philosophical, expansive identity. Finds meaning through travel, teaching, and higher truths.',
    10: 'Ambitious, disciplined self. Built for achievement, structure, and public responsibility.',
    11: 'Unconventional, humanitarian identity. Independent thinker drawn to innovation and community.',
    12: 'Introspective, spiritual self. Identity dissolves into service, imagination, and transcendence.',
  },
  // Moon (1)
  1: {
    1: 'Emotionally impulsive and action-oriented. Quick feelings, bold instincts.',
    2: 'Emotionally grounded and comfort-seeking. Finds peace in routine and material stability.',
    3: 'Restless mind, emotionally curious. Needs constant intellectual stimulation.',
    4: 'Deeply nurturing and intuitive. Emotional security rooted in home and family.',
    5: 'Warm, dramatic emotions. Creative expression and romance feed emotional well-being.',
    6: 'Emotionally analytical. Finds comfort in service, routine, and problem-solving.',
    7: 'Emotional fulfillment through partnership. Needs harmony and balanced relationships.',
    8: 'Emotionally intense and private. Deep instincts, drawn to hidden truths.',
    9: 'Emotionally expansive and optimistic. Finds peace through philosophy and exploration.',
    10: 'Emotionally reserved but ambitious. Reputation and achievement matter for inner security.',
    11: 'Emotionally detached but humanitarian. Finds belonging in groups and causes.',
    12: 'Deeply intuitive, dreamy emotions. Needs solitude and spiritual connection for peace.',
  },
  // Mars (2)
  2: {
    1: 'Maximum energy and courage. Competitive, physically strong, pioneering drive.',
    2: 'Determined, resource-acquiring energy. Fights for financial and material security.',
    3: 'Communicative courage. Bold in speech, strong with siblings, quick in debate.',
    4: 'Protective energy focused on home. Property acquisition, but domestic friction possible.',
    5: 'Creative, competitive passion. Sports, romance, and risk-taking energize you.',
    6: 'Excellent at defeating enemies and overcoming illness. Competitive edge in service.',
    7: 'Passionate in partnerships. Strong desires, but impatience in relationships.',
    8: 'Research-oriented intensity. Strong survival instinct, interest in occult and transformation.',
    9: 'Righteous warrior energy. Fights for beliefs, loves adventure and physical challenges.',
    10: 'Career-driven ambition at its peak. Executive energy, authority through action.',
    11: 'Goal-oriented and socially assertive. Achieves through networks and group leadership.',
    12: 'Internalized energy. Works behind the scenes, may face hidden anger or isolation.',
  },
  // Mercury (3)
  3: {
    1: 'Quick-thinking, analytical communicator. Sharp wit and adaptable intelligence.',
    2: 'Practical intellect focused on finance. Good with numbers and business negotiations.',
    3: 'Brilliant communicator and versatile thinker. Writing, media, and multi-tasking excel.',
    4: 'Home-based intellect. Good memory, emotional intelligence, interest in real estate.',
    5: 'Creative intelligence and playful communication. Speculative mind, good with children.',
    6: 'Precise, analytical mind. Excels in health sciences, accounting, and critical analysis.',
    7: 'Diplomatic communicator. Business partnerships and negotiation are strengths.',
    8: 'Investigative mind drawn to research, mysteries, and hidden knowledge.',
    9: 'Philosophical intellect. Teaching, publishing, and cross-cultural communication thrive.',
    10: 'Business-minded and career-oriented intellect. Professional communication excels.',
    11: 'Innovative thinking and networking intelligence. Technology and future-oriented ideas.',
    12: 'Imaginative, intuitive mind. Creative writing and spiritual study, but scattered focus.',
  },
  // Jupiter (4)
  4: {
    1: 'Optimistic, wise, and expansive personality. Natural teacher and counselor.',
    2: 'Wealthy speech and family wisdom. Financial growth through knowledge and ethics.',
    3: 'Courageous communication. Teaches through writing and media, supportive siblings.',
    4: 'Blessed home life and emotional wisdom. Property gains, strong mother relationship.',
    5: 'Excellent for children, creativity, and speculative gains. Deep spiritual merit.',
    6: 'Overcomes enemies through wisdom. Health awareness, service-oriented expansion.',
    7: 'Wise, generous partner. Marriage brings growth, excellent for business alliances.',
    8: 'Deep occult wisdom and research ability. Longevity, inheritance through transformation.',
    9: 'Maximum fortune and spiritual wisdom. Teaching, travel, and dharmic living thrive.',
    10: 'Career blessed with recognition. Respected authority, ethical leadership.',
    11: 'Abundant gains through networks. Wishes fulfilled, elder siblings supportive.',
    12: 'Spiritual liberation and foreign connections. Charity-minded, enlightened detachment.',
  },
  // Venus (5)
  5: {
    1: 'Charming, attractive personality. Refined aesthetics and diplomatic nature.',
    2: 'Luxury-loving, wealth-attracting. Beautiful speech, strong family values.',
    3: 'Artistic communication. Creative siblings, short travels for pleasure.',
    4: 'Beautiful home and emotional comfort. Vehicles, luxury, loving mother.',
    5: 'Romantic, creative passion. Artistic talent, fulfilling love affairs.',
    6: 'Service through beauty and art. Health through aesthetics, overcoming enemies gracefully.',
    7: 'Excellent for marriage and partnerships. Attracts beautiful, harmonious relationships.',
    8: 'Hidden sensuality and transformative relationships. Interest in tantric arts.',
    9: 'Fortune through art, culture, and foreign connections. Refined spiritual taste.',
    10: 'Career in arts, luxury, or diplomacy. Public charm and professional beauty.',
    11: 'Gains through social networks and creative endeavors. Influential friendships.',
    12: 'Foreign luxury and spiritual beauty. Bed pleasures, imaginative arts, quiet indulgence.',
  },
  // Saturn (6)
  6: {
    1: 'Serious, disciplined personality. Slow start but builds lasting resilience.',
    2: 'Conservative with finances. Wealth through patience, frugal speech.',
    3: 'Determined communicator. Challenges with siblings early, courage through persistence.',
    4: 'Responsibilities at home. Property gains come late. Deep emotional lessons.',
    5: 'Delayed children or creative expression. Discipline in learning, structured creativity.',
    6: 'Excellent for overcoming chronic enemies and illness through sustained effort.',
    7: 'Late or serious marriage. Committed partnerships, but requires patience and maturity.',
    8: 'Long life through discipline. Karmic lessons through transformation and hidden matters.',
    9: 'Structured spirituality. Traditional learning, slow but deep philosophical growth.',
    10: 'Career success through hard work and perseverance. Gradual rise to authority.',
    11: 'Steady gains over time. Reliable network, fulfilled wishes through persistence.',
    12: 'Spiritual discipline and renunciation. Foreign residence, karmic debts worked through.',
  },
  // Rahu (7)
  7: {
    1: 'Unconventional personality. Magnetic but unpredictable. Worldly ambition drives identity.',
    2: 'Intense desire for wealth. Unusual speech patterns, non-traditional family dynamics.',
    3: 'Bold, unconventional communication. Sibling dynamics complex, fearless expression.',
    4: 'Unusual home environment. Foreign property, emotional intensity around mother.',
    5: 'Unconventional creativity and romance. Speculative gains, unusual children.',
    6: 'Powerful enemy-defeating ability. Unusual health patterns, serves in unconventional ways.',
    7: 'Intense, karmic partnerships. Foreign spouse or unconventional marriage dynamics.',
    8: 'Deep occult interest and transformative experiences. Research into hidden matters.',
    9: 'Unorthodox spiritual path. Foreign teachers, unconventional philosophy.',
    10: 'Ambitious career in technology or unconventional fields. Sudden rise possible.',
    11: 'Large social network. Gains through technology, foreign connections, and innovation.',
    12: 'Foreign residence, spiritual seeking. Vivid dreams, hidden anxieties to work through.',
  },
  // Ketu (8)
  8: {
    1: 'Spiritually inclined, detached personality. Past-life wisdom, but identity struggles.',
    2: 'Detached from wealth. Spiritual speech, unconventional family values.',
    3: 'Introspective communication. Spiritual siblings, courage through surrender.',
    4: 'Detached from worldly comforts. Spiritual home, inner emotional completion.',
    5: 'Past-life spiritual merit. Intuitive creativity, detachment from romance.',
    6: 'Spiritual healing abilities. Overcomes enemies through non-attachment.',
    7: 'Karmic partnerships. Spiritual connection with spouse, detachment in relationships.',
    8: 'Deep mystical insight. Natural healer, interest in past lives and liberation.',
    9: 'Enlightened spiritual path. Past-life dharmic merit, intuitive philosophical wisdom.',
    10: 'Detached from worldly ambition. Success through spiritual or healing professions.',
    11: 'Spiritual gains and detachment from material desires. Unusual friendships.',
    12: 'Moksha-oriented. Final liberation themes strong, spiritual retreat, enlightened surrender.',
  },
};

const UPAGRAHA_NOTES: Record<string, LocaleText> = {
  'Dhuma': { en: 'Smoke of the Sun — indicates obstacles and hidden enemies when afflicted', hi: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु', sa: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु', mai: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु', mr: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु', ta: 'சூரியனின் புகை — பாதிக்கப்படும்போது தடைகள் மற்றும் மறைந்த எதிரிகளைக் குறிக்கிறது', te: 'సూర్యుని పొగ — బాధితమైనప్పుడు అడ్డంకులు మరియు దాగిన శత్రువులను సూచిస్తుంది', bn: 'সূর্যের ধূম — পীড়িত হলে বাধা ও গোপন শত্রু নির্দেশ করে', kn: 'ಸೂರ್ಯನ ಹೊಗೆ — ಪೀಡಿತವಾದಾಗ ಅಡ್ಡಿ ಮತ್ತು ಗುಪ್ತ ಶತ್ರುಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ', gu: 'સૂર્યનો ધુમાડો — પીડિત હોય ત્યારે અવરોધ અને છુપાયેલા શત્રુ દર્શાવે છે' },
  'Vyatipata': { en: 'Calamity point — sensitive degree that can trigger sudden events', hi: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश', sa: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश', mai: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश', mr: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश', ta: 'ஆபத்து புள்ளி — திடீர் நிகழ்வுகளைத் தூண்டக்கூடிய உணர்திறன் பாகை', te: 'ఉపద్రవ బిందువు — ఆకస్మిక సంఘటనలను ప్రేరేపించగల సున్నితమైన డిగ్రీ', bn: 'দুর্যোগ বিন্দু — আকস্মিক ঘটনা ঘটাতে পারে এমন সংবেদনশীল ডিগ্রি', kn: 'ವಿಪತ್ತು ಬಿಂದು — ಆಕಸ್ಮಿಕ ಘಟನೆಗಳನ್ನು ಪ್ರಚೋದಿಸಬಹುದಾದ ಸೂಕ್ಷ್ಮ ಡಿಗ್ರಿ', gu: 'આપત્તિ બિંદુ — અચાનક ઘટનાઓ ઉત્તેજિત કરી શકે તેવી સંવેદનશીલ ડિગ્રી' },
  'Parivesha': { en: 'Halo of the Moon — spiritual awareness and intuitive perception', hi: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान', sa: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान', mai: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान', mr: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान', ta: 'சந்திரனின் ஒளிவட்டம் — ஆன்மிக விழிப்புணர்வு மற்றும் உள்ளுணர்வு', te: 'చంద్రుని ప్రభా — ఆధ్యాత్మిక అవగాహన మరియు అంతర్దృష్టి', bn: 'চন্দ্রের আভামণ্ডল — আধ্যাত্মিক সচেতনতা ও অন্তর্জ্ঞান', kn: 'ಚಂದ್ರನ ಪ್ರಭಾವಲಯ — ಅಧ್ಯಾತ್ಮಿಕ ಜಾಗೃತಿ ಮತ್ತು ಅಂತಃಪ್ರಜ್ಞೆ', gu: 'ચંદ્રનું પ્રભામંડળ — આધ્યાત્મિક જાગૃતિ અને અંતર્જ્ઞાન' },
  'Indrachapa': { en: 'Indra\'s bow — rainbow point indicating divine grace and protection', hi: 'इन्द्रचाप — दिव्य कृपा और सुरक्षा का सूचक इन्द्रधनुष बिन्दु' },
  'Upaketu': { en: 'Sub-Ketu — deepens Ketu\'s spiritual and detachment effects', hi: 'उपकेतु — केतु के आध्यात्मिक और वैराग्य प्रभावों को गहन करता है' },
  'Kala': { en: 'Time — indicates karmic timing and fateful periods in life', hi: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक', sa: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक', mai: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक', mr: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक', ta: 'காலம் — கர்ம நேரம் மற்றும் விதியான காலகட்டங்களைக் குறிக்கிறது', te: 'కాలం — కర్మ సమయం మరియు విధి నిర్ణయించే కాలాలను సూచిస్తుంది', bn: 'কাল — কর্মগত সময় ও ভাগ্যনির্ধারক কাল নির্দেশ করে', kn: 'ಕಾಲ — ಕಾರ್ಮಿಕ ಸಮಯ ಮತ್ತು ವಿಧಿನಿರ್ಣಾಯಕ ಅವಧಿಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ', gu: 'કાળ — કર્મ સમય અને ભાગ્યનિર્ધારક કાળ દર્શાવે છે' },
  'Mrityu': { en: 'Death point — sensitive degree related to health vulnerabilities', hi: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश', sa: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश', mai: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश', mr: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश', ta: 'மரண புள்ளி — உடல்நல பாதிப்புகளுடன் தொடர்புடைய உணர்திறன் பாகை', te: 'మృత్యు బిందువు — ఆరోగ్య బలహీనతలకు సంబంధించిన సున్నితమైన డిగ్రీ', bn: 'মৃত্যু বিন্দু — স্বাস্থ্য দুর্বলতার সাথে সম্পর্কিত সংবেদনশীল ডিগ্রি', kn: 'ಮೃತ್ಯು ಬಿಂದು — ಆರೋಗ್ಯ ದುರ್ಬಲತೆಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಸೂಕ್ಷ್ಮ ಡಿಗ್ರಿ', gu: 'મૃત્યુ બિંદુ — આરોગ્ય નબળાઈ સાથે સંબંધિત સંવેદનશીલ ડિગ્રી' },
  'Ardhaprahara': { en: 'Half-watch — indicates midpoint energy and balance in the chart', hi: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक', sa: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक', mai: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक', mr: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक', ta: 'அரை காவல் — குண்டலியில் மத்தியப் புள்ளி ஆற்றல் மற்றும் சமநிலையைக் குறிக்கிறது', te: 'అర్ధప్రహర — జాతకంలో మధ్యబిందు శక్తి మరియు సమతుల్యతను సూచిస్తుంది', bn: 'অর্ধপ্রহর — কুণ্ডলীতে মধ্যবিন্দু শক্তি ও ভারসাম্য নির্দেশ করে', kn: 'ಅರ್ಧಪ್ರಹರ — ಕುಂಡಲಿಯಲ್ಲಿ ಮಧ್ಯಬಿಂದು ಶಕ್ತಿ ಮತ್ತು ಸಮತೋಲನವನ್ನು ಸೂಚಿಸುತ್ತದೆ', gu: 'અર્ધપ્રહર — કુંડળીમાં મધ્યબિંદુ શક્તિ અને સમતુલા દર્શાવે છે' },
  'Gulika': { en: 'Son of Saturn — malefic point indicating chronic issues and karmic debts', hi: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु', sa: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु', mai: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु', mr: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु', ta: 'சனியின் மகன் — நாள்பட்ட பிரச்சினைகள் மற்றும் கர்ம கடன்களைக் குறிக்கும் பாபப் புள்ளி', te: 'శనికుమారుడు — దీర్ఘకాలిక సమస్యలు మరియు కర్మ ఋణాలను సూచించే పాపబిందువు', bn: 'শনির পুত্র — দীর্ঘস্থায়ী সমস্যা ও কর্মঋণ নির্দেশকারী পাপবিন্দু', kn: 'ಶನಿಯ ಮಗ — ದೀರ್ಘಕಾಲಿಕ ಸಮಸ್ಯೆ ಮತ್ತು ಕರ್ಮಋಣವನ್ನು ಸೂಚಿಸುವ ಪಾಪಬಿಂದು', gu: 'શનિનો પુત્ર — લાંબી સમસ્યાઓ અને કર્મઋણ દર્શાવતો પાપબિંદુ' },
  'Mandi': { en: 'Son of Saturn — similar to Gulika, indicates delays and karmic blocks', hi: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक', sa: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक', mai: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक', mr: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक', ta: 'சனியின் மகன் — குளிகை போன்றது, தாமதங்கள் மற்றும் கர்ம தடைகளைக் குறிக்கிறது', te: 'శనికుమారుడు — గులికతో సమానం, ఆలస్యాలు మరియు కర్మ అడ్డంకులను సూచిస్తుంది', bn: 'শনির পুত্র — গুলিকার অনুরূপ, বিলম্ব ও কর্মগত বাধা নির্দেশ করে', kn: 'ಶನಿಯ ಮಗ — ಗುಳಿಕೆಯಂತೆ, ವಿಳಂಬ ಮತ್ತು ಕಾರ್ಮಿಕ ಅಡ್ಡಿಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ', gu: 'શનિનો પુત્ર — ગુલિકા જેવું, વિલંબ અને કર્મ અવરોધ દર્શાવે છે' },
};

const PLANET_PALETTE: Record<number, { border: string; glow: string; badge: string; label: string }> = {
  0: { border: 'border-amber-500/30',  glow: 'bg-amber-500/5',   badge: 'bg-amber-500/15 border-amber-500/25 text-amber-300',   label: 'text-amber-200' },
  1: { border: 'border-slate-400/30',  glow: 'bg-slate-400/5',   badge: 'bg-slate-400/15 border-slate-400/25 text-slate-300',   label: 'text-slate-200' },
  2: { border: 'border-red-500/30',    glow: 'bg-red-500/5',     badge: 'bg-red-500/15 border-red-500/25 text-red-300',         label: 'text-red-200'   },
  3: { border: 'border-emerald-500/30',glow: 'bg-emerald-500/5', badge: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300', label: 'text-emerald-200' },
  4: { border: 'border-yellow-500/30', glow: 'bg-yellow-500/5',  badge: 'bg-yellow-500/15 border-yellow-500/25 text-yellow-300', label: 'text-yellow-200' },
  5: { border: 'border-rose-400/30',   glow: 'bg-rose-400/5',    badge: 'bg-rose-400/15 border-rose-400/25 text-rose-300',       label: 'text-rose-200'  },
  6: { border: 'border-indigo-400/30', glow: 'bg-indigo-400/5',  badge: 'bg-indigo-400/15 border-indigo-400/25 text-indigo-300', label: 'text-indigo-200' },
  7: { border: 'border-violet-500/30', glow: 'bg-violet-500/5',  badge: 'bg-violet-500/15 border-violet-500/25 text-violet-300', label: 'text-violet-200' },
  8: { border: 'border-orange-700/30', glow: 'bg-orange-700/5',  badge: 'bg-orange-700/15 border-orange-700/25 text-orange-300', label: 'text-orange-200' },
};

export default function GrahaTab({ grahaDetails, upagrahas, locale, isDevanagari, headingFont, planetInsights }: {
  grahaDetails: GrahaDetail[];
  upagrahas: UpagrahaPosition[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
  planetInsights?: PlanetInsight[];
}) {
  const isTamil = String(locale) === 'ta';
  const isEn = locale === 'en' || isTamil;
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  // Compute overall planetary snapshot
  const snapshot = useMemo(() => {
    const retroCount = grahaDetails.filter(g => g.isRetrograde).length;
    const combustCount = grahaDetails.filter(g => g.isCombust).length;
    return { retroCount, combustCount, total: grahaDetails.length };
  }, [grahaDetails]);

  // Identify most notable planets for the synthesis card
  const notablePlanets = useMemo(() => {
    const retro = grahaDetails.filter(g => g.isRetrograde);
    const combust = grahaDetails.filter(g => g.isCombust);
    // Find planet with highest speed (most active) — exclude Rahu/Ketu (always retrograde)
    const active = grahaDetails.filter(g => g.planetId < 7).sort((a, b) => Math.abs(b.speed) - Math.abs(a.speed));
    return { retro, combust, fastest: active[0] };
  }, [grahaDetails]);

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {isEn ? 'Graha Details' : 'ग्रह विवरण'}
      </h3>

      {/* Personal synthesis card — what stands out in YOUR chart */}
      <div className="rounded-2xl bg-gradient-to-br from-gold-primary/8 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-3" style={headingFont}>
          {isEn ? 'Your Planetary Snapshot' : 'आपकी ग्रह स्थिति का सार'}
        </h4>
        <div className="space-y-2 text-sm text-text-secondary leading-relaxed">
          {notablePlanets.retro.length > 0 ? (
            <p>
              <span className="text-red-300 font-medium">{notablePlanets.retro.length} {isEn ? 'retrograde' : 'वक्री'}: </span>
              {isEn
                ? `${notablePlanets.retro.map(g => tl(g.planetName, locale)).join(', ')}. Retrograde planets work differently — their energy turns inward, giving you an unconventional or deeply introspective relationship with those areas of life. This isn't weakness; many highly successful people have multiple retrogrades. It means you process ${notablePlanets.retro.map(g => tl(g.planetName, locale)).join(' and ')}'s themes in your own unique way.`
                : `${notablePlanets.retro.map(g => tl(g.planetName, locale)).join(', ')}। वक्री ग्रह भिन्न रूप से कार्य करते हैं — इनकी ऊर्जा अंतर्मुखी होती है। यह कमज़ोरी नहीं; बहुत से सफल व्यक्तियों के एकाधिक ग्रह वक्री होते हैं।`}
            </p>
          ) : (
            <p>
              {isEn
                ? 'No planets are retrograde in your chart. All planetary energies express themselves directly and outwardly — what you see is what you get.'
                : 'आपकी कुण्डली में कोई ग्रह वक्री नहीं है। सभी ग्रह ऊर्जाएँ सीधे और बाह्य रूप से अभिव्यक्त होती हैं।'}
            </p>
          )}
          {notablePlanets.combust.length > 0 && (
            <p>
              <span className="text-orange-300 font-medium">{notablePlanets.combust.length} {isEn ? 'combust' : 'अस्त'}: </span>
              {isEn
                ? `${notablePlanets.combust.map(g => tl(g.planetName, locale)).join(', ')}. These planets are too close to the Sun — their qualities may be overshadowed by ego or authority figures in your life. You might find it harder to express ${notablePlanets.combust.map(g => tl(g.planetName, locale)).join(' and ')}'s qualities independently.`
                : `${notablePlanets.combust.map(g => tl(g.planetName, locale)).join(', ')}। ये ग्रह सूर्य के बहुत निकट हैं — इनके गुण अहंकार या सत्ता द्वारा आच्छादित हो सकते हैं।`}
            </p>
          )}
        </div>
      </div>

      {/* A) Badge legend + overall snapshot */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-3" style={bodyFont}>
          {isEn ? 'Reading This Table' : 'यह तालिका कैसे पढ़ें'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/15">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-400 font-bold text-xs px-1.5 py-0.5 rounded border border-red-500/30 bg-red-500/10">R</span>
              <span className="text-gold-light font-bold text-xs" style={bodyFont}>{isEn ? 'Retrograde' : 'वक्री'}</span>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {isEn
                ? 'This planet appears to move backward from Earth\'s perspective. Its energy turns inward — expect delays, introspection, or revisiting old themes. Retrograde planets give depth and unconventional perspectives. It\'s not bad — it means this planet\'s themes work differently for you.'
                : 'यह ग्रह पृथ्वी से पीछे चलता प्रतीत होता है। इसकी ऊर्जा अंतर्मुखी हो जाती है — विलम्ब, आत्मनिरीक्षण, या पुराने विषयों पर लौटना अपेक्षित है। वक्री ग्रह गहराई और अपारम्परिक दृष्टिकोण देते हैं।'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/15">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange-400 font-bold text-xs px-1.5 py-0.5 rounded border border-orange-500/30 bg-orange-500/10">C</span>
              <span className="text-gold-light font-bold text-xs" style={bodyFont}>{isEn ? 'Combust' : 'अस्त'}</span>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {isEn
                ? 'This planet is too close to the Sun and its light is "burned out." Its significations may be weakened or overshadowed by the ego/authority (Sun). The closer to the Sun, the stronger the effect. You may find this planet\'s themes harder to express independently.'
                : 'यह ग्रह सूर्य के बहुत निकट है और इसका प्रकाश "जल गया" है। इसके कारकत्व अहंकार/अधिकार (सूर्य) द्वारा कमजोर या आच्छादित हो सकते हैं। सूर्य से जितना निकट, प्रभाव उतना प्रबल।'}
            </p>
          </div>
        </div>
        {/* Overall snapshot */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gold-primary/10">
          <span className="text-text-secondary text-xs" style={bodyFont}>
            {isEn ? 'Chart snapshot: ' : 'कुण्डली स्थिति: '}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 border border-gold-primary/15 text-gold-light">
            {snapshot.total} {isEn ? 'planets' : 'ग्रह'}
          </span>
          {snapshot.retroCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/15 text-red-400">
              {snapshot.retroCount} {isEn ? 'retrograde' : 'वक्री'}
            </span>
          )}
          {snapshot.combustCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/15 text-orange-400">
              {snapshot.combustCount} {isEn ? 'combust' : 'अस्त'}
            </span>
          )}
          {snapshot.retroCount === 0 && snapshot.combustCount === 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/15 text-green-400">
              {isEn ? 'No planets retrograde or combust' : 'कोई ग्रह वक्री या अस्त नहीं'}
            </span>
          )}
        </div>
      </div>

      {/* Graha Table */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/15 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-2" style={bodyFont}>{isEn ? 'Graha' : 'ग्रह'}</th>
              <th className="text-center py-3 px-1">R</th>
              <th className="text-center py-3 px-1">C</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{isEn ? 'Longitude' : 'भोगांश'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{isEn ? 'Nakshatra / Swami' : 'नक्षत्र / स्वामी'}</th>
              <th className="text-right py-3 px-2">{isEn ? 'Raw L.' : 'कच्चा अं.'}</th>
              <th className="text-right py-3 px-2">{isEn ? 'Latitude' : 'अक्षांश'}</th>
              <th className="text-right py-3 px-2">{isEn ? 'R.A.' : 'विषु.अं.'}</th>
              <th className="text-right py-3 px-2">{isEn ? 'Declination' : 'क्रान्ति'}</th>
              <th className="text-right py-3 px-2">{isEn ? 'Speed °/day' : 'गति °/दि'}</th>
            </tr>
          </thead>
          <tbody>
            {grahaDetails.map((g) => (
              <tr key={g.planetId} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <GrahaIconById id={g.planetId} size={20} />
                    <span className="text-gold-light font-medium" style={bodyFont}>{tl(g.planetName, locale)}</span>
                  </div>
                </td>
                <td className="text-center py-2.5 px-1">
                  {g.isRetrograde && <span className="text-red-400 font-bold text-xs">R</span>}
                </td>
                <td className="text-center py-2.5 px-1">
                  {g.isCombust && <span className="text-orange-400 font-bold text-xs">C</span>}
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-text-primary">{tl(g.signName, locale)}</span>
                  <span className="text-text-secondary ml-1">{g.signDegree}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-text-primary" style={bodyFont}>{tl(g.nakshatraName, locale)}</span>
                  <span className="text-gold-dark ml-1 text-xs">P{g.nakshatraPada}</span>
                  <span className="text-text-secondary/75 ml-1 text-xs">/ {tl(g.nakshatraLord, locale)}</span>
                </td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.longitude.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.latitude.toFixed(4)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.rightAscension.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.declination.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right font-mono text-xs">
                  <span className={g.speed < 0 ? 'text-red-400' : 'text-text-secondary'}>{g.speed.toFixed(4)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* B) Planet-in-sign one-liner interpretations */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-4" style={headingFont}>
          {isEn ? 'Planet-in-Sign Snapshot' : 'ग्रह-राशि संक्षिप्त व्याख्या'}
        </h4>
        <div className="space-y-2.5">
          {grahaDetails.map(g => {
            const pal = PLANET_PALETTE[g.planetId] ?? PLANET_PALETTE[0];
            const signFlavor = PLANET_IN_SIGN_EN[g.planetId]?.[g.sign] || '';
            // Build a compact one-liner with retrograde/combust annotation
            const annotations: string[] = [];
            if (g.isRetrograde) annotations.push(isEn ? 'retrograde' : 'वक्री');
            if (g.isCombust) annotations.push(isEn ? 'combust' : 'अस्त');
            return (
              <div key={g.planetId} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <GrahaIconById id={g.planetId} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-bold text-xs ${pal.label}`} style={bodyFont}>{tl(g.planetName, locale)}</span>
                    <span className="text-text-secondary/70 text-xs">{isEn ? 'in' : 'में'}</span>
                    <span className="text-text-primary text-xs font-medium" style={bodyFont}>{tl(g.signName, locale)} {g.signDegree}</span>
                    {annotations.length > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded border border-red-500/20 bg-red-500/5 text-red-400/80">
                        {annotations.join(', ')}
                      </span>
                    )}
                  </div>
                  {signFlavor && (
                    <p className="text-text-secondary text-xs leading-relaxed mt-0.5">{signFlavor}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Planetary Interpretations (from tippanni engine) */}
      {planetInsights && planetInsights.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
            {isEn ? 'Planetary Interpretations' : 'ग्रह व्याख्या'}
          </h4>
          <div className="space-y-3">
            {grahaDetails.map((g) => {
              const insight = planetInsights.find(pi => pi.planetId === g.planetId);
              if (!insight) return null;
              const pal = PLANET_PALETTE[g.planetId] ?? PLANET_PALETTE[0];
              return (
                <div key={g.planetId} className={`relative overflow-hidden rounded-xl border ${pal.border} bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4`}>
                  <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full ${pal.glow} blur-2xl pointer-events-none`} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <GrahaIconById id={g.planetId} size={22} />
                      <span className={`font-bold text-sm ${pal.label}`} style={bodyFont}>{tl(g.planetName, locale)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${pal.badge}`} style={bodyFont}>
                        {tl(g.signName, locale)}
                      </span>
                      <span className="text-text-secondary/70 text-xs" style={bodyFont}>
                        {isEn ? `House ${insight.house}` : `भाव ${insight.house}`}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>{insight.description}</p>
                    {insight.implications && (
                      <p className="text-text-secondary/65 text-sm mt-2 leading-relaxed border-t border-white/5 pt-2" style={bodyFont}>{insight.implications}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upagrahas */}
      {upagrahas.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gold-gradient text-center mb-4" style={headingFont}>
            {isEn ? 'Upagraha Positions' : 'उपग्रह स्थिति'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {upagrahas.map((u, i) => (
              <div key={i} className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 text-center">
                <p className="text-gold-light font-bold text-sm mb-1" style={bodyFont}>{tl(u.name, locale)}</p>
                <RashiIconById id={u.sign} size={28} />
                <p className="text-text-primary text-sm mt-1" style={bodyFont}>{tl(u.signName, locale)} {u.degree}</p>
                <p className="text-text-secondary/75 text-xs mt-0.5" style={bodyFont}>{tl(u.nakshatra, locale)}</p>
                <p className="text-text-secondary/70 text-xs mt-1 leading-relaxed">{UPAGRAHA_NOTES[u.name.en]?.[isEn ? 'en' : 'hi'] || ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
