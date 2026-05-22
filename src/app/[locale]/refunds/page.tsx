import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// Static text page — refresh weekly is fine; this is a legal/policy doc
// that changes only on deliberate edits.
export const revalidate = 604800;

const LABELS = {
  en: {
    title: 'Refund Policy',
    subtitle: 'How refunds and cancellations work for subscriptions and Brihaspati credits',
    lastUpdated: 'Last updated: May 22, 2026',
    sections: [
      {
        heading: '1. Summary',
        content:
          'Dekho Panchang offers refunds within a clearly bounded window. Subscriptions and one-time purchases (Brihaspati AI credits) follow distinct rules below. Refund requests are reviewed and processed within 5 business days. All refunds are returned to the original payment method via the original processor (Stripe for USD, Razorpay for INR).',
      },
      {
        heading: '2. Subscription Refunds (Pro and Jyotishi Tiers)',
        content: 'Subscriptions auto-renew at the end of each billing period. You may:',
        list: [
          'Cancel anytime through Account → Subscription. Cancellation takes effect at the end of the current billing period; you retain Pro / Jyotishi access until that date.',
          'Request a full refund within 7 days of a charge if you have not consumed paid-tier features. Email refunds@dekhopanchang.com with your account email and the charge date.',
          'Request a pro-rata refund for an annual plan if you cancel within the first 30 days. After 30 days, annual plans are non-refundable.',
          'For monthly plans, refunds are limited to the first 7 days of any given billing period.',
        ],
        extra:
          'Subscription refund decisions consider usage: a refund is typically declined if substantial paid features (AI calls, Premium PDF report downloads, Premium muhurta searches) have already been consumed.',
      },
      {
        heading: '3. Brihaspati AI Credit Refunds (One-Time Purchases)',
        content:
          'Brihaspati AI credits are pre-paid bundles used to ask the AI astrologer questions. They are a one-time, non-subscription purchase. Refund rules:',
        list: [
          'Full refund within 7 days of purchase if NO credits have been consumed.',
          'Partial refund (for unused credits) within 7 days of purchase, computed pro-rata against the bundle price.',
          'After 7 days, credit purchases are non-refundable.',
          'Credits do not expire; if you change your mind, your unused balance remains available indefinitely on your account.',
        ],
      },
      {
        heading: '4. Failed Charges, Duplicate Charges, Unauthorized Charges',
        content:
          'Refunds for these scenarios are not bound by the 7-day window. Contact refunds@dekhopanchang.com immediately and we will resolve within 5 business days:',
        list: [
          'Duplicate charges on your statement for the same purchase  –  full refund of the duplicate.',
          'Charges to a card you did not authorise (after you have notified your bank)  –  full refund pending bank confirmation.',
          'Service outages or computation errors that materially affected your purchased feature  –  case-by-case refund or credit.',
        ],
      },
      {
        heading: '5. How to Request a Refund',
        content: 'Email refunds@dekhopanchang.com with the following information:',
        list: [
          'The email address on your Dekho Panchang account.',
          'The date and amount of the charge.',
          'The Stripe receipt number or Razorpay payment ID (visible in the receipt email you received at purchase).',
          'A short reason for the refund request (optional, but helps us serve you better).',
        ],
        extra:
          'You will receive a response within 2 business days. Approved refunds settle to your original payment method within 5–10 business days, depending on the issuing bank.',
      },
      {
        heading: '6. Chargebacks',
        content:
          'If you initiate a chargeback through your bank without first contacting us, your Dekho Panchang account may be suspended pending resolution. We strongly prefer to resolve any billing issue directly  –  it is faster, and you keep your account in good standing. Email refunds@dekhopanchang.com first; we will almost always find an agreeable resolution.',
      },
      {
        heading: '7. Contact',
        content:
          'Refund requests, billing questions, or anything else: refunds@dekhopanchang.com. Legal queries: legal@dekhopanchang.com.',
      },
    ],
  },
  hi: {
    title: 'धन-वापसी नीति',
    subtitle: 'सदस्यता और बृहस्पति क्रेडिट के लिए धन-वापसी कैसे काम करती है',
    lastUpdated: 'अंतिम अपडेट: 22 मई, 2026',
    sections: [
      {
        heading: '1. सारांश',
        content:
          'देखो पंचांग एक स्पष्ट समय-सीमा के भीतर धन-वापसी प्रदान करता है। सदस्यता और एक-बार की खरीद (बृहस्पति AI क्रेडिट) के लिए अलग-अलग नियम लागू होते हैं। धन-वापसी अनुरोधों की समीक्षा 5 कार्यदिवसों के भीतर की जाती है। सभी धन-वापसी मूल भुगतान विधि पर मूल प्रोसेसर (USD के लिए Stripe, INR के लिए Razorpay) के माध्यम से लौटाई जाती है।',
      },
      {
        heading: '2. सदस्यता धन-वापसी (Pro एवं Jyotishi स्तर)',
        content: 'सदस्यता प्रत्येक बिलिंग अवधि के अन्त में स्वतः नवीनीकृत होती है। आप यह कर सकते हैं:',
        list: [
          'खाता → सदस्यता के माध्यम से किसी भी समय रद्द करें। रद्दीकरण वर्तमान बिलिंग अवधि के अन्त में प्रभावी होगा।',
          'यदि भुगतान-स्तर की सुविधाओं का उपयोग नहीं किया गया है, तो शुल्क के 7 दिनों के भीतर पूर्ण धन-वापसी का अनुरोध करें। refunds@dekhopanchang.com पर ईमेल करें।',
          'वार्षिक योजना के लिए, पहले 30 दिनों के भीतर रद्द करने पर अनुपातिक धन-वापसी। 30 दिनों के बाद वार्षिक योजना अप्रतिदेय है।',
          'मासिक योजना के लिए, धन-वापसी किसी भी बिलिंग अवधि के पहले 7 दिनों तक सीमित है।',
        ],
        extra:
          'धन-वापसी निर्णय उपयोग पर विचार करते हैं: यदि महत्वपूर्ण भुगतान-सुविधाओं (AI कॉल, PDF रिपोर्ट, मुहूर्त खोज) का उपयोग पहले ही हो चुका है, तो धन-वापसी अस्वीकार की जा सकती है।',
      },
      {
        heading: '3. बृहस्पति AI क्रेडिट धन-वापसी',
        content:
          'बृहस्पति AI क्रेडिट AI ज्योतिषी से प्रश्न पूछने के लिए पूर्व-भुगतान बंडल हैं। यह एक-बार की, गैर-सदस्यता खरीद है।',
        list: [
          'खरीद के 7 दिनों के भीतर पूर्ण धन-वापसी यदि कोई क्रेडिट उपयोग नहीं हुआ है।',
          'खरीद के 7 दिनों के भीतर अप्रयुक्त क्रेडिट के लिए आंशिक धन-वापसी।',
          '7 दिनों के बाद क्रेडिट खरीद अप्रतिदेय है।',
          'क्रेडिट समाप्त नहीं होते; अप्रयुक्त शेष राशि आपके खाते में अनिश्चित काल तक उपलब्ध रहेगी।',
        ],
      },
      {
        heading: '4. विफल शुल्क, डुप्लिकेट शुल्क, अनधिकृत शुल्क',
        content:
          'इन परिदृश्यों के लिए धन-वापसी 7-दिन की समय-सीमा से बाहर है। तुरंत refunds@dekhopanchang.com पर संपर्क करें:',
        list: [
          'एक ही खरीद के लिए डुप्लिकेट शुल्क  –  डुप्लिकेट की पूर्ण धन-वापसी।',
          'अनधिकृत कार्ड शुल्क (बैंक को सूचित करने के बाद)  –  बैंक पुष्टि के अधीन पूर्ण धन-वापसी।',
          'सेवा रुकावट या गणना त्रुटियाँ जिन्होंने आपकी खरीदी गई सुविधा को महत्वपूर्ण रूप से प्रभावित किया  –  केस-दर-केस।',
        ],
      },
      {
        heading: '5. धन-वापसी का अनुरोध कैसे करें',
        content: 'refunds@dekhopanchang.com पर निम्न जानकारी के साथ ईमेल करें:',
        list: [
          'आपके देखो पंचांग खाते का ईमेल पता।',
          'शुल्क की तारीख और राशि।',
          'Stripe रसीद संख्या या Razorpay भुगतान ID।',
          'धन-वापसी अनुरोध का संक्षिप्त कारण (वैकल्पिक)।',
        ],
        extra:
          'आपको 2 कार्यदिवसों के भीतर प्रतिक्रिया मिलेगी। अनुमोदित धन-वापसी 5–10 कार्यदिवसों के भीतर मूल भुगतान विधि पर निपटाई जाएगी।',
      },
      {
        heading: '6. चार्जबैक',
        content:
          'यदि आप पहले हमसे संपर्क किए बिना अपने बैंक के माध्यम से चार्जबैक शुरू करते हैं, तो आपका देखो पंचांग खाता निलंबित किया जा सकता है। हम किसी भी बिलिंग समस्या को सीधे हल करना पसंद करते हैं। पहले refunds@dekhopanchang.com पर ईमेल करें।',
      },
      {
        heading: '7. संपर्क',
        content:
          'धन-वापसी अनुरोध, बिलिंग प्रश्न: refunds@dekhopanchang.com। कानूनी प्रश्न: legal@dekhopanchang.com।',
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isHi = isDevanagariLocale(locale);
  return {
    title: isHi ? 'धन-वापसी नीति  –  देखो पंचांग' : 'Refund Policy  –  Dekho Panchang',
    description: isHi
      ? 'देखो पंचांग सदस्यता एवं बृहस्पति AI क्रेडिट के लिए धन-वापसी नीति। 7-दिन की समय-सीमा, स्पष्ट अनुरोध प्रक्रिया, Stripe + Razorpay समर्थन।'
      : 'Refund policy for Dekho Panchang subscriptions and Brihaspati AI credits. 7-day window, clear request process, Stripe + Razorpay support.',
    alternates: {
      canonical: `https://dekhopanchang.com/${locale}/refunds`,
      languages: {
        en: 'https://dekhopanchang.com/en/refunds',
        hi: 'https://dekhopanchang.com/hi/refunds',
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function RefundPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = isDevanagariLocale(locale) ? LABELS.hi : LABELS.en;
  const headingFont = {
    fontFamily: isDevanagariLocale(locale) ? 'var(--font-devanagari-heading)' : 'var(--font-heading)',
  };

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10">
          <span className="text-purple-300 text-sm font-medium">{l.title}</span>
        </div>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-gold-light to-purple-300 bg-clip-text text-transparent"
          style={headingFont}
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
            <h2 className="text-xl sm:text-2xl font-semibold text-gold-light mb-4" style={headingFont}>
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
        <p className="text-text-secondary/50 text-sm">Dekho Panchang &mdash; dekhopanchang.com</p>
      </div>
    </main>
  );
}
