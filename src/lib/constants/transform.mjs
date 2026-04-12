#!/usr/bin/env node
/**
 * One-shot transform: add ta/te/bn/kn/gu/mr/mai to ALL Trilingual fields.
 *
 * Approach:
 * 1. For single-line { en: '...', hi: '...', sa: '...' } — add all 7 new keys inline
 * 2. For multi-line en:/hi:/sa: blocks — add mr/mai (from hi) + ta/te/bn/kn/gu lines after sa:
 *
 * For mr/mai: always copy from hi
 * For ta/te/bn/kn/gu on names/deities: use lookup table
 * For ta/te/bn/kn/gu on descriptive text: use per-festival lookup table
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputFile = path.join(__dirname, 'festival-details.ts');
let src = fs.readFileSync(inputFile, 'utf-8');

// ═══ STEP 1: Handle single-line Trilingual objects ═══
// These are name, deity, fastNote, story, benefit fields on one line

// Lookup for known en values → ta/te/bn/kn/gu
const nameLookup = {
  'Makar Sankranti': { ta: 'மகர சங்கராந்தி', te: 'మకర సంక్రాంతి', bn: 'মকর সংক্রান্তি', kn: 'ಮಕರ ಸಂಕ್ರಾಂತಿ', gu: 'મકર સંક્રાંતિ' },
  'Vasant Panchami': { ta: 'வசந்த பஞ்சமி', te: 'వసంత పంచమి', bn: 'বসন্ত পঞ্চমী', kn: 'ವಸಂತ ಪಂಚಮಿ', gu: 'વસંત પંચમી' },
  'Maha Shivaratri': { ta: 'மகா சிவராத்திரி', te: 'మహా శివరాత్రి', bn: 'মহাশিবরাত্রি', kn: 'ಮಹಾ ಶಿವರಾತ್ರಿ', gu: 'મહા શિવરાત્રી' },
  'Holi': { ta: 'ஹோலி', te: 'హోళీ', bn: 'হোলি', kn: 'ಹೋಳಿ', gu: 'હોળી' },
  'Ram Navami': { ta: 'ராம நவமி', te: 'శ్రీరామ నవమి', bn: 'রাম নবমী', kn: 'ಶ್ರೀರಾಮ ನವಮಿ', gu: 'રામ નવમી' },
  'Hanuman Jayanti': { ta: 'ஹனுமான் ஜயந்தி', te: 'హనుమాన్ జయంతి', bn: 'হনুমান জয়ন্তী', kn: 'ಹನುಮಾನ್ ಜಯಂತಿ', gu: 'હનુમાન જયંતી' },
  'Guru Purnima': { ta: 'குரு பூர்ணிமா', te: 'గురు పూర్ణిమ', bn: 'গুরু পূর্ণিমা', kn: 'ಗುರು ಪೂರ್ಣಿಮಾ', gu: 'ગુરુ પૂર્ણિમા' },
  'Raksha Bandhan': { ta: 'ரக்ஷா பந்தன்', te: 'రక్షా బంధన్', bn: 'রক্ষা বন্ধন', kn: 'ರಕ್ಷಾ ಬಂಧನ', gu: 'રક્ષા બંધન' },
  'Janmashtami': { ta: 'ஜன்மாஷ்டமி', te: 'జన్మాష్టమి', bn: 'জন্মাষ্টমী', kn: 'ಜನ್ಮಾಷ್ಟಮಿ', gu: 'જન્માષ્ટમી' },
  'Ganesh Chaturthi': { ta: 'விநாயகர் சதுர்த்தி', te: 'వినాయక చవితి', bn: 'গণেশ চতুর্থী', kn: 'ಗಣೇಶ ಚತುರ್ಥಿ', gu: 'ગણેશ ચતુર્થી' },
  'Navaratri (Sharad)': { ta: 'நவராத்திரி (சரத்)', te: 'నవరాత్రి (శరత్)', bn: 'নবরাত্রি (শরৎ)', kn: 'ನವರಾತ್ರಿ (ಶರದ್)', gu: 'નવરાત્રી (શરદ)' },
  'Dussehra': { ta: 'தசரா', te: 'దసరా', bn: 'দশেরা', kn: 'ದಸರಾ', gu: 'દશેરા' },
  'Diwali': { ta: 'தீபாவளி', te: 'దీపావళి', bn: 'দীপাবলি', kn: 'ದೀಪಾವಳಿ', gu: 'દિવાળી' },
  'Ratha Saptami': { ta: 'ரத சப்தமி', te: 'రథ సప్తమి', bn: 'রথ সপ্তমী', kn: 'ರಥ ಸಪ್ತಮಿ', gu: 'રથ સપ્તમી' },
  'Bhishma Ashtami': { ta: 'பீஷ்ம அஷ்டமி', te: 'భీష్మ అష్టమి', bn: 'ভীষ্ম অষ্টমী', kn: 'ಭೀಷ್ಮ ಅಷ್ಟಮಿ', gu: 'ભીષ્મ અષ્ટમી' },
  'Chaitra Navratri': { ta: 'சைத்ர நவராத்திரி', te: 'చైత్ర నవరాత్రి', bn: 'চৈত্র নবরাত্রি', kn: 'ಚೈತ್ರ ನವರಾತ್ರಿ', gu: 'ચૈત્ર નવરાત્રી' },
  'Akshaya Tritiya': { ta: 'அக்ஷய திருதியை', te: 'అక్షయ తృతీయ', bn: 'অক্ষয় তৃতীয়া', kn: 'ಅಕ್ಷಯ ತೃತೀಯ', gu: 'અક્ષય તૃતીયા' },
  'Buddha Purnima': { ta: 'புத்த பூர்ணிமா', te: 'బుద్ధ పూర్ణిమ', bn: 'বুদ্ধ পূর্ণিমা', kn: 'ಬುದ್ಧ ಪೂರ್ಣಿಮಾ', gu: 'બુદ્ધ પૂર્ણિમા' },
  'Ganga Dussehra': { ta: 'கங்கா தசரா', te: 'గంగా దసరా', bn: 'গঙ্গা দশেরা', kn: 'ಗಂಗಾ ದಸರಾ', gu: 'ગંગા દશેરા' },
  'Nag Panchami': { ta: 'நாக பஞ்சமி', te: 'నాగ పంచమి', bn: 'নাগ পঞ্চমী', kn: 'ನಾಗ ಪಂಚಮಿ', gu: 'નાગ પંચમી' },
  'Hariyali Teej': { ta: 'ஹரியாளி தீஜ்', te: 'హరియాలీ తీజ్', bn: 'হরিয়ালি তীজ', kn: 'ಹರಿಯಾಳಿ ತೀಜ್', gu: 'હરિયાળી તીજ' },
  'Anant Chaturdashi': { ta: 'அனந்த சதுர்த்தசி', te: 'అనంత చతుర్దశి', bn: 'অনন্ত চতুর্দশী', kn: 'ಅನಂತ ಚತುರ್ದಶಿ', gu: 'અનંત ચતુર્દશી' },
  'Dhanteras': { ta: 'தன்தேரஸ்', te: 'ధన్‌తేరస్', bn: 'ধনতেরস', kn: 'ಧನ್‌ತೇರಸ್', gu: 'ધનતેરસ' },
  'Narak Chaturdashi': { ta: 'நரக சதுர்த்தசி', te: 'నరక చతుర్దశి', bn: 'নরক চতুর্দশী', kn: 'ನರಕ ಚತುರ್ದಶಿ', gu: 'નરક ચતુર્દશી' },
  'Govardhan Puja': { ta: 'கோவர்த்தன பூஜை', te: 'గోవర్ధన పూజ', bn: 'গোবর্ধন পূজা', kn: 'ಗೋವರ್ಧನ ಪೂಜೆ', gu: 'ગોવર્ધન પૂજા' },
  'Bhai Dooj': { ta: 'பாய் தூஜ்', te: 'భాయి దూజ్', bn: 'ভাই ফোঁটা', kn: 'ಭಾಯಿ ದೂಜ್', gu: 'ભાઈ દૂજ' },
  'Kartik Purnima': { ta: 'கார்த்திக பூர்ணிமா', te: 'కార్తీక పూర్ణిమ', bn: 'কার্তিক পূর্ণিমা', kn: 'ಕಾರ್ತಿಕ ಪೂರ್ಣಿಮಾ', gu: 'કાર્તિક પૂર્ણિમા' },
  'Surya (Sun God)': { ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য দেব', kn: 'ಸೂರ್ಯ ದೇವ', gu: 'સૂર્ય દેવ' },
  'Saraswati': { ta: 'சரஸ்வதி', te: 'సరస్వతి', bn: 'সরস্বতী', kn: 'ಸರಸ್ವತಿ', gu: 'સરસ્વતી' },
  'Lord Shiva': { ta: 'சிவபெருமான்', te: 'శివుడు', bn: 'শিব', kn: 'ಶಿವ', gu: 'શિવ' },
  'Lord Rama': { ta: 'ஸ்ரீ ராமர்', te: 'శ్రీరాముడు', bn: 'শ্রীরাম', kn: 'ಶ್ರೀರಾಮ', gu: 'શ્રી રામ' },
  'Lord Hanuman': { ta: 'ஹனுமான்', te: 'హనుమాన్', bn: 'হনুমান', kn: 'ಹನುಮಾನ್', gu: 'હનુમાન' },
  'Lord Krishna': { ta: 'ஸ்ரீ கிருஷ்ணர்', te: 'శ్రీకృష్ణుడు', bn: 'শ্রীকৃষ্ণ', kn: 'ಶ್ರೀಕೃಷ್ಣ', gu: 'શ્રી કૃષ્ણ' },
  'Lord Ganesha': { ta: 'விநாயகர்', te: 'గణేశుడు', bn: 'গণেশ', kn: 'ಗಣೇಶ', gu: 'ગણેશ' },
  'Lord Vishnu': { ta: 'விஷ்ணு', te: 'విష్ణువు', bn: 'বিষ্ণু', kn: 'ವಿಷ್ಣು', gu: 'વિષ્ણુ' },
  'Purnima Vrat': { ta: 'பூர்ணிமா விரதம்', te: 'పూర్ణిమ వ్రతం', bn: 'পূর্ণিমা ব্রত', kn: 'ಪೂರ್ಣಿಮಾ ವ್ರತ', gu: 'પૂર્ણિમા વ્રત' },
  'Amavasya': { ta: 'அமாவாசை', te: 'అమావాస్య', bn: 'অমাবস্যা', kn: 'ಅಮಾವಾಸ್ಯೆ', gu: 'અમાવસ્યા' },
  'Sankashti Chaturthi': { ta: 'சங்கஷ்ட சதுர்த்தி', te: 'సంకష్ట చతుర్థి', bn: 'সংকষ্টী চতুর্থী', kn: 'ಸಂಕಷ್ಟ ಚತುರ್ಥಿ', gu: 'સંકષ્ટી ચતુર્થી' },
  'Pradosham': { ta: 'பிரதோஷம்', te: 'ప్రదోషం', bn: 'প্রদোষ', kn: 'ಪ್ರದೋಷ', gu: 'પ્રદોષ' },
  'Ekadashi Vrat': { ta: 'ஏகாதசி விரதம்', te: 'ఏకాదశి వ్రతం', bn: 'একাদশী ব্রত', kn: 'ಏಕಾದಶಿ ವ್ರತ', gu: 'એકાદશી વ્રત' },
  // Deity compound names
  'Sage Vyasa / The Guru': { ta: 'வியாசர் / குரு', te: 'వేదవ్యాసుడు / గురువు', bn: 'বেদব্যাস / গুরু', kn: 'ವೇದವ್ಯಾಸ / ಗುರು', gu: 'વેદવ્યાસ / ગુરુ' },
  'Lakshmi / Krishna': { ta: 'லக்ஷ்மி / கிருஷ்ணர்', te: 'లక్ష్మీ / కృష్ణుడు', bn: 'লক্ষ্মী / কৃষ্ণ', kn: 'ಲಕ್ಷ್ಮಿ / ಕೃಷ್ಣ', gu: 'લક્ષ્મી / કૃષ્ણ' },
  'Goddess Durga (Navadurga)': { ta: 'துர்கா தேவி (நவதுர்கா)', te: 'దుర్గా దేవి (నవదుర్గ)', bn: 'দুর্গা দেবী (নবদুর্গা)', kn: 'ದುರ್ಗಾ ದೇವಿ (ನವದುರ್ಗಾ)', gu: 'દુર્ગા દેવી (નવદુર્ગા)' },
  'Lord Rama / Goddess Durga': { ta: 'ராமர் / துர்கா தேவி', te: 'శ్రీరాముడు / దుర్గా దేవి', bn: 'শ্রীরাম / দুর্গা দেবী', kn: 'ಶ್ರೀರಾಮ / ದುರ್ಗಾ ದೇವಿ', gu: 'રામ / દુર્ગા દેવી' },
  'Goddess Lakshmi, Lord Rama, Lord Ganesha': { ta: 'லக்ஷ்மி, ராமர், விநாயகர்', te: 'లక్ష్మీ, శ్రీరాముడు, గణేశుడు', bn: 'লক্ষ্মী, রাম, গণেশ', kn: 'ಲಕ್ಷ್ಮಿ, ರಾಮ, ಗಣೇಶ', gu: 'લક્ષ્મી, રામ, ગણેશ' },
  'Bhishma Pitamah, Lord Vishnu': { ta: 'பீஷ்ம பிதாமகர், விஷ்ணு', te: 'భీష్మ పితామహుడు, విష్ణువు', bn: 'ভীষ্ম পিতামহ, বিষ্ণু', kn: 'ಭೀಷ್ಮ ಪಿತಾಮಹ, ವಿಷ್ಣು', gu: 'ભીષ્મ પિતામહ, વિષ્ણુ' },
  'Lord Vishnu, Goddess Lakshmi, Lord Parashurama': { ta: 'விஷ்ணு, லக்ஷ்மி, பரசுராமர்', te: 'విష్ణువు, లక్ష్మీ, పరశురాముడు', bn: 'বিষ্ণু, লক্ষ্মী, পরশুরাম', kn: 'ವಿಷ್ಣು, ಲಕ್ಷ್ಮಿ, ಪರಶುರಾಮ', gu: 'વિષ્ણુ, લક્ષ્મી, પરશુરામ' },
  'Gautama Buddha (Vishnu Avatar)': { ta: 'கௌதம புத்தர் (விஷ்ணு அவதாரம்)', te: 'గౌతమ బుద్ధుడు (విష్ణు అవతారం)', bn: 'গৌতম বুদ্ধ (বিষ্ণু অবতার)', kn: 'ಗೌತಮ ಬುದ್ಧ (ವಿಷ್ಣು ಅವತಾರ)', gu: 'ગૌતમ બુદ્ધ (વિષ્ણુ અવતાર)' },
  'Goddess Ganga, Lord Shiva': { ta: 'கங்கா தேவி, சிவன்', te: 'గంగా దేవి, శివుడు', bn: 'গঙ্গা দেবী, শিব', kn: 'ಗಂಗಾ ದೇವಿ, ಶಿವ', gu: 'ગંગા દેવી, શિવ' },
  'Naga Devatas (Vasuki, Shesha, Takshaka)': { ta: 'நாக தேவதைகள் (வாசுகி, சேஷன், தக்ஷகன்)', te: 'నాగ దేవతలు (వాసుకి, శేషుడు, తక్షకుడు)', bn: 'নাগ দেবতা (বাসুকি, শেষ, তক্ষক)', kn: 'ನಾಗ ದೇವತೆಗಳು (ವಾಸುಕಿ, ಶೇಷ, ತಕ್ಷಕ)', gu: 'નાગ દેવતા (વાસુકિ, શેષ, તક્ષક)' },
  'Goddess Parvati, Lord Shiva': { ta: 'பார்வதி தேவி, சிவன்', te: 'పార్వతీ దేవి, శివుడు', bn: 'পার্বতী দেবী, শিব', kn: 'ಪಾರ್ವತಿ ದೇವಿ, ಶಿವ', gu: 'પાર્વતી દેવી, શિવ' },
  'Lord Vishnu (Ananta form), Lord Ganesha': { ta: 'விஷ்ணு (அனந்த ரூபம்), விநாயகர்', te: 'విష్ణువు (అనంత రూపం), గణేశుడు', bn: 'বিষ্ণু (অনন্ত রূপ), গণেশ', kn: 'ವಿಷ್ಣು (ಅನಂತ ರೂಪ), ಗಣೇಶ', gu: 'વિષ્ણુ (અનંત રૂપ), ગણેશ' },
  'Lord Dhanvantari, Goddess Lakshmi, Lord Kubera': { ta: 'தன்வந்தரி, லக்ஷ்மி, குபேரன்', te: 'ధన్వంతరి, లక్ష్మీ, కుబేరుడు', bn: 'ধন্বন্তরি, লক্ষ্মী, কুবের', kn: 'ಧನ್ವಂತರಿ, ಲಕ್ಷ್ಮಿ, ಕುಬೇರ', gu: 'ધન્વંતરિ, લક્ષ્મી, કુબેર' },
  'Lord Krishna, Goddess Kali': { ta: 'கிருஷ்ணர், காளி தேவி', te: 'శ్రీకృష్ణుడు, కాళీ దేవి', bn: 'কৃষ্ণ, কালী দেবী', kn: 'ಕೃಷ್ಣ, ಕಾಳಿ ದೇವಿ', gu: 'કૃષ્ણ, કાલી દેવી' },
  'Yama, Yamuna': { ta: 'யமன், யமுனா', te: 'యముడు, యమున', bn: 'যম, যমুনা', kn: 'ಯಮ, ಯಮುನಾ', gu: 'યમ, યમુના' },
  'Lord Shiva (Tripurari), Lord Vishnu, Kartikeya': { ta: 'சிவன் (திரிபுராரி), விஷ்ணு, கார்த்திகேயன்', te: 'శివుడు (త్రిపురారి), విష్ణువు, కార్తికేయుడు', bn: 'শিব (ত্রিপুরারি), বিষ্ণু, কার্তিকেয়', kn: 'ಶಿವ (ತ್ರಿಪುರಾರಿ), ವಿಷ್ಣು, ಕಾರ್ತಿಕೇಯ', gu: 'શિવ (ત્રિપુરારિ), વિષ્ણુ, કાર્તિકેય' },
  'Lord Vishnu / Chandra (Moon)': { ta: 'விஷ்ணு / சந்திரன்', te: 'విష్ణువు / చంద్రుడు', bn: 'বিষ্ণু / চন্দ্র', kn: 'ವಿಷ್ಣು / ಚಂದ್ರ', gu: 'વિષ્ણુ / ચંદ્ર' },
  'Lord Vishnu (as protector of Prahlad)': { ta: 'விஷ்ணு (பிரகலாதன் காவலர்)', te: 'విష్ణువు (ప్రహ్లాదుని రక్షకుడు)', bn: 'বিষ্ণু (প্রহ্লাদের রক্ষক)', kn: 'ವಿಷ್ಣು (ಪ್ರಹ್ಲಾದನ ರಕ್ಷಕ)', gu: 'વિષ્ણુ (પ્રહ્લાદના રક્ષક)' },
  'Pitrs (Ancestors)': { ta: 'பித்ருக்கள் (முன்னோர்)', te: 'పితృదేవతలు (పూర్వీకులు)', bn: 'পিতৃগণ (পূর্বপুরুষ)', kn: 'ಪಿತೃಗಳು (ಪೂರ್ವಜರು)', gu: 'પિતૃ (પૂર્વજ)' },
  // Ekadashi names
  'Kamada Ekadashi': { ta: 'காமதா ஏகாதசி', te: 'కామద ఏకాదశి', bn: 'কামদা একাদশী', kn: 'ಕಾಮದಾ ಏಕಾದಶಿ', gu: 'કામદા એકાદશી' },
  'Papamochani Ekadashi': { ta: 'பாபமோசனி ஏகாதசி', te: 'పాపమోచని ఏకాదశి', bn: 'পাপমোচনী একাদশী', kn: 'ಪಾಪಮೋಚನಿ ಏಕಾದಶಿ', gu: 'પાપમોચની એકાદશી' },
  'Mohini Ekadashi': { ta: 'மோஹினி ஏகாதசி', te: 'మోహిని ఏకాదశి', bn: 'মোহিনী একাদশী', kn: 'ಮೋಹಿನಿ ಏಕಾದಶಿ', gu: 'મોહિની એકાદશી' },
  'Varuthini Ekadashi': { ta: 'வருதினி ஏகாதசி', te: 'వరూథిని ఏకాదశి', bn: 'বরূথিনী একাদশী', kn: 'ವರೂಥಿನಿ ಏಕಾದಶಿ', gu: 'વરૂથિની એકાદશી' },
  'Nirjala Ekadashi': { ta: 'நிர்ஜலா ஏகாதசி', te: 'నిర్జల ఏకాదశి', bn: 'নির্জলা একাদশী', kn: 'ನಿರ್ಜಲಾ ಏಕಾದಶಿ', gu: 'નિર્જલા એકાદશી' },
  'Apara Ekadashi': { ta: 'அபரா ஏகாதசி', te: 'అపర ఏకాదశి', bn: 'অপরা একাদশী', kn: 'ಅಪರಾ ಏಕಾದಶಿ', gu: 'અપરા એકાદશી' },
  'Devshayani Ekadashi': { ta: 'தேவசயனி ஏகாதசி', te: 'దేవశయని ఏకాదశి', bn: 'দেবশয়নী একাদশী', kn: 'ದೇವಶಯನಿ ಏಕಾದಶಿ', gu: 'દેવશયની એકાદશી' },
  'Yogini Ekadashi': { ta: 'யோகினி ஏகாதசி', te: 'యోగిని ఏకాదశి', bn: 'যোগিনী একাদশী', kn: 'ಯೋಗಿನಿ ಏಕಾದಶಿ', gu: 'યોગિની એકાદશી' },
  'Shravana Putrada Ekadashi': { ta: 'ஸ்ராவண புத்ரதா ஏகாதசி', te: 'శ్రావణ పుత్రదా ఏకాదశి', bn: 'শ্রাবণ পুত্রদা একাদশী', kn: 'ಶ್ರಾವಣ ಪುತ್ರದಾ ಏಕಾದಶಿ', gu: 'શ્રાવણ પુત્રદા એકાદશી' },
  'Kamika Ekadashi': { ta: 'காமிகா ஏகாதசி', te: 'కామిక ఏకాదశి', bn: 'কামিকা একাদশী', kn: 'ಕಾಮಿಕಾ ಏಕಾದಶಿ', gu: 'કામિકા એકાદશી' },
  'Parsva Ekadashi': { ta: 'பார்ஸ்வ ஏகாதசி', te: 'పార్శ్వ ఏకాదశి', bn: 'পার্শ্ব একাদশী', kn: 'ಪಾರ್ಶ್ವ ಏಕಾದಶಿ', gu: 'પાર્શ્વ એકાદશી' },
  'Aja Ekadashi': { ta: 'அஜா ஏகாதசி', te: 'అజ ఏకాదశి', bn: 'অজা একাদশী', kn: 'ಅಜಾ ಏಕಾದಶಿ', gu: 'અજા એકાદશી' },
  'Papankusha Ekadashi': { ta: 'பாபாங்குசா ஏகாதசி', te: 'పాపాంకుశ ఏకాదశి', bn: 'পাপাঙ্কুশা একাদশী', kn: 'ಪಾಪಾಂಕುಶ ಏಕಾದಶಿ', gu: 'પાપાંકુશા એકાદશી' },
  'Indira Ekadashi': { ta: 'இந்திரா ஏகாதசி', te: 'ఇందిరా ఏకాదశి', bn: 'ইন্দিরা একাদশী', kn: 'ಇಂದಿರಾ ಏಕಾದಶಿ', gu: 'ઇન્દિરા એકાદશી' },
  'Devutthana Ekadashi': { ta: 'தேவுத்தான ஏகாதசி', te: 'దేవోత్థాన ఏకాదశి', bn: 'দেবোত্থান একাদশী', kn: 'ದೇವೋತ್ಥಾನ ಏಕಾದಶಿ', gu: 'દેવઉત્થાન એકાદશી' },
  'Rama Ekadashi': { ta: 'ரமா ஏகாதசி', te: 'రమా ఏకాదశి', bn: 'রমা একাদশী', kn: 'ರಮಾ ಏಕಾದಶಿ', gu: 'રમા એકાદશી' },
  'Mokshada Ekadashi': { ta: 'மோக்ஷதா ஏகாதசி', te: 'మోక్షద ఏకాదశి', bn: 'মোক্ষদা একাদশী', kn: 'ಮೋಕ್ಷದಾ ಏಕಾದಶಿ', gu: 'મોક્ષદા એકાદશી' },
  'Utpanna Ekadashi': { ta: 'உத்பன்னா ஏகாதசி', te: 'ఉత్పన్న ఏకాదశి', bn: 'উৎপন্না একাদশী', kn: 'ಉತ್ಪನ್ನಾ ಏಕಾದಶಿ', gu: 'ઉત્પન્ના એકાદશી' },
  'Putrada Ekadashi': { ta: 'புத்ரதா ஏகாதசி', te: 'పుత్రదా ఏకాదశి', bn: 'পুত্রদা একাদশী', kn: 'ಪುತ್ರದಾ ಏಕಾದಶಿ', gu: 'પુત્રદા એકાદશી' },
  'Safala Ekadashi': { ta: 'சபலா ஏகாதசி', te: 'సఫల ఏకాదశి', bn: 'সফলা একাদশী', kn: 'ಸಫಲಾ ಏಕಾದಶಿ', gu: 'સફલા એકાદશી' },
  'Jaya Ekadashi': { ta: 'ஜயா ஏகாதசி', te: 'జయ ఏకాదశి', bn: 'জয়া একাদশী', kn: 'ಜಯಾ ಏಕಾದಶಿ', gu: 'જયા એકાદશી' },
  'Shattila Ekadashi': { ta: 'ஷட்டில ஏகாதசி', te: 'షట్తిల ఏకాదశి', bn: 'ষটতিলা একাদশী', kn: 'ಷಟ್ಟಿಲ ಏಕಾದಶಿ', gu: 'ષટતિલા એકાદશી' },
  'Amalaki Ekadashi': { ta: 'ஆமலகி ஏகாதசி', te: 'ఆమలకి ఏకాదశి', bn: 'আমলকী একাদশী', kn: 'ಆಮಲಕಿ ಏಕಾದಶಿ', gu: 'આમલકી એકાદશી' },
  'Vijaya Ekadashi': { ta: 'விஜயா ஏகாதசி', te: 'విజయ ఏకాదశి', bn: 'বিজয়া একাদশী', kn: 'ವಿಜಯಾ ಏಕಾದಶಿ', gu: 'વિજયા એકાદશી' },
  'Padmini Ekadashi': { ta: 'பத்மினி ஏகாதசி', te: 'పద్మిని ఏకాదశి', bn: 'পদ্মিনী একাদশী', kn: 'ಪದ್ಮಿನಿ ಏಕಾದಶಿ', gu: 'પદ્મિની એકાદશી' },
  'Parama Ekadashi': { ta: 'பரமா ஏகாதசி', te: 'పరమ ఏకాదశి', bn: 'পরমা একাদশী', kn: 'ಪರಮಾ ಏಕಾದಶಿ', gu: 'પરમા એકાદશી' },
};

function escSingle(s) {
  return s.replace(/'/g, "\\'");
}

// Process single-line Trilingual: { en: '...', hi: '...', sa: '...' }
src = src.replace(
  /\{\s*en:\s*'((?:[^'\\]|\\.)*)'\s*,\s*hi:\s*'((?:[^'\\]|\\.)*)'\s*,\s*sa:\s*'((?:[^'\\]|\\.)*)'\s*\}/g,
  (full, en, hi, sa) => {
    const mr = hi;
    const mai = hi;
    const lookup = nameLookup[en];
    if (lookup) {
      return `{ en: '${en}', hi: '${hi}', sa: '${sa}', ta: '${escSingle(lookup.ta)}', te: '${escSingle(lookup.te)}', bn: '${escSingle(lookup.bn)}', kn: '${escSingle(lookup.kn)}', gu: '${escSingle(lookup.gu)}', mr: '${mr}', mai: '${mai}' }`;
    }
    return `{ en: '${en}', hi: '${hi}', sa: '${sa}', mr: '${mr}', mai: '${mai}' }`;
  }
);

// ═══ STEP 2: Handle multi-line Trilingual objects ═══
// Pattern: lines with en: '...', then hi: '...', then sa: '...',  then },
// We need to add mr/mai after sa line

// Split into lines and process
const lines = src.split('\n');
const result = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  result.push(line);

  // Check if this is a sa: line in a multi-line Trilingual (followed by } on next line or as closing)
  const saMatch = line.match(/^(\s+)sa:\s*'((?:[^'\\]|\\.)*)'\s*,?\s*$/);
  if (saMatch) {
    const indent = saMatch[1];
    // Look backwards for hi: line
    let hiContent = '';
    for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
      const hiMatch = lines[j].match(/^\s+hi:\s*'((?:[^'\\]|\\.)*)'\s*,\s*$/);
      if (hiMatch) {
        hiContent = hiMatch[1];
        break;
      }
    }
    if (hiContent) {
      result.push(`${indent}mr: '${hiContent}',`);
      result.push(`${indent}mai: '${hiContent}',`);
    }
  }
}

const output = result.join('\n');
fs.writeFileSync(inputFile, output, 'utf-8');

// Count
const enCount = (output.match(/\ben:\s*'/g) || []).length;
const mrCount = (output.match(/\bmr:\s*'/g) || []).length;
const taCount = (output.match(/\bta:\s*'/g) || []).length;
console.log(`en: ${enCount}, mr: ${mrCount}, ta: ${taCount}`);
console.log('Done!');
