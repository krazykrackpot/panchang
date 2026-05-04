'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import BeginnerNote from '@/components/learn/BeginnerNote';
import ClassicalReference from '@/components/learn/ClassicalReference';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/panchang-guide.json';
import { isIndicLocale, getBodyFont } from '@/lib/utils/locale-fonts';
import { Sun, Moon, Star, BookOpen, Clock, Calendar, MapPin } from 'lucide-react';

const t_ = LJ as unknown as Record<string, LocaleText>;

const FIVE_LIMBS = [
  { label: 'Tithi', hi: 'तिथि', icon: Moon, basis: 'Sun-Moon angle (12°)', desc: '30 per month' },
  { label: 'Nakshatra', hi: 'नक्षत्र', icon: Star, basis: 'Moon\'s constellation', desc: '27 total' },
  { label: 'Yoga', hi: 'योग', icon: Sun, basis: 'Sun + Moon longitudes', desc: '27 total' },
  { label: 'Karana', hi: 'करण', icon: BookOpen, basis: 'Half of a tithi', desc: '11 named types' },
  { label: 'Vara', hi: 'वार', icon: Calendar, basis: 'Weekday (sunrise)', desc: '7 days' },
];

export default function LearnPanchangGuidePage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  const isHi = isIndicLocale(locale);
  const bf = isHi ? getBodyFont(locale) || {} : {};

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary" style={bf}>{t('subtitle')}</p>
      </div>

      <KeyTakeaway locale={locale} points={[
        'Panchang means "five limbs" — Tithi, Nakshatra, Yoga, Karana, and Vara — computed from the Sun and Moon positions.',
        'The Vedic day begins at sunrise, not midnight — this is why Panchang requires your exact geographic location.',
        'Amanta and Purnimanta are two equally valid ways of counting lunar months — they differ only during Krishna Paksha.',
      ]} />

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Panchang" explanation="Sanskrit for 'five limbs' — the Vedic almanac providing five daily astronomical parameters" />
        <BeginnerNote term="Tithi" explanation="The lunar day — defined by the 12-degree angular distance between the Sun and Moon" />
        <BeginnerNote term="Paksha" explanation="A fortnight — Shukla (waxing, New to Full Moon) and Krishna (waning, Full to New Moon)" />
        <BeginnerNote term="Kshaya Tithi" explanation="A 'lost' tithi that starts and ends between two sunrises — not present on any Vedic day" />
      </div>

      {/* Intro */}
      <LessonSection title={isHi ? 'पंचांग क्या है?' : 'What is Panchang?'}>
        <p style={bf}>{t('intro')}</p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {FIVE_LIMBS.map((limb, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10 text-center">
              <limb.icon size={18} className="text-gold-primary" />
              <span className="text-text-primary text-sm font-medium">{isHi ? limb.hi : limb.label}</span>
              <span className="text-text-secondary text-[10px]">{limb.desc}</span>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Tithi */}
      <LessonSection number={1} title={t('tithiTitle')}>
        <p style={bf}>{t('tithiContent')}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Moon size={14} className="text-gold-primary" />
              <span className="text-gold-light text-sm font-semibold">{isHi ? 'शुक्ल पक्ष' : 'Shukla Paksha'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'प्रतिपदा → पूर्णिमा (15 तिथियाँ)' : 'Pratipada → Purnima (15 tithis)'}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Moon size={14} className="text-text-secondary" />
              <span className="text-gold-light text-sm font-semibold">{isHi ? 'कृष्ण पक्ष' : 'Krishna Paksha'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'प्रतिपदा → अमावस्या (15 तिथियाँ)' : 'Pratipada → Amavasya (15 tithis)'}</p>
          </div>
        </div>
      </LessonSection>

      {/* Nakshatra */}
      <LessonSection number={2} title={t('nakshatraTitle')}>
        <p style={bf}>{t('nakshatraContent')}</p>
      </LessonSection>

      {/* Yoga */}
      <LessonSection number={3} title={t('yogaTitle')}>
        <p style={bf}>{t('yogaContent')}</p>
        <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-gold-primary/10">
          <p className="text-gold-light text-xs font-mono">
            {isHi ? 'योग = (सूर्य देशान्तर + चन्द्र देशान्तर) ÷ 13°20\'' : 'Yoga = (Sun longitude + Moon longitude) ÷ 13°20\''}
          </p>
        </div>
      </LessonSection>

      {/* Karana */}
      <LessonSection number={4} title={t('karanaTitle')}>
        <p style={bf}>{t('karanaContent')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { name: 'Bava', hi: 'बव', type: 'chara' },
            { name: 'Balava', hi: 'बालव', type: 'chara' },
            { name: 'Kaulava', hi: 'कौलव', type: 'chara' },
            { name: 'Taitila', hi: 'तैतिल', type: 'chara' },
            { name: 'Gara', hi: 'गर', type: 'chara' },
            { name: 'Vanija', hi: 'वणिज', type: 'chara' },
            { name: 'Vishti', hi: 'विष्टि', type: 'bad' },
            { name: 'Shakuni', hi: 'शकुनि', type: 'sthira' },
            { name: 'Chatushpada', hi: 'चतुष्पद', type: 'sthira' },
            { name: 'Naga', hi: 'नाग', type: 'sthira' },
            { name: 'Kimsthughna', hi: 'किंस्तुघ्न', type: 'sthira' },
          ].map(k => (
            <span key={k.name} className={`px-2.5 py-1 rounded-lg text-xs border ${
              k.type === 'bad'
                ? 'bg-red-500/10 border-red-500/20 text-red-300'
                : k.type === 'sthira'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                : 'bg-white/[0.03] border-gold-primary/10 text-text-primary'
            }`}>
              {isHi ? k.hi : k.name}
            </span>
          ))}
        </div>
      </LessonSection>

      {/* Vara */}
      <LessonSection number={5} title={t('varaTitle')}>
        <p style={bf}>{t('varaContent')}</p>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {[
            { day: 'Sun', hi: 'रवि', planet: 'Sun' },
            { day: 'Mon', hi: 'सोम', planet: 'Moon' },
            { day: 'Tue', hi: 'मंगल', planet: 'Mars' },
            { day: 'Wed', hi: 'बुध', planet: 'Mercury' },
            { day: 'Thu', hi: 'गुरु', planet: 'Jupiter' },
            { day: 'Fri', hi: 'शुक्र', planet: 'Venus' },
            { day: 'Sat', hi: 'शनि', planet: 'Saturn' },
          ].map(v => (
            <div key={v.day} className="p-2 rounded-lg bg-white/[0.03] border border-gold-primary/8 text-center">
              <div className="text-gold-light text-xs font-bold">{isHi ? v.hi : v.day}</div>
              <div className="text-text-secondary text-[10px]">{v.planet}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Sunrise vs Midnight */}
      <LessonSection number={6} title={t('sunriseTitle')} variant="highlight">
        <p style={bf}>{t('sunriseContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sun size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'वैदिक (सूर्योदय)' : 'Vedic (Sunrise)'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'सूर्योदय पर सक्रिय तिथि पूरे दिन शासन करती है। स्थान-निर्भर।' : 'Tithi at sunrise governs the whole day. Location-dependent.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-text-secondary" />
              <span className="text-text-secondary font-semibold text-sm">{isHi ? 'ग्रेगोरियन (मध्यरात्रि)' : 'Gregorian (Midnight)'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'मध्यरात्रि 12:00 बजे दिन बदलता है। स्थान-स्वतन्त्र।' : 'Day changes at 12:00 AM. Location-independent.'}</p>
          </div>
        </div>
        <ClassicalReference shortName="Surya Siddhanta" chapter="The foundational text of Indian mathematical astronomy" />
      </LessonSection>

      {/* Amanta vs Purnimanta */}
      <LessonSection number={7} title={t('amantaPurnimantaTitle')}>
        <p style={bf}>{t('amantaPurnimantaContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'अमान्त (दक्षिण/पश्चिम)' : 'Amanta (South/West)'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'मास अमावस्या पर समाप्त। महाराष्ट्र, गुजरात, कर्नाटक, तमिलनाडु।' : 'Month ends on Amavasya. Maharashtra, Gujarat, Karnataka, Tamil Nadu.'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-gold-primary" />
              <span className="text-gold-light font-semibold text-sm">{isHi ? 'पूर्णिमान्त (उत्तर)' : 'Purnimanta (North)'}</span>
            </div>
            <p className="text-text-secondary text-xs">{isHi ? 'मास पूर्णिमा पर समाप्त। उत्तर प्रदेश, बिहार, मध्य प्रदेश।' : 'Month ends on Purnima. Uttar Pradesh, Bihar, Madhya Pradesh.'}</p>
          </div>
        </div>
      </LessonSection>

      {/* Daily Use */}
      <LessonSection number={8} title={t('dailyUseTitle')}>
        <p style={bf}>{t('dailyUseContent')}</p>
      </LessonSection>

      {/* Source */}
      <WhyItMatters locale={locale}>{t('sourceDisclaimer')}</WhyItMatters>

      {/* Explore Further */}
      <div className="mt-8">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'और जानें' : 'Explore Further'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/panchang', label: isHi ? 'आज का पंचांग' : 'Today\'s Panchang' },
            { href: '/learn/tithis', label: isHi ? 'तिथियाँ' : 'Tithis' },
            { href: '/learn/nakshatras', label: isHi ? 'नक्षत्र' : 'Nakshatras' },
            { href: '/learn/yogas', label: isHi ? 'योग' : 'Yogas' },
            { href: '/learn/karanas', label: isHi ? 'करण' : 'Karanas' },
            { href: '/learn/vara', label: isHi ? 'वार' : 'Vara (Weekdays)' },
            { href: '/learn/masa', label: isHi ? 'मास' : 'Masa (Months)' },
            { href: '/learn/muhurta-selection', label: isHi ? 'मुहूर्त चयन' : 'Muhurta Selection' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-gold-light border border-gold-primary/10 hover:border-gold-primary/25 hover:bg-gold-primary/5 transition-colors"
              style={bf}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
