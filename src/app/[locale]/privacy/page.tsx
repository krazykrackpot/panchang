import type { Metadata } from 'next';

const LABELS = {
  en: {
    title: 'Privacy Policy',
    subtitle: 'Your privacy matters to us',
    lastUpdated: 'Last updated: April 11, 2026',
    sections: [
      {
        heading: '1. Introduction',
        content: `Welcome to Dekho Panchang ("we", "us", or "our"), accessible at dekhopanchang.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Vedic astrology web application. By using Dekho Panchang, you consent to the data practices described in this policy.`,
      },
      {
        heading: '2. Information We Collect',
        content: `We collect the following categories of information:`,
        list: [
          'Account Information: Email address, name, and profile picture when you sign up via Google OAuth or email/password authentication.',
          'Birth Details: Date of birth, time of birth, and place of birth that you voluntarily provide for Kundali (birth chart) generation and astrological calculations.',
          'Location Data: Geographic coordinates (latitude/longitude) used for calculating accurate Panchang timings, sunrise/sunset, and location-specific astrological data. This is collected only when you explicitly provide or allow location access.',
          'Usage Data: Pages visited, features used, interaction patterns, and device/browser information collected automatically through standard web analytics.',
          'Payment Information: When you subscribe to paid plans, payment details are processed directly by Stripe (for USD transactions) or Razorpay (for INR transactions). We do not store your full credit card numbers or payment credentials on our servers.',
          'Communication Data: Email address used for transactional emails such as account verification, password resets, and subscription confirmations.',
        ],
      },
      {
        heading: '3. How We Use Your Information',
        content: `We use the information we collect for the following purposes:`,
        list: [
          'Generating personalized Kundali (birth charts), Panchang calculations, compatibility matching, and astrological interpretations.',
          'Providing Varshaphal (annual predictions), Dasha analysis, and other personalized astrological features.',
          'Authenticating your account and maintaining your session.',
          'Processing subscription payments and managing your account.',
          'Sending transactional emails (account verification, password reset, subscription updates).',
          'Improving our astronomical calculation accuracy and user experience.',
          'Displaying relevant advertisements through Google AdSense.',
          'Powering AI-assisted astrological interpretations and features.',
        ],
      },
      {
        heading: '4. Third-Party Services',
        content: `We use the following third-party services that may collect or process your data:`,
        list: [
          'Supabase: Authentication (Google OAuth, email/password) and PostgreSQL database hosting. Data is stored on Supabase servers with Row Level Security (RLS) enabled.',
          'Stripe: Payment processing for USD subscriptions. Stripe processes payment data under its own privacy policy (https://stripe.com/privacy).',
          'Razorpay: Payment processing for INR subscriptions. Razorpay processes payment data under its own privacy policy (https://razorpay.com/privacy/).',
          'Resend: Transactional email delivery for account verification and notifications.',
          'Vercel: Website hosting and serverless function execution. Vercel may collect standard access logs.',
          'Google AdSense: Advertising services. Google may use cookies and tracking technologies to serve personalized ads. See Google\'s privacy policy (https://policies.google.com/privacy).',
          'Anthropic (Claude AI): AI-powered astrological interpretation features. Input data sent to Anthropic is processed under their usage policy (https://www.anthropic.com/privacy).',
        ],
      },
      {
        heading: '5. Cookies and Local Storage',
        content: `We use the following browser storage mechanisms:`,
        list: [
          'Authentication Cookies: Session cookies managed by Supabase Auth to keep you signed in. These are essential for account functionality.',
          'Local Storage: We store your authentication session token (key: "dekho-panchang-auth"), location preferences, and chart style preferences in your browser\'s local storage.',
          'Third-Party Cookies: Google AdSense may set cookies for ad personalization and analytics. You can manage ad preferences at https://adssettings.google.com.',
          'No Tracking Cookies: We do not use our own tracking or analytics cookies beyond what is set by the third-party services listed above.',
        ],
      },
      {
        heading: '6. Data Retention',
        content: `We retain your data as follows:`,
        list: [
          'Account data (email, profile) is retained as long as your account is active.',
          'Birth chart data and saved Kundalis are retained as long as your account exists.',
          'Payment records are retained as required by applicable tax and financial regulations.',
          'If you delete your account, we will remove your personal data from our active databases within 30 days. Some data may persist in encrypted backups for up to 90 days.',
          'Anonymous, aggregated data (e.g., usage statistics) may be retained indefinitely as it cannot identify you.',
        ],
      },
      {
        heading: '7. Your Rights',
        content: `You have the following rights regarding your personal data:`,
        list: [
          'Access: You can request a copy of all personal data we hold about you.',
          'Correction: You can update your account information at any time through your profile settings.',
          'Deletion: You can request deletion of your account and all associated data by contacting us.',
          'Data Portability: You can request an export of your data in a machine-readable format.',
          'Withdraw Consent: You can withdraw consent for data processing at any time by deleting your account.',
          'Opt-Out of Ads: You can opt out of personalized advertising through Google\'s ad settings.',
        ],
      },
      {
        heading: '8. GDPR Compliance (European Users)',
        content: `If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have additional rights under the General Data Protection Regulation (GDPR):`,
        list: [
          'Legal Basis: We process your data based on consent (account creation, birth details), contract performance (subscription services), and legitimate interest (service improvement).',
          'Data Transfers: Your data may be transferred to and processed in countries outside the EEA. We ensure appropriate safeguards are in place for such transfers.',
          'Right to Lodge a Complaint: You have the right to lodge a complaint with your local data protection authority.',
          'Data Protection Officer: For GDPR-related inquiries, contact us at the email address listed below.',
        ],
      },
      {
        heading: '9. Data Security',
        content: `We implement appropriate technical and organizational measures to protect your personal data, including encryption in transit (HTTPS/TLS), Row Level Security (RLS) on our database ensuring users can only access their own data, secure authentication via Supabase with token-based sessions, and PCI-compliant payment processing through Stripe and Razorpay. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.`,
      },
      {
        heading: '10. Children\'s Privacy',
        content: `Dekho Panchang is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected data from a child under 13, we will take steps to delete such information promptly.`,
      },
      {
        heading: '11. Changes to This Policy',
        content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a revised "Last updated" date. Your continued use of Dekho Panchang after any changes constitutes acceptance of the updated policy.`,
      },
      {
        heading: '12. Contact Us',
        content: `If you have any questions about this Privacy Policy, your personal data, or wish to exercise any of your rights, please contact us at: privacy@dekhopanchang.com`,
      },
    ],
  },
  hi: {
    title: 'गोपनीयता नीति',
    subtitle: 'आपकी गोपनीयता हमारे लिए महत्वपूर्ण है',
    lastUpdated: 'अंतिम अपडेट: 11 अप्रैल 2026',
    sections: [
      {
        heading: '1. परिचय',
        content: `देखो पंचांग ("हम", "हमारा") में आपका स्वागत है, जो dekhopanchang.com पर उपलब्ध है। यह गोपनीयता नीति बताती है कि जब आप हमारे वैदिक ज्योतिष वेब एप्लिकेशन का उपयोग करते हैं तो हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं। देखो पंचांग का उपयोग करके, आप इस नीति में वर्णित डेटा प्रथाओं से सहमत होते हैं।`,
      },
      {
        heading: '2. हम कौन सी जानकारी एकत्र करते हैं',
        content: `हम निम्नलिखित श्रेणियों की जानकारी एकत्र करते हैं:`,
        list: [
          'खाता जानकारी: Google OAuth या ईमेल/पासवर्ड से साइन अप करते समय ईमेल पता, नाम और प्रोफ़ाइल चित्र।',
          'जन्म विवरण: कुण्डली निर्माण और ज्योतिषीय गणना के लिए आपके द्वारा स्वेच्छा से दी गई जन्म तिथि, जन्म समय और जन्म स्थान।',
          'स्थान डेटा: पंचांग समय, सूर्योदय/सूर्यास्त गणना के लिए भौगोलिक निर्देशांक।',
          'भुगतान जानकारी: सदस्यता भुगतान Stripe (USD) या Razorpay (INR) द्वारा संसाधित किए जाते हैं। हम आपके क्रेडिट कार्ड की पूरी जानकारी संग्रहीत नहीं करते।',
          'संचार डेटा: लेन-देन संबंधी ईमेल के लिए ईमेल पता।',
        ],
      },
      {
        heading: '3. हम आपकी जानकारी का उपयोग कैसे करते हैं',
        content: `हम एकत्रित जानकारी का उपयोग कुण्डली निर्माण, पंचांग गणना, अनुकूलता मिलान, वार्षिकफल, दशा विश्लेषण, खाता प्रमाणीकरण, सदस्यता भुगतान प्रसंस्करण, ईमेल सूचनाएं, सेवा सुधार, विज्ञापन प्रदर्शन और AI-सहायित ज्योतिषीय व्याख्या के लिए करते हैं।`,
      },
      {
        heading: '4. तृतीय-पक्ष सेवाएं',
        content: `हम Supabase (प्रमाणीकरण और डेटाबेस), Stripe और Razorpay (भुगतान), Resend (ईमेल), Vercel (होस्टिंग), Google AdSense (विज्ञापन), और Anthropic Claude (AI सुविधाएं) का उपयोग करते हैं। प्रत्येक सेवा की अपनी गोपनीयता नीति है।`,
      },
      {
        heading: '5. कुकीज़ और स्थानीय संग्रहण',
        content: `हम प्रमाणीकरण सत्र कुकीज़ (Supabase Auth), स्थानीय संग्रहण में सत्र टोकन और प्राथमिकताएं, और Google AdSense विज्ञापन कुकीज़ का उपयोग करते हैं। आप Google विज्ञापन सेटिंग्स में विज्ञापन वैयक्तिकरण प्रबंधित कर सकते हैं।`,
      },
      {
        heading: '6. डेटा अवधारण',
        content: `खाता डेटा आपके खाते के सक्रिय रहने तक रखा जाता है। खाता हटाने पर 30 दिनों के भीतर व्यक्तिगत डेटा हटा दिया जाता है। एन्क्रिप्टेड बैकअप में कुछ डेटा 90 दिनों तक बना रह सकता है।`,
      },
      {
        heading: '7. आपके अधिकार',
        content: `आपको अपने डेटा तक पहुंच, सुधार, हटाने, डेटा पोर्टेबिलिटी, सहमति वापस लेने और वैयक्तिकृत विज्ञापनों से बाहर निकलने का अधिकार है।`,
      },
      {
        heading: '8. GDPR अनुपालन (यूरोपीय उपयोगकर्ता)',
        content: `यदि आप यूरोपीय आर्थिक क्षेत्र (EEA) में हैं, तो आपके पास GDPR के तहत अतिरिक्त अधिकार हैं, जिसमें शिकायत दर्ज करने का अधिकार और डेटा स्थानांतरण सुरक्षा शामिल है।`,
      },
      {
        heading: '9. डेटा सुरक्षा',
        content: `हम HTTPS/TLS एन्क्रिप्शन, Row Level Security (RLS), सुरक्षित प्रमाणीकरण और PCI-अनुपालक भुगतान प्रसंस्करण सहित उचित सुरक्षा उपाय लागू करते हैं।`,
      },
      {
        heading: '10. बच्चों की गोपनीयता',
        content: `देखो पंचांग 13 वर्ष से कम उम्र के बच्चों के लिए निर्देशित नहीं है। हम जानबूझकर 13 वर्ष से कम उम्र के बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते।`,
      },
      {
        heading: '11. इस नीति में परिवर्तन',
        content: `हम समय-समय पर इस नीति को अपडेट कर सकते हैं। किसी भी महत्वपूर्ण परिवर्तन की सूचना इस पृष्ठ पर दी जाएगी।`,
      },
      {
        heading: '12. संपर्क करें',
        content: `यदि आपके कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें: privacy@dekhopanchang.com`,
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale === 'hi' ? LABELS.hi : LABELS.en;
  return {
    title: l.title,
    description: l.subtitle,
    alternates: {
      canonical: `https://dekhopanchang.com/${locale}/privacy`,
      languages: {
        en: 'https://dekhopanchang.com/en/privacy',
        hi: 'https://dekhopanchang.com/hi/privacy',
      },
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale === 'hi' ? LABELS.hi : LABELS.en;

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10">
          <span className="text-purple-300 text-sm font-medium">{l.title}</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-gold-light to-purple-300 bg-clip-text text-transparent"
          style={{ fontFamily: locale === 'hi' ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
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
              style={{ fontFamily: locale === 'hi' ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
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
