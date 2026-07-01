'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from 'next-intl';
import { X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import {
  trackAuthResendShown,
  trackAuthResendClicked,
  trackAuthResendResult,
} from '@/lib/analytics';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Round 2 UI-11 — AuthModal renders for every locale (it's the conversion
// funnel's primary surface). The previous version hardcoded every label in
// English; a Maithili / Tamil / Bengali / etc user saw the most important
// form on the site in a language they don't read. Lesson J: render the
// user's locale; fall back to EN only when a regional copy is missing.
// Visible locales only. `sa` (Sanskrit) and `mr` (Marathi) are RETIRED;
// the middleware 301-redirects /sa/* and /mr/* to /en/*, so they never
// reach this component. The `COPY[locale] ?? COPY.en` fallback below
// renders English copy if any unexpected locale slips through (Lesson J).
// Gemini #161 — explicit doc.
type Locale = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'mai';

interface AuthCopy {
  signIn: string;
  createAccount: string;
  resetPassword: string;
  continueWithGoogle: string;
  or: string;
  useEmailInstead: string;
  forgotInstructions: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordsDoNotMatch: string;
  resetLinkSent: string;
  signupConfirmation: string;
  authError: string;
  loading: string;
  sendResetLink: string;
  forgotPassword: string;
  noAccount: string;
  signUp: string;
  haveAccount: string;
  backToSignIn: string;
  close: string;
  // Nudge shown when login fails with code=email_not_confirmed. The
  // user's account exists but they never clicked the confirmation link
  // (Gmail promotions tab is the usual reason). We surface a resend
  // affordance right at the point of frustration instead of leaving them
  // with an unexplained "Email not confirmed" error.
  unconfirmedNudge: string;
  resendConfirmation: string;
  resendSending: string;
  resendSent: string;
  // Shown inside the signup-success box alongside a Resend link. The
  // in-app nudge (login mode) catches unconfirmed users on their SECOND
  // visit. This prompt catches them on the FIRST visit — while they're
  // still on the modal, if the initial confirmation email doesn't land.
  didntReceiveIt: string;
}

const COPY: Record<Locale, AuthCopy> = {
  en: {
    signIn: 'Sign In',
    createAccount: 'Create Account',
    resetPassword: 'Reset Password',
    continueWithGoogle: 'Continue with Google',
    or: 'or',
    useEmailInstead: 'Use email instead',
    forgotInstructions: "Enter your email and we'll send you a link to reset your password.",
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    passwordsDoNotMatch: 'Passwords do not match',
    resetLinkSent: 'Password reset link sent to your email.',
    signupConfirmation: 'Check your email for a confirmation link to complete signup.',
    authError: 'Authentication service is not configured. Please try again later.',
    loading: 'Loading...',
    sendResetLink: 'Send Reset Link',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    haveAccount: 'Already have an account?',
    backToSignIn: 'Back to Sign In',
    close: 'Close',
    unconfirmedNudge: "Your email isn't confirmed yet. Didn't get the link?",
    resendConfirmation: 'Resend confirmation link',
    resendSending: 'Sending…',
    resendSent: 'Sent. Check your inbox (and the Promotions tab).',
    didntReceiveIt: "Didn't receive the email?",
  },
  hi: {
    signIn: 'साइन इन',
    createAccount: 'खाता बनाएँ',
    resetPassword: 'पासवर्ड रीसेट',
    continueWithGoogle: 'Google के साथ जारी रखें',
    or: 'या',
    useEmailInstead: 'ईमेल का उपयोग करें',
    forgotInstructions: 'अपना ईमेल दर्ज करें और हम आपको पासवर्ड रीसेट लिंक भेजेंगे।',
    name: 'नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड पुष्टि',
    passwordsDoNotMatch: 'पासवर्ड मेल नहीं खाते',
    resetLinkSent: 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेजा गया।',
    signupConfirmation: 'साइनअप पूरा करने के लिए अपने ईमेल पर पुष्टिकरण लिंक देखें।',
    authError: 'प्रमाणीकरण सेवा कॉन्फ़िगर नहीं है। बाद में पुनः प्रयास करें।',
    loading: 'लोड हो रहा है...',
    sendResetLink: 'रीसेट लिंक भेजें',
    forgotPassword: 'पासवर्ड भूल गए?',
    noAccount: 'क्या आपका खाता नहीं है?',
    signUp: 'साइन अप करें',
    haveAccount: 'क्या आपका पहले से खाता है?',
    backToSignIn: 'साइन इन पर वापस',
    close: 'बंद करें',
    unconfirmedNudge: 'आपकी ईमेल अभी तक पुष्टि नहीं हुई है। लिंक नहीं मिला?',
    resendConfirmation: 'पुष्टिकरण लिंक फिर से भेजें',
    resendSending: 'भेज रहे हैं…',
    resendSent: 'भेज दिया। अपना इनबॉक्स (और Promotions टैब) देखें।',
    didntReceiveIt: 'ईमेल नहीं मिला?',
  },
  ta: {
    signIn: 'உள்நுழைய',
    createAccount: 'கணக்கு உருவாக்கு',
    resetPassword: 'கடவுச்சொல் மீட்டமை',
    continueWithGoogle: 'Google உடன் தொடரவும்',
    or: 'அல்லது',
    useEmailInstead: 'மின்னஞ்சல் பயன்படுத்தவும்',
    forgotInstructions: 'உங்கள் மின்னஞ்சலை உள்ளிடவும், நாங்கள் கடவுச்சொல் மீட்டமைப்பு இணைப்பை அனுப்புவோம்.',
    name: 'பெயர்',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல்லை உறுதி செய்க',
    passwordsDoNotMatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
    resetLinkSent: 'கடவுச்சொல் மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டது.',
    signupConfirmation: 'பதிவை முடிக்க உங்கள் மின்னஞ்சலில் உறுதிப்படுத்தல் இணைப்பை சரிபார்க்கவும்.',
    authError: 'அங்கீகார சேவை கட்டமைக்கப்படவில்லை. பின்னர் முயற்சிக்கவும்.',
    loading: 'ஏற்றப்படுகிறது...',
    sendResetLink: 'மீட்டமை இணைப்பை அனுப்பு',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    noAccount: 'கணக்கு இல்லையா?',
    signUp: 'பதிவு செய்யவும்',
    haveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    backToSignIn: 'உள்நுழைய திரும்பு',
    close: 'மூடு',
    unconfirmedNudge: 'உங்கள் மின்னஞ்சல் இன்னும் உறுதிப்படுத்தப்படவில்லை. இணைப்பு கிடைக்கவில்லையா?',
    resendConfirmation: 'உறுதிப்படுத்தல் இணைப்பை மீண்டும் அனுப்பு',
    resendSending: 'அனுப்புகிறது…',
    resendSent: 'அனுப்பப்பட்டது. உங்கள் இன்பாக்ஸை (மற்றும் Promotions தாவலை) பார்க்கவும்.',
    didntReceiveIt: 'மின்னஞ்சல் கிடைக்கவில்லையா?',
  },
  te: {
    signIn: 'సైన్ ఇన్',
    createAccount: 'ఖాతా సృష్టించండి',
    resetPassword: 'పాస్‌వర్డ్ రీసెట్',
    continueWithGoogle: 'Googleతో కొనసాగించండి',
    or: 'లేదా',
    useEmailInstead: 'ఇమెయిల్ ఉపయోగించండి',
    forgotInstructions: 'మీ ఇమెయిల్‌ను నమోదు చేయండి, మేము పాస్‌వర్డ్ రీసెట్ లింక్ పంపుతాము.',
    name: 'పేరు',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    passwordsDoNotMatch: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు',
    resetLinkSent: 'పాస్‌వర్డ్ రీసెట్ లింక్ మీ ఇమెయిల్‌కు పంపబడింది.',
    signupConfirmation: 'సైనప్ పూర్తి చేయడానికి మీ ఇమెయిల్‌లో నిర్ధారణ లింక్ చూడండి.',
    authError: 'ప్రామాణీకరణ సేవ కాన్ఫిగర్ చేయబడలేదు. తర్వాత ప్రయత్నించండి.',
    loading: 'లోడ్ అవుతోంది...',
    sendResetLink: 'రీసెట్ లింక్ పంపండి',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    noAccount: 'ఖాతా లేదా?',
    signUp: 'సైన్ అప్',
    haveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    backToSignIn: 'సైన్ ఇన్‌కి తిరిగి',
    close: 'మూసివేయి',
    unconfirmedNudge: 'మీ ఇమెయిల్ ఇంకా నిర్ధారించబడలేదు. లింక్ రాలేదా?',
    resendConfirmation: 'నిర్ధారణ లింక్ మళ్లీ పంపండి',
    resendSending: 'పంపుతోంది…',
    resendSent: 'పంపబడింది. మీ ఇన్‌బాక్స్ (మరియు Promotions ట్యాబ్) చూడండి.',
    didntReceiveIt: 'ఇమెయిల్ రాలేదా?',
  },
  bn: {
    signIn: 'সাইন ইন',
    createAccount: 'অ্যাকাউন্ট তৈরি',
    resetPassword: 'পাসওয়ার্ড রিসেট',
    continueWithGoogle: 'Google দিয়ে চালিয়ে যান',
    or: 'অথবা',
    useEmailInstead: 'ইমেইল ব্যবহার করুন',
    forgotInstructions: 'আপনার ইমেল লিখুন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠাব।',
    name: 'নাম',
    email: 'ইমেল',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    passwordsDoNotMatch: 'পাসওয়ার্ড মিলছে না',
    resetLinkSent: 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেলে পাঠানো হয়েছে।',
    signupConfirmation: 'সাইনআপ সম্পূর্ণ করতে আপনার ইমেলে নিশ্চিতকরণ লিংক দেখুন।',
    authError: 'প্রমাণীকরণ সেবা কনফিগার নেই। পরে চেষ্টা করুন।',
    loading: 'লোড হচ্ছে...',
    sendResetLink: 'রিসেট লিংক পাঠান',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    noAccount: 'অ্যাকাউন্ট নেই?',
    signUp: 'সাইন আপ',
    haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    backToSignIn: 'সাইন ইনে ফিরুন',
    close: 'বন্ধ',
    unconfirmedNudge: 'আপনার ইমেল এখনো নিশ্চিত হয়নি। লিংক পাননি?',
    resendConfirmation: 'নিশ্চিতকরণ লিংক পুনরায় পাঠান',
    resendSending: 'পাঠানো হচ্ছে…',
    resendSent: 'পাঠানো হয়েছে। আপনার ইনবক্স (এবং Promotions ট্যাব) দেখুন।',
    didntReceiveIt: 'ইমেল পাননি?',
  },
  gu: {
    signIn: 'સાઇન ઇન',
    createAccount: 'એકાઉન્ટ બનાવો',
    resetPassword: 'પાસવર્ડ રીસેટ',
    continueWithGoogle: 'Google સાથે ચાલુ રાખો',
    or: 'અથવા',
    useEmailInstead: 'ઈમેઈલ વાપરો',
    forgotInstructions: 'તમારો ઇમેલ દાખલ કરો અને અમે પાસવર્ડ રીસેટ લિંક મોકલીશું.',
    name: 'નામ',
    email: 'ઇમેલ',
    password: 'પાસવર્ડ',
    confirmPassword: 'પાસવર્ડ ખાતરી કરો',
    passwordsDoNotMatch: 'પાસવર્ડ મેળ ખાતા નથી',
    resetLinkSent: 'પાસવર્ડ રીસેટ લિંક તમારા ઇમેલ પર મોકલવામાં આવી છે.',
    signupConfirmation: 'સાઇનઅપ પૂર્ણ કરવા તમારા ઇમેલમાં પુષ્ટિ લિંક જુઓ.',
    authError: 'પ્રમાણીકરણ સેવા કૉન્ફિગર નથી. પછી પ્રયાસ કરો.',
    loading: 'લોડ થઈ રહ્યું છે...',
    sendResetLink: 'રીસેટ લિંક મોકલો',
    forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
    noAccount: 'એકાઉન્ટ નથી?',
    signUp: 'સાઇન અપ',
    haveAccount: 'પહેલેથી એકાઉન્ટ છે?',
    backToSignIn: 'સાઇન ઇન પર પાછા',
    close: 'બંધ',
    unconfirmedNudge: 'તમારો ઇમેલ હજી પુષ્ટિ થયો નથી. લિંક નથી મળી?',
    resendConfirmation: 'પુષ્ટિકરણ લિંક ફરીથી મોકલો',
    resendSending: 'મોકલી રહ્યા છીએ…',
    resendSent: 'મોકલી દીધું. તમારો ઇનબોક્સ (અને Promotions ટૅબ) જુઓ.',
    didntReceiveIt: 'ઇમેલ ન મળી?',
  },
  kn: {
    signIn: 'ಸೈನ್ ಇನ್',
    createAccount: 'ಖಾತೆ ರಚಿಸಿ',
    resetPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ',
    continueWithGoogle: 'Google ಜೊತೆ ಮುಂದುವರಿಸಿ',
    or: 'ಅಥವಾ',
    useEmailInstead: 'ಇಮೇಲ್ ಬಳಸಿ',
    forgotInstructions: 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ, ನಾವು ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸುತ್ತೇವೆ.',
    name: 'ಹೆಸರು',
    email: 'ಇಮೇಲ್',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
    passwordsDoNotMatch: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ',
    resetLinkSent: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.',
    signupConfirmation: 'ಸೈನ್‌ಅಪ್ ಪೂರ್ಣಗೊಳಿಸಲು ನಿಮ್ಮ ಇಮೇಲ್‌ನಲ್ಲಿ ದೃಢೀಕರಣ ಲಿಂಕ್ ನೋಡಿ.',
    authError: 'ಪ್ರಮಾಣೀಕರಣ ಸೇವೆ ಕಾನ್ಫಿಗರ್ ಆಗಿಲ್ಲ. ನಂತರ ಪ್ರಯತ್ನಿಸಿ.',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    sendResetLink: 'ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿ',
    forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?',
    noAccount: 'ಖಾತೆ ಇಲ್ಲವೆ?',
    signUp: 'ಸೈನ್ ಅಪ್',
    haveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೆ?',
    backToSignIn: 'ಸೈನ್ ಇನ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    close: 'ಮುಚ್ಚಿ',
    unconfirmedNudge: 'ನಿಮ್ಮ ಇಮೇಲ್ ಇನ್ನೂ ದೃಢೀಕರಿಸಲಾಗಿಲ್ಲ. ಲಿಂಕ್ ಸಿಗಲಿಲ್ಲವೇ?',
    resendConfirmation: 'ದೃಢೀಕರಣ ಲಿಂಕ್ ಮತ್ತೆ ಕಳುಹಿಸಿ',
    resendSending: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…',
    resendSent: 'ಕಳುಹಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್ (ಮತ್ತು Promotions ಟ್ಯಾಬ್) ಪರಿಶೀಲಿಸಿ.',
    didntReceiveIt: 'ಇಮೇಲ್ ಸಿಗಲಿಲ್ಲವೇ?',
  },
  mai: {
    signIn: 'साइन इन',
    createAccount: 'खाता बनाउ',
    resetPassword: 'पासवर्ड रीसेट',
    continueWithGoogle: 'Google सँ जारी राखू',
    or: 'अथवा',
    useEmailInstead: 'ईमेल प्रयोग करू',
    forgotInstructions: 'अपन ईमेल दर्ज करू, हम पासवर्ड रीसेट लिंक पठाएब।',
    name: 'नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड पुष्टि',
    passwordsDoNotMatch: 'पासवर्ड मेल नहि खाइत अछि',
    resetLinkSent: 'पासवर्ड रीसेट लिंक अहाँक ईमेलपर पठाएल गेल।',
    signupConfirmation: 'साइनअप पूरा करबाक हेतु अपन ईमेलमे पुष्टिकरण लिंक देखू।',
    authError: 'प्रमाणीकरण सेवा कॉन्फ़िगर नहि अछि। बादमे प्रयास करू।',
    loading: 'लोड भऽ रहल अछि...',
    sendResetLink: 'रीसेट लिंक पठाउ',
    forgotPassword: 'पासवर्ड बिसरि गेलहुँ?',
    noAccount: 'खाता नहि अछि?',
    signUp: 'साइन अप करू',
    haveAccount: 'पहिनहि खाता अछि?',
    backToSignIn: 'साइन इनपर वापस',
    close: 'बंद',
    unconfirmedNudge: 'अहाँक ईमेल आब धरि पुष्टि नहि भेल। लिंक नहि भेटल?',
    resendConfirmation: 'पुष्टिकरण लिंक फेर सँ पठाउ',
    resendSending: 'पठाओल जा रहल अछि…',
    resendSent: 'पठा देलहुँ। अपन इनबॉक्स (आ Promotions टैब) देखू।',
    didntReceiveIt: 'ईमेल नहि भेटल?',
  },
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const localeRaw = useLocale();
  const locale = (localeRaw as Locale);
  const t = COPY[locale] ?? COPY.en;

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // Error `code` from the store (Supabase's AuthError.code). We only care
  // about `email_not_confirmed` — the trigger for the resend nudge.
  // Kept separate from `error` so the human-readable message and the
  // machine code don't get conflated at render time.
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, resendConfirmation, loading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLElement | null>(null);

  // Email form visibility — hidden by default in SIGNUP mode (where email
  // deliverability is the worst conversion path; 2-of-2 recent email signups
  // never confirmed despite Resend marking the confirmation as delivered —
  // emails landed in Gmail spam/promotions and got missed). Login mode keeps
  // it visible because existing email users still need to log in. Forgot
  // requires email by definition.
  //
  // React-idiomatic mode→state sync: track previous mode and reset
  // `showEmailForm` during render when mode changes. Avoids the useEffect
  // anti-pattern (extra render + visible flash) and stays correct under
  // strict-mode double-invocation. Per Gemini PR #730 HIGH.
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [prevMode, setPrevMode] = useState(mode);
  if (mode !== prevMode) {
    setPrevMode(mode);
    setShowEmailForm(mode !== 'signup');
    // Mode change wipes the transient resend UI — the nudge only makes
    // sense in login mode and only for the current email attempt.
    setErrorCode(undefined);
    setResendState('idle');
  }

  useEffect(() => {
    portalRef.current = document.body;
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Funnel — surface a `_shown` event when either resend touchpoint
  // first renders. State transitions (not renders) trigger these so a
  // single mount doesn't double-fire. `_clicked` and `_result` are
  // emitted from handleResend directly.
  useEffect(() => {
    if (errorCode === 'email_not_confirmed' && mode === 'login') {
      trackAuthResendShown({ surface: 'login_nudge' });
    }
  }, [errorCode, mode]);

  useEffect(() => {
    if (mode === 'signup' && successMsg) {
      trackAuthResendShown({ surface: 'signup_success' });
    }
  }, [mode, successMsg]);

  if (!isOpen || !mounted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setErrorCode(undefined);
    // A fresh submit invalidates any previous "sent" pill; the user
    // is trying a new credential pair, not continuing the last attempt.
    setResendState('idle');

    if (mode === 'signup' && password !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }

    try {
      if (mode === 'forgot') {
        const result = await resetPassword(email);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccessMsg(t.resetLinkSent);
        }
        return;
      }

      // Kept separate so TS can narrow the `code` field on the login
      // branch — signUp's return type doesn't carry `code`, and a
      // ternary widens it to `unknown`.
      if (mode === 'login') {
        const result = await signInWithEmail(email, password);
        if (result.error) {
          setError(result.error);
          // Only 'email_not_confirmed' triggers the nudge, but we
          // store whatever came back for future-proofing.
          setErrorCode(result.code);
          return;
        }
        onClose();
        return;
      }

      // At this point mode === 'signup' — 'forgot' returned earlier,
      // 'login' returned above.
      const result = await signUpWithEmail(email, password, name);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMsg(t.signupConfirmation);
      }
    } catch (err) {
      console.error('[AuthModal] Auth failed:', err);
      setError(t.authError);
    }
  }

  // Surface is inferred from context at call time: 'signup_success' when
  // the modal is on the post-signup screen (mode==='signup' + successMsg
  // set), 'login_nudge' otherwise. Passed through to analytics so the
  // shown / clicked / result events can be tied back to the same touchpoint.
  async function handleResend() {
    if (!email || resendState === 'sending') return;
    const surface: 'login_nudge' | 'signup_success' =
      mode === 'signup' && successMsg ? 'signup_success' : 'login_nudge';
    trackAuthResendClicked({ surface });
    setResendState('sending');
    const result = await resendConfirmation(email);
    if (result.error) {
      // Rate-limit vs generic error — Supabase surfaces 429s with a
      // message containing "rate limit" (or "wait X seconds"). We don't
      // parse it precisely; a coarse string match is good enough for
      // funnel analytics and won't get us wrong if Supabase changes copy.
      const isRateLimit = /rate.?limit|wait.*seconds/i.test(result.error);
      trackAuthResendResult({ surface, result: isRateLimit ? 'rate_limited' : 'error' });
      setError(result.error);
      setResendState('idle');
      return;
    }
    trackAuthResendResult({ surface, result: 'success' });
    setResendState('sent');
    // Clear the primary error so the "email not confirmed" line doesn't
    // sit next to the success pill — the resend replaces that state.
    setError('');
    setErrorCode(undefined);
  }

  const modal = (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-20 sm:pt-24 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          {mode === 'login' ? t.signIn : mode === 'signup' ? t.createAccount : t.resetPassword}
        </h2>

        {/* Google sign-in  –  hide in forgot mode */}
        {mode !== 'forgot' && (
          <>
            <button
              onClick={async () => {
                setError('');
                const result = await signInWithGoogle();
                if (result?.error) setError(result.error);
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gold-primary/20 rounded-xl text-text-primary hover:bg-gold-primary/10 transition-all mb-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t.continueWithGoogle}
            </button>

            {showEmailForm ? (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gold-primary/15" />
                <span className="text-text-secondary text-xs">{t.or}</span>
                <div className="flex-1 h-px bg-gold-primary/15" />
              </div>
            ) : (
              // Signup mode: collapsed email form behind a small link. Google
              // is the only visible CTA. Reduces signup abandonment from
              // missed confirmation emails (Gmail spam/promotions). Click
              // expands the email form inline.
              <div className="text-center mb-2">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="text-text-secondary/70 hover:text-gold-light transition-colors text-xs underline-offset-2 hover:underline"
                >
                  {t.useEmailInstead}
                </button>
              </div>
            )}
          </>
        )}

        {mode === 'forgot' && (
          <p className="text-text-secondary text-sm mb-6">{t.forgotInstructions}</p>
        )}

        {showEmailForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder={t.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/70 focus:border-gold-primary/40 focus:outline-none"
              aria-label={t.name}
            />
          )}
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/70 focus:border-gold-primary/40 focus:outline-none"
            aria-label={t.email}
          />
          {mode !== 'forgot' && (
            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/70 focus:border-gold-primary/40 focus:outline-none"
              aria-label={t.password}
            />
          )}
          {mode === 'signup' && (
            <input
              type="password"
              placeholder={t.confirmPassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/70 focus:border-gold-primary/40 focus:outline-none"
              aria-label={t.confirmPassword}
            />
          )}

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          {/* Unconfirmed-email nudge — sits between error and success
              region. Rendered only in login mode when the failure was
              specifically 'email_not_confirmed'. The user's account
              exists but the confirmation click never landed (usually
              Gmail Promotions). Resend uses Supabase's built-in
              per-email rate limit (default 60s). */}
          {errorCode === 'email_not_confirmed' && mode === 'login' && (
            <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <p className="text-amber-200 text-sm">{t.unconfirmedNudge}</p>
              {resendState === 'sent' ? (
                <p className="text-emerald-400 text-sm">{t.resendSent}</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendState === 'sending' || !email}
                  className="text-sm font-semibold text-gold-light hover:text-gold-primary underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resendState === 'sending' ? t.resendSending : t.resendConfirmation}
                </button>
              )}
            </div>
          )}
          {successMsg && (
            <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <p className="text-emerald-400 text-sm">{successMsg}</p>
              {/* On signup only, offer a first-visit resend affordance
                  next to the "check your email" message. If the initial
                  confirmation email doesn't land (Gmail Promotions
                  delay) the user has an escape hatch without closing
                  the modal. Not shown in forgot/reset — that flow has
                  its own resetPasswordForEmail retry via the form.
                  `resendState === 'sent'` swaps in the confirmation
                  pill so a successful resend doesn't leave two
                  redundant CTAs visible. */}
              {mode === 'signup' && email && (
                resendState === 'sent' ? (
                  <p className="text-emerald-400/80 text-xs">{t.resendSent}</p>
                ) : (
                  <p className="text-emerald-400/80 text-xs">
                    {t.didntReceiveIt}{' '}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendState === 'sending'}
                      className="text-gold-light hover:text-gold-primary underline underline-offset-2 disabled:opacity-50"
                    >
                      {resendState === 'sending' ? t.resendSending : t.resendConfirmation}
                    </button>
                  </p>
                )
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:from-gold-primary hover:to-gold-light transition-all duration-300 disabled:opacity-50"
          >
            {loading ? t.loading : mode === 'login' ? t.signIn : mode === 'signup' ? t.createAccount : t.sendResetLink}
          </button>
        </form>
        )}

        <div className="text-center text-text-secondary text-sm mt-6 space-y-2">
          {mode === 'login' && (
            <>
              <p>
                <button
                  onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                  className="text-text-secondary/75 hover:text-gold-light transition-colors text-xs"
                >
                  {t.forgotPassword}
                </button>
              </p>
              <p>
                {t.noAccount}{' '}
                <button
                  onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); setConfirmPassword(''); }}
                  className="text-gold-primary hover:text-gold-light transition-colors"
                >
                  {t.signUp}
                </button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p>
              {t.haveAccount}{' '}
              <button
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); setConfirmPassword(''); }}
                className="text-gold-primary hover:text-gold-light transition-colors"
              >
                {t.signIn}
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              <button
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className="text-gold-primary hover:text-gold-light transition-colors"
              >
                {t.backToSignIn}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, portalRef.current!);
}
