/**
 * /[locale]/mcp — landing page for @dekhopanchang/mcp, our locally-run
 * Model Context Protocol server for Vedic astronomy.
 *
 * This page has one job: make it dead-simple for a developer (or
 * technically-inclined seeker) to add our engine to their Claude
 * Desktop / Cursor / Windsurf agent in under 30 seconds. Everything
 * else — feature depth, methodology, comparisons — lives on other
 * pages and is linked from here.
 *
 * Design system: dark navy #0a0e27 + gold gradient cards, matching the
 * rest of the app. Follows the /features + /for-pandits SSR-static
 * pattern (no client-side clocks — Lesson ZD).
 */

import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import { Cpu, Terminal, Sparkles, Code, Package, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Static — this page has no per-request state. Revalidate daily so
// version bumps and copy edits ship without a full deploy.
export const revalidate = 86400;

// ── Per-locale copy — inline object per project convention for
// page-specific strings that don't warrant a JSON namespace.
const LABELS: Record<string, {
  eyebrow: string;
  h1: string;
  lead: string;
  installEyebrow: string;
  installHeading: string;
  installLead: string;
  step1: string;
  step2: string;
  step3: string;
  toolsHeading: string;
  toolsLead: string;
  designHeading: string;
  designLead: string;
  cta: string;
  ctaSecondary: string;
  githubLabel: string;
  npmLabel: string;
  webAppLabel: string;
  methodologyLabel: string;
  requirementsHeading: string;
  requirementsBody: string;
  faqHeading: string;
}> = {
  en: {
    eyebrow: 'For AI Developers',
    h1: 'Give your AI agent accurate Vedic astronomy',
    lead: 'A locally-executed Model Context Protocol server that plugs the Dekho Panchang engine — Swiss Ephemeris, Lahiri sidereal, BPHS-canonical — into Claude Desktop, Cursor, Windsurf, or any MCP-compatible client. No API keys. No per-call cost. No hosted endpoint.',
    installEyebrow: 'Two-minute install',
    installHeading: 'Add this to your Claude Desktop config',
    installLead: 'Paste the snippet below into your claude_desktop_config.json (macOS: ~/Library/Application Support/Claude/, Windows: %APPDATA%/Claude/). Restart Claude. Ask about panchang or a birth chart — the four tools appear automatically.',
    step1: 'Locate or create claude_desktop_config.json',
    step2: 'Paste the mcpServers block below',
    step3: 'Restart Claude Desktop — the tools appear under the MCP menu',
    toolsHeading: 'What your agent can do',
    toolsLead: 'Four tools cover the core computational surface. Every response includes a citation block naming the classical sources (BPHS, Surya Siddhanta, Muhurta Chintamani) and the ephemeris (Swiss Ephemeris DE441).',
    designHeading: 'Design constraints',
    designLead: 'Deliberate choices we made — and their reasons.',
    cta: 'View on npm',
    ctaSecondary: 'View source on GitHub',
    githubLabel: 'GitHub',
    npmLabel: 'npm',
    webAppLabel: 'Try the web app',
    methodologyLabel: 'Read the methodology',
    requirementsHeading: 'Requirements',
    requirementsBody: 'Node.js 18.17 or newer. On first run the sweph dependency compiles a native Swiss Ephemeris binary (needs a C++ toolchain: Xcode CLT on macOS, build-essential on Linux, MSVC Build Tools on Windows). If the compile fails, the server still runs via the Meeus fallback with slightly reduced accuracy.',
    faqHeading: 'Why does this exist?',
  },
  hi: {
    eyebrow: 'AI डेवलपर्स के लिए',
    h1: 'अपने AI एजेंट को सटीक वैदिक ज्योतिष दें',
    lead: 'एक स्थानीय Model Context Protocol सर्वर जो Dekho Panchang इंजन — Swiss Ephemeris, Lahiri सायन, BPHS-मानक — को Claude Desktop, Cursor, Windsurf या किसी भी MCP-संगत क्लाइंट में जोड़ता है। कोई API कुंजी नहीं। कोई प्रति-कॉल लागत नहीं।',
    installEyebrow: 'दो-मिनट में इंस्टॉल',
    installHeading: 'इसे अपने Claude Desktop config में जोड़ें',
    installLead: 'नीचे दिए स्निपेट को अपने claude_desktop_config.json में पेस्ट करें। Claude को पुनरारंभ करें। पंचांग या कुण्डली के बारे में पूछें — चार टूल्स स्वतः दिखेंगे।',
    step1: 'claude_desktop_config.json खोजें या बनाएं',
    step2: 'नीचे दिया mcpServers ब्लॉक पेस्ट करें',
    step3: 'Claude Desktop को पुनरारंभ करें — MCP मेनू में टूल्स दिखेंगे',
    toolsHeading: 'आपका एजेंट क्या कर सकता है',
    toolsLead: 'चार टूल्स मुख्य गणना सतह को कवर करते हैं। प्रत्येक प्रतिक्रिया में BPHS, सूर्य सिद्धांत, मुहूर्त चिंतामणि और Swiss Ephemeris DE441 का उद्धरण शामिल है।',
    designHeading: 'डिज़ाइन बाधाएं',
    designLead: 'हमारे जानबूझकर लिए गए निर्णय — और उनके कारण।',
    cta: 'npm पर देखें',
    ctaSecondary: 'GitHub पर स्रोत देखें',
    githubLabel: 'GitHub',
    npmLabel: 'npm',
    webAppLabel: 'वेब ऐप आज़माएँ',
    methodologyLabel: 'पद्धति पढ़ें',
    requirementsHeading: 'आवश्यकताएँ',
    requirementsBody: 'Node.js 18.17 या नया। पहली बार चलाने पर sweph डिपेंडेंसी एक नेटिव बाइनरी कंपाइल करती है (C++ टूलचेन चाहिए)। यदि कंपाइल विफल होता है, सर्वर Meeus fallback के साथ चलता है।',
    faqHeading: 'यह क्यों मौजूद है?',
  },
  mr: {
    eyebrow: 'AI डेव्हलपर्ससाठी',
    h1: 'तुमच्या AI एजंटला अचूक वैदिक ज्योतिष द्या',
    lead: 'एक स्थानिक Model Context Protocol सर्व्हर जो Dekho Panchang इंजिन — Swiss Ephemeris, Lahiri सायन, BPHS-मानक — Claude Desktop, Cursor, Windsurf किंवा कोणत्याही MCP-सुसंगत क्लायंटमध्ये जोडतो. कोणतीही API की नाही. प्रति-कॉल खर्च नाही.',
    installEyebrow: 'दोन-मिनिटांत इन्स्टॉल',
    installHeading: 'हे तुमच्या Claude Desktop config मध्ये जोडा',
    installLead: 'खालील स्निपेट तुमच्या claude_desktop_config.json मध्ये पेस्ट करा. Claude पुन्हा सुरू करा. पंचांग किंवा कुंडलीबद्दल विचारा — चार टूल्स आपोआप दिसतील.',
    step1: 'claude_desktop_config.json शोधा किंवा तयार करा',
    step2: 'खालील mcpServers ब्लॉक पेस्ट करा',
    step3: 'Claude Desktop पुन्हा सुरू करा — MCP मेनूमध्ये टूल्स दिसतील',
    toolsHeading: 'तुमचा एजंट काय करू शकतो',
    toolsLead: 'चार टूल्स मुख्य गणना क्षेत्र कव्हर करतात. प्रत्येक प्रतिसादात BPHS, सूर्य सिद्धांत, मुहूर्त चिंतामणि आणि Swiss Ephemeris DE441 चा उद्धरण समाविष्ट आहे.',
    designHeading: 'डिझाइन अटी',
    designLead: 'आमचे मुद्दाम घेतलेले निर्णय — आणि त्यांची कारणे.',
    cta: 'npm वर पहा',
    ctaSecondary: 'GitHub वर स्त्रोत पहा',
    githubLabel: 'GitHub',
    npmLabel: 'npm',
    webAppLabel: 'वेब अॅप वापरून पहा',
    methodologyLabel: 'पद्धत वाचा',
    requirementsHeading: 'आवश्यकता',
    requirementsBody: 'Node.js 18.17 किंवा नवीन. पहिल्यांदा चालवताना sweph डिपेंडन्सी एक नेटिव्ह बायनरी कंपाइल करते (C++ टूलचेन आवश्यक). कंपाइल अयशस्वी झाल्यास, सर्व्हर Meeus fallback सह चालतो.',
    faqHeading: 'हे का अस्तित्वात आहे?',
  },
  mai: {
    eyebrow: 'AI डेवलपर सभक लेल',
    h1: 'अपन AI एजेंट कें सही वैदिक ज्योतिष दिअ',
    lead: 'एक स्थानीय Model Context Protocol सर्वर जे Dekho Panchang इंजन — Swiss Ephemeris, Lahiri सायन, BPHS-मानक — कें Claude Desktop, Cursor, Windsurf वा कोनो MCP-संगत क्लाइंट मे जोड़ैत अछि। कोनो API कुंजी नहि। प्रति-कॉल लागत नहि।',
    installEyebrow: 'दू-मिनट मे इन्स्टॉल',
    installHeading: 'एहि कें अपन Claude Desktop config मे जोड़ू',
    installLead: 'नीचाँक स्निपेट कें अपन claude_desktop_config.json मे पेस्ट करू। Claude कें फेर सँ आरंभ करू। पंचांग वा कुण्डली क बारे मे पूछू — चारि टूल्स स्वतः देखाइ देत।',
    step1: 'claude_desktop_config.json खोजू वा बनाउ',
    step2: 'नीचाँक mcpServers ब्लॉक पेस्ट करू',
    step3: 'Claude Desktop कें फेर सँ आरंभ करू — MCP मेनू मे टूल्स देखाइ देत',
    toolsHeading: 'अहाँक एजेंट की करि सकैत अछि',
    toolsLead: 'चारि टूल्स मुख्य गणना क्षेत्र कें कवर करैत अछि। प्रत्येक प्रतिक्रिया मे BPHS, सूर्य सिद्धांत, मुहूर्त चिंतामणि आ Swiss Ephemeris DE441 क उद्धरण अछि।',
    designHeading: 'डिज़ाइन बाधा',
    designLead: 'हमरा जानि-बूझि केर लेल निर्णय — आ ओकर कारण।',
    cta: 'npm पर देखू',
    ctaSecondary: 'GitHub पर स्रोत देखू',
    githubLabel: 'GitHub',
    npmLabel: 'npm',
    webAppLabel: 'वेब ऐप आजमाउ',
    methodologyLabel: 'पद्धति पढ़ू',
    requirementsHeading: 'आवश्यकता',
    requirementsBody: 'Node.js 18.17 वा नव। पहिल बेर चलओलापर sweph डिपेंडेंसी एक नेटिव बाइनरी कंपाइल करैत अछि। कंपाइल विफल भेला पर, सर्वर Meeus fallback सँ चलैत अछि।',
    faqHeading: 'ई कियाक अछि?',
  },
  ta: {
    eyebrow: 'AI டெவலப்பர்களுக்கு',
    h1: 'உங்கள் AI முகவருக்கு துல்லியமான வேத வானியல் தரவை வழங்குங்கள்',
    lead: 'Claude Desktop, Cursor, Windsurf அல்லது எந்த MCP-இணக்க கிளையண்டிலும் Dekho Panchang இயந்திரத்தை — Swiss Ephemeris, Lahiri சாயனம், BPHS-நிலையானது — இணைக்கும் ஒரு உள்ளூர் MCP சர்வர். API சாவிகள் இல்லை. ஒரு அழைப்புக்கு கட்டணம் இல்லை.',
    installEyebrow: 'இரண்டு நிமிட நிறுவல்',
    installHeading: 'இதை உங்கள் Claude Desktop config-ல் சேர்க்கவும்',
    installLead: 'கீழுள்ள துணுக்கை உங்கள் claude_desktop_config.json-ல் ஒட்டவும். Claude-ஐ மறுதொடக்கம் செய்யவும். பஞ்சாங்கம் அல்லது ஜாதகம் பற்றி கேளுங்கள் — நான்கு கருவிகள் தானாகவே தோன்றும்.',
    step1: 'claude_desktop_config.json-ஐ கண்டறியவும் அல்லது உருவாக்கவும்',
    step2: 'கீழுள்ள mcpServers தொகுதியை ஒட்டவும்',
    step3: 'Claude Desktop-ஐ மறுதொடக்கம் செய்யவும் — MCP மெனுவில் கருவிகள் தோன்றும்',
    toolsHeading: 'உங்கள் முகவர் என்ன செய்ய முடியும்',
    toolsLead: 'நான்கு கருவிகள் முக்கிய கணிப்பு பரப்பை உள்ளடக்கியுள்ளன. ஒவ்வொரு பதிலும் BPHS, சூர்ய சித்தாந்தம், முகூர்த்த சிந்தாமணி மற்றும் Swiss Ephemeris DE441-ஐ மேற்கோள் காட்டுகிறது.',
    designHeading: 'வடிவமைப்பு வரம்புகள்',
    designLead: 'நாங்கள் வேண்டுமென்றே எடுத்த முடிவுகள் — மற்றும் அவற்றின் காரணங்கள்.',
    cta: 'npm-ல் பார்க்கவும்',
    ctaSecondary: 'GitHub-ல் மூலக்கோட்டை பார்க்கவும்',
    githubLabel: 'GitHub',
    npmLabel: 'npm',
    webAppLabel: 'இணையதளத்தை முயற்சிக்கவும்',
    methodologyLabel: 'முறையியலைப் படிக்கவும்',
    requirementsHeading: 'தேவைகள்',
    requirementsBody: 'Node.js 18.17 அல்லது புதியது. முதல் இயக்கத்தில் sweph சார்பு ஒரு நேட்டிவ் பைனரியை உருவாக்குகிறது (C++ கருவித்தொகுப்பு தேவை). கம்பைல் தோல்வியுற்றால், சர்வர் Meeus fallback-உடன் இயங்குகிறது.',
    faqHeading: 'இது ஏன் உள்ளது?',
  },
  te: {
    eyebrow: 'AI డెవలపర్‌ల కోసం',
    h1: 'మీ AI ఏజెంట్‌కు ఖచ్చితమైన వైదిక ఖగోళశాస్త్రాన్ని ఇవ్వండి',
    lead: 'Claude Desktop, Cursor, Windsurf లేదా ఏదైనా MCP-అనుకూల క్లయింట్‌లో Dekho Panchang ఇంజిన్‌ను — Swiss Ephemeris, Lahiri సాయనం, BPHS-ప్రామాణికం — ప్లగ్ చేసే స్థానిక MCP సర్వర్. API కీలు లేవు. కాల్‌కు ఖర్చు లేదు.',
    installEyebrow: 'రెండు నిమిషాల ఇన్‌స్టాల్',
    installHeading: 'దీన్ని మీ Claude Desktop config-లో జోడించండి',
    installLead: 'కింది స్నిప్పెట్‌ను మీ claude_desktop_config.json-లో పేస్ట్ చేయండి. Claude-ను రీస్టార్ట్ చేయండి. పంచాంగం లేదా జాతకం గురించి అడగండి — నాలుగు సాధనాలు స్వయంచాలకంగా కనిపిస్తాయి.',
    step1: 'claude_desktop_config.json ను గుర్తించండి లేదా సృష్టించండి',
    step2: 'కింది mcpServers బ్లాక్‌ను పేస్ట్ చేయండి',
    step3: 'Claude Desktop ను రీస్టార్ట్ చేయండి — MCP మెనూలో సాధనాలు కనిపిస్తాయి',
    toolsHeading: 'మీ ఏజెంట్ ఏమి చేయగలదు',
    toolsLead: 'నాలుగు సాధనాలు కోర్ గణన ఉపరితలాన్ని కవర్ చేస్తాయి. ప్రతి ప్రతిస్పందన BPHS, సూర్య సిద్ధాంతం, ముహూర్త చింతామణి మరియు Swiss Ephemeris DE441 ను ఉదహరిస్తుంది.',
    designHeading: 'డిజైన్ పరిమితులు',
    designLead: 'మేము ఉద్దేశపూర్వకంగా తీసుకున్న నిర్ణయాలు — మరియు వాటి కారణాలు.',
    cta: 'npm-లో చూడండి',
    ctaSecondary: 'GitHub-లో మూలాన్ని చూడండి',
    githubLabel: 'GitHub',
    npmLabel: 'npm',
    webAppLabel: 'వెబ్ యాప్ ప్రయత్నించండి',
    methodologyLabel: 'పద్ధతిని చదవండి',
    requirementsHeading: 'అవసరాలు',
    requirementsBody: 'Node.js 18.17 లేదా కొత్తది. మొదటి పరుగులో sweph డిపెండెన్సీ ఒక నేటివ్ బైనరీని కంపైల్ చేస్తుంది (C++ టూల్‌చైన్ అవసరం). కంపైల్ విఫలమైతే, సర్వర్ Meeus fallback తో నడుస్తుంది.',
    faqHeading: 'ఇది ఎందుకు ఉంది?',
  },
  bn: {
    eyebrow: 'AI ডেভেলপারদের জন্য',
    h1: 'আপনার AI এজেন্টকে সঠিক বৈদিক জ্যোতির্বিদ্যা দিন',
    lead: 'Claude Desktop, Cursor, Windsurf বা যেকোনো MCP-সামঞ্জস্যপূর্ণ ক্লায়েন্টে Dekho Panchang ইঞ্জিন — Swiss Ephemeris, Lahiri সায়ন, BPHS-প্রমাণক — যুক্ত করে এমন একটি স্থানীয় MCP সার্ভার। কোনো API কী নেই। প্রতি-কলে খরচ নেই।',
    installEyebrow: 'দুই-মিনিটের ইনস্টল',
    installHeading: 'এটি আপনার Claude Desktop config-এ যোগ করুন',
    installLead: 'নীচের স্নিপেটটি আপনার claude_desktop_config.json-এ পেস্ট করুন। Claude পুনরায় চালু করুন। পঞ্জিকা বা কুণ্ডলি সম্পর্কে জিজ্ঞাসা করুন — চারটি সরঞ্জাম স্বয়ংক্রিয়ভাবে উপস্থিত হবে।',
    step1: 'claude_desktop_config.json খুঁজুন বা তৈরি করুন',
    step2: 'নীচের mcpServers ব্লকটি পেস্ট করুন',
    step3: 'Claude Desktop পুনরায় চালু করুন — MCP মেনুতে সরঞ্জামগুলি উপস্থিত হবে',
    toolsHeading: 'আপনার এজেন্ট কী করতে পারে',
    toolsLead: 'চারটি সরঞ্জাম মূল গণনা পৃষ্ঠকে আচ্ছাদন করে। প্রতিটি প্রতিক্রিয়ায় BPHS, সূর্য সিদ্ধান্ত, মুহূর্ত চিন্তামণি এবং Swiss Ephemeris DE441-এর উদ্ধৃতি রয়েছে।',
    designHeading: 'ডিজাইন সীমাবদ্ধতা',
    designLead: 'আমাদের ইচ্ছাকৃত সিদ্ধান্ত — এবং তাদের কারণ।',
    cta: 'npm-এ দেখুন',
    ctaSecondary: 'GitHub-এ উৎস দেখুন',
    githubLabel: 'GitHub',
    npmLabel: 'npm',
    webAppLabel: 'ওয়েব অ্যাপ চেষ্টা করুন',
    methodologyLabel: 'পদ্ধতি পড়ুন',
    requirementsHeading: 'প্রয়োজনীয়তা',
    requirementsBody: 'Node.js 18.17 বা নতুন। প্রথম রানে sweph নির্ভরতা একটি নেটিভ বাইনারি কম্পাইল করে (C++ টুলচেইন প্রয়োজন)। কম্পাইল ব্যর্থ হলে, সার্ভার Meeus fallback দিয়ে চলে।',
    faqHeading: 'কেন এটি বিদ্যমান?',
  },
  gu: {
    eyebrow: 'AI ડેવલપર્સ માટે',
    h1: 'તમારા AI એજન્ટને ચોકસાઈભરી વૈદિક ખગોળશાસ્ત્ર આપો',
    lead: 'Claude Desktop, Cursor, Windsurf અથવા કોઈપણ MCP-સુસંગત ક્લાયન્ટમાં Dekho Panchang એન્જિન — Swiss Ephemeris, Lahiri સાયન, BPHS-માનક — જોડતું સ્થાનિક MCP સર્વર. કોઈ API કી નથી. કૉલ દીઠ ખર્ચ નથી.',
    installEyebrow: 'બે-મિનિટમાં ઇન્સ્ટોલ',
    installHeading: 'આને તમારા Claude Desktop config માં ઉમેરો',
    installLead: 'નીચેની સ્નિપેટને તમારા claude_desktop_config.json માં પેસ્ટ કરો. Claude ને પુનઃપ્રારંભ કરો. પંચાંગ અથવા કુંડળી વિશે પૂછો — ચાર સાધનો આપોઆપ દેખાશે.',
    step1: 'claude_desktop_config.json શોધો અથવા બનાવો',
    step2: 'નીચેનો mcpServers બ્લોક પેસ્ટ કરો',
    step3: 'Claude Desktop ને પુનઃપ્રારંભ કરો — MCP મેનૂમાં સાધનો દેખાશે',
    toolsHeading: 'તમારો એજન્ટ શું કરી શકે',
    toolsLead: 'ચાર સાધનો મુખ્ય ગણતરી ક્ષેત્રને આવરી લે છે. દરેક પ્રતિભાવમાં BPHS, સૂર્ય સિદ્ધાંત, મુહૂર્ત ચિંતામણિ અને Swiss Ephemeris DE441 નો ઉલ્લેખ છે.',
    designHeading: 'ડિઝાઇન મર્યાદાઓ',
    designLead: 'અમારા જાણી-જોઈને લીધેલા નિર્ણયો — અને તેમના કારણો.',
    cta: 'npm પર જુઓ',
    ctaSecondary: 'GitHub પર સ્રોત જુઓ',
    githubLabel: 'GitHub',
    npmLabel: 'npm',
    webAppLabel: 'વેબ એપ અજમાવો',
    methodologyLabel: 'પદ્ધતિ વાંચો',
    requirementsHeading: 'આવશ્યકતાઓ',
    requirementsBody: 'Node.js 18.17 અથવા નવું. પ્રથમ રનમાં sweph ડિપેન્ડન્સી નેટિવ બાઇનરી કમ્પાઇલ કરે છે (C++ ટૂલચેન જરૂરી). કમ્પાઇલ નિષ્ફળ થાય તો, સર્વર Meeus fallback સાથે ચાલે છે.',
    faqHeading: 'આ કેમ અસ્તિત્વ ધરાવે છે?',
  },
  kn: {
    eyebrow: 'AI ಡೆವಲಪರ್‌ಗಳಿಗಾಗಿ',
    h1: 'ನಿಮ್ಮ AI ಏಜೆಂಟ್‌ಗೆ ನಿಖರವಾದ ವೈದಿಕ ಖಗೋಳಶಾಸ್ತ್ರವನ್ನು ನೀಡಿ',
    lead: 'Claude Desktop, Cursor, Windsurf ಅಥವಾ ಯಾವುದೇ MCP-ಹೊಂದಾಣಿಕೆಯ ಕ್ಲೈಂಟ್‌ಗೆ Dekho Panchang ಎಂಜಿನ್ ಅನ್ನು — Swiss Ephemeris, Lahiri ಸಾಯನ, BPHS-ಪ್ರಮಾಣಿತ — ಪ್ಲಗ್ ಮಾಡುವ ಸ್ಥಳೀಯ MCP ಸರ್ವರ್. API ಕೀಗಳಿಲ್ಲ. ಪ್ರತಿ-ಕರೆಗೆ ವೆಚ್ಚವಿಲ್ಲ.',
    installEyebrow: 'ಎರಡು-ನಿಮಿಷದ ಸ್ಥಾಪನೆ',
    installHeading: 'ಇದನ್ನು ನಿಮ್ಮ Claude Desktop config ಗೆ ಸೇರಿಸಿ',
    installLead: 'ಕೆಳಗಿನ ಸ್ನಿಪೆಟ್ ಅನ್ನು ನಿಮ್ಮ claude_desktop_config.json ಗೆ ಅಂಟಿಸಿ. Claude ಅನ್ನು ಪುನಃ ಪ್ರಾರಂಭಿಸಿ. ಪಂಚಾಂಗ ಅಥವಾ ಜಾತಕದ ಬಗ್ಗೆ ಕೇಳಿ — ನಾಲ್ಕು ಸಾಧನಗಳು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಗೋಚರಿಸುತ್ತವೆ.',
    step1: 'claude_desktop_config.json ಅನ್ನು ಪತ್ತೆಹಚ್ಚಿ ಅಥವಾ ರಚಿಸಿ',
    step2: 'ಕೆಳಗಿನ mcpServers ಬ್ಲಾಕ್ ಅನ್ನು ಅಂಟಿಸಿ',
    step3: 'Claude Desktop ಅನ್ನು ಪುನಃ ಪ್ರಾರಂಭಿಸಿ — MCP ಮೆನುವಿನಲ್ಲಿ ಸಾಧನಗಳು ಗೋಚರಿಸುತ್ತವೆ',
    toolsHeading: 'ನಿಮ್ಮ ಏಜೆಂಟ್ ಏನು ಮಾಡಬಹುದು',
    toolsLead: 'ನಾಲ್ಕು ಸಾಧನಗಳು ಮುಖ್ಯ ಗಣನೆಯ ಮೇಲ್ಮೈಯನ್ನು ಒಳಗೊಂಡಿವೆ. ಪ್ರತಿ ಪ್ರತಿಕ್ರಿಯೆಯು BPHS, ಸೂರ್ಯ ಸಿದ್ಧಾಂತ, ಮುಹೂರ್ತ ಚಿಂತಾಮಣಿ ಮತ್ತು Swiss Ephemeris DE441 ಅನ್ನು ಉಲ್ಲೇಖಿಸುತ್ತದೆ.',
    designHeading: 'ವಿನ್ಯಾಸ ಮಿತಿಗಳು',
    designLead: 'ನಾವು ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಮಾಡಿದ ಆಯ್ಕೆಗಳು — ಮತ್ತು ಅವುಗಳ ಕಾರಣಗಳು.',
    cta: 'npm ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ',
    ctaSecondary: 'GitHub ನಲ್ಲಿ ಮೂಲವನ್ನು ವೀಕ್ಷಿಸಿ',
    githubLabel: 'GitHub',
    npmLabel: 'npm',
    webAppLabel: 'ವೆಬ್ ಅಪ್ಲಿಕೇಶನ್ ಪ್ರಯತ್ನಿಸಿ',
    methodologyLabel: 'ವಿಧಾನವನ್ನು ಓದಿ',
    requirementsHeading: 'ಅವಶ್ಯಕತೆಗಳು',
    requirementsBody: 'Node.js 18.17 ಅಥವಾ ಹೊಸದು. ಮೊದಲ ರನ್‌ನಲ್ಲಿ sweph ಅವಲಂಬನೆ ಸ್ಥಳೀಯ ಬೈನರಿಯನ್ನು ಕಂಪೈಲ್ ಮಾಡುತ್ತದೆ (C++ ಟೂಲ್‌ಚೈನ್ ಅಗತ್ಯವಿದೆ). ಕಂಪೈಲ್ ವಿಫಲವಾದರೆ, ಸರ್ವರ್ Meeus fallback ನೊಂದಿಗೆ ಚಲಿಸುತ್ತದೆ.',
    faqHeading: 'ಇದು ಏಕೆ ಇದೆ?',
  },
};

// Tool descriptions in English (used across all locales — the tool
// names themselves are English identifiers, so the surrounding copy
// stays in English for consistency with the actual JSON schema the
// LLM sees).
const TOOLS = [
  {
    name: 'get_panchang',
    summary:
      'Five limbs of the daily almanac (tithi, nakshatra, yoga, karana, vara) plus sunrise / sunset, Rahu Kaal, Yamaganda, Gulika, masa, samvatsara for a given date and location.',
  },
  {
    name: 'get_kundali',
    summary:
      'Vedic birth chart from birth date, time, and coordinates. Ascendant, planetary positions with signs / nakshatras / houses / dignities, house cusps, Vimshottari mahadashas, and detected named yogas.',
  },
  {
    name: 'get_muhurat',
    summary:
      'Auspicious dates in a given month + location for a specified activity (marriage, griha_pravesh, mundan, vehicle, travel, property, business, education). Each date graded excellent / good / acceptable.',
  },
  {
    name: 'get_matching',
    summary:
      '36-point Ashta Kuta (Guna Milan) compatibility score between two people from their Moon-sign facts. Includes per-kuta breakdown and Nadi-dosha status.',
  },
];

// Design constraints — the "why" for each deliberate choice.
const DESIGN_CONSTRAINTS = [
  {
    heading: 'Local execution',
    body: 'The server runs on the user\'s machine. dekhopanchang.com is never contacted at query time. No per-call cost, no rate limits, no data leaving your box.',
  },
  {
    heading: 'No LLM inference',
    body: 'Pure astronomical computation. If your agent wants natural-language interpretation, feed the JSON response to your model of choice — but the numbers are ground truth.',
  },
  {
    heading: 'Swiss Ephemeris DE441',
    body: 'Sub-arcsecond planetary positions. Meeus fallback if the native binary fails to compile (Sun ~0.01°, Moon ~0.5°, outer planets 1-3°).',
  },
  {
    heading: 'Lahiri sidereal ayanamsha by default',
    body: 'Indian government standard. Raman and KP are opt-in via the ayanamsha parameter on get_kundali.',
  },
  {
    heading: 'Citations in every response',
    body: 'Every payload names its sources: BPHS, Surya Siddhanta, Muhurta Chintamani, Swiss Ephemeris DE441. Attribution-friendly for LLM-generated summaries.',
  },
  {
    heading: 'Deterministic',
    body: 'Same inputs, same outputs, always. No hidden state, no A/B, no per-user calibration.',
  },
];

// The exact JSON snippet users paste into their Claude Desktop config.
// Kept as a string so we can render it verbatim in <pre>.
const CLAUDE_CONFIG_SNIPPET = `{
  "mcpServers": {
    "dekhopanchang": {
      "command": "npx",
      "args": ["-y", "@dekhopanchang/mcp"]
    }
  }
}`;

const NPM_URL = 'https://www.npmjs.com/package/@dekhopanchang/mcp';
const GITHUB_URL = 'https://github.com/krazykrackpot/panchang/tree/main/packages/mcp-server';

export default async function McpPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const t = LABELS[locale] ?? LABELS.en;

  return (
    <main className="min-h-screen bg-bg-primary pb-20" style={bodyFont}>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-8">
        <p className="text-text-secondary text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-gold-primary" aria-hidden="true" />
          {t.eyebrow}
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold text-gold-light mb-5 leading-tight"
          style={headingFont}
        >
          {t.h1}
        </h1>
        <p className="text-lg text-text-primary/85 max-w-3xl leading-relaxed">
          {t.lead}
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-primary/15 border border-gold-primary/40 text-gold-light hover:bg-gold-primary/25 hover:border-gold-primary/60 transition-colors text-sm font-semibold"
          >
            <Package className="w-4 h-4" aria-hidden="true" />
            {t.cta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gold-primary/20 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-colors text-sm"
          >
            <Code className="w-4 h-4" aria-hidden="true" />
            {t.ctaSecondary}
          </a>
        </div>
      </section>

      {/* Install section */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-gold-primary/10">
        <p className="text-text-secondary text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gold-primary" aria-hidden="true" />
          {t.installEyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light mb-3" style={headingFont}>
          {t.installHeading}
        </h2>
        <p className="text-text-primary/75 max-w-3xl leading-relaxed mb-6">{t.installLead}</p>

        <ol className="space-y-2 mb-6 text-sm text-text-primary/85">
          <li className="flex items-start gap-3">
            <span className="text-gold-primary font-semibold shrink-0 w-6">1.</span>
            <span>{t.step1}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gold-primary font-semibold shrink-0 w-6">2.</span>
            <span>{t.step2}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gold-primary font-semibold shrink-0 w-6">3.</span>
            <span>{t.step3}</span>
          </li>
        </ol>

        {/* Config snippet card. Uses the strong gradient variant. */}
        <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] p-1 hover:border-gold-primary/40 transition-colors">
          <div className="rounded-2xl bg-[#05070f]/70 overflow-x-auto">
            <pre className="p-6 text-sm text-gold-light/90 font-mono leading-relaxed">
              <code>{CLAUDE_CONFIG_SNIPPET}</code>
            </pre>
          </div>
        </div>

        <p className="mt-4 text-xs text-text-secondary">
          macOS: <span className="text-text-primary/70 font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</span>
          {' · '}
          Windows: <span className="text-text-primary/70 font-mono">%APPDATA%\Claude\claude_desktop_config.json</span>
        </p>
      </section>

      {/* Tools list */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-gold-primary/10">
        <p className="text-text-secondary text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-primary" aria-hidden="true" />
          MCP Tools
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light mb-3" style={headingFont}>
          {t.toolsHeading}
        </h2>
        <p className="text-text-primary/75 max-w-3xl leading-relaxed mb-8">{t.toolsLead}</p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <li
              key={tool.name}
              className="p-5 rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] hover:border-gold-primary/40 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gold-light font-mono mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-text-primary/80 leading-relaxed">
                {tool.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Design constraints */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-gold-primary/10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light mb-3" style={headingFont}>
          {t.designHeading}
        </h2>
        <p className="text-text-primary/75 max-w-3xl leading-relaxed mb-8">{t.designLead}</p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DESIGN_CONSTRAINTS.map((c) => (
            <li
              key={c.heading}
              className="p-5 rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]"
            >
              <h3 className="text-base font-semibold text-gold-light mb-2" style={headingFont}>
                {c.heading}
              </h3>
              <p className="text-sm text-text-primary/80 leading-relaxed">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Requirements */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-gold-primary/10">
        <h2 className="text-2xl font-bold text-gold-light mb-3" style={headingFont}>
          {t.requirementsHeading}
        </h2>
        <p className="text-sm text-text-primary/75 max-w-3xl leading-relaxed">
          {t.requirementsBody}
        </p>
      </section>

      {/* Footer links */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-gold-primary/10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <a
            href={NPM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-light transition-colors"
          >
            <Package className="w-4 h-4" aria-hidden="true" />
            {t.npmLabel}
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-light transition-colors"
          >
            <Code className="w-4 h-4" aria-hidden="true" />
            {t.githubLabel}
          </a>
          <Link
            href="/"
            className="text-text-secondary hover:text-gold-light transition-colors"
          >
            {t.webAppLabel}
          </Link>
          <Link
            href="/about/methodology"
            className="text-text-secondary hover:text-gold-light transition-colors"
          >
            {t.methodologyLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
