'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import BirthForm from '@/components/kundali/BirthForm';
import KPTab from '@/components/kundali/KPTab';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { BirthData } from '@/types/kundali';
import type { Locale, LocaleText } from '@/types/panchang';
import { lt } from '@/lib/learn/translations';
import MSG from '@/messages/pages/kp-system.json';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

// Page-level translations (title, subtitle, desc only -- results rendering is in KPTab)
const T: Record<string, { title: string; subtitle: string; desc: string }> = {
  en: {
    title: 'KP System',
    subtitle: 'Krishnamurti Paddhati \u2014 Sub-Lord Analysis',
    desc: 'Placidus house system with the 249 sub-lord table. Each degree has a Sign Lord, Star Lord, and Sub Lord for precise event prediction.',
  },
  hi: {
    title: '\u0915\u0947\u092a\u0940 \u092a\u0926\u094d\u0927\u0924\u093f',
    subtitle: '\u0915\u0943\u0937\u094d\u0923\u092e\u0942\u0930\u094d\u0924\u093f \u092a\u0926\u094d\u0927\u0924\u093f \u2014 \u0909\u092a-\u0938\u094d\u0935\u093e\u092e\u0940 \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923',
    desc: '\u092a\u094d\u0932\u0947\u0938\u093f\u0921\u0938 \u092d\u093e\u0935 \u092a\u0926\u094d\u0927\u0924\u093f \u0914\u0930 249 \u0909\u092a-\u0938\u094d\u0935\u093e\u092e\u0940 \u0924\u093e\u0932\u093f\u0915\u093e\u0964 \u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u0905\u0902\u0936 \u0915\u093e \u0930\u093e\u0936\u093f \u0938\u094d\u0935\u093e\u092e\u0940, \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0938\u094d\u0935\u093e\u092e\u0940 \u0914\u0930 \u0909\u092a-\u0938\u094d\u0935\u093e\u092e\u0940\u0964',
  },
  sa: {
    title: '\u0915\u0947\u092a\u0940 \u092a\u0926\u094d\u0927\u0924\u093f\u0903',
    subtitle: '\u0915\u0943\u0937\u094d\u0923\u092e\u0942\u0930\u094d\u0924\u093f\u092a\u0926\u094d\u0927\u0924\u093f\u0903 \u2014 \u0909\u092a\u0938\u094d\u0935\u093e\u092e\u093f\u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923\u092e\u094d',
    desc: '\u092a\u094d\u0932\u0947\u0938\u093f\u0921\u0938\u092d\u093e\u0935\u092a\u0926\u094d\u0927\u0924\u093f\u0903 249 \u0909\u092a\u0938\u094d\u0935\u093e\u092e\u093f\u0938\u093e\u0930\u0923\u0940 \u091a\u0964',
  },
  ta: {
    title: '\u0b95\u0bc7.\u0baa\u0bbf. \u0bae\u0bc1\u0bb1\u0bc8',
    subtitle: '\u0b95\u0bbf\u0bb0\u0bc1\u0bb7\u0bcd\u0ba3\u0bae\u0bc2\u0bb0\u0bcd\u0ba4\u0bcd\u0ba4\u0bbf \u0baa\u0ba4\u0bcd\u0ba4\u0ba4\u0bbf \u2014 \u0b89\u0baa \u0b85\u0ba4\u0bbf\u0baa\u0ba4\u0bbf \u0baa\u0b95\u0bc1\u0baa\u0bcd\u0baa\u0bbe\u0baf\u0bcd\u0bb5\u0bc1',
    desc: '249 \u0b89\u0baa \u0b85\u0ba4\u0bbf\u0baa\u0ba4\u0bbf \u0b85\u0b9f\u0bcd\u0b9f\u0bb5\u0ba3\u0bc8\u0baf\u0bc1\u0b9f\u0ba9\u0bcd \u0b95\u0bc2\u0b9f\u0bbf\u0baf \u0baa\u0bbf\u0bb3\u0bbe\u0b9a\u0bbf\u0b9f\u0bb8\u0bcd \u0baa\u0bbe\u0bb5 \u0bae\u0bc1\u0bb1\u0bc8.',
  },
  bn: {
    title: '\u0995\u09c7\u09aa\u09bf \u09aa\u09a6\u09cd\u09a7\u09a4\u09bf',
    subtitle: '\u0995\u09c3\u09b7\u09cd\u09a3\u09ae\u09c2\u09b0\u09cd\u09a4\u09bf \u09aa\u09a6\u09cd\u09a7\u09a4\u09bf \u2014 \u0989\u09aa-\u0985\u09a7\u09bf\u09aa\u09a4\u09bf \u09ac\u09bf\u09b6\u09cd\u09b2\u09c7\u09b7\u09a3',
    desc: '249 \u0989\u09aa-\u0985\u09a7\u09bf\u09aa\u09a4\u09bf \u09b8\u09be\u09b0\u09a3\u09c0 \u09b8\u09b9 \u09aa\u09cd\u09b2\u09be\u09b8\u09bf\u09a1\u09be\u09b8 \u09ad\u09be\u09ac \u09aa\u09a6\u09cd\u09a7\u09a4\u09bf\u0964',
  },
  te: {
    title: '\u0c15\u0c47\u0c2a\u0c40 \u0c2a\u0c26\u0c4d\u0c27\u0c24\u0c3f',
    subtitle: '\u0c15\u0c43\u0c37\u0c4d\u0c23\u0c2e\u0c42\u0c30\u0c4d\u0c24\u0c3f \u0c2a\u0c26\u0c4d\u0c27\u0c24\u0c3f \u2014 \u0c09\u0c2a \u0c05\u0c27\u0c3f\u0c2a\u0c24\u0c3f \u0c35\u0c3f\u0c36\u0c4d\u0c32\u0c47\u0c37\u0c23',
    desc: '249 \u0c09\u0c2a \u0c05\u0c27\u0c3f\u0c2a\u0c24\u0c3f \u0c2a\u0c1f\u0c4d\u0c1f\u0c3f\u0c15\u0c24\u0c4b \u0c2a\u0c4d\u0c32\u0c3e\u0c38\u0c3f\u0c21\u0c38\u0c4d \u0c2d\u0c3e\u0c35 \u0c2a\u0c26\u0c4d\u0c27\u0c24\u0c3f.',
  },
  kn: {
    title: '\u0c95\u0cc6\u0caa\u0cbf \u0caa\u0ca6\u0ccd\u0ca7\u0ca4\u0cbf',
    subtitle: '\u0c95\u0cc3\u0cb7\u0ccd\u0ca3\u0cae\u0cc2\u0cb0\u0ccd\u0ca4\u0cbf \u0caa\u0ca6\u0ccd\u0ca7\u0ca4\u0cbf \u2014 \u0c89\u0caa \u0c85\u0ca7\u0cbf\u0caa\u0ca4\u0cbf \u0cb5\u0cbf\u0cb6\u0ccd\u0cb2\u0cc7\u0cb7\u0ca3\u0cc6',
    desc: '249 \u0c89\u0caa \u0c85\u0ca7\u0cbf\u0caa\u0ca4\u0cbf \u0c95\u0ccb\u0cb7\u0ccd\u0c9f\u0c95\u0ca6\u0cca\u0c82\u0ca6\u0cbf\u0c97\u0cc6 \u0caa\u0ccd\u0cb2\u0cbe\u0cb8\u0cbf\u0ca1\u0cb8\u0ccd \u0cad\u0cbe\u0cb5 \u0caa\u0ca6\u0ccd\u0ca7\u0ca4\u0cbf.',
  },
  gu: {
    title: '\u0a95\u0ac7\u0aaa\u0ac0 \u0aaa\u0aa6\u0acd\u0aa7\u0aa4\u0abf',
    subtitle: '\u0a95\u0ac3\u0ab7\u0acd\u0aa3\u0aae\u0ac2\u0ab0\u0acd\u0aa4\u0abf \u0aaa\u0aa6\u0acd\u0aa7\u0aa4\u0abf \u2014 \u0a89\u0aaa \u0a85\u0aa7\u0abf\u0aaa\u0aa4\u0abf \u0ab5\u0abf\u0ab6\u0acd\u0ab2\u0ac7\u0ab7\u0aa3',
    desc: '249 \u0a89\u0aaa \u0a85\u0aa7\u0abf\u0aaa\u0aa4\u0abf \u0a95\u0acb\u0ab7\u0acd\u0a9f\u0a95 \u0ab8\u0abe\u0aa5\u0ac7 \u0aaa\u0acd\u0ab2\u0ac7\u0ab8\u0abf\u0aa1\u0ab8 \u0aad\u0abe\u0ab5 \u0aaa\u0aa6\u0acd\u0aa7\u0aa4\u0abf.',
  },
  mr: {
    title: '\u0915\u0947\u092a\u0940 \u092a\u0926\u094d\u0927\u0924\u0940',
    subtitle: '\u0915\u0943\u0937\u094d\u0923\u092e\u0942\u0930\u094d\u0924\u0940 \u092a\u0926\u094d\u0927\u0924\u0940 \u2014 \u0909\u092a-\u0938\u094d\u0935\u093e\u092e\u0940 \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923',
    desc: '249 \u0909\u092a-\u0938\u094d\u0935\u093e\u092e\u0940 \u0924\u0915\u094d\u0924\u094d\u092f\u093e\u0938\u0939 \u092a\u094d\u0932\u0947\u0938\u093f\u0921\u0938 \u092d\u093e\u0935 \u092a\u0926\u094d\u0927\u0924\u0940.',
  },
  mai: {
    title: '\u0915\u0947\u092a\u0940 \u092a\u0926\u094d\u0927\u0924\u093f',
    subtitle: '\u0915\u0943\u0937\u094d\u0923\u092e\u0942\u0930\u094d\u0924\u093f \u092a\u0926\u094d\u0927\u0924\u093f \u2014 \u0909\u092a-\u0938\u094d\u0935\u093e\u092e\u0940 \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923',
    desc: '249 \u0909\u092a-\u0938\u094d\u0935\u093e\u092e\u0940 \u0924\u093e\u0932\u093f\u0915\u093e\u0915 \u0938\u0902\u0917 \u092a\u094d\u0932\u0947\u0938\u093f\u0921\u0938 \u092d\u093e\u0935 \u092a\u0926\u094d\u0927\u0924\u093f\u0964',
  },
};

export default function KPSystemPage() {
  const locale = useLocale() as Locale;
  const learnLinks = getLearnLinksForTool('/kp-system');
  const isTamil = String(locale) === 'ta';
  const t = T[locale] || T.en;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  // Saved charts support
  const user = useAuthStore(s => s.user);
  const [savedCharts, setSavedCharts] = useState<Array<{ id: string; label: string; birth_data: BirthData }>>([]);
  const [currentBirthData, setCurrentBirthData] = useState<BirthData | null>(null);
  const [loading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase
      .from('saved_charts')
      .select('id, label, birth_data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data: charts, error }) => {
        if (error) {
          console.error('[kp-system] failed to fetch saved charts:', error);
          return;
        }
        if (charts) setSavedCharts(charts as Array<{ id: string; label: string; birth_data: BirthData }>);
      });
  }, [user]);

  const handleGenerate = (birthData: BirthData) => {
    setCurrentBirthData(birthData);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t.title}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto" style={bodyFont}>{t.desc}</p>
      </motion.div>

      {/* KP Intro */}
      <InfoBlock
        id="kp-intro"
        title={msg('infoBlockTitle', locale)}
        defaultOpen={false}
      >
        {isDevanagari ? (
          <p>
            {'\u0915\u0943\u0937\u094d\u0923\u092e\u0942\u0930\u094d\u0924\u093f \u092a\u0926\u094d\u0927\u0924\u093f (KP) \u0935\u0948\u0926\u093f\u0915 \u091c\u094d\u092f\u094b\u0924\u093f\u0937 \u0915\u093e \u090f\u0915 \u0906\u0927\u0941\u0928\u093f\u0915 \u092a\u0930\u093f\u0937\u094d\u0915\u0930\u0923 \u0939\u0948\u0964 \u092f\u0939 \u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0915\u094b \'\u0909\u092a-\u0938\u094d\u0935\u093e\u092e\u0940\' \u0928\u093e\u092e\u0915 9 \u0909\u092a\u0916\u0902\u0921\u094b\u0902 \u092e\u0947\u0902 \u0935\u093f\u092d\u093e\u091c\u093f\u0924 \u0915\u0930\u0924\u093e \u0939\u0948, \u091c\u093f\u0938\u0938\u0947 \u092c\u0939\u0941\u0924 \u0938\u091f\u0940\u0915 \u092d\u0935\u093f\u0937\u094d\u092f\u0935\u093e\u0923\u0940 \u0938\u0902\u092d\u0935 \u0939\u094b\u0924\u0940 \u0939\u0948\u0964 \u091c\u0939\u093e\u0902 \u092a\u093e\u0930\u0902\u092a\u0930\u093f\u0915 \u091c\u094d\u092f\u094b\u0924\u093f\u0937 \u0915\u0939\u0924\u093e \u0939\u0948 \'\u0915\u0930\u093f\u092f\u0930 \u0915\u0947 \u0932\u093f\u090f \u0936\u0941\u092d\', \u0935\u0939\u0940\u0902 KP \u092c\u0924\u093e \u0938\u0915\u0924\u093e \u0939\u0948 \'15-22 \u092e\u093e\u0930\u094d\u091a \u0915\u0947 \u092c\u0940\u091a \u092a\u0926\u094b\u0928\u094d\u0928\u0924\u093f \u0938\u0902\u092d\u0935\u0964\' \u092f\u0939 \u0935\u0948\u0926\u093f\u0915 \u0938\u093f\u0926\u094d\u0927\u093e\u0902\u0924\u094b\u0902 \u0915\u0947 \u0938\u093e\u0925 \u092a\u094d\u0932\u0947\u0938\u093f\u0921\u0938 \u092d\u093e\u0935 \u092a\u0926\u094d\u0927\u0924\u093f \u0915\u093e \u0909\u092a\u092f\u094b\u0917 \u0915\u0930\u0924\u093e \u0939\u0948\u0964'}
          </p>
        ) : (
          <p>
            Krishnamurti Paddhati (KP) is a modern refinement of Vedic astrology. It divides each nakshatra into 9 sub-divisions called &apos;sub-lords&apos;, giving much more precise predictions. While traditional astrology tells you &apos;good for career&apos;, KP can pinpoint &apos;promotion likely between March 15{'\u2013'}22.&apos; It uses the Placidus house system with Vedic principles.
          </p>
        )}
      </InfoBlock>

      {/* Saved charts picker */}
      {savedCharts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-gold-light text-sm font-bold mb-3" style={headingFont}>
            {locale === 'en' || isTamil
              ? 'Your Saved Charts \u2014 click to generate KP analysis'
              : '\u0906\u092a\u0915\u0940 \u0938\u0939\u0947\u091c\u0940 \u0915\u0941\u0923\u094d\u0921\u0932\u093f\u092f\u093e\u0901 \u2014 KP \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923 \u0915\u0947 \u0932\u093f\u090f \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0947\u0902'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {savedCharts.map(chart => (
              <button
                key={chart.id}
                onClick={() => handleGenerate(chart.birth_data)}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 hover:border-gold-primary/40 p-3 text-left transition-colors"
              >
                <div className="text-gold-light text-sm font-bold truncate">{chart.label || chart.birth_data.name}</div>
                <div className="text-text-secondary text-xs">{chart.birth_data.date} {chart.birth_data.time}</div>
                {chart.birth_data.relationship && chart.birth_data.relationship !== 'self' && (
                  <div className="text-xs text-cyan-400/60 mt-1">{chart.birth_data.relationship}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Birth form -- uses the shared BirthForm component */}
      <BirthForm
        onSubmit={(birthData) => handleGenerate(birthData)}
        loading={loading}
      />

      {/* KP Results via shared KPTab component */}
      {currentBirthData && (
        <div className="mt-8">
          <GoldDivider className="mb-8" />
          <KPTab birthData={currentBirthData} locale={locale} />
        </div>
      )}

      <RelatedLinks type="learn" links={learnLinks} locale={locale} />
    </div>
  );
}
