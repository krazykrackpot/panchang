import type { LocaleText } from '@/types/panchang';
/* ════════════════════════════════════════════════════════════════
   Web Stories — 5 Google-optimized swipeable stories
   ════════════════════════════════════════════════════════════════ */

export interface StorySlide {
  type: 'title' | 'fact' | 'comparison' | 'quote' | 'cta';
  heading: LocaleText;
  body?: LocaleText;
  stat?: string;
  bgColor?: string;
  sourceText?: LocaleText;
}

export interface WebStory {
  slug: string;
  title: LocaleText;
  description: LocaleText;
  slides: StorySlide[];
  ctaUrl: string;
}

export const WEB_STORIES: WebStory[] = [
  /* ── Story 1: Sine is Sanskrit ── */
  {
    slug: 'sine-is-sanskrit',
    title: {
      en: 'Did You Know "Sine" Is Sanskrit?',
      hi: 'क्या आप जानते हैं "Sine" संस्कृत है?',
    },
    description: {
      en: 'The word "sine" comes from the Sanskrit word Jya meaning bowstring. Aryabhata created the first sine table in 499 CE.',
      hi: '"Sine" शब्द संस्कृत "ज्या" से आया है जिसका अर्थ है धनुष की प्रत्यंचा।',
    },
    ctaUrl: '/learn/contributions/sine',
    slides: [
      {
        type: 'title',
        heading: { en: 'DID YOU KNOW\n"SINE" IS SANSKRIT?', hi: 'क्या आप जानते हैं\n"SINE" संस्कृत है?', sa: 'क्या आप जानते हैं\n"SINE" संस्कृत है?', mai: 'क्या आप जानते हैं\n"SINE" संस्कृत है?', mr: 'क्या आप जानते हैं\n"SINE" संस्कृत है?', ta: 'தெரியுமா\n"SINE" சமஸ்கிருதமா?', te: 'తెలుసా\n"SINE" సంస్కృతమా?', bn: 'জানেন কি\n"SINE" সংস্কৃত?', kn: 'ಗೊತ್ತಾ\n"SINE" ಸಂಸ್ಕೃತವಾ?', gu: 'ખબર છે\n"SINE" સંસ્કૃત છે?' },
        bgColor: '#1a0a30',
      },
      {
        type: 'fact',
        heading: { en: 'The word comes from "Jya" (ज्या)', hi: 'यह शब्द "ज्या" से आया है', sa: 'यह शब्द "ज्या" से आया है', mai: 'यह शब्द "ज्या" से आया है', mr: 'यह शब्द "ज्या" से आया है', ta: 'The word comes from "Jya" (ज्या)', te: 'The word comes from "Jya" (ज्या)', bn: 'The word comes from "Jya" (ज्या)', kn: 'The word comes from "Jya" (ज्या)', gu: 'The word comes from "Jya" (ज्या)' },
        body: { en: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', hi: 'ज्या का अर्थ है धनुष की प्रत्यंचा। प्राचीन भारतीय गणितज्ञों ने वृत्त में धनुष देखा — अर्धज्या बनी sine फ़ंक्शन।', sa: 'ज्या का अर्थ है धनुष की प्रत्यंचा। प्राचीन भारतीय गणितज्ञों ने वृत्त में धनुष देखा — अर्धज्या बनी sine फ़ंक्शन।', mai: 'ज्या का अर्थ है धनुष की प्रत्यंचा। प्राचीन भारतीय गणितज्ञों ने वृत्त में धनुष देखा — अर्धज्या बनी sine फ़ंक्शन।', mr: 'ज्या का अर्थ है धनुष की प्रत्यंचा। प्राचीन भारतीय गणितज्ञों ने वृत्त में धनुष देखा — अर्धज्या बनी sine फ़ंक्शन।', ta: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', te: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', bn: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', kn: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', gu: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Aryabhata created the first sine table', hi: 'आर्यभट ने बनाई पहली ज्या तालिका', sa: 'आर्यभट ने बनाई पहली ज्या तालिका', mai: 'आर्यभट ने बनाई पहली ज्या तालिका', mr: 'आर्यभट ने बनाई पहली ज्या तालिका', ta: 'ஆர்யபட்டா முதல் சைன் அட்டவணையை உருவாக்கினார்', te: 'ఆర్యభట్ట మొదటి సైన్ పట్టికను రూపొందించాడు', bn: 'আর্যভট্ট প্রথম সাইন টেবিল তৈরি করেছিলেন', kn: 'ಆರ್ಯಭಟ ಮೊದಲ ಸೈನ್ ಕೋಷ್ಟಕವನ್ನು ರಚಿಸಿದರು', gu: 'આર્યભટ્ટે પ્રથમ સાઇન ટેબલ બનાવ્યું' },
        body: { en: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', hi: '499 ई. में आर्यभट ने 3.75 अंश के अंतराल पर 24 ज्या मान संकलित किए — सम्पूर्ण आधुनिक त्रिकोणमिति की नींव।', sa: '499 ई. में आर्यभट ने 3.75 अंश के अंतराल पर 24 ज्या मान संकलित किए — सम्पूर्ण आधुनिक त्रिकोणमिति की नींव।', mai: '499 ई. में आर्यभट ने 3.75 अंश के अंतराल पर 24 ज्या मान संकलित किए — सम्पूर्ण आधुनिक त्रिकोणमिति की नींव।', mr: '499 ई. में आर्यभट ने 3.75 अंश के अंतराल पर 24 ज्या मान संकलित किए — सम्पूर्ण आधुनिक त्रिकोणमिति की नींव।', ta: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', te: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', bn: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', kn: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', gu: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.' },
        stat: '499 CE',
        bgColor: '#1a1040',
      },
      {
        type: 'comparison',
        heading: { en: 'The Great Mistranslation', hi: 'महान भ्रांत अनुवाद', sa: 'महान भ्रांत अनुवाद', mai: 'महान भ्रांत अनुवाद', mr: 'महान भ्रांत अनुवाद', ta: 'பெரும் தவறான மொழிபெயர்ப்பு', te: 'గొప్ప తప్పుడు అనువాదం', bn: 'মহান ভুল অনুবাদ', kn: 'ಮಹಾನ್ ತಪ್ಪು ಅನುವಾದ', gu: 'મહાન ખોટો અનુવાદ' },
        body: { en: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', hi: 'ज्या → जीब (अरबी में "य" नहीं) → जैब (अरबी में "जेब") → Sinus (लैटिन में "जेब") → Sine। चार चरण, तीन भाषाएँ, एक भूल।', sa: 'ज्या → जीब (अरबी में "य" नहीं) → जैब (अरबी में "जेब") → Sinus (लैटिन में "जेब") → Sine। चार चरण, तीन भाषाएँ, एक भूल।', mai: 'ज्या → जीब (अरबी में "य" नहीं) → जैब (अरबी में "जेब") → Sinus (लैटिन में "जेब") → Sine। चार चरण, तीन भाषाएँ, एक भूल।', mr: 'ज्या → जीब (अरबी में "य" नहीं) → जैब (अरबी में "जेब") → Sinus (लैटिन में "जेब") → Sine। चार चरण, तीन भाषाएँ, एक भूल।', ta: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', te: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', bn: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', kn: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', gu: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'Accurate to 4 decimal places', hi: '4 दशमलव स्थानों तक सटीक', sa: '4 दशमलव स्थानों तक सटीक', mai: '4 दशमलव स्थानों तक सटीक', mr: '4 दशमलव स्थानों तक सटीक', ta: '4 தசம இடங்களுக்கு துல்லியம்', te: '4 దశాంశ స్థానాల వరకు ఖచ్చితం', bn: '৪ দশমিক স্থান পর্যন্ত নির্ভুল', kn: '4 ದಶಮಾಂಶ ಸ್ಥಾನಗಳಿಗೆ ನಿಖರ', gu: '4 દશાંશ સ્થાનો સુધી ચોક્કસ' },
        body: { en: 'Aryabhata\'s 24 values achieved 99.97% accuracy — computed entirely by hand, 1,500 years ago.', hi: 'आर्यभट के 24 मान 99.97% सटीक थे — पूर्णतः हस्तगणना द्वारा, 1,500 वर्ष पहले।' },
        stat: '99.97%',
        bgColor: '#0a2a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Greeks used full chords. Indians invented the HALF-chord.', hi: 'यूनानियों ने पूर्ण जीवा प्रयोग की। भारतीयों ने अर्धज्या का आविष्कार किया।', sa: 'यूनानियों ने पूर्ण जीवा प्रयोग की। भारतीयों ने अर्धज्या का आविष्कार किया।', mai: 'यूनानियों ने पूर्ण जीवा प्रयोग की। भारतीयों ने अर्धज्या का आविष्कार किया।', mr: 'यूनानियों ने पूर्ण जीवा प्रयोग की। भारतीयों ने अर्धज्या का आविष्कार किया।', ta: 'கிரேக்கர்கள் முழு நாணை பயன்படுத்தினர். இந்தியர்கள் அரை-நாணை கண்டுபிடித்தனர்.', te: 'గ్రీకులు పూర్తి తీగలను ఉపయోగించారు. భారతీయులు అర్ధ-తీగను ఆవిష్కరించారు.', bn: 'গ্রিকরা পূর্ণ জ্যা ব্যবহার করত। ভারতীয়রা অর্ধ-জ্যা আবিষ্কার করেছিল।', kn: 'ಗ್ರೀಕರು ಪೂರ್ಣ ಜ್ಯಾಗಳನ್ನು ಬಳಸಿದರು. ಭಾರತೀಯರು ಅರ್ಧ-ಜ್ಯಾವನ್ನು ಆವಿಷ್ಕರಿಸಿದರು.', gu: 'ગ્રીકો પૂર્ણ જીવા વાપરતા. ભારતીયોએ અર્ધ-જીવા શોધી.' },
        body: { en: 'Ptolemy\'s chord tables required dividing by 2 every time. The Indian insight of using the half-chord directly was the breakthrough that made trigonometry practical.', hi: 'टॉलेमी की जीवा तालिकाओं में हर बार 2 से भाग देना पड़ता था। अर्धज्या का सीधा प्रयोग वह सफलता थी जिसने त्रिकोणमिति को व्यावहारिक बनाया।' },
        bgColor: '#1a0a30',
      },
      {
        type: 'quote',
        heading: { en: 'Every GPS satellite uses Aryabhata\'s invention', hi: 'हर GPS उपग्रह आर्यभट के आविष्कार का उपयोग करता है' },
        body: { en: 'Navigation, 3D graphics, signal processing, music compression — the sine function is everywhere. And it started with a bowstring.', hi: 'नौवहन, 3D ग्राफ़िक्स, सिग्नल प्रोसेसिंग, संगीत संपीड़न — ज्या फ़ंक्शन सर्वत्र है। और यह एक धनुष की प्रत्यंचा से शुरू हुआ।' },
        sourceText: { en: 'Modern application', hi: 'आधुनिक उपयोग', sa: 'आधुनिक उपयोग', mai: 'आधुनिक उपयोग', mr: 'आधुनिक उपयोग', ta: 'நவீன பயன்பாடு', te: 'ఆధునిక అనువర్తనం', bn: 'আধুনিক প্রয়োগ', kn: 'ಆಧುನಿಕ ಅನ್ವಯ', gu: 'આધુનિક ઉપયોગ' },
        bgColor: '#0a1a2a',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'முழு கதையைப் படியுங்கள்', te: 'పూర్తి కథ చదవండి', bn: 'পুরো গল্প পড়ুন', kn: 'ಪೂರ್ಣ ಕಥೆ ಓದಿ', gu: 'સંપૂર્ણ વાર્તા વાંચો' },
        body: { en: 'Discover how a Sanskrit bowstring became the world\'s most important mathematical function.', hi: 'जानें कैसे एक संस्कृत धनुष-प्रत्यंचा बनी विश्व का सबसे महत्वपूर्ण गणितीय फ़ंक्शन।' },
        bgColor: '#1a1040',
      },
    ],
  },

  /* ── Story 2: Zero Was Indian ── */
  {
    slug: 'zero-was-indian',
    title: {
      en: 'Zero — The Most Dangerous Idea in History',
      hi: 'शून्य — इतिहास का सबसे खतरनाक विचार',
    },
    description: {
      en: 'Brahmagupta defined zero as a number in 628 CE. Europe banned Arabic numerals in 1299. The most important invention in mathematics.',
      hi: 'ब्रह्मगुप्त ने 628 ई. में शून्य को एक संख्या के रूप में परिभाषित किया।',
    },
    ctaUrl: '/learn/contributions/zero',
    slides: [
      {
        type: 'title',
        heading: { en: 'ZERO\nTHE MOST DANGEROUS\nIDEA IN HISTORY', hi: 'शून्य\nइतिहास का सबसे\nखतरनाक विचार', sa: 'शून्य\nइतिहास का सबसे\nखतरनाक विचार', mai: 'शून्य\nइतिहास का सबसे\nखतरनाक विचार', mr: 'शून्य\nइतिहास का सबसे\nखतरनाक विचार', ta: 'பூஜ்யம்\nவரலாற்றின் மிக ஆபத்தான\nகருத்து', te: 'సున్నా\nచరిత్రలో అత్యంత ప్రమాదకరమైన\nఆలోచన', bn: 'শূন্য\nইতিহাসের সবচেয়ে বিপজ্জনক\nধারণা', kn: 'ಶೂನ್ಯ\nಇತಿಹಾಸದ ಅತ್ಯಂತ ಅಪಾಯಕಾರಿ\nಆಲೋಚನೆ', gu: 'શૂન્ય\nઈતિહાસનો સૌથી ખતરનાક\nવિચાર' },
        bgColor: '#0a0a20',
      },
      {
        type: 'fact',
        heading: { en: 'Brahmagupta defined zero as a NUMBER', hi: 'ब्रह्मगुप्त ने शून्य को संख्या के रूप में परिभाषित किया', sa: 'ब्रह्मगुप्त ने शून्य को संख्या के रूप में परिभाषित किया', mai: 'ब्रह्मगुप्त ने शून्य को संख्या के रूप में परिभाषित किया', mr: 'ब्रह्मगुप्त ने शून्य को संख्या के रूप में परिभाषित किया', ta: 'பிரம்மகுப்தா பூஜ்யத்தை ஒரு எண்ணாக வரையறுத்தார்', te: 'బ్రహ్మగుప్తుడు సున్నాను ఒక సంఖ్యగా నిర్వచించాడు', bn: 'ব্রহ্মগুপ্ত শূন্যকে একটি সংখ্যা হিসেবে সংজ্ঞায়িত করেছিলেন', kn: 'ಬ್ರಹ್ಮಗುಪ್ತ ಶೂನ್ಯವನ್ನು ಒಂದು ಸಂಖ್ಯೆ ಎಂದು ವ್ಯಾಖ್ಯಾನಿಸಿದರು', gu: 'બ્રહ્મગુપ્તે શૂન્યને એક સંખ્યા તરીકે વ્યાખ્યાયિત કર્યું' },
        body: { en: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', hi: '628 ई. में, अपने ब्राह्मस्फुटसिद्धांत में, ब्रह्मगुप्त ने शून्य के साथ अंकगणित के पहले नियम लिखे।', sa: '628 ई. में, अपने ब्राह्मस्फुटसिद्धांत में, ब्रह्मगुप्त ने शून्य के साथ अंकगणित के पहले नियम लिखे।', mai: '628 ई. में, अपने ब्राह्मस्फुटसिद्धांत में, ब्रह्मगुप्त ने शून्य के साथ अंकगणित के पहले नियम लिखे।', mr: '628 ई. में, अपने ब्राह्मस्फुटसिद्धांत में, ब्रह्मगुप्त ने शून्य के साथ अंकगणित के पहले नियम लिखे।', ta: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', te: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', bn: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', kn: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', gu: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.' },
        stat: '628 CE',
        bgColor: '#1a1040',
      },
      {
        type: 'quote',
        heading: { en: 'शून्यं शून्येन संयुक्तं शून्यम्', hi: 'शून्यं शून्येन संयुक्तं शून्यम्', sa: 'शून्यं शून्येन संयुक्तं शून्यम्', mai: 'शून्यं शून्येन संयुक्तं शून्यम्', mr: 'शून्यं शून्येन संयुक्तं शून्यम्', ta: 'शून्यं शून्येन संयुक्तं शून्यम्', te: 'शून्यं शून्येन संयुक्तं शून्यम्', bn: 'शून्यं शून्येन संयुक्तं शून्यम्', kn: 'शून्यं शून्येन संयुक्तं शून्यम्', gu: 'शून्यं शून्येन संयुक्तं शून्यम्' },
        body: { en: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', hi: '"शून्य में शून्य जोड़ने पर शून्य।" — ब्रह्मगुप्त ने शून्यता के नियम लिखे।', sa: '"शून्य में शून्य जोड़ने पर शून्य।" — ब्रह्मगुप्त ने शून्यता के नियम लिखे।', mai: '"शून्य में शून्य जोड़ने पर शून्य।" — ब्रह्मगुप्त ने शून्यता के नियम लिखे।', mr: '"शून्य में शून्य जोड़ने पर शून्य।" — ब्रह्मगुप्त ने शून्यता के नियम लिखे।', ta: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', te: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', bn: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', kn: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', gu: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.' },
        sourceText: { en: 'Brahmasphutasiddhanta, 628 CE', hi: 'ब्राह्मस्फुटसिद्धांत, 628 ई.', sa: 'ब्राह्मस्फुटसिद्धांत, 628 ई.', mai: 'ब्राह्मस्फुटसिद्धांत, 628 ई.', mr: 'ब्राह्मस्फुटसिद्धांत, 628 ई.', ta: 'பிரம்மஸ்புடசித்தாந்தம், 628 CE', te: 'బ్రహ్మస్ఫుటసిద్ధాంతం, 628 CE', bn: 'ব্রহ্মস্ফুটসিদ্ধান্ত, 628 CE', kn: 'ಬ್ರಹ್ಮಸ್ಫುಟಸಿದ್ಧಾಂತ, 628 CE', gu: 'બ્રહ્મસ્ફુટસિદ્ધાંત, 628 CE' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'Florence BANNED Arabic numerals in 1299', hi: 'फ्लोरेंस ने 1299 में अरबी अंक प्रतिबंधित किए', sa: 'फ्लोरेंस ने 1299 में अरबी अंक प्रतिबंधित किए', mai: 'फ्लोरेंस ने 1299 में अरबी अंक प्रतिबंधित किए', mr: 'फ्लोरेंस ने 1299 में अरबी अंक प्रतिबंधित किए', ta: 'ஃபிளாரன்ஸ் 1299-ல் அரேபிய எண்களைத் தடை செய்தது', te: 'ఫ్లోరెన్స్ 1299లో అరబిక్ సంఖ్యలను నిషేధించింది', bn: 'ফ্লোরেন্স 1299 সালে আরবি সংখ্যা নিষিদ্ধ করেছিল', kn: 'ಫ್ಲಾರೆನ್ಸ್ 1299ರಲ್ಲಿ ಅರೇಬಿಕ್ ಸಂಖ್ಯೆಗಳನ್ನು ನಿಷೇಧಿಸಿತು', gu: 'ફ્લોરેન્સે 1299માં અરબી અંકો પર પ્રતિબંધ મૂક્યો' },
        body: { en: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', hi: 'यूरोपीय व्यापारियों को डर था कि नई संख्याओं में जालसाजी आसान होगी। फ्लोरेंस ने इन्हें प्रतिबंधित किया।', sa: 'यूरोपीय व्यापारियों को डर था कि नई संख्याओं में जालसाजी आसान होगी। फ्लोरेंस ने इन्हें प्रतिबंधित किया।', mai: 'यूरोपीय व्यापारियों को डर था कि नई संख्याओं में जालसाजी आसान होगी। फ्लोरेंस ने इन्हें प्रतिबंधित किया।', mr: 'यूरोपीय व्यापारियों को डर था कि नई संख्याओं में जालसाजी आसान होगी। फ्लोरेंस ने इन्हें प्रतिबंधित किया।', ta: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', te: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', bn: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', kn: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', gu: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.' },
        stat: 'BANNED',
        bgColor: '#2a0a0a',
      },
      {
        type: 'comparison',
        heading: { en: 'The Journey of Zero', hi: 'शून्य की यात्रा', sa: 'शून्य की यात्रा', mai: 'शून्य की यात्रा', mr: 'शून्य की यात्रा', ta: 'பூஜ்யத்தின் பயணம்', te: 'సున్నా ప్రయాణం', bn: 'শূন্যের যাত্রা', kn: 'ಶೂನ್ಯದ ಪ್ರಯಾಣ', gu: 'શૂન્યની યાત્રા' },
        body: { en: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', hi: 'भारत (628 ई.) → बगदाद (825 ई.) → यूरोप (1202 ई.)। शून्य को भारत से यूरोप पहुँचने में लगभग 600 वर्ष लगे।', sa: 'भारत (628 ई.) → बगदाद (825 ई.) → यूरोप (1202 ई.)। शून्य को भारत से यूरोप पहुँचने में लगभग 600 वर्ष लगे।', mai: 'भारत (628 ई.) → बगदाद (825 ई.) → यूरोप (1202 ई.)। शून्य को भारत से यूरोप पहुँचने में लगभग 600 वर्ष लगे।', mr: 'भारत (628 ई.) → बगदाद (825 ई.) → यूरोप (1202 ई.)। शून्य को भारत से यूरोप पहुँचने में लगभग 600 वर्ष लगे।', ta: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', te: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', bn: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', kn: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', gu: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Without zero: no binary, no computers, no internet', hi: 'शून्य के बिना: न बाइनरी, न कंप्यूटर, न इंटरनेट', sa: 'शून्य के बिना: न बाइनरी, न कंप्यूटर, न इंटरनेट', mai: 'शून्य के बिना: न बाइनरी, न कंप्यूटर, न इंटरनेट', mr: 'शून्य के बिना: न बाइनरी, न कंप्यूटर, न इंटरनेट', ta: 'பூஜ்யம் இல்லாமல்: பைனரி இல்லை, கணினிகள் இல்லை, இணையம் இல்லை', te: 'సున్నా లేకుండా: బైనరీ లేదు, కంప్యూటర్లు లేవు, ఇంటర్నెట్ లేదు', bn: 'শূন্য ছাড়া: বাইনারি নেই, কম্পিউটার নেই, ইন্টারনেট নেই', kn: 'ಶೂನ್ಯ ಇಲ್ಲದೆ: ಬೈನರಿ ಇಲ್ಲ, ಕಂಪ್ಯೂಟರ್‌ಗಳಿಲ್ಲ, ಇಂಟರ್ನೆಟ್ ಇಲ್ಲ', gu: 'શૂન્ય વિના: બાઈનરી નહીં, કમ્પ્યુટર નહીં, ઈન્ટરનેટ નહીં' },
        body: { en: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', hi: 'हर डिजिटल उपकरण 0 और 1 पर चलता है। बाइनरी कोड, बूलियन तर्क, डिजिटल सर्किट — सब शून्य के बिना असंभव।', sa: 'हर डिजिटल उपकरण 0 और 1 पर चलता है। बाइनरी कोड, बूलियन तर्क, डिजिटल सर्किट — सब शून्य के बिना असंभव।', mai: 'हर डिजिटल उपकरण 0 और 1 पर चलता है। बाइनरी कोड, बूलियन तर्क, डिजिटल सर्किट — सब शून्य के बिना असंभव।', mr: 'हर डिजिटल उपकरण 0 और 1 पर चलता है। बाइनरी कोड, बूलियन तर्क, डिजिटल सर्किट — सब शून्य के बिना असंभव।', ta: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', te: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', bn: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', kn: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', gu: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.' },
        bgColor: '#0a2020',
      },
      {
        type: 'quote',
        heading: { en: 'The most important invention in mathematics. Period.', hi: 'गणित का सबसे महत्वपूर्ण आविष्कार। बस।', sa: 'गणित का सबसे महत्वपूर्ण आविष्कार। बस।', mai: 'गणित का सबसे महत्वपूर्ण आविष्कार। बस।', mr: 'गणित का सबसे महत्वपूर्ण आविष्कार। बस।', ta: 'கணிதத்தின் மிக முக்கியமான கண்டுபிடிப்பு. முற்றுப்புள்ளி.', te: 'గణితంలో అత్యంత ముఖ్యమైన ఆవిష్కరణ.', bn: 'গণিতের সবচেয়ে গুরুত্বপূর্ণ আবিষ্কার।', kn: 'ಗಣಿತದ ಅತ್ಯಂತ ಮಹತ್ವದ ಆವಿಷ್ಕಾರ.', gu: 'ગણિતની સૌથી મહત્ત્વની શોધ.' },
        body: { en: 'Without zero, there is no place-value system. Without place-value, there are no large calculations. Without large calculations, there is no modern science.', hi: 'शून्य के बिना स्थानीय मान प्रणाली नहीं। स्थानीय मान के बिना बड़ी गणनाएँ नहीं। बड़ी गणनाओं के बिना आधुनिक विज्ञान नहीं।', sa: 'शून्य के बिना स्थानीय मान प्रणाली नहीं। स्थानीय मान के बिना बड़ी गणनाएँ नहीं। बड़ी गणनाओं के बिना आधुनिक विज्ञान नहीं।', mai: 'शून्य के बिना स्थानीय मान प्रणाली नहीं। स्थानीय मान के बिना बड़ी गणनाएँ नहीं। बड़ी गणनाओं के बिना आधुनिक विज्ञान नहीं।', mr: 'शून्य के बिना स्थानीय मान प्रणाली नहीं। स्थानीय मान के बिना बड़ी गणनाएँ नहीं। बड़ी गणनाओं के बिना आधुनिक विज्ञान नहीं।', ta: 'பூஜ்யம் இல்லாமல் இடமதிப்பு முறை இல்லை. இடமதிப்பு இல்லாமல் பெரிய கணக்குகள் இல்லை. பெரிய கணக்குகள் இல்லாமல் நவீன விஞ்ஞானம் இல்லை.', te: 'సున్నా లేకుండా స్థానవిలువ వ్యవస్థ లేదు. స్థానవిలువ లేకుండా పెద్ద లెక్కలు లేవు. పెద్ద లెక్కలు లేకుండా ఆధునిక విజ్ఞానం లేదు.', bn: 'শূন্য ছাড়া স্থানমূল্য পদ্ধতি নেই। স্থানমূল্য ছাড়া বড় গণনা নেই। বড় গণনা ছাড়া আধুনিক বিজ্ঞান নেই।', kn: 'ಶೂನ್ಯ ಇಲ್ಲದೆ ಸ್ಥಾನಮೌಲ್ಯ ವ್ಯವಸ್ಥೆ ಇಲ್ಲ. ಸ್ಥಾನಮೌಲ್ಯ ಇಲ್ಲದೆ ದೊಡ್ಡ ಲೆಕ್ಕಾಚಾರಗಳಿಲ್ಲ. ದೊಡ್ಡ ಲೆಕ್ಕಾಚಾರಗಳಿಲ್ಲದೆ ಆಧುನಿಕ ವಿಜ್ಞಾನವಿಲ್ಲ.', gu: 'શૂન્ય વિના સ્થાનમૂલ્ય પ્રણાલી નથી. સ્થાનમૂલ્ય વિના મોટી ગણતરીઓ નથી. મોટી ગણતરીઓ વિના આધુનિક વિજ્ઞાન નથી.' },
        bgColor: '#1a0a30',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'முழு கதையைப் படியுங்கள்', te: 'పూర్తి కథ చదవండి', bn: 'পুরো গল্প পড়ুন', kn: 'ಪೂರ್ಣ ಕಥೆ ಓದಿ', gu: 'સંપૂર્ણ વાર્તા વાંચો' },
        body: { en: 'How a concept that terrified Europe became the foundation of all modern technology.', hi: 'कैसे एक अवधारणा जिसने यूरोप को भयभीत किया, सारी आधुनिक प्रौद्योगिकी की नींव बनी।', sa: 'कैसे एक अवधारणा जिसने यूरोप को भयभीत किया, सारी आधुनिक प्रौद्योगिकी की नींव बनी।', mai: 'कैसे एक अवधारणा जिसने यूरोप को भयभीत किया, सारी आधुनिक प्रौद्योगिकी की नींव बनी।', mr: 'कैसे एक अवधारणा जिसने यूरोप को भयभीत किया, सारी आधुनिक प्रौद्योगिकी की नींव बनी।', ta: 'ஐரோப்பாவை பயமுறுத்திய ஒரு கருத்து எவ்வாறு அனைத்து நவீன தொழில்நுட்பத்தின் அடித்தளமாக மாறியது.', te: 'ఐరోపాను భయపెట్టిన ఒక భావన ఎలా అన్ని ఆధునిక సాంకేతికత యొక్క పునాదిగా మారింది.', bn: 'যে ধারণা ইউরোপকে ভীত করেছিল তা কীভাবে সমস্ত আধুনিক প্রযুক্তির ভিত্তি হয়ে উঠল।', kn: 'ಯೂರೋಪ್ ಅನ್ನು ಭಯಗೊಳಿಸಿದ ಒಂದು ಪರಿಕಲ್ಪನೆ ಎಲ್ಲಾ ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನದ ಅಡಿಪಾಯವಾಗಿ ಹೇಗೆ ಬದಲಾಯಿತು.', gu: 'યુરોપને ડરાવતી એક વિભાવના કેવી રીતે તમામ આધુનિક ટેકનોલોજીનો પાયો બની.' },
        bgColor: '#0a0a20',
      },
    ],
  },

  /* ── Story 3: Calculus Before Newton ── */
  {
    slug: 'calculus-before-newton',
    title: {
      en: 'Calculus Was Invented in Kerala',
      hi: 'कलन का आविष्कार केरल में हुआ',
    },
    description: {
      en: 'Madhava of Sangamagrama discovered infinite series around 1350 CE — 316 years before Newton and Leibniz.',
      hi: 'संगमग्राम के माधव ने 1350 ई. के आसपास अनंत श्रेणी की खोज की — न्यूटन और लाइबनिट्ज़ से 316 वर्ष पहले।',
    },
    ctaUrl: '/learn/contributions/kerala-school',
    slides: [
      {
        type: 'title',
        heading: { en: 'CALCULUS WAS\nINVENTED IN KERALA', hi: 'कलन का आविष्कार\nकेरल में हुआ', sa: 'कलन का आविष्कार\nकेरल में हुआ', mai: 'कलन का आविष्कार\nकेरल में हुआ', mr: 'कलन का आविष्कार\nकेरल में हुआ', ta: 'கணித நுண்கணிதம்\nகேரளாவில் கண்டுபிடிக்கப்பட்டது', te: 'కాలిక్యులస్\nకేరళలో ఆవిష్కరించబడింది', bn: 'ক্যালকুলাস\nকেরালায় আবিষ্কৃত হয়েছিল', kn: 'ಕಲನಶಾಸ್ತ್ರ\nಕೇರಳದಲ್ಲಿ ಆವಿಷ್ಕರಿಸಲಾಯಿತು', gu: 'કેલ્ક્યુલસ\nકેરળમાં શોધાયું' },
        bgColor: '#0a2a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Madhava discovered infinite series', hi: 'माधव ने अनंत श्रेणी की खोज की', sa: 'माधव ने अनंत श्रेणी की खोज की', mai: 'माधव ने अनंत श्रेणी की खोज की', mr: 'माधव ने अनंत श्रेणी की खोज की', ta: 'மாதவா எல்லையில்லா தொடர்களைக் கண்டறிந்தார்', te: 'మాధవ అనంత శ్రేణులను కనుగొన్నాడు', bn: 'মাধব অসীম ধারা আবিষ্কার করেছিলেন', kn: 'ಮಾಧವ ಅನಂತ ಸರಣಿಗಳನ್ನು ಕಂಡುಹಿಡಿದರು', gu: 'માધવે અનંત શ્રેણીઓ શોધી' },
        body: { en: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', hi: '1350 ई. के आसपास, केरल के संगमग्राम के माधव ने sine, cosine और arctangent की अनंत श्रेणी विस्तार विकसित किए — कलन के मूल उपकरण।', sa: '1350 ई. के आसपास, केरल के संगमग्राम के माधव ने sine, cosine और arctangent की अनंत श्रेणी विस्तार विकसित किए — कलन के मूल उपकरण।', mai: '1350 ई. के आसपास, केरल के संगमग्राम के माधव ने sine, cosine और arctangent की अनंत श्रेणी विस्तार विकसित किए — कलन के मूल उपकरण।', mr: '1350 ई. के आसपास, केरल के संगमग्राम के माधव ने sine, cosine और arctangent की अनंत श्रेणी विस्तार विकसित किए — कलन के मूल उपकरण।', ta: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', te: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', bn: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', kn: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', gu: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.' },
        stat: '1350',
        bgColor: '#1a1040',
      },
      {
        type: 'fact',
        heading: { en: 'The Madhava-Leibniz Series', hi: 'माधव-लाइबनिट्ज़ श्रेणी', sa: 'माधव-लाइबनिट्ज़ श्रेणी', mai: 'माधव-लाइबनिट्ज़ श्रेणी', mr: 'माधव-लाइबनिट्ज़ श्रेणी', ta: 'மாதவ-லைப்னிட்ஸ் தொடர்', te: 'మాధవ-లైబ్నిజ్ శ్రేణి', bn: 'মাধব-লাইবনিৎস সিরিজ', kn: 'ಮಾಧವ-ಲೈಬ್ನಿಟ್ಸ್ ಸರಣಿ', gu: 'માધવ-લાઇબનિટ્ઝ શ્રેણી' },
        body: { en: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', hi: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... माधव ने यह सूत्र लाइबनिट्ज़ द्वारा यूरोप में प्रकाशित करने से तीन शताब्दी पहले खोजा।', sa: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... माधव ने यह सूत्र लाइबनिट्ज़ द्वारा यूरोप में प्रकाशित करने से तीन शताब्दी पहले खोजा।', mai: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... माधव ने यह सूत्र लाइबनिट्ज़ द्वारा यूरोप में प्रकाशित करने से तीन शताब्दी पहले खोजा।', mr: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... माधव ने यह सूत्र लाइबनिट्ज़ द्वारा यूरोप में प्रकाशित करने से तीन शताब्दी पहले खोजा।', ta: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', te: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', bn: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', kn: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', gu: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'He computed π to 11 decimal places', hi: 'उन्होंने π को 11 दशमलव स्थानों तक गणना किया', sa: 'उन्होंने π को 11 दशमलव स्थानों तक गणना किया', mai: 'उन्होंने π को 11 दशमलव स्थानों तक गणना किया', mr: 'उन्होंने π को 11 दशमलव स्थानों तक गणना किया', ta: 'He computed π to 11 decimal places', te: 'He computed π to 11 decimal places', bn: 'He computed π to 11 decimal places', kn: 'He computed π to 11 decimal places', gu: 'He computed π to 11 decimal places' },
        body: { en: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', hi: 'अपनी अनंत श्रेणी और सुधार पदों का उपयोग करते हुए, माधव ने π = 3.14159265359 प्राप्त किया — शताब्दियों तक अटूट रिकॉर्ड।', sa: 'अपनी अनंत श्रेणी और सुधार पदों का उपयोग करते हुए, माधव ने π = 3.14159265359 प्राप्त किया — शताब्दियों तक अटूट रिकॉर्ड।', mai: 'अपनी अनंत श्रेणी और सुधार पदों का उपयोग करते हुए, माधव ने π = 3.14159265359 प्राप्त किया — शताब्दियों तक अटूट रिकॉर्ड।', mr: 'अपनी अनंत श्रेणी और सुधार पदों का उपयोग करते हुए, माधव ने π = 3.14159265359 प्राप्त किया — शताब्दियों तक अटूट रिकॉर्ड।', ta: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', te: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', bn: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', kn: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', gu: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.' },
        stat: '11 decimals',
        bgColor: '#2a1a0a',
      },
      {
        type: 'comparison',
        heading: { en: '316 Years Earlier', hi: '316 वर्ष पहले', sa: '316 वर्ष पहले', mai: '316 वर्ष पहले', mr: '316 वर्ष पहले', ta: '316 ஆண்டுகள் முன்னதாக', te: '316 సంవత్సరాల ముందు', bn: '৩১৬ বছর আগে', kn: '316 ವರ್ಷಗಳ ಹಿಂದೆ', gu: '316 વર્ષ પહેલાં' },
        body: { en: 'Madhava (~1350 CE) vs Newton/Leibniz (~1666 CE). The Kerala School of Mathematics had calculus-like tools three centuries before Europe.', hi: 'माधव (~1350 ई.) बनाम न्यूटन/लाइबनिट्ज़ (~1666 ई.)। केरल गणित विद्यालय के पास यूरोप से तीन शताब्दी पहले कलन-सदृश उपकरण थे।', sa: 'माधव (~1350 ई.) बनाम न्यूटन/लाइबनिट्ज़ (~1666 ई.)। केरल गणित विद्यालय के पास यूरोप से तीन शताब्दी पहले कलन-सदृश उपकरण थे।', mai: 'माधव (~1350 ई.) बनाम न्यूटन/लाइबनिट्ज़ (~1666 ई.)। केरल गणित विद्यालय के पास यूरोप से तीन शताब्दी पहले कलन-सदृश उपकरण थे।', mr: 'माधव (~1350 ई.) बनाम न्यूटन/लाइबनिट्ज़ (~1666 ई.)। केरल गणित विद्यालय के पास यूरोप से तीन शताब्दी पहले कलन-सदृश उपकरण थे।', ta: 'மாதவா (~1350 CE) vs நியூட்டன்/லைப்னிட்ஸ் (~1666 CE). கேரளா கணித பள்ளி ஐரோப்பாவுக்கு மூன்று நூற்றாண்டுகள் முன்னதாகவே நுண்கணித கருவிகளைக் கொண்டிருந்தது.', te: 'మాధవ (~1350 CE) vs న్యూటన్/లైబ్నిజ్ (~1666 CE). కేరళ గణిత పాఠశాల ఐరోపా కంటే మూడు శతాబ్దాల ముందుగానే కాలిక్యులస్ సాధనాలను కలిగి ఉంది.', bn: 'মাধব (~1350 CE) vs নিউটন/লাইবনিৎস (~1666 CE)। কেরালা গণিত বিদ্যালয় ইউরোপের তিন শতাব্দী আগে ক্যালকুলাস-সদৃশ সরঞ্জাম ব্যবহার করত।', kn: 'ಮಾಧವ (~1350 CE) vs ನ್ಯೂಟನ್/ಲೈಬ್ನಿಟ್ಸ್ (~1666 CE). ಕೇರಳ ಗಣಿತ ಶಾಲೆ ಯೂರೋಪ್‌ಗಿಂತ ಮೂರು ಶತಮಾನಗಳ ಹಿಂದೆಯೇ ಕಲನಶಾಸ್ತ್ರ ಸಾಧನಗಳನ್ನು ಹೊಂದಿತ್ತು.', gu: 'માધવ (~1350 CE) vs ન્યૂટન/લાઇબનિટ્ઝ (~1666 CE). કેરળ ગણિત શાળા યુરોપના ત્રણ સદીઓ પહેલાં કેલ્ક્યુલસ જેવા સાધનો ધરાવતી હતી.' },
        bgColor: '#1a0a30',
      },
      {
        type: 'fact',
        heading: { en: 'The first calculus TEXTBOOK', hi: 'पहली कलन पाठ्यपुस्तक', sa: 'पहली कलन पाठ्यपुस्तक', mai: 'पहली कलन पाठ्यपुस्तक', mr: 'पहली कलन पाठ्यपुस्तक', ta: 'முதல் கணித நுண்கணிதப் பாடநூல்', te: 'మొదటి కాలిక్యులస్ పాఠ్యపుస్తకం', bn: 'প্রথম ক্যালকুলাস পাঠ্যপুস্তক', kn: 'ಮೊದಲ ಕಲನಶಾಸ್ತ್ರ ಪಠ್ಯಪುಸ್ತಕ', gu: 'પ્રથમ કેલ્ક્યુલસ પાઠ્યપુસ્તક' },
        body: { en: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', hi: 'ज्येष्ठदेव ने 1530 में युक्तिभाषा लिखी — गणितीय प्रमाणों की विस्तृत पाठ्यपुस्तक, जिसमें अनंत श्रेणी की व्युत्पत्तियाँ शामिल हैं।', sa: 'ज्येष्ठदेव ने 1530 में युक्तिभाषा लिखी — गणितीय प्रमाणों की विस्तृत पाठ्यपुस्तक, जिसमें अनंत श्रेणी की व्युत्पत्तियाँ शामिल हैं।', mai: 'ज्येष्ठदेव ने 1530 में युक्तिभाषा लिखी — गणितीय प्रमाणों की विस्तृत पाठ्यपुस्तक, जिसमें अनंत श्रेणी की व्युत्पत्तियाँ शामिल हैं।', mr: 'ज्येष्ठदेव ने 1530 में युक्तिभाषा लिखी — गणितीय प्रमाणों की विस्तृत पाठ्यपुस्तक, जिसमें अनंत श्रेणी की व्युत्पत्तियाँ शामिल हैं।', ta: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', te: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', bn: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', kn: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', gu: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.' },
        bgColor: '#0a2020',
      },
      {
        type: 'quote',
        heading: { en: '"The Leibniz series should be called the Madhava series"', hi: '"लाइबनिट्ज़ श्रेणी को माधव श्रेणी कहा जाना चाहिए"', sa: '"लाइबनिट्ज़ श्रेणी को माधव श्रेणी कहा जाना चाहिए"', mai: '"लाइबनिट्ज़ श्रेणी को माधव श्रेणी कहा जाना चाहिए"', mr: '"लाइबनिट्ज़ श्रेणी को माधव श्रेणी कहा जाना चाहिए"', ta: '"லைப்னிட்ஸ் தொடரை மாதவ தொடர் என்று அழைக்க வேண்டும்"', te: '"లైబ్నిజ్ శ్రేణిని మాధవ శ్రేణి అని పిలవాలి"', bn: '"লাইবনিৎস সিরিজকে মাধব সিরিজ বলা উচিত"', kn: '"ಲೈಬ್ನಿಟ್ಸ್ ಸರಣಿಯನ್ನು ಮಾಧವ ಸರಣಿ ಎಂದು ಕರೆಯಬೇಕು"', gu: '"લાઇબનિટ્ઝ શ્રેણીને માધવ શ્રેણી કહેવી જોઈએ"' },
        body: { en: 'Modern historians of mathematics increasingly acknowledge that these infinite series were discovered in Kerala long before their European "discovery."', hi: 'गणित के आधुनिक इतिहासकार बढ़ते क्रम में स्वीकार करते हैं कि ये अनंत श्रेणियाँ यूरोपीय "खोज" से बहुत पहले केरल में खोजी गई थीं।', sa: 'गणित के आधुनिक इतिहासकार बढ़ते क्रम में स्वीकार करते हैं कि ये अनंत श्रेणियाँ यूरोपीय "खोज" से बहुत पहले केरल में खोजी गई थीं।', mai: 'गणित के आधुनिक इतिहासकार बढ़ते क्रम में स्वीकार करते हैं कि ये अनंत श्रेणियाँ यूरोपीय "खोज" से बहुत पहले केरल में खोजी गई थीं।', mr: 'गणित के आधुनिक इतिहासकार बढ़ते क्रम में स्वीकार करते हैं कि ये अनंत श्रेणियाँ यूरोपीय "खोज" से बहुत पहले केरल में खोजी गई थीं।', ta: 'நவீன கணித வரலாற்றாசிரியர்கள் இந்த எல்லையில்லா தொடர்கள் ஐரோப்பிய "கண்டுபிடிப்புக்கு" நீண்ட காலத்திற்கு முன்னரே கேரளாவில் கண்டறியப்பட்டதை அதிகமாக ஏற்றுக்கொள்கின்றனர்.', te: 'ఆధునిక గణిత చరిత్రకారులు ఈ అనంత శ్రేణులు యూరోపియన్ "ఆవిష్కరణ"కు చాలా ముందుగానే కేరళలో కనుగొనబడ్డాయని ఎక్కువగా అంగీకరిస్తున్నారు.', bn: 'আধুনিক গণিত ঐতিহাসিকরা ক্রমশ স্বীকার করছেন যে এই অসীম ধারাগুলি ইউরোপীয় "আবিষ্কার"-এর অনেক আগেই কেরালায় আবিষ্কৃত হয়েছিল।', kn: 'ಆಧುನಿಕ ಗಣಿತ ಇತಿಹಾಸಕಾರರು ಈ ಅನಂತ ಸರಣಿಗಳು ಯೂರೋಪಿಯನ್ "ಆವಿಷ್ಕಾರ"ಕ್ಕೆ ಬಹಳ ಮೊದಲೇ ಕೇರಳದಲ್ಲಿ ಕಂಡುಹಿಡಿಯಲಾಗಿತ್ತು ಎಂದು ಹೆಚ್ಚಾಗಿ ಒಪ್ಪಿಕೊಳ್ಳುತ್ತಿದ್ದಾರೆ.', gu: 'આધુનિક ગણિત ઈતિહાસકારો વધુને વધુ સ્વીકારી રહ્યા છે કે આ અનંત શ્રેણીઓ યુરોપીય "શોધ" ના ઘણા સમય પહેલાં કેરળમાં શોધાઈ હતી.' },
        sourceText: { en: 'Modern mathematical historians', hi: 'आधुनिक गणित इतिहासकार', sa: 'आधुनिक गणित इतिहासकार', mai: 'आधुनिक गणित इतिहासकार', mr: 'आधुनिक गणित इतिहासकार', ta: 'நவீன கணித வரலாற்றாசிரியர்கள்', te: 'ఆధునిక గణిత చరిత్రకారులు', bn: 'আধুনিক গণিত ঐতিহাসিকরা', kn: 'ಆಧುನಿಕ ಗಣಿತ ಇತಿಹಾಸಕಾರರು', gu: 'આધુનિક ગણિત ઈતિહાસકારો' },
        bgColor: '#1a1040',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'முழு கதையைப் படியுங்கள்', te: 'పూర్తి కథ చదవండి', bn: 'পুরো গল্প পড়ুন', kn: 'ಪೂರ್ಣ ಕಥೆ ಓದಿ', gu: 'સંપૂર્ણ વાર્તા વાંચો' },
        body: { en: 'The Kerala School of Mathematics — India\'s forgotten revolution in calculus.', hi: 'केरल गणित विद्यालय — कलन में भारत की भूली हुई क्रांति।' },
        bgColor: '#0a2a1a',
      },
    ],
  },

  /* ── Story 4: Pythagoras Was Indian ── */
  {
    slug: 'pythagoras-was-indian',
    title: {
      en: 'The "Pythagorean" Theorem — 300 Years Before Pythagoras',
      hi: '"पाइथागोरस" प्रमेय — पाइथागोरस से 300 वर्ष पहले',
    },
    description: {
      en: 'Baudhayana stated the theorem in the Sulba Sutra around 800 BCE, centuries before Pythagoras was born.',
      hi: 'बौधायन ने यह प्रमेय शुल्ब सूत्र में ~800 ई.पू. में कहा, पाइथागोरस के जन्म से शताब्दियों पहले।',
    },
    ctaUrl: '/learn/contributions/pythagoras',
    slides: [
      {
        type: 'title',
        heading: { en: 'THE "PYTHAGOREAN"\nTHEOREM\n300 YEARS BEFORE\nPYTHAGORAS', hi: '"पाइथागोरस" प्रमेय\nपाइथागोरस से\n300 वर्ष पहले', sa: '"पाइथागोरस" प्रमेय\nपाइथागोरस से\n300 वर्ष पहले', mai: '"पाइथागोरस" प्रमेय\nपाइथागोरस से\n300 वर्ष पहले', mr: '"पाइथागोरस" प्रमेय\nपाइथागोरस से\n300 वर्ष पहले', ta: '"பித்தகோரியன்"\nதேற்றம்\nபித்தகோரஸுக்கு\n300 ஆண்டுகள் முன்', te: '"పైథాగరియన్"\nసిద్ధాంతం\nపైథాగరస్ కంటే\n300 సంవత్సరాల ముందు', bn: '"পিথাগোরীয়"\nউপপাদ্য\nপিথাগোরাসের\n300 বছর আগে', kn: '"ಪೈಥಾಗೊರಿಯನ್"\nಪ್ರಮೇಯ\nಪೈಥಾಗೊರಸ್‌ಗಿಂತ\n300 ವರ್ಷ ಮೊದಲು', gu: '"પાયથાગોરિયન"\nપ્રમેય\nપાયથાગોરસના\n300 વર્ષ પહેલાં' },
        bgColor: '#2a0a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Baudhayana stated it in the Sulba Sutra', hi: 'बौधायन ने इसे शुल्ब सूत्र में कहा', sa: 'बौधायन ने इसे शुल्ब सूत्र में कहा', mai: 'बौधायन ने इसे शुल्ब सूत्र में कहा', mr: 'बौधायन ने इसे शुल्ब सूत्र में कहा', ta: 'பௌதாயனா சுல்ப சூத்திரத்தில் இதைக் கூறினார்', te: 'బౌధాయన శుల్బ సూత్రంలో దీన్ని తెలిపాడు', bn: 'বৌধায়ন শুল্ব সূত্রে এটি বলেছিলেন', kn: 'ಬೌಧಾಯನ ಶುಲ್ಬ ಸೂತ್ರದಲ್ಲಿ ಇದನ್ನು ಹೇಳಿದ್ದಾರೆ', gu: 'બૌધાયને શુલ્બ સૂત્રમાં આ કહ્યું' },
        body: { en: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', hi: '~800 ई.पू. में, ऋषि बौधायन ने समकोण और वर्ग बनाने के सटीक नियम लिखे — जिसमें समकोण त्रिभुज की भुजाओं के बीच संबंध शामिल है।', sa: '~800 ई.पू. में, ऋषि बौधायन ने समकोण और वर्ग बनाने के सटीक नियम लिखे — जिसमें समकोण त्रिभुज की भुजाओं के बीच संबंध शामिल है।', mai: '~800 ई.पू. में, ऋषि बौधायन ने समकोण और वर्ग बनाने के सटीक नियम लिखे — जिसमें समकोण त्रिभुज की भुजाओं के बीच संबंध शामिल है।', mr: '~800 ई.पू. में, ऋषि बौधायन ने समकोण और वर्ग बनाने के सटीक नियम लिखे — जिसमें समकोण त्रिभुज की भुजाओं के बीच संबंध शामिल है।', ta: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', te: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', bn: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', kn: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', gu: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.' },
        stat: '800 BCE',
        bgColor: '#1a1040',
      },
      {
        type: 'quote',
        heading: { en: 'The Original Sanskrit', hi: 'मूल संस्कृत', sa: 'मूल संस्कृत', mai: 'मूल संस्कृत', mr: 'मूल संस्कृत', ta: 'மூல சமஸ்கிருதம்', te: 'మూల సంస్కృతం', bn: 'মূল সংস্কৃত', kn: 'ಮೂಲ ಸಂಸ್ಕೃತ', gu: 'મૂળ સંસ્કૃત' },
        body: { en: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', hi: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — आयत का विकर्ण वे दोनों क्षेत्रफल उत्पन्न करता है जो उसकी लंबाई और चौड़ाई अलग-अलग उत्पन्न करते हैं।', sa: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — आयत का विकर्ण वे दोनों क्षेत्रफल उत्पन्न करता है जो उसकी लंबाई और चौड़ाई अलग-अलग उत्पन्न करते हैं।', mai: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — आयत का विकर्ण वे दोनों क्षेत्रफल उत्पन्न करता है जो उसकी लंबाई और चौड़ाई अलग-अलग उत्पन्न करते हैं।', mr: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — आयत का विकर्ण वे दोनों क्षेत्रफल उत्पन्न करता है जो उसकी लंबाई और चौड़ाई अलग-अलग उत्पन्न करते हैं।', ta: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', te: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', bn: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', kn: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', gu: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.' },
        sourceText: { en: 'Baudhayana Sulba Sutra, ~800 BCE', hi: 'बौधायन शुल्ब सूत्र, ~800 ई.पू.', sa: 'बौधायन शुल्ब सूत्र, ~800 ई.पू.', mai: 'बौधायन शुल्ब सूत्र, ~800 ई.पू.', mr: 'बौधायन शुल्ब सूत्र, ~800 ई.पू.', ta: 'பௌதாயன சுல்ப சூத்திரம், ~800 BCE', te: 'బౌధాయన శుల్బ సూత్రం, ~800 BCE', bn: 'বৌধায়ন শুল্ব সূত্র, ~800 BCE', kn: 'ಬೌಧಾಯನ ಶುಲ್ಬ ಸೂತ್ರ, ~800 BCE', gu: 'બૌધાયન શુલ્બ સૂત્ર, ~800 BCE' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'He calculated √2 to 5 decimal places', hi: 'उन्होंने √2 को 5 दशमलव स्थानों तक गणना किया', sa: 'उन्होंने √2 को 5 दशमलव स्थानों तक गणना किया', mai: 'उन्होंने √2 को 5 दशमलव स्थानों तक गणना किया', mr: 'उन्होंने √2 को 5 दशमलव स्थानों तक गणना किया', ta: 'He calculated √2 to 5 decimal places', te: 'He calculated √2 to 5 decimal places', bn: 'He calculated √2 to 5 decimal places', kn: 'He calculated √2 to 5 decimal places', gu: 'He calculated √2 to 5 decimal places' },
        body: { en: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', hi: 'बौधायन ने √2 = 1.41421 दिया — 800 ई.पू. के लिए गणना की एक अद्भुत उपलब्धि, 5 दशमलव स्थानों तक सही।', sa: 'बौधायन ने √2 = 1.41421 दिया — 800 ई.पू. के लिए गणना की एक अद्भुत उपलब्धि, 5 दशमलव स्थानों तक सही।', mai: 'बौधायन ने √2 = 1.41421 दिया — 800 ई.पू. के लिए गणना की एक अद्भुत उपलब्धि, 5 दशमलव स्थानों तक सही।', mr: 'बौधायन ने √2 = 1.41421 दिया — 800 ई.पू. के लिए गणना की एक अद्भुत उपलब्धि, 5 दशमलव स्थानों तक सही।', ta: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', te: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', bn: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', kn: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', gu: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.' },
        stat: '1.41421',
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Built for Vedic Fire Altars', hi: 'वैदिक अग्नि वेदियों के लिए निर्मित', sa: 'वैदिक अग्नि वेदियों के लिए निर्मित', mai: 'वैदिक अग्नि वेदियों के लिए निर्मित', mr: 'वैदिक अग्नि वेदियों के लिए निर्मित', ta: 'வேத யாக குண்டங்களுக்காக கட்டப்பட்டது', te: 'వేద అగ్ని వేదికల కోసం నిర్మించబడింది', bn: 'বৈদিক যজ্ঞবেদির জন্য নির্মিত', kn: 'ವೈದಿಕ ಅಗ್ನಿ ಯಜ್ಞವೇದಿಕೆಗಳಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ', gu: 'વૈદિક અગ્નિ વેદીઓ માટે બનાવાયેલ' },
        body: { en: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', hi: 'शुल्ब सूत्र सटीक ज्यामितीय आकारों की पवित्र अग्नि वेदियों के निर्माण के लिए व्यावहारिक पुस्तिकाएँ थीं।', sa: 'शुल्ब सूत्र सटीक ज्यामितीय आकारों की पवित्र अग्नि वेदियों के निर्माण के लिए व्यावहारिक पुस्तिकाएँ थीं।', mai: 'शुल्ब सूत्र सटीक ज्यामितीय आकारों की पवित्र अग्नि वेदियों के निर्माण के लिए व्यावहारिक पुस्तिकाएँ थीं।', mr: 'शुल्ब सूत्र सटीक ज्यामितीय आकारों की पवित्र अग्नि वेदियों के निर्माण के लिए व्यावहारिक पुस्तिकाएँ थीं।', ta: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', te: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', bn: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', kn: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', gu: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.' },
        bgColor: '#1a0a30',
      },
      {
        type: 'comparison',
        heading: { en: 'The Timeline', hi: 'समयरेखा', sa: 'समयरेखा', mai: 'समयरेखा', mr: 'समयरेखा', ta: 'காலவரிசை', te: 'టైమ్‌లైన్', bn: 'সময়রেখা', kn: 'ಟೈಮ್‌ಲೈನ್', gu: 'સમયરેખા' },
        body: { en: 'Baudhayana (~800 BCE) vs Pythagoras (~500 BCE). The Indian formulation predates the Greek one by roughly 300 years.', hi: 'बौधायन (~800 ई.पू.) बनाम पाइथागोरस (~500 ई.पू.)। भारतीय सूत्रीकरण यूनानी से लगभग 300 वर्ष पहले है।', sa: 'बौधायन (~800 ई.पू.) बनाम पाइथागोरस (~500 ई.पू.)। भारतीय सूत्रीकरण यूनानी से लगभग 300 वर्ष पहले है।', mai: 'बौधायन (~800 ई.पू.) बनाम पाइथागोरस (~500 ई.पू.)। भारतीय सूत्रीकरण यूनानी से लगभग 300 वर्ष पहले है।', mr: 'बौधायन (~800 ई.पू.) बनाम पाइथागोरस (~500 ई.पू.)। भारतीय सूत्रीकरण यूनानी से लगभग 300 वर्ष पहले है।', ta: 'பௌதாயனா (~800 BCE) vs பித்தகோரஸ் (~500 BCE). இந்திய சூத்திரம் கிரேக்க சூத்திரத்தை சுமார் 300 ஆண்டுகள் முன்னரே தோன்றியது.', te: 'బౌధాయన (~800 BCE) vs పైథాగరస్ (~500 BCE). భారతీయ సూత్రీకరణ గ్రీకు దానికంటే సుమారు 300 సంవత్సరాలు ముందుగానే వచ్చింది.', bn: 'বৌধায়ন (~800 BCE) vs পিথাগোরাস (~500 BCE)। ভারতীয় সূত্র গ্রিক সূত্রের প্রায় 300 বছর আগের।', kn: 'ಬೌಧಾಯನ (~800 BCE) vs ಪೈಥಾಗೊರಸ್ (~500 BCE). ಭಾರತೀಯ ಸೂತ್ರೀಕರಣ ಗ್ರೀಕ್ ಸೂತ್ರಕ್ಕಿಂತ ಸುಮಾರು 300 ವರ್ಷ ಮೊದಲಿನದು.', gu: 'બૌધાયન (~800 BCE) vs પાયથાગોરસ (~500 BCE). ભારતીય સૂત્ર ગ્રીક સૂત્રથી લગભગ 300 વર્ષ પહેલાંનું છે.' },
        bgColor: '#0a2020',
      },
      {
        type: 'fact',
        heading: { en: 'Pythagoras left no written works', hi: 'पाइथागोरस ने कोई लिखित कार्य नहीं छोड़ा', sa: 'पाइथागोरस ने कोई लिखित कार्य नहीं छोड़ा', mai: 'पाइथागोरस ने कोई लिखित कार्य नहीं छोड़ा', mr: 'पाइथागोरस ने कोई लिखित कार्य नहीं छोड़ा', ta: 'பித்தகோரஸ் எழுதிய படைப்புகள் எதுவும் இல்லை', te: 'పైథాగరస్ ఎటువంటి లిఖిత రచనలు వదల్లేదు', bn: 'পিথাগোরাস কোনো লিখিত রচনা রেখে যাননি', kn: 'ಪೈಥಾಗೊರಸ್ ಯಾವುದೇ ಲಿಖಿತ ಕೃತಿಗಳನ್ನು ಬಿಟ್ಟಿಲ್ಲ', gu: 'પાયથાગોરસે કોઈ લેખિત કૃતિ છોડી નથી' },
        body: { en: 'Everything attributed to Pythagoras was recorded by followers centuries later. The Sulba Sutras, by contrast, are dated physical texts.', hi: 'पाइथागोरस को श्रेय दी गई हर बात शताब्दियों बाद अनुयायियों ने दर्ज की। शुल्ब सूत्र, इसके विपरीत, दिनांकित भौतिक ग्रंथ हैं।', sa: 'पाइथागोरस को श्रेय दी गई हर बात शताब्दियों बाद अनुयायियों ने दर्ज की। शुल्ब सूत्र, इसके विपरीत, दिनांकित भौतिक ग्रंथ हैं।', mai: 'पाइथागोरस को श्रेय दी गई हर बात शताब्दियों बाद अनुयायियों ने दर्ज की। शुल्ब सूत्र, इसके विपरीत, दिनांकित भौतिक ग्रंथ हैं।', mr: 'पाइथागोरस को श्रेय दी गई हर बात शताब्दियों बाद अनुयायियों ने दर्ज की। शुल्ब सूत्र, इसके विपरीत, दिनांकित भौतिक ग्रंथ हैं।', ta: 'பித்தகோரஸுக்கு கூறப்படும் அனைத்தும் நூற்றாண்டுகளுக்குப் பிறகு சீடர்களால் பதிவு செய்யப்பட்டன. மாறாக, சுல்ப சூத்திரங்கள் காலம் குறிக்கப்பட்ட இயற்பியல் நூல்கள்.', te: 'పైథాగరస్‌కు ఆపాదించబడిన అన్నీ శతాబ్దాల తర్వాత అనుచరులచే నమోదు చేయబడ్డాయి. దీనికి భిన్నంగా, శుల్బ సూత్రాలు తేదీ ఉన్న భౌతిక గ్రంథాలు.', bn: 'পিথাগোরাসের নামে সবকিছু শতাব্দী পরে অনুসারীরা লিপিবদ্ধ করেছিল। বিপরীতে, শুল্ব সূত্র তারিখযুক্ত ভৌত গ্রন্থ।', kn: 'ಪೈಥಾಗೊರಸ್‌ಗೆ ಆರೋಪಿಸಲಾದ ಎಲ್ಲವೂ ಶತಮಾನಗಳ ನಂತರ ಅನುಯಾಯಿಗಳಿಂದ ದಾಖಲಿಸಲ್ಪಟ್ಟವು. ಇದಕ್ಕೆ ವ್ಯತಿರಿಕ್ತವಾಗಿ, ಶುಲ್ಬ ಸೂತ್ರಗಳು ದಿನಾಂಕ ಹೊಂದಿರುವ ಭೌತಿಕ ಗ್ರಂಥಗಳು.', gu: 'પાયથાગોરસને આભારી બધું સદીઓ પછી અનુયાયીઓએ નોંધ્યું. વિપરીત, શુલ્બ સૂત્રો તારીખવાળા ભૌતિક ગ્રંથો છે.' },
        bgColor: '#1a1040',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'முழு கதையைப் படியுங்கள்', te: 'పూర్తి కథ చదవండి', bn: 'পুরো গল্প পড়ুন', kn: 'ಪೂರ್ಣ ಕಥೆ ಓದಿ', gu: 'સંપૂર્ણ વાર્તા વાંચો' },
        body: { en: 'The Sulba Sutras — geometry born from sacred fire.', hi: 'शुल्ब सूत्र — पवित्र अग्नि से जन्मी ज्यामिति।', sa: 'शुल्ब सूत्र — पवित्र अग्नि से जन्मी ज्यामिति।', mai: 'शुल्ब सूत्र — पवित्र अग्नि से जन्मी ज्यामिति।', mr: 'शुल्ब सूत्र — पवित्र अग्नि से जन्मी ज्यामिति।', ta: 'The Sulba Sutras — geometry born from sacred fire.', te: 'The Sulba Sutras — geometry born from sacred fire.', bn: 'The Sulba Sutras — geometry born from sacred fire.', kn: 'The Sulba Sutras — geometry born from sacred fire.', gu: 'The Sulba Sutras — geometry born from sacred fire.' },
        bgColor: '#2a0a1a',
      },
    ],
  },

  /* ── Story 5: Speed of Light ── */
  {
    slug: 'speed-of-light',
    title: {
      en: 'Speed of Light — In a 14th Century Text',
      hi: 'प्रकाश की गति — एक 14वीं शताब्दी के ग्रंथ में',
    },
    description: {
      en: 'Sayana\'s commentary on the Rig Veda contains a value for the speed of light accurate to 0.14%.',
      hi: 'सायण की ऋग्वेद टीका में प्रकाश की गति का मान 0.14% सटीक है।',
    },
    ctaUrl: '/learn/contributions/speed-of-light',
    slides: [
      {
        type: 'title',
        heading: { en: 'SPEED OF LIGHT\nIN A 14TH CENTURY\nTEXT', hi: 'प्रकाश की गति\n14वीं शताब्दी के\nग्रंथ में', sa: 'प्रकाश की गति\n14वीं शताब्दी के\nग्रंथ में', mai: 'प्रकाश की गति\n14वीं शताब्दी के\nग्रंथ में', mr: 'प्रकाश की गति\n14वीं शताब्दी के\nग्रंथ में', ta: 'ஒளியின் வேகம்\n14ஆம் நூற்றாண்டு\nநூலில்', te: 'కాంతి వేగం\n14వ శతాబ్దపు\nగ్రంథంలో', bn: 'আলোর গতি\n১৪শ শতাব্দীর\nগ্রন্থে', kn: 'ಬೆಳಕಿನ ವೇಗ\n14ನೇ ಶತಮಾನದ\nಗ್ರಂಥದಲ್ಲಿ', gu: 'પ્રકાશની ગતિ\n14મી સદીના\nગ્રંથમાં' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Sayana\'s commentary on Rig Veda', hi: 'सायण की ऋग्वेद टीका' },
        body: { en: 'In his 14th century commentary on Rig Veda hymn 1.50.4 (a hymn to the Sun), Sayana describes the speed at which sunlight travels.', hi: 'ऋग्वेद सूक्त 1.50.4 (सूर्य स्तुति) पर अपनी 14वीं शताब्दी की टीका में, सायण ने सूर्य के प्रकाश की गति का वर्णन किया।', sa: 'ऋग्वेद सूक्त 1.50.4 (सूर्य स्तुति) पर अपनी 14वीं शताब्दी की टीका में, सायण ने सूर्य के प्रकाश की गति का वर्णन किया।', mai: 'ऋग्वेद सूक्त 1.50.4 (सूर्य स्तुति) पर अपनी 14वीं शताब्दी की टीका में, सायण ने सूर्य के प्रकाश की गति का वर्णन किया।', mr: 'ऋग्वेद सूक्त 1.50.4 (सूर्य स्तुति) पर अपनी 14वीं शताब्दी की टीका में, सायण ने सूर्य के प्रकाश की गति का वर्णन किया।', ta: 'ரிக் வேத பாடல் 1.50.4 (சூரிய பாடல்) மீதான தனது 14ஆம் நூற்றாண்டு உரையில், சாயணா சூரிய ஒளி பயணிக்கும் வேகத்தை விவரிக்கிறார்.', te: 'ఋగ్వేద శ్లోకం 1.50.4 (సూర్య శ్లోకం)పై తన 14వ శతాబ్దపు వ్యాఖ్యానంలో, సాయణ సూర్యకాంతి ప్రయాణించే వేగాన్ని వివరిస్తాడు.', bn: 'ঋগ্বেদ স্তোত্র 1.50.4-এর উপর তাঁর 14শ শতাব্দীর ভাষ্যে, সায়ণ সূর্যালোকের গতিবেগ বর্ণনা করেছেন।', kn: 'ಋಗ್ವೇದ ಸ್ತೋತ್ರ 1.50.4 (ಸೂರ್ಯ ಸ್ತೋತ್ರ) ಮೇಲಿನ ತಮ್ಮ 14ನೇ ಶತಮಾನದ ವ್ಯಾಖ್ಯಾನದಲ್ಲಿ, ಸಾಯಣ ಸೂರ್ಯನ ಬೆಳಕು ಚಲಿಸುವ ವೇಗವನ್ನು ವಿವರಿಸುತ್ತಾರೆ.', gu: 'ઋગ્વેદ સ્તોત્ર 1.50.4 (સૂર્ય સ્તોત્ર) પર તેમની 14મી સદીની ટીકામાં, સાયણ સૂર્યપ્રકાશની ગતિ વર્ણવે છે.' },
        bgColor: '#1a1040',
      },
      {
        type: 'quote',
        heading: { en: '"2,202 yojanas in half a nimesha"', hi: '"अर्ध निमेष में 2,202 योजन"', sa: '"अर्ध निमेष में 2,202 योजन"', mai: '"अर्ध निमेष में 2,202 योजन"', mr: '"अर्ध निमेष में 2,202 योजन"', ta: '"அரை நிமேஷத்தில் 2,202 யோஜனைகள்"', te: '"అర్ధ నిమేషంలో 2,202 యోజనాలు"', bn: '"অর্ধ নিমেষে 2,202 যোজন"', kn: '"ಅರ್ಧ ನಿಮೇಷದಲ್ಲಿ 2,202 ಯೋಜನೆಗಳು"', gu: '"અડધા નિમેષમાં 2,202 યોજન"' },
        body: { en: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', hi: '"योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण" — अर्ध निमेष में 2,202 योजन।', sa: '"योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण" — अर्ध निमेष में 2,202 योजन।', mai: '"योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण" — अर्ध निमेष में 2,202 योजन।', mr: '"योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण" — अर्ध निमेष में 2,202 योजन।', ta: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', te: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', bn: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', kn: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', gu: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."' },
        sourceText: { en: 'Rig Veda 1.50.4, Sayana\'s commentary', hi: 'ऋग्वेद 1.50.4, सायण भाष्य' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'Calculated: ~186,536 miles per second', hi: 'गणना: ~186,536 मील प्रति सेकंड', sa: 'गणना: ~186,536 मील प्रति सेकंड', mai: 'गणना: ~186,536 मील प्रति सेकंड', mr: 'गणना: ~186,536 मील प्रति सेकंड', ta: 'கணக்கிடப்பட்டது: ~186,536 மைல்/வினாடி', te: 'లెక్కించబడింది: ~186,536 మైళ్ళు/సెకను', bn: 'গণনা করা: ~186,536 মাইল/সেকেন্ড', kn: 'ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ: ~186,536 ಮೈಲುಗಳು/ಸೆಕೆಂಡು', gu: 'ગણતરી: ~186,536 માઈલ/સેકન્ડ' },
        body: { en: 'Using the traditional definitions of yojana (~9 miles) and nimesha (~16/75 seconds), the value works out to approximately 186,536 miles per second.', hi: 'योजन (~9 मील) और निमेष (~16/75 सेकंड) की पारंपरिक परिभाषाओं का उपयोग करते हुए, यह मान लगभग 186,536 मील प्रति सेकंड बनता है।', sa: 'योजन (~9 मील) और निमेष (~16/75 सेकंड) की पारंपरिक परिभाषाओं का उपयोग करते हुए, यह मान लगभग 186,536 मील प्रति सेकंड बनता है।', mai: 'योजन (~9 मील) और निमेष (~16/75 सेकंड) की पारंपरिक परिभाषाओं का उपयोग करते हुए, यह मान लगभग 186,536 मील प्रति सेकंड बनता है।', mr: 'योजन (~9 मील) और निमेष (~16/75 सेकंड) की पारंपरिक परिभाषाओं का उपयोग करते हुए, यह मान लगभग 186,536 मील प्रति सेकंड बनता है।', ta: 'யோஜனா (~9 மைல்) மற்றும் நிமேஷா (~16/75 வினாடிகள்) ஆகியவற்றின் பாரம்பரிய வரையறைகளைப் பயன்படுத்தி, மதிப்பு சுமார் 186,536 மைல்/வினாடி ஆகும்.', te: 'యోజన (~9 మైళ్ళు) మరియు నిమేష (~16/75 సెకన్లు) యొక్క సాంప్రదాయ నిర్వచనాలను ఉపయోగించి, విలువ సుమారు 186,536 మైళ్ళు/సెకను అవుతుంది.', bn: 'যোজন (~9 মাইল) এবং নিমেষ (~16/75 সেকেন্ড) এর ঐতিহ্যবাহী সংজ্ঞা ব্যবহার করে, মান প্রায় 186,536 মাইল/সেকেন্ড হয়।', kn: 'ಯೋಜನ (~9 ಮೈಲುಗಳು) ಮತ್ತು ನಿಮೇಷ (~16/75 ಸೆಕೆಂಡುಗಳು) ಸಾಂಪ್ರದಾಯಿಕ ವ್ಯಾಖ್ಯಾನಗಳನ್ನು ಬಳಸಿ, ಮೌಲ್ಯ ಸುಮಾರು 186,536 ಮೈಲುಗಳು/ಸೆಕೆಂಡು ಆಗುತ್ತದೆ.', gu: 'યોજન (~9 માઈલ) અને નિમેષ (~16/75 સેકન્ડ) ની પરંપરાગત વ્યાખ્યાઓ વાપરીને, મૂલ્ય આશરે 186,536 માઈલ/સેકન્ડ થાય છે.' },
        stat: '186,536',
        bgColor: '#0a2a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Modern value: 186,282 miles per second', hi: 'आधुनिक मान: 186,282 मील प्रति सेकंड', sa: 'आधुनिक मान: 186,282 मील प्रति सेकंड', mai: 'आधुनिक मान: 186,282 मील प्रति सेकंड', mr: 'आधुनिक मान: 186,282 मील प्रति सेकंड', ta: 'நவீன மதிப்பு: 186,282 மைல்/வினாடி', te: 'ఆధునిక విలువ: 186,282 మైళ్ళు/సెకను', bn: 'আধুনিক মান: 186,282 মাইল/সেকেন্ড', kn: 'ಆಧುನಿಕ ಮೌಲ್ಯ: 186,282 ಮೈಲುಗಳು/ಸೆಕೆಂಡು', gu: 'આધુનિક મૂલ્ય: 186,282 માઈલ/સેકન્ડ' },
        body: { en: 'The scientifically measured speed of light in a vacuum is 186,282 miles per second (299,792 km/s).', hi: 'निर्वात में प्रकाश की वैज्ञानिक रूप से मापी गई गति 186,282 मील प्रति सेकंड (299,792 किमी/से) है।', sa: 'निर्वात में प्रकाश की वैज्ञानिक रूप से मापी गई गति 186,282 मील प्रति सेकंड (299,792 किमी/से) है।', mai: 'निर्वात में प्रकाश की वैज्ञानिक रूप से मापी गई गति 186,282 मील प्रति सेकंड (299,792 किमी/से) है।', mr: 'निर्वात में प्रकाश की वैज्ञानिक रूप से मापी गई गति 186,282 मील प्रति सेकंड (299,792 किमी/से) है।', ta: 'வெற்றிடத்தில் ஒளியின் அறிவியல் பூர்வமாக அளவிடப்பட்ட வேகம் 186,282 மைல்/வினாடி (299,792 km/s).', te: 'శూన్యంలో కాంతి యొక్క శాస్త్రీయంగా కొలవబడిన వేగం 186,282 మైళ్ళు/సెకను (299,792 km/s).', bn: 'শূন্যে আলোর বৈজ্ঞানিকভাবে পরিমাপিত গতি 186,282 মাইল/সেকেন্ড (299,792 km/s)।', kn: 'ನಿರ್ವಾತದಲ್ಲಿ ಬೆಳಕಿನ ವೈಜ್ಞಾನಿಕವಾಗಿ ಅಳೆಯಲಾದ ವೇಗ 186,282 ಮೈಲುಗಳು/ಸೆಕೆಂಡು (299,792 km/s).', gu: 'વેક્યુમમાં પ્રકાશની વૈજ્ઞાનિક રીતે માપેલ ગતિ 186,282 માઈલ/સેકન્ડ (299,792 km/s) છે.' },
        stat: '186,282',
        bgColor: '#1a0a30',
      },
      {
        type: 'comparison',
        heading: { en: 'Accuracy: 0.14% Error', hi: 'सटीकता: 0.14% त्रुटि', sa: 'सटीकता: 0.14% त्रुटि', mai: 'सटीकता: 0.14% त्रुटि', mr: 'सटीकता: 0.14% त्रुटि', ta: 'துல்லியம்: 0.14% பிழை', te: 'ఖచ్చితత్వం: 0.14% తప్పు', bn: 'নির্ভুলতা: 0.14% ত্রুটি', kn: 'ನಿಖರತೆ: 0.14% ದೋಷ', gu: 'ચોકસાઈ: 0.14% ભૂલ' },
        body: { en: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', hi: 'वैदिक मान और आधुनिक माप के बीच का अंतर मात्र 0.14% है — किसी भी वैज्ञानिक माप से शताब्दियों पहले लिखे ग्रंथ के लिए लगभग असंभव सटीकता।', sa: 'वैदिक मान और आधुनिक माप के बीच का अंतर मात्र 0.14% है — किसी भी वैज्ञानिक माप से शताब्दियों पहले लिखे ग्रंथ के लिए लगभग असंभव सटीकता।', mai: 'वैदिक मान और आधुनिक माप के बीच का अंतर मात्र 0.14% है — किसी भी वैज्ञानिक माप से शताब्दियों पहले लिखे ग्रंथ के लिए लगभग असंभव सटीकता।', mr: 'वैदिक मान और आधुनिक माप के बीच का अंतर मात्र 0.14% है — किसी भी वैज्ञानिक माप से शताब्दियों पहले लिखे ग्रंथ के लिए लगभग असंभव सटीकता।', ta: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', te: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', bn: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', kn: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', gu: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.' },
        stat: '0.14%',
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Ole Romer measured it 300 years later', hi: 'ओले रोमर ने 300 वर्ष बाद मापा', sa: 'ओले रोमर ने 300 वर्ष बाद मापा', mai: 'ओले रोमर ने 300 वर्ष बाद मापा', mr: 'ओले रोमर ने 300 वर्ष बाद मापा', ta: 'ஓலே ரோமர் 300 ஆண்டுகளுக்குப் பிறகு இதை அளந்தார்', te: 'ఓలె రోమర్ 300 సంవత్సరాల తర్వాత దీన్ని కొలిచాడు', bn: 'ওলে রোমার 300 বছর পরে এটি পরিমাপ করেছিলেন', kn: 'ಓಲೆ ರೋಮರ್ 300 ವರ್ಷಗಳ ನಂತರ ಇದನ್ನು ಅಳೆದರು', gu: 'ઓલે રોમરે 300 વર્ષ પછી આ માપ્યું' },
        body: { en: 'The first European measurement of the speed of light came from Danish astronomer Ole Romer in 1676 — roughly 300 years after Sayana\'s commentary.', hi: 'प्रकाश की गति का पहला यूरोपीय माप 1676 में डेनिश खगोलशास्त्री ओले रोमर से आया — सायण की टीका के लगभग 300 वर्ष बाद।' },
        bgColor: '#1a1040',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'முழு கதையைப் படியுங்கள்', te: 'పూర్తి కథ చదవండి', bn: 'পুরো গল্প পড়ুন', kn: 'ಪೂರ್ಣ ಕಥೆ ಓದಿ', gu: 'સંપૂર્ણ વાર્તા વાંચો' },
        body: { en: 'How an ancient hymn to the Sun encoded a value that modern science took centuries to measure.', hi: 'कैसे सूर्य की एक प्राचीन स्तुति ने वह मान संकेतित किया जिसे मापने में आधुनिक विज्ञान को शताब्दियाँ लगीं।', sa: 'कैसे सूर्य की एक प्राचीन स्तुति ने वह मान संकेतित किया जिसे मापने में आधुनिक विज्ञान को शताब्दियाँ लगीं।', mai: 'कैसे सूर्य की एक प्राचीन स्तुति ने वह मान संकेतित किया जिसे मापने में आधुनिक विज्ञान को शताब्दियाँ लगीं।', mr: 'कैसे सूर्य की एक प्राचीन स्तुति ने वह मान संकेतित किया जिसे मापने में आधुनिक विज्ञान को शताब्दियाँ लगीं।', ta: 'சூரியனுக்கான ஒரு பழங்கால பாடல் நவீன விஞ்ஞானம் அளவிட நூற்றாண்டுகள் எடுத்த ஒரு மதிப்பை எவ்வாறு குறியீடாக்கியது.', te: 'సూర్యునికి ఒక ప్రాచీన శ్లోకం ఆధునిక విజ్ఞానం కొలవడానికి శతాబ్దాలు పట్టిన విలువను ఎలా ఎన్కోడ్ చేసింది.', bn: 'সূর্যের প্রাচীন স্তোত্র কীভাবে এমন মান এনকোড করেছিল যা আধুনিক বিজ্ঞানের পরিমাপে কয়েক শতাব্দী লেগেছিল।', kn: 'ಸೂರ್ಯನಿಗೆ ಪ್ರಾಚೀನ ಸ್ತೋತ್ರ ಆಧುನಿಕ ವಿಜ್ಞಾನ ಅಳೆಯಲು ಶತಮಾನಗಳು ತೆಗೆದುಕೊಂಡ ಮೌಲ್ಯವನ್ನು ಹೇಗೆ ಎನ್ಕೋಡ್ ಮಾಡಿತ್ತು.', gu: 'સૂર્યના પ્રાચીન સ્તોત્રએ એવું મૂલ્ય કેવી રીતે એન્કોડ કર્યું જે માપવામાં આધુનિક વિજ્ઞાનને સદીઓ લાગી.' },
        bgColor: '#0a1a3a',
      },
    ],
  },
];

export function getStoryBySlug(slug: string): WebStory | undefined {
  return WEB_STORIES.find(s => s.slug === slug);
}

export function getAllStorySlugs(): string[] {
  return WEB_STORIES.map(s => s.slug);
}
