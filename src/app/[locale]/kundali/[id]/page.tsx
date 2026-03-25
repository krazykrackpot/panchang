'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Locale } from '@/types/panchang';

export default function KundaliResultPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/kundali" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {locale === 'en' ? 'Generate New Chart' : 'नई कुण्डली बनाएं'}
      </Link>

      <div className="glass-card rounded-xl p-12 text-center">
        <h1 className="text-3xl text-gold-gradient font-bold mb-4" style={{ fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}>
          {locale === 'en' ? 'Saved Charts Coming Soon' : 'सहेजी गई कुण्डलियाँ शीघ्र'}
        </h1>
        <p className="text-text-secondary">
          {locale === 'en'
            ? 'Chart results are currently displayed inline on the Kundali page. Database-backed saved charts will be available in a future update.'
            : 'कुण्डली परिणाम वर्तमान में कुण्डली पृष्ठ पर प्रदर्शित हैं। डेटाबेस आधारित सहेजी गई कुण्डलियाँ भविष्य के अपडेट में उपलब्ध होंगी।'}
        </p>
        <Link href="/kundali" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-lg hover:from-gold-primary hover:to-gold-light transition-all">
          {locale === 'en' ? 'Go to Kundali Generator' : 'कुण्डली निर्माता पर जाएं'}
        </Link>
      </div>
    </div>
  );
}
