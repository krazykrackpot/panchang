import type { Metadata } from 'next';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

export const revalidate = 604800; // 7 days — static text page

const LABELS = {
  en: {
    title: 'Terms of Service',
    subtitle: 'Please read these terms carefully before using our service',
    lastUpdated: 'Last updated: April 11, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content: `By accessing or using Dekho Panchang ("the Service"), available at dekhopanchang.com, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms constitute a legally binding agreement between you and Dekho Panchang.`,
      },
      {
        heading: '2. Description of Service',
        content: `Dekho Panchang is a Vedic astrology web application that provides:`,
        list: [
          'Daily Panchang calculations including Tithi, Nakshatra, Yoga, Karana, and Muhurta timings based on your location.',
          'Kundali (birth chart) generation with interpretive commentary, Dasha analysis, Shadbala, and Ashtakavarga calculations.',
          'Compatibility matching (Ashta Kuta) for relationship analysis.',
          'Varshaphal (annual predictions), KP System analysis, and Prashna (horary) charts.',
          'Festival calendar, eclipse tracking, retrograde schedules, and Muhurta (auspicious timing) recommendations.',
          'Educational content about Vedic astrology through structured learning modules.',
          'AI-assisted astrological interpretations powered by advanced language models.',
          'All astronomical calculations are performed locally using Meeus algorithms with no external astrology API dependencies.',
        ],
      },
      {
        heading: '3. Important Disclaimer',
        content: `The astrological calculations, interpretations, predictions, and recommendations provided by Dekho Panchang are for informational, educational, and spiritual purposes only. They should NOT be considered as:`,
        list: [
          'Professional medical, legal, financial, or psychological advice.',
          'A substitute for consultation with qualified professionals in any field.',
          'Guaranteed or scientifically validated predictions of future events.',
          'A basis for making major life decisions without independent judgment.',
        ],
        extra: `Vedic astrology (Jyotish Shastra) is an ancient knowledge system with deep cultural and spiritual significance. Our calculations aim for astronomical accuracy (verified against established references), but astrological interpretation is inherently subjective. Users should exercise their own judgment and seek appropriate professional advice for important decisions.`,
      },
      {
        heading: '4. User Accounts',
        content: `To access certain features, you may create an account using Google OAuth or email/password authentication. You are responsible for:`,
        list: [
          'Maintaining the confidentiality of your account credentials.',
          'All activities that occur under your account.',
          'Providing accurate and complete information during registration.',
          'Notifying us immediately of any unauthorized use of your account.',
        ],
        extra: `We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or are used to abuse the Service.`,
      },
      {
        heading: '5. Subscription and Payment Terms',
        content: `Dekho Panchang offers free and paid subscription tiers:`,
        list: [
          'Free Tier: Access to basic Panchang, limited Kundali features, and educational content.',
          'Pro Tier: Enhanced features including detailed Tippanni, advanced Dasha analysis, and priority access to new features.',
          'Jyotishi Tier: Full access to all features including KP System, Prashna, Varshaphal, and professional tools.',
          'Payments in USD are processed securely through Stripe. Payments in INR are processed through Razorpay.',
          'Subscriptions auto-renew at the end of each billing period (monthly or annual) unless cancelled.',
          'You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period.',
          'Refunds are handled on a case-by-case basis. Contact us within 7 days of a charge for refund requests.',
          'We reserve the right to modify pricing with 30 days advance notice to existing subscribers.',
        ],
      },
      {
        heading: '6. Acceptable Use',
        content: `When using Dekho Panchang, you agree NOT to:`,
        list: [
          'Use the Service for any unlawful purpose or in violation of any applicable laws.',
          'Attempt to gain unauthorized access to any part of the Service, other accounts, or computer systems.',
          'Scrape, crawl, or use automated tools to extract data from the Service without written permission.',
          'Redistribute, resell, or commercially exploit the Service\'s content, calculations, or interpretations without authorization.',
          'Interfere with or disrupt the Service, its servers, or connected networks.',
          'Impersonate any person or entity, or misrepresent your affiliation with any person or entity.',
          'Upload or transmit malicious code, viruses, or any harmful content.',
        ],
      },
      {
        heading: '7. Intellectual Property',
        content: `All content on Dekho Panchang, including but not limited to text, graphics, SVG icons, user interface design, astronomical algorithms, astrological interpretations, educational modules, and software code, is the intellectual property of Dekho Panchang and is protected by applicable copyright and intellectual property laws. The trilingual content (English, Hindi, Sanskrit) and custom icon system are original works. You may not reproduce, distribute, modify, or create derivative works from our content without explicit written permission.`,
      },
      {
        heading: '8. User-Generated Content',
        content: `Any birth data, chart preferences, or other information you provide to the Service remains your property. By providing this data, you grant us a limited license to use it solely for the purpose of delivering the Service to you (e.g., generating your Kundali, calculating your Panchang). We will not sell your personal birth data to third parties.`,
      },
      {
        heading: '9. Limitation of Liability',
        content: `To the maximum extent permitted by applicable law:`,
        list: [
          'Dekho Panchang is provided "as is" and "as available" without warranties of any kind, express or implied.',
          'We do not warrant that the Service will be uninterrupted, error-free, or completely secure.',
          'We are not liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.',
          'Our total liability for any claim arising from these Terms or the Service shall not exceed the amount you paid to us in the 12 months preceding the claim.',
          'We are not responsible for any decisions made based on astrological calculations or interpretations provided by the Service.',
        ],
      },
      {
        heading: '10. Indemnification',
        content: `You agree to indemnify, defend, and hold harmless Dekho Panchang, its operators, and affiliates from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your use of the Service, violation of these Terms, or infringement of any third party\'s rights.`,
      },
      {
        heading: '11. Third-Party Services',
        content: `The Service integrates with third-party providers including Supabase (authentication/database), Stripe and Razorpay (payments), Resend (email), Vercel (hosting), Google AdSense (advertising), and Anthropic (AI features). Your use of these services is also subject to their respective terms of service and privacy policies. We are not responsible for the practices or content of these third-party services.`,
      },
      {
        heading: '12. Service Modifications',
        content: `We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We may add new features, change existing features, or adjust subscription tiers. We will make reasonable efforts to notify active subscribers of material changes that affect their subscription benefits.`,
      },
      {
        heading: '13. Governing Law',
        content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in India. For users in the European Union, nothing in these Terms affects your rights under applicable EU consumer protection laws.`,
      },
      {
        heading: '14. Changes to These Terms',
        content: `We may update these Terms from time to time. We will notify users of material changes by posting the updated Terms on this page with a revised "Last updated" date. For significant changes affecting paid subscribers, we will provide at least 30 days advance notice via email. Your continued use of the Service after any changes constitutes acceptance of the updated Terms.`,
      },
      {
        heading: '15. Severability',
        content: `If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.`,
      },
      {
        heading: '16. Contact Us',
        content: `If you have any questions about these Terms of Service, please contact us at: legal@dekhopanchang.com`,
      },
    ],
  },
  hi: {
    title: 'सेवा की शर्तें',
    subtitle: 'कृपया हमारी सेवा का उपयोग करने से पहले इन शर्तों को ध्यान से पढ़ें',
    lastUpdated: 'अंतिम अपडेट: 11 अप्रैल 2026',
    sections: [
      {
        heading: '1. शर्तों की स्वीकृति',
        content: `देखो पंचांग ("सेवा") तक पहुंचने या उपयोग करने से, जो dekhopanchang.com पर उपलब्ध है, आप इन सेवा की शर्तों से बाध्य होने के लिए सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो आप सेवा का उपयोग नहीं कर सकते।`,
      },
      {
        heading: '2. सेवा का विवरण',
        content: `देखो पंचांग एक वैदिक ज्योतिष वेब एप्लिकेशन है जो दैनिक पंचांग गणना, कुण्डली निर्माण, अनुकूलता मिलान, वार्षिकफल, केपी प्रणाली विश्लेषण, प्रश्न कुण्डली, त्योहार कैलेंडर, ग्रहण ट्रैकिंग, मुहूर्त सिफारिशें और ज्योतिष शैक्षिक सामग्री प्रदान करती है। सभी खगोलीय गणनाएं Meeus एल्गोरिदम का उपयोग करके स्थानीय रूप से की जाती हैं।`,
      },
      {
        heading: '3. महत्वपूर्ण अस्वीकरण',
        content: `देखो पंचांग द्वारा प्रदान की गई ज्योतिषीय गणनाएं, व्याख्याएं और भविष्यवाणियां केवल सूचनात्मक, शैक्षिक और आध्यात्मिक उद्देश्यों के लिए हैं। ये पेशेवर चिकित्सा, कानूनी, वित्तीय या मनोवैज्ञानिक सलाह का विकल्प नहीं हैं। वैदिक ज्योतिष (ज्योतिष शास्त्र) एक प्राचीन ज्ञान प्रणाली है जिसका गहरा सांस्कृतिक और आध्यात्मिक महत्व है। उपयोगकर्ताओं को अपने विवेक का उपयोग करना चाहिए।`,
      },
      {
        heading: '4. उपयोगकर्ता खाते',
        content: `खाता बनाते समय, आप अपने खाते की गोपनीयता बनाए रखने, अपने खाते के तहत सभी गतिविधियों और सटीक जानकारी प्रदान करने के लिए जिम्मेदार हैं। हम शर्तों का उल्लंघन करने वाले खातों को निलंबित या समाप्त करने का अधिकार रखते हैं।`,
      },
      {
        heading: '5. सदस्यता और भुगतान शर्तें',
        content: `देखो पंचांग मुफ्त और सशुल्क सदस्यता स्तर प्रदान करता है। USD में भुगतान Stripe द्वारा और INR में भुगतान Razorpay द्वारा संसाधित किए जाते हैं। सदस्यता प्रत्येक बिलिंग अवधि के अंत में स्वचालित रूप से नवीनीकृत होती है। आप किसी भी समय अपनी खाता सेटिंग्स से रद्द कर सकते हैं। रिफंड अनुरोध शुल्क के 7 दिनों के भीतर किए जाने चाहिए।`,
      },
      {
        heading: '6. स्वीकार्य उपयोग',
        content: `आप सेवा का उपयोग किसी भी गैरकानूनी उद्देश्य के लिए, अनधिकृत पहुंच प्राप्त करने, डेटा स्क्रैप करने, सामग्री का पुनर्वितरण या वाणिज्यिक शोषण, सेवा में बाधा डालने, या हानिकारक सामग्री अपलोड करने के लिए नहीं कर सकते।`,
      },
      {
        heading: '7. बौद्धिक संपदा',
        content: `देखो पंचांग पर सभी सामग्री, जिसमें पाठ, ग्राफिक्स, SVG आइकन, एल्गोरिदम, व्याख्याएं और शैक्षिक मॉड्यूल शामिल हैं, हमारी बौद्धिक संपदा है और लागू कानूनों द्वारा संरक्षित है।`,
      },
      {
        heading: '8. दायित्व की सीमा',
        content: `सेवा "जैसी है" और "जैसी उपलब्ध है" प्रदान की जाती है। हम सेवा के उपयोग से उत्पन्न किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक या परिणामी क्षति के लिए उत्तरदायी नहीं हैं। हम ज्योतिषीय गणनाओं या व्याख्याओं के आधार पर लिए गए किसी भी निर्णय के लिए जिम्मेदार नहीं हैं।`,
      },
      {
        heading: '9. शासी कानून',
        content: `ये शर्तें भारत के कानूनों द्वारा शासित होंगी। यूरोपीय संघ के उपयोगकर्ताओं के लिए, इन शर्तों में कुछ भी लागू EU उपभोक्ता संरक्षण कानूनों के तहत आपके अधिकारों को प्रभावित नहीं करता।`,
      },
      {
        heading: '10. शर्तों में परिवर्तन',
        content: `हम समय-समय पर इन शर्तों को अपडेट कर सकते हैं। सशुल्क सदस्यों को प्रभावित करने वाले महत्वपूर्ण परिवर्तनों के लिए, हम ईमेल के माध्यम से कम से कम 30 दिन पहले सूचना प्रदान करेंगे।`,
      },
      {
        heading: '11. संपर्क करें',
        content: `यदि आपके कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें: legal@dekhopanchang.com`,
      },
    ],
  },
  ta: {
    title: 'சேவை விதிமுறைகள்',
    subtitle: 'எங்கள் சேவையைப் பயன்படுத்துவதற்கு முன் இந்த விதிமுறைகளை கவனமாகப் படிக்கவும்',
    lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது: ஏப்ரல் 11, 2026',
    sections: [
      {
        heading: '1. விதிமுறைகளை ஏற்றுக்கொள்ளுதல்',
        content: `dekhopanchang.com இல் கிடைக்கும் தெக்கோ பஞ்சாங்கம் ("சேவை") அணுகுவதன் மூலம் அல்லது பயன்படுத்துவதன் மூலம், இந்த சேவை விதிமுறைகளுக்கு கட்டுப்படுவதற்கு நீங்கள் ஒப்புக்கொள்கிறீர்கள். இந்த விதிமுறைகளை நீங்கள் ஏற்கவில்லை என்றால், நீங்கள் சேவையைப் பயன்படுத்த இயலாது.`,
      },
      {
        heading: '2. சேவையின் விவரணம்',
        content: `தெக்கோ பஞ்சாங்கம் தினசரி பஞ்சாங்கம் கணக்கீடுகள், ஜாதக உருவாக்கம், பொருத்தம் பார்த்தல், வர்ஷபலன், KP முறை பகுப்பாய்வு, பிரசன ஜாதகம், திருவிழா நாள்காட்டி, கிரகண கண்காணிப்பு, முகூர்த்த பரிந்துரைகள் மற்றும் ஜோதிட கல்வி உள்ளடக்கத்தை வழங்கும் வேத ஜோதிட வலைப் பயன்பாடு ஆகும். அனைத்து வானியல் கணக்கீடுகளும் Meeus அல்காரிதங்களைப் பயன்படுத்தி உள்ளூரில் செய்யப்படுகின்றன.`,
      },
      {
        heading: '3. முக்கிய மறுப்பு',
        content: `தெக்கோ பஞ்சாங்கத்தால் வழங்கப்படும் ஜோதிட கணக்கீடுகள், விளக்கங்கள் மற்றும் கணிப்புகள் தகவல், கல்வி மற்றும் ஆன்மீக நோக்கங்களுக்கு மட்டுமே. இவை நிபுணத்துவ மருத்துவ, சட்ட, நிதி அல்லது உளவியல் ஆலோசனைக்கு மாற்றாக இல்லை. வேத ஜோதிடம் (ஜோதிட சாஸ்திரம்) ஆழமான கலாசார மற்றும் ஆன்மீக முக்கியத்துவம் கொண்ட ஒரு பண்டைய அறிவு முறையாகும். பயனர்கள் தங்கள் சொந்த விவேகத்தைப் பயன்படுத்த வேண்டும்.`,
      },
      {
        heading: '4. பயனர் கணக்குகள்',
        content: `கணக்கை உருவாக்கும்போது, உங்கள் கணக்கின் ரகசியத்தன்மையை பராமரிப்பது, உங்கள் கணக்கின் கீழ் அனைத்து செயல்பாடுகள் மற்றும் துல்லியமான தகவல்களை வழங்குவது ஆகியவற்றிற்கு நீங்கள் பொறுப்பு. விதிமுறைகளை மீறும் கணக்குகளை நிறுத்தி வைக்க அல்லது நிறுத்த உரிமை உள்ளது.`,
      },
      {
        heading: '5. சந்தா மற்றும் கட்டண விதிமுறைகள்',
        content: `தெக்கோ பஞ்சாங்கம் இலவச மற்றும் கட்டண சந்தா நிலைகளை வழங்குகிறது. USD கட்டணங்கள் Stripe மூலமாகவும், INR கட்டணங்கள் Razorpay மூலமாகவும் செயலாக்கப்படுகின்றன. சந்தாக்கள் ஒவ்வொரு பில்லிங் காலத்தின் இறுதியில் தானாகவே புதுப்பிக்கப்படும். உங்கள் கணக்கு அமைப்புகளில் எப்போது வேண்டுமானாலும் ரத்து செய்யலாம். பணத்தைத் திரும்பப் பெற கட்டணத்திலிருந்து 7 நாட்களுக்குள் கோரிக்கை விடுக்க வேண்டும்.`,
      },
      {
        heading: '6. ஏற்கத்தக்க பயன்பாடு',
        content: `சட்டவிரோத நோக்கங்களுக்காக, அங்கீகரிக்கப்படாத அணுகலைப் பெற, தரவைச் சுரண்ட, உள்ளடக்கத்தை மறுவிநியோகம் அல்லது வணிக ரீதியாக சுரண்ட, சேவையில் தலையிட, அல்லது தீங்கிழைக்கும் உள்ளடக்கத்தைப் பதிவேற்ற சேவையைப் பயன்படுத்தக்கூடாது.`,
      },
      {
        heading: '7. அறிவுசார் சொத்து',
        content: `தெக்கோ பஞ்சாங்கத்தில் உள்ள அனைத்து உள்ளடக்கமும், உரை, வரைகலை, SVG சின்னங்கள், அல்காரிதங்கள், விளக்கங்கள் மற்றும் கல்வி தொகுதிகள் உட்பட, எங்கள் அறிவுசார் சொத்து ஆகும் மற்றும் பொருந்தும் சட்டங்களால் பாதுகாக்கப்படுகிறது.`,
      },
      {
        heading: '8. பொறுப்புக் கட்டுப்பாடு',
        content: `சேவை "உள்ளபடி" மற்றும் "கிடைக்கும்படி" வழங்கப்படுகிறது. சேவையின் பயன்பாட்டிலிருந்து எழும் நேரடி, மறைமுக, தற்செயல் அல்லது விளைவு சேதங்களுக்கு நாங்கள் பொறுப்பல்ல. ஜோதிட கணக்கீடுகள் அல்லது விளக்கங்களின் அடிப்படையில் எடுக்கப்படும் எந்த முடிவுகளுக்கும் நாங்கள் பொறுப்பல்ல.`,
      },
      {
        heading: '9. ஆளும் சட்டம்',
        content: `இந்த விதிமுறைகள் இந்தியாவின் சட்டங்களால் ஆளப்படும். ஐரோப்பிய ஒன்றியப் பயனர்களுக்கு, இந்த விதிமுறைகளில் எதுவும் பொருந்தும் EU நுகர்வோர் பாதுகாப்பு சட்டங்களின் கீழ் உங்கள் உரிமைகளை பாதிக்காது.`,
      },
      {
        heading: '10. இந்த விதிமுறைகளில் மாற்றங்கள்',
        content: `இந்த விதிமுறைகளை நாங்கள் அவ்வப்போது புதுப்பிக்கலாம். கட்டண சந்தாதாரர்களை பாதிக்கும் முக்கிய மாற்றங்களுக்கு, மின்னஞ்சல் மூலம் குறைந்தது 30 நாட்களுக்கு முன்னதாக அறிவிப்போம்.`,
      },
      {
        heading: '11. எங்களைத் தொடர்பு கொள்ள',
        content: `உங்களுக்கு ஏதேனும் கேள்விகள் இருந்தால், தயவுசெய்து எங்களைத் தொடர்பு கொள்ளுங்கள்: legal@dekhopanchang.com`,
      },
    ],
  },
  mr: {
    title: 'सेवा अटी',
    subtitle: 'कृपया आमची सेवा वापरण्यापूर्वी या अटी काळजीपूर्वक वाचा',
    lastUpdated: 'शेवटचे अपडेट: 11 एप्रिल 2026',
    sections: [],
  },
  gu: {
    title: 'સેવાની શરતો',
    subtitle: 'કૃપા કરીને અમારી સેવાનો ઉપયોગ કરતાં પહેલાં આ શરતો કાળજીપૂર્વક વાંચો',
    lastUpdated: 'છેલ્લે અપડેટ: 11 એપ્રિલ 2026',
    sections: [],
  },
  mai: {
    title: 'सेवा शर्त',
    subtitle: 'कृपया हमर सेवा उपयोग करबासँ पहिने ई शर्त ध्यानसँ पढ़ू',
    lastUpdated: 'अंतिम अपडेट: 11 अप्रैल 2026',
    sections: [],
  },
  te: {
    title: 'సేవా నిబంధనలు',
    subtitle: 'మా సేవను ఉపయోగించే ముందు ఈ నిబంధనలను జాగ్రత్తగా చదవండి',
    lastUpdated: 'చివరిగా నవీకరించబడింది: ఏప్రిల్ 11, 2026',
    sections: [],
  },
  bn: {
    title: 'সেবার শর্তাবলী',
    subtitle: 'আমাদের সেবা ব্যবহার করার আগে এই শর্তাবলী মনোযোগ দিয়ে পড়ুন',
    lastUpdated: 'সর্বশেষ আপডেট: এপ্রিল ১১, ২০২৬',
    sections: [],
  },
  kn: {
    title: 'ಸೇವಾ ನಿಯಮಗಳು',
    subtitle: 'ನಮ್ಮ ಸೇವೆಯನ್ನು ಬಳಸುವ ಮೊದಲು ಈ ನಿಯಮಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ',
    lastUpdated: 'ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ: ಏಪ್ರಿಲ್ 11, 2026',
    sections: [],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = isDevanagariLocale(locale) ? LABELS.hi : LABELS.en;
  return {
    title: l.title,
    description: l.subtitle,
    alternates: {
      canonical: `https://dekhopanchang.com/${locale}/terms`,
      languages: {
        en: 'https://dekhopanchang.com/en/terms',
        hi: 'https://dekhopanchang.com/hi/terms',
      },
    },
  };
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = isDevanagariLocale(locale) ? LABELS.hi : LABELS.en;

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10">
          <span className="text-purple-300 text-sm font-medium">{l.title}</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-gold-light to-purple-300 bg-clip-text text-transparent"
          style={{ fontFamily: isDevanagariLocale(locale) ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
        >
          {l.title}
        </h1>
        <p className="text-text-secondary text-lg">{l.subtitle}</p>
        <p className="text-text-secondary/60 text-sm mt-2">{l.lastUpdated}</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {l.sections.map((section, i) => (
          <section
            key={i}
            className="rounded-xl border border-gold-primary/10 bg-bg-secondary/60 p-6 sm:p-8"
          >
            <h2
              className="text-xl sm:text-2xl font-semibold text-gold-light mb-4"
              style={{ fontFamily: isDevanagariLocale(locale) ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
            >
              {section.heading}
            </h2>
            <p className="text-text-primary/90 leading-relaxed">{section.content}</p>
            {('list' in section) && (section as { list?: string[] }).list && (
              <ul className="mt-4 space-y-3">
                {((section as { list: string[] }).list).map((item, j) => (
                  <li key={j} className="flex gap-3 text-text-primary/80 leading-relaxed">
                    <span className="text-gold-primary mt-1.5 shrink-0">&#8226;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {('extra' in section) && (section as { extra?: string }).extra && (
              <p className="mt-4 text-text-primary/90 leading-relaxed">{(section as { extra: string }).extra}</p>
            )}
          </section>
        ))}
      </div>

      {/* Footer note */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <p className="text-text-secondary/50 text-sm">
          Dekho Panchang &mdash; dekhopanchang.com
        </p>
      </div>
    </main>
  );
}
